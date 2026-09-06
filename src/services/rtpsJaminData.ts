export interface CitizenServiceGuide {
  id: string;
  category: 'rtps' | 'jamin' | 'aadhaar_pan' | 'pension' | 'scholarship' | 'schemes';
  categoryLabel: string;
  title: string;
  shortCode: string;
  department: string;
  tagline: string;
  fee: string;
  deliveryTime: string;
  officialPortalName: string;
  applyUrl: string;
  trackUrl: string;
  requiredDocuments: {
    name: string;
    isMandatory: boolean;
    specification: string;
  }[];
  eligibility: string[];
  stepByStepGuide: string[];
  verificationWorkflow: {
    designatedOfficer: string;
    investigationOfficer: string;
    approvalAuthority: string;
    processDetails: string;
  };
  rejectionReasons: string[];
  downloadMethod: string;
  proTips: string;
}

export const CITIZEN_SERVICES_DATA: CitizenServiceGuide[] = [
  // ================= 1. RTPS & CITIZEN CERTIFICATES =================
  {
    id: 'caste-cert',
    category: 'rtps',
    categoryLabel: 'RTPS / ई-डिस्ट्रिक्ट प्रमाण पत्र',
    title: 'जाति प्रमाण पत्र (Caste Certificate - SC/ST/EBC/BC/OBC)',
    shortCode: 'RTPS-CAST',
    department: 'राजस्व एवं भूमि सुधार विभाग / सामान्य प्रशासन विभाग',
    tagline: 'छात्रवृत्ति, सरकारी नौकरी, आरक्षण व कॉलेज दाखिले के लिए अनिवार्य प्रमाण पत्र',
    fee: '₹0 (बिल्कुल मुफ्त)',
    deliveryTime: '10 से 14 कार्य दिवस (Tatkal: 2-3 दिन)',
    officialPortalName: 'ServicePlus RTPS (serviceonline.bihar.gov.in)',
    applyUrl: 'https://serviceonline.bihar.gov.in',
    trackUrl: 'https://serviceonline.bihar.gov.in/serviceDetails/statusTrack.html',
    requiredDocuments: [
      { name: 'आवेदक का आधार कार्ड (Aadhaar Card)', isMandatory: true, specification: 'आवेदक का नाम व पिता का नाम सही होना चाहिए (PDF/JPG < 200KB)' },
      { name: 'पासपोर्ट साइज रंगीन फोटो', isMandatory: true, specification: 'साफ सुथरी हालिया फोटो (JPG < 50KB)' },
      { name: 'स्व-घोषणा पत्र (Self Declaration Form)', isMandatory: true, specification: 'फॉर्म भरते समय पोर्टल पर ऑटो-जनरेट होता है' },
      { name: 'जमीन की रसीद या खतियान (खतियानी जाति प्रमाण हेतु)', isMandatory: false, specification: 'यदि पहली बार परिवार में कोई बना रहा हो या वंशावली के साथ' },
      { name: 'राशन कार्ड या वोटर आईडी कार्ड', isMandatory: false, specification: 'पहचान के सहायक प्रमाण हेतु' }
    ],
    eligibility: [
      'आवेदक संबंधित राज्य का स्थायी निवासी होना चाहिए।',
      'आवेदक उस जाति श्रेणी (SC/ST/EBC/BC/General) से संबंधित हो जो सरकारी गजट में अधिसूचित है।',
      'विवाहित महिलाओं के मामले में जाति प्रमाण पत्र उनके पिता के नाम व पते से निर्गत होता है।'
    ],
    stepByStepGuide: [
      'RTPS ServicePlus पोर्टल (serviceonline.bihar.gov.in) पर जाएं।',
      'मुख्य पृष्ठ पर "लोक सेवाओं का अधिकार की सेवाएं" -> "सामान्य प्रशासन विभाग" पर क्लिक करें।',
      '"जाति प्रमाण पत्र का निर्गमन" चुनें -> स्तर चुनें: "अंचल स्तर (Revenue Officer / CO स्तर)".',
      'फॉर्म में लिंग, नाम, पिता का नाम, माता का नाम, पति का नाम (यदि लागू हो), मोबाइल नंबर व ईमेल भरें।',
      'स्थायी व वर्तमान पता (जिला, अनुमंडल, प्रखंड, ग्राम पंचायत/नगर निकाय, वार्ड संख्या) सही चुनें।',
      'अपनी जाति अनुसूची व जाति का नाम (Caste Category & Caste Name) ड्रॉपडाउन से चुनें।',
      'आवेदक का फोटो अपलोड करें और Captcha दर्ज कर Proceed पर क्लिक करें।',
      'अगले पेज पर "Attach Annexure" पर क्लिक कर आधार कार्ड (PDF/JPG) अपलोड करें और Final Submit करें।',
      'प्राप्त पावती रसीद (Acknowledgement Slip) को सुरक्षित सेव या प्रिंट कर लें, जिसमें 16 अंकों का Application Ref No. (जैसे BICC/2026/XXXXX) दर्ज रहता है।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'राजस्व अधिकारी (Revenue Officer / RO) / अंचलाधिकारी (CO)',
      investigationOfficer: 'राजस्व कर्मचारी (Karamchari) व अंचल अमीन / आईटी सहायक',
      approvalAuthority: 'अंचल स्तर (RO/CO) -> अनुमंडल स्तर (SDO) -> जिला स्तर (DM)',
      processDetails: 'आवेदन सबमिट होते ही यह संबंधित अंचल के राजस्व कर्मचारी के लॉगिन में जाता है। कर्मचारी स्थानीय खतियान/परिवार विवरण से जाति की पुष्टि कर डिजिटल हस्ताक्षर (Digital Signature) हेतु RO/CO को अग्रसारित करता है। डिजिटल रूप से साइन होते ही प्रमाण पत्र तैयार हो जाता है।'
    },
    rejectionReasons: [
      'आधार कार्ड में नाम या पिता के नाम में स्पेलिंग मिसमैच होना।',
      'विवाहित महिला द्वारा पिता के बजाय पति के पते/जाति से आवेदन करना।',
      'गलत जाति या अनुसूची (Category) का चयन करना।',
      'धुंधली फोटो या अपठनीय आधार कार्ड अपलोड करना।'
    ],
    downloadMethod: 'ServicePlus पोर्टल के होमपेज पर "सर्टिफिकेट डाउनलोड करें (Download Certificate)" लिंक पर क्लिक करें, अपना Application Reference Number व आवेदक का नाम दर्ज करें और 1-क्लिक में डिजिटल साइन वाला मूल प्रमाण पत्र डाउनलोड करें।',
    proTips: 'अंचल स्तर (RO Level) का प्रमाण पत्र बनने के बाद ही आप अनुमंडल (SDO) और जिला (DM) स्तर के लिए उसी रेफरेंस नंबर से 2 मिनट में आगे अप्लाई कर सकते हैं।'
  },
  {
    id: 'residence-cert',
    category: 'rtps',
    categoryLabel: 'RTPS / ई-डिस्ट्रिक्ट प्रमाण पत्र',
    title: 'निवास / आवासीय प्रमाण पत्र (Residential / Domicile Certificate)',
    shortCode: 'RTPS-RES',
    department: 'सामान्य प्रशासन विभाग / राजस्व विभाग',
    tagline: 'राज्य निवासी आरक्षण, सरकारी नौकरी, कॉलेज एडमिशन व पासपोर्ट के लिए अनिवार्य',
    fee: '₹0 (बिल्कुल मुफ्त)',
    deliveryTime: '10 कार्य दिवस',
    officialPortalName: 'ServicePlus RTPS (serviceonline.bihar.gov.in)',
    applyUrl: 'https://serviceonline.bihar.gov.in',
    trackUrl: 'https://serviceonline.bihar.gov.in/serviceDetails/statusTrack.html',
    requiredDocuments: [
      { name: 'आधार कार्ड (Aadhaar Card)', isMandatory: true, specification: 'आवेदक के स्थायी पते का प्रमाण (PDF/JPG)' },
      { name: 'रंगीन पासपोर्ट साइज फोटो', isMandatory: true, specification: 'JPG फॉर्मेट (< 50KB)' },
      { name: 'वोटर कार्ड / बिजली बिल / राशन कार्ड', isMandatory: false, specification: 'पते के अतिरिक्त सत्यापन हेतु (यदि आवश्यक हो)' }
    ],
    eligibility: [
      'आवेदक संबंधित राज्य का स्थायी या अस्थायी निवासी हो।',
      'निवास का पूरा विवरण (ग्राम, पोस्ट, थाना, पंचायत, वार्ड व पिन कोड) उपलब्ध हो।'
    ],
    stepByStepGuide: [
      'ServicePlus पोर्टल पर जाएं और "सामान्य प्रशासन विभाग" -> "आवासीय प्रमाण पत्र का निर्गमन (अंचल स्तर)" चुनें।',
      'व्यक्तिगत विवरण, माता-पिता का नाम, स्थायी पता व वर्तमान पता भरें।',
      'निवास का प्रकार चुनें: "स्थायी (Permanent)" या "अस्थायी (Temporary)".',
      'आवेदन का उद्देश्य दर्ज करें (जैसे: सरकारी नौकरी, नामांकन, आदि)।',
      'फोटो व आधार कार्ड अपलोड करें और सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'राजस्व अधिकारी (Revenue Officer)',
      investigationOfficer: 'हल्का कर्मचारी / बीएलओ / स्थानीय जांच',
      approvalAuthority: 'अंचल अधिकारी / आरओ',
      processDetails: 'राजस्व कर्मचारी द्वारा मतदाता सूची या स्थानीय निवास रिकॉर्ड से मिलान कर अनुमोदन दिया जाता है।'
    },
    rejectionReasons: [
      'पता अधूरा होना (जैसे वार्ड नंबर या थाना छोड़ देना)।',
      'आधार कार्ड के पते और फॉर्म में भरे पते में भारी अंतर होना।'
    ],
    downloadMethod: 'RTPS पोर्टल के "Download Certificate" ऑप्शन में जाकर Application Number व Name डालकर PDF डाउनलोड करें। SMS में भी सीधे डाउनलोड लिंक प्राप्त होता है।',
    proTips: 'निवास प्रमाण पत्र की कोई समय सीमा (Expiry) नहीं होती, जब तक आप अपना स्थायी पता नहीं बदलते।'
  },
  {
    id: 'income-cert',
    category: 'rtps',
    categoryLabel: 'RTPS / ई-डिस्ट्रिक्ट प्रमाण पत्र',
    title: 'आय प्रमाण पत्र (Income Certificate)',
    shortCode: 'RTPS-INC',
    department: 'राजस्व एवं भूमि सुधार विभाग / सामान्य प्रशासन विभाग',
    tagline: 'छात्रवृत्ति, EWS, फीस माफी, राशन कार्ड व सरकारी सब्सिडी हेतु वित्तीय प्रमाण',
    fee: '₹0 (बिल्कुल मुफ्त)',
    deliveryTime: '10 कार्य दिवस',
    officialPortalName: 'ServicePlus RTPS',
    applyUrl: 'https://serviceonline.bihar.gov.in',
    trackUrl: 'https://serviceonline.bihar.gov.in/serviceDetails/statusTrack.html',
    requiredDocuments: [
      { name: 'आधार कार्ड', isMandatory: true, specification: 'आवेदक या अभिभावक का पहचान पत्र' },
      { name: 'पासपोर्ट फोटो', isMandatory: true, specification: 'JPG < 50KB' },
      { name: 'स्व-घोषणा पत्र (आय विवरण)', isMandatory: true, specification: 'पोर्टल पर कृषि, व्यवसाय, सेवा व अन्य स्रोतों से वार्षिक आय' },
      { name: 'वेतन पर्ची / ITR रसीद (यदि लागू हो)', isMandatory: false, specification: 'नौकरीपेशा व्यक्तियों के लिए' }
    ],
    eligibility: [
      'परिवार की सभी स्रोतों (कृषि, नौकरी, मजदूरी, पेंशन, व्यवसाय) से होने वाली कुल वार्षिक आय का विवरण सत्य होना चाहिए।'
    ],
    stepByStepGuide: [
      'ServicePlus पोर्टल पर "आय प्रमाण पत्र का निर्गमन" -> "अंचल स्तर" चुनें।',
      'व्यक्तिगत जानकारी के बाद "आय का विवरण" भरें: (i) सरकारी सेवा से आय (ii) व्यवसाय से आय (iii) कृषि से आय (iv) अन्य स्रोतों से आय।',
      'कुल वार्षिक आय (Total Annual Income) स्वचालित रूप से जुड़ जाएगी (उदा: ₹90,000 या ₹1,50,000)।',
      'आवेदन का उद्देश्य दर्ज करें (उदा: छात्रवृत्ति हेतु) और आधार दस्तावेज अपलोड कर सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'राजस्व अधिकारी (Revenue Officer)',
      investigationOfficer: 'राजस्व कर्मचारी / हल्का अमीन',
      approvalAuthority: 'अंचल स्तर पर डिजिटल हस्ताक्षर',
      processDetails: 'कर्मचारी द्वारा परिवार की भूमि, पेशा व स्थानीय आय का मूल्यांकन कर सत्यापन रिपोर्ट लगाई जाती है।'
    },
    rejectionReasons: [
      'आय विवरण शून्य छोड़ देना।',
      'सत्यता से परे बहुत अधिक या संदिग्ध आय दर्ज करना।'
    ],
    downloadMethod: 'Application Reference Number डालकर RTPS पोर्टल से डिजिटल साइन वाला सर्टिफिकेट डाउनलोड करें।',
    proTips: 'आय प्रमाण पत्र सामान्यतः जारी होने की तिथि से केवल 1 वर्ष (1 Financial Year) के लिए ही मान्य होता है।'
  },
  {
    id: 'ews-cert',
    category: 'rtps',
    categoryLabel: 'RTPS / ई-डिस्ट्रिक्ट प्रमाण पत्र',
    title: 'EWS प्रमाण पत्र (Economically Weaker Section - 10% आरक्षण)',
    shortCode: 'RTPS-EWS',
    department: 'सामान्य प्रशासन विभाग',
    tagline: 'सामान्य वर्ग (General Category) के आर्थिक रूप से कमजोर नागरिकों के लिए 10% आरक्षण',
    fee: '₹0 (बिल्कुल मुफ्त)',
    deliveryTime: '15 से 21 कार्य दिवस',
    officialPortalName: 'ServicePlus RTPS Portal',
    applyUrl: 'https://serviceonline.bihar.gov.in',
    trackUrl: 'https://serviceonline.bihar.gov.in/serviceDetails/statusTrack.html',
    requiredDocuments: [
      { name: 'आवेदक व माता-पिता का आधार कार्ड', isMandatory: true, specification: 'PDF/JPG' },
      { name: 'पासपोर्ट साइज फोटो', isMandatory: true, specification: 'JPG' },
      { name: 'जमीन का खतियान / रसीद / जमीन का दस्तावेज', isMandatory: true, specification: '5 एकड़ से कम कृषि भूमि व आवासीय प्लॉट का प्रमाण' },
      { name: 'पारिवारिक आय प्रमाण पत्र (Income Certificate)', isMandatory: true, specification: 'वार्षिक आय ₹8 लाख से कम' },
      { name: 'स्व-घोषणा पत्र व वंशावली', isMandatory: true, specification: 'EWS प्रारूप अनुसूची' }
    ],
    eligibility: [
      'आवेदक सामान्य वर्ग (General Category) से हो (जो SC/ST/OBC में शामिल न हो)।',
      'परिवार की कुल वार्षिक आय ₹8 लाख से कम हो।',
      'कृषि भूमि 5 एकड़ से कम हो, आवासीय मकान 1000 वर्ग फीट से कम हो, अधिसूचित नगर पालिका में आवासीय प्लॉट 100 वर्ग गज से कम हो।'
    ],
    stepByStepGuide: [
      'ServicePlus पोर्टल पर "आर्थिक रूप से कमजोर वर्ग (EWS) के लिए संपत्ति व आय प्रमाण पत्र" चुनें।',
      'पारिवारिक आय, जाति, जमीन का रकबा व आवासीय संपत्ति का विवरण दर्ज करें।',
      'भूमि रसीद व आधार कार्ड अटैच कर सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'राजस्व अधिकारी (RO) / अंचल अधिकारी (CO)',
      investigationOfficer: 'राजस्व कर्मचारी व सीआई (Circle Inspector)',
      approvalAuthority: 'अंचल स्तर -> अनुमंडल दंडाधिकारी (SDO) / डीएम स्तर',
      processDetails: 'राजस्व कर्मचारी द्वारा आवेदक के परिवार की कुल अचल संपत्ति और आय का भौतिक सत्यापन किया जाता है।'
    },
    rejectionReasons: [
      'परिवार की आय ₹8 लाख से अधिक होना।',
      'जमीन का रकबा 5 एकड़ से अधिक होना या नगर पालिका में बड़ा प्लॉट होना।'
    ],
    downloadMethod: 'ServicePlus पोर्टल पर ई-प्रमाण पत्र डाउनलोड लिंक से PDF प्राप्त करें।',
    proTips: 'EWS प्रमाण पत्र वित्तीय वर्ष (Financial Year - जैसे 2026-2027) के लिए मान्य होता है।'
  },
  {
    id: 'ncl-cert',
    category: 'rtps',
    categoryLabel: 'RTPS / ई-डिस्ट्रिक्ट प्रमाण पत्र',
    title: 'नॉन क्रीमी लेयर प्रमाण पत्र (NCL - Non-Creamy Layer Certificate)',
    shortCode: 'RTPS-NCL',
    department: 'सामान्य प्रशासन विभाग',
    tagline: 'OBC / BC / EBC वर्ग के लिए 27% केंद्रीय व राज्य स्तरीय आरक्षण हेतु अनिवार्य',
    fee: '₹0 (बिल्कुल मुफ्त)',
    deliveryTime: '15 से 21 कार्य दिवस',
    officialPortalName: 'ServicePlus Portal',
    applyUrl: 'https://serviceonline.bihar.gov.in',
    trackUrl: 'https://serviceonline.bihar.gov.in/serviceDetails/statusTrack.html',
    requiredDocuments: [
      { name: 'जाति प्रमाण पत्र (Caste Certificate)', isMandatory: true, specification: 'पूर्व में निर्गत जाति प्रमाण पत्र' },
      { name: 'निवास प्रमाण पत्र (Residence Certificate)', isMandatory: true, specification: 'वैध निवास प्रमाण पत्र' },
      { name: 'आय प्रमाण पत्र (Income Certificate)', isMandatory: true, specification: 'पारिवारिक आय ₹8 लाख से कम' },
      { name: 'स्व-घोषणा पत्र (Form XVI / शपथ पत्र)', isMandatory: true, specification: 'क्रीमीलेयर में नहीं आने की स्व-घोषणा' },
      { name: 'आधार कार्ड व फोटो', isMandatory: true, specification: 'PDF/JPG' }
    ],
    eligibility: [
      'आवेदक OBC / BC / EBC श्रेणी का होना चाहिए।',
      'माता-पिता की अन्य स्रोतों (वेतन व कृषि को छोड़कर नियम अनुसार) से वार्षिक आय ₹8 लाख से कम हो।'
    ],
    stepByStepGuide: [
      'ServicePlus पोर्टल पर "पिछड़ा वर्ग / अत्यंत पिछड़ा वर्ग (क्रीमी लेयर रहित) प्रमाण पत्र" चुनें (राज्य या केंद्र सरकार के प्रयोजनार्थ)।',
      'पुराने जाति, आय व निवास का विवरण व रेफरेंस नंबर दर्ज करें।',
      'माता-पिता का व्यवसाय व आय स्रोत भरें।',
      'शपथ पत्र व आधार संलग्न कर अंतिम सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'राजस्व अधिकारी / अंचलाधिकारी / SDO',
      investigationOfficer: 'सर्कल इंस्पेक्टर (CI) व राजस्व कर्मचारी',
      approvalAuthority: 'RO / SDO स्तर डिजिटल हस्ताक्षर',
      processDetails: 'कर्मचारी द्वारा जाति, निवास व आय तीनों का संयुक्त परीक्षण किया जाता है।'
    },
    rejectionReasons: [
      'जाति, निवास या आय प्रमाण पत्र में से किसी एक का न होना।',
      'स्व-घोषणा पत्र (Affidavit) अपलोड न करना।'
    ],
    downloadMethod: 'ServicePlus पर Reference No. डालकर तुरंत डिजिटली हस्ताक्षरित NCL सर्टिफिकेट डाउनलोड करें।',
    proTips: 'फॉर्म भरते समय पहले जाति, आय व निवास बना लें; NCL आवेदन में इन तीनों का नंबर डालने पर तुरंत अप्रूवल मिलता है।'
  },
  {
    id: 'charitra-cert',
    category: 'rtps',
    categoryLabel: 'RTPS / ई-डिस्ट्रिक्ट प्रमाण पत्र',
    title: 'आचरण / चरित्र प्रमाण पत्र (Police Character Certificate)',
    shortCode: 'RTPS-POL',
    department: 'गृह विभाग (आरक्षी शाखा / पुलिस अधीक्षक कार्यालय)',
    tagline: 'सरकारी नौकरी जॉइनिंग, सीएसपी बैंक मित्र, पासपोर्ट व सरकारी ठेकेदारी हेतु',
    fee: '₹0 (मुफ्त ऑनलाइन)',
    deliveryTime: '14 से 20 कार्य दिवस',
    officialPortalName: 'ServicePlus / State Police Portal',
    applyUrl: 'https://serviceonline.bihar.gov.in',
    trackUrl: 'https://serviceonline.bihar.gov.in/serviceDetails/statusTrack.html',
    requiredDocuments: [
      { name: 'आधार कार्ड / वोटर आईडी / पैन कार्ड', isMandatory: true, specification: 'पहचान व पते का प्रमाण' },
      { name: 'पासपोर्ट साइज फोटो', isMandatory: true, specification: 'JPG < 50KB' },
      { name: 'निवास प्रमाण पत्र (Residential Certificate)', isMandatory: true, specification: 'अंचल स्तर से निर्गत' }
    ],
    eligibility: [
      'आवेदक के विरुद्ध स्थानीय थाने या न्यायालय में कोई गंभीर आपराधिक मुकदमा दर्ज न हो।',
      'पिछले 2 वर्षों से संबंधित थाना क्षेत्र में निवास कर रहा हो।'
    ],
    stepByStepGuide: [
      'RTPS पोर्टल पर "गृह विभाग" -> "आचरण प्रमाण पत्र के लिए आवेदन" चुनें।',
      'व्यक्तिगत जानकारी, वर्तमान व स्थायी पता एवं पिछले 2 वर्षों का अधिवास विवरण भरें।',
      'आवेदन का उद्देश्य चुनें (जैसे: सरकारी सेवा, ठेकेदारी, शस्त्र लाइसेंस, आदि)।',
      'दस्तावेज अपलोड कर सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'पुलिस अधीक्षक (SP) / डीएसपी कार्यालय',
      investigationOfficer: 'संबंधित स्थानीय थाना प्रभारी (SHO) व बीट पुलिस अधिकारी',
      approvalAuthority: 'पुलिस अधीक्षक (SP) का डिजिटल हस्ताक्षर',
      processDetails: 'आवेदन सीधे स्थानीय थाने जाता है। थाना प्रभारी पुलिस रिकॉर्ड व मोहल्ले में भौतिक सत्यापन करता है। रिपोर्ट एसपी ऑफिस जाती है जहां से प्रमाण पत्र जारी होता है।'
    },
    rejectionReasons: [
      'थाने में आपराधिक मामला या गैर-जमानती वारंट लंबित होना।',
      'गलत थाना चुनना या पते पर न मिलना।'
    ],
    downloadMethod: 'ServicePlus पर एप्लीकेशन नंबर डालकर एसपी द्वारा हस्ताक्षरित कैरेक्टर सर्टिफिकेट डाउनलोड करें।',
    proTips: 'ऑनलाइन अप्लाई करने के 3-4 दिन बाद अपने स्थानीय थाने में आधार कार्ड की फोटोकॉपी लेकर जाने से वेरिफिकेशन बहुत तेज हो जाता है।'
  },

  // ================= 2. LAND REFORMS & REVENUE SERVICES (जमीन सुधार) =================
  {
    id: 'dakhil-kharij',
    category: 'jamin',
    categoryLabel: 'जमीन सुधार व राजस्व सेवाएं',
    title: 'ऑनलाइन दाखिल खारिज (Land Mutation / नामांतरण)',
    shortCode: 'BHU-MUT',
    department: 'राजस्व एवं भूमि सुधार विभाग (biharbhumi.bihar.gov.in)',
    tagline: 'जमीन खरीदने के बाद सरकारी रजिस्टर में अपना नाम दर्ज कराने की सबसे महत्वपूर्ण प्रक्रिया',
    fee: '₹0 (सरकारी शुल्क शून्य)',
    deliveryTime: '30 से 75 कार्य दिवस (बिना आपत्ति: 35 दिन)',
    officialPortalName: 'बिहार भूमि पोर्टल (biharbhumi.bihar.gov.in)',
    applyUrl: 'https://biharbhumi.bihar.gov.in',
    trackUrl: 'https://biharbhumi.bihar.gov.in/Biharbhumi/DakhilKharijStatus',
    requiredDocuments: [
      { name: 'रजिस्टर्ड केवाला / सेल डीड (Registered Sale Deed)', isMandatory: true, specification: 'दस्तावेज की सभी पेजों की साफ PDF (< 2MB)' },
      { name: 'विक्रेता की जमीन रसीद / शुद्धि पत्र (Lagan Receipt)', isMandatory: true, specification: 'अपडेटेड लगान रसीद' },
      { name: 'स्व-घोषणा पत्र व वंशावली (बटवारा/विरासत के मामले में)', isMandatory: false, specification: 'वारिसान नामांतरण हेतु' },
      { name: 'क्रेता व विक्रेता का आधार कार्ड व मोबाइल नंबर', isMandatory: true, specification: 'OTP सत्यापन हेतु' }
    ],
    eligibility: [
      'आवेदक के पास वैध रजिस्टर्ड डीड (केवाला), वसीयत, दानपत्र या न्यायालय का आदेश होना चाहिए।',
      'विक्रेता के नाम पर पूर्व से जमाबंदी कायम होनी चाहिए।'
    ],
    stepByStepGuide: [
      'बिहार भूमि पोर्टल (biharbhumi.bihar.gov.in) पर "ऑनलाइन दाखिल खारिज आवेदन करें" पर जाएं।',
      'सिटिजन लॉगिन करें (मोबाइल नंबर व OTP द्वारा)।',
      'जिला, अंचल चुनें और "नया दाखिल खारिज आवेदन करें" पर क्लिक करें।',
      'आवेदन का प्रकार चुनें (Deed Type: Sale, Gift, Partition, Court Order).',
      'डीड नंबर, डीड डेट, रजिस्ट्री ऑफिस का नाम दर्ज करें।',
      'क्रेता (Buyer) व विक्रेता (Seller) का पूरा विवरण व पता भरें।',
      'जमीन का विवरण भरें: हल्का, मौजा, खाता नंबर, खेसरा (प्लॉट) नंबर, रकबा (एकड़/डिसमिल) और चौहद्दी (North, South, East, West).',
      'केवाला की पूरी PDF फाइल अपलोड करें और फाइनल सबमिट कर वाद संख्या (Case Number) नोट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'अंचल अधिकारी (Circle Officer - CO)',
      investigationOfficer: 'राजस्व कर्मचारी (Karamchari) व सर्कल इंस्पेक्टर (CI)',
      approvalAuthority: 'अंचलाधिकारी (CO) का आदेश',
      processDetails: '1. आवेदन पर वाद संख्या (Case No.) दर्ज होता है।\n2. आम-खास सूचना (Notice) 14 दिनों के लिए जारी होती है।\n3. राजस्व कर्मचारी स्थलीय जांच व जमाबंदी का मिलान कर रिपोर्ट सीआई को देता है।\n4. सीआई की अनुशंसा के बाद सीओ द्वारा आदेश पारित किया जाता है और शुद्धि पत्र (Correction Slip) जारी होता है।'
    },
    rejectionReasons: [
      'जमीन पर विक्रेता का नाम जमाबंदी में न होना।',
      'खाता, खेसरा या चौहद्दी में विसंगति होना।',
      'केवाला की अस्पष्ट या अधूरी PDF अपलोड करना।',
      '14 दिनों के भीतर किसी पक्ष द्वारा वैध आपत्ति (Objection) दर्ज कराना।'
    ],
    downloadMethod: 'पोर्टल पर "दाखिल खारिज आवेदन स्थिति" में जाकर जिला, अंचल व वित्तीय वर्ष चुनें, वाद संख्या डालकर "शुद्धि पत्र (Correction Slip)" डाउनलोड करें।',
    proTips: 'दाखिल खारिज स्वीकृत होते ही तुरंत ऑनलाइन लगान रसीद काट लें, जिससे नई जमाबंदी सरकारी सर्वर पर पूरी तरह सक्रिय हो जाती है।'
  },
  {
    id: 'parimarjan-plus',
    category: 'jamin',
    categoryLabel: 'जमीन सुधार व राजस्व सेवाएं',
    title: 'परिमार्जन पोर्टल (डिजिटल जमाबंदी व खाता-खेसरा सुधार)',
    shortCode: 'BHU-PARI',
    department: 'राजस्व एवं भूमि सुधार विभाग',
    tagline: 'डिजिटल जमाबंदी में नाम, पिता का नाम, खाता, खेसरा, रकबा व लगान की गलतियों का ऑनलाइन सुधार',
    fee: '₹0 (मुफ्त)',
    deliveryTime: '15 से 30 कार्य दिवस',
    officialPortalName: 'Parimarjan Portal (parimarjan.bihar.gov.in)',
    applyUrl: 'https://parimarjan.bihar.gov.in',
    trackUrl: 'https://parimarjan.bihar.gov.in/TrackStatus.aspx',
    requiredDocuments: [
      { name: 'पूर्व की ऑफलाइन लगान रसीद या खतियान', isMandatory: true, specification: 'जिसमें सही रकबा/खाता दर्ज हो' },
      { name: 'दाखिल खारिज शुद्धि पत्र या केवाला', isMandatory: true, specification: 'स्वामित्व का कानूनी आधार' },
      { name: 'विहित प्रपत्र में स्व-घोषणा पत्र (Format I/II/III)', isMandatory: true, specification: 'पोर्टल से डाउनलोड कर हस्ताक्षरित' },
      { name: 'आधार कार्ड', isMandatory: true, specification: 'आवेदक का पहचान पत्र' }
    ],
    eligibility: [
      'डिजिटल जमाबंदी में रैयत का नाम गलत दर्ज हो, या खाता/खेसरा छूट गया हो, या रकबा कम/ज्यादा दर्ज हो गया हो।'
    ],
    stepByStepGuide: [
      'परिमार्जन पोर्टल (parimarjan.bihar.gov.in) पर "Post Your Application" पर क्लिक करें।',
      'अपना नाम, मोबाइल नंबर व ईमेल दर्ज कर OTP से वेरीफाई करें।',
      'सुधार का प्रकार चुनें: (1) रैयत के नाम में सुधार (2) खाता/खेसरा/रकबा में सुधार (3) लगान दर में सुधार।',
      'जिला, अंचल, हल्का, मौजा व जमाबंदी संख्या चुनें।',
      'शपथ पत्र, खतियान व पुरानी रसीद की संयुक्त PDF बनाकर अपलोड करें और सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'अंचल अधिकारी (CO)',
      investigationOfficer: 'राजस्व कर्मचारी व सीआई (CI)',
      approvalAuthority: 'अंचल अधिकारी (CO)',
      processDetails: 'राजस्व कर्मचारी पुराने पंजी-2 (रजिस्टर-2) और खतियान से मिलान करता है और सीओ द्वारा डिजिटल रिकॉर्ड को अपडेट कर दिया जाता है।'
    },
    rejectionReasons: [
      'पुराने रजिस्टर-2 से मेल न खाना।',
      'अधूरी या बिना हस्ताक्षर की स्व-घोषणा अपलोड करना।'
    ],
    downloadMethod: 'सुधार स्वीकृत होते ही बिहार भूमि पोर्टल पर "जमाबंदी पंजी देखें" में जाकर सुधरी हुई डिजिटल जमाबंदी देख व प्रिंट कर सकते हैं।',
    proTips: 'आवेदन करते समय संलग्न की जाने वाली PDF में सभी कागजात स्पष्ट व एक ही फाइल में क्रमबद्ध होने चाहिए।'
  },
  {
    id: 'lpc-certificate',
    category: 'jamin',
    categoryLabel: 'जमीन सुधार व राजस्व सेवाएं',
    title: 'भू-स्वामित्व प्रमाण पत्र (LPC - Land Possession Certificate)',
    shortCode: 'BHU-LPC',
    department: 'राजस्व एवं भूमि सुधार विभाग',
    tagline: 'कृषि लोन, KCC, कोर्ट जमानत, सरकारी योजनाओं व भूमि अधिग्रहण मुआवजे हेतु अनिवार्य',
    fee: '₹0 (मुफ्त)',
    deliveryTime: '10 से 15 कार्य दिवस',
    officialPortalName: 'Bihar Bhumi LPC Portal',
    applyUrl: 'https://biharbhumi.bihar.gov.in',
    trackUrl: 'https://biharbhumi.bihar.gov.in/Biharbhumi/LPCStatus',
    requiredDocuments: [
      { name: 'अद्यतन (Current Year) ऑनलाइन लगान रसीद', isMandatory: true, specification: 'चालू वित्तीय वर्ष की कटी हुई रसीद' },
      { name: 'स्व-घोषणा पत्र (LPC Self Declaration)', isMandatory: true, specification: 'पोर्टल फॉर्मेट पर हस्ताक्षर' },
      { name: 'आधार कार्ड व फोटो', isMandatory: true, specification: 'PDF/JPG' }
    ],
    eligibility: [
      'आवेदक के नाम से अथवा पैतृक जमाबंदी पोर्टल पर ऑनलाइन कायम होनी चाहिए।',
      'जमीन का चालू वर्ष तक का सरकारी लगान जमा होना चाहिए।'
    ],
    stepByStepGuide: [
      'बिहार भूमि पोर्टल पर लॉगिन करें और "LPC के लिए ऑनलाइन आवेदन करें" पर जाएं।',
      'जिला, अंचल व मौजा चुनकर अपनी जमाबंदी खोजें।',
      '"Apply LPC" बटन पर क्लिक करें।',
      'LPC का उद्देश्य (जैसे KCC लोन, कृषि सब्सिडी आदि) दर्ज करें।',
      'अद्यतन रसीद व स्व-घोषणा पत्र अपलोड कर सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'अंचल अधिकारी (CO)',
      investigationOfficer: 'राजस्व कर्मचारी',
      approvalAuthority: 'सीओ का डिजिटल हस्ताक्षर',
      processDetails: 'कर्मचारी सत्यापित करता है कि आवेदक का उस जमीन पर वास्तविक भौतिक कब्जा (Possession) है और लगान अद्यतन है।'
    },
    rejectionReasons: [
      'चालू वर्ष की लगान रसीद न होना।',
      'जमीन विवादित होना या 144/कोर्ट केस लंबित होना।'
    ],
    downloadMethod: 'पोर्टल पर LPC स्टेटस में जाकर डिजिटली हस्ताक्षरित LPC PDF डाउनलोड करें।',
    proTips: 'LPC सामान्यतः जारी होने की तिथि से 1 वर्ष के लिए वैध रहता है।'
  },
  {
    id: 'bhu-lagan-online',
    category: 'jamin',
    categoryLabel: 'जमीन सुधार व राजस्व सेवाएं',
    title: 'ऑनलाइन भू-लगान भुगतान व रसीद (Online Land Tax Receipt)',
    shortCode: 'BHU-LAG',
    department: 'राजस्व एवं भूमि सुधार विभाग',
    tagline: 'घर बैठे अपने खेत/प्लॉट का लगान भरें और तुरंत सरकारी डिजिटल रसीद प्राप्त करें',
    fee: 'सरकारी लगान दर अनुसार (उदा: ₹10 से ₹100 प्रति वर्ष)',
    deliveryTime: 'तत्काल (Instant 2 मिनट)',
    officialPortalName: 'Bihar Bhumi e-Lagan Portal',
    applyUrl: 'https://biharbhumi.bihar.gov.in/Biharbhumi/LaganOnline',
    trackUrl: 'https://biharbhumi.bihar.gov.in/Biharbhumi/ViewLaganReceipt',
    requiredDocuments: [
      { name: 'जमाबंदी संख्या / खाता / खेसरा नंबर / भाग वर्तमान व पृष्ठ संख्या', isMandatory: true, specification: 'ऑनलाइन सर्च हेतु' },
      { name: 'UPI / नेट बैंकिंग / डेबिट कार्ड', isMandatory: true, specification: 'ऑनलाइन पेमेंट हेतु' }
    ],
    eligibility: [
      'राज्य में स्थित किसी भी रैयती भूमि का लगान कोई भी रैयत या उसका प्रतिनिधि भर सकता है।'
    ],
    stepByStepGuide: [
      'बिहार भूमि पोर्टल पर "भू-लगान" -> "ऑनलाइन भुगतान करें" पर जाएं।',
      'जिला, अंचल, हल्का, मौजा चुनें।',
      'भाग वर्तमान (Volume Number) और पृष्ठ संख्या (Page Number) दर्ज करें (यदि मालूम न हो तो "भाग वर्तमान व पृष्ठ संख्या जानें" पर क्लिक कर खोजें)।',
      'सुरक्षा कोड डालें और "खोजें" पर क्लिक करें। रैयत का नाम सामने आएगा, "देखें" पर क्लिक करें।',
      'कुल बकाया लगान की राशि दिखेगी। भुगतानकर्ता का नाम, मोबाइल नंबर व पता भरें।',
      '"ऑनलाइन भुगतान करें" पर क्लिक करें और UPI/QR Code/Net Banking से पेमेंट करें।',
      'सफलतापूर्वक भुगतान होते ही "लगान रसीद" स्क्रीन पर आ जाएगी, इसे प्रिंट या PDF सेव कर लें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'ई-पेमेंट गेटवे व ट्रेजरी सिस्टम',
      investigationOfficer: 'स्वचालित डिजिटल सर्वर',
      approvalAuthority: 'ऑटो-वेरिफाइड डिजिटल रसीद',
      processDetails: 'भुगतान सीधे सरकारी खजाने में जमा होता है और रजिस्टर-2 में लगान वर्ष स्वतः अपडेट हो जाता है।'
    },
    rejectionReasons: [
      'बैंक से पेमेंट कटने के बाद सर्वर टाइमआउट होना (ऐसी स्थिति में 24 घंटे प्रतीक्षा करें, ट्रांजैक्शन स्टेटस से रसीद निकल जाती है)।'
    ],
    downloadMethod: 'पोर्टल पर "पिछला भुगतान देखें" में जाकर Transaction ID डालकर कभी भी पुरानी रसीद दोबारा डाउनलोड कर सकते हैं।',
    proTips: 'हर वर्ष मार्च माह से पहले जमीन का लगान जरूर कटा लें ताकि आपकी जमाबंदी हमेशा अद्यतन और सुरक्षित रहे।'
  },

  // ================= 3. AADHAAR & PAN SERVICES =================
  {
    id: 'instant-pan',
    category: 'aadhaar_pan',
    categoryLabel: 'आधार व पैन कार्ड सेवाएं',
    title: '10 मिनट में मुफ्त Instant e-PAN कार्ड (Income Tax Portal)',
    shortCode: 'PAN-INST',
    department: 'आयकर विभाग (Income Tax Department - e-Filing 2.0)',
    tagline: 'बिना कोई दस्तावेज भेजे, बिना 1 रुपया खर्च किए 10 मिनट में नया डिजिटल पैन कार्ड प्राप्त करें',
    fee: '₹0 (बिल्कुल मुफ्त 100% Free)',
    deliveryTime: '10 मिनट (Instant Download)',
    officialPortalName: 'Income Tax e-Filing Portal (eportal.incometax.gov.in)',
    applyUrl: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan',
    trackUrl: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan',
    requiredDocuments: [
      { name: 'आधार कार्ड (Aadhaar Card)', isMandatory: true, specification: 'जिसमें पूरा जन्मतिथि (DD/MM/YYYY) दर्ज हो' },
      { name: 'आधार से लिंक सक्रिय मोबाइल नंबर', isMandatory: true, specification: 'OTP प्राप्त करने हेतु' }
    ],
    eligibility: [
      'आवेदक की आयु 18 वर्ष या उससे अधिक होनी चाहिए।',
      'आवेदक के पास पहले से कोई पैन कार्ड आवंटित न हो।',
      'आधार कार्ड में मोबाइल नंबर सक्रिय होना चाहिए।'
    ],
    stepByStepGuide: [
      'Income Tax e-Filing पोर्टल (eportal.incometax.gov.in) पर जाएं।',
      'Quick Links सेक्शन में "Instant e-PAN" पर क्लिक करें।',
      '"Get New e-PAN" बटन पर क्लिक करें।',
      'अपना 12 अंकों का आधार नंबर दर्ज करें और "I Confirm" चेकबॉक्स टिक कर Continue करें।',
      'आधार से लिंक मोबाइल पर 6 अंकों का OTP आएगा, उसे दर्ज कर Validate करें।',
      'स्क्रीन पर आपकी फोटो, नाम, जन्मतिथि व पता दिखेगा। नियम स्वीकार कर "Submit PAN Request" पर क्लिक करें।',
      'आपको 15 अंकों का Acknowledgement Number मिलेगा।',
      '10 मिनट बाद पुनः "Instant e-PAN" -> "Check Status / Download PAN" पर जाएं, आधार नंबर व OTP डालें और PDF e-PAN डाउनलोड करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'आयकर विभाग सीबीडीटी (CBDT Automated System)',
      investigationOfficer: 'UIDAI e-KYC डेटाबेस',
      approvalAuthority: 'आयकर विभाग का डिजिटल हस्ताक्षर',
      processDetails: 'UIDAI के साथ रीयल-टाइम e-KYC मिलान द्वारा तुरंत नया स्थायी खाता संख्या (PAN) जनरेट होता है।'
    },
    rejectionReasons: [
      'आधार में मोबाइल नंबर लिंक न होना।',
      'पहले से पैन कार्ड बना होना (दो पैन रखना गैर-कानूनी है, ₹10,000 जुर्माना हो सकता है)।'
    ],
    downloadMethod: 'e-Filing पोर्टल से पासवर्ड प्रोटेक्टेड PDF डाउनलोड करें (पासवर्ड आपका जन्मतिथि होता है, उदा: 01011995)।',
    proTips: 'e-PAN डाउनलोड करने के बाद NSDL/UTIITSL से मात्र ₹50 शुल्क देकर घर के पते पर ओरिजिनल प्लास्टिक PVC पैन कार्ड मंगा सकते हैं।'
  },
  {
    id: 'aadhaar-update',
    category: 'aadhaar_pan',
    categoryLabel: 'आधार व पैन कार्ड सेवाएं',
    title: 'आधार कार्ड सुधार व मोबाइल लिंकिंग (Aadhaar Update & PVC Order)',
    shortCode: 'UIDAI-SRV',
    department: 'भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI - myAadhaar)',
    tagline: 'पता सुधार, बायोमेट्रिक लॉक, PVC कार्ड ऑर्डर व दस्तावेज अपडेट',
    fee: 'ऑनलाइन पता सुधार: ₹50 | PVC कार्ड: ₹50 | बायोमेट्रिक/मोबाइल (केंद पर): ₹50-₹100',
    deliveryTime: 'ऑनलाइन सुधार: 3 से 7 दिन | PVC कार्ड डिलीवरी: 7 से 10 दिन डाक द्वारा',
    officialPortalName: 'myAadhaar UIDAI Portal (myaadhaar.uidai.gov.in)',
    applyUrl: 'https://myaadhaar.uidai.gov.in',
    trackUrl: 'https://myaadhaar.uidai.gov.in/check-aadhaar-validity',
    requiredDocuments: [
      { name: 'पहचान का प्रमाण (Proof of Identity - POI)', isMandatory: true, specification: 'पैन कार्ड, पासपोर्ट, वोटर आईडी, ड्राइविंग लाइसेंस' },
      { name: 'पते का प्रमाण (Proof of Address - POA)', isMandatory: true, specification: 'बिजली बिल, राशन कार्ड, बैंक पासबुक, मूल निवास प्रमाण पत्र' }
    ],
    eligibility: [
      'कोई भी भारतीय नागरिक जिसका आधार बना है, 10 वर्ष पुराने आधार को मुफ्त में दस्तावेज अपडेट कर सकता है।'
    ],
    stepByStepGuide: [
      'myAadhaar पोर्टल (myaadhaar.uidai.gov.in) पर "Login with OTP" करें।',
      'पता बदलना हो तो "Address Update" -> "Update Address Online" पर क्लिक करें।',
      'नया पता अंग्रेजी व क्षेत्रीय भाषा में दर्ज करें और वैध POA दस्तावेज (जैसे मूल निवास या बिजली बिल) की फोटो अपलोड करें।',
      '₹50 का ऑनलाइन पेमेंट करें और SRN (Service Request Number) प्राप्त करें।',
      'PVC कार्ड मंगाना हो तो "Order Aadhaar PVC Card" पर क्लिक करें, ₹50 भुगतान करें, स्पीड पोस्ट से घर पहुंचेगा।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'UIDAI बैक-ऑफिस वेरिफिकेशन टीम',
      investigationOfficer: 'स्वचालित OCR व ऑपरेटर जांच',
      approvalAuthority: 'UIDAI क्षेत्रीय कार्यालय',
      processDetails: 'अपलोड किए गए सहायक दस्तावेज की सत्यता जांचने के बाद डेटाबेस में रिकॉर्ड अपडेट हो जाता है।'
    },
    rejectionReasons: [
      'अपलोड किए गए दस्तावेज में नाम व पता आधार से मेल न खाना।',
      'कागजात की प्रति कटी-फटी या अस्पष्ट होना।'
    ],
    downloadMethod: 'myAadhaar पोर्टल पर "Download Aadhaar" विकल्प से ई-आधार PDF डाउनलोड करें (पासवर्ड: नाम के पहले 4 अक्षर CAPITAL + जन्म वर्ष, उदा: AMIT1998)।',
    proTips: 'मोबाइल नंबर या बायोमेट्रिक (फिंगरप्रिंट/आंख) अपडेट करवाने के लिए किसी भी नजदीकी आधार सेवा केंद्र या डाकघर में स्वयं जाना अनिवार्य है।'
  },

  // ================= 4. PENSION SCHEMES (सरकारी पेंशन योजनाएं) =================
  {
    id: 'vridha-pension',
    category: 'pension',
    categoryLabel: 'सरकारी पेंशन योजनाएं',
    title: 'वृद्धावस्था पेंशन योजना (Old Age Pension Scheme - 60+ वर्ष)',
    shortCode: 'PEN-VRIDH',
    department: 'समाज कल्याण विभाग (Social Welfare Department - SSPMIS)',
    tagline: '60 वर्ष या उससे अधिक उम्र के वरिष्ठ नागरिकों को ₹400 से ₹1,000 प्रति माह सीधे बैंक खाते में',
    fee: '₹0 (बिल्कुल मुफ्त)',
    deliveryTime: '20 से 30 कार्य दिवस',
    officialPortalName: 'SSPMIS Bihar (sspmis.bihar.gov.in) / NSAP Portal',
    applyUrl: 'https://www.sspmis.bihar.gov.in',
    trackUrl: 'https://www.sspmis.bihar.gov.in/SearchStatus.aspx',
    requiredDocuments: [
      { name: 'आवेदक का आधार कार्ड', isMandatory: true, specification: 'उम्र 60 वर्ष या अधिक प्रमाणित होनी चाहिए' },
      { name: 'आधार सहमति व बैंक पासबुक (Aadhaar Seeded Bank Account)', isMandatory: true, specification: 'DBT/NPCI लिंक बैंक खाता' },
      { name: 'निवास प्रमाण पत्र / वोटर कार्ड', isMandatory: true, specification: 'राज्य का स्थायी निवासी' },
      { name: 'आवेदक का पासपोर्ट फोटो', isMandatory: true, specification: 'JPG < 50KB' },
      { name: 'आय प्रमाण पत्र / बीपीएल सूची या स्व-घोषणा', isMandatory: false, specification: 'गरीबी रेखा से नीचे या न्यूनतम आय' }
    ],
    eligibility: [
      'आवेदक की आयु न्यूनतम 60 वर्ष पूरी होनी चाहिए।',
      'आवेदक किसी अन्य सरकारी पेंशन का लाभ न ले रहा हो।',
      'बैंक खाता आधार से NPCI/DBT लिंक्ड होना अनिवार्य है।'
    ],
    stepByStepGuide: [
      'समाज कल्याण विभाग पोर्टल (sspmis.bihar.gov.in) पर जाएं।',
      '"Register for MVPY (मुख्यमंत्री वृद्धजन पेंशन योजना)" पर क्लिक करें।',
      'आधार सत्यापन हेतु: नाम (आधार अनुसार), जन्मतिथि व आधार नंबर डालकर "Validate Aadhaar" करें।',
      'सत्यापन के बाद फॉर्म खुलेगा: पिता/पति का नाम, पता, बैंक का नाम, IFSC कोड व खाता संख्या भरें।',
      'आधार कार्ड, पासबुक व फोटो की PDF/JPG अपलोड करें।',
      'सबमिट कर रसीद प्रिंट करें। पावती रसीद को अपने प्रखंड (Block) के आरटीपीएस काउंटर या सामाजिक सुरक्षा कोषांग में जमा कर सकते हैं।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'प्रखंड विकास पदाधिकारी (BDO) / सहायक निदेशक सामाजिक सुरक्षा',
      investigationOfficer: 'प्रखंड कार्यपालक सहायक व पंचायत सचिव',
      approvalAuthority: 'जिला सामाजिक सुरक्षा कोषांग (ADSS)',
      processDetails: 'बीडीओ द्वारा भौतिक सत्यापन व बैंक खाता सीडिंग की जांच के बाद स्वीकृति दी जाती है और PFMS द्वारा सीधे DBT से हर महीने पेंशन खाते में आती है।'
    },
    rejectionReasons: [
      'उम्र आधार कार्ड में 60 वर्ष से कम होना।',
      'बैंक खाता आधार से NPCI लिंक न होना (पेंशन रिजेक्ट/बाउंस हो जाती है)।',
      'नाम आधार और बैंक खाते में अलग-अलग होना।'
    ],
    downloadMethod: 'SSPMIS पोर्टल पर "Search Beneficiary Status" में जाकर खाता नंबर या आधार नंबर से भुगतान स्टेटस व स्वीकृति पत्र देख सकते हैं।',
    proTips: 'फॉर्म भरने से पहले अपने बैंक जाकर "Aadhaar NPCI Mapping Form" जरूर जमा कर लें ताकि पेंशन की पहली किस्त कभी न रुके।'
  },
  {
    id: 'vidhwa-pension',
    category: 'pension',
    categoryLabel: 'सरकारी पेंशन योजनाएं',
    title: 'विधवा / लक्ष्मीबाई सामाजिक सुरक्षा पेंशन योजना',
    shortCode: 'PEN-VIDH',
    department: 'समाज कल्याण विभाग',
    tagline: 'निराश्रित व विधवा महिलाओं को आर्थिक संबल हेतु ₹400 से ₹1,000 प्रति माह',
    fee: '₹0 (मुफ्त)',
    deliveryTime: '20 से 30 कार्य दिवस',
    officialPortalName: 'SSPMIS Social Security Portal',
    applyUrl: 'https://www.sspmis.bihar.gov.in',
    trackUrl: 'https://www.sspmis.bihar.gov.in/SearchStatus.aspx',
    requiredDocuments: [
      { name: 'पति का मृत्यु प्रमाण पत्र (Death Certificate)', isMandatory: true, specification: 'नगर निकाय या पंचायत से निर्गत' },
      { name: 'महिला का आधार कार्ड व पासपोर्ट फोटो', isMandatory: true, specification: 'पहचान व उम्र प्रमाण' },
      { name: 'बैंक पासबुक (DBT सक्रिय)', isMandatory: true, specification: 'महिला के नाम का एकल खाता' },
      { name: 'निवास व आय प्रमाण पत्र (वार्षिक आय ₹60,000 से कम)', isMandatory: true, specification: 'अंचल स्तर से' },
      { name: 'बीपीएल राशन कार्ड (यदि उपलब्ध हो)', isMandatory: false, specification: 'सहायक दस्तावेज' }
    ],
    eligibility: [
      'महिला की आयु 18 वर्ष से अधिक हो और पति की मृत्यु हो चुकी हो।',
      'आवेदिका ने पुनर्विवाह न किया हो और परिवार की वार्षिक आय ₹60,000 से कम हो।'
    ],
    stepByStepGuide: [
      'SSPMIS या RTPS पोर्टल पर "लक्ष्मीबाई सामाजिक सुरक्षा पेंशन / विधवा पेंशन" चुनें।',
      'आवेदिका का आधार सत्यापन करें।',
      'पति की मृत्यु की तिथि व मृत्यु प्रमाण पत्र संख्या भरें।',
      'बैंक विवरण, आय व पता दर्ज कर मृत्यु प्रमाण पत्र व पासबुक अपलोड करें और सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'प्रखंड विकास पदाधिकारी (BDO)',
      investigationOfficer: 'पंचायत सचिव / महिला पर्यवेक्षिका',
      approvalAuthority: 'सहायक निदेशक (सामाजिक सुरक्षा)',
      processDetails: 'मृत्यु प्रमाण पत्र व पारिवारिक स्थिति की जांच के बाद पेंशन स्वीकृत होती है।'
    },
    rejectionReasons: [
      'पति का वैध मृत्यु प्रमाण पत्र संलग्न न होना।',
      'बैंक खाता आधार से लिंक न होना।'
    ],
    downloadMethod: 'पोर्टल से स्वीकृति पत्र व पेंशनर पासबुक स्टेटस डाउनलोड करें।',
    proTips: 'यदि पति की मृत्यु अस्पताल में हुई थी तो अस्पताल की पर्ची के साथ पंचायत/नगर निगम से रजिस्टर्ड डेथ सर्टिफिकेट जरूर बनवाएं।'
  },
  {
    id: 'divyang-pension',
    category: 'pension',
    categoryLabel: 'सरकारी पेंशन योजनाएं',
    title: 'दिव्यांगजन पेंशन योजना व UDID कार्ड (Disability Pension & UDID)',
    shortCode: 'PEN-DIVY',
    department: 'दिव्यांगजन सशक्तिकरण विभाग / समाज कल्याण',
    tagline: '40% या अधिक दिव्यांगता वाले नागरिकों को पेंशन, मुफ्त उपकरण व स्वावलंबन कार्ड',
    fee: '₹0 (मुफ्त)',
    deliveryTime: '15 से 30 कार्य दिवस',
    officialPortalName: 'UDID Portal (swavlambancard.gov.in) & SSPMIS',
    applyUrl: 'https://www.swavlambancard.gov.in',
    trackUrl: 'https://www.swavlambancard.gov.in/track-application',
    requiredDocuments: [
      { name: 'दिव्यांगता प्रमाण पत्र / सिविल सर्जन मेडिकल सर्टिफिकेट (Disability Cert)', isMandatory: true, specification: 'न्यूनतम 40% दिव्यांगता प्रमाणित' },
      { name: 'दिव्यांगता दर्शाती हुई पूरी फोटो', isMandatory: true, specification: 'Full Body Photograph (JPG)' },
      { name: 'आधार कार्ड व निवास प्रमाण पत्र', isMandatory: true, specification: 'PDF/JPG' },
      { name: 'बैंक पासबुक', isMandatory: true, specification: 'DBT Enabled Account' }
    ],
    eligibility: [
      'सदर अस्पताल मेडिकल बोर्ड या सिविल सर्जन द्वारा कम से कम 40% दिव्यांगता का प्रमाण पत्र जारी हो।',
      'आयु की कोई न्यूनतम सीमा नहीं (शिशु से वृद्ध तक पात्र)।'
    ],
    stepByStepGuide: [
      'पहले UDID कार्ड हेतु स्वावलंबन पोर्टल (swavlambancard.gov.in) पर "Apply for Disability Certificate & UDID Card" पर जाएं।',
      'व्यक्तिगत जानकारी, दिव्यांगता का प्रकार (दृष्टिबाधित, मूक-बधिर, अस्थि दिव्यांग आदि) भरें।',
      'अस्पताल मेडिकल बोर्ड से जांच की तिथि मिलेगी। जांच के बाद डिजिटल UDID कार्ड जारी होगा।',
      'इसके बाद SSPMIS पोर्टल पर जाकर दिव्यांग पेंशन के लिए अप्लाई करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'सिविल सर्जन / मुख्य चिकित्सा पदाधिकारी व BDO',
      investigationOfficer: 'सदर अस्पताल मेडिकल बोर्ड डॉक्टर पैनल',
      approvalAuthority: 'जिला दिव्यांगजन सशक्तिकरण अधिकारी',
      processDetails: 'डॉक्टरों द्वारा दिव्यांगता प्रतिशत की पुष्टि के बाद UDID व पेंशन मंजूर की जाती है।'
    },
    rejectionReasons: [
      'दिव्यांगता प्रतिशत 40% से कम होना।',
      'मेडिकल सर्टिफिकेट वैध डॉक्टर बोर्ड द्वारा न होना।'
    ],
    downloadMethod: 'स्वावलंबन पोर्टल से e-UDID कार्ड PDF और SSPMIS से पेंशन स्वीकृति पत्र डाउनलोड करें।',
    proTips: 'UDID कार्ड बनने के बाद रेलवे में 75% तक की किराए में छूट और सरकारी नौकरियों में 4% आरक्षण का लाभ सीधे मिलता है।'
  },

  // ================= 5. SCHOLARSHIP SCHEMES (छात्रवृत्ति योजनाएं) =================
  {
    id: 'post-matric-scholarship',
    category: 'scholarship',
    categoryLabel: 'छात्रवृत्ति व शिक्षा योजनाएं',
    title: 'पोस्ट मैट्रिक छात्रवृत्ति योजना (Post-Matric Scholarship - 11th, 12th, BA, BSc, ITI, BTech)',
    shortCode: 'SCH-PMS',
    department: 'शिक्षा विभाग व पिछड़ा वर्ग कल्याण विभाग (pmsonline.bihar.gov.in / scholarships.gov.in)',
    tagline: 'मैट्रिक (10th) पास करने के बाद उच्च शिक्षा हेतु ₹2,000 से ₹1,00,000 तक की फीस प्रतिपूर्ति',
    fee: '₹0 (मुफ्त)',
    deliveryTime: 'सत्र अनुसार 30 से 60 दिन',
    officialPortalName: 'PMS Bihar Portal & National Scholarship Portal (NSP)',
    applyUrl: 'https://pmsonline.bihar.gov.in',
    trackUrl: 'https://pmsonline.bihar.gov.in/pmsedu/(S(j4h5u5f43))/StudentStatus.aspx',
    requiredDocuments: [
      { name: 'मैट्रिक (10th) एवं अंतिम उत्तीर्ण परीक्षा की मार्कशीट', isMandatory: true, specification: 'PDF < 400KB' },
      { name: 'कॉलेज का बोनाफाइड सर्टिफिकेट (Bonafide Certificate)', isMandatory: true, specification: 'संस्थान के लेटरहेड पर प्रिंसिपल के हस्ताक्षर व मुहर सहित' },
      { name: 'कॉलेज फीस रसीद (Fee Receipt)', isMandatory: true, specification: 'सत्र की वास्तविक फीस विवरण' },
      { name: 'जाति प्रमाण पत्र (Caste Certificate)', isMandatory: true, specification: 'SC/ST/EBC/BC' },
      { name: 'निवास प्रमाण पत्र (Residential Certificate)', isMandatory: true, specification: 'अंचल स्तर से' },
      { name: 'आय प्रमाण पत्र (वार्षिक आय ₹2.5 लाख से कम/₹3 लाख)', isMandatory: true, specification: 'चालू वित्तीय वर्ष का' },
      { name: 'बैंक पासबुक (छात्र के नाम का DBT खाता)', isMandatory: true, specification: 'NPCI Seeded' }
    ],
    eligibility: [
      'छात्र 10वीं कक्षा उत्तीर्ण कर 11वीं, 12वीं, आईटीआई, पॉलिटेक्निक, स्नातक (BA/BSc/BCom), इंजीनियरिंग, मेडिकल या अन्य उच्च कोर्स में नियमित नामांकित हो।',
      'छात्र SC, ST, EBC या BC वर्ग का हो और परिवार की वार्षिक आय निर्धारित सीमा के अंदर हो।'
    ],
    stepByStepGuide: [
      'PMS पोर्टल (pmsonline.bihar.gov.in) पर जाएं और अपनी श्रेणी (SC/ST या BC/EBC) चुनें।',
      '"Student Registration" पर क्लिक करें और आधार, मोबाइल व ईमेल OTP से खाता बनाएं।',
      'लॉगिन कर व्यक्तिगत विवरण, जाति, आय व निवास प्रमाण पत्र के नंबर डालकर सत्यापित करें।',
      '"Apply for Scholarship" पर क्लिक करें: कॉलेज का नाम, कोर्स का नाम, एडमिशन नंबर व रोल नंबर भरें।',
      'बोनाफाइड सर्टिफिकेट व फीस स्ट्रक्चर अपलोड करें और फॉर्म को फाइनल सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'जिला शिक्षा पदाधिकारी (DPO) व छात्रवृत्ति नोडल अधिकारी',
      investigationOfficer: 'संस्थान नोडल अधिकारी (Institute Nodal Officer) व भौतिक सत्यापन टीम',
      approvalAuthority: 'राज्य स्तर छात्रवृत्ति समिति (State DPO)',
      processDetails: '1. कॉलेज द्वारा छात्र के नामांकन का ऑनलाइन सत्यापन (Institute Verification).\n2. जिला कार्यक्रम पदाधिकारी (DPO) द्वारा प्रमाणपत्रों की जांच.\n3. राज्य स्तर से PFMS के जरिए सीधे बैंक खाते में राशि का अंतरण।'
    },
    rejectionReasons: [
      'बोनाफाइड सर्टिफिकेट पर कॉलेज प्रिंसिपल का मुहर/हस्ताक्षर न होना।',
      'आय प्रमाण पत्र पुराना (Expired) होना।',
      'बैंक खाता आधार से NPCI मैप न होना।'
    ],
    downloadMethod: 'पोर्टल पर लॉगिन कर Application Summary व रसीद PDF डाउनलोड करें।',
    proTips: 'फॉर्म सबमिट करने के बाद रसीद व सभी दस्तावेजों की एक प्रति अपने कॉलेज के स्कॉलरशिप काउंटर पर अवश्य जमा करें।'
  },
  {
    id: 'kanya-utthan-scholarship',
    category: 'scholarship',
    categoryLabel: 'छात्रवृत्ति व शिक्षा योजनाएं',
    title: 'मुख्यमंत्री कन्या उत्थान योजना (12th Pass ₹25,000 व Graduation Pass ₹50,000)',
    shortCode: 'SCH-KANYA',
    department: 'शिक्षा विभाग (Medhasoft Portal - medhasoft.bih.nic.in)',
    tagline: 'इंटरमीडिएट पास अविवाहित छात्राओं को ₹25,000 और स्नातक पास छात्राओं को ₹50,000 की प्रोत्साहन राशि',
    fee: '₹0 (मुफ्त)',
    deliveryTime: '30 से 45 कार्य दिवस',
    officialPortalName: 'Medhasoft Portal (medhasoft.bih.nic.in)',
    applyUrl: 'https://medhasoft.bih.nic.in',
    trackUrl: 'https://medhasoft.bih.nic.in/Inter2024/StudentStatus.aspx',
    requiredDocuments: [
      { name: '12वीं (इंटर) या ग्रेजुएशन का एडमिट कार्ड व मार्कशीट', isMandatory: true, specification: 'रोल कोड, रोल नंबर व कुल प्राप्तांक' },
      { name: 'छात्रा का आधार कार्ड', isMandatory: true, specification: 'नाम मार्कशीट के अनुसार होना चाहिए' },
      { name: 'छात्रा के नाम का बैंक पासबुक (बिहार में स्थित बैंक)', isMandatory: true, specification: 'DBT Enabled' },
      { name: 'निवास प्रमाण पत्र (Residential Certificate)', isMandatory: true, specification: 'बिहार का स्थायी निवासी' },
      { name: 'अविवाहित होने का स्व-घोषणा (12वीं हेतु)', isMandatory: true, specification: 'पोर्टल चेकबॉक्स' }
    ],
    eligibility: [
      'छात्रा बिहार राज्य के किसी मान्यता प्राप्त बोर्ड/विश्वविद्यालय से प्रथम/द्वितीय श्रेणी में 12वीं अथवा स्नातक उत्तीर्ण हो।',
      'इंटर पास छात्रा अविवाहित होनी चाहिए (स्नातक में विवाहित व अविवाहित दोनों पात्र)।'
    ],
    stepByStepGuide: [
      'Medhasoft पोर्टल (medhasoft.bih.nic.in) पर "मुख्यमंत्री कन्या उत्थान योजना" चुनें।',
      '"Student Registration" पर क्लिक करें और नियम स्वीकार करें।',
      'रोल कोड, रोल नंबर, प्राप्तांक, जन्मतिथि व 12वीं मार्कशीट अनुसार नाम दर्ज करें।',
      'आधार नंबर व मोबाइल नंबर OTP से सत्यापित करें और बैंक खाता नंबर भरें।',
      'डिपार्टमेंट वेरिफिकेशन के बाद यूजर आईडी और पासवर्ड मोबाइल पर SMS से आएगा।',
      'SMS आने पर लॉगिन कर "Finalize Application" करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'शिक्षा विभाग संयुक्त सचिव व उप-निदेशक',
      investigationOfficer: 'बिहार विद्यालय परीक्षा समिति (BSEB) डेटाबेस व बैंक PFMS',
      approvalAuthority: 'राज्य ट्रेजरी विभाग',
      processDetails: 'बोर्ड के रिजल्ट डेटा से स्वचालित मिलान और बैंक खाता सत्यापन के बाद एकमुश्त ₹25,000 या ₹50,000 की राशि खाते में भेजी जाती है।'
    },
    rejectionReasons: [
      'आधार कार्ड और 12वीं मार्कशीट में नाम या जन्मतिथि की स्पेलिंग अलग होना।',
      'संयुक्त (Joint) बैंक खाता दर्ज करना (केवल छात्रा का एकल खाता मान्य है)।'
    ],
    downloadMethod: 'Medhasoft पोर्टल पर Student Status Tracker से पेमेंट स्टेटस देख व रसीद निकाल सकते हैं।',
    proTips: 'यदि आधार और मार्कशीट में नाम अलग है तो पहले आधार कार्ड में सुधार करवा लें, तभी रजिस्ट्रेशन करें।'
  },

  // ================= 6. ALL GOVT FREE WELFARE SCHEMES =================
  {
    id: 'ayushman-card',
    category: 'schemes',
    categoryLabel: 'मुफ्त जन कल्याणकारी योजनाएं',
    title: 'आयुष्मान भारत कार्ड (Ayushman Card - ₹5 लाख मुफ्त इलाज व ABHA ID)',
    shortCode: 'GOV-AYUSH',
    department: 'राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA - beneficiary.nha.gov.in)',
    tagline: 'देश के किसी भी सरकारी व निजी अस्पताल में प्रति वर्ष ₹5,00,000 तक का कैशलेस व मुफ्त इलाज',
    fee: '₹0 (बिल्कुल मुफ्त 100% Free)',
    deliveryTime: 'तत्काल eKYC के 15 मिनट बाद डाउनलोड',
    officialPortalName: 'Beneficiary NHA Portal / Ayushman App',
    applyUrl: 'https://beneficiary.nha.gov.in',
    trackUrl: 'https://beneficiary.nha.gov.in',
    requiredDocuments: [
      { name: 'राशन कार्ड (Ration Card) अथवा PMJAY फैमिली आईडी', isMandatory: true, specification: 'जिसमें परिवार के सदस्यों के नाम दर्ज हों' },
      { name: 'आधार कार्ड (Aadhaar Card)', isMandatory: true, specification: 'OTP या फिंगरप्रिंट/Face Auth हेतु' },
      { name: 'मोबाइल नंबर', isMandatory: true, specification: 'OTP सत्यापन' }
    ],
    eligibility: [
      'SECC 2011 डेटा में नाम शामिल परिवार, अथवा NFSA राष्ट्रीय खाद्य सुरक्षा राशन कार्ड धारक परिवार।',
      '70 वर्ष या उससे अधिक उम्र के सभी वरिष्ठ नागरिक (Ayushman Vay Vandana योजना के तहत बिना आय सीमा के ₹5 लाख मुफ्त इलाज हेतु पात्र)।'
    ],
    stepByStepGuide: [
      'Beneficiary NHA पोर्टल (beneficiary.nha.gov.in) पर जाएं या "Ayushman App" फोन में डाउनलोड करें।',
      '"Beneficiary" विकल्प चुनें, मोबाइल नंबर डालें और OTP से लॉगिन करें।',
      'राज्य चुनें (उदा: Bihar / UP), स्कीम चुनें (PMJAY), जिला चुनें और "Search By" में "Ration Card / Family ID" या "Aadhaar" चुनें।',
      'राशन कार्ड नंबर डालते ही पूरे परिवार की सूची आ जाएगी।',
      'जिस सदस्य का कार्ड नहीं बना है, उसके नाम के आगे "e-KYC (Aadhaar OTP / Face RD)" पर क्लिक करें।',
      'लाइव फोटो खींचें और आधार OTP दर्ज करें।',
      'e-KYC 100% मैच होते ही तुरंत "Approved" हो जाएगा और आप "Download Card" पर क्लिक कर हाई-क्वालिटी गोल्डन कार्ड PDF प्राप्त कर सकते हैं।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'स्टेट हेल्थ एजेंसी (SHA) व NHA',
      investigationOfficer: 'स्वचालित आधार eKYC व राशन कार्ड डेटाबेस',
      approvalAuthority: 'राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA)',
      processDetails: 'आधार बायोमेट्रिक व राशन डेटा का स्वतः मिलान होने पर तत्काल अनुमोदन मिलता है।'
    },
    rejectionReasons: [
      'राशन कार्ड में नाम और आधार कार्ड के नाम में बहुत अधिक अंतर होना।',
      'eKYC के समय लाइव फोटो साफ न आना।'
    ],
    downloadMethod: 'Beneficiary पोर्टल या Ayushman App से सीधे ओरिजिनल प्लास्टिक-स्टाइल PDF कार्ड डाउनलोड करें।',
    proTips: '70 वर्ष से अधिक उम्र के बुजुर्गों के लिए अलग से ₹5 लाख का टॉप-अप आयुष्मान कार्ड बनता है, भले ही वे किसी भी आय वर्ग के हों।'
  },
  {
    id: 'free-ration-card',
    category: 'schemes',
    categoryLabel: 'मुफ्त जन कल्याणकारी योजनाएं',
    title: 'नया राशन कार्ड ऑनलाइन आवेदन व नाम जोड़ना (Free Ration Card - NFSA)',
    shortCode: 'GOV-RAT',
    department: 'खाद्य एवं उपभोक्ता संरक्षण विभाग (epds.bihar.gov.in / nfsa.gov.in)',
    tagline: 'मुफ्त 5 किलो अनाज प्रति यूनिट, नए सदस्य का नाम जोड़ना व डिजिटल राशन कार्ड डाउनलोड',
    fee: '₹0 (सरकारी शुल्क शून्य)',
    deliveryTime: '25 से 40 कार्य दिवस',
    officialPortalName: 'RCMS EPDS Portal / NFSA Portal',
    applyUrl: 'http://epds.bihar.gov.in',
    trackUrl: 'http://epds.bihar.gov.in/RCMS/TrackApplicationStatus.aspx',
    requiredDocuments: [
      { name: 'परिवार की महिला मुखिया का आधार कार्ड व बैंक पासबुक', isMandatory: true, specification: 'महिला मुखिया के नाम से राशन कार्ड' },
      { name: 'परिवार के सभी सदस्यों का आधार कार्ड', isMandatory: true, specification: 'नाम जोड़ने हेतु' },
      { name: 'संयुक्त पारिवारिक फोटो (Joint Family Photo)', isMandatory: true, specification: 'सभी सदस्यों की एक साथ फोटो (JPG < 100KB)' },
      { name: 'निवास व आय प्रमाण पत्र', isMandatory: true, specification: 'अंचल स्तर से निर्गत' },
      { name: 'स्व-घोषणा पत्र व विकलांगता/जाति प्रमाण (यदि लागू हो)', isMandatory: false, specification: 'आरक्षण व प्राथमिकता हेतु' }
    ],
    eligibility: [
      'परिवार में कोई भी सदस्य पक्का 4 कमरों का मकान, चार पहिया वाहन या सरकारी सेवा में न हो।',
      'परिवार की मासिक आय ₹10,000 से कम हो।'
    ],
    stepByStepGuide: [
      'EPDS पोर्टल (epds.bihar.gov.in) पर "Apply for Online RC" पर जाएं।',
      'सिटिजन रजिस्ट्रेशन करें (मोबाइल नंबर व आधार द्वारा)।',
      'महिला मुखिया का विवरण, वैवाहिक स्थिति, व्यवसाय व बैंक खाता दर्ज करें।',
      '"Add Member" पर क्लिक कर परिवार के सभी बच्चों व सदस्यों के आधार व उम्र जोड़ें।',
      'संयुक्त फोटो, सभी आधार की संयुक्त PDF, निवास व आय प्रमाण पत्र अपलोड करें।',
      'फाइनल सबमिट कर आवेदन रसीद (Application Form Summary) प्राप्त करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'प्रखंड आपूर्ति पदाधिकारी (Block Supply Officer - BSO) / SDO',
      investigationOfficer: 'आपूर्ति निरीक्षक व पंचायत स्तर पर भौतिक सत्यापन',
      approvalAuthority: 'अनुमंडल पदाधिकारी (Sub-Divisional Officer - SDO)',
      processDetails: 'BSO द्वारा परिवार की आर्थिक स्थिति व घर का भौतिक सत्यापन कर रिपोर्ट SDO को भेजी जाती है। SDO अनुमोदन के बाद नया राशन कार्ड नंबर जारी होता है।'
    },
    rejectionReasons: [
      'किसी सदस्य का नाम पहले से किसी दूसरे राशन कार्ड में दर्ज होना।',
      'आय सीमा से अधिक होना या चार पहिया वाहन होना।'
    ],
    downloadMethod: 'RCMS पोर्टल पर जिला व ब्लॉक चुनकर अपना नया डिजिटल राशन कार्ड देखें और प्रिंट करें। "Mera Ration" मोबाइल ऐप से भी तुरंत डाउनलोड हो जाता है।',
    proTips: 'शादी के बाद नई बहू का नाम पुराने मायके के राशन कार्ड से नाम कटवाने का प्रमाण पत्र (Surrender Certificate) लगाकर तुरंत ससुराल के कार्ड में जुड़ जाता है।'
  },
  {
    id: 'pm-kisan-yojana',
    category: 'schemes',
    categoryLabel: 'मुफ्त जन कल्याणकारी योजनाएं',
    title: 'प्रधानमंत्री किसान सम्मान निधि (PM Kisan - ₹6,000 प्रति वर्ष, eKYC व सुधार)',
    shortCode: 'GOV-PMKIS',
    department: 'कृषि एवं किसान कल्याण मंत्रालय (pmkisan.gov.in)',
    tagline: 'हर 4 महीने में ₹2,000 (सालाना ₹6,000) सीधे खाते में, लैंड सीडिंग व eKYC समाधान',
    fee: '₹0 (मुफ्त)',
    deliveryTime: 'नया आवेदन: 30 दिन | eKYC: तत्काल 2 मिनट',
    officialPortalName: 'PM Kisan Samman Nidhi Portal (pmkisan.gov.in)',
    applyUrl: 'https://pmkisan.gov.in',
    trackUrl: 'https://pmkisan.gov.in/BeneficiaryStatus_New.aspx',
    requiredDocuments: [
      { name: 'जमीन की अद्यतन रसीद / खतियान (Land Mutation / Jamabandi)', isMandatory: true, specification: 'आवेदक के नाम से जमीन की जमाबंदी' },
      { name: 'आधार कार्ड', isMandatory: true, specification: 'सक्रिय मोबाइल लिंक' },
      { name: 'बैंक पासबुक (Aadhaar NPCI DBT Linked)', isMandatory: true, specification: 'DBT सक्रिय' },
      { name: 'स्व-घोषणा पत्र', isMandatory: true, specification: 'पोर्टल चेकबॉक्स' }
    ],
    eligibility: [
      'किसान के नाम पर खेती योग्य जमीन की वैध जमाबंदी होनी चाहिए।',
      'परिवार में कोई सदस्य सरकारी नौकरी, सांसद, विधायक, डॉक्टर, वकील या ₹10,000+ पेंशनभोगी न हो।'
    ],
    stepByStepGuide: [
      'pmkisan.gov.in पर जाएं और Farmers Corner में "New Farmer Registration" चुनें।',
      'Rural (ग्रामीण) या Urban (शहरी) किसान चुनें, आधार नंबर व मोबाइल नंबर डालें।',
      'राज्य, जिला, ब्लॉक, गांव व अपनी श्रेणी चुनें।',
      'जमीन का विवरण डालें: खाता नंबर, खसरा (खेसरा) नंबर, जमीन का रकबा (हेक्टेयर में) और लैंड ट्रांसफर का विवरण।',
      'जमीन की रसीद की PDF अपलोड करें और सबमिट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'प्रखंड कृषि पदाधिकारी (BAO) व जिला कृषि पदाधिकारी (DAO)',
      investigationOfficer: 'कृषि समन्वयक (Kisan Coordinator) व राजस्व कर्मचारी (Land Seeding हेतु)',
      approvalAuthority: 'कृषि मंत्रालय भारत सरकार',
      processDetails: 'कृषि समन्वयक द्वारा जमीन और किसान का सत्यापन होता है। लैंड सीडिंग (Land Seeding: YES) और आधार बैंक सीडिंग (NPCI: YES) होते ही किस्तें शुरू हो जाती हैं।'
    },
    rejectionReasons: [
      'eKYC पूरा न होना (eKYC: NO).',
      'जमीन किसान के नाम न होकर पूर्वज के नाम होना (Land Seeding: NO).',
      'बैंक खाते में NPCI डी-लिंक होना (Payment Mode: Aadhaar न होना)।'
    ],
    downloadMethod: 'Know Your Status विकल्प में रजिस्ट्रेशन नंबर या मोबाइल नंबर डालकर पूरी किस्तों की हिस्ट्री व स्टेटस देख सकते हैं।',
    proTips: 'यदि किस्तें रुकी हुई हैं तो pmkisan.gov.in पर "e-KYC" पर जाकर 1 मिनट में आधार OTP से eKYC पूरा करें और बैंक जाकर NPCI लिंक कराएं।'
  },
  {
    id: 'pm-awas-yojana',
    category: 'schemes',
    categoryLabel: 'मुफ्त जन कल्याणकारी योजनाएं',
    title: 'प्रधानमंत्री आवास योजना (PMAY - ₹1.20 लाख से ₹2.50 लाख पक्का मकान अनुदान)',
    shortCode: 'GOV-PMAY',
    department: 'ग्रामीण विकास मंत्रालय / आवास एवं शहरी कार्य मंत्रालय (pmayg.nic.in)',
    tagline: 'कच्चे मकान या बेघर परिवारों को पक्का मकान बनाने हेतु 3 किस्तों में सीधी आर्थिक मदद',
    fee: '₹0 (बिल्कुल मुफ्त - किसी को कोई कमीशन न दें)',
    deliveryTime: 'सर्वेक्षण व सूची अनुसार',
    officialPortalName: 'PMAY-G Portal (pmayg.nic.in) / PMAY-U',
    applyUrl: 'https://pmayg.nic.in',
    trackUrl: 'https://rhreporting.nic.in/netiay/newruralpension/FtoStatus.aspx',
    requiredDocuments: [
      { name: 'आधार कार्ड (परिवार के सभी सदस्यों का)', isMandatory: true, specification: 'PDF/JPG' },
      { name: 'मनरेगा जॉब कार्ड (MGNREGA Job Card Number)', isMandatory: true, specification: '90-95 दिनों की मजदूरी हेतु' },
      { name: 'बैंक पासबुक (DBT Enabled)', isMandatory: true, specification: 'आधार से लिंक खाता' },
      { name: 'कच्चे मकान / जमीन की फोटो', isMandatory: true, specification: 'जियो-टैगिंग हेतु' },
      { name: 'शपथ पत्र (परिवार में किसी का पक्का मकान न होने का)', isMandatory: true, specification: 'प्रखंड फॉर्मेट' }
    ],
    eligibility: [
      'परिवार के पास देश में कहीं भी पक्का मकान न हो।',
      'परिवार में कोई दो पहिया/चार पहिया वाहन या 50,000+ का किसान क्रेडिट कार्ड न हो।',
      'SECC-2011 या आवास प्लस सर्वेक्षण (Awaas+) सूची में नाम शामिल हो।'
    ],
    stepByStepGuide: [
      'ग्रामीण आवास हेतु अपने ग्राम पंचायत के मुखिया, पंचायत सचिव या आवास सहायक से मिलें या "Awaas+ App" पर सर्वेक्षण में नाम दर्ज कराएं।',
      'आवास सहायक आपके कच्चे घर का स्थलीय निरीक्षण और जियो-टैगिंग (Geotagging) करेगा।',
      'नाम फाइनल प्रतीक्षा सूची (Priority List) में आते ही स्वीकृति पत्र जारी होता है।',
      'प्रथम किस्त (₹40,000-₹45,000) नींव (Plinth) निर्माण हेतु खाते में भेजी जाती है।',
      'द्वितीय किस्त (₹40,000-₹75,000) लिंटल स्तर पर और तृतीय किस्त छत ढलाई के बाद भेजी जाती है।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'प्रखंड विकास पदाधिकारी (BDO) व कार्यपालक अभियंता ग्रामीण आवास',
      investigationOfficer: 'ग्रामीण आवास सहायक व पंचायत तकनीकी सहायक (PTA)',
      approvalAuthority: 'उप विकास आयुक्त (DDC) / जिला परिषद',
      processDetails: 'प्रत्येक स्तर (नींव, खिड़की, छत) पर आवास सहायक द्वारा मोबाइल ऐप से जियो-टैग्ड फोटो अपलोड करने के बाद अगली किस्त का FTO (Fund Transfer Order) जारी होता है।'
    },
    rejectionReasons: [
      'पहले से पक्का मकान पाया जाना।',
      'जियो-टैगिंग फोटो में फर्जीवाड़ा होना।'
    ],
    downloadMethod: 'pmayg.nic.in पर "Stakeholders" -> "IAY/PMAYG Beneficiary" में अपना 7 अंकों का रजिस्ट्रेशन नंबर डालकर पूरी किस्त की स्थिति और मकान की फोटो देख सकते हैं।',
    proTips: 'PMAY के तहत घर बनने पर ₹1,20,000 के अलावा ₹12,000 स्वच्छ भारत मिशन से शौचालय हेतु और 90 दिनों की मजदूरी (लगभग ₹20,000) मनरेगा से अलग से मिलती है।'
  },
  {
    id: 'pm-vishwakarma',
    category: 'schemes',
    categoryLabel: 'मुफ्त जन कल्याणकारी योजनाएं',
    title: 'प्रधानमंत्री विश्वकर्मा योजना (PM Vishwakarma - ₹15,000 टूलकिट व ₹3 लाख आसान लोन)',
    shortCode: 'GOV-VISHW',
    department: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME - pmvishwakarma.gov.in)',
    tagline: '18 पारंपरिक कारीगरों (बढ़ई, लोहार, दर्जी, राजमिस्त्री, नाई, धोबी आदि) को मुफ्त ट्रेनिंग, ₹500/दिन स्टाइपेंड व टूलकिट',
    fee: '₹0 (मुफ्त ऑनलाइन रजिस्ट्रेशन)',
    deliveryTime: 'ट्रेनिंग शेड्यूल अनुसार 15 से 30 दिन',
    officialPortalName: 'PM Vishwakarma Portal (pmvishwakarma.gov.in)',
    applyUrl: 'https://pmvishwakarma.gov.in',
    trackUrl: 'https://pmvishwakarma.gov.in',
    requiredDocuments: [
      { name: 'आधार कार्ड व मोबाइल नंबर', isMandatory: true, specification: 'बायोमेट्रिक सत्यापन हेतु' },
      { name: 'बैंक पासबुक', isMandatory: true, specification: 'DBT Enabled' },
      { name: 'राशन कार्ड (परिवार का विवरण)', isMandatory: true, specification: 'एक परिवार से एक सदस्य' },
      { name: 'व्यवसाय/कला का अनुभव व कार्य फोटो', isMandatory: false, specification: '18 ट्रेड में से एक' }
    ],
    eligibility: [
      'कारीगर 18 पारंपरिक शिल्पों में से किसी एक में हाथों और औजारों से काम करता हो (जैसे: कारपेंटर, नाव निर्माता, लोहार, ताला बनाने वाले, सुनार, कुम्हार, मूर्तिकार, मोची, राजमिस्त्री, टोकरी/चटाई बुनकर, खिलौना निर्माता, नाई, मालाकार, धोबी, दर्जी, मछली पकड़ने का जाल निर्माता आदि)।',
      'आयु 18 वर्ष या उससे अधिक हो। परिवार में किसी के पास सरकारी नौकरी न हो।'
    ],
    stepByStepGuide: [
      'नजदीकी CSC (Common Service Center) पर जाएं या pmvishwakarma.gov.in पर जाएं।',
      'आधार और बायोमेट्रिक (फिंगरप्रिंट) से लॉगिन करें।',
      'व्यक्तिगत जानकारी, पारिवारिक विवरण (राशन कार्ड) और अपना पारंपरिक पेशा (Trade Name) चुनें।',
      'बैंक खाता संख्या भरें और क्रेडिट सहायता (Loan Requirement) चुनें।',
      'फॉर्म सबमिट करें और विश्वकर्मा डिजिटल आईडी कार्ड व सर्टिफिकेट जनरेट करें।'
    ],
    verificationWorkflow: {
      designatedOfficer: 'जिला उद्योग केंद्र (DIC) महाप्रबंधक व MSME नोडल',
      investigationOfficer: 'ग्राम पंचायत मुखिया / नगर निकाय कार्यपालक पदाधिकारी (Level 1) -> जिला कार्यान्वयन समिति (Level 2)',
      approvalAuthority: 'MSME भारत सरकार (Level 3)',
      processDetails: 'मुखिया/वार्ड पार्षद द्वारा स्थानीय कारीगर होने की पुष्टि के बाद 5-7 दिनों की बेसिक स्किल ट्रेनिंग मिलती है। ट्रेनिंग के दौरान ₹500 प्रतिदिन स्टाइपेंड मिलता है और ट्रेनिंग पूरी होते ही ₹15,000 का टूलकिट ई-वाउचर (E-Voucher) सीधे मोबाइल पर प्राप्त होता है।'
    },
    rejectionReasons: [
      'परिवार में एक से अधिक सदस्यों द्वारा आवेदन करना।',
      'पारंपरिक 18 शिल्पों से अलग काम होना।'
    ],
    downloadMethod: 'पोर्टल से PM Vishwakarma Certificate & Digital ID Card तुरंत डाउनलोड करें।',
    proTips: 'टूलकिट मिलने के बाद मात्र 5% ब्याज पर बिना किसी गारंटी के पहले ₹1 लाख (18 माह) और समय पर चुकाने पर ₹2 लाख (30 माह) का सरकारी बिजनेस लोन मिलता है।'
  }
];

export const STATE_PORTALS_LIST = [
  {
    state: 'बिहार (Bihar)',
    portalName: 'ServicePlus RTPS Bihar',
    url: 'https://serviceonline.bihar.gov.in',
    landPortal: 'https://biharbhumi.bihar.gov.in',
    description: 'जाति, आय, निवास, EWS, NCL, चरित्र, दाखिल खारिज, परिमार्जन, LPC व भू-लगान'
  },
  {
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    portalName: 'eDistrict UP & Bhulekh UP',
    url: 'https://edistrict.up.gov.in',
    landPortal: 'https://upbhulekh.gov.in',
    description: 'जाति, आय, निवास, खतौनी, वरासत, राशन कार्ड व पेंशन योजनाएं'
  },
  {
    state: 'मध्य प्रदेश (Madhya Pradesh)',
    portalName: 'MP e-District & MP Bhulekh',
    url: 'https://mpedistrict.gov.in',
    landPortal: 'https://mpbhulekh.gov.in',
    description: 'लोक सेवा गारंटी, मूल निवासी, आय, खसरा-खतौनी व लाड़ली बहना'
  },
  {
    state: 'राजस्थान (Rajasthan)',
    portalName: 'e-Mitra & Apna Khata',
    url: 'https://emitra.rajasthan.gov.in',
    landPortal: 'https://apnakhata.rajasthan.gov.in',
    description: 'जन सूचना पोर्टल, ई-मित्र सेवाएं, जमाबंदी व सामाजिक सुरक्षा पेंशन'
  },
  {
    state: 'झारखण्ड (Jharkhand)',
    portalName: 'JharSewa & Jharbhoomi',
    url: 'https://jharsewa.jharkhand.gov.in',
    landPortal: 'https://jharbhoomi.jharkhand.gov.in',
    description: 'जाति, आवासीय, आय प्रमाण पत्र, दाखिल खारिज व लगान रसीद'
  },
  {
    state: 'हरियाणा (Haryana)',
    portalName: 'SARAL Haryana & Jamabandi',
    url: 'https://saralharyana.gov.in',
    landPortal: 'https://jamabandi.nic.in',
    description: 'सरल पोर्टल, परिवार पहचान पत्र (PPP), नकल खतौनी व पेंशन'
  },
  {
    state: 'राष्ट्रीय पोर्टल (All India National)',
    portalName: 'National ServicePlus & MeriPehchan',
    url: 'https://serviceonline.gov.in',
    landPortal: 'https://bhunaksha.nic.in',
    description: 'अखिल भारतीय 36 राज्यों व केंद्र शासित प्रदेशों की 3,000+ डिजिटल सरकारी सेवाएं'
  }
];
