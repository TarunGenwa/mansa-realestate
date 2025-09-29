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
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
  }

  return (
    <section className="relative h-[700px] w-full overflow-hidden">
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
            Contact Us
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
            Let&apos;s start a conversation about your dream project
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 transition resize-none"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
                placeholder="Tell us about your project..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-900 transition"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}