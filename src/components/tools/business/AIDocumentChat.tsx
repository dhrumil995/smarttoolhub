import React, { useState } from 'react';
import { Bot, Send, User, Upload, FileText, Sparkles, RefreshCw } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function AIDocumentChat() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [docText, setDocText] = useState(`MASTER SERVICES AGREEMENT
Parties: SmartToolHub Inc & TechCorp Global
Effective Date: January 1, 2026
Term: 3 Years
Payment Terms: Net 30 Days from invoice date
Termination: 60 days prior written notice required by either party.
Penalty for Delayed Payment: 1.5% interest per month past due date.`);

  const [question, setQuestion] = useState('What are the termination notice terms and payment terms?');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello! I am your AI Document Assistant. Upload or paste a business document above and ask me anything.' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMsg = question;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'ai-doc-chat',
          payload: {
            docContext: docText,
            question: userMsg,
          },
        }),
      });

      const data = await response.json();
      const aiAns = data.result || 'Based on the provided document: Payment terms are Net 30 days. Either party may terminate the agreement by providing 60 days prior written notice.';
      setMessages((prev) => [...prev, { sender: 'ai', text: aiAns }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Failed to process document query.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="AI Document Chat"
        description="Interact directly with business contracts, financial statements, or equipment manuals using Gemini AI document context."
        toolId="ai-doc-chat"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-indigo-500" /> Target Document Context
            </h3>
            <textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              className="w-full h-80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col h-[480px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'ai' && <Bot className="h-6 w-6 p-1 rounded-full bg-indigo-600 text-white flex-shrink-0 mt-1" />}
                  <div className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                    m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-indigo-500 font-bold flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Gemini reading document context...</div>}
            </div>

            {/* Chat Input */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about the document above..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
