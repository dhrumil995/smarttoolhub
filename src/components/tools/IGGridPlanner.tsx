import React, { useState } from 'react';
import { LayoutGrid, Upload, Trash2, ArrowUp, ArrowDown, HelpCircle, Info, RefreshCw } from 'lucide-react';

interface GridItem {
  id: number;
  src: string | null;
}

export default function IGGridPlanner() {
  const [gridItems, setGridItems] = useState<GridItem[]>([
    { id: 1, src: null },
    { id: 2, src: null },
    { id: 3, src: null },
    { id: 4, src: null },
    { id: 5, src: null },
    { id: 6, src: null },
    { id: 7, src: null },
    { id: 8, src: null },
    { id: 9, src: null }
  ]);

  const [simulatedAvatar, setSimulatedAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('smarttoolhub_creator');

  // Handle cell image uploads
  const handleCellUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setGridItems(prev => prev.map(item => 
            item.id === id ? { ...item, src: event.target!.result as string } : item
          ));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSimulatedAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearCell = (id: number) => {
    setGridItems(prev => prev.map(item => 
      item.id === id ? { ...item, src: null } : item
    ));
  };

  // Shift cell index left / right to plan grid balance
  const shiftCell = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= 9) return;

    setGridItems(prev => {
      const updated = [...prev];
      const temp = updated[index].src;
      updated[index].src = updated[targetIndex].src;
      updated[targetIndex].src = temp;
      return updated;
    });
  };

  const handleReset = () => {
    setGridItems([
      { id: 1, src: null },
      { id: 2, src: null },
      { id: 3, src: null },
      { id: 4, src: null },
      { id: 5, src: null },
      { id: 6, src: null },
      { id: 7, src: null },
      { id: 8, src: null },
      { id: 9, src: null }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <LayoutGrid size={12} />
            Instagram Growth Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Instagram Grid Planner & Visualizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Design and pre-arrange a beautifully cohesive 3x3 bento grid layout before uploading posts to your actual profile.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Setup & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <LayoutGrid size={18} className="text-fuchsia-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Grid Settings
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear Feed Grid
              </button>
            </div>

            {/* Profile handler */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Simulated Profile Handle
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="e.g. smarttoolhub_creator"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Simulated avatar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Profile Photo (Avatar)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 flex items-center justify-center shrink-0">
                  {simulatedAvatar ? (
                    <img src={simulatedAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">NONE</span>
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  id="avatar-upload"
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="px-4 py-2 bg-slate-850 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-[10px] uppercase rounded-lg transition-all shadow-xs"
                >
                  Upload Profile Pic
                </button>
              </div>
            </div>

            {/* Tutorial */}
            <div className="p-4 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-400 font-normal">
              <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400 block">How to Plan Your Grid:</span>
              <p>
                1. Click on any of the empty grid cells on the right to upload a draft photo.
              </p>
              <p>
                2. Use the arrow buttons below each cell to swap and rearrange position layouts.
              </p>
              <p>
                3. Audit your color balance and visual pacing before committing to publish!
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            {/* Header phone mock context */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest block">
                Instagram Profile Visual Feed
              </span>
              <span className="text-[10px] font-mono text-slate-400">Smartphone Feed Scale</span>
            </div>

            {/* Phone Layout */}
            <div className="border border-slate-150 dark:border-slate-800/80 rounded-3xl p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-4 max-w-sm mx-auto shadow-sm">
              {/* Profile details */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[2.5px] shrink-0">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center">
                    {simulatedAvatar ? (
                      <img src={simulatedAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-[10px] text-slate-400">@</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-xs text-slate-850 dark:text-white block">@{profileName || 'creator'}</span>
                  <div className="flex gap-4 text-center text-[10px]">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white">9 </span>
                      <span className="text-slate-400">posts</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white">2.4k </span>
                      <span className="text-slate-400">followers</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white">410 </span>
                      <span className="text-slate-400">following</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed 3x3 Grid */}
              <div className="grid grid-cols-3 gap-1">
                {gridItems.map((item, index) => (
                  <div key={item.id} className="relative aspect-square bg-slate-200 dark:bg-slate-800/60 rounded-md overflow-hidden group border border-slate-300/10">
                    {item.src ? (
                      <>
                        <img src={item.src} alt="Grid Item" className="w-full h-full object-cover" />
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleClearCell(item.id)}
                              className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                              title="Clear Image"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                          <div className="flex justify-center gap-1 pb-1">
                            {index > 0 && (
                              <button
                                onClick={() => shiftCell(index, 'up')}
                                className="p-1 rounded bg-slate-800/80 text-white hover:bg-slate-700"
                                title="Move up grid"
                              >
                                <ArrowUp size={10} />
                              </button>
                            )}
                            {index < 8 && (
                              <button
                                onClick={() => shiftCell(index, 'down')}
                                className="p-1 rounded bg-slate-800/80 text-white hover:bg-slate-700"
                                title="Move down grid"
                              >
                                <ArrowDown size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors">
                        <Upload size={14} className="text-slate-400 dark:text-slate-500" />
                        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Cell {item.id}</span>
                        <input
                          type="file"
                          onChange={(e) => handleCellUpload(item.id, e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Block */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Info size={16} className="text-fuchsia-500" />
          Pro-Grid Curation: Developing a Cohesive Feed Narrative
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          <p>
            First impressions are permanent. When an Instagram user discovers your content through search or Reels, they visit your profile grid before hitting **Follow**. Planning a visually uniform, clean feed where color templates flow (e.g. alternating text posts, high contrast photography, and minimalist macro layouts) increases profile conversion rates up to **240%**.
          </p>
          <p>
            Use this grid planner to visualize pacing. Try to avoid putting two heavy or crowded images right next to each other. Introduce lighter "breathing space" panels to guide the user\'s eyes naturally across your 3x3 layout.
          </p>
        </div>
      </div>
    </div>
  );
}
