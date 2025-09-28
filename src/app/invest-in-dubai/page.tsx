import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

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

          {/* Text content below image */}
          <div className="w-1/2 mt-12 " style={{ textAlign: 'left' }}>
            <h3
              className="mb-4"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                color: '#000'
              }}
            >
              Dubai real estate market performance and investment insights
            </h3>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#666'
              }}
            >
              Our data-driven approach provides transparent market analytics. We track comprehensive investment metrics to guide your decisions.
            </p>
          </div>
        </div>
      </section>


    </div>
  )
}