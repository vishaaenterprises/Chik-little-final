"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/cart-context";
import {
  ShoppingBag,
  ArrowLeft,
  X,
  Truck,
  CreditCard,
  MessageCircle,
  Sparkles,
  Shield,
  RotateCcw,
} from "lucide-react";

const WHATSAPP_NUMBER = "917728009522";
const SITE_URL = "https://chik-little-final.vercel.app";

export default function CartPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod" as "cod" | "prepaid",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = cartTotal > 1499 ? 0 : 99;
  const total = cartTotal + shipping;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
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
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [showCheckout]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10-digit phone";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validateForm()) return;
    const lines: string[] = [];
    lines.push("🛍️ *NEW ORDER - LITTLE CHIKU*");
    lines.push("");
    lines.push("👤 *Customer Details*");
    lines.push(`Name: ${formData.name}`);
    lines.push(`Phone: ${formData.phone}`);
    lines.push(`Address: ${formData.address}`);
    lines.push(`City: ${formData.city}`);
    lines.push(`Pincode: ${formData.pincode}`);
    lines.push(
      `Payment Method: ${
        formData.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid (Online)"
      }`
    );
    lines.push("");
    lines.push("🛒 *Cart Details*");
    lines.push("");
    cartItems.forEach((item, index) => {
      const productTotal = item.price * item.quantity;
      lines.push(`🛍️ *${index + 1}. ${item.name}*`);
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

  // Shared form JSX
  const FormFields = (
    <div className="space-y-3">
      {(
        [
          { id: "name", label: "Full Name", placeholder: "Enter your full name", type: "text" },
          { id: "phone", label: "Phone Number", placeholder: "10-digit mobile number", type: "tel" },
        ] as const
      ).map(({ id, label, placeholder, type }) => (
        <div key={id}>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#2B2B2B" }}>
            {label} *
          </label>
          <input
            type={type}
            value={formData[id]}
            onChange={(e) => {
              const val = id === "phone"
                ? e.target.value.replace(/\D/g, "").slice(0, 10)
                : e.target.value;
              setFormData({ ...formData, [id]: val });
            }}
            className="w-full h-11 px-3 rounded-xl outline-none transition-all text-sm"
            style={{
              border: `1.5px solid ${errors[id] ? "#e53e3e" : "#E7EEEE"}`,
              background: "#F6FBFB",
              color: "#2B2B2B",
            }}
            placeholder={placeholder}
            onFocus={(e) => { e.target.style.borderColor = "#4FBDBA"; e.target.style.boxShadow = "0 0 0 3px rgba(79,189,186,0.12)"; }}
            onBlur={(e) => { e.target.style.borderColor = errors[id] ? "#e53e3e" : "#E7EEEE"; e.target.style.boxShadow = "none"; }}
          />
          {errors[id] && <p className="text-red-500 text-[11px] mt-0.5">{errors[id]}</p>}
        </div>
      ))}

      {/* Address */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "#2B2B2B" }}>
          Delivery Address *
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl outline-none transition-all resize-none text-sm"
          style={{
            height: "80px",
            border: `1.5px solid ${errors.address ? "#e53e3e" : "#E7EEEE"}`,
            background: "#F6FBFB",
            color: "#2B2B2B",
          }}
          placeholder="House/Flat No., Street, Area"
          onFocus={(e) => { e.target.style.borderColor = "#4FBDBA"; e.target.style.boxShadow = "0 0 0 3px rgba(79,189,186,0.12)"; }}
          onBlur={(e) => { e.target.style.borderColor = errors.address ? "#e53e3e" : "#E7EEEE"; e.target.style.boxShadow = "none"; }}
        />
        {errors.address && <p className="text-red-500 text-[11px] mt-0.5">{errors.address}</p>}
      </div>

      {/* City & Pincode */}
      <div className="grid grid-cols-2 gap-2">
        {(["city", "pincode"] as const).map((field) => (
          <div key={field}>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#2B2B2B" }}>
              {field === "city" ? "City" : "Pincode"} *
            </label>
            <input
              type="text"
              value={formData[field]}
              onChange={(e) => {
                const val = field === "pincode"
                  ? e.target.value.replace(/\D/g, "").slice(0, 6)
                  : e.target.value;
                setFormData({ ...formData, [field]: val });
              }}
              className="w-full h-11 px-3 rounded-xl outline-none transition-all text-sm"
              style={{
                border: `1.5px solid ${errors[field] ? "#e53e3e" : "#E7EEEE"}`,
                background: "#F6FBFB",
                color: "#2B2B2B",
              }}
              placeholder={field === "city" ? "City" : "6-digit"}
              onFocus={(e) => { e.target.style.borderColor = "#4FBDBA"; e.target.style.boxShadow = "0 0 0 3px rgba(79,189,186,0.12)"; }}
              onBlur={(e) => { e.target.style.borderColor = errors[field] ? "#e53e3e" : "#E7EEEE"; e.target.style.boxShadow = "none"; }}
            />
            {errors[field] && <p className="text-red-500 text-[11px] mt-0.5">{errors[field]}</p>}
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#2B2B2B" }}>
          Payment Method *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "cod", icon: Truck, label: "Cash on Delivery" },
            { value: "prepaid", icon: CreditCard, label: "Prepaid (Online)" },
          ].map(({ value, icon: Icon, label }) => {
            const isActive = formData.paymentMethod === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: value as "cod" | "prepaid" })}
                className="py-3 px-2 rounded-xl transition-all duration-200 flex flex-col items-center gap-1.5"
                style={{
                  border: `2px solid ${isActive ? "#4FBDBA" : "#E7EEEE"}`,
                  background: isActive ? "#DDF5F4" : "white",
                }}
              >
                <Icon className="w-5 h-5" style={{ color: isActive ? "#4FBDBA" : "#6B6B6B" }} />
                <span className="font-semibold text-xs text-center leading-tight" style={{ color: isActive ? "#2F7F7C" : "#2B2B2B" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Order Summary */}
      <div className="rounded-xl p-3" style={{ background: "#F6FBFB", border: "1px solid #E7EEEE" }}>
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: "#6B6B6B" }}>Order Total</span>
          <span className="text-lg font-bold" style={{ color: "#4FBDBA", fontFamily: "Georgia, serif" }}>
            Rs. {total.toLocaleString()}
          </span>
        </div>
        {shipping === 0 ? (
          <p className="text-xs mt-1" style={{ color: "#4FBDBA" }}>🎉 You qualify for FREE shipping!</p>
        ) : (
          <p className="text-xs mt-1" style={{ color: "#6B6B6B" }}>
            Add Rs. {(1499 - cartTotal).toLocaleString()} more for FREE shipping
          </p>
        )}
      </div>
    </div>
  );

  // Empty cart
  if (cartItems.length === 0 && !showCheckout) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "#DDF5F4" }}>
              <ShoppingBag className="w-12 h-12" style={{ color: "#4FBDBA" }} />
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}>
              Your Cart is Empty
            </h1>
            <p className="mb-8" style={{ color: "#6B6B6B" }}>
              Discover our handcrafted collection and find something you'll love.
            </p>
            <Link
              href="/shop"
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: "#4FBDBA" }}>
            ✦ Your Selection
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2" style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}>
            Shopping Cart
          </h1>
          <p className="mt-2" style={{ color: "#6B6B6B" }}>
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Truck, label: "Free Delivery", sub: "Orders above ₹1499" },
                { icon: Shield, label: "Secure Checkout", sub: "WhatsApp verified" },
                { icon: RotateCcw, label: "Easy Returns", sub: "7-day policy" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="p-4 rounded-2xl text-center" style={{ background: "#F6FBFB", border: "1px solid #E7EEEE" }}>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ background: "#DDF5F4" }}>
                    <Icon className="w-5 h-5" style={{ color: "#4FBDBA" }} />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "#2B2B2B" }}>{label}</p>
                  <p className="text-xs mt-1" style={{ color: "#6B6B6B" }}>{sub}</p>
                </div>
              ))}
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 mt-4 font-semibold" style={{ color: "#4FBDBA" }}>
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl p-6 sticky top-24" style={{ background: "white", border: "1px solid #E7EEEE" }}>
              <CartSummary />
              <motion.button
                onClick={() => setShowCheckout(true)}
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

      {/* ════════════════ CHECKOUT MODAL ════════════════ */}
      <AnimatePresence>
        {showCheckout && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              style={{ zIndex: 9998 }}
            />

            {/* ── DESKTOP: Centered dialog ── */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                className="fixed inset-0 flex items-center justify-center"
                style={{ zIndex: 9999 }}
              >
                <div
                  className="bg-white w-full flex flex-col"
                  style={{
                    maxWidth: "480px",
                    maxHeight: "90vh",
                    borderRadius: "24px",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between px-6 pt-6 pb-4 flex-shrink-0"
                    style={{ borderBottom: "1px solid #F0F4F4" }}>
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#4FBDBA" }}>
                        ✦ Almost there!
                      </span>
                      <h2 className="text-2xl font-bold mt-0.5" style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}>
                        Checkout Details
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
                      style={{ background: "#F6FBFB", border: "1px solid #E7EEEE" }}
                    >
                      <X className="w-4 h-4" style={{ color: "#2B2B2B" }} />
                    </button>
                  </div>

                  {/* Scrollable form */}
                  <div
                    className="flex-1 overflow-y-auto px-6 py-4"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {FormFields}
                  </div>

                  {/* Footer button */}
                  <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #F0F4F4" }}>
                    <motion.button
                      onClick={handleCheckout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                      style={{ background: "#25D366", boxShadow: "0 8px 24px rgba(37,211,102,0.35)" }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      Place Order via WhatsApp
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── MOBILE: Bottom sheet ── */}
            {isMobile && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                className="fixed left-0 right-0 bottom-0 bg-white flex flex-col overflow-hidden"
                style={{
                  zIndex: 9999,
                  borderRadius: "24px 24px 0 0",
                  maxHeight: "calc(100dvh - 56px)",
                  boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
                }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full" style={{ background: "#D1D5DB" }} />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between px-4 pt-2 pb-3 flex-shrink-0"
                  style={{ borderBottom: "1px solid #F0F4F4" }}>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#4FBDBA" }}>
                      ✦ Almost there!
                    </span>
                    <h2 className="text-xl font-bold mt-0.5" style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}>
                      Checkout Details
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 mt-1"
                    style={{ background: "#F6FBFB", border: "1px solid #E7EEEE" }}
                  >
                    <X className="w-4 h-4" style={{ color: "#2B2B2B" }} />
                  </button>
                </div>

                {/* Scrollable form */}
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {FormFields}
                </div>

                {/* Sticky WhatsApp button — above navbar */}
                <div
                  className="flex-shrink-0 px-4 pt-3 bg-white"
                  style={{
                    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 76px)",
                    boxShadow: "0 -8px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  <motion.button
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm"
                    style={{ background: "#25D366", boxShadow: "0 8px 24px rgba(37,211,102,0.35)" }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Place Order via WhatsApp
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}