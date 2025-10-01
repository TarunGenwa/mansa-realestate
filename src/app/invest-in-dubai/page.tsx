import { Metadata } from 'next'
import Link from 'next/link'
import ContactFormSection from '@/src/components/ContactFormSection'
import InvestDubaiContent from '@/src/components/InvestDubaiContent'

// Enable ISR - revalidate every 6 hours for invest page
export const revalidate = 21600

export const metadata: Metadata = {
  title: 'Invest in Dubai - Mansa',
  description: "Unlock unprecedented opportunities in the Middle East's most dynamic property landscape. Discover strategic investments with guaranteed returns.",
}

export default async function InvestInDubaiPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen" style={{ paddingLeft: '87px', paddingRight: '87px', paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="flex flex-col items-center">
          {/* Hero Text */}
          <div className="text-center mb-12 max-w-5xl">
            <h1
              className="mb-6"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '48px',
                lineHeight: '120%',
                letterSpacing: '0%',
                textAlign: 'center'
              }}
            >
              Invest in Dubai&apos;s golden real estate market
            </h1>

            <p
              className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                lineHeight: '1.6'
              }}
            >
              Unlock unprecedented opportunities in the Middle East&apos;s most dynamic property landscape.
              Discover strategic investments with guaranteed returns.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/properties"
              className="px-10 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              Explore
            </Link>

            <Link
              href="/contact"
              className="px-10 py-4 border-2 rounded-full border-black text-black hover:bg-black hover:text-white transition-all duration-300"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              Contact
            </Link>
          </div>

          <InvestDubaiContent />

        </div>
      </section>

      {/* Contact Form Section */}
      <ContactFormSection reverseOrder={true} />

    </div>
  )
}