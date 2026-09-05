import React, { useState, useEffect } from 'react';
import { BlogPost, BlogCategoryName, PageId } from '../types';
import { BLOG_CATEGORIES } from '../data/blogArticlesData';
import { NewsletterBox } from '../components/NewsletterBox';
import SEOHead from '../components/SEOHead';
import {
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  SlidersHorizontal,
  ChevronRight,
  Tag,
  Eye,
  Heart,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

interface BlogHomeProps {
  setCurrentPage: (page: PageId) => void;
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectTag: (tag: string) => void;
}

export const BlogHome: React.FC<BlogHomeProps> = ({
  setCurrentPage,
  onSelectArticle,
  onSelectCategory,
  onSelectTag
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedTag]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = '/api/blog/posts';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedTag !== 'all') params.append('tag', selectedTag);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error('Failed to fetch blog posts:', e);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts locally by search query
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];
  const popularPosts = posts.filter((p) => p.isPopular).slice(0, 5);
  const trendingPosts = posts.filter((p) => p.isTrending).slice(0, 5);

  // Collect all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 16);

  // Paginated articles
  const paginatedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredPosts.length / pageSize) || 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <SEOHead
        title="Blog - AI Business Tools, OCR & Compliance Guides | SmartToolHub"
        description="In-depth articles, tutorials, and benchmarks on Invoice OCR, GST tax compliance, YouTube SEO, and privacy-first client-side web automation."
        keywords={['blog', 'smarttoolhub', 'invoice ocr', 'gst compliance', 'developer utilities', 'ai tools']}
        isTool={false}
      />

      <div className="max-w-7xl mx-auto space-y-12">

        {/* 1. BLOG HERO HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Sparkles size={14} />
            <span>SmartToolHub Knowledge Base</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            AI Business Tools, GST Compliance & Automation Blog
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            In-depth guides, OCR benchmarks, tax compliance tutorials, and zero-latency client-side automation strategies for enterprise teams.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search articles on Invoice OCR, GST, Purchase Orders, PDF..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2. CATEGORY TABS HORIZONTAL SCROLL */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('all');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all' && selectedTag === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Articles ({posts.length})
          </button>

          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSelectedTag('all');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 3. FEATURED ARTICLE HERO CARD */}
        {featuredPost && !searchQuery && selectedCategory === 'all' && selectedTag === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6 group"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Featured Guide
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[11px] font-bold px-3 py-0.5 rounded-full border border-blue-500/30">
                  {featuredPost.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {featuredPost.readingTime}
                </span>
                <span>•</span>
                <span>{featuredPost.publishedAt}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2
                onClick={() => onSelectArticle(featuredPost.slug)}
                className="font-display text-2xl sm:text-3xl font-extrabold text-white hover:text-blue-400 transition-colors cursor-pointer leading-tight"
              >
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl line-clamp-3">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
                  {featuredPost.author.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{featuredPost.author.name}</h4>
                  <p className="text-[10px] text-slate-400">{featuredPost.author.role}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectArticle(featuredPost.slug)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/30 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read Full Article</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* 4. MAIN CONTENT AREA: ARTICLES GRID + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">

          {/* Left Column: Articles List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={18} className="text-blue-500" />
                <span>
                  {selectedCategory !== 'all'
                    ? `${selectedCategory} Articles`
                    : selectedTag !== 'all'
                    ? `Tagged: #${selectedTag}`
                    : 'Latest Articles'}
                </span>
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Loader2 size={32} className="animate-spin text-blue-500" />
                <p className="text-xs">Loading Knowledge Base Articles...</p>
              </div>
            ) : paginatedPosts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center space-y-3 border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No articles match your search filter.</p>
                <p className="text-xs text-slate-400">Try clearing your search query or selecting a different category tab.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedTag('all');
                  }}
                  className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-wide">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Clock size={10} />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onSelectArticle(post.slug)}
                        className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {post.author.name.charAt(0)}
                        </div>
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[100px]">
                          {post.author.name}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectArticle(post.slug)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Read</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-medium px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6">

            {/* Trending Articles Block */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <TrendingUp size={14} className="text-amber-500" />
                <span>Trending Business Guides</span>
              </h3>

              <div className="space-y-3">
                {trendingPosts.map((tp, idx) => (
                  <div
                    key={tp.id}
                    onClick={() => onSelectArticle(tp.slug)}
                    className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl cursor-pointer transition-colors group"
                  >
                    <span className="font-display text-lg font-black text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors w-5 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                        {tp.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{tp.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Eye size={10} /> {tp.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Cloud Block */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Tag size={14} className="text-blue-500" />
                <span>Popular Tags</span>
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setSelectedCategory('all');
                      setPage(1);
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Articles Block */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-500" />
                <span>Most Liked Tutorials</span>
              </h3>

              <div className="space-y-3">
                {popularPosts.map((pop) => (
                  <div
                    key={pop.id}
                    onClick={() => onSelectArticle(pop.slug)}
                    className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl cursor-pointer transition-colors group"
                  >
                    <img
                      src={pop.featuredImage}
                      alt={pop.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors truncate">
                        {pop.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 text-rose-500 font-bold"><Heart size={10} fill="currentColor" /> {pop.likes}</span>
                        <span>•</span>
                        <span>{pop.readingTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 5. NEWSLETTER SUBSCRIPTION SECTION */}
        <div className="pt-8">
          <NewsletterBox variant="card" source="blog_homepage" />
        </div>

      </div>
    </div>
  );
};
