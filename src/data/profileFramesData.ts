export interface ProfileFrameDefinition {
  id: string;
  name: string;
  nameHi: string;
  tier: 'free' | 'bronze' | 'silver' | 'gold' | 'sapphire' | 'emerald' | 'ruby' | 'diamond' | 'vip' | 'festive';
  requiredPlanId?: number;
  effectClass: string;
  cssClass?: string;
  glowColor: string;
  badgeLabel?: string;
  badgeIcon?: string;
  description: string;
}

export type ProfileFrame = ProfileFrameDefinition;

export const PROFILE_FRAMES: ProfileFrameDefinition[] = [
  // 1. IOIS Dynamic Rotating Round Orbit Frames
  {
    id: 'iois-spinning-orbit-rainbow',
    name: 'IOIS India Rainbow Chakra Orbit',
    nameHi: 'IOIS चक्र घूमता हुआ 3D रेनबो फ्रेम',
    tier: 'vip',
    effectClass: 'frame-iois-spinning-orbit-rainbow',
    glowColor: '#00e676',
    badgeLabel: 'IOIS 3D ORBIT',
    badgeIcon: '🌀',
    description: '360° गोल घूमता हुआ मल्टीकलर चक्र और नियॉन आभामंडल।'
  },
  {
    id: 'iois-spinning-orbit-gold',
    name: '24K Royal Gold Orbit',
    nameHi: '24K गोल्ड गोल घूमता रिंग',
    tier: 'gold',
    effectClass: 'frame-iois-spinning-orbit-gold',
    glowColor: '#fbbf24',
    badgeLabel: 'GOLD ORBIT',
    badgeIcon: '✨',
    description: 'सोने की मोतियों जैसा घूमता हुआ शाही 3D रिंग।'
  },
  {
    id: 'iois-spinning-orbit-tricolor',
    name: 'Tiranga National Orbit',
    nameHi: 'तिरंगा देशभक्ति घूमता आभामंडल',
    tier: 'vip',
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
    effectClass: 'frame-iois-spinning-orbit-cyan',
    glowColor: '#38bdf8',
    badgeLabel: 'QUANTUM 3D',
    badgeIcon: '⚡',
    description: 'इलेक्ट्रिक ब्लू व स्यान का हाई-स्पीड चक्रवाती रिंग।'
  },

  // 2. Plan-Specific Official Membership Frames
  {
    id: 'plan-01-balvikas',
    name: 'Bal Vikas Bronze Shield',
    nameHi: 'प्लान 01 बाल विकास ब्रॉन्ज फ्रेम',
    tier: 'bronze',
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
    requiredPlanId: 2,
    effectClass: 'frame-plan-02-youthskill',
    glowColor: '#38bdf8',
    badgeLabel: 'SKILL PRO',
    badgeIcon: '💻',
    description: '₹49 यूथ स्किल हेतु आधुनिक पॉलिश्ड सिल्वर व नियॉन बॉर्डर।'
  },
  {
    id: 'plan-03-career',
    name: 'Career & Job Gold Crest',
    nameHi: 'प्लान 03 करियर गोल्ड मेडलियन',
    tier: 'gold',
    requiredPlanId: 3,
    effectClass: 'frame-plan-03-career',
    glowColor: '#eab308',
    badgeLabel: 'CAREER VIP',
    badgeIcon: '🎯',
    description: '₹99 करियर व सरकारी परीक्षा तैयारी का 3D गोल्ड मेडलियन।'
  },
  {
    id: 'plan-04-familyvip',
    name: 'Family VIP Sapphire Guard',
    nameHi: 'प्लान 04 फैमिली VIP नीलम फ्रेम',
    tier: 'sapphire',
    requiredPlanId: 4,
    effectClass: 'frame-plan-04-familyvip',
    glowColor: '#6366f1',
    badgeLabel: 'FAMILY VIP',
    badgeIcon: '🛡️',
    description: '₹199 पारिवारिक सुरक्षा का शाही नीलम और इंडिगो सुरक्षा चक्र।'
  },
  {
    id: 'plan-05-studentelite',
    name: 'Student Elite Emerald Halo',
    nameHi: 'प्लान 05 स्टूडेंट एलीट पन्ना फ्रेम',
    tier: 'emerald',
    requiredPlanId: 5,
    effectClass: 'frame-plan-05-studentelite',
    glowColor: '#10b981',
    badgeLabel: 'ELITE SCHOLAR',
    badgeIcon: '🎓',
    description: '₹299 NCERT व उच्च शिक्षा का ज्ञानवर्धक पन्ना आभामंडल।'
  },
  {
    id: 'plan-06-agencyreseller',
    name: 'Agency Reseller Ruby Crown',
    nameHi: 'प्लान 06 एजेंसी रीसेलर रूबी फ्रेम',
    tier: 'ruby',
    requiredPlanId: 6,
    effectClass: 'frame-plan-06-agencyreseller',
    glowColor: '#f43f5e',
    badgeLabel: 'CSC RESELLER',
    badgeIcon: '🏬',
    description: '₹499 दुकानदार व CSC संचालक हेतु रूबी लाल मखमली फ्रेम।'
  },
  {
    id: 'plan-07-masterlifetime',
    name: 'Master Lifetime 999 Diamond Crown',
    nameHi: 'प्लान 07 मास्टर लाइफटाइम डायमंड क्राउन',
    tier: 'diamond',
    requiredPlanId: 7,
    effectClass: 'frame-plan-07-masterlifetime',
    glowColor: '#a855f7',
    badgeLabel: 'LIFETIME 999',
    badgeIcon: '👑',
    description: 'सर्वोच्च ₹999 प्लान का 3D डायमंड, मल्टी-रिंग और घूमता शाही मुकुट।'
  },

  // 3. Festive High-Definition Frames
  {
    id: 'festive-dhanteras-gold',
    name: 'Dhanteras Swarna Kalash',
    nameHi: 'धनतेरस स्वर्ण कलश 3D फ्रेम',
    tier: 'festive',
    effectClass: 'frame-festive-dhanteras-gold',
    glowColor: '#fbbf24',
    badgeLabel: 'DHANTERAS',
    badgeIcon: '🪙',
    description: 'स्वर्ण सिक्कों व धन्वंतरि कृपा का महालक्ष्मी आभामंडल।'
  },
  {
    id: 'festive-diwali-diya',
    name: 'Diwali Jyoti Diya Aura',
    nameHi: 'दीपावली दीपक ज्योति फ्रेम',
    tier: 'festive',
    effectClass: 'frame-festive-diwali-diya',
    glowColor: '#f59e0b',
    badgeLabel: 'SHUBH DEEPAVALI',
    badgeIcon: '🪔',
    description: 'प्रज्वलित दीपक व सुनहरी रंगोली की जीवंत रोशनी।'
  },
  {
    id: 'festive-chhath-surya',
    name: 'Chhath Surya Arghya Corona',
    nameHi: 'छठ पूजा सूर्य अर्घ्य कोरोना',
    tier: 'festive',
    effectClass: 'frame-festive-chhath-surya',
    glowColor: '#ea580c',
    badgeLabel: 'JAI CHHATHI MAIYA',
    badgeIcon: '☀️',
    description: 'भगवान भास्कर की लालिमा व सूप-अर्घ्य का पवित्र आभामंडल।'
  },
  {
    id: 'festive-govardhan-annakoot',
    name: 'Govardhan Annakoot Greenery',
    nameHi: 'गोवर्धन अन्नकूट प्राकृतिक फ्रेम',
    tier: 'festive',
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
    effectClass: 'frame-festive-bhaidooj-raksha',
    glowColor: '#ec4899',
    badgeLabel: 'BHAI DOOJ',
    badgeIcon: '🌸',
    description: 'रोली-अक्षत और पवित्र रक्षा धागे का गुलाबी व लाल बॉर्डर।'
  },

  // 4. Luxury 3D Gemstone & Royal VIP Frames
  {
    id: 'royal-coronet-24k',
    name: 'Royal Imperial 24K Coronet',
    nameHi: 'शाही इम्पीरियल 24K मुकुट फ्रेम',
    tier: 'gold',
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
    effectClass: 'frame-ruby-crimson-flare',
    glowColor: '#e11d48',
    badgeLabel: 'RUBY ELITE',
    badgeIcon: '🩸',
    description: 'गहरे रक्त-लाल रूबी रत्न का धधकता हुआ लेयर।'
  },
  {
    id: 'sapphire-deep-ocean',
    name: 'Sapphire Deep Ocean',
    nameHi: 'गहरा नीलम ओशन वेव',
    tier: 'sapphire',
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
    effectClass: 'frame-emerald-royal-filigree',
    glowColor: '#059669',
    badgeLabel: 'EMERALD',
    badgeIcon: '🍀',
    description: 'सदाबहार पन्ना की नक्काशीदार सोने की बॉर्डर।'
  },
  {
    id: 'amethyst-purple-crystal',
    name: 'Amethyst Crystal Aura',
    nameHi: 'जमुनिया कट पर्पल क्रिस्टल',
    tier: 'diamond',
    effectClass: 'frame-amethyst-purple-crystal',
    glowColor: '#9333ea',
    badgeLabel: 'AMETHYST',
    badgeIcon: '🔮',
    description: 'रहस्यमयी जामुनी ऊर्जा का 3D क्रिस्टलीय वलय।'
  },

  // 5. High-Tech & Futuristic Cyberpunk Frames
  {
    id: 'cyberpunk-neon-matrix',
    name: 'Cyberpunk Neon Pulse',
    nameHi: 'साइबरपंक नियॉन पल्स',
    tier: 'vip',
    effectClass: 'frame-cyberpunk-neon-matrix',
    glowColor: '#00e5ff',
    badgeLabel: 'NEON PULSE',
    badgeIcon: '🕹️',
    description: 'भविष्यवादी स्यान व मैजेंटा का डबल-रिंग नियॉन शॉकवेव।'
  },
  {
    id: 'electric-storm-thunder',
    name: 'Electric Thunderstorm',
    nameHi: 'इलेक्ट्रिक थंडरस्टॉर्म फ्रेम',
    tier: 'vip',
    effectClass: 'frame-electric-storm-thunder',
    glowColor: '#3b82f6',
    badgeLabel: 'THUNDER ⚡',
    badgeIcon: '⚡',
    description: 'बिजली की कड़कड़ाहट जैसी नीली ऊर्जा तरंगे।'
  },
  {
    id: 'matrix-data-stream',
    name: 'Matrix Data Stream',
    nameHi: 'मैट्रिक्स ग्रीन डेटा स्ट्रीम',
    tier: 'emerald',
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
    effectClass: 'frame-holographic-laser-prism',
    glowColor: '#f43f5e',
    badgeLabel: 'HOLO 3D',
    badgeIcon: '💿',
    description: 'रंग बदलने वाला 3D होलोग्राम लेज़र रिफ्लेक्शन।'
  },

  // 6. National & Heritage Badges
  {
    id: 'lion-national-emblem',
    name: 'Ashoka Lion Capital Gold',
    nameHi: 'अशोक सिंह शीर्ष राष्ट्रीय गोल्ड',
    tier: 'gold',
    effectClass: 'frame-lion-national-emblem',
    glowColor: '#f59e0b',
    badgeLabel: 'SATYAMEVA JAYATE',
    badgeIcon: '🦁',
    description: 'सत्यमेव जयते का राष्ट्रीय गौरव चिन्ह युक्त स्वर्ण फ्रेम।'
  },
  {
    id: 'dharma-chakra-spin',
    name: 'Dharma Chakra 24-Spokes',
    nameHi: 'धर्म चक्र 24 तीलियां चक्र फ्रेम',
    tier: 'vip',
    effectClass: 'frame-dharma-chakra-spin',
    glowColor: '#1d4ed8',
    badgeLabel: 'DHARMA CHAKRA',
    badgeIcon: '☸️',
    description: '24 तीलियों वाला नेवी ब्लू निरंतर गतिमान न्याय चक्र।'
  },

  // 7. Celestial & Fantasy Energy Rings
  {
    id: 'flame-solar-flare',
    name: 'Solar Flare Sunfire',
    nameHi: 'सौर ज्वाला सनफायर फ्रेम',
    tier: 'gold',
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
    effectClass: 'frame-cosmic-galaxy-nebula',
    glowColor: '#8b5cf6',
    badgeLabel: 'COSMOS',
    badgeIcon: '🌌',
    description: 'अंतरिक्ष के तारों व नीहारिका की परिक्रमा।'
  },
  {
    id: 'super-star-champion',
    name: 'Super Star Champion Rings',
    nameHi: 'सुपर स्टार चैंपियन गोल्ड स्टार्स',
    tier: 'gold',
    effectClass: 'frame-super-star-champion',
    glowColor: '#eab308',
    badgeLabel: 'CHAMPION',
    badgeIcon: '⭐',
    description: 'चारों ओर परिक्रमा करते हुए 5-पॉइंट 3D चमकते सितारे।'
  },
  {
    id: 'phoenix-golden-wings',
    name: 'Golden Phoenix Rising',
    nameHi: 'स्वर्ण फीनिक्स पंख फ्रेम',
    tier: 'gold',
    effectClass: 'frame-phoenix-golden-wings',
    glowColor: '#f59e0b',
    badgeLabel: 'PHOENIX',
    badgeIcon: '🦅',
    description: 'दोनों ओर फैले हुए सुनहरे पंखों का गौरवशाली सुरक्षा चक्र।'
  },
  {
    id: 'pearl-opalescent-halo',
    name: 'Luminous Pearl Opalescence',
    nameHi: 'चमकदार मोती सॉफ्ट हेलो',
    tier: 'silver',
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
    effectClass: 'frame-obsidian-gold-filigree',
    glowColor: '#f59e0b',
    badgeLabel: 'OBSIDIAN VIP',
    badgeIcon: '🖤',
    description: 'जेट ब्लैक ओब्सीडियन पर 24K सोने की महीन कारीगरी।'
  },
  {
    id: 'emerald-lotus-bloom',
    name: 'Sacred Lotus Blossom',
    nameHi: 'पवित्र कमल दल ब्लूम',
    tier: 'emerald',
    effectClass: 'frame-emerald-lotus-bloom',
    glowColor: '#10b981',
    badgeLabel: 'LOTUS',
    badgeIcon: '🪷',
    description: 'खिलते हुए अष्टदल कमल का आध्यात्मिक रूप।'
  },
  {
    id: 'rainbow-vortex-infinity',
    name: 'Rainbow Vortex Infinity',
    nameHi: 'अनंत रेनबो वोर्टेक्स',
    tier: 'diamond',
    effectClass: 'frame-rainbow-vortex-infinity',
    glowColor: '#ec4899',
    badgeLabel: 'INFINITY',
    badgeIcon: '♾️',
    description: 'अनंत काल तक घूमने वाला 3D बहुरंगी ऊर्जा भंवर।'
  },
  {
    id: 'diamond-prism-corona',
    name: 'Diamond Prism Corona',
    nameHi: 'हीरा प्रिज्म कोरोना',
    tier: 'diamond',
    effectClass: 'frame-diamond-prism-corona',
    glowColor: '#38bdf8',
    badgeLabel: 'PRISM DIAMOND',
    badgeIcon: '🔷',
    description: 'रत्नों के तराशे हुए कोनों से निकलती इंद्रधनुषी चमक।'
  },
  {
    id: 'cyber-green-radar',
    name: 'Digital Radar Sweep',
    nameHi: 'डिजिटल राडार स्वीप फ्रेम',
    tier: 'emerald',
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
    effectClass: 'frame-classic-minimalist-gold',
    glowColor: '#eab308',
    badgeLabel: 'IOIS MEMBER',
    badgeIcon: '⭐',
    description: 'सरल, सुरुचिपूर्ण और प्रीमियम 3D गोल्ड रिंग।'
  }
];

export const getProfileFrameById = (frameId?: string): ProfileFrameDefinition => {
  if (!frameId) return { ...PROFILE_FRAMES[0], cssClass: PROFILE_FRAMES[0].effectClass };
  const found = PROFILE_FRAMES.find((f) => f.id === frameId) || PROFILE_FRAMES[0];
  return { ...found, cssClass: found.cssClass || found.effectClass };
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
