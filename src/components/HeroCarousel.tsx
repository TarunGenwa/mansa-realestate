'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroCarouselProps {
  images: Array<{
    source_url: string
    alt_text?: string
    title?: {
      rendered: string
    }
  }>
}

export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play carousel
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative h-screen m-2" style={{ width: 'calc(100% - 16px)' }}>
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.source_url}
            alt={image.alt_text || image.title?.rendered || `Hero Image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 flex items-start justify-center pt-32"
        style={{ background: 'linear-gradient(180deg, #224D56 2.19%, rgba(0, 0, 0, 0) 82.03%)' }}
      >
        <div className="text-center text-white px-4 mt-16">
          <h1 style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', lineHeight: '1' }}>
            <span className="block font-normal" style={{ fontSize: '48px', lineHeight: '1' }}>Entrez dans une</span>
            <span className="block" style={{ fontSize: '64px', lineHeight: '0.9' }}>
              <span className="italic" style={{ fontWeight: 900 }}>nouvelle</span>
              {' '}
              <span className="italic" style={{ fontWeight: 200 }}>réalité</span>
            </span>
          </h1>
          <Link href="/contact" className="inline-block mt-8 px-8 py-3 text-white border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Contact
          </Link>
        </div>
      </div>

      {/* Navigation Arrows (only show if more than 1 image) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all duration-200 z-10"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '20px'
            }}
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all duration-200 z-10"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '20px'
            }}
          >
            →
          </button>
        </>
      )}

      {/* Dots Indicator (only show if more than 1 image) */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentIndex === index
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}