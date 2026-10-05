import React, { useState } from 'react';
import { PlanDetail, MemberProfile, StudyWorkContentItem } from '../types';
import { studyWorkModules } from '../data/studyWorkData';
import { useEncryptedPlanAuth } from '../hooks/useEncryptedPlanAuth';
import { StudyResourceViewerModal } from './StudyResourceViewerModal';
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  KeyRound, 
  CheckCircle2, 
  Download, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  ShieldCheck, 
  ExternalLink,
  BookOpen,
  Briefcase,
  AlertCircle,
  Copy,
  Check,
  Crown,
  Eye,
  Loader2,
  ShieldAlert
} from 'lucide-react';

interface PlanStudyWorkPageProps {
  plan: PlanDetail;
  currentUser: MemberProfile | null;
  onBack: () => void;
  onOpenRegistration: (planId: string) => void;
  onOpenLogin: () => void;
}

export const PlanStudyWorkPage: React.FC<PlanStudyWorkPageProps> = ({
  plan,
  currentUser,
  onBack,
  onOpenRegistration,
  onOpenLogin
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [taskStatus, setTaskStatus] = useState<Record<string, boolean>>({});
  
  // Encrypted Plan Authentication Hook
  const {
    isAuthorized,
    isVerifying,
    error: authError,
    successMessage: authSuccess,
    attemptsLeft,
    isLockedOut,
    lockoutSeconds,
    validatePassword,
    lockPlan
  } = useEncryptedPlanAuth(plan.id, plan.planNumber, currentUser);

  // Modal viewer state
  const [selectedResource, setSelectedResource] = useState<StudyWorkContentItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [quickToast, setQuickToast] = useState<string | null>(null);

  const moduleData = studyWorkModules[plan.id] || studyWorkModules['plan-01'];

  const handleOpenResource = (resourceItem: StudyWorkContentItem) => {
    setSelectedResource(resourceItem);
    setIsViewerOpen(true);
    setQuickToast(`"${resourceItem.title}" अध्ययन व डाउनलोड हेतु खुल गया है!`);
    setTimeout(() => setQuickToast(null), 3000);
  };

  const handleQuickDownload = (e: React.MouseEvent, resourceItem: StudyWorkContentItem) => {
    e.stopPropagation();
    
    // Direct file download using Blob
    const content = `IOIS NATIONAL DIGITAL EDUCATION NETWORK\nPLAN 0${plan.planNumber} - ${plan.name}\nसंसाधन: ${resourceItem.title}\nश्रेणी: ${resourceItem.category}\nविवरण: ${resourceItem.description}\nअधिकृत सदस्य: ${currentUser ? currentUser.name : 'Vikas Kumar'}\nसदस्य ID: ${currentUser ? currentUser.memberId : 'IOIS999VK01'}\nतारीख: ${new Date().toLocaleDateString('hi-IN')}\nहेल्पलाइन: +91 8877490845\nhttps://ioisplatform.github.io/`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IOIS_${plan.id}_${resourceItem.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setQuickToast(`"${resourceItem.title}" फाइल डाउनलोड शुरू हो गई है!`);
    setTimeout(() => setQuickToast(null), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isVerifying || isLockedOut) {
      return;
    }

    const success = await validatePassword(passwordInput);
    if (success) {
      setPasswordInput('');
      setQuickToast(`सुरक्षा सत्यापन सफल! Plan 0${plan.planNumber} अध्ययन सामग्री अनलॉक्ड है।`);
      setTimeout(() => setQuickToast(null), 3500);
    }
  };

  const handleLockPlan = () => {
    lockPlan();
    setPasswordInput('');
    setQuickToast('योजना अध्ययन सामग्री सुरक्षित रूप से पुनः लॉक कर दी गई है।');
    setTimeout(() => setQuickToast(null), 3000);
  };

  const toggleTask = (taskId: string) => {
    setTaskStatus(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleCopyReferral = () => {
    const userRefId = currentUser ? currentUser.memberId : 'IOIS999VK01';
    const text = `IOIS Plan 0${plan.planNumber} (${plan.name}) - एक्टिवेशन ₹${plan.price} पर पाएं ${plan.payoutPercent}% तुरंत पेआउट! जुड़ें: https://ioisplatform.github.io/?ref=${userRefId}&plan=${plan.id}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Notification */}
      {quickToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 font-bold text-xs sm:text-sm animate-in fade-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{quickToast}</span>
        </div>
      )}

      {/* Study Resource Viewer Modal */}
      <StudyResourceViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        resource={selectedResource}
        plan={plan}
        currentUser={currentUser}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← सभी प्लान्स पर वापस जाएं</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">
              PLAN 0{plan.planNumber} • {plan.name}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {plan.payoutPercent}% पेआउट (₹{plan.incentive}/रेफरल)
            </span>

            {isAuthorized && (
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>प्रमाणीकृत सुरक्षित सत्र</span>
                </span>
                <button
                  onClick={handleLockPlan}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/40 text-xs font-bold transition-colors"
                  title="सुरक्षित लॉक करें"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>लॉक करें</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ENCRYPTED SECURITY GATE: Requires plan-specific password check before rendering study content */}
        {!isAuthorized ? (
          <div className="max-w-xl mx-auto bg-slate-800/95 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
            
            {/* Security Icon & Badge */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-md animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 border border-orange-400 text-white flex items-center justify-center shadow-xl">
                <Lock className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>SHA-256 एन्क्रिप्टेड सुरक्षा गेटवे</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                सुरक्षित अध्ययन व कार्य पोर्टल
              </h2>
              <div className="text-sm font-bold text-amber-400">
                PLAN 0{plan.planNumber}: {plan.name}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                अनधिकृत उपयोगकर्ताओं से सामग्री की सुरक्षा हेतु, इस प्लान का अध्ययन मटेरियल, नोट्स और वर्क असाइनमेंट्स केवल अधिकृत सुरक्षा पासवर्ड सत्यापन के बाद ही रेंडर होंगे। कृपया अपना पासवर्ड दर्ज करें।
              </p>
            </div>

            {/* Lockout Notice if locked out */}
            {isLockedOut && (
              <div className="p-3.5 rounded-2xl bg-red-950/80 border-2 border-red-500 text-red-200 text-xs flex items-start gap-2 text-left animate-in shake duration-300">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-red-300">सुरक्षा प्रतिबंध सक्रिय (Security Lockout)</strong>
                  <span>अधिकतम गलत प्रयासों के कारण यह गेटवे अस्थायी रूप से लॉक है। कृपया {lockoutSeconds} सेकंड प्रतीक्षा करें।</span>
                </div>
              </div>
            )}

            {/* Password Entry Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1 text-left">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    प्लान सुरक्षा पासवर्ड दर्ज करें:
                  </label>
                  {!isLockedOut && (
                    <span className="text-[10px] font-mono text-slate-400">
                      शेष प्रयास: <strong className="text-amber-400">{attemptsLeft}</strong>/5
                    </span>
                  )}
                </div>

                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="प्लान सुरक्षा पासवर्ड दर्ज करें"
                    value={passwordInput}
                    disabled={isVerifying || isLockedOut}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-20 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[11px] font-bold text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? 'छिपाएं' : 'दिखाएं'}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || isLockedOut || !passwordInput.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>क्रिप्टोग्राफिक टोकन सत्यापित हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>पासवर्ड सत्यापित करें व अध्ययन सामग्री खोलें</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">यदि आपके पास अधिकृत पासवर्ड नहीं है?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenRegistration(plan.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors"
                >
                  प्लान सक्रिय करें @ ₹{plan.price}
                </button>
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition-colors"
                >
                  सदस्य लॉगिन
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* UNLOCKED FULL STUDY & WORK HUB */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Hero for this plan */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              plan.isSupreme 
                ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border-amber-500/50' 
                : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md text-xs font-black bg-slate-950 text-white font-mono">
                      PLAN 0{plan.planNumber}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950">
                      ✓ UNLOCKED & ACTIVE
                    </span>
                    {plan.isSupreme && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" /> SUPREME MASTER ALL-IN-ONE
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {plan.name}: सम्पूर्ण अध्ययन एवं कार्य पोर्टल
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                    {moduleData.overviewHindi}
                  </p>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-700 text-center shrink-0 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    आपकी प्रति रेफरल आय:
                  </span>
                  <div className="text-3xl font-black text-emerald-400 font-mono">
                    ₹{plan.incentive}
                  </div>
                  <span className="text-[11px] text-emerald-300 font-bold block">
                    ({plan.payoutPercent}% डायरेक्ट पेआउट)
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1: Study Resources Library */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                    <span>1. डिजिटल अध्ययन सामग्री व टूल्स (Study Resources)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    इस प्लान में उपलब्ध सभी अधिकृत ई-बुक्स, टेम्प्लेट्स, और टूल्स सीधे डाउनलोड व उपयोग करें।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleData.primaryResources.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-orange-400 border border-orange-500/30">
                          {item.category}
                        </span>
                        {item.fileSize && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.fileSize}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm sm:text-base text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenResource(item)}
                        className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{item.actionLabel}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickDownload(e, item)}
                        title="सीधे डिवाइस में फाइल डाउनलोड करें"
                        className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1 border border-slate-600"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">डाउनलोड</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Work & Action Assignments (Earn 50%-70%) */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <span>2. दैनिक कार्य व आमदनी असाइनमेंट्स (Daily Work Tasks)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  इन व्यावहारिक कार्यों को पूरा करके अपनी डिजिटल टीम बनाएं और दैनिक इंसेंटिव हासिल करें।
                </p>
              </div>

              <div className="space-y-3">
                {moduleData.workTasks.map((task) => {
                  const isDone = taskStatus[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-200'
                          : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isDone ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 border border-slate-600'
                        }`}>
                          {isDone ? <Check className="w-4 h-4" /> : null}
                        </div>
                        <div>
                          <h4 className={`font-bold text-xs sm:text-sm ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {task.instruction}
                          </p>
                        </div>
                      </div>

                      {task.incentiveBonus && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                          {task.incentiveBonus}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Referral Machine for this plan */}
            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-orange-400" />
                    <span>इस प्लान का अपना रेफरल लिंक साझा करें</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    जब कोई इस लिंक से जुड़ेगा, आपको सीधे ₹{plan.incentive} प्रति सदस्य तुरंत प्राप्त होगा।
                  </p>
                </div>

                <button
                  onClick={handleCopyReferral}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'रेफरल लिंक कॉपी करें'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 break-all">
                https://ioisplatform.github.io/?ref={currentUser ? currentUser.memberId : 'IOIS999VK01'}&plan={plan.id}
              </div>
            </div>

            {/* Community Notice */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-3">
              <span>{moduleData.communityNotice}</span>
              <a
                href="https://wa.me/918877490845"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:underline flex items-center gap-1 shrink-0"
              >
                <span>WhatsApp सहायता</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
