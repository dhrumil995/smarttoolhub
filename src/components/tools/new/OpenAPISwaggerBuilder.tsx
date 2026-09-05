import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Plus, Trash2 } from 'lucide-react';

export function OpenAPISwaggerBuilder() {
  const [title, setTitle] = useState('SmartToolHub Core API');
  const [version, setVersion] = useState('1.0.0');
  const [baseUrl, setBaseUrl] = useState('https://api.smarttoolhub.net/v1');

  const [paths, setPaths] = useState<Array<{ path: string; method: string; summary: string }>>([
    { path: '/tools', method: 'get', summary: 'List all available SEO tools' },
    { path: '/tools/{id}', method: 'get', summary: 'Retrieve specific tool details' },
    { path: '/generate', method: 'post', summary: 'Execute AI generation request' },
  ]);

  const [copied, setCopied] = useState(false);

  const getSpecYaml = () => {
    let yaml = `openapi: 3.0.3
info:
  title: "${title}"
  version: "${version}"
  description: "Automated OpenAPI Specification"
servers:
  - url: "${baseUrl}"
paths:\n`;

    paths.forEach((p) => {
      yaml += `  ${p.path}:\n`;
      yaml += `    ${p.method.toLowerCase()}:\n`;
      yaml += `      summary: "${p.summary}"\n`;
      yaml += `      responses:\n`;
      yaml += `        '200':\n`;
      yaml += `          description: Successful operation\n`;
    });

    return yaml;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold">
          <FileCode size={14} /> OpenAPI 3.0 & Swagger Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          OpenAPI / Swagger Specification Builder
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Visual builder to design OpenAPI 3.0 specifications. Define REST paths, HTTP methods, summaries, and export clean Swagger YAML.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">API Metadata</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">API Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Server Base URL</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Swagger YAML Output</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getSpecYaml());
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-amber-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied YAML' : 'Copy Spec'}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 text-amber-300 p-4 rounded-xl overflow-x-auto min-h-[300px]">
            {getSpecYaml()}
          </pre>
        </div>
      </div>
    </div>
  );
}
