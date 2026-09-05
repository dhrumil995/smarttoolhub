import React, { useState } from 'react';
import { Table, Plus, Trash2, Copy, Check, Download, AlignLeft, AlignCenter, AlignRight, FileText, Code2, Sparkles } from 'lucide-react';

export function MarkdownTableGenerator() {
  const [headers, setHeaders] = useState<string[]>(['Feature', 'Standard Plan', 'Pro Tier', 'Enterprise']);
  const [alignments, setAlignments] = useState<('left' | 'center' | 'right')[]>(['left', 'center', 'center', 'right']);
  const [rows, setRows] = useState<string[][]>([
    ['Monthly Active Users', '1,000', '25,000', 'Unlimited'],
    ['API Rate Limits', '60 req/min', '600 req/min', 'Custom Dedicate'],
    ['Automated OCR Scans', '50 / mo', '1,500 / mo', '10,000+ / mo'],
    ['Priority 24/7 Support', 'Community', 'Email & Slack', 'Dedicated Agent'],
    ['Monthly Pricing', '$0', '$29', '$199'],
  ]);

  const [outputFormat, setOutputFormat] = useState<'markdown' | 'html' | 'latex' | 'csv'>('markdown');
  const [copied, setCopied] = useState(false);

  // Add column
  const handleAddColumn = () => {
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setAlignments([...alignments, 'left']);
    setRows(rows.map(r => [...r, 'Data']));
  };

  // Remove column
  const handleRemoveColumn = (colIdx: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== colIdx));
    setAlignments(alignments.filter((_, i) => i !== colIdx));
    setRows(rows.map(r => r.filter((_, i) => i !== colIdx)));
  };

  // Add row
  const handleAddRow = () => {
    setRows([...rows, new Array(headers.length).fill('Sample')]);
  };

  // Remove row
  const handleRemoveRow = (rowIdx: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== rowIdx));
  };

  // Update cell
  const handleUpdateCell = (rowIdx: number, colIdx: number, val: string) => {
    const next = [...rows];
    next[rowIdx][colIdx] = val;
    setRows(next);
  };

  // Update header
  const handleUpdateHeader = (colIdx: number, val: string) => {
    const next = [...headers];
    next[colIdx] = val;
    setHeaders(next);
  };

  // Toggle alignment
  const toggleAlignment = (colIdx: number) => {
    const current = alignments[colIdx];
    const order: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
    const next = order[(order.indexOf(current) + 1) % 3];
    const copy = [...alignments];
    copy[colIdx] = next;
    setAlignments(copy);
  };

  // Generate Output
  const generateOutput = () => {
    if (outputFormat === 'markdown') {
      const headerRow = `| ${headers.join(' | ')} |`;
      const alignRow = `| ${alignments.map(a => a === 'center' ? ':---:' : a === 'right' ? '---:' : ':---').join(' | ')} |`;
      const dataRows = rows.map(r => `| ${r.join(' | ')} |`).join('\n');
      return `${headerRow}\n${alignRow}\n${dataRows}`;
    }
    if (outputFormat === 'html') {
      const thead = `  <thead>\n    <tr>\n${headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>`;
      const tbody = `  <tbody>\n${rows.map(r => `    <tr>\n${r.map((c, i) => `      <td align="${alignments[i]}">${c}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>`;
      return `<table>\n${thead}\n${tbody}\n</table>`;
    }
    if (outputFormat === 'csv') {
      return `${headers.join(',')}\n${rows.map(r => r.join(',')).join('\n')}`;
    }
    // LaTeX table
    const alignStr = alignments.map(a => a[0]).join('|');
    return `\\begin{tabular}{|${alignStr}|}\n\\hline\n${headers.join(' & ')} \\\\\n\\hline\n${rows.map(r => `${r.join(' & ')} \\\\`).join('\n')}\n\\hline\n\\end{tabular}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
          <Table size={14} /> Ultra Pro Max Table Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Visual Markdown, HTML & LaTeX Table Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Interactive spreadsheet-like table editor. Add rows, adjust column alignments, and export instant clean Markdown, HTML, CSV, or LaTeX syntax.
        </p>
      </div>

      {/* Spreadsheet Editor Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table size={18} className="text-indigo-500" /> Interactive Table Grid
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddColumn}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Column
            </button>
            <button
              onClick={handleAddRow}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>
        </div>

        {/* Visual Grid Container */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse border border-slate-200 dark:border-slate-800 text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950">
                {headers.map((h, colIdx) => (
                  <th key={colIdx} className="p-2 border border-slate-200 dark:border-slate-800 min-w-[140px]">
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => handleUpdateHeader(colIdx, e.target.value)}
                        className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-bold text-slate-900 dark:text-white text-xs"
                      />
                      <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-mono">
                        <button
                          onClick={() => toggleAlignment(colIdx)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                          title="Toggle alignment (left, center, right)"
                        >
                          {alignments[colIdx] === 'left' && <AlignLeft size={12} />}
                          {alignments[colIdx] === 'center' && <AlignCenter size={12} />}
                          {alignments[colIdx] === 'right' && <AlignRight size={12} />}
                          <span className="capitalize">{alignments[colIdx]}</span>
                        </button>

                        {headers.length > 1 && (
                          <button
                            onClick={() => handleRemoveColumn(colIdx)}
                            className="text-red-400 hover:text-red-600 p-0.5 cursor-pointer"
                            title="Delete column"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
                <th className="p-2 border border-slate-200 dark:border-slate-800 w-10 text-center text-slate-400">
                  Act
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="p-2 border border-slate-200 dark:border-slate-800">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleUpdateCell(rowIdx, colIdx, e.target.value)}
                        className={`w-full px-2 py-1 bg-transparent border-b border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-sm text-xs font-mono text-slate-800 dark:text-slate-200 text-${alignments[colIdx]}`}
                      />
                    </td>
                  ))}
                  <td className="p-2 border border-slate-200 dark:border-slate-800 text-center">
                    {rows.length > 1 && (
                      <button
                        onClick={() => handleRemoveRow(rowIdx)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                        title="Delete row"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Format selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {(['markdown', 'html', 'latex', 'csv'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setOutputFormat(fmt)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase ${
                  outputFormat === fmt ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-300" />
                <span>Copied {outputFormat.toUpperCase()}!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy {outputFormat.toUpperCase()} Code</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 bg-slate-900/90 rounded-xl text-xs text-indigo-300 font-mono overflow-x-auto max-h-60 scrollbar-thin">
          {generateOutput()}
        </pre>
      </div>
    </div>
  );
}
export default MarkdownTableGenerator;
