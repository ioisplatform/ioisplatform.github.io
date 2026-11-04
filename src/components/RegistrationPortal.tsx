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
  getSponsorUserAsync,
  checkUsernameAvailableAsync,
  OFFICIAL_ROOT_SPONSOR_ID,
  OFFICIAL_ROOT_SPONSOR_NAME,
  OFFICIAL_ROOT_SPONSOR_USER
} from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { IDCardGenerator } from './IDCardGenerator';
import { Plan3DSelector } from './Plan3DSelector';
import { 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  User,
  CreditCard,
  Copy,
  Check,
  ExternalLink,
  KeyRound,
  Shield,
  ShieldAlert,
  Loader2,
  Sparkles,
  HelpCircle,
  Send,
  XCircle,
  UserCheck,
  Eye,
  X
} from 'lucide-react';

interface RegistrationPortalProps {
  onRegisterSuccess: (user: UserProfile) => void;
  onOpenLogin: (
    mode?: 'login' | 'forgot_user_id' | 'forgot_password',
    prefill?: { identifier?: string; mobile?: string; userId?: string }
  ) => void;
  preSelectedPlanId?: number;
  initialSponsorId?: string;
}

export const RegistrationPortal: React.FC<RegistrationPortalProps> = ({
  onRegisterSuccess,
  onOpenLogin,
  preSelectedPlanId = 1,
  initialSponsorId = '',
}) => {
  // Step State: 1 = Personal Details, 2 = Plan & Security, 3 = Payment & Verification
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
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
  const [isViewingSponsorModal, setIsViewingSponsorModal] = useState<boolean>(false);
  const [sponsorCardUser, setSponsorCardUser] = useState<UserProfile | null>(null);
  const [isLoadingSponsorCard, setIsLoadingSponsorCard] = useState<boolean>(false);
  const sponsorTimerRef = useRef<any>(null);

  const handleOpenSponsorCard = async () => {
    if (!sponsorId.trim()) return;
    setIsLoadingSponsorCard(true);
    try {
      const realSponsor = await getSponsorUserAsync(sponsorId.trim());
      setSponsorCardUser(realSponsor || OFFICIAL_ROOT_SPONSOR_USER);
      setIsViewingSponsorModal(true);
    } catch {
      setSponsorCardUser(OFFICIAL_ROOT_SPONSOR_USER);
      setIsViewingSponsorModal(true);
    } finally {
      setIsLoadingSponsorCard(false);
    }
  };

  const [selectedPlanId, setSelectedPlanId] = useState<number>(preSelectedPlanId);
  const [role, setRole] = useState<string>('Verified Elite Member');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [customUsername, setCustomUsername] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = localStorage.getItem('iois_prefill_custom_username');
      if (p) {
        localStorage.removeItem('iois_prefill_custom_username');
        return p;
      }
    }
    return '';
  });
  const [usernameError, setUsernameError] = useState<string>('');
  const [usernameSuccess, setUsernameSuccess] = useState<string>('');
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const usernameTimerRef = useRef<any>(null);

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setCustomUsername(clean);
    setUsernameError('');
    setUsernameSuccess('');

    if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
    if (!clean) return;

    if (clean.length < 3) {
      setUsernameError('यूजरनेम कम से कम 3 अक्षरों का होना चाहिए');
      return;
    }

    setIsCheckingUsername(true);
    usernameTimerRef.current = setTimeout(async () => {
      const res = await checkUsernameAvailableAsync(clean);
      setIsCheckingUsername(false);
      if (res.available) {
        setUsernameSuccess(res.message || `✓ @${clean} उपलब्ध है!`);
      } else {
        setUsernameError(res.error || `❌ @${clean} उपलब्ध नहीं है।`);
      }
    }, 400);
  };

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

  // Duplicate Check
  const [duplicateNotice, setDuplicateNotice] = useState<{
    exists: boolean;
    matchedBy: 'mobile' | 'email' | 'both';
    maskedMobile?: string;
    maskedEmail?: string;
  } | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState<boolean>(false);

  useEffect(() => {
    if (preSelectedPlanId) {
      setSelectedPlanId(preSelectedPlanId);
    }
  }, [preSelectedPlanId]);

  // Initial sponsor verification (Supports ?s=, ?sponsor=, ?u=, ?ref=)
  useEffect(() => {
    let initialSponsor = initialSponsorId;
    if (!initialSponsor) {
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('sponsor') || params.get('s') || params.get('u') || params.get('ref') || params.get('sponsorId');
        if (ref) initialSponsor = ref.toUpperCase();
      } catch {
        // ignore
      }
    }

    const targetSponsor = (initialSponsor || OFFICIAL_ROOT_SPONSOR_ID).trim().toUpperCase();
    setSponsorId(targetSponsor);
    checkSponsor(targetSponsor);
  }, [initialSponsorId]);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];

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
      setSponsorError('स्पॉन्सर ID सत्यापन विफल रहा।');
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

  // Step Validation: Strict enforcement of all user inputs
  const validateStep1 = async (): Promise<boolean> => {
    setErrorMsg('');

    // 1. Full Name check
    const nameCheck = validateFullName(fullName);
    if (!nameCheck.isValid) {
      setNameError(nameCheck.error || 'कृपया सही पूरा नाम दर्ज करें');
      setErrorMsg(nameCheck.error || 'कृपया अपना वास्तविक पूरा नाम दर्ज करें। कोई भी रैंडम अक्षर या संख्या स्वीकार्य नहीं है।');
      return false;
    }
    setNameError('');

    // 2. Mobile number check
    const mobCheck = validateMobileNumber(mobileNumber);
    if (!mobCheck.isValid) {
      setMobileError(mobCheck.error || 'अमान्य मोबाइल नंबर');
      setErrorMsg(mobCheck.error || 'कृपया 10-अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू होने वाला)। फर्जी या रैंडम नंबर स्वीकार्य नहीं हैं।');
      return false;
    }
    setMobileError('');

    // 3. Email check (if entered)
    if (email.trim()) {
      const emCheck = validateEmailAddress(email);
      if (!emCheck.isValid) {
        setEmailError(emCheck.error || 'अमान्य ईमेल');
        setErrorMsg(emCheck.error || 'कृपया एक वैध और वास्तविक ईमेल आईडी दर्ज करें। रैंडम ईमेल स्वीकार्य नहीं है।');
        return false;
      }
    }
    setEmailError('');

    // 4. Strict Sponsor ID check (NO RANDOM SPONSOR ID)
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
    if (customUsername.trim() && usernameError) {
      setErrorMsg(usernameError);
      return false;
    }
    if (!password.trim()) {
      setErrorMsg('कृपया सुरक्षित पासवर्ड दर्ज करें (कम से कम 4 अक्षर)।');
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
      const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];
      const cleanUsernameVal = customUsername.trim().toLowerCase().replace(/^@/, '');
      const newUser = await registerNewUserAsync({
        fullName: fullName.trim(),
        username: cleanUsernameVal || undefined,
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
          username: cleanUsernameVal || undefined,
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
      onRegisterSuccess(newUser);
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

  return (
    <section id="registration-portal" className="scroll-mt-24 space-y-6 w-full max-w-5xl mx-auto">
      {/* Clean Header */}
      <div className="text-center space-y-2 px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
          सदस्य पंजीकरण <span className="gold-text">पोर्टल</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          आधिकारिक सदस्यता व डिजिटल ID कार्ड प्राप्त करने के लिए 3 आसान चरणों को पूरा करें।
        </p>
      </div>

      {/* Step Indicator Tabs */}
      <div className="glass-card-gold p-2 sm:p-3 rounded-2xl border border-amber-500/30">
        <div className="grid grid-cols-3 gap-2">
          {/* Step 1 Tab */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentStep === 1
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : currentStep > 1
                ? 'bg-slate-900/80 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep === 1
                ? 'bg-slate-950 text-amber-300'
                : currentStep > 1
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="truncate">1. व्यक्तिगत विवरण</span>
          </button>

          {/* Step 2 Tab */}
          <button
            type="button"
            onClick={async () => {
              const ok = await validateStep1();
              if (ok) setCurrentStep(2);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentStep === 2
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : currentStep > 2
                ? 'bg-slate-900/80 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep === 2
                ? 'bg-slate-950 text-amber-300'
                : currentStep > 2
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="truncate">2. प्लान व पासवर्ड</span>
          </button>

          {/* Step 3 Tab */}
          <button
            type="button"
            onClick={async () => {
              const ok1 = await validateStep1();
              if (ok1 && validateStep2()) setCurrentStep(3);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentStep === 3
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep === 3
                ? 'bg-slate-950 text-amber-300'
                : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </span>
            <span className="truncate">3. पेमेंट व एक्टिवेशन</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form Container (8 Cols on Desktop) */}
        <div className="lg:col-span-8 glass-card-gold p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-amber-500/30 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>
                {currentStep === 1 && 'चरण 1: व्यक्तिगत व स्पॉन्सर जानकारी'}
                {currentStep === 2 && 'चरण 2: प्लान चयन व पासवर्ड निर्माण'}
                {currentStep === 3 && 'चरण 3: पेमेंट विवरण व एक्टिवेशन'}
              </span>
            </h3>
            <button
              type="button"
              onClick={() => onOpenLogin('login')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 transition"
            >
              <span>लॉगिन करें →</span>
            </button>
          </div>

          {/* Duplicate Notice Banner (Masked Privacy) */}
          {duplicateNotice && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-950/90 via-slate-950 to-red-950/90 border-2 border-amber-400 rounded-2xl text-white space-y-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-black text-amber-300">
                    यह खाता पहले से पंजीकृत है
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5">
                    दर्ज किया गया {duplicateNotice.matchedBy === 'both' ? 'मोबाइल नंबर व ईमेल' : duplicateNotice.matchedBy === 'mobile' ? 'मोबाइल नंबर' : 'ईमेल'} पहले से सक्रिय है।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenLogin('login')}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>सीधे लॉगिन करें</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin('forgot_password')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-amber-400/60 text-amber-300 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>पासवर्ड रीसेट करें</span>
                </button>
              </div>

              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => setDuplicateNotice(null)}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  अन्य मोबाइल नंबर से पंजीकरण करें
                </button>
              </div>
            </div>
          )}

          {/* Validation Error Message */}
          {errorMsg && !duplicateNotice && (
            <div className="p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* ================= SECTION 1: PERSONAL & SPONSOR DETAILS ================= */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className={`w-full bg-slate-950 border text-white rounded-xl px-3.5 py-2.5 outline-none transition ${
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
                      <span>मोबाइल / WhatsApp नंबर <span className="text-red-400">*</span>:</span>
                      {isCheckingDuplicate ? (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> जांच हो रही है...
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
                      className={`w-full bg-slate-950 border text-white rounded-xl px-3.5 py-2.5 outline-none transition font-mono ${
                        mobileError ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
                      }`}
                    />
                    {mobileError && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{mobileError}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      केवल 6, 7, 8 या 9 से शुरू होने वाला वास्तविक 10-अंकीय नंबर दर्ज करें।
                    </p>
                  </div>

                  {/* Sponsor ID with Live Real Verification */}
                  <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-slate-200 font-bold flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>स्पॉन्सर ID (Sponsor ID) <span className="text-red-400">*</span>:</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleFillDefaultSponsor}
                        className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>आधिकारिक डिफ़ॉल्ट ID भरें (IOIS999VK01)</span>
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
                        className={`w-full bg-slate-900 border text-amber-300 font-mono font-bold rounded-xl px-3.5 py-2.5 outline-none transition uppercase tracking-wider ${
                          sponsorStatus === 'valid'
                            ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                            : sponsorStatus === 'invalid'
                            ? 'border-red-500 bg-red-950/20 text-red-300'
                            : 'border-amber-500/60 focus:border-amber-400'
                        }`}
                      />

                      {/* Right Indicator Icon */}
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

                    {/* Live Sponsor Feedback Pill */}
                    {sponsorStatus === 'valid' && (
                      <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-emerald-300 text-xs animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold">सत्यापित स्पॉन्सर: </span>
                            <span className="text-white font-black">{sponsorVerifiedName}</span>
                            <span className="text-emerald-400 ml-1 font-mono font-bold">({sponsorId})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={handleOpenSponsorCard}
                            disabled={isLoadingSponsorCard}
                            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-lg font-bold border border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
                          >
                            {isLoadingSponsorCard ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
                            <span>मास्क्ड ID कार्ड देखें</span>
                          </button>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full font-bold border border-emerald-500/30">
                            ✓ मान्य
                          </span>
                        </div>
                      </div>
                    )}

                    {sponsorStatus === 'invalid' && (
                      <div className="p-2.5 bg-red-950/70 border border-red-500/60 rounded-xl text-red-200 text-xs space-y-1 animate-in fade-in">
                        <div className="flex items-center gap-2 font-bold text-red-300">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{sponsorError || 'अमान्य स्पॉन्सर ID! यह स्पॉन्सर सिस्टम में मौजूद नहीं है।'}</span>
                        </div>
                        <p className="text-[11px] text-red-300/90 pl-6">
                          ⚠️ सुरक्षा नीति: कोई भी रैंडम स्पॉन्सर ID स्वीकार्य नहीं है। यदि आपके पास कोई अन्य स्पॉन्सर नहीं है तो कृपया ऊपर दिए बटन से <b>IOIS999VK01</b> का चयन करें।
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
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> मान्य फॉर्मेट
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => handleEmailChange(email)}
                      placeholder="name@example.com (उदा. rahul@gmail.com)"
                      className={`w-full bg-slate-950 border text-white rounded-xl px-3.5 py-2.5 outline-none transition ${
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
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
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
                      className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                    />
                  </div>
                </div>

                {/* Next Button */}
                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <span>अगला: प्लान व पासवर्ड चुनें</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= SECTION 2: PLAN & SECURITY ================= */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 3D Plan Selector with 3D Text & Logo */}
                  <div className="sm:col-span-2">
                    <Plan3DSelector 
                      selectedPlanId={selectedPlanId} 
                      onSelectPlan={(id) => setSelectedPlanId(id)} 
                    />
                  </div>

                  {/* Role */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1.5">
                      सदस्यता पद (Role / Designation):
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition cursor-pointer"
                    >
                      <option value="Verified Elite Member">Verified Elite Member</option>
                      <option value="Active Digital Learner">Active Digital Learner</option>
                      <option value="Official Youth Reseller">Official Youth Reseller</option>
                      <option value="Supreme Master Partner">Supreme Master Partner</option>
                      <option value="Student Ambassador">Student Ambassador</option>
                    </select>
                  </div>
                  {/* Custom Unique Username */}
                  <div className="sm:col-span-2 p-3.5 bg-slate-950/90 border border-amber-500/40 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 font-bold flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>कस्टम यूजरनेम (@username) सेट करें (वैकल्पिक):</span>
                      </label>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        शॉर्ट स्पॉन्सर लिंक बनेगा
                      </span>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold text-sm">@</span>
                      <input
                        type="text"
                        value={customUsername}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="उदा. vikas01, rahul_kumar"
                        className={`w-full bg-slate-900 border text-white pl-8 pr-10 py-2.5 rounded-xl font-mono text-xs outline-none lowercase transition ${
                          usernameError ? 'border-red-500 focus:border-red-400' : usernameSuccess ? 'border-emerald-500 focus:border-emerald-400' : 'border-slate-700 focus:border-amber-400'
                        }`}
                      />
                      {isCheckingUsername && (
                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>

                    {usernameError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{usernameError}</span>
                      </p>
                    )}

                    {usernameSuccess && (
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{usernameSuccess}</span>
                      </p>
                    )}

                    <p className="text-[10px] text-slate-400 leading-tight">
                      💡 यदि आप यूजरनेम खाली छोड़ते हैं, तो सिस्टम स्वतः आपके नाम व प्लान अनुसार 256-Bit एन्क्रिप्टेड User ID बनाएगा। दोनों विकल्प मान्य हैं!
                    </p>
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
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
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
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                    />
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="pt-2">
                  <SmartFileUpload
                    label="प्रोफाइल फोटो (डिजिटल ID कार्ड हेतु)"
                    sublabel="फ़ोटो चुनें या Google Drive लिंक दर्ज करें"
                    fileValue={photoUrl}
                    driveLinkValue={googleDrivePhotoLink}
                    onFileChange={setPhotoUrl}
                    onDriveLinkChange={setGoogleDrivePhotoLink}
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="pt-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>पीछे जाएं</span>
                  </button>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <span>अगला: पेमेंट व एक्टिवेशन</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= SECTION 3: PAYMENT & ACTIVATION ================= */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {/* Official UPI Details Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">चुना हुआ प्लान:</span>
                      <div className="text-sm font-black text-white">{selectedPlan.code} ({selectedPlan.name})</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">देय राशि:</span>
                      <div className="text-lg font-black text-amber-300 font-mono">₹{selectedPlan.price}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* QR Code */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-2.5 bg-white rounded-xl text-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi%3A%2F%2Fpay%3Fpa%3D${OFFICIAL_UPI_ID}%26pn%3DVikas%2520Kumar%26am%3D${selectedPlan.price}%26cu%3DINR`} 
                        alt="UPI QR Code - Vikas Kumar" 
                        className="w-28 h-28 object-contain"
                      />
                      <span className="text-[8px] font-black text-slate-900 mt-1">
                        GPAY • PHONEPE • PAYTM
                      </span>
                    </div>

                    {/* Payee Info & Copy Button */}
                    <div className="sm:col-span-8 space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">आधिकारिक प्राप्तकर्ता:</span>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{OFFICIAL_PAYEE_NAME}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">आधिकारिक UPI ID:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-amber-300 truncate">
                            {OFFICIAL_UPI_ID}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            {copiedUpi ? (
                              <>
                                <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                                <span>कॉपी हुआ</span>
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
                        className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-[11px] font-bold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>सीधे UPI ऐप से भुगतान करें</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Screenshot Upload */}
                <SmartFileUpload
                  label="पेमेंट स्क्रीनशॉट अपलोड करें (Screenshot Proof)"
                  sublabel="सफल ट्रांजेक्शन का स्क्रीनशॉट या ड्राइव लिंक दें"
                  fileValue={paymentScreenshotUrl}
                  driveLinkValue={googleDrivePaymentLink}
                  onFileChange={setPaymentScreenshotUrl}
                  onDriveLinkChange={setGoogleDrivePaymentLink}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* UTR */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      UTR / Transaction Ref नंबर:
                    </label>
                    <input
                      type="text"
                      value={paymentUtr}
                      onChange={(e) => setPaymentUtr(e.target.value)}
                      placeholder="उदा. 4239XXXXXXXX (वैकल्पिक)"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2 outline-none transition font-mono"
                    />
                  </div>

                  {/* Payout UPI ID */}
                  <div>
                    <label className="block text-amber-300 font-bold mb-1.5">
                      पेआउट पाने का UPI ID <span className="text-red-400">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutUpi}
                      onChange={(e) => setPayoutUpi(e.target.value)}
                      placeholder="जैसे: 9876543210@paytm या UPI ID"
                      className="w-full bg-slate-950 border border-amber-500/60 focus:border-amber-400 text-amber-300 font-mono font-bold rounded-xl px-3.5 py-2 outline-none transition"
                    />
                  </div>
                </div>

                {/* Submit & Back Buttons */}
                <div className="pt-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>पीछे जाएं</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 hover:from-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>{isSubmitting ? 'खाता बनाया जा रहा है...' : 'रजिस्ट्रेशन पूर्ण करें (Get Digital ID)'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Clean Right Sidebar: Compact Summary (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card-gold p-5 rounded-2xl sm:rounded-3xl border border-amber-500/30 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>रजिस्ट्रेशन समरी (Live Summary)</span>
            </h4>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">आवेदक:</span>
                <span className="font-bold text-white truncate max-w-[150px]">
                  {fullName.trim() || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">मोबाइल:</span>
                <span className="font-mono text-white">
                  {mobileNumber.trim() || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">प्लान:</span>
                <span className="font-bold text-amber-400">
                  {selectedPlan.code} (₹{selectedPlan.price})
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">डिजिटल ID:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {fullName.trim() 
                    ? `IOIS${selectedPlan.price}${fullName.trim().split(/\s+/).map(n => n[0]?.toUpperCase()).join('').slice(0,2) || 'XX'}01`
                    : `IOIS${selectedPlan.price}RK01`
                  }
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>पंजीकरण के तुरंत बाद डिजिटल ID कार्ड उपलब्ध होगा।</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span>हेल्पलाइन सपोर्ट:</span>
              <span className="font-bold text-emerald-400">{OFFICIAL_PHONE}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>प्राप्तकर्ता:</span>
              <span className="text-slate-300">{OFFICIAL_PAYEE_NAME}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Sponsor Masked ID Card Inspection */}
      {isViewingSponsorModal && sponsorCardUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-4xl rounded-3xl p-4 sm:p-6 shadow-[0_25px_80px_rgba(245,158,11,0.25)] relative text-white my-4 max-h-[95vh] overflow-y-auto space-y-4">
            <button
              type="button"
              onClick={() => setIsViewingSponsorModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition z-20 border border-slate-700 shadow-md"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5 pr-8 sm:pr-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>सत्यापित स्पॉन्सर ID कार्ड (गोपनीयता सुरक्षित - मास्क्ड विवरण)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                स्पॉन्सर: <span className="text-amber-400 font-mono">{sponsorCardUser.userId}</span> ({sponsorCardUser.fullName})
              </h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                सुरक्षा मानकों के तहत स्पॉन्सर का मोबाइल नंबर व ईमेल सुरक्षित रूप से मास्क्ड हैं।
              </p>
            </div>

            <div className="pt-2">
              <IDCardGenerator
                currentUser={null}
                targetUser={sponsorCardUser}
                isSponsorPreview={true}
                isModalMode={true}
              />
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsViewingSponsorModal(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase transition cursor-pointer shadow-md"
              >
                रजिस्ट्रेशन जारी रखें ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
