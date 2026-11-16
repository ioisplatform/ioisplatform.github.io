import { RashiForecast } from '../types';

export interface DailyRashiForecast extends RashiForecast {
  forecastDateKey: string;
  forecastDateHi: string;
  vaaraLord: string;
  swami: string;
}

export interface KundliInput {
  name?: string;
  dob: string; // YYYY-MM-DD, DD-MM-YYYY, or DD/MM/YYYY
  birthTime?: string; // HH:MM or HH:MM AM/PM
  birthPlace?: string;
}

export interface KundliPlanetPosition {
  planetHi: string;
  planetEn: string;
  rashiIndex: number;
  rashiHi: string;
  rashiEn: string;
  degree: number;
  house: number;
  isRetrograde?: boolean;
}

export interface VedicKundliReport {
  name: string;
  dobFormatted: string;
  birthTimeFormatted: string;
  birthPlace: string;
  coordinatesLabel: string;
  lagnaIndex: number;
  lagnaHi: string;
  lagnaLord: string;
  chandraRashiIndex: number;
  chandraRashiHi: string;
  chandraRashiLord: string;
  suryaRashiHi: string;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  charanAkshar: string;
  gana: string;
  nadi: string;
  varna: string;
  yoni: string;
  tattva: string;
  paya: string;
  planets: KundliPlanetPosition[];
  manglikStatus: string;
  kaalSarpStatus: string;
  shaniStatus: string;
  currentMahadasha: string;
  currentAntardasha: string;
  mahadashaPeriodLabel: string;
  luckyRatna: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDay: string;
  ishtaDevta: string;
  mantra: string;
  careerPrediction: string;
  marriagePrediction: string;
  wealthPrediction: string;
  healthPrediction: string;
  yearlyForecast: string;
  remedies: string[];
  formattedTextHi: string;
}

const RASHI_META = [
  {
    id: 'mesh',
    nameHindi: 'मेष राशि (Mesh)',
    shortHi: 'मेष',
    nameEnglish: 'Aries',
    symbol: '♈',
    dateRange: '21 मार्च - 19 अप्रैल',
    element: 'अग्नि (Fire)',
    swami: 'मंगल (Mars)',
    baseNumber: 9,
    ratna: 'मूंगा (Red Coral)',
    ishta: 'श्री हनुमान जी',
    mantra: 'ॐ अं अंगारकाय नमः',
    luckyDay: 'मंगलवार व रविवार',
    colors: [
      { label: 'लाल व सिंदूरी (Red)', hex: '#EF4444' },
      { label: 'नारंगी व केसरिया (Orange)', hex: '#F97316' },
      { label: 'सुनहरा व तांबई (Copper Gold)', hex: '#F59E0B' },
      { label: 'गुलाबी व मूंगा (Coral Pink)', hex: '#F43F5E' },
    ],
    times: ['08:00 AM - 10:30 AM', '11:45 AM - 01:15 PM', '04:15 PM - 05:45 PM', '07:10 AM - 08:50 AM'],
  },
  {
    id: 'vrishabh',
    nameHindi: 'वृषभ राशि (Vrishabh)',
    shortHi: 'वृषभ',
    nameEnglish: 'Taurus',
    symbol: '♉',
    dateRange: '20 अप्रैल - 20 मई',
    element: 'पृथ्वी (Earth)',
    swami: 'शुक्र (Venus)',
    baseNumber: 6,
    ratna: 'हीरा / ओपल (Opal)',
    ishta: 'मां महालक्ष्मी / दुर्गा जी',
    mantra: 'ॐ शुं शुक्राय नमः',
    luckyDay: 'शुक्रवार व बुधवार',
    colors: [
      { label: 'सफेद व क्रीम (White)', hex: '#F1F5F9' },
      { label: 'हल्का गुलाबी (Soft Pink)', hex: '#F472B6' },
      { label: 'सिल्वर व मोती (Silver)', hex: '#CBD5E1' },
      { label: 'हल्का हरा (Mint Green)', hex: '#34D399' },
    ],
    times: ['11:15 AM - 01:45 PM', '09:00 AM - 10:40 AM', '03:20 PM - 05:00 PM', '06:45 AM - 08:30 AM'],
  },
  {
    id: 'mithun',
    nameHindi: 'मिथुन राशि (Mithun)',
    shortHi: 'मिथुन',
    nameEnglish: 'Gemini',
    symbol: '♊',
    dateRange: '21 मई - 20 जून',
    element: 'वायु (Air)',
    swami: 'बुध (Mercury)',
    baseNumber: 5,
    ratna: 'पन्ना (Emerald)',
    ishta: 'श्री गणेश जी',
    mantra: 'ॐ बुं बुधाय नमः',
    luckyDay: 'बुधवार व शुक्रवार',
    colors: [
      { label: 'हरा व तोतिया (Green)', hex: '#10B981' },
      { label: 'पन्ना व फिरोजी (Emerald)', hex: '#059669' },
      { label: 'हल्का पीला (Lemon Yellow)', hex: '#FACC15' },
      { label: 'आसमानी (Sky Blue)', hex: '#38BDF8' },
    ],
    times: ['03:30 PM - 05:45 PM', '10:15 AM - 12:00 PM', '08:20 AM - 10:00 AM', '01:30 PM - 03:10 PM'],
  },
  {
    id: 'kark',
    nameHindi: 'कर्क राशि (Kark)',
    shortHi: 'कर्क',
    nameEnglish: 'Cancer',
    symbol: '♋',
    dateRange: '21 जून - 22 जुलाई',
    element: 'जल (Water)',
    swami: 'चंद्र (Moon)',
    baseNumber: 2,
    ratna: 'मोती (Pearl)',
    ishta: 'भगवान शिव (महादेव)',
    mantra: 'ॐ सों सोमाय नमः',
    luckyDay: 'सोमवार व गुरुवार',
    colors: [
      { label: 'सिल्वर व दूधिया (Silver)', hex: '#E2E8F0' },
      { label: 'मोती व सफेद (Pearl White)', hex: '#F8FAFC' },
      { label: 'हल्का नीला (Ice Blue)', hex: '#7DD3FC' },
      { label: 'क्रीम व सुनहरा (Cream Gold)', hex: '#FDE68A' },
    ],
    times: ['07:30 AM - 09:15 AM', '12:15 PM - 01:55 PM', '05:00 PM - 06:30 PM', '09:40 AM - 11:20 AM'],
  },
  {
    id: 'singh',
    nameHindi: 'सिंह राशि (Singh)',
    shortHi: 'सिंह',
    nameEnglish: 'Leo',
    symbol: '♌',
    dateRange: '23 जुलाई - 22 अगस्त',
    element: 'अग्नि (Fire)',
    swami: 'सूर्य (Sun)',
    baseNumber: 1,
    ratna: 'माणिक्य (Ruby)',
    ishta: 'भगवान सूर्य नारायण / श्री राम',
    mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    luckyDay: 'रविवार व मंगलवार',
    colors: [
      { label: 'सुनहरा व नारंगी (Golden)', hex: '#F59E0B' },
      { label: 'तांबई व लाल (Crimson)', hex: '#DC2626' },
      { label: 'केसरिया (Saffron)', hex: '#FB923C' },
      { label: 'पीला व चमकदार (Amber)', hex: '#FBBF24' },
    ],
    times: ['09:00 AM - 11:30 AM', '06:45 AM - 08:15 AM', '12:30 PM - 02:15 PM', '03:45 PM - 05:15 PM'],
  },
  {
    id: 'kanya',
    nameHindi: 'कन्या राशि (Kanya)',
    shortHi: 'कन्या',
    nameEnglish: 'Virgo',
    symbol: '♍',
    dateRange: '23 अगस्त - 22 सितंबर',
    element: 'पृथ्वी (Earth)',
    swami: 'बुध (Mercury)',
    baseNumber: 5,
    ratna: 'पन्ना (Emerald)',
    ishta: 'श्री गणेश जी / मां दुर्गा',
    mantra: 'ॐ ऐं क्लीं चामुण्डायै विच्चे',
    luckyDay: 'बुधवार व शनिवार',
    colors: [
      { label: 'गहरा हरा व पन्ना (Emerald)', hex: '#059669' },
      { label: 'हल्का पीला व क्रीम (Cream)', hex: '#FEF08A' },
      { label: 'सफेद व हल्का हरा (Pastel Green)', hex: '#6EE7B7' },
      { label: 'भूरा व सुनहरा (Earthy Gold)', hex: '#D97706' },
    ],
    times: ['01:00 PM - 03:00 PM', '08:30 AM - 10:15 AM', '11:30 AM - 01:00 PM', '04:30 PM - 06:00 PM'],
  },
  {
    id: 'tula',
    nameHindi: 'तुला राशि (Tula)',
    shortHi: 'तुला',
    nameEnglish: 'Libra',
    symbol: '♎',
    dateRange: '23 सितंबर - 22 अक्टूबर',
    element: 'वायु (Air)',
    swami: 'शुक्र (Venus)',
    baseNumber: 6,
    ratna: 'ओपल / हीरा (Diamond)',
    ishta: 'मां दुर्गा / संतोषी माता',
    mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    luckyDay: 'शुक्रवार व सोमवार',
    colors: [
      { label: 'गुलाबी व आसमानी (Pink/Sky)', hex: '#EC4899' },
      { label: 'चमकीला सफेद (Bright White)', hex: '#F1F5F9' },
      { label: 'हल्का नीला (Royal Sky)', hex: '#60A5FA' },
      { label: 'लैवेंडर व क्रीम (Lavender)', hex: '#C084FC' },
    ],
    times: ['12:00 PM - 02:30 PM', '09:30 AM - 11:15 AM', '04:00 PM - 05:30 PM', '07:45 AM - 09:20 AM'],
  },
  {
    id: 'vrishchik',
    nameHindi: 'वृश्चिक राशि (Vrishchik)',
    shortHi: 'वृश्चिक',
    nameEnglish: 'Scorpio',
    symbol: '♏',
    dateRange: '23 अक्टूबर - 21 नवंबर',
    element: 'जल (Water)',
    swami: 'मंगल (Mars)',
    baseNumber: 9,
    ratna: 'मूंगा (Red Coral)',
    ishta: 'श्री हनुमान जी / भैरव जी',
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    luckyDay: 'मंगलवार व गुरुवार',
    colors: [
      { label: 'गहरा लाल व महरून (Maroon)', hex: '#991B1B' },
      { label: 'सिंदूरी नारंगी (Vermilion)', hex: '#EA580C' },
      { label: 'हल्का पीला (Saffron Gold)', hex: '#F59E0B' },
      { label: 'गुलाबी व लाल (Rose Red)', hex: '#E11D48' },
    ],
    times: ['02:45 PM - 04:30 PM', '08:15 AM - 10:00 AM', '11:50 AM - 01:25 PM', '05:15 PM - 06:45 PM'],
  },
  {
    id: 'dhanu',
    nameHindi: 'धनु राशि (Dhanu)',
    shortHi: 'धनु',
    nameEnglish: 'Sagittarius',
    symbol: '♐',
    dateRange: '22 नवंबर - 21 दिसंबर',
    element: 'अग्नि (Fire)',
    swami: 'बृहस्पति / गुरु (Jupiter)',
    baseNumber: 3,
    ratna: 'पुखराज (Yellow Sapphire)',
    ishta: 'भगवान श्री विष्णु / दत्तात्रेय',
    mantra: 'ॐ बृं बृहस्पतये नमः',
    luckyDay: 'गुरुवार व रविवार',
    colors: [
      { label: 'पीला व केसरिया (Yellow)', hex: '#FBBF24' },
      { label: 'सुनहरा व हल्दी (Golden)', hex: '#EAB308' },
      { label: 'नारंगी (Warm Orange)', hex: '#F97316' },
      { label: 'क्रीम व चंदन (Sandal Cream)', hex: '#FDE047' },
    ],
    times: ['10:00 AM - 12:30 PM', '07:15 AM - 09:00 AM', '02:00 PM - 03:45 PM', '04:45 PM - 06:15 PM'],
  },
  {
    id: 'makar',
    nameHindi: 'मकर राशि (Makar)',
    shortHi: 'मकर',
    nameEnglish: 'Capricorn',
    symbol: '♑',
    dateRange: '22 दिसंबर - 19 जनवरी',
    element: 'पृथ्वी (Earth)',
    swami: 'शनि (Saturn)',
    baseNumber: 8,
    ratna: 'नीलम / जामुनिया (Blue Sapphire)',
    ishta: 'भगवान शनि देव / श्री कृष्ण',
    mantra: 'ॐ शं शनैश्चराय नमः',
    luckyDay: 'शनिवार व बुधवार',
    colors: [
      { label: 'नीला व जामुनी (Blue)', hex: '#3B82F6' },
      { label: 'स्लेटी व नेवी (Navy Slate)', hex: '#475569' },
      { label: 'हरा व गहरा नीला (Teal Blue)', hex: '#0D9488' },
      { label: 'बैंगनी (Indigo)', hex: '#6366F1' },
    ],
    times: ['04:00 PM - 06:15 PM', '09:15 AM - 11:00 AM', '01:15 PM - 02:55 PM', '07:30 AM - 09:00 AM'],
  },
  {
    id: 'kumbh',
    nameHindi: 'कुंभ राशि (Kumbh)',
    shortHi: 'कुंभ',
    nameEnglish: 'Aquarius',
    symbol: '♒',
    dateRange: '20 जनवरी - 18 फरवरी',
    element: 'वायु (Air)',
    swami: 'शनि (Saturn)',
    baseNumber: 8,
    ratna: 'नीलम / अमैथिस्ट (Amethyst)',
    ishta: 'भगवान शिव / श्री हनुमान जी',
    mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    luckyDay: 'शनिवार व शुक्रवार',
    colors: [
      { label: 'आसमानी व फिरोजी (Cyan)', hex: '#06B6D4' },
      { label: 'गहरा नीला (Electric Blue)', hex: '#2563EB' },
      { label: 'बैंगनी व जामुनी (Violet)', hex: '#8B5CF6' },
      { label: 'सफेद व नीला (Sky White)', hex: '#38BDF8' },
    ],
    times: ['01:30 PM - 03:45 PM', '10:30 AM - 12:15 PM', '05:00 PM - 06:30 PM', '08:00 AM - 09:40 AM'],
  },
  {
    id: 'meen',
    nameHindi: 'मीन राशि (Meen)',
    shortHi: 'मीन',
    nameEnglish: 'Pisces',
    symbol: '♓',
    dateRange: '19 फरवरी - 20 मार्च',
    element: 'जल (Water)',
    swami: 'बृहस्पति / गुरु (Jupiter)',
    baseNumber: 3,
    ratna: 'पुखराज (Yellow Sapphire)',
    ishta: 'भगवान श्री नारायण / राम जी',
    mantra: 'ॐ नमो भगवते वासुदेवाय',
    luckyDay: 'गुरुवार व सोमवार',
    colors: [
      { label: 'पीला व सुनहरा (Golden)', hex: '#EAB308' },
      { label: 'केसरिया व चंदन (Saffron)', hex: '#F59E0B' },
      { label: 'समुद्री हरा (Sea Green)', hex: '#14B8A6' },
      { label: 'गुलाबी व क्रीम (Peach Cream)', hex: '#FDA4AF' },
    ],
    times: ['09:30 AM - 11:45 AM', '07:00 AM - 08:45 AM', '02:30 PM - 04:10 PM', '12:10 PM - 01:50 PM'],
  },
];

const DAILY_OVERVIEW_POOL: string[][] = [
  [
    'आज का दिन नई ऊर्जा और निर्णायक सफलता लेकर आया है। लंबे समय से अटका हुआ कोई महत्वपूर्ण काम दोपहर बाद तेजी से आगे बढ़ेगा। आत्मविश्वास और धैर्य से लिए गए फैसले बड़ा लाभ देंगे।',
    'ग्रह गोचर आज आपके पराक्रम व कार्यक्षमता को प्रबल कर रहे हैं। किसी प्रभावशाली व्यक्ति या अधिकारी से भेंट लाभकारी रहेगी। जल्दबाजी में कोई बड़ा खर्च या वाद-विवाद टालना उत्तम रहेगा।',
    'आज चंद्रमा का गोचर आपके लिए मानसिक स्पष्टता और नई योजनाओं की शुरुआत का संकेत दे रहा है। विद्यार्थी व युवाओं को प्रतियोगिता या इंटरव्यू में सकारात्मक परिणाम मिल सकते हैं।',
    'आज सकारात्मक सोच और अनुशासन आपका सबसे बड़ा हथियार रहेगा। रुका हुआ धन वापस मिलने या किसी पुराने निवेश से लाभ होने की प्रबल संभावना है। शाम का समय परिवार संग सुखद बीतेगा।',
    'आज भाग्य का सितारा ऊंचाई पर है। क्रिएटिव, डिजिटल और संवाद से जुड़े कार्यों में विशेष पहचान मिलेगी। शुभ समाचार मिलने से घर में उत्साह का माहौल रहेगा।',
  ],
];

const OVERVIEW_THEMES_BY_VAARA: Record<number, { planet: string; theme: string }> = {
  0: { planet: 'सूर्य देव', theme: 'मान-सम्मान, सरकारी कार्य और नेतृत्व' },
  1: { planet: 'चंद्र देव', theme: 'मानसिक शांति, पारिवारिक सुख और रचनात्मकता' },
  2: { planet: 'मंगल देव', theme: 'साहस, भूमि-भवन कार्य और ऊर्जा' },
  3: { planet: 'बुध देव', theme: 'बुद्धि, व्यापार, डिजिटल कार्य और संवाद' },
  4: { planet: 'बृहस्पति देव', theme: 'ज्ञान, शिक्षा, भाग्य वृद्धि और धर्म-कर्म' },
  5: { planet: 'शुक्र देव', theme: 'भौतिक सुख, कला, प्रेम और धन आगमन' },
  6: { planet: 'शनि देव', theme: 'कठोर परिश्रम का फल, अनुशासन और स्थायी लाभ' },
};

const CAREER_VARIATIONS = [
  'कारोबार व ऑनलाइन डिजिटल प्लेटफॉर्म से अतिरिक्त आय के योग बन रहे हैं। नए ग्राहकों या साझेदारों से संपर्क लाभकारी सिद्ध होगा।',
  'कार्यक्षेत्र में आपकी मेहनत व ईमानदारी की सराहना होगी। रुके हुए प्रोजेक्ट्स व पेमेंट क्लियर होने से आर्थिक स्थिति मजबूत होगी।',
  'नौकरीपेशा व स्व-रोजगार वालों के लिए नए अवसर खुलेंगे। रेफरल, कंसल्टिंग और शिक्षा संबंधी कार्यों में उम्मीद से अधिक प्रगति संभव है।',
  'व्यापार विस्तार की योजना सफल रहेगी, लेकिन बड़े निवेश से पहले दस्तावेजों की पूरी जांच जरूर कर लें। बचत में वृद्धि होगी।',
  'छात्रों, फ्रीलांसरों और डिजिटल उद्यमियों के लिए दिन विशेष शुभ है। टीम वर्क से कठिन लक्ष्य भी समय से पहले पूरा हो जाएगा।',
];

const HEALTH_VARIATIONS = [
  'शारीरिक ऊर्जा अच्छी रहेगी, हालांकि बदलते मौसम में पर्याप्त पानी पिएं और तले-भुने भोजन से परहेज करें।',
  'मानसिक तनाव से बचने के लिए प्रातः 15 मिनट प्राणायाम व गहरी सांस का अभ्यास करें। पुरानी थकान में राहत महसूस होगी।',
  'कंधे, गर्दन या आंखों की थकान से बचने हेतु स्क्रीन टाइम संतुलित रखें। शाम की सैर और समय पर नींद बेहद लाभदायक रहेगी।',
  'पाचन तंत्र व दिनचर्या का ध्यान रखें। मौसमी फल और हल्का सुपाच्य आहार आज आपकी कार्यशक्ति को दोगुना रखेगा।',
  'आज स्फूर्ति और सकारात्मक ऊर्जा बनी रहेगी। योग या हल्के व्यायाम से शरीर में लचीलापन और मन में प्रसन्नता रहेगी।',
];

const LOVE_VARIATIONS = [
  'परिवार में जीवनसाथी व माता-पिता का भरपूर सहयोग मिलेगा। शाम को अपनों के साथ समय बिताने से मन प्रफुल्लित रहेगा।',
  'रिश्तों में मधुरता और विश्वास बढ़ेगा। अविवाहित जातकों के लिए शुभ प्रस्ताव या पारिवारिक चर्चा आगे बढ़ सकती है।',
  'मित्रों व भाई-बहन के सहयोग से कोई घरेलू चिंता दूर होगी। संवाद में विनम्रता रखने से हर गलतफहमी समाप्त होगी।',
  'संतान की शिक्षा या करियर से जुड़ा कोई शुभ समाचार मिल सकता है। घर में मांगलिक या धार्मिक आयोजन की रूपरेखा बनेगी।',
  'दांपत्य जीवन में सामंजस्य बेहतर रहेगा। पुराने मतभेद सुलझाने और अपनों को छोटा उपहार देने के लिए दिन अनुकूल है।',
];

const REMEDY_VARIATIONS = [
  'प्रातः स्नान के बाद सूर्य देव को जल अर्पित करें और गायत्री मंत्र का 11 बार जप करें।',
  'आज अपने इष्टदेव का स्मरण कर माथे पर हल्दी या चंदन का तिलक लगाकर घर से निकलें।',
  'जरूरतमंद व्यक्ति या गौ माता को हरा चारा, गुड़ अथवा अन्न का दान करने से कार्य बाधा दूर होगी।',
  'शाम के समय घर के मंदिर में घी का दीपक जलाएं और ॐ नमो भगवते वासुदेवाय मंत्र का जप करें।',
  'तुलसी के पौधे को जल दें तथा बड़े-बुजुर्गों का चरण स्पर्श कर आशीर्वाद अवश्य लें।',
];

function getIstDateParts(date: Date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
    const parts = formatter.formatToParts(date);
    const year = Number(parts.find((p) => p.type === 'year')?.value || date.getFullYear());
    const month = Number(parts.find((p) => p.type === 'month')?.value || date.getMonth() + 1);
    const day = Number(parts.find((p) => p.type === 'day')?.value || date.getDate());
    const wk = parts.find((p) => p.type === 'weekday')?.value || 'Sun';
    const wkMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const weekdayIdx = wkMap[wk] ?? date.getDay();
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateHi = date.toLocaleDateString('hi-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return { year, month, day, weekdayIdx, dateKey, dateHi };
  } catch {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return {
      year: y,
      month: m,
      day: d,
      weekdayIdx: date.getDay(),
      dateKey: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dateHi: date.toLocaleDateString('hi-IN'),
    };
  }
}

function deterministicHash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Generates genuinely dynamic, daily-updating 12 Rashi forecasts tied to IST calendar date & planetary weekday
 */
export function computeDailyRashifalForDate(
  rashiId?: string,
  targetDate: Date = new Date()
): DailyRashiForecast[] {
  const ist = getIstDateParts(targetDate);
  const vaara = OVERVIEW_THEMES_BY_VAARA[ist.weekdayIdx] || OVERVIEW_THEMES_BY_VAARA[0];

  const all: DailyRashiForecast[] = RASHI_META.map((meta, idx) => {
    const daySeed = deterministicHash(`${ist.dateKey}|${meta.id}|${idx}`);
    const cIdx = (daySeed >>> 2) % meta.colors.length;
    const tIdx = (daySeed >>> 5) % meta.times.length;
    const oIdx = (daySeed >>> 8) % DAILY_OVERVIEW_POOL[0].length;
    const crIdx = (daySeed >>> 11) % CAREER_VARIATIONS.length;
    const hIdx = (daySeed >>> 14) % HEALTH_VARIATIONS.length;
    const lIdx = (daySeed >>> 17) % LOVE_VARIATIONS.length;
    const remIdx = (daySeed >>> 20) % REMEDY_VARIATIONS.length;

    const luckyColorObj = meta.colors[cIdx];
    const luckyNumber = ((meta.baseNumber + (ist.day + idx * 3 + ist.month)) % 9) + 1;
    const ratingScore = 3 + ((daySeed + ist.day + idx) % 3); // 3, 4, or 5 stars daily

    const chandraTransitHouse = ((ist.day * 2 + ist.month + idx) % 12) + 1;
    const transitTag =
      chandraTransitHouse === 1 || chandraTransitHouse === 5 || chandraTransitHouse === 9 || chandraTransitHouse === 11
        ? `चंद्र देव के शुभ ${chandraTransitHouse}वें भाव गोचर और ${vaara.planet} के प्रभाव से आज ${vaara.theme} के क्षेत्र में विशेष अनुकूलता मिलेगी।`
        : `आज ${vaara.planet} की दृष्टि से ${vaara.theme} से जुड़े कार्यों में सोच-समझकर कदम बढ़ाना फलदायी रहेगा।`;

    const baseOverview = DAILY_OVERVIEW_POOL[0][(oIdx + idx) % DAILY_OVERVIEW_POOL[0].length];

    return {
      id: meta.id,
      nameHindi: meta.nameHindi,
      nameEnglish: meta.nameEnglish,
      symbol: meta.symbol,
      dateRange: meta.dateRange,
      element: meta.element,
      luckyColor: luckyColorObj.label,
      luckyColorHex: luckyColorObj.hex,
      luckyNumber,
      luckyTime: meta.times[tIdx],
      rating: Math.min(5, Math.max(3, ratingScore)),
      overview: `${transitTag} ${baseOverview}`,
      careerFinance: `${CAREER_VARIATIONS[(crIdx + idx) % CAREER_VARIATIONS.length]} राशि स्वामी ${meta.swami} के प्रभाव से लेन-देन में सतर्कता लाभ बढ़ाएगी।`,
      healthWellness: HEALTH_VARIATIONS[(hIdx + idx) % HEALTH_VARIATIONS.length],
      loveFamily: LOVE_VARIATIONS[(lIdx + idx) % LOVE_VARIATIONS.length],
      remedy: `${REMEDY_VARIATIONS[(remIdx + idx) % REMEDY_VARIATIONS.length]} साथ ही '${meta.mantra}' का 11 बार जप करें।`,
      forecastDateKey: ist.dateKey,
      forecastDateHi: ist.dateHi,
      vaaraLord: vaara.planet,
      swami: meta.swami,
    };
  });

  if (rashiId && rashiId !== 'all') {
    const clean = rashiId.trim().toLowerCase();
    return all.filter(
      (r) =>
        r.id === clean ||
        r.nameEnglish.toLowerCase() === clean ||
        r.nameHindi.toLowerCase().includes(clean)
    );
  }
  return all;
}

// =========================================================================
// AUTHENTIC VEDIC JANAM KUNDLI GENERATOR (DOB + Time + Place)
// =========================================================================

const INDIAN_CITY_COORDS: Array<{ keys: string[]; name: string; lat: number; lon: number }> = [
  { keys: ['patna', 'पटना'], name: 'पटना (बिहार)', lat: 25.5941, lon: 85.1376 },
  { keys: ['gaya', 'गया'], name: 'गया (बिहार)', lat: 24.7914, lon: 85.0002 },
  { keys: ['muzaffarpur', 'मुजफ्फरपुर'], name: 'मुजफ्फरपुर (बिहार)', lat: 26.1197, lon: 85.391 },
  { keys: ['darbhanga', 'दरभंगा'], name: 'दरभंगा (बिहार)', lat: 26.1542, lon: 85.8918 },
  { keys: ['bhagalpur', 'भागलपुर'], name: 'भागलपुर (बिहार)', lat: 25.2425, lon: 86.9842 },
  { keys: ['purnia', 'पूर्णिया'], name: 'पूर्णिया (बिहार)', lat: 25.7771, lon: 87.4753 },
  { keys: ['siwan', 'सिवान'], name: 'सिवान (बिहार)', lat: 26.2243, lon: 84.36 },
  { keys: ['chapra', 'छपरा', 'saran'], name: 'छपरा (बिहार)', lat: 25.7811, lon: 84.7499 },
  { keys: ['ara', 'arrah', 'आरा'], name: 'आरा (बिहार)', lat: 25.5542, lon: 84.6632 },
  { keys: ['begusarai', 'बेगूसराय'], name: 'बेगूसराय (बिहार)', lat: 25.4182, lon: 86.1272 },
  { keys: ['samastipur', 'समस्तीपुर'], name: 'समस्तीपुर (बिहार)', lat: 25.8629, lon: 85.781 },
  { keys: ['nalanda', 'नालंदा', 'bihar sharif'], name: 'नालंदा (बिहार)', lat: 25.1982, lon: 85.5149 },
  { keys: ['motihari', 'मोतिहारी', 'champaran'], name: 'मोतिहारी (बिहार)', lat: 26.647, lon: 84.9089 },
  { keys: ['bettiah', 'बेतिया'], name: 'बेतिया (बिहार)', lat: 26.8027, lon: 84.5131 },
  { keys: ['delhi', 'new delhi', 'दिल्ली', 'नई दिल्ली'], name: 'नई दिल्ली', lat: 28.6139, lon: 77.209 },
  { keys: ['mumbai', 'मुंबई', 'bombay'], name: 'मुंबई (महाराष्ट्र)', lat: 19.076, lon: 72.8777 },
  { keys: ['pune', 'पुणे'], name: 'पुणे (महाराष्ट्र)', lat: 18.5204, lon: 73.8567 },
  { keys: ['nagpur', 'नागपुर'], name: 'नागपुर (महाराष्ट्र)', lat: 21.1458, lon: 79.0882 },
  { keys: ['lucknow', 'लखनऊ'], name: 'लखनऊ (उत्तर प्रदेश)', lat: 26.8467, lon: 80.9462 },
  { keys: ['varanasi', 'बनारस', 'वाराणसी', 'kashi'], name: 'वाराणसी (उत्तर प्रदेश)', lat: 25.3176, lon: 82.9739 },
  { keys: ['prayagraj', 'allahabad', 'प्रयागराज'], name: 'प्रयागराज (उत्तर प्रदेश)', lat: 25.4358, lon: 81.8463 },
  { keys: ['kanpur', 'कानपुर'], name: 'कानपुर (उत्तर प्रदेश)', lat: 26.4499, lon: 80.3319 },
  { keys: ['gorakhpur', 'गोरखपुर'], name: 'गोरखपुर (उत्तर प्रदेश)', lat: 26.7606, lon: 83.3732 },
  { keys: ['ayodhya', 'अयोध्या'], name: 'अयोध्या (उत्तर प्रदेश)', lat: 26.7922, lon: 82.1998 },
  { keys: ['agra', 'आगरा'], name: 'आगरा (उत्तर प्रदेश)', lat: 27.1767, lon: 78.0081 },
  { keys: ['noida', 'नोएडा'], name: 'नोएडा (उत्तर प्रदेश)', lat: 28.5355, lon: 77.391 },
  { keys: ['ranchi', 'रांची'], name: 'रांची (झारखंड)', lat: 23.3441, lon: 85.3096 },
  { keys: ['jamshedpur', 'जमशेदपुर'], name: 'जमशेदपुर (झारखंड)', lat: 22.8046, lon: 86.2029 },
  { keys: ['dhanbad', 'धनबाद'], name: 'धनबाद (झारखंड)', lat: 23.7957, lon: 86.4304 },
  { keys: ['kolkata', 'कोलकाता', 'calcutta'], name: 'कोलकाता (पश्चिम बंगाल)', lat: 22.5726, lon: 88.3639 },
  { keys: ['jaipur', 'जयपुर'], name: 'जयपुर (राजस्थान)', lat: 26.9124, lon: 75.7873 },
  { keys: ['bhopal', 'भोपाल'], name: 'भोपाल (मध्य प्रदेश)', lat: 23.2599, lon: 77.4126 },
  { keys: ['indore', 'इंदौर'], name: 'इंदौर (मध्य प्रदेश)', lat: 22.7196, lon: 75.8577 },
  { keys: ['ahmedabad', 'अहमदाबाद'], name: 'अहमदाबाद (गुजरात)', lat: 23.0225, lon: 72.5714 },
  { keys: ['surat', 'सूरत'], name: 'सूरत (गुजरात)', lat: 21.1702, lon: 72.8311 },
  { keys: ['bengaluru', 'bangalore', 'बेंगलुरु'], name: 'बेंगलुरु (कर्नाटक)', lat: 12.9716, lon: 77.5946 },
  { keys: ['hyderabad', 'हैदराबाद'], name: 'हैदराबाद (तेलंगाना)', lat: 17.385, lon: 78.4867 },
  { keys: ['chennai', 'चेन्नई'], name: 'चेन्नई (तमिलनाडु)', lat: 13.0827, lon: 80.2707 },
  { keys: ['chandigarh', 'चंडीगढ़'], name: 'चंडीगढ़', lat: 30.7333, lon: 76.7794 },
  { keys: ['guwahati', 'गुवाहाटी'], name: 'गुवाहाटी (असम)', lat: 26.1445, lon: 91.7362 },
  { keys: ['bhubaneswar', 'भुवनेश्वर'], name: 'भुवनेश्वर (ओडिशा)', lat: 20.2961, lon: 85.8245 },
  { keys: ['raipur', 'रायपुर'], name: 'रायपुर (छत्तीसगढ़)', lat: 21.2514, lon: 81.6296 },
  { keys: ['dehradun', 'देहरादून'], name: 'देहरादून (उत्तराखंड)', lat: 30.3165, lon: 78.0322 },
];

const NAKSHATRAS_DATA = [
  { name: 'अश्विनी (Ashwini)', lord: 'केतु (Ketu)', gana: 'देव गण', yoni: 'अश्व', nadi: 'आद्य', chars: ['चू', 'चे', 'चो', 'ला'] },
  { name: 'भरणी (Bharani)', lord: 'शुक्र (Venus)', gana: 'मनुष्य गण', yoni: 'गज', nadi: 'मध्य', chars: ['ली', 'लू', 'ले', 'लो'] },
  { name: 'कृत्तिका (Krittika)', lord: 'सूर्य (Sun)', gana: 'राक्षस गण', yoni: 'मेष', nadi: 'अंत्य', chars: ['अ', 'ई', 'उ', 'ए'] },
  { name: 'रोहिणी (Rohini)', lord: 'चंद्र (Moon)', gana: 'मनुष्य गण', yoni: 'सर्प', nadi: 'अंत्य', chars: ['ओ', 'वा', 'वी', 'वु'] },
  { name: 'मृगशिरा (Mrigashirsha)', lord: 'मंगल (Mars)', gana: 'देव गण', yoni: 'सर्प', nadi: 'मध्य', chars: ['वे', 'वो', 'का', 'की'] },
  { name: 'आर्द्रा (Ardra)', lord: 'राहु (Rahu)', gana: 'मनुष्य गण', yoni: 'श्वान', nadi: 'आद्य', chars: ['कु', 'घ', 'ङ', 'छ'] },
  { name: 'पुनर्वसु (Punarvasu)', lord: 'गुरु (Jupiter)', gana: 'देव गण', yoni: 'मार्जार', nadi: 'आद्य', chars: ['के', 'को', 'हा', 'ही'] },
  { name: 'पुष्य (Pushya)', lord: 'शनि (Saturn)', gana: 'देव गण', yoni: 'मेष', nadi: 'मध्य', chars: ['हु', 'हे', 'हो', 'डा'] },
  { name: 'आश्लेषा (Ashlesha)', lord: 'बुध (Mercury)', gana: 'राक्षस गण', yoni: 'मार्जार', nadi: 'अंत्य', chars: ['डी', 'डू', 'डे', 'डो'] },
  { name: 'मघा (Magha)', lord: 'केतु (Ketu)', gana: 'राक्षस गण', yoni: 'मूषक', nadi: 'अंत्य', chars: ['मा', 'मी', 'मू', 'मे'] },
  { name: 'पूर्वाफाल्गुनी (Purva Phalguni)', lord: 'शुक्र (Venus)', gana: 'मनुष्य गण', yoni: 'मूषक', nadi: 'मध्य', chars: ['मो', 'टा', 'टी', 'टू'] },
  { name: 'उत्तराफाल्गुनी (Uttara Phalguni)', lord: 'सूर्य (Sun)', gana: 'मनुष्य गण', yoni: 'गौ', nadi: 'आद्य', chars: ['टे', 'टो', 'पा', 'पी'] },
  { name: 'हस्त (Hasta)', lord: 'चंद्र (Moon)', gana: 'देव गण', yoni: 'महिष', nadi: 'आद्य', chars: ['पू', 'ष', 'ण', 'ठ'] },
  { name: 'चित्रा (Chitra)', lord: 'मंगल (Mars)', gana: 'राक्षस गण', yoni: 'व्याघ्र', nadi: 'मध्य', chars: ['पे', 'पो', 'रा', 'री'] },
  { name: 'स्वाति (Swati)', lord: 'राहु (Rahu)', gana: 'देव गण', yoni: 'महिष', nadi: 'अंत्य', chars: ['रू', 'रे', 'रो', 'ता'] },
  { name: 'विशाखा (Vishakha)', lord: 'गुरु (Jupiter)', gana: 'राक्षस गण', yoni: 'व्याघ्र', nadi: 'अंत्य', chars: ['ती', 'तू', 'ते', 'तो'] },
  { name: 'अनुराधा (Anuradha)', lord: 'शनि (Saturn)', gana: 'देव गण', yoni: 'मृग', nadi: 'मध्य', chars: ['ना', 'नी', 'नू', 'ने'] },
  { name: 'ज्येष्ठा (Jyeshtha)', lord: 'बुध (Mercury)', gana: 'राक्षस गण', yoni: 'मृग', nadi: 'आद्य', chars: ['नो', 'या', 'यी', 'यू'] },
  { name: 'मूल (Mula)', lord: 'केतु (Ketu)', gana: 'राक्षस गण', yoni: 'श्वान', nadi: 'आद्य', chars: ['ये', 'यो', 'भा', 'भी'] },
  { name: 'पूर्वाषाढ़ा (Purva Ashadha)', lord: 'शुक्र (Venus)', gana: 'मनुष्य गण', yoni: 'वानर', nadi: 'मध्य', chars: ['भू', 'धा', 'फा', 'ढा'] },
  { name: 'उत्तराषाढ़ा (Uttara Ashadha)', lord: 'सूर्य (Sun)', gana: 'मनुष्य गण', yoni: 'नकुल', nadi: 'अंत्य', chars: ['भे', 'भो', 'जा', 'जी'] },
  { name: 'श्रवण (Shravana)', lord: 'चंद्र (Moon)', gana: 'देव गण', yoni: 'वानर', nadi: 'अंत्य', chars: ['खी', 'खू', 'खे', 'खो'] },
  { name: 'धनिष्ठा (Dhanishta)', lord: 'मंगल (Mars)', gana: 'राक्षस गण', yoni: 'सिंह', nadi: 'मध्य', chars: ['गा', 'गी', 'गू', 'गे'] },
  { name: 'शतभिषा (Shatabhisha)', lord: 'राहु (Rahu)', gana: 'राक्षस गण', yoni: 'अश्व', nadi: 'आद्य', chars: ['गो', 'सा', 'सी', 'सू'] },
  { name: 'पूर्वाभाद्रपद (Purva Bhadrapada)', lord: 'गुरु (Jupiter)', gana: 'मनुष्य गण', yoni: 'सिंह', nadi: 'आद्य', chars: ['से', 'सो', 'दा', 'दी'] },
  { name: 'उत्तराभाद्रपद (Uttara Bhadrapada)', lord: 'शनि (Saturn)', gana: 'मनुष्य गण', yoni: 'गौ', nadi: 'मध्य', chars: ['दू', 'थ', 'झ', 'ञ'] },
  { name: 'रेवती (Revati)', lord: 'बुध (Mercury)', gana: 'देव गण', yoni: 'गज', nadi: 'अंत्य', chars: ['दे', 'दो', 'चा', 'ची'] },
];

const VIMSHOTTARI_ORDER = [
  { lord: 'केतु (Ketu)', years: 7 },
  { lord: 'शुक्र (Venus)', years: 20 },
  { lord: 'सूर्य (Sun)', years: 6 },
  { lord: 'चंद्र (Moon)', years: 10 },
  { lord: 'मंगल (Mars)', years: 7 },
  { lord: 'राहु (Rahu)', years: 18 },
  { lord: 'गुरु (Jupiter)', years: 16 },
  { lord: 'शनि (Saturn)', years: 19 },
  { lord: 'बुध (Mercury)', years: 17 },
];

function normDeg(d: number): number {
  const x = d % 360;
  return x < 0 ? x + 360 : x;
}

export function parseBirthDateString(raw: string): { year: number; month: number; day: number } | null {
  const clean = (raw || '').trim();
  if (!clean) return null;

  // YYYY-MM-DD
  let m = clean.match(/\b(19\d{2}|20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) return { year: y, month: mo, day: d };
  }

  // DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
  m = clean.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](19\d{2}|20\d{2})\b/);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]);
    const y = Number(m[3]);
    if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) return { year: y, month: mo, day: d };
  }

  // Month names English/Hindi e.g. "15 August 1998" or "15 अगस्त 1998"
  const monthNames: Record<string, number> = {
    jan: 1, january: 1, जनवरी: 1,
    feb: 2, february: 2, फरवरी: 2,
    mar: 3, march: 3, मार्च: 3,
    apr: 4, april: 4, अप्रैल: 4,
    may: 5, मई: 5,
    jun: 6, june: 6, जून: 6,
    jul: 7, july: 7, जुलाई: 7,
    aug: 8, august: 8, अगस्त: 8,
    sep: 9, sept: 9, september: 9, सितंबर: 9, सितम्बर: 9,
    oct: 10, october: 10, अक्टूबर: 10,
    nov: 11, november: 11, नवंबर: 11, नवम्बर: 11,
    dec: 12, december: 12, दिसंबर: 12, दिसम्बर: 12,
  };
  const mText = clean.match(/(\d{1,2})\s+([a-zA-Z\u0900-\u097F]+)[,\s]+(19\d{2}|20\d{2})/i);
  if (mText) {
    const d = Number(mText[1]);
    const mon = monthNames[mText[2].toLowerCase()];
    const y = Number(mText[3]);
    if (mon && d >= 1 && d <= 31) return { year: y, month: mon, day: d };
  }
  return null;
}

export function parseBirthTimeString(raw?: string): { hour: number; minute: number; label: string } {
  const clean = (raw || '').trim();
  if (!clean) return { hour: 12, minute: 0, label: '12:00 PM (अनुमानित मध्याह्न)' };

  const match = clean.match(/(\d{1,2})[:.](\d{2})\s*(am|pm|बजे|सुबह|दोपहर|शाम|रात)?/i);
  if (match) {
    let h = Number(match[1]);
    const min = Number(match[2]);
    const mod = (match[3] || '').toLowerCase();
    const fullCtx = clean.toLowerCase();
    if ((mod === 'pm' || fullCtx.includes('pm') || fullCtx.includes('शाम') || fullCtx.includes('रात') || fullCtx.includes('दोपहर')) && h < 12) {
      h += 12;
    } else if ((mod === 'am' || fullCtx.includes('am') || fullCtx.includes('सुबह')) && h === 12) {
      h = 0;
    }
    h = Math.max(0, Math.min(23, h));
    const clampedMin = Math.max(0, Math.min(59, min));
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return { hour: h, minute: clampedMin, label: `${String(h12).padStart(2, '0')}:${String(clampedMin).padStart(2, '0')} ${ampm}` };
  }

  const hrOnly = clean.match(/(\d{1,2})\s*(am|pm|बजे)/i);
  if (hrOnly) {
    let h = Number(hrOnly[1]);
    const fullCtx = clean.toLowerCase();
    if ((fullCtx.includes('pm') || fullCtx.includes('शाम') || fullCtx.includes('रात') || fullCtx.includes('दोपहर')) && h < 12) h += 12;
    if ((fullCtx.includes('am') || fullCtx.includes('सुबह')) && h === 12) h = 0;
    h = Math.max(0, Math.min(23, h));
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return { hour: h, minute: 0, label: `${String(h12).padStart(2, '0')}:00 ${ampm}` };
  }

  return { hour: 12, minute: 0, label: '12:00 PM (अनुमानित)' };
}

function resolveIndianCoordinates(place?: string): { label: string; lat: number; lon: number } {
  const lower = (place || '').trim().toLowerCase();
  if (lower) {
    for (const c of INDIAN_CITY_COORDS) {
      if (c.keys.some((k) => lower.includes(k))) {
        return { label: c.name, lat: c.lat, lon: c.lon };
      }
    }
    return { label: place!.trim(), lat: 25.5941, lon: 85.1376 };
  }
  return { label: 'भारत (IST मानक केंद्र)', lat: 25.5941, lon: 82.9739 };
}

export function computeVedicJanamKundli(input: KundliInput): VedicKundliReport | null {
  const dobParts = parseBirthDateString(input.dob);
  if (!dobParts) return null;

  const { year, month, day } = dobParts;
  const timeInfo = parseBirthTimeString(input.birthTime);
  const placeInfo = resolveIndianCoordinates(input.birthPlace);
  const cleanName = (input.name || 'आदरणीय जातक').trim();

  // Convert IST (UTC+5:30) to UT decimal hours
  const istDecimalHours = timeInfo.hour + timeInfo.minute / 60;
  const utHours = istDecimalHours - 5.5;

  // Julian Day (Meeus formula)
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    utHours / 24 +
    B -
    1524.5;

  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  const d = jd - 2451545.0;

  // Lahiri Ayanamsa (approx 23.853 deg at J2000 + 50.29 arcsec/year)
  const ayanamsa = 23.853 + (50.29 / 3600) * (d / 365.25);

  // Tropical Sun Longitude
  const Msun = normDeg(357.5291 + 0.98560028 * d);
  const Lsun = normDeg(280.4665 + 0.98564736 * d);
  const lambdaSunTrop = normDeg(
    Lsun + 1.9148 * Math.sin((Msun * Math.PI) / 180) + 0.02 * Math.sin((2 * Msun * Math.PI) / 180)
  );
  const sunSid = normDeg(lambdaSunTrop - ayanamsa);

  // Tropical Moon Longitude
  const Lmoon = normDeg(218.3165 + 13.17639648 * d);
  const Mmoon = normDeg(134.9634 + 13.06499295 * d);
  const Dmoon = normDeg(297.8502 + 12.19074912 * d);
  const lambdaMoonTrop = normDeg(
    Lmoon +
      6.2886 * Math.sin((Mmoon * Math.PI) / 180) +
      1.274 * Math.sin(((2 * Dmoon - Mmoon) * Math.PI) / 180) +
      0.6583 * Math.sin((2 * Dmoon * Math.PI) / 180) +
      0.2136 * Math.sin((2 * Mmoon * Math.PI) / 180) -
      0.1851 * Math.sin((Msun * Math.PI) / 180)
  );
  const moonSid = normDeg(lambdaMoonTrop - ayanamsa);

  // Mean Lunar Node (Rahu)
  const rahuTrop = normDeg(125.04452 - 1934.136261 * T);
  const rahuSid = normDeg(rahuTrop - ayanamsa);
  const ketuSid = normDeg(rahuSid + 180);

  // Mean Heliocentric -> Geocentric approximate Sidereal Longitudes for Planets
  const marsSid = normDeg(355.433 + 0.5240207 * d + 10.691 * Math.sin(((19.373 + 0.5240207 * d) * Math.PI) / 180) - ayanamsa);
  const mercSid = normDeg(sunSid + 18 * Math.sin(((174.79 + 4.09233 * d) * Math.PI) / 180));
  const venSid = normDeg(sunSid + 36 * Math.sin(((50.115 + 1.60213 * d) * Math.PI) / 180));
  const jupSid = normDeg(34.3515 + 0.083091 * d + 5.555 * Math.sin(((20.02 + 0.083091 * d) * Math.PI) / 180) - ayanamsa);
  const satSid = normDeg(50.0774 + 0.033459 * d + 6.358 * Math.sin(((317.02 + 0.033459 * d) * Math.PI) / 180) - ayanamsa);

  // Local Sidereal Time & Ascendant (Lagna)
  const gmst = normDeg(280.46061837 + 360.98564736629 * d);
  const lst = normDeg(gmst + placeInfo.lon);
  const lstRad = (lst * Math.PI) / 180;
  const epsRad = (23.4393 * Math.PI) / 180;
  const latRad = (placeInfo.lat * Math.PI) / 180;

  const ascY = Math.cos(lstRad);
  const ascX = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const ascTrop = normDeg((Math.atan2(ascY, ascX) * 180) / Math.PI);
  const lagnaSid = normDeg(ascTrop - ayanamsa);

  const lagnaIndex = Math.floor(lagnaSid / 30) % 12;
  const chandraRashiIndex = Math.floor(moonSid / 30) % 12;
  const suryaRashiIndex = Math.floor(sunSid / 30) % 12;

  const lagnaMeta = RASHI_META[lagnaIndex];
  const chandraMeta = RASHI_META[chandraRashiIndex];
  const suryaMeta = RASHI_META[suryaRashiIndex];

  // Nakshatra & Pada from Chandra Longitude
  const nakSpan = 360 / 27; // 13.3333 deg
  const nakIdx = Math.floor(moonSid / nakSpan) % 27;
  const nakData = NAKSHATRAS_DATA[nakIdx];
  const remInNak = moonSid - nakIdx * nakSpan;
  const pada = Math.min(4, Math.floor(remInNak / (nakSpan / 4)) + 1);
  const charanAkshar = nakData.chars[pada - 1] || nakData.chars[0];

  // Varna, Tattva, Paya
  const varnaByElement: Record<string, string> = {
    'अग्नि (Fire)': 'क्षत्रिय वर्ण',
    'पृथ्वी (Earth)': 'वैश्य वर्ण',
    'वायु (Air)': 'शूद्र वर्ण',
    'जल (Water)': 'ब्राह्मण वर्ण',
  };
  const varna = varnaByElement[chandraMeta.element] || 'ब्राह्मण वर्ण';

  const makePlanet = (planetHi: string, planetEn: string, lon: number): KundliPlanetPosition => {
    const rIdx = Math.floor(lon / 30) % 12;
    const deg = Number((lon % 30).toFixed(2));
    const house = ((rIdx - lagnaIndex + 12) % 12) + 1;
    const rMeta = RASHI_META[rIdx];
    return {
      planetHi,
      planetEn,
      rashiIndex: rIdx,
      rashiHi: rMeta.shortHi,
      rashiEn: rMeta.nameEnglish,
      degree: deg,
      house,
    };
  };

  const planets: KundliPlanetPosition[] = [
    makePlanet('सूर्य (Sun)', 'Sun', sunSid),
    makePlanet('चंद्र (Moon)', 'Moon', moonSid),
    makePlanet('मंगल (Mars)', 'Mars', marsSid),
    makePlanet('बुध (Mercury)', 'Mercury', mercSid),
    makePlanet('बृहस्पति / गुरु (Jupiter)', 'Jupiter', jupSid),
    makePlanet('शुक्र (Venus)', 'Venus', venSid),
    makePlanet('शनि (Saturn)', 'Saturn', satSid),
    makePlanet('राहु (Rahu)', 'Rahu', rahuSid),
    makePlanet('केतु (Ketu)', 'Ketu', ketuSid),
  ];

  // Manglik check (Mars in 1, 2, 4, 7, 8, 12 from Lagna)
  const marsHouse = planets[2].house;
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglik = manglikHouses.includes(marsHouse);
  const manglikStatus = isManglik
    ? `आंशिक/प्रबल मांगलिक योग (मंगल ${marsHouse}वें भाव में स्थित — विवाह मिलान व हनुमान पूजा लाभकारी)`
    : `मांगलिक दोष नहीं (मंगल ${marsHouse}वें भाव में शुभ/सामान्य स्थिति में — कुंडली दोषमुक्त)`;

  // Kaal Sarp check
  const rahuHouse = planets[7].house;
  const ketuHouse = planets[8].house;
  const kaalSarpStatus =
    Math.abs(rahuHouse - ketuHouse) === 6
      ? 'सामान्य राहु-केतु अक्ष (कोई गंभीर कालसर्प बाधा सक्रिय नहीं — नियमित शिव आराधना शुभ)'
      : 'नियंत्रित ग्रह स्थिति';

  // Shani Sade Sati Check based on current year (~Saturn in Pisces/Meen 2025-2027)
  const currentYear = new Date().getFullYear();
  const saturnTransitRashi = currentYear >= 2025 && currentYear <= 2027 ? 11 : currentYear >= 2028 ? 0 : 10;
  const distFromMoon = (saturnTransitRashi - chandraRashiIndex + 12) % 12;
  let shaniStatus = 'साढ़ेसाती व ढैया से पूर्णतः मुक्त (शनि गोचर अनुकूल)';
  if (distFromMoon === 11 || distFromMoon === 0 || distFromMoon === 1) {
    shaniStatus = 'शनि साढ़ेसाती का प्रभाव सक्रिय (धैर्य, कर्मनिष्ठा व शनिवार दीपक दान शुभ फलदायी)';
  } else if (distFromMoon === 3 || distFromMoon === 7) {
    shaniStatus = 'शनि की ढैया (लघु कल्याणी) गोचर में सक्रिय — परिश्रम से सफलता मिलेगी';
  }

  // Vimshottari Mahadasha Calculation
  const fractionPassed = remInNak / nakSpan;
  const startLordIndex = nakIdx % 9;
  const firstLord = VIMSHOTTARI_ORDER[startLordIndex];
  const birthDateMs = Date.UTC(year, month - 1, day, timeInfo.hour, timeInfo.minute);
  const balanceYears = firstLord.years * (1 - fractionPassed);

  const nowMs = Date.now();
  let cursorMs = birthDateMs;
  let currentMahadasha = firstLord.lord;
  let currentAntardasha = firstLord.lord;
  let dashaStartYear = year;
  let dashaEndYear = Math.round(year + balanceYears);

  for (let step = 0; step < 18; step++) {
    const idx = (startLordIndex + step) % 9;
    const entry = VIMSHOTTARI_ORDER[idx];
    const durYears = step === 0 ? balanceYears : entry.years;
    const nextMs = cursorMs + durYears * 365.2425 * 24 * 60 * 60 * 1000;
    if (nowMs >= cursorMs && nowMs < nextMs) {
      currentMahadasha = entry.lord;
      dashaStartYear = new Date(cursorMs).getUTCFullYear();
      dashaEndYear = new Date(nextMs).getUTCFullYear();
      // Find Antardasha inside current Mahadasha
      const elapsedInMaha = (nowMs - cursorMs) / (365.2425 * 24 * 60 * 60 * 1000);
      let antarAcc = 0;
      for (let aStep = 0; aStep < 9; aStep++) {
        const aEntry = VIMSHOTTARI_ORDER[(idx + aStep) % 9];
        const aYears = (entry.years * aEntry.years) / 120;
        if (elapsedInMaha >= antarAcc && elapsedInMaha < antarAcc + aYears) {
          currentAntardasha = aEntry.lord;
          break;
        }
        antarAcc += aYears;
      }
      break;
    }
    cursorMs = nextMs;
  }

  // Silver / Copper / Gold Paya based on Moon Nakshatra & Rashi
  const payaCycle = (nakIdx + chandraRashiIndex) % 3;
  const paya = payaCycle === 0 ? 'रजत पाया (चांदी - अत्यंत शुभ व धनदायक)' : payaCycle === 1 ? 'ताम्र पाया (तांबा - सुख-समृद्धिदायक)' : 'स्वर्ण पाया (सोना - परिश्रम से मान-सम्मान)';

  const dobFormatted = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  const houseSummary = planets.map((p) => `• ${p.planetHi}: ${p.house}वें भाव (${p.rashiHi} राशि, ${p.degree}°)`).join('\n');

  const careerPrediction = `${lagnaMeta.shortHi} लग्न और ${chandraMeta.shortHi} चंद्र राशि के कारण जातक बुद्धिमान, महत्वाकांक्षी और आत्मनिर्भर स्वभाव का होता है। प्रशासन, शिक्षा, डिजिटल व्यवसाय, तकनीकी क्षेत्र या स्वयं का उद्यम अत्यंत सफल रहता है। वर्तमान ${currentMahadasha} महादशा करियर में ठोस उन्नति व आय के नए रास्ते खोल रही है।`;
  const marriagePrediction = `सप्तम भाव और शुक्र की स्थिति के अनुसार जीवनसाथी समझदार व सहयोगी प्राप्त होता है। ${isManglik ? 'कुंडली मिलान व मंगल शांति उपाय के उपरांत वैवाहिक जीवन सुखमय व स्थिर रहता है।' : 'दाम्पत्य जीवन में प्रेम, सम्मान और पारिवारिक सामंजस्य बना रहता है।'}`;
  const wealthPrediction = `आपकी कुंडली में धन भाव व ${chandraMeta.swami} के प्रभाव से जीवन के मध्य भाग में अचल संपत्ति, वाहन व बचत में उल्लेखनीय वृद्धि होती है। 24 से 34 वर्ष तथा वर्तमान गोचर काल आर्थिक मजबूती के लिए शुभ संकेत दे रहा है।`;
  const healthPrediction = `${chandraMeta.element} तत्व प्रधान होने से नियमित दिनचर्या, प्रातः सूर्य दर्शन और मौसमी खान-पान का ध्यान रखना आवश्यक है। योग व प्राणायाम से मानसिक बल व रोग प्रतिरोधक क्षमता मजबूत रहेगी।`;
  const yearlyForecast = `${currentYear}-${currentYear + 1} में ${currentMahadasha} महादशा व ${currentAntardasha} अंतर्दशा के प्रभाव से रुके कार्यों में गति, नए संपर्क, सम्मान तथा परिवार में शुभ समाचार के प्रबल योग हैं।`;

  const remedies = [
    `अपने राशि स्वामी ${chandraMeta.swami} व लग्न स्वामी ${lagnaMeta.swami} को बल देने हेतु नित्य '${chandraMeta.mantra}' का 11 या 21 बार जप करें।`,
    `अपने इष्टदेव ${chandraMeta.ishta} की नियमित आराधना करें और ${chandraMeta.luckyDay} को गरीबों में अन्न या मीठा दान करें।`,
    `सकारात्मक ऊर्जा के लिए घर से निकलते समय ${chandraMeta.colors[0].label} रंग के वस्त्र या रूमाल का प्रयोग करें।`,
    isManglik
      ? 'मंगलवार को हनुमान चालीसा का पाठ करें और सिंदूर व गुड़-चने का प्रसाद अर्पित करें।'
      : 'प्रातःकाल तांबे के लोटे से उगते सूर्य को जल अर्पित करें।',
  ];

  const formattedTextHi = `श्री गणेशाय नमः — वैदिक जन्म कुंडली एवं भविष्यफल रिपोर्ट

जातक विवरण:
• नाम: ${cleanName}
• जन्म तिथि: ${dobFormatted}
• जन्म समय: ${timeInfo.label}
• जन्म स्थान: ${placeInfo.label}

प्रमुख वैदिक पंचांग व अवकहड़ा चक्र:
• लग्न (Ascendant): ${lagnaMeta.shortHi} (${lagnaMeta.nameEnglish}) | लग्न स्वामी: ${lagnaMeta.swami}
• जन्म राशि (चंद्र राशि): ${chandraMeta.nameHindi} | राशि स्वामी: ${chandraMeta.swami}
• सूर्य राशि (Sun Sign): ${suryaMeta.nameHindi}
• जन्म नक्षत्र व चरण: ${nakData.name} — चरण ${pada}
• नामाक्षर (पहले अक्षर): ${charanAkshar}
• गण / नाड़ी / योनि / वर्ण: ${nakData.gana} • ${nakData.nadi} नाड़ी • ${nakData.yoni} योनि • ${varna}
• तत्व व पाया: ${chandraMeta.element} | ${paya}

वर्तमान महादशा एवं योग स्थिति:
• वर्तमान महादशा: ${currentMahadasha} (${dashaStartYear} से ${dashaEndYear} तक)
• वर्तमान अंतर्दशा: ${currentAntardasha}
• मांगलिक विश्लेषण: ${manglikStatus}
• राहु-केतु स्थिति: ${kaalSarpStatus}
• शनि गोचर स्थिति: ${shaniStatus}

नवग्रह भाव एवं राशि स्थिति (12 भाव तालिका):
${houseSummary}

भविष्यफल एवं जीवन विश्लेषण:
• करियर व आजीविका: ${careerPrediction}
• विवाह व पारिवारिक जीवन: ${marriagePrediction}
• धन व संपत्ति योग: ${wealthPrediction}
• स्वास्थ्य व ऊर्जा: ${healthPrediction}
• ${currentYear}-${currentYear + 1} विशेष भविष्यफल: ${yearlyForecast}

शुभ रत्न, रंग व वैदिक उपाय:
• शुभ रत्न: ${chandraMeta.ratna} (ज्योतिषी परामर्श पश्चात)
• शुभ रंग: ${chandraMeta.colors[0].label} | शुभ अंक: ${chandraMeta.baseNumber} | शुभ दिन: ${chandraMeta.luckyDay}
• इष्ट देव: ${chandraMeta.ishta} | मंत्र: ${chandraMeta.mantra}
• अचूक उपाय:
${remedies.map((r) => `  • ${r}`).join('\n')}`;

  return {
    name: cleanName,
    dobFormatted,
    birthTimeFormatted: timeInfo.label,
    birthPlace: placeInfo.label,
    coordinatesLabel: `${placeInfo.lat.toFixed(2)}°N, ${placeInfo.lon.toFixed(2)}°E`,
    lagnaIndex,
    lagnaHi: `${lagnaMeta.shortHi} (${lagnaMeta.nameEnglish})`,
    lagnaLord: lagnaMeta.swami,
    chandraRashiIndex,
    chandraRashiHi: chandraMeta.nameHindi,
    chandraRashiLord: chandraMeta.swami,
    suryaRashiHi: suryaMeta.nameHindi,
    nakshatra: nakData.name,
    nakshatraLord: nakData.lord,
    pada,
    charanAkshar,
    gana: nakData.gana,
    nadi: nakData.nadi,
    varna,
    yoni: nakData.yoni,
    tattva: chandraMeta.element,
    paya,
    planets,
    manglikStatus,
    kaalSarpStatus,
    shaniStatus,
    currentMahadasha,
    currentAntardasha,
    mahadashaPeriodLabel: `${dashaStartYear} - ${dashaEndYear}`,
    luckyRatna: chandraMeta.ratna,
    luckyColor: chandraMeta.colors[0].label,
    luckyNumber: chandraMeta.baseNumber,
    luckyDay: chandraMeta.luckyDay,
    ishtaDevta: chandraMeta.ishta,
    mantra: chandraMeta.mantra,
    careerPrediction,
    marriagePrediction,
    wealthPrediction,
    healthPrediction,
    yearlyForecast,
    remedies,
    formattedTextHi,
  };
}
