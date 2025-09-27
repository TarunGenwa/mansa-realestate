import axios from 'axios'
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

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

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
      const { data } = await api.get<WPPost[]>(getApiUrl('/posts'), { params })
      return data
    },

    async getBySlug(slug: string): Promise<WPPost | null> {
      const { data } = await api.get<WPPost[]>(getApiUrl('/posts'), {
        params: { slug, _embed: true }
      })
      return data[0] || null
    },

    async getById(id: number): Promise<WPPost> {
      const { data } = await api.get<WPPost>(getApiUrl(`/posts/${id}`), {
        params: { _embed: true }
      })
      return data
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
      const { data } = await api.get<WPPage[]>(getApiUrl('/pages'), { params })
      return data
    },

    async getBySlug(slug: string): Promise<WPPage | null> {
      const { data } = await api.get<WPPage[]>(getApiUrl('/pages'), {
        params: { slug, _embed: true }
      })
      return data[0] || null
    },

    async getById(id: number): Promise<WPPage> {
      const { data } = await api.get<WPPage>(getApiUrl(`/pages/${id}`), {
        params: { _embed: true }
      })
      return data
    },
  },

  media: {
    async getById(id: number): Promise<WPMedia> {
      const { data } = await api.get<WPMedia>(getApiUrl(`/media/${id}`))
      return data
    },

    async getBySlug(slug: string): Promise<WPMedia | null> {
      const { data } = await api.get<WPMedia[]>(getApiUrl('/media'), {
        params: { slug }
      })
      return data[0] || null
    },

    async getAll(params?: {
      page?: number
      per_page?: number
      media_type?: 'image' | 'video' | 'audio' | 'application'
    }): Promise<WPMedia[]> {
      const { data } = await api.get<WPMedia[]>(getApiUrl('/media'), { params })
      return data
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
      const { data } = await api.get<WPCategory[]>(getApiUrl('/categories'), { params })
      return data
    },

    async getById(id: number): Promise<WPCategory> {
      const { data } = await api.get<WPCategory>(getApiUrl(`/categories/${id}`))
      return data
    },

    async getBySlug(slug: string): Promise<WPCategory | null> {
      const { data } = await api.get<WPCategory[]>(getApiUrl('/categories'), {
        params: { slug }
      })
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
      const { data } = await api.get<WPTag[]>(getApiUrl('/tags'), { params })
      return data
    },

    async getById(id: number): Promise<WPTag> {
      const { data } = await api.get<WPTag>(getApiUrl(`/tags/${id}`))
      return data
    },

    async getBySlug(slug: string): Promise<WPTag | null> {
      const { data } = await api.get<WPTag[]>(getApiUrl('/tags'), {
        params: { slug }
      })
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
      const { data } = await api.get<WPUser[]>(getApiUrl('/users'), { params })
      return data
    },

    async getById(id: number): Promise<WPUser> {
      const { data } = await api.get<WPUser>(getApiUrl(`/users/${id}`))
      return data
    },

    async getBySlug(slug: string): Promise<WPUser | null> {
      const { data } = await api.get<WPUser[]>(getApiUrl('/users'), {
        params: { slug }
      })
      return data[0] || null
    },
  },

  rankmath: {
    async getSEOByUrl(url: string): Promise<RankMathSEO | null> {
      try {
        const { data } = await api.get(getRankMathApiUrl('/getHead'), {
          params: { url }
        })
        return data.head || null
      } catch (error) {
        console.error('Error fetching RankMath SEO data:', error)
        return null
      }
    },

    async getSEOByPostId(postId: number, postType: 'post' | 'page' = 'post'): Promise<RankMathSEO | null> {
      try {
        const { data } = await api.get(getRankMathApiUrl(`/${postType}/${postId}/meta`))
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
        const { data } = await api.get<WPDeveloper[]>(getApiUrl('/developers'), { params })
        return data
      } catch (error) {
        console.error('Error fetching developers:', error)
        return []
      }
    },

    async getBySlug(slug: string): Promise<WPDeveloper | null> {
      try {
        const { data } = await api.get<WPDeveloper[]>(getApiUrl('/developers'), {
          params: { slug, _embed: true }
        })
        return data[0] || null
      } catch (error) {
        console.error('Error fetching developer:', error)
        return null
      }
    },

    async getById(id: number): Promise<WPDeveloper | null> {
      try {
        const { data } = await api.get<WPDeveloper>(getApiUrl(`/developers/${id}`), {
          params: { _embed: true }
        })
        return data
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
        const { data } = await api.get<WPProperty[]>(getApiUrl('/properties'), { params })
        return data
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
        const { data } = await api.get<WPProperty[]>(getApiUrl('/properties'), {
          params: {
            developer: developerId,
            _embed: true,
            ...params
          }
        })
        return data
      } catch (error) {
        console.error('Error fetching properties by developer:', error)
        return []
      }
    },

    async getBySlug(slug: string): Promise<WPProperty | null> {
      try {
        const { data } = await api.get<WPProperty[]>(getApiUrl('/properties'), {
          params: { slug, _embed: true }
        })
        return data[0] || null
      } catch (error) {
        console.error('Error fetching property:', error)
        return null
      }
    },

    async getById(id: number): Promise<WPProperty | null> {
      try {
        const { data } = await api.get<WPProperty>(getApiUrl(`/properties/${id}`), {
          params: { _embed: true }
        })
        return data
      } catch (error) {
        console.error('Error fetching property:', error)
        return null
      }
    },
  },
}