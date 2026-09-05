import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Scale, Clock } from 'lucide-react';
import { PageId } from '../types';
import SEOHead from '../components/SEOHead';

interface LegalPageProps {
  initialTab: 'privacy' | 'terms' | 'disclaimer';
}

export default function LegalPage({ initialTab }: LegalPageProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  // Sync state if user clicks legal links from the footer (prop change)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [
    { id: 'privacy' as const, label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms' as const, label: 'Terms & Conditions', icon: FileText },
    { id: 'disclaimer' as const, label: 'Legal Disclaimer', icon: Scale },
  ];

  const getPageMeta = () => {
    switch (activeTab) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          desc: 'Our commitment to data isolation. Learn why your private texts, passwords, and JSON inputs remain 100% locally contained.',
        };
      case 'terms':
        return {
          title: 'Terms of Conditions',
          desc: 'Read the usage guidelines, code licenses, and open-source terms of agreement for utilizing SmartToolHub.',
        };
      case 'disclaimer':
        return {
          title: 'Legal Disclaimer',
          desc: 'Limitations of liability regarding generated codes, color matching precision, and password entropy expectations.',
        };
    }
  };

  const meta = getPageMeta();

  return (
    <div className="space-y-8">
      <SEOHead title={meta.title} description={meta.desc} />

      {/* Hero Header */}
      <section className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
            {meta.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {meta.desc}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200/80 px-3.5 py-1.5 rounded-xl font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase shrink-0">
          <Clock size={12} className="text-blue-500" />
          Last Updated: July 2026
        </div>
      </section>

      {/* Tab Selector + Document Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand Navigation list */}
        <aside className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl border transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/20 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Right Hand Legal Documents viewer */}
        <main className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-6">
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-slate-950 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                1. Privacy Commitment: Absolute Browser Containment
              </h2>
              <p>
                At SmartToolHub, we maintain an uncompromising stance on data security and privacy. We believe that your input strings, credentials, files, and formatted data are your absolute, proprietary intellectual assets. Accordingly, SmartToolHub is engineered from the ground up to operate as a local-first platform: **no user input is ever uploaded, cached, or compiled on any remote server.** All processes run instantly in your browser context.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                2. What Data We Collect (And What We Do Not)
              </h3>
              <p className="font-semibold text-slate-750 dark:text-slate-200">
                A. Input & Configuration Streams (Never Collected):
              </p>
              <p>
                Whether you paste complex structures into the JSON Formatter, input sensitive tokens into the Base64 Converter, generate credentials in our Cryptographic Password Utility, or compile custom YouTube Tags, that data remains entirely isolated in your device's runtime memory (RAM).
              </p>
              <p className="font-semibold text-slate-750 dark:text-slate-200">
                B. Network Logging & Host Telemetry:
              </p>
              <p>
                Our infrastructure provider generates anonymous, standard technical connection logs to ensure platform uptime and handle load balancing. These logs capture generic variables (such as coarse IP prefixes, approximate geographical regions, browser user-agents, and static asset request paths). These logs are separated from the application layer and cannot access, reconstruct, or view any information entered inside our interactive components.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                3. Browser API Usage & Local States
              </h3>
              <p>
                SmartToolHub utilizes modern browser-native technologies to execute high-performance functions client-side. We explicitly document our use of these APIs below:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Web Cryptography API (window.crypto):</strong> Used exclusively to supply cryptographically strong random seeds for generating heavy-entropy passwords. This ensures secure client-side randomness that is mathematically unfeasible to predict.
                </li>
                <li>
                  <strong>Local Storage & Session Storage:</strong> Utilized for seamless preference persistence. This allows the application to remember state settings (like Dark Mode preferences, last selected niches, and active tabs) between page refreshes.
                </li>
                <li>
                  <strong>HTML5 Canvas API:</strong> Engaged locally to render dynamic elements such as QR Codes or graphics for direct download, bypassing the need for third-party image generation APIs.
                </li>
              </ul>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                4. Third-Party Integrations & External Asset Loading
              </h3>
              <p>
                To maintain dynamic performance, SmartToolHub interacts with the following external assets:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Google Fonts:</strong> Typography is loaded via secure Google Fonts servers. Your browser communicates directly with Google to fetch style layers, adhering to their standard asset delivery policies.
                </li>
                <li>
                  <strong>Lucide React Icons:</strong> Interface icons are compiled directly into the client-side build package, requiring no external network requests at runtime.
                </li>
                <li>
                  <strong>YouTube API & Asset Proxies:</strong> When retrieving public video thumbnails, image requests are directed straight to YouTube's public media servers (img.youtube.com). No middleman server processes or intercepts your request.
                </li>
              </ul>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                5. Data Retention, Volatility, and Manual Erasure
              </h3>
              <p>
                Because SmartToolHub operates entirely in browser memory, closing the active tab or browser window immediately flushes all volatile memory slots. If you wish to completely wipe persistent preferences, you can clear your browser's site cookies and local storage partition for this domain at any time.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                6. Changes to this Privacy Statement
              </h3>
              <p>
                We reserve the right to refine or update this Privacy Policy as browser standards and app capabilities change. Any modifications will be declared directly on this page with an updated "Last Updated" timestamp. By continuing to use the portal, you consent to our client-side runtime containment rules.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-slate-950 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                1. Acceptance of Terms & Structural Scope
              </h2>
              <p>
                By accessing, reading, or utilizing the web utilities, services, tools, and code repositories provided on the SmartToolHub portal, you enter into a binding legal agreement to be governed by these Terms & Conditions. If you disagree with any portion of these provisions, you must immediately terminate your session and discontinue use of our resources.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                2. Intended Audience & Acceptable Usage Parameters
              </h3>
              <p>
                SmartToolHub is provided free of charge as an open, public productivity suite for developers, designers, content creators, and students. You are granted a limited, non-exclusive, non-transferable, and revocable license to access our modules for personal or commercial projects.
              </p>
              <p>
                You explicitly agree to utilize our tools only for lawful purposes. You shall not use SmartToolHub to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Execute malicious scripting, automated bulk queries, or Denial of Service (DoS) attacks designed to degrade hosting infrastructure stability.
                </li>
                <li>
                  Decompile, replicate, or package our user interface designs into proprietary, commercial web properties with the intent to distribute keyloggers or malware.
                </li>
                <li>
                  Attempt to circumvent standard browser security sandboxes using experimental API injection sequences.
                </li>
              </ul>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                3. Open Source Code Licensing & MIT Integration
              </h3>
              <p>
                The underlying utility logical blocks (such as specific string-parsing handlers, mathematical generators, and conversion formulas) are distributed in accordance with permissive open-source paradigms (MIT License). While you are free to repurpose these utilities inside your personal projects, the cohesive branding, trademarks, original layouts, design frameworks, and "SmartToolHub" name remain the proprietary intellectual property of the SmartToolHub operators and cannot be copied without direct written consent.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                4. Ownership of User Outputs
              </h3>
              <p>
                All content, codes, designs, structured JSON arrays, passwords, or tags created inside SmartToolHub's interactive fields remain 100% your exclusive property. SmartToolHub asserts no copyright, licensing claims, or ownership stakes over the files and data you process.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                5. Platform Modifications, Deprecation, and Termination
              </h3>
              <p>
                We reserve the unilateral right to expand, modify, patch, restrict, or entirely deprecate any utility module, sub-page, or feature at any time without prior notification. We are not liable to you or any third party for any service disruptions or modification of the platform architecture.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                6. Governing Law & Jurisdiction
              </h3>
              <p>
                These Terms of Conditions and any related legal disputes shall be governed by, interpreted, and construed in accordance with standard international software agreements, without regard to conflict of law principles.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-slate-950 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                1. "As-Is" Operational Status & Absolute Warranty Disclaimer
              </h2>
              <p>
                SmartToolHub is maintained as a free, open utility portal strictly for informational, educational, and developer helper convenience. The portal is offered on an "As-Is" and "As-Available" basis. The platform contributors make no warranties—express, implied, statutory, or otherwise—regarding the absolute accuracy, error-free execution, formatting stability, or complete security of the generated elements.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                2. Limitation of Financial and Operational Liability
              </h3>
              <p>
                To the maximum extent permitted by applicable laws, in no event shall SmartToolHub, its developers, associates, or service providers be liable for any indirect, incidental, punitive, special, exemplary, or consequential damages whatsoever, including but not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Loss of business files, database corruptions, or formatting discrepancies resulting from conversions made inside our JSON Formatter or Base64 components.
                </li>
                <li>
                  System breaches, cryptographic failure, or account compromises arising from passwords generated with our custom password generator.
                </li>
                <li>
                  Financial losses, promotional miscalculations, or business strategy mistakes driven by CPM forecasts generated in the YouTube Earnings Calculator.
                </li>
                <li>
                  Inaccuracies in metadata or YouTube search listings resulting from our YouTube Title and Tags generators.
                </li>
              </ul>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                3. Cryptographic Security & Password Generators
              </h3>
              <p>
                While our Password Generator uses high-quality cryptographic pseudorandom number generators, the overall strength of any generated password depends entirely on the criteria selected by the user (length, symbols, digits, lowercase/uppercase combinations). We do not guarantee that generated keys are impenetrable to advanced dictionary or brute-force attacks over time. Complete security responsibility remains with the user and their credential manager.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                4. Third-Party Links & Off-Site Resources
              </h3>
              <p>
                Our tools may display link directions or reference material pointing to third-party domains (such as Unsplash, YouTube, GitHub, or developer documentation portals). We assert zero operational control over these independent domains and accept no responsibility for their site terms, privacy practices, or accuracy.
              </p>

              <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                5. Indemnification Clause
              </h3>
              <p>
                By using SmartToolHub, you agree to indemnify, defend, and hold harmless SmartToolHub's developers, maintainers, and operational partners from and against any and all claims, liabilities, costs, losses, or legal expenses (including attorney fees) arising from your misuse of the tools or violation of these terms.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
