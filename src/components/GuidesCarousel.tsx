'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface GuidesCarouselProps {
  posts: Array<{
    id: number
    title: {
      rendered: string
    }
    excerpt: {
      rendered: string
    }
    slug: string
    date?: string
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string
        alt_text?: string
      }>
      author?: Array<{
        name: string
      }>
    }
  }>
  fallbackImage?: {
    source_url: string
    alt_text?: string
  }
}

export default function GuidesCarousel({ posts, fallbackImage }: GuidesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const cardsToShow = 3 // Number of cards visible at once
  const maxIndex = Math.max(0, posts.length - cardsToShow)

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <section className="py-20 bg-white" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
      <div>
        {/* Section Header - Similar to ImageShowcaseSection */}
        <div className="mb-12">
          <p className='text-body text-mont-regular'>
            INVESTISSEMENT ET GUIDES
          </p>
          <p className='text-h3 text-mont-regular mt-2'>
             Investir et  <span className='text-h3 text-play-black-italic'>Vivre à Dubaï,</span>  <br></br> nos guides d’experts 
          </p>

         
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (360 + 24)}px)` // 360px card width + 24px gap
              }}
            >
              {posts.map((post) => {
                const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]
                const imageUrl = featuredImage?.source_url || fallbackImage?.source_url || '/placeholder.jpg'
                const imageAlt = featuredImage?.alt_text || post.title.rendered

                // Strip HTML tags from excerpt
                const cleanExcerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'

                // Link to individual guide page
                const postLink = `/guides/${post.slug}`

                return (
                  <Link
                    key={post.id}
                    href={postLink}
                    className="relative flex-shrink-0 rounded-lg overflow-hidden group cursor-pointer block bg-[#EDECE3] shadow-sm hover:shadow-lg transition-all duration-300"
                    style={{ width: '360px' }}
                  >
                    {/* Image Container */}
                    <div className="relative" style={{ height: '240px' }}>
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="360px"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-6">
                      <h3 className="text-xl text-mont-semibold mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {post.title.rendered}
                      </h3>
                      <p className="text-gray-600 text-sm text-mont-regular line-clamp-3 mb-4">
                        {cleanExcerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {post.date && (
                          <span className="text-mont-regular">
                            {formatDate(post.date)}
                          </span>
                        )}
                        <span className="text-mont-semibold text-black group-hover:translate-x-1 transition-transform">
                          Lire plus →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Navigation Arrows - Only show if more than cardsToShow */}
          {posts.length > cardsToShow && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '20px'
                }}
              >
                ←
              </button>

              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '20px'
                }}
              >
                →
              </button>
            </>
          )}

          {/* Dots Indicator - Only show if more than one page */}
          {maxIndex > 0 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentIndex === index
                      ? 'bg-black'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}