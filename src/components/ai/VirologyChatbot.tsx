import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  ExternalLink,
  RotateCcw,
  Copy,
  Check,
  Search,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  searchQueries?: string[];
  groundingSources?: Array<{ title: string; uri: string }>;
}

const INITIAL_SUGGESTIONS = [
  'Bagaimana serabut ekor mengenali reseptor OmpC pada bakteri?',
  'Kapan profag lisogenik beralih menjadi siklus litik?',
  'Bagaimana perkembangan terapi bakteriofag untuk bakteri resisten antibiotik?',
  'Mengapa antibiotik tidak mempan melawan virus influenza atau bakteriofag?',
  'Apa perbedaan mendasar antara bakteriofag T4 dan virus SARS-CoV-2?',
];

export const VirologyChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Halo! Saya **Dr. Vira**, AI Tutor Virologi & Biosains VIRUSNESIA. 🦠🔬

Saya siap membantumu memahami materi replikasi virus kelas X SMA, membedakan siklus litik dan lisogenik, membedah struktur bakteriofag T4, hingga menjawab pertanyaan terkini seputar riset terapi bakteriofag berbasis penelusuran ilmiah Google Search!

Apa yang ingin kamu diskusikan hari ini?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const historyForApi = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          userMessage: query,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: Gagal memproses pertanyaan.`);
      }

      const data = await response.json();

      const aiResponse: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Maaf, saya tidak menerima tanggapan.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        searchQueries: data.searchQueries || [],
        groundingSources: data.groundingSources || [],
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Terjadi kendala koneksi**: ${err.message || 'Gagal menghubungi server Gemini AI.'}\n\nSilakan pastikan koneksi internet stabil dan coba kembali.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Riwayat percakapan telah dibersihkan. Silakan ajukan pertanyaan virologi baru!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Simple Markdown renderer for bold, lists, and headings
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-heading font-bold text-sm text-blue-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Heading 2
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-heading font-extrabold text-base text-slate-900 mt-2.5 mb-1.5 border-b border-slate-200 pb-0.5">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 my-0.5">
            {parseInlineMarkup(bulletText)}
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs sm:text-sm text-slate-700 my-0.5">
            {parseInlineMarkup(line.trim().replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      // Standard paragraph
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-1">
          {parseInlineMarkup(line)}
        </p>
      );
    });
  };

  const parseInlineMarkup = (text: string) => {
    // Replace **bold**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Replace *italic*
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[680px] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Chatbot Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Bot className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-sm sm:text-base tracking-tight text-white">
                Dr. Vira — AI Tutor Virologi & Biosains
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <Globe className="w-2.5 h-2.5" /> Google Search Grounded
              </span>
            </div>
            <p className="text-xs text-blue-100 flex items-center gap-1.5">
              <span>Model: gemini-3.8-flash</span>
              <span className="text-blue-300">•</span>
              <span>Pendekatan Mindful, Meaningful, Joyful</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearHistory}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
          title="Bersihkan Percakapan"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>

      {/* Suggestion Chips Bar */}
      <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="shrink-0 text-blue-900 font-bold flex items-center gap-1 text-[11px]">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Topik Populer:
        </span>
        {INITIAL_SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(sug)}
            disabled={isLoading}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white text-slate-700 border border-blue-200/80 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-[11px] font-medium shadow-2xs cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-blue-700 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-200" />}
              </div>

              {/* Message Bubble Card */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-2xs border ${
                  isUser
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-white text-slate-800 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span
                    className={`text-[11px] font-bold ${
                      isUser ? 'text-blue-100' : 'text-blue-700'
                    }`}
                  >
                    {isUser ? 'Anda' : 'Dr. Vira (AI Tutor)'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                      {message.timestamp}
                    </span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopy(message.id, message.text)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Salin Pesan"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className={isUser ? 'text-xs sm:text-sm text-white leading-relaxed' : ''}>
                  {isUser ? message.text : renderFormattedText(message.text)}
                </div>

                {/* Google Search Grounding Sources Drawer */}
                {!isUser && message.groundingSources && message.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                      <Search className="w-3 h-3 text-blue-600" /> Sumber Penelusuran Ilmiah Terkait:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {message.groundingSources.slice(0, 4).map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-medium border border-blue-200/60 transition-colors"
                        >
                          <span className="truncate max-w-[200px]">{source.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0 text-blue-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-700 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4 text-cyan-200" />
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs max-w-sm flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Dr. Vira sedang merangkai fakta & menelusuri data...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200/90 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tanyakan apa saja tentang struktur virus, siklus litik & lisogenik, atau riset terapi fag..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm text-slate-900 transition-all placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </form>
    </div>
  );
};
