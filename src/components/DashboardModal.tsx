import React, { useState } from 'react';
import { UserProfile, HelpTicket } from '../types';
import { PLANS, OFFICIAL_PHONE, OFFICIAL_EMAIL } from '../data/plansData';
import { createHelpTicket, getHelpTickets } from '../services/userService';
import { ProfileEditSection } from './ProfileEditSection';
import { IDCardGenerator } from './IDCardGenerator';
import { 
  User, 
  CreditCard, 
  ShieldCheck, 
  LogOut, 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Share2, 
  CheckCircle2,
  Zap,
  X
} from 'lucide-react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUserUpdated: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenLogin?: () => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onLogout,
  onOpenLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'idcard' | 'earnings' | 'support'>('profile');

  // Referral link copy state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [copiedUserId, setCopiedUserId] = useState<boolean>(false);

  // Support Ticket Form States
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDesc, setTicketDesc] = useState<string>('');
  const [ticketSuccess, setTicketSuccess] = useState<string>('');
  const [myTickets, setMyTickets] = useState<HelpTicket[]>(() => {
    return user ? getHelpTickets().filter((t) => t.userId === user.userId) : [];
  });

  // Synchronize tickets when user changes
  React.useEffect(() => {
    if (user) {
      setMyTickets(getHelpTickets().filter((t) => t.userId === user.userId));
    }
  }, [user]);

  if (!isOpen) return null;

  // Not logged in fallback
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(245,158,11,0.25)] relative text-white text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-400">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">सदस्य लॉगिन आवश्यक है</h3>
            <p className="text-xs text-slate-300">
              अपना डैशबोर्ड, डिजिटल ID कार्ड और कमाई का विवरण देखने के लिए कृपया पहले लॉगिन करें।
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

  const selectedPlan = PLANS.find((p) => p.id === user.selectedPlanId) || PLANS[0];
  
  // Official Live GitHub Platform Referral URL
  const GITHUB_LIVE_BASE = 'https://ioisplatform.github.io';
  const referralUrl = `${GITHUB_LIVE_BASE}/?ref=${user.userId}&sponsor=${user.userId}`;

  // Clean, sanitized UPI ID
  const rawUpi = user.payoutUpi?.trim() || '';
  const safePayoutUpi = rawUpi.length <= 50 && !rawUpi.includes('\n')
    ? rawUpi
    : (rawUpi ? rawUpi.slice(0, 30) + '...' : '');

  // Complete Referral Invite Message
  const inviteMessage = `नमस्ते! 🇮🇳\n\nमैंने Indian Online Income Supporting System (IOIS) डिजिटल प्लेटफॉर्म ज्वाइन किया है। यहाँ ₹10 से ₹999 के 7 मास्टर प्लांस, NCERT विद्यार्थी नोट्स, डिजिटल ID कार्ड व 50% से 70% तक सीधा रेफरल इंसेंटिव मिलता है।\n\nमेरी रेफरल लिंक से अभी रजिस्टर करें:\n👉 ${referralUrl}\n\nमेरा स्पॉन्सर आईडी: ${user.userId}\n(रजिस्ट्रेशन के समय Sponsor ID में यही भरें)`;

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.userId);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopyInviteMessage = async () => {
    try {
      await navigator.clipboard.writeText(inviteMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleShareWhatsApp = () => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    createHelpTicket({
      userId: user.userId,
      userName: user.fullName,
      userMobile: user.mobileNumber,
      subject: ticketSubject.trim(),
      description: ticketDesc.trim(),
    });

    setTicketSubject('');
    setTicketDesc('');
    setTicketSuccess('आपकी शिकायत / प्रश्न आधिकारिक टीम तक पहुँच गया है! हम जल्द ही संपर्क करेंगे।');
    setMyTickets(getHelpTickets().filter((t) => t.userId === user.userId));
    setTimeout(() => setTicketSuccess(''), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-5xl rounded-3xl p-4 sm:p-6 shadow-[0_25px_80px_rgba(245,158,11,0.25)] relative text-white my-4 max-h-[94vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition z-20 border border-slate-700 shadow-md"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal User Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4 pr-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-800 shrink-0 shadow-lg">
              <img src={user.photoUrl} alt={user.fullName} className="w-full h-full object-cover" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white">{user.fullName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user.paymentStatus}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="font-mono text-amber-300 font-bold bg-slate-950 hover:bg-slate-850 px-2 py-0.5 rounded-lg border border-amber-500/40 flex items-center gap-1 cursor-pointer transition"
                  title="क्लिक करके User ID कॉपी करें"
                >
                  <span>ID: {user.userId}</span>
                  {copiedUserId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                </button>

                <span className="text-slate-400">•</span>
                <span className="font-semibold text-white">{selectedPlan.name} (₹{selectedPlan.price})</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-400 font-bold">{selectedPlan.percentage}% Payout</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate">1. मेरी प्रोफाइल संपादन</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('idcard')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'idcard'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="truncate">2. डिजिटल ID कार्ड</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('earnings')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'earnings'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="truncate">3. रेफरल कमाई (50%-70%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'support'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="truncate">4. हेल्पडेस्क</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: PROFILE EDIT SECTION (SMOOTH & FRICTION-FREE) */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <ProfileEditSection
            user={user}
            onUserUpdated={onUserUpdated}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 2: FULL DIGITAL ID CARD STUDIO */}
        {/* ========================================================= */}
        {activeTab === 'idcard' && (
          <div className="space-y-4 animate-fadeIn">
            <IDCardGenerator
              currentUser={user}
              isModalMode={true}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: REFERRAL EARNINGS & GITHUB LIVE REFERRAL SYSTEM */}
        {/* ========================================================= */}
        {activeTab === 'earnings' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>रेफरल इंसेंटिव व स्पॉन्सर सिस्टम</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>50% से 70% इंस्टेंट पेआउट</span>
              </span>
            </div>

            {/* Official Live Referral Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/40 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>आपकी आधिकारिक रेफरल लिंक (GitHub Live Platform):</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live: ioisplatform.github.io</span>
                </span>
              </div>

              {/* Referral Link Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                <div className="flex-1 font-mono text-xs text-amber-300 truncate select-all px-1">
                  {referralUrl}
                </div>
              </div>

              {/* Quick Share Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyReferralLink}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'लिंक कॉपी हो गई!' : 'रेफरल लिंक कॉपी करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp पर शेयर करें</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyInviteMessage}
                  className="w-full py-2.5 px-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  {copiedMessage ? <Check className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4 text-amber-400" />}
                  <span>{copiedMessage ? 'मैसेज कॉपी हुआ!' : 'पूरा मैसेज कॉपी करें'}</span>
                </button>
              </div>
            </div>

            {/* Payout Destination Card */}
            <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-bold">पेआउट प्राप्तकर्ता UPI पता:</span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>सक्रिय पेआउट खाता</span>
                  </span>
                </div>
                <div className="font-mono text-sm font-black text-amber-300">
                  {safePayoutUpi || 'UPI पता सेट नहीं है'}
                </div>
                <p className="text-[10px] text-slate-400">
                  योजना अनुसार 50% से 70% इंसेंटिव प्रत्येक सफल रेफरल पर सीधे इसी UPI खाते में भेजा जाता है।
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('profile');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>UPI ID व प्रोफाइल बदलें</span>
              </button>
            </div>

            {/* Plan-wise Payout Quick Table */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">
                  प्रति रेफरल इंसेंटिव दरें (योजना अनुसार 50% से 70% पेआउट):
                </span>
                <span className="text-[10px] text-slate-400">7 मास्टर प्लांस</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {PLANS.map((p) => {
                  const isCurrent = p.id === user.selectedPlanId;
                  return (
                    <div 
                      key={p.id} 
                      className={`p-2.5 rounded-xl border text-center space-y-1 transition ${
                        isCurrent 
                          ? 'bg-amber-500/15 border-amber-400/80 shadow-md ring-1 ring-amber-400/50' 
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block font-semibold truncate">
                        {p.code} (₹{p.price})
                      </span>
                      <div className="text-sm font-black text-emerald-400 font-mono">
                        ₹{p.instantPayout}
                      </div>
                      <span className={`text-[9px] font-bold block ${isCurrent ? 'text-amber-300' : 'text-slate-300'}`}>
                        {p.percentage}% पेआउट
                      </span>
                      {isCurrent && (
                        <span className="text-[8px] font-black text-amber-400 bg-amber-400/20 px-1 py-0.2 rounded-full block">
                          एक्टिव
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: HELPDESK & SUPPORT */}
        {/* ========================================================= */}
        {activeTab === 'support' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>हेल्पडेस्क व सपोर्ट टिकट (Help & Support)</span>
              </h4>
              <span className="text-[10px] text-slate-400">सपोर्ट: {OFFICIAL_PHONE}</span>
            </div>

            {ticketSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{ticketSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-slate-300 font-bold mb-1">विषय (Subject):</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="जैसे: पेआउट या आईडी कार्ड संबंधी प्रश्न"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">विस्तृत संदेश (Message):</label>
                <textarea
                  required
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="कृपया अपनी समस्या या प्रश्न का विवरण यहाँ लिखें..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>टिकट सबमिट करें</span>
                </button>
              </div>
            </form>

            {/* List of Previous Tickets */}
            {myTickets.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-300 block">आपके द्वारा दर्ज टिकट:</span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {myTickets.map((t) => (
                    <div key={t.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{t.subject}</div>
                        <div className="text-[10px] text-slate-400">{t.description}</div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
