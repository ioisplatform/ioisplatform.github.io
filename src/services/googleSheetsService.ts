import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { UserProfile } from '../types';
import {
  getAuthHeaders,
  isFirestoreInQuotaCooldown,
  markFirestoreQuotaExhausted,
  mergeUserLists,
  getAllUsers,
  saveUsers,
} from './userService';
import {
  CORE_WORKSPACE_SCOPES,
  initWorkspaceAuth,
  signInWithWorkspace,
  signOutWorkspace,
  getWorkspaceAccessToken,
  getWorkspaceUser,
  clearWorkspaceAccessToken,
} from './googleWorkspaceService';

export const GOOGLE_SHEETS_SCOPES = CORE_WORKSPACE_SCOPES;

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetTitle: string;
  tabName: string;
  webhookUrl: string;
  autoPushEnabled: boolean;
  lastSyncedAt?: string;
  lastSyncedCount?: number;
  lastSyncStatus?: string;
  updatedAt?: string;
}

export const DEFAULT_SHEETS_CONFIG: GoogleSheetsConfig = {
  spreadsheetId: '',
  spreadsheetUrl: '',
  sheetTitle: 'IOIS Master User Database',
  tabName: 'Members',
  webhookUrl: '',
  autoPushEnabled: true,
};

export const SHEET_COLUMNS = [
  'User ID',
  'Full Name',
  'Username',
  'Mobile Number',
  'Email',
  'Plan ID',
  'Role',
  'Sponsor ID',
  'Payment Status',
  'Payment UTR',
  'Payout UPI',
  'Address',
  'State',
  'District',
  'Pincode',
  'Has Photo',
  'Has Receipt',
  'Created At',
  'Verified At',
  'Password Hash (scrypt)',
  'Profile Meta JSON',
] as const;

export const initGoogleSheetsAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return initWorkspaceAuth(
    (user, token) => onAuthSuccess?.(user, token),
    onAuthFailure
  );
};

export const signInWithGoogleSheets = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  const res = await signInWithWorkspace({ includeChatScopes: false });
  return { user: res.user, accessToken: res.accessToken };
};

export const signOutGoogleSheets = async (): Promise<void> => {
  await signOutWorkspace();
};

export const getGoogleSheetsAccessToken = (): string | null => getWorkspaceAccessToken();
export const getGoogleSheetsUser = (): User | null => getWorkspaceUser();

export const clearCachedGoogleSheetsToken = (): void => {
  clearWorkspaceAccessToken();
};

export const extractSpreadsheetIdFromInput = (input: string): string => {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch && urlMatch[1]) return urlMatch[1];
  return trimmed;
};

export const getSheetsConfigAsync = async (): Promise<GoogleSheetsConfig> => {
  let serverCfg: Partial<GoogleSheetsConfig> | null = null;
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('/api/admin/sheets-config', {
      headers: getAuthHeaders(true),
      signal: controller.signal,
    });
    clearTimeout(tid);
    if (res.ok) {
      const data = await res.json();
      if (data?.config) serverCfg = data.config;
    }
  } catch {
    // Fallback to Firestore if server unreachable
  }

  let fsCfg: Partial<GoogleSheetsConfig> | null = null;
  if (!serverCfg?.spreadsheetId && db && !isFirestoreInQuotaCooldown()) {
    try {
      const snap = await Promise.race([
        getDoc(doc(db, 'app_settings', 'google_sheets_config')),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500)),
      ]);
      if (snap && snap.exists()) {
        fsCfg = snap.data() as Partial<GoogleSheetsConfig>;
      }
    } catch (e) {
      markFirestoreQuotaExhausted(e);
      handleFirestoreError(e, OperationType.GET, 'app_settings/google_sheets_config', {
        suppressThrow: true,
      });
    }
  }

  return {
    ...DEFAULT_SHEETS_CONFIG,
    ...(fsCfg || {}),
    ...(serverCfg || {}),
  };
};

export const saveSheetsConfigAsync = async (
  partial: Partial<GoogleSheetsConfig>
): Promise<GoogleSheetsConfig> => {
  const payload: Partial<GoogleSheetsConfig> = {
    ...partial,
    ...(partial.spreadsheetId !== undefined
      ? { spreadsheetId: extractSpreadsheetIdFromInput(partial.spreadsheetId) }
      : {}),
    updatedAt: new Date().toISOString(),
  };

  let saved: GoogleSheetsConfig = { ...DEFAULT_SHEETS_CONFIG, ...payload };

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('/api/admin/sheets-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(true) },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(tid);
    if (res.ok) {
      const data = await res.json();
      if (data?.config) {
        saved = { ...DEFAULT_SHEETS_CONFIG, ...data.config };
      }
    }
  } catch {
    // ignore
  }

  if (db && !isFirestoreInQuotaCooldown()) {
    try {
      await Promise.race([
        setDoc(doc(db, 'app_settings', 'google_sheets_config'), saved, { merge: true }),
        new Promise<void>((resolve) => setTimeout(resolve, 3500)),
      ]);
    } catch (e) {
      markFirestoreQuotaExhausted(e);
      handleFirestoreError(e, OperationType.WRITE, 'app_settings/google_sheets_config', {
        suppressThrow: true,
      });
    }
  }

  return saved;
};

export const getSpreadsheetMetadata = async (
  accessToken: string,
  spreadsheetId: string
): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  sheetNames: string[];
}> => {
  const cleanId = extractSpreadsheetIdFromInput(spreadsheetId);
  if (!cleanId) {
    throw new Error('कृपया मान्य Google Spreadsheet ID या URL दर्ज करें।');
  }
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(cleanId)}?fields=spreadsheetId,spreadsheetUrl,properties.title,sheets.properties.title`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (res.status === 401) {
    clearWorkspaceAccessToken();
    throw new Error('Google सत्र समाप्त हो गया है। कृपया पुनः "Sign in with Google" करें।');
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Google Sheet पढ़ने में त्रुटि (${res.status}): ${errText.slice(0, 180)}`);
  }
  const data = await res.json();
  const sheetNames: string[] = Array.isArray(data.sheets)
    ? data.sheets.map((s: any) => s?.properties?.title).filter(Boolean)
    : [];
  return {
    spreadsheetId: data.spreadsheetId || cleanId,
    spreadsheetUrl:
      data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${cleanId}/edit`,
    title: data.properties?.title || 'Google Spreadsheet',
    sheetNames,
  };
};

export const createMasterUserDatabaseSheet = async (
  accessToken: string,
  title = 'IOIS Master User Database'
): Promise<GoogleSheetsConfig> => {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: {
            title: 'Members',
            gridProperties: { frozenRowCount: 1, rowCount: 2000, columnCount: SHEET_COLUMNS.length + 2 },
          },
        },
        {
          properties: {
            title: 'Sync_Logs',
            gridProperties: { frozenRowCount: 1, rowCount: 500, columnCount: 6 },
          },
        },
      ],
    }),
  });

  if (createRes.status === 401) {
    clearWorkspaceAccessToken();
    throw new Error('Google सत्र समाप्त हो गया है। कृपया पुनः "Sign in with Google" करें।');
  }
  if (!createRes.ok) {
    const err = await createRes.text().catch(() => '');
    throw new Error(`नई Google Sheet बनाने में त्रुटि (${createRes.status}): ${err.slice(0, 200)}`);
  }

  const created = await createRes.json();
  const spreadsheetId = created.spreadsheetId as string;
  const spreadsheetUrl =
    (created.spreadsheetUrl as string) || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write headers to Members and Sync_Logs
  await Promise.all([
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent("'Members'!A1")}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [Array.from(SHEET_COLUMNS)] }),
      }
    ),
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent("'Sync_Logs'!A1")}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [
            ['Timestamp', 'Action', 'Users Count', 'Status', 'Performed By'],
            [new Date().toISOString(), 'SHEET_CREATED', 0, 'OK', getWorkspaceUser()?.email || 'Admin'],
          ],
        }),
      }
    ),
  ]);

  return saveSheetsConfigAsync({
    spreadsheetId,
    spreadsheetUrl,
    sheetTitle: created.properties?.title || title,
    tabName: 'Members',
    lastSyncStatus: 'Sheet Created Ready',
  });
};

function compactProfileMetaForSheet(u: UserProfile): string {
  const {
    password: _omitPass,
    photoUrl: _omitPhoto,
    paymentScreenshotUrl: _omitReceipt,
    coverUrl: _omitCover,
    registrationFormData,
    ...rest
  } = u as any;

  let safeRegForm = registrationFormData;
  if (registrationFormData && typeof registrationFormData === 'object') {
    const {
      paymentScreenshotUrl: _rShot,
      photoUrl: _rPhoto,
      signatureUrl: _rSig,
      ...restForm
    } = registrationFormData;
    safeRegForm = restForm;
  }

  const compact = {
    ...rest,
    ...(safeRegForm ? { registrationFormData: safeRegForm } : {}),
    // Keep external HTTP URLs if not base64 data URIs
    ...(typeof u.photoUrl === 'string' && !u.photoUrl.startsWith('data:') ? { photoUrl: u.photoUrl } : {}),
    ...(typeof u.paymentScreenshotUrl === 'string' && !u.paymentScreenshotUrl.startsWith('data:')
      ? { paymentScreenshotUrl: u.paymentScreenshotUrl }
      : {}),
  };

  let str = JSON.stringify(compact);
  if (str.length > 45000) {
    const trimmed = { ...compact, editHistory: Array.isArray(u.editHistory) ? u.editHistory.slice(0, 10) : [] };
    str = JSON.stringify(trimmed);
  }
  return str.slice(0, 48000);
}

export function serializeUserToSheetRow(u: UserProfile): (string | number)[] {
  const hasPhoto = Boolean(u.photoUrl && u.photoUrl.trim().length > 5) || Boolean((u as any).hasPhoto);
  const hasReceipt =
    Boolean(u.paymentScreenshotUrl && u.paymentScreenshotUrl.trim().length > 5) ||
    Boolean((u as any).hasPaymentScreenshot);

  return [
    String(u.userId || '').trim().toUpperCase(),
    String(u.fullName || ''),
    String(u.username || ''),
    String(u.mobileNumber || ''),
    String(u.email || ''),
    Number(u.selectedPlanId || 1),
    String(u.role || ''),
    String(u.sponsorId || ''),
    String(u.paymentStatus || 'pending'),
    String(u.paymentUtr || ''),
    String(u.payoutUpi || ''),
    String(u.address || ''),
    String(u.state || ''),
    String(u.district || ''),
    String(u.pincode || ''),
    hasPhoto ? 'YES' : 'NO',
    hasReceipt ? 'YES' : 'NO',
    String(u.createdAt || ''),
    String(u.verifiedAt || ''),
    u.password && String(u.password).startsWith('scrypt$') ? String(u.password) : '',
    compactProfileMetaForSheet(u),
  ];
}

export const pushUsersToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  users: UserProfile[],
  preferredTabName?: string
): Promise<{
  syncedCount: number;
  sheetTitle: string;
  tabName: string;
  spreadsheetUrl: string;
}> => {
  const meta = await getSpreadsheetMetadata(accessToken, spreadsheetId);
  let targetTab = preferredTabName && meta.sheetNames.includes(preferredTabName)
    ? preferredTabName
    : meta.sheetNames.includes('Members')
    ? 'Members'
    : meta.sheetNames[0];

  if (!targetTab) {
    targetTab = 'Members';
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(meta.spreadsheetId)}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{ addSheet: { properties: { title: targetTab } } }],
        }),
      }
    );
  }

  // Pull full server records including scrypt password hashes if admin session active
  let exportUsers: UserProfile[] = users;
  try {
    const exportRes = await fetch('/api/admin/users-for-sheet', {
      headers: getAuthHeaders(true),
    });
    if (exportRes.ok) {
      const exportData = await exportRes.json();
      if (Array.isArray(exportData?.users) && exportData.users.length > 0) {
        exportUsers = mergeUserLists(users, exportData.users);
      }
    }
  } catch {
    // Fallback to provided users list
  }

  const sorted = [...exportUsers].sort(
    (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
  );

  const values = [Array.from(SHEET_COLUMNS), ...sorted.map(serializeUserToSheetRow)];
  const safeTab = `'${targetTab.replace(/'/g, "''")}'`;

  // Clear old excess rows first so removed/stale tail rows never linger
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(meta.spreadsheetId)}/values/${encodeURIComponent(`${safeTab}!A1:U`)}:clear`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(meta.spreadsheetId)}/values/${encodeURIComponent(`${safeTab}!A1`)}?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  if (updateRes.status === 401) {
    clearWorkspaceAccessToken();
    throw new Error('Google सत्र समाप्त हो गया है। कृपया पुनः "Sign in with Google" करें।');
  }
  if (!updateRes.ok) {
    const err = await updateRes.text().catch(() => '');
    throw new Error(`Google Sheet अपडेट विफल (${updateRes.status}): ${err.slice(0, 200)}`);
  }

  // Log sync audit if Sync_Logs tab exists
  if (meta.sheetNames.includes('Sync_Logs')) {
    void fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(meta.spreadsheetId)}/values/${encodeURIComponent("'Sync_Logs'!A:E")}:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [
            [
              new Date().toISOString(),
              'PUSH_ALL_USERS',
              sorted.length,
              'SUCCESS',
              getWorkspaceUser()?.email || 'Admin',
            ],
          ],
        }),
      }
    ).catch(() => {});
  }

  await saveSheetsConfigAsync({
    spreadsheetId: meta.spreadsheetId,
    spreadsheetUrl: meta.spreadsheetUrl,
    sheetTitle: meta.title,
    tabName: targetTab,
    lastSyncedAt: new Date().toISOString(),
    lastSyncedCount: sorted.length,
    lastSyncStatus: `Synced ${sorted.length} users`,
  });

  return {
    syncedCount: sorted.length,
    sheetTitle: meta.title,
    tabName: targetTab,
    spreadsheetUrl: meta.spreadsheetUrl,
  };
};

export const pullUsersFromGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  preferredTabName?: string
): Promise<{
  pulledCount: number;
  mergedCount: number;
  users: UserProfile[];
  sheetTitle: string;
  tabName: string;
}> => {
  const meta = await getSpreadsheetMetadata(accessToken, spreadsheetId);
  const targetTab =
    preferredTabName && meta.sheetNames.includes(preferredTabName)
      ? preferredTabName
      : meta.sheetNames.includes('Members')
      ? 'Members'
      : meta.sheetNames[0];

  if (!targetTab) {
    throw new Error('इस Google Spreadsheet में कोई भी टैब (Sheet) नहीं मिली।');
  }

  const safeTab = `'${targetTab.replace(/'/g, "''")}'`;
  const readRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(meta.spreadsheetId)}/values/${encodeURIComponent(`${safeTab}!A1:U`)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (readRes.status === 401) {
    clearWorkspaceAccessToken();
    throw new Error('Google सत्र समाप्त हो गया है। कृपया पुनः "Sign in with Google" करें।');
  }
  if (!readRes.ok) {
    const err = await readRes.text().catch(() => '');
    throw new Error(`Google Sheet पढ़ने में त्रुटि (${readRes.status}): ${err.slice(0, 200)}`);
  }

  const data = await readRes.json();
  const rows: any[][] = Array.isArray(data.values) ? data.values : [];
  if (rows.length <= 1) {
    return {
      pulledCount: 0,
      mergedCount: getAllUsers().length,
      users: getAllUsers(),
      sheetTitle: meta.title,
      tabName: targetTab,
    };
  }

  const headers = rows[0].map((h) => String(h || '').trim().toLowerCase());
  const colIdx = (name: string, fallbackIdx: number) => {
    const i = headers.indexOf(name.toLowerCase());
    return i !== -1 ? i : fallbackIdx;
  };

  const parsedUsers: UserProfile[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!Array.isArray(row) || row.length === 0) continue;
    const rawUserId = String(row[colIdx('user id', 0)] || '').trim().toUpperCase();
    if (!rawUserId || !rawUserId.startsWith('IOIS')) continue;

    let metaObj: Record<string, any> = {};
    const metaJsonStr = String(row[colIdx('profile meta json', 20)] || '').trim();
    if (metaJsonStr.startsWith('{')) {
      try {
        metaObj = JSON.parse(metaJsonStr);
      } catch {}
    }

    const pwdHash = String(row[colIdx('password hash (scrypt)', 19)] || '').trim();
    const statusRaw = String(row[colIdx('payment status', 8)] || 'pending').trim().toLowerCase();
    const paymentStatus: 'pending' | 'approved' | 'rejected' =
      statusRaw === 'approved' || statusRaw === 'rejected' ? statusRaw : 'pending';

    const reconstructed: UserProfile = {
      ...metaObj,
      userId: rawUserId,
      fullName: String(row[colIdx('full name', 1)] || metaObj.fullName || '').trim(),
      username: String(row[colIdx('username', 2)] || metaObj.username || '').trim(),
      mobileNumber: String(row[colIdx('mobile number', 3)] || metaObj.mobileNumber || '').trim(),
      email: String(row[colIdx('email', 4)] || metaObj.email || '').trim(),
      selectedPlanId: Number(row[colIdx('plan id', 5)] || metaObj.selectedPlanId || 1),
      role: String(row[colIdx('role', 6)] || metaObj.role || 'Member').trim(),
      sponsorId: String(row[colIdx('sponsor id', 7)] || metaObj.sponsorId || 'IOIS999VK01').trim(),
      paymentStatus,
      paymentUtr: String(row[colIdx('payment utr', 9)] || metaObj.paymentUtr || '').trim(),
      payoutUpi: String(row[colIdx('payout upi', 10)] || metaObj.payoutUpi || '').trim(),
      address: String(row[colIdx('address', 11)] || metaObj.address || '').trim(),
      state: String(row[colIdx('state', 12)] || metaObj.state || '').trim(),
      district: String(row[colIdx('district', 13)] || metaObj.district || '').trim(),
      pincode: String(row[colIdx('pincode', 14)] || metaObj.pincode || '').trim(),
      photoUrl: String(metaObj.photoUrl || ''),
      createdAt: String(row[colIdx('created at', 17)] || metaObj.createdAt || new Date().toISOString()),
      verifiedAt: String(row[colIdx('verified at', 18)] || metaObj.verifiedAt || '') || undefined,
      ...(pwdHash.startsWith('scrypt$') ? { password: pwdHash, passwordProtected: true } : {}),
    };

    parsedUsers.push(reconstructed);
  }

  // Merge non-destructively with local cache + push to server disk
  const merged = mergeUserLists(getAllUsers(), parsedUsers);
  saveUsers(merged);

  if (parsedUsers.length > 0) {
    try {
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders(true) },
        body: JSON.stringify({ users: parsedUsers }),
      });
    } catch {
      // ignore if offline
    }
  }

  await saveSheetsConfigAsync({
    spreadsheetId: meta.spreadsheetId,
    spreadsheetUrl: meta.spreadsheetUrl,
    sheetTitle: meta.title,
    tabName: targetTab,
    lastSyncedAt: new Date().toISOString(),
    lastSyncedCount: parsedUsers.length,
    lastSyncStatus: `Pulled ${parsedUsers.length} users from Sheet`,
  });

  return {
    pulledCount: parsedUsers.length,
    mergedCount: merged.length,
    users: merged,
    sheetTitle: meta.title,
    tabName: targetTab,
  };
};

export const APPS_SCRIPT_BRIDGE_TEMPLATE = `// IOIS Master Database - 24x7 Free Google Sheet Auto-Sync Bridge
// Paste this inside Google Sheet -> Extensions -> Apps Script -> Deploy as Web App (Anyone)
const HEADERS = ${JSON.stringify(SHEET_COLUMNS)};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const rows = Array.isArray(payload.rows) ? payload.rows : [];
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Members") || ss.insertSheet("Members");
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    const existingIds = {};
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const idVals = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      idVals.forEach((r, idx) => {
        if (r[0]) existingIds[String(r[0]).trim().toUpperCase()] = idx + 2;
      });
    }

    rows.forEach((row) => {
      if (!Array.isArray(row) || !row[0]) return;
      const uid = String(row[0]).trim().toUpperCase();
      if (existingIds[uid]) {
        sheet.getRange(existingIds[uid], 1, 1, row.length).setValues([row]);
      } else {
        sheet.appendRow(row);
        existingIds[uid] = sheet.getLastRow();
      }
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true, count: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
