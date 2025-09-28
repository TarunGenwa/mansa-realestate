'use client'

import SimpleCarousel from './SimpleCarousel'

interface DeveloperPropertiesSectionProps {
  developerName: string
  properties: any[]
}

export default function DeveloperPropertiesSection({ developerName, properties }: DeveloperPropertiesSectionProps) {
  if (properties.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div style={{ paddingLeft: '87px', paddingRight: '87px' }}>
        <h2
          className="text-3xl md:text-4xl font-semibold mb-4"
          style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
        >
          All Projects by {developerName}
        </h2>
        <p
          className="text-lg text-gray-600 mb-8 max-w-3xl"
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 400,
            lineHeight: '1.6'
          }}
        >
          Explore the exceptional properties and developments by this renowned developer.
        </p>
      </div>

      <SimpleCarousel
        posts={properties}
        fallbackImage={{
          source_url: "https://ik.imagekit.io/slamseven/3699346bfbeb7e914d97ca326277009b9841dce3_D4dt-DTI0.jpg?updatedAt=1758914537538",
          alt_text: "Property placeholder"
        }}
      />
    </section>
  )
}