import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TAXII 2.0 Client',
  description: 'A Web Client for TAXII 2.0 Feeds. Created using v0 (crazy stuff)',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
