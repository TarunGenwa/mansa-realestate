export interface PropertyContent {
  title?: string
  subtitle?: string
  logo?: {
    src: string
    alt?: string
  }
  heroLeftImage?: {
    src: string
    alt?: string
  }
  heroRightImage?: {
    src: string
    alt?: string
  }
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

  // Extract all blocks (paragraphs and figures) in order
  const blocks: Array<{text: string, html: string}> = []

  // Match both <p> and <figure> tags
  const blockRegex = /<(p|figure)[^>]*>([\s\S]*?)<\/\1>/g
  let blockMatch
  while ((blockMatch = blockRegex.exec(htmlContent)) !== null) {
    const html = blockMatch[2]
    const text = html
      .replace(/<[^>]*>/g, '')
      .replace(/&#8217;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()

    // Include blocks with text OR images
    if (text.length > 0 || html.includes('<img')) {
      blocks.push({ text, html })
    }
  }

  // First block is subtitle
  if (blocks.length > 0 && blocks[0]) {
    content.subtitle = blocks[0].text
  }

  // Look for DEVELOPER_LOGO marker and extract logo from next block
  for (let i = 0; i < blocks.length; i++) {
    console.log(`Block ${i}:`, blocks[i].text.substring(0, 50))
    if (blocks[i].text.includes('DEVELOPER_LOGO')) {
      console.log('Found DEVELOPER_LOGO at index:', i)
      console.log('Next block:', blocks[i + 1])
      // Next block should have the logo image
      if (blocks[i + 1] && blocks[i + 1].html.includes('<img')) {
        console.log('Next block has image')
        // Try to match src first, then alt
        let imgMatch = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/i.exec(blocks[i + 1].html)

        // If not found, try alt first pattern
        if (!imgMatch) {
          imgMatch = /<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/i.exec(blocks[i + 1].html)
          if (imgMatch) {
            content.logo = {
              src: imgMatch[2],
              alt: imgMatch[1] || undefined
            }
            console.log('Extracted logo (alt first):', content.logo)
          }
        } else {
          content.logo = {
            src: imgMatch[1],
            alt: imgMatch[2] || undefined
          }
          console.log('Extracted logo (src first):', content.logo)
        }
      }
      break
    }
  }

  // Look for HERO_LEFT_IMAGE marker and extract left hero image from next block
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('HERO_LEFT_IMAGE')) {
      console.log('Found HERO_LEFT_IMAGE at index:', i)
      // Next block should have the left hero image
      if (blocks[i + 1] && blocks[i + 1].html.includes('<img')) {
        let imgMatch = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/i.exec(blocks[i + 1].html)

        if (!imgMatch) {
          imgMatch = /<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/i.exec(blocks[i + 1].html)
          if (imgMatch) {
            content.heroLeftImage = {
              src: imgMatch[2],
              alt: imgMatch[1] || undefined
            }
          }
        } else {
          content.heroLeftImage = {
            src: imgMatch[1],
            alt: imgMatch[2] || undefined
          }
        }
        console.log('Extracted left hero image:', content.heroLeftImage)
      }
      break
    }
  }

  // Look for HERO_RIGHT_IMAGE marker and extract right hero image from next block
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('HERO_RIGHT_IMAGE')) {
      console.log('Found HERO_RIGHT_IMAGE at index:', i)
      // Next block should have the right hero image
      if (blocks[i + 1] && blocks[i + 1].html.includes('<img')) {
        let imgMatch = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/i.exec(blocks[i + 1].html)

        if (!imgMatch) {
          imgMatch = /<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/i.exec(blocks[i + 1].html)
          if (imgMatch) {
            content.heroRightImage = {
              src: imgMatch[2],
              alt: imgMatch[1] || undefined
            }
          }
        } else {
          content.heroRightImage = {
            src: imgMatch[1],
            alt: imgMatch[2] || undefined
          }
        }
        console.log('Extracted right hero image:', content.heroRightImage)
      }
      break
    }
  }

  return content
}