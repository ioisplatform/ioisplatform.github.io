import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  BookOpen, 
  FileText, 
  Download, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  Crown,
  Lock
} from 'lucide-react';

interface InteractivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimPass: () => void;
}

export const InteractivePreviewModal: React.FC<InteractivePreviewModalProps> = ({
  isOpen,
  onClose,
  onClaimPass
}) => {
  const [previewTab, setPreviewTab] = useState<'plan01' | 'plan02' | 'plan03' | 'plan06'>('plan01');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#121212] rounded-3xl border-2 border-[#d4af37]/60 shadow-[0_0_50px_rgba(212,175,55,0.25)] text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Gold Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1a1708] via-[#26210b] to-[#1a1708] border-b border-[#d4af37]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f3e5ab] text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
              ✨
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] font-black uppercase tracking-wider">
                <Eye className="w-3 h-3 text-[#d4af37]" />
                <span>Live Interactive Dashboard Preview</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                बिना लॉगिन के IOIS छात्र कंसोल की लाइव झलक
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#0d0d0d] p-2 gap-2 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setPreviewTab('plan01')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              previewTab === 'plan01'
                ? 'bg-[#d4af37] text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🧒 Plan 01: Bal Vikas AI Teacher</span>
          </button>

          <button
            onClick={() => setPreviewTab('plan02')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              previewTab === 'plan02'
                ? 'bg-[#d4af37] text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>💼 Plan 02: Resume & AI Tools</span>
          </button>

          <button
            onClick={() => setPreviewTab('plan03')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              previewTab === 'plan03'
                ? 'bg-[#d4af37] text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎯 Plan 03: NCERT 6-12 Dropdown</span>
          </button>

          <button
            onClick={() => setPreviewTab('plan06')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              previewTab === 'plan06'
                ? 'bg-[#d4af37] text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🚀 Plan 06: Referral & Earnings</span>
          </button>
        </div>

        {/* Preview Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {previewTab === 'plan01' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#d4af37]/30 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Google AI Studio Powered
                </span>
                <h4 className="text-base font-black text-white">
                  24x7 AI Teacher Window & Voice Mic
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  नर्सरी से क्लास 5 के बच्चे माइक बटन दबाकर कुछ भी पूछ सकते हैं: "A for क्या होता है?", "2 का पहाड़ा सुनाएं", "हाथी और शेर की कहानी सुनाएं!" AI तुरंत हिंदी में आवाज़ और टेक्स्ट में उत्तर देता है।
                </p>
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-[#f3e5ab]">
                  "नमस्ते! मैं आपका IOIS AI शिक्षक हूँ। आज हम मिलकर वर्णमाला, कविताएं और पहाड़ा सीखेंगे!"
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { title: 'सचित्र वर्णमाला', icon: '🍎' },
                  { title: 'A to Z फोनिक्स', icon: '🔤' },
                  { title: 'डिजिटल ट्रेसिंग पैड', icon: '✏️' },
                  { title: 'स्टार लर्नर सर्टिफिकेट', icon: '⭐' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-2xl block mb-1">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-200">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewTab === 'plan02' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#d4af37]/30 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Career Readiness Module
                </span>
                <h4 className="text-base font-black text-white">
                  ATS Resume Pack & Free AI Tools Guide
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  कॉलेज फ्रेशर्स, डाटा एंट्री व प्राइवेट टीचर्स के लिए 1-क्लिक डाउनलोड होने वाले रिज्यूम टेम्पलेट्स और असाइनमेंट/प्रोजेक्ट्स के लिए ChatGPT & Gemini के मास्टर प्रॉम्प्ट्स।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-white block">Freshers ATS Resume Format 2026</span>
                  <span className="text-[11px] text-slate-400">12वीं और कॉलेज छात्रों के लिए सत्यापित लेआउट</span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#d4af37] text-slate-950 font-bold text-xs">
                  Unlock @ ₹10
                </span>
              </div>
            </div>
          )}

          {previewTab === 'plan03' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#d4af37]/30 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  100% NCERT Verified
                </span>
                <h4 className="text-base font-black text-white">
                  कक्षा 6 से 12 NCERT वॉल्ट व करियर रोडमैप्स
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ड्रॉपडाउन से कक्षा 6 से 12 और विषय (गणित, विज्ञान, सामाजिक विज्ञान, हिंदी, अंग्रेजी) चुनकर सीधे नोट्स और पिछले 5 वर्षों के बोर्ड हल एक्सेस करें।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  📚 क्लास 10 व 12 बोर्ड स्पेशल शॉर्ट नोट्स व फॉर्मूला शीट्स
                </span>
                <span className="text-xs text-[#d4af37] font-bold">शामिल</span>
              </div>
            </div>
          )}

          {previewTab === 'plan06' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#d4af37]/30 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Instant Income Support
                </span>
                <h4 className="text-base font-black text-white">
                  70% तक तुरंत रेफरल सपोर्ट व अर्निंग कंसोल
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  छात्र अपने दोस्तों को पोर्टल से जोड़कर अपनी पॉकेट मनी और पढ़ाई का खर्च स्वयं उठा सकते हैं। 1-क्लिक में WhatsApp व Telegram पर शेयर करने का सिस्टम।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>सत्यापित छात्रों को प्रति रेफरल तुरंत 70% तक इंसेंटिव सपोर्ट</span>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Banner & Claim Pass CTA */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#141414] via-[#1f1b0a] to-[#141414] border-t border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 block">
              🛡️ यह ₹10 केवल बॉट्स और स्पैमर्स को दूर रखने के लिए वेरिफिकेशन पास है।
            </span>
            <span className="text-xs font-black text-[#f3e5ab]">
              पाएं ₹500+ मूल्य का सम्पूर्ण डिजिटल शिक्षण व AI टूल्स पैकेज!
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onClaimPass();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0"
          >
            <span>Claim Your Lifetime Pass @ ₹10 Only</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
