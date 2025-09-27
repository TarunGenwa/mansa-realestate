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
  // Filter images with GI_ prefix and organize by grid position
  const gridImages = mediaImages
    .filter(img => img.title.rendered.startsWith('GI_'))
    .map(img => {
      const title = img.title.rendered
      // Parse GI_R_C format where R is row (4th char) and C is column (last char)
      const parts = title.split('_')
      if (parts.length >= 3) {
        const row = parseInt(parts[1]) || 1
        const col = parseInt(parts[2]) || 1
        return { ...img, row, col }
      }
      return { ...img, row: 1, col: 1 }
    })
    .sort((a, b) => {
      // Sort by row first, then by column
      if (a.row !== b.row) return a.row - b.row
      return a.col - b.col
    })

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
          {gridImages.map((image) => {
            // Determine grid positioning and spanning based on row/col values
            const gridColumn = `${image.col} / span 1`
            const gridRow = `${image.row} / span 1`

            // Special cases for larger images (you can adjust these rules)
            const isLarge = (image.row === 1 && image.col === 1) || (image.row === 2 && image.col === 1)
            const colSpan = isLarge ? 'lg:col-span-2' : ''
            const rowSpan = isLarge ? 'lg:row-span-2' : ''

            return (
              <div
                key={image.id}
                className={`relative overflow-hidden group cursor-pointer ${colSpan} ${rowSpan}`}
                style={{
                  gridColumn: `${image.col}`,
                  gridRow: `${image.row}`
                }}
              >
                <Image
                  src={image.source_url}
                  alt={image.alt_text || image.title.rendered}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            )
          })}
        </div>

        {/* Fallback if no images */}
        {gridImages.length === 0 && (
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