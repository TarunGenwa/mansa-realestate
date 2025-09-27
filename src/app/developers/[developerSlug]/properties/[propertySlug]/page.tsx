import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    developerSlug: string
    propertySlug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertySlug } = await params
  const property = await wpApi.properties.getBySlug(propertySlug)

  if (!property) {
    return {
      title: 'Property Not Found - Mansa',
      description: 'The requested property could not be found.',
    }
  }

  return {
    title: `${property.title.rendered} - Mansa`,
    description: property.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  }
}

export default async function PropertyPage({ params }: Props) {
  const { developerSlug, propertySlug } = await params

  // Fetch property
  const property = await wpApi.properties.getBySlug(propertySlug)

  // Fallback to post if property custom post type is not set up yet
  const post = !property ? await wpApi.posts.getBySlug(propertySlug) : null
  const item = property || post

  if (!item) {
    notFound()
  }

  // Fetch developer
  const developer = property && property.acf?.developer_id
    ? await wpApi.developers.getById(property.acf.developer_id)
    : await wpApi.developers.getBySlug(developerSlug)

  // Fallback developer
  const developerPost = !developer ? await wpApi.posts.getBySlug(developerSlug) : null
  const developerItem = developer || developerPost

  const featuredImage = item._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const gallery = 'acf' in item ? item.acf?.gallery || [] : []

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
              href={`/developers/${developerSlug}`}
              className="text-gray-600 hover:text-[#224D56]"
            >
              {developerItem?.title.rendered || 'Developer'}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#224D56] font-semibold">{item.title.rendered}</span>
          </nav>
        </div>
      </div>

      {/* Property Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[600px]">
          {/* Main Image */}
          <div className="relative">
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={item.title.rendered}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-lg">No image available</span>
              </div>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 grid-rows-2">
            {gallery.slice(0, 4).map((img: any, index: number) => (
              <div key={img.id || index} className="relative">
                <Image
                  src={img.url}
                  alt={img.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                {index === 3 && gallery.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">+{gallery.length - 4} more</span>
                  </div>
                )}
              </div>
            ))}
            {gallery.length === 0 && Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="relative bg-gray-200">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title and Status */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <h1
                    className="text-4xl lg:text-5xl font-bold"
                    style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
                  >
                    {item.title.rendered}
                  </h1>
                  {'acf' in item && item.acf?.status && (
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      item.acf.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.acf.status === 'sold' ? 'bg-red-100 text-red-800' :
                      item.acf.status === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.acf.status.replace('-', ' ').toUpperCase()}
                    </span>
                  )}
                </div>

                {'acf' in item && item.acf?.location && (
                  <p className="text-xl text-gray-600 mb-4">
                    <span className="inline-block mr-2">📍</span>
                    {item.acf.location}
                  </p>
                )}

                {'acf' in item && (item.acf?.price || item.acf?.price_from) && (
                  <p className="text-3xl font-bold text-[#224D56]">
                    {item.acf.price ||
                     (item.acf.price_from && item.acf.price_to
                       ? `${item.acf.price_from} - ${item.acf.price_to}`
                       : `From ${item.acf.price_from}`)}
                  </p>
                )}
              </div>

              {/* Property Features */}
              {'acf' in item && (
                <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 p-6 rounded-lg">
                  {item.acf?.bedrooms && (
                    <div>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                      <p className="text-2xl font-bold">{item.acf.bedrooms}</p>
                    </div>
                  )}
                  {item.acf?.bathrooms && (
                    <div>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                      <p className="text-2xl font-bold">{item.acf.bathrooms}</p>
                    </div>
                  )}
                  {item.acf?.area && (
                    <div>
                      <p className="text-sm text-gray-600">Area</p>
                      <p className="text-2xl font-bold">{item.acf.area}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
                >
                  Description
                </h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.content.rendered }}
                />
              </div>

              {/* Amenities */}
              {'acf' in item && item.acf?.amenities && item.acf.amenities.length > 0 && (
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
                  >
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {item.acf.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Floor Plans */}
              {'acf' in item && item.acf?.floor_plans && item.acf.floor_plans.length > 0 && (
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
                  >
                    Floor Plans
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {item.acf.floor_plans.map((plan: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-64">
                          <Image
                            src={plan.image.url}
                            alt={plan.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">{plan.title}</h3>
                          <div className="flex gap-4 text-sm text-gray-600">
                            {plan.bedrooms && <span>{plan.bedrooms} Beds</span>}
                            {plan.bathrooms && <span>{plan.bathrooms} Baths</span>}
                            {plan.area && <span>{plan.area}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Developer Card */}
              {developerItem && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Developer</h3>
                  <Link
                    href={`/developers/${developerSlug}`}
                    className="block hover:opacity-90 transition-opacity"
                  >
                    {developerItem._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                      <div className="relative h-32 mb-4">
                        <Image
                          src={developerItem._embedded['wp:featuredmedia'][0].source_url}
                          alt={developerItem.title.rendered}
                          fill
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <h4 className="text-lg font-bold text-[#224D56]">{developerItem.title.rendered}</h4>
                  </Link>
                  {'acf' in developerItem && (
                    <div className="mt-4 space-y-2 text-sm">
                      {developerItem.acf?.email && (
                        <a href={`mailto:${developerItem.acf.email}`} className="block text-gray-600 hover:text-[#224D56]">
                          {developerItem.acf.email}
                        </a>
                      )}
                      {developerItem.acf?.phone && (
                        <a href={`tel:${developerItem.acf.phone}`} className="block text-gray-600 hover:text-[#224D56]">
                          {developerItem.acf.phone}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}