export interface DeveloperContent {
  overviewText?: string
  overviewList?: Array<{ heading: string, text: string }>
  rawHtml: string
}

// Simple parser for developer content
export function parseDeveloperContent(htmlContent: string): DeveloperContent {
  const content: DeveloperContent = {
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

  // Look for OVERVIEW marker and extract overview text from next block
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('OVERVIEW:')) {
      console.log('Found OVERVIEW: at index:', i)
      // Next block should have the overview text
      if (blocks[i + 1]) {
        content.overviewText = blocks[i + 1].text
        console.log('Extracted overview text:', content.overviewText)
      }
      break
    }
  }

  // Look for OVERVIEW_LIST marker and extract list from next block
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].text.includes('OVERVIEW_LIST:')) {
      console.log('Found OVERVIEW_LIST: at index:', i)
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
          content.overviewList = listItems
          console.log('Extracted overview list:', content.overviewList)
        }
      }
      break
    }
  }

  return content
}
