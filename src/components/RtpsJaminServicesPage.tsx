import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Layers, 
  MapPin, 
  CreditCard, 
  Landmark, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  ArrowRight, 
  Info, 
  UserCheck, 
  Calendar,
  Sparkles,
  HelpCircle,
  X,
  FileCheck,
  Building,
  HeartHandshake
} from 'lucide-react';
import { CITIZEN_SERVICES_DATA, STATE_PORTALS_LIST, CitizenServiceGuide } from '../services/rtpsJaminData';

export const RtpsJaminServicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<CitizenServiceGuide | null>(null);
  const [selectedChecklistServiceId, setSelectedChecklistServiceId] = useState<string>(CITIZEN_SERVICES_DATA[0].id);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [trackingAppNo, setTrackingAppNo] = useState('');

  // Filtered Services
  const filteredServices = useMemo(() => {
    return CITIZEN_SERVICES_DATA.filter((srv) => {
      const matchCategory = selectedCategory === 'all' || srv.category === selectedCategory;
      const matchQuery = 
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.requiredDocuments.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const selectedChecklistService = useMemo(() => {
    return CITIZEN_SERVICES_DATA.find(s => s.id === selectedChecklistServiceId) || CITIZEN_SERVICES_DATA[0];
  }, [selectedChecklistServiceId]);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(key);
    setTimeout(() => setCopiedFormat(null), 3000);
  };

  const affidavitFormats = [
    {
      id: 'caste-affidavit',
      title: 'जाति / आय / निवास स्व-घोषणा पत्र (Self Declaration Format)',
      content: `स्व-घोषणा पत्र (Self-Declaration)
मैं ..........................................., पिता/पति श्री ...........................................,
निवासी ग्राम/मोहल्ला: ................................., पोस्ट: .................................,
थाना: ................................., प्रखंड/अंचल: .................................,
जिला: ................................., राज्य: .................................,
शपथपूर्वक घोषणा करता/करती हूँ कि:
1. मैं भारत का/की नागरिक हूँ तथा उपर्युक्त पते का स्थायी निवासी हूँ।
2. मेरी जाति ............................... है जो राज्य सरकार की ............................... अनुसूची के अंतर्गत अधिसूचित है।
3. मेरे परिवार की सभी स्रोतों से कुल वार्षिक आय ₹............................... (अक्षरों में .....................................................) है।
4. आवेदन में दी गई सभी सूचनाएं और संलग्न दस्तावेज पूर्णतः सत्य हैं। यदि कोई जानकारी असत्य पाई जाती है तो मेरे विरुद्ध विधि-सम्मत कानूनी कार्रवाई की जा सकती है।

हस्ताक्षर / अंगूठे का निशान: ...............................
आवेदक का नाम: ...............................
मोबाइल नंबर: ...............................
दिनांक: ...............................`
    },
    {
      id: 'dakhil-affidavit',
      title: 'दाखिल-खारिज (वारिसान/विरासत) शपथ पत्र',
      content: `दाखिल खारिज वारिसान शपथ पत्र (वारिस नामांतरण हेतु)
समक्ष: श्रीमान अंचलाधिकारी महोदय, अंचल: ................................., जिला: .................................
शपथकर्ता: ..........................................., पिता: स्वर्गीय ...........................................
निवासी: मौजा/ग्राम: ................................., थाना नंबर: ................., अंचल: .................

1. यह कि स्व. ........................................... की मृत्यु दिनांक ......................... को हो चुकी है।
2. यह कि मृतक के वैध वारिसानों की वंशावली निम्नवत है:
   (i) ........................................... (पुत्र/पुत्री/पत्नी) - उम्र: ..... वर्ष
   (ii) ........................................... (पुत्र/पुत्री) - उम्र: ..... वर्ष
3. यह कि मृतक के नाम खाता सं. .............., खेसरा सं. .............., कुल रकबा ..................... जमीन दर्ज है।
4. यह कि उक्त जमीन पर हम सभी वारिसानों का शांतिपूर्ण दखल-कब्जा है तथा किसी भी न्यायालय में कोई विवाद लंबित नहीं है।
अतः श्रीमान से प्रार्थना है कि उक्त भूमि का नामांतरण (दाखिल-खारिज) हमारे नाम से करने की कृपा की जाए।

शपथकर्ता का हस्ताक्षर: ...............................
मोबाइल नंबर: ...............................`
    },
    {
      id: 'ews-affidavit',
      title: 'EWS आर्थिक रूप से कमजोर वर्ग स्व-घोषणा',
      content: `आर्थिक रूप से कमजोर वर्ग (EWS) स्व-घोषणा पत्र
मैं ..........................................., पुत्र/पुत्री श्री ...........................................,
निवासी: ....................................................................................................
घोषणा करता/करती हूँ कि मैं ............................... जाति से हूँ, जो SC/ST/OBC में अधिसूचित नहीं है।
मेरे परिवार के पास:
1. 5 एकड़ या उससे अधिक कृषि भूमि नहीं है।
2. 1000 वर्ग फीट या उससे अधिक का आवासीय फ्लैट नहीं है।
3. अधिसूचित नगर पालिकाओं में 100 वर्ग गज या उससे बड़ा आवासीय प्लॉट नहीं है।
4. मेरे परिवार की सभी स्रोतों से कुल वार्षिक आय ₹8,00,000 (आठ लाख रुपये) से कम है।

आवेदक का हस्ताक्षर: ...............................
दिनांक: ...............................`
    }
  ];

  return (
    <div id="rtps-services-main-container" className="space-y-10 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* 🌟 HERO BANNER */}
      <div 
        id="rtps-hero-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 text-white p-8 sm:p-12 shadow-2xl border border-indigo-500/20"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            डिजिटल नागरिक सेवा सहायता केंद्र (2026 Live Portal)
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            RTPS, जमीन सुधार, आधार-पैन व मुफ्त सरकारी योजनाएं
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            जाति, आय, निवास, दाखिल-खारिज, परिमार्जन, LPC, instant e-PAN, पेंशन, छात्रवृत्ति व आयुष्मान कार्ड की 
            <strong className="text-emerald-300"> 100% सही आधिकारिक जानकारी</strong>, आवश्यक दस्तावेज चेकलिस्ट, आवेदन विधि व सत्यापन प्रक्रिया।
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-xl font-bold text-amber-300">₹0</span>
              <span className="text-xs text-slate-300">सरकारी फीस (अधिकांश मुफ्त)</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-xl font-bold text-emerald-300">10-14 दिन</span>
              <span className="text-xs text-slate-300">RTPS सेवा गारंटी अवधि</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-xl font-bold text-sky-300">100% ऑनलाइन</span>
              <span className="text-xs text-slate-300">घर बैठे डिजिटल डाउनलोड</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-xl font-bold text-purple-300">डायरेक्ट DBT</span>
              <span className="text-xs text-slate-300">बिना बिचौलियों के खाते में</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 QUICK ACTION BAR / LIVE TRACKER ASSISTANT */}
      <div 
        id="rtps-quick-tracker"
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1 w-full lg:w-1/2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            लाइव आवेदन स्थिति जांचें (Live Application Tracker)
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            क्या आपने पहले से आवेदन कर रखा है? स्टेटस ट्रैक करें
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            RTPS पावती रसीद का 16 अंकों का Application Ref No. (जैसे: BICC/2026/XXXXX) या दाखिल खारिज वाद संख्या डालें।
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              id="tracker-input-app-no"
              value={trackingAppNo}
              onChange={(e) => setTrackingAppNo(e.target.value)}
              placeholder="उदा: BICC/2026/123456 या Case No"
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            {trackingAppNo && (
              <button 
                onClick={() => setTrackingAppNo('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <a
            href="https://serviceonline.bihar.gov.in/serviceDetails/statusTrack.html"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-track-official-portal"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <span>ट्रैक पोर्टल खोलें</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 🔍 SEARCH & CATEGORY FILTER TABS */}
      <div id="rtps-filter-section" className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-citizen-services-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="सेवा का नाम या दस्तावेज खोजें (उदा: जाति, दाखिल खारिज, PAN, राशन)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          {/* Results count */}
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-end md:self-center">
            कुल {filteredServices.length} सेवाएं उपलब्ध
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'all', label: 'सभी सेवाएं (All)', icon: Layers },
            { id: 'rtps', label: 'RTPS प्रमाण पत्र', icon: FileText },
            { id: 'jamin', label: 'जमीन सुधार व दाखिल खारिज', icon: Landmark },
            { id: 'aadhaar_pan', label: 'आधार व पैन कार्ड', icon: CreditCard },
            { id: 'pension', label: 'पेंशन योजनाएं', icon: HeartHandshake },
            { id: 'scholarship', label: 'छात्रवृत्ति व कन्या उत्थान', icon: GraduationCap },
            { id: 'schemes', label: 'मुफ्त जन कल्याण योजनाएं', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-filter-${tab.id}`}
                onClick={() => setSelectedCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📦 GRID OF CITIZEN SERVICES */}
      <div id="rtps-services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            id={`service-card-${service.id}`}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-indigo-600" />

            <div className="p-6 space-y-4">
              
              {/* Category Badge & SLA */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/40">
                  {service.categoryLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {service.deliveryTime}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {service.tagline}
                </p>
              </div>

              {/* Required Documents Mini List */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
                  मुख्य आवश्यक दस्तावेज ({service.requiredDocuments.length}):
                </div>
                <ul className="space-y-1">
                  {service.requiredDocuments.slice(0, 3).map((doc, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${doc.isMandatory ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span className="truncate">{doc.name}</span>
                    </li>
                  ))}
                  {service.requiredDocuments.length > 3 && (
                    <li className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pl-3">
                      + {service.requiredDocuments.length - 3} अन्य सहायक दस्तावेज...
                    </li>
                  )}
                </ul>
              </div>

              {/* Fee & Department */}
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>सरकारी शुल्क: <strong className="text-emerald-600 dark:text-emerald-400">{service.fee}</strong></span>
                <span className="truncate max-w-[140px]" title={service.department}>{service.department}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                id={`btn-view-details-${service.id}`}
                onClick={() => setActiveModalService(service)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
              >
                <Info className="w-3.5 h-3.5 text-indigo-500" />
                <span>पूरी जानकारी व विधि</span>
              </button>

              <a
                href={service.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                id={`btn-apply-direct-${service.id}`}
                className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                title="आधिकारिक पोर्टल पर सीधे आवेदन करें"
              >
                <span>अप्लाई लिंक</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 📋 INTERACTIVE DOCUMENT CHECKLIST & REQUIREMENT GENERATOR */}
      <div 
        id="interactive-doc-checklist-section"
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <FileCheck className="w-3.5 h-3.5" />
              इंटरएक्टिव दस्तावेज चेकलिस्ट जेनरेटर
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              "मुझे क्या-क्या कागजात तैयार रखने होंगे?"
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              नीचे ड्रॉपडाउन से कोई भी सरकारी सेवा चुनें और तुरंत देखें कि फॉर्म भरने से पहले कौन-से दस्तावेज किस साइज व फॉर्मेट में चाहिए।
            </p>
          </div>

          <div className="w-full md:w-72">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              सेवा का चयन करें:
            </label>
            <select
              id="select-checklist-service"
              value={selectedChecklistServiceId}
              onChange={(e) => setSelectedChecklistServiceId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {CITIZEN_SERVICES_DATA.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Service Checklist Display */}
        {selectedChecklistService && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">सरकारी विभाग:</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedChecklistService.department}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">सरकारी फीस:</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{selectedChecklistService.fee}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">सर्टिफिकेट निर्गमन समय (SLA):</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{selectedChecklistService.deliveryTime}</span>
              </div>
            </div>

            {/* Checklist Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                    <th className="py-3 px-4 font-bold">#</th>
                    <th className="py-3 px-4 font-bold">दस्तावेज का नाम (Document Name)</th>
                    <th className="py-3 px-4 font-bold">अनिवार्यता (Status)</th>
                    <th className="py-3 px-4 font-bold">साइज व स्पेसिफिकेशन (Size & Format)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedChecklistService.requiredDocuments.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{doc.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        {doc.isMandatory ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-900/40">
                            अनिवार्य (Mandatory)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                            वैकल्पिक (Optional)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                        {doc.specification}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pro Tip Box */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                  विशेष सावधानी व रिजेक्शन से बचने का नियम (Pro-Tip):
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {selectedChecklistService.proTips}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🏛️ STATE-WISE PORTALS DIRECTORY */}
      <div id="state-portals-directory-section" className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Building className="w-3.5 h-3.5" />
            राज्यवार आधिकारिक सरकारी पोर्टल्स डायरेक्टरी
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            अपने राज्य का आधिकारिक RTPS व भूलेख पोर्टल चुनें
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            फर्जी या डुप्लीकेट वेबसाइट्स से बचें; नीचे दिए गए सभी लिंक्स 100% आधिकारिक सरकारी सर्वर के हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATE_PORTALS_LIST.map((stateInfo, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {stateInfo.state}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  सत्यापित
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {stateInfo.description}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={stateInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-colors"
                >
                  <span>RTPS / e-District</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={stateInfo.landPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 text-xs font-bold transition-colors"
                >
                  <span>भूलेख / जमीन पोर्टल</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📑 READY-MADE AFFIDAVIT & SELF-DECLARATION FORMATS */}
      <div id="affidavit-templates-section" className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <FileText className="w-3.5 h-3.5" />
            स्व-घोषणा व शपथ पत्र प्रारूप (Affidavit Formats)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            मुफ्त रेडी-टू-यूज़ शपथ पत्र व स्व-घोषणा फॉर्म
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            ऑनलाइन फॉर्म भरते समय इन प्रारूपों को कॉपी करें, अपनी जानकारी भरें और सीधे प्रिंट या अपलोड करें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {affidavitFormats.map((format) => (
            <div
              key={format.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {format.title}
                  </h3>
                  <button
                    onClick={() => handleCopyText(format.id, format.content)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors"
                  >
                    {copiedFormat === format.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed border border-slate-200 dark:border-slate-700">
                  {format.content}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic">
                * सादे कागज पर प्रिंट निकालकर या हस्तलिखित लिखकर हस्ताक्षर कर अपलोड करें।
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: DETAILED FULL-SCREEN SERVICE BREAKDOWN ================= */}
      {activeModalService && (
        <div 
          id="modal-service-details"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => setActiveModalService(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-start justify-between gap-4 border-b border-indigo-500/20">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  {activeModalService.categoryLabel} • {activeModalService.shortCode}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {activeModalService.title}
                </h2>
                <p className="text-xs text-slate-300">
                  {activeModalService.department}
                </p>
              </div>

              <button
                id="btn-close-service-modal"
                onClick={() => setActiveModalService(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm text-slate-700 dark:text-slate-300">
              
              {/* Essential Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                <div>
                  <span className="text-xs text-slate-400 block">सरकारी शुल्क</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{activeModalService.fee}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">समय सीमा (SLA)</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{activeModalService.deliveryTime}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">निर्गत स्तर</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">डिजिटल ई-हस्ताक्षर</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">सर्टिफिकेट प्रकार</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">QR कोड युक्त PDF</span>
                </div>
              </div>

              {/* 1. आवश्यक दस्तावेज (Required Documents) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-500" />
                  1. आवश्यक दस्तावेजों की सूची (Required Documents Checklist)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalService.requiredDocuments.map((doc, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white text-xs">{doc.name}</span>
                        {doc.isMandatory ? (
                          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded">अनिवार्य</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">वैकल्पिक</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.specification}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. पात्रता व शर्तें (Eligibility) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-500" />
                  2. पात्रता व आवश्यक शर्तें (Eligibility Criteria)
                </h3>
                <ul className="space-y-2">
                  {activeModalService.eligibility.map((el, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. स्टेप-बाय-स्टेप ऑनलाइन आवेदन विधि (Step by Step Guide) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-500" />
                  3. घर बैठे ऑनलाइन आवेदन करने की विधि (Step-by-Step Process)
                </h3>
                <ol className="space-y-2.5 relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-3 pl-4">
                  {activeModalService.stepByStepGuide.map((step, idx) => (
                    <li key={idx} className="space-y-1 relative">
                      <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">स्टेप {idx + 1}:</span>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 4. सरकारी सत्यापन व जांच प्रक्रिया (Verification Workflow) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-500" />
                  4. सरकारी जांच व सत्यापन कैसे होता है? (Verification Process)
                </h3>
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold">प्राधिकृत अधिकारी:</span>
                      <strong className="text-slate-900 dark:text-white">{activeModalService.verificationWorkflow.designatedOfficer}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">जांचकर्ता:</span>
                      <strong className="text-slate-900 dark:text-white">{activeModalService.verificationWorkflow.investigationOfficer}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">अनुमोदन स्तर:</span>
                      <strong className="text-slate-900 dark:text-white">{activeModalService.verificationWorkflow.approvalAuthority}</strong>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed pt-1 border-t border-indigo-200/50 dark:border-indigo-900/50">
                    {activeModalService.verificationWorkflow.processDetails}
                  </p>
                </div>
              </div>

              {/* 5. रिजेक्शन के कारण व डाउनलोड विधि */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Rejection reasons */}
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-red-900 dark:text-red-300 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    फॉर्म रिजेक्ट क्यों होता है?
                  </h4>
                  <ul className="space-y-1.5 text-xs text-red-800 dark:text-red-300">
                    {activeModalService.rejectionReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Download Method */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-500" />
                    डिजिटल सर्टिफिकेट कैसे डाउनलोड करें?
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {activeModalService.downloadMethod}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                पोर्टल: <strong>{activeModalService.officialPortalName}</strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={activeModalService.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-white text-xs font-bold border border-slate-300 dark:border-slate-600 transition-colors shadow-sm"
                >
                  <span>स्थिति जांचें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={activeModalService.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <span>आधिकारिक पोर्टल पर अभी अप्लाई करें</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
