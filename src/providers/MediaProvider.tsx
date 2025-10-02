'use client'

import { createContext, useContext, ReactNode } from 'react'
import { getImageUrlByTitle, getImageConfig } from '@/src/lib/utils/imageResolver'
import imageConfig from '@/src/config/images.json'

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
  // Convert images.json to MediaImage format
  const buildMediaImages = (): MediaImage[] => {
    const images: MediaImage[] = []
    let id = 1

    const extractImages = (obj: any): void => {
      // Handle arrays
      if (Array.isArray(obj)) {
        obj.forEach(item => extractImages(item))
        return
      }

      // Handle objects
      if (typeof obj === 'object' && obj !== null) {
        // If this object has url and title, it's an image entry
        if (obj.url && obj.title) {
          images.push({
            id: id++,
            source_url: obj.url,
            alt_text: obj.description || obj.title,
            title: {
              rendered: obj.title
            },
            caption: {
              rendered: obj.description || ''
            }
          })
        }

        // Recursively process nested objects/arrays
        Object.values(obj).forEach(value => {
          if (typeof value === 'object' && value !== null) {
            extractImages(value)
          }
        })
      }
    }

    extractImages(imageConfig)
    return images
  }

  const mediaImages = buildMediaImages()

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
    <MediaContext.Provider value={{ mediaImages, isLoading: false, getImageByTitle, getImagesByTitle }}>
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
