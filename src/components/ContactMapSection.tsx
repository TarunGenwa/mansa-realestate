'use client'

export default function ContactMapSection() {
  return (
    <section className="py-20" style={{ paddingLeft: '87px', paddingRight: '87px' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Map */}
        <div className="h-[500px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1786536630813!2d55.2644075!3d25.1971836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0x42a1f0a8c0a0b5d5!2sBusiness%20Bay%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sus!4v1635959709845!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dubai Office Location"
          />
        </div>

        {/* Right Side - Visit Us Info */}
        <div className="flex flex-col justify-center">
          <h2
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '36px',
              lineHeight: '120%'
            }}
            className="mb-8"
          >
            Visit Us in Dubai
          </h2>

          <div className="space-y-8">
            {/* Office Address */}
            <div className="border-l-4 border-black pl-6">
              <h3
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '120%'
                }}
                className="mb-3"
              >
                Office Address
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '150%'
                }}
                className="text-gray-600"
              >
                Office 1007, 10th Floor, Iris Bay Tower,<br />
                Business Bay, Dubai, U.A.E
              </p>
            </div>

            {/* Contact Information */}
            <div className="border-l-4 border-black pl-6">
              <h3
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '120%'
                }}
                className="mb-3"
              >
                Contact Information
              </h3>
              <div className="space-y-2">
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '150%'
                  }}
                  className="text-gray-600"
                >
                  <span className="font-medium text-black">Phone:</span> +971 4 123 4567
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '150%'
                  }}
                  className="text-gray-600"
                >
                  <span className="font-medium text-black">Email:</span> info@mansa.ae
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '150%'
                  }}
                  className="text-gray-600"
                >
                  <span className="font-medium text-black">WhatsApp:</span> +971 50 123 4567
                </p>
              </div>
            </div>

            {/* Office Hours */}
            <div className="border-l-4 border-black pl-6">
              <h3
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '120%'
                }}
                className="mb-3"
              >
                Office Hours
              </h3>
              <div className="space-y-1">
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '150%'
                  }}
                  className="text-gray-600"
                >
                  <span className="font-medium text-black">Monday - Friday:</span> 9:00 AM - 6:00 PM
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '150%'
                  }}
                  className="text-gray-600"
                >
                  <span className="font-medium text-black">Saturday:</span> 10:00 AM - 3:00 PM
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '150%'
                  }}
                  className="text-gray-600"
                >
                  <span className="font-medium text-black">Sunday:</span> Closed
                </p>
              </div>
            </div>

            {/* CTA Button */}
            {/* <div className="pt-4">
              <a
                href="https://wa.me/971501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-900 transition"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px'
                }}
              >
                Chat on WhatsApp
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}