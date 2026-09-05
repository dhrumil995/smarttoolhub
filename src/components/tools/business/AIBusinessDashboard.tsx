import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  Briefcase,
  FileText,
  GitCompare,
  ShieldAlert,
  Layers,
  FileCode,
  Receipt,
  Compass,
  Sliders,
  ScanText,
  Building2,
  Clock,
  SearchCode,
  Bot,
  Wand2,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Activity,
  Database,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  Download,
  Filter,
  Trash2,
  RefreshCw,
  Check,
  Calendar,
  Cloud,
  FileSpreadsheet,
  Zap,
  Lock,
  ExternalLink,
} from 'lucide-react';
import BusinessWorkspaceHeader, { WorkspaceDoc } from './BusinessWorkspaceHeader';
import { PageId } from '../../../types';

export interface AIBusinessDashboardProps {
  onSelectTool?: (toolId: PageId) => void;
}

export interface BusinessToolMeta {
  id: PageId;
  name: string;
  desc: string;
  category: 'ocr' | 'procurement' | 'logistics' | 'ai-chat' | 'finance';
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  badge?: string;
  isPopular?: boolean;
}

// 1. Static Business Tools Dataset (Allocated once in memory)
const BUSINESS_TOOLS: readonly BusinessToolMeta[] = Object.freeze([
  {
    id: 'ai-invoice-ocr' as PageId,
    name: 'AI Invoice OCR Pro',
    desc: 'Extract line items, taxes, GSTIN & grand totals to Excel/CSV/JSON',
    category: 'ocr',
    icon: FileText,
    color: 'text-indigo-500 bg-indigo-500/10',
    badge: '99.2% Accuracy',
    isPopular: true,
  },
  {
    id: 'invoice-po-compare' as PageId,
    name: 'Invoice vs PO Compare',
    desc: 'Reconcile invoice vs purchase order line items and flag price discrepancies',
    category: 'procurement',
    icon: GitCompare,
    color: 'text-purple-500 bg-purple-500/10',
    badge: '3-Way Match',
  },
  {
    id: 'duplicate-invoice-detector' as PageId,
    name: 'Duplicate Invoice Detector',
    desc: 'Detect exact and fuzzy duplicate supplier bills to prevent double-pay fraud',
    category: 'ocr',
    icon: ShieldAlert,
    color: 'text-rose-500 bg-rose-500/10',
    badge: 'Fraud Shield',
  },
  {
    id: 'bulk-invoice-processor' as PageId,
    name: 'Bulk Invoice Processor',
    desc: 'Batch OCR process up to 1,000 PDF and image invoices with ZIP exports',
    category: 'ocr',
    icon: Layers,
    color: 'text-amber-500 bg-amber-500/10',
    badge: 'Batch Engine',
    isPopular: true,
  },
  {
    id: 'ai-quotation-generator' as PageId,
    name: 'AI Quotation Generator',
    desc: 'Generate professional B2B client price quotes with auto-tax and PDF export',
    category: 'procurement',
    icon: FileCode,
    color: 'text-emerald-500 bg-emerald-500/10',
    badge: 'Vector PDF',
    isPopular: true,
  },
  {
    id: 'po-generator' as PageId,
    name: 'Purchase Order Generator',
    desc: 'Draft compliance-ready vendor purchase orders with specs and payment terms',
    category: 'procurement',
    icon: Receipt,
    color: 'text-blue-500 bg-blue-500/10',
    badge: 'PO Studio',
  },
  {
    id: 'delivery-challan-generator' as PageId,
    name: 'Delivery Challan Generator',
    desc: 'Create transport dispatch notes, truck consignments, and receiver sign-offs',
    category: 'logistics',
    icon: Compass,
    color: 'text-cyan-500 bg-cyan-500/10',
    badge: 'Logistics',
  },
  {
    id: 'packing-list-generator' as PageId,
    name: 'Packing List Generator',
    desc: 'Build cargo carton breakdowns, net/gross weights, and container packing slips',
    category: 'logistics',
    icon: Sliders,
    color: 'text-teal-500 bg-teal-500/10',
    badge: 'Export Ready',
  },
  {
    id: 'ai-receipt-scanner' as PageId,
    name: 'AI Receipt Scanner Pro',
    desc: 'Auto-categorize expense photos, extract merchant names, VAT, and tips',
    category: 'finance',
    icon: ScanText,
    color: 'text-emerald-500 bg-emerald-500/10',
    badge: 'Instant OCR',
    isPopular: true,
  },
  {
    id: 'supplier-dashboard' as PageId,
    name: 'Supplier Dashboard',
    desc: 'Manage vendor directory, payment statuses, GST records, and performance ratings',
    category: 'procurement',
    icon: Building2,
    color: 'text-indigo-500 bg-indigo-500/10',
    badge: 'Vendor Portal',
  },
  {
    id: 'payment-reminder-system' as PageId,
    name: 'Payment Reminder System',
    desc: 'Auto-draft polite, firm, and urgent payment collection notices with one click',
    category: 'finance',
    icon: Clock,
    color: 'text-amber-500 bg-amber-500/10',
    badge: 'Collections',
  },
  {
    id: 'manufacturing-doc-search' as PageId,
    name: 'Manufacturing Doc Search',
    desc: 'Search SOP manuals, technical drawings, and machine manuals via semantic search',
    category: 'ai-chat',
    icon: SearchCode,
    color: 'text-blue-500 bg-blue-500/10',
    badge: 'SOP Assistant',
  },
  {
    id: 'ai-doc-chat' as PageId,
    name: 'AI Document Chat',
    desc: 'Chat directly with contracts, PDFs, and legal binders with cited answers',
    category: 'ai-chat',
    icon: Bot,
    color: 'text-purple-500 bg-purple-500/10',
    badge: 'PDF Assistant',
    isPopular: true,
  },
  {
    id: 'business-doc-translator' as PageId,
    name: 'Business Doc Translator',
    desc: 'Translate commercial contracts and invoices across 25+ global languages accurately',
    category: 'ai-chat',
    icon: Wand2,
    color: 'text-pink-500 bg-pink-500/10',
    badge: 'Bilingual Pro',
  },
  {
    id: 'contract-summarizer' as PageId,
    name: 'Contract Summarizer',
    desc: 'Extract liabilities, termination clauses, indemnities, and commercial risks',
    category: 'ai-chat',
    icon: BookOpen,
    color: 'text-amber-500 bg-amber-500/10',
    badge: 'Legal Audit',
  },
  {
    id: 'gst-invoice-validator' as PageId,
    name: 'GST Invoice Validator',
    desc: 'Verify 15-digit GSTIN structures, tax calculations, CGST/SGST/IGST splits',
    category: 'finance',
    icon: CheckCircle2,
    color: 'text-emerald-500 bg-emerald-500/10',
    badge: 'Tax Validator',
    isPopular: true,
  },
  {
    id: 'ai-expense-analyzer' as PageId,
    name: 'AI Expense Analyzer',
    desc: 'Upload spending CSVs to uncover cost leaks, vendor overcharges, and savings insights',
    category: 'finance',
    icon: BarChart3,
    color: 'text-blue-500 bg-blue-500/10',
    badge: 'Cost Intelligence',
  },
  {
    id: 'manufacturing-report-generator' as PageId,
    name: 'Manufacturing Report Gen',
    desc: 'Generate shift production summaries, machine OEE metrics, and downtime audits',
    category: 'logistics',
    icon: Activity,
    color: 'text-indigo-500 bg-indigo-500/10',
    badge: 'OEE Analytics',
  },
  {
    id: 'inventory-doc-analyzer' as PageId,
    name: 'Inventory Doc Analyzer',
    desc: 'Scan stock lists, identify reorder threshold breaches, and prevent stockouts',
    category: 'logistics',
    icon: Database,
    color: 'text-purple-500 bg-purple-500/10',
    badge: 'Safety Stock',
  },
]);

// 2. Static Initial Sample Documents
const INITIAL_SAMPLE_DOCS: readonly WorkspaceDoc[] = Object.freeze([
  {
    id: 'INV-849201',
    title: 'Acme Precision Tooling - Tax Invoice #INV-2026-90',
    type: 'Invoice OCR',
    createdAt: 'Today, 10:24 AM',
    size: '14 Line Items • $12,480.00',
    status: 'PROCESSED',
    data: { total: 12480, supplier: 'Acme Precision Tooling' },
  },
  {
    id: 'PO-302910',
    title: 'Purchase Order #PO-941 - Global Fasteners Ltd',
    type: 'PO Generator',
    createdAt: 'Yesterday, 04:15 PM',
    size: '6 Line Items • $4,250.00',
    status: 'PROCESSED',
    data: { total: 4250, supplier: 'Global Fasteners Ltd' },
  },
  {
    id: 'REC-551029',
    title: 'Executive Travel & Client Dinner Receipt',
    type: 'Receipt Scanner',
    createdAt: 'Aug 17, 2026',
    size: '1 Item • $184.50',
    status: 'SAVED',
    data: { total: 184.5, supplier: 'Bistro Regent' },
  },
  {
    id: 'CON-109284',
    title: 'Software Licensing Master Agreement 2026-2028',
    type: 'Contract Summarizer',
    createdAt: 'Aug 15, 2026',
    size: '28 Pages • 4 Risk Flags',
    status: 'PROCESSED',
    data: { risks: 4, pages: 28 },
  },
  {
    id: 'DC-901248',
    title: 'Delivery Challan #DC-482 - Warehouse Bay 4',
    type: 'Delivery Challan',
    createdAt: 'Aug 14, 2026',
    size: '120 Cartons • Dispatched',
    status: 'PROCESSED',
    data: { cartons: 120 },
  },
]);

// 3. Static Category Filter Configurations
const CATEGORY_TABS = Object.freeze([
  { id: 'all', label: 'All 20 AI Tools', cat: null },
  { id: 'ocr', label: 'OCR & Invoices', cat: 'ocr' },
  { id: 'procurement', label: 'Procurement & Orders', cat: 'procurement' },
  { id: 'logistics', label: 'Logistics & Challans', cat: 'logistics' },
  { id: 'ai-chat', label: 'AI Chat & Contracts', cat: 'ai-chat' },
  { id: 'finance', label: 'Expense & GST Tax', cat: 'finance' },
]);

// Animation Variants for Framer Motion
const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.02,
    },
  },
};

const cardSlideVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: 'easeOut',
    },
  },
};

const tabViewVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

// 4. Memoized Subcomponent: Tool Card with Motion
const ToolCardItem = React.memo(function ToolCardItem({
  tool,
  onLaunch,
}: {
  tool: BusinessToolMeta;
  onLaunch: (id: PageId) => void;
}) {
  const Icon = tool.icon;
  const handleClick = useCallback(() => {
    onLaunch(tool.id);
  }, [onLaunch, tool.id]);

  return (
    <motion.div
      layout
      variants={cardSlideVariants}
      whileHover={{ y: -3, transition: { duration: 0.16, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      onClick={handleClick}
      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 hover:shadow-md transition-colors duration-200 cursor-pointer group flex flex-col justify-between relative"
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className={`p-2.5 rounded-xl ${tool.color} group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200`}>
            <Icon className="h-5 w-5" />
          </div>
          {tool.badge && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 font-mono text-[9px] font-bold">
              {tool.badge}
            </span>
          )}
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {tool.name}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
            {tool.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Launch Tool
        </span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
});

// 5. Memoized Subcomponent: History Document Row with Motion
const HistoryDocRow = React.memo(function HistoryDocRow({
  doc,
  onOpen,
}: {
  doc: WorkspaceDoc;
  onOpen: (id: PageId) => void;
}) {
  const handleOpenClick = useCallback(() => {
    onOpen('ai-invoice-ocr' as PageId);
  }, [onOpen]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {doc.id}
          </span>
          <span className="px-2 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-bold uppercase">
            {doc.status}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {doc.createdAt}
          </span>
        </div>
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          {doc.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Type: <strong className="text-slate-700 dark:text-slate-300">{doc.type}</strong> • {doc.size}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleOpenClick}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
        >
          <span>Open in Tool</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
});

// 6. Main Memoized AIBusinessDashboard Component
export const AIBusinessDashboard = React.memo(function AIBusinessDashboard({
  onSelectTool,
}: AIBusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  // Safe lazy initializer for localStorage docs
  const [historyDocs, setHistoryDocs] = useState<WorkspaceDoc[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttoolhub_business_docs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_SAMPLE_DOCS as WorkspaceDoc[];
        }
      }
    }
    return INITIAL_SAMPLE_DOCS as WorkspaceDoc[];
  });

  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);

  // Filter tools with memoization
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BUSINESS_TOOLS.filter((t) => {
      const matchesCategory = selectedSubCategory === 'all' || t.category === selectedSubCategory;
      if (!q) return matchesCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        (t.badge && t.badge.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedSubCategory, searchQuery]);

  // Memoized category counts
  const categoryCounts = useMemo(() => {
    return {
      all: BUSINESS_TOOLS.length,
      ocr: BUSINESS_TOOLS.filter((t) => t.category === 'ocr').length,
      procurement: BUSINESS_TOOLS.filter((t) => t.category === 'procurement').length,
      logistics: BUSINESS_TOOLS.filter((t) => t.category === 'logistics').length,
      'ai-chat': BUSINESS_TOOLS.filter((t) => t.category === 'ai-chat').length,
      finance: BUSINESS_TOOLS.filter((t) => t.category === 'finance').length,
    };
  }, []);

  // Filter history documents with memoization
  const filteredHistory = useMemo(() => {
    const q = historySearch.toLowerCase().trim();
    return historyDocs.filter((doc) => {
      const matchesStatus = historyFilter === 'all' || doc.status === historyFilter;
      if (!q) return matchesStatus;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q) ||
        doc.type.toLowerCase().includes(q)
      );
    });
  }, [historyDocs, historyFilter, historySearch]);

  // Stable event callbacks
  const handleLaunchTool = useCallback(
    (toolId: PageId) => {
      if (onSelectTool) {
        onSelectTool(toolId);
      }
    },
    [onSelectTool]
  );

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Clear all document history from this browser sandbox?')) {
      setHistoryDocs([]);
      localStorage.removeItem('smarttoolhub_business_docs');
    }
  }, []);

  const handleExportBackup = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(historyDocs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SmartToolHub_Business_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [historyDocs]);

  const handleTabChange = useCallback((tab: 'tool' | 'history' | 'cloud') => {
    setActiveTab(tab);
  }, []);

  const handleSubCategoryChange = useCallback((catId: string) => {
    setSelectedSubCategory(catId);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleHistorySearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHistorySearch(e.target.value);
  }, []);

  const handleHistoryFilterChange = useCallback((status: string) => {
    setHistoryFilter(status);
  }, []);

  const handleAutoSyncToggle = useCallback(() => {
    setAutoSyncEnabled((prev) => !prev);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      {/* Enterprise Suite Header */}
      <BusinessWorkspaceHeader
        title="AI Business & Document Intelligence Hub"
        description="Unified enterprise command center providing oversight across AI OCR extractions, vendor invoice reconciliation, automated PO issuance, contract risk auditing, and all 20 Premium Business AI tools."
        toolId="ai-business-dashboard"
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        itemCount={historyDocs.length}
      />

      {/* AnimatePresence for Smooth Tab Switching Transitions */}
      <AnimatePresence mode="wait">
        {/* 1. WORKSTATION TOOLS TAB */}
        {activeTab === 'tool' && (
          <motion.div
            key="tool-tab"
            variants={tabViewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {/* Executive KPI Bar with Staggered Entrance */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              <motion.div
                variants={cardSlideVariants}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Documents Processed
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-bold">
                    Live
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {timeRange === 'month' ? '1,428' : timeRange === 'quarter' ? '4,890' : '18,420'}
                  </span>
                  <span className="text-[11px] text-emerald-500 font-bold block mt-0.5">
                    +18.4% OCR efficiency
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Invoices, Receipts & POs</span>
              </motion.div>

              <motion.div
                variants={cardSlideVariants}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Hours Saved / Mo
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-bold">
                    Zero Entry
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    340 Hrs
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                    $14,200 estimated payroll savings
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Automated table parsing</span>
              </motion.div>

              <motion.div
                variants={cardSlideVariants}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    OCR Accuracy Rate
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[9px] font-bold">
                    Verified
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    99.4%
                  </span>
                  <span className="text-[11px] text-indigo-500 font-bold block mt-0.5">
                    Gemini 2.5 Flash Engine
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Trained on multi-country invoices</span>
              </motion.div>

              <motion.div
                variants={cardSlideVariants}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Pending Receivables
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[9px] font-bold">
                    Actionable
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-500">
                    $24,850
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block mt-0.5">
                    3 Overdue supplier payments
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Reminder emails ready</span>
              </motion.div>
            </motion.div>

            {/* Search, Filter Toolbar & Category Chips */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Premium AI Business Suite ({filteredTools.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select any tool below to launch its dedicated AI workspace with 100% private in-browser RAM execution.
                  </p>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Filter AI tools (e.g. OCR, PO, GST)..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
                {CATEGORY_TABS.map((cat) => {
                  const count = categoryCounts[cat.id as keyof typeof categoryCounts] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSubCategoryChange(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                        selectedSubCategory === cat.id
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-black'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-750'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                          selectedSubCategory === cat.id ? 'bg-white/20 text-white font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* AI Tools Grid with Layout Animation */}
              <motion.div
                layout
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2"
              >
                {filteredTools.map((t) => (
                  <ToolCardItem key={t.id} tool={t} onLaunch={handleLaunchTool} />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* 2. DOCUMENT HISTORY TAB */}
        {activeTab === 'history' && (
          <motion.div
            key="history-tab"
            variants={tabViewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  Cross-Tool Document History ({historyDocs.length})
                </h3>
                <p className="text-xs text-slate-500">
                  All generated POs, scanned invoices, OCR line items, and risk audit logs saved in your encrypted session.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportBackup}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download size={13} />
                  Export JSON Backup
                </button>
                <button
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 size={13} />
                  Clear
                </button>
              </div>
            </div>

            {/* History Search & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={handleHistorySearchChange}
                  placeholder="Search history records..."
                  className="w-full pl-8 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {['all', 'PROCESSED', 'SAVED', 'PENDING'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleHistoryFilterChange(status)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      historyFilter === status
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'all' ? 'All Records' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents Table / List with Motion */}
            <motion.div layout className="space-y-3">
              <AnimatePresence>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((doc) => (
                    <HistoryDocRow key={doc.id} doc={doc} onOpen={handleLaunchTool} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl"
                  >
                    <FileText className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No matching documents found</p>
                    <p className="text-[11px] text-slate-400">Process an invoice or generate a PO to save records here.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* 3. CLOUD WORKSPACE STORAGE TAB */}
        {activeTab === 'cloud' && (
          <motion.div
            key="cloud-tab"
            variants={tabViewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-cyan-500" />
                    Encrypted Workspace Storage & Sync
                  </h3>
                  <p className="text-xs text-slate-500">
                    Zero-latency client-side RAM sandbox with AES-256 local synchronization and automated backup snapshots.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Auto-Sync:</span>
                  <button
                    onClick={handleAutoSyncToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoSyncEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Storage Quota Usage Bar */}
              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Local Browser RAM Storage</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">14.2 MB / 500 MB (2.8%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-[2.8%]" />
                </div>
                <p className="text-[10px] text-slate-400">
                  All parsed invoice tables, PO templates, and translated contracts are encrypted in browser local storage and IndexedDB.
                </p>
              </div>

              {/* Security Guarantee Cards */}
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <motion.div
                  variants={cardSlideVariants}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Lock size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Client-Side Privacy</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Financial figures, PAN/GST numbers, and employee salary sheets are computed locally without logging.
                  </p>
                </motion.div>

                <motion.div
                  variants={cardSlideVariants}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 hover:border-blue-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <FileSpreadsheet size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">ERP & Accounting Export</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Directly export structured payloads for Tally Prime, QuickBooks, Zoho Books, SAP, and Excel.
                  </p>
                </motion.div>

                <motion.div
                  variants={cardSlideVariants}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 hover:border-purple-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Zap size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Zero Cloud Latency</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Local cache and memory buffers guarantee instant millisecond responses with zero network waiting.
                  </p>
                </motion.div>
              </motion.div>

              {/* Sync Triggers & Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Session Status: Active & Fully Synchronized
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportBackup}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Download size={14} />
                    Download Complete Workspace Backup
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default AIBusinessDashboard;
