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
  const [consultationImage, setConsultationImage] = useState<string | null>(null)

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

    const fetchConsultationImage = async () => {
      try {
        // Search for the consultation background image by slug
        const consultationMedia = await wpApi.media.getBySlug('schedule-consultation')
        if (consultationMedia) {
          setConsultationImage(consultationMedia.source_url)
        }
      } catch (err) {
        console.error('Failed to fetch consultation image:', err)
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
    fetchConsultationImage()
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

      <main className="min-h-screen pt-32">
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
        <div className="w-[90%] mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            All Guides
          </h1>
        </div>

        <div className="w-[90%] mx-auto">
          {/* First two posts - full width */}
          {posts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {posts.slice(0, 2).map((post) => (
                <article
                  key={post.id}
                  className="group rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#FCFCFC' }}
                >
                  {post._embedded?.['wp:featuredmedia']?.[0] && (
                    <div className="relative h-64 w-full overflow-hidden bg-gray-100">
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
                          style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                        >
                          {category.name}
                        </span>
                      ))}
                      <time className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                        {new Date(post.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                      <Link
                        href={`/guides/${post.slug}`}
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </h2>

                    <div
                      className="text-gray-600 text-base line-clamp-3 mb-4"
                      style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />

                    <Link
                      href={`/guides/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
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
          )}

          {/* Remaining posts - 4 columns */}
          {posts.length > 2 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {posts.slice(2).map((post) => (
                <article
                  key={post.id}
                  className="group rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#FCFCFC' }}
                >
                  {post._embedded?.['wp:featuredmedia']?.[0] && (
                    <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={post._embedded['wp:featuredmedia'][0].source_url}
                        alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex flex-col gap-2 mb-2">
                      {post._embedded?.['wp:term']?.[0]?.slice(0, 1).map((category) => (
                        <span
                          key={category.id}
                          className="text-xs font-medium text-blue-600 uppercase tracking-wider"
                          style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                        >
                          {category.name}
                        </span>
                      ))}
                      <time className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                        {new Date(post.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    <h2 className="text-base font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                      <Link
                        href={`/guides/${post.slug}`}
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </h2>

                    <div
                      className="text-gray-600 text-sm line-clamp-2 mb-3"
                      style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />

                    <Link
                      href={`/guides/${post.slug}`}
                      className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                    >
                      Lire la suite
                      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-2" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Aucun guide disponible pour le moment</p>
              <p className="text-gray-500" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Les articles avec la catégorie "guides" apparaîtront ici.</p>
            </div>
          )}
        </div>

        {/* Schedule a Consultation Section */}
        {consultationImage && (
          <section className="mt-20 relative w-full h-[700px] overflow-hidden">
            <Image
              src={consultationImage}
              alt="Schedule a consultation"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20">
              <div className="relative h-full flex items-center">
                <div className="w-[90%] mx-auto">
                  <div className="bg-white rounded-lg p-8 max-w-md shadow-xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                      Schedule a free consultation
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                      We craft inspiring spaces that blend cutting-edge design with enduring functionality, turning your vision into reality.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-black text-black font-medium rounded-full hover:bg-black hover:text-white transition-all duration-300"
                      style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                    >
                      Get Started
                      <Image
                        src="/top-right-arrow.svg"
                        alt="Arrow"
                        width={40}
                        height={40}
                        className="ml-4"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}