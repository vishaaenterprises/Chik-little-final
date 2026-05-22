export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F3' }}>
      
      {/* Hero Header */}
      <div style={{ backgroundColor: '#1F4F4D' }} className="py-16 px-6 text-center">
        <p className="text-sm font-medium mb-3" style={{ color: '#F6C453', letterSpacing: '0.15em' }}>
          LITTLE CHIKU
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Privacy Policy
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
            At <strong>Little Chiku</strong>, your trust means everything to us.
            We are committed to protecting the personal information you share
            with us. This Privacy Policy outlines how we collect, use, store,
            and safeguard your data when you shop with us.
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
                Information We Collect
              </h2>
            </div>
            <p className="text-gray-600 leading-8">
              When you create an account, place an order, or contact our support
              team, we may collect the following information:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Full name, email address, and phone number',
                'Shipping and billing address',
                'Payment details (processed securely via payment gateways)',
                'Order history and product preferences',
                'Device information and browsing behavior on our site',
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
                How We Use Your Information
              </h2>
            </div>
            <ul className="space-y-2">
              {[
                'To process, confirm, and deliver your orders on time',
                'To send order updates, tracking details, and delivery notifications',
                'To provide prompt and helpful customer support',
                'To personalise your shopping experience and product recommendations',
                'To send promotional offers and new arrival updates (you can opt out anytime)',
                'To detect and prevent fraudulent activity on our platform',
                'To improve our website performance and user experience',
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
                Sharing of Information
              </h2>
            </div>
            <p className="text-gray-600 leading-8">
              We respect your privacy and <strong>never sell your personal data</strong>.
              We may share limited information only with:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Trusted payment gateway providers (Razorpay, Stripe) to process transactions',
                'Courier and logistics partners to fulfil and deliver your orders',
                'Analytics tools (Google Analytics) to understand site usage — anonymised data only',
                'Legal authorities only if required by law',
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
                Cookies
              </h2>
            </div>
            <p className="text-gray-600 leading-8">
              Our website uses cookies to remember your preferences, keep items
              in your cart, and analyse traffic. You can disable cookies in your
              browser settings at any time, though some features of the site may
              not function correctly without them.
            </p>
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
                Data Security
              </h2>
            </div>
            <p className="text-gray-600 leading-8">
              We use SSL encryption and secure servers to protect your data. All
              payment transactions are processed through PCI-DSS compliant
              payment gateways. While we take all reasonable precautions, no
              method of internet transmission is 100% secure.
            </p>
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
                Your Rights
              </h2>
            </div>
            <p className="text-gray-600 leading-8 mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2">
              {[
                'Access the personal data we hold about you',
                'Request correction of inaccurate information',
                'Request deletion of your account and associated data',
                'Opt out of marketing communications at any time',
                'Lodge a complaint with the relevant data protection authority',
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
                07
              </div>
              <h2 className="text-xl font-bold text-white">
                Contact Us
              </h2>
            </div>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              For any privacy-related queries or to exercise your rights, reach
              out to us:
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