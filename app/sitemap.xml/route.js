import { NextResponse } from 'next/server';
import pool from '../../lib/db';
import { generateSitemapData } from '@/lib/seo';

export async function GET() {
  try {
    // Get all products for sitemap
    const [products] = await pool.query('SELECT id, title, category FROM products');
    
    // Define static pages
    const staticPages = [
      { url: '/', priority: 1.0, changeFrequency: 'daily' },
      { url: '/products', priority: 0.9, changeFrequency: 'daily' },
      { url: '/auth/login', priority: 0.3, changeFrequency: 'monthly' },
      { url: '/auth/register', priority: 0.3, changeFrequency: 'monthly' },
      { url: '/cart', priority: 0.5, changeFrequency: 'weekly' },
      { url: '/checkout', priority: 0.4, changeFrequency: 'weekly' }
    ];

    // Generate product pages
    const productPages = products.map(product => ({
      url: `/products/${product.id}`,
      priority: 0.8,
      changeFrequency: 'weekly'
    }));

    // Combine all pages
    const allPages = [...staticPages, ...productPages];
    
    // Generate sitemap data
    const sitemapData = generateSitemapData(allPages);

    // Create XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapData.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
} 