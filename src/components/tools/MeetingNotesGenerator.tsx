import React, { useState } from 'react';
import { 
  FileSpreadsheet, Sparkles, Plus, Trash2, Copy, Download, Printer, 
  RefreshCw, Check, Calendar, Users, ListCheck, CheckCircle2, AlertCircle
} from 'lucide-react';

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

export function MeetingNotesGenerator() {
  const [meetingTitle, setMeetingTitle] = useState('Q3 Product Roadmap & Engineering Sync');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState('Alex Rivera (Product), Sarah Chen (Lead Eng), Marcus Vance (UX), David K (QA)');
  const [objective, setObjective] = useState('Finalize Q3 feature scope, review API architecture changes, and assign sprint deliverables.');
  const [rawNotes, setRawNotes] = useState(
    `- Agreed to prioritize OAuth login flow and Database indexing for sprint 1.\n- Sarah mentioned backend API migration will complete by Friday.\n- Marcus presented UI mocks for the new dashboard; feedback was positive.\n- QA requires staging environment setup before testing can commence.\n- Decision made: Drop legacy REST endpoint support by August 15.`
  );

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    { id: '1', task: 'Deploy OAuth backend proxy to staging', assignee: 'Sarah Chen', priority: 'High', dueDate: '2026-08-01' },
    { id: '2', task: 'Finalize Figma design tokens for dark mode', assignee: 'Marcus Vance', priority: 'Medium', dueDate: '2026-08-03' },
    { id: '3', task: 'Prepare automated regression test suite', assignee: 'David K', priority: 'High', dueDate: '2026-08-05' },
  ]);

  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [summary, setSummary] = useState<string>(
    'The team agreed on Q3 feature priorities with a major focus on OAuth authentication and DB optimization. Backend API migrations are on schedule for Friday release, enabling QA staging testing next week.'
  );

  const [decisions, setDecisions] = useState<string[]>([
    'Deprecate legacy REST endpoint support effective August 15.',
    'Approve Figma design tokens for the unified dark mode UI system.',
    'Prioritize DB indexing before launching public API v2.'
  ]);

  const [copied, setCopied] = useState(false);

  const handleAiSummarize = async () => {
    if (!rawNotes.trim()) return;
    setIsAiProcessing(true);

    try {
      const response = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'ai-writer',
          payload: {
            prompt: `Given meeting title: "${meetingTitle}", objective: "${objective}", and raw notes: "${rawNotes}", summarize into executive key points and key decisions.`
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          setSummary(data.result);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const addActionItem = () => {
    setActionItems([
      ...actionItems,
      { id: Date.now().toString(), task: 'New Action Deliverable', assignee: 'Team Member', priority: 'Medium', dueDate: date }
    ]);
  };

  const updateActionItem = (id: string, field: keyof ActionItem, value: any) => {
    setActionItems(actionItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteActionItem = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id));
  };

  const handleCopyMarkdown = () => {
    const markdown = `# ${meetingTitle}
**Date:** ${date}
**Participants:** ${participants}
**Objective:** ${objective}

## Executive Summary
${summary}

## Key Decisions Made
${decisions.map(d => `- ${d}`).join('\n')}

## Action Items
${actionItems.map(a => `- [ ] **${a.task}** (Assigned: ${a.assignee}, Priority: ${a.priority}, Due: ${a.dueDate})`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:max-w-none print:p-0">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6 print:hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-violet-500/20">
            <FileSpreadsheet size={12} className="text-violet-500" />
            Executive Minutes & AI Summarizer
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Meeting Notes & AI Summary Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Structure meeting minutes, extract key decisions, auto-generate executive summaries, and track action item deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Notes Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        {/* Meeting Header Details */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:border-slate-300">
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="w-full font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white print:text-black bg-transparent border-b border-dashed border-slate-200 dark:border-slate-800 focus:outline-none focus:border-violet-500"
            placeholder="Meeting Title"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase text-[10px] block">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 dark:text-slate-200 print:text-black"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-400 uppercase text-[10px] block">Participants / Attendees</label>
              <input
                type="text"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 print:text-black"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase text-[10px] block">Meeting Objective</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 print:text-black"
            />
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-5 space-y-3 print:bg-slate-50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400 print:text-black flex items-center gap-1.5">
              <Sparkles size={14} /> Executive AI Summary
            </h3>

            <button
              onClick={handleAiSummarize}
              disabled={isAiProcessing}
              className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 print:hidden"
            >
              <Sparkles size={12} className={isAiProcessing ? 'animate-spin' : ''} />
              <span>{isAiProcessing ? 'Summarizing...' : 'AI Enhance Summary'}</span>
            </button>
          </div>

          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-xs leading-relaxed text-slate-700 dark:text-slate-300 print:text-black resize-none focus:outline-none"
          />
        </div>

        {/* Raw Meeting Notes Input */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
            Discussion & Discussion Bullet Points
          </label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            rows={6}
            placeholder="Type meeting discussion points here..."
            className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 print:text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Action Items Deliverables Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 print:text-black flex items-center gap-1.5">
              <ListCheck size={14} /> Assigned Action Deliverables
            </h3>

            <button
              onClick={addActionItem}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer print:hidden"
            >
              <Plus size={12} />
              <span>Add Action Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-2 px-2 w-1/2">Action Deliverable</th>
                  <th className="py-2 px-2 w-28">Assignee</th>
                  <th className="py-2 px-2 w-24">Priority</th>
                  <th className="py-2 px-2 w-28">Due Date</th>
                  <th className="py-2 px-2 w-10 text-center print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {actionItems.map((item) => (
                  <tr key={item.id} className="text-xs">
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.task}
                        onChange={(e) => updateActionItem(item.id, 'task', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-200 print:text-black"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.assignee}
                        onChange={(e) => updateActionItem(item.id, 'assignee', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-200 print:text-black"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <select
                        value={item.priority}
                        onChange={(e) => updateActionItem(item.id, 'priority', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-200 print:text-black"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="date"
                        value={item.dueDate}
                        onChange={(e) => updateActionItem(item.id, 'dueDate', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-800 dark:text-slate-200 print:text-black"
                      />
                    </td>
                    <td className="py-2 px-2 text-center print:hidden">
                      <button
                        onClick={() => deleteActionItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingNotesGenerator;
