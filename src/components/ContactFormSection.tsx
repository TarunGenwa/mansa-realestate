'use client'

import { useState } from 'react'

export default function ContactFormSection() {
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
    <section style={{ backgroundColor: '#ECE8DD' }} className="py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h2
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '32px',
                lineHeight: '120%'
              }}
            >
              Contactez-nous. Bienvenue dans nos nouveaux bureaux.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '150%'
              }}
              className="text-gray-700"
            >
              Vous cherchez à acheter, vendre ou investir dans l'immobilier ? Nous sommes là pour vous guider à chaque étape. Envoyez-nous un message et commençons la conversation — sans pression, juste un véritable soutien de vraies personnes qui se soucient de vos objectifs.
            </p>

            <div className="mt-8">
              <h3
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '120%'
                }}
                className="mb-2"
              >
                Adresse du bureau
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '140%'
                }}
                className="text-gray-600"
              >
                Office 1007, 10th Floor, Iris Bay Tower,<br />
                Business Bay, Dubai, U.A.E
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px'
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '16px'
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
                    fontSize: '14px'
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '16px'
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
                    fontSize: '14px'
                  }}
                >
                  Parlez-nous de vous
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition resize-none"
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '16px'
                  }}
                  placeholder="Dites-nous comment nous pouvons vous aider..."
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
          </div>
        </div>
      </div>
    </section>
  )
}