"use client";

// app/reviews/page.tsx
// ─────────────────────────────────────────────────────────────
//  Full "View More Reviews" destination. Reached from both the
//  home page slider and every product page's reviews slider.
//  Supports an optional ?product=<slug> filter (set automatically
//  when arriving from a product page's own reviews).
// ─────────────────────────────────────────────────────────────

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, X, Star, ShieldCheck, BadgeCheck, Users } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ReviewCard from "@/components/reviews/ReviewCard";
import type { SanityTestimonial, ReviewStats } from "@/lib/sanity/types";

const PAGE_SIZE = 12;

// ── Trust summary: average rating + star breakdown + trust points ──

function TrustSummary({ stats, loading }: { stats: ReviewStats | null; loading: boolean }) {
  if (loading || !stats || stats.total === 0) return null;

  const average = stats.average ?? 0;
  const breakdown = [
    { label: 5, count: stats.five },
    { label: 4, count: stats.four },
    { label: 3, count: stats.three },
    { label: 2, count: stats.two },
    { label: 1, count: stats.one },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-14 bg-white border border-[#E7EEEE] rounded-[2rem] p-6 sm:p-10 shadow-[0_10px_30px_rgba(79,189,186,0.08)]">
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:gap-12 items-center">
        {/* Average rating */}
        <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2 sm:border-r sm:border-[#E7EEEE] sm:pr-12">
          <span className="font-heading text-5xl sm:text-6xl font-bold text-[#2B2B2B] leading-none">
            {average.toFixed(1)}
          </span>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(average)
                      ? "fill-[#F6C453] text-[#F6C453]"
                      : "text-[#E7EEEE] fill-[#E7EEEE]"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-[#6B6B6B] whitespace-nowrap">
              Based on {stats.total} review{stats.total === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Star breakdown bars */}
        <div className="space-y-2 w-full">
          {breakdown.map(({ label, count }) => {
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="w-10 text-xs font-semibold text-[#6B6B6B] flex-shrink-0">
                  {label} star
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#F6FBFB] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#F6C453]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-9 text-xs text-[#8A8A8A] text-right flex-shrink-0">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-8 border-t border-[#E7EEEE]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#DDF5F4] flex items-center justify-center flex-shrink-0">
            <BadgeCheck className="w-4 h-4 text-[#2F7F7C]" />
          </div>
          <p className="text-[13px] font-semibold text-[#2B2B2B]">
            Genuine, verified reviews
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#DDF5F4] flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-[#2F7F7C]" />
          </div>
          <p className="text-[13px] font-semibold text-[#2B2B2B]">
            From real Little Chiku families
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#DDF5F4] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#2F7F7C]" />
          </div>
          <p className="text-[13px] font-semibold text-[#2B2B2B]">
            No edits, shown as received
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewsPageContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product") || "";

  const [reviews, setReviews] = useState<SanityTestimonial[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchReviews = useCallback(
    async (pageNum: number, replace: boolean) => {
      replace ? setLoading(true) : setLoadingMore(true);
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(PAGE_SIZE),
        });
        if (productSlug) params.set("product", productSlug);

        const res = await fetch(`/api/sanity/reviews?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();

        setReviews((prev) =>
          replace ? data.reviews ?? [] : [...prev, ...(data.reviews ?? [])]
        );
        setTotal(data.total ?? 0);
        setHasMore(!!data.hasMore);
        if (replace) setStats(data.stats ?? null);
      } catch (err) {
        console.error("[ReviewsPage] fetch error:", err);
      } finally {
        replace ? setLoading(false) : setLoadingMore(false);
      }
    },
    [productSlug]
  );

  useEffect(() => {
    setPage(1);
    fetchReviews(1, true);
  }, [fetchReviews]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, false);
  };

  const productName = reviews.find(
    (r) => r.productPurchased?.slug === productSlug
  )?.productPurchased?.productName;

  return (
    <MainLayout>
      <section className="relative overflow-hidden py-16 md:py-24 bg-[#FFFDF7] min-h-[60vh]">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-[#DDF5F4]/40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-[#FFF4D6]/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DDF5F4] border border-[#BFE9E7] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#4FBDBA]" />
              <span className="text-sm font-semibold uppercase tracking-wide text-[#2F7F7C]">
                Customer Stories
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-[#2B2B2B] mb-4 text-balance">
              {productSlug
                ? `Reviews${productName ? ` for ${productName}` : ""}`
                : "All Customer Reviews"}
            </h1>

            <p className="max-w-2xl mx-auto text-[#6B6B6B] text-lg leading-relaxed">
              {!loading && total > 0
                ? `${total} verified ${total === 1 ? "review" : "reviews"} from happy families`
                : "Real feedback from real parents"}
            </p>

            {productSlug && (
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#4FBDBA] hover:text-[#2F7F7C] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear filter — view all reviews
              </Link>
            )}
          </div>

          {/* Trust summary */}
          <TrustSummary stats={stats} loading={loading} />

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-[#4FBDBA]" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#6B6B6B] text-lg">No reviews found yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {reviews.map((review, idx) => (
                  <ReviewCard
                    key={review._id}
                    testimonial={review}
                    index={idx}
                    showProductLink={!productSlug}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-[#4FBDBA] text-[#2F7F7C] rounded-full font-bold hover:bg-[#4FBDBA] hover:text-white transition-all duration-300 disabled:opacity-60"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Reviews"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={null}>
      <ReviewsPageContent />
    </Suspense>
  );
}