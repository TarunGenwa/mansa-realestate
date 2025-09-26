import { NextSeo, NextSeoProps } from 'next-seo'
import { SEOData } from '@/lib/seo/utils'

interface SEOHeadProps {
  seoData: SEOData
  additionalMetaTags?: NextSeoProps['additionalMetaTags']
  additionalLinkTags?: NextSeoProps['additionalLinkTags']
}

export default function SEOHead({ seoData, additionalMetaTags, additionalLinkTags }: SEOHeadProps) {
  const seoConfig: NextSeoProps = {
    title: seoData.title,
    description: seoData.description,
    canonical: seoData.canonical,
    openGraph: {
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
      url: seoData.openGraph.url,
      siteName: seoData.openGraph.siteName,
      images: seoData.openGraph.images,
      type: seoData.openGraph.type as any,
      locale: seoData.openGraph.locale,
      article: seoData.openGraph.article ? {
        publishedTime: seoData.openGraph.article.publishedTime,
        modifiedTime: seoData.openGraph.article.modifiedTime,
        authors: seoData.openGraph.article.author ? [seoData.openGraph.article.author] : undefined,
      } : undefined,
    },
    twitter: {
      handle: seoData.twitter.creator,
      site: seoData.twitter.site,
      cardType: seoData.twitter.cardType as any,
    },
    robotsProps: seoData.robots ? {
      noindex: !seoData.robots.index,
      nofollow: !seoData.robots.follow,
      noarchive: seoData.robots.noarchive,
      nosnippet: seoData.robots.nosnippet,
      noimageindex: seoData.robots.noimageindex,
      maxSnippet: seoData.robots.maxSnippet,
      maxImagePreview: seoData.robots.maxImagePreview,
      maxVideoPreview: seoData.robots.maxVideoPreview,
    } : undefined,
    additionalMetaTags,
    additionalLinkTags,
  }

  return (
    <>
      <NextSeo {...seoConfig} />
      {seoData.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoData.jsonLd)
          }}
        />
      )}
    </>
  )
}