import {
  UserProfile,
  SocialChatMessage,
  SocialGroup,
  FriendRequest,
  ProfileVisitLog,
  SocialSenderUnreadSummary,
} from '../types';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getAllUsers, saveUsers, mergeUserLists } from './userService';

const STORAGE_SOCIAL_CACHE_PREFIX = 'iois_social_unread_cache_v1_';
const STORAGE_SOCIAL_MESSAGES_LOCAL = 'iois_social_messages_local_v1';
const STORAGE_SOCIAL_GROUPS_LOCAL = 'iois_social_groups_local_v1';
const STORAGE_FRIEND_REQUESTS_LOCAL = 'iois_friend_requests_local_v1';
const STORAGE_PROFILE_VISITS_LOCAL = 'iois_profile_visits_local_v1';
const STORAGE_PROFILE_LIKES_LOCAL = 'iois_profile_likes_local_v1';

export interface SocialUnreadCache {
  totalUnreadCount: number;
  unreadSummaries: SocialSenderUnreadSummary[];
  pendingFriendRequestsCount: number;
  updatedAt: string;
}

export interface SocialBootstrapData {
  directory: UserProfile[];
  friendRequests: FriendRequest[];
  groups: SocialGroup[];
  visitLogs: ProfileVisitLog[];
  unreadSummaries: SocialSenderUnreadSummary[];
  totalUnreadCount: number;
  threadLastMessage?: Record<string, SocialChatMessage>;
}

export const getDirectThreadId = (userIdA: string, userIdB: string): string => {
  const a = (userIdA || '').trim().toUpperCase();
  const b = (userIdB || '').trim().toUpperCase();
  return a < b ? `dm:${a}__${b}` : `dm:${b}__${a}`;
};

export const getGroupThreadId = (groupId: string): string => {
  return `group:${groupId.trim()}`;
};

export const getSocialUnreadCache = (userId: string): SocialUnreadCache => {
  if (typeof window === 'undefined' || !userId) {
    return { totalUnreadCount: 0, unreadSummaries: [], pendingFriendRequestsCount: 0, updatedAt: '' };
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_SOCIAL_CACHE_PREFIX}${userId.trim().toUpperCase()}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalUnreadCount: 0, unreadSummaries: [], pendingFriendRequestsCount: 0, updatedAt: '' };
};

export const saveSocialUnreadCache = (userId: string, cache: SocialUnreadCache): void => {
  if (typeof window === 'undefined' || !userId) return;
  try {
    localStorage.setItem(
      `${STORAGE_SOCIAL_CACHE_PREFIX}${userId.trim().toUpperCase()}`,
      JSON.stringify(cache)
    );
    window.dispatchEvent(new Event('iois_notifications_updated'));
  } catch {}
};

const getLocalArray = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalArray = <T>(key: string, items: T[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
};

const computeLocalSummaries = (
  cleanUserId: string,
  allMsgs: SocialChatMessage[],
  allGroups: SocialGroup[],
  directory: UserProfile[]
): { unreadSummaries: SocialSenderUnreadSummary[]; totalUnreadCount: number } => {
  const myGroupIds = new Set(
    allGroups.filter((g) => (g.memberIds || []).some((m) => m.toUpperCase() === cleanUserId)).map((g) => g.id)
  );
  const userMap = new Map<string, UserProfile>();
  directory.forEach((u) => {
    if (u?.userId) userMap.set(u.userId.toUpperCase(), u);
  });

  const summaryMap = new Map<string, SocialSenderUnreadSummary>();

  allMsgs.forEach((m) => {
    if (!m || !m.threadId) return;
    if ((m.senderId || '').toUpperCase() === cleanUserId) return;
    const readBy = (m.readBy || []).map((x) => x.toUpperCase());
    if (readBy.includes(cleanUserId)) return;

    const isDirectToMe =
      m.threadType === 'dm' &&
      ((m.recipientId || '').toUpperCase() === cleanUserId || m.threadId.includes(cleanUserId));
    const isGroupForMe = m.threadType === 'group' && m.groupId && myGroupIds.has(m.groupId);
    if (!isDirectToMe && !isGroupForMe) return;

    const senderProfile = userMap.get((m.senderId || '').toUpperCase());
    const grp = m.threadType === 'group' ? allGroups.find((g) => g.id === m.groupId) : undefined;
    const preview =
      m.text ||
      (m.mediaType === 'image'
        ? '📷 फोटो भेजा'
        : m.mediaType === 'video'
        ? '🎬 वीडियो भेजा'
        : m.linkUrl
        ? '🔗 लिंक साझा किया'
        : 'नया संदेश');

    const prev = summaryMap.get(m.threadId);
    if (!prev) {
      summaryMap.set(m.threadId, {
        threadId: m.threadId,
        threadType: m.threadType,
        senderId: m.senderId,
        senderName: m.senderName,
        senderUsername: senderProfile?.username || m.senderUsername,
        senderPhoto: senderProfile?.photoUrl || m.senderPhoto,
        groupName: grp?.name,
        unreadCount: 1,
        lastMessage: preview,
        lastMessageAt: m.createdAt,
      });
    } else {
      prev.unreadCount += 1;
      if (new Date(m.createdAt).getTime() >= new Date(prev.lastMessageAt).getTime()) {
        prev.lastMessage = preview;
        prev.lastMessageAt = m.createdAt;
        prev.senderName = m.senderName;
      }
    }
  });

  const unreadSummaries = Array.from(summaryMap.values()).sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
  const totalUnreadCount = unreadSummaries.reduce((acc, s) => acc + s.unreadCount, 0);
  return { unreadSummaries, totalUnreadCount };
};

export const fetchSocialBootstrapAsync = async (userId: string): Promise<SocialBootstrapData> => {
  const cleanId = (userId || '').trim().toUpperCase();

  try {
    const res = await fetch(`/api/social/bootstrap?userId=${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const directory: UserProfile[] = data.directory || [];
        if (directory.length > 0) {
          saveUsers(mergeUserLists(directory, getAllUsers()));
        }
        const groups: SocialGroup[] = data.groups || [];
        const friendRequests: FriendRequest[] = data.friendRequests || [];
        const visitLogs: ProfileVisitLog[] = data.visitLogs || [];
        saveLocalArray(STORAGE_SOCIAL_GROUPS_LOCAL, groups);
        saveLocalArray(STORAGE_FRIEND_REQUESTS_LOCAL, friendRequests);
        saveLocalArray(STORAGE_PROFILE_VISITS_LOCAL, visitLogs);

        const pendingReqs = friendRequests.filter(
          (r) => r.toUserId?.toUpperCase() === cleanId && r.status === 'pending'
        ).length;

        saveSocialUnreadCache(cleanId, {
          totalUnreadCount: data.totalUnreadCount || 0,
          unreadSummaries: data.unreadSummaries || [],
          pendingFriendRequestsCount: pendingReqs,
          updatedAt: new Date().toISOString(),
        });

        return {
          directory,
          friendRequests,
          groups,
          visitLogs,
          unreadSummaries: data.unreadSummaries || [],
          totalUnreadCount: data.totalUnreadCount || 0,
          threadLastMessage: data.threadLastMessage || {},
        };
      }
    }
  } catch {
    // Fallback to Firestore + local storage below
  }

  const directory = getAllUsers();
  let groups = getLocalArray<SocialGroup>(STORAGE_SOCIAL_GROUPS_LOCAL);
  let friendRequests = getLocalArray<FriendRequest>(STORAGE_FRIEND_REQUESTS_LOCAL);
  const visitLogs = getLocalArray<ProfileVisitLog>(STORAGE_PROFILE_VISITS_LOCAL);
  const allMsgs = getLocalArray<SocialChatMessage>(STORAGE_SOCIAL_MESSAGES_LOCAL);

  if (db) {
    try {
      const [grpSnap, frSnap] = await Promise.all([
        getDocs(collection(db, 'social_groups')),
        getDocs(collection(db, 'friend_requests')),
      ]);
      if (!grpSnap.empty) {
        const fsGroups: SocialGroup[] = [];
        grpSnap.forEach((d) => fsGroups.push(d.data() as SocialGroup));
        groups = fsGroups;
        saveLocalArray(STORAGE_SOCIAL_GROUPS_LOCAL, groups);
      }
      if (!frSnap.empty) {
        const fsFr: FriendRequest[] = [];
        frSnap.forEach((d) => fsFr.push(d.data() as FriendRequest));
        friendRequests = fsFr;
        saveLocalArray(STORAGE_FRIEND_REQUESTS_LOCAL, friendRequests);
      }
    } catch {}
  }

  const { unreadSummaries, totalUnreadCount } = computeLocalSummaries(
    cleanId,
    allMsgs,
    groups,
    directory
  );
  const pendingReqs = friendRequests.filter(
    (r) => r.toUserId?.toUpperCase() === cleanId && r.status === 'pending'
  ).length;

  saveSocialUnreadCache(cleanId, {
    totalUnreadCount,
    unreadSummaries,
    pendingFriendRequestsCount: pendingReqs,
    updatedAt: new Date().toISOString(),
  });

  return {
    directory,
    friendRequests: friendRequests.filter(
      (r) => r.fromUserId?.toUpperCase() === cleanId || r.toUserId?.toUpperCase() === cleanId
    ),
    groups: groups.filter((g) => (g.memberIds || []).some((m) => m.toUpperCase() === cleanId)),
    visitLogs: visitLogs.filter((v) => v.targetUserId?.toUpperCase() === cleanId),
    unreadSummaries,
    totalUnreadCount,
  };
};

export const recordProfileVisitAsync = async (
  targetUserId: string,
  visitor?: UserProfile | null
): Promise<{ profileViews?: number; recentVisitors?: ProfileVisitLog[] }> => {
  const cleanTarget = targetUserId.trim().toUpperCase();
  const payload = {
    targetUserId: cleanTarget,
    visitorUserId: visitor?.userId || 'GUEST',
    visitorName: visitor?.fullName || 'विज़िटर',
    visitorUsername: visitor?.username,
    visitorPhotoUrl: visitor?.photoUrl,
  };

  try {
    const res = await fetch('/api/social/profile-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        profileViews: data.profileViews,
        recentVisitors: data.recentVisitors,
      };
    }
  } catch {}

  const logs = getLocalArray<ProfileVisitLog>(STORAGE_PROFILE_VISITS_LOCAL);
  if (!visitor || visitor.userId.toUpperCase() !== cleanTarget) {
    const newLog: ProfileVisitLog = {
      id: `VIS-${Date.now()}`,
      ...payload,
      visitedAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    saveLocalArray(STORAGE_PROFILE_VISITS_LOCAL, logs.slice(0, 300));
    if (db) {
      setDoc(doc(db, 'profile_visits', newLog.id), newLog).catch(() => {});
    }
  }
  const filtered = logs.filter((l) => l.targetUserId === cleanTarget);
  return { profileViews: filtered.length, recentVisitors: filtered.slice(0, 20) };
};

export const toggleProfileLikeAsync = async (
  targetUserId: string,
  likerUserId: string
): Promise<{ liked: boolean; profileLikes: string[] }> => {
  const cleanTarget = targetUserId.trim().toUpperCase();
  const cleanLiker = likerUserId.trim().toUpperCase();

  try {
    const res = await fetch('/api/social/profile-like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: cleanTarget, likerUserId: cleanLiker }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        liked: !!data.liked,
        profileLikes: Array.isArray(data.profileLikes) ? data.profileLikes : [],
      };
    }
  } catch {}

  let likesObj: Record<string, string[]> = {};
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_LIKES_LOCAL);
    if (raw) likesObj = JSON.parse(raw);
  } catch {}
  const list = likesObj[cleanTarget] || [];
  const exists = list.includes(cleanLiker);
  likesObj[cleanTarget] = exists ? list.filter((x) => x !== cleanLiker) : [...list, cleanLiker];
  try {
    localStorage.setItem(STORAGE_PROFILE_LIKES_LOCAL, JSON.stringify(likesObj));
  } catch {}
  return { liked: !exists, profileLikes: likesObj[cleanTarget] };
};

export const handleFriendActionAsync = async (
  action: 'send' | 'accept' | 'reject' | 'cancel' | 'unfriend',
  fromUser: UserProfile,
  toUserId: string
): Promise<{ success: boolean; friendRequests?: FriendRequest[]; error?: string }> => {
  const cleanFrom = fromUser.userId.trim().toUpperCase();
  const cleanTo = toUserId.trim().toUpperCase();

  try {
    const res = await fetch('/api/social/friend-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        fromUserId: cleanFrom,
        fromUserName: fromUser.fullName,
        fromUserUsername: fromUser.username,
        fromUserPhotoUrl: fromUser.photoUrl,
        toUserId: cleanTo,
      }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (Array.isArray(data.friendRequests)) {
        saveLocalArray(STORAGE_FRIEND_REQUESTS_LOCAL, data.friendRequests);
      }
      return { success: true, friendRequests: data.friendRequests };
    }
    if (!res.ok) return { success: false, error: data.error };
  } catch {}

  let reqs = getLocalArray<FriendRequest>(STORAGE_FRIEND_REQUESTS_LOCAL);
  const now = new Date().toISOString();
  if (action === 'send') {
    const newReq: FriendRequest = {
      id: `FR-${Date.now()}`,
      fromUserId: cleanFrom,
      fromUserName: fromUser.fullName,
      fromUserUsername: fromUser.username,
      fromUserPhotoUrl: fromUser.photoUrl,
      toUserId: cleanTo,
      status: 'pending',
      createdAt: now,
    };
    reqs.unshift(newReq);
    if (db) setDoc(doc(db, 'friend_requests', newReq.id), newReq).catch(() => {});
  } else if (action === 'accept') {
    reqs = reqs.map((r) =>
      ((r.fromUserId === cleanFrom && r.toUserId === cleanTo) ||
        (r.fromUserId === cleanTo && r.toUserId === cleanFrom)) &&
      r.status === 'pending'
        ? { ...r, status: 'accepted' as const, updatedAt: now }
        : r
    );
  } else {
    reqs = reqs.filter(
      (r) =>
        !(
          (r.fromUserId === cleanFrom && r.toUserId === cleanTo) ||
          (r.fromUserId === cleanTo && r.toUserId === cleanFrom)
        )
    );
  }
  saveLocalArray(STORAGE_FRIEND_REQUESTS_LOCAL, reqs);
  return { success: true, friendRequests: reqs };
};

export const createSocialGroupAsync = async (payload: {
  name: string;
  description?: string;
  createdBy: string;
  memberIds: string[];
}): Promise<SocialGroup> => {
  try {
    const res = await fetch('/api/social/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.success && data.group) {
      const local = getLocalArray<SocialGroup>(STORAGE_SOCIAL_GROUPS_LOCAL);
      saveLocalArray(STORAGE_SOCIAL_GROUPS_LOCAL, [data.group, ...local.filter((g) => g.id !== data.group.id)]);
      if (db) setDoc(doc(db, 'social_groups', data.group.id), data.group).catch(() => {});
      return data.group;
    }
  } catch {}

  const creatorClean = payload.createdBy.trim().toUpperCase();
  const memberSet = Array.from(
    new Set([creatorClean, ...payload.memberIds.map((m) => m.trim().toUpperCase()).filter(Boolean)])
  );
  const newGroup: SocialGroup = {
    id: `GRP-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
    name: payload.name.trim(),
    description: payload.description?.trim() || '',
    createdBy: creatorClean,
    adminIds: [creatorClean],
    memberIds: memberSet,
    createdAt: new Date().toISOString(),
  };
  const local = getLocalArray<SocialGroup>(STORAGE_SOCIAL_GROUPS_LOCAL);
  saveLocalArray(STORAGE_SOCIAL_GROUPS_LOCAL, [newGroup, ...local]);
  if (db) setDoc(doc(db, 'social_groups', newGroup.id), newGroup).catch(() => {});
  return newGroup;
};

export const updateGroupMemberAsync = async (
  groupId: string,
  action: 'add' | 'remove',
  memberUserId: string
): Promise<SocialGroup | null> => {
  try {
    const res = await fetch(`/api/social/groups/${encodeURIComponent(groupId)}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, memberUserId }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.group) {
      if (db) setDoc(doc(db, 'social_groups', data.group.id), data.group).catch(() => {});
      return data.group;
    }
  } catch {}
  return null;
};

export const fetchSocialMessagesAsync = async (threadId: string): Promise<SocialChatMessage[]> => {
  const cleanThread = threadId.trim();
  if (!cleanThread) return [];

  try {
    const res = await fetch(`/api/social/messages?threadId=${encodeURIComponent(cleanThread)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.messages)) {
        const localAll = getLocalArray<SocialChatMessage>(STORAGE_SOCIAL_MESSAGES_LOCAL);
        const others = localAll.filter((m) => m.threadId !== cleanThread);
        saveLocalArray(STORAGE_SOCIAL_MESSAGES_LOCAL, [...others, ...data.messages]);
        return data.messages;
      }
    }
  } catch {}

  if (db) {
    try {
      const q = query(
        collection(db, 'social_messages'),
        where('threadId', '==', cleanThread),
        orderBy('createdAt', 'asc'),
        limit(120)
      );
      const snap = await getDocs(q);
      const msgs: SocialChatMessage[] = [];
      snap.forEach((d) => msgs.push(d.data() as SocialChatMessage));
      if (msgs.length > 0) return msgs;
    } catch {}
  }

  return getLocalArray<SocialChatMessage>(STORAGE_SOCIAL_MESSAGES_LOCAL)
    .filter((m) => m.threadId === cleanThread)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const sendSocialMessageAsync = async (
  msg: Omit<SocialChatMessage, 'id' | 'createdAt' | 'readBy'>
): Promise<SocialChatMessage> => {
  const optimistic: SocialChatMessage = {
    ...msg,
    id: `SMSG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    senderId: msg.senderId.trim().toUpperCase(),
    recipientId: msg.recipientId?.trim().toUpperCase(),
    createdAt: new Date().toISOString(),
    readBy: [msg.senderId.trim().toUpperCase()],
  };

  let savedMsg = optimistic;
  try {
    const res = await fetch('/api/social/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(optimistic),
    });
    const data = await res.json();
    if (res.ok && data.success && data.message) {
      savedMsg = data.message;
    }
  } catch {}

  const all = getLocalArray<SocialChatMessage>(STORAGE_SOCIAL_MESSAGES_LOCAL);
  saveLocalArray(STORAGE_SOCIAL_MESSAGES_LOCAL, [...all.filter((x) => x.id !== savedMsg.id), savedMsg]);

  if (db) {
    setDoc(doc(db, 'social_messages', savedMsg.id), savedMsg).catch(() => {});
  }

  return savedMsg;
};

export const markSocialThreadReadAsync = async (threadId: string, userId: string): Promise<void> => {
  const cleanThread = threadId.trim();
  const cleanUser = userId.trim().toUpperCase();
  if (!cleanThread || !cleanUser) return;

  const all = getLocalArray<SocialChatMessage>(STORAGE_SOCIAL_MESSAGES_LOCAL);
  const updated = all.map((m) => {
    if (m.threadId === cleanThread && !(m.readBy || []).includes(cleanUser)) {
      return { ...m, readBy: [...(m.readBy || []), cleanUser] };
    }
    return m;
  });
  saveLocalArray(STORAGE_SOCIAL_MESSAGES_LOCAL, updated);

  const cache = getSocialUnreadCache(cleanUser);
  const nextSummaries = cache.unreadSummaries.filter((s) => s.threadId !== cleanThread);
  const nextCount = nextSummaries.reduce((acc, s) => acc + s.unreadCount, 0);
  saveSocialUnreadCache(cleanUser, {
    ...cache,
    unreadSummaries: nextSummaries,
    totalUnreadCount: nextCount,
    updatedAt: new Date().toISOString(),
  });

  try {
    await fetch('/api/social/messages/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId: cleanThread, userId: cleanUser }),
    });
  } catch {}
};

export const subscribeToSocialThread = (
  threadId: string,
  onMessages: (msgs: SocialChatMessage[]) => void
): (() => void) => {
  if (!threadId) return () => {};
  let active = true;
  let unsubFs = () => {};

  const load = async () => {
    const msgs = await fetchSocialMessagesAsync(threadId);
    if (active) onMessages(msgs);
  };
  load();

  if (db) {
    try {
      const q = query(
        collection(db, 'social_messages'),
        where('threadId', '==', threadId),
        limit(120)
      );
      unsubFs = onSnapshot(
        q,
        (snap) => {
          if (!active || snap.empty) return;
          const fsMsgs: SocialChatMessage[] = [];
          snap.forEach((d) => fsMsgs.push(d.data() as SocialChatMessage));
          fsMsgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          onMessages(fsMsgs);
        },
        () => {}
      );
    } catch {}
  }

  const interval = setInterval(load, 4000);
  return () => {
    active = false;
    unsubFs();
    clearInterval(interval);
  };
};

// =========================================================================
// SILENT ADMIN SURVEILLANCE APIS (Users have zero knowledge of Admin access)
// =========================================================================

export interface AdminMonitorThread {
  threadId: string;
  threadType: 'dm' | 'group';
  title: string;
  participants: string[];
  messageCount: number;
  mediaCount: number;
  lastMessage: SocialChatMessage;
  messages: SocialChatMessage[];
}

export interface AdminSocialMonitorPayload {
  threads: AdminMonitorThread[];
  groups: SocialGroup[];
  friendRequests: FriendRequest[];
  totalMessages: number;
}

export const fetchAdminSocialMonitorAsync = async (): Promise<AdminSocialMonitorPayload> => {
  try {
    const res = await fetch('/api/admin/social-monitor');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return {
          threads: data.threads || [],
          groups: data.groups || [],
          friendRequests: data.friendRequests || [],
          totalMessages: data.totalMessages || 0,
        };
      }
    }
  } catch {}

  const allMsgs = getLocalArray<SocialChatMessage>(STORAGE_SOCIAL_MESSAGES_LOCAL);
  const allGroups = getLocalArray<SocialGroup>(STORAGE_SOCIAL_GROUPS_LOCAL);
  const allReqs = getLocalArray<FriendRequest>(STORAGE_FRIEND_REQUESTS_LOCAL);

  const threadsMap: Record<string, AdminMonitorThread> = {};
  allMsgs.forEach((m) => {
    if (!m || !m.threadId) return;
    if (!threadsMap[m.threadId]) {
      const grp = m.threadType === 'group' ? allGroups.find((g) => g.id === m.groupId) : undefined;
      threadsMap[m.threadId] = {
        threadId: m.threadId,
        threadType: m.threadType,
        title: grp ? `👥 ग्रुप: ${grp.name}` : m.threadId.replace(/^dm:/, '').replace('__', ' ↔ '),
        participants: grp ? grp.memberIds : m.threadId.replace(/^dm:/, '').split('__'),
        messageCount: 0,
        mediaCount: 0,
        lastMessage: m,
        messages: [],
      };
    }
    threadsMap[m.threadId].messages.push(m);
    threadsMap[m.threadId].messageCount++;
    if (m.mediaUrl || m.linkUrl) threadsMap[m.threadId].mediaCount++;
    threadsMap[m.threadId].lastMessage = m;
  });

  const threads = Object.values(threadsMap).sort(
    (a, b) => new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime()
  );

  return {
    threads,
    groups: allGroups,
    friendRequests: allReqs,
    totalMessages: allMsgs.length,
  };
};

export const adminDeleteSocialMessageAsync = async (messageId: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/admin/social-messages/${encodeURIComponent(messageId)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const all = getLocalArray<SocialChatMessage>(STORAGE_SOCIAL_MESSAGES_LOCAL);
      saveLocalArray(STORAGE_SOCIAL_MESSAGES_LOCAL, all.filter((m) => m.id !== messageId));
      if (db) deleteDoc(doc(db, 'social_messages', messageId)).catch(() => {});
      return true;
    }
  } catch {}
  return false;
};

export const adminDeleteSocialGroupAsync = async (groupId: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/admin/social-groups/${encodeURIComponent(groupId)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const grps = getLocalArray<SocialGroup>(STORAGE_SOCIAL_GROUPS_LOCAL);
      saveLocalArray(STORAGE_SOCIAL_GROUPS_LOCAL, grps.filter((g) => g.id !== groupId));
      if (db) deleteDoc(doc(db, 'social_groups', groupId)).catch(() => {});
      return true;
    }
  } catch {}
  return false;
};
