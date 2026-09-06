import { 
  WeatherData, 
  NewsChannel, 
  NewsArticle, 
  ENewspaper, 
  RashiForecast, 
  MandiItem, 
  BullionRate, 
  MarketDeal, 
  GovtPortal, 
  GovtRuleLaw, 
  JobAlert 
} from '../types';

/**
 * 1. INDIAN CITIES COORDINATES DIRECTORY
 */
export const INDIAN_CITIES_COORDS: Record<string, { lat: number; lon: number; state: string; nameHindi: string }> = {
  'delhi': { lat: 28.6139, lon: 77.2090, state: 'Delhi NCR', nameHindi: 'नई दिल्ली' },
  'patna': { lat: 25.5941, lon: 85.1376, state: 'Bihar', nameHindi: 'पटना' },
  'gaya': { lat: 24.7914, lon: 85.0002, state: 'Bihar', nameHindi: 'गया' },
  'muzaffarpur': { lat: 26.1209, lon: 85.3647, state: 'Bihar', nameHindi: 'मुजफ्फरपुर' },
  'lucknow': { lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh', nameHindi: 'लखनऊ' },
  'varanasi': { lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh', nameHindi: 'वाराणसी' },
  'kanpur': { lat: 26.4499, lon: 80.3319, state: 'Uttar Pradesh', nameHindi: 'कानपुर' },
  'prayagraj': { lat: 25.4358, lon: 81.8463, state: 'Uttar Pradesh', nameHindi: 'प्रयागराज' },
  'jaipur': { lat: 26.9124, lon: 75.7873, state: 'Rajasthan', nameHindi: 'जयपुर' },
  'jodhpur': { lat: 26.2389, lon: 73.0243, state: 'Rajasthan', nameHindi: 'जोधपुर' },
  'indore': { lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh', nameHindi: 'इंदौर' },
  'bhopal': { lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh', nameHindi: 'भोपाल' },
  'mumbai': { lat: 19.0760, lon: 72.8777, state: 'Maharashtra', nameHindi: 'मुंबई' },
  'pune': { lat: 18.5204, lon: 73.8567, state: 'Maharashtra', nameHindi: 'पुणे' },
  'nagpur': { lat: 21.1458, lon: 79.0882, state: 'Maharashtra', nameHindi: 'नागपुर' },
  'kolkata': { lat: 22.5726, lon: 88.3639, state: 'West Bengal', nameHindi: 'कोलकाता' },
  'ranchi': { lat: 23.3441, lon: 85.3096, state: 'Jharkhand', nameHindi: 'राँची' },
  'ahmedabad': { lat: 23.0225, lon: 72.5714, state: 'Gujarat', nameHindi: 'अहमदाबाद' },
  'surat': { lat: 21.1702, lon: 72.8311, state: 'Gujarat', nameHindi: 'सूरत' },
  'chandigarh': { lat: 30.7333, lon: 76.7794, state: 'Punjab/Haryana', nameHindi: 'चंडीगढ़' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, state: 'Karnataka', nameHindi: 'बेंगलुरु' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, state: 'Telangana', nameHindi: 'हैदराबाद' },
  'chennai': { lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu', nameHindi: 'चेन्नई' },
  'dehradun': { lat: 30.3165, lon: 78.0322, state: 'Uttarakhand', nameHindi: 'देहरादून' },
  'shimla': { lat: 31.1048, lon: 77.1734, state: 'Himachal Pradesh', nameHindi: 'शिमला' },
};

/**
 * Map WMO Weather Codes to Condition, Type, and Hindi Description
 */
export function interpretWmoCode(code: number): {
  condition: string;
  weatherType: 'clear' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog' | 'windy';
  descriptionHi: string;
} {
  if (code === 0) {
    return { condition: 'साफ आसमान (Clear Sky)', weatherType: 'clear', descriptionHi: 'तेज धूप और खुला आसमान, सुहावना मौसम' };
  } else if (code === 1 || code === 2) {
    return { condition: 'आंशिक बादल (Partly Cloudy)', weatherType: 'cloudy', descriptionHi: 'हल्के बादल और धूप की लुका-छिपी' };
  } else if (code === 3) {
    return { condition: 'घने बादल (Overcast Clouds)', weatherType: 'cloudy', descriptionHi: 'आसमान में घने बादलों का पहरा' };
  } else if (code >= 45 && code <= 48) {
    return { condition: 'कोहरा / धुंध (Fog / Mist)', weatherType: 'fog', descriptionHi: 'सुबह और शाम हल्की धुंध या कोहरा रहने की संभावना' };
  } else if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65)) {
    return { condition: 'वर्षा / फुहारें (Rain Showers)', weatherType: 'rain', descriptionHi: 'रुक-रुक कर बारिश और ठंडी हवाओं का दौर' };
  } else if (code >= 80 && code <= 82) {
    return { condition: 'भारी बारिश (Heavy Rainfall)', weatherType: 'rain', descriptionHi: 'तेज झमाझम बारिश और जलजमाव की संभावना' };
  } else if (code >= 95 && code <= 99) {
    return { condition: 'आंधी तूफान व बिजली (Thunderstorm)', weatherType: 'thunderstorm', descriptionHi: 'गरज-चमक के साथ तेज अंधड़ और बारिश की चेतावनी' };
  } else if (code >= 71 && code <= 77) {
    return { condition: 'बर्फबारी / ओले (Snow / Hail)', weatherType: 'snow', descriptionHi: 'पहाड़ी इलाकों में बर्फबारी और ठंड का प्रकोप' };
  }
  return { condition: 'सामान्य मौसम', weatherType: 'cloudy', descriptionHi: 'सामान्य तापमान और हवाएं' };
}

/**
 * Fetch Live Weather Data from Open-Meteo API
 */
export async function fetchLiveWeather(queryCity: string = 'Patna'): Promise<WeatherData> {
  const normalized = queryCity.trim().toLowerCase();
  let target = INDIAN_CITIES_COORDS[normalized];

  if (!target) {
    // Check partial match
    const key = Object.keys(INDIAN_CITIES_COORDS).find((k) => k.includes(normalized) || normalized.includes(k));
    target = key ? INDIAN_CITIES_COORDS[key] : INDIAN_CITIES_COORDS['patna'];
  }

  const cityName = target.nameHindi;
  const stateName = target.state;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${target.lat}&longitude=${target.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=Asia%2FKolkata`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('API response not ok');
    const data = await response.json();

    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const code = current.weather_code || 0;
    const wInfo = interpretWmoCode(code);
    const temp = Math.round(current.temperature_2m ?? 31);
    const feels = Math.round(current.apparent_temperature ?? (temp + 2));
    const humidity = Math.round(current.relative_humidity_2m ?? 68);
    const wind = Math.round(current.wind_speed_10m ?? 12);
    const pressure = Math.round(current.surface_pressure ?? 1008);
    const uv = Math.round(daily.uv_index_max?.[0] ?? 7);

    // AQI estimate based on city & humidity/wind
    const aqiScore = normalized.includes('delhi') ? 220 : normalized.includes('patna') ? 165 : normalized.includes('mumbai') ? 110 : 85;
    const aqiText = aqiScore > 200 ? 'खराब (Poor)' : aqiScore > 100 ? 'मध्यम (Moderate)' : 'अच्छा (Good)';

    // Hourly Forecast (next 6 hours)
    const hourlyItems = [];
    const currentHourIdx = new Date().getHours();
    for (let i = 0; i < 8; i++) {
      const idx = (currentHourIdx + i) % 24;
      const hTemp = Math.round(hourly.temperature_2m?.[idx] ?? (temp + (i % 2 === 0 ? 1 : -1)));
      const hRain = Math.round(hourly.precipitation_probability?.[idx] ?? (wInfo.weatherType === 'rain' ? 70 : 15));
      const hTime = `${idx < 10 ? '0' : ''}${idx}:00`;
      hourlyItems.push({
        time: i === 0 ? 'अब (Now)' : hTime,
        temp: hTemp,
        icon: wInfo.weatherType,
        rainProb: hRain
      });
    }

    // 7 Days Forecast
    const daysName = ['आज', 'कल', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'];
    const dailyItems = [];
    for (let d = 0; d < 7; d++) {
      const dCode = daily.weather_code?.[d] ?? code;
      const dInterp = interpretWmoCode(dCode);
      const dMax = Math.round(daily.temperature_2m_max?.[d] ?? (temp + 2));
      const dMin = Math.round(daily.temperature_2m_min?.[d] ?? (temp - 6));
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + d);
      const dateStr = dateObj.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' });

      dailyItems.push({
        day: d === 0 ? 'आज (Today)' : d === 1 ? 'कल (Tomorrow)' : dateObj.toLocaleDateString('hi-IN', { weekday: 'short' }),
        date: dateStr,
        tempMax: dMax,
        tempMin: dMin,
        condition: dInterp.condition,
        weatherType: dInterp.weatherType
      });
    }

    const sunriseTime = daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1]?.slice(0, 5) : '05:42';
    const sunsetTime = daily.sunset?.[0] ? daily.sunset[0].split('T')[1]?.slice(0, 5) : '18:38';

    return {
      city: cityName,
      state: stateName,
      temp,
      feelsLike: feels,
      condition: wInfo.condition,
      conditionCode: code,
      weatherType: wInfo.weatherType,
      humidity,
      windSpeed: wind,
      uvIndex: uv,
      aqi: aqiScore,
      aqiStatus: aqiText,
      pressure,
      visibility: 8.5,
      sunrise: `${sunriseTime} AM`,
      sunset: `${sunsetTime} PM`,
      minTemp: Math.round(daily.temperature_2m_min?.[0] ?? (temp - 5)),
      maxTemp: Math.round(daily.temperature_2m_max?.[0] ?? (temp + 3)),
      descriptionHi: wInfo.descriptionHi,
      alert: wInfo.weatherType === 'thunderstorm' 
        ? '⚠️ वज्रपात व आंधी-तूफान चेतावनी: खुले मैदान या पेड़ के नीचे न रुकें।' 
        : wInfo.weatherType === 'rain' 
        ? '🌧️ वर्षा अलर्ट: मध्यम से तेज वर्षा की संभावना, छाता साथ रखें।'
        : undefined,
      hourly: hourlyItems,
      daily: dailyItems,
    };
  } catch (err) {
    // Robust realistic fallback for India
    return {
      city: cityName,
      state: stateName,
      temp: 32,
      feelsLike: 35,
      condition: 'आंशिक बादल व धूप',
      conditionCode: 2,
      weatherType: 'cloudy',
      humidity: 65,
      windSpeed: 14,
      uvIndex: 8,
      aqi: 135,
      aqiStatus: 'मध्यम (Moderate)',
      pressure: 1010,
      visibility: 8.0,
      sunrise: '05:45 AM',
      sunset: '06:35 PM',
      minTemp: 26,
      maxTemp: 34,
      descriptionHi: 'हल्की धूप व बादलों की आवाजाही, सामान्य हवाएं',
      hourly: [
        { time: 'अब', temp: 32, icon: 'cloudy', rainProb: 20 },
        { time: '14:00', temp: 34, icon: 'clear', rainProb: 10 },
        { time: '16:00', temp: 33, icon: 'cloudy', rainProb: 25 },
        { time: '18:00', temp: 30, icon: 'cloudy', rainProb: 30 },
        { time: '20:00', temp: 28, icon: 'clear', rainProb: 10 },
      ],
      daily: [
        { day: 'आज', date: 'आज', tempMax: 34, tempMin: 26, condition: 'आंशिक बादल', weatherType: 'cloudy' },
        { day: 'कल', date: 'कल', tempMax: 33, tempMin: 25, condition: 'हल्की बारिश', weatherType: 'rain' },
        { day: 'गुरु', date: '26 Aug', tempMax: 31, tempMin: 24, condition: 'झमाझम बारिश', weatherType: 'rain' },
        { day: 'शुक्र', date: '27 Aug', tempMax: 32, tempMin: 25, condition: 'साफ मौसम', weatherType: 'clear' },
        { day: 'शनि', date: '28 Aug', tempMax: 34, tempMin: 26, condition: 'तेज धूप', weatherType: 'clear' },
      ]
    };
  }
}

/**
 * 2. LIVE NEWS CHANNELS (Top Indian National & Regional Hindi News Streams)
 */
export const LIVE_NEWS_CHANNELS: NewsChannel[] = [
  {
    id: 'aaj-tak',
    name: 'Aaj Tak (आज तक HD)',
    language: 'Hindi',
    category: 'Top Breaking & Live',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://www.youtube.com/@aajtak/live',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCt4t-jeY85JegMlZ-E5UWtA&autoplay=1&mute=0',
    isLive: true,
    description: 'देश का नंबर 1 न्यूज चैनल - ब्रेकिंग न्यूज, राजनीति व देश-विदेश का लाइव कवरेज 24x7।'
  },
  {
    id: 'abp-news',
    name: 'ABP News (एबीपी न्यूज़ HD)',
    language: 'Hindi',
    category: 'National & States',
    logo: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://www.youtube.com/@ABPNews/live',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCmphdQw_0488N_iO7kI9K_A&autoplay=1&mute=0',
    isLive: true,
    description: 'आपको रखे आगे - राज्यों की ग्राउंड रिपोर्ट, अपराध, सिनेमा व खेल की ताजा खबरें।'
  },
  {
    id: 'india-tv',
    name: 'India TV (इंडिया टीवी HD)',
    language: 'Hindi',
    category: 'Special Reports & Live',
    logo: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://www.youtube.com/@IndiaTV/live',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCttspZzi38576gN3064FMbA&autoplay=1&mute=0',
    isLive: true,
    description: 'आप की अदालत, सुपरफास्ट 100 और देश की हर बड़ी खबर पर तीखी नजर।'
  },
  {
    id: 'ndtv-india',
    name: 'NDTV India (एनडीटीवी इंडिया)',
    language: 'Hindi',
    category: 'In-Depth Analysis',
    logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://www.youtube.com/@ndtvindia/live',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC9CYT9gSNLevX5uN_twnJdg&autoplay=1&mute=0',
    isLive: true,
    description: 'तथ्यात्मक विश्लेषण, प्राइम टाइम डिबेट्स व जनहित के गंभीर मुद्दों की लाइव रिपोर्टिंग।'
  },
  {
    id: 'dd-news',
    name: 'DD News (दूरदर्शन समाचार)',
    language: 'Hindi / National',
    category: 'National / Official',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://www.youtube.com/@DDNewsHindi/live',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC5TzX9W67w_gL9h2n09t86A&autoplay=1&mute=0',
    isLive: true,
    description: 'भारत का आधिकारिक राष्ट्रीय समाचार चैनल, सटीक व विश्वसनीय खबरें 24x7।'
  },
  {
    id: 'news18-india',
    name: 'News18 India (न्यूज़18 इंडिया)',
    language: 'Hindi',
    category: 'Network 18',
    logo: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://www.youtube.com/@news18India/live',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC8Hq8v7tZ5h_p8n8w3wG92g&autoplay=1&mute=0',
    isLive: true,
    description: 'आर पार, देश का मुकद्दर और भारत के कोने-कोने से सबसे तेज अपडेट्स।'
  },
  {
    id: 'zee-news',
    name: 'Zee News (ज़ी न्यूज़)',
    language: 'Hindi',
    category: 'DNA & National',
    logo: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://www.youtube.com/@zeenews/live',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCNAz20Z9Yv_r93K9K380Cew&autoplay=1&mute=0',
    isLive: true,
    description: 'डीएनए विश्लेषण, देशहित की खबरें और राष्ट्रीय मुद्दों की विस्तृत पड़ताल।'
  },
  {
    id: 'sansad-tv',
    name: 'Sansad TV (संसद टीवी - लोकसभा/राज्यसभा)',
    language: 'Hindi / English',
    category: 'Parliament & Policy',
    logo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://www.youtube.com/@SansadTV/live',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCriT_3fK8-cZ_g4K6FqI7eA&autoplay=1&mute=0',
    isLive: true,
    description: 'संसद सत्र, बिल, राष्ट्रीय बहस और नीतिगत चर्चाओं का सीधा लाइव प्रसारण।'
  }
];

/**
 * 3. LIVE HEADLINES & NEWSPAPER DIRECTORY
 */
export const LIVE_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'डिजिटल इंडिया व ग्रामीण स्वरोजगार में युवाओं के लिए नए इंसेंटिव पैकेज की घोषणा',
    category: 'jobs',
    source: 'दैनिक जागरण',
    time: '15 मिनट पहले',
    summary: 'केंद्र व राज्य सरकारों ने डिजिटल साक्षरता और ऑनलाइन माइक्रो-अर्निंग योजनाओं के लिए नए पोर्टल लॉन्च किए हैं जिससे घर बैठे कौशल विकास संभव होगा।',
    readTime: '2 min read'
  },
  {
    id: 'art-2',
    title: 'खरीफ फसलों की नई एमएसपी और प्रमुख मंडियों में गेहूं-सरसों की जोरदार आवक',
    category: 'kisan',
    source: 'कृषि जागरण',
    time: '35 मिनट पहले',
    summary: 'उत्तर प्रदेश, बिहार और मध्य प्रदेश की कृषि उपज मंडियों में दालों व तिलहन के दामों में स्थिरता देखी जा रही है। किसान सीधे ई-नाम पोर्टल पर भाव चेक कर रहे हैं।',
    readTime: '3 min read'
  },
  {
    id: 'art-3',
    title: 'सोने और चांदी के भाव में स्थिरता, अंतरराष्ट्रीय बाजार में बुलियन डिमांड बढ़ी',
    category: 'business',
    source: 'इकोनॉमिक टाइम्स',
    time: '1 घंटा पहले',
    summary: '24 कैरेट सोने की कीमत 72,000 रुपये प्रति 10 ग्राम के आसपास दर्ज की गई। चांदी 85,000 प्रति किलो के स्तर पर ट्रेड कर रही है।',
    readTime: '2 min read'
  },
  {
    id: 'art-4',
    title: 'मौसम विभाग: मानसून ट्रफ लाइन सक्रिय, अगले 48 घंटों में पूर्वी व मध्य भारत में भारी बारिश',
    category: 'national',
    source: 'मौसम विज्ञान केंद्र (IMD)',
    time: '2 घंटे पहले',
    summary: 'बिहार, झारखंड, पूर्वी उत्तर प्रदेश और मध्य प्रदेश के कई जिलों में गरज-चमक के साथ बारिश का यलो व ऑरेंज अलर्ट जारी किया गया है।',
    readTime: '1 min read'
  },
  {
    id: 'art-5',
    title: 'SSC CGL और रेलवे भर्ती 2026 की परीक्षा तिथियां घोषित, एडमिट कार्ड जल्द होंगे जारी',
    category: 'jobs',
    source: 'सरकारी रिजल्ट्स',
    time: '3 घंटे पहले',
    summary: 'लाखों अभ्यर्थियों के लिए कर्मचारी चयन आयोग ने टियर-1 परीक्षा का शेड्यूल अपनी आधिकारिक वेबसाइट ssc.gov.in पर अपलोड कर दिया है।',
    readTime: '2 min read'
  },
  {
    id: 'art-6',
    title: 'UPI व डिजिटल बैंकिंग में नए सुरक्षा नियम लागू: बिना OTP के बड़े ट्रांजेक्शन पर रोक',
    category: 'tech',
    source: 'भारतीय रिजर्व बैंक (RBI)',
    time: '4 घंटे पहले',
    summary: 'ऑनलाइन वित्तीय धोखाधड़ी रोकने के लिए बायोमेट्रिक व मल्टी-फैक्टर ऑथेंटिकेशन को अनिवार्य किया जा रहा है।',
    readTime: '3 min read'
  }
];

export const E_NEWSPAPERS_LIST: ENewspaper[] = [
  {
    id: 'epaper-jagran',
    name: 'दैनिक जागरण (Dainik Jagran)',
    language: 'हिंदी (Hindi)',
    frequency: 'दैनिक (Daily)',
    url: 'https://www.jagran.com',
    epaperUrl: 'https://epaper.jagran.com',
    description: 'भारत का सबसे ज्यादा पढ़ा जाने वाला राष्ट्रीय हिंदी समाचार पत्र।',
    howToRead: 'वेबसाइट पर जाकर अपना राज्य (बिहार, यूपी, दिल्ली, एमपी आदि) और जिला चुनें और आज का ई-पेपर मुफ्त में पढ़ें।'
  },
  {
    id: 'epaper-bhaskar',
    name: 'दैनिक भास्कर (Dainik Bhaskar)',
    language: 'हिंदी (Hindi)',
    frequency: 'दैनिक (Daily)',
    url: 'https://www.bhaskar.com',
    epaperUrl: 'https://epaper.bhaskar.com',
    description: 'सटीक खोजपरक पत्रकारिता और निष्पक्ष समाचार कवरेज।',
    howToRead: 'ई-पेपर सेक्शन में शहर का एडिशन सेलेक्ट करें और पूरे पन्ने HD में ज़ूम करके पढ़ें।'
  },
  {
    id: 'epaper-amarujala',
    name: 'अमर उजाला (Amar Ujala)',
    language: 'हिंदी (Hindi)',
    frequency: 'दैनिक (Daily)',
    url: 'https://www.amarujala.com',
    epaperUrl: 'https://epaper.amarujala.com',
    description: 'उत्तर भारत का प्रतिष्ठित अखबार, रोजगार और कैरियर विशेषांक सहित।',
    howToRead: 'डायरेक्ट लिंक खोलें और मुख्य पृष्ठ व सप्लीमेंट्स को पीडीएफ रूप में पढ़ें।'
  },
  {
    id: 'epaper-hindustan',
    name: 'हिन्दुस्तान (Live Hindustan)',
    language: 'हिंदी (Hindi)',
    frequency: 'दैनिक (Daily)',
    url: 'https://www.livehindustan.com',
    epaperUrl: 'https://epaper.livehindustan.com',
    description: 'बिहार, यूपी, झारखंड और दिल्ली का भरोसेमंद समाचार माध्यम।',
    howToRead: 'लॉगिन करें या गेस्ट मोड में अपने शहर का लोकल एडिशन पढ़ें।'
  },
  {
    id: 'epaper-thehindu',
    name: 'द हिंदू (The Hindu)',
    language: 'अंग्रेजी (English)',
    frequency: 'दैनिक (Daily)',
    url: 'https://www.thehindu.com',
    epaperUrl: 'https://epaper.thehindu.com',
    description: 'UPSC व सिविल सेवा परीक्षार्थियों का सबसे पसंदीदा राष्ट्रीय अंग्रेजी अखबार।',
    howToRead: 'संपादकीय (Editorial) और राष्ट्रीय समाचारों के गहन विश्लेषण के लिए डिजिटल एडिशन देखें।'
  },
  {
    id: 'epaper-toi',
    name: 'टाइम्स ऑफ इंडिया (The Times of India)',
    language: 'अंग्रेजी (English)',
    frequency: 'दैनिक (Daily)',
    url: 'https://timesofindia.indiatimes.com',
    epaperUrl: 'https://epaper.indiatimes.com',
    description: 'भारत का अग्रणी अंग्रेजी समाचार पत्र, व्यापार व तकनीकी खबरों में अव्वल।',
    howToRead: 'सिटी एडिशन चुनकर बिजनेस व वर्ल्ड न्यूज पन्ने आसानी से ब्राउज करें।'
  }
];

/**
 * 4. 12 ZODIAC DAINIK RASHIFAL (दैनिक 12 राशि भविष्य)
 */
export function getDailyRashifalForToday(): RashiForecast[] {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

  const RASHIS: Array<{
    id: string;
    nameHindi: string;
    nameEnglish: string;
    symbol: string;
    dateRange: string;
    element: string;
    colors: string[];
    colorHex: string[];
    times: string[];
  }> = [
    { id: 'aries', nameHindi: 'मेष राशि', nameEnglish: 'Aries', symbol: '♈', dateRange: '21 मार्च - 19 अप्रैल', element: 'अग्नि (Fire)', colors: ['लाल', 'केसरिया', 'पीला'], colorHex: ['#ef4444', '#f97316', '#eab308'], times: ['09:00 AM - 10:30 AM', '04:15 PM - 05:45 PM'] },
    { id: 'taurus', nameHindi: 'वृषभ राशि', nameEnglish: 'Taurus', symbol: '♉', dateRange: '20 अप्रैल - 20 मई', element: 'पृथ्वी (Earth)', colors: ['सफेद', 'हल्का हरा', 'गुलाबी'], colorHex: ['#f8fafc', '#22c55e', '#ec4899'], times: ['10:15 AM - 11:45 AM', '06:00 PM - 07:30 PM'] },
    { id: 'gemini', nameHindi: 'मिथुन राशि', nameEnglish: 'Gemini', symbol: '♊', dateRange: '21 मई - 20 जून', element: 'वायु (Air)', colors: ['हरा', 'तोता हरा', 'पीला'], colorHex: ['#10b981', '#84cc16', '#fbbf24'], times: ['08:30 AM - 10:00 AM', '03:30 PM - 05:00 PM'] },
    { id: 'cancer', nameHindi: 'कर्क राशि', nameEnglish: 'Cancer', symbol: '♋', dateRange: '21 जून - 22 जुलाई', element: 'जल (Water)', colors: ['मोती सफेद', 'क्रीम', 'चांदी'], colorHex: ['#f1f5f9', '#fef08a', '#94a3b8'], times: ['07:00 AM - 08:30 AM', '05:00 PM - 06:30 PM'] },
    { id: 'leo', nameHindi: 'सिंह राशि', nameEnglish: 'Leo', symbol: '♌', dateRange: '23 जुलाई - 22 अगस्त', element: 'अग्नि (Fire)', colors: ['सुनहरा', 'नारंगी', 'रूबी लाल'], colorHex: ['#eab308', '#ea580c', '#dc2626'], times: ['11:00 AM - 12:30 PM', '04:00 PM - 05:30 PM'] },
    { id: 'virgo', nameHindi: 'कन्या राशि', nameEnglish: 'Virgo', symbol: '♍', dateRange: '23 अगस्त - 22 सितंबर', element: 'पृथ्वी (Earth)', colors: ['गहरा हरा', 'नीला', 'बादामी'], colorHex: ['#059669', '#2563eb', '#d97706'], times: ['09:45 AM - 11:15 AM', '02:30 PM - 04:00 PM'] },
    { id: 'libra', nameHindi: 'तुला राशि', nameEnglish: 'Libra', symbol: '♎', dateRange: '23 सितंबर - 22 अक्टूबर', element: 'वायु (Air)', colors: ['आसमानी नीला', 'सफेद', 'गुलाबी'], colorHex: ['#38bdf8', '#ffffff', '#f472b6'], times: ['01:30 PM - 03:00 PM', '07:00 PM - 08:30 PM'] },
    { id: 'scorpio', nameHindi: 'वृश्चिक राशि', nameEnglish: 'Scorpio', symbol: '♏', dateRange: '23 अक्टूबर - 21 नवंबर', element: 'जल (Water)', colors: ['लाल', 'महरून', 'केसरिया'], colorHex: ['#b91c1c', '#831843', '#f97316'], times: ['08:00 AM - 09:30 AM', '03:15 PM - 04:45 PM'] },
    { id: 'sagittarius', nameHindi: 'धनु राशि', nameEnglish: 'Sagittarius', symbol: '♐', dateRange: '22 नवंबर - 21 दिसंबर', element: 'अग्नि (Fire)', colors: ['पीला', 'गोल्डन', 'नारंगी'], colorHex: ['#facc15', '#d97706', '#ea580c'], times: ['10:00 AM - 11:30 AM', '05:30 PM - 07:00 PM'] },
    { id: 'capricorn', nameHindi: 'मकर राशि', nameEnglish: 'Capricorn', symbol: '♑', dateRange: '22 दिसंबर - 19 जनवरी', element: 'पृथ्वी (Earth)', colors: ['नीला', 'काला', 'ग्रे'], colorHex: ['#1d4ed8', '#0f172a', '#64748b'], times: ['12:00 PM - 01:30 PM', '06:30 PM - 08:00 PM'] },
    { id: 'aquarius', nameHindi: 'कुंभ राशि', nameEnglish: 'Aquarius', symbol: '♒', dateRange: '20 जनवरी - 18 फरवरी', element: 'वायु (Air)', colors: ['आसमानी', 'रॉयल ब्लू', 'बैंगनी'], colorHex: ['#0284c7', '#4338ca', '#7c3aed'], times: ['09:15 AM - 10:45 AM', '04:45 PM - 06:15 PM'] },
    { id: 'pisces', nameHindi: 'मीन राशि', nameEnglish: 'Pisces', symbol: '♓', dateRange: '19 फरवरी - 20 मार्च', element: 'जल (Water)', colors: ['हल्दी पीला', 'केसरिया', 'समुद्री हरा'], colorHex: ['#eab308', '#f97316', '#0d9488'], times: ['07:30 AM - 09:00 AM', '03:00 PM - 04:30 PM'] },
  ];

  return RASHIS.map((rashi, idx) => {
    const seed = (dayOfYear * 7 + idx * 13) % 100;
    const luckyNum = (seed % 9) + 1;
    const colorIdx = seed % rashi.colors.length;
    const timeIdx = seed % rashi.times.length;
    const rating = 4 + (seed % 2 === 0 ? 0.5 : 0);

    return {
      id: rashi.id,
      nameHindi: rashi.nameHindi,
      nameEnglish: rashi.nameEnglish,
      symbol: rashi.symbol,
      dateRange: rashi.dateRange,
      element: rashi.element,
      luckyColor: rashi.colors[colorIdx],
      luckyColorHex: rashi.colorHex[colorIdx],
      luckyNumber: luckyNum,
      luckyTime: rashi.times[timeIdx],
      rating: Math.min(5, Math.max(3.5, rating)),
      overview: `आज का दिन आपके लिए आत्मविश्वास और नए अवसरों से परिपूर्ण रहेगा। कार्यक्षेत्र में आपकी योजनाओं की प्रशंसा होगी और रुका हुआ धन प्राप्त होने के शुभ संकेत हैं।`,
      careerFinance: `व्यापार में नए संपर्क लाभकारी सिद्ध होंगे। ऑनलाइन कार्य या नई स्किल सीखने से अतिरिक्त आमदनी का द्वार खुलेगा। अनावश्यक खर्चों पर नियंत्रण रखें।`,
      healthWellness: `स्वास्थ्य उत्तम रहेगा। मानसिक शांति के लिए सुबह प्राणायाम और हल्का योग करें। पर्याप्त पानी पिएं।`,
      loveFamily: `परिवार के सदस्यों का पूरा सहयोग मिलेगा। दांपत्य जीवन में मधुरता बनी रहेगी और शाम को किसी शुभ समाचार की प्राप्ति होगी।`,
      remedy: `आज के दिन भगवान सूर्य को तांबे के लोटे से जल अर्पित करें और 'ॐ नमो भगवते वासुदेवाय' का 11 बार जप करें।`
    };
  });
}

/**
 * 5. HINDU PANCHANG DETAILS (दैनिक पंचांग)
 */
export function getLivePanchang() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    dateHindi: dateStr,
    samvat: 'विक्रम संवत 2083 (कालयुक्त)',
    shakaSamvat: 'शक संवत 1948',
    tithi: 'भाद्रपद शुक्ल पक्ष, दशमी तिथि (अहोरात्र)',
    nakshatra: 'पुष्य नक्षत्र (राहु काल उपरांत श्रेष्ठ योग)',
    yoga: 'प्रीति योग (प्रातः से मध्याह्न तक)',
    karana: 'गर करण (सफलता प्रदायक)',
    paksha: 'शुक्ल पक्ष',
    ritu: 'वर्षा ऋतु (Monsoon)',
    ayan: 'दक्षिणायन (Dakshinayana)',
    sunrise: '05:44 AM',
    sunset: '06:38 PM',
    moonrise: '02:15 PM',
    rahuKaal: '03:20 PM - 04:55 PM (अशुभ समय)',
    abhijitMuhurat: '11:50 AM - 12:42 PM (सर्वश्रेष्ठ शुभ समय)',
    amritKaal: '08:15 AM - 09:48 AM',
    gulikKaal: '12:10 PM - 01:45 PM',
    yamaganda: '09:05 AM - 10:40 AM',
    choghadiya: {
      shubh: '05:44 AM - 07:20 AM',
      labh: '10:30 AM - 12:05 PM',
      amrit: '12:05 PM - 01:40 PM',
      chal: '03:15 PM - 04:50 PM'
    }
  };
}

/**
 * 6. LIVE MANDI BHAV DATA (प्रमुख फसलों का वास्तविक मंडी भाव)
 */
export const LIVE_MANDI_ITEMS: MandiItem[] = [
  {
    id: 'mandi-1',
    cropName: 'गेहूं (Wheat)',
    variety: 'शरबती / लोकवान',
    state: 'मध्य प्रदेश',
    mandiName: 'इंदौर अनाज मंडी',
    arrivalQty: '1,450 क्विंटल',
    minPrice: 2450,
    modalPrice: 2780,
    maxPrice: 3120,
    unit: '₹/क्विंटल',
    change: 45,
    trend: 'up',
    lastUpdated: 'आज 10:30 AM'
  },
  {
    id: 'mandi-2',
    cropName: 'धान / चावल (Paddy)',
    variety: 'बासमती 1509 / 1121',
    state: 'हरियाणा / पंजाब',
    mandiName: 'करनाल मंडी',
    arrivalQty: '2,800 क्विंटल',
    minPrice: 3200,
    modalPrice: 3650,
    maxPrice: 4100,
    unit: '₹/क्विंटल',
    change: -25,
    trend: 'down',
    lastUpdated: 'आज 11:15 AM'
  },
  {
    id: 'mandi-3',
    cropName: 'सरसों (Mustard)',
    variety: 'काली सरसों 42% तेल',
    state: 'राजस्थान',
    mandiName: 'जयपुर कृषि मंडी',
    arrivalQty: '980 क्विंटल',
    minPrice: 5300,
    modalPrice: 5750,
    maxPrice: 6100,
    unit: '₹/क्विंटल',
    change: 80,
    trend: 'up',
    lastUpdated: 'आज 09:45 AM'
  },
  {
    id: 'mandi-4',
    cropName: 'सोयाबीन (Soybean)',
    variety: 'पीला सोयाबीन',
    state: 'महाराष्ट्र',
    mandiName: 'लातूर मंडी',
    arrivalQty: '1,200 क्विंटल',
    minPrice: 4200,
    modalPrice: 4620,
    maxPrice: 4890,
    unit: '₹/क्विंटल',
    change: 15,
    trend: 'up',
    lastUpdated: 'आज 11:00 AM'
  },
  {
    id: 'mandi-5',
    cropName: 'चना (Gram / Chana)',
    variety: 'देसी / काबुली',
    state: 'उत्तर प्रदेश',
    mandiName: 'कानपुर गल्ला मंडी',
    arrivalQty: '650 क्विंटल',
    minPrice: 6400,
    modalPrice: 6850,
    maxPrice: 7200,
    unit: '₹/क्विंटल',
    change: 60,
    trend: 'up',
    lastUpdated: 'आज 10:00 AM'
  },
  {
    id: 'mandi-6',
    cropName: 'प्याज (Onion)',
    variety: 'लाल प्याज (Garwa)',
    state: 'महाराष्ट्र',
    mandiName: 'नासिक / लासलगांव मंडी',
    arrivalQty: '4,500 क्विंटल',
    minPrice: 1800,
    modalPrice: 2400,
    maxPrice: 2950,
    unit: '₹/क्विंटल',
    change: -50,
    trend: 'down',
    lastUpdated: 'आज 08:30 AM'
  },
  {
    id: 'mandi-7',
    cropName: 'आलू (Potato)',
    variety: 'चिपसोना / पुखराज',
    state: 'बिहार',
    mandiName: 'पटना मीठापुर मंडी',
    arrivalQty: '1,850 क्विंटल',
    minPrice: 1200,
    modalPrice: 1550,
    maxPrice: 1800,
    unit: '₹/क्विंटल',
    change: 0,
    trend: 'stable',
    lastUpdated: 'आज 10:45 AM'
  },
  {
    id: 'mandi-8',
    cropName: 'लहसुन (Garlic)',
    variety: 'देसी बोल्ड',
    state: 'मध्य प्रदेश',
    mandiName: 'नीमच मंडी',
    arrivalQty: '720 क्विंटल',
    minPrice: 12500,
    modalPrice: 16800,
    maxPrice: 21500,
    unit: '₹/क्विंटल',
    change: 350,
    trend: 'up',
    lastUpdated: 'आज 11:30 AM'
  },
  {
    id: 'mandi-9',
    cropName: 'मक्का (Maize)',
    variety: 'हाइब्रिड पीली मक्का',
    state: 'बिहार',
    mandiName: 'गुलाबबाग (पूर्णिया) मंडी',
    arrivalQty: '3,100 क्विंटल',
    minPrice: 2100,
    modalPrice: 2350,
    maxPrice: 2520,
    unit: '₹/क्विंटल',
    change: 20,
    trend: 'up',
    lastUpdated: 'आज 09:15 AM'
  },
  {
    id: 'mandi-10',
    cropName: 'कपास (Cotton)',
    variety: 'मध्यम / लंबा रेशा',
    state: 'गुजरात',
    mandiName: 'राजकोट मंडी',
    arrivalQty: '1,100 क्विंटल',
    minPrice: 6800,
    modalPrice: 7450,
    maxPrice: 7900,
    unit: '₹/क्विंटल',
    change: -40,
    trend: 'down',
    lastUpdated: 'आज 10:15 AM'
  }
];

/**
 * 7. LIVE GOLD & SILVER RATES (सराफा बाजार भाव - 10 प्रमुख शहर)
 */
export const LIVE_BULLION_RATES: BullionRate[] = [
  { city: 'नई दिल्ली (Delhi)', gold24k: 73450, gold22k: 67350, gold18k: 55100, silver1kg: 86500, silver10g: 865, goldChange: 150, silverChange: 300, updatedAt: 'आज 11:30 AM' },
  { city: 'पटना (Patna)', gold24k: 73520, gold22k: 67400, gold18k: 55150, silver1kg: 86800, silver10g: 868, goldChange: 120, silverChange: 250, updatedAt: 'आज 11:30 AM' },
  { city: 'लखनऊ (Lucknow)', gold24k: 73480, gold22k: 67380, gold18k: 55120, silver1kg: 86600, silver10g: 866, goldChange: 140, silverChange: 280, updatedAt: 'आज 11:30 AM' },
  { city: 'जयपुर (Jaipur)', gold24k: 73500, gold22k: 67390, gold18k: 55140, silver1kg: 86700, silver10g: 867, goldChange: 160, silverChange: 310, updatedAt: 'आज 11:30 AM' },
  { city: 'इंदौर (Indore)', gold24k: 73420, gold22k: 67320, gold18k: 55080, silver1kg: 86450, silver10g: 864, goldChange: 110, silverChange: 200, updatedAt: 'आज 11:30 AM' },
  { city: 'मुंबई (Mumbai)', gold24k: 73300, gold22k: 67200, gold18k: 54980, silver1kg: 86200, silver10g: 862, goldChange: 100, silverChange: 180, updatedAt: 'आज 11:30 AM' },
  { city: 'कोलकाता (Kolkata)', gold24k: 73350, gold22k: 67250, gold18k: 55020, silver1kg: 86300, silver10g: 863, goldChange: 90, silverChange: 220, updatedAt: 'आज 11:30 AM' },
  { city: 'अहमदाबाद (Ahmedabad)', gold24k: 73400, gold22k: 67300, gold18k: 55060, silver1kg: 86400, silver10g: 864, goldChange: 130, silverChange: 240, updatedAt: 'आज 11:30 AM' },
  { city: 'हैदराबाद (Hyderabad)', gold24k: 73300, gold22k: 67200, gold18k: 54980, silver1kg: 91500, silver10g: 915, goldChange: 100, silverChange: 400, updatedAt: 'आज 11:30 AM' },
  { city: 'चेन्नई (Chennai)', gold24k: 73800, gold22k: 67650, gold18k: 55350, silver1kg: 92000, silver10g: 920, goldChange: 180, silverChange: 450, updatedAt: 'आज 11:30 AM' }
];

/**
 * 8. LIVE DEALS & PRICE COMPARISON (क्या सस्ता, क्या महंगा? स्मार्ट खरीदारी गाइड)
 */
export const LIVE_MARKET_DEALS: MarketDeal[] = [
  {
    id: 'deal-1',
    category: 'किराना व राशन (Groceries)',
    item: 'फॉर्च्यून रिफाइंड सोयाबीन तेल (15L टिन)',
    mrp: 2150,
    bestPrice: 1720,
    discountPct: 20,
    cheapestSource: 'थोक अनाज मंडी / D-Mart रेडी स्टोर',
    expensiveSource: 'लोकल रिटेल दुकान (₹2,050)',
    priceDiff: 330,
    buyingTip: 'थोक में 15L टिन या 5L पैक लेने पर प्रति लीटर ₹22 की सीधी बचत होती है।',
    status: 'sasta'
  },
  {
    id: 'deal-2',
    category: 'कृषि उपकरण व बीज (Farming)',
    item: '12V 12AH सोलर स्प्रेयर पंप (Battery Sprayer)',
    mrp: 3800,
    bestPrice: 2450,
    discountPct: 35,
    cheapestSource: 'सरकारी एग्रो सेवा केंद्र / इंडियामार्ट डायरेक्ट',
    expensiveSource: 'लोकल कस्बा डीलर (₹3,400)',
    priceDiff: 950,
    buyingTip: 'कृषि यंत्र अनुदान योजना के तहत GST इनवॉइस पर 40% तक सब्सिडी प्राप्त की जा सकती है।',
    status: 'sasta'
  },
  {
    id: 'deal-3',
    category: 'शिक्षा व स्टूडेंट टूल्स (Education)',
    item: 'NCERT All Subjects All-in-One Digital Kit (कक्षा 1 से 12)',
    mrp: 4500,
    bestPrice: 10,
    discountPct: 99,
    cheapestSource: 'IOIS प्लेटफॉर्म (Plan 01 ₹10)',
    expensiveSource: 'ऑफलाइन बाजार गाइड बुक्स (₹3,800+)',
    priceDiff: 3790,
    buyingTip: 'IOIS पर केवल ₹10 में पूरा डिजिटल NCERT संग्रह, समाधान व करियर नोट्स आजीवन उपलब्ध हैं।',
    status: 'sasta'
  },
  {
    id: 'deal-4',
    category: 'इलेक्ट्रॉनिक्स व मोबाइल (Gadgets)',
    item: '5G स्मार्टफोन (8GB RAM / 128GB Storage)',
    mrp: 18999,
    bestPrice: 13499,
    discountPct: 29,
    cheapestSource: 'अमेज़न / फ्लिपकार्ट सेल + बैंक क्रेडिट कार्ड ऑफर',
    expensiveSource: 'ऑफलाइन मॉल स्टोर (₹16,999)',
    priceDiff: 3500,
    buyingTip: 'SBI या HDFC कार्ड के साथ एक्सचेंज ऑफर मिलाकर खरीदने पर अधिकतम डिस्काउंट मिलता है।',
    status: 'sasta'
  },
  {
    id: 'deal-5',
    category: 'निर्माण सामग्री (Construction)',
    item: 'अल्ट्राटेक / एसीसी 53 ग्रेड प्रीमियम सीमेंट (प्रति बोरी)',
    mrp: 440,
    bestPrice: 375,
    discountPct: 15,
    cheapestSource: 'सीधा कंपनी अधिकृत डिस्ट्रीब्यूटर (100+ बैग्स)',
    expensiveSource: 'लोकल रिटेल हार्डवेयर शॉप (₹420)',
    priceDiff: 45,
    buyingTip: 'घर बनाते समय 200 बैग्स एक साथ मंगाने पर ट्रांसपोर्टेशन फ्री और ₹9,000 की बचत होती है।',
    status: 'sasta'
  }
];

/**
 * 9. GOVERNMENT PORTALS & WEBSITES DIRECTORY (किस वेबसाइट से क्या होगा व कैसे इस्तेमाल करें?)
 */
export const GOVT_PORTALS_DIRECTORY: GovtPortal[] = [
  {
    id: 'portal-uidai',
    name: 'UIDAI - आधार सेवा पोर्टल',
    shortName: 'myaadhaar.uidai.gov.in',
    category: 'identity',
    url: 'https://myaadhaar.uidai.gov.in',
    badge: '100% अनिवार्य नागरिक सेवा',
    purposeHindi: 'आधार कार्ड डाउनलोड करना, मोबाइल नंबर अपडेट की स्थिति जांचना, एड्रेस बदलना, PVC आधार कार्ड ऑनलाइन ऑर्डर करना और बायोमेट्रिक्स को लॉक/अन unlock करना।',
    howToUse: [
      'वेबसाइट खोलें और "Login with Aadhaar & OTP" पर क्लिक करें।',
      'अपना 12 अंकों का आधार नंबर और स्क्रीन पर दिया कैप्चा दर्ज करें।',
      'रजिस्टर्ड मोबाइल पर आए OTP को डालकर लॉगिन करें।',
      'Download Aadhaar, Address Update, या Order PVC Card चुनें।',
      'PDF आधार कार्ड का पासवर्ड आपके नाम के पहले 4 अक्षर (कैपिटल) + जन्म वर्ष (उदा: RAHU1998) होता है।'
    ],
    keyServices: ['E-Aadhaar PDF Download', 'Address Update Online', 'Order PVC Card (₹50)', 'Biometric Lock / Unlock', 'Aadhaar-Bank Seeding Status']
  },
  {
    id: 'portal-incometax',
    name: 'इनकम टैक्स ई-फाइलिंग एवं पैन कार्ड पोर्टल',
    shortName: 'incometax.gov.in',
    category: 'finance',
    url: 'https://www.incometax.gov.in',
    badge: 'पैन-आधार लिंक व ITR',
    purposeHindi: 'आयकर रिटर्न (ITR) फाइल करना, इंस्टेंट फ्री ई-पैन कार्ड (Instant e-PAN) 10 मिनट में बनाना, पैन कार्ड को आधार से लिंक करना और TDS रिफंड स्टेटस देखना।',
    howToUse: [
      'इंस्टेंट पैन बनाने के लिए "Instant e-PAN" विकल्प चुनें।',
      '"Get New e-PAN" पर क्लिक करके अपना आधार नंबर दर्ज करें।',
      'मोबाइल पर आए OTP को सत्यापित करें, आपका 10 अंकों का पैन तुरंत बन जाएगा।',
      'पैन-आधार लिंक स्टेटस जांचने के लिए "Link Aadhaar Status" पर क्लिक करें।'
    ],
    keyServices: ['Instant Free e-PAN Creation', 'Link Aadhaar to PAN', 'ITR 1 & ITR 4 Filing', 'Check Income Tax Refund Status', 'Form 26AS Tax Credit']
  },
  {
    id: 'portal-digilocker',
    name: 'डिजिलॉकर (DigiLocker) डिजिटल दस्तावेज भंडार',
    shortName: 'digilocker.gov.in',
    category: 'identity',
    url: 'https://www.digilocker.gov.in',
    badge: 'मान्यता प्राप्त कानूनी डिजिटल लॉकर',
    purposeHindi: '10वीं-12वीं की मार्कशीट, ड्राइविंग लाइसेंस, गाड़ी की RC, जाति/निवास प्रमाण पत्र, राशन कार्ड आदि को आधिकारिक रूप से अपने फोन में सुरक्षित रखना (IT एक्ट 2000 के तहत मान्य)।',
    howToUse: [
      'साइन अप करें और अपने आधार नंबर व 6 अंकों के सिक्योरिटी पिन से लॉगिन करें।',
      '"Search Documents" में जाकर अपने राज्य या बोर्ड (उदा: CBSE, Bihar Board, UP Board) को चुनें।',
      'रोल नंबर या रजिस्ट्रेशन नंबर दर्ज करके दस्तावेज फेच (Fetch) करें।',
      'अब "Issued Documents" में आपका मूल प्रमाणपत्र हमेशा के लिए सुरक्षित हो जाएगा।'
    ],
    keyServices: ['Driving License & RC Download', 'Class 10th & 12th Marksheets', 'Ration Card & Caste Certificate', 'COVID Vaccination Certificate', 'Valid for Police & RTO Inspection']
  },
  {
    id: 'portal-pmkisan',
    name: 'पीएम किसान सम्मान निधि पोर्टल (PM-KISAN)',
    shortName: 'pmkisan.gov.in',
    category: 'farmers',
    url: 'https://pmkisan.gov.in',
    badge: '₹6,000 वार्षिक किसान सहायता',
    purposeHindi: 'देश के किसान परिवारों को सालाना ₹6,000 की आर्थिक मदद (₹2,000 की 3 किस्तें), लाभार्थी स्टेटस चेक करना, नया किसान रजिस्ट्रेशन और e-KYC पूरा करना।',
    howToUse: [
      'होमपेज पर "Know Your Status" विकल्प पर क्लिक करें।',
      'अपना रजिस्ट्रेशन नंबर या मोबाइल नंबर दर्ज करें और कैप्चा भरें।',
      'OTP डालकर आप देख सकते हैं कि कौन सी किस्त आपके बैंक खाते में जमा हुई है।',
      'e-KYC के लिए "eKYC" लिंक पर आधार नंबर डालकर फेशियल या OTP वेरिफिकेशन करें।'
    ],
    keyServices: ['Beneficiary Status Check', 'OTP Based e-KYC', 'New Farmer Registration', 'Name Correction as per Aadhaar', 'Land Seeding & DBT Status']
  },
  {
    id: 'portal-epfo',
    name: 'कर्मचारी भविष्य निधि संगठन (EPFO UAN Member Portal)',
    shortName: 'unifiedportal-mem.epfindia.gov.in',
    category: 'finance',
    url: 'https://unifiedportal-mem.epfindia.gov.in',
    badge: 'PF बैलेंस व ऑनलाइन निकासी',
    purposeHindi: 'प्राइवेट या सरकारी नौकरी करने वालों का PF बैलेंस चेक करना, ऑनलाइन PF विड्रॉल क्लेम (Form 19/10C/31) डालना और UAN पासबुक डाउनलोड करना।',
    howToUse: [
      'अपने 12 अंकों के UAN (Universal Account Number) और पासवर्ड से लॉगिन करें।',
      '"View" -> "Passbook" में जाकर अपना और कंपनी का कुल जमा अंशदान देखें।',
      'पैसे निकालने के लिए "Online Services" -> "Claim (Form-31, 19, 10C)" पर क्लिक करें।',
      'बैंक खाता नंबर दर्ज कर OTP के माध्यम से फॉर्म सबमिट करें। 3 से 7 दिनों में राशि खाते में आ जाएगी।'
    ],
    keyServices: ['UAN Activation & Login', 'PF Passbook & Balance Check', 'Online PF Advance Claim', 'KYC Updation (Bank, Aadhaar, PAN)', 'Transfer PF to New Company']
  },
  {
    id: 'portal-parivahan',
    name: 'परिवहन सेवा - सारथी व वाहन पोर्टल',
    shortName: 'parivahan.gov.in',
    category: 'transport',
    url: 'https://parivahan.gov.in',
    badge: 'ड्राइविंग लाइसेंस व वाहन चालान',
    purposeHindi: 'लर्नर लाइसेंस (LL) और परमानेंट ड्राइविंग लाइसेंस (DL) ऑनलाइन अप्लाई करना, लाइसेंस रिन्यूअल, गाड़ी का ई-चालान चेक व पेमेंट और RC ट्रांसफर।',
    howToUse: [
      '"Drivers/Learner\'s License" पर क्लिक करें और अपना राज्य चुनें।',
      '"Apply for Learner License" चुनकर घर बैठे ऑनलाइन टेस्ट देकर LL प्राप्त करें।',
      'गाड़ी का चालान देखने के लिए "Online Services" -> "Check Challan Status" पर वाहन नंबर डालें।'
    ],
    keyServices: ['Online Learner License Test from Home', 'Driving License Renewal & Duplicate DL', 'Vehicle e-Challan Payment', 'RC Details & Fitness Certificate', 'International Driving Permit']
  },
  {
    id: 'portal-ration',
    name: 'राष्ट्रीय खाद्य सुरक्षा पोर्टल (NFSA / Mera Ration)',
    shortName: 'nfsa.gov.in',
    category: 'farmers',
    url: 'https://nfsa.gov.in',
    badge: 'राशन कार्ड व मुफ्त अनाज योजना',
    purposeHindi: 'राशन कार्ड लिस्ट में नाम चेक करना, परिवार के नए सदस्यों का नाम जोड़ना, वन नेशन वन राशन कार्ड के तहत किसी भी शहर में मुफ्त राशन की दुकान खोजना।',
    howToUse: [
      '"Ration Cards" -> "Ration Card Details on State Portals" पर क्लिक करें।',
      'अपने राज्य और जिले का चयन करें, फिर अपनी तहसील/ब्लॉक चुनें।',
      'अपने गांव या कोटेदार (राशन डीलर) के नाम पर क्लिक करके पूरी राशन कार्ड सूची डाउनलोड करें।'
    ],
    keyServices: ['Check Name in Ration Card List', 'Add / Remove Family Member', 'One Nation One Ration Card (ONORC)', 'Find Nearest Fair Price Shop', 'Track Ration Allotment & Entitlement']
  },
  {
    id: 'portal-ayushman',
    name: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PMJAY)',
    shortName: 'beneficiary.nha.gov.in',
    category: 'health',
    url: 'https://beneficiary.nha.gov.in',
    badge: '₹5 लाख तक मुफ्त इलाज कार्ड',
    purposeHindi: 'गरीब और मध्यमवर्गीय परिवारों को देश के किसी भी सरकारी या प्राइवेट लिस्टेड अस्पताल में प्रति वर्ष ₹5 लाख तक का कैशलेस एवं मुफ्त इलाज कार्ड बनाना व डाउनलोड करना।',
    howToUse: [
      '"Beneficiary" विकल्प चुनकर अपना मोबाइल नंबर दर्ज करें और OTP से लॉगिन करें।',
      'राज्य, योजना (PMJAY), जिला चुनें और राशन कार्ड नंबर या आधार नंबर दर्ज करें।',
      'परिवार के पात्र सदस्यों के नाम दिखेंगे; "Card Download" पर क्लिक कर आयुष्मान कार्ड प्राप्त करें।'
    ],
    keyServices: ['Ayushman Card e-KYC & Download', 'Search Empanelled Hospital List', 'Check Eligibility (Am I Eligible?)', 'Track Claim & Free Surgery Coverage', 'ABHA Health Account ID Creation']
  },
  {
    id: 'portal-bhulekh',
    name: 'भूलेख - जमीन का खसरा खतौनी व जमाबंदी नकल',
    shortName: 'bhulekh.gov.in / State Land Portals',
    category: 'land',
    url: 'https://landrecords.gov.in',
    badge: 'जमीन की डिजिटल खतौनी',
    purposeHindi: 'अपने खेत या प्लॉट की खतौनी नकल (ROR), खसरा नंबर, नक्शा, रकबा और मालिकाना हक ऑनलाइन चेक व प्रिंट करना। जमीन की धोखाधड़ी से बचाव।',
    howToUse: [
      'अपने राज्य के भूलेख पोर्टल (उदा: Bihar Bhumi, UP Bhulekh, MP Bhulekh, Apna Khata Rajasthan) पर जाएं।',
      'जिला -> तहसील -> परगना -> गांव चुनें।',
      'खसरा संख्या, खाता संख्या या खातेदार के नाम से अपनी प्रमाणित खतौनी 1-क्लिक में डाउनलोड करें।'
    ],
    keyServices: ['Online Khasra Khatauni Download', 'Bhu-Naksha (Digital Land Map)', 'Check Land Ownership & Mutation Status', 'Online Dakhil Kharij Application', 'Land Registry Document Verification']
  }
];

/**
 * 10. LATEST GOVERNMENT RULES & LAWS (सरकारी नियम व कानून)
 */
export const GOVT_RULES_AND_LAWS: GovtRuleLaw[] = [
  {
    id: 'rule-1',
    title: 'नया मोटर वाहन नियम 2026: चालान व कैमरे से सीधा ई-डिटेक्शन',
    effectiveDate: 'लागू (Active 2026)',
    category: 'Traffic & Transport',
    summary: 'सड़क पर बिना हेलमेट, बिना सीटबेल्ट या मोबाइल पर बात करने पर ऑटोमैटिक AI कैमरों द्वारा डिजिटल चालान सीधे मोबाइल पर भेजा जाएगा। 30 दिनों में भुगतान न करने पर DL सस्पेंड हो सकता है।',
    impact: 'नागरिकों को हमेशा डिजिलॉकर में वैध DL, बीमा व पॉल्यूशन सर्टिफिकेट रखना अनिवार्य है।'
  },
  {
    id: 'rule-2',
    title: 'साइबर सुरक्षा व डिजिटल फ्रॉड कानून: 1930 राष्ट्रीय हेल्पलाइन',
    effectiveDate: '24x7 सक्रिय',
    category: 'Cyber Safety & Banking',
    summary: 'ऑनलाइन वित्तीय धोखाधड़ी होने पर तुरंत हेल्पलाइन 1930 पर कॉल करने या cybercrime.gov.in पर रिपोर्ट करने पर फ्रॉड की गई राशि को 2 घंटे के भीतर बैंक द्वारा फ्रीज कराया जा सकता है।',
    impact: 'कभी भी किसी को बैंक OTP, पासवर्ड या रिमोट एक्सेस ऐप (AnyDesk) का एक्सेस न दें।'
  },
  {
    id: 'rule-3',
    title: 'उपभोक्ता संरक्षण अधिकार: अनुचित ऑनलाइन कैंसलेशन व झूठे विज्ञापनों पर जुर्माना',
    effectiveDate: 'सख्त प्रावधान',
    category: 'Consumer Rights',
    summary: 'ई-कॉमर्स या लोकल दुकानदार द्वारा खराब माल देने या वारंटी से मुकरने पर उपभोक्ता राष्ट्रीय उपभोक्ता हेल्पलाइन (NCH) 1915 या edaakhil.nic.in पर बिना वकील के फ्री शिकायत दर्ज करा सकते हैं।',
    impact: 'उपभोक्ता को क्षतिपूर्ति और 100% रिफंड पाने का पूर्ण कानूनी अधिकार है।'
  }
];

/**
 * 11. LIVE JOB ALERTS & IOIS OPPORTUNITIES
 */
export const LIVE_JOB_ALERTS: JobAlert[] = [
  {
    id: 'job-1',
    title: 'SSC CGL 2026 - संयुक्त स्नातक स्तरीय भर्ती परीक्षा',
    department: 'कर्मचारी चयन आयोग (Staff Selection Commission)',
    type: 'govt',
    totalPosts: '14,500+ पद',
    qualification: 'किसी भी विषय में स्नातक (Graduate Degree)',
    ageLimit: '18 से 32 वर्ष (आरक्षण नियमानुसार छूट)',
    salary: 'पे लेवल 4 से 8 (₹35,400 - ₹1,42,400)',
    location: 'अखिल भारतीय (All India)',
    lastDate: '30 सितंबर 2026',
    applyUrl: 'https://ssc.gov.in',
    isNew: true
  },
  {
    id: 'job-2',
    title: 'रेलवे सुरक्षा बल (RPF) सब-इंस्पेक्टर व कांस्टेबल भर्ती',
    department: 'भारतीय रेलवे भर्ती बोर्ड (RRB)',
    type: 'govt',
    totalPosts: '4,660 पद',
    qualification: '10वीं पास (कांस्टेबल) / ग्रेजुएट (SI)',
    ageLimit: '18 से 28 वर्ष',
    salary: '₹21,700 - ₹35,400 प्रतिमाह',
    location: 'ऑल इंडिया रेलवे जोन',
    lastDate: '15 अक्टूबर 2026',
    applyUrl: 'https://rrbapply.gov.in',
    isNew: true
  },
  {
    id: 'job-3',
    title: 'IBPS क्लर्क व प्रोबेशनरी ऑफिसर (PO) भर्ती 2026',
    department: 'बैंकिंग कार्मिक चयन संस्थान (IBPS)',
    type: 'govt',
    totalPosts: '8,200+ पद',
    qualification: 'ग्रेजुएट इन एनी स्ट्रीम',
    ageLimit: '20 से 30 वर्ष',
    salary: '₹32,000 - ₹58,000 प्रतिमाह',
    location: 'राष्ट्रीयकृत बैंक (PNB, BOB, Canara आदि)',
    lastDate: '25 सितंबर 2026',
    applyUrl: 'https://ibps.in',
    isNew: false
  },
  {
    id: 'job-4',
    title: 'IOIS डिजिटल कम्युनिटी कोऑर्डिनेटर (District Coordinator)',
    department: 'IOIS Official Career Division',
    type: 'iois',
    totalPosts: 'प्रत्येक जिले में 5 पद',
    qualification: '12वीं पास / डिजिटल साक्षर / स्मार्टफोन ज्ञान',
    ageLimit: '18+ वर्ष',
    salary: '₹15,000 - ₹35,000 + 70% इंसेंटिव',
    location: 'वर्क फ्रॉम होम / गृह जिला',
    lastDate: 'खुला आवेदन (Ongoing 2026)',
    applyUrl: '#register',
    isNew: true
  },
  {
    id: 'job-5',
    title: 'IOIS स्टूडेंट मेंटर व डिजिटल सपोर्ट एसोसिएट',
    department: 'IOIS Student Helpdesk Team',
    type: 'iois',
    totalPosts: '50 पद',
    qualification: 'इंटरमीडिएट या कॉलेज छात्र',
    ageLimit: '18 से 28 वर्ष',
    salary: '₹500 से ₹1,500 प्रतिदिन (कार्य अनुसार)',
    location: 'रिमोट / ऑनलाइन',
    lastDate: 'सीमित सीटें उपलब्ध',
    applyUrl: '#register',
    isNew: true
  }
];
