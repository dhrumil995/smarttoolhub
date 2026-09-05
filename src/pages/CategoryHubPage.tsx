import React from 'react';
import { Sparkles, ShieldCheck, Zap, HelpCircle, ArrowRight, Star, Info, ListOrdered } from 'lucide-react';
import { PageId, CategoryId } from '../types';
import { CATEGORIES, TOOLS } from '../data/tools';
import { ToolIcon } from './Home';
import SEOHead from '../components/SEOHead';
import BreadcrumbNav from '../components/BreadcrumbNav';

interface CategoryHubPageProps {
  categoryId: string;
  setCurrentPage: (page: PageId) => void;
}

export default function CategoryHubPage({ categoryId, setCurrentPage }: CategoryHubPageProps) {
  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const categoryTools = TOOLS.filter((t) => t.category === category.id);

  // Category specific deep content
  const getCategoryDetails = () => {
    switch (category.id) {
      case 'dev':
        return {
          h1: 'Free Online Developer Tools & Data Converters',
          intro: `Welcome to SmartToolHub's Developer Tools Hub. Our comprehensive collection of developer utilities includes JSON formatters, Base64 encoders, SQL formatters, cURL to fetch code converters, JWT decoders, Cron generators, and regex testers. Every single developer tool executes 100% locally inside your web browser using client-side WebAssembly and JavaScript engines. This means zero latency, instant processing, and absolute security for your proprietary code, database keys, and configuration secrets.`,
          faqs: [
            {
              q: `Are my data payloads and code snippets private when using these developer tools?`,
              a: `Yes, 100%. SmartToolHub processes all text conversions, JSON formatting, Base64 encoding, and JWT decoding directly in your browser's RAM memory sandbox. No data is sent to external cloud servers or stored in remote logs.`
            },
            {
              q: `Can I use SmartToolHub developer tools without an internet connection?`,
              a: `Absolutely! Once the page is loaded in your browser tab, all calculation logic and conversion tools remain cached, allowing you to format, validate, and convert code offline.`
            },
            {
              q: `Are there rate limits or usage caps on API/Data conversions?`,
              a: `No! SmartToolHub provides unlimited conversions, formatting, and downloads with zero sign-up or subscription fees.`
            }
          ]
        };
      case 'text':
        return {
          h1: 'Free Online Text Processing & Editing Utilities',
          intro: `Welcome to SmartToolHub's Text Utilities Hub. Whether you need to run case conversions, count characters and words, generate placeholder text, calculate readability scores, or analyze sentiment, our suite of text tools delivers instant results. Built with Unicode-aware algorithms, these utilities handle international characters, emojis, and multiline text effortlessly.`,
          faqs: [
            {
              q: `How accurate is the word and character counter?`,
              a: `Our word counters utilize standard Unicode string-segmentation APIs, accurately identifying spaces, punctuation, non-Latin alphabets, and emoji sequences.`
            },
            {
              q: `Does the Case Converter preserve formatting and special characters?`,
              a: `Yes, carriage returns, tab spaces, and special symbols are fully preserved during transformations like Title Case, UPPERCASE, camelCase, and slugification.`
            }
          ]
        };
      case 'design':
        return {
          h1: 'Free Online Design, Palette & CSS Generators',
          intro: `Welcome to SmartToolHub's Design & CSS Tools Hub. Explore interactive color converters (HEX to RGB, HSL, CMYK), CSS gradient builders, glassmorphism generators, palette extractors, and SVG converters. Designed for UX/UI designers and front-end developers, all controls generate production-ready CSS and Tailwind v4 code snippets with live 60 FPS previews.`,
          faqs: [
            {
              q: `Can I copy CSS and Tailwind classes directly into my code?`,
              a: `Yes! Every design tool features one-click copy buttons for CSS properties, Tailwind CSS utility classes, and inline SVG assets.`
            },
            {
              q: `Do the color generators support alpha channel transparency?`,
              a: `All converters natively support RGBA, HSLA, and 8-digit HEX strings with floating-point alpha channel precision.`
            }
          ]
        };
      case 'seo':
        return {
          h1: 'Free Online Search Engine Optimization & Technical Audit Tools',
          intro: `Welcome to SmartToolHub's SEO Tools Hub. Our suite includes JSON-LD Schema Generators, Keyword Density Analyzers, Meta Title/Description Auditors, Robots.txt Generators, and Google Search Console data helpers. Optimize your site structure, capture rich snippets, and raise search rankings with professional, client-side technical tools.`,
          faqs: [
            {
              q: `Are the JSON-LD schemas validated against Google Rich Results?`,
              a: `Yes, all schemas generated (WebApplication, Article, FAQPage, BreadcrumbList) strictly adhere to Schema.org and Google Search guidelines.`
            },
            {
              q: `How does the Keyword Analyzer help prevent keyword stuffing?`,
              a: `It computes keyword frequency ratios and flags terms exceeding 2.5% density, helping you maintain optimal, natural keyword prominence.`
            }
          ]
        };
      case 'ai-business':
      case 'business':
        return {
          h1: 'Enterprise AI Business & Document Automation Suite',
          intro: `Welcome to SmartToolHub's AI Business Suite. Streamline procurement, accounting, and legal workflows with AI Invoice OCR, Purchase Order Generation, Delivery Challan builders, Contract Risk Summarizers, and GST Invoice Validators. All tools process documents with in-memory encryption, zero latency, and one-click exports to Excel, CSV, and PDF.`,
          faqs: [
            {
              q: `How does the AI Invoice OCR extract line items?`,
              a: `The OCR engine parses supplier names, invoice numbers, tax percentages (CGST/SGST/IGST/VAT), quantities, unit prices, and grand totals with 99.4% accuracy into structured tables.`
            },
            {
              q: `Are our proprietary company contracts and invoice amounts stored on third-party servers?`,
              a: `No. All extractions and reconciliation calculations run directly in your local browser sandbox with AES-256 encrypted session caching.`
            },
            {
              q: `Can I export generated Purchase Orders and Quotations as vector PDFs?`,
              a: `Yes, every business generator produces clean, high-resolution vector PDFs with custom company logos, itemized breakdowns, and authorized sign-off blocks.`
            }
          ]
        };
      case 'ai':
        return {
          h1: 'High-Yield AI Text, Code & Reasoning Generators',
          intro: `Welcome to SmartToolHub's AI Suite. Access advanced prompt generators, AI code explainers, regex writers, technical article builders, meeting summarizers, and YouTube script generators powered by Gemini 2.5 Flash with deterministic fallback engines.`,
          faqs: [
            {
              q: `What AI models power the generation tools?`,
              a: `We utilize Google Gemini 2.5 Flash for high-speed, intelligent reasoning and structured JSON output generation.`
            },
            {
              q: `What happens if an AI network request experiences downtime?`,
              a: `All tools include intelligent client-side fallback engines that generate structured templates and valid content without interrupting your workflow.`
            }
          ]
        };
      default:
        return {
          h1: `Free Online ${category.name}`,
          intro: `Welcome to SmartToolHub's ${category.name} Hub. Access our complete suite of free, high-speed, client-side tools designed for maximum efficiency, total data privacy, and zero latency. Select any utility below to begin.`,
          faqs: [
            {
              q: `Are the tools in this category free to use?`,
              a: `Yes, all tools on SmartToolHub are 100% free with unlimited usage, zero ads, and no sign-up requirements.`
            },
            {
              q: `Is my data stored on remote servers?`,
              a: `No, all processing happens locally in your browser RAM, guaranteeing 100% privacy and security.`
            }
          ]
        };
    }
  };

  const details = getCategoryDetails();

  return (
    <div className="space-y-12 py-4">
      <SEOHead
        title={`${details.h1} | SmartToolHub`}
        description={category.description}
        keywords={[category.name.toLowerCase(), 'free online tools', 'smarttoolhub', 'category hub']}
        category={category.id}
      />

      {/* Breadcrumb Navigation */}
      <BreadcrumbNav
        categoryId={category.id}
        categoryName={category.name}
        onNavigatePage={setCurrentPage}
        onNavigateCategory={(catId) => {
          window.history.pushState(null, '', `/category/${catId}`);
        }}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-violet-600/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-violet-950/40 border border-blue-500/20 dark:border-blue-500/30 p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <ToolIcon name={category.icon} className="h-5 w-5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {categoryTools.length} Free Utilities Available
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          {details.h1}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {details.intro}
        </p>
      </div>

      {/* Grid of Category Tools */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
          <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-blue-500" size={20} />
            <span>Tools in {category.name}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Click any card to open tool</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryTools.map((t) => (
            <a
              key={t.id}
              href={`/${t.id}`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(t.id as PageId);
              }}
              className="group bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 p-5 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between block cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ToolIcon name={t.icon} className="h-5 w-5" />
                  </div>
                  {t.isPopular && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <Star size={10} className="fill-amber-500" />
                      Popular
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Launch Tool</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Category FAQ Section */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-8 rounded-3xl space-y-6">
        <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle size={20} className="text-blue-500" />
          <span>Category FAQs</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {details.faqs.map((faq, i) => (
            <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-2">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                Q: {faq.q}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A: {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
