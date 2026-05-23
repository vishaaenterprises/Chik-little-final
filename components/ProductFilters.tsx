"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";

type Subcategory = {
  title: string;
  slug: string;
};

type Category = {
  title: string;
  slug: string;
  subcategories?: Subcategory[];
};

type ProductFiltersProps = {
  categories: Category[];
  availableSubcategories: Subcategory[];

  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedPriceRange: number | null;

  showOnlyNew: boolean;
  showOnlyBestseller: boolean;

  sortBy: string;
  gridView: "default" | "compact";

  setSelectedCategory: (value: string | null) => void;
  setSelectedSubcategory: (value: string | null) => void;
  setSelectedPriceRange: (value: number | null) => void;

  setShowOnlyNew: (value: boolean) => void;
  setShowOnlyBestseller: (value: boolean) => void;

  setSortBy: (value: string) => void;
  setGridView: (value: "default" | "compact") => void;

  clearFilters: () => void;

  activeFilterCount: number;
  hasActiveFilters: boolean;

  showFilters: boolean;
  setShowFilters: (value: boolean) => void;

  filteredProductsCount: number;

  slug: string;
};

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Best Rated", value: "rating" },
];

const priceRanges = [
  { label: "Under Rs.500", min: 0, max: 500 },
  { label: "Rs.500 - Rs.1,000", min: 500, max: 1000 },
  { label: "Rs.1,000 - Rs.2,000", min: 1000, max: 2000 },
  { label: "Rs.2,000 - Rs.5,000", min: 2000, max: 5000 },
  { label: "Above Rs.5,000", min: 5000, max: Infinity },
];

export default function ProductFilters({
  categories,
  availableSubcategories,

  selectedCategory,
  selectedSubcategory,
  selectedPriceRange,

  showOnlyNew,
  showOnlyBestseller,

  sortBy,
  gridView,

  setSelectedCategory,
  setSelectedSubcategory,
  setSelectedPriceRange,

  setShowOnlyNew,
  setShowOnlyBestseller,

  setSortBy,
  setGridView,

  clearFilters,

  activeFilterCount,
  hasActiveFilters,

  showFilters,
  setShowFilters,

  filteredProductsCount,

  slug,
}: ProductFiltersProps) {
  const chipClass =
    "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border";

  return (
    <>
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 mb-6 px-5 py-4 rounded-[1.5rem]"
        style={{
          background: "white",
          border: "1px solid #E7EEEE",
          boxShadow: "0 8px 24px rgba(79,189,186,0.07)",
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all"
            style={{
              background:
                showFilters || hasActiveFilters
                  ? "#4FBDBA"
                  : "#F6FBFB",

              color:
                showFilters || hasActiveFilters
                  ? "white"
                  : "#2B2B2B",

              border: "1px solid #E7EEEE",
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />

            Filters

            {hasActiveFilters && (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "#F6C453",
                  color: "#2B2B2B",
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm"
              style={{
                background: "#F6FBFB",
                color: "#6B6B6B",
              }}
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}

          <p className="text-sm text-[#6B6B6B]">
            {filteredProductsCount} products
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* Grid Toggle */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{
              background: "#F6FBFB",
              border: "1px solid #E7EEEE",
            }}
          >
            {[
              {
                view: "default" as const,
                Icon: LayoutGrid,
              },
              {
                view: "compact" as const,
                Icon: Grid3X3,
              },
            ].map(({ view, Icon }) => (
              <button
                key={view}
                onClick={() => setGridView(view)}
                className="p-2 rounded-lg transition-all"
                style={{
                  background:
                    gridView === view
                      ? "white"
                      : "transparent",

                  color:
                    gridView === view
                      ? "#4FBDBA"
                      : "#6B6B6B",
                }}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="appearance-none pl-4 pr-10 py-3 rounded-2xl outline-none text-sm font-medium"
              style={{
                border: "1px solid #E7EEEE",
                background: "white",
              }}
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{
                color: "#6B6B6B",
              }}
            />
          </div>
        </div>
      </div>

     {/* Filter Panel */}
<AnimatePresence>
  {showFilters && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-visible mb-8"
    >
      <div
        className="p-8 rounded-[2rem] space-y-8"
        style={{
          background: "#fff",
          border: "1px solid #E7EEEE",
          boxShadow:
            "0 10px 30px rgba(79,189,186,0.07)",
        }}
      >

        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-5 text-[#666]">
            Categories
          </h3>

          <div className="flex flex-wrap gap-4">

            {/* All */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className={`px-6 py-3 rounded-full border text-sm font-semibold transition-all duration-200 ${
                !selectedCategory
                  ? "bg-[#73C7C5] text-white border-[#73C7C5]"
                  : "bg-white text-[#444] border-[#E7EEEE]"
              }`}
            >
              All
            </button>

            {/* Dynamic Categories */}
            {categories &&
              categories.length > 0 &&
              categories.map((cat: any) => (
                <button
                  key={cat.slug || cat.title}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setSelectedSubcategory(null);
                  }}
                  className={`px-6 py-3 rounded-full border text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === cat.slug
                      ? "bg-[#73C7C5] text-white border-[#73C7C5]"
                      : "bg-white text-[#444] border-[#E7EEEE]"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-5 text-[#666]">
            Price Range
          </h3>

          <div className="flex flex-wrap gap-4">

            {[
              "Under Rs.500",
              "Rs.500 - Rs.1,000",
              "Rs.1,000 - Rs.2,000",
              "Rs.2,000 - Rs.5,000",
              "Above Rs.5,000",
            ].map((price) => (
              <button
                key={price}
                className="px-6 py-3 rounded-full border border-[#E7EEEE] bg-white text-[#555] text-sm font-medium hover:border-[#73C7C5] transition-all duration-200"
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-5 text-[#666]">
            Quick Filters
          </h3>

          <div className="flex flex-wrap gap-4">

            <button className="px-6 py-3 rounded-full border border-[#E7EEEE] bg-white text-[#555] text-sm font-medium hover:border-[#73C7C5] transition-all duration-200">
              New Arrivals
            </button>

            <button className="px-6 py-3 rounded-full border border-[#E7EEEE] bg-white text-[#555] text-sm font-medium hover:border-[#73C7C5] transition-all duration-200">
              Bestsellers
            </button>

          </div>
        </div>

      </div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}