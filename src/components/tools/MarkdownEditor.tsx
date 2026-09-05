import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, BookOpen, FileText, ChevronRight, Eye, Code } from 'lucide-react';

const SAMPLE_MARKDOWN = `# 🚀 Welcome to SmartToolHub Markdown Editor
Config: {
  brand: "SmartToolHub"
}

This is a **live Markdown previewer**! You can write standard markdown syntax on the left, and see the rendered HTML on the right in real time.

## ✨ Highlighted Features
1. **Real-time Rendering** - Instant compilation.
2. **Mobile Responsive** - Works beautifully on all screens.
3. **Cheat Sheet** - Collapsible reference panel for quick recall.

---

### 🎨 Typography & Styling
You can make text **bold** or *italic*, or even ~~strike-through~~.

> "Simplicity is the ultimate sophistication."
> — *Leonardo da Vinci*

### 💻 Code Formatting
Here is some inline code \`const server = "SmartToolHub";\`.

Or multi-line code blocks:
\`\`\`typescript
function greetUser(name: string): string {
  return \`Welcome to SmartToolHub, \${name}!\`;
}
\`\`\`

### 🔗 Useful Resources
- Visit the official [Markdown Guide](https://www.markdownguide.org)
- Explore more [SmartToolHub productivity tools](#)
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const handleCopyRaw = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const cheatSheetItems = [
    { syntax: '# Heading 1', desc: 'Main Title' },
    { syntax: '## Heading 2', desc: 'Sub Heading' },
    { syntax: '**text**', desc: 'Bold text' },
    { syntax: '*text*', desc: 'Italic text' },
    { syntax: '- item', desc: 'Unordered list' },
    { syntax: '1. item', desc: 'Ordered list' },
    { syntax: '[Label](URL)', desc: 'Web hyperlink' },
    { syntax: '`code`', desc: 'Inline code block' },
    { syntax: '> blockquote', desc: 'Indented quotation' },
    { syntax: '---', desc: 'Horizontal rule line' },
  ];

  return (
    <div className="space-y-6">
      {/* Editor Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        {/* Layout Selectors */}
        <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-0.5 rounded-lg text-xs font-semibold shadow-2xs">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Eye size={12} />
            Split View
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'edit'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Code size={12} />
            Editor Only
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'preview'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FileText size={12} />
            Preview Only
          </button>
        </div>

        {/* Action Utility Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <BookOpen size={14} />
            {showCheatSheet ? 'Hide Cheat Sheet' : 'Syntax Cheat Sheet'}
          </button>
          <button
            onClick={handleCopyRaw}
            className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors flex items-center gap-1"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied MD!' : 'Copy Raw MD'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[550px] items-stretch">
        {/* Cheat Sheet Sidebar */}
        {showCheatSheet && (
          <div className="xl:col-span-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col overflow-auto h-full space-y-3">
            <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest block">
              Syntax Guide
            </span>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {cheatSheetItems.map((item, idx) => (
                <div key={idx} className="py-2 flex flex-col gap-1 text-xs">
                  <code className="font-mono bg-gray-100 dark:bg-gray-950 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-bold self-start">
                    {item.syntax}
                  </code>
                  <span className="text-gray-500 dark:text-gray-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Editor Panel */}
        <div
          className={`${
            showCheatSheet ? 'xl:col-span-9' : 'xl:col-span-12'
          } grid grid-cols-1 lg:grid-cols-2 gap-6 h-full`}
        >
          {/* Text Editor Box */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-xl border-t border-x border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Raw Editor
                </span>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your markdown structure here..."
                className="flex-1 w-full p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 resize-none h-full overflow-auto leading-relaxed"
              />
            </div>
          )}

          {/* HTML Preview Box */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`flex flex-col h-full ${
                viewMode === 'preview' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-xl border-t border-x border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Live Compiled Preview
                </span>
              </div>
              <div className="flex-1 p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/40 rounded-b-xl overflow-auto h-full">
                {/* Embedded ReactMarkdown styled using Tailwind Typography styles manually, keeping CSS light & modern */}
                <div className="markdown-body text-gray-800 dark:text-gray-200 prose dark:prose-invert max-w-none text-sm space-y-4">
                  <Markdown>{markdown}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
