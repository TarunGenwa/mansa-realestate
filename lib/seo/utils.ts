import { RankMathSEO, YoastHeadJson } from '@/lib/types/wordpress'
import { wpConfig } from '@/lib/wordpress/config'

export interface SEOData {
  title: string
  description: string
  canonical: string
  openGraph: {
    title: string
    description: string
    url: string
    siteName: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
    type?: string
    locale?: string
    article?: {
      publishedTime?: string
      modifiedTime?: string
      author?: string
    }
  }
  twitter: {
    cardType?: string
    title?: string
    description?: string
    image?: string
    creator?: string
    site?: string
  }
  robots?: {
    index?: boolean
    follow?: boolean
    noarchive?: boolean
    nosnippet?: boolean
    noimageindex?: boolean
    maxSnippet?: number
    maxImagePreview?: 'none' | 'standard' | 'large'
    maxVideoPreview?: number
  }
  alternates?: {
    canonical?: string
    languages?: { [key: string]: string }
  }
  jsonLd?: any
}

export function parseRankMathSEO(seo: RankMathSEO | null, fallback?: Partial<SEOData>): SEOData {
  if (!seo) {
    return {
      title: fallback?.title || 'Mansa',
      description: fallback?.description || '',
      canonical: fallback?.canonical || wpConfig.siteUrl,
      openGraph: {
        title: fallback?.openGraph?.title || fallback?.title || 'Mansa',
        description: fallback?.openGraph?.description || fallback?.description || '',
        url: fallback?.openGraph?.url || fallback?.canonical || wpConfig.siteUrl,
        siteName: fallback?.openGraph?.siteName || 'Mansa',
        type: fallback?.openGraph?.type || 'website',
        locale: fallback?.openGraph?.locale || 'en_US',
      },
      twitter: fallback?.twitter || {},
      robots: fallback?.robots || {},
    }
  }

  const robots: SEOData['robots'] = {}
  if (seo.robots && Array.isArray(seo.robots)) {
    robots.index = !seo.robots.includes('noindex')
    robots.follow = !seo.robots.includes('nofollow')
    robots.noarchive = seo.robots.includes('noarchive')
    robots.nosnippet = seo.robots.includes('nosnippet')
    robots.noimageindex = seo.robots.includes('noimageindex')
  }

  const openGraphImages = seo.og_image ? [{
    url: seo.og_image,
    alt: seo.og_title || seo.title
  }] : undefined

  return {
    title: seo.title || fallback?.title || 'Mansa',
    description: seo.description || fallback?.description || '',
    canonical: seo.canonical || fallback?.canonical || wpConfig.siteUrl,
    openGraph: {
      title: seo.og_title || seo.title || fallback?.openGraph?.title || 'Mansa',
      description: seo.og_description || seo.description || fallback?.openGraph?.description || '',
      url: seo.og_url || seo.canonical || fallback?.openGraph?.url || wpConfig.siteUrl,
      siteName: seo.og_site_name || fallback?.openGraph?.siteName || 'Mansa',
      images: openGraphImages || fallback?.openGraph?.images,
      type: seo.og_type || fallback?.openGraph?.type || 'website',
      locale: seo.og_locale || fallback?.openGraph?.locale || 'en_US',
      article: {
        publishedTime: seo.article_published_time,
        modifiedTime: seo.article_modified_time,
        author: seo.article_author,
      },
    },
    twitter: {
      cardType: seo.twitter_card || fallback?.twitter?.cardType || 'summary_large_image',
      title: seo.twitter_title || seo.og_title || seo.title,
      description: seo.twitter_description || seo.og_description || seo.description,
      image: seo.twitter_image || seo.og_image,
      creator: seo.twitter_creator || fallback?.twitter?.creator,
      site: seo.twitter_site || fallback?.twitter?.site,
    },
    robots,
    jsonLd: seo.schema || fallback?.jsonLd,
  }
}

export function parseYoastSEO(yoast: YoastHeadJson | null, fallback?: Partial<SEOData>): SEOData {
  if (!yoast) {
    return {
      title: fallback?.title || 'Mansa',
      description: fallback?.description || '',
      canonical: fallback?.canonical || wpConfig.siteUrl,
      openGraph: {
        title: fallback?.openGraph?.title || fallback?.title || 'Mansa',
        description: fallback?.openGraph?.description || fallback?.description || '',
        url: fallback?.openGraph?.url || fallback?.canonical || wpConfig.siteUrl,
        siteName: fallback?.openGraph?.siteName || 'Mansa',
        type: fallback?.openGraph?.type || 'website',
        locale: fallback?.openGraph?.locale || 'en_US',
      },
      twitter: fallback?.twitter || {},
      robots: fallback?.robots || {},
    }
  }

  const robots: SEOData['robots'] = {}
  if (yoast.robots) {
    robots.index = yoast.robots.index === 'index'
    robots.follow = yoast.robots.follow === 'follow'
    robots.maxSnippet = parseInt(yoast.robots['max-snippet']?.replace('max-snippet:', '') || '-1')
    robots.maxImagePreview = yoast.robots['max-image-preview']?.replace('max-image-preview:', '') as any
    robots.maxVideoPreview = parseInt(yoast.robots['max-video-preview']?.replace('max-video-preview:', '') || '-1')
  }

  const openGraphImages = yoast.og_image?.map((img: any) => ({
    url: img.url,
    width: img.width,
    height: img.height,
    alt: yoast.og_title || yoast.title
  }))

  return {
    title: yoast.title || fallback?.title || 'Mansa',
    description: yoast.description || fallback?.description || '',
    canonical: yoast.canonical || fallback?.canonical || wpConfig.siteUrl,
    openGraph: {
      title: yoast.og_title || yoast.title || fallback?.openGraph?.title || 'Mansa',
      description: yoast.og_description || yoast.description || fallback?.openGraph?.description || '',
      url: yoast.og_url || yoast.canonical || fallback?.openGraph?.url || wpConfig.siteUrl,
      siteName: yoast.og_site_name || fallback?.openGraph?.siteName || 'Mansa',
      images: openGraphImages || fallback?.openGraph?.images,
      type: yoast.og_type || fallback?.openGraph?.type || 'website',
      locale: yoast.og_locale || fallback?.openGraph?.locale || 'en_US',
      article: {
        publishedTime: yoast.article_published_time,
        modifiedTime: yoast.article_modified_time,
        author: yoast.author,
      },
    },
    twitter: {
      cardType: yoast.twitter_card || fallback?.twitter?.cardType || 'summary_large_image',
      title: yoast.og_title || yoast.title,
      description: yoast.og_description || yoast.description,
      creator: yoast.twitter_creator || fallback?.twitter?.creator,
      site: yoast.twitter_site || fallback?.twitter?.site,
    },
    robots,
    jsonLd: yoast.schema || fallback?.jsonLd,
  }
}