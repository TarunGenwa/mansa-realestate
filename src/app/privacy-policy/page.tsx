import { wpApi } from '@/lib/api/wordpress'
import { Metadata } from 'next'
import Image from 'next/image'
import React, { useEffect } from 'react'

// Enable ISR - revalidate every 24 hours for privacy policy
export const revalidate = 86400
export const metadata: Metadata = {
  title: 'Privacy Policy - Mansa',
  description: 'Privacy Policy and Data Protection Information for Mansa',
}

export default async function PrivacyPolicyPage() {
  // Fetch media images to get the guides hero image

  const heroImage = await wpApi.media.getBySlug('guides-hero') || ''


  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative" style={{ paddingLeft: '87px', paddingRight: '87px', paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="flex flex-col items-center">
       

          {/* Image */}
          <div className="w-full relative">
           {heroImage ? (
                     <div className="relative w-[90%] mx-auto rounded-md h-[280px] mb-8">
                       <Image
                         src={heroImage.source_url}
                         alt="Guides et Actualités"
                         fill
                         className="object-cover rounded-md"
                         priority
                       />
                     </div>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-xl">Privacy Policy Image</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-8" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">

              <h2
                className="text-3xl mb-12 text-center"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  color: '#000'
                }}
              >
               Privacy Policy
              </h2>
            {/* Section 1: Introduction */}
            <div className="mb-24">
              <h2
                className="text-3xl mb-6"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  color: '#000'
                }}
              >
                1. INTRODUCTION
              </h2>
              <div className="space-y-4">
                <p
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333'
                  }}
                >
                  La présente Politique de Confidentialité (« Politique ») décrit la manière dont [NOM DE L'ENTREPRISE] (« nous », « notre », « nos ») collecte, utilise, stocke, partage et protège vos informations personnelles lorsque vous utilisez nos services, visitez notre site web, ou interagissez avec nous de quelque manière que ce soit.
                </p>
              
               
              </div>
            </div>

            {/* Section 2: Definitions */}
            <div className="mb-12">
              <h2
                className="text-3xl mb-6"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  color: '#000'
                }}
              >
                2. DÉFINITIONS
              </h2>
              <div className="space-y-4">
                <p
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333'
                  }}
                >
                  <strong>Données personnelles :</strong> Toute information se rapportant à une personne physique identifiée ou identifiable.
                </p>
                <p
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333'
                  }}
                >
                  <strong>Traitement :</strong> Toute opération effectuée sur des données personnelles, notamment la collecte, l'enregistrement, l'organisation, la conservation, l'adaptation, la modification, l'extraction, la consultation, l'utilisation, la communication, la diffusion ou la mise à disposition.
                </p>
                <p
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333'
                  }}
                >
                  <strong>Responsable du traitement :</strong> L'entité qui détermine les finalités et les moyens du traitement des données personnelles.
                </p>
                <p
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333'
                  }}
                >
                  <strong>Sous-traitant :</strong> L'entité qui traite des données personnelles pour le compte du responsable du traitement.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}