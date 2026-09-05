import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Download,
  FileText,
  Code2,
  Sliders,
  Layers,
  BookOpen,
  Terminal,
  Rocket,
  Cpu,
  Coffee,
  Scale
} from 'lucide-react';
import { toast } from '../../utils/toast';

type ThemeId = 'latin' | 'tech' | 'startup' | 'cyberpunk' | 'hipster' | 'legal';
type OutputFormat = 'text' | 'html' | 'markdown' | 'json';
type ParagraphSize = 'short' | 'medium' | 'long';

interface ThemeDefinition {
  id: ThemeId;
  name: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  startPhrase: string;
  sentences: string[];
  words: string[];
}

const THEMES: Record<ThemeId, ThemeDefinition> = {
  latin: {
    id: 'latin',
    name: 'Classic Latin',
    desc: 'The timeless Cicero standard for layout design',
    icon: BookOpen,
    startPhrase: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    sentences: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Aenean pretium vulputate sapien quis porttitor.',
      'Curabitur sit amet urna sit amet sapien tristique porta.',
      'Quisque quis eleifend est, sit amet volutpat purus.',
      'Maecenas interdum eros non justo sollicitudin vulputate.',
      'Donec eu sapien magna. Praesent dictum eget elit in laoreet.',
      'Phasellus in tempor nisl. Sed vel felis eu mi rhoncus accumsan.',
      'Integer tincidunt est id metus vulputate posuere.',
      'Vestibulum id tellus lectus. Sed sollicitudin neque arcu.',
      'Nunc cursus imperdiet interdum. Etiam at sem non eros varius tristique.',
      'In elementum scelerisque nunc, non gravida ligula ultrices eu.',
      'Fusce molestie feugiat diam, id luctus est convallis vel.',
      'Nullam dictum felis eu pede mollis pretium integer tincidunt.',
      'Cras dapibus vivamus elementum semper nisi aenean vulputate eleifend tellus.',
      'Aenean leo ligula porttitor eu consequat vitae eleifend ac enim.'
    ],
    words: [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'veniam', 'quis', 'nostrud', 'ullamco', 'laboris', 'nisi',
      'aliquip', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'reprehenderit',
      'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur',
      'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'officia',
      'deserunt', 'mollit', 'anim', 'est', 'laborum'
    ]
  },
  tech: {
    id: 'tech',
    name: 'Dev & Engineering',
    desc: 'Modern cloud, TypeScript, Git, and architecture jargon',
    icon: Terminal,
    startPhrase: 'Deploying declarative microservices across distributed Kubernetes clusters.',
    sentences: [
      'Deploying declarative microservices across distributed Kubernetes clusters.',
      'Our asynchronous event bus guarantees at-least-once message delivery via Apache Kafka.',
      'Refactoring the legacy GraphQL resolver reduced p99 latency by forty-five milliseconds.',
      'Server-side rendering hydrates hydration states seamlessly using optimistic UI rollbacks.',
      'Immutable state transitions in TypeScript prevent unexpected runtime race conditions.',
      'Edge compute functions cache static assets dynamically at globally distributed CDN nodes.',
      'Automated CI/CD pipelines run linting, end-to-end integration tests, and container image scans.',
      'Zero-trust network architecture requires mutual TLS handshakes between internal services.',
      'PostgreSQL connection pooling prevents database starvation under peak concurrent traffic.',
      'Distributed tracing with OpenTelemetry pinpoints bottlenecks across polyglot microservice boundaries.',
      'Docker multi-stage builds produce ultra-lightweight Alpine container scratch images.',
      'WebSocket reconnect backoffs use jittered exponential retry algorithms to avoid thundering herds.'
    ],
    words: [
      'kubernetes', 'docker', 'graphql', 'typescript', 'microservice', 'distributed',
      'latency', 'pipeline', 'container', 'telemetry', 'payload', 'websocket',
      'asynchronous', 'immutable', 'refactor', 'cluster', 'deployment', 'endpoint',
      'cache', 'middleware', 'database', 'resolver', 'hydration', 'concurrency'
    ]
  },
  startup: {
    id: 'startup',
    name: 'Startup & Venture',
    desc: 'Product-market fit, venture capital, and growth metrics',
    icon: Rocket,
    startPhrase: 'Achieving product-market fit requires rapid iteration loops and customer discovery.',
    sentences: [
      'Achieving product-market fit requires rapid iteration loops and customer discovery.',
      'Our net revenue retention benchmark exceeds top-decile SaaS company performance metrics.',
      'Iterating through high-velocity growth experiments unlocked scalable low-CAC acquisition channels.',
      'Early-stage founders must balance burn rate with runway preservation before closing Series A.',
      'Product-led growth motions drive organic bottom-up adoption across enterprise accounts.',
      'Gamified viral referral loops decreased our blended customer acquisition cost exponentially.',
      'We pivot the go-to-market strategy to capture untapped blue ocean market opportunities.',
      'Our freemium conversion funnel converts high-intent power users into multi-seat annual contracts.',
      'Venture capital partners prioritize scalable unit economics and defensible founder moats.',
      'Continuous discovery interviews uncover hidden user pain points and unexpressed demand.'
    ],
    words: [
      'growth', 'runway', 'retention', 'saas', 'synergy', 'pivot', 'venture',
      'freemium', 'metrics', 'scale', 'founder', 'adoption', 'funnel', 'monetization',
      'traction', 'valuation', 'bootstrapped', 'product-led', 'churn', 'cac', 'ltv'
    ]
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk & Sci-Fi',
    desc: 'Neural implants, neon megacities, and quantum networks',
    icon: Cpu,
    startPhrase: 'Neon rain slicks the chrome alleyways of Sector 9 as neural links pulse.',
    sentences: [
      'Neon rain slicks the chrome alleyways of Sector 9 as neural links pulse in real time.',
      'Rogue ICE firewalls crack beneath the relentless brute-force decryptor protocol.',
      'Synthetic augments overclock the visual cortex with high-definition thermal telemetry overlays.',
      'Sub-orbital databanks transmit quantum-encrypted packets across orbital geosynchronous satellites.',
      'Underground biohackers splice black-market wetware into military-grade chassis frames.',
      'Megacorporation surveillance drones sweep neon plazas under flickering holographic advertisements.',
      'Cyberdeck operators navigate the glowing wireframe topography of the deep grid matrix.',
      'Bioluminescent nanobots repair micro-fractures within reinforced titanium alloy exoskeletons.'
    ],
    words: [
      'cyberdeck', 'matrix', 'neural', 'holographic', 'nanobot', 'sub-orbital',
      'exoskeleton', 'biohacker', 'telemetry', 'quantum', 'firewall', 'augmented',
      'neon', 'synthetic', 'overclock', 'decryptor', 'wetware', 'grid', 'chassis'
    ]
  },
  hipster: {
    id: 'hipster',
    name: 'Coffee & Artisanal',
    desc: 'Pour-over cold brew, bespoke vinyl, and heritage sourdough',
    icon: Coffee,
    startPhrase: 'Single-origin Ethiopian pour-over brews slowly beside a vintage typewriter.',
    sentences: [
      'Single-origin Ethiopian pour-over brews slowly beside a vintage typewriter.',
      'Locally sourced organic kombucha pairs seamlessly with slow-fermented heritage sourdough.',
      'Raw selvedge denim hung to air-dry amidst potted monstera plants in the sunny loft.',
      'Bespoke reclaimed wood tables showcase hand-thrown ceramic mugs with subtle glaze imperfections.',
      'Artisanal batch dark chocolate infused with sea salt and lavender from sustainable micro-farms.',
      'Spinning rare 180-gram analog vinyl on a restored turntable creates an intimate sonic warmth.',
      'Zero-waste foraging workshops explore wild edible mushrooms and mountain botanicals.'
    ],
    words: [
      'artisanal', 'pour-over', 'sourdough', 'bespoke', 'selvedge', 'vintage',
      'botanical', 'analog', 'fermented', 'single-origin', 'sustainable', 'reclaimed',
      'kombucha', 'micro-batch', 'organic', 'monstera', 'foraged', 'ceramic'
    ]
  },
  legal: {
    id: 'legal',
    name: 'Legal & Contract',
    desc: 'Formal clauses, indemnity, covenants, and jurisprudence',
    icon: Scale,
    startPhrase: 'The Parties hereto agree that this Agreement shall be governed by applicable statutory law.',
    sentences: [
      'The Parties hereto agree that this Agreement shall be governed by applicable statutory law.',
      'Neither Party shall be held liable for failure to perform obligations arising from Force Majeure events.',
      'All proprietary intellectual property and confidential information remain the exclusive asset of the Licensor.',
      'The Licensee covenants to indemnify, defend, and hold harmless all indemnified affiliates from third-party claims.',
      'In witness whereof, the authorized signatories execute this binding instrument as of the Effective Date.',
      'Severability provisions ensure the validity of remaining covenants should any clause be deemed void.',
      'Arbitration shall be conducted in accordance with standard commercial rules of dispute resolution.'
    ],
    words: [
      'indemnity', 'covenant', 'herein', 'whereof', 'severability', 'arbitration',
      'proprietary', 'affiliates', 'licensor', 'licensee', 'statutory', 'jurisdiction',
      'binding', 'instrument', 'warranties', 'remedies', 'liabilities', 'clauses'
    ]
  }
};

export default function LoremIpsum() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('latin');
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [paragraphSize, setParagraphSize] = useState<ParagraphSize>('medium');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('text');
  const [startWithThemePhrase, setStartWithThemePhrase] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const theme = THEMES[selectedTheme];

  const generatedOutput = useMemo(() => {
    const sentencesPool = theme.sentences;
    const wordsPool = theme.words;
    const startPhrase = theme.startPhrase;

    if (type === 'paragraphs') {
      const sentenceCountMap: Record<ParagraphSize, { min: number; max: number }> = {
        short: { min: 3, max: 4 },
        medium: { min: 5, max: 7 },
        long: { min: 8, max: 12 }
      };

      const { min, max } = sentenceCountMap[paragraphSize];
      const paras: string[] = [];

      for (let p = 0; p < count; p++) {
        const sentenceCount = Math.floor(Math.random() * (max - min + 1)) + min;
        const paraSentences: string[] = [];

        for (let s = 0; s < sentenceCount; s++) {
          const randomIndex = Math.floor(Math.random() * sentencesPool.length);
          paraSentences.push(sentencesPool[randomIndex]);
        }

        let paraText = paraSentences.join(' ');

        if (p === 0 && startWithThemePhrase) {
          if (!paraText.startsWith(startPhrase)) {
            paraText = startPhrase + ' ' + paraText;
          }
        }

        paras.push(paraText);
      }

      if (outputFormat === 'html') {
        return paras.map((p, idx) => {
          if (idx === 0) return `<h2>${p.split('.')[0]}</h2>\n<p>${p}</p>`;
          return `<p>${p}</p>`;
        }).join('\n\n');
      } else if (outputFormat === 'markdown') {
        return paras.map((p, idx) => {
          if (idx === 0) return `## ${p.split('.')[0]}\n\n${p}`;
          return `${p}`;
        }).join('\n\n');
      } else if (outputFormat === 'json') {
        return JSON.stringify({ theme: theme.name, count, paragraphs: paras }, null, 2);
      }

      return paras.join('\n\n');
    } else if (type === 'sentences') {
      const sentences: string[] = [];
      for (let s = 0; s < count; s++) {
        const randomIndex = Math.floor(Math.random() * sentencesPool.length);
        sentences.push(sentencesPool[randomIndex]);
      }

      if (startWithThemePhrase && sentences.length > 0) {
        sentences[0] = startPhrase;
      }

      if (outputFormat === 'html') {
        return `<ul>\n${sentences.map((s) => `  <li>${s}</li>`).join('\n')}\n</ul>`;
      } else if (outputFormat === 'markdown') {
        return sentences.map((s) => `- ${s}`).join('\n');
      } else if (outputFormat === 'json') {
        return JSON.stringify({ theme: theme.name, count, sentences }, null, 2);
      }

      return sentences.join(' ');
    } else {
      // Words
      const words: string[] = [];
      for (let w = 0; w < count; w++) {
        const randomIndex = Math.floor(Math.random() * wordsPool.length);
        words.push(wordsPool[randomIndex]);
      }

      if (startWithThemePhrase && selectedTheme === 'latin' && words.length >= 5) {
        words[0] = 'lorem';
        words[1] = 'ipsum';
        words[2] = 'dolor';
        words[3] = 'sit';
        words[4] = 'amet';
      }

      let text = words.join(' ');
      text = text.charAt(0).toUpperCase() + text.slice(1) + '.';

      if (outputFormat === 'html') {
        return `<span>${text}</span>`;
      } else if (outputFormat === 'markdown') {
        return `*${text}*`;
      } else if (outputFormat === 'json') {
        return JSON.stringify({ theme: theme.name, wordCount: count, text }, null, 2);
      }

      return text;
    }
  }, [selectedTheme, type, count, paragraphSize, outputFormat, startWithThemePhrase, theme]);

  const metrics = useMemo(() => {
    if (!generatedOutput) return { words: 0, chars: 0, sentences: 0, readTime: '0s', bytes: '0 B' };
    const words = generatedOutput.trim().split(/\s+/).filter(Boolean).length;
    const chars = generatedOutput.length;
    const sentences = (generatedOutput.match(/[.!?]+/g) || []).length || 1;
    const readTimeSeconds = Math.max(1, Math.round((words / 200) * 60));
    const readTime = readTimeSeconds < 60 ? `${readTimeSeconds} sec` : `${Math.ceil(readTimeSeconds / 60)} min`;
    const byteSize = new Blob([generatedOutput]).size;
    const bytes = byteSize < 1024 ? `${byteSize} B` : `${(byteSize / 1024).toFixed(1)} KB`;

    return { words, chars, sentences, readTime, bytes };
  }, [generatedOutput]);

  const handleCopy = async () => {
    if (!generatedOutput) return;
    try {
      await navigator.clipboard.writeText(generatedOutput);
      setCopied(true);
      toast.success('Text copied to clipboard!', 'Copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text.');
    }
  };

  const handleDownload = () => {
    if (!generatedOutput) return;
    const extMap: Record<OutputFormat, string> = {
      text: 'txt',
      html: 'html',
      markdown: 'md',
      json: 'json'
    };
    const mimeMap: Record<OutputFormat, string> = {
      text: 'text/plain',
      html: 'text/html',
      markdown: 'text/markdown',
      json: 'application/json'
    };

    const extension = extMap[outputFormat];
    const mime = mimeMap[outputFormat];
    const blob = new Blob([generatedOutput], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorem-ipsum-${selectedTheme}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded lorem-ipsum-${selectedTheme}.${extension}`, 'File Saved');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Theme Picker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Multi-Theme Placeholder Studio
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Professional Lorem Ipsum & Dummy Text Generator
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate dummy copy in Latin, DevOps, Startup, Cyberpunk, Hipster, and Legal styles with formatted exports.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy All'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download text file"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Theme Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
            const t = THEMES[themeKey];
            const Icon = t.icon;
            const isSelected = selectedTheme === themeKey;
            return (
              <button
                key={themeKey}
                onClick={() => setSelectedTheme(themeKey)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <Icon size={14} />
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{t.name}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{t.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls + Live Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-indigo-500" /> Structure & Quantity
              </span>
              <span className="text-[11px] font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                {count} {type}
              </span>
            </div>

            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Generate Units
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setType(t);
                      if (t === 'words' && count < 10) setCount(50);
                      if (t === 'paragraphs' && count > 15) setCount(3);
                    }}
                    className={`py-2 text-xs font-bold capitalize rounded-xl transition-all cursor-pointer ${
                      type === t
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Quantity</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{count}</span>
              </div>
              <input
                type="range"
                min={1}
                max={type === 'words' ? 300 : type === 'sentences' ? 30 : 15}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Paragraph Size (if paragraphs) */}
            {type === 'paragraphs' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Paragraph Length
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['short', 'medium', 'long'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setParagraphSize(size)}
                      className={`py-1.5 text-[11px] font-bold capitalize rounded-lg transition-all cursor-pointer border ${
                        paragraphSize === size
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Output Format */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Output Format
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['text', 'html', 'markdown', 'json'] as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`py-1.5 text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer border ${
                      outputFormat === fmt
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={startWithThemePhrase}
                  onChange={(e) => setStartWithThemePhrase(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer accent-indigo-600"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Begin with canonical opening sentence
                </span>
              </label>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-sm font-mono font-black text-slate-900 dark:text-white">{metrics.words}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Words</div>
            </div>
            <div>
              <div className="text-sm font-mono font-black text-slate-900 dark:text-white">{metrics.chars}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Characters</div>
            </div>
            <div>
              <div className="text-sm font-mono font-black text-slate-900 dark:text-white">{metrics.readTime}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Read Time</div>
            </div>
          </div>
        </div>

        {/* Right Output View */}
        <div className="lg:col-span-8 flex flex-col min-h-[460px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-indigo-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Generated Output ({outputFormat.toUpperCase()})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                {metrics.bytes}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-auto bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-all">
            {generatedOutput}
          </div>
        </div>
      </div>
    </div>
  );
}
