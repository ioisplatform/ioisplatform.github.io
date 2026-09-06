import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { PLANS, OFFICIAL_PHONE, OFFICIAL_EMAIL } from '../data/plansData';
import { 
  CreditCard, 
  Download, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  User, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  Award,
  Phone,
  Mail,
  Lock,
  Clock,
  Eye,
  Copy,
  Check,
  MapPin,
  Calendar,
  Layers,
  Fingerprint,
  Cpu,
  BadgeCheck,
  Shield,
  Palette
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface IDCardGeneratorProps {
  currentUser?: UserProfile | null;
  onOpenRegister?: () => void;
}

type CardTheme = 'gold' | 'navy' | 'emerald' | 'platinum';
type CardOrientation = 'landscape' | 'portrait';

const PRESET_AVATARS = [
  { id: '1', label: 'Pro Male 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: '2', label: 'Pro Male 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: '3', label: 'Pro Female 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { id: '4', label: 'Pro Female 2', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
  { id: '5', label: 'Student Male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { id: '6', label: 'Student Female', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
];

export const IDCardGenerator: React.FC<IDCardGeneratorProps> = ({
  currentUser,
  onOpenRegister,
}) => {
  // Card profile states
  const [fullName, setFullName] = useState<string>(currentUser?.fullName || 'राहुल कुमार');
  const [memberId, setMemberId] = useState<string>(currentUser?.userId || 'IOIS10RK01');
  const [selectedPlanId, setSelectedPlanId] = useState<number>(currentUser?.selectedPlanId || 7);
  const [userRole, setUserRole] = useState<string>(currentUser?.role || 'Official Verified Member');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser?.mobileNumber || '+91 9876543210');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [stateRegion, setStateRegion] = useState<string>('बिहार (Bihar, IN)');
  const [dob, setDob] = useState<string>('15/08/2000');
  const [issueDate, setIssueDate] = useState<string>('01/01/2026');
  const [validThru, setValidThru] = useState<string>('31/12/2031');
  
  const [photoUrl, setPhotoUrl] = useState<string>(
    currentUser?.photoUrl || PRESET_AVATARS[0].url
  );

  // Card view styling configurations
  const [cardTheme, setCardTheme] = useState<CardTheme>('gold');
  const [cardOrientation, setCardOrientation] = useState<CardOrientation>('landscape');
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setMemberId(currentUser.userId);
      setSelectedPlanId(currentUser.selectedPlanId);
      setUserRole(currentUser.role || 'Official Verified Member');
      setPhoneNumber(currentUser.mobileNumber);
      if (currentUser.photoUrl) setPhotoUrl(currentUser.photoUrl);
    }
  }, [currentUser]);

  const cardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[6];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          showToast('फोटो सफलतापूर्वक अपडेट हो गई!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    const targetElement = cardSide === 'front' ? cardRef.current : backCardRef.current;
    if (!targetElement) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(targetElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `IOIS-SMART-ID-${memberId}-${fullName.replace(/\s+/g, '_')}-${cardSide.toUpperCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`ID कार्ड (${cardSide === 'front' ? 'आगे का भाग' : 'पीछे का भाग'}) HD PNG में डाउनलोड हो गया!`);
    } catch (err) {
      console.error('Error generating card image:', err);
      showToast('डाउनलोड में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(memberId);
    showToast(`User ID [${memberId}] क्लिपबोर्ड में कॉपी हो गया!`);
  };

  const handleShare = async () => {
    const shareText = `मेरा IOIS आधिकारिक डिजिटल ID कार्ड (${selectedPlan.name} - ID: ${memberId}): ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `IOIS Verified Member ID Card - ${fullName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('ID कार्ड का आधिकारिक विवरण व लिंक कॉपी हो गया!');
    }
  };

  // Theme-specific styles
  const getThemeClasses = () => {
    switch (cardTheme) {
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-neutral-900 to-black',
          border: 'border-2 border-amber-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.3)]',
          headerBg: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-transparent',
          headerBorder: 'border-amber-400/40',
          accentText: 'text-amber-300',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
          hologramBorder: 'border-amber-400/60',
          chipBg: 'from-yellow-400 via-amber-300 to-yellow-600',
          sealColor: 'text-amber-400',
        };
      case 'navy':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
          border: 'border-2 border-blue-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(59,130,246,0.3)]',
          headerBg: 'bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-transparent',
          headerBorder: 'border-blue-400/40',
          accentText: 'text-blue-300',
          badgeBg: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950',
          hologramBorder: 'border-blue-400/60',
          chipBg: 'from-amber-300 via-yellow-200 to-amber-500',
          sealColor: 'text-blue-400',
        };
      case 'emerald':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900',
          border: 'border-2 border-emerald-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.3)]',
          headerBg: 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent',
          headerBorder: 'border-emerald-400/40',
          accentText: 'text-emerald-300',
          badgeBg: 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950',
          hologramBorder: 'border-emerald-400/60',
          chipBg: 'from-yellow-400 via-amber-300 to-yellow-600',
          sealColor: 'text-emerald-400',
        };
      case 'platinum':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900',
          border: 'border-2 border-slate-300/70 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(203,213,225,0.25)]',
          headerBg: 'bg-gradient-to-r from-slate-300/20 via-slate-400/15 to-transparent',
          headerBorder: 'border-slate-300/40',
          accentText: 'text-slate-200',
          badgeBg: 'bg-gradient-to-r from-slate-200 to-zinc-300 text-slate-950',
          hologramBorder: 'border-slate-300/60',
          chipBg: 'from-zinc-300 via-slate-200 to-zinc-400',
          sealColor: 'text-slate-200',
        };
    }
  };

  const themeStyle = getThemeClasses();

  return (
    <section id="id-card-section" className="scroll-mt-24 space-y-10">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 bg-slate-900/95 border-2 border-amber-400 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl">
            <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="text-xs font-black">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider">
          <Fingerprint className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>ISO/IEC 7810 SMART DIGITAL IDENTITY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
          🪪 IOIS <span className="tiranga-text">स्मार्ट डिजिटल ID कार्ड</span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
          256-Bit SSL एन्क्रिप्टेड, बायोमेट्रिक माइक्रोचिप, 3D होलोग्राम सील और क्यूआर कोड से लैस आपका आधिकारिक डिजिटल पहचान पत्र।
        </p>
      </div>

      {/* Main Studio Grid: Controls Left, Live Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Controls & Editor (5 Cols) */}
        <div className="lg:col-span-5 glass-card-gold p-6 sm:p-7 rounded-3xl border border-amber-500/30 space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-black text-white">स्मार्ट कार्ड कस्टमाइज़र</h3>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-black uppercase">
              2026 Pass
            </span>
          </div>

          {/* Quick Theme Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>कार्ड थीम व रंग (Card Theme):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCardTheme('gold')}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-black border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  cardTheme === 'gold'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>👑</span>
                <span>शाही गोल्ड</span>
              </button>

              <button
                type="button"
                onClick={() => setCardTheme('navy')}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-black border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  cardTheme === 'navy'
                    ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>🏛️</span>
                <span>नेवी ब्लू</span>
              </button>

              <button
                type="button"
                onClick={() => setCardTheme('emerald')}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-black border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  cardTheme === 'emerald'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>🌿</span>
                <span>एमराल्ड</span>
              </button>

              <button
                type="button"
                onClick={() => setCardTheme('platinum')}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-black border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  cardTheme === 'platinum'
                    ? 'bg-slate-200 text-slate-950 border-white shadow-md'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>💎</span>
                <span>प्लैटिनम</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            
            {/* User ID Display with Copy Button */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block">आधिकारिक User ID (Permanent):</span>
                <span className="text-base font-black text-white font-mono tracking-wider">{memberId}</span>
              </div>
              <button
                onClick={handleCopyId}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>कॉपी</span>
              </button>
            </div>

            {/* Name & Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">पूरा नाम (Full Name):</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. राहुल कुमार"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">मोबाइल नंबर:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="उदा. +91 9876543210"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none transition"
                />
              </div>
            </div>

            {/* Plan & Designation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">IOIS एक्टिव प्लान:</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none transition cursor-pointer font-bold"
                >
                  {PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      Plan 0{plan.id}: {plan.name} (₹{plan.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">सदस्यता पद (Role / Title):</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none transition cursor-pointer"
                >
                  <option value="Official Verified Member">Official Verified Member</option>
                  <option value="Active Digital Learner">Active Digital Learner</option>
                  <option value="Supreme Master Partner">Supreme Master Partner</option>
                  <option value="Authorized State Reseller">Authorized State Reseller</option>
                  <option value="Student Ambassador">Student Ambassador</option>
                </select>
              </div>
            </div>

            {/* Extra Info: Blood Group, State, DOB */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 text-[10px] font-bold mb-1">ब्लड ग्रुप:</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-center text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold mb-1">जन्म तिथि (DOB):</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-center text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold mb-1">राज्य / क्षेत्र:</label>
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-center text-xs font-bold outline-none truncate"
                />
              </div>
            </div>

            {/* Preset Avatars & Upload */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="block text-slate-300 font-bold">फोटो का चयन (Select or Upload Photo):</label>
              
              {/* Preset Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setPhotoUrl(av.url)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer transition ${
                      photoUrl === av.url ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Upload custom */}
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-400 bg-slate-950 cursor-pointer transition">
                <Upload className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 text-xs font-bold">डिवाइस से कस्टम फोटो अपलोड करें</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

          </div>

        </div>

        {/* Right Side: Ultra High-End Digital Card Preview & Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col items-center">
          
          {/* Card View Switchers: Orientation & Front/Back */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            {/* Front / Back Toggle */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-xl">
              <button
                type="button"
                onClick={() => setCardSide('front')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  cardSide === 'front'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>आगे का भाग (Front)</span>
              </button>

              <button
                type="button"
                onClick={() => setCardSide('back')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  cardSide === 'back'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>पीछे का भाग (Back)</span>
              </button>
            </div>

            {/* Orientation Toggle */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-xl">
              <button
                type="button"
                onClick={() => setCardOrientation('landscape')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  cardOrientation === 'landscape'
                    ? 'bg-slate-800 text-amber-400 border border-amber-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>आड़ा (Horizontal)</span>
              </button>

              <button
                type="button"
                onClick={() => setCardOrientation('portrait')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  cardOrientation === 'portrait'
                    ? 'bg-slate-800 text-amber-400 border border-amber-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>खड़ा (Vertical)</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              CARD CANVAS CONTAINER (LANDSCAPE VS PORTRAIT)
             ========================================================================= */}
          
          {/* 1. LANDSCAPE CARD ORIENTATION (85.6mm x 53.98mm ratio ~ 1.586 : 1) */}
          {cardOrientation === 'landscape' && (
            <div className="w-full max-w-[440px] flex justify-center">
              
              {/* FRONT SIDE (LANDSCAPE) */}
              {cardSide === 'front' && (
                <div
                  ref={cardRef}
                  className={`w-full aspect-[1.586/1] ${themeStyle.cardBg} ${themeStyle.border} text-white rounded-[26px] p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl`}
                >
                  {/* Security Laser Guilloche Background Grid & Watermark */}
                  <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Indian Tiranga Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow-sm" />

                  {/* Micro-Text Anti-Counterfeit Safety Ribbon */}
                  <div className="absolute top-1.5 left-0 right-0 overflow-hidden opacity-30 text-[5.5px] font-mono tracking-widest text-slate-400 whitespace-nowrap pointer-events-none">
                    ★ IOIS PLATFORM ★ OFFICIAL DIGITAL RESIDENT CARD ★ ISO/IEC 7810 COMPLIANT ★ VERIFIED IDENTITY ★ 256-BIT SSL ENCRYPTED ★ GOVT RECOGNIZED STANDARDS ★
                  </div>

                  {/* Card Header Row */}
                  <div className={`flex items-center justify-between relative z-10 border-b ${themeStyle.headerBorder} pt-1 pb-2`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-amber-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-black tracking-wider gold-text font-serif block leading-none">
                            IOIS PLATFORM
                          </span>
                          <span className="text-[8px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-mono font-bold">
                            2026
                          </span>
                        </div>
                        <span className="text-[7.5px] uppercase tracking-wider text-slate-300 font-bold block mt-0.5">
                          Indian Online Income Supporting System
                        </span>
                      </div>
                    </div>

                    {/* Hologram Anti-Fraud Emblem */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 via-amber-300 to-emerald-400 p-0.5 animate-pulse shadow-md flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Middle: Smart Chip, Photo & Member Data */}
                  <div className="flex items-center gap-3.5 my-auto relative z-10 py-1">
                    
                    {/* Photo with Chamfered Frame & Verification Stamp */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-24 sm:w-22 sm:h-26 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 shadow-xl">
                        <img
                          src={photoUrl}
                          alt={fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-950 shadow-md">
                        <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      
                      {/* Name & Role */}
                      <div>
                        <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-bold block">
                          सत्यापित सदस्य / Member Name:
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-white truncate tracking-wide">
                          {fullName}
                        </h4>
                      </div>

                      {/* User ID & Mobile */}
                      <div className="grid grid-cols-2 gap-x-2 text-[9px]">
                        <div>
                          <span className="text-[7px] uppercase text-slate-400 font-bold block">User ID:</span>
                          <span className="font-mono font-black text-amber-300 truncate block">
                            {memberId}
                          </span>
                        </div>
                        <div>
                          <span className="text-[7px] uppercase text-slate-400 font-bold block">सत्यापित मोबाइल:</span>
                          <span className="font-medium text-slate-200 truncate block">
                            {phoneNumber}
                          </span>
                        </div>
                      </div>

                      {/* Extra Meta (Blood / State / Valid Thru) */}
                      <div className="grid grid-cols-3 gap-x-1 text-[8px] pt-0.5">
                        <div>
                          <span className="text-[6.5px] text-slate-400 block font-bold">Blood:</span>
                          <span className="font-bold text-slate-200">{bloodGroup}</span>
                        </div>
                        <div>
                          <span className="text-[6.5px] text-slate-400 block font-bold">DOB:</span>
                          <span className="font-bold text-slate-200">{dob}</span>
                        </div>
                        <div>
                          <span className="text-[6.5px] text-slate-400 block font-bold">Valid Thru:</span>
                          <span className="font-bold text-emerald-400 font-mono">{validThru}</span>
                        </div>
                      </div>

                      {/* Plan Tag & EMV Chip Simulation */}
                      <div className="flex items-center justify-between gap-1 pt-1">
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 truncate">
                          <Award className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />
                          <span>Plan 0{selectedPlan.id}: {selectedPlan.name} (₹{selectedPlan.price})</span>
                        </span>

                        {/* Gold EMV Microprocessor Chip */}
                        <div className={`w-7 h-5 rounded-md bg-gradient-to-tr ${themeStyle.chipBg} p-0.5 shadow flex-shrink-0 flex items-center justify-center`}>
                          <div className="w-full h-full border border-slate-900/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                            <div className="bg-amber-600/30 rounded-xs"></div>
                            <div className="bg-amber-600/30 rounded-xs"></div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Bottom Row: QR & Signature & Seal */}
                  <div className="flex items-center justify-between relative z-10 pt-2 border-t border-slate-800/90 text-[8px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white rounded-lg flex-shrink-0 shadow-md">
                        <QrCode className="w-6 h-6 text-slate-950" />
                      </div>
                      <div>
                        <span className="text-slate-300 font-black block text-[8px]">OFFICIAL VERIFIED SCAN</span>
                        <span className="text-emerald-400 font-mono text-[7px] font-bold">256-BIT ENCRYPTION</span>
                      </div>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-[8px] text-slate-300 font-serif italic block">
                        IOIS Auth Signatory
                      </span>
                      <span className="text-[7px] text-amber-400 font-mono block">
                        CERTIFIED RESIDENT PASS
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* BACK SIDE (LANDSCAPE) */}
              {cardSide === 'back' && (
                <div
                  ref={backCardRef}
                  className={`w-full aspect-[1.586/1] ${themeStyle.cardBg} ${themeStyle.border} text-white rounded-[26px] p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl`}
                >
                  {/* Top Saffron Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

                  {/* Magnetic Stripe Bar */}
                  <div className="mt-1 -mx-5 h-9 bg-slate-950 border-y border-slate-800/80 flex items-center px-5">
                    <span className="text-[6.5px] font-mono text-slate-600 tracking-widest uppercase">
                      IOIS-CARD-ISO7811-256BIT-ENCRYPTED-TRACK1-TRACK2-VERIFIED
                    </span>
                  </div>

                  {/* Back Content & Rules */}
                  <div className="space-y-1.5 my-auto text-[8px] text-slate-300 leading-relaxed px-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <p>यह डिजिटल स्मार्ट कार्ड IOIS प्लेटफॉर्म का आधिकारिक वेरिफाइड एक्सेस पास है।</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <p>प्लान 01 से 07 तक की सभी डिजिटल सामग्री व 70% दैनिक इंसेंटिव इस यूजर आईडी से सुरक्षित हैं।</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <p>कार्डधारक की पहचान और डिजिटल वैधता की पुष्टि हेतु दिए गए QR कोड को किसी भी स्कैनर से स्कैन करें।</p>
                    </div>
                  </div>

                  {/* Cardholder Sign Box & Helpdesk Bar */}
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[7.5px]">
                      <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg w-40 text-center text-slate-400 italic">
                        कार्डधारक हस्ताक्षर / Sign
                      </div>
                      <div className="text-right font-mono text-amber-300 font-bold">
                        ID: {memberId}
                      </div>
                    </div>

                    <div className="bg-slate-950/90 p-2 rounded-xl border border-slate-800 text-[7.5px] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Phone className="w-2.5 h-2.5" />
                        <span className="font-mono font-bold">{OFFICIAL_PHONE}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sky-300">
                        <Mail className="w-2.5 h-2.5" />
                        <span className="font-mono">{OFFICIAL_EMAIL}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* 2. PORTRAIT CARD ORIENTATION (Vertical Lanyard Badge Format) */}
          {cardOrientation === 'portrait' && (
            <div className="w-full max-w-[340px] flex justify-center">
              
              {/* FRONT SIDE (PORTRAIT) */}
              {cardSide === 'front' && (
                <div
                  ref={cardRef}
                  className={`w-full aspect-[1/1.586] ${themeStyle.cardBg} ${themeStyle.border} text-white rounded-[26px] p-5 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl text-center`}
                >
                  {/* Lanyard Clip Hole Simulation at Top */}
                  <div className="w-12 h-2.5 rounded-full bg-slate-950 border border-slate-700 mx-auto -mt-2 mb-2 shadow-inner"></div>

                  {/* Top Indian Tiranga Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

                  {/* Header */}
                  <div className="space-y-1 border-b border-slate-800 pb-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-black tracking-wider gold-text font-serif">
                        IOIS PLATFORM
                      </span>
                    </div>
                    <span className="text-[7.5px] uppercase tracking-wider text-slate-300 font-bold block">
                      Indian Online Income Supporting System
                    </span>
                  </div>

                  {/* Portrait Photo & Chip */}
                  <div className="relative my-auto flex flex-col items-center space-y-2.5">
                    <div className="relative">
                      <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 shadow-2xl">
                        <img
                          src={photoUrl}
                          alt={fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-950 shadow-md">
                        <BadgeCheck className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Name & ID */}
                    <div className="space-y-0.5">
                      <h4 className="text-base font-black text-white tracking-wide">
                        {fullName}
                      </h4>
                      <span className="text-xs font-mono font-bold text-amber-300 block">
                        {memberId}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block">
                        {userRole}
                      </span>
                    </div>

                    {/* Plan Badge */}
                    <span className="inline-flex items-center gap-1 text-[9px] font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Plan 0{selectedPlan.id}: {selectedPlan.name} (₹{selectedPlan.price})</span>
                    </span>

                    {/* Quick Meta Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[8px] w-full pt-1 text-left bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block font-bold">मोबाइल:</span>
                        <span className="text-slate-200 font-medium">{phoneNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">Blood Group:</span>
                        <span className="text-slate-200 font-bold">{bloodGroup}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">DOB:</span>
                        <span className="text-slate-200">{dob}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">Valid Thru:</span>
                        <span className="text-emerald-400 font-mono font-bold">{validThru}</span>
                      </div>
                    </div>

                  </div>

                  {/* Portrait Footer: QR & Hologram */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[8px]">
                    <div className="p-1 bg-white rounded-lg shadow">
                      <QrCode className="w-5 h-5 text-slate-950" />
                    </div>
                    <div className="text-right">
                      <span className="text-[7.5px] font-mono text-emerald-400 font-bold block">
                        256-BIT SSL VERIFIED
                      </span>
                      <span className="text-[6.5px] text-slate-400 uppercase">
                        OFFICIAL IDENTITY
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* BACK SIDE (PORTRAIT) */}
              {cardSide === 'back' && (
                <div
                  ref={backCardRef}
                  className={`w-full aspect-[1/1.586] ${themeStyle.cardBg} ${themeStyle.border} text-white rounded-[26px] p-5 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl text-center`}
                >
                  <div className="w-12 h-2.5 rounded-full bg-slate-950 border border-slate-700 mx-auto -mt-2 mb-2 shadow-inner"></div>

                  <div className="text-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                      TERMS & HELPLINE
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 block">
                      ID: {memberId}
                    </span>
                  </div>

                  <div className="space-y-2 text-[8px] text-slate-300 text-left my-auto leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                    <p>• यह आईडी कार्ड IOIS सपोर्टिंग सिस्टम का आधिकारिक डिजिटल पहचान पत्र है।</p>
                    <p>• 70% इंसेंटिव व डिजिटल लाइब्रेरी का अधिकार इस यूजर आईडी से संबद्ध है।</p>
                    <p>• किसी भी सहायता या सत्यापन हेतु आधिकारिक हेल्पलाइन पर 24x7 संपर्क करें।</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-[8px]">
                    <div className="bg-slate-900 border border-slate-700 py-1.5 rounded-lg text-slate-400 italic text-center">
                      कार्डधारक हस्ताक्षर / Cardholder Sign
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[8px] space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">WhatsApp:</span>
                        <strong className="text-emerald-400 font-mono">{OFFICIAL_PHONE}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email:</span>
                        <strong className="text-sky-300 font-mono">{OFFICIAL_EMAIL}</strong>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-[440px]">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'तैयार हो रहा है...' : `डाउनलोड HD PNG (${cardSide === 'front' ? 'आगे' : 'पीछे'})`}</span>
            </button>

            <button
              onClick={handlePrint}
              title="प्रिंट करें"
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">प्रिंट</span>
            </button>

            <button
              onClick={handleShare}
              title="शेयर करें"
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">शेयर</span>
            </button>
          </div>

          {/* Verification Badge Footnote */}
          <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL एन्क्रिप्टेड • 100% वेरिफाइड डिजिटल पहचान पत्र</span>
          </div>

        </div>

      </div>
    </section>
  );
};
