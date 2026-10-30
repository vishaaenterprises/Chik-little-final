// import-reviews.js
// ─────────────────────────────────────────────────────────────
//  Bulk-imports testimonial/review documents into Sanity WITHOUT
//  needing `sanity login` — it authenticates using an API token
//  instead, so it works even if the CLI browser login is being
//  flaky (wrong Google account, blocked popup, etc).
//
//  HOW TO USE:
//   1. npm install @sanity/client   (run this once inside the
//      sanityStudio folder)
//   2. Get a token: sanity.io/manage → your project → API →
//      Tokens → "Add API token" → name it "bulk-import" →
//      permission "Editor" → Save → copy the token (shown once).
//   3. Export it as SANITY_WRITE_TOKEN (do NOT paste it into this file)
//   4. Put testimonials-bulk.ndjson in the SAME folder as this
//      script (sanityStudio folder).
//   5. Run:  node import-reviews.js
// ─────────────────────────────────────────────────────────────

const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

// ── 1. Token comes from the environment (never commit it) ──
//    Run:  SANITY_WRITE_TOKEN=xxxx node import-reviews.js
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN

// ── 2. Project details (already correct for this project) ───
const client = createClient({
  projectId: 'at4opa5a',
  dataset: 'production',
  apiVersion: '2025-05-21',
  token: SANITY_TOKEN,
  useCdn: false,
})

// ── 3. Which file to import ───────────────────────────────────
const FILE_NAME = 'testimonials-bulk.ndjson'

async function main() {
  if (!SANITY_TOKEN || SANITY_TOKEN === 'PASTE_YOUR_TOKEN_HERE') {
    console.error(
      '\n❌ Set SANITY_WRITE_TOKEN in your environment first.\n'
    )
    process.exit(1)
  }

  const filePath = path.join(__dirname, FILE_NAME)
  if (!fs.existsSync(filePath)) {
    console.error(`\n❌ Could not find ${FILE_NAME} in this folder: ${__dirname}\n`)
    process.exit(1)
  }

  const lines = fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  console.log(`Found ${lines.length} reviews to import...\n`)

  let success = 0
  let failed = 0

  for (const line of lines) {
    let doc
    try {
      doc = JSON.parse(line)
    } catch (err) {
      console.error('⚠️  Skipping invalid line (not valid JSON):', line.slice(0, 60))
      failed++
      continue
    }

    try {
      // createOrReplace so re-running this script is safe and
      // won't create duplicates if a document with the same _id
      // already exists.
      await client.createOrReplace(doc)
      success++
      console.log(`✅ ${doc.customerName || doc._id}`)
    } catch (err) {
      failed++
      console.error(`❌ Failed: ${doc.customerName || doc._id} — ${err.message}`)
    }
  }

  console.log(`\nDone. ${success} imported, ${failed} failed.\n`)
}

main().catch((err) => {
  console.error('\nUnexpected error:', err.message)
  process.exit(1)
})
