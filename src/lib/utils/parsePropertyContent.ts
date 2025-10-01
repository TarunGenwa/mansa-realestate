export interface PropertyContent {
  description: string[]
  details: {
    type?: string
    modern?: string
    targetMarket?: string
    uniqueSellingPoints?: string
    location?: string
    [key: string]: string | undefined
  }
  images: {
    src: string
    alt?: string
  }[]
  rawHtml: string
}

function normalizeKey(key: string): string {
  // Convert keys like "Target market" to "targetMarket"
  return key
    .toLowerCase()
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

// Simple parser that works both client and server side without external dependencies
export function parsePropertyContentSimple(htmlContent: string): PropertyContent {
  const content: PropertyContent = {
    description: [],
    details: {},
    images: [],
    rawHtml: htmlContent
  }

  // Simple regex-based parsing that works everywhere
  // Extract paragraph content using global flag without 's' flag
  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/g
  let paragraphMatch
  while ((paragraphMatch = paragraphRegex.exec(htmlContent)) !== null) {
    // Check if paragraph contains an image
    if (paragraphMatch[1].includes('<img')) {
      // Skip paragraphs that only contain images
      continue
    }

    // Remove HTML tags and decode entities
    const text = paragraphMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#8217;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()

    if (text && text.length > 0) {
      // Check if it's coordinates
      if (text.match(/\d+\.\d+°\s*[NS],?\s*\d+\.\d+°\s*[EW]/)) {
        content.details.location = text
      } else {
        content.description.push(text)
      }
    }
  }

  // Extract list items using global flag without 's' flag
  const listRegex = /<li[^>]*>([\s\S]*?)<\/li>/g
  let listMatch
  while ((listMatch = listRegex.exec(htmlContent)) !== null) {
    const text = listMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&#8217;/g, "'")
      .replace(/&amp;/g, '&')
      .trim()

    if (text.includes(':')) {
      const [key, value] = text.split(':').map(s => s.trim())
      if (key && value) {
        const normalizedKey = normalizeKey(key)
        content.details[normalizedKey] = value
      }
    }
  }

  // Extract images from the content
  const imageRegex = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/g
  let imageMatch
  while ((imageMatch = imageRegex.exec(htmlContent)) !== null) {
    content.images.push({
      src: imageMatch[1],
      alt: imageMatch[2] || undefined
    })
  }

  // Alternative regex for images with attributes in different order
  const altImageRegex = /<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/g
  let altImageMatch: RegExpExecArray | null
  while ((altImageMatch = altImageRegex.exec(htmlContent)) !== null) {
    // Check if this image wasn't already captured
    if (!content.images.some(img => img.src === altImageMatch![2])) {
      content.images.push({
        src: altImageMatch![2],
        alt: altImageMatch![1] || undefined
      })
    }
  }

  return content
}