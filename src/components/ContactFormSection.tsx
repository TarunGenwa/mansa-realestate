'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useMedia } from '@/src/providers/MediaProvider'

interface ContactFormSectionProps {
  reverseOrder?: boolean
  contactImageUrl?: string // Allow passing image URL to avoid redundant API calls
}

export default function ContactFormSection({ reverseOrder = false, contactImageUrl }: ContactFormSectionProps) {
  const { getImageByTitle } = useMedia()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    about: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const [contactImage, setContactImage] = useState<{
    source_url: string
    alt_text?: string
  } | null>(null)

  useEffect(() => {
    // Only fetch contact image if not provided via props
    if (contactImageUrl) {
      setContactImage({
        source_url: contactImageUrl,
        alt_text: 'Contact Office'
      })
      return
    }

    const contactUsImage = getImageByTitle('Contact Us Section')
    console.log('Fetched contact us image:', contactUsImage)
    if (contactUsImage) {
      setContactImage({
        source_url: contactUsImage.source_url,
        alt_text: contactUsImage.alt_text
      })
    }
  }, [contactImageUrl, getImageByTitle])

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
          name: formData.name,
          email: formData.email,
          message: formData.about
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Merci pour votre message! Nous vous répondrons bientôt.'
        })
        // Reset form
        setFormData({
          name: '',
          email: '',
          about: ''
        })
      } else {
        throw new Error(data.message || 'Une erreur est survenue')
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden px-4 sm:px-8 lg:px-[87px] my-8 bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 min-h-[600px]">
        {/* Contact Form */}
        <div className={`py-8 lg:py-12 bg-[#EDECE3] px-6 lg:px-12 flex items-center ${reverseOrder ? 'lg:order-2' : 'lg:order-1'}`}>
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

            <form onSubmit={handleSubmit} className="space-y-5 p-6  rounded-lg border border-gray-200">
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
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#333'
                  }}
                >
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Entrez votre nom complet"
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#333'
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block mb-2"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#333'
                  }}
                >
                  Message
                </label>
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
                  placeholder="Parlez-nous de vous et de votre projet..."
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
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
              </button>
            </form>

            {/* Office Address */}
            {/* <div className="mt-12 pt-8 border-t border-gray-300">
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
            </div> */}
          </div>
        </div>

        {/* Image */}
        <div className={`relative h-96 lg:h-auto ${reverseOrder ? 'lg:order-1' : 'lg:order-2'}`}>
          {contactImage?.source_url ? (
            <Image
              src={contactImage.source_url}
              alt={contactImage.alt_text || "Contact Office"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Loading image...</span>
            </div>
          )}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-[#ECE8DD]/80 to-transparent w-32" /> */}
        </div>
      </div>
    </section>
  )
}