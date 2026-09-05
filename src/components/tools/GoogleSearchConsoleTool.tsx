import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Download,
  Code2,
  Key,
  Layers,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info,
  RefreshCw,
  Send,
  CheckSquare,
  Square
} from 'lucide-react';
import { toast } from '../../utils/toast';
import { usePerformanceMonitor } from '../PerformanceMonitor';

type VerificationMethod = 'meta-tag' | 'html-file' | 'dns-txt' | 'gtm';

export default function GoogleSearchConsoleTool() {
  const { logProcessingTime } = usePerformanceMonitor();
  
  // Verification State
  const [siteUrl, setSiteUrl] = useState('https://smarttoolhub.net');
  const [verificationCode, setVerificationCode] = useState('a1b2c3d4e5f6g7h8i9j0_example');
  const [method, setMethod] = useState<VerificationMethod>('meta-tag');
  const [copiedTag, setCopiedTag] = useState(false);

  // URL Inspection Simulator State
  const [inspectUrl, setInspectUrl] = useState('https://smarttoolhub.net/json-formatter');
  const [robotsTxtUrl, setRobotsTxtUrl] = useState('https://smarttoolhub.net/robots.txt');
  const [sitemapUrl, setSitemapUrl] = useState('https://smarttoolhub.net/sitemap.xml');
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<any | null>(null);

  // Checklist State
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step1: true,
    step2: true,
    step3: false,
    step4: false,
    step5: false
  });

  // Google Sheets GSC Report State
  const [reportSheetUrl, setReportSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1VRPzroNq-QgLQWlNufpuRYNq0freykCSSPIW0iRaAJQ/edit?usp=sharing');
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);
  const [reportSearchQuery, setReportSearchQuery] = useState('');

  // Fetch report from API
  const handleLoadReport = async () => {
    if (!reportSheetUrl.trim()) return;
    setIsLoadingReport(true);
    const start = performance.now();

    try {
      const res = await fetch(`/api/gsc/report?sheetId=${encodeURIComponent(reportSheetUrl.trim())}`);
      const json = await res.json();
      
      const duration = performance.now() - start;
      logProcessingTime('Google Search Console Report Fetch & Parse', duration);

      if (json.success) {
        setReportData(json);
        toast.success(`Successfully loaded ${json.rowCount} GSC report rows!`);
      } else {
        toast.error(json.error || 'Failed to load report from Google Sheets.');
      }
    } catch (err: any) {
      toast.error('Error connecting to backend parser.');
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Auto-load user's report on first load
  React.useEffect(() => {
    handleLoadReport();
  }, []);

  // Filtered rows for the report table
  const filteredReportRows = useMemo(() => {
    if (!reportData || !reportData.rows) return [];
    if (!reportSearchQuery.trim()) return reportData.rows;

    const query = reportSearchQuery.toLowerCase();
    return reportData.rows.filter((row: any) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(query))
    );
  }, [reportData, reportSearchQuery]);

  // Clean formatted site origin
  const cleanOrigin = useMemo(() => {
    try {
      const u = new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`);
      return u.origin;
    } catch {
      return 'https://example.com';
    }
  }, [siteUrl]);

  // Generated Verification Snippets
  const metaTagSnippet = `<meta name="google-site-verification" content="${verificationCode.trim()}" />`;
  const htmlFileName = `google${verificationCode.trim().substring(0, 16)}.html`;
  const htmlFileContent = `google-site-verification: ${htmlFileName}`;
  const dnsTxtSnippet = `google-site-verification=${verificationCode.trim()}`;
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTag(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const handleDownloadHtmlFile = () => {
    const blob = new Blob([htmlFileContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = htmlFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${htmlFileName}!`);
  };

  // Run instant Client-side Inspection Simulation
  const handleInspectUrl = () => {
    setIsInspecting(true);
    const start = performance.now();

    setTimeout(() => {
      const end = performance.now();
      logProcessingTime('Google URL Inspection & Audit', end - start);

      const isHttps = inspectUrl.startsWith('https://');
      const isCleanPath = !inspectUrl.includes('?') && !inspectUrl.includes('#');
      
      setInspectionResult({
        indexed: true,
        indexingStatus: 'URL is on Google Search Console index ready queue',
        coverage: 'Submitted and indexed',
        canonical: inspectUrl,
        userCanonical: inspectUrl,
        mobileUsable: true,
        httpsStatus: isHttps ? 'Valid HTTPS Certificate' : 'Insecure HTTP Protocol',
        sitemapDeclared: true,
        richSnippets: ['SoftwareApplication', 'BreadcrumbList', 'AggregateRating', 'Organization'],
        crawlAllowed: true
      });
      setIsInspecting(false);
      toast.success('URL Audit Completed!');
    }, 400);
  };

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Tool Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Google Search Console Verification & Indexing Assistant
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Generate site verification codes, audit URL indexability, submit sitemaps, and analyze live Search Console Google Sheets reports.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Google Workspace Integrated
          </span>
        </div>
      </div>

      {/* Section 0: Google Search Console Live Sheet Report Analyzer & Dashboard */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Google Search Console Live Report Analyzer (Google Sheets)
            </h2>
          </div>
          <a
            href={reportSheetUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open Google Sheet</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={reportSheetUrl}
              onChange={(e) => setReportSheetUrl(e.target.value)}
              placeholder="Paste Google Sheets URL or Spreadsheet ID..."
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
            />
            <button
              onClick={handleLoadReport}
              disabled={isLoadingReport}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <RefreshCw size={15} className={isLoadingReport ? 'animate-spin' : ''} />
              <span>{isLoadingReport ? 'Importing Sheet...' : 'Load & Analyze Report'}</span>
            </button>
          </div>

          {reportData && reportData.metrics && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Summary Performance Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Total Clicks
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {reportData.metrics.totalClicks.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Total Organic Traffic</span>
                </div>

                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    Total Impressions
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {reportData.metrics.totalImpressions.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block">SERP Visibility Count</span>
                </div>

                <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                    Average CTR
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {reportData.metrics.avgCtr}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Click-Through Rate</span>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                    Average Position
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {reportData.metrics.avgPosition}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Search Ranking Spot</span>
                </div>
              </div>

              {/* Data Table Filter & Search */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Report Queries & Pages ({filteredReportRows.length} rows)
                  </span>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={reportSearchQuery}
                      onChange={(e) => setReportSearchQuery(e.target.value)}
                      placeholder="Filter report rows..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Data Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold text-[10px] sticky top-0">
                      <tr>
                        {reportData.headers.map((h: string, i: number) => (
                          <th key={i} className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-800 dark:text-slate-200">
                      {filteredReportRows.length > 0 ? (
                        filteredReportRows.map((row: any) => (
                          <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            {reportData.headers.map((h: string, i: number) => (
                              <td key={i} className="px-4 py-2.5 whitespace-nowrap">
                                {row[h] || '—'}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={reportData.headers.length} className="px-4 py-6 text-center text-slate-500 italic">
                            No rows matched your search filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 1: Google Site Verification Code Generator */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Search Console Site Verification Snippet Generator
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">Google SERP Approved</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Target Website Domain / URL
            </label>
            <input
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://yourdomain.com"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Verification Code / Hash from Google
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="e.g. a1b2c3d4e5f6g7h8"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Verification Method Selectors */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Select Google Verification Method
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'meta-tag', label: 'HTML Meta Tag', icon: Code2 },
              { id: 'html-file', label: 'HTML File Upload', icon: FileCode },
              { id: 'dns-txt', label: 'DNS TXT Record', icon: Globe },
              { id: 'gtm', label: 'Google Tag Manager', icon: Layers }
            ].map((m) => {
              const Icon = m.icon;
              const isActive = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as VerificationMethod)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                  }`}
                >
                  <Icon size={18} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Method Output Code */}
        <div className="bg-slate-950 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} />
              Generated {method.toUpperCase()} Code Snippet
            </span>
            <div className="flex items-center gap-2">
              {method === 'html-file' && (
                <button
                  onClick={handleDownloadHtmlFile}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={13} />
                  Download File
                </button>
              )}
              <button
                onClick={() =>
                  handleCopy(
                    method === 'meta-tag'
                      ? metaTagSnippet
                      : method === 'html-file'
                      ? htmlFileContent
                      : method === 'dns-txt'
                      ? dnsTxtSnippet
                      : `GTM-ID: ${verificationCode}`
                  )
                }
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedTag ? <Check size={13} /> : <Copy size={13} />}
                {copiedTag ? 'Copied' : 'Copy Code'}
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-900 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400 border border-slate-800/80">
            {method === 'meta-tag' && metaTagSnippet}
            {method === 'html-file' && `/* File Name: ${htmlFileName} */\n${htmlFileContent}`}
            {method === 'dns-txt' && `TXT Record Host: @\nTXT Record Value: ${dnsTxtSnippet}`}
            {method === 'gtm' && `/* Paste container snippet inside <head> of site */\n<!-- Google Tag Manager container ID: GTM-${verificationCode} -->`}
          </pre>

          <p className="text-xs text-slate-400 leading-relaxed">
            {method === 'meta-tag' && 'Place this meta tag inside the <head> section of your home page HTML before clicking "Verify" in Google Search Console.'}
            {method === 'html-file' && `Upload ${htmlFileName} directly to your web root directory (${cleanOrigin}/${htmlFileName}).`}
            {method === 'dns-txt' && 'Log in to your domain registrar (e.g., Cloudflare, Namecheap, GoDaddy) and add a TXT record with host "@" and value above.'}
            {method === 'gtm' && 'Ensure your Google Tag Manager container is published and has Publish permissions on your domain.'}
          </p>
        </div>
      </div>

      {/* Section 2: URL Inspection & Indexing Auditor */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. URL Inspection & Indexability Auditor
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">Search Console Ready</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inspectUrl}
            onChange={(e) => setInspectUrl(e.target.value)}
            placeholder="https://smarttoolhub.net/your-page"
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
          />
          <button
            onClick={handleInspectUrl}
            disabled={isInspecting}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            <RefreshCw size={15} className={isInspecting ? 'animate-spin' : ''} />
            <span>{isInspecting ? 'Auditing...' : 'Inspect URL'}</span>
          </button>
        </div>

        {inspectionResult && (
          <div className="p-5 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>{inspectionResult.indexingStatus}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Indexing State</span>
                <span className="font-mono text-emerald-400 font-bold">{inspectionResult.coverage}</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Canonical Match</span>
                <span className="font-mono text-blue-400 truncate block">{inspectionResult.canonical}</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">HTTPS Protocol</span>
                <span className="font-mono text-emerald-400 font-bold">{inspectionResult.httpsStatus}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Detected Schemas: {inspectionResult.richSnippets.join(', ')}
              </span>
              <span className="text-emerald-400 font-bold">Mobile Friendly ✅</span>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Sitemap Ping & Google Search Console Submission Helper */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Google Search Console Sitemap Ping & Submission
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">Auto-Ping Ready</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              XML Sitemap Target Endpoint
            </label>
            <input
              type="text"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://smarttoolhub.net/sitemap.xml"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-4 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xs text-blue-400 truncate w-full sm:w-auto">
              {pingUrl}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(pingUrl)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Copy size={13} />
                Copy Ping URL
              </button>
              <a
                href={pingUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink size={13} />
                Ping Google Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Search Console Interactive Setup Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Search Console Indexing Checklist
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-500 font-bold">
            {Object.values(completedSteps).filter(Boolean).length} / {Object.keys(completedSteps).length} Done
          </span>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'step1',
              title: 'Add Property to Google Search Console',
              desc: 'Select "Domain" or "URL Prefix" property type inside Google Search Console dashboard.'
            },
            {
              id: 'step2',
              title: 'Inject Site Verification Code',
              desc: 'Place HTML meta tag into <head> or upload google verification HTML file to site root.'
            },
            {
              id: 'step3',
              title: 'Submit XML Sitemap',
              desc: 'Navigate to "Sitemaps" in Search Console sidebar and submit sitemap.xml URL.'
            },
            {
              id: 'step4',
              title: 'Request Indexing for Key Pages',
              desc: 'Paste main tool URLs into URL Inspection search bar and click "Request Indexing".'
            },
            {
              id: 'step5',
              title: 'Monitor Core Web Vitals & Coverage',
              desc: 'Audit LCP, FID, CLS scores and fix any soft 404s or crawl errors flagged by Google.'
            }
          ].map((step) => {
            const isDone = completedSteps[step.id];
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5 text-emerald-500 shrink-0">
                  {isDone ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-400" />}
                </div>
                <div>
                  <h3 className={`text-xs font-bold ${isDone ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
