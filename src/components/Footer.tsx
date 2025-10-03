'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { wpData } from '@/lib/data/wordpress-loader'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [guides, setGuides] = useState<any[]>([])
  const [developers, setDevelopers] = useState<any[]>([])

  useEffect(() => {
    // Load guides and developers from static data
    setGuides(wpData.guides.getAll())
    setDevelopers(wpData.developers.getAll())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    // Handle email submission here
    setEmail('')
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Developers', href: '/developers' },
    { name: 'Guides', href: '/guides' },
    { name: 'Invest in Dubai', href: '/invest-in-dubai' },
    { name: 'Contact', href: '/contact' }
  ]

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/61573802309476/', icon: 'f' },
    { name: 'Instagram', href: 'https://www.instagram.com/p/DOh96H_jKyG/?igsh=MWp3emk0YTU4eXN5aw==', icon: 'ig' },
    { name: 'LinkedIn', href: 'https://ae.linkedin.com/company/mansa-realestate', icon: 'in' },
    { name: 'TikTok', href: 'https://vm.tiktok.com/ZNdthmvCo/', icon: 'tt' }
  ]

  return (
    <footer className="bg-black text-white" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
      <div className="py-16">
        {/* Top Section - Newsletter */}
        <div className="mb-16">
          <h2
            className="text-4xl mb-4"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400
            }}
          >
            Stay up to date with us
          </h2>
          <p
            className="text-gray-400 mb-8 max-w-2xl"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 300
            }}
          >
            Discover exclusive property listings, market insights, and investment opportunities delivered directly to your inbox.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif'
              }}
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-medium"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif'
              }}
            >
              Join
            </button>
          </form>
        </div>

        {/* Middle Section - Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Navigation Links */}
          <div className="border border-gray-700 p-6 rounded-lg">
            <h3
              className="text-sm uppercase tracking-wider mb-4 text-gray-400"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500
              }}
            >
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 300,
                      fontSize: '14px'
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides Links */}
          <div className="border border-gray-700 p-6 rounded-lg">
            <h3
              className="text-sm uppercase tracking-wider mb-4 text-gray-400"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500
              }}
            >
              Guides
            </h3>
            <ul className="space-y-3">
              {guides.map((guide) => (
                <li key={guide.id}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="text-gray-300 hover:text-white transition-colors"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 300,
                      fontSize: '14px'
                    }}
                  >
                    {guide.title.rendered}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers Links */}
          <div className="border border-gray-700 p-6 rounded-lg">
            <h3
              className="text-sm uppercase tracking-wider mb-4 text-gray-400"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 500
              }}
            >
              Developers
            </h3>
            <ul className="space-y-3">
              {developers.map((developer) => (
                <li key={developer.id}>
                  <Link
                    href={`/developers/${developer.slug}`}
                    className="text-gray-300 hover:text-white transition-colors"
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 300,
                      fontSize: '14px'
                    }}
                  >
                    {developer.title.rendered}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright and Social Links */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p
              className="text-gray-400 text-sm"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 300
              }}
            >
              © 2024 Mansa. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300"
                aria-label={social.name}
              >
                <span className="text-sm font-medium">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Mansa Logo at the bottom */}
        <div className="mt-12 pb-4 relative w-full" style={{ height: '60px' }}>
          <Image
            src="/mansa_footer.svg"
            alt="Mansa"
            fill
            className="object-contain opacity-30 grayscale brightness-150"
            style={{ filter: 'grayscale(100%) brightness(4.5)' }}
          />
        </div>
      </div>
    </footer>
  )
}