import { wpApi } from '@/lib/api/wordpress'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SimpleCarousel from '@/src/components/SimpleCarousel'
import FAQSection from '@/src/components/FAQSection'
import ContactFormSection from '@/src/components/ContactFormSection'
import ImageShowcaseSection from '@/src/components/ImageShowcaseSection'

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await wpApi.pages.getBySlug('home').catch(() => null)

  if (homePage) {
    const rankMathSEO = await wpApi.rankmath.getSEOByPostId(homePage.id, 'page')

    let seoData
    if (rankMathSEO) {
      seoData = parseRankMathSEO(rankMathSEO)
    } else if (homePage.yoast_head_json) {
      seoData = parseYoastSEO(homePage.yoast_head_json)
    } else {
      seoData = parseRankMathSEO(null, {
        title: homePage.title.rendered,
        description: homePage.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
      })
    }

    return {
      title: seoData.title,
      description: seoData.description,
      openGraph: {
        title: seoData.openGraph.title,
        description: seoData.openGraph.description,
        url: seoData.openGraph.url,
        siteName: seoData.openGraph.siteName,
        images: seoData.openGraph.images,
        type: seoData.openGraph.type as any,
        locale: seoData.openGraph.locale,
      },
      twitter: {
        card: seoData.twitter.cardType as any,
        title: seoData.twitter.title,
        description: seoData.twitter.description,
        images: seoData.twitter.image ? [seoData.twitter.image] : undefined,
        creator: seoData.twitter.creator,
        site: seoData.twitter.site,
      },
      robots: seoData.robots ? {
        index: seoData.robots.index,
        follow: seoData.robots.follow,
      } : undefined,
      alternates: {
        canonical: seoData.canonical,
      },
    }
  }

  return {
    title: 'Mansa - Marketing Website',
    description: 'Welcome to Mansa',
  }
}

export default async function Home() {
  const homePage = await wpApi.pages.getBySlug('home').catch(() => null)
  const mediaImages = await wpApi.media.getAll({ media_type: 'image', per_page: 20 }).catch(() => [])

  // First, get the properties category
  const propertiesCategory = await wpApi.categories.getBySlug('properties').catch(() => null)

  // Fetch posts from properties category only for carousel
  const properties = propertiesCategory
    ? await wpApi.posts.getAll({
        per_page: 10,
        categories: [propertiesCategory.id],
        _embed: true
      }).catch(() => [])
    : []

  console.log('Fetched properties:', properties)
  console.log('Number of properties:', properties.length)
  if (properties.length > 0) {
    console.log('First property details:', {
      title: properties[0].title?.rendered,
      slug: properties[0].slug,
      hasEmbedded: !!properties[0]._embedded,
      hasFeaturedMedia: !!properties[0]._embedded?.['wp:featuredmedia'],
      featuredMediaUrl: properties[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url
    })
  }

  // Use direct hero image URL
  const heroImage = {
    source_url: 'https://ik.imagekit.io/slamseven/3699346bfbeb7e914d97ca326277009b9841dce3_D4dt-DTI0.jpg?updatedAt=1758914537538',
    alt_text: 'Hero Image'
  }

  // Fetch fallback image for posts without featured image
  const projectTileImage = mediaImages.find(img => img.title.rendered.toLowerCase().includes('project_tile')) || null

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen m-2" style={{ width: 'calc(100% - 16px)' }}>
        <Image
          src={heroImage.source_url}
          alt={heroImage.alt_text}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #224D56 2.19%, rgba(0, 0, 0, 0) 82.03%)' }}>
          <div className="text-center text-white px-4">
            <h1 style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', lineHeight: '1' }}>
              <span className="block font-normal" style={{ fontSize: '48px', lineHeight: '1' }}>Entrez dans une</span>
              <span className="block italic" style={{ fontWeight: 900, fontSize: '64px', lineHeight: '0.9' }}>nouvelle</span>
              <span className="block italic" style={{ fontWeight: 400, fontSize: '64px', lineHeight: '0.9' }}>réalité</span>
            </h1>
            <Link href="/contact" className="inline-block mt-8 px-8 py-3 text-white border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <section className="px-8 py-16">
        <div className="w-[40%]" style={{ marginLeft: '100px' }}>
          <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 300, fontSize: '48px', lineHeight: '1.2' }}>
            Découvrez une
          </p>
          <p style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', fontWeight: 900, fontSize: '48px', lineHeight: '1.2' }} className="italic">
            architecture
          </p>
          <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 300, fontSize: '48px', lineHeight: '1.2' }}>
            innovante qui
          </p>
          <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 300, fontSize: '48px', lineHeight: '1.2' }}>
            transforme vos rêves
          </p>
          <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 300, fontSize: '48px', lineHeight: '1.2' }}>
            en réalité
          </p>
        </div>
      </section>

      {/* Project Cards Section */}
      {properties.length > 0 && <SimpleCarousel posts={properties} fallbackImage={projectTileImage || undefined} />}

      {/* Image Showcase Section */}
      <ImageShowcaseSection mediaImages={mediaImages} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Form Section */}
      <ContactFormSection />

      {homePage ? (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: homePage.content.rendered }}
          />
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        </main>
      )}
    </div>
  )
}