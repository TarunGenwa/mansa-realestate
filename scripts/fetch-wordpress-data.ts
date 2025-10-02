import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'

interface WordPressData {
  posts: any[]
  pages: any[]
  categories: any[]
  properties: any[]
  developers: any[]
  guides: any[]
  fetchedAt: string
}

async function fetchAllWordPressData() {
  // Load environment variables from .env.local
  const envPath = join(process.cwd(), '.env.local')
  try {
    const envContent = readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim()
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
    console.log('✅ Loaded environment variables')
  } catch (error) {
    console.warn('⚠️  Could not load .env.local file:', error)
  }

  // Ensure we have the WordPress API URL
  if (!process.env.WORDPRESS_API_URL && !process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
    console.error('❌ WORDPRESS_API_URL or NEXT_PUBLIC_WORDPRESS_API_URL environment variable is not set!')
    process.exit(1)
  }

  // Dynamically import wpApi after env vars are set
  const { wpApi } = await import('../lib/api/wordpress')

  console.log('🔄 Fetching WordPress data...')

  try {
    // Fetch all categories first
    console.log('📂 Fetching categories...')
    const categories = await wpApi.categories.getAll({ per_page: 100 })

    // Find specific category IDs
    const propertiesCategory = categories.find(cat => cat.slug === 'properties')
    const developersCategory = categories.find(cat => cat.slug === 'developers')
    const guidesCategory = categories.find(cat => cat.slug === 'guides')

    // Fetch all posts
    console.log('📄 Fetching all posts...')
    const posts = await wpApi.posts.getAll({
      per_page: 100,
      _embed: true
    })

    // Fetch all pages
    console.log('📄 Fetching all pages...')
    const pages = await wpApi.pages.getAll({
      per_page: 100
    })

    // Fetch properties (posts with properties category)
    console.log('🏠 Fetching properties...')
    const properties = propertiesCategory
      ? await wpApi.posts.getAll({
          per_page: 100,
          categories: [propertiesCategory.id],
          _embed: true
        })
      : []

    // Fetch developers (posts with developers category)
    console.log('👷 Fetching developers...')
    const developers = developersCategory
      ? await wpApi.posts.getAll({
          per_page: 100,
          categories: [developersCategory.id],
          _embed: true
        })
      : []

    // Fetch guides (posts with guides category)
    console.log('📚 Fetching guides...')
    const guides = guidesCategory
      ? await wpApi.posts.getAll({
          per_page: 100,
          categories: [guidesCategory.id],
          _embed: true
        })
      : []

    const data: WordPressData = {
      posts,
      pages,
      categories,
      properties,
      developers,
      guides,
      fetchedAt: new Date().toISOString()
    }

    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'src', 'data')
    mkdirSync(dataDir, { recursive: true })

    // Write to JSON file
    const outputPath = join(dataDir, 'wordpress-data.json')
    writeFileSync(outputPath, JSON.stringify(data, null, 2))

    console.log('✅ WordPress data fetched successfully!')
    console.log(`   - ${posts.length} posts`)
    console.log(`   - ${pages.length} pages`)
    console.log(`   - ${categories.length} categories`)
    console.log(`   - ${properties.length} properties`)
    console.log(`   - ${developers.length} developers`)
    console.log(`   - ${guides.length} guides`)
    console.log(`📁 Saved to: ${outputPath}`)

    return data
  } catch (error) {
    console.error('❌ Error fetching WordPress data:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  fetchAllWordPressData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { fetchAllWordPressData }
