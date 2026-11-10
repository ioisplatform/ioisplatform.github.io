import React, { useState, useEffect } from 'react';
import { 
  calculateLiveVedicPanchang, 
  getDetailedRashiHoroscope, 
  DayFestivalInfo, 
  LivePanchangDetails 
} from '../services/festivalPanchangService';
import { DailyFestivalWelcomeModal } from './DailyFestivalWelcomeModal';
import { DailyRashifalModal } from './DailyRashifalModal';
import { RashiForecast } from '../types';
import { 
  Clock, 
  Sun, 
  Moon, 
  Sparkles, 
  Compass, 
  Calendar, 
  ShieldCheck, 
  Star, 
  Heart, 
  Briefcase, 
  Activity, 
  Flame, 
  Search,
  CheckCircle2,
  Share2,
  ArrowRight,
  Maximize2,
  BookOpen
} from 'lucide-react';

export const PanchangRashifalPage: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [panchang, setPanchang] = useState<LivePanchangDetails>(() => calculateLiveVedicPanchang());
  const [selectedRashiId, setSelectedRashiId] = useState<string>('all');
  const [rashifalList] = useState<RashiForecast[]>(() => getDetailedRashiHoroscope());
  
  // Modals state
  const [isFestivalModalOpen, setIsFestivalModalOpen] = useState<boolean>(false);
  const [isRashifalModalOpen, setIsRashifalModalOpen] = useState<boolean>(false);
  const [modalRashiId, setModalRashiId] = useState<string>('mesh');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      // Recalculate daily panchang if date changes
      if (now.getDate() !== time.getDate()) {
        setPanchang(calculateLiveVedicPanchang(now));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const digitalTimeStr = time.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const selectedRashi = rashifalList.find(r => r.id === selectedRashiId);

  return (
    <div className="space-y-8 sm:space-y-12 max-w-6xl mx-auto">
      
      {/* 1. Page Header & Quick Launch Bar */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>वैदिक पंचांग • पावन पर्व व 12 राशि भविष्य 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              लाइव दैनिक पंचांग व शुभ मुहूर्त
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              सटीक तिथि, नक्षत्र, योग, अभिजित मुहूर्त, अमृत चौघड़िया तथा आज के पावन पर्व का संपूर्ण विवरण व राशिफल।
            </p>
          </div>

          {/* Quick Action Pop-up Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => setIsFestivalModalOpen(true)}
              className="btn-gold-gradient px-4 py-2.5 rounded-xl font-black text-xs text-slate-950 flex items-center gap-1.5 shadow-xl cursor-pointer active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>🎉 आज का पावन पर्व व स्वागत</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setModalRashiId('mesh');
                setIsRashifalModalOpen(true);
              }}
              className="btn-3d-rainbow-special px-4 py-2.5 rounded-xl font-black text-xs text-black flex items-center gap-1.5 shadow-xl cursor-pointer active:scale-95 transition"
            >
              <span>🔮 दैनिक राशिफल पॉपअप</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Festival / Divas Featured Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/70 shadow-2xl bg-slate-950 p-4 sm:p-7 space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          
          {/* Festival Image Frame (100% Uncropped 16:9 View) */}
          <div 
            onClick={() => setIsFestivalModalOpen(true)}
            className="w-full lg:w-96 aspect-video rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-black shrink-0 relative cursor-pointer group"
            title="विस्तृत विवरण के लिए क्लिक करें"
          >
            <img 
              src={panchang.festivalsToday.imageUrl} 
              alt={panchang.festivalsToday.nameHindi} 
              className="w-full h-full object-contain group-hover:scale-102 transition-transform select-none"
            />
            <div className="absolute top-2 right-2 bg-slate-950/90 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded-full text-[9.5px] font-black flex items-center gap-1 shadow-md">
              <Maximize2 className="w-3 h-3 text-amber-400" />
              <span>पॉपअप खोलें</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-bold text-white bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
              <span className="text-amber-300">{panchang.festivalsToday.badge}</span>
              <span>IOIS 2026</span>
            </div>
          </div>

          {/* Festival Narrative Details */}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                {panchang.festivalsToday.badge}
              </span>
              <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                {panchang.festivalsToday.dateStr}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {panchang.festivalsToday.nameHindi}
            </h2>

            <p className="text-xs sm:text-sm font-bold text-amber-200">
              {panchang.festivalsToday.tagline}
            </p>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
              {panchang.festivalsToday.significance}
            </p>

            {/* Shubh Muhurat Callout */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider block">
                  आज का पावन शुभ मुहूर्त:
                </span>
                <strong className="text-xs sm:text-sm text-white font-mono">
                  {panchang.festivalsToday.shubhMuhurat}
                </strong>
              </div>

              <button
                type="button"
                onClick={() => setIsFestivalModalOpen(true)}
                className="btn-gold-gradient px-4 py-2 rounded-xl text-xs font-black text-slate-950 flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
              >
                <span>पूजा विधि व कथा देखें ➔</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Live System Clock & Hindu Vedic Panchang Detailed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Realistic Live Analog & Digital Clock */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center space-y-5 shadow-2xl">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <h3 className="gold-metallic-text font-black uppercase text-sm sm:text-base tracking-wider">
              लाइव वैदिक मानक समय (IST)
            </h3>
          </div>

          {/* Smooth Analog Dial */}
          <div className="clock-container my-1">
            <div className="clock-numbers">
              <span className="n1">1</span>
              <span className="n2">2</span>
              <span className="n3">3</span>
              <span className="n4">4</span>
              <span className="n5">5</span>
              <span className="n6">6</span>
              <span className="n7">7</span>
              <span className="n8">8</span>
              <span className="n9">9</span>
              <span className="n10">10</span>
              <span className="n11">11</span>
              <span className="n12">12</span>
            </div>
            <div className="center-dot" />
            <div
              className="clock-hand hour-hand"
              style={{ transform: `rotate(${hourDeg}deg)` }}
            />
            <div
              className="clock-hand min-hand"
              style={{ transform: `rotate(${minDeg}deg)` }}
            />
            <div
              className="clock-hand sec-hand"
              style={{ transform: `rotate(${secDeg}deg)` }}
            />
          </div>

          {/* Digital Time & Date */}
          <div className="w-full space-y-1">
            <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-widest drop-shadow-md">
              {digitalTimeStr}
            </div>
            <div className="text-xs text-amber-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{panchang.dateHindi}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold">
              {panchang.vaara} • {panchang.ritu}
            </p>
          </div>
        </div>

        {/* Right: Detailed Live Panchang Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-black text-white">
                आज का सम्पूर्ण वैदिक पंचांग (Live Tithi & Nakshatra)
              </h3>
            </div>
            <span className="text-[10.5px] font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {panchang.samvat}
            </span>
          </div>

          {/* Panchang Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">तिथि (Tithi):</span>
              <strong className="text-white font-bold block">{panchang.tithi}</strong>
              <span className="text-[9px] text-amber-400">{panchang.tithiEndTime}</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">नक्षत्र (Nakshatra):</span>
              <strong className="text-amber-300 font-bold block">{panchang.nakshatra}</strong>
              <span className="text-[9px] text-emerald-400">{panchang.nakshatraEndTime}</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">पक्ष व ऋतु:</span>
              <strong className="text-emerald-400 font-bold block">{panchang.paksha}</strong>
              <span className="text-[9.5px] text-slate-400">{panchang.ritu}</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">योग व करण:</span>
              <strong className="text-sky-300 font-bold block">{panchang.yoga}</strong>
              <span className="text-[9.5px] text-slate-400">{panchang.karana}</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">सूर्योदय व सूर्यास्त:</span>
              <strong className="text-amber-200 font-mono block">🌅 {panchang.sunrise}</strong>
              <span className="text-[9.5px] text-slate-400 font-mono">🌇 {panchang.sunset}</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">सूर्य व चंद्र राशि:</span>
              <strong className="text-yellow-300 font-bold block">{panchang.suryaRashi}</strong>
              <span className="text-[9.5px] text-sky-300">{panchang.chandraRashi}</span>
            </div>
          </div>

          {/* Shubh & Ashubh Muhurat Timings */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>अभिजित मुहूर्त (सर्वश्रेष्ठ समय):</span>
              </span>
              <strong className="text-white font-mono">{panchang.abhijitMuhurat}</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <span className="text-rose-300 font-bold flex items-center gap-1.5">
                <span>⛔ राहु काल (अशुभ समय):</span>
              </span>
              <strong className="text-rose-200 font-mono">{panchang.rahuKaal}</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>अमृत चौघड़िया मुहूर्त:</span>
              </span>
              <strong className="text-amber-200 font-mono">{panchang.choghadiya.amrit}</strong>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Complete Choghadiya (Day & Night Muhurat Matrix) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              दैनिक चौघड़िया मुहूर्त चक्र (Auspicious Choghadiya Matrix)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-bold">
            शुभ व अमृत समय में शुरू किए गए कार्य सफल होते हैं
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-emerald-400 font-bold block text-[11px]">✨ अमृत (सर्वोत्तम):</span>
            <strong className="text-white font-mono text-xs">{panchang.choghadiya.amrit}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <span className="text-amber-400 font-bold block text-[11px]">🌟 शुभ (मांगलिक):</span>
            <strong className="text-white font-mono text-xs">{panchang.choghadiya.shubh}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30">
            <span className="text-sky-400 font-bold block text-[11px]">💼 लाभ (व्यापार):</span>
            <strong className="text-white font-mono text-xs">{panchang.choghadiya.labh}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30">
            <span className="text-purple-400 font-bold block text-[11px]">🚶 चल (सामान्य):</span>
            <strong className="text-white font-mono text-xs">{panchang.choghadiya.chal}</strong>
          </div>
        </div>
      </div>

      {/* 5. 12 RASHI DAINIK RASHIFAL SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>दैनिक 12 राशि भविष्य (12 Zodiac Daily Horoscope 2026)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              अपनी राशि चुनें और जानें आज का लकी कलर, लकी नंबर, शुभ समय व कैरियर मार्गदर्शन।
            </p>
          </div>

          {/* Quick Rashi Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedRashiId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedRashiId === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              सभी 12 राशियां
            </button>
            {rashifalList.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRashiId(r.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  selectedRashiId === r.id
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                <span>{r.symbol}</span>
                <span>{r.nameHindi.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rashi Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedRashiId === 'all' ? rashifalList : [selectedRashi!]).map((rashi) => (
            <div
              key={rashi.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 transition shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Rashi Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                      {rashi.symbol}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white">{rashi.nameHindi}</h4>
                      <span className="text-xs text-slate-400">{rashi.nameEnglish} ({rashi.dateRange})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-bold">{rashi.rating}</span>
                  </div>
                </div>

                {/* Lucky Indicators Row */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">शुभ रंग:</span>
                    <strong className="text-amber-400 font-bold block truncate">{rashi.luckyColor}</strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">लकी नंबर:</span>
                    <strong className="text-emerald-400 font-mono font-bold block">{rashi.luckyNumber}</strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">शुभ समय:</span>
                    <strong className="text-sky-300 font-bold block text-[10px] truncate">{rashi.luckyTime.split(' - ')[0]}</strong>
                  </div>
                </div>

                {/* Horoscope Description */}
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed pt-1">
                  <p>
                    <strong className="text-amber-400">दैनिक फल: </strong>
                    {rashi.overview}
                  </p>

                  <p>
                    <strong className="text-emerald-400">कैरियर व धन: </strong>
                    {rashi.careerFinance}
                  </p>

                  <p>
                    <strong className="text-sky-400">स्वास्थ्य व परिवार: </strong>
                    {rashi.healthWellness}
                  </p>
                </div>
              </div>

              {/* Astrological Remedy & Popup button */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                  <strong className="text-white block mb-0.5">🌟 आज का शुभ उपाय:</strong>
                  {rashi.remedy}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setModalRashiId(rashi.id);
                    setIsRashifalModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>विस्तृत पॉपअप विंडो में देखें ➔</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Festival Welcome Modal */}
      <DailyFestivalWelcomeModal
        festival={panchang.festivalsToday}
        isOpen={isFestivalModalOpen}
        onClose={() => setIsFestivalModalOpen(false)}
        onOpenRashifal={() => setIsRashifalModalOpen(true)}
      />

      {/* Daily Rashifal Modal */}
      <DailyRashifalModal
        isOpen={isRashifalModalOpen}
        onClose={() => setIsRashifalModalOpen(false)}
        defaultRashiId={modalRashiId}
      />

    </div>
  );
};
