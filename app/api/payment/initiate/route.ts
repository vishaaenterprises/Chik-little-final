// app/api/payment/initiate/route.ts
//
// POST body: { customer: { name, phone, address }, items: [...],
//              preferredMode: "UPI" | "CARD" | "NET_BANKING" }
//
// SECURITY NOTES:
// - `amount` is NEVER taken from the client. verifyCart() re-fetches every
//   item's real price from Sanity and computes the total itself — see
//   lib/verify-cart.ts. This is the fix for the #1 payment-gateway fraud
//   pattern: editing the request in devtools to pay less than the real
//   cart total.
// - Basic input validation (name/phone/address shape) so junk/oversized
//   payloads can't be used to abuse the endpoint or PhonePe's API.
// - A simple per-IP rate limit on order creation — stops one visitor from
//   flooding PhonePe (and your logs) with thousands of orders.
//
// UX NOTE: `preferredMode` is passed straight through to PhonePe as a
// paymentModeConfig filter (see lib/phonepe-rest.ts) so the embedded
// PayPage shows only the instrument the user selected on our own
// "Choose Payment Method" screen — no card numbers or CVVs are ever
// collected on our own page (that would require PCI-DSS certification);
// they're entered inside PhonePe's own secure, embedded PayPage iframe.

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { initiatePhonePePayment, type PreferredMode } from "@/lib/phonepe-rest";
import { verifyCart, type CartItemInput } from "@/lib/verify-cart";
import { pendingOrders } from "@/lib/order-store";
import { checkRateLimit } from "@/lib/rate-limit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface InitiateBody {
  customer: { name: string; phone: string; address: string };
  items: CartItemInput[];
  shipping?: number;
  preferredMode: PreferredMode;
}

const PHONE_RE = /^[6-9]\d{9}$/;
const VALID_MODES: PreferredMode[] = ["UPI", "CARD", "NET_BANKING"];

export async function POST(request: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`payment-initiate:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: InitiateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!VALID_MODES.includes(body.preferredMode)) {
    return NextResponse.json({ ok: false, error: "Invalid payment mode" }, { status: 400 });
  }

  // ── Input validation ─────────────────────────────────────────────────
  const name = String(body.customer?.name || "").trim();
  const phone = String(body.customer?.phone || "").trim();
  const address = String(body.customer?.address || "").trim();

  if (!name || name.length > 100) {
    return NextResponse.json({ ok: false, error: "Enter a valid name" }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ ok: false, error: "Enter a valid 10-digit phone number" }, { status: 400 });
  }
  if (!address || address.length > 500) {
    return NextResponse.json({ ok: false, error: "Enter a valid address" }, { status: 400 });
  }

  // ── Price/stock verification (never trust client totals) ────────────
  const verification = await verifyCart(body.items, body.shipping ?? 0);
  if (!verification.ok || !verification.verifiedTotal) {
    return NextResponse.json(
      { ok: false, error: verification.error || "Could not verify cart" },
      { status: 400 }
    );
  }

  const amountInPaise = Math.round(verification.verifiedTotal * 100);
  if (amountInPaise < 100) {
    // PhonePe's own minimum (₹1) — also catches a verifiedTotal of 0.
    return NextResponse.json({ ok: false, error: "Order amount too low" }, { status: 400 });
  }

  const merchantOrderId = `LC${Date.now()}${randomUUID().slice(0, 6)}`;

  pendingOrders.set(merchantOrderId, {
    amount: verification.verifiedTotal,
    customer: { name, phone, address },
    items: body.items,
    status: "PENDING",
    createdAt: Date.now(),
  });

  try {
    const result = await initiatePhonePePayment({
      merchantOrderId,
      amountInPaise,
      redirectUrl: `${SITE_URL}/payment/status?orderId=${merchantOrderId}`,
      preferredMode: body.preferredMode,
    });

    return NextResponse.json({
      ok: true,
      merchantOrderId,
      redirectUrl: result.redirectUrl, // also doubles as the iframe tokenUrl
    });
  } catch (err) {
    console.error("[phonepe:initiate] failed", err);
    pendingOrders.delete(merchantOrderId);
    return NextResponse.json(
      { ok: false, error: "phonepe_initiate_failed" },
      { status: 502 }
    );
  }
}