import React, { useRef, useState } from 'react';
import { UserProfile } from '../types';
import { PLANS, OFFICIAL_PHONE } from '../data/plansData';
import { 
  CreditCard, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Lock,
  UserPlus
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface IdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenRegister,
  onOpenLogin,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  if (!isOpen) return null;

  const demoUser: UserProfile = user || {
    userId: 'IOIS999VK01',
    fullName: 'अतिथि सदस्य (Sample Card)',
    mobileNumber: '+91 9523218765',
    email: 'contact@iois.org.in',
    selectedPlanId: 7,
    role: 'Supreme Master Partner',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    paymentStatus: 'approved',
    createdAt: new Date().toISOString(),
  };

  const selectedPlan = PLANS.find((p) => p.id === demoUser.selectedPlanId) || PLANS[6];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#020617',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `IOIS_Digital_ID_${demoUser.userId}.png`;
      link.href = dataUrl;
      link.click();
      setIsDownloading(false);
    } catch {
      setIsDownloading(false);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(demoUser.userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_rgba(245,158,11,0.25)] relative text-white my-6 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition z-10"
          title="बंद करें"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-4 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL 256-BIT ENCRYPTED DIGITAL ID</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            स्मार्ट डिजिटल पहचान पत्र (Digital ID Card)
          </h3>
          <p className="text-[11px] text-slate-400">
            {user ? 'आपका सत्यापित आधिकारिक IOIS पहचान पत्र' : 'नमूना पहचान पत्र (अपना ID कार्ड पाने के लिए रजिस्टर करें)'}
          </p>
        </div>

        {/* ID Card Display */}
        <div className="flex justify-center p-2">
          <div 
            ref={cardRef}
            className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B1329] to-slate-950 border-2 border-amber-400 p-4 shadow-2xl relative overflow-hidden text-white space-y-3.5"
          >
            {/* Hologram Gradient Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-500/40 pb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-black text-[10px] text-amber-400">
                    IOIS
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black tiranga-text leading-tight">IOIS DIGITAL NETWORK</h4>
                  <span className="text-[7.5px] text-amber-300 uppercase tracking-widest block">Govt Compliant Identity</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[8px] font-black">
                {demoUser.paymentStatus === 'approved' ? 'VERIFIED' : 'ACTIVE'}
              </span>
            </div>

            {/* Body */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-800 shadow-md">
                <img src={demoUser.photoUrl} alt={demoUser.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h5 className="text-base font-black text-white truncate">{demoUser.fullName}</h5>
                <div className="text-xs text-amber-300 font-mono font-black tracking-wide">
                  ID: {demoUser.userId}
                </div>
                <div className="text-[10px] text-slate-300 font-medium truncate">{demoUser.role}</div>
                <div className="text-[9px] text-emerald-400 font-semibold">{selectedPlan.name} • ₹{selectedPlan.price}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[8.5px] text-slate-300 relative z-10">
              <div className="space-y-0.5">
                <div>मोबाइल: {demoUser.mobileNumber.slice(0, 4)}XXXX{demoUser.mobileNumber.slice(-2)}</div>
                <div>स्पॉन्सर कोड: {demoUser.sponsorId || 'IOIS999VK01'}</div>
                <div className="text-amber-400 font-mono text-[8px]">SECURITY ENCRYPTION: 256-BIT SHA</div>
              </div>
              <div className="w-13 h-13 bg-white rounded-lg p-0.5 flex items-center justify-center shrink-0 shadow-md">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Fiois.org.in%2Fverify%3Fid%3D${demoUser.userId}`} 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'डाउनलोडिंग...' : 'HD PNG डाउनलोड'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyId}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs uppercase flex items-center justify-center gap-1.5 border border-amber-500/40 transition cursor-pointer"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copiedId ? 'कॉपी हुआ!' : 'User ID कॉपी करें'}</span>
            </button>
          </div>

          {!user && (
            <div className="pt-2 border-t border-slate-800 text-center space-y-2">
              <span className="text-xs text-slate-400 block">
                अपना व्यक्तिगत डिजिटल ID कार्ड एक्टिवेट करने हेतु:
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase transition cursor-pointer shadow-md"
                >
                  नया रजिस्ट्रेशन करें →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer border border-slate-700"
                >
                  लॉगिन करें
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
