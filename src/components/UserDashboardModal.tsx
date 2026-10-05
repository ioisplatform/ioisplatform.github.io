import React, { useState, useEffect } from 'react';
import { MemberProfile, ActiveSession } from '../types';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { 
  updateMemberProfile, 
  getUserConnectedDevices, 
  logoutDeviceSession, 
  logoutAllDevices,
  registerOrUpdateDeviceSession 
} from '../services/userService';
import { 
  X, 
  CreditCard, 
  BookOpen, 
  Share2, 
  Edit3, 
  LogOut, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  Save, 
  Crown,
  GraduationCap,
  Tv,
  Pencil,
  FileCheck2,
  Award,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  AlertTriangle,
  RefreshCw,
  Power,
  ShieldAlert,
  Clock,
  MapPin,
  Lock,
  Globe
} from 'lucide-react';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: MemberProfile;
  onLogout: () => void;
  onOpenStudyPage: (planId: string) => void;
  onOpenIdCard?: () => void;
  onOpenIdCardModal?: () => void;
  onProfileUpdated?: (updated: MemberProfile) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenStudyPage,
  onOpenIdCard,
  onOpenIdCardModal,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'devices' | 'profile'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const triggerIdCard = onOpenIdCard || onOpenIdCardModal || (() => {});
  
  // Edit form state
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [editCity, setEditCity] = useState(currentUser.city);
  const [editState, setEditState] = useState(currentUser.state);
  const [editDesignation, setEditDesignation] = useState(currentUser.designation || 'Student Member');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Connected Devices state
  const [deviceList, setDeviceList] = useState<ActiveSession[]>(() => getUserConnectedDevices(currentUser));
  const [isRefreshingDevices, setIsRefreshingDevices] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [showConfirmLogoutAll, setShowConfirmLogoutAll] = useState(false);
  const [deviceActionMsg, setDeviceActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null);

  // Sync / ensure current device is registered whenever dashboard opens
  useEffect(() => {
    if (isOpen && currentUser) {
      registerOrUpdateDeviceSession(currentUser).then((freshUser) => {
        setDeviceList(getUserConnectedDevices(freshUser));
      });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const currentPlan = ioisMasterPlans.find(p => p.id === currentUser.planId) || ioisMasterPlans[0];

  const handleCopyLink = () => {
    const link = `https://ioisplatform.github.io/?plan=${currentUser.planId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateMemberProfile({
      memberId: currentUser.memberId,
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      city: editCity.trim(),
      state: editState.trim(),
      designation: editDesignation.trim()
    });

    if (res.success && res.member) {
      if (onProfileUpdated) {
        onProfileUpdated(res.member);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleRefreshDevices = async () => {
    setIsRefreshingDevices(true);
    try {
      const fresh = await registerOrUpdateDeviceSession(currentUser);
      setDeviceList(getUserConnectedDevices(fresh));
      setDeviceActionMsg({
        type: 'success',
        text: 'कनेक्टेड डिवाइसेज की सूची नवीनतम डेटा से अपडेट हो गई है।'
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
        onClose();
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
      onClose();
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {currentUser.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  सत्यापित छात्र
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                User ID: {currentUser.rollNumber || currentUser.memberId} • {currentUser.designation || 'Class 1-12'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">लॉगआउट</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Responsive Scrollable) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-6 gap-1 sm:gap-2 text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 sm:px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>अध्ययन डैशबोर्ड</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`py-3 px-3 sm:px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'progress'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>अध्ययन प्रगति</span>
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`py-3 px-3 sm:px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'devices'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-4 h-4 text-blue-600" />
            <span>कनेक्टेड डिवाइसेज</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
              {deviceList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 sm:px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>प्रोफाइल संपादन</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ACTIVE PLAN */}
        {activeTab === 'overview' && (
          <div className="p-6 overflow-y-auto space-y-6">
            
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>छात्र प्रोफाइल सफलतापूर्वक अपडेट हो गई है!</span>
              </div>
            )}

            {/* Active Plan Card */}
            <div className={`p-6 rounded-3xl border-2 ${
              currentPlan.isSupreme 
                ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-amber-400 shadow-md' 
                : 'bg-slate-50 border-orange-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-900 text-white font-mono">
                      PLAN 0{currentPlan.planNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      सक्रिय पाठ्यक्रम (Active)
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-slate-900">
                    {currentPlan.name}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {currentPlan.tagline}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenStudyPage(currentPlan.id);
                    }}
                    className="py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>स्टडी हब खोलें →</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      triggerIdCard();
                    }}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>डिजिटल ID कार्ड देखें</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick 3 Feature Launch Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div 
                onClick={() => {
                  onClose();
                  onOpenStudyPage(currentPlan.id);
                }}
                className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 hover:border-orange-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h5 className="font-black text-sm text-slate-900 group-hover:text-orange-700">
                  सचित्र स्टडी नोट्स
                </h5>
                <p className="text-xs text-slate-600">
                  NCERT आधारित पाठ, बोलकर सुनने की सुविधा और डाउनलोड नोट्स।
                </p>
              </div>

              <div 
                onClick={() => {
                  onClose();
                  onOpenStudyPage(currentPlan.id);
                }}
                className="p-4 rounded-2xl bg-red-50/70 border border-red-200 hover:border-red-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow">
                  <Tv className="w-5 h-5" />
                </div>
                <h5 className="font-black text-sm text-slate-900 group-hover:text-red-700">
                  वीडियो कक्षाएं
                </h5>
                <p className="text-xs text-slate-600">
                  IOIS आधिकारिक वीडियो व विषयवार दृश्य पाठ देखें व नोट्स बनाएं।
                </p>
              </div>

              <div 
                onClick={() => {
                  onClose();
                  onOpenStudyPage(currentPlan.id);
                }}
                className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 hover:border-purple-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow">
                  <Pencil className="w-5 h-5" />
                </div>
                <h5 className="font-black text-sm text-slate-900 group-hover:text-purple-700">
                  अक्षर व ड्राइंग ट्रेसिंग
                </h5>
                <p className="text-xs text-slate-600">
                  अक्षर, गिनती व डायग्राम्स के ऊपर हाथ से पेंसिल चलाकर अभ्यास करें।
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: STUDY PROGRESS */}
        {activeTab === 'progress' && (
          <div className="p-6 overflow-y-auto space-y-6">
            
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    शैक्षणिक प्रगति विवरण (Academic Progress)
                  </span>
                  <h4 className="text-lg font-black mt-1">
                    {currentPlan.name}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  सक्रिय सत्र 2026
                </span>
              </div>
              <p className="text-xs text-slate-300">
                आपके सभी मॉड्यूल, वीडियो कक्षाएं, टेस्ट और गृहकार्य का रिकॉर्ड यहाँ सुरक्षित रहता है।
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <BookOpen className="w-5 h-5 text-orange-600 mx-auto" />
                <span className="text-xs font-bold text-slate-600 block mt-1">स्टडी नोट्स</span>
                <span className="text-lg font-black text-slate-900 block mt-0.5">सक्रिय</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Tv className="w-5 h-5 text-red-600 mx-auto" />
                <span className="text-xs font-bold text-slate-600 block mt-1">वीडियो कक्षाएं</span>
                <span className="text-lg font-black text-slate-900 block mt-0.5">उपलब्ध</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Pencil className="w-5 h-5 text-purple-600 mx-auto" />
                <span className="text-xs font-bold text-slate-600 block mt-1">ट्रेसिंग पैड</span>
                <span className="text-lg font-black text-slate-900 block mt-0.5">लाइव</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <FileCheck2 className="w-5 h-5 text-emerald-600 mx-auto" />
                <span className="text-xs font-bold text-slate-600 block mt-1">दैनिक होमवर्क</span>
                <span className="text-lg font-black text-slate-900 block mt-0.5">जांच सक्रिय</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => {
                  onClose();
                  onOpenStudyPage(currentPlan.id);
                }}
                className="py-3 px-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md"
              >
                सीधे अभ्यास व टेस्ट शुरू करें →
              </button>
            </div>

          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: CONNECTED DEVICES & MULTI-DEVICE SECURITY LIMITS */}
        {/* ============================================================= */}
        {activeTab === 'devices' && (
          <div className="p-6 overflow-y-auto space-y-5 text-xs">
            
            {/* Top Security Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-blue-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-black text-sm text-white">
                    मल्टी-डिवाइस सुरक्षा प्रबंधन (Device Sessions)
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

            {/* Logout from all devices Confirmation Modal/Box */}
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

            {/* Device List Header */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-extrabold text-slate-800 text-sm">
                सक्रिय सत्र एवं कनेक्टेड डिवाइसेज की सूची
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                कुल कनेक्टेड: {deviceList.length}
              </span>
            </div>

            {/* Connected Devices Cards */}
            <div className="space-y-3">
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

            {/* Multi-Device Security Protocol Info Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2 mt-4">
              <div className="font-black flex items-center gap-1.5 text-amber-900 text-xs">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>IOIS सुरक्षा व गोपनीयता नीति (Multi-Device Security Protocol):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/90 leading-relaxed">
                <li>
                  <strong>समवर्ती सीमा (Max 4 Devices):</strong> एक छात्र खाते को अधिकतम 4 व्यक्तिगत डिवाइसेज (जैसे आपका फोन, टैब, लैपटॉप) पर ही चलाने की अनुमति है।
                </li>
                <li>
                  <strong>अनधिकृत उपयोग से सुरक्षा:</strong> यदि आपको कोई अपरिचित डिवाइस दिखाई दे, तो तुरंत <strong>"सभी डिवाइसेज से लॉगआउट करें"</strong> बटन दबाएं और अपना पासवर्ड बदलें।
                </li>
                <li>
                  <strong>सुरक्षित ऑटो-सिंक:</strong> रिमोट डिवाइस से सत्र समाप्त करने पर उस डिवाइस पर किट व डैशबोर्ड एक्सेस तुरंत निष्प्रभावी हो जाता है।
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* TAB 4: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4">
            
            {/* Permanent Non-Editable User ID Box */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-700 shrink-0" />
                <div>
                  <span className="font-bold text-[#1e3a8a] block">
                    स्थायी छात्र User ID: <span className="font-mono font-black text-amber-700">{currentUser.rollNumber || currentUser.memberId}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    सुरक्षा एवं सत्यापन हेतु यह यूजर आईडी गैर-संपादन योग्य है।
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(currentUser.rollNumber || currentUser.memberId);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] transition-colors shrink-0"
              >
                {copiedLink ? 'कॉपी हुआ!' : 'कॉपी ID'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700">विद्यार्थी का नाम</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">कक्षा / स्तर</label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">मोबाइल नंबर</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ईमेल आईडी</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">शहर / जिला</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">राज्य</label>
                <input
                  type="text"
                  value={editState}
                  onChange={(e) => setEditState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="submit"
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>प्रोफाइल सेव करें</span>
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export default UserDashboardModal;
