import fs from 'fs';
import path from 'path';
import { TOOLS, CATEGORIES } from '../src/data/tools';
import { generate100BlogArticles } from '../src/data/blogArticlesData';

const BASE_URL = 'https://smarttoolhub.net';
const TODAY = new Date().toISOString().split('T')[0];

function createXmlUrlSet(urls: { loc: string; priority: string; changefreq: string }[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const u of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>\n`;
  return xml;
}

export function generateSitemapFiles(): { filename: string; content: string }[] {
  // Master Sitemap Index
  let masterXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  masterXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  masterXml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-tools.xml</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n`;
  masterXml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-categories.xml</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n`;
  masterXml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-pages.xml</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n`;
  masterXml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-blog.xml</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n`;
  masterXml += `</sitemapindex>\n`;

  // Tools Sub-Sitemap
  const toolUrls = TOOLS.map((t) => ({
    loc: `${BASE_URL}/${t.id || t.slug}`,
    priority: t.isPopular ? '0.9' : '0.85',
    changefreq: 'weekly',
  }));
  const toolsXml = createXmlUrlSet(toolUrls);

  // Categories Sub-Sitemap
  const categoryUrls = CATEGORIES.map((c) => ({
    loc: `${BASE_URL}/category/${c.id}`,
    priority: '0.95',
    changefreq: 'daily',
  }));
  const categoriesXml = createXmlUrlSet(categoryUrls);

  // Core Static Pages Sub-Sitemap
  const corePages = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/pricing`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/help`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/privacy`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${BASE_URL}/terms`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${BASE_URL}/disclaimer`, priority: '0.5', changefreq: 'monthly' },
  ];
  const pagesXml = createXmlUrlSet(corePages);

  // Blog Sub-Sitemap
  const blogArticles = generate100BlogArticles();
  const blogUrls = [
    { loc: `${BASE_URL}/blog`, priority: '0.9', changefreq: 'daily' },
    ...blogArticles.map((article) => ({
      loc: `${BASE_URL}/blog/${article.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
    })),
  ];
  const blogXml = createXmlUrlSet(blogUrls);

  return [
    { filename: 'sitemap.xml', content: masterXml },
    { filename: 'sitemap-tools.xml', content: toolsXml },
    { filename: 'sitemap-categories.xml', content: categoriesXml },
    { filename: 'sitemap-pages.xml', content: pagesXml },
    { filename: 'sitemap-blog.xml', content: blogXml },
  ];
}

function run() {
  console.log('Generating clean XML sitemaps...');
  const files = generateSitemapFiles();

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const distDir = path.resolve(process.cwd(), 'dist');

  for (const f of files) {
    const pubPath = path.join(publicDir, f.filename);
    fs.writeFileSync(pubPath, f.content, 'utf-8');
    console.log(`Generated ${pubPath}`);

    if (fs.existsSync(distDir)) {
      const distPath = path.join(distDir, f.filename);
      fs.writeFileSync(distPath, f.content, 'utf-8');
      console.log(`Synced to ${distPath}`);
    }
  }
}

// Execute if run directly via tsx
if (process.argv[1] && process.argv[1].endsWith('generate-sitemap.ts')) {
  run();
}

