import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await wpApi.posts.getBySlug(slug)
  console.log('mansa proeprties',post)
  if (!post) {
    return {
      title: 'Property Not Found - Mansa',
      description: 'The requested property could not be found.',
    }
  }

  return {
    title: `${post.title.rendered} - Mansa Properties`,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  }
}

export default async function MansaPropertyPage({ params }: Props) {
  const { slug } = await params
  const post = await wpApi.posts.getBySlug(slug)

  if (!post) {
    notFound()
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/developers" className="text-gray-600 hover:text-[#224D56]">
              Developers
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/developers/mansa"
              className="text-gray-600 hover:text-[#224D56]"
            >
              Mansa Properties
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#224D56] font-semibold">{post.title.rendered}</span>
          </nav>
        </div>
      </div>

      {/* Property Hero */}
      <section className="relative h-[600px]">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={post.title.rendered}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-2xl">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="max-w-7xl mx-auto px-8 pb-12 w-full">
            <h1
              className="text-4xl lg:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
            >
              {post.title.rendered}
            </h1>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-8">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
                >
                  About This Property
                </h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
              </div>

              {/* Excerpt if different from content */}
              {post.excerpt.rendered && post.excerpt.rendered !== post.content.rendered && (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Summary</h3>
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </div>
              )}

              {/* Project Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 text-[#224D56]">Project Type</h3>
                  <p className="text-gray-600">Featured Development</p>
                </div>
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 text-[#224D56]">Status</h3>
                  <p className="text-gray-600">Available</p>
                </div>
              </div>

              {/* Categories and Tags */}
              {post._embedded?.['wp:term'] && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {post._embedded['wp:term'][0]?.map((term: any) => (
                      <span
                        key={term.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {term.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Developer Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Developer</h3>
                <Link
                  href="/developers/mansa"
                  className="block hover:opacity-90 transition-opacity"
                >
                  <h4 className="text-lg font-bold text-[#224D56] mb-2">Mansa Properties</h4>
                  <p className="text-gray-600 text-sm">
                    Quality developments with innovative design and exceptional value.
                  </p>
                </Link>
              </div>

              {/* Contact Form */}
              <div className="bg-[#224D56] text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Interested in this property?</h3>
                <p className="mb-6">Get in touch with us for more information</p>
                <Link
                  href="/contact"
                  className="block text-center bg-white text-[#224D56] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </Link>
              </div>

              {/* Publication Info */}
              <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-bold mb-4">Publication Details</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Published:</span>{' '}
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-gray-600">Last Updated:</span>{' '}
                    {new Date(post.modified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            More Properties from Mansa
          </h2>
          <div className="text-center">
            <Link
              href="/developers/mansa"
              className="inline-block bg-[#224D56] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1a3d44] transition-colors"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}