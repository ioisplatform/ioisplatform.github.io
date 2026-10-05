import React, { useState, useId } from 'react';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { PlanDetail, MemberProfile } from '../types';
import { registerStudentToDatabase, generateUniqueStudentId, extractNameInitials } from '../services/userService';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Smartphone, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  BookOpen, 
  User, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  FileText, 
  Wallet, 
  Layers, 
  Building2, 
  CreditCard,
  Camera 
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  onSuccess: (profile: MemberProfile) => void;
  onOpenLogin: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = 'plan-01',
  onSuccess,
  onOpenLogin
}) => {
  // 5-Step Wizard State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Plan
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);

  // Step 2: Member Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorId, setSponsorId] = useState('');

  // Step 2.1: Profile Photo & Personal QR for Digital ID Card & Dashboard
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');
  const [profilePhotoFile, setProfilePhotoFile] = useState<string | null>(null);
  const [profilePhotoName, setProfilePhotoName] = useState<string>('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  const [personalQrType, setPersonalQrType] = useState<'link' | 'image'>('link');
  const [personalProfileLink, setPersonalProfileLink] = useState<string>('');
  const [personalQrFile, setPersonalQrFile] = useState<string | null>(null);
  const [personalQrName, setPersonalQrName] = useState<string>('');
  const [personalQrPreview, setPersonalQrPreview] = useState<string | null>(null);

  // Step 3: Withdrawal / Payout Receiving Details
  const [withdrawalUpi, setWithdrawalUpi] = useState('');

  // Step 4: Payment Details
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Step 5: Verification Documents
  const [screenshotFile, setScreenshotFile] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [addressProofFile, setAddressProofFile] = useState<string | null>(null);
  const [addressProofName, setAddressProofName] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredPendingUser, setRegisteredPendingUser] = useState<MemberProfile | null>(null);
  const [copiedPendingId, setCopiedPendingId] = useState(false);

  if (!isOpen) return null;

  const currentPlan = ioisMasterPlans.find(p => p.id === selectedPlanId) || ioisMasterPlans[0];

  // Real Scannable UPI Intent Link and High-Resolution Dynamic QR URL
  const upiIntentString = `upi://pay?pa=8877490845@spicepay&pn=IOIS%20PLATFORM&am=${currentPlan.price}&cu=INR&tn=IOIS%20Plan0${currentPlan.planNumber}%20Verification`;
  const upiQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(upiIntentString)}`;

  // Auto-calculated Permanent, Unique, Non-editable Student ID (e.g. IOIS10RK01)
  // Format: IOIS + Plan (10) + Initials (RK) + Serial (01)
  const rollNumberPreview = generateUniqueStudentId(fullName || 'विद्यार्थी', currentPlan.id);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: '--', color: 'text-slate-400', bar: 0 };
    if (pass.length < 6) return { label: 'कमजोर (Weak)', color: 'text-red-500', bar: 25 };
    if (pass.length < 8) return { label: 'सामान्य (Medium)', color: 'text-amber-500', bar: 50 };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    if (hasNum && hasSpecial) return { label: 'मजबूत (Strong)', color: 'text-emerald-600', bar: 100 };
    return { label: 'अच्छा (Good)', color: 'text-blue-600', bar: 75 };
  };

  const passStrength = getPasswordStrength(password);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('8877490845@spicepay');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFile: (val: string) => void, 
    setName: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setProfilePhotoFile(res);
        setProfilePhotoPreview(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPersonalQrName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setPersonalQrFile(res);
        setPersonalQrPreview(res);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step Validations
  const handleNextStep1 = () => {
    setCurrentStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    const cleanP = phone.replace(/\D/g, '');
    if (cleanP.length < 10) {
      setErrorMessage('कृपया मान्य 10-अंकों का WhatsApp / मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('कृपया मान्य ईमेल आईडी दर्ज करें।');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('सुरक्षा हेतु पासवर्ड कम से कम 8 अक्षरों का होना अनिवार्य है।');
      return;
    }
    if (!fullAddress.trim()) {
      setErrorMessage('कृपया अपना पूरा पता (मकान / गांव / शहर / पिनकोड) दर्ज करें।');
      return;
    }

    setCurrentStep(3);
  };

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!withdrawalUpi.trim()) {
      setErrorMessage('कृपया अपना UPI ID या बैंक विवरण दर्ज करें ताकि आपको डायरेक्ट पेआउट मिल सके।');
      return;
    }

    setCurrentStep(4);
  };

  const handleNextStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!utrNumber.trim()) {
      setErrorMessage('कृपया भुगतान के बाद मिला 12 अंकों का UTR / Transaction ID दर्ज करें।');
      return;
    }

    setCurrentStep(5);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!screenshotFile) {
      setErrorMessage('सुरक्षा नियम: कृपया भुगतान (Payment) का सफल स्क्रीनशॉट अनिवार्य रूप से अपलोड करें!');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('कृपया नीचे दी गई नियम व शर्तों की पुष्टि वाले चेकबॉक्स पर टिक करें।');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await registerStudentToDatabase({
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: fullAddress.trim(),
        city: fullAddress.split('/')[2] || fullAddress.split(',')[0] || 'पटना',
        state: 'बिहार / भारत',
        grade: 'Member Student',
        planId: currentPlan.id,
        planName: currentPlan.name,
        amountPaid: currentPlan.price,
        paymentRef: utrNumber.trim(),
        sponsorName: sponsorName.trim(),
        sponsorId: sponsorId.trim(),
        withdrawalUpi: withdrawalUpi.trim(),
        paymentScreenshotUrl: screenshotFile || '',
        paymentAddressProofUrl: addressProofFile || '',
        password: password,
        avatarUrl: profilePhotoFile || profilePhotoUrl.trim() || '',
        customQrUrl: personalQrType === 'link' ? personalProfileLink.trim() : '',
        customQrImage: personalQrType === 'image' ? (personalQrFile || '') : ''
      });

      setIsProcessing(false);

      if (res.success && res.member) {
        setRegisteredPendingUser(res.member);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage('पंजीकरण के दौरान समस्या आई। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Tricolor National Ribbon on top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white via-blue-800 to-emerald-600" />

        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0f172a] to-blue-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow">
              🇮🇳
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[#f3e5ab] text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>100% Verified Indian Digital Learning & Earning Platform</span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-white">
                IOIS सदस्य एवं छात्र खाता पंजीकरण (Step {currentStep} of 5)
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
            <span className={currentStep === 1 ? 'text-[#1e3a8a] font-black' : ''}>1. प्लान चुनें</span>
            <span className={currentStep === 2 ? 'text-[#1e3a8a] font-black' : ''}>2. सदस्य विवरण</span>
            <span className={currentStep === 3 ? 'text-[#1e3a8a] font-black' : ''}>3. पेआउट विवरण</span>
            <span className={currentStep === 4 ? 'text-[#1e3a8a] font-black' : ''}>4. भुगतान (UPI)</span>
            <span className={currentStep === 5 ? 'text-[#1e3a8a] font-black' : ''}>5. सत्यापन डाक्यूमेंट्स</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-[#1e3a8a] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body Scroll Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50 text-xs">
          
          {registeredPendingUser ? (
            <div className="p-4 sm:p-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto shadow-inner border border-amber-300">
                ⏳
              </div>
              <div className="space-y-1">
                <span className="text-[11px] px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black uppercase tracking-wider border border-amber-300">
                  सत्यापन लंबित (Pending Admin Verification)
                </span>
                <h4 className="text-xl font-black text-slate-900 pt-2">
                  पंजीकरण सफलतापूर्वक दर्ज हो गया!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  प्रिय <strong>{registeredPendingUser.name}</strong>, आपका आवेदन, पेमेंट स्क्रीनशॉट एवं UTR विवरण एडमिन सत्यापन हेतु सुरक्षित जमा हो चुका है।
                </p>
              </div>

              {/* User ID Highlight Card */}
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center max-w-sm mx-auto space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  आपका सुरक्षित User ID / Roll Number
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-mono font-black text-[#1e3a8a]">
                    {registeredPendingUser.rollNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(registeredPendingUser.rollNumber);
                      setCopiedPendingId(true);
                      setTimeout(() => setCopiedPendingId(false), 2000);
                    }}
                    title="Copy User ID"
                    className="p-1.5 rounded-lg bg-blue-200 hover:bg-blue-300 text-blue-900 text-xs font-bold transition-colors"
                  >
                    {copiedPendingId ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {copiedPendingId ? 'User ID क्लिपबोर्ड में कॉपी हो गया!' : '(कृपया इस User ID को नोट कर लें)'}
                </span>
              </div>

              {/* Security Policy Alert */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-950 space-y-2 max-w-md mx-auto">
                <div className="font-black flex items-center gap-1.5 text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>उच्च सुरक्षा व सत्यापन नियम (Security Protocol):</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  बिना एडमिन द्वारा पेमेंट स्क्रीनशॉट और UTR <strong>({registeredPendingUser.paymentRef || 'N/A'})</strong> की जांच के किसी भी यूजर को डायरेक्ट एक्सेस नहीं दिया जाता।
                </p>
                <p className="text-[11px] leading-relaxed">
                  जैसे ही एडमिन आपके पेमेंट को <strong>Verify & Activate</strong> करेंगे, आपका डैशबोर्ड तुरंत सक्रिय हो जाएगा और आप अपने User ID <strong>{registeredPendingUser.rollNumber}</strong> और पासवर्ड से लॉगिन कर सकेंगे।
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs shadow-md transition-colors"
                >
                  लॉगिन पेज पर जाएं (Go to Login)
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
                >
                  पोर्टल पर वापस जाएं (Close)
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

          {/* ============================================================= */}
          {/* STEP 1: Membership Plan चुनें */}
          {/* ============================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h4 className="font-black text-sm text-slate-900 mb-1">
                  1. Membership Plan चुनें (Choose Plan)
                </h4>
                <p className="text-slate-600">
                  अपनी आवश्यकता के अनुसार plan चुनें। प्रत्येक प्लान में संबंधित डिजिटल किट व आधिकारिक रेफरल पेआउट उपलब्ध है।
                </p>
              </div>

              {/* Sato Plan Dropdown / Selector with Details */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  सातों प्लान में से कोई एक चुनें (Select Plan) *
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border-2 border-blue-900 bg-white font-black text-sm text-[#1e3a8a] outline-none shadow-xs"
                >
                  {ioisMasterPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      Plan 0{p.planNumber}: {p.name} — मात्र ₹{p.price} (सीधा पेआउट: ₹{p.incentive})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Plan Comprehensive Introduction Card */}
              <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1e3a8a] font-black text-[10px] uppercase">
                      PLAN 0{currentPlan.planNumber}
                    </span>
                    <h5 className="font-black text-base text-slate-900 mt-1">
                      {currentPlan.name}
                    </h5>
                    <p className="text-slate-500 text-[11px]">{currentPlan.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">प्लान शुल्क</span>
                    <span className="text-2xl font-black text-[#1e3a8a]">₹{currentPlan.price}</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      Direct Payout: ₹{currentPlan.incentive}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    इस प्लान में आपको क्या मिलेगा (Included Benefits):
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {currentPlan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep1}
                className="w-full py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>अगला चरण: सदस्य विवरण भरें (Step 2: Member Details)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============================================================= */}
          {/* STEP 2: Member Details (व्यक्तिगत विवरण) */}
          {/* ============================================================= */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h4 className="font-black text-sm text-slate-900 mb-1">
                  2. Member Details (व्यक्तिगत विवरण)
                </h4>
                <p className="text-slate-600 text-[11px]">
                  सही जानकारी भरें। इन्हीं details से आपका account & digital id student id iois member id card बनाया जाएगा।
                </p>
              </div>

              {/* Short & Memorable Symbol-Free User ID Preview */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-blue-900">
                    आपका छोटा व आसान User ID / Roll Number (Non-Editable)
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    आसान 8-अक्षर ID
                  </span>
                </div>
                <div className="text-xl font-mono font-black text-[#1e3a8a] mt-1 tracking-wider">
                  {rollNumberPreview}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  (IOIS + प्लान {currentPlan.price} + छात्र कोड • याद रखने में सबसे आसान और बिना किसी सिंबल के)
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Name (अपना पूरा नाम) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="अपना पूरा नाम"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none bg-white font-medium"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none bg-white font-medium"
                />
              </div>

              {/* 10-digit WhatsApp No. */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  10-digit WhatsApp No. *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10 digit mobile number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none bg-white font-medium font-mono"
                />
              </div>

              {/* Set Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Set Password * (कम से कम 8 characters)
                  </label>
                  <span className={`text-[10px] font-bold ${passStrength.color}`}>
                    Password strength: {passStrength.label}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none bg-white pr-10 font-mono tracking-widest"
                  />
                  <div className="absolute right-3 top-2.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Address * (House / Village / City / District / State / PIN)
                </label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House / Village / City / District / State / PIN"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none bg-white resize-none"
                />
              </div>

              {/* Sponsor Name & ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Sponsor Name (यदि किसी ने refer किया है)
                  </label>
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="उदा. राहुल कुमार"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Sponsor ID (उदा. IOIS10RK01)
                  </label>
                  <input
                    type="text"
                    value={sponsorId}
                    onChange={(e) => setSponsorId(e.target.value)}
                    placeholder="उदा. IOIS10RK01"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none bg-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* 📸 DIGITAL ID CARD PROFILE PHOTO & PERSONAL QR / PROFILE LINK */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-white border-2 border-blue-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center text-xs shadow-xs">
                      <Camera className="w-4 h-4" />
                    </span>
                    <span className="font-black text-xs text-[#0f172a]">
                      डिजिटल ID कार्ड प्रोफाइल फोटो व पर्सनल QR इमेज
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    आईडी कार्ड व डैशबोर्ड हेतु
                  </span>
                </div>

                {/* Profile Photo Uploader / URL */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1e3a8a] shadow-inner bg-slate-100 flex items-center justify-center relative">
                      {profilePhotoPreview ? (
                        <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold mt-1">आईडी कार्ड फोटो</span>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      अपनी प्रोफाइल फोटो चुनें (या लिंक दर्ज करें)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>गैलरी / फाइल से फोटो चुनें</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleProfilePhotoUpload(e)}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">या</span>
                      <input
                        type="url"
                        value={profilePhotoUrl}
                        onChange={(e) => {
                          setProfilePhotoUrl(e.target.value);
                          setProfilePhotoPreview(e.target.value);
                        }}
                        placeholder="https://... फोटो URL"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-mono"
                      />
                    </div>
                    {profilePhotoName && (
                      <span className="text-[10px] text-emerald-600 font-bold block truncate">
                        ✓ चुनी गई फोटो: {profilePhotoName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Personal QR Code / Profile Link */}
                <div className="pt-2 border-t border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>पर्सनल QR कोड इमेज या प्रोफाइल पता (Link / UPI):</span>
                    </label>
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setPersonalQrType('image')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${personalQrType === 'image' ? 'bg-[#1e3a8a] text-white shadow-2xs' : 'bg-slate-200 text-slate-700'}`}
                      >
                        QR इमेज
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonalQrType('link')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${personalQrType === 'link' ? 'bg-[#1e3a8a] text-white shadow-2xs' : 'bg-slate-200 text-slate-700'}`}
                      >
                        लिंक / UPI
                      </button>
                    </div>
                  </div>

                  {personalQrType === 'image' ? (
                    <div className="flex items-center gap-3">
                      <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>पर्सनल QR इमेज अपलोड</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePersonalQrUpload(e)}
                        />
                      </label>
                      {personalQrPreview ? (
                        <div className="flex items-center gap-2">
                          <img src={personalQrPreview} alt="QR Preview" className="w-9 h-9 object-contain rounded border border-slate-300 bg-white p-0.5" />
                          <span className="text-[10px] text-emerald-600 font-bold truncate">{personalQrName || 'QR सक्रिय'}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">अपना UPI QR या ID QR अपलोड करें (आईडी कार्ड के पीछे दिखेगा)</span>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={personalProfileLink}
                      onChange={(e) => setPersonalProfileLink(e.target.value)}
                      placeholder="उदा. अपना UPI ID (8877490845@spicepay) या व्यक्तिगत प्रोफाइल पता"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-mono"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पीछे</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>अगला चरण: पेआउट विवरण दें (Step 3: Withdrawal Details)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================= */}
          {/* STEP 3: Withdrawal / Payment Receiving Details */}
          {/* ============================================================= */}
          {currentStep === 3 && (
            <form onSubmit={handleNextStep3} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>3. Withdrawal / Payment Receiving Details</span>
                </div>
                <p className="text-slate-600">
                  Income प्राप्त करने के लिए अपना valid payment address दें।
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                  ⚠️ <strong>सूचना:</strong> केवल अपना स्वयं का valid UPI ID / bank receiving details दें। गलत payment details देने पर payout में समस्या हो सकती है।
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Your Withdrawal UPI ID / Bank Details *
                </label>
                <input
                  type="text"
                  required
                  value={withdrawalUpi}
                  onChange={(e) => setWithdrawalUpi(e.target.value)}
                  placeholder="Example: yourname@upi OR Bank A/C + IFSC"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none bg-white font-mono text-xs font-bold"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  उदा: 9876543210@paytm, 8877490845@ybl, अथवा SBI A/C 2049102948 IFSC SBIN0001234
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पीछे</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>अगला चरण: भुगतान करें (Step 4: IOIS Payment)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================= */}
          {/* STEP 4: IOIS Payment */}
          {/* ============================================================= */}
          {currentStep === 4 && (
            <form onSubmit={handleNextStep4} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h4 className="font-black text-sm text-slate-900 mb-1">
                  4. IOIS Payment
                </h4>
                <p className="text-slate-600">
                  Selected plan की payment करें। Payment केवल official IOIS payment address पर करें और payment proof upload करें।
                </p>
              </div>

              {/* Plan Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Selected Membership</span>
                  <span className="font-black text-sm text-slate-900">{currentPlan.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">देय राशि (Payable)</span>
                  <span className="font-black text-xl text-[#1e3a8a]">₹{currentPlan.price}</span>
                </div>
              </div>

              {/* Official UPI Box */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-300 space-y-3">
                <span className="font-bold text-slate-700 block">
                  IOIS Official UPI ID:
                </span>
                <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-300">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    8877490845@spicepay
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3 py-1.5 bg-[#1e3a8a] text-white hover:bg-blue-900 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'कॉपी हुआ' : 'Copy'}</span>
                  </button>
                </div>

                {/* Real Dynamic Scannable UPI QR Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-blue-200 text-center space-y-3">
                  <div className="space-y-0.5">
                    <span className="font-black text-slate-900 block text-xs">
                      IOIS आधिकारिक UPI QR कोड (Scan & Pay ₹{currentPlan.price})
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      PhonePe, Google Pay, Paytm, BHIM, Cred या किसी भी UPI ऐप से स्कैन करें
                    </span>
                  </div>

                  <div className="inline-block p-2.5 bg-white rounded-2xl border-2 border-slate-300 shadow-md">
                    <img 
                      src={upiQrImageUrl} 
                      alt={`IOIS Official Payment QR Code - ₹${currentPlan.price}`} 
                      className="w-44 h-44 sm:w-48 sm:h-48 mx-auto object-contain rounded-lg"
                      loading="eager"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <a
                      href={upiIntentString}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition-colors"
                    >
                      <span>⚡ मोबाइल UPI ऐप से सीधे ₹{currentPlan.price} पे करें</span>
                    </a>
                    <span className="text-[10px] text-slate-500 block">
                      (भुगतान के तुरंत बाद बैंक से प्राप्त 12-अंकों का UTR नंबर नीचे दर्ज करें)
                    </span>
                  </div>
                </div>
              </div>

              {/* UTR / Transaction ID Input */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  भुगतान का UTR / Transaction ID (12 अंक) *
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="उदा. UPI123456789 या बैंक से मिला UTR"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none bg-white font-mono text-xs font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पीछे</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>अगला चरण: डाक्यूमेंट्स अपलोड करें (Step 5: Verification Docs)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================= */}
          {/* STEP 5: Payment Verification Documents */}
          {/* ============================================================= */}
          {currentStep === 5 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h4 className="font-black text-sm text-slate-900 mb-1">
                  5. Payment Verification Documents
                </h4>
                <p className="text-slate-600">
                  Payment verification के लिए documents upload करें।
                </p>
              </div>

              {/* Payment Screenshot */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Payment Screenshot * (Payment successful होने के बाद screenshot upload करें)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setScreenshotFile, setScreenshotName)}
                    />
                  </label>
                  <span className="text-[11px] text-slate-500 truncate">
                    {screenshotName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Payment Address Proof */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Payment Address Proof * (UPI QR / Bank Passbook / Bank Account Proof)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setAddressProofFile, setAddressProofName)}
                    />
                  </label>
                  <span className="text-[11px] text-slate-500 truncate">
                    {addressProofName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Self Declaration Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 shrink-0"
                />
                <span className="text-[11px] text-amber-950 font-medium leading-relaxed">
                  मैं पुष्टि करता/करती हूँ कि मैंने अपनी जानकारी सही दी है, selected plan और payment details को समझा है, और गलत जानकारी देने की स्थिति में verification/approval प्रभावित हो सकता है।
                </span>
              </label>

              {/* Final Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पीछे</span>
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 hover:brightness-105 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide uppercase"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'सत्यापित किया जा रहा है...' : 'CREATE IOIS MEMBER ACCOUNT'}
                  </span>
                </button>
              </div>
            </form>
          )}
          </>
          )}

        </div>

        {/* Footer Link: Already registered? Login here */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 text-center shrink-0">
          <p className="text-xs text-slate-600">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="text-[#1e3a8a] font-black underline hover:text-blue-900 ml-1"
            >
              Login here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegistrationModal;
