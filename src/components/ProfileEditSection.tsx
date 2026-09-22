import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { PLANS } from '../data/plansData';
import { updateUserProfile, sanitizeUpiId } from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { 
  User, 
  Lock, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Image as ImageIcon,
  Check,
  Award,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';

interface ProfileEditSectionProps {
  user: UserProfile;
  onUserUpdated: (updated: UserProfile) => void;
  isInitiallyEditing?: boolean;
}

// 6 High-Quality Professional Preset Avatars
const PRESET_AVATARS = [
  {
    label: 'प्रोफेशनल 1 (पुरुष)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'प्रोफेशनल 2 (महिला)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'युवा लीडर',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'डिजिटल ट्रेनर',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'एग्जीक्यूटिव 1',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'विद्यार्थी एंबेसडर',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80',
  },
];

// Quick Role Suggestions
const QUICK_ROLES = [
  'Supreme Master Partner',
  'Authorized Center Incharge',
  'Official State Reseller',
  'Verified Elite Member',
  'Senior Digital Trainer',
  'Student Ambassador',
  'Active Digital Learner',
];

export const ProfileEditSection: React.FC<ProfileEditSectionProps> = ({
  user,
  onUserUpdated,
  isInitiallyEditing = false,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(isInitiallyEditing);
  
  // Editable State Fields
  const [fullName, setFullName] = useState<string>(user.fullName || '');
  const [mobileNumber, setMobileNumber] = useState<string>(user.mobileNumber || '');
  const [email, setEmail] = useState<string>(user.email || '');
  const [address, setAddress] = useState<string>(user.address || '');
  const [emergencyContact, setEmergencyContact] = useState<string>(user.emergencyContact || '');
  const [payoutUpi, setPayoutUpi] = useState<string>(user.payoutUpi || '');
  const [sponsorId, setSponsorId] = useState<string>(user.sponsorId || 'IOIS999VK01');
  const [selectedPlanId, setSelectedPlanId] = useState<number>(user.selectedPlanId || 1);
  const [role, setRole] = useState<string>(user.role || 'Verified Elite Member');
  const [password, setPassword] = useState<string>(user.password || '');
  const [photoUrl, setPhotoUrl] = useState<string>(user.photoUrl || '');
  const [googleDrivePhotoLink, setGoogleDrivePhotoLink] = useState<string>(user.googleDrivePhotoLink || '');

  // Payment Verification Updates
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string>(user.paymentScreenshotUrl || '');
  const [googleDrivePaymentLink, setGoogleDrivePaymentLink] = useState<string>(user.googleDrivePaymentLink || '');
  const [paymentUtr, setPaymentUtr] = useState<string>(user.paymentUtr || '');

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPaymentFields, setShowPaymentFields] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync if prop user changes
  useEffect(() => {
    setFullName(user.fullName || '');
    setMobileNumber(user.mobileNumber || '');
    setEmail(user.email || '');
    setAddress(user.address || '');
    setEmergencyContact(user.emergencyContact || '');
    setPayoutUpi(user.payoutUpi || '');
    setSponsorId(user.sponsorId || 'IOIS999VK01');
    setSelectedPlanId(user.selectedPlanId || 1);
    setRole(user.role || 'Verified Elite Member');
    setPassword(user.password || '');
    setPhotoUrl(user.photoUrl || '');
    setGoogleDrivePhotoLink(user.googleDrivePhotoLink || '');
    setPaymentScreenshotUrl(user.paymentScreenshotUrl || '');
    setGoogleDrivePaymentLink(user.googleDrivePaymentLink || '');
    setPaymentUtr(user.paymentUtr || '');
  }, [user]);

  const currentPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];

  const handleCancel = () => {
    // Reset to user values
    setFullName(user.fullName || '');
    setMobileNumber(user.mobileNumber || '');
    setEmail(user.email || '');
    setAddress(user.address || '');
    setEmergencyContact(user.emergencyContact || '');
    setPayoutUpi(user.payoutUpi || '');
    setSponsorId(user.sponsorId || 'IOIS999VK01');
    setSelectedPlanId(user.selectedPlanId || 1);
    setRole(user.role || 'Verified Elite Member');
    setPassword(user.password || '');
    setPhotoUrl(user.photoUrl || '');
    setGoogleDrivePhotoLink(user.googleDrivePhotoLink || '');
    setPaymentScreenshotUrl(user.paymentScreenshotUrl || '');
    setGoogleDrivePaymentLink(user.googleDrivePaymentLink || '');
    setPaymentUtr(user.paymentUtr || '');
    setErrorMsg('');
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveSuccessMsg('');

    // Form Validations
    if (!fullName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }

    const cleanMobileDigits = mobileNumber.replace(/\D/g, '');
    if (cleanMobileDigits.length < 10) {
      setErrorMsg('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('कृपया वैध ईमेल आईडी दर्ज करें।');
      return;
    }

    setIsSaving(true);

    try {
      const sanitizedUpi = sanitizeUpiId(payoutUpi);
      
      const updated: UserProfile = {
        ...user,
        userId: user.userId, // Immutable
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        address: address.trim(),
        emergencyContact: emergencyContact.trim() || undefined,
        payoutUpi: sanitizedUpi,
        sponsorId: sponsorId.trim().toUpperCase() || 'IOIS999VK01',
        selectedPlanId,
        role: role.trim() || 'Verified Elite Member',
        password: password.trim(),
        photoUrl: photoUrl || user.photoUrl,
        googleDrivePhotoLink: googleDrivePhotoLink.trim() || undefined,
        paymentScreenshotUrl: paymentScreenshotUrl || user.paymentScreenshotUrl,
        googleDrivePaymentLink: googleDrivePaymentLink.trim() || user.googleDrivePaymentLink,
        paymentUtr: paymentUtr.trim() || user.paymentUtr,
      };

      const saved = updateUserProfile(updated);
      onUserUpdated(saved);
      setIsEditing(false);
      setSaveSuccessMsg('आपकी प्रोफाइल व संपूर्ण विवरण बिना किसी त्रुटि के सफलतापूर्वक सुरक्षित कर दिया गया है!');
      setTimeout(() => setSaveSuccessMsg(''), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'प्रोफाइल अपडेट करते समय समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 text-xs animate-fadeIn">
      {/* Header & Edit Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm sm:text-base font-black text-white">
              सदस्य प्रोफाइल संपादन (Member Profile Studio)
            </h4>
          </div>
          <p className="text-[11px] text-slate-400">
            आप अपनी <strong className="text-amber-300">User ID</strong> के अलावा अपनी सभी जानकारी (नाम, मोबाइल, ईमेल, फोटो, पासवर्ड, प्लान, पद, UPI, स्पॉन्सर, पता आदि) कभी भी बदल सकते हैं।
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              handleCancel();
            } else {
              setIsEditing(true);
            }
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black border transition cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0 ${
            isEditing
              ? 'bg-slate-850 text-slate-300 border-slate-700 hover:bg-slate-800'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-400 hover:scale-[1.02]'
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>संपादन रद्द करें (Cancel)</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>डिटेल्स एडिट करें (Edit Profile)</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/60 rounded-2xl text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 bg-red-950/90 border border-red-500/60 rounded-2xl text-red-200 text-xs flex items-center gap-2.5 shadow-lg animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* SECTION 1: PERMANENT USER ID (IMMUTABLE & CLEARLY HIGHLIGHTED) */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                आधिकारिक स्थायी पहचान पत्र
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> NON-EDITABLE
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-wider">
              {user.userId}
            </div>
            <p className="text-[11px] text-slate-300">
              यह कोड सिस्टम डेटाबेस व सुरक्षा रिकॉर्ड में स्थायी है। इसके अलावा बाकी सभी विवरण आप नीचे बदल सकते हैं।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-semibold">
              सक्रिय स्थिति: <strong className="text-emerald-400 uppercase">{user.paymentStatus}</strong>
            </span>
          </div>
        </div>

        {/* SECTION 2: PHOTO & AVATAR EDITING */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-slate-200 font-black flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>प्रोफाइल फोटो (Profile Photo & Avatars)</span>
            </label>
            <span className="text-[10px] text-slate-400">
              {isEditing ? 'नया फोटो चुनें या 1-क्लिक अवतार सेट करें' : 'सक्रिय फोटो'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Current Photo Preview */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 shrink-0 shadow-md relative">
              <img 
                src={photoUrl || user.photoUrl} 
                alt={fullName} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="flex-1 space-y-2 w-full">
              {isEditing ? (
                <>
                  <SmartFileUpload
                    label="कंप्यूटर / फोन से नया फोटो अपलोड करें"
                    sublabel="गैलरी से चुनें या कैमरा से सीधे फोटो लें"
                    fileValue={photoUrl}
                    driveLinkValue={googleDrivePhotoLink}
                    onFileChange={setPhotoUrl}
                    onDriveLinkChange={setGoogleDrivePhotoLink}
                  />

                  {/* 1-Click Avatar Selection */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                      या 1-क्लिक में कोई आधिकारिक अवतार चुनें:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPhotoUrl(av.url)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition cursor-pointer hover:scale-110 ${
                            photoUrl === av.url ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105' : 'border-slate-700 opacity-80 hover:opacity-100'
                          }`}
                          title={av.label}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-slate-400 text-xs">
                  फोटो बदलने के लिए ऊपर दिए गए <strong className="text-amber-300">"डिटेल्स एडिट करें"</strong> बटन पर क्लिक करें।
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: PERSONAL INFORMATION GRID */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <h5 className="font-black text-white flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>व्यक्तिगत विवरण (Personal Details)</span>
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                पूरा नाम (Full Name) <span className="text-red-400">*</span>:
              </label>
              <input
                type="text"
                disabled={!isEditing}
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="जैसे: राहुल कुमार"
                className={`w-full bg-slate-900 border text-white rounded-xl px-3 py-2.5 outline-none transition ${
                  isEditing 
                    ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400' 
                    : 'border-slate-800 opacity-80 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Mobile / WhatsApp Number */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                <span>मोबाइल / WhatsApp <span className="text-red-400">*</span>:</span>
                <span className="text-[10px] text-slate-400 font-normal">10 अंक</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  disabled={!isEditing}
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="9876543210"
                  className={`w-full bg-slate-900 border text-white rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono transition ${
                    isEditing 
                      ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400' 
                      : 'border-slate-800 opacity-80 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                ईमेल आईडी (Email) <span className="text-red-400">*</span>:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  disabled={!isEditing}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-slate-900 border text-white rounded-xl pl-9 pr-3 py-2.5 outline-none transition ${
                    isEditing 
                      ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400' 
                      : 'border-slate-800 opacity-80 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Alternate / Emergency Contact */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                वैकल्पिक / आपातकालीन नंबर (Alternate Mobile):
              </label>
              <input
                type="tel"
                disabled={!isEditing}
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="उदा. 9523218765 (वैकल्पिक)"
                className={`w-full bg-slate-900 border text-white rounded-xl px-3 py-2.5 outline-none font-mono transition ${
                  isEditing 
                    ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400' 
                    : 'border-slate-800 opacity-80 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Address / City / State */}
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>शहर, जिला व राज्य (Address / Location):</span>
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="उदा. पटना, बिहार - 800001"
                className={`w-full bg-slate-900 border text-white rounded-xl px-3 py-2.5 outline-none transition ${
                  isEditing 
                    ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400' 
                    : 'border-slate-800 opacity-80 cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SECURITY & PASSWORD (EASY VIEW & CHANGE) */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-black text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>पासवर्ड व सुरक्षा (Password & Access PIN)</span>
            </h5>
            <span className="text-[10px] text-slate-400">सीधे यहीं से नया पासवर्ड सेट कर सकते हैं</span>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              लॉगिन पासवर्ड (Password):
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                disabled={!isEditing}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="नया पासवर्ड दर्ज करें"
                className={`w-full bg-slate-900 border text-white rounded-xl pl-3 pr-10 py-2.5 outline-none font-mono transition ${
                  isEditing 
                    ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400' 
                    : 'border-slate-800 opacity-80 cursor-not-allowed'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer transition"
                title={showPassword ? 'पासवर्ड छुपाएं' : 'पासवर्ड देखें'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
            {isEditing && (
              <p className="text-[10px] text-slate-400 mt-1">
                पासवर्ड कम से कम 4 अक्षरों का रखें। आप जो भी पासवर्ड यहाँ लिखेंगे, उसी से अगली बार लॉगिन होगा।
              </p>
            )}
          </div>
        </div>

        {/* SECTION 5: PLAN SELECTION & ROLE / DESIGNATION (FULL FREEDOM) */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-black text-white flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>IOIS प्लान व पदवी (Active Plan & Role Designation)</span>
            </h5>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {currentPlan.percentage}% इंसेंटिव
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Plan Selector */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                सक्रिय प्लान (IOIS Plan):
              </label>
              <select
                disabled={!isEditing}
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                className={`w-full bg-slate-900 border text-white rounded-xl px-3 py-2.5 outline-none transition cursor-pointer font-bold ${
                  isEditing 
                    ? 'border-amber-500/70 focus:border-amber-400 text-amber-300' 
                    : 'border-slate-800 opacity-80 cursor-not-allowed text-white'
                }`}
              >
                {PLANS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.code} - {p.name} (₹{p.price}) • {p.percentage}% पेआउट (₹{p.instantPayout})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                प्लान बदलने पर डिजिटल ID कार्ड और इंसेंटिव स्लैब तुरंत उसी अनुसार अपडेट हो जाएगा।
              </p>
            </div>

            {/* Role / Designation */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                सदस्यता पद / भूमिका (Member Role / Title):
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="उदा. Supreme Master Partner"
                className={`w-full bg-slate-900 border text-white rounded-xl px-3 py-2.5 outline-none font-bold transition ${
                  isEditing 
                    ? 'border-amber-500/70 focus:border-amber-400 text-amber-300' 
                    : 'border-slate-800 opacity-80 cursor-not-allowed'
                }`}
              />

              {/* Quick Role Suggestions when editing */}
              {isEditing && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">सुझाव:</span>
                  {QUICK_ROLES.slice(0, 4).map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`text-[9px] px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                        role === r
                          ? 'bg-amber-400 text-slate-950 font-black border-amber-400'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400/60'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 6: PAYOUT UPI & SPONSOR ID (EDITABLE WITH LIVE ASSIST) */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <h5 className="font-black text-white flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>पेआउट UPI व स्पॉन्सर रेफरल कोड (Payout & Referral Setup)</span>
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Payout UPI ID */}
            <div>
              <label className="block text-amber-300 font-bold mb-1 flex items-center justify-between">
                <span>पेआउट प्राप्ति UPI ID (PhonePe/GPay):</span>
                <span className="text-[10px] text-emerald-400 font-bold">सीधा बैंक ट्रांसफर</span>
              </label>
              <input
                type="text"
                disabled={!isEditing}
                maxLength={50}
                value={payoutUpi}
                onChange={(e) => setPayoutUpi(e.target.value.replace(/\s+/g, '').slice(0, 50))}
                placeholder="उदा. 8877490845@spicepay या name@okhdfcbank"
                className={`w-full bg-slate-900 border text-amber-300 rounded-xl px-3 py-2.5 outline-none font-mono font-bold transition ${
                  isEditing 
                    ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400' 
                    : 'border-slate-800 opacity-80 cursor-not-allowed'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                आपके सभी रेफरल इंसेंटिव (50% से 70%) बिना किसी देरी के इसी UPI ID पर भेजे जाते हैं।
              </p>
            </div>

            {/* Sponsor ID */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                <span>स्पॉन्सर / गाइड ID (Sponsor Code):</span>
                <span className="text-[10px] text-amber-400 font-bold">परिवर्तन योग्य</span>
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={sponsorId}
                onChange={(e) => setSponsorId(e.target.value.trim().toUpperCase())}
                placeholder="उदा. IOIS999VK01"
                className={`w-full bg-slate-900 border text-white rounded-xl px-3 py-2.5 outline-none font-mono font-bold transition ${
                  isEditing 
                    ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400' 
                    : 'border-slate-800 opacity-80 cursor-not-allowed'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                यदि रजिस्ट्रेशन के समय स्पॉन्सर कोड गलत दर्ज हो गया था, तो आप इसे यहाँ सही कर सकते हैं।
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 7: OPTIONAL PAYMENT PROOF UPDATE */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold">
              पेमेंट सत्यापन रसीद व UTR नंबर (Payment Proof & UTR):
            </span>
            <button
              type="button"
              onClick={() => setShowPaymentFields(!showPaymentFields)}
              className="text-amber-400 hover:text-amber-300 text-[11px] font-bold underline cursor-pointer"
            >
              {showPaymentFields ? 'छुपाएं (Hide)' : 'रसीद व UTR अपडेट करें (Update Proof)'}
            </button>
          </div>

          {showPaymentFields && (
            <div className="space-y-3 pt-2 border-t border-slate-800 animate-fadeIn">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  12-अंकों का UTR / ट्रांजैक्शन नंबर:
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value.trim())}
                  placeholder="उदा. 4239XXXXXXXX"
                  className={`w-full bg-slate-900 border text-white rounded-xl px-3 py-2 outline-none font-mono ${
                    isEditing ? 'border-amber-500/70' : 'border-slate-800 opacity-80'
                  }`}
                />
              </div>

              {isEditing && (
                <SmartFileUpload
                  label="नया पेमेंट स्क्रीनशॉट अपलोड करें"
                  sublabel="यदि आपने नया पेमेंट किया है तो उसकी रसीद यहाँ संलग्न करें"
                  fileValue={paymentScreenshotUrl}
                  driveLinkValue={googleDrivePaymentLink}
                  onFileChange={setPaymentScreenshotUrl}
                  onDriveLinkChange={setGoogleDrivePaymentLink}
                />
              )}
            </div>
          )}
        </div>

        {/* SECTION 8: BOTTOM ACTION BAR */}
        {isEditing && (
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-amber-300 font-bold text-center sm:text-left">
              🔒 सुरक्षित सत्यापन: सभी परिवर्तन तत्काल आपके खाते और डिजिटल ID पर लागू होंगे।
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>सेव हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>परिवर्तन सुरक्षित करें (Save Profile)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};
