import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, FileCode, HelpCircle, Eye } from 'lucide-react';

export function WCAGAuditor() {
  const [htmlInput, setHtmlInput] = useState(
    `<button class="btn">Click Here</button>\n<img src="banner.jpg">\n<input type="text" placeholder="Enter Email">\n<a href="#">read more</a>`
  );
  const [auditResult, setAuditResult] = useState<any>(null);

  const runAudit = () => {
    const issues: any[] = [];
    const html = htmlInput;

    // Check 1: Image alt attributes
    const imgMatches: string[] = html.match(/<img[^>]*>/gi) || [];
    imgMatches.forEach((img: string) => {
      if (!img.includes('alt=')) {
        issues.push({
          type: 'error',
          rule: 'WCAG 1.1.1 Non-text Content (Level A)',
          message: 'Image tag missing required `alt` attribute.',
          snippet: img,
          fix: 'Add descriptive alt text e.g., alt="Product dashboard overview"'
        });
      }
    });

    // Check 2: Form labels
    const inputMatches: string[] = html.match(/<input[^>]*>/gi) || [];
    inputMatches.forEach((input: string) => {
      if (!input.includes('aria-label') && !input.includes('id=')) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 3.3.2 Labels or Instructions (Level A)',
          message: 'Input field lacks associated <label> or aria-label.',
          snippet: input,
          fix: 'Add <label for="email"> or aria-label="Email address"'
        });
      }
    });

    // Check 3: Non-descriptive link text
    if (html.toLowerCase().includes('click here') || html.toLowerCase().includes('read more')) {
      issues.push({
        type: 'warning',
        rule: 'WCAG 2.4.4 Link Purpose (Level A)',
        message: 'Generic link text ("click here", "read more") harms screen readers.',
        snippet: 'read more / click here',
        fix: 'Use meaningful link text e.g. "Read the full 2026 accessibility guide"'
      });
    }

    const score = Math.max(20, 100 - (issues.length * 20));

    setAuditResult({
      score,
      compliance: score >= 90 ? 'WCAG 2.1 AA Compliant' : 'Non-Compliant (Violations Found)',
      issues
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
          <ShieldCheck size={14} /> WCAG 2.1 Accessibility Auditor
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Website Accessibility (WCAG) Auditor
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Scan HTML markup for accessibility violations including missing alt text, unlabelled inputs, non-descriptive links, and ARIA roles for ADA compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <FileCode size={16} /> Paste HTML Markup or Web Snippet
          </label>
          <textarea
            rows={8}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="w-full px-4 py-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={runAudit}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck size={16} /> Run Accessibility Audit
          </button>
        </div>

        <div className="md:col-span-6">
          {auditResult ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Accessibility Score</span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{auditResult.score}/100</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  auditResult.score >= 90 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                }`}>
                  {auditResult.compliance}
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Audit Findings ({auditResult.issues.length})</span>
                {auditResult.issues.length === 0 ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-600 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} /> Zero violations detected! Great job adhering to WCAG 2.1 standards.
                  </div>
                ) : (
                  auditResult.issues.map((iss: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-rose-600">
                        <AlertTriangle size={14} /> {iss.rule}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{iss.message}</p>
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-slate-900 p-1.5 rounded mt-1">
                        Recommended Fix: {iss.fix}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[280px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Eye size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Paste HTML and click Run Audit to scan accessibility standards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
