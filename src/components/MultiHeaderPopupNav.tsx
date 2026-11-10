import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  CloudSun, 
  Briefcase, 
  Crown, 
  Compass, 
  GraduationCap, 
  Image as ImageIcon, 
  FileText, 
  ShieldCheck, 
  PhoneCall, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { PageType } from '../types';

export interface MultiHeaderPopupNavProps {
  onOpenPopupPage: (page: PageType) => void;
  onOpenFestivalModal: () => void;
  onOpenRashifalModal: () => void;
  onOpenPhotoCompressor: () => void;
  variant?: 'topbar' | 'menu' | 'dashboard';
}

export const MultiHeaderPopupNav: React.FC<MultiHeaderPopupNavProps> = ({
  onOpenPopupPage,
  onOpenFestivalModal,
  onOpenRashifalModal,
  onOpenPhotoCompressor,
  variant = 'topbar'
}) => {
  const [activeHeaderTab, setActiveHeaderTab] = useState<'all' | 'header1' | 'header2' | 'header3'>('all');

  // Define the 3 Categorized Headers
  const headerCategories = [
    {
      id: 'header1',
      number: 'हेडर 1',
      title: 'वैदिक, पंचांग व दैनिक अपडेट्स',
      shortTitle: 'वैदिक व दैनिक',
      icon: Calendar,
      color: 'from-amber-500/20 via-orange-500/10 to-amber-500/20',
      borderColor: 'border-amber-500/40',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      items: [
        {
          id: 'panchang',
          label: 'पंचांग व मुहूर्त',
          subLabel: 'शुभ चौघड़िया व पर्व',
          icon: Calendar,
          action: () => onOpenPopupPage('panchang-rashifal'),
          badge: 'लाइव',
          color: 'text-amber-400',
          btnClass: 'hover:border-amber-400'
        },
        {
          id: 'rashifal',
          label: 'दैनिक राशिफल',
          subLabel: '12 राशियां व उपाय',
          icon: Sparkles,
          action: onOpenRashifalModal,
          badge: '12 राशियां',
          color: 'text-purple-400',
          btnClass: 'hover:border-purple-400'
        },
        {
          id: 'weather',
          label: 'लाइव मौसम',
          subLabel: 'तापमान व 7 दिन अलर्ट',
          icon: CloudSun,
          action: () => onOpenPopupPage('weather'),
          badge: 'रडार',
          color: 'text-sky-400',
          btnClass: 'hover:border-sky-400'
        },
        {
          id: 'jobs',
          label: 'जॉब अलर्ट्स',
          subLabel: 'सरकारी व प्राइवेट भर्ती',
          icon: Briefcase,
          action: () => onOpenPopupPage('jobs'),
          badge: 'भर्तियां',
          color: 'text-emerald-400',
          btnClass: 'hover:border-emerald-400'
        }
      ]
    },
    {
      id: 'header2',
      number: 'हेडर 2',
      title: 'शिक्षा, करियर व डिजिटल टूल्स',
      shortTitle: 'शिक्षा व टूल्स',
      icon: GraduationCap,
      color: 'from-violet-500/20 via-blue-500/10 to-violet-500/20',
      borderColor: 'border-violet-500/40',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
      items: [
        {
          id: 'plans',
          label: '7 मास्टर प्लान',
          subLabel: '₹10-₹999 व 70% आय',
          icon: Crown,
          action: () => onOpenPopupPage('plans'),
          badge: '70% आय',
          color: 'text-yellow-400',
          btnClass: 'hover:border-yellow-400'
        },
        {
          id: 'career',
          label: 'करियर गाइड',
          subLabel: 'इंटरव्यू व असेसमेंट',
          icon: Compass,
          action: () => onOpenPopupPage('assessment'),
          badge: 'टेस्ट',
          color: 'text-blue-400',
          btnClass: 'hover:border-blue-400'
        },
        {
          id: 'study',
          label: 'स्टडी व क्विज',
          subLabel: 'NCERT नोट्स 1-12th',
          icon: GraduationCap,
          action: () => onOpenPopupPage('student-study'),
          badge: 'NCERT',
          color: 'text-indigo-400',
          btnClass: 'hover:border-indigo-400'
        },
        {
          id: 'photocompress',
          label: 'फोटो कंप्रेसर',
          subLabel: '20KB/50KB RTPS फॉर्म',
          icon: ImageIcon,
          action: onOpenPhotoCompressor,
          badge: '20-50KB',
          color: 'text-pink-400',
          btnClass: 'hover:border-pink-400'
        }
      ]
    },
    {
      id: 'header3',
      number: 'हेडर 3',
      title: 'नागरिक सेवा, सुरक्षा व सहायता',
      shortTitle: 'नागरिक व सुरक्षा',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 via-teal-500/10 to-emerald-500/20',
      borderColor: 'border-emerald-500/40',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      items: [
        {
          id: 'rtps',
          label: 'सरकारी सेवा (RTPS)',
          subLabel: 'जाति, आय, जमीन रसीद',
          icon: FileText,
          action: () => onOpenPopupPage('rtps-services'),
          badge: 'आधिकारिक',
          color: 'text-emerald-400',
          btnClass: 'hover:border-emerald-400'
        },
        {
          id: 'parents',
          label: 'अभिभावक सुरक्षा गाइड',
          subLabel: 'बाल सुरक्षा व पैरेंट्स हब',
          icon: ShieldCheck,
          action: () => onOpenPopupPage('parents'),
          badge: 'सुरक्षा',
          color: 'text-teal-400',
          btnClass: 'hover:border-teal-400'
        },
        {
          id: 'contact',
          label: 'संपर्क केंद्र',
          subLabel: '24x7 हेल्पलाइन व FAQ',
          icon: PhoneCall,
          action: () => onOpenPopupPage('contact'),
          badge: '24x7 Help',
          color: 'text-amber-400',
          btnClass: 'hover:border-amber-400'
        }
      ]
    }
  ];

  const visibleHeaders = activeHeaderTab === 'all' 
    ? headerCategories 
    : headerCategories.filter(h => h.id === activeHeaderTab);

  return (
    <div className={`w-full ${variant === 'menu' ? 'space-y-3' : 'space-y-2.5 sm:space-y-3'}`}>
      
      {/* Tab Switcher: View All 3 Headers or individual headers */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap px-1">
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-black">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] sm:text-xs">त्वरित पॉपअप हेडर सिस्टम (11+ सेवाएं):</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveHeaderTab('all')}
            className={`px-2 py-0.5 sm:py-1 rounded-lg transition cursor-pointer ${
              activeHeaderTab === 'all'
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            तीनों हेडर
          </button>
          {headerCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveHeaderTab(cat.id as any)}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition cursor-pointer truncate ${
                activeHeaderTab === cat.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.number}
            </button>
          ))}
        </div>
      </div>

      {/* Render 3 Headers */}
      <div className="space-y-2 sm:space-y-2.5">
        {visibleHeaders.map((header) => {
          const HeaderIcon = header.icon;
          return (
            <div 
              key={header.id}
              className={`bg-slate-950/95 border ${header.borderColor} rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-md relative overflow-hidden backdrop-blur-md transition-all`}
            >
              {/* Header Title Bar */}
              <div className="flex items-center justify-between gap-2 mb-1.5 px-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider border ${header.badgeColor}`}>
                    {header.number}
                  </span>
                  <h4 className="text-[11px] sm:text-xs font-black text-white truncate flex items-center gap-1">
                    <HeaderIcon className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{header.title}</span>
                  </h4>
                </div>
                <span className="text-[9px] text-slate-400 hidden sm:inline">
                  (पॉपअप विंडो में तुरंत खुलेगा)
                </span>
              </div>

              {/* Responsive Grid of Popup Buttons - Auto adjusts on any screen width */}
              <div className={`grid gap-1.5 sm:gap-2 ${
                header.items.length === 4 
                  ? 'grid-cols-2 sm:grid-cols-4' 
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}>
                {header.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      className={`group relative bg-slate-900/90 hover:bg-slate-850 border border-slate-750 p-1.5 sm:p-2 rounded-xl text-left transition flex items-center gap-2 cursor-pointer active:scale-95 touch-manipulation select-none min-h-[44px] sm:min-h-[48px] ${item.btnClass}`}
                      title={`${item.label} का पॉपअप विंडो खोलें`}
                    >
                      {/* Icon */}
                      <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg bg-slate-950 border border-slate-700/80 group-hover:border-amber-400/80 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <ItemIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.color}`} />
                      </div>

                      {/* Text Column - Guaranteed no overflow on mobile */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] sm:text-[11.5px] font-black text-white truncate block group-hover:text-amber-300 transition-colors">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          <span className="text-[8.5px] sm:text-[9.5px] text-slate-400 truncate block">
                            {item.subLabel}
                          </span>
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[8px] font-black px-1 rounded uppercase shrink-0">
                            पॉपअप
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
