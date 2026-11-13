import React, { useState } from 'react';
import { UserProfile } from '../types';
import { forceUpdatePasswordAsync } from '../services/userService';
import { ShieldCheck, LockKeyhole, Eye, EyeOff, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ForcePasswordUpdateModalProps {
  user: UserProfile;
  onUpdated: (updatedUser: UserProfile) => void;
}

export const ForcePasswordUpdateModal: React.FC<ForcePasswordUpdateModalProps> = ({
  user,
  onUpdated,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = newPassword.trim();
    if (trimmed.length < 6) {
      setError('नया गोपनीय पासवर्ड कम से कम 6 अक्षरों/अंकों का होना अनिवार्य है।');
      return;
    }
    if (trimmed !== confirmPassword.trim()) {
      setError('दोनों पासवर्ड मेल नहीं खा रहे हैं। कृपया एक समान पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      const currentTemp = user.password || '';
      const res = await forceUpdatePasswordAsync(user.userId, currentTemp, trimmed);
      if (!res.success || !res.user) {
        setError(res.error || 'पासवर्ड अपडेट नहीं हो सका। कृपया पुनः प्रयास करें।');
        return;
      }
      onUpdated(res.user);
    } catch (err: any) {
      setError(err?.message || 'सर्वर से कनेक्ट होने में त्रुटि आई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1150] bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border-2 border-emerald-500/60 shadow-[0_0_45px_rgba(16,185,129,0.25)] overflow-hidden my-auto">
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 px-4 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
              पहला लॉगिन सुरक्षा कदम • MANDATORY
            </p>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              अपना नया गोपनीय पासवर्ड सेट करें
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-slate-200">
          <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/40 p-3 text-xs leading-relaxed text-emerald-100 space-y-1">
            <p className="font-bold text-white">
              नमस्ते {user.fullName} ({user.userId}) 👋
            </p>
            <p>
              आपका खाता आपके स्पॉन्सर {user.registeredBySponsorId ? `(${user.registeredBySponsorId})` : ''} द्वारा बनाया गया है।{' '}
              <strong className="text-amber-300">
                सुरक्षा के लिए अभी अपना नया पासवर्ड बदलना अनिवार्य है
              </strong>{' '}
              ताकि स्पॉन्सर या कोई अन्य व्यक्ति आपकी ID दोबारा लॉगिन न कर सके।
            </p>
          </div>

          <div className="rounded-xl bg-amber-950/40 border border-amber-500/40 p-2.5 flex items-start gap-2 text-[11px] text-amber-200 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              अपना पासवर्ड, OTP या PIN कभी किसी स्पॉन्सर, Admin, टीम अधिकारी या Official HELPLINE पर भी साझा न करें।
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              नया गोपनीय पासवर्ड (कम से कम 6 अक्षर)
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="मजबूत नया पासवर्ड लिखें..."
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-800 border border-slate-600 focus:border-emerald-400 text-white text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              पासवर्ड की पुष्टि करें (Confirm New Password)
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="वही नया पासवर्ड दोबारा लिखें..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-emerald-400 text-white text-sm outline-none"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs font-bold text-rose-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-60 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
          >
            {loading ? (
              <span>सुरक्षित अपडेट हो रहा है...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>पासवर्ड सुरक्षित अपडेट करें</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
            <LockKeyhole className="w-3 h-3 text-emerald-400" />
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>अपडेट होते ही स्पॉन्सर का एक्सेस स्थायी रूप से बंद हो जाएगा</span>
          </p>
        </form>
      </div>
    </div>
  );
};
