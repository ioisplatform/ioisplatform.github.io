import React from 'react';
import { UserProfile } from '../types';
import { UserDashboard } from './UserDashboard';
import { User, X } from 'lucide-react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUserUpdated: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenLogin?: () => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
  onOpenPublicProfile?: (userOrHandle: UserProfile | string) => void;
  initialDashboardTab?: 'referral' | 'idcard' | 'chat' | 'iois_chat' | 'posters' | 'marketing' | 'profile' | 'support';
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onLogout,
  onOpenLogin,
  onOpenSponsorAddMember,
  onOpenPublicProfile,
  initialDashboardTab,
}) => {
  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-md rounded-3xl p-5 sm:p-8 shadow-[0_20px_60px_rgba(245,158,11,0.25)] relative text-white text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer transition"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-400">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-white">सदस्य लॉगिन आवश्यक है</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              अपना डैशबोर्ड, IOIS CHAT & HELP, डिजिटल ID कार्ड और कमाई का विवरण देखने के लिए कृपया पहले लॉगिन करें।
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin?.();
              }}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase transition cursor-pointer shadow-md"
            >
              लॉगिन विंडो खोलें →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border-2 border-amber-500/40 w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(245,158,11,0.25)] relative text-white max-h-[94dvh] flex flex-col overflow-hidden">
        {/* Locked Top Modal Header Bar */}
        <div className="shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-xs sm:text-sm font-black text-amber-300 truncate">
              IOIS सदस्य प्रोफाइल व IOIS CHAT & HELP डैशबोर्ड
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-red-600 flex items-center justify-center cursor-pointer transition border border-slate-700 shadow-md shrink-0"
            title="बंद करें"
            aria-label="बंद करें"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Single Clean Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 sm:p-5 custom-scrollbar">
          <UserDashboard
            user={user}
            onUserUpdated={onUserUpdated}
            onLogout={() => {
              onLogout();
              onClose();
            }}
            onScrollToCard={onClose}
            onOpenSponsorAddMember={(planId) => {
              onClose();
              onOpenSponsorAddMember?.(planId);
            }}
            onOpenPublicProfile={(target) => {
              onOpenPublicProfile?.(target);
            }}
            initialDashboardTab={initialDashboardTab}
          />
        </div>
      </div>
    </div>
  );
};
