import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Terminal, Code } from 'lucide-react';

export const CurlConverter: React.FC = () => {
  const [curlInput, setCurlInput] = useState<string>(
    `curl -X POST https://api.example.com/v1/users \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer SECRET_TOKEN_123" \\\n  -d '{"name": "Alice", "role": "admin"}'`
  );

  const [targetLang, setTargetLang] = useState<'fetch' | 'python' | 'axios' | 'go'>('fetch');
  const [copied, setCopied] = useState<boolean>(false);

  const parseCurl = () => {
    let url = 'https://api.example.com/endpoint';
    let method = 'GET';
    const headers: { [key: string]: string } = {};
    let data = '';

    const urlMatch = curlInput.match(/curl\s+(?:-X\s+[A-Z]+\s+)?['"]?(https?:\/\/[^\s'"]+)['"]?/i);
    if (urlMatch) url = urlMatch[1];

    const methodMatch = curlInput.match(/-X\s+([A-Z]+)/i);
    if (methodMatch) method = methodMatch[1].toUpperCase();

    const headerMatches = curlInput.matchAll(/-H\s+['"]([^'"]+)['"]/gi);
    for (const match of headerMatches) {
      const parts = match[1].split(':');
      if (parts.length >= 2) {
        headers[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    }

    const dataMatch = curlInput.match(/(?:-d|--data(?:-raw)?)\s+['"]([^'"]+)['"]/i);
    if (dataMatch) {
      data = dataMatch[1];
      if (method === 'GET') method = 'POST';
    }

    return { url, method, headers, data };
  };

  const generateCode = () => {
    const { url, method, headers, data } = parseCurl();

    if (targetLang === 'fetch') {
      return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 4)},
  ${data ? `body: JSON.stringify(${data})` : ''}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
    }

    if (targetLang === 'python') {
      return `import requests

url = "${url}"
headers = ${JSON.stringify(headers, null, 4)}
${data ? `data = ${data}` : ''}

response = requests.${method.toLowerCase()}(url, headers=headers${data ? ', json=data' : ''})
print(response.json())`;
    }

    if (targetLang === 'axios') {
      return `import axios from 'axios';

axios({
  method: '${method.toLowerCase()}',
  url: '${url}',
  headers: ${JSON.stringify(headers, null, 4)},
  ${data ? `data: ${data}` : ''}
})
.then(response => console.log(response.data))
.catch(error => console.error(error));`;
    }

    return `package main

import (
	"fmt"
	"net/http"
	"io"
	${data ? '"strings"' : ''}
)

func main() {
	url := "${url}"
	${data ? `payload := strings.NewReader(\`${data}\`)` : ''}
	req, _ := http.NewRequest("${method}", url, ${data ? 'payload' : 'nil'})

${Object.entries(headers)
  .map(([k, v]) => `\treq.Header.Add("${k}", "${v}")`)
  .join('\n')}

	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	fmt.Println(string(body))
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal size={18} className="text-blue-500" />
              Terminal cURL Command
            </h2>
            <button
              onClick={() => {
                setCurlInput(`curl -X GET https://api.github.com/users/octocat -H "User-Agent: MyApp"`);
              }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              GET Example
            </button>
          </div>

          <textarea
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            placeholder="curl -X POST https://api.example.com..."
            className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Output */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTargetLang('fetch')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    targetLang === 'fetch' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  JS fetch()
                </button>
                <button
                  onClick={() => setTargetLang('python')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    targetLang === 'python' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setTargetLang('axios')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    targetLang === 'axios' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Axios
                </button>
                <button
                  onClick={() => setTargetLang('go')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    targetLang === 'go' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Go
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="h-72 font-mono text-xs text-emerald-400 overflow-auto p-2 leading-relaxed bg-slate-950 rounded-xl border border-slate-800">
              {generateCode()}
            </pre>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Instant client-side syntax translation
          </div>
        </div>
      </div>
    </div>
  );
};
