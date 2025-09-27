'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const isInvestPage = pathname === '/investir-dubai'
  const linkColor = isInvestPage ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
  const logoSrc = isInvestPage ? '/logo_black.svg' : '/logo_white.svg'

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 pt-6">
      <div className="w-full px-12">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center ml-4">
            <Image
              src={logoSrc}
              alt="Mansa Real Estate"
              width={176}
              height={41}
              priority
            />
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/properties"
              className={`${linkColor} transition`}
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontSize: '14px', fontWeight: 500 }}
            >
              Properties
            </Link>
            <Link
              href="/developers"
              className={`${linkColor} transition`}
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontSize: '14px', fontWeight: 500 }}
            >
              Developers
            </Link>
            <Link
              href="/investir-dubai"
              className={`${linkColor} transition`}
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontSize: '14px', fontWeight: 500 }}
            >
              Invest in Dubai
            </Link>
            <Link
              href="/about"
              className={`${linkColor} transition`}
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontSize: '14px', fontWeight: 500 }}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`${linkColor} transition`}
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontSize: '14px', fontWeight: 500 }}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}