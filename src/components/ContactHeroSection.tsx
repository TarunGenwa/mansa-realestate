'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ContactHeroSectionProps {
  heroImage?: {
    source_url: string
    alt_text?: string
  } | null
}

export default function ContactHeroSection({ heroImage }: ContactHeroSectionProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    projectInfo: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('https://formcarry.com/s/PhkoOyLIwjN', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          company: formData.companyName,
          message: formData.projectInfo
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for connecting with us! We will get back to you soon.'
        })
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          companyName: '',
          projectInfo: ''
        })
      } else {
        throw new Error(data.message || 'An error occurred')
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative h-[780px] w-full overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage?.source_url || "https://ik.imagekit.io/slamseven/3699346bfbeb7e914d97ca326277009b9841dce3_D4dt-DTI0.jpg?updatedAt=1758914537538"}
          alt={heroImage?.alt_text || "Contact Us"}
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contact Form on Left Side */}
      <div className="relative z-10 h-full flex items-center pt-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm p-10 rounded-lg shadow-2xl">
          <h1
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '40px',
              lineHeight: '120%'
            }}
            className="mb-2"
          >
            Connect With Us
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '150%'
            }}
            className="text-gray-600 mb-8"
          >
            Share your vision with us
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Status Messages */}
            {submitStatus.type && (
              <div
                className={`p-4 rounded-lg relative ${
                  submitStatus.type === 'success'
                    ? 'bg-black text-white border border-black'
                    : 'bg-white text-black border-2 border-black'
                }`}
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              >
                {submitStatus.message}
                <button
                  type="button"
                  onClick={() => setSubmitStatus({ type: null, message: '' })}
                  className={`absolute top-3 right-3 transition-opacity hover:opacity-70 ${
                    submitStatus.type === 'success' ? 'text-white' : 'text-black'
                  }`}
                  aria-label="Close message"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Full Name */}
            <div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Company Name */}
            <div>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Company Name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Project Information */}
            <div>
              <textarea
                id="projectInfo"
                name="projectInfo"
                value={formData.projectInfo}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition resize-none"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
                placeholder="Project Information"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-full transition ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}