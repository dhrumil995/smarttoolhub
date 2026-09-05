import React, { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, Code2, Briefcase, Presentation, Video, Image, FileText, ArrowUpRight, Check, Star, ExternalLink, Sliders, ChevronDown, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIToolItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  category: 'students' | 'coding' | 'business' | 'presentations' | 'video' | 'images' | 'content';
  pricing: 'Free' | 'Freemium' | 'Paid';
  isPopular?: boolean;
  keyFeatures: string[];
  targetKeywords: string[];
}

const AI_TOOLS_DATA: AIToolItem[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    tagline: 'The ultimate conversational AI companion for work, study, and daily tasks.',
    description: 'OpenAI\'s flagship language model is the gold standard of modern AI, serving as one of the best AI tools like ChatGPT for brainstorming, rewriting, and structured workflow optimization.',
    url: 'https://chat.openai.com',
    category: 'students',
    pricing: 'Freemium',
    isPopular: true,
    keyFeatures: ['Advanced GPT-4o intelligence', 'Custom GPT configurations', 'DALL-E 3 image generation integrations', 'Advanced voice mode'],
    targetKeywords: ['best ai tools like chatgpt', 'best ai tools free', 'best ai tools for work', 'best ai tools for business', 'best ai tools for students', 'best ai tools for content writing', 'best ai tools 2025', 'best ai tools 2026']
  },
  {
    id: 'claude',
    name: 'Claude AI',
    tagline: 'State-of-the-art coding, long-form research, and document synthesis.',
    description: 'Created by Anthropic, Claude is recognized among the best AI tools for coding and research, providing massive 200k token context windows and highly precise, human-sounding syntax formatting.',
    url: 'https://claude.ai',
    category: 'coding',
    pricing: 'Freemium',
    isPopular: true,
    keyFeatures: ['Flawless codebase refactoring', 'Interactive artifact windows', 'Complex data chart synthesis', 'Extremely low hallucination rates'],
    targetKeywords: ['best ai tools for coding', 'best ai tools for students', 'best ai tools for college students', 'best ai tools for research', 'best ai tools 2025', 'best ai tools 2026']
  },
  {
    id: 'cursor',
    name: 'Cursor IDE',
    tagline: 'An AI-first code editor built directly on top of VS Code.',
    description: 'Cursor is widely considered the best AI tool for coding, enabling developers to write, debug, and reference entire directories with instant multi-file code editing capabilities.',
    url: 'https://cursor.com',
    category: 'coding',
    pricing: 'Freemium',
    isPopular: true,
    keyFeatures: ['Predictive next-line autocomplete', 'Natural language multi-file edits', 'Inline codebase terminal chat', 'Compatible with VS Code extensions'],
    targetKeywords: ['best ai tools for coding', 'best ai tools for work', 'best ai tools 2025', 'best ai tools 2026']
  },
  {
    id: 'gamma',
    name: 'Gamma App',
    tagline: 'Generate beautiful presentations, webpages, and document briefs in seconds.',
    description: 'Gamma is the best AI tool for presentations and PPT creation, utilizing a responsive fluid canvas to automatically turn prompt outlines into professional slides.',
    url: 'https://gamma.app',
    category: 'presentations',
    pricing: 'Freemium',
    isPopular: true,
    keyFeatures: ['1-click presentation layouts', 'Interactive embed components', 'Professional typography pairing', 'PDF and PowerPoint exports'],
    targetKeywords: ['best ai tools for presentations', 'best ai tools for ppt', 'best ai tools for students', 'best ai tools for college students', 'best ai tools 2025', 'best ai tools 2026']
  },
  {
    id: 'consensus',
    name: 'Consensus',
    tagline: 'Evidence-based scientific research assistant with peer-reviewed source matching.',
    description: 'Consensus is highly rated as the best AI tool for research and studying, connecting student queries directly to a database of 200 million peer-reviewed science papers with synthesized answers.',
    url: 'https://consensus.app',
    category: 'students',
    pricing: 'Freemium',
    isPopular: false,
    keyFeatures: ['Ad-free peer-reviewed citations', 'Smart consensus meter ratings', 'Instant research summary matrices', 'Fully citation-compliant outputs'],
    targetKeywords: ['best ai tools for research', 'best ai tools for studying', 'best ai tools for college students', 'best ai tools for teachers', 'best ai tools 2025', 'best ai tools 2026']
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    tagline: 'Ultra-realistic cinematic image generation and stylized vector design.',
    description: 'Unmatched in detail, Midjourney is the industry-leading best AI tool for image generation, perfect for graphic designers, game developers, and branding creators.',
    url: 'https://midjourney.com',
    category: 'images',
    pricing: 'Paid',
    isPopular: true,
    keyFeatures: ['Photorealistic prompt textures', 'Consistent character styling parameters', 'Advanced pan and zoom modifiers', 'Active Discord rendering lounge'],
    targetKeywords: ['best ai tools for image generation', 'best ai tools 2025', 'best ai tools 2026']
  },
  {
    id: 'runway',
    name: 'Runway Gen-3 Alpha',
    tagline: 'Cinematic prompt-to-video generation with custom physics pacing.',
    description: 'Runway is the premier best AI tool for video creation and editing, transforming simple words into high-framerate, beautifully-rendered cinematic video clips.',
    url: 'https://runwayml.com',
    category: 'video',
    pricing: 'Freemium',
    isPopular: true,
    keyFeatures: ['Hyper-realistic human motions', 'Motion brush regional control', 'Prompt-based camera transitions', 'High-speed cloud render engines'],
    targetKeywords: ['best ai tools for video creation', 'best ai tools for video editing', 'best ai tools 2025', 'best ai tools 2026']
  },
  {
    id: 'capcut',
    name: 'CapCut AI Suite',
    tagline: 'Free multi-track online video editor with automated subtitles.',
    description: 'Perfect for social media creators, CapCut is the best AI tool for video editing free, offering powerful templates, background removal, and smart dynamic zoom.',
    url: 'https://capcut.com',
    category: 'video',
    pricing: 'Free',
    isPopular: false,
    keyFeatures: ['1-click auto-captions translation', 'Smart green screen background removal', 'Trending TikTok sound filters', 'Multi-track timeline editing'],
    targetKeywords: ['best ai tools for video editing free', 'best ai tools for video editing', 'best ai tools free', 'best ai tools 2025']
  },
  {
    id: 'quillbot',
    name: 'QuillBot',
    tagline: 'The ultimate paraphraser, summarizer, and grammar analyzer.',
    description: 'An essential for studying, QuillBot is the best AI tool for content writing and college students, helping rewrite paragraphs and correct citation styles securely.',
    url: 'https://quillbot.com',
    category: 'content',
    pricing: 'Freemium',
    isPopular: false,
    keyFeatures: ['Dynamic synonym slider modes', 'Built-in plagiarism checkers', 'Direct Chrome & Word integrations', 'Multi-format citation generator'],
    targetKeywords: ['best ai tools for content writing', 'best ai tools for studying', 'best ai tools for college students', 'best ai tools for students']
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    tagline: 'Supercharge your workspace, meeting logs, and team knowledge wiki.',
    description: 'Directly integrated into Notion, this is the best AI tool for business and work, automatically summarizing action points from chaotic docs.',
    url: 'https://notion.so',
    category: 'business',
    pricing: 'Paid',
    isPopular: false,
    keyFeatures: ['Automated databases generation', 'Inline prose paraphrasing controls', 'Multi-document QA queries', 'Action item extraction formulas'],
    targetKeywords: ['best ai tools for business', 'best ai tools for work', 'best ai tools 2025', 'best ai tools 2026']
  }
];

const CATEGORY_TABS = [
  { id: 'all', name: 'All Categories', icon: Sparkles, desc: 'Complete high-value AI directory' },
  { id: 'students', name: 'Students & Studying', icon: BookOpen, desc: 'Best AI tools for students & college studying' },
  { id: 'coding', name: 'Coding & Dev', icon: Code2, desc: 'Best AI tools for coding & software developers' },
  { id: 'business', name: 'Business & Work', icon: Briefcase, desc: 'Best AI tools for business & workplace efficiency' },
  { id: 'presentations', name: 'Presentations & PPT', icon: Presentation, desc: 'Best AI tools for presentations & slide designs' },
  { id: 'video', name: 'Video Creation', icon: Video, desc: 'Best AI tools for video editing & video creation' },
  { id: 'images', name: 'Image Generation', icon: Image, desc: 'Best AI tools for image generation & graphic assets' },
  { id: 'content', name: 'Content & Writing', icon: FileText, desc: 'Best AI tools for content writing & SEO' }
];

export default function AIToolsDirectory() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  // Filter tools based on selected tab and local search query
  const filteredAITools = useMemo(() => {
    return AI_TOOLS_DATA.filter((tool) => {
      const matchesTab = activeTab === 'all' || tool.category === activeTab;
      const query = localSearch.toLowerCase().trim();
      if (!query) return matchesTab;
      
      const matchesText = 
        tool.name.toLowerCase().includes(query) ||
        tool.tagline.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keyFeatures.some(f => f.toLowerCase().includes(query)) ||
        tool.targetKeywords.some(k => k.toLowerCase().includes(query));

      return matchesTab && matchesText;
    });
  }, [activeTab, localSearch]);

  return (
    <section className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-10 space-y-8 relative overflow-hidden" id="ai-directory-hub">
      {/* Dynamic ambient lights */}
      <div className="absolute top-0 right-0 h-48 w-48 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 h-48 w-48 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid Headers */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/50 text-violet-700 dark:text-violet-400 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
          <Award size={11} className="text-violet-500" />
          Rankings & Directory
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Best AI Tools for Students, Coding & Work
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Explore our expert-curated rankings of the <strong>best AI tools of 2025 and 2026</strong>. From free video editors to advanced coding companions, maximize your college and business productivity workflows.
        </p>
      </div>

      {/* Inline Search Bar inside Directory */}
      <div className="max-w-md mx-auto">
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 opacity-20 group-hover:opacity-35 blur-sm transition duration-300" />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 stroke-[2.5]" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search best AI tools (e.g. 'coding', 'students', 'free')..."
              className="w-full pl-10 pr-4 py-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Slider Tabs */}
      <div className="overflow-hidden">
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none flex-nowrap gap-1.5 justify-start sm:justify-center">
          {CATEGORY_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedToolId(null);
                }}
                className={`px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/15'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={tab.desc}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
        {filteredAITools.length > 0 ? (
          filteredAITools.map((tool) => {
            const isExpanded = selectedToolId === tool.id;
            return (
              <div
                key={tool.id}
                className={`group bg-white dark:bg-slate-900 border rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 relative ${
                  isExpanded 
                    ? 'border-violet-500/60 dark:border-violet-500/40 shadow-md ring-1 ring-violet-500/5' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-violet-500/40 dark:hover:border-violet-500/30 hover:shadow-sm'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {tool.name}
                      </h3>
                      {tool.isPopular && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15 font-mono text-[8px] font-bold uppercase tracking-wider">
                          Gold Standard
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[9px] font-bold border border-slate-200/40 dark:border-slate-700/55">
                      {tool.pricing}
                    </span>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                    {tool.tagline}
                  </p>
                  
                  <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed font-normal">
                    {tool.description}
                  </p>

                  {/* Accordion / Expandable Feature highlights block */}
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedToolId(isExpanded ? null : tool.id)}
                      className="text-[10px] text-violet-600 dark:text-violet-400 font-bold hover:underline flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide feature details' : 'View target highlights & keywords'}</span>
                      <ChevronDown size={11} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 space-y-3 border-t border-slate-100 dark:border-slate-800/65 mt-3 text-xs">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Key features:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {tool.keyFeatures.map((feat) => (
                                  <div key={feat} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <Check size={11} className="text-emerald-500 shrink-0" />
                                    <span>{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Semantic Target Keywords (Hidden organically inside code but indexable / accessible as tags) */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Target categories:</span>
                              <div className="flex flex-wrap gap-1">
                                {tool.targetKeywords.slice(0, 4).map((kw) => (
                                  <span key={kw} className="text-[9px] font-mono bg-violet-50/50 dark:bg-violet-950/20 text-violet-500 border border-violet-100/50 dark:border-violet-900/30 px-1.5 py-0.5 rounded-md">
                                    #{kw.replace('best ai tools ', '')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Category: {tool.category}
                  </span>
                  <a
                    href={tool.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/30 dark:hover:bg-violet-950/50 border border-violet-100/50 dark:border-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    <span>Launch AI App</span>
                    <ArrowUpRight size={11} />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl p-10 text-center space-y-3">
            <Search className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">No ranked AI tools found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              We couldn't find matches for "{localSearch}". Try clearing filters or searching simpler terms like "coding", "ppt", or "students".
            </p>
            <button
              onClick={() => {
                setLocalSearch('');
                setActiveTab('all');
              }}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[10px] rounded-lg cursor-pointer"
            >
              Reset Search Parameters
            </button>
          </div>
        )}
      </div>

      {/* SEO Bottom block - Structured Semantic Text naturally optimizing for Google keyword density */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-normal">
        <p>
          Our evaluation methodology filters the <strong>best AI tools of 2025 and 2026</strong> based on precision, workflow compatibility, and cost accessibility. College students studying complex curriculums can utilize the <strong>best AI tools for students</strong> alongside tools like ChatGPT and scientific assistants to condense complex research papers into structured presentations and high-scoring summaries.
        </p>
        <p>
          For developers, programmers, and software engineering managers, deploying the <strong>best AI tools for coding</strong> like Claude, Gemini, or Cursor IDE accelerates daily testing, schema verification, and multi-file code editing. These assistants pair beautifully with SmartToolHub\'s client-side JSON formatters and secure base64 encoders to provide an end-to-end local debugging sandbox.
        </p>
        <p>
          Business owners, remote employees, and team leads should focus on the <strong>best AI tools for business</strong> and work. By combining automated database generators with high-CTR YouTube metadata analyzers, dynamic PDF-to-Word templates, and professional PPT presentation slides, teams can achieve unmatched output scale with minimal friction.
        </p>
      </div>
    </section>
  );
}
