'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLandingPage = pathname === '/'
  const isLightBackground = pathname !== '/' && pathname !== '/contact'
  const linkColor = isLightBackground ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-300'
  const logoSrc = isLightBackground ? '/logo_black.svg' : '/logo_white.svg'

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navigationLinks = [
    { href: '/properties', text: 'Propriétés' },
    { href: '/developers', text: 'Promoteurs' },
    { href: '/invest-in-dubai', text: 'Investir à Dubaï' },
    { href: '/guides', text: 'Actualités et Guides' },
    { href: '/contact', text: 'Contact' }
  ]

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 pt-2 sm:pt-6">
      <div className="w-full px-2 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-4 ml-0 sm:ml-4">
            <Link href="/" className="flex items-center">
              <Image
                src={logoSrc}
                alt="Mansa Real Estate"
                width={140}
                height={33}
                className="sm:w-[176px] sm:h-[41px]"
                priority
              />
            </Link>
            {/* City logos - hidden on mobile, visible on desktop for landing page */}
            {isLandingPage && (
              <div className="hidden lg:flex items-center gap-4 ml-8">
                <Image
                  src="/dubai-logo.svg"
                  alt="Dubai"
                  width={80}
                  height={100}
                  priority
                  className='ml-4'
                />
                <Image
                  src="/abu-dhabi-logo.svg"
                  alt="Abu Dhabi"
                  width={100}
                  height={120}
                  priority
                  className='ml-4'
                />
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkColor} transition-all duration-200 text-mont-regular hover:scale-110`}
                style={{ fontSize: '18px' }}
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="Toggle navigation menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                } ${isLightBackground ? 'bg-black' : 'bg-white'}`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                } ${isLightBackground ? 'bg-black' : 'bg-white'}`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                } ${isLightBackground ? 'bg-black' : 'bg-white'}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden fixed inset-0 top-[100px] transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className={`h-full flex flex-col justify-center px-2 space-y-6 ${
            isLightBackground ? 'bg-white' : 'bg-black'
          }`}>
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-2 py-2 text-xl text-mont-regular text-center transition-colors ${linkColor}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}

            {/* Mobile City Logos for Landing Page */}
            {isLandingPage && (
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200/20">
                <Image
                  src="/dubai-logo.svg"
                  alt="Dubai"
                  width={40}
                  height={53}
                  priority
                />
                <Image
                  src="/abu-dhabi-logo.svg"
                  alt="Abu Dhabi"
                  width={53}
                  height={53}
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}