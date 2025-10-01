'use client'

import Image from 'next/image'
import { useMedia } from '@/src/providers/MediaProvider'

interface PropertyImagesProps {
  featuredImageUrl?: string
  featuredImageAlt?: string
}

export default function PropertyImages({ featuredImageUrl, featuredImageAlt }: PropertyImagesProps) {
  const { mediaImages } = useMedia()

  // Look for property-specific images using alt text
  const heroImageLeft = mediaImages.find(img => img.alt_text?.toLowerCase().includes('property_hero_left'))
  const heroImageRight = mediaImages.find(img => img.alt_text?.toLowerCase().includes('property_hero_right'))
  const overviewImage = mediaImages.find(img => img.alt_text?.toLowerCase().includes('property_overview'))

  return {
    heroImageLeft,
    heroImageRight,
    overviewImage
  }
}

// Export a hook instead
export function usePropertyImages(featuredImageUrl?: string, featuredImageAlt?: string) {
  const { mediaImages } = useMedia()

  // Look for property-specific images using alt text
  const heroImageLeft = mediaImages.find(img => img.alt_text?.toLowerCase().includes('property_hero_left'))
  const heroImageRight = mediaImages.find(img => img.alt_text?.toLowerCase().includes('property_hero_right'))
  const overviewImage = mediaImages.find(img => img.alt_text?.toLowerCase().includes('property_overview'))

  return {
    heroImageLeft,
    heroImageRight,
    overviewImage
  }
}
