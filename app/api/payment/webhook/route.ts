// // app/api/payment/webhook/route.ts
// //
// // Server-to-server callback PhonePe hits when a payment finishes. This is
// // the SOURCE OF TRUTH for order status — never trust the client-side
// // redirect alone, since a user can close the tab or their network can drop
// // before the redirect happens. Configure this exact URL (yourdomain.com
// // /api/payment/webhook) + the username/password in the PhonePe Business
// // dashboard under Webhook settings.

// import { NextRequest, NextResponse } from "next/server";
// import { CallbackType } from "@phonepe-pg/pg-sdk-node";
// import { getPhonePeClient, PHONEPE_CALLBACK_USERNAME, PHONEPE_CALLBACK_PASSWORD } from "@/lib/phonepe";
// import { pendingOrders } from "@/lib/order-store";

// export async function POST(request: NextRequest) {
//   const authorizationHeader = request.headers.get("authorization") || "";
//   const rawBody = await request.text();

//   let callbackResponse;
//   try {
//     const client = getPhonePeClient();
//     callbackResponse = client.validateCallback(
//       PHONEPE_CALLBACK_USERNAME,
//       PHONEPE_CALLBACK_PASSWORD,
//       authorizationHeader,
//       rawBody
//     );
//   } catch (err) {
//     // Invalid signature — someone hitting this endpoint directly, or
//     // misconfigured username/password. Reject, don't process.
//     console.error("[phonepe:webhook] validateCallback failed", err);
//     return NextResponse.json({ ok: false }, { status: 401 });
//   }

//   const { type, payload } = callbackResponse;
//   const merchantOrderId = payload.originalMerchantOrderId || "";

//   const order = pendingOrders.get(merchantOrderId);
//   if (order) {
//     // Idempotency: PhonePe can retry a webhook delivery if it doesn't get a
//     // fast 200 back. Skip re-processing if we've already marked this order
//     // COMPLETED — otherwise a retry could trigger duplicate WhatsApp
//     // messages / duplicate stock decrements once that logic is added.
//     if (order.status === "COMPLETED") {
//       return NextResponse.json({ ok: true });
//     }

//     if (type === CallbackType.CHECKOUT_ORDER_COMPLETED) {
//       // Extra belt-and-braces check: confirm the amount PhonePe says was
//       // paid matches what we originally asked for. A mismatch here would
//       // mean something is very wrong upstream — log it loudly rather than
//       // silently marking the order paid.
//       const expectedPaise = Math.round(order.amount * 100);
//       if (typeof payload.amount === "number" && payload.amount !== expectedPaise) {
//         console.error(
//           `[phonepe:webhook] amount mismatch for ${merchantOrderId}: expected ${expectedPaise}, got ${payload.amount}`
//         );
//         order.status = "FAILED";
//         pendingOrders.set(merchantOrderId, order);
//         return NextResponse.json({ ok: true });
//       }

//       order.status = "COMPLETED";
//       order.phonepeTransactionId = payload.paymentDetails?.[0]?.transactionId;
//       // TODO: this is the right place to (a) write the confirmed order into
//       // Sanity as a permanent record, (b) send the WhatsApp/email
//       // confirmation, (c) decrement stock — do it here, not just on the
//       // client redirect, since the webhook fires even if the customer
//       // never comes back to your site.
//     } else if (type === CallbackType.CHECKOUT_ORDER_FAILED) {
//       order.status = "FAILED";
//     }
//     pendingOrders.set(merchantOrderId, order);
//   } else {
//     // Callback for an order we have no record of — either a very old
//     // order (pruned from the in-memory store) or someone probing the
//     // endpoint. validateCallback() already confirmed this really came
//     // from PhonePe, so it's not a spoofing attempt, just log it.
//     console.warn(`[phonepe:webhook] no local record for order ${merchantOrderId}`);
//   }

//   // PhonePe just needs a 200 to stop retrying.
//   return NextResponse.json({ ok: true });
// }