import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { checkRateLimit } from '@/lib/rate-limit'

// Escape user input before putting it into the HTML email — previously raw
// values were interpolated, so anyone could inject markup/links into the
// message the store owner receives.
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s-]{7,17}$/

const fail = (message: string, status = 400) =>
  NextResponse.json({ success: false, message }, { status })

export async function POST(req: Request) {
  try {
    // Basic per-IP throttle: 5 messages / 10 min (in-memory, per instance).
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkRateLimit(`contact:${ip}`, 5, 10 * 60_000)) {
      return fail('Too many messages. Please try again in a few minutes.', 429)
    }

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return fail('Invalid request')
    }

    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const subject = String(body.subject ?? '').trim()
    const message = String(body.message ?? '').trim()

    if (!name || !email || !phone || !subject || !message) {
      return fail('All fields are required')
    }
    if (name.length > 100 || subject.length > 150 || message.length > 3000) {
      return fail('One of the fields is too long')
    }
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return fail('Please enter a valid email address')
    }
    if (!PHONE_RE.test(phone)) {
      return fail('Please enter a valid phone number')
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('[contact] EMAIL_USER / EMAIL_PASS not configured')
      return fail('Failed to send email', 500)
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      // Lets the owner hit "Reply" and answer the customer directly.
      replyTo: `${name.replace(/[\r\n<>"]/g, '')} <${email}>`,
      // Strip CR/LF so the subject can't be used for header injection.
      subject: `New Contact Message - ${subject.replace(/[\r\n]+/g, ' ')}`,
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact] send failed', error)
    return fail('Failed to send email', 500)
  }
}
