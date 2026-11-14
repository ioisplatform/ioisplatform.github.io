import React, { useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  SocialChatMessage,
  SocialGroup,
  FriendRequest,
  SocialSenderUnreadSummary,
} from '../types';
import { getProfileFrameById } from '../data/profileFramesData';
import {
  getDirectThreadId,
  getGroupThreadId,
  fetchSocialBootstrapAsync,
  sendSocialMessageAsync,
  markSocialThreadReadAsync,
  subscribeToSocialThread,
  handleFriendActionAsync,
  createSocialGroupAsync,
  updateGroupMemberAsync,
} from '../services/socialChatService';
import {
  MessageSquare,
  Users,
  UserPlus,
  Search,
  Send,
  Image as ImageIcon,
  Video,
  Link2,
  ArrowLeft,
  Check,
  X,
  UserCheck,
  UserMinus,
  Eye,
  Plus,
  Sparkles,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface IoisChatHelpHubProps {
  currentUser: UserProfile | null;
  initialThreadId?: string;
  initialTargetUserId?: string;
  onOpenPublicProfile?: (userOrHandle: UserProfile | string) => void;
  embedded?: boolean;
}

type HubSubTab = 'chats' | 'groups' | 'friends' | 'discover';

export const IoisChatHelpHub: React.FC<IoisChatHelpHubProps> = ({
  currentUser,
  initialThreadId,
  initialTargetUserId,
  onOpenPublicProfile,
  embedded = false,
}) => {
  const [subTab, setSubTab] = useState<HubSubTab>('chats');
  const [directory, setDirectory] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [groups, setGroups] = useState<SocialGroup[]>([]);
  const [unreadSummaries, setUnreadSummaries] = useState<SocialSenderUnreadSummary[]>([]);
  const [threadLastMessage, setThreadLastMessage] = useState<Record<string, SocialChatMessage>>({});

  // Active conversation state
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [activeThreadType, setActiveThreadType] = useState<'dm' | 'group'>('dm');
  const [activePeerUser, setActivePeerUser] = useState<UserProfile | null>(null);
  const [activeGroup, setActiveGroup] = useState<SocialGroup | null>(null);
  const [messages, setMessages] = useState<SocialChatMessage[]>([]);

  // Composer state
  const [textInput, setTextInput] = useState('');
  const [attachMediaType, setAttachMediaType] = useState<'image' | 'video' | 'link' | null>(null);
  const [attachMediaUrl, setAttachMediaUrl] = useState('');
  const [attachLinkTitle, setAttachLinkTitle] = useState('');
  const [sending, setSending] = useState(false);

  // Search & Group Creation
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [addMemberInput, setAddMemberInput] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const myId = currentUser?.userId?.trim().toUpperCase() || '';

  const loadBootstrap = async () => {
    if (!myId) return;
    const data = await fetchSocialBootstrapAsync(myId);
    setDirectory(data.directory || []);
    setFriendRequests(data.friendRequests || []);
    setGroups(data.groups || []);
    setUnreadSummaries(data.unreadSummaries || []);
    setThreadLastMessage(data.threadLastMessage || {});
    return data;
  };

  useEffect(() => {
    if (!myId) return;
    loadBootstrap().then((data) => {
      if (!data) return;
      if (initialTargetUserId) {
        const peer = data.directory.find(
          (u) => u.userId?.toUpperCase() === initialTargetUserId.trim().toUpperCase()
        );
        if (peer) {
          openDmThread(peer);
          return;
        }
      }
      if (initialThreadId) {
        if (initialThreadId.startsWith('group:')) {
          const gid = initialThreadId.replace(/^group:/, '');
          const grp = data.groups.find((g) => g.id === gid);
          if (grp) openGroupThread(grp);
        } else if (initialThreadId.startsWith('dm:')) {
          const pair = initialThreadId.replace(/^dm:/, '').split('__');
          const otherId = pair.find((id) => id !== myId) || pair[0];
          const peer = data.directory.find((u) => u.userId?.toUpperCase() === otherId);
          if (peer) openDmThread(peer);
        }
      }
    });

    const interval = setInterval(() => {
      loadBootstrap();
    }, 7000);
    return () => clearInterval(interval);
  }, [myId, initialThreadId, initialTargetUserId]);

  useEffect(() => {
    if (!activeThreadId || !myId) return;
    markSocialThreadReadAsync(activeThreadId, myId).then(() => {
      loadBootstrap();
    });
    const unsub = subscribeToSocialThread(activeThreadId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    });
    return () => unsub();
  }, [activeThreadId, myId]);

  if (!currentUser) {
    return (
      <div className="p-6 text-center rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 space-y-2">
        <MessageSquare className="w-10 h-10 text-cyan-400 mx-auto" />
        <h3 className="text-base font-black text-white">IOIS CHAT & HELP</h3>
        <p className="text-xs text-slate-400">
          अपने स्पॉन्सर व अन्य सदस्यों से चैट करने, फोटो/वीडियो/लिंक शेयर करने और ग्रुप बनाने के लिए पहले लॉगिन करें।
        </p>
      </div>
    );
  }

  const openDmThread = (peer: UserProfile) => {
    const tid = getDirectThreadId(myId, peer.userId);
    setActiveThreadType('dm');
    setActiveGroup(null);
    setActivePeerUser(peer);
    setActiveThreadId(tid);
    setSubTab('chats');
  };

  const openGroupThread = (grp: SocialGroup) => {
    const tid = getGroupThreadId(grp.id);
    setActiveThreadType('group');
    setActivePeerUser(null);
    setActiveGroup(grp);
    setActiveThreadId(tid);
    setSubTab('groups');
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachMediaType('image');
        setAttachMediaUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setStatusNotice('बड़े वीडियो के लिए कृपया नीचे वीडियो लिंक (YouTube / Drive / MP4 URL) पेस्ट करें।');
      setAttachMediaType('video');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachMediaType('video');
        setAttachMediaUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadId) return;
    if (!textInput.trim() && !attachMediaUrl.trim()) return;

    setSending(true);
    try {
      await sendSocialMessageAsync({
        threadType: activeThreadType,
        threadId: activeThreadId,
        senderId: myId,
        senderName: currentUser.fullName,
        senderUsername: currentUser.username,
        senderPhoto: currentUser.photoUrl,
        recipientId: activeThreadType === 'dm' ? activePeerUser?.userId : undefined,
        groupId: activeThreadType === 'group' ? activeGroup?.id : undefined,
        text: textInput.trim(),
        mediaType: attachMediaType || undefined,
        mediaUrl: attachMediaType === 'image' || attachMediaType === 'video' ? attachMediaUrl.trim() : undefined,
        linkUrl: attachMediaType === 'link' ? attachMediaUrl.trim() : undefined,
        linkTitle: attachMediaType === 'link' ? attachLinkTitle.trim() || undefined : undefined,
      });
      setTextInput('');
      setAttachMediaType(null);
      setAttachMediaUrl('');
      setAttachLinkTitle('');
    } finally {
      setSending(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const grp = await createSocialGroupAsync({
      name: newGroupName.trim(),
      description: newGroupDesc.trim(),
      createdBy: myId,
      memberIds: [myId, ...selectedGroupMembers],
    });
    setNewGroupName('');
    setNewGroupDesc('');
    setSelectedGroupMembers([]);
    setShowCreateGroup(false);
    await loadBootstrap();
    openGroupThread(grp);
  };

  const handleAddMemberToActiveGroup = async () => {
    if (!activeGroup || !addMemberInput.trim()) return;
    const queryLower = addMemberInput.trim().toLowerCase().replace(/^@/, '');
    const found = directory.find(
      (u) =>
        u.userId.toUpperCase() === addMemberInput.trim().toUpperCase() ||
        (u.username && u.username.toLowerCase() === queryLower)
    );
    const targetId = found?.userId || addMemberInput.trim().toUpperCase();
    const updated = await updateGroupMemberAsync(activeGroup.id, 'add', targetId);
    if (updated) {
      setActiveGroup(updated);
      setAddMemberInput('');
      setStatusNotice(`${found?.fullName || targetId} को ग्रुप में जोड़ा गया।`);
      loadBootstrap();
    }
  };

  const handleFriend = async (
    action: 'send' | 'accept' | 'reject' | 'cancel' | 'unfriend',
    peerId: string
  ) => {
    await handleFriendActionAsync(action, currentUser, peerId);
    await loadBootstrap();
  };

  // Filtered member directory
  const otherMembers = directory.filter((u) => u.userId?.toUpperCase() !== myId);
  const qLower = searchQuery.trim().toLowerCase().replace(/^@/, '');
  const filteredMembers = otherMembers.filter((u) => {
    if (!qLower) return true;
    return (
      u.fullName.toLowerCase().includes(qLower) ||
      u.userId.toLowerCase().includes(qLower) ||
      (u.username && u.username.toLowerCase().includes(qLower))
    );
  });

  // Sponsor user shortcut
  const mySponsor = currentUser.sponsorId
    ? otherMembers.find((u) => u.userId?.toUpperCase() === currentUser.sponsorId?.toUpperCase())
    : undefined;

  // Friendships breakdown
  const incomingRequests = friendRequests.filter(
    (r) => r.toUserId?.toUpperCase() === myId && r.status === 'pending'
  );
  const outgoingRequests = friendRequests.filter(
    (r) => r.fromUserId?.toUpperCase() === myId && r.status === 'pending'
  );
  const acceptedFriendIds = new Set<string>();
  friendRequests.forEach((r) => {
    if (r.status === 'accepted') {
      if (r.fromUserId?.toUpperCase() === myId) acceptedFriendIds.add(r.toUserId.toUpperCase());
      if (r.toUserId?.toUpperCase() === myId) acceptedFriendIds.add(r.fromUserId.toUpperCase());
    }
  });
  const myFriends = otherMembers.filter((u) => acceptedFriendIds.has(u.userId.toUpperCase()));

  const getUnreadForThread = (tid: string) =>
    unreadSummaries.find((s) => s.threadId === tid)?.unreadCount || 0;

  const totalUnread = unreadSummaries.reduce((acc, s) => acc + s.unreadCount, 0);

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden text-slate-200 ${
        embedded ? 'h-[72dvh] min-h-[460px]' : 'h-[78dvh] min-h-[500px]'
      }`}
    >
      {/* Top Brand Header + Tabs */}
      <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-cyan-900/90 border-b border-slate-700 px-3 py-2.5 shrink-0 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-white truncate">
                IOIS CHAT & HELP
              </h2>
              <p className="text-[10px] text-cyan-200 truncate">
                स्पॉन्सर चैट • ग्रुप • फोटो/वीडियो/लिंक शेयरिंग • मित्र नेटवर्क
              </p>
            </div>
          </div>

          {onOpenPublicProfile && (
            <button
              type="button"
              onClick={() => onOpenPublicProfile(currentUser)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-[11px] font-bold text-cyan-200 flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>मेरा प्रोफाइल</span>
            </button>
          )}
        </div>

        {/* Live Unread Summary Strip */}
        {unreadSummaries.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-black text-amber-300 shrink-0">अपठित:</span>
            {unreadSummaries.map((s) => (
              <button
                key={s.threadId}
                type="button"
                onClick={() => {
                  if (s.threadType === 'group') {
                    const g = groups.find((x) => `group:${x.id}` === s.threadId);
                    if (g) openGroupThread(g);
                  } else {
                    const peer = directory.find((u) => u.userId?.toUpperCase() === s.senderId?.toUpperCase());
                    if (peer) openDmThread(peer);
                  }
                }}
                className="shrink-0 px-2 py-0.5 rounded-lg bg-rose-600/25 border border-rose-500/50 text-[10px] font-bold text-rose-100 hover:bg-rose-600/40 cursor-pointer"
              >
                {s.groupName || s.senderName}: {s.unreadCount} नए
              </button>
            ))}
          </div>
        )}

        {/* Sub Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'chats' as HubSubTab, label: 'चैट', icon: MessageSquare, badge: totalUnread },
            { id: 'groups' as HubSubTab, label: `ग्रुप (${groups.length})`, icon: Users, badge: 0 },
            {
              id: 'friends' as HubSubTab,
              label: `मित्र (${myFriends.length})`,
              icon: UserCheck,
              badge: incomingRequests.length,
            },
            { id: 'discover' as HubSubTab, label: 'खोजें (@)', icon: Search, badge: 0 },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSubTab(t.id);
                if (t.id !== 'chats' && t.id !== 'groups') {
                  setActiveThreadId('');
                }
              }}
              className={`relative py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                subTab === t.id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <t.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.label}</span>
              {t.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Responsive Split Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left List Column */}
        <div
          className={`${
            activeThreadId ? 'hidden md:flex' : 'flex'
          } w-full md:w-72 lg:w-80 border-r border-slate-700/80 flex-col bg-slate-900/95 min-h-0`}
        >
          {/* Search Bar inside list */}
          <div className="p-2.5 border-b border-slate-800 space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="नाम, @username या ID खोजें..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            {subTab === 'groups' && (
              <button
                type="button"
                onClick={() => setShowCreateGroup(true)}
                className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>नया ग्रुप बनाएं</span>
              </button>
            )}
          </div>

          {/* List Body */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {subTab === 'chats' && (
              <>
                {mySponsor && (
                  <button
                    type="button"
                    onClick={() => openDmThread(mySponsor)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                      activePeerUser?.userId === mySponsor.userId
                        ? 'bg-cyan-600/20 border-cyan-500'
                        : 'bg-indigo-950/50 border-indigo-500/40 hover:bg-indigo-900/40'
                    }`}
                  >
                    <div className={`w-10 h-10 shrink-0 ${getProfileFrameById(mySponsor.profileFrameId).cssClass || getProfileFrameById(mySponsor.profileFrameId).effectClass}`}>
                      <img
                        src={mySponsor.photoUrl?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={mySponsor.fullName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-amber-300 truncate">
                          ⭐ मेरे स्पॉन्सर: {mySponsor.fullName}
                        </span>
                        {getUnreadForThread(getDirectThreadId(myId, mySponsor.userId)) > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                            {getUnreadForThread(getDirectThreadId(myId, mySponsor.userId))}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {mySponsor.username ? `@${mySponsor.username} • ` : ''}
                        {mySponsor.userId}
                      </p>
                    </div>
                  </button>
                )}

                {filteredMembers.map((u) => {
                  const tid = getDirectThreadId(myId, u.userId);
                  const unread = getUnreadForThread(tid);
                  const lastMsg = threadLastMessage[tid];
                  return (
                    <div
                      key={u.userId}
                      className={`p-2 rounded-xl border flex items-center gap-2.5 transition ${
                        activePeerUser?.userId === u.userId
                          ? 'bg-cyan-600/20 border-cyan-500'
                          : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => openDmThread(u)}
                        className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
                      >
                        <div className={`w-10 h-10 shrink-0 ${getProfileFrameById(u.profileFrameId).cssClass || getProfileFrameById(u.profileFrameId).effectClass}`}>
                          <img
                            src={u.photoUrl?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={u.fullName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white truncate">{u.fullName}</span>
                            {unread > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black shrink-0">
                                {unread}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-cyan-300 truncate">
                            {u.username ? `@${u.username}` : u.userId}
                          </p>
                          {lastMsg && (
                            <p className="text-[10px] text-slate-400 truncate">{lastMsg.text || 'मीडिया भेजा'}</p>
                          )}
                        </div>
                      </button>
                      {onOpenPublicProfile && (
                        <button
                          type="button"
                          onClick={() => onOpenPublicProfile(u)}
                          title="प्रोफाइल देखें"
                          className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-600 text-cyan-300 shrink-0 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {subTab === 'groups' && (
              <>
                {groups.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8 px-3">
                    अभी आप किसी ग्रुप में शामिल नहीं हैं। ऊपर "नया ग्रुप बनाएं" बटन से अपना ग्रुप शुरू करें!
                  </p>
                ) : (
                  groups.map((grp) => {
                    const tid = getGroupThreadId(grp.id);
                    const unread = getUnreadForThread(tid);
                    return (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => openGroupThread(grp)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                          activeGroup?.id === grp.id
                            ? 'bg-cyan-600/20 border-cyan-500'
                            : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {grp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white truncate">{grp.name}</span>
                            {unread > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                                {unread}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">
                            {grp.memberIds.length} सदस्य {grp.description ? `• ${grp.description}` : ''}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </>
            )}

            {subTab === 'friends' && (
              <div className="space-y-3 p-1">
                {incomingRequests.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-black text-amber-300">
                      नए फ्रेंड रिक्वेस्ट ({incomingRequests.length})
                    </p>
                    {incomingRequests.map((req) => {
                      const sender = directory.find(
                        (u) => u.userId?.toUpperCase() === req.fromUserId?.toUpperCase()
                      );
                      return (
                        <div
                          key={req.id}
                          className="p-2.5 rounded-xl bg-amber-950/35 border border-amber-500/40 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                sender?.photoUrl ||
                                req.fromUserPhotoUrl ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                              }
                              alt={sender?.fullName || req.fromUserId}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white truncate">
                                {sender?.fullName || req.fromUserName || req.fromUserId}
                              </p>
                              <p className="text-[10px] text-cyan-300 truncate">
                                {sender?.username ? `@${sender.username}` : req.fromUserId}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleFriend('accept', req.fromUserId)}
                              className="py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" /> स्वीकारें
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFriend('reject', req.fromUserId)}
                              className="py-1 rounded-lg bg-slate-700 hover:bg-rose-600 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" /> अस्वीकारें
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {outgoingRequests.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400">
                      भेजे गए रिक्वेस्ट ({outgoingRequests.length})
                    </p>
                    {outgoingRequests.map((req) => {
                      const target = directory.find(
                        (u) => u.userId?.toUpperCase() === req.toUserId?.toUpperCase()
                      );
                      return (
                        <div
                          key={req.id}
                          className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="truncate font-semibold text-slate-200">
                            {target?.fullName || req.toUserId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleFriend('cancel', req.toUserId)}
                            className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-rose-600 text-[10px] font-bold text-white shrink-0 cursor-pointer"
                          >
                            रद्द करें
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-1.5">
                  <p className="text-[11px] font-black text-emerald-300">
                    मेरे मित्र ({myFriends.length})
                  </p>
                  {myFriends.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      अभी कोई मित्र नहीं जुड़ा है। "खोजें (@)" टैब से सदस्यों को Add Friend करें!
                    </p>
                  ) : (
                    myFriends.map((f) => (
                      <div
                        key={f.userId}
                        className="p-2 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img
                            src={f.photoUrl?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={f.fullName}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{f.fullName}</p>
                            <p className="text-[10px] text-cyan-300 truncate">
                              {f.username ? `@${f.username}` : f.userId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => openDmThread(f)}
                            className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                            title="चैट करें"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          {onOpenPublicProfile && (
                            <button
                              type="button"
                              onClick={() => onOpenPublicProfile(f)}
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                              title="प्रोफाइल देखें"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleFriend('unfriend', f.userId)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-600 text-rose-300 hover:text-white cursor-pointer"
                            title="मित्र हटाएं"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {subTab === 'discover' && (
              <div className="space-y-1.5">
                {filteredMembers.map((u) => {
                  const isFr = acceptedFriendIds.has(u.userId.toUpperCase());
                  const hasSent = outgoingRequests.some(
                    (r) => r.toUserId?.toUpperCase() === u.userId.toUpperCase()
                  );
                  return (
                    <div
                      key={u.userId}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 shrink-0 ${getProfileFrameById(u.profileFrameId).cssClass || getProfileFrameById(u.profileFrameId).effectClass}`}>
                          <img
                            src={u.photoUrl?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={u.fullName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{u.fullName}</p>
                          <p className="text-[10px] text-cyan-300 truncate">
                            {u.username ? `@${u.username} • ` : ''}
                            {u.userId}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            👁 {u.profileViews || 0} • ❤️ {u.profileLikes?.length || 0}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {onOpenPublicProfile && (
                          <button
                            type="button"
                            onClick={() => onOpenPublicProfile(u)}
                            className="py-1 px-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-[10px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> प्रोफाइल
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openDmThread(u)}
                          className="py-1 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-[10px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" /> चैट
                        </button>
                        {isFr ? (
                          <span className="py-1 px-2 rounded-lg bg-emerald-600/25 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 text-center">
                            मित्र ✓
                          </span>
                        ) : hasSent ? (
                          <span className="py-1 px-2 rounded-lg bg-amber-600/20 border border-amber-500/40 text-[10px] font-bold text-amber-200 text-center">
                            भेजा गया
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleFriend('send', u.userId)}
                            className="py-1 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UserPlus className="w-3 h-3" /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Conversation Pane */}
        <div
          className={`${
            activeThreadId ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col bg-slate-950/60 min-w-0 min-h-0`}
        >
          {!activeThreadId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-400">
              <MessageSquare className="w-12 h-12 text-cyan-500/60" />
              <p className="text-sm font-black text-white">IOIS CHAT & HELP मैसेंजर</p>
              <p className="text-xs max-w-sm">
                बाएँ पैनल से अपने स्पॉन्सर, मित्र, किसी सदस्य (@username) या ग्रुप को चुनें और टेक्स्ट, फोटो, वीडियो या लिंक साझा करें।
              </p>
            </div>
          ) : (
            <>
              {/* Active Chat Header */}
              <div className="px-3 py-2.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveThreadId('')}
                    className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-200 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  {activeThreadType === 'dm' && activePeerUser ? (
                    <>
                      <div
                        className={`w-9 h-9 shrink-0 ${
                          getProfileFrameById(activePeerUser.profileFrameId).cssClass || getProfileFrameById(activePeerUser.profileFrameId).effectClass
                        }`}
                      >
                        <img
                          src={activePeerUser.photoUrl?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={activePeerUser.fullName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-black text-white truncate">
                          {activePeerUser.fullName}
                        </p>
                        <p className="text-[10px] text-cyan-300 truncate">
                          {activePeerUser.username ? `@${activePeerUser.username} • ` : ''}
                          {activePeerUser.userId}
                        </p>
                      </div>
                    </>
                  ) : (
                    activeGroup && (
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-black text-white truncate">
                          👥 {activeGroup.name}
                        </p>
                        <p className="text-[10px] text-cyan-300 truncate">
                          {activeGroup.memberIds.length} सदस्य: {activeGroup.memberIds.slice(0, 4).join(', ')}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {activeThreadType === 'dm' && activePeerUser && onOpenPublicProfile && (
                  <button
                    type="button"
                    onClick={() => onOpenPublicProfile(activePeerUser)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-bold text-cyan-200 flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">प्रोफाइल देखें</span>
                  </button>
                )}

                {activeThreadType === 'group' && activeGroup && (
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="text"
                      value={addMemberInput}
                      onChange={(e) => setAddMemberInput(e.target.value)}
                      placeholder="@username/ID जोड़ें"
                      className="w-28 sm:w-36 px-2 py-1 rounded-lg bg-slate-800 border border-slate-600 text-[11px] text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddMemberToActiveGroup}
                      className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer"
                    >
                      + जोड़ें
                    </button>
                  </div>
                )}
              </div>

              {statusNotice && (
                <div className="px-3 py-1.5 bg-cyan-950/60 border-b border-cyan-500/30 text-[11px] text-cyan-200 flex justify-between items-center">
                  <span>{statusNotice}</span>
                  <button type="button" onClick={() => setStatusNotice('')} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">
                    अभी कोई संदेश नहीं है। बातचीत शुरू करने के लिए नीचे लिखें!
                  </p>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderId?.toUpperCase() === myId;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        {!isMine && (
                          <span className="text-[10px] font-bold text-cyan-300 mb-0.5 px-1">
                            {m.senderName} {m.senderUsername ? `(@${m.senderUsername})` : ''}
                          </span>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 text-xs sm:text-sm space-y-1.5 ${
                            isMine
                              ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-br-sm'
                              : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm'
                          }`}
                        >
                          {m.mediaType === 'image' && m.mediaUrl && (
                            <img
                              src={m.mediaUrl}
                              alt="Shared media"
                              onClick={() => setLightboxImage(m.mediaUrl || null)}
                              className="max-h-56 w-auto rounded-xl object-cover cursor-pointer border border-white/15"
                            />
                          )}
                          {m.mediaType === 'video' && m.mediaUrl && (
                            <div className="rounded-xl overflow-hidden border border-white/15">
                              {m.mediaUrl.startsWith('data:') || /\.(mp4|webm|ogg)$/i.test(m.mediaUrl) ? (
                                <video src={m.mediaUrl} controls className="max-h-56 w-full bg-black" />
                              ) : (
                                <a
                                  href={m.mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 bg-slate-900/80 flex items-center gap-2 text-xs font-bold text-amber-300 hover:underline"
                                >
                                  <Video className="w-4 h-4 shrink-0" />
                                  <span className="truncate">वीडियो लिंक खोलें</span>
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                </a>
                              )}
                            </div>
                          )}
                          {m.linkUrl && (
                            <a
                              href={m.linkUrl.startsWith('http') ? m.linkUrl : `https://${m.linkUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 rounded-xl bg-slate-900/60 border border-cyan-400/30 text-xs text-cyan-200 hover:bg-slate-900"
                            >
                              <div className="flex items-center gap-1.5 font-bold">
                                <Link2 className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{m.linkTitle || m.linkUrl}</span>
                                <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                              </div>
                            </a>
                          )}
                          {m.text && <p className="whitespace-pre-wrap break-words leading-relaxed">{m.text}</p>}
                          <p className="text-[9px] opacity-70 text-right">
                            {new Date(m.createdAt).toLocaleTimeString('hi-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachment Preview Strip */}
              {attachMediaType && (
                <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 space-y-2 shrink-0">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                    <span>
                      {attachMediaType === 'image'
                        ? '📷 फोटो संलग्न करें'
                        : attachMediaType === 'video'
                        ? '🎬 वीडियो लिंक / क्लिप संलग्न करें'
                        : '🔗 लिंक साझा करें'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachMediaType(null);
                        setAttachMediaUrl('');
                        setAttachLinkTitle('');
                      }}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {attachMediaType === 'image' && attachMediaUrl.startsWith('data:') ? (
                    <img src={attachMediaUrl} alt="Preview" className="h-20 rounded-lg object-cover border border-slate-700" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={attachMediaUrl}
                        onChange={(e) => setAttachMediaUrl(e.target.value)}
                        placeholder={
                          attachMediaType === 'link'
                            ? 'https://... लिंक पेस्ट करें'
                            : 'वीडियो या फोटो URL पेस्ट करें'
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white outline-none"
                      />
                      {attachMediaType === 'link' && (
                        <input
                          type="text"
                          value={attachLinkTitle}
                          onChange={(e) => setAttachLinkTitle(e.target.value)}
                          placeholder="लिंक का शीर्षक (वैकल्पिक)"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white outline-none"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-2.5 border-t border-slate-800 bg-slate-900 flex items-center gap-1.5 shrink-0"
              >
                <label
                  title="फोटो भेजें"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleImageFileSelect} className="hidden" />
                </label>
                <label
                  title="वीडियो भेजें"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer shrink-0"
                >
                  <Video className="w-4 h-4" />
                  <input type="file" accept="video/*" onChange={handleVideoFileSelect} className="hidden" />
                </label>
                <button
                  type="button"
                  title="लिंक शेयर करें"
                  onClick={() => setAttachMediaType(attachMediaType === 'link' ? null : 'link')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 cursor-pointer shrink-0"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="संदेश लिखें..."
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">भेजें</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-[1100] bg-slate-950/85 flex items-center justify-center p-3">
          <form
            onSubmit={handleCreateGroup}
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/40 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">नया IOIS CHAT & HELP ग्रुप बनाएं</h3>
              <button
                type="button"
                onClick={() => setShowCreateGroup(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              required
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="ग्रुप का नाम (उदा. Bihar Team Support)"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs sm:text-sm text-white outline-none"
            />
            <input
              type="text"
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              placeholder="ग्रुप का विवरण (वैकल्पिक)"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs text-white outline-none"
            />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-300">सदस्य चुनें:</p>
              <div className="max-h-40 overflow-y-auto space-y-1 bg-slate-800/60 rounded-xl p-2">
                {otherMembers.map((u) => {
                  const checked = selectedGroupMembers.includes(u.userId);
                  return (
                    <label
                      key={u.userId}
                      className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer p-1 rounded hover:bg-slate-700/50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedGroupMembers((prev) =>
                            checked ? prev.filter((x) => x !== u.userId) : [...prev, u.userId]
                          )
                        }
                      />
                      <span className="truncate font-semibold">{u.fullName}</span>
                      <span className="text-[10px] text-cyan-300 ml-auto">
                        {u.username ? `@${u.username}` : u.userId}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-black text-xs sm:text-sm cursor-pointer"
            >
              ग्रुप बनाएं और चैट शुरू करें
            </button>
          </form>
        </div>
      )}

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[1200] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <img src={lightboxImage} alt="Preview" className="max-h-[90dvh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  );
};
