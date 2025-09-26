import { notFound } from 'next/navigation'
import { wpApi } from '@/lib/api/wordpress'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { Metadata } from 'next'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await wpApi.posts.getBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found',
    }
  }

  const rankMathSEO = await wpApi.rankmath.getSEOByPostId(post.id, 'post')

  let seoData
  if (rankMathSEO) {
    seoData = parseRankMathSEO(rankMathSEO)
  } else if (post.yoast_head_json) {
    seoData = parseYoastSEO(post.yoast_head_json)
  } else {
    seoData = parseRankMathSEO(null, {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
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
      publishedTime: seoData.openGraph.article?.publishedTime,
      modifiedTime: seoData.openGraph.article?.modifiedTime,
      authors: seoData.openGraph.article?.author ? [seoData.openGraph.article.author] : undefined,
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
  const posts = await wpApi.posts.getAll({ per_page: 100 })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await wpApi.posts.getBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1
          className="text-4xl font-bold mb-4"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <div className="flex gap-4 text-gray-600">
          <time>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  )
}