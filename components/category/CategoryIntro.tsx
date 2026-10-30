import type { CategoryContent } from '@/lib/category-content'

// Server component: renders visible, crawlable answer-first copy plus FAQs,
// and the matching FAQPage JSON-LD (content in schema == content on page).
export default function CategoryIntro({
  title,
  content,
}: {
  title: string
  content: CategoryContent
}) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section
      aria-label={`About ${title}`}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
    >
      <p className="max-w-3xl text-[15px] md:text-base leading-relaxed text-[#4B5563]">
        {content.intro}
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  )
}

// FAQs are rendered after the product grid so they don't push products down.
export function CategoryFaqs({
  title,
  content,
}: {
  title: string
  content: CategoryContent
}) {
  return (
    <section
      aria-label={`${title} FAQs`}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
    >
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2B2B2B] mb-5">
        {title} — Frequently Asked Questions
      </h2>
      <div className="max-w-3xl space-y-3">
        {content.faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-[#E7EEEE] bg-white px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-semibold text-[#2B2B2B] flex items-center justify-between gap-4">
              {f.q}
              <span className="text-[#4FBDBA] transition-transform group-open:rotate-45 text-xl leading-none">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-[#4B5563]">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
