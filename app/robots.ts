import type { MetadataRoute } from 'next'

// Shared rules. The product-feed endpoints are fetched by Google Merchant
// Center / Meta Catalog, so they are allowed explicitly (for Google the
// longest matching rule wins, so these beat the broader `/api/` disallow).
const ALLOW = [
  '/',
  '/llms.txt',
  '/api/google-feed',
  '/api/meta-feed',
  '/api/facebook-feed',
]
// Only the API is blocked. /cart, /wishlist and /payment/ are deliberately NOT
// disallowed: they carry a `noindex` meta tag, and a crawler that is blocked
// by robots.txt can never read that tag — which is exactly how "Wishlist -
// Little Chiku" ended up indexed. Let them be crawled so noindex is honoured.
const DISALLOW = ['/api/']

// AI search / answer-engine crawlers (AEO / GEO). Listed explicitly so the
// intent is unambiguous: public catalogue pages may be read, cited and
// surfaced in ChatGPT, Perplexity, Claude, Gemini and similar answers.
// To opt out of model *training* while staying in AI search, move
// GPTBot / Google-Extended / CCBot / anthropic-ai into a disallow rule.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: ALLOW, disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: ALLOW, disallow: DISALLOW },
    ],
    sitemap: 'https://littlechiku.com/sitemap.xml',
    host: 'https://littlechiku.com',
  }
}
