'use client'

import SimpleCarousel from './SimpleCarousel'
import GuidesCarousel from './GuidesCarousel'
import { useMedia } from '@/src/providers/MediaProvider'

interface HomeCarouselsProps {
  properties: Array<{
    id: number
    title: {
      rendered: string
    }
    excerpt: {
      rendered: string
    }
    slug: string
    type?: string
    developer?: number[]
    acf?: {
      developer_id?: number
      price?: string
      price_from?: string
      location?: string
      status?: string
    }
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string
        alt_text?: string
      }>
      developer?: Array<{
        id: number
        slug: string
        title: {
          rendered: string
        }
      }>
    }
  }>
  guides: Array<{
    id: number
    title: {
      rendered: string
    }
    excerpt: {
      rendered: string
    }
    slug: string
    type?: string
    developer?: number[]
    acf?: {
      developer_id?: number
      price?: string
      price_from?: string
      location?: string
      status?: string
    }
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string
        alt_text?: string
      }>
      developer?: Array<{
        id: number
        slug: string
        title: {
          rendered: string
        }
      }>
    }
  }>
}

export default function HomeCarousels({ properties, guides }: HomeCarouselsProps) {
  const { getImageByTitle } = useMedia()
  const projectTileImage = getImageByTitle('core_project_tile')

  return (
    <>
      {/* Project Cards Section */}
      {properties.length > 0 && <SimpleCarousel posts={properties} fallbackImage={projectTileImage || undefined} />}

      {/* Guides Section */}
      {guides.length > 0 && <GuidesCarousel posts={guides} fallbackImage={projectTileImage || undefined} />}
    </>
  )
}
