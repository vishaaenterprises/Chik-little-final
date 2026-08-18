"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/cart-context";
import { sendCapiEventFromClient } from "@/lib/meta-capi-client";
import {
  ShoppingBag,
  ArrowLeft,
  X,
  Truck,
  Smartphone,
  Landmark,
  MessageCircle,
  Sparkles,
  Shield,
  RotateCcw,
} from "lucide-react";

const WHATSAPP_NUMBER = "917728009522";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

type PaymentMethod = "cod" | "upi" | "bank";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  upi: "UPI",
  bank: "Bank Transfer",
};

// ── Meta Pixel type ────────────────────────────────────────────────────────
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function CartPage() {
  const { cartItems, cartTotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  // ── SSR-safe isMobile ──────────────────────────────────────────────────────
  // We start with `false` on both server and client to avoid hydration mismatch.
  // After mount we sync with the real window width.
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cod" as PaymentMethod,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = cartTotal > 1499 ? 0 : 99;
  const total = cartTotal + shipping;

  // Lock background scroll when checkout modal is open
  useEffect(() => {
    if (!mounted) return;
    if (showCheckout) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [showCheckout, mounted]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10-digit phone";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Open checkout modal ──────────────────────────────────────────────────
  const handleProceedToCheckout = () => {
    setShowCheckout(true);

    // Meta Pixel: InitiateCheckout — user has expressed clear buying intent
    // by opening the checkout form.
    const initiateCheckoutId = `initiate_checkout_${Date.now()}`;
    const initiateCheckoutData = {
      content_ids: cartItems.map((item) => item.id),
      contents: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price,
      })),
      content_type: "product" as const,
      value: total,
      currency: "INR",
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "InitiateCheckout", initiateCheckoutData, {
        eventID: initiateCheckoutId,
      });
    }

    // Server-side CAPI copy — no phone/name yet, form isn't filled at this point.
    sendCapiEventFromClient({
      eventName: "InitiateCheckout",
      eventId: initiateCheckoutId,
      contentIds: initiateCheckoutData.content_ids,
      contentType: "product",
      contents: initiateCheckoutData.contents,
      value: initiateCheckoutData.value,
      currency: initiateCheckoutData.currency,
      numItems: initiateCheckoutData.num_items,
    });
  };

  const handleCheckout = () => {
    if (!validateForm()) return;

    // Meta Pixel: Purchase — fired right after the order is validated,
    // before the WhatsApp redirect, so it isn't lost to page navigation.
    const orderId = `order_${Date.now()}`;
    const purchaseData = {
      content_ids: cartItems.map((item) => item.id),
      contents: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price,
      })),
      content_type: "product" as const,
      value: total,
      currency: "INR",
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", purchaseData, { eventID: orderId });
    }

    // Server-side CAPI copy, with hashed phone/name for advanced matching —
    // this is what was missing and dragging EMQ down to 6.1/10.
    sendCapiEventFromClient({
      eventName: "Purchase",
      eventId: orderId,
      contentIds: purchaseData.content_ids,
      contentType: "product",
      contents: purchaseData.contents,
      value: purchaseData.value,
      currency: purchaseData.currency,
      numItems: purchaseData.num_items,
      phone: formData.phone,
      name: formData.name,
    });

    const lines: string[] = [];
    lines.push("🛍️ *NEW ORDER - LITTLE CHIKU*");
    lines.push("");
    lines.push("👤 *Customer Details*");
    lines.push(`Name: ${formData.name}`);
    lines.push(`Phone: ${formData.phone}`);
    lines.push(`Address: ${formData.address}`);
    lines.push(`Payment Method: ${PAYMENT_METHOD_LABELS[formData.paymentMethod]}`);
    lines.push("");
    lines.push("🛒 *Cart Details*");
    lines.push("");
    cartItems.forEach((item, index) => {
      const productTotal = item.price * item.quantity;
      lines.push(`🛍️ *${index + 1}. ${item.name}*`);
      if (item.size) lines.push(`📏 Size: ${item.size}`);
      if (item.color) lines.push(`🎨 Color: ${item.color}`);
      lines.push(`Qty: ${item.quantity}`);
      lines.push(`Price: Rs. ${item.price.toLocaleString()}`);
      lines.push(`Total: Rs. ${productTotal.toLocaleString()}`);
      if (item.slug) lines.push(`🔗 Product: ${SITE_URL}/product/${item.slug}`);
      lines.push("");
    });
    lines.push("💰 *Order Summary*");
    lines.push(`Subtotal: Rs. ${cartTotal.toLocaleString()}`);
    lines.push(`Shipping: ${shipping === 0 ? "FREE" : `Rs. ${shipping}`}`);
    lines.push(`*Grand Total: Rs. ${total.toLocaleString()}*`);
    lines.push("");
    lines.push("✨ Thank you for shopping with Little Chiku");
    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  // ── Input field style helper ──────────────────────────────────────────────
  const inputBase: React.CSSProperties = {
    width: "100%",
    height: "44px",
    padding: "0 14px",
    borderRadius: "12px",
    outline: "none",
    fontSize: "14px",
    background: "#F6FBFB",
    color: "#2B2B2B",
    border: "1.5px solid #E7EEEE",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#4FBDBA";
    e.target.style.boxShadow = "0 0 0 3px rgba(79,189,186,0.12)";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    hasError: boolean
  ) => {
    e.target.style.borderColor = hasError ? "#e53e3e" : "#E7EEEE";
    e.target.style.boxShadow = "none";
  };

  // ── Form fields ───────────────────────────────────────────────────────────
  const FormFields = (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "8px" }}>

      {/* Full Name */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "6px", color: "#2B2B2B", textTransform: "uppercase" }}>
          Full Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ ...inputBase, borderColor: errors.name ? "#e53e3e" : "#E7EEEE" }}
          placeholder="Enter your full name"
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, !!errors.name)}
        />
        {errors.name && <p style={{ color: "#e53e3e", fontSize: "11px", marginTop: "4px" }}>{errors.name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "6px", color: "#2B2B2B", textTransform: "uppercase" }}>
          Phone Number *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
          style={{ ...inputBase, borderColor: errors.phone ? "#e53e3e" : "#E7EEEE" }}
          placeholder="10-digit mobile number"
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, !!errors.phone)}
        />
        {errors.phone && <p style={{ color: "#e53e3e", fontSize: "11px", marginTop: "4px" }}>{errors.phone}</p>}
      </div>

      {/* Full Address */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "6px", color: "#2B2B2B", textTransform: "uppercase" }}>
          Full Address *
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          style={{
            width: "100%",
            height: "90px",
            padding: "12px 14px",
            borderRadius: "12px",
            outline: "none",
            fontSize: "14px",
            background: "#F6FBFB",
            color: "#2B2B2B",
            border: `1.5px solid ${errors.address ? "#e53e3e" : "#E7EEEE"}`,
            resize: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
          placeholder="House/Flat No., Street, Area, City, Pincode"
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, !!errors.address)}
        />
        {errors.address && <p style={{ color: "#e53e3e", fontSize: "11px", marginTop: "4px" }}>{errors.address}</p>}
      </div>

      {/* Payment Method */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "10px", color: "#2B2B2B", textTransform: "uppercase" }}>
          Payment Method *
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[
            { value: "cod" as const, icon: Truck, label: "Cash on Delivery" },
            { value: "upi" as const, icon: Smartphone, label: "UPI" },
            { value: "bank" as const, icon: Landmark, label: "Bank Transfer" },
          ].map(({ value, icon: Icon, label }) => {
            const isActive = formData.paymentMethod === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: value })}
                style={{
                  padding: "14px 8px",
                  borderRadius: "14px",
                  border: `2px solid ${isActive ? "#4FBDBA" : "#E7EEEE"}`,
                  background: isActive ? "#DDF5F4" : "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
              >
                <Icon style={{ width: "20px", height: "20px", color: isActive ? "#4FBDBA" : "#9CA3AF" }} />
                <span style={{
                  fontWeight: 700,
                  fontSize: "12px",
                  textAlign: "center",
                  lineHeight: "1.3",
                  color: isActive ? "#2F7F7C" : "#4B5563",
                  fontFamily: "inherit",
                }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* UPI app badges — shown only when UPI is selected */}
        <AnimatePresence>
          {formData.paymentMethod === "upi" && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 10 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "12px",
                background: "#F6FBFB",
                border: "1px solid #E7EEEE",
                flexWrap: "wrap",
              }}>
                <span style={{ fontSize: "11px", color: "#6B6B6B", fontWeight: 600, marginRight: "2px" }}>
                  Pay via:
                </span>
                {[
                  { name: "PhonePe", bg: "#5F259F", fg: "#FFFFFF" },
                  { name: "Google Pay", bg: "#FFFFFF", fg: "#3C4043", border: "#E0E0E0" },
                  { name: "Paytm", bg: "#00BAF2", fg: "#FFFFFF" },
                ].map((app) => (
                  <span
                    key={app.name}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      background: app.bg,
                      color: app.fg,
                      border: app.border ? `1px solid ${app.border}` : "none",
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "inherit",
                    }}
                  >
                    <Smartphone style={{ width: "11px", height: "11px" }} />
                    {app.name}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px", paddingLeft: "2px" }}>
                We'll share the UPI ID / QR code on WhatsApp to complete payment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bank transfer note — shown only when Bank Transfer is selected */}
        <AnimatePresence>
          {formData.paymentMethod === "bank" && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 10 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "12px",
                background: "#F6FBFB",
                border: "1px solid #E7EEEE",
              }}>
                <Landmark style={{ width: "14px", height: "14px", color: "#4FBDBA", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ fontSize: "11px", color: "#6B6B6B", lineHeight: 1.4, margin: 0 }}>
                  We'll share our bank account details on WhatsApp to complete the transfer.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <div style={{ borderRadius: "14px", padding: "14px 16px", background: "#F6FBFB", border: "1px solid #E7EEEE" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#6B6B6B", marginBottom: "2px" }}>
              Subtotal: Rs. {cartTotal.toLocaleString()}
            </p>
            <p style={{ fontSize: "12px", color: "#6B6B6B" }}>
              Shipping:{" "}
              <span style={{ color: shipping === 0 ? "#4FBDBA" : "#2B2B2B", fontWeight: 600 }}>
                {shipping === 0 ? "FREE 🎉" : `Rs. ${shipping}`}
              </span>
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", color: "#6B6B6B" }}>Grand Total</p>
            <p style={{ fontSize: "22px", fontWeight: 800, color: "#4FBDBA", fontFamily: "Georgia, serif", lineHeight: 1.1 }}>
              Rs. {total.toLocaleString()}
            </p>
          </div>
        </div>
        {shipping !== 0 && (
          <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #E7EEEE" }}>
            Add Rs. {(1499 - cartTotal).toLocaleString()} more for FREE shipping
          </p>
        )}
      </div>
    </div>
  );

  // ── WhatsApp CTA button ───────────────────────────────────────────────────
  const WhatsAppBtn = (
    <div>
      <motion.button
        onClick={handleCheckout}
        whileHover={{ scale: 1.015, y: -1 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          padding: "15px 24px",
          background: "linear-gradient(135deg, #25D366 0%, #1DA851 100%)",
          color: "white",
          fontWeight: 800,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontSize: "15px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(37,211,102,0.38), 0 2px 8px rgba(37,211,102,0.2)",
          letterSpacing: "0.01em",
          fontFamily: "inherit",
        }}
      >
        <MessageCircle style={{ width: "20px", height: "20px" }} />
        Place Order via WhatsApp
      </motion.button>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        marginTop: "10px",
      }}>
        <Shield style={{ width: "13px", height: "13px", color: "#9CA3AF" }} />
        <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500 }}>
          Secure checkout · Your details stay private
        </span>
      </div>
    </div>
  );

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (cartItems.length === 0 && !showCheckout) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: "#DDF5F4" }}
            >
              <ShoppingBag className="w-12 h-12" style={{ color: "#4FBDBA" }} />
            </div>
            <h1
              className="text-3xl font-bold mb-3"
              style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}
            >
              Your Cart is Empty
            </h1>
            <p className="mb-8" style={{ color: "#6B6B6B" }}>
              Discover our handcrafted collection and find something you&apos;ll love.
            </p>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold transition-all"
              style={{ background: "#4FBDBA", boxShadow: "0 12px 30px rgba(79,189,186,0.30)" }}
            >
              <Sparkles className="w-4 h-4" />
              Explore Collection
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Main cart page ────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <span
            className="text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: "#4FBDBA" }}
          >
            ✦ Your Selection
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mt-2"
            style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}
          >
            Shopping Cart
          </h1>
          <p className="mt-2" style={{ color: "#6B6B6B" }}>
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: cart items + trust badges ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Truck,     label: "Free Delivery",  sub: "Orders above ₹1499" },
                { icon: Shield,    label: "Secure Checkout", sub: "WhatsApp verified"  },
                { icon: RotateCcw, label: "Easy Returns",   sub: "7-day policy"        },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="p-4 rounded-2xl text-center"
                  style={{ background: "#F6FBFB", border: "1px solid #E7EEEE" }}
                >
                  <div
                    className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center"
                    style={{ background: "#DDF5F4" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#4FBDBA" }} />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "#2B2B2B" }}>{label}</p>
                  <p className="text-xs mt-1" style={{ color: "#6B6B6B" }}>{sub}</p>
                </div>
              ))}
            </div>

            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 mt-4 font-semibold"
              style={{ color: "#4FBDBA" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* ── Right: order summary sticky card ── */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ background: "white", border: "1px solid #E7EEEE" }}
            >
              <CartSummary />
              <motion.button
                onClick={handleProceedToCheckout}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 mt-4 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                style={{ background: "#4FBDBA", boxShadow: "0 12px 30px rgba(79,189,186,0.30)" }}
              >
                <ShoppingBag className="w-5 h-5" />
                Proceed to Checkout
              </motion.button>
              <p className="text-xs text-center mt-3" style={{ color: "#6B6B6B" }}>
                🔒 Secure order via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════ CHECKOUT MODAL ════════════════
          We only render the modal after the component has mounted on the client.
          This avoids the server/client mismatch for isMobile-branched JSX.
      ═══════════════════════════════════════════════════ */}
      {mounted && (
        <AnimatePresence>
          {showCheckout && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCheckout(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  zIndex: 9998,
                }}
              />

              {/* ── DESKTOP modal ── */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ type: "spring", damping: 30, stiffness: 320 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: "88px",
                    paddingBottom: "24px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    overflowY: "auto",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      width: "100%",
                      maxWidth: "480px",
                      borderRadius: "24px",
                      boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "calc(100vh - 120px)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Fixed header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        padding: "24px 24px 20px",
                        borderBottom: "1px solid #F0F6F6",
                        flexShrink: 0,
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#4FBDBA" }}>
                          ✦ Almost there!
                        </span>
                        <h2 style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "#2B2B2B", fontFamily: "Georgia, serif", lineHeight: 1.2 }}>
                          Checkout Details
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowCheckout(false)}
                        style={{
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                          background: "#F6FBFB",
                          border: "1px solid #E7EEEE",
                          cursor: "pointer",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        <X style={{ width: "16px", height: "16px", color: "#2B2B2B" }} />
                      </button>
                    </div>

                    {/* Scrollable form content */}
                    <div
                      style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        WebkitOverflowScrolling: "touch",
                        padding: "20px 24px",
                        minHeight: 0,
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                      className="hide-scrollbar"
                    >
                      {FormFields}
                    </div>

                    {/* Sticky footer */}
                    <div
                      style={{
                        padding: "16px 24px 24px",
                        borderTop: "1px solid #F0F6F6",
                        background: "white",
                        flexShrink: 0,
                      }}
                    >
                      {WhatsAppBtn}
                      <p style={{ fontSize: "11px", textAlign: "center", marginTop: "10px", color: "#9CA3AF" }}>
                        🔒 Your details are shared only via WhatsApp
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── MOBILE bottom sheet ── */}
              {isMobile && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 32, stiffness: 340 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    background: "white",
                    borderRadius: "24px 24px 0 0",
                    boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "calc(100dvh - 72px)",
                    overflow: "hidden",
                  }}
                >
                  {/* Drag handle */}
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px", flexShrink: 0 }}>
                    <div style={{ width: "40px", height: "4px", borderRadius: "100px", background: "#D1D5DB" }} />
                  </div>

                  {/* Fixed header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      padding: "12px 20px 16px",
                      borderBottom: "1px solid #F0F6F6",
                      flexShrink: 0,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#4FBDBA" }}>
                        ✦ Almost there!
                      </span>
                      <h2 style={{ fontSize: "20px", fontWeight: 800, marginTop: "2px", color: "#2B2B2B", fontFamily: "Georgia, serif" }}>
                        Checkout Details
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowCheckout(false)}
                      style={{
                        width: "34px",
                        height: "34px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        background: "#F6FBFB",
                        border: "1px solid #E7EEEE",
                        cursor: "pointer",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      <X style={{ width: "15px", height: "15px", color: "#2B2B2B" }} />
                    </button>
                  </div>

                  {/* Scrollable form content */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      overflowX: "hidden",
                      WebkitOverflowScrolling: "touch",
                      padding: "16px 20px",
                      minHeight: 0,
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                    className="hide-scrollbar"
                  >
                    {FormFields}
                  </div>

                  {/* Sticky footer — clears mobile bottom nav */}
                  <div
                    style={{
                      padding: "14px 20px",
                      paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 76px)`,
                      borderTop: "1px solid #F0F6F6",
                      background: "white",
                      flexShrink: 0,
                      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
                    }}
                  >
                    {WhatsAppBtn}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      )}

      {/* Hide scrollbars inside modal content */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </MainLayout>
  );
}