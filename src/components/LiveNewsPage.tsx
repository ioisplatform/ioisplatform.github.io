import React, { useState } from 'react';
import { 
  LIVE_NEWS_CHANNELS, 
  LIVE_NEWS_ARTICLES, 
  E_NEWSPAPERS_LIST 
} from '../services/liveUtilityService';
import { NewsChannel, NewsArticle } from '../types';
import { 
  Tv, 
  Radio, 
  Newspaper, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Flame, 
  BookOpen, 
  Filter, 
  Share2, 
  Play, 
  CheckCircle2,
  Globe,
  RefreshCw,
  Maximize2,
  Volume2,
  Radio as RadioIcon,
  Search,
  Sliders,
  Chrome,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Film
} from 'lucide-react';

const DEFAULT_IOIS_NEWS_VIDEO = {
  title: 'IOIS स्पेशल लाइव वीडियो व न्यूज़ गाइड (Official Broadcast)',
  videoUrl: 'https://youtu.be/bcjXgHGTBDQ?si=WdpPFXl_6yVy6CVM',
  embedUrl: 'https://www.youtube-nocookie.com/embed/bcjXgHGTBDQ?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3'
};

export const LiveNewsPage: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<NewsChannel>(LIVE_NEWS_CHANNELS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tv' | 'radio' | 'headlines' | 'epaper'>('tv');
  const [playerKey, setPlayerKey] = useState<number>(0);
  const [customStreamUrl, setCustomStreamUrl] = useState<string>('');
  const [activeCustomUrl, setActiveCustomUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    // Open in In-App Chrome Browser on IOIS platform with YouTube live search
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

  // User default video or custom stream
  const currentEmbedSource = activeCustomUrl || DEFAULT_IOIS_NEWS_VIDEO.embedUrl;

  const filteredArticles = LIVE_NEWS_ARTICLES.filter(a => {
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header with Tab Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>लाइव 24x7 राष्ट्रीय न्यूज़ व ई-अखबार केंद्र</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              लाइव न्यूज़ चैनल्स, ई-अखबार व हेडलाइन्स
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              देश और दुनिया की हर बड़ी खबर, लाइव टीवी प्रसारण और सभी प्रमुख समाचार पत्रों के डिजिटल ई-पेपर एक ही स्थान पर।
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('tv')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tv'
                  ? 'bg-rose-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>लाइव टीवी</span>
            </button>

            <button
              onClick={() => setActiveTab('radio')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'radio'
                  ? 'bg-blue-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RadioIcon className="w-4 h-4" />
              <span>ऑल इंडिया रेडियो बुलेटिन</span>
            </button>

            <button
              onClick={() => setActiveTab('headlines')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'headlines'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>ताजा हेडलाइन्स</span>
            </button>

            <button
              onClick={() => setActiveTab('epaper')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'epaper'
                  ? 'bg-emerald-500 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>ई-अखबार</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB 1: LIVE TV STREAMING PLAYER */}
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
                <iframe
                  key={playerKey}
                  src={currentEmbedSource}
                  title={selectedChannel.name}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
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

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={selectedChannel.streamUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black transition flex items-center gap-1.5 shadow-md text-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>यूट्यूब पर फुल HD लाइव</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Custom Stream Input Box (Paste any news link or YouTube stream) */}
                <form onSubmit={handleApplyCustomUrl} className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={customStreamUrl}
                    onChange={(e) => setCustomStreamUrl(e.target.value)}
                    placeholder="अन्य चैनल या यूट्यूब लाइव लिंक यहाँ पेस्ट करें..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shrink-0"
                  >
                    प्ले करें
                  </button>
                  {activeCustomUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCustomUrl('');
                        setCustomStreamUrl('');
                        setPlayerKey(k => k + 1);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      रीसेट
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Right: Channel Switcher List & In-App Chrome Browser Launcher */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    चैनल सूची (Live Channel Click)
                  </h4>
                  <span className="text-[10px] text-amber-400 font-bold">{LIVE_NEWS_CHANNELS.length} चैनल्स</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  नीचे किसी भी चैनल पर क्लिक करें, वह तुरंत बगल में <strong className="text-amber-400">IOIS क्रोम ब्राउज़र</strong> में लाइव सर्च के साथ खुल जाएगा:
                </p>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {LIVE_NEWS_CHANNELS.map((ch) => {
                    const isSelected = selectedChannel.id === ch.id;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => handleChannelSelect(ch)}
                        className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between cursor-pointer border ${
                          isSelected
                            ? 'bg-rose-600/20 border-rose-500 text-white font-black shadow-md'
                            : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-rose-400 shrink-0">
                            <Tv className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{ch.name}</div>
                            <span className="text-[10px] text-slate-400 block">{ch.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Chrome className="w-3 h-3" />
                            <span>ब्राउज़र</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick E-Paper Direct Launcher in Browser */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4" />
                    <span>ई-अखबार ब्राउज़र लिंक</span>
                  </h5>
                  <span className="text-[10px] text-slate-400">1-क्लिक</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {E_NEWSPAPERS_LIST.slice(0, 4).map((paper) => (
                    <button
                      key={paper.id}
                      onClick={() => handleOpenEpaperInBrowser(paper)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-[11px] font-bold text-slate-200 hover:text-emerald-300 transition flex items-center gap-1.5 truncate"
                    >
                      <Chrome className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{paper.name.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* IN-APP IOIS CHROME BROWSER WINDOW FOR LIVE NEWS & NEWSPAPERS */}
          {/* ========================================================================= */}
          <div className="bg-slate-950 rounded-3xl border-2 border-amber-500/40 p-4 sm:p-6 shadow-2xl space-y-4">
            
            {/* Chrome Browser Window Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Chrome className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">IOIS प्लैटफॉर्म क्रोम ब्राउज़र (In-App Chrome Browser)</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                      लाइव एक्टिव
                    </span>
                  </div>
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

            {/* Chrome Browser Address Bar & Fast Shortcuts */}
            <div className="space-y-2">
              <form onSubmit={handleCustomBrowserNavigate} className="flex items-center gap-2">
                <div className="flex-1 relative flex items-center">
                  <div className="absolute left-3 text-slate-500 flex items-center gap-1 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">https://</span>
                  </div>
                  <input
                    type="text"
                    value={browserSearchInput || browserUrl}
                    onChange={(e) => setBrowserSearchInput(e.target.value)}
                    placeholder="कोई भी वेबसाइट यूआरएल या यूट्यूब सर्च दर्ज करें (उदा: https://epaper.jagran.com)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 sm:pl-24 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg flex items-center gap-1.5 shrink-0"
                >
                  <span>खोलें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Fast Browser Navigation Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                <span className="text-slate-400 font-bold mr-1">त्वरित चैनल सर्च:</span>
                {[
                  { label: '🔴 आज तक लाइव सर्च', query: 'aaj tak live news hindi' },
                  { label: '🔵 एबीपी न्यूज़ सर्च', query: 'abp news live hindi' },
                  { label: '🟡 इंडिया टीवी सर्च', query: 'india tv live news hindi' },
                  { label: '🟢 एनडीटीवी सर्च', query: 'ndtv india live' },
                  { label: '📰 दैनिक जागरण ई-पेपर', url: 'https://epaper.jagran.com' },
                  { label: '📰 दैनिक भास्कर ई-पेपर', url: 'https://epaper.bhaskar.com' },
                  { label: '📰 अमर उजाला ई-पेपर', url: 'https://epaper.amarujala.com' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const target = item.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(item.query || '')}`;
                      setBrowserUrl(target);
                      setBrowserTitle(item.label);
                      setBrowserSearchInput(target);
                      setBrowserKey((k) => k + 1);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 transition cursor-pointer font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chrome Browser iFrame Display Window */}
            <div className="relative w-full h-[620px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
              <iframe
                key={browserKey}
                src={browserUrl}
                title="IOIS Chrome In-App Browser"
                className="w-full h-full border-0 bg-white"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
              />
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>💡 यदि किसी वेबसाइट में सुरक्षा नीति के कारण इन-ऐप डिस्प्ले सीमित हो, तो आप ऊपर <strong className="text-amber-400">"नई टैब में खोलें"</strong> पर क्लिक करके भी सीधा आनंद ले सकते हैं।</span>
              <span className="text-emerald-400 font-bold">✓ IOIS Chrome Integrated</span>
            </div>
          </div>
        </div>
      )}

      {/* 2.5 TAB: ALL INDIA RADIO NEWS BULLETINS */}
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

      {/* 3. TAB 2: LIVE HEADLINES */}
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
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-amber-400 font-bold">{art.source}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.time}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{art.readTime}</span>
                  <span className="text-emerald-400 font-bold">✓ वेरिफाइड न्यूज</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 3: E-NEWSPAPER DIRECTORY */}
      {activeTab === 'epaper' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm">
            <strong className="text-white font-bold block mb-1">मुफ्त ई-अखबार पढ़ने की विधि:</strong>
            नीचे दिए गए किसी भी अखबार के "ई-पेपर पढ़ें" बटन पर क्लिक करें। अपने राज्य व शहर का एडिशन सेलेक्ट करें और आज का पूरा अखबार हाई-डेफिनिशन (HD) में मुफ्त पढ़ें।
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
    </div>
  );
};
