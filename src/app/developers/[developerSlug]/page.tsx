import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeveloperPropertiesSection from '../../../components/DeveloperPropertiesSection'

// Enable ISR - revalidate every 1 hour for developers
export const revalidate = 3600

interface DeveloperPageProps {
  params: Promise<{
    developerSlug: string
  }>
}

// Generate static params at build time for all developers
export async function generateStaticParams() {
  // Get developers category
  const developersCategory = await wpApi.categories.getBySlug('developers').catch(() => null)

  if (!developersCategory) {
    return []
  }

  // Fetch all developer posts
  const developers = await wpApi.posts.getAll({
    categories: [developersCategory.id],
    per_page: 100,
    _embed: false
  }).catch(() => [])

  return developers.map((developer) => ({
    developerSlug: developer.slug,
  }))
}

export async function generateMetadata({ params }: DeveloperPageProps): Promise<Metadata> {
  const { developerSlug } = await params

  // Get developers category
  const developersCategory = await wpApi.categories.getBySlug('developers').catch(() => null)
  if (!developersCategory) {
    return {
      title: 'Developer Not Found - Mansa',
      description: 'The requested developer could not be found.',
    }
  }


  

  // Fetch the developer post by slug
  const developer = await wpApi.posts.getBySlug(developerSlug).catch(() => null)

  if (!developer) {
    return {
      title: 'Developer Not Found - Mansa',
      description: 'The requested developer could not be found.',
    }
  }

  // Verify this post is in the developers category
  const isDeveloper = developer.categories?.includes(developersCategory.id)
  if (!isDeveloper) {
    return {
      title: 'Developer Not Found - Mansa',
      description: 'The requested developer could not be found.',
    }
  }

  return {
    title: `${developer.title.rendered} - Mansa`,
    description: developer.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  }
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
  const { developerSlug } = await params
  const consultationMedia = await wpApi.media.getBySlug('schedule-consultation')
  // Get developers category
  const developersCategory = await wpApi.categories.getBySlug('developers').catch(() => null)
  if (!developersCategory) {
    notFound()
  }

  // Fetch the developer post by slug
  const developer = await wpApi.posts.getBySlug(developerSlug).catch(() => null)

  if (!developer) {
    notFound()
  }

  // Verify this post is in the developers category
  const isDeveloper = developer.categories?.includes(developersCategory.id)
  if (!isDeveloper) {
    notFound()
  }

  // Get featured image
  const featuredImage = developer._embedded?.['wp:featuredmedia']?.[0]

  // Fetch properties by this developer
  // First get properties category
  const propertiesCategory = await wpApi.categories.getBySlug('properties').catch(() => null)
  let developerProperties: any[] = []

  if (propertiesCategory) {
    // Fetch all properties
    const allProperties = await wpApi.posts.getAll({
      categories: [propertiesCategory.id],
      per_page: 100,
      _embed: true
    }).catch(() => [])

    // Filter properties that mention this developer in their content or title
    // This is a simple approach - you might want to use ACF fields or custom taxonomies for better association
    const developerTitle = developer.title.rendered.replace(/<[^>]*>/g, '').toLowerCase()
    developerProperties = allProperties.filter((property: any) => {
      const propertyContent = property.content.rendered.toLowerCase()
      const propertyTitle = property.title.rendered.toLowerCase()
      return propertyContent.includes(developerTitle) || propertyTitle.includes(developerTitle)
    })
  }

  // Log for debugging
  console.log('Developer Slug:', developerSlug)
  console.log('Developer Post:', developer)
  console.log('Featured Image:', featuredImage)

  return (
    <div className="min-h-screen pt-24">

      {/* Hero Section with Featured Image */}
      {featuredImage && (
        <section className="relative h-[500px] md:h-[600px] lg:h-[700px] mb-12">
          <div className="absolute inset-0">
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || developer.title.rendered}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-40" /> */}
          </div>

          {/* Hero Content Overlay */}
          {/* <div
            className="relative h-full flex items-end"
            style={{ paddingLeft: '87px', paddingRight: '87px', paddingBottom: '60px' }}
          >
            <div className="max-w-7xl mx-auto w-full">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-white mb-4"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 700,
                  lineHeight: '1.2'
                }}
                dangerouslySetInnerHTML={{ __html: developer.title.rendered }}
              />


              {developer.excerpt.rendered && (
                <div
                  className="text-lg md:text-xl text-white/90 max-w-3xl"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 400,
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: developer.excerpt.rendered.replace(/<[^>]*>/g, '')
                  }}
                />
              )}
            </div>
          </div> */}
        </section>
      )}

      {/* If no featured image, show title without hero */}
      {!featuredImage && (
        <section className="pb-12" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
          <div className="max-w-7xl mx-auto">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl mb-6"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 700,
                lineHeight: '1.2'
              }}
              dangerouslySetInnerHTML={{ __html: developer.title.rendered }}
            />

            {developer.excerpt.rendered && (
              <div
                className="text-lg md:text-xl text-gray-600 max-w-3xl"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.6'
                }}
                dangerouslySetInnerHTML={{
                  __html: developer.excerpt.rendered.replace(/<[^>]*>/g, '')
                }}
              />
            )}
          </div>
        </section>
      )}

      {/* Developer Content */}
      <section className="py-12" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Render WordPress content */}
              <div
                className="developer-content"
                dangerouslySetInnerHTML={{ __html: developer.content.rendered }} />
            </div>

          </div>
        </div>
      </section>

      {/* Developer Properties Carousel */}
      <DeveloperPropertiesSection
        developerName={developer.title.rendered.replace(/<[^>]*>/g, '')}
        properties={developerProperties}
      />

      {/* Schedule a Consultation Section */}
        {consultationMedia?.source_url && (
          <section className="mt-20 relative w-full h-[700px] overflow-hidden">
            <Image
              src={consultationMedia.source_url}
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


    </div>
  )
}