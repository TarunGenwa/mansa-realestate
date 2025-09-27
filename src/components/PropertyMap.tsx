'use client'

interface PropertyMapProps {
  coordinates: string
}

function parseCoordinates(coordinateString: string): { lat: number; lng: number } | null {
  // Parse coordinates like "25.2048° N, 55.2708° E"
  const regex = /(\d+\.\d+)°\s*([NS]),?\s*(\d+\.\d+)°\s*([EW])/i
  const match = coordinateString.match(regex)

  if (!match) return null

  let lat = parseFloat(match[1])
  let lng = parseFloat(match[3])

  // Convert to negative if South or West
  if (match[2].toUpperCase() === 'S') lat = -lat
  if (match[4].toUpperCase() === 'W') lng = -lng

  return { lat, lng }
}

export default function PropertyMap({ coordinates }: PropertyMapProps) {
  const coords = parseCoordinates(coordinates)

  if (!coords) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p
          className="text-gray-500"
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontSize: '14px'
          }}
        >
          Unable to parse coordinates: {coordinates}
        </p>
      </div>
    )
  }

  // Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}&q=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`

  return (
    <div className="h-full w-full relative">
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Property location at ${coordinates}`}
        />
      ) : (
        // Fallback: Static map or placeholder
        <div className="h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6">
          <div className="text-center mb-4">
            <h4
              className="text-lg font-semibold mb-2"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif'
              }}
            >
              Property Location
            </h4>
            <p
              className="text-gray-600 mb-4"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontSize: '14px'
              }}
            >
              {coordinates}
            </p>
            <div className="space-y-2">
              <p
                className="text-gray-500"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '12px'
                }}
              >
                Latitude: {coords.lat}°
              </p>
              <p
                className="text-gray-500"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '12px'
                }}
              >
                Longitude: {coords.lng}°
              </p>
            </div>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '14px'
            }}
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  )
}