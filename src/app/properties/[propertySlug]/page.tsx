import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Image from 'next/image'
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
            <div className="ml-8 flex-shrink-0 border border-gray-300 p-4">
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
      </section>
    </div>
  )
}