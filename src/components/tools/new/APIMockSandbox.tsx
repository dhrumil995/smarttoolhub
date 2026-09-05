import React, { useState } from 'react';
import { Server, Code, Copy, Check, Play, RefreshCw, Send } from 'lucide-react';

export function APIMockSandbox() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpoint, setEndpoint] = useState('/api/v1/users');
  const [statusCode, setStatusCode] = useState<number>(200);
  const [responseJson, setResponseJson] = useState(`[
  { "id": "usr_9012", "name": "Sarah Connor", "email": "sarah@example.com", "role": "admin" },
  { "id": "usr_9013", "name": "John Doe", "email": "john@example.com", "role": "member" }
]`);

  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const fetchSnippet = `fetch('https://api.smarttoolhub.net/mock${endpoint}', {
  method: '${method}',
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => res.json())
  .then(data => console.log(data));`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
          <Server size={14} /> Mock REST API Sandbox
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          API Response Mocking & Testing Sandbox
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Design REST API endpoints, define request/response schemas, set status codes, and test mock JSON payloads for frontend development.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Endpoint Definition</h2>

          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Response HTTP Status Code</label>
              <div className="grid grid-cols-4 gap-2">
                {[200, 201, 400, 404].map((code) => (
                  <button
                    key={code}
                    onClick={() => setStatusCode(code)}
                    className={`py-1.5 rounded-xl text-xs font-mono font-bold border ${
                      statusCode === code ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mock JSON Payload</label>
              <textarea
                rows={8}
                value={responseJson}
                onChange={(e) => setResponseJson(e.target.value)}
                className="w-full px-3 py-2 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Code Snippet & Live Response Inspector */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">JavaScript Fetch Snippet</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(fetchSnippet);
                setCopiedSnippet(true);
                setTimeout(() => setCopiedSnippet(false), 2000);
              }}
              className="text-xs text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copiedSnippet ? <Check size={12} /> : <Copy size={12} />} {copiedSnippet ? 'Copied' : 'Copy Fetch'}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 text-indigo-300 p-4 rounded-xl overflow-x-auto">
            {fetchSnippet}
          </pre>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Simulated Inspector Output</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                statusCode < 300 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
              }`}>
                HTTP {statusCode}
              </span>
            </div>
            <pre className="text-xs font-mono bg-slate-950 text-emerald-400 p-4 rounded-xl overflow-x-auto max-h-56">
              {responseJson}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
