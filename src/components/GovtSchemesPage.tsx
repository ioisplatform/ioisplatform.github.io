import React, { useState } from 'react';
import { 
  GOVT_PORTALS_DIRECTORY, 
  GOVT_RULES_AND_LAWS 
} from '../services/liveUtilityService';
import { GovtPortal, GovtRuleLaw } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Scale, 
  AlertTriangle,
  Users
} from 'lucide-react';

export const GovtSchemesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'portals' | 'rules'>('portals');

  const filteredPortals = GOVT_PORTALS_DIRECTORY.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.purposeHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'सभी वेबसाइट्स (All)' },
    { id: 'identity', label: '🪪 पहचान व दस्तावेज (Aadhaar/DigiLocker)' },
    { id: 'finance', label: '💳 पैन, इनकम टैक्स व PF' },
    { id: 'farmers', label: '🌾 किसान व राशन कार्ड' },
    { id: 'health', label: '🏥 आयुष्मान भारत व स्वास्थ्य' },
    { id: 'land', label: '🗺️ भूलेख व जमीन खतौनी' },
    { id: 'transport', label: '🚗 ड्राइविंग लाइसेंस व वाहन' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header with Tab Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              <span>आधिकारिक सरकारी सेवाएं, योजनाएं व कानूनी मार्गदर्शिका 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              महत्वपूर्ण सरकारी वेबसाइट्स, योजनाएं एवं नियम
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              जानिए किस वेबसाइट से क्या काम होता है और घर बैठे उसका सही इस्तेमाल कैसे करें।
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('portals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'portals'
                  ? 'bg-indigo-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>सरकारी पोर्टल्स डायरेक्टरी</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>नए नियम व नागरिक कानून</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB 1: OFFICIAL GOVERNMENT WEBSITES DIRECTORY */}
      {activeTab === 'portals' && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="योजना, सेवा या वेबसाइट खोजें (उदा: आधार, राशन, पैन, खतौनी, PF, आयुष्मान)..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-400 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white font-black shadow-md'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Portals Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPortals.map((portal) => (
              <div
                key={portal.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 transition flex flex-col justify-between space-y-5 shadow-xl"
              >
                <div className="space-y-4">
                  {/* Header & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                        {portal.shortName}
                      </span>
                      <h3 className="text-lg font-black text-white mt-1.5">{portal.name}</h3>
                    </div>

                    <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold shrink-0">
                      {portal.badge}
                    </span>
                  </div>

                  {/* 1. What does this site do? (किस वेबसाइट से क्या होगा?) */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>किस वेबसाइट से क्या काम होगा?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {portal.purposeHindi}
                    </p>
                  </div>

                  {/* 2. Key Services */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      मुख्य ऑनलाइन सुविधाएं:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {portal.keyServices.map((srv, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{srv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Step-by-Step Guide on How to Use (कैसे इस्तेमाल करें?) */}
                  <div className="p-3.5 bg-indigo-950/20 rounded-2xl border border-indigo-500/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>कैसे इस्तेमाल करें (Step-by-Step Guide):</span>
                    </div>
                    <ol className="space-y-1.5 text-[11px] text-slate-300 list-decimal pl-4 leading-relaxed">
                      {portal.howToUse.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Direct Official Link Button */}
                <div className="pt-2">
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>आधिकारिक पोर्टल पर जाएं (Open Official Portal)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB 2: RULES & LAWS */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm">
            <strong className="text-white font-bold block mb-1">नागरिक अधिकार व नवीनतम सरकारी नियम 2026:</strong>
            डिजिटल बैंकिंग, यातायात, साइबर सुरक्षा व उपभोक्ता संरक्षण से जुड़े कानूनी अधिकार जिन्हें हर भारतीय नागरिक को जानना चाहिए।
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GOVT_RULES_AND_LAWS.map((rule) => (
              <div
                key={rule.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 transition flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {rule.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{rule.effectiveDate}</span>
                  </div>

                  <h3 className="text-base font-black text-white leading-snug">{rule.title}</h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rule.summary}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  <strong className="text-emerald-400 block mb-0.5">नागरिक लाभ / असर:</strong>
                  {rule.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
