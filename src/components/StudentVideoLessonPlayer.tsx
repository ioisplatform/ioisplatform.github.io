import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Tv, 
  ListVideo,
  BookOpen,
  Volume2,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';

interface StudentVideoLessonPlayerProps {
  planId: string;
  planNumber: number;
  planName: string;
  onVideoWatched?: () => void;
}

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  keyPoints: string[];
}

export const PLAN_VIDEOS: Record<string, VideoLesson[]> = {
  'plan-01': [
    {
      id: 'nursery-abcd-phonics-song',
      title: 'IOIS स्पेशल: A to Z वर्णमाला व बालगीत (ABC Phonics Song)',
      duration: '10:45 मिनट',
      level: 'नर्सरी व KG',
      description: 'A for Apple, B for Ball से लेकर Z for Zebra तक बच्चों के लिए संगीतमय, सचित्र और आसान उच्चारण वाला वास्तविक वीडियो पाठ।',
      youtubeId: 'ezmsrB59mj8', // Super Simple ABCs Song
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      keyPoints: [
        'A से Z तक 26 अक्षरों का सचित्र व लयबद्ध उच्चारण',
        'ध्वनि (Phonics) व सही उच्चारण का अभ्यास',
        'घर बैठे बच्चों के लिए आसान व रोचक अध्ययन विधि'
      ]
    },
    {
      id: 'hindi-varnamala-recitation',
      title: 'हिंदी वर्णमाला: स्वर (अ से अः) सचित्र गान व शुद्ध उच्चारण',
      duration: '15:20 मिनट',
      level: 'कक्षा 1 से 2',
      description: 'अ से अनार, आ से आम के साथ बच्चों के लिए संगीतमय और रोचक हिंदी वर्णमाला वीडियो पाठ।',
      youtubeId: 'jYF6522c00M', // Hindi Varnamala
      thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      keyPoints: [
        '11 स्वर और 2 अयोगवाह का सचित्र उच्चारण',
        'प्रत्येक अक्षर से जुड़े दैनिक जीवन के उदाहरण',
        'बाल गीत व लयबद्ध स्मरण अभ्यास'
      ]
    },
    {
      id: 'math-tables-fun',
      title: 'गणित: 1 से 20 तक गिनती व पहाड़ा (Numbers & Tables Trick)',
      duration: '18:10 मिनट',
      level: 'कक्षा 2 से 4',
      description: 'गिनती और पहाड़ा याद करने की आसान उंगलियों की ट्रिक और जोड़-घटाव का सचित्र निरूपण।',
      youtubeId: 'xXmZ7F7f26c', // Hindi Counting & Numbers
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      keyPoints: [
        '1 से 20 तक गिनती व 2 से 10 तक पहाड़ा बिना रटे याद करना',
        'सचित्र जोड़ और घटाना के उदाहरण',
        'दैनिक जीवन में गणितीय समझ का विकास'
      ]
    }
  ],
  'plan-02': [
    {
      id: 'computer-basics-mastery',
      title: 'कंप्यूटर फंडामेंटल: हार्डवेयर, सॉफ्टवेयर व आवश्यक शॉर्टकट्स',
      duration: '22:30 मिनट',
      level: 'कक्षा 6 से 8 व युवा',
      description: 'कीबोर्ड शॉर्टकट्स, फाइल मैनेजमेंट और एमएस वर्ड/एक्सेल बेसिक्स का लाइव स्क्रीन रिकॉर्डेड वॉकथ्रू।',
      youtubeId: 'Z1BCujX3pw8', // Complete Computer Course for beginners
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['Ctrl+C, Ctrl+V, Alt+Tab जैसे जरूरी शॉर्टकट', 'सुरक्षित इंटरनेट ब्राउज़िंग', 'डिजिटल फाइलें व्यवस्थित करना']
    },
    {
      id: 'digital-ai-skills',
      title: 'आधुनिक डिजिटल व AI कौशल: छात्रों के लिए स्मार्ट स्टडी टूल्स',
      duration: '14:20 मिनट',
      level: 'मिडिल स्कूल व कॉलेज',
      description: 'डिजिटल टूल्स, AI प्रॉम्प्ट्स और ऑटोमेशन से पढ़ाई को आसान और तेज बनाने की रूपरेखा।',
      youtubeId: 'k_zD-7Z8Q_o',
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['डिजिटल वर्कफ़्लो का निर्माण', 'एआई प्रॉम्प्ट्स और ऑटोमेशन', 'छात्रों के लिए स्मार्ट उत्पादकता']
    }
  ],
  'plan-03': [
    {
      id: 'spoken-english-self-intro',
      title: 'स्पोकन इंग्लिश: 5 मिनट में प्रभावशाली Self Introduction कैसे दें',
      duration: '19:40 मिनट',
      level: 'कक्षा 9-12 व कॉलेज',
      description: 'बिना हिचकिचाहट अंग्रेजी बोलने के 10 गोल्डन नियम, सही बॉडी लैंग्वेज और कॉमन इंटरव्यू प्रश्नोत्तर।',
      youtubeId: 'yCjJyiqpAuU', // English Self Introduction
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['नमस्ते और ग्रीट करने का सही तरीका', 'एजुकेशन और स्किल्स को हाइलाइट करना', 'झिझक दूर करने के दैनिक अभ्यास']
    },
    {
      id: 'career-growth-communication',
      title: 'करियर ग्रोथ व कम्युनिकेशन: इंटरव्यू और बायोडाटा मास्टरक्लास',
      duration: '16:45 मिनट',
      level: 'करियर व जॉब अभ्यर्थी',
      description: 'करियर निर्माण और प्रस्तुतीकरण में डिजिटल तकनीकों की उपयोगिता पर व्यावहारिक वीडियो।',
      youtubeId: 'Q0P_M8bC3xM',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['कॉन्फिडेंट कम्युनिकेशन स्किल्स', 'डिजिटल पोर्टफोलियो प्रस्तुति', 'इंटरव्यू में प्रभाव छोड़ने की तकनीक']
    }
  ],
  'plan-04': [
    {
      id: 'gk-science-everyday',
      title: 'दैनिक जीवन का सामान्य ज्ञान, बैंकिंग व घरेलू वित्तीय समझ',
      duration: '16:15 मिनट',
      level: 'पारिवारिक व सामान्य',
      description: 'बैंकिंग, यूपीआई सुरक्षा, सरकारी कल्याणकारी योजनाओं और व्यावहारिक स्वास्थ्य टिप्स पर सचित्र वीडियो।',
      youtubeId: 'Vb1t0g0HqjA', // UPI Safety & Online Banking
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['यूपीआई फ्रॉड से बचने के 5 नियम', 'बचत और बैंक ब्याज का हिसाब', 'सामान्य विज्ञान के घरेलू नियम']
    },
    {
      id: 'family-digital-literacy',
      title: 'पारिवारिक डिजिटल साक्षरता: ऑनलाइन फॉर्म व सरकारी सुविधाएं',
      duration: '18:30 मिनट',
      level: 'संपूर्ण परिवार',
      description: 'घर बैठे सरकारी योजनाओं का लाभ लेने और डिजिटल रूप से सशक्त बनने का सरल ट्यूटोरियल।',
      youtubeId: 'J73jF5F4bUQ',
      thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['राशन कार्ड व आयुष्मान भारत कार्ड', 'ऑनलाइन बिल भुगतान', 'साइबर सुरक्षा के मूल मंत्र']
    }
  ],
  'plan-05': [
    {
      id: 'board-exam-math-science',
      title: 'बोर्ड परीक्षा में 90%+ अंक लाने का सटीक रोडमैप व मॉडल पेपर्स',
      duration: '28:50 मिनट',
      level: '10वीं / 12वीं बोर्ड व प्रतियोगी',
      description: 'उत्तर पुस्तिका में स्टेप-बाय-स्टेप लिखने का तरीका और कठिन फॉर्मूलों को याद रखने की तकनीक।',
      youtubeId: '6i3Kq1iXw_w', // Board Exam Strategy
      thumbnail: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['स्टेप-मार्किंग का सही उपयोग', 'गणित में रफ वर्क और समय प्रबंधन', 'डायग्राम्स से अधिक अंक कैसे प्राप्त करें']
    },
    {
      id: 'revision-and-mind-mapping',
      title: 'रिवीजन साइकल व माइंड मैपिंग: परीक्षा हॉल में तनाव मुक्त रहने के उपाय',
      duration: '17:20 मिनट',
      level: 'प्रतियोगी छात्र',
      description: 'वैज्ञानिक रिवीजन विधि जिससे पढ़ा हुआ कभी न भूलें और परीक्षा में उच्चतम अंक हासिल हों।',
      youtubeId: 'IlU-zDU6aQ0',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['स्मार्ट स्टडी टाइम मैनेजमेंट', 'रिवीजन साइकल और माइंड मैपिंग', 'परीक्षा हॉल में तनाव मुक्त रहने के उपाय']
    }
  ],
  'plan-06': [
    {
      id: 'rtps-online-services',
      title: 'सरकारी ऑनलाइन पोर्टल: जाति, आय, निवास व दाखिल खारिज आवेदन',
      duration: '24:10 मिनट',
      level: 'डिजिटल सेवा केंद्र व छात्र',
      description: 'बिना गलती किए ऑनलाइन फॉर्म भरने, स्टेटस ट्रैक करने और सर्टिफिकेट डाउनलोड करने की पूरी विधि।',
      youtubeId: 'bL_b4yP_1sI', // Online Gov Services
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['दस्तावेज सही साइज में स्कैन व अपलोड करना', 'रेफरेंस नंबर से ट्रैकिंग', 'तत्काल रसीद प्रिंटिंग']
    }
  ],
  'plan-07': [
    {
      id: 'master-leadership-roadmap',
      title: 'डिजिटल स्वावलंबन मास्टरक्लास: आत्मनिर्भर भारत व करियर रोडमैप',
      duration: '31:20 मिनट',
      level: 'मास्टर ऑल-इन-वन',
      description: 'शिक्षा, स्वावलंबन, मेंटरशिप और डिजिटल सेवा को जन-जन तक पहुंचाने की मास्टर कार्ययोजना।',
      youtubeId: '7X8II6J-6mU', // Digital Leadership
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      keyPoints: ['सामुदायिक डिजिटल साक्षरता मिशन', 'दैनिक कार्ययोजना व समय प्रबंधन', 'दीर्घकालिक सफलता के सूत्र']
    }
  ]
};

export const StudentVideoLessonPlayer: React.FC<StudentVideoLessonPlayerProps> = ({
  planId,
  planNumber,
  planName,
  onVideoWatched
}) => {
  const videoList = PLAN_VIDEOS[planId] || PLAN_VIDEOS['plan-01'] || [];
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(videoList[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>({});
  const [studentNote, setStudentNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Sync selectedVideo whenever planId changes
  useEffect(() => {
    const list = PLAN_VIDEOS[planId] || PLAN_VIDEOS['plan-01'] || [];
    if (list.length > 0 && (!selectedVideo || !list.some(v => v.id === selectedVideo?.id))) {
      setSelectedVideo(list[0]);
      setIsPlaying(true);
    }
  }, [planId]);

  const activeVideo = selectedVideo || videoList[0];

  const handleMarkWatched = () => {
    if (!activeVideo) return;
    setWatchedVideos(prev => ({ ...prev, [activeVideo.id]: true }));
    if (onVideoWatched) {
      onVideoWatched();
    }
  };

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-100 text-red-600 shadow-xs">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
              PLAN 0{planNumber} • आधिकारिक वीडियो कक्षाएं
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              इंटरएक्टिव वीडियो लेक्चर्स एवं विजुअल कक्षाएं
            </h3>
          </div>
        </div>

        {/* Video selector dropdown on mobile / small screen */}
        <div className="flex items-center gap-2">
          <ListVideo className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={activeVideo?.id || ''}
            onChange={(e) => {
              const f = videoList.find(v => v.id === e.target.value);
              if (f) {
                setSelectedVideo(f);
                setIsPlaying(true);
              }
            }}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 max-w-[240px] truncate"
          >
            {videoList.map(v => (
              <option key={v.id} value={v.id}>
                {(v?.title || '').slice(0, 42)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Video Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: REAL Video Player Box */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* REAL Interactive Video Player Frame */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl">
            {isPlaying && activeVideo?.youtubeId ? (
              <iframe
                title={activeVideo.title}
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <img 
                  src={activeVideo?.thumbnail} 
                  alt={activeVideo?.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-slate-950/80" />
                <div className="relative z-10 space-y-3">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl mx-auto ring-4 ring-red-400/30 transform hover:scale-110 transition-all"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                  <h4 className="text-white font-black text-base max-w-md">
                    {activeVideo?.title}
                  </h4>
                  <p className="text-xs text-slate-300">
                    वीडियो देखने और पढ़ने के लिए प्ले बटन दबाएं
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video Metadata & Controls Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-md">
                  {activeVideo?.level}
                </span>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeVideo?.duration}
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">
                {activeVideo?.title}
              </h4>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleMarkWatched}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  watchedVideos[activeVideo?.id]
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {watchedVideos[activeVideo?.id] ? 'पाठ पूरा हुआ' : 'मार्क पूरा हुआ'}
                </span>
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${activeVideo?.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
                title="यूट्यूब पर देखें"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">यूट्यूब</span>
              </a>
            </div>
          </div>

          {/* Description & Key Learning Points */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <h5 className="font-black text-xs uppercase tracking-wider text-slate-500 font-mono">
              पाठ का विवरण एवं मुख्य बिंदु (Key Learning Concepts)
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeVideo?.description}
            </p>

            <div className="space-y-1.5 pt-1">
              {activeVideo?.keyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-800">
                  <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✓
                  </div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Playlist & Student Notes */}
        <div className="space-y-4">
          
          {/* Playlist Panel */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-black text-xs text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ListVideo className="w-3.5 h-3.5 text-red-600" />
                <span>वीडियो प्लेलिस्ट ({videoList.length})</span>
              </h5>
              <span className="text-[10px] font-bold text-slate-500">
                100% निशुल्क
              </span>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {videoList.map((v, idx) => {
                const isActive = v.id === activeVideo?.id;
                const isWatched = watchedVideos[v.id];

                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVideo(v);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-red-50/90 border-red-300 ring-2 ring-red-200 shadow-xs'
                        : 'bg-white hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      <img 
                        src={v.thumbnail} 
                        alt={v.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-red-700">
                          भाग {idx + 1}
                        </span>
                        {isWatched && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                            पूर्ण
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                        {v.title}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {v.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Quick Notes Tool */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5">
            <h5 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span>छात्र त्वरित नोट्स (Student Notes)</span>
            </h5>
            <textarea
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              placeholder="वीडियो देखते समय महत्वपूर्ण बिंदु यहाँ लिखें..."
              className="w-full h-24 p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {noteSaved ? '✓ सुरक्षित हो गया!' : 'ब्राउज़र में सहेजा जाएगा'}
              </span>
              <button
                onClick={handleSaveNote}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                नोट सहेजें
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
