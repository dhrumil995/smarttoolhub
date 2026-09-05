import React, { useState } from 'react';
import { Home, ChevronRight, Layers, ChevronDown, Check } from 'lucide-react';
import { PageId } from '../types';
import { CATEGORIES, TOOLS } from '../data/tools';
import { ToolIcon } from '../pages/Home';

interface BreadcrumbItem {
  name: string;
  url: string;
  pageId?: PageId | string;
  isCategory?: boolean;
  categoryId?: string;
}

interface BreadcrumbNavProps {
  toolId?: string;
  toolName?: string;
  categoryId?: string;
  categoryName?: string;
  customItems?: BreadcrumbItem[];
  onNavigatePage?: (page: PageId) => void;
  onNavigateCategory?: (categoryId: string) => void;
}

export function BreadcrumbNav({
  toolId,
  toolName,
  categoryId,
  categoryName,
  customItems,
  onNavigatePage,
  onNavigateCategory,
}: BreadcrumbNavProps) {
  const [siblingDropdownOpen, setSiblingDropdownOpen] = useState(false);

  // Look up category info if not directly provided
  const targetCategory = categoryId ? CATEGORIES.find((c) => c.id === categoryId) : null;
  const resolvedCategoryName = categoryName || targetCategory?.name || 'Tools';
  const resolvedCategoryId = categoryId || targetCategory?.id || 'dev';

  // Sibling tools in the same category for quick horizontal jumping
  const siblingTools = resolvedCategoryId
    ? TOOLS.filter((t) => t.category === resolvedCategoryId)
    : [];

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigatePage) {
      onNavigatePage('home');
    } else {
      window.location.href = '/';
    }
  };

  const handleCategoryClick = (e: React.MouseEvent, catId: string) => {
    e.preventDefault();
    if (onNavigateCategory) {
      onNavigateCategory(catId);
    } else if (onNavigatePage) {
      onNavigatePage('category-hub' as PageId);
    } else {
      window.location.href = `/category/${catId}`;
    }
  };

  const handleToolClick = (e: React.MouseEvent, targetToolId: string) => {
    e.preventDefault();
    if (onNavigatePage) {
      onNavigatePage(targetToolId as PageId);
    } else {
      window.location.href = `/${targetToolId}`;
    }
    setSiblingDropdownOpen(false);
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full flex items-center justify-between py-2 px-3 sm:px-4 bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 mb-6 transition-all"
    >
      {/* Semantic Microdata Breadcrumb List for SEO */}
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center flex-wrap gap-1.5 sm:gap-2 min-w-0"
      >
        {/* Step 1: Home */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center gap-1.5"
        >
          <a
            itemProp="item"
            href="/"
            onClick={handleHomeClick}
            className="group flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Home size={13} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span itemProp="name">Home</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>

        {/* Separator */}
        <ChevronRight size={13} className="text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />

        {/* Custom items or standard Tool/Category path */}
        {customItems ? (
          customItems.map((item, index) => (
            <React.Fragment key={item.url}>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-1.5"
              >
                {index === customItems.length - 1 ? (
                  <span
                    itemProp="name"
                    aria-current="page"
                    className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs"
                  >
                    {item.name}
                  </span>
                ) : (
                  <a
                    itemProp="item"
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.pageId && onNavigatePage) {
                        onNavigatePage(item.pageId as PageId);
                      }
                    }}
                    className="font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                  >
                    <span itemProp="name">{item.name}</span>
                  </a>
                )}
                <meta itemProp="position" content={String(index + 2)} />
              </li>
              {index < customItems.length - 1 && (
                <ChevronRight size={13} className="text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
              )}
            </React.Fragment>
          ))
        ) : (
          <>
            {/* Step 2: Category Hub */}
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5"
            >
              <a
                itemProp="item"
                href={`/category/${resolvedCategoryId}`}
                onClick={(e) => handleCategoryClick(e, resolvedCategoryId)}
                className="group flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {targetCategory && (
                  <span className="p-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <ToolIcon name={targetCategory.icon} className="h-3 w-3" />
                  </span>
                )}
                <span itemProp="name">{resolvedCategoryName}</span>
              </a>
              <meta itemProp="position" content="2" />
            </li>

            {/* Separator */}
            <ChevronRight size={13} className="text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />

            {/* Step 3: Current Tool */}
            {toolName && (
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-1.5 min-w-0"
              >
                <span
                  itemProp="name"
                  aria-current="page"
                  className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[180px] sm:max-w-sm md:max-w-md"
                >
                  {toolName}
                </span>
                <link itemProp="item" href={`https://smarttoolhub.net/${toolId || ''}`} />
                <meta itemProp="position" content="3" />
              </li>
            )}
          </>
        )}
      </ol>

      {/* Sibling Category Quick Jump Dropdown for Improved UX & Internal Linking */}
      {siblingTools.length > 1 && (
        <div className="relative shrink-0 ml-2">
          <button
            onClick={() => setSiblingDropdownOpen(!siblingDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-[11px] font-semibold text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-colors cursor-pointer"
            title="Browse other tools in this category"
          >
            <Layers size={11} className="text-blue-500" />
            <span className="hidden md:inline">Other {resolvedCategoryName} Tools</span>
            <span className="md:hidden">Tools ({siblingTools.length})</span>
            <ChevronDown size={11} className={`text-slate-400 transition-transform duration-200 ${siblingDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {siblingDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setSiblingDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-64 max-h-72 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-40 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                  {resolvedCategoryName} Category ({siblingTools.length})
                </div>
                {siblingTools.map((t) => {
                  const isCurrent = t.id === toolId;
                  return (
                    <a
                      key={t.id}
                      href={`/${t.id}`}
                      onClick={(e) => handleToolClick(e, t.id)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      {isCurrent && <Check size={12} className="text-blue-500 shrink-0 ml-2" />}
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default BreadcrumbNav;
