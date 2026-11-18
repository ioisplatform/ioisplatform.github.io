import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export const CORE_WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/presentations',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/meetings.space.created',
  'https://www.googleapis.com/auth/meetings.space.readonly',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.courseworkmaterials',
  'https://www.googleapis.com/auth/classroom.announcements',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
  'https://www.googleapis.com/auth/gmail.addons.current.message.action',
  'https://www.googleapis.com/auth/gmail.addons.current.message.metadata',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.insert',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.metadata',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
] as const;

export const ENTERPRISE_CHAT_SCOPES = [
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.spaces.create',
  'https://www.googleapis.com/auth/chat.messages',
] as const;

export const ALL_WORKSPACE_SCOPES = [
  ...CORE_WORKSPACE_SCOPES,
  ...ENTERPRISE_CHAT_SCOPES,
] as const;

export const CHAT_CONSOLE_CONFIG_URL =
  'https://console.cloud.google.com/apis/api/chat.googleapis.com/hangouts-chat?project=iois-platform';

// Strict In-Memory OAuth Access Token Cache (NEVER persisted to localStorage or sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedWorkspaceUser: User | null = null;
let cachedChatEnabled = false;
const authListeners = new Set<(user: User | null, token: string | null, chatEnabled: boolean) => void>();
let rootUnsubscribe: (() => void) | null = null;

function notifyAuthListeners() {
  for (const listener of authListeners) {
    try {
      listener(cachedWorkspaceUser, cachedAccessToken, cachedChatEnabled);
    } catch {
      // ignore listener errors
    }
  }
}

function ensureRootAuthListener() {
  if (rootUnsubscribe || typeof window === 'undefined') return;
  rootUnsubscribe = onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      cachedWorkspaceUser = user;
      if (!cachedAccessToken && !isSigningIn) {
        cachedAccessToken = null;
      }
    } else {
      cachedWorkspaceUser = null;
      cachedAccessToken = null;
      cachedChatEnabled = false;
    }
    notifyAuthListeners();
  });
}

export const initWorkspaceAuth = (
  onAuthSuccess?: (user: User, token: string, chatEnabled?: boolean) => void,
  onAuthFailure?: () => void
): (() => void) => {
  ensureRootAuthListener();

  const handler = (user: User | null, token: string | null, chatEnabled: boolean) => {
    if (user && token) {
      onAuthSuccess?.(user, token, chatEnabled);
    } else if (!isSigningIn) {
      onAuthFailure?.();
    }
  };

  authListeners.add(handler);
  if (cachedWorkspaceUser && cachedAccessToken) {
    onAuthSuccess?.(cachedWorkspaceUser, cachedAccessToken, cachedChatEnabled);
  } else if (!isSigningIn) {
    onAuthFailure?.();
  }

  return () => {
    authListeners.delete(handler);
  };
};

function buildGoogleProvider(includeChatScopes: boolean): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  CORE_WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));
  if (includeChatScopes) {
    ENTERPRISE_CHAT_SCOPES.forEach((scope) => provider.addScope(scope));
  }
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

export const signInWithWorkspace = async (options?: {
  includeChatScopes?: boolean;
}): Promise<{ user: User; accessToken: string; chatEnabled: boolean }> => {
  ensureRootAuthListener();
  const wantChat = Boolean(options?.includeChatScopes);
  try {
    isSigningIn = true;
    const provider = buildGoogleProvider(wantChat);
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google Workspace के लिए Access Token प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।');
    }
    cachedAccessToken = credential.accessToken;
    cachedWorkspaceUser = result.user;
    cachedChatEnabled = wantChat;
    notifyAuthListeners();
    return {
      user: result.user,
      accessToken: cachedAccessToken,
      chatEnabled: cachedChatEnabled,
    };
  } finally {
    isSigningIn = false;
  }
};

export const signOutWorkspace = async (): Promise<void> => {
  cachedAccessToken = null;
  cachedWorkspaceUser = null;
  cachedChatEnabled = false;
  try {
    await auth.signOut();
  } catch {
    // ignore
  }
  notifyAuthListeners();
};

export const getWorkspaceAccessToken = (): string | null => cachedAccessToken;
export const getWorkspaceUser = (): User | null => cachedWorkspaceUser;
export const isWorkspaceChatAuthorized = (): boolean => cachedChatEnabled;

export const clearWorkspaceAccessToken = (): void => {
  cachedAccessToken = null;
  notifyAuthListeners();
};

async function googleApiFetch<T = any>(
  url: string,
  accessToken: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers || {});
  headers.set('Authorization', `Bearer ${accessToken}`);
  if (init?.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...init, headers });
  if (res.status === 401) {
    clearWorkspaceAccessToken();
    throw new Error('Google सत्र समाप्त हो गया है। कृपया पुनः "Sign in with Google" करें।');
  }

  const text = await res.text().catch(() => '');
  let parsed: any = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    const apiMessage =
      parsed?.error?.message ||
      (typeof parsed === 'string' ? parsed.slice(0, 240) : JSON.stringify(parsed).slice(0, 240));
    const err = new Error(`Google API Error (${res.status}): ${apiMessage || res.statusText}`) as Error & {
      status?: number;
      apiCode?: string;
    };
    err.status = res.status;
    err.apiCode = parsed?.error?.status;
    throw err;
  }

  return parsed as T;
}

// =========================================================================
// 1. GOOGLE DRIVE + 2. GOOGLE PICKER
// =========================================================================
export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
}

export const listDriveFiles = async (
  accessToken: string,
  options?: { query?: string; mimeType?: string; pageSize?: number }
): Promise<DriveFileItem[]> => {
  const filters: string[] = ['trashed = false'];
  if (options?.mimeType) {
    filters.push(`mimeType = '${options.mimeType.replace(/'/g, "\\'")}'`);
  }
  if (options?.query && options.query.trim()) {
    const safeQ = options.query.trim().replace(/'/g, "\\'");
    filters.push(`name contains '${safeQ}'`);
  }
  const params = new URLSearchParams({
    pageSize: String(options?.pageSize || 20),
    orderBy: 'modifiedTime desc',
    q: filters.join(' and '),
    fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink,iconLink)',
  });
  const data = await googleApiFetch<{ files?: DriveFileItem[] }>(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    accessToken
  );
  return Array.isArray(data.files) ? data.files : [];
};

export const createDriveTextFile = async (
  accessToken: string,
  fileName: string,
  content: string,
  mimeType = 'text/plain'
): Promise<DriveFileItem> => {
  const metadata = { name: fileName, mimeType };
  const boundary = 'iois_workspace_boundary_' + Date.now();
  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;

  return googleApiFetch<DriveFileItem>(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,webViewLink',
    accessToken,
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );
};

export const deleteDriveFile = async (accessToken: string, fileId: string): Promise<void> => {
  await googleApiFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId.trim())}`,
    accessToken,
    { method: 'DELETE' }
  );
};

let pickerLoaderPromise: Promise<void> | null = null;

export const loadGooglePickerApi = (): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Picker केवल ब्राउज़र में उपलब्ध है।'));
  }
  const win = window as any;
  if (win.google?.picker?.PickerBuilder) {
    return Promise.resolve();
  }
  if (pickerLoaderPromise) return pickerLoaderPromise;

  pickerLoaderPromise = new Promise<void>((resolve, reject) => {
    const loadPickerModule = () => {
      if (!win.gapi?.load) {
        reject(new Error('Google API Loader (gapi) उपलब्ध नहीं हो सका।'));
        return;
      }
      win.gapi.load('picker', {
        callback: () => resolve(),
        onerror: () => reject(new Error('Google Picker मॉड्यूल लोड नहीं हो सका।')),
      });
    };

    const existing = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
    if (existing) {
      if (win.gapi) {
        loadPickerModule();
      } else {
        existing.addEventListener('load', loadPickerModule, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = loadPickerModule;
    script.onerror = () => {
      pickerLoaderPromise = null;
      reject(new Error('https://apis.google.com/js/api.js लोड करने में त्रुटि आई।'));
    };
    document.head.appendChild(script);
  });

  return pickerLoaderPromise;
};

export interface PickedDriveDocument {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

export const openGooglePicker = async (
  accessToken: string
): Promise<PickedDriveDocument | null> => {
  await loadGooglePickerApi();
  const win = window as any;
  const gpicker = win.google?.picker;
  if (!gpicker?.PickerBuilder) {
    throw new Error('Google Picker विजेट तैयार नहीं है। कृपया पुनः प्रयास करें।');
  }

  // Exact ancestorOrigins origin pattern required for iframe & AI Studio previews (NO developerKey!)
  const pickerOrigin =
    window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
      ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
      : window.location.origin;

  return new Promise<PickedDriveDocument | null>((resolve) => {
    const picker = new gpicker.PickerBuilder()
      .addView(gpicker.ViewId.DOCS)
      .addView(gpicker.ViewId.SPREADSHEETS)
      .addView(gpicker.ViewId.PRESENTATIONS)
      .setOAuthToken(accessToken)
      .setOrigin(pickerOrigin)
      .setCallback((data: any) => {
        if (data?.action === gpicker.Action.PICKED && Array.isArray(data.docs) && data.docs[0]) {
          const docItem = data.docs[0];
          resolve({
            id: String(docItem.id || ''),
            name: String(docItem.name || 'Selected File'),
            mimeType: String(docItem.mimeType || ''),
            url: String(docItem.url || `https://drive.google.com/file/d/${docItem.id}/view`),
          });
        } else if (data?.action === gpicker.Action.CANCEL) {
          resolve(null);
        }
      })
      .build();

    picker.setVisible(true);
  });
};

// =========================================================================
// 3. GOOGLE CALENDAR
// =========================================================================
export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  hangoutLink?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

export const listCalendarEvents = async (
  accessToken: string,
  maxResults = 15
): Promise<CalendarEventItem[]> => {
  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    timeMin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    maxResults: String(maxResults),
  });
  const data = await googleApiFetch<{ items?: CalendarEventItem[] }>(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    accessToken
  );
  return Array.isArray(data.items) ? data.items : [];
};

export const createCalendarEvent = async (
  accessToken: string,
  payload: {
    summary: string;
    description?: string;
    location?: string;
    startIso: string;
    endIso: string;
  }
): Promise<CalendarEventItem> => {
  return googleApiFetch<CalendarEventItem>(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        summary: payload.summary,
        description: payload.description || '',
        location: payload.location || '',
        start: { dateTime: new Date(payload.startIso).toISOString() },
        end: { dateTime: new Date(payload.endIso).toISOString() },
      }),
    }
  );
};

// =========================================================================
// 4. GOOGLE DOCS
// =========================================================================
export interface GoogleDocDetail {
  documentId: string;
  title: string;
  plainText: string;
  webViewLink: string;
}

function extractGoogleDocPlainText(docJson: any): string {
  const content = docJson?.body?.content;
  if (!Array.isArray(content)) return '';
  const parts: string[] = [];
  for (const el of content) {
    const elements = el?.paragraph?.elements;
    if (Array.isArray(elements)) {
      const line = elements
        .map((p: any) => p?.textRun?.content || '')
        .join('');
      if (line) parts.push(line);
    }
  }
  return parts.join('').trim();
}

export const getGoogleDoc = async (
  accessToken: string,
  documentId: string
): Promise<GoogleDocDetail> => {
  const cleanId = encodeURIComponent(documentId.trim());
  const data = await googleApiFetch<any>(
    `https://docs.googleapis.com/v1/documents/${cleanId}`,
    accessToken
  );
  const id = String(data.documentId || documentId.trim());
  return {
    documentId: id,
    title: String(data.title || 'Untitled Document'),
    plainText: extractGoogleDocPlainText(data),
    webViewLink: `https://docs.google.com/document/d/${id}/edit`,
  };
};

export const createGoogleDoc = async (
  accessToken: string,
  title: string,
  initialBodyText?: string
): Promise<GoogleDocDetail> => {
  const created = await googleApiFetch<any>(
    'https://docs.googleapis.com/v1/documents',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ title }),
    }
  );
  const docId = String(created.documentId || '');
  if (docId && initialBodyText && initialBodyText.trim()) {
    await googleApiFetch(
      `https://docs.googleapis.com/v1/documents/${encodeURIComponent(docId)}:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: initialBodyText.trim() + '\n',
              },
            },
          ],
        }),
      }
    );
  }
  return {
    documentId: docId,
    title: String(created.title || title),
    plainText: initialBodyText?.trim() || '',
    webViewLink: `https://docs.google.com/document/d/${docId}/edit`,
  };
};

// =========================================================================
// 5. GOOGLE SLIDES
// =========================================================================
export interface GoogleSlidesDetail {
  presentationId: string;
  title: string;
  slideCount: number;
  webViewLink: string;
  slidePreviews: string[];
}

export const getGoogleSlideDeck = async (
  accessToken: string,
  presentationId: string
): Promise<GoogleSlidesDetail> => {
  const cleanId = encodeURIComponent(presentationId.trim());
  const data = await googleApiFetch<any>(
    `https://slides.googleapis.com/v1/presentations/${cleanId}`,
    accessToken
  );
  const slides = Array.isArray(data.slides) ? data.slides : [];
  const slidePreviews: string[] = slides.map((s: any, idx: number) => {
    const texts: string[] = [];
    for (const el of s?.pageElements || []) {
      for (const te of el?.shape?.text?.textElements || []) {
        if (te?.textRun?.content) texts.push(te.textRun.content.trim());
      }
    }
    const joined = texts.filter(Boolean).join(' ').slice(0, 140);
    return `Slide ${idx + 1}: ${joined || '(Empty / Visual Slide)'}`;
  });
  const id = String(data.presentationId || presentationId.trim());
  return {
    presentationId: id,
    title: String(data.title || 'Untitled Presentation'),
    slideCount: slides.length,
    webViewLink: `https://docs.google.com/presentation/d/${id}/edit`,
    slidePreviews,
  };
};

export const createGoogleSlideDeck = async (
  accessToken: string,
  title: string,
  subtitle?: string
): Promise<GoogleSlidesDetail> => {
  const created = await googleApiFetch<any>(
    'https://slides.googleapis.com/v1/presentations',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ title }),
    }
  );
  const id = String(created.presentationId || '');
  const firstSlide = created.slides?.[0];
  if (id && firstSlide?.pageElements?.length) {
    const titleBox = firstSlide.pageElements.find(
      (pe: any) => pe?.shape?.placeholder?.type === 'CENTERED_TITLE' || pe?.shape?.placeholder?.type === 'TITLE'
    );
    const subBox = firstSlide.pageElements.find(
      (pe: any) => pe?.shape?.placeholder?.type === 'SUBTITLE'
    );
    const requests: any[] = [];
    if (titleBox?.objectId) {
      requests.push({ insertText: { objectId: titleBox.objectId, text: title, insertionIndex: 0 } });
    }
    if (subBox?.objectId && subtitle) {
      requests.push({ insertText: { objectId: subBox.objectId, text: subtitle, insertionIndex: 0 } });
    }
    if (requests.length > 0) {
      await googleApiFetch(
        `https://slides.googleapis.com/v1/presentations/${encodeURIComponent(id)}:batchUpdate`,
        accessToken,
        { method: 'POST', body: JSON.stringify({ requests }) }
      ).catch(() => {});
    }
  }
  return {
    presentationId: id,
    title: String(created.title || title),
    slideCount: Array.isArray(created.slides) ? created.slides.length : 1,
    webViewLink: `https://docs.google.com/presentation/d/${id}/edit`,
    slidePreviews: [title + (subtitle ? ` — ${subtitle}` : '')],
  };
};

// =========================================================================
// 6. GOOGLE TASKS
// =========================================================================
export interface GoogleTaskListItem {
  id: string;
  title: string;
}

export interface GoogleTaskItem {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: 'needsAction' | 'completed';
}

export const listTaskLists = async (accessToken: string): Promise<GoogleTaskListItem[]> => {
  const data = await googleApiFetch<{ items?: GoogleTaskListItem[] }>(
    'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
    accessToken
  );
  return Array.isArray(data.items) ? data.items : [];
};

export const listTasks = async (
  accessToken: string,
  taskListId = '@default'
): Promise<GoogleTaskItem[]> => {
  const data = await googleApiFetch<{ items?: GoogleTaskItem[] }>(
    `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(taskListId)}/tasks?showCompleted=true&maxResults=30`,
    accessToken
  );
  return Array.isArray(data.items) ? data.items : [];
};

export const createTask = async (
  accessToken: string,
  taskListId: string,
  payload: { title: string; notes?: string; dueDate?: string }
): Promise<GoogleTaskItem> => {
  return googleApiFetch<GoogleTaskItem>(
    `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(taskListId)}/tasks`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        notes: payload.notes || '',
        ...(payload.dueDate ? { due: new Date(payload.dueDate).toISOString() } : {}),
      }),
    }
  );
};

export const toggleTaskCompletion = async (
  accessToken: string,
  taskListId: string,
  taskId: string,
  completed: boolean
): Promise<GoogleTaskItem> => {
  return googleApiFetch<GoogleTaskItem>(
    `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(taskListId)}/tasks/${encodeURIComponent(taskId)}`,
    accessToken,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status: completed ? 'completed' : 'needsAction',
        ...(completed ? {} : { completed: null }),
      }),
    }
  );
};

// =========================================================================
// 7. GOOGLE CHAT (Business/Enterprise + Cloud Console Chat App config)
// =========================================================================
export interface ChatSpaceItem {
  name: string;
  displayName?: string;
  spaceType?: string;
}

export interface ChatMessageItem {
  name: string;
  text?: string;
  createTime?: string;
  sender?: { name?: string; displayName?: string; type?: string };
}

export const listChatSpaces = async (accessToken: string): Promise<ChatSpaceItem[]> => {
  const data = await googleApiFetch<{ spaces?: ChatSpaceItem[] }>(
    'https://chat.googleapis.com/v1/spaces?pageSize=25',
    accessToken
  );
  return Array.isArray(data.spaces) ? data.spaces : [];
};

export const createChatSpace = async (
  accessToken: string,
  displayName: string
): Promise<ChatSpaceItem> => {
  return googleApiFetch<ChatSpaceItem>(
    'https://chat.googleapis.com/v1/spaces',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        spaceType: 'SPACE',
        displayName: displayName.trim(),
      }),
    }
  );
};

export const listChatMessages = async (
  accessToken: string,
  spaceName: string
): Promise<ChatMessageItem[]> => {
  const safePath = spaceName
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  const data = await googleApiFetch<{ messages?: ChatMessageItem[] }>(
    `https://chat.googleapis.com/v1/${safePath}/messages?pageSize=25`,
    accessToken
  );
  return Array.isArray(data.messages) ? data.messages : [];
};

export const sendChatMessage = async (
  accessToken: string,
  spaceName: string,
  text: string
): Promise<ChatMessageItem> => {
  const safePath = spaceName
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return googleApiFetch<ChatMessageItem>(
    `https://chat.googleapis.com/v1/${safePath}/messages`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ text }),
    }
  );
};

// =========================================================================
// 8. GOOGLE FORMS (Always URL-encode formId)
// =========================================================================
export interface GoogleFormDetail {
  formId: string;
  title: string;
  documentTitle?: string;
  responderUri?: string;
  itemCount: number;
  questions: string[];
}

export interface GoogleFormResponseItem {
  responseId: string;
  lastSubmittedTime?: string;
  respondentEmail?: string;
  summaryText: string;
}

export const getGoogleForm = async (
  accessToken: string,
  formId: string
): Promise<GoogleFormDetail> => {
  const safeFormId = encodeURIComponent(formId.trim());
  const data = await googleApiFetch<any>(
    `https://forms.googleapis.com/v1/forms/${safeFormId}`,
    accessToken
  );
  const items = Array.isArray(data.items) ? data.items : [];
  return {
    formId: String(data.formId || formId.trim()),
    title: String(data.info?.title || 'Untitled Form'),
    documentTitle: data.info?.documentTitle,
    responderUri: data.responderUri,
    itemCount: items.length,
    questions: items.map((it: any, idx: number) => String(it?.title || `Question ${idx + 1}`)),
  };
};

export const createGoogleForm = async (
  accessToken: string,
  title: string,
  documentTitle?: string
): Promise<GoogleFormDetail> => {
  const created = await googleApiFetch<any>(
    'https://forms.googleapis.com/v1/forms',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        info: {
          title: title.trim(),
          documentTitle: (documentTitle || title).trim(),
        },
      }),
    }
  );
  return {
    formId: String(created.formId || ''),
    title: String(created.info?.title || title),
    documentTitle: created.info?.documentTitle,
    responderUri: created.responderUri,
    itemCount: Array.isArray(created.items) ? created.items.length : 0,
    questions: [],
  };
};

export const listFormResponses = async (
  accessToken: string,
  formId: string
): Promise<GoogleFormResponseItem[]> => {
  const safeFormId = encodeURIComponent(formId.trim());
  const data = await googleApiFetch<{ responses?: any[] }>(
    `https://forms.googleapis.com/v1/forms/${safeFormId}/responses`,
    accessToken
  );
  const list = Array.isArray(data.responses) ? data.responses : [];
  return list.map((r) => {
    const answersObj = r.answers || {};
    const answersText = Object.values(answersObj)
      .map((a: any) =>
        (a?.textAnswers?.answers || [])
          .map((t: any) => t?.value)
          .filter(Boolean)
          .join(', ')
      )
      .filter(Boolean)
      .join(' | ');
    return {
      responseId: String(r.responseId || ''),
      lastSubmittedTime: r.lastSubmittedTime,
      respondentEmail: r.respondentEmail,
      summaryText: answersText || '(No text answer)',
    };
  });
};

// =========================================================================
// 9. GOOGLE KEEP (Enterprise-Only Domain-Wide Delegation API)
// =========================================================================
export interface GoogleKeepNoteItem {
  name: string;
  title?: string;
  updateTime?: string;
  bodyText: string;
}

export const listKeepNotes = async (accessToken: string): Promise<GoogleKeepNoteItem[]> => {
  const data = await googleApiFetch<{ notes?: any[] }>(
    'https://keep.googleapis.com/v1/notes?pageSize=20',
    accessToken
  );
  const notes = Array.isArray(data.notes) ? data.notes : [];
  return notes.map((n) => {
    const textBody = n?.body?.text?.text || '';
    const listItems = Array.isArray(n?.body?.list?.listItems)
      ? n.body.list.listItems.map((li: any) => `${li.checked ? '[x]' : '[ ]'} ${li?.text?.text || ''}`).join('\n')
      : '';
    return {
      name: String(n.name || ''),
      title: n.title || 'Untitled Note',
      updateTime: n.updateTime,
      bodyText: textBody || listItems || '',
    };
  });
};

// =========================================================================
// 10. GOOGLE CONTACTS (People API)
// =========================================================================
export interface GoogleContactItem {
  resourceName: string;
  displayName: string;
  phoneNumber?: string;
  email?: string;
  organization?: string;
}

export const listContacts = async (
  accessToken: string,
  pageSize = 30
): Promise<GoogleContactItem[]> => {
  const params = new URLSearchParams({
    personFields: 'names,emailAddresses,phoneNumbers,organizations',
    pageSize: String(pageSize),
    sortOrder: 'LAST_MODIFIED_DESCENDING',
  });
  const data = await googleApiFetch<{ connections?: any[] }>(
    `https://people.googleapis.com/v1/people/me/connections?${params.toString()}`,
    accessToken
  );
  const list = Array.isArray(data.connections) ? data.connections : [];
  return list.map((p) => ({
    resourceName: String(p.resourceName || ''),
    displayName: String(p.names?.[0]?.displayName || p.emailAddresses?.[0]?.value || 'Unnamed Contact'),
    phoneNumber: p.phoneNumbers?.[0]?.value,
    email: p.emailAddresses?.[0]?.value,
    organization: p.organizations?.[0]?.name,
  }));
};

export const createContact = async (
  accessToken: string,
  payload: {
    fullName: string;
    phoneNumber?: string;
    email?: string;
    organization?: string;
    notes?: string;
  }
): Promise<GoogleContactItem> => {
  const parts = payload.fullName.trim().split(/\s+/);
  const givenName = parts[0] || payload.fullName.trim();
  const familyName = parts.slice(1).join(' ');

  const res = await googleApiFetch<any>(
    'https://people.googleapis.com/v1/people:createContact',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        names: [{ givenName, ...(familyName ? { familyName } : {}) }],
        ...(payload.phoneNumber ? { phoneNumbers: [{ value: payload.phoneNumber, type: 'mobile' }] } : {}),
        ...(payload.email ? { emailAddresses: [{ value: payload.email, type: 'work' }] } : {}),
        ...(payload.organization ? { organizations: [{ name: payload.organization }] } : {}),
        ...(payload.notes ? { biographies: [{ value: payload.notes, contentType: 'TEXT_PLAIN' }] } : {}),
      }),
    }
  );
  return {
    resourceName: String(res.resourceName || ''),
    displayName: String(res.names?.[0]?.displayName || payload.fullName),
    phoneNumber: res.phoneNumbers?.[0]?.value || payload.phoneNumber,
    email: res.emailAddresses?.[0]?.value || payload.email,
    organization: res.organizations?.[0]?.name || payload.organization,
  };
};

// =========================================================================
// 11. GOOGLE MEET
// =========================================================================
export interface GoogleMeetSpaceItem {
  name: string;
  meetingUri: string;
  meetingCode: string;
}

export const createMeetSpace = async (accessToken: string): Promise<GoogleMeetSpaceItem> => {
  const data = await googleApiFetch<any>(
    'https://meet.googleapis.com/v2/spaces',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  );
  return {
    name: String(data.name || ''),
    meetingUri: String(data.meetingUri || ''),
    meetingCode: String(data.meetingCode || ''),
  };
};

export const getMeetSpace = async (
  accessToken: string,
  spaceNameOrCode: string
): Promise<GoogleMeetSpaceItem> => {
  const clean = spaceNameOrCode.trim().startsWith('spaces/')
    ? spaceNameOrCode.trim()
    : `spaces/${spaceNameOrCode.trim()}`;
  const safePath = clean
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  const data = await googleApiFetch<any>(
    `https://meet.googleapis.com/v2/${safePath}`,
    accessToken
  );
  return {
    name: String(data.name || clean),
    meetingUri: String(data.meetingUri || ''),
    meetingCode: String(data.meetingCode || ''),
  };
};

// =========================================================================
// 12. GOOGLE CLASSROOM
// =========================================================================
export interface ClassroomCourseItem {
  id: string;
  name: string;
  section?: string;
  courseState?: string;
  alternateLink?: string;
}

export interface ClassroomAnnouncementItem {
  id: string;
  text: string;
  updateTime?: string;
  alternateLink?: string;
}

export interface ClassroomMaterialItem {
  id: string;
  title: string;
  description?: string;
  alternateLink?: string;
}

export const listClassroomCourses = async (
  accessToken: string
): Promise<ClassroomCourseItem[]> => {
  const data = await googleApiFetch<{ courses?: ClassroomCourseItem[] }>(
    'https://classroom.googleapis.com/v1/courses?pageSize=20',
    accessToken
  );
  return Array.isArray(data.courses) ? data.courses : [];
};

export const listClassroomAnnouncements = async (
  accessToken: string,
  courseId: string
): Promise<ClassroomAnnouncementItem[]> => {
  const data = await googleApiFetch<{ announcements?: ClassroomAnnouncementItem[] }>(
    `https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId.trim())}/announcements?pageSize=15`,
    accessToken
  );
  return Array.isArray(data.announcements) ? data.announcements : [];
};

export const listClassroomMaterials = async (
  accessToken: string,
  courseId: string
): Promise<ClassroomMaterialItem[]> => {
  const data = await googleApiFetch<{ courseWorkMaterial?: ClassroomMaterialItem[] }>(
    `https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId.trim())}/courseWorkMaterials?pageSize=15`,
    accessToken
  );
  return Array.isArray(data.courseWorkMaterial) ? data.courseWorkMaterial : [];
};

export const createClassroomAnnouncement = async (
  accessToken: string,
  courseId: string,
  text: string
): Promise<ClassroomAnnouncementItem> => {
  return googleApiFetch<ClassroomAnnouncementItem>(
    `https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId.trim())}/announcements`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        text: text.trim(),
        state: 'PUBLISHED',
      }),
    }
  );
};

// =========================================================================
// 13. GMAIL API (Inbox, Message Detail, Labels, Compose & Send)
// =========================================================================
export interface GmailMessageSummary {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  labelIds: string[];
  bodyText?: string;
}

export interface GmailLabelItem {
  id: string;
  name: string;
  type?: string;
}

function decodeBase64UrlUtf8(encoded: string): string {
  if (!encoded) return '';
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    const binary = atob(base64 + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return '';
  }
}

function encodeBase64UrlUtf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function extractGmailBodyText(payload: any): string {
  if (!payload) return '';
  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return decodeBase64UrlUtf8(payload.body.data);
  }
  if (Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      const found = extractGmailBodyText(part);
      if (found) return found;
    }
  }
  if (payload.body?.data) {
    return decodeBase64UrlUtf8(payload.body.data).replace(/<[^>]+>/g, ' ').trim();
  }
  return '';
}

function parseGmailMessageResource(data: any): GmailMessageSummary {
  const headers: Array<{ name: string; value: string }> = Array.isArray(data?.payload?.headers)
    ? data.payload.headers
    : [];
  const getHeader = (key: string) =>
    headers.find((h) => h.name?.toLowerCase() === key.toLowerCase())?.value || '';

  return {
    id: String(data?.id || ''),
    threadId: String(data?.threadId || ''),
    subject: getHeader('Subject') || '(No Subject)',
    from: getHeader('From') || 'Unknown Sender',
    date: getHeader('Date') || '',
    snippet: String(data?.snippet || ''),
    labelIds: Array.isArray(data?.labelIds) ? data.labelIds : [],
    bodyText: extractGmailBodyText(data?.payload),
  };
}

export const listGmailLabels = async (accessToken: string): Promise<GmailLabelItem[]> => {
  const data = await googleApiFetch<{ labels?: GmailLabelItem[] }>(
    'https://gmail.googleapis.com/gmail/v1/users/me/labels',
    accessToken
  );
  return Array.isArray(data.labels) ? data.labels : [];
};

export const listGmailMessages = async (
  accessToken: string,
  options?: { q?: string; maxResults?: number }
): Promise<GmailMessageSummary[]> => {
  const params = new URLSearchParams({
    maxResults: String(options?.maxResults || 12),
  });
  if (options?.q && options.q.trim()) {
    params.set('q', options.q.trim());
  }
  const listData = await googleApiFetch<{ messages?: Array<{ id: string; threadId: string }> }>(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
    accessToken
  );
  const refs = Array.isArray(listData.messages) ? listData.messages.slice(0, 12) : [];
  if (refs.length === 0) return [];

  const details = await Promise.all(
    refs.map((m) =>
      googleApiFetch<any>(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(m.id)}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        accessToken
      ).catch(() => null)
    )
  );
  return details.filter(Boolean).map(parseGmailMessageResource);
};

export const getGmailMessageDetail = async (
  accessToken: string,
  messageId: string
): Promise<GmailMessageSummary> => {
  const data = await googleApiFetch<any>(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(messageId.trim())}?format=full`,
    accessToken
  );
  return parseGmailMessageResource(data);
};

export const sendGmailMessage = async (
  accessToken: string,
  payload: { to: string; subject: string; body: string }
): Promise<{ id: string; threadId?: string }> => {
  const cleanTo = payload.to.trim();
  const cleanSubject = payload.subject.trim();
  // RFC 2047 UTF-8 encoding for non-ASCII Hindi subjects
  const encodedSubject = `=?UTF-8?B?${btoa(
    Array.from(new TextEncoder().encode(cleanSubject), (b) => String.fromCharCode(b)).join('')
  )}?=`;

  const rawMime = [
    `To: ${cleanTo}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    payload.body.trim(),
  ].join('\r\n');

  const raw = encodeBase64UrlUtf8(rawMime);
  return googleApiFetch<{ id: string; threadId?: string }>(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ raw }),
    }
  );
};

