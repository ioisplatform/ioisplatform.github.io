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
  maskMobile,
  adminUpdateUserProfileAsync
} from '../services/userService';
import { AiKnowledgeManager } from './AiKnowledgeManager';
import { InterviewListManager } from './InterviewListManager';
import { StudentReferralHub } from './StudentReferralHub';
import { IDCardGenerator } from './IDCardGenerator';
import { PrivateChatMessenger } from './PrivateChatMessenger';
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
  FileSpreadsheet,
  Copy,
  Check,
  MessageCircle,
  Edit3,
  Key
} from 'lucide-react';

interface AdminPanelProps {
  onUserStatusChange?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onUserStatusChange }) => {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => isAdminLoggedIn());
  const [adminPin, setAdminPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'approvals' | 'all_users' | 'genealogy' | 'audit_logs' | 'private_chat' | 'tickets' | 'ai_bot' | 'interviews'>('approvals');
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

  // Master User Profile Inspector State
  const [inspectedUser, setInspectedUser] = useState<UserProfile | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'profile' | 'contact' | 'payment' | 'team' | 'audit'>('profile');
  const [copiedInspectUtr, setCopiedInspectUtr] = useState<boolean>(false);
  const [copiedInspectId, setCopiedInspectId] = useState<boolean>(false);
  const [copiedInspectPassword, setCopiedInspectPassword] = useState<boolean>(false);

  // Direct Private Chat Selection
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>('');

  // Admin Direct User Edit Modal State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFullName, setEditFullName] = useState<string>('');
  const [editUsername, setEditUsername] = useState<string>('');
  const [editPassword, setEditPassword] = useState<string>('');
  const [editMobile, setEditMobile] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPlanId, setEditPlanId] = useState<number>(1);
  const [editPayoutUpi, setEditPayoutUpi] = useState<string>('');
  const [editRole, setEditRole] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [isSavingAdminEdit, setIsSavingAdminEdit] = useState<boolean>(false);
  const [adminEditSuccess, setAdminEditSuccess] = useState<string>('');
  const [adminEditError, setAdminEditError] = useState<string>('');

  // Enhanced Admin Inspection States
  const [selectedFormUser, setSelectedFormUser] = useState<UserProfile | null>(null);
  const [impersonateUser, setImpersonateUser] = useState<UserProfile | null>(null);
  const [selectedAuditUser, setSelectedAuditUser] = useState<UserProfile | null>(null);
  const [selectedGenealogyUserId, setSelectedGenealogyUserId] = useState<string>('');

  const openAdminEditUser = (u: UserProfile) => {
    setEditingUser(u);
    setEditFullName(u.fullName || '');
    setEditUsername(u.username || '');
    setEditPassword(u.password || '');
    setEditMobile(u.mobileNumber || '');
    setEditEmail(u.email || '');
    setEditPlanId(u.selectedPlanId || 1);
    setEditPayoutUpi(u.payoutUpi || '');
    setEditRole(u.role || 'Verified Elite Member');
    setEditStatus(u.paymentStatus || 'approved');
    setAdminEditSuccess('');
    setAdminEditError('');
  };

  const handleSaveAdminUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSavingAdminEdit(true);
    setAdminEditError('');
    setAdminEditSuccess('');

    try {
      const updated = await adminUpdateUserProfileAsync(editingUser.userId, {
        fullName: editFullName.trim(),
        username: editUsername.trim().toLowerCase().replace(/^@/, '') || undefined,
        password: editPassword.trim(),
        mobileNumber: editMobile.trim(),
        email: editEmail.trim(),
        selectedPlanId: editPlanId,
        payoutUpi: editPayoutUpi.trim(),
        role: editRole,
        paymentStatus: editStatus
      });

      if (updated) {
        setAdminEditSuccess('✅ यूजर प्रोफाइल सफलतापूर्वक अपडेट हो गई!');
        await reloadData();
        if (inspectedUser && inspectedUser.userId === editingUser.userId) {
          setInspectedUser(updated);
        }
        setTimeout(() => {
          setEditingUser(null);
          setAdminEditSuccess('');
        }, 1500);
      } else {
        setAdminEditError('यूजर प्रोफाइल अपडेट नहीं हो सकी।');
      }
    } catch (err: any) {
      setAdminEditError(err.message || 'त्रुटि हुई।');
    } finally {
      setIsSavingAdminEdit(false);
    }
  };

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
    if (inspectedUser && inspectedUser.userId === userId) {
      setInspectedUser((prev) => prev ? { ...prev, paymentStatus: 'approved', verifiedAt: new Date().toISOString() } : null);
    }
    if (selectedFormUser && selectedFormUser.userId === userId) {
      setSelectedFormUser((prev) => prev ? { ...prev, paymentStatus: 'approved', verifiedAt: new Date().toISOString() } : null);
    }
    if (onUserStatusChange) onUserStatusChange();
  };

  const handleReject = async (userId: string, customReason?: string) => {
    const reason = customReason || rejectReasonInput || 'अमान्य पेमेंट स्क्रीनशॉट / UTR';
    setPaymentStatus(userId, 'rejected', reason);
    await reloadData();
    setRejectReasonInput('');
    if (previewUser && previewUser.userId === userId) {
      setPreviewUser((prev) => prev ? { ...prev, paymentStatus: 'rejected', rejectionReason: reason } : null);
    }
    if (inspectedUser && inspectedUser.userId === userId) {
      setInspectedUser((prev) => prev ? { ...prev, paymentStatus: 'rejected', rejectionReason: reason } : null);
    }
    if (selectedFormUser && selectedFormUser.userId === userId) {
      setSelectedFormUser((prev) => prev ? { ...prev, paymentStatus: 'rejected', rejectionReason: reason } : null);
    }
    if (onUserStatusChange) onUserStatusChange();
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (window.confirm(`क्या आप यूजर "${name}" (${userId}) को सिस्टम से हमेशा के लिए हटाना चाहते हैं?`)) {
      await deleteUserAccount(userId);
      await reloadData();
      if (previewUser && previewUser.userId === userId) {
        setPreviewUser(null);
      }
      if (inspectedUser && inspectedUser.userId === userId) {
        setInspectedUser(null);
      }
      if (selectedFormUser && selectedFormUser.userId === userId) {
        setSelectedFormUser(null);
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
    <section id="admin-panel" className="scroll-mt-24 space-y-4">
      {/* Admin Header - Compact & Sleek */}
      <div className="glass-card-gold p-3.5 sm:p-4 rounded-2xl border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9.5px] font-black uppercase mb-1">
            <ShieldAlert className="w-3 h-3" />
            <span>OFFICIAL ADMIN CONSOLE</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            👑 IOIS <span className="gold-text">एडमिन कंट्रोल व वेरिफिकेशन पैनल</span>
          </h2>
          <p className="text-[11px] text-slate-300">
            यूजर रजिस्ट्रेशन, पेमेंट स्क्रीनशॉट्स, अप्रूवल/रिजेक्शन और प्राइवेट चैट यहाँ से नियंत्रित करें।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reloadData}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>{isRefreshing ? 'रिफ्रेश...' : 'रिफ्रेश'}</span>
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* Admin Stats & Tab Bar (8 Management Tabs) - Compact Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'approvals'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-slate-400">लंबित अप्रूवल</span>
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-black text-amber-400 mt-0.5">{pendingCount} यूज़र्स</div>
        </button>

        <button
          onClick={() => setActiveTab('all_users')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'all_users'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-slate-400">कुल सदस्य</span>
            <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-black text-white mt-0.5">{usersList.length} यूज़र्स</div>
        </button>

        <button
          onClick={() => setActiveTab('private_chat')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'private_chat'
              ? 'bg-sky-500/25 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-sky-300">डायरेक्ट चैट</span>
            <MessageCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          </div>
          <div className="text-[11px] font-black text-white mt-0.5">फोटो/वीडियो</div>
        </button>

        <button
          onClick={() => setActiveTab('genealogy')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'genealogy'
              ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-amber-300">डाउनलाइन ट्री</span>
            <Network className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>
          <div className="text-[11px] font-black text-white mt-0.5">टीम संरचना</div>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'audit_logs'
              ? 'bg-purple-500/25 border-purple-400 text-purple-300 shadow-md ring-1 ring-purple-400'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-purple-300">एडिट हिस्ट्री</span>
            <History className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          </div>
          <div className="text-[11px] font-black text-white mt-0.5">ऑडिट लॉग्स</div>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'tickets'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-slate-400">हेल्प टिकट्स</span>
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-black text-emerald-400 mt-0.5">{openTicketCount} टिकट्स</div>
        </button>

        <button
          onClick={() => setActiveTab('ai_bot')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'ai_bot'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-amber-300">AI बॉट ज्ञान</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>
          <div className="text-[11px] font-black text-white mt-0.5">नॉलेज बेस</div>
        </button>

        <button
          onClick={() => setActiveTab('interviews')}
          className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'interviews'
              ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
              : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-emerald-300">इंटरव्यू टेस्ट्स</span>
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          <div className="text-[11px] font-black text-white mt-0.5">15-सवाल रिपोर्ट</div>
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
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 uppercase text-[10px] font-black tracking-wider">
                  <th className="py-3.5 px-3">फोटो व नाम</th>
                  <th className="py-3.5 px-3">यूनिक User ID</th>
                  <th className="py-3.5 px-3">प्लान / शुल्क</th>
                  <th className="py-3.5 px-3">मोबाइल व संपर्क</th>
                  <th className="py-3.5 px-3">पेमेंट रसीद / UTR</th>
                  <th className="py-3.5 px-3">सत्यापन स्थिति</th>
                  <th className="py-3.5 px-3 text-right">त्वरित एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      कोई यूजर रिकॉर्ड नहीं मिला।
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const plan = PLANS.find((p) => p.id === u.selectedPlanId) || PLANS[0];
                    return (
                      <tr key={u.userId} className="hover:bg-slate-900/60 transition group">
                        {/* Name & Photo */}
                        <td className="py-3.5 px-3">
                          <div 
                            onClick={() => { setInspectedUser(u); setInspectorTab('profile'); }}
                            className="flex items-center gap-3 cursor-pointer group-hover:opacity-95"
                            title="पूरी प्रोफाइल देखने हेतु क्लिक करें"
                          >
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/60 shrink-0 bg-slate-900 shadow-sm">
                              <img src={u.photoUrl} alt={u.fullName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm group-hover:text-amber-300 transition flex items-center gap-1.5">
                                <span>{u.fullName}</span>
                              </div>
                              <div className="text-[10px] text-slate-400">{u.gender || 'सदस्य'} • {u.state || 'भारत'}</div>
                            </div>
                          </div>
                        </td>

                        {/* User ID */}
                        <td className="py-3.5 px-3 font-mono font-bold text-amber-300">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(u.userId);
                            }}
                            className="hover:underline flex items-center gap-1 cursor-pointer bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"
                            title="क्लिक करके ID कॉपी करें"
                          >
                            <span>{u.userId}</span>
                          </button>
                        </td>

                        {/* Plan */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-white block">{plan.name}</span>
                          <span className="text-[11px] text-amber-400 font-mono font-black">₹{plan.price}</span>
                        </td>

                        {/* Mobile / Contact */}
                        <td className="py-3.5 px-3">
                          <div className="text-slate-200 font-mono font-medium">{u.mobileNumber}</div>
                          {u.telegramUsername ? (
                            <div className="text-[10px] text-sky-400 flex items-center gap-1 mt-0.5">
                              <Send className="w-2.5 h-2.5" />
                              <span>{u.telegramUsername}</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{u.email}</div>
                          )}
                        </td>

                        {/* Payment Proof / UTR */}
                        <td className="py-3.5 px-3">
                          <div className="font-mono text-emerald-400 font-bold text-xs">{u.paymentUtr || 'N/A'}</div>
                          <button
                            type="button"
                            onClick={() => { setInspectedUser(u); setInspectorTab('payment'); }}
                            className="text-[11px] text-amber-400 hover:text-amber-300 underline font-bold mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>रसीद देखें</span>
                          </button>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          {u.paymentStatus === 'approved' && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>स्वीकृत</span>
                            </span>
                          )}
                          {u.paymentStatus === 'pending' && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>समीक्षाधीन</span>
                            </span>
                          )}
                          {u.paymentStatus === 'rejected' && (
                            <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-red-400" />
                              <span>अस्वीकृत</span>
                            </span>
                          )}
                        </td>

                        {/* Clear, High-Contrast Action Buttons */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Primary Button: Check Full Profile */}
                            <button
                              type="button"
                              onClick={() => { setInspectedUser(u); setInspectorTab('profile'); }}
                              title="यूजर की पूरी प्रोफाइल, फॉर्म, दस्तावेज व UTR जांचें"
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black rounded-xl text-xs inline-flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-950" />
                              <span>प्रोफाइल जांचें</span>
                            </button>

                            {/* Quick Approve Button */}
                            {u.paymentStatus !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => handleApprove(u.userId)}
                                title="1-क्लिक में पेमेंट अप्रूव करें"
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 transition cursor-pointer shadow-sm active:scale-95"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>अप्रूव</span>
                              </button>
                            )}

                            {/* Quick Reject Button */}
                            {u.paymentStatus !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const reason = window.prompt('रिजेक्शन का कारण दर्ज करें (Reason):', 'अमान्य UTR नंबर / स्क्रीनशॉट स्पष्ट नहीं');
                                  if (reason !== null && reason.trim()) {
                                    handleReject(u.userId, reason.trim());
                                  }
                                }}
                                title="पेमेंट रिजेक्ट करें"
                                className="px-2.5 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold rounded-xl text-xs inline-flex items-center gap-1 transition cursor-pointer active:scale-95"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>रिजेक्ट</span>
                              </button>
                            )}

                            {/* Downline Tree */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedGenealogyUserId(u.userId);
                                setActiveTab('genealogy');
                              }}
                              title="डाउनलाइन नेटवर्क ट्री देखें"
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 rounded-xl transition cursor-pointer"
                            >
                              <Network className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete User */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.userId, u.fullName)}
                              title="यूजर हटाएं (Delete User)"
                              className="p-1.5 bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 rounded-xl transition cursor-pointer"
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

      {/* ========================================================= */}
      {/* TAB: PRIVATE CHAT MESSENGER (DIRECT 1-ON-1 WITH USERS)   */}
      {/* ========================================================= */}
      {activeTab === 'private_chat' && (
        <div className="glass-card p-5 sm:p-7 rounded-3xl border border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-sky-400" />
                <span>डायरेक्ट प्राइवेट मैसेंजर (Direct User Messenger)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                यहाँ से किसी भी पंजीकृत छात्र/सदस्य को सीधा व्यक्तिगत संदेश, फोटो, वीडियो (YouTube/Direct) व लिंक भेजें।
              </p>
            </div>
            <span className="text-xs text-sky-300 font-bold bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/30">
              Admin to User Direct Channel
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Col: Users Thread Selector */}
            <div className="lg:col-span-4 bg-slate-950/80 rounded-2xl border border-slate-800 p-3 space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="सदस्य का नाम, ID या Username..."
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-sky-400"
                />
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
                {usersList
                  .filter((u) => {
                    const q = searchQuery.toLowerCase();
                    return (
                      u.fullName.toLowerCase().includes(q) ||
                      u.userId.toLowerCase().includes(q) ||
                      (u.username && u.username.toLowerCase().includes(q))
                    );
                  })
                  .map((u) => {
                    const isSelected = selectedChatUserId === u.userId;
                    return (
                      <button
                        key={u.userId}
                        type="button"
                        onClick={() => setSelectedChatUserId(u.userId)}
                        className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/20 border border-sky-400/60 shadow-md'
                            : 'bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                          <img src={u.photoUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-white text-xs truncate block">{u.fullName}</strong>
                            <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0">{u.userId}</span>
                          </div>
                          <div className="text-[11px] text-sky-400 font-mono truncate">
                            @{u.username || u.userId.toLowerCase()}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Right Col: Active Messenger */}
            <div className="lg:col-span-8">
              {(() => {
                const activeTargetId = selectedChatUserId || (usersList.length > 0 ? usersList[0].userId : '');
                const targetUser = usersList.find((u) => u.userId === activeTargetId);

                if (!activeTargetId || !targetUser) {
                  return (
                    <div className="p-12 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                      <MessageCircle className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs">बातचीत शुरू करने के लिए बाएँ से किसी भी सदस्य का चयन करें।</p>
                    </div>
                  );
                }

                return (
                  <PrivateChatMessenger
                    userId={activeTargetId}
                    targetUserName={targetUser.fullName}
                    currentRole="admin"
                    adminName="IOIS Official Admin"
                  />
                );
              })()}
            </div>
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

      {/* TAB 5: AI BOT KNOWLEDGE BASE & TRAINING */}
      {activeTab === 'ai_bot' && (
        <AiKnowledgeManager />
      )}

      {/* TAB 6: 15-QUESTION INTERVIEWS */}
      {activeTab === 'interviews' && (
        <InterviewListManager />
      )}

      {/* ========================================================================= */}
      {/* MASTER USER PROFILE INSPECTOR MODAL (संपूर्ण प्रोफाइल समीक्षा प्रणाली)     */}
      {/* ========================================================================= */}
      {inspectedUser && (() => {
        const plan = PLANS.find((p) => p.id === inspectedUser.selectedPlanId) || PLANS[0];
        const sponsor = inspectedUser.sponsorId
          ? usersList.find((u) => u.userId.toUpperCase() === inspectedUser.sponsorId?.toUpperCase())
          : null;
        const stats = getDownlineStats(inspectedUser.userId, usersList);
        const directList = getDirectDownlines(inspectedUser.userId, usersList);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-5xl rounded-3xl p-5 sm:p-7 shadow-[0_20px_70px_rgba(245,158,11,0.25)] relative text-white space-y-5 my-4 max-h-[94vh] overflow-y-auto">
              
              {/* Executive Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-xl">
                      <img src={inspectedUser.photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-amber-400">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-black text-white">{inspectedUser.fullName}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                        inspectedUser.paymentStatus === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : inspectedUser.paymentStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {inspectedUser.paymentStatus === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {inspectedUser.paymentStatus === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        {inspectedUser.paymentStatus === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                        <span>{inspectedUser.paymentStatus.toUpperCase()}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-300 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(inspectedUser.userId);
                          setCopiedInspectId(true);
                          setTimeout(() => setCopiedInspectId(false), 2000);
                        }}
                        className="font-mono text-amber-300 font-black bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 hover:bg-slate-900 cursor-pointer"
                        title="ID कॉपी करें"
                      >
                        <span>User ID: {inspectedUser.userId}</span>
                        {copiedInspectId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                      </button>

                      <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200 font-bold">
                        {plan.name} (₹{plan.price})
                      </span>

                      <span className="text-slate-400">
                        रजिस्ट्रेशन: {new Date(inspectedUser.createdAt).toLocaleDateString('hi-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setInspectedUser(null)}
                  className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer self-start sm:self-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fast Action Buttons Bar */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {inspectedUser.paymentStatus !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleApprove(inspectedUser.userId)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✓ पेमेंट अप्रूव करें (APPROVE)</span>
                    </button>
                  )}

                  {inspectedUser.paymentStatus !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => {
                        const reason = window.prompt('रिजेक्शन का कारण दर्ज करें (Reason):', 'अमान्य UTR नंबर / स्क्रीनशॉट स्पष्ट नहीं');
                        if (reason !== null && reason.trim()) {
                          handleReject(inspectedUser.userId, reason.trim());
                        }
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>✕ रिजेक्ट करें (REJECT)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChatUserId(inspectedUser.userId);
                      setActiveTab('private_chat');
                      setInspectedUser(null);
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    title="इस यूजर को प्राइवेट चैट, फोटो, वीडियो या लिंक भेजें"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>💬 प्राइवेट चैट</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openAdminEditUser(inspectedUser)}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    title="एडमिन द्वारा प्रोफाइल, पासवर्ड व प्लान एडिट करें"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>✏️ प्रोफाइल एडिट</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImpersonateUser(inspectedUser);
                      setInspectedUser(null);
                    }}
                    className="px-3.5 py-2 bg-sky-900/80 hover:bg-sky-800 border border-sky-400/50 text-sky-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>लाइव स्टूडेंट डैशबोर्ड</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGenealogyUserId(inspectedUser.userId);
                      setActiveTab('genealogy');
                      setInspectedUser(null);
                    }}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5 text-amber-400" />
                    <span>डाउनलाइन ट्री</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteUser(inspectedUser.userId, inspectedUser.fullName)}
                  className="px-3 py-2 bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>यूजर हटाएं</span>
                </button>
              </div>

              {/* Inspector Sub-Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setInspectorTab('profile')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    inspectorTab === 'profile'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>1. व्यक्तिगत विवरण</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorTab('contact')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    inspectorTab === 'contact'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>2. संपर्क व टेलीग्राम</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorTab('payment')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    inspectorTab === 'payment'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>3. पेमेंट रसीद व UTR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorTab('team')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    inspectorTab === 'team'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>4. टीम व स्पॉन्सर</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorTab('audit')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1 ${
                    inspectorTab === 'audit'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>5. एडिट हिस्ट्री</span>
                </button>
              </div>

              {/* Sub-Tab 1: Personal Information */}
              {inspectorTab === 'profile' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Executive Credentials Card (Clear Text Password & Username) */}
                  <div className="p-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/50 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                      <span className="text-amber-400 text-xs font-black uppercase flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>लॉगिन क्रेडेंशियल्स व यूजरनेम (Login Credentials & Password)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => openAdminEditUser(inspectedUser)}
                        className="text-[11px] font-bold text-amber-300 hover:text-white underline cursor-pointer"
                      >
                        पासवर्ड / विवरण बदलें →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">User ID (सिस्टम कोड):</span>
                        <div className="flex items-center justify-between mt-1">
                          <strong className="text-amber-300 font-mono text-sm font-black">{inspectedUser.userId}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(inspectedUser.userId);
                              setCopiedInspectId(true);
                              setTimeout(() => setCopiedInspectId(false), 2000);
                            }}
                            className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                          >
                            {copiedInspectId ? '✓ कॉपी हुआ' : 'कॉपी'}
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-sky-500/40">
                        <span className="text-sky-300 block text-[10px] font-bold">कस्टम Telegram-स्टाइल @Username:</span>
                        <strong className="text-white font-mono text-sm block mt-1">
                          @{inspectedUser.username || inspectedUser.userId.toLowerCase()}
                        </strong>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border-2 border-emerald-500/50">
                        <span className="text-emerald-400 block text-[10px] font-black uppercase">लॉगिन पासवर्ड (CLEAR TEXT):</span>
                        <div className="flex items-center justify-between mt-1">
                          <strong className="text-white font-mono text-base font-black tracking-wider select-all">
                            {inspectedUser.password || 'IOIS1234'}
                          </strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(inspectedUser.password || '');
                              setCopiedInspectPassword(true);
                              setTimeout(() => setCopiedInspectPassword(false), 2000);
                            }}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition shadow"
                          >
                            {copiedInspectPassword ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedInspectPassword ? 'कॉपी हुआ' : 'कॉपी पासवर्ड'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Users className="w-4 h-4" />
                      <span>मूल व्यक्तिगत व पारिवारिक विवरण (Personal Records)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">आवेदक का पूरा नाम:</span>
                        <strong className="text-white text-sm">{inspectedUser.fullName}</strong>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">पिता / पति का नाम:</span>
                        <strong className="text-white">{inspectedUser.fatherOrHusbandName || 'उपलब्ध नहीं'}</strong>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">माता का नाम:</span>
                        <strong className="text-white">{inspectedUser.motherName || 'उपलब्ध नहीं'}</strong>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">जन्मतिथि (DOB):</span>
                        <strong className="text-white">{inspectedUser.dob || 'उपलब्ध नहीं'}</strong>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">जेंडर (Gender):</span>
                        <strong className="text-white">{inspectedUser.gender || 'उपलब्ध नहीं'}</strong>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">शैक्षणिक योग्यता:</span>
                        <strong className="text-white">{inspectedUser.qualification || 'उपलब्ध नहीं'}</strong>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">आधार संख्या (मास्क्ड):</span>
                        <strong className="text-amber-300 font-mono">{inspectedUser.aadhaarNumber || 'XXXX-XXXX-****'}</strong>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">आधिकारिक रोल:</span>
                        <strong className="text-sky-300">{inspectedUser.role}</strong>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">पंजीकरण समय:</span>
                        <strong className="text-slate-200">{new Date(inspectedUser.createdAt).toLocaleString('hi-IN')}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Contact, Telegram & Address */}
              {inspectorTab === 'contact' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-black text-sky-400 text-xs uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Phone className="w-4 h-4" />
                      <span>संपर्क माध्यम व भौगोलिक पता (Contact & Address Details)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      {/* Mobile */}
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-slate-400 block text-[10px]">मोबाइल नंबर:</span>
                        <strong className="text-white font-mono text-base block">{inspectedUser.mobileNumber}</strong>
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`tel:${inspectedUser.mobileNumber}`}
                            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>कॉल करें</span>
                          </a>
                          <a
                            href={`https://wa.me/91${inspectedUser.mobileNumber.replace(/\D/g, '').slice(-10)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-[10px] font-bold border border-green-500/30 flex items-center gap-1"
                          >
                            <span>WhatsApp चैट</span>
                          </a>
                        </div>
                      </div>

                      {/* Telegram Username */}
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-sky-500/40 space-y-2">
                        <span className="text-sky-400 block text-[10px] font-black uppercase">Telegram Username या Link:</span>
                        {inspectedUser.telegramUsername ? (
                          <>
                            <strong className="text-sky-300 font-mono text-sm block">{inspectedUser.telegramUsername}</strong>
                            <a
                              href={`https://t.me/${inspectedUser.telegramUsername.replace('@', '').replace('https://t.me/', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-lg text-[11px] transition"
                            >
                              <Send className="w-3 h-3" />
                              <span>टेलीग्राम खोलें →</span>
                            </a>
                          </>
                        ) : (
                          <span className="text-slate-400 italic text-xs block">यूजर द्वारा दर्ज नहीं किया गया (ऐच्छिक)</span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-slate-400 block text-[10px]">ईमेल पता:</span>
                        <strong className="text-white text-xs block break-all">{inspectedUser.email}</strong>
                        <a
                          href={`mailto:${inspectedUser.email}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-amber-300 rounded-lg text-[10px] font-bold border border-slate-700"
                        >
                          <Mail className="w-3 h-3" />
                          <span>ईमेल भेजें</span>
                        </a>
                      </div>

                      {/* Full Address */}
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-slate-400 block text-[10px]">स्थायी पता:</span>
                        <strong className="text-white text-xs block leading-relaxed">{inspectedUser.address || 'उपलब्ध नहीं'}</strong>
                      </div>

                      {/* District & State */}
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">जिला, राज्य व पिनकोड:</span>
                        <strong className="text-white text-xs block">
                          {inspectedUser.district || 'N/A'}, {inspectedUser.state || 'N/A'} - {inspectedUser.pincode || ''}
                        </strong>
                      </div>

                      {/* Emergency Contact */}
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">आपातकालीन संपर्क:</span>
                        <strong className="text-amber-300 font-mono text-xs block">{inspectedUser.emergencyContact || 'उपलब्ध नहीं'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: Payment Proof, UTR & Verification */}
              {inspectorTab === 'payment' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* Left: UTR & Plan Info */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                        <CreditCard className="w-4 h-4" />
                        <span>पेमेंट विवरण व 12-अंकों का UTR नंबर</span>
                      </h4>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between items-center p-2.5 bg-slate-900 rounded-xl border border-slate-850">
                          <span className="text-slate-400">चयनित प्लान:</span>
                          <strong className="text-white font-bold">{plan.name} (Code: {plan.code})</strong>
                        </div>

                        <div className="flex justify-between items-center p-2.5 bg-slate-900 rounded-xl border border-slate-850">
                          <span className="text-slate-400">सदस्यता शुल्क:</span>
                          <strong className="text-emerald-400 font-mono font-black text-sm">₹{plan.price}</strong>
                        </div>

                        <div className="flex justify-between items-center p-2.5 bg-slate-900 rounded-xl border border-slate-850">
                          <span className="text-slate-400">रेफरल इंसेंटिव दर:</span>
                          <strong className="text-amber-400 font-bold">{plan.percentage}% (₹{plan.instantPayout} प्रति रेफरल)</strong>
                        </div>

                        <div className="p-3 bg-slate-900 rounded-xl border-2 border-emerald-500/40 space-y-1">
                          <span className="text-slate-400 block text-[10px] font-bold">12-अंकों का UPI UTR नंबर:</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-base font-black text-emerald-400 select-all">
                              {inspectedUser.paymentUtr || 'दर्ज नहीं किया गया'}
                            </span>
                            {inspectedUser.paymentUtr && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(inspectedUser.paymentUtr || '');
                                  setCopiedInspectUtr(true);
                                  setTimeout(() => setCopiedInspectUtr(false), 2000);
                                }}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer"
                              >
                                {copiedInspectUtr ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedInspectUtr ? 'कॉपी हुआ' : 'कॉपी UTR'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-2.5 bg-slate-900 rounded-xl border border-slate-850">
                          <span className="text-slate-400">पेआउट UPI आईडी:</span>
                          <strong className="text-amber-300 font-mono">{inspectedUser.payoutUpi || 'सेट नहीं'}</strong>
                        </div>

                        <div className="flex justify-between items-center p-2.5 bg-slate-900 rounded-xl border border-slate-850">
                          <span className="text-slate-400">सत्यापन स्थिति:</span>
                          <strong className="text-white font-bold">{inspectedUser.paymentStatus.toUpperCase()}</strong>
                        </div>

                        {inspectedUser.verifiedAt && (
                          <div className="flex justify-between items-center p-2.5 bg-slate-900 rounded-xl border border-slate-850">
                            <span className="text-slate-400">सत्यापन दिनांक:</span>
                            <strong className="text-slate-200">{new Date(inspectedUser.verifiedAt).toLocaleString('hi-IN')}</strong>
                          </div>
                        )}
                      </div>

                      {/* Rejection input box */}
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-300">
                          रिजेक्शन का कारण (यदि रिजेक्ट कर रहे हों):
                        </label>
                        <input
                          type="text"
                          value={rejectReasonInput}
                          onChange={(e) => setRejectReasonInput(e.target.value)}
                          placeholder="उदा. UTR मिसमैच / फर्जी स्क्रीनशॉट"
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleApprove(inspectedUser.userId)}
                            className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>अप्रूव करें</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(inspectedUser.userId, rejectReasonInput)}
                            className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>रिजेक्ट करें</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Payment Screenshot */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">अपलोड किया गया पेमेंट स्क्रीनशॉट:</span>
                          {inspectedUser.paymentScreenshotUrl && (
                            <a
                              href={inspectedUser.paymentScreenshotUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1 underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>फुल स्क्रीन खोलें</span>
                            </a>
                          )}
                        </div>

                        {inspectedUser.paymentScreenshotUrl ? (
                          <div className="max-h-80 overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-slate-900 flex items-center justify-center p-2 shadow-inner">
                            <img
                              src={inspectedUser.paymentScreenshotUrl}
                              alt="Payment Proof"
                              className="max-h-72 object-contain rounded-xl"
                            />
                          </div>
                        ) : (
                          <div className="p-8 bg-slate-900 rounded-xl text-center text-slate-400 text-xs border border-slate-800">
                            सीधा इमेज स्क्रीनशॉट अपलोड नहीं किया गया।
                          </div>
                        )}
                      </div>

                      {inspectedUser.googleDrivePaymentLink && (
                        <div className="p-3 bg-sky-950/60 border border-sky-500/40 rounded-xl text-xs flex items-center justify-between mt-2">
                          <span className="text-sky-300 font-bold">Google Drive लिंक (25MB+ फ़ाइल):</span>
                          <a
                            href={inspectedUser.googleDrivePaymentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-sky-500 text-slate-950 font-black px-3 py-1 rounded-lg hover:bg-sky-400 transition"
                          >
                            Drive में खोलें →
                          </a>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Team Downlines & Sponsor */}
              {inspectorTab === 'team' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Sponsor Card */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-slate-400 text-xs block">इस यूजर का स्पॉन्सर (Referrer):</span>
                      <strong className="text-amber-300 text-sm font-mono">
                        {sponsor ? `${sponsor.fullName} (${sponsor.userId})` : inspectedUser.sponsorId || 'Direct Official Platform (Top)'}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">डायरेक्ट (L1):</span>
                        <span className="font-bold text-amber-400 font-mono text-sm">{stats.directCount}</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">कुल टीम:</span>
                        <span className="font-bold text-sky-400 font-mono text-sm">{stats.totalDownlinesCount}</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">सक्रिय सदस्य:</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">{stats.approvedCount}</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">कमाई इंसेंटिव:</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">₹{stats.totalEarningsApproved}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Downlines List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{inspectedUser.fullName} के डायरेक्ट रेफरल्स ({directList.length}):</span>
                    </h4>

                    {directList.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                        वर्तमान में कोई डायरेक्ट डाउनलाइन सदस्य पंजीकृत नहीं है।
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {directList.map((m) => {
                          const mPlan = PLANS.find((p) => p.id === m.selectedPlanId) || PLANS[0];
                          return (
                            <div key={m.userId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                                <img src={m.photoUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-1 text-xs">
                                <div className="font-bold text-white truncate">{m.fullName}</div>
                                <div className="text-[10px] text-amber-300 font-mono">{m.userId} • {mPlan.name}</div>
                              </div>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                m.paymentStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                              }`}>
                                {m.paymentStatus === 'approved' ? 'सत्यापित' : 'पेंडिंग'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sub-Tab 5: Profile Edit History / Audit Log */}
              {inspectorTab === 'audit' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <History className="w-4 h-4 text-purple-400" />
                      <span>प्रोफाइल एडिट ऑडिट लॉग्स:</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      कुल रिकॉर्ड: {inspectedUser.editHistory?.length || 0}
                    </span>
                  </div>

                  {(!inspectedUser.editHistory || inspectedUser.editHistory.length === 0) ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                      इस यूजर ने पंजीकरण के पश्चात प्रोफाइल में कोई बदलाव नहीं किया है।
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {inspectedUser.editHistory.map((item, idx) => (
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
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-400">
                  IOIS मास्टर एडमिन सत्यापन प्रणाली • 100% ऑडिट सुरक्षित
                </span>
                <button
                  type="button"
                  onClick={() => setInspectedUser(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
                >
                  निरीक्षण समाप्त करें (बंद करें)
                </button>
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

      {/* ADMIN DIRECT PROFILE EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card-gold p-6 rounded-3xl border-2 border-amber-500/50 max-w-xl w-full space-y-4 shadow-2xl animate-scaleUp my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-white">
                    एडमिन द्वारा यूजर प्रोफाइल एडिट करें
                  </h3>
                  <span className="text-[11px] font-mono text-amber-300">User ID: {editingUser.userId}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminEditSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{adminEditSuccess}</span>
              </div>
            )}

            {adminEditError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{adminEditError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAdminUserEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">पूरा नाम:</label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Custom Username */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Telegram @Username:</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="उदा. rohit_kumar"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 text-sky-300 font-mono rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-amber-300 font-bold mb-1">लॉगिन पासवर्ड (Clear Text):</label>
                  <input
                    type="text"
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-amber-500/60 focus:border-amber-400 text-amber-300 font-mono font-bold rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">मोबाइल नंबर:</label>
                  <input
                    type="tel"
                    required
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white font-mono rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ईमेल:</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Payout UPI */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">पेआउट UPI आईडी:</label>
                  <input
                    type="text"
                    value={editPayoutUpi}
                    onChange={(e) => setEditPayoutUpi(e.target.value)}
                    placeholder="उदा. 9876543210@paytm"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white font-mono rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Plan */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">चयनित प्लान:</label>
                  <select
                    value={editPlanId}
                    onChange={(e) => setEditPlanId(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    {PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price} ({p.percentage}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">अकाउंट स्थिति:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="approved">स्वीकृत (Approved)</option>
                    <option value="pending">समीक्षाधीन (Pending)</option>
                    <option value="rejected">रिजेक्ट (Rejected)</option>
                  </select>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">सदस्यता रोल / पद:</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="Verified Elite Member">Verified Elite Member</option>
                  <option value="Active Digital Learner">Active Digital Learner</option>
                  <option value="Official Youth Reseller">Official Youth Reseller</option>
                  <option value="Supreme Master Partner">Supreme Master Partner</option>
                  <option value="Student Ambassador">Student Ambassador</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSavingAdminEdit}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs hover:from-amber-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingAdminEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>बदलाव सुरक्षित करें</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
