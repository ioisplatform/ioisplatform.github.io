import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { UserProfile, PageType } from '../types';
import { PLANS, OFFICIAL_PHONE } from '../data/plansData';
import { OFFICIAL_ROOT_SPONSOR_ID, OFFICIAL_ROOT_SPONSOR_NAME } from '../services/userService';
import { 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Wallet, 
  Palette, 
  MessageSquare, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Crown, 
  Zap, 
  Send,
  Sliders,
  CheckCircle2,
  FileImage,
  BadgeCheck,
  UserCheck
} from 'lucide-react';

interface ReferralPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenRegister?: (planId?: number, sponsorId?: string) => void;
  onOpenLogin?: (mode?: 'login' | 'forgot_user_id' | 'forgot_password') => void;
  onNavigate?: (page: PageType) => void;
}

export const ReferralPromotionModal: React.FC<ReferralPromotionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenRegister,
  onOpenLogin,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'referral_dashboard' | 'income_table' | 'poster_maker' | 'marketing_kit'>('referral_dashboard');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  // Earning Calculator state
  const [simulatedPlanId, setSimulatedPlanId] = useState<number>(7);
  const [simulatedCount, setSimulatedCount] = useState<number>(10);

  // Poster Maker State
  const [posterSlogan, setPosterSlogan] = useState<string>('घर बैठे डिजिटल स्किल सीखें और 50%-70% इंसेंटिव पाएं');
  const [posterTheme, setPosterTheme] = useState<'gold' | 'blue' | 'emerald' | 'tiranga' | 'dark'>('gold');
  const [posterCustomName, setPosterCustomName] = useState<string>(currentUser?.fullName || 'आधिकारिक डिजिटल प्रमोटर');
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);

  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const effectiveSponsorId = currentUser?.userId || OFFICIAL_ROOT_SPONSOR_ID;
  const effectiveUserName = currentUser?.fullName || OFFICIAL_ROOT_SPONSOR_NAME;
  const effectivePhoto = currentUser?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  const effectiveUserPlan = PLANS.find((p) => p.id === (currentUser?.selectedPlanId || 7)) || PLANS[6];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://iois.in';
  const referralUrl = `${origin}/?ref=${effectiveSponsorId}&sponsor=${effectiveSponsorId}`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(referralUrl)}&color=0f172a&bgcolor=ffffff`;

  // Calculated simulated earning
  const simulatedPlan = PLANS.find((p) => p.id === simulatedPlanId) || PLANS[6];
  const totalSimulatedIncome = simulatedPlan.instantPayout * simulatedCount;

  // Copy helper
  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(label);
      setTimeout(() => setCopiedMsg(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyLink = async () => {
    await handleCopy(referralUrl, 'लिंक कॉपी हो गया!');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // WhatsApp Share with viral Hindi promo copy
  const handleWhatsAppShare = () => {
    const message = `🇮🇳 *भारतीय ऑनलाइन आय एवं स्वावलंबन मिशन (IOIS 2026)* 📚✨\n\nनमस्ते! मैंने IOIS डिजिटल प्लेटफॉर्म जॉइन किया है जहाँ मात्र ₹10 से ₹999 में बेहतरीन स्टडी नोट्स, RTPS सेवाएं व करियर टूल्स मिलते हैं और प्रत्येक रेफरल पर *50% से 70% तक इंस्टेंट पेआउट* सीधे UPI/खाते में आता है।\n\n👉 *मेरी स्पॉन्सर लिंक से अभी जुड़ें व ID कार्ड पाएं:*\n${referralUrl}\n\n🏷️ *Sponsor ID:* ${effectiveSponsorId}\n👤 *प्रमोटर:* ${effectiveUserName}\n\n✅ 100% पारदर्शी, सुरक्षित एवं आधिकारिक पोर्टल।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Telegram Share
  const handleTelegramShare = () => {
    const text = `IOIS डिजिटल प्लेटफॉर्म: 50% से 70% इंसेंटिव आय एवं सम्पूर्ण डिजिटल सेवाएं। मेरी Sponsor ID [${effectiveSponsorId}] से अभी जुड़ें: ${referralUrl}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'IOIS Digital Platform - Referral Program',
          text: `IOIS पर जुड़ें और प्रत्येक सफल रेफरल पर 50% से 70% तक इंसेंटिव प्राप्त करें! Sponsor ID: ${effectiveSponsorId}`,
          url: referralUrl,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  // Poster Download
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      setIsGeneratingPoster(true);
      const canvas = await html2canvas(posterRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `IOIS-Promo-Poster-${effectiveSponsorId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCopiedMsg('HD प्रचार पोस्टर सफलतापूर्वक डाउनलोड हो गया!');
      setTimeout(() => setCopiedMsg(null), 3000);
    } catch {
      // error
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  // Poster themes
  const getPosterThemeClasses = () => {
    switch (posterTheme) {
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-amber-950/60 to-black',
          border: 'border-2 border-amber-400',
          accent: 'text-amber-300',
          banner: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
        };
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-blue-950/70 to-slate-900',
          border: 'border-2 border-sky-400',
          accent: 'text-sky-300',
          banner: 'bg-gradient-to-r from-sky-400 to-blue-600 text-white',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
        };
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-emerald-950/70 to-slate-900',
          border: 'border-2 border-emerald-400',
          accent: 'text-emerald-300',
          banner: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
        };
      case 'tiranga':
        return {
          bg: 'bg-gradient-to-br from-orange-950/80 via-slate-950 to-emerald-950/80',
          border: 'border-2 border-amber-400',
          accent: 'text-amber-300',
          banner: 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 text-slate-950',
          badge: 'bg-orange-500/20 text-amber-300 border-amber-400/40',
        };
      case 'dark':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-neutral-900 to-black',
          border: 'border-2 border-slate-600',
          accent: 'text-slate-200',
          banner: 'bg-gradient-to-r from-slate-200 to-zinc-400 text-slate-950',
          badge: 'bg-slate-800 text-slate-200 border-slate-600',
        };
    }
  };

  const posterThemeStyle = getPosterThemeClasses();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-4xl rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.9)] relative text-white my-4 max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl logo-3d-box-rainbow p-0.5 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 text-black" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-wide truncate">
                  प्रचार, शेयरिंग व रेफरल स्टूडियो (Promotion Hub)
                </h3>
                <span className="hidden sm:inline-flex bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  50%-70% पेआउट
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                रेफरल लिंक शेयर करें, पोस्टर बनाएं और प्लान अनुसार प्रत्येक रेफरल पर तुरंत इंसेंटिव कमाएं
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0 font-bold"
            title="बंद करें"
          >
            ✕
          </button>
        </div>

        {/* Global Toast Alert if present */}
        {copiedMsg && (
          <div className="bg-emerald-500 text-slate-950 py-1.5 px-4 text-xs font-black text-center flex items-center justify-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{copiedMsg}</span>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-3 sm:px-5 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('referral_dashboard')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'referral_dashboard'
                ? 'btn-3d-gold text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>1. रेफरल लिंक व डैशबोर्ड</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('income_table')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'income_table'
                ? 'btn-3d-sapphire text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>2. प्लान अनुसार कमाई (7 Plans Income)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('poster_maker')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'poster_maker'
                ? 'btn-3d-rainbow text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-black" />
            <span className={activeTab === 'poster_maker' ? 'text-black' : ''}>3. प्रचार पोस्टर मेकर (HD PNG)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('marketing_kit')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'marketing_kit'
                ? 'btn-3d-emerald text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>4. रेडीमेड मार्केटिंग मैसेज</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: REFERRAL LINK & LIVE DASHBOARD OVERVIEW                            */}
          {/* ========================================================================= */}
          {activeTab === 'referral_dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Top Sponsor ID & Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>आपकी Sponsor ID</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono text-amber-300 truncate mt-1">
                    {effectiveSponsorId}
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold">✓ प्रमाणित रेफरल कोड</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>इंसेंटिव दर</span>
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-300 mt-1">
                    {effectiveUserPlan.percentage}% Payout
                  </div>
                  <span className="text-[9px] text-slate-400">प्लान 0{effectiveUserPlan.id} के अनुसार</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-sky-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>सक्रिय रेफरल सदस्य</span>
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono text-sky-300 mt-1">
                    {currentUser ? '12+ एक्टिव' : 'लाइव रेडी'}
                  </div>
                  <span className="text-[9px] text-slate-400">आपकी डायरेक्ट टीम</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>पेआउट स्टेटस</span>
                    <Wallet className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono text-purple-300 mt-1">
                    इंस्टेंट UPI
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold">✓ 0% डिले ट्रांसफर</span>
                </div>
              </div>

              {/* Unique Referral Link & 1-Click Copy Box */}
              <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-2 border-amber-400/60 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs sm:text-sm font-black text-amber-300 uppercase">
                      आपकी पर्सनल स्पॉन्सर रेफरल लिंक (Direct Referral URL)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    ऑटो-स्पॉन्सर बाइंडेड
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-xs text-amber-200 select-all truncate">
                    {referralUrl}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="btn-3d-gold px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-md active:scale-95"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                    <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  इस लिंक को अपने मित्रों, व्हाट्सएप ग्रुपों व सोशल मीडिया पर शेयर करें। जो भी व्यक्ति इस लिंक से जुड़ेगा, वह स्वतः आपके <strong>Sponsor ID ({effectiveSponsorId})</strong> से रजिस्टर होगा और आपको तुरंत प्लान अनुसार 50% से 70% इंसेंटिव मिलेगा।
                </p>
              </div>

              {/* Instant Social Sharing Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
                  तुरंत सोशल मीडिया पर शेयर करें:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="btn-3d-emerald py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>व्हाट्सएप पर शेयर</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTelegramShare}
                    className="btn-3d-sapphire py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>टेलीग्राम ग्रुप</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="btn-3d-rainbow py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition text-black"
                  >
                    <Share2 className="w-4 h-4 text-black" />
                    <span className="text-black font-black">सभी ऐप्स में शेयर</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('poster_maker')}
                    className="btn-3d-silver py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition"
                  >
                    <FileImage className="w-4 h-4 text-black" />
                    <span className="text-black font-black">HD पोस्टर बनाएं</span>
                  </button>
                </div>
              </div>

              {/* Referral QR Code Showcase */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2 bg-white rounded-2xl shadow-lg shrink-0">
                    <img src={qrImageSrc} alt="Referral QR Code" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>डायरेक्ट स्कैन व जॉइन</span>
                    </div>
                    <h4 className="text-sm font-black text-white">
                      आपका व्यक्तिगत रेफरल QR कोड
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md">
                      मित्रों को अपना QR कोड दिखाएं या स्टेटस पर लगाएं। कैमरे से स्कैन करते ही वे सीधे आपके स्पॉन्सर कोड से जुड़ेंगे।
                    </p>
                  </div>
                </div>

                <a
                  href={qrImageSrc}
                  download={`IOIS-QR-${effectiveSponsorId}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-3d-platinum px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 text-slate-950 shadow cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>QR डाउनलोड करें</span>
                </a>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DETAILED PLAN INCOME BREAKDOWN & LIVE SIMULATOR                    */}
          {/* ========================================================================= */}
          {activeTab === 'income_table' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Notice Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-amber-300 font-bold">100% पारदर्शी इंसेंटिव प्रोटोकॉल:</strong> नीचे दिए गए किसी भी प्लान में जब कोई नया सदस्य आपके स्पॉन्सर कोड से जुड़ता है, तो उसके एक्टिवेशन शुल्क का <strong>50% से 70% तक सीधा पेआउट</strong> आपके खाते में तुरंत जमा होता है।
                </div>
              </div>

              {/* 7 Plans Income Breakdown Cards / Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between">
                  <span>7 मास्टर प्लान्स - प्रति रेफरल कमाई तालिका:</span>
                  <span className="text-amber-400 font-bold text-[10px]">तत्काल UPI ट्रांसफर</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PLANS.map((plan) => {
                    return (
                      <div
                        key={plan.id}
                        className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                          plan.id === 7
                            ? 'bg-gradient-to-br from-amber-950/80 via-slate-950 to-slate-900 border-amber-400/80 shadow-lg'
                            : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {plan.id === 7 && (
                          <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                            👑 सर्वाधिक पेआउट (₹499)
                          </span>
                        )}

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                              {plan.code}
                            </span>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {plan.percentage}% Payout
                            </span>
                          </div>

                          <h5 className="text-sm font-black text-white truncate">
                            {plan.name}
                          </h5>

                          <div className="flex items-baseline gap-1 font-mono pt-1">
                            <span className="text-xs text-slate-400">जॉइनिंग शुल्क:</span>
                            <span className="text-base font-black text-white">₹{plan.price}</span>
                          </div>
                        </div>

                        {/* Direct Earning Highlight Box */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                          <div>
                            <span className="text-[9px] text-emerald-300 block uppercase font-bold">
                              आपको मिलेगा (प्रति रेफरल):
                            </span>
                            <span className="text-lg font-black font-mono text-emerald-400 leading-none">
                              ₹{plan.instantPayout}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-300 font-bold bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700">
                            सीधे UPI में
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Earning Simulator Slider */}
              <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm sm:text-base font-black text-white">
                      लाइव रेफरल आय सिमुलेटर (Live Earnings Simulator)
                    </h4>
                  </div>
                  <span className="text-xs font-black text-amber-300 font-mono">
                    ₹{simulatedPlan.instantPayout} × {simulatedCount} लोग
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Target Plan */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      प्लान चुनें जिसमें लोग जुड़ेंगे:
                    </label>
                    <select
                      value={simulatedPlanId}
                      onChange={(e) => setSimulatedPlanId(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
                    >
                      {PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code}: {p.name} (₹{p.price}) → ₹{p.instantPayout}/रेफरल
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Slider for count of referrals */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>रेफरल सदस्यों की संख्या:</span>
                      <span className="text-amber-400 font-mono font-black text-sm">{simulatedCount} सदस्य</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={simulatedCount}
                      onChange={(e) => setSimulatedCount(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>1 सदस्य</span>
                      <span>25 सदस्य</span>
                      <span>50 सदस्य</span>
                      <span>100 सदस्य</span>
                    </div>
                  </div>
                </div>

                {/* Big Calculated Output Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-2 border-emerald-400/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <span className="text-xs uppercase font-black text-emerald-300 tracking-wider block">
                      आपकी संभावित कुल सीधी कमाई (Instant Net Income):
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {simulatedCount} लोग {simulatedPlan.code} (₹{simulatedPlan.price}) से जुड़ेंगे = <strong>₹{simulatedPlan.instantPayout} × {simulatedCount}</strong>
                    </p>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 drop-shadow">
                      ₹{totalSimulatedIncome.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      100% डायरेक्ट इंसेंटिव
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PROMOTION POSTER MAKER & LIVE CUSTOMIZER                           */}
          {/* ========================================================================= */}
          {activeTab === 'poster_maker' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Customizer Controls Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>प्रचार पोस्टर कस्टमाइज़र (Poster Controls)</span>
                  </h4>
                  <span className="text-[10px] text-amber-400 font-bold">HD PNG एक्सपोर्ट रेडी</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Slogan Preset / Input */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">पोस्टर स्लोगन / मुख्य संदेश:</label>
                    <input
                      type="text"
                      value={posterSlogan}
                      onChange={(e) => setPosterSlogan(e.target.value)}
                      placeholder="पोस्टर की मुख्य लाइन लिखें..."
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  {/* Name on Poster */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">पोस्टर पर आपका नाम / उपाधि:</label>
                    <input
                      type="text"
                      value={posterCustomName}
                      onChange={(e) => setPosterCustomName(e.target.value)}
                      placeholder="आपका नाम..."
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                {/* Slogan Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-bold">सुझाए गए स्लोगन:</span>
                  {[
                    'घर बैठे डिजिटल स्किल सीखें और 50%-70% इंसेंटिव पाएं',
                    'मात्र ₹10 से ₹999 में शुरुआत करें और आत्मनिर्भर बनें',
                    'IOIS 2026: भारत का अपना डिजिटल लर्निंग व अर्निंग पोर्टल',
                    'विद्यार्थी व युवा रोज़गार स्वावलंबन मिशन'
                  ].map((slog, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPosterSlogan(slog)}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-[10px]"
                    >
                      {slog.slice(0, 28)}...
                    </button>
                  ))}
                </div>

                {/* Theme Selector for Poster */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 block">पोस्टर का थीम स्टाइल चुनें:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'gold', label: 'शाही स्वर्ण (Gold)' },
                      { id: 'blue', label: 'नीलम ओशन (Blue)' },
                      { id: 'emerald', label: 'वैदिक पन्ना (Green)' },
                      { id: 'tiranga', label: 'तिरंगा (Republic)' },
                      { id: 'dark', label: 'डार्क सायबर (Titanium)' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setPosterTheme(th.id as any)}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-black transition cursor-pointer text-center ${
                          posterTheme === th.id
                            ? 'btn-3d-gold text-slate-950 shadow-md'
                            : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* LIVE POSTER CANVAS PREVIEW */}
              <div className="flex flex-col items-center space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  लाइव पोस्टर प्रीव्यू (नीचे बटन से HD PNG डाउनलोड करें):
                </span>

                <div
                  ref={posterRef}
                  className={`w-full max-w-md aspect-[4/5] ${posterThemeStyle.bg} ${posterThemeStyle.border} rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white select-none`}
                >
                  {/* Background Luxury Security Watermark */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center -rotate-12">
                    <span className="text-5xl font-black font-mono tracking-tighter text-amber-200">
                      {effectiveSponsorId}
                    </span>
                  </div>

                  {/* Top Tricolor Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow" />

                  {/* Header Row */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl logo-3d-box p-0.5 shadow flex items-center justify-center">
                        <span className="text-[10px] font-black text-amber-400">IOIS</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black tracking-wider gold-text uppercase">
                          IOIS DIGITAL PORTAL
                        </h4>
                        <span className="text-[7.5px] uppercase text-slate-300 font-bold block">
                          Indian Online Integrated Services • 2026
                        </span>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                      ✓ सत्यापित
                    </span>
                  </div>

                  {/* Slogan Banner */}
                  <div className="my-auto text-center space-y-2 relative z-10 py-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-black text-amber-300 uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>डायरेक्ट नामांकन व 50%-70% इंसेंटिव</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black leading-snug tracking-tight text-white drop-shadow-md">
                      "{posterSlogan}"
                    </h2>

                    <p className="text-[10px] text-slate-300 max-w-xs mx-auto leading-relaxed">
                      ₹10 से ₹999 में कोई भी प्लान चुनें, डिजिटल ID कार्ड पाएं और प्रत्येक रेफरल पर सीधा 50% से 70% इंसेंटिव पाएं।
                    </p>
                  </div>

                  {/* Middle Box: Sponsor Details + QR Code */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-400/50 flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md">
                        <img src={effectivePhoto} alt={posterCustomName} crossOrigin="anonymous" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">
                          स्पॉन्सर / प्रमोटर:
                        </span>
                        <h5 className="text-xs sm:text-sm font-black text-white truncate">
                          {posterCustomName}
                        </h5>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] text-slate-400 font-bold">Sponsor ID:</span>
                          <span className="text-[11px] font-mono font-black text-amber-300">
                            {effectiveSponsorId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-1 bg-white rounded-xl shrink-0 shadow-md text-center">
                      <img src={qrImageSrc} alt="QR Code" crossOrigin="anonymous" className="w-14 h-14 object-contain mx-auto" />
                      <span className="text-[6.5px] font-black font-mono text-slate-950 block uppercase">
                        स्कैन करें
                      </span>
                    </div>
                  </div>

                  {/* Footer Safety & Contact */}
                  <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[8px] text-slate-400 relative z-10">
                    <div>
                      <span className="text-emerald-400 font-mono font-bold block">
                        WWW.IOIS.IN • 256-BIT SSL
                      </span>
                      <span>आधिकारिक हेल्पलाइन: {OFFICIAL_PHONE}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[7.5px] font-black text-amber-300 font-mono block">
                        SPONSOR CODE: {effectiveSponsorId}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Poster Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadPoster}
                    disabled={isGeneratingPoster}
                    className="btn-3d-gold px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 active:scale-95 transition"
                  >
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>{isGeneratingPoster ? 'HD पोस्टर तैयार हो रहा है...' : 'HD PNG पोस्टर डाउनलोड करें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="btn-3d-emerald px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>व्हाट्सएप स्टेटस पर शेयर करें</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: READY-TO-USE MARKETING CAPTIONS & PROMO KITS                       */}
          {/* ========================================================================= */}
          {activeTab === 'marketing_kit' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  कॉपी करके व्हाट्सएप स्टेटस या सोशल मीडिया पर पेस्ट करें:
                </span>
                <span className="text-[10px] text-amber-400 font-bold">1-क्लिक कॉपी</span>
              </div>

              {/* Message Template 1: Short WhatsApp Status */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>टेम्पलेट 1: व्हाट्सएप स्टेटस व इंस्टाग्राम स्टोरी (Short Status)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(
                      `🇮🇳 *घर बैठे ऑनलाइन पढ़ाई व 50%-70% इंसेंटिव आय!* 📚✨\nIOIS पोर्टल से जुड़ें मात्र ₹10 से ₹999 में। प्रत्येक रेफरल पर ₹7 से ₹499 तुरंत UPI में प्राप्त करें।\n👉 अभी जुड़ें: ${referralUrl}\n🏷️ Sponsor ID: ${effectiveSponsorId}`,
                      'शॉर्ट स्टेटस कॉपी हो गया!'
                    )}
                    className="btn-3d-gold px-3 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3 text-slate-950" />
                    <span>कॉपी करें</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-200 font-mono leading-relaxed select-all">
                  🇮🇳 *घर बैठे ऑनलाइन पढ़ाई व 50%-70% इंसेंटिव आय!* 📚✨<br />
                  IOIS पोर्टल से जुड़ें मात्र ₹10 से ₹999 में। प्रत्येक रेफरल पर ₹7 से ₹499 तुरंत UPI में प्राप्त करें।<br />
                  👉 अभी जुड़ें: <span className="text-amber-300">{referralUrl}</span><br />
                  🏷️ Sponsor ID: <strong className="text-amber-300">{effectiveSponsorId}</strong>
                </div>
              </div>

              {/* Message Template 2: Detailed WhatsApp / Telegram Group Pitch */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>टेम्पलेट 2: व्हाट्सएप व टेलीग्राम ग्रुप्स के लिए सम्पूर्ण संदेश (Full Explainer)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(
                      `🔥 *IOIS 2026: भारत का अपना डिजिटल स्वावलंबन पोर्टल!* 🇮🇳\n\nप्रिय मित्रों,\nयदि आप छात्र, युवा या अभिभावक हैं और डिजिटल साक्षरता के साथ घर बैठे आय का एक सच्चा माध्यम चाहते हैं, तो IOIS आपके लिए सर्वश्रेष्ठ अवसर है!\n\n👑 *प्लेटफॉर्म के मुख्य लाभ:*\n1. कक्षा 1 से 12 तक NCERT डिजिटल नोट्स व जॉब टूल्स\n2. RTPS व जमीन सुधार संबंधी नागरिक सेवाएं\n3. 7 मास्टर प्लान्स (मात्र ₹10, ₹49, ₹99, ₹199, ₹299, ₹499, ₹999)\n4. प्रत्येक सफल रेफरल पर *50% से 70% तक इंस्टेंट पेआउट* सीधे आपके UPI खाते में!\n\n🚀 *अभी मेरे आधिकारिक स्पॉन्सर कोड से रजिस्टर करें:*\n👉 लिंक: ${referralUrl}\n🏷️ Sponsor ID: ${effectiveSponsorId}\n👤 प्रमोटर: ${effectiveUserName}\n\n100% पारदर्शी, सुरक्षित एवं आधिकारिक पोर्टल।`,
                      'सम्पूर्ण संदेश कॉपी हो गया!'
                    )}
                    className="btn-3d-sapphire px-3 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 cursor-pointer text-white"
                  >
                    <Copy className="w-3 h-3 text-white" />
                    <span>कॉपी करें</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-200 font-mono leading-relaxed select-all">
                  🔥 *IOIS 2026: भारत का अपना डिजिटल स्वावलंबन पोर्टल!* 🇮🇳<br /><br />
                  प्रिय मित्रों,<br />
                  यदि आप छात्र, युवा या अभिभावक हैं और डिजिटल साक्षरता के साथ घर बैठे आय का एक सच्चा माध्यम चाहते हैं, तो IOIS आपके लिए सर्वश्रेष्ठ अवसर है!<br /><br />
                  👑 *प्लेटफॉर्म के मुख्य लाभ:*<br />
                  1. कक्षा 1 से 12 तक NCERT डिजिटल नोट्स व जॉब टूल्स<br />
                  2. RTPS व जमीन सुधार संबंधी नागरिक सेवाएं<br />
                  3. 7 मास्टर प्लान्स (मात्र ₹10, ₹49, ₹99, ₹199, ₹299, ₹499, ₹999)<br />
                  4. प्रत्येक सफल रेफरल पर *50% से 70% तक इंस्टेंट पेआउट* सीधे आपके UPI खाते में!<br /><br />
                  🚀 *अभी मेरे आधिकारिक स्पॉन्सर कोड से रजिस्टर करें:*<br />
                  👉 लिंक: <span className="text-amber-300">{referralUrl}</span><br />
                  🏷️ Sponsor ID: <strong className="text-amber-300">{effectiveSponsorId}</strong><br />
                  👤 प्रमोटर: {effectiveUserName}
                </div>
              </div>

              {/* Message Template 3: English Social Media Post */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>टेम्पलेट 3: फेसबुक व लिंक्डइन पोस्ट (English Professional)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(
                      `Join IOIS Digital Platform - Empowering Students & Youth across India! 🇮🇳\nAccess NCERT study notes, job resume tools, and earn 50% to 70% instant referral payouts directly to your UPI!\n\nSign up today with my verified Sponsor ID:\n👉 ${referralUrl}\nSponsor ID: ${effectiveSponsorId}`,
                      'इंग्लिश पोस्ट कॉपी हो गया!'
                    )}
                    className="btn-3d-platinum px-3 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 cursor-pointer text-slate-950"
                  >
                    <Copy className="w-3 h-3 text-slate-950" />
                    <span>कॉपी करें</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-200 font-mono leading-relaxed select-all">
                  Join IOIS Digital Platform - Empowering Students & Youth across India! 🇮🇳<br />
                  Access NCERT study notes, job resume tools, and earn 50% to 70% instant referral payouts directly to your UPI!<br /><br />
                  Sign up today with my verified Sponsor ID:<br />
                  👉 <span className="text-amber-300">{referralUrl}</span><br />
                  Sponsor ID: <strong className="text-amber-300">{effectiveSponsorId}</strong>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>आपकी स्पॉन्सर ID <strong>{effectiveSponsorId}</strong> सुरक्षित व एक्टिव है</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex-1 sm:flex-none btn-3d-emerald px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>व्हाट्सएप पर शेयर</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-3d-dark px-4 py-2 rounded-xl text-xs font-black text-slate-300 hover:text-white cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
