import React, { useState, useEffect } from 'react';
import { MemberProfile } from '../types';
import { 
  fetchAllMembersFromFirestore, 
  adminUpdateStudentKitAccess, 
  adminDeleteStudent,
  adminVerifyAndActivateStudent,
  generatePlanRollNumber,
  registerStudentToDatabase,
  getStoredMembers
} from '../services/userService';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { 
  getAllPlanPasswords, 
  updatePlanPassword, 
  resetAllPlanPasswords, 
  verifyAdminPassword,
  getAdminMasterPassword,
  updateAdminMasterPassword,
  DEFAULT_ADMIN_PASSWORD
} from '../services/planPasswordService';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Search, 
  Download, 
  UserPlus, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ExternalLink, 
  Crown,
  RefreshCw,
  Edit3,
  DollarSign,
  Save,
  Layers,
  BookOpen,
  Key,
  RotateCcw,
  Users
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsersUpdated?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onUsersUpdated
}) => {
  // Authentication & Security
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Data state
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Verified' | 'Pending' | 'Rejected'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  
  // Editing Student Kit Access
  const [editingMember, setEditingMember] = useState<MemberProfile | null>(null);
  const [editPlanId, setEditPlanId] = useState('plan-01');
  const [editAmount, setEditAmount] = useState<number>(10);
  const [editStatus, setEditStatus] = useState<'Verified' | 'Pending' | 'Active' | 'Rejected'>('Verified');
  const [editAccessiblePlans, setEditAccessiblePlans] = useState<string[]>(['plan-01']);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Add Manual Student
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCity, setNewCity] = useState('पटना');
  const [newGrade, setNewGrade] = useState('कक्षा 1-5');
  const [newPlanId, setNewPlanId] = useState('plan-01');
  const [newUtr, setNewUtr] = useState('');

  // Admin Tabs: 'students' | 'passwords' | 'settings'
  const [activeAdminTab, setActiveAdminTab] = useState<'students' | 'passwords' | 'settings'>('students');
  const [planPasswords, setPlanPasswords] = useState<Record<string, string>>(() => getAllPlanPasswords());
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<Record<string, string>>({});
  const [showPlanPass, setShowPlanPass] = useState<Record<string, boolean>>({});
  const [newAdminKey, setNewAdminKey] = useState('');
  const [adminKeyMsg, setAdminKeyMsg] = useState('');
  const [viewingImage, setViewingImage] = useState<{ title: string; url: string } | null>(null);

  // Load members on auth
  useEffect(() => {
    if (isAuthenticated) {
      loadMembers();
      setPlanPasswords(getAllPlanPasswords());
    }
  }, [isAuthenticated]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllMembersFromFirestore();
      setMembers(data);
    } catch (e) {
      console.warn('Error fetching members:', e);
      setMembers(getStoredMembers());
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Master Admin Passcode Verification
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      setPasswordInput('');
      setPlanPasswords(getAllPlanPasswords());
    } else {
      setAuthError('गलत एडमिन पासवर्ड! कृपया सही अधिकृत मास्टर पासवर्ड दर्ज करें।');
    }
  };

  const handleUpdatePlanPassword = (planId: string, newPass: string) => {
    if (!newPass || newPass.trim().length < 4) {
      setPasswordStatusMsg(prev => ({ ...prev, [planId]: 'पासवर्ड कम से कम 4 अक्षरों का होना अनिवार्य है।' }));
      return;
    }
    const success = updatePlanPassword(planId, newPass);
    if (success) {
      setPlanPasswords(getAllPlanPasswords());
      setPasswordStatusMsg(prev => ({ ...prev, [planId]: '✓ पासवर्ड सफलतापूर्वक अपडेट हुआ!' }));
      setTimeout(() => {
        setPasswordStatusMsg(prev => ({ ...prev, [planId]: '' }));
      }, 3000);
    }
  };

  const handleResetAllPasswords = () => {
    if (confirm('क्या आप सभी 7 प्लान्स के पासवर्ड मूल डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      resetAllPlanPasswords();
      setPlanPasswords(getAllPlanPasswords());
      alert('सभी 7 प्लान्स के पासवर्ड डिफ़ॉल्ट पर रीसेट हो गए हैं!');
    }
  };

  const handleUpdateAdminMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminKey || newAdminKey.trim().length < 6) {
      alert('नया एडमिन पासवर्ड कम से कम 6 अक्षरों का होना अनिवार्य है।');
      return;
    }
    updateAdminMasterPassword(newAdminKey.trim());
    setAdminKeyMsg('✓ मास्टर एडमिन पासवर्ड सफलतापूर्वक अपडेट हो गया!');
    setNewAdminKey('');
    setTimeout(() => setAdminKeyMsg(''), 3000);
  };

  const handleOpenEdit = (m: MemberProfile) => {
    setEditingMember(m);
    setEditPlanId(m.planId);
    setEditAmount(m.amountPaid || 10);
    setEditStatus(m.status);
    setEditAccessiblePlans(m.accessiblePlans || [m.planId]);
    setSaveSuccessMsg('');
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;
    const planObj = ioisMasterPlans.find(p => p.id === editPlanId);
    const planName = planObj ? planObj.name : 'IOIS Plan';

    const success = await adminUpdateStudentKitAccess(
      editingMember.memberId,
      editPlanId,
      planName,
      editAmount,
      editStatus,
      editAccessiblePlans
    );

    if (success) {
      setSaveSuccessMsg('विद्यार्थी का प्लान, शुल्क व किट एक्सेस सफलतापूर्वक अपडेट हो गया!');
      setTimeout(() => {
        setSaveSuccessMsg('');
        setEditingMember(null);
        loadMembers();
        if (onUsersUpdated) onUsersUpdated();
      }, 1000);
    }
  };

  const handleDelete = async (memberId: string, roll: string) => {
    if (!confirm(`क्या आप रोल नंबर ${roll} वाले विद्यार्थी को डेटाबेस से स्थायी रूप से हटाना चाहते हैं?`)) {
      return;
    }
    await adminDeleteStudent(memberId);
    await loadMembers();
    if (onUsersUpdated) onUsersUpdated();
  };

  const handleCreateManualStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const planObj = ioisMasterPlans.find(p => p.id === newPlanId) || ioisMasterPlans[0];
    
    await registerStudentToDatabase({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      city: newCity.trim(),
      state: 'बिहार',
      grade: newGrade,
      planId: planObj.id,
      planName: planObj.name,
      amountPaid: planObj.price,
      paymentRef: newUtr.trim() || 'ADMIN-OFFLINE',
      password: 'student@iois'
    });

    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewUtr('');
    await loadMembers();
    if (onUsersUpdated) onUsersUpdated();
  };

  // Filter members
  const filtered = members.filter(m => {
    const matchSearch = 
      (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.rollNumber && m.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.phone && m.phone.includes(searchTerm)) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.paymentRef && m.paymentRef.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchPlan = planFilter === 'all' || m.planId === planFilter;

    return matchSearch && matchStatus && matchPlan;
  });

  // Financial Statistics
  const totalRevenue = members.reduce((sum, m) => sum + (Number(m.amountPaid) || 0), 0);
  const activeCount = members.filter(m => m.status === 'Verified' || m.status === 'Active').length;
  const pendingCount = members.filter(m => m.status === 'Pending').length;

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Roll Number (Non-Editable)', 'Name', 'Phone', 'Email', 'Plan ID', 'Plan Name', 'Amount Paid', 'Payment Ref (UTR)', 'Status', 'Accessible Kits', 'Joined Date'];
    const rows = members.map(m => [
      `"${m.rollNumber || m.memberId}"`,
      `"${m.name}"`,
      `"${m.phone}"`,
      `"${m.email || ''}"`,
      `"${m.planId}"`,
      `"${m.planName || ''}"`,
      `"₹${m.amountPaid || 10}"`,
      `"${m.paymentRef || ''}"`,
      `"${m.status}"`,
      `"${(m.accessiblePlans || []).join(';')}"`,
      `"${m.joinedDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IOIS-Student-Database-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto font-sans">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border-2 border-slate-300 text-slate-800 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Tricolor Ribbon on top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white via-blue-800 to-emerald-600" />

        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-[#0f172a] to-blue-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow">
              🛡️
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[#f3e5ab] text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>सुरक्षित एडमिन कंसोल • Firebase Firestore Live Database</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                IOIS अधिकृत छात्र डेटाबेस व किट एक्सेस प्रबंधन
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-200 text-xs font-bold transition-colors"
              >
                लॉगआउट
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: PASSWORD GATE (IF NOT AUTHENTICATED) */}
        {/* ------------------------------------------------------------- */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center text-3xl shadow-inner border border-blue-200">
              🔒
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900">
                एडमिनिस्ट्रेटर सुरक्षा प्रमाणीकरण
              </h4>
              <p className="text-xs text-slate-600">
                यह डेटाबेस पोर्टल केवल अधिकृत एडमिन के लिए सुरक्षित है। कृपया जारी रखने के लिए गुप्त एडमिन पासवर्ड दर्ज करें।
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="w-full space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-slate-700">
                  गुप्त एडमिन पासवर्ड (Hidden Masked) *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none text-sm pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>एडमिन पैनल अनलॉक करें</span>
              </button>
            </form>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 text-left">
              <strong>सुरक्षा नोट:</strong> यह पासवर्ड केवल मुख्य एडमिन के पास सुरक्षित है। अनाधिकृत प्रयास ट्रैक किए जाते हैं।
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* STEP 2: AUTHENTICATED ADMIN DASHBOARD WORKSPACE */
          /* ------------------------------------------------------------- */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">कुल पंजीकृत छात्र</span>
                <span className="text-2xl font-black text-slate-900">{members.length}</span>
                <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Firebase Live Synced</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">कुल प्राप्त शुल्क (Revenue)</span>
                <span className="text-2xl font-black text-emerald-600">₹{totalRevenue}</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">सत्यापित भुगतान</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">सक्रिय किट एक्सेस</span>
                <span className="text-2xl font-black text-[#1e3a8a]">{activeCount}</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">अनलॉक्ड छात्र</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">लंबित सत्यापन</span>
                <span className="text-2xl font-black text-amber-600">{pendingCount}</span>
                <span className="text-[10px] text-amber-700 font-bold block mt-0.5">जांच हेतु प्रतीक्षारत</span>
              </div>
            </div>

            {/* Admin Workspace Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('students')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeAdminTab === 'students'
                      ? 'bg-[#1e3a8a] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>विद्यार्थी डेटाबेस ({members.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('passwords')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeAdminTab === 'passwords'
                      ? 'bg-[#991b1b] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>🔐 7 प्लान पासवर्ड प्रबंधक (Passwords)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAdminTab('settings')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeAdminTab === 'settings'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>🛡️ मास्टर एडमिन पासवर्ड</span>
                </button>
              </div>

              {activeAdminTab === 'passwords' && (
                <button
                  type="button"
                  onClick={handleResetAllPasswords}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>डिफ़ॉल्ट पासवर्ड रीसेट करें</span>
                </button>
              )}
            </div>

            {/* TAB 1: STUDENTS DATABASE */}
            {activeAdminTab === 'students' && (
              <>
            {/* Controls Bar: Search, Filters & Actions */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="रोल नंबर, नाम, मोबाइल या UTR खोजें..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-700"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-bold text-slate-700 outline-none"
                >
                  <option value="all">सभी प्लान्स (Plans)</option>
                  {ioisMasterPlans.map(p => (
                    <option key={p.id} value={p.id}>Plan 0{p.planNumber} (₹{p.price})</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-bold text-slate-700 outline-none"
                >
                  <option value="all">सभी स्टेटस</option>
                  <option value="Verified">Verified (सत्यापित)</option>
                  <option value="Pending">Pending (लंबित)</option>
                  <option value="Rejected">Rejected (अस्वीकृत)</option>
                </select>

                <button
                  onClick={loadMembers}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                  title="रिफ्रेश करें"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>नया छात्र जोड़ें</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV एक्सपोर्ट</span>
                </button>
              </div>

            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-black">
                      <th className="p-3">रोल नंबर (Non-Editable)</th>
                      <th className="p-3">विद्यार्थी का नाम व कक्षा</th>
                      <th className="p-3">मोबाइल व ईमेल</th>
                      <th className="p-3">सक्रिय प्लान व शुल्क</th>
                      <th className="p-3">भुगतान संदर्भ (UTR)</th>
                      <th className="p-3">स्टेटस</th>
                      <th className="p-3 text-right">किट एक्सेस सेटअप</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                          {loading ? 'डेटाबेस से लोड हो रहा है...' : 'कोई छात्र रिकॉर्ड नहीं मिला।'}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((student) => {
                        const planObj = ioisMasterPlans.find(p => p.id === student.planId);
                        return (
                          <tr key={student.memberId} className="hover:bg-blue-50/40 transition-colors">
                            
                            {/* Non-Editable Roll Number */}
                            <td className="p-3 font-mono font-black text-[#1e3a8a] whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-lg bg-blue-100/70 border border-blue-200">
                                {student.rollNumber || student.memberId}
                              </span>
                            </td>

                            {/* Name & Grade */}
                            <td className="p-3 whitespace-nowrap">
                              <span className="font-bold text-slate-900 block">{student.name}</span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {student.grade || 'Primary'} • {student.city}
                              </span>
                            </td>

                            {/* Phone & Email */}
                            <td className="p-3 whitespace-nowrap">
                              <span className="font-bold text-slate-800 block">📞 {student.phone}</span>
                              <span className="text-[11px] text-slate-500">
                                {student.email ? student.email : 'ईमेल दर्ज नहीं'}
                              </span>
                            </td>

                            {/* Plan & Amount Paid */}
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black text-[11px] inline-block mb-1">
                                {planObj ? `Plan 0${planObj.planNumber}` : student.planId}
                              </span>
                              <span className="text-slate-900 font-bold block text-xs">
                                ₹{student.amountPaid || 10} Paid
                              </span>
                            </td>

                            {/* Payment UTR & Screenshot */}
                            <td className="p-3 whitespace-nowrap text-[11px] space-y-1">
                              <div>
                                {student.paymentRef ? (
                                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    {student.paymentRef}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">नहीं दिया</span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-1">
                                {student.paymentScreenshotUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setViewingImage({
                                      title: `${student.name} - पेमेंट स्क्रीनशॉट (UTR: ${student.paymentRef || 'N/A'})`,
                                      url: student.paymentScreenshotUrl!
                                    })}
                                    className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[10px] inline-flex items-center gap-1 transition-colors cursor-pointer border border-purple-200"
                                    title="स्क्रीनशॉट देखें"
                                  >
                                    <span>📷 स्क्रीनशॉट</span>
                                  </button>
                                )}
                                {student.paymentAddressProofUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setViewingImage({
                                      title: `${student.name} - पता प्रमाण पत्र`,
                                      url: student.paymentAddressProofUrl!
                                    })}
                                    className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-[10px] inline-flex items-center gap-1 transition-colors cursor-pointer border border-blue-200"
                                    title="पता प्रमाण देखें"
                                  >
                                    <span>📄 पता प्रमाण</span>
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="p-3 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                student.status === 'Verified' || student.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : student.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {student.status}
                              </span>
                            </td>

                            {/* Actions / Setup Kit Access */}
                            <td className="p-3 whitespace-nowrap text-right space-x-1">
                              <button
                                onClick={() => handleOpenEdit(student)}
                                className="px-3 py-1 rounded-xl bg-blue-100 hover:bg-blue-200 text-[#1e3a8a] font-bold text-xs inline-flex items-center gap-1 transition-colors"
                                title="प्लान व किट एक्सेस बदलें"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>सेटअप</span>
                              </button>

                              <button
                                onClick={() => handleDelete(student.memberId, student.rollNumber || student.memberId)}
                                className="p-1 rounded-xl text-red-500 hover:bg-red-100 transition-colors inline-flex items-center"
                                title="हटाएं"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </>
            )}

            {/* TAB 2: 7 PLAN PASSWORDS MANAGER */}
            {activeAdminTab === 'passwords' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#991b1b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-slate-900 text-sm">
                      7 मास्टर योजनाओं के सुरक्षा पासवर्ड प्रबंधन (Plan Security Passwords)
                    </strong>
                    <p className="mt-0.5 text-slate-700 leading-relaxed">
                      प्रत्येक प्लान का अध्ययन सामग्री पोर्टल पासवर्ड द्वारा सुरक्षित है। आप यहां से किसी भी प्लान का नया पासवर्ड तुरंत सेट कर सकते हैं। यह पासवर्ड छात्रों को सार्वजनिक पोर्टल पर कभी नहीं दिखाया जाता है।
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ioisMasterPlans.map((plan) => {
                    const isShowing = showPlanPass[plan.id];
                    const statusMsg = passwordStatusMsg[plan.id];

                    return (
                      <div key={plan.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-black text-xs">
                              PLAN 0{plan.planNumber}
                            </span>
                            <span className="font-black text-slate-900 text-sm">
                              {plan.name}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            शुल्क: ₹{plan.price}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium">
                          {plan.subtitle} • {plan.tagline}
                        </p>

                        {/* Password input & update */}
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            सक्रिय अध्ययन पासवर्ड (Current Key):
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                              <input
                                type={isShowing ? 'text' : 'password'}
                                value={planPasswords[plan.id] || ''}
                                onChange={(e) => {
                                  const val = e.target.value.toUpperCase();
                                  setPlanPasswords(prev => ({ ...prev, [plan.id]: val }));
                                }}
                                placeholder="पासवर्ड दर्ज करें"
                                className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-300 text-xs font-mono font-black tracking-wider text-slate-900 outline-none focus:border-[#991b1b]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPlanPass(prev => ({ ...prev, [plan.id]: !prev[plan.id] }))}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                {isShowing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleUpdatePlanPassword(plan.id, planPasswords[plan.id] || '')}
                              className="px-4 py-2 rounded-xl bg-[#991b1b] hover:bg-red-800 text-white font-black text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>सेव करें</span>
                            </button>
                          </div>

                          {statusMsg && (
                            <p className="text-[11px] font-bold text-emerald-600 mt-1 animate-in fade-in">
                              {statusMsg}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: ADMIN MASTER KEY SETTINGS */}
            {activeAdminTab === 'settings' && (
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto text-xl font-black">
                    🛡️
                  </div>
                  <h4 className="font-black text-slate-900 text-base">
                    मास्टर एडमिन पासवर्ड बदलें
                  </h4>
                  <p className="text-xs text-slate-500">
                    एडमिन कंसोल में लॉगिन करने हेतु अधिकृत मास्टर पासवर्ड
                  </p>
                </div>

                <form onSubmit={handleUpdateAdminMasterKey} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      नया मास्टर एडमिन पासवर्ड *
                    </label>
                    <input
                      type="text"
                      value={newAdminKey}
                      onChange={(e) => setNewAdminKey(e.target.value)}
                      placeholder="उदा. IOIS@ADMIN2026"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-none focus:border-blue-700"
                    />
                  </div>

                  {adminKeyMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      {adminKeyMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    मास्टर पासवर्ड सुरक्षित करें
                  </button>
                </form>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  डिफ़ॉल्ट मास्टर पासवर्ड: <strong>IOIS@ADMIN2026</strong>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUB-MODAL: EDIT STUDENT PLAN, PAYMENT & ACCESSIBLE KITS */}
        {/* ------------------------------------------------------------- */}
        {editingMember && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border-2 border-blue-900 space-y-4">
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h4 className="font-black text-slate-900 text-base">
                    किट एक्सेस व भुगतान सेटअप: {editingMember.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    रोल नंबर (Non-Editable): {editingMember.rollNumber || editingMember.memberId}
                  </p>
                </div>
                <button
                  onClick={() => setEditingMember(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                
                {/* Uploaded Payment Screenshot & Verification Documents */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block">
                    छात्र द्वारा अपलोड किया गया भुगतान स्क्रीनशॉट व प्रमाण:
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {editingMember.paymentScreenshotUrl ? (
                      <div className="flex items-center gap-2">
                        <div 
                          onClick={() => setViewingImage({
                            title: `${editingMember.name} - पेमेंट स्क्रीनशॉट (UTR: ${editingMember.paymentRef || 'N/A'})`,
                            url: editingMember.paymentScreenshotUrl!
                          })}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-400 cursor-pointer hover:opacity-90 transition-opacity bg-slate-900 shrink-0"
                          title="बड़ा करके देखें"
                        >
                          <img 
                            src={editingMember.paymentScreenshotUrl} 
                            alt="Payment Proof" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewingImage({
                            title: `${editingMember.name} - पेमेंट स्क्रीनशॉट (UTR: ${editingMember.paymentRef || 'N/A'})`,
                            url: editingMember.paymentScreenshotUrl!
                          })}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs cursor-pointer"
                        >
                          🔍 स्क्रीनशॉट बड़ा करें
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">कोई पेमेंट स्क्रीनशॉट अपलोड नहीं किया गया</span>
                    )}

                    {editingMember.paymentAddressProofUrl && (
                      <button
                        type="button"
                        onClick={() => setViewingImage({
                          title: `${editingMember.name} - पता प्रमाण पत्र`,
                          url: editingMember.paymentAddressProofUrl!
                        })}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs cursor-pointer"
                      >
                        📄 पता प्रमाण देखें
                      </button>
                    )}
                  </div>
                  {editingMember.paymentRef && (
                    <div className="text-[11px] font-mono text-emerald-800 font-bold">
                      UTR No: {editingMember.paymentRef}
                    </div>
                  )}
                </div>

                {/* Plan Selection */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    छात्र का अधिकृत प्लान (Assigned Plan):
                  </label>
                  <select
                    value={editPlanId}
                    onChange={(e) => {
                      const newPId = e.target.value;
                      setEditPlanId(newPId);
                      const pObj = ioisMasterPlans.find(p => p.id === newPId);
                      if (pObj) {
                        setEditAmount(pObj.price);
                      }
                      if (newPId === 'plan-07') {
                        setEditAccessiblePlans(['plan-01', 'plan-02', 'plan-03', 'plan-04', 'plan-05', 'plan-06', 'plan-07']);
                      } else {
                        setEditAccessiblePlans([newPId]);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 outline-none"
                  >
                    {ioisMasterPlans.map(p => (
                      <option key={p.id} value={p.id}>
                        Plan 0{p.planNumber}: {p.name} (शुल्क: ₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Paid Setup */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    सत्यापित भुगतान राशि (Amount Paid):
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    खाता सत्यापन स्थिति (Account Status):
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 outline-none"
                  >
                    <option value="Verified">Verified (सत्यापित - किट अनलॉक)</option>
                    <option value="Active">Active (सक्रिय)</option>
                    <option value="Pending">Pending (लंबित - किट लॉक)</option>
                    <option value="Rejected">Rejected (अस्वीकृत - ब्लॉक)</option>
                  </select>
                </div>

                {/* Accessible Kits Checkboxes */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    इस छात्र को कौन-कौन सी किट का एक्सेस देना है? (Allowed Kits):
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {ioisMasterPlans.map(p => {
                      const isChecked = editAccessiblePlans.includes(p.id);
                      return (
                        <label key={p.id} className="flex items-center space-x-2 text-[11px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditAccessiblePlans([...editAccessiblePlans, p.id]);
                              } else {
                                setEditAccessiblePlans(editAccessiblePlans.filter(id => id !== p.id));
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className={isChecked ? 'font-bold text-[#1e3a8a]' : 'text-slate-600'}>
                            Plan 0{p.planNumber} ({p.name})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  रद्द करें
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>डेटाबेस में सेव करें</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUB-MODAL: ADD MANUAL STUDENT */}
        {/* ------------------------------------------------------------- */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border-2 border-blue-900 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-black text-slate-900 text-base">
                  नया विद्यार्थी रिकॉर्ड दर्ज करें
                </h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualStudent} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">विद्यार्थी का नाम *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="जैसे: राहुल कुमार"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">मोबाइल नंबर (10 अंक) *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ईमेल (वैकल्पिक)</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">कक्षा</label>
                    <select
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold"
                    >
                      <option value="कक्षा 1-5 (Primary)">कक्षा 1-5 (Primary)</option>
                      <option value="कक्षा 6-8 (Middle)">कक्षा 6-8 (Middle)</option>
                      <option value="कक्षा 9-10 (High)">कक्षा 9-10 (High)</option>
                      <option value="कक्षा 11-12 (Senior)">कक्षा 11-12 (Senior)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">शहर</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">योजना (Plan)</label>
                  <select
                    value={newPlanId}
                    onChange={(e) => setNewPlanId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold"
                  >
                    {ioisMasterPlans.map(p => (
                      <option key={p.id} value={p.id}>
                        Plan 0{p.planNumber} - {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">भुगतान संदर्भ / UTR</label>
                  <input
                    type="text"
                    value={newUtr}
                    onChange={(e) => setNewUtr(e.target.value)}
                    placeholder="जैसे: UPI123456789"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1e3a8a] text-white font-black shadow-md"
                  >
                    सेव करें
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Full-Screen Image Viewer Modal */}
        {viewingImage && (
          <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-2xl w-full border-2 border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
                <div className="font-bold text-sm text-amber-300 truncate">
                  {viewingImage.title}
                </div>
                <button
                  type="button"
                  onClick={() => setViewingImage(null)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-black/40">
                <img
                  src={viewingImage.url}
                  alt="Uploaded Proof"
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-slate-800"
                />
              </div>
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>IOIS छात्र सत्यापन दस्तावेज</span>
                <button
                  type="button"
                  onClick={() => setViewingImage(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
