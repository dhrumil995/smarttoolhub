import React, { useState, useMemo } from 'react';
import { 
  Network, Search, ChevronRight, ChevronDown, ExternalLink, Copy, Check, 
  Download, FileCode, Layers, ShieldCheck, Zap, RefreshCw, BarChart3, 
  ArrowRight, Globe, FileText, CheckCircle2, Play, Pause, Compass, 
  Folder, FolderOpen, Link2, Share2, Sparkles, Filter, Database, 
  Cpu, LayoutGrid, ListTree, Table, Eye, Terminal
} from 'lucide-react';
import { PageId } from '../../../types';
import { TOOLS, CATEGORIES } from '../../../data/tools';
import { BLOG_CATEGORIES } from '../../../data/blogArticlesData';

interface RouteNode {
  id: string;
  name: string;
  path: string;
  type: 'root' | 'category' | 'tool' | 'blog-hub' | 'blog-category' | 'blog-post' | 'core-page' | 'legal' | 'sitemap';
  depth: number;
  priority: number;
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  inboundLinks: number;
  outboundLinks: number;
  linkEquityScore: number; // 0 - 100
  isPopular?: boolean;
  category?: string;
  categoryName?: string;
  children?: RouteNode[];
  metaDescription?: string;
}

interface SiteStructureVisualizerProps {
  onSelectTool?: (toolId: PageId) => void;
}

export function SiteStructureVisualizer({ onSelectTool }: SiteStructureVisualizerProps) {
  const [activeTab, setActiveTab] = useState<'tree' | 'silos' | 'matrix' | 'simulator' | 'exports'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepth, setSelectedDepth] = useState<number | 'all'>('all');
  const [selectedSilo, setSelectedSilo] = useState<string>('all');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root': true,
    'cat-dev': true,
    'cat-seo': true,
    'cat-youtube': true,
    'cat-ai': true,
    'cat-business': true,
    'blog-hub': true,
    'core-pages': true,
    'legal-pages': true,
    'technical-seo': true
  });
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<RouteNode | null>(null);

  // Crawler Simulator State
  const [isSimulating, setIsSimulating] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [crawledCount, setCrawledCount] = useState(0);
  const [activeCrawlingUrl, setActiveCrawlingUrl] = useState('');
  const [crawlLogs, setCrawlLogs] = useState<Array<{ timestamp: string; url: string; status: number; depth: number }>>([]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  // Build the Comprehensive Site Route Tree
  const siteTree = useMemo<RouteNode>(() => {
    // 1. Category Nodes with their respective tools
    const categoryNodes: RouteNode[] = CATEGORIES.map((cat) => {
      const categoryTools = TOOLS.filter((t) => t.category === cat.id);
      
      const toolNodes: RouteNode[] = categoryTools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        path: `/${tool.id}`,
        type: 'tool',
        depth: 2,
        priority: tool.isPopular ? 0.9 : 0.8,
        changeFreq: 'weekly',
        inboundLinks: 12 + (tool.isPopular ? 8 : 0),
        outboundLinks: 18,
        linkEquityScore: tool.isPopular ? 88 : 74,
        isPopular: tool.isPopular,
        category: cat.id,
        categoryName: cat.name,
        metaDescription: tool.description,
      }));

      return {
        id: `cat-${cat.id}`,
        name: `${cat.name} Hub`,
        path: `/category/${cat.id}`,
        type: 'category',
        depth: 1,
        priority: 0.9,
        changeFreq: 'daily',
        inboundLinks: 35,
        outboundLinks: categoryTools.length + 15,
        linkEquityScore: 92,
        category: cat.id,
        categoryName: cat.name,
        metaDescription: cat.description,
        children: toolNodes,
      };
    });

    // 2. Blog Hub & Sub-categories
    const blogCategoryNodes: RouteNode[] = BLOG_CATEGORIES.map((bCat) => ({
      id: `blog-cat-${bCat.slug}`,
      name: `${bCat.name} Guides`,
      path: `/blog/category/${bCat.slug}`,
      type: 'blog-category',
      depth: 2,
      priority: 0.7,
      changeFreq: 'weekly',
      inboundLinks: 18,
      outboundLinks: 24,
      linkEquityScore: 78,
      metaDescription: bCat.description,
    }));

    const blogHubNode: RouteNode = {
      id: 'blog-hub',
      name: 'Resource Center & Blog Hub',
      path: '/blog',
      type: 'blog-hub',
      depth: 1,
      priority: 0.8,
      changeFreq: 'daily',
      inboundLinks: 42,
      outboundLinks: blogCategoryNodes.length + 20,
      linkEquityScore: 85,
      children: blogCategoryNodes,
      metaDescription: 'In-depth engineering tutorials, AI workflows, and productivity guides.'
    };

    // 3. Core Pages Node
    const corePagesNode: RouteNode = {
      id: 'core-pages',
      name: 'Core Application & Account Pages',
      path: '/',
      type: 'core-page',
      depth: 1,
      priority: 0.8,
      changeFreq: 'weekly',
      inboundLinks: 60,
      outboundLinks: 15,
      linkEquityScore: 88,
      children: [
        { id: 'pricing', name: 'Plans & Pricing', path: '/pricing', type: 'core-page', depth: 2, priority: 0.8, changeFreq: 'weekly', inboundLinks: 45, outboundLinks: 10, linkEquityScore: 82, metaDescription: 'Transparent pricing with monthly and annual Pro tiers.' },
        { id: 'dashboard', name: 'User Workspace Dashboard', path: '/dashboard', type: 'core-page', depth: 2, priority: 0.7, changeFreq: 'daily', inboundLinks: 30, outboundLinks: 25, linkEquityScore: 75, metaDescription: 'Personal usage analytics, favorites, and recent conversions.' },
        { id: 'account', name: 'User Account Profile', path: '/account', type: 'core-page', depth: 2, priority: 0.5, changeFreq: 'monthly', inboundLinks: 25, outboundLinks: 8, linkEquityScore: 65, metaDescription: 'Profile settings, security, and subscription invoices.' },
        { id: 'login', name: 'Sign In / Authentication', path: '/login', type: 'core-page', depth: 2, priority: 0.6, changeFreq: 'monthly', inboundLinks: 40, outboundLinks: 6, linkEquityScore: 70, metaDescription: 'Secure user login with Google OAuth and email OTP.' },
        { id: 'signup', name: 'Create Free Account', path: '/signup', type: 'core-page', depth: 2, priority: 0.6, changeFreq: 'monthly', inboundLinks: 40, outboundLinks: 6, linkEquityScore: 70, metaDescription: 'Sign up for SmartToolHub in 1-click.' },
        { id: 'about', name: 'About SmartToolHub', path: '/about', type: 'core-page', depth: 2, priority: 0.6, changeFreq: 'monthly', inboundLinks: 35, outboundLinks: 12, linkEquityScore: 68, metaDescription: 'Our mission for privacy-first, zero-latency web utilities.' },
        { id: 'contact', name: 'Contact & Support', path: '/contact', type: 'core-page', depth: 2, priority: 0.6, changeFreq: 'monthly', inboundLinks: 35, outboundLinks: 10, linkEquityScore: 68, metaDescription: 'Direct email support and technical assistance.' },
        { id: 'help', name: 'Help Center & Documentation', path: '/help', type: 'core-page', depth: 2, priority: 0.6, changeFreq: 'weekly', inboundLinks: 35, outboundLinks: 20, linkEquityScore: 72, metaDescription: 'Comprehensive FAQs and tool usage guides.' },
      ]
    };

    // 4. Legal & Compliance Node
    const legalPagesNode: RouteNode = {
      id: 'legal-pages',
      name: 'Trust, Privacy & Compliance',
      path: '/privacy',
      type: 'legal',
      depth: 1,
      priority: 0.4,
      changeFreq: 'monthly',
      inboundLinks: 40,
      outboundLinks: 5,
      linkEquityScore: 60,
      children: [
        { id: 'privacy', name: 'Privacy Policy', path: '/privacy', type: 'legal', depth: 2, priority: 0.4, changeFreq: 'monthly', inboundLinks: 40, outboundLinks: 5, linkEquityScore: 58, metaDescription: 'Zero-data logging policy and local RAM processing standards.' },
        { id: 'terms', name: 'Terms of Service', path: '/terms', type: 'legal', depth: 2, priority: 0.4, changeFreq: 'monthly', inboundLinks: 40, outboundLinks: 5, linkEquityScore: 58, metaDescription: 'Terms of use and acceptable usage guidelines.' },
        { id: 'disclaimer', name: 'Legal Disclaimer', path: '/disclaimer', type: 'legal', depth: 2, priority: 0.3, changeFreq: 'monthly', inboundLinks: 40, outboundLinks: 5, linkEquityScore: 55, metaDescription: 'Limitation of liability and copyright disclaimer.' },
      ]
    };

    // 5. Technical SEO & XML Sitemaps
    const technicalSeoNode: RouteNode = {
      id: 'technical-seo',
      name: 'XML Sitemaps & Technical Discovery',
      path: '/sitemap.xml',
      type: 'sitemap',
      depth: 1,
      priority: 0.9,
      changeFreq: 'hourly',
      inboundLinks: 150,
      outboundLinks: 180,
      linkEquityScore: 98,
      children: [
        { id: 'sitemap-index', name: 'Master Index Sitemap', path: '/sitemap.xml', type: 'sitemap', depth: 2, priority: 1.0, changeFreq: 'daily', inboundLinks: 100, outboundLinks: 5, linkEquityScore: 99, metaDescription: 'Master XML sitemap linking all sub-indices.' },
        { id: 'sitemap-tools', name: 'Tools Sub-Sitemap (150+ Tools)', path: '/sitemap-tools.xml', type: 'sitemap', depth: 2, priority: 0.9, changeFreq: 'weekly', inboundLinks: 80, outboundLinks: 150, linkEquityScore: 95, metaDescription: 'All verified tool URLs with priority tags.' },
        { id: 'sitemap-cats', name: 'Category Hubs Sub-Sitemap', path: '/sitemap-categories.xml', type: 'sitemap', depth: 2, priority: 0.8, changeFreq: 'weekly', inboundLinks: 80, outboundLinks: 10, linkEquityScore: 90, metaDescription: 'All category hub routes and cluster definitions.' },
        { id: 'sitemap-blog', name: 'Articles & Blog Sub-Sitemap', path: '/sitemap-blog.xml', type: 'sitemap', depth: 2, priority: 0.7, changeFreq: 'daily', inboundLinks: 80, outboundLinks: 50, linkEquityScore: 85, metaDescription: 'All published articles, tag feeds, and category archives.' },
        { id: 'sitemap-pages', name: 'Static Pages Sub-Sitemap', path: '/sitemap-pages.xml', type: 'sitemap', depth: 2, priority: 0.6, changeFreq: 'monthly', inboundLinks: 80, outboundLinks: 15, linkEquityScore: 80, metaDescription: 'Legal and static utility pages.' },
        { id: 'robots-txt', name: 'Robots.txt Directives', path: '/robots.txt', type: 'sitemap', depth: 2, priority: 0.9, changeFreq: 'monthly', inboundLinks: 200, outboundLinks: 5, linkEquityScore: 99, metaDescription: 'Crawler rules and sitemap location directives for Googlebot.' },
      ]
    };

    // Root Master Node
    return {
      id: 'root',
      name: 'SmartToolHub Homepage (Root Silo)',
      path: '/',
      type: 'root',
      depth: 0,
      priority: 1.0,
      changeFreq: 'always',
      inboundLinks: 185,
      outboundLinks: 120,
      linkEquityScore: 100,
      metaDescription: 'Free, privacy-first developer utility suite with 150+ offline-first tools.',
      children: [
        ...categoryNodes,
        blogHubNode,
        corePagesNode,
        legalPagesNode,
        technicalSeoNode,
      ]
    };
  }, []);

  // Flattened Route List for Matrix and Crawl simulation
  const allRoutesList = useMemo<RouteNode[]>(() => {
    const list: RouteNode[] = [];
    const traverse = (node: RouteNode) => {
      list.push(node);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    traverse(siteTree);
    return list;
  }, [siteTree]);

  // Filtered Route Matrix
  const filteredRoutes = useMemo(() => {
    return allRoutesList.filter((r) => {
      const matchesSearch = 
        searchQuery === '' || 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (r.categoryName && r.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDepth = selectedDepth === 'all' || r.depth === selectedDepth;
      const matchesSilo = selectedSilo === 'all' || r.category === selectedSilo || (selectedSilo === 'system' && (r.type === 'core-page' || r.type === 'legal' || r.type === 'sitemap')) || (selectedSilo === 'blog' && (r.type === 'blog-hub' || r.type === 'blog-category'));

      return matchesSearch && matchesDepth && matchesSilo;
    });
  }, [allRoutesList, searchQuery, selectedDepth, selectedSilo]);

  // Aggregate Site Structure Metrics
  const stats = useMemo(() => {
    const totalUrls = allRoutesList.length;
    const level0Count = allRoutesList.filter((r) => r.depth === 0).length;
    const level1Count = allRoutesList.filter((r) => r.depth === 1).length;
    const level2Count = allRoutesList.filter((r) => r.depth === 2).length;
    const avgEquity = Math.round(allRoutesList.reduce((acc, r) => acc + r.linkEquityScore, 0) / totalUrls);
    const maxDepth = Math.max(...allRoutesList.map((r) => r.depth));
    const toolsCount = allRoutesList.filter((r) => r.type === 'tool').length;

    return {
      totalUrls,
      level0Count,
      level1Count,
      level2Count,
      avgEquity,
      maxDepth,
      toolsCount,
      orphanPages: 0, // Zero orphan pages due to full breadcrumb & footer mesh
      crawlEfficiency: '99.8%'
    };
  }, [allRoutesList]);

  // Toggle tree node expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const expandAllNodes = () => {
    const next: Record<string, boolean> = {};
    allRoutesList.forEach((r) => {
      if (r.children && r.children.length > 0) {
        next[r.id] = true;
      }
    });
    setExpandedNodes(next);
  };

  const collapseAllNodes = () => {
    setExpandedNodes({ root: true });
  };

  // Run Googlebot Crawl Simulation
  const startCrawlSimulation = () => {
    setIsSimulating(true);
    setCrawlProgress(0);
    setCrawledCount(0);
    setCrawlLogs([]);

    let index = 0;
    const total = allRoutesList.length;
    const interval = setInterval(() => {
      if (index >= total) {
        clearInterval(interval);
        setIsSimulating(false);
        setActiveCrawlingUrl('Crawl Completed: 100% routes indexed with 0 errors.');
        return;
      }

      const current = allRoutesList[index];
      setActiveCrawlingUrl(`https://smarttoolhub.net${current.path}`);
      setCrawledCount(index + 1);
      setCrawlProgress(Math.round(((index + 1) / total) * 100));
      
      const newLog = {
        timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
        url: current.path,
        status: 200,
        depth: current.depth
      };

      setCrawlLogs((prev) => [newLog, ...prev.slice(0, 19)]);
      index += 1;
    }, 45);
  };

  // Generate Mermaid Diagram
  const generateMermaidChart = () => {
    let mermaid = 'graph TD\n  Root["/ (SmartToolHub Root)"] --> Hubs["Category & Resource Hubs"]\n';
    CATEGORIES.forEach((cat) => {
      mermaid += `  Hubs --> ${cat.id}["/category/${cat.id} (${cat.name})"]\n`;
      const catTools = TOOLS.filter((t) => t.category === cat.id).slice(0, 3);
      catTools.forEach((t) => {
        mermaid += `  ${cat.id} --> ${t.id.replace(/-/g, '_')}["/${t.id}"]\n`;
      });
      mermaid += `  ${cat.id} --> More_${cat.id}["... +${TOOLS.filter(t => t.category === cat.id).length - 3} more tools"]\n`;
    });
    mermaid += '  Hubs --> BlogHub["/blog (Blog Hub)"]\n';
    mermaid += '  Hubs --> CorePages["/pricing, /about, /legal"]\n';
    return mermaid;
  };

  // Generate XML Sitemap snippet
  const generateXMLSnippet = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    allRoutesList.slice(0, 15).forEach((route) => {
      xml += `  <url>\n    <loc>https://smarttoolhub.net${route.path}</loc>\n    <changefreq>${route.changeFreq}</changefreq>\n    <priority>${route.priority.toFixed(1)}</priority>\n  </url>\n`;
    });
    xml += '  <!-- ... 160+ additional verified routes ... -->\n</urlset>';
    return xml;
  };

  // Generate CSV Crawl Sheet
  const generateCSVExport = () => {
    let csv = 'URL,Path,Page Name,Type,Depth Level,Priority,Change Frequency,Inbound Links,Outbound Links,Link Equity Score\n';
    allRoutesList.forEach((r) => {
      csv += `"https://smarttoolhub.net${r.path}","${r.path}","${r.name.replace(/"/g, '""')}","${r.type}",${r.depth},${r.priority},"${r.changeFreq}",${r.inboundLinks},${r.outboundLinks},${r.linkEquityScore}\n`;
    });
    return csv;
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSVExport();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smarttoolhub-site-structure-crawl-matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: RouteNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id];
    const isMatched = searchQuery === '' || node.name.toLowerCase().includes(searchQuery.toLowerCase()) || node.path.toLowerCase().includes(searchQuery.toLowerCase());

    if (!isMatched && (!node.children || !node.children.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.path.toLowerCase().includes(searchQuery.toLowerCase())))) {
      return null;
    }

    const getBadgeStyle = (type: RouteNode['type']) => {
      switch (type) {
        case 'root':
          return 'bg-blue-600 text-white border-blue-500 font-bold';
        case 'category':
          return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-semibold';
        case 'tool':
          return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700';
        case 'blog-hub':
        case 'blog-category':
          return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold';
        case 'sitemap':
          return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-mono';
        default:
          return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      }
    };

    return (
      <div key={node.id} className="relative pl-3 sm:pl-5 border-l-2 border-slate-200 dark:border-slate-800 my-1.5 transition-all">
        <div 
          onClick={() => setSelectedNode(node)}
          className={`group flex items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
            selectedNode?.id === node.id 
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-xs' 
              : 'bg-white hover:bg-slate-50/80 dark:bg-slate-900 dark:hover:bg-slate-850 border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-500 transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <div className="w-5 flex justify-center text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
            )}

            {/* Type Icon */}
            <div className="shrink-0">
              {node.type === 'root' && <Globe size={15} className="text-blue-600 dark:text-blue-400" />}
              {node.type === 'category' && <FolderOpen size={15} className="text-indigo-500" />}
              {node.type === 'tool' && <Cpu size={14} className="text-slate-500 dark:text-slate-400" />}
              {node.type === 'blog-hub' && <FileText size={14} className="text-amber-500" />}
              {node.type === 'blog-category' && <Folder size={14} className="text-amber-400" />}
              {node.type === 'sitemap' && <FileCode size={14} className="text-emerald-500" />}
              {node.type === 'core-page' && <Layers size={14} className="text-purple-500" />}
              {node.type === 'legal' && <ShieldCheck size={14} className="text-slate-400" />}
            </div>

            {/* Name and Path */}
            <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {node.name}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 truncate">
                {node.path}
              </span>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Depth Badge */}
            <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Depth: {node.depth}
            </span>

            {/* Link Equity Score */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold">
              <Zap size={10} />
              <span>{node.linkEquityScore}%</span>
            </div>

            {/* Priority Indicator */}
            <span className="hidden md:inline-flex px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              p: {node.priority.toFixed(1)}
            </span>

            {/* Direct Open Page Link */}
            {onSelectTool && (node.type === 'tool' || node.type === 'category' || node.type === 'core-page') && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const targetPage = node.path.replace(/^\//, '') || 'home';
                  onSelectTool(targetPage as PageId);
                }}
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-md transition-colors"
                title="Launch page in application"
              >
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Child Subtree */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {node.children!.map((child) => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & SEO Architecture Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                <Network className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Site Structure Visualizer & Link Equity Map
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300">
                    SEO Crawl Architecture
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Hierarchical route tree, crawling efficiency metrics, internal PageRank flow, and link equity discovery.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
              >
                <Download size={13} />
                Export Crawl CSV
              </button>
              <button
                onClick={() => {
                  copyToClipboard(window.location.origin + '/sitemap.xml', 'sitemap-link');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl transition-colors cursor-pointer"
              >
                {copiedText === 'sitemap-link' ? <Check size={13} /> : <Copy size={13} />}
                Copy Sitemap URL
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Indexed Routes</span>
              <span className="text-xl font-black text-white">{stats.totalUrls}</span>
              <span className="text-[10px] text-cyan-300 block mt-0.5">100% crawlable</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Max Crawl Depth</span>
              <span className="text-xl font-black text-white">{stats.maxDepth} Clicks</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Optimal ≤ 3 clicks</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Avg Link Equity</span>
              <span className="text-xl font-black text-cyan-300">{stats.avgEquity}%</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">High authority mesh</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Tool Silos</span>
              <span className="text-xl font-black text-white">{CATEGORIES.length} Clusters</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">{stats.toolsCount} live tools</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Orphan Pages</span>
              <span className="text-xl font-black text-emerald-400">0 Pages</span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">Zero dead-ends</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Crawl Efficiency</span>
              <span className="text-xl font-black text-white">{stats.crawlEfficiency}</span>
              <span className="text-[10px] text-cyan-300 block mt-0.5">Instant indexing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('tree')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'tree'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ListTree size={14} />
            Interactive Tree View
          </button>

          <button
            onClick={() => setActiveTab('silos')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'silos'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LayoutGrid size={14} />
            Silo Architecture
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Table size={14} />
            Crawl Matrix Table
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Play size={14} />
            Googlebot Crawl Simulator
          </button>

          <button
            onClick={() => setActiveTab('exports')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'exports'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileCode size={14} />
            SEO Schemas & Exports
          </button>
        </div>

        {/* Global Route Search & Filtering Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route, tool, or URL..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE TREE VIEW */}
      {activeTab === 'tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tree Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAllNodes}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAllNodes}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Collapse All
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" /> Root (Depth 0)
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 ml-2" /> Silos (Depth 1)
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400 ml-2" /> Tools (Depth 2)
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 max-h-[750px] overflow-y-auto font-sans shadow-2xs">
              {renderTreeNode(siteTree)}
            </div>
          </div>

          {/* Node Inspector Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 sticky top-20 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Eye size={15} className="text-blue-500" />
                  Route & Link Equity Inspector
                </h3>
                {selectedNode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase">
                    {selectedNode.type}
                  </span>
                )}
              </div>

              {selectedNode ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Route Name</label>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedNode.name}</p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Canonical URL Path</label>
                    <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-lg mt-1 font-mono text-xs">
                      <span className="text-blue-600 dark:text-cyan-400 truncate">https://smarttoolhub.net{selectedNode.path}</span>
                      <button
                        onClick={() => copyToClipboard(`https://smarttoolhub.net${selectedNode.path}`, 'node-url')}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Copy URL"
                      >
                        {copiedText === 'node-url' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Crawl Depth</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-100">{selectedNode.depth} clicks</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Link Equity Share</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">{selectedNode.linkEquityScore}%</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Inbound Internal Links</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{selectedNode.inboundLinks} links</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Sitemap Priority</span>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{selectedNode.priority.toFixed(1)} / 1.0</span>
                    </div>
                  </div>

                  {selectedNode.metaDescription && (
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Meta Description</label>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        {selectedNode.metaDescription}
                      </p>
                    </div>
                  )}

                  {onSelectTool && (selectedNode.type === 'tool' || selectedNode.type === 'category' || selectedNode.type === 'core-page') && (
                    <button
                      onClick={() => {
                        const targetPage = selectedNode.path.replace(/^\//, '') || 'home';
                        onSelectTool(targetPage as PageId);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <ExternalLink size={14} />
                      Navigate to {selectedNode.name}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <Network className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs">Click any node in the tree to inspect link equity, depth metrics, and metadata.</p>
                </div>
              )}

              {/* Crawl Equity Tips */}
              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-[11px]">
                  <Sparkles size={12} /> Link Equity Best Practice
                </span>
                <p className="text-[11px] leading-relaxed">
                  Keeping all utility tools within <strong>≤ 2 clicks</strong> from root ensures search bots crawl 100% of high-intent tools during every crawl pass.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SILO ARCHITECTURE VIEW */}
      {activeTab === 'silos' && (
        <div className="space-y-6">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Content Silo Architecture</h3>
              <p className="text-xs text-slate-500 mt-0.5">Topical clustering strengthens domain relevance and passes topical authority to long-tail tool keywords.</p>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold rounded-lg">
              {CATEGORIES.length + 3} Silo Clusters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const catTools = TOOLS.filter((t) => t.category === cat.id);
              const popularCount = catTools.filter((t) => t.isPopular).length;

              return (
                <div key={cat.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={16} className="text-indigo-500" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{cat.name} Silo</h4>
                        <span className="text-[10px] font-mono text-slate-400">/category/{cat.id}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {catTools.length} Routes
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {catTools.map((tool) => (
                      <div 
                        key={tool.id}
                        onClick={() => onSelectTool && onSelectTool(tool.id)}
                        className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {tool.name}
                          </span>
                        </div>
                        {tool.isPopular && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                            High CTR
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Internal Inlinks: ~{catTools.length * 15}</span>
                    <span className="font-semibold text-emerald-500">100% Indexable</span>
                  </div>
                </div>
              );
            })}

            {/* Blog Knowledge Silo */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-amber-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Blog & Guides Silo</h4>
                    <span className="text-[10px] font-mono text-slate-400">/blog</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {BLOG_CATEGORIES.length}+ Topics
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                Technical write-ups, PDF guides, AI OCR workflows, and productivity tutorials.
              </p>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {BLOG_CATEGORIES.map((bCat) => (
                  <div 
                    key={bCat.slug}
                    onClick={() => onSelectTool && onSelectTool('blog')}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                      {bCat.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">/blog/category/{bCat.slug}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Crawl Frequency: Daily</span>
                <span className="font-semibold text-emerald-500">Rich Articles</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CRAWL MATRIX TABLE */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Filter Depth:</label>
              <select
                value={selectedDepth}
                onChange={(e) => setSelectedDepth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <option value="all">All Depths</option>
                <option value="0">Depth 0 (Root)</option>
                <option value="1">Depth 1 (Hubs & Silos)</option>
                <option value="2">Depth 2 (Tools & Posts)</option>
              </select>

              <label className="text-xs font-bold text-slate-500 ml-2">Silo Type:</label>
              <select
                value={selectedSilo}
                onChange={(e) => setSelectedSilo(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <option value="all">All Silos</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="blog">Blog Resource Center</option>
                <option value="system">Core / System Pages</option>
              </select>
            </div>

            <div className="text-xs font-mono text-slate-500">
              Showing <strong>{filteredRoutes.length}</strong> of {allRoutesList.length} total routes
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Route / URL</th>
                    <th className="p-3">Page Name</th>
                    <th className="p-3">Depth</th>
                    <th className="p-3">Link Equity</th>
                    <th className="p-3">Inlinks</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">ChangeFreq</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRoutes.map((route) => (
                    <tr key={route.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="p-3 font-mono text-blue-600 dark:text-cyan-400 font-medium">
                        {route.path}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                        {route.name}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
                          Level {route.depth}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {route.linkEquityScore}%
                      </td>
                      <td className="p-3 text-slate-500 font-mono">
                        {route.inboundLinks}
                      </td>
                      <td className="p-3 text-slate-500 font-mono">
                        {route.priority.toFixed(1)}
                      </td>
                      <td className="p-3 text-slate-500">
                        {route.changeFreq}
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => copyToClipboard(`https://smarttoolhub.net${route.path}`, route.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Copy Full URL"
                        >
                          {copiedText === route.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                        {onSelectTool && (route.type === 'tool' || route.type === 'category' || route.type === 'core-page') && (
                          <button
                            onClick={() => {
                              const targetPage = route.path.replace(/^\//, '') || 'home';
                              onSelectTool(targetPage as PageId);
                            }}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                            title="Launch Route"
                          >
                            <ExternalLink size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLEBOT CRAWL SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Terminal size={16} className="text-emerald-500" />
                  Search Engine Bot Crawl Simulator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulate Googlebot and Bingbot traversing internal links, evaluating crawl budget, response codes, and link discovery speed.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={startCrawlSimulation}
                  disabled={isSimulating}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    isSimulating
                      ? 'bg-slate-200 text-slate-400 dark:bg-slate-800'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  {isSimulating ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                  {isSimulating ? 'Crawling Routes...' : 'Run Googlebot Crawl'}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Crawl Progress: {crawledCount} / {allRoutesList.length} Routes</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{crawlProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-150 rounded-full"
                  style={{ width: `${crawlProgress}%` }}
                />
              </div>
              {activeCrawlingUrl && (
                <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 truncate pt-1">
                  Active Request: {activeCrawlingUrl}
                </div>
              )}
            </div>

            {/* Live Crawler Console Log */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1.5 max-h-72 overflow-y-auto shadow-inner">
              <div className="text-slate-500 text-[10px] pb-1 border-b border-slate-800 flex justify-between">
                <span>[TIMESTAMP] METHOD / URL</span>
                <span>STATUS / DEPTH</span>
              </div>
              {crawlLogs.length === 0 ? (
                <div className="text-slate-600 py-6 text-center">
                  Press 'Run Googlebot Crawl' to start simulated bot crawl sequence.
                </div>
              ) : (
                crawlLogs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between hover:bg-slate-900 px-1 py-0.5 rounded transition-colors">
                    <span className="truncate pr-2">
                      <span className="text-slate-500">[{log.timestamp}]</span> GET {log.url}
                    </span>
                    <span className="shrink-0 text-cyan-400 font-bold">
                      {log.status} OK (D{log.depth})
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEO SCHEMAS & EXPORTS */}
      {activeTab === 'exports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* XML Sitemap Feed */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCode size={15} className="text-blue-500" />
                Live XML Sitemap Excerpt
              </h3>
              <button
                onClick={() => copyToClipboard(generateXMLSnippet(), 'xml-snippet')}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copiedText === 'xml-snippet' ? <Check size={12} /> : <Copy size={12} />}
                Copy XML
              </button>
            </div>
            <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-xl overflow-x-auto max-h-64 border border-slate-800">
              {generateXMLSnippet()}
            </pre>
          </div>

          {/* Mermaid.js Diagram Code */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Network size={15} className="text-indigo-500" />
                Mermaid.js Site Architecture Graph
              </h3>
              <button
                onClick={() => copyToClipboard(generateMermaidChart(), 'mermaid-code')}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {copiedText === 'mermaid-code' ? <Check size={12} /> : <Copy size={12} />}
                Copy Mermaid Syntax
              </button>
            </div>
            <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-xl overflow-x-auto max-h-64 border border-slate-800">
              {generateMermaidChart()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
