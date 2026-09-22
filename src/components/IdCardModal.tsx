import React from 'react';
import { UserProfile } from '../types';
import { IDCardGenerator } from './IDCardGenerator';
import { CreditCard, X, ShieldCheck } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-5xl rounded-3xl p-4 sm:p-6 shadow-[0_25px_80px_rgba(245,158,11,0.25)] relative text-white my-4 max-h-[94vh] overflow-y-auto">
        
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
        <div className="text-center space-y-1.5 mb-5 pr-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>IOIS OFFICIAL SMART DIGITAL ID CARD</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            स्मार्ट डिजिटल पहचान पत्र (Digital ID Card Studio)
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            {user 
              ? 'आगे-पीछे का भाग, आड़ा (Landscape) व खड़ा (Portrait), विवरण मास्किंग, कस्टम QR कोड व हाई-क्वालिटी PDF/PNG/JPG डाउनलोड' 
              : 'नमूना ID कार्ड स्टूडियो। अपना व्यक्तिगत ID कार्ड प्राप्त करने व एक्टिवेट करने हेतु रजिस्टर करें।'}
          </p>
        </div>

        {/* Full ID Card Studio inside Modal */}
        <div className="pt-2">
          <IDCardGenerator
            currentUser={user}
            onOpenRegister={onOpenRegister}
            isModalMode={true}
          />
        </div>

        {/* Unauthenticated Footer Prompt */}
        {!user && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-400 block">
                क्या आप अपना व्यक्तिगत 256-Bit एन्क्रिप्टेड ID कार्ड पाना चाहते हैं?
              </span>
              <span className="text-[11px] text-slate-400 block">
                मात्र 2 मिनट में रजिस्ट्रेशन करें और अपनी चयनित सेवा अनुसार आधिकारिक कार्ड पाएं।
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase transition cursor-pointer shadow-md"
              >
                नया रजिस्ट्रेशन करें →
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer border border-slate-700"
              >
                लॉगिन
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
