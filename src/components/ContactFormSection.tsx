'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ContactFormSectionProps {
  contactImage?: {
    source_url: string
    alt_text?: string
  } | null
}

export default function ContactFormSection({ contactImage }: ContactFormSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    about: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  return (
    <section style={{ backgroundColor: '#ECE8DD' }} className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[600px]">
        {/* Left Side - Contact Form */}
        <div className="py-16 lg:py-20" style={{ paddingLeft: '87px', paddingRight: '60px' }}>
          <div className="max-w-lg">
            <h2
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '32px',
                lineHeight: '120%'
              }}
              className="mb-6"
            >
              Contactez-nous
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '150%'
              }}
              className="text-gray-700 mb-8"
            >
              Envoyez-nous un message et commençons la conversation — sans pression, juste un véritable soutien.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white/70 rounded-lg border border-gray-200">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nom complet"
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition"
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
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition resize-none"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '14px'
                  }}
                  placeholder="Parlez-nous de vous..."
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
                Soumettre
              </button>
            </form>

            {/* Office Address */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <div className="p-6 bg-white/50 rounded-lg border border-gray-200">
                <h3
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '120%'
                  }}
                  className="mb-3"
                >
                  Adresse du bureau
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '140%'
                  }}
                  className="text-gray-600"
                >
                  Office 1007, 10th Floor, Iris Bay Tower,<br />
                  Business Bay, Dubai, U.A.E
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative h-96 lg:h-auto">
          <Image
            src={contactImage?.source_url || "https://ik.imagekit.io/slamseven/3699346bfbeb7e914d97ca326277009b9841dce3_D4dt-DTI0.jpg?updatedAt=1758914537538"}
            alt={contactImage?.alt_text || "Contact Office"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ECE8DD]/80 to-transparent w-32" />
        </div>
      </div>
    </section>
  )
}