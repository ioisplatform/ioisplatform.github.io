import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  sublabel?: string;
  fileValue: string;
  driveLinkValue: string;
  onFileChange: (base64: string) => void;
  onDriveLinkChange: (link: string) => void;
  accept?: string;
  required?: boolean;
}

// Compress and resize images client-side before Base64 serialization
const compressImageFile = (file: File, maxDimension = 900, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      // Non-image files: read raw
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } else {
          resolve(typeof e.target?.result === 'string' ? e.target.result : '');
        }
      };
      img.onerror = () => resolve(typeof e.target?.result === 'string' ? e.target.result : '');
      img.src = typeof e.target?.result === 'string' ? e.target.result : '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const SmartFileUpload: React.FC<FileUploadProps> = ({
  label,
  sublabel,
  fileValue,
  driveLinkValue,
  onFileChange,
  onDriveLinkChange,
  accept = 'image/*',
  required = false,
}) => {
  const [fileSizeError, setFileSizeError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleNativeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size: 25 MB limit
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 25) {
      setFileSizeError(`यह फ़ाइल ${sizeInMB.toFixed(1)} MB की है (25MB सीमा से अधिक)। कृपया नीचे Google Drive लिंक पेस्ट करें।`);
      return;
    }

    setFileSizeError('');
    setFileName(file.name);
    setIsProcessing(true);

    try {
      const compressedDataUrl = await compressImageFile(file, 900, 0.75);
      if (compressedDataUrl) {
        onFileChange(compressedDataUrl);
      }
    } catch (err) {
      console.warn('Error processing image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black text-slate-200">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          Fast Instant Upload (Auto-Optimized)
        </span>
      </div>

      {sublabel && <p className="text-[11px] text-slate-400">{sublabel}</p>}

      {/* File Upload Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Direct Upload */}
        <div>
          <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-700 hover:border-amber-400 bg-slate-900/80 hover:bg-slate-900 cursor-pointer transition text-center group">
            <Upload className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition" />
            <span className="text-[11px] font-bold text-slate-200">
              {isProcessing ? 'फ़ाइल प्रोसेस हो रही है...' : fileName ? fileName : 'फ़ाइल चुनें (JPG/PNG)'}
            </span>
            <span className="text-[9px] text-slate-400">फास्ट अपलोड व ऑटो-कंप्रेशन</span>
            <input type="file" accept={accept} onChange={handleNativeFile} className="hidden" />
          </label>
        </div>

        {/* Google Drive Link Input (Unlimited size fallback) */}
        <div>
          <div className="h-full flex flex-col justify-center p-3 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 mb-1">
              <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>या 25MB+ हेतु Google Drive लिंक दें:</span>
            </div>
            <input
              type="url"
              value={driveLinkValue}
              onChange={(e) => onDriveLinkChange(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-lg px-2.5 py-1.5 text-[11px] outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {fileSizeError && (
        <div className="p-2 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{fileSizeError}</span>
        </div>
      )}

      {/* Preview Thumbnail if file exists */}
      {fileValue && (
        <div className="flex items-center gap-2 pt-1">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-400 bg-slate-900">
            <img src={fileValue} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            <span>फ़ाइल सफलतापूर्वक अटैच हो गई</span>
          </span>
        </div>
      )}
    </div>
  );
};
