import React, { useState } from 'react';
import { StudyWorkContentItem, MemberProfile, PlanDetail } from '../types';
import { canUserAccessPlanKit } from '../services/userService';
import { NCERTFullStudySuite } from './NCERTFullStudySuite';
import { Plan02YouthSuite } from './planStudySuites/Plan02YouthSuite';
import { Plan03CareerSuite } from './planStudySuites/Plan03CareerSuite';
import { Plan04FamilySuite } from './planStudySuites/Plan04FamilySuite';
import { Plan05EliteSuite } from './planStudySuites/Plan05EliteSuite';
import { Plan06AgencySuite } from './planStudySuites/Plan06AgencySuite';
import { Plan07MasterSuite } from './planStudySuites/Plan07MasterSuite';
import { CompetitionReadyPracticeZone } from './CompetitionReadyPracticeZone';
import { 
  X, 
  Download, 
  Printer, 
  Check, 
  FileText, 
  BookOpen, 
  Sparkles, 
  Copy, 
  Share2, 
  Layers, 
  CheckCircle2, 
  Bookmark, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  GraduationCap,
  Briefcase,
  Laptop,
  CheckCircle,
  FileCheck,
  TrendingUp,
  Award,
  Users,
  Crown,
  Maximize2,
  ShieldCheck,
  Zap,
  Flame,
  Target,
  Image as ImageIcon
} from 'lucide-react';

export interface BalVikasPrintablePage {
  id: string;
  pageNum: number;
  titleHindi: string;
  titleEnglish: string;
  category: string;
  badge: string;
  image: string;
  description: string;
  highlights: string[];
  tasks: string[];
  textContent: string;
}

export const BAL_VIKAS_PRINTABLE_PAGES: BalVikasPrintablePage[] = [
  {
    id: 'bv-p1',
    pageNum: 1,
    titleHindi: 'पेज 01: अ से ज्ञ सचित्र वर्णमाला चार्ट',
    titleEnglish: 'Hindi Varnamala & Phonics Master Chart',
    category: 'हिंदी भाषा एवं सुलेख',
    badge: 'A4 Printable HD',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    description: '13 स्वर (अ से अः), 36 व्यंजन (क से ज्ञ) और संयुक्त अक्षर सचित्र उदाहरणों, तुकबंदी व 4-लाइन सुलेख गाइड के साथ।',
    highlights: [
      '13 स्वर (अ से अः) सचित्र उच्चारण व तुकबंदी',
      'क से ज्ञ तक 36 व्यंजन एवं संयुक्त व्यंजन (क्ष, त्र, ज्ञ)',
      'प्रत्येक अक्षर का वास्तविक वस्तु चित्र व शब्द-ज्ञान'
    ],
    tasks: [
      '1. सभी 13 स्वरों को बोलकर सुंदर लिखावट में लिखें।',
      '2. क, ख, ग, घ, ङ से शुरू होने वाले 2-2 नए शब्द अपनी कॉपी में बनाएं।',
      '3. "अ से अनार" से लेकर "ज्ञ से ज्ञानी" तक लयबद्ध रूप से याद करें।'
    ],
    textContent: `[IOIS BAL VIKAS KIT • PAGE 01]
अ से ज्ञ सचित्र वर्णमाला चार्ट (HINDI ALPHABET CHART)

स्वर (13 Vowels):
अ से अनार (🍎), आ से आम (🥭), इ से इमली (🫒), ई से ईख (🎋)
उ से उल्लू (🦉), ऊ से ऊन (🧶), ऋ से ऋषि (🧘), ए से एड़ी (🦶)
ऐ से ऐनक (👓), ओ से ओखली (🥣), औ से औरत (👩), अं से अंगूर (🍇), अः से खाली (✨)

व्यंजन (Consonants):
क-कबूतर, ख-खरगोश, ग-गमला, घ-घड़ी, ङ-खाली
च-चम्मच, छ-छाता, ज-जहाज, झ-झंडा, ञ-खाली
ट-टमाटर, ठ-ठठेरा, ड-डमरू, ढ-ढक्कन, ण-खाली
त-तरबूज, थ-थर्मस, द-दवात, ध-धनुष, न-नल
प-पतंग, फ-फल, ब-बकरी, भ-भालू, म-मछली
य-यज्ञ, र-रथ, ल-लट्टू, व-वक
श-शलजम, ष-षट्कोण, स-सेब, ह-हाथी
संयुक्त: क्ष-क्षत्रिय, त्र-त्रिशूल, ज्ञ-ज्ञानी`
  },
  {
    id: 'bv-p2',
    pageNum: 2,
    titleHindi: 'पेज 02: A to Z Phonics & Sight Words Chart',
    titleEnglish: 'English Alphabet & Phonics Flashcards',
    category: 'English Language & Phonics',
    badge: 'Phonics Certified',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    description: '26 English Letters (Capital & Small), IPA Phonics Pronunciation, Hindi Meanings & Common Sight Words.',
    highlights: [
      'A to Z Flashcards with Phonics Sound (/æ/, /b/, /k/...)',
      'Capital & Small letter pairing (Aa, Bb, Cc...)',
      'High-frequency sight words for early reading fluency'
    ],
    tasks: [
      '1. Read each letter aloud with its proper phonetic sound.',
      '2. Practice writing 3-letter CVC words (CAT, DOG, SUN, PIN, PEN).',
      '3. Trace capital and small letters on 4-line notebook paper.'
    ],
    textContent: `[IOIS BAL VIKAS KIT • PAGE 02]
A TO Z PHONICS & SIGHT WORDS CHART

Aa - Apple (/æ/ - ऐ) | Bb - Ball (/b/ - ब) | Cc - Cat (/k/ - क)
Dd - Dog (/d/ - ड) | Ee - Elephant (/e/ - ए) | Ff - Fish (/f/ - फ)
Gg - Grapes (/g/ - ग) | Hh - Horse (/h/ - ह) | Ii - Ice-cream (/aɪ/ - आइ)
Jj - Joker (/dʒ/ - ज) | Kk - Kite (/k/ - क) | Ll - Lion (/l/ - ल)
Mm - Mango (/m/ - म) | Nn - Nest (/n/ - न) | Oo - Owl (/ɒ/ - ऑ)
Pp - Parrot (/p/ - प) | Qq - Queen (/kw/ - क्व) | Rr - Rainbow (/r/ - र)
Ss - Sun (/s/ - स) | Tt - Tiger (/t/ - ट) | Uu - Umbrella (/ʌ/ - अ)
Vv - Van (/v/ - व) | Ww - Watch (/w/ - व) | Xx - Xylophone (/z/ - ज़)
Yy - Yak (/j/ - य) | Zz - Zebra (/z/ - ज़)

Sight Words: The, And, Is, In, You, That, It, He, Was, For, On, Are`
  },
  {
    id: 'bv-p3',
    pageNum: 3,
    titleHindi: 'पेज 03: 2 से 20 सचित्र पहाड़ा मास्टर चार्ट',
    titleEnglish: 'Multiplication Tables 2 to 20 with Real Examples',
    category: 'प्रारंभिक गणित',
    badge: 'Real Example Chart',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    description: '2 से 20 तक संपूर्ण पहाड़ा सारणी साइकिल के पहिए, ऑटो, हाथ की उंगलियों जैसे वास्तविक उदाहरणों के साथ।',
    highlights: [
      '2 से 20 तक का पहाड़ा हिंदी व अंग्रेजी उच्चारण में',
      'वास्तविक वस्तुओं द्वारा पहाड़ा सीखने की सचित्र तकनीक',
      'उंगलियों पर 9 का पहाड़ा निकालने की सीक्रेट जादुई ट्रिक'
    ],
    tasks: [
      '1. 2 से 10 तक के पहाड़े याद करके बिना देखे सुनाएं।',
      '2. 12 × 4 और 15 × 5 का मान मौखिक रूप से निकालें।',
      '3. गुणन सारणी की सहायता से 10 प्रश्नों को हल करें।'
    ],
    textContent: `[IOIS BAL VIKAS KIT • PAGE 03]
2 से 20 तक सम्पूर्ण पहाड़ा मास्टर चार्ट (TABLES 2 TO 20)

सचित्र उदाहरण:
• 2 का पहाड़ा: साइकिल के 2 पहिए (5 साइकिल = 2 × 5 = 10 पहिए)
• 3 का पहाड़ा: ऑटो-रिक्शा के 3 पहिए (4 ऑटो = 3 × 4 = 12 पहिए)
• 4 का पहाड़ा: कार के 4 पहिए (3 कार = 4 × 3 = 12 पहिए)
• 5 का पहाड़ा: हाथ की 5 उंगलियाँ (4 हाथ = 5 × 4 = 20 उंगलियाँ)
• 10 का पहाड़ा: ₹10 के सिक्के (5 सिक्के = 10 × 5 = ₹50)

पहाड़ा सारणी:
2×1=2, 2×2=4, 2×3=6 ... 2×10=20
5×1=5, 5×2=10, 5×3=15 ... 5×10=50
9×1=9, 9×2=18, 9×3=27 ... 9×10=90
12×1=12, 12×2=24, 12×3=36 ... 12×10=120
20×1=20, 20×2=40, 20×3=60 ... 20×10=200`
  },
  {
    id: 'bv-p4',
    pageNum: 4,
    titleHindi: 'पेज 04: 1 से 100 गिनती व स्थानीय मान चार्ट',
    titleEnglish: 'Counting 1 to 100 & Place Value Grid',
    category: 'संख्या बोध व स्थानीय मान',
    badge: '10x10 Grid Sheet',
    image: 'https://images.unsplash.com/photo-1587691592099-24045742c181?auto=format&fit=crop&w=800&q=80',
    description: '1 से 100 तक संख्याओं की पहचान, हिंदी शब्द, स्थानीय मान (इकाई-दहाई) और 100-ग्रिड अभ्यास।',
    highlights: [
      '1 से 100 तक अंक एवं हिंदी शब्द (एक से सौ तक)',
      'इकाई व दहाई का स्पष्ट स्थानीय मान विभाजन',
      'उल्टी गिनती (100 से 1) व सम-विषम संख्या पहचान'
    ],
    tasks: [
      '1. 1 से 50 तक सभी सम संख्याएं (Even Numbers) लिखें।',
      '2. 100 से 1 तक उल्टी गिनती मौखिक बोलें।',
      '3. संख्या 74 में इकाई और दहाई का अंक बताएं (4 इकाई, 7 दहाई)।'
    ],
    textContent: `[IOIS BAL VIKAS KIT • PAGE 04]
1 से 100 सम्पूर्ण गिनती व स्थानीय मान चार्ट

1 = एक | 2 = दो | 3 = तीन | 4 = चार | 5 = पाँच
6 = छह | 7 = सात | 8 = आठ | 9 = नौ | 10 = दस
11 = ग्यारह | 12 = बारह | 13 = तेरह | 14 = चौदह | 15 = पंद्रह
20 = बीस | 30 = तीस | 40 = चालीस | 50 = पचास
60 = साठ | 70 = सत्तर | 80 = अस्सी | 90 = नब्बे | 100 = सौ

स्थानीय मान नियम:
संख्या 48 = 4 दहाई (40) + 8 इकाई (8)
संख्या 95 = 9 दहाई (90) + 5 इकाई (5)`
  },
  {
    id: 'bv-p5',
    pageNum: 5,
    titleHindi: 'पेज 05: सचित्र जोड़ (+) व घटाव (-) एक्टिविटी वर्कशीट',
    titleEnglish: 'Interactive Math Addition & Subtraction Worksheet',
    category: 'सचित्र अभ्यास व वर्कशीट्स',
    badge: 'Activity Sheet',
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
    description: 'फलों, गुब्बारों और खिलौनों के सचित्र समूह गिनकर जोड़ने व काटकर घटाने की 20 अभ्यास समस्याएं।',
    highlights: [
      'सचित्र जोड़: समूहों को मिलाकर कुल योग निकालना',
      'सचित्र घटाव: कुल में से कटे हुए भाग को घटाना',
      'दैनिक जीवन के व्यावहारिक गणितीय शब्द-समस्या प्रश्न'
    ],
    tasks: [
      '1. 🍎🍎🍎🍎 + 🍎🍎🍎 = _______ (7 सेब)',
      '2. 🎈🎈🎈🎈🎈🎈🎈🎈 - 🎈🎈🎈 = _______ (5 गुब्बारे)',
      '3. एक टोकरी में 8 आम थे, 3 आम खा लिए। कितने आम बचे?'
    ],
    textContent: `[IOIS BAL VIKAS KIT • PAGE 05]
सचित्र जोड़ व घटाव एक्टिविटी वर्कशीट (MATH WORKSHEET)

भाग 1: सचित्र जोड़ (Addition)
1. 4 सेब + 3 सेब = ______
2. 5 तितलियाँ + 2 तितलियाँ = ______
3. 6 गेंदें + 4 गेंदें = ______
4. 8 पेंसिलें + 7 पेंसिलें = ______
5. 12 टॉफियाँ + 9 टॉफियाँ = ______

भाग 2: सचित्र घटाव (Subtraction)
1. 9 फूल - 4 फूल = ______
2. 8 गुब्बारे - 3 फूट गए = ______
3. 15 खिलौने - 5 दे दिए = ______
4. 20 रुपये - 8 रुपये खर्च = ______

भाग 3: शब्द समस्या
• रोहित के पास 6 कंचे थे, उसके पिता ने 5 कंचे और दिए। अब रोहित के पास कुल कितने कंचे हैं?`
  },
  {
    id: 'bv-p6',
    pageNum: 6,
    titleHindi: 'पेज 06: 4-लाइन सुलेख व हैंडराइटिंग ट्रेसिंग शीट',
    titleEnglish: 'Handwriting Tracing & Calligraphy Guide',
    category: 'हस्तलेखन सुधार',
    badge: 'Tracing Workbook',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    description: 'हिंदी वर्णमाला की शिरोरेखा और अंग्रेजी अक्षरों के 4-लाइन डॉटेड ट्रेसिंग सुलेख अभ्यास पृष्ठ।',
    highlights: [
      'सुंदर हस्तलेखन हेतु पेंसिल पकड़ने की सही तकनीक',
      '4-लाइन मानक रूलिंग पर अक्षरों का सही संतुलन',
      'दैनिक 1 पेज सुलेख का अभ्यास प्रारूप'
    ],
    tasks: [
      '1. पेंसिल को तर्जनी और अंगूठे के बीच 45 डिग्री पर पकड़ें।',
      '2. डॉटेड अक्षरों पर बिना हाथ उठाए पेंसिल चलाएं।',
      '3. नीचे दी गई खाली लाइनों में अपना नाम 5 बार सुंदर लिखें।'
    ],
    textContent: `[IOIS BAL VIKAS KIT • PAGE 06]
4-लाइन सुलेख व हैंडराइटिंग ट्रेसिंग शीट (HANDWRITING GUIDE)

सुलेख के 3 स्वर्णिम नियम:
1. शिरोरेखा सीधी और अक्षरों के ऊपर पूरी होनी चाहिए।
2. दो शब्दों के बीच एक उंगली जितनी जगह अवश्य छोड़ें।
3. अक्षरों की ऊंचाई और चौड़ाई एक समान रखें।

अभ्यास पंक्ति:
• "सदा सत्य बोलो और बड़ों का आदर करो।"
• "Hard work is the key to success."`
  },
  {
    id: 'bv-p7',
    pageNum: 7,
    titleHindi: 'पेज 07: NCERT रिमझिम व Marigold कविता व बाल कथाएं',
    titleEnglish: 'Illustrated Rhymes & Moral Storybook',
    category: 'बाल साहित्य व भाषा विकास',
    badge: 'Storybook Vault',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'रिमझिम की प्रसिद्ध कविताएं (झूला, तितली और कली) और शिक्षाप्रद कहानियां (प्यासा कौआ, कछुआ और खरगोश)।',
    highlights: [
      'लयबद्ध कविता पाठ और उच्चारण सुधार',
      'नैतिक शिक्षा से युक्त प्रेरक बाल कथाएं',
      'कहानी आधारित बोध प्रश्न और मौखिक अभिव्यक्ति'
    ],
    tasks: [
      '1. "झूला" कविता को हाव-भाव और लय के साथ गाएं।',
      '2. प्यासा कौआ कहानी की सीख अपने शब्दों में बताएं।',
      '3. अपनी मनपसंद कहानी का कोई एक चित्र बनाएं।'
    ],
    textContent: `[IOIS BAL VIKAS KIT • PAGE 07]
NCERT कविताएं एवं प्रेरक बाल कथाएं (RHYMES & STORIES)

कविता: झूला (NCERT रिमझिम)
अम्मा आज लगा दे झूला,
इस झूले पर मैं झूलूँगा।
इस पर चढ़कर, ऊपर बढ़कर,
आसमान को मैं छू लूँगा!

कहानी 1: प्यासा कौआ
एक कौआ बहुत प्यासा था। उसे एक घड़ा दिखा जिसमें पानी बहुत नीचे था।
कौए ने कंकड़ लाकर घड़े में डाले। पानी ऊपर आ गया। कौए ने पानी पिया और उड़ गया।
सीख: जहाँ चाह, वहाँ राह।

कहानी 2: खरगोश और कछुआ
धीमी चाल से लगातार चलने वाला कछुआ घमंडी खरगोश को हरा देता है।
सीख: सतत परिश्रम से ही सफलता मिलती है।`
  },
  {
    id: 'bv-p8',
    pageNum: 8,
    titleHindi: 'पेज 08: अधिकृत बाल विकास पूर्णता प्रमाण पत्र',
    titleEnglish: 'Official Child Completion Certificate',
    category: 'पुरस्कार एवं सम्मान',
    badge: 'Gold Certificate',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    description: 'बाल विकास सम्पूर्ण पाठ्यक्रम सफलतापूर्वक पूरा करने पर छात्र को दिया जाने वाला आधिकारिक गोल्ड प्रमाण पत्र।',
    highlights: [
      'छात्र का नाम, माता-पिता का नाम और तारीख मुद्रण योग्य',
      'IOIS राष्ट्रीय डिजिटल शिक्षा प्रमाणन मुहर',
      'A4 फ्रेमिंग योग्य उच्च-रिज़ॉल्यूशन प्रमाण पत्र'
    ],
    tasks: [
      '1. प्रमाण पत्र पर छात्र का पूरा नाम भरें।',
      '2. माता-पिता और कक्षा शिक्षक से हस्ताक्षर करवाएं।',
      '3. अध्ययन कक्ष में फ्रेम करके लगाएं और आत्मविश्वास बढ़ाएं।'
    ],
    textContent: `[IOIS BAL VIKAS KIT • PAGE 08]
🇮🇳 भारतीय डिजिटल शिक्षा एवं कौशल विकास परिषद
आधिकारिक बाल विकास प्रवीणता प्रमाण पत्र (COMPLETION CERTIFICATE)

यह प्रमाणित किया जाता है कि:
विद्यार्थी का नाम: _____________________________________
कक्षा: _______________  |  विद्यालय / केंद्र: _______________________
ने NCERT कक्षा 1-5 बाल विकास संपूर्ण पाठ्यक्रम (वर्णमाला, पहाड़ा, गणित संक्रियाएं एवं सुलेख) को
सफलतापूर्वक पूर्ण कर लिया है।

प्रमाणन क्रमांक: IOIS-BV-2026-CERT
दिनांक: _______________
अधिकृत मुहर: [ IOIS VERIFIED GOLD SEAL ]
शिक्षक / मेंटर हस्ताक्षर: ___________________`
  }
];


interface StudyResourceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: StudyWorkContentItem | null;
  plan: PlanDetail;
  currentUser: MemberProfile | null;
  onOpenLogin?: () => void;
  onOpenRegistration?: (planId: string) => void;
  initialTab?: 'reader' | 'chapters' | 'download' | 'competition';
  initialClass?: number;
}

export const StudyResourceViewerModal: React.FC<StudyResourceViewerModalProps> = ({
  isOpen,
  onClose,
  resource,
  plan,
  currentUser,
  onOpenLogin,
  onOpenRegistration,
  initialTab,
  initialClass
}) => {
  const [selectedTab, setSelectedTab] = useState<'reader' | 'chapters' | 'download' | 'competition'>(
    initialTab || (plan.planNumber === 3 ? 'competition' : 'reader')
  );
  const [selectedClass, setSelectedClass] = useState<number>(
    initialClass || (plan.planNumber === 3 ? 11 : 1)
  );
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [enlargedPage, setEnlargedPage] = useState<BalVikasPrintablePage | null>(null);
  const [quickToast, setQuickToast] = useState<string | null>(null);

  // Plan fee lookup
  const planFee = plan.planNumber === 1 ? 10 :
                  plan.planNumber === 2 ? 25 :
                  plan.planNumber === 3 ? 50 :
                  plan.planNumber === 4 ? 100 :
                  plan.planNumber === 5 ? 200 :
                  plan.planNumber === 6 ? 500 : 999;

  if (!isOpen) return null;

  // STRICT ACCESS GATE:
  // 1. Without login, visitor cannot access the kit.
  // 2. User only gets access to the kit of the plan they registered & paid for!
  const accessCheck = canUserAccessPlanKit(currentUser, plan.id);

  if (!accessCheck.hasAccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto font-sans">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-slate-300 text-slate-800 overflow-hidden my-auto p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto shadow-inner border border-amber-200">
            🔒
          </div>

          {accessCheck.reason === 'not_logged_in' ? (
            <>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-black uppercase tracking-wider inline-block">
                  सुरक्षा प्रतिबंध: लॉगिन आवश्यक है
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  बिना लॉगिन या रजिस्ट्रेशन के किट उपलब्ध नहीं है!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  यह अध्ययन किट (<strong>{plan.name}</strong>) केवल अधिकृत और सत्यापित पंजीकृत विद्यार्थियों के लिए सुरक्षित है। कृपया किट एक्सेस करने के लिए अपने खाते से लॉगिन करें या मात्र ₹{plan.price} का लाइफटाइम पास प्राप्त करें।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenLogin) onOpenLogin();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs shadow-md transition-colors"
                >
                  विद्यार्थी लॉगिन करें
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenRegistration) onOpenRegistration(plan.id);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 text-slate-950 font-black text-xs shadow-md hover:brightness-105"
                >
                  नया पास लें (@ ₹{plan.price})
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider inline-block">
                  प्लान मिसमैच: किट अनधिकृत
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  यह किट आपके सक्रिय प्लान में शामिल नहीं है!
                </h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1">
                  <div><strong>आपका रोल नंबर:</strong> <span className="font-mono text-blue-800 font-bold">{currentUser?.rollNumber || currentUser?.memberId}</span></div>
                  <div><strong>आपका सक्रिय प्लान:</strong> <span className="text-emerald-700 font-bold">{currentUser?.planName || currentUser?.planId} (₹{currentUser?.amountPaid})</span></div>
                  <div><strong>अनुरोधित किट:</strong> <span className="text-amber-800 font-bold">{plan.name} (शुल्क: ₹{plan.price})</span></div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  नियम के अनुसार, आपको केवल उसी किट का एक्सेस मिलता है जिसका आपने भुगतान किया है। इस किट को अनलॉक करने के लिए एडमिन से अपग्रेड का अनुरोध करें।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                >
                  वापस जाएं
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenRegistration) onOpenRegistration(plan.id);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 text-slate-950 font-black text-xs shadow-md hover:brightness-105"
                >
                  यह किट अनलॉक करें (₹{plan.price})
                </button>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 underline font-medium"
            >
              डायलॉग बंद करें
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeResource = resource || {
    id: `plan-0${plan?.planNumber || 1}-full-kit`,
    title: `IOIS ${plan?.name || 'अध्ययन योजना'} - सम्पूर्ण अध्ययन किट 2026`,
    category: 'डिजिटल अध्ययन सामग्री',
    type: 'pdf' as const,
    description: plan?.tagline || 'सचित्र ई-बुक्स, नोट्स व कार्य किट',
    actionLabel: 'अध्ययन करें'
  };

  // Single page printable text download
  const handleDownloadSinglePage = (page: BalVikasPrintablePage) => {
    const content = `========================================================================\n`
      + `🇮🇳 IOIS NATIONAL DIGITAL EDUCATION & INCOME NETWORK\n`
      + `आधिकारिक बाल विकास प्रिंटेबल शीट (Official Printable Page Sheet)\n`
      + `योजना: PLAN 01 - बाल विकास (शुल्क: ₹10) | अधिकृत पेआउट: 70% (₹7.00)\n`
      + `पेज: #${page.pageNum} • ${page.titleHindi}\n`
      + `अंग्रेजी: ${page.titleEnglish} | श्रेणी: ${page.category}\n`
      + `विद्यार्थी का नाम: ________________________  कक्षा: ______  दिनांक: ________\n`
      + `========================================================================\n\n`
      + `${page.description}\n\n`
      + `[मुख्य विशेषताएं (KEY HIGHLIGHTS)]:\n`
      + page.highlights.map(h => `• ${h}`).join('\n') + `\n\n`
      + `[अभ्यास व गृहकार्य (TASKS & PRACTICE)]:\n`
      + page.tasks.map(t => `✓ ${t}`).join('\n') + `\n\n`
      + `[पेज पाठ्य सामग्री (PAGE CONTENT)]:\n`
      + `${page.textContent}\n\n`
      + `========================================================================\n`
      + `IOIS VERIFIED DIGITAL STUDY MATERIAL • हेल्पलाइन: +91 8877490845\n`
      + `========================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IOIS-BalVikas-Page0${page.pageNum}-${page.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setQuickToast(`पेज 0${page.pageNum} फाइल डाउनलोड प्रारंभ हो गई है!`);
    setTimeout(() => setQuickToast(null), 3000);
  };

  // Single page direct browser print
  const handlePrintSinglePage = (page: BalVikasPrintablePage) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${page.titleHindi} - IOIS Bal Vikas Kit</title>
            <style>
              @page { size: A4 portrait; margin: 15mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111; line-height: 1.5; padding: 10px; }
              .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
              .logo { font-size: 20px; font-weight: 900; color: #ea580c; }
              .sublogo { font-size: 11px; color: #4b5563; font-weight: bold; }
              .badge { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; }
              .title-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px; }
              .title { font-size: 18px; font-weight: 900; color: #0f172a; margin: 0; }
              .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
              .student-card { display: flex; justify-content: space-between; border: 1.5px dashed #94a3b8; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; font-size: 12px; background: #fff; }
              .content-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 14px; background: #ffffff; white-space: pre-wrap; font-size: 13px; line-height: 1.6; }
              .tasks-box { background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 12px; margin-bottom: 14px; font-size: 12px; }
              .tasks-title { font-weight: 800; color: #854d0e; margin-bottom: 6px; }
              .footer { border-top: 1.5px solid #cbd5e1; padding-top: 10px; margin-top: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo">IOIS NATIONAL DIGITAL CLASSROOM</div>
                <div class="sublogo">NCERT बाल विकास सम्पूर्ण ई-बुक एवं अभ्यास किट (Plan 01 • ₹10)</div>
              </div>
              <div class="badge">${page.badge} • PAGE ${page.pageNum}/8</div>
            </div>

            <div class="title-box">
              <h2 class="title">${page.titleHindi}</h2>
              <div class="meta">${page.titleEnglish} • श्रेणी: ${page.category}</div>
            </div>

            <div class="student-card">
              <div><strong>विद्यार्थी का नाम:</strong> ____________________________</div>
              <div><strong>कक्षा:</strong> ______</div>
              <div><strong>दिनांक:</strong> ____________</div>
              <div><strong>प्राप्तांक:</strong> _____/20</div>
            </div>

            <div class="tasks-box">
              <div class="tasks-title">📋 दैनिक अभ्यास निर्देश एवं कार्य (Daily Practice Tasks):</div>
              ${page.tasks.map(t => `<div>• ${t}</div>`).join('')}
            </div>

            <div class="content-box">${page.textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

            <div class="footer">
              <div>IOIS Digital Education • अधिकृत सदस्य: Vikas Kumar (70% पेआउट इंसेंटिव)</div>
              <div>शिक्षक / मेंटर हस्ताक्षर: ____________________  |  मुहर: [ IOIS VERIFIED ]</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 400);
    } else {
      window.print();
    }
  };

  // Real comprehensive file download generator
  const handleDownloadFile = () => {
    let content = `========================================================================\n`;
    content += `🇮🇳 IOIS NATIONAL DIGITAL EDUCATION & INCOME NETWORK\n`;
    content += `आधिकारिक अध्ययन सामग्री एवं कार्य पैकेज (Official Study & Work Package)\n`;
    content += `योजना: PLAN 0${plan.planNumber} - ${plan.name} (शुल्क: ₹${planFee})\n`;
    content += `संसाधन: ${activeResource?.title || 'IOIS अध्ययन किट'}\n`;
    content += `श्रेणी: ${activeResource.category} | साइज: ${activeResource.fileSize || '48.2 MB'}\n`;
    content += `अधिकृत सदस्य नाम: ${currentUser ? currentUser.name : 'विद्यार्थी सदस्य'}\n`;
    content += `अधिकृत सदस्य ID: ${currentUser ? (currentUser.rollNumber || currentUser.memberId) : 'IOIS10RK01'}\n`;
    content += `सत्यापन तारीख: ${new Date().toLocaleDateString('hi-IN')}\n`;
    content += `आधिकारिक हेल्पलाइन: +91 8877490845 | IOIS सपोर्ट: ioisplatform@gmail.com\n`;
    content += `========================================================================\n\n`;

    if (plan.planNumber === 1 || activeResource.id.startsWith('bv-')) {
      content += `========================================================================\n`;
      content += `📘 कक्षा 1 से 5 NCERT सम्पूर्ण अध्ययन सामग्री (COMPLETE TEXTBOOK & GUIDE)\n`;
      content += `========================================================================\n\n`;

      content += `[1. 🔢 2 से 20 तक सम्पूर्ण पहाड़ा सारणी (TABLES 2 TO 20 FULL)]\n\n`;
      for (let t = 2; t <= 20; t++) {
        content += `--- ${t} का पहाड़ा (Table of ${t}) ---\n`;
        const steps = ['एकम', 'दूनी', 'तिया', 'चौके', 'पंचे', 'छक्के', 'सत्ते', 'अट्ठे', 'नवा', 'दहाई'];
        for (let s = 1; s <= 10; s++) {
          content += `${t} × ${s} = ${t * s}  (${t} ${steps[s - 1]} ${t * s})\n`;
        }
        content += `\n`;
      }

      content += `\n[2. 💯 1 से 100 तक सम्पूर्ण गिनती (COUNTING 1 TO 100 IN HINDI & ENGLISH)]\n\n`;
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
      for (let n = 1; n <= 100; n++) {
        content += `${n} -> ${hindiWords[n - 1]} (${n})\n`;
      }

      content += `\n[3. 🍎 अ से ज्ञ सम्पूर्ण हिंदी वर्णमाला (HINDI VARNAMALA & SULEKH)]\n\n`;
      content += `स्वर (13 Vowels):\n`;
      content += `अ से अनार (मीठा दाना), आ से आम (रसीला पीला), इ से इमली (खट्टी मीठी), ई से ईख (खेत में लहराए)\n`;
      content += `उ से उल्लू (रात को जागे), ऊ से ऊन (भेड़ से पाएँ), ऋ से ऋषि (तपस्या करते), ए से एड़ी (पाँव का भाग)\n`;
      content += `ऐ से ऐनक (दादाजी की शान), ओ से ओखली (मसाला कूटो), औ से औरत (ममता की मूरत), अं से अंगूर (गुच्छों में लटके), अः से खाली (ताली बजाओ)\n\n`;
      content += `व्यंजन (Consonants):\n`;
      content += `क से कबूतर, ख से खरगोश, ग से गमला, घ से घड़ी, ङ से खाली\n`;
      content += `च से चम्मच, छ से छाता, ज से जहाज, झ से झंडा, ञ से खाली\n`;
      content += `ट से टमाटर, ठ से ठठेरा, ड से डमरू, ढ से ढक्कन, ण से खाली\n`;
      content += `त से तरबूज, थ से थर्मस, द से दवात, ध से धनुष, न से नल\n`;
      content += `प से पतंग, फ से फल, ब से बकरी, भ से भालू, म से मछली\n`;
      content += `य से यज्ञ, र से रथ, ल से लट्टू, व से वक\n`;
      content += `श से शलजम, ष से षट्कोण, स से सेब, ह से हाथी\n`;
      content += `संयुक्त व्यंजन: क्ष से क्षत्रिय, त्र से त्रिशूल, ज्ञ से ज्ञानी\n\n`;

      content += `\n[4. 🔤 A TO Z ENGLISH ALPHABET, PHONICS & SIGHT WORDS]\n\n`;
      content += `A - Apple (/æ/ - ऐ) -> A is for Apple, sweet and red!\n`;
      content += `B - Ball (/b/ - ब) -> B is for Ball, bouncing so high.\n`;
      content += `C - Cat (/k/ - क) -> C is for Cat, saying meow-meow.\n`;
      content += `D - Dog (/d/ - ड) -> D is for Dog, loyal and true.\n`;
      content += `E - Elephant (/e/ - ए) -> E is for Elephant, big and strong.\n`;
      content += `F - Fish (/f/ - फ) -> F is for Fish, swimming in the pond.\n`;
      content += `G - Grapes (/g/ - ग) -> G is for Grapes, juicy and sweet.\n`;
      content += `H - Horse (/h/ - ह) -> H is for Horse, galloping fast.\n`;
      content += `I - Ice-cream (/aɪ/ - आइ) -> I is for Ice-cream, cool on a hot day.\n`;
      content += `J - Joker (/dʒ/ - ज) -> J is for Joker, making everyone laugh.\n`;
      content += `K - Kite (/k/ - क) -> K is for Kite, flying in the sky.\n`;
      content += `L - Lion (/l/ - ल) -> L is for Lion, king of the jungle.\n`;
      content += `M - Mango (/m/ - म) -> M is for Mango, king of all fruits.\n`;
      content += `N - Nest (/n/ - न) -> N is for Nest, home for baby birds.\n`;
      content += `O - Owl (/ɒ/ - ऑ) -> O is for Owl, awake in the night.\n`;
      content += `P - Parrot (/p/ - प) -> P is for Parrot, green with a red beak.\n`;
      content += `Q - Queen (/kw/ - क्व) -> Q is for Queen, wearing a golden crown.\n`;
      content += `R - Rainbow (/r/ - र) -> R is for Rainbow, with seven bright colors.\n`;
      content += `S - Sun (/s/ - स) -> S is for Sun, giving warmth and light.\n`;
      content += `T - Tiger (/t/ - ट) -> T is for Tiger, our national animal.\n`;
      content += `U - Umbrella (/ʌ/ - अ) -> U is for Umbrella, saving from the rain.\n`;
      content += `V - Van (/v/ - व) -> V is for Van, taking kids to school.\n`;
      content += `W - Watch (/w/ - व) -> W is for Watch, showing the exact time.\n`;
      content += `X - Xylophone (/z/ - ज़) -> X is for Xylophone, playing melodious tunes.\n`;
      content += `Y - Yak (/j/ - य) -> Y is for Yak, living on snowy mountains.\n`;
      content += `Z - Zebra (/z/ - ज़) -> Z is for Zebra, with black and white stripes.\n\n`;

      content += `\n[5. 📑 NCERT 5-अध्याय विस्तृत पाठ्यक्रम एवं सम्पूर्ण नोट्स (CURRICULUM CHAPTERS)]\n\n`;
      content += `• अध्याय 1: आधारभूत परिचय एवं संकल्पनाएं (Basic Fundamentals)\n`;
      content += `  - संकल्पना: स्वर, व्यंजन, 1 से 100 गिनती, आकृतियाँ (वृत्त, त्रिभुज, आयत), अंदर-बाहर, ऊपर-नीचे।\n`;
      content += `  - अभ्यास प्रश्न: 3 गोल वस्तुएँ (सिक्का, रोटी, गेंद), 3 चौकोर वस्तुएँ (किताब, ईंट, ब्लैकबोर्ड)।\n\n`;

      content += `• अध्याय 2: सचित्र अभ्यास व वर्कशीट्स (Interactive Problem Sheets)\n`;
      content += `  - संकल्पना: सचित्र जोड़ (फलों को गिनना), घटाव (काटकर घटाना), गुणा (बार-बार जोड़ना), भाग (बराबर बाँटना)।\n`;
      content += `  - उदाहरण: 6 लड्डू × 4 डिब्बे = 24 लड्डू।\n\n`;

      content += `• अध्याय 3: दैनिक जीवन में अनुप्रयोग (Practical Life Applications)\n`;
      content += `  - संकल्पना: घड़ी में समय देखना (घंटे-मिनट), भारतीय सिक्के व नोट (₹1 से ₹500), मापन (मीटर, किग्रा, लीटर)।\n`;
      content += `  - उदाहरण: 1 मीटर = 100 सेंटीमीटर, 1 किलोग्राम = 1000 ग्राम।\n\n`;

      content += `• अध्याय 4: प्रश्नोत्तर संग्रह एवं आदर्श उत्तर (Model Answers Vault)\n`;
      content += `  - संकल्पना: NCERT रिमझिम व Marigold के सभी अध्यायों के अभ्यास प्रश्नोत्तर।\n`;
      content += `  - प्रश्न: जल संरक्षण क्यों जरूरी है? -> उत्तर: जल ही जीवन है। नल खुला न छोड़ें व वर्षा जल संचित करें।\n\n`;

      content += `• अध्याय 5: त्वरित पुनरावलोकन व परीक्षा ट्रिक्स (Speed Revision Tricks)\n`;
      content += `  - ट्रिक 1: किसी भी संख्या को 5 से 2 सेकंड में गुणा करना -> संख्या का आधा करें और 0 लगा दें (34 × 5 -> 170)।\n`;
      content += `  - ट्रिक 2: 9 का पहाड़ा उंगलियों पर निकालना।\n\n`;

      content += `\n[6. 📜 प्रसिद्ध NCERT कविताएं एवं बाल कथाएं (POEMS & STORIES)]\n\n`;
      content += `कविता 1: झूला (रिमझिम कक्षा 1)\n`;
      content += `"अम्मा आज लगा दे झूला, इस झूले पर मैं झूलूँगा।\nइस पर चढ़कर, ऊपर बढ़कर, आसमान को मैं छू लूँगा।\nझूला झूल रही है डाली, झूल रहा है पत्ता-पत्ता,\nइस झूले पर बड़ा मज़ा है, चल दिल्ली, ले चल कलकत्ता!"\n\n`;
      content += `कहानी 1: प्यासा कौआ (Thirsty Crow)\n`;
      content += `एक कौआ बहुत प्यासा था। उसे एक घड़ा दिखा जिसमें पानी बहुत नीचे था। कौए ने कंकड़ लाकर घड़े में डाले। पानी ऊपर आ गया। कौए ने पानी पिया और उड़ गया। सीख: जहाँ चाह, वहाँ राह।\n\n`;
      content += `कहानी 2: खरगोश और कछुआ (The Tortoise and the Hare)\n`;
      content += `खरगोश को अपनी तेज चाल पर घमंड था। कछुआ धीमी चाल से लगातार चलता रहा और सोते हुए खरगोश को पीछे छोड़ दौड़ जीत गया। सीख: सतत परिश्रम से ही सफलता मिलती है।\n`;
    } else if (plan.planNumber === 2) {
      content += `========================================================================\n`;
      content += `📄 PLAN 02: YOUTH SKILL ACCESS सम्पूर्ण अध्ययन व करियर किट (₹25)\n`;
      content += `========================================================================\n\n`;

      content += `[1. 📄 ATS-FRIENDLY RESUME BLUEPRINT (कॉलेज फ्रेशर एवं नौकरी हेतु)]\n\n`;
      content += `[FULL NAME]\nCity, State | +91 9876543210 | email@example.com | LinkedIn: linkedin.com/in/profile\n\n`;
      content += `CAREER OBJECTIVE:\nEnthusiastic and detail-oriented graduate seeking an entry-level position at [Target Company]. Eager to apply digital literacy, problem-solving, and team collaboration to contribute to company growth.\n\n`;
      content += `EDUCATION:\n• Bachelor of Science / Commerce / Arts | [College Name], [Year] | Aggregate: 78%\n• Higher Secondary Certificate (10+2) | [School Name], [Year] | Percentage: 82%\n\n`;
      content += `TECHNICAL & PROFESSIONAL SKILLS:\n• Computer Skills: MS Office (Excel, Word, PowerPoint), Google Workspace\n• Digital Tools: Fast Typing (35+ WPM), Basic AI Prompting (ChatGPT, Gemini)\n• Soft Skills: Clear Verbal & Written Communication, Time Management, Teamwork\n\n`;

      content += `[2. 🤖 TOP 200+ CURATED AI MASTER PROMPTS (ChatGPT & Gemini Ready)]\n\n`;
      content += `• Prompt 1 (ATS Resume Tuning): "Act as a Senior HR Recruiter. Analyze my resume below against this job description [PASTE JD]. Identify missing industry keywords, recommend 5 strong bullet points with action verbs, and estimate my current ATS match percentage: [PASTE RESUME]"\n`;
      content += `• Prompt 2 (Interview Roleplay): "Act as a strict hiring manager interviewing me for [ROLE]. Ask me 1 challenging question at a time. After my answer, provide constructive feedback out of 10 and suggest a better STAR-method response."\n`;
      content += `• Prompt 3 (Cold Outreach Email): "Write a concise, professional 120-word cold outreach email to the Head of [DEPARTMENT] at [COMPANY]. Highlight my enthusiasm for [PROJECT], mention my key strength in [SKILL], and politely request a 10-minute informational chat."\n`;
      content += `• Prompt 4 (Bug Fixer & Explainer): "Analyze this code snippet [PASTE CODE]. Explain line-by-line what this function does, identify security/edge cases, and provide refactored optimal code."\n\n`;

      content += `[3. 🎙️ TOP 50 HR INTERVIEW QUESTIONS & MODEL STAR ANSWERS]\n\n`;
      content += `Q1: Tell me about yourself. (अपने बारे में बताएं)\n`;
      content += `-> Formula: Present (वर्तमान शिक्षा/कौशल) -> Past (उपलब्धियां/प्रोजेक्ट्स) -> Future (इस कंपनी में योगदान)\n`;
      content += `-> Model: "I am a graduate in [Degree] with strong skills in [Skill 1] and [Skill 2]. During my academics, I led a project where I [Key Achievement]. I am excited about your company's focus on [Goal] and eager to contribute dedication and problem-solving."\n\n`;
      content += `Q2: What is your greatest weakness? (आपकी सबसे बड़ी कमजोरी क्या है?)\n`;
      content += `-> Formula: Real Non-Fatal Weakness + Active Steps you are taking to improve it.\n`;
      content += `-> Model: "In the past, I sometimes struggled with delegating tasks because I wanted everything 100% perfect. However, I started using Trello and calendar checklists to set clear milestones, which drastically improved my team delegation."\n\n`;

      content += `[4. ✉️ PROFESSIONAL JOB EMAILS & OFFER NEGOTIATION]\n\n`;
      content += `Subject: Application for [Job Role] - [Your Full Name]\nDear [Hiring Manager Name / HR Team],\nI am writing to express my strong interest in the [Job Role] position at [Company Name]...\n`;
    } else if (plan.planNumber === 3) {
      content += `========================================================================\n`;
      content += `🧭 PLAN 03: CAREER & JOB ACCESS सम्पूर्ण NCERT 6-12 व करियर गाइड (₹50)\n`;
      content += `========================================================================\n\n`;

      content += `[1. 🔬 CLASS 6-12 NCERT SCIENCE, MATH & SOCIAL NOTES]\n\n`;
      content += `• Class 10 Physics: प्रकाश का परावर्तन व अपवर्तन | दर्पण सूत्र: 1/f = 1/v + 1/u | लेंस सूत्र: 1/f = 1/v - 1/u | स्नेल का नियम: sin(i)/sin(r) = n\n`;
      content += `• Class 10 Chemistry: रासायनिक अभिक्रियाएँ | संयोजन (2Mg + O₂ -> 2MgO) | विस्थापन (Fe + CuSO₄ -> FeSO₄ + Cu)\n`;
      content += `• Class 10 Math: द्विघात समीकरण ax² + bx + c = 0 | श्रीधराचार्य सूत्र x = [-b ± √(b² - 4ac)] / 2a | विविक्तकर D = b² - 4ac\n`;
      content += `• Class 10 History: भारत में राष्ट्रवाद | 1919 जलियांवाला बाग | 1920 असहयोग आंदोलन | 1930 दांडी मार्च | 1942 भारत छोड़ो आंदोलन\n\n`;

      content += `[2. 🧭 10TH & 12TH COMPLETE CAREER COMPASS ROADMAP]\n\n`;
      content += `• Science Stream (PCM): Engineering (JEE Main/Advanced), Architecture, B.Sc Data Science, NDA Defense\n`;
      content += `• Science Stream (PCB): Medical (NEET-UG MBBS, BDS, BAMS), Pharmacy (B.Pharm), Nursing, Biotechnology\n`;
      content += `• Commerce Stream: CA (Chartered Accountancy), CS, Investment Banking, BBA/IPMAT, B.Com Honors\n`;
      content += `• Arts & Humanities: UPSC Civil Services (IAS/IPS), Law & Judiciary (CLAT), Journalism, State PCS\n\n`;

      content += `[3. 🗣️ 30-DAY SPOKEN ENGLISH DAILY PRACTICE CARDS]\n\n`;
      content += `• "Good morning, how are you doing today?" (नमस्ते, आज आप कैसे हैं?)\n`;
      content += `• "Could you please lend me a hand with this?" (क्या आप इसमें मेरी थोड़ी मदद कर सकते हैं?)\n`;
      content += `• "I really appreciate your timely help." (आपके समय पर की गई मदद की मैं बहुत कद्र करता हूँ।)\n\n`;

      content += `[4. 🎯 BOARD EXAM 90%+ SCORING STRATEGY & TIME MANAGEMENT]\n\n`;
      content += `• 15 मिनट पठन काल: सबसे सटीक याद प्रश्नों को पेंसिल से चिन्हित करें।\n`;
      content += `• 2 घंटा 30 मिनट: सुलेख, मुख्य कीवर्ड्स को अंडरलाइन और चित्र/फॉर्मूला बॉक्स अनिवार्य।\n`;
      content += `• अंतिम 15 मिनट: प्रश्न संख्या व उत्तरों की री-चेकिंग।\n`;
    } else if (plan.planNumber === 4) {
      content += `========================================================================\n`;
      content += `🛡️ PLAN 04: FAMILY VIP ACCESS - साइबर सुरक्षा, पेरेंटिंग व स्वास्थ्य (₹100)\n`;
      content += `========================================================================\n\n`;

      content += `[1. 🚨 राष्ट्रीय साइबर वित्तीय धोखाधड़ी हेल्पलाइन: 1930]\n\n`;
      content += `• यदि आपके बैंक खाते से धोखाधड़ी से पैसा कट जाए, तो 2 घंटे (गोल्डन आवर) के भीतर 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें।\n`;
      content += `• 1930 कॉल करते ही नोडल बैंक अपराधी का खाता तुरंत फ्रीज कर देता है, जिससे आपका 100% धन वापस मिल सकता है।\n\n`;

      content += `[2. 🛡️ 7 प्रमुख साइबर स्कैम्स एवं बचाव के नियम]\n\n`;
      content += `1. डिजिटल अरेस्ट स्कैम: कोई भी पुलिस या जांच एजेंसी वीडियो कॉल पर गिरफ्तारी नहीं करती। तुरंत फोन काटें।\n`;
      content += `2. फर्जी APK फाइल: WhatsApp पर भेजे गए अनजान .apk फाइल को कभी इंस्टॉल न करें।\n`;
      content += `3. गलत UPI पेमेंट: केवल स्क्रीनशॉट पर भरोसा न करें, अपने बैंक ऐप में बैलेंस चेक करें।\n`;
      content += `4. वर्क फ्रॉम होम / टेलीग्राम स्कैम: कोई भी वास्तविक कंपनी काम देने के लिए पैसे नहीं माँगती।\n\n`;

      content += `[3. 📱 SMART DIGITAL PARENTING & SCREEN LOCK]\n\n`;
      content += `• Google Family Link के जरिए बच्चों के फोन में दैनिक 1 घंटे का स्क्रीन टाइमर लगाएं।\n`;
      content += `• रात 9:00 बजे के बाद फोन ऑटो-लॉक नियम और डाइनिंग टेबल पर "नो-स्क्रीन" अनुशासन।\n\n`;

      content += `[4. 🧘 सूर्य नमस्कार 12 चरण (मंत्र एवं लाभ) व आपातकालीन नंबर]\n\n`;
      content += `• 1. प्रणामासन (ॐ मित्राय नमः) | 2. हस्तउत्तानासन (ॐ रवये नमः) | 3. पादहस्तासन (ॐ सूर्याय नमः)\n`;
      content += `• आपातकालीन नंबर: एकीकृत आपातकाल 112 | एम्बुलेंस 108 | महिला 1090/181 | चाइल्डलाइन 1098 | साइबर 1930\n`;
    } else if (plan.planNumber === 5) {
      content += `========================================================================\n`;
      content += `🏛️ PLAN 05: STUDENT ELITE ACCESS - SSC, RAILWAY, BANKING & POLICE (₹200)\n`;
      content += `========================================================================\n\n`;

      content += `[1. 📜 भारतीय संविधान एवं राजव्यवस्था महत्वपूर्ण तथ्य]\n\n`;
      content += `• अनुच्छेद 14: विधि के समक्ष समता | अनुच्छेद 17: अस्पृश्यता का अंत | अनुच्छेद 21: प्राण व दैहिक स्वतंत्रता\n`;
      content += `• अनुच्छेद 21A: अनिवार्य शिक्षा (86वां संशोधन 2002) | अनुच्छेद 32: संवैधानिक उपचारों का अधिकार (संविधान की आत्मा)\n`;
      content += `• स्रोत: ब्रिटेन (संसदीय प्रणाली), USA (मौलिक अधिकार), आयरलैंड (DPSP), दक्षिण अफ्रीका (संविधान संशोधन)\n\n`;

      content += `[2. ⏳ आधुनिक भारत का इतिहास टाइमलाइन]\n\n`;
      content += `• 1885: भारतीय राष्ट्रीय कांग्रेस की स्थापना | 1905: बंगाल विभाजन | 1919: जलियांवाला बाग हत्याकांड\n`;
      content += `• 1920: असहयोग आंदोलन | 1930: दांडी मार्च व सविनय अवज्ञा | 1942: भारत छोड़ो आंदोलन ("करो या मरो")\n\n`;

      content += `[3. ⚡ 50 स्पीड मैथ शॉर्टकट ट्रिक्स]\n\n`;
      content += `• ट्रिक 1 (अंत में 5 वाली संख्या का वर्ग): 35² = (3×4)25 = 1225 | 75² = (7×8)25 = 5625\n`;
      content += `• ट्रिक 2 (100 के निकट गुणा): 104 × 106 = (104+6) व (4×6) = 11024\n`;
      content += `• भिन्न सारणी: 1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.66%, 1/8=12.5%, 1/12=8.33%\n`;
      content += `• 2 वर्ष का CI-SI अंतर: D = P × (R/100)²\n\n`;

      content += `[4. 🧠 रीजनिंग मास्टरक्लास]\n\n`;
      content += `• EJOTY फॉर्मूला: E=5, J=10, O=15, T=20, Y=25\n`;
      content += `• विपरीत अक्षर: A-Z (Azad), B-Y (Boy), C-X (Crux), D-W (Dew), E-V (Evening), G-T (GT Road), H-S (High School), I-R (Indian Railway), M-N (Man)\n`;
    } else if (plan.planNumber === 6) {
      content += `========================================================================\n`;
      content += `💼 PLAN 06: AGENCY RESELLER HUB सम्पूर्ण कमर्शियल लाइसेंस व टूल्स (₹500)\n`;
      content += `========================================================================\n\n`;

      content += `[1. 📜 COMMERCIAL RESELLER LICENSE CERTIFICATE]\n\n`;
      content += `यह प्रमाणित किया जाता है कि इस प्लान के सक्रिय सदस्य को IOIS डिजिटल शैक्षिक सामग्री, ई-बुक्स और टूल्स को पूरे भारत में अधिकृत रूप से पुनर्विक्रय (Resell) करने और 70% तक कमीशन प्राप्त करने का पूर्ण वैधानिक अधिकार प्राप्त है।\n\n`;

      content += `[2. 💬 WHATSAPP BUSINESS AUTOMATION SCRIPTS]\n\n`;
      content += `• स्क्रिप्ट 1 (स्वागत): "नमस्ते जी! IOIS डिजिटल एजुकेशन एवं करियर पोर्टल में आपका स्वागत है। NCERT ई-बुक्स, ATS रिज्यूम, और 70% पेआउट किट उपलब्ध हैं। क्या आप विद्यार्थी हैं, अभिभावक हैं या स्वरोजगार चाहते हैं?"\n`;
      content += `• स्क्रिप्ट 2 (प्लान 01 पिच): "बच्चों के लिए भारत का सबसे बड़ा डिजिटल पैकेज! NCERT Class 1-5, 2-20 पहाड़ा, वर्णमाला, फोनिक्स मात्र ₹10 में! तुरंत जुड़ें: [आपका लिंक]"\n\n`;

      content += `[3. 🎨 HIGH-CONVERTING AD CREATIVES & SOCIAL MEDIA COPY]\n\n`;
      content += `• Instagram Hook: "🚨 क्या आप भी अपने स्मार्टफोन का उपयोग केवल रील्स देखने में कर रहे हैं? IOIS से जुड़कर सीखें डिजिटल स्किल्स और कमाएं प्रतिदिन ₹500 से ₹2000 सीधा बैंक में!"\n`;
      content += `• YouTube Shorts Hook: "[उत्साह से] कॉलेज की पढ़ाई के साथ जेबखर्च कैसे निकालें? मात्र ₹10-₹25 में मॉड्यूल्स लें और 70% तुरंत पेआउट पाएं!"\n\n`;

      content += `[4. 📈 दैनिक ₹2000 कमाई ब्लूप्रिंट (MICRO-AGENCY SCALING)]\n\n`;
      content += `• 5 स्थानीय साइबर कैफे और कोचिंग सेंटर्स से संपर्क करें।\n`;
      content += `• प्रतिदिन 6 नए रीसेलर सदस्य बनाने पर 6 × ₹350 = ₹2,100 दैनिक सीधी आय।\n`;
    } else {
      content += `========================================================================\n`;
      content += `👑 PLAN 07: LIFETIME MASTER ACCESS - सम्पूर्ण 7 प्लान्स व ₹499 पेआउट (₹999)\n`;
      content += `========================================================================\n\n`;

      content += `[1. 👑 ALL 6 PLANS UNLOCKED MASTER OVERVIEW]\n\n`;
      content += `• Plan 01 (Bal Vikas ₹10) Unlocked: NCERT 1-5 Books, Tables 2-20, Varnamala, Phonics\n`;
      content += `• Plan 02 (Youth Skill ₹25) Unlocked: ATS Resume Builder, 200+ AI Prompts, HR STAR Q&A\n`;
      content += `• Plan 03 (Career & Job ₹50) Unlocked: NCERT 6-12 Notes, Career Roadmaps, Spoken English\n`;
      content += `• Plan 04 (Family VIP ₹100) Unlocked: Digital Parenting, 1930 Cyber Shield, Surya Namaskar\n`;
      content += `• Plan 05 (Student Elite ₹200) Unlocked: SSC/Railway GS Vault, Speed Math 50 Tricks\n`;
      content += `• Plan 06 (Agency Reseller ₹500) Unlocked: Commercial Reseller License, WhatsApp Automation\n\n`;

      content += `[2. 💰 संजय वर्मा 20-सदस्यीय मास्टर लीडरशिप मॉडल]\n\n`;
      content += `• प्रति डायरेक्ट रेफरल: ₹499 तत्काल शुद्ध बैंक ट्रांसफर\n`;
      content += `• 5 सदस्य = ₹2,495\n`;
      content += `• 10 सदस्य = ₹4,990\n`;
      content += `• 20 सदस्य = ₹9,980 (संजय वर्मा मॉडल)\n`;
      content += `• 50 सदस्य = ₹24,950\n\n`;

      content += `[3. 🏆 VIP डायरेक्ट एडमिन मेंटरशिप एवं जिला समन्वय प्रोटोकॉल]\n\n`;
      content += `• मुख्य डेवलपर एवं एडमिन टीम से सीधा संपर्क (+91 8877490845)\n`;
      content += `• जिला समन्वयक (District Coordinator) प्राथमिकता एवं आधिकारिक मुहर\n`;
      content += `• गोल्डन स्मार्ट आईडी प्रमाणन: IOIS-GOLD-MASTER\n`;
    }

    content += `\n========================================================================\n`;
    content += `IOIS डिजिटल नेटवर्क: स्वदेशी डिजिटल स्वावलंबन भारत मिशन\n`;
    content += `========================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IOIS_PLAN_0${plan.planNumber}_${activeResource.id}_Complete_Package.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyNotes = () => {
    const text = `${activeResource?.title || 'IOIS अध्ययन किट'}\n${activeResource?.description || ''}\n\nयोजना: PLAN 0${plan.planNumber} (शुल्क: ₹${planFee}) • 70% पेआउट इंसेंटिव\nIOIS आधिकारिक पोर्टल: https://ioisplatform.github.io/`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[94vh] text-slate-100">
        
        {/* Modal Top Header */}
        <div className="bg-slate-950 p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-lg shrink-0">
              0{plan.planNumber}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-orange-400 font-extrabold tracking-wider">
                  PLAN 0{plan.planNumber} • {plan.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ₹{planFee} एक्टिव (70% पेआउट)
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white truncate">
                {activeResource?.title || 'IOIS सम्पूर्ण अध्ययन किट'}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDownloadFile}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>डाउनलोड पैकेज</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast if downloaded */}
        {downloadSuccess && (
          <div className="bg-emerald-950 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-300 font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>सम्पूर्ण फाइल सफलतापूर्वक डाउनलोड हो गई है! आप इसे ऑफलाइन कभी भी पढ़ सकते हैं।</span>
            </div>
            <button onClick={() => setDownloadSuccess(false)} className="text-emerald-400 font-bold hover:underline">
              ✕
            </button>
          </div>
        )}

        {/* Tab & Controls Bar */}
        <div className="bg-slate-950/70 px-4 sm:px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedTab('reader')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                selectedTab === 'reader' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              डिजिटल रीडर (Live Study)
            </button>
            <button
              onClick={() => setSelectedTab('chapters')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                selectedTab === 'chapters' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              अध्याय सूची (Syllabus)
            </button>
            <button
              onClick={() => setSelectedTab('download')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                selectedTab === 'download' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              प्रिंट व ऑफलाइन किट
            </button>

            {/* 4. Competition Ready Practice Zone (Class 7-12 NEET & JEE) */}
            <button
              onClick={() => setSelectedTab('competition')}
              className={`px-3.5 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 ${
                selectedTab === 'competition'
                  ? 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white shadow-lg ring-2 ring-orange-400/40'
                  : 'text-amber-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span>🎯 Competition Ready (7-12th)</span>
              <span className="hidden md:inline px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 text-[9px] border border-red-500/40 font-bold">
                NEET/JEE
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNotes}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-bold flex items-center gap-1"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'कॉपी हुआ!' : 'कॉपी नोट्स'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-bold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट</span>
            </button>
          </div>

        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: INTERACTIVE READER */}
          {selectedTab === 'reader' && (
            <div className="space-y-6">
              
              {/* DEDICATED FULL STUDY SUITES FOR ALL 7 PLANS */}
              {activeResource.id === 'bv-01' || plan.planNumber === 1 ? (
                <NCERTFullStudySuite initialClass={selectedClass} />
              ) : plan.planNumber === 2 ? (
                <Plan02YouthSuite />
              ) : plan.planNumber === 3 ? (
                <Plan03CareerSuite />
              ) : plan.planNumber === 4 ? (
                <Plan04FamilySuite />
              ) : plan.planNumber === 5 ? (
                <Plan05EliteSuite />
              ) : plan.planNumber === 6 ? (
                <Plan06AgencySuite />
              ) : (
                <Plan07MasterSuite />
              )}

            </div>
          )}

          {/* TAB 2: CHAPTERS / SYLLABUS WITH DEDICATED READ BUTTONS */}
          {selectedTab === 'chapters' && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-400" />
                  <span>सम्पूर्ण अध्याय एवं सामग्री सूची (Detailed Curriculum):</span>
                </h4>
                <span className="text-xs text-emerald-400 font-bold">
                  5/5 अध्याय पूर्ण
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {(
                  plan.planNumber === 2 ? [
                    { ch: 'अध्याय 1', title: 'ATS प्रो रिज्यूम स्ट्रक्चरिंग (ATS Resume Mastery)', status: 'पूर्ण', desc: 'सिंगल कॉलम लेआउट, एक्शन वर्ब्स, कीवर्ड डेंसिटी व 6 रेडीमेड ब्लू-प्रिंट्स' },
                    { ch: 'अध्याय 2', title: '200+ एआई प्रॉम्ट्स लाइब्रेरी (AI Prompts Vault)', status: 'पूर्ण', desc: 'ChatGPT एवं Gemini के लिए इंटरव्यू, कोडिंग, ईमेलिंग व करियर प्रॉम्ट्स' },
                    { ch: 'अध्याय 3', title: 'जॉब सर्च व कोल्ड ईमेलिंग (Job Application Scripts)', status: 'पूर्ण', desc: 'एचआर को सीधे प्रभावकारी ईमेल, फॉलो-अप संदेश व सैलरी नेगोशिएशन' },
                    { ch: 'अध्याय 4', title: 'टॉप 50 एचआर इंटरव्यू STAR प्रश्नोत्तर (HR Interview Prep)', status: 'पूर्ण', desc: 'Situation-Task-Action-Result विधि से कठिन व्यवहारिक प्रश्नों के समाधान' },
                    { ch: 'अध्याय 5', title: 'करियर प्रोफाइल ऑप्टिमाइजेशन (Profile Readiness)', status: 'पूर्ण', desc: 'लिंक्डइन प्रोफाइल, पोर्टफोलियो व फ्रेशर असेसमेंट चेकलिस्ट' }
                  ] : plan.planNumber === 3 ? [
                    { ch: 'अध्याय 1', title: 'कक्षा 6-12 NCERT त्वरित सारांश (Science & Math Notes)', status: 'पूर्ण', desc: 'भौतिकी, रसायन, जीवविज्ञान व गणित के सूत्र एवं मुख्य संकल्पनाएं' },
                    { ch: 'अध्याय 2', title: '10वीं व 12वीं करियर कम्पास (Stream Career Roadmaps)', status: 'पूर्ण', desc: 'PCM, PCB, कॉमर्स, आर्ट्स, NDA एवं उच्च शिक्षा प्रवेश परीक्षाएं' },
                    { ch: 'अध्याय 3', title: '30-दिवसीय स्पोकन इंग्लिश लैब (Daily Conversation Practice)', status: 'पूर्ण', desc: 'दैनिक 5 वाक्य, उच्चारण सुधार, ऑफिस बातचीत व आत्मविश्वास विकास' },
                    { ch: 'अध्याय 4', title: 'बोर्ड परीक्षा 90%+ स्कोरिंग फॉर्मूला (High Scoring Habits)', status: 'पूर्ण', desc: '15 मिनट पठन काल, अंडरलाइनिंग, चित्र बॉक्स व टाइम मैनेजमेंट' },
                    { ch: 'अध्याय 5', title: 'डिजिटल लिटरेसी एवं उत्पादकता टूल्स (Office Productivity)', status: 'पूर्ण', desc: 'MS Excel फॉर्मूले, Word शॉर्टकट्स एवं फास्ट टाइपिंग अभ्यास' }
                  ] : plan.planNumber === 4 ? [
                    { ch: 'अध्याय 1', title: '1930 राष्ट्रीय साइबर हेल्पलाइन व डिजिटल अरेस्ट सुरक्षा (Cyber Shield)', status: 'पूर्ण', desc: 'गोल्डन आवर रिपोर्टिंग, 7 साइबर स्कैम्स व बैंक अकाउंट सुरक्षा नियम' },
                    { ch: 'अध्याय 2', title: 'स्मार्ट पेरेंटिंग व स्क्रीन डी-एडिक्शन (Screen Limits & Guidance)', status: 'पूर्ण', desc: 'Google Family Link सेटअप, डिजिटल डिटॉक्स व पारिवारिक टाइम टेबल' },
                    { ch: 'अध्याय 3', title: 'सूर्य नमस्कार 12 मंत्र व समग्र स्वास्थ्य (Daily Health & Yoga)', status: 'पूर्ण', desc: '12 योगासन, वैदिक मंत्र, प्राणायाम व दैनिक पोषण चार्ट' },
                    { ch: 'अध्याय 4', title: 'राष्ट्रीय आपातकालीन डायरेक्टरी (National Emergency Helplines)', status: 'पूर्ण', desc: '112, 108, 1090, 1098, 1930 व राज्य आपदा नियंत्रण संपर्क' },
                    { ch: 'अध्याय 5', title: 'प्राथमिक चिकित्सा एवं सीपीआर गाइड (Home First Aid)', status: 'पूर्ण', desc: 'जलने, कटने, बेहोशी व आपातकालीन प्राथमिक उपचार प्रोटोकॉल' }
                  ] : plan.planNumber === 5 ? [
                    { ch: 'अध्याय 1', title: 'भारतीय संविधान एवं आधुनिक इतिहास नोट्स (GS Polity & History)', status: 'पूर्ण', desc: 'महत्वपूर्ण अनुच्छेद, मौलिक अधिकार, 1885-1947 टाइमलाइन व भूगोल' },
                    { ch: 'अध्याय 2', title: '50 स्पीड मैथ शॉर्टकट ट्रिक्स (Speed Math Mental Shortcuts)', status: 'पूर्ण', desc: 'वैदिक गुणा, वर्ग-घन, प्रतिशत-भिन्न सारणी व 2-सेकंड कैलकुलेशन' },
                    { ch: 'अध्याय 3', title: 'रीजनिंग EJOTY एवं लॉजिकल पजल्स (Logical Reasoning Vault)', status: 'पूर्ण', desc: 'कोडिंग-डिकोडिंग, विपरीत अक्षर, रक्त संबंध व दिशा परीक्षण' },
                    { ch: 'अध्याय 4', title: 'SSC, रेलवे व पुलिस विगत वर्ष हल प्रश्न (Previous Year Solved Papers)', status: 'पूर्ण', desc: 'अति-महत्वपूर्ण 1000 वस्तुनिष्ठ प्रश्न एवं विस्तृत व्याख्या' },
                    { ch: 'अध्याय 5', title: 'ऑल-इंडिया लाइव मॉक टेस्ट सीरीज (Timed Mock Examination)', status: 'पूर्ण', desc: '20 प्रश्नों की रीयल-टाइम परीक्षा, स्कोरिंग व निगेटिव मार्किंग विश्लेषण' }
                  ] : plan.planNumber === 6 ? [
                    { ch: 'अध्याय 1', title: 'कमर्शियल रीसेलर लाइसेंस व अधिकार (Commercial Resale License)', status: 'पूर्ण', desc: 'वैधानिक पुनर्विक्रय अधिकार, ब्रांडिंग दिशा-निर्देश व पार्टनर शर्तें' },
                    { ch: 'अध्याय 2', title: '7-स्टेप व्हाट्सएप ऑटोमेशन स्क्रिप्ट्स (WhatsApp Conversion Funnels)', status: 'पूर्ण', desc: 'स्वागत, प्लान प्रेजेंटेशन, फॉलो-अप व पेमेंट कन्फर्मेशन टेम्पलेट्स' },
                    { ch: 'अध्याय 3', title: 'हाई-सीटीआर विज्ञापन व सोशल मीडिया कॉपी (Ad Creatives & Hooks)', status: 'पूर्ण', desc: 'Instagram, Facebook व YouTube Shorts के लिए आकर्षक विज्ञापन' },
                    { ch: 'अध्याय 4', title: 'दैनिक ₹2000 कमाई 3-चरणीय ब्लूप्रिंट (Micro-Agency Scaling)', status: 'पूर्ण', desc: 'प्रतिदिन 6 रीसेलर एक्टिवेशन द्वारा ₹2,100 की सीधी आय का गणित' },
                    { ch: 'अध्याय 5', title: 'स्थानीय साइबर कैफे व स्कूल ऑनबोर्डिंग गाइड (Client Acquisition)', status: 'पूर्ण', desc: 'कोचिंग व दुकानों को डिजिटल पार्टनर बनाने का व्यावहारिक तरीका' }
                  ] : plan.planNumber === 7 ? [
                    { ch: 'अध्याय 1', title: 'सम्पूर्ण 6 प्लान्स मास्टर एक्सेस वॉल्ट (All Plans Unlocked)', status: 'पूर्ण', desc: 'प्लान 01 से 06 तक की सम्पूर्ण 100% सामग्री आजीवन अनलॉक्ड' },
                    { ch: 'अध्याय 2', title: 'संजय वर्मा 20-सदस्यीय मॉडल - ₹9,980 पेआउट (Leadership Payout Engine)', status: 'पूर्ण', desc: '₹499 प्रति रेफरल उच्चतम पेआउट का गणित व नकद ट्रांसफर' },
                    { ch: 'अध्याय 3', title: 'डायरेक्ट एडमिन मेंटरशिप व जिला समन्वय (VIP Coordination Hotline)', status: 'पूर्ण', desc: 'डेवलपर व एडमिन से सीधा कॉल, प्राथमिकता समाधान व कैंप अधिकार' },
                    { ch: 'अध्याय 4', title: 'गोल्डन स्मार्ट आईडी एवं आधिकारिक फ्रैंचाइज़ी मुहर (Official Golden Credentials)', status: 'पूर्ण', desc: 'डिजिटल सर्टिफिकेट, गोल्डन कार्ड व राज्य-स्तरीय पहचान' },
                    { ch: 'अध्याय 5', title: 'टीम डुप्लीकेशन एवं मासिक ₹50,000+ रोडमैप (Franchise Scaling System)', status: 'पूर्ण', desc: '50+ सदस्यों की लीडरशिप टीम बनाकर निरंतर आय का मॉडल' }
                  ] : [
                    { ch: 'अध्याय 1', title: 'आधारभूत परिचय एवं संकल्पनाएं (Basic Fundamentals)', status: 'पूर्ण', desc: 'स्वर, व्यंजन, 1 से 100 गिनती, मूलभूत आकृतियाँ एवं शब्द ज्ञान' },
                    { ch: 'अध्याय 2', title: 'सचित्र अभ्यास व वर्कशीट्स (Interactive Problem Sheets)', status: 'पूर्ण', desc: 'सचित्र जोड़, घटाव, गुणा, भाग, 4-लाइन ट्रेसिंग व व्याकरण वर्कशीट' },
                    { ch: 'अध्याय 3', title: 'दैनिक जीवन में अनुप्रयोग (Practical Life Applications)', status: 'पूर्ण', desc: 'समय (घड़ी), भारतीय मुद्रा (रुपये-पैसे), मापन (वजन-लंबाई) व स्वच्छता' },
                    { ch: 'अध्याय 4', title: 'प्रश्नोत्तर संग्रह एवं आदर्श उत्तर (Model Answers Vault)', status: 'पूर्ण', desc: 'NCERT पाठ्यपुस्तकों (रिमझिम, Marigold, गणित का जादू) के सटीक समाधान' },
                    { ch: 'अध्याय 5', title: 'त्वरित पुनरावलोकन व परीक्षा ट्रिक्स (Speed Revision Tricks)', status: 'पूर्ण', desc: 'स्पीड मैथ शॉर्टकट, उंगलियों पर पहाड़ा, माइंड मैप्स व 100% अंक रणनीति' }
                  ]
                ).map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 hover:border-indigo-500 transition-all">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-orange-600/30 text-orange-400 font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <strong className="text-white block text-sm">{item?.ch}: {item?.title || ''}</strong>
                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.status}
                      </span>
                      <button
                        onClick={() => setSelectedTab('reader')}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow"
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

          {/* TAB 3: DOWNLOAD & OFFLINE PRINT */}
          {selectedTab === 'download' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Quick Toast Notification */}
              {quickToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 font-bold text-xs sm:text-sm animate-in fade-in slide-in-from-bottom duration-300">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>{quickToast}</span>
                </div>
              )}

              {/* SPECIFIC TO PLAN 01: BAL VIKAS MASTER KIT */}
              {(plan.planNumber === 1 || activeResource.id.startsWith('bv-')) ? (
                <div className="space-y-8">
                  
                  {/* Master Kit Header Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-950 to-orange-950/40 border-2 border-orange-500/40 shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500 text-slate-950 uppercase tracking-wider flex items-center gap-1.5 shadow">
                            <Sparkles className="w-3.5 h-3.5" />
                            बाल विकास संपूर्ण मास्टर किट (ALL-IN-ONE)
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✓ मुद्रण योग्य (Printable A4)
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            ₹{planFee} योजना अधिकृत (70% पेआउट)
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                          NCERT कक्षा 1 से 5 डिजिटल पुस्तकें, नोट्स व वर्कशीट बंडल
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                          इस सम्पूर्ण पैकेज में <strong>अ से अनार & कविता</strong>, <strong>A to Z Phonics</strong>, <strong>2 से 20 पहाड़ा सचित्र उदाहरण</strong>, <strong>1 से 100 गिनती</strong>, <strong>जोड़/घटाव/गुणा/भाग अभ्यास पत्रक</strong> और <strong>बाल विकास पूर्णता प्रमाण पत्र</strong> शामिल हैं।
                        </p>
                      </div>

                      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center shrink-0 min-w-[200px] space-y-2">
                        <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                          कुल पैकेज साइज
                        </div>
                        <div className="text-3xl font-black text-orange-400 font-mono">
                          {activeResource.fileSize || '48.2 MB'}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold">
                          ✓ 100% लाइफटाइम ऑफलाइन एक्सेस
                        </div>
                      </div>
                    </div>

                    {/* Master Action Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleDownloadFile}
                        className="flex-1 min-w-[240px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-95"
                      >
                        <Download className="w-5 h-5 text-white" />
                        <span>संपूर्ण किट डाउनलोड प्रारंभ करें (Download All-in-One 500+ Page Kit)</span>
                      </button>

                      <button
                        onClick={() => {
                          const p = BAL_VIKAS_PRINTABLE_PAGES[0];
                          handlePrintSinglePage(p);
                        }}
                        className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all shadow"
                      >
                        <Printer className="w-4 h-4 text-amber-400" />
                        <span>डायरेक्ट प्रिंटर पर भेजें (A4 Print)</span>
                      </button>
                    </div>
                  </div>

                  {/* IMPORTANT UPDATES & FEATURES SECTION */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <h4 className="text-lg font-black text-white">
                        महत्वपूर्ण अपडेट्स एवं नवीनतम विशेषताएं (Important Kit Updates 2026)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-amber-500/50 transition-all">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                          🏆
                        </div>
                        <h5 className="font-extrabold text-sm text-white">NEP 2020 & NCF-FS अद्यतन</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          3 से 8 वर्ष के बच्चों हेतु मूलभूत साक्षरता व संख्यात्मकता (FLN) और 'जादुई पिटारा' के मानकों के 100% अनुकूल।
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                          🖨️
                        </div>
                        <h5 className="font-extrabold text-sm text-white">A4 साइज होम प्रिंटिंग फ्रेंडली</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          सभी 8 मुख्य पृष्ठ 300 DPI उच्च-रिज़ॉल्यूशन में तैयार हैं, जिन्हें किसी भी घरेलू प्रिंटर या साइबर कैफे से किफायती प्रिंट किया जा सकता है।
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-blue-500/50 transition-all">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                          📱
                        </div>
                        <h5 className="font-extrabold text-sm text-white">100% लाइफटाइम ऑफलाइन एक्सेस</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          एक बार डाउनलोड करने के बाद बिना किसी इंटरनेट डेटा या वाई-फाई के कभी भी स्मार्टफोन, टैबलेट या लैपटॉप पर चलाएं।
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-orange-500/50 transition-all">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black">
                          💰
                        </div>
                        <h5 className="font-extrabold text-sm text-white">70% डायरेक्ट पेआउट अधिकृत</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          मात्र ₹10 की योजना में प्रति एक्टिवेशन सदस्य को ₹7.00 की सीधी दैनिक आय और अधिकृत पूर्णता प्रमाण पत्र प्राप्त होता है।
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* REAL PAGE PICTURES & PRINTABLE WORKSHEETS GALLERY */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-lg font-black text-white flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-orange-400" />
                          <span>असली सचित्र पेज गैलरी एवं प्रिंटेबल वर्कशीट्स (8 Master Worksheets)</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          प्रत्येक पेज का सचित्र प्रारूप देखें, बड़ा ज़ूम करें, अलग से प्रिंट करें या डिवाइस में सेव करें।
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-amber-400">
                        8 विशिष्ट मुद्रण योग्य पृष्ठ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {BAL_VIKAS_PRINTABLE_PAGES.map((page) => (
                        <div
                          key={page.id}
                          className="rounded-3xl bg-slate-950 border border-slate-800 hover:border-orange-500/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
                        >
                          {/* Page Image Preview Banner */}
                          <div className="relative h-44 overflow-hidden bg-slate-900">
                            <img
                              src={page.image}
                              alt={page.titleHindi}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                            
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                                {page.badge}
                              </span>
                            </div>

                            <div className="absolute top-2.5 right-2.5">
                              <button
                                onClick={() => setEnlargedPage(page)}
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

                          {/* Page Card Body */}
                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                {page.description}
                              </p>

                              <ul className="space-y-1 text-[11px] text-slate-400">
                                {page.highlights.slice(0, 2).map((h, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                    <span className="truncate">{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Card Buttons */}
                            <div className="pt-2 border-t border-slate-850 flex items-center gap-1.5">
                              <button
                                onClick={() => setEnlargedPage(page)}
                                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-slate-800"
                              >
                                <Eye className="w-3 h-3" />
                                <span>बड़ा देखें</span>
                              </button>

                              <button
                                onClick={() => handlePrintSinglePage(page)}
                                className="p-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors border border-slate-800"
                                title="यह पेज प्रिंट करें"
                              >
                                <Printer className="w-3.5 h-3.5 text-blue-400" />
                              </button>

                              <button
                                onClick={() => handleDownloadSinglePage(page)}
                                className="p-1.5 px-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors shadow"
                                title="फाइल डाउनलोड करें"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* DEFAULT DOWNLOAD FOR PLANS 02 TO 07 */
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 text-center max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/40 text-orange-400 mx-auto flex items-center justify-center shadow-lg">
                    <Download className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-lg text-white">
                      ऑफलाइन अध्ययन हेतु सम्पूर्ण पैकेज डाउनलोड करें
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      इस बटन पर क्लिक करते ही <strong>{activeResource?.title || 'IOIS किट'}</strong> की सम्पूर्ण पाठ्य सामग्री, नोट्स और वर्कशीट्स आपके फोन या कंप्यूटर में तुरंत सेव हो जाएँगी।
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span>साइज: <strong>{activeResource.fileSize || '48.2 MB'}</strong> • मुद्रण योग्य (Printable) • <strong>₹{planFee} योजना में अधिकृत व शामिल</strong> (70% पेआउट इंसेंटिव)</span>
                  </div>

                  <button
                    onClick={handleDownloadFile}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                  >
                    <Download className="w-4 h-4" />
                    <span>डाउनलोड प्रारंभ करें (Instant Download)</span>
                  </button>
                </div>
              )}

              {/* ENLARGED PAGE LIGHTBOX MODAL */}
              {enlargedPage && (
                <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                  <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                    
                    {/* Modal Header */}
                    <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider block">
                          पेज #{enlargedPage.pageNum} • {enlargedPage.category}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-white">
                          {enlargedPage.titleHindi}
                        </h4>
                      </div>

                      <button
                        onClick={() => setEnlargedPage(null)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Scrollable Body - Simulated Printable A4 Sheet */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                      
                      {/* Image Preview Banner */}
                      <div className="relative rounded-2xl overflow-hidden h-44 sm:h-52 border border-slate-800 shadow">
                        <img
                          src={enlargedPage.image}
                          alt={enlargedPage.titleHindi}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-4 flex flex-col justify-end">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white w-max mb-1">
                            {enlargedPage.badge}
                          </span>
                          <h5 className="text-base font-black text-white">{enlargedPage.titleEnglish}</h5>
                        </div>
                      </div>

                      {/* Student info box */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-dashed border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                        <div><strong className="text-slate-400">विद्यार्थी:</strong> ________________</div>
                        <div><strong className="text-slate-400">कक्षा:</strong> ______</div>
                        <div><strong className="text-slate-400">दिनांक:</strong> ________</div>
                        <div><strong className="text-emerald-400">प्राप्तांक:</strong> ___/20</div>
                      </div>

                      {/* Daily Tasks */}
                      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 space-y-2">
                        <strong className="font-bold block text-amber-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          <span>दैनिक अभ्यास निर्देश एवं कार्य (Practice Tasks):</span>
                        </strong>
                        <ul className="space-y-1 pl-1">
                          {enlargedPage.tasks.map((task, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Full Worksheet Content Box */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px] sm:text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {enlargedPage.textContent}
                      </div>

                    </div>

                    {/* Modal Footer Toolbar */}
                    <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="text-slate-400 font-bold">
                        IOIS Official Bal Vikas Printable Kit (A4 300 DPI Ready)
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePrintSinglePage(enlargedPage)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow"
                        >
                          <Printer className="w-4 h-4" />
                          <span>यह शीट प्रिंट करें</span>
                        </button>

                        <button
                          onClick={() => handleDownloadSinglePage(enlargedPage)}
                          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow"
                        >
                          <Download className="w-4 h-4" />
                          <span>फाइल डाउनलोड करें</span>
                        </button>

                        <button
                          onClick={() => setEnlargedPage(null)}
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

          {/* TAB 4: 🎯 COMPETITION READY (CLASSES 7-12 RANDOMIZED NEET/JEE PRACTICE ZONE) */}
          {selectedTab === 'competition' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <CompetitionReadyPracticeZone initialClass={selectedClass >= 7 ? selectedClass : 11} />
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>IOIS Digital Knowledge Base • अधिकृत सदस्य: {currentUser ? currentUser.name : 'Vikas Kumar'} (₹{planFee} Plan)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>डाउनलोड / सेव करें</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
            >
              बंद करें
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
