import React, { useState, useEffect } from 'react';
import { MemberProfile, ActiveSession } from '../types';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { 
  canUserAccessPlanKit, 
  getUserConnectedDevices, 
  logoutDeviceSession, 
  logoutAllDevices,
  registerOrUpdateDeviceSession,
  updateMemberProfile
} from '../services/userService';
import { 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  Eye, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Power, 
  RefreshCw, 
  Check, 
  Edit3, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Layers, 
  Lock, 
  Unlock, 
  Tv, 
  Pencil, 
  FileCheck2, 
  HelpCircle, 
  Calendar,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Camera,
  Upload,
  QrCode,
  User,
  Sparkles,
  Video,
  Play,
  BarChart3,
  TrendingUp,
  Flame
} from 'lucide-react';
import { LearningProgressTracker } from './LearningProgressTracker';

interface StudentMainDashboardViewProps {
  currentUser: MemberProfile;
  onLogout: () => void;
  onOpenStudyModal: (planId: string) => void;
  onOpenIdCard: () => void;
  onViewHomepage: () => void;
  onProfileUpdated?: (updated: MemberProfile) => void;
  onOpenVideoModal?: () => void;
}

export const StudentMainDashboardView: React.FC<StudentMainDashboardViewProps> = ({
  currentUser,
  onLogout,
  onOpenStudyModal,
  onOpenIdCard,
  onViewHomepage,
  onProfileUpdated,
  onOpenVideoModal
}) => {
  const [activeTab, setActiveTab] = useState<'study' | 'progress' | 'account' | 'devices' | 'profile'>('study');
  const [selectedPlanForWorkspace, setSelectedPlanForWorkspace] = useState<string>(currentUser.planId || 'plan-01');

  // Edit Profile State
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [editCity, setEditCity] = useState(currentUser.city || '');
  const [editState, setEditState] = useState(currentUser.state || '');
  const [editDesignation, setEditDesignation] = useState(currentUser.designation || 'Class 1-12');
  const [editAddress, setEditAddress] = useState(currentUser.address || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [editCustomQrUrl, setEditCustomQrUrl] = useState(currentUser.customQrUrl || '');
  const [editCustomQrImage, setEditCustomQrImage] = useState(currentUser.customQrImage || '');
  const [qrInputMode, setQrInputMode] = useState<'link' | 'image'>(currentUser.customQrImage ? 'image' : 'link');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Synchronize if currentUser changes
  useEffect(() => {
    setEditName(currentUser.name || '');
    setEditPhone(currentUser.phone || '');
    setEditEmail(currentUser.email || '');
    setEditCity(currentUser.city || '');
    setEditState(currentUser.state || '');
    setEditDesignation(currentUser.designation || currentUser.grade || 'Class 1-12');
    setEditAddress(currentUser.address || '');
    setEditAvatarUrl(currentUser.avatarUrl || '');
    setEditCustomQrUrl(currentUser.customQrUrl || '');
    setEditCustomQrImage(currentUser.customQrImage || '');
  }, [currentUser]);

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditCustomQrImage(event.target?.result as string);
        setQrInputMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  // Connected Devices State
  const [deviceList, setDeviceList] = useState<ActiveSession[]>(() => getUserConnectedDevices(currentUser));
  const [isRefreshingDevices, setIsRefreshingDevices] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [showConfirmLogoutAll, setShowConfirmLogoutAll] = useState(false);
  const [deviceActionMsg, setDeviceActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null);

  // Sync / ensure current device is registered on mount
  useEffect(() => {
    registerOrUpdateDeviceSession(currentUser).then((freshUser) => {
      setDeviceList(getUserConnectedDevices(freshUser));
    });
  }, [currentUser]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccessMsg('');

    const res = updateMemberProfile({
      memberId: currentUser.memberId,
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      city: editCity.trim(),
      state: editState.trim(),
      designation: editDesignation.trim(),
      address: editAddress.trim(),
      avatarUrl: editAvatarUrl,
      customQrUrl: qrInputMode === 'link' ? editCustomQrUrl.trim() : '',
      customQrImage: qrInputMode === 'image' ? editCustomQrImage : ''
    });

    setProfileLoading(false);
    if (res.success && res.member) {
      if (onProfileUpdated) {
        onProfileUpdated(res.member);
      }
      setProfileSuccessMsg('✓ प्रोफाइल फोटो व विवरण सफलतापूर्वक अपडेट हो गया है!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    }
  };

  // Device Session Handlers
  const handleRefreshDevices = async () => {
    setIsRefreshingDevices(true);
    try {
      const fresh = await registerOrUpdateDeviceSession(currentUser);
      setDeviceList(getUserConnectedDevices(fresh));
      setDeviceActionMsg({
        type: 'success',
        text: 'कनेक्टेड डिवाइसेज की सूची रीयल-टाइम डेटा से अपडेट हो गई है।'
      });
      setTimeout(() => setDeviceActionMsg(null), 3000);
    } catch {
      setDeviceActionMsg({
        type: 'error',
        text: 'डिवाइस सूची रीफ्रेश करने में समस्या आई।'
      });
    } finally {
      setIsRefreshingDevices(false);
    }
  };

  const handleLogoutDevice = async (sessionId: string) => {
    setTerminatingSessionId(sessionId);
    setDeviceActionMsg(null);
    try {
      const res = await logoutDeviceSession(currentUser.memberId, sessionId);
      if (res.isCurrentDevice) {
        onLogout();
      } else {
        if (res.updatedUser) {
          setDeviceList(getUserConnectedDevices(res.updatedUser));
          if (onProfileUpdated) onProfileUpdated(res.updatedUser);
        } else {
          setDeviceList(prev => prev.filter(d => d.id !== sessionId));
        }
        setDeviceActionMsg({
          type: 'success',
          text: 'डिवाइस सत्र सफलतापूर्वक समाप्त कर दिया गया।'
        });
        setTimeout(() => setDeviceActionMsg(null), 3000);
      }
    } catch {
      setDeviceActionMsg({
        type: 'error',
        text: 'डिवाइस सत्र हटाने में समस्या आई।'
      });
    } finally {
      setTerminatingSessionId(null);
    }
  };

  const handleLogoutAllDevices = async () => {
    setIsLoggingOutAll(true);
    setDeviceActionMsg(null);
    try {
      await logoutAllDevices(currentUser.memberId);
      setShowConfirmLogoutAll(false);
      onLogout();
    } catch {
      setIsLoggingOutAll(false);
      setDeviceActionMsg({
        type: 'error',
        text: 'सभी डिवाइसेज से लॉगआउट करने में समस्या आई।'
      });
    }
  };

  const getDeviceIcon = (deviceType: 'desktop' | 'mobile' | 'tablet') => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-indigo-600" />;
      case 'desktop':
      default:
        return <Laptop className="w-5 h-5 text-slate-700" />;
    }
  };

  const currentPlan = ioisMasterPlans.find(p => p.id === currentUser.planId) || ioisMasterPlans[0];
  const selectedWorkspacePlan = ioisMasterPlans.find(p => p.id === selectedPlanForWorkspace) || currentPlan;
  const isSelectedPlanUnlocked = canUserAccessPlanKit(currentUser, selectedPlanForWorkspace).hasAccess;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 🇮🇳 Tricolor Top Band */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white via-blue-800 to-emerald-600" />

      {/* 👤 1. Official Header & Verification Bar */}
      <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1e3a8a] text-white flex items-center justify-center font-black shadow border-2 border-[#d4af37] text-lg overflow-hidden shrink-0 relative">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-base sm:text-lg text-[#0f172a] tracking-tight">
                  {currentUser.name || 'Student'}
                </span>
                
                {/* Real Payment / Account Verification Badge */}
                {currentUser.status === 'Active' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>सत्यापित छात्र (Active Student)</span>
                  </span>
                ) : currentUser.status === 'Pending' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>सत्यापन प्रक्रियाधीन (Pending)</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black border border-red-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-600" />
                    <span>सत्यापन अस्वीकृत</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-600 flex-wrap">
                <span className="flex items-center gap-1.5">
                  रोल नंबर: 
                  <strong className="text-[#1e3a8a] font-mono bg-blue-100/80 px-2 py-0.5 rounded border border-blue-300">
                    {currentUser.rollNumber || currentUser.memberId}
                  </strong>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentUser.rollNumber || currentUser.memberId);
                      alert('User ID कॉपी हो गई!');
                    }}
                    title="User ID कॉपी करें"
                    className="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] cursor-pointer"
                  >
                    कॉपी
                  </button>
                </span>
                <span>•</span>
                <span>कक्षा: <strong className="text-slate-800">{currentUser.designation || 'Class 1-12'}</strong></span>
                <span>•</span>
                <span>प्लान: <strong className="text-emerald-700">{currentUser.planName || currentPlan.name} (शुल्क: ₹{currentUser.amountPaid || 10})</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2 text-xs">
            {onOpenVideoModal && (
              <button
                onClick={onOpenVideoModal}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-105 text-white font-black shadow-xs transition-all flex items-center gap-1.5"
                title="सभी 1-12th, NEET, JEE, ADCA, Tally वीडियो लेक्चर्स व लैब्स"
              >
                <Tv className="w-3.5 h-3.5 text-amber-300" />
                <span>📺 वीडियो क्लास</span>
              </button>
            )}

            <button
              onClick={onOpenIdCard}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] border border-blue-200 font-bold transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#1e3a8a]" />
              <span>डिजिटल ID कार्ड</span>
            </button>

            <button
              onClick={onViewHomepage}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>मुख्य पोर्टल</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>लॉगआउट</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. REAL VERIFICATION STATUS ALERT (If Pending or Active) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        {currentUser.status === 'Pending' ? (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-black text-xs sm:text-sm text-amber-900">
                  भुगतान सत्यापन प्रक्रियाधीन (Payment Verification in Progress)
                </h4>
                <p className="text-[11px] text-amber-800">
                  आपके ₹{currentUser.amountPaid || 10} शुल्क भुगतान व UTR: <strong>{currentUser.paymentRef || currentUser.utrNumber || 'UPI Receipt'}</strong> की जांच एडमिन द्वारा की जा रही है। जांच पूरी होने पर आपकी किट पूर्ण रूप से सक्रिय हो जाएगी।
                </p>
              </div>
            </div>
            <div className="text-[11px] text-amber-900 font-bold bg-amber-100 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
              सहायता: +918877490845
            </div>
          </div>
        ) : currentUser.status === 'Active' ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-900">
                आपका खाता पूर्णतः सत्यापित है। आपके नामांकित पाठ्यक्रम <strong>{currentUser.planName || currentPlan.name}</strong> की सभी अध्ययन सामग्री उपलब्ध है।
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
              UTR: {currentUser.paymentRef || currentUser.utrNumber || 'UPI Verified'}
            </span>
          </div>
        ) : null}
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        <div className="flex border-b border-slate-200 bg-white rounded-2xl px-3 sm:px-5 gap-1 sm:gap-3 text-xs sm:text-sm font-bold shadow-xs overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('study')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'study'
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>अध्ययन हब व किट (Study Hub)</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'progress'
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#1e3a8a]" />
            <span>शिक्षण प्रगति ट्रैकर (Learning Progress)</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'account'
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>खाता व शुल्क विवरण (Account & Fee)</span>
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'devices'
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>कनेक्टेड डिवाइसेज ({deviceList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>प्रोफाइल संपादन (My Profile)</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ============================================================= */}
        {/* TAB 1: REAL STUDY HUB & ENROLLED COURSE KITS */}
        {/* ============================================================= */}
        {activeTab === 'study' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Active Enrolled Course Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-[#1e3a8a] to-blue-950 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-[#f3e5ab] text-xs font-black uppercase tracking-wider border border-amber-400/30">
                    IOIS Lifetime Master Access - सम्पूर्ण अध्ययन किट 2026
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black border border-emerald-400/40">
                    PLAN 0{currentPlan.planNumber} अधिकृत
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {currentPlan.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                  {currentPlan.tagline} • कक्षा 1 से 12 तक के सचित्र NCERT नोट्स, वीडियो लेक्चर्स, NEET/JEE प्रश्न बैंक, ADCA कम्प्यूटर, Tally व टाइपिंग टेस्ट।
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0 justify-center">
                <button
                  onClick={() => onOpenStudyModal(currentPlan.id)}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 text-slate-950 font-black text-xs hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-slate-950" />
                  <span>फुल स्क्रीन स्टडी हब →</span>
                </button>
                {onOpenVideoModal && (
                  <button
                    onClick={onOpenVideoModal}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-105 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Tv className="w-4 h-4 text-amber-300" />
                    <span>📺 वीडियो क्लास व लैब</span>
                  </button>
                )}
                <button
                  onClick={onOpenIdCard}
                  className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>आईडी कार्ड</span>
                </button>
              </div>
            </div>

            {/* Quick Learning Progress Tracker Widget */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 w-full md:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center shrink-0 border border-blue-200 shadow-2xs">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">लर्निंग प्रोग्रेस ट्रैकर 2026</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      लाइफटाइम ट्रैकिंग
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    आपकी समग्र अध्ययन प्रगति और पाठ पूर्णता दर (Progress per Study Plan)
                  </h4>
                  <p className="text-xs text-slate-500">
                    प्रत्येक पैकेज के पूर्ण पाठों का ग्राफ, वेलोसिटी वक्र एवं इंटरैक्टिव चेकलिस्ट देखें।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('progress')}
                  className="px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  <span>📊 सम्पूर्ण प्रगति चार्ट खोलें (View Full Progress) →</span>
                </button>
              </div>
            </div>

            {/* 7 Plans Authorization Explorer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#1e3a8a]" />
                  <span>सभी 7 अध्ययन योजनाएं एवं अधिकृत एक्सेस स्थिति:</span>
                </h3>
                <span className="text-xs text-slate-500">क्लिक करके सामग्री देखें</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
                {ioisMasterPlans.map((p) => {
                  const isSelected = selectedPlanForWorkspace === p.id;
                  const hasAccess = canUserAccessPlanKit(currentUser, p.id).hasAccess;
                  const isUserEnrolledPlan = currentUser.planId === p.id;

                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlanForWorkspace(p.id)}
                      className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden border-2 shadow-xs flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-[#1e3a8a] ring-2 ring-blue-300 scale-102 z-10'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">
                          {p.planNumber === 1 ? '🧒' : p.planNumber === 2 ? '💼' : p.planNumber === 3 ? '🎯' : p.planNumber === 4 ? '🏡' : p.planNumber === 5 ? '📚' : p.planNumber === 6 ? '🚀' : '👑'}
                        </span>
                        {hasAccess ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black border border-emerald-300 flex items-center gap-0.5">
                            <Unlock className="w-2.5 h-2.5" />
                            <span>OPEN</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-black border border-slate-300 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                            <span>₹{p.price}</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#1e3a8a] block">
                          Plan 0{p.planNumber}
                        </span>
                        <h4 className="font-black text-xs text-[#0f172a] leading-tight mt-0.5 line-clamp-1">
                          {p.name}
                        </h4>
                        {isUserEnrolledPlan && (
                          <span className="inline-block mt-1 text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            आपका प्लान
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Plan Academic Suite Workspace */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider">
                      PLAN 0{selectedWorkspacePlan.planNumber}
                    </span>
                    {isSelectedPlanUnlocked ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>एक्सेस अधिकृत (Authorized)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span>लॉक (Unlock with Admin Verification)</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedWorkspacePlan.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedWorkspacePlan.tagline}
                  </p>
                </div>

                <button
                  onClick={() => onOpenStudyModal(selectedWorkspacePlan.id)}
                  className="px-4 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs rounded-xl transition-all shadow flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>सम्पूर्ण पाठ व स्टडी डायलॉग खोलें →</span>
                </button>
              </div>

              {/* 4 Real Academic Feature Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div 
                  onClick={() => onOpenStudyModal(selectedWorkspacePlan.id)}
                  className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 hover:border-orange-400 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h5 className="font-black text-sm text-slate-900 group-hover:text-orange-700">
                    सचित्र NCERT नोट्स
                  </h5>
                  <p className="text-xs text-slate-600">
                    विषयवार अध्याय सारांश, महत्वपूर्ण सूत्र, नियम और डाउनलोड योग्य पीडीएफ नोट्स।
                  </p>
                </div>

                <div 
                  onClick={() => onOpenStudyModal(selectedWorkspacePlan.id)}
                  className="p-4 rounded-2xl bg-red-50/60 border border-red-200 hover:border-red-400 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow">
                    <Tv className="w-5 h-5" />
                  </div>
                  <h5 className="font-black text-sm text-slate-900 group-hover:text-red-700">
                    IOIS आधिकारिक वीडियो कक्षाएं
                  </h5>
                  <p className="text-xs text-slate-600">
                    प्रत्येक अध्याय के उच्च-गुणवत्ता वाले वीडियो पाठ व दृश्य एनीमेशन से सीखें।
                  </p>
                </div>

                <div 
                  onClick={() => onOpenStudyModal(selectedWorkspacePlan.id)}
                  className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <h5 className="font-black text-sm text-slate-900 group-hover:text-purple-700">
                    डिजिटल ट्रेसिंग पैड
                  </h5>
                  <p className="text-xs text-slate-600">
                    अक्षर, शब्द, संख्याएं और वैज्ञानिक डायग्राम्स को स्क्रीन पर पेंसिल चलाकर बनाएं।
                  </p>
                </div>

                <div 
                  onClick={() => onOpenStudyModal(selectedWorkspacePlan.id)}
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h5 className="font-black text-sm text-slate-900 group-hover:text-emerald-700">
                    दैनिक गृहकार्य जांच
                  </h5>
                  <p className="text-xs text-slate-600">
                    प्रत्येक पाठ के बाद वस्तुनिष्ठ प्रश्न हल करें और तुरंत अंक व उत्तर व्याख्या पाएं।
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: LEARNING PROGRESS TRACKER & DATA VISUALIZATION CHARTS */}
        {/* ============================================================= */}
        {activeTab === 'progress' && (
          <div className="space-y-6 animate-fadeIn">
            <LearningProgressTracker
              currentUser={currentUser}
              onOpenStudyModal={onOpenStudyModal}
              onOpenVideoModal={onOpenVideoModal}
              onProfileUpdated={onProfileUpdated}
            />
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: REAL ACCOUNT, PAYMENT & VERIFICATION STATUS */}
        {/* ============================================================= */}
        {activeTab === 'account' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            
            {/* Real Official Profile & Payment Details Card */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-blue-700">
                    IOIS अधिकृत छात्र सत्यापन अभिलेख
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    वास्तविक खाता व शुल्क विवरण (Verified Student Record)
                  </h3>
                </div>

                <button
                  onClick={onOpenIdCard}
                  className="px-4 py-2 rounded-xl bg-[#1e3a8a] text-white font-black text-xs hover:bg-blue-900 shadow flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>डिजिटल पहचान पत्र (ID Card) खोलें</span>
                </button>
              </div>

              {/* Data Grid: 100% Real User Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">विद्यार्थी का नाम</span>
                  <span className="text-sm font-black text-slate-900 block">{currentUser.name}</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">आधिकारिक रोल नंबर (Non-Editable)</span>
                  <span className="text-base font-mono font-black text-[#1e3a8a] block">
                    {currentUser.rollNumber || currentUser.memberId}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">सत्यापन स्थिति (Status)</span>
                  <span className={`text-xs font-black inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                    currentUser.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {currentUser.status === 'Active' ? '✓ सक्रिय (Active & Verified)' : '⏳ सत्यापन प्रक्रियाधीन (Pending)'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">नामांकित पाठ्यक्रम (Plan)</span>
                  <span className="text-xs font-black text-slate-900 block">
                    {currentUser.planName || currentPlan.name}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">जमा की गई राशि (Amount Paid)</span>
                  <span className="text-base font-black text-emerald-800 font-mono block">
                    ₹{currentUser.amountPaid || 10}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">भुगतान संदर्भ / UTR नंबर</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block truncate">
                    {currentUser.paymentRef || currentUser.utrNumber || 'UPI / QR Verification'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">पंजीकृत मोबाइल नंबर</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block">
                    {currentUser.phone}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">पंजीकृत ईमेल</span>
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {currentUser.email || 'उपलब्ध नहीं'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">पंजीकरण दिनांक</span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {currentUser.joinedDate || 'सत्र 2026'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2 lg:col-span-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">स्थान / पता</span>
                  <span className="text-xs font-medium text-slate-700 block">
                    {currentUser.address ? `${currentUser.address}, ` : ''}{currentUser.city}, {currentUser.state}
                  </span>
                </div>

              </div>

              {/* Official Rules & Guidelines */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1.5">
                <div className="font-black text-xs flex items-center gap-1.5 text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-[#1e3a8a]" />
                  <span>IOIS आधिकारिक सत्यापन दिशानिर्देश:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-900/90">
                  आपका छात्र रोल नंबर और प्लान डेटाबेस स्तर पर सुरक्षित है। किसी भी प्रकार की सहायता, प्लान अपग्रेड या पेमेंट वेरिफिकेशन स्टेटस के लिए आप सीधे आधिकारिक हेल्पलाइन <strong>+918877490845</strong> पर संपर्क कर सकते हैं।
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: REAL CONNECTED DEVICES & SESSION SECURITY */}
        {/* ============================================================= */}
        {activeTab === 'devices' && (
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-5 text-xs animate-fadeIn">
            
            {/* Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-blue-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-black text-sm text-white">
                    मल्टी-डिवाइस सुरक्षा प्रबंधन (Connected Devices)
                  </span>
                </div>
                <p className="text-[11px] text-blue-200">
                  सक्रिय सत्र: <strong>{deviceList.length} / 4 डिवाइसेज</strong> • सुरक्षा सीमा: अधिकतम 4 समवर्ती डिवाइस
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefreshDevices}
                  disabled={isRefreshingDevices}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Refresh Sessions"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingDevices ? 'animate-spin' : ''}`} />
                  <span>रिफ्रेश</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfirmLogoutAll(true)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow transition-colors flex items-center gap-1.5"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>सभी डिवाइसेज से लॉगआउट करें</span>
                </button>
              </div>
            </div>

            {/* Action Feedback Banner */}
            {deviceActionMsg && (
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                deviceActionMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                {deviceActionMsg.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{deviceActionMsg.text}</span>
              </div>
            )}

            {/* Logout from all devices Confirmation Box */}
            {showConfirmLogoutAll && (
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-red-900 font-black text-sm">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                  <span>क्या आप सचमुच सभी कनेक्टेड डिवाइसेज से लॉगआउट करना चाहते हैं?</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  इस कार्रवाई से यह वर्तमान फोन/कंप्यूटर सहित आपके खाते से जुड़े सभी ब्राउज़रों व डिवाइसेज के सत्र तुरंत समाप्त हो जाएंगे। आपको और अन्य सभी कनेक्टेड डिवाइसेज पर दोबारा User ID व पासवर्ड दर्ज करके लॉगिन करना होगा।
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isLoggingOutAll}
                    onClick={handleLogoutAllDevices}
                    className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isLoggingOutAll ? 'लॉगआउट हो रहा है...' : 'हाँ, सभी डिवाइसेज से तुरंत लॉगआउट करें'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmLogoutAll(false)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition-colors"
                  >
                    रद्द करें
                  </button>
                </div>
              </div>
            )}

            {/* Connected Devices Cards */}
            <div className="space-y-3 pt-1">
              {deviceList.map((device) => (
                <div
                  key={device.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    device.isCurrent
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      device.isCurrent ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                    }`}>
                      {getDeviceIcon(device.deviceType)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-black text-slate-900 text-sm">
                          {device.deviceName}
                        </span>
                        {device.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            वर्तमान डिवाइस (This Device)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{device.location || `${currentUser.city}, ${currentUser.state}`}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>लॉगिन: {device.loginTime}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Device Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {device.isCurrent ? (
                      <button
                        type="button"
                        onClick={() => handleLogoutDevice(device.id)}
                        disabled={terminatingSessionId === device.id}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>लॉगआउट</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleLogoutDevice(device.id)}
                        disabled={terminatingSessionId === device.id}
                        className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-black transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{terminatingSessionId === device.id ? 'हट रहा है...' : 'सत्र समाप्त करें'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Security Tip Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
              <div className="font-black flex items-center gap-1.5 text-amber-900 text-xs">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>सुरक्षा नीति:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                अपने User ID और पासवर्ड को किसी के साथ साझा न करें। यदि आपको कोई अज्ञात डिवाइस दिखे, तो तुरंत <strong>"सभी डिवाइसेज से लॉगआउट करें"</strong> और पासवर्ड रीसेट करें।
              </p>
            </div>

          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 4: REAL PROFILE EDIT FORM */}
        {/* ============================================================= */}
        {activeTab === 'profile' && (
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-5 animate-fadeIn text-xs">
            
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">
                छात्र प्रोफाइल विवरण संपादन (Edit My Profile)
              </h3>
              <p className="text-xs text-slate-500">
                नाम, संपर्क नंबर, ईमेल व पते की जानकारी अद्यतन करें। (रोल नंबर व प्लान सुरक्षा कारणों से केवल एडमिन द्वारा बदले जा सकते हैं।)
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">

              {/* 📸 PROFILE PHOTO & PERSONAL QR CONFIGURATION SECTION */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-white border-2 border-blue-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center text-xs shadow-xs">
                      <Camera className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="font-black text-sm text-[#0f172a] block">
                        डिजिटल प्रोफाइल फोटो एवं पर्सनल QR कोड
                      </span>
                      <span className="text-[10px] text-slate-500">
                        यह फोटो आपके डिजिटल ID कार्ड, प्रमाण पत्र एवं यूजर डैशबोर्ड में प्रदर्शित होगी।
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 shrink-0">
                    लाइव सिंक सक्रिय
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-1 border-t border-blue-200/60">
                  {/* Photo Preview */}
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#1e3a8a] shadow-inner bg-slate-100 flex items-center justify-center relative">
                      {editAvatarUrl ? (
                        <img src={editAvatarUrl} alt="Student Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold mt-1.5">आईडी व डैशबोर्ड फोटो</span>
                    {editAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditAvatarUrl('')}
                        className="text-[10px] text-red-600 hover:text-red-700 font-bold mt-1"
                      >
                        फोटो हटाएं
                      </button>
                    )}
                  </div>

                  {/* Photo Upload & Presets */}
                  <div className="sm:col-span-2 space-y-2.5">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      अपनी प्रोफाइल फोटो चुनें (या लिंक दर्ज करें):
                    </label>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>गैलरी / फाइल से फोटो चुनें</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePhotoUpload}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">या</span>
                      <input
                        type="url"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        placeholder="https://... फोटो वेब लिंक"
                        className="flex-1 min-w-[180px] px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-mono"
                      />
                    </div>

                    {/* Preset Avatars */}
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">
                        त्वरित छात्र अवतार चुनें:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { label: 'छात्र (Boy)', icon: '👨‍🎓', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
                          { label: 'छात्रा (Girl)', icon: '👩‍🎓', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
                          { label: 'स्कॉलर', icon: '🧑‍💻', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
                          { label: 'साइंस स्टार', icon: '🔬', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
                        ].map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditAvatarUrl(av.url)}
                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-xs font-bold flex items-center gap-1 transition-all"
                            title={av.label}
                          >
                            <span>{av.icon}</span>
                            <span className="text-[10px]">{av.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Personal QR Code / Profile Link */}
                <div className="pt-3 border-t border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>पर्सनल QR कोड इमेज या प्रोफाइल पता (Link / UPI QR):</span>
                    </label>
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setQrInputMode('image')}
                        className={`px-2.5 py-0.5 rounded-md font-bold transition-all ${qrInputMode === 'image' ? 'bg-[#1e3a8a] text-white shadow-2xs' : 'bg-slate-200 text-slate-700'}`}
                      >
                        QR फोटो
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrInputMode('link')}
                        className={`px-2.5 py-0.5 rounded-md font-bold transition-all ${qrInputMode === 'link' ? 'bg-[#1e3a8a] text-white shadow-2xs' : 'bg-slate-200 text-slate-700'}`}
                      >
                        लिंक / UPI
                      </button>
                    </div>
                  </div>

                  {qrInputMode === 'image' ? (
                    <div className="flex items-center gap-3">
                      <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>पर्सनल UPI / ID QR इमेज अपलोड</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePersonalQrUpload}
                        />
                      </label>
                      {editCustomQrImage ? (
                        <div className="flex items-center gap-2">
                          <img src={editCustomQrImage} alt="QR Preview" className="w-9 h-9 object-contain rounded border border-slate-300 bg-white p-0.5" />
                          <span className="text-[10px] text-emerald-600 font-bold">✓ पर्सनल QR सक्रिय</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">अपना UPI QR या ID QR अपलोड करें (आईडी कार्ड के पीछे दिखेगा)</span>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={editCustomQrUrl}
                      onChange={(e) => setEditCustomQrUrl(e.target.value)}
                      placeholder="उदा. अपना UPI ID (8877490845@spicepay) या व्यक्तिगत प्रोफाइल पता"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-mono"
                    />
                  )}
                </div>

              </div>

              {/* TEXTUAL PROFILE FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">विद्यार्थी का नाम *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">कक्षा / स्तर *</label>
                  <input
                    type="text"
                    required
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    placeholder="उदा. Class 10th या BCA"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">पंजीकृत मोबाइल नंबर *</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ईमेल आईडी</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">शहर / जिला *</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">राज्य *</label>
                  <input
                    type="text"
                    required
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">पूरा पता (House / Village / Post / PIN)</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="गांव/मोहल्ला, पोस्ट ऑफिस, पिन कोड"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="py-2.5 px-6 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileLoading ? 'सुरक्षित हो रहा है...' : 'प्रोफाइल सुरक्षित करें (Save Profile)'}</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

    </div>
  );
};
