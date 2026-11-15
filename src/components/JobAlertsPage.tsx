import React, { useState, useEffect, useCallback } from 'react';
import {
  getActiveAndUpcomingJobAlerts,
  fetchLiveJobAlerts,
  isJobAlertExpired,
  getDaysRemainingLabel,
} from '../services/liveUtilityService';
import { JobAlert, UserProfile } from '../types';
import {
  ExternalLink,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  CalendarCheck,
} from 'lucide-react';

interface JobAlertsPageProps {
  currentUser?: UserProfile | null;
  onOpenRegister?: () => void;
  onOpenSponsorAddMember?: () => void;
}

export const JobAlertsPage: React.FC<JobAlertsPageProps> = ({
  currentUser,
  onOpenRegister,
  onOpenSponsorAddMember,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'govt' | 'iois'>('all');
  const [jobsList, setJobsList] = useState<JobAlert[]>(() => getActiveAndUpcomingJobAlerts());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLiveFeedActive, setIsLiveFeedActive] = useState<boolean>(false);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState<string>(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  );

  const currentDateText = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const loadLiveJobs = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchLiveJobAlerts();
      const now = new Date();
      const nonExpired = result.jobs.filter((j) => !isJobAlertExpired(j, now));
      setJobsList(nonExpired);
      setIsLiveFeedActive(result.isLiveConnected);
      setLastUpdatedLabel(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadLiveJobs();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      void loadLiveJobs();
    }, 60_000);
    return () => clearInterval(interval);
  }, [loadLiveJobs]);

  const now = new Date();
  const filteredJobs = jobsList.filter((j) => {
    if (isJobAlertExpired(j, now)) return false;
    if (filterType === 'all') return true;
    return j.type === filterType;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header & Quick Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {isLiveFeedActive ? '● रियल-टाइम लाइव भर्ती अपडेट' : '● सक्रिय व आगामी रोजगार पोर्टल'} ({currentDateText})
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              वर्तमान व आगामी सरकारी / IOIS लाइव नौकरी अलर्ट
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              केवल वर्तमान में सक्रिय (Live) और आगामी (Upcoming) भर्तियां — पुरानी या समाप्त तिथि वाली भर्तियां स्वतः हट जाती हैं।
            </p>
          </div>

          {/* Filter Tabs + Live Refresh */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                सभी लाइव ({jobsList.filter((j) => !isJobAlertExpired(j, now)).length})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('govt')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'govt'
                    ? 'bg-sky-500 text-white font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏛️ सरकारी
              </button>

              <button
                type="button"
                onClick={() => setFilterType('iois')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'iois'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🌟 IOIS जॉब्स
              </button>
            </div>

            <button
              type="button"
              onClick={() => void loadLiveJobs()}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
              title="ताजा लाइव भर्ती अपडेट प्राप्त करें"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'अपडेट...' : 'लाइव रिफ्रेश'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>ऑटो-फ़िल्टर सक्रिय: केवल वर्तमान और आगामी (Upcoming) अवसर ही प्रदर्शित</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>अंतिम लाइव अपडेट: {lastUpdatedLabel}</span>
          </span>
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
          type="button"
          onClick={() => {
            if (currentUser && onOpenSponsorAddMember) onOpenSponsorAddMember();
            else onOpenRegister?.();
          }}
          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-300 transition shadow-xl shrink-0 cursor-pointer transform hover:scale-105 active:scale-95"
        >
          {currentUser ? 'अपने स्पॉन्सर से नया सदस्य जोड़ें →' : 'तुरंत रजिस्ट्रेशन करें →'}
        </button>
      </div>

      {/* 3. Jobs Grid (Zero Expired Jobs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          const daysRemaining = getDaysRemainingLabel(job.lastDateIso, now);
          const statusLabel =
            daysRemaining ||
            (job.statusType === 'upcoming'
              ? 'आगामी (UPCOMING)'
              : job.statusType === 'ongoing'
                ? 'सक्रिय (ONGOING)'
                : 'LIVE ACTIVE');

          return (
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
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                          job.type === 'iois'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                        }`}
                      >
                        {job.department}
                      </span>
                      {job.publishedAt && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {job.publishedAt}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-white mt-2 leading-snug">{job.title}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 border ${
                      job.statusType === 'upcoming'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">कुल पद / रिक्तियां:</span>
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
                    <span className="text-[10px] text-slate-400 block">आवेदन स्थिति / तिथि:</span>
                    <strong className="text-emerald-300 font-bold block">{job.lastDate}</strong>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-2 border-t border-slate-800">
                {job.type === 'iois' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser && onOpenSponsorAddMember) onOpenSponsorAddMember();
                      else onOpenRegister?.();
                    }}
                    className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>{currentUser ? 'अपने स्पॉन्सर से सदस्य जोड़ें' : 'IOIS इन-ऐप रजिस्ट्रेशन करें'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>आधिकारिक पोर्टल / अपडेट देखें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

