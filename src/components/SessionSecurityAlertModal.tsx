import React from 'react';
import { ShieldAlert, Smartphone, LockKeyhole, KeyRound, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SessionSecurityAlertModalProps {
  isOpen: boolean;
  newDevice?: string;
  newLoginAt?: string;
  onChangePassword: () => void;
  onClose: () => void;
}

export const SessionSecurityAlertModal: React.FC<SessionSecurityAlertModalProps> = ({
  isOpen,
  newDevice,
  newLoginAt,
  onChangePassword,
  onClose,
}) => {
  if (!isOpen) return null;

  const formattedTime = newLoginAt
    ? new Date(newLoginAt).toLocaleString('hi-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'अभी-अभी';

  return (
    <div
      className="fixed inset-0 z-[1200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 border-2 border-rose-500/60 shadow-[0_0_50px_rgba(244,63,94,0.35)] overflow-hidden my-auto">
        {/* Top Critical Security Banner */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-amber-600 px-4 py-3.5 sm:px-5 sm:py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 animate-pulse">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-200">
              सुरक्षा चेतावनी • AUTO SESSION LOGOUT
            </p>
            <h2 className="text-base sm:text-lg font-black text-white leading-snug">
              नए डिवाइस में लॉगिन होने के कारण लॉग आउट किया गया
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3.5 text-slate-200">
          {/* Required Exact Hindi Message */}
          <div className="rounded-xl bg-rose-950/60 border border-rose-500/50 p-3.5 sm:p-4 space-y-2.5">
            <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
              आपके नए डिवाइस में लॉगिन करने की वजह से इस वर्तमान डिवाइस से आपका खाता स्वचालित रूप से लॉग आउट (Log Out) हो गया है।
            </p>
            <p className="text-xs sm:text-sm font-semibold text-amber-200 leading-relaxed">
              ✅ यदि वह लॉगिन आपने स्वयं किया था, तो कोई बात नहीं — चिंता की कोई बात नहीं है।
            </p>
            <p className="text-xs sm:text-sm font-black text-rose-200 leading-relaxed">
              ⚠️ अन्यथा यदि आप नहीं थे, तो तुरंत अपना पासवर्ड बदलें!
            </p>
          </div>

          {/* Device Info */}
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-bold min-w-0">
              <Smartphone className="w-4 h-4 shrink-0" />
              <span className="truncate">नया डिवाइस: {newDevice || 'नया मोबाइल / ब्राउज़र'}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">{formattedTime}</span>
          </div>

          {/* Zero-Trust Privacy Rule Warning */}
          <div className="rounded-xl bg-amber-950/45 border-2 border-amber-500/50 p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-black text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>अति-आवश्यक सुरक्षा नियम (अपनी गोपनीयता अपने हाथ में रखें)</span>
            </div>
            <p className="text-xs text-amber-100 leading-relaxed font-semibold">
              अपना <strong className="text-white">पासवर्ड, OTP या PIN</strong> किसी के साथ भी साझा न करें —{' '}
              <strong className="text-rose-300">
                Official Team, Admin या किसी भी अधिकारी के साथ भी नहीं!
              </strong>{' '}
              आधिकारिक <strong className="text-cyan-300">Official HELP LINE</strong> पर भी कोई OTP, PIN या पासवर्ड बिल्कुल साझा न करें। अपनी प्राइवेसी अपने हाथ में सुरक्षित रखें।
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={onChangePassword}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>पासवर्ड अभी बदलें</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>ठीक है (मैं ही था / समझ गया)</span>
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
            <LockKeyhole className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>IOIS Single-Device Active Token Protection सक्रिय है</span>
          </p>
        </div>
      </div>
    </div>
  );
};
