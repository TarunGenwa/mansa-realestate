'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ReactElement } from 'react'
import { useMedia } from '@/src/providers/MediaProvider'

interface TailorMadeTab {
  id: number
  title: string
  contentHead?: ReactElement<any, any>
  contentSubHead?: string
  image: {
    source_url: string
    alt_text?: string
  }
}

export default function TailorMadeSection() {
  const { mediaImages } = useMedia()

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
      title: "Sur Plan",
      contentHead: <p className="text-h2 text-mont-light text-black">Découvrez  <span className="text-h2 text-play-black-italic">l’architecture</span> visionnaire de Dubaï, aujourd’hui au prix de demain</p>,
      contentSubHead: "Accédez aux lancements exclusifs, plans optimisés et conditions développeur",
      image: {
        source_url: surMeasureImages[0]?.source_url || '',
        alt_text: surMeasureImages[0]?.alt_text
      }
    },
    
    {
      id: 2,
      title: "Marché secondaire",
      contentHead: <p className="text-h2 text-mont-light text-black">Le meilleur du  <span className="text-h2 text-play-black-italic">marché <br></br> secondaire</span>  à Dubaï, prêt<br></br> à vivre sans compromis</p>,
      contentSubHead: "Biens vérifiés,  historique clair, négociation maîtrisée",      
      image: {
        source_url: surMeasureImages[1]?.source_url || '',
        alt_text: surMeasureImages[1]?.alt_text
      }
    },
    
    {
      id: 3,
      title: "Appartement à vendre",
      contentHead: <p className="text-h2 text-mont-light text-black">Des appartements  aux <br></br> <span className="text-h2 text-play-black-italic"> vues iconiques,</span>  au cœur du <br></br> rythme de <span className="text-h2 text-play-black-italic"> Dubaï</span> </p>,
      contentSubHead: "Du studio design au penthouse,  sélection sur-mesure",      
      image: {
        source_url: surMeasureImages[2]?.source_url || '',
        alt_text: surMeasureImages[2]?.alt_text
      }
    },
    {
      id: 4,
      title: "Location",
      contentHead: <p className="text-h2 text-black text-mont-light">Louez   <span className="text-h2 text-play-black-italic">l’expérience</span> <br></br> Dubaï : adresse,  <br></br>services, lumière </p>,
      contentSubHead: "Du studio design au penthouse,  sélection sur-mesure",      
      image: {
        source_url: surMeasureImages[3]?.source_url || '',
        alt_text: surMeasureImages[3]?.alt_text
      }
    },
    {
      id: 5,
      title: "Achat Villa",
      contentHead: <p className="text-h2 text-black text-mont-light">Votre villa de    <span className="text-h2 text-play-black-italic">caractère</span> entre mer, désert et skyline</p>,
      contentSubHead: "Emirates Hills, Palm, District One : conseil  indépendant & off-market",      
      image: {
        source_url: surMeasureImages[4]?.source_url || '',
        alt_text: surMeasureImages[4]?.alt_text
      }
    }

    
  ]

  const [activeTab, setActiveTab] = useState(1)
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0]

  return (
    <section className="py-20 bg-white" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
      <div>
          {/* Section Header */}
          <div className="mb-16 text-start">

              <p className='text-body text-mont-regular'
              >
                SUR MESURE
              </p>
           
            <p className='text-h3 text-mont-regular mt-2 mb-6'>
             L’immobilier de <span className='text-h3 text-play-black-italic'>Dubaï,</span> <br></br> à votre mesure
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
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10 items-start">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-block px-6 py-3 text-body text-mont-regular rounded-full border-2 transition-all duration-300 backdrop-blur-sm cursor-pointer relative z-10 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-black text-white border-black shadow-lg'
                        : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              {/* Content Overlay - Centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-8 lg:px-12 max-w-4xl">
                  
                 {currentTab.contentHead}
                <div className='flex w-full justify-center'>
                  <p
                    className="w-120 text-center text-sm text-mont-bold lg:text-xl text-black mt-4 leading-relaxed opacity-90"
                  >
                    {currentTab.contentSubHead}
                  </p>
                </div>
                 
                </div>
              </div>
            </div>
          </div>

      </div>
    </section>
  )
}