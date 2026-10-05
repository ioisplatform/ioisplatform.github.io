import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Eraser, 
  RotateCcw,
  Award,
  BookOpen,
  Share2,
  X
} from 'lucide-react';
import { AlphabetObjectIllustration } from './AlphabetIllustrations';

export interface AlphabetPageData {
  pageNumber: number;
  letter: string;
  lowerLetter: string;
  word: string;
  hindiMeaning: string;
  phonics: string;
  emoji: string;
  colorScheme: {
    bg: string;
    border: string;
    badgeBg: string;
    text: string;
    accent: string;
  };
  section1Instruction: string;
  strokeOrderGuide: string;
  choices: string[];
  correctChoice: string;
  miniActivityType: 'count' | 'match' | 'find' | 'path' | 'word';
  miniActivityTitle: string;
  miniActivityDesc: string;
  miniActivityOptions?: string[];
  miniActivityCorrect?: string;
  funFact: string;
}

export const NURSERY_A_TO_Z_PAGES: AlphabetPageData[] = [
  {
    pageNumber: 1,
    letter: 'A',
    lowerLetter: 'a',
    word: 'Apple',
    hindiMeaning: 'सेब',
    phonics: 'ऐ-प-ल (Aa)',
    emoji: '🍎',
    colorScheme: { bg: 'bg-red-50', border: 'border-red-400', badgeBg: 'bg-red-600', text: 'text-red-700', accent: '#dc2626' },
    section1Instruction: 'यह एक मीठा लाल सेब है। इसे ध्यान से देखो और जोर से बोलो: "A for Apple"!',
    strokeOrderGuide: '① बाईं तिरछी रेखा (/) ② दाईं तिरछी रेखा (\\) ③ बीच की सीधी रेखा (-)',
    choices: ['A', 'B', 'D', 'O'],
    correctChoice: 'A',
    miniActivityType: 'count',
    miniActivityTitle: 'कितने सेब हैं? गिनो!',
    miniActivityDesc: 'पेड़ पर लगे लाल सेब गिनें और सही संख्या चुनें:',
    miniActivityOptions: ['2 सेब', '3 सेब', '5 सेब'],
    miniActivityCorrect: '3 सेब',
    funFact: 'सेब खाने से दिमाग तेज होता है और सेहत हमेशा अच्छी रहती है।'
  },
  {
    pageNumber: 2,
    letter: 'B',
    lowerLetter: 'b',
    word: 'Ball',
    hindiMeaning: 'गेंद',
    phonics: 'बॉ-ल (Bb)',
    emoji: '⚽',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-400', badgeBg: 'bg-blue-600', text: 'text-blue-700', accent: '#2563eb' },
    section1Instruction: 'यह एक सुंदर गोल गेंद है। इसे ध्यान से देखो और जोर से बोलो: "B for Ball"!',
    strokeOrderGuide: '① नीचे सीधी रेखा (|) ② ऊपर का गोल घुमाव (⊃) ③ नीचे का गोल घुमाव (⊃)',
    choices: ['P', 'B', 'R', 'D'],
    correctChoice: 'B',
    miniActivityType: 'match',
    miniActivityTitle: 'गेंद का सही आकार चुनो!',
    miniActivityDesc: 'फुटबॉल और गेंद का वास्तविक आकार कैसा होता है?',
    miniActivityOptions: ['गोल (Round)', 'चौकोर (Square)', 'तिकोना (Triangle)'],
    miniActivityCorrect: 'गोल (Round)',
    funFact: 'गेंद से क्रिकेट, फुटबॉल और वॉलीबॉल जैसे प्यारे खेल खेले जाते हैं।'
  },
  {
    pageNumber: 3,
    letter: 'C',
    lowerLetter: 'c',
    word: 'Cat',
    hindiMeaning: 'बिल्ली',
    phonics: 'कै-ट (Cc)',
    emoji: '🐱',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-400', badgeBg: 'bg-amber-600', text: 'text-amber-700', accent: '#d97706' },
    section1Instruction: 'यह एक प्यारी म्याऊं करने वाली बिल्ली है। इसे ध्यान से देखो और जोर से बोलो: "C for Cat"!',
    strokeOrderGuide: '① ऊपर से शुरू करके बाईं ओर आधा गोल घुमाव (⊂)',
    choices: ['C', 'G', 'O', 'Q'],
    correctChoice: 'C',
    miniActivityType: 'path',
    miniActivityTitle: 'बिल्ली को क्या पसंद है?',
    miniActivityDesc: 'बिल्ली सबसे ज्यादा क्या पीना पसंद करती है?',
    miniActivityOptions: ['दूध (Milk)', 'चाय (Tea)', 'जूस (Juice)'],
    miniActivityCorrect: 'दूध (Milk)',
    funFact: 'बिल्ली रात के अंधेरे में भी इंसानों से छह गुना बेहतर देख सकती है।'
  },
  {
    pageNumber: 4,
    letter: 'D',
    lowerLetter: 'd',
    word: 'Dog',
    hindiMeaning: 'कुत्ता',
    phonics: 'डॉ-ग (Dd)',
    emoji: '🐶',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-400', badgeBg: 'bg-emerald-600', text: 'text-emerald-700', accent: '#059669' },
    section1Instruction: 'यह एक वफादार और प्यारा कुत्ता है। इसे ध्यान से देखो और जोर से बोलो: "D for Dog"!',
    strokeOrderGuide: '① ऊपर से नीचे सीधी रेखा (|) ② दाईं ओर बड़ा आधा गोल घुमाव (⊃)',
    choices: ['B', 'P', 'D', 'O'],
    correctChoice: 'D',
    miniActivityType: 'find',
    miniActivityTitle: 'कुत्ते की आवाज पहचानो!',
    miniActivityDesc: 'कुत्ता कैसी आवाज निकालता है?',
    miniActivityOptions: ['भौंकना (Bark)', 'म्याऊं (Meow)', 'चीं-चीं (Chirp)'],
    miniActivityCorrect: 'भौंकना (Bark)',
    funFact: 'कुत्ता इंसानों का सबसे सच्चा, वफादार और मददगार दोस्त माना जाता है।'
  },
  {
    pageNumber: 5,
    letter: 'E',
    lowerLetter: 'e',
    word: 'Elephant',
    hindiMeaning: 'हाथी',
    phonics: 'ए-लि-फेंट (Ee)',
    emoji: '🐘',
    colorScheme: { bg: 'bg-purple-50', border: 'border-purple-400', badgeBg: 'bg-purple-600', text: 'text-purple-700', accent: '#7c3aed' },
    section1Instruction: 'यह एक विशाल सूंड वाला बलशाली हाथी है। इसे ध्यान से देखो और जोर से बोलो: "E for Elephant"!',
    strokeOrderGuide: '① सीधी खड़ी रेखा (|) ② ऊपर की रेखा (-) ③ बीच की रेखा (-) ④ नीचे की रेखा (-)',
    choices: ['F', 'E', 'L', 'I'],
    correctChoice: 'E',
    miniActivityType: 'count',
    miniActivityTitle: 'हाथी के कितने दांत बाहर दिखते हैं?',
    miniActivityDesc: 'हाथी के मुंह के बाहर कितने बड़े सफेद दांत होते हैं?',
    miniActivityOptions: ['2 दांत', '4 दांत', '1 दांत'],
    miniActivityCorrect: '2 दांत',
    funFact: 'हाथी जमीन पर रहने वाला सबसे बड़ा और अत्यंत बुद्धिमान जीव है।'
  },
  {
    pageNumber: 6,
    letter: 'F',
    lowerLetter: 'f',
    word: 'Fish',
    hindiMeaning: 'मछली',
    phonics: 'फि-श (Ff)',
    emoji: '🐟',
    colorScheme: { bg: 'bg-cyan-50', border: 'border-cyan-400', badgeBg: 'bg-cyan-600', text: 'text-cyan-700', accent: '#0891b2' },
    section1Instruction: 'यह जल की रानी सुंदर तैरती मछली है। इसे ध्यान से देखो और जोर से बोलो: "F for Fish"!',
    strokeOrderGuide: '① ऊपर से नीचे सीधी रेखा (|) ② ऊपर की आड़ी रेखा (-) ③ बीच की आड़ी रेखा (-)',
    choices: ['E', 'T', 'F', 'P'],
    correctChoice: 'F',
    miniActivityType: 'find',
    miniActivityTitle: 'मछली कहाँ रहती है?',
    miniActivityDesc: 'मछली का असली घर कौन सा है?',
    miniActivityOptions: ['पानी में (Water)', 'पेड़ पर (Tree)', 'हवा में (Air)'],
    miniActivityCorrect: 'पानी में (Water)',
    funFact: 'मछलियां अपनी आंखों को कभी बंद नहीं करती हैं, वे पानी में तैरते हुए सोती हैं।'
  },
  {
    pageNumber: 7,
    letter: 'G',
    lowerLetter: 'g',
    word: 'Grapes',
    hindiMeaning: 'अंगूर',
    phonics: 'ग्रे-प्स (Gg)',
    emoji: '🍇',
    colorScheme: { bg: 'bg-green-50', border: 'border-green-400', badgeBg: 'bg-green-600', text: 'text-green-700', accent: '#16a34a' },
    section1Instruction: 'यह रसीले मीठे-खट्टे अंगूरों का गुच्छा है। इसे ध्यान से देखो और जोर से बोलो: "G for Grapes"!',
    strokeOrderGuide: '① आधा गोल घुमाव (⊂) ② अंदर की ओर मुड़कर छोटी सीधी रेखा (-)',
    choices: ['C', 'G', 'O', 'Q'],
    correctChoice: 'G',
    miniActivityType: 'count',
    miniActivityTitle: 'गुच्छे में अंगूर का रंग क्या है?',
    miniActivityDesc: 'अंगूर मुख्य रूप से किन रंगों में मिलते हैं?',
    miniActivityOptions: ['हरा व बैंगनी (Green & Purple)', 'नीला (Blue)', 'सफेद (White)'],
    miniActivityCorrect: 'हरा व बैंगनी (Green & Purple)',
    funFact: 'अंगूर को सुखाकर स्वादिष्ट किशमिश बनाई जाती है जो शरीर को तुरंत ताकत देती है।'
  },
  {
    pageNumber: 8,
    letter: 'H',
    lowerLetter: 'h',
    word: 'Hen',
    hindiMeaning: 'मुर्गी',
    phonics: 'हे-न (Hh)',
    emoji: '🐔',
    colorScheme: { bg: 'bg-orange-50', border: 'border-orange-400', badgeBg: 'bg-orange-600', text: 'text-orange-700', accent: '#ea580c' },
    section1Instruction: 'यह सुबह कुकड़ूकू करने वाली प्यारी मुर्गी है। इसे ध्यान से देखो और जोर से बोलो: "H for Hen"!',
    strokeOrderGuide: '① पहली खड़ी रेखा (|) ② दूसरी खड़ी रेखा (|) ③ बीच का जोड़ (-)',
    choices: ['N', 'H', 'M', 'K'],
    correctChoice: 'H',
    miniActivityType: 'match',
    miniActivityTitle: 'मुर्गी से हमें क्या मिलता है?',
    miniActivityDesc: 'मुर्गी क्या देती है?',
    miniActivityOptions: ['अंडे (Eggs)', 'दूध (Milk)', 'फल (Fruits)'],
    miniActivityCorrect: 'अंडे (Eggs)',
    funFact: 'मुर्गियां अपने छोटे चूजों की बहुत प्यार और सतर्कता से देखभाल करती हैं।'
  },
  {
    pageNumber: 9,
    letter: 'I',
    lowerLetter: 'i',
    word: 'Ice-cream',
    hindiMeaning: 'आइसक्रीम',
    phonics: 'आ-इ-स-क्रीम (Ii)',
    emoji: '🍦',
    colorScheme: { bg: 'bg-pink-50', border: 'border-pink-400', badgeBg: 'bg-pink-600', text: 'text-pink-700', accent: '#db2777' },
    section1Instruction: 'यह ठंडी और मीठी स्वादिष्ट आइसक्रीम है। इसे ध्यान से देखो और जोर से बोलो: "I for Ice-cream"!',
    strokeOrderGuide: '① बीच में सीधी खड़ी रेखा (|) ② ऊपर की छोटी रेखा (-) ③ नीचे की छोटी रेखा (-)',
    choices: ['L', 'T', 'I', 'J'],
    correctChoice: 'I',
    miniActivityType: 'match',
    miniActivityTitle: 'आइसक्रीम का स्वाद कैसा होता है?',
    miniActivityDesc: 'आइसक्रीम गर्म होती है या ठंडी?',
    miniActivityOptions: ['ठंडी व मीठी (Cold & Sweet)', 'गर्म (Hot)', 'तीखी (Spicy)'],
    miniActivityCorrect: 'ठंडी व मीठी (Cold & Sweet)',
    funFact: 'वैनिला, स्ट्रॉबेरी और चॉकलेट बच्चों के सबसे पसंदीदा आइसक्रीम स्वाद हैं।'
  },
  {
    pageNumber: 10,
    letter: 'J',
    lowerLetter: 'j',
    word: 'Jug',
    hindiMeaning: 'जग',
    phonics: 'ज-ग (Jj)',
    emoji: '🏺',
    colorScheme: { bg: 'bg-indigo-50', border: 'border-indigo-400', badgeBg: 'bg-indigo-600', text: 'text-indigo-700', accent: '#4f46e5' },
    section1Instruction: 'यह पानी से भरा हुआ सुंदर जग है। इसे ध्यान से देखो और जोर से बोलो: "J for Jug"!',
    strokeOrderGuide: '① ऊपर की आड़ी रेखा (-) ② नीचे सीधी जाकर बाईं ओर मुड़ी छतरी जैसी डंडी (ل)',
    choices: ['I', 'J', 'U', 'L'],
    correctChoice: 'J',
    miniActivityType: 'find',
    miniActivityTitle: 'जग में क्या भरा जाता है?',
    miniActivityDesc: 'स्वच्छ पानी रखने के लिए किसका उपयोग करते हैं?',
    miniActivityOptions: ['जग (Jug)', 'किताब (Book)', 'पेंसिल (Pencil)'],
    miniActivityCorrect: 'जग (Jug)',
    funFact: 'प्रतिदिन 8 से 10 गिलास शुद्ध जल पीना हमारे शरीर को स्वस्थ रखता है।'
  },
  {
    pageNumber: 11,
    letter: 'K',
    lowerLetter: 'k',
    word: 'Kite',
    hindiMeaning: 'पतंग',
    phonics: 'का-इ-ट (Kk)',
    emoji: '🪁',
    colorScheme: { bg: 'bg-sky-50', border: 'border-sky-400', badgeBg: 'bg-sky-600', text: 'text-sky-700', accent: '#0284c7' },
    section1Instruction: 'यह नीले गगन में ऊंची उड़ती रंगीन पतंग है। इसे ध्यान से देखो और जोर से बोलो: "K for Kite"!',
    strokeOrderGuide: '① सीधी खड़ी रेखा (|) ② ऊपर से बीच में तिरछी रेखा (/) ③ बीच से नीचे तिरछी रेखा (\\)',
    choices: ['H', 'K', 'X', 'R'],
    correctChoice: 'K',
    miniActivityType: 'path',
    miniActivityTitle: 'पतंग किसके सहारे उड़ती है?',
    miniActivityDesc: 'पतंग को आसमान में कौन उड़ाता है?',
    miniActivityOptions: ['हवा व डोर (Wind & Thread)', 'पहिया (Wheel)', 'पानी (Water)'],
    miniActivityCorrect: 'हवा व डोर (Wind & Thread)',
    funFact: 'मकर संक्रांति और स्वतंत्रता दिवस के पावन अवसर पर बच्चे खुशी से पतंग उड़ाते हैं।'
  },
  {
    pageNumber: 12,
    letter: 'L',
    lowerLetter: 'l',
    word: 'Lion',
    hindiMeaning: 'शेर',
    phonics: 'ला-य-न (Ll)',
    emoji: '🦁',
    colorScheme: { bg: 'bg-yellow-50', border: 'border-yellow-400', badgeBg: 'bg-yellow-600', text: 'text-yellow-800', accent: '#ca8a04' },
    section1Instruction: 'यह जंगल का सबसे पराक्रमी राजा शेर है। इसे ध्यान से देखो और जोर से बोलो: "L for Lion"!',
    strokeOrderGuide: '① ऊपर से नीचे सीधी रेखा (|) ② नीचे दाईं ओर सीधी आड़ी रेखा (_)',
    choices: ['I', 'T', 'L', 'E'],
    correctChoice: 'L',
    miniActivityType: 'match',
    miniActivityTitle: 'जंगल का राजा कौन है?',
    miniActivityDesc: 'सभी जंगली जानवरों का निर्विवाद राजा किसे कहा जाता है?',
    miniActivityOptions: ['शेर (Lion)', 'खरगोश (Rabbit)', 'बिल्ली (Cat)'],
    miniActivityCorrect: 'शेर (Lion)',
    funFact: 'शेर की दहाड़ इतनी जोरदार होती है कि 8 किलोमीटर दूर तक साफ सुनी जा सकती है।'
  },
  {
    pageNumber: 13,
    letter: 'M',
    lowerLetter: 'm',
    word: 'Mango',
    hindiMeaning: 'आम',
    phonics: 'मैं-गो (Mm)',
    emoji: '🥭',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-400', badgeBg: 'bg-amber-600', text: 'text-amber-700', accent: '#d97706' },
    section1Instruction: 'यह फलों का राजा रसीला और मीठा आम है। इसे ध्यान से देखो और जोर से बोलो: "M for Mango"!',
    strokeOrderGuide: '① बाईं खड़ी रेखा (|) ② नीचे तिरछी रेखा (\\) ③ ऊपर तिरछी रेखा (/) ④ दाईं खड़ी रेखा (|)',
    choices: ['W', 'N', 'M', 'H'],
    correctChoice: 'M',
    miniActivityType: 'match',
    miniActivityTitle: 'भारत का राष्ट्रीय फल कौन सा है?',
    miniActivityDesc: 'फलों का राजा किस फल को कहा जाता है?',
    miniActivityOptions: ['आम (Mango)', 'सेब (Apple)', 'केला (Banana)'],
    miniActivityCorrect: 'आम (Mango)',
    funFact: 'आम भारत का आधिकारिक राष्ट्रीय फल है और यह गर्मियों में मीठा रस देता है।'
  },
  {
    pageNumber: 14,
    letter: 'N',
    lowerLetter: 'n',
    word: 'Nest',
    hindiMeaning: 'घोंसला',
    phonics: 'ने-स्ट (Nn)',
    emoji: '🪺',
    colorScheme: { bg: 'bg-stone-50', border: 'border-stone-400', badgeBg: 'bg-stone-600', text: 'text-stone-700', accent: '#57534e' },
    section1Instruction: 'यह तिनकों से बना चिड़िया का सुरक्षित घोंसला है। इसे ध्यान से देखो और जोर से बोलो: "N for Nest"!',
    strokeOrderGuide: '① बाईं खड़ी रेखा (|) ② तिरछी नीचे रेखा (\\) ③ दाईं सीधी खड़ी रेखा (|)',
    choices: ['M', 'Z', 'N', 'H'],
    correctChoice: 'N',
    miniActivityType: 'find',
    miniActivityTitle: 'घोंसला कौन बनाता है?',
    miniActivityDesc: 'तिनके चुनकर पेड़ पर अपना प्यारा आशियाना कौन बनाता है?',
    miniActivityOptions: ['चिड़िया (Bird)', 'मछली (Fish)', 'शेर (Lion)'],
    miniActivityCorrect: 'चिड़िया (Bird)',
    funFact: 'चिड़िया अपने नन्हें बच्चों और अंडों को धूप-बारिश से सुरक्षित रखने के लिए घोंसला बुनती है।'
  },
  {
    pageNumber: 15,
    letter: 'O',
    lowerLetter: 'o',
    word: 'Orange',
    hindiMeaning: 'संतरा',
    phonics: 'ऑ-रें-ज (Oo)',
    emoji: '🍊',
    colorScheme: { bg: 'bg-orange-50', border: 'border-orange-400', badgeBg: 'bg-orange-600', text: 'text-orange-700', accent: '#ea580c' },
    section1Instruction: 'यह विटामिन-सी से भरपूर रसीला संतरा है। इसे ध्यान से देखो और जोर से बोलो: "O for Orange"!',
    strokeOrderGuide: '① ऊपर से शुरू करके बाईं ओर से पूरा गोल वृत्त बनाएं (○)',
    choices: ['Q', 'D', 'C', 'O'],
    correctChoice: 'O',
    miniActivityType: 'count',
    miniActivityTitle: 'संतरे का आकार कैसा होता है?',
    miniActivityDesc: 'संतरा किस आकार का होता है?',
    miniActivityOptions: ['गोल (Round)', 'लंबा (Long)', 'चौकोर (Square)'],
    miniActivityCorrect: 'गोल (Round)',
    funFact: 'संतरा खाने से हमारे शरीर की रोग प्रतिरोधक क्षमता (इम्युनिटी) मजबूत बनती है।'
  },
  {
    pageNumber: 16,
    letter: 'P',
    lowerLetter: 'p',
    word: 'Parrot',
    hindiMeaning: 'तोता',
    phonics: 'पै-र-ट (Pp)',
    emoji: '🦜',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-400', badgeBg: 'bg-emerald-600', text: 'text-emerald-700', accent: '#059669' },
    section1Instruction: 'यह लाल चोंच वाला प्यारा हरा तोता है। इसे ध्यान से देखो और जोर से बोलो: "P for Parrot"!',
    strokeOrderGuide: '① सीधी खड़ी रेखा (|) ② ऊपर दाईं ओर आधा गोल घुमाव (⊃)',
    choices: ['R', 'B', 'P', 'D'],
    correctChoice: 'P',
    miniActivityType: 'match',
    miniActivityTitle: 'तोते को क्या खाना सबसे पसंद है?',
    miniActivityDesc: 'तोता बड़े चाव से क्या खाता है?',
    miniActivityOptions: ['हरी मिर्च (Chili)', 'दूध (Milk)', 'रोटी (Bread)'],
    miniActivityCorrect: 'हरी मिर्च (Chili)',
    funFact: 'तोता इंसानों की बोली और मीठी आवाजों की बहुत खूबसूरती से नकल कर सकता है।'
  },
  {
    pageNumber: 17,
    letter: 'Q',
    lowerLetter: 'q',
    word: 'Queen',
    hindiMeaning: 'रानी',
    phonics: 'क्वी-न (Qq)',
    emoji: '👸',
    colorScheme: { bg: 'bg-purple-50', border: 'border-purple-400', badgeBg: 'bg-purple-600', text: 'text-purple-700', accent: '#9333ea' },
    section1Instruction: 'यह सिर पर स्वर्ण मुकुट पहने रूपवती रानी है। इसे ध्यान से देखो और जोर से बोलो: "Q for Queen"!',
    strokeOrderGuide: '① पूरा गोल वृत्त बनाएं (○) ② नीचे दाईं ओर छोटी पूंछ रेखा (\\)',
    choices: ['O', 'C', 'Q', 'G'],
    correctChoice: 'Q',
    miniActivityType: 'find',
    miniActivityTitle: 'रानी सिर पर क्या पहनती हैं?',
    miniActivityDesc: 'शाही रानी अपने सिर पर क्या धारण करती हैं?',
    miniActivityOptions: ['सोने का मुकुट (Crown)', 'हेलमेट (Helmet)', 'टोपी (Cap)'],
    miniActivityCorrect: 'सोने का मुकुट (Crown)',
    funFact: 'भारतीय इतिहास में वीरांगना रानी लक्ष्मीबाई ने मातृभूमि के लिए अदम्य साहस दिखाया था।'
  },
  {
    pageNumber: 18,
    letter: 'R',
    lowerLetter: 'r',
    word: 'Rabbit',
    hindiMeaning: 'खरगोश',
    phonics: 'रै-बि-ट (Rr)',
    emoji: '🐰',
    colorScheme: { bg: 'bg-rose-50', border: 'border-rose-400', badgeBg: 'bg-rose-600', text: 'text-rose-700', accent: '#e11d48' },
    section1Instruction: 'यह तेज दौड़ने वाला प्यारा सफेद खरगोश है। इसे ध्यान से देखो और जोर से बोलो: "R for Rabbit"!',
    strokeOrderGuide: '① सीधी खड़ी रेखा (|) ② ऊपर का घुमाव (⊃) ③ नीचे दाईं ओर तिरछी रेखा (\\)',
    choices: ['P', 'B', 'R', 'K'],
    correctChoice: 'R',
    miniActivityType: 'match',
    miniActivityTitle: 'खरगोश का प्रिय भोजन क्या है?',
    miniActivityDesc: 'खरगोश खुशी-खुशी क्या कुतरता है?',
    miniActivityOptions: ['लाल गाजर (Carrot)', 'आइसक्रीम (Ice-cream)', 'दाल (Lentil)'],
    miniActivityCorrect: 'लाल गाजर (Carrot)',
    funFact: 'खरगोश के लंबे कान किसी भी हल्की आहट को 360 डिग्री में सुन सकते हैं।'
  },
  {
    pageNumber: 19,
    letter: 'S',
    lowerLetter: 's',
    word: 'Sun',
    hindiMeaning: 'सूरज',
    phonics: 'स-न (Ss)',
    emoji: '☀️',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-400', badgeBg: 'bg-amber-500', text: 'text-amber-800', accent: '#f59e0b' },
    section1Instruction: 'यह दुनिया को रोशनी और ऊर्जा देने वाला चमकता सूरज है। इसे ध्यान से देखो और जोर से बोलो: "S for Sun"!',
    strokeOrderGuide: '① बाईं ओर आधा घुमाव (⊂) ② फिर दाईं ओर नीचे आधा घुमाव (⊃)',
    choices: ['Z', 'C', 'S', 'O'],
    correctChoice: 'S',
    miniActivityType: 'find',
    miniActivityTitle: 'सूरज कब निकलता है?',
    miniActivityDesc: 'सूरज की सुनहरी धूप हमें कब मिलती है?',
    miniActivityOptions: ['सुबह व दिन में (Day)', 'अंधेरी रात में (Night)', 'नींद में (Sleep)'],
    miniActivityCorrect: 'सुबह व दिन में (Day)',
    funFact: 'सूरज की किरणों से हमें प्राकृतिक विटामिन-D मिलता है जो हड्डियों को मजबूत बनाता है।'
  },
  {
    pageNumber: 20,
    letter: 'T',
    lowerLetter: 't',
    word: 'Tiger',
    hindiMeaning: 'बाघ',
    phonics: 'टा-इ-ग-र (Tt)',
    emoji: '🐯',
    colorScheme: { bg: 'bg-orange-50', border: 'border-orange-400', badgeBg: 'bg-orange-600', text: 'text-orange-700', accent: '#ea580c' },
    section1Instruction: 'यह हमारा राष्ट्रीय पशु शक्तिशाली धारीदार बाघ है। इसे ध्यान से देखो और जोर से बोलो: "T for Tiger"!',
    strokeOrderGuide: '① ऊपर की सीधी आड़ी रेखा (-) ② बीच से नीचे सीधी खड़ी रेखा (|)',
    choices: ['I', 'L', 'T', 'F'],
    correctChoice: 'T',
    miniActivityType: 'match',
    miniActivityTitle: 'भारत का राष्ट्रीय पशु कौन है?',
    miniActivityDesc: 'हमारे देश का आधिकारिक राष्ट्रीय पशु कौन सा है?',
    miniActivityOptions: ['बाघ (Tiger)', 'बिल्ली (Cat)', 'हाथी (Elephant)'],
    miniActivityCorrect: 'बाघ (Tiger)',
    funFact: 'बाघ उत्कृष्ट तैराक होते हैं और जल में भी बड़ी तेजी से शिकार कर सकते हैं।'
  },
  {
    pageNumber: 21,
    letter: 'U',
    lowerLetter: 'u',
    word: 'Umbrella',
    hindiMeaning: 'छाता',
    phonics: 'अम-ब्रे-ला (Uu)',
    emoji: '☂️',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-400', badgeBg: 'bg-blue-600', text: 'text-blue-700', accent: '#2563eb' },
    section1Instruction: 'यह धूप और बारिश से बचाने वाला रंगीन छाता है। इसे ध्यान से देखो और जोर से बोलो: "U for Umbrella"!',
    strokeOrderGuide: '① ऊपर से नीचे आकर गोल घुमाव लें (∪) और फिर ऊपर ले जाएं',
    choices: ['V', 'W', 'U', 'J'],
    correctChoice: 'U',
    miniActivityType: 'find',
    miniActivityTitle: 'छाता कब काम आता है?',
    miniActivityDesc: 'छाते का उपयोग हम कब करते हैं?',
    miniActivityOptions: ['बारिश व तेज धूप में (Rain/Sun)', 'सोते समय (Sleeping)', 'खाना खाते समय (Eating)'],
    miniActivityCorrect: 'बारिश व तेज धूप में (Rain/Sun)',
    funFact: 'छाते का आविष्कार सदियों पहले तेज धूप और बारिश से बचने के लिए किया गया था।'
  },
  {
    pageNumber: 22,
    letter: 'V',
    lowerLetter: 'v',
    word: 'Van',
    hindiMeaning: 'वैन',
    phonics: 'वै-न (Vv)',
    emoji: '🚐',
    colorScheme: { bg: 'bg-teal-50', border: 'border-teal-400', badgeBg: 'bg-teal-600', text: 'text-teal-700', accent: '#0d9488' },
    section1Instruction: 'यह बच्चों को स्कूल ले जाने वाली सुरक्षित वैन गाड़ी है। इसे ध्यान से देखो और जोर से बोलो: "V for Van"!',
    strokeOrderGuide: '① बाईं ओर से नीचे तिरछी रेखा (\\) ② नीचे से दाईं ओर ऊपर तिरछी रेखा (/)',
    choices: ['U', 'Y', 'V', 'W'],
    correctChoice: 'V',
    miniActivityType: 'match',
    miniActivityTitle: 'वैन के कितने पहिए होते हैं?',
    miniActivityDesc: 'स्कूल वैन में कितने पहिए लगे होते हैं?',
    miniActivityOptions: ['4 पहिए (4 Wheels)', '2 पहिए (2 Wheels)', '3 पहिए (3 Wheels)'],
    miniActivityCorrect: '4 पहिए (4 Wheels)',
    funFact: 'स्कूल वैन सभी बच्चों को समय पर और सुरक्षित विद्यालय पहुँचाने में मदद करती है।'
  },
  {
    pageNumber: 23,
    letter: 'W',
    lowerLetter: 'w',
    word: 'Watch',
    hindiMeaning: 'घड़ी',
    phonics: 'वॉ-च (Ww)',
    emoji: '⌚',
    colorScheme: { bg: 'bg-slate-50', border: 'border-slate-400', badgeBg: 'bg-slate-800', text: 'text-slate-800', accent: '#1e293b' },
    section1Instruction: 'यह हाथ में बंधी सही समय बताने वाली घड़ी है। इसे ध्यान से देखो और जोर से बोलो: "W for Watch"!',
    strokeOrderGuide: '① नीचे तिरछी (\\) ② ऊपर (/) ③ नीचे (\\) ④ ऊपर तिरछी रेखा (/)',
    choices: ['M', 'V', 'W', 'N'],
    correctChoice: 'W',
    miniActivityType: 'match',
    miniActivityTitle: 'घड़ी हमें क्या बताती है?',
    miniActivityDesc: 'घड़ी की सुइयां देखकर हमें क्या पता चलता है?',
    miniActivityOptions: ['सही समय (Time)', 'वजन (Weight)', 'तापमान (Temp)'],
    miniActivityCorrect: 'सही समय (Time)',
    funFact: 'घड़ी की टिक-टिक हमें सिखाती है कि जीवन में समय सबसे अमूल्य धन है।'
  },
  {
    pageNumber: 24,
    letter: 'X',
    lowerLetter: 'x',
    word: 'Xylophone',
    hindiMeaning: 'जाइलोफोन बाजा',
    phonics: 'ज़ा-इ-लो-फोन (Xx)',
    emoji: '🎵',
    colorScheme: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', badgeBg: 'bg-fuchsia-600', text: 'text-fuchsia-700', accent: '#c026d3' },
    section1Instruction: 'यह सात सुरों की मधुर धुन छेड़ने वाला जाइलोफोन बाजा है। इसे ध्यान से देखो और जोर से बोलो: "X for Xylophone"!',
    strokeOrderGuide: '① पहली तिरछी क्रॉस रेखा (\\) ② दूसरी काटती हुई तिरछी रेखा (/)',
    choices: ['K', 'Y', 'X', 'Z'],
    correctChoice: 'X',
    miniActivityType: 'find',
    miniActivityTitle: 'जाइलोफोन बजाने से क्या निकलता है?',
    miniActivityDesc: 'जब हम जाइलोफोन की पट्टियों पर छड़ी मारते हैं तो क्या पैदा होता है?',
    miniActivityOptions: ['मधुर संगीत (Music)', 'धुआं (Smoke)', 'पानी (Water)'],
    miniActivityCorrect: 'मधुर संगीत (Music)',
    funFact: 'जाइलोफोन की रंग-बिरंगी पट्टियों से सारेगामापा के सात सुर बजते हैं।'
  },
  {
    pageNumber: 25,
    letter: 'Y',
    lowerLetter: 'y',
    word: 'Yak',
    hindiMeaning: 'याक / पहाड़ी बैल',
    phonics: 'या-क (Yy)',
    emoji: '🐂',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-400', badgeBg: 'bg-amber-700', text: 'text-amber-800', accent: '#b45309' },
    section1Instruction: 'यह ऊंचे बर्फ़ीले पहाड़ों का भारी रोएंदार याक बैल है। इसे ध्यान से देखो और जोर से बोलो: "Y for Yak"!',
    strokeOrderGuide: '① बाईं छोटी तिरछी रेखा (\\) ② दाईं तिरछी रेखा (/) ③ नीचे सीधी खड़ी रेखा (|)',
    choices: ['V', 'U', 'Y', 'X'],
    correctChoice: 'Y',
    miniActivityType: 'find',
    miniActivityTitle: 'याक किस क्षेत्र में पाया जाता है?',
    miniActivityDesc: 'याक कहाँ रहता है?',
    miniActivityOptions: ['बर्फ़ीले पहाड़ों में (Cold Mountains)', 'समुद्र में (Sea)', 'रेगिस्तान में (Desert)'],
    miniActivityCorrect: 'बर्फ़ीले पहाड़ों में (Cold Mountains)',
    funFact: 'याक के लंबे घने रोएंदार बाल उसे शून्य से 40 डिग्री नीचे ठंड में भी सुरक्षित रखते हैं।'
  },
  {
    pageNumber: 26,
    letter: 'Z',
    lowerLetter: 'z',
    word: 'Zebra',
    hindiMeaning: 'ज़ेबरा / चित्तीदार घोड़ा',
    phonics: 'ज़े-ब्रा (Zz)',
    emoji: '🦓',
    colorScheme: { bg: 'bg-zinc-50', border: 'border-zinc-400', badgeBg: 'bg-zinc-800', text: 'text-zinc-800', accent: '#27272a' },
    section1Instruction: 'यह काली और सफेद धारियों वाला सुंदर चित्तीदार घोड़ा ज़ेबरा है। इसे ध्यान से देखो और जोर से बोलो: "Z for Zebra"!',
    strokeOrderGuide: '① ऊपर की सीधी आड़ी रेखा (-) ② नीचे तिरछी रेखा (/) ③ नीचे सीधी आड़ी रेखा (_)',
    choices: ['S', 'N', 'Z', 'E'],
    correctChoice: 'Z',
    miniActivityType: 'match',
    miniActivityTitle: 'ज़ेबरा के शरीर पर कौन से रंग की धारियां होती हैं?',
    miniActivityDesc: 'ज़ेबरा का असली रंग संयोजन क्या होता है?',
    miniActivityOptions: ['काली व सफेद (Black & White)', 'लाल व पीली (Red & Yellow)', 'हरी व नीली (Green & Blue)'],
    miniActivityCorrect: 'काली व सफेद (Black & White)',
    funFact: 'सड़क पर पैदल चलने वालों के सुरक्षित पारपथ को भी "ज़ेबरा क्रॉसिंग" कहा जाता है।'
  }
];

export const NurseryAlphabetWorkbook: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [selectedLetterChoice, setSelectedLetterChoice] = useState<string | null>(null);
  const [selectedMiniChoice, setSelectedMiniChoice] = useState<string | null>(null);
  const [isTracingDrawing, setIsTracingDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#dc2626'); // Red default
  const [penSize, setPenSize] = useState(7);
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [hasDrawnOnCanvas, setHasDrawnOnCanvas] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const page = NURSERY_A_TO_Z_PAGES[currentPageIndex] || NURSERY_A_TO_Z_PAGES[0];

  // Clear tracing canvas on page change
  useEffect(() => {
    setSelectedLetterChoice(null);
    setSelectedMiniChoice(null);
    setHasDrawnOnCanvas(false);
    clearCanvas();
  }, [currentPageIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnOnCanvas(false);
  };

  // Canvas drawing handlers with coordinate accuracy
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsTracingDrawing(true);
    setHasDrawnOnCanvas(true);
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

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsTracingDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isTracingDrawing) return;
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

    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    utterance.onstart = () => setActiveSpeechText(text);
    utterance.onend = () => setActiveSpeechText(null);
    utterance.onerror = () => setActiveSpeechText(null);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen py-3 sm:py-6 px-2 sm:px-4 font-sans text-slate-900">
      
      {/* 🔝 CONTROL BAR (Screen Only) */}
      <div className="max-w-4xl mx-auto mb-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
        
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white font-black text-xl flex items-center justify-center shadow">
            {page.letter}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              IOIS Nursery Alphabet Series (A to Z)
            </h2>
            <p className="text-[11px] text-slate-500">
              पेज {page.pageNumber} of 26 • सचित्र अक्षर ज्ञान एवं डिजिटल ट्रेसिंग स्लेट
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => speak(`${page.letter} for ${page.word}। ${page.section1Instruction}`)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1.5 border border-amber-200"
            title="बोलकर सुनें"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>बोलकर सुनें</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs flex items-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>A4 प्रिंट</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 🔤 QUICK A-Z ALPHABET NAVIGATOR (Screen Only) */}
      <div className="max-w-4xl mx-auto mb-4 bg-white p-2 rounded-2xl shadow-xs border border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none print:hidden flex items-center gap-1.5">
        {NURSERY_A_TO_Z_PAGES.map((p, idx) => (
          <button
            key={p.letter}
            onClick={() => setCurrentPageIndex(idx)}
            className={`w-8 h-8 rounded-xl font-black text-xs shrink-0 transition-all flex items-center justify-center ${
              currentPageIndex === idx
                ? 'bg-orange-600 text-white shadow-md scale-110 ring-2 ring-orange-300'
                : 'bg-slate-50 text-slate-700 hover:bg-orange-50 border border-slate-200'
            }`}
          >
            {p.letter}
          </button>
        ))}
      </div>

      {/* =========================================================================
          ⭐ A4 PORTRAIT WORKBOOK PAGE CONTAINER (PRINT READY)
          ========================================================================= */}
      <div 
        id="nursery-a4-page" 
        className="max-w-3xl mx-auto bg-white border-2 border-slate-300 shadow-xl rounded-3xl overflow-hidden print:border-none print:shadow-none print:rounded-none print:m-0 print:p-0 p-4 sm:p-7 space-y-4"
        style={{ minHeight: '1000px' }}
      >
        
        {/* 1. TOP BRANDING BANNER */}
        <div className="border-b-2 border-slate-800 pb-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block font-mono">
              IOIS DIGITAL PLATFORM • बाल विकास वाटिका
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              नर्सरी सचित्र वर्णमाला (NURSERY ALPHABET SERIES)
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
              अक्षर {page.letter} • {page.pageNumber}/26
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              NCERT Early Learning Standard
            </span>
          </div>
        </div>

        {/* 2. MAIN LETTER & HERO VOCABULARY CARD (सचित्र प्रणाली - COMPLETE VECTOR ILLUSTRATION) */}
        <div className={`p-4 sm:p-5 rounded-3xl border-2 ${page.colorScheme.border} ${page.colorScheme.bg} flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm`}>
          
          <div className="flex items-center space-x-4">
            {/* VERY LARGE 3D UPPERCASE & LOWERCASE LETTER */}
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-4 flex flex-col items-center justify-center font-black shadow-lg shrink-0 transform transition-transform hover:scale-105"
              style={{ borderColor: page.colorScheme.accent }}
            >
              <span 
                className="text-5xl sm:text-6xl font-black drop-shadow-md select-none leading-none"
                style={{ color: page.colorScheme.accent }}
              >
                {page.letter}
              </span>
              <span className="text-base font-bold text-slate-500 leading-none mt-0.5">
                {page.lowerLetter}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 font-mono">
                अक्षर पहचान (Letter Recognition)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                {page.letter} for {page.word}
              </h2>
              <p className="text-base sm:text-lg font-bold text-slate-700">
                {page.letter} यानी <span className="text-orange-600 font-black underline decoration-wavy decoration-orange-400">{page.hindiMeaning}</span>
              </p>
              <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                ध्वनि (Phonics): <strong>{page.phonics}</strong>
              </span>
            </div>
          </div>

          {/* MAIN VECTOR ILLUSTRATION (सचित्र प्रणाली) */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white border-2 border-slate-200 flex flex-col items-center justify-center shadow-inner shrink-0 p-2 text-center group">
            <AlphabetObjectIllustration letter={page.letter} className="w-24 h-24 sm:w-28 sm:h-28 transform group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black text-slate-800 mt-1 uppercase tracking-wide">
              {page.word} ({page.hindiMeaning})
            </span>
          </div>

        </div>

        {/* 3. LEARNING SECTION 1: देखो और पहचानो (EXACT USER FORMULA) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 flex items-start space-x-3 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-xs">
            1
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900">
                1. देखो और पहचानो (Look & Identify)
              </h3>
              <button
                onClick={() => speak(page.section1Instruction)}
                className="px-2 py-0.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-[10px] font-bold flex items-center gap-1 print:hidden"
              >
                <Volume2 className="w-3 h-3" />
                <span>सुनें</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed mt-1 bg-white/70 p-2 rounded-xl border border-amber-200">
              {page.section1Instruction}
            </p>
          </div>
        </div>

        {/* 4. LEARNING SECTION 2: अक्षर लिखो (LARGE CLEAN TRACING AREA WITH मिटाएं BUTTON) */}
        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-black text-xs sm:text-sm text-slate-900">
                2. अक्षर लिखो (Trace the Letter)
              </h3>
            </div>
            
            {/* Tool buttons for digital practice (Screen only) */}
            <div className="flex items-center space-x-1.5 print:hidden">
              {/* Color options */}
              {['#dc2626', '#2563eb', '#16a34a', '#0f172a', '#9333ea'].map((c) => (
                <button
                  key={c}
                  onClick={() => setPenColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${penColor === c ? 'scale-125 border-slate-900 shadow-sm' : 'border-white'}`}
                  style={{ backgroundColor: c }}
                  title="पेंसिल रंग"
                />
              ))}

              {/* Explicit 'मिटाएं' Button */}
              <button
                type="button"
                onClick={clearCanvas}
                className="ml-2 px-3 py-1 rounded-lg bg-white border border-red-300 text-xs font-black text-red-600 hover:bg-red-50 hover:border-red-500 flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                title="मिटाएं (Clear Canvas)"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>मिटाएं</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-600">
            नीचे दिए गए बिंदुओं पर पेंसिल/उंगली चलाकर <strong>"{page.letter}"</strong> और <strong>"{page.lowerLetter}"</strong> लिखने का अभ्यास करें:
          </p>

          <p className="text-[10px] text-slate-500 font-mono italic">
            क्रम: {page.strokeOrderGuide}
          </p>

          {/* DOTTED TRACING CANVAS & 4-LINE NOTEBOOK GUIDES */}
          <div className="relative h-32 sm:h-36 bg-white rounded-2xl border-2 border-slate-300 overflow-hidden shadow-inner select-none">
            
            {/* Primary School 4-Line Notebook Tracing Guides */}
            <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-40">
              <div className="border-b-2 border-red-500 w-full" />
              <div className="border-b border-blue-400 border-dashed w-full" />
              <div className="border-b border-blue-400 border-dashed w-full" />
              <div className="border-b-2 border-red-500 w-full" />
            </div>

            {/* Dotted Tracing Letters with Stroke Guides */}
            <div className="absolute inset-0 flex items-center justify-around text-slate-300 font-mono font-black text-6xl sm:text-7xl tracking-widest pointer-events-none select-none opacity-45">
              <div className="flex items-baseline space-x-2 border-2 border-dashed border-slate-400 rounded-2xl px-4 py-1 bg-slate-50/50">
                <span className="text-slate-400">{page.letter}</span>
                <span className="text-slate-400 text-4xl">{page.lowerLetter}</span>
              </div>
              <div className="flex items-baseline space-x-2 border-2 border-dashed border-slate-400 rounded-2xl px-4 py-1 bg-slate-50/50">
                <span className="text-slate-400">{page.letter}</span>
                <span className="text-slate-400 text-4xl">{page.lowerLetter}</span>
              </div>
              <div className="flex items-baseline space-x-2 border-2 border-dashed border-slate-400 rounded-2xl px-4 py-1 bg-slate-50/50 hidden sm:flex">
                <span className="text-slate-400">{page.letter}</span>
                <span className="text-slate-400 text-4xl">{page.lowerLetter}</span>
              </div>
            </div>

            {/* Interactive Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={700}
              height={144}
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

          {hasDrawnOnCanvas && (
            <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              <span className="flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>शाबाश! आपने बहुत सुंदर लिखा है!</span>
              </span>
              <button
                onClick={clearCanvas}
                className="text-red-600 font-black hover:underline"
              >
                दुबारा लिखें (मिटाएं)
              </button>
            </div>
          )}
        </div>

        {/* 5. LEARNING SECTION 3: सही अक्षर चुनो (RECOGNITION EXERCISE) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-black text-xs sm:text-sm text-slate-900">
              3. सही अक्षर चुनो (Find & Tap the Letter: {page.letter})
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {page.choices.map((c, i) => {
              const isSelected = selectedLetterChoice === c;
              const isCorrect = c === page.correctChoice;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedLetterChoice(c)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-black text-xl sm:text-2xl transition-all shadow-xs flex items-center justify-center border-2 ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 scale-110 shadow-md ring-4 ring-emerald-200'
                        : 'bg-red-500 text-white border-red-600 ring-2 ring-red-200'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {selectedLetterChoice && (
            <p className={`text-center text-xs font-bold pt-1 ${
              selectedLetterChoice === page.correctChoice ? 'text-emerald-700' : 'text-red-600'
            }`}>
              {selectedLetterChoice === page.correctChoice
                ? '🎉 बिल्कुल सही उत्तर! शाबाश!'
                : '❌ दुबारा प्रयास करें और सही अक्षर पर टैप करें!'}
            </p>
          )}
        </div>

        {/* 6. LEARNING SECTION 4: मिनी एक्टिविटी (UNIQUE PER PAGE) */}
        <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="font-black text-xs sm:text-sm text-slate-900">
                4. मिनी एक्टिविटी: {page.miniActivityTitle}
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900 uppercase">
              Fun Activity
            </span>
          </div>

          <p className="text-xs text-slate-700">
            {page.miniActivityDesc}
          </p>

          {/* Activity Interactive Choices */}
          {page.miniActivityOptions && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {page.miniActivityOptions.map((opt, i) => {
                const isSelected = selectedMiniChoice === opt;
                const isCorrect = opt === page.miniActivityCorrect;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedMiniChoice(opt)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow ring-2 ring-emerald-200'
                          : 'bg-red-500 text-white border-red-600'
                        : 'bg-white hover:bg-purple-100/60 text-slate-800 border-purple-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {selectedMiniChoice && (
            <p className={`text-xs font-bold pt-0.5 ${
              selectedMiniChoice === page.miniActivityCorrect ? 'text-emerald-700' : 'text-red-600'
            }`}>
              {selectedMiniChoice === page.miniActivityCorrect
                ? '🌟 बहुत बढ़िया! आपने सही पहचाना!'
                : 'कृपया सोचकर सही विकल्प चुनें।'}
            </p>
          )}
        </div>

        {/* 7. VOCABULARY BOX & ENCOURAGEMENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 space-y-0.5">
            <span className="text-[10px] font-black uppercase text-blue-700 block">
              आज का शब्द (Vocabulary Word)
            </span>
            <p className="text-sm font-black text-slate-900">
              {page.word} = <span className="text-blue-800">{page.hindiMeaning}</span>
            </p>
            <p className="text-[10px] text-slate-600 italic">
              रोचक तथ्य: {page.funFact}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 block">
                प्रोत्साहन (Encouragement)
              </span>
              <p className="text-xs font-bold text-emerald-950">
                “शाबाश! अक्षर {page.letter} ({page.lowerLetter}) को पहचानो, बोलो और लिखो।”
              </p>
            </div>
          </div>

        </div>

        {/* 8. BOTTOM NAVIGATION AREA (A4 Footer) */}
        <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-xs font-bold">
          
          <button
            onClick={() => currentPageIndex > 0 && setCurrentPageIndex(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              currentPageIndex === 0
                ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-2xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>
              {currentPageIndex > 0
                ? `← पिछला: ${NURSERY_A_TO_Z_PAGES[currentPageIndex - 1].letter}`
                : 'प्रारंभ'}
            </span>
          </button>

          <div className="text-center">
            <span className="text-slate-800 font-black font-mono">
              पेज {page.pageNumber}/26
            </span>
            <span className="text-[10px] text-slate-400 block font-normal">
              IOIS Early Childhood Care
            </span>
          </div>

          <button
            onClick={() => currentPageIndex < NURSERY_A_TO_Z_PAGES.length - 1 && setCurrentPageIndex(currentPageIndex + 1)}
            disabled={currentPageIndex === NURSERY_A_TO_Z_PAGES.length - 1}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              currentPageIndex === NURSERY_A_TO_Z_PAGES.length - 1
                ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
            }`}
          >
            <span>
              {currentPageIndex < NURSERY_A_TO_Z_PAGES.length - 1
                ? `अगला: ${NURSERY_A_TO_Z_PAGES[currentPageIndex + 1].letter} →`
                : 'समाप्त'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
