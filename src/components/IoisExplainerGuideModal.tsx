import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Crown, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Store, 
  Award, 
  Send, 
  DollarSign, 
  Layers, 
  FileText, 
  CreditCard,
  Flame,
  Star
} from 'lucide-react';
import { PLANS, OFFICIAL_TELEGRAM_URL } from '../data/plansData';

interface IoisExplainerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanForRegister?: (planId: number) => void;
  onNavigateToPlans?: () => void;
  onOpenRegister?: () => void;
}

export const IoisExplainerGuideModal: React.FC<IoisExplainerGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectPlanForRegister,
  onNavigateToPlans,
  onOpenRegister
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'what' | 'how' | 'why' | 'inside' | 'plans' | 'best'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-4 sm:px-6 py-4 bg-gradient-to-r from-amber-600/30 via-slate-900 to-emerald-600/30 border-b border-amber-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shrink-0">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  IOIS OFFICIAL GUIDE
                </span>
                <span className="text-[10px] font-bold text-emerald-400 hidden xs:inline">
                  ⚡ 50% से 70% इंस्टेंट पेआउट
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-1.5 mt-0.5">
                <span>IOIS क्या है और कौनसा प्लान चुनें?</span>
                <span className="text-amber-400 text-xs sm:text-sm font-bold">(संपूर्ण गाइड)</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 cursor-pointer shrink-0"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0 text-xs">
          {[
            { id: 'all', label: '🌟 सब कुछ देखें' },
            { id: 'what', label: '1. IOIS क्या है?' },
            { id: 'how', label: '2. यह कैसे काम करता है?' },
            { id: 'why', label: '3. क्यों ज्वाइन करें?' },
            { id: 'inside', label: '4. इसके अंदर क्या है?' },
            { id: 'plans', label: '5. क्या प्लान हैं?' },
            { id: 'best', label: '👑 कौनसा प्लान सबसे अच्छा है?' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm leading-relaxed">
          
          {/* QUESTION 1: IOIS क्या है? */}
          {(activeTab === 'all' || activeTab === 'what') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border-2 border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm sm:text-base">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <h3>1. IOIS क्या है? (What is IOIS?)</h3>
              </div>
              <p className="text-slate-300">
                <strong>भारतीय ऑनलाइन आय सहयोग प्रणाली (Indian Online Income Supporting System - IOIS)</strong> एक 100% वैध, पारदर्शी और डिजिटल सशक्तिकरण प्लेटफॉर्म है। यह देश के स्कूली छात्रों, प्रतियोगी परीक्षा की तैयारी कर रहे युवाओं, महिलाओं, दुकानदारों और कॉमन सर्विस सेंटर (CSC) संचालकों को डिजिटल संसाधन, आधिकारिक डिजिटल ID कार्ड और <strong>प्रत्येक रेफरल पर सीधा 50% से 70% तक इंस्टेंट इंसेंटिव</strong> प्रदान करता है।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>100% शून्य जोखिम:</strong> मात्र ₹10 से शुरुआत</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>इंस्टेंट UPI पेआउट:</strong> कोई पेंडिंग नहीं</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span><strong>QR वेरिफाइड:</strong> डिजिटल ID कार्ड</span>
                </div>
              </div>
            </div>
          )}

          {/* QUESTION 2: यह कैसे काम करता है? */}
          {(activeTab === 'all' || activeTab === 'how') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border-2 border-sky-500/40 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-black text-sm sm:text-base">
                <Zap className="w-5 h-5 text-sky-400 shrink-0" />
                <h3>2. यह कैसे काम करता है? (How It Works - 3 आसान स्टेप्स)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-500/30 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-black text-xs flex items-center justify-center">
                    01
                  </div>
                  <h4 className="font-black text-white text-xs sm:text-sm">प्लान चुनें व रजिस्टर करें</h4>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    ₹10 से ₹999 के 7 मास्टर प्लान्स में से अपनी पसंद का प्लान चुनें। अपना UPI ID दर्ज करें जिस पर आप पेआउट लेना चाहते हैं।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center">
                    02
                  </div>
                  <h4 className="font-black text-white text-xs sm:text-sm">डिजिटल ID कार्ड व सामग्री पाएं</h4>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    तुरंत आपका आधिकारिक QR वेरिफाइड ID कार्ड, स्पॉन्सर कोड, NCERT नोट्स और डिजिटल रिसोर्स किट जनरेट होकर मिल जाती है।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center">
                    03
                  </div>
                  <h4 className="font-black text-white text-xs sm:text-sm">रेफर करें और 50%-70% पाएं</h4>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    अपने दोस्तों व छात्रों को अपना रेफरल लिंक या पोस्टर शेयर करें। आपके लिंक से जुड़ने पर सीधा 50% से 70% इंसेंटिव तुरंत प्राप्त होता है।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QUESTION 3: IOIS क्यों ज्वाइन करे? */}
          {(activeTab === 'all' || activeTab === 'why') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm sm:text-base">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3>3. IOIS क्यों ज्वाइन करें? (Why Join IOIS?)</h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2 p-2 rounded-xl bg-slate-900">
                  <span className="text-emerald-400 font-bold shrink-0">✔</span>
                  <span><strong>भारत का सर्वाधिक पेआउट:</strong> प्रत्येक रेफरल पर 50% से 70% सीधा इंसेंटिव।</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-xl bg-slate-900">
                  <span className="text-emerald-400 font-bold shrink-0">✔</span>
                  <span><strong>कोई हिडन चार्ज नहीं:</strong> न कोई मंथली रिन्यूअल फीस, न कोई छिपी कटौती।</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-xl bg-slate-900">
                  <span className="text-emerald-400 font-bold shrink-0">✔</span>
                  <span><strong>शिक्षा व छात्र कल्याण:</strong> NCERT क्लास 1-12 बुक्स, फॉर्मूले व नोट्स मुफ्त।</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-xl bg-slate-900">
                  <span className="text-emerald-400 font-bold shrink-0">✔</span>
                  <span><strong>सरकारी सेवाएं 1-क्लिक में:</strong> RTPS, जमीन-नक्शा, जमाबंदी, LPC व योजनाओं की सीधी लिंक।</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-xl bg-slate-900">
                  <span className="text-emerald-400 font-bold shrink-0">✔</span>
                  <span><strong>ऑटो पोस्टर स्टूडियो:</strong> दुकान या WhatsApp स्टेटस हेतु आपका पर्सनल पोस्टर 1-क्लिक में तैयार।</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-xl bg-slate-900">
                  <span className="text-emerald-400 font-bold shrink-0">✔</span>
                  <span><strong>24x7 टेलीग्राम हेल्पलाइन:</strong> किसी भी समस्या पर तुरंत आधिकारिक मानवीय सहायता।</span>
                </li>
              </ul>
            </div>
          )}

          {/* QUESTION 4: इसके अंदर क्या-क्या है? */}
          {(activeTab === 'all' || activeTab === 'inside') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border-2 border-violet-500/40 space-y-3">
              <div className="flex items-center gap-2 text-violet-400 font-black text-sm sm:text-base">
                <Layers className="w-5 h-5 text-violet-400 shrink-0" />
                <h3>4. इसके अंदर क्या-क्या है? (What's Inside IOIS Portal?)</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-amber-400 font-black flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>7 मास्टर प्लांस</span>
                  </div>
                  <p className="text-[11px] text-slate-400">₹10 से ₹999 तक के किफायती प्लान्स और 50%-70% पेआउट।</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-sky-400 font-black flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>डिजिटल ID कार्ड</span>
                  </div>
                  <p className="text-[11px] text-slate-400">QR कोड वेरिफिकेशन युक्त प्रोफेशनल स्टूडेंट व मेंबर ID कार्ड।</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-black flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>विद्यार्थी नोट्स हब</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Class 1-12 NCERT, गणित सूत्र, साइंस नोट्स और बोनाफाइड सर्टिफिकेट।</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-orange-400 font-black flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>RTPS व जमीन पोर्टल</span>
                  </div>
                  <p className="text-[11px] text-slate-400">जाति, आय, निवास, दाखिल-खारिज, खतियान, LPC व भू-नक्शा गाइड।</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-pink-400 font-black flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>प्रचार पोस्टर स्टूडियो</span>
                  </div>
                  <p className="text-[11px] text-slate-400">दुकान, CSC और WhatsApp स्टेटस हेतु 4 टेम्पलेट्स में पोस्टर क्रिएटर।</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-yellow-400 font-black flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>लाइव यूटिलिटी सेवाएं</span>
                  </div>
                  <p className="text-[11px] text-slate-400">लाइव मौसम, दैनिक पंचांग, रोजगार अलर्ट, मंडी भाव व मनोरंजन।</p>
                </div>
              </div>
            </div>
          )}

          {/* QUESTION 5: क्या प्लान है? (All 7 Plans Breakdown) */}
          {(activeTab === 'all' || activeTab === 'plans') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border-2 border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm sm:text-base">
                  <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                  <h3>5. क्या प्लान है? (IOIS के सभी 7 मास्टर प्लान्स)</h3>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                  सीधा 50% से 70% इंसेंटिव
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PLANS.map((plan) => (
                  <div 
                    key={plan.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{plan.code}</span>
                        <h4 className="font-black text-white text-xs sm:text-sm">{plan.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-black text-white">₹{plan.price}</span>
                        <div className="text-[10px] font-bold text-emerald-400">
                          ⚡ ₹{plan.instantPayout} ({plan.percentage}%) पेआउट
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {plan.tagline} • {plan.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[170px]">
                        🎯 {plan.recommendedFor}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onSelectPlanForRegister) onSelectPlanForRegister(plan.id);
                          else if (onOpenRegister) onOpenRegister();
                        }}
                        className="btn-3d-rainbow text-black font-black text-[10px] px-2.5 py-1 rounded-lg cursor-pointer shrink-0"
                      >
                        प्लान चुनें ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 6: क्या चुनना चाहिये / कौनसा प्लान सबसे अच्छा है? */}
          {(activeTab === 'all' || activeTab === 'best') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-950 to-emerald-500/15 border-2 border-amber-400 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base">
                <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                <h3>6. क्या चुनना चाहिये और कौनसा प्लान सबसे अच्छा है? (Expert Recommendation)</h3>
              </div>
              
              <div className="space-y-3">
                {/* Recommendation 1: For Beginners & Students */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-orange-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-black uppercase">
                      <GraduationCap className="w-3 h-3" />
                      <span>छात्रों व शुरुआती यूजर हेतु</span>
                    </span>
                    <span className="text-xs font-black text-white">Plan 01 (₹10) या Plan 02 (₹49)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>क्यों चुनें:</strong> मात्र ₹10 या ₹49 में (एक कप चाय के खर्च में) आपको सिस्टम वेरिफिकेशन पास, डिजिटल ID कार्ड और <strong>सीधा 70% पेआउट (₹7 या ₹34)</strong> मिलता है। बिना किसी डर या संकोच के सिस्टम को आजमाने के लिए यह सर्वोत्तम है।
                  </p>
                </div>

                {/* Recommendation 2: For Job Seekers & Youth */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-black uppercase">
                      <Star className="w-3 h-3 text-sky-400" />
                      <span>लोकप्रिय (युवा व नौकरी प्रतियोगी)</span>
                    </span>
                    <span className="text-xs font-black text-white">Plan 03 (₹99) या Plan 04 (₹199)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>क्यों चुनें:</strong> इसमें प्रोफेशनल ATS रिज्यूमे / CV फॉर्मेट, सरकारी परीक्षा नोट्स, इंटरव्यू क्वेश्चन बैंक और प्रति रेफरल ₹64 से ₹119 का मजबूत पेआउट मिलता है।
                  </p>
                </div>

                {/* Recommendation 3: BEST VALUE / LIFETIME RECOMMENDED */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-emerald-500/25 border-2 border-amber-400 shadow-lg space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase shadow-md">
                      <Crown className="w-3.5 h-3.5" />
                      <span>👑 सबसे अच्छा व सर्वोत्तम प्लान (BEST VALUE & RECOMMENDED)</span>
                    </span>
                    <span className="text-sm font-black text-amber-300">Plan 07: Master Lifetime (₹999)</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    <strong>क्यों है यह सबसे बेहतरीन:</strong>
                  </p>
                  <ul className="text-xs space-y-1 text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">★</span>
                      <span><strong>ऑल-इन-वन एक्सेस:</strong> सभी 6 प्लान्स के संपूर्ण नोट्स, टूल्स, और सेवाएं हमेशा के लिए अनलॉक्ड।</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">★</span>
                      <span><strong>सर्वाधिक पेआउट:</strong> प्रत्येक रेफरल पर <strong>सीधा ₹499 इंस्टेंट पेआउट</strong> (मात्र 2 रेफरल में आपकी पूरी लागत वापस, बाकी सब 100% शुद्ध लाभ!)।</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">★</span>
                      <span><strong>CSC / साइबर कैफे / दुकानदारों के लिए:</strong> मास्टर रीसेलर राइट्स और लाइफटाइम फ्री अपडेट्स।</span>
                    </li>
                  </ul>
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onSelectPlanForRegister) onSelectPlanForRegister(7);
                        else if (onOpenRegister) onOpenRegister();
                      }}
                      className="btn-3d-rainbow-special px-4 py-2 rounded-xl text-black font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Plan 07 (₹999) अभी एक्टिवेट करें</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24x7 सहायता केंद्र उपलब्ध</span>
            <a
              href={OFFICIAL_TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 font-bold underline flex items-center gap-1 ml-1"
            >
              <Send className="w-3 h-3" />
              <span>Telegram हेल्पलाइन</span>
            </a>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigateToPlans) onNavigateToPlans();
              }}
              className="btn-3d-silver w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black text-slate-950 cursor-pointer"
            >
              सभी 7 प्लान्स देखें
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenRegister) onOpenRegister();
              }}
              className="btn-3d-rainbow-special w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-black text-black cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>रजिस्ट्रेशन / Join Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
