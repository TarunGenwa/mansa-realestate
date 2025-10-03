'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Property {
  id: number
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  slug: string
  acf?: {
    location?: string
    price?: string
    price_from?: string
    status?: string
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text?: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
  }
}

interface SimilarPropertiesCarouselProps {
  properties: Property[]
}

export default function SimilarPropertiesCarousel({ properties }: SimilarPropertiesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const cardsToShow = 2 // Number of cards visible at once on desktop
  const cardWidth = 600 // Width of each card including gap
  const maxIndex = Math.max(0, properties.length - cardsToShow)

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <section className="py-12 px-8 lg:px-16">
      <h2 className="text-[20px] font-semibold mb-8">SIMILAR PROPERTIES</h2>

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`
            }}
          >
            {properties.map((property) => {
              const featuredImage = property._embedded?.['wp:featuredmedia']?.[0]
              const imageUrl = featuredImage?.source_url || '/placeholder.jpg'
              const imageAlt = featuredImage?.alt_text || property.title.rendered

              // Get tags (wp:term array contains [categories, tags])
              const tags = property._embedded?.['wp:term']?.[1] || []

              return (
                <Link
                  key={property.id}
                  href={`/properties/${property.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                  style={{ width: '576px' }}
                >
                  {/* Property Image */}
                  <div className="relative h-80 bg-gray-200">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="576px"
                    />
                  </div>

                  {/* Property Info */}
                  <div className="p-8">
                    <h3
                      className="text-2xl font-semibold mb-4 group-hover:text-gray-700 transition-colors"
                      style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                    >
                      {property.title.rendered}
                    </h3>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Property metadata */}
                    {property.acf && (
                      <div className="space-y-2">
                        {property.acf.location && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Location:</span> {property.acf.location}
                          </p>
                        )}
                        {(property.acf.price || property.acf.price_from) && (
                          <p className="text-base font-semibold text-gray-800">
                            {property.acf.price || `From ${property.acf.price_from}`}
                          </p>
                        )}
                        {property.acf.status && (
                          <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                            property.acf.status === 'available' ? 'bg-green-100 text-green-800' :
                            property.acf.status === 'sold' ? 'bg-red-100 text-red-800' :
                            property.acf.status === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {property.acf.status.replace('-', ' ').toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        {properties.length > cardsToShow && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 text-black rounded-full p-4 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              aria-label="Previous"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 text-black rounded-full p-4 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              aria-label="Next"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {properties.length > cardsToShow && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(Math.min(index, maxIndex))}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentIndex === index
                    ? 'bg-black'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
