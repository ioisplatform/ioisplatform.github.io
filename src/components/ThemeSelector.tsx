import React from 'react';
import { Sun, Moon, Palette, Check, Sparkles, X } from 'lucide-react';
import { ThemeMode, ThemePreset, THEME_PRESETS } from '../services/themeService';

interface ThemeSelectorProps {
  currentMode: ThemeMode;
  currentPreset: ThemePreset;
  onModeChange: (mode: ThemeMode) => void;
  onPresetChange: (preset: ThemePreset) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorProps> = ({
  currentMode,
  currentPreset,
  onModeChange,
  onPresetChange,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border transition-all duration-300 relative overflow-hidden"
        style={{
          background: currentMode === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)',
          borderColor: currentMode === 'light' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(245, 158, 11, 0.45)',
          color: currentMode === 'light' ? '#0f172a' : '#f8fafc',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: currentMode === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 logo-3d-box">
              <Palette className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black flex items-center gap-1.5">
                थीम व 3D रंग सेटिंग्स
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              </h3>
              <p className="text-xs opacity-75">प्लेटफॉर्म का रंग व डार्क/लाइट मोड अपनी पसंद से चुनें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-500/20 transition cursor-pointer"
            aria-label="Close theme selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Dark Mode / Light Mode Switch */}
        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-wider block mb-2 opacity-80">
            मोड चुनें (Light / Dark Mode)
          </label>
          <div className="grid grid-cols-2 gap-2.5 p-1 rounded-2xl bg-black/10 dark:bg-black/30 border border-slate-500/20">
            <button
              type="button"
              onClick={() => onModeChange('light')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                currentMode === 'light'
                  ? 'btn-3d-amber text-slate-950 font-black shadow-md scale-[1.02]'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-600" />
              <span>☀️ लाइट मोड (दिन)</span>
            </button>
            <button
              type="button"
              onClick={() => onModeChange('dark')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                currentMode === 'dark'
                  ? 'btn-3d-gold text-slate-950 font-black shadow-md scale-[1.02]'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
              }`}
            >
              <Moon className="w-4 h-4 text-amber-400" />
              <span>🌙 डार्क मोड (रात)</span>
            </button>
          </div>
        </div>

        {/* 2. Color Palettes Grid - Attractive 3D Buttons in Distinct Colors */}
        <div className="mb-4">
          <label className="text-xs font-black uppercase tracking-wider block mb-2 opacity-90 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>3D कलर थीम चुनें (अलग-अलग 3D रंग)</span>
            </span>
            <span className="text-[10px] text-amber-500 font-bold">1-क्लिक लाइव स्विच</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {THEME_PRESETS.map((p) => {
              const isSelected = currentPreset === p.id;
              
              const preset3DStyles: Record<string, {
                btnClass: string;
                discGradient: string;
                borderDisc: string;
                glow: string;
                textColor: string;
              }> = {
                'royal-gold': {
                  btnClass: 'btn-3d-amber text-black',
                  discGradient: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #fef08a 35%, #eab308 70%, #854d0e 100%)',
                  borderDisc: '#713f12',
                  glow: 'rgba(245, 158, 11, 0.4)',
                  textColor: 'text-slate-950 font-black',
                },
                'ocean-blue': {
                  btnClass: 'btn-3d-sapphire text-white',
                  discGradient: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #bae6fd 35%, #0284c7 70%, #0c4a6e 100%)',
                  borderDisc: '#075985',
                  glow: 'rgba(56, 189, 248, 0.4)',
                  textColor: 'text-white font-black',
                },
                'emerald-green': {
                  btnClass: 'btn-3d-emerald text-white',
                  discGradient: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #a7f3d0 35%, #059669 70%, #064e3b 100%)',
                  borderDisc: '#064e3b',
                  glow: 'rgba(16, 185, 129, 0.4)',
                  textColor: 'text-white font-black',
                },
                'crimson-ruby': {
                  btnClass: 'btn-3d-ruby text-white',
                  discGradient: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #fecdd3 35%, #e11d48 70%, #881337 100%)',
                  borderDisc: '#881337',
                  glow: 'rgba(244, 63, 94, 0.4)',
                  textColor: 'text-white font-black',
                },
                'amethyst-purple': {
                  btnClass: 'btn-3d-amethyst text-white',
                  discGradient: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #e9d5ff 35%, #9333ea 70%, #581c87 100%)',
                  borderDisc: '#581c87',
                  glow: 'rgba(168, 85, 247, 0.4)',
                  textColor: 'text-white font-black',
                },
                'midnight-dark': {
                  btnClass: 'btn-3d-silver text-black',
                  discGradient: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 40%, #64748b 70%, #1e293b 100%)',
                  borderDisc: '#334155',
                  glow: 'rgba(226, 232, 240, 0.3)',
                  textColor: 'text-slate-950 font-black',
                },
              };

              const styleConfig = preset3DStyles[p.id] || preset3DStyles['royal-gold'];

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPresetChange(p.id)}
                  className={`p-3 rounded-2xl transition-all duration-150 cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2 text-left active:scale-95 touch-manipulation select-none ${styleConfig.btnClass} ${
                    isSelected ? 'ring-3 ring-white shadow-xl scale-[1.03]' : 'opacity-90 hover:opacity-100'
                  }`}
                  style={{
                    boxShadow: isSelected 
                      ? `0 0 20px ${styleConfig.glow}, 0 4px 10px rgba(0,0,0,0.5)` 
                      : undefined,
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    {/* 3D Logo Disc */}
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                      style={{
                        background: styleConfig.discGradient,
                        border: '1px solid rgba(255,255,255,0.95)',
                        borderBottom: `2px solid ${styleConfig.borderDisc}`,
                      }}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white shadow-inner" />
                      )}
                    </div>

                    {isSelected && (
                      <span className="text-[9px] font-black uppercase bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded text-white border border-white/40">
                        सक्रिय
                      </span>
                    )}
                  </div>

                  <div>
                    <span className={`text-xs font-black block leading-tight drop-shadow-sm ${styleConfig.textColor}`}>
                      {p.nameHi}
                    </span>
                    <span className="text-[9px] font-bold opacity-80 block truncate">
                      {p.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply & Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn-3d-gold w-full mt-2 py-3 rounded-2xl text-slate-950 font-black text-sm shadow-md transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4 text-black" />
          <span className="text-black font-black">थीम लागू करें (Apply & Save)</span>
        </button>
      </div>
    </div>
  );
};
