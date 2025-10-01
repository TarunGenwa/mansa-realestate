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

  // Extract content heading
  const contentHeadingMatch = post.content.rendered.match(/<p[^>]*>\s*CONTENT HEADING:\s*([^<]+)<\/p>|CONTENT HEADING:\s*([^\n<]+)/i)
  const contentHeading = contentHeadingMatch ? (contentHeadingMatch[1] || contentHeadingMatch[2])?.trim() : null

  // Replace all CONTENT STATS: blocks with rendered stat components in place
  let cleanedContent = post.content.rendered
    .replace(/<p[^>]*>\s*SUBHEADING:\s*[^<]+<\/p>|SUBHEADING:\s*[^\n<]+/i, '')
    .replace(/<p[^>]*>\s*CONTENT HEADING:\s*[^<]+<\/p>|CONTENT HEADING:\s*[^\n<]+/i, '')

  // Replace each CONTENT STATS: block with a custom marker for rendering
  cleanedContent = cleanedContent.replace(/<p[^>]*>\s*CONTENT STATS:\s*<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, listContent) => {
    const listItems = listContent.match(/<li[^>]*>([^<]+)<\/li>/gi)
    if (!listItems) return ''

    const stats = listItems.map((item: string) => item.replace(/<\/?li[^>]*>/gi, '').trim())
    const statsHtml = stats.map((stat: string) =>
      `<div class="bg-gray-100 px-4 py-2 rounded-lg inline-block mr-4 mb-2"><span class="text-gray-700 font-medium">${stat}</span></div>`
    ).join('')

    return `<div class="flex flex-wrap gap-4 md:gap-6 my-6">${statsHtml}</div>`
  })

  return (
    <main className="min-h-screen pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-6">
        <div className="mb-8">

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {subheading && (
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              {subheading}
            </p>
          )}

        </div>

        {post._embedded?.['wp:featuredmedia']?.[0] && (
          <div className="relative h-96 md:h-[500px] w-full mb-10 rounded-lg overflow-hidden">
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

        {contentHeading && (
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            {contentHeading}
          </h2>
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
            prose-img:rounded-lg prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600
            prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700"
          dangerouslySetInnerHTML={{ __html: cleanedContent }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-3">
              Besoin de conseils pour votre investissement ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nos experts sont à votre disposition pour vous accompagner
              dans votre projet d&apos;investissement immobilier à Dubaï.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contactez-nous
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}