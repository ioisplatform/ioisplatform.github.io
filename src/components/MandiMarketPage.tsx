import React, { useState } from 'react';
import { 
  LIVE_MANDI_ITEMS, 
  LIVE_BULLION_RATES, 
  LIVE_MARKET_DEALS 
} from '../services/liveUtilityService';
import { MandiItem, BullionRate, MarketDeal } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Search, 
  Sparkles, 
  Scale, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  Building2, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

export const MandiMarketPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mandi' | 'bullion' | 'deals'>('mandi');
  const [mandiSearch, setMandiSearch] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const filteredMandi = LIVE_MANDI_ITEMS.filter((item) => {
    const matchesSearch = 
      item.cropName.toLowerCase().includes(mandiSearch.toLowerCase()) ||
      item.mandiName.toLowerCase().includes(mandiSearch.toLowerCase()) ||
      item.state.toLowerCase().includes(mandiSearch.toLowerCase());
    
    if (selectedCrop === 'all') return matchesSearch;
    return matchesSearch && item.cropName.toLowerCase().includes(selectedCrop.toLowerCase());
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header with Tab Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>लाइव कृषि मंडी, सराफा बाजार व सस्ता-महंगा गाइड 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              लाइव मंडी भाव, सोना-चांदी व मार्केट डील्स
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              फसलों के ताजा भाव, 10 प्रमुख शहरों के 24K/22K गोल्ड रेट एवं आज की सर्वश्रेष्ठ बचत डील्स।
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('mandi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mandi'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>लाइव मंडी भाव</span>
            </button>

            <button
              onClick={() => setActiveTab('bullion')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bullion'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>सोना-चांदी (Gold/Silver)</span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'deals'
                  ? 'bg-sky-500 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>सस्ता vs महंगा (Smart Deals)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB 1: LIVE MANDI BHAV */}
      {activeTab === 'mandi' && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mandiSearch}
                onChange={(e) => setMandiSearch(e.target.value)}
                placeholder="फसल, मंडी या राज्य का नाम खोजें..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>

            {/* Quick Crop Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'सभी फसलें' },
                { id: 'गेहूं', label: 'गेहूं' },
                { id: 'धान', label: 'धान' },
                { id: 'सरसों', label: 'सरसों' },
                { id: 'सोयाबीन', label: 'सोयाबीन' },
                { id: 'लहसुन', label: 'लहसुन' },
                { id: 'प्याज', label: 'प्याज' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedCrop === c.id
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mandi Cards / Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredMandi.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-400/50 transition flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        {item.cropName}
                        <span className="text-xs text-slate-400 font-normal">({item.variety})</span>
                      </h3>
                      <p className="text-xs text-emerald-400 font-bold mt-0.5">
                        📍 {item.mandiName} • <span className="text-slate-300">{item.state}</span>
                      </p>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      item.trend === 'up'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : item.trend === 'down'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                      {item.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{item.change > 0 ? `+₹${item.change}` : item.change < 0 ? `-₹${Math.abs(item.change)}` : 'स्थिर'}</span>
                    </div>
                  </div>

                  {/* Price Matrix */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">न्यूनतम भाव</span>
                      <strong className="text-sm font-mono text-slate-300">₹{item.minPrice}</strong>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 font-bold block">मॉडल (औसत) भाव</span>
                      <strong className="text-base font-mono text-emerald-300 font-black">₹{item.modalPrice}</strong>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">उच्चतम भाव</span>
                      <strong className="text-sm font-mono text-amber-300">₹{item.maxPrice}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>कुल आवक: <strong className="text-white">{item.arrivalQty}</strong></span>
                  <span>अपडेट: {item.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB 2: LIVE GOLD & SILVER RATES */}
      {activeTab === 'bullion' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-300 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block font-bold">भारतीय सराफा बाजार (24K, 22K व चांदी लाइव भाव):</strong>
                <span>सभी दरें बिना GST के प्रति 10 ग्राम (सोना) और प्रति 1 किलोग्राम (चांदी) में हैं।</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full font-black text-xs shrink-0">
              ● लाइव अपडेट 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LIVE_BULLION_RATES.map((rate, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 transition shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-black text-white">{rate.city}</h3>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    +₹{rate.goldChange} आज
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-amber-400 font-bold">सोना 24K (99.9% शुद्ध):</span>
                    <strong className="text-white font-mono font-black text-sm">₹{rate.gold24k.toLocaleString('en-IN')}/10g</strong>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">सोना 22K (आभूषण सोना):</span>
                    <strong className="text-amber-300 font-mono font-bold text-sm">₹{rate.gold22k.toLocaleString('en-IN')}/10g</strong>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">सोना 18K:</span>
                    <strong className="text-slate-300 font-mono text-xs">₹{rate.gold18k.toLocaleString('en-IN')}/10g</strong>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30">
                    <span className="text-sky-300 font-bold">चांदी (Silver 1 Kg):</span>
                    <strong className="text-white font-mono font-black text-sm">₹{rate.silver1kg.toLocaleString('en-IN')}/kg</strong>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-right">
                  अपडेट: {rate.updatedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 3: SMART DEALS (SASTA VS MEHNGA) */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs sm:text-sm">
            <strong className="text-white font-bold block mb-1">💡 आज की लाइव डील एवं स्मार्ट खरीदारी गाइड (कहाँ क्या सस्ता?):</strong>
            जानें कौन सा सामान किस प्लेटफॉर्म या मंडी से खरीदने पर सबसे ज्यादा बचत होगी और फिजूलखर्ची से कैसे बचें।
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LIVE_MARKET_DEALS.map((deal) => (
              <div
                key={deal.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-sky-400/50 transition flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                        {deal.category}
                      </span>
                      <h3 className="text-base font-black text-white mt-1">{deal.item}</h3>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/40">
                      {deal.discountPct}% छूट
                    </span>
                  </div>

                  {/* Price Comparison Block */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                      <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">✅ सबसे सस्ता स्रोत:</span>
                      <strong className="text-white block font-bold">{deal.cheapestSource}</strong>
                      <div className="text-emerald-300 font-mono font-black text-base mt-1">₹{deal.bestPrice}</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs">
                      <span className="text-[10px] text-rose-400 font-bold block mb-0.5">❌ महंगा स्रोत:</span>
                      <span className="text-slate-300 block">{deal.expensiveSource}</span>
                      <div className="text-rose-300 font-mono text-xs mt-1">MRP: ₹{deal.mrp}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-amber-400 block mb-0.5">🎯 स्मार्ट बाइंग टिप:</strong>
                    {deal.buyingTip}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">सीधी बचत:</span>
                  <strong className="text-emerald-400 font-bold font-mono text-sm">₹{deal.priceDiff} बचेंगे</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
