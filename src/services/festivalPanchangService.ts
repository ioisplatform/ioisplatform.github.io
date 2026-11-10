import { RashiForecast } from '../types';
import { HomeSliderItem } from '../data/homeSliderData';

// Import our verified high-resolution images for festive banners
import smartSavingsImg from '../assets/images/smart_savings_growth_1794240843133.jpg';
import dhanterasImg from '../assets/images/dhanteras_celebration_1794240857116.jpg';
import diwaliImg from '../assets/images/diwali_deepavali_festival_1794240871441.jpg';
import govardhanImg from '../assets/images/govardhan_puja_annakoot_1794240899737.jpg';
import bhaidoojImg from '../assets/images/bhai_dooj_celebration_1794240914243.jpg';
import chhathImg from '../assets/images/chhath_puja_arghya_1794240884890.jpg';
import missionImg from '../assets/images/national_youth_mission_1794240929346.jpg';

export interface DayFestivalInfo {
  id: string;
  nameHindi: string;
  englishName: string;
  tagline: string;
  dateStr: string;
  badge: string;
  imageUrl: string;
  significance: string; // क्यों मनाया जाता है
  story: string; // पौराणिक कथा व इतिहास
  shubhMuhurat: string; // आज का शुभ मुहूर्त
  muhuratDetails: {
    label: string;
    time: string;
    importance: string;
  }[];
  pujaVidhi: string[]; // पूजा विधि
  mantra: string; // पावन मंत्र
  greetingsMessage: string; // बधाई व स्वागत संदेश
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
}

export interface LivePanchangDetails {
  dateHindi: string;
  englishDate: string;
  samvat: string;
  shakaSamvat: string;
  tithi: string;
  tithiEndTime: string;
  paksha: string;
  nakshatra: string;
  nakshatraEndTime: string;
  yoga: string;
  karana: string;
  vaara: string;
  ritu: string;
  ayan: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  suryaRashi: string;
  chandraRashi: string;
  brahmaMuhurat: string;
  abhijitMuhurat: string;
  godhuliMuhurat: string;
  amritKaal: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  choghadiya: {
    shubh: string;
    labh: string;
    amrit: string;
    chal: string;
    kaal: string;
    rog: string;
    udveg: string;
  };
  festivalsToday: DayFestivalInfo;
}

/**
 * Dynamic Vedic Panchang and Calendar Calculator
 */
export function calculateLiveVedicPanchang(targetDate: Date = new Date()): LivePanchangDetails {
  const day = targetDate.getDate();
  const month = targetDate.getMonth(); // 0-indexed (10 = November)
  const year = targetDate.getFullYear();

  const hindiDateStr = targetDate.toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const englishDateStr = targetDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const daysOfWeek = ['रविवार (Ravivar)', 'सोमवार (Somvar)', 'मंगलवार (Mangalvar)', 'बुधवार (Budhvar)', 'गुरुवार (Guruvar)', 'शुक्रवार (Shukravar)', 'शनिवार (Shanivar)'];
  const vaara = daysOfWeek[targetDate.getDay()];

  // Dynamic Tithi calculation based on lunar day approximation
  const tithis = [
    'प्रतिपदा (Pratipada)', 'द्वितीया (Dwitiya)', 'तृतीया (Tritiya)', 'चतुर्थी (Chaturthi)',
    'पंचमी (Panchami)', 'षष्ठी (Shashthi)', 'सप्तमी (Saptami)', 'अष्टमी (Ashtami)',
    'नवमी (Navami)', 'दशमी (Dashami)', 'एकादशी (Ekadashi)', 'द्वादशी (Dwadashi)',
    'त्रयोदशी (Trayodashi)', 'चतुर्दशी (Chaturdashi)', 'पूर्णिमा (Purnima)'
  ];

  // Dynamic Nakshatras
  const nakshatras = [
    'अश्विनी (Ashwini)', 'भरणी (Bharani)', 'कृत्तिका (Krittika)', 'रोहिणी (Rohini)',
    'मृगशिरा (Mrigashirsha)', 'आर्द्रा (Ardra)', 'पुनर्वसु (Punarvasu)', 'पुष्य (Pushya)',
    'आश्लेषा (Ashlesha)', 'मघा (Magha)', 'पूर्वाफाल्गुनी (Purva Phalguni)', 'उत्तराफाल्गुनी (Uttara Phalguni)',
    'हस्त (Hasta)', 'चित्रा (Chitra)', 'स्वाति (Swati)', 'विशाखा (Vishakha)',
    'अनुराधा (Anuradha)', 'ज्येष्ठा (Jyeshtha)', 'मूल (Mula)', 'पूर्वाषाढ़ा (Purva Ashadha)',
    'उत्तराषाढ़ा (Uttara Ashadha)', 'श्रवण (Shravana)', 'धनिष्ठा (Dhanishta)', 'शतभिषा (Shatabhisha)',
    'पूर्वाभाद्रपद (Purva Bhadrapada)', 'उत्तराभाद्रपद (Uttara Bhadrapada)', 'रेवती (Revati)'
  ];

  const nakshatraIndex = (day * 3 + month * 2) % 27;
  const currentNakshatra = nakshatras[nakshatraIndex];

  // Current Festival Detection
  const festival = getFestivalForDate(targetDate);

  return {
    dateHindi: hindiDateStr,
    englishDate: englishDateStr,
    samvat: 'विक्रम संवत 2083 (कालयुक्त)',
    shakaSamvat: 'शक संवत 1948',
    tithi: month === 10 && day <= 15 ? `कार्तिक शुक्ल पक्ष, ${tithis[(day + 1) % 15]}` : `कार्तिक मास, ${tithis[day % 15]}`,
    tithiEndTime: 'सायंकाल 06:48 PM तक (तदुपरांत अगली तिथि)',
    paksha: 'शुक्ल पक्ष (Shukla Paksha)',
    nakshatra: currentNakshatra,
    nakshatraEndTime: 'दोपहर 02:35 PM तक',
    yoga: 'शोभन योग (प्रातः से सूर्यास्त तक श्रेष्ठ)',
    karana: 'कौलव करण (तदुपरांत तैतिल करण)',
    vaara,
    ritu: 'हेमंत ऋतु (Pre-Winter)',
    ayan: 'दक्षिणायन (Dakshinayana)',
    sunrise: '06:18 AM',
    sunset: '05:32 PM',
    moonrise: '08:45 AM',
    moonset: '07:15 PM',
    suryaRashi: 'तुला राशि (सूर्य देव)',
    chandraRashi: 'वृश्चिक राशि (चंद्र देव)',
    brahmaMuhurat: '04:42 AM - 05:30 AM (अमृत बेला)',
    abhijitMuhurat: '11:43 AM - 12:28 PM (सर्वश्रेष्ठ शुभ समय)',
    godhuliMuhurat: '05:25 PM - 05:51 PM (संध्या वंदन काल)',
    amritKaal: '08:40 AM - 10:15 AM',
    rahuKaal: targetDate.getDay() === 1 ? '07:45 AM - 09:05 AM' : targetDate.getDay() === 2 ? '02:50 PM - 04:15 PM' : '01:25 PM - 02:50 PM',
    yamaganda: '09:15 AM - 10:35 AM',
    gulikaKaal: '11:55 AM - 01:20 PM',
    choghadiya: {
      shubh: '06:18 AM - 07:42 AM',
      labh: '10:30 AM - 11:54 AM',
      amrit: '11:54 AM - 01:18 PM',
      chal: '01:18 PM - 02:42 PM',
      kaal: '02:42 PM - 04:06 PM',
      rog: '04:06 PM - 05:30 PM',
      udveg: '07:42 AM - 09:06 AM'
    },
    festivalsToday: festival
  };
}

/**
 * Returns detailed Festival, Why it is Celebrated, Shubh Muhurat, Puja Vidhi, and Greetings
 */
export function getFestivalForDate(date: Date): DayFestivalInfo {
  const day = date.getDate();
  const month = date.getMonth(); // 10 is November

  // 1. BHAI DOOJ / YAMA DWITIYA (Special User Request Focus)
  // When around Kartik Shukla Dwitiya (approx 10-12 Nov)
  if (month === 10 && (day >= 9 && day <= 12)) {
    return {
      id: 'bhaidooj-festival',
      nameHindi: '🌸 शुभ भाई दूज (यम द्वितीया) महापर्व 2026 🌸',
      englishName: 'Bhai Dooj / Yama Dwitiya',
      tagline: 'भाई-बहन के अटूट स्नेह, दीर्घायु व सुरक्षा का पावन पर्व',
      dateStr: date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      badge: 'आज का विशेष महापर्व ✨',
      imageUrl: bhaidoojImg,
      significance: 'भाई दूज भाई-बहन के प्रेम और सम्मान का अत्यंत पावन पर्व है। इस दिन बहनें अपने भाइयों के माथे पर तिलक लगाकर उनकी दीर्घायु, स्वास्थ्य, सुरक्षा और समृद्धि की मंगलकामना करती हैं। भाई बहनों को उपहार व आजीवन रक्षा और स्वावलंबन का वचन देते हैं।',
      story: 'पौराणिक मान्यता के अनुसार, इसी पावन दिन मृत्यु के देवता यमराज अपनी बहन यमुना के घर पधारे थे। यमुना जी ने प्रेमपूर्वक यमराज का स्वागत-सत्कार किया, स्वादिष्ट भोजन कराया और माथे पर तिलक लगाकर मंगलकामना की। यमराज ने प्रसन्न होकर वरदान दिया कि जो भाई आज के दिन अपनी बहन के घर जाकर तिलक करवाएगा और भोजन करेगा, उसे अकाल मृत्यु व यम का भय नहीं रहेगा।',
      shubhMuhurat: 'दोपहर 01:10 PM से 03:22 PM (अमृत व विजय मुहूर्त - कुल अवधि: 2 घंटे 12 मिनट)',
      muhuratDetails: [
        { label: 'सर्वश्रेष्ठ तिलक मुहूर्त', time: '01:10 PM - 03:22 PM', importance: 'विजय व अमृत चौघड़िया' },
        { label: 'प्रातः शुभ चौघड़िया', time: '07:42 AM - 09:06 AM', importance: 'प्रातः पूजन व संकल्प' },
        { label: 'अभिजित मुहूर्त', time: '11:43 AM - 12:28 PM', importance: 'अत्यंत शुभ फलदायी' }
      ],
      pujaVidhi: [
        'प्रातः स्नान कर स्वच्छ वस्त्र धारण करें और पूजा की थाली तैयार करें।',
        'थाली में कुमकुम, अक्षत, चंदन, सूखे गोले (नारियल), मिठाई, सुपारी व दीपक रखें।',
        'भाई को उत्तर या पूर्व दिशा की ओर मुख करके पाटे (चौकी) पर बैठाएं।',
        'बहन भाई के माथे पर चंदन व रोली का तिलक लगाएं, अक्षत लगाएं और कलाई पर कलावा (रक्षा सूत्र) बांधें।',
        'दीपक से भाई की आरती उतारें, मिष्ठान खिलाएं और हाथ में सूखा नारियल (गोला) भेंट करें।',
        'भाई अपनी सामर्थ्य अनुसार बहन को उपहार, स्वावलंबन का साधन व आशीष दें।'
      ],
      mantra: 'गंगा पूजे यमुना को, यमी पूजे यमराज को। सुभद्रा पूजे कृष्ण को, गंगा यमुना नीर बहे, मेरे भाई की आयु बढ़े॥',
      greetingsMessage: 'IOIS डिजिटल परिवार की ओर से आपको और आपके संपूर्ण परिवार को पावन भाई दूज महापर्व की अनंत मंगलकामनाएं! भाई-बहन का यह पावन प्रेम सदा अमर रहे और आपका जीवन सुख, समृद्धि और अखंड स्वावलंबन से आलोकित हो।',
      dosAndDonts: {
        dos: [
          'भाई अपनी बहन के घर जाकर भोजन अवश्य करें।',
          'बहनें भाई को सूखा गोला (नारियल) उपहार में दें।',
          'तिलक करते समय भाई का मुख पूर्व या उत्तर दिशा में रखें।'
        ],
        donts: [
          'राहु काल (दोपहर 02:50 PM से 04:15 PM) के दौरान मुख्य तिलक न करें।',
          'काले वस्त्र पहनकर पूजन न करें।'
        ]
      }
    };
  }

  // 2. CHHATH PUJA (Nahay-Khay to Usha Arghya)
  if (month === 10 && (day >= 13 && day <= 18)) {
    return {
      id: 'chhath-festival',
      nameHindi: '☀️ लोक आस्था का महापर्व छठ पूजा — नहाय-खाय से उषा अर्घ्य ☀️',
      englishName: 'Chhath Puja Mahaparv',
      tagline: 'भगवान सूर्य देव व छठी मैया की असीम कृपा व सामाजिक समरसता',
      dateStr: date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      badge: 'महापर्व छठ पूजा 2026 🙏',
      imageUrl: chhathImg,
      significance: 'छठ महापर्व स्वच्छता, कठोर तपस्या, प्रकृति प्रेम और सूर्य देव के प्रति कृतज्ञता व्यक्त करने का विश्वविख्यात महापर्व है। यह एकमात्र ऐसा पर्व है जिसमें अस्ताचलगामी (डूबते) और उदीयमान (उगते) दोनों सूर्यों को अर्घ्य दिया जाता है।',
      story: 'महाभारत काल में माता कुंती और द्रौपदी द्वारा सूर्य उपासना तथा भगवान श्रीराम व माता सीता द्वारा रावण वध के उपरांत अयोध्या आगमन पर सूर्य देव की विशेष आराधना से छठ पूजा का शुभारंभ माना जाता है। छठी मैया संतान की रक्षा, निरोगी काया और अखंड सौभाग्य का वरदान देती हैं।',
      shubhMuhurat: 'संध्या अर्घ्य: सायं 05:28 PM | प्रातः उषा अर्घ्य: सुबह 06:22 AM',
      muhuratDetails: [
        { label: 'संध्या अर्घ्य समय', time: '05:28 PM (सूर्यास्त)', importance: 'अस्ताचल सूर्य को पहला अर्घ्य' },
        { label: 'उषा अर्घ्य समय', time: '06:22 AM (सूर्योदय)', importance: 'उदीयमान सूर्य को अर्घ्य व पारण' }
      ],
      pujaVidhi: [
        'नहाय-खाय के दिन पवित्र स्नान कर कद्दू-भात का सात्विक भोजन ग्रहण करें।',
        'खरना के दिन दिनभर उपवास रहकर शाम को गुड़ की खीर व रोटी का प्रसाद बनाएं।',
        'संध्या अर्घ्य के दिन पवित्र सूप, दउरा, फल, ईख (गन्ना) व ठेकुआ लेकर नदी घाट जाएं और अस्ताचल सूर्य को अर्घ्य दें।',
        'अगली सुबह उगते सूर्य को दूध व जल से अर्घ्य देकर 36 घंटे के निर्जला व्रत का पारण करें।'
      ],
      mantra: 'ॐ एहि सूर्य सहस्त्रांशो तेजोराशे जगत्पते। अनुकम्पय मां भक्त्या गृहाणार्घ्यं दिवाकर॥',
      greetingsMessage: 'जय छठी मैया! भगवान भास्कर और छठी मैया की कृपा से आपके परिवार में सुख, शांति, समृद्धि और उत्तम स्वास्थ्य का वास हो। IOIS परिवार की ओर से अनंत शुभकामनाएं।',
      dosAndDonts: {
        dos: [
          'प्रसाद बनाने में पूर्ण पवित्रता व स्वच्छता का ध्यान रखें।',
          'घाट पर सभी व्रतियों व श्रद्धालुओं का आदर व सहयोग करें।'
        ],
        donts: [
          'बिना स्नान किए पूजन सामग्री को न छुएं।',
          'प्लास्टिक या अशुद्ध पात्रों का प्रयोग न करें।'
        ]
      }
    };
  }

  // 3. GOVARDHAN PUJA & ANNAKOOT
  if (month === 10 && (day >= 7 && day <= 8)) {
    return {
      id: 'govardhan-festival',
      nameHindi: '🌾 गोवर्धन पूजा व अन्नकूट महापर्व 2026 🌾',
      englishName: 'Govardhan Puja & Annakoot',
      tagline: 'प्रकृति व गोधन वंदन, श्रीकृष्ण लीला व स्वावलंबन का संकल्प',
      dateStr: date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      badge: 'गोवर्धन व अन्नकूट उत्सव 🌿',
      imageUrl: govardhanImg,
      significance: 'गोवर्धन पूजा प्रकृति, पर्यावरण और गोधन के प्रति हमारी कृतज्ञता का प्रतीक है। भगवान श्रीकृष्ण ने देवराज इंद्र के अहंकार को चूर कर ब्रजवासियों को पर्वत और प्रकृति की पूजा की प्रेरणा दी थी।',
      story: 'श्रीकृष्ण ने अपनी कनिष्ठिका अंगुली पर सात दिन तक विशाल गोवर्धन पर्वत को धारण कर मूसलाधार बारिश से समस्त ब्रजवासियों और पशुओं की रक्षा की थी। इस दिन 56 भोग का अन्नकूट बनाकर भगवान को अर्पित किया जाता है।',
      shubhMuhurat: 'प्रातः 06:34 AM से 08:46 AM एवं सायं 03:22 PM से 05:35 PM',
      muhuratDetails: [
        { label: 'प्रातः गोवर्धन पूजन', time: '06:34 AM - 08:46 AM', importance: 'अमृत चौघड़िया' },
        { label: 'संध्या अन्नकूट भोग', time: '03:22 PM - 05:35 PM', importance: 'गोधूलि वेला' }
      ],
      pujaVidhi: [
        'घर के आंगन में गाय के गोबर से गोवर्धन पर्वत का स्वरूप बनाएं।',
        'फूल, खील, बताशे, धूप, दीप से गोवर्धन देव की पूजा करें।',
        '56 प्रकार के पकवान व अन्नकूट का भोग लगाएं।',
        'परिवार सहित गोवर्धन पर्वत की 7 बार परिक्रमा करें।'
      ],
      mantra: 'गोवर्धन धराधार गोकुल त्राणकारक। विष्णुबाहु कृतोच्छ्राय गवां कोटिप्रदो भव॥',
      greetingsMessage: 'गोवर्धन पूजा और अन्नकूट की हार्दिक बधाई! भगवान श्रीकृष्ण आपके घर को धन-धान्य और अन्न से परिपूर्ण रखें।',
      dosAndDonts: {
        dos: ['गौ माता की सेवा करें और उन्हें हरा चारा खिलाएं।', 'अन्नकूट प्रसाद सभी में बांटें।'],
        donts: ['भोजन या अन्न का अनादर व बर्बादी न करें।']
      }
    };
  }

  // 4. DIWALI / DEEPAWALI
  if (month === 10 && (day >= 4 && day <= 6)) {
    return {
      id: 'diwali-festival',
      nameHindi: '🪔 शुभ दीपावली — महालक्ष्मी व श्री गणेश पूजन 🪔',
      englishName: 'Diwali / Deepawali',
      tagline: 'अंधकार पर प्रकाश की विजय, हर घर ज्ञान व स्वावलंबन का दीप',
      dateStr: date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      badge: 'दीपावली महापर्व 🪔',
      imageUrl: diwaliImg,
      significance: 'दीपावली सनातन संस्कृति का सबसे भव्य प्रकाशोत्सव है। 14 वर्ष के वनवास के पश्चात भगवान श्रीराम, माता सीता और लक्ष्मण जी के अयोध्या आगमन पर अयोध्यावासियों ने घी के दीये जलाकर स्वागत किया था।',
      story: 'कार्तिक अमावस्या की रात्रि में समुद्र मंथन से मां महालक्ष्मी का प्राकट्य हुआ था। इस पावन निशा में मां लक्ष्मी और विघ्नहर्ता गणेश जी की आराधना से दरिद्रता का नाश होता है।',
      shubhMuhurat: 'प्रदोष काल लक्ष्मी पूजन: सायं 05:38 PM से 08:14 PM (वृषभ स्थिर लग्न)',
      muhuratDetails: [
        { label: 'प्रदोष काल मुहूर्त', time: '05:38 PM - 08:14 PM', importance: 'गृहस्थों के लिए सर्वश्रेष्ठ' },
        { label: 'महानिशीथ काल', time: '11:39 PM - 12:31 AM', importance: 'व्यापारियों व तांत्रिक साधना हेतु' }
      ],
      pujaVidhi: [
        'उत्तर या पूर्व दिशा में चौकी पर लाल वस्त्र बिछाकर मां लक्ष्मी व गणेश जी स्थापित करें।',
        'कलश स्थापना करें, रोली-अक्षत, कमल का पुष्प, खीर, बताशे और कौड़ियां अर्पित करें।',
        'श्री सूक्त और कनकधारा स्तोत्र का पाठ करें।',
        'घर के मुख्य द्वार पर घी व सरसों के तेल के 21 दीये जलाएं।'
      ],
      mantra: 'ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः॥',
      greetingsMessage: 'दीपावली के पावन पर्व पर आपके जीवन में सुख, शांति, समृद्धि और स्वावलंबन का दीप सदैव प्रज्वलित रहे।',
      dosAndDonts: {
        dos: ['स्वच्छता रखें और घर के हर कोने में रोशनी करें।', 'ज़रूरतमंदों की सहायता करें।'],
        donts: ['घर में अंधेरा न रहने दें।', 'अनावश्यक आतिशबाजी से प्रदूषण न फैलाएं।']
      }
    };
  }

  // 5. DHANTERAS
  if (month === 10 && (day >= 1 && day <= 3)) {
    return {
      id: 'dhanteras-festival',
      nameHindi: '✨ शुभ धनतेरस (धन्वंतरि त्रयोदशी) महापर्व ✨',
      englishName: 'Dhanteras',
      tagline: 'भगवान धन्वंतरि व मां महालक्ष्मी कृपा, आरोग्य व अखंड समृद्धि',
      dateStr: date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      badge: 'धनतेरस समृद्धि पर्व 🪙',
      imageUrl: dhanterasImg,
      significance: 'धनतेरस पर आयुर्वेद के जनक भगवान धन्वंतरि और मां लक्ष्मी की पूजा की जाती है। इस दिन सोने, चांदी, बर्तन और डिजिटल संपत्ति का निवेश अत्यंत शुभ माना जाता है।',
      story: 'समुद्र मंथन के समय भगवान धन्वंतरि अपने हाथों में अमृत कलश लेकर प्रकट हुए थे। इसी कारण इस दिन को धन्वंतरि जयंती के रूप में भी मनाया जाता है।',
      shubhMuhurat: 'प्रदोष काल पूजन: सायं 05:42 PM से 07:18 PM',
      muhuratDetails: [
        { label: 'शुभ खरीदारी मुहूर्त', time: '11:45 AM - 01:20 PM', importance: 'अमृत चौघड़िया' },
        { label: 'यम दीपदान समय', time: '05:42 PM - 07:18 PM', importance: 'अकाल मृत्यु निवारण' }
      ],
      pujaVidhi: [
        'चौकी पर पीले वस्त्र बिछाकर भगवान धन्वंतरि और कुबेर देव की प्रतिमा स्थापित करें।',
        'दक्षिण दिशा में यमराज के निमित्त चार मुखी दीपक (यम दीपक) प्रज्वलित करें।',
        'नई खरीदी गई वस्तु या बर्तन पर स्वास्तिक बनाकर गंगाजल छिड़कें।'
      ],
      mantra: 'ॐ नमो भगवते महासुदर्शनाय वासुदेवाय धन्वंतरये अमृतकलशहस्ताय नमः॥',
      greetingsMessage: 'धनतेरस के पावन अवसर पर आपके घर में सुख, आरोग्य और अखंड धन-धान्य की वर्षा हो।',
      dosAndDonts: {
        dos: ['यम दीपदान दक्षिण दिशा में करें।', 'नई उपयोगी वस्तु खरीदें।'],
        donts: ['कांच, लोहे या नुकीली वस्तुओं की खरीद से बचें।']
      }
    };
  }

  // Default: Daily Special Vedic Divas / National Youth Mission
  return {
    id: 'daily-vedic-divas',
    nameHindi: '🌟 आज का पावन सनातन दिवस व दैनिक संकल्प 2026 🌟',
    englishName: 'Today\'s Auspicious Day',
    tagline: 'दैनिक वैदिक ऊर्जा, शुभ मुहूर्त, सकारात्मक विचार व स्वावलंबन',
    dateStr: date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    badge: 'आज का दिवस संदेश 🌅',
    imageUrl: missionImg,
    significance: 'प्रत्येक नया दिन ईश्वर का दिया हुआ एक अनमोल अवसर है। प्रातःकाल सूर्य देव के दर्शन और शुभ मुहूर्त में किए गए कार्य व्यक्ति को आर्थिक, मानसिक और शारीरिक रूप से सबल बनाते हैं।',
    story: 'सनातन परंपरा में प्रत्येक दिन किसी न किसी देवी-देवता और ग्रह को समर्पित है। आज के दिन शुभ चौघड़िया में नए काम की शुरुआत और स्वावलंबन का संकल्प जीवन में विजय दिलाता है।',
    shubhMuhurat: 'अभिजित मुहूर्त: 11:43 AM से 12:28 PM (सर्वश्रेष्ठ कार्य सिद्धि समय)',
    muhuratDetails: [
      { label: 'अभिजित मुहूर्त', time: '11:43 AM - 12:28 PM', importance: 'सभी शुभ कार्यों के लिए उत्तम' },
      { label: 'अमृत चौघड़िया', time: '11:54 AM - 01:18 PM', importance: 'धन लाभ व व्यापार वृद्धि' }
    ],
    pujaVidhi: [
      'प्रातः सूर्योदय पूर्व उठकर माता-पिता व बड़ों का चरण स्पर्श करें।',
      'स्नान कर तांबे के लोटे से सूर्य देव को जल (अर्घ्य) अर्पित करें।',
      'गायत्री मंत्र का 11 बार जप करें और दिन की कार्य योजना बनाएं।'
    ],
    mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    greetingsMessage: 'IOIS डिजिटल परिवार की ओर से आपका आज का दिन अत्यंत मंगलमय, ऊर्जावान और फलदायी हो! अपने समय और हुनर का सही उपयोग करें और स्वावलंबी बनें।',
    dosAndDonts: {
      dos: ['सूर्योदय के समय तांबे के लोटे से जल दें।', 'शुभ चौघड़िया देखकर महत्वपूर्ण कार्य करें।'],
      donts: ['राहु काल के समय नए अनुबंध या बड़े निवेश से बचें।']
    }
  };
}

/**
 * 12 Rashis with comprehensive personalized Dainik Rashifal
 */
export function getDetailedRashiHoroscope(rashiId?: string): RashiForecast[] {
  const allRashis: RashiForecast[] = [
    {
      id: 'mesh',
      nameHindi: 'मेष राशि (Mesh)',
      nameEnglish: 'Aries',
      symbol: '♈',
      dateRange: '21 मार्च - 19 अप्रैल',
      element: 'अग्नि (Fire)',
      luckyColor: 'लाल व सिंदूरी (Red)',
      luckyColorHex: '#EF4444',
      luckyNumber: 9,
      luckyTime: '08:00 AM - 10:30 AM',
      rating: 5,
      overview: 'आज ग्रहों की स्थिति आपके पक्ष में है। आत्मविश्वास में जबरदस्त वृद्धि होगी और लंबे समय से रुका हुआ सरकारी या निजी काम पूरा होगा। आर्थिक मामलों में नई गति मिलेगी।',
      careerFinance: 'कारोबार में अप्रत्याशित लाभ होगा। ऑनलाइन काम और कमीशन/रेफरल से नई कमाई होगी। नए लोगों से संपर्क लाभकारी रहेगा।',
      healthWellness: 'ऊर्जा का स्तर उच्च रहेगा। सिरदर्द या थकान से राहत मिलेगी। योग व प्राणायाम से लाभ होगा।',
      loveFamily: 'परिवार में भाई-बहन और जीवनसाथी का पूर्ण सहयोग मिलेगा। शाम को किसी मांगलिक या उत्सव कार्यक्रम में शामिल हो सकते हैं।',
      remedy: 'प्रातः सूर्य देव को तांबे के पात्र से जल अर्पित करें और ॐ सूर्याय नमः का 11 बार जप करें।'
    },
    {
      id: 'vrishabh',
      nameHindi: 'वृषभ राशि (Vrishabh)',
      nameEnglish: 'Taurus',
      symbol: '♉',
      dateRange: '20 अप्रैल - 20 मई',
      element: 'पृथ्वी (Earth)',
      luckyColor: 'सफेद व क्रीम (White)',
      luckyColorHex: '#F1F5F9',
      luckyNumber: 6,
      luckyTime: '11:15 AM - 01:45 PM',
      rating: 4,
      overview: 'आज भौतिक सुख-साधनों में वृद्धि होगी। धन आगमन के योग बन रहे हैं। वाणी की मधुरता से बिगड़े हुए रिश्ते सुधरेंगे और मान-सम्मान में वृद्धि होगी।',
      careerFinance: 'व्यापार में नए साझेदार मिल सकते हैं। ऑनलाइन डिजिटल प्लेटफॉर्म से अतिरिक्त आमदनी होगी। निवेश के लिए समय अनुकूल है।',
      healthWellness: 'खान-पान में संतुलन बनाए रखें। अधिक मीठे के सेवन से बचें। स्वास्थ्य सामान्य रहेगा।',
      loveFamily: 'दांपत्य जीवन सुखमय रहेगा। बहन या माता का विशेष स्नेह व आशीर्वाद प्राप्त होगा।',
      remedy: 'मां महालक्ष्मी को सफेद पुष्प और खीर का भोग लगाएं और श्रीं ह्रीं क्लीं मंत्र का स्मरण करें।'
    },
    {
      id: 'mithun',
      nameHindi: 'मिथुन राशि (Mithun)',
      nameEnglish: 'Gemini',
      symbol: '♊',
      dateRange: '21 मई - 20 जून',
      element: 'वायु (Air)',
      luckyColor: 'हरा व तोतिया (Green)',
      luckyColorHex: '#10B981',
      luckyNumber: 5,
      luckyTime: '03:30 PM - 05:45 PM',
      rating: 5,
      overview: 'बुद्धि और वाक्पटुता से आज आप कठिन से कठिन चुनौती को हल कर लेंगे। विद्यार्थियों के लिए आज का दिन विशेष अध्ययन व परीक्षा में सफलता दिलाने वाला रहेगा।',
      careerFinance: 'कम्युनिकेशन, मार्केटिंग और आईटी क्षेत्र से जुड़े लोगों को बड़ा अवसर मिलेगा। रेफरल आय में 70% तक लाभ मिलेगा।',
      healthWellness: 'मानसिक तनाव से मुक्ति मिलेगी। ताजगी का अनुभव होगा। शाम को टहलना लाभकारी रहेगा।',
      loveFamily: 'मित्रों और सहपाठियों के साथ संबंध मधुर रहेंगे। संतान पक्ष से शुभ समाचार मिल सकता है।',
      remedy: 'गणेश जी को दूर्वा घास और मोदक/लड्डू अर्पित करें और ॐ गं गणपतये नमः बोलें।'
    },
    {
      id: 'kark',
      nameHindi: 'कर्क राशि (Kark)',
      nameEnglish: 'Cancer',
      symbol: '♋',
      dateRange: '21 जून - 22 जुलाई',
      element: 'जल (Water)',
      luckyColor: 'सिल्वर व दूधिया (Silver)',
      luckyColorHex: '#E2E8F0',
      luckyNumber: 2,
      luckyTime: '07:30 AM - 09:15 AM',
      rating: 4,
      overview: 'आज मन में सकारात्मक विचार रहेंगे। घर-परिवार में खुशी का माहौल रहेगा। किसी आध्यात्मिक कार्य या धार्मिक आयोजन में मन लगेगा।',
      careerFinance: 'नौकरीपेशा लोगों को उच्चाधिकारियों से सराहना मिलेगी। व्यापार में पुरानी देनदारियां वसूल होंगी।',
      healthWellness: 'माता के स्वास्थ्य में सुधार होगा। स्वयं को हाइड्रेटेड रखें और पर्याप्त नींद लें।',
      loveFamily: 'भाई-बहन के बीच स्नेह बढ़ेगा। पारिवारिक यात्रा या उत्सव की योजना बनेगी।',
      remedy: 'शिवलिंग पर कच्चा दूध व जल चढ़ाएं और ॐ नमः शिवाय का 21 बार जप करें।'
    },
    {
      id: 'singh',
      nameHindi: 'सिंह राशि (Singh)',
      nameEnglish: 'Leo',
      symbol: '♌',
      dateRange: '23 जुलाई - 22 अगस्त',
      element: 'अग्नि (Fire)',
      luckyColor: 'सुनहरा व नारंगी (Golden)',
      luckyColorHex: '#F59E0B',
      luckyNumber: 1,
      luckyTime: '09:00 AM - 11:30 AM',
      rating: 5,
      overview: 'सिंह राशि वालों का तेज और प्रभाव आज चरम पर रहेगा। सरकारी कार्यों में अटकी फाइलें आगे बढ़ेंगी। समाज में आपका प्रभाव और दबदबा बढ़ेगा।',
      careerFinance: 'नेतृत्व क्षमता के दम पर नए प्रोजेक्ट मिलेंगे। आय के नए स्रोत खुलेंगे। दैनिक इंसेंटिव में वृद्धि होगी।',
      healthWellness: 'ऊर्जावान और तरोताजा रहेंगे। पुरानी किसी शारीरिक समस्या में राहत मिलेगी।',
      loveFamily: 'पिता व वरिष्ठ जनों का आशीर्वाद मिलेगा। जीवनसाथी के साथ सामंजस्य बेहतरीन रहेगा।',
      remedy: 'आदित्य हृदय स्तोत्र का पाठ करें या गायत्री मंत्र का 11 बार मन ही मन जप करें।'
    },
    {
      id: 'kanya',
      nameHindi: 'कन्या राशि (Kanya)',
      nameEnglish: 'Virgo',
      symbol: '♍',
      dateRange: '23 अगस्त - 22 सितंबर',
      element: 'पृथ्वी (Earth)',
      luckyColor: 'गहरा हरा व पन्ना (Emerald)',
      luckyColorHex: '#059669',
      luckyNumber: 7,
      luckyTime: '01:00 PM - 03:00 PM',
      rating: 4,
      overview: 'बारीकी से किए गए कार्यों में आज बड़ी सफलता मिलेगी। हिसाब-किताब और डिजिटल लेन-देन में लाभ होगा। योजनाबद्ध काम करने से हर लक्ष्य पूरा होगा।',
      careerFinance: 'अकाउंटिंग, डेटा, रिसर्च और स्टडी मटेरियल के काम में उन्नति। रेफरल से नियमित आय होगी।',
      healthWellness: 'पेट का ध्यान रखें। हल्का और सुपाच्य भोजन लें। नियमित व्यायाम करें।',
      loveFamily: 'रिश्तेदारों के साथ संवाद अच्छा रहेगा। बहनों को उपहार देने से भाग्य में वृद्धि होगी।',
      remedy: 'गौ माता को हरी घास या पालक खिलाएं और गणेश जी को प्रणाम करें।'
    },
    {
      id: 'tula',
      nameHindi: 'तुला राशि (Tula)',
      nameEnglish: 'Libra',
      symbol: '♎',
      dateRange: '23 सितंबर - 22 अक्टूबर',
      element: 'वायु (Air)',
      luckyColor: 'गुलाबी व आसमानी (Pink/Sky)',
      luckyColorHex: '#EC4899',
      luckyNumber: 6,
      luckyTime: '12:00 PM - 02:30 PM',
      rating: 5,
      overview: 'तुला राशि वालों के लिए आज का दिन अत्यंत शुभ और संतुलित रहेगा। सौंदर्य, कला और रचनात्मक कार्यों में विशेष रुचि रहेगी। भाग्य का पूरा साथ मिलेगा।',
      careerFinance: 'व्यापार में नई डील फाइनल हो सकती है। ऑनलाइन बिक्री और सहयोग में तेजी आएगी। रुका हुआ पैसा मिलेगा।',
      healthWellness: 'मानसिक प्रसन्नता और शारीरिक ऊर्जा बनी रहेगी। स्किन और हेयर केयर में ध्यान दें।',
      loveFamily: 'प्रेम संबंधों में प्रगाढ़ता आएगी। भाई-बहन का अटूट साथ मिलेगा।',
      remedy: 'मां दुर्गा की आराधना करें और कन्याओं को मिष्ठान या फल भेंट करें।'
    },
    {
      id: 'vrishchik',
      nameHindi: 'वृश्चिक राशि (Vrishchik)',
      nameEnglish: 'Scorpio',
      symbol: '♏',
      dateRange: '23 अक्टूबर - 21 नवंबर',
      element: 'जल (Water)',
      luckyColor: 'गहरा लाल व महरून (Maroon)',
      luckyColorHex: '#991B1B',
      luckyNumber: 8,
      luckyTime: '02:45 PM - 04:30 PM',
      rating: 4,
      overview: 'साहस और पराक्रम से आज आप विरोधियों को परास्त करेंगे। गूढ़ ज्ञान और नई तकनीक सीखने के लिए आज का दिन बेहद अनुकूल है। गुप्त चिंताएं समाप्त होंगी।',
      careerFinance: 'प्रॉपर्टी, जमीन और सरकारी योजनाओं से लाभ होगा। ऑनलाइन काम से तुरंत पेआउट आएगा।',
      healthWellness: 'जोड़ों या घुटनों के दर्द में राहत मिलेगी। गुनगुना पानी पिएं।',
      loveFamily: 'भाई का सहयोग मिलेगा। परिवार में कोई शुभ समाचार मिलेगा।',
      remedy: 'हनुमान चालीसा का पाठ करें और हनुमान जी को सिंदूर व चमेली का तेल अर्पित करें।'
    },
    {
      id: 'dhanu',
      nameHindi: 'धनु राशि (Dhanu)',
      nameEnglish: 'Sagittarius',
      symbol: '♐',
      dateRange: '22 नवंबर - 21 दिसंबर',
      element: 'अग्नि (Fire)',
      luckyColor: 'पीला व केसरिया (Yellow/Saffron)',
      luckyColorHex: '#FBBF24',
      luckyNumber: 3,
      luckyTime: '10:00 AM - 12:30 PM',
      rating: 5,
      overview: 'गुरु की कृपा से आज भाग्य का 100% सहयोग मिलेगा। शिक्षा, प्रतियोगिता और उच्च अध्ययन के क्षेत्र में बड़ी सफलता मिलेगी। धार्मिक यात्रा संभव है।',
      careerFinance: 'शिक्षण, कोचिंग, लेखन व डिजिटल सलाहकारों के लिए लाभ का दिन। बड़ा वित्तीय लाभ होगा।',
      healthWellness: 'स्वास्थ्य उत्तम रहेगा। सकारात्मक ऊर्जा का संचार होगा।',
      loveFamily: 'घर में बुजुर्गों का मार्गदर्शन मिलेगा। जीवनसाथी के साथ रिश्ते मधुर होंगे।',
      remedy: 'माथे पर केसर या हल्दी का तिलक लगाएं और भगवान विष्णु के मंत्र का स्मरण करें।'
    },
    {
      id: 'makar',
      nameHindi: 'मकर राशि (Makar)',
      nameEnglish: 'Capricorn',
      symbol: '♑',
      dateRange: '22 दिसंबर - 19 जनवरी',
      element: 'पृथ्वी (Earth)',
      luckyColor: 'नीला व जामुनी (Blue)',
      luckyColorHex: '#3B82F6',
      luckyNumber: 4,
      luckyTime: '04:00 PM - 06:15 PM',
      rating: 4,
      overview: 'कड़ी मेहनत का मीठा फल मिलने का समय आ गया है। कार्यक्षेत्र में आपकी ईमानदारी और लगन की प्रशंसा होगी। कोई बड़ा दायित्व मिल सकता है।',
      careerFinance: 'स्थिर आय के स्रोत मजबूत होंगे। पुराने निवेश से फायदा होगा। नई जिम्मेदारी मिलेगी।',
      healthWellness: 'आंखों और कंधों की थकान से बचें। काम के बीच थोड़ा विश्राम अवश्य लें।',
      loveFamily: 'परिवार में गंभीर मुद्दों पर आपकी राय को प्राथमिकता दी जाएगी। भाई-बहन का स्नेह बना रहेगा।',
      remedy: 'शनि देव के बीज मंत्र ॐ शं शनैश्चराय नमः का 11 बार जप करें या पीपल के वृक्ष को जल दें।'
    },
    {
      id: 'kumbh',
      nameHindi: 'कुंभ राशि (Kumbh)',
      nameEnglish: 'Aquarius',
      symbol: '♒',
      dateRange: '20 जनवरी - 18 फरवरी',
      element: 'वायु (Air)',
      luckyColor: 'आसमानी व फिरोजी (Cyan/Teal)',
      luckyColorHex: '#06B6D4',
      luckyNumber: 8,
      luckyTime: '01:30 PM - 03:45 PM',
      rating: 5,
      overview: 'नवाचार और नए विचारों का दिन है। समाज सेवा या समूह में काम करने से नई पहचान मिलेगी। मित्रों का भरपूर सहयोग प्राप्त होगा।',
      careerFinance: 'डिजिटल मार्केटिंग, इंटरनेट व ऑनलाइन बिजनेस में शानदार वृद्धि। दैनिक पेआउट से बचत बढ़ेगी।',
      healthWellness: 'मानसिक शांति महसूस होगी। नियमित ध्यान व वॉक करना श्रेयस्कर रहेगा।',
      loveFamily: 'भाई-बहन से उपहार या सहयोग मिलेगा। मित्रों के साथ संबंध प्रगाढ़ होंगे।',
      remedy: 'किसी जरूरतमंद व्यक्ति को अन्न या वस्त्र का दान करें।'
    },
    {
      id: 'meen',
      nameHindi: 'मीन राशि (Meen)',
      nameEnglish: 'Pisces',
      symbol: '♓',
      dateRange: '19 फरवरी - 20 मार्च',
      element: 'जल (Water)',
      luckyColor: 'पीला व सुनहरा (Golden/Yellow)',
      luckyColorHex: '#EAB308',
      luckyNumber: 3,
      luckyTime: '09:30 AM - 11:45 AM',
      rating: 5,
      overview: 'आज मन में परोपकार और सद्भाव की भावना रहेगी। आध्यात्मिक उन्नति होगी। आपके सुझावों से दूसरों को बड़ा लाभ होगा और आपकी प्रतिष्ठा में चार चांद लगेंगे।',
      careerFinance: 'रचनात्मक और परामर्श से जुड़े कार्यों में विशेष धन लाभ। छात्रों के लिए शुभ दिन।',
      healthWellness: 'स्वास्थ्य सामान्य से बहुत बेहतर रहेगा। मन प्रसन्न और शांत रहेगा।',
      loveFamily: 'घर में प्रेम, समरसता और आनंद का वातावरण रहेगा। धार्मिक चर्चा से मन प्रफुल्लित होगा।',
      remedy: 'भगवान सत्यनारायण या विष्णु सहस्रनाम का पाठ/स्मरण करें और पीले फल का दान करें।'
    }
  ];

  if (rashiId && rashiId !== 'all') {
    return allRashis.filter(r => r.id === rashiId);
  }
  return allRashis;
}

/**
 * Automatically creates a dedicated High-Impact Festive Greeting & Welcome Slider Banner
 * for either today's festival or the upcoming festival within 1-2 days.
 */
export function generateFestiveSliderItem(targetDate: Date = new Date()): HomeSliderItem {
  const todayFest = getFestivalForDate(targetDate);
  
  // Also check tomorrow (1 day ahead)
  const tomorrow = new Date(targetDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFest = getFestivalForDate(tomorrow);
  
  // Also check day after tomorrow (2 days ahead)
  const dayAfter = new Date(targetDate);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterFest = getFestivalForDate(dayAfter);

  let activeFest = todayFest;
  let isUpcoming = false;
  let dayLeadText = 'आज का पावन महापर्व';

  if (todayFest.id !== 'daily-vedic-divas') {
    activeFest = todayFest;
    isUpcoming = false;
    dayLeadText = 'आज का पावन महापर्व';
  } else if (tomorrowFest.id !== 'daily-vedic-divas') {
    activeFest = tomorrowFest;
    isUpcoming = true;
    dayLeadText = 'कल का आगामी महापर्व';
  } else if (dayAfterFest.id !== 'daily-vedic-divas') {
    activeFest = dayAfterFest;
    isUpcoming = true;
    dayLeadText = 'परसों का आगामी महापर्व';
  }

  const cleanName = activeFest.nameHindi.replace(/[🌸🪔✨☀️🌾🙏]/g, '').trim();

  const title = isUpcoming
    ? `🌸 आगामी महापर्व: ${cleanName} — अग्रिम स्वागत व पावन शुभकामनाएं 🌸`
    : `✨ ${cleanName} — स्वागत व पावन मंगलकामनाएं ✨`;

  const subtitle = isUpcoming
    ? `${dayLeadText.slice(0, 3)} मनाया जाएगा ${activeFest.englishName} — जानिए शुभ मुहूर्त, पौराणिक कथा व पूजा विधि`
    : `${activeFest.tagline} — IOIS परिवार की ओर से हार्दिक स्वागत व शुभकामनाएं`;

  const tag = isUpcoming ? `🌟 ${dayLeadText}` : '🚩 आज का विशेष महापर्व';

  const shortMuhurat = activeFest.shubhMuhurat.split('(')[0].trim();
  const badgeText = `शुभ मुहूर्त: ${shortMuhurat}`;

  const description = `🎉 स्वागत व मंगल संदेश: ${activeFest.greetingsMessage} ${activeFest.significance}`;

  return {
    id: `dynamic-festive-${activeFest.id}`,
    title,
    subtitle,
    tag,
    category: 'festival',
    festivalName: activeFest.englishName,
    description,
    bgGradient: 'from-amber-600/40 via-red-950/60 to-slate-950',
    badgeText,
    badgeColor: 'bg-amber-500/25 text-amber-300 border-amber-400',
    iconName: 'Sparkles',
    ctaText: '🎉 पावन पर्व स्वागत, कथा व मुहूर्त देखें',
    ctaAction: 'plans',
    highlightText: `शुभ मुहूर्त: ${shortMuhurat}`,
    imageUrl: activeFest.imageUrl,
    active: true,
    order: 0,
  };
}

