/**
 * Meta Conversions API (CAPI) helper.
 *
 * This is the server-side twin of the browser Meta Pixel calls already firing
 * in app/layout.tsx, app/cart/page.tsx, app/product/[slug]/page.tsx and
 * context/cart-context.tsx.
 *
 * Sending the SAME event from both browser (fbq) and server (this file) with
 * the SAME `eventID` lets Meta de-duplicate them into a single event while
 * using whichever one has better match quality — which is almost always the
 * server one, because:
 *   - it can't be blocked by ad-blockers or iOS ITP the way the browser pixel can
 *   - it can attach hashed customer data (phone/name) that boosts Event Match
 *     Quality (EMQ), which is what was missing on this account (EMQ 6.1/10,
 *     Purchase event had no match-quality data at all).
 *
 * Env vars required (add to .env.local, and to Vercel project settings):
 *   META_PIXEL_ID              = 1837748180844681   (the "Kids essential" dataset)
 *   META_CAPI_ACCESS_TOKEN     = <generate in Events Manager → Settings → Conversions API>
 */

import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const GRAPH_API_VERSION = "v21.0";

/** Meta requires PII to be lowercased, trimmed, then SHA-256 hashed. */
function sha256(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

/** Normalizes an Indian 10-digit phone number to E.164 (+91XXXXXXXXXX) before hashing. */
function hashIndianPhone(rawPhone: string): string | undefined {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) return sha256(`91${digits}`);
  if (digits.length === 12 && digits.startsWith("91")) return sha256(digits);
  return undefined; // don't send malformed data — Meta rejects the whole event
}

export interface CapiCustomerData {
  phone?: string; // raw, un-hashed — this function hashes it
  name?: string; // used to derive first/last name hashes
  city?: string;
  zip?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string; // _fbp cookie, read on the client and passed through
  fbc?: string; // _fbc cookie, read on the client and passed through
}

export interface CapiEventInput {
  eventName: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";
  eventId: string; // MUST match the eventID used in the browser fbq() call for this same action
  eventSourceUrl: string;
  contentIds?: string[];
  contentType?: "product";
  contents?: { id: string; quantity: number; item_price: number }[];
  value?: number;
  currency?: string;
  numItems?: number;
  customerData: CapiCustomerData;
}

/**
 * Sends one event to Meta's Conversions API.
 * Never throws — tracking must never break checkout. Failures are logged and
 * swallowed so a Meta API outage can't block a customer's order.
 */
export async function sendCapiEvent(input: CapiEventInput): Promise<{ ok: boolean; error?: string }> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error(
      "[meta-capi] Missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN env vars — event not sent:",
      input.eventName
    );
    return { ok: false, error: "missing_env_vars" };
  }

  const userData: Record<string, string | string[]> = {};

  if (input.customerData.phone) {
    const hashedPhone = hashIndianPhone(input.customerData.phone);
    if (hashedPhone) userData.ph = [hashedPhone];
  }

  if (input.customerData.name) {
    const parts = input.customerData.name.trim().split(/\s+/);
    const first = parts[0];
    const last = parts.slice(1).join(" ");
    if (first) userData.fn = [sha256(first)];
    if (last) userData.ln = [sha256(last)];
  }

  if (input.customerData.city) userData.ct = [sha256(input.customerData.city)];
  if (input.customerData.zip) userData.zp = [sha256(input.customerData.zip)];
  if (input.customerData.clientIp) userData.client_ip_address = input.customerData.clientIp;
  if (input.customerData.userAgent) userData.client_user_agent = input.customerData.userAgent;
  if (input.customerData.fbp) userData.fbp = input.customerData.fbp;
  if (input.customerData.fbc) userData.fbc = input.customerData.fbc;

  const customData: Record<string, unknown> = {};
  if (input.contentIds) customData.content_ids = input.contentIds;
  if (input.contentType) customData.content_type = input.contentType;
  if (input.contents) customData.contents = input.contents;
  if (typeof input.value === "number") customData.value = input.value;
  if (input.currency) customData.currency = input.currency;
  if (typeof input.numItems === "number") customData.num_items = input.numItems;

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId, // must match the browser pixel's eventID for de-dup
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: customData,
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[meta-capi] Meta rejected ${input.eventName} event:`, errBody);
      return { ok: false, error: errBody };
    }

    return { ok: true };
  } catch (err) {
    console.error(`[meta-capi] Network error sending ${input.eventName}:`, err);
    return { ok: false, error: String(err) };
  }
}