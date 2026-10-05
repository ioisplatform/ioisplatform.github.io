import React, { useState, useRef, useEffect } from 'react';
import { MemberProfile } from '../types';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { updateMemberProfile } from '../services/userService';
import { 
  X, 
  Download, 
  Share2, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Award, 
  UserCheck, 
  Crown,
  Check,
  Copy,
  Eye,
  EyeOff,
  RotateCw,
  Camera,
  Upload,
  Link as LinkIcon,
  Lock,
  Edit3,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Save,
  Globe
} from 'lucide-react';

interface IdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: MemberProfile | null;
  member?: MemberProfile | null;
  onProfileUpdated?: (updated: MemberProfile) => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  member,
  onProfileUpdated
}) => {
  const activeUser = member || currentUser;

  // View Controls
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [maskDetails, setMaskDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Editable Fields (User ID is strictly non-editable!)
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [planName, setPlanName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // QR Code Customization
  const [qrType, setQrType] = useState<'referral' | 'customLink' | 'customImage'>('referral');
  const [customQrLink, setCustomQrLink] = useState('');
  const [customQrImage, setCustomQrImage] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize data from active user
  useEffect(() => {
    if (activeUser) {
      setName(activeUser.name || 'विद्यार्थी');
      setGrade(activeUser.grade || activeUser.designation || 'Class 1 to 5');
      setPlanName(activeUser.planName || 'Bal Vikas Access (Plan 01)');
      setPhone(activeUser.phone || '');
      setCity(activeUser.city || 'पटना');
      setState(activeUser.state || 'बिहार');
      if (activeUser.avatarUrl) {
        setProfilePhoto(activeUser.avatarUrl);
      }
      if (activeUser.customQrImage) {
        setCustomQrImage(activeUser.customQrImage);
        setQrType('customImage');
      } else if (activeUser.customQrUrl) {
        setCustomQrLink(activeUser.customQrUrl);
        setQrType('customLink');
      } else {
        setCustomQrLink(`https://ioisplatform.github.io/student/?ref=${activeUser.rollNumber || activeUser.memberId}`);
        setQrType('referral');
      }
    }
  }, [activeUser]);

  const handleSaveCardAndProfile = () => {
    if (!activeUser) return;
    setIsSaving(true);
    const resolvedQrUrl = qrType === 'customLink' 
      ? customQrLink.trim() 
      : qrType === 'referral' 
        ? `https://ioisplatform.github.io/student/?ref=${userIdentifier}` 
        : '';
    const resolvedQrImage = qrType === 'customImage' ? (customQrImage || '') : '';

    const res = updateMemberProfile({
      memberId: activeUser.memberId,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      state: state.trim(),
      designation: grade.trim(),
      avatarUrl: profilePhoto || '',
      customQrUrl: resolvedQrUrl,
      customQrImage: resolvedQrImage
    });

    setIsSaving(false);
    if (res.success && res.member) {
      setSaveSuccessMsg('✓ आईडी कार्ड व प्रोफाइल फोटो सफलतापूर्वक अपडेट हो गई!');
      onProfileUpdated?.(res.member);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  if (!isOpen || !activeUser) return null;

  const currentPlan = ioisMasterPlans.find(p => p.id === activeUser.planId) || ioisMasterPlans[0];
  const isSupreme = activeUser.planId === 'plan-07';
  const userIdentifier = activeUser.rollNumber || activeUser.memberId;

  // Masked or unmasked phone number
  const displayPhone = maskDetails 
    ? (phone ? `${phone.slice(0, 3)}******${phone.slice(-2)}` : '987******10')
    : (phone || '8877490845');

  // Compute live active QR URL
  const activeQrTarget = qrType === 'customLink' && customQrLink.trim()
    ? customQrLink.trim()
    : `https://ioisplatform.github.io/student/?ref=${userIdentifier}`;

  const dynamicQrUrl = qrType === 'customImage' && customQrImage
    ? customQrImage
    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(activeQrTarget)}`;

  const handleCopyMemberId = () => {
    navigator.clipboard.writeText(userIdentifier);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShare = () => {
    const text = `मेरा IOIS आधिकारिक डिजिटल ID कार्ड: ${name} (User ID: ${userIdentifier}), प्लान: ${planName}। छात्र पोर्टल: ${activeQrTarget}`;
    if (navigator.share) {
      navigator.share({ title: 'IOIS Student ID Card', text: text, url: activeQrTarget });
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Custom QR Upload
  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomQrImage(event.target?.result as string);
        setQrType('customImage');
      };
      reader.readAsDataURL(file);
    }
  };

  // High-Resolution Direct HD PNG Download using Canvas API
  const handleDownloadHDPng = () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsDownloading(false);
        return;
      }

      const isLandscape = orientation === 'landscape';
      canvas.width = isLandscape ? 1200 : 750;
      canvas.height = isLandscape ? 750 : 1200;

      // Draw Base Background
      const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (isSupreme) {
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(0.5, '#1e1b4b');
        bgGrad.addColorStop(1, '#020617');
      } else {
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(0.5, '#1e3a8a');
        bgGrad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Card Outer Gold Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // National Tricolor Ribbon on top
      const tricolorHeight = 14;
      const partW = canvas.width / 4;
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(10, 10, partW, tricolorHeight);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10 + partW, 10, partW, tricolorHeight);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(10 + partW * 2, 10, partW, tricolorHeight);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(10 + partW * 3, 10, partW, tricolorHeight);

      // Top Header Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(14, 24, canvas.width - 28, 90);

      // Brand Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('IOIS INDIA DIGITAL EDUCATION', 36, 68);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('राष्ट्रीय छात्र सेवा कंसोल • National Student Services', 36, 96);

      // Verified Badge Pill
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(canvas.width - 220, 44, 180, 42);
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 16px monospace';
      ctx.fillText('100% VERIFIED', canvas.width - 200, 71);

      // User ID Highlight Box (NON-EDITABLE)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(36, 130, canvas.width - 72, 60);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 130, canvas.width - 72, 60);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(`OFFICIAL USER ID: ${userIdentifier}`, 56, 168);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('🔒 स्थायी व गैर-संपादन योग्य (Permanent Roll No)', canvas.width - 400, 168);

      // Student Details
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(name || activeUser.name, 36, 240);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`कक्षा / स्तर: `, 36, 290);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(grade || activeUser.grade || 'Primary', 160, 290);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`सक्रिय प्लान: `, 36, 335);
      ctx.fillStyle = '#4ade80';
      ctx.fillText(`${planName || currentPlan.name}`, 160, 335);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`मोबाइल: `, 36, 380);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(displayPhone, 160, 380);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`स्थान: `, 36, 425);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${city}, ${state}`, 160, 425);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`पंजीकरण तिथि: `, 36, 470);
      ctx.fillStyle = '#fde047';
      ctx.fillText(activeUser.joinedDate || '01/01/2026', 180, 470);

      // Footer
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(14, canvas.height - 70, canvas.width - 28, 56);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('हेल्पलाइन: +91 8877490845 • ioisplatform.github.io/student', 36, canvas.height - 35);

      ctx.fillStyle = '#facc15';
      ctx.font = '900 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('AUTHENTICATED STUDENT CARD', canvas.width - 340, canvas.height - 35);

      // Draw QR Code Image if loaded
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        const qrSize = isLandscape ? 200 : 180;
        const qrX = canvas.width - qrSize - 40;
        const qrY = isLandscape ? 220 : 520;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        // Export and trigger download
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `IOIS_Student_ID_${userIdentifier}.png`;
        link.href = url;
        link.click();
        setIsDownloading(false);
      };
      qrImg.onerror = () => {
        // Fallback export without QR image
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `IOIS_Student_ID_${userIdentifier}.png`;
        link.href = url;
        link.click();
        setIsDownloading(false);
      };
      qrImg.src = dynamicQrUrl;

    } catch (e) {
      console.warn('Canvas export error:', e);
      setIsDownloading(false);
      window.print();
    }
  };

  // High Quality Printable Document
  const handlePrintableDocument = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>IOIS Student ID Card - ${name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap');
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              background: #f8fafc;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 24px;
            }
            .card {
              width: 520px;
              background: linear-gradient(135deg, #090d16 0%, #1e3a8a 50%, #0f172a 100%);
              border-radius: 24px;
              border: 3px solid #d4af37;
              box-shadow: 0 25px 50px rgba(0,0,0,0.35);
              color: white;
              overflow: hidden;
              position: relative;
            }
            .ribbon {
              height: 8px;
              background: linear-gradient(90deg, #ea580c 0%, #ffffff 35%, #1e3a8a 65%, #16a34a 100%);
            }
            .header {
              padding: 16px 22px;
              background: rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid rgba(212,175,55,0.3);
            }
            .header-title {
              font-size: 16px;
              font-weight: 900;
              color: white;
            }
            .header-sub {
              font-size: 10px;
              color: #fde047;
              font-weight: bold;
            }
            .badge {
              background: #d4af37;
              color: #0f172a;
              font-size: 10px;
              font-weight: 900;
              padding: 5px 10px;
              border-radius: 8px;
            }
            .id-box {
              background: rgba(15, 23, 42, 0.8);
              border: 1px solid #38bdf8;
              padding: 8px 16px;
              margin: 14px 20px 0 20px;
              border-radius: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .id-text {
              font-family: monospace;
              font-size: 14px;
              font-weight: 900;
              color: #fde047;
            }
            .body {
              padding: 18px 22px;
              display: flex;
              gap: 18px;
            }
            .photo-box {
              width: 100px;
              height: 120px;
              background: #1e293b;
              border: 2px solid #d4af37;
              border-radius: 14px;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 38px;
              flex-shrink: 0;
            }
            .photo-box img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .info {
              flex: 1;
            }
            .student-name {
              font-size: 20px;
              font-weight: 900;
              color: white;
              margin-bottom: 6px;
            }
            .row {
              font-size: 12px;
              color: #cbd5e1;
              line-height: 1.6;
            }
            .row strong {
              color: white;
            }
            .qr-col {
              width: 90px;
              flex-shrink: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .qr-box {
              width: 80px;
              height: 80px;
              background: white;
              padding: 4px;
              border-radius: 8px;
            }
            .qr-box img {
              width: 100%;
              height: 100%;
            }
            .qr-label {
              font-size: 8px;
              color: #94a3b8;
              margin-top: 4px;
              text-align: center;
            }
            .footer {
              padding: 12px 22px;
              background: rgba(0,0,0,0.6);
              border-top: 1px solid rgba(255,255,255,0.1);
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 10px;
              color: #94a3b8;
            }
            .print-btn {
              margin-top: 24px;
              padding: 12px 30px;
              background: #1e3a8a;
              color: white;
              border: none;
              border-radius: 12px;
              font-weight: 800;
              cursor: pointer;
              font-size: 14px;
              box-shadow: 0 4px 12px rgba(30,58,138,0.4);
            }
            @media print {
              .print-btn { display: none; }
              body { background: white; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="ribbon"></div>
            <div class="header">
              <div>
                <div class="header-title">🇮🇳 IOIS INDIA DIGITAL EDUCATION</div>
                <div class="header-sub">राष्ट्रीय डिजिटल छात्र सेवा केंद्र • National Student Service</div>
              </div>
              <div class="badge">100% VERIFIED ID</div>
            </div>
            
            <div class="id-box">
              <span class="id-text">USER ID / ROLL NO: ${userIdentifier}</span>
              <span style="font-size: 10px; color: #38bdf8;">🔒 स्थायी एवं अधिकृत</span>
            </div>

            <div class="body">
              <div class="photo-box">
                ${profilePhoto 
                  ? `<img src="${profilePhoto}" alt="${name}" />`
                  : `👨‍🎓`
                }
              </div>
              <div class="info">
                <div class="student-name">${name}</div>
                <div class="row">कक्षा: <strong>${grade || 'Primary'}</strong></div>
                <div class="row">प्लान: <strong style="color: #4ade80;">${planName || currentPlan.name}</strong></div>
                <div class="row">मोबाइल: <strong>${displayPhone}</strong></div>
                <div class="row">स्थान: <strong>${city}, ${state}</strong></div>
              </div>
              <div class="qr-col">
                <div class="qr-box">
                  <img src="${dynamicQrUrl}" alt="QR" />
                </div>
                <div class="qr-label">स्कैन करें / रेफरल</div>
              </div>
            </div>

            <div class="footer">
              <div>पंजीकरण: ${activeUser.joinedDate || '01/01/2026'} • हेल्पलाइन: +91 8877490845</div>
              <div style="color: #fde047; font-weight: bold;">OFFICIAL STUDENT ID</div>
            </div>
          </div>
          <button class="print-btn" onclick="window.print()">📥 सेव / प्रिंट करें (Save as PDF)</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn font-sans">
      
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Tricolor Ribbon on top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white via-blue-800 to-emerald-600" />

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0f172a] to-blue-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              🪪
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                आधिकारिक डिजिटल स्मार्ट छात्र ID कार्ड
              </h3>
              <p className="text-[11px] text-amber-200">
                User ID: <span className="font-mono font-black text-white">{userIdentifier}</span> (स्थायी एवं गैर-संपादन योग्य)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Toolbar: Front/Back, Landscape/Portrait, Mask, Edit Toggle */}
        <div className="bg-slate-100 p-2.5 sm:p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Side & Orientation */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-xl border border-slate-300">
              <button
                onClick={() => setCardSide('front')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  cardSide === 'front' ? 'bg-[#1e3a8a] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                आगे (Front)
              </button>
              <button
                onClick={() => setCardSide('back')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  cardSide === 'back' ? 'bg-[#1e3a8a] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                पीछे (Back)
              </button>
            </div>

            <button
              onClick={() => setOrientation(orientation === 'landscape' ? 'portrait' : 'landscape')}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold flex items-center gap-1 hover:bg-slate-50 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{orientation === 'landscape' ? 'Portrait' : 'Landscape'}</span>
            </button>
          </div>

          {/* Privacy Mask & Edit Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMaskDetails(!maskDetails)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold flex items-center gap-1 hover:bg-slate-50 transition-colors"
              title="फोन नंबर मास्क या सार्वजनिक करें"
            >
              {maskDetails ? <Eye className="w-3.5 h-3.5 text-blue-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
              <span>{maskDetails ? 'अनमास्क' : 'मास्क फोन'}</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all shadow-xs ${
                isEditing 
                  ? 'bg-amber-400 text-slate-950 border border-amber-300' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'कस्टमाइजेशन बंद करें' : 'कार्ड कस्टमाइज़ करें'}</span>
            </button>
          </div>

        </div>

        {/* Scrollable Center: Customization Drawer + Live ID Card */}
        <div className="p-4 sm:p-6 bg-slate-200/90 overflow-y-auto flex-1 space-y-4">
          
          {/* CUSTOMIZATION FORM (User can edit everything except User ID) */}
          {isEditing && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-400 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span className="font-black text-slate-900 text-sm">
                    कार्ड विवरण कस्टमाइज़ करें (Customize ID Details)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  लाइव पूर्वावलोकन सक्रिय
                </span>
              </div>

              {/* Locked User ID notice */}
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <span className="font-black text-[#1e3a8a] block">
                      अपरिवर्तनीय छात्र User ID: <span className="font-mono text-amber-600">{userIdentifier}</span>
                    </span>
                    <span className="text-[10px] text-slate-600">
                      सुरक्षा एवं सत्यापन नियमों के तहत यह रोल नंबर स्थायी एवं गैर-संपादन योग्य है।
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyMemberId}
                  className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] shrink-0"
                >
                  {copiedId ? 'कॉपी हुआ!' : 'कॉपी ID'}
                </button>
              </div>

              {/* Editable Name & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">विद्यार्थी का नाम *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. राहुल कुमार"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold text-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">कक्षा / स्तर *</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="उदा. Class 1-5 / Primary"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold text-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Editable Plan & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">योजना का नाम</label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="उदा. Bal Vikas Access (Plan 01)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold text-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">मोबाइल नंबर</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="उदा. 8877490845"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold text-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Editable City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">शहर (City)</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="उदा. पटना"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold text-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">राज्य (State)</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="उदा. बिहार"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold text-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Profile Photo & QR Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100 text-xs">
                {/* Photo Upload */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>प्रोफाइल फोटो अपलोड करें</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-300 font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>फोटो चुनें</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoUpload}
                      />
                    </label>
                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={() => setProfilePhoto(null)}
                        className="text-red-600 hover:text-red-700 font-bold text-[11px]"
                      >
                        फोटो हटाएं
                      </button>
                    )}
                  </div>

                  {/* Ready-to-use Student Avatars */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">
                      या त्वरित डिजिटल छात्र अवतार चुनें:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { label: 'छात्र', icon: '👨‍🎓', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
                        { label: 'छात्रा', icon: '👩‍🎓', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
                        { label: 'स्कॉलर', icon: '🧑‍💻', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
                        { label: 'साइंस स्टार', icon: '🔬', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
                      ].map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProfilePhoto(av.url)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-bold flex items-center gap-1 transition-all"
                          title={av.label}
                        >
                          <span>{av.icon}</span>
                          <span className="text-[10px]">{av.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* QR Code Configuration & Profile Link */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-purple-600" />
                    <span>QR कोड लिंक / पता / पर्सनल QR चुनें</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="qrType"
                          checked={qrType === 'referral'}
                          onChange={() => setQrType('referral')}
                          className="text-blue-600"
                        />
                        <span className="font-bold text-slate-800 text-[11px]">रेफरल लिंक</span>
                      </label>

                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="qrType"
                          checked={qrType === 'customLink'}
                          onChange={() => setQrType('customLink')}
                          className="text-blue-600"
                        />
                        <span className="font-bold text-slate-800 text-[11px]">कस्टम पता/लिंक</span>
                      </label>

                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="qrType"
                          checked={qrType === 'customImage'}
                          onChange={() => setQrType('customImage')}
                          className="text-blue-600"
                        />
                        <span className="font-bold text-slate-800 text-[11px]">पर्सनल QR फोटो</span>
                      </label>
                    </div>

                    {qrType === 'customLink' && (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={customQrLink}
                          onChange={(e) => setCustomQrLink(e.target.value)}
                          placeholder="उदा. https://wa.me/918877490845 या पर्सनल प्रोफाइल लिंक"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 outline-none text-[11px] font-mono"
                        />
                        <span className="text-[10px] text-slate-500 block">
                          कार्ड के QR कोड को स्कैन करने पर यह लिंक खुलेगा।
                        </span>
                      </div>
                    )}

                    {qrType === 'customImage' && (
                      <div className="space-y-1.5">
                        <label className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 font-bold cursor-pointer inline-flex items-center gap-1 text-[11px]">
                          <Upload className="w-3 h-3" />
                          <span>अपना पर्सनल UPI / संपर्क QR इमेज अपलोड करें</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleQrUpload}
                          />
                        </label>
                        {customQrImage && (
                          <div className="flex items-center gap-2">
                            <img src={customQrImage} alt="Custom QR" className="w-8 h-8 rounded border border-slate-300 object-contain p-0.5 bg-white" />
                            <span className="text-[10px] text-emerald-600 font-bold">✓ पर्सनल QR फोटो सक्रिय</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Save changes to profile and dashboard */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] font-bold text-slate-600">
                  {saveSuccessMsg ? (
                    <span className="text-emerald-700 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{saveSuccessMsg}</span>
                    </span>
                  ) : (
                    <span>बदलाव सुरक्षित करने पर आईडी कार्ड व डैशबोर्ड में तुरंत अपडेट होगा।</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSaveCardAndProfile}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'सुरक्षित हो रहा है...' : '💾 ID कार्ड व प्रोफाइल सेव करें (Save to Dashboard)'}</span>
                </button>
              </div>

            </div>
          )}

          {/* LIVE ID CARD DISPLAY CONTAINER */}
          <div className="flex items-center justify-center py-2">
            
            <div 
              ref={cardRef}
              className={`w-full transition-all duration-300 ${
                orientation === 'portrait' ? 'max-w-xs' : 'max-w-lg'
              }`}
            >
              {cardSide === 'front' ? (
                /* FRONT OF ID CARD */
                <div className={`rounded-2xl overflow-hidden shadow-2xl border-2 ${
                  isSupreme 
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/90 border-amber-400' 
                    : 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 border-[#d4af37]'
                } text-white`}>
                  
                  {/* Tricolor Accent Header */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

                  <div className="p-4 sm:p-5 space-y-3.5">
                    {/* Card Brand Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                          IOIS
                        </div>
                        <div>
                          <span className="font-black text-sm text-white tracking-wide block">
                            IOIS INDIA DIGITAL EDUCATION
                          </span>
                          <span className="text-[10px] text-amber-300 font-medium block">
                            राष्ट्रीय छात्र सेवा कंसोल • Student Smart ID
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        100% VERIFIED
                      </span>
                    </div>

                    {/* Member Details, Photo & QR */}
                    <div className={`flex ${orientation === 'portrait' ? 'flex-col items-center text-center' : 'items-center'} gap-3.5`}>
                      
                      {/* Photo with frame */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-22 sm:w-22 sm:h-26 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-800 flex items-center justify-center shadow-lg">
                          {profilePhoto ? (
                            <img 
                              src={profilePhoto} 
                              alt={name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center font-black text-3xl text-white">
                              {name ? name.charAt(0).toUpperCase() : '👨‍🎓'}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="font-black text-base sm:text-lg text-white truncate">
                          {name}
                        </h4>
                        
                        {/* STRICTLY NON-EDITABLE Official User ID with Copy Button */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-black font-mono bg-blue-900/80 border border-blue-400 text-amber-300 shadow-2xs">
                            <Lock className="w-3 h-3 text-amber-300" />
                            <span>USER ID:</span>
                            <span>{userIdentifier}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyMemberId}
                            title="Copy Member ID"
                            className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedId ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                            <span>{copiedId ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        <div className="text-[11px] text-slate-300 space-y-0.5 pt-1">
                          <div>कक्षा: <strong className="text-white">{grade || 'Primary'}</strong></div>
                          <div>प्लान: <strong className="text-emerald-400">{planName}</strong></div>
                          <div>मोबाइल: <span className="font-mono">{displayPhone}</span></div>
                          <div>शहर/राज्य: <span>{city}, {state}</span></div>
                        </div>
                      </div>

                      {/* Attached Dynamic QR Code */}
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-white p-1 shadow-md border border-slate-300">
                          <img 
                            src={dynamicQrUrl} 
                            alt="Student QR Code" 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <span className="text-[9px] font-bold text-amber-300 mt-1">
                          {qrType === 'referral' ? 'रेफरल QR' : 'कस्टम QR'}
                        </span>
                      </div>

                    </div>

                    {/* Card Bottom Bar */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <div>पंजीकरण: {activeUser.joinedDate || '01/01/2026'}</div>
                      <div className="text-amber-300 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-300" />
                        <span>100% NON-EDITABLE USER ID</span>
                      </div>
                    </div>

                  </div>

                </div>
              ) : (
                /* BACK OF ID CARD */
                <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-900 text-white p-5 space-y-3.5">
                  <div className="text-center space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/30 uppercase tracking-wider">
                      IOIS Lifetime Master Access - सम्पूर्ण अध्ययन किट 2026
                    </span>
                    <h5 className="font-black text-xs uppercase tracking-wider text-amber-400">
                      अधिकृत छात्र पहचान पत्र एवं सेवा प्रमाणन
                    </h5>
                    <p className="text-[10px] text-slate-400">
                      राष्ट्रीय डिजिटल छात्र सेवा केंद्र • National Digital Student Service
                    </p>
                  </div>

                  {/* Personal QR or Profile Address Row on Card Back */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] text-amber-300 font-bold block flex items-center gap-1">
                        <QrCode className="w-3 h-3" />
                        <span>पर्सनल प्रोफाइल पता व QR कोड:</span>
                      </span>
                      <div className="font-mono text-[11px] text-slate-300 truncate">
                        {customQrLink || `https://ioisplatform.github.io/student/?ref=${userIdentifier}`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        पता: {activeUser.address || `${city}, ${state}`}
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-white p-1 rounded-lg shrink-0 border border-slate-400">
                      <img 
                        src={dynamicQrUrl} 
                        alt="Personal/Referral QR" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 space-y-1 leading-relaxed">
                    <div>1. <strong>स्थायी रोल नंबर:</strong> जारी किया गया यूजर कोड ({userIdentifier}) स्थायी एवं अपरिवर्तनीय है।</div>
                    <div>2. <strong>वैधता:</strong> यह पास पंजीकृत विद्यार्थी के निजी अध्ययन व 2026 अध्ययन किट हेतु मान्य है।</div>
                    <div>3. <strong>डिजिटल किट:</strong> 1-12th NCERT, NEET/JEE, ADCA कम्प्यूटर, Tally व वीडियो क्लास सुलभ हैं।</div>
                    <div>4. <strong>रेफरल पेआउट:</strong> अपने QR कोड को मित्रों से शेयर करने पर 50% से 70% इंसेंटिव देय है।</div>
                    <div>5. <strong>हेल्पलाइन:</strong> किसी भी समस्या या पेआउट हेतु संपर्क करें: <strong>+91 8877490845</strong></div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                    <div className="font-mono text-slate-400">
                      REF: {activeUser.paymentRef || 'VERIFIED-ONLINE-2026'}
                    </div>
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>STATUS: {activeUser.status || 'Active'}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Modal Actions Footer: Share, Print, Download HD PNG, Download PDF */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-[11px] text-slate-600 font-medium">
            User ID: <strong className="text-[#1e3a8a] font-mono">{userIdentifier}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'लिंक कॉपी हुआ!' : 'शेयर'}</span>
            </button>

            <button
              onClick={handlePrintableDocument}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट / PDF</span>
            </button>

            <button
              onClick={handleDownloadHDPng}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 hover:brightness-105 text-slate-950 font-black flex items-center gap-1.5 shadow-md transition-all tracking-wide cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'तैयार हो रहा है...' : 'डाउनलोड HD कार्ड (PNG)'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
