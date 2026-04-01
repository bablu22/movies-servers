import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"

import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "StreamVault",
  title: {
    default: "StreamVault - Movie Streaming Services Directory",
    template: "%s | StreamVault",
  },
  description:
    "Explore 251+ movie and TV streaming sites with live uptime tracking, instant filtering, and preview snapshots in one fast directory.",
  keywords: [
    "movie streaming directory",
    "free streaming sites",
    "watch movies online",
    "tv streaming websites",
    "streaming uptime checker",
    "streamvault",
    "movie site list",
    "online streaming directory",
  ],
  authors: [{ name: "Bablu Mia", url: "https://github.com/bablu22" }],
  creator: "Bablu Mia",
  publisher: "StreamVault",
  alternates: {
    canonical: "/",
  },
  category: "entertainment",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "StreamVault",
    title: "StreamVault - Movie Streaming Services Directory",
    description:
      "Find and monitor 251+ streaming websites with live status, smart search, and quick previews.",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "StreamVault",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "StreamVault",
  url: siteUrl,
  description:
    "Movie and TV streaming services directory with live status checking and previews.",
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
