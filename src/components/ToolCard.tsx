import React from 'react';
import { Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Tool, PageId } from '../types';
import { ToolIcon } from '../pages/Home';

interface ToolCardProps {
  tool: Tool;
  onSelectTool: (toolId: PageId) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, toolId: string) => void;
  categoryTheme: {
    hoverBorder: string;
    iconBg: string;
    iconText: string;
    hoverIconBg: string;
    accentText: string;
    accentBg: string;
    shadowColor: string;
  };
}

export default function ToolCard({
  tool,
  onSelectTool,
  isFavorite,
  onToggleFavorite,
  categoryTheme,
}: ToolCardProps) {
  const theme = categoryTheme || {
    hoverBorder: 'hover:border-blue-500/50 dark:hover:border-blue-500/40',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/10',
    iconText: 'text-blue-600 dark:text-blue-400',
    hoverIconBg: 'group-hover:bg-blue-600 group-hover:text-white',
    accentText: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/10',
    shadowColor: 'hover:shadow-blue-500/2',
  };

  return (
    <div
      onClick={() => onSelectTool(tool.id as PageId)}
      className="group relative flex flex-col justify-between p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/40 dark:hover:border-blue-500/30 cursor-pointer"
    >
      <div>
        {/* Header: Icon + Category Badge + Favorite Star */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${theme.iconBg} ${theme.iconText} ${theme.hoverIconBg}`}
            >
              <ToolIcon name={tool.icon} className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {tool.category}
                </span>
                {tool.isPopular && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-md uppercase tracking-wider">
                    PRO MAX
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {tool.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e, tool.id);
            }}
            className="p-2 min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-amber-500 active:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Star
              size={18}
              className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-500'}
            />
          </button>
        </div>

        {/* Tool Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>
      </div>

      {/* Footer Tags & CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            #{tool.tags[0]}
          </span>
          {tool.tags[1] && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium hidden sm:inline-block">
              #{tool.tags[1]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <span>Open</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
