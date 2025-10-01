'use client'

import HeroCarousel from './HeroCarousel'
import { useMedia } from '@/src/providers/MediaProvider'

export default function HomeHeroCarousel() {
  const { getImagesByTitle } = useMedia()

  // Fetch hero carousel images from WordPress media
  const heroImages = [
    getImagesByTitle('core_hero_landing_1')[0],
    getImagesByTitle('core_hero_landing_2')[0],
    getImagesByTitle('core_hero_landing_3')[0]
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
