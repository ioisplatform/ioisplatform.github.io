import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, KnowledgeItem } from '../types';
import { 
  fetchKnowledgeFromFirestore,
  subscribeToFirestoreKnowledge,
  syncUnansweredToFirestore,
  INITIAL_KNOWLEDGE
} from '../services/userService';
import { 
  Sparkles, 
  Send, 
  X, 
  RotateCcw, 
  Bot, 
  User, 
  MessageSquareText, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  Globe
} from 'lucide-react';

interface AIChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({ isOpen, onClose, initialQuery }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `नमस्ते! 🙏 मैं **IOIS Smart AI Helpline & Guide Assistant** हूँ।\n\nमैं आपको नए रजिस्ट्रेशन, 15-सवाल कौशल साक्षात्कार, 7 डिजिटल प्लांस (Plan 01 से Plan 07), इंस्टेंट पेआउट और ID कार्ड डाउनलोड करने की पूरी गाइडेंस दे सकता हूँ।\n\nनीचे दिए गए सुझावों पर क्लिक करें या अपना कोई भी प्रश्न टाइप करें!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load custom knowledge from Firestore
  useEffect(() => {
    fetchKnowledgeFromFirestore().then((items) => {
      if (items && items.length > 0) setKnowledgeList(items);
    });

    const unsub = subscribeToFirestoreKnowledge((items) => {
      if (items && items.length > 0) setKnowledgeList(items);
    });

    return () => unsub();
  }, []);

  // Handle incoming query if provided externally
  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== '') {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const findDirectKnowledgeMatch = (userText: string): string | null => {
    const cleanUserText = userText.trim().toLowerCase();
    if (!cleanUserText) return null;

    // Direct match against taught questions
    for (const item of knowledgeList) {
      const qLower = (item.question || '').toLowerCase();
      if (qLower === cleanUserText) return item.answer;
      if (cleanUserText.includes(qLower) || qLower.includes(cleanUserText)) return item.answer;

      // Check key phrases
      const cleanQWords = qLower.replace(/[^\w\s\u0900-\u097F]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
      const matchedWords = cleanQWords.filter((w) => cleanUserText.includes(w));
      if (cleanQWords.length > 0 && matchedWords.length / cleanQWords.length >= 0.75) {
        return item.answer;
      }
    }
    return null;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // 1. Check direct match in Firestore Knowledge Base first
      const directMatchAnswer = findDirectKnowledgeMatch(messageContent);
      if (directMatchAnswer) {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: directMatchAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
        return;
      }

      // 2. Query server chat API (with Gemini + Google Search Grounding)
      const historyPayload = messages
        .filter((m) => m.id !== 'msg-welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      let replyContent = '';
      let isGrounded = false;
      let searchQueries: string[] = [];
      let sources: Array<{ title: string; uri: string }> = [];

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageContent,
            history: historyPayload
          })
        });

        if (res.ok) {
          const data = await res.json();
          replyContent = data.reply;
          isGrounded = !!data.grounded;
          searchQueries = data.searchQueries || [];
          sources = data.sources || [];
        }
      } catch (e) {
        console.warn('Network chat error, using offline fallback', e);
      }

      if (!replyContent) {
        const lower = messageContent.toLowerCase();
        if (lower.includes('plan 1') || lower.includes('plan 01') || lower.includes('₹10') || lower.includes('bal vikas')) {
          replyContent = `**Plan 01: Bal Vikas Access (₹10)**\n- **संसाधन:** Class 1-5 NCERT PDFs, Worksheets और Verification Pass।\n- **इंसेंटिव:** ₹7 इंस्टेंट पेआउट प्रति सफल रेफरल (70% Payout)।\n- **किसके लिए:** स्कूली छात्र और शुरुआती यूजर्स।\n- **रजिस्ट्रेशन:** आप ऐप के **रजिस्ट्रेशन पेज (Registration Page)** पर जाकर सीधे इन-ऐप फॉर्म से एक्टिवेट कर सकते हैं।`;
        } else if (lower.includes('plan 7') || lower.includes('plan 07') || lower.includes('₹999') || lower.includes('master')) {
          replyContent = `**Plan 07: Lifetime Master Access (₹999)**\n- **संसाधन:** सभी 6 प्लान्स का अनलॉक्ड एक्सेस + लाइफटाइम फ्री अपडेट्स + मास्टर रीसेलर राइट्स।\n- **इंसेंटिव:** ₹499 इंस्टेंट पेआउट प्रति रेफरल (50% सीधा पेआउट)।\n- **संजय मॉडल:** 20 लीडर्स को जोड़ने पर तुरंत ₹9,980 की शुद्ध कमाई!\n- **रजिस्ट्रेशन:** आप ऐप के **रजिस्ट्रेशन पेज (Registration Page)** पर जाकर सीधे इन-ऐप फॉर्म से एक्टिवेट कर सकते हैं।`;
        } else if (lower.includes('plan') || lower.includes('प्लान') || lower.includes('रेट')) {
          replyContent = `IOIS के सभी 7 प्लान्स का संक्षिप्त विवरण:\n\n1. **Plan 01 (₹10):** ₹7 इंस्टेंट पेआउट (70%)\n2. **Plan 02 (₹49):** ₹34 इंस्टेंट पेआउट (70%)\n3. **Plan 03 (₹99):** ₹64 इंस्टेंट पेआउट (65%)\n4. **Plan 04 (₹199):** ₹119 इंस्टेंट पेआउट (60%)\n5. **Plan 05 (₹299):** ₹179 इंस्टेंट पेआउट (60%)\n6. **Plan 06 (₹499):** ₹274 इंस्टेंट पेआउट (55%)\n7. **Plan 07 (₹999):** ₹499 इंस्टेंट पेआउट (50%)\n\nआप किसी भी प्लान से अपनी शुरुआत कर सकते हैं!`;
        } else if (lower.includes('payout') || lower.includes('पेआउट') || lower.includes('पैसे') || lower.includes('कमाई')) {
          replyContent = `IOIS में **स्मार्ट इंस्टेंट पेआउट प्रोटोकॉल** है। जब भी आपके रेफरल से कोई यूजर वेरिफाई होता है, उसका पैसा (₹7 से ₹499) तुरंत आपके खाते/वॉलेट में ट्रांसफर कर दिया जाता है।`;
        } else if (lower.includes('contact') || lower.includes('संपर्क') || lower.includes('whatsapp') || lower.includes('help')) {
          replyContent = `आप हमसे सीधे संपर्क कर सकते हैं:\n- **WhatsApp Support:** +91 8877490845\n- **Official Telegram:** @ioisplatform\n- **Email:** ioisplatform@gmail.com`;
        } else {
          // Record as unanswered in Firestore Cloud DB so Admin can teach it!
          syncUnansweredToFirestore({
            id: `unans-${Date.now()}`,
            question: messageContent,
            askedAt: new Date().toISOString(),
            status: 'pending'
          });

          replyContent = `नमस्ते! आपका प्रश्न नोट कर लिया गया है और एडमिन को भेज दिया गया है।\n\nमैं IOIS AI असिस्टेंट हूँ। आप IOIS के 7 प्लांस, रजिस्ट्रेशन प्रक्रिया, ID कार्ड डाउनलोड, डिजिटल स्किल्स या इंस्टेंट पेआउट के बारे में पूछ सकते हैं।\n\nसीधे सहायता के लिए व्हाट्सएप सपोर्ट **+91 8877490845** पर संपर्क कर सकते हैं।`;
        }
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounded: isGrounded,
        searchQueries,
        sources
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat Error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'सॉरी, नेटवर्क से जुड़ने में समस्या हुई। कृपया हमारे आधिकारिक व्हाट्सएप सपोर्ट +91 8877490845 पर संपर्क करें।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `नमस्ते! चैट रीसेट हो गई है। आप IOIS के 7 प्लांस या किसी भी अन्य विषय पर कोई नया प्रश्न पूछ सकते हैं।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      id="ai-chatbot-drawer"
      className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[450px] max-w-[480px] shadow-2xl rounded-3xl overflow-hidden border-2 border-amber-500/60 bg-slate-950/95 backdrop-blur-2xl flex flex-col transition-all duration-300 animate-fadeIn"
      style={{ height: isMinimized ? '64px' : '620px', maxHeight: '88vh' }}
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 px-4 py-3 border-b border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-green-500 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <Bot className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-white font-black text-xs sm:text-sm leading-none">IOIS Live AI Assistant</h4>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <p className="text-[10px] text-amber-400/90 font-medium leading-none mt-1">24x7 Verified Live AI</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="चैट साफ करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title={isMinimized ? 'बड़ा करें' : 'छोटा करें'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Area (Only if not minimized) */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800 bg-slate-950/80">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-1.5 ${
                      isAssistant
                        ? 'bg-slate-900/90 text-slate-200 border border-slate-800'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium'
                    }`}
                  >
                    {isAssistant && msg.grounded && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold w-fit mb-1">
                        <Globe className="w-3 h-3 text-blue-400" />
                        <span>Google Search से लाइव सत्यापित</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>

                    {isAssistant && msg.sources && msg.sources.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>सत्यापित स्रोत (Sources):</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.slice(0, 3).map((src, sIdx) => (
                            <a
                              key={sIdx}
                              href={src.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] bg-slate-950 hover:bg-slate-800 text-blue-300 border border-slate-800 px-2 py-0.5 rounded-lg truncate max-w-[200px] flex items-center gap-1 transition"
                            >
                              <span className="truncate">{src.title || 'वेब संदर्भ'}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`text-[9px] text-right font-semibold ${isAssistant ? 'text-slate-500' : 'text-slate-900/80'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-[11px] text-slate-400 ml-2">AI उत्तर लिख रहा है...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Questions Chips */}
          <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              'रजिस्ट्रेशन कैसे और कहाँ से करें?',
              '15-सवाल कौशल इंटरव्यू कैसे दें?',
              '7 प्लांस और पेआउट की सूची',
              'ID कार्ड कैसे डाउनलोड करें?',
              '₹499 का इंस्टेंट पेआउट कैसे मिलता है?'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] bg-slate-950 hover:bg-slate-800 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full shrink-0 transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-amber-500/20 flex items-center gap-2"
          >
            <input
              id="ai-chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="कोई भी सवाल पूछें (हिंदी / English)..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 transition"
              disabled={isLoading}
            />
            <button
              id="ai-chatbot-send-btn"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black flex items-center justify-center shrink-0 disabled:opacity-50 transition shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
