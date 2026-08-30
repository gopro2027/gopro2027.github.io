import type React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google"
import "./globals.css"

/* Display — variable width axis is load-bearing: the hero wordmark animates
   from wdth 62 (laid out) to wdth 122 (aired up). */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "OASMan — Open Source Air Suspension",
  description:
    "Worlds first open source air suspension.",
  icons: {
    icon: "/assets/favicon.ico",
    shortcut: "/assets/favicon.ico",
    apple: "/assets/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSans.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
