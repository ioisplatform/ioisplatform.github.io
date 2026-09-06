import React, { useState } from 'react';
import { UserProfile } from '../types';
import { PLANS, OFFICIAL_PHONE, OFFICIAL_UPI_ID, OFFICIAL_PAYEE_NAME } from '../data/plansData';
import { registerNewUserAsync } from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  ArrowRight,
  Info,
  Phone,
  Mail,
  User,
  CreditCard,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface RegistrationPortalProps {
  onRegisterSuccess: (user: UserProfile) => void;
  onOpenLogin: () => void;
  preSelectedPlanId?: number;
}

export const RegistrationPortal: React.FC<RegistrationPortalProps> = ({
  onRegisterSuccess,
  onOpenLogin,
  preSelectedPlanId = 1,
}) => {
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<number>(preSelectedPlanId);
  const [role, setRole] = useState<string>('Verified Elite Member');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  React.useEffect(() => {
    if (preSelectedPlanId) {
      setSelectedPlanId(preSelectedPlanId);
    }
  }, [preSelectedPlanId]);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [payoutUpi, setPayoutUpi] = useState<string>('');
  const [sponsorId, setSponsorId] = useState<string>('IOIS999VK01');
  const [paymentUtr, setPaymentUtr] = useState<string>('');

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('sponsor') || params.get('sponsorId');
      if (ref) setSponsorId(ref.toUpperCase());
    } catch {
      // ignore
    }
  }, []);

  // Photos & Screenshots
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
  const [googleDrivePhotoLink, setGoogleDrivePhotoLink] = useState<string>('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string>('');
  const [googleDrivePaymentLink, setGoogleDrivePaymentLink] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम (Full Name) दर्ज करें।');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('कृपया कम से कम 4 अक्षरों का सुरक्षित पासवर्ड बनाएं।');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('पासवर्ड और कन्फर्म पासवर्ड मैच नहीं हो रहे हैं।');
      return;
    }
    if (!sponsorId.trim()) {
      setErrorMsg('कृपया Sponsor ID (स्पॉन्सर आईडी) अवश्य भरें। यदि आपके पास स्पॉन्सर आईडी नहीं है तो IOIS999VK01 दर्ज करें।');
      return;
    }
    if (!payoutUpi.trim()) {
      setErrorMsg('कृपया अपना Payment Received Address / UPI ID सही-सही भरें जहाँ आप अपनी कमाई व 70% पेआउट प्राप्त करना चाहते हैं।');
      return;
    }
    if (!paymentScreenshotUrl && !googleDrivePaymentLink && !paymentUtr) {
      setErrorMsg('कृपया पेमेंट स्क्रीनशॉट, ड्राइव लिंक या UTR नंबर दर्ज करें।');
      return;
    }

    try {
      setIsSubmitting(true);
      const newUser = await registerNewUserAsync({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim() || `${mobileNumber.replace(/\D/g, '')}@iois.in`,
        selectedPlanId,
        role,
        password,
        photoUrl,
        googleDrivePhotoLink: googleDrivePhotoLink.trim() || undefined,
        paymentScreenshotUrl: paymentScreenshotUrl || undefined,
        googleDrivePaymentLink: googleDrivePaymentLink.trim() || undefined,
        paymentUtr: paymentUtr.trim() || undefined,
        address: address.trim() || undefined,
        payoutUpi: payoutUpi.trim() || undefined,
        sponsorId: sponsorId.trim().toUpperCase(),
      });

      setIsSubmitting(false);
      onRegisterSuccess(newUser);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'पंजीकरण के दौरान कोई त्रुटि आई।');
    }
  };

  return (
    <section id="registration-portal" className="scroll-mt-24 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider">
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>ALL-IN-ONE OFFICIAL PORTAL</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
          📝 IOIS <span className="gold-text">आधिकारिक रजिस्ट्रेशन व वेरिफिकेशन</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          अपना विवरण भरें, उपयुक्त प्लान चुनें और पेमेंट विवरण दर्ज करें। पंजीकरण पूर्ण होते ही आपका 
          <strong> आधिकारिक डिजिटल मेंबर ID व डैशबोर्ड</strong> तुरंत सक्रिय हो जाएगा।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Registration Form (8 Cols) */}
        <div className="lg:col-span-8 glass-card-gold p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>नया खाता पंजीकरण फॉर्म (Direct Member Enrollment)</span>
            </h3>
            <button
              type="button"
              onClick={onOpenLogin}
              className="text-xs text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 cursor-pointer bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30"
            >
              <span>पहले से खाता है? लॉगिन करें →</span>
            </button>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-4 bg-red-950/70 border border-red-500/50 rounded-2xl text-red-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ⚠️ Mandatory Warning Banner (चेतावनी) as requested */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/70 via-amber-950/60 to-red-950/70 border-2 border-amber-400 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
              <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
              <span>⚠️ अति आवश्यक निर्देश व चेतावनी (Mandatory Alert)</span>
            </div>
            <div className="space-y-2 text-xs text-slate-200 leading-relaxed">
              <div className="flex items-start gap-2 bg-slate-950/90 p-3 rounded-xl border border-amber-500/40">
                <span className="text-amber-400 font-black text-sm shrink-0">1.</span>
                <div>
                  <strong className="text-amber-300">UPI ID / Payment Received Address सही-सही भरें:</strong>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    जहाँ आप अपनी कमाई, 70% रेफरल इंसेंटिव और दैनिक पेआउट प्राप्त करना चाहते हैं (Google Pay, PhonePe, Paytm, BHIM आदि), वह UPI ID या पता <strong>बिल्कुल सही-सही और सावधानीपूर्वक</strong> भरें ताकि पैसा सीधे आपके खाते में जमा हो।
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/90 p-3 rounded-xl border border-emerald-500/40">
                <span className="text-emerald-400 font-black text-sm shrink-0">2.</span>
                <div>
                  <strong className="text-emerald-300">Sponsor ID (स्पॉन्सर आईडी) जरूर भरें:</strong>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    रजिस्ट्रेशन के लिए Sponsor ID भरना अनिवार्य है। यदि आपके पास कोई स्पॉन्सर आईडी नहीं है, तो आधिकारिक हेडक्वार्टर आईडी <strong>IOIS999VK01</strong> दर्ज करें।
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            {/* 1. Basic Info & Sponsor ID */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <span>1. व्यक्तिगत व स्पॉन्सर विवरण (Personal & Sponsor Details)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    पूरा नाम (Full Name) <span className="text-red-400">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="उदा. Rahul Kumar"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    (User ID आपके नाम के पहले अक्षरों से स्वतः बनेगी)
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    मोबाइल / WhatsApp नंबर <span className="text-red-400">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="उदा. +91 9876543210"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                    <span>Sponsor ID (स्पॉन्सर आईडी) <span className="text-red-400">* (अनिवार्य)</span>:</span>
                    <span className="text-[10px] text-amber-400 font-black">ज़रूर भरें</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sponsorId}
                    onChange={(e) => setSponsorId(e.target.value.toUpperCase())}
                    placeholder="उदा. IOIS999VK01 या स्पॉन्सर ID"
                    className="w-full bg-slate-950 border-2 border-amber-500/60 focus:border-amber-400 text-amber-300 font-mono font-black rounded-xl px-3.5 py-2.5 outline-none transition uppercase"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    (डिफ़ॉल्ट आधिकारिक स्पॉन्सर आईडी: <strong className="text-amber-400">IOIS999VK01</strong>)
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">ईमेल पता (Email ID):</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1.5">शहर / राज्य (Address/City):</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="उदा. पटना, बिहार"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* 2. Plan & Membership Role */}
            <div className="space-y-4 pt-3 border-t border-slate-800">
              <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <span>2. प्लान व सदस्यता स्तर (Select Plan)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    IOIS एक्टिव प्लान <span className="text-red-400">*</span>:
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition cursor-pointer font-bold"
                  >
                    {PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        Plan 0{p.id}: {p.name} — ₹{p.price} ({p.percentage}% Payout)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">सदस्यता पद (Designation):</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition cursor-pointer"
                  >
                    <option value="Verified Elite Member">Verified Elite Member</option>
                    <option value="Active Digital Learner">Active Digital Learner</option>
                    <option value="Official Youth Reseller">Official Youth Reseller</option>
                    <option value="Supreme Master Partner">Supreme Master Partner</option>
                    <option value="Student Ambassador">Student Ambassador</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Password Creation */}
            <div className="space-y-4 pt-3 border-t border-slate-800">
              <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <span>3. सुरक्षित पासवर्ड बनाएं (Create Password)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    पासवर्ड (Password) <span className="text-red-400">*</span>:
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="कम से कम 4 अक्षर का पासवर्ड"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    पासवर्ड कन्फर्म करें <span className="text-red-400">*</span>:
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="पुनः वही पासवर्ड दर्ज करें"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* 4. Smart Photo Upload (No file size limits, 25MB+ Drive link) */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <span>4. डिजिटल ID कार्ड फोटो (Card Profile Photo)</span>
              </h4>

              <SmartFileUpload
                label="अपनी फ़ोटो अपलोड करें (या 25MB से बड़ी फ़ाइल हेतु Drive Link दें)"
                sublabel="यह फ़ोटो आपके डिजिटल ID कार्ड पर प्रदर्शित होगी।"
                fileValue={photoUrl}
                driveLinkValue={googleDrivePhotoLink}
                onFileChange={setPhotoUrl}
                onDriveLinkChange={setGoogleDrivePhotoLink}
              />
            </div>

            {/* 5. Payment Verification Upload & UTR */}
            <div className="space-y-4 pt-3 border-t border-slate-800">
              <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <span>5. आधिकारिक पेमेंट व वेरिफिकेशन प्रूफ (Payment to Vikas Kumar)</span>
              </h4>

              <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/40 p-5 rounded-2xl text-slate-300 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-black tracking-wider block">
                      चुना हुआ प्लान व देय शुल्क:
                    </span>
                    <div className="text-xl font-black text-white">
                      {selectedPlan.code} ({selectedPlan.name})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400 font-bold">देय राशि:</span>
                    <span className="text-2xl font-black text-amber-300 bg-slate-950 px-4 py-1 rounded-xl border border-amber-400 font-mono shadow-md">
                      ₹{selectedPlan.price}
                    </span>
                  </div>
                </div>

                {/* Official UPI Details Card with QR Code & Copy */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950/90 p-4 rounded-xl border border-slate-800">
                  {/* QR Code */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl text-center space-y-1">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi%3A%2F%2Fpay%3Fpa%3D${OFFICIAL_UPI_ID}%26pn%3DVikas%2520Kumar%26am%3D${selectedPlan.price}%26cu%3DINR`} 
                      alt="UPI QR Code - Vikas Kumar" 
                      className="w-32 h-32 object-contain"
                    />
                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter">
                      SCAN VIA GPAY / PHONEPE / PAYTM
                    </span>
                  </div>

                  {/* UPI Details & Copy */}
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">
                        आधिकारिक प्राप्तकर्ता नाम (Payee Name):
                      </span>
                      <div className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>{OFFICIAL_PAYEE_NAME}</span>
                        <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-bold border border-green-500/30">
                          VERIFIED
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        आधिकारिक UPI ID (Official Payment Address):
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-900 border border-amber-500/40 rounded-xl px-3.5 py-2 font-mono text-xs sm:text-sm font-black text-amber-300 select-all overflow-x-auto">
                          {OFFICIAL_UPI_ID}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                          title="UPI ID कॉपी करें"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-950 stroke-[3]" />
                              <span>कॉपी हुआ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>कॉपी करें</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Direct UPI Intent Button for Mobile Users */}
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <a
                        href={`upi://pay?pa=${OFFICIAL_UPI_ID}&pn=Vikas%20Kumar&am=${selectedPlan.price}&cu=INR`}
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>सीधे UPI ऐप से भुगतान करें (Mobile Pay)</span>
                      </a>
                      <span className="text-[10px] text-slate-400">
                        व्हाट्सएप सहायता: <strong className="text-slate-200">{OFFICIAL_PHONE}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  📌 <strong>निर्देश:</strong> ऊपर दिए गए UPI ID (<strong>{OFFICIAL_UPI_ID}</strong> - Vikas Kumar) या QR कोड पर <strong>₹{selectedPlan.price}</strong> ट्रांसफर करें और सफल ट्रांजेक्शन का स्क्रीनशॉट व 12-अंकों का UTR नंबर नीचे दर्ज करें।
                </p>
              </div>

              <SmartFileUpload
                label="पेमेंट स्क्रीनशॉट अपलोड करें (Payment Screenshot Proof)"
                sublabel="एडमिन आपके स्क्रीनशॉट को देखकर 5 मिनट में अप्रूव करेगा।"
                fileValue={paymentScreenshotUrl}
                driveLinkValue={googleDrivePaymentLink}
                onFileChange={setPaymentScreenshotUrl}
                onDriveLinkChange={setGoogleDrivePaymentLink}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    UTR / Transaction Ref नंबर:
                  </label>
                  <input
                    type="text"
                    value={paymentUtr}
                    onChange={(e) => setPaymentUtr(e.target.value)}
                    placeholder="उदा. 4239XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition font-mono"
                  />
                </div>

                <div className="bg-amber-500/10 border-2 border-amber-500/50 p-3.5 rounded-2xl">
                  <label className="block text-amber-300 font-black mb-1.5 flex items-center justify-between">
                    <span>पेमेंट रिसीव करने का UPI ID / Payment Received Address <span className="text-red-400">*</span>:</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded">सावधानीपूर्वक भरें</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutUpi}
                    onChange={(e) => setPayoutUpi(e.target.value)}
                    placeholder="उदा. 9876543210@paytm या name@okhdfcbank"
                    className="w-full bg-slate-950 border border-amber-500/60 focus:border-amber-400 text-amber-300 font-mono font-bold rounded-xl px-3.5 py-2.5 outline-none transition"
                  />
                  <span className="text-[10px] text-amber-200/80 mt-1 block">
                    ⚠️ <strong>चेतावनी:</strong> जहाँ आप अपनी कमाई व 70% इंसेंटिव पाना चाहते हैं, वही सही UPI ID भरें।
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 hover:from-emerald-400 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 border border-amber-300"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>{isSubmitting ? 'खाता बनाया जा रहा है...' : 'रजिस्ट्रेशन / Join Now (तुरंत डिजिटल ID कार्ड प्राप्त करें)'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Live Summary & Formula Explainer (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Unique ID Formula Card */}
          <div className="glass-card-gold p-6 rounded-3xl border border-amber-500/40 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
              <Sparkles className="w-4 h-4" />
              <span>आपकी यूनिक User ID कैसे बनेगी?</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">अनुमानित User ID प्रिव्यू:</span>
              <div className="text-xl font-black text-amber-300 font-mono tracking-wider">
                {fullName.trim() 
                  ? `IOIS${selectedPlan.price}${fullName.trim().split(/\s+/).map(n => n[0]?.toUpperCase()).join('').slice(0,2) || 'XX'}01`
                  : `IOIS${selectedPlan.price}RK01`
                }
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-400">1. IOIS:</span>
                <span>प्लेटफॉर्म का आधिकारिक ब्रांड कोड</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-400">2. {selectedPlan.price}:</span>
                <span>आपके चुने हुए प्लान की कीमत (₹{selectedPlan.price})</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-400">3. {fullName.trim() ? (fullName.trim().split(/\s+/).map(n => n[0]?.toUpperCase()).join('').slice(0,2) || 'RK') : 'RK'}:</span>
                <span>आपके नाम और उपनाम के पहले अक्षर</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-400">4. 01:</span>
                <span>उस प्लान को चुनने वाले सदस्य का यूनिक क्रम संख्या</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-[10px] text-emerald-300 font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>यह ID 100% नॉन-एडिटेबल और कभी रिपीट न होने वाली आजीवन पहचान है।</span>
            </div>
          </div>

          {/* Quick Help & Guarantee */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 text-xs text-slate-300">
            <h4 className="font-black text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" />
              <span>सुरक्षित व सीधा पेमेंट सिस्टम</span>
            </h4>
            <p className="leading-relaxed">
              किसी भी थर्ड पार्टी ऐप की आवश्यकता नहीं है। पंजीकरण के तुरंत बाद आपका डैशबोर्ड खुल जाएगा जहाँ आप अपना विवरण कभी भी अपडेट कर सकते हैं।
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">24x7 WhatsApp सपोर्ट:</span>
              <span className="font-bold text-emerald-400">{OFFICIAL_PHONE}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
