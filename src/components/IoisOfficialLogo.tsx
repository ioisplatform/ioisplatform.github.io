import React from 'react';

interface IoisOfficialLogoProps {
  size?: number | string;
  variant?: 'full' | 'badge' | 'seal' | 'watermark';
  className?: string;
  watermarkText?: string;
}

export const IoisOfficialLogo: React.FC<IoisOfficialLogoProps> = ({
  size = 64,
  variant = 'full',
  className = '',
  watermarkText,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  if (variant === 'watermark') {
    return (
      <div 
        className={`pointer-events-none select-none relative flex flex-col items-center justify-center ${className}`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full opacity-[0.08] drop-shadow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric Guilloche Rings */}
          <circle cx="100" cy="100" r="95" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="88" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <circle cx="100" cy="100" r="76" stroke="#f59e0b" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="48" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" />

          {/* 24-Ray Guilloche Sun/Rosette */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + 72 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={100 + 72 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="#fbbf24"
              strokeWidth="0.75"
              opacity="0.5"
            />
          ))}

          {/* Central Shield */}
          <path
            d="M 100 35 L 140 55 L 140 105 C 140 135 100 165 100 165 C 100 165 60 135 60 105 L 60 55 Z"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
          />

          {/* IOIS Letters */}
          <text
            x="100"
            y="112"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="26"
            fontFamily="system-ui, sans-serif"
            fontWeight="900"
            letterSpacing="2"
          >
            IOIS
          </text>
          <text
            x="100"
            y="126"
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="800"
            letterSpacing="3"
          >
            OFFICIAL
          </text>
        </svg>

        {watermarkText && (
          <div className="absolute inset-0 flex items-center justify-center -rotate-12 pointer-events-none">
            <span className="font-mono font-black text-amber-300 opacity-[0.09] text-base tracking-widest uppercase border border-dashed border-amber-400 px-3 py-0.5 rounded-lg whitespace-nowrap">
              {watermarkText}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="badgeGoldDisc" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
            <linearGradient id="badgeTiranga" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9933" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
            <linearGradient id="badgeDarkCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* Outer Beveled Gold Rim */}
          <circle cx="50" cy="50" r="48" fill="url(#badgeGoldDisc)" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="43" fill="url(#badgeDarkCore)" stroke="url(#badgeTiranga)" strokeWidth="1.5" />

          {/* 3D Central Shield */}
          <path
            d="M 50 18 L 72 28 L 72 54 C 72 70 50 84 50 84 C 50 84 28 70 28 54 L 28 28 Z"
            fill="url(#badgeGoldDisc)"
            opacity="0.2"
          />
          <path
            d="M 50 20 L 70 30 L 70 52 C 70 66 50 80 50 80 C 50 80 30 66 30 52 L 30 30 Z"
            stroke="url(#badgeGoldDisc)"
            strokeWidth="1.8"
            fill="#020617"
          />

          {/* IOIS Letters */}
          <text
            x="50"
            y="52"
            textAnchor="middle"
            fill="url(#badgeGoldDisc)"
            fontSize="15"
            fontFamily="system-ui, sans-serif"
            fontWeight="900"
            letterSpacing="1"
          >
            IOIS
          </text>
          <text
            x="50"
            y="62"
            textAnchor="middle"
            fill="#34d399"
            fontSize="6"
            fontFamily="system-ui, sans-serif"
            fontWeight="800"
            letterSpacing="1.5"
          >
            INDIA
          </text>
        </svg>
      </div>
    );
  }

  // Variant: 'full' or 'seal' (State-of-the-Art Luxury Vector Emblem)
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Gold Shader */}
          <radialGradient id="goldRadial" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="18%" stopColor="#fef3c7" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="80%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>

          {/* Pure Tiranga Ribbon Gradient */}
          <linearGradient id="tirangaAura" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7700" />
            <stop offset="35%" stopColor="#ff9933" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Deep Obsidian Core */}
          <linearGradient id="obsidianCore" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#020617" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>

          {/* Inner Glow */}
          <linearGradient id="shieldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer 3D Gold Serrated Medallion Ring */}
        <circle cx="120" cy="120" r="114" fill="url(#goldRadial)" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.6))" />
        <circle cx="120" cy="120" r="106" fill="url(#obsidianCore)" stroke="url(#tirangaAura)" strokeWidth="2.5" />

        {/* Circular Micro-Text Security Track */}
        <path
          id="ioisCurvedTextPath"
          d="M 120, 24 A 96,96 0 1,1 119.9, 24"
          fill="none"
        />
        <text fill="#fef3c7" fontSize="8.5" fontFamily="monospace" fontWeight="900" letterSpacing="3.5">
          <textPath href="#ioisCurvedTextPath" startOffset="50%" textAnchor="middle">
            ★ INDIAN ONLINE INTEGRATED SERVICES ★ IOIS 2026 ★ OFFICIAL PLATFORM ★
          </textPath>
        </text>

        {/* Inner Guilloche Security Circle */}
        <circle cx="120" cy="120" r="82" fill="url(#obsidianCore)" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" />

        {/* 24-Spoke Radiant Starburst Chakra */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="120"
            y1="120"
            x2={120 + 78 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={120 + 78 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke="#f59e0b"
            strokeWidth="0.8"
            opacity="0.35"
          />
        ))}

        {/* Majestic 3D Heraldic Central Shield */}
        <path
          d="M 120 48 L 168 68 L 168 126 C 168 162 120 196 120 196 C 120 196 72 162 72 126 L 72 68 Z"
          fill="url(#goldRadial)"
          filter="drop-shadow(0 6px 12px rgba(0,0,0,0.7))"
        />
        <path
          d="M 120 54 L 162 72 L 162 124 C 162 156 120 188 120 188 C 120 188 78 156 78 124 L 78 72 Z"
          fill="url(#obsidianCore)"
          stroke="#ffffff"
          strokeWidth="1.2"
        />

        {/* Subtle Tricolor Flag Shield Divider */}
        <path
          d="M 120 56 L 160 73 L 160 88 L 120 88 Z"
          fill="#ff9933"
          opacity="0.85"
        />
        <path
          d="M 120 88 L 160 88 L 160 102 L 120 102 Z"
          fill="#ffffff"
          opacity="0.9"
        />
        <path
          d="M 120 102 L 160 102 L 160 120 C 160 134 146 150 120 162 Z"
          fill="#138808"
          opacity="0.85"
        />

        {/* Shield Glass Sheen Overlay */}
        <path
          d="M 120 54 L 162 72 L 162 124 C 162 156 120 188 120 188 C 120 188 78 156 78 124 L 78 72 Z"
          fill="url(#shieldSheen)"
        />

        {/* Golden Central IOIS Emblem Typography */}
        <text
          x="120"
          y="124"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="30"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          letterSpacing="2.5"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
        >
          IOIS
        </text>

        <text
          x="120"
          y="142"
          textAnchor="middle"
          fill="#fef08a"
          fontSize="9.5"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          letterSpacing="2"
        >
          DIGITAL PORTAL
        </text>

        {/* Lower Banner Ribbon */}
        <g transform="translate(0, 10)">
          <path
            d="M 40 188 L 65 178 L 175 178 L 200 188 L 185 204 L 172 196 L 68 196 L 55 204 Z"
            fill="url(#goldRadial)"
            stroke="#ffffff"
            strokeWidth="1.2"
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
          />
          <text
            x="120"
            y="192"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="8.5"
            fontFamily="system-ui, sans-serif"
            fontWeight="900"
            letterSpacing="1.2"
          >
            SWAVALAMBAN • INCENTIVE
          </text>
        </g>
      </svg>
    </div>
  );
};
