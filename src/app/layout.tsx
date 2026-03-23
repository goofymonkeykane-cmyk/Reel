import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Reel — Cinema Social Network',
    template: '%s | Reel',
  },
  description:
    'A free, open source social network for cinephiles. Find friends by film taste, watch together, discover what to watch next.',
  keywords: [
    'cinema', 'films', 'movies', 'letterboxd', 'anime', 'series',
    'social network', 'open source', 'cinephile', 'watch party',
    'film tracking', 'bollywood', 'indian cinema'
  ],
  authors: [{ name: 'Reel Community' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Reel',
    title: 'Reel — Cinema Social Network',
    description: 'Find your cinephile community. Free, open source, forever.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reel — Cinema Social Network',
    description: 'Find your cinephile community. Free, open source, forever.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a24',
              color: '#ede9e3',
              border: '1px solid rgba(255,255,255,0.11)',
              borderRadius: '10px',
              fontSize: '13px',
            },
            success: {
              iconTheme: {
                primary: '#45bea0',
                secondary: '#1a1a24',
              },
            },
            error: {
              iconTheme: {
                primary: '#e05050',
                secondary: '#1a1a24',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
