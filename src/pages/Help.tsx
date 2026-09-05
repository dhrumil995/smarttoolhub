import React, { useState, useMemo } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, Lock, Code, Sparkles, Terminal, Mail, MessageSquare, ArrowRight, BookOpen, Shield, ShieldCheck } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface FAQItem {
  id: string;
  category: 'general' | 'security' | 'developer' | 'youtube' | 'seo';
  question: string;
  answer: React.ReactNode;
}

interface HelpProps {
  onNavigateToContact?: () => void;
}

export default function Help({ onNavigateToContact }: HelpProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'security' | 'developer' | 'youtube' | 'seo'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('data-privacy');

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'general', label: 'General Info', icon: HelpCircle },
    { id: 'security', label: 'Security & Privacy', icon: ShieldCheck },
    { id: 'developer', label: 'Developer Utilities', icon: Code },
    { id: 'youtube', label: 'YouTube Helpers', icon: Sparkles },
    { id: 'seo', label: 'SEO Optimization', icon: Terminal },
  ];

  const faqs: FAQItem[] = [
    {
      id: 'data-privacy',
      category: 'security',
      question: 'How does ToolHub handle and process my data?',
      answer: (
        <div className="space-y-3">
          <p>
            At ToolHub, security is our primary core philosophy. All utility calculations, conversions, generators, and encoders run <strong>100% client-side directly in your browser</strong>. 
          </p>
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 font-mono text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <span className="block font-bold text-slate-700 dark:text-slate-300">✓ Security Architecture Facts:</span>
            <span className="block">• Zero-Server Processing: No text, credentials, or keys are uploaded to any server.</span>
            <span className="block">• No Database: We do not store or log history of your pasted contents or generated items.</span>
            <span className="block">• Absolute Discard: Once you close the tab, your session is instantly and permanently wiped.</span>
          </div>
          <p>
            You can verify this by checking your browser's DevTools Network tab — zero API requests are dispatched when formatting JSON, converting code, or generating secure passwords.
          </p>
        </div>
      ),
    },
    {
      id: 'is-free',
      category: 'general',
      question: 'Is ToolHub completely free to use? Are there limits?',
      answer: (
        <p>
          Yes, ToolHub is <strong>100% completely free</strong> to use. There are no paywalls, no daily limits, and no premium upgrades. You do not even need to create an account to unlock full-featured access. Our entire suite of developer helpers and calculators is open to everyone, anytime.
        </p>
      ),
    },
    {
      id: 'offline-use',
      category: 'general',
      question: 'Can I use these tools offline?',
      answer: (
        <p>
          Yes, you can! Because the application operates entirely within your browser client environment, once the website and tools are fully loaded, most conversion calculators and tools can be operated securely and fully without any active internet connection.
        </p>
      ),
    },
    {
      id: 'password-strength',
      category: 'security',
      question: 'How secure is the Password Generator tool?',
      answer: (
        <div className="space-y-2">
          <p>
            Our password generator utilizes the cryptographically secure <strong>Web Cryptography API</strong> (specifically <code>window.crypto.getRandomValues()</code>) instead of standard pseudo-random functions like <code>Math.random()</code>. 
          </p>
          <p>
            This ensures that your generated passwords have extreme high entropy and are mathematically protected against predictable patterns or brute-force tracking simulations. Since everything is generated locally, your key is never transmitted or exposed to anyone.
          </p>
        </div>
      ),
    },
    {
      id: 'json-limits',
      category: 'developer',
      question: 'Does the JSON Formatter support massive files?',
      answer: (
        <p>
          Yes. The JSON Formatter & Validator is optimized to process and clean JSON structures up to several megabytes with zero lag. It leverages the client's built-in V8 JavaScript parsing engine to keep execution instantaneous and highly optimized without locking the browser UI thread.
        </p>
      ),
    },
    {
      id: 'base64-usage',
      category: 'developer',
      question: 'What is Base64 encoding used for?',
      answer: (
        <div className="space-y-2">
          <p>
            Base64 encoding schemes are used to convert binary data (such as images, keys, or attachments) into safe, readable ASCII characters. 
          </p>
          <p>
            This is highly useful for embedding small assets directly into CSS files, passing key strings inside JSON configurations, or transmitting raw headers safely over text-based internet communication protocols.
          </p>
        </div>
      ),
    },
    {
      id: 'yt-ids',
      category: 'youtube',
      question: 'How can I easily find a YouTube Channel ID or Video ID?',
      answer: (
        <div className="space-y-2">
          <p>
            Finding standard YouTube identifiers can be tricky because YouTube uses aliases and custom handles (e.g. <code>@mkbhd</code>). 
          </p>
          <p>
            With our <strong>YT Channel Audit & ID Extractor</strong> or <strong>YT Embed Code Generator</strong>, you can simply paste the custom channel URL or public video link. Our tools instantly decode the link structure and reveal the standard 24-character Channel ID (starting with <code>UC</code>) or 11-character Video ID, with copy-to-clipboard actions.
          </p>
        </div>
      ),
    },
    {
      id: 'yt-downloads',
      category: 'youtube',
      question: 'Can I download YouTube banners or avatars in full resolution?',
      answer: (
        <p>
          Yes! Our <strong>YT Channel Auditor</strong> decodes YouTube's public endpoints to locate and extract the highest available profile avatar and header canvas images. We offer instant downloadable direct paths for multiple layout resolutions (Retina, standard desktop, mobile screens).
        </p>
      ),
    },
    {
      id: 'seo-schema-value',
      category: 'seo',
      question: 'What is an SEO Schema and why is it important?',
      answer: (
        <div className="space-y-2">
          <p>
            An SEO Schema (using JSON-LD structure) is a semantic vocabulary of structured data markup that you add to your website. 
          </p>
          <p>
            By adding schema to your HTML, you help major search engines like Google, Bing, and DuckDuckGo understand the exact context of your content (such as FAQs, Reviews, Articles, or Products). This increases your organic click-through rates (CTR) by rendering beautiful "rich snippets" directly on search engine results pages.
          </p>
        </div>
      ),
    },
    {
      id: 'seo-auditor-use',
      category: 'seo',
      question: 'How does the SEO Meta & Tag Auditor function?',
      answer: (
        <p>
          The SEO Meta Auditor parses standard SEO variables including title length, description character boundaries, OpenGraph metadata tags, and heading hierarchy. It flags missing parameters and provides immediate recommendations to ensure your webpages comply with search engine guidelines and share perfectly on platforms like Twitter and Slack.
        </p>
      ),
    }
  ];

  // Filter FAQs based on query and selected category
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <SEOHead
        title="Help Center & FAQs"
        description="Find detailed answers to common questions about ToolHub utilities, data security, usage boundaries, and technical tool details."
      />

      {/* Hero Header Section */}
      <section className="text-center space-y-4">
        <span className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          TOOLHUB HELP CENTER
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          How can we help you today?
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Search our knowledge base or explore specific categories to understand tool processes, data security models, and SEO setups.
        </p>
      </section>

      {/* Search Input Card */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. data privacy, YouTube, password, SEO...)"
            className="w-full pl-12 pr-10 py-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-850 dark:text-slate-200 placeholder-slate-400 transition-all"
          />
          <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setExpandedId(null); // Reset expanded state on category change
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-850 dark:hover:text-white'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Expanded Accordion FAQs Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Questions & Details ({filteredFaqs.length})
            </h2>
            {searchQuery && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Filtered results
              </span>
            )}
          </div>

          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 font-semibold text-slate-850 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <span className="text-sm tracking-tight">{faq.question}</span>
                      <span className="text-slate-400 shrink-0">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-5 pt-1 border-t border-slate-100/60 dark:border-slate-800/40 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl">
              <HelpCircle className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No articles or questions matched your query.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching for general keywords like "privacy", "embed", "password", or "SEO".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Assistance / Direct Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 space-y-4">
            <div className="h-10 w-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-sm">
                Strict Local Sandbox
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                None of your processed text, JSON files, QR settings, SEO audits, or YouTube extracts leave your computer. We process everything client-side.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Shield size={12} className="text-emerald-500" />
              Privacy Compliant System
            </div>
          </div>

          <div className="bg-blue-600 dark:bg-blue-600 text-white p-6 rounded-3xl space-y-4 shadow-sm shadow-blue-600/10">
            <h3 className="font-display font-extrabold text-base leading-tight">
              Still have questions or feature requests?
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed font-medium">
              We are constantly refining the ToolHub suite. If you have an idea for a new conversion calculator, formatting helper, or found a minor bug, tell us immediately.
            </p>
            {onNavigateToContact && (
              <button
                onClick={onNavigateToContact}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-blue-600 dark:text-blue-600 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs font-mono tracking-widest uppercase"
              >
                Contact Support
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
