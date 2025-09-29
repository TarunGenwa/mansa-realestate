'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const isLightBackground = pathname !== '/' && pathname !== '/contact'
  const linkColor = isLightBackground ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
  const logoSrc = isLightBackground ? '/logo_black.svg' : '/logo_white.svg'

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 pt-6">
      <div className="w-full px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center ml-4 gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src={logoSrc}
                alt="Mansa Real Estate"
                width={176}
                height={41}
                priority
              />
            </Link>
            {isLandingPage && (
              <div className="flex items-center gap-4 ml-8">
                <Image
                  src="/dubai-logo.svg"
                  alt="Dubai"
                  width={60}
                  height={80}
                  priority
                  className='ml-4'
                />
                <Image
                  src="/abu-dhabi-logo.svg"
                  alt="Abu Dhabi"
                  width={80}
                  height={80}
                  priority
                  className='ml-4'
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-8">
            <Link
              href="/properties"
              className={`${linkColor} transition text-body text-mont-regular`}
            
            >
              Propriétés
            </Link>
            <Link
              href="/invest-in-dubai"
              className={`${linkColor} transition text-body text-mont-regular`}
            
            >
              Investir à Dubaï
            </Link>
            <Link
              href="/guides"
              className={`${linkColor} transition text-body text-mont-regular`}
            >
              Actualités et Guides
            </Link>
            <Link
              href="/contact"
              className={`${linkColor} transition text-body text-mont-regular`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}