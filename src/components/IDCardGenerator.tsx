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
  Eye,
  EyeOff,
  Copy,
  Check,
  MapPin,
  Calendar,
  Layers,
  Fingerprint,
  BadgeCheck,
  Shield,
  Palette,
  FileText,
  Link,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface IDCardGeneratorProps {
  currentUser?: UserProfile | null;
  onOpenRegister?: () => void;
  isModalMode?: boolean;
}

export type CardTheme = 'gold' | 'navy' | 'emerald' | 'platinum' | 'ruby';
export type CardOrientation = 'landscape' | 'portrait';
export type CardSide = 'front' | 'back' | 'both';
export type QrMode = 'referral' | 'custom_url' | 'custom_image';
export type PrivacyMode = 'public' | 'private';

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
  isModalMode = false,
}) => {
  // 1. Card Profile States
  const [fullName, setFullName] = useState<string>(currentUser?.fullName || 'राहुल कुमार');
  const [memberId, setMemberId] = useState<string>(currentUser?.userId || 'IOIS999VK01');
  const [selectedPlanId, setSelectedPlanId] = useState<number>(currentUser?.selectedPlanId || 7);
  const [userRole, setUserRole] = useState<string>(currentUser?.role || 'Supreme Master Partner');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser?.mobileNumber || '+91 9523218765');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [stateRegion, setStateRegion] = useState<string>('पटना, बिहार (IN)');
  const [dob, setDob] = useState<string>('15/08/2000');
  const [issueDate, setIssueDate] = useState<string>('01/01/2026');
  const [validThru, setValidThru] = useState<string>('31/12/2031');
  
  const [photoUrl, setPhotoUrl] = useState<string>(
    currentUser?.photoUrl || PRESET_AVATARS[0].url
  );

  // 2. Customizer Modes
  const [cardTheme, setCardTheme] = useState<CardTheme>('gold');
  const [cardOrientation, setCardOrientation] = useState<CardOrientation>('landscape');
  const [cardSide, setCardSide] = useState<CardSide>('front');
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('public'); // Details Mask: public vs private
  
  // 3. QR Code Configuration
  const [qrMode, setQrMode] = useState<QrMode>('referral');
  const [customQrUrl, setCustomQrUrl] = useState<string>('');
  const [customQrImage, setCustomQrImage] = useState<string | null>(null);

  // 4. Download & Interaction States
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadFormatLabel, setDownloadFormatLabel] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

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

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[6];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Referral URL calculation
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://iois.org.in';
  const defaultReferralUrl = `${originUrl}/?sponsor=${encodeURIComponent(memberId)}&ref=${encodeURIComponent(memberId)}`;
  
  // Effective QR URL & Image calculation
  const effectiveQrLink = qrMode === 'custom_url' && customQrUrl.trim() 
    ? customQrUrl.trim() 
    : defaultReferralUrl;

  const effectiveQrImageSrc = qrMode === 'custom_image' && customQrImage
    ? customQrImage
    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(effectiveQrLink)}`;

  // Masked vs Unmasked Display (User ID is ALWAYS visible to everyone!)
  const displayMobile = privacyMode === 'public'
    ? phoneNumber.replace(/(\+?\d{2,4}\s?)?(\d{2,3})\d{4,5}(\d{2,3})/, '$1$2*****$3')
    : phoneNumber;
  
  const displayBlood = privacyMode === 'public' ? '**' : bloodGroup;
  const displayDob = privacyMode === 'public' ? '**/**/****' : dob;
  const displayState = privacyMode === 'public' ? 'बिहार (सुरक्षित)' : stateRegion;

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          showToast('कस्टम फोटो सफलतापूर्वक अपडेट हो गई!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom QR Image Upload Handler
  const handleCustomQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomQrImage(reader.result);
          setQrMode('custom_image');
          showToast('कस्टम QR कोड इमेज सफलतापूर्वक सेट हो गई!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download HD PNG
  const handleDownloadPng = async (targetSide: 'front' | 'back' = 'front') => {
    const targetElement = targetSide === 'front' ? cardRef.current : backCardRef.current;
    if (!targetElement) return;

    try {
      setIsDownloading(true);
      setDownloadFormatLabel('HD PNG');
      const canvas = await html2canvas(targetElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `IOIS-Digital-ID-${memberId}-${targetSide.toUpperCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`ID कार्ड (${targetSide === 'front' ? 'आगे का भाग' : 'पीछे का भाग'}) HD PNG में डाउनलोड हो गया!`);
    } catch (err) {
      console.error('Download error:', err);
      showToast('PNG डाउनलोड में समस्या आई। पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
      setDownloadFormatLabel('');
    }
  };

  // Download HD JPG
  const handleDownloadJpg = async (targetSide: 'front' | 'back' = 'front') => {
    const targetElement = targetSide === 'front' ? cardRef.current : backCardRef.current;
    if (!targetElement) return;

    try {
      setIsDownloading(true);
      setDownloadFormatLabel('HD JPG');
      const canvas = await html2canvas(targetElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `IOIS-Digital-ID-${memberId}-${targetSide.toUpperCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`ID कार्ड (${targetSide === 'front' ? 'आगे' : 'पीछे'}) HD JPG में डाउनलोड हो गया!`);
    } catch (err) {
      console.error('JPG download error:', err);
      showToast('JPG डाउनलोड में समस्या आई।');
    } finally {
      setIsDownloading(false);
      setDownloadFormatLabel('');
    }
  };

  // Download Clean High-Resolution PDF
  const handleDownloadPdf = async (targetSide: 'front' | 'back' = 'front') => {
    const targetElement = targetSide === 'front' ? cardRef.current : backCardRef.current;
    if (!targetElement) return;

    try {
      setIsDownloading(true);
      setDownloadFormatLabel('Clean PDF');
      const canvas = await html2canvas(targetElement, {
        scale: 3.5,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const isLandscape = cardOrientation === 'landscape';
      
      // Standard CR80 ISO/IEC 7810 ID Card dimensions: 85.60 mm x 53.98 mm
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isLandscape ? [85.6, 53.98] : [53.98, 85.6],
      });

      const pdfW = isLandscape ? 85.6 : 53.98;
      const pdfH = isLandscape ? 53.98 : 85.6;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`IOIS-Digital-ID-${memberId}-${targetSide.toUpperCase()}.pdf`);
      showToast(`ID कार्ड (${targetSide === 'front' ? 'आगे' : 'पीछे'}) का हाई-क्वालिटी PDF डाउनलोड हो गया!`);
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('PDF डाउनलोड में समस्या आई।');
    } finally {
      setIsDownloading(false);
      setDownloadFormatLabel('');
    }
  };

  // Download Both Sides in a Single 2-Page PDF
  const handleDownloadBothSidesPdf = async () => {
    if (!cardRef.current || !backCardRef.current) return;

    try {
      setIsDownloading(true);
      setDownloadFormatLabel('2-Page PDF (आगे + पीछे)');
      const isLandscape = cardOrientation === 'landscape';
      
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isLandscape ? [85.6, 53.98] : [53.98, 85.6],
      });
      const pdfW = isLandscape ? 85.6 : 53.98;
      const pdfH = isLandscape ? 53.98 : 85.6;

      // Page 1: Front
      const canvasFront = await html2canvas(cardRef.current, {
        scale: 3.5,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
      });
      const imgFront = canvasFront.toDataURL('image/png');
      pdf.addImage(imgFront, 'PNG', 0, 0, pdfW, pdfH);

      // Page 2: Back
      const canvasBack = await html2canvas(backCardRef.current, {
        scale: 3.5,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
      });
      const imgBack = canvasBack.toDataURL('image/png');
      pdf.addPage([pdfW, pdfH], isLandscape ? 'landscape' : 'portrait');
      pdf.addImage(imgBack, 'PNG', 0, 0, pdfW, pdfH);

      pdf.save(`IOIS-Digital-ID-${memberId}-FULL-CARD.pdf`);
      showToast('आगे और पीछे दोनों भागों का 2-पेज डिजिटल PDF सफलतापूर्वक डाउनलोड हो गया!');
    } catch (err) {
      console.error('Both sides PDF error:', err);
      showToast('2-पेज PDF डाउनलोड में समस्या आई।');
    } finally {
      setIsDownloading(false);
      setDownloadFormatLabel('');
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(memberId);
    showToast(`User ID [${memberId}] क्लिपबोर्ड में कॉपी हो गया!`);
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(defaultReferralUrl);
    showToast(`आपका स्पॉन्सर रेफरल लिंक कॉपी हो गया: ${defaultReferralUrl}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareText = `मेरा IOIS आधिकारिक डिजिटल ID कार्ड (${selectedPlan.name} - User ID: ${memberId}): ${defaultReferralUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `IOIS Verified Member ID Card - ${fullName}`,
          text: shareText,
          url: defaultReferralUrl,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('ID कार्ड का आधिकारिक विवरण व लिंक कॉपी हो गया!');
    }
  };

  // Authentic IOIS Themes (Genuine Digital Network styling, never fake government seals)
  const getThemeClasses = () => {
    switch (cardTheme) {
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-neutral-900 to-black',
          border: 'border-2 border-amber-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.3)]',
          headerBg: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-transparent',
          headerBorder: 'border-amber-400/40',
          accentText: 'text-amber-300',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
          hologramBorder: 'border-amber-400/60',
          chipBg: 'from-yellow-400 via-amber-300 to-yellow-600',
          sealColor: 'text-amber-400',
          tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'navy':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
          border: 'border-2 border-blue-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(59,130,246,0.3)]',
          headerBg: 'bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-transparent',
          headerBorder: 'border-blue-400/40',
          accentText: 'text-blue-300',
          badgeBg: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950',
          hologramBorder: 'border-blue-400/60',
          chipBg: 'from-amber-300 via-yellow-200 to-amber-500',
          sealColor: 'text-blue-400',
          tagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      case 'emerald':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900',
          border: 'border-2 border-emerald-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.3)]',
          headerBg: 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent',
          headerBorder: 'border-emerald-400/40',
          accentText: 'text-emerald-300',
          badgeBg: 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950',
          hologramBorder: 'border-emerald-400/60',
          chipBg: 'from-yellow-400 via-amber-300 to-yellow-600',
          sealColor: 'text-emerald-400',
          tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'platinum':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900',
          border: 'border-2 border-slate-300/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(203,213,225,0.25)]',
          headerBg: 'bg-gradient-to-r from-slate-300/20 via-slate-400/15 to-transparent',
          headerBorder: 'border-slate-300/40',
          accentText: 'text-slate-200',
          badgeBg: 'bg-gradient-to-r from-slate-200 to-zinc-300 text-slate-950',
          hologramBorder: 'border-slate-300/60',
          chipBg: 'from-zinc-300 via-slate-200 to-zinc-400',
          sealColor: 'text-slate-200',
          tagBg: 'bg-slate-300/20 text-slate-200 border-slate-300/40',
        };
      case 'ruby':
        return {
          cardBg: 'bg-gradient-to-br from-slate-950 via-rose-950 to-slate-900',
          border: 'border-2 border-rose-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(244,63,94,0.3)]',
          headerBg: 'bg-gradient-to-r from-rose-500/20 via-pink-500/15 to-transparent',
          headerBorder: 'border-rose-400/40',
          accentText: 'text-rose-300',
          badgeBg: 'bg-gradient-to-r from-rose-500 to-pink-400 text-slate-950',
          hologramBorder: 'border-rose-400/60',
          chipBg: 'from-amber-400 via-rose-300 to-yellow-500',
          sealColor: 'text-rose-400',
          tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
    }
  };

  const themeStyle = getThemeClasses();

  return (
    <div id="id-card-generator-root" className={`w-full space-y-8 ${isModalMode ? 'p-1' : ''}`}>
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 bg-slate-900/95 border-2 border-amber-400 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-black">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Studio Grid: Controls Left, Live Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: SMART CONTROLS & CUSTOMIZATION STUDIO (5 Cols)
           ========================================================================= */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-amber-500/30 p-5 sm:p-6 rounded-3xl space-y-5 shadow-2xl backdrop-blur-md">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm sm:text-base font-black text-white">ID कार्ड कस्टमाइज़र स्टूडियो</h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-black uppercase">
              IOIS Live ID
            </span>
          </div>

          {/* 1. Permanent User ID Display (Always visible to everyone) */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border-2 border-amber-500/50 flex items-center justify-between shadow-inner">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                स्थाई सदस्य पहचान (User ID - All Visible):
              </span>
              <span className="text-base sm:text-lg font-black text-white font-mono tracking-wider">
                {memberId}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>कॉपी ID</span>
            </button>
          </div>

          {/* 2. Privacy Mode (Public Masked vs Private Unmasked) */}
          <div className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <label className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                {privacyMode === 'public' ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                <span>विवरण सुरक्षा (Details Mask / Privacy):</span>
              </span>
              <span className="text-[10px] text-slate-400">User ID हमेशा दिखेगी</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrivacyMode('public')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  privacyMode === 'public'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>पब्लिक (मास्क्ड प्रिव्यू)</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacyMode('private')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  privacyMode === 'private'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>प्राइवेट (पूर्ण विवरण)</span>
              </button>
            </div>
          </div>

          {/* 3. Card Theme & Color Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>पसंदीदा कार्ड थीम (Card Themes):</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {[
                { key: 'gold', label: 'शाही गोल्ड', color: 'border-amber-400 bg-amber-400/20 text-amber-300' },
                { key: 'navy', label: 'नेवी ब्लू', color: 'border-blue-400 bg-blue-400/20 text-blue-300' },
                { key: 'emerald', label: 'एमराल्ड', color: 'border-emerald-400 bg-emerald-400/20 text-emerald-300' },
                { key: 'platinum', label: 'प्लैटिनम', color: 'border-slate-300 bg-slate-300/20 text-slate-200' },
                { key: 'ruby', label: 'रूबी रेड', color: 'border-rose-400 bg-rose-400/20 text-rose-300' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setCardTheme(t.key as CardTheme)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer text-center ${
                    cardTheme === t.key
                      ? 'bg-white text-slate-950 border-white font-black shadow-md scale-105'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. QR Code Options: Referral Link vs Custom Link vs Custom QR Image */}
          <div className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>QR कोड पता व लिंक (QR Code Setting):</span>
            </label>
            
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setQrMode('referral')}
                className={`py-1.5 px-2 rounded-xl font-bold border transition cursor-pointer text-center ${
                  qrMode === 'referral'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                रेफरल लिंक QR
              </button>

              <button
                type="button"
                onClick={() => setQrMode('custom_url')}
                className={`py-1.5 px-2 rounded-xl font-bold border transition cursor-pointer text-center ${
                  qrMode === 'custom_url'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                कस्टम लिंक
              </button>

              <button
                type="button"
                onClick={() => setQrMode('custom_image')}
                className={`py-1.5 px-2 rounded-xl font-bold border transition cursor-pointer text-center ${
                  qrMode === 'custom_image'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                कस्टम QR फोटो
              </button>
            </div>

            {/* Sub-inputs depending on QR mode */}
            {qrMode === 'referral' && (
              <div className="pt-1.5 space-y-1">
                <span className="text-[10px] text-slate-400 block">
                  डिफ़ॉल्ट रूप से यह QR आपके स्पॉन्सर कोड <strong className="text-amber-400">({memberId})</strong> से जुड़ा है। स्कैन करने पर सदस्य सीधे आपसे जुड़ेंगे।
                </span>
                <button
                  type="button"
                  onClick={handleCopyReferralLink}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3 h-3" />
                  <span>रेफरल लिंक कॉपी करें</span>
                </button>
              </div>
            )}

            {qrMode === 'custom_url' && (
              <div className="pt-1.5 space-y-1">
                <input
                  type="url"
                  value={customQrUrl}
                  onChange={(e) => setCustomQrUrl(e.target.value)}
                  placeholder="उदा. अपना UPI, वेबसाइट, या WhatsApp लिंक दर्ज करें"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-400 block">
                  इस लिंक का लाइव क्यूआर कोड आपके ID कार्ड पर तत्काल तैयार हो जाएगा।
                </span>
              </div>
            )}

            {qrMode === 'custom_image' && (
              <div className="pt-1.5 space-y-1.5">
                <label className="flex items-center justify-center gap-2 p-2 rounded-xl border border-dashed border-slate-700 hover:border-amber-400 bg-slate-950 cursor-pointer text-xs font-bold text-slate-300">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>डिवाइस से अपना PhonePe/GPay QR अपलोड करें</span>
                  <input type="file" accept="image/*" onChange={handleCustomQrUpload} className="hidden" />
                </label>
                {customQrImage && (
                  <span className="text-[10px] text-emerald-400 block font-bold">
                    कस्टम QR इमेज लोड हो चुकी है!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 5. User Details Editing Fields */}
          <div className="space-y-3 text-xs">
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
                  placeholder="उदा. +91 9523218765"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">चयनित IOIS प्लान व सेवा:</label>
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
                <label className="block text-slate-300 font-bold mb-1">सदस्य पद / रोल (Title):</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none transition cursor-pointer"
                >
                  <option value="Supreme Master Partner">Supreme Master Partner</option>
                  <option value="Official Verified Member">Official Verified Member</option>
                  <option value="Authorized State Reseller">Authorized State Reseller</option>
                  <option value="Active Digital Learner">Active Digital Learner</option>
                  <option value="Student Ambassador">Student Ambassador</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 text-[10px] font-bold mb-1">ब्लड ग्रुप:</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2 py-1.5 text-center text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold mb-1">DOB:</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2 py-1.5 text-center text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-bold mb-1">राज्य / पता:</label>
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2 py-1.5 text-center text-xs font-bold outline-none truncate"
                />
              </div>
            </div>

            {/* Preset Avatars & Custom Photo Upload */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="block text-slate-300 font-bold">फोटो का चयन (Select or Upload Photo):</label>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setPhotoUrl(av.url)}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition ${
                      photoUrl === av.url ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <label className="flex items-center justify-center gap-2 p-2 rounded-xl border border-dashed border-slate-700 hover:border-amber-400 bg-slate-950 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300 text-xs font-bold">अपनी गैलरी / डिवाइस से फोटो अपलोड करें</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: ULTRA CLEAN CARD DISPLAY & DOWNLOAD STUDIO (7 Cols)
           ========================================================================= */}
        <div className="lg:col-span-7 space-y-6 flex flex-col items-center">
          
          {/* Card View Switchers: Orientation, Front/Back/Both */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
            
            {/* Front / Back / Both Toggle */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-xl">
              <button
                type="button"
                onClick={() => setCardSide('front')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  cardSide === 'front'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>आगे (Front)</span>
              </button>

              <button
                type="button"
                onClick={() => setCardSide('back')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  cardSide === 'back'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>पीछे (Back)</span>
              </button>

              <button
                type="button"
                onClick={() => setCardSide('both')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  cardSide === 'both'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>दोनों भाग (Both)</span>
              </button>
            </div>

            {/* Orientation Toggle: Landscape vs Portrait */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-xl">
              <button
                type="button"
                onClick={() => setCardOrientation('landscape')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  cardOrientation === 'landscape'
                    ? 'bg-slate-800 text-amber-400 border border-amber-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>आड़ा (Landscape)</span>
              </button>

              <button
                type="button"
                onClick={() => setCardOrientation('portrait')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  cardOrientation === 'portrait'
                    ? 'bg-slate-800 text-amber-400 border border-amber-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>खड़ा (Portrait)</span>
              </button>
            </div>

          </div>

          {/* =========================================================================
              ACTUAL CARD CANVAS CONTAINERS
             ========================================================================= */}
          
          <div className="w-full flex flex-col items-center justify-center gap-6">

            {/* ================= 1. LANDSCAPE CARD (ISO/IEC 7810 ID-1 Standard) ================= */}
            {cardOrientation === 'landscape' && (
              <div className="w-full max-w-[460px] flex flex-col items-center gap-6">
                
                {/* FRONT SIDE (LANDSCAPE) */}
                {(cardSide === 'front' || cardSide === 'both') && (
                  <div className="w-full flex flex-col items-center space-y-1">
                    {cardSide === 'both' && (
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider self-start">
                        आगे का भाग (Front Side):
                      </span>
                    )}
                    <div
                      ref={cardRef}
                      className={`w-full aspect-[1.586/1] ${themeStyle.cardBg} ${themeStyle.border} text-white rounded-[24px] p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl`}
                    >
                      {/* Security Guilloche Laser Pattern */}
                      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />
                      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Top Saffron/White/Green Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow-sm" />

                      {/* Micro-Text Safety Ribbon */}
                      <div className="absolute top-1.5 left-0 right-0 overflow-hidden opacity-30 text-[5.5px] font-mono tracking-widest text-slate-400 whitespace-nowrap pointer-events-none">
                        ★ IOIS PLATFORM ★ OFFICIAL DIGITAL RESIDENT CARD ★ ISO/IEC 7810 COMPLIANT ★ 256-BIT SHA ENCRYPTED ★ DIGITAL SWAVALAMBAN NETWORK ★
                      </div>

                      {/* Header Row */}
                      <div className={`flex items-center justify-between relative z-10 border-b ${themeStyle.headerBorder} pt-1 pb-1.5`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
                            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center font-black text-amber-400 text-[10px]">
                              IOIS
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm font-black tracking-wider gold-text font-serif block leading-none">
                                IOIS DIGITAL NETWORK
                              </span>
                              <span className="text-[7.5px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1 py-0.2 rounded font-mono font-bold">
                                2026
                              </span>
                            </div>
                            <span className="text-[7px] uppercase tracking-wider text-slate-300 font-bold block mt-0.5">
                              Indian Online Integrated Services
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

                      {/* Middle Row: Photo, Details & Microchip */}
                      <div className="flex items-center gap-3.5 my-auto relative z-10 py-1">
                        
                        {/* Member Photo with Stamp */}
                        <div className="relative shrink-0">
                          <div className="w-20 h-24 sm:w-22 sm:h-25 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 shadow-xl">
                            <img
                              src={photoUrl}
                              alt={fullName}
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-950 shadow-md">
                            <BadgeCheck className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        </div>

                        {/* Member Details */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div>
                            <span className="text-[7px] uppercase tracking-wider text-slate-400 font-bold block">
                              सत्यापित सदस्य / Cardholder:
                            </span>
                            <h4 className="text-sm sm:text-base font-black text-white truncate tracking-wide leading-tight">
                              {fullName}
                            </h4>
                          </div>

                          {/* User ID & Mobile (User ID ALWAYS visible) */}
                          <div className="grid grid-cols-2 gap-x-2 text-[9px]">
                            <div>
                              <span className="text-[6.5px] uppercase text-slate-400 font-bold block">User ID (Public):</span>
                              <span className="font-mono font-black text-amber-300 truncate block">
                                {memberId}
                              </span>
                            </div>
                            <div>
                              <span className="text-[6.5px] uppercase text-slate-400 font-bold block">मोबाइल:</span>
                              <span className="font-medium text-slate-200 truncate block">
                                {displayMobile}
                              </span>
                            </div>
                          </div>

                          {/* Meta Row: Blood, DOB, State */}
                          <div className="grid grid-cols-3 gap-x-1 text-[8px] pt-0.5">
                            <div>
                              <span className="text-[6.5px] text-slate-400 block font-bold">Blood:</span>
                              <span className="font-bold text-slate-200">{displayBlood}</span>
                            </div>
                            <div>
                              <span className="text-[6.5px] text-slate-400 block font-bold">DOB:</span>
                              <span className="font-bold text-slate-200">{displayDob}</span>
                            </div>
                            <div>
                              <span className="text-[6.5px] text-slate-400 block font-bold">क्षेत्र:</span>
                              <span className="font-bold text-emerald-400 truncate block">{displayState}</span>
                            </div>
                          </div>

                          {/* Plan Badge & EMV Microchip */}
                          <div className="flex items-center justify-between gap-1 pt-0.5">
                            <span className={`inline-flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-md ${themeStyle.tagBg} truncate`}>
                              <Award className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                              <span>Plan 0{selectedPlan.id}: {selectedPlan.name} (₹{selectedPlan.price})</span>
                            </span>

                            <div className={`w-7 h-4.5 rounded-md bg-gradient-to-tr ${themeStyle.chipBg} p-0.5 shadow shrink-0 flex items-center justify-center`}>
                              <div className="w-full h-full border border-slate-900/40 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                                <div className="bg-amber-700/40 rounded-2xs"></div>
                                <div className="bg-amber-700/40 rounded-2xs"></div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Bottom Row: Dynamic Live QR & Signatory */}
                      <div className="flex items-center justify-between relative z-10 pt-1.5 border-t border-slate-800/90 text-[8px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-white rounded-lg shrink-0 shadow-md">
                            <img
                              src={effectiveQrImageSrc}
                              alt="IOIS QR Code"
                              crossOrigin="anonymous"
                              className="w-7 h-7 object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-slate-300 font-black block text-[7.5px]">
                              {qrMode === 'referral' ? 'IOIS REFERRAL SCAN' : 'VERIFIED QR SCAN'}
                            </span>
                            <span className="text-emerald-400 font-mono text-[6.5px] font-bold">
                              256-BIT SSL ENCRYPTION
                            </span>
                          </div>
                        </div>

                        <div className="text-right space-y-0.5">
                          <span className="text-[7.5px] text-slate-300 font-serif italic block">
                            IOIS Auth Signatory
                          </span>
                          <span className="text-[6.5px] text-amber-400 font-mono block">
                            CERTIFIED RESIDENT PASS
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* BACK SIDE (LANDSCAPE) */}
                {(cardSide === 'back' || cardSide === 'both') && (
                  <div className="w-full flex flex-col items-center space-y-1">
                    {cardSide === 'both' && (
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider self-start">
                        पीछे का भाग (Back Side):
                      </span>
                    )}
                    <div
                      ref={backCardRef}
                      className={`w-full aspect-[1.586/1] ${themeStyle.cardBg} ${themeStyle.border} text-white rounded-[24px] p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl`}
                    >
                      {/* Top Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

                      {/* Magnetic Stripe Bar */}
                      <div className="mt-1 -mx-5 h-8 bg-slate-950 border-y border-slate-800/80 flex items-center px-5">
                        <span className="text-[6px] font-mono text-slate-500 tracking-widest uppercase">
                          IOIS-CARD-ISO7811-256BIT-ENCRYPTED-TRACK1-TRACK2-VERIFIED
                        </span>
                      </div>

                      {/* Back Rules & Mission Statement */}
                      <div className="space-y-1.5 my-auto text-[8px] text-slate-300 leading-relaxed px-1">
                        <div className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <p>यह कार्ड IOIS डिजिटल नेटवर्क का आधिकारिक डिजिटल पहचान पत्र है।</p>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <p>प्लान 01 से 07 तक की सभी सेवाएं व 50% से 70% इंसेंटिव इस यूजर आईडी से संबद्ध हैं।</p>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <p>सत्यापन व सीधे जुड़ने के लिए कार्ड पर दिए गए QR कोड को किसी भी कैमरे से स्कैन करें।</p>
                        </div>
                      </div>

                      {/* Cardholder Sign Box & Helpdesk Bar */}
                      <div className="space-y-2 pt-1 border-t border-slate-800">
                        <div className="flex items-center justify-between text-[7.5px]">
                          <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg w-36 text-center text-slate-400 italic">
                            कार्डधारक हस्ताक्षर / Sign
                          </div>
                          <div className="text-right font-mono text-amber-300 font-bold">
                            User ID: {memberId}
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
                  </div>
                )}

              </div>
            )}

            {/* ================= 2. PORTRAIT CARD (Vertical Lanyard Badge Format) ================= */}
            {cardOrientation === 'portrait' && (
              <div className="w-full max-w-[340px] flex flex-col items-center gap-6">
                
                {/* FRONT SIDE (PORTRAIT) */}
                {(cardSide === 'front' || cardSide === 'both') && (
                  <div className="w-full flex flex-col items-center space-y-1">
                    {cardSide === 'both' && (
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider self-start">
                        आगे का भाग (Front Side):
                      </span>
                    )}
                    <div
                      ref={cardRef}
                      className={`w-full aspect-[1/1.586] ${themeStyle.cardBg} ${themeStyle.border} text-white rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl text-center`}
                    >
                      {/* Lanyard Clip Hole Simulation */}
                      <div className="w-12 h-2.5 rounded-full bg-slate-950 border border-slate-700 mx-auto -mt-2 mb-1 shadow-inner"></div>

                      {/* Top Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

                      {/* Header */}
                      <div className="space-y-0.5 border-b border-slate-800 pb-1.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black tracking-wider gold-text font-serif">
                            IOIS DIGITAL NETWORK
                          </span>
                        </div>
                        <span className="text-[7px] uppercase tracking-wider text-slate-300 font-bold block">
                          Indian Online Integrated Services
                        </span>
                      </div>

                      {/* Portrait Photo & Member Data */}
                      <div className="relative my-auto flex flex-col items-center space-y-2">
                        <div className="relative">
                          <div className="w-22 h-26 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 shadow-xl">
                            <img
                              src={photoUrl}
                              alt={fullName}
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-950 shadow-md">
                            <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        </div>

                        {/* Name & ID */}
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-black text-white tracking-wide">
                            {fullName}
                          </h4>
                          <span className="text-xs font-mono font-bold text-amber-300 block">
                            User ID: {memberId}
                          </span>
                          <span className="text-[8.5px] text-slate-400 font-bold block">
                            {userRole}
                          </span>
                        </div>

                        {/* Plan Badge */}
                        <span className={`inline-flex items-center gap-1 text-[8.5px] font-black px-2.5 py-0.5 rounded-full ${themeStyle.tagBg}`}>
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>Plan 0{selectedPlan.id}: {selectedPlan.name}</span>
                        </span>

                        {/* Quick Meta Grid */}
                        <div className="grid grid-cols-2 gap-1.5 text-[8px] w-full pt-1 text-left bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                          <div>
                            <span className="text-slate-400 block font-bold">मोबाइल:</span>
                            <span className="text-slate-200 font-medium">{displayMobile}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">Blood Group:</span>
                            <span className="text-slate-200 font-bold">{displayBlood}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">DOB:</span>
                            <span className="text-slate-200">{displayDob}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">वैधता:</span>
                            <span className="text-emerald-400 font-mono font-bold">{validThru}</span>
                          </div>
                        </div>

                      </div>

                      {/* Portrait Footer: Dynamic QR & Verification */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[8px]">
                        <div className="p-1 bg-white rounded-lg shadow">
                          <img
                            src={effectiveQrImageSrc}
                            alt="IOIS QR Code"
                            crossOrigin="anonymous"
                            className="w-7 h-7 object-contain"
                          />
                        </div>
                        <div className="text-right">
                          <span className="text-[7.5px] font-mono text-emerald-400 font-bold block">
                            256-BIT SSL ENCRYPTED
                          </span>
                          <span className="text-[6.5px] text-slate-400 uppercase">
                            OFFICIAL DIGITAL ID
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* BACK SIDE (PORTRAIT) */}
                {(cardSide === 'back' || cardSide === 'both') && (
                  <div className="w-full flex flex-col items-center space-y-1">
                    {cardSide === 'both' && (
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider self-start">
                        पीछे का भाग (Back Side):
                      </span>
                    )}
                    <div
                      ref={backCardRef}
                      className={`w-full aspect-[1/1.586] ${themeStyle.cardBg} ${themeStyle.border} text-white rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl text-center`}
                    >
                      <div className="w-12 h-2.5 rounded-full bg-slate-950 border border-slate-700 mx-auto -mt-2 mb-1 shadow-inner"></div>

                      <div className="text-center border-b border-slate-800 pb-1.5">
                        <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                          TERMS & CONDITIONS
                        </span>
                        <span className="text-[7.5px] font-mono text-slate-400 block">
                          User ID: {memberId}
                        </span>
                      </div>

                      <div className="space-y-2 text-[8px] text-slate-300 text-left my-auto leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                        <p>• यह कार्ड IOIS डिजिटल नेटवर्क का प्रमाणित पहचान पत्र है।</p>
                        <p>• 50% से 70% इंसेंटिव व डिजिटल लाइब्रेरी का अधिकार इस आईडी से सुरक्षित है।</p>
                        <p>• किसी भी सहायता हेतु आधिकारिक हेल्पलाइन पर संपर्क करें।</p>
                      </div>

                      <div className="space-y-2 pt-1 border-t border-slate-800 text-[8px]">
                        <div className="bg-slate-900 border border-slate-700 py-1 rounded-lg text-slate-400 italic text-center">
                          कार्डधारक हस्ताक्षर / Sign
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
                  </div>
                )}

              </div>
            )}

          </div>

          {/* =========================================================================
              HIGH QUALITY DOWNLOAD ACTIONS TOOLBAR (PDF, HD JPG, HD PNG)
             ========================================================================= */}
          <div className="w-full max-w-[460px] space-y-3 pt-2">
            
            <div className="text-center">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                हाई-डेफिनिशन डाउनलोड विकल्प (High Quality Exports)
              </span>
            </div>

            {/* Main 3 High-Quality Buttons */}
            <div className="grid grid-cols-3 gap-2">
              
              {/* 1. HD PNG */}
              <button
                type="button"
                onClick={() => handleDownloadPng(cardSide === 'back' ? 'back' : 'front')}
                disabled={isDownloading}
                className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>HD PNG</span>
              </button>

              {/* 2. HD JPG */}
              <button
                type="button"
                onClick={() => handleDownloadJpg(cardSide === 'back' ? 'back' : 'front')}
                disabled={isDownloading}
                className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>HD JPG</span>
              </button>

              {/* 3. Clean PDF */}
              <button
                type="button"
                onClick={() => handleDownloadPdf(cardSide === 'back' ? 'back' : 'front')}
                disabled={isDownloading}
                className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Clean PDF</span>
              </button>

            </div>

            {/* 4. Full 2-Page Front & Back Combined PDF */}
            <button
              type="button"
              onClick={handleDownloadBothSidesPdf}
              disabled={isDownloading}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-amber-500/50 text-amber-300 hover:text-amber-200 font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{isDownloading && downloadFormatLabel.includes('2-Page') ? 'PDF तैयार हो रहा है...' : 'आगे + पीछे दोनों भाग (Full 2-Page PDF) डाउनलोड करें'}</span>
            </button>

            {/* Auxiliary Tools: Print & Share */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट करें</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>शेयर करें</span>
              </button>
            </div>

          </div>

          {/* Verification Badge Footnote */}
          <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL एन्क्रिप्टेड • 100% वेरिफाइड IOIS डिजिटल पहचान पत्र</span>
          </div>

        </div>

      </div>
    </div>
  );
};
