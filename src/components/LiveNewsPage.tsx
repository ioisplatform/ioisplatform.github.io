import React, { useState, useEffect } from 'react';
import { 
  LIVE_NEWS_CHANNELS, 
  LIVE_NEWS_ARTICLES, 
  E_NEWSPAPERS_LIST,
  fetchLiveNewsArticles 
} from '../services/liveUtilityService';
import { NewsChannel, NewsArticle, PageType, TickerSpeed, UserProfile } from '../types';
import { 
  Tv, 
  Radio as RadioIcon, 
  Newspaper, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Flame, 
  BookOpen, 
  Filter, 
  Share2, 
  Play, 
  Pause,
  CheckCircle2, 
  Globe, 
  RefreshCw, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Crown, 
  Calculator, 
  Volume2, 
  VolumeX,
  X,
  UserCheck,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  Award
} from 'lucide-react';
import { PLANS } from '../data/plansData';

const DEFAULT_IOIS_NEWS_VIDEO = {
  title: 'IOIS स्पेशल लाइव वीडियो व न्यूज़ गाइड (Official Broadcast)',
  videoUrl: 'https://youtu.be/bcjXgHGTBDQ?si=WdpPFXl_6yVy6CVM',
  embedUrl: 'https://www.youtube-nocookie.com/embed/bcjXgHGTBDQ?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3'
};

// 7 Master Plans In-Depth Analysis Data (Synced with Official plansData.ts)
const PLANS_IN_DEPTH_ANALYSIS = [
  {
    planId: 1,
    name: 'Plan 01 — Bal Vikas Access (शुरुआती छात्र व वेरिफिकेशन पास)',
    cost: '₹10',
    incentiveRate: '70%',
    incentiveAmount: '₹7.00',
    validity: '30 दिन',
    targetAudience: 'स्कूल छात्र, अभिभावक और नए उपयोगकर्ता जो बिना जोखिम IOIS सिस्टम को लाइव समझना चाहते हैं।',
    includedBenefits: [
      'तुरंत वेरिफाइड डिजिटल ID कार्ड व व्यक्तिगत स्पॉन्सर डैशबोर्ड',
      'Class 1-5 NCERT डिजिटल PDFs व इंटरएक्टिव प्रैक्टिस वर्कशीट्स',
      'हर सफल रेफरल पर सीधा 70% (₹7) का तुरंत UPI पेआउट',
    ],
    calculationExample: {
      referrals: '10 मित्र / छात्र',
      calculation: '10 × ₹7.00 = ₹70.00 (तुरंत कमाई)',
      monthlyPotential: '₹2,100 / माह (प्रतिदिन 10 रेफरल पर)',
    },
    badgeColor: 'border-amber-400 bg-amber-500/10 text-amber-300',
  },
  {
    planId: 2,
    name: 'Plan 02 — Youth Skill Access (युवा कौशल व जॉब टूल्स)',
    cost: '₹49',
    incentiveRate: '70%',
    incentiveAmount: '₹34.00',
    validity: '45 दिन',
    targetAudience: 'कॉलेज फ्रेशर्स, नौकरी खोजने वाले युवा और फ्रीलांसिंग शुरू करने वाले छात्र।',
    includedBenefits: [
      'ATS-फ्रेंडली प्रोफेशनल Resume / CV टेम्प्लेट्स व जॉब लेटर फॉर्मेट्स',
      'क्यूरेटेड AI Prompt Engineering गाइड व इंटरव्यू चेकलिस्ट',
      'हर सफल रेफरल पर सीधा 70% (₹34) का इंस्टेंट पेआउट',
    ],
    calculationExample: {
      referrals: '10 सहपाठी / युवा',
      calculation: '10 × ₹34.00 = ₹340.00 (उसी दिन कमाई)',
      monthlyPotential: '₹10,200 / माह (प्रतिदिन 10 रेफरल पर)',
    },
    badgeColor: 'border-sky-400 bg-sky-500/10 text-sky-300',
  },
  {
    planId: 3,
    name: 'Plan 03 — Career & Job Access (करियर व बोर्ड परीक्षा मास्टरी)',
    cost: '₹99',
    incentiveRate: '65%',
    incentiveAmount: '₹64.00',
    validity: '90 दिन',
    targetAudience: 'कक्षा 6 से 12 तक के छात्र, ट्यूशन शिक्षक और सरकारी/प्राइवेट एग्जाम आकांक्षी।',
    includedBenefits: [
      'Class 6-12 की संपूर्ण डिजिटल किताबें, नोट्स व अध्यायवार समाधान',
      'स्ट्रीम चयन, सॉफ्ट स्किल्स और सरकारी-प्राइवेट परीक्षा कैलेंडर',
      'हर सफल रेफरल पर सीधा 65% (₹64) का UPI पेआउट',
    ],
    calculationExample: {
      referrals: '20 छात्र / मित्र',
      calculation: '20 × ₹64.00 = ₹1,280.00 (सीधा बैंक क्रेडिट)',
      monthlyPotential: '₹19,200 / माह (प्रतिदिन 10 रेफरल पर)',
    },
    badgeColor: 'border-indigo-400 bg-indigo-500/10 text-indigo-300',
  },
  {
    planId: 4,
    name: 'Plan 04 — Family VIP Access (पारिवारिक सुरक्षा व अभिभावक हब)',
    cost: '₹199',
    incentiveRate: '60%',
    incentiveAmount: '₹119.00',
    validity: '180 दिन (6 माह)',
    targetAudience: 'माता-पिता, गृहणियां और जागरूक परिवार जो साइबर सुरक्षा व स्मार्ट बजट चाहते हैं।',
    includedBenefits: [
      'बच्चों के सुरक्षित इंटरनेट व स्क्रीन कंट्रोल के लिए डिजिटल पेरेंटिंग किट',
      'ऑनलाइन फ्रॉड से बचाव गाइड, फैमिली हेल्थ/योग और घरेलू बजट टेम्प्लेट्स',
      'हर सफल रेफरल पर सीधा 60% (₹119) का इंस्टेंट पेआउट',
    ],
    calculationExample: {
      referrals: '5 परिवार / संपर्क',
      calculation: '5 × ₹119.00 = ₹595.00',
      monthlyPotential: '₹17,850 / माह (प्रतिदिन 5 रेफरल पर)',
    },
    badgeColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
  },
  {
    planId: 5,
    name: 'Plan 05 — Student Elite Access (प्रतियोगी परीक्षा स्पेशल)',
    cost: '₹299',
    incentiveRate: '60%',
    incentiveAmount: '₹179.00',
    validity: '180 दिन (6 माह)',
    targetAudience: 'SSC, रेलवे, बैंकिंग, पुलिस व राज्य स्तरीय प्रतियोगी परीक्षाओं की तैयारी करने वाले अभ्यर्थी।',
    includedBenefits: [
      'SSC/Railway/Banking/Police परीक्षा नोट्स व स्पीड मैथ-रीजनिंग शॉर्टकट्स',
      'दैनिक करंट अफेयर्स, स्टैटिक GK संग्रह और डाउट-क्लियरिंग स्टडी सर्कल',
      'हर सफल रेफरल पर सीधा 60% (₹179) का इंस्टेंट पेआउट',
    ],
    calculationExample: {
      referrals: '10 कोचिंग साथी',
      calculation: '10 × ₹179.00 = ₹1,790.00',
      monthlyPotential: '₹26,850 / माह (प्रतिदिन 5 रेफरल पर)',
    },
    badgeColor: 'border-purple-400 bg-purple-500/15 text-purple-300',
  },
  {
    planId: 6,
    name: 'Plan 06 — Agency Reseller Hub (डिजिटल बिजनेस व ऑटोमेशन)',
    cost: '₹499',
    incentiveRate: '55%',
    incentiveAmount: '₹274.00',
    validity: '365 दिन (1 वर्ष)',
    targetAudience: 'CSC/साइबर कैफे संचालक, डिजिटल मार्केटर और घर बैठे डिजिटल रीसेलिंग एजेंसी चलाने वाले।',
    includedBenefits: [
      'डिजिटल रीसेलिंग लाइसेंस, मास्टर ब्रांडिंग किट व लैंडिंग पेज फ्रेमवर्क',
      'WhatsApp ऑटोमेशन स्क्रिप्ट्स, मैसेज टेम्प्लेट्स व सोशल मीडिया ग्रोथ किट',
      'हर सफल रेफरल पर सीधा 55% (₹274) का बम्पर पेआउट',
    ],
    calculationExample: {
      referrals: '20 क्लाइंट्स / सदस्य',
      calculation: '20 × ₹274.00 = ₹5,480.00',
      monthlyPotential: '₹41,100 / माह (प्रतिदिन 5 रेफरल पर)',
    },
    badgeColor: 'border-yellow-400 bg-yellow-500/15 text-yellow-300',
  },
  {
    planId: 7,
    name: 'Plan 07 — Lifetime Master Access (आजीवन वीआईपी मास्टर एक्सेस)',
    cost: '₹999',
    incentiveRate: '50%',
    incentiveAmount: '₹499.00',
    validity: 'आजीवन (Lifetime Access)',
    targetAudience: 'कम्युनिटी लीडर्स, फुल-टाइम प्रमोटर्स और सभी 7 प्लान्स का आजीवन लाभ लेने वाले सदस्य।',
    includedBenefits: [
      'सभी 6 निचले प्लान्स का पूरा एक्सेस + भविष्य के सभी कोर्स आजीवन फ्री',
      'डायरेक्ट VIP मेंटरशिप, मास्टर रीसेलर लाइसेंस व प्रायोरिटी वेरिफिकेशन',
      'हर सफल रेफरल पर सर्वोच्च ₹499 (50%) का सीधा इंस्टेंट पेआउट',
    ],
    calculationExample: {
      referrals: '20 विजनरी सदस्य',
      calculation: '20 × ₹499.00 = ₹9,980.00',
      monthlyPotential: '₹74,850 / माह (प्रतिदिन 5 रेफरल पर)',
    },
    badgeColor: 'border-amber-300 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200',
  },
];

interface LiveNewsPageProps {
  onNavigate?: (page: PageType) => void;
  onOpenRegister?: (planId?: number) => void;
  onOpenAiChat?: () => void;
  currentUser?: UserProfile | null;
  onOpenSponsorAddMember?: (planId?: number) => void;
}

export const LiveNewsPage: React.FC<LiveNewsPageProps> = ({
  onNavigate,
  onOpenRegister,
  onOpenAiChat,
  currentUser,
  onOpenSponsorAddMember,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<NewsChannel>(LIVE_NEWS_CHANNELS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'iois-overview' | 'tv' | 'headlines' | 'epaper' | 'radio'>('iois-overview');
  const [playerKey, setPlayerKey] = useState<number>(0);
  const [customStreamUrl, setCustomStreamUrl] = useState<string>('');
  const [activeCustomUrl, setActiveCustomUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // News ticker scrolling speed mechanism (Default: 'slow' as explicitly requested)
  const [tickerSpeed, setTickerSpeed] = useState<TickerSpeed>('slow');
  const [isTickerHovered, setIsTickerHovered] = useState<boolean>(false);

  // Article Reader Modal State
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // In-App IOIS Chrome Browser State for Live News & Newspapers
  const [browserUrl, setBrowserUrl] = useState<string>('https://www.youtube.com/results?search_query=aaj+tak+live+news+hindi');
  const [browserTitle, setBrowserTitle] = useState<string>('Aaj Tak Live News (YouTube Live Search)');
  const [browserSearchInput, setBrowserSearchInput] = useState<string>('');
  const [browserKey, setBrowserKey] = useState<number>(0);

  const reloadPlayer = () => {
    setPlayerKey((k) => k + 1);
  };

  const handleChannelSelect = (ch: NewsChannel) => {
    setSelectedChannel(ch);
    const query = encodeURIComponent(`${ch.name.split('(')[0].trim()} live news hindi`);
    const ytSearchUrl = `https://www.youtube.com/results?search_query=${query}`;
    setBrowserUrl(ytSearchUrl);
    setBrowserTitle(`${ch.name} - YouTube Live Stream Search`);
    setBrowserSearchInput(ytSearchUrl);
    setBrowserKey((k) => k + 1);
  };

  const handleOpenEpaperInBrowser = (paper: typeof E_NEWSPAPERS_LIST[0]) => {
    setBrowserUrl(paper.epaperUrl);
    setBrowserTitle(`${paper.name} - डिजिटल ई-पेपर (E-Paper)`);
    setBrowserSearchInput(paper.epaperUrl);
    setActiveTab('tv');
    setBrowserKey((k) => k + 1);
  };

  const handleCustomBrowserNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!browserSearchInput.trim()) return;
    let url = browserSearchInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    setBrowserUrl(url);
    setBrowserTitle('IOIS Chrome Browser View');
    setBrowserKey((k) => k + 1);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStreamUrl.trim()) return;

    let parsed = customStreamUrl.trim();
    if (parsed.includes('youtube.com/watch?v=')) {
      const vid = parsed.split('watch?v=')[1]?.split('&')[0];
      parsed = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=0`;
    } else if (parsed.includes('youtu.be/')) {
      const vid = parsed.split('youtu.be/')[1]?.split('?')[0];
      parsed = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=0`;
    } else if (parsed.includes('youtube.com/live/')) {
      const vid = parsed.split('live/')[1]?.split('?')[0];
      parsed = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=0`;
    }

    setActiveCustomUrl(parsed);
    setPlayerKey((k) => k + 1);
  };

  // Live Real-Time News API State
  const [articlesList, setArticlesList] = useState<NewsArticle[]>(LIVE_NEWS_ARTICLES);
  const [isLiveApiConnected, setIsLiveApiConnected] = useState<boolean>(false);
  const [isRefreshingNews, setIsRefreshingNews] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('अभी सक्रिय');

  const loadRealTimeNews = async () => {
    setIsRefreshingNews(true);
    try {
      const fresh = await fetchLiveNewsArticles();
      if (fresh && fresh.length > 0) {
        setArticlesList(fresh);
        setIsLiveApiConnected(true);
        setLastRefreshedAt(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      }
    } catch {
      // Fallback
    } finally {
      setIsRefreshingNews(false);
    }
  };

  useEffect(() => {
    loadRealTimeNews();
    const interval = setInterval(loadRealTimeNews, 60000); // 1-minute real-time polling
    return () => clearInterval(interval);
  }, []);

  const currentEmbedSource = activeCustomUrl || DEFAULT_IOIS_NEWS_VIDEO.embedUrl;

  const filteredArticles = articlesList.filter(a => {
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'सभी ताजा खबरें (All)' },
    { id: 'national', label: '🇮🇳 राष्ट्रीय (National)' },
    { id: 'kisan', label: '🌾 कृषि व मंडी (Kisan)' },
    { id: 'jobs', label: '🎓 नौकरी व शिक्षा (Jobs)' },
    { id: 'business', label: '💰 व्यापार व सोना-चांदी' },
    { id: 'tech', label: '⚡ टेक व डिजिटल' },
  ];

  // Speech synthesis reader for news articles
  const toggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Stop speech when closing modal
  useEffect(() => {
    if (!activeArticle && isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [activeArticle, isSpeaking]);

  // Determine ticker class based on speed state (default calm 'slow' speed)
  const getTickerClass = () => {
    const base =
      tickerSpeed === 'ultra_slow'
        ? 'ticker-track-ultra-slow'
        : tickerSpeed === 'normal'
          ? 'ticker-track-normal'
          : tickerSpeed === 'fast'
            ? 'ticker-track-fast'
            : 'ticker-track-slow';

    if (tickerSpeed === 'paused' || isTickerHovered) {
      return `${base} ticker-paused`;
    }
    return base;
  };

  const activeSpeedDescription =
    tickerSpeed === 'paused'
      ? 'रुका हुआ'
      : isTickerHovered
        ? 'पढ़ने हेतु रुका हुआ'
        : tickerSpeed === 'ultra_slow'
          ? 'अति-धीमी आरामदायक गति'
          : tickerSpeed === 'slow'
            ? 'धीमी गति (पढ़ने में आसान)'
            : tickerSpeed === 'normal'
              ? 'सामान्य गति'
              : 'तेज़ गति';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* ========================================================================= */}
      {/* 1. TOP INTERACTIVE LIVE NEWS TICKER WITH INTUITIVE SPEED CONTROLS         */}
      {/*    (DEFAULT: SLOW / धीमी गति - COMFORTABLE & UNHURRIED READING)           */}
      {/* ========================================================================= */}
      <div className="rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Clean Editorial Speed Controller Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-5 py-2.5 bg-slate-900/95 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex h-2 w-2 relative shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-bold text-white text-xs sm:text-sm tracking-tight">
              लाइव न्यूज़ फ़ीड
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · {isLiveApiConnected ? 'लाइव अपडेट सक्रिय' : 'ताज़ा बुलेटिन'} · {activeSpeedDescription}
            </span>
            <button
              type="button"
              onClick={loadRealTimeNews}
              disabled={isRefreshingNews}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer text-[11px] font-medium flex items-center gap-1.5 border border-slate-700"
              title="ताज़ा समाचार रीफ़्रेश करें"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingNews ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">रीफ़्रेश ({lastRefreshedAt})</span>
            </button>
          </div>

          {/* Intuitive Self-Explanatory Speed Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setTickerSpeed(tickerSpeed === 'paused' ? 'slow' : 'paused')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                tickerSpeed === 'paused' || isTickerHovered
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              title="समाचार टिकर रोकें या चलाएं"
            >
              {tickerSpeed === 'paused' ? <Play className="w-3 h-3 fill-slate-950" /> : <Pause className="w-3 h-3" />}
              <span>{tickerSpeed === 'paused' ? 'चलाएं' : 'रोकें'}</span>
            </button>

            <div
              role="group"
              aria-label="स्क्रॉल गति चुनें"
              className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]"
            >
              <button
                type="button"
                onClick={() => setTickerSpeed('ultra_slow')}
                className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer whitespace-nowrap ${
                  tickerSpeed === 'ultra_slow'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="अति-धीमी गति — आराम से एक-एक शब्द पढ़ें"
              >
                बहुत धीमी
              </button>

              <button
                type="button"
                onClick={() => setTickerSpeed('slow')}
                className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer whitespace-nowrap ${
                  tickerSpeed === 'slow'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="धीमी और संतुलित गति (डिफ़ॉल्ट)"
              >
                धीमी
              </button>

              <button
                type="button"
                onClick={() => setTickerSpeed('normal')}
                className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer whitespace-nowrap ${
                  tickerSpeed === 'normal'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="सामान्य स्क्रॉल गति"
              >
                सामान्य
              </button>

              <button
                type="button"
                onClick={() => setTickerSpeed('fast')}
                className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer whitespace-nowrap ${
                  tickerSpeed === 'fast'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="तेज़ गति"
              >
                तेज़
              </button>
            </div>
          </div>
        </div>

        {/* Controlled-Speed Marquee Track (Automatically Pauses on Hover or Touch) */}
        <div 
          className="relative overflow-hidden py-3 bg-[#020617] select-none"
          onMouseEnter={() => setIsTickerHovered(true)}
          onMouseLeave={() => setIsTickerHovered(false)}
          onTouchStart={() => setIsTickerHovered(true)}
          onTouchEnd={() => setIsTickerHovered(false)}
        >
          <div className={getTickerClass()}>
            {[...articlesList, ...articlesList].map((art, idx) => (
              <button
                type="button"
                key={`${art.id}-${idx}`}
                onClick={() => setActiveArticle(art)}
                className="inline-flex items-center gap-2.5 mx-3 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/70 hover:bg-slate-800/90 transition text-left cursor-pointer group shrink-0"
              >
                <span className="text-amber-400 font-semibold text-xs shrink-0">{art.source}</span>
                <span className="text-slate-600 shrink-0" aria-hidden="true">·</span>
                <span className="text-slate-100 text-xs sm:text-[13px] font-medium group-hover:text-amber-200 transition">
                  {art.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono tabular-nums shrink-0">{art.time}</span>
                <span className="text-[11px] text-amber-400 font-semibold ml-1 group-hover:underline shrink-0">
                  पूरा पढ़ें →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER & TAB SWITCHER                                             */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>IOIS डिजिटल सूचना, 7 योजनाएं व समाचार केंद्र</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              IOIS मंच परिचय, 7 योजनाएं व 24x7 समाचार
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              IOIS कैसे काम करता है, 7 योजनाओं का विश्लेषण उदाहरण सहित समझें, लाइव न्यूज़ टीवी देखें व राष्ट्रीय ई-अखबार मुफ्त पढ़ें।
            </p>
          </div>

          {/* Navigation Tab Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('iois-overview')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'iois-overview'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>IOIS परिचय व 7 योजनाएं</span>
            </button>

            <button
              onClick={() => setActiveTab('tv')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tv'
                  ? 'bg-rose-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>लाइव टीवी</span>
            </button>

            <button
              onClick={() => setActiveTab('headlines')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'headlines'
                  ? 'bg-blue-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>ताजा हेडलाइन्स</span>
            </button>

            <button
              onClick={() => setActiveTab('epaper')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'epaper'
                  ? 'bg-emerald-500 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>ई-अखबार</span>
            </button>

            <button
              onClick={() => setActiveTab('radio')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'radio'
                  ? 'bg-indigo-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RadioIcon className="w-4 h-4" />
              <span>रेडियो</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: IOIS PLATFORM OVERVIEW & 7 MASTER PLANS ANALYSIS WITH EXAMPLES  */}
      {/* ========================================================================= */}
      {activeTab === 'iois-overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Platform Introduction Banner */}
          <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/20 border border-amber-500/30 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% पारदर्शी, सुरक्षित डिजिटल लर्निंग व सपोर्टिंग इकोसिस्टम</span>
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-white text-balance">
                  IOIS (Indian Online Income Supporting System) क्या है और कैसे काम करता है?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  IOIS एक डिजिटल शिक्षा, स्किल विकास और रेफरल सपोर्ट प्लेटफॉर्म है। कोई भी नया उपयोगकर्ता मात्र ₹10 से ₹999 के 7 प्लान्स में से एक चुनकर अध्ययन सामग्री व डिजिटल ID कार्ड प्राप्त कर सकता है, और दूसरों को जोड़ने पर <strong className="text-amber-300">50% से 70% तक सीधा UPI इंसेंटिव</strong> पा सकता है।
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onOpenAiChat && (
                  <button
                    type="button"
                    onClick={onOpenAiChat}
                    className="btn-3d-gold px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>कोई सवाल पूछें (Free AI)</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black tabular-nums">
                  1
                </div>
                <h4 className="text-sm font-black text-white">सीधा 50% से 70% इंसेंटिव</h4>
                <p className="text-slate-300 leading-relaxed">
                  Plan 01 (₹10) व Plan 02 (₹49) पर 70%, Plan 03 (₹99) पर 65%, Plan 04–05 पर 60%, Plan 06 पर 55% और Plan 07 (₹999) पर 50% (₹499) सीधा पेआउट आपके UPI खाते में मिलता है।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-black tabular-nums">
                  2
                </div>
                <h4 className="text-sm font-black text-white">डिजिटल शिक्षा, जॉब व AI संसाधन</h4>
                <p className="text-slate-300 leading-relaxed">
                  Class 1 से 12 NCERT नोट्स, रिज्यूमे टेम्प्लेट्स, AI प्रॉम्ट्स, प्रतियोगी परीक्षा नोट्स, RTPS नागरिक सेवा गाइड और एजेंसी ऑटोमेशन टूल्स तुरंत अनलॉक होते हैं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black tabular-nums">
                  3
                </div>
                <h4 className="text-sm font-black text-white">वेरिफाइड डिजिटल ID कार्ड व नेटवर्क</h4>
                <p className="text-slate-300 leading-relaxed">
                  हर सदस्य को 256-Bit सुरक्षित डिजिटल पहचान पत्र, प्राइवेसी नियंत्रण, IOIS CHAT &amp; HELP नेटवर्क और पारदर्शी अर्निंग डैशबोर्ड मिलता है।
                </p>
              </div>
            </div>
          </section>

          {/* 7 Plans In-Depth Analysis Grid with Concrete Mathematical Examples */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>सभी 7 योजनाओं का सम्पूर्ण विश्लेषण, लाभ व उपयोग उदाहरण</span>
                </h3>
                <p className="text-xs text-slate-400">
                  हर प्लान की कीमत, वैधता, इंसेंटिव प्रतिशत, शामिल संसाधन और वास्तविक उपयोग का उदाहरण समझें:
                </p>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('plans')}
                  className="btn-3d-silver px-4 py-2 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-md"
                >
                  <span>तुलना टूल खोलें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PLANS_IN_DEPTH_ANALYSIS.map((p) => (
                <div
                  key={p.planId}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 transition flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-3">
                    {/* Header with clean unboxed metadata & tabular figures */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-amber-300 tabular-nums">
                          <span>{p.cost}</span>
                          <span className="mx-1.5 text-slate-600" aria-hidden="true">·</span>
                          <span className="text-slate-300">{p.validity}</span>
                        </div>
                        <h4 className="text-base font-black text-white leading-snug">{p.name}</h4>
                      </div>
                      <div className="text-right shrink-0 tabular-nums">
                        <span className="text-lg sm:text-xl font-black text-amber-400">{p.incentiveRate}</span>
                        <span className="text-[11px] text-emerald-400 block font-bold">{p.incentiveAmount}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-amber-400 block mb-0.5">किसके लिए उपयुक्त (Use Case):</strong>
                      {p.targetAudience}
                    </p>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-1 text-xs text-slate-300">
                      {p.includedBenefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* Practical Math Example */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-1.5 tabular-nums">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                        <span>उदाहरण (Example)</span>
                        <span>{p.calculationExample.referrals}</span>
                      </div>
                      <div className="text-xs font-mono font-bold text-white">
                        {p.calculationExample.calculation}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-bold border-t border-slate-800 pt-1">
                        अनुमानित मासिक: {p.calculationExample.monthlyPotential}
                      </div>
                    </div>
                  </div>

                  {/* Register / Sponsor Add Member Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (currentUser) {
                          if (onOpenSponsorAddMember) onOpenSponsorAddMember(p.planId);
                          else if (onNavigate) onNavigate('dashboard');
                        } else {
                          if (onOpenRegister) onOpenRegister(p.planId);
                          else if (onNavigate) onNavigate('plans');
                        }
                      }}
                      className="w-full btn-3d-gold py-2.5 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>{currentUser ? `अपने स्पॉन्सर से जोड़ें (${p.cost})` : `यह प्लान चुनें (${p.cost})`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ / Doubt Resolution Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>नए उपयोगकर्ताओं के लिए अक्सर पूछे जाने वाले प्रश्न (FAQ)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">प्र: क्या इंसेंटिव तुरंत मिलता है?</strong>
                <p className="text-slate-400">
                  उत्तर: हां, जब भी आपके रेफरल लिंक या स्पॉन्सर आईडी से कोई नया सदस्य जुड़ता है और उनका पेमेंट एडमिन द्वारा सत्यापित होता है, इंसेंटिव सीधे आपके प्रोफाइल वॉलेट व UPI में क्रेडिट होता है।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">प्र: क्या मैं कभी भी प्लान अपग्रेड कर सकता हूँ?</strong>
                <p className="text-slate-400">
                  उत्तर: बिल्कुल! आप कम कीमत वाले प्लान (जैसे ₹10 या ₹50) से शुरू करके अपनी सुविधानुसार कभी भी उच्च प्लान (जैसे ₹499 या ₹999) में अपग्रेड कर सकते हैं।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: LIVE TV STREAMING PLAYER WITH CHROME BROWSER                     */}
      {/* ========================================================================= */}
      {activeTab === 'tv' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left/Main: Video Player Container */}
            <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl space-y-4">
              
              {/* Channel Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {activeCustomUrl ? 'कस्टम लाइव स्ट्रीम (Custom Stream)' : selectedChannel.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{selectedChannel.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={reloadPlayer}
                    title="प्लेयर रीलोड करें"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>रीलोड</span>
                  </button>

                  <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded-full text-[11px] font-black uppercase tracking-wider">
                    ● LIVE 24x7 HD
                  </span>
                </div>
              </div>

              {/* Video Embed Frame */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
                {currentEmbedSource ? (
                  <iframe
                    key={playerKey}
                    src={currentEmbedSource}
                    title={selectedChannel.name}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <span className="text-xs text-slate-400">वीडियो लोड हो रहा है...</span>
                )}
              </div>

              {/* Player Mode & Direct Live Options */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-300">
                    <p className="leading-relaxed">
                      <strong className="text-amber-400 font-bold">चैनल विवरण: </strong>
                      {selectedChannel.description}
                    </p>
                  </div>

                  <a
                    href={selectedChannel.streamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1.5 shrink-0 shadow-lg text-xs"
                  >
                    <span>यूट्यूब पर लाइव खोलें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Custom URL Input for Any News Stream */}
                <form onSubmit={handleApplyCustomUrl} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={customStreamUrl}
                    onChange={(e) => setCustomStreamUrl(e.target.value)}
                    placeholder="कोई भी यूट्यूब लाइव लिंक पेस्ट करें (उदा: https://www.youtube.com/watch?v=...)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shrink-0 shadow"
                  >
                    स्ट्रीम चलाएं
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Channels Grid List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-rose-500" />
                    <span>प्रमुख हिंदी न्यूज़ चैनल्स</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">6 लाइव चैनल्स</span>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {LIVE_NEWS_CHANNELS.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => handleChannelSelect(ch)}
                      className={`w-full p-3 rounded-2xl border transition text-left flex items-center gap-3 cursor-pointer ${
                        selectedChannel.id === ch.id && !activeCustomUrl
                          ? 'bg-rose-500/20 border-rose-500/60 shadow-lg'
                          : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        <img src={ch.logo} alt={ch.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white truncate">{ch.name}</h5>
                          {ch.isLive && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{ch.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Integrated Chrome Browser for Live News Search */}
          <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-black text-white">IOIS इन-ऐप क्रोम ब्राउज़र (Live Search)</h4>
                  <p className="text-xs text-slate-400">{browserTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBrowserKey((k) => k + 1)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="ब्राउज़र रीलोड करें"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>रीफ्रेश</span>
                </button>

                <a
                  href={browserUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md"
                >
                  <span>नई टैब में खोलें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <form onSubmit={handleCustomBrowserNavigate} className="flex items-center gap-2">
              <input
                type="text"
                value={browserSearchInput || browserUrl}
                onChange={(e) => setBrowserSearchInput(e.target.value)}
                placeholder="कोई भी वेबसाइट यूआरएल या यूट्यूब सर्च दर्ज करें..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg flex items-center gap-1.5 shrink-0"
              >
                <span>खोलें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="relative w-full h-[550px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center">
              {browserUrl ? (
                <iframe
                  key={browserKey}
                  src={browserUrl}
                  title="IOIS Chrome In-App Browser"
                  className="w-full h-full border-0 bg-white"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                />
              ) : (
                <span className="text-xs text-slate-400">वेब पेज लोड हो रहा है...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: LIVE HEADLINES & COMFORTABLE ARTICLE READER                     */}
      {/* ========================================================================= */}
      {activeTab === 'headlines' && (
        <div className="space-y-6">
          {/* Category Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खबरें खोजें..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition flex flex-col justify-between space-y-4 shadow-lg cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-amber-400 font-bold">[{art.source}]</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.time}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-amber-300 transition">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1 line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{art.readTime}</span>
                  <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-1">
                    <span>पूरा पढ़ें</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 4: E-NEWSPAPER DIRECTORY                                           */}
      {/* ========================================================================= */}
      {activeTab === 'epaper' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm">
            <strong className="text-white font-bold block mb-1">मुफ्त ई-अखबार पढ़ने की विधि:</strong>
            नीचे दिए गए किसी भी राष्ट्रीय अखबार के "आज का ई-पेपर खोलें" बटन पर क्लिक करें। अपने राज्य व शहर का एडिशन सेलेक्ट करें और आज का पूरा अखबार हाई-डेफिनिशन (HD) में मुफ्त पढ़ें।
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {E_NEWSPAPERS_LIST.map((paper) => (
              <div
                key={paper.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-400/60 transition flex flex-col justify-between space-y-5 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Newspaper className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-950 text-slate-400 rounded-full border border-slate-800">
                      {paper.language}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">{paper.name}</h3>
                  <p className="text-xs text-slate-300">{paper.description}</p>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-amber-400 block mb-0.5">कैसे पढ़ें:</strong>
                    {paper.howToRead}
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={paper.epaperUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <span>आज का ई-पेपर खोलें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 5: ALL INDIA RADIO NEWS BULLETINS                                 */}
      {/* ========================================================================= */}
      {activeTab === 'radio' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                <RadioIcon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">आकाशवाणी (All India Radio) समाचार बुलेटिन</h3>
                <p className="text-xs text-slate-300">राष्ट्रीय व प्रादेशिक ऑडियो समाचार बुलेटिन - सीधे आकाशवाणी दिल्ली व पटना केंद्र से</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">प्रातःकालीन मुख्य समाचार (Morning Bulletin)</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">15 मिनट</span>
                </div>
                <p className="text-xs text-slate-400">देश, दुनिया, संसद और आर्थिक जगत की बड़ी खबरों का आधिकारिक ऑडियो संकलन।</p>
                <audio controls className="w-full h-10 rounded-xl" src="https://airnews.gov.in/Audio/Morning-Hindi.mp3">
                  आपका ब्राउज़र ऑडियो प्लेयर सपोर्ट नहीं करता।
                </audio>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">सायंकालीन समाचार प्रभा (Evening Samachar)</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">15 मिनट</span>
                </div>
                <p className="text-xs text-slate-400">दिनभर के सभी प्रमुख घटनाक्रम, खेल व राज्यों की खबरों का विशेष बुलेटिन।</p>
                <audio controls className="w-full h-10 rounded-xl" src="https://airnews.gov.in/Audio/Evening-Hindi.mp3">
                  आपका ब्राउज़र ऑडियो प्लेयर सपोर्ट नहीं करता।
                </audio>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. ARTICLE READER MODAL (HIGH READABILITY WITH TEXT RESIZE & SPEECH)       */}
      {/* ========================================================================= */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-950 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header controls */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    {activeArticle.source}
                  </span>
                  <span className="text-slate-400">{activeArticle.time}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{activeArticle.readTime}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                  {activeArticle.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Accessibility bar: Text Resize & Voice Reader */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">फ़ॉन्ट आकार:</span>
                <button
                  onClick={() => setReaderFontSize('sm')}
                  className={`px-2 py-1 rounded-lg font-bold border cursor-pointer ${
                    readerFontSize === 'sm' ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  छोटा (A-)
                </button>
                <button
                  onClick={() => setReaderFontSize('base')}
                  className={`px-2 py-1 rounded-lg font-bold border cursor-pointer ${
                    readerFontSize === 'base' ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  सामान्य (A)
                </button>
                <button
                  onClick={() => setReaderFontSize('lg')}
                  className={`px-2 py-1 rounded-lg font-bold border cursor-pointer ${
                    readerFontSize === 'lg' ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  बड़ा (A+)
                </button>
              </div>

              {/* Speech Synthesis Button */}
              {'speechSynthesis' in window && (
                <button
                  onClick={() => toggleSpeech(`${activeArticle.title}. ${activeArticle.summary}`)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'आवाज़ बंद करें' : 'खबर सुनें (Audio)'}</span>
                </button>
              )}
            </div>

            {/* Article Content */}
            <div className={`text-slate-200 leading-relaxed font-normal space-y-4 ${
              readerFontSize === 'sm' ? 'text-xs' :
              readerFontSize === 'base' ? 'text-sm' :
              readerFontSize === 'lg' ? 'text-base' : 'text-lg'
            }`}>
              <p className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-amber-200/90 font-medium italic">
                {activeArticle.summary}
              </p>

              <p>
                देश भर के नागरिकों और पाठकों के लिए यह खबर अत्यंत महत्वपूर्ण है। सरकार और संबंधित विभागों द्वारा डिजिटल प्लेटफॉर्म्स और आधिकारिक सूचना तंत्रों के माध्यम से इसे निरंतर अपडेट किया जा रहा है।
              </p>

              <p>
                IOIS प्लेटफॉर्म पर आपको केवल सत्यापित और निष्पक्ष समाचार प्राप्त होते हैं। आप बिना किसी रुकावट के इसे आसानी से पढ़ सकते हैं अथवा ऊपर दिए गए विकल्प से ऑडियो द्वारा सुन भी सकते हैं।
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>सत्यापित समाचार स्रोत</span>
              </span>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-700 cursor-pointer"
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
