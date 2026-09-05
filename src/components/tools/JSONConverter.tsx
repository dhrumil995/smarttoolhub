import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Download, AlertCircle, X } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function JSONConverter() {
  const [jsonInput, setJsonInput] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [targetFormat, setTargetFormat] = useState<'csv' | 'yaml' | 'xml'>('csv');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper: Flatten objects for CSV conversion
  const flattenObject = (obj: any, parentKey = '', res: any = {}): any => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const propName = parentKey ? `${parentKey}_${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          flattenObject(obj[key], propName, res);
        } else {
          res[propName] = obj[key];
        }
      }
    }
    return res;
  };

  // Convert to CSV
  const convertToCSV = (parsedData: any): string => {
    let list: any[] = [];
    if (Array.isArray(parsedData)) {
      list = parsedData;
    } else if (typeof parsedData === 'object' && parsedData !== null) {
      list = [parsedData];
    } else {
      throw new Error('CSV conversion requires a JSON Array or Object.');
    }

    if (list.length === 0) return '';

    // Flatten all objects
    const flattenedList = list.map((item) => flattenObject(item));
    
    // Get unique headers
    const headersSet = new Set<string>();
    flattenedList.forEach((item) => {
      Object.keys(item).forEach((k) => headersSet.add(k));
    });
    const headers = Array.from(headersSet);

    let csvContent = headers.join(',') + '\n';

    flattenedList.forEach((item) => {
      const row = headers.map((header) => {
        const val = item[header];
        if (val === undefined || val === null) return '';
        const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        // Escape quotes
        if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
          return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
      });
      csvContent += row.join(',') + '\n';
    });

    return csvContent.trim();
  };

  // Convert to YAML (simple client-side formatter)
  const convertToYAML = (obj: any, indent = 0): string => {
    if (obj === null) return 'null';
    if (typeof obj === 'string') return `"${obj.replace(/"/g, '\\"')}"`;
    if (typeof obj !== 'object') return String(obj);

    let yaml = '';
    const spaces = ' '.repeat(indent);

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      obj.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          const innerYaml = convertToYAML(item, indent + 2);
          yaml += `${spaces}- ${innerYaml.trim()}\n`;
        } else {
          yaml += `${spaces}- ${convertToYAML(item, 0)}\n`;
        }
      });
    } else {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      keys.forEach((key) => {
        const val = obj[key];
        if (typeof val === 'object' && val !== null) {
          yaml += `${spaces}${key}:\n${convertToYAML(val, indent + 2)}`;
        } else {
          yaml += `${spaces}${key}: ${convertToYAML(val, 0)}\n`;
        }
      });
    }

    return yaml;
  };

  // Convert to XML
  const convertToXML = (obj: any, rootName = 'root'): string => {
    let xml = '';

    const buildXMLNode = (nodeName: string, val: any): string => {
      // sanitize nodeName
      const cleanNodeName = nodeName.replace(/[^a-zA-Z0-9_.-]/g, '_');
      if (val === null) {
        return `<${cleanNodeName} />`;
      }
      if (Array.isArray(val)) {
        return val.map((item) => buildXMLNode(cleanNodeName, item)).join('');
      }
      if (typeof val === 'object') {
        let childXML = '';
        Object.keys(val).forEach((k) => {
          childXML += buildXMLNode(k, val[k]);
        });
        return `<${cleanNodeName}>${childXML}</${cleanNodeName}>`;
      }
      return `<${cleanNodeName}>${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${cleanNodeName}>`;
    };

    xml += `<?xml version="1.0" encoding="UTF-8" ?>\n`;
    xml += buildXMLNode(rootName, obj);
    return xml;
  };

  const handleProcessConversion = (input: string, format = targetFormat) => {
    setErrorMsg(null);
    if (!input.trim()) {
      setOutputVal('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (format === 'csv') {
        setOutputVal(convertToCSV(parsed));
      } else if (format === 'yaml') {
        setOutputVal(convertToYAML(parsed));
      } else if (format === 'xml') {
        setOutputVal(convertToXML(parsed));
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Malformed JSON. Check bracket completions and commas.');
      setOutputVal('');
    }
  };

  const onInputChange = (val: string) => {
    setJsonInput(val);
    handleProcessConversion(val);
  };

  const handleToggleFormat = (format: 'csv' | 'yaml' | 'xml') => {
    setTargetFormat(format);
    handleProcessConversion(jsonInput, format);
  };

  const handleClear = () => {
    setJsonInput('');
    setOutputVal('');
    setErrorMsg(null);
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputVal) return;
    const extensions: Record<string, string> = { csv: 'csv', yaml: 'yaml', xml: 'xml' };
    const blob = new Blob([outputVal], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smarttoolhub_converted.${extensions[targetFormat]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <RefreshCw size={12} />
            Developer Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            JSON to CSV / XML / YAML Converter
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Convert standard JSON datasets into other formats instantly with live validation entirely client-side.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              JSON Raw Source Input
            </span>
            <button
              onClick={handleClear}
              className="text-[10px] px-2.5 py-1 font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              Clear Raw Data
            </button>
          </div>

          <div className="relative">
            <textarea
              value={jsonInput}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder='[
  {"id": 1, "name": "Alice", "role": "Engineer", "verified": true},
  {"id": 2, "name": "Bob", "role": "Architect", "verified": false}
]'
              rows={13}
              className={`w-full rounded-xl border ${
                errorMsg ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800'
              } bg-slate-50/50 dark:bg-slate-950 p-3 text-xs font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100`}
            />
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 text-[10px] text-red-500 bg-red-500/5 p-3 rounded-xl border border-red-500/15">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span className="font-mono">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Output area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
              {(['csv', 'yaml', 'xml'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleToggleFormat(fmt)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                    targetFormat === fmt
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!outputVal}
                className="p-1 px-2.5 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50 border border-slate-200/40 dark:border-slate-800/60"
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={handleDownload}
                disabled={!outputVal}
                className="p-1 px-2.5 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50 border border-slate-200/40 dark:border-slate-800/60"
              >
                <Download size={11} />
                Download
              </button>
            </div>
          </div>

          <textarea
            value={outputVal}
            readOnly
            placeholder="Parsed structural values will show up here as alternative formats..."
            rows={13}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 resize-none whitespace-pre overflow-x-auto"
          />
        </div>
      </div>

      <AdSenseSlot slot="json-converter-bottom" />
    </div>
  );
}
