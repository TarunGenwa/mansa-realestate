import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { wpApi } from '@/lib/api/wordpress'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { Metadata } from 'next'

// Enable ISR - revalidate every 30 minutes for guides
export const revalidate = 1800

interface GuideDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params at build time for all guides
export async function generateStaticParams() {
  // Get guides category
  const guidesCategory = await wpApi.categories.getBySlug('guides').catch(() => null)

  if (!guidesCategory) {
    return []
  }

  // Fetch all guide posts
  const guides = await wpApi.posts.getAll({
    categories: [guidesCategory.id],
    per_page: 100,
    _embed: false
  }).catch(() => [])

  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await wpApi.posts.getBySlug(slug).catch(() => null)

  if (!post) {
    return {
      title: 'Guide Not Found - Mansa',
      description: 'The requested guide could not be found.',
    }
  }

  // Get guides category to verify this is a guide
  const guidesCategory = await wpApi.categories.getBySlug('guides').catch(() => null)
  if (!guidesCategory || !post.categories?.includes(guidesCategory.id)) {
    return {
      title: 'Guide Not Found - Mansa',
      description: 'The requested guide could not be found.',
    }
  }

  const rankMathSEO = await wpApi.rankmath.getSEOByPostId(post.id, 'post').catch(() => null)

  let seoData
  if (rankMathSEO) {
    seoData = parseRankMathSEO(rankMathSEO)
  } else if (post.yoast_head_json) {
    seoData = parseYoastSEO(post.yoast_head_json)
  } else {
    seoData = parseRankMathSEO(null, {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/guides/${slug}`,
    })
  }

  return {
    title: seoData.title,
    description: seoData.description,
    openGraph: {
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
      url: seoData.openGraph.url,
      siteName: seoData.openGraph.siteName,
      images: seoData.openGraph.images,
      type: seoData.openGraph.type as any,
      locale: seoData.openGraph.locale,
    },
    twitter: {
      card: seoData.twitter.cardType as any,
      title: seoData.twitter.title,
      description: seoData.twitter.description,
      images: seoData.twitter.image ? [seoData.twitter.image] : undefined,
      creator: seoData.twitter.creator,
      site: seoData.twitter.site,
    },
    robots: seoData.robots ? {
      index: seoData.robots.index,
      follow: seoData.robots.follow,
    } : undefined,
    alternates: {
      canonical: seoData.canonical,
    },
  }
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params

  // Fetch the post
  const post = await wpApi.posts.getBySlug(slug).catch(() => null)

  if (!post) {
    notFound()
  }

  // Get guides category to verify this is a guide
  const guidesCategory = await wpApi.categories.getBySlug('guides').catch(() => null)

  // Verify this post is in the guides category
  if (!guidesCategory || !post.categories?.includes(guidesCategory.id)) {
    notFound()
  }

  // Extract subheading from content
  const subheadingMatch = post.content.rendered.match(/<p[^>]*>\s*SUBHEADING:\s*([^<]+)<\/p>|SUBHEADING:\s*([^\n<]+)/i)
  const subheading = subheadingMatch ? (subheadingMatch[1] || subheadingMatch[2])?.trim() : null

  // Replace all special blocks in place
  let cleanedContent = post.content.rendered
    .replace(/<p[^>]*>\s*SUBHEADING:\s*[^<]+<\/p>|SUBHEADING:\s*[^\n<]+/i, '')

  // Replace CONTENT HEADING SMALL: blocks first (more specific match)
  cleanedContent = cleanedContent.replace(/<p[^>]*>\s*CONTENT HEADING SMALL:\s*([^<]+)<\/p>|CONTENT HEADING SMALL:\s*([^\n<]+)/gi, (_match, p1, p2) => {
    const heading = (p1 || p2)?.trim()
    return `<h3 class="font-semibold text-gray-800 mb-3 mt-6" style="font-size: 16px;">${heading}</h3>`
  })

  // Replace CONTENT HEADING: blocks with styled headings in place
  cleanedContent = cleanedContent.replace(/<p[^>]*>\s*CONTENT HEADING:\s*([^<]+)<\/p>|CONTENT HEADING:\s*([^\n<]+)/gi, (_match, p1, p2) => {
    const heading = (p1 || p2)?.trim()
    return `<h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 mt-8">${heading}</h2>`
  })

  // Replace CONTENT SUBHEADING: blocks with styled subheadings in place
  cleanedContent = cleanedContent.replace(/<p[^>]*>\s*CONTENT SUBHEADING:\s*([^<]+)<\/p>|CONTENT SUBHEADING:\s*([^\n<]+)/gi, (_match, p1, p2) => {
    const subheading = (p1 || p2)?.trim()
    return `<p class="text-lg text-gray-600 mb-6">${subheading}</p>`
  })

  // Replace each CONTENT STATS: block with a custom marker for rendering
  cleanedContent = cleanedContent.replace(/<p[^>]*>\s*CONTENT STATS:\s*<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match, listContent) => {
    const listItems = listContent.match(/<li[^>]*>([^<]+)<\/li>/gi)
    if (!listItems) return ''

    const stats = listItems.map((item: string) => item.replace(/<\/?li[^>]*>/gi, '').trim())
    const statsHtml = stats.map((stat: string) => {
      // Split on colon to separate heading from description
      const parts = stat.split(':').map(p => p.trim())
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const heading = parts[0]
        const description = parts.slice(1).join(':').trim()
        return `<div class="bg-gray-100 px-4 py-3 text-center" style="border-radius: 2px; min-width: 100px;">
          <div class="text-gray-900 font-semibold mb-1">${heading}</div>
          <div class="text-gray-600 text-sm">${description}</div>
        </div>`
      }
      return `<div class="bg-gray-100 px-4 py-2 text-center" style="border-radius: 2px; min-width: 100px;"><span class="text-gray-700 font-medium">${stat}</span></div>`
    }).join('')

    return `<div class="flex flex-row gap-4 my-6">${statsHtml}</div>`
  })

  // Replace IMAGES GRID: blocks with grid layout - takes next 5 blocks after IMAGES GRID:
  cleanedContent = cleanedContent.replace(/<p[^>]*>\s*IMAGES GRID:\s*<\/p>((?:[\s\S]*?(?:<p[^>]*>[\s\S]*?<\/p>|<figure[^>]*>[\s\S]*?<\/figure>)){5})/gi, (_match, nextBlocks) => {
    // Extract the 5 blocks (can be p tags or figure tags)
    const blockMatches = nextBlocks.match(/<p[^>]*>[\s\S]*?<\/p>|<figure[^>]*>[\s\S]*?<\/figure>/gi)
    if (!blockMatches || blockMatches.length < 5) return ''

    const items = blockMatches.slice(0, 5).map((block: string) => {
      // Check if block contains an image (figure tag)
      const figureImgMatch = block.match(/<img[^>]*src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/i)
      if (figureImgMatch) {
        return { type: 'image', src: figureImgMatch[1], alt: figureImgMatch[2] || '' }
      }

      // Check if p tag contains an image
      const imgMatch = block.match(/<img[^>]*src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/i)
      if (imgMatch) {
        return { type: 'image', src: imgMatch[1], alt: imgMatch[2] || '' }
      }

      // Otherwise it's text content - split by colon
      const cleanBlock = block.replace(/<\/?p[^>]*>/gi, '').replace(/<[^>]*>/g, '').trim()
      const parts = cleanBlock.split(':').map(p => p.trim())

      if (parts.length >= 3) {
        // Format: bigNumber : smallHeading : subheading
        return {
          type: 'text',
          bigNumber: parts[0],
          smallHeading: parts[1],
          subheading: parts.slice(2).join(':').trim()
        }
      } else if (parts.length === 2) {
        return {
          type: 'text',
          bigNumber: parts[0],
          smallHeading: parts[1],
          subheading: ''
        }
      } else {
        return {
          type: 'text',
          bigNumber: cleanBlock,
          smallHeading: '',
          subheading: ''
        }
      }
    })

    const gridHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 my-12">
        <!-- First Column - Single Element -->
        <div class="lg:col-span-1">
          <div class="h-full flex flex-col justify-between" style="background-color: #ECE8DD; min-height: 400px; border-radius: 2px;">
            <div class="text-center p-8">
              <h3 class="text-mono-bold" style="font-size: 96px; color: #000;">
                ${items[0].type === 'text' ? items[0].bigNumber : ''}
              </h3>
            </div>
            <div class="text-center p-8">
              <p class="text-mono-regular mb-2" style="font-size: 16px; color: #000;">
                ${items[0].type === 'text' ? items[0].smallHeading : ''}
              </p>
              <p class="text-mono-light" style="font-size: 16px; color: #666;">
                ${items[0].type === 'text' ? items[0].subheading : ''}
              </p>
            </div>
          </div>
        </div>

        <!-- Second Column - 4 Cards Grid -->
        <div class="lg:col-span-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${items.slice(1).map((item: any) => {
              if (item.type === 'image') {
                return `
                  <div class="w-full relative overflow-hidden" style="height: 300px; border-radius: 2px;">
                    <img src="${item.src}" alt="${item.alt}" class="w-full h-full object-cover" style="border-radius: 2px;" />
                  </div>
                `
              } else {
                return `
                  <div class="flex w-full flex-col justify-between" style="background-color: #ECE8DD; height: 300px; border-radius: 2px;">
                    <div class="text-center p-8">
                      <h3 class="text-mono-bold" style="font-size: 96px; color: #000;">
                        ${item.bigNumber}
                      </h3>
                    </div>
                    <div class="text-center p-4">
                      <p class="text-mono-regular mb-2" style="font-size: 16px; color: #000;">
                        ${item.smallHeading}
                      </p>
                      <p class="text-mono-light" style="font-size: 16px; color: #666;">
                        ${item.subheading}
                      </p>
                    </div>
                  </div>
                `
              }
            }).join('')}
          </div>
        </div>
      </div>
    `

    return gridHtml
  })

  return (
    <main className="min-h-screen pt-32 pb-16">
      <article className="w-full px-16">
        <div className="mb-8 text-center max-w-4xl mx-auto">

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-mont-regular"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {subheading && (
            <p className="text-xl text-gray-600 mb-4">
              {subheading}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/properties"
              className="px-10 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              Explore
            </Link>

            <Link
              href="/contact"
              className="px-10 py-4 border-2 rounded-full border-black text-black hover:bg-black hover:text-white transition-all duration-300"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              Contact
            </Link>
          </div>

        </div>

        {post._embedded?.['wp:featuredmedia']?.[0] && (
          <div className="relative h-96 md:h-[500px] w-full mb-10 overflow-hidden" style={{ borderRadius: '2px' }}>
            <Image
              src={post._embedded['wp:featuredmedia'][0].source_url}
              alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
            prose-li:mb-2
            prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600
            prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700"
          style={{ ['--prose-img-border-radius' as any]: '2px' }}
          dangerouslySetInnerHTML={{ __html: cleanedContent }}
        />

      </article>
    </main>
  )
}