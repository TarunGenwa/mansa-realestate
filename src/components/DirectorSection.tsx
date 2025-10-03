'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMedia } from '@/src/providers/MediaProvider'
import { useState } from 'react'

export default function DirectorSection() {
  const { getImageByTitle } = useMedia()
  const directorImage = getImageByTitle('Ismahen Lesongeur')
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-[87px] bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
        {/* Left Side - Director Image */}
        <div className="relative h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
          {directorImage ? (
            <>
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
              <Image
                src={directorImage.source_url}
                alt={directorImage.alt_text || "Ismahen Lesongeur"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Director Image</span>
            </div>
          )}
        </div>

        {/* Right Side - Text Content */}
        <div className="space-y-6 w-full px-4 lg:w-4/5 lg:mx-0 text-center lg:text-left">
          {/* Name */}
          <div>
            <div className="leading-tight">
              <p className="text-h2 text-mont-regular">Ismahen</p>
              <p className="text-h2 text-play-black-italic">Lesongeur</p>
            </div>

            {/* Designation */}
            <p className="text-body text-mont-bold mt-4">
              Co-Fondatrice MANSA REAL ESTATE
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-body-sm text-mont-regular text-gray-700 leading-relaxed">
              Présents depuis plus de 15 ans à Dubaï et Abu Dhabi, nous avons bâti notre réputation sur l&apos;art d&apos;accompagner les projets les plus ambitieux. Chaque transaction est pour nous une aventure humaine, où la confiance se construit autant que la pierre.
            </p>
          </div>

          {/* Signature Placeholder */}
          <div className="py-4 flex justify-center lg:justify-start">
            <div className="h-16 w-48">
              {/* Placeholder for signature image */}
              <Image
                src="/ismahen-sign.svg"
                alt="Signature"
                width={192}
                height={64}
                className="object-contain"
              />
            </div>
          </div>

          {/* Qualities */}
          <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
            <button className="px-6 py-2 text-body text-mont-regular border-2 border-black rounded-full bg-transparent hover:bg-gray-100 transition-colors">
              Vision
            </button>
            <button className="px-6 py-2 text-body text-mont-regular border-2 border-black rounded-full bg-transparent hover:bg-gray-100 transition-colors">
              Confiance
            </button>
            <button className="px-6 py-2 text-body text-mont-regular border-2 border-black rounded-full bg-transparent hover:bg-gray-100 transition-colors">
              Prestige
            </button>
          </div>

          {/* Contact Button */}
          <div className="pt-4 flex justify-center lg:justify-start">
            <Link
              href="/contact"
              className="inline-flex items-center justify-between px-8 py-3 text-white bg-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300 min-w-[200px]"
            >
              <span className="flex-1 text-center text-mont-regular">Contact</span>
              <Image
                src="/top-right-white.svg"
                alt=""
                width={32}
                height={32}
                className="ml-4"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}