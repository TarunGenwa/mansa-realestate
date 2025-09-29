import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { parsePropertyContentSimple } from '../../../lib/utils/parsePropertyContent'

// Enable ISR - revalidate every 30 minutes for properties
export const revalidate = 1800

interface PropertyPageProps {
  params: Promise<{
    propertySlug: string
  }>
}

// Generate static params at build time for all properties
export async function generateStaticParams() {
  // Get properties category
  const propertiesCategory = await wpApi.categories.getBySlug('properties').catch(() => null)

  if (!propertiesCategory) {
    return []
  }

  // Fetch all property posts
  const properties = await wpApi.posts.getAll({
    categories: [propertiesCategory.id],
    per_page: 100,
    _embed: false
  }).catch(() => [])

  return properties.map((property) => ({
    propertySlug: property.slug,
  }))
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { propertySlug } = await params
  const property = await wpApi.posts.getBySlug(propertySlug).catch(() => null)

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

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { propertySlug } = await params

  // Get properties category to verify this is a property
  const propertiesCategory = await wpApi.categories.getBySlug('properties').catch(() => null)

  const property = await wpApi.posts.getBySlug(propertySlug).catch(() => null)
  console.log('Fetched property:', property)
  if (!property || !propertiesCategory) {
    notFound()
  }

  // Verify this post is in the properties category
  const isProperty = property.categories?.includes(propertiesCategory.id)
  if (!isProperty) {
    notFound()
  }

  const featuredImage = property._embedded?.['wp:featuredmedia']?.[0]

  // Fetch all media to find property-specific images
  const allMedia = await wpApi.media.getAll({
    media_type: 'image',
    per_page: 100
  }).catch(() => [])

  // Look for property-specific images using alt text
  // These should be attached to the property post and have specific alt text
  const heroImageLeft = allMedia.find(img => img.alt_text?.toLowerCase().includes('property_hero_left'))
  const heroImageRight = allMedia.find(img => img.alt_text?.toLowerCase().includes('property_hero_right'))
  const overviewImage = allMedia.find(img => img.alt_text?.toLowerCase().includes('property_overview'))

  // Parse the property content
  const parsedContent = parsePropertyContentSimple(property.content.rendered)

  // Debug logging for images and content
  console.log('Property Slug:', propertySlug)
  console.log('Post ID:', property.id)
  console.log('Parsed Content:', parsedContent)
  console.log('Total Media Count:', allMedia.length)
  console.log('Found Hero Left:', heroImageLeft?.alt_text, heroImageLeft?.source_url)
  console.log('Found Hero Right:', heroImageRight?.alt_text, heroImageRight?.source_url)
  console.log('Found Overview Image:', overviewImage?.alt_text, overviewImage?.source_url)
  console.log('Featured Image:', featuredImage?.source_url)

  return (
    <div className="min-h-screen pt-32">

      {/* Property Title and Subtitle - Full Width */}
      <section className="pb-8 px-8 lg:px-16">
        <h1
          className="text-4xl lg:text-5xl mb-6"
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 700,
            lineHeight: '1.2'
          }}
          dangerouslySetInnerHTML={{ __html: property.title.rendered }}
        />

        {/* Subtitle - First Description Element */}
        {parsedContent.description.length > 0 && (
          <div
            className="text-lg text-gray-600"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400,
              lineHeight: '1.6'
            }}
          >
            {parsedContent.description[0]}
          </div>
        )}
      </section>

      {/* Property Hero Images - Full Width */}
      <section className="pb-12">
        {(heroImageLeft || heroImageRight || featuredImage) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Hero Image */}
            <div className="relative h-96 lg:h-[600px]">
              <Image
                src={heroImageLeft?.source_url || featuredImage?.source_url || "https://ik.imagekit.io/slamseven/3699346bfbeb7e914d97ca326277009b9841dce3_D4dt-DTI0.jpg?updatedAt=1758914537538"}
                alt={heroImageLeft?.alt_text || featuredImage?.alt_text || property.title.rendered}
                fill
                className="object-cover rounded-tr-lg rounded-br-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>

            {/* Right Hero Image */}
            <div className="relative h-96 lg:h-[600px]">
              <Image
                src={heroImageRight?.source_url || featuredImage?.source_url || "https://ik.imagekit.io/slamseven/3699346bfbeb7e914d97ca326277009b9841dce3_D4dt-DTI0.jpg?updatedAt=1758914537538"}
                alt={heroImageRight?.alt_text || property.title.rendered}
                fill
                className="object-cover rounded-tl-lg rounded-bl-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>
        )}
      </section>

      {/* Second Description Element - Bottom of Hero */}
      {parsedContent.description.length > 1 && (
        <section className="pb-12" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
          <div className="max-w-7xl mx-auto">
            <div
              className="text-lg text-gray-700 max-w-4xl"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                lineHeight: '1.6'
              }}
            >
              {parsedContent.description[1]}
            </div>
          </div>
        </section>
      )}

      {/* Property Content and Overview */}
      <section style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content with Overview Image */}
            <div className="lg:col-span-2">

              {/* Overview Image */}
              {overviewImage && (
                <div className="relative h-80 lg:h-[400px] mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={overviewImage.source_url}
                    alt={overviewImage.alt_text || `${property.title.rendered} Overview`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              )}

              {/* Structured Content Display */}
              <div className="space-y-6 mb-8">
                {/* Additional Description Paragraphs (starting from third element) */}
                {parsedContent.description.length > 2 && (
                  <div className="space-y-4">
                    {parsedContent.description.slice(2).map((paragraph: string, index: number) => (
                      <p
                        key={index + 2}
                        className="text-lg leading-relaxed text-gray-700"
                        style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontWeight: 400
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Property Details List */}
                {Object.keys(parsedContent.details).length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{
                        fontFamily: 'var(--font-montserrat), Montserrat, sans-serif'
                      }}
                    >
                      Property Features
                    </h3>
                    <ul className="space-y-3">
                      {parsedContent.details.type && (
                        <li className="flex items-start">
                          <span className="font-semibold text-gray-700 min-w-[150px]">Type:</span>
                          <span className="text-gray-600">{parsedContent.details.type}</span>
                        </li>
                      )}
                      {parsedContent.details.modern && (
                        <li className="flex items-start">
                          <span className="font-semibold text-gray-700 min-w-[150px]">Modern:</span>
                          <span className="text-gray-600">{parsedContent.details.modern}</span>
                        </li>
                      )}
                      {parsedContent.details.targetMarket && (
                        <li className="flex items-start">
                          <span className="font-semibold text-gray-700 min-w-[150px]">Target Market:</span>
                          <span className="text-gray-600">{parsedContent.details.targetMarket}</span>
                        </li>
                      )}
                      {parsedContent.details.uniqueSellingPoints && (
                        <li className="flex items-start">
                          <span className="font-semibold text-gray-700 min-w-[150px]">USP:</span>
                          <span className="text-gray-600">{parsedContent.details.uniqueSellingPoints}</span>
                        </li>
                      )}
                      {parsedContent.details.location && (
                        <li className="flex items-start">
                          <span className="font-semibold text-gray-700 min-w-[150px]">Coordinates:</span>
                          <span className="text-gray-600">{parsedContent.details.location}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details Sidebar */}
            {/* <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                >
                  Property Details
                </h3>

                {(property as any).acf && (
                  <div className="space-y-4">
                    {(property as any).acf.location && (
                      <div>
                        <span className="font-semibold text-gray-700">Location:</span>
                        <p className="text-gray-600">{(property as any).acf.location}</p>
                      </div>
                    )}

                    {((property as any).acf.price || (property as any).acf.price_from) && (
                      <div>
                        <span className="font-semibold text-gray-700">Price:</span>
                        <p className="text-lg font-bold text-black">
                          {(property as any).acf.price || `From ${(property as any).acf.price_from}`}
                        </p>
                      </div>
                    )}

                    {(property as any).acf.status && (
                      <div>
                        <span className="font-semibold text-gray-700">Status:</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ml-2 ${
                          (property as any).acf.status === 'available' ? 'bg-green-100 text-green-800' :
                          (property as any).acf.status === 'sold' ? 'bg-red-100 text-red-800' :
                          (property as any).acf.status === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {(property as any).acf.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                )}


                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4
                    className="font-semibold mb-3"
                    style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                  >
                    Interested in this property?
                  </h4>
                  <Link
                    href="/contact"
                    className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors text-center block"
                    style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 500 }}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>


      {/* Related Properties */}
      {/* <section className="py-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-semibold mb-8"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Similar Properties
          </h2>

          <div className="text-center py-8">
            <Link
              href="/properties"
              className="inline-block bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 500 }}
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  )
}