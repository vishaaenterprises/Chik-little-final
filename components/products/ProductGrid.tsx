"use client";

import { motion } from "framer-motion";

import ProductCard from "./ProductCard";

import type { Product, LegacyProduct } from "@/lib/sanity/types";

interface ProductGridProps {
  products: (Product | LegacyProduct)[];
  columns?: "default" | "compact";
}

export default function ProductGrid({
  products = [],
  columns = "default",
}: ProductGridProps) {
  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 bg-[#DDF5F4]/40 rounded-full blur-3xl" />

      <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFF4D6]/40 rounded-full blur-3xl" />

      {/* Grid */}
      <div
        className={`relative grid gap-4 md:gap-6 ${
          columns === "compact"
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        {products.map((product, idx) => (
          <motion.div
            key={"id" in product ? product.id : idx}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: idx * 0.05,
              ease: "easeOut",
            }}
            whileHover={{
              y: -4,
            }}
            className="group"
          >
            {/* Product Wrapper */}
            <div className="relative transition-all duration-500 group-hover:scale-[1.01]">
              {/* Decorative Hover Glow */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-[#DDF5F4]/20 to-[#FFF4D6]/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

              {/* Product Card */}
              <div className="relative">
                <ProductCard
                  product={product}
                  compact={columns === "compact"}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
