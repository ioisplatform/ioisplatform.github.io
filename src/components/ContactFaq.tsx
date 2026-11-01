import React, { useState } from 'react';
import { 
  OFFICIAL_PHONE, 
  OFFICIAL_WHATSAPP_URL, 
  OFFICIAL_TELEGRAM_URL, 
  OFFICIAL_EMAIL,
  OFFICIAL_UPI_ID,
  OFFICIAL_PAYEE_NAME
} from '../data/plansData';
import { 
  MessageSquare, 
  Send, 
  Mail, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Copy, 
  Check, 
  Search,
  Lock,
  Zap,
  GraduationCap,
  FileText
} from 'lucide-react';

interface ContactFaqProps {
  onAskAI: (question: string) => void;
}

export const ContactFaq: React.FC<ContactFaqProps> = ({ onAskAI }) => {
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'income' | 'privacy' | 'plans' | 'citizen'>('all');

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      // Fallback
    }
  };

  const faqItems = [
    {
      category: 'income',
      badge: 'प्लेटफॉर्म परिचय',
      question: 'IOIS क्या है और यह कैसे काम करता है?',
      answer: 'IOIS (Indian Online Income Supporting System) एक पारदर्शी, सुरक्षित डिजिटल व शैक्षिक सपोर्ट प्लेटफॉर्म है। यह छात्रों और आम नागरिकों को NCERT नोट्स, कंप्यूटर शिक्षा, RTPS नागरिक सेवाएं (जाति, आय, जमीन दाखिल-खारिज), डिजिटल ID कार्ड और 50% से 70% तक का सीधा रेफरल इंसेंटिव सपोर्ट प्रदान करता है।',
      suggestQuery: 'IOIS प्लेटफॉर्म का संपूर्ण परिचय और कार्यप्रणाली समझाएं'
    },
    {
      category: 'income',
      badge: 'रेफरल व स्पॉन्सर',
      question: 'रेफरल लिंक और स्पॉन्सर कोड कैसे काम करता है?',
      answer: 'रजिस्ट्रेशन के बाद प्रत्येक सदस्य को एक यूनिक User ID (जैसे IOIS...) और व्यक्तिगत रेफरल लिंक प्राप्त होता है। जब कोई भी व्यक्ति आपके लिंक पर क्लिक करके रजिस्टर करता है, तो आपका स्पॉन्सर कोड फॉर्म में स्वतः भर जाता है और अप्रूवल होते ही 50% से 70% तक का इंसेंटिव सीधे आपके खाते में क्रेडिट होता है।',
      suggestQuery: 'रेफरल से कमाई कैसे करें और स्पॉन्सर लिंक कैसे शेयर करें?'
    },
    {
      category: 'privacy',
      badge: 'सुरक्षा व प्राइवेसी',
      question: 'रेफरल लिंक पर स्पॉन्सर का ID कार्ड प्राइवेसी के साथ कैसे दिखता है?',
      answer: 'सुरक्षा और डेटा गोपनीयता नीति के तहत, जब कोई नया आगंतुक आपके रेफरल लिंक पर आता है, तो आपका नाम, मोबाइल, ईमेल, राज्य और व्यक्तिगत फोटो डिफ़ॉल्ट रूप से पूरी तरह मास्क्ड (छिपे हुए) रहते हैं। केवल आपका यूनिक User ID स्पष्ट दिखाई देता है जिसे वह 1-क्लिक में कॉपी कर सकता है। आप अपने डैशबोर्ड में प्राइवेसी सेटिंग्स से यह कभी भी कस्टमाइज़ कर सकते हैं।',
      suggestQuery: 'IOIS की यूजर प्राइवेसी सेटिंग्स और मास्किंग नियम क्या हैं?'
    },
    {
      category: 'privacy',
      badge: 'डाउनलोड सुरक्षा',
      question: 'क्या कोई अन्य व्यक्ति मेरा या स्पॉन्सर का ID कार्ड डाउनलोड कर सकता है?',
      answer: 'नहीं, बिल्कुल नहीं! सिस्टम में सख्त स्वामित्व सत्यापन (Ownership Lock) लागू है। केवल कार्ड का वास्तविक मालिक (जो अपने खाते में लॉग-इन है) ही अपना ID कार्ड PDF, PNG या JPG में डाउनलोड या प्रिंट कर सकता है। किसी अन्य विज़िटर या बाहरी सदस्य के लिए डाउनलोड बटन पूर्णतः लॉक रहते हैं।',
      suggestQuery: 'आईडी कार्ड डाउनलोड करने के नियम और सुरक्षा क्या हैं?'
    },
    {
      category: 'income',
      badge: 'स्मार्ट पेआउट',
      question: 'क्या पेआउट सच में तुरंत (Instant) मिलता है?',
      answer: 'हाँ, IOIS का आर्किटेक्चर "Smart Payout Protocol" पर कार्य करता है। जैसे ही आपके रेफरल से कोई यूजर वेरिफाई होता है, उसका निर्धारित इंसेंटिव (जैसे Plan 01 में ₹7, Plan 07 में ₹499) सीधे आपके UPI या बैंक खाते में ट्रांसफर कर दिया जाता है।',
      suggestQuery: 'पेआउट विथड्रॉल करने की प्रक्रिया और न्यूनतम सीमा क्या है?'
    },
    {
      category: 'plans',
      badge: '7 मास्टर प्लांस',
      question: '₹10 से ₹999 तक के 7 मास्टर प्लान्स में क्या अंतर है?',
      answer: 'Plan 1 (₹10): बाल विकास, NCERT बुक्स व ₹7 इंसेंटिव। Plan 2 (₹49): डिजिटल स्किल व ₹25 इंसेंटिव। Plan 3 (₹99): RTPS व सरकारी योजना किट व ₹50 इंसेंटिव। Plan 4 (₹199): ADCA कंप्यूटर व करियर किट व ₹100 इंसेंटिव। Plan 5 (₹349): प्रतियोगी परीक्षा व ₹175 इंसेंटिव। Plan 6 (₹499): प्रोफेशनल करियर बंडल व ₹250 इंसेंटिव। Plan 7 (₹999): लाइफटाइम मास्टर एक्सेस, VIP 70% इंसेंटिव (₹499) व 24x7 प्रायोरिटी सपोर्ट।',
      suggestQuery: '7 मास्टर प्लान्स की पूरी लिस्ट और उनके लाभ बताएं'
    },
    {
      category: 'citizen',
      badge: 'विद्यार्थी हब',
      question: 'विद्यार्थी शिक्षा पोर्टल में क्या-क्या सुविधाएं मुफ्त उपलब्ध हैं?',
      answer: 'कक्षा 1 से 12 तक और BA/BSc/BCom के सभी विषयों के NCERT नोट्स, फॉर्मूला शीट्स, ADCA कंप्यूटर कोर्स ट्यूटोरियल्स, स्कॉलरशिप गाइड, टाइमटेबल जनरेटर और स्कूल/कॉलेज बोनाफाइड सर्टिफिकेट फॉर्मेट बिना किसी अतिरिक्त शुल्क के उपलब्ध हैं।',
      suggestQuery: 'विद्यार्थी पोर्टल में NCERT नोट्स और कंप्यूटर कोर्स कैसे एक्सेस करें?'
    },
    {
      category: 'citizen',
      badge: 'RTPS व जमीन',
      question: 'RTPS और जमीन सुधार सेवाओं (दाखिल-खारिज, परिमार्जन, LPC) की क्या जानकारी मिलती है?',
      answer: 'जाति, आय, निवास प्रमाण पत्र, जमीन दाखिल-खारिज (Mutation), परिमार्जन, भूमि स्वामित्व प्रमाण पत्र (LPC), instant e-PAN और राशन कार्ड के आवश्यक दस्तावेजों की पूरी चेकलिस्ट, ऑनलाइन आवेदन लिंक, स्टेटस ट्रैकर और रिजेक्शन से बचने की सटीक विधि उपलब्ध है।',
      suggestQuery: 'RTPS पर जाति, आय, निवास और दाखिल खारिज आवेदन की विधि बताएं'
    },
    {
      category: 'privacy',
      badge: 'पेमेंट व सत्यापन',
      question: 'यदि पेमेंट रिजेक्ट हो जाए या गलत UTR दर्ज हो जाए तो क्या करें?',
      answer: 'घबराने की कोई बात नहीं है! अपने सदस्य डैशबोर्ड में जाएं, "प्रोफाइल व गोपनीयता" टैब खोलें और "रसीद व UTR अपडेट करें" पर क्लिक करें। सही 12-अंकों का UTR नंबर और नया स्पष्ट स्क्रीनशॉट अपलोड करके सेव करें। एडमिन टीम 1 से 2 घंटे के भीतर इसका पुनः सत्यापन कर देगी।',
      suggestQuery: 'रिजेक्ट पेमेंट को पुनः कैसे अपडेट करें और UTR कैसे सही करें?'
    },
    {
      category: 'plans',
      badge: 'मोबाइल फ्रेंडली',
      question: 'क्या इसके लिए किसी विशेष तकनीकी ज्ञान या लैपटॉप की आवश्यकता है?',
      answer: 'नहीं, बिल्कुल नहीं! IOIS का पूरा सिस्टम 100% मोबाइल-फ्रेंडली और पीसी-फ्रेंडली है। आप अपने साधारण एंड्रॉयड फोन से ही 2 मिनट में रजिस्ट्रेशन, रेफरल शेयरिंग, पोस्टर क्रिएशन और अर्निंग विथड्रॉल कर सकते हैं। इसके अलावा 24x7 AI असिस्टेंट हर कदम पर आपका मार्गदर्शन करता है।',
      suggestQuery: 'मोबाइल से IOIS का उपयोग कैसे करें?'
    }
  ];

  const filteredFaqs = faqItems.filter((faq) => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;
    return matchesCat && (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.badge.toLowerCase().includes(query)
    );
  });

  return (
    <section id="contact-hub" className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
      {/* 1. Official Support Hub */}
      <div className="glass-card-premium p-5 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
            24X7 VERIFIED HELPLINE & PAYMENTS
          </span>
          <h2 className="gold-metallic-text text-xl sm:text-2xl md:text-3xl font-black uppercase">
            Official Support Hub
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            आधिकारिक सहायता, त्वरित चैट, पेमेंट सत्यापन एवं आधिकारिक संचार चैनल
          </p>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm">
          {/* Official Telegram Helpline */}
          <a
            href={OFFICIAL_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-sky-950/90 to-slate-900 border-2 border-sky-400/60 hover:border-sky-300 rounded-2xl transition group shadow-xl"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/25 text-sky-300 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition shadow-inner">
              <Send className="w-6 h-6 text-sky-400" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] text-sky-300 uppercase font-black tracking-wider">
                🎧【『𝗡𝗘𝗪 𝗨𝗦𝗘𝗥 𝗛𝗘𝗟𝗣𝗟𝗜𝗡𝗘』】
              </span>
              <div className="text-white text-base sm:text-lg font-black font-mono">
                t.me/newuserhelpline
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block">
                24x7 त्वरित टेलीग़्राम सहायता व मार्गदर्शन
              </span>
            </div>
          </a>

          {/* Official Payment Address Card */}
          <div className="p-4 bg-slate-900/95 border-2 border-amber-500/40 rounded-2xl space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-amber-300 font-black uppercase">Official Payment UPI ID</span>
              </div>
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/30">
                100% VERIFIED
              </span>
            </div>

            <div className="text-xs text-slate-300">
              खाता धारक (Account Name): <strong className="text-white font-black">{OFFICIAL_PAYEE_NAME}</strong>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs font-black text-amber-400 select-all truncate">
                {OFFICIAL_UPI_ID}
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'कॉपी हुआ' : 'कॉपी UPI'}</span>
              </button>
            </div>
          </div>

          {/* Email Support Helpline */}
          <a
            href={`mailto:${OFFICIAL_EMAIL}`}
            className="flex items-center gap-4 p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition group shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-amber-300 uppercase font-black">
                🎧【『𝗡𝗘𝗪 𝗨𝗦𝗘𝗥 𝗛𝗘𝗟𝗣𝗟𝗜𝗡𝗘』】EMAIL
              </span>
              <div className="text-white text-sm sm:text-base font-bold font-mono">{OFFICIAL_EMAIL}</div>
              <span className="text-[10px] text-slate-400 block">
                Contact us on Email - {OFFICIAL_EMAIL}
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* 2. Frequently Asked Questions (FAQ) with Category Tabs & Search */}
      <div className="glass-card-premium p-5 sm:p-8 space-y-4 sm:space-y-5">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>अक्सर पूछे जाने वाले प्रश्न (FAQS)</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
              10 महत्वपूर्ण सवाल
            </span>
          </div>
          <h2 className="gold-metallic-text text-xl sm:text-2xl md:text-3xl font-black uppercase">
            Clear Answers & Guidance
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            प्लेटफॉर्म, रेफरल इनकम, प्राइवेसी सुरक्षा, ID कार्ड और प्लान्स की पूरी जानकारी:
          </p>
        </div>

        {/* Search Bar for FAQ */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="सवालों में खोजें (जैसे: पेआउट, आईडी कार्ड, प्राइवेसी, प्लान्स)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeCategory === 'all'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            सभी प्रश्न ({faqItems.length})
          </button>
          <button
            onClick={() => setActiveCategory('income')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeCategory === 'income'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            रेफरल व पेआउट
          </button>
          <button
            onClick={() => setActiveCategory('privacy')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeCategory === 'privacy'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            प्राइवेसी व ID कार्ड
          </button>
          <button
            onClick={() => setActiveCategory('plans')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeCategory === 'plans'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            7 मास्टर प्लान्स
          </button>
          <button
            onClick={() => setActiveCategory('citizen')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              activeCategory === 'citizen'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            RTPS व विद्यार्थी
          </button>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-2.5 text-xs sm:text-sm max-h-[480px] overflow-y-auto pr-1">
          {filteredFaqs.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              कोई प्रश्न नहीं मिला। कृपया अलग शब्द खोजें या नीचे दिए गए बटन से AI से पूछें।
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <details key={idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 sm:p-4 transition open:border-amber-500/50 group">
                <summary className="cursor-pointer font-bold text-amber-300 text-xs sm:text-sm flex justify-between items-center list-none select-none gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold shrink-0">
                      {faq.badge}
                    </span>
                    <span className="text-white group-open:text-amber-300 transition">{faq.question}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition transform shrink-0" />
                </summary>
                <div className="text-slate-300 mt-3 leading-relaxed border-t border-slate-800/80 pt-2.5 space-y-2">
                  <p>{faq.answer}</p>
                  <button
                    type="button"
                    onClick={() => onAskAI(faq.suggestQuery)}
                    className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer mt-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>इसके बारे में AI से और विस्तार से पूछें →</span>
                  </button>
                </div>
              </details>
            ))
          )}
        </div>

        {/* Ask AI Banner */}
        <div className="pt-2">
          <button
            onClick={() => onAskAI('मुझे IOIS के बारे में और अधिक जानकारी चाहिए, कृपया मार्गदर्शन करें।')}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>क्या आपका कोई अन्य सवाल है? 24x7 AI असिस्टेंट से पूछें</span>
          </button>
        </div>

      </div>
    </section>
  );
};
