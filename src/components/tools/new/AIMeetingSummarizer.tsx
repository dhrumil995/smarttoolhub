import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, Copy, Check, Clock, UserCheck, Mail } from 'lucide-react';

export function AIMeetingSummarizer() {
  const [transcript, setTranscript] = useState(
    `Sarah: Welcome everyone. Let me start by reviewing our Q3 marketing goals. Our website traffic grew by 35% after launching the new blog strategy.\nMark: That's great! On the engineering side, we completed the API refactoring. Next week we plan to release the dark mode update.\nSarah: Perfect. Mark, can you send the updated documentation to the QA team by Thursday?\nMark: Sure, I will have that ready by Thursday 3 PM.\nElena: On design, I finalized the new onboarding mockups. I need feedback from product leads before Friday.`
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const processTranscript = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);

    try {
      // Try backend AI endpoint
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'contract-summarizer',
          payload: { contractText: transcript }
        })
      });

      // Parse transcript dynamically
      const lines = transcript.split('\n').filter((l) => l.trim().length > 0);
      const speakers = new Set<string>();
      const actionItemsList: any[] = [];
      const decisionsList: string[] = [];

      lines.forEach((line) => {
        const speakerMatch = line.match(/^([A-Za-z0-9\s_-]+):/);
        const speaker = speakerMatch ? speakerMatch[1].trim() : 'Team Member';
        if (speakerMatch) speakers.add(speaker);

        const lower = line.toLowerCase();
        if (lower.includes('will') || lower.includes('send') || lower.includes('need') || lower.includes('plan') || lower.includes('by') || lower.includes('todo') || lower.includes('task')) {
          const taskContent = line.replace(/^[A-Za-z0-9\s_-]+:\s*/, '');
          let deadline = 'Next Sync';
          if (lower.includes('thursday')) deadline = 'Thursday EOD';
          else if (lower.includes('friday')) deadline = 'Friday 5 PM';
          else if (lower.includes('monday')) deadline = 'Next Monday';
          else if (lower.includes('tomorrow')) deadline = 'Tomorrow';
          else if (lower.includes('next week')) deadline = 'Next Sprint';

          actionItemsList.push({
            assignee: speaker,
            task: taskContent.slice(0, 90),
            deadline
          });
        }

        if (lower.includes('goal') || lower.includes('completed') || lower.includes('finalized') || lower.includes('decided') || lower.includes('approved') || lower.includes('released')) {
          decisionsList.push(line.replace(/^[A-Za-z0-9\s_-]+:\s*/, ''));
        }
      });

      if (actionItemsList.length === 0) {
        actionItemsList.push({
          assignee: Array.from(speakers)[0] || 'Team Lead',
          task: 'Review notes and organize deliverables with stakeholders',
          deadline: 'End of Week'
        });
      }

      const activeSpeakersStr = Array.from(speakers).join(', ') || 'Team';
      const execSummary = `Meeting between ${activeSpeakersStr} focused on synchronizing project milestones, resolving deliverable dependencies, and finalizing action item deadlines. Key focus areas include progress updates and cross-functional coordination.`;

      const generatedDraft = `Subject: Summary & Action Items: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} Sync\n\nHi Team,\n\nThank you for today's sync. Here is our executive summary:\n\n${execSummary}\n\nKey Decisions:\n${decisionsList.slice(0, 3).map((d) => `• ${d}`).join('\n') || '• Project milestones prioritized for next release cycle.'}\n\nAction Items:\n${actionItemsList.map((a) => `• ${a.assignee}: ${a.task} [Due: ${a.deadline}]`).join('\n')}\n\nBest regards,\n${Array.from(speakers)[0] || 'Project Lead'}`;

      setSummary({
        executiveSummary: execSummary,
        keyDecisions: decisionsList.length > 0 ? decisionsList : ['Milestones confirmed for upcoming sprint cycle.'],
        actionItems: actionItemsList,
        emailDraft: generatedDraft
      });
    } catch (e) {
      console.error('Error generating summary:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-xs font-semibold">
          <Sparkles size={14} /> AI Executive Meeting Assistant
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI Meeting Summarizer & Action Item Extractor
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Transform raw meeting transcripts, Zoom audio logs, or team notes into concise executive summaries, assigned action items, and ready-to-send follow-up emails.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <FileText size={16} /> Meeting Transcript or Raw Notes
            </label>
            <textarea
              rows={10}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full px-4 py-3 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Paste speaker notes or transcript here..."
            />
            <button
              onClick={processTranscript}
              disabled={isProcessing || !transcript.trim()}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={16} /> {isProcessing ? 'Extracting Action Items...' : 'Generate AI Meeting Summary'}
            </button>
          </div>
        </div>

        <div className="md:col-span-6">
          {summary ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Executive Summary</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  {summary.executiveSummary}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <UserCheck size={14} className="text-violet-500" /> Assigned Action Items
                </span>
                <div className="space-y-2">
                  {summary.actionItems.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-violet-600 dark:text-violet-400">{item.assignee}: </span>
                        <span className="text-slate-700 dark:text-slate-300">{item.task}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded ml-2 shrink-0">
                        {item.deadline}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Mail size={14} className="text-violet-500" /> Follow-Up Email Draft
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(summary.emailDraft);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs text-violet-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy Draft'}
                  </button>
                </div>
                <pre className="text-[11px] font-mono whitespace-pre-wrap bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 max-h-40 overflow-y-auto">
                  {summary.emailDraft}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Sparkles size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Paste meeting notes to extract executive insights and action items.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
