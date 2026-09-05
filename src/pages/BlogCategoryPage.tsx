import React, { useState, useEffect } from 'react';
import { BlogPost, PageId } from '../types';
import { BLOG_CATEGORIES } from '../data/blogArticlesData';
import { NewsletterBox } from '../components/NewsletterBox';
import SEOHead from '../components/SEOHead';
import { ArrowLeft, Clock, BookOpen, Tag, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogCategoryPageProps {
  type: 'category' | 'tag';
  value: string;
  setCurrentPage: (page: PageId) => void;
  onSelectArticle: (slug: string) => void;
}

export const BlogCategoryPage: React.FC<BlogCategoryPageProps> = ({
  type,
  value,
  setCurrentPage,
  onSelectArticle
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilteredPosts();
  }, [type, value]);

  const fetchFilteredPosts = async () => {
    setLoading(true);
    try {
      const paramName = type === 'category' ? 'category' : 'tag';
      const res = await fetch(`/api/blog/posts?${paramName}=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error('Failed to load category posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const categoryMeta = BLOG_CATEGORIES.find(
    (c) => c.slug === value.toLowerCase() || c.name.toLowerCase() === value.toLowerCase()
  );

  const displayTitle = categoryMeta ? categoryMeta.name : value;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <SEOHead
        title={`${displayTitle} Articles | SmartToolHub Knowledge Base`}
        description={categoryMeta?.description || `Explore top guides and tutorials tagged under #${value} on SmartToolHub.`}
        keywords={[value, 'blog', 'smarttoolhub', 'automation']}
        isTool={false}
      />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* BREADCRUMB HEADER */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            onClick={() => setCurrentPage('blog')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to All Blog Posts</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
              {type === 'category' ? 'Category' : 'Tag Cluster'}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white capitalize">
            {categoryMeta ? categoryMeta.name : value} Articles
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {categoryMeta?.description || `Browse our latest articles, guides, and tutorials tagged under #${value}.`}
          </p>
        </div>

        {/* ARTICLES GRID */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p className="text-xs font-bold">Loading Category Articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center space-y-3 border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No articles currently listed under this category.</p>
            <button
              onClick={() => setCurrentPage('blog')}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              Explore All Articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
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

        {/* NEWSLETTER BOX */}
        <div className="pt-8">
          <NewsletterBox variant="card" source={`category_${value}`} />
        </div>

      </div>
    </div>
  );
};
