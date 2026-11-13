import { AdminPrivateMessage, HelpTicket } from '../types';
import { 
  getLocalPrivateChatMessages, 
  saveLocalPrivateChatMessages, 
  fetchUsersFromServer,
  getAllUsers 
} from './userService';

import { getSocialUnreadCache } from './socialChatService';

export interface AppNotificationItem {
  id: string;
  type: 'private_chat' | 'ticket' | 'approval' | 'social_chat' | 'friend_request';
  userId: string;
  userName: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  linkAction?: string;
  avatarUrl?: string;
  threadId?: string;
  threadType?: 'dm' | 'group';
  unreadCount?: number;
}

const STORAGE_TICKETS_KEY = 'iois_helpdesk_tickets_v1';

export const getStoredTickets = (): HelpTicket[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Get all unread notification items for Admin
 */
export const getAdminNotifications = (): AppNotificationItem[] => {
  const notifications: AppNotificationItem[] = [];
  const users = getAllUsers();

  // 1. Gather all incoming private messages from users where sender === 'user'
  users.forEach((u) => {
    const msgs = getLocalPrivateChatMessages(u.userId);
    msgs.forEach((m) => {
      if (m.sender === 'user' && !m.read) {
        notifications.push({
          id: m.id,
          type: 'private_chat',
          userId: u.userId,
          userName: u.fullName || u.userId,
          title: `📩 नया संदेश: ${u.fullName} (${u.userId})`,
          message: m.text || (m.mediaUrl ? 'मीडिया फ़ाइल संलग्न है' : 'नया संदेश'),
          createdAt: m.createdAt,
          read: !!m.read,
          avatarUrl: u.photoUrl,
        });
      }
    });
  });

  // 2. Gather open helpdesk tickets
  const tickets = getStoredTickets();
  tickets.forEach((t) => {
    if (t.status === 'open') {
      notifications.push({
        id: t.id,
        type: 'ticket',
        userId: t.userId,
        userName: t.userName || t.userId,
        title: `🎫 नया सपोर्ट टिकट: ${t.subject}`,
        message: t.description || 'उपयोगकर्ता सहायता अनुरोध',
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  });

  // Sort by newest first
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return notifications;
};

/**
 * Get unread count for Admin
 */
export const getAdminUnreadCount = (): number => {
  return getAdminNotifications().length;
};

/**
 * Get all unread notifications for a specific logged-in user (Admin Support + IOIS CHAT & HELP + Friend Requests)
 */
export const getUserNotifications = (userId: string): AppNotificationItem[] => {
  if (!userId) return [];
  const cleanId = userId.trim().toUpperCase();
  const msgs = getLocalPrivateChatMessages(cleanId);
  const notifications: AppNotificationItem[] = [];

  // 1. Admin Direct Support Messages
  msgs.forEach((m) => {
    if (m.sender === 'admin' && !m.read) {
      notifications.push({
        id: m.id,
        type: 'private_chat',
        userId: cleanId,
        userName: m.senderName || 'IOIS Official Admin',
        title: `👑 एडमिन संदेश: ${m.senderName || 'IOIS Admin'}`,
        message: m.text || (m.mediaUrl ? 'एडमिन ने मीडिया फाइल भेजी है' : 'नया संदेश प्राप्त हुआ'),
        createdAt: m.createdAt,
        read: !!m.read,
      });
    }
  });

  // 2. IOIS CHAT & HELP Unread Messages (grouped per sender or group with exact message count)
  const socialCache = getSocialUnreadCache(cleanId);
  (socialCache.unreadSummaries || []).forEach((s) => {
    notifications.push({
      id: `social-${s.threadId}`,
      type: 'social_chat',
      userId: s.senderId,
      userName: s.senderName,
      title: `💬 ${s.groupName ? `${s.groupName} (${s.senderName})` : s.senderName}${s.senderUsername ? ` (@${s.senderUsername})` : ''} — ${s.unreadCount} नया संदेश`,
      message: s.lastMessage,
      createdAt: s.lastMessageAt,
      read: false,
      avatarUrl: s.senderPhoto,
      threadId: s.threadId,
      threadType: s.threadType,
      unreadCount: s.unreadCount,
    });
  });

  // 3. Incoming Pending Friend Requests
  if (socialCache.pendingFriendRequestsCount > 0) {
    notifications.push({
      id: `fr-pending-${cleanId}`,
      type: 'friend_request',
      userId: cleanId,
      userName: 'IOIS CHAT & HELP',
      title: `🤝 ${socialCache.pendingFriendRequestsCount} नया फ्रेंड रिक्वेस्ट आया है`,
      message: 'IOIS CHAT & HELP में जाकर फ्रेंड रिक्वेस्ट स्वीकार करें या प्रोफाइल देखें।',
      createdAt: socialCache.updatedAt || new Date().toISOString(),
      read: false,
      unreadCount: socialCache.pendingFriendRequestsCount,
    });
  }

  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return notifications;
};

/**
 * Get unread message count for a specific user (Admin messages + IOIS CHAT & HELP unread count + pending friend requests)
 */
export const getUserUnreadCount = (userId: string): number => {
  if (!userId) return 0;
  const cleanId = userId.trim().toUpperCase();
  const adminUnread = getLocalPrivateChatMessages(cleanId).filter((m) => m.sender === 'admin' && !m.read).length;
  const socialCache = getSocialUnreadCache(cleanId);
  return adminUnread + (socialCache.totalUnreadCount || 0) + (socialCache.pendingFriendRequestsCount || 0);
};

/**
 * Mark all messages as read for a specific user and reader role
 */
export const markChatMessagesAsRead = (userId: string, readerRole: 'admin' | 'user'): void => {
  if (!userId) return;
  const cleanId = userId.trim().toUpperCase();
  const msgs = getLocalPrivateChatMessages(cleanId);
  let changed = false;

  const updated = msgs.map((m) => {
    // If Admin is reading, mark user messages as read
    if (readerRole === 'admin' && m.sender === 'user' && !m.read) {
      changed = true;
      return { ...m, read: true };
    }
    // If User is reading, mark admin messages as read
    if (readerRole === 'user' && m.sender === 'admin' && !m.read) {
      changed = true;
      return { ...m, read: true };
    }
    return m;
  });

  if (changed) {
    saveLocalPrivateChatMessages(cleanId, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('iois_notifications_updated'));
    }
  }
};
