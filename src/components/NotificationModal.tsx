import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  X, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { 
  AppNotificationItem, 
  getAdminNotifications, 
  getUserNotifications, 
  markChatMessagesAsRead 
} from '../services/notificationService';

export interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'admin' | 'user';
  userId?: string;
  userName?: string;
  currentUserName?: string;
  notifications?: AppNotificationItem[];
  onOpenChat?: (targetUserId?: string, targetUserName?: string) => void;
  onOpenSocialChat?: (threadId?: string, senderId?: string) => void;
  onOpenDirectReply?: (userId: string, userName: string) => void;
  onMarkAllRead?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  role,
  userId,
  userName,
  currentUserName,
  notifications,
  onOpenChat,
  onOpenSocialChat,
  onOpenDirectReply,
  onMarkAllRead
}) => {
  const [internalList, setInternalList] = useState<AppNotificationItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    if (notifications && Array.isArray(notifications)) {
      setInternalList(notifications);
      return;
    }

    const loadNotifications = () => {
      try {
        if (role === 'admin') {
          setInternalList(getAdminNotifications());
        } else if (userId) {
          setInternalList(getUserNotifications(userId));
        } else {
          setInternalList([]);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setInternalList([]);
      }
    };

    loadNotifications();
  }, [isOpen, role, userId, notifications]);

  if (!isOpen) return null;

  const activeList = Array.isArray(notifications) ? notifications : (internalList || []);
  const displayName = currentUserName || userName || (role === 'admin' ? 'एडमिन' : 'सदस्य');

  const handleReplyClick = (item: AppNotificationItem) => {
    onClose();
    if (item.type === 'social_chat' || item.type === 'friend_request') {
      if (onOpenSocialChat) {
        onOpenSocialChat(item.threadId, item.userId);
        return;
      }
    }
    if (onOpenChat) onOpenChat(item.userId, item.userName);
    if (onOpenDirectReply) onOpenDirectReply(item.userId, item.userName);
  };

  const handleMarkAll = () => {
    if (onMarkAllRead) {
      onMarkAllRead();
    } else {
      // Mark read locally
      if (role === 'admin') {
        activeList.forEach((n) => markChatMessagesAsRead(n.userId, 'admin'));
        setInternalList([]);
      } else if (userId) {
        markChatMessagesAsRead(userId, 'user');
        setInternalList([]);
      }
      window.dispatchEvent(new Event('iois_notifications_updated'));
    }
  };

  const modalMarkup = (
    <div className="fixed inset-0 z-[1150] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden my-auto flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-amber-600/30 via-slate-950 to-slate-900 border-b border-amber-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shrink-0">
              <Bell className="w-5 h-5 text-slate-950 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {role === 'admin' ? 'ADMIN LIVE ALERTS' : 'USER LIVE NOTIFICATIONS'}
                </span>
                <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                  {activeList.length} New
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {role === 'admin' ? 'इनबॉक्स संदेश व सूचना केंद्र' : 'आपके लिए प्राप्त संदेश व सूचनाएं'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 cursor-pointer shrink-0"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Subbar */}
        <div className="px-4 sm:px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            {role === 'admin' ? 'सदस्यों द्वारा भेजे गए प्रश्न व टिकट' : `नमस्ते ${displayName}, एडमिन के संदेश`}
          </span>
          {activeList.length > 0 && (
            <button
              onClick={handleMarkAll}
              className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>सभी को पढ़ा हुआ मार्क करें</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {activeList.length === 0 ? (
            <div className="p-8 text-center space-y-3 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-500">
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-white text-sm">अभी कोई नया अपठित संदेश नहीं है</p>
                <p className="text-xs text-slate-500">
                  {role === 'admin' 
                    ? 'जब कोई सदस्य आपको प्राइवेट चैट या सहायता टिकट भेजेगा, तो यहाँ तुरंत दिखाई देगा।' 
                    : 'जब एडमिन आपको कोई संदेश या अपडेट भेजेंगे, तो यहाँ नोटिफिकेशन दिखाई देगा।'}
                </p>
              </div>
            </div>
          ) : (
            activeList.map((n) => (
              <div 
                key={n.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 transition space-y-2 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {n.avatarUrl ? (
                      <img
                        src={n.avatarUrl}
                        alt={n.userName}
                        className="w-9 h-9 rounded-xl object-cover border border-amber-400/50 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                        {n.type === 'ticket' ? <HelpCircle className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-white leading-snug">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{new Date(n.createdAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 shrink-0">
                    {n.unreadCount ? `${n.unreadCount} NEW` : 'NEW UNREAD'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 leading-relaxed break-words">
                  {n.message}
                </p>

                {/* Direct Action Button */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleReplyClick(n)}
                    className="btn-3d-rainbow-special px-3.5 py-1.5 rounded-xl text-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                  >
                    <span>
                      {n.type === 'social_chat' || n.type === 'friend_request'
                        ? 'IOIS CHAT & HELP में खोलें'
                        : role === 'admin'
                        ? 'सीधे प्राइवेट चैट में रिप्लाई करें'
                        : 'प्राइवेट चैट खोलें व जवाब दें'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit एंड-टू-एंड एनक्रिप्टेड डायरेक्ट मैसेजिंग</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white font-bold cursor-pointer"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : modalMarkup;
};
