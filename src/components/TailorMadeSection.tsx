'use client'

import { useState } from 'react'
import Image from 'next/image'

interface TailorMadeTab {
  id: number
  title: string
  description: string
  image: {
    source_url: string
    alt_text?: string
  }
}

interface TailorMadeSectionProps {
  mediaImages: Array<{
    id: number
    title: {
      rendered: string
    }
    source_url: string
    alt_text: string
  }>
}

export default function TailorMadeSection({ mediaImages }: TailorMadeSectionProps) {
  // Find the sur-measure images
  const surMeasureImages = []
  for (let i = 1; i <= 5; i++) {
    const image = mediaImages.find(img =>
      img.title.rendered.toLowerCase().includes(`sur-mesure-${i}`)
    )
    if (image) {
      surMeasureImages.push(image)
    }
  }

  // Tab content data
  const tabs: TailorMadeTab[] = [
    {
      id: 1,
      title: "Design Personnalisé",
      description: "Créez des espaces uniques qui reflètent votre personnalité et répondent à vos besoins spécifiques. Notre équipe de designers expérimentés transforme vos idées en réalité.",
      image: surMeasureImages[0] ? {
        source_url: surMeasureImages[0].source_url,
        alt_text: surMeasureImages[0].alt_text
      } : {
        source_url: "https://via.placeholder.com/800x600?text=Design+Personnalisé",
        alt_text: "Design Personnalisé"
      }
    },
    {
      id: 2,
      title: "Architecture Innovante",
      description: "Explorez les dernières tendances architecturales avec des solutions avant-gardistes qui allient esthétique moderne et fonctionnalité optimale pour votre style de vie.",
      image: surMeasureImages[1] ? {
        source_url: surMeasureImages[1].source_url,
        alt_text: surMeasureImages[1].alt_text
      } : {
        source_url: "https://via.placeholder.com/800x600?text=Architecture+Innovante",
        alt_text: "Architecture Innovante"
      }
    },
    {
      id: 3,
      title: "Matériaux Premium",
      description: "Sélection rigoureuse des meilleurs matériaux durables et élégants. Chaque élément est choisi pour sa qualité exceptionnelle et son impact environnemental réduit.",
      image: surMeasureImages[2] ? {
        source_url: surMeasureImages[2].source_url,
        alt_text: surMeasureImages[2].alt_text
      } : {
        source_url: "https://via.placeholder.com/800x600?text=Matériaux+Premium",
        alt_text: "Matériaux Premium"
      }
    },
    {
      id: 4,
      title: "Technologie Intégrée",
      description: "Intégration harmonieuse des dernières technologies domotiques pour un confort et une efficacité énergétique optimaux dans votre nouvel espace de vie.",
      image: surMeasureImages[3] ? {
        source_url: surMeasureImages[3].source_url,
        alt_text: surMeasureImages[3].alt_text
      } : {
        source_url: "https://via.placeholder.com/800x600?text=Technologie+Intégrée",
        alt_text: "Technologie Intégrée"
      }
    },
    {
      id: 5,
      title: "Accompagnement Complet",
      description: "Un suivi personnalisé de A à Z, de la conception initiale à la livraison finale. Notre équipe vous accompagne à chaque étape de votre projet immobilier.",
      image: surMeasureImages[4] ? {
        source_url: surMeasureImages[4].source_url,
        alt_text: surMeasureImages[4].alt_text
      } : {
        source_url: "https://via.placeholder.com/800x600?text=Accompagnement+Complet",
        alt_text: "Accompagnement Complet"
      }
    }
  ]

  const [activeTab, setActiveTab] = useState(1)
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0]

  return (
    <section className="py-20 bg-white" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
      <div>
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl mb-6"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 300,
                lineHeight: '1.2'
              }}
            >
              Solutions{' '}
              <span
                className="italic"
                style={{
                  fontFamily: 'var(--font-playfair), Playfair Display, serif',
                  fontWeight: 900
                }}
              >
                sur mesure
              </span>
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                lineHeight: '1.6'
              }}
            >
              Découvrez notre approche personnalisée pour créer des espaces exceptionnels
              qui dépassent vos attentes et reflètent votre vision unique.
            </p>
          </div>

          {/* Full Width Image with Overlay Tabs */}
          <div className="relative h-[435px] lg:h-[435px] rounded-lg overflow-hidden">
            {/* Background Image */}
            <Image
              src={currentTab.image.source_url}
              alt={currentTab.image.alt_text || currentTab.title}
              fill
              className="object-cover transition-all duration-700 ease-in-out"
              sizes="100vw"
              priority
              style={{ filter: 'blur(8px)' }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30">
              {/* Tab Buttons Overlay - Vertical Centered */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full border-2 transition-all duration-300 backdrop-blur-sm text-left cursor-pointer relative z-10 ${
                      activeTab === tab.id
                        ? 'bg-black text-white border-black shadow-lg'
                        : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50'
                    }`}
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      minWidth: '200px'
                    }}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              {/* Content Overlay - Centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-8 lg:px-12 max-w-4xl">
                  <h3
                    className="text-3xl lg:text-5xl font-bold mb-6"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif'
                    }}
                  >
                    {currentTab.title}
                  </h3>
                  <p
                    className="text-lg lg:text-xl leading-relaxed opacity-90"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 400,
                      lineHeight: '1.6'
                    }}
                  >
                    {currentTab.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

      </div>
    </section>
  )
}