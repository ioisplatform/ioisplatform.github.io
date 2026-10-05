import React, { useState, useEffect, useRef } from 'react';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { PlanDetail, ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  User, 
  ArrowRight, 
  BookOpen, 
  Tv, 
  Pencil, 
  FileCheck2,
  GraduationCap
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onSelectPlanToJoin: (plan: PlanDetail) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  onSelectPlanToJoin
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `नमस्ते! मैं **IOIS AI छात्र अध्ययन सलाहकार (Study Advisor)** हूँ। 🎓🇮🇳\n\nमैं आपको कक्षा 1 से 12 एवं स्किल डेवलपमेंट के सभी **7 अध्ययन प्लान्स**, NCERT नोट्स, वीडियो लेक्चर्स, डिजिटल ट्रेसिंग पैड और दैनिक गृहकार्य प्रणाली के बारे में मार्गदर्शन दे सकता हूँ।\n\nआप नीचे दिए गए त्वरित प्रश्नों पर क्लिक कर सकते हैं या अपना सवाल पूछ सकते हैं!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'कक्षा 1 से 5 (Bal Vikas) में क्या अध्ययन सामग्री मिलेगी?',
    'कक्षा 9 और 10 के बोर्ड एग्जाम की तैयारी कैसे करें?',
    'डिजिटल अक्षर ट्रेसिंग पैड का उपयोग कैसे करें?',
    'गृहकार्य (Homework) चेक कराने की क्या प्रक्रिया है?',
    'प्रतियोगी परीक्षा (Plan 05) में कौन से नोट्स शामिल हैं?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const generateAiResponse = (userText: string): { response: string; plan?: PlanDetail } => {
    const text = userText.toLowerCase();

    // 1. All 7 Plans Overview
    if (
      text.includes('pure plan') || 
      text.includes('master plan') || 
      text.includes('kya milega') || 
      text.includes('kis plan me') || 
      text.includes('sabhi 7') ||
      text.includes('पूरे 7') ||
      text.includes('7 प्लान')
    ) {
      return {
        response: `📚 **IOIS 7 संपूर्ण छात्र अध्ययन योजनाओं का विवरण:**

1. **PLAN 01: Bal Vikas Access (Class 1-5):**
   • सचित्र NCERT हिंदी, गणित, अंग्रेजी नोट्स, ऑडियो उच्चारण व इंटरैक्टिव अक्षर ट्रेसिंग पैड।

2. **PLAN 02: Youth Skill Access (Class 6-8 & IT Skills):**
   • कंप्यूटर बेसिक, कोडिंग फंडामेंटल्स, कीबोर्ड शॉर्टकट्स व विज्ञान प्रयोगशाला नोट्स।

3. **PLAN 03: Career & Job Access (Class 9-10 Board Prep):**
   • गणित, विज्ञान, सामाजिक विज्ञान के अध्यायवार नोट्स, 10 साल के सॉल्वड पेपर्स व फॉर्मूला शीट्स।

4. **PLAN 04: Higher Secondary Access (Class 11-12):**
   • साइंस, कॉमर्स व आर्ट्स के एडवांस्ड कॉन्सेप्ट नोट्स, माइंड मैप्स व करियर काउंसलिंग।

5. **PLAN 05: Student Elite Access (प्रतियोगी परीक्षा):**
   • SSC, Railway, State Exams, Banking हेतु सामान्य अध्ययन, रीजनिंग व करंट अफेयर्स।

6. **PLAN 06: Agency & Digital Skills (डिजिटल साक्षरता):**
   • ऑनलाइन सरकारी सेवाएं (RTPS, आय-जाति प्रमाण पत्र), एमएस ऑफिस व डिजिटल वर्कफ्लो।

7. **PLAN 07: Supreme Master Lifetime (ऑल-इन-वन):**
   • कक्षा 1 से 12 तक के सभी 6 प्लान्स का आजीवन अनलॉक्ड एक्सेस + सभी नए कोर्सेज फ्री।`,
        plan: ioisMasterPlans[0]
      };
    }

    // 2. Plan 01 - Bal Vikas
    if (text.includes('10') || text.includes('bal vikas') || text.includes('1') || text.includes('बाल विकास') || text.includes('कक्षा 1')) {
      const p = ioisMasterPlans[0];
      return {
        response: `🌱 **Plan 01: Bal Vikas (Class 1-5 के नन्हे छात्रों के लिए)**

• **सचित्र नोट्स:** वर्णमाला (अ से ज्ञ), बारहखड़ी, अंग्रेजी Phonetics व 1 से 100 तक पहाड़े।
• **डिजिटल ट्रेसिंग पैड:** छात्र स्क्रीन पर उंगली या टच-पेन से अक्षरों के ऊपर हाथ घुमाकर लिख सकते हैं।
• **दैनिक गृहकार्य:** रोज 3 प्रश्न जिनका ऑनलाइन सबमिशन व तत्काल जांच उपलब्ध है।
• **ऑडियो उच्चारण:** कठिन शब्दों को सुनने के लिए 'बोलकर सुनें' बटन उपलब्ध है।`,
        plan: p
      };
    }

    // 3. Tracing Pad
    if (text.includes('tracing') || text.includes('ट्रेसिंग') || text.includes('लिखना') || text.includes('पेंसिल') || text.includes('ड्राइंग')) {
      return {
        response: `✍️ **डिजिटल अक्षर व चित्र ट्रेसिंग पैड की विशेषताएं:**

1. **स्क्रीन पर अभ्यास:** बिना किसी स्लेट या कॉपी के छात्र स्क्रीन पर वर्णमाला, गिनती, कर्सिव राइटिंग और डायग्राम्स बना सकते हैं।
2. **कलर्स व इरेज़र:** पेंसिल का रंग, ब्रश साइज़ बदलें या गलती होने पर इरेज़र से मिटाएं।
3. **गाइड लाइन ऑन/ऑफ:** अक्षरों की डॉटेड रूपरेखा को चालू या बंद करके स्वयं लिख सकते हैं।
4. **डाउनलोड कॉपी:** छात्र अपने बनाए अभ्यास को इमेज फॉर्मेट में डाउनलोड करके सुरक्षित रख सकते हैं।

इसे खोलने के लिए किसी भी प्लान के **'अक्षर व चित्र ट्रेसिंग'** टैब पर जाएं!`
      };
    }

    // 4. Homework
    if (text.includes('homework') || text.includes('गृहकार्य') || text.includes('होमवर्क') || text.includes('सबमिट') || text.includes('जांच')) {
      return {
        response: `📝 **IOIS दैनिक गृहकार्य (Homework) प्रणाली:**

• हर प्लान में नियमित विषयवार गृहकार्य कार्य (Tasks) दिए गए हैं।
• छात्र अपना उत्तर सीधे टेक्स्ट बॉक्स में लिख सकते हैं।
• सबमिट करने पर तत्काल स्कोरिंग, मॉडल उत्तर (Answer Key) और सुधार सुझाव दिए जाते हैं।
• पूर्ण किए गए कार्यों की प्रोग्रेस सीधे छात्र के प्रोफाइल और सर्टिफिकेट में जुड़ती है!`
      };
    }

    // 5. Competitive Exams
    if (text.includes('299') || text.includes('ssc') || text.includes('railway') || text.includes('police') || text.includes('प्रतियोगी') || text.includes('elite')) {
      const p = ioisMasterPlans[4];
      return {
        response: `🎯 **Plan 05: Student Elite (प्रतियोगी परीक्षा तैयारी)**

• **सामान्य अध्ययन (GK & GS):** इतिहास, भूगोल, संविधान, अर्थशास्त्र के समरी नोट्स।
• **गणित व रीजनिंग:** शॉर्टकट ट्रिक्स व 500+ अभ्यास प्रश्न।
• **करंट अफेयर्स:** मासिक डाइजेस्ट व महत्वपूर्ण सरकारी योजनाएं।
• **सॉल्वड पेपर्स:** पिछले वर्षों के प्रश्न-पत्र व्याख्या सहित।`,
        plan: p
      };
    }

    // Default intelligent guidance
    return {
      response: `आप अपनी कक्षा या अध्ययन लक्ष्य के अनुसार सही प्लान चुन सकते हैं:

• **प्राथमिक स्तर (कक्षा 1-5):** Plan 01 (Bal Vikas) - वर्णमाला, गिनती व ट्रेसिंग।
• **मिडिल स्कूल (कक्षा 6-8):** Plan 02 (Youth Skill) - कंप्यूटर व बेसिक साइंस।
• **हाई स्कूल (कक्षा 9-10):** Plan 03 (Career & Board) - बोर्ड परीक्षा नोट्स व सैंपल पेपर्स।
• **इंटरमीडिएट (कक्षा 11-12):** Plan 04 (Higher Secondary) - 12वीं बोर्ड व करियर गाइड।
• **प्रतियोगी परीक्षा:** Plan 05 (Student Elite) - SSC, Railway व पुलिस परीक्षा नोट्स।
• **संपूर्ण ऑल-इन-वन:** Plan 07 (Supreme Master) - सभी कक्षाओं का आजीवन एक्सेस।

आप किस विषय या कक्षा के बारे में जानना चाहते हैं?`,
      plan: ioisMasterPlans[0]
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const { response, plan } = generateAiResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPlan: plan ? plan.id : undefined
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 350);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-orange-500">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  IOIS AI छात्र अध्ययन सलाहकार
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                  ऑनलाइन 24x7
                </span>
              </div>
              <p className="text-xs text-orange-100">
                कक्षा 1-12 NCERT नोट्स, वीडियो लेक्चर्स, ट्रेसिंग पैड व परीक्षा मार्गदर्शन
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-1.5 shrink-0">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50 whitespace-nowrap transition-colors shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-orange-600 shrink-0" />
              <span>{p}</span>
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-100/40">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            const suggestedPlanObj = msg.suggestedPlan 
              ? ioisMasterPlans.find(p => p.id === msg.suggestedPlan)
              : null;

            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isAi 
                    ? 'bg-white text-slate-800 border border-slate-200' 
                    : 'bg-orange-600 text-white font-medium'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* If AI recommended a plan, show quick action box */}
                  {isAi && suggestedPlanObj && (
                    <div className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          {suggestedPlanObj.name} (Plan 0{suggestedPlanObj.planNumber})
                        </span>
                        <span className="text-[11px] text-orange-700 font-semibold">
                          {suggestedPlanObj.subtitle || suggestedPlanObj.tagline}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectPlanToJoin(suggestedPlanObj);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow"
                      >
                        <span>पाठ्यक्रम देखें</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span className={`text-[10px] block mt-2 ${isAi ? 'text-slate-400' : 'text-orange-200'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs pl-2">
              <Bot className="w-4 h-4 text-orange-600 animate-spin" />
              <span>IOIS AI उत्तर तैयार कर रहा है...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="पूछें: कक्षा 1 से 5 में क्या है? या ट्रेसिंग पैड का उपयोग कैसे करें?..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm bg-slate-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all shrink-0"
            >
              <span>भेजें</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
