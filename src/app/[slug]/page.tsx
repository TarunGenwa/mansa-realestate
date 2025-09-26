import { notFound } from 'next/navigation'
import { wpApi } from '@/lib/api/wordpress'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { Metadata } from 'next'

interface DynamicPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await wpApi.pages.getBySlug(slug)

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found',
    }
  }

  const rankMathSEO = await wpApi.rankmath.getSEOByPostId(page.id, 'page')

  let seoData
  if (rankMathSEO) {
    seoData = parseRankMathSEO(rankMathSEO)
  } else if (page.yoast_head_json) {
    seoData = parseYoastSEO(page.yoast_head_json)
  } else {
    seoData = parseRankMathSEO(null, {
      title: page.title.rendered,
      description: page.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
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

export async function generateStaticParams() {
  const pages = await wpApi.pages.getAll({ per_page: 100 })

  return pages
    .filter(page => page.slug !== 'home')
    .map((page) => ({
      slug: page.slug,
    }))
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const page = await wpApi.pages.getBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold mb-8"
        dangerouslySetInnerHTML={{ __html: page.title.rendered }}
      />

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </main>
  )
}