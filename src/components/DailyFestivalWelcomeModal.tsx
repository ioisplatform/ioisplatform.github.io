import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Sparkles,
  Clock,
  Share2,
  BookOpen,
  Maximize2,
  Minimize2,
  Calendar,
} from 'lucide-react';
import {
  DayFestivalInfo,
  calculateLiveVedicPanchang,
  getActiveFestivalsForDate,
  getUpcomingFestivals,
} from '../services/festivalPanchangService';
import { toLocalIsoDateKey } from '../data/homeSliderData';
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
  const [selectedFestIndex, setSelectedFestIndex] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState<boolean>(false);

  const festivalChoices = useMemo<DayFestivalInfo[]>(() => {
    const now = new Date();
    const todayKey = toLocalIsoDateKey(now);
    const active = getActiveFestivalsForDate(now);
    const upcoming = getUpcomingFestivals(now, 2, 75);
    const livePanchangToday = calculateLiveVedicPanchang(now).festivalsToday;
    const isPassedFestivalValid = Boolean(
      festival &&
      festival.id !== 'daily-vedic-divas' &&
      (!festival.endDate || festival.endDate >= todayKey)
    );

    const list: DayFestivalInfo[] = [];
    const seen = new Set<string>();

    const addIfNew = (item?: DayFestivalInfo) => {
      if (!item || seen.has(item.id)) return;
      if (item.endDate && item.endDate < todayKey) return;
      seen.add(item.id);
      list.push(item);
    };

    if (isPassedFestivalValid) {
      addIfNew(festival);
    }
    active.forEach(addIfNew);
    upcoming.forEach(addIfNew);
    if (list.length === 0) {
      addIfNew(livePanchangToday);
    }
    return list;
  }, [festival, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedFestIndex(0);
      setIsImageFullscreen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const safeFestival: DayFestivalInfo =
    festivalChoices[selectedFestIndex] || festivalChoices[0] || calculateLiveVedicPanchang().festivalsToday;

  const handleShareOnWhatsApp = () => {
    const text = `*IOIS INDIA की ओर से हार्दिक बधाई एवं शुभकामनाएं*\n\n*${safeFestival.nameHindi}*\n${safeFestival.tagline}\n\n📅 *तिथि:* ${safeFestival.dateStr}\n⏰ *शुभ मुहूर्त:* ${safeFestival.shubhMuhurat}\n\n${safeFestival.greetingsMessage}\n\n👉 संपूर्ण दैनिक पंचांग व शुभ मुहूर्त देखें: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyGreeting = () => {
    const text = `IOIS INDIA की ओर से हार्दिक बधाई!\n${safeFestival.nameHindi}\n\n${safeFestival.greetingsMessage}\n\nशुभ मुहूर्त: ${safeFestival.shubhMuhurat}\n\n${window.location.origin}`;
    void navigator.clipboard?.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[1150] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-slate-950 border-2 border-amber-500/80 rounded-2xl sm:rounded-3xl shadow-[0_0_55px_rgba(245,158,11,0.35)] overflow-hidden my-auto max-h-[93vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top IOIS INDIA Official Celebration Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 px-4 py-2.5 flex items-center justify-between gap-2 shrink-0 shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
            <span className="text-[11px] sm:text-xs font-black tracking-wide truncate">
              IOIS INDIA की ओर से पावन पर्व बधाई व लाइव पंचांग
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] rounded-full bg-slate-950 hover:bg-red-600 text-white transition flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live & Upcoming Festival Switcher Strip */}
        {festivalChoices.length > 1 && (
          <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
            {festivalChoices.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedFestIndex(idx)}
                className={`min-h-[34px] px-3 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer border ${
                  selectedFestIndex === idx
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-amber-500/60'
                }`}
              >
                {item.isUpcoming
                  ? `आगामी (${item.daysRemaining} दिन): ${item.englishName}`
                  : `आज लाइव: ${item.englishName}`}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-3.5 sm:p-6 space-y-4 text-slate-200 flex-1">

          {/* 1. Uncropped Full-Picture Festival Greeting Banner */}
          <div className={`relative rounded-2xl overflow-hidden border border-amber-400/60 shadow-xl bg-gradient-to-b ${safeFestival.themeGradient || 'from-amber-950/30 to-slate-950'}`}>
            {safeFestival.imageUrl ? (
              <div className="relative w-full bg-black flex items-center justify-center">
                <img
                  src={safeFestival.imageUrl}
                  alt={safeFestival.nameHindi}
                  className={`w-full h-auto ${isImageFullscreen ? 'max-h-[75vh]' : 'max-h-[50vh]'} object-contain mx-auto block select-none`}
                />
                <button
                  type="button"
                  onClick={() => setIsImageFullscreen(!isImageFullscreen)}
                  className="absolute top-2.5 right-2.5 bg-slate-950/90 text-amber-300 border border-amber-500/60 px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {isImageFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isImageFullscreen ? 'सामान्य दृश्य' : 'बड़ा ज़ूम'}</span>
                </button>
              </div>
            ) : (
              <div className="w-full py-10 flex items-center justify-center text-amber-300 font-black text-base">
                IOIS INDIA पावन पर्व शुभकामनाएं
              </div>
            )}

            <div className="px-3.5 py-2.5 bg-slate-950 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-2">
              <span className="text-amber-300 text-xs font-black flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {safeFestival.isUpcoming
                    ? `आगामी महापर्व • ${safeFestival.daysRemaining} दिन शेष`
                    : safeFestival.badge}
                </span>
              </span>
              <span className="text-xs font-bold text-slate-200">
                {safeFestival.dateStr}
              </span>
            </div>
          </div>

          {/* 2. Welcome Headline & Personalized IOIS INDIA Greetings */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-xs font-bold text-amber-400">
              नमस्ते {userName ? `${userName} जी` : 'आदरणीय सदस्य एवं देशवासी'} — IOIS INDIA परिवार की ओर से हार्दिक बधाई!
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
              {safeFestival.nameHindi}
            </h3>

            <p className="text-xs sm:text-sm font-semibold text-amber-200">
              {safeFestival.tagline}
            </p>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-950 border border-amber-500/40 text-xs sm:text-sm leading-relaxed text-amber-100">
              <p>{safeFestival.greetingsMessage}</p>
            </div>
          </div>

          {/* 3. Auspicious Shubh Muhurat Highlight Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/55 via-slate-900 to-slate-950 border border-emerald-500/50 shadow-lg space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>पावन शुभ मुहूर्त (Auspicious Timings)</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-300">
                अमृत वेला
              </span>
            </div>

            <div className="text-sm sm:text-base font-black text-amber-300 font-mono bg-slate-950/85 p-3 rounded-xl border border-emerald-500/35">
              {safeFestival.shubhMuhurat}
            </div>

            {(safeFestival.muhuratDetails || []).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                {safeFestival.muhuratDetails.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-bold">{m.label}</span>
                    <strong className="text-white font-mono block">{m.time}</strong>
                    <span className="text-[10px] text-emerald-400">{m.importance}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Tabs: Significance | Puja Vidhi | Mantra */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('significance')}
                className={`min-h-[40px] py-2 px-1 rounded-lg font-black transition cursor-pointer text-center truncate ${
                  activeTab === 'significance'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                क्यों मनाते हैं?
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('puja')}
                className={`min-h-[40px] py-2 px-1 rounded-lg font-black transition cursor-pointer text-center truncate ${
                  activeTab === 'puja'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                पूजा विधि
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('muhurat')}
                className={`min-h-[40px] py-2 px-1 rounded-lg font-black transition cursor-pointer text-center truncate ${
                  activeTab === 'muhurat'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                पावन मंत्र
              </button>
            </div>

            {activeTab === 'significance' && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs sm:text-sm leading-relaxed animate-fadeIn">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>पौराणिक इतिहास व सामाजिक महत्व:</span>
                </div>
                <p className="text-slate-200">{safeFestival.significance}</p>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-amber-200">
                  <strong className="text-amber-300 block mb-1">कथा व मान्यता:</strong>
                  {safeFestival.story}
                </div>
              </div>
            )}

            {activeTab === 'puja' && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs sm:text-sm animate-fadeIn">
                <strong className="text-amber-400 block mb-1 text-xs font-black uppercase">
                  चरणबद्ध पावन पूजा विधि:
                </strong>
                <ul className="space-y-2 text-slate-200 text-xs">
                  {(safeFestival.pujaVidhi || []).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'muhurat' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-center space-y-2 animate-fadeIn">
                <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider block">
                  पावन संकल्प व आशीर्वाद मंत्र:
                </span>
                <p className="text-sm sm:text-base font-bold text-white font-serif leading-relaxed">
                  "{safeFestival.mantra}"
                </p>
              </div>
            )}
          </div>

          {/* 5. Quick Actions & Share */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="min-h-[44px] btn-gold-gradient px-4 py-2 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer flex-1 sm:flex-initial"
              >
                <Share2 className="w-4 h-4 text-slate-950" />
                <span>WhatsApp पर बधाई भेजें</span>
              </button>

              <button
                type="button"
                onClick={handleCopyGreeting}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer text-xs font-bold"
              >
                {copiedShare ? 'कॉपी हो गया ✓' : 'कॉपी'}
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
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer transition"
                >
                  दैनिक राशिफल
                </button>
              )}

              {(onNavigatePanchang || onNavigate) && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigatePanchang) onNavigatePanchang();
                    else onNavigate?.('panchang-rashifal');
                  }}
                  className="min-h-[44px] btn-3d-rainbow-special px-4 py-2 rounded-xl text-xs font-black text-black flex items-center justify-center cursor-pointer transition active:scale-95"
                >
                  संपूर्ण पंचांग देखें
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
