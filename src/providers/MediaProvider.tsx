'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { wpApi } from '@/lib/api/wordpress'

interface MediaImage {
  id: number
  source_url: string
  alt_text: string
  title: {
    rendered: string
  }
  caption: {
    rendered: string
  }
}

interface MediaContextType {
  mediaImages: MediaImage[]
  isLoading: boolean
  getImageByTitle: (titleIncludes: string) => MediaImage | undefined
  getImagesByTitle: (titleIncludes: string) => MediaImage[]
}

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export function MediaProvider({ children }: { children: ReactNode }) {
  const [mediaImages, setMediaImages] = useState<MediaImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        // Fetch all images including those with core_ prefix
        const images = await wpApi.media.getAll({
          media_type: 'image',
          per_page: 100,
          search: 'core_'
        })
        setMediaImages(images)
        console.log('MediaProvider: Fetched', images.length, 'images')
      } catch (error) {
        console.error('Error fetching media images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedia()
  }, [])

  const getImageByTitle = (titleIncludes: string): MediaImage | undefined => {
    return mediaImages.find(img =>
      img.title.rendered.toLowerCase().includes(titleIncludes.toLowerCase())
    )
  }

  const getImagesByTitle = (titleIncludes: string): MediaImage[] => {
    return mediaImages.filter(img =>
      img.title.rendered.toLowerCase().includes(titleIncludes.toLowerCase())
    )
  }

  return (
    <MediaContext.Provider value={{ mediaImages, isLoading, getImageByTitle, getImagesByTitle }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const context = useContext(MediaContext)
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider')
  }
  return context
}
