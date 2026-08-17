import { NextRequest, NextResponse } from "next/server";
import { sendCapiEvent, CapiEventInput } from "@/lib/meta-capi";

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