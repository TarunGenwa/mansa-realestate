import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Navigation from "@/src/components/Navigation";
import Footer from "@/src/components/Footer";
import LenisProvider from "@/src/components/LenisProvider";
import { MediaProvider } from "@/src/providers/MediaProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Mansa - Marketing Website",
  description: "Welcome to Mansa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${playfairDisplay.variable} antialiased`}
      >
        <MediaProvider>
          <LenisProvider>
            <Navigation />
            {children}
            <Footer />
          </LenisProvider>
        </MediaProvider>
      </body>
    </html>
  );
}
