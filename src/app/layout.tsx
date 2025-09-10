import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Navbar from "../../components/ui/navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "CareerCompass - Your AI Career Navigator",
  description:
    "Turn your academic journey and coding progress into an AI-powered resume and personalized career roadmap.",
  generator: "CareerCompass",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Navbar />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
