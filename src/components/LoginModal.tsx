import React, { useState } from 'react';
import { MemberProfile } from '../types';
import { 
  authenticateStudent, 
  recoverUserCredentials, 
  resetUserPassword 
} from '../services/userService';
import { 
  X, 
  UserCheck, 
  Lock, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Copy,
  Check,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (member: MemberProfile) => void;
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenRegister
}) => {
  const [viewMode, setViewMode] = useState<'login' | 'forgot'>('login');

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot Password / ID Recovery State
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveredUser, setRecoveredUser] = useState<MemberProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [copiedRecoveredId, setCopiedRecoveredId] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPendingNotice(null);

    if (!identifier.trim()) {
      setError('कृपया अपना User ID (उदा. IOIS10RK01), मोबाइल नंबर या ईमेल दर्ज करें।');
      return;
    }

    if (!password) {
      setError('कृपया अपना पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateStudent(identifier, password);
      setLoading(false);

      if (res.success && res.member) {
        onSuccess(res.member);
      } else if (res.isPending) {
        setPendingNotice(res.message);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setLoading(false);
      setError('लॉगिन के दौरान समस्या आई। कृपया पुनः प्रयास करें।');
    }
  };

  const handleFindAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccessMsg('');
    setRecoveredUser(null);

    setRecoveryLoading(true);
    try {
      const res = await recoverUserCredentials(recoveryPhone, recoveryEmail);
      setRecoveryLoading(false);
      if (res.success && res.member) {
        setRecoveredUser(res.member);
      } else {
        setRecoveryError(res.message);
      }
    } catch {
      setRecoveryLoading(false);
      setRecoveryError('खाता खोजने में समस्या आई। कृपया पुनः प्रयास करें।');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveredUser) return;
    setRecoveryError('');
    setRecoverySuccessMsg('');

    if (newPassword.length < 8) {
      setRecoveryError('सुरक्षा कारणों से नया पासवर्ड कम से कम 8 अक्षरों का होना अनिवार्य है।');
      return;
    }

    setRecoveryLoading(true);
    const res = await resetUserPassword(recoveredUser.memberId, newPassword);
    setRecoveryLoading(false);

    if (res.success) {
      setRecoverySuccessMsg('पासवर्ड सफलतापूर्वक अपडेट हो गया! अब आप नीचे दिए गए बटन से तुरंत लॉगिन कर सकते हैं।');
      setIdentifier(recoveredUser.rollNumber || recoveredUser.memberId);
      setPassword(newPassword);
    } else {
      setRecoveryError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn font-sans">
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Tricolor Ribbon on top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white via-blue-800 to-emerald-600" />

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0f172a] to-blue-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-black shadow">
              {viewMode === 'login' ? <UserCheck className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">
                {viewMode === 'login' ? 'विद्यार्थी लॉगिन (Student Login)' : 'User ID / पासवर्ड रिकवरी'}
              </h3>
              <p className="text-xs text-[#f3e5ab]">
                {viewMode === 'login' ? 'अपनी अधिकृत किट, स्टडी रूम व ID कार्ड में प्रवेश करें' : 'डेटाबेस से अपनी User ID खोजें व पासवर्ड रीसेट करें'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================= */}
        {/* VIEW 1: NORMAL LOGIN FORM */}
        {/* ============================================================= */}
        {viewMode === 'login' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
            
            <div className="space-y-1">
              <label className="font-bold text-slate-700">
                User ID, मोबाइल नंबर या ईमेल *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="उदा. IOIS10RK01 या 8877490845"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none text-xs bg-slate-50 font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">
                  पासवर्ड (Password) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('forgot');
                    setError('');
                    setPendingNotice(null);
                  }}
                  className="text-[11px] font-black text-[#1e3a8a] hover:underline"
                >
                  User ID / पासवर्ड भूल गए?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none text-xs bg-slate-50 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Strict Pending Verification Notice Gate */}
            {pendingNotice && (
              <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-900">
                  <span className="text-base">⏳</span>
                  <span>सुरक्षा सूचना: खाता सत्यापन लंबित है!</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {pendingNotice}
                </p>
                <div className="text-[10px] text-amber-800 bg-amber-100/70 p-2 rounded-lg font-medium">
                  💡 <strong>नोट:</strong> जैसे ही एडमिन द्वारा आपके पेमेंट स्क्रीनशॉट की जांच पूरी होगी, आप इसी पासवर्ड से सीधे लॉगिन कर सकेंगे।
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
              <strong>उच्च सुरक्षा नियम:</strong> केवल एडमिन द्वारा सत्यापित (Active) खातों को ही उनके संबंधित प्लान की किट का सीधा एक्सेस मिलता है।
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'सत्यापित किया जा रहा है...' : 'लॉगिन करें और किट खोलें'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-slate-500">अभी तक पंजीकृत नहीं हैं? </span>
              <button
                type="button"
                onClick={onOpenRegister}
                className="text-[#1e3a8a] font-black underline hover:text-blue-950"
              >
                यहाँ नया खाता बनाएं (@ ₹10)
              </button>
            </div>

          </form>
        ) : (
          /* ============================================================= */
          /* VIEW 2: FORGOT USER ID & PASSWORD RECOVERY FORM */
          /* ============================================================= */
          <div className="p-6 space-y-4 text-xs overflow-y-auto">
            
            <div className="flex items-center justify-between pb-2 border-b">
              <button
                type="button"
                onClick={() => {
                  setViewMode('login');
                  setRecoveredUser(null);
                  setRecoveryError('');
                  setRecoverySuccessMsg('');
                }}
                className="font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>वापस लॉगिन पर जाएं</span>
              </button>
              <span className="text-[11px] text-slate-500 font-bold">डेटाबेस रिकवरी</span>
            </div>

            {/* Step A: Find Account by Phone & Email */}
            {!recoveredUser ? (
              <form onSubmit={handleFindAccount} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-slate-100 text-slate-700 leading-relaxed text-[11px]">
                  अपना पंजीकृत <strong>10-अंकों का मोबाइल नंबर</strong> और <strong>ईमेल</strong> दर्ज करें। सिस्टम डेटाबेस से मिलान करके आपकी User ID खोजेगा।
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    पंजीकृत मोबाइल नंबर (Registered Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={recoveryPhone}
                    onChange={(e) => setRecoveryPhone(e.target.value)}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    पंजीकृत ईमेल आईडी (Registered Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none"
                  />
                </div>

                {recoveryError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{recoveryLoading ? 'डेटाबेस में खोजा जा रहा है...' : 'खाता विवरण खोजें (Find My Account)'}</span>
                </button>
              </form>
            ) : (
              /* Step B: Account Found - Show User ID and Allow Password Reset */
              <div className="space-y-4">
                
                {/* User ID Highlight Card */}
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-900">
                      ✓ खाता मिल गया (Account Found)
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-black ${
                      recoveredUser.status === 'Active' ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-200 text-amber-950'
                    }`}>
                      {recoveredUser.status === 'Active' ? 'सक्रिय (Active)' : 'सत्यापन लंबित (Pending)'}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-black text-base text-slate-900">{recoveredUser.name}</h5>
                    <p className="text-[11px] text-slate-600">प्लान: {recoveredUser.planName || 'IOIS Plan'}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-300 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">आपकी आधिकारिक USER ID:</span>
                      <span className="text-lg font-mono font-black text-[#1e3a8a]">
                        {recoveredUser.rollNumber || recoveredUser.memberId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(recoveredUser.rollNumber || recoveredUser.memberId);
                        setCopiedRecoveredId(true);
                        setTimeout(() => setCopiedRecoveredId(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-[#1e3a8a] text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedRecoveredId ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRecoveredId ? 'कॉपी हुआ' : 'Copy ID'}</span>
                    </button>
                  </div>
                </div>

                {/* Reset Password Form */}
                <form onSubmit={handleResetPassword} className="space-y-3 pt-1">
                  <label className="font-bold text-slate-800 block">
                    नया पासवर्ड सेट करें (Set New Password) *
                  </label>
                  
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="कम से कम 8 अक्षरों का नया पासवर्ड"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1e3a8a] outline-none font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {recoveryError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{recoveryError}</span>
                    </div>
                  )}

                  {recoverySuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{recoverySuccessMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{recoveryLoading ? 'अपडेट हो रहा है...' : 'नया पासवर्ड सुरक्षित करें (Save New Password)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('login');
                      setRecoveredUser(null);
                    }}
                    className="w-full py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>लॉगिन पेज पर जाएं (Back to Login)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default LoginModal;
