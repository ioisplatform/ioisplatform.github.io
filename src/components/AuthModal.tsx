import React, { useState } from 'react';
import { UserProfile } from '../types';
import { loginUserAsync, findUserByMobile, getAllUsers, saveUsers } from '../services/userService';
import { Lock, User, Phone, Mail, ArrowRight, KeyRound, CheckCircle2, AlertCircle, HelpCircle, Shield, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
  initialMode?: 'login' | 'forgot_user_id' | 'forgot_password';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  onSwitchToRegister,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'forgot_user_id' | 'forgot_password'>(initialMode);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Forgot User ID state
  const [forgotMobile, setForgotMobile] = useState<string>('');
  const [recoveredUserId, setRecoveredUserId] = useState<string | null>(null);

  // Forgot Password state
  const [resetUserId, setResetUserId] = useState<string>('');
  const [resetMobile, setResetMobile] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Status & errors
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('कृपया अपना User ID, मोबाइल नंबर या ईमेल दर्ज करें।');
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
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('लॉगिन करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    }
  };

  const handleRecoverUserId = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setRecoveredUserId(null);

    const cleanDigits = forgotMobile.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMsg('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/users/recover-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: forgotMobile }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success && data.userId) {
        setRecoveredUserId(data.userId);
        return;
      }
    } catch (e) {
      // Fallback to local
    }

    setIsLoading(false);
    const user = findUserByMobile(forgotMobile);
    if (user) {
      setRecoveredUserId(user.userId);
    } else {
      setErrorMsg('इस मोबाइल नंबर से कोई खाता नहीं मिला। कृपया सही नंबर डालें या नया रजिस्ट्रेशन करें।');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResetSuccessMsg(null);

    if (!newPassword || newPassword.length < 4) {
      setErrorMsg('नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: resetUserId, mobile: resetMobile, newPassword }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        setResetSuccessMsg(data.message || 'पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।');
        return;
      } else {
        setErrorMsg(data.error || 'User ID और मोबाइल नंबर मैच नहीं हुए।');
        return;
      }
    } catch (e) {
      // Fallback
    }

    setIsLoading(false);
    const users = getAllUsers();
    const cleanDigits = resetMobile.replace(/\D/g, '');
    const userIndex = users.findIndex(
      (u) => 
        u.userId.toLowerCase() === resetUserId.trim().toLowerCase() && 
        cleanDigits.length >= 10 && u.mobileNumber.replace(/\D/g, '').endsWith(cleanDigits.slice(-10))
    );

    if (userIndex === -1) {
      setErrorMsg('User ID और मोबाइल नंबर मैच नहीं हुए।');
      return;
    }

    users[userIndex].password = newPassword;
    saveUsers(users);
    setResetSuccessMsg(`पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(245,158,11,0.25)] relative text-white">
        
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
            <span>IOIS SECURE ACCESS</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {mode === 'login' && 'सदस्य लॉगिन (Member Login)'}
            {mode === 'forgot_user_id' && 'यूजर ID खोजें (Find User ID)'}
            {mode === 'forgot_password' && 'पासवर्ड रीसेट करें (Reset Password)'}
          </h3>
          <p className="text-xs text-slate-300">
            {mode === 'login' && 'अपने IOIS डैशबोर्ड और डिजिटल ID कार्ड में प्रवेश करें'}
            {mode === 'forgot_user_id' && 'अपना पंजीकृत मोबाइल नंबर दर्ज करके अपना User ID प्राप्त करें'}
            {mode === 'forgot_password' && 'सुरक्षित रूप से अपना नया पासवर्ड सेट करें'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
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
                  onClick={() => { setErrorMsg(''); setMode('forgot_password'); }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                >
                  पासवर्ड भूल गए?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="अपना पासवर्ड दर्ज करें"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>लॉगिन करें (LOGIN NOW)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Separate Button for Forgot User ID */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setMode('forgot_user_id'); }}
                className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>यूजर ID भूल गए? (Forgot ID)</span>
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

        {/* MODE 2: FORGOT USER ID */}
        {mode === 'forgot_user_id' && (
          <form onSubmit={handleRecoverUserId} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">पंजीकृत मोबाइल नंबर दर्ज करें:</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={forgotMobile}
                  onChange={(e) => setForgotMobile(e.target.value)}
                  placeholder="उदा. 9876543210"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition"
                />
              </div>
            </div>

            {recoveredUserId && (
              <div className="p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                <div className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>आपकी IOIS यूजर ID मिल गई है:</span>
                </div>
                <div className="text-xl font-black text-amber-300 tracking-wider font-mono bg-slate-950 py-2 rounded-xl border border-amber-400">
                  {recoveredUserId}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier(recoveredUserId);
                    setMode('login');
                  }}
                  className="text-xs bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded-xl hover:bg-amber-300 transition"
                >
                  इस ID से लॉगिन करें →
                </button>
              </div>
            )}

            {!recoveredUserId && (
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>मेरी User ID खोजें</span>
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

        {/* MODE 3: FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            {resetSuccessMsg ? (
              <div className="p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-emerald-300 font-bold text-xs">{resetSuccessMsg}</p>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setResetSuccessMsg(null); }}
                  className="w-full py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl hover:bg-amber-300 transition"
                >
                  अभी लॉगिन करें →
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">आपकी User ID:</label>
                  <input
                    type="text"
                    value={resetUserId}
                    onChange={(e) => setResetUserId(e.target.value)}
                    placeholder="उदा. IOIS10RK01"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">पंजीकृत मोबाइल नंबर:</label>
                  <input
                    type="text"
                    value={resetMobile}
                    onChange={(e) => setResetMobile(e.target.value)}
                    placeholder="उदा. 9876543210"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">नया पासवर्ड दर्ज करें:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="नया गुप्त पासवर्ड बनाएं"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>पासवर्ड अपडेट करें</span>
                </button>
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
          </form>
        )}

      </div>
    </div>
  );
};
