import React, { useState, useEffect } from 'react';
import { subscribeToFirestoreInterviews } from '../services/userService';
import { 
  GraduationCap, 
  RefreshCw, 
  Search, 
  User, 
  Phone, 
  Award, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface InterviewRecord {
  id: string;
  candidateName: string;
  candidateMobile: string;
  totalScore: number;
  recommendedPlanId: number;
  recommendedPlanName: string;
  completedAt: string;
  answers: Array<{
    questionId: number;
    questionText: string;
    optionIndex: number;
    answerText: string;
    points: number;
  }>;
}

export const InterviewListManager: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/interviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.interviews)) {
        setInterviews(data.interviews);
      }
    } catch (e) {
      console.warn('Error loading interviews', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
    const unsub = subscribeToFirestoreInterviews((liveRecords) => {
      if (liveRecords && liveRecords.length > 0) {
        setInterviews(liveRecords);
      }
    });
    return () => unsub();
  }, []);

  const filteredInterviews = interviews.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.candidateName || '').toLowerCase().includes(q) ||
      (item.candidateMobile || '').includes(q) ||
      (item.recommendedPlanName || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>15-QUESTION INTERVIEW CANDIDATE DATABASE</span>
          </div>
          <h3 className="text-xl font-black text-white">
            🎯 15-सवाल कौशल साक्षात्कार परिणाम (Interview Submissions)
          </h3>
          <p className="text-xs text-slate-300">
            पोर्टल पर 15-प्रश्नों का टेस्ट पूरा करने वाले सभी अभ्यर्थियों के स्कोर और उत्तर यहाँ सुरक्षित हैं।
          </p>
        </div>

        <button
          onClick={fetchInterviews}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>रिफ्रेश रिकॉर्ड्स ({interviews.length})</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="कैंडिडेट का नाम, मोबाइल नंबर या प्लान खोजें..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none"
        />
      </div>

      {/* List of Interviews */}
      {filteredInterviews.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">कोई साक्षात्कार रिकॉर्ड नहीं मिला</h4>
          <p className="text-xs text-slate-400">
            जब कोई उम्मीदवार होमपेज पर 15-सवाल का टेस्ट पूरा करेगा, उसका संपूर्ण विवरण यहाँ प्रदर्शित होगा।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInterviews.map((record) => {
            const isExpanded = expandedId === record.id;
            return (
              <div
                key={record.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition space-y-3"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                      {record.candidateName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{record.candidateName}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {record.totalScore} Points
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <strong className="text-slate-200">{record.candidateMobile}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(record.completedAt).toLocaleString('hi-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">सुझाया गया प्लान:</span>
                      <span className="text-xs font-black text-amber-300">
                        {record.recommendedPlanName}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center gap-1 border border-slate-700 cursor-pointer"
                    >
                      <span>{isExpanded ? 'कम विवरण' : '15 सवाल देखें'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Question Breakdown */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800 space-y-2 text-xs animate-fadeIn">
                    <h5 className="font-bold text-amber-400 mb-2">अभ्यर्थी द्वारा दिए गए 15 उत्तर:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {record.answers?.map((ans, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="font-bold text-slate-200">
                            Q{idx + 1}. {ans.questionText}
                          </div>
                          <div className="text-emerald-300 font-medium flex items-center justify-between">
                            <span>→ {ans.answerText}</span>
                            <span className="text-[10px] text-slate-500">+{ans.points} pt</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
