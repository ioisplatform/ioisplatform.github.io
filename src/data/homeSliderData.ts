export interface HomeSliderItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: 'savings' | 'festival' | 'plan' | 'mission';
  description: string;
  festivalName?: string;
  bgGradient: string;
  badgeText: string;
  badgeColor: string;
  iconName: 'Sparkles' | 'Coins' | 'Flame' | 'Sun' | 'Heart' | 'GraduationCap' | 'ShieldCheck';
  ctaText: string;
  ctaAction: 'plans' | 'register' | 'idcard' | 'rtps-services';
  ctaPlanId?: number;
  highlightText: string;
  active: boolean;
  order: number;
}

export const INITIAL_SLIDES: HomeSliderItem[] = [
  {
    id: 'slide-01-smart-savings',
    title: 'लोग यहाँ-वहाँ फालतू खर्चा करते हैं — IOIS में सही उपयोग से स्वावलंबी बनें!',
    subtitle: 'मात्र ₹10 से ₹49 की छोटी सी बचत से शुरू करें अपना सुरक्षित डिजिटल भविष्य।',
    tag: '💡 समझदार बचत व आत्मनिर्भर भारत',
    category: 'savings',
    description: 'बाजार के अनावश्यक खर्चों को रोकें। IOIS में एक बार मात्र ₹10 से ₹49 लगाकर आपको मिलता है डिजिटल ID कार्ड, NCERT नोट्स, सरकारी योजना गाइड और प्रत्येक रेफरल पर 50% से 70% तुरंत UPI पेआउट।',
    bgGradient: 'from-amber-600/30 via-slate-950 to-emerald-600/30',
    badgeText: 'स्मार्ट बचत से सीधी कमाई',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    iconName: 'Coins',
    ctaText: 'मात्र ₹10 से शुरुआत करें (Plan 01)',
    ctaAction: 'register',
    ctaPlanId: 1,
    highlightText: '50% से 70% दैनिक इंसेंटिव',
    active: true,
    order: 1
  },
  {
    id: 'slide-02-dhanteras',
    title: '✨ धनतेरस महापर्व की हार्दिक शुभकामनाएं ✨',
    subtitle: 'भगवान धन्वंतरि व मां महालक्ष्मी आपके जीवन में सुख, समृद्धि और अखंड धन-धान्य का वरदान दें।',
    tag: '🪙 शुभ धनतेरस 2026',
    category: 'festival',
    festivalName: 'Dhanteras',
    description: 'सोने-चांदी सी चमक और आर्थिक स्वावलंबन के साथ मनाएं धनतेरस। IOIS परिवार की ओर से देश के सभी सदस्यों, विद्यार्थियों और परिवारों को पावन धनतेरस की अनंत मंगलकामनाएं।',
    bgGradient: 'from-amber-500/35 via-yellow-950/40 to-slate-950',
    badgeText: 'धन व आरोग्य समृद्धि 🌟',
    badgeColor: 'bg-amber-500/25 text-amber-300 border-amber-400',
    iconName: 'Sparkles',
    ctaText: 'धनतेरस स्पेशल प्लान देखें ➔',
    ctaAction: 'plans',
    ctaPlanId: 3,
    highlightText: 'शुभ महालक्ष्मी कृपा',
    active: true,
    order: 2
  },
  {
    id: 'slide-03-diwali',
    title: '🪔 शुभ दीपावली — हर घर ज्ञान का दीप, हर हाथ स्वावलंबन 🪔',
    subtitle: 'अंधकार पर प्रकाश की विजय — अपने परिवार को दें डिजिटल शिक्षा, पहचान व सम्मान।',
    tag: '🎆 प्रकाशोत्सव महालक्ष्मी पर्व',
    category: 'festival',
    festivalName: 'Diwali',
    description: 'इस पावन दीपावली पर सिर्फ पटाखों में पैसे न जलाएं, अपने बच्चों और मित्रों को दें IOIS डिजिटल ID कार्ड और वेरिफिकेशन पास, ताकि वे आत्मनिर्भर भारत के सशक्त भागीदार बन सकें।',
    bgGradient: 'from-red-600/30 via-amber-600/20 to-slate-950',
    badgeText: 'दीपावली महालक्ष्मी उत्सव 🪔',
    badgeColor: 'bg-orange-500/25 text-amber-200 border-orange-400',
    iconName: 'Flame',
    ctaText: 'दिवाली स्पेशल 7 प्लान्स देखें',
    ctaAction: 'plans',
    ctaPlanId: 7,
    highlightText: 'घर-घर शिक्षा व उजाला',
    active: true,
    order: 3
  },
  {
    id: 'slide-04-govardhan',
    title: '🌾 गोवर्धन पूजा व अन्नकूट महापर्व की हार्दिक बधाई 🌾',
    subtitle: 'प्रकृति प्रेम, गोधन संवर्धन और स्वावलंबी ग्रामीण भारत का पावन संकल्प।',
    tag: '🐄 गोवर्धन पूजा व अन्नकूट 2026',
    category: 'festival',
    festivalName: 'Govardhan Puja',
    description: 'भगवान श्रीकृष्ण द्वारा गोवर्धन पर्वत धारण कर प्रकृति रक्षा का संदेश हमें आत्मनिर्भरता और एकता सिखाता है। IOIS से जुड़कर अपने गांव और समाज को डिजिटल बनाएं।',
    bgGradient: 'from-emerald-600/30 via-green-950/40 to-slate-950',
    badgeText: 'प्रकृति व स्वावलंबन वंदन 🌿',
    badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400',
    iconName: 'Sun',
    ctaText: 'ज्वाइन करें / Register Now',
    ctaAction: 'register',
    ctaPlanId: 2,
    highlightText: 'प्रकृति रक्षा व आत्मनिर्भरता',
    active: true,
    order: 4
  },
  {
    id: 'slide-05-bhaidooj',
    title: '🌸 भाई दूज महापर्व — भाई-बहन के अटूट स्नेह का उत्सव 🌸',
    subtitle: 'बहन को दें स्वावलंबन का उपहार, भाई को मिले डिजिटल पहचान और उज्ज्वल भविष्य का आशीर्वाद।',
    tag: '🤝 भाई-बहन का पावन स्नेह',
    category: 'festival',
    festivalName: 'Bhai Dooj',
    description: 'इस भाई दूज पर पारंपरिक मिठाई के साथ अपनी बहन या भाई को उपहार में दें IOIS डिजिटल ID कार्ड व अर्निंग पास, जिससे वे पढ़ाई के साथ-साथ सम्मानपूर्वक आत्मनिर्भर बन सकें।',
    bgGradient: 'from-pink-600/30 via-rose-950/40 to-slate-950',
    badgeText: 'स्नेह, सुरक्षा व सम्मान 💖',
    badgeColor: 'bg-pink-500/25 text-pink-300 border-pink-400',
    iconName: 'Heart',
    ctaText: 'गिफ्ट डिजिटल ID कार्ड',
    ctaAction: 'idcard',
    highlightText: 'सदा सलामत रहे यह प्यार',
    active: true,
    order: 5
  },
  {
    id: 'slide-06-chhath',
    title: '☀️ लोक आस्था का महापर्व छठ पूजा — नहाय-खाय से उषा अर्घ्य तक ☀️',
    subtitle: 'भगवान सूर्य देव व छठी मैया की असीम अनुकंपा से आपका जीवन मंगलमय, निरोगी और समृद्ध हो।',
    tag: '🙏 जय छठी मैया 2026',
    category: 'festival',
    festivalName: 'Chhath Puja',
    description: 'पवित्रता, कठोर साधना, स्वच्छता और सामाजिक समरसता का विश्वविख्यात महापर्व छठ। IOIS परिवार देश और दुनिया के सभी व्रतियों और श्रद्धालुओं के चरणों में श्रद्धापूर्वक नमन करता है।',
    bgGradient: 'from-orange-600/35 via-amber-950/40 to-slate-950',
    badgeText: 'सूर्य देव व छठी मैया कृपा ☀️',
    badgeColor: 'bg-orange-500/25 text-amber-200 border-orange-400',
    iconName: 'Sun',
    ctaText: 'छठ पूजा विशेष ऑफर देखें',
    ctaAction: 'plans',
    ctaPlanId: 6,
    highlightText: 'उगते व अस्ताचल सूर्य को अर्घ्य',
    active: true,
    order: 6
  },
  {
    id: 'slide-07-mission',
    title: '🇮🇳 राष्ट्रीय युवा व छात्र स्वावलंबन मिशन 2026-27 🇮🇳',
    subtitle: 'Class 1 से 12 तक NCERT नोट्स, सरकारी RTPS सेवाएं व सीधा 50% से 70% पेआउट।',
    tag: '🚀 विकसित भारत स्वावलंबन मिशन',
    category: 'mission',
    description: 'बिना किसी धोखाधड़ी या मासिक शुल्क के देश का सबसे विश्वसनीय डिजिटल सहयोग प्लेटफॉर्म। एक क्लिक में अपना ID कार्ड पाएं और सुरक्षित रूप से अपनी आय शुरू करें।',
    bgGradient: 'from-blue-600/30 via-slate-950 to-amber-600/30',
    badgeText: '100% पारदर्शी व सुरक्षित 🛡️',
    badgeColor: 'bg-blue-500/25 text-sky-300 border-blue-400',
    iconName: 'ShieldCheck',
    ctaText: 'अभी सदस्य बनें ➔',
    ctaAction: 'register',
    ctaPlanId: 1,
    highlightText: 'डिजिटल भारत का आधार',
    active: true,
    order: 7
  }
];

export const DEFAULT_HOME_SLIDERS: HomeSliderItem[] = INITIAL_SLIDES;

const STORAGE_SLIDERS_KEY = 'iois_home_sliders_v2';

export const getStoredSliders = (): HomeSliderItem[] => {
  if (typeof window === 'undefined') return INITIAL_SLIDES;
  try {
    const raw = localStorage.getItem(STORAGE_SLIDERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SLIDERS_KEY, JSON.stringify(INITIAL_SLIDES));
      return INITIAL_SLIDES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SLIDES;
  } catch {
    return INITIAL_SLIDES;
  }
};

export const saveStoredSliders = (slides: HomeSliderItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_SLIDERS_KEY, JSON.stringify(slides));
    window.dispatchEvent(new Event('iois_sliders_updated'));
  } catch {}
};
