'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { wpApi } from '@/lib/api/wordpress'
import { WPPost } from '@/lib/types/wordpress'
import SEOHead from '@/components/seo/SEOHead'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'

export default function GuideDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<WPPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        const data = await wpApi.posts.getBySlug(slug)
        if (!data) {
          setError('Guide non trouvé')
        } else {
          setPost(data)
        }
      } catch (err) {
        setError('Erreur lors du chargement du guide')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const seoData = post?.yoast_head_json
    ? parseYoastSEO(post.yoast_head_json)
    : parseRankMathSEO(null, {
        title: post?.title?.rendered || 'Guide - Mansa Real Estate',
        description: post?.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || '',
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/guides/${slug}`,
      })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-lg">Chargement du guide...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error || 'Guide non trouvé'}</div>
          <Link href="/guides" className="text-blue-600 hover:underline">
            Retour aux guides
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead seoData={seoData} />

      <main className="min-h-screen pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <Link
              href="/guides"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux guides
            </Link>

            <div className="flex items-center gap-4 mb-4">
              {post._embedded?.['wp:term']?.[0]?.map((category) => (
                <span
                  key={category.id}
                  className="text-sm font-medium text-blue-600 uppercase tracking-wider"
                >
                  {category.name}
                </span>
              ))}
              <time className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {post._embedded?.author?.[0] && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>Par</span>
                <span className="font-medium">{post._embedded.author[0].name}</span>
              </div>
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
              prose-img:rounded-lg prose-img:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600
              prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
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
    </>
  )
}