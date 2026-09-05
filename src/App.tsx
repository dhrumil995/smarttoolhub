import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Cpu, Sparkles, Check, ChevronRight, Star, Share2, Zap } from 'lucide-react';

import { PageId, ToolId, Tool } from './types';
import { TOOLS, CATEGORIES } from './data/tools';

import PerformanceMonitorOverlay, { PerformanceProvider } from './components/PerformanceMonitor';

// Layout Structure Elements
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Core Dashboard Pages
import Home, { ToolIcon } from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import LegalPage from './pages/LegalPage';
import CategoryHubPage from './pages/CategoryHubPage';
import BreadcrumbNav from './components/BreadcrumbNav';
import SEOHead from './components/SEOHead';
import ToolSEOContent from './components/ToolSEOContent';
import CookieConsent from './components/CookieConsent';
import ToolSkeleton from './components/ToolSkeleton';
import { ToastContainer } from './components/ToastContainer';
import MobileBottomNav from './components/MobileBottomNav';
import MobileCategorySheet from './components/MobileCategorySheet';
import SocialShareModal from './components/SocialShareModal';

// Subscription Context & Premium Guard
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { NotificationProvider } from './context/NotificationContext';
import { KeyboardShortcutProvider } from './context/KeyboardShortcutContext';
import { KeyboardShortcutHandler } from './components/KeyboardShortcutHandler';
import { PremiumGuard } from './components/PremiumGuard';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AccountPage } from './pages/AccountPage';

// Blog Pages
import { BlogHome } from './pages/BlogHome';
import { BlogPostPage } from './pages/BlogPostPage';
import { BlogCategoryPage } from './pages/BlogCategoryPage';

// Subscription Pages
import { Pricing } from './pages/Pricing';
import { PaymentPage } from './pages/PaymentPage';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { UserDashboard } from './pages/UserDashboard';
import { AdminPanel } from './pages/AdminPanel';


// Interactive Tool Components (Lazily Loaded for Code-Splitting and Skeleton Loading Fallbacks, optimized with React.memo)
const lazyMemo = <P extends object>(
  factory: () => Promise<{ default: React.ComponentType<P> }>
) => React.memo(React.lazy(async () => {
  try {
    return await factory();
  } catch (error) {
    // If dynamic chunk fetch fails after Chrome tab hibernation or dev server restart, reload page automatically
    const reloaded = sessionStorage.getItem('chunk_retry_reload');
    if (!reloaded) {
      sessionStorage.setItem('chunk_retry_reload', 'true');
      window.location.reload();
    }
    throw error;
  }
}));

const JSONFormatter = lazyMemo(() => import('./components/tools/JSONFormatter'));
const Base64Tool = lazyMemo(() => import('./components/tools/Base64Tool'));
const QRGenerator = lazyMemo(() => import('./components/tools/QRGenerator'));
const CaseConverter = lazyMemo(() => import('./components/tools/CaseConverter'));
const LoremIpsum = lazyMemo(() => import('./components/tools/LoremIpsum'));
const MarkdownEditor = lazyMemo(() => import('./components/tools/MarkdownEditor'));
const ColorConverter = lazyMemo(() => import('./components/tools/ColorConverter'));
const PasswordGenerator = lazyMemo(() => import('./components/tools/PasswordGenerator'));
const YTTagsGenerator = lazyMemo(() => import('./components/tools/YTTagsGenerator'));
const YTThumbnailDownloader = lazyMemo(() => import('./components/tools/YTThumbnailDownloader'));
const YTEarningCalculator = lazyMemo(() => import('./components/tools/YTEarningCalculator'));
const YTTitleGenerator = lazyMemo(() => import('./components/tools/YTTitleGenerator'));
const YTEmbedGenerator = lazyMemo(() => import('./components/tools/YTEmbedGenerator'));
const YTChannelAuditor = lazyMemo(() => import('./components/tools/YTChannelAuditor'));
const YTDescriptionGenerator = lazyMemo(() => import('./components/tools/YTDescriptionGenerator'));
const SEOKeywordAnalyzer = lazyMemo(() => import('./components/tools/SEOKeywordAnalyzer'));
const SEOSchemaGenerator = lazyMemo(() => import('./components/tools/SEOSchemaGenerator'));
const SEOMetaAuditor = lazyMemo(() => import('./components/tools/SEOMetaAuditor'));
const AICodeTool = lazyMemo(() => import('./components/tools/AICodeExplainer'));
const AIRegexTool = lazyMemo(() => import('./components/tools/AIRegexSQLGenerator'));
const AIWriterTool = lazyMemo(() => import('./components/tools/AITechnicalWriter'));

// Newly Added Tools
const AIHumanizer = lazyMemo(() => import('./components/tools/AIHumanizer'));
const AIDetector = lazyMemo(() => import('./components/tools/AIDetector'));
const PlagiarismChecker = lazyMemo(() => import('./components/tools/PlagiarismChecker'));
const ImageCompressor = lazyMemo(() => import('./components/tools/ImageCompressor'));
const PDFToWord = lazyMemo(() => import('./components/tools/PDFToWord'));
const WordToPDF = lazyMemo(() => import('./components/tools/WordToPDF'));
const BackgroundRemover = lazyMemo(() => import('./components/tools/BackgroundRemover'));
const ImageToTextOCR = lazyMemo(() => import('./components/tools/ImageToTextOCR'));
const YTTranscriptGenerator = lazyMemo(() => import('./components/tools/YTTranscriptGenerator'));
const YTTimestampChapter = lazyMemo(() => import('./components/tools/YTTimestampChapter'));
const YTTagExtractor = lazyMemo(() => import('./components/tools/YTTagExtractor'));
const KeywordResearch = lazyMemo(() => import('./components/tools/KeywordResearch'));
const MetaTitleGenerator = lazyMemo(() => import('./components/tools/MetaTitleGenerator'));
const GoogleSearchConsoleTool = lazyMemo(() => import('./components/tools/GoogleSearchConsoleTool'));
const AdSenseChecker = lazyMemo(() => import('./components/tools/AdSenseChecker'));
const RobotsGenerator = lazyMemo(() => import('./components/tools/RobotsGenerator'));

// 10 Most Viral & High-Demand Tools
const HashGenerator = lazyMemo(() => import('./components/tools/HashGenerator'));
const URLEncoder = lazyMemo(() => import('./components/tools/URLEncoder'));
const HTMLEntities = lazyMemo(() => import('./components/tools/HTMLEntities'));
const GlassmorphismGenerator = lazyMemo(() => import('./components/tools/GlassmorphismGenerator'));
const JSONConverter = lazyMemo(() => import('./components/tools/JSONConverter'));
const DiffChecker = lazyMemo(() => import('./components/tools/DiffChecker'));
const SVGConverter = lazyMemo(() => import('./components/tools/SVGConverter'));
const WordCounter = lazyMemo(() => import('./components/tools/WordCounter'));
const SQLFormatter = lazyMemo(() => import('./components/tools/SQLFormatter'));
const UTMBuilder = lazyMemo(() => import('./components/tools/UTMBuilder'));
const SitelinksGenerator = lazyMemo(() => import('./components/tools/SitelinksGenerator'));

// Instagram Growth Tools
const IGHashtagGenerator = lazyMemo(() => import('./components/tools/IGHashtagGenerator'));
const IGCaptionGenerator = lazyMemo(() => import('./components/tools/IGCaptionGenerator'));
const IGBioGenerator = lazyMemo(() => import('./components/tools/IGBioGenerator'));
const IGPhotoResizer = lazyMemo(() => import('./components/tools/IGPhotoResizer'));
const IGGridPlanner = lazyMemo(() => import('./components/tools/IGGridPlanner'));
const IGUsernameGenerator = lazyMemo(() => import('./components/tools/IGUsernameGenerator'));

// 10 New Demanded & User Needed Tools
const FlexboxGenerator = lazyMemo(() => import('./components/tools/FlexboxGenerator').then(m => ({ default: m.FlexboxGenerator })));
const JSONToTypeScript = lazyMemo(() => import('./components/tools/JSONToTypeScript').then(m => ({ default: m.JSONToTypeScript })));
const CronGenerator = lazyMemo(() => import('./components/tools/CronGenerator').then(m => ({ default: m.CronGenerator })));
const PaletteExtractor = lazyMemo(() => import('./components/tools/PaletteExtractor').then(m => ({ default: m.PaletteExtractor })));
const JWTDecoder = lazyMemo(() => import('./components/tools/JWTDecoder').then(m => ({ default: m.JWTDecoder })));
const FaviconGenerator = lazyMemo(() => import('./components/tools/FaviconGenerator').then(m => ({ default: m.FaviconGenerator })));
const BoxShadowGenerator = lazyMemo(() => import('./components/tools/BoxShadowGenerator').then(m => ({ default: m.BoxShadowGenerator })));
const CurlConverter = lazyMemo(() => import('./components/tools/CurlConverter').then(m => ({ default: m.CurlConverter })));
const TextSentiment = lazyMemo(() => import('./components/tools/TextSentiment').then(m => ({ default: m.TextSentiment })));
const SitemapGenerator = lazyMemo(() => import('./components/tools/SitemapGenerator').then(m => ({ default: m.SitemapGenerator })));

// 8 Business & Productivity Tools
const BusinessNameGenerator = lazyMemo(() => import('./components/tools/BusinessNameGenerator'));
const InvoiceGenerator = lazyMemo(() => import('./components/tools/InvoiceGenerator'));
const ExpenseTracker = lazyMemo(() => import('./components/tools/ExpenseTracker'));
const SalaryCalculator = lazyMemo(() => import('./components/tools/SalaryCalculator'));
const WorkTimeTracker = lazyMemo(() => import('./components/tools/WorkTimeTracker'));
const MeetingNotesGenerator = lazyMemo(() => import('./components/tools/MeetingNotesGenerator'));
const ResumeBuilder = lazyMemo(() => import('./components/tools/ResumeBuilder'));
const ProfitROICalculator = lazyMemo(() => import('./components/tools/ProfitROICalculator'));

// 11 High SEO Searchable Tools
const AIEssayWriter = lazyMemo(() => import('./components/tools/AIEssayWriter'));
const GrammarChecker = lazyMemo(() => import('./components/tools/GrammarChecker'));
const URLSlugGenerator = lazyMemo(() => import('./components/tools/URLSlugGenerator'));
const CSVJSONConverter = lazyMemo(() => import('./components/tools/CSVJSONConverter'));
const CSSGradientGenerator = lazyMemo(() => import('./components/tools/CSSGradientGenerator'));
const MockDataGenerator = lazyMemo(() => import('./components/tools/MockDataGenerator'));
const ReadabilityCalculator = lazyMemo(() => import('./components/tools/ReadabilityCalculator'));
const UnitConverter = lazyMemo(() => import('./components/tools/UnitConverter'));
const ImageResizer = lazyMemo(() => import('./components/tools/ImageResizer'));
const MarkdownToHTML = lazyMemo(() => import('./components/tools/MarkdownToHTML'));
const CodeMinifier = lazyMemo(() => import('./components/tools/CodeMinifier'));

// 10 Viral & In-Demand Tools
const TikTokHookGenerator = lazyMemo(() => import('./components/tools/TikTokHookGenerator'));
const AIBioGenerator = lazyMemo(() => import('./components/tools/AIBioGenerator'));
const PasswordSecurityChecker = lazyMemo(() => import('./components/tools/PasswordSecurityChecker'));
const RegexTesterPro = lazyMemo(() => import('./components/tools/RegexTesterPro'));
const PDFMergerUtility = lazyMemo(() => import('./components/tools/PDFMergerUtility'));
const OpenGraphGenerator = lazyMemo(() => import('./components/tools/OpenGraphGenerator'));
const SQLFormatterPro = lazyMemo(() => import('./components/tools/SQLFormatterPro'));
const AdROASCalculator = lazyMemo(() => import('./components/tools/AdROASCalculator'));
const ColorContrastChecker = lazyMemo(() => import('./components/tools/ColorContrastChecker'));
const AIPromptGenerator = lazyMemo(() => import('./components/tools/AIPromptGenerator'));

// 20 AI Business Tools (Premium)
const AIInvoiceOCRPro = lazyMemo(() => import('./components/tools/business/AIInvoiceOCRPro'));
const InvoicePOCompare = lazyMemo(() => import('./components/tools/business/InvoicePOCompare'));
const DuplicateInvoiceDetector = lazyMemo(() => import('./components/tools/business/DuplicateInvoiceDetector'));
const BulkInvoiceProcessor = lazyMemo(() => import('./components/tools/business/BulkInvoiceProcessor'));
const AIQuotationGenerator = lazyMemo(() => import('./components/tools/business/AIQuotationGenerator'));
const POGenerator = lazyMemo(() => import('./components/tools/business/POGenerator'));
const DeliveryChallanGenerator = lazyMemo(() => import('./components/tools/business/DeliveryChallanGenerator'));
const PackingListGenerator = lazyMemo(() => import('./components/tools/business/PackingListGenerator'));
const AIReceiptScannerPro = lazyMemo(() => import('./components/tools/business/AIReceiptScannerPro'));
const SupplierDashboard = lazyMemo(() => import('./components/tools/business/SupplierDashboard'));
const PaymentReminderSystem = lazyMemo(() => import('./components/tools/business/PaymentReminderSystem'));
const ManufacturingDocSearch = lazyMemo(() => import('./components/tools/business/ManufacturingDocSearch'));
const AIDocumentChat = lazyMemo(() => import('./components/tools/business/AIDocumentChat'));
const BusinessDocTranslator = lazyMemo(() => import('./components/tools/business/BusinessDocTranslator'));
const ContractSummarizer = lazyMemo(() => import('./components/tools/business/ContractSummarizer'));
const GSTInvoiceValidator = lazyMemo(() => import('./components/tools/business/GSTInvoiceValidator'));
const AIExpenseAnalyzer = lazyMemo(() => import('./components/tools/business/AIExpenseAnalyzer'));
const ManufacturingReportGenerator = lazyMemo(() => import('./components/tools/business/ManufacturingReportGenerator'));
const InventoryDocAnalyzer = lazyMemo(() => import('./components/tools/business/InventoryDocAnalyzer'));
const AIBusinessDashboard = lazyMemo(() => import('./components/tools/business/AIBusinessDashboard'));

// 33 New SmartToolHub Tools
const ChartBuilder = lazyMemo(() => import('./components/tools/new/ChartBuilder').then((m: any) => ({ default: m.ChartBuilder || m.default })));
const SentimentListening = lazyMemo(() => import('./components/tools/new/SentimentListening').then((m: any) => ({ default: m.SentimentListening || m.default })));
const ABTestCalculator = lazyMemo(() => import('./components/tools/new/ABTestCalculator').then((m: any) => ({ default: m.ABTestCalculator || m.default })));
const WCAGAuditor = lazyMemo(() => import('./components/tools/new/WCAGAuditor').then((m: any) => ({ default: m.WCAGAuditor || m.default })));
const HeatmapSimulator = lazyMemo(() => import('./components/tools/new/HeatmapSimulator').then((m: any) => ({ default: m.HeatmapSimulator || m.default })));
const AIMeetingSummarizer = lazyMemo(() => import('./components/tools/new/AIMeetingSummarizer').then((m: any) => ({ default: m.AIMeetingSummarizer || m.default })));
const AIImageUpscaler = lazyMemo(() => import('./components/tools/new/AIImageUpscaler').then((m: any) => ({ default: m.AIImageUpscaler || m.default })));
const AIResumeCoverLetter = lazyMemo(() => import('./components/tools/new/AIResumeCoverLetter').then((m: any) => ({ default: m.AIResumeCoverLetter || m.default })));
const AIChatbotEmbed = lazyMemo(() => import('./components/tools/new/AIChatbotEmbed').then((m: any) => ({ default: m.AIChatbotEmbed || m.default })));
const AILandingCopy = lazyMemo(() => import('./components/tools/new/AILandingCopy').then((m: any) => ({ default: m.AILandingCopy || m.default })));
const AIYTScriptGenerator = lazyMemo(() => import('./components/tools/new/AIYTScriptGenerator').then((m: any) => ({ default: m.AIYTScriptGenerator || m.default })));
const APIMockSandbox = lazyMemo(() => import('./components/tools/new/APIMockSandbox').then((m: any) => ({ default: m.APIMockSandbox || m.default })));
const RegexTesterGenerator = lazyMemo(() => import('./components/tools/new/RegexTesterGenerator').then((m: any) => ({ default: m.RegexTesterGenerator || m.default })));
const CronExpressionStudio = lazyMemo(() => import('./components/tools/new/CronExpressionStudio').then((m: any) => ({ default: m.CronExpressionStudio || m.default })));
const SQLQueryFormatterAI = lazyMemo(() => import('./components/tools/new/SQLQueryFormatterAI').then((m: any) => ({ default: m.SQLQueryFormatterAI || m.default })));
const EnvFileGenerator = lazyMemo(() => import('./components/tools/new/EnvFileGenerator').then((m: any) => ({ default: m.EnvFileGenerator || m.default })));
const DockerfileGenerator = lazyMemo(() => import('./components/tools/new/DockerfileGenerator').then((m: any) => ({ default: m.DockerfileGenerator || m.default })));
const CICDPipelineGenerator = lazyMemo(() => import('./components/tools/new/CICDPipelineGenerator').then((m: any) => ({ default: m.CICDPipelineGenerator || m.default })));
const UUIDNanoIDGenerator = lazyMemo(() => import('./components/tools/new/UUIDNanoIDGenerator').then((m: any) => ({ default: m.UUIDNanoIDGenerator || m.default })));
const OpenAPISwaggerBuilder = lazyMemo(() => import('./components/tools/new/OpenAPISwaggerBuilder').then((m: any) => ({ default: m.OpenAPISwaggerBuilder || m.default })));
const HeadlineSubjectTester = lazyMemo(() => import('./components/tools/new/HeadlineSubjectTester').then((m: any) => ({ default: m.HeadlineSubjectTester || m.default })));
const BlogOutlineGenerator = lazyMemo(() => import('./components/tools/new/BlogOutlineGenerator').then((m: any) => ({ default: m.BlogOutlineGenerator || m.default })));
const HashtagAnalyticsPredictor = lazyMemo(() => import('./components/tools/new/HashtagAnalyticsPredictor').then((m: any) => ({ default: m.HashtagAnalyticsPredictor || m.default })));
const PressReleaseGenerator = lazyMemo(() => import('./components/tools/new/PressReleaseGenerator').then((m: any) => ({ default: m.PressReleaseGenerator || m.default })));
const PodcastNotesGenerator = lazyMemo(() => import('./components/tools/new/PodcastNotesGenerator').then((m: any) => ({ default: m.PodcastNotesGenerator || m.default })));
const LandingPageHeatmapFeedback = lazyMemo(() => import('./components/tools/new/LandingPageHeatmapFeedback').then((m: any) => ({ default: m.LandingPageHeatmapFeedback || m.default })));
const CompetitorAdSpy = lazyMemo(() => import('./components/tools/new/CompetitorAdSpy').then((m: any) => ({ default: m.CompetitorAdSpy || m.default })));
const FunnelPipelineVisualizer = lazyMemo(() => import('./components/tools/new/FunnelPipelineVisualizer').then((m: any) => ({ default: m.FunnelPipelineVisualizer || m.default })));
const EmailDripBuilder = lazyMemo(() => import('./components/tools/new/EmailDripBuilder').then((m: any) => ({ default: m.EmailDripBuilder || m.default })));
const ProductHuntChecklist = lazyMemo(() => import('./components/tools/new/ProductHuntChecklist').then((m: any) => ({ default: m.ProductHuntChecklist || m.default })));
const MortgageLoanCalculator = lazyMemo(() => import('./components/tools/new/MortgageLoanCalculator').then((m: any) => ({ default: m.MortgageLoanCalculator || m.default })));
const TravelItineraryPlanner = lazyMemo(() => import('./components/tools/new/TravelItineraryPlanner').then((m: any) => ({ default: m.TravelItineraryPlanner || m.default })));
const HabitStreakTracker = lazyMemo(() => import('./components/tools/new/HabitStreakTracker').then((m: any) => ({ default: m.HabitStreakTracker || m.default })));
// 7 New Ultra Useful Pro Tools
const MetaTagAnalyzer = lazyMemo(() => import('./components/tools/new/MetaTagAnalyzer').then((m: any) => ({ default: m.MetaTagAnalyzer || m.default })));
const SVGOptimizer = lazyMemo(() => import('./components/tools/new/SVGOptimizer').then((m: any) => ({ default: m.SVGOptimizer || m.default })));
const TimestampEpochConverter = lazyMemo(() => import('./components/tools/new/TimestampEpochConverter').then((m: any) => ({ default: m.TimestampEpochConverter || m.default })));
const ColorPaletteGenerator = lazyMemo(() => import('./components/tools/new/ColorPaletteGenerator').then((m: any) => ({ default: m.ColorPaletteGenerator || m.default })));
const TextCaseDiffCleaner = lazyMemo(() => import('./components/tools/new/TextCaseDiffCleaner').then((m: any) => ({ default: m.TextCaseDiffCleaner || m.default })));
const MarkdownTableGenerator = lazyMemo(() => import('./components/tools/new/MarkdownTableGenerator').then((m: any) => ({ default: m.MarkdownTableGenerator || m.default })));
const KeyEventInspector = lazyMemo(() => import('./components/tools/new/KeyEventInspector').then((m: any) => ({ default: m.KeyEventInspector || m.default })));
const SiteStructureVisualizer = lazyMemo<{ onSelectTool?: (toolId: PageId) => void }>(() => import('./components/tools/new/SiteStructureVisualizer').then((m: any) => ({ default: m.SiteStructureVisualizer || m.default })));
// Social Reels & Video Downloaders Pro (1080p No Watermark)
const InstagramReelsDownloader = lazyMemo(() => import('./components/tools/new/InstagramReelsDownloader').then((m: any) => ({ default: m.InstagramReelsDownloader || m.default })));
const YouTubeReelsDownloader = lazyMemo(() => import('./components/tools/new/YouTubeReelsDownloader').then((m: any) => ({ default: m.YouTubeReelsDownloader || m.default })));
const FacebookReelsDownloader = lazyMemo(() => import('./components/tools/new/FacebookReelsDownloader').then((m: any) => ({ default: m.FacebookReelsDownloader || m.default })));
const UniversalReelsDownloader = lazyMemo(() => import('./components/tools/new/UniversalReelsDownloader').then((m: any) => ({ default: m.UniversalReelsDownloader || m.default })));

// 5 New YouTube Creator Pro Tools
const YTContentPlanner = lazyMemo(() => import('./components/tools/YTContentPlanner'));
const YTHookGenerator = lazyMemo(() => import('./components/tools/YTHookGenerator'));
const YTSponsorshipCalculator = lazyMemo(() => import('./components/tools/YTSponsorshipCalculator'));
const YTABThumbnailTester = lazyMemo(() => import('./components/tools/YTABThumbnailTester'));
const YTCommunityPostGenerator = lazyMemo(() => import('./components/tools/YTCommunityPostGenerator'));

// Memoized Active Tool Switcher Component to prevent re-renders when parent App state updates
const ActiveToolRenderer = React.memo(function ActiveToolRenderer({ toolId, onSelectTool }: { toolId: ToolId; onSelectTool?: (toolId: PageId) => void }) {
  switch (toolId) {
    case 'json-formatter':
      return <JSONFormatter />;
    case 'base64':
      return <Base64Tool />;
    case 'qr-generator':
      return <QRGenerator />;
    case 'case-converter':
      return <CaseConverter />;
    case 'lorem-ipsum':
      return <LoremIpsum />;
    case 'markdown-preview':
      return <MarkdownEditor />;
    case 'color-converter':
      return <ColorConverter />;
    case 'password-gen':
      return <PasswordGenerator />;
    case 'yt-tags':
      return <YTTagsGenerator />;
    case 'yt-thumbnail':
      return <YTThumbnailDownloader />;
    case 'yt-earning':
      return <YTEarningCalculator />;
    case 'yt-title':
      return <YTTitleGenerator />;
    case 'yt-embed':
      return <YTEmbedGenerator />;
    case 'yt-channel':
      return <YTChannelAuditor />;
    case 'yt-desc':
      return <YTDescriptionGenerator />;
    case 'seo-keyword':
      return <SEOKeywordAnalyzer />;
    case 'seo-schema':
      return <SEOSchemaGenerator />;
    case 'seo-auditor':
      return <SEOMetaAuditor />;
    case 'ai-code':
      return <AICodeTool />;
    case 'ai-regex':
      return <AIRegexTool />;
    case 'ai-writer':
      return <AIWriterTool />;
    case 'ai-humanizer':
      return <AIHumanizer />;
    case 'ai-detector':
      return <AIDetector />;
    case 'plagiarism-checker':
      return <PlagiarismChecker />;
    case 'image-compressor':
      return <ImageCompressor />;
    case 'pdf-to-word':
      return <PDFToWord />;
    case 'word-to-pdf':
      return <WordToPDF />;
    case 'bg-remover':
      return <BackgroundRemover />;
    case 'image-to-text':
      return <ImageToTextOCR />;
    case 'yt-transcript':
      return <YTTranscriptGenerator />;
    case 'yt-timestamp':
      return <YTTimestampChapter />;
    case 'yt-tag-extractor':
      return <YTTagExtractor />;
    case 'keyword-research':
      return <KeywordResearch />;
    case 'meta-title':
      return <MetaTitleGenerator />;
    case 'google-search-console':
      return <GoogleSearchConsoleTool />;
    case 'adsense-checker':
      return <AdSenseChecker />;
    case 'robots-generator':
      return <RobotsGenerator />;
    case 'hash-generator':
      return <HashGenerator />;
    case 'url-encoder':
      return <URLEncoder />;
    case 'html-entities':
      return <HTMLEntities />;
    case 'glassmorphism':
      return <GlassmorphismGenerator />;
    case 'json-converter':
      return <JSONConverter />;
    case 'diff-checker':
      return <DiffChecker />;
    case 'svg-converter':
      return <SVGConverter />;
    case 'word-counter':
      return <WordCounter />;
    case 'sql-formatter':
      return <SQLFormatter />;
    case 'utm-builder':
      return <UTMBuilder />;
    case 'sitelinks-generator':
      return <SitelinksGenerator />;
    case 'ig-hashtag':
      return <IGHashtagGenerator />;
    case 'ig-caption':
      return <IGCaptionGenerator />;
    case 'ig-bio':
      return <IGBioGenerator />;
    case 'ig-photo-resizer':
      return <IGPhotoResizer />;
    case 'ig-grid-planner':
      return <IGGridPlanner />;
    case 'ig-username':
      return <IGUsernameGenerator />;
    case 'flexbox-generator':
      return <FlexboxGenerator />;
    case 'json-to-typescript':
      return <JSONToTypeScript />;
    case 'cron-generator':
      return <CronGenerator />;
    case 'palette-extractor':
      return <PaletteExtractor />;
    case 'jwt-decoder':
      return <JWTDecoder />;
    case 'favicon-generator':
      return <FaviconGenerator />;
    case 'box-shadow-generator':
      return <BoxShadowGenerator />;
    case 'curl-converter':
      return <CurlConverter />;
    case 'text-sentiment':
      return <TextSentiment />;
    case 'sitemap-generator':
      return <SitemapGenerator />;
    case 'business-name-generator':
      return <BusinessNameGenerator />;
    case 'invoice-generator':
      return <InvoiceGenerator />;
    case 'expense-tracker':
      return <ExpenseTracker />;
    case 'salary-calculator':
      return <SalaryCalculator />;
    case 'work-time-tracker':
      return <WorkTimeTracker />;
    case 'meeting-notes-generator':
      return <MeetingNotesGenerator />;
    case 'resume-builder':
      return <ResumeBuilder />;
    case 'profit-roi-calculator':
      return <ProfitROICalculator />;
    case 'ai-essay-writer':
      return <AIEssayWriter />;
    case 'grammar-checker':
      return <GrammarChecker />;
    case 'url-slug-generator':
      return <URLSlugGenerator />;
    case 'csv-json-converter':
      return <CSVJSONConverter />;
    case 'css-gradient-generator':
      return <CSSGradientGenerator />;
    case 'mock-data-generator':
      return <MockDataGenerator />;
    case 'readability-score-calculator':
      return <ReadabilityCalculator />;
    case 'unit-converter':
      return <UnitConverter />;
    case 'image-resizer':
      return <ImageResizer />;
    case 'markdown-to-html':
      return <MarkdownToHTML />;
    case 'code-minifier':
      return <CodeMinifier />;
    case 'tiktok-hook-generator':
      return <TikTokHookGenerator />;
    case 'ai-bio-generator':
      return <AIBioGenerator />;
    case 'password-security-checker':
      return <PasswordSecurityChecker />;
    case 'regex-tester-pro':
      return <RegexTesterPro />;
    case 'pdf-merger-utility':
      return <PDFMergerUtility />;
    case 'open-graph-generator':
      return <OpenGraphGenerator />;
    case 'sql-formatter-pro':
      return <SQLFormatterPro />;
    case 'ad-roas-calculator':
      return <AdROASCalculator />;
    case 'color-contrast-checker':
      return <ColorContrastChecker />;
    case 'ai-prompt-generator':
      return <AIPromptGenerator />;

    // AI Business Tools (Premium)
    case 'ai-invoice-ocr':
      return <AIInvoiceOCRPro />;
    case 'invoice-po-compare':
      return <InvoicePOCompare />;
    case 'duplicate-invoice-detector':
      return <DuplicateInvoiceDetector />;
    case 'bulk-invoice-processor':
      return <BulkInvoiceProcessor />;
    case 'ai-quotation-generator':
      return <AIQuotationGenerator />;
    case 'po-generator':
      return <POGenerator />;
    case 'delivery-challan-generator':
      return <DeliveryChallanGenerator />;
    case 'packing-list-generator':
      return <PackingListGenerator />;
    case 'ai-receipt-scanner':
      return <AIReceiptScannerPro />;
    case 'supplier-dashboard':
      return <SupplierDashboard />;
    case 'payment-reminder-system':
      return <PaymentReminderSystem />;
    case 'manufacturing-doc-search':
      return <ManufacturingDocSearch />;
    case 'ai-doc-chat':
      return <AIDocumentChat />;
    case 'business-doc-translator':
      return <BusinessDocTranslator />;
    case 'contract-summarizer':
      return <ContractSummarizer />;
    case 'gst-invoice-validator':
      return <GSTInvoiceValidator />;
    case 'ai-expense-analyzer':
      return <AIExpenseAnalyzer />;
    case 'manufacturing-report-generator':
      return <ManufacturingReportGenerator />;
    case 'inventory-doc-analyzer':
      return <InventoryDocAnalyzer />;
    case 'ai-business-dashboard':
      return <AIBusinessDashboard onSelectTool={onSelectTool} />;

    // 33 New SmartToolHub Tools
    case 'chart-builder':
      return <ChartBuilder />;
    case 'sentiment-listening':
      return <SentimentListening />;
    case 'ab-test-calculator':
      return <ABTestCalculator />;
    case 'wcag-auditor':
      return <WCAGAuditor />;
    case 'heatmap-simulator':
      return <HeatmapSimulator />;
    case 'ai-meeting-summarizer':
      return <AIMeetingSummarizer />;
    case 'ai-image-upscaler':
      return <AIImageUpscaler />;
    case 'ai-resume-cover-letter':
      return <AIResumeCoverLetter />;
    case 'ai-chatbot-embed':
      return <AIChatbotEmbed />;
    case 'ai-landing-copy':
      return <AILandingCopy />;
    case 'ai-yt-script-generator':
      return <AIYTScriptGenerator />;
    case 'api-mock-sandbox':
      return <APIMockSandbox />;
    case 'regex-tester-generator':
      return <RegexTesterGenerator />;
    case 'cron-expression-studio':
      return <CronExpressionStudio />;
    case 'sql-query-formatter-ai':
      return <SQLQueryFormatterAI />;
    case 'env-file-generator':
      return <EnvFileGenerator />;
    case 'dockerfile-generator':
      return <DockerfileGenerator />;
    case 'cicd-pipeline-generator':
      return <CICDPipelineGenerator />;
    case 'uuid-nanoid-generator':
      return <UUIDNanoIDGenerator />;
    case 'openapi-swagger-builder':
      return <OpenAPISwaggerBuilder />;
    case 'headline-subject-tester':
      return <HeadlineSubjectTester />;
    case 'blog-outline-generator':
      return <BlogOutlineGenerator />;
    case 'hashtag-analytics-predictor':
      return <HashtagAnalyticsPredictor />;
    case 'press-release-generator':
      return <PressReleaseGenerator />;
    case 'podcast-notes-generator':
      return <PodcastNotesGenerator />;
    case 'landing-page-heatmap-feedback':
      return <LandingPageHeatmapFeedback />;
    case 'competitor-ad-spy':
      return <CompetitorAdSpy />;
    case 'funnel-pipeline-visualizer':
      return <FunnelPipelineVisualizer />;
    case 'email-drip-builder':
      return <EmailDripBuilder />;
    case 'product-hunt-checklist':
      return <ProductHuntChecklist />;
    case 'mortgage-loan-calculator':
      return <MortgageLoanCalculator />;
    case 'travel-itinerary-planner':
      return <TravelItineraryPlanner />;
    case 'habit-streak-tracker':
      return <HabitStreakTracker />;
    case 'meta-tag-analyzer':
      return <MetaTagAnalyzer />;
    case 'svg-optimizer':
      return <SVGOptimizer />;
    case 'timestamp-epoch-converter':
      return <TimestampEpochConverter />;
    case 'color-palette-generator':
      return <ColorPaletteGenerator />;
    case 'text-case-diff-cleaner':
      return <TextCaseDiffCleaner />;
    case 'markdown-table-generator':
      return <MarkdownTableGenerator />;
    case 'key-event-inspector':
      return <KeyEventInspector />;
    case 'site-structure-visualizer':
      return <SiteStructureVisualizer onSelectTool={onSelectTool} />;
    case 'insta-reels-downloader':
      return <InstagramReelsDownloader />;
    case 'yt-reels-downloader':
      return <YouTubeReelsDownloader />;
    case 'fb-reels-downloader':
      return <FacebookReelsDownloader />;
    case 'universal-reels-downloader':
      return <UniversalReelsDownloader />;
    case 'yt-content-planner':
      return <YTContentPlanner />;
    case 'yt-hook-generator':
      return <YTHookGenerator />;
    case 'yt-sponsorship-rate-calculator':
      return <YTSponsorshipCalculator />;
    case 'yt-ab-thumbnail-tester':
      return <YTABThumbnailTester />;
    case 'yt-community-post-generator':
      return <YTCommunityPostGenerator />;
    default:
      return (
        <div className="text-center py-12">
          <p className="text-red-500 font-semibold">Active tool handler could not be loaded.</p>
        </div>
      );
  }
});

const getInitialPage = (): { page: PageId; blogSlug?: string; blogCat?: string; blogTag?: string; categoryId?: string } => {
  if (typeof window === 'undefined') return { page: 'home' };
  const pathname = window.location.pathname.replace(/^\//, '').split('?')[0];
  const hash = window.location.hash.split('?')[0].replace('#/', '').replace('#', '');
  const path = pathname || hash;

  if (path) {
    if (path.startsWith('category/')) {
      return { page: 'category-hub' as PageId, categoryId: path.replace('category/', '') };
    }
    if (path === 'blog') return { page: 'blog' };
    if (path.startsWith('blog/category/')) {
      return { page: 'blog-category', blogCat: path.replace('blog/category/', '') };
    }
    if (path.startsWith('blog/tag/')) {
      return { page: 'blog-tag', blogTag: path.replace('blog/tag/', '') };
    }
    if (path.startsWith('blog/')) {
      return { page: 'blog-post', blogSlug: path.replace('blog/', '') };
    }

    const isValidTool = TOOLS.some((t) => t.id === path);
    const isValidPage = ['home', 'pricing', 'payment', 'payment-success', 'dashboard', 'admin', 'login', 'signup', 'account', 'about', 'contact', 'help', 'privacy', 'terms', 'disclaimer'].includes(path);
    if (isValidTool || isValidPage) {
      return { page: path as PageId };
    }
  }
  return { page: 'home' };
};

export default function App() {
  const initialData = getInitialPage();
  const [currentPage, setCurrentPage] = useState<PageId>(initialData.page);
  const [blogSlug, setBlogSlug] = useState<string>(initialData.blogSlug || '');
  const [blogCat, setBlogCat] = useState<string>(initialData.blogCat || '');
  const [blogTag, setBlogTag] = useState<string>(initialData.blogTag || '');
  const [categoryId, setCategoryId] = useState<string>(initialData.categoryId || 'dev');
  const [shareCopied, setShareCopied] = useState(false);

  const navigateToArticle = (slug: string) => {
    setBlogSlug(slug);
    setCurrentPage('blog-post');
    window.history.pushState(null, '', `/blog/${slug}`);
  };

  const navigateToCategory = (cat: string) => {
    setBlogCat(cat);
    setCurrentPage('blog-category');
    window.history.pushState(null, '', `/blog/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
  };

  const navigateToTag = (tag: string) => {
    setBlogTag(tag);
    setCurrentPage('blog-tag');
    window.history.pushState(null, '', `/blog/tag/${tag.toLowerCase()}`);
  };


  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeShareTool, setActiveShareTool] = useState<Tool | null>(null);

  const handleShareTool = (toolId: string) => {
    const targetTool = TOOLS.find((t) => t.id === toolId) || null;
    setActiveShareTool(targetTool);
    setShareModalOpen(true);
    const url = window.location.origin + '/' + toolId;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }).catch(() => {
      // Fallback
    });
  };
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttoolhub_favorites') || localStorage.getItem('toolhub_favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleFavoriteApp = (toolId: string) => {
    let updated: string[];
    if (favorites.includes(toolId)) {
      updated = favorites.filter((id) => id !== toolId);
    } else {
      updated = [...favorites, toolId];
    }
    setFavorites(updated);
    localStorage.setItem('smarttoolhub_favorites', JSON.stringify(updated));
  };
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check local storage or match user media settings
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [selectedMobileCategory, setSelectedMobileCategory] = useState('all');

  // Synchronize state with URL pathnames (and hash fallbacks) for search-engine indexing and deep linking
  useEffect(() => {
    const handleLocationChange = () => {
      const initial = getInitialPage();
      setCurrentPage(initial.page);
      if (initial.blogSlug) setBlogSlug(initial.blogSlug);
      if (initial.blogCat) setBlogCat(initial.blogCat);
      if (initial.blogTag) setBlogTag(initial.blogTag);
      if (initial.categoryId) setCategoryId(initial.categoryId);
    };

    // Listen to back/forward button navigation clicks
    window.addEventListener('popstate', handleLocationChange);
    // Backward-compatibility: Listen to hash changes
    window.addEventListener('hashchange', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Update URL path when state changes (pushState)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname.replace(/^\//, '').split('?')[0];
    const hash = window.location.hash.split('?')[0].replace('#/', '').replace('#', '');
    const activeSegment = pathname || hash;

    if (currentPage === 'home') {
      if (activeSegment && activeSegment !== 'home') {
        // Navigate home cleanly using HTML5 History pushState
        window.history.pushState(null, '', '/' + window.location.search);
      }
    } else if (activeSegment !== currentPage) {
      // Update browser URL cleanly to /tool-id without full reload
      window.history.pushState(null, '', '/' + currentPage + window.location.search);
    }
  }, [currentPage]);

  // Dynamic SPA Pageview tracking for Google Analytics 4 & Plausible
  // This correctly reports engagement duration and page navigation, lowering perceived bounce rates and fixing the '7s average engagement time' error.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeToolObj = TOOLS.find((t) => t.id === currentPage);
      const pageTitle = activeToolObj 
        ? `${activeToolObj.name} | SmartToolHub` 
        : `${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} | SmartToolHub - Free Developer Tools`;

      const cleanPath = `/${currentPage === 'home' ? '' : currentPage}`;

      // 1. Google Analytics 4 Virtual Pageview Event
      if ((window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_title: pageTitle,
          page_location: window.location.origin + cleanPath,
          page_path: cleanPath
        });
      }

      // 2. Plausible Virtual Pageview Event
      if ((window as any).plausible) {
        (window as any).plausible('pageview', {
          url: window.location.origin + cleanPath
        });
      }
    }
  }, [currentPage]);

  // Global Dynamic Conversion/Key Event Tracker
  // Detects critical interactions (Copy, Format, Generate, etc.) globally across all 45+ tools and fires GA4 'tool_action' events.
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (currentPage === 'home') return; // Only log engagement inside individual tool pages
      
      const target = event.target as HTMLElement;
      const button = target.closest('button');
      if (!button) return;

      const btnText = (button.innerText || button.textContent || '').trim().toLowerCase();
      if (!btnText) return;

      let actionType = '';
      if (btnText.includes('copy') || btnText.includes('clipboard')) {
        actionType = 'copy_result';
      } else if (btnText.includes('format') || btnText.includes('beautify') || btnText.includes('validate')) {
        actionType = 'format_validate';
      } else if (btnText.includes('generate') || btnText.includes('convert') || btnText.includes('download')) {
        actionType = 'generate_convert';
      } else if (btnText.includes('run') || btnText.includes('analyze') || btnText.includes('audit')) {
        actionType = 'run_analysis';
      }

      if (actionType && (window as any).gtag) {
        (window as any).gtag('event', 'tool_action', {
          tool_id: currentPage,
          action_type: actionType,
          button_label: btnText.slice(0, 30),
          event_category: 'engagement',
          event_label: `${currentPage}_${actionType}`
        });
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [currentPage]);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  // Apply or remove dark theme in Document context
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Find tool descriptor if active
  const activeTool = TOOLS.find((t) => t.id === currentPage);
  const activeCategory = activeTool ? CATEGORIES.find((c) => c.id === activeTool.category) : null;

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <NotificationProvider>
          <KeyboardShortcutProvider>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white">
              {/* Global Keyboard Shortcut Handler & Cheat Sheet Modal */}
              <KeyboardShortcutHandler
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />

              {/* 1. Global Navigation Bar */}
              <Navbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />

        {/* 2. Main Page Container with Route Animation transitions */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 pb-28 md:pb-12 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              {/* RENDER PAGES BASED ON STATE */}
              {currentPage === 'home' && (
                <Home onSelectTool={(toolId) => setCurrentPage(toolId)} />
              )}

              {currentPage === 'pricing' && (
                <Pricing onNavigatePage={setCurrentPage} />
              )}

              {currentPage === 'payment' && (
                <PaymentPage onNavigatePage={setCurrentPage} />
              )}

              {currentPage === 'payment-success' && (
                <PaymentSuccess onNavigatePage={setCurrentPage} />
              )}

              {currentPage === 'dashboard' && (
                <UserDashboard onNavigatePage={setCurrentPage} />
              )}

              {currentPage === 'admin' && (
                <AdminPanel onNavigatePage={setCurrentPage} />
              )}

              {/* AUTHENTICATION SYSTEM ROUTES */}
              {currentPage === 'login' && (
                <LoginPage onNavigatePage={setCurrentPage} />
              )}

              {currentPage === 'signup' && (
                <SignupPage onNavigatePage={setCurrentPage} />
              )}

              {currentPage === 'account' && (
                <AccountPage onNavigatePage={setCurrentPage} />
              )}

              {/* BLOG SYSTEM ROUTES */}
              {currentPage === 'blog' && (
                <BlogHome
                  setCurrentPage={setCurrentPage}
                  onSelectArticle={navigateToArticle}
                  onSelectCategory={navigateToCategory}
                  onSelectTag={navigateToTag}
                />
              )}

              {currentPage === 'blog-post' && (
                <BlogPostPage
                  slug={blogSlug}
                  setCurrentPage={setCurrentPage}
                  onSelectArticle={navigateToArticle}
                />
              )}

              {currentPage === 'blog-category' && (
                <BlogCategoryPage
                  type="category"
                  value={blogCat}
                  setCurrentPage={setCurrentPage}
                  onSelectArticle={navigateToArticle}
                />
              )}

              {currentPage === 'blog-tag' && (
                <BlogCategoryPage
                  type="tag"
                  value={blogTag}
                  setCurrentPage={setCurrentPage}
                  onSelectArticle={navigateToArticle}
                />
              )}

              {currentPage === 'category-hub' && (
                <CategoryHubPage
                  categoryId={categoryId}
                  setCurrentPage={setCurrentPage}
                />
              )}

              {currentPage === 'about' && <About />}


              {currentPage === 'contact' && <Contact />}

              {currentPage === 'help' && <Help onNavigateToContact={() => setCurrentPage('contact')} />}

              {currentPage === 'privacy' && <LegalPage initialTab="privacy" />}
              {currentPage === 'terms' && <LegalPage initialTab="terms" />}
              {currentPage === 'disclaimer' && <LegalPage initialTab="disclaimer" />}

              {/* If currentPage matches a tool ID, render the specialized Tool view */}
              {activeTool && (
                <div className="space-y-8 flex-1 flex flex-col">
                  <SEOHead
                    title={activeTool.name}
                    description={activeTool.description}
                    keywords={activeTool.tags}
                    isTool={true}
                    category={activeTool.category}
                    toolId={activeTool.id}
                  />
                  {/* Tool Breadcrumb Header */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage('home')}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200/80 dark:border-slate-850 shadow-2xs cursor-pointer transition-colors"
                        >
                          <ArrowLeft size={14} />
                          Back to Dashboard
                        </button>

                        <button
                          onClick={() => toggleFavoriteApp(activeTool.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                            favorites.includes(activeTool.id)
                              ? 'bg-amber-400 border-amber-500 text-black shadow-2xs'
                              : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                          }`}
                          title={favorites.includes(activeTool.id) ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Star size={14} className={favorites.includes(activeTool.id) ? 'fill-black text-black' : 'text-amber-500 fill-amber-500'} />
                          <span className={favorites.includes(activeTool.id) ? 'text-black font-extrabold' : 'text-black dark:text-white font-extrabold'}>
                            {favorites.includes(activeTool.id) ? 'Favorited' : 'Favorite'}
                          </span>
                        </button>

                        <button
                          onClick={() => handleShareTool(activeTool.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            shareCopied
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-2xs'
                              : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                          title="Share Tool Link"
                        >
                          {shareCopied ? <Check size={14} /> : <Share2 size={14} />}
                          <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg">
                          <Zap size={11} className="text-emerald-500" />
                          <span>Ultra Pro Max • 0ms Local RAM</span>
                        </div>

                        {activeCategory && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg">
                            <ToolIcon name={activeCategory.icon} className="h-3.5 w-3.5" />
                            {activeCategory.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
                      <h1 className="font-display text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                        {activeTool.name}
                      </h1>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-4xl">
                        {activeTool.description}
                      </p>
                    </div>
                  </div>

                  {/* Breadcrumb Navigation Trail (Home > Category > Tool) */}
                  <BreadcrumbNav
                    toolId={activeTool.id}
                    toolName={activeTool.name}
                    categoryId={activeTool.category}
                    categoryName={activeCategory?.name}
                    onNavigatePage={setCurrentPage}
                    onNavigateCategory={(catId) => {
                      setCategoryId(catId);
                      setCurrentPage('category-hub' as PageId);
                      window.history.pushState(null, '', `/category/${catId}`);
                    }}
                  />

                  {/* Render Selected Tool Workspace component with Skeleton Loading States & Premium Protection */}
                  <PerformanceProvider toolName={activeTool.name}>
                    <div className="flex-1 min-h-[400px]">
                      <React.Suspense fallback={<ToolSkeleton />}>
                        <PremiumGuard toolId={activeTool.id} onNavigatePage={setCurrentPage}>
                          <ActiveToolRenderer toolId={activeTool.id} onSelectTool={setCurrentPage} />
                        </PremiumGuard>
                      </React.Suspense>
                    </div>

                    {/* Floating Client Performance Monitor Overlay */}
                    <PerformanceMonitorOverlay toolName={activeTool.name} category={activeTool.category} />
                  </PerformanceProvider>

                  {/* Render SEO Rich Technical content & Guides */}
                  <ToolSEOContent tool={activeTool} setCurrentPage={setCurrentPage} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 3. Global Footer bar */}
        <Footer setCurrentPage={setCurrentPage} />

        {/* 4. Mobile Bottom Quick Navigation Bar */}
        <MobileBottomNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onOpenSearch={() => {
            window.dispatchEvent(new CustomEvent('smarttoolhub:openSearch'));
          }}
          onOpenCategories={() => setCategorySheetOpen(true)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          favoritesCount={favorites.length}
          onFilterFavorites={() => {
            if (currentPage !== 'home') {
              setCurrentPage('home');
            }
            setTimeout(() => {
              const favElement = document.getElementById('favorites-board');
              if (favElement) {
                favElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}
        />

        {/* 5. Mobile Category Drawer Sheet */}
        <MobileCategorySheet
          isOpen={categorySheetOpen}
          onClose={() => setCategorySheetOpen(false)}
          selectedCategory={selectedMobileCategory}
          onSelectCategory={(catId) => {
            setSelectedMobileCategory(catId);
            if (currentPage !== 'home') {
              setCurrentPage('home');
            }
            window.dispatchEvent(new CustomEvent('smarttoolhub:selectCategory', { detail: { categoryId: catId } }));
          }}
          onNavigateCategoryHub={(catId) => {
            setCurrentPage(`category-${catId}` as PageId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* 6. Social Share Dialog */}
        {activeShareTool && (
          <SocialShareModal
            tool={activeShareTool}
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
          />
        )}

        {/* 7. Elegant Cookie consent overlay */}
        <CookieConsent />

        {/* 8. Toast Container for unified API error & status notifications */}
        <ToastContainer />
      </div>
          </KeyboardShortcutProvider>
        </NotificationProvider>
    </SubscriptionProvider>
  </AuthProvider>
);
}
