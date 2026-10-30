import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { UserProfile, CustomMarketingTemplate } from '../types';
import { PLANS, OFFICIAL_PHONE } from '../data/plansData';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Download, 
  Send, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  MessageSquare, 
  Mail, 
  Phone, 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  BookmarkPlus,
  RefreshCw,
  Palette
} from 'lucide-react';

interface MarketingToolsSectionProps {
  user: UserProfile;
}

export const MarketingToolsSection: React.FC<MarketingToolsSectionProps> = ({ user }) => {
  // Referral link
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://iois.org.in';
  const referralUrl = `${originUrl}/?ref=${encodeURIComponent(user.userId)}&sponsor=${encodeURIComponent(user.userId)}`;

  // Copy animation feedback states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic QR Code State
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSize, setQrSize] = useState<number>(320);
  const [qrDarkColor, setQrDarkColor] = useState<string>('#000000');
  const [qrLightColor, setQrLightColor] = useState<string>('#ffffff');
  const [qrIncludeLogo, setQrIncludeLogo] = useState<boolean>(true);

  // Bulk Invitation State
  const [bulkChannel, setBulkChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [bulkInput, setBulkInput] = useState<string>('');
  const [selectedTemplateForBulk, setSelectedTemplateForBulk] = useState<string>('student-notes');
  const [bulkDispatchResults, setBulkDispatchResults] = useState<{
    total: number;
    validList: string[];
    invalidList: string[];
  } | null>(null);

  // Custom Templates State
  const STORAGE_KEY = `iois_custom_templates_${user.userId}`;
  const [customTemplates, setCustomTemplates] = useState<CustomMarketingTemplate[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // New Custom Template Form
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState<string>('');
  const [newTemplateTag, setNewTemplateTag] = useState<string>('WhatsApp स्टेटस');
  const [newTemplateContent, setNewTemplateContent] = useState<string>('');

  const selectedPlan = PLANS.find((p) => p.id === user.selectedPlanId) || PLANS[0];

  // Default pre-written viral marketing message templates
  const defaultTemplates: CustomMarketingTemplate[] = [
    {
      id: 'student-notes',
      tag: 'विद्यार्थी व नोट्स स्पेशल',
      title: 'NCERT बुक्स, नोट्स व बाल विकास किट',
      message: `🇮🇳 *भारतीय ऑनलाइन शिक्षा एवं स्वावलंबन मिशन (IOIS)* 📚\n\nनमस्ते! मैंने IOIS डिजिटल एजुकेशन प्लेटफॉर्म ज्वाइन किया है। यहाँ मात्र ₹10 से ₹999 में कक्षा 1 से 12वीं तक NCERT डिजिटल नोट्स, 700+ पेज बाल विकास किट, 3D लर्निंग और डिजिटल ID कार्ड मिलता है।\n\nसाथ ही प्रत्येक रेफरल पर 50% से 70% तक सीधा बैंक/UPI पेआउट प्राप्त होता है।\n\n👉 *मेरी रेफरल लिंक से अभी रजिस्टर करें:*\n${referralUrl}\n\n🏷️ *Sponsor ID:* ${user.userId}\n(फॉर्म भरते समय Sponsor ID में यही डालें)`,
      createdAt: '2026-01-01',
    },
    {
      id: 'income-opportunity',
      tag: 'ऑनलाइन स्वरोजगार स्पेशल',
      title: '50% से 70% इंस्टेंट पेआउट व घर बैठे कमाई',
      message: `💰 *घर बैठे मोबाइल से सीखें व 50% से 70% इंस्टेंट कमाई करें* 🚀\n\nIOIS मिशन के साथ जुड़कर लाखों विद्यार्थी व युवा आत्मनिर्भर बन रहे हैं:\n\n✅ 0 Minimum Payout (सीधा PhonePe/GPay में इंसेंटिव)\n✅ 7 डिजिटल ट्रेनिंग व एजुकेशन प्लान्स (₹10 से ₹999)\n✅ 256-Bit एन्क्रिप्टेड स्मार्ट डिजिटल ID कार्ड\n✅ 24x7 RTPS, जमीन सुधार, मौसम व ई-पेपर सेवाएं मुफ्त!\n\n👇 *मेरे साथ जुड़ने हेतु नीचे दिए गए लिंक से तुरंत साइन अप करें:*\n${referralUrl}\n\n🔐 *Sponsor ID:* ${user.userId}`,
      createdAt: '2026-01-01',
    },
    {
      id: 'shopkeeper-cybercafe',
      tag: 'साइबर कैफे व दुकानदार स्पेशल',
      title: 'दुकानदार व CSC सेंटर Reseller आमंत्रण',
      message: `🏪 *साइबर कैफे, प्रज्ञा केंद्र व स्टेशनरी दुकानदारों के लिए सुनहरा अवसर!*\n\nअपनी दुकान से ग्राहकों को RTPS सर्टिफिकेट्स, NCERT नोट्स और बाल विकास किट उपलब्ध कराएं और प्रति रेफरल 55% से 70% तक सीधा मुनाफा पाएं।\n\n👉 *IOIS Reseller बनने हेतु लिंक:*\n${referralUrl}\n\n🎯 *Sponsor Code:* ${user.userId}`,
      createdAt: '2026-01-01',
    },
    {
      id: 'whatsapp-short-status',
      tag: 'WhatsApp स्टेटस / 1-Click शेयर',
      title: 'छोटा व प्रभावशाली स्टेटस संदेश',
      message: `🇮🇳 *डिजिटल भारत, शिक्षित भारत!* 📚\nकक्षा 1 से 12वीं तक संपूर्ण डिजिटल नोट्स, बाल विकास किट व स्वरोजगार मिशन से आज ही जुड़ें।\n\nरजिस्ट्रेशन लिंक: ${referralUrl}\nSponsor ID: ${user.userId}`,
      createdAt: '2026-01-01',
    },
  ];

  const allTemplates = [...defaultTemplates, ...customTemplates];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate dynamic QR code
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(referralUrl, {
      width: qrSize,
      margin: 2,
      color: {
        dark: qrDarkColor,
        light: qrLightColor,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => console.error('QR code error', err));

    return () => {
      isMounted = false;
    };
  }, [referralUrl, qrSize, qrDarkColor, qrLightColor]);

  // Copy Referral Link with Visual Animation Feedback
  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      showToast('रेफरल लिंक सफलतापूर्वक कॉपी हो गया! 🎉');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('कॉपी करने में समस्या आई।');
    }
  };

  // Copy Sponsor ID with Visual Animation Feedback
  const handleCopySponsorId = async () => {
    try {
      await navigator.clipboard.writeText(user.userId);
      setCopiedId(true);
      showToast(`User ID [${user.userId}] कॉपी हो गया!`);
      setTimeout(() => setCopiedId(false), 2500);
    } catch {
      showToast('कॉपी करने में समस्या आई।');
    }
  };

  // Copy Message Template
  const handleCopyTemplate = async (templateId: string, message: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedTemplateId(templateId);
      showToast('मैसेज टेम्प्लेट क्लिपबोर्ड में कॉपी हो गया! अब WhatsApp पर पेस्ट करें।');
      setTimeout(() => setCopiedTemplateId(null), 2500);
    } catch {
      showToast('टेम्प्लेट कॉपी नहीं हो सका।');
    }
  };

  // Direct Share on WhatsApp
  const handleWhatsAppShare = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Download Dynamic QR Code
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `IOIS-Referral-QR-${user.userId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR कोड HD PNG फॉर्मेट में डाउनलोड हो गया!');
  };

  // Create & Save Custom Template
  const handleSaveCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim() || !newTemplateContent.trim()) {
      showToast('कृपया टेम्प्लेट का शीर्षक और मैसेज दर्ज करें।');
      return;
    }

    // Auto-inject referral link & sponsor ID if user forgot
    let finalContent = newTemplateContent.trim();
    if (!finalContent.includes(user.userId)) {
      finalContent += `\n\n👉 रजिस्ट्रेशन लिंक: ${referralUrl}\n🏷️ Sponsor ID: ${user.userId}`;
    }

    const newTemplate: CustomMarketingTemplate = {
      id: `custom-${Date.now()}`,
      title: newTemplateTitle.trim(),
      tag: newTemplateTag.trim() || 'कस्टम टेम्प्लेट',
      message: finalContent,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTemplate, ...customTemplates];
    setCustomTemplates(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Storage save failed', err);
    }

    setNewTemplateTitle('');
    setNewTemplateContent('');
    setIsCreatingTemplate(false);
    showToast('आपका व्यक्तिगत मैसेज टेम्प्लेट सफलतापूर्वक सुरक्षित हो गया!');
  };

  // Delete Custom Template
  const handleDeleteCustomTemplate = (id: string) => {
    const updated = customTemplates.filter((t) => t.id !== id);
    setCustomTemplates(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    showToast('कस्टम टेम्प्लेट हटा दिया गया।');
  };

  // Process Bulk Invitation Contacts
  const handleProcessBulkInvite = () => {
    if (!bulkInput.trim()) {
      showToast('कृपया कम से कम एक मोबाइल नंबर या ईमेल दर्ज करें।');
      return;
    }

    const rawList = bulkInput
      .split(/[\n,;]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    const validList: string[] = [];
    const invalidList: string[] = [];

    if (bulkChannel === 'whatsapp') {
      rawList.forEach((raw) => {
        const clean = raw.replace(/\D/g, '');
        // Validate 10-digit Indian number or 12-digit with 91
        if (clean.length === 10) {
          validList.push(`91${clean}`);
        } else if (clean.length === 12 && clean.startsWith('91')) {
          validList.push(clean);
        } else {
          invalidList.push(raw);
        }
      });
    } else {
      rawList.forEach((raw) => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
          validList.push(raw);
        } else {
          invalidList.push(raw);
        }
      });
    }

    setBulkDispatchResults({
      total: rawList.length,
      validList,
      invalidList,
    });
  };

  // Send Bulk WhatsApp (opens web WhatsApp for contact)
  const handleSendSingleWhatsApp = (phone: string, templateMsg: string) => {
    const encoded = encodeURIComponent(templateMsg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  // Send Bulk Email (opens default mail client with BCC list)
  const handleSendBulkEmail = (emails: string[], templateMsg: string) => {
    const subject = encodeURIComponent('IOIS डिजिटल शिक्षा व स्वरोजगार आमंत्रण');
    const body = encodeURIComponent(templateMsg);
    const bcc = emails.join(',');
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
  };

  const currentBulkTemplate =
    allTemplates.find((t) => t.id === selectedTemplateForBulk) || allTemplates[0];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border-2 border-amber-400 text-amber-300 font-bold text-xs sm:text-sm rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>IOIS OFFICIAL VIRAL MARKETING SUITE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              स्मार्ट मार्केटिंग टूल्स व आमंत्रण केंद्र
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              यहाँ से अपना <strong>रेफरल लिंक</strong>, <strong>डायनेमिक QR कोड</strong>, <strong>व्हाट्सएप वायरल मैसेज</strong> और <strong>थोक आमंत्रण (Bulk Invite)</strong> सिस्टम का उपयोग करके अपनी टीम को 10x तेजी से बढ़ाएं।
            </p>
          </div>

          {/* Quick Copy Link Widget */}
          <div className="w-full md:w-auto p-4 bg-slate-950/90 rounded-2xl border border-amber-500/40 shadow-xl space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-bold">आपका यूनिक रेफरल लिंक:</span>
              <span className="font-mono text-amber-300 font-black">{user.userId}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="bg-slate-900 text-slate-300 font-mono text-[11px] px-3 py-2 rounded-xl border border-slate-700 w-full sm:w-64 select-all outline-none"
              />
              <button
                type="button"
                onClick={handleCopyReferralLink}
                className={`px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-500 text-slate-950 scale-105'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-[1.02]'
                }`}
                title="रेफरल लिंक कॉपी करें"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                    <span>कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950" />
                    <span>लिंक कॉपी करें</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: DYNAMIC QR CODE GENERATOR STUDIO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <h4 className="text-lg font-black text-white">
                डायनेमिक रेफरल QR कोड जनरेटर (Live Dynamic QR Generator)
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              इस QR कोड को कोई भी व्यक्ति अपने Google Lens, Paytm या कैमरा से स्कैन करेगा तो सीधे आपके रेफरल लिंक पर पहुँचेगा।
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadQr}
            disabled={!qrDataUrl}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>HD PNG QR डाउनलोड करें</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* QR Display Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full">
              <div className="w-full flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-serif font-black gold-text">IOIS DIGITAL NETWORK</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  VERIFIED QR
                </span>
              </div>

              {/* QR Canvas */}
              <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Referral QR Code"
                    className="w-52 h-52 sm:w-60 sm:h-60 object-contain"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                    QR लोड हो रहा है...
                  </div>
                )}
              </div>

              {/* QR Details */}
              <div className="w-full text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[11px] text-slate-400">Sponsor ID:</span>
                  <span className="font-mono font-black text-amber-300 text-sm">{user.userId}</span>
                  <button
                    type="button"
                    onClick={handleCopySponsorId}
                    className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition"
                    title="ID कॉपी करें"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  स्कैन करके सीधे रजिस्ट्रेशन करें • 100% सुरक्षित व प्रमाणित
                </p>
              </div>
            </div>
          </div>

          {/* QR Customization Options */}
          <div className="lg:col-span-7 space-y-5">
            <h5 className="text-sm font-black text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>QR कोड कस्टमाइज़ेशन सेटिंग्स (Customization Settings)</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* QR Size */}
              <div className="space-y-1.5 p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <label className="text-xs text-slate-300 font-bold block">
                  QR रेज़ोल्यूशन साइज (Size):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Medium (280px)', value: 280 },
                    { label: 'Large (360px)', value: 360 },
                    { label: 'Ultra HD (480px)', value: 480 },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setQrSize(s.value)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer text-center ${
                        qrSize === s.value
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Dark Color */}
              <div className="space-y-1.5 p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <label className="text-xs text-slate-300 font-bold block">
                  QR पैटर्न रंग (Pattern Color):
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'क्लासिक ब्लैक', color: '#000000' },
                    { label: 'शाही गोल्ड', color: '#b45309' },
                    { label: 'नेवी ब्लू', color: '#1e3a8a' },
                    { label: 'एमराल्ड', color: '#065f46' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setQrDarkColor(c.color)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                        qrDarkColor === c.color
                          ? 'bg-white text-slate-950 border-white font-black'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: c.color }} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300 block">क्विक शेयर टूल्स:</span>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleWhatsAppShare(`मेरा IOIS ऑफिशियल रजिस्ट्रेशन QR कोड व रेफरल लिंक:\n${referralUrl}\nSponsor ID: ${user.userId}`)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp पर शेयर करें</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyReferralLink}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'रेफरल लिंक कॉपी'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PRE-WRITTEN & CUSTOM VIRAL MESSAGE TEMPLATES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h4 className="text-lg font-black text-white">
                रेफरल मैसेज टेम्प्लेट्स (WhatsApp & Social Media Templates)
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              हर मैसेज में आपका रेफरल लिंक व Sponsor ID <strong className="text-amber-300">({user.userId})</strong> पहले से जुड़ा हुआ है। 1-क्लिक में कॉपी या शेयर करें।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingTemplate ? 'फॉर्म बंद करें' : 'नया कस्टम टेम्प्लेट बनाएं'}</span>
          </button>
        </div>

        {/* Custom Template Builder Form */}
        {isCreatingTemplate && (
          <form
            onSubmit={handleSaveCustomTemplate}
            className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-black text-white flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-amber-400" />
                <span>अपना व्यक्तिगत मैसेज टेम्प्लेट तैयार करें</span>
              </h5>
              <span className="text-[10px] text-amber-400 font-mono">Auto-saved to your profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  टेम्प्लेट का नाम / शीर्षक (Title):
                </label>
                <input
                  type="text"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  placeholder="उदा. कॉलेज दोस्तों के लिए विशेष आमंत्रण"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  श्रेणी / टैग (Category Tag):
                </label>
                <select
                  value={newTemplateTag}
                  onChange={(e) => setNewTemplateTag(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
                >
                  <option value="WhatsApp स्टेटस">WhatsApp स्टेटस</option>
                  <option value="विद्यार्थी व कॉलेज">विद्यार्थी व कॉलेज</option>
                  <option value="दुकानदार व बिजनेस">दुकानदार व बिजनेस</option>
                  <option value="स्वरोजगार व पार्ट-टाइम">स्वरोजगार व पार्ट-टाइम</option>
                  <option value="पारिवारिक व मित्र">पारिवारिक व मित्र</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">
                संदेश सामग्री (Message Content):
              </label>
              <textarea
                rows={4}
                value={newTemplateContent}
                onChange={(e) => setNewTemplateContent(e.target.value)}
                placeholder="यहाँ अपना संदेश लिखें... आपका रेफरल लिंक व Sponsor ID ऑटोमैटिकली जोड़ दिया जाएगा।"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs outline-none focus:border-amber-400 leading-relaxed font-sans"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingTemplate(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition cursor-pointer shadow-md"
              >
                टेम्प्लेट सेव करें
              </button>
            </div>
          </form>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTemplates.map((t) => {
            const isCopied = copiedTemplateId === t.id;
            const isCustom = t.id.startsWith('custom-');

            return (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-3 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                      {t.tag}
                    </span>
                    <div className="flex items-center gap-1">
                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomTemplate(t.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                          title="टेम्प्लेट हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h5 className="text-sm font-black text-white">{t.title}</h5>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto">
                    {t.message}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleCopyTemplate(t.id, t.message)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      isCopied
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'कॉपी हो गया!' : 'मैसेज कॉपी करें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppShare(t.message)}
                    className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    title="सीधे WhatsApp पर भेजें"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: BULK WHATSAPP & EMAIL INVITATION TOOL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4 space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h4 className="text-lg font-black text-white">
              थोक आमंत्रण टूल (Bulk WhatsApp & Email Invitation System)
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            एक साथ कई मोबाइल नंबर या ईमेल दर्ज करके अपने दोस्तों, छात्रों या ग्राहकों को व्यक्तिगत इनविटेशन भेजें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Channel & Contacts Input */}
          <div className="lg:col-span-7 space-y-4">
            {/* Channel Switcher */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setBulkChannel('whatsapp');
                  setBulkDispatchResults(null);
                }}
                className={`py-2 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  bulkChannel === 'whatsapp'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>1. थोक WhatsApp संदेश</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBulkChannel('email');
                  setBulkDispatchResults(null);
                }}
                className={`py-2 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  bulkChannel === 'email'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>2. थोक ईमेल (Batch Email)</span>
              </button>
            </div>

            {/* Template Selector for Bulk */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">
                भेजने हेतु मैसेज टेम्प्लेट चुनें:
              </label>
              <select
                value={selectedTemplateForBulk}
                onChange={(e) => setSelectedTemplateForBulk(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
              >
                {allTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tag} - {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Contacts Input Area */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">
                {bulkChannel === 'whatsapp'
                  ? 'संपर्क नंबर दर्ज करें (अल्पविराम या नई लाइन से अलग करें):'
                  : 'ईमेल पते दर्ज करें (कॉमा या नई लाइन द्वारा अलग करें):'}
              </label>
              <textarea
                rows={5}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={
                  bulkChannel === 'whatsapp'
                    ? 'उदा.\n9876543210\n9123456789\n8877490845\n(10 अंकों का मोबाइल नंबर)'
                    : 'उदा.\nstudent1@gmail.com\nfriend@yahoo.com\ncustomer@outlook.com'
                }
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-xs outline-none focus:border-amber-400 font-mono"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                {bulkChannel === 'whatsapp'
                  ? '💡 टिप: आप अपनी एक्सेल शीट या फोन कॉन्टैक्ट्स से सीधे कॉपी-पेस्ट कर सकते हैं।'
                  : '💡 टिप: यह टूल सभी ईमेल को सुरक्षित BCC में जोड़कर आपके डिफ़ॉल्ट ईमेल से भेज देगा।'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleProcessBulkInvite}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>संपर्कों का सत्यापन व डिस्पैच सूची बनाएं (Process List)</span>
            </button>
          </div>

          {/* Right Dispatch Queue / Preview */}
          <div className="lg:col-span-5 p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
            <h5 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>डिस्पैच सत्यापन व स्थिति (Dispatch Queue)</span>
            </h5>

            {bulkDispatchResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl">
                    <span className="text-[10px] text-emerald-300 block font-bold">वैध संपर्क:</span>
                    <span className="text-xl font-black text-emerald-400">
                      {bulkDispatchResults.validList.length}
                    </span>
                  </div>

                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl">
                    <span className="text-[10px] text-red-300 block font-bold">अमान्य/गलत:</span>
                    <span className="text-xl font-black text-red-400">
                      {bulkDispatchResults.invalidList.length}
                    </span>
                  </div>
                </div>

                {/* Email Action */}
                {bulkChannel === 'email' && bulkDispatchResults.validList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSendBulkEmail(bulkDispatchResults.validList, currentBulkTemplate.message)}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>सभी {bulkDispatchResults.validList.length} ईमेल पर 1-क्लिक में भेजें</span>
                  </button>
                )}

                {/* WhatsApp Action List */}
                {bulkChannel === 'whatsapp' && (
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-300 font-bold block">
                      सत्यापित नंबरों पर 1-क्लिक में WhatsApp भेजें:
                    </span>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {bulkDispatchResults.validList.map((num, idx) => (
                        <div
                          key={num + idx}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <span className="font-mono text-slate-200">+{num}</span>
                          <button
                            type="button"
                            onClick={() => handleSendSingleWhatsApp(num, currentBulkTemplate.message)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>भेजें</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2 text-slate-400">
                <Users className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">
                  बाईं ओर नंबर या ईमेल दर्ज करके 'Process List' दबाएं। यहाँ आपकी सत्यापित सूची तैयार होगी।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
