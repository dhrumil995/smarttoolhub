import React, { useState, useEffect } from 'react';
import { BlogPost, PageId } from '../types';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { NewsletterBox } from '../components/NewsletterBox';
import SEOHead from '../components/SEOHead';
import {
  Clock,
  Calendar,
  User,
  Share2,
  Heart,
  Bookmark,
  Copy,
  Check,
  List,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPostPageProps {
  slug: string;
  setCurrentPage: (page: PageId) => void;
  onSelectArticle: (slug: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  slug,
  setCurrentPage,
  onSelectArticle
}) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Table of Contents headings
  const [tocHeadings, setTocHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [isTocOpen, setIsTocOpen] = useState(true);

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccessMsg, setCommentSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchArticleData();
    checkBookmarkState();
  }, [slug]);

  const checkBookmarkState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('sth_bookmarked_posts') || '[]');
      setIsBookmarked(saved.includes(slug));
    } catch (e) {}
  };

  const toggleBookmark = () => {
    try {
      let saved = JSON.parse(localStorage.getItem('sth_bookmarked_posts') || '[]');
      if (saved.includes(slug)) {
        saved = saved.filter((s: string) => s !== slug);
        setIsBookmarked(false);
      } else {
        saved.push(slug);
        setIsBookmarked(true);
      }
      localStorage.setItem('sth_bookmarked_posts', JSON.stringify(saved));
    } catch (e) {}
  };

  const fetchArticleData = async () => {
    setLoading(true);
    try {
      // Fetch article by slug
      const res = await fetch(`/api/blog/posts/${slug}`);
      const data = await res.json();

      if (data.success && data.post) {
        setPost(data.post);
        setLikes(data.post.likes || 0);
        parseTableOfContents(data.post.content);
      }

      // Fetch all posts for related posts & prev/next
      const allRes = await fetch('/api/blog/posts');
      const allData = await allRes.json();
      if (allData.success) {
        setAllPosts(allData.posts || []);
      }

      // Fetch comments
      const cmtRes = await fetch(`/api/blog/posts/${slug}/comments`);
      const cmtData = await cmtRes.json();
      if (cmtData.success) {
        setComments(cmtData.comments || []);
      }
    } catch (e) {
      console.error('Failed to load article:', e);
    } finally {
      setLoading(false);
    }
  };

  // Parse Table of Contents from markdown headings (## and ###)
  const parseTableOfContents = (markdown: string) => {
    const lines = markdown.split('\n');
    const headings: { id: string; text: string; level: number }[] = [];

    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({ id, text, level: 2 });
      } else if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({ id, text, level: 3 });
      }
    });

    setTocHeadings(headings);
  };

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);

    try {
      await fetch(`/api/blog/posts/${slug}/like`, { method: 'POST' });
    } catch (e) {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'linkedin' | 'facebook') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post ? post.title : 'Check out this article on SmartToolHub!');

    let shareUrl = '';
    if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

    if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) return;

    setSubmittingComment(true);
    setCommentSuccessMsg(null);

    try {
      const res = await fetch(`/api/blog/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: commentName,
          authorEmail: commentEmail,
          content: commentContent
        })
      });

      const data = await res.json();
      setSubmittingComment(false);

      if (res.ok && data.success) {
        setComments((prev) => [...prev, data.comment]);
        setCommentName('');
        setCommentEmail('');
        setCommentContent('');
        setCommentSuccessMsg('Your comment has been published!');
      }
    } catch (e) {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 size={36} className="animate-spin text-blue-500" />
        <p className="text-xs font-bold">Loading SmartToolHub Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Article Not Found</h2>
        <p className="text-xs text-slate-500">The article you are looking for does not exist or has been moved.</p>
        <button
          onClick={() => setCurrentPage('blog')}
          className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
        >
          Back to Blog Homepage
        </button>
      </div>
    );
  }

  // Calculate Previous and Next Articles
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevArticle = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextArticle = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Related Articles Algorithm: match by category, tags, or fallback
  const relatedArticles = allPosts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 5;
      const sharedTags = p.tags.filter((t) => post.tags.includes(t));
      score += sharedTags.length * 2;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.post);

  // SEO Schema Injection Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://smarttoolhub.net/blog/${post.slug}`
    },
    'headline': post.title,
    'description': post.metaDescription || post.excerpt,
    'image': `https://smarttoolhub.net/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'SmartToolHub',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://smarttoolhub.net/favicon.ico'
      }
    },
    'datePublished': post.publishedAt,
    'dateModified': post.updatedAt || post.publishedAt
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      
      {/* On-Page SEO Head Meta Tags */}
      <SEOHead
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        keywords={post.metaKeywords || post.tags}
        isTool={false}
      />

      {/* Dynamic Article Schema Injected via Script Tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">

        {/* BREADCRUMB & BACK LINK */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setCurrentPage('blog')}
            className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Blog</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-0.5 rounded-lg text-[11px]">
              {post.category}
            </span>
          </div>
        </div>

        {/* ARTICLE HERO HEADER */}
        <div className="space-y-4">
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {post.excerpt}
          </p>

          {/* Author, Date, Reading Time */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-500/20">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{post.author.name}</h3>
                <p className="text-[11px] text-slate-400">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {post.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {post.readingTime}
              </span>
            </div>
          </div>
        </div>

        {/* EXECUTIVE SUMMARY / KEY TAKEAWAY CARD (Replaces unneeded hero photo) */}
        <div className="bg-gradient-to-br from-blue-500/10 via-slate-900/5 to-indigo-500/10 dark:from-blue-950/40 dark:via-slate-900/40 dark:to-indigo-950/40 rounded-3xl p-6 border border-blue-500/20 dark:border-blue-500/30 space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Executive Overview & Key Insights</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* SOCIAL SHARE & INTERACTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Share:</span>
            <button
              onClick={() => handleShare('whatsapp')}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Twitter / X
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              LinkedIn
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedLink ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasLiked
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}
            >
              <Heart size={14} fill={hasLiked ? 'currentColor' : 'none'} />
              <span>{likes} Likes</span>
            </button>

            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark article'}
            >
              <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* TABLE OF CONTENTS */}
        {tocHeadings.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <List size={16} className="text-blue-500" />
                <span>Table of Contents</span>
              </h3>
              {isTocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {isTocOpen && (
              <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {tocHeadings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                    <a
                      href={`#${h.id}`}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      • {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ARTICLE MARKDOWN CONTENT */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <MarkdownRenderer
            content={post.content}
            setCurrentPage={setCurrentPage}
            onSelectArticle={onSelectArticle}
          />
        </div>

        {/* CALL TO ACTION BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
              <Zap size={14} className="text-amber-300" />
              <span>Free Browser AI Tools</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold">
              Ready to automate your Invoice OCR & GST workflow?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Try our 100% client-side AI tools on SmartToolHub. Zero server upload, total privacy.
            </p>
          </div>

          <button
            onClick={() => {
              const primaryTool = post.relatedToolIds?.[0] || 'ai-invoice-ocr';
              setCurrentPage(primaryTool as PageId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-extrabold px-6 py-3.5 rounded-2xl transition-all shadow-lg cursor-pointer shrink-0"
          >
            Launch AI Tool Now
          </button>
        </div>

        {/* DYNAMIC FAQ SECTION */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle size={18} className="text-blue-500" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3">
              {post.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 cursor-pointer"
                  >
                    <span>Q: {faq.q}</span>
                    {openFaqIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openFaqIndex === idx && (
                    <div className="p-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUTHOR BIO CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Written by</span>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{post.author.name}</h4>
            <p className="text-xs font-semibold text-slate-500">{post.author.role}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
              {post.author.bio || 'Enterprise FinTech and AI systems consultant writing about client-side document processing, GST compliance, and MSME workflow automation.'}
            </p>
          </div>
        </div>

        {/* PREVIOUS & NEXT ARTICLE NAVIGATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevArticle ? (
            <div
              onClick={() => onSelectArticle(prevArticle.slug)}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer space-y-1 group"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <ArrowLeft size={10} /> Previous Article
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 line-clamp-1">
                {prevArticle.title}
              </h4>
            </div>
          ) : <div />}

          {nextArticle ? (
            <div
              onClick={() => onSelectArticle(nextArticle.slug)}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer space-y-1 text-right group"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                Next Article <ArrowRight size={10} />
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 line-clamp-1">
                {nextArticle.title}
              </h4>
            </div>
          ) : <div />}
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-blue-500" />
              <span>Related Recommended Guides</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel.slug)}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg uppercase">{rel.category}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{rel.readingTime}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMENTS SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-500" />
            <span>Comments ({comments.length})</span>
          </h3>

          {/* Submit Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Leave a Reply</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your Name *"
                required
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                placeholder="Your Email (Optional)"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write your thoughts or ask a question about this guide..."
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-between pt-1">
              {commentSuccessMsg ? (
                <span className="text-xs text-emerald-500 font-bold">{commentSuccessMsg}</span>
              ) : <span />}

              <button
                type="submit"
                disabled={submittingComment}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submittingComment ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                <span>Post Comment</span>
              </button>
            </div>
          </form>

          {/* List of Comments */}
          <div className="space-y-3 pt-2">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments yet. Be the first to start the discussion!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{c.authorName}</span>
                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NEWSLETTER SUBSCRIBE BOX */}
        <div className="pt-4">
          <NewsletterBox variant="card" source={`article_${slug}`} />
        </div>

      </div>
    </div>
  );
};
