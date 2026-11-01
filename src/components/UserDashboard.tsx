import React, { useState } from 'react';
import { UserProfile, HelpTicket } from '../types';
import { PLANS, OFFICIAL_PHONE, OFFICIAL_EMAIL } from '../data/plansData';
import { createHelpTicket, getHelpTickets, logoutUser } from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { ProfileEditSection } from './ProfileEditSection';
import { StudentReferralHub } from './StudentReferralHub';
import { MarketingToolsSection } from './MarketingToolsSection';
import { IDCardGenerator } from './IDCardGenerator';
import { PromotionalPosterStudio } from './PromotionalPosterStudio';
import { 
  User, 
  CreditCard, 
  Award, 
  ShieldCheck, 
  Edit3, 
  Save, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Lock, 
  HelpCircle, 
  Send, 
  LogOut, 
  Download, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Share2,
  Zap,
  Users,
  Image as ImageIcon,
  Crown,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface UserDashboardProps {
  user: UserProfile;
  onUserUpdated: (updated: UserProfile) => void;
  onLogout: () => void;
  onScrollToCard: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onUserUpdated,
  onLogout,
  onScrollToCard,
}) => {
  const [activeTab, setActiveTab] = useState<'referral' | 'marketing' | 'posters' | 'idcard' | 'profile' | 'support'>('referral');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Help & Support Tickets
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDesc, setTicketDesc] = useState<string>('');
  const [ticketAttachment, setTicketAttachment] = useState<string>('');
  const [ticketDriveLink, setTicketDriveLink] = useState<string>('');
  const [ticketSuccess, setTicketSuccess] = useState<string>('');
  const [myTickets, setMyTickets] = useState<HelpTicket[]>(() => {
    return getHelpTickets().filter((t) => t.userId === user.userId);
  });

  const selectedPlan = PLANS.find((p) => p.id === user.selectedPlanId) || PLANS[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    createHelpTicket({
      userId: user.userId,
      userName: user.fullName,
      userMobile: user.mobileNumber,
      subject: ticketSubject.trim(),
      description: ticketDesc.trim(),
      attachmentUrl: ticketAttachment || undefined,
      googleDriveAttachmentLink: ticketDriveLink.trim() || undefined,
    });

    setTicketSubject('');
    setTicketDesc('');
    setTicketAttachment('');
    setTicketDriveLink('');
    setTicketSuccess('आपकी शिकायत / प्रश्न आधिकारिक टीम तक पहुँच गया है! हम जल्द ही संपर्क करेंगे।');
    setMyTickets(getHelpTickets().filter((t) => t.userId === user.userId));
    setTimeout(() => setTicketSuccess(''), 5000);
  };

  return (
    <section id="user-dashboard-section" className="scroll-mt-24 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card-gold p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 shrink-0 shadow-lg">
              <img src={user.photoUrl} alt={user.fullName} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  नमस्ते, <span className="gold-text">{user.fullName}</span> जी! 🎉
                </h2>
                {user.paymentStatus === 'approved' ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED OFFICIAL MEMBER</span>
                  </span>
                ) : user.paymentStatus === 'pending' ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>VERIFICATION UNDER REVIEW</span>
                  </span>
                ) : (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>PAYMENT REJECTED - UPDATE PROOF</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                <span className="font-mono text-amber-300 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  User ID: {user.userId} (Non-Editable)
                </span>
                <span>•</span>
                <span className="font-semibold text-white">
                  {selectedPlan.name} (₹{selectedPlan.price})
                </span>
                <span>•</span>
                <span className="text-slate-400">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onScrollToCard}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <CreditCard className="w-4 h-4" />
              <span>मेरा डिजिटल ID कार्ड देखें</span>
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Rejection Notice if rejected */}
        {user.paymentStatus === 'rejected' && (
          <div className="mt-4 p-4 bg-red-950/80 border border-red-500/60 rounded-2xl text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-black text-red-300">एडमिन द्वारा रिजेक्शन का कारण:</span>
              <p>{user.rejectionReason || 'पेमेंट स्क्रीनशॉट या UTR स्पष्ट नहीं था। कृपया नीचे प्रोफाइल एडिट करके सही स्क्रीनशॉट अपलोड करें।'}</p>
            </div>
          </div>
        )}
      </div>

      {/* 4 MODERN LUXURY KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Active Master Plan & Payout */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border-2 border-amber-500/40 p-4 shadow-xl group hover:border-amber-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">सक्रिय मास्टर प्लान</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h4 className="text-base font-black text-white">{selectedPlan.name}</h4>
            <p className="text-xl font-black text-amber-300 font-mono">₹{selectedPlan.price}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
            <span className="text-slate-300">डायरेक्ट इंसेंटिव:</span>
            <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              50% - 70% UPI
            </span>
          </div>
        </div>

        {/* KPI 2: Official Verification Status */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950 border-2 border-emerald-500/40 p-4 shadow-xl group hover:border-emerald-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">वेरिफिकेशन स्थिति</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h4 className="text-base font-black text-white">
              {user.paymentStatus === 'approved' ? 'पूर्णतः सत्यापित' : user.paymentStatus === 'pending' ? 'समीक्षाधीन' : 'अमान्य पेमेंट'}
            </h4>
            <p className="text-xs text-slate-300 font-medium">
              {user.paymentStatus === 'approved' ? 'आधिकारिक आईडी कार्ड व पेआउट सक्रिय' : user.paymentStatus === 'pending' ? 'एडमिन टीम द्वारा सत्यापन जारी' : 'स्क्रीनशॉट पुनः अपलोड करें'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
            <span className="text-slate-300">सुरक्षा मानक:</span>
            <span className="font-bold text-emerald-400">256-Bit SSL Verified</span>
          </div>
        </div>

        {/* KPI 3: Digital ID Card Hub */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/15 via-slate-900 to-slate-950 border-2 border-sky-500/40 p-4 shadow-xl group hover:border-sky-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">स्मार्ट डिजिटल ID कार्ड</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h4 className="text-base font-black text-white">स्मार्ट कार्ड जनरेटेड</h4>
            <p className="text-xs text-slate-300">लाइव QR व फोटो युक्त कार्ड</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-sky-500/20 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('idcard')}
              className="text-sky-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>कार्ड खोलें व डाउनलोड करें →</span>
            </button>
          </div>
        </div>

        {/* KPI 4: Sponsor Referral Code */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/15 via-slate-900 to-slate-950 border-2 border-purple-500/40 p-4 shadow-xl group hover:border-purple-400 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">आपका स्पॉन्सर कोड</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h4 className="text-lg font-black text-amber-300 font-mono tracking-wider">{user.userId}</h4>
            <p className="text-[11px] text-slate-300">मित्रों को सीधे जोड़कर 50-70% कमाएं</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-500/20 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                const link = `${window.location.origin}?sponsor=${user.userId}`;
                navigator.clipboard.writeText(link);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 3000);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center gap-1 transition cursor-pointer"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-950" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'लिंक कॉपी हो गया!' : 'रेफरल लिंक कॉपी'}</span>
            </button>
            <span className="text-[10px] text-purple-300 font-mono">1-क्लिक शेयर</span>
          </div>
        </div>
      </div>

      {/* Dashboard Modern Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 bg-slate-950/90 rounded-2xl border-2 border-slate-800 shadow-xl">
        <button
          type="button"
          onClick={() => setActiveTab('referral')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'referral'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>1. रेफरल व टीम</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marketing')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'marketing'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. मार्केटिंग टूल्स</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('posters')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'posters'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>3. पोस्टर स्टूडियो</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('idcard')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'idcard'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>4. डिजिटल ID कार्ड</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>5. प्रोफाइल व गोपनीयता</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1 ${
            activeTab === 'support'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>6. हेल्पडेस्क व टिकट</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: REFERRAL QR, PROMO COPY & DOWNLINE CHECKUP */}
      {/* ========================================================= */}
      {activeTab === 'referral' && (
        <div className="animate-fadeIn">
          <StudentReferralHub
            user={user}
            onOpenIdCard={() => setActiveTab('idcard')}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MARKETING TOOLS SUITE (TEMPLATES, BULK INVITE, DYNAMIC QR) */}
      {/* ========================================================= */}
      {activeTab === 'marketing' && (
        <div className="animate-fadeIn">
          <MarketingToolsSection user={user} />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PROMOTIONAL POSTER STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'posters' && (
        <div className="animate-fadeIn">
          <PromotionalPosterStudio user={user} />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PROFILE EDIT SECTION */}
      {/* ========================================================= */}
      {activeTab === 'profile' && (
        <div className="glass-card-gold p-6 sm:p-7 rounded-3xl border border-amber-500/30 animate-fadeIn">
          <ProfileEditSection
            user={user}
            onUserUpdated={onUserUpdated}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: DIGITAL ID CARD STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'idcard' && (
        <div className="space-y-4 animate-fadeIn">
          <IDCardGenerator
            currentUser={user}
            isModalMode={false}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: HELP DESK & TICKETS */}
      {/* ========================================================= */}
      {activeTab === 'support' && (
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-6 max-w-3xl mx-auto animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sky-400" />
              <span>सहायता व समस्या निवारण (In-App Help Desk)</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              24x7 Direct Admin Support
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            यदि आपको कोई समस्या, पेआउट संबंधी प्रश्न या सुझाव है, तो नीचे विवरण और स्क्रीनशॉट भेजें। एडमिन टीम सीधे आपके टिकट का जवाब देगी।
          </p>

          {ticketSuccess && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{ticketSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">विषय (Subject / Problem):</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="उदा. पेमेंट अप्रूवल / ID कार्ड डाउनलोड समस्या / पेआउट विवरण"
                className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">समस्या का पूरा विवरण:</label>
              <textarea
                required
                rows={3}
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                placeholder="अपनी समस्या यहाँ विस्तार से लिखें..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 text-white rounded-xl p-3 outline-none transition resize-none"
              />
            </div>

            <SmartFileUpload
              label="समस्या का स्क्रीनशॉट (यदि हो)"
              sublabel="25MB तक सीधे अपलोड या Drive Link"
              fileValue={ticketAttachment}
              driveLinkValue={ticketDriveLink}
              onFileChange={setTicketAttachment}
              onDriveLinkChange={setTicketDriveLink}
            />

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <Send className="w-4 h-4" />
              <span>टिकट सबमिट करें (SUBMIT TICKET)</span>
            </button>
          </form>

          {/* User's Previous Tickets */}
          {myTickets.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>आपके पिछले टिकट (Ticket History):</span>
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {myTickets.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{t.subject}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        t.status === 'resolved' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400">{t.description}</p>
                    {t.adminReply && (
                      <div className="p-2.5 bg-slate-900 border border-emerald-500/40 rounded-xl text-emerald-300 mt-1">
                        <strong className="block text-[10px] text-amber-400">एडमिन जवाब:</strong>
                        {t.adminReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
