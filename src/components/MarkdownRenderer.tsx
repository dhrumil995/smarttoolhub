import React from 'react';
import { PageId } from '../types';
import { Info, AlertTriangle, Sparkles, CheckCircle, Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  setCurrentPage: (page: PageId) => void;
  onSelectArticle?: (slug: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  setCurrentPage,
  onSelectArticle
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = React.useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') || href.startsWith('#')) {
      e.preventDefault();
      const toolId = href.replace(/^\/#?/, '');
      if (toolId) {
        setCurrentPage(toolId as PageId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (href.startsWith('/blog/')) {
      e.preventDefault();
      const slug = href.replace('/blog/', '');
      if (onSelectArticle) {
        onSelectArticle(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Helper function to format inline markdown (bold, code, links)
  const renderInlineText = (text: string) => {
    // Replace internal links [Text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const label = match[1];
      const href = match[2];

      parts.push(
        <a
          key={`link-${match.index}`}
          href={href}
          onClick={(e) => handleLinkClick(e, href)}
          className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors cursor-pointer"
        >
          {label}
        </a>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.map((part, i) => {
      if (typeof part !== 'string') return part;

      // Handle bold **text** and inline code `code`
      const subParts = part.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return subParts.map((sub, j) => {
        if (sub.startsWith('**') && sub.endsWith('**')) {
          return <strong key={j} className="font-bold text-slate-900 dark:text-white">{sub.slice(2, -2)}</strong>;
        }
        if (sub.startsWith('`') && sub.endsWith('`')) {
          return (
            <code key={j} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-xs border border-slate-200 dark:border-slate-700">
              {sub.slice(1, -1)}
            </code>
          );
        }
        return sub;
      });
    });
  };

  // Process markdown block by block
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let codeBlockCounter = 0;

  const flushTable = (key: string) => {
    if (tableHeader.length > 0) {
      blocks.push(
        <div key={key} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                {tableHeader.map((h, i) => (
                  <th key={i} className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 last:border-0">
                    {renderInlineText(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {tableRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/50 last:border-0">
                      {renderInlineText(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableHeader = [];
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block check
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const codeText = codeBuffer.join('\n');
        const currIdx = codeBlockCounter++;
        blocks.push(
          <div key={`code-${i}`} className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span>{codeLang || 'code'}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeText, currIdx)}
                className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeIndex === currIdx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCodeIndex === currIdx ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBuffer = [];
      } else {
        inCodeBlock = true;
        codeLang = line.trim().replace('```', '');
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Table check
    if (line.trim().startsWith('|')) {
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (line.includes('---')) {
        // Divider row, ignore
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(`table-${i}`);
    }

    // Callout box block
    if (line.trim().startsWith('>')) {
      const calloutText = line.trim().replace(/^>\s*/, '');
      const isTip = calloutText.toLowerCase().includes('pro tip') || calloutText.toLowerCase().includes('key executive');
      const isWarning = calloutText.toLowerCase().includes('warning') || calloutText.toLowerCase().includes('caution');

      blocks.push(
        <div
          key={`callout-${i}`}
          className={`my-6 p-5 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
            isTip
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200'
              : isWarning
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
              : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
          }`}
        >
          {isTip ? (
            <Sparkles size={18} className="text-blue-500 shrink-0 mt-0.5" />
          ) : isWarning ? (
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          ) : (
            <Info size={18} className="text-slate-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-1">
            {renderInlineText(calloutText)}
          </div>
        </div>
      );
      continue;
    }

    // Images
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      blocks.push(
        <div key={`img-${i}`} className="my-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full max-h-[480px] object-cover hover:scale-105 transition-transform duration-500"
          />
          {alt && <p className="text-[11px] text-center text-slate-400 py-2 border-t border-slate-200 dark:border-slate-800">{alt}</p>}
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '');
      blocks.push(
        <h1 key={`h1-${i}`} id={text.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">
          {renderInlineText(text)}
        </h1>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      const text = line.replace('## ', '');
      const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      blocks.push(
        <h2 key={`h2-${i}`} id={headingId} className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight flex items-center gap-2 group">
          <span>{renderInlineText(text)}</span>
          <a href={`#${headingId}`} className="text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity text-sm">#</a>
        </h2>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      const text = line.replace('### ', '');
      const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      blocks.push(
        <h3 key={`h3-${i}`} id={headingId} className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
          {renderInlineText(text)}
        </h3>
      );
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      blocks.push(<hr key={`hr-${i}`} className="my-8 border-slate-200 dark:border-slate-800" />);
      continue;
    }

    // List items
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const text = line.trim().replace(/^[\*\-]\s*/, '');
      blocks.push(
        <div key={`li-${i}`} className="flex items-start gap-2.5 my-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
          <div>{renderInlineText(text)}</div>
        </div>
      );
      continue;
    }

    // Paragraph
    if (line.trim().length > 0) {
      blocks.push(
        <p key={`p-${i}`} className="my-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {renderInlineText(line)}
        </p>
      );
    }
  }

  if (inTable) {
    flushTable(`table-end`);
  }

  return <div className="space-y-1">{blocks}</div>;
};
