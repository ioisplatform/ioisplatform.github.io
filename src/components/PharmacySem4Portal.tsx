import React, { useState } from 'react';
import { 
  PHARMACY_SEM4_SUBJECTS, 
  PharmacySubject 
} from '../data/pharmacySem4Data';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Printer, 
  Download, 
  FileText, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  Search, 
  Flame, 
  Zap,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export const PharmacySem4Portal: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('medchem-1');
  const [activeTab, setActiveTab] = useState<'10mark' | '5mark' | '2mark' | 'gpat'>('10mark');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedUnit, setExpandedUnit] = useState<number | 'all'>('all');
  const [selectedGpatAnswers, setSelectedGpatAnswers] = useState<Record<string, number>>({});

  const activeSubject: PharmacySubject = PHARMACY_SEM4_SUBJECTS.find(s => s.id === selectedSubjectId) || PHARMACY_SEM4_SUBJECTS[0];

  const handleSelectGpatOption = (qKey: string, optIdx: number, correctIdx: number) => {
    if (selectedGpatAnswers[qKey] !== undefined) return;
    setSelectedGpatAnswers(prev => ({ ...prev, [qKey]: optIdx }));
    if (optIdx === correctIdx) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playTryAgain();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Pharmacy 4th Semester Platform */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 border-2 border-indigo-500/40 shadow-2xl text-white relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black uppercase tracking-wider">
              <span className="text-sm">💊</span>
              <span>B.Pharm 4th Semester • PCI Approved Official Portal</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              फार्मेसी 4th सेमेस्टर <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">अल्टीमेट स्टडी व प्रश्न बैंक</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pharmacy Council of India (PCI) के सम्पूर्ण 5 विषयों (BP401T से BP405T) के 10-अंक निबंध, 5-अंक शॉर्ट नोट्स, 2-अंक परिभाषाएं, दवाइयों की संरचना (SAR & Synthesis) और GPAT अति-संभावित प्रश्न।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4 text-cyan-300" />
              <span>सेमेस्टर नोट्स प्रिंट करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 SUBJECTS HORIZONTAL NAVIGATION SWITCHER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PHARMACY_SEM4_SUBJECTS.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectId(sub.id);
                soundEffects.playBoing();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-2 active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-cyan-400 shadow-xl scale-102 ring-2 ring-cyan-400/30'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{sub.icon}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-slate-100 text-slate-600'
                }`}>
                  {sub.code}
                </span>
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm line-clamp-1">{sub.name}</h4>
                <p className={`text-[11px] line-clamp-1 mt-0.5 font-medium ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {sub.hindiName}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* QUESTION FORMAT TABS (10-Mark, 5-Mark, 2-Mark, GPAT MCQs) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: '10mark', label: '📑 10-अंक दीर्घ उत्तरीय प्रश्न (Long Essay)', count: activeSubject.units.length },
            { id: '5mark', label: '📋 5-अंक शॉर्ट नोट्स (Short Notes)', count: activeSubject.units.reduce((acc, u) => acc + u.fiveMarkQuestions.length, 0) },
            { id: '2mark', label: '💡 2-अंक अनिवार्य परिभाषाएं (2-Mark Defs)', count: activeSubject.units.reduce((acc, u) => acc + u.twoMarkQuestions.length, 0) },
            { id: 'gpat', label: '🎯 GPAT अति-संभावित MCQs', count: activeSubject.units.reduce((acc, u) => acc + u.gpatProbabilityMcqs.length, 0) },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search within subject */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="दवा का नाम या टॉपिक खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* CONTENT DISPLAY SECTION */}
      <div className="space-y-6">
        {activeSubject.units.map((unit) => {
          return (
            <div key={unit.unitNumber} className="rounded-3xl p-6 sm:p-7 bg-white border-2 border-slate-200 shadow-md space-y-5">
              
              {/* Unit Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
                    {activeSubject.code} • {activeSubject.name}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {unit.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {unit.keyTopics.map((kt, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      #{kt}
                    </span>
                  ))}
                </div>
              </div>

              {/* TAB 1: 10-MARK QUESTIONS */}
              {activeTab === '10mark' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <span className="px-2.5 py-0.5 rounded bg-amber-500 text-white font-black text-[10px] uppercase">
                      10-Marks University Standard Question
                    </span>
                    <h4 className="text-base font-black text-slate-900">
                      {unit.tenMarkQuestion.question}
                    </h4>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-3 font-medium text-xs leading-relaxed">
                    <span className="text-xs font-black uppercase text-cyan-300 block tracking-wider">
                      आदर्श उत्तर रूपरेखा (Model Answer Key & Points):
                    </span>
                    {unit.tenMarkQuestion.answerStructure.map((step, sIdx) => (
                      <p key={sIdx} className="text-slate-200 pl-2 border-l-2 border-indigo-400">
                        {step}
                      </p>
                    ))}

                    {unit.tenMarkQuestion.diagramNotes && (
                      <div className="mt-3 p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                        <span><strong>डायग्राम नोट:</strong> {unit.tenMarkQuestion.diagramNotes}</span>
                      </div>
                    )}

                    {unit.tenMarkQuestion.gpatTrick && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>GPAT ट्रिक:</strong> {unit.tenMarkQuestion.gpatTrick}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: 5-MARK QUESTIONS */}
              {activeTab === '5mark' && (
                <div className="space-y-4">
                  {unit.fiveMarkQuestions.map((fq, fIdx) => (
                    <div key={fIdx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[10px]">
                          5-अंक प्रश्न #{fIdx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-slate-900">
                          {fq.question}
                        </h4>
                      </div>

                      <div className="space-y-1.5 pl-2 text-xs text-slate-700">
                        {fq.answerPoints.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span className="leading-relaxed">{pt}</span>
                          </div>
                        ))}
                      </div>

                      {fq.reactionOrStructure && (
                        <div className="p-2.5 rounded-xl bg-white border border-slate-300 font-mono text-xs text-indigo-950">
                          {fq.reactionOrStructure}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: 2-MARK COMPULSORY DEFINITIONS */}
              {activeTab === '2mark' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {unit.twoMarkQuestions.map((tq, tIdx) => (
                    <div key={tIdx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-black text-[10px] uppercase">
                          2-Marks Definition
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          {tq.question}
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {tq.definition}
                        </p>
                      </div>

                      {tq.mnemonic && (
                        <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{tq.mnemonic}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: GPAT MCQS */}
              {activeTab === 'gpat' && (
                <div className="space-y-4">
                  {unit.gpatProbabilityMcqs.map((gq, gIdx) => {
                    const qKey = `${unit.unitNumber}-${gIdx}`;
                    const selected = selectedGpatAnswers[qKey];
                    const isAnswered = selected !== undefined;
                    const isCorrect = selected === gq.correctIndex;

                    return (
                      <div key={gIdx} className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-red-600 text-red-600" />
                            <span>{gq.probability}</span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            GPAT / NIPER Probable MCQ #{gIdx + 1}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                          {gq.question}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {gq.options.map((opt, oIdx) => {
                            let btnStyle = 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800';
                            if (isAnswered) {
                              if (oIdx === gq.correctIndex) {
                                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-400';
                              } else if (oIdx === selected) {
                                btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400';
                              } else {
                                btnStyle = 'opacity-50 bg-slate-50 border-slate-200';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={isAnswered}
                                onClick={() => handleSelectGpatOption(qKey, oIdx, gq.correctIndex)}
                                className={`p-3 rounded-xl border-2 text-left text-xs font-medium transition-all flex items-center gap-2 ${btnStyle}`}
                              >
                                <span className="w-5 h-5 rounded bg-slate-200 text-slate-800 font-black text-[11px] flex items-center justify-center shrink-0">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1.5 text-xs animate-in fade-in">
                            <div className="flex items-center gap-2">
                              {isCorrect ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" /> सही उत्तर!
                                </span>
                              ) : (
                                <span className="text-rose-400 font-bold flex items-center gap-1">
                                  <XCircle className="w-4 h-4" /> गलत उत्तर! सही विकल्प: {String.fromCharCode(65 + gq.correctIndex)}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 leading-relaxed font-medium">
                              <strong>व्याख्या:</strong> {gq.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
