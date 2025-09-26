import { wpApi } from '@/lib/api/wordpress'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await wpApi.pages.getBySlug('home').catch(() => null)

  if (homePage) {
    const rankMathSEO = await wpApi.rankmath.getSEOByPostId(homePage.id, 'page')

    let seoData
    if (rankMathSEO) {
      seoData = parseRankMathSEO(rankMathSEO)
    } else if (homePage.yoast_head_json) {
      seoData = parseYoastSEO(homePage.yoast_head_json)
    } else {
      seoData = parseRankMathSEO(null, {
        title: homePage.title.rendered,
        description: homePage.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
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

  return {
    title: 'Mansa - Marketing Website',
    description: 'Welcome to Mansa',
  }
}

export default async function Home() {
  const homePage = await wpApi.pages.getBySlug('home').catch(() => null)
  const recentPosts = await wpApi.posts.getAll({ per_page: 3 }).catch(() => [])
  const mediaImages = await wpApi.media.getAll({ media_type: 'image', per_page: 20 }).catch(() => [])

  return (
    <div className="min-h-screen">
      {homePage ? (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1
            className="text-5xl font-bold mb-8"
            dangerouslySetInnerHTML={{ __html: homePage.title.rendered }}
          />

          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: homePage.content.rendered }}
          />

          {mediaImages.length > 0 && (
            <section className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Media Gallery</h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {mediaImages.map((image) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer group">
                    <Image
                      src={image.source_url}
                      alt={image.alt_text || image.title.rendered}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    {image.caption.rendered && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p
                          className="text-white text-xs truncate"
                          dangerouslySetInnerHTML={{ __html: image.caption.rendered }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {recentPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Recent Posts</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {recentPosts.map((post) => (
                  <article key={post.id} className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </h3>
                    <div
                      className="text-gray-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      Read more →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Mansa</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your marketing website powered by WordPress CMS
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/blog"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View Blog
            </Link>
          </div>

          {mediaImages.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-6">Media Gallery</h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {mediaImages.map((image) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer group">
                    <Image
                      src={image.source_url}
                      alt={image.alt_text || image.title.rendered}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    {image.caption.rendered && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p
                          className="text-white text-xs truncate"
                          dangerouslySetInnerHTML={{ __html: image.caption.rendered }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {recentPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-6">Recent Posts</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {recentPosts.map((post) => (
                  <article key={post.id} className="border rounded-lg p-6 text-left">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </h3>
                    <div
                      className="text-gray-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      Read more →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  )
}