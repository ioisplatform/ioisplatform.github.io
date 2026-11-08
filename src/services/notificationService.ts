import { AdminPrivateMessage, HelpTicket } from '../types';
import { 
  getLocalPrivateChatMessages, 
  saveLocalPrivateChatMessages, 
  fetchUsersFromServer,
  getAllUsers 
} from './userService';

export interface AppNotificationItem {
  id: string;
  type: 'private_chat' | 'ticket' | 'approval';
  userId: string;
  userName: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  linkAction?: string;
  avatarUrl?: string;
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
 * Get all unread notifications for a specific logged-in user
 */
export const getUserNotifications = (userId: string): AppNotificationItem[] => {
  if (!userId) return [];
  const cleanId = userId.trim().toUpperCase();
  const msgs = getLocalPrivateChatMessages(cleanId);
  const notifications: AppNotificationItem[] = [];

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

  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return notifications;
};

/**
 * Get unread message count for a specific user
 */
export const getUserUnreadCount = (userId: string): number => {
  if (!userId) return 0;
  return getUserNotifications(userId).length;
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
