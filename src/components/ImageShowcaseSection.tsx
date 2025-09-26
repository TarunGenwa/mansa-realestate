'use client'

import Image from 'next/image'

interface ImageShowcaseSectionProps {
  mediaImages: Array<{
    id: number
    source_url: string
    alt_text: string
    title: {
      rendered: string
    }
    caption: {
      rendered: string
    }
  }>
}

export default function ImageShowcaseSection({ mediaImages }: ImageShowcaseSectionProps) {
  // Filter out the project tile and hero images for this showcase
  const showcaseImages = mediaImages.filter(img =>
    !img.title.rendered.toLowerCase().includes('project_tile') &&
    !img.title.rendered.toLowerCase().includes('fc52ba8aedbbfe413f98241d1568a6cc96c2dec61')
  ).slice(0, 9) // Show up to 9 images

  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="w-[40%] mb-16">
          <h2
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400,
              fontSize: '32px',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
          >
            Embrassez des espaces d'exception conçus pour votre style de vie
          </h2>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden group cursor-pointer ${
                index === 0 ? 'md:col-span-2 md:row-span-2' :
                index === 3 ? 'lg:row-span-2' : ''
              }`}
              style={{
                height: index === 0 ? '600px' : index === 3 ? '600px' : '280px'
              }}
            >
              <Image
                src={image.source_url}
                alt={image.alt_text || image.title.rendered}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                }
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {image.caption.rendered && (
                    <p
                      className="text-white text-sm"
                      style={{
                        fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                        fontWeight: 300
                      }}
                      dangerouslySetInnerHTML={{ __html: image.caption.rendered }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fallback if no images */}
        {showcaseImages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className={`relative bg-gray-200 overflow-hidden group cursor-pointer ${
                  index === 1 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{
                  height: index === 1 ? '600px' : '280px'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p
                    className="text-gray-500"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 300
                    }}
                  >
                    Image {index}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}