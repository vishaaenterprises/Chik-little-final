import { NextRequest, NextResponse } from "next/server";
import { sendCapiEvent, CapiEventInput } from "@/lib/meta-capi";
import { checkRateLimit } from "@/lib/rate-limit";

const ALLOWED_EVENTS = ["PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Purchase"];
const ALLOWED_HOSTS = ["littlechiku.com", "www.littlechiku.com", "localhost"];

/**
 * POST /api/meta-capi
 *
 * Called from the client right alongside the existing window.fbq(...) calls
 * in app/cart/page.tsx, app/product/[slug]/page.tsx and context/cart-context.tsx.
 * Pass the SAME eventId used in the fbq() call so Meta de-duplicates browser +
 * server events into one.
 *
 * The client sends: eventName, eventId, eventSourceUrl, contentIds, contents,
 * value, currency, numItems, and whatever customer data is available at that
 * moment (phone/name from the checkout form, fbp/fbc cookies). This route adds
 * the visitor's real IP and User-Agent from the request itself — those should
 * never be trusted from the client.
 */
export async function POST(request: NextRequest) {
  // This endpoint is public and forwards to Meta with our access token, so
  // throttle it and only accept events for our own pages — otherwise anyone
  // could pollute the pixel dataset with fake events.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`meta-capi:${ip}`, 60, 60_000)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Omit<CapiEventInput, "customerData"> & {
    customerData?: CapiEventInput["customerData"];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.eventName || !body.eventId || !body.eventSourceUrl) {
    return NextResponse.json(
      { ok: false, error: "eventName, eventId, and eventSourceUrl are required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_EVENTS.includes(body.eventName)) {
    return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
  }
  try {
    if (!ALLOWED_HOSTS.includes(new URL(body.eventSourceUrl).hostname)) {
      return NextResponse.json({ ok: false, error: "invalid_source" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_source" }, { status: 400 });
  }

  // Real client IP: Vercel/most proxies set x-forwarded-for as "client, proxy1, proxy2"
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const result = await sendCapiEvent({
    ...body,
    customerData: {
      ...(body.customerData ?? {}),
      clientIp,
      userAgent,
    },
  });

  // Always 200 to the client — a CAPI failure must never surface as a checkout
  // error. The failure is logged server-side (see lib/meta-capi.ts) for you to
  // check in Vercel logs.
  return NextResponse.json(result);
}