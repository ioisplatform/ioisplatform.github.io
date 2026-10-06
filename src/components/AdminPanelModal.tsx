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
  getSiteSettings, 
  saveSiteSettings, 
  resetSiteSettings, 
  addPromotionalPoster, 
  removePromotionalPoster, 
  togglePromotionalPoster, 
  addCustomService, 
  removeServiceById, 
  restoreServiceById, 
  SiteSettings,
  PromotionalPoster,
  DynamicServiceItem
} from '../services/siteSettingsService';
import {
  AdminActivityLog,
  getActivityLogs,
  logAdminActivity,
  clearActivityLogs,
  resetActivityLogs,
  exportLogsAsJson,
  exportLogsAsCsv,
  formatRelativeTime,
  subscribeToActivityLogs,
  ActivityCategory,
  ActivitySeverity
} from '../services/activityLogService';
import { ioisServicesList } from '../data/ioisPlansData';
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
  Users,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Globe,
  Plus,
  Radio,
  Megaphone,
  Settings2,
  HelpCircle,
  MessageSquare,
  Send,
  Smartphone,
  Check,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon,
  History,
  FileSpreadsheet,
  FileText,
  Activity,
  Filter,
  Clock,
  AlertTriangle,
  Info
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

  // Admin Tabs: 'students' | 'website_controls' | 'promotions' | 'services' | 'passwords' | 'settings' | 'activity_logs'
  const [activeAdminTab, setActiveAdminTab] = useState<'students' | 'website_controls' | 'promotions' | 'services' | 'passwords' | 'settings' | 'activity_logs'>('students');
  const [planPasswords, setPlanPasswords] = useState<Record<string, string>>(() => getAllPlanPasswords());
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<Record<string, string>>({});
  const [showPlanPass, setShowPlanPass] = useState<Record<string, boolean>>({});
  const [newAdminKey, setNewAdminKey] = useState('');
  const [adminKeyMsg, setAdminKeyMsg] = useState('');
  const [viewingImage, setViewingImage] = useState<{ title: string; url: string } | null>(null);

  // Dynamic Site Settings (Helpline, Address, Contact Buttons, Ticker)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSiteSettings());
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  // Administrative Activity Audit Logs State
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => getActivityLogs());
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState<'all' | ActivityCategory>('all');
  const [logSeverityFilter, setLogSeverityFilter] = useState<'all' | ActivitySeverity>('all');
  const [logActionMsg, setLogActionMsg] = useState('');

  // Add Promotional Poster state
  const [posterTitle, setPosterTitle] = useState('');
  const [posterSubtitle, setPosterSubtitle] = useState('');
  const [posterBadge, setPosterBadge] = useState('★ स्पेशल ऑफर 2026');
  const [posterImageUrl, setPosterImageUrl] = useState('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80');
  const [posterTargetLink, setPosterTargetLink] = useState('#plans');
  const [posterButtonText, setPosterButtonText] = useState('अभी जॉइन करें');
  const [posterSuccessMsg, setPosterSuccessMsg] = useState('');

  // Add Service state
  const [srvNameHindi, setSrvNameHindi] = useState('');
  const [srvNameEnglish, setSrvNameEnglish] = useState('');
  const [srvCategory, setSrvCategory] = useState<'study' | 'career' | 'tools' | 'govt' | 'finance' | 'general'>('study');
  const [srvDescription, setSrvDescription] = useState('');
  const [srvIcon, setSrvIcon] = useState('GraduationCap');
  const [srvBadge, setSrvBadge] = useState('नया');
  const [srvUrlOrType, setSrvUrlOrType] = useState('internal-plans');
  const [srvSuccessMsg, setSrvSuccessMsg] = useState('');

  // Load members on auth and subscribe to live activity logs
  useEffect(() => {
    if (isAuthenticated) {
      loadMembers();
      setPlanPasswords(getAllPlanPasswords());
      setActivityLogs(getActivityLogs());
      const unsubscribe = subscribeToActivityLogs((updatedLogs) => {
        setActivityLogs(updatedLogs);
      });
      return () => unsubscribe();
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
      // Log successful admin authentication
      logAdminActivity({
        actionType: 'admin_login',
        title: 'मास्टर एडमिन सफल लॉगिन (Admin Session Authenticated)',
        description: 'अधिकृत मास्टर पासवर्ड द्वारा एडमिन कंट्रोल कंसोल में सुरक्षित प्रवेश दर्ज किया गया।',
        category: 'security',
        severity: 'info',
        adminUser: 'मुख्य एडमिन (Master Admin)'
      });
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
      // Log plan password update
      logAdminActivity({
        actionType: 'password_update',
        title: `सुरक्षा पासवर्ड अद्यतन: ${planId.toUpperCase()}`,
        description: `अध्ययन योजना "${planId}" हेतु विद्यार्थी अनलॉक पासवर्ड सुरक्षित किया गया।`,
        category: 'security',
        severity: 'warning',
        adminUser: 'मुख्य एडमिन (Master Admin)'
      });
      setTimeout(() => {
        setPasswordStatusMsg(prev => ({ ...prev, [planId]: '' }));
      }, 3000);
    }
  };

  const handleResetAllPasswords = () => {
    if (confirm('क्या आप सभी 7 प्लान्स के पासवर्ड मूल डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      resetAllPlanPasswords();
      setPlanPasswords(getAllPlanPasswords());
      // Log all passwords reset
      logAdminActivity({
        actionType: 'password_reset_all',
        title: 'सभी 7 प्लान पासवर्ड्स रीसेट (Passwords Reset)',
        description: 'प्लेटफॉर्म के सभी 7 अध्ययन प्लान्स के पासवर्ड मूल डिफ़ॉल्ट मानों पर रीसेट कर दिए गए।',
        category: 'security',
        severity: 'alert',
        adminUser: 'मुख्य एडमिन (Master Admin)'
      });
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
    // Log master password change
    logAdminActivity({
      actionType: 'master_key_update',
      title: 'मास्टर एडमिन सुरक्षा पासवर्ड अपडेट (Master Key Changed)',
      description: 'एडमिन कंट्रोल पैनल का मुख्य मास्टर सुरक्षा पासवर्ड सफलतापूर्वक बदला गया।',
      category: 'security',
      severity: 'alert',
      adminUser: 'मुख्य एडमिन (Master Admin)'
    });
    setAdminKeyMsg('✓ मास्टर एडमिन पासवर्ड सफलतापूर्वक अपडेट हो गया!');
    setNewAdminKey('');
    setTimeout(() => setAdminKeyMsg(''), 3000);
  };

  // Website Controls & Helpline Handlers
  const handleSaveWebsiteControls = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSiteSettings(siteSettings);
    setSiteSettings(updated);
    // Log website settings update
    logAdminActivity({
      actionType: 'helpline_update',
      title: 'वेबसाइट कंट्रोल एवं संपर्क सेटिंग्स अपडेट',
      description: `हेल्पलाइन: ${updated.helplinePhone}, WhatsApp: ${updated.helplineWhatsapp}, फ्लोटिंग बटन: ${updated.floatingContactWidgetEnabled ? 'चालू' : 'बंद'}, पता: ${updated.headOfficeAddress}`,
      category: 'settings',
      severity: 'success',
      adminUser: 'मुख्य एडमिन (Master Admin)'
    });
    setSettingsSuccessMsg('✓ हेल्पलाइन, पता, संपर्क बटन व वेबसाइट सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं!');
    setTimeout(() => setSettingsSuccessMsg(''), 4000);
  };

  const handleResetWebsiteControls = () => {
    if (confirm('क्या आप वेबसाइट की सभी हेल्पलाइन, पता और संपर्क सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      const def = resetSiteSettings();
      setSiteSettings(def);
      // Log website settings reset
      logAdminActivity({
        actionType: 'settings_reset',
        title: 'वेबसाइट सेटिंग्स मूल डिफ़ॉल्ट पर रीसेट',
        description: 'आधिकारिक हेल्पलाइन, हेड ऑफिस पता, व्हाट्सएप नंबर व संपर्क बटन डिफ़ॉल्ट मानों पर रीसेट किए गए।',
        category: 'settings',
        severity: 'warning',
        adminUser: 'मुख्य एडमिन (Master Admin)'
      });
      setSettingsSuccessMsg('डिफ़ॉल्ट सेटिंग्स सफलतापूर्वक पुनर्स्थापित कर दी गई हैं।');
      setTimeout(() => setSettingsSuccessMsg(''), 3000);
    }
  };

  // Promotional Poster Handlers
  const handleAddPoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterTitle.trim() || !posterImageUrl.trim()) {
      setPosterSuccessMsg('कृपया शीर्षक और इमेज URL भरें।');
      return;
    }
    const newPoster = addPromotionalPoster({
      title: posterTitle.trim(),
      subtitle: posterSubtitle.trim() || 'IOIS राष्ट्रीय डिजिटल शिक्षा नेटवर्क',
      badge: posterBadge.trim() || 'ऑफर 2026',
      imageUrl: posterImageUrl.trim(),
      targetLink: posterTargetLink.trim() || '#plans',
      buttonText: posterButtonText.trim() || 'अध्ययन करें',
      isActive: true
    });
    setSiteSettings(getSiteSettings());
    // Log promotional poster addition
    logAdminActivity({
      actionType: 'poster_added',
      title: `नया प्रमोशनल पोस्टर जोड़ा गया: ${posterTitle.trim()}`,
      description: `होमपेज बैनर हेतु नया पोस्टर "${posterTitle.trim()}" (बैज: "${posterBadge.trim()}", लिंक: "${posterTargetLink.trim() || '#plans'}") सक्रिय किया गया।`,
      category: 'promotions',
      severity: 'success',
      adminUser: 'मुख्य एडमिन (Master Admin)'
    });
    setPosterTitle('');
    setPosterSubtitle('');
    setPosterSuccessMsg('✓ नया प्रमोशनल पोस्टर सफलतापूर्वक जोड़ दिया गया!');
    setTimeout(() => setPosterSuccessMsg(''), 3500);
  };

  const handleRemovePoster = (posterId: string) => {
    if (confirm('क्या आप इस प्रमोशनल पोस्टर को हटाना चाहते हैं?')) {
      removePromotionalPoster(posterId);
      setSiteSettings(getSiteSettings());
      // Log poster removal
      logAdminActivity({
        actionType: 'poster_removed',
        title: 'प्रमोशनल पोस्टर हटाया गया (Banner Removed)',
        description: `पोस्टर ID ${posterId} को होमपेज स्लाइडर से सफलतापूर्वक हटा दिया गया।`,
        category: 'promotions',
        severity: 'warning',
        adminUser: 'मुख्य एडमिन (Master Admin)'
      });
      setPosterSuccessMsg('पोस्टर सफलतापूर्वक हटा दिया गया।');
      setTimeout(() => setPosterSuccessMsg(''), 3000);
    }
  };

  const handleTogglePoster = (posterId: string, currentActive: boolean) => {
    togglePromotionalPoster(posterId, !currentActive);
    setSiteSettings(getSiteSettings());
    // Log poster visibility toggle
    logAdminActivity({
      actionType: 'poster_toggled',
      title: `पोस्टर स्थिति बदली: ${!currentActive ? 'सक्रिय (Live)' : 'निष्क्रिय (Hidden)'}`,
      description: `पोस्टर ID ${posterId} का लाइव डिस्प्ले स्टेटस ${!currentActive ? 'चालू' : 'बंद'} किया गया।`,
      category: 'promotions',
      severity: 'info',
      adminUser: 'मुख्य एडमिन (Master Admin)'
    });
  };

  // Services Management Handlers (Add / Remove)
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvNameHindi.trim() || !srvDescription.trim()) {
      setSrvSuccessMsg('कृपया सर्विस का नाम और विवरण भरें।');
      return;
    }
    addCustomService({
      nameHindi: srvNameHindi.trim(),
      nameEnglish: srvNameEnglish.trim() || srvNameHindi.trim(),
      category: srvCategory,
      description: srvDescription.trim(),
      iconName: srvIcon,
      badge: srvBadge.trim(),
      urlOrType: srvUrlOrType.trim() || 'internal-plans',
      isPopular: true
    });
    setSiteSettings(getSiteSettings());
    // Log service addition
    logAdminActivity({
      actionType: 'service_added',
      title: `नई जनसेवा जोड़ी गई: ${srvNameHindi.trim()}`,
      description: `वेबसाइट पर नई सर्विस "${srvNameHindi.trim()}" (वर्ग: ${srvCategory}) लाइव की गई।`,
      category: 'services',
      severity: 'success',
      adminUser: 'मुख्य एडमिन (Master Admin)'
    });
    setSrvNameHindi('');
    setSrvNameEnglish('');
    setSrvDescription('');
    setSrvSuccessMsg('✓ नई सर्विस सफलतापूर्वक जोड़ दी गई!');
    setTimeout(() => setSrvSuccessMsg(''), 3500);
  };

  const handleRemoveService = (serviceId: string) => {
    if (confirm('क्या आप इस सर्विस को वेबसाइट से हटाना चाहते हैं?')) {
      removeServiceById(serviceId);
      setSiteSettings(getSiteSettings());
      // Log service removal
      logAdminActivity({
        actionType: 'service_removed',
        title: `सेवा हटाई गई (ID: ${serviceId})`,
        description: 'सर्विस को वेबसाइट सूची से हटाया गया (एडमिन पैनल से कभी भी पुनर्स्थापित की जा सकती है)।',
        category: 'services',
        severity: 'warning',
        adminUser: 'मुख्य एडमिन (Master Admin)'
      });
      setSrvSuccessMsg('सर्विस वेबसाइट से हटा दी गई है। (आप नीचे से इसे कभी भी रीस्टोर कर सकते हैं)');
      setTimeout(() => setSrvSuccessMsg(''), 3500);
    }
  };

  const handleRestoreService = (serviceId: string) => {
    restoreServiceById(serviceId);
    setSiteSettings(getSiteSettings());
    // Log service restoration
    logAdminActivity({
      actionType: 'service_restored',
      title: `सेवा पुनर्स्थापित की गई (ID: ${serviceId})`,
      description: 'हटाई गई सर्विस को पुनः सक्रिय कर वेबसाइट पर प्रदर्शित किया गया।',
      category: 'services',
      severity: 'success',
      adminUser: 'मुख्य एडमिन (Master Admin)'
    });
    setSrvSuccessMsg('✓ सर्विस सफलतापूर्वक पुनः सक्रिय कर दी गई!');
    setTimeout(() => setSrvSuccessMsg(''), 3000);
  };

  // Activity Logs Management Handlers
  const handleClearAllLogs = () => {
    if (confirm('क्या आप ऑडिट एक्टिविटी लॉग्स की सभी एंट्रियां साफ़ करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।')) {
      clearActivityLogs();
      setActivityLogs([]);
      setLogActionMsg('✓ सभी एक्टिविटी लॉग्स साफ़ कर दिए गए हैं।');
      setTimeout(() => setLogActionMsg(''), 3000);
    }
  };

  const handleResetSeedLogs = () => {
    if (confirm('क्या आप एक्टिविटी लॉग्स को प्रारंभिक सिस्टम ऑडिट ट्रेल्स पर रीसेट करना चाहते हैं?')) {
      const reset = resetActivityLogs();
      setActivityLogs(reset);
      setLogActionMsg('✓ एक्टिविटी लॉग्स प्रारंभिक ऑडिट ट्रेल्स पर रीसेट हो गए हैं।');
      setTimeout(() => setLogActionMsg(''), 3000);
    }
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
      // Log student kit update
      logAdminActivity({
        actionType: 'student_kit_update',
        title: `विद्यार्थी किट/भुगतान अपडेट: ${editingMember.name}`,
        description: `रोल: ${editingMember.rollNumber || editingMember.memberId}, प्लान: ${planName}, शुल्क: ₹${editAmount}, स्टेटस: ${editStatus}`,
        category: 'students',
        severity: 'success',
        adminUser: 'मुख्य एडमिन (Master Admin)'
      });
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
    // Log student deletion
    logAdminActivity({
      actionType: 'student_delete',
      title: `विद्यार्थी रिकॉर्ड स्थायी रूप से हटाया गया (${roll})`,
      description: `विद्यार्थी ID: ${memberId}, रोल नंबर: ${roll} को डेटाबेस से हमेशा के लिए हटाया गया।`,
      category: 'students',
      severity: 'alert',
      adminUser: 'मुख्य एडमिन (Master Admin)'
    });
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

    // Log manual student registration
    logAdminActivity({
      actionType: 'student_manual_add',
      title: `नया विद्यार्थी मैनुअल पंजीकृत: ${newName.trim()}`,
      description: `मोबाइल: ${newPhone.trim()}, प्लान: ${planObj.name}, UTR: ${newUtr.trim() || 'ADMIN-OFFLINE'} दर्ज किया गया।`,
      category: 'students',
      severity: 'info',
      adminUser: 'मुख्य एडमिन (Master Admin)'
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

                {/* 1. Website Controls: Helpline, Address, Contact Buttons */}
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('website_controls')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeAdminTab === 'website_controls'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-emerald-300" />
                  <span>🌐 हेल्पलाइन, पता व संपर्क बटन</span>
                </button>

                {/* 2. Promotional Posters: Add & Remove */}
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('promotions')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeAdminTab === 'promotions'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-amber-300" />
                  <span>🖼️ प्रमोशनल पोस्टर ({siteSettings.promotionalPosters.length})</span>
                </button>

                {/* 3. Services Management: Add & Remove */}
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('services')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeAdminTab === 'services'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>⚡ सर्विसेज (Add & Remove)</span>
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
                  <span>🔐 7 प्लान पासवर्ड</span>
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
                  <span>🛡️ मास्टर पासवर्ड</span>
                </button>

                {/* 4. Activity Logs & Audit Trail Tab */}
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('activity_logs')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeAdminTab === 'activity_logs'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <History className="w-4 h-4 text-rose-300" />
                  <span>📜 एक्टिविटी लॉग्स ({activityLogs.length})</span>
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

              {activeAdminTab === 'activity_logs' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={exportLogsAsCsv}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="CSV प्रारूप में डाउनलोड करें"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CSV निर्यात</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportLogsAsJson}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-800 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="JSON प्रारूप में डाउनलोड करें"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>JSON निर्यात</span>
                  </button>
                </div>
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

            {/* ============================================================= */}
            {/* TAB: 🌐 WEBSITE CONTROLS (HELPLINE, ADDRESS, CONTACT BUTTONS) */}
            {/* ============================================================= */}
            {activeAdminTab === 'website_controls' && (
              <div className="space-y-6">
                
                {/* Header & Status message */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                      LIVE WEBSITE CONTROLS
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      वेबसाइट हेल्पलाइन, पता एवं संपर्क बटन नियंत्रण
                    </h3>
                    <p className="text-xs text-emerald-200">
                      यहाँ किया गया कोई भी बदलाव तुरंत पूरी वेबसाइट के नेवबार, फुटर व स्क्रीन पर लाइव अपडेट हो जाता है।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetWebsiteControls}
                      className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-600"
                    >
                      डिफ़ॉल्ट सेटिंग्स
                    </button>
                  </div>
                </div>

                {settingsSuccessMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>{settingsSuccessMsg}</span>
                    </div>
                    <button onClick={() => setSettingsSuccessMsg('')} className="text-emerald-800 font-black">✕</button>
                  </div>
                )}

                <form onSubmit={handleSaveWebsiteControls} className="space-y-6">
                  
                  {/* SECTION 1: SYSTEM HELPLINE & SUPPORT CHANNELS */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">
                          1. सिस्टम हेल्पलाइन एवं सपोर्ट चैनल्स (System Helpline)
                        </h4>
                        <p className="text-xs text-slate-500">
                          कॉल, व्हाट्सएप व ईमेल सपोर्ट विवरण
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          हेल्पलाइन कॉलिंग नंबर (Phone Number) *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.helplinePhone}
                          onChange={(e) => setSiteSettings({ ...siteSettings, helplinePhone: e.target.value })}
                          placeholder="+91 8877490845"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-600 font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          व्हाट्सएप हेल्पलाइन नंबर (WhatsApp Number) *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.helplineWhatsapp}
                          onChange={(e) => setSiteSettings({ ...siteSettings, helplineWhatsapp: e.target.value })}
                          placeholder="+91 8877490845"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-600 font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          आधिकारिक सहायता ईमेल (Official Email) *
                        </label>
                        <input
                          type="email"
                          value={siteSettings.helplineEmail}
                          onChange={(e) => setSiteSettings({ ...siteSettings, helplineEmail: e.target.value })}
                          placeholder="ioisplatform@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-600"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          हेल्पलाइन सेवा समय (Working Hours)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.helplineHours}
                          onChange={(e) => setSiteSettings({ ...siteSettings, helplineHours: e.target.value })}
                          placeholder="सोमवार से शनिवार: सुबह 9:00 से रात 8:00 तक"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          शीर्ष हेल्पलाइन स्ट्रिप बैनर (Header Notice Banner Text)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.helplineNoticeBanner}
                          onChange={(e) => setSiteSettings({ ...siteSettings, helplineNoticeBanner: e.target.value })}
                          placeholder="🇮🇳 भारत का आधिकारिक डिजिटल शिक्षा एवं कौशल मंच • अधिकृत 24x7 हेल्पलाइन सक्रिय"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: HEAD OFFICE ADDRESS & LOCATION */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">
                          2. पंजीकृत कार्यालय का पता एवं लोकेशन (Official Address)
                        </h4>
                        <p className="text-xs text-slate-500">
                          वेबसाइट के फुटर एवं संपर्क सेक्शन में प्रदर्शित होने वाला आधिकारिक पता
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          संस्थान / संस्था का नाम (Organization Name) *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.organizationName}
                          onChange={(e) => setSiteSettings({ ...siteSettings, organizationName: e.target.value })}
                          placeholder="IOIS National Digital Education Network"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-blue-600"
                          required
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          प्रधान कार्यालय पता (Head Office Address) *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.headOfficeAddress}
                          onChange={(e) => setSiteSettings({ ...siteSettings, headOfficeAddress: e.target.value })}
                          placeholder="IOIS डिजिटल भवन, निकट गांधी मैदान, डाकबंगला चौराहा"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          शहर (City)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.city}
                          onChange={(e) => setSiteSettings({ ...siteSettings, city: e.target.value })}
                          placeholder="पटना (Patna)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          राज्य (State)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.state}
                          onChange={(e) => setSiteSettings({ ...siteSettings, state: e.target.value })}
                          placeholder="बिहार (Bihar)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          पिन कोड (PIN Code)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.pincode}
                          onChange={(e) => setSiteSettings({ ...siteSettings, pincode: e.target.value })}
                          placeholder="800001"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          गूगल मैप्स लिंक (Google Maps Location URL)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.googleMapsUrl}
                          onChange={(e) => setSiteSettings({ ...siteSettings, googleMapsUrl: e.target.value })}
                          placeholder="https://maps.google.com/?q=Patna+Bihar"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: CONTACT BUTTONS & FLOATING CALL/WHATSAPP WIDGET */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">
                          3. संपर्क बटन एवं फ्लोटिंग क्विक विजेट (Contact Buttons & Widgets)
                        </h4>
                        <p className="text-xs text-slate-500">
                          वेबसाइट के मुख्य संपर्क बटन, फ्लोटिंग व्हाट्सएप व कॉल विजेट का नियंत्रण
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          संपर्क बटन का नाम (Contact Button Label)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.contactButtonText}
                          onChange={(e) => setSiteSettings({ ...siteSettings, contactButtonText: e.target.value })}
                          placeholder="सहायता व संपर्क करें"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-amber-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          व्हाट्सएप डायरेक्ट मैसेज टेक्स्ट (Pre-filled Message)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.whatsappDirectMessage}
                          onChange={(e) => setSiteSettings({ ...siteSettings, whatsappDirectMessage: e.target.value })}
                          placeholder="नमस्ते IOIS टीम! मुझे अध्ययन किट व पंजीकरण के संबंध में जानकारी चाहिए।"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-amber-600"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            संपर्क बटन एक्टिव रखें
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            नेवबार व हेडर में संपर्क बटन दिखेगा
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteSettings.contactButtonEnabled}
                          onChange={(e) => setSiteSettings({ ...siteSettings, contactButtonEnabled: e.target.checked })}
                          className="w-5 h-5 accent-emerald-600 cursor-pointer"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-emerald-950 block">
                            स्क्रीन पर फ्लोटिंग कॉल/व्हाट्सएप विजेट दिखाएं
                          </span>
                          <span className="text-[11px] text-emerald-800 block">
                            वेबसाइट के दाएं कोने में 1-क्लिक कॉल व व्हाट्सएप बटन
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteSettings.floatingContactWidgetEnabled}
                          onChange={(e) => setSiteSettings({ ...siteSettings, floatingContactWidgetEnabled: e.target.checked })}
                          className="w-5 h-5 accent-emerald-600 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          टेलीग्राम चैनल लिंक (Telegram Channel)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.telegramChannel}
                          onChange={(e) => setSiteSettings({ ...siteSettings, telegramChannel: e.target.value })}
                          placeholder="https://t.me/ioisplatform"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          टेलीग्राम एडमिन बॉट लिंक (Telegram Bot)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.telegramBot}
                          onChange={(e) => setSiteSettings({ ...siteSettings, telegramBot: e.target.value })}
                          placeholder="https://t.me/iois_admin_notification_bot"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: ANNOUNCEMENT TICKER */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">
                            4. लाइव घोषणा एवं सूचना टिकर (Live Announcement Ticker)
                          </h4>
                          <p className="text-xs text-slate-500">
                            वेबसाइट के शीर्ष पर चलने वाला आवश्यक सूचना संदेश
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                        <span>टिकर सक्रिय:</span>
                        <input
                          type="checkbox"
                          checked={siteSettings.announcementTickerEnabled}
                          onChange={(e) => setSiteSettings({ ...siteSettings, announcementTickerEnabled: e.target.checked })}
                          className="w-4 h-4 accent-orange-600"
                        />
                      </label>
                    </div>

                    <div className="space-y-1">
                      <textarea
                        rows={2}
                        value={siteSettings.announcementTickerText}
                        onChange={(e) => setSiteSettings({ ...siteSettings, announcementTickerText: e.target.value })}
                        placeholder="घोषणा संदेश लिखें..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-orange-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>वेबसाइट सेटिंग्स सुरक्षित करें (Save Changes)</span>
                    </button>
                  </div>

                </form>

              </div>
            )}

            {/* ============================================================= */}
            {/* TAB: 🖼️ PROMOTIONAL POSTERS & BANNERS (ADD & REMOVE)          */}
            {/* ============================================================= */}
            {activeAdminTab === 'promotions' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-600 to-orange-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-black uppercase tracking-wider">
                      PROMOTIONAL BANNERS & POSTERS
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      प्रमोशनल पोस्टर एवं बैनर नियंत्रण (Add & Remove)
                    </h3>
                    <p className="text-xs text-amber-100">
                      वेबसाइट पर प्रचार पोस्टर जोड़ें, हटाएं या सक्रिय/निष्क्रिय करें।
                    </p>
                  </div>
                </div>

                {posterSuccessMsg && (
                  <div className="p-3.5 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-between shadow-xs">
                    <span>{posterSuccessMsg}</span>
                    <button onClick={() => setPosterSuccessMsg('')} className="font-black">✕</button>
                  </div>
                )}

                {/* FORM: ADD NEW PROMOTIONAL POSTER */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        नया प्रमोशनल पोस्टर जोड़ें (Add New Poster)
                      </h4>
                      <p className="text-xs text-slate-500">
                        पोस्टर का शीर्षक, इमेज URL, बैज व लक्ष्य लिंक दर्ज करें
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddPoster} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          पोस्टर मुख्य शीर्षक (Title) *
                        </label>
                        <input
                          type="text"
                          value={posterTitle}
                          onChange={(e) => setPosterTitle(e.target.value)}
                          placeholder="उदा. बाल विकास किट - 70% इंस्टेंट पेआउट"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-amber-600"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          ऑफर बैज (Badge Text)
                        </label>
                        <input
                          type="text"
                          value={posterBadge}
                          onChange={(e) => setPosterBadge(e.target.value)}
                          placeholder="उदा. ★ स्पेशल ऑफर 2026"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-amber-600"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          उप-शीर्षक / विवरण (Subtitle / Description)
                        </label>
                        <input
                          type="text"
                          value={posterSubtitle}
                          onChange={(e) => setPosterSubtitle(e.target.value)}
                          placeholder="उदा. कक्षा 1 से 12 तक NCERT डिजिटल नोट्स, वीडियो कक्षाएं एवं प्रमाणन"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-amber-600"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          पोस्टर इमेज URL (Poster Image URL) *
                        </label>
                        <input
                          type="text"
                          value={posterImageUrl}
                          onChange={(e) => setPosterImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-amber-600"
                          required
                        />

                        {/* Quick Preset Image Selectors */}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-bold">त्वरित इमेज चयन:</span>
                          <button
                            type="button"
                            onClick={() => setPosterImageUrl('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80')}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                          >
                            बाल विकास (Kids Education)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPosterImageUrl('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80')}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                          >
                            युवा कौशल (Youth Skills)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPosterImageUrl('https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80')}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                          >
                            NEET/JEE (Science Lab)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPosterImageUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80')}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                          >
                            डिजिटल लाइब्रेरी (Digital Study)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          टारगेट लिंक (Target Link)
                        </label>
                        <input
                          type="text"
                          value={posterTargetLink}
                          onChange={(e) => setPosterTargetLink(e.target.value)}
                          placeholder="#plans"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-amber-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          बटन टेक्स्ट (Button Text)
                        </label>
                        <input
                          type="text"
                          value={posterButtonText}
                          onChange={(e) => setPosterButtonText(e.target.value)}
                          placeholder="अभी जॉइन करें"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-amber-600 font-bold"
                        />
                      </div>

                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>पोस्टर वेबसाइट में जोड़ें</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* LIST OF ACTIVE POSTERS */}
                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>वर्तमान प्रमोशनल पोस्टर्स ({siteSettings.promotionalPosters.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {siteSettings.promotionalPosters.map((poster) => (
                      <div
                        key={poster.id}
                        className={`rounded-3xl border overflow-hidden bg-white shadow-xs flex flex-col justify-between transition-all ${
                          poster.isActive ? 'border-amber-300 ring-1 ring-amber-300/30' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                          <img
                            src={poster.imageUrl}
                            alt={poster.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-black/70 text-amber-300 text-[10px] font-black backdrop-blur-xs">
                              {poster.badge}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              poster.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {poster.isActive ? 'सक्रिय (Live)' : 'बंद (Inactive)'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h5 className="font-extrabold text-sm text-slate-900 leading-snug">
                              {poster.title}
                            </h5>
                            <p className="text-xs text-slate-500 mt-1">
                              {poster.subtitle}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleTogglePoster(poster.id, poster.isActive)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                poster.isActive 
                                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                              }`}
                            >
                              {poster.isActive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemovePoster(poster.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>पोस्टर हटाएं</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================= */}
            {/* TAB: ⚡ SERVICES MANAGEMENT (ADD & REMOVE SERVICES)           */}
            {/* ============================================================= */}
            {activeAdminTab === 'services' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-400/30">
                      SERVICES CONTROL PANEL
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      वेबसाइट सर्विसेज प्रबंधन (Add & Remove Services)
                    </h3>
                    <p className="text-xs text-purple-200">
                      वेबसाइट पर प्रदर्शित जनसेवाएं, छात्र टूल्स एवं पोर्टल सेवाएं जोड़ें या हटाएं।
                    </p>
                  </div>
                </div>

                {srvSuccessMsg && (
                  <div className="p-3.5 rounded-2xl bg-purple-100 border border-purple-300 text-purple-950 text-xs font-bold flex items-center justify-between shadow-xs">
                    <span>{srvSuccessMsg}</span>
                    <button onClick={() => setSrvSuccessMsg('')} className="font-black">✕</button>
                  </div>
                )}

                {/* FORM: ADD NEW CUSTOM SERVICE */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        नई सर्विस वेबसाइट में जोड़ें (Add New Service)
                      </h4>
                      <p className="text-xs text-slate-500">
                        सर्विस का नाम, श्रेणी, विवरण, आइकन व एक्शन लिंक तय करें
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddService} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          सर्विस का नाम (हिंदी में) *
                        </label>
                        <input
                          type="text"
                          value={srvNameHindi}
                          onChange={(e) => setSrvNameHindi(e.target.value)}
                          placeholder="उदा. डिजिटल मार्कशीट व प्रमाण पत्र सत्यापन"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-purple-600"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          सर्विस का नाम (English)
                        </label>
                        <input
                          type="text"
                          value={srvNameEnglish}
                          onChange={(e) => setSrvNameEnglish(e.target.value)}
                          placeholder="उदा. Digital Marksheet & Certificate Verification"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-purple-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          सर्विस श्रेणी (Category)
                        </label>
                        <select
                          value={srvCategory}
                          onChange={(e) => setSrvCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-purple-600 bg-white"
                        >
                          <option value="study">📚 अध्ययन व शिक्षा (Study)</option>
                          <option value="career">💼 कैरियर व कौशल (Career)</option>
                          <option value="tools">🛠️ डिजिटल टूल्स (Tools)</option>
                          <option value="govt">🏛️ सरकारी व RTPS सेवाएं (Govt)</option>
                          <option value="finance">💰 इंसेंटिव व आमदनी (Finance)</option>
                          <option value="general">🌐 सामान्य सेवाएं (General)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          सर्विस आइकन (Icon)
                        </label>
                        <select
                          value={srvIcon}
                          onChange={(e) => setSrvIcon(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-purple-600 bg-white"
                        >
                          <option value="GraduationCap">🎓 GraduationCap (शिक्षा)</option>
                          <option value="Landmark">🏛️ Landmark (सरकारी/प्रशासनिक)</option>
                          <option value="CreditCard">💳 CreditCard (आईडी कार्ड/पेमेंट)</option>
                          <option value="Calculator">🧮 Calculator (गणना/कैलकुलेटर)</option>
                          <option value="Tv">📺 Tv (वीडियो/क्लास)</option>
                          <option value="Sparkles">✨ Sparkles (स्पेशल/मास्टर)</option>
                          <option value="Briefcase">💼 Briefcase (रोजगार/जॉब)</option>
                          <option value="Globe2">🌐 Globe2 (ऑनलाइन पोर्टल)</option>
                          <option value="PhoneCall">📞 PhoneCall (कॉल/हेल्पलाइन)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          सर्विस बैज (Badge Text)
                        </label>
                        <input
                          type="text"
                          value={srvBadge}
                          onChange={(e) => setSrvBadge(e.target.value)}
                          placeholder="उदा. नया, फ्री, 100% सत्यापित"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-purple-600 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          एक्शन लिंक या प्रकार (Target Link or Action)
                        </label>
                        <input
                          type="text"
                          value={srvUrlOrType}
                          onChange={(e) => setSrvUrlOrType(e.target.value)}
                          placeholder="internal-plans या कोई बाहरी URL"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-purple-600 font-mono"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          सर्विस विवरण (Description) *
                        </label>
                        <textarea
                          rows={2}
                          value={srvDescription}
                          onChange={(e) => setSrvDescription(e.target.value)}
                          placeholder="इस सेवा के बारे में संक्षिप्त जानकारी लिखें..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-purple-600"
                          required
                        />
                      </div>

                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>सर्विस सुरक्षित करें</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* CURRENT ACTIVE SERVICES */}
                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>वर्तमान में सक्रिय सर्विसेज (Active Services List)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Combine built-in (minus removed) + custom */}
                    {[
                      ...ioisServicesList.filter(s => !siteSettings.removedServiceIds.includes(s.id)),
                      ...siteSettings.customServices
                    ].map((srv) => (
                      <div
                        key={srv.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start justify-between gap-3 hover:border-purple-300 transition-colors"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-xs truncate">
                              {srv.nameHindi}
                            </span>
                            {srv.badge && (
                              <span className="px-2 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] shrink-0">
                                {srv.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 block truncate">
                            {srv.nameEnglish}
                          </span>
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            {srv.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveService(srv.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                          title="इस सर्विस को हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>हटाएं</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REMOVED SERVICES RESTORE LIST */}
                {siteSettings.removedServiceIds.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 space-y-2">
                    <h5 className="font-bold text-xs text-slate-800">
                      हटाई गई सर्विसेज (Removed Services — कभी भी पुनर्स्थापित करें):
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {siteSettings.removedServiceIds.map((rId) => {
                        const original = ioisServicesList.find(s => s.id === rId);
                        return (
                          <div key={rId} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center gap-2 shadow-2xs">
                            <span className="font-bold text-slate-700">{original?.nameHindi || rId}</span>
                            <button
                              type="button"
                              onClick={() => handleRestoreService(rId)}
                              className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[10px] hover:bg-emerald-200"
                            >
                              + पुनः जोड़ें (Restore)
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

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

            {/* TAB 4: ADMINISTRATIVE ACTIVITY LOGS & AUDIT TRAIL */}
            {activeAdminTab === 'activity_logs' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-slate-900 to-[#1e3a8a] text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-rose-500/10 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-black tracking-wider border border-rose-400/30">
                        <History className="w-3.5 h-3.5" />
                        <span>सुरक्षा ऑडिट एवं प्रशासनिक निगरानी • AUDIT LOGS</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        प्रशासनिक एक्टिविटी ऑडिट ट्रेल्स (Activity Logs)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                        प्रमोशनल बैनर, हेल्पलाइन, वेबसाइट सेटिंग्स, प्लान पासवर्ड्स व छात्र रिकॉर्ड्स में किए गए सभी प्रशासनिक परिवर्तनों का समयबद्ध सुरक्षित रिकॉर्ड।
                      </p>
                    </div>

                    {/* Quick export & clear buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={exportLogsAsCsv}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        title="CSV फाइल डाउनलोड करें"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>CSV डाउनलोड</span>
                      </button>
                      <button
                        type="button"
                        onClick={exportLogsAsJson}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        title="JSON फाइल डाउनलोड करें"
                      >
                        <FileText className="w-4 h-4" />
                        <span>JSON निर्यात</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActivityLogs(getActivityLogs());
                          setLogActionMsg('✓ एक्टिविटी लॉग्स ताज़ा किए गए!');
                          setTimeout(() => setLogActionMsg(''), 2500);
                        }}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="ताज़ा करें"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>रिफ्रेश</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetSeedLogs}
                        className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="प्रारंभिक ऑडिट ट्रेल्स पर रीसेट करें"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>रीसेट</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllLogs}
                        className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="सभी लॉग्स हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>साफ़ करें</span>
                      </button>
                    </div>
                  </div>
                </div>

                {logActionMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{logActionMsg}</span>
                  </div>
                )}

                {/* Audit Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-[11px] font-bold uppercase">कुल ऑडिट रिकॉर्ड्स</span>
                      <Activity className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-2xl font-black text-slate-900">{activityLogs.length}</span>
                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5">अपरिवर्तनीय ऑडिट ट्रेल</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-[11px] font-bold uppercase">प्रमोशंस व सेटिंग्स</span>
                      <ImageIcon className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-2xl font-black text-amber-600">
                      {activityLogs.filter(l => l.category === 'promotions' || l.category === 'settings' || l.category === 'services').length}
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold block mt-0.5">बैनर व वेबसाइट बदलाव</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-[11px] font-bold uppercase">सुरक्षा व पासवर्ड</span>
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                    </div>
                    <span className="text-2xl font-black text-rose-600">
                      {activityLogs.filter(l => l.category === 'security').length}
                    </span>
                    <span className="text-[10px] text-rose-700 font-bold block mt-0.5">क्रेडेंशियल्स व ऑथेंटिकेशन</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-[11px] font-bold uppercase">विद्यार्थी कार्यवाहियां</span>
                      <Users className="w-4 h-4 text-[#1e3a8a]" />
                    </div>
                    <span className="text-2xl font-black text-[#1e3a8a]">
                      {activityLogs.filter(l => l.category === 'students').length}
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold block mt-0.5">पंजीयन व किट सत्यापन</span>
                  </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={logSearchTerm}
                        onChange={(e) => setLogSearchTerm(e.target.value)}
                        placeholder="एक्टिविटी लॉग्स खोजें (शीर्षक, विवरण, एडमिन, एक्शन टाइप...)"
                        className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-200 font-medium"
                      />
                      {logSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setLogSearchTerm('')}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Severity Filter */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                      <select
                        value={logSeverityFilter}
                        onChange={(e) => setLogSeverityFilter(e.target.value as any)}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700 outline-none focus:border-rose-600"
                      >
                        <option value="all">सभी गंभीरता स्तर (All Severities)</option>
                        <option value="info">ℹ️ सूचना (Info)</option>
                        <option value="success">✅ सफल कार्यवाही (Success)</option>
                        <option value="warning">⚠️ चेतावनी (Warning)</option>
                        <option value="alert">🚨 सुरक्षा अलर्ट (Alert)</option>
                      </select>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 mr-1">श्रेणी:</span>
                    {[
                      { id: 'all', label: 'सभी श्रेणियां', count: activityLogs.length },
                      { id: 'settings', label: '🌐 सेटिंग्स व हेल्पलाइन', count: activityLogs.filter(l => l.category === 'settings').length },
                      { id: 'promotions', label: '🖼️ प्रमोशनल पोस्टर्स', count: activityLogs.filter(l => l.category === 'promotions').length },
                      { id: 'services', label: '⚡ जनसेवाएं', count: activityLogs.filter(l => l.category === 'services').length },
                      { id: 'security', label: '🛡️ सुरक्षा व पासवर्ड', count: activityLogs.filter(l => l.category === 'security').length },
                      { id: 'students', label: '👥 विद्यार्थी प्रबंधन', count: activityLogs.filter(l => l.category === 'students').length },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setLogCategoryFilter(cat.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          logCategoryFilter === cat.id
                            ? 'bg-rose-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          logCategoryFilter === cat.id ? 'bg-rose-800 text-rose-100' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chronological List of Audit Records */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        क्रमानुसार प्रशासनिक गतिविधियां (Chronological Timeline)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      प्रदर्शित: {
                        activityLogs.filter(l => {
                          const matchSearch = 
                            !logSearchTerm ||
                            l.title.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                            l.description.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                            l.adminUser.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                            l.actionType.toLowerCase().includes(logSearchTerm.toLowerCase());
                          const matchCat = logCategoryFilter === 'all' || l.category === logCategoryFilter;
                          const matchSev = logSeverityFilter === 'all' || l.severity === logSeverityFilter;
                          return matchSearch && matchCat && matchSev;
                        }).length
                      } / {activityLogs.length}
                    </span>
                  </div>

                  {(() => {
                    const filteredList = activityLogs
                      .filter(l => {
                        const matchSearch = 
                          !logSearchTerm ||
                          l.title.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                          l.description.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                          l.adminUser.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                          l.actionType.toLowerCase().includes(logSearchTerm.toLowerCase());
                        const matchCat = logCategoryFilter === 'all' || l.category === logCategoryFilter;
                        const matchSev = logSeverityFilter === 'all' || l.severity === logSeverityFilter;
                        return matchSearch && matchCat && matchSev;
                      })
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                    if (filteredList.length === 0) {
                      return (
                        <div className="p-12 text-center space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                            🔍
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm">कोई एक्टिविटी लॉग रिकॉर्ड नहीं मिला</h5>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            दिए गए फ़िल्टर या खोज शब्द से मेल खाती कोई प्रविष्टि नहीं है। कृपया फ़िल्टर रीसेट करें।
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setLogSearchTerm('');
                              setLogCategoryFilter('all');
                              setLogSeverityFilter('all');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            फ़िल्टर रीसेट करें
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="divide-y divide-slate-100">
                        {filteredList.map((log) => {
                          // Severity color and icons
                          const severityBadge = {
                            success: {
                              bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                              iconBg: 'bg-emerald-100 text-emerald-700',
                              icon: <CheckCircle2 className="w-4 h-4" />
                            },
                            info: {
                              bg: 'bg-blue-50 text-blue-800 border-blue-200',
                              iconBg: 'bg-blue-100 text-blue-700',
                              icon: <Info className="w-4 h-4" />
                            },
                            warning: {
                              bg: 'bg-amber-50 text-amber-800 border-amber-200',
                              iconBg: 'bg-amber-100 text-amber-700',
                              icon: <AlertTriangle className="w-4 h-4" />
                            },
                            alert: {
                              bg: 'bg-rose-50 text-rose-800 border-rose-200',
                              iconBg: 'bg-rose-100 text-rose-700',
                              icon: <AlertCircle className="w-4 h-4" />
                            }
                          }[log.severity || 'info'];

                          // Category label & color
                          const categoryMeta = {
                            settings: { label: '🌐 सेटिंग्स व हेल्पलाइन', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
                            promotions: { label: '🖼️ प्रमोशनल पोस्टर्स', color: 'bg-amber-100 text-amber-900 border-amber-200' },
                            services: { label: '⚡ जनसेवाएं', color: 'bg-purple-100 text-purple-900 border-purple-200' },
                            security: { label: '🛡️ सुरक्षा व पासवर्ड', color: 'bg-rose-100 text-rose-900 border-rose-200' },
                            students: { label: '👥 विद्यार्थी डेटा', color: 'bg-blue-100 text-blue-900 border-blue-200' }
                          }[log.category || 'settings'];

                          return (
                            <div
                              key={log.id}
                              className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3.5 group"
                            >
                              {/* Severity Icon Indicator */}
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${severityBadge.iconBg} border-black/5`}>
                                {severityBadge.icon}
                              </div>

                              {/* Content Details */}
                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Category Tag */}
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${categoryMeta.color}`}>
                                    {categoryMeta.label}
                                  </span>

                                  {/* Action Type Code */}
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                    {log.actionType}
                                  </span>

                                  {/* Severity Tag */}
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${severityBadge.bg}`}>
                                    {log.severity.toUpperCase()}
                                  </span>

                                  {/* Relative Time */}
                                  <span className="text-[11px] font-bold text-slate-500 ml-auto flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{formatRelativeTime(log.timestamp)}</span>
                                  </span>
                                </div>

                                {/* Title */}
                                <h5 className="text-sm font-black text-slate-900 leading-snug group-hover:text-rose-900 transition-colors">
                                  {log.title}
                                </h5>

                                {/* Description */}
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {log.description}
                                </p>

                                {/* Footer Metadata: Admin, Source, Timestamp, ID */}
                                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                                  <span className="font-bold text-slate-700 flex items-center gap-1">
                                    <span>👤</span>
                                    <span>{log.adminUser}</span>
                                  </span>
                                  {log.ipOrDevice && (
                                    <span className="text-slate-400 flex items-center gap-1">
                                      <span>🖥️</span>
                                      <span>{log.ipOrDevice}</span>
                                    </span>
                                  )}
                                  <span className="text-slate-400 font-mono">
                                    🕒 {new Date(log.timestamp).toLocaleString('hi-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    })}
                                  </span>
                                  <span className="text-slate-400 font-mono text-[10px] ml-auto">
                                    ID: {log.id}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
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
