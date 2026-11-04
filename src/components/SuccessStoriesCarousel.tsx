import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  TrendingUp, 
  Crown, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { PageType } from '../types';

export interface SuccessStory {
  id: number;
  name: string;
  role: string;
  location: string;
  planName: string;
  planCost: string;
  earnings: string;
  avatarBg: string;
  initials: string;
  rating: number;
  story: string;
  keyHighlight: string;
  timeframe: string;
}

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 1,
    name: 'राहुल कुमार',
    role: 'कॉलेज छात्र (B.Sc. Final Year)',
    location: 'पटना, बिहार',
    planName: 'Plan 5 (Diamond)',
    planCost: '₹199',
    earnings: '₹28,600+',
    avatarBg: 'from-amber-500 to-yellow-600',
    initials: 'र.कु',
    rating: 5,
    story: 'मैं कॉलेज की पढ़ाई के साथ पार्ट-टाइम आय का साधन तलाश रहा था। IOIS के ₹199 प्लान में मुझे तुरंत ₹99.50 का रेफरल इंसेंटिव मिला और स्टडी नोट्स भी। आज मैं अपनी कॉलेज फीस और कोचिंग का खर्च खुद उठा रहा हूँ।',
    keyHighlight: 'सीधा 50% इंसेंटिव तुरंत UPI खाते में',
    timeframe: 'पिछले 45 दिनों में'
  },
  {
    id: 2,
    name: 'प्रियंका शर्मा',
    role: 'गृहणी (Home Maker)',
    location: 'जयपुर, राजस्थान',
    planName: 'Plan 7 (Royal Ultimate)',
    planCost: '₹999',
    earnings: '₹54,200+',
    avatarBg: 'from-purple-500 to-pink-600',
    initials: 'प्र.श',
    rating: 5,
    story: 'घर के कामों के बाद मेरे पास दिन में 2-3 घंटे खाली होते थे। IOIS के डिजिटल ID कार्ड और प्लान 7 की मदद से मैंने अपनी सहेलियों व पड़ोसियों को जोड़ना शुरू किया। हर सफल रजिस्ट्रेशन पर ₹499.50 की सीधी कमाई ने मुझे आत्मनिर्भर बनाया।',
    keyHighlight: 'हर रेफरल पर ₹499.50 की सुरक्षित आय',
    timeframe: 'पिछले 2 महीनों में'
  },
  {
    id: 3,
    name: 'अमित कुमार वर्मा',
    role: 'CSC व साइबर कैफे संचालक',
    location: 'लखनऊ, उत्तर प्रदेश',
    planName: 'Plan 6 (Platinum VIP)',
    planCost: '₹499',
    earnings: '₹41,800+',
    avatarBg: 'from-blue-500 to-cyan-600',
    initials: 'अ.व',
    rating: 5,
    story: 'मेरी दुकान पर रोज जाति, आय, निवास और जमीन के दाखिल-खारिज के ग्राहक आते हैं। IOIS के RTPS डायरेक्ट लिंक और विद्यार्थी नोट्स से दुकान का काम भी आसान हुआ और ग्राहकों को IOIS से जोड़कर अतिरिक्त आय भी बढ़ी।',
    keyHighlight: 'RTPS + विद्यार्थी सेवाओं के साथ अतिरिक्त आय',
    timeframe: 'पिछले 35 दिनों में'
  },
  {
    id: 4,
    name: 'विकास यादव',
    role: 'प्रतियोगी परीक्षा अभ्यर्थी व ट्यूटर',
    location: 'इंदौर, मध्य प्रदेश',
    planName: 'Plan 4 (Gold Plan)',
    planCost: '₹99',
    earnings: '₹22,400+',
    avatarBg: 'from-emerald-500 to-teal-600',
    initials: 'वि.या',
    rating: 5,
    story: 'शुरुआत में मैंने सिर्फ ₹99 का प्लान लिया था। NCERT के क्लास 1 से 12 तक के नोट्स और फॉर्मूला शीट्स मेरी ट्यूशन के बच्चों के बहुत काम आए। छात्रों और उनके परिजनों ने खुशी-खुशी प्लान लिया और मुझे 50% इंसेंटिव मिला।',
    keyHighlight: 'NCERT बुक्स व फॉर्मूला शीट्स 100% फ्री',
    timeframe: 'पिछले 28 दिनों में'
  },
  {
    id: 5,
    name: 'सुनीता देवी',
    role: 'महिला स्वयं सहायता समूह सदस्य',
    location: 'रांची, झारखंड',
    planName: 'Plan 3 (Silver Plan)',
    planCost: '₹50',
    earnings: '₹14,900+',
    avatarBg: 'from-rose-500 to-orange-600',
    initials: 'सु.दे',
    rating: 5,
    story: 'बिना किसी बड़े निवेश के सिर्फ ₹50 के प्लान से मैंने शुरुआत की थी। IOIS का डिजिटल पहचान पत्र (ID Card) देखकर सब लोग बहुत प्रभावित हुए। यह सचमुच ईमानदार और पारदर्शी मंच है।',
    keyHighlight: 'स्मार्ट डिजिटल ID कार्ड और 100% पारदर्शिता',
    timeframe: 'पिछले 20 दिनों में'
  }
];

interface SuccessStoriesCarouselProps {
  onNavigate: (page: PageType) => void;
  onOpenRegister?: (planId?: number) => void;
}

export const SuccessStoriesCarousel: React.FC<SuccessStoriesCarouselProps> = ({
  onNavigate,
  onOpenRegister
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto rotation every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SUCCESS_STORIES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SUCCESS_STORIES.length) % SUCCESS_STORIES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SUCCESS_STORIES.length);
  };

  const current = SUCCESS_STORIES[currentIndex];

  return (
    <section 
      aria-label="सफलता की कहानियां"
      className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950 to-slate-900/90 border border-amber-500/30 shadow-2xl space-y-5 sm:space-y-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>सफलता की कहानियां व कमाई का प्रमाण (Success Stories)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>IOIS सदस्यों की वास्तविक सफलता</span>
            <span className="text-xs font-normal text-slate-400 hidden md:inline">
              (सत्यापित दैनिक भुगतान 50%-70%)
            </span>
          </h3>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrev}
            aria-label="Previous story"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-xs font-mono font-bold text-amber-400 px-2 py-1 bg-slate-950 rounded-lg border border-slate-800">
            {currentIndex + 1} / {SUCCESS_STORIES.length}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next story"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Active Testimonial Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
        {/* Left: User Profile & Verified Earning Stats */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${current.avatarBg} text-white font-black text-lg flex items-center justify-center shadow-lg shrink-0 border-2 border-white/20`}>
              {current.initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-base sm:text-lg font-black text-white">{current.name}</h4>
                <UserCheck className="w-4 h-4 text-emerald-400" title="सत्यापित सदस्य" />
              </div>
              <p className="text-xs text-amber-300 font-medium">{current.role}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <span>📍 {current.location}</span>
              </p>
            </div>
          </div>

          {/* Earnings Badge */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-emerald-500/10 border border-emerald-500/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">कुल प्रमाणित आय (Earnings)</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{current.earnings}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">{current.timeframe}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% UPI ट्रांसफर</span>
              </span>
            </div>
          </div>

          {/* Plan badge & rating */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 font-bold">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{current.planName} ({current.planCost})</span>
            </span>
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Story Text & Quote */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md">
            <Quote className="w-8 h-8 text-amber-500/20 absolute right-4 top-4 pointer-events-none" />
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              "{current.story}"
            </p>
            
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>मुख्य लाभ: {current.keyHighlight}</span>
              </div>
              <span className="text-slate-500 text-[11px]">IOIS अधिकृत सदस्य समीक्षा</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              {SUCCESS_STORIES.map((story, idx) => (
                <button
                  key={story.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-7 bg-amber-400' 
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to story ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('plans')}
                className="btn-3d-gold px-4 py-2 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>7 मास्टर प्लांस देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
