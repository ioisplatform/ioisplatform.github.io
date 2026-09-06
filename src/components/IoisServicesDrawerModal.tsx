import React, { useState } from 'react';
import { PageType } from '../types';
import { 
  X, 
  Search, 
  Crown, 
  UserPlus, 
  CreditCard, 
  Calculator, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  ShieldAlert, 
  PhoneCall, 
  CloudSun, 
  Tv, 
  Film,
  Scale, 
  Building2, 
  Briefcase, 
  FileText, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  Home,
  CheckCircle2
} from 'lucide-react';

interface IoisServicesDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenAiChat: () => void;
}

export const IoisServicesDrawerModal: React.FC<IoisServicesDrawerModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  onOpenAiChat,
}) => {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleSelectPage = (page: PageType) => {
    onNavigate(page);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const serviceCategories = [
    { id: 'all', label: '⭐ सभी सेवाएं (All)' },
    { id: 'citizen', label: '🏛️ नागरिक व शिक्षा' },
    { id: 'income', label: '💼 7 प्लांस व आय' },
    { id: 'daily', label: '🌤️ मौसम व दैनिक' },
    { id: 'safety', label: '🛡️ सहायता व सुरक्षा' },
  ];

  const serviceList = [
    {
      id: 'home' as PageType,
      category: 'citizen',
      title: 'मुख्य होम पेज (Clean Chrome Surface)',
      subtitle: 'IOIS परिचय, सर्च असिस्टेंट व इंटरव्यू तैयारी',
      badge: 'केंद्रीय पोर्टल',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Home,
      iconColor: 'text-amber-400',
      gradientBg: 'from-amber-500 to-yellow-500',
      keywords: 'home dashboard main search interview intro',
    },
    {
      id: 'student-study' as PageType,
      category: 'citizen',
      title: 'विद्यार्थी शिक्षा व करियर पोर्टल (Student Portal)',
      subtitle: 'Class 1-12 NCERT नोट्स, गणित फॉर्मूला, बोनाफाइड सर्टिफिकेट व करियर रोडमैप',
      badge: '100% फ्री अध्ययन',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
      icon: GraduationCap,
      iconColor: 'text-violet-400',
      gradientBg: 'from-violet-500 to-purple-600',
      keywords: 'student study ncert notes formulas bonafide scholarship class 1-12 ba bsc bcom',
    },
    {
      id: 'rtps-services' as PageType,
      category: 'citizen',
      title: 'RTPS व जमीन सुधार पोर्टल (Land & RTPS)',
      subtitle: 'जाति, आय, निवास, दाखिल खारिज, परिमार्जन, LPC, instant e-PAN व छात्रवृत्ति',
      badge: 'नागरिक सेवा केंद्र',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: FileText,
      iconColor: 'text-emerald-400',
      gradientBg: 'from-emerald-500 to-teal-600',
      keywords: 'rtps jamin dakhil kharij mutation lpc parimarjan caste income residence e-pan',
    },
    {
      id: 'plans' as PageType,
      category: 'income',
      title: '7 मास्टर प्लांस (IOIS 7 Master Plans)',
      subtitle: '₹10 से ₹999 तक के सभी आधिकारिक प्लांस, 70% इंसेंटिव व डिजिटल संसाधन',
      badge: '70% सीधा इंसेंटिव',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Crown,
      iconColor: 'text-amber-400',
      gradientBg: 'from-amber-500 to-yellow-400',
      keywords: 'plans 7 master plan 70 percent incentive earning income ₹10 ₹999',
    },
    {
      id: 'register' as PageType,
      category: 'income',
      title: 'नया सदस्य रजिस्ट्रेशन (In-App Registration)',
      subtitle: 'डायरेक्ट इन-ऐप फॉर्म, 25MB+ पेमेंट प्रूफ अपलोड व यूनिक User ID',
      badge: 'इन-ऐप रजिस्ट्रेशन',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: UserPlus,
      iconColor: 'text-emerald-400',
      gradientBg: 'from-emerald-500 to-green-600',
      keywords: 'register signup account proof upload payment join',
    },
    {
      id: 'idcard' as PageType,
      category: 'income',
      title: 'डिजिटल स्मार्ट ID कार्ड (Digital ID Card)',
      subtitle: '256-Bit एन्क्रिप्टेड स्मार्ट पहचान पत्र, आगे-पीछे का प्रिव्यू व HD PNG डाउनलोड',
      badge: 'स्मार्ट कार्ड',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: CreditCard,
      iconColor: 'text-blue-400',
      gradientBg: 'from-blue-500 to-indigo-600',
      keywords: 'id card identity download smart card qr verification',
    },
    {
      id: 'calculator' as PageType,
      category: 'income',
      title: 'इंसेंटिव व अर्निंग कैलकुलेटर (Earnings Simulator)',
      subtitle: '70% दैनिक, साप्ताहिक व मासिक रेफरल आय का लाइव सिमुलेटर',
      badge: 'लाइव सिमुलेटर',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Calculator,
      iconColor: 'text-purple-400',
      gradientBg: 'from-purple-500 to-pink-600',
      keywords: 'calculator earnings payout referral 70 percent simulator',
    },
    {
      id: 'weather' as PageType,
      category: 'daily',
      title: 'लाइव मौसम व वर्षा अलर्ट (Live Weather)',
      subtitle: 'सटीक तापमान, हवा, नमी, बादलों की स्थिति व 7-दिवसीय पूर्वानुमान',
      badge: 'लाइव सैटेलाइट डेटा',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      icon: CloudSun,
      iconColor: 'text-sky-400',
      gradientBg: 'from-sky-500 to-blue-600',
      keywords: 'weather mausam temperature rain forecast radar',
    },
    {
      id: 'news' as PageType,
      category: 'daily',
      title: 'लाइव टीवी न्यूज़ व ई-अखबार (Live TV News)',
      subtitle: '24x7 राष्ट्रीय न्यूज़ चैनल व प्रमुख डिजिटल ई-अखबार',
      badge: '24x7 लाइव स्ट्रीम',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      icon: Tv,
      iconColor: 'text-red-400',
      gradientBg: 'from-red-500 to-rose-600',
      keywords: 'news live tv aaj tak abp zee newspaper epaper',
    },
    {
      id: 'entertainment' as PageType,
      category: 'daily',
      title: 'मनोरंजन, लाइव चैट व फ्री AI टूल्स (Entertainment Hub)',
      subtitle: 'बिना Ads वीडियो व प्लेलिस्ट, कम्युनिटी फोटो/वॉइस/वीडियो चैट और गूगल व ChatGPT टूल्स',
      badge: '🔥 नया हब',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      icon: Film,
      iconColor: 'text-pink-400',
      gradientBg: 'from-pink-500 to-rose-600',
      keywords: 'entertainment video playlist ad free chat community photo video call ai chatgpt chrome tools',
    },
    {
      id: 'panchang-rashifal' as PageType,
      category: 'daily',
      title: 'दैनिक पंचांग व 12 राशि भविष्य (Panchang & Rashifal)',
      subtitle: 'शुभ मुहूर्त, राहु काल, अमृत चौघड़िया व सभी 12 राशियों का दैनिक भविष्य',
      badge: 'वैदिक ज्योतिष',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Clock,
      iconColor: 'text-amber-400',
      gradientBg: 'from-amber-500 to-orange-500',
      keywords: 'panchang rashifal horoscope muhurat choghadiya rahu kaal',
    },
    {
      id: 'mandi-market' as PageType,
      category: 'daily',
      title: 'लाइव मंडी भाव व 24K सोना-चांदी (Mandi & Bullion)',
      subtitle: 'गेहूं, धान, मक्का, सरसों मंडी भाव व 24K/22K सर्राफा सोना-चांदी दर',
      badge: 'दैनिक मंडी व सर्राफा',
      badgeColor: 'bg-green-500/20 text-green-300 border-green-500/40',
      icon: Scale,
      iconColor: 'text-green-400',
      gradientBg: 'from-green-500 to-emerald-600',
      keywords: 'mandi bhav gold rate silver price commodity krishi',
    },
    {
      id: 'govt-schemes' as PageType,
      category: 'citizen',
      title: 'सरकारी वेबसाइट्स व योजना डायरेक्टरी (Govt Schemes)',
      subtitle: 'आधार, पैन, वोटर, राशन, आयुष्मान भारत व PF आधिकारिक लिंक्स',
      badge: '100% आधिकारिक लिंक्स',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      icon: Building2,
      iconColor: 'text-teal-400',
      gradientBg: 'from-teal-500 to-emerald-600',
      keywords: 'govt schemes aadhaar voter ration epfo official links',
    },
    {
      id: 'jobs' as PageType,
      category: 'safety',
      title: 'लाइव जॉब अलर्ट्स व रोजगार (Jobs Directory)',
      subtitle: 'SSC, रेलवे, बैंक, पुलिस सरकारी भर्तियां व प्राइवेट WFH जॉब्स',
      badge: 'रोजगार डायरेक्टरी',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      icon: Briefcase,
      iconColor: 'text-yellow-400',
      gradientBg: 'from-yellow-500 to-amber-500',
      keywords: 'jobs bharti naukri vacancy ssc railway bank police',
    },
    {
      id: 'assessment' as PageType,
      category: 'safety',
      title: '15-सवाल करियर व स्किल असेसमेंट (Skill Test)',
      subtitle: '2 मिनट स्मार्ट टेस्ट, अंक मूल्यांकन व व्यक्तिगत करियर सुझाव',
      badge: 'कौशल मूल्यांकन',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      icon: GraduationCap,
      iconColor: 'text-orange-400',
      gradientBg: 'from-orange-500 to-amber-600',
      keywords: 'assessment test quiz skill aptitude 15 questions',
    },
    {
      id: 'parents' as PageType,
      category: 'safety',
      title: 'अभिभावक सुरक्षा व नीतियां (Parents Portal)',
      subtitle: '100% सुरक्षित डिजिटल वातावरण, NCERT पाठ्यक्रम व बाल सुरक्षा नीतियां',
      badge: '100% चाइल्ड सेफ',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      icon: ShieldCheck,
      iconColor: 'text-indigo-400',
      gradientBg: 'from-indigo-500 to-purple-500',
      keywords: 'parents portal safety child safe ncert guidelines',
    },
    {
      id: 'contact' as PageType,
      category: 'safety',
      title: '24x7 हेल्पलाइन व अक्सर पूछे जाने वाले सवाल (Support/FAQ)',
      subtitle: 'WhatsApp, Telegram सपोर्ट व आपके सभी संशयों का त्वरित समाधान',
      badge: '24x7 हेल्पलाइन',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: PhoneCall,
      iconColor: 'text-amber-400',
      gradientBg: 'from-amber-500 to-orange-400',
      keywords: 'contact helpline support faq whatsapp telegram help',
    },
    {
      id: 'admin' as PageType,
      category: 'safety',
      title: 'आधिकारिक एडमिन वेरिफिकेशन पैनल (Admin Panel)',
      subtitle: 'मास्टर पिन से सदस्य वेरिफिकेशन, पेमेंट प्रूफ अप्रूवल व हेल्पडेस्क',
      badge: 'मास्टर पिन सुरक्षित',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      icon: ShieldAlert,
      iconColor: 'text-red-400',
      gradientBg: 'from-red-500 to-rose-600',
      keywords: 'admin panel verification payment approval master pin',
    },
  ];

  const filteredServices = serviceList.filter((s) => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const query = searchFilter.toLowerCase().trim();
    if (!query) return matchesCategory;
    return (
      matchesCategory &&
      (s.title.toLowerCase().includes(query) ||
       s.subtitle.toLowerCase().includes(query) ||
       s.keywords.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border-2 border-amber-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-green-500 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-black text-amber-400 leading-none">IOIS</span>
                <span className="text-[8px] text-green-400 font-bold leading-none mt-0.5">HUB</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  IOIS आधिकारिक सेवाएं व मेन्यू (All Services)
                </h3>
                <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                  17+ सर्विसेज
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                नीचे दी गई किसी भी सेवा पर क्लिक करके सीधे उस पेज पर जाएं:
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer shrink-0"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="सेवा का नाम या कीवर्ड सर्च करें (उदा. RTPS, प्लान, मौसम, ID कार्ड, छात्र)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition shadow-inner"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid (Special Look with Custom Logos & Badges) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[60vh] space-y-3">
          {filteredServices.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-slate-400 text-xs">
                "{searchFilter}" से संबंधित कोई सेवा नहीं मिली।
              </p>
              <button
                onClick={() => { setSearchFilter(''); setActiveCategory('all'); }}
                className="text-amber-400 text-xs font-bold hover:underline"
              >
                सभी सेवाएं दिखाएं
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                const isCurrent = currentPage === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleSelectPage(service.id)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 flex items-start justify-between gap-3 border group cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/30'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-amber-500/40 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Special Logo / Custom Icon container */}
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${service.gradientBg} p-0.5 shadow-md shrink-0`}>
                        <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${service.iconColor}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition truncate">
                            {service.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {service.subtitle}
                        </p>
                        <div className="pt-1">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${service.badgeColor}`}>
                            {service.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow / Current Indicator */}
                    <div className="shrink-0 pt-2 text-slate-500 group-hover:text-amber-400 transition">
                      {isCurrent ? (
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-2 py-1 rounded-lg border border-amber-500/40">
                          सक्रिय
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>24x7 ऑल इंडिया डिजिटल स्वावलंबन व नागरिक सेवा पोर्टल</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenAiChat();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI चैटबॉट से पूछें</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
