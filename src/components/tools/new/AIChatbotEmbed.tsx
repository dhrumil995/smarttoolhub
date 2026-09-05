import React, { useState } from 'react';
import { Bot, MessageSquare, Code, Copy, Check, Send, Sparkles } from 'lucide-react';

export function AIChatbotEmbed() {
  const [botName, setBotName] = useState('SmartAssistant');
  const [greeting, setGreeting] = useState('Hello! How can I help you with SmartToolHub today?');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [faqKnowledge, setFaqKnowledge] = useState(
    "Q: What is SmartToolHub?\nA: SmartToolHub is a free web app suite providing 100+ SEO, developer, and marketing tools.\nQ: Is it free?\nA: Yes, 100% free with no registration."
  );

  const [messages, setMessages] = useState<any[]>([
    { sender: 'bot', text: greeting }
  ]);
  const [userInput, setUserInput] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleSend = () => {
    if (!userInput.trim()) return;
    const currentInput = userInput.trim();
    const newMsgs = [...messages, { sender: 'user', text: currentInput }];
    setMessages(newMsgs);
    setUserInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      // Find matching FAQ
      const faqLines = faqKnowledge.split('\n');
      let matchedAnswer: string | null = null;

      const inputTokens = currentInput.toLowerCase().split(/\s+/).filter(t => t.length > 2);

      for (let i = 0; i < faqLines.length; i++) {
        const line = faqLines[i];
        if (line.toLowerCase().startsWith('q:')) {
          const matchScore = inputTokens.filter(token => line.toLowerCase().includes(token)).length;
          if (matchScore > 0 && faqLines[i + 1] && faqLines[i + 1].toLowerCase().startsWith('a:')) {
            matchedAnswer = faqLines[i + 1].replace(/^A:\s*/i, '');
            break;
          }
        }
      }

      const reply = matchedAnswer || `Great question regarding "${currentInput}". According to our knowledge base: SmartToolHub provides high-performance web utilities with zero latency. Feel free to ask about any specific tool or feature!`;

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsBotTyping(false);
    }, 500);
  };

  const embedCode = `<script>
  window.SmartBotConfig = {
    botName: "${botName}",
    greeting: "${greeting}",
    brandColor: "${brandColor}"
  };
</script>
<script src="https://smarttoolhub.net/widget.js" async></script>`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
          <Bot size={14} /> Embeddable Q&A Chatbot Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI Q&A Chatbot (Website Embed)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Train an AI customer support widget on your website content or FAQ list, test live interactions, and grab an embeddable script for your site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Bot Customization</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bot Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Welcome Greeting</label>
              <input
                type="text"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">FAQ Knowledge Base</label>
              <textarea
                rows={4}
                value={faqKnowledge}
                onChange={(e) => setFaqKnowledge(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Code size={14} /> Embed Script
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    setCopiedSnippet(true);
                    setTimeout(() => setCopiedSnippet(false), 2000);
                  }}
                  className="text-xs text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet ? <Check size={12} /> : <Copy size={12} />} {copiedSnippet ? 'Copied Code' : 'Copy Script'}
                </button>
              </div>
              <pre className="text-[10px] font-mono bg-slate-950 text-indigo-300 p-3 rounded-xl overflow-x-auto">
                {embedCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Live Chatbot Preview Widget */}
        <div className="lg:col-span-6 bg-slate-100 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-end min-h-[420px]">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[380px]">
            {/* Header */}
            <div style={{ backgroundColor: brandColor }} className="p-3.5 text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{botName}</h4>
                <p className="text-[10px] opacity-80">AI Support Agent • Online</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2.5 rounded-xl ${
                    msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none"
              />
              <button
                onClick={handleSend}
                style={{ backgroundColor: brandColor }}
                className="p-2 text-white rounded-xl cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
