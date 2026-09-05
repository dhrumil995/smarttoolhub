import React, { useState } from 'react';
import { Video, Sparkles, Copy, Check, Clock, Film, PlayCircle } from 'lucide-react';

export function AIYTScriptGenerator() {
  const [topic, setTopic] = useState('How AI Agents Will Change Web Development in 2026');
  const [duration, setDuration] = useState('10 Min');
  const [tone, setTone] = useState('Energetic & Educational');

  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptOutput, setScriptOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      const cleanTopic = topic.trim();
      const hookText = `[0:00 - 0:15] VISUAL: High-energy montage addressing "${cleanTopic}".\nNARRATOR: If you want to master ${cleanTopic}, what I'm about to show you in the next ${duration} will completely change your perspective. Let's break it down right now...`;
      
      const introText = `[0:15 - 1:00] VISUAL: Host on camera with title overlay.\nNARRATOR: Welcome back! Today we are exploring "${cleanTopic}" with a focus on practical execution, proven frameworks, and actionable tips you can apply immediately.`;

      const chapters = [
        {
          timestamp: "1:00 - 3:30",
          chapterTitle: `Chapter 1: The Core Fundamentals of ${cleanTopic}`,
          scriptText: `Before diving into advanced techniques, understanding the core foundations of ${cleanTopic} is critical to avoid the most common beginner mistakes...`,
          bRoll: `B-ROLL: Screen captures, animations, and diagrams demonstrating fundamentals of ${cleanTopic}.`
        },
        {
          timestamp: "3:30 - 7:00",
          chapterTitle: `Chapter 2: Step-by-Step Breakdown & Strategy`,
          scriptText: `Here is the exact step-by-step strategy for ${cleanTopic}. First, analyze the current benchmarks. Second, implement targeted optimizations...`,
          bRoll: `B-ROLL: Step-by-step workflow tutorial and live walkthrough.`
        },
        {
          timestamp: "7:00 - 9:30",
          chapterTitle: `Chapter 3: Pro Tips & Future Outlook`,
          scriptText: `To stay ahead of the curve with ${cleanTopic}, prioritize scalable habits and leverage modern automated tools...`,
          bRoll: `B-ROLL: High-level comparison charts and performance metrics.`
        }
      ];

      const outroText = `[9:30 - 10:00] NARRATOR: What is your biggest takeaway about ${cleanTopic}? Let me know in the comments below! Hit the Like button if this was helpful, Subscribe for more weekly tutorials, and check out the free tools in our description!`;

      setScriptOutput({
        title: `The Ultimate Guide to ${cleanTopic} (${new Date().getFullYear()} Masterclass)`,
        hook: hookText,
        intro: introText,
        chapters,
        outro: outroText
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold">
          <Video size={14} /> Long-Form YouTube Script AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI YouTube Script Generator (Long-Form)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Enter a video topic to craft full structured YouTube scripts complete with viral hooks, timestamped chapters, B-roll cues, and subscriber conversion intros.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Video Topic / Keyword</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Length</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option>5 Min</option>
                <option>10 Min</option>
                <option>15 Min</option>
                <option>20 Min</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tone of Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option>Energetic & Educational</option>
                <option>Storytelling / Cinematic</option>
                <option>Controversial / Hot Take</option>
                <option>Step-by-Step Tutorial</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} /> {isGenerating ? 'Drafting Full Script...' : 'Generate YouTube Script'}
          </button>
        </div>

        <div className="lg:col-span-7">
          {scriptOutput ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Script Blueprint</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(scriptOutput, null, 2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-red-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied Script!' : 'Copy Full Script'}
                </button>
              </div>

              {/* Hook */}
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 space-y-1 text-xs">
                <span className="font-bold text-red-600 uppercase flex items-center gap-1"><PlayCircle size={12} /> 15-Sec Viral Hook</span>
                <p className="text-slate-800 dark:text-slate-200 font-sans">{scriptOutput.hook}</p>
              </div>

              {/* Chapters */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Timestamped Scene Breakdown</span>
                {scriptOutput.chapters.map((ch: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{ch.chapterTitle}</span>
                      <span className="font-mono text-slate-400 text-[10px]">{ch.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{ch.scriptText}</p>
                    <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 pt-1">
                      {ch.bRoll}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Film size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Enter a topic to generate structured long-form video scripts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
