// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import MainLayout from "@/components/layout/MainLayout";
// import { useCart } from "@/context/cart-context";
// import { sendCapiEventFromClient } from "@/lib/meta-capi-client";
// import { CheckCircle2, XCircle, Loader2, MessageCircle } from "lucide-react";

// const WHATSAPP_NUMBER = "917728009522";
// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

// declare global {
//   interface Window {
//     fbq?: (...args: any[]) => void;
//   }
// }

// type ViewState = "checking" | "success" | "failed";

// export default function PaymentStatusPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { clearCart } = useCart();
//   const orderId = searchParams.get("orderId");

//   const [view, setView] = useState<ViewState>("checking");
//   const firedRef = useRef(false); // guard against double-firing Purchase in StrictMode

//   useEffect(() => {
//     if (!orderId) {
//       setView("failed");
//       return;
//     }

//     let attempts = 0;
//     let cancelled = false;

//     const poll = async () => {
//       attempts += 1;
//       try {
//         const res = await fetch(`/api/payment/status?orderId=${orderId}`);
//         const data = await res.json();

//         if (cancelled) return;

//         if (data.ok && data.state === "COMPLETED") {
//           setView("success");
//           if (!firedRef.current) {
//             firedRef.current = true;
//             fireSuccessEvents(orderId, data);
//             sendWhatsAppSummary(orderId, data);
//             clearCart();
//           }
//           return;
//         }

//         if (data.ok && data.state === "FAILED") {
//           setView("failed");
//           return;
//         }

//         // Still PENDING — PhonePe/webhook can take a few seconds. Poll a
//         // handful of times before giving up and showing "check status".
//         if (attempts < 8) {
//           setTimeout(poll, 2500);
//         } else {
//           setView("failed");
//         }
//       } catch {
//         if (!cancelled && attempts < 8) setTimeout(poll, 2500);
//         else if (!cancelled) setView("failed");
//       }
//     };

//     poll();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [orderId]);

//   const fireSuccessEvents = (orderId: string, data: any) => {
//     const purchaseData = {
//       content_ids: data.order?.items?.map((i: any) => i.id) || [],
//       contents:
//         data.order?.items?.map((i: any) => ({
//           id: i.id,
//           quantity: i.quantity,
//           item_price: i.price,
//         })) || [],
//       content_type: "product" as const,
//       value: (data.amount || 0) / 100,
//       currency: "INR",
//       num_items:
//         data.order?.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0,
//     };

//     if (typeof window !== "undefined" && window.fbq) {
//       window.fbq("track", "Purchase", purchaseData, { eventID: orderId });
//     }

//     sendCapiEventFromClient({
//       eventName: "Purchase",
//       eventId: orderId,
//       contentIds: purchaseData.content_ids,
//       contentType: "product",
//       contents: purchaseData.contents,
//       value: purchaseData.value,
//       currency: purchaseData.currency,
//       numItems: purchaseData.num_items,
//       phone: data.order?.customer?.phone,
//       name: data.order?.customer?.name,
//     });
//   };

//   const sendWhatsAppSummary = (orderId: string, data: any) => {
//     const order = data.order;
//     if (!order) return;

//     const lines: string[] = [];
//     lines.push("🛍️ *NEW ORDER - LITTLE CHIKU*");
//     lines.push("");
//     lines.push("✅ *Paid Online via PhonePe*");
//     lines.push(`Order ID: ${orderId}`);
//     if (data.transactionId) lines.push(`Payment ID: ${data.transactionId}`);
//     lines.push("");
//     lines.push("👤 *Customer Details*");
//     lines.push(`Name: ${order.customer.name}`);
//     lines.push(`Phone: ${order.customer.phone}`);
//     lines.push(`Address: ${order.customer.address}`);
//     lines.push("");
//     lines.push("🛒 *Cart Details*");
//     lines.push("");
//     order.items.forEach((item: any, index: number) => {
//       const productTotal = item.price * item.quantity;
//       lines.push(`🛍️ *${index + 1}. ${item.name}*`);
//       if (item.size) lines.push(`📏 Size: ${item.size}`);
//       if (item.color) lines.push(`🎨 Color: ${item.color}`);
//       lines.push(`Qty: ${item.quantity}`);
//       lines.push(`Price: Rs. ${item.price.toLocaleString()}`);
//       lines.push(`Total: Rs. ${productTotal.toLocaleString()}`);
//       if (item.slug) lines.push(`🔗 Product: ${SITE_URL}/product/${item.slug}`);
//       lines.push("");
//     });
//     lines.push(`*Grand Total Paid: Rs. ${order.amount.toLocaleString()}*`);
//     lines.push("");
//     lines.push("✨ Thank you for shopping with Little Chiku");

//     const message = encodeURIComponent(lines.join("\n"));
//     window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
//   };

//   return (
//     <MainLayout>
//       <div
//         style={{
//           minHeight: "60vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "40px 20px",
//           textAlign: "center",
//         }}
//       >
//         {view === "checking" && (
//           <>
//             <Loader2 className="animate-spin" style={{ width: 48, height: 48, color: "#5F259F" }} />
//             <h1 style={{ fontSize: 20, fontWeight: 800, marginTop: 20 }}>
//               Confirming your payment...
//             </h1>
//             <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 8 }}>
//               Please don't close this page.
//             </p>
//           </>
//         )}

//         {view === "success" && (
//           <>
//             <CheckCircle2 style={{ width: 56, height: 56, color: "#22c55e" }} />
//             <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 20 }}>
//               Payment Successful!
//             </h1>
//             <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 8, maxWidth: 360 }}>
//               Your order has been placed. We've opened WhatsApp with your order
//               summary — please send it to confirm.
//             </p>
//             <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//               <Link
//                 href={`https://wa.me/${WHATSAPP_NUMBER}`}
//                 target="_blank"
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "10px 18px",
//                   borderRadius: 12,
//                   background: "#25D366",
//                   color: "white",
//                   fontWeight: 700,
//                   fontSize: 13,
//                 }}
//               >
//                 <MessageCircle style={{ width: 16, height: 16 }} />
//                 Open WhatsApp
//               </Link>
//               <Link
//                 href="/"
//                 style={{
//                   padding: "10px 18px",
//                   borderRadius: 12,
//                   border: "1.5px solid #E7EEEE",
//                   color: "#2B2B2B",
//                   fontWeight: 700,
//                   fontSize: 13,
//                 }}
//               >
//                 Continue Shopping
//               </Link>
//             </div>
//           </>
//         )}

//         {view === "failed" && (
//           <>
//             <XCircle style={{ width: 56, height: 56, color: "#e53e3e" }} />
//             <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 20 }}>
//               Payment Failed / Pending
//             </h1>
//             <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 8, maxWidth: 360 }}>
//               We couldn't confirm your payment. If money was deducted, it will be
//               auto-refunded within a few days. You can also try again from your
//               cart.
//             </p>
//             <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//               <button
//                 onClick={() => router.push("/cart")}
//                 style={{
//                   padding: "10px 18px",
//                   borderRadius: 12,
//                   background: "#5F259F",
//                   color: "white",
//                   fontWeight: 700,
//                   fontSize: 13,
//                   border: "none",
//                   cursor: "pointer",
//                 }}
//               >
//                 Back to Cart
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </MainLayout>
//   );
// }