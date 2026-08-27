"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  CreditCard,
  MessageCircle,
  Sparkles,
  Shield,
  RotateCcw,
  Lock,
  Loader2,
} from "lucide-react";

const WHATSAPP_NUMBER = "917728009522";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const PHONEPE_CHECKOUT_SCRIPT_SRC = "https://mercury.phonepe.com/web/bundle/checkout.js";

type PaymentMethod = "cod" | "upi" | "card" | "netbanking";
// PhonePe's paymentModeConfig vocabulary — what we send to /api/payment/initiate
// so their embedded PayPage shows ONLY the instrument matching the tab the
// user picked, instead of PhonePe's own full method-selection menu.
type PreferredMode = "UPI" | "CARD" | "NET_BANKING";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  upi: "UPI",
  card: "Credit/Debit Card",
  netbanking: "Net Banking",
};

const PAYMENT_METHOD_TABS: Array<{ value: PaymentMethod; icon: typeof Truck; label: string }> = [
  { value: "cod", icon: Truck, label: "Cash on Delivery" },
  { value: "upi", icon: Smartphone, label: "UPI" },
  { value: "card", icon: CreditCard, label: "Credit/Debit Card" },
  { value: "netbanking", icon: Landmark, label: "Net Banking" },
];

// ── Meta Pixel + PhonePe Checkout script types ──────────────────────────────
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    PhonePeCheckout?: {
      transact: (opts: {
        tokenUrl: string;
        type?: "IFRAME";
        callback?: (response: "USER_CANCEL" | "CONCLUDED") => void;
      }) => void;
      closePage?: () => void;
    };
  }
}

// ── Trust badges (Visa/Mastercard/RuPay/UPI/BHIM) ──────────────────────────
// These are trademarked logos we can't generate ourselves — the real files
// (downloaded from each brand's official merchant asset page) live in
// /public/logo/ using the exact filenames below (case-sensitive — Vercel's
// Linux servers care about case even though Windows doesn't). If a file is
// missing, this silently falls back to a plain text label instead of a
// broken image icon.
const BADGES: Array<{ key: string; file: string; label: string }> = [
  { key: "visa", file: "/logo/VISA-logo.png", label: "VISA" },
  { key: "mastercard", file: "/logo/Mastercard-Logo.png", label: "Mastercard" },
  { key: "rupay", file: "/logo/Rupay-Logo.png", label: "RuPay" },
  { key: "upi", file: "/logo/upi.png", label: "UPI" },
  { key: "netbanking", file: "/logo/Net-Banking.png", label: "Net Banking" },
  { key: "bhim", file: "/logo/bhim.png", label: "BHIM" },
];

function TrustBadge({ file, label }: { file: string; label: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "22px",
    padding: imgFailed ? "0 8px" : "0 6px",
    border: "1px solid #E7EEEE",
    borderRadius: "6px",
    background: "white",
  };
  if (imgFailed) {
    return (
      <span style={{ ...chipStyle, fontSize: "10px", fontWeight: 600, color: "#6B6B6B", fontFamily: "inherit" }}>
        {label}
      </span>
    );
  }
  return (
    <span style={chipStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={file}
        alt={label}
        style={{ height: "14px", width: "auto", display: "block" }}
        onError={() => setImgFailed(true)}
      />
    </span>
  );
}

function TrustBadgesStrip() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      flexWrap: "wrap",
      padding: "10px 4px 2px",
    }}>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "10px",
        fontWeight: 600,
        color: "#6B6B6B",
        padding: "4px 8px",
        border: "1px solid #E7EEEE",
        borderRadius: "6px",
      }}>
        <Lock style={{ width: "10px", height: "10px" }} />
        256-bit SSL
      </span>
      {BADGES.map((badge) => (
        <TrustBadge key={badge.key} file={badge.file} label={badge.label} />
      ))}
    </div>
  );
}

export default function CartPage() {
  const { cartItems, cartTotal } = useCart();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);

  // ── SSR-safe isMobile ──────────────────────────────────────────────────────
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const phonePeScriptPromise = useRef<Promise<void> | null>(null);

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

  // ── Load PhonePe's Checkout script (once) ──────────────────────────────────
  // Cached as a promise on a ref so repeated "Pay Now" clicks don't inject
  // the script twice or race each other.
  const loadPhonePeScript = (): Promise<void> => {
    if (typeof window !== "undefined" && window.PhonePeCheckout) {
      return Promise.resolve();
    }
    if (phonePeScriptPromise.current) return phonePeScriptPromise.current;

    phonePeScriptPromise.current = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[src="${PHONEPE_CHECKOUT_SCRIPT_SRC}"]`
      );
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("script_failed")));
        return;
      }
      const script = document.createElement("script");
      script.src = PHONEPE_CHECKOUT_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("script_failed"));
      document.body.appendChild(script);
    });

    return phonePeScriptPromise.current;
  };

  // ── Online payment via PhonePe (UPI / Card / Net Banking) ──────────────────
  // Creates a PhonePe order on our server (which re-verifies price/stock from
  // Sanity — we never trust a client-supplied total), restricted via
  // paymentModeConfig to only the instrument the user picked. Then opens
  // PhonePe's PayPage in an embedded iframe on THIS page — no full-page
  // redirect, no raw card fields ever touch our own form (that's PhonePe's
  // PCI-DSS-certified surface). Falls back to a full redirect if the embed
  // script can't load (ad blockers, network issues).
  const handlePayOnline = async (mode: PreferredMode) => {
    setPaymentError("");
    setIsProcessingPayment(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
          },
          items: cartItems.map((item) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          shipping,
          preferredMode: mode,
        }),
      });
      const data = await res.json();
      if (!data.ok || !data.redirectUrl) {
        throw new Error(data.error || "Could not start payment");
      }

      const { merchantOrderId, redirectUrl } = data;

      try {
        await loadPhonePeScript();
        if (!window.PhonePeCheckout) throw new Error("script_unavailable");

        window.PhonePeCheckout.transact({
          tokenUrl: redirectUrl,
          type: "IFRAME",
          callback: (response) => {
            if (response === "CONCLUDED") {
              // Webhook + our own status API are the source of truth —
              // this page just hands off to /payment/status, which polls
              // PhonePe directly, confirms the payment, and sends the
              // WhatsApp order summary.
              router.push(`/payment/status?orderId=${merchantOrderId}`);
            } else {
              // USER_CANCEL — let them try again from the same modal.
              setIsProcessingPayment(false);
            }
          },
        });
      } catch {
        // Embed script blocked/failed — fall back to a full-page redirect
        // to PhonePe's hosted checkout instead of leaving the user stuck.
        window.location.href = redirectUrl;
      }
    } catch (err) {
      setIsProcessingPayment(false);
      setPaymentError(
        err instanceof Error ? err.message : "Payment could not be started. Try again."
      );
    }
  };

  const handleCheckout = () => {
    if (!validateForm()) return;

    if (formData.paymentMethod === "upi") {
      handlePayOnline("UPI");
      return;
    }
    if (formData.paymentMethod === "card") {
      handlePayOnline("CARD");
      return;
    }
    if (formData.paymentMethod === "netbanking") {
      handlePayOnline("NET_BANKING");
      return;
    }

    // ── Cash on Delivery — unchanged WhatsApp order flow ──────────────────
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

  const isOnlinePayment = formData.paymentMethod !== "cod";

  // ── Payment method panel copy (right side of the sidebar) ──────────────────
  const PANEL_COPY: Record<PaymentMethod, { title: string; body: string }> = {
    cod: {
      title: "Cash on Delivery",
      body: "Pay in cash when your order arrives at your doorstep. No online payment needed.",
    },
    upi: {
      title: "Pay using UPI",
      body: "Scan a QR code or pay with any UPI app — PhonePe, Google Pay, Paytm, Amazon Pay and more.",
    },
    card: {
      title: "Credit / Debit Card",
      body: "Enter your card details on the next secure step. Make sure your card is enabled for online transactions.",
    },
    netbanking: {
      title: "Net Banking",
      body: "Pick your bank on the next secure step to complete the payment.",
    },
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

      {/* ══════════════ Payment Method — Myntra/IRCTC-style sidebar + panel ══════════════ */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "10px", color: "#2B2B2B", textTransform: "uppercase" }}>
          Choose Payment Method *
        </label>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            border: "1.5px solid #E7EEEE",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {/* ── Sidebar tabs ── */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              width: isMobile ? "100%" : "128px",
              flexShrink: 0,
              background: "#F6FBFB",
              borderRight: isMobile ? "none" : "1px solid #E7EEEE",
              borderBottom: isMobile ? "1px solid #E7EEEE" : "none",
              overflowX: isMobile ? "auto" : "visible",
            }}
          >
            {PAYMENT_METHOD_TABS.map(({ value, icon: Icon, label }) => {
              const isActive = formData.paymentMethod === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setFormData({ ...formData, paymentMethod: value }); setPaymentError(""); }}
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    gap: isMobile ? "4px" : "8px",
                    padding: isMobile ? "10px 14px" : "12px 10px",
                    minWidth: isMobile ? "84px" : "auto",
                    border: "none",
                    borderLeft: !isMobile && isActive ? "3px solid #4FBDBA" : !isMobile ? "3px solid transparent" : "none",
                    borderBottom: isMobile && isActive ? "3px solid #4FBDBA" : isMobile ? "3px solid transparent" : "none",
                    background: isActive ? "#DDF5F4" : "transparent",
                    cursor: "pointer",
                    textAlign: isMobile ? "center" : "left",
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: "16px", height: "16px", color: isActive ? "#2F7F7C" : "#9CA3AF", flexShrink: 0 }} />
                  <span style={{
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: "1.3",
                    color: isActive ? "#2F7F7C" : "#6B6B6B",
                    fontFamily: "inherit",
                  }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Right panel ── */}
          <div style={{ flex: 1, padding: "16px", minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={formData.paymentMethod}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#2B2B2B", margin: "0 0 6px" }}>
                  {PANEL_COPY[formData.paymentMethod].title}
                </p>
                <p style={{ fontSize: "12px", color: "#6B6B6B", lineHeight: 1.5, margin: 0 }}>
                  {PANEL_COPY[formData.paymentMethod].body}
                </p>

                {isOnlinePayment && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
                    <Lock style={{ width: "11px", height: "11px", color: "#9CA3AF" }} />
                    <span style={{ fontSize: "10px", color: "#9CA3AF" }}>
                      Card/UPI/bank details are entered on PhonePe's secure form — never stored by us
                    </span>
                  </div>
                )}

                {paymentError && (
                  <p style={{ fontSize: "11px", color: "#e53e3e", marginTop: "10px" }}>
                    {paymentError}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
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

      {/* Trust badges strip */}
      <TrustBadgesStrip />
    </div>
  );

  // ── Checkout CTA button ────────────────────────────────────────────────────
  const CHECKOUT_BTN_LABEL: Record<PaymentMethod, string> = {
    cod: "Place Order via WhatsApp",
    upi: "Pay with UPI",
    card: "Pay with Card",
    netbanking: "Pay with Net Banking",
  };

  const CheckoutBtn = (
    <div>
      <motion.button
        onClick={handleCheckout}
        disabled={isProcessingPayment}
        whileHover={isProcessingPayment ? {} : { scale: 1.015, y: -1 }}
        whileTap={isProcessingPayment ? {} : { scale: 0.97 }}
        style={{
          width: "100%",
          padding: "15px 24px",
          background: isOnlinePayment
            ? "linear-gradient(135deg, #5F259F 0%, #3E1868 100%)"
            : "linear-gradient(135deg, #25D366 0%, #1DA851 100%)",
          color: "white",
          fontWeight: 800,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontSize: "15px",
          border: "none",
          cursor: isProcessingPayment ? "not-allowed" : "pointer",
          opacity: isProcessingPayment ? 0.75 : 1,
          boxShadow: isOnlinePayment
            ? "0 8px 24px rgba(95,37,159,0.38), 0 2px 8px rgba(95,37,159,0.2)"
            : "0 8px 24px rgba(37,211,102,0.38), 0 2px 8px rgba(37,211,102,0.2)",
          letterSpacing: "0.01em",
          fontFamily: "inherit",
        }}
      >
        {isProcessingPayment ? (
          <>
            <Loader2 className="animate-spin" style={{ width: "18px", height: "18px" }} />
            Please wait...
          </>
        ) : isOnlinePayment ? (
          <>
            <Lock style={{ width: "18px", height: "18px" }} />
            {CHECKOUT_BTN_LABEL[formData.paymentMethod]}
          </>
        ) : (
          <>
            <MessageCircle style={{ width: "20px", height: "20px" }} />
            {CHECKOUT_BTN_LABEL[formData.paymentMethod]}
          </>
        )}
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
                🔒 Secure order · Multiple payment options
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
                      maxWidth: "540px",
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
                      {CheckoutBtn}
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
                    {CheckoutBtn}
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