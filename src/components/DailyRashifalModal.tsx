import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Star, 
  Calendar, 
  Heart, 
  Briefcase, 
  Activity, 
  Share2, 
  CheckCircle2, 
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { getDetailedRashiHoroscope } from '../services/festivalPanchangService';
import { RashiForecast } from '../types';

interface DailyRashifalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRashiId?: string;
  userName?: string;
}

const RASHI_STORAGE_KEY = 'iois_saved_user_rashi';

export const DailyRashifalModal: React.FC<DailyRashifalModalProps> = ({
  isOpen,
  onClose,
  defaultRashiId,
  userName
}) => {
  const [allRashis] = useState<RashiForecast[]>(() => getDetailedRashiHoroscope());
  const [selectedRashiId, setSelectedRashiId] = useState<string>(() => {
    if (defaultRashiId) return defaultRashiId;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RASHI_STORAGE_KEY);
      if (saved) return saved;
    }
    return 'mesh';
  });

  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Sync preference to localStorage
  const handleSelectRashi = (id: string) => {
    setSelectedRashiId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(RASHI_STORAGE_KEY, id);
    }
  };

  if (!isOpen) return null;

  const currentRashi = allRashis.find(r => r.id === selectedRashiId) || allRashis[0];

  const handleShareOnWhatsApp = () => {
    const text = `🔮 *दैनिक राशिफल 2026: ${currentRashi.nameHindi}* 🔮\n✨ लकी नंबर: ${currentRashi.luckyNumber} | शुभ रंग: ${currentRashi.luckyColor}\n⏰ शुभ समय: ${currentRashi.luckyTime}\n\n🌟 *आज का फल:* ${currentRashi.overview}\n\n💼 *कैरियर व धन:* ${currentRashi.careerFinance}\n\n🌿 *आज का उपाय:* ${currentRashi.remedy}\n\n👉 अपनी राशि का दैनिक भविष्यफल देखें: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const text = `${currentRashi.nameHindi} - दैनिक राशिफल\nलकी नंबर: ${currentRashi.luckyNumber} | शुभ रंग: ${currentRashi.luckyColor}\n\n${currentRashi.overview}\n\nउपाय: ${currentRashi.remedy}\n\nIOIS: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-950 border-2 border-amber-500/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-400 z-20" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                <span>दैनिक राशिफल पॉपअप (12 राशियां)</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  LIVE 2026
                </span>
              </h3>
              <p className="text-[10.5px] text-slate-400">
                अपनी राशि चुनें — सिस्टम आपकी पसंदीदा राशि को हमेशा याद रखेगा
              </p>
            </div>
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

        {/* Horizontal Quick Rashi Chips Carousel / Grid */}
        <div className="p-2 sm:p-3 bg-slate-900/60 border-b border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
            {allRashis.map((r) => {
              const isSelected = r.id === selectedRashiId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRashi(r.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm">{r.symbol}</span>
                  <span>{r.nameHindi.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Modal Body: Active Rashi Card */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-slate-200">
          
          {/* Active Rashi Identity Card Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/50 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {currentRashi.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {currentRashi.nameHindi}
                    </h2>
                    <span className="text-[10.5px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                      {currentRashi.element}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-bold">
                    {currentRashi.nameEnglish} • {currentRashi.dateRange}
                  </p>
                </div>
              </div>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 self-start sm:self-auto">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < currentRashi.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-black text-white">
                  {currentRashi.rating}/5 भाग्य
                </span>
              </div>
            </div>

            {/* Lucky Parameters Row (Color, Number, Time) */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 block font-bold">शुभ रंग:</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span 
                    className="w-3 h-3 rounded-full border border-white/40 shrink-0" 
                    style={{ backgroundColor: currentRashi.luckyColorHex }} 
                  />
                  <strong className="text-white text-xs truncate">{currentRashi.luckyColor.split(' ')[0]}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 block font-bold">शुभ अंक:</span>
                <strong className="text-emerald-400 font-mono text-base font-black">
                  {currentRashi.luckyNumber}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 block font-bold">शुभ समय:</span>
                <strong className="text-amber-300 text-[11px] font-bold truncate">
                  {currentRashi.luckyTime.split(' - ')[0]}
                </strong>
              </div>
            </div>
          </div>

          {/* Today's In-Depth Predictions */}
          <div className="space-y-3">
            {/* 1. Daily Overview */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-amber-400 font-black">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>आज का समग्र दैनिक भविष्यफल:</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {currentRashi.overview}
              </p>
            </div>

            {/* 2. Career & Finance */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-black">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>कैरियर, व्यापार व आर्थिक लाभ:</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {currentRashi.careerFinance}
              </p>
            </div>

            {/* 3. Health & Wellness */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-sky-400 font-black">
                <Activity className="w-4 h-4 text-sky-400" />
                <span>स्वास्थ्य व मानसिक ऊर्जा:</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {currentRashi.healthWellness}
              </p>
            </div>

            {/* 4. Love & Family */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-pink-400 font-black">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>प्रेम संबंध व पारिवारिक सुख:</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {currentRashi.loveFamily}
              </p>
            </div>

            {/* 5. Astrological Remedy */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-2 border-amber-500/40 text-xs sm:text-sm space-y-1 text-center">
              <span className="text-amber-300 font-black text-xs uppercase tracking-wider block">
                🌟 आज का अचूक वैदिक उपाय (Remedy of the Day):
              </span>
              <p className="text-white font-bold leading-relaxed">
                {currentRashi.remedy}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="btn-gold-gradient px-4 py-2.5 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer flex-1 sm:flex-initial"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-950" />
                <span>राशिफल WhatsApp पर शेयर करें</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-xs font-bold"
              >
                {copiedShare ? "✓ कॉपी हुआ" : "कॉपी"}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs cursor-pointer transition text-center"
            >
              बंद करें (Close) ✓
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
          <span>दैनिक वैदिक पंचांग गणना • IOIS 2026</span>
          <span className="text-emerald-400 font-bold">आपकी राशि सुरक्षित है ✓</span>
        </div>

      </div>
    </div>
  );
};
