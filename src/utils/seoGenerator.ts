import { Tool, CategoryId } from '../types';

export interface ToolSEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogType: string;
}

/**
 * Category-specific High-CTR Meta Title Templates & Action Modifiers
 */
const CATEGORY_TITLE_MODIFIERS: Record<string, { prefix: string; suffix: string }> = {
  dev: { prefix: 'Free Online ', suffix: ' - Fast & Secure | SmartToolHub' },
  text: { prefix: 'Free ', suffix: ' - Instant Text Tool | SmartToolHub' },
  design: { prefix: 'Free ', suffix: ' - CSS & Color Generator | SmartToolHub' },
  math: { prefix: 'Free ', suffix: ' - Safe & Instant | SmartToolHub' },
  youtube: { prefix: 'Free ', suffix: ' - Boost Views & SEO | SmartToolHub' },
  seo: { prefix: 'Free ', suffix: ' - Rank & Audit Tool | SmartToolHub' },
  ai: { prefix: 'AI ', suffix: ' - Free Gemini Assistant | SmartToolHub' },
  instagram: { prefix: 'Free ', suffix: ' - Growth & Reach Tool | SmartToolHub' },
  business: { prefix: 'Free ', suffix: ' - Fast Business Generator | SmartToolHub' },
  'ai-business': { prefix: 'AI ', suffix: ' - Enterprise Smart Tool | SmartToolHub' },
};

/**
 * Category-specific High-CTR Call-To-Action (CTA) Endings for Descriptions
 */
const CATEGORY_DESCRIPTION_SUFFIXES: Record<string, string> = {
  dev: ' 100% free, private & instant browser processing.',
  text: ' Fast, free, and works 100% offline in browser.',
  design: ' Free tool with live CSS previews & instant copy.',
  math: ' Cryptographically safe, fast & 100% private.',
  youtube: ' Optimize your channel reach & boost views today.',
  seo: ' Boost search engine rankings & CTR with zero sign-up.',
  ai: ' Powered by Gemini AI for smart, instant results.',
  instagram: ' Increase audience engagement & social growth free.',
  business: ' Fast, professional & ready for business export.',
  'ai-business': ' Enterprise AI document automation & high efficiency.',
};

/**
 * Auto-generates a unique, high-CTR Meta Title optimized for Google SERP (<65 chars)
 */
export function generateToolMetaTitle(
  name: string,
  category: CategoryId | string = 'dev',
  isPremium?: boolean
): string {
  if (!name) return 'Free Online Utility | SmartToolHub';

  const mod = CATEGORY_TITLE_MODIFIERS[category] || { prefix: 'Free Online ', suffix: ' | SmartToolHub' };
  
  // High-CTR title candidate
  let title = `${mod.prefix}${name}${mod.suffix}`;

  // If title is too long for Google SERP (>62 chars), prune or simplify gracefully
  if (title.length > 62) {
    title = `${name} - Free Online Tool | SmartToolHub`;
  }
  if (title.length > 62) {
    title = `${name} | SmartToolHub Free Tools`;
  }

  return title;
}

/**
 * Auto-generates a unique, high-CTR Meta Description optimized for Google SERP (140-160 chars)
 */
export function generateToolMetaDescription(
  name: string,
  rawDescription: string,
  category: CategoryId | string = 'dev',
  tags: string[] = []
): string {
  const cleanName = name || 'Tool';
  const cleanDesc = (rawDescription || '').trim().replace(/\.$/, '');
  const suffix = CATEGORY_DESCRIPTION_SUFFIXES[category] || ' 100% free, fast & no sign-up required.';

  // Construct a compelling, search-intent driven narrative
  let actionHook = `Use our free online ${cleanName} to `;
  
  // Format based on description text
  let body = cleanDesc;
  if (body) {
    // Lowercase first letter if starting with a verb/action
    const firstChar = body.charAt(0);
    if (firstChar === firstChar.toUpperCase() && !body.startsWith('AI') && !body.startsWith('JSON') && !body.startsWith('CSS') && !body.startsWith('SVG')) {
      body = body.charAt(0).toLowerCase() + body.slice(1);
    }
  } else {
    body = `process and optimize ${cleanName.toLowerCase()} efficiently`;
  }

  let fullDesc = `${actionHook}${body}.${suffix}`;

  // If description is under 135 chars, pad with tag keywords or trust badge
  if (fullDesc.length < 135 && tags.length > 0) {
    const topTags = tags.slice(0, 3).join(', ');
    fullDesc = `Use our free online ${cleanName} to ${body}. Perfect for ${topTags}.${suffix}`;
  }

  // Ensure length stays in optimal 140 - 160 char range for high CTR without truncation
  if (fullDesc.length > 160) {
    // Truncate cleanly at last complete word boundary before 157 chars and append '...'
    const truncated = fullDesc.substring(0, 157);
    const lastSpace = truncated.lastIndexOf(' ');
    fullDesc = (lastSpace > 120 ? truncated.substring(0, lastSpace) : truncated) + '...';
  }

  return fullDesc;
}

/**
 * Main auto-generator function for complete SEO metadata of any individual tool page
 */
export function generateToolSEO(
  tool: Partial<Tool> & { id: string; name: string; category?: CategoryId; description?: string; tags?: string[]; isPremium?: boolean }
): ToolSEOMetadata {
  const name = tool.name || 'Developer Tool';
  const category = tool.category || 'dev';
  const rawDesc = tool.description || '';
  const tags = tool.tags || [];

  const title = tool.metaTitle || generateToolMetaTitle(name, category, tool.isPremium);
  const description = tool.metaDescription || generateToolMetaDescription(name, rawDesc, category, tags);

  const defaultKeywords = ['smarttoolhub', 'free online tools', 'developer utility', name.toLowerCase()];
  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...tags.map((t) => t.toLowerCase())]));

  const canonicalUrl = `https://smarttoolhub.net/${tool.id || tool.slug || ''}`;

  return {
    title,
    description,
    keywords: mergedKeywords,
    canonicalUrl,
    ogType: 'article',
  };
}
