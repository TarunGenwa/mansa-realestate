import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/src/components/Footer'

export const metadata: Metadata = {
  title: 'Invest in Dubai - Mansa',
  description: "Unlock unprecedented opportunities in the Middle East's most dynamic property landscape. Discover strategic investments with guaranteed returns.",
}

export default async function InvestInDubaiPage() {
  // Fetch media images to get the investdubai image
  const mediaImages = await wpApi.media.getAll({ media_type: 'image', per_page: 100 }).catch(() => [])

  // Find the investdubai image
  const investDubaiImage = mediaImages.find(img =>
    img.title.rendered.toLowerCase().includes('investdubai')
  )

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen" style={{ paddingLeft: '87px', paddingRight: '87px', paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="flex flex-col items-center">
          {/* Hero Text */}
          <div className="text-center mb-12 max-w-5xl">
            <h1
              className="text-5xl lg:text-6xl mb-6"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 700,
                lineHeight: '1.2'
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
              className="px-10 py-4 bg-black text-white hover:bg-gray-800 transition-all duration-300"
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
              className="px-10 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              Contact
            </Link>
          </div>

          {/* Image */}
          <div className="w-full relative" style={{ height: '600px' }}>
            {investDubaiImage ? (
              <Image
                src={investDubaiImage.source_url}
                alt={investDubaiImage.alt_text || "Invest in Dubai Real Estate"}
                fill
                className="object-cover rounded-lg"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-xl">Dubai Investment Image</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-gray-50" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl text-center mb-16"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 600
            }}
          >
            Why Invest in Dubai?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tax Benefits */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                0%
              </div>
              <h3
                className="text-xl font-semibold"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                Tax-Free Income
              </h3>
              <p
                className="text-gray-600"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              >
                No personal income tax, capital gains tax, or property tax on residential properties
              </p>
            </div>

            {/* ROI */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                8%+
              </div>
              <h3
                className="text-xl font-semibold"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                High ROI
              </h3>
              <p
                className="text-gray-600"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              >
                Average rental yields between 6-10%, among the highest globally
              </p>
            </div>

            {/* Golden Visa */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                10Y
              </div>
              <h3
                className="text-xl font-semibold"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                Golden Visa
              </h3>
              <p
                className="text-gray-600"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              >
                Property investment of AED 2M+ qualifies for 10-year residency visa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl text-center mb-16"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 600
            }}
          >
            Your Investment Journey
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'Discuss your investment goals and budget with our experts' },
              { step: '02', title: 'Property Selection', desc: 'Choose from curated properties matching your criteria' },
              { step: '03', title: 'Due Diligence', desc: 'Complete legal checks and documentation with our support' },
              { step: '04', title: 'Investment', desc: 'Finalize purchase and start earning returns' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-5xl font-bold mb-4"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    color: '#224D56'
                  }}
                >
                  {item.step}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="text-center max-w-4xl mx-auto">
          <h2
            className="text-4xl mb-6"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 600
            }}
          >
            Ready to Start Your Dubai Investment Journey?
          </h2>
          <p
            className="text-xl mb-8 text-gray-300"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 300
            }}
          >
            Let our experts guide you through every step of your real estate investment in Dubai
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-white text-black hover:bg-gray-200 transition-all duration-300"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: '16px'
            }}
          >
            Schedule Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}