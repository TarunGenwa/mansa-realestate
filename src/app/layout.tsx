import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Navigation from "@/src/components/Navigation";
import LenisProvider from "@/src/components/LenisProvider";
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
        <LenisProvider>
          <Navigation />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
