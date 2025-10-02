import imageConfig from '@/src/config/images.json'

const config = imageConfig as any

/**
 * Finds an image URL by matching title from the centralized images.json configuration
 *
 * @param titleSearch - The title to search for (e.g., 'core_hero_landing_1', 'Hero Landing 1')
 * @returns The ImageKit URL if found, otherwise undefined
 */
export function getImageUrlByTitle(titleSearch: string): string | undefined {
  const searchLower = titleSearch.toLowerCase()

  const findInObject = (obj: any): string | undefined => {
    for (const prop in obj) {
      if (typeof obj[prop] === 'object') {
        // Check if this object has a URL and title that matches
        if (obj[prop].url && obj[prop].title) {
          const title = obj[prop].title.toLowerCase()
          // Check if title contains the search term or vice versa
          if (title.includes(searchLower) || searchLower.includes(title.toLowerCase())) {
            return obj[prop].url
          }
        }

        // Recursively search nested objects
        const found = findInObject(obj[prop])
        if (found) return found
      }
    }
    return undefined
  }

  return findInObject(config)
}

/**
 * Resolves an image URL, using ImageKit from images.json if available, otherwise WordPress URL
 *
 * @param wordpressUrl - The WordPress media URL (fallback)
 * @param titleSearch - The image title to search in images.json
 * @returns The resolved image URL
 */
export function resolveImageUrl(wordpressUrl: string, titleSearch?: string): string {
  // If we have a title to search, try to find it in the config
  if (titleSearch) {
    const imagekitUrl = getImageUrlByTitle(titleSearch)
    if (imagekitUrl) {
      return imagekitUrl
    }
  }

  // Fallback to WordPress URL
  return wordpressUrl
}

/**
 * Gets the image configuration by title from images.json
 *
 * @param titleSearch - The title to search for
 * @returns The image configuration object or undefined
 */
export function getImageConfig(titleSearch: string): any {
  const searchLower = titleSearch.toLowerCase()

  const findInObject = (obj: any): any => {
    for (const prop in obj) {
      if (typeof obj[prop] === 'object') {
        if (obj[prop].title) {
          const title = obj[prop].title.toLowerCase()
          if (title.includes(searchLower) || searchLower.includes(title.toLowerCase())) {
            return obj[prop]
          }
        }
        const found = findInObject(obj[prop])
        if (found) return found
      }
    }
    return undefined
  }

  return findInObject(config)
}

/**
 * Gets all image URLs from the configuration
 */
export function getAllImageUrls(): string[] {
  const urls: string[] = []

  const extractUrls = (obj: any): void => {
    for (const prop in obj) {
      if (typeof obj[prop] === 'object') {
        if (obj[prop].url) {
          urls.push(obj[prop].url)
        }
        extractUrls(obj[prop])
      }
    }
  }

  extractUrls(config)
  return urls
}
