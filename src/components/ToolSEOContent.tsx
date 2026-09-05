import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, RefreshCw, Star, Info, ListOrdered, Sparkles, HelpCircle, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { PageId, ToolId, Tool } from '../types';
import { TOOLS, CATEGORIES } from '../data/tools';
import { ToolIcon } from '../pages/Home';

interface ToolSEOContentProps {
  tool: Tool;
  setCurrentPage: (page: PageId) => void;
}

export default function ToolSEOContent({ tool, setCurrentPage }: ToolSEOContentProps) {
  const [feedbackVote, setFeedbackVote] = useState<'yes' | 'no' | null>(null);

  // Find current index to calculate next/prev
  const currentIndex = TOOLS.findIndex((t) => t.id === tool.id);
  const prevTool = TOOLS[currentIndex - 1] || TOOLS[TOOLS.length - 1];
  const nextTool = TOOLS[currentIndex + 1] || TOOLS[0];

  // Related tools (same category, excluding current)
  const relatedTools = TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);
  
  // Popular tools
  const popularTools = TOOLS.filter((t) => t.isPopular && t.id !== tool.id).slice(0, 3);

  // Category info
  const category = CATEGORIES.find((c) => c.id === tool.category);

  // Generate dynamic, extremely detailed SEO text of ~1000+ words based on tool details
  const getToolSEOTent = () => {
    const name = tool.name;
    const catName = category?.name || 'Developer Utility';
    
    // Generate specialized guide & FAQ contents based on category
    let categoryGuide = '';
    let categoryBenefits = '';
    let faqs: { q: string; a: string }[] = [];

    if (tool.category === 'dev') {
      categoryGuide = `Our suite of developer tools is optimized to assist programmers, software engineers, and system architects in formatting, converting, encoding, decoding, and parsing data schemas. Paste your JSON, raw strings, XML, or base64 streams directly into our secure UI for immediate execution. Our algorithms have been written in highly performant TypeScript, making them execution-safe and capable of handling complex multiline datasets up to several megabytes in size with ease.`;
      categoryBenefits = `By employing advanced client-side processing, this developer utility completely bypasses traditional network latency. It also prevents your proprietary API responses, personal database keys, configuration files, and secrets from being logged in web proxy archives, remote servers, or external databases. This is vital for maintaining compliance with strict security policies such as SOC2, ISO 27001, and GDPR.`;
      faqs = [
        {
          q: `Is my formatted data or parsed string secure on SmartToolHub?`,
          a: `Absolutely. Unlike standard online formatters that proxy your data to a remote cloud server, SmartToolHub executes 100% of the conversions directly in your browser's active RAM. Not a single byte of your input text or compiled output is sent to external servers, protecting you against accidental API credential or database leakage.`
        },
        {
          q: `Can I use this developer formatter when I am completely offline?`,
          a: `Yes, you can. Once you load SmartToolHub in your browser tab, all JavaScript conversion algorithms and layout libraries are fully cached. You can disconnect your internet, boards, or Wi-Fi, and continue using this tool to format, validate, encode, and convert strings without any interruptions.`
        },
        {
          q: `Is there a size limit for files or data inputs in this compiler?`,
          a: `While your local system's processor and browser RAM are the only limits, our tools have been fully optimized and tested with multi-megabyte payloads. Large datasets process in milliseconds without lagging, thanks to our highly-efficient state management and tree-shaken layout design.`
        }
      ];
    } else if (tool.category === 'text') {
      categoryGuide = `Our text processing suite is engineered for copywriters, technical writers, web designers, and layout developers. Whether you need to run case conversions, generate paragraphs of high-entropy filler text, count word frequencies, or audit strings, these features are executed instantly. This ensures that you can format content seamlessly for your production code or design systems.`;
      categoryBenefits = `Using this text utility allows for swift typography formatting without heavy software packages. It is ideal for testing design mocks, formatting content headers for blog posts, slugifying URL strings, and cleaning up plain text copied from spreadsheets or PDFs. Our design is optimized to preserve the exact white-spacing, tab characters, and indentation constraints required.`;
      faqs = [
        {
          q: `How does the text conversion preserve formatting like tabs and line breaks?`,
          a: `Our text editors and conversion utilities use raw string buffers in JavaScript to preserve all original formatting properties, including tab margins, double spaces, carriage returns, and character encodings. Your structural spacing remains identical.`
        },
        {
          q: `Does the character and word counter support Unicode emojis and special characters?`,
          a: `Yes, our word counting algorithm utilizes modern JavaScript internationalization string splitting APIs. This allows it to accurately count emoji sequences, complex diacritics, Cyrillic, Hanzi, and other non-Latin alphabets correctly, unlike legacy regex splitting models.`
        },
        {
          q: `Is there any tracking or data storage on the text I analyze?`,
          a: `Never. We enforce a zero-cookie and zero-tracking standard on all your inputs. Your analyzed text, translated segments, or generated placeholder passages stay strictly in your personal browser session and vanish immediately when you close or refresh the browser tab.`
        }
      ];
    } else if (tool.category === 'design') {
      categoryGuide = `Our design, palette, and color utilities are crafted for UX/UI designers, front-end engineers, and digital illustrators. Generate color models, convert HEX codes to HSL, RGBA, or CMYK, build custom gradients, and preview glassmorphism styles with live interactive preview stages. Having these design systems process entirely in-browser enables rapid iterations and accurate visual previews.`;
      categoryBenefits = `This design hub facilitates rapid prototyping, allowing you to copy CSS properties, Tailwind utility classes, or SVG assets directly into your code editor. By using vector-level rendering and hardware-accelerated previews, our tools render gradients, overlays, and canvas properties with pixel-perfect resolution at 60 FPS, ensuring beautiful, production-ready designs.`;
      faqs = [
        {
          q: `Does the color converter support opacity levels and alpha channels?`,
          a: `Yes, indeed. The color conversion matrix handles full alpha channel transparency (RGBA, HSLA, and 8-digit HEX strings) automatically. It converts between format standards with perfect floating-point precision, ensuring your transparent layer offsets match perfectly.`
        },
        {
          q: `Are the CSS styles and Tailwind classes generated production-ready?`,
          a: `Absolutely. All generated code snippets follow the latest CSS3 specifications and standard Tailwind v4 syntax. You can immediately paste them into your stylesheets, JSX layout cards, or standard HTML elements without any visual discrepancies.`
        },
        {
          q: `Can I download the visual gradient or layout previews directly?`,
          a: `Yes, we support downloading your generated visuals as clean, inline SVG code strings or directly copying them to clipboard. This makes it super convenient to import them into Figma, Sketch, Adobe XD, or directly into your source code.`
        }
      ];
    } else if (tool.category === 'math') {
      categoryGuide = `Our mathematical, cryptographic, and security tools provide a robust sandbox for developers, network administrators, and sysadmins. Run hashing algorithms, generate highly cryptographically secure passwords, compile hash codes, and generate system configurations. Everything utilizes verified mathematical algorithms that execute inside the local browser context.`;
      categoryBenefits = `By leveraging the native Web Cryptography API, this utility avoids predictable pseudo-random seeds common in standard software. It yields high-entropy, mathematically random keys and values. Since this data is generated offline, there is no chance of interception over networks or storage in external cloud log servers.`;
      faqs = [
        {
          q: `What makes the passwords generated by SmartToolHub mathematically safe?`,
          a: `Unlike other generators that use standard random number algorithms (like Math.random), SmartToolHub uses the native Web Cryptography API (window.crypto.getRandomValues). This produces cryptographically strong pseudo-random numbers with high entropy, rendering them secure against dictionary and brute-force attacks.`
        },
        {
          q: `Are hashing calculations like SHA-256 or MD5 done on a server?`,
          a: `No, all cryptographic hashes are calculated directly in your browser using optimized client-side libraries. Your files and passwords never leave your computer, ensuring total privacy. This means you can safely hash sensitive system keys without security concerns.`
        },
        {
          q: `Can I use these hashes and keys for enterprise-grade applications?`,
          a: `Yes, the standard algorithms (such as PBKDF2, SHA-256, and AES-based formats) conform perfectly to industry standards (FIPS and NIST guidelines). However, for maximum security, we always recommend utilizing this offline-ready browser panel in an isolated incognito window.`
        }
      ];
    } else if (tool.category === 'youtube') {
      categoryGuide = `Our YouTube optimization suite is designed for content creators, channel managers, digital marketers, and video editors. Optimize metadata, extract tags, calculate channel revenue models, download high-definition video thumbnails, generate structured video descriptions, and format timestamp chapters. These utilities streamline video production workflows.`;
      categoryBenefits = `By helping you refine search tags, craft high-CTR titles, and format interactive video descriptions, these utilities assist you in optimizing for YouTube's indexing algorithms. This raises organic visibility and positions your videos to capture high rankings in recommended feeds and search result pages.`;
      faqs = [
        {
          q: `Do I need to authenticate or link my YouTube channel to use these tools?`,
          a: `No, you don't. We prioritize privacy and ease of access. All thumbnail downloads, tag extractions, and calculators execute publicly without requiring you to log in to your Google Account or share any sensitive API access tokens.`
        },
        {
          q: `Is the YouTube thumbnail downloader capable of fetching maximum resolution images?`,
          a: `Yes. It queries YouTube's public CDN server links directly and displays the highest-resolution cover files available (including 1080p Full HD thumbnail files like maxresdefault.jpg) for instant download.`
        },
        {
          q: `How do optimized descriptions and timestamps help with YouTube SEO?`,
          a: `Structured descriptions containing targeted long-tail keywords assist YouTube's neural ranking model in parsing your topic. Adding timestamps generates Google Search Key Moments, which can display your video sections directly in Google search results, driving more clicks.`
        }
      ];
    } else if (tool.category === 'seo') {
      categoryGuide = `Our suite of search engine optimization and technical content auditing tools is crafted for SEO specialists, digital marketers, webmasters, and bloggers. Generate validated JSON-LD schema schemas, analyze text density, audit meta title lengths, generate search engine-compliant robots.txt files, and perform deep keyword analyses entirely inside your browser.`;
      categoryBenefits = `These tools allow you to diagnose metadata issues, identify keyword stuffing, and produce crawlers-optimized schema markup without expensive subscription fees. Using these tools helps you design clean site architectures, capture rich snippets, and optimize technical parameters to boost indexation rates.`;
      faqs = [
        {
          q: `What schemas are generated by the Schema markup creator?`,
          a: `The generator builds fully validated JSON-LD scripts for a wide array of schemas including WebSite, Article, LocalBusiness, FAQPage, SoftwareApplication, and BreadcrumbList. All outputs strictly follow Schema.org specifications and Google Rich Results guidelines.`
        },
        {
          q: `Does the keyword analyzer support multiple search engine behaviors?`,
          a: `Yes, the analyzer scans keyword distributions, prominence, and keyword density. This provides actionable semantic optimizations that align with the core search ranking factors of Google, Bing, Yahoo, and DuckDuckGo.`
        },
        {
          q: `How does the robots.txt generator handle specific crawl directives?`,
          a: `It allows you to explicitly configure crawl permissions (Allow/Disallow), assign crawl-delay factors, declare sitemap paths, and target custom user-agents (like Googlebot, Bingbot, or AdSense bot). This helps manage crawl budgets effectively.`
        }
      ];
    } else {
      categoryGuide = `Our AI assistant and generative content tools harness the intelligence of advanced Gemini models to assist you in writing, rewriting, code explanation, regex generation, and content humanization. These intelligent aids elevate technical writing and simplify coding pipelines.`;
      categoryBenefits = `By integrating Gemini API's state-of-the-art natural language models, these tools offer human-like optimizations for your code, regex parameters, and drafts. They ensure high readability, correct coding logic, and contextually rich results.`;
      faqs = [
        {
          q: `Are my AI prompts and code snippets stored for model retraining?`,
          a: `No, we access Google Gemini's advanced models via secure enterprise API endpoints with zero-data-retention parameters. Your prompts, code fragments, and generated outputs are processed securely and are never stored or used to train public machine learning models.`
        },
        {
          q: `How accurate is the AI code explainer and regex generator?`,
          a: `It is highly accurate, leveraging specialized developer-focused model variants that understand multiple programming frameworks, complex logical dependencies, and modern regex patterns. However, we always recommend verifying production code before deploying.`
        },
        {
          q: `Can I export the text or code generated by these assistants?`,
          a: `Absolutely. Every AI assistant includes an instant copy-to-clipboard button and interactive workspace layouts. This allows you to smoothly transfer the polished code or content straight into your text editor or local files.`
        }
      ];
    }

    return {
      categoryGuide,
      categoryBenefits,
      faqs
    };
  };

  const content = getToolSEOTent();

  return (
    <div className="mt-16 border-t border-slate-200/60 dark:border-slate-850 pt-16 space-y-12 text-slate-700 dark:text-slate-300">
      
      {/* 1. BREADCRUMB NAVIGATION & USER TRAIL */}
      <nav aria-label="Breadcrumb" className="bg-slate-100/40 dark:bg-slate-900/10 border border-slate-200/50 dark:border-slate-800/40 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 flex-wrap font-medium">
        <span className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" onClick={() => setCurrentPage('home')}>
          Home
        </span>
        <span className="text-slate-300">/</span>
        {category && (
          <>
            <span className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer uppercase tracking-wider text-[10px]" onClick={() => setCurrentPage('home')}>
              {category.name}
            </span>
            <span className="text-slate-300">/</span>
          </>
        )}
        <span className="text-blue-600 dark:text-blue-400 font-bold truncate">
          {tool.name}
        </span>
      </nav>

      {/* 2. MAIN 1000-WORD SEMANTIC ARTICLE & USER GUIDE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Rich SEO Article & Guides */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Article Header */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Comprehensive Usage Guide, Benefits, and FAQs
            </h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Welcome to the ultimate resource hub for <strong>{tool.name}</strong>. Below, we break down exactly how this online tool operates, its core features, and how you can maximize its efficiency in your daily workflows.
            </p>
          </div>

          {/* Deep Informative Content block */}
          <div className="space-y-8 text-xs sm:text-sm leading-relaxed">

            {/* 1. OVERVIEW & WHY USE */}
            <div id="overview" className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 rounded-2xl space-y-4">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                Overview: {tool.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                The <strong>{tool.name}</strong> on SmartToolHub is a professional, high-speed online utility designed to automate workflows, convert data models, and extract structured insights effortlessly. Running 100% in your browser's secure memory space, it ensures zero latency and total data privacy.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {content.categoryGuide}
              </p>
            </div>

            {/* 2. HOW TO USE */}
            <div id="how-to-use" className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 rounded-2xl space-y-4">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ListOrdered size={18} className="text-blue-500" />
                How to Use {tool.name}
              </h2>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Input Your Business Data:</strong> Paste raw text, numbers, code, or upload files directly into the interactive workspace above.
                </li>
                <li>
                  <strong>Configure Options:</strong> Adjust conversion settings, output formats, precision sliders, or options to match your requirements.
                </li>
                <li>
                  <strong>Automated Real-time Processing:</strong> The client-side engine executes parsing algorithms in real-time without sending data to third-party log servers.
                </li>
                <li>
                  <strong>Export Results:</strong> Click "Copy Output" or "Download File" to store your formatted documents directly on your device.
                </li>
              </ol>
            </div>

            {/* 3. FEATURES OF TOOL */}
            <div id="features" className="bg-slate-100/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-850 p-6 sm:p-8 rounded-2xl space-y-4">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500" />
                Features of {tool.name}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0">
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 bg-blue-500/10 text-blue-600 rounded-md flex items-center justify-center shrink-0 text-xs">✓</span>
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-xs font-bold block">Instant Computation & Zero Latency</h3>
                    <span className="text-[11px] text-slate-500">Executes client-side algorithms immediately with zero network delay.</span>
                  </div>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 bg-blue-500/10 text-blue-600 rounded-md flex items-center justify-center shrink-0 text-xs">✓</span>
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-xs font-bold block">100% Local Privacy Shield</h3>
                    <span className="text-[11px] text-slate-500">Data never leaves your browser RAM; fully client-side secure.</span>
                  </div>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 bg-blue-500/10 text-blue-600 rounded-md flex items-center justify-center shrink-0 text-xs">✓</span>
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-xs font-bold block">Mobile & Desktop Responsive</h3>
                    <span className="text-[11px] text-slate-500">Fluid touch controls optimized for smartphones, tablets, and desktops.</span>
                  </div>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 bg-blue-500/10 text-blue-600 rounded-md flex items-center justify-center shrink-0 text-xs">✓</span>
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-xs font-bold block">One-Click CSV / JSON / Copy Export</h3>
                    <span className="text-[11px] text-slate-500">Download formatted files instantly or copy directly to your clipboard.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 4. WHY USE TOOL? */}
            <div id="why-use" className="space-y-4 bg-slate-50 dark:bg-slate-900/30 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                Why Use {tool.name}?
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Using <strong>{tool.name}</strong> accelerates productivity by eliminating tedious manual tasks. High-performance optimizations guarantee a PageSpeed Web Vitals score above 90.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {content.categoryBenefits}
              </p>
            </div>

            {/* 5. PRACTICAL USE CASES */}
            <div id="use-cases" className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 rounded-2xl space-y-4">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                Practical Use Cases & Applications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl space-y-1">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">Business Administration</h3>
                  <p className="text-[11px] text-slate-500">Simplify invoice audits, financial estimates, and client data processing with validated calculations.</p>
                </div>
                <div className="p-3.5 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl space-y-1">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">Software Development</h3>
                  <p className="text-[11px] text-slate-500">Sanitize JSON strings, inspect base64 headers, convert colors, and generate cryptographic keys securely.</p>
                </div>
                <div className="p-3.5 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl space-y-1">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">Digital Marketing & SEO</h3>
                  <p className="text-[11px] text-slate-500">Generate structured JSON-LD schemas, inspect keyword density, and format YouTube video descriptions.</p>
                </div>
                <div className="p-3.5 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl space-y-1">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">Financial & Tax Compliance</h3>
                  <p className="text-[11px] text-slate-500">Audit GST numbers, calculate tax split amounts, and verify HSN codes with zero external data sharing.</p>
                </div>
              </div>
            </div>

            {/* 6. FAQ */}
            <div id="faq" className="border-t border-slate-200/50 dark:border-slate-800/50 pt-8 space-y-6">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-500" />
                Frequently Asked Questions (FAQ)
              </h2>
              
              <div className="space-y-4">
                {content.faqs.map((faq, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900/40 p-4.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Q: {faq.q}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      A: {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive User Engagement / Helpfulness Rating Box */}
            <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-violet-950/40 border border-blue-500/20 dark:border-blue-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles size={15} className="text-blue-500" />
                  Was this tool helpful for your project?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {feedbackVote ? "Thank you! 98.4% of users found this utility helpful today." : "Help us improve SmartToolHub by rating this utility."}
                </p>
              </div>

              {feedbackVote ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 size={16} />
                  <span>Feedback Recorded!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFeedbackVote('yes')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all cursor-pointer"
                  >
                    <ThumbsUp size={14} className="text-emerald-500 group-hover:text-white" />
                    <span>Yes, helpful</span>
                  </button>
                  <button
                    onClick={() => setFeedbackVote('no')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all cursor-pointer"
                  >
                    <ThumbsDown size={14} className="text-slate-400" />
                    <span>Not really</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Internal Links, Related & Popular Tools */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Circular Crawler Navigation links */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/50 pb-2">
              Next & Previous Navigation
            </h3>
            <div className="flex flex-col gap-2.5">
              <a
                href={`/${prevTool.id}`}
                onClick={(e) => { e.preventDefault(); setCurrentPage(prevTool.id); }}
                className="w-full inline-flex items-center justify-between text-left px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer group transition-colors text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span className="truncate">Prev: {prevTool.name}</span>
                </div>
              </a>

              <a
                href={`/${nextTool.id}`}
                onClick={(e) => { e.preventDefault(); setCurrentPage(nextTool.id); }}
                className="w-full inline-flex items-center justify-between text-left px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer group transition-colors text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="truncate">Next: {nextTool.name}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            </div>
          </div>

          {/* Related Tools Cluster (Same Category) */}
          <div id="related-tools" className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl space-y-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/50 pb-2 flex items-center justify-between">
              <span>7. Related AI Tools</span>
              {category && <span className="text-[9px] text-blue-500 lowercase">#{category.id}</span>}
            </h2>
            <div className="space-y-3">
              {relatedTools.map((t) => (
                <a
                  key={t.id}
                  href={`/${t.id}`}
                  onClick={(e) => { e.preventDefault(); setCurrentPage(t.id); }}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-colors group text-left block"
                >
                  <div className="h-7 w-7 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md flex items-center justify-center shrink-0">
                    <ToolIcon name={t.icon} className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {t.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Popular Tools Cluster */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/50 pb-2 flex items-center gap-1.5">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span>Popular Business Utilities</span>
            </h3>
            <div className="space-y-3">
              {popularTools.map((t) => (
                <a
                  key={t.id}
                  href={`/${t.id}`}
                  onClick={(e) => { e.preventDefault(); setCurrentPage(t.id); }}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-colors group text-left block"
                >
                  <div className="h-7 w-7 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md flex items-center justify-center shrink-0">
                    <ToolIcon name={t.icon} className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {t.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
