import React, { useState, useMemo } from 'react';
import { ioisServicesList } from '../data/ioisPlansData';
import { IOISService } from '../types';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { 
  X, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Landmark, 
  GraduationCap, 
  Calculator, 
  CloudSun, 
  Tv, 
  CreditCard, 
  CalendarDays, 
  TrendingUp, 
  Briefcase, 
  Globe2, 
  Smile, 
  Bot, 
  PhoneCall, 
  Share2, 
  UserCheck, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAi: () => void;
  onOpenIdCard: () => void;
  onOpenRegister: () => void;
  onOpenCalculator: () => void;
  onScrollToPlans: () => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  isOpen,
  onClose,
  onOpenAi,
  onOpenIdCard,
  onOpenRegister,
  onOpenCalculator,
  onScrollToPlans
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSubView, setActiveSubView] = useState<string | null>(null);

  if (!isOpen) return null;

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark': return <Landmark className="w-5 h-5 text-blue-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-orange-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'Calculator': return <Calculator className="w-5 h-5 text-emerald-600" />;
      case 'CloudSun': return <CloudSun className="w-5 h-5 text-amber-500" />;
      case 'Tv': return <Tv className="w-5 h-5 text-red-600" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'CalendarDays': return <CalendarDays className="w-5 h-5 text-rose-600" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-teal-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-cyan-600" />;
      case 'Globe2': return <Globe2 className="w-5 h-5 text-blue-700" />;
      case 'Smile': return <Smile className="w-5 h-5 text-amber-600" />;
      case 'Bot': return <Bot className="w-5 h-5 text-purple-600" />;
      case 'PhoneCall': return <PhoneCall className="w-5 h-5 text-emerald-700" />;
      case 'Share2': return <Share2 className="w-5 h-5 text-blue-500" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-orange-600" />;
      default: return <ShieldCheck className="w-5 h-5 text-slate-700" />;
    }
  };

  const siteSettings = useSiteSettings();

  const allServices = useMemo(() => {
    const defaultRemaining = ioisServicesList.filter(s => !(siteSettings.removedServiceIds || []).includes(s.id));
    const customItems: IOISService[] = (siteSettings.customServices || []).map(cs => ({
      id: cs.id,
      nameHindi: cs.nameHindi,
      nameEnglish: cs.nameEnglish,
      category: (cs.category === 'study' ? 'education' : cs.category === 'govt' ? 'government' : cs.category === 'career' ? 'career' : 'tools') as any,
      icon: cs.iconName,
      description: cs.description,
      badge: cs.badge,
      actionText: 'खोलें',
      urlOrType: cs.urlOrType
    }));
    return [...defaultRemaining, ...customItems];
  }, [siteSettings.removedServiceIds, siteSettings.customServices]);

  const filteredServices = allServices.filter(s => {
    const matchesSearch = s.nameHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAction = (service: IOISService) => {
    if (service.urlOrType === 'internal-plans') {
      onClose();
      onScrollToPlans();
    } else if (service.urlOrType === 'internal-ai') {
      onClose();
      onOpenAi();
    } else if (service.urlOrType === 'internal-idcard') {
      onClose();
      onOpenIdCard();
    } else if (service.urlOrType === 'internal-register') {
      onClose();
      onOpenRegister();
    } else if (service.urlOrType === 'internal-calc') {
      onClose();
      onOpenCalculator();
    } else if (service.urlOrType.startsWith('http')) {
      window.open(service.urlOrType, '_blank');
    } else {
      setActiveSubView(service.urlOrType);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black text-white text-lg">
              17+
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">
                IOIS सभी 17+ डिजिटल सेवाएं
              </h3>
              <p className="text-xs text-slate-300">
                RTPS, 7 प्लांस, विद्यार्थी नोट्स, मौसम, टीवी, पंचांग, मंडी भाव व अन्य सभी डिजिटल सुविधाएं
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="सेवा खोजें (उदा. जमीन, मौसम, टीवी, जॉब्स)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'सभी (17+)' },
              { id: 'government', label: 'सरकारी व RTPS' },
              { id: 'education', label: 'शिक्षा' },
              { id: 'utility', label: 'दैनिक सुविधाएं' },
              { id: 'tools', label: 'टूल्स व ID' },
              { id: 'entertainment', label: 'टीवी व अन्य' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/50">
          
          {/* Subview display if user clicked an in-modal preview */}
          {activeSubView && (
            <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
              <button 
                onClick={() => setActiveSubView(null)}
                className="absolute top-3 right-3 text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-slate-700 font-bold"
              >
                वापस सूची पर जाएं ✕
              </button>

              {activeSubView === 'internal-weather' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CloudSun className="w-5 h-5 text-amber-500" /> लाइव मौसम व जिला पूर्वानुमान
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs text-slate-500 block">आज का तापमान</span>
                      <span className="text-2xl font-black text-slate-900 font-mono">31°C</span>
                      <span className="text-[11px] text-amber-700 font-medium">हल्की धूप व बादल</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="text-xs text-slate-500 block">आर्द्रता (Humidity)</span>
                      <span className="text-2xl font-black text-blue-900 font-mono">68%</span>
                      <span className="text-[11px] text-blue-700 font-medium">अनुकूल</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-xs text-slate-500 block">वर्षा की संभावना</span>
                      <span className="text-2xl font-black text-emerald-900 font-mono">20%</span>
                      <span className="text-[11px] text-emerald-700 font-medium">शाम को हल्की फुहार</span>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <span className="text-xs text-slate-500 block">हवा की गति</span>
                      <span className="text-2xl font-black text-purple-900 font-mono">14 km/h</span>
                      <span className="text-[11px] text-purple-700 font-medium">पश्चिम से पूर्व</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSubView === 'internal-panchang' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-rose-600" /> दैनिक पंचांग व शुभ मुहूर्त
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                      <span className="font-bold text-rose-900 block">शुभ मुहूर्त (अभिजीत)</span>
                      <p className="text-slate-700 mt-1">दोपहर 11:48 से 12:36 तक</p>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-1">✓ सभी नवीन कार्यों के लिए श्रेष्ठ</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="font-bold text-amber-900 block">तिथि व नक्षत्र</span>
                      <p className="text-slate-700 mt-1">शुक्ल पक्ष एकादशी, उत्तराफाल्गुनी नक्षत्र</p>
                      <span className="text-[10px] text-slate-500 block mt-1">विक्रम संवत 2083</span>
                    </div>
                    <div className="p-3 bg-slate-100 rounded-xl border border-slate-300">
                      <span className="font-bold text-slate-900 block">राहुकाल (वर्जित समय)</span>
                      <p className="text-red-700 font-bold mt-1">दोपहर 03:15 से 04:45 तक</p>
                      <span className="text-[10px] text-slate-500 block mt-1">इस समय नया कार्य प्रारंभ न करें</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSubView === 'internal-mandi' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" /> मंडी भाव (ताजा कृषि उपज दरें)
                  </h4>
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 font-bold text-slate-700">
                        <tr>
                          <th className="p-2">फसल / कमोडिटी</th>
                          <th className="p-2">न्यूनतम भाव (प्रति क्विंटल)</th>
                          <th className="p-2">अधिकतम भाव</th>
                          <th className="p-2">औसत मंडी भाव</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr><td className="p-2 font-bold">गेहूं (Wheat)</td><td className="p-2 font-mono">₹2,275</td><td className="p-2 font-mono">₹2,450</td><td className="p-2 font-bold text-emerald-700 font-mono">₹2,360</td></tr>
                        <tr><td className="p-2 font-bold">धान (Paddy Common)</td><td className="p-2 font-mono">₹2,183</td><td className="p-2 font-mono">₹2,300</td><td className="p-2 font-bold text-emerald-700 font-mono">₹2,240</td></tr>
                        <tr><td className="p-2 font-bold">सरसों (Mustard)</td><td className="p-2 font-mono">₹5,400</td><td className="p-2 font-mono">₹5,850</td><td className="p-2 font-bold text-emerald-700 font-mono">₹5,650</td></tr>
                        <tr><td className="p-2 font-bold">चना (Gram)</td><td className="p-2 font-mono">₹5,900</td><td className="p-2 font-mono">₹6,350</td><td className="p-2 font-bold text-emerald-700 font-mono">₹6,150</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSubView === 'internal-tv' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Tv className="w-5 h-5 text-red-600" /> लाइव टीवी व समाचार चैनल
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {['DD National', 'DD Kisan', 'Sansad TV', 'DD News'].map((ch) => (
                      <div key={ch} className="p-3 rounded-xl bg-slate-900 text-white text-center space-y-2">
                        <div className="w-8 h-8 rounded-full bg-red-600 mx-auto flex items-center justify-center font-bold text-xs">
                          LIVE
                        </div>
                        <span className="font-bold block">{ch}</span>
                        <span className="text-[10px] text-slate-400 block">आधिकारिक प्रसारण</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubView === 'internal-jobs' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-600" /> नवीनतम सरकारी जॉब अलर्ट्स
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-bold text-blue-900">SSC CGL 2026 - ऑनलाइन आवेदन प्रारंभ</span>
                        <span className="block text-slate-500 text-[11px]">अंतिम तिथि: 30 अक्टूबर • योग्यता: स्नातक</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-600 text-white rounded font-bold">Apply</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-bold text-emerald-900">रेलवे NTPC 11,558 पद भर्ती अधिसूचना</span>
                        <span className="block text-slate-500 text-[11px]">आयु सीमा: 18-33 वर्ष • वेतनमान: Level 2-6</span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-600 text-white rounded font-bold">Apply</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grid of All Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      {getServiceIcon(service.icon)}
                    </div>
                    {service.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {service.nameHindi}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-400 block">
                    {service.nameEnglish}
                  </span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAction(service)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>{service.actionText}</span>
                  {service.urlOrType.startsWith('http') && <ExternalLink className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 text-white text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800">
          <span className="text-slate-400">
            IOIS 17+ इंटीग्रेटेड सेवाएं • सभी सदस्यों हेतु सुलभ
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onScrollToPlans(); }}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              7 मास्टर प्लांस देखें
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              बंद करें
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
