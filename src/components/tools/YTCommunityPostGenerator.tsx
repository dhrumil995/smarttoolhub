import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  BarChart2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Share2,
  HelpCircle,
  TrendingUp,
  Flame,
  Layers,
  Heart
} from 'lucide-react';

interface PollTemplate {
  id: string;
  type: 'poll' | 'discussion' | 'teaser' | 'quiz';
  title: string;
  question: string;
  options?: string[];
  callToAction: string;
}

const TEMPLATES: PollTemplate[] = [
  {
    id: 't-1',
    type: 'poll',
    title: 'Next Video Decider Poll',
    question: '🚨 Quick question for you all: Which topic should I break down in next Tuesday’s deep-dive video? Vote below and let me know your biggest questions in the comments!',
    options: [
      '⚡ Building a Full-Stack AI SaaS in 48 Hours',
      '🛠️ 10 Dev Tools That Save Me 15+ Hours/Week',
      '💰 How I Landed $5,000 Tech Sponsorships',
      '🧠 System Design for Senior Engineers 2026',
    ],
    callToAction: 'Voting ends in 24 hours! Leave comment for specific questions.',
  },
  {
    id: 't-2',
    type: 'quiz',
    title: 'Audience Trivia / Knowledge Check',
    question: 'Pop Quiz for Developers! What is the primary reason why 90% of micro-SaaS startups fail within the first 6 months? 🤔',
    options: [
      'A) Bad Code & Slow Performance',
      'B) Poor Distribution & Zero Marketing (Correct!)',
      'C) Server & Hosting Costs',
      'D) Running out of Feature Ideas',
    ],
    callToAction: 'Drop your explanation in the comments before seeing the answer!',
  },
  {
    id: 't-3',
    type: 'discussion',
    title: 'Controversial Debate & High Comment Generator',
    question: 'Unpopular Opinion: In 2026, you DO NOT need a Computer Science degree or traditional bootcamp to earn $120k+ as a software developer. \n\nDo you agree or disagree? Let’s talk in the comments 👇',
    callToAction: 'Pinning the top 3 most thoughtful perspectives.',
  },
  {
    id: 't-4',
    type: 'teaser',
    title: 'Behind-the-Scenes & Premiere Teaser',
    question: '🎬 Just spent 40+ hours editing what might be our biggest video of the year. We’re giving away 5 developer starter kits in the pinned comment when it premieres tomorrow at 10 AM EST. \n\nDrop a 🔥 emoji if you have your notifications turned on!',
    callToAction: 'Hit the bell icon so you don’t miss the premiere giveaway.',
  },
];

export default function YTCommunityPostGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<PollTemplate>(TEMPLATES[0]);
  const [customQuestion, setCustomQuestion] = useState(TEMPLATES[0].question);
  const [options, setOptions] = useState<string[]>(TEMPLATES[0].options || []);
  const [channelName, setChannelName] = useState('TechCreator Hub');
  
  // Interactive Simulation State
  const [selectedVote, setSelectedVote] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [simulatedVotes, setSimulatedVotes] = useState([42, 28, 18, 12]);
  const [likesCount, setLikesCount] = useState(1420);
  const [isLiked, setIsLiked] = useState(false);

  const handleSelectTemplate = (tmpl: PollTemplate) => {
    setSelectedTemplate(tmpl);
    setCustomQuestion(tmpl.question);
    setOptions(tmpl.options || []);
    setSelectedVote(null);
  };

  const handleVote = (index: number) => {
    setSelectedVote(index);
  };

  const handleCopy = () => {
    const text = `${customQuestion}\n\n${
      options.length > 0 ? options.map((opt, i) => `${i + 1}. ${opt}`).join('\n') + '\n\n' : ''
    }${selectedTemplate.callToAction}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                YouTube Engagement Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-bold">
                Community Tab & Polls
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              YouTube Community Tab & Poll Post Generator
              <MessageSquare className="text-purple-500" size={22} />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Boost subscriber engagement between uploads with viral multiple-choice community polls, trivia quizzes, premiere teasers, and discussion debates.
            </p>
          </div>
        </div>

        {/* Template Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTemplate.id === tmpl.id
                  ? 'border-red-500 bg-red-500/10 dark:bg-red-950/20 ring-1 ring-red-500/40 text-slate-900 dark:text-white font-bold'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="text-xs font-bold line-clamp-1">{tmpl.title}</div>
              <div className="text-[10px] opacity-70 uppercase font-mono mt-0.5">{tmpl.type}</div>
            </button>
          ))}
        </div>

        {/* Custom Editor Fields */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Community Post Text & Question
            </label>
            <textarea
              rows={3}
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-red-500 focus:outline-none leading-relaxed"
            />
          </div>

          {options.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Poll Choices ({options.length} options)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[idx] = e.target.value;
                      setOptions(newOpts);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Realistic YouTube Community Tab Mockup */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="text-purple-500" size={18} />
            Live Interactive Community Feed Preview
          </h2>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied Post' : 'Copy Post & Poll'}</span>
          </button>
        </div>

        {/* YouTube Post Mockup Box */}
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#0f0f0f] text-white border border-slate-800 shadow-xl space-y-4">
          {/* Post Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-600 font-bold flex items-center justify-center text-sm shadow-sm">
                {channelName.slice(0, 1)}
              </div>
              <div>
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  {channelName}
                  <span className="h-3 w-3 rounded-full bg-slate-600 text-[8px] flex items-center justify-center">✓</span>
                </h4>
                <p className="text-[11px] text-slate-400">2 hours ago</p>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-200">
            {customQuestion}
          </p>

          {/* Interactive Poll Options with Dynamic Percentage Bars */}
          {options.length > 0 && (
            <div className="space-y-2 pt-1">
              {options.map((opt, idx) => {
                const isSelected = selectedVote === idx;
                const percentage = simulatedVotes[idx] || 25;

                return (
                  <button
                    key={idx}
                    onClick={() => handleVote(idx)}
                    className={`w-full relative overflow-hidden text-left p-3 rounded-xl border transition-all cursor-pointer text-xs font-medium ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/20 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {/* Simulated Percentage fill bar */}
                    {selectedVote !== null && (
                      <div
                        className="absolute inset-y-0 left-0 bg-blue-500/20 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    )}

                    <div className="relative flex items-center justify-between z-10">
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                          {isSelected ? '●' : ''}
                        </span>
                        {opt}
                      </span>
                      {selectedVote !== null && (
                        <span className="font-mono font-bold text-xs text-blue-400">{percentage}%</span>
                      )}
                    </div>
                  </button>
                );
              })}

              <div className="text-[11px] text-slate-400 font-mono pt-1">
                {selectedVote !== null ? '18,452 total votes • Poll live' : 'Click any option to preview voter result view'}
              </div>
            </div>
          )}

          {/* Post Footer Actions */}
          <div className="flex items-center gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
              }}
              className={`flex items-center gap-1.5 cursor-pointer hover:text-white ${isLiked ? 'text-red-500 font-bold' : ''}`}
            >
              <ThumbsUp size={15} />
              <span>{likesCount.toLocaleString()}</span>
            </button>

            <button className="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <ThumbsDown size={15} />
            </button>

            <button className="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <Share2 size={15} />
              <span>Share</span>
            </button>

            <button className="flex items-center gap-1.5 cursor-pointer hover:text-white ml-auto">
              <MessageSquare size={15} />
              <span>184 Comments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
