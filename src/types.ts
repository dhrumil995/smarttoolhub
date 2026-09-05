export type CategoryId = 'dev' | 'text' | 'design' | 'math' | 'youtube' | 'seo' | 'ai' | 'instagram' | 'business' | 'ai-business';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  color: string; // Tailwind color class for hover accents
}

export type ToolId =
  | 'json-formatter'
  | 'base64'
  | 'case-converter'
  | 'color-converter'
  | 'lorem-ipsum'
  | 'password-gen'
  | 'markdown-preview'
  | 'qr-generator'
  | 'yt-tags'
  | 'yt-thumbnail'
  | 'yt-earning'
  | 'yt-title'
  | 'yt-embed'
  | 'yt-channel'
  | 'yt-desc'
  | 'seo-keyword'
  | 'seo-schema'
  | 'seo-auditor'
  | 'ai-code'
  | 'ai-regex'
  | 'ai-writer'
  | 'ai-humanizer'
  | 'ai-detector'
  | 'plagiarism-checker'
  | 'image-compressor'
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'bg-remover'
  | 'image-to-text'
  | 'yt-transcript'
  | 'yt-timestamp'
  | 'yt-tag-extractor'
  | 'keyword-research'
  | 'meta-title'
  | 'google-search-console'
  | 'adsense-checker'
  | 'robots-generator'
  | 'hash-generator'
  | 'url-encoder'
  | 'html-entities'
  | 'glassmorphism'
  | 'json-converter'
  | 'diff-checker'
  | 'svg-converter'
  | 'word-counter'
  | 'sql-formatter'
  | 'utm-builder'
  | 'sitelinks-generator'
  | 'ig-hashtag'
  | 'ig-caption'
  | 'ig-bio'
  | 'ig-photo-resizer'
  | 'ig-grid-planner'
  | 'ig-username'
  | 'flexbox-generator'
  | 'json-to-typescript'
  | 'cron-generator'
  | 'palette-extractor'
  | 'jwt-decoder'
  | 'favicon-generator'
  | 'box-shadow-generator'
  | 'curl-converter'
  | 'text-sentiment'
  | 'sitemap-generator'
  | 'business-name-generator'
  | 'invoice-generator'
  | 'expense-tracker'
  | 'salary-calculator'
  | 'work-time-tracker'
  | 'meeting-notes-generator'
  | 'resume-builder'
  | 'profit-roi-calculator'
  | 'ai-essay-writer'
  | 'grammar-checker'
  | 'url-slug-generator'
  | 'csv-json-converter'
  | 'css-gradient-generator'
  | 'mock-data-generator'
  | 'readability-score-calculator'
  | 'unit-converter'
  | 'image-resizer'
  | 'markdown-to-html'
  | 'code-minifier'
  | 'tiktok-hook-generator'
  | 'ai-bio-generator'
  | 'password-security-checker'
  | 'regex-tester-pro'
  | 'pdf-merger-utility'
  | 'open-graph-generator'
  | 'sql-formatter-pro'
  | 'ad-roas-calculator'
  | 'color-contrast-checker'
  | 'ai-prompt-generator'
  // 30 New Tools
  | 'chart-builder'
  | 'sentiment-listening'
  | 'ab-test-calculator'
  | 'wcag-auditor'
  | 'heatmap-simulator'
  | 'ai-meeting-summarizer'
  | 'ai-image-upscaler'
  | 'ai-resume-cover-letter'
  | 'ai-chatbot-embed'
  | 'ai-landing-copy'
  | 'ai-yt-script-generator'
  | 'api-mock-sandbox'
  | 'regex-tester-generator'
  | 'cron-expression-studio'
  | 'sql-query-formatter-ai'
  | 'env-file-generator'
  | 'dockerfile-generator'
  | 'cicd-pipeline-generator'
  | 'uuid-nanoid-generator'
  | 'openapi-swagger-builder'
  | 'headline-subject-tester'
  | 'blog-outline-generator'
  | 'hashtag-analytics-predictor'
  | 'press-release-generator'
  | 'landing-page-heatmap-feedback'
  | 'competitor-ad-spy'
  | 'funnel-pipeline-visualizer'
  | 'email-drip-builder'
  | 'product-hunt-checklist'
  | 'podcast-notes-generator'
  | 'mortgage-loan-calculator'
  | 'travel-itinerary-planner'
  | 'habit-streak-tracker'
  // 7 New Ultra Useful Pro Tools
  | 'meta-tag-analyzer'
  | 'svg-optimizer'
  | 'timestamp-epoch-converter'
  | 'color-palette-generator'
  | 'text-case-diff-cleaner'
  | 'markdown-table-generator'
  | 'key-event-inspector'
  | 'site-structure-visualizer'
  // Social Reels & Video Downloaders Pro (1080p No Watermark)
  | 'insta-reels-downloader'
  | 'yt-reels-downloader'
  | 'fb-reels-downloader'
  | 'universal-reels-downloader'
  // 5 New YouTube Creator Pro Tools
  | 'yt-content-planner'
  | 'yt-hook-generator'
  | 'yt-sponsorship-rate-calculator'
  | 'yt-ab-thumbnail-tester'
  | 'yt-community-post-generator'
  // AI Business Tools (Premium)
  | 'ai-invoice-ocr'
  | 'invoice-po-compare'
  | 'duplicate-invoice-detector'
  | 'bulk-invoice-processor'
  | 'ai-quotation-generator'
  | 'po-generator'
  | 'delivery-challan-generator'
  | 'packing-list-generator'
  | 'ai-receipt-scanner'
  | 'supplier-dashboard'
  | 'payment-reminder-system'
  | 'manufacturing-doc-search'
  | 'ai-doc-chat'
  | 'business-doc-translator'
  | 'contract-summarizer'
  | 'gst-invoice-validator'
  | 'ai-expense-analyzer'
  | 'manufacturing-report-generator'
  | 'inventory-doc-analyzer'
  | 'ai-business-dashboard';

export interface Tool {
  id: ToolId;
  name: string;
  slug: string;
  description: string;
  category: CategoryId;
  icon: string;
  tags: string[];
  isPopular?: boolean;
  isPremium?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export type PageId = 
  | 'home' 
  | 'category-hub'
  | 'about' 
  | 'contact' 
  | 'help' 
  | 'privacy' 
  | 'terms' 
  | 'disclaimer' 
  | 'pricing' 
  | 'dashboard' 
  | 'admin' 
  | 'login'
  | 'signup'
  | 'account'
  | 'payment' 
  | 'payment-success' 
  | 'blog'
  | 'blog-post'
  | 'blog-category'
  | 'blog-tag'
  | ToolId;

export interface BlogFAQ {
  q: string;
  a: string;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export type BlogCategoryName =
  | 'AI Business'
  | 'Invoice OCR'
  | 'PDF Tools'
  | 'GST'
  | 'Manufacturing'
  | 'Productivity'
  | 'Automation'
  | 'Small Business'
  | 'Accounting'
  | 'Technology';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategoryName;
  tags: string[];
  author: BlogAuthor;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  featuredImage: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  status: 'published' | 'draft' | 'scheduled';
  scheduledFor?: string;
  views: number;
  likes: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  faqs?: BlogFAQ[];
  relatedToolIds?: ToolId[];
}

export interface BlogComment {
  id: string;
  postSlug: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source?: string;
}

export type PlanId = 'free' | 'starter' | 'pro' | 'business';

export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected';

export type SubscriptionStatus = 'Active' | 'Pending' | 'Expired' | 'Cancelled' | 'Free';

export interface PlanDetails {
  id: PlanId;
  name: string;
  price: number; // in INR (₹)
  billingPeriod: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  aiLimit: string;
}

export interface PaymentRequest {
  id: string; // Order ID e.g. STH-ORD-123456
  userId: string; // Email or User ID
  userName: string;
  userEmail: string;
  userPhone: string;
  planId: PlanId;
  planName: string;
  amount: number;
  upiTransactionId: string;
  upiIdUsed: string;
  status: PaymentStatus;
  createdAt: string; // ISO date string
  updatedAt: string;
  rejectionReason?: string;
}

export interface UserSubscription {
  userId: string; // Email
  userName?: string;
  userPhone?: string;
  planId: PlanId;
  planName: string;
  startDate: string; // ISO string
  expiryDate: string; // ISO string
  status: SubscriptionStatus;
  amountPaid: number;
  lastOrderId?: string;
  autoRenew?: boolean;
  updatedAt: string;
}

export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingCount: number;
  activeSubscribers: number;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}
