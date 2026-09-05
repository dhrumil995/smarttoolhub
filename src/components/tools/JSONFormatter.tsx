import React, { useState, useMemo } from 'react';
import {
  Copy,
  Trash2,
  FileCode,
  AlertCircle,
  Check,
  Play,
  Download,
  Wrench,
  BarChart3,
  ListTree,
  Code2,
  Search,
  ChevronRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { toast } from '../../utils/toast';
import { usePerformanceMonitor } from '../PerformanceMonitor';

export default function JSONFormatter() {
  const { logProcessingTime } = usePerformanceMonitor();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState('2');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'tree'>('code');
  const [parsedObject, setParsedObject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sampleJSON = {
    appName: "SmartToolHub",
    version: "3.0.0",
    features: [
      "Auto-Repair Invalid JSON",
      "Interactive Tree Viewer",
      "CSV, YAML & XML Converters",
      "Client-Side Fast Engine"
    ],
    author: {
      name: "SmartToolHub Team",
      role: "Core Contributors"
    },
    metrics: {
      activeUsers: 142000,
      uptimePercent: 99.99,
      latencyMs: 12
    }
  };

  const loadSample = () => {
    const str = JSON.stringify(sampleJSON, null, 2);
    setInput(str);
    setOutput(str);
    setParsedObject(sampleJSON);
    setError(null);
  };

  const parseAndFormat = (rawText: string, spaceSetting = indent) => {
    if (!rawText.trim()) {
      setError("Please enter JSON content to process.");
      setOutput('');
      setParsedObject(null);
      return;
    }

    const start = performance.now();
    try {
      const parsed = JSON.parse(rawText);
      const spaces = spaceSetting === 'tab' ? '\t' : parseInt(spaceSetting);
      const formatted = JSON.stringify(parsed, null, spaces);
      const duration = performance.now() - start;
      setOutput(formatted);
      setParsedObject(parsed);
      setError(null);
      logProcessingTime('JSON Format & Validate', duration);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
      setParsedObject(null);
    }
  };

  const handleFormat = () => {
    parseAndFormat(input);
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setParsedObject(parsed);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
    }
  };

  // Smart Auto-Repair for typical malformed JSON (single quotes, trailing commas, unquoted keys, JS comments)
  const handleAutoRepair = () => {
    if (!input.trim()) return;

    let repaired = input
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // remove JS comments
      .replace(/'/g, '"') // replace single quotes with double quotes
      .replace(/,\s*([\]}])/g, '$1') // remove trailing commas
      .replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":'); // quote unquoted keys

    try {
      const parsed = JSON.parse(repaired);
      const formatted = JSON.stringify(parsed, null, indent === 'tab' ? '\t' : parseInt(indent));
      setInput(formatted);
      setOutput(formatted);
      setParsedObject(parsed);
      setError(null);
      toast.success('Successfully repaired JSON syntax errors!');
    } catch (e: any) {
      setError(`Auto-repair attempted but failed: ${e.message}`);
      toast.error('Could not automatically fix all syntax errors');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success('Formatted JSON copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text');
    }
  };

  const handleDownloadJSON = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (!parsedObject) return;
    let csvContent = '';
    try {
      if (Array.isArray(parsedObject) && parsedObject.length > 0) {
        const keys = Object.keys(parsedObject[0]);
        const headers = keys.join(',');
        const rows = parsedObject.map((item) =>
          keys
            .map((k) => {
              const val = item[k];
              const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
              return `"${str.replace(/"/g, '""')}"`;
            })
            .join(',')
        );
        csvContent = [headers, ...rows].join('\n');
      } else if (typeof parsedObject === 'object' && parsedObject !== null) {
        const rows = Object.entries(parsedObject).map(([k, v]) => {
          const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
          return `"${k.replace(/"/g, '""')}","${valStr.replace(/"/g, '""')}"`;
        });
        csvContent = ['Key,Value', ...rows].join('\n');
      } else {
        csvContent = `Value\n"${String(parsedObject).replace(/"/g, '""')}"`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted_data_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to convert JSON to CSV');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setParsedObject(null);
    setError(null);
  };

  // Stats calculation
  const stats = useMemo(() => {
    if (!parsedObject) return null;
    let keyCount = 0;
    let maxDepth = 0;

    const traverse = (val: any, depth = 1) => {
      if (depth > maxDepth) maxDepth = depth;
      if (typeof val === 'object' && val !== null) {
        const keys = Object.keys(val);
        keyCount += keys.length;
        keys.forEach((k) => traverse(val[k], depth + 1));
      }
    };

    traverse(parsedObject);

    const rawBytes = new Blob([input]).size;
    const formattedBytes = new Blob([output]).size;

    return {
      keys: keyCount,
      depth: maxDepth,
      sizeRawKB: (rawBytes / 1024).toFixed(2),
      sizeFormattedKB: (formattedBytes / 1024).toFixed(2)
    };
  }, [parsedObject, input, output]);

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Indent:
          </label>
          <select
            value={indent}
            onChange={(e) => {
              setIndent(e.target.value);
              if (input) parseAndFormat(input, e.target.value);
            }}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-200"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="tab">1 Tab</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'code' ? 'bg-blue-600 text-white' : 'text-slate-500'
              }`}
            >
              <Code2 size={13} />
              <span>Code</span>
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'tree' ? 'bg-blue-600 text-white' : 'text-slate-500'
              }`}
            >
              <ListTree size={13} />
              <span>Tree View</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadSample}
            className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <FileCode size={14} />
            <span>Sample</span>
          </button>

          <button
            onClick={handleAutoRepair}
            className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Fix unquoted keys, single quotes, comments and trailing commas"
          >
            <Wrench size={14} />
            <span>Auto-Repair Syntax</span>
          </button>

          <button
            onClick={handleFormat}
            className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Play size={14} />
            <span>Format</span>
          </button>

          <button
            onClick={handleMinify}
            className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Minify</span>
          </button>

          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* JSON Analytics Banner */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-900 text-white rounded-2xl font-mono text-xs border border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-blue-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Total Keys</span>
              <span className="font-bold">{stats.keys} Keys</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Max Depth</span>
            <span className="font-bold">{stats.depth} Levels</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Raw Size</span>
            <span className="font-bold">{stats.sizeRawKB} KB</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Formatted Size</span>
            <span className="font-bold">{stats.sizeFormattedKB} KB</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Textarea */}
        <div className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-t-2xl border-t border-x border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Input JSON / Malformed Object
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              parseAndFormat(e.target.value);
            }}
            placeholder='Paste your JSON or JS Object here...&#10;e.g. { name: "SmartToolHub", active: true }'
            className="flex-1 p-4 font-mono text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 resize-none h-full"
          />
        </div>

        {/* Output Area */}
        <div className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-t-2xl border-t border-x border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Formatted Output
            </span>

            {output && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Download JSON"
                >
                  <Download size={12} />
                  <span>JSON</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Export to CSV"
                >
                  <Download size={12} />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative flex-1 rounded-b-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-auto">
            {error ? (
              <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 font-mono text-xs flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <span className="font-bold uppercase block mb-1">JSON Syntax Error</span>
                  <p>{error}</p>
                </div>
              </div>
            ) : viewMode === 'code' ? (
              <pre className="whitespace-pre overflow-x-auto select-all leading-relaxed text-emerald-400">
                {output || '// Results will be formatted instantly as you type.'}
              </pre>
            ) : (
              <InteractiveTreeViewer data={parsedObject} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Collapsible Tree View Component
function InteractiveTreeViewer({ data, depth = 0 }: { data: any; depth?: number }) {
  const [collapsed, setCollapsed] = useState(false);

  if (data === null) return <span className="text-gray-500 font-bold">null</span>;
  if (data === undefined) return <span className="text-gray-500 font-bold">undefined</span>;

  if (typeof data === 'boolean') {
    return <span className="text-purple-400 font-bold">{data.toString()}</span>;
  }
  if (typeof data === 'number') {
    return <span className="text-cyan-400 font-bold">{data}</span>;
  }
  if (typeof data === 'string') {
    return <span className="text-emerald-300">"{data}"</span>;
  }

  const isArray = Array.isArray(data);
  const keys = Object.keys(data);

  return (
    <div className="ml-3 my-0.5 font-mono text-xs">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer select-none"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
        <span className="font-bold text-amber-300">
          {isArray ? `Array(${keys.length}) [` : `Object {`}
        </span>
      </div>

      {!collapsed && (
        <div className="border-l border-slate-800 pl-3 my-1 space-y-1">
          {keys.map((k) => (
            <div key={k} className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">{k}:</span>
              <InteractiveTreeViewer data={data[k]} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}

      {!collapsed && (
        <span className="font-bold text-amber-300 ml-1">{isArray ? ']' : '}'}</span>
      )}
    </div>
  );
}
