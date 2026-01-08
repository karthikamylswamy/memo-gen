
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { CreditMemo } from '../types';

interface ChatInterfaceProps {
  memo: CreditMemo;
  onUpdateMemo: (update: Partial<CreditMemo>) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ memo, onUpdateMemo }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Institutional Underwriting Engine ready. I can assist with financial spreading, risk assessment, or memo drafting for this deal.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await geminiService.chatRefinement(input, messages, memo);
      
      if (response.updates) {
        onUpdateMemo(response.updates);
      }

      const assistantMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.text, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { id: 'err', role: 'system', content: 'Connection to TD Risk Node interrupted.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-2xl">
      <div className="p-4 border-b border-slate-100 bg-[#f8faf8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#00a100] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,161,0,0.5)]"></div>
          <span className="text-sm font-bold text-slate-700">TD Underwriting Assistant</span>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="text-[10px] text-slate-400 hover:text-slate-600 uppercase font-semibold"
        >
          Reset
        </button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8faf8]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : msg.role === 'assistant' 
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                  : 'bg-red-50 text-red-700 text-xs italic text-center w-full'
            }`}>
              {msg.content}
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#00a100] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#00a100] rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-[#00a100] rounded-full animate-bounce delay-200"></span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Underwriting...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Instruct the AI or ask deal questions..."
            rows={2}
            className="w-full resize-none rounded-xl border-slate-200 bg-slate-50 p-3 pr-12 text-sm focus:ring-2 focus:ring-[#008a00] outline-none"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="absolute right-3 bottom-3 p-1.5 bg-[#008a00] text-white rounded-lg hover:bg-[#007000] transition-colors disabled:bg-slate-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
