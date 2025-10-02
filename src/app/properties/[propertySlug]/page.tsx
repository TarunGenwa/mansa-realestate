import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { parsePropertyContentSimple } from '../../../lib/utils/parsePropertyContent'
import PropertyGallery from '../../../components/PropertyGallery'

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

  // Parse the property content
  const parsedContent = parsePropertyContentSimple(property.content.rendered)
  console.log('Parsed property content:', parsedContent)
  // Debug logging for parsed content
  console.log('Property Slug:', propertySlug)
  console.log('Post ID:', property.id)
  console.log('Parsed Content:', parsedContent)

  return (
    <div className="min-h-screen pt-32">
      {/* Property Title and Logo */}
      <section className="pb-8 px-8 lg:px-16">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1
              className="text-4xl lg:text-5xl text-mono font-bold mb-4"
              dangerouslySetInnerHTML={{ __html: property.title.rendered }}
            />

            {/* Subtitle */}
            {parsedContent.subtitle && (
              <p className="text-lg text-gray-600 mt-4">
                {parsedContent.subtitle}
              </p>
            )}
          </div>

          {/* Developer Logo - Right Aligned */}
          {parsedContent.logo && (
            <div className="ml-8 flex-shrink-0">
              {parsedContent.developerLink ? (
                <Link href={parsedContent.developerLink} className="block border border-gray-300 p-4">
                  <Image
                    src={parsedContent.logo.src}
                    alt={parsedContent.logo.alt || 'Developer Logo'}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </Link>
              ) : (
                <div className="border border-gray-300 p-4">
                  <Image
                    src={parsedContent.logo.src}
                    alt={parsedContent.logo.alt || 'Developer Logo'}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Hero Images - Side by Side */}
      {(parsedContent.heroLeftImage || parsedContent.heroRightImage) && (
        <section className="pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Hero Image */}
            {parsedContent.heroLeftImage && (
              <div className="relative h-96 lg:h-[600px]">
                <Image
                  src={parsedContent.heroLeftImage.src}
                  alt={parsedContent.heroLeftImage.alt || 'Hero Left'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            )}

            {/* Right Hero Image */}
            {parsedContent.heroRightImage && (
              <div className="relative h-96 lg:h-[600px]">
                <Image
                  src={parsedContent.heroRightImage.src}
                  alt={parsedContent.heroRightImage.alt || 'Hero Right'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Overview Section */}
      {parsedContent.overviewText && (
        <section className="pb-12 px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* APERCU Heading - Left Side */}
            <div className="lg:col-span-3">
              <h2 className="text-[20px] font-semibold">APERÇU</h2>
            </div>

            {/* Overview Text and Image - Right Side */}
            <div className="lg:col-span-9">
              <p className="text-lg text-gray-700 mb-8">
                {parsedContent.overviewText}
              </p>

              {/* Overview Image */}
              {parsedContent.overviewImage && (
                <div className="relative w-full h-64 lg:h-96">
                  <Image
                    src={parsedContent.overviewImage.src}
                    alt={parsedContent.overviewImage.alt || 'Overview'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Typologies Section */}
      {parsedContent.typologies && parsedContent.typologies.length > 0 && (
        <section className="pb-12 px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* TYPOLOGIES Heading - Left Side */}
            <div className="lg:col-span-3">
              <h2 className="text-[20px] font-semibold">TYPOLOGIES</h2>
            </div>

            {/* Typologies List - Right Side */}
            <div className="lg:col-span-9">
              <ul className="space-y-2 text-right">
                {parsedContent.typologies.map((item, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Offer & Price Section */}
      {parsedContent.offerPrice && parsedContent.offerPrice.length > 0 && (
        <section className="pb-12 px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* OFFRE & PRIX Heading - Left Side */}
            <div className="lg:col-span-3">
              <h2 className="text-[20px] font-semibold">OFFRE & PRIX</h2>
            </div>

            {/* Offer & Price List - Right Side */}
            <div className="lg:col-span-9">
              <ul className="divide-y divide-gray-200">
                {parsedContent.offerPrice.map((item, index) => (
                  <li key={index} className="py-4 flex justify-between items-start">
                    <span className="font-semibold text-lg text-gray-700">{item.heading}</span>
                    <span className="text-lg text-gray-700 text-right ml-8">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Life & Community Section */}
      {parsedContent.lifeCommunity && parsedContent.lifeCommunity.length > 0 && (
        <section className="pb-12 px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* VIE & COMMUNAUTÉ Heading - Left Side */}
            <div className="lg:col-span-3">
              <h2 className="text-[20px] font-semibold">VIE & COMMUNAUTÉ</h2>
            </div>

            {/* Life & Community List - Right Side */}
            <div className="lg:col-span-9">
              <ul className="divide-y divide-gray-200">
                {parsedContent.lifeCommunity.map((item, index) => (
                  <li key={index} className="py-4 flex justify-between items-start">
                    <span className="font-semibold text-lg text-gray-700">{item.heading}</span>
                    <span className="text-lg text-gray-700 text-right ml-8">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Brochure PDF Section */}
      {parsedContent.brochurePdf && (
        <section className="pb-12 px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* BROCHURE PDF Heading - Left Side */}
            <div className="lg:col-span-3">
              <h2 className="text-[20px] font-semibold">BROCHURE PDF</h2>
            </div>

            {/* Brochure Text and Link - Right Side */}
            <div className="lg:col-span-9 flex justify-between items-center">
              <span className="text-lg text-gray-700">{parsedContent.brochurePdf.text}</span>
              {parsedContent.brochurePdf.linkPreview ? (
                <Link
                  href={parsedContent.brochurePdf.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-8"
                >
                  <Image
                    src={parsedContent.brochurePdf.linkPreview.src}
                    alt={parsedContent.brochurePdf.linkPreview.alt || 'Brochure Preview'}
                    width={100}
                    height={100}
                    className="object-contain hover:opacity-80 transition-opacity"
                  />
                </Link>
              ) : (
                <Link
                  href={parsedContent.brochurePdf.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-blue-600 hover:text-blue-800 underline ml-8"
                >
                  Télécharger
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}