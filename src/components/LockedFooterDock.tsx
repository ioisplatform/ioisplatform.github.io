import React, { useState } from 'react';
import { UserProfile, PageType } from '../types';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  CreditCard, 
  LayoutDashboard, 
  Share2, 
  Sparkles, 
  HelpCircle, 
  ChevronUp, 
  ChevronDown, 
  Crown, 
  AlertCircle, 
  Check, 
  ExternalLink,
  Users,
  Compass,
  FileText
} from 'lucide-react';

interface LockedFooterDockProps {
  currentUser: UserProfile | null;
  sponsorId?: string;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenLogin: (mode?: 'login' | 'forgot_password' | 'forgot_user_id') => void;
  onOpenRegister: (planId?: number, sponsorId?: string) => void;
  onOpenDashboard: () => void;
  onOpenIdCard: () => void;
  onOpenSponsorCard?: () => void;
  onSetSponsorId?: (id: string) => void;
}

export const LockedFooterDock: React.FC<LockedFooterDockProps> = ({
  currentUser,
  sponsorId = '',
  currentPage,
  onNavigate,
  onOpenLogin,
  onOpenRegister,
  onOpenDashboard,
  onOpenIdCard,
  onOpenSponsorCard,
  onSetSponsorId,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showEnterSponsorDialog, setShowEnterSponsorDialog] = useState<boolean>(false);
  const [inputSponsorId, setInputSponsorId] = useState<string>('');
  const [sponsorNotice, setSponsorNotice] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const cleanSponsorId = sponsorId ? sponsorId.trim().toUpperCase() : '';
  const hasSponsor = Boolean(cleanSponsorId);
  const isLoggedIn = Boolean(currentUser);

  // Copy referral link helper for logged-in user
  const handleCopyReferral = async () => {
    if (!currentUser) return;
    const refLink = `${window.location.origin}/?ref=${currentUser.userId}&sponsor=${currentUser.userId}`;
    try {
      await navigator.clipboard.writeText(refLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleApplySponsor = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputSponsorId.trim().toUpperCase();
    if (!clean) return;
    if (onSetSponsorId) {
      onSetSponsorId(clean);
    }
    setSponsorNotice(`स्पॉन्सर कोड ${clean} सफलता से लिंक कर दिया गया है!`);
    setTimeout(() => {
      setShowEnterSponsorDialog(false);
      setSponsorNotice('');
      if (onOpenSponsorCard) {
        onOpenSponsorCard();
      }
    }, 1000);
  };

  return (
    <>
      {/* ================= FIXED LOCKED BOTTOM DOCK BAR ================= */}
      <aside 
        id="locked-footer-dock"
        aria-label="Locked Navigation Dock"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/98 backdrop-blur-2xl border-t-2 border-amber-500/40 shadow-[0_-10px_35px_rgba(0,0,0,0.85)] transition-all"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
          
          {/* Dock Top Status & Toggle Bar */}
          <div className="py-1.5 flex items-center justify-between gap-2 border-b border-slate-900 text-[11px]">
            
            {/* Dynamic Status Pill: Based on 3 states */}
            <div className="flex items-center gap-1.5 overflow-hidden">
              {isLoggedIn ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-black truncate">
                  <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    लॉक्ड सदस्य सत्र एक्टिव: <strong className="text-white font-mono">{currentUser?.userId}</strong>
                  </span>
                </div>
              ) : hasSponsor ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-black truncate">
                  <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">
                    स्पॉन्सर लिंक सत्यापित: <strong className="text-white font-mono">{cleanSponsorId}</strong>
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-black truncate">
                  <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate">
                    बिना स्पॉन्सर विज़िटर (डायरेक्ट सिस्टम मोड)
                  </span>
                </div>
              )}
            </div>

            {/* Expand / Minimize Toggle Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer shrink-0 font-bold text-[10px]"
              title={isExpanded ? 'डॉक मिनिमाइज़ करें' : 'डॉक विस्तार करें'}
            >
              <span>{isExpanded ? 'छुपाएं' : 'लॉक्ड ऑप्शंस'}</span>
              {isExpanded ? <ChevronDown className="w-3 h-3 text-amber-400" /> : <ChevronUp className="w-3 h-3 text-amber-400" />}
            </button>
          </div>

          {/* Expanded Important Options Buttons Row */}
          {isExpanded && (
            <div className="py-2 sm:py-2.5 animate-fadeIn">
              
              {/* ========================================================================= */}
              {/* STATE 1: LOGGED-IN USER OPTIONS (UNLOCKED DASHBOARD, ID CARD & TOOLS)     */}
              {/* ========================================================================= */}
              {isLoggedIn && currentUser && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2 items-center">
                  
                  {/* 1. My Dashboard */}
                  <button
                    type="button"
                    onClick={onOpenDashboard}
                    className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer active:scale-95"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">1. मेरा डैशबोर्ड</span>
                  </button>

                  {/* 2. My ID Card (Unlocked & Owner-Only) */}
                  <button
                    type="button"
                    onClick={onOpenIdCard}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-blue-500/50 hover:border-blue-400 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">2. मेरा ID कार्ड (🔓 डाउनलोड)</span>
                  </button>

                  {/* 3. Copy Referral Link */}
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Share2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    <span className="truncate">{copiedLink ? 'लिंक कॉपी हो गया!' : '3. रेफरल लिंक कॉपी'}</span>
                  </button>

                  {/* 4. 7 Master Plans */}
                  <button
                    type="button"
                    onClick={() => onNavigate('plans')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">4. 7 मास्टर प्लान्स</span>
                  </button>

                  {/* 5. Support Ticket */}
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="hidden md:flex p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 font-bold text-xs items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">5. 24x7 हेल्पडेस्क</span>
                  </button>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STATE 2: VISITOR WITH SPONSOR LINK (?ref=IOIS... or ?sponsor=IOIS...)     */}
              {/* ========================================================================= */}
              {!isLoggedIn && hasSponsor && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 items-center">
                  
                  {/* 1. Register with Verified Sponsor */}
                  <button
                    type="button"
                    onClick={() => onOpenRegister(1, cleanSponsorId)}
                    className="col-span-2 sm:col-span-1 p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">स्पॉन्सर के साथ रजिस्टर करें</span>
                  </button>

                  {/* 2. View Sponsor ID Card (Privacy-Masked) */}
                  <button
                    type="button"
                    onClick={onOpenSponsorCard}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/60 hover:border-amber-400 text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">स्पॉन्सर ID कार्ड देखें (🔒 मास्क्ड)</span>
                  </button>

                  {/* 3. Member Login */}
                  <button
                    type="button"
                    onClick={() => onOpenLogin('login')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">सदस्य लॉगिन</span>
                  </button>

                  {/* 4. 7 Plans */}
                  <button
                    type="button"
                    onClick={() => onNavigate('plans')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">7 प्लान्स व आय</span>
                  </button>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STATE 3: VISITOR WITHOUT SPONSOR LINK (DIRECT VISITOR / LOCKED SPONSOR)   */}
              {/* ========================================================================= */}
              {!isLoggedIn && !hasSponsor && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 items-center">
                  
                  {/* 1. Direct Registration (Official System Direct) */}
                  <button
                    type="button"
                    onClick={() => onOpenRegister(1)}
                    className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">डायरेक्ट सिस्टम रजिस्ट्रेशन</span>
                  </button>

                  {/* 2. Enter Sponsor ID Option (To unlock sponsor privileges) */}
                  <button
                    type="button"
                    onClick={() => setShowEnterSponsorDialog(true)}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/50 hover:border-amber-400 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">स्पॉन्सर कोड दर्ज करें</span>
                  </button>

                  {/* 3. Member Login */}
                  <button
                    type="button"
                    onClick={() => onOpenLogin('login')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">सदस्य लॉगिन</span>
                  </button>

                  {/* 4. ID Card Preview (Locked Notice) */}
                  <button
                    type="button"
                    onClick={onOpenIdCard}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="आईडी कार्ड नमूना देखें (डाउनलोड केवल मेंबर्स के लिए)"
                  >
                    <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">ID कार्ड स्टूडियो (🔒 लॉक्ड)</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </aside>

      {/* ================= POPUP DIALOG: ENTER SPONSOR ID MANUALLY ================= */}
      {showEnterSponsorDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative text-white space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">स्पॉन्सर कोड दर्ज करें</h4>
                  <p className="text-[11px] text-slate-400">अपने मित्र या रेफरर की User ID डालें</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEnterSponsorDialog(false)}
                className="text-slate-400 hover:text-white text-sm w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySponsor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  स्पॉन्सर User ID (उदा. IOIS...):
                </label>
                <input
                  type="text"
                  required
                  value={inputSponsorId}
                  onChange={(e) => setInputSponsorId(e.target.value.toUpperCase())}
                  placeholder="उदा. IOIS10AM01"
                  className="w-full bg-slate-950 border border-amber-500/60 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-300 outline-none uppercase"
                />
              </div>

              {sponsorNotice && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{sponsorNotice}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEnterSponsorDialog(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition shadow-md"
                >
                  लिंक करें व कार्ड देखें →
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">
                यदि आपके पास कोई स्पॉन्सर नहीं है, तो आप{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowEnterSponsorDialog(false);
                    onOpenRegister(1);
                  }}
                  className="text-amber-400 font-bold underline cursor-pointer"
                >
                  डायरेक्ट आधिकारिक सिस्टम
                </button>{' '}
                से जुड़ सकते हैं।
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
