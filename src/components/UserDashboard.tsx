import React, { useState } from 'react';
import { UserProfile, HelpTicket } from '../types';
import { PLANS, OFFICIAL_PHONE, OFFICIAL_EMAIL } from '../data/plansData';
import { createHelpTicket, getHelpTickets, logoutUser } from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { ProfileEditSection } from './ProfileEditSection';
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
  MapPin
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

      {/* Main Grid: Profile Edit Left, Help Desk Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: User Profile Details (Editable except User ID) */}
        <div className="lg:col-span-7 glass-card-gold p-6 sm:p-7 rounded-3xl border border-amber-500/30">
          <ProfileEditSection
            user={user}
            onUserUpdated={onUserUpdated}
          />
        </div>

        {/* Right: In-App Help & Ticket Section (No third-party app needed) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <span>सहायता व समस्या निवारण (In-App Help Desk)</span>
              </h3>
              <span className="text-[10px] text-amber-400 font-bold">24x7 Direct Support</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              यदि आपको कोई समस्या या सवाल है, तो नीचे विवरण और स्क्रीनशॉट भेजें। एडमिन टीम सीधे आपके टिकट का जवाब देगी।
            </p>

            {ticketSuccess && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{ticketSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">विषय (Subject / Problem):</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="उदा. पेमेंट अप्रूवल / ID कार्ड डाउनलोड समस्या"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 text-white rounded-xl px-3.5 py-2 outline-none transition"
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
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>आपके पिछले टिकट (Ticket History):</span>
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
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
                        <div className="p-2 bg-slate-900 border border-emerald-500/40 rounded-xl text-emerald-300 mt-1">
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

        </div>

      </div>
    </section>
  );
};
