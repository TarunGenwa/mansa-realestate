'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PropertyGalleryProps {
  images: {
    src: string
    alt?: string
  }[]
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const imagesPerPage = 8 // 2 rows x 4 columns
  const totalPages = Math.ceil(images.length / imagesPerPage)

  const getCurrentPageImages = () => {
    const start = currentPage * imagesPerPage
    const end = start + imagesPerPage
    return images.slice(start, end)
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(currentPage * imagesPerPage + index)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedImageIndex === null) return

    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  return (
    <>
      <div className="relative">
        {/* Gallery Grid - 2 rows x 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getCurrentPageImages().map((image, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src={image.src}
                alt={image.alt || `Gallery Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={goToPreviousPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              onClick={goToNextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Page Indicator */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? 'bg-black' : 'bg-gray-300'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
            aria-label="Close lightbox"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              aria-label="Previous image"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              aria-label="Next image"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImageIndex].src}
              alt={images[selectedImageIndex].alt || `Gallery Image ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
              <span style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                {selectedImageIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  )
}