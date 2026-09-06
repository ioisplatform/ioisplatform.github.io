import React, { useState } from 'react';
import { LIVE_JOB_ALERTS } from '../services/liveUtilityService';
import { JobAlert, PageType } from '../types';
import { 
  Briefcase, 
  Building2, 
  GraduationCap, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Coins, 
  Users, 
  MapPin, 
  Clock,
  ShieldCheck
} from 'lucide-react';

interface JobAlertsPageProps {
  onOpenRegister: () => void;
}

export const JobAlertsPage: React.FC<JobAlertsPageProps> = ({ onOpenRegister }) => {
  const [filterType, setFilterType] = useState<'all' | 'govt' | 'iois'>('all');

  const filteredJobs = LIVE_JOB_ALERTS.filter((j) => {
    if (filterType === 'all') return true;
    return j.type === filterType;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header & Quick Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
              <span>लाइव नौकरी अलर्ट व IOIS रोजगार केंद्र 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              सरकारी व प्राइवेट नौकरी अलर्ट एवं IOIS करियर
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              SSC, रेलवे, बैंकिंग, राज्य पुलिस की सभी नई भर्तियां और IOIS में वर्क-फ्रॉम-होम डिजिटल इनकम के अवसर।
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              सभी भर्तियां (All)
            </button>

            <button
              onClick={() => setFilterType('govt')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'govt'
                  ? 'bg-sky-500 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ सरकारी नौकरियां
            </button>

            <button
              onClick={() => setFilterType('iois')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'iois'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌟 IOIS डिजिटल जॉब्स
            </button>
          </div>
        </div>
      </div>

      {/* 2. IOIS Career Highlight Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-green-500/20 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>घर बैठे 70% दैनिक इंसेंटिव व करियर अवसर</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            IOIS डिजिटल पार्टनर व डिस्ट्रिक्ट कोऑर्डिनेटर बनें
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            बिना किसी इंटरव्यू के तत्काल जॉइनिंग। अपने मोबाइल से डिजिटल साक्षरता व शैक्षिक किट साझा करें और प्रतिदिन ₹500 से ₹2,500 की सीधी आय अर्जित करें।
          </p>
        </div>

        <button
          onClick={onOpenRegister}
          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-300 transition shadow-xl shrink-0 cursor-pointer transform hover:scale-105 active:scale-95"
        >
          तुरंत रजिस्ट्रेशन करें →
        </button>
      </div>

      {/* 3. Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`p-6 rounded-3xl border transition flex flex-col justify-between space-y-5 shadow-xl ${
              job.type === 'iois'
                ? 'bg-slate-900/95 border-amber-500/40 hover:border-amber-400'
                : 'bg-slate-900/90 border-slate-800 hover:border-sky-500/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                    job.type === 'iois'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                  }`}>
                    {job.department}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1.5 leading-snug">{job.title}</h3>
                </div>

                {job.isNew && (
                  <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-black shrink-0 animate-pulse">
                    NEW ALERT
                  </span>
                )}
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">कुल पद (Vacancies):</span>
                  <strong className="text-emerald-400 font-bold">{job.totalPosts}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">वेतन / आय (Salary):</span>
                  <strong className="text-amber-300 font-bold">{job.salary}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">शैक्षणिक योग्यता:</span>
                  <span className="text-slate-200 font-medium truncate block">{job.qualification}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">अंतिम तिथि:</span>
                  <strong className="text-rose-400 font-bold block">{job.lastDate}</strong>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2 border-t border-slate-800">
              {job.type === 'iois' ? (
                <button
                  onClick={onOpenRegister}
                  className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>IOIS इन-ऐप रजिस्ट्रेशन करें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
                >
                  <span>आधिकारिक पोर्टल पर अप्लाई करें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
