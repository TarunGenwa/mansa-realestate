'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useScroll, useTransform, motion } from 'framer-motion'

interface HorizontalScrollCarouselProps {
  projectTileImage: {
    source_url: string
    alt_text?: string
    title?: {
      rendered: string
    }
  }
}

export default function HorizontalScrollCarousel({ projectTileImage }: HorizontalScrollCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transform vertical scroll to horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

  return (
    <section
      ref={containerRef}
      className="relative h-[150vh]" // Much more reasonable height
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex gap-6"
          initial={{ x: 0 }}
        >
          <div style={{ paddingLeft: '87px' }} />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div
              key={index}
              className="relative flex-shrink-0 rounded-sm overflow-hidden group cursor-pointer"
              style={{ width: '360px', height: '577px' }}
            >
              <Image
                src={projectTileImage.source_url}
                alt={`Project ${index}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold">Projet {index}</h3>
                  <p className="text-white/80 text-sm mt-2">Découvrir le projet</p>
                </div>
              </div>
            </div>
          ))}
          <div style={{ paddingRight: '87px' }} />
        </motion.div>
      </div>
    </section>
  )
}