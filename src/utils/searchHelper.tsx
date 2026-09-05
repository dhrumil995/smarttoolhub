import React from 'react';
import { Tool } from '../types';

// Common synonyms and abbreviations to make searching effortless
const SEARCH_ALIASES: Record<string, string[]> = {
  yt: ['youtube', 'video', 'shorts', 'reels', 'tags', 'thumbnail'],
  youtube: ['yt', 'video', 'shorts', 'reels', 'downloader'],
  ig: ['instagram', 'reels', 'hashtag', 'caption', 'story', 'post'],
  instagram: ['ig', 'reels', 'downloader', 'post', 'grid'],
  fb: ['facebook', 'reels', 'video', 'watch', 'downloader'],
  facebook: ['fb', 'reels', 'video'],
  reel: ['reels', 'instagram', 'youtube', 'facebook', 'shorts', 'video', 'download', 'mp4'],
  reels: ['instagram', 'youtube', 'facebook', 'shorts', 'video', 'download', 'mp4', 'downloader'],
  short: ['shorts', 'youtube', 'reels', 'video', 'downloader'],
  shorts: ['youtube', 'reels', 'video', 'downloader'],
  video: ['youtube', 'instagram', 'facebook', 'reels', 'shorts', 'downloader', 'mp4'],
  download: ['downloader', 'reels', 'youtube', 'instagram', 'facebook', 'mp4', 'mp3', 'svg', 'image'],
  downloader: ['download', 'reels', 'youtube', 'instagram', 'facebook', 'mp4', 'mp3'],
  mp3: ['audio', 'reels', 'youtube', 'sound', 'music', 'ripper'],
  mp4: ['video', 'reels', 'youtube', 'shorts', 'facebook', 'download'],
  b64: ['base64', 'encode', 'decode', 'converter'],
  base64: ['b64', 'encode', 'decode', 'image', 'string'],
  json: ['format', 'beautify', 'minify', 'validator', 'csv', 'yaml', 'parser'],
  calc: ['calculator', 'gst', 'sip', 'emi', 'loan', 'mortgage', 'compound', 'interest', 'discount'],
  calculator: ['calc', 'math', 'finance', 'gst', 'sip', 'tax'],
  gst: ['tax', 'calculator', 'vat', 'finance'],
  sip: ['mutual fund', 'investment', 'calculator', 'compound interest'],
  emi: ['loan', 'calculator', 'mortgage', 'interest'],
  pwd: ['password', 'generator', 'security', 'hash'],
  pass: ['password', 'generator', 'security'],
  password: ['pwd', 'security', 'generator', 'hash'],
  hash: ['sha256', 'md5', 'bcrypt', 'crypto', 'checksum', 'security'],
  qr: ['barcode', 'code', 'generator', 'scanner', 'wifi', 'url'],
  img: ['image', 'compressor', 'converter', 'png', 'jpg', 'webp', 'svg'],
  image: ['img', 'photo', 'compressor', 'converter', 'svg', 'palette'],
  svg: ['vector', 'icon', 'optimizer', 'viewer', 'svg to png'],
  css: ['gradient', 'shadow', 'glassmorphism', 'flexbox', 'grid', 'styling', 'border'],
  color: ['hex', 'rgb', 'hsl', 'palette', 'picker', 'contrast', 'gradient'],
  diff: ['compare', 'text', 'code', 'checker', 'cleaner'],
  sql: ['database', 'query', 'formatter', 'beautifier'],
  csv: ['excel', 'spreadsheet', 'table', 'json to csv', 'converter'],
  seo: ['robots', 'sitemap', 'schema', 'meta', 'open graph', 'keywords'],
  jwt: ['token', 'auth', 'decoder', 'security'],
  lorem: ['ipsum', 'placeholder', 'dummy text', 'generator'],
  ai: ['gemini', 'humanizer', 'assistant', 'writer', 'code explainer', 'prompt', 'smart'],
  gemini: ['ai', 'google', 'assistant', 'smart'],
  humanizer: ['ai', 'undetectable', 'bypass', 'paraphrase', 'rewrite'],
};

/**
 * Computes a relevance score for a tool against a user search query.
 * Higher score = higher ranking.
 */
export function scoreTool(tool: Tool, rawQuery: string): number {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return 0;

  const toolName = tool.name.toLowerCase();
  const toolDesc = tool.description.toLowerCase();
  const toolId = tool.id.toLowerCase();
  const toolTags = tool.tags.map((t) => t.toLowerCase());

  let score = 0;

  // 1. Exact Name match (Ultimate priority)
  if (toolName === query) return 1000;
  if (toolId === query) return 950;

  // 2. Name starts with query
  if (toolName.startsWith(query)) score += 300;
  else if (toolName.includes(query)) score += 150;

  // 3. Tool ID starts with / contains
  if (toolId.startsWith(query)) score += 200;
  else if (toolId.includes(query)) score += 100;

  // 4. Exact tag match
  if (toolTags.includes(query)) score += 180;
  else if (toolTags.some((t) => t.includes(query) || query.includes(t))) score += 90;

  // 5. Description matches
  if (toolDesc.includes(query)) score += 50;

  // 6. Popularity boost
  if (tool.isPopular) score += 25;

  // 7. Synonym & Alias expansion matching
  const tokens = query.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    // Check aliases
    const aliases = SEARCH_ALIASES[token] || [];
    for (const alias of aliases) {
      if (toolName.includes(alias)) score += 80;
      if (toolTags.some((t) => t.includes(alias))) score += 60;
      if (toolDesc.includes(alias)) score += 30;
    }

    // Token-level matching
    if (toolName.includes(token)) score += 40;
    if (toolTags.some((t) => t.includes(token))) score += 30;
    if (toolDesc.includes(token)) score += 15;
  }

  return score;
}

/**
 * Filters and ranks tools using smart weighted scoring.
 */
export function searchTools(
  tools: Tool[],
  query: string,
  categoryFilter: string = 'all',
  favorites: string[] = [],
  sortBy: 'recommended' | 'name-asc' | 'name-desc' | 'category' = 'recommended'
): Tool[] {
  const trimmed = query.trim().toLowerCase();

  const filtered = tools.filter((tool) => {
    // Category check
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'favorites') {
        if (!favorites.includes(tool.id)) return false;
      } else if (tool.category !== categoryFilter) {
        return false;
      }
    }

    // If no search query, match all within the category
    if (!trimmed) return true;

    // Score check
    const score = scoreTool(tool, trimmed);
    return score > 0;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    }

    // Default 'recommended'
    if (!trimmed) {
      // Default sort: Popular first, then alphabetical
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return a.name.localeCompare(b.name);
    }
    return scoreTool(b, trimmed) - scoreTool(a, trimmed);
  });
}

/**
 * Highlights matching search terms in a text string.
 */
export function highlightSearchText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;

  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span
            key={index}
            className="bg-amber-300 dark:bg-amber-500/30 text-slate-900 dark:text-amber-200 font-bold px-0.5 rounded"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
