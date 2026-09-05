import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, History, Cloud, Users, Star, Search, Download, Check, RefreshCw } from 'lucide-react';

interface BusinessWorkspaceHeaderProps {
  title: string;
  description: string;
  toolId: string;
  activeTab: 'tool' | 'history' | 'cloud';
  setActiveTab: (tab: 'tool' | 'history' | 'cloud') => void;
  itemCount?: number;
}

export interface WorkspaceDoc {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  size: string;
  status: 'PROCESSED' | 'SAVED' | 'PENDING';
  data: any;
}

export default function BusinessWorkspaceHeader({
  title,
  description,
  toolId,
  activeTab,
  setActiveTab,
  itemCount = 0,
}: BusinessWorkspaceHeaderProps) {
  const [role, setRole] = useState<'Owner' | 'Admin' | 'Accountant' | 'Procurement'>('Accountant');
  const [teamSpace, setTeamSpace] = useState('Production & Procurement Workspace');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('smarttoolhub_favs') || '[]');
    setIsFavorite(favs.includes(toolId));
  }, [toolId]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('smarttoolhub_favs') || '[]');
    let updated = [];
    if (favs.includes(toolId)) {
      updated = favs.filter((f: string) => f !== toolId);
    } else {
      updated = [...favs, toolId];
    }
    localStorage.setItem('smarttoolhub_favs', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-900/90 via-slate-900 to-indigo-950 p-6 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                PREMIUM AI TOOL
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="h-3 w-3" />
                UNLIMITED PROCESSING
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              {title}
              <button
                onClick={toggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                className="p-1.5 rounded-lg hover:bg-white/10 text-amber-400 transition-transform active:scale-95"
              >
                <Star className={`h-5 w-5 ${isFavorite ? 'fill-amber-400' : 'text-slate-400'}`} />
              </button>
            </h1>
            <p className="mt-1 text-sm text-indigo-200/80 max-w-2xl">{description}</p>
          </div>

          {/* Role & Workspace Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/10 text-xs">
              <Users className="h-3.5 w-3.5 text-indigo-300 ml-1" />
              <select
                value={teamSpace}
                onChange={(e) => setTeamSpace(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="Production & Procurement Workspace" className="bg-slate-900 text-white">Production & Procurement</option>
                <option value="Finance & Accounts Workspace" className="bg-slate-900 text-white">Finance & Accounts</option>
                <option value="Supply Chain Workspace" className="bg-slate-900 text-white">Supply Chain & Logistics</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/10 text-xs">
              <span className="text-indigo-300 pl-1 font-semibold">Role:</span>
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="Owner" className="bg-slate-900 text-white">Owner</option>
                <option value="Admin" className="bg-slate-900 text-white">Admin</option>
                <option value="Accountant" className="bg-slate-900 text-white">Accountant</option>
                <option value="Procurement" className="bg-slate-900 text-white">Procurement Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
          <div className="flex items-center gap-2 bg-indigo-950/60 p-1 rounded-xl border border-indigo-500/20">
            <button
              onClick={() => setActiveTab('tool')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'tool'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              AI Tool Workstation
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="h-4 w-4" />
              Document History {itemCount > 0 && <span className="bg-indigo-800 text-indigo-100 text-xs px-2 py-0.5 rounded-full">{itemCount}</span>}
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'cloud'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cloud className="h-4 w-4 text-cyan-300" />
              Cloud Workspace Storage
            </button>
          </div>

          <div className="text-xs text-indigo-300 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Gemini 3.6 Flash Active • Encrypted Client Session
          </div>
        </div>
      </div>
    </div>
  );
}
