import React, { useState, useEffect, useRef } from 'react';
import { AdminPrivateMessage, UserProfile } from '../types';
import { 
  fetchPrivateChatMessagesAsync, 
  sendPrivateChatMessageAsync,
  getLocalPrivateChatMessages 
} from '../services/userService';
import { 
  Send, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  CheckCheck, 
  Clock, 
  Paperclip, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Bot, 
  User, 
  RefreshCw,
  Play,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

interface PrivateChatMessengerProps {
  userId: string; // The user whose chat this is
  targetUserName?: string;
  currentRole: 'admin' | 'user';
  adminName?: string;
  onClose?: () => void;
  isCompact?: boolean;
}

export const PrivateChatMessenger: React.FC<PrivateChatMessengerProps> = ({
  userId,
  targetUserName = 'सदस्य',
  currentRole,
  adminName = 'IOIS Official Admin',
  onClose,
  isCompact = false,
}) => {
  const [messages, setMessages] = useState<AdminPrivateMessage[]>(() => {
    return getLocalPrivateChatMessages(userId);
  });
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Attachment Drawer & States
  const [attachmentMode, setAttachmentMode] = useState<'none' | 'image' | 'video' | 'link'>('none');
  const [mediaUrlInput, setMediaUrlInput] = useState<string>('');
  const [linkUrlInput, setLinkUrlInput] = useState<string>('');
  const [linkTitleInput, setLinkTitleInput] = useState<string>('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  // Lightbox modal for enlarged image
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMsgLengthRef = useRef<number>(0);
  const isFirstLoadRef = useRef<boolean>(true);

  const scrollChatToBottom = (smooth = true) => {
    if (!chatContainerRef.current) return;
    const el = chatContainerRef.current;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  };

  const loadMessages = async () => {
    if (!userId) return;
    try {
      const live = await fetchPrivateChatMessagesAsync(userId);
      setMessages((prev) => {
        // Prevent state update if length and last message ID are identical (avoids triggering scroll effects during polling)
        if (
          prev.length === live.length &&
          prev[prev.length - 1]?.id === live[live.length - 1]?.id
        ) {
          return prev;
        }
        return live;
      });
    } catch (e) {
      console.warn('Error loading private messages:', e);
    }
  };

  useEffect(() => {
    isFirstLoadRef.current = true;
    prevMsgLengthRef.current = 0;
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    const el = chatContainerRef.current;

    // First load: instant scroll to bottom inside the chat container without page jumping
    if (isFirstLoadRef.current && messages.length > 0) {
      scrollChatToBottom(false);
      isFirstLoadRef.current = false;
      prevMsgLengthRef.current = messages.length;
      return;
    }

    // When new message arrives
    if (messages.length > prevMsgLengthRef.current) {
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.sender === currentRole || isNearBottom) {
        scrollChatToBottom(true);
      }
      prevMsgLengthRef.current = messages.length;
    }
  }, [messages, currentRole]);

  // Handle Image File Upload (converts to base64 for instant local display & persistence)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('कृपया 5MB से छोटी फोटो अपलोड करें।');
        return;
      }
      setUploadError('');
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImagePreview(reader.result as string);
        setMediaUrlInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract YouTube Embed URL if applicable
  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !mediaUrlInput.trim() && !linkUrlInput.trim()) return;

    setIsSending(true);

    let effectiveMediaType: 'image' | 'video' | 'link' | undefined = undefined;
    let effectiveMediaUrl: string | undefined = undefined;
    let effectiveLinkUrl: string | undefined = undefined;
    let effectiveLinkTitle: string | undefined = undefined;

    if (attachmentMode === 'image' && mediaUrlInput.trim()) {
      effectiveMediaType = 'image';
      effectiveMediaUrl = mediaUrlInput.trim();
    } else if (attachmentMode === 'video' && mediaUrlInput.trim()) {
      effectiveMediaType = 'video';
      effectiveMediaUrl = mediaUrlInput.trim();
    } else if (attachmentMode === 'link' && linkUrlInput.trim()) {
      effectiveMediaType = 'link';
      effectiveLinkUrl = linkUrlInput.trim();
      effectiveLinkTitle = linkTitleInput.trim() || linkUrlInput.trim();
    }

    const payload = {
      userId: userId.trim().toUpperCase(),
      sender: currentRole,
      senderName: currentRole === 'admin' ? adminName : targetUserName,
      text: inputText.trim(),
      mediaType: effectiveMediaType,
      mediaUrl: effectiveMediaUrl,
      linkUrl: effectiveLinkUrl,
      linkTitle: effectiveLinkTitle,
    };

    try {
      const sent = await sendPrivateChatMessageAsync(payload);
      setMessages((prev) => [...prev, sent]);
      setInputText('');
      setMediaUrlInput('');
      setLinkUrlInput('');
      setLinkTitleInput('');
      setSelectedImagePreview(null);
      setAttachmentMode('none');
    } catch (e) {
      console.warn('Failed to send private chat message', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickChip = (text: string) => {
    setInputText(text);
  };

  return (
    <div className={`flex flex-col bg-[#0e1621] text-white rounded-3xl border border-[#2b5278]/60 overflow-hidden shadow-2xl ${isCompact ? 'h-[500px]' : 'h-[620px]'}`}>
      
      {/* Lightbox for Full Image Preview */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)} 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <img src={lightboxImage} alt="Enlarged" className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl border border-white/20" />
        </div>
      )}

      {/* Telegram-Style Header Bar */}
      <div className="bg-[#17212b] border-b border-[#242f3d] px-4 py-3 flex items-center justify-between gap-3 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow">
              {currentRole === 'user' ? '👑' : targetUserName.slice(0, 1)}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#17212b] shadow-sm animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-sm text-white">
                {currentRole === 'user' ? 'IOIS Official Support Team' : `${targetUserName}`}
              </h4>
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-sky-300">
              <span>User ID: <strong className="font-mono text-amber-300">{userId}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">🟢 एन्क्रिप्टेड प्राइवेट चैट</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={async () => {
              setIsRefreshing(true);
              await loadMessages();
              setIsRefreshing(false);
            }}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-[#242f3d] hover:bg-[#2b5278] text-slate-300 hover:text-white transition cursor-pointer"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#242f3d] hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 transition cursor-pointer"
              title="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="px-4 py-2 bg-rose-950/90 border-b border-rose-500/50 text-rose-200 text-xs font-bold flex items-center justify-between gap-2">
          <span>{uploadError}</span>
          <button type="button" onClick={() => setUploadError('')} className="text-rose-300 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0e1621] select-text">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-75">
            <div className="w-14 h-14 rounded-2xl bg-[#17212b] border border-[#2b5278] flex items-center justify-center text-sky-400 mb-1">
              <Sparkles className="w-7 h-7" />
            </div>
            <h5 className="text-sm font-black text-white">सीधी व सुरक्षित सहायता बातचीत</h5>
            <p className="text-xs text-slate-400 max-w-sm">
              यहाँ आप एडमिन टीम को सीधे संदेश, स्क्रीनशॉट, फोटो, वीडियो लिंक या सवाल भेज सकते हैं। एडमिन द्वारा भेजा गया हर संदेश यहाँ तुरंत प्रदर्शित होगा।
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => handleQuickChip('नमस्ते! मुझे मेरे प्लान व पेआउट के बारे में जानकारी चाहिए।')}
                className="px-3 py-1.5 rounded-full bg-[#17212b] border border-[#2b5278] hover:border-sky-400 text-[11px] text-sky-300 transition cursor-pointer"
              >
                💬 प्लान व पेआउट की जानकारी
              </button>
              <button
                type="button"
                onClick={() => handleQuickChip('मेरा पेमेंट UTR चेक करें और अप्रूव करें।')}
                className="px-3 py-1.5 rounded-full bg-[#17212b] border border-[#2b5278] hover:border-amber-400 text-[11px] text-amber-300 transition cursor-pointer"
              >
                💳 पेमेंट UTR अप्रूवल
              </button>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = (currentRole === 'admin' && m.sender === 'admin') || (currentRole === 'user' && m.sender === 'user');
            const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fadeIn`}
              >
                {/* Sender Tag */}
                <span className="text-[10px] text-slate-400 mb-1 px-1 font-semibold flex items-center gap-1">
                  {m.sender === 'admin' ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      👑 {m.senderName || 'IOIS Admin'}
                    </span>
                  ) : (
                    <span className="text-sky-300">
                      👤 {m.senderName || 'सदस्य'}
                    </span>
                  )}
                </span>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-md space-y-2 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-[#2b5278] to-[#182533] text-white rounded-tr-none border border-[#3e6894]'
                      : 'bg-[#182533] text-slate-100 rounded-tl-none border border-[#242f3d]'
                  }`}
                >
                  {/* Photo Attachment */}
                  {m.mediaType === 'image' && m.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <img
                        src={m.mediaUrl}
                        alt="Photo attachment"
                        onClick={() => setLightboxImage(m.mediaUrl || null)}
                        className="w-full max-h-64 object-cover cursor-zoom-in hover:opacity-95 transition"
                      />
                    </div>
                  )}

                  {/* Video Attachment (YouTube or MP4) */}
                  {m.mediaType === 'video' && m.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/60">
                      {getYouTubeEmbedUrl(m.mediaUrl) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(m.mediaUrl)!}
                          title="Video Player"
                          className="w-full aspect-video rounded-xl"
                          allowFullScreen
                        />
                      ) : (
                        <div className="p-3 text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                            <Play className="w-5 h-5 fill-amber-400" />
                          </div>
                          <span className="text-xs font-bold block text-white">वीडियो लिंक संलग्न है</span>
                          <a
                            href={m.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] hover:bg-amber-300 transition"
                          >
                            <span>वीडियो खोलें</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Link Attachment Card */}
                  {m.mediaType === 'link' && m.linkUrl && (
                    <a
                      href={m.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2.5 rounded-xl bg-black/40 border border-sky-400/40 hover:border-sky-300 transition group"
                    >
                      <div className="flex items-center justify-between text-sky-400 text-[11px] font-bold">
                        <span className="flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          <span>{m.linkTitle || 'वेबसाइट / रिसोर्स लिंक'}</span>
                        </span>
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5 font-mono">
                        {m.linkUrl}
                      </span>
                    </a>
                  )}

                  {/* Text Message */}
                  {m.text && (
                    <p className="whitespace-pre-wrap font-sans break-words">{m.text}</p>
                  )}

                  {/* Meta Time & Check */}
                  <div className="flex items-center justify-end gap-1 text-[9.5px] text-slate-400 pt-0.5 font-mono">
                    <span>{timeStr}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Attachment Drawer Panel */}
      {attachmentMode !== 'none' && (
        <div className="bg-[#17212b] border-t border-[#242f3d] p-3 space-y-2 animate-slideUp">
          <div className="flex items-center justify-between text-xs text-sky-300 font-bold">
            <span className="flex items-center gap-1.5">
              {attachmentMode === 'image' && <ImageIcon className="w-4 h-4 text-emerald-400" />}
              {attachmentMode === 'video' && <Video className="w-4 h-4 text-amber-400" />}
              {attachmentMode === 'link' && <LinkIcon className="w-4 h-4 text-sky-400" />}
              <span>
                {attachmentMode === 'image' && 'फोटो / स्क्रीनशॉट जोड़ें'}
                {attachmentMode === 'video' && 'वीडियो लिंक जोड़ें (YouTube या MP4)'}
                {attachmentMode === 'link' && 'वेबसाइट / ड्राइव लिंक जोड़ें'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setAttachmentMode('none');
                setSelectedImagePreview(null);
                setMediaUrlInput('');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {attachmentMode === 'image' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="फोटो का URL पेस्ट करें (उदा. https://.../photo.jpg)"
                  className="flex-1 bg-[#0e1621] border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-[#242f3d] hover:bg-[#2b5278] text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  गैलरी से चुनें
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {selectedImagePreview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-emerald-400">
                  <img src={selectedImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImagePreview(null);
                      setMediaUrlInput('');
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {attachmentMode === 'video' && (
            <input
              type="text"
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
              placeholder="YouTube वीडियो या MP4 वीडियो लिंक पेस्ट करें"
              className="w-full bg-[#0e1621] border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400"
            />
          )}

          {attachmentMode === 'link' && (
            <div className="space-y-1.5">
              <input
                type="text"
                value={linkTitleInput}
                onChange={(e) => setLinkTitleInput(e.target.value)}
                placeholder="लिंक का शीर्षक (उदा. आधिकारिक Google Drive नोट्स)"
                className="w-full bg-[#0e1621] border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 outline-none focus:border-sky-400"
              />
              <input
                type="url"
                value={linkUrlInput}
                onChange={(e) => setLinkUrlInput(e.target.value)}
                placeholder="वेबसाइट या ड्राइव URL (https://...)"
                className="w-full bg-[#0e1621] border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 outline-none focus:border-sky-400 font-mono"
              />
            </div>
          )}
        </div>
      )}

      {/* Input Composer Footer */}
      <div className="bg-[#17212b] border-t border-[#242f3d] p-3">
        
        {/* Quick Attachment Buttons */}
        <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1 text-[11px]">
          <button
            type="button"
            onClick={() => setAttachmentMode(attachmentMode === 'image' ? 'none' : 'image')}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition cursor-pointer shrink-0 ${
              attachmentMode === 'image' ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400' : 'bg-[#0e1621] text-slate-300 border-[#242f3d] hover:border-slate-600'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>फोटो</span>
          </button>

          <button
            type="button"
            onClick={() => setAttachmentMode(attachmentMode === 'video' ? 'none' : 'video')}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition cursor-pointer shrink-0 ${
              attachmentMode === 'video' ? 'bg-amber-400 text-slate-950 font-black border-amber-300' : 'bg-[#0e1621] text-slate-300 border-[#242f3d] hover:border-slate-600'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>वीडियो</span>
          </button>

          <button
            type="button"
            onClick={() => setAttachmentMode(attachmentMode === 'link' ? 'none' : 'link')}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition cursor-pointer shrink-0 ${
              attachmentMode === 'link' ? 'bg-sky-500 text-slate-950 font-black border-sky-400' : 'bg-[#0e1621] text-slate-300 border-[#242f3d] hover:border-slate-600'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>लिंक शेयर</span>
          </button>
        </div>

        {/* Text Input & Send */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="संदेश टाइप करें..."
            className="flex-1 bg-[#0e1621] border border-[#2b5278] focus:border-sky-400 text-white rounded-2xl px-4 py-2.5 text-xs outline-none transition"
          />

          <button
            type="submit"
            disabled={isSending || (!inputText.trim() && !mediaUrlInput.trim() && !linkUrlInput.trim())}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 disabled:opacity-40 text-white transition cursor-pointer shadow-md shrink-0 flex items-center justify-center active:scale-95"
            title="संदेश भेजें"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
