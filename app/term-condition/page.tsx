export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F3' }}>

      {/* Hero Header */}
      <div style={{ backgroundColor: '#1F4F4D' }} className="py-16 px-6 text-center">
        <p className="text-sm font-medium mb-3" style={{ color: '#F6C453', letterSpacing: '0.15em' }}>
          LITTLE CHIKU
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Terms & Conditions
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-base">
          Last Updated: May 22, 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Intro Card */}
        <div
          className="rounded-3xl p-8 mb-12 border"
          style={{ backgroundColor: '#E8F5F4', borderColor: '#C5E0DE' }}
        >
          <p className="text-base leading-8" style={{ color: '#2d6a68' }}>
            Please read these Terms & Conditions carefully before using the
            Little Chiku website or placing an order. By accessing our website
            or making a purchase, you confirm that you have read, understood,
            and agree to be bound by these terms.
          </p>
        </div>

        <div className="space-y-10">

          {/* Section 1 */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#1F4F4D' }}
              >
                01
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1F4F4D' }}>
                Acceptance of Terms
              </h2>
            </div>
            <p className="text-gray-600 leading-8">
              By visiting or shopping at Little Chiku, you accept these Terms &
              Conditions in full. If you disagree with any part of these terms,
              please do not use our website or services. We reserve the right to
              update these terms at any time, and your continued use of the site
              constitutes acceptance of the revised terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#1F4F4D' }}
              >
                02
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1F4F4D' }}>
                Products & Pricing
              </h2>
            </div>
            <p className="text-gray-600 leading-8">
              We strive to ensure all product descriptions, images, and prices
              on our website are accurate. However, in the event of an error:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'We reserve the right to correct pricing errors before dispatch',
                'Product colours may slightly vary due to photography and screen settings',
                'We reserve the right to discontinue or modify products without notice',
                'All prices are listed in Indian Rupees (INR) and include applicable taxes',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <span
                    className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0"
                    style={{ backgroundColor: '#F6C453' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#1F4F4D' }}
              >
                03
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1F4F4D' }}>
                Orders & Payments
              </h2>
            </div>
            <ul className="space-y-2">
              {[
                'All orders are subject to product availability and confirmation',
                'Full payment must be completed before your order is dispatched',
                'We accept UPI, credit/debit cards, net banking, and popular wallets',
                'Orders can be cancelled within 12 hours of placement if not yet shipped',
                'We reserve the right to cancel orders suspected of fraud or abuse',
                'You will receive an email confirmation once your order is placed successfully',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <span
                    className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0"
                    style={{ backgroundColor: '#4FBDBA' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#1F4F4D' }}
              >
                04
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1F4F4D' }}>
                Shipping & Delivery
              </h2>
            </div>
            <ul className="space-y-2">
              {[
                'We ship across India. International shipping is not available currently',
                'Standard delivery takes 5–8 business days depending on your location',
                'Delivery timelines are estimates and may vary due to courier delays or holidays',
                'Shipping charges, if applicable, will be shown clearly at checkout',
                'Once dispatched, a tracking number will be shared via email or SMS',
                'Little Chiku is not responsible for delays caused by courier partners',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <span
                    className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0"
                    style={{ backgroundColor: '#F6C453' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#1F4F4D' }}
              >
                05
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1F4F4D' }}>
                Returns & Refunds
              </h2>
            </div>
            <p className="text-gray-600 leading-8 mb-4">
              We want you to love every Little Chiku product. If something isn't
              right:
            </p>
            <ul className="space-y-2">
              {[
                'Returns are accepted within 7 days of delivery for eligible items',
                'Products must be unused, unwashed, and returned in original packaging',
                'Items marked as "Final Sale" or "Non-Returnable" cannot be returned',
                'Refunds are processed within 7–10 business days after return verification',
                'Damaged or defective products must be reported within 48 hours of delivery',
                'Return shipping charges are borne by the customer unless the product is defective',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <span
                    className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0"
                    style={{ backgroundColor: '#4FBDBA' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#1F4F4D' }}
              >
                06
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1F4F4D' }}>
                Intellectual Property
              </h2>
            </div>
            <p className="text-gray-600 leading-8">
              All content on the Little Chiku website — including the logo,
              product photography, graphics, text, and designs — is the
              exclusive property of Little Chiku. You may not reproduce, copy,
              distribute, or commercially exploit any part of this website
              without our prior written consent.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#1F4F4D' }}
              >
                07
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1F4F4D' }}>
                Limitation of Liability
              </h2>
            </div>
            <p className="text-gray-600 leading-8">
              Little Chiku shall not be held liable for any indirect, incidental,
              or consequential damages arising from the use of our products or
              website. Our maximum liability in any case shall not exceed the
              value of the order placed by you.
            </p>
          </section>

          {/* Contact Card */}
          <section
            className="rounded-3xl p-8"
            style={{ backgroundColor: '#1F4F4D' }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#F6C453', color: '#1F4F4D' }}
              >
                08
              </div>
              <h2 className="text-xl font-bold text-white">
                Contact Us
              </h2>
            </div>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              For any queries related to these terms, reach out to our team:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <p className="text-xs mb-1" style={{ color: '#F6C453', letterSpacing: '0.1em' }}>
                  EMAIL
                </p>
                <p className="text-white font-medium">Vishaaenterprises@gmail.com</p>
              </div>
              <div
                className="rounded-2xl p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <p className="text-xs mb-1" style={{ color: '#F6C453', letterSpacing: '0.1em' }}>
                  PHONE
                </p>
                <p className="text-white font-medium">+91 77280 09522</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}