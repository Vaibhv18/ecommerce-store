import '../styles/globals.css'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'Shop - Modern E-commerce Store',
  description: 'Discover quality products for your lifestyle. Shop essentials, electronics, fashion, and home goods.',
  keywords: 'Shop, e-commerce, online store, products, shopping, fashion, electronics, home goods',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Serif+Pro:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-serif antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
