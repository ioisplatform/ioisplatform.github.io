import React, { useRef, useState, useEffect } from 'react';
import { 
  Palette, 
  Eraser, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Smile, 
  Volume2, 
  Check, 
  Award,
  Heart,
  Star,
  Brush
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface TemplateShape {
  id: string;
  name: string;
  emoji: string;
  description: string;
  drawOutline: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const TEMPLATES: TemplateShape[] = [
  {
    id: 'apple',
    name: 'मीठा सेब (Apple)',
    emoji: '🍎',
    description: 'रंग भरो: लाल सेब, भूरी डंडी और हरी पत्ती!',
    drawOutline: (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2 + 15;
      const r = Math.min(w, h) * 0.28;

      ctx.save();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#334155';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Apple Body
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.7);
      ctx.bezierCurveTo(cx + r * 0.6, cy - r * 1.1, cx + r * 1.2, cy - r * 0.3, cx + r * 1.1, cy + r * 0.4);
      ctx.bezierCurveTo(cx + r * 1.0, cy + r * 1.1, cx + r * 0.2, cy + r * 1.1, cx, cy + r * 0.9);
      ctx.bezierCurveTo(cx - r * 0.2, cy + r * 1.1, cx - r * 1.0, cy + r * 1.1, cx - r * 1.1, cy + r * 0.4);
      ctx.bezierCurveTo(cx - r * 1.2, cy - r * 0.3, cx - r * 0.6, cy - r * 1.1, cx, cy - r * 0.7);
      ctx.stroke();

      // Stem
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.7);
      ctx.quadraticCurveTo(cx - 10, cy - r * 1.3, cx + 15, cy - r * 1.4);
      ctx.stroke();

      // Leaf
      ctx.beginPath();
      ctx.moveTo(cx + 5, cy - r * 1.1);
      ctx.quadraticCurveTo(cx + r * 0.6, cy - r * 1.5, cx + r * 0.8, cy - r * 1.0);
      ctx.quadraticCurveTo(cx + r * 0.4, cy - r * 0.9, cx + 5, cy - r * 1.1);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'mango',
    name: 'रसीला आम (Mango)',
    emoji: '🥭',
    description: 'फलों का राजा! पीला व नारंगी रंग भरो!',
    drawOutline: (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2 + 10;
      const r = Math.min(w, h) * 0.28;

      ctx.save();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#334155';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(cx - r * 0.2, cy - r * 1.0);
      ctx.bezierCurveTo(cx + r * 1.1, cy - r * 0.9, cx + r * 1.2, cy + r * 0.6, cx + r * 0.2, cy + r * 1.1);
      ctx.bezierCurveTo(cx - r * 0.8, cy + r * 1.3, cx - r * 1.1, cy + r * 0.3, cx - r * 0.8, cy - r * 0.4);
      ctx.bezierCurveTo(cx - r * 0.6, cy - r * 0.9, cx - r * 0.4, cy - r * 1.0, cx - r * 0.2, cy - r * 1.0);
      ctx.stroke();

      // Stem and leaf
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.2, cy - r * 1.0);
      ctx.lineTo(cx - r * 0.25, cy - r * 1.3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - r * 0.25, cy - r * 1.15);
      ctx.quadraticCurveTo(cx - r * 0.8, cy - r * 1.4, cx - r * 0.7, cy - r * 1.0);
      ctx.quadraticCurveTo(cx - r * 0.4, cy - r * 1.0, cx - r * 0.25, cy - r * 1.15);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'elephant',
    name: 'प्यारा हाथी (Cute Elephant)',
    emoji: '🐘',
    description: 'गोलू हाथी! सलेटी या नीला रंग भरो!',
    drawOutline: (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.25;

      ctx.save();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#334155';
      ctx.lineCap = 'round';

      // Body
      ctx.beginPath();
      ctx.arc(cx - r * 0.2, cy + r * 0.2, r * 0.8, 0, Math.PI * 2);
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(cx + r * 0.5, cy - r * 0.3, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Ear
      ctx.beginPath();
      ctx.arc(cx + r * 0.3, cy - r * 0.3, r * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Trunk (सूँड)
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.8, cy - r * 0.2);
      ctx.quadraticCurveTo(cx + r * 1.3, cy - r * 0.1, cx + r * 1.2, cy + r * 0.5);
      ctx.quadraticCurveTo(cx + r * 1.1, cy + r * 0.8, cx + r * 0.9, cy + r * 0.6);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.6, cy + r * 0.8);
      ctx.lineTo(cx - r * 0.6, cy + r * 1.3);
      ctx.moveTo(cx - r * 0.2, cy + r * 0.9);
      ctx.lineTo(cx - r * 0.2, cy + r * 1.3);
      ctx.moveTo(cx + r * 0.2, cy + r * 0.8);
      ctx.lineTo(cx + r * 0.2, cy + r * 1.3);
      ctx.stroke();

      // Eye
      ctx.beginPath();
      ctx.arc(cx + r * 0.6, cy - r * 0.4, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'rocket',
    name: 'अंतरिक्ष रॉकेट (Space Rocket)',
    emoji: '🚀',
    description: 'ज़ूम! अंतरिक्ष में उड़ने वाला रॉकेट!',
    drawOutline: (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.3;

      ctx.save();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#334155';
      ctx.lineCap = 'round';

      // Rocket body
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 1.2);
      ctx.quadraticCurveTo(cx + r * 0.6, cy - r * 0.2, cx + r * 0.5, cy + r * 0.8);
      ctx.lineTo(cx - r * 0.5, cy + r * 0.8);
      ctx.quadraticCurveTo(cx - r * 0.6, cy - r * 0.2, cx, cy - r * 1.2);
      ctx.stroke();

      // Window
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.2, r * 0.25, 0, Math.PI * 2);
      ctx.stroke();

      // Left fin
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.45, cy + r * 0.4);
      ctx.lineTo(cx - r * 0.9, cy + r * 0.9);
      ctx.lineTo(cx - r * 0.5, cy + r * 0.8);
      ctx.stroke();

      // Right fin
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.45, cy + r * 0.4);
      ctx.lineTo(cx + r * 0.9, cy + r * 0.9);
      ctx.lineTo(cx + r * 0.5, cy + r * 0.8);
      ctx.stroke();

      // Flames
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.3, cy + r * 0.85);
      ctx.lineTo(cx, cy + r * 1.3);
      ctx.lineTo(cx + r * 0.3, cy + r * 0.85);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'star',
    name: 'जादुई सितारा (Magic Star)',
    emoji: '⭐',
    description: 'चमकीला पीला सितारा बनाओ!',
    drawOutline: (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2;
      const spikes = 5;
      const outerRadius = Math.min(w, h) * 0.32;
      const innerRadius = outerRadius * 0.5;

      ctx.save();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#334155';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.stroke();

      // Cute face on star
      ctx.beginPath();
      ctx.arc(cx - 25, cy - 10, 6, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 10, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy + 10, 20, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'freehand',
    name: 'सफ़ेद खाली कैनवास (Free Hand)',
    emoji: '🎨',
    description: 'अपनी मर्जी से कुछ भी चित्र या कार्टून बनाओ!',
    drawOutline: () => {
      // blank
    }
  }
];

const BRIGHT_COLORS = [
  { name: 'लाल (Red)', hex: '#ef4444', ring: 'ring-red-400' },
  { name: 'गुलाबी (Pink)', hex: '#ec4899', ring: 'ring-pink-400' },
  { name: 'नारंगी (Orange)', hex: '#f97316', ring: 'ring-orange-400' },
  { name: 'पीला (Yellow)', hex: '#eab308', ring: 'ring-yellow-400' },
  { name: 'नींबू हरा (Lime)', hex: '#84cc16', ring: 'ring-lime-400' },
  { name: 'हरा (Green)', hex: '#10b981', ring: 'ring-emerald-400' },
  { name: 'आसमानी (Cyan)', hex: '#06b6d4', ring: 'ring-cyan-400' },
  { name: 'नीला (Sky Blue)', hex: '#3b82f6', ring: 'ring-blue-400' },
  { name: 'गहरा नीला (Indigo)', hex: '#6366f1', ring: 'ring-indigo-400' },
  { name: 'बैंगनी (Purple)', hex: '#a855f7', ring: 'ring-purple-400' },
  { name: 'चॉकलेट (Brown)', hex: '#854d0e', ring: 'ring-amber-700' },
  { name: 'काला (Dark Outline)', hex: '#0f172a', ring: 'ring-slate-700' }
];

const STICKERS = ['⭐', '💖', '👑', '🌈', '🍦', '🚀', '🌺', '🎈', '🐵', '🐱'];

export const KidsDrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('apple');
  const [currentColor, setCurrentColor] = useState<string>('#ef4444');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [cheerMsg, setCheerMsg] = useState<string>('वाह! कितना सुंदर रंग भर रहे हो! 🎨');

  // Redraw template whenever selectedTemplate changes
  useEffect(() => {
    initCanvas();
  }, [selectedTemplate]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill cheerful warm background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tmpl = TEMPLATES.find(t => t.id === selectedTemplate);
    if (tmpl && tmpl.id !== 'freehand') {
      tmpl.drawOutline(ctx, canvas.width, canvas.height);
    }

    // Save initial state to history
    setHistory([canvas.toDataURL()]);
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-10), canvas.toDataURL()]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHist = [...history];
    newHist.pop(); // remove current
    const prevData = newHist[newHist.length - 1];
    setHistory(newHist);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = prevData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    soundEffects.playBoing();
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (selectedSticker) {
      // Stamp sticker at position!
      ctx.font = `${brushSize * 3}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedSticker, x, y);
      saveHistory();
      soundEffects.playSuccess();
      setCheerMsg(`शाबाश! आपने ${selectedSticker} स्टिकर चिपकाया! ✨`);
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedSticker) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundEffects.playCelebration();
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `iois-kids-drawing-${selectedTemplate}.png`;
    a.click();
    setCheerMsg('अद्भुत! आपकी ड्राइंग आपके फोन में सेव हो गई! 🏆');
  };

  const speakKidsCheer = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(cheerMsg);
      u.lang = 'hi-IN';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 border-4 border-amber-300 shadow-2xl space-y-6">
      
      {/* Playful Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-3xl shadow-inner animate-bounce">
            🎨
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm flex items-center gap-2">
              <span>बच्चों का रंग-बिरंगा ड्राइंग और कलर पैड!</span>
              <Sparkles className="w-5 h-5 text-yellow-200 fill-yellow-200 animate-spin" />
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/90">
              (Kids Colorful Drawing Zone • कोई बोरिंग ब्लैक-एंड-व्हाइट नहीं, सिर्फ चटकदार मस्ती!)
            </p>
          </div>
        </div>

        {/* Chintu Cheer Avatar & Sound */}
        <div className="flex items-center gap-2 bg-white/25 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/30">
          <span className="text-2xl">🐵</span>
          <div className="text-left">
            <span className="text-[11px] block font-black text-yellow-100">चिंटू बंदर बोला:</span>
            <span className="text-xs font-bold">{cheerMsg}</span>
          </div>
          <button
            onClick={() => {
              speakKidsCheer();
              soundEffects.playCelebration();
            }}
            className="p-2 rounded-xl bg-white text-rose-600 hover:bg-yellow-100 active:scale-95 shadow-md"
            title="चिंटू की आवाज़ सुनो"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STEP 1: Select Cartoon Outline */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <Palette className="w-4 h-4 text-rose-500" />
          <span>1. मनपसंद चित्र चुनें (Click on a Template to Color):</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => {
                setSelectedTemplate(tmpl.id);
                setSelectedSticker(null);
                soundEffects.playBoing();
                setCheerMsg(`शाबाश! अब ${tmpl.name} में सुंदर रंग भरो! 🖍️`);
              }}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1 active:scale-95 ${
                selectedTemplate === tmpl.id
                  ? 'bg-gradient-to-b from-rose-500 to-pink-600 text-white border-rose-600 shadow-lg scale-105 ring-4 ring-rose-300'
                  : 'bg-white text-slate-800 border-amber-200 hover:border-rose-400 hover:bg-rose-50/50 shadow-sm'
              }`}
            >
              <span className="text-3xl">{tmpl.emoji}</span>
              <span className="text-xs font-black leading-tight line-clamp-1">{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: Color Palette & Tools Bar */}
      <div className="p-4 rounded-2xl bg-white border-2 border-amber-200 shadow-md space-y-4">
        
        {/* Colors Row */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1">
              <span>🌈 सुंदर चटक रंग चुनें (12 Bright Colors):</span>
            </span>
            <span className="text-[11px] font-bold text-rose-600">
              {isEraser ? 'रबर (Eraser) चालू है' : `चुना हुआ रंग: ${BRIGHT_COLORS.find(c => c.hex === currentColor)?.name || ''}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {BRIGHT_COLORS.map((col) => (
              <button
                key={col.hex}
                onClick={() => {
                  setCurrentColor(col.hex);
                  setIsEraser(false);
                  setSelectedSticker(null);
                  soundEffects.playBoing();
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl transition-all shadow-md active:scale-90 flex items-center justify-center border-2 border-white ${
                  currentColor === col.hex && !isEraser && !selectedSticker
                    ? `scale-115 ring-4 ${col.ring} shadow-xl`
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              >
                {currentColor === col.hex && !isEraser && !selectedSticker && (
                  <Check className={`w-5 h-5 ${col.hex === '#0f172a' ? 'text-white' : 'text-slate-900'} stroke-[3]`} />
                )}
              </button>
            ))}

            {/* Eraser Button */}
            <button
              onClick={() => {
                setIsEraser(true);
                setSelectedSticker(null);
                soundEffects.playBoing();
              }}
              className={`px-3 py-2 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                isEraser
                  ? 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span>रबर (Eraser)</span>
            </button>
          </div>
        </div>

        {/* Brush Size & Stickers Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          
          {/* Brush Sizes */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Brush className="w-3.5 h-3.5 text-rose-500" />
              <span>ब्रश मोटाई:</span>
            </span>
            {[6, 12, 20, 32].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setBrushSize(size);
                  soundEffects.playBoing();
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all border ${
                  brushSize === size
                    ? 'bg-amber-500 text-white border-amber-600 shadow'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-100'
                }`}
              >
                {size === 6 ? 'बारीक ✏️' : size === 12 ? 'मध्यम 🖌️' : size === 20 ? 'मोटा 🖍️' : 'सुपर बोल्ड 🎨'}
              </button>
            ))}
          </div>

          {/* Fun Sticker Stamps */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-700">जादुई स्टिकर:</span>
            {STICKERS.map((stk) => (
              <button
                key={stk}
                onClick={() => {
                  setSelectedSticker(stk);
                  setIsEraser(false);
                  soundEffects.playSuccess();
                  setCheerMsg(`कैनवास पर कहीं भी क्लिक करो और ${stk} स्टिकर लगाओ!`);
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform active:scale-90 ${
                  selectedSticker === stk
                    ? 'bg-yellow-300 ring-2 ring-yellow-500 scale-120 shadow-md'
                    : 'hover:bg-slate-100'
                }`}
              >
                {stk}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* DRAWING CANVAS AREA */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-amber-400 bg-white shadow-2xl flex flex-col items-center">
        
        <canvas
          ref={canvasRef}
          width={720}
          height={480}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full max-w-full h-auto cursor-crosshair touch-none select-none bg-white"
          style={{ maxHeight: '520px', aspectRatio: '720/480' }}
        />

        {/* Canvas floating quick action bar */}
        <div className="w-full p-3 bg-slate-900/90 backdrop-blur-md text-white flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>वापस (Undo)</span>
            </button>
            <button
              onClick={() => {
                initCanvas();
                soundEffects.playBoing();
                setCheerMsg('कैनवास फिर से नया हो गया! नया चित्र बनाओ! 🌟');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs font-bold active:scale-95 transition-all"
            >
              <span>साफ़ करें (Clear)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>ड्राइंग डाउनलोड करें (Save PNG)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
