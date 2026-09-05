import React, { useState } from 'react';
import { Copy, Plus, X, Check, RotateCcw, Sparkles, Hash, AlertTriangle, ListChecks } from 'lucide-react';

interface GeneratedItem {
  text: string;
  score: number; // SEO weight score
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  tech: ['tutorial', 'coding', 'review', 'technology', 'how to', 'programming', 'software', 'guide', 'unboxing', 'walkthrough', 'setup', 'pc', 'development'],
  gaming: ['gameplay', 'lets play', 'walkthrough', 'review', 'gaming', 'funny moments', 'stream', 'twitch', 'ps5', 'xbox', 'highlights', 'esports', 'guide'],
  cooking: ['recipe', 'cooking', 'food', 'how to cook', 'easy recipe', 'delicious', 'kitchen', 'meal prep', 'healthy', 'homemade', 'baking', 'chef'],
  finance: ['investing', 'personal finance', 'money', 'stock market', 'crypto', 'saving money', 'budget', 'passive income', 'business', 'financial freedom'],
  lifestyle: ['vlog', 'daily routine', 'travel', 'minimalism', 'productivity', 'day in the life', 'fashion', 'haul', 'aesthetic', 'motivation', 'organization'],
};

export default function YTTagsGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [tags, setTags] = useState<GeneratedItem[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedSingleIndex, setCopiedSingleIndex] = useState<number | null>(null);

  const generateSEOData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const query = topic.trim().toLowerCase();
    const queryWords = query.split(/\s+/).filter(w => w.length > 2);

    // Heuristic base tag building for high-volume YouTube SEO
    const baseTags = new Set<string>();
    
    // 1. Add exact matches and combinations of user query
    baseTags.add(query);
    if (queryWords.length > 1) {
      baseTags.add(queryWords.join(' '));
      baseTags.add(queryWords.join(''));
      queryWords.forEach(word => baseTags.add(word));
    }

    // 2. Add niche-specific additions & LSI variations
    const selectedNicheWords = CATEGORY_KEYWORDS[niche] || CATEGORY_KEYWORDS.tech;
    if (queryWords.length > 0) {
      const primaryWord = queryWords[0];
      selectedNicheWords.forEach(nw => {
        baseTags.add(`${primaryWord} ${nw}`);
        baseTags.add(`${query} ${nw}`);
        baseTags.add(`how to ${nw} ${query}`);
      });
    } else {
      selectedNicheWords.forEach(nw => baseTags.add(nw));
    }

    // 3. YouTube search intent expanders & long-tail boosters
    const universalExpanders = [
      '2026', 'full tutorial', 'explained', 'for beginners', 'tips and tricks',
      'secrets', 'best practices', 'hacks', 'step by step', 'masterclass',
      'complete guide', 'review', 'examples', 'course', 'workflow'
    ];
    queryWords.forEach(w => {
      universalExpanders.forEach(exp => {
        baseTags.add(`${w} ${exp}`);
        baseTags.add(`${query} ${exp}`);
      });
    });

    // Transform into scoring list up to 45 tags
    const generatedTags: GeneratedItem[] = Array.from(baseTags)
      .map((tag) => {
        let score = 75 + (tag.length % 15);
        if (tag.includes(query)) score += 15;
        if (tag.includes('2026') || tag.includes('tutorial') || tag.includes('guide')) score += 5;
        return { text: tag.toLowerCase(), score: Math.min(score, 99) };
      })
      .slice(0, 45); // Support up to 45 tags

    // Generate Hashtags (15-20 tags)
    const generatedHashtags = new Set<string>();
    const cleanTopicHash = query.replace(/[^a-z0-9]/g, '');
    if (cleanTopicHash) {
      generatedHashtags.add(cleanTopicHash);
      generatedHashtags.add(`${cleanTopicHash}tutorial`);
      generatedHashtags.add(`${cleanTopicHash}2026`);
      generatedHashtags.add(`${cleanTopicHash}tips`);
    }
    
    queryWords.forEach(w => {
      const cleanW = w.replace(/[^a-z0-9]/g, '');
      if (cleanW) {
        generatedHashtags.add(cleanW);
        generatedHashtags.add(`${cleanW}guide`);
      }
    });

    const nicheHashes = {
      general: ['trending', 'youtube', 'viral', 'video', 'youtuber', 'contentcreator', 'subscribe'],
      tech: ['tech', 'coding', 'developer', 'programming', 'software', 'techreview', 'ai', 'webdev'],
      gaming: ['gaming', 'gamer', 'letsplay', 'videogames', 'gameplay', 'ps5', 'xbox', 'twitch'],
      cooking: ['foodie', 'recipe', 'cooking', 'chef', 'homecooking', 'healthyfood', 'delicious'],
      finance: ['finance', 'money', 'crypto', 'investing', 'passiveincome', 'stocks', 'business'],
      lifestyle: ['vlog', 'productivity', 'lifestyle', 'motivation', 'dailyvlog', 'selfcare', 'mindset'],
    }[niche] || ['trending', 'youtube', 'viral'];

    nicheHashes.forEach(h => generatedHashtags.add(h));
    
    setTags(generatedTags);
    setHashtags(Array.from(generatedHashtags).map(h => `#${h}`).slice(0, 18));
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    
    const formatted = newTag.trim().toLowerCase();
    if (!tags.some(t => t.text === formatted)) {
      setTags([...tags, { text: formatted, score: 95 }]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleRemoveHashtag = (index: number) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };

  // YouTube Tag Box formatting: comma-separated
  const getCommaSeparatedTags = () => tags.map(t => t.text).join(', ');
  const getSpaceSeparatedHashtags = () => hashtags.join(' ');

  // Total character calculation (max 500 characters)
  const totalTagsCharCount = getCommaSeparatedTags().length;
  const isOverCharLimit = totalTagsCharCount > 500;

  const handleCopyTags = () => {
    if (tags.length === 0) return;
    navigator.clipboard.writeText(getCommaSeparatedTags());
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleCopyHashtags = () => {
    if (hashtags.length === 0) return;
    navigator.clipboard.writeText(getSpaceSeparatedHashtags());
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleCopySingleTag = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSingleIndex(index);
    setTimeout(() => setCopiedSingleIndex(null), 1500);
  };

  const handleReset = () => {
    setTopic('');
    setNiche('general');
    setTags([]);
    setHashtags([]);
    setNewTag('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
        <form onSubmit={generateSEOData} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Input Keyword */}
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Video Topic / Core Keywords
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Build a React portfolio, Easy pasta recipes..."
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-850 dark:text-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Video Category/Niche */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Video Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-850 dark:text-slate-200 cursor-pointer"
              >
                <option value="general">General / Other</option>
                <option value="tech">Tech & Programming</option>
                <option value="gaming">Gaming & Streamers</option>
                <option value="cooking">Cooking & Food</option>
                <option value="finance">Finance & Investment</option>
                <option value="lifestyle">Lifestyle & Productivity</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles size={14} className="fill-white" />
              Generate Meta Tags
            </button>

            {tags.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} />
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {tags.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Tags Output */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-150 dark:border-slate-850 pb-4">
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ListChecks size={18} className="text-red-500" />
                    Generated SEO Video Tags
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click any tag to copy it separately, or click Copy All to add to YouTube Studio.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-lg border font-mono text-[10px] font-bold ${
                    isOverCharLimit 
                      ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-500'
                  }`}>
                    {totalTagsCharCount} / 500 Chars
                  </div>
                  <button
                    onClick={handleCopyTags}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {copiedTags ? <Check size={11} /> : <Copy size={11} />}
                    {copiedTags ? 'Copied All' : 'Copy All'}
                  </button>
                </div>
              </div>

              {isOverCharLimit && (
                <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 text-xs">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Over Limit Warning:</span> YouTube limits tags to 500 characters. Consider removing a few tags by clicking the cross icon to fit.
                  </div>
                </div>
              )}

              {/* Tag grid list */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 group hover:border-red-500/40 transition-colors"
                  >
                    <span 
                      onClick={() => handleCopySingleTag(tag.text, idx)}
                      className="cursor-pointer font-medium hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      {tag.text}
                      {copiedSingleIndex === idx ? (
                        <Check size={10} className="text-green-500" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          ({tag.score}%)
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => handleRemoveTag(idx)}
                      className="text-slate-400 hover:text-red-500 p-0.5 rounded-full transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Tag Form */}
              <form onSubmit={handleAddCustomTag} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add custom tag..."
                  className="px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-850 dark:text-slate-200"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={12} />
                  Add Tag
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Hashtags Output */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-3">
                <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Hash size={16} className="text-red-500" />
                  Hashtags
                </h3>
                <button
                  onClick={handleCopyHashtags}
                  className="p-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  title="Copy All Hashtags"
                >
                  {copiedHashtags ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {hashtags.map((hash, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/5 border border-red-500/10 text-red-600 dark:text-red-400 font-mono text-xs font-bold rounded-lg"
                  >
                    <span>{hash}</span>
                    <button
                      onClick={() => handleRemoveHashtag(idx)}
                      className="text-red-400 hover:text-red-600 p-0.5 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-850">
                Place these hashtags at the bottom of your video description. YouTube displays the first 3 hashtags right above your video title to maximize searches!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
