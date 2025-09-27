'use client'

import Image from 'next/image'

interface DirectorSectionProps {
  directorImage?: {
    source_url: string
    alt_text?: string
  } | null
}

export default function DirectorSection({ directorImage }: DirectorSectionProps) {
  return (
    <section className="py-20" style={{ paddingLeft: '87px', paddingRight: '87px', backgroundColor: '#FAFAFA' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Director Image */}
        <div className="relative h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
          {directorImage ? (
            <Image
              src={directorImage.source_url}
              alt={directorImage.alt_text || "Ismahen - Director of Real Estate"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Director Image</span>
            </div>
          )}
        </div>

        {/* Right Side - Text Content */}
        <div className="space-y-6">
          <div>
            <h2
              className="text-4xl mb-2"
              style={{
                fontFamily: 'var(--font-playfair), Playfair Display, serif',
                fontWeight: 700
              }}
            >
              Ismahen
            </h2>
            <p
              className="text-xl text-gray-600"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500
              }}
            >
              Directrice de l&apos;Immobilier
            </p>
          </div>

          <div className="space-y-4">
            <p
              className="text-gray-700"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.8'
              }}
            >
              Avec plus de 15 ans d&apos;expérience dans le marché immobilier de Dubaï, Ismahen apporte une expertise inégalée et une passion pour l&apos;excellence à notre équipe. Sa connaissance approfondie du marché local et son réseau étendu garantissent que nos clients reçoivent les meilleures opportunités d&apos;investissement.
            </p>

            <p
              className="text-gray-700"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.8'
              }}
            >
              Diplômée en finance et immobilier, Ismahen a dirigé certaines des transactions les plus importantes de la région, aidant des investisseurs internationaux à réaliser leurs objectifs immobiliers à Dubaï. Sa vision stratégique et son engagement envers la satisfaction client font d&apos;elle un atout précieux pour Mansa.
            </p>

            <p
              className="text-gray-700"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.8'
              }}
            >
              &quot;Mon objectif est de transformer vos rêves immobiliers en réalité, en vous offrant un service personnalisé et des conseils d&apos;experts à chaque étape de votre parcours d&apos;investissement.&quot;
            </p>
          </div>

          {/* Contact Info */}
          <div className="pt-6">
            <div className="flex flex-col space-y-2">
              <a
                href="mailto:ismahen@mansa.ae"
                className="text-gray-600 hover:text-black transition-colors"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              >
                ismahen@mansa.ae
              </a>
              <a
                href="tel:+971501234567"
                className="text-gray-600 hover:text-black transition-colors"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '14px'
                }}
              >
                +971 50 123 4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}