import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Mansa Properties - Mansa',
  description: 'Explore our featured properties and developments',
}

export default async function MansaPropertiesPage() {
  // Fetch posts to use as fallback properties
  const posts = await wpApi.posts.getAll({
    per_page: 20,
    _embed: true
  }).catch(() => [])

  return (
    <div className="min-h-screen">
      {/* Developer Header */}
      <section className="relative h-96 bg-[#224D56]">
        <div className="relative h-full flex items-center px-8">
          <div className="max-w-7xl mx-auto w-full">
            <h1
              className="text-5xl lg:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
            >
              Mansa Properties
            </h1>
            <p className="text-white/90 text-xl">Featured developments and properties</p>
          </div>
        </div>
      </section>

      {/* Developer Info */}
      <section className="py-12 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="lg:col-span-2">
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
              >
                About Mansa Properties
              </h2>
              <div className="prose prose-lg max-w-none">
                <p>
                  Mansa Properties is committed to delivering exceptional real estate developments
                  that transform communities and create lasting value. Our portfolio showcases
                  innovative architecture and thoughtful design that meets the evolving needs
                  of modern living.
                </p>
                <p>
                  With a focus on sustainability, quality craftsmanship, and customer satisfaction,
                  we continue to set new standards in the real estate industry.
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <Link href="/contact" className="text-[#224D56] hover:underline">
                      Contact Us
                    </Link>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600">Featured Projects</p>
                    <p className="text-2xl font-bold text-[#224D56]">{posts.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            Featured Properties
          </h2>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

                return (
                  <Link
                    key={post.id}
                    href={`/developers/mansa/properties/${post.slug}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Property Image */}
                    <div className="relative h-56 bg-gray-200">
                      {featuredImage ? (
                        <Image
                          src={featuredImage}
                          alt={post.title.rendered}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <span className="text-gray-500">No image available</span>
                        </div>
                      )}
                    </div>

                    {/* Property Info */}
                    <div className="p-6">
                      <h3
                        className="text-xl font-bold mb-2 group-hover:text-[#224D56] transition-colors"
                        style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
                      >
                        {post.title.rendered}
                      </h3>

                      {post.excerpt.rendered && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                      )}

                      {/* View Details Link */}
                      <div className="flex items-center text-[#224D56] font-semibold">
                        <span className="group-hover:mr-2 transition-all">View Details</span>
                        <svg
                          className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <p className="text-xl text-gray-600">No properties available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}