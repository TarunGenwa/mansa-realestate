export interface PropertyContent {
  title?: string
  subtitle?: string
  logo?: {
    src: string
    alt?: string
  }
  developerLink?: string
  heroLeftImage?: {
    src: string
    alt?: string
  }
  heroRightImage?: {
    src: string
    alt?: string
  }
  overviewText?: string
  overviewImage?: {
    src: string
    alt?: string
  }
  typologies?: string[]
  offerPrice?: Array<{ heading: string, text: string }>
  lifeCommunity?: Array<{ heading: string, text: string }>
  brochurePdf?: {
    text: string
    link: string
    linkPreview?: {
      src: string
      alt?: string
    }
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

  // Extract all blocks (paragraphs, figures, and lists) in order
  const blocks: Array<{text: string, html: string}> = []

  // Match <p>, <figure>, <ul>, and <ol> tags
  const blockRegex = /<(p|figure|ul|ol)[^>]*>([\s\S]*?)<\/\1>/g
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

      // Block after logo image should have the developer link
      if (blocks[i + 2]) {
        content.developerLink = blocks[i + 2].text
        console.log('Extracted developer link:', content.developerLink)
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

  // Look for OVERVIEW marker and extract overview text from next block
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('OVERVIEW')) {
      console.log('Found OVERVIEW at index:', i)
      // Next block should have the overview text
      if (blocks[i + 1]) {
        content.overviewText = blocks[i + 1].text
        console.log('Extracted overview text:', content.overviewText)
      }
      break
    }
  }

  // Look for OVERVIEW_IMAGE marker and extract overview image from next block
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('OVERVIEW_IMAGE')) {
      console.log('Found OVERVIEW_IMAGE at index:', i)
      // Next block should have the overview image
      if (blocks[i + 1] && blocks[i + 1].html.includes('<img')) {
        let imgMatch = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/i.exec(blocks[i + 1].html)

        if (!imgMatch) {
          imgMatch = /<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/i.exec(blocks[i + 1].html)
          if (imgMatch) {
            content.overviewImage = {
              src: imgMatch[2],
              alt: imgMatch[1] || undefined
            }
          }
        } else {
          content.overviewImage = {
            src: imgMatch[1],
            alt: imgMatch[2] || undefined
          }
        }
        console.log('Extracted overview image:', content.overviewImage)
      }
      break
    }
  }

  // Look for TYPOLOGIES marker and extract list from next block
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('TYPOLOGIES')) {
      console.log('Found TYPOLOGIES at index:', i)
      // Next block should have a list (ul/ol)
      if (blocks[i + 1]) {
        const listItems: string[] = []
        const listRegex = /<li[^>]*>([\s\S]*?)<\/li>/g
        let listMatch
        while ((listMatch = listRegex.exec(blocks[i + 1].html)) !== null) {
          const text = listMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/&#8217;/g, "'")
            .replace(/&amp;/g, '&')
            .trim()
          if (text) {
            listItems.push(text)
          }
        }
        if (listItems.length > 0) {
          content.typologies = listItems
          console.log('Extracted typologies:', content.typologies)
        }
      }
      break
    }
  }

  // Look for OFFRE_&_PRIX marker and extract list with heading:text format
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('OFFRE_&_PRIX')) {
      console.log('Found OFFRE_&_PRIX at index:', i)
      // Next block should have a list (ul/ol)
      if (blocks[i + 1]) {
        const listItems: Array<{ heading: string, text: string }> = []
        const listRegex = /<li[^>]*>([\s\S]*?)<\/li>/g
        let listMatch
        while ((listMatch = listRegex.exec(blocks[i + 1].html)) !== null) {
          const text = listMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/&#8217;/g, "'")
            .replace(/&amp;/g, '&')
            .trim()
          if (text && text.includes(':')) {
            const [heading, ...rest] = text.split(':')
            listItems.push({
              heading: heading.trim(),
              text: rest.join(':').trim()
            })
          }
        }
        if (listItems.length > 0) {
          content.offerPrice = listItems
          console.log('Extracted offer & price:', content.offerPrice)
        }
      }
      break
    }
  }

  // Look for VIE_&_COMMUNAUTE marker and extract list with heading:text format
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('VIE_&_COMMUNAUTE')) {
      console.log('Found VIE_&_COMMUNAUTE at index:', i)
      // Next block should have a list (ul/ol)
      if (blocks[i + 1]) {
        const listItems: Array<{ heading: string, text: string }> = []
        const listRegex = /<li[^>]*>([\s\S]*?)<\/li>/g
        let listMatch
        while ((listMatch = listRegex.exec(blocks[i + 1].html)) !== null) {
          const text = listMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/&#8217;/g, "'")
            .replace(/&amp;/g, '&')
            .trim()
          if (text && text.includes(':')) {
            const [heading, ...rest] = text.split(':')
            listItems.push({
              heading: heading.trim(),
              text: rest.join(':').trim()
            })
          }
        }
        if (listItems.length > 0) {
          content.lifeCommunity = listItems
          console.log('Extracted life & community:', content.lifeCommunity)
        }
      }
      break
    }
  }

  // Look for BROCHURE_PDF marker and extract text
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('BROCHURE_PDF')) {
      console.log('Found BROCHURE_PDF at index:', i)
      // Next block should have the text
      if (blocks[i + 1]) {
        const text = blocks[i + 1].text
        content.brochurePdf = {
          text: text,
          link: '' // Will be populated by BROCHURE_LINK
        }
        console.log('Extracted brochure PDF text:', content.brochurePdf)
      }
      break
    }
  }

  // Look for BROCHURE_LINK marker and extract the link
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('BROCHURE_LINK:')) {
      console.log('Found BROCHURE_LINK: at index:', i)
      // Next block should have the link
      if (blocks[i + 1] && content.brochurePdf) {
        content.brochurePdf.link = blocks[i + 1].text
        console.log('Extracted brochure link:', content.brochurePdf.link)
      }
      break
    }
  }

  // Look for BROCHURE_LINK_PREVIEW marker and extract preview image
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('BROCHURE_LINK_PREVIEW')) {
      console.log('Found BROCHURE_LINK_PREVIEW at index:', i)
      // Next block should have the preview image
      if (blocks[i + 1] && blocks[i + 1].html.includes('<img')) {
        let imgMatch = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/i.exec(blocks[i + 1].html)

        if (!imgMatch) {
          imgMatch = /<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/i.exec(blocks[i + 1].html)
          if (imgMatch && content.brochurePdf) {
            content.brochurePdf.linkPreview = {
              src: imgMatch[2],
              alt: imgMatch[1] || undefined
            }
          }
        } else if (content.brochurePdf) {
          content.brochurePdf.linkPreview = {
            src: imgMatch[1],
            alt: imgMatch[2] || undefined
          }
        }
        console.log('Extracted brochure link preview:', content.brochurePdf?.linkPreview)
      }
      break
    }
  }

  return content
}