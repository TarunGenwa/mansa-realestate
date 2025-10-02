'use client'

import HeroCarousel from './HeroCarousel'
import { useMedia } from '@/src/providers/MediaProvider'

export default function HomeHeroCarousel() {
  const { getImagesByTitle } = useMedia()

  // Fetch hero carousel images from ImageKit
  const heroImages = [
    getImagesByTitle('Hero Landing 1')[0],
    getImagesByTitle('Hero Landing 2')[0],
    getImagesByTitle('Hero Landing 3')[0]
  ].filter(Boolean).map(img => ({
    source_url: img.source_url,
    alt_text: img.alt_text,
    title: img.title
  }))

  if (heroImages.length === 0) {
    return null
  }

  return <HeroCarousel images={heroImages} />
}
