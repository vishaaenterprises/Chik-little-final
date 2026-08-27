// // lib/rate-limit.ts
// //
// // TEMPORARY in-memory fixed-window rate limiter — same caveat as
// // order-store.ts: per-instance only, resets on cold start, and doesn't
// // share state across multiple serverless instances. Fine as a first line
// // of defense against casual abuse; for real protection against a
// // determined attacker (e.g. distributed requests across many IPs), put
// // this behind Vercel's/Cloudflare's edge rate limiting, or use
// // Upstash Redis (`@upstash/ratelimit`) which works correctly across
// // serverless instances.

// interface Bucket {
//   count: number;
//   resetAt: number;
// }

// declare global {
//   // eslint-disable-next-line no-var
//   var __rateLimitBuckets: Map<string, Bucket> | undefined;
// }

// const buckets: Map<string, Bucket> =
//   global.__rateLimitBuckets ?? (global.__rateLimitBuckets = new Map());

// /**
//  * Returns true if the request is allowed, false if the caller has
//  * exceeded `limit` requests within the last `windowMs` milliseconds.
//  */
// export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
//   const now = Date.now();
//   const bucket = buckets.get(key);

//   if (!bucket || now > bucket.resetAt) {
//     buckets.set(key, { count: 1, resetAt: now + windowMs });
//     return true;
//   }

//   if (bucket.count >= limit) {
//     return false;
//   }

//   bucket.count += 1;
//   return true;
// }