import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Printer, 
  Download, 
  Star, 
  Award, 
  Check, 
  Copy,
  Layers,
  HelpCircle,
  Lightbulb,
  Music,
  Smile,
  X,
  Maximize2,
  BookMarked,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle,
  Zap,
  Eye,
  FileText,
  Image as ImageIcon,
  Sun,
  Moon
} from 'lucide-react';
import { BAL_VIKAS_PRINTABLE_PAGES, BalVikasPrintablePage } from './StudyResourceViewerModal';
import { NurseryAlphabetWorkbook } from './NurseryAlphabetWorkbook';
import { KidsDrawingCanvas } from './KidsDrawingCanvas';
import { NeetJeeProbabilityZone } from './NeetJeeProbabilityZone';
import { PharmacySem4Portal } from './PharmacySem4Portal';
import { NCERT_QUESTIONS_DATA, NCERT_CLASSES_LIST, NCERTQuestionItem } from '../data/ncertLineByLineQuestionsData';
import { soundEffects } from '../utils/soundEffects';
import { Palette, Target, Flame, Heart, Sparkle } from 'lucide-react';

interface NCERTFullStudySuiteProps {
  initialClass?: number;
  initialSubject?: 'hindi' | 'english' | 'math' | 'evs' | 'chapters';
}

// 1. अ से अनार Data with real pictures, phonetics & rhymes
export const HINDI_ALPHABET = [
  { char: 'अ', word: 'अनार', eng: 'Pomegranate', icon: '🍎', realPic: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'अ से अनार मीठा-दाना, जो भी खाए बने सयाना।' },
  { char: 'आ', word: 'आम', eng: 'Mango', icon: '🥭', realPic: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'आ से आम रसीला पीला, इसका स्वाद बड़ा नशीला।' },
  { char: 'इ', word: 'इमली', eng: 'Tamarind', icon: '🫒', realPic: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'इ से इमली खट्टी-मीठी, मुँह में पानी भर लाती।' },
  { char: 'ई', word: 'ईख', eng: 'Sugarcane', icon: '🎋', realPic: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'ई से ईख खेत में लहराए, इसका मीठा गुड़ बन जाए।' },
  { char: 'उ', word: 'उल्लू', eng: 'Owl', icon: '🦉', realPic: 'https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'उ से उल्लू रात को जागे, दिन निकले तो डर कर भागे।' },
  { char: 'ऊ', word: 'ऊन', eng: 'Wool', icon: '🧶', realPic: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'ऊ से ऊन भेड़ से पाएँ, गर्म स्वेटर बुन कर पहनें।' },
  { char: 'ऋ', word: 'ऋषि', eng: 'Sage', icon: '🧘', realPic: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'ऋ से ऋषि तपस्या करते, ज्ञान की बातें सबको कहते।' },
  { char: 'ए', word: 'एड़ी', eng: 'Heel', icon: '🦶', realPic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'ए से एड़ी पाँव का भाग, दौड़ लगाओ छोड़ के दाग।' },
  { char: 'ऐ', word: 'ऐनक', eng: 'Spectacles', icon: '👓', realPic: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'ऐ से ऐनक दादाजी की शान, साफ दिखाए हर सामान।' },
  { char: 'ओ', word: 'ओखली', eng: 'Mortar', icon: '🥣', realPic: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'ओ से ओखली बड़ी है भारी, कूटो मसाला करो तैयारी।' },
  { char: 'औ', word: 'औरत', eng: 'Woman', icon: '👩', realPic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'औ से औरत ममता की मूरत, सबसे प्यारी इनकी सूरत।' },
  { char: 'अं', word: 'अंगूर', eng: 'Grapes', icon: '🍇', realPic: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'अं से अंगूर गुच्छों में लटके, मीठे-खट्टे लगते झटके।' },
  { char: 'अः', word: 'खाली', eng: 'Empty', icon: '✨', realPic: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80', type: 'swar', example: 'अः से खाली मिलकर गाओ, हंसते-हंसते ताली बजाओ!' },

  // Vyanjan (Consonants)
  { char: 'क', word: 'कबूतर', eng: 'Pigeon', icon: '🕊️', realPic: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'क से कबूतर गुटर-गूँ बोले, शांति का संदेशा घोले।' },
  { char: 'ख', word: 'खरगोश', eng: 'Rabbit', icon: '🐇', realPic: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ख से खरगोश सफेद और प्यारा, दौड़ में आगे सबसे न्यारा।' },
  { char: 'ग', word: 'गमला', eng: 'Flowerpot', icon: '🪴', realPic: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ग से गमला फूल खिलाए, घर आँगन को महकाए।' },
  { char: 'घ', word: 'घड़ी', eng: 'Clock', icon: '⏰', realPic: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'घ से घड़ी समय बतलाए, टिक-टिक करती चलती जाए।' },
  { char: 'ङ', word: 'खाली', eng: 'Empty', icon: '⭕', realPic: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ङ से खाली बच्चों गाओ, पढ़ने में मन लगाओ।' },
  { char: 'च', word: 'चम्मच', eng: 'Spoon', icon: '🥄', realPic: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'च से चम्मच खीर खिलाए, बच्चों के मुँह को भाए।' },
  { char: 'छ', word: 'छाता', eng: 'Umbrella', icon: '☂️', realPic: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'छ से छाता धूप भगाए, बारिश में भीगने से बचाए।' },
  { char: 'ज', word: 'जहाज', eng: 'Ship', icon: '🚢', realPic: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ज से जहाज पानी पर तैरे, सागर की लहरों पर सैर कराए।' },
  { char: 'झ', word: 'झंडा', eng: 'Flag', icon: '🇮🇳', realPic: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'झ से झंडा तिरंगा प्यारा, भारत देश का राज दुलारा।' },
  { char: 'ञ', word: 'खाली', eng: 'Empty', icon: '⭕', realPic: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ञ से खाली याद रखो, अक्षरों का अभ्यास करो।' },
  { char: 'ट', word: 'टमाटर', eng: 'Tomato', icon: '🍅', realPic: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ट से टमाटर लाल-लाल, खाकर गाल बने लाल।' },
  { char: 'ठ', word: 'ठठेरा', eng: 'Tinker', icon: '🔨', realPic: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ठ से ठठेरा बर्तन गढ़े, मेहनत से जो आगे बढ़े।' },
  { char: 'ड', word: 'डमरू', eng: 'Small Drum', icon: '🪘', realPic: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ड से डमरू डम-डम बोले, शिव शंकर की मस्ती घोले।' },
  { char: 'ढ', word: 'ढक्कन', eng: 'Lid', icon: '🍲', realPic: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ढ से ढक्कन बर्तन ढँकता, मक्खी-मच्छर दूर भगाता।' },
  { char: 'ण', word: 'खाली', eng: 'Empty', icon: '⭕', realPic: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ण से खाली बाण का अंत, अक्षर सीखो बनो महंत।' },
  { char: 'त', word: 'तरबूज', eng: 'Watermelon', icon: '🍉', realPic: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'त से तरबूज अंदर से लाल, गर्मी में कर दे खुशहाल।' },
  { char: 'थ', word: 'थर्मस', eng: 'Thermos', icon: '🧊', realPic: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'थ से थर्मस ठंडा पानी, पीकर खुश होती नानी।' },
  { char: 'द', word: 'दवात', eng: 'Inkpot', icon: '🖋️', realPic: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'द से दवात स्याही वाली, लिखो सुंदर अक्षर निराली।' },
  { char: 'ध', word: 'धनुष', eng: 'Bow', icon: '🏹', realPic: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ध से धनुष बाण चढ़ाओ, लक्ष्य साधकर जीत जाओ।' },
  { char: 'न', word: 'नल', eng: 'Tap', icon: '🚰', realPic: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'न से नल पानी बरसाए, बूँद-बूँद जीवन बचाए।' },
  { char: 'प', word: 'पतंग', eng: 'Kite', icon: '🪁', realPic: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'प से पतंग आसमान में उड़े, डोर के सहारे हवा से जुड़े।' },
  { char: 'फ', word: 'फल', eng: 'Fruits', icon: '🍎', realPic: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'फ से फल खाओ ताज़ा-ताज़ा, बन जाओ ताकत का राजा।' },
  { char: 'ब', word: 'बकरी', eng: 'Goat', icon: '🐐', realPic: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ब से बकरी मैं-मैं करती, हरी-हरी घास को चरती।' },
  { char: 'भ', word: 'भालू', eng: 'Bear', icon: '🐻', realPic: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'भ से भालू नाचे छम-छम, मदारी का खेल दिखावे हरदम।' },
  { char: 'म', word: 'मछली', eng: 'Fish', icon: '🐟', realPic: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'म से मछली जल की रानी, जीवन उसका है बस पानी।' },
  { char: 'य', word: 'यज्ञ', eng: 'Sacred Fire', icon: '🔥', realPic: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'य से यज्ञ ऋषि मुनि करते, वातावरण को पावन करते।' },
  { char: 'र', word: 'रथ', eng: 'Chariot', icon: '🛞', realPic: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'र से रथ राजा का वाहन, पहिए घूमते हर आँगन।' },
  { char: 'ल', word: 'लट्टू', eng: 'Spinning Top', icon: '🪀', realPic: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ल से लट्टू गोल घूमे, देखकर सारा बचपन झूमे।' },
  { char: 'व', word: 'वक', eng: 'Crane / Heron', icon: '🦢', realPic: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'व से वक पानी में रहता, ध्यान लगाकर मछली पकड़ता।' },
  { char: 'श', word: 'शलजम', eng: 'Turnip', icon: '🧅', realPic: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'श से शलजम पौष्टिक सब्जी, सेहत बनेगी जब खाओगे ताजी।' },
  { char: 'ष', word: 'षट्कोण', eng: 'Hexagon', icon: '🔷', realPic: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ष से षट्कोण छह कोणों वाला, गणित का आकार निराला।' },
  { char: 'स', word: 'सेब', eng: 'Apple', icon: '🍎', realPic: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'स से सेब खाओ रोज़ाना, डॉक्टर के पास कभी न जाना।' },
  { char: 'ह', word: 'हाथी', eng: 'Elephant', icon: '🐘', realPic: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=300&q=80', type: 'vyanjan', example: 'ह से हाथी सूँड हिलाता, भारी-भरकम चाल दिखाता।' },
  { char: 'क्ष', word: 'क्षत्रिय', eng: 'Warrior', icon: '⚔️', realPic: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80', type: 'sanyukt', example: 'क्ष से क्षत्रिय वीर बलवान, देश की रक्षा में कुर्बान।' },
  { char: 'त्र', word: 'त्रिशूल', eng: 'Trident', icon: '🔱', realPic: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80', type: 'sanyukt', example: 'त्र से त्रिशूल शिव का अस्त्र, तीन शूलों से सज्जित शस्त्र।' },
  { char: 'ज्ञ', word: 'ज्ञानी', eng: 'Scholar', icon: '🧑‍🎓', realPic: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=300&q=80', type: 'sanyukt', example: 'ज्ञ से ज्ञानी विद्या पाए, पूरे संसार को राह दिखाए।' }
];

// 2. A to Z English Alphabet Data with real pictures & phonics
export const ENGLISH_ALPHABET = [
  { letter: 'A', small: 'a', word: 'Apple', hindi: 'सेब', icon: '🍎', realPic: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80', phonics: '/æ/ - ऐ', sentence: 'A is for Apple, sweet and red!' },
  { letter: 'B', small: 'b', word: 'Ball', hindi: 'गेंद', icon: '⚽', realPic: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=300&q=80', phonics: '/b/ - ब', sentence: 'B is for Ball, bouncing so high.' },
  { letter: 'C', small: 'c', word: 'Cat', hindi: 'बिल्ली', icon: '🐱', realPic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80', phonics: '/k/ - क', sentence: 'C is for Cat, saying meow-meow.' },
  { letter: 'D', small: 'd', word: 'Dog', hindi: 'कुत्ता', icon: '🐶', realPic: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80', phonics: '/d/ - ड', sentence: 'D is for Dog, loyal and true.' },
  { letter: 'E', small: 'e', word: 'Elephant', hindi: 'हाथी', icon: '🐘', realPic: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=300&q=80', phonics: '/e/ - ए', sentence: 'E is for Elephant, big and strong.' },
  { letter: 'F', small: 'f', word: 'Fish', hindi: 'मछली', icon: '🐟', realPic: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=300&q=80', phonics: '/f/ - फ', sentence: 'F is for Fish, swimming in the pond.' },
  { letter: 'G', small: 'g', word: 'Grapes', hindi: 'अंगूर', icon: '🍇', realPic: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=300&q=80', phonics: '/g/ - ग', sentence: 'G is for Grapes, juicy and sweet.' },
  { letter: 'H', small: 'h', word: 'Horse', hindi: 'घोड़ा', icon: '🐴', realPic: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=300&q=80', phonics: '/h/ - ह', sentence: 'H is for Horse, galloping fast.' },
  { letter: 'I', small: 'i', word: 'Ice-cream', hindi: 'आइसक्रीम', icon: '🍦', realPic: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=300&q=80', phonics: '/aɪ/ - आइ', sentence: 'I is for Ice-cream, cool on a hot day.' },
  { letter: 'J', small: 'j', word: 'Joker', hindi: 'जोकर', icon: '🃏', realPic: 'https://images.unsplash.com/photo-1514533212735-5df27d970db0?auto=format&fit=crop&w=300&q=80', phonics: '/dʒ/ - ज', sentence: 'J is for Joker, making everyone laugh.' },
  { letter: 'K', small: 'k', word: 'Kite', hindi: 'पतंग', icon: '🪁', realPic: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=300&q=80', phonics: '/k/ - क', sentence: 'K is for Kite, flying in the sky.' },
  { letter: 'L', small: 'l', word: 'Lion', hindi: 'शेर', icon: '🦁', realPic: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=300&q=80', phonics: '/l/ - ल', sentence: 'L is for Lion, king of the jungle.' },
  { letter: 'M', small: 'm', word: 'Mango', hindi: 'आम', icon: '🥭', realPic: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80', phonics: '/m/ - म', sentence: 'M is for Mango, king of all fruits.' },
  { letter: 'N', small: 'n', word: 'Nest', hindi: 'घोंसला', icon: '🪺', realPic: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?auto=format&fit=crop&w=300&q=80', phonics: '/n/ - न', sentence: 'N is for Nest, home for baby birds.' },
  { letter: 'O', small: 'o', word: 'Owl', hindi: 'उल्लू', icon: '🦉', realPic: 'https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=300&q=80', phonics: '/ɒ/ - ऑ', sentence: 'O is for Owl, awake in the night.' },
  { letter: 'P', small: 'p', word: 'Parrot', hindi: 'तोता', icon: '🦜', realPic: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=300&q=80', phonics: '/p/ - प', sentence: 'P is for Parrot, green with a red beak.' },
  { letter: 'Q', small: 'q', word: 'Queen', hindi: 'रानी', icon: '👑', realPic: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80', phonics: '/kw/ - क्व', sentence: 'Q is for Queen, wearing a golden crown.' },
  { letter: 'R', small: 'r', word: 'Rainbow', hindi: 'इंद्रधनुष', icon: '🌈', realPic: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80', phonics: '/r/ - र', sentence: 'R is for Rainbow, with seven bright colors.' },
  { letter: 'S', small: 's', word: 'Sun', hindi: 'सूरज', icon: '☀️', realPic: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=300&q=80', phonics: '/s/ - स', sentence: 'S is for Sun, giving warmth and light.' },
  { letter: 'T', small: 't', word: 'Tiger', hindi: 'बाघ', icon: '🐯', realPic: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=300&q=80', phonics: '/t/ - ट', sentence: 'T is for Tiger, our national animal.' },
  { letter: 'U', small: 'u', word: 'Umbrella', hindi: 'छाता', icon: '☂️', realPic: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=300&q=80', phonics: '/ʌ/ - अ', sentence: 'U is for Umbrella, saving from the rain.' },
  { letter: 'V', small: 'v', word: 'Van', hindi: 'गाड़ी', icon: '🚐', realPic: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=300&q=80', phonics: '/v/ - व', sentence: 'V is for Van, taking kids to school.' },
  { letter: 'W', small: 'w', word: 'Watch', hindi: 'घड़ी', icon: '⌚', realPic: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=300&q=80', phonics: '/w/ - व', sentence: 'W is for Watch, showing the exact time.' },
  { letter: 'X', small: 'x', word: 'Xylophone', hindi: 'जलतरंग', icon: '🎼', realPic: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&q=80', phonics: '/z/ - ज़', sentence: 'X is for Xylophone, playing melodious tunes.' },
  { letter: 'Y', small: 'y', word: 'Yak', hindi: 'पहाड़ी बैल', icon: '🐂', realPic: 'https://images.unsplash.com/photo-1551887196-72e32bfc7bf3?auto=format&fit=crop&w=300&q=80', phonics: '/j/ - य', sentence: 'Y is for Yak, living on snowy mountains.' },
  { letter: 'Z', small: 'z', word: 'Zebra', hindi: 'ज़ेब्रा', icon: '🦓', realPic: 'https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=300&q=80', phonics: '/z/ - ज़', sentence: 'Z is for Zebra, with black and white stripes.' }
];

// 3. Counting 1 to 100 with Real Visual Milestones
export const COUNTING_DATA = Array.from({ length: 100 }, (_, i) => {
  const num = i + 1;
  const hindiWords = [
    'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
    'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
    'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस',
    'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
    'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास',
    'इक्यावन', 'बावन', 'तिरेपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ', 'साठ',
    'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सरसठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
    'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी', 'अस्सी',
    'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी', 'नब्बे',
    'इक्यानवे', 'बानवे', 'तिरानवे', 'चौरानवे', 'पंचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे', 'सौ'
  ];

  // Specific real milestone icons
  const milestones: Record<number, { icon: string; desc: string }> = {
    1: { icon: '☀️', desc: '1 सूरज' },
    2: { icon: '👀', desc: '2 आँखें' },
    3: { icon: '🚦', desc: '3 बत्तियाँ' },
    4: { icon: '🪑', desc: '4 पाए' },
    5: { icon: '🖐️', desc: '5 उंगलियाँ' },
    6: { icon: '🎲', desc: '6 बिंदु' },
    7: { icon: '🌈', desc: '7 रंग' },
    8: { icon: '🐙', desc: '8 हाथ' },
    9: { icon: '💎', desc: '9 रत्न' },
    10: { icon: '👐', desc: '10 उंगलियाँ' },
    12: { icon: '⏰', desc: '12 घंटे' },
    15: { icon: '🌕', desc: '15 पक्ष दिन' },
    20: { icon: '🦶', desc: '20 कुल उंगलियाँ' },
    24: { icon: '☸️', desc: '24 तीलियाँ' },
    30: { icon: '📅', desc: '30 दिन महीना' },
    50: { icon: '🏏', desc: '50 अर्धशतक' },
    100: { icon: '💯', desc: '100 पूरा शतक' },
  };

  return {
    num,
    hindi: hindiWords[i] || `${num}`,
    eng: `${num}`,
    milestone: milestones[num]
  };
});

// 4. Real Example Pictures for 2 to 20 Multiplication Tables
export const TABLE_REAL_EXAMPLES: Record<number, { unit: string; icon: string; example: string }> = {
  2: { unit: 'साइकिल के पहिए (Bicycle Wheels)', icon: '🚲', example: '1 साइकिल में 2 पहिए होते हैं। 5 साइकिल में 2 × 5 = 10 पहिए।' },
  3: { unit: 'ऑटो-रिक्शा के पहिए (Auto Wheels)', icon: '🛺', example: '1 ऑटो में 3 पहिए होते हैं। 4 ऑटो में 3 × 4 = 12 पहिए।' },
  4: { unit: 'कार के पहिए (Car Wheels)', icon: '🚗', example: '1 कार में 4 पहिए होते हैं। 3 कार में 4 × 3 = 12 पहिए।' },
  5: { unit: 'हाथ की उंगलियाँ (Hand Fingers)', icon: '🖐️', example: '1 हाथ में 5 उंगलियाँ होती हैं। 4 हाथों में 5 × 4 = 20 उंगलियाँ।' },
  6: { unit: 'कीट या चींटी के पैर (Insect Legs)', icon: '🐜', example: '1 चींटी के 6 पैर होते हैं। 3 चींटियों के 6 × 3 = 18 पैर।' },
  7: { unit: 'इंद्रधनुष के रंग (Rainbow Colors)', icon: '🌈', example: '1 इंद्रधनुष में 7 रंग होते हैं। 2 इंद्रधनुष में 7 × 2 = 14 रंग।' },
  8: { unit: 'ऑक्टोपस की भुजाएं (Octopus Arms)', icon: '🐙', example: '1 ऑक्टोपस के 8 हाथ होते हैं। 3 ऑक्टोपस के 8 × 3 = 24 हाथ।' },
  9: { unit: 'नवरत्न समूह (Navratna Gems)', icon: '💎', example: '1 नवरत्न समूह में 9 रत्न होते हैं। 2 समूहों में 9 × 2 = 18 रत्न।' },
  10: { unit: 'दस का भारतीय सिक्का (₹10 Coins)', icon: '🪙', example: '1 सिक्का ₹10 का है। 5 सिक्के मिलाकर 10 × 5 = ₹50 बनते हैं।' },
  11: { unit: 'क्रिकेट टीम के खिलाड़ी (Cricket Players)', icon: '🏏', example: '1 टीम में 11 खिलाड़ी होते हैं। 2 टीमों में 11 × 2 = 22 खिलाड़ी।' },
  12: { unit: 'एक दर्जन केले (Dozen Bananas)', icon: '🍌', example: '1 दर्जन में 12 केले होते हैं। 3 दर्जन में 12 × 3 = 36 केले।' },
  13: { unit: 'ताश के पत्तों का सूट (Cards Suit)', icon: '♠️', example: 'ताश के 1 सूट में 13 पत्ते होते हैं। 2 सूट में 13 × 2 = 26 पत्ते।' },
  14: { unit: 'एक पखवाड़ा दिन (Fortnight Days)', icon: '🌓', example: '1 पखवाड़े में 14 दिन होते हैं। 2 पखवाड़े में 14 × 2 = 28 दिन।' },
  15: { unit: 'चौथाई घंटा मिनट (Quarter Hour Minutes)', icon: '⏱️', example: '15 मिनट का 1 क्वार्टर होता है। 4 क्वार्टर में 15 × 4 = 60 मिनट।' },
  16: { unit: 'शतरंज के 1 पक्ष के मोहरे (Chess Pieces)', icon: '♟️', example: '1 खिलाड़ी के पास 16 मोहरे होते हैं। 2 खिलाड़ियों के 16 × 2 = 32 मोहरे।' },
  17: { unit: 'कविता के हाइकू पद (Poetic Syllables)', icon: '📜', example: '17 अक्षरों की पारंपरिक कविता। 2 कविताओं में 17 × 2 = 34 अक्षर।' },
  18: { unit: 'गीता के सम्पूर्ण अध्याय (Gita Chapters)', icon: '📖', example: 'गीता में 18 अध्याय हैं। 2 प्रतियों में 18 × 2 = 36 अध्याय।' },
  19: { unit: 'अभाज्य संख्या ब्लॉक (Prime Block)', icon: '🧱', example: '19 ईंटों की 1 कतार। 3 कतारों में 19 × 3 = 57 ईंटें।' },
  20: { unit: 'हाथ व पैर की उंगलियाँ (Total Digits)', icon: '🦶', example: '1 व्यक्ति के हाथ-पैर में 20 उंगलियाँ होती हैं। 5 व्यक्तियों में 20 × 5 = 100।' }
};

// 5. Complete 5 Chapter Modules Detailed Content
export const DETAILED_CURRICULUM_CHAPTERS = [
  {
    ch: 1,
    title: 'अध्याय 1: आधारभूत परिचय एवं संकल्पनाएं (Basic Fundamentals)',
    subtitle: 'स्वर, व्यंजन, 1 से 100 गिनती, मूलभूत आकृतियाँ एवं शब्द ज्ञान',
    bookCoverPic: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    overview: 'यह अध्याय प्राथमिक शिक्षा की रीढ़ है। इसमें विद्यार्थी को अक्षर ज्ञान (अ से ज्ञ, A to Z), संख्या बोध (1 से 100), और हमारे आस-पास पाई जाने वाली विभिन्न ज्यामितीय आकृतियों (गोलाकार, त्रिभुज, आयत) का व्यावहारिक ज्ञान दिया जाता है।',
    keyConcepts: [
      'स्वर (13) एवं व्यंजन (36) का शुद्ध उच्चारण व लिखावट',
      'A to Z अंग्रेजी वर्णमाला एवं फोनेटिक्स उच्चारण नियम',
      '1 से 100 तक संख्याओं की पहचान एवं स्थानीय मान (इकाई-दहाई)',
      'आकृतियाँ और स्थान: अंदर-बाहर, बड़ा-छोटा, ऊपर-नीचे, लुढ़कना-सरकना'
    ],
    solvedExamples: [
      { q: 'प्रश्न: तीन गोल और तीन चौकोर वस्तुओं के नाम लिखें?', a: 'उत्तर: गोल वस्तुएँ - सिक्का, रोटी, फुटबॉल। चौकोर वस्तुएँ - पुस्तक, ईंट, ब्लैकबोर्ड।' },
      { q: 'प्रश्न: 24 में इकाई और दहाई का अंक बताएं?', a: 'उत्तर: 24 में 4 इकाई है और 2 दहाई (20 + 4 = 24) है।' }
    ],
    practiceTask: 'प्रतिदिन 1 पेज सुंदर सुलेख लिखें और 1 से 50 तक उल्टी गिनती का मौखिक अभ्यास करें।'
  },
  {
    ch: 2,
    title: 'अध्याय 2: सचित्र अभ्यास व वर्कशीट्स (Interactive Problem Sheets)',
    subtitle: 'सचित्र जोड़, घटाव, गुणा, भाग, 4-लाइन ट्रेसिंग व व्याकरण वर्कशीट',
    bookCoverPic: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    overview: 'इस अध्याय में विद्यार्थियों को रटने के बजाय चित्रों और वस्तुओं के माध्यम से गणितीय संक्रियाएँ (जोड़, घटाव) और भाषाई व्याकरण की वर्कशीट्स हल कराई जाती हैं।',
    keyConcepts: [
      'सचित्र जोड़: फलों और खिलौनों को गिनकर एक साथ मिलाना',
      'सचित्र घटाव: कुल समूह में से वस्तुओं को अलग करना या काटना',
      'पहाड़ा रचना: बार-बार जोड़ने से पहाड़ा बनाना (2 + 2 + 2 = 6)',
      'विलोम शब्द व समानार्थक शब्द अभ्यास शीट'
    ],
    solvedExamples: [
      { q: 'प्रश्न: रोहन के पास 7 पेंसिल थीं, उसने 3 पेंसिल रीना को दीं। रोहन के पास कितनी बचीं?', a: 'उत्तर: 7 - 3 = 4 पेंसिलें रोहन के पास बचीं।' },
      { q: 'प्रश्न: एक डिब्बे में 6 लड्डू हैं, तो ऐसे 4 डिब्बों में कुल कितने लड्डू होंगे?', a: 'उत्तर: 6 × 4 = 24 लड्डू होंगे।' }
    ],
    practiceTask: 'वर्कशीट प्रिंट करें और जोड़-घटाव के 10-10 सवाल बिना किसी मदद के हल करें।'
  },
  {
    ch: 3,
    title: 'अध्याय 3: दैनिक जीवन में अनुप्रयोग (Practical Life Applications)',
    subtitle: 'समय (घड़ी), भारतीय मुद्रा (रुपये-पैसे), मापन (वजन-लंबाई) व स्वच्छता',
    bookCoverPic: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    overview: 'शिक्षा वही उपयोगी है जो दैनिक जीवन में काम आए। इस अध्याय में बच्चे घड़ी में समय देखना, दुकान पर सामान खरीदते समय नोट व सिक्कों का हिसाब करना, और वस्तुओं को मापना सीखते हैं।',
    keyConcepts: [
      'समय ज्ञान: छोटी सुई (घंटा), बड़ी सुई (मिनट), सुबह, दोपहर, शाम की दिनचर्या',
      'भारतीय मुद्रा: ₹1, ₹2, ₹5, ₹10, ₹20, ₹50, ₹100, ₹500 के नोटों की पहचान',
      'मापन: मीटर और सेंटीमीटर में लंबाई, किलोग्राम व ग्राम में वजन, लीटर में दूध/पानी',
      'व्यक्तिगत स्वच्छता और पर्यावरण संरक्षण के सुनहरे नियम'
    ],
    solvedExamples: [
      { q: 'प्रश्न: यदि 1 किलो आलू ₹20 के हैं, तो 3 किलो आलू का मूल्य क्या होगा?', a: 'उत्तर: 20 × 3 = ₹60 होगा।' },
      { q: 'प्रश्न: 1 मीटर में कितने सेंटीमीटर होते हैं?', a: 'उत्तर: 1 मीटर = 100 सेंटीमीटर।' }
    ],
    practiceTask: 'आज अपने घर की दीवार घड़ी देखकर परिवार के सदस्यों को सही समय बताएं।'
  },
  {
    ch: 4,
    title: 'अध्याय 4: प्रश्नोत्तर संग्रह एवं आदर्श उत्तर (Model Answers Vault)',
    subtitle: 'NCERT पाठ्यपुस्तकों (रिमझिम, Marigold, गणित का जादू) के सटीक समाधान',
    bookCoverPic: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    overview: 'परीक्षाओं में सर्वोच्च अंक प्राप्त करने के लिए NCERT के सभी अध्यायों के प्रामाणिक, सरल और सटीक प्रश्नोत्तरों का संपूर्ण संग्रह।',
    keyConcepts: [
      'रिमझिम हिंदी: पाठ 1 से 15 तक के सभी प्रश्नों के आदर्श उत्तर',
      'Marigold English: All Unit poems and story comprehension with grammar',
      'गणित का जादू: चरणबद्ध समाधान और रफ कार्य की सही विधि',
      'आस-पास EVS: पर्यावरण, पशु-पक्षी और पारिवारिक रिश्तों पर विश्लेषणात्मक उत्तर'
    ],
    solvedExamples: [
      { q: 'प्रश्न: जल संरक्षण क्यों आवश्यक है? दो उपाय बताएं।', a: 'उत्तर: जल ही जीवन है। उपाय: (1) नल को खुला न छोड़ें। (2) वर्षा के जल का संचयन करें।' },
      { q: 'Question: Where did the happy child sit when all her play was done?', a: 'Answer: The happy child sat under the green tree when all her play was done.' }
    ],
    practiceTask: 'पाठ के अंत में दिए गए प्रश्नों को अपनी कॉपी में बिना देखे लिखने का अभ्यास करें।'
  },
  {
    ch: 5,
    title: 'अध्याय 5: त्वरित पुनरावलोकन व परीक्षा ट्रिक्स (Speed Revision Tricks)',
    subtitle: 'स्पीड मैथ शॉर्टकट, उंगलियों पर पहाड़ा, माइंड मैप्स व 100% अंक रणनीति',
    bookCoverPic: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    overview: 'परीक्षा के अंतिम समय में कम समय में पूरे पाठ्यक्रम को दोहराने के लिए सीक्रेट ट्रिक्स, सूत्र और माइंड मैप्स का खजाना।',
    keyConcepts: [
      'स्पीड मैथ: किसी भी संख्या को 5 से 2 सेकंड में गुणा करने की ट्रिक',
      'उंगलियों पर 9 का पहाड़ा निकालने का जादुई तरीका',
      'हिंदी व्याकरण का संपूर्ण माइंड मैप (संज्ञा, सर्वनाम, विशेषण, क्रिया)',
      'परीक्षा में समय प्रबंधन और सुंदर उत्तर लेखन शैली'
    ],
    solvedExamples: [
      { q: 'ट्रिक: 34 × 5 को 2 सेकंड में कैसे हल करें?', a: 'विधि: 34 का आधा करें (17) और आगे 0 लगा दें = 170। सटीक उत्तर!' },
      { q: 'ट्रिक: 9 का पहाड़ा उंगलियों पर:', a: 'विधि: 10 उंगलियों में जिस संख्या से गुणा करना हो उस उंगली को मोड़ें। बाईं ओर दहाई, दाईं ओर इकाई।' }
    ],
    practiceTask: 'स्पीड मैथ की 5 ट्रिक्स अपने मित्रों को सिखाएं और टाइमर लगाकर सवालों को हल करें।'
  }
];

export const NCERTFullStudySuite: React.FC<NCERTFullStudySuiteProps> = ({
  initialClass = 1,
  initialSubject = 'math'
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'drawing' | 'neet_jee' | 'pharmacy_sem4' | 'book' | 'hindi' | 'english' | 'math' | 'tables' | 'operations' | 'chapters' | 'download' | 'workbook'>('questions');
  const [selectedClass, setSelectedClass] = useState<number>(initialClass);
  const [themeMode, setThemeMode] = useState<'student-friendly' | 'night'>('student-friendly');
  const [selectedTable, setSelectedTable] = useState<number>(2);
  const [enlargedPrintPage, setEnlargedPrintPage] = useState<BalVikasPrintablePage | null>(null);
  const [suiteToast, setSuiteToast] = useState<string | null>(null);
  
  // Interactive Question Bank State
  const [userQuestionAnswers, setUserQuestionAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [activeFunnyCharacter, setActiveFunnyCharacter] = useState<string>('🐵 चिंटू बंदर');

  const handleDownloadPageFile = (page: BalVikasPrintablePage) => {
    const content = `========================================================================\n`
      + `IOIS BAL VIKAS PRINTABLE KIT • PAGE 0${page.pageNum}\n`
      + `${page.titleHindi} (${page.titleEnglish})\n`
      + `कक्षा: ${selectedClass} | श्रेणी: ${page.category}\n`
      + `========================================================================\n\n`
      + page.textContent;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IOIS-BalVikas-Page0${page.pageNum}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSuiteToast(`पेज 0${page.pageNum} डाउनलोड शुरू हो गया है!`);
    setTimeout(() => setSuiteToast(null), 3000);
  };

  const handlePrintPageDoc = (page: BalVikasPrintablePage) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${page.titleHindi} - IOIS Bal Vikas Kit</title>
            <style>
              @page { size: A4 portrait; margin: 15mm; }
              body { font-family: system-ui, sans-serif; padding: 15px; color: #111; line-height: 1.6; }
              .header { border-bottom: 2px solid #ea580c; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; }
              .title { font-size: 20px; font-weight: 900; color: #ea580c; margin: 0; }
              .info { border: 1px dashed #64748b; padding: 8px 12px; margin: 12px 0; display: flex; justify-content: space-between; font-size: 12px; }
              .content { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; white-space: pre-wrap; font-size: 13px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="title">${page.titleHindi}</h1>
                <div style="font-size: 12px; color: #64748b;">${page.titleEnglish} • Class ${selectedClass}</div>
              </div>
              <div style="background: #ffedd5; color: #c2410c; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">
                IOIS BAL VIKAS PRINTABLE
              </div>
            </div>
            <div class="info">
              <div>विद्यार्थी नाम: ____________________</div>
              <div>कक्षा: ${selectedClass}</div>
              <div>दिनांक: ___________</div>
              <div>प्राप्तांक: ____/20</div>
            </div>
            <div class="content">${page.textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 11px; display: flex; justify-content: space-between; color: #64748b;">
              <div>IOIS National Digital Education (NCERT Class ${selectedClass})</div>
              <div>शिक्षक हस्ताक्षर: ___________________</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 400);
    } else {
      window.print();
    }
  };
  
  // Dedicated Chapter Reader Dialog Box state
  const [openChapterModal, setOpenChapterModal] = useState<typeof DETAILED_CURRICULUM_CHAPTERS[0] | null>(null);

  // Interactive Math Operations State (Zod, Ghatao, Guna, Bhag)
  const [mathMode, setMathMode] = useState<'zod' | 'ghatao' | 'guna' | 'bhag'>('zod');
  const [val1, setVal1] = useState<number>(5);
  const [val2, setVal2] = useState<number>(3);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);
  const [score, setScore] = useState<number>(0);

  // Page Reader State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 15;

  // Speech synthesizer
  const speakText = (text: string, lang = 'hi-IN') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate new math problem
  const generateNewProblem = (mode: 'zod' | 'ghatao' | 'guna' | 'bhag') => {
    setUserAnswer('');
    setFeedback(null);
    if (mode === 'zod') {
      const a = Math.floor(Math.random() * 12) + 1;
      const b = Math.floor(Math.random() * 12) + 1;
      setVal1(a);
      setVal2(b);
    } else if (mode === 'ghatao') {
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * a) + 1;
      setVal1(a);
      setVal2(b);
    } else if (mode === 'guna') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 1;
      setVal1(a);
      setVal2(b);
    } else if (mode === 'bhag') {
      const b = Math.floor(Math.random() * 5) + 2;
      const q = Math.floor(Math.random() * 6) + 1;
      setVal1(b * q);
      setVal2(b);
    }
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(userAnswer.trim(), 10);
    if (isNaN(parsed)) return;

    let correct = 0;
    if (mathMode === 'zod') correct = val1 + val2;
    if (mathMode === 'ghatao') correct = val1 - val2;
    if (mathMode === 'guna') correct = val1 * val2;
    if (mathMode === 'bhag') correct = Math.floor(val1 / val2);

    if (parsed === correct) {
      setFeedback({ isCorrect: true, msg: `शाबाश! सही उत्तर है: ${correct} 🎉` });
      setScore(s => s + 10);
      speakText('शाबाश! बिल्कुल सही उत्तर है!', 'hi-IN');
    } else {
      setFeedback({ isCorrect: false, msg: `पुनः प्रयास करें! सही उत्तर ${correct} होगा।` });
      speakText(`गलत उत्तर। सही उत्तर ${correct} है।`, 'hi-IN');
    }
  };

  const isLight = themeMode === 'student-friendly';

  return (
    <div className={`space-y-5 rounded-3xl p-1 sm:p-2 transition-colors ${
      isLight 
        ? 'bg-gradient-to-b from-amber-50/50 via-sky-50/40 to-slate-50 text-slate-800' 
        : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Top Main Navigation Bar for Class 1 to 12 */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl transition-all shadow-md ${
        isLight 
          ? 'bg-white border-2 border-amber-300 text-slate-800' 
          : 'bg-slate-950 border border-slate-800 text-slate-100 shadow-xl'
      }`}>
        
        {/* Class Switcher (Classes 1 to 12) & Theme Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-blue-900' : 'text-amber-400'}`}>
                NCERT कक्षा (1-12):
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => {
                const isKids = cls <= 6;
                const isSelected = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    onClick={() => {
                      setSelectedClass(cls);
                      soundEffects.playBoing();
                    }}
                    className={`w-8 h-8 rounded-xl font-black text-xs transition-all flex items-center justify-center ${
                      isSelected
                        ? isKids
                          ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-white shadow-lg scale-110 ring-2 ring-rose-400'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110 ring-2 ring-blue-400'
                        : isLight
                          ? 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-slate-950 border border-slate-200'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                    title={`कक्षा ${cls} ${isKids ? '(Primary / Middle • Fun & Drawing)' : '(Senior • NEET / JEE Mains)'}`}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Toggle Button & Title Badge */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="hidden sm:inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              सम्पूर्ण पाठ्य सामग्री 2026
            </span>
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === 'student-friendly' ? 'night' : 'student-friendly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs ${
                isLight
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700'
              }`}
              title="थीम बदलें (स्टूडेंट फ्रेंडली / नाइट मोड)"
            >
              {isLight ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>🌞 स्टूडेंट फ्रेंडली</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>🌙 नाइट मोड</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature Sections Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold pt-2 border-t border-slate-200/60 w-full">
          
          <button
            onClick={() => {
              setActiveTab('questions');
              soundEffects.playBoing();
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'questions' 
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white shadow-lg ring-2 ring-rose-400/50' 
                : isLight 
                  ? 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 shadow-2xs' 
                  : 'bg-slate-900 text-amber-300 hover:text-white border border-amber-500/40'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-rose-500" />
            <span>🎯 1-12th अध्यायवार प्रश्न बैंक</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('drawing');
              soundEffects.playCelebration();
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'drawing' 
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-lg ring-2 ring-pink-400/50' 
                : isLight 
                  ? 'bg-white text-pink-700 hover:bg-pink-50 border border-pink-200 shadow-2xs' 
                  : 'bg-slate-900 text-pink-400 hover:text-white border border-pink-500/40'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-pink-500" />
            <span>🎨 बच्चों का रंगीन ड्राइंग पैड</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('neet_jee');
              soundEffects.playBoing();
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'neet_jee' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg ring-2 ring-blue-400/50' 
                : isLight 
                  ? 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-2xs' 
                  : 'bg-slate-900 text-blue-400 hover:text-white border border-blue-500/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>🔥 NEET & JEE Mains प्रश्न बैंक</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('pharmacy_sem4');
              soundEffects.playBoing();
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'pharmacy_sem4' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg ring-2 ring-indigo-400/50' 
                : isLight 
                  ? 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 shadow-2xs' 
                  : 'bg-slate-900 text-cyan-400 hover:text-white border border-cyan-500/40'
            }`}
          >
            <span>💊 फार्मेसी 4th Sem (PCI)</span>
          </button>

          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'chapters' 
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400/40' 
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>📑 5-अध्याय विस्तृत पाठ्यक्रम</span>
          </button>

          <button
            onClick={() => setActiveTab('book')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'book' 
                ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400/40' 
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>📖 पेज-दर-पेज बुक रीडर</span>
          </button>

          <button
            onClick={() => setActiveTab('operations')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'operations' 
                ? 'bg-orange-600 text-white shadow-lg ring-2 ring-orange-400/40' 
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>➕➖✖️➗ जोड़, घटाव, गुणा, भाग</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'tables' 
                ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-400/40' 
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>🔢 पहाड़ा 2 से 20</span>
          </button>

          <button
            onClick={() => setActiveTab('math')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'math' 
                ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/40' 
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>💯 1 से 100 गिनती</span>
          </button>

          <button
            onClick={() => setActiveTab('hindi')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'hindi' 
                ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400/40' 
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>🍎 अ से अनार & कविता</span>
          </button>

          <button
            onClick={() => setActiveTab('english')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'english' 
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/40' 
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>🔤 A for Apple & Poems</span>
          </button>

          <button
            onClick={() => setActiveTab('workbook')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'workbook' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg ring-2 ring-orange-400/40' 
                : isLight 
                  ? 'bg-white text-orange-700 hover:bg-orange-50 border border-orange-200 shadow-2xs' 
                  : 'bg-slate-900 text-orange-400 hover:text-white border border-orange-500/40'
            }`}
          >
            <span>🎨 A-Z वर्कबुक</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'download' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg ring-2 ring-orange-400/40' 
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs' 
                  : 'bg-slate-900 text-amber-300 hover:text-white border border-amber-500/40'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-orange-500" />
            <span>📥 प्रिंटेबल किट</span>
          </button>

        </div>

      </div>

      {/* =========================================================================
          NEW SECTION A: 🎯 1-12th NCERT CHAPTER-BY-CHAPTER SHORT-FORM QUESTIONS
          ========================================================================= */}
      {activeTab === 'questions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Banner: Tailored for Kids (1-6) or Seniors (7-12) */}
          <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-xl ${
            selectedClass <= 6
              ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 border-amber-300 text-white'
              : 'bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 border-blue-500/40 text-white'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black uppercase tracking-wider">
                  <span>{selectedClass <= 6 ? '🧒 छोटे बच्चों के लिए फनी कार्टून स्टाइल' : '🎯 माध्यमिक व उच्च माध्यमिक NCERT डिकोडर'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black">
                  कक्षा {selectedClass} NCERT: अध्यायवार शॉर्ट-फॉर्म प्रश्न व सम्पूर्ण उत्तर
                </h3>
                <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                  {selectedClass <= 6
                    ? 'बोरिंग ब्लैक एंड व्हाइट बंद! यहाँ हैं मजेदार कार्टून पहेलियां, चटकदार रंगीन कार्ड्स और उंगली से स्क्रीन पर चित्र बनाने का ड्राइंग पैड!'
                    : 'Google हमेशा शॉर्टकट करता है, पर परीक्षा में NCERT की हर एक लाइन से सवाल आते हैं! यहाँ हर लाइन का सटीक व गहरा उत्तर उपलब्ध है।'}
                </p>
              </div>

              {selectedClass <= 6 && (
                <button
                  onClick={() => {
                    setActiveTab('drawing');
                    soundEffects.playCelebration();
                  }}
                  className="px-5 py-3 rounded-2xl bg-white text-rose-600 hover:bg-yellow-100 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Palette className="w-5 h-5 text-rose-500" />
                  <span>🎨 रंगीन ड्राइंग पैड खोलें (Draw Now)</span>
                </button>
              )}
            </div>
          </div>

          {/* Questions Grid for Selected Class */}
          <div className="space-y-5">
            {(() => {
              const classQuestions = NCERT_QUESTIONS_DATA.filter(q => q.classNumber === selectedClass);
              const questionsToShow = classQuestions.length > 0 
                ? classQuestions 
                : NCERT_QUESTIONS_DATA.filter(q => selectedClass <= 6 ? q.classNumber <= 6 : q.classNumber >= 7);

              return questionsToShow.map((item, idx) => {
                const isAnswered = userQuestionAnswers[item.id] !== undefined;
                const chosenOpt = userQuestionAnswers[item.id];
                const isRight = chosenOpt === item.correctIndex;
                const isRevealed = revealedSolutions[item.id];

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl p-6 sm:p-7 border-2 transition-all space-y-4 shadow-lg ${
                      selectedClass <= 6
                        ? 'bg-gradient-to-b from-white via-amber-50/30 to-rose-50/40 border-amber-300 hover:border-rose-400'
                        : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900'
                    }`}
                  >
                    {/* Header: Class, Subject, Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          selectedClass <= 6
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          कक्षा {item.classNumber} • {item.subject}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          पाठ {item.chapterNumber}: {item.chapterTitle}
                        </span>
                      </div>

                      {item.funnyBadge && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
                          <span>{item.funnyBadge}</span>
                        </span>
                      )}
                      {item.neetJeeProbability && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                          <span>{item.neetJeeProbability}</span>
                        </span>
                      )}
                    </div>

                    {/* Funny Dialogue (For Kids) */}
                    {item.funnyDialogue && (
                      <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-start gap-3">
                        <span className="text-2xl shrink-0">{item.funnyCharacter?.split(' ')[0] || '🐵'}</span>
                        <div>
                          <span className="text-[11px] font-black text-amber-900 block">{item.funnyCharacter} बोला:</span>
                          <p className="text-xs font-bold text-slate-800 leading-relaxed italic">
                            "{item.funnyDialogue}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Short Form Question */}
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow">
                        #{idx + 1}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {item.shortQuestion}
                      </h4>
                    </div>

                    {/* 4 Interactive Multiple Choice Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {item.options.map((opt, optIdx) => {
                        let optStyle = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';
                        let icon = <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">{String.fromCharCode(65 + optIdx)}</span>;

                        if (isAnswered) {
                          if (optIdx === item.correctIndex) {
                            optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
                            icon = <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />;
                          } else if (optIdx === chosenOpt) {
                            optStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-300';
                            icon = <XCircle className="w-6 h-6 text-rose-600 shrink-0" />;
                          } else {
                            optStyle = 'opacity-50 bg-slate-50 border-slate-200 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() => {
                              setUserQuestionAnswers(prev => ({ ...prev, [item.id]: optIdx }));
                              setRevealedSolutions(prev => ({ ...prev, [item.id]: true }));
                              if (optIdx === item.correctIndex) {
                                soundEffects.playSuccess();
                              } else {
                                soundEffects.playTryAgain();
                              }
                            }}
                            className={`p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 active:scale-98 ${optStyle}`}
                          >
                            {icon}
                            <span className="flex-1 leading-relaxed">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Toggle Solution & NCERT Line Citation */}
                    {isAnswered && (
                      <div className="pt-2">
                        <button
                          onClick={() => setRevealedSolutions(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{isRevealed ? 'व्याख्या छिपाएं' : 'NCERT की किताब की पूरी लाइन और उत्तर देखें ▼'}</span>
                        </button>
                      </div>
                    )}

                    {/* DETAILED NCERT LINE DECODER */}
                    {isRevealed && (
                      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 text-xs animate-in fade-in">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-black text-amber-300">
                            {item.ncertBookTitle}
                          </span>
                          <span className={isRight ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {isRight ? '✓ बिल्कुल सही!' : `✗ सही उत्तर: विकल्प ${String.fromCharCode(65 + item.correctIndex)}`}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/10 border-l-4 border-amber-400">
                          <span className="text-[10px] uppercase font-bold text-amber-400 block">NCERT की वास्तविक लाइन:</span>
                          <p className="text-xs italic text-amber-100 mt-0.5 font-serif">
                            {item.ncertExactLine}
                          </p>
                        </div>

                        {item.googleShortcutTrap && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                            <span className="text-[10px] uppercase font-bold text-rose-400 block">गूगल का शॉर्टकट बनाम पूरा सच:</span>
                            <p className="text-xs text-rose-200 mt-0.5">
                              {item.googleShortcutTrap}
                            </p>
                          </div>
                        )}

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">पूरी संकल्पनात्मक व्याख्या:</span>
                          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-medium">
                            {item.lineExplanation}
                          </p>
                        </div>

                        {item.superTrick && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{item.superTrick}</span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              });
            })()}
          </div>

        </div>
      )}

      {/* =========================================================================
          NEW SECTION B: 🎨 KIDS COLORFUL DRAWING & COLOR PAD
          ========================================================================= */}
      {activeTab === 'drawing' && (
        <div className="animate-in fade-in duration-200">
          <KidsDrawingCanvas />
        </div>
      )}

      {/* =========================================================================
          NEW SECTION C: 🔥 NEET & JEE MAINS PROBABILITY ZONE (CLASSES 7-12)
          ========================================================================= */}
      {activeTab === 'neet_jee' && (
        <div className="animate-in fade-in duration-200">
          <NeetJeeProbabilityZone />
        </div>
      )}

      {/* =========================================================================
          NEW SECTION D: 💊 B.PHARM 4TH SEMESTER PCI MASTER PLATFORM
          ========================================================================= */}
      {activeTab === 'pharmacy_sem4' && (
        <div className="animate-in fade-in duration-200">
          <PharmacySem4Portal />
        </div>
      )}

      {/* =========================================================================
          SECTION 1: 5-CHAPTER DETAILED CURRICULUM WITH DIRECT CHAPTER READING DIALOG
          ========================================================================= */}
      {activeTab === 'chapters' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 transition-all ${
            isLight 
              ? 'bg-white border-2 border-indigo-200 shadow-md text-slate-900' 
              : 'bg-slate-950 border border-slate-800 text-white'
          }`}>
            <div>
              <span className="text-[11px] font-mono text-indigo-600 font-bold uppercase tracking-wider">
                सम्पूर्ण अध्याय एवं सामग्री सूची (Detailed Curriculum 2026)
              </span>
              <h3 className={`text-xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                कक्षा {selectedClass} के 5 प्रमुख अध्याय एवं संपूर्ण अध्ययन सामग्री
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                प्रत्येक अध्याय के आगे दिए गए <strong>"📖 अध्याय पढ़ें"</strong> बटन पर क्लिक करके पूरा पाठ पढ़ें।
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>5/5 अध्याय पूर्ण व सत्यापित</span>
            </div>
          </div>

          {/* Chapters Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DETAILED_CURRICULUM_CHAPTERS.map((ch) => (
              <div 
                key={ch.ch} 
                className={`p-5 rounded-3xl transition-all flex flex-col justify-between space-y-4 shadow-sm group ${
                  isLight 
                    ? 'bg-white border-2 border-slate-200 hover:border-indigo-500 text-slate-800 hover:shadow-md' 
                    : 'bg-slate-950 border border-slate-800 hover:border-indigo-500 text-white shadow-lg'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Card Header & Picture Preview */}
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-200 group-hover:border-indigo-500/50">
                    <img 
                      src={ch.bookCoverPic} 
                      alt={ch.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-orange-600 text-white shadow">
                        अध्याय {ch.ch}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-sm">
                        पूर्ण (Verified)
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h4 className="font-black text-sm text-white drop-shadow truncate">
                        {ch.title}
                      </h4>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-2 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-300'}`}>
                    {ch.overview}
                  </p>

                  <div className={`space-y-1 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <strong className="text-amber-600 dark:text-amber-400 block font-sans">प्रमुख संकल्पनाएँ:</strong>
                    <ul className="list-disc list-inside space-y-0.5">
                      {ch.keyConcepts.slice(0, 2).map((kc, idx) => (
                        <li key={idx} className="truncate">{kc}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Direct Read Chapter Button */}
                <div className={`pt-2 border-t flex items-center justify-between gap-2 ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
                  <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    NCERT Book Class {selectedClass}
                  </span>
                  <button
                    onClick={() => setOpenChapterModal(ch)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>📖 अध्याय पढ़ें (Read Chapter)</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL: DEDICATED CHAPTER READING DIALOG BOX
          ========================================================================= */}
      {openChapterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className={`w-full max-w-4xl rounded-3xl shadow-2xl border-2 overflow-hidden flex flex-col max-h-[92vh] ${
            isLight 
              ? 'bg-white border-indigo-300 text-slate-800' 
              : 'bg-slate-900 border-indigo-500/50 text-slate-100'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
              isLight ? 'bg-indigo-50/80 border-indigo-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow">
                  {openChapterModal?.ch}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold tracking-wider">
                    NCERT कक्षा {selectedClass} • सम्पूर्ण अध्याय पाठ्यपुस्तक
                  </span>
                  <h3 className={`font-extrabold text-base sm:text-lg truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {openChapterModal?.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => speakText(`${openChapterModal?.title || ''}. ${openChapterModal?.overview || ''}`, 'hi-IN')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-1 border border-indigo-300"
                  title="अध्याय वाचन सुनें"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">सुनें 🔊</span>
                </button>
                <button
                  onClick={() => setOpenChapterModal(null)}
                  className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Overview & Real Banner */}
              <div className="relative rounded-2xl overflow-hidden h-48 border border-slate-200 shadow">
                <img 
                  src={openChapterModal?.bookCoverPic} 
                  alt={openChapterModal?.title || 'Chapter Cover'}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 flex flex-col justify-end">
                  <h4 className="text-xl font-black text-white">{openChapterModal?.title}</h4>
                  <p className="text-xs text-amber-300 mt-1">{openChapterModal?.subtitle}</p>
                </div>
              </div>

              {/* Lesson Overview */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isLight ? 'bg-indigo-50/50 border-indigo-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <strong className="text-sm font-bold text-indigo-900 dark:text-amber-400 block">पाठ सारांश (Chapter Overview):</strong>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {openChapterModal?.overview}
                </p>
              </div>

              {/* Key Concepts */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                isLight ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <strong className="text-sm font-bold text-emerald-800 dark:text-emerald-400 block">प्रमुख संकल्पनाएँ (Key Concepts):</strong>
                <ul className="space-y-1.5 text-xs">
                  {openChapterModal.keyConcepts.map((kc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{kc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solved Questions & Answers */}
              <div className="space-y-3">
                <strong className={`text-sm font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>हल सहित अभ्यास प्रश्न (Solved Examples):</strong>
                {openChapterModal.solvedExamples.map((ex, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}>
                    <p className="font-bold text-orange-600 dark:text-orange-400">{ex.q}</p>
                    <p className="pl-2 border-l-2 border-emerald-500">{ex.a}</p>
                  </div>
                ))}
              </div>

              {/* Practical Task */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
                <strong className="block text-amber-900 font-bold">दैनिक गृहकार्य व अभ्यास (Practical Task):</strong>
                <p>{openChapterModal.practiceTask}</p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-xs ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <span>NCERT Class {selectedClass} Solved Material 2026</span>
              <button
                onClick={() => setOpenChapterModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold"
              >
                पाठ बंद करें
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: REAL EXAMPLE PICS FOR PAHADA 2 TO 20
          ========================================================================= */}
      {activeTab === 'tables' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 transition-all ${
            isLight 
              ? 'bg-white border-2 border-amber-300 shadow-md text-slate-800' 
              : 'bg-slate-950 border border-slate-800 text-slate-100'
          }`}>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                संपूर्ण पहाड़ा सारणी (Mathematical Tables 2 to 20 with Real Examples)
              </span>
              <h3 className={`text-xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                2 से 20 तक संपूर्ण पहाड़ा सचित्र उदाहरणों के साथ
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                प्रत्येक पहाड़ा वास्तविक जीवन की वस्तुओं (जैसे साइकिल के 2 पहिए, कार के 4 पहिए) से समझें।
              </p>
            </div>

            <button
              onClick={() => {
                const lines = Array.from({ length: 10 }, (_, i) => `${selectedTable} × ${i + 1} = ${selectedTable * (i + 1)}`).join(', ');
                speakText(`${selectedTable} का पहाड़ा: ${lines}`, 'hi-IN');
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-2 shadow-lg"
            >
              <Volume2 className="w-4 h-4" />
              <span>{selectedTable} का पहाड़ा सुनें 🔊</span>
            </button>
          </div>

          {/* Table Selector Buttons (2 to 20) */}
          <div className={`flex flex-wrap items-center gap-1.5 p-3.5 rounded-2xl transition-all ${
            isLight ? 'bg-amber-50/70 border border-amber-200' : 'bg-slate-950 border border-slate-800'
          }`}>
            <span className={`text-xs font-bold mr-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>पहाड़ा चुनें:</span>
            {Array.from({ length: 19 }, (_, i) => i + 2).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTable(t)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                  selectedTable === t
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-105 ring-2 ring-amber-400/50'
                    : isLight 
                      ? 'bg-white text-slate-700 hover:bg-amber-100 hover:text-slate-900 border border-slate-200'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Real Example Visual Banner for the Selected Table */}
          {TABLE_REAL_EXAMPLES[selectedTable] && (
            <div className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${
              isLight 
                ? 'bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-50 border-2 border-amber-300 shadow-xs' 
                : 'bg-gradient-to-r from-amber-950/40 via-slate-950 to-orange-950/40 border-2 border-amber-500/40'
            }`}>
              <span className="text-4xl sm:text-5xl">{TABLE_REAL_EXAMPLES[selectedTable].icon}</span>
              <div>
                <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                  सचित्र वास्तविक उदाहरण (Real Life Example)
                </span>
                <h5 className={`text-sm sm:text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {TABLE_REAL_EXAMPLES[selectedTable].unit}
                </h5>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                  {TABLE_REAL_EXAMPLES[selectedTable].example}
                </p>
              </div>
            </div>
          )}

          {/* Active Table Display */}
          <div className={`p-6 rounded-3xl space-y-6 transition-all ${
            isLight ? 'bg-white border-2 border-amber-200 shadow-md' : 'bg-slate-950 border border-slate-800'
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <h4 className={`text-lg font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>{selectedTable} का सम्पूर्ण पहाड़ा (Table of {selectedTable})</span>
              </h4>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-amber-400'}`}>
                10 चरण (10 Steps)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Array.from({ length: 10 }, (_, i) => {
                const step = i + 1;
                const result = selectedTable * step;
                const hindiSteps = [
                  'एकम', 'दूनी', 'तिया', 'चौके', 'पंचे', 'छक्के', 'सत्ते', 'अट्ठे', 'नवा', 'दहाई'
                ];
                const recitation = `${selectedTable} ${hindiSteps[i]} ${result}`;

                return (
                  <div
                    key={step}
                    onClick={() => speakText(recitation, 'hi-IN')}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] text-center space-y-1 ${
                      isLight 
                        ? 'bg-amber-50/60 border border-amber-200 hover:border-amber-400 hover:bg-amber-100/60 shadow-2xs' 
                        : 'bg-slate-900 border border-slate-800 hover:border-amber-500 text-white'
                    }`}
                  >
                    <span className={`text-[10px] font-mono uppercase block font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      स्टेप {step}
                    </span>
                    <strong className={`text-base font-black block font-mono ${isLight ? 'text-amber-900' : 'text-amber-400'}`}>
                      {selectedTable} × {step} = {result}
                    </strong>
                    <span className={`text-xs font-sans block ${isLight ? 'text-slate-700 font-semibold' : 'text-slate-300'}`}>
                      "{recitation}"
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 3: 1 TO 100 COUNTING WITH REAL EXAMPLE MILESTONE PICS
          ========================================================================= */}
      {activeTab === 'math' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 transition-all ${
            isLight 
              ? 'bg-white border-2 border-emerald-300 shadow-md text-slate-800' 
              : 'bg-slate-950 border border-slate-800 text-slate-100'
          }`}>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                प्रारंभिक संख्या ज्ञान (Numbers 1 to 100 with Real Visual Milestones)
              </span>
              <h3 className={`text-xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                1 से 100 तक सम्पूर्ण गिनती (सचित्र मील के पत्थर एवं उच्चारण)
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                किसी भी संख्या पर क्लिक करके उसका हिंदी उच्चारण सुनें।
              </p>
            </div>

            <div className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
              isLight 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs' 
                : 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
            }`}>
              100 संख्याएँ पूर्ण
            </div>
          </div>

          {/* Real Milestone Cards Bar */}
          <div className={`p-4 rounded-2xl space-y-2 transition-all ${
            isLight ? 'bg-white border-2 border-amber-200 shadow-2xs' : 'bg-slate-950 border border-slate-800'
          }`}>
            <span className={`text-xs font-bold block ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>सचित्र संख्या मील के पत्थर (Visual Milestones):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs">
              {[
                { n: 1, icon: '☀️', t: '1 सूरज' },
                { n: 2, icon: '👀', t: '2 आँखें' },
                { n: 3, icon: '🚦', t: '3 बत्तियाँ' },
                { n: 4, icon: '🪑', t: '4 पाए' },
                { n: 5, icon: '🖐️', t: '5 उंगलियाँ' },
                { n: 6, icon: '🎲', t: '6 पासा' },
                { n: 7, icon: '🌈', t: '7 रंग' },
                { n: 8, icon: '🐙', t: '8 हाथ' },
                { n: 9, icon: '💎', t: '9 रत्न' },
                { n: 10, icon: '👐', t: '10 उंगलियाँ' },
                { n: 20, icon: '🦶', t: '20 कुल' },
                { n: 24, icon: '☸️', t: '24 तीलियाँ' },
                { n: 50, icon: '🏏', t: '50 अर्धशतक' },
                { n: 100, icon: '💯', t: '100 शतक' }
              ].map((m) => (
                <div 
                  key={m.n} 
                  className={`p-2 rounded-xl text-center transition-all ${
                    isLight 
                      ? 'bg-amber-50/70 border border-amber-200 hover:border-amber-400 shadow-2xs' 
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  <span className="text-xl block">{m.icon}</span>
                  <span className={`font-bold block mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{m.n}</span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{m.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full 100 Grid */}
          <div className={`p-6 rounded-3xl transition-all ${
            isLight ? 'bg-white border-2 border-emerald-200 shadow-md' : 'bg-slate-950 border border-slate-800'
          }`}>
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {COUNTING_DATA.map((item) => (
                <button
                  key={item.num}
                  onClick={() => speakText(`${item.num}, ${item.hindi}`, 'hi-IN')}
                  className={`p-2.5 rounded-xl transition-all text-center group ${
                    isLight 
                      ? 'bg-emerald-50/50 border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100/70 shadow-2xs' 
                      : 'bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-base font-black block font-mono ${
                    isLight ? 'text-emerald-900 group-hover:text-emerald-700' : 'text-white group-hover:text-emerald-400'
                  }`}>
                    {item.num}
                  </span>
                  <span className={`text-[11px] block truncate font-medium ${
                    isLight ? 'text-slate-700 group-hover:text-slate-950' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    {item.hindi}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 4: अ से अनार & कविता WITH REAL PICTURE CARDS
          ========================================================================= */}
      {activeTab === 'hindi' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 transition-all ${
            isLight 
              ? 'bg-white border-2 border-rose-300 shadow-md text-slate-800' 
              : 'bg-slate-950 border border-slate-800 text-slate-100'
          }`}>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-rose-700' : 'text-red-400'}`}>
                NCERT हिंदी: रिमझिम व मनोहर पोथी
              </span>
              <h3 className={`text-xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                अ से अनार, स्वर, व्यंजन व सचित्र कविताएं (Real Picture Cards)
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                अक्षर पर क्लिक करके वास्तविक चित्र, उच्चारण एवं तुकबंदी सुनें।
              </p>
            </div>
          </div>

          {/* Varnamala Cards Grid with Real Pictures */}
          <div className={`p-6 rounded-3xl space-y-4 transition-all ${
            isLight ? 'bg-white border-2 border-rose-200 shadow-md' : 'bg-slate-950 border border-slate-800'
          }`}>
            
            <h4 className={`font-black text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span className="text-xl">🍎</span>
              <span>अ से ज्ञ सचित्र वर्णमाला (Click to Listen):</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {HINDI_ALPHABET.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => speakText(`${item.char} से ${item.word}. ${item.example}`, 'hi-IN')}
                  className={`rounded-2xl cursor-pointer transition-all hover:scale-[1.02] text-center overflow-hidden group shadow-2xs ${
                    isLight 
                      ? 'bg-white border-2 border-rose-200 hover:border-rose-500 hover:shadow-md' 
                      : 'bg-slate-900 border border-slate-800 hover:border-red-500'
                  }`}
                >
                  <div className="h-24 overflow-hidden relative">
                    <img 
                      src={item.realPic} 
                      alt={item.word} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-lg backdrop-blur-sm flex items-center justify-center font-black text-sm shadow-xs ${
                      isLight ? 'bg-white/95 text-rose-700 border border-rose-300' : 'bg-slate-950/80 text-amber-400'
                    }`}>
                      {item.char}
                    </div>
                  </div>
                  <div className={`p-2 space-y-0.5 ${isLight ? 'bg-rose-50/40' : ''}`}>
                    <strong className={`text-xs font-black block ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.word}</strong>
                    <span className={`text-[10px] block font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>({item.eng})</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}
      {/* =========================================================================
          SECTION 5: A FOR APPLE & POEMS WITH REAL PICTURE CARDS
          ========================================================================= */}
      {activeTab === 'english' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 transition-all ${
            isLight 
              ? 'bg-white border-2 border-sky-300 shadow-md text-slate-800' 
              : 'bg-slate-950 border border-slate-800 text-slate-100'
          }`}>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-sky-700' : 'text-blue-400'}`}>
                NCERT English: Marigold & Phonics
              </span>
              <h3 className={`text-xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                A for Apple to Z for Zebra with Real Picture Cards
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                26 Letters with sound, spelling, Hindi meaning and sentence example.
              </p>
            </div>
          </div>

          <div className={`p-6 rounded-3xl space-y-4 transition-all ${
            isLight ? 'bg-white border-2 border-sky-200 shadow-md' : 'bg-slate-950 border border-slate-800'
          }`}>
            
            <h4 className={`font-black text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span className="text-xl">🔤</span>
              <span>A to Z Visual Flashcards (Click to Listen Pronunciation):</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {ENGLISH_ALPHABET.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => speakText(`${item.letter} is for ${item.word}. ${item.sentence}`, 'en-US')}
                  className={`rounded-2xl cursor-pointer transition-all hover:scale-[1.02] text-center overflow-hidden group shadow-2xs ${
                    isLight 
                      ? 'bg-white border-2 border-sky-200 hover:border-sky-500 hover:shadow-md' 
                      : 'bg-slate-900 border border-slate-800 hover:border-blue-500'
                  }`}
                >
                  <div className="h-24 overflow-hidden relative">
                    <img 
                      src={item.realPic} 
                      alt={item.word} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg backdrop-blur-sm font-black text-xs shadow-xs ${
                      isLight ? 'bg-white/95 text-sky-800 border border-sky-300' : 'bg-slate-950/80 text-blue-400'
                    }`}>
                      {item.letter} {item.small}
                    </div>
                  </div>
                  <div className={`p-2 space-y-0.5 ${isLight ? 'bg-sky-50/40' : ''}`}>
                    <strong className={`text-xs font-black block ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.word}</strong>
                    <span className={`text-[10px] block font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>({item.hindi})</span>
                    <span className={`text-[9px] font-mono block ${isLight ? 'text-amber-700 font-bold' : 'text-amber-400'}`}>{item.phonics}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 6: INTERACTIVE MATH LAB (➕➖✖️➗ जोड़, घटाव, गुणा, भाग)
          ========================================================================= */}
      {activeTab === 'operations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 transition-all ${
            isLight 
              ? 'bg-white border-2 border-orange-300 shadow-md text-slate-800' 
              : 'bg-slate-950 border border-slate-800 text-slate-100'
          }`}>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-orange-700' : 'text-orange-400'}`}>
                NCERT प्राथमिक गणित प्रयोगशाला (Math Lab)
              </span>
              <h3 className={`text-xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                सचित्र जोड़ (Addition), घटाव (Subtraction), गुणा (Multiplication) व भाग (Division)
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                कक्षा {selectedClass} के विद्यार्थियों के लिए सचित्र अभ्यास एवं त्वरित क्विज़ सॉल्वर।
              </p>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
              isLight ? 'bg-amber-50 border-amber-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
            }`}>
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>स्कोर (Score)</span>
                <span className={`text-base font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{score} अंक</span>
              </div>
            </div>
          </div>

          {/* Operation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'zod', label: '1. जोड़ (Addition)', icon: '➕', desc: 'सचित्र जोड़ व हासिल के सवाल' },
              { id: 'ghatao', label: '2. घटाव (Subtraction)', icon: '➖', desc: 'काटकर घटाना व उधार के सवाल' },
              { id: 'guna', label: '3. गुणा (Multiplication)', icon: '✖️', desc: 'बार-बार जोड़ना व गुणनफल' },
              { id: 'bhag', label: '4. भाग (Division)', icon: '➗', desc: 'बराबर बाँटना व भागफल' },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => {
                  const m = op.id as any;
                  setMathMode(m);
                  generateNewProblem(m);
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  mathMode === op.id
                    ? isLight
                      ? 'bg-orange-100 border-orange-500 ring-2 ring-orange-400 shadow-md'
                      : 'bg-slate-900 border-orange-500 ring-2 ring-orange-500/30 shadow-xl'
                    : isLight
                      ? 'bg-white border-slate-200 hover:border-orange-300 shadow-2xs'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl block mb-1">{op.icon}</span>
                <strong className={`text-sm font-black block ${isLight ? 'text-slate-900' : 'text-white'}`}>{op.label}</strong>
                <span className={`text-[11px] block mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{op.desc}</span>
              </button>
            ))}
          </div>

          {/* Practice Workbox */}
          <div className={`p-6 rounded-3xl space-y-6 transition-all ${
            isLight ? 'bg-white border-2 border-orange-200 shadow-md' : 'bg-slate-950 border border-slate-800'
          }`}>
            
            <div className={`p-5 rounded-2xl text-center space-y-4 border ${
              isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-900 border-slate-800'
            }`}>
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                isLight ? 'bg-orange-100 text-orange-900 border-orange-300' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
              }`}>
                {mathMode === 'zod' && 'सचित्र जोड़: दोनों समूहों को गिनकर जोड़ें'}
                {mathMode === 'ghatao' && 'सचित्र घटाव: कुल में से कटे हुए भाग को घटाएँ'}
                {mathMode === 'guna' && 'सचित्र गुणा: बराबर समूहों का गुणनफल निकालें'}
                {mathMode === 'bhag' && 'सचित्र भाग: कुल को बराबर समूहों में बाँटें'}
              </span>

              {/* Graphical Visualizer */}
              <div className={`flex flex-wrap items-center justify-center gap-3 text-2xl sm:text-3xl py-3 font-mono rounded-2xl border ${
                isLight ? 'bg-white border-amber-200 shadow-inner' : 'bg-slate-950 border border-slate-800'
              }`}>
                {mathMode === 'zod' && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-amber-100/70 border-amber-300' : 'bg-slate-900 border-slate-800'}`}>
                      <span className={`font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>{val1}</span>
                      <span className="text-lg">🍎</span>
                    </div>
                    <span className="text-orange-500 font-black">+</span>
                    <div className={`p-2 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-amber-100/70 border-amber-300' : 'bg-slate-900 border-slate-800'}`}>
                      <span className={`font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>{val2}</span>
                      <span className="text-lg">🍎</span>
                    </div>
                    <span className="text-orange-500 font-black">=</span>
                    <span className={`font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>?</span>
                  </div>
                )}

                {mathMode === 'ghatao' && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-blue-100/70 border-blue-300' : 'bg-slate-900 border-slate-800'}`}>
                      <span className={`font-black ${isLight ? 'text-blue-800' : 'text-blue-400'}`}>{val1}</span>
                      <span className="text-lg">🎈</span>
                    </div>
                    <span className="text-blue-500 font-black">-</span>
                    <div className={`p-2 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-blue-100/70 border-blue-300' : 'bg-slate-900 border-slate-800'}`}>
                      <span className={`font-black ${isLight ? 'text-blue-800' : 'text-blue-400'}`}>{val2}</span>
                      <span className="text-lg">🎈</span>
                    </div>
                    <span className="text-blue-500 font-black">=</span>
                    <span className={`font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>?</span>
                  </div>
                )}

                {mathMode === 'guna' && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-amber-100/70 border-amber-300' : 'bg-slate-900 border-slate-800'}`}>
                      <span className={`font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>{val1}</span>
                      <span className={`text-xs font-sans ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>समूह</span>
                    </div>
                    <span className="text-amber-500 font-black">×</span>
                    <div className={`p-2 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-amber-100/70 border-amber-300' : 'bg-slate-900 border-slate-800'}`}>
                      <span className={`font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>{val2}</span>
                      <span className={`text-xs font-sans ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>प्रत्येक में</span>
                    </div>
                    <span className="text-amber-500 font-black">=</span>
                    <span className={`font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>?</span>
                  </div>
                )}

                {mathMode === 'bhag' && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-rose-100/70 border-rose-300' : 'bg-slate-900 border-slate-800'}`}>
                      <span className={`font-black ${isLight ? 'text-rose-800' : 'text-rose-400'}`}>{val1}</span>
                      <span className={`text-xs font-sans ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>कुल वस्तुएँ</span>
                    </div>
                    <span className="text-rose-500 font-black">÷</span>
                    <div className={`p-2 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-rose-100/70 border-rose-300' : 'bg-slate-900 border-slate-800'}`}>
                      <span className={`font-black ${isLight ? 'text-rose-800' : 'text-rose-400'}`}>{val2}</span>
                      <span className={`text-xs font-sans ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>बराबर समूह</span>
                    </div>
                    <span className="text-rose-500 font-black">=</span>
                    <span className={`font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>?</span>
                  </div>
                )}
              </div>

              {/* Form Input for Answer */}
              <form onSubmit={handleCheckAnswer} className="max-w-xs mx-auto space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="अपना उत्तर लिखें..."
                    className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-center text-lg font-black focus:outline-none ${
                      isLight 
                        ? 'bg-white border-amber-300 text-slate-900 focus:border-amber-600 shadow-inner' 
                        : 'bg-slate-950 border-slate-700 text-white focus:border-orange-500'
                    }`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm shadow-lg transition-transform active:scale-95"
                  >
                    जांचें
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => generateNewProblem(mathMode)}
                    className={`text-xs flex items-center gap-1 underline font-bold ${
                      isLight ? 'text-amber-800 hover:text-amber-950' : 'text-slate-400 hover:text-orange-400'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>नया प्रश्न लाएँ (Next Question)</span>
                  </button>
                </div>
              </form>

              {/* Feedback toast */}
              {feedback && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                  feedback.isCorrect 
                    ? isLight
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-900 animate-bounce'
                      : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 animate-bounce' 
                    : isLight
                      ? 'bg-rose-100 border border-rose-300 text-rose-900'
                      : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                }`}>
                  {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                  <span>{feedback.msg}</span>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 7: PAGE-BY-PAGE BOOK DIALOG BOX READER
          ========================================================================= */}
      {activeTab === 'book' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 transition-all ${
            isLight 
              ? 'bg-white border-2 border-purple-300 shadow-md text-slate-800' 
              : 'bg-slate-950 border border-slate-800 text-slate-100'
          }`}>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
                डिजिटल ई-बुक रीडर (Interactive Study Book)
              </span>
              <h3 className={`text-xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                NCERT कक्षा {selectedClass}: सम्पूर्ण सचित्र पाठ्यपुस्तक
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                पेज पलटें, ऑडियो सुनें और अभ्यास कार्य पूरे करें।
              </p>
            </div>

            {/* Pagination Controls */}
            <div className={`flex items-center gap-2 p-1.5 rounded-2xl border transition-all ${
              isLight ? 'bg-purple-50 border-purple-200' : 'bg-slate-900 border border-slate-800'
            }`}>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={`p-2 rounded-xl disabled:opacity-40 transition-all ${
                  isLight ? 'bg-white hover:bg-purple-100 text-purple-900 shadow-2xs border border-purple-200' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className={`px-3 text-xs font-mono font-black ${isLight ? 'text-purple-900' : 'text-amber-400'}`}>
                पेज {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={`p-2 rounded-xl disabled:opacity-40 transition-all ${
                  isLight ? 'bg-white hover:bg-purple-100 text-purple-900 shadow-2xs border border-purple-200' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Book Page Content Canvas */}
          <div className={`p-8 rounded-3xl shadow-2xl relative min-h-[420px] flex flex-col justify-between transition-all ${
            isLight 
              ? 'bg-white border-2 border-purple-200 text-slate-800' 
              : 'bg-slate-950 border-2 border-slate-800 text-slate-100'
          }`}>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <span className={`text-xs font-mono font-bold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
                  NCERT BOOK CLASS {selectedClass} • LESSON PAGE #{currentPage}
                </span>
                <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  विषय: {currentPage % 2 === 0 ? 'गणित का जादू' : 'रिमझिम हिंदी'}
                </span>
              </div>

              {/* Dynamic Page Content Based on Page Number */}
              {currentPage === 1 && (
                <div className="space-y-4 text-center py-6">
                  <span className="text-6xl block mb-2">📚</span>
                  <h4 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    कक्षा {selectedClass} NCERT डिजिटल पाठ्यपुस्तक प्रवेश द्वार
                  </h4>
                  <p className={`text-sm max-w-lg mx-auto ${isLight ? 'text-slate-600 font-medium' : 'text-slate-300'}`}>
                    राष्ट्रीय शैक्षिक अनुसंधान और प्रशिक्षण परिषद (NCERT) के नवीन पाठ्यक्रम पर आधारित सम्पूर्ण ई-पुस्तिका।
                  </p>
                  <div className={`p-4 rounded-2xl border max-w-md mx-auto text-xs space-y-1 font-semibold ${
                    isLight ? 'bg-purple-50/70 border-purple-200 text-purple-950 shadow-2xs' : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <div>✓ हिंदी (रिमझिम भाग {selectedClass})</div>
                    <div>✓ गणित (गणित का जादू भाग {selectedClass})</div>
                    <div>✓ अंग्रेजी (Marigold Book {selectedClass})</div>
                    <div>✓ पर्यावरण अध्ययन (Looking Around EVS)</div>
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-4">
                  <h4 className={`text-lg font-black ${isLight ? 'text-purple-900' : 'text-amber-400'}`}>
                    अध्याय 1: आकृतियाँ और स्थान (Shapes & Space)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className={`p-4 rounded-xl border text-center space-y-2 ${
                      isLight ? 'bg-amber-50/60 border-amber-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <span className="text-3xl block">⭕</span>
                      <strong className={`block font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>वृत्त (Circle)</strong>
                      <p className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>सिक्का, पहिया, चूड़ी, रोटी</p>
                    </div>
                    <div className={`p-4 rounded-xl border text-center space-y-2 ${
                      isLight ? 'bg-amber-50/60 border-amber-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <span className="text-3xl block">🔺</span>
                      <strong className={`block font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>त्रिभुज (Triangle)</strong>
                      <p className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>समोसा, पराठा, ट्रैफ़िक साइन</p>
                    </div>
                    <div className={`p-4 rounded-xl border text-center space-y-2 ${
                      isLight ? 'bg-amber-50/60 border-amber-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <span className="text-3xl block">🟦</span>
                      <strong className={`block font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>चौकोर (Square/Rectangle)</strong>
                      <p className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>किताब, ब्लैकबोर्ड, ईंट</p>
                    </div>
                  </div>
                </div>
              )}

              {currentPage > 2 && (
                <div className="space-y-4">
                  <h4 className={`text-lg font-black ${isLight ? 'text-purple-900' : 'text-amber-400'}`}>
                    अध्याय {currentPage - 1}: सचित्र अभ्यास व पाठ व्याख्या
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                    यह पृष्ठ NCERT के निर्धारित पाठ्यक्रम के अनुसार तैयार किया गया है। इसमें विद्यार्थी के मानसिक विकास, भाषाई दक्षता और संख्यात्मक कौशल के लिए अभ्यास दिए गए हैं।
                  </p>
                  <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    isLight ? 'bg-purple-50/70 border-purple-200 text-slate-800 shadow-2xs' : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <strong className={`block font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>दैनिक अभ्यास प्रश्न:</strong>
                    <p>1. अपने घर में गोल और चौकोर 3-3 वस्तुओं के नाम लिखें।</p>
                    <p>2. 5 से 10 तक उल्टी गिनती लिखें और ज़ोर से पढ़ें।</p>
                    <p>3. अपने प्रिय मित्र या माता-पिता पर दो वाक्य बोलें।</p>
                  </div>
                </div>
              )}

            </div>

            {/* Page Footer */}
            <div className={`flex items-center justify-between border-t pt-4 text-xs ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
              <span className="font-semibold">IOIS Digital Interactive NCERT Book</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className={`px-3 py-1.5 rounded-lg border disabled:opacity-40 font-bold transition-all ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  ← पिछला पेज
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-black shadow-xs disabled:opacity-40 transition-all"
                >
                  अगला पेज →
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 8: BAL VIKAS PRINTABLE KIT & PAGE PICTURES GALLERY
          ========================================================================= */}
      {activeTab === 'download' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Toast */}
          {suiteToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 font-bold text-xs sm:text-sm animate-in fade-in slide-in-from-bottom duration-300">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span>{suiteToast}</span>
            </div>
          )}

          {/* Master Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl space-y-4 transition-all ${
            isLight 
              ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-white border-orange-300' 
              : 'bg-gradient-to-br from-amber-950/60 via-slate-950 to-orange-950/40 border-orange-500/40'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500 text-white uppercase tracking-wider shadow-xs">
                    NCERT बाल विकास सम्पूर्ण 500+ पेज किट
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    ✓ A4 प्रिंट रेडी (300 DPI)
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    कक्षा 1 से 5 (Class {selectedClass})
                  </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  सचित्र प्रिंटेबल वर्कशीट्स, चार्ट्स व आधिकारिक पूर्णता प्रमाण पत्र
                </h3>
                <p className={`text-xs max-w-2xl leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                  प्रत्येक पेज वास्तविक शैक्षणिक चित्रों के साथ तैयार किया गया है। आप किसी भी पेज को बड़ा ज़ूम करके देख सकते हैं, अलग से प्रिंट कर सकते हैं या डाउनलोड कर सकते हैं।
                </p>
              </div>

              <div className={`p-4 rounded-2xl border text-center shrink-0 space-y-1 ${
                isLight ? 'bg-white border-orange-200 shadow-md' : 'bg-slate-900 border-slate-800'
              }`}>
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>किट साइज</span>
                <div className="text-2xl font-black text-amber-600 font-mono">48.2 MB</div>
                <span className={`text-[10px] font-bold block ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>100% लाइफटाइम ऑफलाइन</span>
              </div>
            </div>
          </div>

          {/* Important Updates */}
          <div className={`p-5 rounded-3xl border space-y-3 transition-all ${
            isLight ? 'bg-white border-2 border-amber-200 shadow-md' : 'bg-slate-950 border border-slate-800'
          }`}>
            <h4 className={`text-sm font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Zap className="w-4 h-4 text-amber-500" />
              <span>बाल विकास किट - महत्वपूर्ण अपडेट्स 2026 (Important Features):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className={`p-3.5 rounded-2xl border space-y-1 ${isLight ? 'bg-amber-50/70 border-amber-200 shadow-2xs' : 'bg-slate-900 border-slate-800'}`}>
                <strong className={`block font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>1. NEP 2020 & NCF-FS</strong>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>3 से 8 वर्ष के बच्चों की प्रारंभिक बाल्यावस्था देखभाल एवं शिक्षा के अनुकूल।</p>
              </div>
              <div className={`p-3.5 rounded-2xl border space-y-1 ${isLight ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs' : 'bg-slate-900 border-slate-800'}`}>
                <strong className={`block font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>2. A4 होम प्रिंटिंग</strong>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>किसी भी घरेलू अथवा साइबर कैफे प्रिंटर से ब्लैक & व्हाइट या कलर प्रिंट योग्य।</p>
              </div>
              <div className={`p-3.5 rounded-2xl border space-y-1 ${isLight ? 'bg-blue-50/70 border-blue-200 shadow-2xs' : 'bg-slate-900 border-slate-800'}`}>
                <strong className={`block font-bold ${isLight ? 'text-blue-800' : 'text-blue-400'}`}>3. 100% ऑफलाइन</strong>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>एक बार सेव करें, बिना इंटरनेट आजीवन अपने फोन या लैपटॉप पर चलाएं।</p>
              </div>
              <div className={`p-3.5 rounded-2xl border space-y-1 ${isLight ? 'bg-orange-50/70 border-orange-200 shadow-2xs' : 'bg-slate-900 border-slate-800'}`}>
                <strong className={`block font-bold ${isLight ? 'text-orange-800' : 'text-orange-400'}`}>4. 70% पेआउट इंसेंटिव</strong>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>₹10 की योजना में प्रति रेफरल ₹7.00 का त्वरित बैंक पेआउट अधिकृत।</p>
              </div>
            </div>
          </div>

          {/* Printable Page Gallery Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BAL_VIKAS_PRINTABLE_PAGES.map((page) => (
              <div
                key={page.id}
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between group transition-all ${
                  isLight 
                    ? 'bg-white border-slate-200 hover:border-orange-400 shadow-sm hover:shadow-lg' 
                    : 'bg-slate-950 border border-slate-800 hover:border-orange-500/60'
                }`}
              >
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={page.image}
                    alt={page.titleHindi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {page.badge}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => setEnlargedPrintPage(page)}
                      className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-orange-600 text-white backdrop-blur-md transition-colors"
                      title="बड़ा पेज देखें"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <span className="text-[10px] font-mono uppercase text-orange-400 font-bold block">
                      {page.category}
                    </span>
                    <h5 className="text-sm font-black text-white truncate">
                      {page.titleHindi}
                    </h5>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className={`text-xs line-clamp-2 leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {page.description}
                  </p>

                  <div className={`pt-2 border-t flex items-center gap-1.5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <button
                      onClick={() => setEnlargedPrintPage(page)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 border ${
                        isLight 
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200' 
                          : 'bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white border-slate-800'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>बड़ा देखें</span>
                    </button>
                    <button
                      onClick={() => handlePrintPageDoc(page)}
                      className={`p-1.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                        isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                      }`}
                      title="यह पेज प्रिंट करें"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDownloadPageFile(page)}
                      className="p-1.5 px-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs"
                      title="फाइल डाउनलोड करें"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Enlarged Page */}
          {enlargedPrintPage && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <div className={`border-2 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
              }`}>
                <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
                  isLight ? 'bg-amber-50/80 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-wider block">
                      पेज #{enlargedPrintPage.pageNum} • {enlargedPrintPage.category}
                    </span>
                    <h4 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {enlargedPrintPage.titleHindi}
                    </h4>
                  </div>
                  <button
                    onClick={() => setEnlargedPrintPage(null)}
                    className={`p-2 rounded-xl transition-colors ${
                      isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                  <div className="relative rounded-2xl overflow-hidden h-44 sm:h-52 border border-slate-300 shadow">
                    <img
                      src={enlargedPrintPage.image}
                      alt={enlargedPrintPage.titleHindi}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-4 flex flex-col justify-end">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white w-max mb-1">
                        {enlargedPrintPage.badge}
                      </span>
                      <h5 className="text-base font-black text-white">{enlargedPrintPage.titleEnglish}</h5>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border border-dashed grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-700 text-slate-300'
                  }`}>
                    <div><strong className={isLight ? 'text-slate-900' : 'text-slate-400'}>विद्यार्थी:</strong> ________________</div>
                    <div><strong className={isLight ? 'text-slate-900' : 'text-slate-400'}>कक्षा:</strong> {selectedClass}</div>
                    <div><strong className={isLight ? 'text-slate-900' : 'text-slate-400'}>दिनांक:</strong> ________</div>
                    <div><strong className="text-emerald-600">प्राप्तांक:</strong> ___/20</div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 space-y-2">
                    <strong className="font-bold block text-amber-300">📋 दैनिक अभ्यास निर्देश एवं कार्य:</strong>
                    <ul className="space-y-1">
                      {enlargedPrintPage.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {enlargedPrintPage.textContent}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400 font-bold hidden sm:inline">IOIS Bal Vikas Printable Kit</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintPageDoc(enlargedPrintPage)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow"
                    >
                      <Printer className="w-4 h-4" />
                      <span>यह शीट प्रिंट करें</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPageFile(enlargedPrintPage)}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-4 h-4" />
                      <span>फाइल डाउनलोड करें</span>
                    </button>
                    <button
                      onClick={() => setEnlargedPrintPage(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                    >
                      बंद करें
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          SECTION 9: IOIS NURSERY ALPHABET SERIES (A TO Z WORKBOOK)
          ========================================================================= */}
      {activeTab === 'workbook' && (
        <div className="bg-slate-100 rounded-3xl p-3 sm:p-6 text-slate-900 border border-slate-300 shadow-2xl animate-in fade-in duration-200">
          <NurseryAlphabetWorkbook onClose={() => setActiveTab('chapters')} />
        </div>
      )}

    </div>
  );
};
