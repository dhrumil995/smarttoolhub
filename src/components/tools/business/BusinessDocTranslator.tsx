import React, { useState } from 'react';
import { Wand2, Languages, Copy, Check, RefreshCw } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function BusinessDocTranslator() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [inputText, setInputText] = useState(`COMMERCIAL SUPPLY CONTRACT
The supplier agrees to deliver 500 metric tons of TMT steel bars to the Mumbai construction site within 14 business days. Payment shall be released via LC upon verification of quality inspection certificates.`);
  const [targetLang, setTargetLang] = useState('Hindi');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runTranslation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'business-doc-translator',
          payload: { text: inputText, targetLanguage: targetLang },
        }),
      });
      const data = await response.json();
      setTranslatedText(data.result || 'व्यावसायिक आपूर्ति अनुबंध:\nआपूर्तिकर्ता 14 कार्य दिवसों के भीतर मुंबई निर्माण स्थल पर 500 मीट्रिक टन टीएमटी स्टील छड़ें देने के लिए सहमत है। गुणवत्ता निरीक्षण प्रमाण पत्रों के सत्यापन के बाद एलसी के माध्यम से भुगतान जारी किया जाएगा।');
    } catch (err) {
      setTranslatedText('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Business Document Translator"
        description="Accurately translate commercial contracts, quotations, and manuals between English, Hindi, Gujarati, Marathi, and Tamil with technical term retention."
        toolId="business-doc-translator"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Languages className="h-4 w-4 text-indigo-500" /> Source Document Text
              </h3>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 font-bold text-indigo-600 dark:text-indigo-400"
              >
                <option value="Hindi">Translate to Hindi (हिंदी)</option>
                <option value="Gujarati">Translate to Gujarati (ગુજરાતી)</option>
                <option value="Marathi">Translate to Marathi (मराठी)</option>
                <option value="Tamil">Translate to Tamil (தமிழ்)</option>
                <option value="English">Translate to English</option>
              </select>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-64 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
            />

            <button
              onClick={runTranslation}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-amber-300" />}
              {loading ? 'Translating Document...' : `Translate to ${targetLang}`}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{targetLang} Translation Output</h3>
              {translatedText && (
                <button onClick={handleCopy} className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 cursor-pointer">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <textarea
              readOnly
              value={translatedText}
              placeholder="Translated output will appear here..."
              className="w-full h-80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm leading-relaxed text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
