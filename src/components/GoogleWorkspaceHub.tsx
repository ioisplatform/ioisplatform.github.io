import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserProfile } from '../types';
import {
  CHAT_CONSOLE_CONFIG_URL,
  initWorkspaceAuth,
  signInWithWorkspace,
  signOutWorkspace,
  getWorkspaceAccessToken,
  getWorkspaceUser,
  isWorkspaceChatAuthorized,
  // Gmail
  GmailMessageSummary,
  GmailLabelItem,
  listGmailLabels,
  listGmailMessages,
  getGmailMessageDetail,
  sendGmailMessage,
  // Drive & Picker
  DriveFileItem,
  PickedDriveDocument,
  listDriveFiles,
  createDriveTextFile,
  deleteDriveFile,
  openGooglePicker,
  // Calendar
  CalendarEventItem,
  listCalendarEvents,
  createCalendarEvent,
  // Docs
  GoogleDocDetail,
  getGoogleDoc,
  createGoogleDoc,
  // Slides
  GoogleSlidesDetail,
  getGoogleSlideDeck,
  createGoogleSlideDeck,
  // Tasks
  GoogleTaskListItem,
  GoogleTaskItem,
  listTaskLists,
  listTasks,
  createTask,
  toggleTaskCompletion,
  // Chat
  ChatSpaceItem,
  ChatMessageItem,
  listChatSpaces,
  createChatSpace,
  listChatMessages,
  sendChatMessage,
  // Forms
  GoogleFormDetail,
  GoogleFormResponseItem,
  getGoogleForm,
  createGoogleForm,
  listFormResponses,
  // Keep
  GoogleKeepNoteItem,
  listKeepNotes,
  // Contacts
  GoogleContactItem,
  listContacts,
  createContact,
  // Meet
  GoogleMeetSpaceItem,
  createMeetSpace,
  getMeetSpace,
  // Classroom
  ClassroomCourseItem,
  ClassroomAnnouncementItem,
  ClassroomMaterialItem,
  listClassroomCourses,
  listClassroomAnnouncements,
  listClassroomMaterials,
  createClassroomAnnouncement,
} from '../services/googleWorkspaceService';
import {
  Mail,
  Send,
  HardDrive,
  FolderOpen,
  Calendar,
  FileText,
  Presentation,
  CheckSquare,
  MessageSquare,
  ClipboardList,
  StickyNote,
  Users,
  Video,
  GraduationCap,
  RefreshCw,
  LogOut,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  Copy,
  Check,
  ShieldCheck,
  X,
} from 'lucide-react';

interface GoogleWorkspaceHubProps {
  usersList: UserProfile[];
  onSwitchToSheetsTab?: () => void;
}

type WorkspaceAppTab =
  | 'gmail'
  | 'drive'
  | 'calendar_meet'
  | 'docs_slides'
  | 'forms'
  | 'tasks'
  | 'contacts'
  | 'classroom'
  | 'chat'
  | 'keep';

interface PendingConfirmation {
  title: string;
  description: string;
  actionLabel: string;
  onConfirm: () => Promise<void>;
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = ({
  usersList,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => getWorkspaceAccessToken());
  const [userEmail, setUserEmail] = useState<string>(() => getWorkspaceUser()?.email || '');
  const [chatAuthorized, setChatAuthorized] = useState<boolean>(() => isWorkspaceChatAuthorized());
  const [includeChatOnLogin, setIncludeChatOnLogin] = useState<boolean>(false);
  const [isAuthBusy, setIsAuthBusy] = useState<boolean>(false);
  const [activeApp, setActiveApp] = useState<WorkspaceAppTab>('gmail');
  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [confirmModal, setConfirmModal] = useState<PendingConfirmation | null>(null);
  const [isConfirmBusy, setIsConfirmBusy] = useState<boolean>(false);

  // 1. Gmail States
  const [gmailQuery, setGmailQuery] = useState<string>('');
  const [gmailMessages, setGmailMessages] = useState<GmailMessageSummary[]>([]);
  const [gmailLabels, setGmailLabels] = useState<GmailLabelItem[]>([]);
  const [selectedGmailMsg, setSelectedGmailMsg] = useState<GmailMessageSummary | null>(null);
  const [composeTo, setComposeTo] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeBody, setComposeBody] = useState<string>('');
  const [gmailBusy, setGmailBusy] = useState<boolean>(false);

  // 2. Drive & Picker States
  const [driveSearch, setDriveSearch] = useState<string>('');
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [pickedDoc, setPickedDoc] = useState<PickedDriveDocument | null>(null);
  const [newDriveTitle, setNewDriveTitle] = useState<string>('IOIS_Members_Summary.txt');
  const [driveBusy, setDriveBusy] = useState<boolean>(false);

  // 3. Calendar & Meet States
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([]);
  const [newEventSummary, setNewEventSummary] = useState<string>('IOIS Member Onboarding Meeting');
  const [newEventDate, setNewEventDate] = useState<string>(() =>
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [meetSpaces, setMeetSpaces] = useState<GoogleMeetSpaceItem[]>([]);
  const [lookupMeetCode, setLookupMeetCode] = useState<string>('');
  const [calMeetBusy, setCalMeetBusy] = useState<boolean>(false);

  // 4. Docs & Slides States
  const [newDocTitle, setNewDocTitle] = useState<string>('IOIS Official Circular & Guide');
  const [newDocBody, setNewDocBody] = useState<string>(
    'IOIS Platform (Indian Online Income Supporting System) आधिकारिक सदस्य दिशानिर्देश।'
  );
  const [docIdInput, setDocIdInput] = useState<string>('');
  const [activeDoc, setActiveDoc] = useState<GoogleDocDetail | null>(null);
  const [newSlideTitle, setNewSlideTitle] = useState<string>('IOIS 7 Master Plans Presentation');
  const [slideIdInput, setSlideIdInput] = useState<string>('');
  const [activeSlideDeck, setActiveSlideDeck] = useState<GoogleSlidesDetail | null>(null);
  const [docsSlidesBusy, setDocsSlidesBusy] = useState<boolean>(false);

  // 5. Forms States
  const [newFormTitle, setNewFormTitle] = useState<string>('IOIS Citizen Feedback Form');
  const [formIdInput, setFormIdInput] = useState<string>('');
  const [activeForm, setActiveForm] = useState<GoogleFormDetail | null>(null);
  const [formResponses, setFormResponses] = useState<GoogleFormResponseItem[]>([]);
  const [formsBusy, setFormsBusy] = useState<boolean>(false);

  // 6. Tasks States
  const [taskLists, setTaskLists] = useState<GoogleTaskListItem[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<string>('@default');
  const [tasksList, setTasksList] = useState<GoogleTaskItem[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [tasksBusy, setTasksBusy] = useState<boolean>(false);

  // 7. Contacts States
  const [contacts, setContacts] = useState<GoogleContactItem[]>([]);
  const [selectedUserIdForContact, setSelectedUserIdForContact] = useState<string>('');
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactEmail, setNewContactEmail] = useState<string>('');
  const [contactsBusy, setContactsBusy] = useState<boolean>(false);

  // 8. Classroom States
  const [courses, setCourses] = useState<ClassroomCourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncementItem[]>([]);
  const [materials, setMaterials] = useState<ClassroomMaterialItem[]>([]);
  const [newAnnouncementText, setNewAnnouncementText] = useState<string>('');
  const [classroomBusy, setClassroomBusy] = useState<boolean>(false);

  // 9. Chat States
  const [chatSpaces, setChatSpaces] = useState<ChatSpaceItem[]>([]);
  const [selectedSpaceName, setSelectedSpaceName] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [newSpaceName, setNewSpaceName] = useState<string>('IOIS Leaders Space');
  const [newChatText, setNewChatText] = useState<string>('');
  const [chatErrorIs404, setChatErrorIs404] = useState<boolean>(false);
  const [chatBusy, setChatBusy] = useState<boolean>(false);

  // 10. Keep States (Enterprise Delegated Token Optional)
  const [enterpriseKeepToken, setEnterpriseKeepToken] = useState<string>('');
  const [keepNotes, setKeepNotes] = useState<GoogleKeepNoteItem[]>([]);
  const [keepBusy, setKeepBusy] = useState<boolean>(false);

  const [copiedKey, setCopiedKey] = useState<string>('');

  useEffect(() => {
    const unsub = initWorkspaceAuth(
      (user, token, hasChat) => {
        setAccessToken(token);
        setUserEmail(user.email || '');
        setChatAuthorized(Boolean(hasChat));
      },
      () => {
        setAccessToken(null);
        setUserEmail('');
        setChatAuthorized(false);
      }
    );
    return () => unsub();
  }, []);

  const copyText = async (val: string, key: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    } catch {}
  };

  const handleSignIn = async (withChat?: boolean) => {
    try {
      setIsAuthBusy(true);
      setStatusNotice(null);
      const wantChat = withChat ?? includeChatOnLogin;
      const res = await signInWithWorkspace({ includeChatScopes: wantChat });
      setAccessToken(res.accessToken);
      setUserEmail(res.user.email || '');
      setChatAuthorized(res.chatEnabled);
      setStatusNotice({
        type: 'success',
        text: `Google Workspace सफलतापूर्वक कनेक्ट हुआ (${res.user.email || 'Authorized User'})।`,
      });
    } catch (err: any) {
      setStatusNotice({
        type: 'error',
        text: err?.message || 'Google Sign-In विफल रहा। कृपया पॉपअप अनुमति जांचें।',
      });
    } finally {
      setIsAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOutWorkspace();
    setAccessToken(null);
    setUserEmail('');
    setStatusNotice({ type: 'info', text: 'Google Workspace से सुरक्षित रूप से लॉगआउट हो गया है।' });
  };

  const runWithConfirmation = (cfg: PendingConfirmation) => {
    setConfirmModal(cfg);
  };

  const handleConfirmExecute = async () => {
    if (!confirmModal) return;
    try {
      setIsConfirmBusy(true);
      await confirmModal.onConfirm();
      setConfirmModal(null);
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'कार्रवाई पूर्ण नहीं हो सकी।' });
    } finally {
      setIsConfirmBusy(false);
    }
  };

  // --- GMAIL HANDLERS ---
  const handleLoadGmail = async () => {
    if (!accessToken) return;
    try {
      setGmailBusy(true);
      const [msgs, lbls] = await Promise.all([
        listGmailMessages(accessToken, { q: gmailQuery, maxResults: 10 }),
        listGmailLabels(accessToken).catch(() => []),
      ]);
      setGmailMessages(msgs);
      setGmailLabels(lbls);
      setStatusNotice({ type: 'success', text: `Gmail इनबॉक्स से ${msgs.length} संदेश लोड हुए।` });
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'Gmail पढ़ने में त्रुटि।' });
    } finally {
      setGmailBusy(false);
    }
  };

  const handleReadGmailMessage = async (msgId: string) => {
    if (!accessToken) return;
    try {
      setGmailBusy(true);
      const detail = await getGmailMessageDetail(accessToken, msgId);
      setSelectedGmailMsg(detail);
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'ईमेल विवरण पढ़ने में त्रुटि।' });
    } finally {
      setGmailBusy(false);
    }
  };

  // --- DRIVE & PICKER HANDLERS ---
  const handleLoadDrive = async () => {
    if (!accessToken) return;
    try {
      setDriveBusy(true);
      const files = await listDriveFiles(accessToken, { query: driveSearch, pageSize: 20 });
      setDriveFiles(files);
      setStatusNotice({ type: 'success', text: `Google Drive से ${files.length} फाइलें मिलीं।` });
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'Drive फाइलें लोड करने में त्रुटि।' });
    } finally {
      setDriveBusy(false);
    }
  };

  const handleOpenPicker = async () => {
    if (!accessToken) return;
    try {
      setDriveBusy(true);
      const docPicked = await openGooglePicker(accessToken);
      if (docPicked) {
        setPickedDoc(docPicked);
        setStatusNotice({ type: 'success', text: `Picker से चुनी गई फाइल: ${docPicked.name}` });
      }
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'Google Picker खोलने में त्रुटि।' });
    } finally {
      setDriveBusy(false);
    }
  };

  // --- CALENDAR & MEET HANDLERS ---
  const handleLoadCalendar = async () => {
    if (!accessToken) return;
    try {
      setCalMeetBusy(true);
      const items = await listCalendarEvents(accessToken, 12);
      setCalendarEvents(items);
      setStatusNotice({ type: 'success', text: `${items.length} कैलेंडर इवेंट लोड हुए।` });
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'Google Calendar पढ़ने में त्रुटि।' });
    } finally {
      setCalMeetBusy(false);
    }
  };

  // --- TASKS HANDLERS ---
  const handleLoadTasks = async (listId = selectedTaskListId) => {
    if (!accessToken) return;
    try {
      setTasksBusy(true);
      const [lists, items] = await Promise.all([
        listTaskLists(accessToken),
        listTasks(accessToken, listId),
      ]);
      setTaskLists(lists);
      setTasksList(items);
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'Google Tasks लोड करने में त्रुटि।' });
    } finally {
      setTasksBusy(false);
    }
  };

  // --- CONTACTS HANDLERS ---
  const handleLoadContacts = async () => {
    if (!accessToken) return;
    try {
      setContactsBusy(true);
      const list = await listContacts(accessToken, 25);
      setContacts(list);
      setStatusNotice({ type: 'success', text: `${list.length} Google Contacts लोड हुए।` });
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'Google Contacts पढ़ने में त्रुटि।' });
    } finally {
      setContactsBusy(false);
    }
  };

  // --- CLASSROOM HANDLERS ---
  const handleLoadClassroom = async () => {
    if (!accessToken) return;
    try {
      setClassroomBusy(true);
      const list = await listClassroomCourses(accessToken);
      setCourses(list);
      if (list[0]?.id && !selectedCourseId) {
        setSelectedCourseId(list[0].id);
      }
      setStatusNotice({ type: 'success', text: `${list.length} Classroom कोर्स मिले।` });
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err?.message || 'Classroom लोड करने में त्रुटि।' });
    } finally {
      setClassroomBusy(false);
    }
  };

  const handleLoadCourseDetails = async (courseId: string) => {
    if (!accessToken || !courseId) return;
    try {
      setClassroomBusy(true);
      setSelectedCourseId(courseId);
      const [ann, mat] = await Promise.all([
        listClassroomAnnouncements(accessToken, courseId).catch(() => []),
        listClassroomMaterials(accessToken, courseId).catch(() => []),
      ]);
      setAnnouncements(ann);
      setMaterials(mat);
    } finally {
      setClassroomBusy(false);
    }
  };

  // --- CHAT HANDLERS ---
  const handleLoadChatSpaces = async () => {
    if (!accessToken) return;
    try {
      setChatBusy(true);
      setChatErrorIs404(false);
      const spaces = await listChatSpaces(accessToken);
      setChatSpaces(spaces);
      if (spaces[0]?.name) {
        setSelectedSpaceName(spaces[0].name);
        const msgs = await listChatMessages(accessToken, spaces[0].name).catch(() => []);
        setChatMessages(msgs);
      }
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (err?.status === 404 || err?.status === 403 || msg.includes('404') || msg.includes('Chat')) {
        setChatErrorIs404(true);
      }
      setStatusNotice({ type: 'error', text: msg || 'Google Chat पढ़ने में त्रुटि।' });
    } finally {
      setChatBusy(false);
    }
  };

  const workspaceTabs: Array<{ id: WorkspaceAppTab; label: string; icon: any }> = [
    { id: 'gmail', label: 'Gmail', icon: Mail },
    { id: 'drive', label: 'Drive & Picker', icon: HardDrive },
    { id: 'calendar_meet', label: 'Calendar & Meet', icon: Calendar },
    { id: 'docs_slides', label: 'Docs & Slides', icon: FileText },
    { id: 'forms', label: 'Forms', icon: ClipboardList },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'classroom', label: 'Classroom', icon: GraduationCap },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'keep', label: 'Keep', icon: StickyNote },
  ];

  return (
    <div className="space-y-5">
      {/* Header & Official Google Sign-In Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Google Workspace 13-App Unified Integration Hub</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Gmail, Drive, Picker, Calendar, Meet, Docs, Slides, Forms, Tasks, Contacts, Classroom, Chat & Keep
            </h3>
            <p className="text-xs text-slate-400">
              सुरक्षित OAuth 2.0 (केवल In-Memory Access Token) के माध्यम से अपने IOIS एडमिन खाते को सीधे Google Workspace से जोड़ें।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {accessToken ? (
              <div className="flex items-center gap-2.5 bg-slate-950 px-3.5 py-2 rounded-2xl border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-black text-white">{userEmail || 'Connected Account'}</div>
                  <div className="text-[10px] text-emerald-400">
                    Token Active (In-Memory){chatAuthorized ? ' + Chat' : ''}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="ml-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start sm:items-end gap-2">
                <button
                  type="button"
                  disabled={isAuthBusy}
                  onClick={() => void handleSignIn()}
                  className="gsi-material-button"
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isAuthBusy ? 'Signing in...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeChatOnLogin}
                    onChange={(e) => setIncludeChatOnLogin(e.target.checked)}
                    className="rounded border-slate-700"
                  />
                  <span>Google Chat स्कोप्स भी शामिल करें (Business/Workspace खातों हेतु)</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {statusNotice && (
          <div
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border ${
              statusNotice.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : statusNotice.type === 'error'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'bg-sky-500/15 border-sky-500/40 text-sky-300'
            }`}
          >
            <span>{statusNotice.text}</span>
            <button
              type="button"
              onClick={() => setStatusNotice(null)}
              className="text-current opacity-75 hover:opacity-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Workspace App Sub-Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
          {workspaceTabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveApp(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  activeApp === t.id
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Require Auth Guard Banner if not signed in */}
      {!accessToken && activeApp !== 'keep' && (
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="text-sm font-black text-white">
            पहले ऊपर दिए "Sign in with Google" बटन से अपना Google Workspace खाता कनेक्ट करें
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            सुरक्षा कारणों से OAuth Access Token केवल आपके वर्तमान ब्राउज़र सेशन (In-Memory) में रखा जाता है।
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 1: GMAIL                                                              */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'gmail' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Inbox Viewer */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400" />
                <span>Gmail इनबॉक्स व खोज</span>
              </h4>
              <button
                type="button"
                disabled={gmailBusy}
                onClick={() => void handleLoadGmail()}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${gmailBusy ? 'animate-spin' : ''}`} />
                <span>इनबॉक्स लोड करें</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={gmailQuery}
                onChange={(e) => setGmailQuery(e.target.value)}
                placeholder="Gmail खोजें (उदा. from:support या is:unread)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                disabled={gmailBusy}
                onClick={() => void handleLoadGmail()}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>खोजें</span>
              </button>
            </div>

            {gmailLabels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {gmailLabels.slice(0, 8).map((l) => (
                  <span
                    key={l.id}
                    className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    {l.name}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {gmailMessages.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => void handleReadGmailMessage(m.id)}
                  className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-950/60 border border-slate-800 hover:border-amber-400/50 text-left space-y-1 cursor-pointer transition"
                >
                  <div className="text-xs font-black text-white truncate">{m.subject}</div>
                  <div className="text-[11px] text-amber-300 truncate">{m.from}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{m.snippet}</div>
                </button>
              ))}
              {gmailMessages.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center">
                  ताज़ा ईमेल देखने के लिए ऊपर "इनबॉक्स लोड करें" बटन दबाएं।
                </p>
              )}
            </div>

            {selectedGmailMsg && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-black text-amber-300">{selectedGmailMsg.subject}</div>
                  <button
                    type="button"
                    onClick={() => setSelectedGmailMsg(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-400">From: {selectedGmailMsg.from}</div>
                <pre className="text-[11px] text-slate-200 whitespace-pre-wrap font-sans max-h-40 overflow-y-auto bg-slate-900 p-2.5 rounded-xl">
                  {selectedGmailMsg.bodyText || selectedGmailMsg.snippet}
                </pre>
              </div>
            )}
          </div>

          {/* Compose & Send Email */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>नया ईमेल लिखें व भेजें (Gmail Send)</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  प्राप्तकर्ता ईमेल (To)
                </label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="member@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">विषय (Subject)</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="IOIS सदस्य सत्यापन व महत्वपूर्ण सूचना"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">संदेश (Body)</label>
                <textarea
                  rows={5}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="अपना ईमेल संदेश यहाँ लिखें..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <button
                type="button"
                disabled={!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()}
                onClick={() =>
                  runWithConfirmation({
                    title: 'ईमेल भेजने की पुष्टि करें',
                    description: `क्या आप "${composeTo.trim()}" को विषय "${composeSubject.trim()}" के साथ Gmail से ईमेल भेजना चाहते हैं?`,
                    actionLabel: 'ईमेल भेजें',
                    onConfirm: async () => {
                      const sent = await sendGmailMessage(accessToken, {
                        to: composeTo,
                        subject: composeSubject,
                        body: composeBody,
                      });
                      setComposeTo('');
                      setComposeSubject('');
                      setComposeBody('');
                      setStatusNotice({
                        type: 'success',
                        text: `Gmail से ईमेल सफलतापूर्वक भेजा गया (Message ID: ${sent.id})।`,
                      });
                    },
                  })
                }
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gmail से ईमेल भेजें (पुष्टि के साथ)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 2 & 3: GOOGLE DRIVE + GOOGLE PICKER                                   */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'drive' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>Google Drive व Google Picker ब्राउज़र</span>
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={driveBusy}
                onClick={() => void handleOpenPicker()}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Google Picker खोलें</span>
              </button>
              <button
                type="button"
                disabled={driveBusy}
                onClick={() => void handleLoadDrive()}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${driveBusy ? 'animate-spin' : ''}`} />
                <span>Drive फाइलें लोड करें</span>
              </button>
            </div>
          </div>

          {pickedDoc && (
            <div className="p-3.5 rounded-2xl bg-sky-500/15 border border-sky-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-black text-sky-300">Picker चयनित फाइल: </span>
                <span className="text-white font-bold">{pickedDoc.name}</span>
              </div>
              <a
                href={pickedDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 font-bold flex items-center gap-1 hover:underline"
              >
                <span>खोलें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={driveSearch}
                onChange={(e) => setDriveSearch(e.target.value)}
                placeholder="Drive फाइल नाम से खोजें..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => void handleLoadDrive()}
                className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                खोजें
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDriveTitle}
                onChange={(e) => setNewDriveTitle(e.target.value)}
                placeholder="नई रिपोर्ट फाइल का नाम"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={() =>
                  runWithConfirmation({
                    title: 'Google Drive में सदस्य रिपोर्ट अपलोड करें',
                    description: `क्या आप "${newDriveTitle}" नाम से सभी ${usersList.length} IOIS सदस्यों की बैकअप रिपोर्ट अपने Google Drive में सहेजना चाहते हैं?`,
                    actionLabel: 'Drive में सेव करें',
                    onConfirm: async () => {
                      const summaryText = [
                        `IOIS Members Backup — ${new Date().toISOString()}`,
                        `Total Members: ${usersList.length}`,
                        '',
                        ...usersList.map(
                          (u, i) =>
                            `${i + 1}. ${u.userId} | ${u.fullName} | ${u.mobileNumber} | Plan ${u.selectedPlanId} | ${u.paymentStatus}`
                        ),
                      ].join('\n');
                      const created = await createDriveTextFile(
                        accessToken,
                        newDriveTitle || 'IOIS_Members_Summary.txt',
                        summaryText
                      );
                      setDriveFiles((prev) => [created, ...prev]);
                      setStatusNotice({
                        type: 'success',
                        text: `Google Drive में फाइल अपलोड हो गई: ${created.name}`,
                      });
                    },
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>बैकअप अपलोड</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto">
            {driveFiles.map((f) => (
              <div
                key={f.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{f.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{f.mimeType}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {f.webViewLink && (
                    <a
                      href={f.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300"
                      title="Drive में खोलें"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      runWithConfirmation({
                        title: 'Google Drive फाइल हटाएं?',
                        description: `क्या आप वाकई "${f.name}" को अपने Google Drive से स्थायी रूप से हटाना चाहते हैं?`,
                        actionLabel: 'फाइल हटाएं',
                        onConfirm: async () => {
                          await deleteDriveFile(accessToken, f.id);
                          setDriveFiles((prev) => prev.filter((item) => item.id !== f.id));
                          setStatusNotice({ type: 'success', text: `फाइल हटाई गई: ${f.name}` });
                        },
                      })
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 4 & 11: GOOGLE CALENDAR & GOOGLE MEET                                 */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'calendar_meet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Calendar */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Google Calendar इवेंट्स</span>
              </h4>
              <button
                type="button"
                disabled={calMeetBusy}
                onClick={() => void handleLoadCalendar()}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                इवेंट्स लोड करें
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newEventSummary}
                onChange={(e) => setNewEventSummary(e.target.value)}
                placeholder="मीटिंग या इवेंट का नाम"
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <input
                type="datetime-local"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                runWithConfirmation({
                  title: 'नया कैलेंडर इवेंट जोड़ें',
                  description: `क्या आप अपने Primary Google Calendar में "${newEventSummary}" जोड़ना चाहते हैं?`,
                  actionLabel: 'इवेंट जोड़ें',
                  onConfirm: async () => {
                    const startMs = new Date(newEventDate).getTime() || Date.now() + 3600000;
                    const created = await createCalendarEvent(accessToken, {
                      summary: newEventSummary,
                      description: 'Created via IOIS Admin Workspace Hub',
                      startIso: new Date(startMs).toISOString(),
                      endIso: new Date(startMs + 60 * 60 * 1000).toISOString(),
                    });
                    setCalendarEvents((prev) => [created, ...prev]);
                    setStatusNotice({ type: 'success', text: `कैलेंडर इवेंट जोड़ा गया: ${created.summary}` });
                  },
                })
              }
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer"
            >
              + Google Calendar इवेंट बनाएं
            </button>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {calendarEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{ev.summary}</div>
                    <div className="text-[11px] text-slate-400">
                      {ev.start?.dateTime || ev.start?.date || ''}
                    </div>
                  </div>
                  {ev.htmlLink && (
                    <a
                      href={ev.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:underline font-bold shrink-0"
                    >
                      खोलें →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Google Meet */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Google Meet त्वरित वीडियो मीटिंग लिंक</span>
            </h4>

            <button
              type="button"
              onClick={() =>
                runWithConfirmation({
                  title: 'नया Google Meet लिंक बनाएं',
                  description: 'क्या आप एक नया लाइव Google Meet रूम (Space) बनाना चाहते हैं?',
                  actionLabel: 'Meet लिंक बनाएं',
                  onConfirm: async () => {
                    const space = await createMeetSpace(accessToken);
                    setMeetSpaces((prev) => [space, ...prev]);
                    setStatusNotice({
                      type: 'success',
                      text: `नया Google Meet तैयार: ${space.meetingUri}`,
                    });
                  },
                })
              }
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>तुरंत नया Google Meet रूम बनाएं</span>
            </button>

            <div className="flex gap-2">
              <input
                type="text"
                value={lookupMeetCode}
                onChange={(e) => setLookupMeetCode(e.target.value)}
                placeholder="मौजूदा Meet Space या कोड जांचें (उदा. abc-defg-hij)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!lookupMeetCode.trim()) return;
                  try {
                    const found = await getMeetSpace(accessToken, lookupMeetCode);
                    setMeetSpaces((prev) => [found, ...prev]);
                  } catch (err: any) {
                    setStatusNotice({ type: 'error', text: err?.message || 'Meet स्पेस नहीं मिला।' });
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                जांचें
              </button>
            </div>

            <div className="space-y-2">
              {meetSpaces.map((sp, i) => (
                <div
                  key={`${sp.name}-${i}`}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-mono font-black text-emerald-300 truncate">{sp.meetingUri}</div>
                    <div className="text-[11px] text-slate-400">Code: {sp.meetingCode}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => void copyText(sp.meetingUri, sp.name)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-200 cursor-pointer"
                    >
                      {copiedKey === sp.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={sp.meetingUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold"
                    >
                      Join
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 5 & 6: GOOGLE DOCS & GOOGLE SLIDES                                    */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'docs_slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Google Docs */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Google Docs (दस्तावेज़ निर्माण व पठन)</span>
            </h4>
            <input
              type="text"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="दस्तावेज़ का शीर्षक"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <textarea
              rows={3}
              value={newDocBody}
              onChange={(e) => setNewDocBody(e.target.value)}
              placeholder="दस्तावेज़ की प्रारंभिक सामग्री"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <button
              type="button"
              disabled={docsSlidesBusy}
              onClick={() =>
                runWithConfirmation({
                  title: 'नया Google Doc बनाएं',
                  description: `क्या आप "${newDocTitle}" शीर्षक से नया Google Doc बनाना चाहते हैं?`,
                  actionLabel: 'Google Doc बनाएं',
                  onConfirm: async () => {
                    const doc = await createGoogleDoc(accessToken, newDocTitle, newDocBody);
                    setActiveDoc(doc);
                    setDocIdInput(doc.documentId);
                    setStatusNotice({ type: 'success', text: `Google Doc तैयार: ${doc.title}` });
                  },
                })
              }
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black cursor-pointer"
            >
              + नया Google Doc बनाएं
            </button>

            <div className="flex gap-2">
              <input
                type="text"
                value={docIdInput}
                onChange={(e) => setDocIdInput(e.target.value)}
                placeholder="पढ़ने हेतु Google Doc ID दर्ज करें"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!docIdInput.trim()) return;
                  try {
                    setDocsSlidesBusy(true);
                    const detail = await getGoogleDoc(accessToken, docIdInput);
                    setActiveDoc(detail);
                  } catch (err: any) {
                    setStatusNotice({ type: 'error', text: err?.message || 'Doc लोड विफल।' });
                  } finally {
                    setDocsSlidesBusy(false);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                पढ़ें
              </button>
            </div>

            {activeDoc && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-white">{activeDoc.title}</span>
                  <a
                    href={activeDoc.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 font-bold hover:underline"
                  >
                    Docs में खोलें →
                  </a>
                </div>
                <p className="text-[11px] text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {activeDoc.plainText || '(Empty Document)'}
                </p>
              </div>
            )}
          </div>

          {/* Google Slides */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>Google Slides (प्रेजेंटेशन डेक)</span>
            </h4>
            <input
              type="text"
              value={newSlideTitle}
              onChange={(e) => setNewSlideTitle(e.target.value)}
              placeholder="प्रेजेंटेशन का शीर्षक"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <button
              type="button"
              onClick={() =>
                runWithConfirmation({
                  title: 'नया Google Slides डेक बनाएं',
                  description: `क्या आप "${newSlideTitle}" शीर्षक से नया प्रेजेंटेशन डेक बनाना चाहते हैं?`,
                  actionLabel: 'Slides डेक बनाएं',
                  onConfirm: async () => {
                    const deck = await createGoogleSlideDeck(
                      accessToken,
                      newSlideTitle,
                      'IOIS Digital Empowerment Presentation'
                    );
                    setActiveSlideDeck(deck);
                    setSlideIdInput(deck.presentationId);
                    setStatusNotice({ type: 'success', text: `Slides डेक तैयार: ${deck.title}` });
                  },
                })
              }
              className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer"
            >
              + नया Google Slides डेक बनाएं
            </button>

            <div className="flex gap-2">
              <input
                type="text"
                value={slideIdInput}
                onChange={(e) => setSlideIdInput(e.target.value)}
                placeholder="Presentation ID दर्ज करें"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!slideIdInput.trim()) return;
                  try {
                    const deck = await getGoogleSlideDeck(accessToken, slideIdInput);
                    setActiveSlideDeck(deck);
                  } catch (err: any) {
                    setStatusNotice({ type: 'error', text: err?.message || 'Slides लोड विफल।' });
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                देखें
              </button>
            </div>

            {activeSlideDeck && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-white">
                    {activeSlideDeck.title} ({activeSlideDeck.slideCount} Slides)
                  </span>
                  <a
                    href={activeSlideDeck.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 font-bold hover:underline"
                  >
                    Slides में खोलें →
                  </a>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {activeSlideDeck.slidePreviews.map((sp, i) => (
                    <li key={i}>{sp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 7: GOOGLE FORMS                                                       */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'forms' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-400" />
            <span>Google Forms निर्माण व रिस्पॉन्स रीडर</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFormTitle}
                onChange={(e) => setNewFormTitle(e.target.value)}
                placeholder="नए Google Form का नाम"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={() =>
                  runWithConfirmation({
                    title: 'नया Google Form बनाएं',
                    description: `क्या आप "${newFormTitle}" शीर्षक से नया Google Form बनाना चाहते हैं?`,
                    actionLabel: 'Form बनाएं',
                    onConfirm: async () => {
                      const f = await createGoogleForm(accessToken, newFormTitle);
                      setActiveForm(f);
                      setFormIdInput(f.formId);
                      setStatusNotice({ type: 'success', text: `Google Form तैयार (ID: ${f.formId})` });
                    },
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black cursor-pointer shrink-0"
              >
                + Form बनाएं
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={formIdInput}
                onChange={(e) => setFormIdInput(e.target.value)}
                placeholder="Form ID दर्ज करें"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                disabled={formsBusy}
                onClick={async () => {
                  if (!formIdInput.trim()) return;
                  try {
                    setFormsBusy(true);
                    const [detail, resps] = await Promise.all([
                      getGoogleForm(accessToken, formIdInput),
                      listFormResponses(accessToken, formIdInput).catch(() => []),
                    ]);
                    setActiveForm(detail);
                    setFormResponses(resps);
                  } catch (err: any) {
                    setStatusNotice({ type: 'error', text: err?.message || 'Form पढ़ने में त्रुटि।' });
                  } finally {
                    setFormsBusy(false);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer shrink-0"
              >
                लोड करें
              </button>
            </div>
          </div>

          {activeForm && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="font-black text-white">
                  {activeForm.title} ({activeForm.itemCount} सवाल)
                </div>
                {activeForm.responderUri && (
                  <a
                    href={activeForm.responderUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 font-bold hover:underline"
                  >
                    Form खोलें →
                  </a>
                )}
              </div>
              {formResponses.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="font-bold text-purple-300">प्राप्त उत्तर ({formResponses.length}):</div>
                  {formResponses.map((r) => (
                    <div key={r.responseId} className="p-2 rounded-xl bg-slate-900 text-[11px] text-slate-200">
                      {r.respondentEmail ? `${r.respondentEmail}: ` : ''}{r.summaryText}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 8: GOOGLE TASKS                                                       */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'tasks' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-sky-400" />
              <span>Google Tasks एडमिन चेकलिस्ट</span>
            </h4>
            <div className="flex items-center gap-2">
              {taskLists.length > 0 && (
                <select
                  value={selectedTaskListId}
                  onChange={(e) => {
                    setSelectedTaskListId(e.target.value);
                    void handleLoadTasks(e.target.value);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {taskLists.map((tl) => (
                    <option key={tl.id} value={tl.id}>
                      {tl.title}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                disabled={tasksBusy}
                onClick={() => void handleLoadTasks()}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Tasks लोड करें
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="नया कार्य लिखें (उदा. 10 पेंडिंग पेआउट वेरिफाई करें)"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <button
              type="button"
              disabled={!newTaskTitle.trim()}
              onClick={() =>
                runWithConfirmation({
                  title: 'नया Google Task जोड़ें',
                  description: `क्या आप कार्य "${newTaskTitle.trim()}" को Google Tasks में जोड़ना चाहते हैं?`,
                  actionLabel: 'कार्य जोड़ें',
                  onConfirm: async () => {
                    const created = await createTask(accessToken, selectedTaskListId, {
                      title: newTaskTitle.trim(),
                    });
                    setTasksList((prev) => [created, ...prev]);
                    setNewTaskTitle('');
                    setStatusNotice({ type: 'success', text: `कार्य जोड़ा गया: ${created.title}` });
                  },
                })
              }
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer"
            >
              + जोड़ें
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {tasksList.map((task) => {
              const done = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <span className={done ? 'line-through text-slate-500' : 'text-white font-semibold'}>
                    {task.title}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      runWithConfirmation({
                        title: 'कार्य स्थिति बदलें',
                        description: `क्या आप "${task.title}" को ${done ? 'अपूर्ण' : 'पूर्ण'} चिह्नित करना चाहते हैं?`,
                        actionLabel: 'अपडेट करें',
                        onConfirm: async () => {
                          const updated = await toggleTaskCompletion(
                            accessToken,
                            selectedTaskListId,
                            task.id,
                            !done
                          );
                          setTasksList((prev) =>
                            prev.map((it) => (it.id === updated.id ? updated : it))
                          );
                        },
                      })
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      done ? 'bg-slate-800 text-slate-300' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {done ? 'पूर्ण ✓' : 'पूर्ण करें'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 9: GOOGLE CONTACTS (PEOPLE API)                                       */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'contacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Google Contacts सूची</span>
              </h4>
              <button
                type="button"
                disabled={contactsBusy}
                onClick={() => void handleLoadContacts()}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Contacts लोड करें
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {contacts.map((c) => (
                <div
                  key={c.resourceName}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-white">{c.displayName}</div>
                    <div className="text-[11px] text-slate-400">
                      {[c.phoneNumber, c.email].filter(Boolean).join(' · ') || 'No phone/email'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-white">सदस्य को Google Contacts में सेव करें</h4>
            <select
              value={selectedUserIdForContact}
              onChange={(e) => {
                const uid = e.target.value;
                setSelectedUserIdForContact(uid);
                const found = usersList.find((u) => u.userId === uid);
                if (found) {
                  setNewContactName(`${found.fullName} (${found.userId})`);
                  setNewContactPhone(found.mobileNumber || '');
                  setNewContactEmail(found.email || '');
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="">-- किसी IOIS सदस्य को चुनें (वैकल्पिक) --</option>
              {usersList.slice(0, 60).map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.fullName} ({u.userId}) — {u.mobileNumber}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              placeholder="पूरा नाम"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder="मोबाइल नंबर"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <input
                type="email"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                placeholder="ईमेल पता"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              type="button"
              disabled={!newContactName.trim()}
              onClick={() =>
                runWithConfirmation({
                  title: 'Google Contact में सहेजें',
                  description: `क्या आप "${newContactName.trim()}" को अपने Google Contacts में जोड़ना चाहते हैं?`,
                  actionLabel: 'Contact जोड़ें',
                  onConfirm: async () => {
                    const saved = await createContact(accessToken, {
                      fullName: newContactName,
                      phoneNumber: newContactPhone,
                      email: newContactEmail,
                      organization: 'IOIS Platform Member',
                    });
                    setContacts((prev) => [saved, ...prev]);
                    setNewContactName('');
                    setNewContactPhone('');
                    setNewContactEmail('');
                    setStatusNotice({ type: 'success', text: `Contact सहेजा गया: ${saved.displayName}` });
                  },
                })
              }
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black cursor-pointer"
            >
              + Google Contacts में जोड़ें
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 10: GOOGLE CLASSROOM                                                  */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'classroom' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Google Classroom कोर्स व घोषणाएं</span>
            </h4>
            <button
              type="button"
              disabled={classroomBusy}
              onClick={() => void handleLoadClassroom()}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
            >
              कोर्स लोड करें
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300">कोर्स सूची ({courses.length})</div>
              {courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => void handleLoadCourseDetails(c.id)}
                  className={`w-full p-3 rounded-2xl border text-left text-xs cursor-pointer ${
                    selectedCourseId === c.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold">{c.name}</div>
                  {c.section && <div className="text-[10px] text-slate-400">{c.section}</div>}
                </button>
              ))}
            </div>

            <div className="md:col-span-2 space-y-3">
              {selectedCourseId && (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAnnouncementText}
                      onChange={(e) => setNewAnnouncementText(e.target.value)}
                      placeholder="कक्षा में नई घोषणा (Announcement) लिखें..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <button
                      type="button"
                      disabled={!newAnnouncementText.trim()}
                      onClick={() =>
                        runWithConfirmation({
                          title: 'Classroom घोषणा प्रकाशित करें',
                          description: `क्या आप चयनित Classroom कोर्स में यह घोषणा पोस्ट करना चाहते हैं?`,
                          actionLabel: 'पोस्ट करें',
                          onConfirm: async () => {
                            const ann = await createClassroomAnnouncement(
                              accessToken,
                              selectedCourseId,
                              newAnnouncementText
                            );
                            setAnnouncements((prev) => [ann, ...prev]);
                            setNewAnnouncementText('');
                            setStatusNotice({ type: 'success', text: 'Classroom घोषणा प्रकाशित हो गई।' });
                          },
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer"
                    >
                      पोस्ट करें
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {announcements.map((a) => (
                      <div key={a.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                        {a.text}
                      </div>
                    ))}
                    {materials.map((m) => (
                      <div key={m.id} className="p-3 rounded-2xl bg-slate-950 border border-sky-500/30 text-xs text-sky-200">
                        Material: {m.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 12: GOOGLE CHAT (BUSINESS/WORKSPACE + CONSOLE LINK ON 404/403)        */}
      {/* ========================================================================= */}
      {accessToken && activeApp === 'chat' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Google Chat स्पेस व संदेश (Business/Enterprise Workspace)</span>
            </h4>
            <div className="flex items-center gap-2">
              {!chatAuthorized && (
                <button
                  type="button"
                  onClick={() => void handleSignIn(true)}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer"
                >
                  Chat स्कोप्स के साथ पुनः साइन-इन
                </button>
              )}
              <button
                type="button"
                disabled={chatBusy}
                onClick={() => void handleLoadChatSpaces()}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Spaces लोड करें
              </button>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
              chatErrorIs404
                ? 'bg-rose-500/15 border-rose-500/50 text-rose-200'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            }`}
          >
            <div className="font-bold">Google Chat आवश्यकता (Google Workspace Prerequisite):</div>
            <p className="text-[11px] text-slate-300">
              Google Chat API के लिए Business/Enterprise Workspace खाता व Cloud Console में Chat App कॉन्फ़िगरेशन आवश्यक है (व्यक्तिगत @gmail.com खातों पर 403/404 मिल सकता है)।
            </p>
            <a
              href={CHAT_CONSOLE_CONFIG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-300 font-bold hover:underline"
            >
              <span>Google Cloud Console Chat App सेटअप खोलें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              placeholder="नए Google Chat Space का नाम"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <button
              type="button"
              onClick={() =>
                runWithConfirmation({
                  title: 'नया Google Chat Space बनाएं',
                  description: `क्या आप "${newSpaceName}" नाम से नया Google Chat Space बनाना चाहते हैं?`,
                  actionLabel: 'Space बनाएं',
                  onConfirm: async () => {
                    const sp = await createChatSpace(accessToken, newSpaceName);
                    setChatSpaces((prev) => [sp, ...prev]);
                    setSelectedSpaceName(sp.name);
                  },
                })
              }
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer"
            >
              + Space बनाएं
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              {chatSpaces.map((sp) => (
                <button
                  key={sp.name}
                  type="button"
                  onClick={async () => {
                    setSelectedSpaceName(sp.name);
                    const msgs = await listChatMessages(accessToken, sp.name).catch(() => []);
                    setChatMessages(msgs);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs cursor-pointer ${
                    selectedSpaceName === sp.name
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  {sp.displayName || sp.name}
                </button>
              ))}
            </div>
            <div className="md:col-span-2 space-y-2">
              {selectedSpaceName && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    placeholder="Space में संदेश लिखें..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      runWithConfirmation({
                        title: 'Google Chat में संदेश भेजें',
                        description: `क्या आप इस Space में "${newChatText}" संदेश भेजना चाहते हैं?`,
                        actionLabel: 'संदेश भेजें',
                        onConfirm: async () => {
                          const sent = await sendChatMessage(accessToken, selectedSpaceName, newChatText);
                          setChatMessages((prev) => [...prev, sent]);
                          setNewChatText('');
                        },
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer"
                  >
                    भेजें
                  </button>
                </div>
              )}
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {chatMessages.map((m) => (
                  <div key={m.name} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                    {m.text || '(Attachment)'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP 13: GOOGLE KEEP (ENTERPRISE DOMAIN-WIDE DELEGATION NOTICE)            */}
      {/* ========================================================================= */}
      {activeApp === 'keep' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/35 space-y-4">
          <div className="flex items-start gap-3">
            <StickyNote className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">
                Google Keep (Enterprise Workspace Only)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Google Keep API केवल एंटरप्राइज Google Workspace संगठनों के लिए Service Account Domain-Wide Delegation द्वारा समर्थित है। सामान्य @gmail.com या स्टैंडर्ड OAuth पॉपअप में Google Keep स्कोप अस्वीकृत होते हैं।
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={enterpriseKeepToken}
              onChange={(e) => setEnterpriseKeepToken(e.target.value)}
              placeholder="(वैकल्पिक) Enterprise Delegated Bearer Token (केवल In-Memory)"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <button
              type="button"
              disabled={keepBusy || (!enterpriseKeepToken.trim() && !accessToken)}
              onClick={async () => {
                try {
                  setKeepBusy(true);
                  const tok = enterpriseKeepToken.trim() || accessToken || '';
                  const notes = await listKeepNotes(tok);
                  setKeepNotes(notes);
                  setStatusNotice({ type: 'success', text: `${notes.length} Keep नोट्स प्राप्त हुए।` });
                } catch (err: any) {
                  setStatusNotice({
                    type: 'error',
                    text:
                      err?.message ||
                      'Keep नोट्स पढ़ने हेतु Enterprise Workspace Domain-Wide Delegation टोकन आवश्यक है।',
                  });
                } finally {
                  setKeepBusy(false);
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
            >
              Keep नोट्स जांचें
            </button>
          </div>

          {keepNotes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keepNotes.map((n) => (
                <div key={n.name} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-amber-300">{n.title}</div>
                  <div className="text-[11px] text-slate-300 whitespace-pre-wrap">{n.bodyText}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPLICIT CONFIRMATION MODAL BEFORE ANY MUTATING / SEND API ACTION         */}
      {/* ========================================================================= */}
      {confirmModal &&
        createPortal(
          <div className="fixed inset-0 z-[140] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-slate-950 border-2 border-amber-400/60 shadow-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-base font-black text-white">{confirmModal.title}</h4>
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{confirmModal.description}</p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isConfirmBusy}
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  disabled={isConfirmBusy}
                  onClick={() => void handleConfirmExecute()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer"
                >
                  {isConfirmBusy ? 'प्रक्रिया जारी...' : `हाँ, ${confirmModal.actionLabel}`}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
