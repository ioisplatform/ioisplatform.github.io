import React, { useState, useEffect } from 'react';
import { UserProfile, HelpTicket } from '../types';
import { PLANS } from '../data/plansData';
import { 
  getAllUsers, 
  fetchUsersFromServer,
  fetchTicketsFromServer,
  setPaymentStatus, 
  deleteUserAccount,
  getHelpTickets, 
  replyHelpTicket, 
  isAdminLoggedIn, 
  setAdminSession,
  subscribeToFirestoreUsers,
  subscribeToFirestoreTickets
} from '../services/userService';
import { TelegramAdminSettings } from './TelegramAdminSettings';
import { AiKnowledgeManager } from './AiKnowledgeManager';
import { InterviewListManager } from './InterviewListManager';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Users, 
  HelpCircle, 
  Filter, 
  Send, 
  ExternalLink, 
  Lock, 
  Unlock, 
  AlertCircle,
  FileText,
  Clock,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  Trash2,
  RefreshCw,
  Bot,
  GraduationCap
} from 'lucide-react';

interface AdminPanelProps {
  onUserStatusChange?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onUserStatusChange }) => {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => isAdminLoggedIn());
  const [adminPin, setAdminPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'approvals' | 'all_users' | 'tickets' | 'telegram' | 'ai_bot' | 'interviews'>('approvals');
  const [usersList, setUsersList] = useState<UserProfile[]>(() => getAllUsers());
  const [ticketsList, setTicketsList] = useState<HelpTicket[]>(() => getHelpTickets());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modal / Preview state for screenshot
  const [previewUser, setPreviewUser] = useState<UserProfile | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>('');
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>('');

  const reloadData = async () => {
    setIsRefreshing(true);
    try {
      const liveUsers = await fetchUsersFromServer();
      setUsersList(liveUsers);
      const liveTickets = await fetchTicketsFromServer();
      setTicketsList(liveTickets);
    } catch (e) {
      console.warn('Reload data failed', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    reloadData();
    // Realtime Firestore subscription for Users & Tickets
    const unsubscribeFirestoreUsers = subscribeToFirestoreUsers((liveUsers) => {
      if (liveUsers && liveUsers.length > 0) {
        setUsersList(liveUsers);
      }
    });

    const unsubscribeFirestoreTickets = subscribeToFirestoreTickets((liveTickets) => {
      if (liveTickets && liveTickets.length > 0) {
        setTicketsList(liveTickets);
      }
    });

    const interval = setInterval(reloadData, 10000); // 10s live polling fallback
    return () => {
      unsubscribeFirestoreUsers();
      unsubscribeFirestoreTickets();
      clearInterval(interval);
    };
  }, [isAdminAuth]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Admin password exclusively set to IOISSYSTEM
    const cleanPin = adminPin.trim();
    if (cleanPin === 'IOISSYSTEM' || cleanPin === 'ioissystem') {
      setAdminSession(true);
      setIsAdminAuth(true);
      setPinError('');
      await reloadData();
    } else {
      setPinError('गलत एडमिन पासवर्ड! कृपया सही पासवर्ड दर्ज करें।');
    }
  };

  const handleAdminLogout = () => {
    setAdminSession(false);
    setIsAdminAuth(false);
  };

  const handleApprove = async (userId: string) => {
    setPaymentStatus(userId, 'approved');
    await reloadData();
    if (previewUser && previewUser.userId === userId) {
      setPreviewUser((prev) => prev ? { ...prev, paymentStatus: 'approved', verifiedAt: new Date().toISOString() } : null);
    }
    if (onUserStatusChange) onUserStatusChange();
  };

  const handleReject = async (userId: string) => {
    const reason = rejectReasonInput || 'अमान्य पेमेंट स्क्रीनशॉट / UTR';
    setPaymentStatus(userId, 'rejected', reason);
    await reloadData();
    setRejectReasonInput('');
    if (previewUser && previewUser.userId === userId) {
      setPreviewUser((prev) => prev ? { ...prev, paymentStatus: 'rejected', rejectionReason: reason } : null);
    }
    if (onUserStatusChange) onUserStatusChange();
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (window.confirm(`क्या आप यूजर "${name}" (${userId}) को हटाना चाहते हैं?`)) {
      await deleteUserAccount(userId);
      await reloadData();
      if (previewUser && previewUser.userId === userId) {
        setPreviewUser(null);
      }
      if (onUserStatusChange) onUserStatusChange();
    }
  };

  const handleSendTicketReply = (ticketId: string) => {
    if (!adminReplyText.trim()) return;
    replyHelpTicket(ticketId, adminReplyText.trim(), 'resolved');
    setTicketsList(getHelpTickets());
    setAdminReplyText('');
    setReplyTicketId(null);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobileNumber.includes(searchQuery);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && u.paymentStatus === statusFilter;
  });

  const pendingCount = usersList.filter((u) => u.paymentStatus === 'pending').length;
  const openTicketCount = ticketsList.filter((t) => t.status === 'open').length;

  if (!isAdminAuth) {
    return (
      <section id="admin-panel" className="scroll-mt-24">
        <div className="glass-card-gold p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 max-w-md mx-auto text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">🔒 IOIS आधिकारिक एडमिन पैनल</h3>
            <p className="text-xs text-slate-300">
              यूजर पेमेंट्स, स्क्रीनशॉट्स और सहायता टिकट अप्रूव / रिजेक्ट करने हेतु एडमिन PIN दर्ज करें:
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-3">
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="Admin Password दर्ज करें..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-4 py-2.5 text-center text-sm font-bold tracking-widest outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>एडमिन पैनल खोलें (UNLOCK ADMIN)</span>
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section id="admin-panel" className="scroll-mt-24 space-y-6">
      {/* Admin Header */}
      <div className="glass-card-gold p-6 sm:p-7 rounded-3xl border-2 border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>OFFICIAL ADMIN CONSOLE</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            👑 IOIS <span className="gold-text">एडमिन कंट्रोल व वेरिफिकेशन पैनल</span>
          </h2>
          <p className="text-xs text-slate-300">
            यूजर रजिस्ट्रेशन, 25MB+ पेमेंट स्क्रीनशॉट्स, अप्रूवल/रिजेक्शन और हेल्पडेस्क टिकट यहाँ से नियंत्रित करें।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reloadData}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>{isRefreshing ? 'रिफ्रेश हो रहा है...' : 'रिफ्रेश डेटा'}</span>
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-3.5 py-2 bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* Admin Stats & Tab Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            activeTab === 'approvals'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-400">लंबित अप्रूवल</div>
            <div className="text-xl font-black text-amber-400">{pendingCount} यूज़र्स</div>
          </div>
          <Clock className="w-5 h-5 text-amber-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveTab('all_users')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            activeTab === 'all_users'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-400">कुल पंजीकृत सदस्य</div>
            <div className="text-xl font-black text-white">{usersList.length} यूज़र्स</div>
          </div>
          <Users className="w-5 h-5 text-sky-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            activeTab === 'tickets'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-400">हेल्प टिकट्स</div>
            <div className="text-xl font-black text-emerald-400">{openTicketCount} टिकट्स</div>
          </div>
          <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            activeTab === 'telegram'
              ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-sky-300">Telegram Bot</div>
            <div className="text-xs font-black text-white flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>1-Click अलर्ट्स</span>
            </div>
          </div>
          <Bot className="w-5 h-5 text-sky-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveTab('ai_bot')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            activeTab === 'ai_bot'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-amber-300">AI बॉट ज्ञान</div>
            <div className="text-xs font-black text-white mt-0.5">
              सवाल-जवाब सीखें
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveTab('interviews')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            activeTab === 'interviews'
              ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-emerald-300">इंटरव्यू टेस्ट्स</div>
            <div className="text-xs font-black text-white mt-0.5">
              15-सवाल रिपोर्ट
            </div>
          </div>
          <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0" />
        </button>
      </div>

      {/* TAB 1 & 2: USER VERIFICATIONS & DATABASE */}
      {(activeTab === 'approvals' || activeTab === 'all_users') && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="नाम, User ID या फोन नंबर से खोजें..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-3.5 py-2 text-xs outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-bold">फ़िल्टर:</span>
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer"
              >
                <option value="all">सभी स्टेटस (All)</option>
                <option value="pending">केवल पेंडिंग (Pending)</option>
                <option value="approved">स्वीकृत (Approved)</option>
                <option value="rejected">अस्वीकृत (Rejected)</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">फोटो / नाम</th>
                  <th className="py-3 px-3">यूनिक User ID</th>
                  <th className="py-3 px-3">प्लान / शुल्क</th>
                  <th className="py-3 px-3">मोबाइल / UPI</th>
                  <th className="py-3 px-3">पेमेंट प्रूफ</th>
                  <th className="py-3 px-3">स्टेटस</th>
                  <th className="py-3 px-3 text-right">एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      कोई यूजर रिकॉर्ड नहीं मिला।
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const plan = PLANS.find((p) => p.id === u.selectedPlanId) || PLANS[0];
                    return (
                      <tr key={u.userId} className="hover:bg-slate-900/50 transition">
                        {/* Name & Photo */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                              <img src={u.photoUrl} alt={u.fullName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-white">{u.fullName}</div>
                              <div className="text-[10px] text-slate-400">{u.role}</div>
                            </div>
                          </div>
                        </td>

                        {/* User ID */}
                        <td className="py-3 px-3 font-mono font-bold text-amber-300">
                          {u.userId}
                        </td>

                        {/* Plan */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-white">{plan.name}</span>
                          <span className="block text-[10px] text-amber-400 font-black">₹{plan.price}</span>
                        </td>

                        {/* Mobile / UPI */}
                        <td className="py-3 px-3">
                          <div className="text-slate-200">{u.mobileNumber}</div>
                          <div className="text-[10px] text-slate-400">{u.payoutUpi || u.email}</div>
                        </td>

                        {/* Payment Proof Button / Link */}
                        <td className="py-3 px-3">
                          <button
                            onClick={() => setPreviewUser(u)}
                            className="inline-flex items-center gap-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 px-2.5 py-1 rounded-lg cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>स्क्रीनशॉट देखें</span>
                          </button>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          {u.paymentStatus === 'approved' && (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> APPROVED
                            </span>
                          )}
                          {u.paymentStatus === 'pending' && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" /> PENDING
                            </span>
                          )}
                          {u.paymentStatus === 'rejected' && (
                            <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> REJECTED
                            </span>
                          )}
                        </td>

                        {/* Quick Approve / Reject / Delete Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {u.paymentStatus !== 'approved' && (
                              <button
                                onClick={() => handleApprove(u.userId)}
                                title="स्वीकृत करें (Approve)"
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {u.paymentStatus !== 'rejected' && (
                              <button
                                onClick={() => {
                                  setPreviewUser(u);
                                }}
                                title="अस्वीकृत करें (Reject with Reason)"
                                className="p-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(u.userId, u.fullName)}
                              title="यूजर हटाएं (Delete User)"
                              className="p-1.5 bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-red-300 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: HELP TICKETS */}
      {activeTab === 'tickets' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>उपयोगकर्ता सहायता अनुरोध (User Helpdesk Tickets)</span>
          </h3>

          <div className="space-y-3">
            {ticketsList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">कोई सहायता टिकट दर्ज नहीं है।</p>
            ) : (
              ticketsList.map((t) => (
                <div key={t.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{t.subject}</span>
                      <div className="text-[10px] text-slate-400">
                        प्रेषक: <strong className="text-amber-400">{t.userName}</strong> (ID: {t.userId} • Phone: {t.userMobile})
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      t.status === 'resolved' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {t.description}
                  </p>

                  {/* Attachments if any */}
                  {t.attachmentUrl && (
                    <div className="flex items-center gap-2">
                      <img src={t.attachmentUrl} alt="Attached" className="w-16 h-16 rounded-lg object-cover border border-slate-700" />
                      <a href={t.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline text-[11px]">
                        फ़ाइल बड़े रूप में देखें →
                      </a>
                    </div>
                  )}

                  {t.googleDriveAttachmentLink && (
                    <div className="text-[11px] text-sky-400 flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <a href={t.googleDriveAttachmentLink} target="_blank" rel="noopener noreferrer" className="underline">
                        Google Drive फ़ाइल लिंक खोलें →
                      </a>
                    </div>
                  )}

                  {/* Admin Reply */}
                  {t.adminReply ? (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300">
                      <strong className="block text-[10px] text-amber-400 mb-1">भेजा गया जवाब:</strong>
                      {t.adminReply}
                    </div>
                  ) : (
                    <div className="pt-2">
                      {replyTicketId === t.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            placeholder="यूजर को अपना जवाब लिखें..."
                            className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl p-2.5 text-xs outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSendTicketReply(t.id)}
                              className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-black rounded-lg text-xs cursor-pointer"
                            >
                              जवाब भेजें व क्लोज करें
                            </button>
                            <button
                              onClick={() => setReplyTicketId(null)}
                              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs cursor-pointer"
                            >
                              रद्द करें
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReplyTicketId(t.id);
                            setAdminReplyText('');
                          }}
                          className="px-3 py-1.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-lg text-xs font-bold hover:bg-sky-500/30 cursor-pointer"
                        >
                          जवाब लिखें (Reply to User)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: TELEGRAM BOT INTEGRATION & 1-CLICK APPROVALS */}
      {activeTab === 'telegram' && (
        <TelegramAdminSettings />
      )}

      {/* TAB 5: AI BOT KNOWLEDGE BASE & TRAINING */}
      {activeTab === 'ai_bot' && (
        <AiKnowledgeManager />
      )}

      {/* TAB 6: 15-QUESTION INTERVIEWS */}
      {activeTab === 'interviews' && (
        <InterviewListManager />
      )}

      {/* Screenshot & Verification Detail Modal */}
      {previewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-2xl rounded-3xl p-6 shadow-[0_20px_60px_rgba(245,158,11,0.25)] relative text-white space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setPreviewUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <span>पेमेंट स्क्रीनशॉट व विवरण समीक्षा ({previewUser.fullName})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400">User ID:</span>
                <strong className="block text-amber-300 font-mono text-sm">{previewUser.userId}</strong>
              </div>
              <div>
                <span className="text-slate-400">मोबाइल / WhatsApp:</span>
                <strong className="block text-white text-sm">{previewUser.mobileNumber}</strong>
              </div>
              <div>
                <span className="text-slate-400">UTR / Ref नंबर:</span>
                <strong className="block text-emerald-400 font-mono text-sm">{previewUser.paymentUtr || 'उपलब्ध नहीं'}</strong>
              </div>
              <div>
                <span className="text-slate-400">पेआउट UPI ID:</span>
                <strong className="block text-white text-sm">{previewUser.payoutUpi || 'सेट नहीं'}</strong>
              </div>
            </div>

            {/* Screenshot Display */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">अपलोड किया गया पेमेंट स्क्रीनशॉट:</span>
              {previewUser.paymentScreenshotUrl ? (
                <div className="max-h-72 overflow-hidden rounded-2xl border border-amber-400/40 bg-slate-950 flex items-center justify-center p-2">
                  <img
                    src={previewUser.paymentScreenshotUrl}
                    alt="Payment Proof"
                    className="max-h-64 object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl text-center text-slate-400 text-xs">
                  सीधा इमेज स्क्रीनशॉट अपलोड नहीं किया गया।
                </div>
              )}

              {previewUser.googleDrivePaymentLink && (
                <div className="p-3 bg-sky-950/50 border border-sky-500/40 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-sky-300 font-bold">Google Drive लिंक (25MB+ फ़ाइल):</span>
                  <a
                    href={previewUser.googleDrivePaymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-500 text-slate-950 font-black px-3 py-1 rounded-lg hover:bg-sky-400 transition"
                  >
                    Drive में खोलें →
                  </a>
                </div>
              )}
            </div>

            {/* Rejection input */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300">रिजेक्शन का कारण (यदि रिजेक्ट कर रहे हों):</label>
              <input
                type="text"
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder="उदा. UTR मिसमैच / फर्जी स्क्रीनशॉट"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  handleApprove(previewUser.userId);
                  setPreviewUser(null);
                }}
                className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>अप्रूव करें (APPROVE PAYMENT)</span>
              </button>

              <button
                onClick={() => {
                  handleReject(previewUser.userId);
                  setPreviewUser(null);
                }}
                className="py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>रिजेक्ट करें (REJECT PROOF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
