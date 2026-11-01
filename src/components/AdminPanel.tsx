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
  subscribeToFirestoreTickets,
  getAllDownlinesRecursive,
  getDirectDownlines,
  getDownlineStats,
  maskMobile
} from '../services/userService';
import { AiKnowledgeManager } from './AiKnowledgeManager';
import { InterviewListManager } from './InterviewListManager';
import { StudentReferralHub } from './StudentReferralHub';
import { IDCardGenerator } from './IDCardGenerator';
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
  GraduationCap,
  Network,
  History,
  UserCheck,
  CreditCard,
  Share2,
  Layers,
  ChevronRight,
  X,
  FileSpreadsheet
} from 'lucide-react';

interface AdminPanelProps {
  onUserStatusChange?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onUserStatusChange }) => {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => isAdminLoggedIn());
  const [adminPin, setAdminPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'approvals' | 'all_users' | 'genealogy' | 'audit_logs' | 'tickets' | 'ai_bot' | 'interviews'>('approvals');
  const [usersList, setUsersList] = useState<UserProfile[]>(() => getAllUsers());
  const [ticketsList, setTicketsList] = useState<HelpTicket[]>(() => getHelpTickets());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modal / Preview state for screenshot & inspection
  const [previewUser, setPreviewUser] = useState<UserProfile | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>('');
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>('');

  // Enhanced Admin Inspection States
  const [selectedFormUser, setSelectedFormUser] = useState<UserProfile | null>(null);
  const [impersonateUser, setImpersonateUser] = useState<UserProfile | null>(null);
  const [selectedAuditUser, setSelectedAuditUser] = useState<UserProfile | null>(null);
  const [selectedGenealogyUserId, setSelectedGenealogyUserId] = useState<string>('');

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
      <section id="admin-panel" className="scroll-mt-24 py-8">
        <div className="glass-card-gold p-6 sm:p-10 rounded-3xl border-2 border-amber-500/50 max-w-md mx-auto text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border-2 border-amber-400/60 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
              <span>आधिकारिक सुरक्षित सिस्टम</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">🔒 IOIS एडमिन कंट्रोल पैनल</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              यूजर पेमेंट्स, सत्यापन स्क्रीनशॉट, डाउनलाइन ट्री व टिकट्स के संचालन हेतु अधिकृत एडमिन पासवर्ड दर्ज करें:
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-3.5">
            <div className="relative">
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Admin Password दर्ज करें..."
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 text-white rounded-xl px-4 py-3 text-center text-sm font-bold tracking-widest outline-none transition shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition transform hover:scale-[1.02] active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>एडमिन पैनल अनलॉक करें (UNLOCK ADMIN)</span>
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

      {/* Admin Stats & Tab Bar (8 Comprehensive Management Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'approvals'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">लंबित अप्रूवल</span>
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="text-lg font-black text-amber-400 mt-1">{pendingCount} यूज़र्स</div>
        </button>

        <button
          onClick={() => setActiveTab('all_users')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'all_users'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">कुल सदस्य</span>
            <Users className="w-4 h-4 text-sky-400 shrink-0" />
          </div>
          <div className="text-lg font-black text-white mt-1">{usersList.length} यूज़र्स</div>
        </button>

        <button
          onClick={() => setActiveTab('genealogy')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'genealogy'
              ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/15 ring-1 ring-amber-400'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-300">डाउनलाइन ट्री</span>
            <Network className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="text-xs font-black text-white mt-1">किसके नीचे कौन</div>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'audit_logs'
              ? 'bg-purple-500/25 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/15 ring-1 ring-purple-400'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-300">एडिट हिस्ट्री</span>
            <History className="w-4 h-4 text-purple-400 shrink-0" />
          </div>
          <div className="text-xs font-black text-white mt-1">ऑडिट लॉग्स</div>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'tickets'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">हेल्प टिकट्स</span>
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-lg font-black text-emerald-400 mt-1">{openTicketCount} टिकट्स</div>
        </button>

        <button
          onClick={() => setActiveTab('ai_bot')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'ai_bot'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-300">AI बॉट ज्ञान</span>
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="text-xs font-black text-white mt-1">नॉलेज बेस</div>
        </button>

        <button
          onClick={() => setActiveTab('interviews')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'interviews'
              ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-300">इंटरव्यू टेस्ट्स</span>
            <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-xs font-black text-white mt-1">15-सवाल रिपोर्ट</div>
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

                        {/* Actions: View Form, Impersonate Dashboard, Downline Tree, Edit History, Approve, Reject, Delete */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => setSelectedFormUser(u)}
                              title="पंजीकरण फॉर्म विवरण देखें (Full Submitted Form)"
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <FileSpreadsheet className="w-3 h-3 text-amber-400" />
                              <span>फॉर्म</span>
                            </button>

                            <button
                              onClick={() => setImpersonateUser(u)}
                              title="यूजर का लाइव डैशबोर्ड देखें (Live Student Dashboard)"
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-sky-500/40 text-sky-300 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <UserCheck className="w-3 h-3 text-sky-400" />
                              <span>डैशबोर्ड</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedGenealogyUserId(u.userId);
                                setActiveTab('genealogy');
                              }}
                              title="डाउनलाइन नेटवर्क ट्री देखें"
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 rounded-lg transition cursor-pointer"
                            >
                              <Network className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setSelectedAuditUser(u)}
                              title="यूजर प्रोफाइल एडिट हिस्ट्री (Audit Log)"
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 rounded-lg transition cursor-pointer"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>

                            {u.paymentStatus !== 'approved' && (
                              <button
                                onClick={() => handleApprove(u.userId)}
                                title="स्वीकृत करें (Approve)"
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {u.paymentStatus !== 'rejected' && (
                              <button
                                onClick={() => {
                                  setPreviewUser(u);
                                }}
                                title="अस्वीकृत करें (Reject with Reason)"
                                className="p-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition cursor-pointer shadow-sm"
                              >
                                <XCircle className="w-3.5 h-3.5" />
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

      {/* ========================================================= */}
      {/* TAB: REFERRAL GENEALOGY NETWORK TREE (KIS USER KE NICHE KYA HAI) */}
      {/* ========================================================= */}
      {activeTab === 'genealogy' && (
        <div className="glass-card p-5 sm:p-7 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-amber-400" />
                <span>रेफरल नेटवर्क व डाउनलाइन ट्री (Genealogy Network Inspector)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                किसी भी सदस्य का स्पॉन्सर कौन है, उसके नीचे कितने सदस्य जुड़े हैं और किसने कितना रेफरल किया — संपूर्ण विवरण।
              </p>
            </div>

            {/* Select User to Inspect */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-bold shrink-0">यूजर चुनें:</span>
              <select
                value={selectedGenealogyUserId || (usersList[0]?.userId || '')}
                onChange={(e) => setSelectedGenealogyUserId(e.target.value)}
                className="bg-slate-950 border border-amber-500/50 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-mono transition cursor-pointer max-w-xs truncate"
              >
                {usersList.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.fullName} ({u.userId}) - {u.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render Tree for Target User */}
          {(() => {
            const currentRootId = selectedGenealogyUserId || usersList[0]?.userId || '';
            const rootUser = usersList.find((u) => u.userId.toUpperCase() === currentRootId.toUpperCase()) || usersList[0];
            if (!rootUser) {
              return <div className="text-center text-xs text-slate-400 py-8">कोई यूजर उपलब्ध नहीं है।</div>;
            }

            const stats = getDownlineStats(rootUser.userId, usersList);
            const allDownlines = getAllDownlinesRecursive(rootUser.userId, usersList);
            const directList = getDirectDownlines(rootUser.userId, usersList);
            const rootPlan = PLANS.find((p) => p.id === rootUser.selectedPlanId) || PLANS[0];
            const sponsorUser = rootUser.sponsorId 
              ? usersList.find((u) => u.userId.toUpperCase() === rootUser.sponsorId?.toUpperCase())
              : null;

            return (
              <div className="space-y-6">
                {/* Stats Summary for this user */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/30">
                    <span className="text-[10px] text-slate-400 block font-bold">डायरेक्ट सदस्य (L1)</span>
                    <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{stats.directCount}</div>
                  </div>
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-sky-500/30">
                    <span className="text-[10px] text-slate-400 block font-bold">कुल टीम (All Levels)</span>
                    <div className="text-xl font-black text-sky-400 font-mono mt-0.5">{stats.totalDownlinesCount}</div>
                  </div>
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/30">
                    <span className="text-[10px] text-slate-400 block font-bold">सक्रिय सदस्य</span>
                    <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{stats.approvedCount}</div>
                  </div>
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/30">
                    <span className="text-[10px] text-slate-400 block font-bold">पेंडिंग समीक्षा</span>
                    <div className="text-xl font-black text-amber-300 font-mono mt-0.5">{stats.pendingCount}</div>
                  </div>
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-green-500/40 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-emerald-300 block font-bold">वितरित इंसेंटिव</span>
                    <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">₹{stats.totalEarningsApproved}</div>
                  </div>
                </div>

                {/* Root Member Card with Sponsor Info */}
                <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-400/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0">
                      <img src={rootUser.photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-white text-base">{rootUser.fullName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded-lg">
                          ROOT: {rootUser.userId}
                        </span>
                        <span className="text-[10px] text-slate-300 font-semibold">
                          {rootPlan.name} (₹{rootPlan.price})
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                        <span>📱 {rootUser.mobileNumber}</span>
                        <span>•</span>
                        <span>
                          स्पॉन्सर: {sponsorUser ? (
                            <strong className="text-amber-300">{sponsorUser.fullName} ({sponsorUser.userId})</strong>
                          ) : rootUser.sponsorId ? (
                            <strong className="text-amber-300">{rootUser.sponsorId}</strong>
                          ) : (
                            <span className="text-slate-400">Direct Official Platform (Top)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedFormUser(rootUser)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>फॉर्म विवरण</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImpersonateUser(rootUser)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-sky-500/40 text-sky-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>लाइव डैशबोर्ड</span>
                    </button>
                  </div>
                </div>

                {/* Level 1 & Downline Members Tree View */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>{rootUser.fullName} के नीचे जुड़े सदस्य ({allDownlines.length}):</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      Direct: {directList.length} | Multi-Level: {allDownlines.length - directList.length}
                    </span>
                  </div>

                  {allDownlines.length === 0 ? (
                    <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
                      इस यूजर के नीचे वर्तमान में कोई डाउनलाइन सदस्य पंजीकृत नहीं है।
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {allDownlines.map((item) => {
                        const isDirect = item.level === 1;
                        return (
                          <div
                            key={item.user.userId}
                            className={`p-4 rounded-2xl border transition space-y-3 ${
                              isDirect 
                                ? 'bg-slate-950 border-amber-500/40 hover:border-amber-400' 
                                : 'bg-slate-950/70 border-slate-800 hover:border-sky-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isDirect 
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              }`}>
                                Level {item.level} {isDirect ? '(Direct)' : `(Under: ${item.directSponsorName})`}
                              </span>

                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                item.user.paymentStatus === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {item.user.paymentStatus.toUpperCase()}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                                <img src={item.user.photoUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="overflow-hidden">
                                <div className="font-bold text-white text-xs truncate">{item.user.fullName}</div>
                                <div className="font-mono text-[10px] text-amber-400">{item.user.userId}</div>
                                <div className="text-[10px] text-slate-400">{item.planName} (₹{item.planPrice})</div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                              <span className="text-[10px] text-slate-400">
                                इंसेंटिव: <strong className="text-emerald-400 font-mono">₹{isDirect ? item.instantPayout : Math.round(item.instantPayout * 0.2)}</strong>
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedFormUser(item.user)}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 rounded-lg text-[10px] font-bold cursor-pointer"
                                  title="पंजीकरण फॉर्म"
                                >
                                  फॉर्म
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setImpersonateUser(item.user)}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 rounded-lg text-[10px] font-bold cursor-pointer"
                                  title="लाइव डैशबोर्ड"
                                >
                                  डैशबोर्ड
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedGenealogyUserId(item.user.userId);
                                  }}
                                  className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg cursor-pointer"
                                  title="इस सदस्य का नेटवर्क ट्री खोलें"
                                >
                                  <Network className="w-3.5 h-3.5 text-amber-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: AUDIT LOGS (USER NE KYA EDIT KIYA, KAB KIYA) */}
      {/* ========================================================= */}
      {activeTab === 'audit_logs' && (
        <div className="glass-card p-5 sm:p-7 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                <span>यूजर प्रोफाइल ऑडिट व एडिट हिस्ट्री (Profile Change Log)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                यूजर ने अपनी प्रोफाइल (UPI ID, पता, मोबाइल, फोटो आदि) में क्या बदलाव किया, उसका समय और पिछला व नया मान।
              </p>
            </div>

            <div className="text-xs text-purple-300 font-bold bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/30">
              Live Audit Tracking
            </div>
          </div>

          {/* Audit History Timeline */}
          {(() => {
            const allLogs: Array<{
              userId: string;
              userName: string;
              field: string;
              fieldLabelHi: string;
              oldValue?: string;
              newValue?: string;
              timestamp: string;
            }> = [];

            usersList.forEach((u) => {
              if (u.editHistory && Array.isArray(u.editHistory)) {
                u.editHistory.forEach((log) => {
                  allLogs.push({
                    userId: u.userId,
                    userName: u.fullName,
                    field: log.field,
                    fieldLabelHi: log.fieldLabelHi || log.field,
                    oldValue: log.oldValue,
                    newValue: log.newValue,
                    timestamp: log.timestamp,
                  });
                });
              }
            });

            // Sort newest first
            allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            if (allLogs.length === 0) {
              return (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <History className="w-8 h-8 mx-auto text-slate-600" />
                  <p>अभी तक किसी यूजर ने अपनी प्रोफाइल एडिट नहीं की है। जब भी कोई सदस्य विवरण बदलेगा, यहाँ स्वतः दर्ज हो जाएगा।</p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {allLogs.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-purple-500/40 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{item.userName}</span>
                        <span className="font-mono text-[10px] text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">
                          {item.userId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {item.fieldLabelHi} बदला गया
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs flex-wrap pt-1">
                        <span className="text-red-400 font-mono line-through bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20">
                          पुराना: {item.oldValue || '(रिक्त)'}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          नया: {item.newValue || '(रिक्त)'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 shrink-0 font-mono">
                      {new Date(item.timestamp).toLocaleString('hi-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
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

      {/* ========================================================= */}
      {/* MODAL 1: FULL SUBMITTED REGISTRATION FORM INSPECTOR */}
      {/* ========================================================= */}
      {selectedFormUser && (() => {
        const plan = PLANS.find((p) => p.id === selectedFormUser.selectedPlanId) || PLANS[0];
        const sponsor = selectedFormUser.sponsorId
          ? usersList.find((u) => u.userId.toUpperCase() === selectedFormUser.sponsorId?.toUpperCase())
          : null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-4xl rounded-3xl p-5 sm:p-7 shadow-2xl relative text-white space-y-5 my-4 max-h-[92vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-950 shadow-md">
                    <img src={selectedFormUser.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-black text-white">{selectedFormUser.fullName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        selectedFormUser.paymentStatus === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : selectedFormUser.paymentStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {selectedFormUser.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                      <span className="font-mono text-amber-300 font-bold">User ID: {selectedFormUser.userId}</span>
                      <span>•</span>
                      <span>{selectedFormUser.role}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFormUser(null)}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Submissions Header Notice */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-300">
                <span className="flex items-center gap-2 font-bold">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <span>रजिस्ट्रेशन के समय सबमिट किया गया मूल विवरण (Official Registration Record)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(selectedFormUser.createdAt).toLocaleString('hi-IN')}
                </span>
              </div>

              {/* 4 Multi-Column Data Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Block 1: Personal & Identity Info */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <h4 className="font-black text-amber-400 border-b border-slate-850 pb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>1. व्यक्तिगत व पारिवारिक विवरण</span>
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-slate-400">आवेदक का पूरा नाम:</span> <strong className="text-white">{selectedFormUser.fullName}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">पिता / पति का नाम:</span> <strong className="text-white">{selectedFormUser.fatherOrHusbandName || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">माता का नाम:</span> <strong className="text-white">{selectedFormUser.motherName || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">जन्मतिथि (DOB):</span> <strong className="text-white">{selectedFormUser.dob || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">जेंडर (Gender):</span> <strong className="text-white">{selectedFormUser.gender || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">शैक्षणिक योग्यता:</span> <strong className="text-white">{selectedFormUser.qualification || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">आधार संख्या (मास्क्ड):</span> <strong className="text-amber-300 font-mono">{selectedFormUser.aadhaarNumber || 'XXXX-XXXX-****'}</strong></div>
                  </div>
                </div>

                {/* Block 2: Contact & Address */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <h4 className="font-black text-sky-400 border-b border-slate-850 pb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>2. संपर्क व पता विवरण</span>
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-slate-400">मोबाइल नंबर:</span> <strong className="text-white font-mono">{selectedFormUser.mobileNumber}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">ईमेल आईडी:</span> <strong className="text-white">{selectedFormUser.email}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">स्थायी पता:</span> <strong className="text-white text-right max-w-[200px]">{selectedFormUser.address || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">जिला (District):</span> <strong className="text-white">{selectedFormUser.district || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">राज्य (State):</span> <strong className="text-white">{selectedFormUser.state || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">पिनकोड:</span> <strong className="text-white font-mono">{selectedFormUser.pincode || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">आपातकालीन संपर्क:</span> <strong className="text-amber-300 font-mono">{selectedFormUser.emergencyContact || 'उपलब्ध नहीं'}</strong></div>
                  </div>
                </div>

                {/* Block 3: Selected Plan & Payout */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <h4 className="font-black text-emerald-400 border-b border-slate-850 pb-1.5 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>3. चयनित योजना (Subscription Plan)</span>
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-slate-400">प्लान नाम:</span> <strong className="text-white">{plan.name}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">प्लान कोड:</span> <strong className="text-amber-400 font-mono">{plan.code}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">सदस्यता शुल्क:</span> <strong className="text-emerald-400 font-mono text-sm">₹{plan.price}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">रेफरल इंसेंटिव दर:</span> <strong className="text-amber-400">{plan.percentage}% (₹{plan.instantPayout} प्रति रेफरल)</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">पेआउट UPI आईडी:</span> <strong className="text-amber-300 font-mono">{selectedFormUser.payoutUpi || 'सेट नहीं'}</strong></div>
                  </div>
                </div>

                {/* Block 4: Sponsor & Verification Link */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <h4 className="font-black text-purple-400 border-b border-slate-850 pb-1.5 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5" />
                    <span>4. स्पॉन्सर व सत्यापन विवरण</span>
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-slate-400">स्पॉन्सर ID:</span> <strong className="text-amber-300 font-mono">{selectedFormUser.sponsorId || 'Direct Official Platform'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">स्पॉन्सर का नाम:</span> <strong className="text-white">{sponsor ? sponsor.fullName : selectedFormUser.sponsorId ? selectedFormUser.sponsorId : 'IOIS System Direct'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">पेमेंट UTR नंबर:</span> <strong className="text-emerald-400 font-mono">{selectedFormUser.paymentUtr || 'उपलब्ध नहीं'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">भुगतान मोड:</span> <strong className="text-white">{selectedFormUser.paymentMode || 'UPI'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">सत्यापन स्थिति:</span> <strong className="text-white">{selectedFormUser.paymentStatus.toUpperCase()}</strong></div>
                    {selectedFormUser.verifiedAt && (
                      <div className="flex justify-between"><span className="text-slate-400">वेरिफाइड दिनांक:</span> <strong className="text-white">{new Date(selectedFormUser.verifiedAt).toLocaleString('hi-IN')}</strong></div>
                    )}
                  </div>
                </div>

              </div>

              {/* Payment Proof Attachments */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">अपलोड किया गया पेमेंट स्क्रीनशॉट प्रूफ:</span>
                {selectedFormUser.paymentScreenshotUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-40 h-40 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                      <img
                        src={selectedFormUser.paymentScreenshotUrl}
                        alt="Payment Screenshot"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="text-slate-300">
                        UTR: <strong className="text-emerald-400 font-mono">{selectedFormUser.paymentUtr || 'N/A'}</strong>
                      </p>
                      <a
                        href={selectedFormUser.paymentScreenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>फुल स्क्रीन में देखें →</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">कोई स्क्रीनशॉट इमेज उपलब्ध नहीं है।</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setImpersonateUser(selectedFormUser);
                      setSelectedFormUser(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>लाइव स्टूडेंट डैशबोर्ड देखें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGenealogyUserId(selectedFormUser.userId);
                      setActiveTab('genealogy');
                      setSelectedFormUser(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Network className="w-4 h-4" />
                    <span>डाउनलाइन ट्री देखें</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedFormUser.paymentStatus !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleApprove(selectedFormUser.userId);
                        setSelectedFormUser((prev) => prev ? { ...prev, paymentStatus: 'approved' } : null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>अप्रूव करें</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedFormUser(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    बंद करें
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* MODAL 2: LIVE USER DASHBOARD INSPECTION (IMPERSONATION) */}
      {/* ========================================================= */}
      {impersonateUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border-2 border-sky-500/50 w-full max-w-5xl rounded-3xl p-4 sm:p-6 shadow-2xl relative text-white space-y-4 my-4 max-h-[94vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  <UserCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    लाइव स्टूडेंट डैशबोर्ड प्रीव्यू: <span className="text-amber-400">{impersonateUser.fullName}</span> ({impersonateUser.userId})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    एडमिन व्यू: यह छात्र अपने डैशबोर्ड में क्या देख रहा है, उसका लाइव सटीक प्रीव्यू।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setImpersonateUser(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Live Student Referral Hub for this user */}
            <div className="p-1">
              <StudentReferralHub user={impersonateUser} />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setImpersonateUser(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                प्रीव्यू बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: SINGLE USER PROFILE EDIT HISTORY POPUP */}
      {/* ========================================================= */}
      {selectedAuditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-purple-500/50 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-white space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedAuditUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <History className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-base font-black text-white">
                  एडिट हिस्ट्री: {selectedAuditUser.fullName}
                </h3>
                <span className="font-mono text-xs text-amber-300">ID: {selectedAuditUser.userId}</span>
              </div>
            </div>

            {(!selectedAuditUser.editHistory || selectedAuditUser.editHistory.length === 0) ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                इस यूजर ने रजिस्ट्रेशन के बाद अपनी प्रोफाइल में कोई बदलाव नहीं किया है।
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedAuditUser.editHistory.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-300">{item.fieldLabelHi || item.field}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleString('hi-IN')}
                      </span>
                    </div>
                    <div className="text-[11px] flex items-center gap-2 pt-0.5">
                      <span className="text-red-400 line-through">पहले: {item.oldValue || '(रिक्त)'}</span>
                      <span>→</span>
                      <span className="text-emerald-400 font-bold">नया: {item.newValue || '(रिक्त)'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAuditUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
