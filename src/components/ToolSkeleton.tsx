import React from 'react';
import { motion } from 'motion/react';

export function ToolContentSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
      <div className="h-24 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 space-y-2">
        <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-1/2 bg-slate-200/80 dark:bg-slate-800/80 rounded" />
        <div className="h-3 w-5/6 bg-slate-200/50 dark:bg-slate-800/50 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-slate-200/70 dark:bg-slate-800/60 rounded-lg" />
        <div className="h-10 bg-slate-200/70 dark:bg-slate-800/60 rounded-lg" />
      </div>
    </div>
  );
}

export default function ToolSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-6 w-full animate-pulse"
      aria-busy="true"
      aria-label="Loading tool workspace..."
    >
      {/* Top Banner / Feature Callout Skeleton */}
      <div className="w-full bg-slate-200/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-300 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-300 dark:bg-slate-800 rounded-md" />
              <div className="h-3 w-48 bg-slate-300/60 dark:bg-slate-800/60 rounded-md" />
            </div>
          </div>
          <div className="hidden sm:block h-6 w-24 bg-slate-300/80 dark:bg-slate-800/80 rounded-full" />
        </div>
        <div className="h-3 w-3/4 bg-slate-300/50 dark:bg-slate-800/50 rounded-md" />
      </div>

      {/* Main Tool Workspace Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs & Controls (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded bg-slate-300 dark:bg-slate-800" />
              <div className="h-4 w-36 bg-slate-300 dark:bg-slate-800 rounded-md" />
            </div>
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800/80 rounded-lg" />
          </div>

          {/* Input Label & Controls */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 bg-slate-300/80 dark:bg-slate-800/80 rounded-md" />
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800/60 rounded-md" />
            </div>
            <div className="w-full h-36 bg-slate-100 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 rounded-xl p-3 space-y-2">
              <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
              <div className="h-3 w-2/3 bg-slate-200/60 dark:bg-slate-800/50 rounded-md" />
              <div className="h-3 w-1/2 bg-slate-200/40 dark:bg-slate-800/30 rounded-md" />
            </div>
          </div>

          {/* Options & Sliders */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-10 bg-slate-100 dark:bg-slate-850/60 rounded-xl border border-slate-200/50 dark:border-slate-800/60" />
            <div className="h-10 bg-slate-100 dark:bg-slate-850/60 rounded-xl border border-slate-200/50 dark:border-slate-800/60" />
          </div>

          {/* Primary CTA Button */}
          <div className="w-full h-12 bg-blue-500/20 dark:bg-blue-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500/40 dark:bg-blue-400/40" />
            <div className="h-4 w-32 bg-blue-500/40 dark:bg-blue-400/40 rounded-md" />
          </div>
        </div>

        {/* Right Column: Preview / Output Panel (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded bg-slate-300 dark:bg-slate-800" />
                <div className="h-4 w-28 bg-slate-300 dark:bg-slate-800 rounded-md" />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>

            {/* Output Box */}
            <div className="w-full h-48 bg-slate-900 dark:bg-slate-950 rounded-xl p-4 space-y-3 font-mono">
              <div className="h-3 w-3/4 bg-slate-800 dark:bg-slate-850 rounded-md" />
              <div className="h-3 w-1/2 bg-slate-800 dark:bg-slate-850 rounded-md" />
              <div className="h-3 w-5/6 bg-slate-800 dark:bg-slate-850 rounded-md" />
              <div className="h-3 w-2/3 bg-slate-800 dark:bg-slate-850 rounded-md" />
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>

      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 rounded-xl space-y-2">
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-5 w-24 bg-slate-300 dark:bg-slate-700 rounded-md" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
