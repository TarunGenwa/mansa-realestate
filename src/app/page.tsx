import { wpApi } from '@/lib/api/wordpress'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { Metadata } from 'next'
import SimpleCarousel from '@/src/components/SimpleCarousel'
import FAQSection from '@/src/components/FAQSection'
import ContactFormSection from '@/src/components/ContactFormSection'
import ImageShowcaseSection from '@/src/components/ImageShowcaseSection'
import DirectorSection from '@/src/components/DirectorSection'
import HeroCarousel from '@/src/components/HeroCarousel'

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
  const mediaImages = await wpApi.media.getAll({ media_type: 'image', per_page: 100 }).catch(() => [])

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

  // Fetch hero carousel images from WordPress media
  const heroImages = [
    mediaImages.find(img => img.title.rendered.toLowerCase().includes('hero_landing_1')),
    mediaImages.find(img => img.title.rendered.toLowerCase().includes('hero_landing_2')),
    mediaImages.find(img => img.title.rendered.toLowerCase().includes('hero_landing_3'))
  ].filter(Boolean) as typeof mediaImages // Remove any undefined images and assert type

  // Fallback if no hero images found
  const fallbackHeroImage = {
    source_url: 'https://via.placeholder.com/1920x1080?text=Hero+Image',
    alt_text: 'Hero Image',
    title: { rendered: 'Hero Image' }
  }

  const finalHeroImages = heroImages.length > 0 ? heroImages.map(img => ({
    source_url: img.source_url,
    alt_text: img.alt_text,
    title: img.title
  })) : [fallbackHeroImage]

  // Fetch fallback image for posts without featured image
  const projectTileImage = mediaImages.find(img => img.title.rendered.toLowerCase().includes('project_tile')) || null


  // Fetch Ismahen image
  const ismahenImage = mediaImages.find(img => img.title.rendered.toLowerCase().includes('ismahen')) || null

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroCarousel images={finalHeroImages} />

      {/* Text Section */}
      <section className="py-16" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="w-[40%]">
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

      {/* Director Introduction Section */}
      <DirectorSection directorImage={ismahenImage} />

      {/* Contact Form Section */}
      <ContactFormSection />

      {/* {homePage ? (
        <main style={{ paddingLeft: '87px', paddingRight: '87px' }} className="py-8">
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: homePage.content.rendered }}
          />
        </main>
      ) : (
        <main style={{ paddingLeft: '87px', paddingRight: '87px' }} className="py-16 text-center">
        </main>
      )} */}
    </div>
  )
}