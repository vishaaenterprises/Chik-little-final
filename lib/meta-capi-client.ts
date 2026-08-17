"use client";

/**
 * Client-side companion to lib/meta-capi.ts.
 *
 * Call `sendCapiEventFromClient(...)` right next to every existing
 * `window.fbq('track', ...)` call, passing the SAME eventID/eventId so Meta
 * de-duplicates the browser and server events.
 *
 * This does NOT replace the fbq() calls — keep those. This just adds the
 * server-side copy that survives ad-blockers and carries better match data.
 */

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

interface SendCapiEventFromClientArgs {
  eventName: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";
  eventId: string;
  contentIds?: string[];
  contentType?: "product";
  contents?: { id: string; quantity: number; item_price: number }[];
  value?: number;
  currency?: string;
  numItems?: number;
  /** Only pass phone/name when you actually have them (e.g. checkout form) — omit otherwise. */
  phone?: string;
  name?: string;
  city?: string;
  zip?: string;
}

export function sendCapiEventFromClient(args: SendCapiEventFromClientArgs): void {
  const payload = {
    eventName: args.eventName,
    eventId: args.eventId,
    eventSourceUrl: window.location.href,
    contentIds: args.contentIds,
    contentType: args.contentType,
    contents: args.contents,
    value: args.value,
    currency: args.currency,
    numItems: args.numItems,
    customerData: {
      phone: args.phone,
      name: args.name,
      city: args.city,
      zip: args.zip,
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
    },
  };

  // fire-and-forget with keepalive so it survives the WhatsApp-redirect navigation
  fetch("/api/meta-capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((err) => {
    console.error("[meta-capi-client] failed to send event:", err);
  });
}