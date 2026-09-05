import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Video,
  Sparkles,
  Download,
  Copy,
  Check,
  Filter,
  BarChart3,
  Layers,
  ArrowRight,
  TrendingUp,
  Tag,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Stage = 'idea' | 'scripting' | 'recording' | 'editing' | 'thumbnail' | 'scheduled' | 'published';

interface VideoProject {
  id: string;
  title: string;
  pillar: 'Tutorial' | 'Review & Tech' | 'Vlog & Story' | 'Shorts' | 'Deep Dive' | 'Case Study';
  stage: Stage;
  targetDate: string;
  durationMin: number;
  expectedViews: number;
  sponsorName?: string;
  sponsorAmount?: number;
  notes?: string;
  checklist: {
    seoDone: boolean;
    scriptReady: boolean;
    thumbnailTested: boolean;
    chaptersWritten: boolean;
  };
}

const STAGES: { id: Stage; label: string; color: string; bg: string }[] = [
  { id: 'idea', label: 'Brainstorm & Ideas', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'scripting', label: 'Script & Outline', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  { id: 'recording', label: 'Filming / Assets', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
  { id: 'editing', label: 'Video Editing', color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20' },
  { id: 'thumbnail', label: 'Thumbnail & Packaging', color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { id: 'scheduled', label: 'Scheduled', color: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20' },
  { id: 'published', label: 'Published & Live', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

const SAMPLE_PROJECTS: VideoProject[] = [
  {
    id: 'yt-proj-1',
    title: 'Top 10 AI Tools That Will Replace Your Entire Workflow in 2026',
    pillar: 'Tutorial',
    stage: 'scheduled',
    targetDate: '2026-08-25',
    durationMin: 14,
    expectedViews: 65000,
    sponsorName: 'CloudDev Pro',
    sponsorAmount: 1800,
    notes: 'Include live screen recording comparisons and code snippet downloads in description.',
    checklist: { seoDone: true, scriptReady: true, thumbnailTested: true, chaptersWritten: true },
  },
  {
    id: 'yt-proj-2',
    title: 'Why I Stopped Using Traditional Frameworks (Honest Review)',
    pillar: 'Review & Tech',
    stage: 'editing',
    targetDate: '2026-08-28',
    durationMin: 11,
    expectedViews: 45000,
    notes: 'Focus heavily on first 30 seconds hook. Emphasize developer pain points.',
    checklist: { seoDone: true, scriptReady: true, thumbnailTested: false, chaptersWritten: false },
  },
  {
    id: 'yt-proj-3',
    title: 'Building a Full-Stack AI SaaS in 48 Hours: Complete Blueprint',
    pillar: 'Deep Dive',
    stage: 'scripting',
    targetDate: '2026-09-02',
    durationMin: 28,
    expectedViews: 120000,
    sponsorName: 'AuthShield API',
    sponsorAmount: 2500,
    notes: 'Split into 4 chapters: Architecture, Database, Authentication, and Stripe Billing.',
    checklist: { seoDone: false, scriptReady: true, thumbnailTested: false, chaptersWritten: false },
  },
  {
    id: 'yt-proj-4',
    title: '3 Secret YouTube Algorithm Hacks Top Creators Hide',
    pillar: 'Shorts',
    stage: 'idea',
    targetDate: '2026-08-22',
    durationMin: 1,
    expectedViews: 250000,
    notes: 'Fast paced 55-second vertical Short. Cut silence to 0ms.',
    checklist: { seoDone: false, scriptReady: false, thumbnailTested: false, chaptersWritten: false },
  },
];

export default function YTContentPlanner() {
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttoolhub_yt_planner');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return SAMPLE_PROJECTS;
  });

  const [activeView, setActiveView] = useState<'board' | 'list' | 'analytics'>('board');
  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Form State for new project modal/drawer
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPillar, setNewPillar] = useState<VideoProject['pillar']>('Tutorial');
  const [newStage, setNewStage] = useState<Stage>('idea');
  const [newDate, setNewDate] = useState('');
  const [newDuration, setNewDuration] = useState(10);
  const [newViews, setNewViews] = useState(25000);
  const [newSponsor, setNewSponsor] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('smarttoolhub_yt_planner', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: VideoProject = {
      id: `yt-proj-${Date.now()}`,
      title: newTitle.trim(),
      pillar: newPillar,
      stage: newStage,
      targetDate: newDate || new Date().toISOString().slice(0, 10),
      durationMin: Number(newDuration) || 10,
      expectedViews: Number(newViews) || 10000,
      sponsorName: newSponsor.trim() || undefined,
      sponsorAmount: newAmount ? Number(newAmount) : undefined,
      notes: newNotes.trim() || undefined,
      checklist: { seoDone: false, scriptReady: false, thumbnailTested: false, chaptersWritten: false },
    };

    setProjects([newProj, ...projects]);
    setIsAdding(false);
    setNewTitle('');
    setNewNotes('');
    setNewSponsor('');
    setNewAmount('');
  };

  const handleMoveStage = (id: string, newStage: Stage) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, stage: newStage } : p)));
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleToggleCheck = (id: string, key: keyof VideoProject['checklist']) => {
    setProjects(
      projects.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          checklist: { ...p.checklist, [key]: !p.checklist[key] },
        };
      })
    );
  };

  // Metrics
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchPillar = filterPillar === 'all' || p.pillar === filterPillar;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.sponsorName && p.sponsorName.toLowerCase().includes(q));
      return matchPillar && matchSearch;
    });
  }, [projects, filterPillar, searchQuery]);

  const totalExpectedViews = useMemo(() => projects.reduce((acc, p) => acc + (p.expectedViews || 0), 0), [projects]);
  const totalSponsorships = useMemo(() => projects.reduce((acc, p) => acc + (p.sponsorAmount || 0), 0), [projects]);
  const completedCount = useMemo(() => projects.filter((p) => p.stage === 'published').length, [projects]);

  const handleExportCSV = () => {
    const headers = ['Title', 'Pillar', 'Stage', 'Target Date', 'Duration (Min)', 'Expected Views', 'Sponsor', 'Revenue'];
    const rows = projects.map((p) => [
      `"${p.title.replace(/"/g, '""')}"`,
      p.pillar,
      p.stage,
      p.targetDate,
      p.durationMin,
      p.expectedViews,
      p.sponsorName || 'None',
      p.sponsorAmount || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YouTube_Content_Schedule_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopyMarkdown = () => {
    const md = `# YouTube Content Schedule (${new Date().toISOString().slice(0, 10)})\n\n` +
      projects.map((p) => `## [${p.stage.toUpperCase()}] ${p.title}\n- **Pillar**: ${p.pillar}\n- **Date**: ${p.targetDate}\n- **Est Views**: ${p.expectedViews.toLocaleString()}\n${p.sponsorName ? `- **Sponsor**: ${p.sponsorName} ($${p.sponsorAmount})\n` : ''}${p.notes ? `- **Notes**: ${p.notes}\n` : ''}`).join('\n');
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Metric Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                YouTube Creator Studio
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">
                Pipeline Planner
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              YouTube Video Content Calendar & Pipeline Planner
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Organize video ideation, script drafts, thumbnail packaging, upload schedules, and brand sponsorship revenue in one unified workflow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>New Video Project</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copied MD' : 'Copy Schedule'}</span>
            </button>
          </div>
        </div>

        {/* Live Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-slate-400">
              <span>Active In Pipeline</span>
              <Video size={14} className="text-red-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{projects.length}</span>
              <span className="text-xs text-slate-400 block font-medium mt-0.5">{completedCount} Published</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-slate-400">
              <span>Projected Views</span>
              <TrendingUp size={14} className="text-blue-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {(totalExpectedViews / 1000).toFixed(0)}K
              </span>
              <span className="text-xs text-slate-400 block font-medium mt-0.5">Across all queued videos</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-slate-400">
              <span>Brand Revenue Target</span>
              <DollarSign size={14} className="text-emerald-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ${totalSponsorships.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 block font-medium mt-0.5">Committed sponsorships</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-slate-400">
              <span>Weekly Cadence</span>
              <Calendar size={14} className="text-purple-500" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">2.4 / wk</span>
              <span className="text-xs text-emerald-500 font-bold block mt-0.5">Consistent Upload Streak</span>
            </div>
          </div>
        </div>

        {/* View Switcher & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveView('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'board' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Pipeline Board
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'list' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Table View ({filteredProjects.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterPillar}
              onChange={(e) => setFilterPillar(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Content Pillars</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Review & Tech">Review & Tech</option>
              <option value="Deep Dive">Deep Dive</option>
              <option value="Shorts">Shorts</option>
              <option value="Vlog & Story">Vlog & Story</option>
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 w-44 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* MODAL: ADD VIDEO PROJECT */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Video className="text-red-500" size={18} />
                  Plan New YouTube Video Project
                </h3>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddProject} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Working Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 5 Coding Mistakes Holding You Back (How to Fix Them)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Content Pillar
                    </label>
                    <select
                      value={newPillar}
                      onChange={(e) => setNewPillar(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      <option value="Tutorial">Tutorial</option>
                      <option value="Review & Tech">Review & Tech</option>
                      <option value="Deep Dive">Deep Dive</option>
                      <option value="Shorts">Shorts</option>
                      <option value="Vlog & Story">Vlog & Story</option>
                      <option value="Case Study">Case Study</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Production Stage
                    </label>
                    <select
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Est. Views
                    </label>
                    <input
                      type="number"
                      value={newViews}
                      onChange={(e) => setNewViews(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Sponsor / Brand (Optional)
                    </label>
                    <input
                      type="text"
                      value={newSponsor}
                      onChange={(e) => setNewSponsor(e.target.value)}
                      placeholder="e.g. NordVPN, Notion"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Sponsor Rate ($)
                    </label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 1500"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Key Hook / Outline Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="First 30 seconds teaser, primary call to action, sponsor talking points..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-sm"
                  >
                    Save to Calendar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. KANBAN PIPELINE BOARD */}
      {activeView === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAGES.map((stage) => {
            const stageProjects = filteredProjects.filter((p) => p.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${stage.color.replace('text-', 'bg-')}`} />
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white">{stage.label}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {stageProjects.length}
                    </span>
                  </div>

                  {/* Project Cards in Stage */}
                  <div className="space-y-3">
                    {stageProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-red-500/50 transition-all space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[9px] font-bold">
                            {p.pillar}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock size={11} />
                            {p.targetDate}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {p.title}
                        </h4>

                        {p.sponsorName && (
                          <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>Sponsor: {p.sponsorName}</span>
                            {p.sponsorAmount && <span>${p.sponsorAmount}</span>}
                          </div>
                        )}

                        {/* Interactive Checklist Pills */}
                        <div className="grid grid-cols-2 gap-1 text-[9px] font-bold pt-1 border-t border-slate-200/50 dark:border-slate-800/80">
                          <button
                            onClick={() => handleToggleCheck(p.id, 'scriptReady')}
                            className={`px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer ${
                              p.checklist.scriptReady ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 size={10} /> Script
                          </button>
                          <button
                            onClick={() => handleToggleCheck(p.id, 'thumbnailTested')}
                            className={`px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer ${
                              p.checklist.thumbnailTested ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 size={10} /> Thumbnail
                          </button>
                          <button
                            onClick={() => handleToggleCheck(p.id, 'seoDone')}
                            className={`px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer ${
                              p.checklist.seoDone ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 size={10} /> SEO Tags
                          </button>
                          <button
                            onClick={() => handleToggleCheck(p.id, 'chaptersWritten')}
                            className={`px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer ${
                              p.checklist.chaptersWritten ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 size={10} /> Chapters
                          </button>
                        </div>

                        {/* Stage Selector & Actions */}
                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          <select
                            value={p.stage}
                            onChange={(e) => handleMoveStage(p.id, e.target.value as Stage)}
                            className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {stageProjects.length === 0 && (
                      <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <p className="text-[11px] text-slate-400">No videos in this stage</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {activeView === 'list' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Video Project Title</th>
                  <th className="p-3.5">Pillar</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5">Target Date</th>
                  <th className="p-3.5">Est. Views</th>
                  <th className="p-3.5">Sponsor</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-sm">
                      {p.title}
                      {p.notes && <p className="text-[11px] font-normal text-slate-400 mt-0.5 line-clamp-1">{p.notes}</p>}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {p.pillar}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={p.stage}
                        onChange={(e) => handleMoveStage(p.id, e.target.value as Stage)}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px]"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{p.targetDate}</td>
                    <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {p.expectedViews ? (p.expectedViews / 1000).toFixed(0) + 'K' : '-'}
                    </td>
                    <td className="p-3.5">
                      {p.sponsorName ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {p.sponsorName} (${p.sponsorAmount})
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
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
      )}
    </div>
  );
}
