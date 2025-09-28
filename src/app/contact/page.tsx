import { wpApi } from '@/lib/api/wordpress'
import { parseRankMathSEO, parseYoastSEO } from '@/lib/seo/utils'
import { Metadata } from 'next'
import ContactHeroSection from '@/src/components/ContactHeroSection'
import ContactMapSection from '@/src/components/ContactMapSection'
import FAQSection from '@/src/components/FAQSection'

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await wpApi.pages.getBySlug('contact').catch(() => null)

  if (contactPage) {
    const rankMathSEO = await wpApi.rankmath.getSEOByPostId(contactPage.id, 'page')

    let seoData
    if (rankMathSEO) {
      seoData = parseRankMathSEO(rankMathSEO)
    } else if (contactPage.yoast_head_json) {
      seoData = parseYoastSEO(contactPage.yoast_head_json)
    } else {
      seoData = parseRankMathSEO(null, {
        title: 'Contact Us - Mansa',
        description: 'Get in touch with Mansa. Visit our office in Dubai or send us a message.',
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
    title: 'Contact Us - Mansa',
    description: 'Get in touch with Mansa. Visit our office in Dubai or send us a message.',
  }
}

export default async function ContactPage() {
  const mediaImages = await wpApi.media.getAll({ media_type: 'image', per_page: 100 }).catch(() => [])

  // Fetch allproperties_banner image
  const heroImage = mediaImages.find(img => img.title.rendered.toLowerCase().includes('allproperties_banner')) || null

  return (
    <div className="min-h-screen">
      {/* Hero Section with Contact Form */}
      <ContactHeroSection heroImage={heroImage} />

      {/* Map and Visit Us Section */}
      <ContactMapSection />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  )
}