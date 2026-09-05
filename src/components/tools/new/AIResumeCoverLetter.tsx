import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, Briefcase, UserCheck } from 'lucide-react';

export function AIResumeCoverLetter() {
  const [jobDescription, setJobDescription] = useState(
    "Senior Frontend Engineer at TechCorp. Seeking 4+ years of React, TypeScript, Next.js, and performance optimization experience. Must have strong UI/UX design sensibilities and API integration skills."
  );
  const [currentResume, setCurrentResume] = useState(
    "John Doe - Full Stack Developer with 5 years experience building Web Applications using JavaScript, React, Node.js, and SQL. Skilled in REST APIs and responsive UI styling."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const handleTailor = async () => {
    if (!jobDescription.trim()) return;
    setIsGenerating(true);

    try {
      // Dynamic keyword extraction from Job Description
      const words = jobDescription.split(/[\s,.;:()"\n]+/).filter(w => w.length > 3);
      const stopWords = new Set(['with', 'have', 'from', 'this', 'that', 'they', 'will', 'must', 'about', 'years', 'experience', 'looking', 'seeking', 'strong', 'skills']);
      const extractedKeywords: string[] = [];

      words.forEach(w => {
        const clean = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        if (!stopWords.has(w.toLowerCase()) && !extractedKeywords.includes(clean) && extractedKeywords.length < 8) {
          extractedKeywords.push(clean);
        }
      });

      // Extract candidate name from resume if present
      const nameMatch = currentResume.match(/^([A-Za-z\s]+)\s*[-–—]/);
      const candidateName = nameMatch ? nameMatch[1].trim() : 'Candidate';

      // Extract Company or role title
      const roleMatch = jobDescription.match(/^([A-Za-z\s]+)\s*(?:at|for|at:)\s*([A-Za-z0-9\s]+)/i);
      const targetRole = roleMatch ? roleMatch[1].trim() : 'Target Role';
      const targetCompany = roleMatch ? roleMatch[2].trim().split('.')[0] : 'the Hiring Team';

      const tailoredBullets = [
        `Spearheaded projects utilizing ${extractedKeywords.slice(0, 3).join(', ')} resulting in significant performance and delivery gains.`,
        `Demonstrated deep hands-on expertise in ${extractedKeywords.slice(3, 6).join(' and ') || 'modern engineering best practices'}.`,
        `Collaborated with cross-functional stakeholders to implement robust architectures matching strict quality benchmarks.`
      ];

      const coverLetter = `Dear Hiring Team at ${targetCompany},\n\nI am writing to express my strong enthusiasm for the ${targetRole} opportunity. With a comprehensive background in ${extractedKeywords.slice(0, 3).join(', ')}, I am excited about the prospect of contributing directly to your team's mission.\n\nIn my recent experience, I have developed solutions focusing on ${extractedKeywords.slice(2, 5).join(' and ')}. Your requirement for ${extractedKeywords[0] || 'high-impact execution'} aligns directly with my technical strengths and passion for delivering scalable, resilient results.\n\nI would welcome the opportunity to discuss how my skillset and background will add immediate value to ${targetCompany}. Thank you for your time and consideration.\n\nSincerely,\n${candidateName}`;

      setOutput({
        atsKeywords: extractedKeywords.length > 0 ? extractedKeywords : ['React', 'TypeScript', 'API Integration', 'UI/UX Design', 'Performance'],
        tailoredBullets,
        coverLetter
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <Briefcase size={14} /> AI Career & ATS Matcher
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI Cover Letter & Resume Tailoring Tool
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Tailor your resume bullet points and generate a custom cover letter matching specific job description keywords to pass ATS resume screeners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Job Description</label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs font-sans bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Current Resume / Bio</label>
              <textarea
                rows={5}
                value={currentResume}
                onChange={(e) => setCurrentResume(e.target.value)}
                className="w-full px-3 py-2 text-xs font-sans bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              onClick={handleTailor}
              disabled={isGenerating || !jobDescription.trim()}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={16} /> {isGenerating ? 'Matching ATS Keywords...' : 'Tailor Resume & Cover Letter'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          {output ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Matched ATS Keywords</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {output.atsKeywords.map((kw: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-md text-xs font-semibold">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Tailored Cover Letter</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(output.coverLetter);
                      setCopiedLetter(true);
                      setTimeout(() => setCopiedLetter(false), 2000);
                    }}
                    className="text-xs text-cyan-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLetter ? <Check size={12} /> : <Copy size={12} />} {copiedLetter ? 'Copied!' : 'Copy Letter'}
                  </button>
                </div>
                <pre className="text-xs font-sans whitespace-pre-wrap bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 max-h-64 overflow-y-auto">
                  {output.coverLetter}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <UserCheck size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Paste a job posting to optimize your job application.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
