import { PlanCurriculum, CurriculumPage } from '../types';

export const plan01Curriculum: PlanCurriculum = {
  planId: 'plan-01',
  planNumber: 1,
  planName: 'Bal Vikas Access (NCERT Class 1-5 Foundation)',
  totalCurriculumPages: 6,
  subjectsAvailable: ['हिंदी भाषा (Hindi)', 'Mathematics (गणित)', 'English & Phonics', 'EVS / पर्यावरण', 'सुलेख एवं अभ्यास'],
  targetAudience: 'कक्षा 1 से 5 के विद्यार्थी, अभिभावक एवं प्राथमिक शिक्षक',
  overviewSummary: 'NCERT पाठ्यक्रम पर आधारित संपूर्ण फाउंडेशन किट, जिसमें अक्षर-ज्ञान, मात्राएं, गणितीय गणनाएं, दैनिक बोलचाल के अंग्रेजी शब्द और पर्यावरण अध्ययन शामिल हैं।',
  curriculumPages: [
    {
      id: 'p01-page-1',
      pageNumber: 1,
      titleHindi: 'पेज 01: हिंदी वर्णमाला, स्वर (अ से अः) एवं सचित्र ध्वनि',
      titleEnglish: 'Hindi Vowels & Phonics Master Foundation',
      subject: 'हिंदी भाषा (Hindi)',
      gradeOrLevel: 'NCERT Class 1-2',
      badge: 'अक्षर ज्ञान',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'A vibrant educational illustration of Hindi alphabet letters glowing gently on an open textbook with fruits like pomegranate and mango, photorealistic, 8k resolution, classroom light --ar 4:3',
      conceptOverview: {
        hindi: 'हिंदी वर्णमाला में कुल 11 मुख्य स्वर और 2 अयोगवाह (अं, अः) होते हैं। स्वर वे ध्वनियां हैं जिनका उच्चारण बिना किसी अन्य ध्वनि की सहायता के स्वतंत्र रूप से किया जाता है।',
        english: 'Hindi Vowels (Swar) are the independent phonetic foundational units. Understanding these sounds is the prerequisite for reading, writing, and pronouncing Hindi words correctly.'
      },
      realWorldExamples: [
        {
          title: 'अनार (Pomegranate) से "अ"',
          description: 'अ से अनार: लाल-लाल दानों वाला फल जो सेहत बनाता है और हीमोग्लोबिन बढ़ाता है।',
          practicalApplication: 'बाजार में फल खरीदते समय बच्चे फल के नाम का पहला अक्षर पहचानते हैं।'
        },
        {
          title: 'आम (Mango) से "आ"',
          description: 'आ से आम: फलों का राजा, जो गर्मियों में मिलता है और ऊर्जा देता है।',
          practicalApplication: 'स्वाद और मौसम की पहचान के साथ अक्षर ध्वनि को जोड़ना।'
        },
        {
          title: 'इमली (Tamarind) से "इ"',
          description: 'इ से इमली: खट्टी-मीठी चटनी और सांभर में काम आने वाली प्राकृतिक औषधि।',
          practicalApplication: 'रसोई में मसालों और स्वादों के माध्यम से भाषा सीखना।'
        }
      ],
      keyFactsAndRules: [
        'स्वर स्वतंत्र ध्वनियां हैं जिन्हें बिना व्यंजन की सहायता के बोला जाता है।',
        'ह्रस्व स्वर (कम समय): अ, इ, उ, ऋ',
        'दीर्घ स्वर (दोगुना समय): आ, ई, ऊ, ए, ऐ, ओ, औ',
        'अयोगवाह: अं (अनुस्वार) और अः (विसर्ग)'
      ],
      vocabularyOrFormulas: [
        { term: 'अ (A)', definition: 'पहला स्वर, अ से अनार / अमरूद', example: 'अ + म + न = अमन' },
        { term: 'आ (Aa)', definition: 'दीर्घ स्वर, मात्रा (ा) के रूप में प्रयुक्त', example: 'आ + म = आम, क + ा + म = काम' },
        { term: 'इ (I)', definition: 'छोटी इ, ह्रस्व स्वर, मात्रा (ि)', example: 'द + ि + न = दिन' },
        { term: 'ई (Ee)', definition: 'बड़ी ई, दीर्घ स्वर, मात्रा (ी)', example: 'प + ा + न + ी = पानी' }
      ],
      assessmentTasks: [
        {
          id: 'p01-t1',
          type: 'mcq',
          question: 'हिंदी वर्णमाला में "ह्रस्व स्वर" (कम समय में बोले जाने वाले) कौन-से हैं?',
          options: ['आ, ई, ऊ', 'अ, इ, उ, ऋ', 'ए, ऐ, ओ, औ', 'अं, अः'],
          correctAnswer: 'अ, इ, उ, ऋ',
          explanation: 'अ, इ, उ, ऋ के उच्चारण में सबसे कम समय (एक मात्रा का काल) लगता है, इसलिए इन्हें ह्रस्व स्वर कहते हैं।'
        },
        {
          id: 'p01-t2',
          type: 'activity',
          question: 'दैनिक अभ्यास कार्य (Writing Challenge):',
          practicalTask: 'अपनी कॉपी में सभी 13 स्वर (अ से अः) सुंदर 4-लाइन लिखावट में लिखें और प्रत्येक स्वर से शुरू होने वाले 2-2 घरेलू वस्तुओं के नाम ढूंढें।'
        },
        {
          id: 'p01-t3',
          type: 'challenge',
          question: 'तार्किक पहेली: "दिन" और "दीन" में क्या अंतर है? मात्रा बदलने से अर्थ कैसे बदला?',
          explanation: 'छोटी "इ" की मात्रा से "दिन" का अर्थ "दिवस / Day" है, जबकि बड़ी "ई" की मात्रा से "दीन" का अर्थ "गरीब / असहाय" हो जाता है।'
        }
      ]
    },
    {
      id: 'p01-page-2',
      pageNumber: 2,
      titleHindi: 'पेज 02: प्राथमिक गणित - संख्या बोध (1 से 100) व स्थानीय मान (Place Value)',
      titleEnglish: 'Number Sense, Place Value & Practical Counting',
      subject: 'Mathematics (गणित)',
      gradeOrLevel: 'NCERT Class 1-3',
      badge: 'गणित फाउंडेशन',
      imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Bright colorful wooden abacus and counting blocks on a child desk with Indian currency coins, studio lighting, hyper realistic educational textbook photo --ar 4:3',
      conceptOverview: {
        hindi: 'संख्याएं वस्तुओं को गिनने और तौलने का माध्यम हैं। किसी भी संख्या में अंक का मान उसके स्थान (इकाई, दहाई, सैकड़ा) पर निर्भर करता है, जिसे स्थानीय मान (Place Value) कहते हैं।',
        english: 'Numbers quantify our world. In the decimal system, the value of a digit is determined by its position (Ones, Tens, Hundreds).'
      },
      realWorldExamples: [
        {
          title: 'दुकान से सामान खरीदना (Cash Handling)',
          description: '₹45 की कॉपी खरीदने के लिए ₹10 के 4 नोट (दहाई = 40) और ₹5 का 1 सिक्का (इकाई = 5) देना।',
          practicalApplication: 'दैनिक जीवन में नोटों और सिक्कों के जोड़ से स्थानीय मान समझना।'
        },
        {
          title: 'क्रिकेट मैच स्कोरबोर्ड',
          description: 'जब बल्लेबाज 78 रन बनाता है, तो 7 दहाई (70) और 8 इकाई (8) मिलकर 78 बनते हैं।',
          practicalApplication: 'खेल और खेलों के आंकड़ों में दो अंकों की संख्याओं का विखंडन।'
        }
      ],
      keyFactsAndRules: [
        'इकाई (Ones): 1 से 9 तक के अंक (1 का गुणक)',
        'दहाई (Tens): 10 से 90 तक (10 का गुणक)',
        'सैकड़ा (Hundreds): 100 से 900 तक (100 का गुणक)',
        'किसी भी संख्या का प्रसारित रूप (Expanded Form): 348 = 300 + 40 + 8'
      ],
      vocabularyOrFormulas: [
        { term: 'स्थानीय मान (Place Value)', definition: 'स्थान के अनुसार अंक का वास्तविक मूल्य', example: '57 में 5 का स्थानीय मान = 50' },
        { term: 'अंकित मान (Face Value)', definition: 'अंक का अपना स्वतंत्र मान जो कभी नहीं बदलता', example: '57 में 5 का अंकित मान = 5' },
        { term: 'सम संख्या (Even)', definition: 'जो 2 से पूर्णतः विभाजित हो जाए (0, 2, 4, 6, 8 पर समाप्त)', example: '12, 24, 38' },
        { term: 'विषम संख्या (Odd)', definition: 'जो 2 से विभाजित न हो (1, 3, 5, 7, 9 पर समाप्त)', example: '13, 25, 49' }
      ],
      assessmentTasks: [
        {
          id: 'p01-m1',
          type: 'mcq',
          question: 'संख्या 86 में अंक "8" का स्थानीय मान (Place Value) क्या है?',
          options: ['8', '80', '800', '16'],
          correctAnswer: '80',
          explanation: 'अंक 8 दहाई (Tens) के स्थान पर है, अतः 8 × 10 = 80।'
        },
        {
          id: 'p01-m2',
          type: 'activity',
          question: 'सिक्का गतिविधि (Coin Activity):',
          practicalTask: 'घर में ₹1, ₹2, ₹5 और ₹10 के सिक्कों से ₹37 और ₹64 बनाकर अपनी नोटबुक में तालिका बनाएं।'
        },
        {
          id: 'p01-m3',
          type: 'challenge',
          question: 'मस्तिष्क पहेली: दो अंकों की वह सबसे बड़ी संख्या कौन-सी है जिसके दोनों अंकों का जोड़ 9 हो?',
          explanation: '90 सबसे बड़ी दो अंकों की संख्या है (9 + 0 = 9)।'
        }
      ]
    },
    {
      id: 'p01-page-3',
      pageNumber: 3,
      titleHindi: 'पेज 03: English Phonics & Sight Words (A to Z Sound Matrix)',
      titleEnglish: 'A to Z Phonics, Word Blends & Daily Sight Vocabulary',
      subject: 'English & Phonics',
      gradeOrLevel: 'NCERT Class 1-3',
      badge: 'Phonics Matrix',
      imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Clean educational flatlay showing English alphabet wooden blocks spelling CAT and SUN with real apple and toy cat on a white table, macro photography, high depth of field --ar 4:3',
      conceptOverview: {
        hindi: 'फोनिक्स (Phonics) अक्षरों और उनकी ध्वनियों के बीच का संबंध है। अंग्रेजी में 26 अक्षर होते हैं जो मिलकर 44 अलग-अलग ध्वनियां (Sounds) उत्पन्न करते हैं।',
        english: 'Phonics bridges letters and sounds. Mastering short vowel CVC (Consonant-Vowel-Consonant) words empowers early learners to read fluently without rote memorization.'
      },
      realWorldExamples: [
        {
          title: 'Three Letter CVC Words',
          description: 'C-A-T (कैट / बिल्ली), S-U-N (सन / सूरज), P-E-N (पेन / कलम)',
          practicalApplication: 'ध्वनियों को जोड़कर (Blending) नए शब्दों को स्वतंत्र रूप से पढ़ना।'
        },
        {
          title: 'Daily Sight Words in Public Signs',
          description: 'STOP, GO, IN, OUT, PUSH, PULL, PLEASE, THANK YOU',
          practicalApplication: 'सड़क संकेतों और दुकानों के बोर्ड्स पर बिना हिचके अंग्रेजी पहचानना।'
        }
      ],
      keyFactsAndRules: [
        '5 Vowels: A, E, I, O, U create essential vocal sounds in every English word.',
        'Short "A" Sound as in /æ/ (Bat, Cat, Hat, Map)',
        'Short "O" Sound as in /ɒ/ (Pot, Hot, Box, Dog)',
        'Sight Words are high-frequency words recognized by instant sight.'
      ],
      vocabularyOrFormulas: [
        { term: 'A says /æ/', definition: 'Apple, Ant, Arrow', example: 'The ant is on the apple.' },
        { term: 'B says /b/', definition: 'Bat, Ball, Book', example: 'I read my story book.' },
        { term: 'C says /k/', definition: 'Cat, Cup, Car', example: 'A red cup on the mat.' },
        { term: 'D says /d/', definition: 'Dog, Door, Duck', example: 'Open the clean door.' }
      ],
      assessmentTasks: [
        {
          id: 'p01-e1',
          type: 'mcq',
          question: 'Which word has the short vowel sound of "A" (/æ/)?',
          options: ['Cake', 'Ball', 'Bat', 'Care'],
          correctAnswer: 'Bat',
          explanation: '"Bat" has the classic short-vowel sound /b-æ-t/ (CVC pattern).'
        },
        {
          id: 'p01-e2',
          type: 'activity',
          question: 'Rhyming Word Ladder:',
          practicalTask: 'Write down 4 words that rhyme with "PIN" (e.g., BIN, TIN, WIN, CHIN) and speak each aloud with phonics.'
        }
      ]
    },
    {
      id: 'p01-page-4',
      pageNumber: 4,
      titleHindi: 'पेज 04: पर्यावरण अध्ययन (EVS) - पेड़-पौधे, हमारे मित्र व पर्यावरण चक्र',
      titleEnglish: 'Our Living Environment, Plants & Nature Cycles',
      subject: 'EVS / पर्यावरण',
      gradeOrLevel: 'NCERT Class 3-5',
      badge: 'पर्यावरण एवं विज्ञान',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Close up cross-section diagram of a healthy green plant showing roots in rich soil, stem, green leaves absorbing sunlight, and flowers, realistic scientific textbook aesthetic --ar 4:3',
      conceptOverview: {
        hindi: 'पेड़-पौधे सजीव हैं जो सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड से अपना भोजन स्वयं बनाते हैं। इस प्रक्रिया को प्रकाश-संश्लेषण (Photosynthesis) कहा जाता है। वे हमें प्राणवायु ऑक्सीजन (O₂) देते हैं।',
        english: 'Plants are autotrophs that produce food through photosynthesis while purifying air by converting carbon dioxide into life-sustaining oxygen.'
      },
      realWorldExamples: [
        {
          title: 'तुलसी और नीम (औषधीय पौधे)',
          description: 'घरों में तुलसी की पत्तियां सर्दी-खांसी में काढ़े के रूप में और नीम दातून व कीटनाशक के रूप में काम आता है।',
          practicalApplication: 'घरेलू आयुर्वेद और प्राकृतिक उपचार की समझ।'
        },
        {
          title: 'बरगद और पीपल (ऑक्सीजन भंडार)',
          description: 'पीपल का पेड़ दिन-रात ऑक्सीजन देने में सहायक होता है और वातावरण को ठंडा रखता है।',
          practicalApplication: 'पर्यावरण संरक्षण और वृक्षारोपण का महत्व।'
        }
      ],
      keyFactsAndRules: [
        'पौधे के मुख्य 5 भाग: जड़ (Root), तना (Stem), पत्ती (Leaf), फूल (Flower), फल (Fruit)',
        'जड़ें मिट्टी से जल और खनिज लवण सोखती हैं और पौधे को मजबूती से थामे रखती हैं।',
        'पत्तियां "पौधे की रसोई" कहलाती हैं क्योंकि भोजन पत्तियों में क्लोरोफिल द्वारा बनता है।',
        'पौधे दिन में कार्बन डाइऑक्साइड लेते हैं और ऑक्सीजन छोड़ते हैं।'
      ],
      assessmentTasks: [
        {
          id: 'p01-evs1',
          type: 'mcq',
          question: 'पौधे की पत्तियां हरी किस वर्णक (Pigment) के कारण दिखाई देती हैं?',
          options: ['हीमोग्लोबिन', 'क्लोरोफिल (पर्णहरित)', 'मेलेनिन', 'कैरोटीन'],
          correctAnswer: 'क्लोरोफिल (पर्णहरित)',
          explanation: 'क्लोरोफिल सूर्य के प्रकाश को अवशोषित करता है और पत्तियों को हरा रंग प्रदान करता है।'
        },
        {
          id: 'p01-evs2',
          type: 'activity',
          question: 'प्रकृति डायरी कार्य:',
          practicalTask: 'अपने घर के पास 3 अलग-अलग पेड़ों की गिरी हुई पत्तियां इकट्ठा करें, उन्हें कॉपी में चिपकाएं और उनके नाम व उपयोग लिखें।'
        }
      ]
    },
    {
      id: 'p01-page-5',
      pageNumber: 5,
      titleHindi: 'पेज 05: पहाड़ा सारणी व गुणा-भाग की बुनियादी समझ (Tables 2 to 20)',
      titleEnglish: 'Multiplication Tables, Patterns & Division Logic',
      subject: 'Mathematics (गणित)',
      gradeOrLevel: 'NCERT Class 2-4',
      badge: 'पहाड़ा मास्टर',
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Neat educational chalkboard showing repeated addition of 4 apples grouped into 3 baskets totaling 12, crisp classroom lighting, sharp depth of field --ar 4:3',
      conceptOverview: {
        hindi: 'गुणा (Multiplication) वास्तव में एक ही संख्या को बार-बार जोड़ने (Repeated Addition) का संक्षिप्त और तीव्र तरीका है। जैसे 4 + 4 + 4 = 4 × 3 = 12।',
        english: 'Multiplication is fast repeated addition. Mastering patterns eliminates anxiety and boosts arithmetic speed in daily transactions.'
      },
      realWorldExamples: [
        {
          title: 'दुकान से 5 पेन खरीदना',
          description: 'यदि 1 पेन की कीमत ₹8 है, तो 5 पेनों की कीमत 8 + 8 + 8 + 8 + 8 = 8 × 5 = ₹40 होगी।',
          practicalApplication: 'मार्केट में बिलिंग और सामान की कुल कीमत तुरंत निकालना।'
        },
        {
          title: 'अंडे की ट्रे या चॉकलेट बॉक्स',
          description: 'एक ट्रे में 6 कतारें और प्रत्येक कतार में 5 खाने हैं, तो कुल 6 × 5 = 30 खाने होंगे।',
          practicalApplication: 'क्षेत्रफल और ग्रिड संरचना की बुनियादी समझ।'
        }
      ],
      keyFactsAndRules: [
        'किसी भी संख्या को 0 से गुणा करने पर परिणाम सदैव 0 होता है (n × 0 = 0)।',
        'किसी संख्या को 1 से गुणा करने पर वही संख्या रहती है (n × 1 = n)।',
        'क्रम बदलने से गुणनफल नहीं बदलता (Commutative Property): 6 × 7 = 7 × 6 = 42।',
        'भाग (Division) बार-बार घटाने की प्रक्रिया है: 20 ÷ 5 = 4।'
      ],
      assessmentTasks: [
        {
          id: 'p01-tb1',
          type: 'mcq',
          question: 'यदि 1 दर्ज़न केलों में 12 केले होते हैं, तो 6 दर्ज़न में कुल कितने केले होंगे?',
          options: ['60', '72', '66', '84'],
          correctAnswer: '72',
          explanation: '12 × 6 = 72 केले।'
        }
      ]
    },
    {
      id: 'p01-page-6',
      pageNumber: 6,
      titleHindi: 'पेज 06: नैतिक शिक्षा, स्वस्थ आदतें एवं नागरिक शिष्टाचार',
      titleEnglish: 'Moral Values, Hygiene & Citizen Etiquette',
      subject: 'सुलेख एवं अभ्यास',
      gradeOrLevel: 'NCERT Class 1-5',
      badge: 'जीवन मूल्य',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Indian school children in neat uniforms helping plant a sapling in school garden, smiling, bright morning sunshine, high dynamic range --ar 4:3',
      conceptOverview: {
        hindi: 'शिक्षा केवल अक्षर ज्ञान नहीं, बल्कि अच्छे संस्कार, स्वच्छता और दूसरों की मदद करने का स्वभाव है। सत्य बोलना, बड़ों का सम्मान करना और सार्वजनिक संपत्ति की रक्षा करना अच्छे नागरिक की पहचान है।',
        english: 'Character education instills cleanliness, empathy, honesty, and civic responsibility in young minds.'
      },
      realWorldExamples: [
        {
          title: 'स्वच्छ भारत और कचरा प्रबंधन',
          description: 'सूखा कचरा नीले कूड़ेदान में और गीला कचरा हरे कूड़ेदान में डालना।',
          practicalApplication: 'घर और मोहल्ले को स्वच्छ व रोगमुक्त रखना।'
        },
        {
          title: 'जादुई 3 शब्द (Magic Words)',
          description: 'कृपया (Please), धन्यवाद (Thank You), क्षमा करें (Sorry)',
          practicalApplication: 'विनम्र बातचीत और आपसी सद्भाव बढ़ाना।'
        }
      ],
      keyFactsAndRules: [
        'भोजन से पहले और शौच के बाद 20 सेकंड तक साबुन से हाथ धोना चाहिए।',
        'प्रतिदिन सुबह और रात को सोने से पहले दांत साफ (ब्रश) करने चाहिए।',
        'जल और बिजली का अपव्यय नहीं करना चाहिए।'
      ],
      assessmentTasks: [
        {
          id: 'p01-mrl1',
          type: 'activity',
          question: 'दैनिक 5 अच्छी आदतों की प्रतिज्ञा:',
          practicalTask: 'आज पूरे दिन में किसी एक साथी या बुजुर्ग की मदद करें और अपने अनुभव को 3 पंक्तियों में लिखें।'
        }
      ]
    }
  ]
};

export const plan02Curriculum: PlanCurriculum = {
  planId: 'plan-02',
  planNumber: 2,
  planName: 'Youth Skill Access (Job Tools & Modern AI)',
  totalCurriculumPages: 4,
  subjectsAvailable: ['ATS Resume Writing', 'AI Prompt Engineering', 'Job Interview Skills', 'Email & Workplace Communication'],
  targetAudience: 'कॉलेज छात्र, 10th/12th पास युवा, एवं शुरुआती जॉब अभ्यर्थी',
  overviewSummary: 'युवाओं को जॉब मार्केट में खड़ा करने के लिए आधुनिक ATS-फ्रेंडली रिज्यूम निर्माण, ChatGPT/Gemini AI टूल्स का व्यावहारिक उपयोग और कॉर्पोरेट ईमेल लेखन का संपूर्ण प्रशिक्षण।',
  curriculumPages: [
    {
      id: 'p02-page-1',
      pageNumber: 1,
      titleHindi: 'पेज 01: आधुनिक ATS-फ्रेंडली रिज्यूम एवं CV निर्माण गाइड',
      titleEnglish: 'ATS-Friendly Professional Resume & CV Architecture',
      subject: 'ATS Resume Writing',
      gradeOrLevel: 'Career Foundation',
      badge: 'जॉब टूल',
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Clean minimalist A4 resume paper on wooden office desk next to laptop, pen, and glasses, professional overhead shot --ar 4:3',
      conceptOverview: {
        hindi: 'ATS (Applicant Tracking System) एक ऐसा सॉफ्टवेयर है जो कंपनियों में आने वाले हजारों रिज्यूमे को कीवर्ड्स के आधार पर छांटता है। यदि रिज्यूम में सही कीवर्ड्स और स्पष्ट फॉर्मेट नहीं है, तो वह इंसानी आंखों तक पहुंचने से पहले ही रिजेक्ट हो जाता है।',
        english: 'Applicant Tracking Systems screen candidate resumes before human recruiters see them. Clean single-column formatting, standard headings, and relevant job keywords are non-negotiable.'
      },
      realWorldExamples: [
        {
          title: 'डेटा एंट्री / ऑफिस असिस्टेंट जॉब',
          description: 'रिज्यूम में "MS Excel, Speed 40 WPM, Billing, GST Filing, MIS Reporting" जैसे कीवर्ड्स शामिल करना।',
          practicalApplication: 'Naukri, Indeed और LinkedIn पर 5 गुना अधिक इंटरव्यू कॉल्स पाना।'
        }
      ],
      keyFactsAndRules: [
        'ग्राफिक्स, टेबल और जटिल आइकन का अत्यधिक उपयोग न करें, ATS इन्हें पढ़ नहीं पाता।',
        'स्टैंडर्ड फॉन्ट (Calibri, Arial, Inter) 10-12pt साइज में रखें।',
        'कार्य अनुभव को बुलेट पॉइंट्स में परिणाम के साथ लिखें (उदा. "Managed 50+ client records daily with 99% accuracy")।'
      ],
      assessmentTasks: [
        {
          id: 'p02-t1',
          type: 'mcq',
          question: 'ATS सॉफ्टवेयर में रिज्यूम रिजेक्ट होने का मुख्य कारण क्या होता है?',
          options: ['सादा टेक्स्ट होना', 'जटिल टेबल, कॉलम व आवश्यक कीवर्ड्स की कमी', 'फोन नंबर लिखा होना', '1 पेज का होना'],
          correctAnswer: 'जटिल टेबल, कॉलम व आवश्यक कीवर्ड्स की कमी',
          explanation: 'ATS बोट्स मल्टी-कॉलम और जटिल लेआउट को पार्स नहीं कर पाते।'
        }
      ]
    },
    {
      id: 'p02-page-2',
      pageNumber: 2,
      titleHindi: 'पेज 02: AI प्रॉम्प्ट इंजीनियरिंग - ChatGPT व Gemini से सही काम कराने की कला',
      titleEnglish: 'AI Prompt Engineering & Productive Automation',
      subject: 'AI Prompt Engineering',
      gradeOrLevel: 'Modern Tech Skill',
      badge: 'AI स्किल',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Futuristic glowing AI interface on laptop screen showing clean prompt formulas and code snippet, dark room ambient lighting --ar 4:3',
      conceptOverview: {
        hindi: 'AI प्रॉम्प्ट इंजीनियरिंग वह तकनीक है जिसके द्वारा हम AI मॉडल (जैसे Gemini, ChatGPT) को सटीक निर्देश (Role, Context, Task, Constraints, Output Format) देकर मनचाहा परिणाम निकालते हैं।',
        english: 'Prompt Engineering turns generic AI into an expert assistant using structured formulas: Role + Context + Instruction + Constraints + Output Format.'
      },
      realWorldExamples: [
        {
          title: 'जॉब एप्लीकेशन लेटर लिखवाना',
          description: 'प्रॉम्प्ट: "Act as an experienced HR professional. Write a concise 3-paragraph cover letter for a Junior Accounts role highlighting my B.Com degree and Tally skills. Tone: Professional and enthusiastic."',
          practicalApplication: '1 मिनट में कंपनी के अनुरूप पर्सनलाइज्ड कवर लेटर तैयार करना।'
        }
      ],
      keyFactsAndRules: [
        'R-C-T-O फॉर्मूला: Role (भूमिका) + Context (संदर्भ) + Task (काम) + Output (प्रारूप)',
        'अस्पष्ट सवाल पूछने से बचें; उदाहरण देकर पूछें (Few-shot Prompting)।'
      ],
      assessmentTasks: [
        {
          id: 'p02-ai1',
          type: 'activity',
          question: 'AI प्रॉम्प्ट असाइनमेंट:',
          practicalTask: 'किसी AI टूल में R-C-T-O फॉर्मूला लगाकर अपने पसंदीदा विषय पर 10 प्रश्नों की बहुविकल्पीय प्रश्नोत्तरी तैयार करवाएं।'
        }
      ]
    },
    {
      id: 'p02-page-3',
      pageNumber: 3,
      titleHindi: 'पेज 03: जॉब इंटरव्यू सफलता - टॉप 10 सवाल व STAR तकनीक उत्तर विधि',
      titleEnglish: 'Job Interview Mastery & The STAR Answering Framework',
      subject: 'Job Interview Skills',
      gradeOrLevel: 'Career Readiness',
      badge: 'इंटरव्यू रेडी',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Confident young professional in crisp formal attire smiling during a corporate job interview across a clean conference table --ar 4:3',
      conceptOverview: {
        hindi: 'STAR तकनीक (Situation, Task, Action, Result) इंटरव्यू में व्यावहारिक सवालों का प्रभावी उत्तर देने का विश्वव्यापी मानक ढांचा है। इससे उत्तर स्पष्ट, संक्षिप्त और तथ्यपरक बनता है।',
        english: 'The STAR method (Situation, Task, Action, Result) delivers structured competency answers that prove your capability with tangible evidence.'
      },
      realWorldExamples: [
        {
          title: '"कठिन परिस्थिति में काम कैसे किया?" का उत्तर',
          description: 'Situation: कॉलेज फेस्ट में 2 दिन पहले स्पॉन्सर पीछे हटा। Task: ₹20,000 की व्यवस्था। Action: 15 स्थानीय व्यापारियों से मिला। Result: ₹25,000 जुटाए।',
          practicalApplication: 'बिना घबराए अपनी नेतृत्व और समस्या-समाधान क्षमता प्रदर्शित करना।'
        }
      ],
      keyFactsAndRules: [
        'पहले 90 सेकंड में आपका बॉडी लैंग्वेज और आई-कांटेक्ट 70% प्रभाव डालता है।',
        '"अपने बारे में बताएं" (Tell me about yourself) में केवल वर्तमान कौशल और उपलब्धियों पर केंद्रित रहें।'
      ],
      assessmentTasks: [
        {
          id: 'p02-int1',
          type: 'mcq',
          question: 'STAR तकनीक में "A" का क्या अर्थ है?',
          options: ['Ability (क्षमता)', 'Action (आपके द्वारा उठाया गया कदम)', 'Answer (उत्तर)', 'Agreement (सहमति)'],
          correctAnswer: 'Action (आपके द्वारा उठाया गया कदम)',
          explanation: 'Action वह ठोस कदम है जो आपने उस समस्या के समाधान हेतु स्वयं उठाया।'
        }
      ]
    },
    {
      id: 'p02-page-4',
      pageNumber: 4,
      titleHindi: 'पेज 04: प्रोफेशनल ईमेल शिष्टाचार व कार्यस्थल संचार',
      titleEnglish: 'Professional Workplace Communication & Email Etiquette',
      subject: 'Email & Workplace Communication',
      gradeOrLevel: 'Corporate Skills',
      badge: 'ईमेल प्रोटोकॉल',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Close up of fingers typing a polite corporate email on a modern backlit keyboard, coffee cup nearby, soft bokeh --ar 4:3',
      conceptOverview: {
        hindi: 'आधिकारिक ईमेल में स्पष्ट सब्जेक्ट लाइन, औपचारिक अभिवादन (Salutation), संक्षिप्त मुख्य भाग (Body), और व्यावसायिक हस्ताक्षर (Email Signature) का होना अनिवार्य है।',
        english: 'Email etiquette defines professional maturity. Clear subject lines, polite greetings, concise messaging, and clean sign-offs prevent misunderstandings.'
      },
      realWorldExamples: [
        {
          title: 'अवकाश प्रार्थना ईमेल (Leave Application)',
          description: 'Subject: Leave Application - Amit Kumar [Emp ID: IOIS10AK01] - 25th Sept',
          practicalApplication: 'सटीक सब्जेक्ट लाइन से ऑफिस में तुरंत अनुमोदन प्राप्त होना।'
        }
      ],
      keyFactsAndRules: [
        'पूरे शब्दों को CAPITAL LETTERS में न लिखें, यह चिल्लाने (Shouting) जैसा प्रतीत होता है।',
        'हमेशा भेजने से पहले प्रूफरीड करें और स्पेलिंग जांचें।'
      ],
      assessmentTasks: [
        {
          id: 'p02-em1',
          type: 'activity',
          question: 'ईमेल ड्राफ्ट टास्क:',
          practicalTask: 'अपने बॉस को प्रोजेक्ट स्टेटस रिपोर्ट प्रस्तुत करने के लिए 100 शब्दों का एक सुंदर ईमेल प्रारूप लिखें।'
        }
      ]
    }
  ]
};

export const plan03Curriculum: PlanCurriculum = {
  planId: 'plan-03',
  planNumber: 3,
  planName: 'Career & Computer Literacy (Office, Canva & Freelance)',
  totalCurriculumPages: 4,
  subjectsAvailable: ['MS Excel & Google Sheets', 'Canva Graphic Design', 'Freelancing Fundamentals', 'Fast Typing & Office Tools'],
  targetAudience: 'ऑफिस कार्यकर्ता, फ्रीलांसर, डेटा एंट्री ऑपरेटर और छोटे व्यवसायी',
  overviewSummary: 'माइक्रोसॉफ्ट एक्सेल के महत्वपूर्ण फॉर्मूले, सोशल मीडिया पोस्टर डिजाइनिंग, कैनवा टूल्स और घर बैठे फ्रीलांसिंग से आय अर्जित करने का हैंड्स-ऑन पाठ्यक्रम।',
  curriculumPages: [
    {
      id: 'p03-page-1',
      pageNumber: 1,
      titleHindi: 'पेज 01: MS Excel व Google Sheets मास्टर फॉर्मूले (VLOOKUP, SUMIFS, Pivot Table)',
      titleEnglish: 'Advanced Excel Formulas, Data Analysis & Pivot Dashboards',
      subject: 'MS Excel & Google Sheets',
      gradeOrLevel: 'Data Operator Level',
      badge: 'एक्सेल एक्सपर्ट',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Computer monitor displaying complex spreadsheets with colorful charts, pivot tables, and clean data rows, financial office setting --ar 4:3',
      conceptOverview: {
        hindi: 'एक्सेल डेटा विश्लेषण और गणनाओं की वैश्विक रीढ़ है। VLOOKUP और XLOOKUP फॉर्मूलों से हजारों रिकॉर्ड्स में से पलक झपकते डेटा खोजा जाता है, और पिवट टेबल से विशाल डेटा की समरी बनती है।',
        english: 'Excel powers commercial reporting. Mastering VLOOKUP, SUMIFS, conditional formatting, and Pivot Tables enables automated accounting and reporting.'
      },
      realWorldExamples: [
        {
          title: 'दुकान का मासिक बिक्री रिपोर्ट (Sales MIS)',
          description: '=SUMIFS(Sales_Amount, Product_Name, "Smart Phone", Region, "Bihar")',
          practicalApplication: 'विशिष्ट उत्पाद और क्षेत्र की कुल बिक्री 1 सेकंड में निकालना।'
        }
      ],
      keyFactsAndRules: [
        'हर फॉर्मूला "=" (बराबर) के चिह्न से शुरू होता है।',
        'Pivot Table बिना किसी कोड या फॉर्मूले के डेटा को सारांशित करती है।'
      ],
      assessmentTasks: [
        {
          id: 'p03-xl1',
          type: 'mcq',
          question: 'एक्सेल में किसी टेबल के पहले कॉलम में मान ढूंढकर उसी पंक्ति से दूसरे कॉलम का डेटा लाने वाला फॉर्मूला कौन-सा है?',
          options: ['SUM', 'VLOOKUP', 'COUNTIF', 'CONCAT'],
          correctAnswer: 'VLOOKUP',
          explanation: 'VLOOKUP (Vertical Lookup) डेटाबेस से संबंधित रिकॉर्ड खोजने का मानक फॉर्मूला है।'
        }
      ]
    },
    {
      id: 'p03-page-2',
      pageNumber: 2,
      titleHindi: 'पेज 02: Canva से सोशल मीडिया बैनर, थंबनेल व पोस्टर डिजाइनिंग',
      titleEnglish: 'Graphic Design with Canva: Social Posts, Thumbnails & Flyers',
      subject: 'Canva Graphic Design',
      gradeOrLevel: 'Visual Design',
      badge: 'डिजाइन मास्टर',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Tablet screen displaying creative Canva social media template with modern typography, color palette swatches and graphics layout --ar 4:3',
      conceptOverview: {
        hindi: 'कैनवा एक आसान और शक्तिशाली क्लाउड डिजाइन टूल है। सही रंग संयोजन (Color Palette), फॉन्ट पेयरिंग और विजुअल पदानुक्रम (Hierarchy) समझकर कोई भी प्रोफेशनल पोस्टर बना सकता है।',
        english: 'Visual hierarchy guides the viewer’s eye: Headline first, supporting visual second, Call to Action (CTA) third. Canva simplifies professional asset creation.'
      },
      realWorldExamples: [
        {
          title: 'यूट्यूब थंबनेल (1280x720px)',
          description: 'हाई-कंट्रास्ट बैकग्राउंड, बोल्ड 3-शब्द टेक्स्ट और चेहरे के भाव से क्लिक थ्रू रेट (CTR) 300% बढ़ाना।',
          practicalApplication: 'यूट्यूबर्स और फेसबुक क्रिएटर्स के लिए थंबनेल बनाकर ₹200-₹500 प्रति पोस्टर कमाना।'
        }
      ],
      keyFactsAndRules: [
        'एक डिजाइन में अधिकतम 2 या 3 फोंट्स का ही प्रयोग करें।',
        'टेक्स्ट और बैकग्राउंड के बीच गहरा कंट्रास्ट रखें ताकि मोबाइल पर आसानी से पढ़ा जा सके।'
      ],
      assessmentTasks: [
        {
          id: 'p03-cv1',
          type: 'activity',
          question: 'कैनवा प्रोजेक्ट:',
          practicalTask: 'स्थानीय कोचिंग सेंटर या दुकान के लिए एक आकर्षक 1080x1080px इंस्टाग्राम प्रमोशन पोस्टर तैयार करें।'
        }
      ]
    },
    {
      id: 'p03-page-3',
      pageNumber: 3,
      titleHindi: 'पेज 03: घर बैठे फ्रीलांसिंग - Upwork, Fiverr व क्लाइंट पाने की तकनीक',
      titleEnglish: 'Freelance Marketplace Mastery & Client Acquisition',
      subject: 'Freelancing Fundamentals',
      gradeOrLevel: 'Income Generation',
      badge: 'ऑनलाइन कमाई',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Remote worker smiling at modern laptop at home with notebook, clean desk, coffee mug, warm indoor sunlight --ar 4:3',
      conceptOverview: {
        hindi: 'फ्रीलांसिंग में आप किसी एक कंपनी के बंधे कर्मचारी नहीं होते, बल्कि दुनिया भर के ग्राहकों को प्रोजेक्ट आधार पर अपनी सेवाएं (डेटा एंट्री, डिजाइन, ट्रांसलेशन) बेचते हैं।',
        english: 'Freelancing monetizes your specific technical or creative skills across borderless digital marketplaces through compelling proposals and trusted delivery.'
      },
      realWorldExamples: [
        {
          title: 'PDF से Excel डेटा कन्वर्जन',
          description: 'Fiverr पर ₹500 प्रति 20 पेज के हिसाब से डेटा क्लीनिंग और कन्वर्जन सेवाएं देना।',
          practicalApplication: 'रोजाना 2 घंटे काम करके ₹15,000 से ₹25,000 मासिक फ्रीलांस आय बनाना।'
        }
      ],
      keyFactsAndRules: [
        'पहला रिव्यू पाने के लिए शुरुआती 3 प्रोजेक्ट्स में त्वरित डिलीवरी और अतिरिक्त सेवा दें।',
        'प्रपोजल कॉपी-पेस्ट न करें; ग्राहक की वास्तविक समस्या का हल बताएं।'
      ],
      assessmentTasks: [
        {
          id: 'p03-fl1',
          type: 'mcq',
          question: 'फ्रीलांसिंग प्रपोजल में ग्राहक को प्रभावित करने का सबसे अच्छा तरीका क्या है?',
          options: ['लंबा बायोडेटा भेजना', 'क्लाइंट की समस्या का समाधान और पूर्व कार्य का प्रासंगिक लिंक देना', 'बहुत कम कीमत मांगना', 'बार-बार मैसेज करना'],
          correctAnswer: 'क्लाइंट की समस्या का समाधान और पूर्व कार्य का प्रासंगिक लिंक देना',
          explanation: 'ग्राहक समाधान और विश्वसनीयता चाहता है, न कि सामान्य निबंध।'
        }
      ]
    },
    {
      id: 'p03-page-4',
      pageNumber: 4,
      titleHindi: 'पेज 04: हिंदी व अंग्रेजी टाइपिंग स्पीड 40+ WPM एवं शॉर्टकट कीज',
      titleEnglish: 'High-Speed Typing, KrutiDev/Mangal Font & Windows Shortcuts',
      subject: 'Fast Typing & Office Tools',
      gradeOrLevel: 'Speed Typing',
      badge: 'टाइपिंग स्पीड',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Ergonomic mechanical keyboard with hands positioned correctly on home row keys F and J, typing test on screen --ar 4:3',
      conceptOverview: {
        hindi: 'टच टाइपिंग में बिना कीबोर्ड देखे सभी 10 अंगुलियों से टाइप किया जाता है। "F" और "J" की पर उभरे हुए उभार (Bumps) अंगुलियों की सही स्थिति बताते हैं।',
        english: 'Touch typing utilizes muscle memory across home row keys (ASDF - JKL;), doubling office productivity from 20 WPM to 50+ WPM.'
      },
      realWorldExamples: [
        {
          title: 'सरकारी टाइपिंग परीक्षा (SSC CHSL / High Court)',
          description: '10 मिनट में 35 WPM अंग्रेजी और 30 WPM हिंदी (मंगल फॉन्ट) टाइपिंग टेस्ट पास करना।',
          practicalApplication: 'क्लर्क, आशुलिपिक और डेटा ऑपरेटर की सीधी नौकरी हासिल करना।'
        }
      ],
      keyFactsAndRules: [
        'शॉर्टकट कीज: Ctrl+C (कॉपी), Ctrl+V (पेस्ट), Ctrl+Z (अनडू), Windows+Shift+S (स्क्रीनशॉट)',
        'टाइपिंग करते समय कीबोर्ड पर नहीं, स्क्रीन पर देखना चाहिए।'
      ],
      assessmentTasks: [
        {
          id: 'p03-tp1',
          type: 'activity',
          question: 'टाइपिंग टेस्ट ड्रिल:',
          practicalTask: 'TypingMaster या ऑनलाइन टेस्ट में 10 मिनट टाइपिंग अभ्यास करके अपना नेट स्पीड और एक्यूरेसी प्रतिशत नोट करें।'
        }
      ]
    }
  ]
};

export const plan04Curriculum: PlanCurriculum = {
  planId: 'plan-04',
  planNumber: 4,
  planName: 'Family & Competitive Foundations (GK, Math Tricks & Civic Rights)',
  totalCurriculumPages: 3,
  subjectsAvailable: ['Vedic Math & Mental Speed', 'General Knowledge & Current Affairs', 'Civic Rights & Consumer Law'],
  targetAudience: 'पूरा परिवार, गृहणियां, और शुरुआती प्रतियोगी परीक्षार्थी',
  overviewSummary: 'बिना पेन-पेपर तीव्र मानसिक गणना की वैदिक विधियां, दैनिक सामान्य ज्ञान, और हर नागरिक के लिए आवश्यक संवैधानिक अधिकार व साइबर सुरक्षा।',
  curriculumPages: [
    {
      id: 'p04-page-1',
      pageNumber: 1,
      titleHindi: 'पेज 01: वैदिक गणित - बिना कैलकुलेटर 5 सेकंड में वर्ग व गुणा करने की ट्रिक्स',
      titleEnglish: 'Vedic Mental Math: Instant Square & Multiplication Shortcuts',
      subject: 'Vedic Math & Mental Speed',
      gradeOrLevel: 'Mental Calculation',
      badge: 'वैदिक गणित',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Artistic blackboard with elegant white chalk geometric math formulas and mental calculation equations, soft warm lighting --ar 4:3',
      conceptOverview: {
        hindi: 'वैदिक गणित के 16 सूत्रों से जटिल गणनाएं पलक झपकते हल होती हैं। जैसे किसी संख्या का अंतिम अंक 5 हो, तो "एकाधिकेन पूर्वेण" सूत्र से उसका वर्ग सेकंडों में ज्ञात होता है।',
        english: 'Vedic mathematics shortcuts bypass lengthy paper multiplication, building extraordinary mental agility for exams and daily market bargaining.'
      },
      realWorldExamples: [
        {
          title: '65 का वर्ग (Square of 65) तुरंत निकालना',
          description: 'अंतिम अंक 5 का वर्ग = 25। पहला अंक 6 का अगला अंक 7, अतः 6 × 7 = 42। उत्तर: 4225!',
          practicalApplication: 'बिना रफ वर्क किए परीक्षा में 30 सेकंड का समय बचाना।'
        },
        {
          title: '11 से किसी भी संख्या का गुणा',
          description: '35 × 11: 3 और 5 को किनारे रखें, बीच में (3 + 5 = 8) रखें = 385।',
          practicalApplication: 'दुकान पर बिल का तुरंत सत्यापन करना।'
        }
      ],
      keyFactsAndRules: [
        'एकाधिकेन पूर्वेण सूत्र: (n5)² = [n × (n+1)] [25]',
        '100 के निकट संख्याओं का गुणा: 104 × 106 = 11024'
      ],
      assessmentTasks: [
        {
          id: 'p04-vm1',
          type: 'mcq',
          question: 'वैदिक ट्रिक से 85 का वर्ग (Square) क्या होगा?',
          options: ['7225', '6425', '7025', '7525'],
          correctAnswer: '7225',
          explanation: '8 × (8+1) = 8 × 9 = 72, और 5² = 25 -> 7225।'
        }
      ]
    },
    {
      id: 'p04-page-2',
      pageNumber: 2,
      titleHindi: 'पेज 02: भारत का संविधान, मौलिक अधिकार एवं दैनिक नागरिक कानून',
      titleEnglish: 'Indian Constitution, Fundamental Rights & Everyday Law',
      subject: 'Civic Rights & Consumer Law',
      gradeOrLevel: 'Citizen Knowledge',
      badge: 'कानूनी साक्षरता',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Gavel on wooden desk next to law books and scales of justice, soft elegant library lighting --ar 4:3',
      conceptOverview: {
        hindi: 'भारतीय संविधान दुनिया का सबसे बड़ा लिखित संविधान है। यह प्रत्येक नागरिक को 6 मौलिक अधिकार (समानता, स्वतंत्रता, शोषण के विरुद्ध अधिकार, धार्मिक स्वतंत्रता, शिक्षा व संस्कृति, और संवैधानिक उपचार) प्रदान करता है।',
        english: 'Knowledge of Indian Constitutional rights (Articles 14 to 32) and consumer protection protects citizens from exploitation and bureaucratic hurdles.'
      },
      realWorldExamples: [
        {
          title: 'उपभोक्ता संरक्षण अधिकार (Consumer Rights)',
          description: 'दुकानदार एमआरपी (MRP) से अधिक पैसे नहीं ले सकता, और एक्सपायरी सामान देने पर हर्जाने का कानूनी प्रावधान है।',
          practicalApplication: 'राष्ट्रीय उपभोक्ता हेल्पलाइन 1915 पर ऑनलाइन शिकायत दर्ज कराना।'
        },
        {
          title: 'सूचना का अधिकार (RTI Act 2005)',
          description: 'मात्र ₹10 के शुल्क में किसी भी सरकारी विभाग से खर्च और विकास कार्यों का ब्योरा मांगना।',
          practicalApplication: 'गांव में सड़क, स्कूल या राशन वितरण की पारदर्शिता सुनिश्चित करना।'
        }
      ],
      keyFactsAndRules: [
        'अनुच्छेद 21: जीवन और व्यक्तिगत स्वतंत्रता का अधिकार (Right to Life and Personal Liberty)',
        'एफआईआर (FIR) दर्ज कराना संज्ञेय अपराध में हर नागरिक का कानूनी हक है।'
      ],
      assessmentTasks: [
        {
          id: 'p04-law1',
          type: 'mcq',
          question: 'भारत में सूचना का अधिकार अधिनियम (RTI Act) किस वर्ष लागू हुआ था?',
          options: ['2000', '2005', '2010', '2015'],
          correctAnswer: '2005',
          explanation: 'RTI अधिनियम 12 अक्टूबर 2005 को भारत भर में लागू हुआ था।'
        }
      ]
    },
    {
      id: 'p04-page-3',
      pageNumber: 3,
      titleHindi: 'पेज 03: साइबर सुरक्षा - ऑनलाइन ठगी, OTP फ्रॉड व सुरक्षित डिजिटल बैंकिंग',
      titleEnglish: 'Cybersecurity, Digital Banking Safety & Fraud Prevention',
      subject: 'Civic Rights & Consumer Law',
      gradeOrLevel: 'Digital Safety',
      badge: 'साइबर रक्षक',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Smartphone screen showing high tech padlock icon symbolizing digital banking encryption, cyber safety concept --ar 4:3',
      conceptOverview: {
        hindi: 'डिजिटल युग में आपका बैंक अकाउंट और निजी डेटा सबसे मूल्यवान संपत्ति हैं। कोई भी बैंक, पुलिस या संस्था कभी फोन पर OTP, ATM पिन या CVV नहीं मांगती।',
        english: 'Cyber hygiene prevents financial fraud. Never share OTPs, never click unknown APK links, and always report fraud immediately to cyber helpline 1930.'
      },
      realWorldExamples: [
        {
          title: 'UPI फ्रॉड से बचाव',
          description: 'याद रखें: "पैसे प्राप्त करने के लिए कभी UPI PIN दर्ज नहीं करना पड़ता!" PIN केवल पैसे भेजने पर डाला जाता है।',
          practicalApplication: 'ओएलएक्स या लॉटरी के नाम पर होने वाले बैंक फ्रॉड से परिवार को बचाना।'
        }
      ],
      keyFactsAndRules: [
        'राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर: 1930 (portal: cybercrime.gov.in)',
        'फोन में अनजान स्रोतों से ".apk" फाइलें कभी इंस्टॉल न करें।'
      ],
      assessmentTasks: [
        {
          id: 'p04-cy1',
          type: 'activity',
          question: 'परिवार साइबर सुरक्षा ऑडिट:',
          practicalTask: 'अपने परिवार के सभी फोन में टू-फैक्टर ऑथेंटिकेशन (2FA) ऑन करें और साइबर हेल्पलाइन 1930 सेव कराएं।'
        }
      ]
    }
  ]
};

export const plan05Curriculum: PlanCurriculum = {
  planId: 'plan-05',
  planNumber: 5,
  planName: 'Student Elite (NCERT 6-10 Fastrack, Aptitude & Govt Exams)',
  totalCurriculumPages: 3,
  subjectsAvailable: ['Quantitative Aptitude', 'General Science (PCB)', 'Indian History & Geography'],
  targetAudience: 'SSC, रेलवे, बिहार पुलिस, दरोगा, BSSC और राज्य प्रतियोगी अभ्यर्थी',
  overviewSummary: 'प्रतियोगी परीक्षाओं के लिए NCERT कक्षा 6-10 का क्रिस्प फास्टट्रैक सारांश, गणितीय एप्टीट्यूड ट्रिक्स और पिछले 10 वर्षों के महत्वपूर्ण प्रश्नों का संग्रह।',
  curriculumPages: [
    {
      id: 'p05-page-1',
      pageNumber: 1,
      titleHindi: 'पेज 01: प्रतिशत (Percentage) एवं लाभ-हानि (Profit & Loss) शॉर्टकट ट्रिक्स',
      titleEnglish: 'Quantitative Aptitude: Percentage Fractions & Profit-Loss Shortcuts',
      subject: 'Quantitative Aptitude',
      gradeOrLevel: 'SSC / Railway Elite',
      badge: 'एप्टीट्यूड मास्टर',
      imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Mathematical chart displaying fraction to percentage conversion table on a modern clean tablet screen --ar 4:3',
      conceptOverview: {
        hindi: 'प्रतिशत सभी अंकगणित की आधारशिला है। भिन्न (Fraction) को प्रतिशत में सीधे याद रखने से (जैसे 1/6 = 16.66%, 1/8 = 12.5%) गणना का समय 80% कम हो जाता है।',
        english: 'Percentage fraction conversions convert multi-step arithmetic into mental calculations, drastically elevating score speed in competitive exams.'
      },
      realWorldExamples: [
        {
          title: 'क्रमिक छूट (Successive Discount) की गणना',
          description: '20% और 10% की दो क्रमिक छूट = 20 + 10 - (20 × 10 / 100) = 28% की एकल समतुल्य छूट।',
          practicalApplication: 'मॉल और ई-कॉमर्स की भ्रामक छूटों का सटीक मूल्य समझना।'
        }
      ],
      keyFactsAndRules: [
        'लाभ % = (लाभ / क्रय मूल्य) × 100',
        'हानि % = (हानि / क्रय मूल्य) × 100 (गणना सदैव Cost Price पर होती है)'
      ],
      assessmentTasks: [
        {
          id: 'p05-qa1',
          type: 'mcq',
          question: 'एक वस्तु ₹500 में खरीदकर ₹600 में बेची गई। लाभ प्रतिशत क्या है?',
          options: ['10%', '20%', '25%', '15%'],
          correctAnswer: '20%',
          explanation: 'लाभ = 600 - 500 = ₹100। लाभ % = (100 / 500) × 100 = 20%।'
        }
      ]
    },
    {
      id: 'p05-page-2',
      pageNumber: 2,
      titleHindi: 'पेज 02: सामान्य विज्ञान - भौतिकी के नियम, रासायनिक सूत्र व मानव शरीर क्रिया',
      titleEnglish: 'General Science: Physics Laws, Chemical Formulas & Human Biology',
      subject: 'General Science (PCB)',
      gradeOrLevel: 'NCERT 6-10 Matrix',
      badge: 'विज्ञान स्पेशल',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Science laboratory glass flasks with colorful reactions, DNA helix model, and Newton pendulum on table, cinematic lighting --ar 4:3',
      conceptOverview: {
        hindi: 'प्रतियोगी परीक्षाओं में कक्षा 6 से 10 तक के सामान्य विज्ञान से 25-30% प्रश्न पूछे जाते हैं। न्यूटन के गति नियम, आवर्त सारणी और मानव पाचन व परिसंचरण तंत्र सबसे महत्वपूर्ण विषय हैं।',
        english: 'Core NCERT Science covers physics motion laws, essential chemical reactions, and human anatomy frequently tested across SSC and State PSCs.'
      },
      realWorldExamples: [
        {
          title: 'न्यूटन का तीसरा गति नियम (क्रिया-प्रतिक्रिया)',
          description: 'रॉकेट का अंतरिक्ष में उड़ना, नाव से कूदते समय नाव का पीछे हटना।',
          practicalApplication: 'दैनिक घटनाओं में भौतिकी के नियमों को पहचानना।'
        }
      ],
      keyFactsAndRules: [
        'रक्त समूह (Blood Groups): O- सर्वदाता (Universal Donor), AB+ सर्वग्राही (Universal Acceptor)',
        'विटामिन C का रासायनिक नाम: एस्कॉर्बिक एसिड (कमी से स्कर्वी रोग होता है)'
      ],
      assessmentTasks: [
        {
          id: 'p05-sci1',
          type: 'mcq',
          question: 'मानव शरीर की सबसे बड़ी ग्रंथि (Largest Gland) कौन-सी है?',
          options: ['अग्न्याशय (Pancreas)', 'यकृत (Liver)', 'थायरॉयड (Thyroid)', 'पीयूष (Pituitary)'],
          correctAnswer: 'यकृत (Liver)',
          explanation: 'यकृत (Liver) मानव शरीर की सबसे बड़ी ग्रंथि है जो पित्त रस का निर्माण करती है।'
        }
      ]
    },
    {
      id: 'p05-page-3',
      pageNumber: 3,
      titleHindi: 'पेज 03: आधुनिक भारत का इतिहास, 1857 की क्रांति व स्वतंत्रता आंदोलन',
      titleEnglish: 'Modern Indian History: 1857 Revolt to Indian Independence',
      subject: 'Indian History & Geography',
      gradeOrLevel: 'GS Elite Prep',
      badge: 'इतिहास दर्पण',
      imageUrl: 'https://images.unsplash.com/photo-1590059390046-538466ba8a5f?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Historic vintage parchment map of India with quill pen, sepia tones, heritage Indian monuments in background --ar 4:3',
      conceptOverview: {
        hindi: '1857 का प्रथम स्वतंत्रता संग्राम, भारतीय राष्ट्रीय कांग्रेस की स्थापना (1885), गांधीजी के आंदोलन (असहयोग, सविनय अवज्ञा, भारत छोड़ो) और 1947 में आजादी का इतिहास प्रतियोगी परीक्षाओं की जान है।',
        english: 'Modern Indian freedom struggle chronicles key milestones from Mangal Pandey’s 1857 revolt to the 1942 Quit India movement and 1947 independence.'
      },
      realWorldExamples: [
        {
          title: 'चंपारण सत्याग्रह (1917, बिहार)',
          description: 'गांधीजी का भारत में पहला सफल सत्याग्रह, जिसने तिनकठिया नील प्रणाली को समाप्त किया।',
          practicalApplication: 'बिहार और राष्ट्रीय इतिहास में चंपारण की ऐतिहासिक भूमिका समझना।'
        }
      ],
      keyFactsAndRules: [
        '1857 की क्रांति की शुरुआत 10 मई को मेरठ छावनी से हुई थी।',
        'महात्मा गांधी 9 जनवरी 1915 को दक्षिण अफ्रीका से भारत लौटे (प्रवासी भारतीय दिवस)।'
      ],
      assessmentTasks: [
        {
          id: 'p05-his1',
          type: 'mcq',
          question: 'भारतीय राष्ट्रीय कांग्रेस के प्रथम अध्यक्ष कौन थे?',
          options: ['ए.ओ. ह्यूम', 'व्योमेश चंद्र बनर्जी (W.C. Bonnerjee)', 'दादाभाई नौरोजी', 'गोपाल कृष्ण गोखले'],
          correctAnswer: 'व्योमेश चंद्र बनर्जी (W.C. Bonnerjee)',
          explanation: '1885 में बॉम्बे के गोकुलदास तेजपाल संस्कृत कॉलेज में आयोजित पहले अधिवेशन के अध्यक्ष व्योमेश चंद्र बनर्जी थे।'
        }
      ]
    }
  ]
};

export const plan06Curriculum: PlanCurriculum = {
  planId: 'plan-06',
  planNumber: 6,
  planName: 'Agency Reseller & Digital Services (Gov Services, Web & Marketing)',
  totalCurriculumPages: 3,
  subjectsAvailable: ['CSC & RTPS Citizen Services', 'Digital Agency Client Invoicing', 'Social Media Local Business Growth'],
  targetAudience: 'साइबर कैफे संचालक, सीएससी वीएलई, डिजिटल एजेंसी मालिक व उद्यमी',
  overviewSummary: 'जाति-आय-निवास प्रमाण पत्र, पैन कार्ड, ई-श्रम जैसी 50+ नागरिक सेवाएं प्रदान करने, स्थानीय दुकानों की वेबसाइट बनाने और ₹50,000+ मासिक कमाने का बिजनेस ब्लूप्रिंट।',
  curriculumPages: [
    {
      id: 'p06-page-1',
      pageNumber: 1,
      titleHindi: 'पेज 01: RTPS बिहार व केंद्रीय नागरिक सेवाएं (जाति, आय, निवास, दाखिल-खारिज)',
      titleEnglish: 'Government E-Governance Citizen Services Delivery & Portal Ops',
      subject: 'CSC & RTPS Citizen Services',
      gradeOrLevel: 'Agency Operations',
      badge: 'सेवा केंद्र',
      imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Indian citizen service center with computer operator helping rural family apply for government certificates on monitor --ar 4:3',
      conceptOverview: {
        hindi: 'RTPS (Right to Public Services) और उमंग पोर्टल से नागरिक सेवाएं समयबद्ध तरीके से ऑनलाइन दी जाती हैं। सही दस्तावेज स्कैनिंग और स्टेटस ट्रैकिंग से 100% सफलता मिलती है।',
        english: 'Delivering citizen services (Caste, Income, Domicile, Land Records) creates a dependable cash-flow business serving local communities.'
      },
      realWorldExamples: [
        {
          title: 'दैनिक 20 प्रमाण पत्र आवेदन सेवा',
          description: 'प्रत्येक आवेदन पर ₹50-₹100 का प्रिंटिंग व सर्विस शुल्क लेकर प्रतिदिन ₹1,000 से ₹2,000 की शुद्ध आय अर्जित करना।',
          practicalApplication: 'बिना किसी बड़े निवेश के अपने घर या दुकान से ग्राहक सेवा केंद्र चलाना।'
        }
      ],
      keyFactsAndRules: [
        'दस्तावेज फाइल साइज हमेशा 200 KB से कम (PDF/JPEG) रखें।',
        'आवेदन के तुरंत बाद पावती (Acknowledgement Slip) ग्राहक को प्रिंट करके अवश्य दें।'
      ],
      assessmentTasks: [
        {
          id: 'p06-rt1',
          type: 'mcq',
          question: 'बिहार RTPS पोर्टल पर जाति और निवास प्रमाण पत्र जारी करने की सामान्य समय-सीमा कितनी होती है?',
          options: ['2 दिन', '10 से 14 कार्य दिवस', '60 दिन', 'तत्काल'],
          correctAnswer: '10 से 14 कार्य दिवस',
          explanation: 'RTPS कानून के तहत सामान्यतः 10 से 14 कार्य दिवस में ऑनलाइन डिजिटल हस्ताक्षरित प्रमाण पत्र जारी होता है।'
        }
      ]
    },
    {
      id: 'p06-page-2',
      pageNumber: 2,
      titleHindi: 'पेज 02: क्लाइंट कोटेशन, जीएसटी बिलिंग एवं अनुबंध समझौता प्रारूप',
      titleEnglish: 'Agency Invoicing, GST Quotations & Legal Service Contracts',
      subject: 'Digital Agency Client Invoicing',
      gradeOrLevel: 'Business Legal',
      badge: 'बिलिंग गाइड',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Formal signed business contract on glass table with fountain pen and stamped official seal, corporate ambient lighting --ar 4:3',
      conceptOverview: {
        hindi: 'एक सफल एजेंसी का आधार स्पष्ट कोटेशन और अनुबंध (SLA - Service Level Agreement) है। 50% एडवांस पेमेंट और माइलस्टोन आधारित डिलीवरी से पेमेंट फंसने का जोखिम समाप्त हो जाता है।',
        english: 'Transparent milestone contracts, 50% upfront deposits, and professional GST invoicing protect your agency from non-payment and scope creep.'
      },
      realWorldExamples: [
        {
          title: 'लोकल स्कूल वेबसाइट प्रोजेक्ट (₹15,000)',
          description: '50% (₹7,500) एडवांस, 30% डिजाइन अप्रूवल पर, और 20% फाइनल लाइव करने पर।',
          practicalApplication: 'सुरक्षित कैशफ्लो और पेशेवर साख का निर्माण।'
        }
      ],
      keyFactsAndRules: [
        'काम शुरू करने से पहले स्कोप ऑफ वर्क (Scope of Work) लिखित में अप्रूव कराएं।',
        'अतिरिक्त संशोधन (Revisions) के लिए अलग दरें पहले से तय रखें।'
      ],
      assessmentTasks: [
        {
          id: 'p06-inv1',
          type: 'activity',
          question: 'एजेंसी बिलिंग टास्क:',
          practicalTask: 'एक स्थानीय कपड़े की दुकान के लिए डिजिटल मार्केटिंग सेवा का ₹10,000 का कोटेशन और इनवॉइस तैयार करें।'
        }
      ]
    },
    {
      id: 'p06-page-3',
      pageNumber: 3,
      titleHindi: 'पेज 03: फेसबुक और गूगल एड्स से स्थानीय दुकानों की बिक्री 10 गुना बढ़ाना',
      titleEnglish: 'Hyperlocal Social Media Ads, Google My Business & Lead Generation',
      subject: 'Social Media Local Business Growth',
      gradeOrLevel: 'Marketing Master',
      badge: 'ग्रोथ मार्केटिंग',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Digital marketing dashboard showing upward trending conversion graphs, target radius map, and engagement metrics on dual monitors --ar 4:3',
      conceptOverview: {
        hindi: 'गूगल माय बिजनेस (Google Maps) पर स्थानीय दुकान को टॉप पर रैंक कराना और 5 किलोमीटर के दायरे में फेसबुक एड्स चलाना ग्राहकों की बाढ़ ला देता है।',
        english: 'Hyperlocal radius advertising on Meta and Google Maps SEO drives foot-traffic and high-intent phone inquiries to neighborhood businesses.'
      },
      realWorldExamples: [
        {
          title: 'स्थानीय डेंटल क्लिनिक या रेस्टोरेंट',
          description: '₹2,000 के फेसबुक विज्ञापन से 80+ नए ग्राहकों के फोन कॉल्स और बुकिंग्स पाना।',
          practicalApplication: 'क्लाइंट से ₹5,000 मासिक रिटेनर फीस प्राप्त करना।'
        }
      ],
      keyFactsAndRules: [
        'गूगल मैप्स लिस्टिंग में 100% प्रोफाइल पूरा रखें और नियमित रूप से कस्टमर रिव्यू लें।',
        'विज्ञापन में हमेशा एक मजबूत कॉल टू एक्शन (Call Now / WhatsApp Now) बटन रखें।'
      ],
      assessmentTasks: [
        {
          id: 'p06-ad1',
          type: 'mcq',
          question: 'स्थानीय दुकान के लिए सबसे प्रभावशाली और निःशुल्क ऑनलाइन उपस्थिति कौन-सी है?',
          options: ['टेलीविजन विज्ञापन', 'Google My Business (Google Maps) प्रोफाइल', 'पर्चे बंटवाना', 'रेडियो जिंगल'],
          correctAnswer: 'Google My Business (Google Maps) प्रोफाइल',
          explanation: 'लोग "near me" सर्च में गूगल मैप्स देखकर ही सबसे पहले दुकान तक पहुंचते हैं।'
        }
      ]
    }
  ]
};

export const plan07Curriculum: PlanCurriculum = {
  planId: 'plan-07',
  planNumber: 7,
  planName: 'Supreme Master Lifetime Access (The Complete Master Archive)',
  totalCurriculumPages: 3,
  subjectsAvailable: ['Executive Leadership & Scaling', 'High-Ticket Affiliate & Network Mastery', 'Financial Planning & Wealth Systems'],
  targetAudience: 'शीर्ष लीडर्स, मास्टर रीसेलर्स, उद्यमी और संस्थागत मार्गदर्शक',
  overviewSummary: 'IOIS का सर्वोच्च मास्टर पाठ्यक्रम, जिसमें सभी 6 प्लान्स का पूर्ण अनलॉक्ड एक्सेस, टीम मैनेजमेंट, ऑटोमेटेड सेल्स फनल और वित्तीय स्वतंत्रता का फॉर्मूला शामिल है।',
  curriculumPages: [
    {
      id: 'p07-page-1',
      pageNumber: 1,
      titleHindi: 'पेज 01: हाई-टिकट एफिलिएट सिस्टम - 50% इंस्टेंट पेआउट व सेल्स फनल ऑटोमेशन',
      titleEnglish: 'High-Ticket Affiliate Funnels & 50% Direct Payout Architecture',
      subject: 'High-Ticket Affiliate & Network Mastery',
      gradeOrLevel: 'Master Leader',
      badge: 'सुप्रीम आर्किटेक्ट',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Luxury executive office suite with gold accents, leather desk mat, glowing smartphone showing automated financial dashboard, cinematic lighting --ar 4:3',
      conceptOverview: {
        hindi: 'PLAN 07 में हर रेफरल पर ₹499 का सीधा बैंक पेआउट मिलता है। ऑटोमेटेड व्हाट्सएप फनल और कम्युनिटी वेबिनार्स के माध्यम से बिना किसी दबाव के 10 गुना रूपांतरण (Conversion) संभव होता है।',
        english: 'High-ticket affiliate architecture pairs a 50% immediate payout model (₹499/referral) with automated nurturing funnels to maximize lifetime member value.'
      },
      realWorldExamples: [
        {
          title: 'मासिक 50 एक्टिवेशंस का लक्ष्य',
          description: '50 एक्टिवेशंस × ₹499 = ₹24,950 प्रति माह सीधे आपके बैंक खाते में।',
          practicalApplication: 'संजय वर्मा और विकास कुमार जैसे लीडर्स द्वारा निर्मित स्थायी ऑनलाइन आय।'
        }
      ],
      keyFactsAndRules: [
        'क्वालिटी लीड्स पर ध्यान दें, अंधाधुंध स्पैमिंग से बचें।',
        'हमेशा नए मेंबर्स को ज़ूम/गूगल मीट पर सिस्टम ट्रेनिंग और हैंड-होल्डिंग सपोर्ट दें।'
      ],
      assessmentTasks: [
        {
          id: 'p07-af1',
          type: 'mcq',
          question: 'PLAN 07 में 100 सदस्यों को जोड़ने पर कुल कितना सीधा इंसेंटिव बैंक खाते में आता है?',
          options: ['₹25,000', '₹49,900', '₹70,000', '₹10,000'],
          correctAnswer: '₹49,900',
          explanation: '100 × ₹499 = ₹49,900 का सीधा 50% तुरंत पेआउट।'
        }
      ]
    },
    {
      id: 'p07-page-2',
      pageNumber: 2,
      titleHindi: 'पेज 02: वित्तीय योजना (Financial Planning) - 50-30-20 नियम व संपत्ति निर्माण',
      titleEnglish: 'Wealth Creation Systems, 50-30-20 Rule & Investment Compound Matrix',
      subject: 'Financial Planning & Wealth Systems',
      gradeOrLevel: 'Wealth Mastery',
      badge: 'फाइनेंशियल फ्रीडम',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Sprouting gold coin plant in crystal jar illustrating compound interest growth, soft sunshine, premium finance imagery --ar 4:3',
      conceptOverview: {
        hindi: 'कमाई करना पहला कदम है, लेकिन अमीर बने रहना और धन को बढ़ाना असली विद्या है। 50-30-20 बजट नियम और चक्रवृद्धि ब्याज (Compound Interest) की शक्ति से हर सामान्य व्यक्ति करोड़पति बन सकता है।',
        english: 'The 50/30/20 budget allocates 50% to essential needs, 30% to lifestyle desires, and 20% to compounding assets that generate generational wealth.'
      },
      realWorldExamples: [
        {
          title: '₹2,000 मासिक एसआईपी (SIP in Index Fund)',
          description: '15% औसत रिटर्न पर 20 वर्षों में ₹2,000/माह (कुल जमा ₹4.8 लाख) बढ़कर लगभग ₹30 लाख बन जाता है।',
          practicalApplication: 'बच्चों की उच्च शिक्षा और सेवानिवृत्ति के लिए तनावमुक्त वित्तीय सुरक्षा।'
        }
      ],
      keyFactsAndRules: [
        'आपातकालीन फंड (Emergency Fund): कम से कम 6 महीने के पारिवारिक खर्च के बराबर बचत खाते में रखें।',
        'क्रेडिट कार्ड और पर्सनल लोन जैसे उच्च ब्याज वाले कर्ज से हमेशा बचें।'
      ],
      assessmentTasks: [
        {
          id: 'p07-fn1',
          type: 'activity',
          question: 'व्यक्तिगत बजट प्लानिंग:',
          practicalTask: 'अपनी मासिक आय को 50-30-20 नियम के अनुसार विभाजित करें और अपनी पहली एसआईपी (SIP) योजना तैयार करें।'
        }
      ]
    },
    {
      id: 'p07-page-3',
      pageNumber: 3,
      titleHindi: 'पेज 03: मास्टर लीडरशिप एवं 10,000+ सदस्यों की डिजिटल कम्युनिटी का संचालन',
      titleEnglish: 'Executive Leadership, Delegation & Large Community Governance',
      subject: 'Executive Leadership & Scaling',
      gradeOrLevel: 'Executive Level',
      badge: 'मास्टर लीडर',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      aiImagePrompt: 'Dynamic leader presenting vision on high tech transparent glass board to engaged team in modern corporate auditorium --ar 4:3',
      conceptOverview: {
        hindi: 'सच्चा लीडर वह है जो और अधिक लीडर्स तैयार करता है। 10,000 से अधिक सदस्यों के नेटवर्क को चलाने के लिए स्पष्ट SOP (Standard Operating Procedures) और विकेंद्रीकृत टीम का गठन किया जाता है।',
        english: 'True leaders scale by building systems, codifying Standard Operating Procedures (SOPs), and empowering community lieutenants.'
      },
      realWorldExamples: [
        {
          title: 'दैनिक कम्युनिटी प्रसारण व समस्या निवारण',
          description: 'टेलीग्राम और व्हाट्सएप पर सुबह 9 बजे दैनिक प्रेरणा, दोपहर 2 बजे टास्क अपडेट, और शाम 8 बजे अर्निंग सेलिब्रेशन।',
          practicalApplication: 'कम्युनिटी में ऊर्जा और सक्रियता बनाए रखना।'
        }
      ],
      keyFactsAndRules: [
        'सफलता का श्रेय टीम को दें, असफलता की जिम्मेदारी स्वयं लें।',
        'पारदर्शिता और सत्यनिष्ठा ही लंबे समय तक चलने वाले संगठन की नींव है।'
      ],
      assessmentTasks: [
        {
          id: 'p07-ld1',
          type: 'challenge',
          question: 'लीडरशिप परिदृश्य: जब आपकी टीम का कोई सदस्य डिमोटिवेट हो जाए, तो आप उसे फिर से सक्रिय करने के लिए क्या 3 कदम उठाएंगे?',
          explanation: '1. उसकी वास्तविक समस्या को ध्यान से सुनना। 2. उसे उसके शुरुआती लक्ष्यों और मजबूतियों की याद दिलाना। 3. एक आसान तात्कालिक लक्ष्य तय करके उसके साथ मिलकर पहला परिणाम निकालना।'
        }
      ]
    }
  ]
};

export const planCurriculumsData: Record<string, PlanCurriculum> = {
  'plan-01': plan01Curriculum,
  'plan-02': plan02Curriculum,
  'plan-03': plan03Curriculum,
  'plan-04': plan04Curriculum,
  'plan-05': plan05Curriculum,
  'plan-06': plan06Curriculum,
  'plan-07': plan07Curriculum
};

export function getCurriculumForPlan(planId: string): PlanCurriculum {
  return planCurriculumsData[planId] || plan01Curriculum;
}
