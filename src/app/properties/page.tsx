'use client'

import { wpApi } from '@/lib/api/wordpress'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import ContactFormSection from '@/src/components/ContactFormSection'
import { useMedia } from '@/src/providers/MediaProvider'

export default function PropertiesPage() {
  const { getImageByTitle } = useMedia()

  const [properties, setProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [consultationImage, setConsultationImage] = useState<string | null>(null)

  // Get images from MediaContext
  const fallbackImage = getImageByTitle('project_tile')
  const heroBannerImage = getImageByTitle('allproperties_banner')
  const contactImage = getImageByTitle('contactus_section')

  useEffect(() => {
    async function fetchData() {
      try {
        // Make all API calls in parallel for better performance
        const [
          propertiesCategory,
          consultationMedia
        ] = await Promise.allSettled([
          wpApi.categories.getBySlug('properties'),
          wpApi.media.getBySlug('schedule-consultation')
        ])

        // Get properties only if category exists
        let fetchedProperties: any[] = []
        if (propertiesCategory.status === 'fulfilled' && propertiesCategory.value) {
          fetchedProperties = await wpApi.posts.getAll({
            per_page: 50,
            categories: [propertiesCategory.value.id],
            _embed: true
          }).catch(() => [])
        }

        // Set consultation image if successful
        if (consultationMedia.status === 'fulfilled' && consultationMedia.value) {
          setConsultationImage(consultationMedia.value.source_url)
        }

        setProperties(fetchedProperties)
        setFilteredProperties(fetchedProperties)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Filter properties based on search term only
    let filtered = properties

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(property =>
        property.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.excerpt.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property as any).acf?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProperties(filtered)
  }, [searchTerm, properties])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative mt-24 h-screen bg-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center w-[90%] mx-auto">
              <div className="h-16 bg-gray-300 rounded mb-8 w-96 mx-auto"></div>
              <div className="h-16 bg-gray-300 rounded w-full max-w-4xl mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Properties Grid Skeleton */}
        <section className="py-20">
          <div className="w-[90%] mx-auto">
            <div className="h-12 bg-gray-200 rounded mb-12 w-64 mx-auto animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="h-80 bg-gray-200"></div>
                  <div className="p-8">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner */}
      <section className="relative mt-24" style={{ height: 'calc(100vh - 96px)' }}>
        {heroBannerImage ? (
          <Image
            src={heroBannerImage.source_url}
            alt={heroBannerImage.alt_text || "Properties Banner"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-600" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white w-[90%] mx-auto">
            <h1
              className="text-4xl lg:text-7xl mb-32"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                lineHeight: '1.1',
              }}
            >
              Find Properties
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-[60%] mx-auto">
              <div className="relative flex bg-white rounded-full shadow-lg overflow-hidden">
                {/* Search Input */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by property name, location, or description..."
                  className="flex-1 px-6 py-5 pr-16 text-black bg-white text-lg focus:outline-none transition-all"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif'
                  }}
                />

                {/* Search Arrow Button */}
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                  aria-label="Search"
                >
                  <Image
                    src="/right-arrow-black.svg"
                    alt="Search"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20">
        <div className="w-[90%] mx-auto">
          {/* Dynamic Heading */}
          <div className="mb-12 text-center">
            <h2
              className="text-4xl md:text-5xl"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 800
              }}
            >
              All Projects
            </h2>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((property) => {
                const featuredImage = property._embedded?.['wp:featuredmedia']?.[0]
                const imageUrl = featuredImage?.source_url || fallbackImage?.source_url || '/placeholder.jpg'
                const imageAlt = featuredImage?.alt_text || property.title.rendered
                const cleanExcerpt = property.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.slug}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {/* Property Image */}
                    <div className="relative h-80 bg-gray-200">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    {/* Property Info */}
                    <div className="p-8">
                      <h2
                        className="text-2xl font-semibold mb-4 group-hover:text-gray-700 transition-colors"
                        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                      >
                        {property.title.rendered}
                      </h2>

                      <p
                        className="text-gray-600 mb-4 text-base"
                        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                      >
                        {cleanExcerpt}
                      </p>

                      {/* Property metadata */}
                      {property.acf && (
                        <div className="space-y-2">
                          {property.acf.location && (
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">Location:</span> {property.acf.location}
                            </p>
                          )}
                          {(property.acf.price || property.acf.price_from) && (
                            <p className="text-base font-semibold text-gray-800">
                              {property.acf.price || `From ${property.acf.price_from}`}
                            </p>
                          )}
                          {property.acf.status && (
                            <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                              property.acf.status === 'available' ? 'bg-green-100 text-green-800' :
                              property.acf.status === 'sold' ? 'bg-red-100 text-red-800' :
                              property.acf.status === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {property.acf.status.replace('-', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}

                      {/* View Details Link */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <span className="text-black font-semibold group-hover:underline text-base">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No properties found. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactFormSection reverseOrder={true} contactImageUrl={contactImage?.source_url || undefined} />

      {/* Schedule a Consultation Section */}
      {consultationImage && (
        <section className="mt-20 relative w-full h-[700px] overflow-hidden">
          <Image
            src={consultationImage}
            alt="Schedule a consultation"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20">
            <div className="relative h-full flex items-center">
              <div className="w-[90%] mx-auto">
                <div className="bg-white rounded-lg p-8 max-w-md shadow-xl">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                    Schedule a free consultation
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                    We craft inspiring spaces that blend cutting-edge design with enduring functionality, turning your vision into reality.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-black text-black font-medium rounded-full hover:bg-black hover:text-white transition-all duration-300"
                    style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                  >
                    Get Started
                    <Image
                      src="/top-right-arrow.svg"
                      alt="Arrow"
                      width={40}
                      height={40}
                      className="ml-4"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}