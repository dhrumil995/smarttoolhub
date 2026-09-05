import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Bot,
  Zap,
  RefreshCw,
  Sliders,
  Download,
  Code2,
  Cpu,
  Layers,
  HelpCircle,
  FileText,
  ShieldAlert,
  Terminal,
  BookOpen
} from 'lucide-react';
import { toast } from '../../utils/toast';

type FrameworkId = 'rtf' | 'clear' | 'cot' | 'fewshot' | 'xml';
type TargetModel = 'claude' | 'gpt4o' | 'gemini' | 'midjourney';

interface PromptPreset {
  id: string;
  name: string;
  role: string;
  goal: string;
  audience: string;
  format: string;
  tone: string;
  constraints: string[];
}

const PRESETS: PromptPreset[] = [
  {
    id: 'code-architect',
    name: 'Full-Stack Code Architect',
    role: 'Principal Software Architect & TypeScript/React Specialist',
    goal: 'Design clean, modular, production-ready code with complete type safety, responsive layout, and zero mock stubs.',
    audience: 'Senior Software Engineers & Tech Leads',
    format: 'Complete production TypeScript code block, architecture breakdown, and edge-case validation checklist.',
    tone: 'Precise, authoritative, technical, and concise.',
    constraints: [
      'Never truncate code with "// ...rest of code" comments.',
      'Enforce strict TypeScript types and zero "any" types.',
      'Implement graceful error handling and offline state fallbacks.'
    ]
  },
  {
    id: 'copywriter',
    name: 'High-Converting Copywriter',
    role: 'World-Class Conversion Rate Optimization (CRO) Copywriter',
    goal: 'Write a landing page hero section, feature benefits, and sticky call-to-action for a new developer SaaS product.',
    audience: 'Founders, Indie Hackers, and Engineering Managers',
    format: 'Structured Markdown with H1, H2, high-CTR bullet points, and social proof badges.',
    tone: 'Persuasive, punchy, energetic, and value-driven.',
    constraints: [
      'Ban generic SaaS clichés (e.g. "supercharge", "unleash", "all-in-one").',
      'Lead with user pain points before introducing technical features.',
      'Keep paragraphs under 3 sentences for maximum readability.'
    ]
  },
  {
    id: 'consultant',
    name: 'Executive Strategy Consultant',
    role: 'Top-Tier Management Consultant & Strategic Growth Advisor',
    goal: 'Evaluate the unit economics, go-to-market risks, and competitive moat of a B2B SaaS startup expanding to enterprise tiers.',
    audience: 'C-Suite Executives & Venture Capital Investors',
    format: 'Executive Summary, SWOT Risk Matrix, Unit Economics Analysis, and 90-Day Execution Roadmap.',
    tone: 'Analytical, objective, structured, and strategic.',
    constraints: [
      'Ground all recommendations in defensible financial metrics (CAC, LTV, NRR, Payback Period).',
      'Provide realistic downside risks alongside growth projections.'
    ]
  },
  {
    id: 'cold-email',
    name: 'B2B Sales Cold Outreach',
    role: 'Elite B2B Sales Development Representative (SDR)',
    goal: 'Write a 3-step personalized cold email sequence targeting enterprise CTOs to book a 15-minute product demonstration.',
    audience: 'Chief Technology Officers and VPs of Engineering',
    format: '3 distinct email steps (Initial Pitch, Social Proof Case Study, Polite Breakup).',
    tone: 'Conversational, personalized, non-pushy, and professional.',
    constraints: [
      'Every email must be under 120 words.',
      'Include a frictionless low-friction call-to-action question.'
    ]
  },
  {
    id: 'data-scientist',
    name: 'Python Data Analyst',
    role: 'Senior Data Scientist & Statistical Modeling Expert',
    goal: 'Analyze a customer churn dataset in Python using Pandas, Seaborn, and Scikit-Learn to identify top predictive churn indicators.',
    audience: 'Product Growth Teams and Data Analysts',
    format: 'Step-by-step Python Jupyter notebook code with visualizations and statistical interpretations.',
    tone: 'Methodical, mathematically rigorous, and well-commented.',
    constraints: [
      'Include data cleaning, feature engineering, and cross-validation metrics (AUC-ROC, F1 score).',
      'Add comments explaining the business interpretation of each coefficient.'
    ]
  }
];

export default function AIPromptGenerator() {
  const [activePreset, setActivePreset] = useState<string>('code-architect');
  const [framework, setFramework] = useState<FrameworkId>('rtf');
  const [targetModel, setTargetModel] = useState<TargetModel>('claude');

  const [role, setRole] = useState(PRESETS[0].role);
  const [goal, setGoal] = useState(PRESETS[0].goal);
  const [audience, setAudience] = useState(PRESETS[0].audience);
  const [outputFormat, setOutputFormat] = useState(PRESETS[0].format);
  const [tone, setTone] = useState(PRESETS[0].tone);
  const [constraints, setConstraints] = useState<string>(PRESETS[0].constraints.join('\n'));
  const [includeChainOfThought, setIncludeChainOfThought] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(false);
  const [copied, setCopied] = useState(false);

  const applyPreset = (presetId: string) => {
    const p = PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setActivePreset(p.id);
    setRole(p.role);
    setGoal(p.goal);
    setAudience(p.audience);
    setOutputFormat(p.format);
    setTone(p.tone);
    setConstraints(p.constraints.join('\n'));
  };

  const compiledPrompt = useMemo(() => {
    const parsedConstraints = constraints
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    if (framework === 'xml') {
      // Claude-optimized XML prompt schema
      return `<system_prompt>
  <role>${role}</role>
  
  <objective>
    ${goal}
  </objective>
  
  <target_audience>
    ${audience}
  </target_audience>
  
  <output_format>
    ${outputFormat}
  </output_format>
  
  <style_and_tone>
    ${tone}
  </style_and_tone>
  
  <constraints>
${parsedConstraints.map((c, i) => `    <rule index="${i + 1}">${c}</rule>`).join('\n')}
  </constraints>
${includeChainOfThought ? `\n  <instructions>\n    Before delivering the final output, think step-by-step inside <thinking> tags to plan the optimal approach.\n  </instructions>` : ''}
</system_prompt>`;
    } else if (framework === 'clear') {
      // CLEAR framework (Context, Logical Task, Examples, Actionable Constraints, Response Format)
      return `# SYSTEM PROMPT: CLEAR FRAMEWORK

## [C] CONTEXT & IDENTITY
You are an expert ${role}. You are tasked with providing elite guidance tailored specifically for ${audience}.

## [L] LOGICAL TASK
${goal}

## [E] EXECUTION GUIDELINES
- Adopt a ${tone} tone throughout.
${includeChainOfThought ? '- Formulate your internal chain of thought step-by-step before answering.' : ''}

## [A] ACTIONABLE CONSTRAINTS & RULES
${parsedConstraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## [R] REQUIRED OUTPUT FORMAT
${outputFormat}

Begin by executing the task immediately following these exact specifications.`;
    } else if (framework === 'cot') {
      // Chain of Thought / Step-by-step reasoning
      return `Act as a ${role}.

TASK DESCRIPTION:
${goal}

TARGET AUDIENCE:
${audience}

STEP-BY-STEP REASONING PROTOCOL:
1. First, analyze the core problem and decompose it into distinct sub-tasks.
2. Formulate hypotheses and identify potential pitfalls or edge cases.
3. Validate each step against the established rules.
4. Synthesize the final polished output.

STRICT CONSTRAINTS:
${parsedConstraints.map((c, i) => `• ${c}`).join('\n')}

DESIRED OUTPUT FORMAT:
${outputFormat} (Tone: ${tone})`;
    } else {
      // Standard RTF (Role, Task, Format)
      return `You are an expert ${role}.

PRIMARY OBJECTIVE:
${goal}

TARGET AUDIENCE:
${audience}

OUTPUT FORMAT & STRUCTURE:
${outputFormat}

TONE & STYLE:
${tone}

RULES & CONSTRAINTS:
${parsedConstraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}
${includeChainOfThought ? `${parsedConstraints.length + 1}. Think through your approach step-by-step before generating the final response.` : ''}

Deliver the response now:`;
    }
  }, [role, goal, audience, outputFormat, tone, constraints, framework, includeChainOfThought]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiledPrompt);
      setCopied(true);
      toast.success('Prompt copied to clipboard!', 'Prompt Ready');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy prompt.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([compiledPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-prompt-${activePreset}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported system-prompt-${activePreset}.md`, 'File Saved');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Bot size={13} /> Advanced AI Prompt Architect
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              AI System Prompt Generator & Optimizer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform basic AI requests into production-grade system prompts formatted for Claude 3.5, GPT-4o, and Gemini models.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Export .md</span>
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-4">
          {PRESETS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{p.name}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">{p.role}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Config */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-blue-500" /> Framework Architecture
              </span>

              {/* Framework Selector */}
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as FrameworkId)}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="rtf">RTF (Role-Task-Format)</option>
                <option value="xml">Claude XML Structured</option>
                <option value="clear">CLEAR Framework</option>
                <option value="cot">Chain-of-Thought (CoT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                AI Persona / Assigned Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Core Objective / Task
              </label>
              <textarea
                rows={2}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Style & Tone
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Required Output Format
              </label>
              <input
                type="text"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Strict Constraints & Rules (1 per line)
              </label>
              <textarea
                rows={3}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeChainOfThought}
                  onChange={(e) => setIncludeChainOfThought(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer accent-blue-600"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Enforce Step-by-Step Chain-of-Thought (CoT) reasoning
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Output Viewer */}
        <div className="lg:col-span-7 flex flex-col min-h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 size={15} className="text-blue-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Ready-to-Use System Prompt
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-6 flex-1 overflow-auto bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-all">
            {compiledPrompt}
          </div>
        </div>
      </div>
    </div>
  );
}
