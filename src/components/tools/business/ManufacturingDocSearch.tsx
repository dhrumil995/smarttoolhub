import React, { useState } from 'react';
import { SearchCode, Search, FileText, Sparkles, Filter } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function ManufacturingDocSearch() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [query, setQuery] = useState('Show all invoices from ABC Steel in July 2026');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const mockDocs = [
    { id: 'DOC-8801', title: 'Invoice - ABC Steel Industries', date: '2026-07-15', snippet: 'Line items: 20mm Steel Rods (150 MT), HSN 7214. Total Amount: $45,200', score: 98 },
    { id: 'DOC-8802', title: 'Purchase Order #PO-901 - ABC Steel', date: '2026-07-10', snippet: 'Authorized PO for raw billets and steel rods dispatch', score: 92 },
    { id: 'DOC-7403', title: 'Quality Inspection Certificate - ABC Steel', date: '2026-07-18', snippet: 'Tensile test passed according to IS 1786 specifications', score: 85 },
  ];

  const handleSearch = async () => {
    setSearching(true);
    setTimeout(() => {
      setResults(mockDocs);
      setSearching(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Manufacturing Document Search"
        description="Search your entire enterprise document repository using plain conversational queries (e.g. 'Show invoices from ABC Steel in July')."
        toolId="manufacturing-doc-search"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="h-5 w-5 absolute left-3.5 top-3.5 text-indigo-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about your documents..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSearch}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                Search AI
              </button>
            </div>
          </div>

          {results && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                Matching Search Results ({results.length})
              </h3>

              <div className="space-y-3">
                {results.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{doc.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {doc.score}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">{doc.snippet}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{doc.id} • Date: {doc.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
