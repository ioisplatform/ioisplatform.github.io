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
  UserPlus
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

  if (!isOpen) return null;

  const handleCopySponsorId = async () => {
    try {
      await navigator.clipboard.writeText(sponsorId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } catch {}
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

          {/* Sponsor ID Highlight Box with 1-Click Copy */}
          <div className="inline-flex items-center gap-3 p-2 px-4 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-inner">
            <span className="text-xs text-slate-400 font-bold">आधिकारिक Sponsor ID:</span>
            <span className="font-mono text-base font-black text-amber-300 tracking-wider">
              {sponsorId}
            </span>
            <button
              type="button"
              onClick={handleCopySponsorId}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                copiedId
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              {copiedId ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'कॉपी हो गया!' : 'Sponsor ID कॉपी करें'}</span>
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
