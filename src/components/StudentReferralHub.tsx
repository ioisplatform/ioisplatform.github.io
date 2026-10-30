import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { UserProfile } from '../types';
import { PLANS, OFFICIAL_PHONE } from '../data/plansData';
import { 
  getDownlineStats, 
  getAllDownlinesRecursive, 
  getDirectDownlines, 
  DownlineMemberInfo,
  getAllUsers,
  maskMobile,
  createHelpTicket
} from '../services/userService';
import { PromotionalPosterStudio } from './PromotionalPosterStudio';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Download, 
  Users, 
  Zap, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Search, 
  Phone, 
  MessageCircle, 
  FileText, 
  ChevronRight, 
  Network, 
  ListFilter,
  Eye,
  X,
  CreditCard,
  Gift,
  Flame,
  UserCheck,
  Wallet,
  ArrowDownCircle,
  TrendingUp,
  Image as ImageIcon,
  Layers,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface StudentReferralHubProps {
  user: UserProfile;
  onOpenIdCard?: () => void;
}

export const StudentReferralHub: React.FC<StudentReferralHubProps> = ({ user, onOpenIdCard }) => {
  // 1. Referral Link Configuration
  const GITHUB_LIVE_BASE = 'https://ioisplatform.github.io';
  const referralUrl = `${GITHUB_LIVE_BASE}/?ref=${encodeURIComponent(user.userId)}&sponsor=${encodeURIComponent(user.userId)}`;

  // 2. State Management
  const [hubTab, setHubTab] = useState<'overview' | 'planBreakdown' | 'withdrawal' | 'posters'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeView, setActiveView] = useState<'table' | 'tree'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [planFilterId, setPlanFilterId] = useState<number | null>(null);
  const [selectedDownline, setSelectedDownline] = useState<UserProfile | null>(null);

  // 3. Withdrawal Management State
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'phonepe' | 'gpay' | 'paytm' | 'bank'>('upi');
  const [payoutAddress, setPayoutAddress] = useState<string>('');
  const [withdrawSuccess, setWithdrawSuccess] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState<string>('');
  const [withdrawals, setWithdrawals] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(`iois_withdrawals_${user.userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Downline Data Calculation
  const [downlineMembers, setDownlineMembers] = useState<DownlineMemberInfo[]>([]);
  const [stats, setStats] = useState(() => getDownlineStats(user.userId));

  useEffect(() => {
    const allUsers = getAllUsers();
    setDownlineMembers(getAllDownlinesRecursive(user.userId, allUsers));
    setStats(getDownlineStats(user.userId, allUsers));
  }, [user.userId]);

  // Balance Calculations
  const totalWithdrawn = withdrawals
    .filter((w: any) => w.status !== 'rejected')
    .reduce((sum: number, w: any) => sum + (Number(w.amount) || 0), 0);
  const availableBalance = Math.max(0, stats.totalEarningsApproved - totalWithdrawn);

  // 5. Plan-Wise Downline Statistics
  const planBreakdown = PLANS.map((plan) => {
    const members = downlineMembers.filter((m) => m.user.selectedPlanId === plan.id);
    const approved = members.filter((m) => m.user.paymentStatus === 'approved');
    const pending = members.filter((m) => m.user.paymentStatus !== 'approved');
    const direct = members.filter((m) => m.level === 1);
    const totalCommission = approved.reduce((sum, m) => sum + (m.commissionEarned || 0), 0);
    return {
      plan,
      totalJoined: members.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      directCount: direct.length,
      totalCommission,
    };
  });

  // 4. Generate HD QR Code on Load
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(referralUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => console.error('QR code generation failed', err));

    return () => {
      isMounted = false;
    };
  }, [referralUrl]);

  // Copy Helpers
  const handleCopy = async (text: string, type: 'link' | 'id') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      }
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `IOIS-Referral-QR-${user.userId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 5. Pre-built Viral Marketing Copy Templates
  const selectedPlan = PLANS.find((p) => p.id === user.selectedPlanId) || PLANS[0];
  
  const promoTemplates = [
    {
      id: 'student-notes',
      tag: 'विद्यार्थी व नोट्स स्पेशल',
      title: 'NCERT बुक्स, नोट्स व बाल विकास किट',
      message: `🇮🇳 *भारतीय ऑनलाइन शिक्षा एवं स्वावलंबन मिशन (IOIS)* 📚\n\nनमस्ते! मैंने IOIS डिजिटल एजुकेशन प्लेटफॉर्म ज्वाइन किया है। यहाँ मात्र ₹10 से ₹999 में कक्षा 1 से 12वीं तक NCERT डिजिटल नोट्स, 700+ पेज बाल विकास किट, 3D लर्निंग और डिजिटल ID कार्ड मिलता है।\n\nसाथ ही प्रत्येक रेफरल पर 50% से 70% तक सीधा बैंक/UPI पेआउट प्राप्त होता है।\n\n👉 *मेरी रेफरल लिंक से अभी रजिस्टर करें:*\n${referralUrl}\n\n🏷️ *Sponsor ID:* ${user.userId}\n(फॉर्म भरते समय Sponsor ID में यही डालें)`,
    },
    {
      id: 'income-opportunity',
      tag: 'ऑनलाइन स्वरोजगार स्पेशल',
      title: '50% से 70% इंस्टेंट पेआउट व घर बैठे कमाई',
      message: `💰 *घर बैठे मोबाइल से सीखें और कमाएं (IOIS Platform)* 🚀\n\nअब समय बर्बाद मत करो! IOIS प्लेटफॉर्म पर स्टूडेंट्स, युवा और महिलाएं सीखकर हर दिन ₹500 से ₹2000 तक इंसेंटिव प्राप्त कर रहे हैं।\n\n✅ 0 Minimum Withdrawal (सीधे आपके GooglePay / PhonePe / Paytm पर)\n✅ आधिकारिक डिजिटल सदस्यता व ID कार्ड\n✅ 7 मास्टर प्लांस (₹10, ₹49, ₹99, ₹199, ₹299, ₹499, ₹999)\n\nमेरी रेफरल लिंक से अभी 2 मिनट में रजिस्टर करें:\n👉 ${referralUrl}\n\nस्पॉन्सर आईडी: *${user.userId}*`,
    },
    {
      id: 'bilingual-vip',
      tag: 'VIP Official Invitation',
      title: 'Official IOIS Member Invitation (Hindi & English)',
      message: `🌟 *Official Invitation to IOIS Digital Ecosystem* 🇮🇳\n\nDear Friend, you are invited to join the Indian Online Income Supporting System (IOIS).\n\n• Verified Student Digital ID Card with QR Verification\n• Complete Educational & Government RTPS Portals Guide\n• 50% to 70% Instant Direct Referral Commission\n\nRegister now via official link:\n👉 ${referralUrl}\n\nSponsor ID: *${user.userId}*\nJoin under verified member: ${user.fullName}`,
    },
  ];

  const handleCopyTemplate = async (msg: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(msg);
      setCopiedTemplateIdx(idx);
      setTimeout(() => setCopiedTemplateIdx(null), 2500);
    } catch (e) {}
  };

  const handleWhatsAppShare = (msg: string) => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

    const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');

    const amountNum = Number(withdrawalAmount);
    if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError('कृपया मान्य विथड्रॉल राशि दर्ज करें।');
      return;
    }

    if (amountNum < 100) {
      setWithdrawError('न्यूनतम विथड्रॉल राशि ₹100 है।');
      return;
    }

    if (amountNum > availableBalance) {
      setWithdrawError(`विथड्रॉल राशि आपके उपलब्ध बैलेंस (₹${availableBalance}) से अधिक नहीं हो सकती।`);
      return;
    }

    if (!payoutAddress.trim()) {
      setWithdrawError('कृपया अपनी UPI ID या बैंक खाता विवरण दर्ज करें।');
      return;
    }

    const newWithdrawal = {
      id: `WDR-${Date.now().toString().slice(-6)}`,
      amount: amountNum,
      method: payoutMethod,
      address: payoutAddress.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [newWithdrawal, ...withdrawals];
    setWithdrawals(updated);
    try {
      localStorage.setItem(`iois_withdrawals_${user.userId}`, JSON.stringify(updated));
    } catch (err) {}

    // Dispatch ticket to Admin so admin can see and approve payout
    createHelpTicket({
      userId: user.userId,
      userName: user.fullName,
      userMobile: user.mobileNumber,
      subject: `[WITHDRAWAL REQUEST] ₹${amountNum} via ${payoutMethod.toUpperCase()} (${payoutAddress.trim()})`,
      description: `सदस्य का नाम: ${user.fullName}\nUser ID: ${user.userId}\nमोबाइल: ${user.mobileNumber}\nविथड्रॉल राशि: ₹${amountNum}\nपेआउट माध्यम: ${payoutMethod.toUpperCase()}\nUPI / खाता: ${payoutAddress.trim()}\nअनुरोध तिथि: ${new Date().toLocaleString('hi-IN')}\nअनुरोध ID: ${newWithdrawal.id}`,
    });

    setWithdrawSuccess(`₹${amountNum} का विथड्रॉल अनुरोध सफलतापूर्वक दर्ज हो गया है! (ID: ${newWithdrawal.id}) एडमिन 2-24 घंटे में आपके UPI पर पेमेंट भेज देगा।`);
    setWithdrawalAmount('');
  };

  // Filtered Downlines
  const filteredDownlines = downlineMembers.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q ||
      item.user.fullName.toLowerCase().includes(q) ||
      item.user.userId.toLowerCase().includes(q) ||
      item.user.mobileNumber.includes(q) ||
      item.planName.toLowerCase().includes(q);

    const matchesStatus = 
      statusFilter === 'all' || 
      item.user.paymentStatus === statusFilter;

    const matchesPlan = planFilterId === null || item.user.selectedPlanId === planFilterId;

    return matchesQuery && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setHubTab('overview')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            hubTab === 'overview'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. रेफरल QR व टीम</span>
        </button>

        <button
          type="button"
          onClick={() => setHubTab('planBreakdown')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            hubTab === 'planBreakdown'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. 7 प्लान-वार जॉइनिंग ब्रेकडाउन ({downlineMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setHubTab('withdrawal')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            hubTab === 'withdrawal'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-emerald-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>3. कमीशन व विथड्रॉल (₹{availableBalance})</span>
        </button>

        <button
          type="button"
          onClick={() => setHubTab('posters')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            hubTab === 'posters'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>4. प्रमोशनल पोस्टर स्टूडियो (Posters)</span>
        </button>
      </div>

      {/* TAB 4: PROMOTIONAL POSTERS STUDIO */}
      {hubTab === 'posters' && (
        <PromotionalPosterStudio user={user} />
      )}

      {/* TAB 2: PLAN-WISE DOWNLINE BREAKDOWN */}
      {hubTab === 'planBreakdown' && (
        <div className="space-y-6">
          <div className="glass-card-gold p-5 sm:p-6 rounded-3xl border-2 border-amber-500/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block">
                  7 Master Plans Joining Breakdown
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  किस प्लान से कितने यूजर जुड़े हैं और कितना कमीशन बना है
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  नीचे सभी 7 प्लांस का विवरण है। किसी भी प्लान पर क्लिक करके उस प्लान के सभी जॉइनिंग सदस्यों की सूची देखें।
                </p>
              </div>

              {planFilterId !== null && (
                <button
                  onClick={() => setPlanFilterId(null)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>फिल्टर हटाएं (सभी {downlineMembers.length} सदस्य देखें)</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planBreakdown.map(({ plan, totalJoined, approvedCount, pendingCount, directCount, totalCommission }) => {
              const isSelected = planFilterId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-xl ring-2 ring-amber-400'
                      : 'glass-card-premium border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">
                        Plan 0{plan.id}
                      </span>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        ₹{plan.instantPayout} ({plan.percentage}%) इंसेंटिव
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white">{plan.name}</h4>
                    <div className="text-xs text-slate-400 font-bold">फीस: ₹{plan.price} (लाइफटाइम)</div>

                    {/* Member Stats for this plan */}
                    <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-slate-800 text-center text-xs">
                      <div className="p-1.5 bg-slate-950 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">कुल जॉइन</span>
                        <strong className="text-amber-400 font-black text-sm">{totalJoined}</strong>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded-lg">
                        <span className="text-[10px] text-emerald-400 block">एक्टिव</span>
                        <strong className="text-emerald-400 font-black text-sm">{approvedCount}</strong>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded-lg">
                        <span className="text-[10px] text-amber-300 block">पेंडिंग</span>
                        <strong className="text-amber-300 font-black text-sm">{pendingCount}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">इस प्लान से कुल कमाई:</span>
                      <span className="font-mono font-black text-emerald-400 text-sm">₹{totalCommission}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPlanFilterId(isSelected ? null : plan.id);
                      setHubTab('overview');
                    }}
                    className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{isSelected ? '✓ चयनित (मेंबर तालिका देखें)' : `इस प्लान के ${totalJoined} मेंबर देखें →`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: COMMISSION & WITHDRAWAL SYSTEM */}
      {hubTab === 'withdrawal' && (
        <div className="space-y-6">
          {/* Top Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card-premium p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20">
              <span className="text-xs font-bold text-emerald-300 block">कुल अर्जित इंसेंटिव (Total Earned)</span>
              <div className="text-3xl font-black text-emerald-300 font-mono mt-1">₹{stats.totalEarningsApproved}</div>
              <span className="text-[10px] text-slate-400 block mt-0.5">वेरिफाइड डाउनलाइन से प्राप्त</span>
            </div>

            <div className="glass-card-premium p-5 rounded-2xl border border-sky-500/40 bg-sky-950/20">
              <span className="text-xs font-bold text-sky-300 block">कुल निकाला गया (Total Withdrawn)</span>
              <div className="text-3xl font-black text-sky-300 font-mono mt-1">₹{totalWithdrawn}</div>
              <span className="text-[10px] text-slate-400 block mt-0.5">अब तक प्रोसेस किया गया पेआउट</span>
            </div>

            <div className="glass-card-premium p-5 rounded-2xl border-2 border-amber-400 bg-amber-500/10 shadow-lg">
              <span className="text-xs font-bold text-amber-300 block">विथड्रॉल के लिए उपलब्ध (Available Balance)</span>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">₹{availableBalance}</div>
              <span className="text-[10px] text-amber-300/80 block mt-0.5">तुरंत बैंक/UPI में ट्रांसफर योग्य</span>
            </div>
          </div>

          {/* Interactive Withdrawal Request Form */}
          <div className="glass-card-gold p-6 sm:p-7 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-5">
            <div className="border-b border-amber-500/30 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <span>इंस्टेंट विथड्रॉल अनुरोध फॉर्म (Withdrawal Request)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  अपनी कमाई को सीधे अपने Google Pay, PhonePe, Paytm या बैंक खाते में ट्रांसफर करवाएं। न्यूनतम विथड्रॉल: ₹100।
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                0% DEDUCTION
              </span>
            </div>

            {withdrawSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{withdrawSuccess}</span>
              </div>
            )}

            {withdrawError && (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>विथड्रॉल राशि (₹):</span>
                    <span className="text-[10px] text-amber-400 font-mono">उपलब्ध: ₹{availableBalance}</span>
                  </label>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="उदा. 200"
                    min="100"
                    max={availableBalance}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:border-amber-400 outline-none"
                  />
                  
                  {/* Quick Amount Pills */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">त्वरित चुनें:</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawalAmount('100')}
                      className="px-2 py-0.5 rounded bg-slate-800 text-xs font-bold text-amber-300 hover:bg-slate-700"
                    >
                      ₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawalAmount('200')}
                      className="px-2 py-0.5 rounded bg-slate-800 text-xs font-bold text-amber-300 hover:bg-slate-700"
                    >
                      ₹200
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawalAmount('500')}
                      className="px-2 py-0.5 rounded bg-slate-800 text-xs font-bold text-amber-300 hover:bg-slate-700"
                    >
                      ₹500
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawalAmount(String(availableBalance))}
                      className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-xs font-black text-amber-300 hover:bg-amber-400/30"
                    >
                      पूरा बैलेंस (₹{availableBalance})
                    </button>
                  </div>
                </div>

                {/* Payout Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">पेआउट माध्यम (Payout Method):</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('upi')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                        payoutMethod === 'upi' ? 'bg-amber-400 text-slate-950 border-amber-300 font-black' : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      <span>BHIM UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('phonepe')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                        payoutMethod === 'phonepe' ? 'bg-amber-400 text-slate-950 border-amber-300 font-black' : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      <span>PhonePe</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('gpay')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                        payoutMethod === 'gpay' ? 'bg-amber-400 text-slate-950 border-amber-300 font-black' : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      <span>Google Pay</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* UPI ID / Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  आपकी UPI ID / नंबर (उदा. 9876543210@paytm या yourname@oksbi):
                </label>
                <input
                  type="text"
                  value={payoutAddress}
                  onChange={(e) => setPayoutAddress(e.target.value)}
                  placeholder="उदा. rahul@upi या 9523218765@ybl"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-amber-400 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={availableBalance < 100}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-sm uppercase transition cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowDownCircle className="w-5 h-5 text-slate-950" />
                <span>विथड्रॉल अनुरोध सबमिट करें →</span>
              </button>
            </form>
          </div>

          {/* Recent Withdrawal Requests History */}
          <div className="glass-card-premium p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>हाल के विथड्रॉल अनुरोध (Recent Payout History)</span>
            </h4>

            {withdrawals.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                अभी तक कोई विथड्रॉल अनुरोध दर्ज नहीं किया गया है। ऊपर दिए गए फॉर्म से अनुरोध करें।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">अनुरोध ID</th>
                      <th className="p-3">राशि</th>
                      <th className="p-3">माध्यम व पता</th>
                      <th className="p-3">तिथि</th>
                      <th className="p-3">स्थिति (Status)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {withdrawals.map((w: any) => (
                      <tr key={w.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-amber-300">{w.id}</td>
                        <td className="p-3 font-mono font-black text-white text-sm">₹{w.amount}</td>
                        <td className="p-3 font-mono text-slate-300">{w.method.toUpperCase()} ({w.address})</td>
                        <td className="p-3 text-slate-400">{new Date(w.createdAt).toLocaleDateString('hi-IN')}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            w.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {w.status === 'paid' ? 'PAID (भुगतान सफल)' : 'PROCESSING (समीक्षाधीन)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW (Default View) */}
      {hubTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Plan Filter Notice if active */}
          {planFilterId !== null && (
            <div className="p-3 bg-amber-500/10 border border-amber-400/40 rounded-2xl flex items-center justify-between text-xs text-amber-300">
              <span>
                <strong>फ़िल्टर सक्रिय:</strong> केवल <strong>Plan 0{planFilterId}</strong> के सदस्य प्रदर्शित किए जा रहे हैं।
              </span>
              <button
                onClick={() => setPlanFilterId(null)}
                className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 cursor-pointer"
              >
                फ़िल्टर साफ़ करें
              </button>
            </div>
          )}
      {/* ========================================================= */}
      {/* 1. TOP METRICS STRIP (Total Refers, Active, Commission) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Direct Referrals */}
        <div className="glass-card-premium p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">डायरेक्ट रेफरल (Level 1)</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">
            {stats.directCount}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">सीधे आपके स्पॉन्सर से</span>
        </div>

        {/* Total Downline Team */}
        <div className="glass-card-premium p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-sky-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">कुल टीम (All Levels)</span>
            <Network className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono mt-1">
            {stats.totalDownlinesCount}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">मल्टी-लेवल नेटवर्क</span>
        </div>

        {/* Active Approved Downlines */}
        <div className="glass-card-premium p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">वेरिफाइड एक्टिव सदस्य</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
            {stats.approvedCount}
          </div>
          <span className="text-[10px] text-emerald-400/80 block mt-0.5">
            {stats.pendingCount > 0 ? `(${stats.pendingCount} समीक्षाधीन)` : 'सभी सक्रिय'}
          </span>
        </div>

        {/* Total Earned Commission */}
        <div className="glass-card-premium p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-green-500/40 bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300">कुल रेफरल इंसेंटिव</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono mt-1">
            ₹{stats.totalEarningsApproved}
          </div>
          <span className="text-[10px] text-amber-300 block mt-0.5">
            +₹{stats.potentialEarningsPending} संभावित
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. REFERRAL QR & 1-CLICK SHARE STRIP */}
      {/* ========================================================= */}
      <div className="glass-card-gold p-5 sm:p-7 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          
          {/* Left: Dynamic QR Code Box */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
            <div className="relative group shrink-0">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-400/80 w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for ${user.userId}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-xs text-slate-500 animate-pulse">QR जनरेट हो रहा है...</div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-400 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                SCAN TO REGISTER
              </div>
            </div>

            {/* QR Info and Direct Download */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>आपका व्यक्तिगत रेफरल QR कोड</span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-black text-white">
                स्कैन करवाएं और सीधा पेआउट पाएं!
              </h3>
              
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                इस QR कोड को स्कैन करते ही छात्र सीधे आपकी स्पॉन्सर आईडी के अंतर्गत रजिस्ट्रेशन पेज पर पहुंच जाएगा।
              </p>

              <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>QR डाउनलोड (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppShare(promoTemplates[0].message)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp पर शेयर</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Sponsor ID & Quick ID Card Trigger */}
          <div className="w-full md:w-72 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3 shrink-0">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                आपकी आधिकारिक स्पॉन्सर ID
              </span>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                  {user.userId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(user.userId, 'id')}
                  className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Copy Sponsor ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'कॉपी हुआ' : 'कॉपी'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-850">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                लाइव रेफरल लिंक
              </span>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-[11px] font-mono text-slate-300 truncate mt-1">
                {referralUrl}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(referralUrl, 'link')}
                className={`w-full mt-2 py-2 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-md ${
                  copiedLink
                    ? 'bg-emerald-500 text-slate-950 scale-105 ring-2 ring-emerald-400'
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 active:scale-95'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 text-slate-950 stroke-[3] animate-bounce" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? '✓ रेफरल लिंक कॉपी हो गया!' : 'रेफरल लिंक कॉपी करें'}</span>
              </button>
            </div>

            {onOpenIdCard && (
              <button
                type="button"
                onClick={onOpenIdCard}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>डिजिटल ID कार्ड देखें →</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. READY-TO-SEND VIRAL PROMOTION MESSAGES */}
      {/* ========================================================= */}
      <div className="glass-card-premium p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>रेफरल प्रमोशन मैसेज (Ready-To-Send Marketing Templates)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              अपनी लिंक के साथ तैयार संदेशों को कॉपी करें और WhatsApp, Telegram या Facebook पर एक क्लिक में साझा करें।
            </p>
          </div>
          <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            3 High-Converting Templates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promoTemplates.map((tmpl, idx) => (
            <div
              key={tmpl.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/40 flex flex-col justify-between transition space-y-3"
            >
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {tmpl.tag}
                </span>
                <h4 className="text-xs font-black text-white">{tmpl.title}</h4>
                <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-[11px] text-slate-300 font-sans max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed select-all">
                  {tmpl.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopyTemplate(tmpl.message, idx)}
                  className="py-2 px-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  {copiedTemplateIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">कॉपी हुआ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>मैसेज कॉपी</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppShare(tmpl.message)}
                  className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. DOWNLINE CHECKUP SYSTEM (Table & Visual Tree) */}
      {/* ========================================================= */}
      <div className="glass-card-premium p-5 sm:p-7 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-black text-white">
                डाउनलाइन चेकअप सिस्टम (Downline Network Inspection)
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              आपके नीचे पंजीकृत सभी प्रत्यक्ष एवं अप्रत्यक्ष सदस्यों की सूची, प्लान और सत्यापन स्थिति।
            </p>
          </div>

          {/* View Toggle: Table vs Tree */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'table'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>तालिका व्यू (Table)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'tree'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>विजुअल ट्री (Genealogy Tree)</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, User ID या मोबाइल से खोजें..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3.5 py-2 text-xs outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 font-bold shrink-0">स्टेटस:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 transition cursor-pointer"
            >
              <option value="all">सभी सदस्य ({downlineMembers.length})</option>
              <option value="approved">केवल एक्टिव ({stats.approvedCount})</option>
              <option value="pending">केवल पेंडिंग ({stats.pendingCount})</option>
            </select>
          </div>
        </div>

        {/* View Content: Table Mode */}
        {activeView === 'table' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            {filteredDownlines.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-600" />
                <p>कोई डाउनलाइन सदस्य नहीं मिला। अपनी रेफरल लिंक शेयर करके नए सदस्यों को जोड़ें!</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-bold">लेवल</th>
                    <th className="p-3.5 font-bold">सदस्य विवरण</th>
                    <th className="p-3.5 font-bold">प्लान</th>
                    <th className="p-3.5 font-bold">इंसेंटिव</th>
                    <th className="p-3.5 font-bold">स्थिति</th>
                    <th className="p-3.5 font-bold">पंजीकरण तिथि</th>
                    <th className="p-3.5 font-bold text-right">प्रोफाइल</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredDownlines.map((item) => {
                    const isDirect = item.level === 1;
                    return (
                      <tr 
                        key={item.user.userId} 
                        className="hover:bg-slate-850/60 transition group cursor-pointer"
                        onClick={() => setSelectedDownline(item.user)}
                      >
                        {/* Level */}
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isDirect 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}>
                            Level {item.level} {isDirect ? '(Direct)' : ''}
                          </span>
                        </td>

                        {/* Member Details */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/50 bg-slate-900 shrink-0">
                              <img src={item.user.photoUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-amber-300 transition">
                                {item.user.fullName}
                              </div>
                              <div className="font-mono text-[10px] text-amber-400">
                                {item.user.userId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-200">
                            {item.planName}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            ₹{item.planPrice}
                          </span>
                        </td>

                        {/* Commission */}
                        <td className="p-3.5 font-mono font-black text-emerald-400">
                          ₹{isDirect ? item.instantPayout : Math.round(item.instantPayout * 0.2)}
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          {item.user.paymentStatus === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <ShieldCheck className="w-3 h-3" />
                              <span>वेरिफाइड</span>
                            </span>
                          ) : item.user.paymentStatus === 'pending' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              <span>समीक्षाधीन</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                              <span>अस्वीकृत</span>
                            </span>
                          )}
                        </td>

                        {/* Registration Date */}
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {new Date(item.user.createdAt).toLocaleDateString('hi-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Action */}
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDownline(item.user);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-400 hover:text-slate-950 border border-slate-700 text-slate-300 text-[11px] font-bold inline-flex items-center gap-1 transition"
                          >
                            <Eye className="w-3 h-3" />
                            <span>देखें</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* View Content: Visual Hierarchy Tree */}
        {activeView === 'tree' && (
          <div className="p-4 sm:p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-6">
            {/* Root User Node (Self) */}
            <div className="flex flex-col items-center">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg border-2 border-amber-300 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-900 shrink-0">
                  <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-black">{user.fullName} (YOU)</div>
                  <div className="text-[10px] font-mono text-slate-900 font-bold">ID: {user.userId}</div>
                </div>
              </div>
              <div className="w-0.5 h-6 bg-amber-400"></div>
            </div>

            {/* Direct Level 1 Nodes */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300">
                  Level 1 Direct Referrals ({stats.directCount} Members)
                </span>
              </div>

              {stats.directCount === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  अभी तक आपके नीचे कोई डायरेक्ट सदस्य नहीं जुड़ा है।
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {downlineMembers
                    .filter((m) => m.level === 1)
                    .map((item) => (
                      <div
                        key={item.user.userId}
                        onClick={() => setSelectedDownline(item.user)}
                        className="p-3.5 bg-slate-900 hover:bg-slate-850 rounded-2xl border border-slate-700 hover:border-amber-400/80 transition cursor-pointer space-y-2 group shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-400">Level 1</span>
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
                          <div>
                            <div className="font-black text-white text-xs group-hover:text-amber-300 transition">
                              {item.user.fullName}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">{item.user.userId}</div>
                            <div className="text-[10px] text-slate-300">{item.planName}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800 text-slate-400">
                          <span>इंसेंटिव: <strong className="text-emerald-400 font-mono">₹{item.instantPayout}</strong></span>
                          <span className="text-amber-400 group-hover:underline flex items-center gap-0.5">
                            विवरण <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Deeper Levels (Level 2+) if any */}
            {downlineMembers.some((m) => m.level > 1) && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 border border-sky-500/40 text-sky-300">
                    Level 2+ Secondary Downlines ({downlineMembers.filter((m) => m.level > 1).length} Members)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {downlineMembers
                    .filter((m) => m.level > 1)
                    .map((item) => (
                      <div
                        key={item.user.userId}
                        onClick={() => setSelectedDownline(item.user)}
                        className="p-3 bg-slate-900/70 hover:bg-slate-850 rounded-xl border border-slate-800 hover:border-sky-400 transition cursor-pointer text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-sky-300 font-bold">Level {item.level}</span>
                          <span className="text-slate-400">By: {item.directSponsorName}</span>
                        </div>
                        <div className="font-bold text-white truncate">{item.user.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">{item.user.userId}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )}

      {/* ========================================================= */}
      {/* 5. DOWNLINE MEMBER PROFILE DETAIL MODAL */}
      {/* ========================================================= */}
      {selectedDownline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-white space-y-4">
            <button
              type="button"
              onClick={() => setSelectedDownline(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg">
                <img src={selectedDownline.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">{selectedDownline.fullName}</h3>
                <div className="font-mono text-xs text-amber-300 font-bold">
                  User ID: {selectedDownline.userId}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    selectedDownline.paymentStatus === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedDownline.paymentStatus === 'approved' ? 'VERIFIED ACTIVE' : 'PENDING APPROVAL'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Fields Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">चयनित प्लान:</span>
                <span className="font-bold text-white">
                  {PLANS.find((p) => p.id === selectedDownline.selectedPlanId)?.name || 'Plan'}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">पंजीकरण तिथि:</span>
                <span className="font-bold text-white">
                  {new Date(selectedDownline.createdAt).toLocaleDateString('hi-IN')}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">मोबाइल नंबर:</span>
                <span className="font-bold text-white font-mono">
                  {maskMobile(selectedDownline.mobileNumber)}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">स्थान / शहर:</span>
                <span className="font-bold text-white">
                  {selectedDownline.address || selectedDownline.district || 'भारत'}
                </span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`नमस्ते ${selectedDownline.fullName} जी! मैं आपका IOIS स्पॉन्सर हूँ।`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर संपर्क करें</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedDownline(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
