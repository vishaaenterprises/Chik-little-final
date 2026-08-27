'use client'

// components/home/TestimonialsSection.tsx
// Left/right sliding reviews section for the home page. See
// components/reviews/ReviewsCarousel.tsx for the shared slider UI.

import ReviewsCarousel from '@/components/reviews/ReviewsCarousel'
import type { SanityTestimonial } from '@/lib/sanity'

interface TestimonialsSectionProps {
  testimonials: SanityTestimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <ReviewsCarousel
      reviews={testimonials}
      eyebrow="Customer Stories"
      title="Loved by Families Everywhere"
      description="Hear from parents who have experienced the Little Chiku difference"
      viewMoreHref="/reviews"
      viewMoreLabel="View More Reviews"
      showProductLink={false}
    />
  )
}