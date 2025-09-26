export const wpConfig = {
  apiUrl: process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://docker-image-production-8469.up.railway.app',
  apiBase: '/wp-json/wp/v2',
  rankMathBase: '/wp-json/rankmath/v1',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}

export const getApiUrl = (endpoint: string): string => {
  return `${wpConfig.apiUrl}${wpConfig.apiBase}${endpoint}`
}

export const getRankMathApiUrl = (endpoint: string): string => {
  return `${wpConfig.apiUrl}${wpConfig.rankMathBase}${endpoint}`
}