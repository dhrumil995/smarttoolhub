import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { 
  Search, Sparkles, Star, ArrowRight, ShieldCheck, Zap, History, RefreshCw, X, 
  CheckCircle2, XCircle, ChevronDown, ChevronUp, TrendingUp, Check, Heart, 
  Info, Shield, HelpCircle, Copy, RotateCcw, List, SlidersHorizontal, 
  ArrowUpDown, ArrowUp, Flame, Tag, Bookmark, CheckSquare, Trash2, Filter
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/tools';
import { Tool, CategoryId, PageId } from '../types';
import SEOHead from '../components/SEOHead';
import AIToolsDirectory from '../components/AIToolsDirectory';
import ToolCard from '../components/ToolCard';
import { searchTools, highlightSearchText, scoreTool } from '../utils/searchHelper';

// Type-safe Icon mapper to avoid dynamic import bundle issues
import {
  Code2,
  FileText,
  Palette,
  ShieldAlert,
  Braces,
  Binary,
  QrCode,
  Type,
  FileSpreadsheet,
  BookOpen,
  KeyRound,
  Youtube,
  Hash,
  Image,
  DollarSign,
  SearchCode,
  BarChart3,
  FileCode,
  Activity,
  Sliders,
  Users,
  AlignLeft,
  Cpu,
  BrainCircuit,
  Wand2,
  Link,
  Layers,
  GitCompare,
  Database,
  Compass,
  Bot,
  Instagram,
  UserCheck,
  Shrink,
  LayoutGrid,
  UserSearch,
  Building2,
  Receipt,
  Briefcase,
  Calculator,
  Clock,
  TrendingUp as TrendingUpIcon,
  ArrowLeftRight,
} from 'lucide-react';

export function ToolIcon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  switch (name) {
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'ArrowLeftRight':
      return <ArrowLeftRight className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'TrendingUp':
      return <TrendingUpIcon className={className} />;
    case 'Bot':
      return <Bot className={className} />;
    case 'RefreshCw':
      return <RefreshCw className={className} />;
    case 'Link':
      return <Link className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'GitCompare':
      return <GitCompare className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Code2':
      return <Code2 className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'Braces':
      return <Braces className={className} />;
    case 'Binary':
      return <Binary className={className} />;
    case 'QrCode':
      return <QrCode className={className} />;
    case 'Type':
      return <Type className={className} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'KeyRound':
      return <KeyRound className={className} />;
    case 'Youtube':
      return <Youtube className={className} />;
    case 'Hash':
      return <Hash className={className} />;
    case 'Image':
      return <Image className={className} />;
    case 'DollarSign':
      return <DollarSign className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'SearchCode':
      return <SearchCode className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'FileCode':
      return <FileCode className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Sliders':
      return <Sliders className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'AlignLeft':
      return <AlignLeft className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'BrainCircuit':
      return <BrainCircuit className={className} />;
    case 'Wand2':
      return <Wand2 className={className} />;
    case 'Instagram':
      return <Instagram className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Shrink':
      return <Shrink className={className} />;
    case 'LayoutGrid':
      return <LayoutGrid className={className} />;
    case 'UserSearch':
      return <UserSearch className={className} />;
    default:
      return <Code2 className={className} />;
  }
}

interface HomeProps {
  onSelectTool: (toolId: PageId) => void;
}

const CATEGORY_THEMES: Record<string, {
  hoverBorder: string;
  iconBg: string;
  iconText: string;
  hoverIconBg: string;
  accentText: string;
  accentBg: string;
  shadowColor: string;
}> = {
  dev: {
    hoverBorder: 'hover:border-blue-500/50 dark:hover:border-blue-500/40',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/10',
    iconText: 'text-blue-600 dark:text-blue-400',
    hoverIconBg: 'group-hover:bg-blue-600 group-hover:text-white',
    accentText: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/10',
    shadowColor: 'hover:shadow-blue-500/2',
  },
  text: {
    hoverBorder: 'hover:border-emerald-500/50 dark:hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    hoverIconBg: 'group-hover:bg-emerald-600 group-hover:text-white',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/10',
    shadowColor: 'hover:shadow-emerald-500/2',
  },
  design: {
    hoverBorder: 'hover:border-purple-500/50 dark:hover:border-purple-500/40',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/10',
    iconText: 'text-purple-600 dark:text-purple-400',
    hoverIconBg: 'group-hover:bg-purple-600 group-hover:text-white',
    accentText: 'text-purple-600 dark:text-purple-400',
    accentBg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/10',
    shadowColor: 'hover:shadow-purple-500/2',
  },
  math: {
    hoverBorder: 'hover:border-amber-500/50 dark:hover:border-amber-500/40',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/10',
    iconText: 'text-amber-600 dark:text-amber-400',
    hoverIconBg: 'group-hover:bg-amber-600 group-hover:text-white',
    accentText: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/10',
    shadowColor: 'hover:shadow-amber-500/2',
  },
  youtube: {
    hoverBorder: 'hover:border-red-500/50 dark:hover:border-red-500/40',
    iconBg: 'bg-red-500/10 dark:bg-red-500/10',
    iconText: 'text-red-600 dark:text-red-400',
    hoverIconBg: 'group-hover:bg-red-600 group-hover:text-white',
    accentText: 'text-red-600 dark:text-red-400',
    accentBg: 'bg-red-500/5 dark:bg-red-500/10 border-red-500/10',
    shadowColor: 'hover:shadow-red-500/2',
  },
  seo: {
    hoverBorder: 'hover:border-amber-500/50 dark:hover:border-emerald-500/40',
    iconBg: 'bg-amber-500/10 dark:bg-emerald-500/10',
    iconText: 'text-amber-600 dark:text-emerald-400',
    hoverIconBg: 'group-hover:bg-emerald-600 group-hover:text-white',
    accentText: 'text-amber-600 dark:text-emerald-400',
    accentBg: 'bg-amber-500/5 dark:bg-emerald-500/10 border-emerald-500/10',
    shadowColor: 'hover:shadow-emerald-500/2',
  },
  ai: {
    hoverBorder: 'hover:border-purple-500/50 dark:hover:border-purple-500/40',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/10',
    iconText: 'text-purple-600 dark:text-purple-400',
    hoverIconBg: 'group-hover:bg-purple-600 group-hover:text-white',
    accentText: 'text-purple-600 dark:text-purple-400',
    accentBg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/10',
    shadowColor: 'hover:shadow-purple-500/2',
  },
  instagram: {
    hoverBorder: 'hover:border-fuchsia-500/50 dark:hover:border-fuchsia-500/40',
    iconBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/10',
    iconText: 'text-fuchsia-600 dark:text-fuchsia-400',
    hoverIconBg: 'group-hover:bg-fuchsia-600 group-hover:text-white',
    accentText: 'text-fuchsia-600 dark:text-fuchsia-400',
    accentBg: 'bg-fuchsia-500/5 dark:bg-fuchsia-500/10 border-fuchsia-500/10',
    shadowColor: 'hover:shadow-fuchsia-500/2',
  },
  business: {
    hoverBorder: 'hover:border-blue-600/50 dark:hover:border-cyan-500/40',
    iconBg: 'bg-blue-600/10 dark:bg-cyan-500/10',
    iconText: 'text-blue-600 dark:text-cyan-400',
    hoverIconBg: 'group-hover:bg-blue-600 group-hover:text-white',
    accentText: 'text-blue-600 dark:text-cyan-400',
    accentBg: 'bg-blue-600/5 dark:bg-cyan-500/10 border-blue-500/10',
    shadowColor: 'hover:shadow-blue-500/2',
  },
  'ai-business': {
    hoverBorder: 'hover:border-indigo-500/50 dark:hover:border-indigo-500/40',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/10',
    iconText: 'text-indigo-600 dark:text-indigo-400',
    hoverIconBg: 'group-hover:bg-indigo-600 group-hover:text-white',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    accentBg: 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/10',
    shadowColor: 'hover:shadow-indigo-500/2',
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function Home({ onSelectTool }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'favorites'>('all');
  const [activeGuideTab, setActiveGuideTab] = useState<'creators' | 'developers' | 'seo'>('developers');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // --- VIEW MODE & SORTING (GRID / COMPACT / CATEGORY) ---
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'category'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('smarttoolhub_view_mode') as any) || 'grid';
    }
    return 'grid';
  });

  const [sortBy, setSortBy] = useState<'recommended' | 'name-asc' | 'name-desc' | 'category'>('recommended');

  const handleViewModeChange = (mode: 'grid' | 'compact' | 'category') => {
    setViewMode(mode);
    localStorage.setItem('smarttoolhub_view_mode', mode);
  };

  // --- FLOATING BACK TO TOP BUTTON ---
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- SEARCH HISTORY IN LOCALSTORAGE ---
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttoolhub_search_history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const saveSearchTerm = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    const updated = [clean, ...searchHistory.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setSearchHistory(updated);
    localStorage.setItem('smarttoolhub_search_history', JSON.stringify(updated));
  };

  const removeSearchHistoryItem = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    const updated = searchHistory.filter((t) => t !== termToRemove);
    setSearchHistory(updated);
    localStorage.setItem('smarttoolhub_search_history', JSON.stringify(updated));
  };

  const clearSearchHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('smarttoolhub_search_history');
  };

  // --- MODERN DYNAMIC SEARCH SHORTCUTS & AUTOCOMPLETE STATE ---
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  // Ref for smooth scrolling to tools section on category selection
  const toolsSectionRef = React.useRef<HTMLDivElement>(null);

  const handleCategorySelect = (catId: CategoryId | 'all' | 'favorites') => {
    setSelectedCategory(catId);
    if (toolsSectionRef.current) {
      const rect = toolsSectionRef.current.getBoundingClientRect();
      if (rect.top < 120) {
        const topOffset = window.pageYOffset + rect.top - 140;
        window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
      }
    }
  };

  // Favorites & Recents managed 100% locally
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttoolhub_favorites') || localStorage.getItem('toolhub_favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('smarttoolhub_visited');
    }
    return false;
  });

  const [showFavoritesBuilder, setShowFavoritesBuilder] = useState(false);

  const [recentTools, setRecentTools] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttoolhub_recents') || localStorage.getItem('toolhub_recents');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Smart scored autocomplete suggestions
  const suggestedTools = searchQuery.trim()
    ? searchTools(TOOLS, searchQuery, 'all', favorites).slice(0, 8)
    : [];

  // Reset selected index when query changes
  useEffect(() => {
    setSuggestionIndex(0);
    if (searchQuery.trim()) {
      setShowSuggestions(true);
    }
  }, [searchQuery]);

  // Listen for mobile category drawer event
  useEffect(() => {
    const handleCategoryEvent = (e: any) => {
      if (e.detail && e.detail.categoryId) {
        handleCategorySelect(e.detail.categoryId);
      }
    };
    window.addEventListener('smarttoolhub:selectCategory', handleCategoryEvent);
    return () => window.removeEventListener('smarttoolhub:selectCategory', handleCategoryEvent);
  }, []);

  // Handle click outside to close autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts (Cmd/Ctrl + K, '/', ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Focus input (Cmd+K / Ctrl+K) or '/'
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSuggestions(true);
        return;
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const tagName = document.activeElement?.tagName || '';
        if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
          setShowSuggestions(true);
          return;
        }
      }

      // If suggestions are not shown, skip suggestions keyboard logic
      if (!showSuggestions) return;

      // 2. Arrow Down
      if (e.key === 'ArrowDown') {
        if (suggestedTools.length > 0) {
          e.preventDefault();
          setSuggestionIndex((prev) => (prev + 1) % suggestedTools.length);
        }
      }
      // 3. Arrow Up
      else if (e.key === 'ArrowUp') {
        if (suggestedTools.length > 0) {
          e.preventDefault();
          setSuggestionIndex((prev) => (prev - 1 + suggestedTools.length) % suggestedTools.length);
        }
      }
      // 4. Enter key to select
      else if (e.key === 'Enter') {
        if (suggestedTools[suggestionIndex]) {
          e.preventDefault();
          saveSearchTerm(searchQuery || suggestedTools[suggestionIndex].name);
          handleSelectTool(suggestedTools[suggestionIndex].id as PageId);
          setShowSuggestions(false);
        } else if (searchQuery.trim()) {
          saveSearchTerm(searchQuery);
          setShowSuggestions(false);
        }
      }
      // 5. Escape to close
      else if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestedTools, suggestionIndex, searchQuery]);

  const toggleFavorite = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(toolId)) {
      updated = favorites.filter((id) => id !== toolId);
    } else {
      updated = [...favorites, toolId];
    }
    setFavorites(updated);
    localStorage.setItem('smarttoolhub_favorites', JSON.stringify(updated));
  };

  const applyStarterKit = (kit: 'creator' | 'developer' | 'popular') => {
    let ids: string[] = [];
    if (kit === 'creator') {
      ids = ['youtube-tags-generator', 'ig-hashtag-generator', 'ai-humanizer', 'word-counter', 'reels-downloader'];
    } else if (kit === 'developer') {
      ids = ['json-formatter', 'base64-converter', 'password-generator', 'qr-generator', 'sql-formatter'];
    } else if (kit === 'popular') {
      ids = ['reels-downloader', 'youtube-tags-generator', 'json-formatter', 'qr-generator', 'ai-humanizer', 'password-generator'];
    }
    const updated = Array.from(new Set([...favorites, ...ids]));
    setFavorites(updated);
    localStorage.setItem('smarttoolhub_favorites', JSON.stringify(updated));
    localStorage.setItem('smarttoolhub_visited', 'true');
    setIsFirstVisit(false);
  };

  const handleSelectTool = (toolId: PageId) => {
    // Add to recents (maintain unique order, limit to 4)
    const updated = [
      toolId,
      ...recentTools.filter((id) => id !== toolId),
    ].slice(0, 4);
    setRecentTools(updated);
    localStorage.setItem('smarttoolhub_recents', JSON.stringify(updated));
    onSelectTool(toolId);
  };

  // Filter and sort tools based on category, search query, and sort setting
  const rawFilteredTools = searchTools(TOOLS, searchQuery, selectedCategory, favorites);

  const filteredTools = [...rawFilteredTools].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    // 'recommended' uses the default score ranking
    return 0;
  });

  // Trending pre-defined search terms
  const trendingSearches = [
    { label: 'Reels Downloader', term: 'reels' },
    { label: 'YouTube Tags', term: 'youtube' },
    { label: 'JSON Formatter', term: 'json' },
    { label: 'AI Humanizer', term: 'humanizer' },
    { label: 'QR Generator', term: 'qr' },
    { label: 'Base64', term: 'base64' },
    { label: 'Password Generator', term: 'password' },
    { label: 'Calculators', term: 'calculator' },
  ];

  // FAQ data representation for accordion render
  const faqList = [
    {
      q: "Is SmartToolHub completely free without any paywalls or limits?",
      a: "Yes, 100%. SmartToolHub is free and will always remain completely accessible without premium subscriptions, registration walls, cookie paywalls, or API usage limits. All conversions, downloads, and code formatting features are unlimited."
    },
    {
      q: "Does SmartToolHub store, track, or share my sensitive raw input data?",
      a: "Never. Unlike traditional online tools that transmit raw code or text payloads to remote servers, SmartToolHub is architected with a local client-first security design. Everything compiles, formats, and executes purely within your active browser's local RAM. Your data stays where it belongs—on your device."
    },
    {
      q: "How do client-side utilities work and why are they safer than traditional web apps?",
      a: "By leveraging React, WebAssembly, and modern browser APIs, we process file conversions, cryptographic hashing, and casing transformations locally on your computer. This eliminates the latency of network roundtrips and protects your private datasets from remote database storage or server logging leaks."
    },
    {
      q: "What are the benefits of YouTube metadata optimization tools?",
      a: "YouTube is the world's second-largest search engine. By deploying search-optimized keyword tags, copy-paste structured descriptions, and click-maximizing titles, you elevate your search relevance. SmartToolHub YouTube utilities help you easily capture organic reach, raise CTR, and improve viewer engagement."
    },
    {
      q: "Can I access these productivity tools offline or when my internet drops?",
      a: "Absolutely. Once the platform has initially fetched, our offline-capable service framework ensures that basic converters, builders, formatters, and planners continue to operate flawlessly. Ideal for developers working on airplanes, remote locations, or unstable networks."
    },
    {
      q: "How can I integrate these tools into my daily developer workflow?",
      a: "You can pin your most-used tools (such as the JSON Formatter, Diff Checker, or Base64 Encoder) to your Quick Access Dashboard by clicking the Star icon. They will remain saved at the top of your homepage for instant access whenever you open SmartToolHub."
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      <SEOHead
        title="Best Free Web Utility & AI Tools Dashboard"
        description="Access fully client-side JSON formatters, secure password generators, and the best AI tools of 2026. Free developer calculators and productivity planners running entirely in local memory."
        keywords={[
          'smarttoolhub', 'json converter', 'password generator', 'web utilities',
          'best ai tools', 'best ai tools for students', 'best ai tools 2025', 'best ai tools for coding',
          'best ai tools for business', 'best ai tools free', 'best ai tools for video editing free',
          'best ai tools for presentations', 'best ai tools for research', 'best ai tools for image generation',
          'best ai tools for work', 'best ai tools like chatgpt', 'best ai tools for video creation',
          'best ai tools for video editing', 'best ai tools for ppt', 'best ai tools for studying',
          'best ai tools for teachers', 'best ai tools 2026', 'best ai tools for content writing',
          'best ai tools for college students'
        ]}
      />

      {/* Technical On-Page JSON-LD Schema (Crawlable Rich Snippet Structure) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SmartToolHub",
          "url": "https://smarttoolhub.net",
          "description": "Unlock a premium, client-side developer toolbox. Private JSON formatters, secure hash encoders, YouTube thumbnail grabbers, high-CTR metadata planners, and SEO metrics analyzers operating 100% locally.",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All modern browsers",
          "browserRequirements": "Requires HTML5 and Javascript support.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          },
          "featureList": [
            "100% Client-Side Safe processing in React memory",
            "YouTube Tags, Chapters & Channel Audit Suite",
            "Technical SEO Schema & Robots.txt Generator",
            "Base64, QR Codes & Hex Color Conversion Wheel",
            "Instant offline mode compatibility"
          ]
        })}
      </script>

      {/* 1. HERO SEARCH BANNER */}
      <section className="relative py-10 sm:py-14 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6 overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 shadow-xl my-4 text-white">
        <div className="relative z-10 space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={13} className="text-blue-400" />
            <span>Fast & Private Client-Side Toolbox • 150+ Ultra Pro Max Utilities</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
            Developer & Creator Utility Hub
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            Free, zero-latency, secure developer tools and productivity converters. Processing executes 100% locally in your browser with zero data retention.
          </p>
        </div>

        {/* Centered Search Bar with Smart Autocomplete & Recent History */}
        <div ref={searchContainerRef} className="max-w-2xl mx-auto relative z-30">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 text-slate-400 group-focus-within:text-blue-400 h-5 w-5 transition-colors pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim() && (!suggestedTools.length || suggestionIndex >= suggestedTools.length)) {
                  saveSearchTerm(searchQuery);
                  setShowSuggestions(false);
                }
              }}
              placeholder="Search 150+ tools (Reels Downloader, YouTube, JSON, AI Humanizer, Base64...)"
              className="w-full pl-12 pr-24 py-4 bg-slate-950/90 hover:bg-slate-950 border-2 border-slate-700/80 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-2xl transition-all"
            />
            
            <div className="absolute right-3.5 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700">
                  <span>⌘K</span>
                  <span className="text-slate-500">/</span>
                  <span>/</span>
                </div>
              )}
            </div>
          </div>

          {/* Auto-suggest & Recent Searches Dropdown Container */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-40 text-left"
              >
                {/* 1. When typing query */}
                {searchQuery.trim() ? (
                  <>
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={12} className="text-blue-500" />
                        Top Matching Tools ({suggestedTools.length})
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Press ↵ to launch
                      </span>
                    </div>

                    {suggestedTools.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-100/50 dark:divide-slate-800/50">
                        {suggestedTools.map((tool, index) => {
                          const theme = CATEGORY_THEMES[tool.category] || CATEGORY_THEMES.dev;
                          const isSelected = index === suggestionIndex;
                          const catObj = CATEGORIES.find((c) => c.id === tool.category);

                          return (
                            <div
                              key={`sugg-${tool.id}`}
                              onMouseEnter={() => setSuggestionIndex(index)}
                              onClick={() => {
                                saveSearchTerm(searchQuery || tool.name);
                                handleSelectTool(tool.id as PageId);
                                setShowSuggestions(false);
                              }}
                              className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg} ${theme.iconText} border border-slate-200/80 dark:border-slate-800`}>
                                <ToolIcon name={tool.icon} className="h-4 w-4" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {highlightSearchText(tool.name, searchQuery)}
                                  </span>
                                  {tool.isPopular && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 shrink-0">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  {highlightSearchText(tool.description, searchQuery)}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                {catObj && (
                                  <span className="hidden sm:inline-block text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    {catObj.name.split(' ')[0]}
                                  </span>
                                )}
                                <ArrowRight size={14} className={isSelected ? 'text-blue-500 translate-x-0.5 transition-transform' : 'text-slate-400 opacity-40'} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 px-4 text-center space-y-3">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          No tools found directly matching "<span className="text-blue-500 font-bold">{searchQuery}</span>"
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Try searching for popular terms like <span className="font-mono text-slate-300">reels</span>, <span className="font-mono text-slate-300">json</span>, <span className="font-mono text-slate-300">base64</span>, or <span className="font-mono text-slate-300">ai</span>
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                          {trendingSearches.slice(0, 4).map((t) => (
                            <button
                              key={t.term}
                              onClick={() => {
                                setSearchQuery(t.term);
                                saveSearchTerm(t.term);
                              }}
                              className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* 2. When empty query & input is focused: show Recent Searches & Quick Jumps */
                  <div className="p-3 space-y-3">
                    {searchHistory.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <History size={12} className="text-blue-500" />
                            Recent Searches
                          </span>
                          <button
                            onClick={clearSearchHistory}
                            className="text-[10px] text-slate-400 hover:text-red-500 font-medium cursor-pointer"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {searchHistory.map((item) => (
                            <span
                              key={item}
                              onClick={() => {
                                setSearchQuery(item);
                                setShowSuggestions(true);
                              }}
                              className="group inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 text-xs rounded-xl cursor-pointer transition-colors"
                            >
                              <Clock size={11} className="text-slate-400 group-hover:text-blue-500" />
                              <span>{item}</span>
                              <button
                                onClick={(e) => removeSearchHistoryItem(e, item)}
                                className="text-slate-400 hover:text-red-500 ml-0.5 p-0.5 rounded cursor-pointer"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                        Popular Tools
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {[
                          { id: 'reels-downloader', name: 'Reels Downloader', icon: 'Instagram' },
                          { id: 'youtube-tags-generator', name: 'YouTube Tags', icon: 'Youtube' },
                          { id: 'ai-humanizer', name: 'AI Humanizer', icon: 'Bot' },
                          { id: 'json-formatter', name: 'JSON Formatter', icon: 'Braces' },
                          { id: 'qr-generator', name: 'QR Code Builder', icon: 'QrCode' },
                          { id: 'base64-converter', name: 'Base64 Encoder', icon: 'Binary' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              handleSelectTool(item.id as PageId);
                              setShowSuggestions(false);
                            }}
                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-left cursor-pointer transition-all border border-slate-200/50 dark:border-slate-700/50"
                          >
                            <ToolIcon name={item.icon} className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {item.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dropdown Keyboard Footer */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/70 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono">↓</kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono">↵</kbd>
                      open
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono">Esc</kbd>
                      close
                    </span>
                  </div>
                  <span className="font-medium text-slate-400">150+ Tools</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trending Search Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs text-slate-500">
          <span className="font-medium text-slate-400 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            Popular:
          </span>
          {trendingSearches.map((trend) => (
            <button
              key={trend.term}
              onClick={() => setSearchQuery(trend.term)}
              className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full cursor-pointer transition-colors text-xs"
            >
              {trend.label}
            </button>
          ))}
        </div>
      </section>

      {/* REAL-TIME DASHBOARD & METRICS BAR */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs my-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          {/* Metric 1: Total Tools Count */}
          <div className="flex items-center gap-3.5 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Total Suite Tools
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{TOOLS.length}+ Free Utilities</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                  Updated
                </span>
              </div>
            </div>
          </div>

          {/* Metric 2: Active User Count */}
          <div className="flex items-center gap-3.5 px-2 py-1 pt-3 sm:pt-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Monthly Active Users
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>248,920+ Users</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-500 font-bold uppercase">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: Client-Side Executions & Privacy Guarantee */}
          <div className="flex items-center gap-3.5 px-2 py-1 pt-3 sm:pt-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Client-Side Operations
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>5.42M+ Executions</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-500 font-bold uppercase">
                  100% Private
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIRST-TIME VISIT / CUSTOMIZE FAVORITE WEBSITE BANNER */}
      {(isFirstVisit || showFavoritesBuilder || favorites.length === 0) && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={11} /> Welcome Visitor
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Customize Your Favorite Tool Launcher
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Star your most-used utilities or pick a starter pack to build your personalized launcher at the top of the site.
              </p>
            </div>
            <button
              onClick={() => {
                setIsFirstVisit(false);
                setShowFavoritesBuilder(false);
                localStorage.setItem('smarttoolhub_visited', 'true');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Close Banner"
            >
              <X size={18} />
            </button>
          </div>

          {/* 1-Click Starter Kits */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-black">1-Click Starter Kits</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyStarterKit('creator')}
                className="px-3 py-1.5 bg-white dark:bg-white text-black rounded-xl border border-slate-300 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all hover:bg-slate-100 active:scale-95"
              >
                🎥 Creator Starter Kit
              </button>
              <button
                onClick={() => applyStarterKit('developer')}
                className="px-3 py-1.5 bg-white dark:bg-white text-black rounded-xl border border-slate-300 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all hover:bg-slate-100 active:scale-95"
              >
                💻 Developer Starter Kit
              </button>
              <button
                onClick={() => applyStarterKit('popular')}
                className="px-3 py-1.5 bg-white dark:bg-white text-black rounded-xl border border-slate-300 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all hover:bg-slate-100 active:scale-95"
              >
                🔥 Top 5 Utilities
              </button>
            </div>
          </div>

          {/* Quick Tool Selector Star Chips */}
          <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-black dark:text-black">Or click ⭐ on tools to star your favorites:</span>
            <div className="flex flex-wrap gap-1.5">
              {TOOLS.slice(0, 10).map((tool) => {
                const isFav = favorites.includes(tool.id);
                return (
                  <button
                    key={`quickpick-${tool.id}`}
                    onClick={(e) => toggleFavorite(e, tool.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isFav
                        ? 'bg-amber-400 text-black border-amber-500 shadow-2xs font-black'
                        : 'bg-slate-100 dark:bg-white text-black border-slate-300 dark:border-slate-200 hover:bg-slate-200 dark:hover:bg-slate-100'
                    }`}
                  >
                    <Star size={12} className={isFav ? 'fill-black text-black' : 'text-amber-500 fill-amber-500'} />
                    <span className="text-black font-black">
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* 1.5. PINNED FAVORITES & RECENT UTILITIES BOARD */}
      {(favorites.length > 0 || recentTools.length > 0) && (
        <section id="favorites-board" className="space-y-4 bg-slate-50/50 dark:bg-slate-900/10 p-4 sm:p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <div>
              <h2 className="font-display text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                <Star size={15} className="text-amber-400 fill-amber-400" />
                Your Favorite Tools ({favorites.length})
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">
                Your pinned favorite utilities for instant one-click access.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFavoritesBuilder(!showFavoritesBuilder)}
                className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest cursor-pointer py-1"
              >
                + Edit
              </button>
              <button
                onClick={() => {
                  setFavorites([]);
                  setRecentTools([]);
                  localStorage.removeItem('smarttoolhub_favorites');
                  localStorage.removeItem('smarttoolhub_recents');
                  localStorage.removeItem('toolhub_favorites');
                  localStorage.removeItem('toolhub_recents');
                }}
                className="text-[10px] sm:text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest cursor-pointer transition-colors py-1"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Unique union of favorites and recents, sliced to top 4 */}
            {Array.from(new Set([...favorites, ...recentTools]))
              .map((id) => TOOLS.find((t) => t.id === id))
              .filter((tool): tool is Tool => !!tool)
              .slice(0, 4)
              .map((tool) => {
                const theme = CATEGORY_THEMES[tool.category] || CATEGORY_THEMES.dev;
                const isFavorite = favorites.includes(tool.id);
                return (
                  <div
                    key={`quick-${tool.id}`}
                    onClick={() => handleSelectTool(tool.id)}
                    className="group relative p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-blue-500/50 dark:hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center ${theme.iconBg} ${theme.iconText}`}>
                        <ToolIcon name={tool.icon} className="h-4 w-4" />
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(e, tool.id)}
                        className="p-1 rounded-md text-slate-300 dark:text-slate-700 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title={isFavorite ? "Unpin Tool" : "Pin Tool"}
                      >
                        <Star size={12} className={isFavorite ? "fill-amber-400 text-amber-400" : ""} />
                      </button>
                    </div>
                    <div className="mt-2.5">
                      <h3 className="font-display font-bold text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 lowercase mt-0.5">
                        #{tool.tags[0]}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* 2. STICKY CATEGORY FILTER BAR WITH DOMAIN BUTTONS */}
      <section className="sticky top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-4 py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-y border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-all duration-200 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Header & Selected Domain Indicator */}
          <div className="flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-blue-500" />
                Category:
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                {selectedCategory === 'all'
                  ? `All Domains (${filteredTools.length})`
                  : selectedCategory === ('favorites' as any)
                  ? `Favorites (${favorites.length})`
                  : `${CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory} (${filteredTools.length})`}
              </span>
            </div>

            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  handleCategorySelect('all');
                  setSearchQuery('');
                }}
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                <X size={12} />
                Reset Filters
              </button>
            )}
          </div>

          {/* Sticky Category Buttons Row */}
          <div className="overflow-x-auto scrollbar-none py-0.5 flex items-center gap-1.5 w-full lg:w-auto">
            {/* ALL */}
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs font-black'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-800/80'
              }`}
            >
              <LayoutGrid size={13} />
              <span>All</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${selectedCategory === 'all' ? 'bg-white/20 text-white font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {TOOLS.length}
              </span>
            </button>

            {/* FAVORITES */}
            <button
              onClick={() => handleCategorySelect('favorites' as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                selectedCategory === ('favorites' as any)
                  ? 'bg-amber-400 text-black shadow-xs font-black border border-amber-500'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-800/80'
              }`}
            >
              <Star size={13} className={selectedCategory === ('favorites' as any) ? 'fill-black text-black' : 'text-amber-500'} />
              <span>Favorites</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${selectedCategory === ('favorites' as any) ? 'bg-black/10 text-black font-extrabold' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {favorites.length}
              </span>
            </button>

            {/* CATEGORIES DOMAIN BUTTONS */}
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              // Display prominent domain names
              let shortName = cat.name;
              if (cat.id === 'seo') shortName = 'SEO';
              else if (cat.id === 'dev') shortName = 'Developer';
              else if (cat.id === 'business') shortName = 'Business';
              else if (cat.id === 'ai') shortName = 'AI Tools';
              else if (cat.id === 'youtube') shortName = 'YouTube';
              else if (cat.id === 'instagram') shortName = 'Instagram';
              else if (cat.id === 'text') shortName = 'Text';
              else if (cat.id === 'design') shortName = 'Design';
              else if (cat.id === 'math') shortName = 'Security & Math';

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs font-black'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-800/80'
                  }`}
                >
                  <ToolIcon name={cat.icon} className="h-3.5 w-3.5" />
                  <span>{shortName}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${isSelected ? 'bg-white/20 text-white font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Overview Bento Grid (displayed when no active search and browsing 'all') */}
      {!searchQuery && selectedCategory === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const theme = CATEGORY_THEMES[cat.id] || CATEGORY_THEMES.dev;
            const count = TOOLS.filter((t) => t.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`group p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-200 cursor-pointer ${theme.hoverBorder} hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${theme.iconBg} ${theme.iconText} ${theme.hoverIconBg}`}>
                    <ToolIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-700/50">
                    {count} tools
                  </span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-1 text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. CORE TOOLS MAIN LIST WITH VIEW MODES & ADVANCED SORTING */}
      <section ref={toolsSectionRef} className="space-y-6">
        {/* Usability & View Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          {/* Left: Results Count & Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200">
              {searchQuery ? (
                <>
                  Found <span className="text-blue-600 dark:text-blue-400 font-extrabold">{filteredTools.length}</span> tools for "<span className="text-slate-900 dark:text-white">{searchQuery}</span>"
                </>
              ) : selectedCategory !== 'all' ? (
                <>
                  Showing <span className="text-blue-600 dark:text-blue-400 font-extrabold">{filteredTools.length}</span> tools in <span className="text-slate-900 dark:text-white capitalize">{selectedCategory}</span>
                </>
              ) : (
                <>
                  All Utilities <span className="text-slate-400 font-mono">({filteredTools.length})</span>
                </>
              )}
            </span>

            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <RotateCcw size={11} />
                Clear All
              </button>
            )}
          </div>

          {/* Right: Sort & View Mode Switches */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <ArrowUpDown size={13} className="text-slate-400" />
              <label htmlFor="sort-select" className="sr-only">Sort Tools</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-700 dark:text-slate-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="category">Category</option>
              </select>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 gap-0.5">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={15} />
              </button>

              <button
                onClick={() => handleViewModeChange('compact')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Compact List View"
                aria-label="Compact List View"
              >
                <List size={15} />
              </button>

              <button
                onClick={() => handleViewModeChange('category')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'category'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Group by Category View"
                aria-label="Group by Category View"
              >
                <Layers size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* In-Search Quick Category Chips (Shown when searching) */}
        {searchQuery.trim() && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter size={11} />
              In categories:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All ({searchTools(TOOLS, searchQuery, 'all').length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = searchTools(TOOLS, searchQuery, cat.id).length;
              if (count === 0) return null;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <ToolIcon name={cat.icon} className="h-3 w-3" />
                  <span>{cat.name.split(' ')[0]}</span>
                  <span className="font-mono text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 1. GRID VIEW MODE */}
        {filteredTools.length > 0 && viewMode === 'grid' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {filteredTools.map((tool) => {
              const theme = CATEGORY_THEMES[tool.category] || CATEGORY_THEMES.dev;
              const isFavorite = favorites.includes(tool.id);

              return (
                <motion.div key={tool.id} variants={itemVariants}>
                  <ToolCard
                    tool={tool}
                    onSelectTool={(id) => handleSelectTool(id)}
                    isFavorite={isFavorite}
                    onToggleFavorite={(e, id) => toggleFavorite(e, id)}
                    categoryTheme={theme}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* 2. COMPACT LIST VIEW MODE (High speed table/list for power users) */}
        {filteredTools.length > 0 && viewMode === 'compact' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredTools.map((tool) => {
              const theme = CATEGORY_THEMES[tool.category] || CATEGORY_THEMES.dev;
              const isFavorite = favorites.includes(tool.id);
              const catObj = CATEGORIES.find((c) => c.id === tool.category);

              return (
                <div
                  key={`compact-${tool.id}`}
                  onClick={() => handleSelectTool(tool.id as PageId)}
                  className="group flex items-center justify-between p-3.5 sm:p-4 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg} ${theme.iconText} border border-slate-200/80 dark:border-slate-800`}>
                      <ToolIcon name={tool.icon} className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {searchQuery ? highlightSearchText(tool.name, searchQuery) : tool.name}
                        </span>
                        {tool.isPopular && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 shrink-0">
                            Popular
                          </span>
                        )}
                        {catObj && (
                          <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                            {catObj.name}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {searchQuery ? highlightSearchText(tool.description, searchQuery) : tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => toggleFavorite(e, tool.id)}
                      className="p-2 rounded-lg text-slate-300 dark:text-slate-700 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={isFavorite ? "Unpin Favorite" : "Pin Favorite"}
                    >
                      <Star size={15} className={isFavorite ? "fill-amber-400 text-amber-400" : ""} />
                    </button>
                    <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg">
                      Launch
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. GROUPED BY CATEGORY VIEW MODE */}
        {filteredTools.length > 0 && viewMode === 'category' && (
          <div className="space-y-10">
            {CATEGORIES.map((cat) => {
              const toolsInCat = filteredTools.filter((t) => t.category === cat.id);
              if (toolsInCat.length === 0) return null;
              const theme = CATEGORY_THEMES[cat.id] || CATEGORY_THEMES.dev;

              return (
                <div key={`group-${cat.id}`} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${theme.iconBg} ${theme.iconText} border border-slate-200/80 dark:border-slate-800`}>
                        <ToolIcon name={cat.icon} className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-500">
                      {toolsInCat.length} {toolsInCat.length === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {toolsInCat.map((tool) => {
                      const isFavorite = favorites.includes(tool.id);
                      return (
                        <ToolCard
                          key={`catgroup-${tool.id}`}
                          tool={tool}
                          onSelectTool={(id) => handleSelectTool(id)}
                          isFavorite={isFavorite}
                          onToggleFavorite={(e, id) => toggleFavorite(e, id)}
                          categoryTheme={theme}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. ZERO RESULTS EMPTY STATE WITH SMART RECOVERY */}
        {filteredTools.length === 0 && (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto space-y-5 bg-white dark:bg-slate-900/50 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 stroke-[1.5]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                No tools matching "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                We couldn't find a direct match. Try broad terms like <span className="font-semibold text-slate-700 dark:text-slate-300">"reels"</span>, <span className="font-semibold text-slate-700 dark:text-slate-300">"json"</span>, <span className="font-semibold text-slate-700 dark:text-slate-300">"calculator"</span>, or browse our top utilities below.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                Reset Search Filters
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Suggested Utilities
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  { name: 'Reels Downloader', term: 'reels' },
                  { name: 'JSON Formatter', term: 'json' },
                  { name: 'AI Humanizer', term: 'humanizer' },
                  { name: 'YouTube Tags', term: 'youtube' },
                  { name: 'Password Generator', term: 'password' },
                ].map((sugg) => (
                  <button
                    key={sugg.term}
                    onClick={() => {
                      setSearchQuery(sugg.term);
                      saveSearchTerm(sugg.term);
                    }}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {sugg.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FLOATING ACTION NAVIGATION BAR (Back to top & quick search) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
          >
            <button
              onClick={() => {
                searchInputRef.current?.focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 text-xs font-bold cursor-pointer backdrop-blur-md"
              title="Search (⌘K)"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">⌘K</kbd>
            </button>

            <button
              onClick={scrollToTop}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER DYNAMIC AI TOOLS SEO DIRECTORY */}
      <AIToolsDirectory />

      {/* NEW SECTION: TRADITIONAL WEB TOOLS vs SMARTTOOLHUB (SEO & Trust Matrix) */}
      <section className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
            Architectural Privacy Shield
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Local Browser Sandbox vs. Remote Servers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            See why leading programmers and content creators prefer client-side local memory for secure and fast processing.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200/60 dark:border-slate-800">
                <th className="p-4">Key Metrics</th>
                <th className="p-4">Standard Web Tools</th>
                <th className="p-4 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-500/5">SmartToolHub Suite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Data Transmission</td>
                <td className="p-4 flex items-center gap-1.5 text-red-500 font-medium">
                  <XCircle size={14} /> Sent to external servers
                </td>
                <td className="p-4 bg-blue-50/20 dark:bg-blue-500/5 text-slate-850 dark:text-slate-200 font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle2 size={14} /> 100% Client-Side memory
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Processing Latency</td>
                <td className="p-4 text-slate-500">Slow (dependent on server load & distance)</td>
                <td className="p-4 bg-blue-50/20 dark:bg-blue-500/5 text-slate-850 dark:text-slate-200 font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle2 size={14} /> Instant sub-millisecond RAM
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">API Usage & Rate Limits</td>
                <td className="p-4 text-slate-500">Paywalls, rate caps, subscription cards</td>
                <td className="p-4 bg-blue-50/20 dark:bg-blue-500/5 text-slate-850 dark:text-slate-200 font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle2 size={14} /> Unlimited & Forever Free
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Offline Capability</td>
                <td className="p-4 flex items-center gap-1.5 text-red-500 font-medium">
                  <XCircle size={14} /> Breaks without internet
                </td>
                <td className="p-4 bg-blue-50/20 dark:bg-blue-500/5 text-slate-850 dark:text-slate-200 font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle2 size={14} /> Works offline once loaded
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Ad & Script Trackers</td>
                <td className="p-4 text-slate-500">Heavy cookies tracking user inputs</td>
                <td className="p-4 bg-blue-50/20 dark:bg-blue-500/5 text-slate-850 dark:text-slate-200 font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle2 size={14} /> zero persistent input tracking
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. SECURITY BENEFITS STATS GRID */}
      <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        <div className="space-y-2.5">
          <div className="h-9 w-9 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
            <ShieldCheck size={18} />
          </div>
          <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            100% Client-Side Safe
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All text, code, passwords, and PDF files are processed locally in your browser memory. Your data never touches any external database or third-party server.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="h-9 w-9 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
            <Zap size={18} />
          </div>
          <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Instantaneous Processing
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Eliminating network roundtrips means text casing, password generation, color coding, and schema conversions execute instantly in real time.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="w-9 h-9 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1">
            <RefreshCw size={18} className="animate-spin-slow" />
          </div>
          <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Open & Always Offline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Once loaded in your browser session, SmartToolHub remains fully operational even when you go completely offline or lose internet connection.
          </p>
        </div>
      </section>

      {/* NEW SECTION: INTERACTIVE ROLE-BASED PRODUCTIVITY GUIDES (For Creators, Developers, Designers) */}
      <section className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
            Productivity Guide Hub
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            How to Maximize Your SmartToolHub Workflow
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Toggle your digital profession below to discover a curated, step-by-step metadata plan customized for your exact work targets.
          </p>
        </div>

        {/* Dynamic Switch Tabs */}
        <div className="flex justify-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl max-w-lg mx-auto border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveGuideTab('developers')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeGuideTab === 'developers'
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            💻 For Developers
          </button>
          <button
            onClick={() => setActiveGuideTab('creators')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeGuideTab === 'creators'
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            🚀 For Creators
          </button>
          <button
            onClick={() => setActiveGuideTab('seo')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeGuideTab === 'seo'
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            📊 For SEO Pros
          </button>
        </div>

        {/* Guides Content Blocks */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGuideTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850"
          >
            {activeGuideTab === 'developers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-slate-950 dark:text-white text-base flex items-center gap-2">
                    <span className="p-1 rounded-md bg-blue-500/10 text-blue-500"><Code2 size={16} /></span>
                    Developer Data-Formatting Flow
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Instantly clear the formatting clutter from nested raw responses, databases, or third-party web endpoints securely with client-side code blocks.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Paste raw response streams directly into the <strong>JSON Formatter</strong>.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Utilize the <strong>Diff Checker</strong> to debug production API drifts.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Encode secret developer tokens to <strong>Base64 standards</strong> securely.
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-[10px] font-mono text-slate-400">
                    <span>Developer Checklist</span>
                    <span className="text-emerald-500">Local Safe</span>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Format and Minify nested JSON APIs</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Generate 128-bit safe passwords</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Compare production git-diff config files</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'creators' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-slate-950 dark:text-white text-base flex items-center gap-2">
                    <span className="p-1 rounded-md bg-red-500/10 text-red-500"><Youtube size={16} /></span>
                    YouTube Video Click-Through Rate Mastery
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Achieve maximum video search visibility and organic clicks on the YouTube homepage by systematically preparing search-optimized video tags.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Research popular hashtags in the <strong>YouTube Tags Generator</strong>.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Download 1080p full-res thumbnails using the <strong>Thumbnail Grabber</strong>.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Optimize titles and hooks using our click-maximizing AI formula.
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-[10px] font-mono text-slate-400">
                    <span>Creator Checklist</span>
                    <span className="text-red-500">SEO Focus</span>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Extract competitor metadata tag structures</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Build structured video description chapters</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Estimate channel earnings potential</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'seo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-slate-950 dark:text-white text-base flex items-center gap-2">
                    <span className="p-1 rounded-md bg-amber-500/10 text-amber-500"><SearchCode size={16} /></span>
                    Advanced Technical SEO Content Pipeline
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Validate search crawled index layouts, optimize semantic keyword saturation, and generate rich JSON-LD snippet structures seamlessly.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Build schema metadata utilizing the <strong>SEO Schema Generator</strong>.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Generate correct crawler directions via the <strong>Robots.txt Generator</strong>.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Perform density calculations with the <strong>SEO Keyword Analyzer</strong>.
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-[10px] font-mono text-slate-400">
                    <span>SEO Checklist</span>
                    <span className="text-amber-500">Indexing Plan</span>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Write valid JSON-LD schema block</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Create search-crawling robots.txt rules</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" readOnly />
                      <span>Audit on-page H1/meta title saturation limits</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 5. SEMANTIC SEO KNOWLEDGE BASE & FAQ ENGINE */}
      <section className="border-t border-slate-200/60 dark:border-slate-850 pt-12 space-y-8 sm:space-y-10">
        <div className="space-y-3 text-center">
          <span className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
            SEO & Technical Resource Hub
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-2xl mx-auto">
            Comprehensive Developer & Content Creator Knowledge Base
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            Master your digital workflow. Discover actionable tips, technical insights, and answer frequently asked questions about our free online utilities.
          </p>
        </div>

        {/* Bento Grid layout of Educational Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <article className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold shrink-0">01</span>
              Why Use Client-Side Developer Utilities?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When you paste formatted code, personal text, or configure API variables into standard online conversion tools, your confidential payloads are often sent directly to remote backend servers. This exposes proprietary code, secrets, and database dumps to server logging pipelines and third-party databases.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>SmartToolHub eliminates this threat entirely.</strong> By compiling and rendering calculations in secure client memory loops via React and advanced browser modules, your inputs never leave your local workspace. Your code, API schemas, and metadata are 100% private, sandbox protected, and loaded instantly.
            </p>
          </article>

          <article className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shrink-0">02</span>
              How YouTube Metadata Optimization Drives Views
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              YouTube operates as the second largest search engine globally. Its indexing algorithms rely heavily on the text-based components of your video payload—such as tags, hashtags, structured descriptions, and captivating title formulas—to map content to prospective viewer queries.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our suite of <strong>YouTube Tools</strong> leverages real-time high-CTR structural templates. By deploying powerful, click-worthy titles paired with optimized keyword tags and modular descriptions, content creators can systematically boost video click-through rates (CTR) and capture premium organic traffic.
            </p>
          </article>
        </div>

        {/* Structured FAQ Accordion Engine with JSON-LD FAQPage injection */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqList.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })}
        </script>

        <div className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-850 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <HelpCircle size={16} />
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions (FAQ)
            </h3>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={`faq-${index}`}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-blue-500/50 dark:border-blue-500/40 shadow-xs ring-1 ring-blue-500/10' 
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <span className={`p-1 rounded-lg transition-all duration-300 ${
                      isOpen 
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 rotate-180' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-500'
                    }`}>
                      <ChevronDown size={14} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800/50 text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-2.5 bg-slate-50/40 dark:bg-slate-950/20">
                          <p className="font-normal text-slate-600 dark:text-slate-400">{faq.a}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-wider pt-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Verified Client-Side Architecture
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
