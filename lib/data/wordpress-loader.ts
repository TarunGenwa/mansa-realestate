import wordpressData from '@/src/data/wordpress-data.json'
import type { WPPost, WPPage, WPCategory } from '@/lib/types/wordpress'

interface WordPressData {
  posts: any[]
  pages: any[]
  categories: any[]
  properties: any[]
  developers: any[]
  guides: any[]
  fetchedAt: string
}

const data = wordpressData as WordPressData

export const wpData = {
  posts: {
    getAll(): WPPost[] {
      return data.posts
    },

    getBySlug(slug: string): WPPost | null {
      return data.posts.find(post => post.slug === slug) || null
    },

    getById(id: number): WPPost | null {
      return data.posts.find(post => post.id === id) || null
    },

    getByCategory(categoryId: number): WPPost[] {
      return data.posts.filter(post =>
        post.categories?.includes(categoryId)
      )
    }
  },

  pages: {
    getAll(): WPPage[] {
      return data.pages
    },

    getBySlug(slug: string): WPPage | null {
      return data.pages.find(page => page.slug === slug) || null
    },

    getById(id: number): WPPage | null {
      return data.pages.find(page => page.id === id) || null
    }
  },

  categories: {
    getAll(): WPCategory[] {
      return data.categories
    },

    getById(id: number): WPCategory | null {
      return data.categories.find(cat => cat.id === id) || null
    },

    getBySlug(slug: string): WPCategory | null {
      return data.categories.find(cat => cat.slug === slug) || null
    }
  },

  properties: {
    getAll(): WPPost[] {
      return data.properties
    },

    getBySlug(slug: string): WPPost | null {
      return data.properties.find(prop => prop.slug === slug) || null
    },

    getById(id: number): WPPost | null {
      return data.properties.find(prop => prop.id === id) || null
    }
  },

  developers: {
    getAll(): WPPost[] {
      return data.developers
    },

    getBySlug(slug: string): WPPost | null {
      return data.developers.find(dev => dev.slug === slug) || null
    },

    getById(id: number): WPPost | null {
      return data.developers.find(dev => dev.id === id) || null
    }
  },

  guides: {
    getAll(): WPPost[] {
      return data.guides
    },

    getBySlug(slug: string): WPPost | null {
      return data.guides.find(guide => guide.slug === slug) || null
    },

    getById(id: number): WPPost | null {
      return data.guides.find(guide => guide.id === id) || null
    }
  },

  // Helper to get fetch timestamp
  getFetchedAt(): string {
    return data.fetchedAt
  }
}
