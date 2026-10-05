import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Award, 
  AlertCircle, 
  ChevronRight,
  BookOpen,
  HelpCircle,
  UploadCloud,
  Check
} from 'lucide-react';

interface StudentHomeworkSystemProps {
  planId: string;
  planNumber: number;
  planName: string;
  onHomeworkCompleted?: () => void;
}

interface HomeworkAssignment {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  stars: number;
  instructions: string[];
  sampleSolutionGuide: string;
}

const PLAN_HOMEWORK_DATA: Record<string, HomeworkAssignment[]> = {
  'plan-01': [
    {
      id: 'hw-01-swar',
      title: 'होमवर्क 1: स्वर अ से अः तक लिखकर 5 सरल शब्द बनाएं',
      subject: 'हिंदी भाषा (Hindi)',
      deadline: 'आज शाम तक',
      stars: 5,
      instructions: [
        'अपनी कॉपी में सभी 11 स्वर (अ, आ, इ, ई, उ, ऊ, ऋ, ए, ऐ, ओ, औ) सुंदर लिखावट में लिखें।',
        'अ से अनार, आ से आम जैसे 5 सरल वाक्य बनाएं।',
        'नीचे दिए गए बॉक्स में अपना उत्तर टाइप करें या कॉपी का सारांश लिखें।'
      ],
      sampleSolutionGuide: 'उत्तर उदाहरण: स्वर: अ, आ, इ, ई, उ, ऊ, ऋ, ए, ऐ, ओ, औ। शब्द: अमन, आम, इमली, ईख, उपवन।'
    },
    {
      id: 'hw-01-math',
      title: 'होमवर्क 2: 1 से 30 तक गिनती व 2, 3 का पहाड़ा',
      subject: 'गणित (Mathematics)',
      deadline: 'कल सुबह तक',
      stars: 5,
      instructions: [
        '1 से 30 तक गिनती शब्दों और अंकों में लिखें।',
        '2 का पहाड़ा (2 × 1 = 2 से 2 × 10 = 20) और 3 का पहाड़ा लिखकर अभ्यास करें।'
      ],
      sampleSolutionGuide: 'उत्तर उदाहरण: 2 × 1 = 2, 2 × 2 = 4, 2 × 3 = 6, 2 × 4 = 8... 3 × 10 = 30।'
    },
    {
      id: 'hw-01-phonics',
      title: 'होमवर्क 3: 5 फलों व 5 पालतू जानवरों के अंग्रेजी नाम',
      subject: 'English & Phonics',
      deadline: '2 दिन में',
      stars: 5,
      instructions: [
        '5 फलों के अंग्रेजी नाम (उदा. Apple, Mango, Banana, Orange, Grapes) लिखें।',
        '5 जानवरों के अंग्रेजी नाम (उदा. Cow, Dog, Cat, Horse, Goat) लिखें।'
      ],
      sampleSolutionGuide: 'Fruits: Apple, Mango, Banana, Orange, Guava. Animals: Cow, Dog, Cat, Sheep, Camel.'
    }
  ],
  'plan-02': [
    {
      id: 'hw-02-comp',
      title: 'होमवर्क 1: कंप्यूटर इनपुट-आउटपुट डिवाइसेज व 10 शॉर्टकट्स',
      subject: 'कंप्यूटर साक्षरता',
      deadline: 'कल शाम तक',
      stars: 5,
      instructions: [
        '4 इनपुट डिवाइस (कीबोर्ड, माउस, स्कैनर, माइक) और 4 आउटपुट डिवाइस (मॉनिटर, प्रिंटर, स्पीकर, प्रोजेक्टर) के कार्य लिखें।',
        'Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+S, Alt+F4 के उपयोग लिखें।'
      ],
      sampleSolutionGuide: 'Input: Keyboard, Mouse, Mic, Scanner. Output: Monitor, Printer, Speaker. Shortcuts: Copy, Paste, Undo, Save.'
    },
    {
      id: 'hw-02-ai',
      title: 'होमवर्क 2: AI चैटजीपीटी / जेमिनी हेतु 3 उपयोगी प्रॉम्प्ट्स',
      subject: 'AI टूल्स व उत्पादकता',
      deadline: '3 दिन में',
      stars: 5,
      instructions: [
        'स्कूल में 2 दिन की छुट्टी के लिए आवेदन पत्र लिखने का एआई प्रॉम्प्ट तैयार करें।',
        'सामान्य ज्ञान सीखने और गणित का सवाल हल करने का एक प्रॉम्प्ट लिखें।'
      ],
      sampleSolutionGuide: 'प्रॉम्प्ट: "कृपया मुझे कक्षा 8वीं के छात्र के रूप में बुखार की वजह से 2 दिन के अवकाश हेतु प्रधानाचार्य को हिंदी में प्रार्थना पत्र लिखकर दें।"'
    }
  ],
  'plan-03': [
    {
      id: 'hw-03-intro',
      title: 'होमवर्क 1: अपना 1 मिनट का इंग्लिश सेल्फ-इंट्रोडक्शन लिखें',
      subject: 'स्पोकन इंग्लिश',
      deadline: 'कल शाम तक',
      stars: 5,
      instructions: [
        'Name, Qualification, Native place, Strengths और Career Goal को 6-8 वाक्यों में अंग्रेजी में ड्राफ्ट करें।',
        'शीशे के सामने 3 बार बोलकर अभ्यास करें।'
      ],
      sampleSolutionGuide: 'Sample: "Good morning! My name is Rahul. I have completed my intermediate with first division. My strength is quick learning and dedication. I want to build a career in digital services."'
    },
    {
      id: 'hw-03-vocab',
      title: 'होमवर्क 2: दैनिक ऑफिस बातचीत के 10 प्रोफेशनल वाक्य',
      subject: 'बिजनेस कम्युनिकेशन',
      deadline: '2 दिन में',
      stars: 5,
      instructions: [
        'ईमेल भेजने, मीटिंग अटेंड करने और सहायता मांगने के 10 सरल अंग्रेजी वाक्य बनाएं।'
      ],
      sampleSolutionGuide: '1. Please find the attached document. 2. Thank you for your assistance. 3. Could you please clarify this step?'
    }
  ],
  'plan-04': [
    {
      id: 'hw-04-budget',
      title: 'होमवर्क 1: घरेलू मासिक बजट और बचत का अनुमानित चार्ट',
      subject: 'व्यावहारिक गणित व वित्त',
      deadline: 'कल शाम तक',
      stars: 5,
      instructions: [
        '₹20,000 की काल्पनिक मासिक आय पर राशन, शिक्षा, स्वास्थ्य व बचत (20%) का सही विभाजन करें।'
      ],
      sampleSolutionGuide: 'राशन व खर्च: ₹10,000 (50%), शिक्षा: ₹4,000 (20%), आपातकालीन/स्वास्थ्य: ₹2,000 (10%), बचत: ₹4,000 (20%)।'
    }
  ],
  'plan-05': [
    {
      id: 'hw-05-math',
      title: 'होमवर्क 1: बीजगणित व त्रिकोणमिति के 5 मुख्य सूत्रों का हल',
      subject: 'बोर्ड परीक्षा तैयारी',
      deadline: 'कल शाम तक',
      stars: 5,
      instructions: [
        '(a+b)², (a-b)², sin²θ + cos²θ = 1, और पाइथागोरस प्रमेय (h² = p² + b²) को सिद्ध करें या उदाहरण से हल करें।'
      ],
      sampleSolutionGuide: 'Formula: sin²30° + cos²30° = (1/2)² + (√3/2)² = 1/4 + 3/4 = 1. सिद्ध हुआ।'
    }
  ],
  'plan-06': [
    {
      id: 'hw-06-rtps',
      title: 'होमवर्क 1: RTPS पोर्टल पर आय व निवास प्रमाण पत्र आवेदन स्टेप्स',
      subject: 'डिजिटल सरकारी सेवाएं',
      deadline: 'कल शाम तक',
      stars: 5,
      instructions: [
        'serviceonline.bihar.gov.in या राज्य पोर्टल पर फॉर्म भरने के 5 मुख्य चरण क्रम से लिखें।'
      ],
      sampleSolutionGuide: 'चरण: 1. पोर्टल खोलें → 2. सामान्य प्रशासन विभाग चुनें → 3. फॉर्म में नाम, आधार, फोटो भरें → 4. ओटीपी सत्यापन → 5. रसीद डाउनलोड।'
    }
  ],
  'plan-07': [
    {
      id: 'hw-07-roadmap',
      title: 'होमवर्क 1: 90 दिनों की डिजिटल स्वावलंबन मास्टर कार्ययोजना',
      subject: 'सुप्रीम लीडरशिप',
      deadline: 'कल शाम तक',
      stars: 5,
      instructions: [
        'महीना 1 (कौशल सीखना), महीना 2 (टीम व मेंटरशिप) और महीना 3 (स्थिर परिणाम) का स्पष्ट विवरण लिखें।'
      ],
      sampleSolutionGuide: 'मास्टर रोडमैप: 30 दिन में 7 योजनाओं का गहन अध्ययन, 60वें दिन 10 छात्रों को डिजिटल साक्षर बनाना, 90वें दिन सक्रिय कम्युनिटी लीडर बनना।'
    }
  ]
};

export const StudentHomeworkSystem: React.FC<StudentHomeworkSystemProps> = ({
  planId,
  planNumber,
  planName,
  onHomeworkCompleted
}) => {
  const homeworkList = PLAN_HOMEWORK_DATA[planId] || PLAN_HOMEWORK_DATA['plan-01'] || [];
  
  const [selectedHomework, setSelectedHomework] = useState<HomeworkAssignment>(homeworkList[0]);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [submissions, setSubmissions] = useState<Record<string, { answer: string; submittedAt: string; status: 'checked'; marks: string; feedback: string }>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selectedHomework whenever planId changes
  useEffect(() => {
    const list = PLAN_HOMEWORK_DATA[planId] || PLAN_HOMEWORK_DATA['plan-01'] || [];
    if (list.length > 0 && (!selectedHomework || !list.some(h => h.id === selectedHomework?.id))) {
      setSelectedHomework(list[0]);
    }
  }, [planId]);

  const activeHomework = selectedHomework || homeworkList[0];

  // Load submissions from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`iois_hw_submissions_${planId}`);
      if (raw) {
        setSubmissions(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  }, [planId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim() || !activeHomework) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}, ${now.toLocaleDateString('hi-IN')}`;
      
      const newSubmissions = {
        ...submissions,
        [activeHomework.id]: {
          answer: studentAnswer.trim(),
          submittedAt: timeStr,
          status: 'checked' as const,
          marks: `${activeHomework.stars}/${activeHomework.stars} स्टार्स (100% अंक)`,
          feedback: '✓ उत्कृष्ट कार्य! आपने सभी निर्देशों का सटीक पालन किया है। आपकी लिखावट और उत्तर की समझ सराहनीय है।'
        }
      };

      setSubmissions(newSubmissions);
      try {
        localStorage.setItem(`iois_hw_submissions_${planId}`, JSON.stringify(newSubmissions));
      } catch (e) {
        console.error(e);
      }

      setIsSubmitting(false);
      setStudentAnswer('');
      if (onHomeworkCompleted) {
        onHomeworkCompleted();
      }
    }, 500);
  };

  const completedCount = Object.keys(submissions).filter(id => homeworkList.some(h => h.id === id)).length;
  const currentSubmission = activeHomework ? submissions[activeHomework.id] : undefined;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                PLAN 0{planNumber} • गृहकार्य (Homework)
              </span>
              <span className="text-xs font-bold text-slate-500">
                ({completedCount}/{homeworkList.length} पूर्ण)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              दैनिक गृहकार्य व असाइनमेंट चेकिंग सिस्टम
            </h3>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${(completedCount / homeworkList.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid: List of Assignments (Left) & Active Submission Desk (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Task Selector */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            गृहकार्य सूची:
          </span>

          <div className="space-y-2">
            {homeworkList.map((hw, idx) => {
              const isSelected = hw.id === selectedHomework.id;
              const isDone = Boolean(submissions[hw.id]);

              return (
                <button
                  key={hw.id}
                  type="button"
                  onClick={() => {
                    setSelectedHomework(hw);
                    setShowGuide(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : `0${idx + 1}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-emerald-800">
                        {hw.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ⭐ {hw.stars} अंक
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 truncate mt-0.5">
                      {hw.title}
                    </h4>
                    <span className={`text-[10px] font-bold mt-1 inline-block ${
                      isDone ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {isDone ? '✓ जांचा व सत्यापित' : '● जमा करना शेष है'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Assignment Workspace */}
        <div className="lg:col-span-2 space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
          
          {/* Assignment Header */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                {activeHomework?.subject || 'सामान्य विषय'}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>समय सीमा: {activeHomework?.deadline || 'आज शाम तक'}</span>
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-black text-slate-900">
              {activeHomework?.title || 'दैनिक गृहकार्य'}
            </h4>

            {/* Step by step instructions */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block">निर्देश (Instructions):</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                {(activeHomework?.instructions || []).map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Submission Form or Verified Result */}
          {currentSubmission ? (
            /* Checked & Graded Box */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span className="font-black text-sm text-emerald-900">
                      होमवर्क सफलतापूर्वक सत्यापित व जांचा गया!
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white font-mono shadow-sm">
                    {currentSubmission.marks}
                  </span>
                </div>

                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  {currentSubmission.feedback}
                </p>

                <div className="text-[10px] text-emerald-700 font-mono pt-1 border-t border-emerald-200">
                  जमा करने का समय: {currentSubmission.submittedAt}
                </div>
              </div>

              {/* Student's submitted text */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">
                  आपके द्वारा जमा किया गया उत्तर:
                </span>
                <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                  {currentSubmission.answer}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const copy = { ...submissions };
                    delete copy[selectedHomework.id];
                    setSubmissions(copy);
                    localStorage.setItem(`iois_hw_submissions_${planId}`, JSON.stringify(copy));
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
                >
                  पुनः उत्तर संपादित करें (Redo Assignment)
                </button>
              </div>
            </div>
          ) : (
            /* Active Form Submission */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>अपना लिखित उत्तर यहाँ दर्ज करें:</span>
                  <button
                    type="button"
                    onClick={() => setShowGuide(!showGuide)}
                    className="text-[11px] text-emerald-700 hover:underline font-bold flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showGuide ? 'मार्गदर्शिका छुपाएं' : 'उत्तर का संकेत देखें'}</span>
                  </button>
                </label>

                {showGuide && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    💡 <strong>उत्तर संकेत:</strong> {selectedHomework.sampleSolutionGuide}
                  </div>
                )}

                <textarea
                  rows={5}
                  required
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="अपना उत्तर, कॉपी का सारांश, या हल यहाँ टाइप करें..."
                  className="w-full p-3.5 rounded-2xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-slate-500">
                  💡 उत्तर सबमिट करते ही आपका गृहकार्य तुरंत सत्यापित हो जाएगा।
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'जांचा जा रहा है...' : 'होमवर्क सबमिट करें (Submit Work)'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
