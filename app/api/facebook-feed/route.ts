// Meta (Facebook/Instagram) Catalog feed.
// This file used to be empty, so the URL allowed in robots.txt returned an
// error. Meta accepts the same tab-separated columns as the Google feed
// (id, title, description, link, image_link, price, availability, condition,
// brand), so we reuse that generator instead of duplicating it.
export const dynamic = 'force-dynamic'
export { GET } from '../google-feed/route'
