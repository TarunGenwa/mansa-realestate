'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface SimpleCarouselProps {
  posts: Array<{
    id: number
    title: {
      rendered: string
    }
    excerpt: {
      rendered: string
    }
    slug: string
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string
        alt_text?: string
      }>
    }
  }>
  fallbackImage?: {
    source_url: string
    alt_text?: string
  }
}

export default function SimpleCarousel({ posts, fallbackImage }: SimpleCarouselProps) {
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

  return (
    <section className="py-16" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
      <div className="relative">
        {/* Carousel Container */}
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
              const cleanExcerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100) + '...'

              return (
                <div
                  key={post.id}
                  className="relative flex-shrink-0 rounded-sm overflow-hidden group cursor-pointer"
                  style={{ width: '360px', height: '577px' }}
                >
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-semibold">{post.title.rendered}</h3>
                      <p className="text-white/80 text-sm mt-2">{cleanExcerpt}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
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

        {/* Dots Indicator */}
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
      </div>
    </section>
  )
}