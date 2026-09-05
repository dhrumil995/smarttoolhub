import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Code2, Sparkles, ArrowRight } from 'lucide-react';

export const JSONToTypeScript: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(`{
  "id": 101,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "isSubscriber": true,
  "tags": ["developer", "creator"],
  "profile": {
    "avatar": "https://example.com/avatar.png",
    "score": 98.5
  }
}`);

  const [outputType, setOutputType] = useState<'ts' | 'zod' | 'go'>('ts');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateOutput = (): string => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonInput);

      if (outputType === 'ts') {
        return parseToTypeScript(parsed, 'RootObject');
      } else if (outputType === 'zod') {
        return parseToZod(parsed, 'RootSchema');
      } else {
        return parseToGo(parsed, 'RootStruct');
      }
    } catch (err: any) {
      setError('Invalid JSON syntax: ' + err.message);
      return '';
    }
  };

  const parseToTypeScript = (obj: any, interfaceName: string): string => {
    let result = `export interface ${interfaceName} {\n`;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const type = getTypeScriptType(val);
      result += `  ${key}: ${type};\n`;
    }
    result += `}`;
    return result;
  };

  const getTypeScriptType = (val: any): string => {
    if (val === null) return 'any';
    if (Array.isArray(val)) {
      if (val.length === 0) return 'any[]';
      return `${getTypeScriptType(val[0])}[]`;
    }
    if (typeof val === 'object') {
      return 'Record<string, any>';
    }
    return typeof val;
  };

  const parseToZod = (obj: any, schemaName: string): string => {
    let result = `import { z } from 'zod';\n\nexport const ${schemaName} = z.object({\n`;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      result += `  ${key}: ${getZodType(val)},\n`;
    }
    result += `});\n\nexport type ${schemaName}Type = z.infer<typeof ${schemaName}>;`;
    return result;
  };

  const getZodType = (val: any): string => {
    if (val === null) return 'z.nullable(z.any())';
    if (Array.isArray(val)) {
      if (val.length === 0) return 'z.array(z.any())';
      return `z.array(${getZodType(val[0])})`;
    }
    if (typeof val === 'number') return 'z.number()';
    if (typeof val === 'boolean') return 'z.boolean()';
    if (typeof val === 'string') return 'z.string()';
    if (typeof val === 'object') return 'z.record(z.any())';
    return 'z.any()';
  };

  const parseToGo = (obj: any, structName: string): string => {
    let result = `type ${structName} struct {\n`;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const PascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      const goType = getGoType(val);
      result += `\t${PascalKey} ${goType} \`json:"${key}"\`\n`;
    }
    result += `}`;
    return result;
  };

  const getGoType = (val: any): string => {
    if (val === null) return 'interface{}';
    if (Array.isArray(val)) return '[]interface{}';
    if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float64';
    if (typeof val === 'boolean') return 'bool';
    if (typeof val === 'string') return 'string';
    if (typeof val === 'object') return 'map[string]interface{}';
    return 'interface{}';
  };

  const handleCopy = () => {
    const output = generateOutput();
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: JSON Input */}
        <div className="space-y-3 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 size={16} className="text-blue-500" />
              Raw JSON Input
            </h2>
            <button
              onClick={() => {
                setJsonInput('{\n  "status": "success",\n  "code": 200\n}');
                setError(null);
              }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              Load Sample
            </button>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON payload here..."
            className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Output Target Types */}
        <div className="space-y-3 bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setOutputType('ts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    outputType === 'ts' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => setOutputType('zod')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    outputType === 'zod' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Zod Schema
                </button>
                <button
                  onClick={() => setOutputType('go')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    outputType === 'go' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Go Struct
                </button>
              </div>

              <button
                onClick={handleCopy}
                disabled={!!error}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <pre className="h-72 font-mono text-xs text-emerald-400 overflow-auto p-2 leading-relaxed bg-slate-950 rounded-xl border border-slate-800">
              {generateOutput() || '// Fix JSON errors above to generate schema'}
            </pre>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Client-side local conversion</span>
            <span className="text-emerald-400 font-bold">100% Type-Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
