import Image from 'next/image'

export default function PartnersSection() {
  const partners = [
    {
      name: 'Armani',
      logo: '/armani.svg',
      width: 140,
      height: 60
    },
     {
      name: 'Imtiaz',
      logo: '/imtiaz.svg',
      width: 140,
      height: 60
    },
    {
      name: 'Sobha',
      logo: '/sobha.svg',
      width: 140,
      height: 60
    },
    {
      name: 'Imtiaz',
      logo: '/imtiaz.svg',
      width: 140,
      height: 60
    },
     {
      name: 'Armani',
      logo: '/armani.svg',
      width: 140,
      height: 60
    },
  ]

  return (
    <section className="py-16 bg-white px-4 sm:px-8 lg:px-[87px]">
      <div className="text-center">

        <p className='text-h4 text-mont-bold text-capitalize mb-8' >
          NOS PARTENAIRES           
        </p>

        <div className="flex justify-center items-center gap-16">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center justify-center">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}