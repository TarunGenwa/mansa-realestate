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

  // Fetch hero image by slug
  const heroImage = await wpApi.media.getBySlug('fc52ba8aedbbfe413f98241d1568a6cc96c2dec61').catch(() => null)

  // Fetch project tile image
  const projectTileImage = mediaImages.find(img => img.title.rendered.toLowerCase().includes('project_tile')) || null

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroImage && (
        <div className="relative w-full h-[90vh]">
          <Image
            src={heroImage.source_url}
            alt={heroImage.alt_text || 'Hero Image'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #224D56 2.19%, rgba(0, 0, 0, 0) 82.03%)' }}>
            <div className="text-center text-white px-4">
              <h1 style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', lineHeight: '1' }}>
                <span className="block font-normal" style={{ fontSize: '48px', lineHeight: '1' }}>Entrez dans une</span>
                <span className="block italic" style={{ fontWeight: 900, fontSize: '64px', lineHeight: '0.9' }}>nouvelle</span>
                <span className="block italic" style={{ fontWeight: 400, fontSize: '64px', lineHeight: '0.9' }}>réalité</span>
              </h1>
              <Link href="/contact" className="inline-block mt-8 px-8 py-3 text-white border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Text Section */}
      <section className="px-8 py-16">
        <div className="w-[40%]" style={{ marginLeft: '100px' }}>
          <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 300, fontSize: '48px', lineHeight: '1.2' }}>
            Découvrez une
          </p>
          <p style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', fontWeight: 900, fontSize: '48px', lineHeight: '1.2' }} className="italic">
            architecture
          </p>
          <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 300, fontSize: '48px', lineHeight: '1.2' }}>
            innovante qui
          </p>
          <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 300, fontSize: '48px', lineHeight: '1.2' }}>
            transforme vos rêves
          </p>
          <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 300, fontSize: '48px', lineHeight: '1.2' }}>
            en réalité
          </p>
        </div>
      </section>

      {/* Project Cards Section */}
      {projectTileImage && (
        <section className="py-16" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
          <div className="flex gap-6 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="relative flex-shrink-0 rounded-xl overflow-hidden group cursor-pointer"
                style={{ width: '360px', height: '577px' }}
              >
                <Image
                  src={projectTileImage.source_url}
                  alt={`Project ${index}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl font-semibold">Projet {index}</h3>
                    <p className="text-white/80 text-sm mt-2">Découvrir le projet</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {homePage ? (
        <main className="max-w-7xl mx-auto px-4 py-8">

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