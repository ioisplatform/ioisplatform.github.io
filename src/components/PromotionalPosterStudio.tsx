import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { UserProfile } from '../types';
import { PLANS, OFFICIAL_PHONE, OFFICIAL_EMAIL } from '../data/plansData';
import { 
  Download, 
  Share2, 
  Sparkles, 
  Printer, 
  Store, 
  GraduationCap, 
  Smartphone, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  QrCode, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw,
  Award,
  BookOpen,
  DollarSign
} from 'lucide-react';

interface PromotionalPosterStudioProps {
  user: UserProfile;
}

export type PosterTemplateType = 'shop' | 'student' | 'whatsapp' | 'income';

export const PromotionalPosterStudio: React.FC<PromotionalPosterStudioProps> = ({ user }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PosterTemplateType>('shop');
  
  // Customization fields
  const [shopName, setShopName] = useState<string>(`${user.fullName} डिजिटल सेवा केंद्र`);
  const [tagline, setTagline] = useState<string>('ऑनलाइन फॉर्म, छात्रवृत्ति व सरकारी योजना सहायता केंद्र');
  const [contactMobile, setContactMobile] = useState<string>(user.mobileNumber || '+91 9523218765');
  const [customLocation, setCustomLocation] = useState<string>(user.address || user.district || 'बिहार, भारत');
  
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const posterRef = useRef<HTMLDivElement>(null);

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ioisplatform.github.io';
  const referralLink = `${originUrl}/?ref=${encodeURIComponent(user.userId)}&sponsor=${encodeURIComponent(user.userId)}`;

  // Generate high quality QR code for poster
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(referralLink, {
      width: 400,
      margin: 1,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (isMounted) setQrCodeDataUrl(url);
      })
      .catch((err) => console.error('Poster QR code failed', err));

    return () => {
      isMounted = false;
    };
  }, [referralLink]);

  const handleDownloadPoster = async () => {
    if (!posterRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const element = posterRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5, // 2.5x HD resolution for print and sharp sharing
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#020617',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = imgData;
      downloadAnchor.download = `IOIS-Poster-${selectedTemplate.toUpperCase()}-${user.userId}.png`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    } catch (err) {
      console.error('Error rendering poster canvas', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = () => {
    let text = '';
    if (selectedTemplate === 'shop') {
      text = `🏢 *${shopName}* (IOIS डिजिटल केंद्र) 🇮🇳\n\nयहाँ सभी ऑनलाइन नागरिक सेवाएं, RTPS जाति/आय/निवास, दाखिल-खारिज, छात्रवृत्ति व सरकारी योजना फॉर्म भरे जाते हैं।\n\n👉 अपनी सेवा बुक करने या सदस्य बनने के लिए अभी रजिस्टर करें:\n${referralLink}\n\nस्पॉन्सर आईडी: *${user.userId}*\nसंपर्क: ${contactMobile}`;
    } else if (selectedTemplate === 'student') {
      text = `📚 *विद्यार्थी शिक्षा व NCERT डिजिटल नोट्स हब* 🎓\n\nकक्षा 1 से 12वीं तक सम्पूर्ण डिजिटल NCERT नोट्स, 700+ पृष्ठ बाल विकास किट, डेली मॉडल टेस्ट व स्कॉलरशिप गाइड।\n\n👉 अभी अपनी पढ़ाई शुरू करें:\n${referralLink}\n\nस्पॉन्सर आईडी: *${user.userId}*`;
    } else if (selectedTemplate === 'whatsapp') {
      text = `🔥 *घर बैठे मोबाइल से सीखें और 50%-70% पेआउट पाएं!* 🚀\n\nIOIS प्लेटफॉर्म पर सदस्य बनें और हर रेफरल पर सीधा बैंक/UPI पेआउट प्राप्त करें।\n\n✅ 0 Minimum Payout\n✅ वेरिफाइड स्टूडेंट ID कार्ड\n\n👉 तुरंत ज्वाइन करें:\n${referralLink}\n\nस्पॉन्सर आईडी: *${user.userId}*`;
    } else {
      text = `💼 *आत्मनिर्भर भारत स्वरोजगार अवसर (IOIS Platform)* 🇮🇳\n\nविद्यार्थी, युवा व महिलाएं हर दिन ₹500 से ₹2000 तक कमा रहे हैं। 7 मास्टर प्लांस (मात्र ₹10 से ₹999)।\n\n👉 ऑफिशियल रजिस्ट्रेशन लिंक:\n${referralLink}\n\nस्पॉन्सर आईडी: *${user.userId}*`;
    }

    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="glass-card-gold p-5 sm:p-6 rounded-3xl border-2 border-amber-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>IOIS ऑटोमैटिक पोस्टर जनरेटर स्टूडियो</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              दुकान, विद्यार्थी, स्टेटस व प्रचार पोस्टर बनाएं
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              1-क्लिक में अपने नाम, स्पॉन्सर आईडी और डायनामिक QR कोड के साथ प्रोफेशनल HD पोस्टर तैयार करें, डाउनलोड करें और WhatsApp पर शेयर करें।
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPoster}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isGenerating ? 'HD पोस्टर बन रहा है...' : 'HD पोस्टर डाउनलोड करें'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp शेयर</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Poster Template Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedTemplate('shop')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedTemplate === 'shop'
              ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${selectedTemplate === 'shop' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
              <Store className="w-4 h-4" />
            </div>
            {selectedTemplate === 'shop' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
          </div>
          <span className="font-black text-xs sm:text-sm text-white block">दुकान / CSC कैफे बैनर</span>
          <span className="text-[10px] text-slate-400 mt-0.5">A4 फ्लेक्स बैनर फॉर्मेट</span>
        </button>

        <button
          onClick={() => setSelectedTemplate('student')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedTemplate === 'student'
              ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${selectedTemplate === 'student' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-sky-400'}`}>
              <GraduationCap className="w-4 h-4" />
            </div>
            {selectedTemplate === 'student' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
          </div>
          <span className="font-black text-xs sm:text-sm text-white block">विद्यार्थी NCERT नोट्स</span>
          <span className="text-[10px] text-slate-400 mt-0.5">क्विज़, बुक्स व नोट्स पोस्टर</span>
        </button>

        <button
          onClick={() => setSelectedTemplate('whatsapp')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedTemplate === 'whatsapp'
              ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${selectedTemplate === 'whatsapp' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
              <Smartphone className="w-4 h-4" />
            </div>
            {selectedTemplate === 'whatsapp' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
          </div>
          <span className="font-black text-xs sm:text-sm text-white block">WhatsApp स्टेटस स्टोरी</span>
          <span className="text-[10px] text-slate-400 mt-0.5">9:16 वर्टिकल मोबाइल स्टोरी</span>
        </button>

        <button
          onClick={() => setSelectedTemplate('income')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            selectedTemplate === 'income'
              ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${selectedTemplate === 'income' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-yellow-400'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            {selectedTemplate === 'income' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
          </div>
          <span className="font-black text-xs sm:text-sm text-white block">50%-70% कमाई पोस्टर</span>
          <span className="text-[10px] text-slate-400 mt-0.5">स्वरोजगार व पेआउट इंसेंटिव</span>
        </button>
      </div>

      {/* Customization Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
          <span>पोस्टर कस्टमाइज़ेशन विवरण (आप अपने अनुसार बदल सकते हैं):</span>
          <button
            onClick={handleCopyLink}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'रेफरल लिंक कॉपी!' : 'रेफरल लिंक कॉपी'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">दुकान / सेंटर या शीर्षक नाम:</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
              placeholder="श्री राम डिजिटल सेवा केंद्र"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">संपर्क मोबाइल नंबर:</label>
            <input
              type="text"
              value={contactMobile}
              onChange={(e) => setContactMobile(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none font-mono"
              placeholder="+91 9523218765"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">स्थान / पता:</label>
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
              placeholder="पटना, बिहार (भारत)"
            />
          </div>
        </div>
      </div>

      {/* LIVE POSTER CANVAS PREVIEW WRAPPER */}
      <div className="flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950/80 rounded-3xl border border-slate-800 shadow-inner overflow-x-auto">
        <div className="mb-3 flex items-center justify-between w-full max-w-xl text-xs text-slate-400">
          <span className="font-bold flex items-center gap-1.5 text-amber-400">
            <Award className="w-3.5 h-3.5" />
            <span>लाइव HD प्रीव्यू (नीचे पोस्टर तैयार है)</span>
          </span>
          <span>आस्पेक्ट रेशियो: {selectedTemplate === 'whatsapp' ? '9:16 (Story)' : 'Flex Flyer'}</span>
        </div>

        {/* POSTER CARD (Captured by html2canvas) */}
        <div 
          ref={posterRef}
          className={`relative overflow-hidden shadow-2xl transition-all duration-300 select-none ${
            selectedTemplate === 'whatsapp'
              ? 'w-[360px] sm:w-[420px] min-h-[640px] sm:min-h-[720px] rounded-3xl border-4 border-amber-400'
              : 'w-full max-w-2xl min-h-[520px] rounded-3xl border-4 border-amber-500/80'
          }`}
          style={{
            background: 'linear-gradient(145deg, #020617 0%, #0f172a 40%, #020617 100%)',
            color: '#ffffff',
          }}
        >
          {/* Subtle Tiranga top indicator */}
          <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

          {/* TEMPLATE 1: SHOP & CSC CENTER BANNER */}
          {selectedTemplate === 'shop' && (
            <div className="p-5 sm:p-7 space-y-5">
              {/* Top Banner Header */}
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-green-500 p-0.5 shadow-md flex items-center justify-center">
                    <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-black text-amber-400">IOIS</span>
                      <span className="text-[7px] text-green-400 font-bold">INDIA</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">{shopName}</h3>
                    <p className="text-[11px] text-amber-300 font-semibold">{tagline}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase">
                    अधिकृत केंद्र
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{customLocation}</div>
                </div>
              </div>

              {/* Main Service Highlights */}
              <div className="space-y-3">
                <div className="text-center py-1 bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-md">
                  ★ यहाँ उपलब्ध प्रमुख सरकारी व डिजिटल सेवाएं ★
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-black">RTPS सेवाएं</strong>
                      <span className="text-[10px] text-slate-300">जाति, आय, निवास प्रमाण पत्र</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-black">जमीन व राजस्व सेवा</strong>
                      <span className="text-[10px] text-slate-300">दाखिल खारिज, लगान रसीद व LPC</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-black">विद्यार्थी छात्रवृत्ति</strong>
                      <span className="text-[10px] text-slate-300">NSP, PMS, बोनाफाइड व फॉर्म</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-black">सरकारी योजनाएं</strong>
                      <span className="text-[10px] text-slate-300">आयुष्मान ₹5 लाख, PM किसान</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-black">e-PAN & Aadhaar</strong>
                      <span className="text-[10px] text-slate-300">नया पैन कार्ड, संशोधन व स्टेटस</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-black">डिजिटल ID कार्ड</strong>
                      <span className="text-[10px] text-slate-300">256-बिट सुरक्षित QR मेंबर कार्ड</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR & Contact Footer */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 rounded-2xl border border-amber-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1.5 rounded-xl border-2 border-amber-400 shadow-lg shrink-0">
                    {qrCodeDataUrl && (
                      <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full inline-block">
                      SCAN TO REGISTER / VERIFY
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-white">कैमरे से QR स्कैन करें</h4>
                    <div className="text-[11px] text-amber-300 font-mono font-bold">
                      Sponsor ID: <span className="bg-slate-950 px-2 py-0.5 rounded border border-amber-500/40">{user.userId}</span>
                    </div>
                    <div className="text-[10px] text-slate-300">संचालक: {user.fullName}</div>
                  </div>
                </div>

                <div className="text-right space-y-1 shrink-0">
                  <span className="text-[10px] text-slate-400 block font-bold">संपर्क / हेल्पलाइन</span>
                  <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">{contactMobile}</div>
                  <div className="text-[9px] text-slate-400">IOIS Official Digital Partner</div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: STUDENT EXAM & NCERT NOTES */}
          {selectedTemplate === 'student' && (
            <div className="p-5 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-sky-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-xl shadow-lg">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">विद्यार्थी शिक्षा व अध्ययन हब</h3>
                    <p className="text-[11px] text-sky-300 font-semibold">कक्षा 1 से 12वीं NCERT डिजिटल नोट्स & मॉडल पेपर्स</p>
                  </div>
                </div>
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  STUDENT PORTAL
                </span>
              </div>

              <div className="p-4 bg-sky-950/40 border border-sky-500/30 rounded-2xl space-y-2">
                <h4 className="text-base font-black text-sky-300">📖 संपूर्ण डिजिटल अध्ययन सामग्री एक ही जगह:</h4>
                <ul className="text-xs space-y-1.5 text-slate-200">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✔</span>
                    <span><strong>700+ पृष्ठों की बाल विकास पुस्तक:</strong> सचित्र वर्णमाला, बारहखड़ी व सामान्य ज्ञान</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✔</span>
                    <span><strong>डेली ऑनलाइन टेस्ट व क्विज़:</strong> गणित, विज्ञान, सामान्य ज्ञान व करंट अफेयर्स</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✔</span>
                    <span><strong>3D मानव शरीर मॉडल:</strong> इंटरएक्टिव विजुअल बायोलॉजी लर्निंग</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✔</span>
                    <span><strong>डिजिटल ID कार्ड:</strong> अपना आधिकारिक स्टूडेंट मेंबर कार्ड जनरेट करें</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-sky-500/10 via-slate-900 to-sky-500/10 rounded-2xl border border-sky-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1.5 rounded-xl border-2 border-sky-400 shadow-lg shrink-0">
                    {qrCodeDataUrl && (
                      <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] bg-sky-400 text-slate-950 font-black px-2 py-0.5 rounded-full inline-block">
                      SCAN & START LEARNING
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-white mt-1">मात्र ₹10 से शुरुआत करें</h5>
                    <div className="text-[11px] text-sky-300 font-mono font-bold">
                      Sponsor ID: <span className="bg-slate-950 px-2 py-0.5 rounded border border-sky-500/40">{user.userId}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">मेंबर: {user.fullName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">हेल्पलाइन</span>
                  <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">{contactMobile}</div>
                  <div className="text-[9px] text-slate-400 mt-1">ioisplatform.github.io</div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: WHATSAPP STATUS / STORY POSTER (9:16) */}
          {selectedTemplate === 'whatsapp' && (
            <div className="p-6 sm:p-8 flex flex-col justify-between h-full min-h-[640px] sm:min-h-[720px] text-center space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WHATSAPP STATUS EXCLUSIVE</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  घर बैठे मोबाइल से <br />
                  <span className="text-amber-400">सीखें और 50%-70%</span> <br />
                  पेआउट पाएं! 💰
                </h3>

                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  विद्यार्थी, युवा और महिलाएं हर दिन अपने फ्री समय में ₹500 से ₹2000 तक इंसेंटिव प्राप्त कर रहे हैं।
                </p>
              </div>

              {/* QR Code Centerpiece */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="bg-white p-3 rounded-2xl border-4 border-amber-400 shadow-2xl">
                  {qrCodeDataUrl && (
                    <img src={qrCodeDataUrl} alt="QR Code" className="w-36 h-36 sm:w-44 sm:h-44 object-contain" />
                  )}
                </div>

                <div className="space-y-1">
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase shadow">
                    SCAN TO JOIN NOW
                  </span>
                  <div className="text-xs text-amber-300 font-mono font-bold">
                    Sponsor ID: <span className="bg-slate-950 px-2 py-0.5 rounded border border-amber-400/40">{user.userId}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-bold">{user.fullName}</div>
                </div>
              </div>

              {/* Features Pill */}
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-left">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✔</span>
                  <span className="text-slate-200">डायरेक्ट बैंक/UPI ट्रांसफर (GooglePay / PhonePe)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✔</span>
                  <span className="text-slate-200">वेरिफाइड स्टूडेंट डिजिटल ID कार्ड</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✔</span>
                  <span className="text-slate-200">मात्र ₹10 से शुरू (7 मास्टर प्लांस)</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 border-t border-slate-800 pt-2">
                अधिक जानकारी हेतु WhatsApp करें: <span className="font-mono text-emerald-400 font-bold">{contactMobile}</span>
              </div>
            </div>
          )}

          {/* TEMPLATE 4: DAILY INCOME & SELF EMPLOYMENT */}
          {selectedTemplate === 'income' && (
            <div className="p-5 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">
                    आत्मनिर्भर भारत डिजिटल स्वरोजगार मिशन
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">50% से 70% तुरंत रेफरल इंसेंटिव</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">₹500 - ₹2000</span>
                  <span className="text-[9px] text-slate-400 block">दैनिक संभावित आय</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Plan 01 (₹10)</span>
                  <strong className="text-amber-400 text-sm font-black">₹7 पेआउट</strong>
                  <span className="text-[9px] text-emerald-400 block font-bold">70% इंसेंटिव</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Plan 04 (₹199)</span>
                  <strong className="text-amber-400 text-sm font-black">₹119 पेआउट</strong>
                  <span className="text-[9px] text-emerald-400 block font-bold">60% इंसेंटिव</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Plan 07 (₹999)</span>
                  <strong className="text-amber-400 text-sm font-black">₹500 पेआउट</strong>
                  <span className="text-[9px] text-emerald-400 block font-bold">50% इंसेंटिव</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 rounded-2xl border border-emerald-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1.5 rounded-xl border-2 border-emerald-400 shadow-lg shrink-0">
                    {qrCodeDataUrl && (
                      <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full inline-block">
                      SCAN & START EARNING TODAY
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-white mt-1">तुरंत सदस्य बनें व कमाएं</h5>
                    <div className="text-[11px] text-amber-300 font-mono font-bold">
                      Sponsor ID: <span className="bg-slate-950 px-2 py-0.5 rounded border border-amber-400/40">{user.userId}</span>
                    </div>
                    <div className="text-[10px] text-slate-300">स्पॉन्सर: {user.fullName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">हेल्पलाइन</span>
                  <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">{contactMobile}</div>
                  <div className="text-[9px] text-slate-400">Direct UPI Settlement</div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Footnote */}
          <div className="p-2.5 bg-slate-950/90 text-center border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between px-6">
            <span>IOIS - Indian Online Income Supporting System</span>
            <span className="text-amber-400 font-bold">Verified Member Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
