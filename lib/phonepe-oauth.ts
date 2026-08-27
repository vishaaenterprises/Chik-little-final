// lib/phonepe-oauth.ts
//
// The installed @phonepe-pg/pg-sdk-node builder (StandardCheckoutPayRequest)
// does not expose `paymentModeConfig` — the field that lets us tell PhonePe
// "only show UPI" / "only show Card" / "only show Net Banking" on their
// hosted page. To support the IRCTC/Myntra-style "pick a method, see only
// that method's form" flow, we call PhonePe's REST /checkout/v2/pay
// endpoint directly (see lib/phonepe-rest.ts) instead of the SDK's pay().
//
// That means we need our own OAuth token — same client_credentials flow
// the SDK itself uses internally, just exposed here so our custom REST
// call can reuse it. order-status and webhook validation still go through
// the official SDK (lib/phonepe.ts) since those don't need this field.

import axios from "axios";

const clientId = process.env.PHONEPE_CLIENT_ID as string;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET as string;
const clientVersion = process.env.PHONEPE_CLIENT_VERSION || "1";
const isProd = process.env.PHONEPE_ENV === "PRODUCTION";

export const PHONEPE_PG_BASE_URL = isProd
  ? "https://api.phonepe.com/apis/pg"
  : "https://api-preprod.phonepe.com/apis/pg-sandbox";

const OAUTH_BASE_URL = isProd
  ? "https://api.phonepe.com/apis/identity-manager"
  : "https://api-preprod.phonepe.com/apis/pg-sandbox";

interface CachedToken {
  accessToken: string;
  tokenType: string;
  expiresAt: number; // unix seconds
  issuedAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __phonepeOAuthToken: CachedToken | undefined;
}

function isCachedTokenValid(token: CachedToken | undefined): token is CachedToken {
  if (!token) return false;
  const now = Math.floor(Date.now() / 1000);
  // Refresh at the halfway point of the token's lifetime, same margin the
  // official SDK uses, so we never hand out a token that's about to expire
  // mid-request.
  const reloadAt = token.issuedAt + (token.expiresAt - token.issuedAt) / 2;
  return now < reloadAt;
}

export async function getPhonePeAccessToken(): Promise<string> {
  if (isCachedTokenValid(global.__phonepeOAuthToken)) {
    return `${global.__phonepeOAuthToken!.tokenType} ${global.__phonepeOAuthToken!.accessToken}`;
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    client_version: clientVersion,
    grant_type: "client_credentials",
  });

  const response = await axios.post(`${OAUTH_BASE_URL}/v1/oauth/token`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const data = response.data;
  global.__phonepeOAuthToken = {
    accessToken: data.access_token,
    tokenType: data.token_type,
    issuedAt: data.issued_at,
    expiresAt: data.expires_at,
  };

  return `${data.token_type} ${data.access_token}`;
}