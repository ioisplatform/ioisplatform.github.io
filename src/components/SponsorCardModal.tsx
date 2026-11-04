import React, { useState } from 'react';
import { UserProfile } from '../types';
import { IDCardGenerator } from './IDCardGenerator';
import { 
  ShieldCheck, 
  UserCheck, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  UserPlus,
  Share2,
  Send,
  ExternalLink
} from 'lucide-react';

interface SponsorCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorUser: UserProfile | null;
  sponsorId: string;
  onOpenRegisterWithSponsor: (sponsorId: string) => void;
  currentUser: UserProfile | null;
}

export const SponsorCardModal: React.FC<SponsorCardModalProps> = ({
  isOpen,
  onClose,
  sponsorUser,
  sponsorId,
  onOpenRegisterWithSponsor,
  currentUser,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const sponsorUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?sponsor=${encodeURIComponent(sponsorId)}`
    : `https://ioisplatform.github.io/?sponsor=${encodeURIComponent(sponsorId)}`;

  const handleCopySponsorId = async () => {
    try {
      await navigator.clipboard.writeText(sponsorId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } catch {}
  };

  const handleCopySponsorLink = async () => {
    try {
      await navigator.clipboard.writeText(sponsorUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleShareWhatsApp = () => {
    const text = `🇮🇳 *भारतीय ऑनलाइन शिक्षा एवं स्वावलंबन मिशन (IOIS)* 📚\n\nसत्यापित स्पॉन्सर: *${sponsorUser?.fullName || 'Official Sponsor'}* (ID: *${sponsorId}*)\n\n👉 *इस स्पॉन्सर के तहत सीधे रजिस्टर करने के लिए लिंक खोलें:*\n${sponsorUrl}\n\n🏷️ *Sponsor ID:* ${sponsorId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-4xl rounded-3xl p-4 sm:p-6 shadow-[0_25px_80px_rgba(245,158,11,0.25)] relative text-white my-4 max-h-[95vh] overflow-y-auto space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition z-20 border border-slate-700 shadow-md"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pr-8 sm:pr-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>सत्यापित स्पॉन्सर आमंत्रण (VERIFIED SPONSOR INVITATION)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            आपको IOIS मिशन में आमंत्रित किया गया है!
          </h3>

          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            नीचे आपके आधिकारिक स्पॉन्सर का सत्यापित डिजिटल पहचान पत्र है। सुरक्षा व गोपनीयता नीति के तहत व्यक्तिगत जानकारी मास्क्ड है, जबकि यूनिक <strong>User ID</strong> स्पष्ट रूप से उपलब्ध है।
          </p>

          {/* Action Pills: Copy ID, Copy Link, WhatsApp Share */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            {/* Sponsor ID Highlight Box with 1-Click Copy */}
            <div className="inline-flex items-center gap-2.5 p-1.5 px-3 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-inner">
              <span className="text-xs text-slate-400 font-bold">Sponsor ID:</span>
              <span className="font-mono text-sm font-black text-amber-300 tracking-wider">
                {sponsorId}
              </span>
              <button
                type="button"
                onClick={handleCopySponsorId}
                className={`px-2.5 py-1 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-sm ${
                  copiedId
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {copiedId ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? 'कॉपी हुआ!' : 'ID कॉपी'}</span>
              </button>
            </div>

            {/* Copy Full Sponsor Link Button */}
            <button
              type="button"
              onClick={handleCopySponsorLink}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm border ${
                copiedLink
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                  : 'bg-slate-950 hover:bg-slate-800 text-sky-300 border-sky-500/40'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'स्पॉन्सर लिंक कॉपी करें'}</span>
            </button>

            {/* Direct WhatsApp Share */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp पर भेजें</span>
            </button>
          </div>
        </div>

        {/* Render Privacy-Protected ID Card */}
        <div className="pt-2">
          <IDCardGenerator
            currentUser={currentUser}
            targetUser={sponsorUser}
            isSponsorPreview={true}
            onOpenRegister={() => {
              onClose();
              onOpenRegisterWithSponsor(sponsorId);
            }}
            isModalMode={true}
          />
        </div>

        {/* Bottom Call-to-Action Bar */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300 text-center sm:text-left">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              इस स्पॉन्सर के तहत जुड़ने पर आपको <strong>50% से 70% इंस्टेंट पेआउट</strong> व संपूर्ण डिजिटल बुक्स किट प्राप्त होगी।
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRegisterWithSponsor(sponsorId);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>इस स्पॉन्सर के साथ अभी रजिस्टर करें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
