import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  PLANS,
  OFFICIAL_UPI_ID,
  OFFICIAL_PAYEE_NAME,
  OFFICIAL_PHONE,
} from '../data/plansData';
import {
  registerMemberBySponsorAsync,
  checkUsernameAvailableAsync,
  validateFullName,
  validateMobileNumber,
  validateEmailAddress,
  checkUserAlreadyExists,
} from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { Plan3DSelector } from './Plan3DSelector';
import QRCode from 'qrcode';
import {
  X,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Send,
  KeyRound,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Loader2,
  Lock,
  Download,
} from 'lucide-react';

interface SponsorAddMemberModalProps {
  isOpen: boolean;
  sponsorUser: UserProfile;
  initialPlanId?: number;
  onClose: () => void;
  onSuccess?: (newUser: UserProfile) => void;
}

export const SponsorAddMemberModal: React.FC<SponsorAddMemberModalProps> = ({
  isOpen,
  sponsorUser,
  initialPlanId,
  onClose,
  onSuccess,
}) => {
  // Personal Details
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');

  // Live Field Validations
  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateMsg, setDuplicateMsg] = useState('');

  // Plan, Role, Username, Photo & Password
  const [selectedPlanId, setSelectedPlanId] = useState<number>(initialPlanId || 1);
  const [role, setRole] = useState<string>('Verified Elite Member');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    msg?: string;
  }>({ checking: false });
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );
  const [googleDrivePhotoLink, setGoogleDrivePhotoLink] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [confirmTempPassword, setConfirmTempPassword] = useState('');

  // Official Payment & Payout Proof
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'QR' | 'Bank'>('UPI');
  const [paymentUtr, setPaymentUtr] = useState('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('');
  const [googleDrivePaymentLink, setGoogleDrivePaymentLink] = useState('');
  const [payoutUpi, setPayoutUpi] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdMember, setCreatedMember] = useState<UserProfile | null>(null);
  const [copiedSlip, setCopiedSlip] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];
  const upiPaymentUri = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodeURIComponent(
    OFFICIAL_PAYEE_NAME
  )}&am=${selectedPlan.price}&cu=INR&tn=${encodeURIComponent(`IOIS ${selectedPlan.code}`)}`;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(upiPaymentUri, {
      width: 240,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [upiPaymentUri]);

  useEffect(() => {
    if (initialPlanId) setSelectedPlanId(initialPlanId);
  }, [initialPlanId]);

  useEffect(() => {
    const clean = username.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
    if (!clean) {
      setUsernameStatus({ checking: false });
      return;
    }
    if (clean.length < 3) {
      setUsernameStatus({
        checking: false,
        available: false,
        msg: 'यूजरनेम कम से कम 3 अक्षरों का होना चाहिए',
      });
      return;
    }
    let cancelled = false;
    setUsernameStatus({ checking: true });
    const t = setTimeout(async () => {
      const res = await checkUsernameAvailableAsync(clean);
      if (!cancelled) {
        setUsernameStatus({
          checking: false,
          available: res.available,
          msg: res.available ? res.message : res.error,
        });
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [username]);

  if (!isOpen) return null;

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    if (val.trim().length >= 3) {
      const check = validateFullName(val);
      setNameError(check.isValid ? '' : check.error || 'अमान्य नाम');
    } else if (val.trim().length > 0) {
      setNameError('नाम कम से कम 3 अक्षरों का होना चाहिए');
    } else {
      setNameError('');
    }
  };

  const verifyDuplicate = async (mob: string, em: string) => {
    const digits = mob.replace(/\D/g, '');
    if (digits.length < 10 && em.trim().length < 5) {
      setDuplicateMsg('');
      return;
    }
    try {
      setIsCheckingDuplicate(true);
      const res = await checkUserAlreadyExists(mob, em);
      setIsCheckingDuplicate(false);
      if (res.exists) {
        setDuplicateMsg(
          `यह ${
            res.matchedBy === 'both'
              ? 'मोबाइल नंबर व ईमेल'
              : res.matchedBy === 'mobile'
              ? 'मोबाइल नंबर'
              : 'ईमेल'
          } पहले से पंजीकृत है। कृपया नया विवरण दर्ज करें।`
        );
      } else {
        setDuplicateMsg('');
      }
    } catch {
      setIsCheckingDuplicate(false);
    }
  };

  const handleMobileChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    setMobileNumber(digits);
    if (digits.length >= 10) {
      const check = validateMobileNumber(digits);
      if (!check.isValid) {
        setMobileError(check.error || 'अमान्य मोबाइल नंबर');
      } else {
        setMobileError('');
        verifyDuplicate(digits, email);
      }
    } else if (digits.length > 0) {
      setMobileError('10 अंकों का मोबाइल नंबर होना चाहिए');
    } else {
      setMobileError('');
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.trim()) {
      const check = validateEmailAddress(val);
      if (!check.isValid && val.includes('@')) {
        setEmailError(check.error || 'अमान्य ईमेल');
      } else {
        setEmailError('');
        if (check.isValid) verifyDuplicate(mobileNumber, val);
      }
    } else {
      setEmailError('');
    }
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {}
  };

  const resetForm = () => {
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setAddress('');
    setTelegramUsername('');
    setNameError('');
    setMobileError('');
    setEmailError('');
    setDuplicateMsg('');
    setRole('Verified Elite Member');
    setUsername('');
    setPhotoUrl(
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    );
    setGoogleDrivePhotoLink('');
    setTempPassword('');
    setConfirmTempPassword('');
    setPaymentMode('UPI');
    setPaymentUtr('');
    setPaymentScreenshotUrl('');
    setGoogleDrivePaymentLink('');
    setPayoutUpi('');
    setError('');
    setCreatedMember(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nameCheck = validateFullName(fullName);
    if (!nameCheck.isValid) {
      setError(nameCheck.error || 'कृपया नए सदस्य का सही पूरा नाम दर्ज करें।');
      return;
    }

    const mobCheck = validateMobileNumber(mobileNumber);
    if (!mobCheck.isValid) {
      setError(mobCheck.error || 'कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (email.trim()) {
      const emCheck = validateEmailAddress(email);
      if (!emCheck.isValid) {
        setError(emCheck.error || 'कृपया वैध ईमेल पता दर्ज करें।');
        return;
      }
    }

    if (duplicateMsg) {
      setError(duplicateMsg);
      return;
    }

    if (username.trim() && usernameStatus.available === false) {
      setError(usernameStatus.msg || 'यह यूजरनेम उपलब्ध नहीं है।');
      return;
    }

    if (!tempPassword.trim() || tempPassword.trim().length < 4) {
      setError('कृपया कम से कम 4 अक्षरों का अस्थायी पासवर्ड बनाएं।');
      return;
    }

    if (confirmTempPassword.trim() && tempPassword.trim() !== confirmTempPassword.trim()) {
      setError('दोनों पासवर्ड समान नहीं हैं। कृपया पासवर्ड कन्फर्म जांचें।');
      return;
    }

    setSubmitting(true);
    try {
      const newMember = await registerMemberBySponsorAsync({
        sponsorId: sponsorUser.userId,
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim() || undefined,
        username: username.trim().toLowerCase().replace(/^@/, '') || undefined,
        tempPassword: tempPassword.trim(),
        selectedPlanId,
        role,
        telegramUsername: telegramUsername.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
        googleDrivePhotoLink: googleDrivePhotoLink.trim() || undefined,
        payoutUpi: payoutUpi.trim() || undefined,
        address: address.trim() || undefined,
        paymentUtr: paymentUtr.trim() || undefined,
        paymentScreenshotUrl: paymentScreenshotUrl.trim() || undefined,
        googleDrivePaymentLink: googleDrivePaymentLink.trim() || undefined,
        paymentMode,
      });
      setCreatedMember(newMember);
      onSuccess?.(newMember);
    } catch (err: any) {
      setError(err?.message || 'नया सदस्य जोड़ने में त्रुटि आई।');
    } finally {
      setSubmitting(false);
    }
  };

  const buildSlipText = (m: UserProfile) => {
    const loginUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://ioisplatform.github.io';
    return [
      `🎉 *IOIS Official में आपका स्वागत है!*`,
      `👤 नाम: ${m.fullName}`,
      `🆔 User ID: ${m.userId}`,
      m.username ? `🔗 Username: @${m.username}` : '',
      `🔑 अस्थायी पासवर्ड (Temp Password): ${tempPassword}`,
      `🤝 स्पॉन्सर ID: ${sponsorUser.userId} (${sponsorUser.fullName})`,
      `📦 प्लान: ${selectedPlan.code} — ${selectedPlan.name} (₹${selectedPlan.price})`,
      `💳 आधिकारिक UPI पेमेंट पता: ${OFFICIAL_UPI_ID} (${OFFICIAL_PAYEE_NAME})`,
      ``,
      `⚠️ *सुरक्षा निर्देश:* पहली बार लॉगिन करते ही सिस्टम आपसे अपना नया गोपनीय पासवर्ड बदलने को कहेगा। अपना नया पासवर्ड किसी के भी साथ (स्पॉन्सर, Admin या हेल्पलाइन के साथ भी) साझा न करें।`,
      `🌐 लॉगिन लिंक: ${loginUrl}`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleCopySlip = () => {
    if (!createdMember) return;
    navigator.clipboard.writeText(buildSlipText(createdMember)).then(() => {
      setCopiedSlip(true);
      setTimeout(() => setCopiedSlip(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    if (!createdMember) return;
    const text = encodeURIComponent(buildSlipText(createdMember));
    const url = `https://wa.me/91${createdMember.mobileNumber}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const previewDigitalId = fullName.trim()
    ? `IOIS${selectedPlan.price}${
        fullName
          .trim()
          .split(/\s+/)
          .map((n) => n[0]?.toUpperCase())
          .join('')
          .slice(0, 2) || 'XX'
      }01`
    : `IOIS${selectedPlan.price}RK01`;

  return (
    <div
      className="fixed inset-0 z-[1050] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl overflow-hidden my-auto max-h-[94dvh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 px-4 py-3.5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-white truncate">
                अपने स्पॉन्सर के नीचे नया सदस्य जोड़ें (संपूर्ण पंजीकरण पोर्टल)
              </h2>
              <p className="text-[11px] text-cyan-100 truncate">
                स्पॉन्सर: {sponsorUser.fullName} ({sponsorUser.userId}) • आपका लॉगिन सुरक्षित रहेगा
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body (Matches CSS selector 2) */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-4 text-slate-200">
          {createdMember ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-950/60 border border-emerald-500/50 p-4 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  नया सदस्य सफलतापूर्वक आपके नीचे जुड़ गया!
                </h3>
                <p className="text-xs text-emerald-200">
                  आपका स्पॉन्सर सेशन लॉग-आउट नहीं हुआ है। नीचे दी गई स्लिप नए सदस्य को भेजें — पहले लॉगिन पर उन्हें अनिवार्य रूप से पासवर्ड बदलने का पॉपअप मिलेगा।
                </p>
              </div>

              <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">सदस्य का नाम:</span>
                  <span className="font-bold text-white">{createdMember.fullName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">नया User ID:</span>
                  <span className="font-black text-cyan-300 font-mono">{createdMember.userId}</span>
                </div>
                {createdMember.username && (
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Username:</span>
                    <span className="font-bold text-indigo-300 font-mono">@{createdMember.username}</span>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">अस्थायी पासवर्ड:</span>
                  <span className="font-black text-amber-300 font-mono">{tempPassword}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">स्पॉन्सर ID:</span>
                  <span className="font-bold text-emerald-300 font-mono">{sponsorUser.userId}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">प्लान:</span>
                  <span className="font-bold text-amber-300">
                    {selectedPlan.code} — ₹{selectedPlan.price}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopySlip}
                  className="py-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedSlip ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSlip ? 'स्लिप कॉपी हुई!' : 'लॉगिन स्लिप कॉपी करें'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp पर भेजें</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs cursor-pointer"
                >
                  + एक और सदस्य जोड़ें
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* div:nth-of-type(1) — Locked Sponsor Banner */}
              <div className="rounded-xl bg-indigo-950/60 border border-indigo-500/40 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    सत्यापित स्पॉन्सर ID (लॉक्ड):{' '}
                    <strong className="text-white font-mono">{sponsorUser.userId}</strong> ({sponsorUser.fullName})
                  </span>
                </div>
                <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>नया यूजर पहले लॉगिन पर पासवर्ड स्वयं बदलेगा</span>
                </span>
              </div>

              {/* div:nth-of-type(2) — Step 1 Personal Info: Full Name, Mobile, Email, City/State, Telegram */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 sm:p-4 space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <span>1. व्यक्तिगत व संपर्क विवरण (Personal Details)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-1">
                      <span>नए सदस्य का पूरा नाम *</span>
                      {fullName.trim().length >= 3 && !nameError && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> मान्य
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      placeholder="उदा. अमन कुमार"
                      className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-white text-xs sm:text-sm outline-none ${
                        nameError ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                      }`}
                    />
                    {nameError && <p className="text-[11px] text-rose-400 mt-1">{nameError}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-1">
                      <span>10-अंक मोबाइल / WhatsApp नंबर *</span>
                      {isCheckingDuplicate ? (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> जांच...
                        </span>
                      ) : mobileNumber.length === 10 && !mobileError ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> मान्य
                        </span>
                      ) : null}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      placeholder="9876543210"
                      className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-white text-xs sm:text-sm font-mono outline-none ${
                        mobileError ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                      }`}
                    />
                    {mobileError && <p className="text-[11px] text-rose-400 mt-1">{mobileError}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">ईमेल पता (Email ID)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="member@gmail.com (वैकल्पिक)"
                      className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-white text-xs sm:text-sm outline-none ${
                        emailError ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                      }`}
                    />
                    {emailError && <p className="text-[11px] text-rose-400 mt-1">{emailError}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">शहर व राज्य (City & State)</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="जैसे: पटना, बिहार"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-sky-400" />
                        <span>Telegram Username या Link</span>
                      </span>
                      <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                        ऐच्छिक (Optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="उदा: @username या t.me/username"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-400 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>

                {duplicateMsg && (
                  <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{duplicateMsg}</span>
                  </div>
                )}
              </div>

              {/* div:nth-of-type(3) — Plan 3D Selector + Role + Custom Username */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 sm:p-4 space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <span>2. 7 मास्टर प्लांस, सदस्यता पद व @Username</span>
                </h3>

                <Plan3DSelector
                  selectedPlanId={selectedPlanId}
                  onSelectPlan={(id) => setSelectedPlanId(id)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      सदस्यता पद (Role / Designation):
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white text-xs sm:text-sm outline-none cursor-pointer"
                    >
                      <option value="Verified Elite Member">Verified Elite Member</option>
                      <option value="Active Digital Learner">Active Digital Learner</option>
                      <option value="Official Youth Reseller">Official Youth Reseller</option>
                      <option value="Supreme Master Partner">Supreme Master Partner</option>
                      <option value="Student Ambassador">Student Ambassador</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>कस्टम यूजरनेम (@username)</span>
                      </span>
                      <span className="text-[10px] text-amber-400">ऐच्छिक</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                        }
                        placeholder="aman_01"
                        className="w-full pl-7 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs sm:text-sm font-mono outline-none lowercase"
                      />
                      {usernameStatus.checking && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {usernameStatus.msg && (
                      <p
                        className={`text-[11px] mt-1 font-semibold ${
                          usernameStatus.available ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {usernameStatus.msg}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* div:nth-of-type(4) — Profile Photo & Drive Link (SmartFileUpload) */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 sm:p-4">
                <SmartFileUpload
                  label="प्रोफाइल फोटो (डिजिटल ID कार्ड हेतु)"
                  sublabel="फ़ोटो चुनें या Google Drive लिंक दर्ज करें"
                  fileValue={photoUrl}
                  driveLinkValue={googleDrivePhotoLink}
                  onFileChange={setPhotoUrl}
                  onDriveLinkChange={setGoogleDrivePhotoLink}
                />
              </div>

              {/* div:nth-of-type(5) — Temporary Password + Confirm Password */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 sm:p-4 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1 mb-1">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>शुरुआती अस्थायी पासवर्ड बनाएं *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      placeholder="कम से कम 4 अक्षर (उदा. 123456)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      अस्थायी पासवर्ड कन्फर्म करें *
                    </label>
                    <input
                      type="text"
                      required
                      value={confirmTempPassword}
                      onChange={(e) => setConfirmTempPassword(e.target.value)}
                      placeholder="वही पासवर्ड दोबारा लिखें"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-amber-300/90">
                  🔐 सुरक्षा गारंटी: नए सदस्य के पहली बार लॉगिन करते ही नया गोपनीय पासवर्ड सेट करने का पॉपअप आएगा — ताकि स्पॉन्सर भी उनका पासवर्ड जानकर लॉगिन न कर पाए।
                </p>
              </div>

              {/* div:nth-of-type(6) — OFFICIAL IOIS PAYMENT ADDRESS + QR GATEWAY + UTR/SCREENSHOT/PAYOUT UPI (CSS selectors 1, 3, 4) */}
              <div className="rounded-2xl bg-slate-950 border-2 border-amber-500/50 p-3.5 sm:p-4 space-y-3.5 shadow-[0_0_25px_rgba(245,158,11,0.12)]">
                {/* p:nth-of-type(1) — CSS selector 1 */}
                <p className="text-xs sm:text-sm font-black text-amber-300 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span>
                    💳 IOIS आधिकारिक पेमेंट पता (Official Payment Address) — ₹{selectedPlan.price}
                  </span>
                  <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/40 text-[11px]">
                    {OFFICIAL_UPI_ID} • {OFFICIAL_PAYEE_NAME}
                  </span>
                </p>

                {/* div:nth-of-type(1) — UTR Input FIRST child (matches CSS selector 3) + Payout UPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={paymentUtr}
                    onChange={(e) => setPaymentUtr(e.target.value)}
                    placeholder="12-अंकों का UTR / Transaction Ref No."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white text-xs sm:text-sm font-mono outline-none"
                  />
                  <input
                    type="text"
                    value={payoutUpi}
                    onChange={(e) => setPayoutUpi(e.target.value)}
                    placeholder="नए सदस्य का पेआउट UPI ID (जैसे: 9876543210@paytm)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 focus:border-amber-400 text-amber-300 font-mono font-bold text-xs sm:text-sm outline-none"
                  />
                </div>

                {/* Official QR Code + Verified Payee Name + Copy Official UPI ID + Pay via UPI App */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">चुना हुआ प्लान:</span>
                      <span className="font-black text-white">
                        {selectedPlan.code} ({selectedPlan.name})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">देय शुल्क:</span>
                      <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                        ₹{selectedPlan.price}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Official Dynamic UPI QR Code (Local Offline-Reliable Generator) */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl text-center shadow-inner border-2 border-amber-300/60">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt={`IOIS Official UPI QR Code - ${OFFICIAL_PAYEE_NAME} (₹${selectedPlan.price})`}
                          className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded"
                        />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center text-slate-600 text-xs font-bold">
                          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                        </div>
                      )}
                      <span className="text-[10px] font-black text-slate-900 mt-1">
                        स्कैन करें: ₹{selectedPlan.price} • {OFFICIAL_PAYEE_NAME}
                      </span>
                      <span className="text-[8px] font-extrabold text-slate-600">
                        GPAY • PHONEPE • PAYTM • BHIM
                      </span>
                      {qrDataUrl && (
                        <a
                          href={qrDataUrl}
                          download={`IOIS-Official-QR-Plan-${selectedPlan.price}.png`}
                          className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-300 text-[9px] font-bold transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>QR सेव करें</span>
                        </a>
                      )}
                    </div>

                    {/* Payee Name, Official UPI ID Copy & Deep Link */}
                    <div className="sm:col-span-8 space-y-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block">आधिकारिक प्राप्तकर्ता (Official Payee):</span>
                        <div className="text-sm font-black text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{OFFICIAL_PAYEE_NAME} (IOIS Official)</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">
                          आधिकारिक पेमेंट UPI पता (Official UPI ID):
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-950 border border-amber-500/40 rounded-lg px-2.5 py-2 font-mono text-xs font-black text-amber-300 truncate">
                            {OFFICIAL_UPI_ID}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3 py-2 rounded-lg transition flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                          >
                            {copiedUpi ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                                <span>कॉपी हुआ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>कॉपी</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <a
                          href={`upi://pay?pa=${encodeURIComponent(
                            OFFICIAL_UPI_ID
                          )}&pn=Vikas%20Kumar&am=${selectedPlan.price}&cu=INR`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black transition shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>सीधे UPI ऐप से ₹{selectedPlan.price} भुगतान करें</span>
                        </a>

                        <div className="flex items-center gap-1">
                          {(['UPI', 'QR', 'Bank'] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setPaymentMode(m)}
                              className={`px-2 py-1 rounded text-[10px] font-bold border cursor-pointer transition ${
                                paymentMode === m
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                  : 'bg-slate-950 border-slate-700 text-slate-400'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshot Upload + Google Drive Payment Screenshot Link */}
                <SmartFileUpload
                  label="पेमेंट स्क्रीनशॉट अपलोड करें (Screenshot Proof)"
                  sublabel="सफल ट्रांजेक्शन का स्क्रीनशॉट चुनें या Google Drive लिंक दें"
                  fileValue={paymentScreenshotUrl}
                  driveLinkValue={googleDrivePaymentLink}
                  onFileChange={setPaymentScreenshotUrl}
                  onDriveLinkChange={setGoogleDrivePaymentLink}
                />
              </div>

              {/* Live Summary Preview (Same as RegistrationPortal) */}
              <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-black text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>रजिस्ट्रेशन समरी (Live Summary)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">हेल्पलाइन: {OFFICIAL_PHONE}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">आवेदक:</span>
                    <span className="font-bold text-white truncate block">{fullName.trim() || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">मोबाइल:</span>
                    <span className="font-mono text-white">{mobileNumber.trim() || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">प्लान:</span>
                    <span className="font-bold text-amber-400">
                      {selectedPlan.code} (₹{selectedPlan.price})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">अनुमानित डिजिटल ID:</span>
                    <span className="font-mono font-bold text-emerald-400">{previewDigitalId}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs font-bold text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-amber-400 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition cursor-pointer disabled:opacity-60"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>
                  {submitting
                    ? 'सदस्य जोड़ा जा रहा है...'
                    : 'रजिस्ट्रेशन पूर्ण करें व स्पॉन्सर से जोड़ें (Get Digital ID)'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
