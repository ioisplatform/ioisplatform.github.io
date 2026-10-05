import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  HelpCircle, 
  Award, 
  Users, 
  Calculator,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Tv,
  Pencil,
  FileCheck2,
  Play,
  ExternalLink,
  GraduationCap,
  Smile,
  CheckCircle2
} from 'lucide-react';

interface HeroBannerProps {
  selectedCategory: 'all' | 'starter' | 'career' | 'master';
  onSelectCategory: (cat: 'all' | 'starter' | 'career' | 'master') => void;
  onOpenAiAdvisor: () => void;
  onOpenStudyPage: (planId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenAiAdvisor,
  onOpenStudyPage
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-slate-50 pt-6 pb-12 border-b border-slate-200 overflow-hidden">
      
      {/* Decorative Warm Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-200/25 rounded-full blur-3xl pointer-events-none -ml-20" />
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-emerald-200/25 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Student Motivational Greeting */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-6">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-amber-200 text-amber-900 shadow-sm font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>🇮🇳 भारत का अपना संपूर्ण छात्र एवं कौशल मंच (IOIS Student Hub)</span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1 rounded-full text-[11px] font-bold text-orange-950 border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span><strong>आज का सुविचार:</strong> "शिक्षा वह सबसे शक्तिशाली हथियार है जिससे आप दुनिया को बदल सकते हैं।"</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            सीखें, अभ्यास करें और <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">आगे बढ़ें</span>
          </h1>

          <p className="text-base sm:text-xl font-bold text-slate-700">
            कक्षा 1 से 12 एवं आधुनिक कौशल: 7 संपूर्ण योजनाएं, वीडियो कक्षाएं, डिजिटल ट्रेसिंग व होमवर्क सिस्टम
          </p>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            हर छात्र के लिए संपूर्ण अध्ययन किट — सचित्र नोट्स, इंटरएक्टिव वीडियो कक्षाएं, हाथ से लिखने का डिजिटल अक्षर ट्रेसिंग पैड, दैनिक गृहकार्य एवं त्वरित 50% से 70% तक रेफरल इंसेंटिव।
          </p>

          {/* 4 Interactive Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 max-w-3xl mx-auto">
            
            <button
              onClick={() => onOpenStudyPage('plan-01')}
              className="p-3 bg-white hover:bg-orange-50/80 rounded-2xl border border-slate-200 hover:border-orange-300 shadow-sm transition-all hover:scale-105 flex items-center gap-2 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-900 block">स्टडी नोट्स</span>
                <span className="text-[10px] text-slate-500 block">सचित्र व द्विभाषी</span>
              </div>
            </button>

            <button
              onClick={() => onOpenStudyPage('plan-01')}
              className="p-3 bg-white hover:bg-red-50/80 rounded-2xl border border-slate-200 hover:border-red-300 shadow-sm transition-all hover:scale-105 flex items-center gap-2 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-900 block">वीडियो कक्षाएं</span>
                <span className="text-[10px] text-slate-500 block">HD वीडियो पाठ</span>
              </div>
            </button>

            <button
              onClick={() => onOpenStudyPage('plan-01')}
              className="p-3 bg-white hover:bg-purple-50/80 rounded-2xl border border-slate-200 hover:border-purple-300 shadow-sm transition-all hover:scale-105 flex items-center gap-2 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Pencil className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-900 block">अक्षर ट्रेसिंग</span>
                <span className="text-[10px] text-slate-500 block">हैंडराइटिंग पैड</span>
              </div>
            </button>

            <button
              onClick={() => onOpenStudyPage('plan-01')}
              className="p-3 bg-white hover:bg-emerald-50/80 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all hover:scale-105 flex items-center gap-2 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-900 block">दैनिक होमवर्क</span>
                <span className="text-[10px] text-slate-500 block">जांच व अंक सिस्टम</span>
              </div>
            </button>

          </div>

        </div>

        {/* PROMINENT OFFICIAL VIDEO SHOWCASE CARD */}
        <div className="mt-8 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Video Info & Direct Watch Button */}
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black border border-red-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>आधिकारिक वीडियो गाइड (IOIS Official Video Classroom)</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                डिजिटल शिक्षा, दृश्य पाठ एवं स्मार्ट स्टडी गाइड
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                IOIS का आधिकारिक सचित्र वीडियो सेशन — जिसमें वर्णमाला उच्चारण, डिजिटल नोट्स, अक्षर ट्रेसिंग और होमवर्क करने की सरल विधि विस्तार से समझाई गई है।
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <button
                  onClick={() => onOpenStudyPage('plan-01')}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>वीडियो क्लास देखें</span>
                </button>

                <button
                  onClick={() => onOpenStudyPage('plan-01')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold border border-white/20 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>प्लान 01 स्टडी पेज में खोलें</span>
                </button>
              </div>
            </div>

            {/* Right: Video Thumbnail Preview Box */}
            <div
              onClick={() => onOpenStudyPage('plan-01')}
              className="relative w-full md:w-72 aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/20 shadow-2xl group shrink-0 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80"
                alt="IOIS Video Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm p-1.5 rounded-lg text-[10px] text-center font-mono text-slate-300">
                12:45 Min • HD Video Class
              </div>
            </div>

          </div>
        </div>

        {/* 7 Plans Category Pills Bar */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-300 shadow-sm overflow-x-auto max-w-full">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              सभी 7 प्लान (₹10 - ₹999)
            </button>
            <button
              onClick={() => onSelectCategory('starter')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'starter'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              शुरुआती (बाल विकास व यूथ)
            </button>
            <button
              onClick={() => onSelectCategory('career')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'career'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              करियर, फैमिली व बोर्ड एलीट
            </button>
            <button
              onClick={() => onSelectCategory('master')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'master'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              एजेंसी व सुप्रीम मास्टर
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
