'use client'

import Image from 'next/image'
import { useMedia } from '@/src/providers/MediaProvider'
import { useState } from 'react'

export default function ImageShowcaseSection() {
  const { mediaImages } = useMedia()
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  // Filter images with "Grid Image" prefix (from ImageKit)
  const gridImages = mediaImages
    .filter(img => img.title.rendered.toLowerCase().startsWith('grid image'))
    .filter(img => img.row && img.col) // Ensure they have position data
    .sort((a, b) => {
      // Sort by row first, then by column
      if (a.row !== b.row) return a.row! - b.row!
      return a.col! - b.col!
    })

  console.log('ImageShowcaseSection - All media images:', mediaImages)
  console.log('ImageShowcaseSection - Filtered core_GI_ images:', gridImages)
  console.log('ImageShowcaseSection - Grid images details:', gridImages.map(img => ({
    title: img.title.rendered,
    row: img.row,
    col: img.col,
    source_url: img.source_url
  })))

  const handleImageLoad = (imageId: number) => {
    setLoadedImages(prev => new Set([...prev, imageId]))
  }

  return (
    <section className="py-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
      <div>
        {/* Heading */}
        <div className="w-[40%] mb-16">
           <p className='text-body text-mont-regular text-capitalize' >
              INSIGHTS & ART DE VIVRE         
           </p>
          <p className='text-h3 text-play-regular text-black'
          > 
            Embrassez des espaces <span className='text-play-black-italic'>d&apos;exception </span> conçus pour votre <span className='text-play-black-italic'>style</span>  de vie
          </p>
        </div>

        {/* Image Grid - 5 columns, 3 rows */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-[280px]">
          {gridImages.map((image) => {
            // Get span info from the image data
            const hasColSpan = image.span?.cols
            const hasRowSpan = image.span?.rows

            // Calculate grid styles based on span data
            let gridColumnStyle = `${image.col}`
            let gridRowStyle = `${image.row}`
            let colSpanClass = ''
            let rowSpanClass = ''

            if (hasColSpan) {
              if (image.span.cols === 'remaining') {
                gridColumnStyle = `${image.col} / -1`
              } else if (typeof image.span.cols === 'number') {
                colSpanClass = `lg:col-span-${image.span.cols}`
                gridColumnStyle = `${image.col} / span ${image.span.cols}`
              }
            }

            if (hasRowSpan && typeof image.span.rows === 'number') {
              rowSpanClass = `lg:row-span-${image.span.rows}`
              gridRowStyle = `${image.row} / span ${image.span.rows}`
            }

            const isLoaded = loadedImages.has(image.id)

            return (
              <div
                key={image.id}
                className={`relative overflow-hidden group cursor-pointer ${colSpanClass} ${rowSpanClass}`}
                style={{
                  gridColumn: gridColumnStyle,
                  gridRow: gridRowStyle
                }}
              >
                {/* Loading placeholder */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                )}

                <Image
                  src={image.source_url}
                  alt={image.alt_text || image.title.rendered}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={() => handleImageLoad(image.id)}
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
                <p className="text-gray-500">core_GI_1_1</p>
              </div>
            </div>
            <div className="relative bg-gray-200 overflow-hidden lg:col-span-4 lg:row-span-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">core_GI_1_2 (spans 4 cols, 2 rows)</p>
              </div>
            </div>
            {/* Row 3 - Example with 2 images, last one fills remaining space */}
            <div className="relative bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">core_GI_3_1</p>
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
                  core_GI_3_2 (fills remaining cols)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}