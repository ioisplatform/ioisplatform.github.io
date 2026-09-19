import React, { useState, useRef } from 'react';
import { UserProfile, HelpTicket } from '../types';
import { PLANS, OFFICIAL_PHONE, OFFICIAL_EMAIL } from '../data/plansData';
import { updateUserProfile, createHelpTicket, getHelpTickets } from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { 
  User, 
  CreditCard, 
  ShieldCheck, 
  Edit3, 
  Save, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Lock, 
  LogOut, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Share2, 
  QrCode, 
  Calendar, 
  Award,
  ExternalLink,
  Shield,
  Zap,
  Printer
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUserUpdated: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenLogin?: () => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onLogout,
  onOpenLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'idcard' | 'earnings' | 'support'>('profile');
  
  // Profile Form States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>(user?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState<string>(user?.mobileNumber || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [address, setAddress] = useState<string>(user?.address || '');
  const [payoutUpi, setPayoutUpi] = useState<string>(user?.payoutUpi || '');
  const [sponsorId, setSponsorId] = useState<string>(user?.sponsorId || 'IOIS999VK01');
  const [selectedPlanId, setSelectedPlanId] = useState<number>(user?.selectedPlanId || 1);
  const [role, setRole] = useState<string>(user?.role || 'Verified Elite Member');
  const [password, setPassword] = useState<string>(user?.password || '');
  const [photoUrl, setPhotoUrl] = useState<string>(user?.photoUrl || '');
  const [googleDrivePhotoLink, setGoogleDrivePhotoLink] = useState<string>(user?.googleDrivePhotoLink || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Referral link copy state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedUserId, setCopiedUserId] = useState<boolean>(false);

  // Support Ticket Form States
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDesc, setTicketDesc] = useState<string>('');
  const [ticketAttachment, setTicketAttachment] = useState<string>('');
  const [ticketSuccess, setTicketSuccess] = useState<string>('');
  const [myTickets, setMyTickets] = useState<HelpTicket[]>(() => {
    return user ? getHelpTickets().filter((t) => t.userId === user.userId) : [];
  });

  // ID Card Ref for download
  const idCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Synchronize when user changes
  React.useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setMobileNumber(user.mobileNumber);
      setEmail(user.email);
      setAddress(user.address || '');
      setPayoutUpi(user.payoutUpi || '');
      setSponsorId(user.sponsorId || 'IOIS999VK01');
      setSelectedPlanId(user.selectedPlanId);
      setRole(user.role);
      setPassword(user.password || '');
      setPhotoUrl(user.photoUrl);
      setGoogleDrivePhotoLink(user.googleDrivePhotoLink || '');
      setMyTickets(getHelpTickets().filter((t) => t.userId === user.userId));
    }
  }, [user]);

  if (!isOpen) return null;

  // Not logged in fallback
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(245,158,11,0.25)] relative text-white text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer transition"
          >
            ✕
          </button>
          
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-400">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">सदस्य लॉगिन आवश्यक है</h3>
            <p className="text-xs text-slate-300">
              अपना डैशबोर्ड, डिजिटल ID कार्ड और कमाई का विवरण देखने के लिए कृपया पहले लॉगिन करें।
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin?.();
              }}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase transition cursor-pointer shadow-md"
            >
              लॉगिन विंडो खोलें →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedPlan = PLANS.find((p) => p.id === user.selectedPlanId) || PLANS[0];
  const referralUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?ref=${user.userId}`
    : `https://iois.org.in/?ref=${user.userId}`;

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.userId);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      payoutUpi: payoutUpi.trim(),
      sponsorId: sponsorId.trim().toUpperCase() || user.sponsorId,
      selectedPlanId,
      role,
      password: password.trim(),
      photoUrl,
      googleDrivePhotoLink: googleDrivePhotoLink.trim() || undefined,
    };

    const saved = updateUserProfile(updated);
    onUserUpdated(saved);
    setIsEditing(false);
    setSaveSuccessMsg('आपकी प्रोफाइल व विवरण सफलतापूर्वक सुरक्षित कर दिया गया है!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

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
    });

    setTicketSubject('');
    setTicketDesc('');
    setTicketAttachment('');
    setTicketSuccess('आपकी शिकायत / प्रश्न आधिकारिक टीम तक पहुँच गया है! हम जल्द ही संपर्क करेंगे।');
    setMyTickets(getHelpTickets().filter((t) => t.userId === user.userId));
    setTimeout(() => setTicketSuccess(''), 5000);
  };

  const handleDownloadIdCardPng = async () => {
    if (!idCardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(idCardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#020617',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `IOIS_Digital_ID_${user.userId}.png`;
      link.href = dataUrl;
      link.click();
      setIsDownloading(false);
    } catch {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-4xl rounded-3xl p-5 sm:p-7 shadow-[0_25px_70px_rgba(245,158,11,0.25)] relative text-white my-6 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition z-10"
          title="डैशबोर्ड बंद करें"
        >
          ✕
        </button>

        {/* Top Header: Member Banner */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 shrink-0 shadow-md">
              <img src={user.photoUrl} alt={user.fullName} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white">{user.fullName}</h3>
                {user.paymentStatus === 'approved' ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>VERIFIED MEMBER</span>
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>UNDER REVIEW</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                {/* Copyable User ID */}
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="font-mono text-amber-300 font-bold bg-slate-900 hover:bg-slate-850 px-2 py-0.5 rounded-lg border border-amber-500/40 flex items-center gap-1 cursor-pointer transition"
                  title="क्लिक करके User ID कॉपी करें"
                >
                  <span>ID: {user.userId}</span>
                  {copiedUserId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                </button>

                <span className="text-slate-400">•</span>
                <span className="font-semibold text-white">{selectedPlan.name} (₹{selectedPlan.price})</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-400 font-bold">70% Payout</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate">1. मेरी प्रोफाइल</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('idcard')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'idcard'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="truncate">2. डिजिटल ID</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('earnings')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'earnings'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="truncate">3. 70% कमाई</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'support'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="truncate">4. हेल्पडेस्क</span>
          </button>
        </div>

        {/* Feedback Notices */}
        {saveSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: PROFILE & SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                <span>सदस्य प्रोफाइल विवरण (Profile & Settings)</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                  isEditing
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'संपादन रद्द करें' : 'प्रोफाइल एडिट करें'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">पूरा नाम:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 disabled:opacity-75 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">मोबाइल नंबर:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 disabled:opacity-75 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">ईमेल आईडी:</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 disabled:opacity-75 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Payout UPI ID */}
                <div>
                  <label className="block text-amber-300 font-bold mb-1">पेआउट UPI ID (इंसेंटिव प्राप्ति हेतु):</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={payoutUpi}
                    onChange={(e) => setPayoutUpi(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/60 disabled:opacity-75 focus:border-amber-400 text-amber-300 rounded-xl px-3 py-2 outline-none font-mono font-bold"
                  />
                </div>

                {/* Sponsor ID */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">स्पॉन्सर ID:</label>
                  <input
                    type="text"
                    disabled
                    value={sponsorId}
                    className="w-full bg-slate-950 border border-slate-800 opacity-60 text-slate-400 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>

                {/* City & State */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">शहर व राज्य:</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 disabled:opacity-75 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-2">
                  <SmartFileUpload
                    label="प्रोफाइल फोटो अपडेट करें"
                    sublabel="नया फोटो चुनें या ड्राइव लिंक दर्ज करें"
                    fileValue={photoUrl}
                    driveLinkValue={googleDrivePhotoLink}
                    onFileChange={setPhotoUrl}
                    onDriveLinkChange={setGoogleDrivePhotoLink}
                  />

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>परिवर्तन सुरक्षित करें</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DIGITAL ID CARD VIEW & DOWNLOAD */}
        {/* ========================================================= */}
        {activeTab === 'idcard' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>स्मार्ट डिजिटल ID कार्ड (Front & Back Preview)</span>
              </h4>
              
              <button
                type="button"
                onClick={handleDownloadIdCardPng}
                disabled={isDownloading}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'डाउनलोड हो रहा है...' : 'HD ID कार्ड डाउनलोड'}</span>
              </button>
            </div>

            {/* Live Renderable ID Card Section */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-center">
              <div 
                ref={idCardRef}
                className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B1329] to-slate-950 border-2 border-amber-400/80 p-4 shadow-2xl relative overflow-hidden text-white space-y-3"
              >
                {/* Gold Ribbon Header */}
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-black text-[9px] text-amber-400">
                        IOIS
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black tiranga-text block leading-tight">IOIS PLATFORM</span>
                      <span className="text-[7px] text-amber-300 uppercase tracking-widest block">Digital Identity Card</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black">
                    VERIFIED
                  </span>
                </div>

                {/* Photo & Member Details */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-400 shrink-0 bg-slate-800 shadow-md">
                    <img src={user.photoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h5 className="text-sm font-black text-white truncate">{user.fullName}</h5>
                    <div className="text-[10px] text-amber-300 font-mono font-bold">ID: {user.userId}</div>
                    <div className="text-[9px] text-slate-300">{user.role}</div>
                    <div className="text-[9px] text-emerald-400 font-semibold">{selectedPlan.name} • ₹{selectedPlan.price}</div>
                  </div>
                </div>

                {/* QR & Security Info */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[8px] text-slate-400">
                  <div className="space-y-0.5">
                    <div>सत्यापित मोबाइल: {user.mobileNumber.slice(0, 4)}XXXX{user.mobileNumber.slice(-2)}</div>
                    <div>स्पॉन्सर कोड: {user.sponsorId || 'IOIS999VK01'}</div>
                    <div className="text-amber-400 font-mono">256-BIT ENCRYPTED</div>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg p-0.5 flex items-center justify-center shrink-0">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Fiois.org.in%2Fverify%3Fid%3D${user.userId}`} 
                      alt="ID QR" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: 70% EARNINGS & REFERRAL LINK */}
        {/* ========================================================= */}
        {activeTab === 'earnings' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>70% डायरेक्ट इंसेंटिव व स्पॉन्सर सिस्टम</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                तत्काल बैंक/UPI ट्रांसफर
              </span>
            </div>

            {/* Sponsor Referral Link Box */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">
                आपकी आधिकारिक स्पॉन्सर रेफरल लिंक (Share to Earn):
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-amber-300 truncate">
                  {referralUrl}
                </div>
                <button
                  type="button"
                  onClick={handleCopyReferralLink}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer shadow-md"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'कॉपी हुआ!' : 'लिंक कॉपी करें'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                इस लिंक से जुड़ने वाले प्रत्येक सदस्य पर आपको उनके प्लान का सीधा 70% इंसेंटिव आपके UPI ID (<strong className="text-amber-300">{user.payoutUpi || 'सेट नहीं'}</strong>) पर ट्रांसफर किया जाता है।
              </p>
            </div>

            {/* Plan-wise Payout Quick Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">प्रति रेफरल संभावित आय तालिका (70% Calculation):</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLANS.map((p) => (
                  <div key={p.id} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">{p.code} (₹{p.price})</span>
                    <div className="text-sm font-black text-emerald-400 font-mono">₹{p.instantPayout}</div>
                    <span className="text-[9px] text-amber-400 font-bold block">70% इंसेंटिव</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: HELPDESK & SUPPORT */}
        {/* ========================================================= */}
        {activeTab === 'support' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>हेल्पडेस्क व सपोर्ट टिकट (Help & Support)</span>
              </h4>
              <span className="text-[10px] text-slate-400">सपोर्ट: {OFFICIAL_PHONE}</span>
            </div>

            {ticketSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{ticketSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-slate-300 font-bold mb-1">विषय (Subject):</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="जैसे: पेआउट या आईडी कार्ड संबंधी प्रश्न"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">विस्तृत संदेश (Message):</label>
                <textarea
                  required
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="कृपया अपनी समस्या या प्रश्न का विवरण यहाँ लिखें..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>टिकट सबमिट करें</span>
                </button>
              </div>
            </form>

            {/* List of Previous Tickets */}
            {myTickets.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-300 block">आपके द्वारा दर्ज टिकट:</span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {myTickets.map((t) => (
                    <div key={t.ticketId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{t.subject}</div>
                        <div className="text-[10px] text-slate-400">{t.description}</div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
