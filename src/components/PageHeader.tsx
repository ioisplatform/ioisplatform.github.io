import React from 'react';
import { PageType } from '../types';
import { 
  Home, 
  ArrowLeft, 
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
  Scale,
  Building2,
  Briefcase,
  FileText,
  Grid
} from 'lucide-react';

interface PageHeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenServices?: () => void;
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenServices,
  title,
  subtitle,
}) => {
  const quickLinks = [
    { id: 'home' as PageType, label: 'होम', icon: Home },
    { id: 'rtps-services' as PageType, label: 'RTPS व जमीन', icon: FileText },
    { id: 'plans' as PageType, label: '7 प्लान्स', icon: Crown },
    { id: 'weather' as PageType, label: 'मौसम', icon: CloudSun },
    { id: 'news' as PageType, label: 'लाइव टीवी', icon: Tv },
    { id: 'panchang-rashifal' as PageType, label: 'पंचांग', icon: Clock },
    { id: 'mandi-market' as PageType, label: 'मंडी भाव', icon: Scale },
    { id: 'register' as PageType, label: 'रजिस्ट्रेशन', icon: UserPlus },
    { id: 'idcard' as PageType, label: 'ID कार्ड', icon: CreditCard },
    { id: 'calculator' as PageType, label: 'कैलकुलेटर', icon: Calculator },
    { id: 'jobs' as PageType, label: 'जॉब अलर्ट्स', icon: Briefcase },
    { id: 'govt-schemes' as PageType, label: 'सरकारी वेबसाइट्स', icon: Building2 },
    { id: 'contact' as PageType, label: 'हेल्पलाइन', icon: PhoneCall },
  ];

  return (
    <div className="w-full space-y-3 sm:space-y-4 pb-3 sm:pb-5 border-b border-slate-800">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          {/* Back to Home Button */}
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>होम पेज</span>
          </button>

          {/* All Services Dialog Trigger */}
          {onOpenServices && (
            <button
              onClick={onOpenServices}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer shrink-0"
            >
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span>सभी सेवाएं</span>
            </button>
          )}
        </div>

        {/* Quick Switcher Pills for other pages */}
        <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none bg-slate-950 p-1 sm:p-1.5 rounded-xl border border-slate-800 text-[11px]">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Title & Breadcrumb Header */}
      <div className="pt-1">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-slate-400 mb-1">
          <button 
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-slate-200 capitalize">{currentPage}</span>
        </div>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white">{title}</h2>
        {subtitle && <p className="text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
