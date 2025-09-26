'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { wpApi } from '@/lib/api/wordpress'
import { WPPost } from '@/lib/types/wordpress'
import SEOHead from '@/components/seo/SEOHead'
import { parseRankMathSEO } from '@/lib/seo/utils'

export default function BlogPage() {
  const [posts, setPosts] = useState<WPPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await wpApi.posts.getAll({ per_page: 10 })
        setPosts(data)
      } catch (err) {
        setError('Failed to fetch posts')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const seoData = parseRankMathSEO(null, {
    title: 'Blog - Mansa',
    description: 'Read our latest blog posts and updates',
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog`,
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <>
      <SEOHead seoData={seoData} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </h2>

              <div
                className="text-gray-600 mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />

              <div className="flex justify-between items-center">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts found</p>
          </div>
        )}
      </main>
    </>
  )
}