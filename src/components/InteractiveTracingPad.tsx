import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, 
  Eraser, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Volume2,
  BookOpen
} from 'lucide-react';
import { AlphabetObjectIllustration } from './AlphabetIllustrations';
import { NURSERY_A_TO_Z_PAGES } from './NurseryAlphabetWorkbook';

interface InteractiveTracingPadProps {
  planId: string;
  planNumber: number;
  onTracingCompleted?: () => void;
}

// Hindi & Other Subject Tracing Templates
const OTHER_TRACING_TEMPLATES: Record<string, { id: string; label: string; guideText: string; hint: string }[]> = {
  'hindi-swar': [
    { id: 'swar-a', label: 'स्वर: अ (अनार)', guideText: 'अ', hint: 'बाईं ओर दो घुमाव बनाएं, फिर बीच में छोटी रेखा और खड़ी रेखा खींचें।' },
    { id: 'swar-aa', label: 'स्वर: आ (आम)', guideText: 'आ', hint: 'अ बनाकर दाईं तरफ एक और खड़ी मात्रा (ा) लगाएं।' },
    { id: 'swar-i', label: 'स्वर: इ (इमली)', guideText: 'इ', hint: 'छोटी खड़ी रेखा से शुरू करके अंग्रेजी का S जैसा घुमाव बनाएं।' },
    { id: 'swar-ee', label: 'स्वर: ई (ईख)', guideText: 'ई', hint: 'इ बनाकर ऊपर की ओर रेफ (ी) की मात्रा लगाएं।' },
    { id: 'swar-u', label: 'स्वर: उ (उल्लू)', guideText: 'उ', hint: 'बाईं तरफ तीन जैसा घुमाव बनाएं।' },
    { id: 'vyanjan-ka', label: 'व्यंजन: क (कमल)', guideText: 'क', hint: 'बीच में खड़ी रेखा खींचें, बाईं ओर गोल वृत्त और दाईं ओर नीचे मुड़ा हुआ चाप बनाएं।' },
    { id: 'vyanjan-kha', label: 'व्यंजन: ख (खरगोश)', guideText: 'ख', hint: 'र जैसा घुमाव बनाकर व को जोड़ें।' },
    { id: 'vyanjan-ga', label: 'व्यंजन: ग (गमला)', guideText: 'ग', hint: 'खड़ी रेखा को नीचे गोल मोड़ें और साथ में एक सीधी खड़ी रेखा खींचें।' }
  ],
  'numbers': [
    { id: 'num-123', label: 'गिनती: 1 2 3 (१ २ ३)', guideText: '1 2 3', hint: 'संख्याओं के ऊपर सावधानी से अपनी पेंसिल चलाएं।' },
    { id: 'num-456', label: 'गिनती: 4 5 6 (४ ५ ६)', guideText: '4 5 6', hint: 'संख्याओं 4, 5 और 6 के ऊपर हाथ फेरें।' },
    { id: 'num-789', label: 'गिनती: 7 8 9 (७ ८ ९)', guideText: '7 8 9', hint: 'संख्याओं 7, 8 और 9 का अभ्यास करें।' },
    { id: 'num-10', label: 'गिनती: 10 (१०)', guideText: '10', hint: 'एक और शून्य लिखकर दस बनाएं।' }
  ],
  'plan-02': [
    { id: 'flowchart', label: 'कंप्यूटर फ्लोचार्ट (Start → Process → End)', guideText: 'START → [CODE] → END', hint: 'प्रोग्रामिंग लॉजिक फ्लोचार्ट बनाएं।' },
    { id: 'keyboard-shortcuts', label: 'शॉर्टकट कीज: Ctrl+C, Ctrl+V', guideText: 'Ctrl+C / Ctrl+V', hint: 'कंप्यूटर शॉर्टकट का हाथ से अभ्यास करें।' }
  ],
  'plan-03': [
    { id: 'cursive-sentence', label: 'Cursive: Practice Makes Perfect', guideText: 'Practice Makes Perfect', hint: 'अंग्रेजी में सुंदर करसिव हैंडराइटिंग का अभ्यास करें।' },
    { id: 'self-intro', label: 'Interview Intro: Hello Sir/Ma\'am', guideText: 'Hello Sir / Ma\'am', hint: 'स्पष्ट और आत्मविश्वास से भरा हैंडराइटिंग अभ्यास।' }
  ],
  'plan-04': [
    { id: 'family-budget', label: 'बजट ट्री (आय → बचत → व्यय)', guideText: 'Income = Save + Spend', hint: 'पारिवारिक वित्तीय योजना का आरेख बनाएं।' }
  ],
  'plan-05': [
    { id: 'math-formula', label: 'बीजगणित: (a+b)² = a² + 2ab + b²', guideText: '(a+b)² = a² + 2ab + b²', hint: 'गणितीय सूत्र को लिखकर याद करें।' }
  ],
  'plan-06': [
    { id: 'rtps-steps', label: 'RTPS आवेदन प्रक्रिया', guideText: 'Apply → Verify → Download', hint: 'ऑनलाइन सेवा के चरणों का प्रवाह चार्ट।' }
  ],
  'plan-07': [
    { id: 'leadership-vision', label: 'लीडरशिप रोडमैप: Vision 2030', guideText: 'Vision → Action → Success', hint: 'अपने जीवन और करियर का मास्टर रोडमैप बनाएं।' }
  ]
};

export const InteractiveTracingPad: React.FC<InteractiveTracingPadProps> = ({
  planId,
  planNumber,
  onTracingCompleted
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#dc2626'); // Red pen
  const [brushSize, setBrushSize] = useState(6);
  const [isDone, setIsDone] = useState(false);

  // Tab: 'alpha' | 'hindi' | 'num'
  const [activeTab, setActiveTab] = useState<'alpha' | 'hindi' | 'num'>(
    planId === 'plan-01' ? 'alpha' : 'alpha'
  );

  // For A to Z alphabet
  const [selectedAlphaIndex, setSelectedAlphaIndex] = useState(0);
  const currentAlphaPage = NURSERY_A_TO_Z_PAGES[selectedAlphaIndex] || NURSERY_A_TO_Z_PAGES[0];

  // For Hindi / Num
  const hindiList = OTHER_TRACING_TEMPLATES['hindi-swar'];
  const [selectedHindiId, setSelectedHindiId] = useState(hindiList[0].id);

  const numList = OTHER_TRACING_TEMPLATES['numbers'];
  const [selectedNumId, setSelectedNumId] = useState(numList[0].id);

  // Active guide text
  const currentGuideText = activeTab === 'alpha' 
    ? `${currentAlphaPage.letter}  ${currentAlphaPage.lowerLetter}` 
    : activeTab === 'hindi'
      ? (hindiList.find(h => h.id === selectedHindiId)?.guideText || 'अ')
      : (numList.find(n => n.id === selectedNumId)?.guideText || '1 2 3');

  const currentHint = activeTab === 'alpha'
    ? `नीचे दिए गए बिंदुओं पर पेंसिल/उंगली चलाकर ${currentAlphaPage.letter} (${currentAlphaPage.lowerLetter}) लिखने का अभ्यास करें: ${currentAlphaPage.strokeOrderGuide}`
    : activeTab === 'hindi'
      ? (hindiList.find(h => h.id === selectedHindiId)?.hint || '')
      : (numList.find(n => n.id === selectedNumId)?.hint || '');

  // Redraw when template changes
  useEffect(() => {
    clearCanvas();
  }, [activeTab, selectedAlphaIndex, selectedHindiId, selectedNumId]);

  // Adjust canvas width to container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth || 700;
    canvas.height = 260;
    redrawGuide();
  }, [currentGuideText]);

  const redrawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crisp white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 4-Line School Notebook Guides (English primary ruled lines)
    // Red Topline
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, 60);
    ctx.lineTo(canvas.width - 30, 60);
    ctx.stroke();

    // Blue Midline (Dashed)
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(30, 110);
    ctx.lineTo(canvas.width - 30, 110);
    ctx.stroke();

    // Blue Baseline (Dashed)
    ctx.beginPath();
    ctx.moveTo(30, 160);
    ctx.lineTo(canvas.width - 30, 160);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Red Bottomline
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, 210);
    ctx.lineTo(canvas.width - 30, 210);
    ctx.stroke();

    // Dotted Tracing Guides for letter / character
    ctx.save();
    ctx.font = 'bold 90px "Comic Sans MS", "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;

    // Draw dotted outline guide
    ctx.strokeText(currentGuideText, canvas.width / 2, 135);
    ctx.fillText(currentGuideText, canvas.width / 2, 135);
    ctx.restore();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Explicit 'मिटाएं' action
  const clearCanvas = () => {
    redrawGuide();
    setIsDone(false);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `IOIS_Tracing_${activeTab}_${activeTab === 'alpha' ? currentAlphaPage.letter : 'slate'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const colors = [
    { label: 'लाल (Red)', hex: '#dc2626' },
    { label: 'नीला (Blue)', hex: '#2563eb' },
    { label: 'हरा (Green)', hex: '#16a34a' },
    { label: 'काला (Black)', hex: '#0f172a' },
    { label: 'केसरिया (Orange)', hex: '#ea580c' },
    { label: 'बैंगनी (Purple)', hex: '#9333ea' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
      
      {/* Tab Switcher: A-Z Alphabet vs Hindi Swar vs Numbers */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Pencil className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
              अक्षर व अंक डिजिटल स्लेट (2. अक्षर लिखो)
            </h3>
            <p className="text-xs text-slate-500">
              नीचे दिए गए बिंदुओं पर पेंसिल/उंगली चलाकर अक्षर लिखने का अभ्यास करें
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('alpha')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'alpha' 
                ? 'bg-orange-600 text-white shadow-xs' 
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            🔤 A to Z (26 अक्षर)
          </button>
          <button
            onClick={() => setActiveTab('hindi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'hindi' 
                ? 'bg-orange-600 text-white shadow-xs' 
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            🇮🇳 हिंदी स्वर (अ से ई)
          </button>
          <button
            onClick={() => setActiveTab('num')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'num' 
                ? 'bg-orange-600 text-white shadow-xs' 
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            🔢 1 2 3 गिनती
          </button>
        </div>
      </div>

      {/* A to Z Horizontal Quick Selection Bar */}
      {activeTab === 'alpha' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>अक्षर चुनें (Select Letter A to Z):</span>
            <span className="text-orange-600 font-mono">
              पेज {currentAlphaPage.pageNumber} of 26
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {NURSERY_A_TO_Z_PAGES.map((p, idx) => (
              <button
                key={p.letter}
                onClick={() => setSelectedAlphaIndex(idx)}
                className={`w-8 h-8 rounded-xl font-black text-xs shrink-0 transition-all flex items-center justify-center ${
                  selectedAlphaIndex === idx
                    ? 'bg-orange-600 text-white shadow-md scale-110 ring-2 ring-orange-300'
                    : 'bg-slate-50 text-slate-700 hover:bg-orange-50 border border-slate-200'
                }`}
              >
                {p.letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hindi Selection Bar */}
      {activeTab === 'hindi' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {hindiList.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHindiId(h.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 border transition-all ${
                selectedHindiId === h.id
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border-slate-200'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      )}

      {/* Numbers Selection Bar */}
      {activeTab === 'num' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {numList.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNumId(n.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 border transition-all ${
                selectedNumId === n.id
                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border-slate-200'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}

      {/* Sachitra Object Banner for Current Letter */}
      {activeTab === 'alpha' && (
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center shrink-0 shadow-xs">
              <AlphabetObjectIllustration letter={currentAlphaPage.letter} className="w-11 h-11" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">
                  {currentAlphaPage.letter} for {currentAlphaPage.word}
                </span>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                  {currentAlphaPage.hindiMeaning}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                {currentAlphaPage.section1Instruction}
              </p>
            </div>
          </div>

          <button
            onClick={() => speak(`${currentAlphaPage.letter} for ${currentAlphaPage.word}। ${currentAlphaPage.section1Instruction}`)}
            className="p-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0"
            title="बोलकर सुनें"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      )}

      {/* Tracing Controls Bar with prominent 'मिटाएं' Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 mr-1 hidden sm:inline">पेंसिल रंग:</span>
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => setColor(c.hex)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                color === c.hex ? 'scale-125 border-slate-900 shadow-xs' : 'border-white'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600">मोटाई:</span>
          {[4, 7, 10].map((s) => (
            <button
              key={s}
              onClick={() => setBrushSize(s)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                brushSize === s ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {s === 4 ? 'पतली' : s === 7 ? 'मध्यम' : 'मोटी'}
            </button>
          ))}
        </div>

        {/* Action Buttons: मिटाएं & Save */}
        <div className="flex items-center gap-2">
          {/* PROMINENT 'मिटाएं' BUTTON */}
          <button
            onClick={clearCanvas}
            className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-red-300 text-xs font-black text-red-600 hover:bg-red-50 hover:border-red-500 flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            title="स्लेट साफ करें (मिटाएं)"
          >
            <Eraser className="w-4 h-4 text-red-600" />
            <span>मिटाएं</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
            title="ड्राइंग सहेजें"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">डाउनलोड</span>
          </button>
        </div>

      </div>

      {/* Prompt Instruction */}
      <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
          ✍
        </span>
        <p className="font-semibold">
          {currentHint}
        </p>
      </div>

      {/* Main Drawing Canvas Container with 4-Line Notebook */}
      <div className="relative aspect-[7/3] max-h-[300px] w-full rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner bg-white select-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
        />
      </div>

      {/* Bottom Footer Feedback & Completion */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500 font-medium">
          💡 युक्ति: टच स्क्रीन मोबाइल/टैबलेट पर अपनी उंगली से सीधे डॉट्स पर रेखा खींचें।
        </div>

        <button
          onClick={() => {
            setIsDone(true);
            if (onTracingCompleted) onTracingCompleted();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-all ${
            isDone 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 hover:scale-105'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isDone ? '✓ अभ्यास पूर्ण हुआ!' : 'अभ्यास पूर्ण मार्क करें'}</span>
        </button>
      </div>

    </div>
  );
};
