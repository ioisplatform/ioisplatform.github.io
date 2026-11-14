import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Sliders, 
  Maximize2,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const PhotoCompressorTool: React.FC<{ onDownloadSuccess?: () => void }> = ({ onDownloadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [compressedSizeKB, setCompressedSizeKB] = useState<number>(0);
  const [compressedDimensions, setCompressedDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [targetSizeKB, setTargetSizeKB] = useState<number>(50); // Default 50 KB for RTPS/Govt jobs
  const [presetType, setPresetType] = useState<'passport' | 'signature' | 'custom' | 'exact_kb'>('exact_kb');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल इमेज फाइल (JPG, PNG, WebP) अपलोड करें।');
      return;
    }

    setSelectedFile(file);
    const sizeKB = Math.round(file.size / 1024);
    setOriginalSizeKB(sizeKB);

    const objectUrl = URL.createObjectURL(file);
    setOriginalUrl(objectUrl);

    // Load image to extract dimensions
    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      processCompression(img, targetSizeKB, presetType);
    };
  };

  const processCompression = (
    img: HTMLImageElement, 
    targetKB: number, 
    preset: 'passport' | 'signature' | 'custom' | 'exact_kb'
  ) => {
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      let targetWidth = img.width;
      let targetHeight = img.height;

      // Handle Preset Dimensions
      if (preset === 'passport') {
        // Standard Indian Passport photo ratio: 3.5cm x 4.5cm ~ 413x531 px
        targetWidth = 413;
        targetHeight = 531;
      } else if (preset === 'signature') {
        // Standard signature ratio: 2cm x 4.5cm ~ 236x531 px
        targetWidth = 531;
        targetHeight = 236;
      } else if (img.width > 1600 || img.height > 1600) {
        // Downscale very large photos (>1600px)
        const scale = Math.min(1200 / img.width, 1200 / img.height);
        targetWidth = Math.round(img.width * scale);
        targetHeight = Math.round(img.height * scale);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Fill white background in case of transparent PNG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Binary search for optimal JPEG quality to achieve target KB
      let minQ = 0.05;
      let maxQ = 0.95;
      let bestDataUrl = '';
      let bestSizeKB = 0;

      for (let i = 0; i < 7; i++) {
        const midQ = (minQ + maxQ) / 2;
        const testDataUrl = canvas.toDataURL('image/jpeg', midQ);
        const head = 'data:image/jpeg;base64,';
        const fileSizeBytes = Math.round((testDataUrl.length - head.length) * 0.75);
        const currentKB = Math.round(fileSizeBytes / 1024);

        bestDataUrl = testDataUrl;
        bestSizeKB = currentKB;

        if (currentKB > targetKB) {
          maxQ = midQ;
        } else {
          minQ = midQ;
        }
      }

      setCompressedUrl(bestDataUrl);
      setCompressedSizeKB(bestSizeKB);
      setCompressedDimensions({ width: targetWidth, height: targetHeight });
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTargetSizeChange = (newTargetKB: number, newPreset = presetType) => {
    setTargetSizeKB(newTargetKB);
    setPresetType(newPreset);

    if (originalUrl) {
      const img = new Image();
      img.src = originalUrl;
      img.onload = () => {
        processCompression(img, newTargetKB, newPreset);
      };
    }
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    link.href = compressedUrl;
    const baseName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'compressed_photo';
    link.download = `${baseName}_${compressedSizeKB}KB_iois.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onDownloadSuccess) onDownloadSuccess();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setOriginalSizeKB(0);
    setCompressedSizeKB(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const reductionPct = originalSizeKB > 0 && compressedSizeKB > 0
    ? Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100))
    : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Info Ribbon */}
      <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 rounded-xl p-2.5 sm:p-3 text-[11px] sm:text-xs text-amber-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span>
          सरकारी फॉर्म जैसे <strong>RTPS (जाति/आय/निवास)</strong>, <strong>BSSC</strong>, <strong>SSC</strong> और <strong>Aadhaar/PAN</strong> में 20KB से 50KB की फोटो लगती है। नीचे दिए गए बटन से एक क्लिक में साइज सेट करें!
        </span>
      </div>

      {/* Upload Area */}
      {!originalUrl ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-amber-500/50 hover:border-amber-400 rounded-2xl p-6 sm:p-10 text-center bg-slate-900/60 hover:bg-slate-900/90 transition cursor-pointer flex flex-col items-center justify-center gap-3 group"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black text-white">
              अपनी फोटो या सिग्नेचर चुनें (Upload Photo)
            </h4>
            <p className="text-xs text-slate-400">
              JPG, JPEG, PNG या WebP फाइल (फोन गैलरी या कैमरा से चुनें)
            </p>
          </div>
          <button
            type="button"
            className="btn-3d-rainbow px-4 py-2 rounded-xl text-xs font-black text-black flex items-center gap-1.5 shadow-md mt-2"
          >
            <span>गैलरी से फोटो चुनें ➔</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          
          {/* Presets & Target Size Selector */}
          <div className="bg-slate-900/80 border border-amber-500/40 rounded-2xl p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>टारगेट साइज व सरकारी फॉर्म प्रीसेट चुनें:</span>
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
              >
                नई फोटो बदलें ↺
              </button>
            </div>

            {/* Preset Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => handleTargetSizeChange(20, 'passport')}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition cursor-pointer min-h-[44px] ${
                  targetSizeKB === 20 && presetType === 'passport'
                    ? 'btn-3d-gold text-slate-950 font-black shadow-md'
                    : 'hover:border-amber-400'
                }`}
                style={
                  targetSizeKB === 20 && presetType === 'passport'
                    ? undefined
                    : {
                        backgroundColor: 'var(--btn-surface)',
                        borderColor: 'var(--btn-border)',
                        color: 'var(--text-primary)',
                      }
                }
              >
                <div className="text-[10.5px] sm:text-[11px] font-black">20 KB पासपोर्ट</div>
                <div className="text-[9px] sm:text-[9.5px] opacity-85">SSC / UPSC फोटो</div>
              </button>

              <button
                type="button"
                onClick={() => handleTargetSizeChange(50, 'exact_kb')}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition cursor-pointer min-h-[44px] ${
                  targetSizeKB === 50 && presetType === 'exact_kb'
                    ? 'btn-3d-gold text-slate-950 font-black shadow-md'
                    : 'hover:border-amber-400'
                }`}
                style={
                  targetSizeKB === 50 && presetType === 'exact_kb'
                    ? undefined
                    : {
                        backgroundColor: 'var(--btn-surface)',
                        borderColor: 'var(--btn-border)',
                        color: 'var(--text-primary)',
                      }
                }
              >
                <div className="text-[10.5px] sm:text-[11px] font-black">50 KB मानक (Standard)</div>
                <div className="text-[9px] sm:text-[9.5px] opacity-85">RTPS / जाति-आय-निवास</div>
              </button>

              <button
                type="button"
                onClick={() => handleTargetSizeChange(15, 'signature')}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition cursor-pointer min-h-[44px] ${
                  targetSizeKB === 15 && presetType === 'signature'
                    ? 'btn-3d-gold text-slate-950 font-black shadow-md'
                    : 'hover:border-amber-400'
                }`}
                style={
                  targetSizeKB === 15 && presetType === 'signature'
                    ? undefined
                    : {
                        backgroundColor: 'var(--btn-surface)',
                        borderColor: 'var(--btn-border)',
                        color: 'var(--text-primary)',
                      }
                }
              >
                <div className="text-[10.5px] sm:text-[11px] font-black">15 KB सिग्नेचर</div>
                <div className="text-[9px] sm:text-[9.5px] opacity-85">हस्ताक्षर रिसाइज़र</div>
              </button>

              <button
                type="button"
                onClick={() => handleTargetSizeChange(100, 'exact_kb')}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition cursor-pointer min-h-[44px] ${
                  targetSizeKB === 100 && presetType === 'exact_kb'
                    ? 'btn-3d-gold text-slate-950 font-black shadow-md'
                    : 'hover:border-amber-400'
                }`}
                style={
                  targetSizeKB === 100 && presetType === 'exact_kb'
                    ? undefined
                    : {
                        backgroundColor: 'var(--btn-surface)',
                        borderColor: 'var(--btn-border)',
                        color: 'var(--text-primary)',
                      }
                }
              >
                <div className="text-[10.5px] sm:text-[11px] font-black">100 KB डॉक्यूमेंट</div>
                <div className="text-[9px] sm:text-[9.5px] opacity-85">पहचान पत्र / प्रूफ</div>
              </button>
            </div>

            {/* Custom KB Slider */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">कस्टम साइज स्लाइडर (Custom KB):</span>
                <span className="text-amber-400 font-black text-sm bg-slate-950 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                  {targetSizeKB} KB
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={targetSizeKB}
                onChange={(e) => handleTargetSizeChange(Number(e.target.value), 'custom')}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10 KB (छोटा)</span>
                <span>100 KB</span>
                <span>250 KB</span>
                <span>500 KB (बड़ा)</span>
              </div>
            </div>
          </div>

          {/* Side-by-side Before/After Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Original Photo Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">मूल फोटो (Original):</span>
                <span className="text-rose-400 font-black bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/30">
                  {originalSizeKB} KB
                </span>
              </div>
              <div className="w-full aspect-[4/3] bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {originalUrl ? (
                  <img 
                    src={originalUrl} 
                    alt="Original" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-500">लोड हो रहा है...</span>
                )}
              </div>
              <div className="text-[10.5px] text-slate-400 text-center">
                आकार: {originalDimensions.width} × {originalDimensions.height} px
              </div>
            </div>

            {/* Compressed Photo Card */}
            <div className="bg-gradient-to-b from-slate-900 to-amber-950/20 border-2 border-emerald-500/50 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-black flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>कंप्रेस्ड फोटो (Ready):</span>
                </span>
                <span className="text-emerald-400 font-black bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/50">
                  {compressedSizeKB} KB {reductionPct > 0 && `(-${reductionPct}%)`}
                </span>
              </div>
              <div className="w-full aspect-[4/3] bg-black rounded-xl overflow-hidden border border-emerald-500/30 flex items-center justify-center relative">
                {isProcessing || !compressedUrl ? (
                  <div className="flex flex-col items-center gap-2 text-amber-400">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-bold">कंप्रेस हो रहा है...</span>
                  </div>
                ) : (
                  <img 
                    src={compressedUrl} 
                    alt="Compressed" 
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="text-[10.5px] text-slate-300 text-center font-medium">
                नया आकार: {compressedDimensions.width} × {compressedDimensions.height} px
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>सटीक {compressedSizeKB} KB साइज में फोटो तैयार है!</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!compressedUrl || isProcessing}
                className="btn-3d-rainbow-special flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-black stroke-[2.5]" />
                <span>कंप्रेस्ड फोटो डाउनलोड करें (.JPG)</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

interface PhotoCompressorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoCompressorModal: React.FC<PhotoCompressorModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="border-2 rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: 'var(--surface-bg)',
          borderColor: 'var(--btn-border)',
          color: 'var(--text-primary)',
        }}
      >
        
        {/* Sticky Header */}
        <div 
          className="px-3.5 sm:px-6 py-3 sm:py-3.5 border-b flex items-center justify-between gap-3 shrink-0 transition-colors duration-200"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--btn-border)',
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl logo-3d-box flex items-center justify-center shrink-0 border border-amber-400/80 shadow-md">
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black truncate" style={{ color: 'var(--text-primary)' }}>
                  फोटो कंप्रेसर व रिसाइज़र (Smart Photo Resizer)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0">
                  100% फ्री
                </span>
              </div>
              <p className="text-[10px] sm:text-xs truncate opacity-80" style={{ color: 'var(--text-secondary)' }}>
                RTPS, SSC, UPSC व सरकारी फॉर्म हेतु 20KB, 50KB, 100KB में सटीक फोटो व सिग्नेचर बनाएं
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-3d-silver px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 touch-manipulation shrink-0"
            title="बंद करें (Esc)"
          >
            <X className="w-4 h-4 text-black stroke-[3]" />
            <span className="font-black text-black">बंद करें</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1">
          <PhotoCompressorTool />
        </div>

      </div>
    </div>
  );
};
