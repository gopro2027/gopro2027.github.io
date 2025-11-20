import type React from "react"
import "./globals.css"

export const metadata = {
  title: "OASMan - Open Source Air Suspension Management",
  description:
    "DIY air suspension system for under $500. Fully customizable, open source, with gaming controller support.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
