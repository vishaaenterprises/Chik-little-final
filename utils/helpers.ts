// Utility functions

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-IN')}`
}

export function formatPriceCompact(price: number): string {
  if (price >= 100000) {
    return `Rs. ${(price / 100000).toFixed(1)}L`
  }
  if (price >= 1000) {
    return `Rs. ${(price / 1000).toFixed(1)}K`
  }
  return `Rs. ${price}`
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function deslugify(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
