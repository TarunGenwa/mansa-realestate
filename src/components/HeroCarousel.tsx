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
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(images.length).fill(false))

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

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }

  const isCurrentImageLoaded = imagesLoaded[currentIndex]

  return (
    <div className="relative h-screen m-2" style={{ width: 'calc(100% - 16px)' }}>
      {/* Loading Placeholder */}
      {!isCurrentImageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-start justify-center pt-32" style={{ background: 'linear-gradient(180deg, #224D56 2.19%, rgba(0, 0, 0, 0) 82.03%)' }}>
            <div className="text-center text-white px-4 mt-16">
              <div className="h-12 w-64 bg-white/20 rounded mb-4 mx-auto"></div>
              <div className="h-16 w-96 bg-white/20 rounded mb-8 mx-auto"></div>
              <div className="h-12 w-48 bg-white/30 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      )}

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
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            className="object-cover object-center"
            sizes="100vw"
            onLoad={() => handleImageLoad(index)}
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
          <p
            className="mt-6 uppercase tracking-wide"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 300,
              fontSize: '20px',
              letterSpacing: '0.05em'
            }}
          >
            L'IMMOBILIER D'EXCEPTION AUX ÉMIRATS ARABES UNIS
          </p>
          <Link href="/contact" className="inline-flex items-center justify-between mt-8 pl-8 pr-4 py-3 text-white border-2 border-white rounded-full transition-all duration-300 min-w-[200px] hover:bg-white hover:text-black">
            <span className="flex-1 text-left" style={{ fontSize: '18px' }}>Contact</span>
            <Image src="/right-arrow-white.svg" alt="" width={32} height={32} className="ml-2 transition-all duration-300" />
          </Link>
        </div>
      </div>


      {/* Dots Indicator (only show if more than 1 image) */}
      {images.length > 1 && (
        <div className="absolute bottom-8 right-8 flex space-x-3 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-200 ${
                currentIndex === index
                  ? 'w-8 h-2 bg-white'
                  : 'w-6 h-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}