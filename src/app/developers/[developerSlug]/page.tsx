import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import GuidesCarousel from '../../../components/GuidesCarousel'
import { parseDeveloperContent } from '../../../lib/utils/parseDeveloperContent'

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

  // Get the guides category
  const guidesCategory = await wpApi.categories.getBySlug('guides').catch(() => null)

  // Fetch posts from guides category for carousel
  const guides = guidesCategory
    ? await wpApi.posts.getAll({
        per_page: 10,
        categories: [guidesCategory.id],
        _embed: true
      }).catch(() => [])
    : []

  // Parse the developer content
  const parsedContent = parseDeveloperContent(developer.content.rendered)

  // Log for debugging
  console.log('Developer Slug:', developerSlug)
  console.log('Developer Post:', developer)
  console.log('Featured Image:', featuredImage)
  console.log('Parsed Content:', parsedContent)

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

      {/* Overview Section */}
      {parsedContent.overviewText && (
        <section className="pb-12 px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* OVERVIEW Heading - Left Side */}
            <div className="lg:col-span-3">
              <h2 className="text-[20px] font-semibold">OVERVIEW</h2>
            </div>

            {/* Overview Text - Right Side */}
            <div className="lg:col-span-9">
              <p className="text-lg text-gray-700 mb-8">
                {parsedContent.overviewText}
              </p>

              {/* Overview List */}
              {parsedContent.overviewList && parsedContent.overviewList.length > 0 && (
                <ul className="divide-y divide-gray-200">
                  {parsedContent.overviewList.map((item, index) => (
                    <li key={index} className="py-4 flex justify-between items-start">
                      <span className="font-semibold text-lg text-gray-700">{item.heading}</span>
                      <span className="text-lg text-gray-700 text-right ml-8">{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Guides Carousel */}
      {guides.length > 0 && (
        <GuidesCarousel
          posts={guides}
          customHeading={
            <>
              Retrouvez nos <span className='text-h3 text-play-black-italic'>nos guides d'experts</span>
            </>
          }
        />
      )}



    </div>
  )
}