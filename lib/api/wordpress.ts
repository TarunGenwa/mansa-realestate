import { getApiUrl, getRankMathApiUrl } from '@/lib/wordpress/config'
import type {
  WPPost,
  WPPage,
  WPMedia,
  WPCategory,
  WPTag,
  WPUser,
  RankMathSEO,
  WPDeveloper,
  WPProperty
} from '@/lib/types/wordpress'

// Helper function to build URL with query params
function buildUrl(baseUrl: string, params?: Record<string, any>): string {
  if (!params) return baseUrl

  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, String(v)))
      } else {
        url.searchParams.append(key, String(value))
      }
    }
  })
  return url.toString()
}

// Helper function for fetch with 1 hour revalidation
async function fetchWithRevalidation<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // 1 hour in seconds
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const wpApi = {
  posts: {
    async getAll(params?: {
      page?: number
      per_page?: number
      search?: string
      categories?: number[]
      tags?: number[]
      orderby?: string
      order?: 'asc' | 'desc'
      _embed?: boolean
    }): Promise<WPPost[]> {
      const url = buildUrl(getApiUrl('/posts'), params)
      return fetchWithRevalidation<WPPost[]>(url)
    },

    async getBySlug(slug: string): Promise<WPPost | null> {
      const url = buildUrl(getApiUrl('/posts'), { slug, _embed: true })
      const data = await fetchWithRevalidation<WPPost[]>(url)
      return data[0] || null
    },

    async getById(id: number): Promise<WPPost> {
      const url = buildUrl(getApiUrl(`/posts/${id}`), { _embed: true })
      return fetchWithRevalidation<WPPost>(url)
    },
  },

  pages: {
    async getAll(params?: {
      page?: number
      per_page?: number
      search?: string
      parent?: number
      orderby?: string
      order?: 'asc' | 'desc'
    }): Promise<WPPage[]> {
      const url = buildUrl(getApiUrl('/pages'), params)
      return fetchWithRevalidation<WPPage[]>(url)
    },

    async getBySlug(slug: string): Promise<WPPage | null> {
      const url = buildUrl(getApiUrl('/pages'), { slug, _embed: true })
      const data = await fetchWithRevalidation<WPPage[]>(url)
      return data[0] || null
    },

    async getById(id: number): Promise<WPPage> {
      const url = buildUrl(getApiUrl(`/pages/${id}`), { _embed: true })
      return fetchWithRevalidation<WPPage>(url)
    },
  },

  categories: {
    async getAll(params?: {
      page?: number
      per_page?: number
      search?: string
      parent?: number
      orderby?: string
      order?: 'asc' | 'desc'
    }): Promise<WPCategory[]> {
      const url = buildUrl(getApiUrl('/categories'), params)
      return fetchWithRevalidation<WPCategory[]>(url)
    },

    async getById(id: number): Promise<WPCategory> {
      const url = getApiUrl(`/categories/${id}`)
      return fetchWithRevalidation<WPCategory>(url)
    },

    async getBySlug(slug: string): Promise<WPCategory | null> {
      const url = buildUrl(getApiUrl('/categories'), { slug })
      const data = await fetchWithRevalidation<WPCategory[]>(url)
      return data[0] || null
    },
  },

  tags: {
    async getAll(params?: {
      page?: number
      per_page?: number
      search?: string
      orderby?: string
      order?: 'asc' | 'desc'
    }): Promise<WPTag[]> {
      const url = buildUrl(getApiUrl('/tags'), params)
      return fetchWithRevalidation<WPTag[]>(url)
    },

    async getById(id: number): Promise<WPTag> {
      const url = getApiUrl(`/tags/${id}`)
      return fetchWithRevalidation<WPTag>(url)
    },

    async getBySlug(slug: string): Promise<WPTag | null> {
      const url = buildUrl(getApiUrl('/tags'), { slug })
      const data = await fetchWithRevalidation<WPTag[]>(url)
      return data[0] || null
    },
  },

  users: {
    async getAll(params?: {
      page?: number
      per_page?: number
      search?: string
      orderby?: string
      order?: 'asc' | 'desc'
    }): Promise<WPUser[]> {
      const url = buildUrl(getApiUrl('/users'), params)
      return fetchWithRevalidation<WPUser[]>(url)
    },

    async getById(id: number): Promise<WPUser> {
      const url = getApiUrl(`/users/${id}`)
      return fetchWithRevalidation<WPUser>(url)
    },

    async getBySlug(slug: string): Promise<WPUser | null> {
      const url = buildUrl(getApiUrl('/users'), { slug })
      const data = await fetchWithRevalidation<WPUser[]>(url)
      return data[0] || null
    },
  },

  rankmath: {
    async getSEOByUrl(url: string): Promise<RankMathSEO | null> {
      try {
        const fetchUrl = buildUrl(getRankMathApiUrl('/getHead'), { url })
        const data = await fetchWithRevalidation<{ head: RankMathSEO }>(fetchUrl)
        return data.head || null
      } catch (error) {
        console.error('Error fetching RankMath SEO data:', error)
        return null
      }
    },

    async getSEOByPostId(postId: number, postType: 'post' | 'page' = 'post'): Promise<RankMathSEO | null> {
      try {
        const fetchUrl = getRankMathApiUrl(`/${postType}/${postId}/meta`)
        const data = await fetchWithRevalidation<RankMathSEO>(fetchUrl)
        return data || null
      } catch (error) {
        console.error('Error fetching RankMath SEO data:', error)
        return null
      }
    },
  },

  developers: {
    async getAll(params?: {
      page?: number
      per_page?: number
      search?: string
      orderby?: string
      order?: 'asc' | 'desc'
      _embed?: boolean
    }): Promise<WPDeveloper[]> {
      try {
        const url = buildUrl(getApiUrl('/developers'), params)
        return fetchWithRevalidation<WPDeveloper[]>(url)
      } catch (error) {
        console.error('Error fetching developers:', error)
        return []
      }
    },

    async getBySlug(slug: string): Promise<WPDeveloper | null> {
      try {
        const url = buildUrl(getApiUrl('/developers'), { slug, _embed: true })
        const data = await fetchWithRevalidation<WPDeveloper[]>(url)
        return data[0] || null
      } catch (error) {
        console.error('Error fetching developer:', error)
        return null
      }
    },

    async getById(id: number): Promise<WPDeveloper | null> {
      try {
        const url = buildUrl(getApiUrl(`/developers/${id}`), { _embed: true })
        return fetchWithRevalidation<WPDeveloper>(url)
      } catch (error) {
        console.error('Error fetching developer:', error)
        return null
      }
    },
  },

  properties: {
    async getAll(params?: {
      page?: number
      per_page?: number
      search?: string
      developer?: number
      property_type?: number[]
      location?: number[]
      orderby?: string
      order?: 'asc' | 'desc'
      _embed?: boolean
    }): Promise<WPProperty[]> {
      try {
        const url = buildUrl(getApiUrl('/properties'), params)
        return fetchWithRevalidation<WPProperty[]>(url)
      } catch (error) {
        console.error('Error fetching properties:', error)
        return []
      }
    },

    async getByDeveloper(developerId: number, params?: {
      page?: number
      per_page?: number
      _embed?: boolean
    }): Promise<WPProperty[]> {
      try {
        const url = buildUrl(getApiUrl('/properties'), {
          developer: developerId,
          _embed: true,
          ...params
        })
        return fetchWithRevalidation<WPProperty[]>(url)
      } catch (error) {
        console.error('Error fetching properties by developer:', error)
        return []
      }
    },

    async getBySlug(slug: string): Promise<WPProperty | null> {
      try {
        const url = buildUrl(getApiUrl('/properties'), { slug, _embed: true })
        const data = await fetchWithRevalidation<WPProperty[]>(url)
        return data[0] || null
      } catch (error) {
        console.error('Error fetching property:', error)
        return null
      }
    },

    async getById(id: number): Promise<WPProperty | null> {
      try {
        const url = buildUrl(getApiUrl(`/properties/${id}`), { _embed: true })
        return fetchWithRevalidation<WPProperty>(url)
      } catch (error) {
        console.error('Error fetching property:', error)
        return null
      }
    },
  },
}