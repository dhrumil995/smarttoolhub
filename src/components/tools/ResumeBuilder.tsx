import React, { useState } from 'react';
import { 
  UserCheck, Briefcase, GraduationCap, Code2, Printer, Copy, 
  Download, Plus, Trash2, RefreshCw, Check, Sparkles, Layout, Mail, Phone, MapPin, Globe
} from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  bullets: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export function ResumeBuilder() {
  const [template, setTemplate] = useState<'modern' | 'executive'>('modern');

  // Contact Info
  const [fullName, setFullName] = useState('Alex Sterling');
  const [title, setTitle] = useState('Senior Full Stack Engineer & Tech Lead');
  const [email, setEmail] = useState('alex.sterling@example.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('github.com/alexsterling');

  // Summary
  const [summary, setSummary] = useState(
    'Versatile Senior Software Engineer with 7+ years of experience designing scalable React, TypeScript, and Node.js microservices. Proven track record of boosting application speed by 40% and leading cross-functional teams.'
  );

  // Work Experience
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'Apex Cloud Systems',
      role: 'Staff Frontend Engineer',
      period: '2023 - Present',
      bullets: '• Spearheaded frontend architecture for enterprise analytics dashboard serving 120k+ daily users.\n• Reduced web app bundle size by 35% using code splitting and lazy component hydration.\n• Mentored 5 junior engineers and established automated CI/CD code quality pipelines.'
    },
    {
      id: '2',
      company: 'Vanguard Digital Agency',
      role: 'Full Stack Web Developer',
      period: '2020 - 2023',
      bullets: '• Developed 15+ custom web applications with React, Express, and PostgreSQL.\n• Integrated Stripe payment gateways and OAuth2 authentication pipelines.\n• Collaborated closely with UX designers to achieve 100% WCAG AA accessibility compliance.'
    }
  ]);

  // Education
  const [educationList, setEducationList] = useState<Education[]>([
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      year: '2016 - 2020'
    }
  ]);

  // Skills
  const [skills, setSkills] = useState('React.js, TypeScript, Node.js, Express, Tailwind CSS, PostgreSQL, GraphQL, Docker, AWS, Git, Webpack, Vite');

  const [copied, setCopied] = useState(false);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { id: Date.now().toString(), company: 'Company Name', role: 'Role Title', period: '2022 - Present', bullets: '• Accomplishment key deliverable' }
    ]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExperience = (id: string) => {
    if (experiences.length <= 1) return;
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const addEducation = () => {
    setEducationList([
      ...educationList,
      { id: Date.now().toString(), school: 'University Name', degree: 'Degree Name', year: '2020 - 2024' }
    ]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducationList(educationList.map(ed => ed.id === id ? { ...ed, [field]: value } : ed));
  };

  const removeEducation = (id: string) => {
    if (educationList.length <= 1) return;
    setEducationList(educationList.filter(ed => ed.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `${fullName} - ${title}
Contact: ${email} | ${phone} | ${location} | ${website}

PROFESSIONAL SUMMARY
${summary}

WORK EXPERIENCE
${experiences.map(e => `${e.role} at ${e.company} (${e.period})\n${e.bullets}`).join('\n\n')}

EDUCATION
${educationList.map(ed => `${ed.degree} - ${ed.school} (${ed.year})`).join('\n')}

TECHNICAL SKILLS
${skills}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto print:max-w-none print:p-0">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6 print:hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
            <UserCheck size={12} className="text-emerald-500" />
            ATS-Compliant Resume & CV Builder
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Resume & ATS CV Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Build clean, recruiter-approved ATS resumes with live side-by-side preview and instant print/PDF export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        {/* Left Column: Form Controls (Hidden on Print) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <UserCheck size={16} className="text-emerald-500" />
              1. Personal & Contact Details
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Professional Headline / Title"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Portfolio / LinkedIn URL"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">2. Professional Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs leading-relaxed resize-none"
              />
            </div>

            {/* Experience Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">3. Work Experience</label>
                <button onClick={addExperience} className="text-xs font-bold text-emerald-600 flex items-center gap-1 cursor-pointer">
                  <Plus size={12} /> Add Role
                </button>
              </div>

              {experiences.map((exp) => (
                <div key={exp.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      placeholder="Role Title"
                      className="font-bold bg-transparent focus:outline-none w-3/4"
                    />
                    <button onClick={() => removeExperience(exp.id)} className="text-slate-400 hover:text-red-500 cursor-pointer">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company"
                    className="w-full bg-transparent text-slate-600 dark:text-slate-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                    placeholder="Period e.g., 2021 - Present"
                    className="w-full bg-transparent text-slate-400 font-mono text-[10px] focus:outline-none"
                  />
                  <textarea
                    value={exp.bullets}
                    onChange={(e) => updateExperience(exp.id, 'bullets', e.target.value)}
                    rows={3}
                    placeholder="Bullet points..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2 text-[11px] resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">4. Technical & Core Skills</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Resume Document Preview */}
        <div className="lg:col-span-7 print:w-full">
          <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-xl space-y-6 font-sans print:border-none print:shadow-none print:p-0">
            {/* Header / Name */}
            <div className="border-b-2 border-slate-900 pb-4 space-y-1.5">
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                {fullName}
              </h1>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                {title}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 pt-2 font-mono">
                {email && <span>{email}</span>}
                {phone && <span>• {phone}</span>}
                {location && <span>• {location}</span>}
                {website && <span>• {website}</span>}
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                  Professional Summary
                </h2>
                <p className="text-xs leading-relaxed text-slate-700">
                  {summary}
                </p>
              </div>
            )}

            {/* Experience */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                Work Experience
              </h2>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-xs text-slate-900">{exp.role} <span className="font-normal text-slate-600">@ {exp.company}</span></h3>
                      <span className="font-mono text-[10px] text-slate-500">{exp.period}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                      {exp.bullets}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                Education
              </h2>

              <div className="space-y-1.5">
                {educationList.map((ed) => (
                  <div key={ed.id} className="flex justify-between items-baseline text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{ed.degree}</span>
                      <span className="text-slate-600"> — {ed.school}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{ed.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            {skills && (
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                  Technical Skills & Competencies
                </h2>
                <p className="text-xs leading-relaxed text-slate-700">
                  {skills}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
