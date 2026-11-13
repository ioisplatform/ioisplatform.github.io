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
  onOpenReferralModal?: () => void;
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
  onOpenReferralModal,
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

  // Do not render dock on Admin Panel page to keep admin tables and chats completely clear and unobstructed
  if (currentPage === 'admin') {
    return null;
  }

  return (
    <>
      {/* ================= LOCKED BOTTOM DOCK BAR (PERMANENTLY PINNED, NEVER SCROLLS) ================= */}
      <aside 
        id="locked-footer-dock"
        aria-label="Locked Navigation Dock"
        className="relative shrink-0 w-full z-30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t-2 border-amber-400/50 shadow-[0_-8px_32px_rgba(245,158,11,0.22)] backdrop-blur-2xl transition-all select-none"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          
          {/* Dock Top Status & Toggle Bar - Compact */}
          <div className="py-1 flex items-center justify-between gap-2 border-b border-slate-800/80 text-[10px]">
            
            {/* Dynamic Status Pill: Based on states */}
            <div className="flex items-center gap-1 overflow-hidden">
              {isLoggedIn ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-black truncate text-[10px] shadow-sm">
                  <Unlock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    सत्र: <strong className="text-white font-mono">{currentUser?.userId}</strong>
                  </span>
                </div>
              ) : hasSponsor ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 font-black truncate text-[10px] shadow-sm">
                  <ShieldCheck className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    स्पॉन्सर: <strong className="text-white font-mono">{cleanSponsorId}</strong>
                  </span>
                </div>
              ) : null}
            </div>

            {/* Expand / Minimize Toggle Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/40 transition cursor-pointer shrink-0 font-bold text-[9.5px] shadow-inner"
              title={isExpanded ? 'डॉक मिनिमाइज़ करें' : 'डॉक विस्तार करें'}
            >
              <span>{isExpanded ? 'छुपाएं' : 'लॉक्ड ऑप्शंस'}</span>
              {isExpanded ? <ChevronDown className="w-2.5 h-2.5 text-amber-400" /> : <ChevronUp className="w-2.5 h-2.5 text-amber-400" />}
            </button>
          </div>

          {/* Expanded Important Options Buttons Row - Compact */}
          {isExpanded && (
            <div className="py-1.5 sm:py-2 animate-fadeIn">
              
              {/* ========================================================================= */}
              {/* STATE 1: LOGGED-IN USER OPTIONS (UNLOCKED DASHBOARD, ID CARD & TOOLS)     */}
              {/* ========================================================================= */}
              {isLoggedIn && currentUser && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2 items-center">
                  
                  {/* 1. My Dashboard - 3D GOLD */}
                  <button
                    type="button"
                    onClick={onOpenDashboard}
                    className="btn-3d-gold px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box flex items-center justify-center shrink-0">
                      <LayoutDashboard className="w-2.5 h-2.5 text-slate-950" />
                    </div>
                    <span className="text-slate-950 font-black truncate">1. मेरा डैशबोर्ड</span>
                  </button>

                  {/* 2. My ID Card - 3D PLATINUM */}
                  <button
                    type="button"
                    onClick={onOpenIdCard}
                    className="btn-3d-platinum px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box-platinum flex items-center justify-center shrink-0">
                      <CreditCard className="w-2.5 h-2.5 text-indigo-950" />
                    </div>
                    <span className="text-indigo-950 font-black truncate">2. ID कार्ड (डाउनलोड)</span>
                  </button>

                  {/* 3. Referral Hub & Promotional Poster Studio Pop-up Window - 3D RAINBOW */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenReferralModal) {
                        onOpenReferralModal();
                      } else {
                        handleCopyReferral();
                      }
                    }}
                    className="btn-3d-rainbow px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                    title="रेफरल डैशबोर्ड, पोस्टर स्टूडियो व इनकम प्लान्स पॉपअप"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                      <Share2 className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span className="text-black font-black truncate">3. रेफरल व प्रचार</span>
                  </button>

                  {/* 4. 7 Master Plans - 3D SILVER */}
                  <button
                    type="button"
                    onClick={() => onNavigate('plans')}
                    className="btn-3d-silver px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box-silver flex items-center justify-center shrink-0">
                      <Crown className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span className="text-black font-black truncate">4. 7 मास्टर प्लान्स</span>
                  </button>

                  {/* 5. Support Ticket - 3D OBSIDIAN */}
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="hidden md:flex btn-3d-dark px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-amber-300 font-black truncate">5. हेल्पडेस्क</span>
                  </button>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STATE 2: VISITOR WITH SPONSOR LINK (?ref=IOIS... or ?sponsor=IOIS...)     */}
              {/* ========================================================================= */}
              {!isLoggedIn && hasSponsor && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 items-center">
                  
                  {/* 1. Register with Verified Sponsor - 3D RAINBOW (Replaced Green) */}
                  <button
                    type="button"
                    onClick={() => onOpenRegister(1, cleanSponsorId)}
                    className="col-span-2 sm:col-span-1 btn-3d-rainbow px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                      <UserPlus className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span className="text-black font-black truncate">स्पॉन्सर संग रजिस्ट्रेशन</span>
                  </button>

                  {/* 2. View Sponsor ID Card (Privacy-Masked) - 3D GOLD */}
                  <button
                    type="button"
                    onClick={onOpenSponsorCard}
                    className="btn-3d-gold px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box flex items-center justify-center shrink-0">
                      <CreditCard className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span className="text-black font-black truncate">स्पॉन्सर ID कार्ड (मास्क्ड)</span>
                  </button>

                  {/* 3. Member Login - 3D SILVER */}
                  <button
                    type="button"
                    onClick={() => onOpenLogin('login')}
                    className="btn-3d-silver px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <LogIn className="w-3 h-3 text-black shrink-0" />
                    <span className="text-black font-black truncate">सदस्य लॉगिन</span>
                  </button>

                  {/* 4. 7 Plans - 3D PLATINUM */}
                  <button
                    type="button"
                    onClick={() => onNavigate('plans')}
                    className="btn-3d-platinum px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box-platinum flex items-center justify-center shrink-0">
                      <Crown className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span className="text-black font-black truncate">7 प्लान्स व आय</span>
                  </button>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STATE 3: VISITOR WITHOUT SPONSOR LINK (DIRECT VISITOR / LOCKED SPONSOR)   */}
              {/* ========================================================================= */}
              {!isLoggedIn && !hasSponsor && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 items-center">
                  
                  {/* 1. Direct Registration (Official System Direct) - 3D RAINBOW (Replaced Green) */}
                  <button
                    type="button"
                    onClick={() => onOpenRegister(1)}
                    className="btn-3d-rainbow px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                      <UserPlus className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span className="text-black font-black truncate">डायरेक्ट रजिस्ट्रेशन</span>
                  </button>

                  {/* 2. Enter Sponsor ID Option - 3D GOLD */}
                  <button
                    type="button"
                    onClick={() => setShowEnterSponsorDialog(true)}
                    className="btn-3d-gold px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box flex items-center justify-center shrink-0">
                      <Users className="w-2.5 h-2.5 text-slate-950" />
                    </div>
                    <span className="text-slate-950 font-black truncate">स्पॉन्सर कोड दर्ज करें</span>
                  </button>

                  {/* 3. Member Login - 3D SILVER */}
                  <button
                    type="button"
                    onClick={() => onOpenLogin('login')}
                    className="btn-3d-silver px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <LogIn className="w-3 h-3 text-slate-950 shrink-0" />
                    <span className="text-slate-950 font-black truncate">सदस्य लॉगिन</span>
                  </button>

                  {/* 4. 7 Plans - 3D PLATINUM */}
                  <button
                    type="button"
                    onClick={() => onNavigate('plans')}
                    className="btn-3d-platinum px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <div className="w-4.5 h-4.5 rounded-md logo-3d-box-platinum flex items-center justify-center shrink-0">
                      <Crown className="w-2.5 h-2.5 text-indigo-950" />
                    </div>
                    <span className="text-indigo-950 font-black truncate">7 मास्टर प्लान्स</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </aside>

      {/* ================= POPUP DIALOG: ENTER SPONSOR ID MANUALLY ================= */}
      {showEnterSponsorDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
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
