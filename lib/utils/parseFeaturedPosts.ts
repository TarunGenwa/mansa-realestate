export interface FeaturedPost {
  slug: string
  imageUrl: string
}

/**
 * Parses the featured-posts content from WordPress
 * Expected format: <li>slug : <a href="imageUrl">imageUrl</a></li>
 */
export function parseFeaturedPosts(htmlContent: string): FeaturedPost[] {
  const featuredPosts: FeaturedPost[] = []

  // Match pattern: slug : <a href="imageUrl">
  // Using regex to extract slug and image URL from each list item
  const listItemPattern = /<li>([^:]+)\s*:\s*<a[^>]*href="([^"]+)"/g

  let match
  while ((match = listItemPattern.exec(htmlContent)) !== null) {
    const slug = match[1].trim()
    const imageUrl = match[2].trim()

    if (slug && imageUrl) {
      featuredPosts.push({
        slug,
        imageUrl
      })
    }
  }

  return featuredPosts
}
