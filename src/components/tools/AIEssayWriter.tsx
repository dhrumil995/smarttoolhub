import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Copy, Download, RefreshCw, Check, 
  FileText, AlignLeft, Layers, Sliders, Hash, Feather, CheckCircle2
} from 'lucide-react';

export function AIEssayWriter() {
  const [topic, setTopic] = useState('The Impact of Artificial Intelligence on the Future of Higher Education');
  const [essayType, setEssayType] = useState('Argumentative');
  const [tone, setTone] = useState('Academic');
  const [wordCount, setWordCount] = useState(600);
  const [keyPoints, setKeyPoints] = useState('Personalized learning algorithms, ethical considerations of academic integrity, automation of administrative grading');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEssay, setGeneratedEssay] = useState<string>(`# The Impact of Artificial Intelligence on the Future of Higher Education

## Thesis Statement
Artificial intelligence represents a paradigm shift in modern higher education, offering unprecedented personalized learning opportunities while simultaneously challenging traditional models of academic integrity and institutional pedagogy.

## Introduction
In the contemporary academic landscape, artificial intelligence (AI) has rapidly transitioned from a theoretical concept into a foundational technology. As universities worldwide integrate adaptive learning platforms and generative models, the higher education sector faces a pivotal moment of digital transformation.

## Personalized Learning & Adaptive Pedagogy
One of the most profound advantages of AI in academia is its ability to tailor educational content to individual student learning velocities. Machine learning algorithms analyze student progress in real-time, identifying cognitive bottlenecks and dynamically adjusting course materials. This personalized approach democratizes specialized instruction, allowing students from diverse academic backgrounds to achieve mastery.

## Ethical Considerations & Academic Integrity
However, the integration of AI is not without significant ethical friction. The widespread availability of generative writing tools has forced faculty to reconsider conventional assessment methods. Rather than relying solely on traditional term papers, institutions must adopt authentic assessment strategies that evaluate critical thinking, oral defense, and real-world problem solving.

## Conclusion
Ultimately, artificial intelligence should not be viewed as a replacement for human intellect, but rather as an intellectual catalyst. By proactively establishing ethical frameworks and leveraging adaptive learning technology, higher education institutions can prepare students for a technological future while preserving academic excellence.`);

  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'ai-writer',
          payload: {
            prompt: `Write a high-quality ${essayType} essay in an ${tone} tone (approx ${wordCount} words) on the topic: "${topic}". Key points to include: "${keyPoints}". Structure it with an engaging title, thesis statement, introduction, structured body paragraphs, and conclusion in Markdown formatting.`
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          setGeneratedEssay(data.result);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEssay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedEssay], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic.toLowerCase().replace(/[^a-z0-0]/g, '_')}_essay.md`;
    link.click();
  };

  const currentWords = generatedEssay.trim() ? generatedEssay.trim().split(/\s+/).length : 0;
  const currentChars = generatedEssay.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-violet-500/20">
            <BookOpen size={12} className="text-violet-500" />
            Academic & Article Generator
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Essay & Article Writer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Generate well-structured academic essays, research outlines, persuasive articles, and blog drafts with custom tone and length.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sliders size={16} className="text-violet-500" />
              Essay Prompt & Parameters
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Essay Topic / Title</label>
              <textarea
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={2}
                placeholder="Enter your essay prompt or topic..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Essay Type</label>
                <select
                  value={essayType}
                  onChange={(e) => setEssayType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="Argumentative">Argumentative</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Descriptive">Descriptive</option>
                  <option value="Expository">Expository</option>
                  <option value="Narrative">Narrative</option>
                  <option value="Analytical">Analytical</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Writing Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="Academic">Academic</option>
                  <option value="Professional">Professional</option>
                  <option value="Formal">Formal</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Journalistic">Journalistic</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Target Length</label>
              <div className="grid grid-cols-4 gap-2">
                {[300, 500, 750, 1000].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setWordCount(num)}
                    className={`py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                      wordCount === num
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ~{num}w
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Key Arguments / Sub-Topics</label>
              <input
                type="text"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Key arguments separated by commas"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
              <span>{isGenerating ? 'Writing Essay...' : 'Generate AI Essay'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Output Essay Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText size={14} className="text-violet-500" /> Generated Document Output
              </span>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>{currentWords} words</span>
                <span>•</span>
                <span>{currentChars} chars</span>
              </div>
            </div>

            <textarea
              value={generatedEssay}
              onChange={(e) => setGeneratedEssay(e.target.value)}
              rows={20}
              className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIEssayWriter;
