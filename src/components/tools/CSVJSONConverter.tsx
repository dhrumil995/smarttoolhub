import React, { useState } from 'react';
import { 
  FileJson, Copy, Download, RefreshCw, Check, ArrowLeftRight, 
  FileSpreadsheet, Code2, Layers, CheckCircle2, AlertCircle
} from 'lucide-react';

export function CSVJSONConverter() {
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
  const [prettyPrint, setPrettyPrint] = useState(true);

  const SAMPLE_CSV = `id,name,role,department,salary
101,Alex Vance,Senior Architect,Engineering,135000
102,Sarah Chen,Lead Designer,Product,115000
103,David Miller,QA Engineer,Engineering,92000
104,Elena Rostova,Product Manager,Growth,125000`;

  const SAMPLE_JSON = `[
  { "id": 101, "name": "Alex Vance", "role": "Senior Architect", "department": "Engineering", "salary": 135000 },
  { "id": 102, "name": "Sarah Chen", "role": "Lead Designer", "department": "Product", "salary": 115000 },
  { "id": 103, "name": "David Miller", "role": "QA Engineer", "department": "Engineering", "salary": 92000 },
  { "id": 104, "name": "Elena Rostova", "role": "Product Manager", "department": "Growth", "salary": 125000 }
]`;

  const [inputData, setInputData] = useState(SAMPLE_CSV);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // CSV -> JSON logic
  const convertCsvToJson = (csvText: string, delim: string) => {
    try {
      const lines = csvText.trim().split('\n').filter(Boolean);
      if (lines.length === 0) return '[]';

      const headers = lines[0].split(delim).map(h => h.trim().replace(/^"|"$/g, ''));
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(delim).map(val => val.trim().replace(/^"|"$/g, ''));
        const obj: Record<string, any> = {};

        headers.forEach((header, index) => {
          let val: any = currentLine[index] ?? '';
          if (!isNaN(Number(val)) && val !== '') {
            val = Number(val);
          } else if (val.toLowerCase() === 'true') {
            val = true;
          } else if (val.toLowerCase() === 'false') {
            val = false;
          }
          obj[header] = val;
        });

        result.push(obj);
      }

      setError(null);
      return JSON.stringify(result, null, prettyPrint ? 2 : 0);
    } catch (e: any) {
      setError(e.message || 'Invalid CSV Format');
      return '[]';
    }
  };

  // JSON -> CSV logic
  const convertJsonToCsv = (jsonText: string, delim: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return '';
      }

      const headers = Object.keys(parsed[0]);
      const csvRows = [headers.join(delim)];

      for (const row of parsed) {
        const values = headers.map(header => {
          const val = row[header];
          if (typeof val === 'string' && val.includes(delim)) {
            return `"${val}"`;
          }
          return val ?? '';
        });
        csvRows.push(values.join(delim));
      }

      setError(null);
      return csvRows.join('\n');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON Format');
      return '';
    }
  };

  const outputData = mode === 'csv2json' 
    ? convertCsvToJson(inputData, delimiter)
    : convertJsonToCsv(inputData, delimiter);

  const handleToggleMode = () => {
    if (mode === 'csv2json') {
      setMode('json2csv');
      setInputData(SAMPLE_JSON);
    } else {
      setMode('csv2json');
      setInputData(SAMPLE_CSV);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    let jsonText = mode === 'csv2json' ? outputData : inputData;
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    let csvText = mode === 'csv2json' ? inputData : outputData;
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted_data_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
            <ArrowLeftRight size={12} className="text-indigo-500" />
            Data Format Conversion Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSV to JSON & JSON to CSV Converter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Convert tabular CSV and TSV data into structured JSON arrays and vice versa with custom delimiters and formatting options.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMode}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <ArrowLeftRight size={14} />
            <span>Switch to {mode === 'csv2json' ? 'JSON → CSV' : 'CSV → JSON'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                {mode === 'csv2json' ? <FileSpreadsheet size={14} className="text-emerald-500" /> : <FileJson size={14} className="text-indigo-500" />}
                Input {mode === 'csv2json' ? 'CSV Data' : 'JSON Data'}
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono font-bold"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="&#9;">Tab (\t)</option>
                </select>
              </div>
            </div>

            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              rows={14}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                {mode === 'csv2json' ? <FileJson size={14} className="text-indigo-500" /> : <FileSpreadsheet size={14} className="text-emerald-500" />}
                Converted {mode === 'csv2json' ? 'JSON Output' : 'CSV Output'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDownloadJSON}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download size={12} />
                  <span>Save JSON</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download size={12} />
                  <span>Save CSV</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-mono flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <textarea
              readOnly
              value={outputData}
              rows={14}
              className="w-full bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CSVJSONConverter;
