// // lib/order-store.ts
// //
// // TEMPORARY in-memory store so the payment flow works end-to-end locally.
// // On Vercel/serverless this Map is per-instance and gets wiped on cold
// // start, so a webhook hit by a different instance than the one that
// // created the order won't find it. Before going live, replace this with:
// //   - a Sanity `order` document (recommended — you already use Sanity), or
// //   - Redis / Postgres / any real DB.
// // Every place that imports this file is the only place you need to touch.

// export type OrderStatus = "PENDING" | "COMPLETED" | "FAILED";

// export interface StoredOrder {
//   amount: number;
//   customer: { name: string; phone: string; address: string };
//   items: Array<{
//     id: string;
//     slug?: string;
//     name: string;
//     price: number;
//     quantity: number;
//     size?: string;
//     color?: string;
//   }>;
//   status: OrderStatus;
//   createdAt: number;
//   phonepeTransactionId?: string;
// }

// declare global {
//   // eslint-disable-next-line no-var
//   var __pendingOrders: Map<string, StoredOrder> | undefined;
// }

// export const pendingOrders: Map<string, StoredOrder> =
//   global.__pendingOrders ?? (global.__pendingOrders = new Map());