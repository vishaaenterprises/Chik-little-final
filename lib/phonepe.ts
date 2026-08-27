// lib/phonepe.ts
//
// Singleton PhonePe StandardCheckoutClient. The SDK throws if you try to
// initialize more than one instance, so we cache it on globalThis to
// survive Next.js dev-mode hot reloads (same pattern you'd use for a DB
// client).

import {
  StandardCheckoutClient,
  Env,
} from "@phonepe-pg/pg-sdk-node";

const clientId = process.env.PHONEPE_CLIENT_ID;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
const clientVersion = Number(process.env.PHONEPE_CLIENT_VERSION || "1");
const env =
  process.env.PHONEPE_ENV === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;

if (!clientId || !clientSecret) {
  // Fails loudly at build/boot time instead of silently 500-ing on the
  // first checkout attempt in production.
  console.warn(
    "[phonepe] PHONEPE_CLIENT_ID / PHONEPE_CLIENT_SECRET not set — payment routes will fail."
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __phonepeClient: StandardCheckoutClient | undefined;
}

export function getPhonePeClient(): StandardCheckoutClient {
  if (!global.__phonepeClient) {
    global.__phonepeClient = StandardCheckoutClient.getInstance(
      clientId as string,
      clientSecret as string,
      clientVersion,
      env
    );
  }
  return global.__phonepeClient;
}

export const PHONEPE_CALLBACK_USERNAME =
  process.env.PHONEPE_CALLBACK_USERNAME || "";
export const PHONEPE_CALLBACK_PASSWORD =
  process.env.PHONEPE_CALLBACK_PASSWORD || "";