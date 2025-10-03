import { wpData } from '@/lib/data/wordpress-loader'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { parseFeaturedPosts } from '@/lib/utils/parseFeaturedPosts'
import { Metadata } from 'next'
import FAQSection from '@/src/components/FAQSection'
import ContactFormSection from '@/src/components/ContactFormSection'
import ImageShowcaseSection from '@/src/components/ImageShowcaseSection'
import DirectorSection from '@/src/components/DirectorSection'
import HomeHeroCarousel from '@/src/components/HomeHeroCarousel'
import TailorMadeSection from '@/src/components/TailorMadeSection'
import PartnersSection from '@/src/components/PartnersSection'
import SimpleCarousel from '@/src/components/SimpleCarousel'
import GuidesCarousel from '@/src/components/GuidesCarousel'

// Enable ISR - revalidate every 1 hour (3600 seconds)
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const homePage = wpData.pages.getBySlug('home')

  if (homePage) {
    // For static data, we won't have RankMath SEO dynamically
    // Use basic SEO from page data
    const seoData = parseRankMathSEO(null, {
      title: homePage.title.rendered,
      description: homePage.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Welcome to Mansa',
    })

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
  // Get featured posts configuration
  const featuredPostsData = wpData.posts.getBySlug('featured-posts')
  let featuredProperties: any[] = []

  if (featuredPostsData) {
    // Parse the featured posts content
    const featuredList = parseFeaturedPosts(featuredPostsData.content.rendered)

    // Get the actual property data for each featured slug and add custom image
    featuredProperties = featuredList
      .map(featured => {
        const property = wpData.properties.getBySlug(featured.slug)
        if (property) {
          return {
            ...property,
            _featuredImage: featured.imageUrl // Add custom featured image
          }
        }
        return null
      })
      .filter(Boolean) // Remove null entries
  }

  // Fallback to regular properties if no featured posts found
  const properties = featuredProperties.length > 0
    ? featuredProperties
    : wpData.properties.getAll().slice(0, 10)

  const guides = wpData.guides.getAll().slice(0, 10)

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HomeHeroCarousel />

      {/* Text Section */}
      <section className="py-16 px-4 sm:px-8 lg:px-[87px]">
        <div className="flex justify-between items-center">
          <div className="w-[45%]">
            <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 500, fontSize: '48px', lineHeight: '1.2', textAlign: 'left' }}>
              <span style={{ fontWeight: 900, }}>MANSA </span>
               Real Estate, <br></br> votre 
                <span style={{ fontWeight: 900,  fontStyle: 'italic', fontFamily: 'var(--font-playfair), Playfair Display, serif' }}> partenaire </span> 
                aux  <br></br> Émirats arabes unis.
                {/* fontFamily: 'var(--font-playfair), Playfair Display, serif', */}
            </p>
          </div>
          <div className="w-[45%]">
            <p style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 200, fontSize: '24px', lineHeight: '1.8', textAlign: 'right' }}>
              Avec 15 ans d'expertise dans l'immobilier aux Émirats arabes unis, Dubaï et Abu Dhabi demeurent les destinations les plus convoitées.
              <br></br> <span className='bold'>___________</span>
            </p>
          </div>
        </div>
      </section>

      {/* Properties Carousel */}
      {properties.length > 0 && <SimpleCarousel posts={properties} />}

      {/* Tailor Made Section */}
      <TailorMadeSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* Image Showcase Section */}
      <ImageShowcaseSection />

      {/* Guides Carousel */}
      {guides.length > 0 && <GuidesCarousel posts={guides} />}

      {/* Director Introduction Section */}
      <DirectorSection />

       {/* FAQ Section */}
      <FAQSection />

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