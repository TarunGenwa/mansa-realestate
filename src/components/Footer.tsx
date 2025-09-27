import { wpApi } from '@/lib/api/wordpress'
import Image from 'next/image'

export default async function Footer() {
  const mediaImages = await wpApi.media.getAll({ media_type: 'image', per_page: 100 }).catch(() => [])
  const footerImage = mediaImages.find(img => img.title.rendered.toLowerCase() === 'footer') || null

  return (
    <footer
      className="relative h-screen"
      style={{ backgroundColor: '#2F1612' }}
    >
      {footerImage && (
        <div className="relative h-4/5">
          <Image
            src={footerImage.source_url}
            alt={footerImage.alt_text || 'Footer Image'}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      <div
        className="flex items-center justify-center h-1/5 text-white"
        style={{
          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight: 500,
          fontSize: '15px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      >
        © 2025 Mansa Real Estate. Tous droits réservés.
      </div>
    </footer>
  )
}