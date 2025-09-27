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

        {/* Image Grid - 5 columns, 3 rows */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-[280px]">
          {gridImages.map((image, index) => {
            // Special cases for specific positions
            const isRow1Col1 = image.row === 1 && image.col === 1  // GI_1_1
            const isRow1Col2 = image.row === 1 && image.col === 2  // GI_1_2 - spans cols 2-5 and rows 1-2

            // Find if this is the last image in row 3
            const row3Images = gridImages.filter(img => img.row === 3)
            const isLastInRow3 = image.row === 3 && row3Images[row3Images.length - 1]?.id === image.id

            // GI_1_1 spans 1 column, 1 row (normal)
            // GI_1_2 spans columns 2-5 (4 columns) and rows 1-2 (2 rows)
            // Last image in row 3 spans from its column to the end
            const colSpan = isRow1Col2 ? 'lg:col-span-4' : ''
            const rowSpan = isRow1Col2 ? 'lg:row-span-2' : ''

            return (
              <div
                key={image.id}
                className={`relative overflow-hidden group cursor-pointer ${colSpan} ${rowSpan}`}
                style={{
                  gridColumn: isRow1Col2 ? '2 / -1' : isLastInRow3 ? `${image.col} / -1` : `${image.col}`,
                  gridRow: isRow1Col2 ? '1 / 3' : `${image.row}`
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-[280px]">
            {/* Row 1 */}
            <div className="relative bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">GI_1_1</p>
              </div>
            </div>
            <div className="relative bg-gray-200 overflow-hidden lg:col-span-4 lg:row-span-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">GI_1_2 (spans 4 cols, 2 rows)</p>
              </div>
            </div>
            {/* Row 3 - Example with 2 images, last one fills remaining space */}
            <div className="relative bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">GI_3_1</p>
              </div>
            </div>
            <div className="relative bg-gray-200 overflow-hidden lg:col-span-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className="text-gray-500"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 300
                  }}
                >
                  GI_3_2 (fills remaining cols)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}