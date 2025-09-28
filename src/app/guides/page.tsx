'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { wpApi } from '@/lib/api/wordpress'
import { WPPost } from '@/lib/types/wordpress'
import SEOHead from '@/components/seo/SEOHead'
import { parseRankMathSEO } from '@/lib/seo/utils'

export default function GuidesPage() {
  const [posts, setPosts] = useState<WPPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [heroImage, setHeroImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuidesCategory = async () => {
      try {
        console.log('Fetching categories...')
        const categories = await wpApi.categories.getAll({ per_page: 100 })
        console.log('All categories:', categories)

        const guidesCat = categories.find(cat =>
          cat.slug === 'guides' ||
          cat.name.toLowerCase().includes('guides')
        )

        console.log('Found guides category:', guidesCat)

        if (guidesCat) {
          return guidesCat.id
        }

        return null
      } catch (err) {
        console.error('Failed to fetch guides category:', err)
        return null
      }
    }

    const fetchHeroImage = async () => {
      try {
        // Search for the hero image by slug
        const heroMedia = await wpApi.media.getBySlug('guides-hero')
        if (heroMedia) {
          setHeroImage(heroMedia.source_url)
        }
      } catch (err) {
        console.error('Failed to fetch hero image:', err)
      }
    }

    const fetchPosts = async () => {
      try {
        const categoryId = await fetchGuidesCategory()

        if (!categoryId) {
          // If no guides category found, set empty posts
          console.log('No guides category found')
          setPosts([])
        } else {
          const params: any = {
            per_page: 12,
            _embed: true,
            categories: [categoryId] // Only fetch posts with guides category
          }

          const data = await wpApi.posts.getAll(params)
          console.log('Fetched posts:', data)
          setPosts(data)
        }
      } catch (err) {
        setError('Impossible de charger les guides')
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroImage()
    fetchPosts()
  }, [])

  const seoData = parseRankMathSEO(null, {
    title: 'Guides et Actualités - Mansa Real Estate',
    description: 'Découvrez nos guides complets et les dernières actualités sur l\'investissement immobilier à Dubaï',
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/guides`,
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-lg">Chargement des guides...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <>
      <SEOHead seoData={seoData} />

      <main className="min-h-screen pt-32 pb-16">
        {/* Hero Section */}
        {heroImage && (
          <div className="relative w-[90%] mx-auto rounded-md h-[280px] mb-8">
            <Image
              src={heroImage}
              alt="Guides et Actualités"
              fill
              className="object-cover rounded-md"
              priority
            />
          </div>
        )}

        {/* All Guides Heading */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            All Guides
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {post._embedded?.['wp:featuredmedia']?.[0] && (
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={post._embedded['wp:featuredmedia'][0].source_url}
                      alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    {post._embedded?.['wp:term']?.[0]?.map((category) => (
                      <span
                        key={category.id}
                        className="text-xs font-medium text-blue-600 uppercase tracking-wider"
                      >
                        {category.name}
                      </span>
                    ))}
                    <time className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  <h2 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                    <Link
                      href={`/guides/${post.slug}`}
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </h2>

                  <div
                    className="text-gray-600 text-sm line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />

                  <Link
                    href={`/guides/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Lire la suite
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-2">Aucun guide disponible pour le moment</p>
              <p className="text-gray-500">Les articles avec la catégorie "guides" apparaîtront ici.</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}