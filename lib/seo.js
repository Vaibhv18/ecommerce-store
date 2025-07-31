// SEO utility functions for the e-commerce store

// Generate meta tags for pages
export function generateMetaTags({
  title,
  description,
  keywords = '',
  image = '/images/default-og.jpg',
  url = '',
  type = 'website'
}) {
  const siteName = 'LUXE Store';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  
  return {
    title: fullTitle,
    description: description || 'Discover premium products at LUXE Store. Quality guaranteed with free shipping and easy returns.',
    keywords: keywords,
    openGraph: {
      title: fullTitle,
      description: description,
      url: url,
      siteName: siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type: type
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      images: [image]
    }
  };
}

// Generate product schema markup
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title || product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'LUXE Store'
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'LUXE Store'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.5,
      reviewCount: product.reviewCount || 10
    }
  };
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Generate organization schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LUXE Store',
    url: 'https://luxestore.com',
    logo: 'https://luxestore.com/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service'
    },
    sameAs: [
      'https://facebook.com/luxestore',
      'https://twitter.com/luxestore',
      'https://instagram.com/luxestore'
    ]
  };
}

// Generate website schema
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LUXE Store',
    url: 'https://luxestore.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://luxestore.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

// Generate sitemap data
export function generateSitemapData(pages) {
  const baseUrl = 'https://luxestore.com';
  const currentDate = new Date().toISOString();
  
  return pages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified || currentDate,
    changeFrequency: page.changeFrequency || 'weekly',
    priority: page.priority || 0.5
  }));
}

// Clean URL for SEO
export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Generate canonical URL
export function generateCanonicalUrl(path) {
  const baseUrl = 'https://luxestore.com';
  return `${baseUrl}${path}`;
} 