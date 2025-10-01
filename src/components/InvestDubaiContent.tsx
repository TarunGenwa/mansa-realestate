'use client'

import Image from 'next/image'
import { useMedia } from '@/src/providers/MediaProvider'

export default function InvestDubaiContent() {
  const { getImageByTitle } = useMedia()

  const investDubaiImage = getImageByTitle('investdubai')
  const ig12Image = getImageByTitle('ig_1_2')
  const ig13Image = getImageByTitle('ig_1_3')

  return (
    <>
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
      <div className='flex w-full justify-start'>
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

      {/* Stats Showcase Section */}
      <section className="py-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* First Column - Single Element */}
            <div className="lg:col-span-1">
              <div
                className="h-full rounded-lg flex flex-col items-center space-around"
                style={{
                  backgroundColor: '#ECE8DD',
                  minHeight: '400px'
                }}
              >
                <div className="text-center p-8 h-full">
                  <h3
                    className="text-3xl mb-4"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 500,
                      color: '#000',
                      fontSize: '96px'
                    }}
                  >
                    12%
                  </h3>
                </div>

                <div className='text-center p-8'>
                  <p
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#666'
                    }}
                  >
                    Annual property appreciation
                  </p>
                  <p
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#666'
                    }}
                  >
                    Consistent growth in prime Dubai property values
                  </p>
                </div>
              </div>
            </div>

            {/* Second Column - 4 Cards Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 - Image Card */}
                <div
                  className="rounded-lg w-full relative overflow-hidden"
                  style={{
                    height: '300px'
                  }}
                >
                  {ig12Image ? (
                    <Image
                      src={ig12Image.source_url}
                      alt={ig12Image.alt_text || "Dubai Investment Insights"}
                      fill
                      className="object-cover rounded-lg"
                      sizes="400px"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#ECE8DD' }}
                    >
                      <span className="text-gray-500">IG_1_2 Image</span>
                    </div>
                  )}
                </div>

                {/* Card 2 */}
                <div
                  className="rounded-lg flex  w-full flex-col items-center space-around"
                  style={{
                    backgroundColor: '#ECE8DD',
                    height: '300px'
                  }}
                >
                  <div className="text-center p-8 h-full">
                    <h3
                      className="text-3xl mb-4"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 500,
                        color: '#000',
                        fontSize: '96px'
                      }}
                    >
                      25K
                    </h3>
                  </div>

                  <div className='text-center p-4'>
                    <p
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#666'
                      }}
                    >
                      New investor entries
                    </p>
                    <p
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#666'
                      }}
                    >
                      Increasing international investor confidence in Dubai's real estate sector
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div
                  className="rounded-lg flex w-full flex-col items-center space-around"
                  style={{
                    backgroundColor: '#ECE8DD',
                    height: '300px'
                  }}
                >
                  <div className="text-center p-8 h-full">
                    <h3
                      className="text-3xl mb-4"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 500,
                        color: '#000',
                        fontSize: '96px'
                      }}
                    >
                      8.5%
                    </h3>
                  </div>

                  <div className='text-center p-4'>
                    <p
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#666'
                      }}
                    >
                      Rental Yield
                    </p>
                    <p
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#666'
                      }}
                    >
                      Competitive returns compared to global real estate markets
                    </p>
                  </div>
                </div>

                {/* Card 4 - Image Card */}
                <div
                  className="rounded-lg w-full relative overflow-hidden"
                  style={{
                    height: '300px'
                  }}
                >
                  {ig13Image ? (
                    <Image
                      src={ig13Image.source_url}
                      alt={ig13Image.alt_text || "Dubai Investment Insights"}
                      fill
                      className="object-cover rounded-lg"
                      sizes="400px"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#ECE8DD' }}
                    >
                      <span className="text-gray-500">IG_1_3 Image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
