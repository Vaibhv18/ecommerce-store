'use client';

import Head from 'next/head';
import { generateMetaTags, generateCanonicalUrl } from '@/lib/seo';

export default function SEOHead({
  title,
  description,
  keywords = '',
  image = '/images/default-og.jpg',
  url = '',
  type = 'website',
  schema = null
}) {
  const metaTags = generateMetaTags({
    title,
    description,
    keywords,
    image,
    url,
    type
  });

  const canonicalUrl = generateCanonicalUrl(url);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="LUXE Store" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metaTags.openGraph.title} />
      <meta property="og:description" content={metaTags.openGraph.description} />
      <meta property="og:url" content={metaTags.openGraph.url} />
      <meta property="og:site_name" content={metaTags.openGraph.siteName} />
      <meta property="og:type" content={metaTags.openGraph.type} />
      <meta property="og:image" content={metaTags.openGraph.images[0].url} />
      <meta property="og:image:width" content={metaTags.openGraph.images[0].width} />
      <meta property="og:image:height" content={metaTags.openGraph.images[0].height} />
      <meta property="og:image:alt" content={metaTags.openGraph.images[0].alt} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={metaTags.twitter.card} />
      <meta name="twitter:title" content={metaTags.twitter.title} />
      <meta name="twitter:description" content={metaTags.twitter.description} />
      <meta name="twitter:image" content={metaTags.twitter.images[0]} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      )}
    </Head>
  );
} 