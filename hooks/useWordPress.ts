import useSWR from 'swr'
import { wpApi } from '@/lib/api/wordpress'
import type { WPPost, WPPage, WPCategory, WPTag } from '@/lib/types/wordpress'

const fetcher = async (key: string) => {
  const [resource, ...params] = key.split(':')

  switch (resource) {
    case 'posts':
      if (params[0] === 'all') {
        return wpApi.posts.getAll()
      } else if (params[0] === 'slug') {
        return wpApi.posts.getBySlug(params[1])
      } else {
        return wpApi.posts.getById(Number(params[0]))
      }

    case 'pages':
      if (params[0] === 'all') {
        return wpApi.pages.getAll()
      } else if (params[0] === 'slug') {
        return wpApi.pages.getBySlug(params[1])
      } else {
        return wpApi.pages.getById(Number(params[0]))
      }

    case 'categories':
      if (params[0] === 'all') {
        return wpApi.categories.getAll()
      } else if (params[0] === 'slug') {
        return wpApi.categories.getBySlug(params[1])
      } else {
        return wpApi.categories.getById(Number(params[0]))
      }

    case 'tags':
      if (params[0] === 'all') {
        return wpApi.tags.getAll()
      } else if (params[0] === 'slug') {
        return wpApi.tags.getBySlug(params[1])
      } else {
        return wpApi.tags.getById(Number(params[0]))
      }

    default:
      throw new Error(`Unknown resource: ${resource}`)
  }
}

export function usePosts(options?: { per_page?: number; categories?: number[] }) {
  const key = options ? `posts:all:${JSON.stringify(options)}` : 'posts:all'
  return useSWR<WPPost[]>(key, () => wpApi.posts.getAll(options))
}

export function usePost(slugOrId: string | number) {
  const key = typeof slugOrId === 'string' ? `posts:slug:${slugOrId}` : `posts:${slugOrId}`
  return useSWR<WPPost | null>(key, () => fetcher(key) as Promise<WPPost | null>)
}

export function usePages(options?: { per_page?: number; parent?: number }) {
  const key = options ? `pages:all:${JSON.stringify(options)}` : 'pages:all'
  return useSWR<WPPage[]>(key, () => wpApi.pages.getAll(options))
}

export function usePage(slugOrId: string | number) {
  const key = typeof slugOrId === 'string' ? `pages:slug:${slugOrId}` : `pages:${slugOrId}`
  return useSWR<WPPage | null>(key, () => fetcher(key) as Promise<WPPage | null>)
}

export function useCategories() {
  return useSWR<WPCategory[]>('categories:all', () => fetcher('categories:all') as Promise<WPCategory[]>)
}

export function useCategory(slugOrId: string | number) {
  const key = typeof slugOrId === 'string' ? `categories:slug:${slugOrId}` : `categories:${slugOrId}`
  return useSWR<WPCategory | null>(key, () => fetcher(key) as Promise<WPCategory | null>)
}

export function useTags() {
  return useSWR<WPTag[]>('tags:all', () => fetcher('tags:all') as Promise<WPTag[]>)
}

export function useTag(slugOrId: string | number) {
  const key = typeof slugOrId === 'string' ? `tags:slug:${slugOrId}` : `tags:${slugOrId}`
  return useSWR<WPTag | null>(key, () => fetcher(key) as Promise<WPTag | null>)
}