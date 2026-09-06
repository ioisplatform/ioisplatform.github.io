import React, { useState, useEffect } from 'react';
import { getLivePanchang, getDailyRashifalForToday } from '../services/liveUtilityService';
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
  CheckCircle2
} from 'lucide-react';

export const PanchangRashifalPage: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [selectedRashiId, setSelectedRashiId] = useState<string>('all');
  const [panchang] = useState(getLivePanchang());
  const [rashifalList] = useState<RashiForecast[]>(getDailyRashifalForToday());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* 1. Header with Clock & Panchang Highlights */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>वैदिक ज्योतिष, दैनिक पंचांग व 12 राशि भविष्य 2026</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
          लाइव डिजिटल-एनालॉग घड़ी, पंचांग व दैनिक राशिफल
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          शुभ मुहूर्त, राहु काल, चौघड़िया मुहूर्त तथा अपनी राशि का आज का लकी कलर, लकी नंबर व सफलता उपाय।
        </p>
      </div>

      {/* 2. Top Row: Live System Clock & Hindu Panchang */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Realistic Live Analog & Digital Clock */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center space-y-6 shadow-2xl">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="gold-metallic-text font-black uppercase text-sm sm:text-base tracking-wider">
              Live System Analog Clock
            </h3>
          </div>

          {/* Smooth Analog Dial */}
          <div className="clock-container my-2">
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
          <div className="w-full">
            <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-widest">
              {digitalTimeStr}
            </div>
            <div className="text-xs text-amber-400 mt-2 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{panchang.dateHindi}</span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Live Panchang Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-black text-white">
                आज का सम्पूर्ण वैदिक पंचांग
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {panchang.samvat}
            </span>
          </div>

          {/* Panchang Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">तिथि (Tithi):</span>
              <strong className="text-white font-bold">{panchang.tithi}</strong>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">नक्षत्र (Nakshatra):</span>
              <strong className="text-amber-300 font-bold">{panchang.nakshatra}</strong>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">योग व करण:</span>
              <strong className="text-sky-300 font-bold">{panchang.yoga} | {panchang.karana}</strong>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">पक्ष व ऋतु:</span>
              <strong className="text-emerald-400 font-bold">{panchang.paksha} • {panchang.ritu}</strong>
            </div>
          </div>

          {/* Shubh & Ashubh Muhurat Timings */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-emerald-300 font-bold">✨ अभिजीत मुहूर्त (सर्वश्रेष्ठ समय):</span>
              <strong className="text-white font-mono">{panchang.abhijitMuhurat}</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <span className="text-rose-300 font-bold">⛔ राहु काल (अशुभ समय):</span>
              <strong className="text-rose-200 font-mono">{panchang.rahuKaal}</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-amber-300 font-bold">🌟 अमृत चौघड़िया:</span>
              <strong className="text-amber-200 font-mono">{panchang.choghadiya.amrit}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 12 RASHI DAINIK RASHIFAL SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>दैनिक 12 राशि भविष्य (12 Zodiac Daily Horoscope)</span>
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
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 transition shadow-xl space-y-4 flex flex-col justify-between"
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
                    <span className="text-[10px] text-slate-400 block">शुभ रंग:</span>
                    <strong className="text-amber-400 font-bold block truncate">{rashi.luckyColor}</strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">लकी नंबर:</span>
                    <strong className="text-emerald-400 font-mono font-bold block">{rashi.luckyNumber}</strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">शुभ समय:</span>
                    <strong className="text-sky-300 font-bold block text-[10px] truncate">{rashi.luckyTime.split(' - ')[0]}</strong>
                  </div>
                </div>

                {/* Horoscope Description */}
                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed pt-1">
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

              {/* Astrological Remedy */}
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                <strong className="text-white block mb-0.5">🌟 आज का शुभ उपाय:</strong>
                {rashi.remedy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
