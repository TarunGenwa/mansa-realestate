export interface WPPost {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: any[]
  categories: number[]
  tags: number[]
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text?: string
      caption?: {
        rendered: string
      }
      media_details?: {
        width: number
        height: number
      }
    }>
    author?: Array<{
      id: number
      name: string
      url: string
      description: string
      link: string
      slug: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      link: string
      name: string
      slug: string
      taxonomy: string
    }>>
  }
}

export interface WPPage {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  parent: number
  menu_order: number
  comment_status: string
  ping_status: string
  template: string
  meta: any[]
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text?: string
      caption?: {
        rendered: string
      }
      media_details?: {
        width: number
        height: number
      }
    }>
    author?: Array<{
      id: number
      name: string
      url: string
      description: string
      link: string
      slug: string
    }>
  }
}

export interface WPMedia {
  id: number
  date: string
  slug: string
  type: string
  link: string
  title: {
    rendered: string
  }
  author: number
  caption: {
    rendered: string
  }
  alt_text: string
  media_type: string
  mime_type: string
  media_details: {
    width: number
    height: number
    file: string
    sizes: {
      [key: string]: {
        file: string
        width: number
        height: number
        mime_type: string
        source_url: string
      }
    }
  }
  source_url: string
}

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
  meta: any[]
}

export interface WPTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  meta: any[]
}

export interface WPUser {
  id: number
  name: string
  url: string
  description: string
  link: string
  slug: string
  avatar_urls: {
    [key: string]: string
  }
  meta: any[]
}

export interface YoastHeadJson {
  title: string
  description: string
  robots: {
    index: string
    follow: string
    'max-snippet': string
    'max-image-preview': string
    'max-video-preview': string
  }
  canonical: string
  og_locale: string
  og_type: string
  og_title: string
  og_description: string
  og_url: string
  og_site_name: string
  article_publisher?: string
  article_published_time?: string
  article_modified_time?: string
  og_image?: Array<{
    width: number
    height: number
    url: string
    type: string
  }>
  author?: string
  twitter_card: string
  twitter_creator?: string
  twitter_site?: string
  twitter_misc?: {
    [key: string]: string
  }
  schema: any
}

export interface RankMathSEO {
  title: string
  description: string
  robots: string[]
  canonical: string
  og_title: string
  og_description: string
  og_image: string
  og_url: string
  og_site_name: string
  og_locale: string
  og_type: string
  article_publisher: string
  article_author: string
  article_published_time: string
  article_modified_time: string
  twitter_card: string
  twitter_title: string
  twitter_description: string
  twitter_image: string
  twitter_creator: string
  twitter_site: string
  schema: any
  breadcrumbs?: Array<{
    text: string
    url: string
  }>
  primary_category?: string
  focus_keyword?: string
}