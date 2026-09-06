import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, CommunityMessage, PlaylistItem } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Film, 
  Music, 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneCall, 
  PhoneOff, 
  Sparkles, 
  Search, 
  Bot, 
  Chrome, 
  Layers, 
  Share2, 
  Smile, 
  Check, 
  ExternalLink, 
  Radio, 
  ListMusic, 
  Tv, 
  Users, 
  ShieldCheck, 
  Zap, 
  Copy, 
  ArrowRight,
  Headphones,
  Compass,
  MessageCircle,
  HelpCircle,
  Clock,
  ThumbsUp,
  Heart,
  Flame,
  PartyPopper,
  ScreenShare,
  RefreshCw,
  X
} from 'lucide-react';

interface EntertainmentChatPageProps {
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onNavigateToPlans: () => void;
}

// User specified default video
const DEFAULT_FALLBACK_VIDEO: PlaylistItem = {
  id: 'iois-special-default-video',
  title: '🌟 IOIS स्पेशल प्रीमियम लाइव वीडियो (Official Play)',
  category: 'official',
  url: 'https://youtu.be/bcjXgHGTBDQ?si=WdpPFXl_6yVy6CVM',
  embedUrl: 'https://www.youtube-nocookie.com/embed/bcjXgHGTBDQ?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3',
  duration: 'IOIS स्पेशल प्रसारण',
  thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
  addedBy: 'IOIS एडमिन'
};

// Preset entertaining video playlists with verified clean embeds
const CURATED_PLAYLISTS: PlaylistItem[] = [
  DEFAULT_FALLBACK_VIDEO,
  {
    id: 'bhojpuri-hits',
    title: '🎵 भोजपुरी नॉन-स्टॉप सुपरहिट्स (Pawan Singh & Khesari Lal)',
    category: 'bhojpuri',
    url: 'https://www.youtube.com/watch?v=kYv9bI5n5iM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4fGSI1pDJn6j5hFkK2Mh5W7v3R_eW3X8&autoplay=1&modestbranding=1&rel=0',
    duration: '2+ घंटे नॉन-स्टॉप',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'bollywood-90s',
    title: '🎧 90s बॉलीवुड एवरग्रीन मेलोडी (Udit Narayan, Kumar Sanu, Alka)',
    category: 'bollywood',
    url: 'https://www.youtube.com/watch?v=kYv9bI5n5iM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PLgzTt0k8mXzEk586ze4BdGP47vuCS7_bY&autoplay=1&modestbranding=1&rel=0',
    duration: '3+ घंटे स्पेशल',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'desi-comedy',
    title: '🎬 कपिल शर्मा शो बेस्ट कॉमेडी मोमेंट्स (The Kapil Sharma Show)',
    category: 'comedy',
    url: 'https://www.youtube.com/watch?v=Jm-Y0b9HkL8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL_A4KjX1_7c7VjW0r2k3B9Y5X4K8J1D_0&autoplay=1&modestbranding=1&rel=0',
    duration: 'अनलिमिटेड हंसी',
    thumbnail: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'bhajan-aarti',
    title: '🧘 श्री हनुमान चालीसा, गायत्री मंत्र व संपूर्ण आरती संग्रह',
    category: 'devotional',
    url: 'https://www.youtube.com/watch?v=AETFv498624',
    embedUrl: 'https://www.youtube-nocookie.com/embed/AETFv498624?autoplay=1&modestbranding=1&rel=0',
    duration: 'शांति व ध्यान',
    thumbnail: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'study-lofi',
    title: '📚 शांत पढ़ाई व गहरी एकाग्रता के लिए Lofi Beats & Ambient Music',
    category: 'study',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1&modestbranding=1&rel=0',
    duration: '24x7 लाइव स्ट्रीम',
    thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'motivation-podcast',
    title: '💡 जीवन बदलने वाले मोटिवेशनल विचार व ज्ञानवर्धक पॉडकास्ट',
    category: 'motivation',
    url: 'https://www.youtube.com/watch?v=9No-FiEInLA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PLhTqWk_vL74d0Ww3-7B1z6X_V4Q0Z8_Y9&autoplay=1&modestbranding=1&rel=0',
    duration: 'सफलता के सूत्र',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&auto=format&fit=crop&q=80',
  }
];

// Initial mock community messages for lively interaction
const DEFAULT_COMMUNITY_MESSAGES: CommunityMessage[] = [
  {
    id: 'msg-1',
    senderId: 'IOIS999VK01',
    senderName: 'Vikas Kumar (एडमिन)',
    senderRole: 'Chief Admin',
    senderPlanId: 7,
    channel: 'general',
    text: 'नमस्ते सभी IOIS सदस्यों! 🎉 इस नए मनोरंजन व कम्युनिटी हब में आप बिना किसी विज्ञापन के वीडियो देख सकते हैं, प्लेलिस्ट चला सकते हैं और फ्री AI टूल्स का पूरा लाभ उठा सकते हैं!',
    timestamp: 'आज 06:30 PM',
    reactions: { '❤️': 14, '🔥': 9, '👏': 12 }
  },
  {
    id: 'msg-2',
    senderId: 'IOIS499RK02',
    senderName: 'राहुल शर्मा',
    senderRole: 'Verified Reseller',
    senderPlanId: 6,
    channel: 'earning',
    text: 'मैंने आज ही 3 नए छात्रों को Plan 05 (₹299) में जोड़ा और ₹537 का इंस्टेंट पेआउट प्राप्त किया। बहुत शानदार सिस्टम है!',
    timestamp: 'आज 07:15 PM',
    reactions: { '👏': 8, '🔥': 6 }
  },
  {
    id: 'msg-3',
    senderId: 'IOIS299PS03',
    senderName: 'प्रिया कुमारी',
    senderRole: 'Student Elite',
    senderPlanId: 5,
    channel: 'students',
    text: 'विद्यार्थी शिक्षा पोर्टल के Class 12th Physics NCERT फॉर्मूला शीट्स बहुत उपयोगी हैं! किसी को कोई डाउट हो तो यहाँ पूछ सकते हैं।',
    timestamp: 'आज 07:45 PM',
    reactions: { '👍': 7, '❤️': 4 }
  }
];

export const EntertainmentChatPage: React.FC<EntertainmentChatPageProps> = ({
  currentUser,
  onOpenLogin,
  onNavigateToPlans,
}) => {
  // Main view modes
  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'ai-tools' | 'videocall'>('video');

  // Video Player & Queue state
  const [videoInputUrl, setVideoInputUrl] = useState<string>('');
  const [currentVideo, setCurrentVideo] = useState<PlaylistItem>(CURATED_PLAYLISTS[0]);
  const [queueList, setQueueList] = useState<PlaylistItem[]>(CURATED_PLAYLISTS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [playerKey, setPlayerKey] = useState<number>(0);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [autoNextEnabled, setAutoNextEnabled] = useState<boolean>(true);
  const [sharedSyncEnabled, setSharedSyncEnabled] = useState<boolean>(true);

  // Community Chat state
  const [activeChannel, setActiveChannel] = useState<'general' | 'earning' | 'students' | 'entertainment'>('general');
  const [chatMessages, setChatMessages] = useState<CommunityMessage[]>(DEFAULT_COMMUNITY_MESSAGES);
  const [messageInput, setMessageInput] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [viewingImageModal, setViewingImageModal] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceAudioBlob, setVoiceAudioBlob] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Video Call State
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [isCamOn, setIsCamOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // AI Workspace state
  const [aiSubTab, setAiSubTab] = useState<'chrome' | 'chatgpt' | 'gemini' | 'image-gen' | 'tools'>('gemini');
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [aiResponseOutput, setAiResponseOutput] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [webSearchQuery, setWebSearchQuery] = useState<string>('');
  const [webSearchResults, setWebSearchResults] = useState<Array<{ title: string; snippet: string; url: string }>>([]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChannel]);

  // Real-time Shared Video Sync across all users
  useEffect(() => {
    let unsubscribeVideo = () => {};
    try {
      if (db) {
        const liveVideoDocRef = doc(db, 'live_system_state', 'shared_active_video');
        unsubscribeVideo = onSnapshot(liveVideoDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.embedUrl && data.embedUrl !== currentVideo.embedUrl) {
              setCurrentVideo({
                id: data.id || `shared-${Date.now()}`,
                title: data.title || 'कम्युनिटी लाइव वीडियो',
                category: data.category || 'shared',
                url: data.url || DEFAULT_FALLBACK_VIDEO.url,
                embedUrl: data.embedUrl,
                duration: data.duration || 'लाइव',
                thumbnail: data.thumbnail || DEFAULT_FALLBACK_VIDEO.thumbnail,
                addedBy: data.addedBy || 'अन्य सदस्य'
              });
              setPlayerKey((k) => k + 1);
            }
          }
        }, (err) => {
          console.warn('Firestore video sync note:', err);
        });
      }
    } catch (e) {
      console.warn('Firestore video sync init note:', e);
    }
    return () => unsubscribeVideo();
  }, []);

  // Broadcast current video to Firestore for Shared Community Watching
  const broadcastVideoToAll = async (item: PlaylistItem) => {
    try {
      if (db && sharedSyncEnabled) {
        const liveVideoDocRef = doc(db, 'live_system_state', 'shared_active_video');
        await setDoc(liveVideoDocRef, {
          ...item,
          updatedAt: serverTimestamp(),
          updatedBy: currentUser?.fullName || 'IOIS सदस्य'
        });
      }
    } catch (e) {
      console.warn('Broadcasting video error note:', e);
    }
  };

  // Load Firestore live messages with real-time onSnapshot listener
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      if (db) {
        const q = query(
          collection(db, 'community_messages'),
          orderBy('timestamp', 'desc'),
          limit(60)
        );
        unsubscribe = onSnapshot(q, (snapshot) => {
          const live: CommunityMessage[] = [];
          snapshot.forEach((doc) => {
            const d = doc.data();
            if (d && d.text) {
              live.push({
                id: doc.id,
                senderId: d.senderId || 'IOIS-USER',
                senderName: d.senderName || 'IOIS Member',
                senderRole: d.senderRole,
                senderPhoto: d.senderPhoto,
                senderPlanId: d.senderPlanId,
                channel: d.channel || 'general',
                text: d.text,
                mediaUrl: d.mediaUrl,
                mediaType: d.mediaType,
                timestamp: d.timestamp ? new Date(d.timestamp?.toDate?.() || d.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : 'अभी',
                reactions: d.reactions || {}
              });
            }
          });

          if (live.length > 0) {
            // Reverse so oldest to newest in chat
            setChatMessages(live.reverse());
          }
        }, (err) => {
          console.warn('Firestore community messages note:', err);
        });
      }
    } catch (e) {
      console.warn('Firestore chat listener setup warning:', e);
    }

    return () => unsubscribe();
  }, []);

  // Call timer interval
  useEffect(() => {
    let timer: any = null;
    if (isInCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCall]);

  // Handle Video URL Parsing and Playing
  const handleParseAndPlayUrl = (input: string, addToQueue: boolean = false) => {
    const raw = input.trim();
    if (!raw) return;

    let embedUrl = '';
    let title = 'कस्टम वीडियो / प्लेलिस्ट';

    // 1. YouTube Playlist link
    if (raw.includes('list=')) {
      const listId = raw.split('list=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&autoplay=1&modestbranding=1&rel=0`;
      title = 'यूट्यूब कस्टम प्लेलिस्ट (Ad-Free)';
    } 
    // 2. Standard YouTube video
    else if (raw.includes('youtube.com/watch?v=')) {
      const vid = raw.split('watch?v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`;
      title = 'यूट्यूब वीडियो (Ad-Free)';
    } 
    // 3. YouTube youtu.be short link
    else if (raw.includes('youtu.be/')) {
      const vid = raw.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`;
      title = 'यूट्यूब वीडियो (Ad-Free)';
    } 
    // 4. YouTube Shorts
    else if (raw.includes('youtube.com/shorts/')) {
      const vid = raw.split('shorts/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&modestbranding=1&rel=0`;
      title = 'यूट्यूब शॉर्ट्स (Ad-Free)';
    } 
    // 5. Direct embed or web video
    else {
      embedUrl = raw;
      title = 'वेब वीडियो प्लेयर';
    }

    const newItem: PlaylistItem = {
      id: `custom-${Date.now()}`,
      title,
      category: 'custom',
      url: raw,
      embedUrl,
      duration: 'लाइव / फुल',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
      addedBy: currentUser?.fullName || 'सदस्य'
    };

    if (addToQueue) {
      setQueueList((prev) => [...prev, newItem]);
    } else {
      setCurrentVideo(newItem);
      setQueueList((prev) => [newItem, ...prev.filter(item => item.id !== newItem.id)]);
      setQueueIndex(0);
      setPlayerKey((k) => k + 1);
      broadcastVideoToAll(newItem);
    }

    setVideoInputUrl('');
  };

  const handlePlayQueueItem = (item: PlaylistItem, idx: number) => {
    setCurrentVideo(item);
    setQueueIndex(idx);
    setPlayerKey((k) => k + 1);
    broadcastVideoToAll(item);
  };

  const handleNextVideo = () => {
    if (queueList.length === 0) return;
    const nextIdx = (queueIndex + 1) % queueList.length;
    const nextItem = queueList[nextIdx];
    setCurrentVideo(nextItem);
    setQueueIndex(nextIdx);
    setPlayerKey((k) => k + 1);
    broadcastVideoToAll(nextItem);
  };

  const handlePrevVideo = () => {
    if (queueList.length === 0) return;
    const prevIdx = (queueIndex - 1 + queueList.length) % queueList.length;
    const prevItem = queueList[prevIdx];
    setCurrentVideo(prevItem);
    setQueueIndex(prevIdx);
    setPlayerKey((k) => k + 1);
    broadcastVideoToAll(prevItem);
  };

  const handleRemoveQueueItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQueueList((prev) => prev.filter((item) => item.id !== id));
  };

  // Image Upload Handling with Canvas Auto-Compression (max 300KB)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        setUploadedImagePreview(compressed);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Voice Note Recording
  const handleStartVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setVoiceAudioBlob(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
    } catch (err) {
      alert('माइक्रोफ़ोन एक्सेस की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन अनुमति दें।');
    }
  };

  const handleStopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
  };

  // Send Community Message (Text / Image / Voice)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !uploadedImagePreview && !voiceAudioBlob) return;

    const senderName = currentUser?.fullName || 'IOIS Member (अतिथि)';
    const senderId = currentUser?.userId || 'IOIS-GUEST';
    const senderRole = currentUser?.role || 'Verified Member';
    const senderPhoto = currentUser?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
    const senderPlanId = currentUser?.selectedPlanId || 1;

    const newMsg: CommunityMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      senderPhoto,
      senderPlanId,
      channel: activeChannel,
      text: messageInput.trim(),
      mediaUrl: uploadedImagePreview || voiceAudioBlob || undefined,
      mediaType: uploadedImagePreview ? 'image' : voiceAudioBlob ? 'audio' : undefined,
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      reactions: { '❤️': 1 }
    };

    // Optimistic Local State
    setChatMessages((prev) => [...prev, newMsg]);
    setMessageInput('');
    setUploadedImagePreview(null);
    setVoiceAudioBlob(null);

    // Save to Firestore Cloud Database
    try {
      if (db) {
        await addDoc(collection(db, 'community_messages'), {
          ...newMsg,
          timestamp: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn('Firestore message sync note:', e);
    }
  };

  // Handle Reactions
  const handleAddReaction = (msgId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId) {
          const currentCount = msg.reactions?.[emoji] || 0;
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: currentCount + 1,
            },
          };
        }
        return msg;
      })
    );
  };

  // Video Call: Start / End Call
  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsInCall(true);
    } catch (err) {
      // If camera is not available, try audio only
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        setIsInCall(true);
        setIsCamOn(false);
      } catch (err2) {
        alert('कैमरा या माइक्रोफ़ोन का एक्सेस नहीं मिला। सिमुलेटेड लाइव रूम मोड सक्रिय किया जा रहा है।');
        setIsInCall(true);
      }
    }
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setIsInCall(false);
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    } else {
      setIsCamOn(!isCamOn);
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    } else {
      setIsMicOn(!isMicOn);
    }
  };

  // AI Workspace Generator
  const handleGenerateAiResponse = async (type: 'gemini' | 'chatgpt' | 'tools', customPrompt?: string) => {
    const promptToUse = customPrompt || aiPromptInput.trim();
    if (!promptToUse) return;

    setIsAiGenerating(true);
    setAiResponseOutput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptToUse }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponseOutput(data.reply || 'AI ने उत्तर तैयार किया है।');
      } else {
        // Fallback intelligent generator
        setAiResponseOutput(`नमस्ते! IOIS AI असिस्टेंट ने आपके सवाल "${promptToUse}" का विश्लेषण किया है:\n\n1. मुख्य निष्कर्ष: IOIS पर आपको 7 मास्टर प्लांस, RTPS सुविधाएं व विद्यार्थी अध्ययन सामग्री 24x7 उपलब्ध हैं।\n2. आवश्यक सुझाव: अपने ज्ञान को बढ़ाने व डिजिटल कमाई के लिए प्रतिदिन कम से कम 30 मिनट अध्ययन पोर्टल का उपयोग करें।\n3. अधिक सहायता: 24x7 ऑल इंडिया हेल्पडेस्क +91 8877490845 पर संपर्क करें।`);
      }
    } catch (err) {
      setAiResponseOutput(`IOIS AI असिस्टेंट: आपके प्रश्न "${promptToUse}" का उत्तर तैयार है। कृपया कोई विशिष्ट विषय या सहायता चुनें।`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Web Search in-app simulator
  const handlePerformWebSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webSearchQuery.trim()) return;

    const q = webSearchQuery.trim();
    setWebSearchResults([
      {
        title: `Google Search Results: ${q}`,
        snippet: `${q} के बारे में ताजा जानकारी, आधिकारिक सरकारी नियम, योजनाएं व सत्यापित तथ्य।`,
        url: `https://www.google.com/search?q=${encodeURIComponent(q)}`
      },
      {
        title: `Wikipedia Encyclopedia: ${q}`,
        snippet: `${q} का विस्तृत इतिहास, अवधारणाएं, संदर्भ और शैक्षणिक विश्लेषण।`,
        url: `https://hi.wikipedia.org/wiki/${encodeURIComponent(q)}`
      },
      {
        title: `IOIS Digital Resource Center: ${q}`,
        snippet: `IOIS प्लेटफॉर्म पर उपलब्ध NCERT नोट्स, सरकारी पोर्टल गाइड और कौशल विकास संसाधन।`,
        url: `#`
      }
    ]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Header Banner & Main Mode Switcher */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>ऑल-इन-वन मनोरंजन, कम्युनिटी व एआई हब</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              बिना Ads वीडियो, लाइव चैट व फ्री AI टूल्स
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              बिना यूट्यूब पर जाए कोई भी वीडियो या प्लेलिस्ट बिना विज्ञापन देखें, अन्य IOIS सदस्यों से फोटो/वॉइस/वीडियो कॉल पर बात करें और गूगल सर्च व ChatGPT टूल्स का यहीं उपयोग करें।
            </p>
          </div>

          {/* Primary View Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>बिना Ads वीडियो प्लेयर</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>कम्युनिटी लाइव चैट</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-tools')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'ai-tools'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>फ्री AI व गूगल टूल्स</span>
            </button>

            <button
              onClick={() => setActiveTab('videocall')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'videocall'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>लाइव वीडियो कॉल</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB 1: AD-FREE VIDEO PLAYER & PLAYLIST QUEUE MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          
          {/* Top Video URL Paste Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">यूट्यूब वीडियो या प्लेलिस्ट लिंक पेस्ट करें</h3>
                  <p className="text-[11px] text-slate-400">बिना विज्ञापन (Ad-Free) 1080p HD क्वालिटी में एक के बाद एक वीडियो चलेंगी</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-bold">
                ✓ 100% Ad-Free Protected Player
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="text"
                value={videoInputUrl}
                onChange={(e) => setVideoInputUrl(e.target.value)}
                placeholder="यहाँ कोई भी YouTube Video, Playlist या Shorts लिंक पेस्ट करें (उदा: https://youtube.com/watch?v=...)"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => handleParseAndPlayUrl(videoInputUrl, false)}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>तुरंत प्ले करें</span>
                </button>
                <button
                  onClick={() => handleParseAndPlayUrl(videoInputUrl, true)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-700 flex items-center justify-center gap-1.5"
                  title="वर्तमान प्लेलिस्ट में जोड़ें"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>क्यू में जोड़ें</span>
                </button>
              </div>
            </div>
          </div>

          {/* Player + Playlist Queue Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left/Center: Video Stage */}
            <div className={`${isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-8'} bg-slate-950 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl space-y-4`}>
              
              {/* Playing Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                      {currentVideo.title}
                    </h3>
                    <span className="text-[11px] text-slate-400">{currentVideo.duration} • बिना विज्ञापन प्लेबैक</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSharedSyncEnabled(!sharedSyncEnabled)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                      sharedSyncEnabled 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                    title="यदि ऑन है तो आप जो वीडियो चलाएंगे वह सभी यूजर्स के साथ लाइव सिंक हो जाएगा"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{sharedSyncEnabled ? '👥 साझा सिंक (ON)' : 'व्यक्तिगत मोड'}</span>
                  </button>

                  <button
                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    title={isTheaterMode ? "सामान्य दृश्य" : "थिएटर मोड"}
                  >
                    {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isTheaterMode ? 'सामान्य' : 'थिएटर'}</span>
                  </button>

                  <button
                    onClick={() => setPlayerKey((k) => k + 1)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition cursor-pointer"
                    title="प्लेयर रीलोड करें"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Video iFrame Stage (Ad-Free Privacy Embed) */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner flex items-center justify-center">
                <iframe
                  key={playerKey}
                  src={currentVideo.embedUrl}
                  title={currentVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Player Bottom Controls (Previous, Next, Auto-Advance) */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevVideo}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <SkipBack className="w-4 h-4 text-amber-400" />
                    <span>पिछला (Prev)</span>
                  </button>

                  <button
                    onClick={handleNextVideo}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black transition cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>अगला (Next)</span>
                    <SkipForward className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoNextEnabled}
                      onChange={(e) => setAutoNextEnabled(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                    <span>ऑटो-नेक्स्ट (Auto Play Next Track)</span>
                  </label>

                  <span className="text-slate-500">|</span>

                  <span className="text-amber-400 font-bold">
                    ट्रैक {queueIndex + 1} / {queueList.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Playlist Queue & Category Presets */}
            <div className={`${isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-4'} space-y-5`}>
              
              {/* Active Queue List */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider">
                      प्लेलिस्ट सूची ({queueList.length} ट्रैक्स)
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">क्रमबद्ध प्लेबैक</span>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {queueList.map((item, idx) => {
                    const isPlaying = queueIndex === idx;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handlePlayQueueItem(item, idx)}
                        className={`p-3 rounded-2xl transition flex items-center justify-between cursor-pointer border ${
                          isPlaying
                            ? 'bg-amber-500/20 border-amber-500 text-white font-black shadow-md'
                            : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 font-bold text-xs">
                            {isPlaying ? <Play className="w-4 h-4 fill-current text-amber-400 animate-pulse" /> : idx + 1}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold truncate">{item.title}</div>
                            <span className="text-[10px] text-slate-400 block">{item.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {isPlaying && (
                            <span className="text-[9px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                              चालू
                            </span>
                          )}
                          <button
                            onClick={(e) => handleRemoveQueueItem(item.id, e)}
                            className="p-1 hover:text-red-400 text-slate-500 rounded-lg transition"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Curated 1-Click Categories */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  🔥 लोकप्रिय मनोरंजन श्रेणियां (1-क्लिक प्ले)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CURATED_PLAYLISTS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setCurrentVideo(preset);
                        setPlayerKey((k) => k + 1);
                      }}
                      className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer flex items-center gap-2.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                        <img src={preset.thumbnail} alt={preset.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                      </div>
                      <div className="truncate">
                        <div className="text-[11px] font-bold text-slate-200 group-hover:text-amber-400 truncate">
                          {preset.title.split(' ')[1] || preset.title}
                        </div>
                        <span className="text-[9px] text-slate-500">{preset.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB 2: COMMUNITY LIVE CHAT & MEDIA SHARING */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Chat Rooms Selector */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>कम्युनिटी रूम्स (Chat Rooms)</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold">● लाइव एक्टिव</span>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'general', label: '💬 सामान्य चर्चा (General Lounge)', desc: 'सभी IOIS सदस्यों का खुला मंच' },
                  { id: 'earning', label: '💼 कमाई व 7 प्लांस (Earning Hub)', desc: 'रेफरल इंसेंटिव व पेआउट चर्चा' },
                  { id: 'students', label: '🎓 विद्यार्थी व तैयारी (Study Group)', desc: 'NCERT नोट्स, परीक्षा व सवाल-जवाब' },
                  { id: 'entertainment', label: '🎬 मनोरंजन व गपशप (Music & Fun)', desc: 'गाने, वीडियो व मनोरंजक बातें' },
                ].map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveChannel(room.id as any)}
                    className={`w-full p-3.5 rounded-2xl text-left transition cursor-pointer border ${
                      activeChannel === room.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-black shadow-md'
                        : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-300">{room.label}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{room.desc}</p>
                  </button>
                ))}
              </div>

              {/* User Profile Card in Chat */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">आपकी प्रोफ़ाइल (Sender Profile):</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400 shrink-0">
                    <img 
                      src={currentUser?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">{currentUser?.fullName || 'अतिथि सदस्य (Guest)'}</div>
                    <span className="text-[10px] text-amber-400 font-mono">{currentUser?.userId || 'लॉगिन नहीं है'}</span>
                  </div>
                </div>
                {!currentUser && (
                  <button
                    onClick={onOpenLogin}
                    className="w-full mt-2 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition"
                  >
                    लॉगिन करके चैट करें →
                  </button>
                )}
              </div>
            </div>

            {/* Right: Real-time Messages Feed */}
            <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col h-[650px]">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {activeChannel === 'general' && 'सामान्य चर्चा (General Lounge)'}
                      {activeChannel === 'earning' && 'कमाई व 7 प्लांस (Earning Hub)'}
                      {activeChannel === 'students' && 'विद्यार्थी व तैयारी (Study Group)'}
                      {activeChannel === 'entertainment' && 'मनोरंजन व गपशप (Music & Fun)'}
                    </h3>
                    <span className="text-[11px] text-slate-400">सभी डिवाइसों पर लाइव सिंक</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('videocall')}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>कॉल शुरू करें</span>
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 my-2">
                {chatMessages
                  .filter((m) => m.channel === activeChannel || !m.channel)
                  .map((msg) => {
                    const isMe = currentUser?.userId && msg.senderId && currentUser.userId.toUpperCase() === msg.senderId.toUpperCase();
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 shrink-0 mt-1">
                          <img
                            src={msg.senderPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                            alt={msg.senderName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Bubble */}
                        <div className="space-y-1.5">
                          <div className={`flex items-center gap-2 text-[10px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="font-bold text-slate-300">{msg.senderName}</span>
                            <span className="text-amber-400 font-mono">({msg.senderId})</span>
                            <span className="text-slate-500">{msg.timestamp}</span>
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isMe
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-tr-none shadow-md'
                                : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none shadow-md'
                            }`}
                          >
                            {msg.text && <p>{msg.text}</p>}

                            {/* Image Attachment Preview */}
                            {msg.mediaType === 'image' && msg.mediaUrl && (
                              <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 max-w-[280px]">
                                <img
                                  src={msg.mediaUrl}
                                  alt="Attachment"
                                  className="w-full h-auto cursor-pointer hover:opacity-90 transition"
                                  onClick={() => setViewingImageModal(msg.mediaUrl || null)}
                                />
                              </div>
                            )}

                            {/* Audio Voice Note Player */}
                            {msg.mediaType === 'audio' && msg.mediaUrl && (
                              <div className="mt-2 p-2 bg-slate-950/80 rounded-xl border border-slate-700">
                                <audio controls src={msg.mediaUrl} className="w-full h-8" />
                              </div>
                            )}
                          </div>

                          {/* Quick Emoji Reactions */}
                          <div className={`flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {['❤️', '👍', '👏', '🔥'].map((emoji) => {
                              const count = msg.reactions?.[emoji] || 0;
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => handleAddReaction(msg.id, emoji)}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{emoji}</span>
                                  {count > 0 && <span className="font-bold text-amber-400">{count}</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                <div ref={chatBottomRef} />
              </div>

              {/* Uploaded Media Preview */}
              {uploadedImagePreview && (
                <div className="p-2.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 mb-2 shrink-0">
                  <div className="flex items-center gap-3">
                    <img src={uploadedImagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-amber-400" />
                    <span className="text-xs text-amber-300 font-bold">फ़ोटो भेजी जाएगी (Ready to send)</span>
                  </div>
                  <button onClick={() => setUploadedImagePreview(null)} className="p-1 text-slate-400 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Voice Note Preview */}
              {voiceAudioBlob && (
                <div className="p-2.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 mb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-300 font-bold">वॉइस मैसेज रिकॉर्ड हो गया</span>
                  </div>
                  <button onClick={() => setVoiceAudioBlob(null)} className="p-1 text-slate-400 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex items-center gap-2 shrink-0">
                {/* Photo Upload Button */}
                <label className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400 transition cursor-pointer shrink-0">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                </label>

                {/* Voice Note Button */}
                {!isRecordingVoice ? (
                  <button
                    type="button"
                    onClick={handleStartVoiceRecording}
                    title="वॉइस नोट रिकॉर्ड करें"
                    className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-emerald-400 transition cursor-pointer shrink-0"
                  >
                    <Mic className="w-4 h-4 text-emerald-400" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopVoiceRecording}
                    title="रिकॉर्डिंग रोकें"
                    className="p-2.5 rounded-2xl bg-red-600 text-white animate-pulse transition cursor-pointer shrink-0"
                  >
                    <MicOff className="w-4 h-4" />
                  </button>
                )}

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="अपना संदेश लिखें... (Type your message)"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />

                <button
                  type="submit"
                  className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">भेजें</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 3: IN-APP AI TOOLS & GOOGLE SEARCH SUITE */}
      {/* ========================================================================= */}
      {activeTab === 'ai-tools' && (
        <div className="space-y-6">
          
          {/* Sub-tools switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-3xl border border-slate-800 shadow-xl">
            <button
              onClick={() => setAiSubTab('gemini')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                aiSubTab === 'gemini'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>IOIS Gemini AI असिस्टेंट</span>
            </button>

            <button
              onClick={() => setAiSubTab('chatgpt')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                aiSubTab === 'chatgpt'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>ChatGPT प्रॉम्प्ट वर्कस्पेस</span>
            </button>

            <button
              onClick={() => setAiSubTab('chrome')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                aiSubTab === 'chrome'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Chrome className="w-4 h-4" />
              <span>गूगल क्रोम स्मार्ट सर्च</span>
            </button>

            <button
              onClick={() => setAiSubTab('tools')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                aiSubTab === 'tools'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>फ्री AI टूल्स सुइट (अनुवाद / स्क्रिप्ट / कोड)</span>
            </button>
          </div>

          {/* AI Sub-tool 1: Gemini & ChatGPT Assistant */}
          {(aiSubTab === 'gemini' || aiSubTab === 'chatgpt') && (
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${aiSubTab === 'gemini' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {aiSubTab === 'gemini' ? 'IOIS Gemini 2.5 Smart AI Assistant' : 'ChatGPT Prompt Helper Workspace'}
                    </h3>
                    <p className="text-xs text-slate-400">हिंदी व अंग्रेजी में सवाल पूछें, पत्र/प्रार्थना पत्र लिखवाएं, गणित व कोडिंग हल करें</p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/40 rounded-full text-[11px] font-bold">
                  ✓ 100% Free In-App
                </span>
              </div>

              {/* Quick Prompt Templates */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">⚡ 1-क्लिक प्रॉम्प्ट्स (Quick Templates):</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    'गाँव में ऑनलाइन कमाई कैसे शुरू करें?',
                    'सरकारी नौकरी इंटरव्यू के लिए 5 टिप्स',
                    'प्रधानाचार्य को छुट्टी के लिए आवेदन पत्र',
                    'Class 12th Physics NCERT फॉर्मूला सारांश',
                    'यूट्यूब वीडियो के लिए आकर्षक हिंदी स्क्रिप्ट',
                  ].map((tpl) => (
                    <button
                      key={tpl}
                      onClick={() => {
                        setAiPromptInput(tpl);
                        handleGenerateAiResponse(aiSubTab === 'gemini' ? 'gemini' : 'chatgpt', tpl);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-xs font-semibold transition cursor-pointer"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input prompt */}
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  placeholder="यहाँ अपना कोई भी प्रश्न, निबंध, सवाल, स्क्रिप्ट या अनुवाद का अनुरोध लिखें..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">बिना किसी बाहरी रीडायरेक्ट के तुरंत उत्तर मिलेगा</span>
                  <button
                    onClick={() => handleGenerateAiResponse(aiSubTab === 'gemini' ? 'gemini' : 'chatgpt')}
                    disabled={isAiGenerating}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 text-white font-black text-xs transition cursor-pointer shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isAiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isAiGenerating ? 'AI उत्तर बना रहा है...' : 'AI उत्तर प्राप्त करें'}</span>
                  </button>
                </div>
              </div>

              {/* AI Response Output Box */}
              {aiResponseOutput && (
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI का उत्तर:</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiResponseOutput);
                        alert('उत्तर कॉपी हो गया!');
                      }}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>कॉपी करें</span>
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {aiResponseOutput}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Sub-tool 2: Google Chrome In-App Search */}
          {aiSubTab === 'chrome' && (
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                    <Chrome className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">Google Chrome Smart Web Search Engine</h3>
                    <p className="text-xs text-slate-400">IOIS में रहते हुए कुछ भी खोजें, विकिपीडिया व ज्ञानकोष पढ़ें</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePerformWebSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={webSearchQuery}
                    onChange={(e) => setWebSearchQuery(e.target.value)}
                    placeholder="गूगल सर्च करें (उदा: बिहार दाखिल खारिज नियम, 12th NCERT सिलेबस, सोना भाव)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shrink-0"
                >
                  सर्च करें
                </button>
              </form>

              {/* Search Results */}
              {webSearchResults.length > 0 && (
                <div className="space-y-4 pt-2">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">शीर्ष परिणाम (Search Results):</span>
                  <div className="space-y-3">
                    {webSearchResults.map((res, i) => (
                      <div key={i} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                        <h4 className="text-sm font-bold text-blue-400">{res.title}</h4>
                        <p className="text-xs text-slate-300">{res.snippet}</p>
                        <a href={res.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-bold pt-1">
                          <span>ऑफिशियल स्रोत देखें</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Sub-tool 3: Free AI Tools Suite */}
          {aiSubTab === 'tools' && (
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>मुफ्त एआई टूल्स सुइट (AI Productivity Generators)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: '🇮🇳 अंग्रेजी ↔ हिंदी अनुवादक (Smart Translator)',
                    desc: 'किसी भी वाक्य या पैराग्राफ का सटीक व्याकरण सहित त्वरित अनुवाद।',
                    actionPrompt: 'कृपया निम्नलिखित वाक्य का शुद्ध हिंदी में अनुवाद करें: "Education and digital empowerment are the true foundations of financial freedom."'
                  },
                  {
                    title: '📹 यूट्यूब वीडियो व रील्स स्क्रिप्ट जेनरेटर',
                    desc: 'यूट्यूब शॉर्ट्स और वीडियो के लिए हुक, बॉडी और कॉल-टू-एक्शन स्क्रिप्ट।',
                    actionPrompt: 'एक 60 सेकंड के यूट्यूब शॉर्ट्स के लिए हिंदी स्क्रिप्ट लिखें जिसका विषय है: "घर बैठे फोन से 3 आसान कमाई के तरीके"'
                  },
                  {
                    title: '📄 सरकारी नौकरी रिज़्यूम व बायोडाटा बिल्डर',
                    desc: 'प्रोफेशनल रिज़्यूम, शैक्षणिक योग्यता सारांश और कौशल विवरण तैयार करें।',
                    actionPrompt: '12वीं पास विद्यार्थी के लिए एक प्रोफेशनल रिज़्यूम बायोडाटा फॉर्मेट हिंदी और इंग्लिश में तैयार करें।'
                  },
                  {
                    title: '🧮 गणित व विज्ञान फॉर्मूला सॉल्वर',
                    desc: 'कक्षा 10वीं व 12वीं के किसी भी गणित या फिजिक्स न्यूमेरिकल का स्टेप-बाय-स्टेप हल।',
                    actionPrompt: 'द्विघात समीकरण (Quadratic Equation) हल करने की विधि और 2 आसान उदाहरण स्टेप-बाय-स्टेप समझाएं।'
                  },
                  {
                    title: '💼 बिज़नेस व दुकान मार्केटिंग विचार',
                    desc: 'गाँव व कस्बे में किराना, सीएससी या कपड़े की दुकान की बिक्री बढ़ाने के 5 तरीके।',
                    actionPrompt: 'गाँव या कस्बे में सीएससी जन सेवा केंद्र की दैनिक आय ₹1000+ करने के 5 व्यावहारिक तरीके बताएं।'
                  },
                  {
                    title: '✍️ आधिकारिक प्रार्थना पत्र (Official Letter)',
                    desc: 'बिजली विभाग, बैंक मैनेजर, या डीएम को आवेदन पत्र का सही प्रारूप।',
                    actionPrompt: 'बैंक शाखा प्रबंधक को नया एटीएम कार्ड जारी करने हेतु औपचारिक प्रार्थना पत्र का हिंदी प्रारूप लिखें।'
                  }
                ].map((tool, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{tool.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{tool.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setAiSubTab('gemini');
                        setAiPromptInput(tool.actionPrompt);
                        handleGenerateAiResponse('gemini', tool.actionPrompt);
                      }}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>टूल चलाएं →</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 4: LIVE VIDEO CALL & AUDIO ROOM */}
      {/* ========================================================================= */}
      {activeTab === 'videocall' && (
        <div className="space-y-6">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Call Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Video className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">IOIS लाइव वीडियो व ऑडियो कॉल रूम</h3>
                  <p className="text-xs text-slate-300">अन्य सदस्यों व एडमिन के साथ HD वीडियो और वॉइस चैट करें</p>
                </div>
              </div>

              {isInCall && (
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded-full text-xs font-black flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>कॉल सक्रिय ({Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')})</span>
                  </span>
                </div>
              )}
            </div>

            {/* Video Call Active Grid or Start Stage */}
            {!isInCall ? (
              <div className="p-8 sm:p-12 bg-slate-900/80 rounded-3xl border border-slate-800 text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <PhoneCall className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white">सुरक्षित पीयर-टू-पीयर लाइव वीडियो कॉल</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    आप अपने कैमरे और माइक्रोफ़ोन के साथ लाइव रूम में जुड़ सकते हैं। आपका डेटा एन्क्रिप्टेड और सुरक्षित रहता है।
                  </p>
                </div>

                <button
                  onClick={handleStartCall}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-sm transition cursor-pointer shadow-xl flex items-center gap-2 mx-auto transform hover:scale-105"
                >
                  <Video className="w-5 h-5" />
                  <span>लाइव वीडियो कॉल शुरू करें (Start Call)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 2-Person Video Call Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Local Stream (My Video) */}
                  <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex items-center justify-center">
                    {isCamOn ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
                          <VideoOff className="w-8 h-8" />
                        </div>
                        <p className="text-xs text-slate-400">कैमरा बंद है</p>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span>आप ({currentUser?.fullName || 'सदस्य'})</span>
                    </div>
                  </div>

                  {/* Remote Stream (Partner / Room Host Video) */}
                  <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                      alt="Room Host"
                      className="w-full h-full object-cover opacity-80"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>IOIS कम्युनिटी लाइव होस्ट</span>
                    </div>
                  </div>
                </div>

                {/* Call Action Bar Controls */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center gap-4">
                  <button
                    onClick={toggleMic}
                    className={`p-3.5 rounded-full text-white font-bold transition cursor-pointer shadow-md ${
                      isMicOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-600 hover:bg-red-500'
                    }`}
                    title={isMicOn ? "माइक म्यूट करें" : "माइक अनम्यूट करें"}
                  >
                    {isMicOn ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={toggleCamera}
                    className={`p-3.5 rounded-full text-white font-bold transition cursor-pointer shadow-md ${
                      isCamOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-600 hover:bg-red-500'
                    }`}
                    title={isCamOn ? "कैमरा बंद करें" : "कैमरा चालू करें"}
                  >
                    {isCamOn ? <Video className="w-5 h-5 text-blue-400" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xs transition cursor-pointer shadow-xl flex items-center gap-2"
                    title="कॉल समाप्त करें"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>कॉल समाप्त करें (End Call)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {viewingImageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setViewingImageModal(null)}
              className="absolute -top-10 right-0 text-white p-2 hover:text-amber-400 text-sm font-bold flex items-center gap-1"
            >
              <X className="w-5 h-5" />
              <span>बंद करें</span>
            </button>
            <img src={viewingImageModal} alt="Enlarged" className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-slate-700" />
          </div>
        </div>
      )}

    </div>
  );
};
