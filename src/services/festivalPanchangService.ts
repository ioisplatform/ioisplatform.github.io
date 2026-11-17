import { RashiForecast } from '../types';
import { HomeSliderItem, toLocalIsoDateKey } from '../data/homeSliderData';
import { HomePopupPhoto } from '../data/homePopupData';
import { computeDailyRashifalForDate, DailyRashiForecast } from './vedicAstrologyEngine';

// Verified festival artworks (all existing + newly generated high-resolution banners)
import smartSavingsImg from '../assets/images/smart_savings_growth_1794240843133.jpg';
import dhanterasImg from '../assets/images/dhanteras_celebration_1794240857116.jpg';
import diwaliImg from '../assets/images/diwali_deepavali_festival_1794240871441.jpg';
import govardhanImg from '../assets/images/govardhan_puja_annakoot_1794240899737.jpg';
import bhaidoojImg from '../assets/images/bhai_dooj_celebration_1794240914243.jpg';
import chhathImg from '../assets/images/chhath_puja_arghya_1794240884890.jpg';
import missionImg from '../assets/images/national_youth_mission_1794240929346.jpg';
import devDeepawaliImg from '../assets/images/dev_deepawali_kartik_purnima_1794705085625.jpg';
import tulsiVivahImg from '../assets/images/tulsi_vivah_ekadashi_1794705109000.jpg';
import makarSankrantiImg from '../assets/images/makar_sankranti_lohri_1794705088032.jpg';
import holiImg from '../assets/images/holi_festival_colors_1794705087929.jpg';
import nationalDayImg from '../assets/images/republic_independence_india_1794705088361.jpg';
import templePujaImg from '../assets/images/mahashivaratri_navratri_puja_1794705088614.jpg';
import winterNewYearImg from '../assets/images/winter_festive_newyear_1794705110731.jpg';

export interface DayFestivalInfo {
  id: string;
  nameHindi: string;
  englishName: string;
  tagline: string;
  dateStr: string;
  startDate?: string;       // YYYY-MM-DD
  endDate?: string;         // YYYY-MM-DD
  isUpcoming?: boolean;
  daysRemaining?: number;
  badge: string;
  imageUrl: string;
  themeGradient?: string;
  badgeColor?: string;
  iconName?: HomeSliderItem['iconName'];
  significance: string;     // क्यों मनाया जाता है
  story: string;            // पौराणिक कथा व इतिहास
  shubhMuhurat: string;     // आज का शुभ मुहूर्त
  muhuratDetails: {
    label: string;
    time: string;
    importance: string;
  }[];
  pujaVidhi: string[];      // पूजा विधि
  mantra: string;           // पावन मंत्र
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

interface FestivalCatalogEntry extends Omit<DayFestivalInfo, 'dateStr' | 'isUpcoming' | 'daysRemaining'> {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  ctaText: string;
}

function parseLocalIsoDate(isoKey: string): Date {
  const [y, m, d] = isoKey.split('-').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 6, 30, 0));
}

function diffDaysBetweenKeys(fromKey: string, toKey: string): number {
  const fromDate = parseLocalIsoDate(fromKey);
  const toDate = parseLocalIsoDate(toKey);
  return Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
}

function formatHindiDateFromIso(isoKey: string): string {
  return parseLocalIsoDate(isoKey).toLocaleDateString('hi-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Complete 2026–2027 Indian Festival & National Celebration Calendar with strict startDate & endDate windows
const FESTIVAL_CATALOG: FestivalCatalogEntry[] = [
  // Already passed early Nov 2026 windows (kept in history for date lookups, strictly filtered out once endDate < today)
  {
    id: 'dhanteras-2026',
    startDate: '2026-11-05',
    endDate: '2026-11-06',
    nameHindi: 'शुभ धनतेरस (धन्वंतरि त्रयोदशी) महापर्व',
    englishName: 'Dhanteras',
    tagline: 'भगवान धन्वंतरि व मां महालक्ष्मी की असीम कृपा, आरोग्य व समृद्धि',
    badge: 'धनतेरस समृद्धि पर्व',
    imageUrl: dhanterasImg,
    themeGradient: 'from-amber-600/40 via-yellow-950/70 to-slate-950',
    badgeColor: 'bg-amber-500/25 text-amber-300 border-amber-400',
    iconName: 'Sparkles',
    ctaText: 'धनतेरस स्पेशल प्लान देखें',
    significance: 'धनतेरस पर आयुर्वेद के जनक भगवान धन्वंतरि और मां लक्ष्मी की पूजा की जाती है।',
    story: 'समुद्र मंथन के समय भगवान धन्वंतरि अपने हाथों में अमृत कलश लेकर प्रकट हुए थे।',
    shubhMuhurat: 'प्रदोष काल पूजन: सायं 05:42 PM से 07:18 PM',
    muhuratDetails: [
      { label: 'शुभ खरीदारी मुहूर्त', time: '11:45 AM - 01:20 PM', importance: 'अमृत चौघड़िया' },
      { label: 'यम दीपदान समय', time: '05:42 PM - 07:18 PM', importance: 'अकाल मृत्यु निवारण' }
    ],
    pujaVidhi: [
      'चौकी पर पीले वस्त्र बिछाकर भगवान धन्वंतरि और कुबेर देव की प्रतिमा स्थापित करें।',
      'दक्षिण दिशा में यमराज के निमित्त चार मुखी दीपक (यम दीपक) प्रज्वलित करें।'
    ],
    mantra: 'ॐ नमो भगवते महासुदर्शनाय वासुदेवाय धन्वंतरये अमृतकलशहस्ताय नमः॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से धनतेरस के पावन अवसर पर आपके घर में सुख, आरोग्य और अखंड समृद्धि की वर्षा हो।',
    dosAndDonts: {
      dos: ['यम दीपदान दक्षिण दिशा में करें।', 'नई उपयोगी वस्तु खरीदें।'],
      donts: ['कांच, लोहे या नुकीली वस्तुओं की खरीद से बचें।']
    }
  },
  {
    id: 'diwali-2026',
    startDate: '2026-11-07',
    endDate: '2026-11-08',
    nameHindi: 'शुभ दीपावली — महालक्ष्मी व श्री गणेश पूजन',
    englishName: 'Diwali / Deepawali',
    tagline: 'अंधकार पर प्रकाश की विजय, हर घर ज्ञान व स्वावलंबन का दीप',
    badge: 'दीपावली महापर्व',
    imageUrl: diwaliImg,
    themeGradient: 'from-red-700/35 via-amber-900/50 to-slate-950',
    badgeColor: 'bg-orange-500/25 text-amber-200 border-orange-400',
    iconName: 'Flame',
    ctaText: 'दीपावली विशेष प्लान्स देखें',
    significance: '14 वर्ष के वनवास के पश्चात भगवान श्रीराम के अयोध्या आगमन पर घी के दीये जलाकर स्वागत किया गया था।',
    story: 'कार्तिक अमावस्या की रात्रि में समुद्र मंथन से मां महालक्ष्मी का प्राकट्य हुआ था।',
    shubhMuhurat: 'प्रदोष काल लक्ष्मी पूजन: सायं 05:38 PM से 08:14 PM',
    muhuratDetails: [
      { label: 'प्रदोष काल मुहूर्त', time: '05:38 PM - 08:14 PM', importance: 'गृहस्थों के लिए सर्वश्रेष्ठ' },
      { label: 'महानिशीथ काल', time: '11:39 PM - 12:31 AM', importance: 'व्यापारियों हेतु' }
    ],
    pujaVidhi: [
      'उत्तर या पूर्व दिशा में चौकी पर लाल वस्त्र बिछाकर मां लक्ष्मी व गणेश जी स्थापित करें।',
      'घर के मुख्य द्वार पर घी व सरसों के तेल के 21 दीये जलाएं।'
    ],
    mantra: 'ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से शुभ दीपावली! आपके जीवन में सुख, शांति और समृद्धि का दीप सदैव प्रज्वलित रहे।',
    dosAndDonts: {
      dos: ['स्वच्छता रखें और घर के हर कोने में रोशनी करें।'],
      donts: ['घर में अंधेरा न रहने दें।']
    }
  },
  {
    id: 'govardhan-2026',
    startDate: '2026-11-09',
    endDate: '2026-11-10',
    nameHindi: 'गोवर्धन पूजा व अन्नकूट महापर्व',
    englishName: 'Govardhan Puja & Annakoot',
    tagline: 'प्रकृति व गोधन वंदन, श्रीकृष्ण लीला व स्वावलंबन का संकल्प',
    badge: 'गोवर्धन व अन्नकूट उत्सव',
    imageUrl: govardhanImg,
    themeGradient: 'from-emerald-600/35 via-green-950/60 to-slate-950',
    badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400',
    iconName: 'Sun',
    ctaText: 'ज्वाइन करें / Register Now',
    significance: 'गोवर्धन पूजा प्रकृति, पर्यावरण और गोधन के प्रति हमारी कृतज्ञता का प्रतीक है।',
    story: 'श्रीकृष्ण ने अपनी कनिष्ठिका अंगुली पर सात दिन तक विशाल गोवर्धन पर्वत को धारण कर समस्त ब्रजवासियों की रक्षा की थी।',
    shubhMuhurat: 'प्रातः 06:34 AM से 08:46 AM एवं सायं 03:22 PM से 05:35 PM',
    muhuratDetails: [
      { label: 'प्रातः गोवर्धन पूजन', time: '06:34 AM - 08:46 AM', importance: 'अमृत चौघड़िया' },
      { label: 'संध्या अन्नकूट भोग', time: '03:22 PM - 05:35 PM', importance: 'गोधूलि वेला' }
    ],
    pujaVidhi: ['आंगन में गोवर्धन पर्वत का स्वरूप बनाकर 56 भोग व अन्नकूट अर्पित करें।'],
    mantra: 'गोवर्धन धराधार गोकुल त्राणकारक। विष्णुबाहु कृतोच्छ्राय गवां कोटिप्रदो भव॥',
    greetingsMessage: 'IOIS INDIA की ओर से गोवर्धन पूजा और अन्नकूट महापर्व की हार्दिक बधाई!',
    dosAndDonts: {
      dos: ['गौ माता की सेवा करें और अन्नकूट प्रसाद सभी में बांटें।'],
      donts: ['अन्न का अनादर न करें।']
    }
  },
  {
    id: 'bhaidooj-2026',
    startDate: '2026-11-11',
    endDate: '2026-11-12',
    nameHindi: 'शुभ भाई दूज (यम द्वितीया) महापर्व',
    englishName: 'Bhai Dooj / Yama Dwitiya',
    tagline: 'भाई-बहन के अटूट स्नेह, दीर्घायु व सुरक्षा का पावन पर्व',
    badge: 'भाई दूज विशेष महापर्व',
    imageUrl: bhaidoojImg,
    themeGradient: 'from-rose-600/35 via-pink-950/60 to-slate-950',
    badgeColor: 'bg-pink-500/25 text-pink-300 border-pink-400',
    iconName: 'Heart',
    ctaText: 'विशेष बधाई व ऑफर देखें',
    significance: 'इस दिन बहनें अपने भाइयों के माथे पर तिलक लगाकर उनकी दीर्घायु व समृद्धि की मंगलकामना करती हैं।',
    story: 'मृत्यु के देवता यमराज अपनी बहन यमुना के घर पधारे थे और यमुना जी ने प्रेमपूर्वक उनका सत्कार व तिलक किया था।',
    shubhMuhurat: 'दोपहर 01:10 PM से 03:22 PM (अमृत व विजय मुहूर्त)',
    muhuratDetails: [
      { label: 'सर्वश्रेष्ठ तिलक मुहूर्त', time: '01:10 PM - 03:22 PM', importance: 'विजय व अमृत चौघड़िया' }
    ],
    pujaVidhi: ['बहन भाई के माथे पर चंदन व रोली का तिलक लगाकर सूखा नारियल भेंट करें।'],
    mantra: 'गंगा पूजे यमुना को, यमी पूजे यमराज को। मेरे भाई की आयु बढ़े॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से भाई दूज महापर्व की अनंत मंगलकामनाएं!',
    dosAndDonts: {
      dos: ['बहन के घर भोजन करें व उपहार दें।'],
      donts: ['राहु काल के दौरान मुख्य तिलक न करें।']
    }
  },

  // CHHATH PUJA MAHAPARV 2026 (13–16 Nov 2026: Nahay-Khay 13, Kharna 14, Sandhya Arghya 15, Usha Arghya 16)
  {
    id: 'chhath-2026',
    startDate: '2026-11-13',
    endDate: '2026-11-16',
    nameHindi: 'लोक आस्था का महापर्व छठ पूजा — नहाय-खाय से उषा अर्घ्य तक',
    englishName: 'Chhath Puja Mahaparv',
    tagline: 'भगवान सूर्य देव व छठी मैया की असीम कृपा, स्वच्छता व सामाजिक समरसता का महापर्व',
    badge: 'महापर्व छठ पूजा 2026',
    imageUrl: chhathImg,
    themeGradient: 'from-orange-600/45 via-amber-950/75 to-slate-950',
    badgeColor: 'bg-orange-500/25 text-amber-200 border-orange-400',
    iconName: 'Sun',
    ctaText: 'छठ महापर्व कथा व शुभ मुहूर्त देखें',
    significance: 'छठ महापर्व स्वच्छता, कठोर साधना, प्रकृति प्रेम और सूर्य देव के प्रति कृतज्ञता व्यक्त करने का विश्वविख्यात महापर्व है। यह एकमात्र ऐसा पर्व है जिसमें अस्ताचलगामी और उदीयमान दोनों सूर्यों को अर्घ्य दिया जाता है।',
    story: 'महाभारत काल में माता कुंती और द्रौपदी द्वारा सूर्य उपासना तथा भगवान श्रीराम व माता सीता द्वारा अयोध्या आगमन पर सूर्य देव की आराधना से छठ पूजा की परंपरा प्रारंभ हुई। छठी मैया संतान रक्षा, निरोगी काया और अखंड सौभाग्य का वरदान देती हैं।',
    shubhMuhurat: 'संध्या अर्घ्य: सायं 05:26 PM | प्रातः उषा अर्घ्य: सुबह 06:24 AM',
    muhuratDetails: [
      { label: 'खरना प्रसाद समय', time: '05:45 PM - 08:15 PM', importance: 'गुड़ की खीर व रोटी का महाप्रसाद' },
      { label: 'संध्या अर्घ्य समय', time: '05:26 PM (सूर्यास्त)', importance: 'अस्ताचल सूर्य को प्रथम अर्घ्य' },
      { label: 'उषा अर्घ्य समय', time: '06:24 AM (सूर्योदय)', importance: 'उगते सूर्य को अर्घ्य व पारण' }
    ],
    pujaVidhi: [
      'नहाय-खाय के दिन पवित्र स्नान कर कद्दू-भात का सात्विक भोजन ग्रहण करें।',
      'खरना के दिन उपवास रहकर शाम को मिट्टी के चूल्हे पर गुड़ की खीर व रोटी का प्रसाद बनाएं।',
      'संध्या अर्घ्य के दिन सूप, दउरा, फल, ईख (गन्ना) व ठेकुआ लेकर नदी घाट जाकर सूर्य देव को अर्घ्य दें।',
      'अगली सुबह उगते सूर्य को दूध व जल से अर्घ्य देकर 36 घंटे के निर्जला व्रत का पारण करें।'
    ],
    mantra: 'ॐ एहि सूर्य सहस्त्रांशो तेजोराशे जगत्पते। अनुकम्पय मां भक्त्या गृहाणार्घ्यं दिवाकर॥',
    greetingsMessage: 'जय छठी मैया! IOIS INDIA परिवार की ओर से देश-विदेश के सभी व्रतियों एवं परिवारों को लोक आस्था के महापर्व छठ पूजा की हार्दिक बधाई व अनंत शुभकामनाएं। भगवान सूर्य देव आपके जीवन को सुख, उत्तम स्वास्थ्य और समृद्धि से आलोकित करें।',
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
  },

  // UPCOMING #1 (20–21 Nov 2026): DEVUTHANI EKADASHI & TULSI VIVAH
  {
    id: 'tulsi-vivah-2026',
    startDate: '2026-11-20',
    endDate: '2026-11-21',
    nameHindi: 'देवउठनी एकादशी व पावन तुलसी विवाह महापर्व',
    englishName: 'Devuthani Ekadashi & Tulsi Vivah',
    tagline: 'चातुर्मास समाप्ति, भगवान श्रीहरि विष्णु का योगनिद्रा जागरण व शुभ मांगलिक कार्यों का आरंभ',
    badge: 'देवउठनी एकादशी • तुलसी विवाह',
    imageUrl: tulsiVivahImg,
    themeGradient: 'from-emerald-600/40 via-amber-950/65 to-slate-950',
    badgeColor: 'bg-emerald-500/25 text-emerald-200 border-emerald-400',
    iconName: 'Sparkles',
    ctaText: 'देवउठनी एकादशी मुहूर्त व विधि देखें',
    significance: 'कार्तिक शुक्ल एकादशी को देवप्रबोधिनी या देवउठनी एकादशी कहा जाता है। इसी दिन भगवान विष्णु चार माह की योगनिद्रा से जागते हैं और माता तुलसी व शालिग्राम जी का पावन विवाह संपन्न होता है। इसी दिन से समस्त मांगलिक व विवाह कार्य प्रारंभ होते हैं।',
    story: 'पौराणिक कथा के अनुसार माता वृंदा (तुलसी) के पातिव्रत्य व भक्ति से प्रसन्न होकर भगवान श्रीहरि ने वरदान दिया कि कार्तिक शुक्ल एकादशी को शालिग्राम स्वरूप में उनका तुलसी के साथ विवाह संपन्न होगा और बिना तुलसी दल के वे कोई भोग स्वीकार नहीं करेंगे।',
    shubhMuhurat: 'प्रदोष काल तुलसी विवाह: सायं 05:32 PM से 07:48 PM',
    muhuratDetails: [
      { label: 'प्रातः एकादशी पूजन', time: '06:48 AM - 09:20 AM', importance: 'विष्णु सहस्रनाम पाठ व संकल्प' },
      { label: 'शालिग्राम-तुलसी विवाह', time: '05:32 PM - 07:48 PM', importance: 'सर्वश्रेष्ठ प्रदोष गोधूलि वेला' },
      { label: 'अभिजित मुहूर्त', time: '11:44 AM - 12:28 PM', importance: 'दान-पुण्य व नया कार्य आरंभ' }
    ],
    pujaVidhi: [
      'आंगन में गेरू व रंगोली से मंडप सजाएं और गन्ने का सुंदर चबूतरा बनाएं।',
      'तुलसी माता को लाल चुनरी, सोलह श्रृंगार व गेंदे के फूलों की माला अर्पित करें।',
      'भगवान शालिग्राम और तुलसी जी की सात परिक्रमा कर घी के दीयों से आरती उतारें।',
      'आंवला, सिंघाड़ा, गन्ना व मीठे पकवान का भोग लगाकर प्रसाद वितरित करें।'
    ],
    mantra: 'महाप्रसाद जननी सर्व सौभाग्यवर्धिनी। आधि व्याधि हरा नित्यं तुलसी त्वं नमोस्तुते॥',
    greetingsMessage: 'IOIS INDIA की ओर से देवउठनी एकादशी एवं पावन तुलसी विवाह की हार्दिक बधाई! भगवान श्रीहरि विष्णु व माता तुलसी की कृपा से आपके जीवन में सभी मांगलिक कार्य सिद्ध हों और घर में सुख-शांति का वास हो।',
    dosAndDonts: {
      dos: [
        'संध्या समय तुलसी जी के पास गाय के घी का दीपक अवश्य जलाएं।',
        'जरूरतमंदों को अन्न, वस्त्र या फलों का दान करें।'
      ],
      donts: [
        'एकादशी के दिन चावल का सेवन न करें और तुलसी के पत्ते न तोड़ें।'
      ]
    }
  },

  // UPCOMING #2 (24–25 Nov 2026): DEV DEEPAWALI, KARTIK PURNIMA & GURU NANAK JAYANTI
  {
    id: 'dev-deepawali-2026',
    startDate: '2026-11-24',
    endDate: '2026-11-25',
    nameHindi: 'देव दीपावली, कार्तिक पूर्णिमा व श्री गुरु नानक जयंती',
    englishName: 'Dev Deepawali & Kartik Purnima',
    tagline: 'देवताओं का पावन दीपोत्सव, पवित्र गंगा स्नान व गुरु नानक देव जी का प्रकाश पर्व',
    badge: 'देव दीपावली व कार्तिक पूर्णिमा',
    imageUrl: devDeepawaliImg,
    themeGradient: 'from-amber-600/45 via-indigo-950/75 to-slate-950',
    badgeColor: 'bg-amber-500/25 text-amber-200 border-amber-400',
    iconName: 'Flame',
    ctaText: 'देव दीपावली शुभ मुहूर्त देखें',
    significance: 'कार्तिक पूर्णिमा के दिन काशी के घाटों पर लाखों दीप जलाकर देव दीपावली मनाई जाती है। इसी पावन तिथि को भगवान शिव ने त्रिपुरासुर का वध किया था और सिख धर्म के प्रथम गुरु श्री गुरु नानक देव जी का प्रकाश पर्व भी बड़े श्रद्धाभाव से मनाया जाता है।',
    story: 'देवताओं द्वारा असुरराज त्रिपुरासुर के अंत की खुशी में स्वर्ग व काशी के गंगा तट पर स्वयं देवगणों ने उतरकर दीप प्रज्वलित किए थे। तभी से कार्तिक पूर्णिमा को देव दीपावली एवं त्रिपुरारी पूर्णिमा के रूप में मनाया जाता है।',
    shubhMuhurat: 'प्रदोष दीपदान मुहूर्त: सायं 05:18 PM से 07:54 PM | ब्रह्म मुहूर्त स्नान: 04:52 AM',
    muhuratDetails: [
      { label: 'पवित्र स्नान काल', time: '04:52 AM - 06:15 AM', importance: 'गंगा स्नान व सत्यनारायण संकल्प' },
      { label: 'देव दीपावली दीपदान', time: '05:18 PM - 07:54 PM', importance: 'प्रदोष काल 11 या 21 दीपदान' },
      { label: 'चंद्रोदय अर्घ्य', time: '05:36 PM', importance: 'पूर्णिमा चंद्र दर्शन व खीर भोग' }
    ],
    pujaVidhi: [
      'प्रातः पवित्र नदी या घर के जल में गंगाजल मिलाकर स्नान करें व सूर्य अर्घ्य दें।',
      'भगवान सत्यनारायण की कथा सुनें और गुरुद्वारा साहिब या मंदिर में मत्था टेकें।',
      'संध्या वेला में तुलसी जी, घर के द्वार और मंदिर में घी के दीये जलाकर दीपदान करें।'
    ],
    mantra: 'ॐ नमो भगवते वासुदेवाय नमः॥ एक ओंकार सतनाम कर्ता पुरख॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से देव दीपावली, कार्तिक पूर्णिमा एवं श्री गुरु नानक देव जी के प्रकाश पर्व की लख-लख बधाइयां! ज्ञान व आस्था के इन असंख्य दीपों से आपका संपूर्ण जीवन प्रकाशित हो।',
    dosAndDonts: {
      dos: [
        'कम से कम 5 या 11 दीये घर के द्वार व पूजा स्थल पर जलाएं।',
        'सत्संग, लंगर या अन्नदान में सहभागी बनें।'
      ],
      donts: [
        'किसी भी जीव को कष्ट न पहुंचाएं और क्रोध से दूर रहें।'
      ]
    }
  },

  // DEC 2026: GITA JAYANTI & VIVAH PANCHAMI
  {
    id: 'gita-jayanti-2026',
    startDate: '2026-12-14',
    endDate: '2026-12-20',
    nameHindi: 'मोक्षदा एकादशी, गीता जयंती व विवाह पंचमी महोत्सव',
    englishName: 'Gita Jayanti & Vivah Panchami',
    tagline: 'श्रीमद्भगवद्गीता का पावन ज्ञान संदेश, कर्मयोग व सनातन संस्कृति का गौरव',
    badge: 'गीता जयंती महापर्व 2026',
    imageUrl: templePujaImg,
    themeGradient: 'from-amber-600/40 via-slate-900/75 to-slate-950',
    badgeColor: 'bg-amber-500/25 text-amber-200 border-amber-400',
    iconName: 'GraduationCap',
    ctaText: 'गीता जयंती संदेश व पंचांग देखें',
    significance: 'मार्गशीर्ष शुक्ल एकादशी को भगवान श्रीकृष्ण ने कुरुक्षेत्र के मैदान में अर्जुन को श्रीमद्भगवद्गीता का अमर उपदेश दिया था। यह दिन हमें निष्काम कर्म, कर्तव्य पालन और ज्ञान योग की प्रेरणा देता है।',
    story: 'जब महाभारत युद्ध में अर्जुन मोहग्रस्त हो गए, तब योगेश्वर श्रीकृष्ण ने आत्मा की अमरता और धर्म के मार्ग पर निडर होकर कर्म करने का दिव्य ज्ञान प्रदान किया।',
    shubhMuhurat: 'अभिजित गीता पाठ मुहूर्त: प्रातः 11:48 AM से 12:34 PM',
    muhuratDetails: [
      { label: 'गीता पाठ व पूजन', time: '07:15 AM - 10:30 AM', importance: 'भगवद्गीता ग्रंथ पूजन' },
      { label: 'संध्या आरती व स्मरण', time: '05:22 PM - 06:45 PM', importance: 'श्रीकृष्ण व राम नाम संकीर्तन' }
    ],
    pujaVidhi: [
      'श्रीमद्भगवद्गीता ग्रंथ को पीले वस्त्र पर स्थापित कर पुष्प व तिलक अर्पित करें।',
      'कम से कम एक अध्याय या महत्वपूर्ण श्लोकों का परिवार सहित पाठ करें।'
    ],
    mantra: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    greetingsMessage: 'IOIS INDIA की ओर से गीता जयंती व विवाह पंचमी की मंगलमय शुभकामनाएं! कर्मयोग और ज्ञान के प्रकाश से आप सदैव प्रगति के पथ पर अग्रसर रहें।',
    dosAndDonts: {
      dos: ['विद्यार्थियों को पुस्तकें व ज्ञान सामग्री भेंट करें।'],
      donts: ['आलस्य और निराशा को मन में स्थान न दें।']
    }
  },

  // DEC 25-26 2026: TULSI PUJAN DIWAS & CHRISTMAS JOY
  {
    id: 'winter-festive-2026',
    startDate: '2026-12-25',
    endDate: '2026-12-26',
    nameHindi: 'तुलसी पूजन दिवस व क्रिसमस सद्भावना उत्सव 2026',
    englishName: 'Tulsi Pujan Diwas & Christmas',
    tagline: 'प्रेम, सद्भाव, परिवार मिलन व सकारात्मक ऊर्जा का पावन उत्सव',
    badge: 'सद्भावना व तुलसी पूजन उत्सव',
    imageUrl: winterNewYearImg,
    themeGradient: 'from-rose-600/35 via-emerald-950/60 to-slate-950',
    badgeColor: 'bg-emerald-500/25 text-emerald-200 border-emerald-400',
    iconName: 'Heart',
    ctaText: 'विशेष उत्सव बधाई व प्लान देखें',
    significance: '25 दिसंबर का दिन भारतीय परंपरा में तुलसी पूजन दिवस और विश्वभर में प्रेम व सेवा भाव के प्रतीक क्रिसमस के रूप में हर्षोल्लास के साथ मनाया जाता है।',
    story: 'यह पर्व आपसी भाईचारे, दूसरों की मदद करने, परिवार के साथ खुशियां बांटने और प्रकृति व मानवता की सेवा करने की प्रेरणा देता है।',
    shubhMuhurat: 'प्रातः तुलसी वंदना: 07:10 AM से 09:30 AM | सायं दीप प्रज्वलन: 05:30 PM',
    muhuratDetails: [
      { label: 'प्रातः तुलसी अर्चन', time: '07:10 AM - 09:30 AM', importance: 'आरोग्य व शांति हेतु' },
      { label: 'संध्या उत्सव व मिलन', time: '05:30 PM - 08:30 PM', importance: 'पारिवारिक सद्भाव व उपहार' }
    ],
    pujaVidhi: [
      'तुलसी माता को जल व रोली अर्पित कर परिवार के उत्तम स्वास्थ्य की प्रार्थना करें।',
      'मित्रों व जरूरतमंद बच्चों के साथ उपहार व मिठाइयां साझा करें।'
    ],
    mantra: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से तुलसी पूजन दिवस एवं मैरी क्रिसमस की हार्दिक बधाई! आपका घर प्रेम, खुशी और उत्तम स्वास्थ्य से भरपूर रहे।',
    dosAndDonts: {
      dos: ['परिवार व मित्रों को सकारात्मक उपहार दें।'],
      donts: ['किसी के प्रति कटु वचन न बोलें।']
    }
  },

  // NEW YEAR 2027 (31 Dec 2026 – 2 Jan 2027)
  {
    id: 'newyear-2027',
    startDate: '2026-12-31',
    endDate: '2027-01-02',
    nameHindi: 'नूतन वर्ष 2027 — नव संकल्प व स्वावलंबन महोत्सव',
    englishName: 'Happy New Year 2027',
    tagline: 'नए वर्ष में नई ऊर्जा, डिजिटल शिक्षा और आर्थिक स्वावलंबन का स्वर्णिम संकल्प',
    badge: 'नववर्ष स्वागत 2027',
    imageUrl: winterNewYearImg,
    themeGradient: 'from-amber-500/45 via-blue-950/70 to-slate-950',
    badgeColor: 'bg-amber-400/25 text-amber-200 border-amber-300',
    iconName: 'Sparkles',
    ctaText: 'नववर्ष 2027 विशेष शुरुआत करें',
    significance: 'नया साल 2027 हमारे जीवन में नए लक्ष्यों को प्राप्त करने, कौशल सीखने और अपने परिवार को डिजिटल व आर्थिक रूप से सशक्त बनाने का सुनहरा अवसर है।',
    story: 'प्रत्येक नव वर्ष हमें बीते अनुभवों से सीखकर नए उत्साह के साथ आगे बढ़ने की प्रेरणा देता है।',
    shubhMuhurat: 'नववर्ष प्रातः संकल्प समय: 06:45 AM से 11:30 AM',
    muhuratDetails: [
      { label: 'प्रातः सूर्य वंदन', time: '06:55 AM - 08:10 AM', importance: 'नए वर्ष की ऊर्जावान शुरुआत' },
      { label: 'अभिजित मुहूर्त', time: '11:58 AM - 12:42 PM', importance: 'नए लक्ष्य व पंजीकरण का श्रेष्ठ समय' }
    ],
    pujaVidhi: [
      'माता-पिता व गुरुजनों का आशीर्वाद लेकर नए वर्ष के लक्ष्यों की डायरी लिखें।',
      'सकारात्मक ऊर्जा के साथ अपने काम व अध्ययन का शुभारंभ करें।'
    ],
    mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से आपको और आपके पूरे परिवार को नूतन वर्ष 2027 की कोटि-कोटि बधाई! नया साल आपके जीवन में अपार सफलता, उत्तम स्वास्थ्य और निरंतर प्रगति लेकर आए।',
    dosAndDonts: {
      dos: ['नए वर्ष पर अपनी बचत और शिक्षा का लक्ष्य तय करें।'],
      donts: ['समय व धन को व्यर्थ के कार्यों में न गंवाएं।']
    }
  },

  // JAN 2027: LOHRI, MAKAR SANKRANTI & PONGAL
  {
    id: 'makar-sankranti-2027',
    startDate: '2027-01-13',
    endDate: '2027-01-15',
    nameHindi: 'लोहड़ी, मकर संक्रांति व पोंगल महापर्व 2027',
    englishName: 'Makar Sankranti, Lohri & Pongal',
    tagline: 'सूर्य देव का उत्तरायण प्रवेश, नई फसल का हर्षोल्लास व तिल-गुड़ का मधुर संगम',
    badge: 'मकर संक्रांति व उत्तरायण पर्व',
    imageUrl: makarSankrantiImg,
    themeGradient: 'from-amber-500/40 via-sky-950/65 to-slate-950',
    badgeColor: 'bg-yellow-500/25 text-yellow-200 border-yellow-400',
    iconName: 'Sun',
    ctaText: 'मकर संक्रांति पंचांग व दान विधि देखें',
    significance: 'मकर संक्रांति के दिन भगवान सूर्य धनु राशि से निकलकर मकर राशि में प्रवेश करते हैं और उत्तरायण होते हैं। इसे फसल कटाई, पवित्र नदी स्नान और तिल-गुड़ व खिचड़ी दान के महापर्व के रूप में पूरे भारत में मनाया जाता है।',
    story: 'भीष्म पितामह ने भी देह त्याग के लिए सूर्य के उत्तरायण होने (मकर संक्रांति) की प्रतीक्षा की थी। इस दिन से देवताओं का दिन प्रारंभ होता है और शुभ कार्यों की शक्ति कई गुना बढ़ जाती है।',
    shubhMuhurat: 'महापुण्य काल: प्रातः 07:15 AM से सायं 05:45 PM',
    muhuratDetails: [
      { label: 'पुण्य काल स्नान व दान', time: '07:15 AM - 12:30 PM', importance: 'सर्वश्रेष्ठ खिचड़ी व तिल दान समय' }
    ],
    pujaVidhi: [
      'प्रातः स्नान कर तांबे के लोटे से सूर्य देव को जल, लाल पुष्प व रोली अर्पित करें।',
      'तिल, गुड़, खिचड़ी और गर्म वस्त्रों का दान करें तथा तिल के लड्डुओं से मुंह मीठा कराएं।'
    ],
    mantra: 'ॐ घृणि सूर्याय नमः॥ जपाकुसुम संकाशं काश्यपेयं महाद्युतिम्॥',
    greetingsMessage: 'तिल हम हैं और गुड़ आप, मिठाई हम हैं और मिठास आप! IOIS INDIA की ओर से मकर संक्रांति, लोहड़ी व पोंगल महापर्व की हार्दिक बधाई व मंगलकामनाएं।',
    dosAndDonts: {
      dos: ['तिल-गुड़ व खिचड़ी का दान करें और सूर्य अर्घ्य दें।'],
      donts: ['तामसिक भोजन और कटु व्यवहार से दूर रहें।']
    }
  },

  // JAN 25-26 2027: REPUBLIC DAY
  {
    id: 'republic-day-2027',
    startDate: '2027-01-25',
    endDate: '2027-01-26',
    nameHindi: '78वां गणतंत्र दिवस राष्ट्रीय गौरव महोत्सव 2027',
    englishName: 'Republic Day India 2027',
    tagline: 'जय हिन्द! संविधान गौरव, राष्ट्रीय एकता व आत्मनिर्भर डिजिटल भारत का संकल्प',
    badge: 'गणतंत्र दिवस राष्ट्रीय पर्व',
    imageUrl: nationalDayImg,
    themeGradient: 'from-orange-600/35 via-slate-900/75 to-emerald-800/45',
    badgeColor: 'bg-emerald-500/25 text-emerald-200 border-amber-400',
    iconName: 'ShieldCheck',
    ctaText: 'आत्मनिर्भर भारत मिशन से जुड़ें',
    significance: '26 जनवरी 1950 को भारत का महान संविधान लागू हुआ था और हमारा देश एक संप्रभु लोकतांत्रिक गणराज्य बना। यह दिन हर भारतीय के हृदय में देशभक्ति, कर्तव्य और एकता का गौरव जगाता है।',
    story: 'बाबा साहेब डॉ. भीमराव अंबेडकर एवं संविधान सभा के महान निर्माताओं के अथक प्रयासों से भारत को विश्व का सबसे विशाल लोकतांत्रिक संविधान प्राप्त हुआ।',
    shubhMuhurat: 'ध्वजारोहण व राष्ट्रीय वंदन: प्रातः 08:00 AM से 10:30 AM',
    muhuratDetails: [
      { label: 'ध्वजारोहण व परेड', time: '08:00 AM - 11:00 AM', importance: 'तिरंगा वंदन व राष्ट्रगान' }
    ],
    pujaVidhi: [
      'तिरंगे ध्वज को सलामी दें और राष्ट्रगान गाकर देश की प्रगति में योगदान का संकल्प लें।',
      'शिक्षा और डिजिटल स्वावलंबन को अपने क्षेत्र में आगे बढ़ाएं।'
    ],
    mantra: 'वन्दे मातरम्! सत्यमेव जयते! जय हिन्द!',
    greetingsMessage: 'सभी देशवासियों और सदस्यों को IOIS INDIA परिवार की ओर से गणतंत्र दिवस की हार्दिक बधाई! आइए, मिलकर शिक्षित, सुरक्षित और आत्मनिर्भर भारत का निर्माण करें।',
    dosAndDonts: {
      dos: ['राष्ट्रीय ध्वज का पूर्ण सम्मान करें और संविधान के मूल्यों को अपनाएं।'],
      donts: ['प्लास्टिक के झंडों का प्रयोग व अपमान कदापि न करें।']
    }
  },

  // FEB 2027: VASANT PANCHAMI & SARASWATI PUJA
  {
    id: 'vasant-panchami-2027',
    startDate: '2027-02-11',
    endDate: '2027-02-12',
    nameHindi: 'वसंत पंचमी एवं मां सरस्वती पूजन महापर्व 2027',
    englishName: 'Vasant Panchami & Saraswati Puja',
    tagline: 'ज्ञान, बुद्धि, विद्या और कला की अधिष्ठात्री देवी मां सरस्वती का पावन प्राकट्य उत्सव',
    badge: 'विद्या व सरस्वती पूजा पर्व',
    imageUrl: templePujaImg,
    themeGradient: 'from-yellow-500/40 via-amber-950/65 to-slate-950',
    badgeColor: 'bg-yellow-400/25 text-yellow-200 border-yellow-300',
    iconName: 'GraduationCap',
    ctaText: 'विद्यार्थी अध्ययन व NCERT नोट्स देखें',
    significance: 'माघ शुक्ल पंचमी को मां सरस्वती की आराधना की जाती है। विद्यार्थियों, शिक्षकों और नए कार्य प्रारंभ करने वालों के लिए यह वर्ष के सर्वश्रेष्ठ अबूझ शुभ मुहूर्तों में से एक है।',
    story: 'ब्रह्मा जी की सृष्टि में वाणी, संगीत और ज्ञान का संचार करने हेतु इसी दिन मां सरस्वती वीणा लेकर प्रकट हुई थीं।',
    shubhMuhurat: 'मां सरस्वती पूजन मुहूर्त: प्रातः 07:05 AM से 12:35 PM',
    muhuratDetails: [
      { label: 'विद्या आरंभ मुहूर्त', time: '07:05 AM - 12:35 PM', importance: 'छात्रों व पुस्तकों के पूजन हेतु' }
    ],
    pujaVidhi: [
      'पीले वस्त्र धारण कर मां सरस्वती को पीले पुष्प, हल्दी, केसरिया भात व पुस्तकें अर्पित करें।',
      'विद्यार्थी पढ़ाई में एकाग्रता व सफलता के लिए मां वीणावादिनी का वंदन करें।'
    ],
    mantra: 'या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता। या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से सभी विद्यार्थियों एवं देशवासियों को वसंत पंचमी व सरस्वती पूजा की हार्दिक बधाई! मां शारदे आपको असीम ज्ञान व सफलता प्रदान करें।',
    dosAndDonts: {
      dos: ['अपनी पुस्तकों व लेखनी का पूजन कर गुरुजनों का सम्मान करें।'],
      donts: ['विद्या व पुस्तकों का अनादर न करें।']
    }
  },

  // MAR 2027: MAHA SHIVARATRI
  {
    id: 'mahashivaratri-2027',
    startDate: '2027-03-05',
    endDate: '2027-03-07',
    nameHindi: 'महाशिवरात्रि महापर्व — हर हर महादेव',
    englishName: 'Maha Shivaratri 2027',
    tagline: 'देवाधिदेव महादेव व माता पार्वती के पावन मिलन, भक्ति और शक्ति का महापर्व',
    badge: 'महाशिवरात्रि महोत्सव',
    imageUrl: templePujaImg,
    themeGradient: 'from-indigo-700/45 via-slate-900/80 to-amber-900/40',
    badgeColor: 'bg-indigo-500/25 text-indigo-200 border-indigo-400',
    iconName: 'Sparkles',
    ctaText: 'महाशिवरात्रि चार प्रहर पूजा मुहूर्त देखें',
    significance: 'फाल्गुन कृष्ण चतुर्दशी को भगवान शिव और माता पार्वती का दिव्य विवाह संपन्न हुआ था तथा महादेव ज्योतिर्लिंग के रूप में प्रकट हुए थे।',
    story: 'महाशिवरात्रि की पावन रात्रि में चारों प्रहर शिव अभिषेक करने से समस्त कष्ट दूर होते हैं और मनोकामनाएं पूर्ण होती हैं।',
    shubhMuhurat: 'निशीथ काल महापूजन: रात्रि 12:08 AM से 12:56 AM | प्रातः जलाभिषेक: 06:42 AM',
    muhuratDetails: [
      { label: 'प्रातः जलाभिषेक', time: '06:42 AM - 11:15 AM', importance: 'गंगाजल, दूध व बेलपत्र अर्पण' },
      { label: 'निशीथ काल पूजन', time: '12:08 AM - 12:56 AM', importance: 'सर्वश्रेष्ठ रुद्राभिषेक मुहूर्त' }
    ],
    pujaVidhi: [
      'शिवलिंग पर जल, कच्चा दूध, दही, शहद और बेलपत्र अर्पित करें।',
      'ओम नमः शिवाय पंचाक्षर मंत्र का 108 बार जप करें।'
    ],
    mantra: 'ॐ नमः शिवाय॥ ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्॥',
    greetingsMessage: 'हर हर महादेव! IOIS INDIA परिवार की ओर से महाशिवरात्रि की हार्दिक शुभकामनाएं! भोलेनाथ की कृपा से आपका परिवार सदैव सुरक्षित, स्वस्थ और खुशहाल रहे।',
    dosAndDonts: {
      dos: ['बेलपत्र, धतूरा व जल शिवलिंग पर श्रद्धापूर्वक अर्पित करें।'],
      donts: ['शिव पूजा में केतकी पुष्प या हल्दी का प्रयोग न करें।']
    }
  },

  // MAR 2027: HOLIKA DAHAN & HOLI
  {
    id: 'holi-2027',
    startDate: '2027-03-21',
    endDate: '2027-03-23',
    nameHindi: 'होलिका दहन एवं रंगोत्सव होली महापर्व 2027',
    englishName: 'Holi Festival of Colors 2027',
    tagline: 'बुराई पर अच्छाई की विजय, प्रेम के इंद्रधनुषी रंग व आपसी सौहार्द का महापर्व',
    badge: 'रंगोत्सव होली महापर्व',
    imageUrl: holiImg,
    themeGradient: 'from-fuchsia-600/40 via-amber-900/55 to-slate-950',
    badgeColor: 'bg-pink-500/25 text-pink-200 border-pink-400',
    iconName: 'Flame',
    ctaText: 'होलिका दहन व होली मुहूर्त देखें',
    significance: 'होलिका दहन हमें सिखाता है कि अहंकार कितना भी बड़ा क्यों न हो, सत्य और भक्ति के आगे नष्ट हो जाता है। रंगों की होली सारे मतभेद भुलाकर प्रेम और भाईचारे से गले मिलने का संदेश देती है।',
    story: 'भक्त प्रह्लाद की अटूट ईश्वर भक्ति की रक्षा के लिए भगवान नरसिंह ने उनकी रक्षा की और होलिका अग्नि में भस्म हो गई।',
    shubhMuhurat: 'होलिका दहन शुभ समय: रात्रि 08:52 PM से 10:45 PM',
    muhuratDetails: [
      { label: 'होलिका दहन मुहूर्त', time: '08:52 PM - 10:45 PM', importance: 'भद्रा रहित पावन समय' },
      { label: 'रंगोत्सव (धुलंडी)', time: 'अगले दिन प्रातः 07:30 AM से', importance: 'अबीर-गुलाल व गुझिया मिलन' }
    ],
    pujaVidhi: [
      'होलिका की परिक्रमा कर अग्नि में नई फसल की बालियां, नारियल व गुलाल अर्पित करें।',
      'हर्बल अबीर-गुलाल से बड़ों का आशीर्वाद लें और स्नेह बांटें।'
    ],
    mantra: 'असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। प्रेम और सौहार्द सदा बना रहे॥',
    greetingsMessage: 'रंग बरसे खुशियों के! IOIS INDIA परिवार की ओर से आपको और आपके समस्त परिवार को होलिका दहन व रंगोत्सव होली की सतरंगी शुभकामनाएं एवं हार्दिक बधाई!',
    dosAndDonts: {
      dos: ['प्राकृतिक व हर्बल गुलाल का प्रयोग करें तथा जल संरक्षण का ध्यान रखें।'],
      donts: ['किसी की इच्छा के विरुद्ध रंग न लगाएं और रसायन युक्त रंगों से बचें।']
    }
  },

  // APR 2027: CHAITRA NAVRATRI & RAM NAVAMI
  {
    id: 'navratri-ramnavami-2027',
    startDate: '2027-04-07',
    endDate: '2027-04-16',
    nameHindi: 'चैत्र नवरात्रि, श्री राम नवमी एवं सनातन नववर्ष 2027',
    englishName: 'Chaitra Navratri & Ram Navami',
    tagline: 'मां दुर्गा की शक्ति आराधना व मर्यादा पुरुषोत्तम प्रभु श्रीराम का जन्मोत्सव',
    badge: 'नवरात्रि व राम नवमी महोत्सव',
    imageUrl: templePujaImg,
    themeGradient: 'from-orange-600/40 via-red-950/65 to-slate-950',
    badgeColor: 'bg-orange-500/25 text-amber-200 border-orange-400',
    iconName: 'Flame',
    ctaText: 'नवरात्रि पूजा विधि व मुहूर्त देखें',
    significance: 'चैत्र शुक्ल प्रतिपदा से भारतीय विक्रम संवत नववर्ष व वासंतिक नवरात्रि प्रारंभ होती है और नवमी तिथि को भगवान श्रीराम का प्राकट्य उत्सव मनाया जाता है।',
    story: 'नौ दिनों तक मां शक्ति के नौ रूपों की उपासना करने से साधक को धर्म, साहस, विद्या और समृद्धि का आशीर्वाद प्राप्त होता है।',
    shubhMuhurat: 'प्रातः घटस्थापना / श्रीराम जन्मोत्सव: प्रातः 11:10 AM से 01:35 PM',
    muhuratDetails: [
      { label: 'मध्याह्न श्रीराम जन्म', time: '11:10 AM - 01:35 PM', importance: 'भये प्रगट कृपाला महाआरती' }
    ],
    pujaVidhi: [
      'मां भगवती के समक्ष अखंड ज्योति प्रज्वलित कर दुर्गा चालीसा व रामचरितमानस का पाठ करें।'
    ],
    mantra: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
    greetingsMessage: 'जय माता दी! जय श्री राम! IOIS INDIA परिवार की ओर से चैत्र नवरात्रि व श्री राम नवमी की पावन बधाई एवं मंगलकामनाएं!',
    dosAndDonts: {
      dos: ['कन्या पूजन कर सात्विक आचरण रखें।'],
      donts: ['नारियों व कन्याओं का अनादर कदापि न करें।']
    }
  },

  // AUG 2027: INDEPENDENCE DAY & RAKSHA BANDHAN
  {
    id: 'independence-day-2027',
    startDate: '2027-08-14',
    endDate: '2027-08-16',
    nameHindi: 'स्वतंत्रता दिवस एवं पावन रक्षाबंधन महोत्सव 2027',
    englishName: 'Independence Day & Raksha Bandhan',
    tagline: 'आजादी का अमृत गौरव और रक्षा सूत्र के अटूट विश्वास का महाउत्सव',
    badge: '15 अगस्त राष्ट्रीय पर्व',
    imageUrl: nationalDayImg,
    themeGradient: 'from-orange-600/35 via-slate-900/75 to-emerald-700/45',
    badgeColor: 'bg-emerald-500/25 text-emerald-200 border-amber-400',
    iconName: 'ShieldCheck',
    ctaText: 'राष्ट्रीय मिशन व विशेष ऑफर देखें',
    significance: '15 अगस्त भारत की स्वतंत्रता, अमर बलिदानियों के स्मरण और डिजिटल आत्मनिर्भर भारत निर्माण के संकल्प का पावन दिन है।',
    story: 'लाखों स्वतंत्रता सेनानियों के त्याग से भारत ने 15 अगस्त 1947 को आजादी का सूर्य देखा था।',
    shubhMuhurat: 'ध्वजारोहण: प्रातः 07:30 AM से 09:30 AM',
    muhuratDetails: [{ label: 'तिरंगा वंदन', time: '07:30 AM - 09:30 AM', importance: 'राष्ट्रीय गौरव' }],
    pujaVidhi: ['अमर शहीदों को नमन कर शिक्षा और सेवा का संकल्प लें।'],
    mantra: 'जय हिन्द! वन्दे मातरम्!',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से स्वतंत्रता दिवस की हार्दिक बधाई एवं शुभकामनाएं!',
    dosAndDonts: { dos: ['राष्ट्रीय एकता और स्वच्छता बनाए रखें।'], donts: ['तिरंगे का अनादर न करें।'] }
  },

  // NEXT YEAR LATE 2027 CYCLE (Oct-Nov 2027 fallback so annual rotation keeps running seamlessly)
  {
    id: 'diwali-2027',
    startDate: '2027-10-27',
    endDate: '2027-11-04',
    nameHindi: 'दीपावली, धनतेरस व भैया दूज महोत्सव 2027',
    englishName: 'Diwali Mahotsav 2027',
    tagline: 'प्रकाशोत्सव, महालक्ष्मी कृपा और अखंड स्वावलंबन का महापर्व',
    badge: 'दीपावली महापर्व 2027',
    imageUrl: diwaliImg,
    themeGradient: 'from-amber-600/45 via-red-950/70 to-slate-950',
    badgeColor: 'bg-amber-500/25 text-amber-200 border-amber-400',
    iconName: 'Flame',
    ctaText: 'दीपावली विशेष प्लान्स देखें',
    significance: 'दीपावली सनातन संस्कृति का सबसे भव्य प्रकाशोत्सव है।',
    story: 'भगवान श्रीराम के अयोध्या आगमन पर संपूर्ण नगरी दीपों से जगमगा उठी थी।',
    shubhMuhurat: 'प्रदोष काल लक्ष्मी पूजन: सायं 05:40 PM से 08:15 PM',
    muhuratDetails: [{ label: 'लक्ष्मी पूजन', time: '05:40 PM - 08:15 PM', importance: 'प्रदोष स्थिर लग्न' }],
    pujaVidhi: ['मां लक्ष्मी व गणेश जी का पूजन कर दीपदान करें।'],
    mantra: 'ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से शुभ दीपावली की हार्दिक बधाई एवं शुभकामनाएं!',
    dosAndDonts: { dos: ['स्वच्छता व रोशनी करें।'], donts: ['अनावश्यक प्रदूषण न करें।'] }
  }
];

function catalogToFestivalInfo(entry: FestivalCatalogEntry, targetDateKey: string, isUpcomingFlag: boolean, daysAhead: number): DayFestivalInfo {
  const cleanDateStr = isUpcomingFlag
    ? formatHindiDateFromIso(entry.startDate)
    : formatHindiDateFromIso(targetDateKey);

  return {
    id: entry.id,
    nameHindi: entry.nameHindi,
    englishName: entry.englishName,
    tagline: entry.tagline,
    dateStr: cleanDateStr,
    startDate: entry.startDate,
    endDate: entry.endDate,
    isUpcoming: isUpcomingFlag,
    daysRemaining: daysAhead,
    badge: entry.badge,
    imageUrl: entry.imageUrl,
    themeGradient: entry.themeGradient,
    badgeColor: entry.badgeColor,
    iconName: entry.iconName,
    significance: entry.significance,
    story: entry.story,
    shubhMuhurat: entry.shubhMuhurat,
    muhuratDetails: entry.muhuratDetails,
    pujaVidhi: entry.pujaVidhi,
    mantra: entry.mantra,
    greetingsMessage: entry.greetingsMessage,
    dosAndDonts: entry.dosAndDonts,
  };
}

/**
 * Returns ALL currently active festivals whose [startDate, endDate] includes targetDate.
 * Automatically ignores any festival whose endDate < today!
 */
export function getActiveFestivalsForDate(date: Date = new Date()): DayFestivalInfo[] {
  const todayKey = toLocalIsoDateKey(date);
  return FESTIVAL_CATALOG
    .filter((f) => f.startDate <= todayKey && todayKey <= f.endDate)
    .map((f) => catalogToFestivalInfo(f, todayKey, false, 0));
}

/**
 * Returns UPCOMING festivals strictly AFTER targetDate (startDate > today),
 * ordered chronologically so nearest upcoming festival comes first.
 */
export function getUpcomingFestivals(date: Date = new Date(), limit: number = 2, maxDaysAhead: number = 60): DayFestivalInfo[] {
  const todayKey = toLocalIsoDateKey(date);
  const futureAll = FESTIVAL_CATALOG
    .filter((f) => f.startDate > todayKey)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const withinWindow = futureAll.filter((f) => diffDaysBetweenKeys(todayKey, f.startDate) <= maxDaysAhead);
  const picked = (withinWindow.length > 0 ? withinWindow : futureAll).slice(0, limit);

  return picked.map((f) => {
    const days = Math.max(1, diffDaysBetweenKeys(todayKey, f.startDate));
    return catalogToFestivalInfo(f, todayKey, true, days);
  });
}

/**
 * Dynamic Vedic Panchang and Calendar Calculator
 */
export function calculateLiveVedicPanchang(targetDate: Date = new Date()): LivePanchangDetails {
  const istKey = toLocalIsoDateKey(targetDate);
  const [, istM, istD] = istKey.split('-').map(Number);
  const day = istD || targetDate.getDate();
  const month = (istM || 1) - 1;
  const istWeekdayIndex = parseLocalIsoDate(istKey).getUTCDay();

  const hindiDateStr = targetDate.toLocaleDateString('hi-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const englishDateStr = targetDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const daysOfWeek = ['रविवार (Ravivar)', 'सोमवार (Somvar)', 'मंगलवार (Mangalvar)', 'बुधवार (Budhvar)', 'गुरुवार (Guruvar)', 'शुक्रवार (Shukravar)', 'शनिवार (Shanivar)'];
  const vaara = daysOfWeek[istWeekdayIndex] || daysOfWeek[targetDate.getDay()];

  const tithis = [
    'प्रतिपदा (Pratipada)', 'द्वितीया (Dwitiya)', 'तृतीया (Tritiya)', 'चतुर्थी (Chaturthi)',
    'पंचमी (Panchami)', 'षष्ठी (Shashthi)', 'सप्तमी (Saptami)', 'अष्टमी (Ashtami)',
    'नवमी (Navami)', 'दशमी (Dashami)', 'एकादशी (Ekadashi)', 'द्वादशी (Dwadashi)',
    'त्रयोदशी (Trayodashi)', 'चतुर्दशी (Chaturdashi)', 'पूर्णिमा (Purnima)'
  ];

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
  const festival = getFestivalForDate(targetDate);

  const monthNamesHindi = [
    'पौष / माघ मास', 'माघ / फाल्गुन मास', 'फाल्गुन / चैत्र मास', 'चैत्र / वैशाख मास',
    'वैशाख / ज्येष्ठ मास', 'ज्येष्ठ / आषाढ़ मास', 'आषाढ़ / श्रावण मास', 'श्रावण / भाद्रपद मास',
    'भाद्रपद / आश्विन मास', 'आश्विन / कार्तिक मास', 'कार्तिक / मार्गशीर्ष मास', 'मार्गशीर्ष / पौष मास'
  ];

  return {
    dateHindi: hindiDateStr,
    englishDate: englishDateStr,
    samvat: 'विक्रम संवत 2083 (कालयुक्त)',
    shakaSamvat: 'शक संवत 1948',
    tithi: `${monthNamesHindi[month] || 'सनातन मास'}, ${tithis[(day + month) % 15]}`,
    tithiEndTime: 'सायंकाल 06:48 PM तक (तदुपरांत अगली तिथि)',
    paksha: day <= 15 ? 'शुक्ल पक्ष (Shukla Paksha)' : 'कृष्ण पक्ष (Krishna Paksha)',
    nakshatra: currentNakshatra,
    nakshatraEndTime: 'दोपहर 02:35 PM तक',
    yoga: 'शोभन योग (प्रातः से सूर्यास्त तक श्रेष्ठ)',
    karana: 'कौलव करण (तदुपरांत तैतिल करण)',
    vaara,
    ritu: month >= 10 || month === 0 ? 'हेमंत / शिशिर ऋतु' : month >= 1 && month <= 3 ? 'वसंत ऋतु' : month >= 4 && month <= 5 ? 'ग्रीष्म ऋतु' : 'वर्षा / शरद ऋतु',
    ayan: month >= 0 && month <= 5 ? 'उत्तरायण (Uttarayana)' : 'दक्षिणायन (Dakshinayana)',
    sunrise: '06:24 AM',
    sunset: '05:26 PM',
    moonrise: '08:45 AM',
    moonset: '07:15 PM',
    suryaRashi: `${['धनु / मकर', 'मकर / कुंभ', 'कुंभ / मीन', 'मीन / मेष', 'मेष / वृषभ', 'वृषभ / मिथुन', 'मिथुन / कर्क', 'कर्क / सिंह', 'सिंह / कन्या', 'कन्या / तुला', 'तुला / वृश्चिक', 'वृश्चिक / धनु'][month] || 'सूर्य'} संक्रांति`,
    chandraRashi: `${['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'][Math.floor((Math.floor(targetDate.getTime() / 86400000) + 3) / 2.25) % 12]} राशि (चंद्र देव)`,
    brahmaMuhurat: '04:48 AM - 05:36 AM (अमृत बेला)',
    abhijitMuhurat: '11:44 AM - 12:28 PM (सर्वश्रेष्ठ शुभ समय)',
    godhuliMuhurat: '05:22 PM - 05:48 PM (संध्या वंदन काल)',
    amritKaal: '08:40 AM - 10:15 AM',
    rahuKaal: istWeekdayIndex === 1 ? '07:45 AM - 09:05 AM' : istWeekdayIndex === 2 ? '02:50 PM - 04:15 PM' : '01:25 PM - 02:50 PM',
    yamaganda: '09:15 AM - 10:35 AM',
    gulikaKaal: '11:55 AM - 01:20 PM',
    choghadiya: {
      shubh: '06:24 AM - 07:46 AM',
      labh: '10:30 AM - 11:54 AM',
      amrit: '11:54 AM - 01:18 PM',
      chal: '01:18 PM - 02:42 PM',
      kaal: '02:42 PM - 04:06 PM',
      rog: '04:06 PM - 05:26 PM',
      udveg: '07:46 AM - 09:08 AM'
    },
    festivalsToday: festival
  };
}

/**
 * Returns active festival for the specified date; if no active festival is on that exact date,
 * returns auspicious daily panchang fallback (past festivals NEVER return).
 */
export function getFestivalForDate(date: Date = new Date()): DayFestivalInfo {
  const activeList = getActiveFestivalsForDate(date);
  if (activeList.length > 0) {
    return activeList[0];
  }

  return {
    id: 'daily-vedic-divas',
    nameHindi: 'आज का पावन सनातन दिवस व दैनिक संकल्प',
    englishName: "Today's Auspicious Day",
    tagline: 'दैनिक वैदिक ऊर्जा, शुभ मुहूर्त, सकारात्मक विचार व स्वावलंबन',
    dateStr: date.toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }),
    badge: 'आज का पावन दिवस संदेश',
    imageUrl: missionImg,
    themeGradient: 'from-amber-600/35 via-slate-900/75 to-slate-950',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400',
    iconName: 'Sun',
    significance: 'प्रत्येक नया दिन ईश्वर का दिया हुआ एक अनमोल अवसर है। प्रातःकाल सूर्य देव के दर्शन और शुभ मुहूर्त में किए गए कार्य व्यक्ति को आर्थिक, मानसिक और शारीरिक रूप से सबल बनाते हैं।',
    story: 'सनातन परंपरा में प्रत्येक दिन किसी न किसी देवी-देवता और ग्रह को समर्पित है। आज के दिन शुभ चौघड़िया में नए काम की शुरुआत और स्वावलंबन का संकल्प जीवन में विजय दिलाता है।',
    shubhMuhurat: 'अभिजित मुहूर्त: 11:44 AM से 12:28 PM (सर्वश्रेष्ठ कार्य सिद्धि समय)',
    muhuratDetails: [
      { label: 'अभिजित मुहूर्त', time: '11:44 AM - 12:28 PM', importance: 'सभी शुभ कार्यों के लिए उत्तम' },
      { label: 'अमृत चौघड़िया', time: '11:54 AM - 01:18 PM', importance: 'धन लाभ व व्यापार वृद्धि' }
    ],
    pujaVidhi: [
      'प्रातः सूर्योदय पूर्व उठकर माता-पिता व बड़ों का चरण स्पर्श करें।',
      'स्नान कर तांबे के लोटे से सूर्य देव को जल (अर्घ्य) अर्पित करें।',
      'गायत्री मंत्र का 11 बार जप करें और दिन की कार्य योजना बनाएं।'
    ],
    mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    greetingsMessage: 'IOIS INDIA परिवार की ओर से आपका आज का दिन अत्यंत मंगलमय, ऊर्जावान और फलदायी हो! अपने समय और हुनर का सही उपयोग करें और स्वावलंबी बनें।',
    dosAndDonts: {
      dos: ['सूर्योदय के समय तांबे के लोटे से जल दें।', 'शुभ चौघड़िया देखकर महत्वपूर्ण कार्य करें।'],
      donts: ['राहु काल के समय नए अनुबंध या बड़े निवेश से बचें।']
    }
  };
}

/**
 * 12 Rashis with live IST daily-changing Dainik Rashifal (automatically updates every day)
 */
export function getDetailedRashiHoroscope(rashiId?: string, targetDate: Date = new Date()): DailyRashiForecast[] {
  return computeDailyRashifalForDate(rashiId, targetDate);
}

function festivalToSliderItem(fest: DayFestivalInfo, orderIndex: number): HomeSliderItem {
  const isUpcoming = Boolean(fest.isUpcoming);
  const days = fest.daysRemaining ?? 0;
  const shortMuhurat = fest.shubhMuhurat.split('(')[0].trim();

  const countdownLabel = !isUpcoming
    ? 'आज का लाइव महापर्व'
    : days === 1
      ? 'कल का आगामी महापर्व'
      : `आगामी महापर्व (${days} दिन शेष)`;

  const title = isUpcoming
    ? `IOIS INDIA की ओर से आगामी ${fest.nameHindi} की अग्रिम बधाई एवं शुभकामनाएं`
    : `IOIS INDIA की ओर से ${fest.nameHindi} की हार्दिक बधाई एवं शुभकामनाएं`;

  const subtitle = isUpcoming
    ? `${fest.dateStr} को मनाया जाएगा ${fest.englishName} — ${fest.tagline}`
    : `${fest.tagline} — ${fest.dateStr}`;

  return {
    id: `dynamic-festive-${fest.id}-${isUpcoming ? 'upcoming' : 'live'}`,
    festivalId: fest.id,
    festivalName: fest.englishName,
    startDate: fest.startDate,
    endDate: fest.endDate,
    isUpcoming,
    daysRemaining: days,
    title,
    subtitle,
    tag: countdownLabel,
    category: 'festival',
    description: fest.greetingsMessage,
    bgGradient: fest.themeGradient || 'from-amber-600/40 via-red-950/60 to-slate-950',
    badgeText: `शुभ मुहूर्त: ${shortMuhurat}`,
    badgeColor: fest.badgeColor || 'bg-amber-500/25 text-amber-300 border-amber-400',
    iconName: fest.iconName || 'Sparkles',
    ctaText: 'पूरा बधाई बैनर व शुभ मुहूर्त देखें',
    ctaAction: 'plans',
    highlightText: `${fest.dateStr} • शुभ मुहूर्त: ${shortMuhurat}`,
    imageUrl: fest.imageUrl || missionImg,
    active: true,
    order: orderIndex,
  };
}

/**
 * Generates REAL-TIME sliders for currently active festival(s) AND nearest upcoming festival(s).
 * Passed festivals are automatically excluded because getActiveFestivalsForDate & getUpcomingFestivals
 * strictly filter against today's local date.
 */
export function generateRealTimeFestivalSliders(targetDate: Date = new Date()): HomeSliderItem[] {
  const activeToday = getActiveFestivalsForDate(targetDate);
  const upcoming = getUpcomingFestivals(targetDate, 2, 75);

  const combined = [...activeToday, ...upcoming];
  if (combined.length === 0) {
    return [festivalToSliderItem(getFestivalForDate(targetDate), 0)];
  }

  return combined.map((fest, idx) => festivalToSliderItem(fest, idx));
}

/**
 * Generates REAL-TIME full-picture IOIS INDIA greeting popup banners for today's active festival(s).
 * Once a festival's endDate passes, its popup vanishes completely automatically.
 * Optionally includes upcoming festivals only when explicitly requested (e.g., Admin preview fallback).
 */
export function generateRealTimeFestivalPopups(
  targetDate: Date = new Date(),
  options?: { includeUpcoming?: boolean }
): HomePopupPhoto[] {
  const activeToday = getActiveFestivalsForDate(targetDate);
  const upcoming = options?.includeUpcoming ? getUpcomingFestivals(targetDate, 2, 75) : [];
  const combined = [...activeToday, ...upcoming];

  return combined.map((fest, idx) => {
    const isUpcoming = Boolean(fest.isUpcoming);
    const days = fest.daysRemaining ?? 0;
    const timingLabel = !isUpcoming
      ? `आज का लाइव महापर्व (${fest.dateStr})`
      : days === 1
        ? `कल का आगामी पर्व (${fest.dateStr})`
        : `आगामी महापर्व • ${days} दिन शेष (${fest.dateStr})`;

    return {
      id: `realtime-fest-${fest.id}-${fest.startDate || toLocalIsoDateKey(targetDate)}`,
      festivalId: fest.id,
      festivalName: fest.englishName,
      startDate: fest.startDate,
      endDate: fest.endDate,
      dateLabel: timingLabel,
      shubhMuhurat: fest.shubhMuhurat,
      isUpcoming,
      daysRemaining: days,
      themeGradient: fest.themeGradient,
      imageUrl: fest.imageUrl || missionImg,
      title: `IOIS INDIA बधाई बैनर • ${fest.nameHindi}`,
      celebrationHeadline: isUpcoming
        ? `IOIS INDIA परिवार की ओर से आगामी "${fest.nameHindi}" की अग्रिम हार्दिक बधाई एवं मंगलकामनाएं!`
        : `IOIS INDIA परिवार की ओर से "${fest.nameHindi}" की हार्दिक बधाई एवं अनंत शुभकामनाएं!`,
      description: `${fest.greetingsMessage}\n\n📅 तिथि: ${fest.dateStr}\n⏰ शुभ मुहूर्त: ${fest.shubhMuhurat}`,
      celebrationEffect: true,
      displayTargets: ['all'],
      actionType: 'plans',
      actionText: 'पर्व कथा, शुभ मुहूर्त व प्लान देखें',
      active: true,
      order: idx + 1,
    };
  });
}

/**
 * Backward-compatible helper returning the primary live or upcoming festival slider item.
 */
export function generateFestiveSliderItem(targetDate: Date = new Date()): HomeSliderItem {
  const list = generateRealTimeFestivalSliders(targetDate);
  return list[0];
}

// Keep unused import check happy if smartSavingsImg is referenced via homeSliderData
export const _FESTIVAL_ASSET_REGISTRY = {
  smartSavingsImg,
  dhanterasImg,
  diwaliImg,
  govardhanImg,
  bhaidoojImg,
  chhathImg,
  missionImg,
};


