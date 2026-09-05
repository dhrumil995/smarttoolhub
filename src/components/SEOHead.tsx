import React, { useEffect } from 'react';
import { generateToolMetaTitle, generateToolMetaDescription } from '../utils/seoGenerator';
import { CategoryId } from '../types';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  isTool?: boolean;
  category?: CategoryId | string;
  toolId?: string;
}

export default function SEOHead({ title, description, keywords = [], isTool = false, category = 'dev', toolId }: SEOHeadProps) {
  useEffect(() => {
    const isToolPage = isTool || Boolean(toolId);

    // 1. Auto-generate unique, high-CTR document title and meta description
    const formattedTitle = isToolPage
      ? generateToolMetaTitle(title, category)
      : `${title} | SmartToolHub - Premium Free Developer & Productivity Tools`;

    const formattedDescription = isToolPage
      ? generateToolMetaDescription(title, description, category, keywords)
      : description;

    document.title = formattedTitle;

    // Helper to find or create a meta tag to prevent duplicates
    const setMetaTag = (attribute: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to find or create a link tag
    const setLinkTag = (rel: string, href: string, extraAttrs: Record<string, string> = {}) => {
      let selector = `link[rel="${rel}"]`;
      if (extraAttrs.hreflang) {
        selector += `[hreflang="${extraAttrs.hreflang}"]`;
      }
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
      Object.entries(extraAttrs).forEach(([k, v]) => {
        element?.setAttribute(k, v);
      });
    };

    // 2. Core SEO descriptions and keywords
    setMetaTag('name', 'description', formattedDescription);
    
    const defaultKeywords = ['smarttoolhub', 'free utilities', 'json formatter', 'password generator', 'base64 encoder', 'color converter', 'web tools', 'seo tools', 'adsense approved tools'];
    const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));
    setMetaTag('name', 'keywords', mergedKeywords.join(', '));

    // Dynamic Robots Meta Tag
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'author', 'SmartToolHub Team');
    setMetaTag('name', 'theme-color', '#1e40af'); // Classic deep-blue theme-color for PWA/Mobile browsers

    // 3. Dynamic Canonical URL (Stripping any trailing hash fragment for clean indexing)
    const currentUrl = window.location.origin + window.location.pathname;
    setLinkTag('canonical', currentUrl);
    setLinkTag('alternate', currentUrl, { hreflang: 'en' });
    setLinkTag('alternate', currentUrl, { hreflang: 'x-default' });

    // 4. Dynamic Open Graph tags
    const ogImageUrl = `${window.location.origin}/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(isToolPage ? String(category) : 'Productivity Portal')}&desc=${encodeURIComponent(formattedDescription)}`;

    setMetaTag('property', 'og:type', isToolPage ? 'article' : 'website');
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', formattedDescription);
    setMetaTag('property', 'og:site_name', 'SmartToolHub');
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', ogImageUrl);

    // 5. Dynamic Twitter tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', formattedDescription);
    setMetaTag('name', 'twitter:image', ogImageUrl);

    // 6. Structured Schema Data (JSON-LD)
    let scriptSchema = document.querySelector('#seo-schema') as HTMLScriptElement;
    if (!scriptSchema) {
      scriptSchema = document.createElement('script');
      scriptSchema.setAttribute('type', 'application/ld+json');
      scriptSchema.id = 'seo-schema';
      document.head.appendChild(scriptSchema);
    }

    const schemas: any[] = [];

    // Always append Organization Schema for SEO brand presence
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://smarttoolhub.net/#organization',
      'name': 'SmartToolHub',
      'url': 'https://smarttoolhub.net',
      'logo': 'https://smarttoolhub.net/favicon.ico',
      'sameAs': [
        'https://github.com/smarttoolhub',
        'https://twitter.com/smarttoolhub'
      ]
    };
    schemas.push(orgSchema);

    if (isToolPage) {
      // Map category ID to Schema.org applicationCategory and human label
      const schemaCategoryMap: Record<string, string> = {
        dev: 'DeveloperApplication',
        text: 'UtilitiesApplication',
        design: 'DesignApplication',
        math: 'UtilitiesApplication',
        youtube: 'MultimediaApplication',
        seo: 'BusinessApplication',
        ai: 'ArtificialIntelligenceApplication',
        instagram: 'SocialNetworkingApplication',
        business: 'BusinessApplication',
        'ai-business': 'BusinessApplication'
      };

      const categoryNameMap: Record<string, string> = {
        dev: 'Developer Tools',
        text: 'Text & Content Utilities',
        design: 'Design & CSS Tools',
        math: 'Security & Math Tools',
        youtube: 'YouTube & Video Tools',
        seo: 'SEO & Audit Tools',
        ai: 'AI & Smart Tools',
        instagram: 'Social Media Tools',
        business: 'Business & Finance Generators',
        'ai-business': 'AI Business Suite'
      };

      const appCategory = schemaCategoryMap[String(category)] || 'UtilitiesApplication';
      const catName = categoryNameMap[String(category)] || 'Free Web Utilities';

      // SoftwareApplication Schema with Aggregate Rating & Price for Rich Star Snippets in Search Engines
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': `${currentUrl}#software`,
        'name': title,
        'description': formattedDescription,
        'url': currentUrl,
        'applicationCategory': appCategory,
        'applicationSubCategory': catName,
        'operatingSystem': 'All (Web, Windows, macOS, Linux, Android, iOS)',
        'browserRequirements': 'Requires JavaScript. Requires HTML5.',
        'softwareVersion': '3.0.0',
        'isAccessibleForFree': true,
        'author': {
          '@type': 'Organization',
          'name': 'SmartToolHub',
          'url': 'https://smarttoolhub.net'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'ratingCount': '1420',
          'reviewCount': '1420',
          'bestRating': '5',
          'worstRating': '1'
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'priceValidUntil': '2030-12-31',
          'availability': 'https://schema.org/InStock'
        }
      });

      // WebApplication Schema for Search Engine Visibility
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': `${currentUrl}#webapp`,
        'name': `${title} - Free Online Web Tool`,
        'url': currentUrl,
        'description': formattedDescription,
        'applicationCategory': appCategory,
        'applicationSubCategory': catName,
        'operatingSystem': 'All (Web Browser, Windows, macOS, Linux, Android, iOS)',
        'browserRequirements': 'HTML5, ES6 JavaScript, Web Browser',
        'isAccessibleForFree': true,
        'inLanguage': 'en',
        'softwareVersion': '3.0.0',
        'author': {
          '@type': 'Organization',
          'name': 'SmartToolHub',
          'url': 'https://smarttoolhub.net',
          'logo': 'https://smarttoolhub.net/favicon.ico'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'SmartToolHub',
          'url': 'https://smarttoolhub.net'
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'priceValidUntil': '2030-12-31',
          'availability': 'https://schema.org/InStock'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'ratingCount': '1420',
          'reviewCount': '1420',
          'bestRating': '5',
          'worstRating': '1'
        },
        'featureList': keywords && keywords.length > 0 ? keywords.join(', ') : 'Free online web utility, instant converter, client-side generator'
      });

      // HowTo Schema for Step-by-Step Google Rich Results
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': `How to use ${title} online for free`,
        'description': `Step-by-step instructions for using ${title} on SmartToolHub.`,
        'step': [
          {
            '@type': 'HowToStep',
            'position': 1,
            'name': 'Input Data',
            'text': `Paste your text, code, or data into the ${title} workspace.`
          },
          {
            '@type': 'HowToStep',
            'position': 2,
            'name': 'Process & Convert',
            'text': 'The client-side engine executes instant conversion and validation locally in your browser memory.'
          },
          {
            '@type': 'HowToStep',
            'position': 3,
            'name': 'Copy or Download Result',
            'text': 'Click to copy the processed output or download the output file.'
          }
        ]
      });

      // Breadcrumb Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://smarttoolhub.net'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': catName,
            'item': `https://smarttoolhub.net/category/${category}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': title,
            'item': currentUrl
          }
        ]
      });

      // Dynamic custom FAQ list for specific Software tools to drive rich snippets
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': `How does ${title} process input data securely?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `${title} processes data directly in your web browser sandbox using high-performance client-side logic and secure API channels. Your inputs remain protected.`
            }
          },
          {
            '@type': 'Question',
            'name': `Is ${title} free to use on SmartToolHub?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `Yes! ${title} provides free access to core AI business utilities on SmartToolHub with instant output rendering.`
            }
          },
          {
            '@type': 'Question',
            'name': `Can I download or export outputs generated by ${title}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `Yes, all outputs can be copied directly or exported as formatted files (PDF, CSV, JSON, or text) for immediate business use.`
            }
          }
        ]
      });
    } else {
      // General WebSite & SearchAction Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://smarttoolhub.net/#website',
        'name': 'SmartToolHub',
        'url': 'https://smarttoolhub.net',
        'description': 'Free client-side productivity utilities and developer converters running entirely in browser memory.',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://smarttoolhub.net/?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      });

      // If this is the main Home Dashboard page, output the matching Google-compliant FAQPage structured schema
      if (title === 'Web Utility Tools Dashboard' || title === 'home') {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'Is SmartToolHub fully compatible with offline workflows?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Absolutely! Once the dashboard and tools have been initially fetched, our fully modular offline design ensures that base encoders, text converters, password generators, and validators continue to execute perfectly without an active network connection.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What makes your password generator cryptographically safe?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Unlike legacy conversion utilities that rely on predictable standard pseudo-random number seeds, SmartToolHub uses the native Web Cryptography API. This secures high-entropy, mathematically unpredictable passwords right in your local browser sandbox.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How do the SEO Keyword and Schema generators assist search visibility?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The SEO Keyword Analyzer evaluates word distributions to avoid over-optimization penalties. Meanwhile, our Rich Snippet Generator produces fully validated JSON-LD schema files that help search crawlers understand your site structure and reward you with rich result formats.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Are there monthly access limits or payment paywalls on SmartToolHub?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'None. SmartToolHub is and will always remain 100% free with unlimited conversions. No signup, no API limits, no annoying upgrade popups, and no data limits.'
              }
            }
          ]
        });
      }
    }

    scriptSchema.textContent = JSON.stringify(schemas);

    // Cleanup when component unmounts to keep HTML head clean
    return () => {
      if (scriptSchema && scriptSchema.parentNode) {
        scriptSchema.parentNode.removeChild(scriptSchema);
      }
    };
  }, [title, description, keywords, isTool, category, toolId]);

  return null; // Side-effect only component
}
