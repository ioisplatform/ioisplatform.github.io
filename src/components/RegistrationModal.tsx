import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { PLANS, OFFICIAL_PHONE, OFFICIAL_UPI_ID, OFFICIAL_PAYEE_NAME } from '../data/plansData';
import { 
  registerNewUserAsync, 
  checkUserAlreadyExists,
  validateFullName,
  validateMobileNumber,
  validateEmailAddress,
  validateSponsorIdAsync,
  OFFICIAL_ROOT_SPONSOR_ID,
  OFFICIAL_ROOT_SPONSOR_NAME
} from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { Plan3DSelector } from './Plan3DSelector';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  KeyRound,
  Shield,
  ShieldAlert,
  Loader2,
  Sparkles,
  CreditCard,
  User,
  LogIn,
  Send,
  XCircle,
  UserCheck
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (user: UserProfile) => void;
  onOpenLogin: (
    mode?: 'login' | 'forgot_user_id' | 'forgot_password',
    prefill?: { identifier?: string; mobile?: string; userId?: string }
  ) => void;
  initialPlanId?: number;
  initialSponsorId?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onOpenLogin,
  initialPlanId = 1,
  initialSponsorId = '',
}) => {
  // Step State: 1 = Personal, 2 = Plan & Password, 3 = Payment & Verification, 4 = Success
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [telegramUsername, setTelegramUsername] = useState<string>('');
  const [sponsorId, setSponsorId] = useState<string>(initialSponsorId || OFFICIAL_ROOT_SPONSOR_ID);

  // Live Field Validation States
  const [nameError, setNameError] = useState<string>('');
  const [mobileError, setMobileError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  // Sponsor Verification State
  const [sponsorStatus, setSponsorStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [sponsorVerifiedName, setSponsorVerifiedName] = useState<string>('');
  const [sponsorError, setSponsorError] = useState<string>('');
  const sponsorTimerRef = useRef<any>(null);

  const [selectedPlanId, setSelectedPlanId] = useState<number>(initialPlanId);
  const [role, setRole] = useState<string>('Verified Elite Member');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
  const [googleDrivePhotoLink, setGoogleDrivePhotoLink] = useState<string>('');

  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string>('');
  const [googleDrivePaymentLink, setGoogleDrivePaymentLink] = useState<string>('');
  const [paymentUtr, setPaymentUtr] = useState<string>('');
  const [payoutUpi, setPayoutUpi] = useState<string>('');

  // UI state
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdUser, setCreatedUser] = useState<UserProfile | null>(null);

  // Duplicate Check
  const [duplicateNotice, setDuplicateNotice] = useState<{
    exists: boolean;
    matchedBy: 'mobile' | 'email' | 'both';
    maskedMobile?: string;
    maskedEmail?: string;
  } | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState<boolean>(false);

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  useEffect(() => {
    let initialSponsor = initialSponsorId;
    if (!initialSponsor) {
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref') || params.get('sponsor') || params.get('sponsorId');
        if (ref) initialSponsor = ref.toUpperCase();
      } catch {
        // ignore
      }
    }
    const targetSponsor = (initialSponsor || OFFICIAL_ROOT_SPONSOR_ID).trim().toUpperCase();
    setSponsorId(targetSponsor);
    checkSponsor(targetSponsor);
  }, [initialSponsorId]);

  const checkSponsor = async (idToVerify: string) => {
    const clean = idToVerify.trim().toUpperCase();
    if (!clean) {
      setSponsorStatus('invalid');
      setSponsorVerifiedName('');
      setSponsorError('स्पॉन्सर ID दर्ज करना अनिवार्य है।');
      return;
    }

    setSponsorStatus('checking');
    setSponsorError('');

    try {
      const res = await validateSponsorIdAsync(clean);
      if (res.isValid) {
        setSponsorStatus('valid');
        setSponsorVerifiedName(res.sponsorName || 'सत्यापित स्पॉन्सर');
        setSponsorError('');
      } else {
        setSponsorStatus('invalid');
        setSponsorVerifiedName('');
        setSponsorError(res.error || 'अमान्य स्पॉन्सर ID! यह स्पॉन्सर सिस्टम में मौजूद नहीं है।');
      }
    } catch {
      setSponsorStatus('invalid');
      setSponsorVerifiedName('');
      setSponsorError('स्पॉन्सर सत्यापन में त्रुटि आई।');
    }
  };

  const handleSponsorChange = (val: string) => {
    const upper = val.toUpperCase().trim();
    setSponsorId(upper);
    setSponsorError('');

    if (sponsorTimerRef.current) clearTimeout(sponsorTimerRef.current);
    if (!upper) {
      setSponsorStatus('idle');
      setSponsorVerifiedName('');
      return;
    }

    setSponsorStatus('checking');
    sponsorTimerRef.current = setTimeout(() => {
      checkSponsor(upper);
    }, 400);
  };

  const handleFillDefaultSponsor = () => {
    setSponsorId(OFFICIAL_ROOT_SPONSOR_ID);
    checkSponsor(OFFICIAL_ROOT_SPONSOR_ID);
  };

  const handleMobileChange = (val: string) => {
    setMobileNumber(val);
    const cleanDigits = val.replace(/\D/g, '');
    if (cleanDigits.length >= 10) {
      const check = validateMobileNumber(val);
      if (!check.isValid) {
        setMobileError(check.error || 'अमान्य मोबाइल नंबर');
      } else {
        setMobileError('');
        verifyUniqueness(val, email);
      }
    } else if (cleanDigits.length > 0 && cleanDigits.length < 10) {
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
        if (check.isValid) {
          verifyUniqueness(mobileNumber, val);
        }
      }
    } else {
      setEmailError('');
    }
  };

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    if (val.trim().length >= 3) {
      const check = validateFullName(val);
      if (!check.isValid) {
        setNameError(check.error || 'अमान्य नाम');
      } else {
        setNameError('');
      }
    } else if (val.trim().length > 0) {
      setNameError('नाम कम से कम 3 अक्षरों का होना चाहिए');
    } else {
      setNameError('');
    }
  };

  const verifyUniqueness = async (mob: string, em: string) => {
    const cleanDigits = mob.replace(/\D/g, '');
    const cleanEmail = em.trim();
    if (cleanDigits.length < 10 && cleanEmail.length < 5) {
      setDuplicateNotice(null);
      return;
    }

    try {
      setIsCheckingDuplicate(true);
      const result = await checkUserAlreadyExists(mob, em);
      setIsCheckingDuplicate(false);
      if (result.exists) {
        setDuplicateNotice({
          exists: true,
          matchedBy: result.matchedBy || 'mobile',
          maskedMobile: result.maskedMobile,
          maskedEmail: result.maskedEmail,
        });
      } else {
        setDuplicateNotice(null);
      }
    } catch {
      setIsCheckingDuplicate(false);
    }
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Step Validation: Strict validation
  const validateStep1 = async (): Promise<boolean> => {
    setErrorMsg('');

    // 1. Full name validation
    const nameCheck = validateFullName(fullName);
    if (!nameCheck.isValid) {
      setNameError(nameCheck.error || 'अमान्य नाम');
      setErrorMsg(nameCheck.error || 'कृपया अपना वास्तविक पूरा नाम दर्ज करें।');
      return false;
    }
    setNameError('');

    // 2. Mobile validation
    const mobCheck = validateMobileNumber(mobileNumber);
    if (!mobCheck.isValid) {
      setMobileError(mobCheck.error || 'अमान्य मोबाइल नंबर');
      setErrorMsg(mobCheck.error || 'कृपया 10-अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू होने वाला)। फर्जी या रैंडम नंबर स्वीकार्य नहीं हैं।');
      return false;
    }
    setMobileError('');

    // 3. Email validation (if entered)
    if (email.trim()) {
      const emCheck = validateEmailAddress(email);
      if (!emCheck.isValid) {
        setEmailError(emCheck.error || 'अमान्य ईमेल');
        setErrorMsg(emCheck.error || 'कृपया एक वैध ईमेल आईडी दर्ज करें।');
        return false;
      }
    }
    setEmailError('');

    // 4. Strict Sponsor ID validation (NO RANDOM SPONSOR ID)
    if (!sponsorId.trim()) {
      setSponsorStatus('invalid');
      setSponsorError('स्पॉन्सर ID दर्ज करना अनिवार्य है।');
      setErrorMsg('स्पॉन्सर ID दर्ज करना अनिवार्य है। आप डिफ़ॉल्ट "IOIS999VK01" का उपयोग कर सकते हैं।');
      return false;
    }

    const sponsorCheck = await validateSponsorIdAsync(sponsorId);
    if (!sponsorCheck.isValid) {
      setSponsorStatus('invalid');
      setSponsorError(sponsorCheck.error || 'अमान्य स्पॉन्सर ID! यह स्पॉन्सर सिस्टम में मौजूद नहीं है।');
      setErrorMsg(sponsorCheck.error || 'अमान्य स्पॉन्सर ID! कोई भी रैंडम स्पॉन्सर ID काम नहीं करेगा। कृपया सही स्पॉन्सर ID दर्ज करें या डिफ़ॉल्ट "IOIS999VK01" का उपयोग करें।');
      return false;
    }
    setSponsorStatus('valid');
    setSponsorVerifiedName(sponsorCheck.sponsorName || 'सत्यापित स्पॉन्सर');

    // 5. Duplicate Check
    const dupCheck = await checkUserAlreadyExists(mobCheck.cleanDigits, email);
    if (dupCheck.exists) {
      setDuplicateNotice({
        exists: true,
        matchedBy: dupCheck.matchedBy || 'mobile',
        maskedMobile: dupCheck.maskedMobile,
        maskedEmail: dupCheck.maskedEmail,
      });
      return false;
    }

    return true;
  };

  const validateStep2 = (): boolean => {
    setErrorMsg('');
    if (!password.trim()) {
      setErrorMsg('कृपया पासवर्ड दर्ज करें (कम से कम 4 अक्षर)।');
      return false;
    }
    if (password.length < 4) {
      setErrorMsg('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMsg('दोनों पासवर्ड समान नहीं हैं। कृपया पुनः जांचें।');
      return false;
    }
    return true;
  };

  const goToNextStep = async () => {
    if (currentStep === 1) {
      const ok = await validateStep1();
      if (ok) setCurrentStep(2);
    } else if (currentStep === 2) {
      const ok = validateStep2();
      if (ok) setCurrentStep(3);
    }
  };

  const goToPrevStep = () => {
    setErrorMsg('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const step1Ok = await validateStep1();
    if (!step1Ok) {
      setCurrentStep(1);
      return;
    }

    const step2Ok = validateStep2();
    if (!step2Ok) {
      setCurrentStep(2);
      return;
    }

    if (!payoutUpi.trim()) {
      setErrorMsg('कृपया अपनी कमाई पाने का UPI ID दर्ज करें।');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const newUser = await registerNewUserAsync({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        selectedPlanId: selectedPlanId,
        password: password.trim(),
        role: role,
        address: address.trim(),
        telegramUsername: telegramUsername.trim() || undefined,
        payoutUpi: payoutUpi.trim(),
        sponsorId: sponsorId.trim().toUpperCase() || 'IOIS999VK01',
        paymentUtr: paymentUtr.trim(),
        paymentMode: 'UPI',
        photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        googleDrivePhotoLink: googleDrivePhotoLink.trim() || undefined,
        paymentScreenshotUrl: paymentScreenshotUrl.trim() || undefined,
        googleDrivePaymentLink: googleDrivePaymentLink.trim() || undefined,
        registrationFormData: {
          fullName: fullName.trim(),
          mobileNumber: mobileNumber.trim(),
          email: email.trim(),
          telegramUsername: telegramUsername.trim() || undefined,
          selectedPlanId: selectedPlanId,
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
          address: address.trim(),
          sponsorId: sponsorId.trim().toUpperCase() || 'IOIS999VK01',
          payoutUpi: payoutUpi.trim(),
          paymentUtr: paymentUtr.trim(),
          paymentMode: 'UPI',
          paymentScreenshotUrl: paymentScreenshotUrl.trim() || undefined,
          submittedAt: new Date().toISOString(),
        },
      });

      setIsSubmitting(false);
      setCreatedUser(newUser);
      setCurrentStep(4); // Success view
    } catch (err: any) {
      setIsSubmitting(false);
      if (err.alreadyExists) {
        setDuplicateNotice({
          exists: true,
          matchedBy: err.matchedBy || 'mobile',
          maskedMobile: err.maskedMobile,
          maskedEmail: err.maskedEmail,
        });
      }
      setErrorMsg(err.message || 'पंजीकरण के दौरान कोई त्रुटि आई।');
    }
  };

  if (!isOpen) return null;
  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(245,158,11,0.25)] relative text-white my-6 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition z-10"
          title="बंद करें"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>IOIS OFFICIAL REGISTRATION WINDOW</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {currentStep === 4 ? 'पंजीकरण सफल! 🎉' : 'सदस्य पंजीकरण (Member Registration)'}
          </h3>
          <p className="text-xs text-slate-300">
            {currentStep === 1 && 'चरण 1/3: व्यक्तिगत विवरण व स्पॉन्सर आईडी'}
            {currentStep === 2 && 'चरण 2/3: प्लान चयन व पासवर्ड निर्माण'}
            {currentStep === 3 && 'चरण 3/3: पेमेंट व डिजिटल ID एक्टिवेशन'}
            {currentStep === 4 && 'आपका डिजिटल ID कार्ड और सदस्य डैशबोर्ड तैयार है'}
          </p>
        </div>

        {/* Step Indicator Tabs (Only show during steps 1..3) */}
        {currentStep < 4 && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep === 1
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : currentStep > 1
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-slate-950/20 font-black">
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className="truncate">1. विवरण</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                const ok = await validateStep1();
                if (ok) setCurrentStep(2);
              }}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep === 2
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : currentStep > 2
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-slate-950/20 font-black">
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span className="truncate">2. प्लान</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                const ok1 = await validateStep1();
                if (ok1 && validateStep2()) setCurrentStep(3);
              }}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep === 3
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-slate-950/20 font-black">
                3
              </span>
              <span className="truncate">3. पेमेंट</span>
            </button>
          </div>
        )}

        {/* Duplicate Notice Banner */}
        {duplicateNotice && (
          <div className="mb-4 p-4 bg-gradient-to-br from-amber-950/90 via-slate-950 to-red-950/90 border-2 border-amber-400 rounded-2xl text-white space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 text-xs">
                <h4 className="text-sm font-black text-amber-300">
                  यह मोबाइल / ईमेल पहले से पंजीकृत है
                </h4>
                <p className="text-slate-200 mt-0.5">
                  दर्ज किया गया खाता पहले से सक्रिय है। आप सीधे लॉगिन कर सकते हैं।
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin('login');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>सीधे लॉगिन करें</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin('forgot_password');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-amber-400/60 text-amber-300 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>पासवर्ड रीसेट करें</span>
              </button>
            </div>
          </div>
        )}

        {/* Validation Error Message */}
        {errorMsg && !duplicateNotice && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: SUCCESS CONFIRMATION WINDOW */}
        {/* ========================================================= */}
        {currentStep === 4 && createdUser && (
          <div className="text-center space-y-4 py-2 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-white">
                हार्दिक बधाई, <span className="gold-text">{createdUser.fullName}</span> जी!
              </h4>
              <p className="text-xs text-slate-300">
                आपकी सदस्यता सफलतापूर्वक पंजीकृत हो चुकी है। आपकी आधिकारिक डिजिटल User ID:
              </p>
            </div>

            {/* Generated ID Badge */}
            <div className="p-4 bg-slate-950 rounded-2xl border-2 border-amber-400/80 max-w-sm mx-auto space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                आधिकारिक डिजिटल यूजर आईडी:
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400 tracking-wider">
                {createdUser.userId}
              </div>
              <span className="text-[10px] text-slate-400 block">
                प्लान: {selectedPlan.code} (₹{selectedPlan.price}) • {selectedPlan.percentage}% इंसेंटिव सक्रिय
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRegisterSuccess(createdUser);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>डैशबोर्ड खोलें →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRegisterSuccess(createdUser);
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>डिजिटल ID कार्ड देखें</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEPS 1..3: REGISTRATION FORM */}
        {/* ========================================================= */}
        {currentStep < 4 && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* ---------------- SECTION 1: PERSONAL DETAILS ---------------- */}
            {currentStep === 1 && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                      <span>पूरा नाम (Full Name) <span className="text-red-400">*</span>:</span>
                      {fullName.trim().length >= 3 && !nameError && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> मान्य नाम
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      onBlur={() => handleFullNameChange(fullName)}
                      placeholder="जैसे: Rahul Kumar"
                      className={`w-full bg-slate-950 border text-white rounded-xl px-3 py-2.5 outline-none transition ${
                        nameError ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
                      }`}
                    />
                    {nameError && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{nameError}</span>
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                      <span>मोबाइल / WhatsApp <span className="text-red-400">*</span>:</span>
                      {isCheckingDuplicate ? (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> जांच...
                        </span>
                      ) : mobileNumber.replace(/\D/g, '').length === 10 && !mobileError ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> मान्य 10-अंक
                        </span>
                      ) : null}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      onBlur={() => handleMobileChange(mobileNumber)}
                      placeholder="10 अंकों का मोबाइल (उदा: 9876543210)"
                      className={`w-full bg-slate-950 border text-white rounded-xl px-3 py-2.5 outline-none transition font-mono ${
                        mobileError ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
                      }`}
                    />
                    {mobileError && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{mobileError}</span>
                      </p>
                    )}
                  </div>

                  {/* Sponsor ID with Live Real Verification */}
                  <div className="sm:col-span-2 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-slate-200 font-bold flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>स्पॉन्सर ID (Sponsor ID) <span className="text-red-400">*</span>:</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleFillDefaultSponsor}
                        className="text-[10px] text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>आधिकारिक ID भरें (IOIS999VK01)</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={sponsorId}
                        onChange={(e) => handleSponsorChange(e.target.value)}
                        onBlur={() => checkSponsor(sponsorId)}
                        placeholder="जैसे: IOIS999VK01"
                        className={`w-full bg-slate-900 border text-amber-300 font-mono font-bold rounded-xl px-3 py-2.5 outline-none transition uppercase tracking-wider ${
                          sponsorStatus === 'valid'
                            ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                            : sponsorStatus === 'invalid'
                            ? 'border-red-500 bg-red-950/20 text-red-300'
                            : 'border-amber-500/60 focus:border-amber-400'
                        }`}
                      />

                      <div className="absolute right-3 top-2.5 flex items-center">
                        {sponsorStatus === 'checking' && (
                          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                        )}
                        {sponsorStatus === 'valid' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                        {sponsorStatus === 'invalid' && (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>

                    {sponsorStatus === 'valid' && (
                      <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-between text-emerald-300 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold">सत्यापित स्पॉन्सर: </span>
                            <span className="text-white font-black">{sponsorVerifiedName}</span>
                            <span className="text-emerald-400 ml-1 font-mono">({sponsorId})</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          ✓ मान्य
                        </span>
                      </div>
                    )}

                    {sponsorStatus === 'invalid' && (
                      <div className="p-2 bg-red-950/70 border border-red-500/60 rounded-xl text-red-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-red-300">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{sponsorError || 'अमान्य स्पॉन्सर ID! यह स्पॉन्सर सिस्टम में मौजूद नहीं है।'}</span>
                        </div>
                        <p className="text-[10px] text-red-300/80 pl-5">
                          ⚠️ सुरक्षा नीति: कोई भी रैंडम स्पॉन्सर ID स्वीकार्य नहीं है। यदि आपके पास स्पॉन्सर नहीं है तो <b>IOIS999VK01</b> भरें।
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                      <span>ईमेल पता (Email ID):</span>
                      {email && !emailError && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> मान्य
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => handleEmailChange(email)}
                      placeholder="name@example.com (उदा. rahul@gmail.com)"
                      className={`w-full bg-slate-950 border text-white rounded-xl px-3 py-2.5 outline-none transition ${
                        emailError ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
                      }`}
                    />
                    {emailError && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{emailError}</span>
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      शहर व राज्य (City & State):
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="जैसे: पटना, बिहार"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2.5 outline-none transition"
                    />
                  </div>

                  {/* Telegram Username or Link (Optional / Not Required) */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-sky-400" />
                        <span>Telegram Username या Link:</span>
                      </span>
                      <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                        ऐच्छिक (NOT REQUIRED)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="उदा: @username या t.me/username"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 text-white rounded-xl px-3 py-2.5 outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLogin('login');
                    }}
                    className="text-slate-400 hover:text-amber-300 text-xs underline cursor-pointer"
                  >
                    पहले से पंजीकृत हैं? लॉगिन करें
                  </button>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <span>अगला: प्लान व पासवर्ड</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- SECTION 2: PLAN & PASSWORD ---------------- */}
            {currentStep === 2 && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 3D Plan Selector with 3D Text & Logo */}
                  <div className="sm:col-span-2">
                    <Plan3DSelector 
                      selectedPlanId={selectedPlanId} 
                      onSelectPlan={(id) => setSelectedPlanId(id)} 
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      पासवर्ड बनाएं <span className="text-red-400">*</span>:
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="कम से कम 4 अक्षर"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2.5 outline-none transition"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      पासवर्ड कन्फर्म करें <span className="text-red-400">*</span>:
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="वही पासवर्ड दोबारा दर्ज करें"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2.5 outline-none transition"
                    />
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="pt-1">
                  <SmartFileUpload
                    label="प्रोफाइल फोटो (ID कार्ड हेतु)"
                    sublabel="फ़ोटो चुनें या Google Drive लिंक दर्ज करें"
                    fileValue={photoUrl}
                    driveLinkValue={googleDrivePhotoLink}
                    onFileChange={setPhotoUrl}
                    onDriveLinkChange={setGoogleDrivePhotoLink}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>पीछे</span>
                  </button>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <span>अगला: पेमेंट व एक्टिवेशन</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- SECTION 3: PAYMENT & ACTIVATION ---------------- */}
            {currentStep === 3 && (
              <div className="space-y-3.5">
                {/* Official UPI Details Box */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">चुना हुआ प्लान:</span>
                      <div className="text-xs font-black text-white">{selectedPlan.code} ({selectedPlan.name})</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">देय राशि:</span>
                      <div className="text-base font-black text-amber-300 font-mono">₹{selectedPlan.price}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* QR Code */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-white rounded-xl text-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi%3A%2F%2Fpay%3Fpa%3D${OFFICIAL_UPI_ID}%26pn%3DVikas%2520Kumar%26am%3D${selectedPlan.price}%26cu%3DINR`} 
                        alt="UPI QR Code - Vikas Kumar" 
                        className="w-24 h-24 object-contain"
                      />
                      <span className="text-[8px] font-black text-slate-900 mt-1">
                        GPAY • PHONEPE • PAYTM
                      </span>
                    </div>

                    {/* Payee Info & Copy Button */}
                    <div className="sm:col-span-8 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">आधिकारिक प्राप्तकर्ता:</span>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{OFFICIAL_PAYEE_NAME}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">आधिकारिक UPI ID:</span>
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-amber-300 truncate">
                            {OFFICIAL_UPI_ID}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            {copiedUpi ? (
                              <>
                                <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                                <span>कॉपी!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>कॉपी</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <a
                        href={`upi://pay?pa=${OFFICIAL_UPI_ID}&pn=Vikas%20Kumar&am=${selectedPlan.price}&cu=INR`}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[11px] font-bold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>सीधे UPI ऐप से भुगतान करें</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Screenshot Upload */}
                <SmartFileUpload
                  label="पेमेंट स्क्रीनशॉट अपलोड करें"
                  sublabel="सफल ट्रांजेक्शन का स्क्रीनशॉट या ड्राइव लिंक दें"
                  fileValue={paymentScreenshotUrl}
                  driveLinkValue={googleDrivePaymentLink}
                  onFileChange={setPaymentScreenshotUrl}
                  onDriveLinkChange={setGoogleDrivePaymentLink}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* UTR */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      UTR / Ref नंबर (वैकल्पिक):
                    </label>
                    <input
                      type="text"
                      value={paymentUtr}
                      onChange={(e) => setPaymentUtr(e.target.value)}
                      placeholder="उदा. 4239XXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none transition font-mono"
                    />
                  </div>

                  {/* Payout UPI ID */}
                  <div>
                    <label className="block text-amber-300 font-bold mb-1">
                      पेआउट पाने का UPI ID <span className="text-red-400">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      value={payoutUpi}
                      onChange={(e) => setPayoutUpi(e.target.value.replace(/\s+/g, '').slice(0, 50))}
                      placeholder="उदा. 9876543210@paytm"
                      className="w-full bg-slate-950 border border-amber-500/60 focus:border-amber-400 text-amber-300 font-mono font-bold rounded-xl px-3 py-2 outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>पीछे</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 hover:from-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>रजिस्ट्रेशन हो रहा है...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        <span>रजिस्ट्रेशन पूर्ण करें ✔</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
