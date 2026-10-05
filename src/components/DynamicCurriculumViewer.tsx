import React, { useState, useMemo } from 'react';
import { PlanDetail, MemberProfile, CurriculumPage, PlanCurriculum } from '../types';
import { getCurriculumForPlan } from '../data/ioisPlansData';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Lightbulb, 
  Printer, 
  Download, 
  Check, 
  FileText, 
  Layers, 
  Award, 
  Sparkles,
  HelpCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface DynamicCurriculumViewerProps {
  plan: PlanDetail;
  currentUser: MemberProfile | null;
}

export const DynamicCurriculumViewer: React.FC<DynamicCurriculumViewerProps> = ({
  plan,
  currentUser
}) => {
  const curriculum: PlanCurriculum = useMemo(() => {
    return getCurriculumForPlan(plan.id);
  }, [plan.id]);

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [showAiPrompt, setShowAiPrompt] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [pageToast, setPageToast] = useState<string | null>(null);

  // Filter pages by subject if filtered
  const filteredPages = useMemo(() => {
    if (selectedSubject === 'all') {
      return curriculum.curriculumPages;
    }
    return curriculum.curriculumPages.filter(p => p.subject === selectedSubject);
  }, [curriculum, selectedSubject]);

  // Ensure valid current page
  const safePageIndex = Math.min(currentPageIndex, Math.max(0, filteredPages.length - 1));
  const activePage: CurriculumPage | undefined = filteredPages[safePageIndex] || filteredPages[0] || (curriculum.curriculumPages && curriculum.curriculumPages[0]);

  const handleNextPage = () => {
    if (safePageIndex < filteredPages.length - 1) {
      setCurrentPageIndex(safePageIndex + 1);
      setShowAiPrompt(false);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (safePageIndex > 0) {
      setCurrentPageIndex(safePageIndex - 1);
      setShowAiPrompt(false);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const handleSelectOption = (taskId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [taskId]: option }));
  };

  const toggleSolution = (taskId: string) => {
    setShowSolutions(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const toggleActivityDone = (taskId: string) => {
    setCompletedActivities(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handlePrintPage = () => {
    if (!activePage) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activePage?.titleHindi || 'IOIS पाठ'} - IOIS Study Hub</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; line-height: 1.6; color: #1e293b; }
            .header { border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px; }
            .badge { display: inline-block; background: #ffedd5; color: #c2410c; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            h1 { font-size: 22px; color: #0f172a; margin: 8px 0; }
            h2 { font-size: 16px; color: #ea580c; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; }
            .example-box { background: #f8fafc; border-left: 4px solid #ea580c; padding: 10px 14px; margin: 10px 0; border-radius: 4px; }
            .task-box { background: #f1f5f9; padding: 12px; border-radius: 6px; margin: 8px 0; }
            .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 11px; color: #64748b; }
            @media print { body { padding: 15px; } button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="badge">IOIS DIGITAL CLASSROOM • PLAN 0${plan.planNumber}</span>
            <h1>${activePage?.titleHindi || 'IOIS अध्ययन सामग्री'}</h1>
            <p><strong>English:</strong> ${activePage?.titleEnglish || ''} | <strong>Level:</strong> ${activePage?.gradeOrLevel || ''} | <strong>Subject:</strong> ${activePage?.subject || ''}</p>
          </div>

          <h2>1. अवधारणा परिचय (Concept Overview)</h2>
          <p>${activePage?.conceptOverview?.hindi || ''}</p>
          <p><em>${activePage?.conceptOverview?.english || ''}</em></p>

          <h2>2. वास्तविक दुनिया के उदाहरण (Real-World Applications)</h2>
          ${(activePage?.realWorldExamples || []).map(ex => `
            <div class="example-box">
              <strong>${ex?.title || ''}</strong>
              <p>${ex?.description || ''}</p>
              <p><em>व्यावहारिक उपयोग: ${ex?.practicalApplication || ''}</em></p>
            </div>
          `).join('')}

          <h2>3. महत्वपूर्ण तथ्य व नियम (Key Rules & Facts)</h2>
          <ul>
            ${activePage.keyFactsAndRules.map(f => `<li>${f}</li>`).join('')}
          </ul>

          <h2>4. स्व-मूल्यांकन एवं परीक्षा (Assessment Tasks)</h2>
          ${activePage.assessmentTasks.map((t, idx) => `
            <div class="task-box">
              <strong>प्रश्न ${idx + 1}: ${t.question}</strong>
              ${t.options ? `<ul>${t.options.map(opt => `<li>${opt}</li>`).join('')}</ul>` : ''}
              ${t.practicalTask ? `<p><strong>प्रायोगिक कार्य:</strong> ${t.practicalTask}</p>` : ''}
              ${t.correctAnswer ? `<p style="color: #15803d;"><strong>सही उत्तर:</strong> ${t.correctAnswer}</p>` : ''}
              ${t.explanation ? `<p><em>स्पष्टीकरण:</em> ${t.explanation}</p>` : ''}
            </div>
          `).join('')}

          <div class="footer">
            <p>अधिकृत सदस्य: ${currentUser ? currentUser.name : 'Vikas Kumar'} (ID: ${currentUser ? currentUser.memberId : 'IOIS999VK01'}) | IOIS राष्ट्रीय डिजिटल शिक्षा नेटवर्क</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleDownloadText = () => {
    if (!activePage) return;
    const lines = [
      `==================================================`,
      `IOIS PLATFORM ® DIGITAL CURRICULUM REPOSITORY`,
      `PLAN 0${plan.planNumber}: ${plan.name}`,
      `PAGE ${activePage.pageNumber}: ${activePage.titleHindi}`,
      `==================================================`,
      `Target Level: ${activePage.gradeOrLevel}`,
      `Subject: ${activePage.subject}`,
      ``,
      `--- [1. CONCEPT OVERVIEW] ---`,
      `Hindi: ${activePage.conceptOverview.hindi}`,
      `English: ${activePage.conceptOverview.english}`,
      ``,
      `--- [2. REAL-WORLD APPLICATIONS] ---`,
      ...activePage.realWorldExamples.map(e => `• ${e.title}\n  विवरण: ${e.description}\n  उपयोग: ${e.practicalApplication}\n`),
      `--- [3. KEY RULES & FACTS] ---`,
      ...activePage.keyFactsAndRules.map(f => `• ${f}`),
      ``,
      `--- [4. ASSESSMENT TASKS] ---`,
      ...activePage.assessmentTasks.map((t, i) => {
        let block = `Q${i + 1}: ${t.question}\n`;
        if (t.options) block += `Options: ${t.options.join(' | ')}\n`;
        if (t.correctAnswer) block += `Answer: ${t.correctAnswer}\n`;
        if (t.practicalTask) block += `Task: ${t.practicalTask}\n`;
        if (t.explanation) block += `Solution: ${t.explanation}\n`;
        return block;
      }),
      ``,
      `Authorized Member: ${currentUser ? currentUser.name : 'Vikas Kumar'} (${currentUser ? currentUser.memberId : 'IOIS999VK01'})`,
      `Generated from IOIS National Education Network`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IOIS_Plan0${plan.planNumber}_Page0${activePage.pageNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setPageToast(`पेज 0${activePage.pageNumber} फाइल डाउनलोड हो गई है!`);
    setTimeout(() => setPageToast(null), 3000);
  };

  if (!activePage) {
    return (
      <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-orange-400 mx-auto" />
        <p className="text-sm text-slate-300">इस विषय में कोई पृष्ठ उपलब्ध नहीं है।</p>
        <button
          onClick={() => setSelectedSubject('all')}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold"
        >
          सभी विषय देखें
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {pageToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 font-bold text-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{pageToast}</span>
        </div>
      )}

      {/* Curriculum Hub Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>गतिशील पृष्ठ-दर-पृष्ठ पाठ्यक्रम (Dynamic Curriculum)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                कुल पृष्ठ: {curriculum.totalCurriculumPages}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              {curriculum.planName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {curriculum.overviewSummary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrintPage}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="A4 साइज में प्रिंट करें"
            >
              <Printer className="w-3.5 h-3.5 text-orange-400" />
              <span>प्रिंट पेज</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>डाउनलोड</span>
            </button>
          </div>
        </div>

        {/* Subjects Filter Bar */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">विषय चुनें:</span>
          <button
            onClick={() => { setSelectedSubject('all'); setCurrentPageIndex(0); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedSubject === 'all'
                ? 'bg-orange-500 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            सभी विषय ({curriculum.curriculumPages.length})
          </button>
          {curriculum.subjectsAvailable.map((sub) => {
            const count = curriculum.curriculumPages.filter(p => p.subject === sub).length;
            if (count === 0) return null;
            return (
              <button
                key={sub}
                onClick={() => { setSelectedSubject(sub); setCurrentPageIndex(0); }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedSubject === sub
                    ? 'bg-orange-500 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Navigation & Pagination Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handlePrevPage}
          disabled={safePageIndex === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>पिछला पेज</span>
        </button>

        {/* Page Thumbnails Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          {filteredPages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => { setCurrentPageIndex(idx); setShowAiPrompt(false); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                idx === safePageIndex
                  ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-400'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              P{page.pageNumber}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={safePageIndex === filteredPages.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition-colors cursor-pointer shadow"
        >
          <span>अगला पेज</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ACTIVE PAGE CONTAINER */}
      <div className="bg-slate-800/90 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-300">
        
        {/* Page Title & Subject Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white font-mono">
                PAGE 0{activePage.pageNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-900 text-orange-400 border border-orange-500/30">
                {activePage.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activePage.gradeOrLevel}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {activePage.badge}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {activePage.titleHindi}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {activePage.titleEnglish}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activePage.aiImagePrompt && (
              <button
                type="button"
                onClick={() => setShowAiPrompt(!showAiPrompt)}
                className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{showAiPrompt ? 'प्रॉम्प्ट छिपाएं' : 'AI इमेज प्रॉम्प्ट'}</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Prompt Drawer if toggled */}
        {showAiPrompt && activePage.aiImagePrompt && (
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>HD Realistic Visual AI Blueprint Prompt (Flux / Midjourney / Imagen):</span>
              </span>
              <span className="text-[10px] text-purple-400 font-mono">Stand-alone prompt</span>
            </div>
            <p className="p-3 rounded-xl bg-slate-950 text-xs text-purple-200 font-mono leading-relaxed border border-purple-900 select-all">
              {activePage.aiImagePrompt}
            </p>
          </div>
        )}

        {/* Visual Content + Concept Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* HD Image Asset */}
          <div className="lg:col-span-5 space-y-2">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-lg group">
              <img
                src={activePage.imageUrl}
                alt={activePage.titleHindi}
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-600 text-white uppercase tracking-wider">
                  आधिकारिक विजुअल संदर्भ
                </span>
                <p className="text-xs font-bold text-white mt-1 drop-shadow">
                  {activePage.titleEnglish}
                </p>
              </div>
            </div>
          </div>

          {/* Dual-Language Concept Overview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-400">
                <Lightbulb className="w-4 h-4 text-orange-400" />
                <span>अवधारणा परिचय (Concept Definition)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {activePage.conceptOverview.hindi}
              </p>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">ENGLISH EXPLANATION:</span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  {activePage.conceptOverview.english}
                </p>
              </div>
            </div>

            {/* Key Facts & Rules */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>मुख्य नियम व तथ्य (Key Facts & Rules):</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activePage.keyFactsAndRules.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* SECTION 2: REAL-WORLD EXAMPLES (वास्तविक दुनिया की जानकारी) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>वास्तविक दुनिया के उदाहरण (Real-World Applications)</span>
            </h4>
            <span className="text-xs text-slate-400">दैनिक जीवन से जुड़ाव</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePage.realWorldExamples.map((ex, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-amber-500/50 transition-all space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h5 className="font-extrabold text-xs sm:text-sm text-white">
                    {ex?.title || ''}
                  </h5>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ex.description}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300/90 font-medium">
                  <strong>व्यावहारिक उपयोग:</strong> {ex.practicalApplication}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: VOCABULARY & FORMULAS (If available) */}
        {activePage.vocabularyOrFormulas && activePage.vocabularyOrFormulas.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>शब्दावली एवं प्रमुख सूत्र (Vocabulary & Formulas)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activePage.vocabularyOrFormulas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1.5"
                >
                  <span className="text-xs font-black text-cyan-400 block font-mono">
                    {item.term}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {item.definition}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-medium bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    उदा: {item.example}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: ASSESSMENT ZONE (परीक्षा एवं स्व-मूल्यांकन) */}
        <div className="space-y-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>मूल्यांकन एवं अभ्यास क्षेत्र (Assessment Tasks Zone)</span>
            </h4>
            <span className="text-[11px] text-emerald-400 font-bold">
              {activePage.assessmentTasks.length} टास्क उपलब्ध
            </span>
          </div>

          <div className="space-y-4">
            {activePage.assessmentTasks.map((task, idx) => {
              const isMcq = task.type === 'mcq';
              const userPick = selectedAnswers[task.id];
              const isCorrect = userPick === task.correctAnswer;
              const hasAnswered = !!userPick;
              const showSol = showSolutions[task.id];
              const isDone = completedActivities[task.id];

              return (
                <div
                  key={task.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-orange-400 border border-slate-700 shrink-0 mt-0.5">
                        {task.type.toUpperCase()}
                      </span>
                      <h5 className="font-extrabold text-xs sm:text-sm text-white leading-relaxed">
                        प्रश्न {idx + 1}: {task.question}
                      </h5>
                    </div>

                    {isMcq && hasAnswered && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black shrink-0 ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}>
                        {isCorrect ? '✓ सही उत्तर!' : '✗ गलत प्रयास'}
                      </span>
                    )}
                  </div>

                  {/* MCQ Options */}
                  {isMcq && task.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {task.options.map((option) => {
                        const isChosen = userPick === option;
                        let optionStyle = 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800';

                        if (hasAnswered) {
                          if (option === task.correctAnswer) {
                            optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'bg-red-950/80 border-red-500 text-red-200';
                          }
                        }

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleSelectOption(task.id, option)}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {hasAnswered && option === task.correctAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Practical Task Instructions if activity */}
                  {task.practicalTask && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                      <p>{task.practicalTask}</p>
                      <button
                        type="button"
                        onClick={() => toggleActivityDone(task.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isDone 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isDone ? '✓ अभ्यास पूरा हुआ' : 'अभ्यास पूरा चिह्नित करें'}</span>
                      </button>
                    </div>
                  )}

                  {/* Solution toggle and explanation */}
                  {task.explanation && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleSolution(task.id)}
                        className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showSol ? 'व्याख्या छिपाएं' : 'समाधान एवं स्पष्टीकरण देखें'}</span>
                      </button>

                      {showSol && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in duration-200">
                          <strong>स्पष्टीकरण:</strong> {task.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Page Navigation */}
        <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={safePageIndex === 0}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>पिछला पृष्ठ</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            पृष्ठ {safePageIndex + 1} / {filteredPages.length}
          </span>

          <button
            onClick={handleNextPage}
            disabled={safePageIndex === filteredPages.length - 1}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-colors cursor-pointer shadow"
          >
            <span>अगला पृष्ठ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
