"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, TrendingUp, Loader2 } from "lucide-react";

import { useState, useEffect, useRef, useCallback } from "react";

import Link from "next/link";
import Image from "next/image";

import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/lib/sanity/client";

// ─────────────────────────────────────────────
// Image Builder
// ─────────────────────────────────────────────

const builder = createImageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

function getImageUrl(source: SanityImageSource | null | undefined) {
  if (!source) {
    return "/placeholder.jpg";
  }

  try {
    return urlFor(source)
      .width(120)
      .height(120)
      .auto("format")
      .fit("crop")
      .url();
  } catch {
    return "/placeholder.jpg";
  }
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface SearchResult {
  _id: string;
  productName: string;
  slug: string;
  price: number;
  mainImage: SanityImageSource;
  productType: string;
  shortDescription: string;
}

// ─────────────────────────────────────────────
// Debounce Hook
// ─────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─────────────────────────────────────────────
// Popular Searches
// ─────────────────────────────────────────────

const popularSearches = [
  "Bath",
  "Bag",
  "Kids",
  "Gift Sets",
  "Moms",
  "Bath Robes",
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<SearchResult[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // ───────────────────────────────────────────
  // Focus Input
  // ───────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  // ───────────────────────────────────────────
  // Fetch All Products
  // ───────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    async function fetchAllProducts() {
      try {
        setLoading(true);

        const response = await fetch("/api/search?q=all");

        // IMPORTANT
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("FETCH PRODUCTS ERROR:", error);

        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchAllProducts();
  }, [isOpen]);

  // ───────────────────────────────────────────
  // Search Logic
  // ───────────────────────────────────────────

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    // Show all products initially

    if (trimmed.length < 2) {
      async function fetchAll() {
        try {
          const response = await fetch("/api/search?q=all");

          if (!response.ok) {
            throw new Error("Failed to fetch");
          }

          const data = await response.json();

          setResults(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("FETCH ALL ERROR:", error);
        }
      }

      fetchAll();

      return;
    }

    let cancelled = false;

    async function runSearch() {
      try {
        setLoading(true);

        setError(null);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
        );

        // IMPORTANT
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();

        if (!cancelled) {
          setResults(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("SEARCH ERROR:", error);

        if (!cancelled) {
          setError("Search failed. Please try again.");

          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // ───────────────────────────────────────────
  // Close Modal
  // ───────────────────────────────────────────

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);

    onClose();
  }, [onClose]);

  // ───────────────────────────────────────────
  // Conditions
  // ───────────────────────────────────────────

  const showLoading = loading;

  const showResults = !loading && !error && results.length > 0;

  const showEmpty =
    !loading && !error && query.trim().length >= 2 && results.length === 0;

  const showError = !loading && !!error;

  // ───────────────────────────────────────────
  // JSX
  // ───────────────────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="fixed top-0 left-0 right-0 z-50 p-4 pt-16 md:pt-20"
          >
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EAEAEA]">
              {/* Input */}

              <div className="relative p-4 border-b border-[#EAEAEA]">
                {showLoading ? (
                  <Loader2 className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6EC1C3] animate-spin" />
                ) : (
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-20 py-3 bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B] focus:outline-none text-lg"
                />

                {query.length > 0 && (
                  <button
                    onClick={() => {
                      setQuery("");
                    }}
                    className="absolute right-16 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-[#6B6B6B]" />
                  </button>
                )}

                <button
                  onClick={handleClose}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#6B6B6B]" />
                </button>
              </div>

              {/* Body */}

              <div className="max-h-[60vh] overflow-y-auto">
                {/* Popular Searches */}

                <div className="p-4 border-b border-[#F2F2F2]">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-[#6EC1C3]" />

                    <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                      Popular Searches
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-[#F5F5F5] rounded-full text-sm font-medium text-[#2B2B2B] hover:bg-[#6EC1C3] hover:text-white transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loading */}

                {showLoading && (
                  <div className="p-4 space-y-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3">
                        <div className="w-16 h-16 rounded-xl bg-[#F0F0F0] animate-pulse flex-shrink-0" />

                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#F0F0F0] rounded animate-pulse w-3/4" />

                          <div className="h-3 bg-[#F0F0F0] rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Results */}

                {showResults && (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">
                      Products
                    </p>

                    <div className="space-y-2">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug}`}
                          onClick={handleClose}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#F8F8F8] transition-all duration-300 group"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F5F5F5] flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(product.mainImage)}
                              alt={
                                product.productName
                                  ? product.productName
                                  : "Little Chiku Product"
                              }
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#2B2B2B] group-hover:text-[#6EC1C3] transition-colors line-clamp-1">
                              {product.productName}
                            </h4>

                            <p className="text-sm text-[#6B6B6B] capitalize">
                              {product.productType}
                            </p>
                          </div>

                          <span className="font-bold text-[#2B2B2B] whitespace-nowrap">
                            Rs. {product.price}
                          </span>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={`/category/all?search=${encodeURIComponent(query.trim())}`}
                      onClick={handleClose}
                      className="flex items-center justify-center gap-2 mt-4 py-3 bg-[#F5F5F5] rounded-2xl text-sm font-medium text-[#2B2B2B] hover:bg-[#6EC1C3] hover:text-white transition-colors"
                    >
                      View all results
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* Empty */}

                {showEmpty && (
                  <div className="p-8 text-center">
                    <Search className="w-10 h-10 mx-auto mb-3 text-[#DADADA]" />

                    <p className="font-semibold text-[#2B2B2B] mb-1">
                      No results found
                    </p>

                    <p className="text-sm text-[#6B6B6B]">
                      Try another keyword
                    </p>
                  </div>
                )}

                {/* Error */}

                {showError && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
