import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * High-fidelity, colorful SVG Sachitra (pictorial) illustrations for A to Z Nursery Series
 */
export const AlphabetObjectIllustration: React.FC<{ letter: string; className?: string }> = ({ 
  letter, 
  className = "w-28 h-28 sm:w-32 sm:h-32" 
}) => {
  const upper = letter.toUpperCase();

  switch (upper) {
    case 'A': // Apple
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="50" fill="#fee2e2" />
          {/* Leaf */}
          <path d="M62 24C68 14 80 18 80 18C80 18 78 30 68 32C62 33 62 24 62 24Z" fill="#22c55e" />
          <path d="M64 26C70 20 76 20 76 20" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
          {/* Stem */}
          <path d="M58 35C58 26 62 20 66 16" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          {/* Apple Body */}
          <path d="M36 44C24 54 22 74 32 90C40 102 52 108 60 102C68 108 80 102 88 90C98 74 96 54 84 44C74 36 66 42 60 42C54 42 46 36 36 44Z" fill="url(#appleGrad)" filter="drop-shadow(0 4px 6px rgba(185,28,28,0.3))" />
          {/* Highlight */}
          <ellipse cx="44" cy="56" rx="8" ry="16" transform="rotate(-25 44 56)" fill="white" fillOpacity="0.4" />
          <defs>
            <linearGradient id="appleGrad" x1="30" y1="36" x2="90" y2="108" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ef4444" />
              <stop offset="0.6" stopColor="#dc2626" />
              <stop offset="1" stopColor="#991b1b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'B': // Ball
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#dbeafe" />
          {/* Ball Base */}
          <circle cx="60" cy="60" r="44" fill="url(#ballGrad)" stroke="#1e3a8a" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(30,58,138,0.25))" />
          {/* Soccer Pentagon Pattern */}
          <polygon points="60,42 74,52 69,68 51,68 46,52" fill="#1e293b" />
          {/* Connecting Lines & Hexagons */}
          <line x1="60" y1="42" x2="60" y2="24" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="74" y1="52" x2="92" y2="48" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="69" y1="68" x2="82" y2="84" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="51" y1="68" x2="38" y2="84" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="46" y1="52" x2="28" y2="48" stroke="#1e293b" strokeWidth="2.5" />
          {/* Side panels */}
          <polygon points="60,24 74,18 84,28 78,38" fill="#3b82f6" fillOpacity="0.8" />
          <polygon points="28,48 20,62 26,76 38,72" fill="#60a5fa" fillOpacity="0.8" />
          <polygon points="92,48 100,62 94,76 82,72" fill="#3b82f6" fillOpacity="0.8" />
          {/* Highlight */}
          <ellipse cx="45" cy="40" rx="10" ry="6" transform="rotate(-30 45 40)" fill="white" fillOpacity="0.45" />
          <defs>
            <linearGradient id="ballGrad" x1="30" y1="20" x2="90" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.8" stopColor="#e2e8f0" />
              <stop offset="1" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'C': // Cat
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#fef3c7" />
          {/* Ears */}
          <polygon points="32,48 38,20 54,38" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <polygon points="36,44 40,26 50,38" fill="#fbcfe8" />
          <polygon points="88,48 82,20 66,38" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <polygon points="84,44 80,26 70,38" fill="#fbcfe8" />
          {/* Face */}
          <circle cx="60" cy="64" r="34" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" />
          {/* Eyes */}
          <ellipse cx="48" cy="58" rx="5" ry="6" fill="#1e293b" />
          <circle cx="50" cy="56" r="1.5" fill="white" />
          <ellipse cx="72" cy="58" rx="5" ry="6" fill="#1e293b" />
          <circle cx="74" cy="56" r="1.5" fill="white" />
          {/* Nose & Mouth */}
          <polygon points="57,68 63,68 60,72" fill="#f43f5e" />
          <path d="M54 75C57 78 60 76 60 72C60 76 63 78 66 75" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          {/* Whiskers */}
          <line x1="30" y1="66" x2="44" y2="68" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="74" x2="44" y2="72" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="68" x2="90" y2="66" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="72" x2="90" y2="74" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'D': // Dog
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#d1fae5" />
          {/* Floppy Ears */}
          <path d="M30 42C24 54 22 74 34 78C40 80 42 70 40 56C38 46 32 40 30 42Z" fill="#92400e" stroke="#78350f" strokeWidth="2" />
          <path d="M90 42C96 54 98 74 86 78C80 80 78 70 80 56C82 46 88 40 90 42Z" fill="#92400e" stroke="#78350f" strokeWidth="2" />
          {/* Face */}
          <circle cx="60" cy="62" r="32" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
          {/* Snout */}
          <ellipse cx="60" cy="72" rx="16" ry="12" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" />
          {/* Nose */}
          <path d="M54 68C54 65 66 65 66 68C66 73 54 73 54 68Z" fill="#1e293b" />
          <ellipse cx="58" cy="67" rx="1.5" ry="0.8" fill="white" />
          {/* Mouth & Tongue */}
          <path d="M57 74C59 76 60 76 60 73C60 76 61 76 63 74" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <path d="M58 75C58 82 62 82 62 75Z" fill="#f43f5e" />
          {/* Eyes */}
          <circle cx="48" cy="54" r="5" fill="#1e293b" />
          <circle cx="49.5" cy="52.5" r="1.5" fill="white" />
          <circle cx="72" cy="54" r="5" fill="#1e293b" />
          <circle cx="73.5" cy="52.5" r="1.5" fill="white" />
        </svg>
      );

    case 'E': // Elephant
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#ede9fe" />
          {/* Big Ears */}
          <ellipse cx="32" cy="58" rx="18" ry="24" fill="#a78bfa" stroke="#6d28d9" strokeWidth="2" />
          <ellipse cx="34" cy="58" rx="11" ry="16" fill="#ddd6fe" />
          <ellipse cx="88" cy="58" rx="18" ry="24" fill="#a78bfa" stroke="#6d28d9" strokeWidth="2" />
          <ellipse cx="86" cy="58" rx="11" ry="16" fill="#ddd6fe" />
          {/* Head */}
          <circle cx="60" cy="58" r="28" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="2.5" />
          {/* Trunk */}
          <path d="M56 66C54 76 48 86 42 90C36 94 32 90 36 86C40 82 46 76 48 68" stroke="#6d28d9" strokeWidth="9" strokeLinecap="round" />
          <path d="M56 66C54 76 48 86 42 90C36 94 32 90 36 86C40 82 46 76 48 68" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" />
          {/* Tusks */}
          <path d="M50 72C46 76 44 80 46 82C48 82 52 78 54 74" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M68 72C72 76 74 80 72 82C70 82 66 78 64 74" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          {/* Eyes */}
          <circle cx="48" cy="52" r="3.5" fill="#1e293b" />
          <circle cx="49" cy="51" r="1" fill="white" />
          <circle cx="72" cy="52" r="3.5" fill="#1e293b" />
          <circle cx="73" cy="51" r="1" fill="white" />
        </svg>
      );

    case 'F': // Fish
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#cffafe" />
          {/* Bubbles */}
          <circle cx="28" cy="36" r="4" fill="white" fillOpacity="0.8" stroke="#0891b2" strokeWidth="1" />
          <circle cx="22" cy="26" r="6" fill="white" fillOpacity="0.8" stroke="#0891b2" strokeWidth="1" />
          {/* Tail Fin */}
          <polygon points="90,60 106,40 102,60 106,80" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
          {/* Dorsal Fin */}
          <path d="M50 36C60 26 75 30 75 36" fill="#0891b2" />
          {/* Fish Body */}
          <ellipse cx="60" cy="60" rx="34" ry="22" fill="url(#fishGrad)" stroke="#0891b2" strokeWidth="2.5" />
          {/* Stripes */}
          <path d="M60 40C64 50 64 70 60 80" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M72 44C75 52 75 68 72 76" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="42" cy="56" r="6" fill="white" stroke="#0891b2" strokeWidth="1.5" />
          <circle cx="40" cy="56" r="3" fill="#1e293b" />
          <circle cx="39" cy="55" r="1" fill="white" />
          {/* Smile */}
          <path d="M30 64C34 66 36 64 36 64" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="fishGrad" x1="26" y1="40" x2="94" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.7" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'G': // Grapes
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#dcfce7" />
          {/* Vine Leaf & Stem */}
          <path d="M60 18C60 26 62 34 62 38" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <path d="M62 26C74 20 84 26 80 36C74 38 68 34 62 30" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
          {/* Tendril */}
          <path d="M60 22C54 18 48 20 46 26C44 32 50 36 54 34" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          {/* Grapes Cluster (3 Rows) */}
          {/* Row 1 */}
          <circle cx="44" cy="48" r="10" fill="#9333ea" stroke="#6b21a8" strokeWidth="2" />
          <circle cx="60" cy="46" r="10" fill="#a855f7" stroke="#6b21a8" strokeWidth="2" />
          <circle cx="76" cy="48" r="10" fill="#9333ea" stroke="#6b21a8" strokeWidth="2" />
          {/* Row 2 */}
          <circle cx="50" cy="64" r="10" fill="#a855f7" stroke="#6b21a8" strokeWidth="2" />
          <circle cx="68" cy="64" r="10" fill="#9333ea" stroke="#6b21a8" strokeWidth="2" />
          <circle cx="38" cy="66" r="9" fill="#7e22ce" stroke="#581c87" strokeWidth="1.5" />
          <circle cx="82" cy="66" r="9" fill="#7e22ce" stroke="#581c87" strokeWidth="1.5" />
          {/* Row 3 */}
          <circle cx="58" cy="80" r="10" fill="#9333ea" stroke="#6b21a8" strokeWidth="2" />
          <circle cx="44" cy="80" r="9" fill="#7e22ce" stroke="#581c87" strokeWidth="1.5" />
          <circle cx="74" cy="80" r="9" fill="#7e22ce" stroke="#581c87" strokeWidth="1.5" />
          {/* Row 4 bottom grape */}
          <circle cx="60" cy="94" r="9" fill="#a855f7" stroke="#6b21a8" strokeWidth="2" />
          {/* Highlights */}
          <circle cx="42" cy="45" r="2.5" fill="white" fillOpacity="0.5" />
          <circle cx="58" cy="43" r="2.5" fill="white" fillOpacity="0.5" />
          <circle cx="48" cy="61" r="2.5" fill="white" fillOpacity="0.5" />
          <circle cx="66" cy="61" r="2.5" fill="white" fillOpacity="0.5" />
          <circle cx="56" cy="77" r="2.5" fill="white" fillOpacity="0.5" />
        </svg>
      );

    case 'H': // Hen
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#ffedd5" />
          {/* Tail Feathers */}
          <path d="M85 58C96 46 102 54 98 70C92 76 84 72 82 66" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
          {/* Hen Body */}
          <ellipse cx="64" cy="68" rx="26" ry="20" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
          {/* Wing */}
          <ellipse cx="68" cy="70" rx="14" ry="10" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
          {/* Neck & Head */}
          <path d="M42 72C42 56 46 44 54 38C58 46 54 64 54 72Z" fill="#fb923c" />
          <circle cx="48" cy="44" r="12" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
          {/* Red Comb */}
          <path d="M44 32C42 26 48 24 50 28C52 22 58 24 56 30C58 28 62 30 60 34" fill="#dc2626" />
          {/* Wattle */}
          <ellipse cx="44" cy="54" rx="3" ry="5" fill="#dc2626" />
          {/* Beak */}
          <polygon points="36,44 42,40 42,48" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          {/* Eye */}
          <circle cx="46" cy="42" r="3" fill="#1e293b" />
          <circle cx="45.5" cy="41" r="1" fill="white" />
          {/* Legs */}
          <line x1="56" y1="88" x2="56" y2="100" stroke="#d97706" strokeWidth="3" />
          <line x1="52" y1="100" x2="60" y2="100" stroke="#d97706" strokeWidth="2.5" />
          <line x1="68" y1="88" x2="68" y2="100" stroke="#d97706" strokeWidth="3" />
          <line x1="64" y1="100" x2="72" y2="100" stroke="#d97706" strokeWidth="2.5" />
        </svg>
      );

    case 'I': // Ice-cream
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#fce7f3" />
          {/* Waffle Cone */}
          <polygon points="40,58 80,58 60,108" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          {/* Cone Waffle Texture */}
          <line x1="45" y1="68" x2="75" y2="68" stroke="#d97706" strokeWidth="1.5" />
          <line x1="50" y1="80" x2="70" y2="80" stroke="#d97706" strokeWidth="1.5" />
          <line x1="55" y1="92" x2="65" y2="92" stroke="#d97706" strokeWidth="1.5" />
          <line x1="46" y1="62" x2="64" y2="98" stroke="#d97706" strokeWidth="1.5" />
          <line x1="74" y1="62" x2="56" y2="98" stroke="#d97706" strokeWidth="1.5" />
          {/* Scoop 1 (Chocolate/Base) */}
          <ellipse cx="60" cy="56" rx="22" ry="14" fill="#a16207" stroke="#78350f" strokeWidth="1.5" />
          {/* Scoop 2 (Strawberry) */}
          <circle cx="60" cy="40" r="18" fill="#ec4899" stroke="#be185d" strokeWidth="2" />
          {/* Cherry on Top */}
          <circle cx="60" cy="22" r="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
          <path d="M62 16C64 10 70 8 72 8" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          {/* Sprinkles */}
          <rect x="52" y="34" width="4" height="2" rx="1" fill="#fbbf24" transform="rotate(30 52 34)" />
          <rect x="66" y="38" width="4" height="2" rx="1" fill="#3b82f6" transform="rotate(-20 66 38)" />
          <rect x="58" y="44" width="4" height="2" rx="1" fill="#22c55e" transform="rotate(45 58 44)" />
        </svg>
      );

    case 'J': // Jug
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#e0e7ff" />
          {/* Jug Handle */}
          <path d="M72 44C92 44 94 80 72 82" stroke="#4338ca" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Jug Body */}
          <path d="M38 38C38 34 68 34 68 38L72 54C78 64 78 84 70 94C64 100 42 100 36 94C28 84 28 64 34 54Z" fill="url(#jugGrad)" stroke="#3730a3" strokeWidth="2.5" />
          {/* Spout */}
          <polygon points="38,36 28,34 36,44" fill="#6366f1" stroke="#3730a3" strokeWidth="1.5" />
          {/* Water level wave */}
          <path d="M34 66Q44 62 53 66T72 66C74 74 72 84 68 90C62 96 44 96 38 90C34 84 32 74 34 66Z" fill="#38bdf8" fillOpacity="0.7" />
          {/* Highlight */}
          <ellipse cx="44" cy="70" rx="3" ry="12" fill="white" fillOpacity="0.5" />
          <defs>
            <linearGradient id="jugGrad" x1="30" y1="36" x2="76" y2="98" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="0.6" stopColor="#6366f1" />
              <stop offset="1" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'K': // Kite
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#e0f2fe" />
          {/* Kite Diamond Body */}
          <polygon points="60,18 96,54 60,90 24,54" fill="url(#kiteGrad)" stroke="#0284c7" strokeWidth="2.5" filter="drop-shadow(0 4px 6px rgba(2,132,199,0.3))" />
          {/* Crossed wooden sticks */}
          <line x1="60" y1="18" x2="60" y2="90" stroke="#78350f" strokeWidth="2" />
          <path d="M24 54C42 36 78 36 96 54" stroke="#78350f" strokeWidth="2" fill="none" />
          {/* Color Quadrants */}
          <polygon points="60,18 96,54 60,54" fill="#f43f5e" fillOpacity="0.85" />
          <polygon points="60,18 24,54 60,54" fill="#fbbf24" fillOpacity="0.85" />
          <polygon points="60,90 24,54 60,54" fill="#22c55e" fillOpacity="0.85" />
          <polygon points="60,90 96,54 60,54" fill="#3b82f6" fillOpacity="0.85" />
          {/* Kite Tail (Curved thread with ribbons) */}
          <path d="M60 90C62 98 54 104 62 110C68 114 74 110 70 118" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />
          <polygon points="56,98 64,98 60,102" fill="#ec4899" />
          <polygon points="58,106 66,106 62,110" fill="#8b5cf6" />
          <defs>
            <linearGradient id="kiteGrad" x1="24" y1="18" x2="96" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'L': // Lion
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#fef9c3" />
          {/* Lion Mane */}
          <circle cx="60" cy="60" r="38" fill="#d97706" stroke="#b45309" strokeWidth="3" />
          <path d="M30 40Q20 50 30 60T30 80Q40 98 60 98T90 80Q100 60 90 40T60 22Q40 22 30 40Z" fill="#b45309" />
          {/* Ears */}
          <circle cx="36" cy="42" r="8" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="36" cy="42" r="4" fill="#fde68a" />
          <circle cx="84" cy="42" r="8" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="84" cy="42" r="4" fill="#fde68a" />
          {/* Face */}
          <circle cx="60" cy="62" r="26" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
          {/* Muzzle */}
          <ellipse cx="60" cy="70" rx="13" ry="9" fill="#fef3c7" />
          {/* Nose */}
          <polygon points="55,66 65,66 60,71" fill="#78350f" />
          {/* Mouth & Whiskers */}
          <path d="M56 73C58 75 60 74 60 71C60 74 62 75 64 73" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="71" x2="52" y2="71" stroke="#78350f" strokeWidth="1.5" />
          <line x1="68" y1="71" x2="78" y2="71" stroke="#78350f" strokeWidth="1.5" />
          {/* Eyes */}
          <ellipse cx="50" cy="56" rx="4" ry="5" fill="#1e293b" />
          <circle cx="51" cy="54" r="1.5" fill="white" />
          <ellipse cx="70" cy="56" rx="4" ry="5" fill="#1e293b" />
          <circle cx="71" cy="54" r="1.5" fill="white" />
        </svg>
      );

    case 'M': // Mango
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#fef3c7" />
          {/* Stem & Leaf */}
          <path d="M60 22C60 30 64 34 64 38" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <path d="M64 28C76 22 84 26 84 32C84 40 74 38 64 34" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
          {/* Mango Body (Teardrop curve) */}
          <path d="M60 38C44 38 32 52 34 70C36 88 52 102 68 100C84 98 92 82 86 64C82 50 72 38 60 38Z" fill="url(#mangoGrad)" stroke="#d97706" strokeWidth="2.5" filter="drop-shadow(0 4px 6px rgba(217,119,6,0.3))" />
          {/* Gloss highlight */}
          <ellipse cx="48" cy="58" rx="6" ry="16" transform="rotate(-30 48 58)" fill="white" fillOpacity="0.4" />
          <defs>
            <linearGradient id="mangoGrad" x1="34" y1="40" x2="86" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ef4444" />
              <stop offset="0.3" stopColor="#f59e0b" />
              <stop offset="0.8" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#84cc16" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'N': // Nest
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#f5f5f4" />
          {/* Eggs inside */}
          <ellipse cx="48" cy="56" rx="8" ry="12" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" transform="rotate(-15 48 56)" />
          <ellipse cx="62" cy="54" rx="8" ry="12" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <ellipse cx="74" cy="58" rx="8" ry="12" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" transform="rotate(20 74 58)" />
          {/* Nest Straw Bowl */}
          <path d="M22 62C22 88 40 98 60 98C80 98 98 88 98 62C92 70 80 74 60 74C40 74 28 70 22 62Z" fill="#a8a29e" stroke="#57534e" strokeWidth="2.5" />
          {/* Straw Texture Crosses */}
          <path d="M24 66L96 74M26 78L94 68M34 88L86 86M40 94L80 94" stroke="#78716c" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 62L44 80M76 64L92 82M48 68L68 96M60 68L48 94" stroke="#57534e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'O': // Orange
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#ffedd5" />
          {/* Leaf & Twig */}
          <path d="M60 18C60 26 62 30 64 34" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <path d="M62 26C72 18 82 22 80 30C72 32 66 30 62 26Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
          {/* Orange Sphere */}
          <circle cx="60" cy="64" r="38" fill="url(#orangeGrad)" stroke="#c2410c" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(194,65,12,0.3))" />
          {/* Orange Texture Dimples */}
          <circle cx="50" cy="50" r="1" fill="#c2410c" />
          <circle cx="68" cy="52" r="1" fill="#c2410c" />
          <circle cx="44" cy="66" r="1" fill="#c2410c" />
          <circle cx="60" cy="74" r="1" fill="#c2410c" />
          <circle cx="74" cy="68" r="1" fill="#c2410c" />
          {/* Highlight */}
          <ellipse cx="46" cy="48" rx="8" ry="14" transform="rotate(-30 46 48)" fill="white" fillOpacity="0.4" />
          <defs>
            <linearGradient id="orangeGrad" x1="30" y1="30" x2="90" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb923c" />
              <stop offset="0.6" stopColor="#f97316" />
              <stop offset="1" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'P': // Parrot
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#d1fae5" />
          {/* Long Tail */}
          <path d="M66 84C70 96 74 108 72 114C68 114 62 102 60 90Z" fill="#059669" stroke="#047857" strokeWidth="1.5" />
          {/* Parrot Body */}
          <ellipse cx="58" cy="68" rx="20" ry="24" fill="#10b981" stroke="#047857" strokeWidth="2" />
          {/* Wing */}
          <path d="M56 56C68 56 74 72 70 84C62 86 54 78 54 68Z" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
          {/* Head */}
          <circle cx="48" cy="42" r="16" fill="#10b981" stroke="#047857" strokeWidth="2" />
          {/* Red Curved Beak */}
          <path d="M38 38C28 40 24 46 26 52C30 52 36 46 40 46Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
          {/* Eye Ring & Eye */}
          <circle cx="46" cy="38" r="5" fill="#fef3c7" stroke="#047857" strokeWidth="1" />
          <circle cx="46" cy="38" r="2.5" fill="#1e293b" />
          <circle cx="45" cy="37" r="0.8" fill="white" />
          {/* Red Neck Ring */}
          <path d="M42 54C48 58 56 56 60 52" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'Q': // Queen
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#f3e8ff" />
          {/* Golden Crown */}
          <polygon points="40,36 44,22 52,30 60,18 68,30 76,22 80,36" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
          {/* Crown Jewels */}
          <circle cx="44" cy="22" r="2.5" fill="#ef4444" />
          <circle cx="60" cy="18" r="3" fill="#3b82f6" />
          <circle cx="76" cy="22" r="2.5" fill="#10b981" />
          {/* Hair */}
          <path d="M36 48C34 66 36 78 40 82C44 76 44 64 42 50Z" fill="#78350f" />
          <path d="M84 48C86 66 84 78 80 82C76 76 76 64 78 50Z" fill="#78350f" />
          {/* Face */}
          <circle cx="60" cy="56" r="20" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
          {/* Eyes */}
          <ellipse cx="52" cy="54" rx="3" ry="3.5" fill="#1e293b" />
          <circle cx="53" cy="53" r="1" fill="white" />
          <ellipse cx="68" cy="54" rx="3" ry="3.5" fill="#1e293b" />
          <circle cx="69" cy="53" r="1" fill="white" />
          {/* Smile & Blush */}
          <path d="M55 64C58 67 62 67 65 64" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
          <circle cx="48" cy="60" r="3" fill="#f43f5e" fillOpacity="0.4" />
          <circle cx="72" cy="60" r="3" fill="#f43f5e" fillOpacity="0.4" />
          {/* Royal Gown Collar & Necklace */}
          <path d="M40 82C48 94 72 94 80 82L88 104H32Z" fill="#9333ea" stroke="#6b21a8" strokeWidth="2" />
          <path d="M48 78C54 84 66 84 72 78" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'R': // Rabbit
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#ffe4e6" />
          {/* Long Ears */}
          <ellipse cx="46" cy="30" rx="8" ry="20" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-10 46 30)" />
          <ellipse cx="46" cy="30" rx="4" ry="14" fill="#f472b6" transform="rotate(-10 46 30)" />
          <ellipse cx="74" cy="30" rx="8" ry="20" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" transform="rotate(10 74 30)" />
          <ellipse cx="74" cy="30" rx="4" ry="14" fill="#f472b6" transform="rotate(10 74 30)" />
          {/* Head */}
          <circle cx="60" cy="64" r="26" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          {/* Eyes */}
          <ellipse cx="50" cy="58" rx="4" ry="5" fill="#f43f5e" />
          <circle cx="51" cy="56" r="1.5" fill="white" />
          <ellipse cx="70" cy="58" rx="4" ry="5" fill="#f43f5e" />
          <circle cx="71" cy="56" r="1.5" fill="white" />
          {/* Pink Nose & Mouth */}
          <polygon points="57,66 63,66 60,70" fill="#ec4899" />
          <path d="M55 72C57 74 60 74 60 70C60 74 63 74 65 72" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          {/* Whiskers */}
          <line x1="36" y1="68" x2="48" y2="69" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="36" y1="74" x2="48" y2="72" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="72" y1="69" x2="84" y2="68" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="72" y1="72" x2="84" y2="74" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Carrot */}
          <polygon points="68,82 86,94 80,82" fill="#ea580c" />
          <line x1="84" y1="94" x2="90" y2="98" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'S': // Sun
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#fef3c7" />
          {/* Radiating Rays */}
          <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
            <line x1="60" y1="12" x2="60" y2="24" />
            <line x1="60" y1="96" x2="60" y2="108" />
            <line x1="12" y1="60" x2="24" y2="60" />
            <line x1="96" y1="60" x2="108" y2="60" />
            <line x1="26" y1="26" x2="35" y2="35" />
            <line x1="85" y1="85" x2="94" y2="94" />
            <line x1="94" y1="26" x2="85" y2="35" />
            <line x1="35" y1="85" x2="26" y2="94" />
          </g>
          {/* Main Sun Disc */}
          <circle cx="60" cy="60" r="32" fill="url(#sunGrad)" stroke="#f59e0b" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(245,158,11,0.4))" />
          {/* Smiling Face */}
          <circle cx="48" cy="54" r="4" fill="#78350f" />
          <circle cx="72" cy="54" r="4" fill="#78350f" />
          <path d="M46 66C52 74 68 74 74 66" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          {/* Rosy Cheeks */}
          <circle cx="42" cy="62" r="4" fill="#ef4444" fillOpacity="0.4" />
          <circle cx="78" cy="62" r="4" fill="#ef4444" fillOpacity="0.4" />
          <defs>
            <linearGradient id="sunGrad" x1="32" y1="32" x2="88" y2="88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fde047" />
              <stop offset="0.7" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'T': // Tiger
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#ffedd5" />
          {/* Ears */}
          <circle cx="36" cy="38" r="10" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
          <circle cx="36" cy="38" r="5" fill="#fef3c7" />
          <circle cx="84" cy="38" r="10" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
          <circle cx="84" cy="38" r="5" fill="#fef3c7" />
          {/* Head */}
          <circle cx="60" cy="62" r="32" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" />
          {/* Tiger Stripes */}
          {/* Forehead */}
          <path d="M60 36L60 48M52 40L56 46M68 40L64 46" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          {/* Cheeks */}
          <path d="M34 58L44 60M34 68L44 68M86 58L76 60M86 68L76 68" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          {/* White Snout */}
          <ellipse cx="60" cy="72" rx="16" ry="12" fill="#ffffff" />
          {/* Nose */}
          <polygon points="55,66 65,66 60,72" fill="#ef4444" />
          {/* Mouth */}
          <path d="M56 74C58 77 60 76 60 73C60 76 62 77 64 74" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="48" cy="54" rx="4" ry="5" fill="#1e293b" />
          <circle cx="49" cy="52" r="1.5" fill="white" />
          <ellipse cx="72" cy="54" rx="4" ry="5" fill="#1e293b" />
          <circle cx="73" cy="52" r="1.5" fill="white" />
        </svg>
      );

    case 'U': // Umbrella
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#dbeafe" />
          {/* Rain drops */}
          <ellipse cx="26" cy="24" rx="2" ry="4" fill="#3b82f6" />
          <ellipse cx="94" cy="28" rx="2" ry="4" fill="#3b82f6" />
          <ellipse cx="18" cy="56" rx="2" ry="4" fill="#3b82f6" />
          {/* Top Tip */}
          <line x1="60" y1="18" x2="60" y2="28" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          {/* Umbrella Canopy */}
          <path d="M20 58C20 32 40 26 60 26C80 26 100 32 100 58C90 54 80 58 75 58C70 54 60 58 60 58C60 58 50 54 45 58C40 58 30 54 20 58Z" fill="url(#umbrellaGrad)" stroke="#1e40af" strokeWidth="2.5" />
          {/* Canopy Rib Stripes */}
          <path d="M60 26C54 36 50 48 45 58M60 26C66 36 70 48 75 58" stroke="#1e40af" strokeWidth="2" />
          {/* J-Handle Shaft */}
          <line x1="60" y1="26" x2="60" y2="92" stroke="#78350f" strokeWidth="4" />
          {/* Curved J Handle */}
          <path d="M60 92C60 102 72 104 74 96C74 92 70 90 68 94" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="umbrellaGrad" x1="20" y1="26" x2="100" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ef4444" />
              <stop offset="0.33" stopColor="#fbbf24" />
              <stop offset="0.66" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'V': // Van
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#ccfbf1" />
          {/* Van Body */}
          <path d="M22 64C22 56 26 50 34 50H78C84 50 92 56 96 64L100 74H22Z" fill="#14b8a6" stroke="#0f766e" strokeWidth="2" />
          <rect x="20" y="68" width="82" height="24" rx="4" fill="#0d9488" stroke="#0f766e" strokeWidth="2" />
          {/* Windows */}
          <rect x="34" y="54" width="16" height="12" rx="2" fill="#e0f2fe" stroke="#0f766e" strokeWidth="1.5" />
          <rect x="54" y="54" width="16" height="12" rx="2" fill="#e0f2fe" stroke="#0f766e" strokeWidth="1.5" />
          <path d="M74 54H86C90 54 94 60 96 66H74Z" fill="#e0f2fe" stroke="#0f766e" strokeWidth="1.5" />
          {/* Headlight */}
          <rect x="98" y="74" width="4" height="6" rx="1" fill="#fde047" />
          {/* Wheels */}
          <circle cx="38" cy="92" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="38" cy="92" r="4" fill="#94a3b8" />
          <circle cx="82" cy="92" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="82" cy="92" r="4" fill="#94a3b8" />
        </svg>
      );

    case 'W': // Watch
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#f1f5f9" />
          {/* Strap */}
          <rect x="48" y="14" width="24" height="92" rx="4" fill="#475569" stroke="#1e293b" strokeWidth="2" />
          <line x1="52" y1="22" x2="68" y2="22" stroke="#334155" strokeWidth="1.5" />
          <line x1="52" y1="98" x2="68" y2="98" stroke="#334155" strokeWidth="1.5" />
          {/* Watch Case */}
          <circle cx="60" cy="60" r="28" fill="#ffffff" stroke="#0f172a" strokeWidth="4" filter="drop-shadow(0 4px 6px rgba(15,23,42,0.3))" />
          {/* Crown button */}
          <rect x="88" y="56" width="4" height="8" rx="1" fill="#64748b" />
          {/* Watch Face Marks */}
          <circle cx="60" cy="38" r="1.5" fill="#0f172a" />
          <circle cx="82" cy="60" r="1.5" fill="#0f172a" />
          <circle cx="60" cy="82" r="1.5" fill="#0f172a" />
          <circle cx="38" cy="60" r="1.5" fill="#0f172a" />
          {/* Hands */}
          <line x1="60" y1="60" x2="60" y2="44" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="60" x2="72" y2="60" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="60" y1="60" x2="52" y2="70" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
          {/* Center Pin */}
          <circle cx="60" cy="60" r="2.5" fill="#ef4444" />
        </svg>
      );

    case 'X': // Xylophone
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#fae8ff" />
          {/* Wooden Frame Rails */}
          <line x1="28" y1="40" x2="94" y2="52" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <line x1="24" y1="84" x2="98" y2="74" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          {/* Rainbow Bars (from large to small) */}
          <rect x="22" y="30" width="10" height="64" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          <rect x="34" y="33" width="10" height="58" rx="2" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
          <rect x="46" y="36" width="10" height="52" rx="2" fill="#eab308" stroke="#a16207" strokeWidth="1" />
          <rect x="58" y="39" width="10" height="46" rx="2" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
          <rect x="70" y="42" width="10" height="40" rx="2" fill="#06b6d4" stroke="#0e7490" strokeWidth="1" />
          <rect x="82" y="45" width="10" height="34" rx="2" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
          <rect x="94" y="48" width="10" height="28" rx="2" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
          {/* Mallet */}
          <line x1="42" y1="96" x2="72" y2="48" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <circle cx="72" cy="48" r="6" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
        </svg>
      );

    case 'Y': // Yak
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#fef3c7" />
          {/* Long Curving Horns */}
          <path d="M42 44C26 36 22 22 30 16C36 14 42 28 46 36" fill="#78350f" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          <path d="M78 44C94 36 98 22 90 16C84 14 78 28 74 36" fill="#78350f" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          {/* Head & Long Mountain Fur */}
          <circle cx="60" cy="58" r="24" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          <path d="M42 66L38 86M48 68L46 90M60 70L60 94M72 68L74 90M78 66L82 86" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          {/* Snout */}
          <ellipse cx="60" cy="68" rx="12" ry="8" fill="#fde68a" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="56" cy="68" r="2" fill="#451a03" />
          <circle cx="64" cy="68" r="2" fill="#451a03" />
          {/* Eyes */}
          <ellipse cx="50" cy="52" rx="3.5" ry="4" fill="#1e293b" />
          <circle cx="51" cy="50.5" r="1" fill="white" />
          <ellipse cx="70" cy="52" rx="3.5" ry="4" fill="#1e293b" />
          <circle cx="71" cy="50.5" r="1" fill="white" />
        </svg>
      );

    case 'Z': // Zebra
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#f4f4f5" />
          {/* Mane on top */}
          <path d="M48 24L52 38M56 22L58 36M64 22L64 36M72 24L68 38" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" />
          {/* Ears */}
          <polygon points="40,42 46,24 54,38" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
          <polygon points="44,38 46,28 50,38" fill="#f472b6" />
          <polygon points="80,42 74,24 66,38" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
          <polygon points="76,38 74,28 70,38" fill="#f472b6" />
          {/* Head */}
          <circle cx="60" cy="62" r="30" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
          {/* Black Zebra Stripes */}
          {/* Forehead stripes */}
          <path d="M60 38V50M52 42L56 48M68 42L64 48" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
          {/* Cheek stripes */}
          <path d="M32 58C40 60 46 60 46 60M32 68C42 68 48 66 48 66" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
          <path d="M88 58C80 60 74 60 74 60M88 68C78 68 72 66 72 66" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
          {/* Dark Snout */}
          <ellipse cx="60" cy="74" rx="14" ry="10" fill="#27272a" />
          {/* Nostrils */}
          <circle cx="56" cy="74" r="2" fill="#71717a" />
          <circle cx="64" cy="74" r="2" fill="#71717a" />
          {/* Eyes */}
          <ellipse cx="48" cy="54" rx="4" ry="5" fill="#18181b" />
          <circle cx="49" cy="52" r="1.5" fill="white" />
          <ellipse cx="72" cy="54" rx="4" ry="5" fill="#18181b" />
          <circle cx="73" cy="52" r="1.5" fill="white" />
        </svg>
      );

    default:
      return null;
  }
};
