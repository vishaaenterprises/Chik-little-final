'use client'

import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ChevronDown,
  Send,
  Instagram,
  Facebook,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day hassle-free return policy. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Items must be unused and in their original packaging.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping within India takes 5-7 business days. Express shipping (available for select locations) takes 2-3 business days. We also offer free shipping on all orders above Rs. 499.',
  },
  {
    question: 'Are your products safe for newborns?',
    answer:
      'Absolutely! All our products are made from 100% GOTS certified organic cotton, are hypoallergenic, and free from harmful chemicals. They are safe for even the most delicate newborn skin.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer:
      'Yes! We offer beautiful eco-friendly gift wrapping for all orders. You can select this option at checkout for a small additional fee. Our gift wrap includes a handwritten note card.',
  },
  {
    question: 'Can I customize products for bulk orders?',
    answer:
      'Yes, we offer customization options for bulk orders (minimum 20 pieces). This includes custom embroidery, special packaging, and exclusive designs. Contact us for more details.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track your order by logging into your account on our website.',
  },
]

const contactCards = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Chat with us directly',
    value: '+91 7728009522',
    link: 'https://wa.me/917728009522',
    accent: '#25D366',
    bg: '#EDFFF5',
    shadow: 'rgba(37,211,102,0.15)',
  },
  {
    icon: Mail,
    title: 'Email Us',
    description: 'We reply within 24 hours',
    value: 'vishaaenterprises@gmsil.com',
    link: 'mailto:vishaaenterprises@gmsil.com',
    accent: '#4FBDBA',
    bg: '#DDF5F4',
    shadow: 'rgba(79,189,186,0.15)',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon–Sat, 10am–7pm',
    value: '+91 98765 43210',
    link: 'tel:+919876543210',
    accent: '#F6C453',
    bg: '#FFF4D6',
    shadow: 'rgba(246,196,83,0.2)',
  },
  
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    setIsSubmitting(true)

    const response = await fetch('/api/contact', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(formState),
    })

    const data = await response.json()

    if (data.success) {
      setIsSubmitted(true)

      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } else {
      alert(data.message || 'Failed to send message')
    }
  } catch (error) {
    console.log(error)

    alert('Something went wrong')
  } finally {
    setIsSubmitting(false)
  }
}

  const inputClass =
    'w-full px-4 py-3.5 bg-[#F6FBFB] border border-[#E7EEEE] rounded-2xl text-[#2B2B2B] placeholder:text-[#A0B4B4] focus:outline-none focus:border-[#4FBDBA] focus:ring-2 focus:ring-[#4FBDBA]/20 transition-all duration-200 text-sm'

  return (
    <MainLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#F6FBFB]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-[#4FBDBA]/8 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[360px] h-[360px] rounded-full bg-[#F6C453]/12 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#DDF5F4]/60 blur-2xl" />
        </div>

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#4FBDBA 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DDF5F4] border border-[#4FBDBA]/30 rounded-full text-[#2F7F7C] text-xs font-semibold tracking-wide mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F6C453]" />
              WE'RE ALWAYS HERE FOR YOU
            </motion.div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[#2B2B2B] leading-[1.15] mb-5 tracking-tight">
              We&apos;d Love to{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#4FBDBA]">
                  Hear From You
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-[#F6C453]/30 rounded-full -z-0" />
              </span>
            </h1>

            <p className="text-[#6B6B6B] text-lg leading-relaxed max-w-xl mx-auto">
              Questions about our products, help with an order, or just want to
              say hello — we&apos;re a message away.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactCards.map((card, idx) => {
              const Icon = card.icon
              return (
                <motion.a
                  key={card.title}
                  href={card.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative bg-white border border-[#E7EEEE] rounded-[2rem] p-6 overflow-hidden"
                  style={{
                    boxShadow: `0 10px 30px ${card.shadow}`,
                  }}
                >
                  {/* Subtle corner glow on hover */}
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                    style={{ backgroundColor: card.accent }}
                  />

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: card.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.accent }} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-widest text-[#A0B4B4] mb-1">
                    {card.description}
                  </p>
                  <h3 className="font-heading text-[#2B2B2B] font-bold text-lg mb-1">
                    {card.title}
                  </h3>
                  <p
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: card.accent }}
                  >
                    {card.value}
                  </p>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Form + Info ── */}
<section className="py-20 bg-[#F6FBFB]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-start">
      {/* Form — wider column */}
      <motion.div
        className="lg:col-span-3"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white border border-[#E7EEEE] rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(79,189,186,0.08)]">
          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-[#2B2B2B] mb-2">
              Send Us a Message
            </h2>

            <p className="text-[#6B6B6B] text-sm">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center py-10"
              >
                <div className="w-20 h-20 rounded-full bg-[#DDF5F4] flex items-center justify-center mb-5 shadow-[0_8px_24px_rgba(79,189,186,0.2)]">
                  <Send className="w-9 h-9 text-[#4FBDBA]" />
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#2B2B2B] mb-2">
                  Message Sent! 🎉
                </h3>

                <p className="text-[#6B6B6B] mb-6 max-w-xs">
                  Thank you for reaching out. We&apos;ll be in touch
                  within 24 hours.
                </p>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[#4FBDBA] text-sm font-semibold hover:text-[#2F7F7C] underline underline-offset-2 transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2B2B] mb-2 tracking-wide uppercase">
                      Your Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          name: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="Meera Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2B2B] mb-2 tracking-wide uppercase">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          email: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="meera@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2B2B] mb-2 tracking-wide uppercase">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          phone: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2B2B] mb-2 tracking-wide uppercase">
                      Subject
                    </label>

                    <select
                      name="subject"
                      required
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          subject: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="return">Returns & Exchanges</option>
                      <option value="bulk">Bulk Orders</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-2 tracking-wide uppercase">
                    Your Message
                  </label>

                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        message: e.target.value,
                      })
                    }
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#4FBDBA] hover:bg-[#2F7F7C] text-white font-semibold rounded-2xl shadow-[0_12px_30px_rgba(79,189,186,0.28)] hover:shadow-[0_16px_40px_rgba(47,127,124,0.32)] transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-70 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF4D6] border border-[#F6C453]/40 rounded-full text-[#B8861A] text-xs font-semibold tracking-wide mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              QUICK ANSWERS
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#2B2B2B] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#6B6B6B] text-sm">
              Everything you need to know about Little Chiku
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-[#F6FBFB] border rounded-[1.5rem] overflow-hidden transition-all duration-200 ${
                  openFaq === idx
                    ? 'border-[#4FBDBA]/40 shadow-[0_8px_24px_rgba(79,189,186,0.10)]'
                    : 'border-[#E7EEEE] shadow-none'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="font-heading font-semibold text-[#2B2B2B] text-sm leading-snug">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#E7EEEE] flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-[#4FBDBA]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[#6B6B6B] text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
