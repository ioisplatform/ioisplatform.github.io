import React, { useState } from 'react';
import { PageType, Plan } from '../types';
import { PLANS } from '../data/plansData';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Wallet, 
  GraduationCap, 
  Users, 
  Award,
  Zap,
  BookOpen,
  UserPlus,
  Crown,
  FileText,
  CloudSun,
  Tv,
  Clock,
  Scale,
  Building2,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Calculator,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Target,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface IoisPurposeWelcomeExplainerProps {
  onNavigate: (page: PageType) => void;
  onSelectPlanForRegister?: (planId: number) => void;
  onOpenAiChat?: () => void;
}

type UserPurposeId = 'earn' | 'govt_rtps' | 'daily_updates' | 'id_card' | 'career_jobs' | 'support_help';

export const IoisPurposeWelcomeExplainer: React.FC<IoisPurposeWelcomeExplainerProps> = ({
  onNavigate,
  onSelectPlanForRegister,
  onOpenAiChat,
}) => {
  // State for user intent selection
  const [selectedPurpose, setSelectedPurpose] = useState<UserPurposeId>('earn');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [selectedPlanTab, setSelectedPlanTab] = useState<number>(1);

  const purposeOptions = [
    {
      id: 'earn' as UserPurposeId,
      icon: Crown,
      label: '1. ऑनलाइन काम व 70% दैनिक कमाई',
      tagline: 'घर बैठे पार्ट-टाइम / फुल-टाइम डिजिटल अर्निंग',
      color: 'from-amber-500 to-yellow-400',
      borderColor: 'border-amber-400',
      activeBg: 'bg-amber-500/15 text-amber-300',
      welcomeTitle: 'नमस्ते उद्यमी! आपका लक्ष्य: घर बैठे सुरक्षित डिजिटल आय',
      welcomeDesc: 'IOIS आपको बिना किसी धोखाधड़ी के 100% पारदर्शी डिजिटल संसाधन, ई-बुक्स, कोडिंग बंडल व 70% सीधा इंसेंटिव मॉडल प्रदान करता है।',
      steps: [
        'नीचे दिए गए 7 मास्टर प्लांस (₹10 से ₹999) में से अपनी पसंद का प्लान चुनें।',
        'सीधा इन-ऐप रजिस्ट्रेशन फॉर्म भरें और अपना यूनिक User ID प्राप्त करें।',
        'डिजिटल संसाधन डाउनलोड करें, दोस्तों व सोशल मीडिया पर साझा करें और प्रति रेफरल ₹7 से ₹699 तक सीधा 70% इंसेंटिव कमाएं!',
      ],
      primaryBtnText: '7 मास्टर प्लांस देखें व चुनें',
      primaryTarget: 'plans' as PageType,
      secondaryBtnText: 'अर्निंग कैलकुलेटर चलाएं',
      secondaryTarget: 'calculator' as PageType,
    },
    {
      id: 'govt_rtps' as UserPurposeId,
      icon: FileText,
      label: '2. RTPS, जाति, आय, जमीन दाखिल-खारिज',
      tagline: 'परिमार्जन, LPC, instant e-PAN व सरकारी योजनाएं',
      color: 'from-emerald-500 to-teal-400',
      borderColor: 'border-emerald-400',
      activeBg: 'bg-emerald-500/15 text-emerald-300',
      welcomeTitle: 'नागरिक सेवा केंद्र में आपका स्वागत है!',
      welcomeDesc: 'यहाँ आपको जाति, आय, निवास, जमीन का दाखिल-खारिज, परिमार्जन, LPC, 10 मिनट में फ्री e-PAN व सरकारी पेंशन-छात्रवृत्ति के सटीक नियम व आधिकारिक लिंक मिलेंगे।',
      steps: [
        'RTPS व जमीन सुधार पोर्टल खोलें और अपनी आवश्यक सेवा (उदा. जाति प्रमाण पत्र या दाखिल-खारिज) चुनें।',
        'स्मार्ट चेकलिस्ट से आवश्यक दस्तावेज (आधार, केवाला, फोटो, खतियान) का प्रारूप व साइज जांचें।',
        'दिए गए 100% आधिकारिक पोर्टल लिंक से सीधे ऑनलाइन आवेदन करें व पावती नंबर से स्टेटस ट्रैक करें।',
      ],
      primaryBtnText: 'RTPS व जमीन सुधार गाइड खोलें',
      primaryTarget: 'rtps-services' as PageType,
      secondaryBtnText: 'सरकारी वेबसाइट्स डायरेक्टरी',
      secondaryTarget: 'govt-schemes' as PageType,
    },
    {
      id: 'daily_updates' as UserPurposeId,
      icon: CloudSun,
      label: '3. मौसम, लाइव टीवी, पंचांग व मंडी भाव',
      tagline: '24x7 समाचार, वर्षा अलर्ट, शुभ मुहूर्त व सोना-चांदी',
      color: 'from-sky-500 to-blue-400',
      borderColor: 'border-sky-400',
      activeBg: 'bg-sky-500/15 text-sky-300',
      welcomeTitle: 'दैनिक सूचना व उपयोगिता केंद्र में आपका स्वागत है!',
      welcomeDesc: 'अपने शहर का सटीक तापमान, लाइव बारिश रडार, 24x7 लाइव राष्ट्रीय टीवी समाचार, वैदिक पंचांग, 12 राशि भविष्य और फसलों के ताजा मंडी भाव एक ही जगह देखें।',
      steps: [
        'लाइव मौसम पेज पर अपना शहर चुनें और 7-दिवसीय तापमान व वर्षा अलर्ट देखें।',
        '24x7 लाइव टीवी व ई-अखबार पेज पर ताजा समाचार व हेडलाइन्स पढ़ें।',
        'पंचांग व मंडी भाव पेज पर आज का शुभ मुहूर्त, राहु काल व 24K सोने का ताजा भाव देखें।',
      ],
      primaryBtnText: 'लाइव मौसम अलर्ट देखें',
      primaryTarget: 'weather' as PageType,
      secondaryBtnText: '24x7 लाइव टीवी व न्यूज़ खोलें',
      secondaryTarget: 'news' as PageType,
    },
    {
      id: 'id_card' as UserPurposeId,
      icon: CreditCard,
      label: '4. डिजिटल मेंबर ID कार्ड बनाना',
      tagline: '256-Bit एन्क्रिप्टेड स्मार्ट पहचान पत्र',
      color: 'from-yellow-500 to-amber-500',
      borderColor: 'border-yellow-400',
      activeBg: 'bg-yellow-500/15 text-yellow-300',
      welcomeTitle: 'आधिकारिक डिजिटल पहचान पत्र जनरेटर!',
      welcomeDesc: 'IOIS का 256-bit एन्क्रिप्टेड स्मार्ट डिजिटल ID कार्ड आपको एक प्रमाणित सदस्य पहचान, QR कोड वेरिफिकेशन और डिजिटल डाउनलोड की सुविधा देता है।',
      steps: [
        'डिजिटल ID कार्ड पेज खोलें और अपने खाते का विवरण देखें।',
        'आईडी कार्ड के आगे (Front) और पीछे (Back) का उच्च गुणवत्ता वाला प्रिव्यू जांचें।',
        '1-क्लिक में HD PNG फॉर्मेट में अपना पहचान पत्र डाउनलोड करें या प्रिंट करें।',
      ],
      primaryBtnText: 'डिजिटल ID कार्ड देखें व बनाएं',
      primaryTarget: 'idcard' as PageType,
      secondaryBtnText: 'नया सदस्य रजिस्टर करें',
      secondaryTarget: 'register' as PageType,
    },
    {
      id: 'career_jobs' as UserPurposeId,
      icon: Briefcase,
      label: '5. जॉब अलर्ट्स, करियर टेस्ट व स्किल्स',
      tagline: 'सरकारी व प्राइवेट भर्तियां, 15-सवाल असेसमेंट',
      color: 'from-purple-500 to-indigo-400',
      borderColor: 'border-purple-400',
      activeBg: 'bg-purple-500/15 text-purple-300',
      welcomeTitle: 'करियर विकास व भर्ती मंच में आपका स्वागत है!',
      welcomeDesc: 'SSC, रेलवे, बैंक, पुलिस की ताजा नौकरियां और IOIS करियर असेसमेंट टेस्ट से अपनी डिजिटल स्किल्स को निखारें।',
      steps: [
        'लाइव जॉब अलर्ट्स पेज पर नई सरकारी व प्राइवेट भर्तियों की योग्यता व अंतिम तिथि देखें।',
        '15-सवाल का स्मार्ट एप्टीट्यूड व करियर असेसमेंट टेस्ट देकर अपनी क्षमताओं को मापें।',
        'IOIS लर्निंग बंडल से AI, कोडिंग, ग्राफिक डिजाइनिंग और डिजिटल मार्केटिंग सीखें।',
      ],
      primaryBtnText: 'लाइव जॉब अलर्ट्स देखें',
      primaryTarget: 'jobs' as PageType,
      secondaryBtnText: '15-सवाल असेसमेंट टेस्ट दें',
      secondaryTarget: 'assessment' as PageType,
    },
    {
      id: 'support_help' as UserPurposeId,
      icon: ShieldCheck,
      label: '6. अभिभावक सुरक्षा, हेल्पलाइन व एडमिन',
      tagline: '100% चाइल्ड सेफ, WhatsApp सपोर्ट, मास्टर पिन',
      color: 'from-rose-500 to-red-400',
      borderColor: 'border-rose-400',
      activeBg: 'bg-rose-500/15 text-rose-300',
      welcomeTitle: 'सुरक्षा, सहायता व हेल्पडेस्क में आपका स्वागत है!',
      welcomeDesc: '100% सुरक्षित और बाल-सुरक्षा (Child-Safe) मानकों पर आधारित पारदर्शी इकोसिस्टम, 24x7 WhatsApp हेल्पलाइन और एडमिन वेरिफिकेशन।',
      steps: [
        'अभिभावक पोर्टल पर NCERT एथिक्स, बाल सुरक्षा और कानूनी नीतियों की समीक्षा करें।',
        '24x7 हेल्पलाइन व FAQ पेज पर अपने संशय तुरंत दूर करें या WhatsApp/Telegram पर बात करें।',
        'एडमिन पैनल पर मास्टर पिन द्वारा नए रजिस्ट्रेशन व पेमेंट प्रूफ वेरीफाई करें।',
      ],
      primaryBtnText: '24x7 हेल्पलाइन व FAQs',
      primaryTarget: 'contact' as PageType,
      secondaryBtnText: 'अभिभावक सुरक्षा नीतियां',
      secondaryTarget: 'parents' as PageType,
    },
  ];

  const currentPurpose = purposeOptions.find((p) => p.id === selectedPurpose) || purposeOptions[0];

  const activePlanData = PLANS.find((p) => p.id === selectedPlanTab) || PLANS[0];

  const faqs = [
    {
      q: 'IOIS प्लेटफॉर्म क्या है और यह कैसे काम करता है?',
      a: 'IOIS (Indian Online Income Supporting System) एक पारदर्शी, सुरक्षित और डिजिटल लर्निंग व अर्निंग सपोर्टिंग प्लेटफॉर्म है। यहाँ उपयोगकर्ताओं को ई-बुक्स, कोडिंग, AI टूल्स व करियर संसाधन मिलते हैं। जब आप इस उपयोगी मंच को दूसरों के साथ साझा करते हैं, तो सिस्टम आपको सीधे 50% से 70% तक का इंसेंटिव प्रदान करता है।',
    },
    {
      q: 'क्या IOIS पर जुड़ने के लिए कोई बड़ी फीस लगती है?',
      a: 'बिल्कुल नहीं! IOIS को हर वर्ग के लिए सुलभ बनाया गया है। इसके प्लांस मात्र ₹10 (Starter Plan) से शुरू होते हैं (₹10, ₹20, ₹50, ₹100, ₹200, ₹500, और ₹999)। हर कोई अपनी क्षमता अनुसार प्लान चुनकर तुरंत शुरुआत कर सकता है।',
    },
    {
      q: 'RTPS और जमीन सुधार सेवाओं के लिए कोई शुल्क है?',
      a: 'नहीं! IOIS पर दी गई RTPS गाइड (जाति, आय, निवास), जमीन दाखिल-खारिज, परिमार्जन, LPC, instant e-PAN व सरकारी योजनाओं की जानकारी और आधिकारिक लिंक्स आम नागरिकों के लिए 100% मुफ्त हैं।',
    },
    {
      q: 'कमाई का पैसा (Payout) कैसे और कब मिलता है?',
      a: 'जैसे ही आपका रेफरल सदस्य वेरीफाई होता है, 70% इंसेंटिव तुरंत आपके खाते/UPI में ट्रांसफर कर दिया जाता है। किसी तीसरे पक्ष या देरी की कोई झंझट नहीं है।',
    },
    {
      q: 'क्या यह प्लेटफॉर्म छात्रों व बच्चों के लिए सुरक्षित है?',
      a: 'हाँ! IOIS 100% चाइल्ड-सेफ है। इसमें कोई अनैतिक, भ्रामक या सट्टेबाजी वाली सामग्री नहीं है। सभी शिक्षण सामग्री NCERT मानकों और डिजिटल साक्षरता के अनुरूप है।',
    },
  ];

  const portalServicesList = [
    { title: '🏛️ RTPS व नागरिक प्रमाण पत्र', desc: 'जाति, आय, निवास, EWS, NCL, चरित्र प्रमाण पत्र की स्टेप-बाय-स्टेप गाइड व चेकलिस्ट।' },
    { title: '🌾 जमीन सुधार व दाखिल-खारिज', desc: 'दाखिल-खारिज (Mutation), परिमार्जन (डिजिटल जमाबंदी सुधार), LPC व ऑनलाइन लगान रसीद।' },
    { title: '🪪 10 मिनट में Instant e-PAN', desc: 'इनकम टैक्स पोर्टल से बिना ₹1 खर्च किए आधार OTP से तुरंत नया पैन कार्ड बनाएं।' },
    { title: '👑 7 मास्टर स्वावलंबन प्लांस', desc: '₹10 से ₹999 तक के प्लान, 500+ ई-बुक्स, 10,000+ AI प्रॉम्ट्स व 70% सीधा इंसेंटिव।' },
    { title: '🌤️ लाइव मौसम व वर्षा अलर्ट', desc: 'सटीक शहरवार तापमान, बादलों की स्थिति, बारिश अलर्ट व 7-दिवसीय पूर्वानुमान।' },
    { title: '📺 24x7 लाइव न्यूज़ व ई-अखबार', desc: 'लाइव टीवी स्ट्रीमिंग (Aaj Tak, ABP, Zee आदि) और सभी प्रमुख राष्ट्रीय डिजिटल अखबार।' },
    { title: '🕉️ दैनिक पंचांग व 12 राशिफल', desc: 'शुभ मुहूर्त, राहु काल, चौघड़िया, लकी नंबर/रंग और दैनिक भाग्य फल।' },
    { title: '🌾 मंडी भाव व 24K सोना-चांदी', desc: 'फसलों के लाइव कृषि मंडी दाम और 24K/22K गोल्ड व चांदी के ताजा सर्राफा भाव।' },
    { title: '🪪 डिजिटल ID कार्ड जनरेटर', desc: '256-Bit एन्क्रिप्टेड स्मार्ट डिजिटल पहचान पत्र, लाइव प्रिव्यू व HD PNG डाउनलोड।' },
    { title: '💼 लाइव सरकारी व प्राइवेट जॉब्स', desc: 'SSC, रेलवे, बैंक, पुलिस की नई भर्तियां और घर बैठे डिजिटल अर्निंग अवसर।' },
    { title: '🧮 70% अर्निंग कैलकुलेटर', desc: 'दैनिक, साप्ताहिक व मासिक रेफरल पेआउट का लाइव इंटरएक्टिव सिमुलेशन।' },
    { title: '🤖 24x7 IOIS AI असिस्टेंट', desc: 'किसी भी सरकारी योजना, RTPS या प्लान को समझने के लिए तुरंत हिंदी में AI सहायता।' },
  ];

  return (
    <section id="about-iois-section" className="space-y-12 sm:space-y-16">

      {/* ================= 1. INTERACTIVE USER PURPOSE SELECTOR & PERSONALIZED WELCOME ================= */}
      <div className="glass-card-premium p-6 sm:p-10 border-2 border-amber-500/40 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider">
              <Target className="w-4 h-4 text-amber-400" />
              <span>अनुकूलित उपयोगकर्ता मार्गदर्शक (Personalized Welcome Guide)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              आप आज <span className="tiranga-text">IOIS प्लेटफॉर्म</span> पर किस उद्देश्य से आए हैं?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              नीचे से अपना मुख्य उद्देश्य चुनें — हम आपके लिए सबसे उपयुक्त स्वागत संदेश, दिशा-निर्देश और सीधे बटन तुरंत तैयार करेंगे:
            </p>
          </div>

          {/* 6 Purpose Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {purposeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedPurpose === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPurpose(opt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-2 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                      : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${opt.color} p-0.5 flex items-center justify-center`}>
                      <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>चुना गया</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white">{opt.label}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{opt.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Tailored Welcome Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-amber-500/40 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  🎯 आपके लिए विशेष मार्गदर्शन
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white">
                  {currentPurpose.welcomeTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentPurpose.welcomeDesc}
                </p>
              </div>

              {/* Action Buttons for this Purpose */}
              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => onNavigate(currentPurpose.primaryTarget)}
                  className="btn-gold-gradient px-5 py-2.5 text-xs font-black shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <span>{currentPurpose.primaryBtnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate(currentPurpose.secondaryTarget)}
                  className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  {currentPurpose.secondaryBtnText}
                </button>
              </div>
            </div>

            {/* 3 Step Action Path */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                👉 आपको क्या करना है? (Your 3-Step Action Plan):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {currentPurpose.steps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 2. WHAT IS IOIS? (IOIS क्या है?) ================= */}
      <div className="glass-card-premium p-6 sm:p-10 border border-amber-500/30 space-y-8 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-1.5 rounded-full text-green-300 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>100% प्रमाणित एवं पारदर्शी डिजिटल मंच</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            <span className="tiranga-text">IOIS (Indian Online Income Supporting System)</span> क्या है?
          </h2>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed text-justify sm:text-center max-w-3xl mx-auto">
            <strong>IOIS</strong> भारत का पहला समर्पित <span className="text-amber-400 font-bold">डिजिटल स्वावलंबन और लर्निंग इकोसिस्टम</span> है। इसका उद्देश्य भारत के प्रत्येक नागरिक—चाहे वह छात्र हो, गृहिणी, युवा या किसान—को डिजिटल रूप से साक्षर, आत्मनिर्भर और आर्थिक रूप से सक्षम बनाना है।
          </p>

          {/* 4 Pillars of IOIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-3">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-lg">
                📚
              </div>
              <h3 className="text-sm font-black text-white">1. डिजिटल ज्ञान व संसाधन</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                500+ NCERT ई-बुक्स, कोडिंग बंडल्स, 10,000+ AI प्रॉम्ट्स व सरकारी परीक्षा नोट्स।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-300 flex items-center justify-center font-bold text-lg">
                💰
              </div>
              <h3 className="text-sm font-black text-white">2. सीधा 70% इंसेंटिव</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                बिना बिचौलिए के प्रति रेफरल ₹7 से ₹699 तक सीधा और पारदर्शी पेआउट।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-lg">
                🏛️
              </div>
              <h3 className="text-sm font-black text-white">3. 100% मुफ्त नागरिक सेवा</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                जाति, आय, निवास, दाखिल खारिज, LPC, instant e-PAN व पेंशन की सटीक गाइड।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg">
                🛡️
              </div>
              <h3 className="text-sm font-black text-white">4. 100% चाइल्ड सेफ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                NCERT मानकों व सख्त आचार संहिता पर आधारित सुरक्षित डिजिटल वातावरण।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. IOIS 7 MASTER PLANS (7 मास्टर प्लान्स की पूरी जानकारी) ================= */}
      <div className="glass-card-premium p-6 sm:p-10 border border-amber-500/40 space-y-8 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-black uppercase">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>70% डायरेक्ट इंसेंटिव मॉडल</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              IOIS के सभी 7 मास्टर प्लांस (Plan Details & Earnings)
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              अपनी पसंद का प्लान चुनें और देखें कि आपको क्या संसाधन व कितनी कमाई होगी:
            </p>
          </div>

          <button
            onClick={() => onNavigate('plans')}
            className="btn-gold-gradient px-5 py-2.5 text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-lg flex-shrink-0"
          >
            <span>सभी 7 प्लांस का ग्रिड खोलें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Plan Selector Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PLANS.map((plan) => {
            const isTab = selectedPlanTab === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanTab(plan.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
                  isTab
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <span>{plan.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isTab ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-amber-400'
                }`}>
                  ₹{plan.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Plan Spotlight Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-amber-400/50 shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="space-y-3 lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-400 text-slate-950">
                {activePlanData.name}
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                70% सीधा इंसेंटिव: ₹{activePlanData.instantPayout}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {activePlanData.tagline}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {activePlanData.description}
            </p>

            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-black text-amber-300 uppercase">
                📦 इसमें क्या-क्या डिजिटल संसाधन मिलते हैं:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {activePlanData.resources.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Join Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold">एकमुश्त प्लान शुल्क</span>
              <div className="text-4xl font-black text-white font-mono">
                ₹{activePlanData.price}
              </div>
              <span className="text-[10px] text-green-400 font-bold">
                प्रति रेफरल पेआउट: ₹{activePlanData.instantPayout}
              </span>
            </div>

            <button
              onClick={() => {
                if (onSelectPlanForRegister) {
                  onSelectPlanForRegister(activePlanData.id);
                } else {
                  onNavigate('register');
                }
              }}
              className="w-full btn-gold-gradient py-3 text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
            >
              यह प्लान अभी रजिस्टर करें
            </button>

            <p className="text-[10px] text-slate-400">
              ✓ 256-Bit SSL सुरक्षित भुगतान • 1-दिन अप्रूवल
            </p>
          </div>
        </div>
      </div>

      {/* ================= 4. WHAT EXISTS ON THIS PORTAL? (इस पोर्टल पर क्या-क्या मौजूद है?) ================= */}
      <div className="glass-card-premium p-6 sm:p-10 border border-slate-800 space-y-6 bg-slate-950">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-black uppercase">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>संपूर्ण पोर्टल गाइड (Complete Portal Directory)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            इस पोर्टल पर क्या-क्या सुविधाएं मौजूद हैं?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            IOIS केवल एक अर्निंग सिस्टम नहीं बल्कि दैनिक जीवन की सभी डिजिटल सुविधाओं का एक संपूर्ण केंद्र है:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {portalServicesList.map((srv, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition space-y-1.5">
              <h3 className="text-sm font-black text-white text-amber-300">{srv.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 5. FREQUENTLY ASKED QUESTIONS (अक्सर पूछे जाने वाले सवाल) ================= */}
      <div className="glass-card-premium p-6 sm:p-10 border border-slate-800 space-y-6 bg-slate-950">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-black uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>IOIS सवाल एवं समाधान</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            IOIS से जुड़े मुख्य सवाल और उनके सटीक जवाब
          </h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-black text-white hover:text-amber-300 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center flex-shrink-0">
                      Q
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {onOpenAiChat && (
          <div className="text-center pt-2">
            <button
              onClick={onOpenAiChat}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-850 border border-amber-500/40 text-amber-300 text-xs font-bold transition cursor-pointer shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>कोई अन्य प्रश्न है? IOIS AI चैटबॉट से तुरंत पूछें</span>
            </button>
          </div>
        )}
      </div>

    </section>
  );
};
