export type FrameDimension = '3D' | '4D' | '8D' | '16D';

export type FrameShape =
  | 'circle'
  | 'hexagon'
  | 'octagon'
  | 'diamond'
  | 'squircle'
  | 'shield'
  | 'starburst'
  | 'lotus'
  | 'crown'
  | 'crystal';

export interface ProfileFrameDefinition {
  id: string;
  name: string;
  nameHi: string;
  tier: 'free' | 'bronze' | 'silver' | 'gold' | 'sapphire' | 'emerald' | 'ruby' | 'diamond' | 'vip' | 'festive';
  dimension: FrameDimension;
  shape: FrameShape;
  zoomEffect?: boolean;
  requiredPlanId?: number;
  effectClass: string;
  cssClass: string;
  glowColor: string;
  badgeLabel?: string;
  badgeIcon?: string;
  description: string;
}

export type ProfileFrame = ProfileFrameDefinition;

export const SHAPE_LABELS: Record<FrameShape, { en: string; hi: string; icon: string }> = {
  circle: { en: 'Round Circle', hi: 'गोल रिंग', icon: '⭕' },
  hexagon: { en: 'Hexagon', hi: 'षट्भुज (Hex)', icon: '⬡' },
  octagon: { en: 'Octagon', hi: 'अष्टभुज (Oct)', icon: '🛑' },
  diamond: { en: 'Diamond', hi: 'हीरा कट', icon: '🔷' },
  squircle: { en: 'Squircle VIP', hi: 'सुपर-स्क्वायर', icon: '🔲' },
  shield: { en: 'Royal Shield', hi: 'सुरक्षा ढाल', icon: '🛡️' },
  starburst: { en: 'Surya Star', hi: 'सूर्य चक्र', icon: '✴️' },
  lotus: { en: 'Sacred Lotus', hi: 'कमल पुष्प', icon: '🪷' },
  crown: { en: 'Royal Crown', hi: 'राज मुकुट', icon: '👑' },
  crystal: { en: 'Gem Crystal', hi: 'जेम क्रिस्टल', icon: '💎' },
};

interface RawFrameInput {
  id: string;
  name: string;
  nameHi: string;
  tier: ProfileFrameDefinition['tier'];
  dimension?: FrameDimension;
  shape?: FrameShape;
  zoomEffect?: boolean;
  requiredPlanId?: number;
  effectClass: string;
  glowColor: string;
  badgeLabel?: string;
  badgeIcon?: string;
  description: string;
}

const buildFrame = (raw: RawFrameInput): ProfileFrameDefinition => {
  const dimension: FrameDimension = raw.dimension || '3D';
  const shape: FrameShape = raw.shape || 'circle';
  const zoomEffect = raw.zoomEffect !== undefined ? raw.zoomEffect : dimension !== '3D';
  const dimClass = `frame-dim-${dimension.toLowerCase()}`;
  const shapeClass = `frame-shape-${shape}`;
  const zoomClass = zoomEffect ? 'frame-zoom-pulse' : 'frame-zoom-hover';
  return {
    ...raw,
    dimension,
    shape,
    zoomEffect,
    cssClass: `${raw.effectClass} ${shapeClass} ${dimClass} ${zoomClass}`,
  };
};

const RAW_FRAMES: RawFrameInput[] = [
  // =========================================================================
  // 1. IOIS Dynamic Rotating Round Orbit Frames (Circle + Glow + Zoom)
  // =========================================================================
  {
    id: 'iois-spinning-orbit-rainbow',
    name: 'IOIS India Rainbow Chakra Orbit',
    nameHi: 'IOIS चक्र घूमता हुआ 4D रेनबो फ्रेम',
    tier: 'vip',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-iois-spinning-orbit-rainbow',
    glowColor: '#00e676',
    badgeLabel: 'IOIS 4D ORBIT',
    badgeIcon: '🌀',
    description: '360° गोल घूमता हुआ मल्टीकलर चक्र, नियॉन ग्लो और स्मूथ ज़ूम इफेक्ट।'
  },
  {
    id: 'iois-spinning-orbit-gold',
    name: '24K Royal Gold Orbit',
    nameHi: '24K गोल्ड गोल घूमता रिंग',
    tier: 'gold',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-iois-spinning-orbit-gold',
    glowColor: '#fbbf24',
    badgeLabel: 'GOLD 4D ORBIT',
    badgeIcon: '✨',
    description: 'सोने की मोतियों जैसा घूमता हुआ शाही 4D रिंग और सुनहरा ग्लो।'
  },
  {
    id: 'iois-spinning-orbit-tricolor',
    name: 'Tiranga National Orbit',
    nameHi: 'तिरंगा देशभक्ति घूमता आभामंडल',
    tier: 'vip',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-iois-spinning-orbit-tricolor',
    glowColor: '#ff9933',
    badgeLabel: 'BHARAT PRIDE',
    badgeIcon: '🇮🇳',
    description: 'केसरिया, श्वेत और हरे रंग का निरंतर घूमता गौरवशाली वलय।'
  },
  {
    id: 'iois-spinning-orbit-cyan',
    name: 'Cyber Quantum Orbit',
    nameHi: 'साइबर क्वांटम ब्लू रिंग',
    tier: 'sapphire',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-iois-spinning-orbit-cyan',
    glowColor: '#38bdf8',
    badgeLabel: 'QUANTUM 4D',
    badgeIcon: '⚡',
    description: 'इलेक्ट्रिक ब्लू व स्यान का हाई-स्पीड चक्रवाती रिंग और नियॉन ग्लो।'
  },

  // =========================================================================
  // 2. Plan-Specific Official Membership Frames (3D → 16D Progression)
  // =========================================================================
  {
    id: 'plan-01-balvikas',
    name: 'Bal Vikas Bronze Shield',
    nameHi: 'प्लान 01 बाल विकास ब्रॉन्ज फ्रेम',
    tier: 'bronze',
    dimension: '3D',
    shape: 'circle',
    requiredPlanId: 1,
    effectClass: 'frame-plan-01-balvikas',
    glowColor: '#f97316',
    badgeLabel: 'PLAN 01 PASS',
    badgeIcon: '🌱',
    description: 'आरंभिक ₹10 बाल विकास वेरिफिकेशन पास का चमकदार ब्रॉन्ज वलय।'
  },
  {
    id: 'plan-02-youthskill',
    name: 'Youth Skill Cyber Silver',
    nameHi: 'प्लान 02 यूथ स्किल सिल्वर फ्रेम',
    tier: 'silver',
    dimension: '3D',
    shape: 'squircle',
    requiredPlanId: 2,
    effectClass: 'frame-plan-02-youthskill',
    glowColor: '#38bdf8',
    badgeLabel: 'SKILL PRO',
    badgeIcon: '💻',
    description: '₹49 यूथ स्किल हेतु आधुनिक पॉलिश्ड सिल्वर स्क्वार्कल व नियॉन बॉर्डर।'
  },
  {
    id: 'plan-03-career',
    name: 'Career & Job Gold Crest',
    nameHi: 'प्लान 03 करियर गोल्ड मेडलियन',
    tier: 'gold',
    dimension: '4D',
    shape: 'octagon',
    zoomEffect: true,
    requiredPlanId: 3,
    effectClass: 'frame-plan-03-career',
    glowColor: '#eab308',
    badgeLabel: 'CAREER VIP',
    badgeIcon: '🎯',
    description: '₹99 करियर व सरकारी परीक्षा तैयारी का 4D गोल्ड अष्टभुज मेडलियन।'
  },
  {
    id: 'plan-04-familyvip',
    name: 'Family VIP Sapphire Guard',
    nameHi: 'प्लान 04 फैमिली VIP नीलम फ्रेम',
    tier: 'sapphire',
    dimension: '4D',
    shape: 'shield',
    zoomEffect: true,
    requiredPlanId: 4,
    effectClass: 'frame-plan-04-familyvip',
    glowColor: '#6366f1',
    badgeLabel: 'FAMILY VIP',
    badgeIcon: '🛡️',
    description: '₹199 पारिवारिक सुरक्षा का शाही नीलम और सुरक्षा ढाल चक्र।'
  },
  {
    id: 'plan-05-studentelite',
    name: 'Student Elite Emerald Halo',
    nameHi: 'प्लान 05 स्टूडेंट एलीट पन्ना फ्रेम',
    tier: 'emerald',
    dimension: '8D',
    shape: 'hexagon',
    zoomEffect: true,
    requiredPlanId: 5,
    effectClass: 'frame-plan-05-studentelite',
    glowColor: '#10b981',
    badgeLabel: 'ELITE 8D',
    badgeIcon: '🎓',
    description: '₹299 NCERT व उच्च शिक्षा का 8D पन्ना षट्भुज आभामंडल।'
  },
  {
    id: 'plan-06-agencyreseller',
    name: 'Agency Reseller Ruby Crown',
    nameHi: 'प्लान 06 एजेंसी रीसेलर रूबी फ्रेम',
    tier: 'ruby',
    dimension: '8D',
    shape: 'crystal',
    zoomEffect: true,
    requiredPlanId: 6,
    effectClass: 'frame-plan-06-agencyreseller',
    glowColor: '#f43f5e',
    badgeLabel: 'CSC 8D VIP',
    badgeIcon: '🏬',
    description: '₹499 दुकानदार व CSC संचालक हेतु 8D रूबी लाल क्रिस्टल फ्रेम।'
  },
  {
    id: 'plan-07-masterlifetime',
    name: 'Master Lifetime 999 Diamond 16D',
    nameHi: 'प्लान 07 मास्टर लाइफटाइम 16D क्राउन',
    tier: 'diamond',
    dimension: '16D',
    shape: 'crown',
    zoomEffect: true,
    requiredPlanId: 7,
    effectClass: 'frame-plan-07-masterlifetime',
    glowColor: '#a855f7',
    badgeLabel: '16D LIFETIME',
    badgeIcon: '👑',
    description: 'सर्वोच्च ₹999 प्लान का 16D डायमंड, मल्टी-ग्लो और घूमता शाही मुकुट।'
  },

  // =========================================================================
  // 3. 16D QUANTUM SUPREME & COSMIC PRO FILES (NEW)
  // =========================================================================
  {
    id: 'quantum-16d-hypercube',
    name: '16D Quantum Hypercube Matrix',
    nameHi: '16D क्वांटम हाइपरक्यूब अष्टभुज',
    tier: 'diamond',
    dimension: '16D',
    shape: 'octagon',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-hypercube',
    glowColor: '#38bdf8',
    badgeLabel: '16D QUANTUM',
    badgeIcon: '💠',
    description: '16-आयामी क्वांटम लेज़र आभा, डबल स्पिन और डीप ज़ूम इफेक्ट।'
  },
  {
    id: 'quantum-16d-mahakal-trishul',
    name: '16D Mahakal Trishul Shield',
    nameHi: '16D महाकाल त्रिशूल शक्ति ढाल',
    tier: 'vip',
    dimension: '16D',
    shape: 'shield',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-mahakal-trishul',
    glowColor: '#f97316',
    badgeLabel: '16D TRISHUL',
    badgeIcon: '🔱',
    description: 'भगवा-स्वर्ण त्रिशूल शक्ति, रौद्र नियॉन ग्लो और 16D सुरक्षा कवच।'
  },
  {
    id: 'quantum-16d-om-brahmand',
    name: '16D Om Brahmand Divya Lotus',
    nameHi: '16D ॐ ब्रह्मांड दिव्य कमल',
    tier: 'festive',
    dimension: '16D',
    shape: 'lotus',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-om-brahmand',
    glowColor: '#fbbf24',
    badgeLabel: '16D OM DIVINE',
    badgeIcon: 'ॐ',
    description: 'पवित्र ॐ चिन्ह, खिलते कमल आकार और स्वर्ण ब्रह्मांडीय प्रकाश।'
  },
  {
    id: 'quantum-16d-vishwakarma-chakra',
    name: '16D Sudarshan Chakra Starburst',
    nameHi: '16D सुदर्शन चक्र सूर्य विस्फोट',
    tier: 'gold',
    dimension: '16D',
    shape: 'starburst',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-vishwakarma-chakra',
    glowColor: '#f59e0b',
    badgeLabel: '16D CHAKRA',
    badgeIcon: '☸️',
    description: 'तेज गति से घूमती 16D स्वर्ण किरणें और आध्यात्मिक चक्र चिन्ह।'
  },
  {
    id: 'quantum-16d-kohinoor-emperor',
    name: '16D Kohinoor Emperor Crown',
    nameHi: '16D कोहिनूर सम्राट मुकुट',
    tier: 'diamond',
    dimension: '16D',
    shape: 'crown',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-kohinoor-emperor',
    glowColor: '#e0f2fe',
    badgeLabel: '16D EMPEROR',
    badgeIcon: '👑',
    description: 'रॉयल राजमुकुट आकार में 16D कोहिनूर हीरे जैसी असीम चमक।'
  },
  {
    id: 'quantum-16d-surya-dev-corona',
    name: '16D Surya Dev Golden Zoom',
    nameHi: '16D सूर्य देव दिव्य किरण फ्रेम',
    tier: 'festive',
    dimension: '16D',
    shape: 'starburst',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-surya-dev-corona',
    glowColor: '#fb923c',
    badgeLabel: '16D SURYA',
    badgeIcon: '☀️',
    description: 'सूर्य मंडल जैसी 16 किरणों का तेजस्वी गोल्डन ज़ूम आभामंडल।'
  },
  {
    id: 'quantum-16d-crystal-galaxy',
    name: '16D Galaxy Diamond Crystal',
    nameHi: '16D गैलेक्सी डायमंड क्रिस्टल',
    tier: 'diamond',
    dimension: '16D',
    shape: 'crystal',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-crystal-galaxy',
    glowColor: '#c084fc',
    badgeLabel: '16D CRYSTAL',
    badgeIcon: '💎',
    description: 'अष्ट-कोणीय हीरा कट आकार और बहुरंगी 16D गैलेक्सी पल्स।'
  },
  {
    id: 'quantum-16d-rainbow-zoom-max',
    name: '16D Rainbow Neon Circle Zoom',
    nameHi: '16D रेनबो नियॉन गोल ज़ूम रिंग',
    tier: 'vip',
    dimension: '16D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-rainbow-zoom-max',
    glowColor: '#ec4899',
    badgeLabel: '16D ZOOM RING',
    badgeIcon: '🌈',
    description: 'अल्ट्रा-ब्राइट राउंड सर्कल नियॉन ग्लो और फोटो पर स्मूथ ज़ूम इफेक्ट।'
  },
  {
    id: 'quantum-16d-shakti-peacock',
    name: '16D Mayur Pankh Shakti Lotus',
    nameHi: '16D मयूर पंख शक्ति कमल',
    tier: 'emerald',
    dimension: '16D',
    shape: 'lotus',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-shakti-peacock',
    glowColor: '#14b8a6',
    badgeLabel: '16D MAYUR',
    badgeIcon: '🦚',
    description: 'मोरपंख के नीले-हरे रंगों का 16D चमकदार कमल वलय।'
  },
  {
    id: 'quantum-16d-phoenix-sovereign',
    name: '16D Garuda Sovereign Shield',
    nameHi: '16D गरुड़ संप्रभु गोल्ड ढाल',
    tier: 'ruby',
    dimension: '16D',
    shape: 'shield',
    zoomEffect: true,
    effectClass: 'frame-quantum-16d-phoenix-sovereign',
    glowColor: '#e11d48',
    badgeLabel: '16D GARUDA',
    badgeIcon: '🦅',
    description: 'अजेय गरुड़ प्रतीक के साथ लाल-स्वर्ण 16D शाही सुरक्षा कवच।'
  },

  // =========================================================================
  // 4. 8D HOLOGRAPHIC MULTI-SHAPE & NEON ZOOM COLLECTION (NEW)
  // =========================================================================
  {
    id: 'holo-8d-cyber-hexagon',
    name: '8D Cyber Neon Hexagon',
    nameHi: '8D साइबर नियॉन षट्भुज फ्रेम',
    tier: 'vip',
    dimension: '8D',
    shape: 'hexagon',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-cyber-hexagon',
    glowColor: '#06b6d4',
    badgeLabel: '8D HEXAGON',
    badgeIcon: '⬡',
    description: 'भविष्यवादी स्यान-मैजेंटा 8D षट्भुज आकार और तेज़ नियॉन चमक।'
  },
  {
    id: 'holo-8d-diamond-prism',
    name: '8D Diamond Cut Neon Prism',
    nameHi: '8D डायमंड कट नियॉन प्रिज्म',
    tier: 'diamond',
    dimension: '8D',
    shape: 'diamond',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-diamond-prism',
    glowColor: '#38bdf8',
    badgeLabel: '8D DIAMOND',
    badgeIcon: '🔷',
    description: 'असली तराशे हुए हीरे जैसा चतुर-कोणीय 8D ग्लोइंग फ्रेम।'
  },
  {
    id: 'holo-8d-plasma-octagon',
    name: '8D Electric Plasma Octagon',
    nameHi: '8D इलेक्ट्रिक प्लाज़्मा अष्टभुज',
    tier: 'sapphire',
    dimension: '8D',
    shape: 'octagon',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-plasma-octagon',
    glowColor: '#6366f1',
    badgeLabel: '8D OCTAGON',
    badgeIcon: '⚡',
    description: 'विद्युत तरंगों वाला 8-कोणीय अष्टभुज सुरक्षा बॉर्डर व ज़ूम।'
  },
  {
    id: 'holo-8d-emerald-shield',
    name: '8D Emerald Raksha Shield',
    nameHi: '8D पन्ना रक्षा सुरक्षा ढाल',
    tier: 'emerald',
    dimension: '8D',
    shape: 'shield',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-emerald-shield',
    glowColor: '#10b981',
    badgeLabel: '8D SHIELD',
    badgeIcon: '🛡️',
    description: 'सशक्त शील्ड आकार में 8D पन्ना ग्रीन लेज़र ग्लो इफेक्ट।'
  },
  {
    id: 'holo-8d-ruby-starburst',
    name: '8D Crimson Fire Starburst',
    nameHi: '8D अग्नि ज्वाला स्टारबर्स्ट',
    tier: 'ruby',
    dimension: '8D',
    shape: 'starburst',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-ruby-starburst',
    glowColor: '#f43f5e',
    badgeLabel: '8D FIRE STAR',
    badgeIcon: '🔥',
    description: 'आग की लपटों जैसा 10-किरणों वाला 8D रूबी स्टारबर्स्ट फ्रेम।'
  },
  {
    id: 'holo-8d-gold-squircle',
    name: '8D Champion Gold Squircle',
    nameHi: '8D चैंपियन गोल्ड स्क्वार्कल',
    tier: 'gold',
    dimension: '8D',
    shape: 'squircle',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-gold-squircle',
    glowColor: '#fbbf24',
    badgeLabel: '8D CHAMPION',
    badgeIcon: '🏆',
    description: 'आधुनिक गोलाकार-चौकोर VIP आकार और 24K गोल्डन ग्लो ज़ूम।'
  },
  {
    id: 'holo-8d-chandrayaan-orbit',
    name: '8D Chandrayaan Space Orbit',
    nameHi: '8D चंद्रयान अंतरिक्ष रिंग',
    tier: 'sapphire',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-chandrayaan-orbit',
    glowColor: '#60a5fa',
    badgeLabel: '8D SPACE',
    badgeIcon: '🚀',
    description: 'चंद्रयान और अंतरिक्ष के नीले-चांदी रंगों का 8D रोटेटिंग ग्लो।'
  },
  {
    id: 'holo-8d-eid-chand-mubarak',
    name: '8D Noor-e-Qamar Crescent',
    nameHi: '8D नूर-ए-क़मर चांद क्रिस्टल',
    tier: 'festive',
    dimension: '8D',
    shape: 'crystal',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-eid-chand-mubarak',
    glowColor: '#34d399',
    badgeLabel: '8D CHAND NOOR',
    badgeIcon: '🌙',
    description: 'ईद व चांदनी रात की पन्ना-स्वर्ण आभा और क्रिस्टल कट ग्लो।'
  },
  {
    id: 'holo-8d-kalash-swastik',
    name: '8D Mangal Kalash Lotus',
    nameHi: '8D मंगल कलश शुभ कमल',
    tier: 'festive',
    dimension: '8D',
    shape: 'lotus',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-kalash-swastik',
    glowColor: '#f59e0b',
    badgeLabel: '8D SHUBH',
    badgeIcon: '🪔',
    description: 'मांगलिक सिंदूरी व हल्दी रंग का 8D कमल पुष्प फ्रेम।'
  },
  {
    id: 'holo-8d-sapphire-zoom-ring',
    name: '8D Sapphire Neon Circle Zoom',
    nameHi: '8D नीलम नियॉन गोल ज़ूम रिंग',
    tier: 'sapphire',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-holo-8d-sapphire-zoom-ring',
    glowColor: '#0ea5e9',
    badgeLabel: '8D NEON ZOOM',
    badgeIcon: '💠',
    description: 'गहरा नीला नियॉन सर्कल ग्लो और फोटो का आकर्षक 8D ज़ूम।'
  },

  // =========================================================================
  // 5. 4D ROUND CIRCLE GLOW, ZOOM & SYMBOL EDITIONS (NEW)
  // =========================================================================
  {
    id: 'glow-4d-neon-circle-cyan',
    name: '4D Cyan Neon Circle Glow',
    nameHi: '4D स्यान नियॉन ग्लो गोल रिंग',
    tier: 'sapphire',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-glow-4d-neon-circle-cyan',
    glowColor: '#22d3ee',
    badgeLabel: '4D CYAN GLOW',
    badgeIcon: '🌀',
    description: 'दमकता हुआ इलेक्ट्रिक स्यान गोल घेरा और स्मूथ प्रोफाइल ज़ूम।'
  },
  {
    id: 'glow-4d-golden-halo-zoom',
    name: '4D Golden Halo Circle Zoom',
    nameHi: '4D सुनहरा हेलो गोल ज़ूम फ्रेम',
    tier: 'gold',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-glow-4d-golden-halo-zoom',
    glowColor: '#facc15',
    badgeLabel: '4D GOLD ZOOM',
    badgeIcon: '✨',
    description: '24K सोने का चमकदार गोल घेरा जो फोटो को ज़ूम करके उभारता है।'
  },
  {
    id: 'glow-4d-rose-magenta-pulse',
    name: '4D Rose Magenta Pulse Circle',
    nameHi: '4D रोज़ मैजेंटा पल्स गोल रिंग',
    tier: 'ruby',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-glow-4d-rose-magenta-pulse',
    glowColor: '#f472b6',
    badgeLabel: '4D ROSE GLOW',
    badgeIcon: '💖',
    description: 'खूबसूरत गुलाबी व मैजेंटा ग्लो के साथ पल्सिंग राउंड रिंग।'
  },
  {
    id: 'glow-4d-emerald-radar-zoom',
    name: '4D Emerald Neon Circle Zoom',
    nameHi: '4D पन्ना नियॉन गोल ज़ूम रिंग',
    tier: 'emerald',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-glow-4d-emerald-radar-zoom',
    glowColor: '#10b981',
    badgeLabel: '4D EMERALD',
    badgeIcon: '💚',
    description: 'सक्रिय पन्ना हरा नियॉन प्रकाश व फोटो ज़ूम पल्स।'
  },
  {
    id: 'glow-4d-tricolor-ashok-zoom',
    name: '4D Tiranga Glow Circle Zoom',
    nameHi: '4D तिरंगा ग्लो गोल ज़ूम रिंग',
    tier: 'vip',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-glow-4d-tricolor-ashok-zoom',
    glowColor: '#ff9933',
    badgeLabel: '4D TIRANGA',
    badgeIcon: '🇮🇳',
    description: 'केसरिया-श्वेत-हरा 4D गोल ग्लो और गौरवशाली फोटो ज़ूम।'
  },
  {
    id: 'glow-4d-amethyst-squircle',
    name: '4D Amethyst Royal Squircle',
    nameHi: '4D जमुनिया रॉयल स्क्वार्कल',
    tier: 'diamond',
    dimension: '4D',
    shape: 'squircle',
    zoomEffect: true,
    effectClass: 'frame-glow-4d-amethyst-squircle',
    glowColor: '#a855f7',
    badgeLabel: '4D SQUIRCLE',
    badgeIcon: '🔮',
    description: 'आधुनिक गोलाकार चौकोर आकार में जामुनी क्रिस्टल ग्लो।'
  },
  {
    id: 'glow-4d-bronze-warrior-hex',
    name: '4D Warrior Bronze Hexagon',
    nameHi: '4D योद्धा ब्रॉन्ज षट्भुज',
    tier: 'bronze',
    dimension: '4D',
    shape: 'hexagon',
    zoomEffect: true,
    effectClass: 'frame-glow-4d-bronze-warrior-hex',
    glowColor: '#ea580c',
    badgeLabel: '4D WARRIOR',
    badgeIcon: '⚔️',
    description: 'तांबे और सोने की चमक वाला षट्भुज योद्धा फ्रेम।'
  },
  {
    id: 'glow-4d-pearl-crown-crest',
    name: '4D Pearl White Royal Crown',
    nameHi: '4D मोती श्वेत राजमुकुट',
    tier: 'silver',
    dimension: '4D',
    shape: 'crown',
    zoomEffect: true,
    effectClass: 'frame-glow-4d-pearl-crown-crest',
    glowColor: '#f8fafc',
    badgeLabel: '4D PEARL CROWN',
    badgeIcon: '🤍',
    description: 'सफेद मोती और चांदी की दिव्य चमक वाला मुकुट फ्रेम।'
  },

  // =========================================================================
  // 6. SACRED SYMBOL & HERITAGE SPECIAL EDITIONS (NEW)
  // =========================================================================
  {
    id: 'symbol-navratri-shakti-trishul',
    name: 'Navratri Maa Durga Starburst',
    nameHi: 'नवरात्रि माँ शक्ति सूर्य स्टारबर्स्ट',
    tier: 'festive',
    dimension: '8D',
    shape: 'starburst',
    zoomEffect: true,
    effectClass: 'frame-symbol-navratri-shakti-trishul',
    glowColor: '#ef4444',
    badgeLabel: 'JAI MATA DI',
    badgeIcon: '🔱',
    description: 'चुनरी लाल व स्वर्ण किरणों वाला नवरात्रि विशेष शक्ति फ्रेम।'
  },
  {
    id: 'symbol-holi-gulal-splash',
    name: 'Holi Rangotsav Colour Lotus',
    nameHi: 'होली रंगोत्सव गुलाल कमल',
    tier: 'festive',
    dimension: '4D',
    shape: 'lotus',
    zoomEffect: true,
    effectClass: 'frame-symbol-holi-gulal-splash',
    glowColor: '#ec4899',
    badgeLabel: 'HOLI RANG',
    badgeIcon: '🎨',
    description: 'गुलाल के सभी जीवंत रंगों से सजा खिलता हुआ होली कमल।'
  },
  {
    id: 'symbol-krishna-bansuri-peacock',
    name: 'Krishna Morpankh Circle Glow',
    nameHi: 'श्री कृष्ण मोरपंख दिव्य रिंग',
    tier: 'festive',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-symbol-krishna-bansuri-peacock',
    glowColor: '#06b6d4',
    badgeLabel: 'MORPANKH',
    badgeIcon: '🦚',
    description: 'मोरपंख और बांसुरी की नीली-हरी स्वर्णिम आभा का गोल घेरा।'
  },
  {
    id: 'symbol-buddha-bodhi-peace',
    name: 'Gautam Buddha Bodhi Lotus',
    nameHi: 'गौतम बुद्ध शांति बोधि कमल',
    tier: 'gold',
    dimension: '4D',
    shape: 'lotus',
    zoomEffect: true,
    effectClass: 'frame-symbol-buddha-bodhi-peace',
    glowColor: '#fbbf24',
    badgeLabel: 'BODHI PEACE',
    badgeIcon: '☸️',
    description: 'शांति, करुणा और सुनहरे ध्यान प्रकाश का कमल वलय।'
  },
  {
    id: 'symbol-ganesh-siddhi-gold',
    name: 'Shree Ganesh Riddhi Octagon',
    nameHi: 'श्री गणेश रिद्धि-सिद्धि अष्टभुज',
    tier: 'festive',
    dimension: '8D',
    shape: 'octagon',
    zoomEffect: true,
    effectClass: 'frame-symbol-ganesh-siddhi-gold',
    glowColor: '#f97316',
    badgeLabel: 'SHREE GANESH',
    badgeIcon: '🕉️',
    description: 'शुभ लाभ सिंदूरी और स्वर्ण अष्टभुज सिद्धि फ्रेम।'
  },
  {
    id: 'symbol-tiger-bharat-shourya',
    name: 'Bharat Shourya Tiger Shield',
    nameHi: 'भारत शौर्य रॉयल टाइगर ढाल',
    tier: 'vip',
    dimension: '4D',
    shape: 'shield',
    zoomEffect: true,
    effectClass: 'frame-symbol-tiger-bharat-shourya',
    glowColor: '#f59e0b',
    badgeLabel: 'SHOURYA VIP',
    badgeIcon: '🐅',
    description: 'भारतीय शौर्य और आत्मविश्वास का प्रतीक स्वर्ण-ब्लैक ढाल।'
  },

  // =========================================================================
  // 7. Classic Festive High-Definition Frames (Existing Preserved)
  // =========================================================================
  {
    id: 'festive-dhanteras-gold',
    name: 'Dhanteras Swarna Kalash',
    nameHi: 'धनतेरस स्वर्ण कलश 4D फ्रेम',
    tier: 'festive',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-festive-dhanteras-gold',
    glowColor: '#fbbf24',
    badgeLabel: 'DHANTERAS',
    badgeIcon: '🪙',
    description: 'स्वर्ण सिक्कों व धन्वंतरि कृपा का महालक्ष्मी आभामंडल।'
  },
  {
    id: 'festive-diwali-diya',
    name: 'Diwali Jyoti Diya Aura',
    nameHi: 'दीपावली दीपक ज्योति 4D फ्रेम',
    tier: 'festive',
    dimension: '4D',
    shape: 'lotus',
    zoomEffect: true,
    effectClass: 'frame-festive-diwali-diya',
    glowColor: '#f59e0b',
    badgeLabel: 'SHUBH DEEPAVALI',
    badgeIcon: '🪔',
    description: 'प्रज्वलित दीपक व सुनहरी रंगोली की जीवंत रोशनी।'
  },
  {
    id: 'festive-chhath-surya',
    name: 'Chhath Surya Arghya Corona',
    nameHi: 'छठ पूजा सूर्य अर्घ्य 8D कोरोना',
    tier: 'festive',
    dimension: '8D',
    shape: 'starburst',
    zoomEffect: true,
    effectClass: 'frame-festive-chhath-surya',
    glowColor: '#ea580c',
    badgeLabel: 'JAI CHHATHI MAIYA',
    badgeIcon: '☀️',
    description: 'भगवान भास्कर की लालिमा व सूप-अर्घ्य का पवित्र 8D आभामंडल।'
  },
  {
    id: 'festive-govardhan-annakoot',
    name: 'Govardhan Annakoot Greenery',
    nameHi: 'गोवर्धन अन्नकूट प्राकृतिक फ्रेम',
    tier: 'festive',
    dimension: '3D',
    shape: 'circle',
    effectClass: 'frame-festive-govardhan-annakoot',
    glowColor: '#16a34a',
    badgeLabel: 'GOVARDHAN',
    badgeIcon: '🌾',
    description: 'मोरपंख व प्रकृति की हरितिमा का आध्यात्मिक वलय।'
  },
  {
    id: 'festive-bhaidooj-raksha',
    name: 'Bhai Dooj Sneha Bandhan',
    nameHi: 'भाई दूज स्नेह रक्षा फ्रेम',
    tier: 'festive',
    dimension: '3D',
    shape: 'circle',
    effectClass: 'frame-festive-bhaidooj-raksha',
    glowColor: '#ec4899',
    badgeLabel: 'BHAI DOOJ',
    badgeIcon: '🌸',
    description: 'रोली-अक्षत और पवित्र रक्षा धागे का गुलाबी व लाल बॉर्डर।'
  },

  // =========================================================================
  // 8. Luxury Gemstone & Royal VIP Frames (Existing Preserved + Enriched)
  // =========================================================================
  {
    id: 'royal-coronet-24k',
    name: 'Royal Imperial 24K Coronet',
    nameHi: 'शाही इम्पीरियल 24K मुकुट फ्रेम',
    tier: 'gold',
    dimension: '4D',
    shape: 'crown',
    zoomEffect: true,
    effectClass: 'frame-royal-coronet-24k',
    glowColor: '#d97706',
    badgeLabel: 'IMPERIAL',
    badgeIcon: '⚜️',
    description: 'रोलेक्स स्टाइल 24-कैरेट उभरा हुआ ग्रूव्ड गोल्ड बेज़ेल।'
  },
  {
    id: 'platinum-titanium-bezel',
    name: 'Platinum Titanium Bezel',
    nameHi: 'प्लैटिनम टाइटेनियम रिंग',
    tier: 'silver',
    dimension: '3D',
    shape: 'octagon',
    effectClass: 'frame-platinum-titanium-bezel',
    glowColor: '#cbd5e1',
    badgeLabel: 'PLATINUM',
    badgeIcon: '💎',
    description: 'ब्रश किए हुए प्लैटिनम व क्रोमियम का अल्ट्रा-लक्ज़री मेटैलिक लुक।'
  },
  {
    id: 'ruby-crimson-flare',
    name: 'Ruby Crimson Flare',
    nameHi: 'माणिक्य रूबी क्रिम्सन वलय',
    tier: 'ruby',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-ruby-crimson-flare',
    glowColor: '#e11d48',
    badgeLabel: 'RUBY ELITE',
    badgeIcon: '🩸',
    description: 'गहरे रक्त-लाल रूबी रत्न का धधकता हुआ गोल लेयर।'
  },
  {
    id: 'sapphire-deep-ocean',
    name: 'Sapphire Deep Ocean',
    nameHi: 'गहरा नीलम ओशन वेव',
    tier: 'sapphire',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-sapphire-deep-ocean',
    glowColor: '#0284c7',
    badgeLabel: 'SAPPHIRE',
    badgeIcon: '🌊',
    description: 'गहरे नीले समुद्र जैसे नीलम का रिपलिंग रिंग।'
  },
  {
    id: 'emerald-royal-filigree',
    name: 'Emerald Royal Filigree',
    nameHi: 'पन्ना शाही जालीदार बॉर्डर',
    tier: 'emerald',
    dimension: '4D',
    shape: 'hexagon',
    zoomEffect: true,
    effectClass: 'frame-emerald-royal-filigree',
    glowColor: '#059669',
    badgeLabel: 'EMERALD HEX',
    badgeIcon: '🍀',
    description: 'सदाबहार पन्ना की नक्काशीदार सोने की षट्भुज बॉर्डर।'
  },
  {
    id: 'amethyst-purple-crystal',
    name: 'Amethyst Crystal Aura',
    nameHi: 'जमुनिया कट पर्पल क्रिस्टल',
    tier: 'diamond',
    dimension: '8D',
    shape: 'crystal',
    zoomEffect: true,
    effectClass: 'frame-amethyst-purple-crystal',
    glowColor: '#9333ea',
    badgeLabel: 'AMETHYST 8D',
    badgeIcon: '🔮',
    description: 'रहस्यमयी जामुनी ऊर्जा का 8D क्रिस्टलीय वलय।'
  },

  // =========================================================================
  // 9. High-Tech & Futuristic Cyberpunk Frames (Existing Preserved + Enriched)
  // =========================================================================
  {
    id: 'cyberpunk-neon-matrix',
    name: 'Cyberpunk Neon Pulse',
    nameHi: 'साइबरपंक नियॉन पल्स',
    tier: 'vip',
    dimension: '8D',
    shape: 'hexagon',
    zoomEffect: true,
    effectClass: 'frame-cyberpunk-neon-matrix',
    glowColor: '#00e5ff',
    badgeLabel: 'NEON 8D PULSE',
    badgeIcon: '🕹️',
    description: 'भविष्यवादी स्यान व मैजेंटा का डबल-रिंग नियॉन शॉकवेव।'
  },
  {
    id: 'electric-storm-thunder',
    name: 'Electric Thunderstorm',
    nameHi: 'इलेक्ट्रिक थंडरस्टॉर्म फ्रेम',
    tier: 'vip',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-electric-storm-thunder',
    glowColor: '#3b82f6',
    badgeLabel: 'THUNDER ⚡',
    badgeIcon: '⚡',
    description: 'बिजली की कड़कड़ाहट जैसी नीली ऊर्जा तरंगें।'
  },
  {
    id: 'matrix-data-stream',
    name: 'Matrix Data Stream',
    nameHi: 'मैट्रिक्स ग्रीन डेटा स्ट्रीम',
    tier: 'emerald',
    dimension: '4D',
    shape: 'squircle',
    effectClass: 'frame-matrix-data-stream',
    glowColor: '#22c55e',
    badgeLabel: 'MATRIX 01',
    badgeIcon: '📟',
    description: 'डिजिटल कोड की तरह निरंतर प्रवाहित होती हरी रोशनी।'
  },
  {
    id: 'holographic-laser-prism',
    name: 'Holographic Laser Prism',
    nameHi: 'होलोग्राफिक लेज़र प्रिज्म',
    tier: 'diamond',
    dimension: '8D',
    shape: 'diamond',
    zoomEffect: true,
    effectClass: 'frame-holographic-laser-prism',
    glowColor: '#f43f5e',
    badgeLabel: 'HOLO 8D',
    badgeIcon: '💿',
    description: 'रंग बदलने वाला 8D होलोग्राम हीरा कट लेज़र रिफ्लेक्शन।'
  },

  // =========================================================================
  // 10. National & Heritage Badges (Existing Preserved + Enriched)
  // =========================================================================
  {
    id: 'lion-national-emblem',
    name: 'Ashoka Lion Capital Gold',
    nameHi: 'अशोक सिंह शीर्ष राष्ट्रीय गोल्ड',
    tier: 'gold',
    dimension: '4D',
    shape: 'shield',
    zoomEffect: true,
    effectClass: 'frame-lion-national-emblem',
    glowColor: '#f59e0b',
    badgeLabel: 'SATYAMEVA JAYATE',
    badgeIcon: '🦁',
    description: 'सत्यमेव जयते का राष्ट्रीय गौरव चिन्ह युक्त स्वर्ण ढाल फ्रेम।'
  },
  {
    id: 'dharma-chakra-spin',
    name: 'Dharma Chakra 24-Spokes',
    nameHi: 'धर्म चक्र 24 तीलियां चक्र फ्रेम',
    tier: 'vip',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-dharma-chakra-spin',
    glowColor: '#1d4ed8',
    badgeLabel: 'DHARMA CHAKRA',
    badgeIcon: '☸️',
    description: '24 तीलियों वाला नेवी ब्लू निरंतर गतिमान न्याय चक्र।'
  },

  // =========================================================================
  // 11. Celestial & Fantasy Energy Rings (Existing Preserved + Enriched)
  // =========================================================================
  {
    id: 'flame-solar-flare',
    name: 'Solar Flare Sunfire',
    nameHi: 'सौर ज्वाला सनफायर फ्रेम',
    tier: 'gold',
    dimension: '4D',
    shape: 'starburst',
    zoomEffect: true,
    effectClass: 'frame-flame-solar-flare',
    glowColor: '#f97316',
    badgeLabel: 'SUNFIRE',
    badgeIcon: '🔥',
    description: 'सूर्य की तीव्र किरणों जैसा प्रज्वलित अग्नि वलय।'
  },
  {
    id: 'cosmic-galaxy-nebula',
    name: 'Cosmic Galaxy Nebula',
    nameHi: 'अंतरिक्ष नेबुला गैलेक्सी',
    tier: 'sapphire',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-cosmic-galaxy-nebula',
    glowColor: '#8b5cf6',
    badgeLabel: 'COSMOS 8D',
    badgeIcon: '🌌',
    description: 'अंतरिक्ष के तारों व नीहारिका की 8D परिक्रमा।'
  },
  {
    id: 'super-star-champion',
    name: 'Super Star Champion Rings',
    nameHi: 'सुपर स्टार चैंपियन गोल्ड स्टार्स',
    tier: 'gold',
    dimension: '4D',
    shape: 'starburst',
    zoomEffect: true,
    effectClass: 'frame-super-star-champion',
    glowColor: '#eab308',
    badgeLabel: 'CHAMPION',
    badgeIcon: '⭐',
    description: 'चारों ओर परिक्रमा करते हुए चमकते सितारे।'
  },
  {
    id: 'phoenix-golden-wings',
    name: 'Golden Phoenix Rising',
    nameHi: 'स्वर्ण फीनिक्स पंख फ्रेम',
    tier: 'gold',
    dimension: '8D',
    shape: 'shield',
    zoomEffect: true,
    effectClass: 'frame-phoenix-golden-wings',
    glowColor: '#f59e0b',
    badgeLabel: 'PHOENIX',
    badgeIcon: '🦅',
    description: 'सुनहरे पंखों का गौरवशाली 8D सुरक्षा चक्र।'
  },
  {
    id: 'pearl-opalescent-halo',
    name: 'Luminous Pearl Opalescence',
    nameHi: 'चमकदार मोती सॉफ्ट हेलो',
    tier: 'silver',
    dimension: '3D',
    shape: 'circle',
    effectClass: 'frame-pearl-opalescent-halo',
    glowColor: '#f8fafc',
    badgeLabel: 'PEARL AURA',
    badgeIcon: '⚪',
    description: 'शांत, शालीन और दूधिया मोतियों का कोमल आभामंडल।'
  },
  {
    id: 'obsidian-gold-filigree',
    name: 'Black Obsidian 24K Inlay',
    nameHi: 'ब्लैक ओब्सीडियन गोल्ड इनले',
    tier: 'vip',
    dimension: '4D',
    shape: 'octagon',
    zoomEffect: true,
    effectClass: 'frame-obsidian-gold-filigree',
    glowColor: '#f59e0b',
    badgeLabel: 'OBSIDIAN VIP',
    badgeIcon: '🖤',
    description: 'जेट ब्लैक ओब्सीडियन पर 24K सोने की अष्टभुज कारीगरी।'
  },
  {
    id: 'emerald-lotus-bloom',
    name: 'Sacred Lotus Blossom',
    nameHi: 'पवित्र कमल दल ब्लूम',
    tier: 'emerald',
    dimension: '4D',
    shape: 'lotus',
    zoomEffect: true,
    effectClass: 'frame-emerald-lotus-bloom',
    glowColor: '#10b981',
    badgeLabel: 'LOTUS 4D',
    badgeIcon: '🪷',
    description: 'खिलते हुए अष्टदल कमल का आध्यात्मिक रूप।'
  },
  {
    id: 'rainbow-vortex-infinity',
    name: 'Rainbow Vortex Infinity 16D',
    nameHi: 'अनंत रेनबो वोर्टेक्स 16D',
    tier: 'diamond',
    dimension: '16D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-rainbow-vortex-infinity',
    glowColor: '#ec4899',
    badgeLabel: '16D INFINITY',
    badgeIcon: '♾️',
    description: 'अनंत काल तक घूमने वाला 16D बहुरंगी ऊर्जा भंवर व ज़ूम।'
  },
  {
    id: 'diamond-prism-corona',
    name: 'Diamond Prism Corona',
    nameHi: 'हीरा प्रिज्म कोरोना',
    tier: 'diamond',
    dimension: '8D',
    shape: 'crystal',
    zoomEffect: true,
    effectClass: 'frame-diamond-prism-corona',
    glowColor: '#38bdf8',
    badgeLabel: 'PRISM 8D',
    badgeIcon: '🔷',
    description: 'रत्नों के तराशे हुए कोनों से निकलती इंद्रधनुषी 8D चमक।'
  },
  {
    id: 'cyber-green-radar',
    name: 'Digital Radar Sweep',
    nameHi: 'डिजिटल राडार स्वीप फ्रेम',
    tier: 'emerald',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-cyber-green-radar',
    glowColor: '#22c55e',
    badgeLabel: 'ACTIVE RADAR',
    badgeIcon: '🎯',
    description: 'सक्रिय राडार की तरह चक्कर काटती हुई हाई-टेक ग्रीन बीम।'
  },
  {
    id: 'golden-wreath-laurel',
    name: 'Golden Laurel Wreath',
    nameHi: 'स्वर्ण लॉरेल विक्ट्री माला',
    tier: 'gold',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-golden-wreath-laurel',
    glowColor: '#facc15',
    badgeLabel: 'VICTORY LEADER',
    badgeIcon: '🌿',
    description: 'रोमन सम्राटों जैसी सुनहरी पत्तियों की विजयी माला।'
  },
  {
    id: 'classic-minimalist-gold',
    name: 'Classic Clean 3D Gold',
    nameHi: 'क्लासिक क्लीन 3D गोल्ड',
    tier: 'free',
    dimension: '3D',
    shape: 'circle',
    effectClass: 'frame-classic-minimalist-gold',
    glowColor: '#eab308',
    badgeLabel: 'IOIS MEMBER',
    badgeIcon: '⭐',
    description: 'सरल, सुरुचिपूर्ण और प्रीमियम 3D गोल्ड रिंग।'
  },

  // =========================================================================
  // 12. Ultra-Premium Sovereign & Futuristic Collection (8D / 16D Enriched)
  // =========================================================================
  {
    id: 'holo-nebula-ring',
    name: 'Holo Nebula Dual Orbit',
    nameHi: 'होलो नेबुला 8D डबल ऑर्बिट',
    tier: 'diamond',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-holo-nebula-ring',
    glowColor: '#a855f7',
    badgeLabel: 'NEBULA 8D',
    badgeIcon: '🪐',
    description: 'चमकते तारे और गहरे नीहारिका रंगों की दोहरी 8D परिक्रमा।'
  },
  {
    id: 'sovereign-tri-crown',
    name: 'Sovereign 24K Tri-Crown 16D',
    nameHi: 'सॉवरेन 24K राजमुकुट 16D',
    tier: 'vip',
    dimension: '16D',
    shape: 'crown',
    zoomEffect: true,
    effectClass: 'frame-sovereign-tri-crown',
    glowColor: '#f59e0b',
    badgeLabel: '16D SOVEREIGN',
    badgeIcon: '👑',
    description: 'शाही सम्राटों जैसा तिहरा घूमता हुआ 16D स्वर्ण और हीरा वलय।'
  },
  {
    id: 'electric-plasma-arc',
    name: 'Electric Plasma Arc 8D',
    nameHi: 'इलेक्ट्रिक प्लाज़्मा 8D आर्क',
    tier: 'vip',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-electric-plasma-arc',
    glowColor: '#06b6d4',
    badgeLabel: 'PLASMA 8D',
    badgeIcon: '⚡',
    description: 'हाई-वोल्टेज नीला व बैंगनी प्लाज़्मा एनर्जी शॉकवेव।'
  },
  {
    id: 'diamond-angel-halo',
    name: 'Diamond Angel Halo',
    nameHi: 'डायमंड एंजल लाइट हेलो',
    tier: 'diamond',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-diamond-angel-halo',
    glowColor: '#e0f2fe',
    badgeLabel: 'ANGEL HALO',
    badgeIcon: '👼',
    description: 'शुद्ध श्वेत हीरों का दिव्य चमकदार आभामंडल।'
  },
  {
    id: 'golden-wings-aura',
    name: 'Royal Golden Wings Aura',
    nameHi: 'शाही गोल्डन विंग्स ऑरा',
    tier: 'gold',
    dimension: '4D',
    shape: 'shield',
    zoomEffect: true,
    effectClass: 'frame-golden-wings-aura',
    glowColor: '#fbbf24',
    badgeLabel: 'GOLD WINGS',
    badgeIcon: '🪽',
    description: 'स्वर्ण पंखों के तेज और उभरते हुए सुनहरे प्रकाश की आभा।'
  },
  {
    id: 'ashok-chakra-shine',
    name: 'Tiranga Chakra Heritage',
    nameHi: 'तिरंगा अशोक चक्र गौरव',
    tier: 'vip',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-ashok-chakra-shine',
    glowColor: '#ff9933',
    badgeLabel: 'PRIDE OF INDIA',
    badgeIcon: '🇮🇳',
    description: 'केसरिया, श्वेत और हरे रंग में धर्म चक्र के साथ देशभक्ति चमक।'
  },
  {
    id: 'vaporwave-orbit',
    name: 'Vaporwave Neon Orbit',
    nameHi: 'वेपरवेव नियॉन ऑर्बिट',
    tier: 'vip',
    dimension: '4D',
    shape: 'squircle',
    zoomEffect: true,
    effectClass: 'frame-vaporwave-orbit',
    glowColor: '#ec4899',
    badgeLabel: 'VAPORWAVE',
    badgeIcon: '🌆',
    description: 'गुलाबी, मैजेंटा और स्यान रेट्रो-फ्यूचरिस्टिक लेज़र रिंग।'
  },
  {
    id: 'velvet-rose-gold',
    name: 'Velvet Rose Gold Couture',
    nameHi: 'वेलवेट रोज़ गोल्ड प्रीमियम',
    tier: 'ruby',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-velvet-rose-gold',
    glowColor: '#fb7185',
    badgeLabel: 'ROSE GOLD',
    badgeIcon: '🌹',
    description: 'मखमली गुलाबी और रोज़-गोल्ड की नाज़ुक शाही बॉर्डर।'
  },
  {
    id: 'celestial-starlight',
    name: 'Celestial Starlight Aura',
    nameHi: 'नक्षत्र स्टारलाइट ऑरा',
    tier: 'sapphire',
    dimension: '4D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-celestial-starlight',
    glowColor: '#60a5fa',
    badgeLabel: 'STARLIGHT',
    badgeIcon: '🌠',
    description: 'रात्रि आकाश के टिमटिमाते नक्षत्रों का शांत व गहरा नीला प्रकाश।'
  },
  {
    id: 'titanium-matrix',
    name: 'Titanium Cyber Matrix',
    nameHi: 'टाइटेनियम साइबर मैट्रिक्स',
    tier: 'emerald',
    dimension: '8D',
    shape: 'hexagon',
    zoomEffect: true,
    effectClass: 'frame-titanium-matrix',
    glowColor: '#10b981',
    badgeLabel: 'TITANIUM 8D',
    badgeIcon: '🛡️',
    description: 'बुलेटप्रूफ टाइटेनियम और डिजिटल हरे कोड की षट्भुज सुरक्षा रिंग।'
  },
  {
    id: 'obsidian-inferno',
    name: 'Obsidian Fire Inferno',
    nameHi: 'ओब्सीडियन फायर इन्फर्नो',
    tier: 'ruby',
    dimension: '8D',
    shape: 'diamond',
    zoomEffect: true,
    effectClass: 'frame-obsidian-inferno',
    glowColor: '#ef4444',
    badgeLabel: 'INFERNO 🔥',
    badgeIcon: '🌋',
    description: 'गहरे काले ओब्सीडियन के भीतर दहकती हुई सुनहरी-लाल ज्वाला।'
  },
  {
    id: 'aurora-borealis-wave',
    name: 'Aurora Borealis Wave',
    nameHi: 'ऑरोरा बोरेलिस लाइट वेव',
    tier: 'emerald',
    dimension: '8D',
    shape: 'circle',
    zoomEffect: true,
    effectClass: 'frame-aurora-borealis-wave',
    glowColor: '#34d399',
    badgeLabel: 'AURORA 8D',
    badgeIcon: '🌌',
    description: 'ध्रुवीय आकाश की हरे, नीले और बैंगनी प्रकाश तरंगों की लहर।'
  },
  {
    id: 'kohinoor-platinum-crown',
    name: 'Kohinoor Platinum Crown 16D',
    nameHi: 'कोहिनूर प्लैटिनम 16D क्राउन',
    tier: 'diamond',
    dimension: '16D',
    shape: 'crown',
    zoomEffect: true,
    effectClass: 'frame-kohinoor-platinum-crown',
    glowColor: '#f8fafc',
    badgeLabel: '16D KOHINOOR',
    badgeIcon: '💠',
    description: 'प्लेटिनम और अनमोल कोहिनूर हीरे की 16D शाही चमकदार परिधि।'
  },
  {
    id: 'crimson-phoenix-burst',
    name: 'Crimson Phoenix Starburst',
    nameHi: 'क्रिमसन फीनिक्स 8D स्टारबर्स्ट',
    tier: 'vip',
    dimension: '8D',
    shape: 'starburst',
    zoomEffect: true,
    effectClass: 'frame-crimson-phoenix-burst',
    glowColor: '#f97316',
    badgeLabel: '8D STARBURST',
    badgeIcon: '✨',
    description: 'चमकते सिंदूरी व सुनहरे रंगों का गतिशील सुपरनोवा विस्फोट।'
  }
];

export const PROFILE_FRAMES: ProfileFrameDefinition[] = RAW_FRAMES.map(buildFrame);

export const getProfileFrameById = (frameId?: string): ProfileFrameDefinition => {
  if (!frameId) return PROFILE_FRAMES[0];
  return PROFILE_FRAMES.find((f) => f.id === frameId) || PROFILE_FRAMES[0];
};

export const getDefaultFrameForPlan = (planId?: number): ProfileFrameDefinition => {
  if (planId === 7) return PROFILE_FRAMES.find(f => f.id === 'plan-07-masterlifetime') || PROFILE_FRAMES[0];
  if (planId === 6) return PROFILE_FRAMES.find(f => f.id === 'plan-06-agencyreseller') || PROFILE_FRAMES[0];
  if (planId === 5) return PROFILE_FRAMES.find(f => f.id === 'plan-05-studentelite') || PROFILE_FRAMES[0];
  if (planId === 4) return PROFILE_FRAMES.find(f => f.id === 'plan-04-familyvip') || PROFILE_FRAMES[0];
  if (planId === 3) return PROFILE_FRAMES.find(f => f.id === 'plan-03-career') || PROFILE_FRAMES[0];
  if (planId === 2) return PROFILE_FRAMES.find(f => f.id === 'plan-02-youthskill') || PROFILE_FRAMES[0];
  if (planId === 1) return PROFILE_FRAMES.find(f => f.id === 'plan-01-balvikas') || PROFILE_FRAMES[0];
  return PROFILE_FRAMES[0];
};
