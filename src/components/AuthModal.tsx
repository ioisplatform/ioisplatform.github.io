import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  loginUserAsync, 
  verifyUserIdentityAsync, 
  resetPasswordWithTokenAsync, 
  secureRecoverUserIdAsync,
  maskMobile,
  maskEmail,
  maskName 
} from '../services/userService';
import { 
  Lock, 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Shield, 
  Loader2,
  ShieldAlert,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
  initialMode?: 'login' | 'forgot_user_id' | 'forgot_password';
  initialIdentifier?: string;
  initialMobile?: string;
  initialUserId?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  onSwitchToRegister,
  initialMode = 'login',
  initialIdentifier = '',
  initialMobile = '',
  initialUserId = '',
}) => {
  const [mode, setMode] = useState<'login' | 'forgot_user_id' | 'forgot_password'>(initialMode);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState<string>(initialIdentifier || initialUserId || '');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Secure Forgot User ID state (requires BOTH mobile and email)
  const [forgotMobile, setForgotMobile] = useState<string>(initialMobile || '');
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotFullName, setForgotFullName] = useState<string>('');
  const [recoveredUserId, setRecoveredUserId] = useState<string | null>(null);
  const [recoveredMaskedName, setRecoveredMaskedName] = useState<string | null>(null);

  // Forgot Password: 2-Step Real Identity Verification Flow
  const [verifyStep, setVerifyStep] = useState<1 | 2>(1);
  const [identIdentifier, setIdentIdentifier] = useState<string>(initialUserId || initialIdentifier || initialMobile || '');
  const [identFullName, setIdentFullName] = useState<string>('');
  const [identEmail, setIdentEmail] = useState<string>('');
  const [identAddress, setIdentAddress] = useState<string>('');
  
  // Verified session info (unlocked only after real identity match)
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verifiedUserId, setVerifiedUserId] = useState<string | null>(null);
  const [verifiedMaskedName, setVerifiedMaskedName] = useState<string | null>(null);
  const [verifiedMaskedMobile, setVerifiedMaskedMobile] = useState<string | null>(null);

  // Step 2 new password inputs
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Status & errors
  const [errorMsg, setErrorMsg] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      if (initialIdentifier) setLoginIdentifier(initialIdentifier);
      if (initialUserId && !initialIdentifier) setLoginIdentifier(initialUserId);
      if (initialUserId || initialIdentifier || initialMobile) {
        setIdentIdentifier(initialUserId || initialIdentifier || initialMobile);
      }
      if (initialMobile) {
        setForgotMobile(initialMobile);
      }
      
      // Reset verification state on modal open
      setVerifyStep(1);
      setVerificationToken(null);
      setVerifiedUserId(null);
      setVerifiedMaskedName(null);
      setVerifiedMaskedMobile(null);
      setNewPassword('');
      setConfirmNewPassword('');
      setErrorMsg('');
      setResetSuccessMsg(null);
      setRecoveredUserId(null);
      setRecoveredMaskedName(null);
    }
  }, [isOpen, initialMode, initialIdentifier, initialMobile, initialUserId]);

  if (!isOpen) return null;

  // 1. Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('कृपया अपना User ID, मोबाइल नंबर या ईमेल दर्ज करें।');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('कृपया अपना पासवर्ड दर्ज करें।');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUserAsync(loginIdentifier, loginPassword);
      setIsLoading(false);

      if (result.success && result.user) {
        onSuccessLogin(result.user);
        onClose();
      } else {
        setErrorMsg(result.error || 'यूजर आईडी या पासवर्ड गलत है। कृपया पुनः प्रयास करें।');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('लॉगिन करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    }
  };

  // 2. Handle Secure Recover User ID (Requires Mobile + Email to protect privacy)
  const handleRecoverUserId = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setRecoveredUserId(null);
    setRecoveredMaskedName(null);

    const mob = forgotMobile.trim();
    const em = forgotEmail.trim();
    if (!mob || mob.replace(/\D/g, '').length < 10) {
      setErrorMsg('कृपया पंजीकृत 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!em || !em.includes('@')) {
      setErrorMsg('सुरक्षा कारणों से User ID खोजने के लिए पंजीकृत ईमेल आईडी भी दर्ज करना अनिवार्य है।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await secureRecoverUserIdAsync(mob, em, forgotFullName.trim());
      setIsLoading(false);

      if (res.success && res.userId) {
        setRecoveredUserId(res.userId);
        setRecoveredMaskedName(res.maskedName || null);
      } else {
        setErrorMsg(res.error || 'दर्ज किया गया मोबाइल नंबर और ईमेल किसी पंजीकृत खाते से मेल नहीं खाते। सुरक्षा कारणों से User ID नहीं दिखाई जा सकती।');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('रिकवरी प्रक्रिया में त्रुटि आई। कृपया पुनः प्रयास करें।');
    }
  };

  // 3. Handle Identity Verification (Step 1 of Password Reset)
  const handleVerifyIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identIdentifier.trim()) {
      setErrorMsg('कृपया अपना User ID या पंजीकृत 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!identFullName.trim()) {
      setErrorMsg('सुरक्षा सत्यापन हेतु कृपया अपना पंजीकृत पूरा नाम (Full Name) दर्ज करें।');
      return;
    }
    if (!identEmail.trim() || !identEmail.includes('@')) {
      setErrorMsg('सुरक्षा सत्यापन हेतु कृपया अपनी पंजीकृत ईमेल आईडी (Registered Email) दर्ज करें।');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyUserIdentityAsync({
        identifier: identIdentifier.trim(),
        fullName: identFullName.trim(),
        email: identEmail.trim(),
        address: identAddress.trim() || undefined,
      });
      setIsLoading(false);

      if (result.success && result.verificationToken && result.userId) {
        setVerificationToken(result.verificationToken);
        setVerifiedUserId(result.userId);
        setVerifiedMaskedName(result.maskedName || maskName(identFullName));
        setVerifiedMaskedMobile(result.maskedMobile || maskMobile(identIdentifier));
        setVerifyStep(2);
      } else {
        setErrorMsg(
          result.error ||
          'पहचान सत्यापन असफल: दर्ज किया गया नाम, ईमेल या विवरण इस खाते के रिकॉर्ड से मेल नहीं खाता। अनधिकृत पासवर्ड बदलाव रोकने हेतु अनुमति नहीं दी गई।'
        );
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('पहचान सत्यापन में तकनीकी त्रुटि आई। कृपया पुनः प्रयास करें।');
    }
  };

  // 4. Handle Password Update (Step 2 of Password Reset)
  const handleSetNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResetSuccessMsg(null);

    if (!verifiedUserId || !verificationToken) {
      setErrorMsg('सत्यापन सत्र समाप्त हो गया है। कृपया अपनी पहचान पुनः सत्यापित करें।');
      setVerifyStep(1);
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setErrorMsg('नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('नया पासवर्ड और कन्फर्म पासवर्ड आपस में मेल नहीं खाते।');
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPasswordWithTokenAsync(
        verifiedUserId,
        verificationToken,
        newPassword,
        confirmNewPassword,
        { fullName: identFullName, email: identEmail }
      );
      setIsLoading(false);

      if (result.success) {
        setResetSuccessMsg(result.message || 'पासवर्ड सफलतापूर्वक बदल दिया गया है!');
        setLoginIdentifier(verifiedUserId);
      } else {
        setErrorMsg(result.error || 'पासवर्ड अपडेट करने में त्रुटि आई।');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('पासवर्ड अपडेट करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(245,158,11,0.25)] relative text-white my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>IOIS SECURE ACCESS & ZERO-LEAK VERIFICATION</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {mode === 'login' && 'सदस्य लॉगिन (Member Login)'}
            {mode === 'forgot_user_id' && 'सुरक्षित यूजर ID खोज (Find User ID)'}
            {mode === 'forgot_password' && 'पहचान आधारित पासवर्ड रीसेट (Secure Reset)'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {mode === 'login' && 'अपने IOIS डैशबोर्ड और डिजिटल ID कार्ड में प्रवेश करें'}
            {mode === 'forgot_user_id' && 'मोबाइल व ईमेल के दोहरे मिलान द्वारा अपनी User ID प्राप्त करें'}
            {mode === 'forgot_password' && (
              verifyStep === 1 
                ? 'बिना OTP: आपके द्वारा सबमिट किए गए असली विवरणों से पहचान सत्यापित करें'
                : 'पहचान सत्यापित हो चुकी है! अब अपना नया पासवर्ड सेट करें'
            )}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 1: MEMBER LOGIN FORM */}
        {/* ========================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">User ID, मोबाइल नंबर या ईमेल:</label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="उदा. IOIS10RK01 या 9876543210"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-bold">पासवर्ड (Password):</label>
                <button
                  type="button"
                  onClick={() => { 
                    setErrorMsg(''); 
                    setMode('forgot_password');
                    setVerifyStep(1);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>पासवर्ड भूल गए?</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="अपना पासवर्ड दर्ज करें"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-10 py-2.5 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>प्रमाणित किया जा रहा है...</span>
                </>
              ) : (
                <>
                  <span>लॉगिन करें (LOGIN NOW)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Links */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setMode('forgot_user_id'); }}
                className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>यूजर ID भूल गए? (Find ID)</span>
              </button>

              <button
                type="button"
                onClick={() => { onClose(); onSwitchToRegister(); }}
                className="text-amber-400 hover:text-amber-300 font-extrabold cursor-pointer"
              >
                नया रजिस्ट्रेशन करें →
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* MODE 2: SECURE FORGOT USER ID */}
        {/* ========================================================= */}
        {mode === 'forgot_user_id' && (
          <form onSubmit={handleRecoverUserId} className="space-y-4 text-xs">
            <div className="p-3 bg-sky-950/50 border border-sky-500/30 rounded-xl text-[11px] text-sky-200 flex items-start gap-2">
              <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>गोपनीयता सुरक्षा:</strong> केवल मोबाइल नंबर डालने से ID उजागर नहीं की जाती। अनधिकृत जासूसी रोकने हेतु पंजीकृत मोबाइल और पंजीकृत ईमेल दोनों का मिलान अनिवार्य है।
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">पंजीकृत मोबाइल नंबर (10 अंक):</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  maxLength={10}
                  value={forgotMobile}
                  onChange={(e) => setForgotMobile(e.target.value)}
                  placeholder="उदा. 9876543210"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">पंजीकृत ईमेल आईडी (Registered Email):</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="उदा. yourname@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">पंजीकृत पूरा नाम (वैकल्पिक अतिरिक्त सुरक्षा):</label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={forgotFullName}
                  onChange={(e) => setForgotFullName(e.target.value)}
                  placeholder="उदा. Rahul Kumar"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                />
              </div>
            </div>

            {recoveredUserId && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center space-y-3 animate-fadeIn">
                <div className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>सत्यापन सफल! आपकी IOIS यूजर ID मिल गई है:</span>
                </div>
                {recoveredMaskedName && (
                  <p className="text-white text-xs">सदस्य नाम: <span className="text-amber-300 font-bold">{recoveredMaskedName}</span></p>
                )}
                <div className="text-xl font-black text-amber-300 tracking-wider font-mono bg-slate-950 py-2 rounded-xl border border-amber-400">
                  {recoveredUserId}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier(recoveredUserId);
                      setMode('login');
                    }}
                    className="w-full text-xs bg-amber-400 text-slate-950 font-black px-3 py-2.5 rounded-xl hover:bg-amber-300 transition cursor-pointer"
                  >
                    इस ID से लॉगिन करें →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentIdentifier(recoveredUserId);
                      setMode('forgot_password');
                      setVerifyStep(1);
                    }}
                    className="w-full text-xs bg-slate-800 text-amber-300 border border-amber-400/40 font-bold px-3 py-2.5 rounded-xl hover:bg-slate-700 transition cursor-pointer"
                  >
                    पासवर्ड रीसेट करें 🔄
                  </button>
                </div>
              </div>
            )}

            {!recoveredUserId && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>सत्यापित किया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>सुरक्षित सत्यापन कर User ID खोजें</span>
                  </>
                )}
              </button>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setMode('login'); }}
                className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
              >
                ← वापस लॉगिन पर जाएं
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* MODE 3: REAL-IDENTITY VERIFIED PASSWORD RESET (NO OTP) */}
        {/* ========================================================= */}
        {mode === 'forgot_password' && (
          <div className="space-y-4 text-xs">
            {resetSuccessMsg ? (
              <div className="p-5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-black text-white">पासवर्ड अपडेट सफल!</h4>
                <p className="text-emerald-200 text-xs leading-relaxed">{resetSuccessMsg}</p>
                <button
                  type="button"
                  onClick={() => { 
                    setMode('login'); 
                    setResetSuccessMsg(null); 
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black rounded-xl hover:from-amber-300 transition cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  नए पासवर्ड से तुरंत लॉगिन करें →
                </button>
              </div>
            ) : (
              <>
                {/* STEP INDICATOR */}
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800 text-[11px]">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                    verifyStep === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-emerald-400'
                  }`}>
                    {verifyStep === 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                    <span>1. पहचान सत्यापन</span>
                  </div>
                  <span className="text-slate-600">➔</span>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                    verifyStep === 2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-500'
                  }`}>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>2. नया पासवर्ड</span>
                  </div>
                </div>

                {/* ----------------------------------------------------- */}
                {/* STEP 1: MULTI-FIELD REAL IDENTITY CHALLENGE */}
                {/* ----------------------------------------------------- */}
                {verifyStep === 1 && (
                  <form onSubmit={handleVerifyIdentitySubmit} className="space-y-3.5">
                    <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>सुरक्षित वास्तविक पहचान सत्यापन (No OTP Required)</span>
                      </div>
                      पासवर्ड बदलने से पहले आपको रजिस्ट्रेशन के समय सबमिट किए गए अपने असली विवरण दर्ज करने होंगे। जब तक आपका नाम और ईमेल आधिकारिक रिकॉर्ड से 100% मैच नहीं होंगे, पासवर्ड बदलने की अनुमति नहीं मिलेगी।
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">User ID या पंजीकृत मोबाइल नंबर:</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={identIdentifier}
                          onChange={(e) => setIdentIdentifier(e.target.value)}
                          placeholder="उदा. IOIS10RK01 या 9876543210"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">पंजीकृत पूरा नाम (Full Name as submitted):</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={identFullName}
                          onChange={(e) => setIdentFullName(e.target.value)}
                          placeholder="उदा. Rahul Kumar (रजिस्ट्रेशन वाला नाम)"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">पंजीकृत ईमेल आईडी (Registered Email):</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={identEmail}
                          onChange={(e) => setIdentEmail(e.target.value)}
                          placeholder="उदा. rahul@gmail.com"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">पंजीकृत शहर / राज्य / पता (वैकल्पिक सुरक्षा):</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={identAddress}
                          onChange={(e) => setIdentAddress(e.target.value)}
                          placeholder="उदा. Jaipur, Rajasthan या Patna, Bihar"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>असली रिकॉर्ड से मिलान किया जा रहा है...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          <span>मेरी पहचान सत्यापित करें (Verify Identity) ➔</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ----------------------------------------------------- */}
                {/* STEP 2: CREATE NEW PASSWORD (UNLOCKED ONLY ON MATCH) */}
                {/* ----------------------------------------------------- */}
                {verifyStep === 2 && (
                  <form onSubmit={handleSetNewPasswordSubmit} className="space-y-4 animate-fadeIn">
                    {/* Identity Confirmed Card */}
                    <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>वास्तविक पहचान प्रमाणित हो गई (Identity Verified)!</span>
                      </div>
                      <div className="text-slate-200 text-[11px] leading-relaxed">
                        सत्यापित सदस्य: <strong className="text-amber-300">{verifiedMaskedName}</strong> | ID: <strong className="font-mono text-white">{verifiedUserId}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        सुरक्षा टोकन सक्रिय (15 मिनट तक वैध)। कृपया अपना नया गुप्त पासवर्ड बनाएं।
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">नया पासवर्ड (कम से कम 4 अक्षर):</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="नया मजबूत पासवर्ड बनाएं"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-10 py-2.5 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">नया पासवर्ड दोबारा दर्ज करें (Confirm Password):</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="नया पासवर्ड कन्फर्म करें"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>सुरक्षित रूप से सेव हो रहा है...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>नया पासवर्ड सुरक्षित रूप से सेव करें 💾</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setVerifyStep(1)}
                      className="w-full py-2 text-center text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      ← विवरण बदलकर पहचान दोबारा जांचें
                    </button>
                  </form>
                )}
              </>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setMode('login'); }}
                className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
              >
                ← वापस लॉगिन पर जाएं
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
