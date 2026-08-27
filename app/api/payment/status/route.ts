// app/api/payment/status/route.ts
//
// GET /api/payment/status?orderId=LC...
//
// Used by the /payment/status page right after the user is redirected back
// from PhonePe. We ask PhonePe directly (not just our own pendingOrders
// map) because the webhook can arrive a few seconds after the redirect —
// getOrderStatus() gives you the authoritative current state on demand.

import { NextRequest, NextResponse } from "next/server";
import { getPhonePeClient } from "@/lib/phonepe";
import { pendingOrders } from "@/lib/order-store";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ ok: false, error: "orderId required" }, { status: 400 });
  }

  try {
    const client = getPhonePeClient();
    const statusResponse = await client.getOrderStatus(orderId);

    const order = pendingOrders.get(orderId);

    // Prefer PhonePe's own live response for the transaction id — it's
    // available immediately, whereas the webhook (which also writes this
    // into pendingOrders) can arrive a few seconds after this page loads.
    const transactionId =
      (statusResponse as any).paymentDetails?.[0]?.transactionId ||
      order?.phonepeTransactionId;

    return NextResponse.json({
      ok: true,
      state: statusResponse.state, // "COMPLETED" | "FAILED" | "PENDING"
      amount: statusResponse.amount,
      transactionId,
      order: order
        ? { customer: order.customer, items: order.items, amount: order.amount }
        : null,
    });
  } catch (err) {
    console.error("[phonepe:status] failed", err);
    return NextResponse.json({ ok: false, error: "status_check_failed" }, { status: 502 });
  }
}