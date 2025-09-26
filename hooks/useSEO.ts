import { useState, useEffect } from 'react'
import { wpApi } from '@/lib/api/wordpress'
import { SEOData, parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { WPPost, WPPage } from '@/lib/types/wordpress'

interface UseSEOOptions {
  type?: 'post' | 'page'
  slug?: string
  id?: number
  fallback?: Partial<SEOData>
}

export function useSEO(options: UseSEOOptions = {}) {
  const [seoData, setSeoData] = useState<SEOData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        setLoading(true)
        setError(null)

        let content: WPPost | WPPage | null = null
        let rankMathData = null

        if (options.slug) {
          if (options.type === 'page') {
            content = await wpApi.pages.getBySlug(options.slug)
          } else {
            content = await wpApi.posts.getBySlug(options.slug)
          }
        } else if (options.id) {
          if (options.type === 'page') {
            content = await wpApi.pages.getById(options.id)
          } else {
            content = await wpApi.posts.getById(options.id)
          }
        }

        if (content) {
          rankMathData = await wpApi.rankmath.getSEOByPostId(content.id, options.type || 'post')

          if (rankMathData) {
            setSeoData(parseRankMathSEO(rankMathData, options.fallback))
          } else if (content.yoast_head_json) {
            setSeoData(parseYoastSEO(content.yoast_head_json, options.fallback))
          } else {
            setSeoData(parseRankMathSEO(null, {
              ...options.fallback,
              title: content.title.rendered,
              description: content.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
            }))
          }
        } else {
          setSeoData(parseRankMathSEO(null, options.fallback))
        }
      } catch (err) {
        setError(err as Error)
        setSeoData(parseRankMathSEO(null, options.fallback))
      } finally {
        setLoading(false)
      }
    }

    fetchSEO()
  }, [options.type, options.slug, options.id])

  return { seoData, loading, error }
}