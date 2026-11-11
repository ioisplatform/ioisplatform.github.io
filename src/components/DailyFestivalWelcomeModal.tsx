import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  Flame, 
  Sun, 
  Heart, 
  ArrowRight,
  BookOpen,
  Volume2
} from 'lucide-react';
import { DayFestivalInfo, calculateLiveVedicPanchang } from '../services/festivalPanchangService';
import { PageType } from '../types';

interface DailyFestivalWelcomeModalProps {
  festival?: DayFestivalInfo;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: PageType) => void;
  onNavigatePanchang?: () => void;
  onOpenRashifal?: () => void;
  userName?: string;
}

export const DailyFestivalWelcomeModal: React.FC<DailyFestivalWelcomeModalProps> = ({
  festival,
  isOpen,
  onClose,
  onNavigate,
  onNavigatePanchang,
  onOpenRashifal,
  userName
}) => {
  const [activeTab, setActiveTab] = useState<'significance' | 'muhurat' | 'puja'>('significance');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  if (!isOpen) return null;

  const defaultFestival: DayFestivalInfo = {
    id: 'daily-divas',
    nameHindi: '🌟 आज का पावन सनातन दिवस व दैनिक संकल्प 2026 🌟',
    englishName: "Today's Auspicious Day",
    tagline: 'दैनिक वैदिक ऊर्जा, शुभ मुहूर्त, सकारात्मक विचार व स्वावलंबन',
    dateStr: new Date().toLocaleDateString('hi-IN'),
    badge: 'आज का दिवस संदेश 🌅',
    imageUrl: '',
    significance: 'प्रत्येक नया दिन ईश्वर का दिया हुआ एक अनमोल अवसर है।',
    story: 'सनातन परंपरा में प्रत्येक दिन किसी न किसी देवी-देवता और ग्रह को समर्पित है।',
    shubhMuhurat: 'अभिजित मुहूर्त: 11:43 AM से 12:28 PM',
    muhuratDetails: [],
    pujaVidhi: [],
    mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    greetingsMessage: 'IOIS डिजिटल परिवार की ओर से आपका आज का दिन अत्यंत मंगलमय हो!',
    dosAndDonts: { dos: [], donts: [] }
  };

  const safeFestival: DayFestivalInfo = festival || calculateLiveVedicPanchang()?.festivalsToday || defaultFestival;

  const handleShareOnWhatsApp = () => {
    const text = `🎉 *${safeFestival?.nameHindi || 'IOIS 2026'}* 🎉\n${safeFestival?.tagline || ''}\n\n🌟 *आज का शुभ मुहूर्त:* ${safeFestival?.shubhMuhurat || ''}\n\n📖 *महत्व:* ${(safeFestival?.significance || '').slice(0, 150)}...\n\n🙏 ${safeFestival?.greetingsMessage || ''}\n\n👉 संपूर्ण दैनिक पंचांग व शुभ मुहूर्त देखें: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyGreeting = () => {
    const text = `${safeFestival?.nameHindi || 'IOIS 2026'}\n\n${safeFestival?.greetingsMessage || ''}\n\nशुभ मुहूर्त: ${safeFestival?.shubhMuhurat || ''}\n\nIOIS 2026: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-950 border-2 border-amber-500/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 z-20" />

        {/* Top Control Bar with Close */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-amber-500/30 z-20 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
              ● लाइव दैनिक पंचांग व पावन पर्व स्वागत
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-3.5 sm:p-6 space-y-4 text-slate-200">
          
          {/* 1. Festive Header Artwork Banner (100% Uncropped 16:9 Display) */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-black">
            <div className="w-full aspect-video relative flex items-center justify-center bg-black">
              {safeFestival?.imageUrl ? (
                <img 
                  src={safeFestival.imageUrl} 
                  alt={safeFestival?.nameHindi || 'पर्व'} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-300 font-black text-sm">
                  IOIS FESTIVAL 2026
                </div>
              )}
            </div>
            
            <div className="px-3.5 py-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-2">
              <span className="text-amber-300 text-xs font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{safeFestival?.badge || 'विशेष पर्व'}</span>
              </span>
              <span className="text-[10.5px] font-mono text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded-md">
                {safeFestival?.dateStr || ''}
              </span>
            </div>
          </div>

          {/* 2. Welcome Headline & Personalized Greetings */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              <span>🙏 नमस्ते</span>
              {userName ? (
                <span className="text-white">{userName} जी</span>
              ) : (
                <span>आदरणीय सदस्य / बंधु</span>
              )}
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
              {safeFestival.nameHindi}
            </h3>

            <p className="text-xs sm:text-sm font-bold text-amber-200">
              {safeFestival.tagline}
            </p>

            {/* Heartfelt Greeting Card */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-950 border border-amber-500/40 text-xs sm:text-sm leading-relaxed text-amber-100">
              <p>{safeFestival.greetingsMessage}</p>
            </div>
          </div>

          {/* 3. Auspicious Shubh Muhurat Highlight Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border-2 border-emerald-500/60 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>आज का पावन शुभ मुहूर्त (Auspicious Timings)</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                अमृत वेला
              </span>
            </div>

            <div className="text-base sm:text-lg font-black text-white font-mono bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/40 flex items-center justify-between flex-wrap gap-2">
              <span className="text-amber-300">{safeFestival.shubhMuhurat}</span>
              <span className="text-[10px] text-emerald-400 font-sans font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                ● सर्वाधिक फलदायी
              </span>
            </div>

            {/* Sub-Muhurats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              {(safeFestival.muhuratDetails || []).map((m, idx) => (
                <div key={idx} className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-bold">{m.label}:</span>
                  <strong className="text-white font-mono block">{m.time}</strong>
                  <span className="text-[9.5px] text-emerald-400">{m.importance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Tab Navigation: Significance (क्यों मनाया जाता है) | Puja Vidhi | Mantra */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('significance')}
                className={`py-2 px-1 rounded-lg font-black transition cursor-pointer text-center truncate ${
                  activeTab === 'significance'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                📖 क्यों मनाते हैं?
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('puja')}
                className={`py-2 px-1 rounded-lg font-black transition cursor-pointer text-center truncate ${
                  activeTab === 'puja'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🪔 पूजा विधि
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('muhurat')}
                className={`py-2 px-1 rounded-lg font-black transition cursor-pointer text-center truncate ${
                  activeTab === 'muhurat'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ✨ पावन मंत्र
              </button>
            </div>

            {/* Tab 1: Significance & Story */}
            {activeTab === 'significance' && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs sm:text-sm leading-relaxed animate-fadeIn">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>पौराणिक इतिहास व सामाजिक महत्व:</span>
                </div>
                <p className="text-slate-200">{safeFestival.significance}</p>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-amber-200">
                  <strong className="text-amber-300 block mb-1">📜 कथा व मान्यता:</strong>
                  {safeFestival.story}
                </div>
              </div>
            )}

            {/* Tab 2: Puja Vidhi */}
            {activeTab === 'puja' && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs sm:text-sm animate-fadeIn">
                <strong className="text-amber-400 block mb-1 text-xs font-black uppercase">
                  चरणबद्ध पावन पूजा विधि:
                </strong>
                <ul className="space-y-1.5 text-slate-300 text-xs">
                  {(safeFestival.pujaVidhi || []).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab 3: Mantra */}
            {activeTab === 'muhurat' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-center space-y-2 animate-fadeIn">
                <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider block">
                  आज का पावन संकल्प व आशीर्वाद मंत्र:
                </span>
                <p className="text-sm sm:text-base font-bold text-white font-serif leading-relaxed">
                  "{safeFestival.mantra}"
                </p>
                <span className="text-[10px] text-slate-400 block">
                  (पूजन या तिलक के समय इस पावन मंत्र का 3 या 11 बार स्मरण करें)
                </span>
              </div>
            )}
          </div>

          {/* 5. Quick Action Links & WhatsApp Share */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="btn-gold-gradient px-4 py-2.5 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer flex-1 sm:flex-initial"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-950" />
                <span>WhatsApp पर बधाई भेजें</span>
              </button>

              <button
                type="button"
                onClick={handleCopyGreeting}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-xs font-bold"
                title="शुभकामनाएं कॉपी करें"
              >
                {copiedShare ? "✓ कॉपी हो गया" : "कॉपी"}
              </button>
            </div>

            <div className="flex items-center gap-2 justify-end">
              {onOpenRashifal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRashifal();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer transition flex items-center gap-1"
                >
                  <span>🔮 दैनिक राशिफल</span>
                </button>
              )}

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('panchang-rashifal');
                  }}
                  className="btn-3d-rainbow-special px-4 py-2.5 rounded-xl text-xs font-black text-black flex items-center justify-center gap-1 cursor-pointer transition active:scale-95"
                >
                  <span>पंचांग देखें ➔</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <span>IOIS वैदिक पंचांग व संस्कृति संवर्धन 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:underline font-bold cursor-pointer"
          >
            समझ गए (Close Window) ✓
          </button>
        </div>

      </div>
    </div>
  );
};
