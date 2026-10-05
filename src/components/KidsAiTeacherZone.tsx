import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Send, 
  Award, 
  CheckCircle2, 
  Star, 
  RefreshCw, 
  BookOpen, 
  Smile, 
  Heart, 
  Download,
  Share2,
  X
} from 'lucide-react';

interface KidsAiTeacherZoneProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudyPage: (planId: string) => void;
}

export const KidsAiTeacherZone: React.FC<KidsAiTeacherZoneProps> = ({
  isOpen,
  onClose,
  onOpenStudyPage
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'voice' | 'quiz' | 'certificate'>('story');
  
  // Story Generator State
  const wordPairs = [
    { word1: 'हाथी 🐘', word2: 'चींटी 🐜' },
    { word1: 'शेर 🦁', word2: 'खरगोश 🐰' },
    { word1: 'चाँद 🌙', word2: 'तितली 🦋' },
    { word1: 'बंदर 🐒', word2: 'आम 🥭' },
    { word1: 'सूरज ☀️', word2: 'चिड़िया 🐦' },
  ];
  const [selectedWord1, setSelectedWord1] = useState('हाथी');
  const [selectedWord2, setSelectedWord2] = useState('चींटी');
  const [customWord1, setCustomWord1] = useState('');
  const [customWord2, setCustomWord2] = useState('');
  const [generatedStory, setGeneratedStory] = useState<{ title: string; story: string; poem: string; moral: string } | null>({
    title: 'नन्हे हाथी और चतुर चींटी की अनोखी दोस्ती',
    story: 'एक घने हरे-भरे जंगल में गोलू नाम का एक छोटा हाथी रहता था। वह अपनी विशाल सूंड से पानी उछालकर खेलता था। एक दिन उसके पैर में कांटा चुभ गया और वह दर्द से रोने लगा। तभी वहां से चुटकी नाम की नन्हीं चींटी गुजरी। उसने कहा, "दोस्त डरो मत, मैं तुम्हारी मदद करती हूँ!" चींटी ने अपनी होशियारी से कांटे के पास की मिट्टी हटाई और हाथी को राहत दिलाई। दोनों समझ गए कि कोई भी छोटा या बड़ा नहीं होता, सच्चा मित्र वही जो मुसीबत में काम आए!',
    poem: 'हाथी दादा बड़े बलवान,\nचींटी नन्हीं पर गुणवान!\nमिलकर करते दोनों काम,\nदोस्ती का जग में नाम!',
    moral: 'सीख: कभी किसी को छोटा न समझें। मिलकर रहने से बड़ी से बड़ी मुश्किल हल हो जाती है।'
  });
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Voice Interaction State
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceAnswer, setVoiceAnswer] = useState('नमस्ते प्यारे बच्चे! आप माइक का बटन दबाकर कुछ भी पूछ सकते हैं, जैसे: "क से क्या होता है?" या "सूरज किस दिशा में उगता है?"');
  const [isListening, setIsListening] = useState(false);

  // Picture Quiz State
  const quizItems = [
    {
      question: 'यह कौन सा फल है?',
      imageEmoji: '🍎',
      options: ['सेब (Apple)', 'आम (Mango)', 'केला (Banana)'],
      correct: 0,
      fact: 'वाह! सेब लाल और मीठा होता है, जिसे खाने से सेहत अच्छी रहती है!'
    },
    {
      question: 'यह कौन सा जंगली जानवर है?',
      imageEmoji: '🦁',
      options: ['भालू (Bear)', 'शेर (Lion)', 'हाथी (Elephant)'],
      correct: 1,
      fact: 'शाबाश! शेर जंगल का राजा कहलाता है!'
    },
    {
      question: 'यह कौन सा रंग है?',
      imageEmoji: '🟡',
      options: ['नीला (Blue)', 'पीला (Yellow)', 'हरा (Green)'],
      correct: 1,
      fact: 'अरे वाह! पीला रंग सूरज और पके आम जैसा होता है!'
    },
    {
      question: 'यह कौन सा पक्षी है?',
      imageEmoji: '🦚',
      options: ['मोर (Peacock)', 'कौआ (Crow)', 'तोता (Parrot)'],
      correct: 0,
      fact: 'बिल्कुल सही! मोर भारत का राष्ट्रीय पक्षी है, जो बारिश में नाचता है!'
    }
  ];
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Certificate State
  const [studentName, setStudentName] = useState('आरव कुमार');

  // Text-to-Speech Function
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('आपके ब्राउज़र में आवाज़ वाचन उपलब्ध नहीं है।');
      return;
    }
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when modal closes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Story Generator handler
  const handleGenerateStory = () => {
    const w1 = customWord1.trim() || selectedWord1;
    const w2 = customWord2.trim() || selectedWord2;
    setIsGeneratingStory(true);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    setTimeout(() => {
      const generated = {
        title: `${w1} और ${w2} की जादुई कहानी`,
        story: `एक सुंदर बगीचे में ${w1} खुशी-खुशी टहल रहा था। तभी उसकी मुलाकात एक प्यारे ${w2} से हुई। ${w1} ने मुस्कुराकर पूछा, "क्या तुम मेरे साथ नई चीजें सीखोगे?" ${w2} ने खुशी से हां कह दिया। दोनों ने मिलकर फूलों से बातें कीं, चिड़ियों के गीत गाए और शाम को एक-दूसरे को धन्यवाद कहा।`,
        poem: `देखो आया ${w1} प्यारा,\nसाथ में ${w2} सबसे न्यारा!\nहंसते-गाते करते सैर,\nखुशियों की है चारों ओर लहर!`,
        moral: `सीख: मित्रता और खुशमिजाजी से हर दिन एक नया उत्सव बन जाता है!`
      };
      setGeneratedStory(generated);
      setIsGeneratingStory(false);
      speakText(`${generated.title}। ${generated.story}। कविता: ${generated.poem}`);
    }, 700);
  };

  // Speech Recognition handler
  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('आपके ब्राउज़र में स्पीच रिकग्निशन सपोर्ट नहीं है। कृपया क्रोम (Chrome) का उपयोग करें या नीचे दिए गए प्रश्नों पर क्लिक करें।');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setVoiceQuery(spokenText);
      handleVoiceAnswer(spokenText);
    };

    recognition.start();
  };

  const handleVoiceAnswer = (query: string) => {
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('a for') || q.includes('ए फॉर') || q.includes('apple')) {
      reply = 'A for Apple होता है प्यारे बच्चे! Apple का मतलब सेब होता है, जो लाल रंग का और बहुत मीठा होता है!';
    } else if (q.includes('क से') || q.includes('वर्णमाला')) {
      reply = 'क से कबूतर, ख से खरगोश, ग से गमला और घ से घड़ी! क्या आप क से कबूतर की कविता सुनना चाहते हैं?';
    } else if (q.includes('पहाड़ा') || q.includes('table') || q.includes('गिनती')) {
      reply = 'दो एकम दो, दो दूनी चार, दो तिया छह, दो चौके आठ, दो पंजे दस! आप प्लान 01 में 1 से 100 तक गिनती व पहाड़ा आसानी से सीख सकते हैं!';
    } else if (q.includes('सूरज') || q.includes('sun')) {
      reply = 'सूरज हमेशा पूरब दिशा (East) से उगता है और शाम को पश्चिम (West) में ढल जाता है। सूरज हमें रोशनी और ऊर्जा देता है!';
    } else {
      reply = `अरे वाह! आपने बहुत अच्छा सवाल पूछा: "${query}"। आपका AI टीचर आपको बताता है कि रोज थोड़ा-थोड़ा पढ़ने और अभ्यास करने से आप बहुत होशियार बनेंगे!`;
    }

    setVoiceAnswer(reply);
    speakText(reply);
  };

  // Quiz Answer Handler
  const handleAnswerSelect = (optIndex: number) => {
    setSelectedAnswer(optIndex);
    const currentQ = quizItems[quizIndex];
    if (optIndex === currentQ.correct) {
      setQuizScore(prev => prev + 1);
      speakText(`शाबाश! सही जवाब! ${currentQ.fact}`);
    } else {
      speakText(`अरे कोई बात नहीं, सही उत्तर है ${currentQ.options[currentQ.correct]}!`);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    if (quizIndex < quizItems.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      speakText(`बधाई हो! आपने क्विज पूरा कर लिया और ${quizScore + 1} अंक प्राप्त किए!`);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-950 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🧒
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/40 text-[10px] font-black uppercase tracking-wider text-slate-900">
                <Sparkles className="w-3 h-3 text-orange-700" />
                <span>Plan 01 • Bal Vikas AI Teacher</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
                AI बाल शिक्षक व फन कॉर्नर (Fun Learning)
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/30 hover:bg-white/50 text-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Feature Tabs */}
        <div className="flex border-b border-slate-200 bg-amber-50/70 p-2 gap-1.5 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('story')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'story'
                ? 'bg-orange-500 text-white shadow-md font-black'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span>📖 जादुई कहानी जेनरेटर</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'voice'
                ? 'bg-orange-500 text-white shadow-md font-black'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span>🎙️ बोलकर पूछें (Voice Mic)</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-orange-500 text-white shadow-md font-black'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span>🎯 चित्र व रंग क्विज</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'certificate'
                ? 'bg-orange-500 text-white shadow-md font-black'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span>⭐ स्टार सर्टिफिकेट</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: 2-WORD STORY GENERATOR */}
          {activeTab === 'story' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">✨ 2 शब्द चुनें और AI से नई कहानी बनवाएं:</span>
                  <span className="text-[11px] text-slate-500">बच्चे को कल्पनाशील बनाने का सबसे आसान तरीका!</span>
                </div>
                <span className="text-2xl">🪄</span>
              </div>

              {/* Ready Pairs Chips */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">सुझाए गए शब्द जोड़े (Click to Select):</span>
                <div className="flex flex-wrap gap-2">
                  {wordPairs.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedWord1(p.word1.split(' ')[0]);
                        setSelectedWord2(p.word2.split(' ')[0]);
                        setCustomWord1('');
                        setCustomWord2('');
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50 text-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>{p.word1}</span>
                      <span className="text-slate-400">+</span>
                      <span>{p.word2}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Word Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">पहला शब्द (Word 1):</label>
                  <input
                    type="text"
                    value={customWord1 || selectedWord1}
                    onChange={(e) => setCustomWord1(e.target.value)}
                    placeholder="उदा. हाथी, तितली, चाँद"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">दूसरा शब्द (Word 2):</label>
                  <input
                    type="text"
                    value={customWord2 || selectedWord2}
                    onChange={(e) => setCustomWord2(e.target.value)}
                    placeholder="उदा. चींटी, आम, तारा"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Generate Story Button */}
              <button
                onClick={handleGenerateStory}
                disabled={isGeneratingStory}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {isGeneratingStory ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI कहानी लिख रहा है...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>जादुई कहानी और कविता बनाएं (Create Story)</span>
                  </>
                )}
              </button>

              {/* Generated Story Box */}
              {generatedStory && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-orange-50/70 to-amber-50/50 border-2 border-orange-200 shadow-md space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black text-orange-950 flex items-center gap-2">
                      <span>📖</span>
                      <span>{generatedStory.title}</span>
                    </h3>

                    <button
                      onClick={() => speakText(`${generatedStory.title}। ${generatedStory.story}। कविता: ${generatedStory.poem}`)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isSpeaking
                          ? 'bg-red-500 text-white'
                          : 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span>{isSpeaking ? 'आवाज़ बंद करें' : 'बोलकर सुनाएं'}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {generatedStory.story}
                  </p>

                  {/* Rhyming Poem Box */}
                  <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-inner">
                    <span className="text-[10px] font-black uppercase text-orange-600 block mb-1">
                      🎵 4-लाइन बाल कविता (Poem):
                    </span>
                    <pre className="text-xs font-bold text-slate-800 font-sans whitespace-pre-line leading-relaxed">
                      {generatedStory.poem}
                    </pre>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <Star className="w-4 h-4 text-emerald-700 shrink-0 fill-emerald-600" />
                    <span>{generatedStory.moral}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VOICE-BASED LEARNING (बोलकर पूछें) */}
          {activeTab === 'voice' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-purple-50 rounded-3xl border border-purple-200 space-y-2">
                <span className="text-3xl block">🎙️</span>
                <h3 className="text-base font-black text-purple-950">
                  माइक दबाएं और अपने AI टीचर से बोलकर पूछें!
                </h3>
                <p className="text-xs text-purple-700 max-w-md mx-auto">
                  छोटे बच्चे जो टाइप नहीं कर सकते, वे बोलकर कुछ भी पूछ सकते हैं जैसे: "A for क्या होता है?", "क से क्या होता है?", "पहाड़ा सुनाएं!"
                </p>
              </div>

              {/* Big Interactive Mic Button */}
              <div className="py-4">
                <button
                  onClick={startVoiceInput}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl transition-all ${
                    isListening
                      ? 'bg-red-600 animate-ping ring-8 ring-red-300'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600 hover:scale-105 active:scale-95 shadow-purple-600/40'
                  }`}
                >
                  {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                </button>
                <span className="text-xs font-bold text-slate-600 block mt-3">
                  {isListening ? '🔴 ध्यान से सुन रहे हैं... बोलिए!' : 'माइक दबाकर बोलना शुरू करें'}
                </span>
              </div>

              {/* Quick Sample Questions Buttons */}
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-slate-600 block">या एक क्लिक में पूछें:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'A for क्या होता है?',
                    'क से ज्ञ तक वर्णमाला सुनाएं',
                    '2 का पहाड़ा (Table) सुनाएं',
                    'सूरज किस दिशा से निकलता है?'
                  ].map((sampleQ, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setVoiceQuery(sampleQ);
                        handleVoiceAnswer(sampleQ);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-xs font-bold text-slate-800 text-left transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{sampleQ}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Answer Box */}
              {voiceAnswer && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-indigo-600" />
                      <span>AI शिक्षक का उत्तर:</span>
                    </span>
                    <button
                      onClick={() => speakText(voiceAnswer)}
                      className="text-xs text-indigo-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>फिर से सुनें</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {voiceAnswer}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COLOR & PICTURE QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {!quizCompleted ? (
                <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/60 border-2 border-amber-200 space-y-4">
                  
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>प्रश्न {quizIndex + 1} / {quizItems.length}</span>
                    <span className="flex items-center gap-1 text-amber-700 font-black">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>स्कोर: {quizScore} स्टार्स</span>
                    </span>
                  </div>

                  {/* Big Image Emoji Display */}
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-white border-2 border-amber-300 shadow-md flex items-center justify-center text-6xl">
                    {quizItems[quizIndex].imageEmoji}
                  </div>

                  <h3 className="text-center text-base sm:text-lg font-black text-slate-900">
                    {quizItems[quizIndex].question}
                  </h3>

                  {/* 3 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {quizItems[quizIndex].options.map((opt, idx) => {
                      const isChosen = selectedAnswer === idx;
                      const isCorrect = idx === quizItems[quizIndex].correct;
                      
                      let btnStyle = 'bg-white border-slate-300 hover:border-amber-400 text-slate-800';
                      if (selectedAnswer !== null) {
                        if (isCorrect) btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-black';
                        else if (isChosen) btnStyle = 'bg-red-500 text-white border-red-600';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={selectedAnswer !== null}
                          onClick={() => handleAnswerSelect(idx)}
                          className={`p-3 rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all shadow-sm ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Fact & Next Button */}
                  {selectedAnswer !== null && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                      <p className="text-xs font-bold text-slate-700">
                        {quizItems[quizIndex].fact}
                      </p>
                      <button
                        onClick={handleNextQuiz}
                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow transition-colors shrink-0"
                      >
                        अगला प्रश्न →
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                /* Quiz Complete Screen */
                <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-100 to-orange-50 border-2 border-amber-300 text-center space-y-4">
                  <div className="text-5xl animate-bounce">🏆</div>
                  <h3 className="text-xl font-black text-slate-900">
                    बहुत खूब! आपने क्विज पूरा कर लिया!
                  </h3>
                  <p className="text-xs text-slate-600">
                    आपने कुल {quizItems.length} में से {quizScore} प्रश्नों के सही उत्तर दिए!
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={resetQuiz}
                      className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                    >
                      दोबारा खेलें
                    </button>
                    <button
                      onClick={() => setActiveTab('certificate')}
                      className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700"
                    >
                      सर्टिफिकेट डाउनलोड करें →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GAMIFIED STAR LEARNER CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-100 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span className="text-xs font-bold text-slate-800">विद्यार्थी का नाम दर्ज करें:</span>
                </div>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="बच्चे का नाम लिखें"
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-60"
                />
              </div>

              {/* Printable / Downloadable Certificate Card */}
              <div id="star-certificate" className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-amber-50 via-white to-orange-50 border-4 border-amber-400 shadow-xl text-center space-y-3">
                <div className="flex justify-between items-center text-xs text-amber-700 font-bold border-b border-amber-200 pb-2">
                  <span>IOIS डिजिटल शिक्षा मिशन</span>
                  <span>प्रमाणपत्र सं: IOIS-BV-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>

                <div className="text-4xl pt-2">🌟</div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  बाल विकास स्टार लर्नर सर्टिफिकेट
                </h3>

                <p className="text-xs text-slate-600">यह प्रमाणित किया जाता है कि होनहार छात्र/छात्रा</p>

                <div className="py-1">
                  <span className="text-2xl sm:text-3xl font-black text-orange-600 underline decoration-amber-400 decoration-wavy">
                    {studentName || 'प्रिय विद्यार्थी'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                  ने IOIS बाल विकास मंच (Plan 01) के तहत सचित्र वर्णमाला, गिनती, जादुई कहानियां और डिजिटल अक्षर ट्रेसिंग सफलतापूर्वक पूरी की है।
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-amber-200 text-[11px] text-slate-500 font-bold">
                  <span>मान्यता: IOIS Platform • IOIS India</span>
                  <span>दिनांक: {new Date().toLocaleDateString('hi-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>सर्टिफिकेट प्रिंट / सेव करें</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span>हेल्पलाइन: <strong>8877490845</strong></span>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
              onOpenStudyPage('plan-01');
            }}
            className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <span>प्लान 01 स्टडी हब खोलें →</span>
          </button>
        </div>

      </div>
    </div>
  );
};
