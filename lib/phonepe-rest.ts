// lib/phonepe-rest.ts
//
// Calls PhonePe's /checkout/v2/pay endpoint directly (bypassing the SDK's
// pay() builder, which doesn't support paymentModeConfig — see
// lib/phonepe-oauth.ts for why). This is what lets us pre-filter the
// hosted/embedded PayPage to show ONLY the instrument the user picked on
// our own "Choose Payment Method" screen (UPI / Card / Net Banking),
// giving the IRCTC/Myntra-style experience instead of PhonePe's full
// method-selection menu.

import axios from "axios";
import { getPhonePeAccessToken, PHONEPE_PG_BASE_URL } from "@/lib/phonepe-oauth";

export type PreferredMode = "UPI" | "CARD" | "NET_BANKING";

function buildPaymentModeConfig(preferredMode: PreferredMode) {
  switch (preferredMode) {
    case "UPI":
      return {
        enabledPaymentModes: [
          { type: "UPI_INTENT" },
          { type: "UPI_QR" },
          { type: "UPI_COLLECT" },
        ],
      };
    case "CARD":
      return {
        enabledPaymentModes: [
          { type: "CARD", cardTypes: ["CREDIT_CARD", "DEBIT_CARD"] },
        ],
      };
    case "NET_BANKING":
      return {
        enabledPaymentModes: [{ type: "NET_BANKING" }],
      };
  }
}

export interface PhonePePayResult {
  orderId: string;
  state: string;
  expireAt: number;
  redirectUrl: string;
}

export async function initiatePhonePePayment(params: {
  merchantOrderId: string;
  amountInPaise: number;
  redirectUrl: string;
  preferredMode: PreferredMode;
}): Promise<PhonePePayResult> {
  const token = await getPhonePeAccessToken();

  const body = {
    merchantOrderId: params.merchantOrderId,
    amount: params.amountInPaise,
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: params.redirectUrl,
      },
      paymentModeConfig: buildPaymentModeConfig(params.preferredMode),
    },
  };

  const response = await axios.post(`${PHONEPE_PG_BASE_URL}/checkout/v2/pay`, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  return response.data as PhonePePayResult;
}