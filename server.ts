import express, { Request, Response } from "express";
import compression from "compression";
import path from "path";
import fs from "fs";
import zlib from "zlib";
import crypto from "crypto";
import { promisify } from "util";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  computeDailyRashifalForDate,
  computeVedicJanamKundli,
} from "./src/services/vedicAstrologyEngine";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  limit,
  setLogLevel,
  Firestore,
} from "firebase/firestore/lite";

dotenv.config();

// File persistence paths
const DATA_DIR = path.join(process.cwd(), "data");
const BACKUPS_DIR = path.join(DATA_DIR, "backups");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const USERS_BACKUP_FILE = path.join(DATA_DIR, "users-backup.json");
const DELETED_USERS_FILE = path.join(DATA_DIR, "deleted-users-archive.json");
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json");
const WITHDRAWALS_FILE = path.join(DATA_DIR, "withdrawals.json");
const TELEGRAM_CONFIG_FILE = path.join(DATA_DIR, "telegram-config.json");
const KNOWLEDGE_FILE = path.join(DATA_DIR, "ai-knowledge.json");
const UNANSWERED_FILE = path.join(DATA_DIR, "ai-unanswered.json");
const INTERVIEWS_FILE = path.join(DATA_DIR, "interviews.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const SOCIAL_MESSAGES_FILE = path.join(DATA_DIR, "social_messages.json");
const SOCIAL_GROUPS_FILE = path.join(DATA_DIR, "social_groups.json");
const FRIEND_REQUESTS_FILE = path.join(DATA_DIR, "friend_requests.json");
const PROFILE_VISITS_FILE = path.join(DATA_DIR, "profile_visits.json");
const PROFILE_LIKES_FILE = path.join(DATA_DIR, "social_likes.json");
const HOME_POPUPS_FILE = path.join(DATA_DIR, "home-popups.json");
const HOME_SLIDERS_FILE = path.join(DATA_DIR, "home-sliders.json");
const SHEETS_CONFIG_FILE = path.join(DATA_DIR, "sheets-config.json");
const SHEETS_QUEUE_FILE = path.join(DATA_DIR, "sheets-pending-queue.json");
const DEFAULT_FIRESTORE_DB_ID = "ai-studio-ioisplatform-e876ace6-d20e-468d-b9e8-6300349cc3a7";

// Ensure data & backup directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// =========================================================================
// Security Foundation: Secrets, scrypt Hashing, HMAC Tokens & Rate Limits
// =========================================================================
const SESSION_SECRET_FILE = path.join(DATA_DIR, ".session-secret");

function getServerSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim().length >= 16) {
    return process.env.SESSION_SECRET.trim();
  }
  try {
    if (fs.existsSync(SESSION_SECRET_FILE)) {
      const existing = fs.readFileSync(SESSION_SECRET_FILE, "utf-8").trim();
      if (existing.length >= 32) return existing;
    }
    const generated = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(SESSION_SECRET_FILE, generated, { encoding: "utf-8", mode: 0o600 });
    return generated;
  } catch {
    return crypto.createHash("sha256").update(`${process.cwd()}|iois_session_fallback`).digest("hex");
  }
}

const SERVER_SESSION_SECRET = getServerSessionSecret();

function hasExplicitAdminPinEnv(): boolean {
  return Boolean(process.env.ADMIN_PIN && process.env.ADMIN_PIN.trim());
}

function getAdminPin(): string {
  return (process.env.ADMIN_PIN && process.env.ADMIN_PIN.trim()) || "IOISSYSTEM";
}

function getPasswordRevealPin(): string {
  return (process.env.ADMIN_PASSWORD_PIN && process.env.ADMIN_PASSWORD_PIN.trim()) || "324215";
}

function getPasswordVaultKey(): Buffer {
  const rawKey = (process.env.PASSWORD_VAULT_KEY && process.env.PASSWORD_VAULT_KEY.trim()) || SERVER_SESSION_SECRET;
  return crypto.createHash("sha256").update(`iois_pwd_vault_v1|${rawKey}`).digest();
}

function encryptPasswordForVault(plain?: string | null): string {
  const clean = String(plain || "").trim();
  if (!clean || isHashedPassword(clean)) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getPasswordVaultKey(), iv);
  const enc = Buffer.concat([cipher.update(clean, "utf-8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1$${iv.toString("base64url")}$${tag.toString("base64url")}$${enc.toString("base64url")}`;
}

function decryptPasswordFromVault(token?: string | null): string | null {
  if (!token || typeof token !== "string" || !token.startsWith("v1$")) return null;
  const parts = token.split("$");
  if (parts.length !== 4) return null;
  try {
    const iv = Buffer.from(parts[1], "base64url");
    const tag = Buffer.from(parts[2], "base64url");
    const enc = Buffer.from(parts[3], "base64url");
    const decipher = crypto.createDecipheriv("aes-256-gcm", getPasswordVaultKey(), iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return dec.toString("utf-8");
  } catch {
    return null;
  }
}

let cachedCloudAdminPinHash: string | null = null;
let lastCloudAdminPinFetchAt = 0;

function timingSafeStringEqual(aStr: string, bStr: string): boolean {
  const a = Buffer.from(aStr, "utf-8");
  const b = Buffer.from(bStr, "utf-8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function isHashedPassword(val?: string | null): boolean {
  return typeof val === "string" && val.startsWith("scrypt$");
}

const scryptAsync = promisify(crypto.scrypt) as (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  keylen: number
) => Promise<Buffer>;

function hashPassword(plain: string): string {
  const clean = String(plain || "").trim();
  if (!clean) return "";
  if (isHashedPassword(clean)) return clean;
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(clean, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

async function hashPasswordAsync(plain: string): Promise<string> {
  const clean = String(plain || "").trim();
  if (!clean) return "";
  if (isHashedPassword(clean)) return clean;
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = (await scryptAsync(clean, salt, 64)).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(plain: string, stored?: string | null): boolean {
  if (!stored || !String(stored).trim()) return true;
  const candidate = String(plain || "");
  const cleanCandidate = candidate.trim();
  const s = String(stored);

  if (isHashedPassword(s)) {
    const parts = s.split("$");
    if (parts.length !== 3) return false;
    const [, salt, hexHash] = parts;
    if (!salt || !hexHash) return false;
    try {
      const expectedBuf = Buffer.from(hexHash, "hex");
      const candidates = candidate === cleanCandidate ? [candidate] : [candidate, cleanCandidate];
      for (const c of candidates) {
        if (!c) continue;
        const actualBuf = crypto.scryptSync(c, salt, expectedBuf.length);
        if (actualBuf.length === expectedBuf.length && crypto.timingSafeEqual(actualBuf, expectedBuf)) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  if (timingSafeStringEqual(candidate, s)) return true;
  if (cleanCandidate !== candidate && timingSafeStringEqual(cleanCandidate, s)) return true;
  return false;
}

async function verifyPasswordAsync(plain: string, stored?: string | null): Promise<boolean> {
  if (!stored || !String(stored).trim()) return true;
  const candidate = String(plain || "");
  const cleanCandidate = candidate.trim();
  const s = String(stored);

  if (isHashedPassword(s)) {
    const parts = s.split("$");
    if (parts.length !== 3) return false;
    const [, salt, hexHash] = parts;
    if (!salt || !hexHash) return false;
    try {
      const expectedBuf = Buffer.from(hexHash, "hex");
      const candidates = candidate === cleanCandidate ? [candidate] : [candidate, cleanCandidate];
      for (const c of candidates) {
        if (!c) continue;
        const actualBuf = await scryptAsync(c, salt, expectedBuf.length);
        if (actualBuf.length === expectedBuf.length && crypto.timingSafeEqual(actualBuf, expectedBuf)) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  if (timingSafeStringEqual(candidate, s)) return true;
  if (cleanCandidate !== candidate && timingSafeStringEqual(cleanCandidate, s)) return true;
  return false;
}

interface AuthTokenPayload {
  role: "admin" | "member";
  userId: string;
  sessionToken?: string;
  iat: number;
  exp: number;
}

function signAuthToken(payload: Omit<AuthTokenPayload, "iat" | "exp">, ttlSeconds = 12 * 3600): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AuthTokenPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const encoded = Buffer.from(JSON.stringify(fullPayload), "utf-8").toString("base64url");
  const sig = crypto.createHmac("sha256", SERVER_SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

function verifyAuthToken(token?: string | null): AuthTokenPayload | null {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [encoded, sig] = token.trim().split(".");
  if (!encoded || !sig) return null;
  try {
    const expectedSig = crypto.createHmac("sha256", SERVER_SESSION_SECRET).update(encoded).digest("base64url");
    if (!timingSafeStringEqual(sig, expectedSig)) return null;
    const decoded = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as AuthTokenPayload;
    if (!decoded || typeof decoded.exp !== "number" || decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function extractBearerToken(req: Request): string {
  const authHeader = String(req.headers.authorization || "").trim();
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }
  return "";
}

function isAdminAuthorized(req: Request): boolean {
  const bearer = extractBearerToken(req);
  const decoded = verifyAuthToken(bearer);
  if (decoded && decoded.role === "admin") return true;

  const pinCandidate = String(
    req.headers["x-admin-pin"] || (req.body && typeof req.body === "object" ? req.body.adminPin : "") || ""
  ).trim();
  if (pinCandidate) {
    const cleanCandidate = pinCandidate.toUpperCase();
    if (hasExplicitAdminPinEnv()) {
      return timingSafeStringEqual(cleanCandidate, getAdminPin().toUpperCase());
    }
    if (cachedCloudAdminPinHash && verifyPassword(cleanCandidate, cachedCloudAdminPinHash)) {
      return true;
    }
    if (!cachedCloudAdminPinHash && timingSafeStringEqual(cleanCandidate, getAdminPin().toUpperCase())) {
      return true;
    }
  }
  return false;
}

function requireAdminRequest(req: Request, res: Response): boolean {
  if (isAdminAuthorized(req)) return true;
  res.status(401).json({ success: false, error: "अनधिकृत अनुरोध: एडमिन प्रमाणीकरण (Admin Auth) आवश्यक है।" });
  return false;
}

function getAuthenticatedMember(req: Request): AuthTokenPayload | null {
  const decoded = verifyAuthToken(extractBearerToken(req));
  if (decoded && (decoded.role === "member" || decoded.role === "admin")) {
    return decoded;
  }
  return null;
}

function isSelfOrAdminAuthorized(req: Request, targetUserId: string, matchedUser?: any): boolean {
  if (isAdminAuthorized(req)) return true;
  const cleanTarget = String(targetUserId || "").trim().toUpperCase();
  if (!cleanTarget) return false;

  const auth = getAuthenticatedMember(req);
  if (auth && auth.role === "member" && String(auth.userId || "").toUpperCase() === cleanTarget) {
    if (matchedUser?.activeSessionToken && auth.sessionToken && matchedUser.activeSessionToken !== auth.sessionToken) {
      return false;
    }
    return true;
  }

  const sessionHeader = String(req.headers["x-session-token"] || "").trim();
  if (sessionHeader && matchedUser?.activeSessionToken && sessionHeader === matchedUser.activeSessionToken) {
    return true;
  }
  return false;
}

function requireSelfOrAdminRequest(req: Request, res: Response, targetUserId: string, matchedUser?: any): boolean {
  if (isSelfOrAdminAuthorized(req, targetUserId, matchedUser)) return true;
  res.status(401).json({ success: false, error: "अनधिकृत अनुरोध: कृपया अपने खाते में लॉगिन करें।" });
  return false;
}

const rateLimitBuckets = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const xff = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return xff || req.ip || req.socket?.remoteAddress || "unknown";
}

function isRateLimited(req: Request, bucketKey: string, maxRequests: number, windowMs: number, recordAttempt = true): boolean {
  const ip = getClientIp(req);
  const key = `${bucketKey}:${ip}`;
  const now = Date.now();
  const recent = (rateLimitBuckets.get(key) || []).filter((ts) => now - ts < windowMs);
  if (recent.length >= maxRequests) {
    rateLimitBuckets.set(key, recent);
    return true;
  }
  if (recordAttempt) {
    recent.push(now);
    rateLimitBuckets.set(key, recent);
  }
  if (rateLimitBuckets.size > 5000) {
    for (const [k, arr] of rateLimitBuckets.entries()) {
      if (!arr.length || now - arr[arr.length - 1] > windowMs) {
        rateLimitBuckets.delete(k);
      }
    }
  }
  return false;
}

function recordRateLimitHit(req: Request, bucketKey: string, windowMs: number): void {
  const ip = getClientIp(req);
  const key = `${bucketKey}:${ip}`;
  const now = Date.now();
  const recent = (rateLimitBuckets.get(key) || []).filter((ts) => now - ts < windowMs);
  recent.push(now);
  rateLimitBuckets.set(key, recent);
}

function clearRateLimitHits(req: Request, bucketKey: string): void {
  const ip = getClientIp(req);
  rateLimitBuckets.delete(`${bucketKey}:${ip}`);
}

const jsonArrayCache = new Map<string, any[]>();
const jsonObjectCache = new Map<string, Record<string, any>>();
let cachedMessagesMemory: any[] | null = null;

function writeJsonAtomic(filePath: string, data: any, compact = false): void {
  const tmpPath = `${filePath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 6)}`;
  const useCompact = compact || (Array.isArray(data) && data.length > 10);
  const jsonStr = useCompact ? JSON.stringify(data) : JSON.stringify(data, null, 2);
  fs.writeFileSync(tmpPath, jsonStr, "utf-8");
  fs.renameSync(tmpPath, filePath);
}

async function writeJsonAtomicAsync(filePath: string, data: any, compact = true): Promise<void> {
  const tmpPath = `${filePath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 6)}`;
  const useCompact = compact || (Array.isArray(data) && data.length > 10);
  const jsonStr = useCompact ? JSON.stringify(data) : JSON.stringify(data, null, 2);
  await fs.promises.writeFile(tmpPath, jsonStr, "utf-8");
  await fs.promises.rename(tmpPath, filePath);
}

function loadJsonArray(filePath: string): any[] {
  const cached = jsonArrayCache.get(filePath);
  if (cached) return [...cached];
  try {
    if (!fs.existsSync(filePath)) {
      writeJsonAtomic(filePath, []);
      jsonArrayCache.set(filePath, []);
      return [];
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : [];
    jsonArrayCache.set(filePath, arr);
    return [...arr];
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

function saveJsonArray(filePath: string, items: any[]): void {
  const copy = Array.isArray(items) ? [...items] : [];
  jsonArrayCache.set(filePath, copy);
  try {
    writeJsonAtomic(filePath, copy);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

function loadJsonObject(filePath: string): Record<string, any> {
  const cached = jsonObjectCache.get(filePath);
  if (cached) return { ...cached };
  try {
    if (!fs.existsSync(filePath)) {
      writeJsonAtomic(filePath, {});
      jsonObjectCache.set(filePath, {});
      return {};
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const obj = data && typeof data === "object" && !Array.isArray(data) ? data : {};
    jsonObjectCache.set(filePath, obj);
    return { ...obj };
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return {};
  }
}

function saveJsonObject(filePath: string, obj: Record<string, any>): void {
  const copy = obj && typeof obj === "object" && !Array.isArray(obj) ? { ...obj } : {};
  jsonObjectCache.set(filePath, copy);
  try {
    writeJsonAtomic(filePath, copy);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

function loadMessagesFromDisk(): any[] {
  if (cachedMessagesMemory !== null) return [...cachedMessagesMemory];
  try {
    if (!fs.existsSync(MESSAGES_FILE)) {
      writeJsonAtomic(MESSAGES_FILE, []);
      cachedMessagesMemory = [];
      return [];
    }
    const raw = fs.readFileSync(MESSAGES_FILE, "utf-8");
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : [];
    cachedMessagesMemory = arr;
    return [...arr];
  } catch (err) {
    console.error("Error reading messages from disk:", err);
    return [];
  }
}

function saveMessagesToDisk(items: any[]): void {
  const copy = Array.isArray(items) ? [...items] : [];
  cachedMessagesMemory = copy;
  try {
    writeJsonAtomic(MESSAGES_FILE, copy);
  } catch (err) {
    console.error("Error writing messages to disk:", err);
  }
}

// Telegram Integration Configuration
interface TelegramConfigData {
  enabled: boolean;
  botToken: string;
  chatId: string;
  adminSecret: string;
  botUsername?: string;
}

function loadTelegramConfig(): TelegramConfigData {
  const defaults: TelegramConfigData = {
    enabled: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    chatId: process.env.TELEGRAM_CHAT_ID || "",
    adminSecret: getAdminPin(),
    botUsername: "@iois_admin_notification_bot",
  };
  try {
    if (fs.existsSync(TELEGRAM_CONFIG_FILE)) {
      const raw = fs.readFileSync(TELEGRAM_CONFIG_FILE, "utf-8");
      const data = JSON.parse(raw);
      // Treat known revoked or invalid placeholder token as empty
      const isKnownRevokedToken = typeof data.botToken === "string" && (
        !data.botToken || 
        data.botToken.startsWith("8838741922:AAFGoIvjohn") ||
        data.botToken.includes("placeholder")
      );
      const cleanToken = isKnownRevokedToken ? (process.env.TELEGRAM_BOT_TOKEN || "") : (data.botToken || "");
      const isConfigured = Boolean(cleanToken && (data.chatId || defaults.chatId));

      return {
        enabled: isConfigured && typeof data.enabled === "boolean" ? data.enabled : false,
        botToken: cleanToken,
        chatId: data.chatId || defaults.chatId,
        adminSecret: data.adminSecret || defaults.adminSecret,
        botUsername: data.botUsername || defaults.botUsername,
      };
    }
  } catch (e) {
    console.error("Error reading telegram-config.json:", e);
  }
  return defaults;
}

function saveTelegramConfig(cfg: TelegramConfigData): void {
  try {
    fs.writeFileSync(TELEGRAM_CONFIG_FILE, JSON.stringify(cfg, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing telegram-config.json:", e);
  }
}

function escapeTelegramHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getPublicBaseUrl(req?: Request): string {
  if (process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL") {
    return process.env.APP_URL.replace(/\/+$/, "");
  }
  if (req) {
    const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    return `${proto}://${host}`;
  }
  return "https://iois.in";
}

async function sendTelegramRegistrationAlert(user: any, req?: Request): Promise<{ success: boolean; error?: string }> {
  const cfg = loadTelegramConfig();
  if (!cfg.enabled || !cfg.botToken || !cfg.chatId) {
    return { success: false, error: "Telegram alert not configured or disabled" };
  }

  const baseUrl = getPublicBaseUrl(req);
  const planPrice = PLAN_PRICES[user.selectedPlanId] || 10;
  const secret = cfg.adminSecret;

  const approveUrl = `${baseUrl}/api/telegram/action?action=approve&userId=${encodeURIComponent(user.userId)}&token=${encodeURIComponent(secret)}`;
  const rejectUrl = `${baseUrl}/api/telegram/action?action=reject&userId=${encodeURIComponent(user.userId)}&token=${encodeURIComponent(secret)}`;
  const adminUrl = `${baseUrl}/#admin`;
  const cleanDigits = (user.mobileNumber || "").replace(/\D/g, "");
  const waUrl = `https://wa.me/${cleanDigits.length === 10 ? '91' + cleanDigits : cleanDigits}`;

  const messageText = 
`🔔 <b>नया रजिस्ट्रेशन अलर्ट | IOIS Platform</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>नाम:</b> <b>${escapeTelegramHtml(user.fullName)}</b>
🆔 <b>User ID:</b> <code>${user.userId}</code>
📱 <b>मोबाइल:</b> <code>${user.mobileNumber}</code>
📧 <b>ईमेल:</b> ${escapeTelegramHtml(user.email || 'N/A')}
💎 <b>प्लान:</b> Plan 0${user.selectedPlanId} (₹${planPrice})
💳 <b>UTR / Txn:</b> <code>${escapeTelegramHtml(user.paymentUtr || 'उपलब्ध नहीं')}</code>
💰 <b>पेआउट UPI:</b> <code>${escapeTelegramHtml(user.payoutUpi || 'उपलब्ध नहीं')}</code>
📍 <b>पता:</b> ${escapeTelegramHtml(user.address || 'N/A')}
${user.googleDrivePaymentLink ? `🔗 <b>पेमेंट स्लिप लिंक:</b> <a href="${user.googleDrivePaymentLink}">यहाँ क्लिक करके देखें</a>\n` : ''}
⏰ <b>समय:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
━━━━━━━━━━━━━━━━━━━━
👇 <b>नीचे दिए गए बटन से सीधे अप्रूव या रिजेक्ट करें:</b>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: "✅ Approve (स्वीकृत करें)", url: approveUrl },
        { text: "❌ Reject (अस्वीकृत करें)", url: rejectUrl }
      ],
      [
        { text: "💬 WhatsApp चैट", url: waUrl },
        { text: "🖥️ एडमिन पैनल खोलें", url: adminUrl }
      ]
    ]
  };

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${cfg.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text: messageText,
        parse_mode: "HTML",
        reply_markup: inlineKeyboard,
        disable_web_page_preview: false,
      }),
    });

    const tgData: any = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || !tgData.ok) {
      if (tgRes.status === 401 || tgData?.error_code === 401) {
        cfg.enabled = false;
        saveTelegramConfig(cfg);
        console.warn("[Telegram Notice] Telegram Bot Token is unauthorized (401). Alerts automatically disabled until a valid token is provided in settings.");
        return { success: false, error: "Telegram bot token is unauthorized (401). Alerts paused." };
      }
      console.warn("Telegram API Note:", tgData?.description || "Request failed");
      return { success: false, error: tgData?.description || "Telegram API failed" };
    }
    return { success: true };
  } catch (err: any) {
    console.warn("Telegram alert network note:", err.message || err);
    return { success: false, error: err.message };
  }
}

// No demo users - only genuine registered records exist (exact ID match only so real users like IOIS999VK05 are never filtered)
const INITIAL_DEMO_USERS: any[] = [];
const DEMO_USER_IDS_SET = new Set(["IOIS999RK01", "IOIS49PS01", "IOIS10AM01", "IOIS99KV01", "IOIS999SM01"]);

function isDemoUserId(userId?: string): boolean {
  if (!userId) return false;
  return DEMO_USER_IDS_SET.has(String(userId).trim().toUpperCase());
}

function sanitizeAuditValue(val: any): string {
  if (val === undefined || val === null) return "";
  const str = String(val);
  if (str.startsWith("data:") || str.length > 500) {
    return "[फोटो/दस्तावेज अपडेट]";
  }
  return str;
}

function sanitizeEditHistoryArray(logs: any): any[] {
  if (!Array.isArray(logs)) return [];
  return logs
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      ...item,
      oldValue: sanitizeAuditValue(item.oldValue),
      newValue: sanitizeAuditValue(item.newValue),
    }))
    .slice(0, 100);
}

function compactUserForPublicDirectory(u: any, opts: { lite?: boolean } = {}): any {
  if (!u || typeof u !== "object") return u;
  const privacy = (u.privacySettings && typeof u.privacySettings === "object") ? u.privacySettings : {};
  const rawPhoto = typeof u.photoUrl === "string" ? u.photoUrl : "";
  const rawCover = typeof u.coverUrl === "string" ? u.coverUrl : "";
  const photoUrl = opts.lite && rawPhoto.startsWith("data:") && rawPhoto.length > 16000 ? "" : rawPhoto;
  const coverUrl = opts.lite && rawCover.startsWith("data:") && rawCover.length > 16000 ? undefined : (rawCover || undefined);
  return {
    userId: u.userId,
    username: u.username || undefined,
    fullName: u.fullName,
    photoUrl,
    hasPhoto: Boolean(rawPhoto),
    googleDrivePhotoLink: u.googleDrivePhotoLink || undefined,
    selectedPlanId: u.selectedPlanId,
    role: u.role,
    paymentStatus: u.paymentStatus,
    createdAt: u.createdAt,
    verifiedAt: u.verifiedAt,
    sponsorId: u.sponsorId,
    state: u.state,
    district: u.district,
    profileFrameId: u.profileFrameId,
    privacySettings: u.privacySettings,
    bio: u.bio || undefined,
    coverUrl,
    profileViews: u.profileViews || 0,
    profileLikes: Array.isArray(u.profileLikes) ? u.profileLikes : undefined,
    friends: Array.isArray(u.friends) ? u.friends : undefined,
    mustChangePassword: u.mustChangePassword || undefined,
    registeredBySponsorId: u.registeredBySponsorId || undefined,
    mobileNumber: privacy.showMobile === true ? (u.mobileNumber || "") : maskMobile(u.mobileNumber),
    email: privacy.showEmail === true ? (u.email || "") : maskEmail(u.email),
    hasPaymentScreenshot: Boolean(u.paymentScreenshotUrl || u.registrationFormData?.paymentScreenshotUrl),
    passwordProtected: Boolean(u.password),
  };
}

function sanitizeUserForMember(u: any): any {
  if (!u || typeof u !== "object") return u;
  const { password, passwordVaultEnc, ...rest } = u;
  return {
    ...rest,
    passwordProtected: Boolean(password),
  };
}

function sanitizeUserForAdmin(u: any): any {
  if (!u || typeof u !== "object") return u;
  const { password, passwordVaultEnc, ...rest } = u;
  return {
    ...rest,
    passwordProtected: Boolean(password),
    hasVaultPassword: Boolean(
      passwordVaultEnc && typeof passwordVaultEnc === "string" && passwordVaultEnc.startsWith("v1$")
    ),
    passwordStatus: password
      ? isHashedPassword(password)
        ? "🔒 Encrypted (scrypt)"
        : "🔐 Legacy Protected"
      : "कोई पासवर्ड सेट नहीं",
  };
}

let cachedUsersMemory: any[] | null = null;
let lastSnapshotTimestamp = 0;
let lastBackupAtIso = "";

// =========================================================================
// Server-Side Firestore Bridge + Quota Protection (Zero Data Loss)
// =========================================================================
let serverFirestoreDb: Firestore | null = null;
let firestoreQuotaBlockedUntil = 0;
let lastFirestoreHydrationAt = 0;
let firestoreHydrationPromise: Promise<{ synced: number; error?: string }> | null = null;

function getServerFirestore(): Firestore | null {
  if (serverFirestoreDb) return serverFirestoreDb;
  try {
    setLogLevel("error");
    const cfgPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(cfgPath)) return null;
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    const app = getApps().length > 0 ? getApp() : initializeApp(cfg);
    const databaseId =
      cfg.firestoreDatabaseId && cfg.firestoreDatabaseId !== "(default)"
        ? cfg.firestoreDatabaseId
        : DEFAULT_FIRESTORE_DB_ID;
    serverFirestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    return serverFirestoreDb;
  } catch (err) {
    console.warn("[Server Firestore Init Note]:", err);
    return null;
  }
}

function isQuotaOrResourceExhaustedError(err: any): boolean {
  const msg = String(err?.message || err?.code || err || "").toLowerCase();
  return msg.includes("resource-exhausted") || msg.includes("quota");
}

function sanitizeDocForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeDocForFirestore);
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      clean[k] = sanitizeDocForFirestore(v);
    }
  }
  return clean;
}

function sendJsonCompressed(req: Request, res: Response, payload: any): Response | void {
  try {
    const jsonStr = JSON.stringify(payload);
    const acceptEnc = String(req.headers["accept-encoding"] || "");
    if (jsonStr.length > 4096 && /\bgzip\b/i.test(acceptEnc)) {
      const gz = zlib.gzipSync(Buffer.from(jsonStr, "utf-8"));
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Vary", "Accept-Encoding");
      return res.send(gz);
    }
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(jsonStr);
  } catch (err) {
    return res.json(payload);
  }
}

function stripUserMediaForMetadata(u: any): any {
  const clean: any = sanitizeUserForAdmin(u);
  const hasPhoto = Boolean(clean.photoUrl && String(clean.photoUrl).trim().length > 10);
  const hasReceipt = Boolean(
    (clean.paymentScreenshotUrl && String(clean.paymentScreenshotUrl).trim().length > 10) ||
      (clean.registrationFormData?.paymentScreenshotUrl &&
        String(clean.registrationFormData.paymentScreenshotUrl).trim().length > 10)
  );
  if (typeof clean.photoUrl === "string" && clean.photoUrl.startsWith("data:") && clean.photoUrl.length > 4096) {
    clean.photoUrl = "";
  }
  if (
    typeof clean.paymentScreenshotUrl === "string" &&
    clean.paymentScreenshotUrl.startsWith("data:") &&
    clean.paymentScreenshotUrl.length > 4096
  ) {
    clean.paymentScreenshotUrl = "";
  }
  if (
    clean.registrationFormData &&
    typeof clean.registrationFormData === "object" &&
    typeof clean.registrationFormData.paymentScreenshotUrl === "string" &&
    clean.registrationFormData.paymentScreenshotUrl.startsWith("data:") &&
    clean.registrationFormData.paymentScreenshotUrl.length > 4096
  ) {
    clean.registrationFormData = {
      ...clean.registrationFormData,
      paymentScreenshotUrl: "",
    };
  }
  clean.hasPhoto = hasPhoto;
  clean.hasPaymentScreenshot = hasReceipt;
  return clean;
}

function prepareUserForFirestore(user: any): any {
  const normalized = {
    ...user,
    ...(user?.password && String(user.password).trim() ? { password: hashPassword(String(user.password)) } : {}),
    ...(Array.isArray(user?.editHistory) ? { editHistory: sanitizeEditHistoryArray(user.editHistory) } : {}),
  };
  const clean = sanitizeDocForFirestore(normalized);
  if (!clean) return clean;
  try {
    const size = Buffer.byteLength(JSON.stringify(clean), "utf-8");
    if (size <= 850_000) return clean;
    // Keep all member details, only trim massive >200KB raw data URIs so Firestore 1MB limit never rejects write
    const trimmed: Record<string, any> = { ...clean, hasServerMedia: true };
    if (
      typeof trimmed.paymentScreenshotUrl === "string" &&
      trimmed.paymentScreenshotUrl.startsWith("data:") &&
      trimmed.paymentScreenshotUrl.length > 200_000
    ) {
      trimmed.paymentScreenshotUrl = "";
    }
    if (
      typeof trimmed.photoUrl === "string" &&
      trimmed.photoUrl.startsWith("data:") &&
      trimmed.photoUrl.length > 200_000
    ) {
      trimmed.photoUrl = "";
    }
    if (
      trimmed.registrationFormData &&
      typeof trimmed.registrationFormData === "object" &&
      typeof trimmed.registrationFormData.paymentScreenshotUrl === "string" &&
      trimmed.registrationFormData.paymentScreenshotUrl.startsWith("data:") &&
      trimmed.registrationFormData.paymentScreenshotUrl.length > 200_000
    ) {
      trimmed.registrationFormData = {
        ...trimmed.registrationFormData,
        paymentScreenshotUrl: "",
      };
    }
    return trimmed;
  } catch {
    return clean;
  }
}

async function syncUserMediaToFirestore(fsDb: Firestore, cleanId: string, user: any): Promise<void> {
  try {
    const photoUrl = typeof user?.photoUrl === "string" && user.photoUrl.startsWith("data:") ? user.photoUrl : "";
    const receiptUrl =
      typeof user?.paymentScreenshotUrl === "string" && user.paymentScreenshotUrl.startsWith("data:")
        ? user.paymentScreenshotUrl
        : typeof user?.registrationFormData?.paymentScreenshotUrl === "string" &&
            user.registrationFormData.paymentScreenshotUrl.startsWith("data:")
          ? user.registrationFormData.paymentScreenshotUrl
          : "";
    if (!photoUrl && !receiptUrl) return;
    if (photoUrl.length <= 200_000 && receiptUrl.length <= 200_000) return;

    const totalLen = photoUrl.length + receiptUrl.length;
    if (totalLen <= 820_000) {
      await setDoc(
        doc(fsDb, "user_media", cleanId),
        {
          userId: cleanId,
          ...(photoUrl ? { photoUrl } : {}),
          ...(receiptUrl ? { paymentScreenshotUrl: receiptUrl } : {}),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } else {
      if (photoUrl && photoUrl.length <= 850_000) {
        await setDoc(
          doc(fsDb, "user_media", cleanId),
          { userId: cleanId, photoUrl, updatedAt: new Date().toISOString() },
          { merge: true }
        );
      }
      if (receiptUrl && receiptUrl.length <= 850_000) {
        await setDoc(
          doc(fsDb, "user_media", `${cleanId}__RECEIPT`),
          { userId: cleanId, paymentScreenshotUrl: receiptUrl, updatedAt: new Date().toISOString() },
          { merge: true }
        );
      }
    }
  } catch {
    // Non-fatal: server disk & rolling backups hold full images
  }
}

async function hydrateUserMediaFromFirestore(fsDb: Firestore, user: any): Promise<any> {
  if (!user || !user.userId) return user;
  const cleanId = String(user.userId).trim().toUpperCase();
  const needsPhoto = !user.photoUrl;
  const needsReceipt = !user.paymentScreenshotUrl;
  if (!user.hasServerMedia && !needsPhoto && !needsReceipt) return user;
  try {
    const [mediaSnap, receiptSnap] = await Promise.all([
      getDoc(doc(fsDb, "user_media", cleanId)),
      needsReceipt ? getDoc(doc(fsDb, "user_media", `${cleanId}__RECEIPT`)) : Promise.resolve(null),
    ]);
    let next = { ...user };
    if (mediaSnap && mediaSnap.exists()) {
      const md: any = mediaSnap.data();
      if (md?.photoUrl && !next.photoUrl) next.photoUrl = md.photoUrl;
      if (md?.paymentScreenshotUrl && !next.paymentScreenshotUrl) {
        next.paymentScreenshotUrl = md.paymentScreenshotUrl;
      }
    }
    if (receiptSnap && receiptSnap.exists()) {
      const rd: any = receiptSnap.data();
      if (rd?.paymentScreenshotUrl && !next.paymentScreenshotUrl) {
        next.paymentScreenshotUrl = rd.paymentScreenshotUrl;
      }
    }
    return next;
  } catch {
    return user;
  }
}

async function syncSingleUserToFirestore(user: any): Promise<boolean> {
  if (!user || !user.userId) return false;
  if (Date.now() < firestoreQuotaBlockedUntil) return false;
  const fsDb = getServerFirestore();
  if (!fsDb) return false;
  try {
    const cleanId = String(user.userId).trim().toUpperCase();
    const payload = prepareUserForFirestore(user);
    await setDoc(doc(fsDb, "users", cleanId), payload, { merge: true });
    await syncUserMediaToFirestore(fsDb, cleanId, user);
    return true;
  } catch (err: any) {
    if (isQuotaOrResourceExhaustedError(err)) {
      firestoreQuotaBlockedUntil = Date.now() + 10 * 60 * 1000;
      console.warn("[Server Firestore] Daily quota exhausted — pausing Firestore sync for 10m (server disk/backups remain active).");
    } else {
      console.warn("[Server Firestore Write Note]:", err?.message || err);
    }
    return false;
  }
}

// =========================================================================
// Quota-Optimized 1-Read Firestore Snapshot & Google Sheets Config/Webhook
// =========================================================================
let snapshotSyncTimer: NodeJS.Timeout | null = null;
let lastSyncedSnapshotSignature = "";

interface ServerSheetsConfig {
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

const DEFAULT_SERVER_SHEETS_CONFIG: ServerSheetsConfig = {
  spreadsheetId: "",
  spreadsheetUrl: "",
  sheetTitle: "IOIS Master User Database",
  tabName: "Members",
  webhookUrl: "",
  autoPushEnabled: true,
};

function loadSheetsConfigFromDisk(): ServerSheetsConfig {
  const obj = loadJsonObject(SHEETS_CONFIG_FILE);
  return { ...DEFAULT_SERVER_SHEETS_CONFIG, ...(obj || {}) };
}

function saveSheetsConfigToDisk(partial: Partial<ServerSheetsConfig>): ServerSheetsConfig {
  const prev = loadSheetsConfigFromDisk();
  const next: ServerSheetsConfig = {
    ...prev,
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  try {
    writeJsonAtomic(SHEETS_CONFIG_FILE, next);
  } catch (err) {
    console.warn("[Sheets Config Save Note]:", err);
  }
  return next;
}

function compactUserForSnapshot(u: any): any {
  if (!u || typeof u !== "object") return u;
  const clean = sanitizeDocForFirestore({
    ...u,
    ...(u.password && String(u.password).trim() ? { password: hashPassword(String(u.password)) } : {}),
  });
  const hasPhoto = Boolean(clean.photoUrl && String(clean.photoUrl).trim().length > 10);
  const hasReceipt = Boolean(
    (clean.paymentScreenshotUrl && String(clean.paymentScreenshotUrl).trim().length > 10) ||
      (clean.registrationFormData?.paymentScreenshotUrl &&
        String(clean.registrationFormData.paymentScreenshotUrl).trim().length > 10)
  );
  if (typeof clean.photoUrl === "string" && clean.photoUrl.startsWith("data:") && clean.photoUrl.length > 2048) {
    clean.photoUrl = "";
  }
  if (typeof clean.coverUrl === "string" && clean.coverUrl.startsWith("data:") && clean.coverUrl.length > 2048) {
    clean.coverUrl = "";
  }
  if (
    typeof clean.paymentScreenshotUrl === "string" &&
    clean.paymentScreenshotUrl.startsWith("data:") &&
    clean.paymentScreenshotUrl.length > 2048
  ) {
    clean.paymentScreenshotUrl = "";
  }
  if (clean.registrationFormData && typeof clean.registrationFormData === "object") {
    const rfd = { ...clean.registrationFormData };
    if (typeof rfd.paymentScreenshotUrl === "string" && rfd.paymentScreenshotUrl.startsWith("data:") && rfd.paymentScreenshotUrl.length > 2048) {
      rfd.paymentScreenshotUrl = "";
    }
    if (typeof rfd.photoUrl === "string" && rfd.photoUrl.startsWith("data:") && rfd.photoUrl.length > 2048) {
      rfd.photoUrl = "";
    }
    if (typeof rfd.signatureUrl === "string" && rfd.signatureUrl.startsWith("data:") && rfd.signatureUrl.length > 2048) {
      rfd.signatureUrl = "";
    }
    clean.registrationFormData = rfd;
  }
  if (Array.isArray(clean.editHistory) && clean.editHistory.length > 10) {
    clean.editHistory = clean.editHistory.slice(0, 10);
  }
  clean.hasPhoto = hasPhoto;
  clean.hasPaymentScreenshot = hasReceipt;
  clean.hasServerMedia = hasPhoto || hasReceipt;
  return clean;
}

function serializeUserForSheetRowServer(u: any): (string | number)[] {
  const hasPhoto = Boolean(u.photoUrl && String(u.photoUrl).trim().length > 5) || Boolean(u.hasPhoto);
  const hasReceipt =
    Boolean(u.paymentScreenshotUrl && String(u.paymentScreenshotUrl).trim().length > 5) ||
    Boolean(u.hasPaymentScreenshot);

  const compact = compactUserForSnapshot(u);
  const { password: _omitPwd, ...metaSafe } = compact || {};
  let metaJson = JSON.stringify(metaSafe || {});
  if (metaJson.length > 48000) {
    metaJson = JSON.stringify({
      ...metaSafe,
      editHistory: Array.isArray(metaSafe?.editHistory) ? metaSafe.editHistory.slice(0, 5) : [],
    }).slice(0, 48000);
  }

  return [
    String(u.userId || "").trim().toUpperCase(),
    String(u.fullName || ""),
    String(u.username || ""),
    String(u.mobileNumber || ""),
    String(u.email || ""),
    Number(u.selectedPlanId || 1),
    String(u.role || ""),
    String(u.sponsorId || ""),
    String(u.paymentStatus || "pending"),
    String(u.paymentUtr || ""),
    String(u.payoutUpi || ""),
    String(u.address || ""),
    String(u.state || ""),
    String(u.district || ""),
    String(u.pincode || ""),
    hasPhoto ? "YES" : "NO",
    hasReceipt ? "YES" : "NO",
    String(u.createdAt || ""),
    String(u.verifiedAt || ""),
    u.password && isHashedPassword(String(u.password)) ? String(u.password) : "",
    metaJson,
  ];
}

function computeUsersSnapshotSignature(users: any[]): string {
  return users
    .map((u) => `${u.userId}:${u.paymentStatus}:${u.selectedPlanId}:${u.password ? 1 : 0}:${u.lastLoginAt || ""}:${u.editHistory?.length || 0}`)
    .join("|");
}

async function syncUsersSnapshotToFirestore(force = false): Promise<boolean> {
  if (Date.now() < firestoreQuotaBlockedUntil) return false;
  const fsDb = getServerFirestore();
  if (!fsDb) return false;
  try {
    const users = loadUsersFromDisk();
    if (users.length === 0) return false;
    const sig = computeUsersSnapshotSignature(users);
    if (!force && sig === lastSyncedSnapshotSignature) return true;

    let compactUsers = users.map(compactUserForSnapshot);
    let payload: any = {
      version: 1,
      count: compactUsers.length,
      updatedAt: new Date().toISOString(),
      users: compactUsers,
    };

    // Guard against Firestore 1MB single-document size ceiling
    if (Buffer.byteLength(JSON.stringify(payload), "utf-8") > 780_000) {
      compactUsers = compactUsers.map((u) => ({ ...u, editHistory: [], registrationFormData: undefined }));
      payload.users = compactUsers;
    }
    if (Buffer.byteLength(JSON.stringify(payload), "utf-8") > 780_000) {
      compactUsers = [...compactUsers]
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 600);
      payload.users = compactUsers;
      payload.count = compactUsers.length;
    }

    await setDoc(doc(fsDb, "app_settings", "users_snapshot_v1"), payload, { merge: false });
    lastSyncedSnapshotSignature = sig;
    return true;
  } catch (err: any) {
    if (isQuotaOrResourceExhaustedError(err)) {
      firestoreQuotaBlockedUntil = Date.now() + 10 * 60 * 1000;
    }
    return false;
  }
}

function scheduleSnapshotSyncToFirestore(): void {
  if (snapshotSyncTimer) clearTimeout(snapshotSyncTimer);
  snapshotSyncTimer = setTimeout(() => {
    snapshotSyncTimer = null;
    void syncUsersSnapshotToFirestore(false);
  }, 1800);
}

function loadSheetsQueueIds(): string[] {
  const arr = loadJsonArray(SHEETS_QUEUE_FILE);
  return Array.from(new Set(arr.map((x) => String(x || "").trim().toUpperCase()).filter(Boolean))).slice(0, 500);
}

function saveSheetsQueueIds(ids: string[]): void {
  saveJsonArray(SHEETS_QUEUE_FILE, Array.from(new Set(ids)).slice(0, 500));
}

async function pushUsersToAppsScriptWebhook(
  usersToPush: any[],
  opts: { overrideWebhookUrl?: string; skipIfAutoDisabled?: boolean } = {}
): Promise<{ ok: boolean; count: number; error?: string }> {
  const cfg = loadSheetsConfigFromDisk();
  const webhookUrl = String(opts.overrideWebhookUrl || cfg.webhookUrl || "").trim();
  if (!webhookUrl) return { ok: false, count: 0, error: "Webhook URL not configured" };
  if (opts.skipIfAutoDisabled !== false && !cfg.autoPushEnabled && !opts.overrideWebhookUrl) {
    return { ok: false, count: 0, error: "Auto-push disabled" };
  }
  const cleanUsers = (usersToPush || []).filter((u) => u && u.userId && !u.isArchived && !isDemoUserId(u.userId));
  if (cleanUsers.length === 0) return { ok: true, count: 0 };

  try {
    const rows = cleanUsers.map(serializeUserForSheetRowServer);
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "iois-platform",
        updatedAt: new Date().toISOString(),
        rows,
      }),
      signal: controller.signal,
    });
    clearTimeout(tid);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const pushedIds = new Set(cleanUsers.map((u) => String(u.userId).trim().toUpperCase()));
    const remainingQueue = loadSheetsQueueIds().filter((id) => !pushedIds.has(id));
    saveSheetsQueueIds(remainingQueue);
    saveSheetsConfigToDisk({
      lastSyncedAt: new Date().toISOString(),
      lastSyncedCount: loadUsersFromDisk().length,
      lastSyncStatus: `Webhook pushed ${cleanUsers.length} row(s)`,
    });
    return { ok: true, count: cleanUsers.length };
  } catch (err: any) {
    const existingQ = loadSheetsQueueIds();
    const failedIds = cleanUsers.map((u) => String(u.userId).trim().toUpperCase());
    saveSheetsQueueIds([...existingQ, ...failedIds]);
    return { ok: false, count: 0, error: err?.message || "Webhook push failed" };
  }
}

async function flushSheetsWebhookQueue(): Promise<void> {
  const cfg = loadSheetsConfigFromDisk();
  if (!cfg.webhookUrl || !cfg.autoPushEnabled) return;
  const queuedIds = loadSheetsQueueIds();
  if (queuedIds.length === 0) return;
  const users = loadUsersFromDisk();
  const qSet = new Set(queuedIds);
  const toPush = users.filter((u) => u && qSet.has(String(u.userId).toUpperCase()));
  if (toPush.length > 0) {
    await pushUsersToAppsScriptWebhook(toPush, { skipIfAutoDisabled: false });
  }
}

function mergeUsersNonDestructive(...lists: any[][]): any[] {
  const map = new Map<string, any>();

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const u of list) {
      if (!u || !u.userId) continue;
      const idUpper = String(u.userId).trim().toUpperCase();
      if (isDemoUserId(idUpper)) continue;

      const cleanInputUser = Array.isArray(u.editHistory)
        ? { ...u, userId: idUpper, editHistory: sanitizeEditHistoryArray(u.editHistory) }
        : { ...u, userId: idUpper };

      const existing = map.get(idUpper);
      if (!existing) {
        map.set(idUpper, cleanInputUser);
        continue;
      }

      const merged: Record<string, any> = { ...existing };
      for (const [k, val] of Object.entries(cleanInputUser)) {
        if (val !== undefined && val !== null && val !== "") {
          merged[k] = val;
        }
      }

      // Preserve approved status unless explicitly rejected
      const isApproved = existing.paymentStatus === "approved" || cleanInputUser.paymentStatus === "approved";
      merged.paymentStatus = isApproved
        ? "approved"
        : cleanInputUser.paymentStatus || existing.paymentStatus || "pending";

      // Preserve media URLs & credentials across partial payloads
      merged.photoUrl =
        cleanInputUser.photoUrl && String(cleanInputUser.photoUrl).trim()
          ? cleanInputUser.photoUrl
          : existing.photoUrl;
      merged.paymentScreenshotUrl =
        cleanInputUser.paymentScreenshotUrl && String(cleanInputUser.paymentScreenshotUrl).trim()
          ? cleanInputUser.paymentScreenshotUrl
          : existing.paymentScreenshotUrl;
      const inPwd = cleanInputUser.password && String(cleanInputUser.password).trim() ? String(cleanInputUser.password).trim() : "";
      const exPwd = existing.password && String(existing.password).trim() ? String(existing.password).trim() : "";
      if (inPwd) {
        merged.password = isHashedPassword(exPwd) && !isHashedPassword(inPwd) ? exPwd : inPwd;
      } else {
        merged.password = exPwd;
      }
      const inVault =
        typeof cleanInputUser.passwordVaultEnc === "string" && cleanInputUser.passwordVaultEnc.startsWith("v1$")
          ? cleanInputUser.passwordVaultEnc
          : "";
      const exVault =
        typeof existing.passwordVaultEnc === "string" && existing.passwordVaultEnc.startsWith("v1$")
          ? existing.passwordVaultEnc
          : "";
      if (inVault) {
        merged.passwordVaultEnc = inVault;
      } else if (exVault) {
        merged.passwordVaultEnc = exVault;
      }
      merged.registrationFormData =
        cleanInputUser.registrationFormData && typeof cleanInputUser.registrationFormData === "object"
          ? { ...(existing.registrationFormData || {}), ...cleanInputUser.registrationFormData }
          : existing.registrationFormData;

      // Union array fields cleanly
      if (Array.isArray(existing.friends) || Array.isArray(cleanInputUser.friends)) {
        merged.friends = Array.from(
          new Set([...(existing.friends || []), ...(cleanInputUser.friends || [])])
        );
      }
      if (Array.isArray(existing.profileLikes) || Array.isArray(cleanInputUser.profileLikes)) {
        merged.profileLikes = Array.from(
          new Set([...(existing.profileLikes || []), ...(cleanInputUser.profileLikes || [])])
        );
      }
      if (Array.isArray(existing.editHistory) || Array.isArray(cleanInputUser.editHistory)) {
        const seenLogs = new Set<string>();
        const combinedLogs: any[] = [];
        for (const item of [...(cleanInputUser.editHistory || []), ...(existing.editHistory || [])]) {
          if (!item) continue;
          const sig = `${item.field}|${item.timestamp}|${item.newValue}`;
          if (!seenLogs.has(sig)) {
            seenLogs.add(sig);
            combinedLogs.push(item);
          }
        }
        merged.editHistory = sanitizeEditHistoryArray(combinedLogs);
      }

      if (Array.isArray(existing.withdrawals) || Array.isArray(cleanInputUser.withdrawals)) {
        const wMap = new Map<string, any>();
        for (const w of [...(existing.withdrawals || []), ...(cleanInputUser.withdrawals || [])]) {
          if (!w || !w.id) continue;
          const prev = wMap.get(w.id);
          if (!prev) {
            wMap.set(w.id, w);
          } else {
            const rank = (s?: string) => (s === "approved" ? 3 : s === "rejected" ? 2 : 1);
            wMap.set(w.id, rank(w.status) >= rank(prev.status) ? { ...prev, ...w } : { ...w, ...prev });
          }
        }
        merged.withdrawals = Array.from(wMap.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      }

      merged.userId = existing.userId || idUpper;
      map.set(idUpper, merged);
    }
  }

  return Array.from(map.values());
}

async function fetchSingleUserFromFirestore(userId: string): Promise<any | null> {
  if (!userId || Date.now() < firestoreQuotaBlockedUntil) return null;
  const fsDb = getServerFirestore();
  if (!fsDb) return null;
  try {
    const cleanId = String(userId).trim().toUpperCase();
    const snap = await Promise.race([
      getDoc(doc(fsDb, "users", cleanId)),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Firestore doc timeout")), 8000)),
    ]);
    if (snap.exists()) {
      let data = snap.data();
      if (data && data.userId && !data.isArchived && !isDemoUserId(data.userId)) {
        data = await hydrateUserMediaFromFirestore(fsDb, data);
        const merged = mergeUsersNonDestructive(loadUsersFromDisk(), [data]);
        saveUsersToDisk(merged);
        return merged.find((u) => String(u.userId).toUpperCase() === cleanId) || data;
      }
    }
  } catch (err: any) {
    if (isQuotaOrResourceExhaustedError(err)) {
      firestoreQuotaBlockedUntil = Date.now() + 10 * 60 * 1000;
    }
  }
  return null;
}

async function fetchSingleUserByUsernameFromFirestore(username: string): Promise<any | null> {
  const cleanLower = String(username || "").trim().toLowerCase().replace(/^@/, "");
  if (!cleanLower || Date.now() < firestoreQuotaBlockedUntil) return null;
  const fsDb = getServerFirestore();
  if (!fsDb) return null;
  try {
    const q = query(collection(fsDb, "users"), where("username", "==", cleanLower), limit(1));
    const snap = await Promise.race([
      getDocs(q),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Firestore username query timeout")), 6000)),
    ]);
    if (!snap.empty) {
      let data = snap.docs[0].data();
      if (data && data.userId && !data.isArchived && !isDemoUserId(data.userId)) {
        data = await hydrateUserMediaFromFirestore(fsDb, data);
        const merged = mergeUsersNonDestructive(loadUsersFromDisk(), [data]);
        saveUsersToDisk(merged);
        return merged.find((u) => String(u.userId).toUpperCase() === String(data.userId).toUpperCase()) || data;
      }
    }
  } catch (err: any) {
    if (isQuotaOrResourceExhaustedError(err)) {
      firestoreQuotaBlockedUntil = Date.now() + 10 * 60 * 1000;
    }
  }
  return null;
}

async function fetchCloudAdminPinHash(forceRefresh = false): Promise<string | null> {
  if (!forceRefresh && cachedCloudAdminPinHash && Date.now() - lastCloudAdminPinFetchAt < 60_000) {
    return cachedCloudAdminPinHash;
  }
  const fsDb = getServerFirestore();
  if (!fsDb) return cachedCloudAdminPinHash;
  try {
    const snap = await Promise.race([
      getDoc(doc(fsDb, "app_settings", "admin_security")),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Admin hash timeout")), 1800)),
    ]);
    lastCloudAdminPinFetchAt = Date.now();
    if (snap.exists()) {
      const data: any = snap.data();
      if (data && typeof data.pinHash === "string" && data.pinHash.startsWith("scrypt$")) {
        cachedCloudAdminPinHash = data.pinHash;
        return cachedCloudAdminPinHash;
      }
    }
  } catch {
    // Non-fatal
  }
  return cachedCloudAdminPinHash;
}

async function syncAdminPinHashToFirestore(): Promise<void> {
  const fsDb = getServerFirestore();
  if (!fsDb) return;
  try {
    const expectedPin = getAdminPin().trim().toUpperCase();
    const isExplicit = hasExplicitAdminPinEnv();
    const docRef = doc(fsDb, "app_settings", "admin_security");
    const snap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Admin sync read timeout")), 6000)),
    ]);
    const existingData: any = snap.exists() ? snap.data() : null;
    const existingHash =
      existingData && typeof existingData.pinHash === "string" && existingData.pinHash.startsWith("scrypt$")
        ? existingData.pinHash
        : "";

    if (isExplicit || !existingHash) {
      if (existingHash && verifyPassword(expectedPin, existingHash)) {
        cachedCloudAdminPinHash = existingHash;
        lastCloudAdminPinFetchAt = Date.now();
        return;
      }
      const nextHash = hashPassword(expectedPin);
      await setDoc(
        docRef,
        {
          pinHash: nextHash,
          source: isExplicit ? "env_secret" : "default",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      cachedCloudAdminPinHash = nextHash;
      lastCloudAdminPinFetchAt = Date.now();
      console.log("[Security] Synced salted scrypt Admin PIN verifier to Firestore vault.");
    } else if (existingHash) {
      cachedCloudAdminPinHash = existingHash;
      lastCloudAdminPinFetchAt = Date.now();
    }
  } catch (err: any) {
    console.warn("[Security] Admin PIN vault sync note:", err?.message || err);
  }
}

async function findSingleUserInFirestoreByIdentifier(identifier: string): Promise<any | null> {
  if (!identifier || Date.now() < firestoreQuotaBlockedUntil) return null;
  const fsDb = getServerFirestore();
  if (!fsDb) return null;

  const raw = String(identifier).trim();
  const cleanLower = raw.toLowerCase().replace(/^@/, "");
  const cleanUpper = raw.toUpperCase();
  const digits = cleanLower.replace(/\D/g, "");

  try {
    const usersCol = collection(fsDb, "users");
    const withTimeout = <T>(p: Promise<T>, ms = 1800): Promise<T> =>
      Promise.race([
        p,
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Firestore query timeout")), ms)),
      ]);

    const candidatePromises: Array<Promise<any | null>> = [];

    if (!cleanLower.includes("@") && !raw.startsWith("@") && cleanLower.length >= 4 && digits.length < 10) {
      candidatePromises.push(
        withTimeout(getDoc(doc(fsDb, "users", cleanUpper))).then((snap) => (snap.exists() ? snap.data() : null))
      );
    }

    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      candidatePromises.push(
        withTimeout(getDocs(query(usersCol, where("mobileNumber", "==", last10), limit(1)))).then((s) =>
          !s.empty ? s.docs[0].data() : null
        )
      );
      candidatePromises.push(
        withTimeout(getDocs(query(usersCol, where("mobileNumber", "==", `+91${last10}`), limit(1)))).then((s) =>
          !s.empty ? s.docs[0].data() : null
        )
      );
    }

    if (cleanLower.includes("@") && !raw.startsWith("@")) {
      candidatePromises.push(
        withTimeout(getDocs(query(usersCol, where("email", "==", cleanLower), limit(1)))).then((s) =>
          !s.empty ? s.docs[0].data() : null
        )
      );
      if (raw !== cleanLower) {
        candidatePromises.push(
          withTimeout(getDocs(query(usersCol, where("email", "==", raw), limit(1)))).then((s) =>
            !s.empty ? s.docs[0].data() : null
          )
        );
      }
    }

    if (cleanLower.length >= 2 && digits.length < 10 && !cleanLower.includes("@")) {
      candidatePromises.push(
        withTimeout(getDocs(query(usersCol, where("username", "==", cleanLower), limit(1)))).then((s) =>
          !s.empty ? s.docs[0].data() : null
        )
      );
    }

    let matchedData: any | null = null;
    if (candidatePromises.length > 0) {
      const settled = await Promise.allSettled(candidatePromises);
      for (const r of settled) {
        if (r.status === "fulfilled" && r.value) {
          matchedData = r.value;
          break;
        }
        if (r.status === "rejected" && isQuotaOrResourceExhaustedError(r.reason)) {
          firestoreQuotaBlockedUntil = Date.now() + 10 * 60 * 1000;
          return null;
        }
      }
    }

    // Only run collection scan if disk was sparse and targeted queries missed
    if (!matchedData && loadUsersFromDisk().length <= 1 && Date.now() >= firestoreQuotaBlockedUntil) {
      const snapAll = await withTimeout(getDocs(usersCol), 2000);
      snapAll.forEach((d) => {
        if (matchedData) return;
        const u: any = d.data();
        if (!u || !u.userId || u.isArchived || isDemoUserId(u.userId)) return;
        const uidMatch = String(u.userId).toLowerCase() === cleanLower;
        const unameMatch = u.username && String(u.username).toLowerCase().replace(/^@/, "") === cleanLower;
        const mobMatch = digits.length >= 10 && String(u.mobileNumber || "").replace(/\D/g, "").endsWith(digits.slice(-10));
        const emailMatch = u.email && String(u.email).trim().toLowerCase() === cleanLower;
        if (uidMatch || unameMatch || mobMatch || emailMatch) {
          matchedData = u;
        }
      });
    }

    if (matchedData && matchedData.userId && !matchedData.isArchived && !isDemoUserId(matchedData.userId)) {
      const cleanId = String(matchedData.userId).trim().toUpperCase();
      matchedData = await hydrateUserMediaFromFirestore(fsDb, matchedData);
      const merged = mergeUsersNonDestructive(loadUsersFromDisk(), [matchedData]);
      saveUsersToDisk(merged);
      return merged.find((u) => String(u.userId).toUpperCase() === cleanId) || matchedData;
    }
  } catch (err: any) {
    if (isQuotaOrResourceExhaustedError(err)) {
      firestoreQuotaBlockedUntil = Date.now() + 10 * 60 * 1000;
    }
  }
  return null;
}

async function ensureServerHydratedIfSparse(): Promise<void> {
  const users = loadUsersFromDisk();
  if (users.length <= 1 && Date.now() >= firestoreQuotaBlockedUntil) {
    await hydrateServerFromFirestoreOnce(false);
  }
}

function readCleanUsersFile(filePath: string): any[] | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((u: any) => u && u.userId && !isDemoUserId(u.userId))
      .map((u: any) =>
        Array.isArray(u.editHistory) ? { ...u, editHistory: sanitizeEditHistoryArray(u.editHistory) } : u
      );
  } catch (err) {
    console.warn(`[Users Read Recovery Note] Could not parse ${filePath}:`, err);
    return null;
  }
}

let cachedArchivedUsersMemory: any[] | null = null;
let userBackupWriteChain: Promise<void> = Promise.resolve();

function loadArchivedUsersFromDisk(): any[] {
  if (cachedArchivedUsersMemory !== null) return [...cachedArchivedUsersMemory];
  const loaded = readCleanUsersFile(DELETED_USERS_FILE) || [];
  cachedArchivedUsersMemory = loaded;
  return [...loaded];
}

function saveArchivedUsersToDisk(archived: any[]): void {
  const copy = Array.isArray(archived) ? [...archived] : [];
  cachedArchivedUsersMemory = copy;
  try {
    writeJsonAtomic(DELETED_USERS_FILE, copy, true);
  } catch (err) {
    console.error("Error writing deleted-users-archive.json:", err);
  }
}

function migratePlaintextPasswordsOnDisk(): void {
  try {
    const users = loadUsersFromDisk();
    let migratedUsersCount = 0;
    const updatedUsers = users.map((u) => {
      if (u && typeof u.password === "string" && u.password.trim() && !isHashedPassword(u.password.trim())) {
        migratedUsersCount++;
        const rawPwd = u.password.trim();
        return {
          ...u,
          password: hashPassword(rawPwd),
          passwordVaultEnc: u.passwordVaultEnc || encryptPasswordForVault(rawPwd),
        };
      }
      return u;
    });
    if (migratedUsersCount > 0) {
      saveUsersToDisk(updatedUsers);
      console.log(`[Security] Auto-hashed ${migratedUsersCount} legacy user password(s) with scrypt.`);
    }

    const archived = loadArchivedUsersFromDisk();
    let migratedArchivedCount = 0;
    const updatedArchived = archived.map((u) => {
      if (u && typeof u.password === "string" && u.password.trim() && !isHashedPassword(u.password.trim())) {
        migratedArchivedCount++;
        const rawPwd = u.password.trim();
        return {
          ...u,
          password: hashPassword(rawPwd),
          passwordVaultEnc: u.passwordVaultEnc || encryptPasswordForVault(rawPwd),
        };
      }
      return u;
    });
    if (migratedArchivedCount > 0) {
      saveArchivedUsersToDisk(updatedArchived);
      console.log(`[Security] Auto-hashed ${migratedArchivedCount} archived user password(s) with scrypt.`);
    }
  } catch (err) {
    console.warn("[Security] Password migration note:", err);
  }
}

const RESERVED_USERNAMES = new Set([
  "admin",
  "root",
  "support",
  "iois",
  "ioisplatform",
  "official",
  "acc",
  "help",
  "master",
  "balvikas",
  "iois999vk01",
  "swaccdk01",
  "vikaskumar",
]);

function normalizeUsernameInput(raw?: any): string {
  if (typeof raw !== "string") return "";
  return raw.trim().toLowerCase().replace(/^@+/, "");
}

function validateUsernameStrict(clean: string): { isValid: boolean; error?: string } {
  if (!clean) {
    return { isValid: false, error: "यूजरनेम दर्ज करना अनिवार्य है।" };
  }
  if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
    return {
      isValid: false,
      error: "यूजरनेम 3 से 20 अक्षरों का होना चाहिए (केवल छोटे अक्षर a-z, अंक 0-9 और अंडरस्कोर _)!",
    };
  }
  if (RESERVED_USERNAMES.has(clean)) {
    return {
      isValid: false,
      error: `यह यूजरनेम "@${clean}" आधिकारिक सिस्टम के लिए आरक्षित है। कृपया कोई दूसरा यूजरनेम चुनें।`,
    };
  }
  return { isValid: true };
}

function isUsernameTakenInRecords(clean: string, excludeUserId?: string): boolean {
  const excludeUpper = excludeUserId ? String(excludeUserId).trim().toUpperCase() : "";
  const allRecords = [...loadUsersFromDisk(), ...loadArchivedUsersFromDisk()];
  return allRecords.some((u) => {
    if (!u) return false;
    const uidUpper = u.userId ? String(u.userId).trim().toUpperCase() : "";
    if (excludeUpper && uidUpper === excludeUpper) return false;
    const uName = normalizeUsernameInput(u.username);
    const uIdLower = u.userId ? String(u.userId).trim().toLowerCase() : "";
    return (uName && uName === clean) || (uIdLower && uIdLower === clean);
  });
}

function collectUsedUsernamesSet(excludeUserId?: string): Set<string> {
  const used = new Set<string>(RESERVED_USERNAMES);
  const excludeUpper = excludeUserId ? String(excludeUserId).trim().toUpperCase() : "";
  for (const u of [...loadUsersFromDisk(), ...loadArchivedUsersFromDisk()]) {
    if (!u) continue;
    const uidUpper = u.userId ? String(u.userId).trim().toUpperCase() : "";
    if (excludeUpper && uidUpper === excludeUpper) continue;
    if (uidUpper) used.add(uidUpper.toLowerCase());
    const uname = normalizeUsernameInput(u.username);
    if (uname && /^[a-z0-9_]{3,20}$/.test(uname)) {
      used.add(uname);
    }
  }
  return used;
}

function generateUniqueUsernameForUser(fullName: string, userId: string, usedSet: Set<string>): string {
  const asciiName = String(fullName || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 14);
  const cleanIdSlug = String(userId || "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  let base = asciiName.length >= 3 ? asciiName : cleanIdSlug;
  if (base.length < 3) {
    base = `member_${Date.now().toString().slice(-4)}`;
  }

  let candidate = base.slice(0, 20);
  if (!usedSet.has(candidate) && validateUsernameStrict(candidate).isValid) {
    usedSet.add(candidate);
    return candidate;
  }

  // Try combining short name prefix + last 4 chars of userId first for cleaner handles
  if (asciiName.length >= 3 && cleanIdSlug.length >= 4) {
    const hybrid = `${asciiName.slice(0, 12)}_${cleanIdSlug.slice(-4)}`.slice(0, 20);
    if (!usedSet.has(hybrid) && validateUsernameStrict(hybrid).isValid) {
      usedSet.add(hybrid);
      return hybrid;
    }
  }

  let suffix = 1;
  while (suffix < 10000) {
    const suffixStr = `_${suffix}`;
    candidate = `${base.slice(0, 20 - suffixStr.length)}${suffixStr}`;
    if (!usedSet.has(candidate) && validateUsernameStrict(candidate).isValid) {
      usedSet.add(candidate);
      return candidate;
    }
    suffix++;
  }

  const fallback = `iois_${Date.now().toString().slice(-6)}`;
  usedSet.add(fallback);
  return fallback;
}

function ensureUniqueUsernamesOnDisk(): void {
  try {
    const users = loadUsersFromDisk();
    const archived = loadArchivedUsersFromDisk();
    const usedSet = new Set<string>(RESERVED_USERNAMES);

    for (const u of [...users, ...archived]) {
      if (u?.userId) {
        usedSet.add(String(u.userId).trim().toLowerCase());
      }
    }

    let updatedCount = 0;
    const normalizedUsers = users.map((u) => {
      if (!u || !u.userId) return u;
      const existingClean = normalizeUsernameInput(u.username);
      const isValidExisting =
        existingClean &&
        /^[a-z0-9_]{3,20}$/.test(existingClean) &&
        !RESERVED_USERNAMES.has(existingClean) &&
        !usedSet.has(existingClean);

      if (isValidExisting) {
        usedSet.add(existingClean);
        if (u.username !== existingClean) {
          updatedCount++;
          return { ...u, username: existingClean };
        }
        return u;
      }

      // If existing username matches user's own lowercase userId and isn't taken by another user's username
      const ownIdLower = String(u.userId).trim().toLowerCase();
      if (existingClean && existingClean === ownIdLower && /^[a-z0-9_]{3,20}$/.test(existingClean) && !RESERVED_USERNAMES.has(existingClean)) {
        const anotherUsesSame = users.some(
          (other) => other && other.userId !== u.userId && normalizeUsernameInput(other.username) === existingClean
        );
        if (!anotherUsesSame) {
          if (u.username !== existingClean) {
            updatedCount++;
            return { ...u, username: existingClean };
          }
          return u;
        }
      }

      const assigned = generateUniqueUsernameForUser(u.fullName || "", u.userId, usedSet);
      updatedCount++;
      return { ...u, username: assigned };
    });

    if (updatedCount > 0) {
      saveUsersToDisk(normalizedUsers);
      console.log(`[Auth] Assigned/normalized unique @username for ${updatedCount} active member(s).`);
    }

    let archivedUpdatedCount = 0;
    const normalizedArchived = archived.map((u) => {
      if (!u || !u.userId) return u;
      const existingClean = normalizeUsernameInput(u.username);
      if (existingClean && /^[a-z0-9_]{3,20}$/.test(existingClean) && !RESERVED_USERNAMES.has(existingClean) && !usedSet.has(existingClean)) {
        usedSet.add(existingClean);
        return u;
      }
      const assigned = generateUniqueUsernameForUser(u.fullName || "", u.userId, usedSet);
      archivedUpdatedCount++;
      return { ...u, username: assigned };
    });

    if (archivedUpdatedCount > 0) {
      saveArchivedUsersToDisk(normalizedArchived);
      console.log(`[Auth] Assigned unique @username for ${archivedUpdatedCount} archived member(s).`);
    }
  } catch (err) {
    console.warn("[Auth] Unique username migration note:", err);
  }
}

function loadUsersFromDisk(): any[] {
  if (cachedUsersMemory !== null) {
    return [...cachedUsersMemory];
  }

  try {
    const primary = readCleanUsersFile(USERS_FILE);
    const backup = readCleanUsersFile(USERS_BACKUP_FILE);

    const archivedIds = new Set(
      loadArchivedUsersFromDisk().map((u: any) => String(u.userId).toUpperCase())
    );

    let resolved: any[] = [];
    if (primary !== null && primary.length > 0) {
      resolved = mergeUsersNonDestructive(backup || [], primary);
    } else if (backup !== null && backup.length > 0) {
      console.warn("[Users Recovery] Primary users.json empty/corrupt — recovering from users-backup.json!");
      resolved = backup;
      writeJsonAtomic(USERS_FILE, resolved, true);
    } else if (primary !== null) {
      resolved = primary;
    } else {
      // Check timestamped backups if both primary & backup missing
      try {
        const files = fs
          .readdirSync(BACKUPS_DIR)
          .filter((f) => f.startsWith("users-") && f.endsWith(".json"))
          .sort()
          .reverse();
        for (const f of files) {
          const snap = readCleanUsersFile(path.join(BACKUPS_DIR, f));
          if (snap && snap.length > 0) {
            console.warn(`[Users Recovery] Restoring from snapshot ${f} (${snap.length} users)`);
            resolved = snap;
            writeJsonAtomic(USERS_FILE, resolved, true);
            writeJsonAtomic(USERS_BACKUP_FILE, resolved, true);
            break;
          }
        }
      } catch {}
    }

    // Also include active snapshot merged safely, excluding archived records
    resolved = resolved.filter(
      (u: any) => u && !u.isArchived && !archivedIds.has(String(u.userId).toUpperCase())
    );
    cachedUsersMemory = resolved;
    return [...resolved];
  } catch (err) {
    console.error("Error reading users from disk:", err);
    return [];
  }
}

function saveUsersToDisk(users: any[], options: { allowShrink?: boolean } = {}): void {
  try {
    const cleanIncoming = Array.isArray(users)
      ? users
          .filter((u: any) => u && u.userId && !u.isArchived && !isDemoUserId(u.userId))
          .map((u: any) =>
            Array.isArray(u.editHistory) ? { ...u, editHistory: sanitizeEditHistoryArray(u.editHistory) } : u
          )
      : [];

    const existing = cachedUsersMemory !== null ? cachedUsersMemory : loadUsersFromDisk();
    const archivedIds = new Set(
      loadArchivedUsersFromDisk().map((u: any) => String(u.userId).toUpperCase())
    );

    // ANTI-WIPE GUARD: Never drop existing members unless explicitly archiving via allowShrink
    const nextList = options.allowShrink
      ? cleanIncoming
      : mergeUsersNonDestructive(existing, cleanIncoming).filter(
          (u: any) => !u.isArchived && !archivedIds.has(String(u.userId).toUpperCase())
        );

    cachedUsersMemory = nextList;
    // Write primary file atomically ONCE synchronously (compact JSON for ~40% smaller & faster I/O)
    writeJsonAtomic(USERS_FILE, nextList, true);

    if (nextList.length > 0) {
      lastBackupAtIso = new Date().toISOString();
      const now = Date.now();
      const shouldWriteSnapshot = now - lastSnapshotTimestamp > 10 * 60 * 1000 || nextList.length > existing.length;
      if (shouldWriteSnapshot) {
        lastSnapshotTimestamp = now;
      }
      const listToBackup = nextList;
      // Queue secondary backup & rolling snapshot writes asynchronously so HTTP responses never block
      userBackupWriteChain = userBackupWriteChain
        .then(async () => {
          await writeJsonAtomicAsync(USERS_BACKUP_FILE, listToBackup, true);
          if (shouldWriteSnapshot) {
            const stamp = new Date().toISOString().replace(/[:.]/g, "-");
            await writeJsonAtomicAsync(path.join(BACKUPS_DIR, `users-${stamp}.json`), listToBackup, true);
            try {
              const snaps = (await fs.promises.readdir(BACKUPS_DIR))
                .filter((f) => f.startsWith("users-") && f.endsWith(".json"))
                .sort()
                .reverse();
              for (const old of snaps.slice(12)) {
                await fs.promises.unlink(path.join(BACKUPS_DIR, old)).catch(() => {});
              }
            } catch {}
          }
        })
        .catch((err) => {
          console.warn("[Async Backup Queue Note]:", err?.message || err);
        });
      scheduleSnapshotSyncToFirestore();
    }
  } catch (err) {
    console.error("Error writing users to disk:", err);
  }
}

async function hydrateServerFromFirestoreOnce(force = false): Promise<{ synced: number; error?: string }> {
  if (force) {
    firestoreQuotaBlockedUntil = 0;
  } else {
    if (Date.now() < firestoreQuotaBlockedUntil) {
      return { synced: loadUsersFromDisk().length, error: "Firestore cooldown active (quota limit protection)" };
    }
    if (Date.now() - lastFirestoreHydrationAt < 120_000 && lastFirestoreHydrationAt > 0) {
      return { synced: loadUsersFromDisk().length };
    }
  }
  if (firestoreHydrationPromise && !force) return firestoreHydrationPromise;

  firestoreHydrationPromise = (async () => {
    const fsDb = getServerFirestore();
    if (!fsDb) return { synced: loadUsersFromDisk().length, error: "Firestore unavailable" };
    try {
      // Sync Google Sheets config from Firestore if disk config is blank
      try {
        const localSheetsCfg = loadSheetsConfigFromDisk();
        if (!localSheetsCfg.spreadsheetId && !localSheetsCfg.webhookUrl) {
          const cfgSnap = await Promise.race([
            getDoc(doc(fsDb, "app_settings", "google_sheets_config")),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000)),
          ]);
          if (cfgSnap && cfgSnap.exists()) {
            saveSheetsConfigToDisk(cfgSnap.data() as Partial<ServerSheetsConfig>);
          }
        }
      } catch {}

      let cloudActive: any[] = [];
      const cloudArchived: any[] = [];
      let usedSingleReadSnapshot = false;

      // 1-READ SNAPSHOT FAST PATH (Saves ~95% Spark Free Tier Firestore reads)
      if (!force) {
        try {
          const snapDoc = await Promise.race([
            getDoc(doc(fsDb, "app_settings", "users_snapshot_v1")),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
          ]);
          if (snapDoc && snapDoc.exists()) {
            const snapData: any = snapDoc.data();
            if (Array.isArray(snapData?.users) && snapData.users.length > 0) {
              cloudActive = snapData.users.filter(
                (u: any) => u && u.userId && !u.isArchived && !isDemoUserId(u.userId)
              );
              usedSingleReadSnapshot = cloudActive.length > 0;
            }
          }
        } catch {}
      }

      // Full collection scan only when forced by Admin or snapshot does not exist yet
      if (!usedSingleReadSnapshot) {
        const snap = await Promise.race([
          getDocs(collection(fsDb, "users")),
          new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Firestore timeout")), 25000)),
        ]);
        snap.forEach((d) => {
          const u = d.data();
          if (!u || !u.userId) return;
          if (isDemoUserId(u.userId)) return;
          if (u.isArchived) {
            cloudArchived.push(u);
          } else {
            cloudActive.push(u);
          }
        });
      }

      lastFirestoreHydrationAt = Date.now();

      if (cloudArchived.length > 0) {
        const curArch = loadArchivedUsersFromDisk();
        saveArchivedUsersToDisk(mergeUsersNonDestructive(curArch, cloudArchived));
      }

      const localDisk = loadUsersFromDisk();

      // Restore split high-res media only when forcing or for users without local media
      const localById = new Map<string, any>();
      for (const lu of localDisk) {
        if (lu?.userId) localById.set(String(lu.userId).toUpperCase(), lu);
      }
      const hydratedCloudActive: any[] = [];
      for (const cu of cloudActive) {
        const key = String(cu.userId).toUpperCase();
        const localRec = localById.get(key);
        const alreadyHasMedia = Boolean(localRec?.photoUrl && localRec?.paymentScreenshotUrl);
        if (!alreadyHasMedia && (!usedSingleReadSnapshot || !localRec) && (cu.hasServerMedia || !cu.photoUrl || !cu.paymentScreenshotUrl)) {
          hydratedCloudActive.push(await hydrateUserMediaFromFirestore(fsDb, cu));
        } else {
          hydratedCloudActive.push(cu);
        }
      }

      const merged = mergeUsersNonDestructive(hydratedCloudActive, localDisk);
      if (merged.length > 0) {
        saveUsersToDisk(merged);
      }

      if (!usedSingleReadSnapshot && merged.length > 0) {
        void syncUsersSnapshotToFirestore(true);
      }

      // Backfill any server-only users cleanly to Firestore in background without blocking API response
      const cloudIds = new Set(cloudActive.map((u) => String(u.userId).toUpperCase()));
      const missingInCloud = localDisk.filter((u) => u?.userId && !cloudIds.has(String(u.userId).toUpperCase()));
      if (missingInCloud.length > 0) {
        void (async () => {
          for (const m of missingInCloud) {
            await syncSingleUserToFirestore(m);
          }
        })();
      }

      void flushSheetsWebhookQueue();

      console.log(
        `[Server Firestore Hydration] Loaded ${cloudActive.length} cloud users (${usedSingleReadSnapshot ? "1-read snapshot" : "full collection"}), total merged: ${merged.length}`
      );
      return { synced: merged.length };
    } catch (err: any) {
      if (isQuotaOrResourceExhaustedError(err)) {
        firestoreQuotaBlockedUntil = Date.now() + 10 * 60 * 1000;
        console.warn("[Server Firestore Hydration] Daily quota exhausted — using local disk & client backfill until quota resets.");
        return { synced: loadUsersFromDisk().length, error: "resource-exhausted" };
      }
      console.warn("[Server Firestore Hydration Note]:", err?.message || err);
      return { synced: loadUsersFromDisk().length, error: err?.message || "sync failed" };
    } finally {
      firestoreHydrationPromise = null;
    }
  })();

  return firestoreHydrationPromise;
}

function maskMobile(mob?: string): string {
  if (!mob) return "";
  const digits = mob.replace(/\D/g, "");
  if (digits.length < 4) return "******";
  const last4 = digits.slice(-4);
  return `+91 ******${last4}`;
}

function maskEmail(email?: string): string {
  if (!email || !email.includes("@")) return "";
  const [user, domain] = email.split("@");
  const visible = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
  const [domainName, ...domainExt] = (domain || "").split(".");
  const maskedDom = domainName && domainName.length > 2 ? `${domainName[0]}***${domainName[domainName.length - 1]}` : `${domainName || "***"}`;
  return `${visible}@${maskedDom}.${domainExt.join(".")}`;
}

function maskName(name?: string): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => (w.length > 1 ? `${w[0]}${"*".repeat(Math.min(w.length - 1, 4))}` : w))
    .join(" ");
}

// Temporary in-memory tokens for real-identity verified password resets (token -> { userId, expiresAt })
const passwordResetTokens = new Map<string, { userId: string; expiresAt: number }>();

let cachedTicketsMemory: any[] | null = null;
let cachedKnowledgeMemory: any[] | null = null;
let cachedUnansweredMemory: any[] | null = null;
let cachedInterviewsMemory: any[] | null = null;

function loadTicketsFromDisk(): any[] {
  if (cachedTicketsMemory !== null) return [...cachedTicketsMemory];
  try {
    if (!fs.existsSync(TICKETS_FILE)) {
      writeJsonAtomic(TICKETS_FILE, []);
      cachedTicketsMemory = [];
      return [];
    }
    const raw = fs.readFileSync(TICKETS_FILE, "utf-8");
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : [];
    cachedTicketsMemory = arr;
    return [...arr];
  } catch (err) {
    console.error("Error reading tickets from disk:", err);
    return [];
  }
}

function saveTicketsToDisk(tickets: any[]): void {
  const copy = Array.isArray(tickets) ? [...tickets] : [];
  cachedTicketsMemory = copy;
  try {
    writeJsonAtomic(TICKETS_FILE, copy);
  } catch (err) {
    console.error("Error writing tickets to disk:", err);
  }
}

const INITIAL_KNOWLEDGE = [
  {
    id: "k-register",
    question: "रजिस्ट्रेशन कैसे करें? (How to register in IOIS?)",
    answer: "रजिस्ट्रेशन की प्रक्रिया अत्यंत सरल है:\n1. होमपेज या शीर्ष मेन्यू से 'नया सदस्य रजिस्ट्रेशन' (Registration) पर क्लिक करें।\n2. अपना नाम, मोबाइल नंबर, ईमेल और सुरक्षित पासवर्ड दर्ज करें।\n3. 7 में से अपना उपयुक्त प्लान चुनें (Plan 01 ₹10 से Plan 07 ₹999 तक)।\n4. आधिकारिक UPI ID: 8877490845@spicepay (Vikas Kumar) पर भुगतान करें।\n5. 12-अंकों का UTR नंबर दर्ज करें और पेमेंट स्क्रीनशॉट अपलोड करें।\n6. 'पंजीकरण पूर्ण करें' बटन दबाएं। 5 मिनट के भीतर एडमिन द्वारा वेरिफिकेशन पूरा हो जाएगा।",
    category: "Registration",
    createdAt: new Date().toISOString(),
    hits: 0
  },
  {
    id: "k-plans",
    question: "IOIS के 7 प्लान्स और इंसेंटिव क्या हैं?",
    answer: "IOIS में 7 मुख्य प्लान्स उपलब्ध हैं:\n• Plan 01: Bal Vikas Access - ₹10 (70% पेआउट = ₹7 प्रति रेफरल)\n• Plan 02: Youth Skill Access - ₹49 (70% पेआउट = ₹34 प्रति रेफरल)\n• Plan 03: Career & Job Access - ₹99 (65% पेआउट = ₹64 प्रति रेफरल)\n• Plan 04: Family VIP Access - ₹199 (60% पेआउट = ₹119 प्रति रेफरल)\n• Plan 05: Student Elite Access - ₹299 (60% पेआउट = ₹179 प्रति रेफरल)\n• Plan 06: Agency Reseller Hub - ₹499 (55% पेआउट = ₹274 प्रति रेफरल)\n• Plan 07: Master Lifetime Access - ₹999 (50% पेआउट = ₹499 प्रति रेफरल)",
    category: "Plans",
    createdAt: new Date().toISOString(),
    hits: 0
  },
  {
    id: "k-payout",
    question: "पेआउट कैसे और कब प्राप्त होता है?",
    answer: "IOIS में स्मार्ट इंस्टेंट पेआउट प्रोटोकॉल है। जैसे ही आपके द्वारा रेफर किया गया कोई भी व्यक्ति प्लान में वेरिफाई होता है, उसका इंसेंटिव (₹7 से ₹499) तुरंत आपके रजिस्टर्ड UPI ID (PhonePe, GPay, Paytm) में भेज दिया जाता है।",
    category: "Payout",
    createdAt: new Date().toISOString(),
    hits: 0
  },
  {
    id: "k-idcard",
    question: "आधिकारिक डिजिटल ID कार्ड कैसे देखें या डाउनलोड करें?",
    answer: "मेन्यू में 'डिजिटल ID कार्ड' (ID Card) सेक्शन पर जाएं। यहाँ आपका सत्यापित डिजिटल मेंबर ID कार्ड प्रदर्शित होगा। आप 'HD PNG डाउनलोड' या 'प्रिंट' बटन से 1-क्लिक में इसे सेव कर सकते हैं।",
    category: "ID Card",
    createdAt: new Date().toISOString(),
    hits: 0
  },
  {
    id: "k-assessment",
    question: "15-सवाल कौशल साक्षात्कार (Interview Assessment) क्या है?",
    answer: "यह 15 प्रश्नों का एक व्यावहारिक साक्षात्कार है जो आपकी रुचि, उपलब्ध समय और प्राथमिकताओं का विश्लेषण करके आपके लिए सबसे उपयुक्त डिजिटल प्लान और करियर दिशा की अनुशंसा करता है।",
    category: "Interview",
    createdAt: new Date().toISOString(),
    hits: 0
  }
];

function loadKnowledgeFromDisk(): any[] {
  if (cachedKnowledgeMemory !== null) return [...cachedKnowledgeMemory];
  try {
    if (!fs.existsSync(KNOWLEDGE_FILE)) {
      writeJsonAtomic(KNOWLEDGE_FILE, INITIAL_KNOWLEDGE);
      cachedKnowledgeMemory = [...INITIAL_KNOWLEDGE];
      return [...INITIAL_KNOWLEDGE];
    }
    const raw = fs.readFileSync(KNOWLEDGE_FILE, "utf-8");
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : INITIAL_KNOWLEDGE;
    cachedKnowledgeMemory = arr;
    return [...arr];
  } catch (err) {
    console.error("Error reading knowledge from disk:", err);
    return [...INITIAL_KNOWLEDGE];
  }
}

function saveKnowledgeToDisk(items: any[]): void {
  const copy = Array.isArray(items) ? [...items] : [];
  cachedKnowledgeMemory = copy;
  try {
    writeJsonAtomic(KNOWLEDGE_FILE, copy);
  } catch (err) {
    console.error("Error writing knowledge to disk:", err);
  }
}

function loadUnansweredFromDisk(): any[] {
  if (cachedUnansweredMemory !== null) return [...cachedUnansweredMemory];
  try {
    if (!fs.existsSync(UNANSWERED_FILE)) {
      writeJsonAtomic(UNANSWERED_FILE, []);
      cachedUnansweredMemory = [];
      return [];
    }
    const raw = fs.readFileSync(UNANSWERED_FILE, "utf-8");
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : [];
    cachedUnansweredMemory = arr;
    return [...arr];
  } catch (err) {
    console.error("Error reading unanswered questions from disk:", err);
    return [];
  }
}

function saveUnansweredToDisk(items: any[]): void {
  const copy = Array.isArray(items) ? [...items] : [];
  cachedUnansweredMemory = copy;
  try {
    writeJsonAtomic(UNANSWERED_FILE, copy);
  } catch (err) {
    console.error("Error writing unanswered questions to disk:", err);
  }
}

function loadInterviewsFromDisk(): any[] {
  if (cachedInterviewsMemory !== null) return [...cachedInterviewsMemory];
  try {
    if (!fs.existsSync(INTERVIEWS_FILE)) {
      writeJsonAtomic(INTERVIEWS_FILE, []);
      cachedInterviewsMemory = [];
      return [];
    }
    const raw = fs.readFileSync(INTERVIEWS_FILE, "utf-8");
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : [];
    cachedInterviewsMemory = arr;
    return [...arr];
  } catch (err) {
    console.error("Error reading interviews from disk:", err);
    return [];
  }
}

function saveInterviewsToDisk(items: any[]): void {
  const copy = Array.isArray(items) ? [...items] : [];
  cachedInterviewsMemory = copy;
  try {
    writeJsonAtomic(INTERVIEWS_FILE, copy);
  } catch (err) {
    console.error("Error writing interviews to disk:", err);
  }
}

async function sendTelegramUnansweredQuestionAlert(question: string, contextNote?: string): Promise<void> {
  const cfg = loadTelegramConfig();
  if (!cfg.enabled || !cfg.botToken || !cfg.chatId) return;

  const msg = 
`❓ <b>नया सवाल रिपोर्ट | IOIS AI Assistant</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>यूजर द्वारा पूछा गया प्रश्न:</b>
"<b>${escapeTelegramHtml(question)}</b>"
${contextNote ? `📌 <i>संदर्भ: ${escapeTelegramHtml(contextNote)}</i>\n` : ''}
⏰ <b>समय:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
━━━━━━━━━━━━━━━━━━━━
💡 <b>मालिक/एडमिन गाइडेंस:</b>
<i>इस सवाल का सही उत्तर आप एडमिन पैनल के <b>"AI Bot Knowledge"</b> टैब में जोड़ सकते हैं ताकि AI अगली बार से यूजर को बिल्कुल सही उत्तर दे सके!</i>`;

  fetch(`https://api.telegram.org/bot${cfg.botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: cfg.chatId,
      text: msg,
      parse_mode: "HTML",
    }),
  }).then(async (res) => {
    if (res.status === 401) {
      cfg.enabled = false;
      saveTelegramConfig(cfg);
    }
  }).catch(() => {});
}

async function sendTelegramInterviewAlert(report: any): Promise<void> {
  const cfg = loadTelegramConfig();
  if (!cfg.enabled || !cfg.botToken || !cfg.chatId) return;

  const sampleAnswers = (report.answers || [])
    .slice(0, 4)
    .map((a: any, idx: number) => `• <b>Q${idx + 1}:</b> ${escapeTelegramHtml(a.answerText)}`)
    .join("\n");

  const msg = 
`🎯 <b>नया कौशल साक्षात्कार अलर्ट | IOIS Assessment</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>कैंडिडेट:</b> <b>${escapeTelegramHtml(report.candidateName || 'Guest User')}</b>
📱 <b>मोबाइल:</b> <code>${escapeTelegramHtml(report.candidateMobile || 'उपलब्ध नहीं')}</code>
🏆 <b>कुल अंक (Score):</b> <b>${report.totalScore || 0} Points</b>
💎 <b>अनुशंसित प्लान:</b> <b>${escapeTelegramHtml(report.recommendedPlanName || 'Plan 01')}</b>
⏰ <b>समय:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
━━━━━━━━━━━━━━━━━━━━
📋 <b>प्रश्नावली उत्तर (नमूना):</b>
${sampleAnswers}
${(report.answers || []).length > 4 ? `<i>...तथा कुल ${report.answers.length} प्रश्नों के उत्तर दर्ज किए गए।</i>` : ''}`;

  fetch(`https://api.telegram.org/bot${cfg.botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: cfg.chatId,
      text: msg,
      parse_mode: "HTML",
    }),
  }).then(async (res) => {
    if (res.status === 401) {
      cfg.enabled = false;
      saveTelegramConfig(cfg);
    }
  }).catch(() => {});
}

const PLAN_PRICES: Record<number, number> = {
  1: 10,
  2: 49,
  3: 99,
  4: 199,
  5: 299,
  6: 499,
  7: 999,
};

function generateUserIdHelper(fullName: string, planPrice: number, existingUsers: any[]): string {
  const cleanName = fullName.trim().toUpperCase().replace(/[^A-Z\s]/g, "");
  const parts = cleanName.split(/\s+/).filter(Boolean);

  let initials = "XX";
  if (parts.length >= 2) {
    initials = (parts[0][0] || "X") + (parts[parts.length - 1][0] || "X");
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2);
  } else if (parts.length === 1) {
    initials = parts[0][0] + "X";
  }

  const samePlanUsers = existingUsers.filter((u) => {
    const price = PLAN_PRICES[u.selectedPlanId] || 10;
    return price === planPrice;
  });

  const nextCounter = samePlanUsers.length + 1;
  const counterStr = nextCounter < 10 ? `0${nextCounter}` : `${nextCounter}`;

  let finalId = `IOIS${planPrice}${initials}${counterStr}`;
  // Ensure absolute uniqueness
  let counter = nextCounter;
  while (existingUsers.some((u) => u.userId.toUpperCase() === finalId.toUpperCase())) {
    counter++;
    const pad = counter < 10 ? `0${counter}` : `${counter}`;
    finalId = `IOIS${planPrice}${initials}${pad}`;
  }

  return finalId;
}

// Real-Time IST Date, Day and Time Engine for Accurate Live Answers
function getLiveIndianTimeAndDate() {
  const now = new Date();
  const optionsDate: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" };
  const optionsDay: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", weekday: "long" };
  const optionsTime: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };

  const dayEn = new Intl.DateTimeFormat("en-US", optionsDay).format(now);
  const dateEn = new Intl.DateTimeFormat("en-US", optionsDate).format(now);
  const timeStr = new Intl.DateTimeFormat("en-US", optionsTime).format(now);

  const dayMapHi: Record<string, string> = {
    Sunday: "रविवार",
    Monday: "सोमवार",
    Tuesday: "मंगलवार",
    Wednesday: "बुधवार",
    Thursday: "गुरुवार",
    Friday: "शुक्रवार",
    Saturday: "शनिवार",
  };

  const monthMapHi: Record<string, string> = {
    January: "जनवरी",
    February: "फरवरी",
    March: "मार्च",
    April: "अप्रैल",
    May: "मई",
    June: "जून",
    July: "जुलाई",
    August: "अगस्त",
    September: "सितंबर",
    October: "अक्टूबर",
    November: "नवंबर",
    December: "दिसंबर",
  };

  const dayHi = dayMapHi[dayEn] || dayEn;
  let dateHi = dateEn;
  for (const [enM, hiM] of Object.entries(monthMapHi)) {
    if (dateHi.includes(enM)) {
      dateHi = dateHi.replace(enM, hiM);
      break;
    }
  }

  return {
    dayHi,
    dayEn,
    dateHi,
    dateEn,
    timeStr,
    iso: now.toISOString(),
  };
}

const IOIS_SYSTEM_INSTRUCTION = `
You are the Official Smart AI Helpline & Interactive System Navigator for the "IOIS PLATFORM" (Indian Online Income Supporting System), inspired by the direct, accurate, and helpful teaching style of "Chintu AI" on Bal Vikas (https://ioisplatform.github.io/balvikas/).
You speak fluently, warmly, and naturally in Hindi (Devanagari script), Hinglish, and English, matching the user's preferred language and tone.

=======================================================
🚫 CRITICAL FORMATTING RESTRICTIONS (STRICTLY ENFORCED)
=======================================================
1. NEVER USE MARKDOWN ASTERISKS! Do NOT use **bold** or *italic*. Absolute zero asterisks (*) in your response.
2. DO NOT USE MARKDOWN HEADERS (#, ##, ###).
3. DO NOT USE BACKTICKS or code blocks unless explicitly writing programming code.
4. For bullet points, use the standard bullet symbol: •
5. Your text must be 100% clean, clear, readable, and natural plain text without symbols or formatting noise.

=======================================================
🎯 DIRECT ANSWER MANDATE (LIKE CHINTU AI ON BALVIKAS)
=======================================================
- Like Chintu AI on https://ioisplatform.github.io/balvikas/, answer every question with the exact direct factual answer on the very first line!
- No dodging, no preamble, no repetitive greetings before the answer.
- If asked about "Bal Vikas" (बाल विकास): Explain the 700+ page digital book, Chintu AI live cartoon teacher, 3D body parts, pencil tracing slate, and Plan 01 (₹10 lifetime access with ₹7 instant payout).
- If asked any Academic, GK, Math, Science, or General question (e.g., 2+2, भारत की राजधानी, बिहार के मुख्यमंत्री, प्रकाश संश्लेषण, गोदावरी नदी, आदि): State the exact answer immediately on line 1, followed by concise key facts and relevant navigation buttons.
- Always be truthful, accurate, and genuinely helpful.
- MANDATE FOR UNANSWERABLE OR UNKNOWN QUESTIONS: If a user asks a question the system cannot answer or that is completely unknown/unanswerable, you MUST gracefully state that you do not have the information, and offer to help with platform-related queries (such as the 7 master plans, 50%-70% instant payouts, registration steps, digital ID cards, and citizen/RTPS services) along with relevant [[NAV:...]] tags!

=======================================================
🌟 MASTER IDENTITY & MISSION
=======================================================
- IOIS (Indian Online Income Supporting System) is India's premier digital learning, educational guidance, citizen services advisory, and livelihood micro-earning platform.
- You provide 100% accurate, deep, step-by-step guidance on all platform features, academic questions, citizen services, and government schemes.
- CRITICAL NAVIGATION MANDATE: When guiding users or answering any question about an IOIS feature, citizen service, study material, or process, you MUST provide explicit in-app navigation tags so the user can be directly transported to the exact page, form, or section!

=======================================================
🚀 DIRECT IN-APP NAVIGATION PROTOCOL (MANDATORY)
=======================================================
Whenever relevant, append one or more of these navigation tags at the end of your answer (or inline):
• Registration: [[NAV:page:register|नया सदस्य रजिस्ट्रेशन फॉर्म खोलें]]
• Member Login: [[NAV:login:login|सदस्य लॉगिन खोलें]]
• Forgot Password: [[NAV:login:forgot_password|पासवर्ड रीसेट करें]]
• Forgot User ID: [[NAV:login:forgot_user_id|User ID खोजें]]
• 15-Question Skill Assessment: [[NAV:page:assessment|15-सवाल कौशल साक्षात्कार शुरू करें]]
• 7 Master Plans: [[NAV:page:plans|7 मास्टर प्लांस देखें]]
• Select Specific Plan: [[NAV:plan:1|Plan 01 (₹10) चुनें]] to [[NAV:plan:7|Plan 07 (₹999) चुनें]]
• Smart Digital ID Card: [[NAV:page:idcard|डिजिटल ID कार्ड डाउनलोड करें]]
• Student Study, NCERT & Math Formulas: [[NAV:page:student-study|विद्यार्थी शिक्षा व नोट्स हब खोलें]]
• RTPS Citizen Services (Jati, Aay, Niwas, OBC NCL, EWS): [[NAV:page:rtps-services|RTPS नागरिक सेवाएं पोर्टल खोलें]]
• Bihar Jamin Sudhar (Dakhil Kharij / Mutation, Parimarjan, Jamabandi, Bhu Naksha): [[NAV:page:rtps-services|जमीन सुधार व दाखिल खारिज खोलें]]
• Instant 10-Minute Free e-PAN Card: [[NAV:page:rtps-services|इंस्टेंट e-PAN पोर्टल खोलें]]
• Government Welfare Schemes (Ayushman Bharat, PM Kisan, PM Surya Ghar, E-Shram): [[NAV:page:govt-schemes|सरकारी योजनाएं पोर्टल देखें]]
• Live Weather & Rain Alerts: [[NAV:page:weather|लाइव मौसम व वर्षा अलर्ट देखें]]
• 24x7 Live News TV & E-Papers: [[NAV:page:news|24x7 लाइव न्यूज़ टीवी देखें]]
• Daily Vedic Panchang & 12 Rashifal: [[NAV:page:panchang-rashifal|दैनिक पंचांग व राशिफल देखें]]
• Mandi Bhav & Gold/Silver Bullion: [[NAV:page:mandi-market|मंडी भाव व सोना-चांदी दरें देखें]]
• Govt & Private Job Alerts: [[NAV:page:jobs|सरकारी व प्राइवेट जॉब अलर्ट देखें]]
• Instant Payout Calculator: [[NAV:page:calculator|पेआउट व आय कैलकुलेटर खोलें]]
• Entertainment & Community Hub: [[NAV:page:entertainment|मनोरंजन व मीडिया हब खोलें]]
• Parents Guide: [[NAV:page:parents|अभिभावक गाइड पढ़ें]]
• Official WhatsApp Support: [[NAV:whatsapp:918877490845|व्हाट्सएप पर सहायता लें (+91 8877490845)]]
• Telegram Official Channel: [[NAV:external:https://t.me/ioisplatform|टेलीग्राम चैनल @ioisplatform]]

=======================================================
💎 THE 7 MASTER PLANS & 50%-70% INSTANT PAYOUTS
=======================================================
• Plan 01: Bal Vikas Access - ₹10 (₹7 Instant Payout - 70%) -> NCERT Class 1-5 PDFs, Worksheets, Bal Vikas 700+ Book & Chintu AI.
• Plan 02: Youth Skill Access - ₹49 (₹34 Instant Payout - 70%) -> Digital Literacy, Typing, Basic IT.
• Plan 03: Career & Job Access - ₹99 (₹64 Instant Payout - 65%) -> Resume/CV templates, Interview Q&A.
• Plan 04: Family VIP Access - ₹199 (₹119 Instant Payout - 60%) -> Citizen services assistance + Multi-device.
• Plan 05: Student Elite Access - ₹299 (₹179 Instant Payout - 60%) -> Full NCERT 6-12, Math Formulas, Board Prep.
• Plan 06: Agency Reseller Hub - ₹499 (₹274 Instant Payout - 55%) -> Sub-agent onboarding, Marketing kits.
• Plan 07: Master Lifetime Access - ₹999 (₹499 Instant Payout - 50%) -> All plans unlocked + Lifetime VIP updates.

=======================================================
📚 SPECIAL EDUCATION, GK & CAREER GUIDELINES
=======================================================
• Bal Vikas & Chintu AI:
  - बाल विकास (ioisplatform.github.io/balvikas) में 700+ पृष्ठों की सम्पूर्ण डिजिटल पुस्तक है जिसमें अ से ज्ञ, A-Z, 1-100 गिनती, बारहखड़ी, 3D मानव शरीर रचना और डिजिटल पेंसिल ट्रेसिंग शामिल है।
  - चिंटू AI लाइव शिक्षक बच्चों को आवाज़ के साथ पढ़ना व लिखना सिखाता है।
• Rivers of India:
  - गोदावरी नदी (Godavari River): उद्गम महाराष्ट्र के नासिक जिले के त्र्यंबकेश्वर (Trimbakeshwar / ब्रह्मगिरि पर्वत) से होता है। इसे 'दक्षिण गंगा' या 'वृद्ध गंगा' कहते हैं। लंबाई 1,465 किमी है।
  - गंगा नदी: गंगोत्री हिमनद (भागीरथी), उत्तराखंड।
  - नर्मदा नदी: अमरकंटक, मध्य प्रदेश।
  - कृष्णा नदी: महाबलेश्वर, महाराष्ट्र।
• 15-Question Skill Assessment Test:
  - 4 श्रेणियां: डिजिटल साक्षरता, संचार कौशल, समस्या निवारण, करियर लक्ष्य। 15/15 स्कोर करने पर Plan 07 अनुशंसित।
• Scholarship & Bonafide Certificate:
  - NSP (scholarships.gov.in) व बिहार Post-Matric PMS (pmsonline.bih.nic.in) हेतु बोनाफाइड सर्टिफिकेट अनिवार्य है।
  - कन्या उत्थान योजना: 10वीं ₹10,000, 12वीं ₹25,000, स्नातक ₹50,000।
• Instant Free e-PAN Card:
  - eportal.incometax.gov.in पर Instant e-PAN में आधार नंबर व OTP से 10 मिनट में 100% फ्री e-PAN बनता है।

=======================================================
💳 OFFICIAL PAYMENT & CONTACT
=======================================================
- Official UPI ID: 8877490845@spicepay (Vikas Kumar)
- WhatsApp Support: +91 8877490845
- Telegram: @ioisplatform
- Email: ioisplatform@gmail.com
- Support Hours: 24x7 All India Helpdesk
`;

// Helper to sanitize any raw text and remove all asterisks and unwanted formatting symbols
function cleanBotReply(raw: string): string {
  if (!raw) return "";
  let text = raw;
  // Remove markdown bold asterisks: **text** -> text
  text = text.replace(/\*\*(.*?)\*\*/g, "$1");
  // Remove markdown single asterisks: *text* -> text
  text = text.replace(/\*([^\*\n]+)\*/g, "$1");
  // Remove leftover multiple asterisks
  text = text.replace(/\*{2,}/g, "");
  // Replace starting bullet asterisks with clean bullet symbol
  text = text.replace(/^[\*]\s+/gm, "• ");
  // Remove any remaining stray asterisks
  text = text.replace(/\*/g, "");
  // Remove markdown headers (#, ##, ###)
  text = text.replace(/^#{1,6}\s*/gm, "");
  // Remove backticks
  text = text.replace(/`{1,3}/g, "");
  // Clean markdown links [text](url) -> text (url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
  return text.trim();
}

function cleanSearchQuery(text: string): string {
  const q = text
    .replace(/(के बारे में|संक्षेप में|विस्तार से|बताओ|बताइए|कब है|क्या है|कहा है|कहाँ है|किसे कहते हैं|की जानकारी|जानकारी दो|जानकारी दीजिए|कब मनाया जाता है|what is|tell me about|who is|when is|briefly|in short)/gi, "")
    .replace(/[?।!,]/g, "")
    .trim();
  return q || text.replace(/[?।!,]/g, "").trim();
}

function isRelevantWikiResult(query: string, title: string, extract: string): boolean {
  const stop = new Set(["के", "की", "का", "में", "से", "को", "पर", "और", "एवं", "प्रमुख", "मुख्य", "बारे", "एक", "the", "of", "in", "and", "for", "to", "a", "an"]);
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !stop.has(w));
  if (words.length === 0) return true;
  const hay = `${title} ${extract.slice(0, 220)}`.toLowerCase();
  const titleLower = title.toLowerCase();
  return words.some((w) => titleLower.includes(w)) || words.filter((w) => hay.includes(w)).length >= Math.min(2, words.length);
}

async function performLiveWebResearch(rawQuery: string): Promise<{
  reply: string;
  grounded: boolean;
  searchQueries: string[];
  sources: Array<{ title: string; uri: string }>;
} | null> {
  try {
    const cleanQ = cleanSearchQuery(rawQuery);
    if (!cleanQ || cleanQ.length < 2) return null;

    // 1. Try Hindi Wikipedia search
    const hiSearchUrl = `https://hi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQ)}&format=json&utf8=1`;
    const hiSearchRes = await fetch(hiSearchUrl, { headers: { "User-Agent": "IOIS-LiveResearch/1.0 (ioisplatform@gmail.com)" } });
    if (hiSearchRes.ok) {
      const hiSearchData: any = await hiSearchRes.json();
      const hit = hiSearchData.query?.search?.[0];
      if (hit && hit.title) {
        const sumUrl = `https://hi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`;
        const sumRes = await fetch(sumUrl, { headers: { "User-Agent": "IOIS-LiveResearch/1.0 (ioisplatform@gmail.com)" } });
        if (sumRes.ok) {
          const sumData: any = await sumRes.json();
          if (sumData.extract && sumData.extract.length > 25 && isRelevantWikiResult(cleanQ, sumData.title || hit.title, sumData.extract)) {
            const rawSentences = sumData.extract.split(". ").map((l: string) => l.trim()).filter((l: string) => l.length > 0);
            let formatted = `${rawSentences[0]}.`;
            if (rawSentences.length > 1) {
              formatted += "\n\nमुख्य विवरण व ऐतिहासिक तथ्य:\n";
              for (let i = 1; i < Math.min(rawSentences.length, 6); i++) {
                let s = rawSentences[i];
                if (!s.endsWith(".")) s += ".";
                formatted += `• ${s}\n`;
              }
            }
            formatted += `\n[[NAV:page:student-study|विद्यार्थी शिक्षा व अध्ययन हब खोलें]]`;

            return {
              reply: cleanBotReply(formatted),
              grounded: true,
              searchQueries: [cleanQ],
              sources: [{
                title: `${sumData.title || hit.title} (आधिकारिक विकिपीडिया संदर्भ)`,
                uri: sumData.content_urls?.desktop?.page || `https://hi.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`
              }]
            };
          }
        }
      }
    }

    // 2. Try English Wikipedia search as fallback
    const enSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQ)}&format=json&utf8=1`;
    const enSearchRes = await fetch(enSearchUrl, { headers: { "User-Agent": "IOIS-LiveResearch/1.0 (ioisplatform@gmail.com)" } });
    if (enSearchRes.ok) {
      const enSearchData: any = await enSearchRes.json();
      const hit = enSearchData.query?.search?.[0];
      if (hit && hit.title) {
        const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`;
        const sumRes = await fetch(sumUrl, { headers: { "User-Agent": "IOIS-LiveResearch/1.0 (ioisplatform@gmail.com)" } });
        if (sumRes.ok) {
          const sumData: any = await sumRes.json();
          if (sumData.extract && sumData.extract.length > 25 && isRelevantWikiResult(cleanQ, sumData.title || hit.title, sumData.extract)) {
            const rawSentences = sumData.extract.split(". ").map((l: string) => l.trim()).filter((l: string) => l.length > 0);
            let formatted = `${rawSentences[0]}.`;
            if (rawSentences.length > 1) {
              formatted += "\n\nKey Research Facts:\n";
              for (let i = 1; i < Math.min(rawSentences.length, 5); i++) {
                let s = rawSentences[i];
                if (!s.endsWith(".")) s += ".";
                formatted += `• ${s}\n`;
              }
            }
            formatted += `\n[[NAV:page:student-study|विद्यार्थी सामान्य ज्ञान हब खोलें]]`;

            return {
              reply: cleanBotReply(formatted),
              grounded: true,
              searchQueries: [cleanQ],
              sources: [{
                title: `${sumData.title || hit.title} (Wikipedia Reference)`,
                uri: sumData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`
              }]
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn("Live web research error:", err);
  }
  return null;
}

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable gzip/brotli compression across Vite dev modules, API routes, and prod assets
  app.use(compression({ threshold: 1024 }));

  // Support large JSON payloads for screenshots & photo uploads (up to 50MB)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Route: Health Check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: Safe Google Maps Platform Demo/Runtime Public Key Config
  app.get("/api/maps/config", (_req: Request, res: Response) => {
    const apiKey =
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      "";
    res.json({ apiKey: apiKey.trim() });
  });

  const getTodayServerDateKey = (): string => {
    const now = new Date();
    try {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(now);
      const y = parts.find((p) => p.type === "year")?.value;
      const m = parts.find((p) => p.type === "month")?.value;
      const d = parts.find((p) => p.type === "day")?.value;
      if (y && m && d) return `${y}-${m}-${d}`;
    } catch {}
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const y = ist.getUTCFullYear();
    const m = String(ist.getUTCMonth() + 1).padStart(2, "0");
    const d = String(ist.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const LEGACY_PAST_SLIDE_IDS = new Set([
    "slide-02-dhanteras",
    "slide-03-diwali",
    "slide-04-govardhan",
    "slide-05-bhaidooj",
    "slide-06-chhath",
  ]);

  const SERVER_CATALOG_FESTIVAL_CUTOFFS: Record<string, string> = {
    "dhanteras-2026": "2026-11-06",
    "diwali-2026": "2026-11-08",
    "govardhan-2026": "2026-11-10",
    "bhaidooj-2026": "2026-11-12",
    "chhath-2026": "2026-11-16",
    "tulsi-vivah-2026": "2026-11-21",
    "dev-deepawali-2026": "2026-11-25",
    "gita-jayanti-2026": "2026-12-20",
    "winter-festive-2026": "2026-12-26",
    "newyear-2027": "2027-01-02",
    "makar-sankranti-2027": "2027-01-15",
    "republic-day-2027": "2027-01-26",
    "vasant-panchami-2027": "2027-02-12",
    "mahashivaratri-2027": "2027-03-07",
    "holi-2027": "2027-03-23",
    "navratri-ramnavami-2027": "2027-04-16",
    "independence-day-2027": "2027-08-16",
    "diwali-2027": "2027-11-04",
  };

  const SERVER_PAST_2026_KEYWORD_CUTOFFS: Array<{ cutoff: string; pattern: RegExp }> = [
    { cutoff: "2026-11-06", pattern: /(धनतेरस|dhanteras)/i },
    { cutoff: "2026-11-08", pattern: /(दीपावली|दिवाली|diwali|deepawali)/i },
    { cutoff: "2026-11-10", pattern: /(गोवर्धन|अन्नकूट|govardhan|annakoot)/i },
    { cutoff: "2026-11-12", pattern: /(भाई दूज|भैया दूज|bhaidooj|bhai dooj)/i },
    { cutoff: "2026-11-16", pattern: /(छठ|छठी मैया|chhath|nahay-khay|sandhya arghya|usha arghya)/i },
  ];

  const isExpiredServerFestivalItem = (item: any, todayKey: string): boolean => {
    if (!item || typeof item !== "object") return true;
    if (item.id && LEGACY_PAST_SLIDE_IDS.has(item.id)) return true;
    if (item.endDate && /^\d{4}-\d{2}-\d{2}$/.test(item.endDate) && item.endDate < todayKey) return true;
    if (item.festivalId && SERVER_CATALOG_FESTIVAL_CUTOFFS[item.festivalId] && SERVER_CATALOG_FESTIVAL_CUTOFFS[item.festivalId] < todayKey) {
      return true;
    }
    const hasFutureExplicitEnd = Boolean(item.endDate && /^\d{4}-\d{2}-\d{2}$/.test(item.endDate) && item.endDate >= todayKey);
    if (hasFutureExplicitEnd) return false;
    const searchable = `${item.id || ""} ${item.festivalName || ""} ${item.title || ""} ${item.subtitle || ""} ${item.celebrationHeadline || ""} ${item.tag || ""} ${item.badgeText || ""}`;
    for (const rule of SERVER_PAST_2026_KEYWORD_CUTOFFS) {
      if (todayKey > rule.cutoff && rule.pattern.test(searchable)) {
        return true;
      }
    }
    return false;
  };

  // API Route: Home & Dashboard Celebration Popups (Admin 7-Slot Pop Effect System)
  app.get("/api/home-popups", (_req: Request, res: Response) => {
    const todayKey = getTodayServerDateKey();
    const raw = loadJsonArray(HOME_POPUPS_FILE);
    const photos = raw.filter((item: any) => !isExpiredServerFestivalItem(item, todayKey));
    if (photos.length !== raw.length) {
      try {
        saveJsonArray(HOME_POPUPS_FILE, photos);
      } catch {}
    }
    res.json({ success: true, photos });
  });

  app.post("/api/home-popups", (req: Request, res: Response) => {
    if (!requireAdminRequest(req, res)) return;
    try {
      const todayKey = getTodayServerDateKey();
      const incoming = (Array.isArray(req.body?.photos) ? req.body.photos.slice(0, 7) : []).filter(
        (item: any) => !isExpiredServerFestivalItem(item, todayKey)
      );
      saveJsonArray(HOME_POPUPS_FILE, incoming);
      res.json({ success: true, photos: incoming });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || "Failed to save popups" });
    }
  });

  // API Route: Homepage Banners & Slider System
  app.get("/api/home-sliders", (_req: Request, res: Response) => {
    try {
      if (!fs.existsSync(HOME_SLIDERS_FILE)) {
        return res.json({ success: true, slides: null });
      }
      const todayKey = getTodayServerDateKey();
      const raw = loadJsonArray(HOME_SLIDERS_FILE);
      const slides = raw.filter((s: any) => !isExpiredServerFestivalItem(s, todayKey));
      if (slides.length !== raw.length) {
        try {
          saveJsonArray(HOME_SLIDERS_FILE, slides);
        } catch {}
      }
      res.json({ success: true, slides: slides.length > 0 ? slides : null });
    } catch {
      res.json({ success: true, slides: null });
    }
  });

  app.post("/api/home-sliders", (req: Request, res: Response) => {
    if (!requireAdminRequest(req, res)) return;
    try {
      const todayKey = getTodayServerDateKey();
      const incoming = (Array.isArray(req.body?.slides) ? req.body.slides : []).filter(
        (s: any) => !isExpiredServerFestivalItem(s, todayKey)
      );
      saveJsonArray(HOME_SLIDERS_FILE, incoming);
      res.json({ success: true, slides: incoming });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || "Failed to save sliders" });
    }
  });

  // In-memory cache for live news & background warmer
  let cachedNewsArticles: any[] = [];
  let lastNewsFetchTimestamp = 0;
  let liveNewsRefreshPromise: Promise<{ articles: any[]; fromCache: boolean; fallback?: boolean }> | null = null;

  const FALLBACK_LIVE_NEWS = [
    {
      id: 'art-1',
      title: 'डिजिटल इंडिया व ग्रामीण स्वरोजगार में युवाओं के लिए नए इंसेंटिव पैकेज की घोषणा',
      category: 'jobs',
      source: 'दैनिक जागरण',
      time: '15 मिनट पहले',
      summary: 'केंद्र व राज्य सरकारों ने डिजिटल साक्षरता और ऑनलाइन माइक्रो-अर्निंग योजनाओं के लिए नए पोर्टल लॉन्च किए हैं।',
      readTime: '2 min read',
      link: 'https://news.google.com'
    },
    {
      id: 'art-2',
      title: 'खरीफ फसलों की नई एमएसपी और प्रमुख मंडियों में गेहूं-सरसों की जोरदार आवक',
      category: 'kisan',
      source: 'कृषि जागरण',
      time: '35 मिनट पहले',
      summary: 'उत्तर प्रदेश, बिहार और मध्य प्रदेश की कृषि उपज मंडियों में दालों व तिलहन के दामों में स्थिरता देखी जा रही है।',
      readTime: '3 min read',
      link: 'https://news.google.com'
    },
    {
      id: 'art-3',
      title: 'सोने और चांदी के भाव में स्थिरता, अंतरराष्ट्रीय बाजार में बुलियन डिमांड बढ़ी',
      category: 'business',
      source: 'इकोनॉमिक टाइम्स',
      time: '1 घंटा पहले',
      summary: '24 कैरेट सोने की कीमत और चांदी के भाव में मजबूती का रुख जारी है।',
      readTime: '2 min read',
      link: 'https://news.google.com'
    }
  ];

  async function refreshLiveNewsCache(): Promise<{ articles: any[]; fromCache: boolean; fallback?: boolean }> {
    const now = Date.now();
    if (cachedNewsArticles.length > 0 && now - lastNewsFetchTimestamp < 90_000) {
      return { articles: cachedNewsArticles, fromCache: true };
    }
    if (liveNewsRefreshPromise) return liveNewsRefreshPromise;

    liveNewsRefreshPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3200);
        const response = await fetch("https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi", {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) IOIS-News/1.0" },
        });
        clearTimeout(timeout);

        if (!response.ok) throw new Error("Upstream RSS status not ok");
        const xml = await response.text();

        const items: any[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        let idCounter = 1;
        const parseNow = Date.now();

        while ((match = itemRegex.exec(xml)) !== null && items.length < 30) {
          const itemContent = match[1];
          const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemContent);
          const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemContent);
          const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);
          const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(itemContent);

          let rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
          const link = linkMatch ? linkMatch[1].trim() : "https://news.google.com";
          const pubDateStr = pubDateMatch ? pubDateMatch[1].trim() : "";
          const source = sourceMatch ? sourceMatch[1].trim() : "राष्ट्रीय समाचार फ़ीड";

          if (rawTitle.includes(" - ")) {
            const parts = rawTitle.split(" - ");
            if (parts.length > 1) {
              rawTitle = parts.slice(0, -1).join(" - ").trim();
            }
          }

          if (!rawTitle) continue;

          let category = "national";
          const lower = rawTitle.toLowerCase();
          if (/नौकरी|भर्ती|परीक्षा|रिजल्ट|एडमिट|cgl|upsc|bpsc|ssc|वैकेंसी|फॉर्म|चयन/.test(lower)) {
            category = "jobs";
          } else if (/सोना|चांदी|बाजार|सेंसेक्स|रुपया|शेयर|बैंक|बजट|जीएसटी|व्यापार|कारोबार|कंपनी|टाटा|अंबानी/.test(lower)) {
            category = "business";
          } else if (/किसान|मौसम|बारिश|फसल|एमएसपी|मंडी|गेहूं|धान|खाद|सिंचाई|कृषि|तापमान/.test(lower)) {
            category = "kisan";
          } else if (/ai|टेक|मोबाइल|स्मार्टफोन|गूगल|इंटरनेट|कंप्यूटर|सॉफ्टवेयर|डिजिटल|5g/.test(lower)) {
            category = "tech";
          }

          let timeLabel = "कुछ समय पहले";
          if (pubDateStr) {
            try {
              const pubTime = new Date(pubDateStr).getTime();
              const diffMin = Math.max(1, Math.floor((parseNow - pubTime) / 60000));
              if (diffMin < 60) timeLabel = `${diffMin} मिनट पहले`;
              else if (diffMin < 1440) timeLabel = `${Math.floor(diffMin / 60)} घंटे पहले`;
              else timeLabel = `${Math.floor(diffMin / 1440)} दिन पहले`;
            } catch {}
          }

          items.push({
            id: `live-rss-${idCounter++}`,
            title: rawTitle,
            category,
            source,
            time: timeLabel,
            summary: `${source} द्वारा जारी ताजा खबर: ${rawTitle}। संपूर्ण विवरण व विश्लेषण के लिए क्लिक करें।`,
            readTime: "2 min read",
            link,
          });
        }

        if (items.length > 0) {
          cachedNewsArticles = items;
          lastNewsFetchTimestamp = parseNow;
          return { articles: items, fromCache: false };
        }
        throw new Error("No items parsed");
      } catch {
        if (cachedNewsArticles.length > 0) {
          return { articles: cachedNewsArticles, fromCache: true, fallback: true };
        }
        return { articles: FALLBACK_LIVE_NEWS, fromCache: false, fallback: true };
      } finally {
        liveNewsRefreshPromise = null;
      }
    })();

    return liveNewsRefreshPromise;
  }

  // API Route: Live Real News Feed from Live RSS APIs (Cached & pre-warmed)
  app.get("/api/live-news", async (_req: Request, res: Response) => {
    const result = await refreshLiveNewsCache();
    return res.json({
      success: true,
      count: result.articles.length,
      articles: result.articles,
      fromCache: result.fromCache,
      ...(result.fallback ? { fallback: true } : {}),
    });
  });

  // In-memory cache for real-time recruitment / job updates
  let cachedLiveJobs: any[] = [];
  let lastLiveJobsFetchTimestamp = 0;
  let liveJobsRefreshPromise: Promise<{ jobs: any[]; todayIst: string; fromCache: boolean; updatedAt: string }> | null = null;

  const getTodayIstIsoKey = (): string => {
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
    } catch {
      return getTodayServerDateKey();
    }
  };

  async function refreshLiveJobsCache(): Promise<{ jobs: any[]; todayIst: string; fromCache: boolean; updatedAt: string }> {
    const now = Date.now();
    const todayIst = getTodayIstIsoKey();

    if (cachedLiveJobs.length > 0 && now - lastLiveJobsFetchTimestamp < 90_000) {
      const activeCached = cachedLiveJobs.filter((job) => !job.lastDateIso || job.lastDateIso >= todayIst);
      return {
        jobs: activeCached,
        todayIst,
        fromCache: true,
        updatedAt: new Date(lastLiveJobsFetchTimestamp).toISOString(),
      };
    }
    if (liveJobsRefreshPromise) return liveJobsRefreshPromise;

    liveJobsRefreshPromise = (async () => {
      const liveItems: any[] = [];
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3200);
        const rssUrl =
          "https://news.google.com/rss/search?q=%E0%A4%B8%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80+%E0%A4%AD%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A5%80+OR+%E0%A4%A8%E0%A4%88+%E0%A4%B5%E0%A5%88%E0%A4%95%E0%A5%87%E0%A4%82%E0%A4%B8%E0%A5%80+OR+SSC+OR+RRB+OR+IBPS+OR+UPSC+recruitment&hl=hi&gl=IN&ceid=IN:hi";
        const response = await fetch(rssUrl, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) IOIS-Jobs/1.0" },
        });
        clearTimeout(timeout);

        if (response.ok) {
          const xml = await response.text();
          const itemRegex = /<item>([\s\S]*?)<\/item>/g;
          let match;
          let idx = 1;
          const maxAgeMs = 14 * 24 * 60 * 60 * 1000;
          const parseNow = Date.now();

          while ((match = itemRegex.exec(xml)) !== null && liveItems.length < 10) {
            const itemContent = match[1];
            const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemContent);
            const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemContent);
            const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);
            const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(itemContent);

            let rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
            const link = linkMatch ? linkMatch[1].trim() : "https://ncs.gov.in";
            const pubDateStr = pubDateMatch ? pubDateMatch[1].trim() : "";
            const source = sourceMatch ? sourceMatch[1].trim() : "आधिकारिक रोजगार अपडेट";

            if (rawTitle.includes(" - ")) {
              const parts = rawTitle.split(" - ");
              if (parts.length > 1) {
                rawTitle = parts.slice(0, -1).join(" - ").trim();
              }
            }
            if (!rawTitle) continue;

            let timeLabel = "आज लाइव अपडेट";
            let isRecent = true;
            if (pubDateStr) {
              const pubMs = new Date(pubDateStr).getTime();
              if (!Number.isNaN(pubMs)) {
                const ageMs = parseNow - pubMs;
                if (ageMs > maxAgeMs) {
                  isRecent = false;
                } else {
                  const diffMin = Math.max(1, Math.floor(ageMs / 60000));
                  if (diffMin < 60) timeLabel = `${diffMin} मिनट पहले`;
                  else if (diffMin < 1440) timeLabel = `${Math.floor(diffMin / 60)} घंटे पहले`;
                  else timeLabel = `${Math.floor(diffMin / 1440)} दिन पहले`;
                }
              }
            }
            if (!isRecent) continue;

            const lower = rawTitle.toLowerCase();
            const department = /ssc/.test(lower)
              ? "कर्मचारी चयन आयोग (SSC Live)"
              : /रेलवे|rrb|railway/.test(lower)
                ? "भारतीय रेलवे (RRB Live)"
                : /बैंक|ibps|sbi|rbi/.test(lower)
                  ? "बैंकिंग भर्ती (IBPS / SBI Live)"
                  : /upsc|ias|ips/.test(lower)
                    ? "संघ लोक सेवा आयोग (UPSC Live)"
                    : /पुलिस|constable|si|army|agniveer|defence/.test(lower)
                      ? "रक्षा एवं पुलिस भर्ती (Defence / Police)"
                      : source;

            liveItems.push({
              id: `live-rss-job-${idx++}`,
              title: rawTitle,
              department,
              type: "govt",
              totalPosts: "आधिकारिक नोटिफिकेशन देखें",
              qualification: "पद अनुसार 10वीं / 12वीं / स्नातक",
              ageLimit: "नियमानुसार पात्रता",
              salary: "नियमानुसार सरकारी वेतनमान",
              location: "भारत (India Live)",
              lastDate: "आवेदन सक्रिय / आगामी (Live)",
              statusType: "live",
              publishedAt: timeLabel,
              source,
              applyUrl: link,
              isNew: true,
            });
          }
        }
      } catch {
        // Fallback safely handled on client & below
      }

      if (liveItems.length > 0) {
        cachedLiveJobs = liveItems;
        lastLiveJobsFetchTimestamp = Date.now();
      }

      return {
        jobs: liveItems.length > 0 ? liveItems : cachedLiveJobs,
        todayIst,
        fromCache: false,
        updatedAt: new Date().toISOString(),
      };
    })().finally(() => {
      liveJobsRefreshPromise = null;
    });

    return liveJobsRefreshPromise;
  }

  // API Route: Real-Time Active & Upcoming Recruitment Updates (Cached & pre-warmed)
  app.get("/api/live-jobs", async (_req: Request, res: Response) => {
    const result = await refreshLiveJobsCache();
    return res.json({
      success: true,
      todayIst: result.todayIst,
      jobs: result.jobs,
      fromCache: result.fromCache,
      updatedAt: result.updatedAt,
    });
  });

  // API Route: Get All Users (Privacy-masked public directory + optional server pagination & search)
  app.get("/api/users", (req: Request, res: Response) => {
    let users = loadUsersFromDisk();
    if (users.length <= 1 && !firestoreHydrationPromise && Date.now() >= firestoreQuotaBlockedUntil) {
      void hydrateServerFromFirestoreOnce(false);
    }

    const searchQ = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";
    const statusFilter = typeof req.query.status === "string" ? req.query.status.trim().toLowerCase() : "all";

    if (statusFilter && statusFilter !== "all") {
      users = users.filter((u) => String(u.paymentStatus || "").toLowerCase() === statusFilter);
    }
    if (searchQ) {
      users = users.filter(
        (u) =>
          String(u.userId || "").toLowerCase().includes(searchQ) ||
          String(u.username || "").toLowerCase().includes(searchQ) ||
          String(u.fullName || "").toLowerCase().includes(searchQ) ||
          String(u.state || "").toLowerCase().includes(searchQ) ||
          String(u.district || "").toLowerCase().includes(searchQ)
      );
    }

    const totalCount = users.length;
    const rawPage = req.query.page !== undefined ? Number(req.query.page) : 0;
    const rawLimit = req.query.limit !== undefined ? Number(req.query.limit) : 0;

    let pagedUsers = users;
    let page = 1;
    let limit = totalCount || 50;
    let totalPages = 1;
    let hasMore = false;

    if (Number.isFinite(rawLimit) && rawLimit > 0) {
      limit = Math.min(Math.max(Math.floor(rawLimit), 1), 200);
      page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
      totalPages = Math.max(1, Math.ceil(totalCount / limit));
      const start = (page - 1) * limit;
      pagedUsers = users.slice(start, start + limit);
      hasMore = page < totalPages;
    }

    const isLite = String(req.query.lite || "") === "1";
    const sanitized = pagedUsers.map((u) => compactUserForPublicDirectory(u, { lite: isLite }));
    return sendJsonCompressed(req, res, {
      success: true,
      count: sanitized.length,
      totalCount,
      page,
      limit,
      totalPages,
      hasMore,
      users: sanitized,
    });
  });

  // API Route: On-demand Member High-Res Media (Photo public; Payment Receipt restricted to Owner/Admin)
  app.get("/api/users/:userId/media", async (req: Request, res: Response) => {
    try {
      const cleanUpper = String(req.params.userId || "").trim().toUpperCase();
      if (!cleanUpper) {
        return res.status(400).json({ success: false, error: "User ID required" });
      }
      const users = loadUsersFromDisk();
      let matched = users.find((u) => u && String(u.userId || "").toUpperCase() === cleanUpper);
      if (!matched) {
        matched = (await fetchSingleUserFromFirestore(cleanUpper)) || undefined;
      }
      if (!matched) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      if ((!matched.photoUrl || !matched.paymentScreenshotUrl) && Date.now() >= firestoreQuotaBlockedUntil) {
        const fsDb = getServerFirestore();
        if (fsDb) {
          matched = await hydrateUserMediaFromFirestore(fsDb, matched);
        }
      }
      const canViewReceipt = isSelfOrAdminAuthorized(req, matched.userId, matched);
      return sendJsonCompressed(req, res, {
        success: true,
        userId: matched.userId,
        photoUrl: matched.photoUrl || "",
        paymentScreenshotUrl: canViewReceipt
          ? matched.paymentScreenshotUrl || matched.registrationFormData?.paymentScreenshotUrl || ""
          : "",
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Media fetch failed" });
    }
  });

  // API Route: Fetch Single User Profile (Supports ?self=1 with Admin/Member auth for full User Dashboard sync)
  app.get("/api/users/profile/:userId", async (req: Request, res: Response) => {
    try {
      const rawId = String(req.params.userId || "").trim();
      const cleanUpper = rawId.replace(/^@/, "").toUpperCase();
      const cleanLower = rawId.toLowerCase().replace(/^@/, "");
      if (!rawId) {
        return res.status(400).json({ success: false, error: "User ID required" });
      }

      let users = loadUsersFromDisk();
      let matched = users.find(
        (u) =>
          u &&
          ((u.userId && String(u.userId).trim().toUpperCase() === cleanUpper) ||
            (u.username && String(u.username).trim().toLowerCase().replace(/^@/, "") === cleanLower))
      );

      if (!matched && (cleanLower === "vikaskumar" || cleanLower === "vikas01")) {
        matched = users.find((u) => u && String(u.userId || "").toUpperCase() === "IOIS999VK01");
      }

      if (!matched) {
        matched = (await fetchSingleUserFromFirestore(cleanUpper)) || undefined;
      }
      if (!matched && cleanLower) {
        matched = (await fetchSingleUserByUsernameFromFirestore(cleanLower)) || undefined;
      }
      if (!matched) {
        await hydrateServerFromFirestoreOnce(false);
        users = loadUsersFromDisk();
        matched = users.find(
          (u) =>
            u &&
            ((u.userId && String(u.userId).trim().toUpperCase() === cleanUpper) ||
              (u.username && String(u.username).trim().toLowerCase().replace(/^@/, "") === cleanLower))
        );
      }

      if (!matched) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      const isSelfAuthorized =
        String(req.query.self || "") === "1" &&
        isSelfOrAdminAuthorized(req, matched.userId, matched);

      if (
        (!matched.photoUrl || (isSelfAuthorized && !matched.paymentScreenshotUrl)) &&
        Date.now() >= firestoreQuotaBlockedUntil
      ) {
        const fsDb = getServerFirestore();
        if (fsDb) {
          matched = await hydrateUserMediaFromFirestore(fsDb, matched);
        }
      }

      const allWithdrawals = loadJsonArray(WITHDRAWALS_FILE).filter(
        (w: any) => w && String(w.userId || "").toUpperCase() === String(matched!.userId).toUpperCase()
      );
      const mergedUser =
        allWithdrawals.length > 0
          ? mergeUsersNonDestructive([matched], [{ userId: matched.userId, withdrawals: allWithdrawals }])[0]
          : matched;

      if (isSelfAuthorized) {
        const safeSelf = sanitizeUserForMember(mergedUser);
        return res.json({ success: true, user: safeSelf, ...safeSelf });
      }

      const publicSafe = compactUserForPublicDirectory(mergedUser);
      return res.json({ success: true, user: publicSafe, ...publicSafe });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to load user profile" });
    }
  });

  // API Route: Secure Admin Portal Login (Rate-limited + Timing-Safe + Cloud scrypt Fallback + Signed 12h HMAC Token)
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      if (isRateLimited(req, "admin-login-fail", 6, 15 * 60 * 1000, false)) {
        return res.status(429).json({
          success: false,
          error: "बहुत अधिक गलत एडमिन लॉगिन प्रयास! सुरक्षा हेतु कृपया 15 मिनट बाद पुनः प्रयास करें।",
        });
      }

      const { adminPin } = req.body || {};
      const cleanPin = String(adminPin || "").trim().toUpperCase();

      let pinMatched = false;
      if (cleanPin) {
        if (hasExplicitAdminPinEnv()) {
          pinMatched = timingSafeStringEqual(cleanPin, getAdminPin().toUpperCase());
        } else {
          const cloudPinHash = cachedCloudAdminPinHash || (await fetchCloudAdminPinHash(false));
          if (cloudPinHash) {
            pinMatched = await verifyPasswordAsync(cleanPin, cloudPinHash);
          } else {
            pinMatched = timingSafeStringEqual(cleanPin, getAdminPin().toUpperCase());
          }
        }
      }

      if (!pinMatched) {
        recordRateLimitHit(req, "admin-login-fail", 15 * 60 * 1000);
        return res.status(401).json({
          success: false,
          error: "गलत एडमिन पासवर्ड! कृपया सही पासवर्ड दर्ज करें।",
        });
      }

      clearRateLimitHits(req, "admin-login-fail");
      const adminToken = signAuthToken({ role: "admin", userId: "ADMIN" }, 12 * 3600);
      return res.json({
        success: true,
        adminToken,
        expiresInSeconds: 12 * 3600,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Admin login failed" });
    }
  });

  // API Route: Admin Full Users List + Deleted Archive Vault (Protected + Pagination + Password Redacted)
  app.post("/api/admin/users-full", async (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { includeMedia = true, forceCloud = false, page, limit, search, status } = req.body || {};

      let users = loadUsersFromDisk();
      let cloudError: string | undefined;

      if (users.length <= 1) {
        const hydration = await Promise.race([
          hydrateServerFromFirestoreOnce(Boolean(forceCloud)),
          new Promise<{ synced: number; error?: string }>((resolve) =>
            setTimeout(() => resolve({ synced: users.length, error: "cloud-background-sync" }), 3500)
          ),
        ]);
        cloudError = hydration.error;
        users = loadUsersFromDisk();
      } else if (forceCloud && Date.now() >= firestoreQuotaBlockedUntil) {
        // Non-blocking background cloud reconciliation when disk already has users
        void hydrateServerFromFirestoreOnce(false);
      }

      let filtered = users;
      const statusStr = typeof status === "string" ? status.trim().toLowerCase() : "all";
      const searchStr = typeof search === "string" ? search.trim().toLowerCase() : "";

      if (statusStr && statusStr !== "all") {
        filtered = filtered.filter((u) => String(u.paymentStatus || "").toLowerCase() === statusStr);
      }
      if (searchStr) {
        filtered = filtered.filter(
          (u) =>
            String(u.userId || "").toLowerCase().includes(searchStr) ||
            String(u.fullName || "").toLowerCase().includes(searchStr) ||
            String(u.mobileNumber || "").includes(searchStr) ||
            String(u.email || "").toLowerCase().includes(searchStr) ||
            String(u.paymentUtr || "").toLowerCase().includes(searchStr)
        );
      }

      const totalCount = filtered.length;
      let paged = filtered;
      let resolvedPage = 1;
      let resolvedLimit = totalCount || 50;
      let totalPages = 1;
      let hasMore = false;

      if (Number(limit) > 0) {
        resolvedLimit = Math.min(Math.max(Math.floor(Number(limit)), 1), 250);
        resolvedPage = Number(page) >= 1 ? Math.floor(Number(page)) : 1;
        totalPages = Math.max(1, Math.ceil(totalCount / resolvedLimit));
        const start = (resolvedPage - 1) * resolvedLimit;
        paged = filtered.slice(start, start + resolvedLimit);
        hasMore = resolvedPage < totalPages;
      }

      const archivedUsers = loadArchivedUsersFromDisk().map(sanitizeUserForAdmin);
      const responseUsers =
        includeMedia === false ? paged.map(stripUserMediaForMetadata) : paged.map(sanitizeUserForAdmin);

      return sendJsonCompressed(req, res, {
        success: true,
        count: responseUsers.length,
        totalCount,
        page: resolvedPage,
        limit: resolvedLimit,
        totalPages,
        hasMore,
        users: responseUsers,
        archivedUsers,
        includeMedia: includeMedia !== false,
        cloudError,
        backupInfo: {
          lastBackupAt: lastBackupAtIso || new Date().toISOString(),
          activeCount: users.length,
          archivedCount: archivedUsers.length,
          firestoreQuotaCooldown: Date.now() < firestoreQuotaBlockedUntil,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to load admin records" });
    }
  });

  // API Route: Secure Admin Password Vault Reveal (Admin Auth + Secure PIN 324215 + Rate Limit)
  app.post("/api/admin/reveal-passwords", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;

      if (isRateLimited(req, "admin-pwd-reveal", 8, 15 * 60 * 1000, false)) {
        return res.status(429).json({
          success: false,
          error: "बहुत अधिक गलत सिक्योर पिन प्रयास! सुरक्षा हेतु कृपया 15 मिनट बाद पुनः प्रयास करें।",
        });
      }

      const rawPin = req.body && typeof req.body === "object" ? String(req.body.securityPin || "").trim() : "";
      if (!rawPin || !timingSafeStringEqual(rawPin, getPasswordRevealPin())) {
        recordRateLimitHit(req, "admin-pwd-reveal", 15 * 60 * 1000);
        return res.status(401).json({
          success: false,
          error: "गलत सिक्योर एडमिन पिन! यूजर पासवर्ड देखने हेतु सही एडमिन पिन दर्ज करें।",
        });
      }

      clearRateLimitHits(req, "admin-pwd-reveal");

      const targetUserId =
        req.body && typeof req.body === "object" && typeof req.body.userId === "string"
          ? req.body.userId.trim().toUpperCase()
          : "";

      const users = loadUsersFromDisk();
      const archived = loadArchivedUsersFromDisk();
      const combined = [...users, ...archived];
      const filtered = targetUserId
        ? combined.filter((u) => u && String(u.userId || "").toUpperCase() === targetUserId)
        : combined;

      const passwords: Record<string, string> = {};
      let revealedCount = 0;

      for (const u of filtered) {
        if (!u || !u.userId) continue;
        const uid = String(u.userId).trim().toUpperCase();
        const plain = decryptPasswordFromVault(u.passwordVaultEnc);
        if (plain !== null && plain !== "") {
          passwords[uid] = plain;
          revealedCount++;
        }
      }

      return sendJsonCompressed(req, res, {
        success: true,
        passwords,
        revealedCount,
        totalUsers: filtered.length,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err?.message || "पासवर्ड वॉल्ट डिक्रिप्ट करने में त्रुटि आई।",
      });
    }
  });

  // API Route: Admin On-Demand Cloud Sync (Also refreshes 1-Read Firestore Snapshot)
  app.post("/api/admin/cloud-sync", async (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const result = await hydrateServerFromFirestoreOnce(true);
      void syncUsersSnapshotToFirestore(true);
      const users = loadUsersFromDisk().map(sanitizeUserForAdmin);
      return sendJsonCompressed(req, res, {
        success: true,
        count: users.length,
        users,
        cloudError: result.error,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Cloud sync failed" });
    }
  });

  // API Routes: Google Sheets Sync Configuration, Sheet-Safe Export & 24x7 Apps Script Webhook Bridge
  app.get("/api/admin/sheets-config", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const config = loadSheetsConfigFromDisk();
      const pendingQueueCount = loadSheetsQueueIds().length;
      return res.json({ success: true, config, pendingQueueCount });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to load Google Sheets config" });
    }
  });

  app.post("/api/admin/sheets-config", async (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const body = req.body || {};
      const allowedKeys: (keyof ServerSheetsConfig)[] = [
        "spreadsheetId",
        "spreadsheetUrl",
        "sheetTitle",
        "tabName",
        "webhookUrl",
        "autoPushEnabled",
        "lastSyncedAt",
        "lastSyncedCount",
        "lastSyncStatus",
      ];
      const patch: Partial<ServerSheetsConfig> = {};
      for (const key of allowedKeys) {
        if (body[key] !== undefined) {
          (patch as any)[key] = body[key];
        }
      }
      const next = saveSheetsConfigToDisk(patch);
      const fsDb = getServerFirestore();
      if (fsDb && Date.now() >= firestoreQuotaBlockedUntil) {
        void setDoc(doc(fsDb, "app_settings", "google_sheets_config"), sanitizeDocForFirestore(next), { merge: true }).catch(() => {});
      }
      return res.json({ success: true, config: next, pendingQueueCount: loadSheetsQueueIds().length });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to save Google Sheets config" });
    }
  });

  app.get("/api/admin/users-for-sheet", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const users = loadUsersFromDisk().map((u) => {
        const clean = compactUserForSnapshot(u);
        return {
          ...clean,
          password: u.password && isHashedPassword(String(u.password)) ? String(u.password) : "",
        };
      });
      return sendJsonCompressed(req, res, {
        success: true,
        count: users.length,
        users,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to prepare users for Google Sheet" });
    }
  });

  app.post("/api/admin/sheets-webhook-sync", async (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const overrideWebhookUrl = typeof req.body?.webhookUrl === "string" ? req.body.webhookUrl.trim() : "";
      if (overrideWebhookUrl) {
        saveSheetsConfigToDisk({ webhookUrl: overrideWebhookUrl });
      }
      const users = loadUsersFromDisk();
      const result = await pushUsersToAppsScriptWebhook(users, {
        overrideWebhookUrl: overrideWebhookUrl || undefined,
        skipIfAutoDisabled: false,
      });
      if (!result.ok) {
        return res.status(400).json({ success: false, error: result.error || "Webhook push failed" });
      }
      return res.json({
        success: true,
        syncedCount: result.count,
        config: loadSheetsConfigFromDisk(),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Webhook sync failed" });
    }
  });

  // API Route: Bulk User Sync (Authenticated only + Privilege-Escalation Hardening)
  app.post("/api/users/sync", (req: Request, res: Response) => {
    try {
      const incomingUsers = req.body.users;
      if (!Array.isArray(incomingUsers)) {
        return res.status(400).json({ success: false, error: "Invalid users array" });
      }

      const isAdmin = isAdminAuthorized(req);
      const existingUsers = loadUsersFromDisk();
      const archivedIds = new Set(
        loadArchivedUsersFromDisk().map((u: any) => String(u.userId).toUpperCase())
      );

      let authorizedIncoming: any[] = [];

      if (isAdmin) {
        authorizedIncoming = incomingUsers
          .filter(
            (u: any) =>
              u && u.userId && !u.isArchived && !isDemoUserId(u.userId) && !archivedIds.has(String(u.userId).toUpperCase())
          )
          .map((u: any) => {
            const rawPwd = u.password ? String(u.password).trim() : "";
            const vaultEnc = rawPwd && !isHashedPassword(rawPwd) ? encryptPasswordForVault(rawPwd) : undefined;
            return {
              ...u,
              ...(rawPwd ? { password: hashPassword(rawPwd) } : {}),
              ...(vaultEnc ? { passwordVaultEnc: vaultEnc } : {}),
            };
          });
      } else {
        const authMember = getAuthenticatedMember(req);
        const sessionHeader = String(req.headers["x-session-token"] || "").trim();

        authorizedIncoming = incomingUsers
          .filter((u: any) => {
            if (!u || !u.userId || u.isArchived || isDemoUserId(u.userId)) return false;
            const cleanUid = String(u.userId).trim().toUpperCase();
            if (archivedIds.has(cleanUid)) return false;
            const existing = existingUsers.find((ex) => String(ex.userId).toUpperCase() === cleanUid);
            if (!existing) return false; // Unprivileged sync cannot invent arbitrary new accounts
            if (authMember && String(authMember.userId).toUpperCase() === cleanUid) return true;
            if (sessionHeader && existing.activeSessionToken && sessionHeader === existing.activeSessionToken) return true;
            return false;
          })
          .map((u: any) => {
            // Strip privileged billing/role/password fields from non-admin sync
            const {
              paymentStatus,
              selectedPlanId,
              verifiedAt,
              rejectionReason,
              password,
              role,
              isArchived,
              ...safeRest
            } = u;
            return safeRest;
          });

        if (authorizedIncoming.length === 0) {
          return res.status(401).json({ success: false, error: "अनधिकृत सिंक प्रयास। कृपया पहले लॉगिन करें।" });
        }
      }

      const merged = mergeUsersNonDestructive(existingUsers, authorizedIncoming);
      saveUsersToDisk(merged);

      if (authorizedIncoming.length > 0) {
        const mergedById = new Map<string, any>(
          merged.map((m) => [String(m.userId).toUpperCase(), m])
        );
        const syncedRecords = authorizedIncoming.map(
          (u) => mergedById.get(String(u.userId).toUpperCase()) || u
        );
        if (Date.now() >= firestoreQuotaBlockedUntil) {
          void (async () => {
            for (const fullRecord of syncedRecords.slice(0, 30)) {
              await syncSingleUserToFirestore(fullRecord);
            }
          })();
        }
        void pushUsersToAppsScriptWebhook(syncedRecords.slice(0, 50));
      }

      const sanitizedMerged = merged.map((u) => compactUserForPublicDirectory(u));
      return sendJsonCompressed(req, res, { success: true, count: sanitizedMerged.length, users: sanitizedMerged });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  // API Route: Get Archived / Soft-Deleted Users Vault (Admin Only)
  app.get("/api/users/archive", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const archived = loadArchivedUsersFromDisk().map(sanitizeUserForAdmin);
      return res.json({ success: true, count: archived.length, archivedUsers: archived });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to load archive" });
    }
  });

  // API Route: Restore Archived User Back to Active Members (Admin Only)
  app.post("/api/users/restore/:userId", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const cleanId = String(req.params.userId || "").trim().toUpperCase();
      const archived = loadArchivedUsersFromDisk();
      const target = archived.find((u) => u && String(u.userId).toUpperCase() === cleanId);
      if (!target) {
        return res.status(404).json({ success: false, error: "आर्काइव में यह सदस्य नहीं मिला।" });
      }

      const restoredUser = {
        ...target,
        isArchived: false,
        archivedAt: undefined,
        archivedReason: undefined,
      };
      const remainingArchived = archived.filter((u) => String(u.userId).toUpperCase() !== cleanId);
      saveArchivedUsersToDisk(remainingArchived);

      const currentActive = loadUsersFromDisk();
      const nextActive = mergeUsersNonDestructive(currentActive, [restoredUser]);
      saveUsersToDisk(nextActive);
      void syncSingleUserToFirestore(restoredUser);
      void pushUsersToAppsScriptWebhook([restoredUser]);

      return res.json({
        success: true,
        message: "सदस्य का डेटा सफलतापूर्वक पुनः सक्रिय (Restore) कर दिया गया है!",
        user: sanitizeUserForAdmin(restoredUser),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Restore failed" });
    }
  });

  // API Route: Check if Mobile Number or Email already exists (Masked info only to prevent privacy leaks)
  app.get("/api/users/check-duplicate", (req: Request, res: Response) => {
    try {
      const mobile = typeof req.query.mobile === "string" ? req.query.mobile.trim() : "";
      const email = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : "";
      const excludeUserId = typeof req.query.excludeUserId === "string" ? req.query.excludeUserId.trim().toUpperCase() : "";

      const users = loadUsersFromDisk();
      const mobileDigits = mobile.replace(/\D/g, "");

      for (const u of users) {
        if (!u || !u.userId) continue;
        if (excludeUserId && u.userId.toUpperCase() === excludeUserId) continue;

        const uDigits = (u.mobileNumber || "").replace(/\D/g, "");
        const mobileMatch = mobileDigits.length >= 10 && uDigits.endsWith(mobileDigits.slice(-10));
        const emailMatch = email.length > 3 && u.email && u.email.trim().toLowerCase() === email;

        if (mobileMatch || emailMatch) {
          return res.json({
            exists: true,
            matchedBy: mobileMatch && emailMatch ? "both" : mobileMatch ? "mobile" : "email",
            maskedMobile: maskMobile(u.mobileNumber),
            maskedEmail: maskEmail(u.email),
          });
        }
      }

      return res.json({ exists: false });
    } catch (e: any) {
      return res.status(500).json({ exists: false, error: e.message });
    }
  });

  // API Route: Register New User (Strict Uniqueness: No duplicate Mobile or Email allowed)
  // API Route: Validate Sponsor ID (Strict: only official root or existing registered users)
  // API Route: Validate Sponsor ID or Username
  app.get("/api/users/validate-sponsor", async (req: Request, res: Response) => {
    try {
      await ensureServerHydratedIfSparse();
      const { sponsorId } = req.query;
      if (!sponsorId || typeof sponsorId !== "string" || !sponsorId.trim()) {
        return res.status(400).json({
          isValid: false,
          error: "स्पॉन्सर ID दर्ज करना अनिवार्य है।",
        });
      }

      const rawInput = sponsorId.trim();
      const cleanSponsor = rawInput.replace(/^@/, "").toUpperCase();
      const cleanLower = rawInput.toLowerCase().replace(/^@/, "");

      const users = loadUsersFromDisk();
      let matched = users.find((u) => {
        if (!u) return false;
        const uidMatch = u.userId && String(u.userId).trim().toUpperCase() === cleanSponsor;
        const unameMatch = u.username && String(u.username).trim().toLowerCase().replace(/^@/, "") === cleanLower;
        return uidMatch || unameMatch;
      });

      // Master Root Sponsor: IOIS999VK01 or vikas01/vikaskumar
      if (!matched && (cleanSponsor === "IOIS999VK01" || cleanLower === "vikaskumar" || cleanLower === "vikas01")) {
        const rootOnDisk = users.find((u) => u && String(u.userId || "").toUpperCase() === "IOIS999VK01");
        return res.json({
          isValid: true,
          sponsorId: "IOIS999VK01",
          sponsorUsername: rootOnDisk?.username || "vikaskumar",
          sponsorName: rootOnDisk?.fullName || "Vikas Kumar (Master Founder & Root Sponsor)",
          photoUrl: rootOnDisk?.photoUrl || "",
        });
      }

      // Legacy Partner Sponsor: SWACCDK01
      if (!matched && cleanSponsor === "SWACCDK01") {
        return res.json({
          isValid: true,
          sponsorId: "SWACCDK01",
          sponsorName: "D. Kumar (ACC India Senior Partner Sponsor)",
          photoUrl: "",
        });
      }

      if (!matched) {
        matched = (await fetchSingleUserFromFirestore(cleanSponsor)) || undefined;
      }
      if (!matched && cleanLower) {
        matched = (await fetchSingleUserByUsernameFromFirestore(cleanLower)) || undefined;
      }

      if (matched) {
        if (!matched.photoUrl && Date.now() >= firestoreQuotaBlockedUntil) {
          const fsDb = getServerFirestore();
          if (fsDb) {
            matched = await hydrateUserMediaFromFirestore(fsDb, matched);
          }
        }
        return res.json({
          isValid: true,
          sponsorId: matched.userId,
          sponsorUsername: matched.username || undefined,
          sponsorName: matched.fullName || "सत्यापित सदस्य",
          photoUrl: matched.photoUrl || "",
        });
      }

      return res.status(404).json({
        isValid: false,
        error: `अमान्य स्पॉन्सर ID "${rawInput}"! यह स्पॉन्सर सिस्टम में मौजूद नहीं है। कोई भी रैंडम स्पॉन्सर ID स्वीकार्य नहीं है।`,
      });
    } catch (err: any) {
      return res.status(500).json({ isValid: false, error: "स्पॉन्सर सत्यापन में त्रुटि आई।" });
    }
  });

  // API Route: Check Username Availability (Strictly Unique Across Active + Archived Members)
  app.get("/api/users/check-username", (req: Request, res: Response) => {
    try {
      const { username, excludeUserId } = req.query;
      if (!username || typeof username !== "string" || !username.trim()) {
        return res.status(400).json({ available: false, error: "कृपया यूजरनेम दर्ज करें।" });
      }

      const clean = normalizeUsernameInput(username);
      const format = validateUsernameStrict(clean);
      if (!format.isValid) {
        return res.status(400).json({
          available: false,
          error: format.error,
        });
      }

      const excludeIdUpper = excludeUserId ? String(excludeUserId).trim().toUpperCase() : "";
      if (isUsernameTakenInRecords(clean, excludeIdUpper)) {
        return res.json({
          available: false,
          error: `❌ यूजरनेम "@${clean}" पहले से किसी अन्य सदस्य द्वारा उपयोग में है। कृपया कोई दूसरा उपलब्ध यूजरनेम चुनें।`,
        });
      }

      return res.json({
        available: true,
        cleanUsername: clean,
        message: `✓ यूजरनेम "@${clean}" उपलब्ध है!`,
      });
    } catch (err: any) {
      return res.status(500).json({ available: false, error: "यूजरनेम जांचने में त्रुटि आई।" });
    }
  });

  // API Route: User Registration (Rate-limited + scrypt Password Hashing + Signed Session Token)
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      if (isRateLimited(req, "user-register", 15, 10 * 60 * 1000, true)) {
        return res.status(429).json({
          success: false,
          error: "बहुत अधिक रजिस्ट्रेशन प्रयास। कृपया 10 मिनट बाद पुनः प्रयास करें।",
        });
      }
      const {
        fullName,
        username,
        mobileNumber,
        email,
        selectedPlanId = 1,
        role = "Verified Elite Member",
        password,
        sponsorId,
        telegramUsername,
        photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        googleDrivePhotoLink,
        paymentScreenshotUrl,
        googleDrivePaymentLink,
        paymentUtr,
        paymentMode,
        address,
        state,
        district,
        pincode,
        fatherOrHusbandName,
        motherName,
        dob,
        gender,
        qualification,
        aadhaarNumber,
        payoutUpi,
        emergencyContact,
        profileFrameId,
        privacySettings,
        registrationFormData,
        bio,
        coverUrl,
      } = req.body;

      if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
        return res.status(400).json({ success: false, error: "कृपया अपना वास्तविक पूरा नाम दर्ज करें (कम से कम 3 अक्षर)।" });
      }

      // Check name does not contain numbers or symbols
      const validNameRegex = /^[\u0900-\u097Fa-zA-Z\s\.\'\-]+$/;
      if (!validNameRegex.test(fullName.trim())) {
        return res.status(400).json({ success: false, error: "नाम में संख्याएं या विशेष प्रतीक स्वीकार्य नहीं हैं।" });
      }

      if (!mobileNumber || typeof mobileNumber !== "string") {
        return res.status(400).json({ success: false, error: "मोबाइल नंबर दर्ज करना अनिवार्य है।" });
      }

      const cleanMobile = mobileNumber.trim();
      const cleanDigits = cleanMobile.replace(/\D/g, "");

      if (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanDigits)) {
        return res.status(400).json({
          success: false,
          error: "कृपया 10-अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें जो 6, 7, 8 या 9 से शुरू होता हो।",
        });
      }

      // Disallow repetitive or sequential fake numbers
      if (/^(\d)\1{9}$/.test(cleanDigits) || ["1234567890", "0123456789", "9876543210"].includes(cleanDigits)) {
        return res.status(400).json({
          success: false,
          error: "अमान्य मोबाइल नंबर! फर्जी या रैंडम नंबर स्वीकार्य नहीं है।",
        });
      }

      const cleanEmail = (email || "").trim().toLowerCase();
      if (cleanEmail) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
        if (!emailRegex.test(cleanEmail)) {
          return res.status(400).json({
            success: false,
            error: "कृपया एक वैध ईमेल आईडी दर्ज करें (उदा. yourname@gmail.com)।",
          });
        }
      }

      await ensureServerHydratedIfSparse();
      const users = loadUsersFromDisk();

      // STRICT SPONSOR VALIDATION: Supports IOIS Unique ID OR @username and stores canonical IOIS userId
      const rawSponsorInput = String(sponsorId || "IOIS999VK01").trim().replace(/^@/, "");
      const cleanSponsorUpper = rawSponsorInput.toUpperCase();
      const cleanSponsorLower = rawSponsorInput.toLowerCase();
      let resolvedSponsorId = cleanSponsorUpper;
      let isSponsorValid =
        cleanSponsorUpper === "IOIS999VK01" ||
        cleanSponsorUpper === "SWACCDK01" ||
        cleanSponsorLower === "vikaskumar" ||
        cleanSponsorLower === "vikas01";

      if (cleanSponsorLower === "vikaskumar" || cleanSponsorLower === "vikas01") {
        resolvedSponsorId = "IOIS999VK01";
      }

      const diskSponsorMatch = users.find((u) => {
        if (!u) return false;
        const uidMatch = u.userId && String(u.userId).trim().toUpperCase() === cleanSponsorUpper;
        const unameMatch = u.username && String(u.username).trim().toLowerCase().replace(/^@/, "") === cleanSponsorLower;
        return uidMatch || unameMatch;
      });

      if (diskSponsorMatch) {
        resolvedSponsorId = diskSponsorMatch.userId;
        isSponsorValid = true;
      } else if (!isSponsorValid) {
        const cloudSponsor =
          (await fetchSingleUserFromFirestore(cleanSponsorUpper)) ||
          (await fetchSingleUserByUsernameFromFirestore(cleanSponsorLower));
        if (cloudSponsor && cloudSponsor.userId) {
          resolvedSponsorId = cloudSponsor.userId;
          isSponsorValid = true;
        }
      }

      if (!isSponsorValid) {
        return res.status(400).json({
          success: false,
          error: `अमान्य स्पॉन्सर ID "${cleanSponsorUpper}"! यह स्पॉन्सर सिस्टम में मौजूद नहीं है। कोई भी रैंडम स्पॉन्सर ID स्वीकार्य नहीं है।`,
        });
      }

      const cleanSponsor = resolvedSponsorId;

      const planPrice = PLAN_PRICES[selectedPlanId] || 10;

      // STRICT VALIDATION: Under no circumstance can multiple users have the same Mobile or Email
      const existingUser = users.find((u) => {
        if (!u) return false;
        const uDigits = (u.mobileNumber || "").replace(/\D/g, "");
        const sameMobile = cleanDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
        const sameEmail = cleanEmail.length > 3 && u.email && u.email.trim().toLowerCase() === cleanEmail;
        return sameMobile || sameEmail;
      });

      if (existingUser) {
        const uDigits = (existingUser.mobileNumber || "").replace(/\D/g, "");
        const mobileMatch = cleanDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
        const emailMatch = cleanEmail.length > 3 && existingUser.email && existingUser.email.trim().toLowerCase() === cleanEmail;
        const matchedBy = mobileMatch && emailMatch ? "both" : mobileMatch ? "mobile" : "email";

        return res.status(409).json({
          success: false,
          alreadyExists: true,
          matchedBy,
          maskedMobile: maskMobile(existingUser.mobileNumber),
          maskedEmail: maskEmail(existingUser.email),
          error: `यह ${matchedBy === "both" ? "मोबाइल नंबर और ईमेल" : matchedBy === "mobile" ? "मोबाइल नंबर" : "ईमेल"} पहले से किसी सदस्य के खाते में पंजीकृत है। डेटा सुरक्षा नीति के तहत एक सदस्य केवल एक ही वैध खाता रख सकता है।`,
        });
      }

      // Generate strictly unique User ID
      let userId = req.body.userId && typeof req.body.userId === "string" && req.body.userId.trim().length > 3
        ? req.body.userId.trim().toUpperCase()
        : generateUserIdHelper(fullName, planPrice, users);

      // Verify userId uniqueness against any collision (including archived archive IDs!)
      const archivedIds = new Set(loadArchivedUsersFromDisk().map((u: any) => String(u.userId).toUpperCase()));
      let safetyCounter = 1;
      while (
        users.some((u) => u.userId && u.userId.toUpperCase() === userId.toUpperCase()) ||
        archivedIds.has(userId.toUpperCase())
      ) {
        userId = generateUserIdHelper(fullName + safetyCounter, planPrice, users);
        safetyCounter++;
      }

      const requestedUsername = normalizeUsernameInput(username);
      let finalUsername = "";
      if (requestedUsername) {
        const formatCheck = validateUsernameStrict(requestedUsername);
        if (!formatCheck.isValid) {
          return res.status(400).json({
            success: false,
            usernameConflict: true,
            error: formatCheck.error,
          });
        }
        if (isUsernameTakenInRecords(requestedUsername)) {
          return res.status(409).json({
            success: false,
            usernameConflict: true,
            error: `❌ यूजरनेम "@${requestedUsername}" पहले से किसी अन्य सदस्य द्वारा उपयोग में है। कृपया कोई अलग यूजरनेम चुनें।`,
          });
        }
        finalUsername = requestedUsername;
      } else {
        const usedSet = collectUsedUsernamesSet();
        finalUsername = generateUniqueUsernameForUser(fullName, userId, usedSet);
      }

      const rawPassword = String(password || "1234").trim();
      const hashedPassword = await hashPasswordAsync(rawPassword);
      const passwordVaultEnc = encryptPasswordForVault(rawPassword);
      const sessionToken = `sess_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;

      const newUser = {
        userId,
        username: finalUsername,
        fullName: fullName.trim(),
        fatherOrHusbandName: fatherOrHusbandName ? String(fatherOrHusbandName).trim() : undefined,
        motherName: motherName ? String(motherName).trim() : undefined,
        dob: dob ? String(dob).trim() : undefined,
        gender: gender ? String(gender).trim() : undefined,
        qualification: qualification ? String(qualification).trim() : undefined,
        aadhaarNumber: aadhaarNumber ? String(aadhaarNumber).trim() : undefined,
        mobileNumber: cleanDigits,
        email: cleanEmail || `${cleanDigits.slice(-10)}@iois.in`,
        sponsorId: cleanSponsor,
        telegramUsername: telegramUsername ? telegramUsername.trim() : undefined,
        selectedPlanId: Number(selectedPlanId),
        role: role || "Verified Elite Member",
        password: hashedPassword,
        passwordVaultEnc,
        activeSessionToken: sessionToken,
        lastLoginAt: new Date().toISOString(),
        photoUrl,
        googleDrivePhotoLink: googleDrivePhotoLink ? googleDrivePhotoLink.trim() : undefined,
        paymentScreenshotUrl: paymentScreenshotUrl || undefined,
        googleDrivePaymentLink: googleDrivePaymentLink ? googleDrivePaymentLink.trim() : undefined,
        paymentUtr: paymentUtr ? paymentUtr.trim() : undefined,
        paymentMode: paymentMode ? String(paymentMode).trim() : "UPI",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
        address: address ? address.trim() : undefined,
        state: state ? String(state).trim() : undefined,
        district: district ? String(district).trim() : undefined,
        pincode: pincode ? String(pincode).trim() : undefined,
        payoutUpi: payoutUpi ? payoutUpi.trim() : undefined,
        emergencyContact: emergencyContact ? emergencyContact.trim() : undefined,
        profileFrameId: profileFrameId || undefined,
        privacySettings: privacySettings || undefined,
        registrationFormData: registrationFormData || undefined,
        bio: bio || undefined,
        coverUrl: coverUrl || undefined,
      };

      users.unshift(newUser);
      saveUsersToDisk(users);

      // Persist to Cloud Firestore & Google Sheet Webhook asynchronously so registration completes instantaneously (< 100ms)
      void syncSingleUserToFirestore(newUser);
      void pushUsersToAppsScriptWebhook([newUser]);

      // Trigger Telegram Alert in background
      sendTelegramRegistrationAlert(newUser, req).catch((e) => {
        console.warn("Telegram registration alert note:", e);
      });

      const authToken = signAuthToken({ role: "member", userId: newUser.userId, sessionToken });

      return res.status(201).json({
        success: true,
        message: "रजिस्ट्रेशन सफलतापूर्वक पूरा हुआ!",
        sessionToken,
        authToken,
        user: sanitizeUserForMember(newUser),
      });
    } catch (err: any) {
      console.error("Register Error:", err);
      return res.status(500).json({ success: false, error: err.message || "रजिस्ट्रेशन में त्रुटि आई।" });
    }
  });

  // API Route: User Login (scrypt + Lazy Auto-Migration + Rate Limit + HMAC Token)
  app.post("/api/users/login", async (req: Request, res: Response) => {
    try {
      if (isRateLimited(req, "user-login", 20, 10 * 60 * 1000, false)) {
        return res.status(429).json({
          success: false,
          error: "बहुत अधिक गलत लॉगिन प्रयास! कृपया 10 मिनट बाद पुनः प्रयास करें।",
        });
      }

      const { identifier, password, deviceInfo } = req.body;

      if (!identifier || typeof identifier !== "string") {
        return res.status(400).json({ success: false, error: "कृपया User ID, @Username, मोबाइल नंबर या ईमेल दर्ज करें।" });
      }

      const cleanInput = identifier.trim().toLowerCase().replace(/^@/, "");
      const inputDigits = cleanInput.replace(/\D/g, "");

      const findMatchIndex = (list: any[]) =>
        list.findIndex((u) => {
          const uidMatch = (u.userId || "").toLowerCase() === cleanInput;
          const unameMatch = u.username && u.username.toLowerCase().replace(/^@/, "") === cleanInput;
          const mobileMatch = inputDigits.length >= 10 && (u.mobileNumber || "").replace(/\D/g, "").endsWith(inputDigits.slice(-10));
          const emailMatch = u.email && u.email.toLowerCase() === cleanInput;
          return uidMatch || unameMatch || mobileMatch || emailMatch;
        });

      let users = loadUsersFromDisk();
      let userIndex = findMatchIndex(users);

      if (userIndex === -1) {
        await findSingleUserInFirestoreByIdentifier(identifier);
        users = loadUsersFromDisk();
        userIndex = findMatchIndex(users);

        if (userIndex === -1 && users.length <= 1) {
          await Promise.race([
            hydrateServerFromFirestoreOnce(false),
            new Promise<void>((resolve) => setTimeout(resolve, 2000)),
          ]);
          users = loadUsersFromDisk();
          userIndex = findMatchIndex(users);
        }
      }

      if (userIndex === -1) {
        recordRateLimitHit(req, "user-login", 10 * 60 * 1000);
        return res.status(404).json({
          success: false,
          error: "यह User ID, @Username या मोबाइल नंबर पंजीकृत नहीं है। कृपया सही विवरण दर्ज करें या नया रजिस्ट्रेशन करें।",
        });
      }

      const user = users[userIndex];

      if (user.password && (!password || !(await verifyPasswordAsync(String(password), user.password)))) {
        recordRateLimitHit(req, "user-login", 10 * 60 * 1000);
        return res.status(401).json({
          success: false,
          error: "दर्ज किया गया पासवर्ड गलत है। यदि पासवर्ड भूल गए हैं तो 'पासवर्ड रीसेट' का उपयोग करें।",
        });
      }

      clearRateLimitHits(req, "user-login");

      // Auto-migrate legacy plaintext password into salted scrypt hash seamlessly on login
      const upgradedPassword =
        user.password && !isHashedPassword(user.password) && password
          ? await hashPasswordAsync(String(password))
          : user.password;
      const plainLoginPassword = typeof password === "string" ? password.trim() : "";
      const capturedVaultEnc =
        plainLoginPassword && (!user.passwordVaultEnc || !String(user.passwordVaultEnc).startsWith("v1$"))
          ? encryptPasswordForVault(plainLoginPassword)
          : undefined;

      const sessionToken = `sess_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
      const nowIso = new Date().toISOString();
      const loginDevice = typeof deviceInfo === "string" && deviceInfo.trim() ? deviceInfo.trim() : "नया डिवाइस / ब्राउज़र";

      const allWithdrawals = loadJsonArray(WITHDRAWALS_FILE).filter(
        (w: any) => w && String(w.userId || "").toUpperCase() === String(user.userId).toUpperCase()
      );

      users[userIndex] = mergeUsersNonDestructive([user], [
        {
          userId: user.userId,
          password: upgradedPassword,
          ...(capturedVaultEnc ? { passwordVaultEnc: capturedVaultEnc } : {}),
          activeSessionToken: sessionToken,
          lastLoginDevice: loginDevice,
          lastLoginAt: nowIso,
          ...(allWithdrawals.length > 0 ? { withdrawals: allWithdrawals } : {}),
        },
      ])[0];
      if (upgradedPassword && isHashedPassword(upgradedPassword)) {
        users[userIndex].password = upgradedPassword;
      }
      saveUsersToDisk(users);
      void syncSingleUserToFirestore(users[userIndex]);

      const authToken = signAuthToken({ role: "member", userId: users[userIndex].userId, sessionToken });

      return res.json({
        success: true,
        message: "लॉगिन सफल!",
        sessionToken,
        authToken,
        user: sanitizeUserForMember(users[userIndex]),
      });
    } catch (err: any) {
      console.error("Login Error:", err);
      return res.status(500).json({ success: false, error: "लॉगिन प्रक्रिया में त्रुटि आई।" });
    }
  });

  // API Route: Single-Active-Device Session Validation
  app.post("/api/users/session-check", (req: Request, res: Response) => {
    try {
      const { userId, sessionToken } = req.body;
      if (!userId || !sessionToken) {
        return res.json({ valid: true });
      }
      const cleanId = String(userId).trim().toUpperCase();
      const users = loadUsersFromDisk();
      const user = users.find((u) => u && u.userId && u.userId.toUpperCase() === cleanId);
      if (!user || !user.activeSessionToken) {
        return res.json({ valid: true });
      }
      if (user.activeSessionToken !== sessionToken) {
        return res.json({
          valid: false,
          newDevice: user.lastLoginDevice || "नया डिवाइस",
          newLoginAt: user.lastLoginAt || new Date().toISOString(),
        });
      }
      return res.json({ valid: true });
    } catch {
      return res.json({ valid: true });
    }
  });

  // API Route: Sponsor-Assisted Member Joining (Requires Sponsor Auth + scrypt Hashing)
  app.post("/api/users/sponsor-register", async (req: Request, res: Response) => {
    try {
      if (isRateLimited(req, "sponsor-register", 20, 10 * 60 * 1000, true)) {
        return res.status(429).json({ success: false, error: "बहुत अधिक प्रयास। कृपया थोड़ी देर बाद प्रयास करें।" });
      }
      const {
        fullName,
        mobileNumber,
        email,
        sponsorId,
        selectedPlanId,
        password,
        username,
        role,
        address,
        payoutUpi,
        paymentUtr,
        paymentMode,
        paymentScreenshotUrl,
        googleDrivePaymentLink,
        photoUrl,
        googleDrivePhotoLink,
        telegramUsername,
      } = req.body;

      if (!fullName || !mobileNumber || !sponsorId || !selectedPlanId || !password) {
        return res.status(400).json({ success: false, error: "नए सदस्य का नाम, मोबाइल नंबर, स्पॉन्सर ID, प्लान और अस्थायी पासवर्ड अनिवार्य हैं।" });
      }

      await ensureServerHydratedIfSparse();
      const users = loadUsersFromDisk();
      const cleanSponsor = String(sponsorId).trim().toUpperCase();
      const sponsorRecord = users.find((u) => u && String(u.userId).toUpperCase() === cleanSponsor);
      if (!isSelfOrAdminAuthorized(req, cleanSponsor, sponsorRecord)) {
        return res.status(401).json({ success: false, error: "अनधिकृत स्पॉन्सर अनुरोध। कृपया अपने खाते में लॉगिन करें।" });
      }

      const cleanDigits = String(mobileNumber).replace(/\D/g, "");
      const cleanEmail = email ? String(email).trim().toLowerCase() : "";
      const rawUsernameInput = typeof username === "string" ? username.trim() : "";
      const cleanUsername = normalizeUsernameInput(rawUsernameInput);

      if (cleanDigits.length < 10) {
        return res.status(400).json({ success: false, error: "कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।" });
      }

      if (rawUsernameInput) {
        const unameFormat = validateUsernameStrict(cleanUsername);
        if (!unameFormat.isValid) {
          return res.status(400).json({ success: false, usernameConflict: true, error: unameFormat.error });
        }
        if (isUsernameTakenInRecords(cleanUsername)) {
          return res.status(409).json({
            success: false,
            usernameConflict: true,
            error: `❌ यूजरनेम "@${cleanUsername}" पहले से किसी अन्य सदस्य द्वारा उपयोग में है। कृपया कोई अलग यूजरनेम चुनें।`,
          });
        }
      }

      const conflict = users.find((u) => {
        const uDigits = (u.mobileNumber || "").replace(/\D/g, "");
        const mobMatch = uDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
        const emMatch = cleanEmail && u.email && u.email.trim().toLowerCase() === cleanEmail;
        return mobMatch || emMatch;
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          error: "यह मोबाइल नंबर या ईमेल पहले से पंजीकृत है। कृपया नया विवरण दर्ज करें।",
        });
      }

      const planPrice = PLAN_PRICES[Number(selectedPlanId)] || 10;
      const userId = generateUserIdHelper(fullName, planPrice, users);
      const finalSponsorRegUsername = cleanUsername || generateUniqueUsernameForUser(fullName, userId, collectUsedUsernamesSet());

      const newMember = {
        userId,
        username: finalSponsorRegUsername,
        fullName: String(fullName).trim(),
        mobileNumber: cleanDigits.slice(-10),
        email: cleanEmail || `${cleanDigits.slice(-10)}@iois.in`,
        sponsorId: cleanSponsor,
        registeredBySponsorId: cleanSponsor,
        mustChangePassword: true,
        selectedPlanId: Number(selectedPlanId),
        role: role ? String(role).trim() : "Verified Elite Member",
        password: await hashPasswordAsync(String(password).trim()),
        passwordVaultEnc: encryptPasswordForVault(String(password).trim()),
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        googleDrivePhotoLink: googleDrivePhotoLink ? String(googleDrivePhotoLink).trim() : undefined,
        paymentScreenshotUrl: paymentScreenshotUrl || undefined,
        googleDrivePaymentLink: googleDrivePaymentLink ? String(googleDrivePaymentLink).trim() : undefined,
        paymentUtr: paymentUtr ? String(paymentUtr).trim() : undefined,
        paymentMode: paymentMode ? String(paymentMode).trim() : "UPI",
        payoutUpi: payoutUpi ? String(payoutUpi).trim() : undefined,
        address: address ? String(address).trim() : undefined,
        telegramUsername: telegramUsername ? String(telegramUsername).trim() : undefined,
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
        friends: [cleanSponsor],
        profileViews: 0,
        profileLikes: [],
      };

      users.unshift(newMember);
      saveUsersToDisk(users);
      await Promise.race([
        syncSingleUserToFirestore(newMember),
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      ]).catch(() => {});
      void pushUsersToAppsScriptWebhook([newMember]);

      sendTelegramRegistrationAlert(newMember, req).catch(() => {});

      return res.status(201).json({
        success: true,
        message: "नए सदस्य का पंजीकरण आपके स्पॉन्सर ID से सफलतापूर्वक हो गया! पहले लॉगिन पर उन्हें नया पासवर्ड सेट करने का विकल्प मिलेगा।",
        user: compactUserForPublicDirectory(newMember),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "सदस्य जोड़ने में त्रुटि आई।" });
    }
  });

  // API Route: Mandatory Password Update (Hashes password + rotates session & auth token)
  app.post("/api/users/force-password-update", async (req: Request, res: Response) => {
    try {
      const { userId, currentPassword, newPassword, deviceInfo } = req.body;
      if (!userId || !newPassword || String(newPassword).trim().length < 4) {
        return res.status(400).json({ success: false, error: "नया पासवर्ड कम से कम 4 अक्षरों का होना अनिवार्य है।" });
      }

      const cleanId = String(userId).trim().toUpperCase();
      let users = loadUsersFromDisk();
      let index = users.findIndex((u) => u && u.userId && u.userId.toUpperCase() === cleanId);

      if (index === -1) {
        await fetchSingleUserFromFirestore(cleanId);
        users = loadUsersFromDisk();
        index = users.findIndex((u) => u && u.userId && u.userId.toUpperCase() === cleanId);
      }

      if (index === -1) {
        return res.status(404).json({ success: false, error: "उपयोगकर्ता खाता नहीं मिला।" });
      }

      const target = users[index];
      const hasSessionAuth = isSelfOrAdminAuthorized(req, cleanId, target);
      if (target.password) {
        if (currentPassword && !(await verifyPasswordAsync(String(currentPassword), target.password))) {
          return res.status(401).json({ success: false, error: "वर्तमान/अस्थायी पासवर्ड सही नहीं है।" });
        }
        if (!currentPassword && !hasSessionAuth) {
          return res.status(401).json({ success: false, error: "प्रमाणीकरण आवश्यक है। कृपया दोबारा लॉगिन करें।" });
        }
      }

      if (target.password && (await verifyPasswordAsync(String(newPassword).trim(), target.password))) {
        return res.status(400).json({ success: false, error: "नया पासवर्ड पुराने अस्थायी पासवर्ड से अलग होना चाहिए।" });
      }

      const newSessionToken = `sess_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
      const loginDevice = typeof deviceInfo === "string" && deviceInfo.trim() ? deviceInfo.trim() : "वर्तमान सुरक्षित डिवाइस";

      const cleanNewPwd = String(newPassword).trim();
      users[index] = {
        ...target,
        password: await hashPasswordAsync(cleanNewPwd),
        passwordVaultEnc: encryptPasswordForVault(cleanNewPwd),
        mustChangePassword: false,
        activeSessionToken: newSessionToken,
        lastLoginDevice: loginDevice,
        lastLoginAt: new Date().toISOString(),
      };

      saveUsersToDisk(users);
      void syncSingleUserToFirestore(users[index]);
      void pushUsersToAppsScriptWebhook([users[index]]);

      const authToken = signAuthToken({ role: "member", userId: users[index].userId, sessionToken: newSessionToken });

      return res.json({
        success: true,
        message: "आपका गुप्त पासवर्ड सुरक्षित रूप से अपडेट हो गया है! अब कोई अन्य व्यक्ति या स्पॉन्सर आपका खाता लॉगिन नहीं कर सकेगा।",
        sessionToken: newSessionToken,
        authToken,
        user: sanitizeUserForMember(users[index]),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "पासवर्ड अपडेट करने में त्रुटि आई।" });
    }
  });

  // API Route: Secure Recover User ID (Rate-limited + requires Mobile AND Email)
  app.post("/api/users/recover-id", async (req: Request, res: Response) => {
    try {
      if (isRateLimited(req, "user-recovery", 15, 10 * 60 * 1000, true)) {
        return res.status(429).json({ success: false, error: "बहुत अधिक प्रयास! कृपया 10 मिनट बाद पुनः प्रयास करें।" });
      }
      const { mobile, email, fullName } = req.body;
      if (!mobile || !email) {
        return res.status(400).json({
          success: false,
          error: "सुरक्षा कारणों से User ID खोजने के लिए पंजीकृत मोबाइल नंबर और ईमेल आईडी दोनों अनिवार्य हैं।",
        });
      }

      const cleanDigits = String(mobile).replace(/\D/g, "");
      const cleanEmail = String(email).trim().toLowerCase();
      const cleanName = fullName ? String(fullName).trim().toLowerCase() : "";

      await ensureServerHydratedIfSparse();
      let users = loadUsersFromDisk();

      const findRecoveryMatch = (list: any[]) =>
        list.find((u) => {
          if (!u) return false;
          const uDigits = (u.mobileNumber || "").replace(/\D/g, "");
          const mobMatch = cleanDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
          const emailMatch = u.email && u.email.trim().toLowerCase() === cleanEmail;
          const nameMatch = cleanName ? (u.fullName || "").trim().toLowerCase().includes(cleanName) : true;
          return mobMatch && emailMatch && nameMatch;
        });

      let user = findRecoveryMatch(users);
      if (!user && users.length <= 1 && cleanDigits.length >= 10) {
        await findSingleUserInFirestoreByIdentifier(cleanDigits.slice(-10));
        users = loadUsersFromDisk();
        user = findRecoveryMatch(users);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "दर्ज किया गया मोबाइल नंबर और ईमेल किसी पंजीकृत खाते से मेल नहीं खाते। सुरक्षा कारणों से User ID नहीं दिखाई जा सकती।",
        });
      }

      return res.json({
        success: true,
        userId: user.userId,
        maskedName: maskName(user.fullName),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "रिकवरी में त्रुटि आई।" });
    }
  });

  // API Route: Verify Real Identity (Rate-limited + Cryptographic Reset Token)
  app.post("/api/users/verify-identity", async (req: Request, res: Response) => {
    try {
      if (isRateLimited(req, "user-recovery", 15, 10 * 60 * 1000, true)) {
        return res.status(429).json({ success: false, error: "बहुत अधिक सत्यापन प्रयास! कृपया 10 मिनट बाद पुनः प्रयास करें।" });
      }
      await ensureServerHydratedIfSparse();
      const { identifier, fullName, email, address, sponsorId } = req.body;
      if (!identifier || !fullName || !email) {
        return res.status(400).json({
          success: false,
          error: "पहचान सत्यापन के लिए User ID, @Username या मोबाइल नंबर, पूरा नाम और ईमेल आईडी अनिवार्य हैं।",
        });
      }

      const cleanInput = String(identifier).trim().toLowerCase().replace(/^@/, "");
      const inputDigits = cleanInput.replace(/\D/g, "");
      const cleanName = String(fullName).trim().toLowerCase();
      const cleanEmail = String(email).trim().toLowerCase();
      const cleanAddress = address ? String(address).trim().toLowerCase() : "";
      const cleanSponsor = sponsorId ? String(sponsorId).trim().toLowerCase() : "";

      let users = loadUsersFromDisk();
      const findIdentityMatch = (list: any[]) =>
        list.find((u) => {
          if (!u) return false;
          const uidMatch = (u.userId || "").toLowerCase() === cleanInput;
          const unameMatch = u.username && normalizeUsernameInput(u.username) === cleanInput;
          const uDigits = (u.mobileNumber || "").replace(/\D/g, "");
          const mobileMatch = inputDigits.length >= 10 && uDigits.endsWith(inputDigits.slice(-10));
          return uidMatch || unameMatch || mobileMatch;
        });

      let user = findIdentityMatch(users);
      if (!user) {
        await findSingleUserInFirestoreByIdentifier(identifier);
        users = loadUsersFromDisk();
        user = findIdentityMatch(users);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "पहचान सत्यापन विफल: इस विवरण से कोई पंजीकृत सदस्य खाता नहीं मिला।",
        });
      }

      const uName = (user.fullName || "").trim().toLowerCase();
      const uEmail = (user.email || "").trim().toLowerCase();
      const uAddress = (user.address || "").trim().toLowerCase();
      const uSponsor = (user.sponsorId || "").trim().toLowerCase();

      const nameMatch = uName === cleanName || uName.includes(cleanName) || cleanName.includes(uName);
      const emailMatch = uEmail === cleanEmail;

      let addressMatch = true;
      if (cleanAddress && uAddress) {
        addressMatch = uAddress.includes(cleanAddress) || cleanAddress.includes(uAddress);
      }

      let sponsorMatch = true;
      if (cleanSponsor && uSponsor) {
        sponsorMatch = uSponsor === cleanSponsor;
      }

      if (!nameMatch || !emailMatch || !addressMatch || !sponsorMatch) {
        return res.status(401).json({
          success: false,
          error: "पहचान सत्यापन असफल: आपके द्वारा दर्ज किया गया नाम, ईमेल या पता इस खाते के रिकॉर्ड से मेल नहीं खाता। अनधिकृत पासवर्ड बदलाव को रोकने के लिए प्रक्रिया रोक दी गई है।",
        });
      }

      const token = `rst_${crypto.randomBytes(16).toString("hex")}`;
      passwordResetTokens.set(token, {
        userId: user.userId,
        expiresAt: Date.now() + 15 * 60 * 1000,
      });

      return res.json({
        success: true,
        verificationToken: token,
        userId: user.userId,
        maskedName: maskName(user.fullName),
        maskedMobile: maskMobile(user.mobileNumber),
        message: "पहचान सत्यापन सफल! अब आप नया सुरक्षित पासवर्ड सेट कर सकते हैं।",
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "सत्यापन प्रक्रिया में त्रुटि आई।" });
    }
  });

  // API Route: Reset Password (Rate-limited + scrypt Hashing)
  app.post("/api/users/reset-password", async (req: Request, res: Response) => {
    try {
      if (isRateLimited(req, "user-recovery", 15, 10 * 60 * 1000, true)) {
        return res.status(429).json({ success: false, error: "बहुत अधिक प्रयास! कृपया 10 मिनट बाद पुनः प्रयास करें।" });
      }
      const { userId, verificationToken, newPassword, confirmPassword, fallbackIdentity } = req.body;
      if (!userId || !newPassword) {
        return res.status(400).json({ success: false, error: "User ID और नया पासवर्ड आवश्यक हैं।" });
      }

      if (String(newPassword).trim().length < 4) {
        return res.status(400).json({ success: false, error: "नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।" });
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, error: "दोनों पासवर्ड आपस में मेल नहीं खाते।" });
      }

      const cleanId = String(userId).trim().toUpperCase();
      let users = loadUsersFromDisk();
      let userIndex = users.findIndex((u) => u.userId.toUpperCase() === cleanId);

      if (userIndex === -1) {
        await fetchSingleUserFromFirestore(cleanId);
        users = loadUsersFromDisk();
        userIndex = users.findIndex((u) => u.userId.toUpperCase() === cleanId);
      }

      if (userIndex === -1) {
        return res.status(404).json({ success: false, error: "उपयोगकर्ता खाता नहीं मिला।" });
      }

      const targetUser = users[userIndex];

      let isAuthorized = false;
      if (verificationToken) {
        const tokenData = passwordResetTokens.get(verificationToken);
        if (tokenData && tokenData.expiresAt > Date.now() && tokenData.userId.toUpperCase() === cleanId) {
          isAuthorized = true;
          passwordResetTokens.delete(verificationToken);
        }
      }

      if (!isAuthorized && fallbackIdentity) {
        const fName = String(fallbackIdentity.fullName || "").trim().toLowerCase();
        const fEmail = String(fallbackIdentity.email || "").trim().toLowerCase();
        const uName = (targetUser.fullName || "").trim().toLowerCase();
        const uEmail = (targetUser.email || "").trim().toLowerCase();

        if (fName && fEmail && (uName === fName || uName.includes(fName)) && uEmail === fEmail) {
          isAuthorized = true;
        }
      }

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: "अवैध या समाप्त सत्यापन सत्र। पासवर्ड बदलने से पहले अपनी वास्तविक पहचान सत्यापित करना अनिवार्य है।",
        });
      }

      const cleanResetPwd = String(newPassword).trim();
      users[userIndex].password = await hashPasswordAsync(cleanResetPwd);
      users[userIndex].passwordVaultEnc = encryptPasswordForVault(cleanResetPwd);
      saveUsersToDisk(users);
      void syncSingleUserToFirestore(users[userIndex]);
      void pushUsersToAppsScriptWebhook([users[userIndex]]);

      return res.json({
        success: true,
        message: "पासवर्ड सफलतापूर्वक सुरक्षित रूप से बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।",
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "पासवर्ड रीसेट में त्रुटि आई।" });
    }
  });

  // API Route: Update User Profile (Authenticated Self/Admin + Privilege Field Protection)
  app.put("/api/users/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const cleanId = String(userId || "").trim().toUpperCase();
      const rawUpdates = { ...(req.body || {}) };
      const isAdmin = isAdminAuthorized(req);

      let users = loadUsersFromDisk();
      let index = users.findIndex((u) => u.userId && u.userId.toUpperCase() === cleanId);

      if (index === -1) {
        await fetchSingleUserFromFirestore(cleanId);
        users = loadUsersFromDisk();
        index = users.findIndex((u) => u.userId && u.userId.toUpperCase() === cleanId);
      }

      if (index !== -1) {
        if (!requireSelfOrAdminRequest(req, res, cleanId, users[index])) return;
      } else {
        if (!requireAdminRequest(req, res)) return;
      }

      const updates: Record<string, any> = { ...rawUpdates };
      if (!isAdmin) {
        delete updates.paymentStatus;
        delete updates.selectedPlanId;
        delete updates.verifiedAt;
        delete updates.rejectionReason;
        delete updates.isArchived;
        delete updates.role;
      }

      if (typeof updates.password === "string" && updates.password.trim()) {
        const cleanPwd = updates.password.trim();
        updates.password = await hashPasswordAsync(cleanPwd);
        updates.passwordVaultEnc = encryptPasswordForVault(cleanPwd);
      } else {
        delete updates.password;
        delete updates.passwordVaultEnc;
      }

      // Enforce strict unique @username across all members
      if (typeof updates.username === "string") {
        const cleanUname = normalizeUsernameInput(updates.username);
        if (cleanUname) {
          const unameFormat = validateUsernameStrict(cleanUname);
          if (!unameFormat.isValid) {
            return res.status(400).json({ success: false, usernameConflict: true, error: unameFormat.error });
          }
          if (isUsernameTakenInRecords(cleanUname, cleanId)) {
            return res.status(409).json({
              success: false,
              usernameConflict: true,
              error: `❌ यूजरनेम "@${cleanUname}" पहले से किसी अन्य सदस्य द्वारा उपयोग में है। कृपया कोई अलग यूजरनेम चुनें।`,
            });
          }
          updates.username = cleanUname;
        } else {
          // Never erase an existing member's unique username to blank
          delete updates.username;
        }
      }

      // Check if new mobile or email is already taken by another user
      if (updates.mobileNumber || updates.email) {
        const checkMobileDigits = updates.mobileNumber ? String(updates.mobileNumber).trim().replace(/\D/g, "") : "";
        const checkEmail = updates.email ? String(updates.email).trim().toLowerCase() : "";

        const conflictUser = users.find((u) => {
          if (!u || String(u.userId).toUpperCase() === cleanId) return false;
          const uDigits = (u.mobileNumber || "").replace(/\D/g, "");
          const mobileMatch = checkMobileDigits.length >= 10 && uDigits.endsWith(checkMobileDigits.slice(-10));
          const emailMatch = checkEmail.length > 3 && u.email && u.email.trim().toLowerCase() === checkEmail;
          return mobileMatch || emailMatch;
        });

        if (conflictUser) {
          return res.status(409).json({
            success: false,
            error: "दर्ज किया गया मोबाइल नंबर या ईमेल किसी अन्य सदस्य के खाते में पहले से पंजीकृत है।",
          });
        }
      }

      if (index === -1) {
        if (!updates.fullName && !updates.mobileNumber) {
          return res.status(404).json({ success: false, error: "यूजर नहीं मिला।" });
        }
        const upserted = mergeUsersNonDestructive([], [{ ...updates, userId: cleanId, isArchived: false }])[0];
        users.unshift(upserted);
        saveUsersToDisk(users);
        void syncSingleUserToFirestore(upserted);
        return res.json({
          success: true,
          message: "प्रोफ़ाइल सफलतापूर्वक सहेज ली गई!",
          user: sanitizeUserForMember(upserted),
        });
      }

      // Non-destructive merge guarantees partial payloads or blank strings NEVER erase existing fields
      const mergedUser = mergeUsersNonDestructive([users[index]], [
        { ...updates, userId: users[index].userId, isArchived: false },
      ])[0];
      users[index] = mergedUser;

      saveUsersToDisk(users);
      void syncSingleUserToFirestore(mergedUser);
      void pushUsersToAppsScriptWebhook([mergedUser]);

      return res.json({
        success: true,
        message: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
        user: isAdmin ? sanitizeUserForAdmin(mergedUser) : sanitizeUserForMember(mergedUser),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "अपडेट में त्रुटि आई।" });
    }
  });

  // API Route: Admin Approve / Reject User (Admin Only)
  app.post("/api/users/:userId/status", async (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { userId } = req.params;
      const cleanId = String(userId || "").trim().toUpperCase();
      const { status, reason } = req.body;

      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ success: false, error: "अमान्य स्टेटस" });
      }

      let users = loadUsersFromDisk();
      let index = users.findIndex((u) => u.userId && u.userId.toUpperCase() === cleanId);

      if (index === -1) {
        await fetchSingleUserFromFirestore(cleanId);
        users = loadUsersFromDisk();
        index = users.findIndex((u) => u.userId && u.userId.toUpperCase() === cleanId);
      }

      if (index === -1) {
        return res.status(404).json({ success: false, error: "यूजर नहीं मिला।" });
      }

      users[index].paymentStatus = status;
      if (status === "approved") {
        users[index].verifiedAt = new Date().toISOString();
        users[index].rejectionReason = undefined;
      } else if (status === "rejected") {
        users[index].rejectionReason = reason || "अमान्य पेमेंट स्क्रीनशॉट या UTR";
      }

      saveUsersToDisk(users);
      await Promise.race([
        syncSingleUserToFirestore(users[index]),
        new Promise<void>((resolve) => setTimeout(resolve, 2500)),
      ]).catch(() => {});
      void pushUsersToAppsScriptWebhook([users[index]]);

      return res.json({
        success: true,
        message: `यूजर स्टेटस ${status === "approved" ? "स्वीकृत" : "अस्वीकृत"} कर दिया गया।`,
        user: sanitizeUserForAdmin(users[index]),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "स्टेटस बदलने में त्रुटि आई।" });
    }
  });

  // API Routes: Cross-Device User Withdrawal History Sync (Self or Admin Only)
  app.get("/api/withdrawals/:userId", async (req: Request, res: Response) => {
    try {
      const cleanId = String(req.params.userId || "").trim().toUpperCase();
      if (!cleanId) return res.status(400).json({ success: false, error: "User ID required" });

      let users = loadUsersFromDisk();
      let user = users.find((u) => u && String(u.userId).toUpperCase() === cleanId);
      if (!user) {
        user = (await fetchSingleUserFromFirestore(cleanId)) || undefined;
      }
      if (!requireSelfOrAdminRequest(req, res, cleanId, user)) return;

      const diskList = loadJsonArray(WITHDRAWALS_FILE).filter(
        (w: any) => w && String(w.userId || "").toUpperCase() === cleanId
      );

      const userList = Array.isArray(user?.withdrawals) ? user.withdrawals : [];
      const wMap = new Map<string, any>();
      for (const w of [...diskList, ...userList]) {
        if (!w || !w.id) continue;
        wMap.set(w.id, { ...w, userId: cleanId });
      }
      const mergedList = Array.from(wMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      return res.json({ success: true, withdrawals: mergedList });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to load withdrawals" });
    }
  });

  app.post("/api/withdrawals", async (req: Request, res: Response) => {
    try {
      const { userId, withdrawal } = req.body || {};
      const cleanId = String(userId || withdrawal?.userId || "").trim().toUpperCase();
      if (!cleanId || !withdrawal || !withdrawal.id) {
        return res.status(400).json({ success: false, error: "Invalid withdrawal payload" });
      }

      let users = loadUsersFromDisk();
      let idx = users.findIndex((u) => u && String(u.userId).toUpperCase() === cleanId);
      if (idx === -1) {
        await fetchSingleUserFromFirestore(cleanId);
        users = loadUsersFromDisk();
        idx = users.findIndex((u) => u && String(u.userId).toUpperCase() === cleanId);
      }
      const targetUser = idx !== -1 ? users[idx] : undefined;
      if (!requireSelfOrAdminRequest(req, res, cleanId, targetUser)) return;

      const record = { ...withdrawal, userId: cleanId };
      const allDisk = loadJsonArray(WITHDRAWALS_FILE);
      const filteredDisk = allDisk.filter((w: any) => w && w.id !== record.id);
      filteredDisk.unshift(record);
      saveJsonArray(WITHDRAWALS_FILE, filteredDisk);

      // Merge into user profile on disk & Firestore so cross-device user logins inherit withdrawals automatically
      if (idx !== -1) {
        users[idx] = mergeUsersNonDestructive([users[idx]], [{ userId: cleanId, withdrawals: [record] }])[0];
        saveUsersToDisk(users);
        void syncSingleUserToFirestore(users[idx]);
      }

      const userWithdrawals = filteredDisk
        .filter((w: any) => w && String(w.userId || "").toUpperCase() === cleanId)
        .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      return res.json({ success: true, withdrawal: record, withdrawals: userWithdrawals });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to save withdrawal" });
    }
  });

  // API Route: Admin Soft-Archive User (Admin Only — moves cleanly to archive vault)
  app.delete("/api/users/:userId", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { userId } = req.params;
      const cleanId = String(userId || "").trim().toUpperCase();
      const users = loadUsersFromDisk();
      const targetUser = users.find((u) => u.userId && u.userId.toUpperCase() === cleanId);

      if (!targetUser) {
        return res.status(404).json({ success: false, error: "यूजर नहीं मिला।" });
      }

      const archivedEntry = {
        ...targetUser,
        isArchived: true,
        archivedAt: new Date().toISOString(),
        archivedReason: "Admin archive vault",
      };

      const archivedList = loadArchivedUsersFromDisk();
      saveArchivedUsersToDisk(mergeUsersNonDestructive(archivedList, [archivedEntry]));

      const remaining = users.filter((u) => u.userId && u.userId.toUpperCase() !== cleanId);
      saveUsersToDisk(remaining, { allowShrink: true });
      void syncSingleUserToFirestore(archivedEntry);

      return res.json({
        success: true,
        archived: true,
        message: "यूजर को आर्काइव बैकअप वॉल्ट में सुरक्षित स्थानांतरित कर दिया गया (डेटा कभी भी रिस्टोर किया जा सकता है)।",
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "हटाने में त्रुटि आई।" });
    }
  });

  // API Routes: Help Tickets (Admin sees all; Authenticated Member sees own tickets only)
  app.get("/api/tickets", (req: Request, res: Response) => {
    const tickets = loadTicketsFromDisk();
    if (isAdminAuthorized(req)) {
      return res.json({ success: true, count: tickets.length, tickets });
    }
    const authMember = getAuthenticatedMember(req);
    let resolvedUid = authMember && authMember.role === "member" ? String(authMember.userId || "").trim().toUpperCase() : "";
    if (!resolvedUid) {
      const qUid = String(req.query.userId || "").trim().toUpperCase();
      const sessionHeader = String(req.headers["x-session-token"] || "").trim();
      if (qUid && sessionHeader) {
        const matched = loadUsersFromDisk().find((u) => u && String(u.userId).toUpperCase() === qUid);
        if (matched?.activeSessionToken && matched.activeSessionToken === sessionHeader) {
          resolvedUid = qUid;
        }
      }
    }
    if (!resolvedUid) {
      return res.status(401).json({ success: false, error: "अनधिकृत अनुरोध: कृपया अपने खाते में लॉगिन करें।" });
    }
    const ownTickets = tickets.filter((t) => t && String(t.userId || "").trim().toUpperCase() === resolvedUid);
    return res.json({ success: true, count: ownTickets.length, tickets: ownTickets });
  });

  app.post("/api/tickets", (req: Request, res: Response) => {
    try {
      const { userId, userName, userMobile, subject, description, attachmentUrl, googleDriveAttachmentLink } = req.body;

      if (!userId || !subject || !description) {
        return res.status(400).json({ success: false, error: "विवरण आवश्यक है।" });
      }

      const tickets = loadTicketsFromDisk();
      const newTicket = {
        id: `TCK-${Date.now().toString().slice(-6)}`,
        userId,
        userName: userName || "User",
        userMobile: userMobile || "",
        subject: subject.trim(),
        description: description.trim(),
        attachmentUrl: attachmentUrl || undefined,
        googleDriveAttachmentLink: googleDriveAttachmentLink ? googleDriveAttachmentLink.trim() : undefined,
        status: "open",
        createdAt: new Date().toISOString(),
      };

      tickets.unshift(newTicket);
      saveTicketsToDisk(tickets);

      return res.status(201).json({ success: true, message: "सपोर्ट टिकट दर्ज हो गया है!", ticket: newTicket });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "टिकट दर्ज करने में समस्या आई।" });
    }
  });

  app.post("/api/tickets/:id/reply", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { id } = req.params;
      const { adminReply, status = "resolved" } = req.body;

      const tickets = loadTicketsFromDisk();
      const index = tickets.findIndex((t) => t.id === id);

      if (index === -1) {
        return res.status(404).json({ success: false, error: "टिकट नहीं मिला।" });
      }

      tickets[index].adminReply = adminReply;
      tickets[index].status = status;

      saveTicketsToDisk(tickets);

      return res.json({ success: true, message: "उत्तर भेज दिया गया!", ticket: tickets[index] });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "उत्तर भेजने में त्रुटि आई।" });
    }
  });

  // =========================================================================
  // API Routes: Private Direct Messaging (Admin <-> User with text, photos, videos, links)
  // =========================================================================

  // GET messages for a specific user (Self or Admin Only)
  app.get("/api/messages/:userId", (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const cleanId = String(userId).trim().toUpperCase();
      const targetUser = loadUsersFromDisk().find((u) => u && String(u.userId).toUpperCase() === cleanId);
      if (!requireSelfOrAdminRequest(req, res, cleanId, targetUser)) return;

      const allMessages = loadMessagesFromDisk();
      const userMessages = allMessages.filter((m) => m && m.userId && m.userId.toUpperCase() === cleanId);
      return res.json({ success: true, count: userMessages.length, messages: userMessages });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "मैसेज लोड करने में त्रुटि आई।" });
    }
  });

  // POST new message (Self or Admin; sender==='admin' requires Admin Auth)
  app.post("/api/messages", (req: Request, res: Response) => {
    try {
      const { userId, sender, senderName, text, mediaType, mediaUrl, linkUrl, linkTitle } = req.body;
      if (!userId || (!text && !mediaUrl && !linkUrl)) {
        return res.status(400).json({ success: false, error: "User ID और संदेश अथवा मीडिया अनिवार्य है।" });
      }

      const cleanId = String(userId).trim().toUpperCase();
      if (sender === "admin") {
        if (!requireAdminRequest(req, res)) return;
      } else {
        const targetUser = loadUsersFromDisk().find((u) => u && String(u.userId).toUpperCase() === cleanId);
        if (!requireSelfOrAdminRequest(req, res, cleanId, targetUser)) return;
      }

      const allMessages = loadMessagesFromDisk();
      const newMsg = {
        id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: cleanId,
        sender: sender === 'admin' ? 'admin' : 'user',
        senderName: senderName || (sender === 'admin' ? 'IOIS Admin Team' : 'सदस्य'),
        text: text ? String(text).trim() : '',
        mediaType: mediaType || (mediaUrl ? (mediaUrl.includes('.mp4') || mediaUrl.includes('youtube') ? 'video' : 'image') : linkUrl ? 'link' : undefined),
        mediaUrl: mediaUrl ? String(mediaUrl).trim() : undefined,
        linkUrl: linkUrl ? String(linkUrl).trim() : undefined,
        linkTitle: linkTitle ? String(linkTitle).trim() : undefined,
        createdAt: new Date().toISOString(),
        read: false,
      };

      allMessages.push(newMsg);
      saveMessagesToDisk(allMessages);

      return res.status(201).json({ success: true, message: newMsg });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "संदेश भेजने में त्रुटि आई।" });
    }
  });

  // GET all active chat threads for Admin (Admin Only)
  app.get("/api/admin/chat-threads", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const allMessages = loadMessagesFromDisk();
      const users = loadUsersFromDisk();
      const threadsMap: Record<string, { userId: string; userName: string; userMobile: string; lastMessage: any; messageCount: number; unreadCount: number }> = {};

      allMessages.forEach((msg) => {
        if (!msg || !msg.userId) return;
        const uid = msg.userId.toUpperCase();
        if (!threadsMap[uid]) {
          const u = users.find((usr) => usr.userId && usr.userId.toUpperCase() === uid);
          threadsMap[uid] = {
            userId: uid,
            userName: u ? u.fullName : 'पंजीकृत सदस्य',
            userMobile: u ? u.mobileNumber : '',
            lastMessage: msg,
            messageCount: 0,
            unreadCount: 0,
          };
        }
        threadsMap[uid].messageCount++;
        if (msg.sender === 'user' && !msg.read) {
          threadsMap[uid].unreadCount++;
        }
        threadsMap[uid].lastMessage = msg;
      });

      const threads = Object.values(threadsMap).sort((a, b) => {
        const timeA = new Date(a.lastMessage?.createdAt || 0).getTime();
        const timeB = new Date(b.lastMessage?.createdAt || 0).getTime();
        return timeB - timeA;
      });

      return res.json({ success: true, count: threads.length, threads });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "थ्रेड्स लोड करने में त्रुटि आई।" });
    }
  });

  // Admin Update User Profile with Edit History (Admin Only + Scrypt Password Hashing)
  app.put("/api/admin/users/:userId", async (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { userId } = req.params;
      const rawUpdates = { ...(req.body || {}) };
      const cleanId = String(userId).trim().toUpperCase();

      let users = loadUsersFromDisk();
      let index = users.findIndex((u) => u.userId && u.userId.toUpperCase() === cleanId);
      if (index === -1) {
        await fetchSingleUserFromFirestore(cleanId);
        users = loadUsersFromDisk();
        index = users.findIndex((u) => u.userId && u.userId.toUpperCase() === cleanId);
      }
      if (index === -1) {
        return res.status(404).json({ success: false, error: "उपयोगकर्ता नहीं मिला।" });
      }

      const existing = users[index];
      const updates: Record<string, any> = { ...rawUpdates };

      if (typeof updates.username === "string") {
        const cleanUname = normalizeUsernameInput(updates.username);
        if (cleanUname) {
          const unameFormat = validateUsernameStrict(cleanUname);
          if (!unameFormat.isValid) {
            return res.status(400).json({ success: false, usernameConflict: true, error: unameFormat.error });
          }
          if (isUsernameTakenInRecords(cleanUname, existing.userId)) {
            return res.status(409).json({
              success: false,
              usernameConflict: true,
              error: `❌ यूजरनेम "@${cleanUname}" पहले से किसी अन्य सदस्य द्वारा उपयोग में है। हर सदस्य का अलग यूनिक यूजरनेम होना अनिवार्य है।`,
            });
          }
          updates.username = cleanUname;
        } else if (existing.username) {
          updates.username = normalizeUsernameInput(existing.username);
        } else {
          updates.username = generateUniqueUsernameForUser(
            updates.fullName || existing.fullName || "",
            existing.userId,
            collectUsedUsernamesSet(existing.userId)
          );
        }
      }

      const hasPasswordUpdate = typeof updates.password === "string" && updates.password.trim().length > 0;
      if (hasPasswordUpdate) {
        const cleanPwd = String(updates.password).trim();
        updates.password = hashPassword(cleanPwd);
        updates.passwordVaultEnc = encryptPasswordForVault(cleanPwd);
      } else {
        delete updates.password;
        delete updates.passwordVaultEnc;
      }

      const now = new Date().toISOString();
      const editLogs: Array<{ field: string; fieldLabelHi: string; oldValue?: string; newValue?: string; timestamp: string }> = Array.isArray(existing.editHistory) ? [...existing.editHistory] : [];

      // Track Admin changes (never log plaintext passwords in editHistory)
      const fieldLabels: Record<string, string> = {
        fullName: "सदस्य का पूरा नाम (Admin Change)",
        password: "लॉगिन पासवर्ड (Admin Reset)",
        mobileNumber: "मोबाइल नंबर",
        email: "ईमेल आईडी",
        selectedPlanId: "चयनित प्लान",
        role: "सदस्य पद / रोल",
        payoutUpi: "पेआउट UPI ID",
        address: "पता",
        paymentStatus: "पेमेंट वेरिफिकेशन स्थिति",
        username: "यूजरनेम (@username)",
      };

      Object.keys(updates).forEach((k) => {
        if (k !== 'editHistory' && k !== 'userId' && updates[k] !== undefined) {
          if (k === 'password') {
            editLogs.unshift({
              field: 'password',
              fieldLabelHi: fieldLabels.password,
              oldValue: '[सुरक्षित पासवर्ड]',
              newValue: '[सुरक्षित पासवर्ड अपडेट]',
              timestamp: now,
            });
            return;
          }
          const rawOldV = String(existing[k] || '');
          const rawNewV = String(updates[k] || '');
          if (rawOldV !== rawNewV) {
            const isMedia = k === 'photoUrl' || k === 'paymentScreenshotUrl' || k === 'coverUrl' || rawOldV.startsWith('data:') || rawNewV.startsWith('data:') || rawOldV.length > 500 || rawNewV.length > 500;
            editLogs.unshift({
              field: k,
              fieldLabelHi: fieldLabels[k] || k,
              oldValue: isMedia ? '[फोटो/दस्तावेज अपडेट]' : (rawOldV || '(खाली)'),
              newValue: isMedia ? '[फोटो/दस्तावेज अपडेट]' : (rawNewV || '(खाली)'),
              timestamp: now,
            });
          }
        }
      });

      const mergedUser = mergeUsersNonDestructive([existing], [
        {
          ...updates,
          userId: existing.userId,
          editHistory: sanitizeEditHistoryArray(editLogs).slice(0, 100),
          isArchived: false,
        },
      ])[0];

      // Allow admin to explicitly change paymentStatus (even downgrading from approved to pending/rejected),
      // clear optional payoutUpi, preserve unique username, and keep emailLower in sync when email is edited
      if (updates.paymentStatus === "approved" || updates.paymentStatus === "pending" || updates.paymentStatus === "rejected") {
        mergedUser.paymentStatus = updates.paymentStatus;
      }
      if (typeof updates.email === "string") {
        mergedUser.email = updates.email.trim();
        mergedUser.emailLower = mergedUser.email.toLowerCase();
      }
      if (typeof updates.username === "string" && updates.username.trim()) {
        mergedUser.username = normalizeUsernameInput(updates.username);
      }
      if (typeof updates.payoutUpi === "string") {
        mergedUser.payoutUpi = updates.payoutUpi.trim();
      }

      users[index] = mergedUser;

      saveUsersToDisk(users);
      const fsSynced = await Promise.race([
        syncSingleUserToFirestore(mergedUser),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5000)),
      ]);
      void pushUsersToAppsScriptWebhook([mergedUser]);
      return res.json({
        success: true,
        firestoreSynced: fsSynced,
        message: "एडमिन द्वारा यूजर प्रोफाइल सफलतापूर्वक अपडेट की गई!",
        user: sanitizeUserForAdmin(mergedUser),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "यूजर अपडेट में त्रुटि आई।" });
    }
  });

  // =========================================================================
  // IOIS CHAT & HELP: SOCIAL PROFILES, FRIENDS, LIKES, VIEWS, GROUPS & DMs
  // =========================================================================

  function makeDmThreadId(u1: string, u2: string): string {
    const a = String(u1 || "").trim().toUpperCase();
    const b = String(u2 || "").trim().toUpperCase();
    return a < b ? `dm:${a}__${b}` : `dm:${b}__${a}`;
  }

  function sanitizePublicProfile(u: any, likesMap: Record<string, string[]>, visitsList: any[], friendsList: string[]) {
    const uid = String(u.userId || "").toUpperCase();
    const likesArr = Array.isArray(likesMap[uid]) ? likesMap[uid] : (Array.isArray(u.profileLikes) ? u.profileLikes : []);
    const visitCount = visitsList.filter((v) => v && String(v.targetUserId).toUpperCase() === uid).length || Number(u.profileViews || 0);
    return {
      userId: u.userId,
      username: u.username || u.userId.toLowerCase(),
      fullName: u.fullName,
      photoUrl: u.photoUrl,
      coverUrl: u.coverUrl || undefined,
      bio: u.bio || "",
      role: u.role,
      selectedPlanId: u.selectedPlanId,
      paymentStatus: u.paymentStatus,
      sponsorId: u.sponsorId,
      state: u.state,
      district: u.district,
      profileFrameId: u.profileFrameId,
      privacySettings: u.privacySettings,
      createdAt: u.createdAt,
      profileViews: visitCount,
      profileLikes: likesArr,
      friends: friendsList,
    };
  }

  // Bootstrap IOIS CHAT & HELP for a logged-in user (Directory, Friends, Requests, Groups, Unread Summary per sender/group)
  app.get("/api/social/bootstrap", (req: Request, res: Response) => {
    try {
      const rawUid = String(req.query.userId || "").trim().toUpperCase();
      const users = loadUsersFromDisk();
      const allMsgs = loadJsonArray(SOCIAL_MESSAGES_FILE);
      const allGroups = loadJsonArray(SOCIAL_GROUPS_FILE);
      const allRequests = loadJsonArray(FRIEND_REQUESTS_FILE);
      const allVisits = loadJsonArray(PROFILE_VISITS_FILE);
      const likesMap = loadJsonObject(PROFILE_LIKES_FILE);

      // Compute accepted friendships map
      const friendsByUser: Record<string, Set<string>> = {};
      allRequests.forEach((r) => {
        if (r && r.status === "accepted") {
          const from = String(r.fromUserId || "").toUpperCase();
          const to = String(r.toUserId || "").toUpperCase();
          if (!friendsByUser[from]) friendsByUser[from] = new Set();
          if (!friendsByUser[to]) friendsByUser[to] = new Set();
          friendsByUser[from].add(to);
          friendsByUser[to].add(from);
        }
      });

      const directory = users.map((u) => {
        const uid = String(u.userId || "").toUpperCase();
        const fSet = friendsByUser[uid] || new Set(Array.isArray(u.friends) ? u.friends : []);
        return sanitizePublicProfile(u, likesMap, allVisits, Array.from(fSet));
      });

      const myRequests = rawUid
        ? allRequests.filter(
            (r) =>
              r &&
              (String(r.fromUserId).toUpperCase() === rawUid || String(r.toUserId).toUpperCase() === rawUid)
          )
        : [];

      const myGroups = rawUid
        ? allGroups.filter(
            (g) =>
              g &&
              Array.isArray(g.memberIds) &&
              g.memberIds.some((m: string) => String(m).toUpperCase() === rawUid)
          )
        : [];

      const myVisitLogs = rawUid
        ? allVisits
            .filter((v) => v && String(v.targetUserId).toUpperCase() === rawUid)
            .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime())
            .slice(0, 50)
        : [];

      // Summarize unread messages per thread/sender for this user
      const unreadMap: Record<string, any> = {};
      const threadLastMessage: Record<string, any> = {};

      if (rawUid) {
        const myGroupIds = new Set(myGroups.map((g) => g.id));

        allMsgs.forEach((m) => {
          if (!m || !m.threadId) return;
          const isMyDm = m.threadType === "dm" && (String(m.senderId).toUpperCase() === rawUid || String(m.recipientId).toUpperCase() === rawUid);
          const isMyGroup = m.threadType === "group" && myGroupIds.has(m.groupId);
          if (!isMyDm && !isMyGroup) return;

          threadLastMessage[m.threadId] = m;

          const senderUpper = String(m.senderId || "").toUpperCase();
          const readByArr: string[] = Array.isArray(m.readBy) ? m.readBy.map((x: string) => String(x).toUpperCase()) : [];

          if (senderUpper !== rawUid && !readByArr.includes(rawUid)) {
            if (!unreadMap[m.threadId]) {
              const senderUser = users.find((u) => u.userId && u.userId.toUpperCase() === senderUpper);
              const grp = m.threadType === "group" ? myGroups.find((g) => g.id === m.groupId) : null;
              unreadMap[m.threadId] = {
                threadId: m.threadId,
                threadType: m.threadType,
                senderId: senderUpper,
                senderName: m.senderName || senderUser?.fullName || senderUpper,
                senderUsername: m.senderUsername || senderUser?.username || senderUpper.toLowerCase(),
                senderPhoto: m.senderPhoto || senderUser?.photoUrl,
                groupName: grp?.name,
                unreadCount: 0,
                lastMessage: m.text || (m.mediaType === "image" ? "📷 फोटो भेजा है" : m.mediaType === "video" ? "🎬 वीडियो भेजा है" : m.linkUrl ? "🔗 लिंक भेजा है" : "नया संदेश"),
                lastMessageAt: m.createdAt,
              };
            }
            unreadMap[m.threadId].unreadCount++;
            unreadMap[m.threadId].lastMessage = m.text || (m.mediaType === "image" ? "📷 फोटो भेजा है" : m.mediaType === "video" ? "🎬 वीडियो भेजा है" : m.linkUrl ? "🔗 लिंक भेजा है" : "नया संदेश");
            unreadMap[m.threadId].lastMessageAt = m.createdAt;
          }
        });
      }

      const unreadSummaries = Object.values(unreadMap).sort(
        (a: any, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );

      return res.json({
        success: true,
        directory,
        friendRequests: myRequests,
        groups: myGroups,
        visitLogs: myVisitLogs,
        unreadSummaries,
        threadLastMessage,
        totalUnreadCount: unreadSummaries.reduce((sum: number, item: any) => sum + (item.unreadCount || 0), 0),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "डेटा लोड करने में त्रुटि आई।" });
    }
  });

  // Record a profile visit (increments profile views count)
  app.post("/api/social/profile-visit", (req: Request, res: Response) => {
    try {
      const { targetUserId, visitorUserId, visitorName, visitorUsername } = req.body;
      if (!targetUserId) {
        return res.status(400).json({ success: false, error: "targetUserId अनिवार्य है।" });
      }
      const targetUpper = String(targetUserId).trim().toUpperCase();
      const visitorUpper = visitorUserId ? String(visitorUserId).trim().toUpperCase() : "GUEST";

      if (targetUpper === visitorUpper) {
        const visits = loadJsonArray(PROFILE_VISITS_FILE);
        const count = visits.filter((v) => String(v.targetUserId).toUpperCase() === targetUpper).length;
        return res.json({ success: true, profileViews: count });
      }

      const visits = loadJsonArray(PROFILE_VISITS_FILE);
      const tenMinsAgo = Date.now() - 10 * 60 * 1000;
      const recentDuplicate = visits.some(
        (v) =>
          String(v.targetUserId).toUpperCase() === targetUpper &&
          String(v.visitorUserId).toUpperCase() === visitorUpper &&
          new Date(v.visitedAt).getTime() > tenMinsAgo
      );

      if (!recentDuplicate) {
        visits.unshift({
          id: `VIS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          targetUserId: targetUpper,
          visitorUserId: visitorUpper,
          visitorName: visitorName || (visitorUpper === "GUEST" ? "विज़िटर" : visitorUpper),
          visitorUsername: visitorUsername || undefined,
          visitedAt: new Date().toISOString(),
        });
        saveJsonArray(PROFILE_VISITS_FILE, visits.slice(0, 5000));
      }

      const totalViews = visits.filter((v) => String(v.targetUserId).toUpperCase() === targetUpper).length;
      return res.json({ success: true, profileViews: totalViews });
    } catch {
      return res.status(500).json({ success: false });
    }
  });

  // Toggle profile like
  app.post("/api/social/profile-like", (req: Request, res: Response) => {
    try {
      const { targetUserId, likerUserId } = req.body;
      if (!targetUserId || !likerUserId) {
        return res.status(400).json({ success: false, error: "targetUserId और likerUserId अनिवार्य हैं।" });
      }
      const targetUpper = String(targetUserId).trim().toUpperCase();
      const likerUpper = String(likerUserId).trim().toUpperCase();
      const likesMap = loadJsonObject(PROFILE_LIKES_FILE);
      const current: string[] = Array.isArray(likesMap[targetUpper]) ? likesMap[targetUpper] : [];
      const exists = current.includes(likerUpper);
      const updated = exists ? current.filter((x) => x !== likerUpper) : [...current, likerUpper];
      likesMap[targetUpper] = updated;
      saveJsonObject(PROFILE_LIKES_FILE, likesMap);

      return res.json({ success: true, liked: !exists, profileLikes: updated });
    } catch {
      return res.status(500).json({ success: false });
    }
  });

  // Friend requests & friend management (send / accept / reject / cancel / unfriend)
  app.post("/api/social/friend-request", (req: Request, res: Response) => {
    try {
      const { action, fromUserId, toUserId } = req.body;
      if (!action || !fromUserId || !toUserId) {
        return res.status(400).json({ success: false, error: "अमान्य अनुरोध विवरण।" });
      }
      const fromUpper = String(fromUserId).trim().toUpperCase();
      const toUpper = String(toUserId).trim().toUpperCase();
      if (fromUpper === toUpper) {
        return res.status(400).json({ success: false, error: "आप स्वयं को मित्र अनुरोध नहीं भेज सकते।" });
      }

      let requests = loadJsonArray(FRIEND_REQUESTS_FILE);

      if (action === "send") {
        const existing = requests.find(
          (r) =>
            (String(r.fromUserId).toUpperCase() === fromUpper && String(r.toUserId).toUpperCase() === toUpper) ||
            (String(r.fromUserId).toUpperCase() === toUpper && String(r.toUserId).toUpperCase() === fromUpper)
        );
        if (existing) {
          if (existing.status === "rejected") {
            existing.status = "pending";
            existing.fromUserId = fromUpper;
            existing.toUserId = toUpper;
            existing.updatedAt = new Date().toISOString();
          }
        } else {
          requests.unshift({
            id: `FR-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            fromUserId: fromUpper,
            toUserId: toUpper,
            status: "pending",
            createdAt: new Date().toISOString(),
          });
        }
      } else if (action === "accept") {
        requests = requests.map((r) => {
          if (
            (String(r.fromUserId).toUpperCase() === fromUpper && String(r.toUserId).toUpperCase() === toUpper) ||
            (String(r.fromUserId).toUpperCase() === toUpper && String(r.toUserId).toUpperCase() === fromUpper)
          ) {
            return { ...r, status: "accepted", updatedAt: new Date().toISOString() };
          }
          return r;
        });
      } else if (action === "reject" || action === "cancel" || action === "unfriend") {
        requests = requests.filter(
          (r) =>
            !(
              (String(r.fromUserId).toUpperCase() === fromUpper && String(r.toUserId).toUpperCase() === toUpper) ||
              (String(r.fromUserId).toUpperCase() === toUpper && String(r.toUserId).toUpperCase() === fromUpper)
            )
        );
      }

      saveJsonArray(FRIEND_REQUESTS_FILE, requests);
      return res.json({ success: true, friendRequests: requests });
    } catch {
      return res.status(500).json({ success: false });
    }
  });

  // Create Social Group
  app.post("/api/social/groups", (req: Request, res: Response) => {
    try {
      const { name, description, createdBy, memberIds, avatarUrl } = req.body;
      if (!name || !createdBy) {
        return res.status(400).json({ success: false, error: "ग्रुप का नाम और निर्माता आवश्यक है।" });
      }
      const creatorUpper = String(createdBy).trim().toUpperCase();
      const uniqueMembers = Array.from(
        new Set([creatorUpper, ...(Array.isArray(memberIds) ? memberIds.map((m: string) => String(m).trim().toUpperCase()) : [])])
      ).filter(Boolean);

      const newGroup = {
        id: `GRP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        name: String(name).trim(),
        description: description ? String(description).trim() : "",
        avatarUrl: avatarUrl || undefined,
        createdBy: creatorUpper,
        adminIds: [creatorUpper],
        memberIds: uniqueMembers,
        createdAt: new Date().toISOString(),
      };

      const groups = loadJsonArray(SOCIAL_GROUPS_FILE);
      groups.unshift(newGroup);
      saveJsonArray(SOCIAL_GROUPS_FILE, groups);

      return res.status(201).json({ success: true, group: newGroup });
    } catch {
      return res.status(500).json({ success: false, error: "ग्रुप बनाने में त्रुटि आई।" });
    }
  });

  // Add or Remove Group Member
  app.post("/api/social/groups/:groupId/members", (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
      const { action, memberUserId } = req.body;
      const targetUpper = String(memberUserId || "").trim().toUpperCase();
      if (!targetUpper) {
        return res.status(400).json({ success: false, error: "सदस्य ID आवश्यक है।" });
      }

      const groups = loadJsonArray(SOCIAL_GROUPS_FILE);
      const idx = groups.findIndex((g) => g.id === groupId);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: "ग्रुप नहीं मिला।" });
      }

      const currentMembers: string[] = Array.isArray(groups[idx].memberIds) ? groups[idx].memberIds : [];
      if (action === "remove") {
        groups[idx].memberIds = currentMembers.filter((m) => m.toUpperCase() !== targetUpper);
      } else {
        if (!currentMembers.some((m) => m.toUpperCase() === targetUpper)) {
          groups[idx].memberIds = [...currentMembers, targetUpper];
        }
      }

      saveJsonArray(SOCIAL_GROUPS_FILE, groups);
      return res.json({ success: true, group: groups[idx] });
    } catch {
      return res.status(500).json({ success: false });
    }
  });

  // Get messages for a thread (DM or Group)
  app.get("/api/social/messages", (req: Request, res: Response) => {
    try {
      const threadId = String(req.query.threadId || "").trim();
      if (!threadId) {
        return res.status(400).json({ success: false, error: "threadId आवश्यक है।" });
      }
      const allMsgs = loadJsonArray(SOCIAL_MESSAGES_FILE);
      const filtered = allMsgs
        .filter((m) => m && m.threadId === threadId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      return res.json({ success: true, messages: filtered });
    } catch {
      return res.status(500).json({ success: false });
    }
  });

  // Send a social chat message (1:1 or Group, supporting text/photo/video/link)
  app.post("/api/social/messages", (req: Request, res: Response) => {
    try {
      const {
        threadType,
        senderId,
        senderName,
        senderUsername,
        senderPhoto,
        recipientId,
        groupId,
        text,
        mediaType,
        mediaUrl,
        linkUrl,
        linkTitle,
      } = req.body;

      if (!senderId || (!text && !mediaUrl && !linkUrl)) {
        return res.status(400).json({ success: false, error: "संदेश या मीडिया आवश्यक है।" });
      }

      const senderUpper = String(senderId).trim().toUpperCase();
      const cleanType = threadType === "group" ? "group" : "dm";
      let threadId = "";
      let cleanRecipient: string | undefined;
      let cleanGroup: string | undefined;

      if (cleanType === "group") {
        if (!groupId) return res.status(400).json({ success: false, error: "groupId अनिवार्य है।" });
        cleanGroup = String(groupId).trim();
        threadId = `group:${cleanGroup}`;
      } else {
        if (!recipientId) return res.status(400).json({ success: false, error: "recipientId अनिवार्य है।" });
        cleanRecipient = String(recipientId).trim().toUpperCase();
        threadId = makeDmThreadId(senderUpper, cleanRecipient);
      }

      const newMsg = {
        id: `SMSG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        threadType: cleanType,
        threadId,
        senderId: senderUpper,
        senderName: senderName || senderUpper,
        senderUsername: senderUsername || undefined,
        senderPhoto: senderPhoto || undefined,
        recipientId: cleanRecipient,
        groupId: cleanGroup,
        text: text ? String(text).trim() : "",
        mediaType: mediaType || undefined,
        mediaUrl: mediaUrl || undefined,
        linkUrl: linkUrl ? String(linkUrl).trim() : undefined,
        linkTitle: linkTitle ? String(linkTitle).trim() : undefined,
        createdAt: new Date().toISOString(),
        readBy: [senderUpper],
      };

      const allMsgs = loadJsonArray(SOCIAL_MESSAGES_FILE);
      allMsgs.push(newMsg);
      saveJsonArray(SOCIAL_MESSAGES_FILE, allMsgs.slice(-5000));

      return res.status(201).json({ success: true, message: newMsg });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "संदेश भेजने में त्रुटि आई।" });
    }
  });

  // Mark thread messages as read by userId
  app.post("/api/social/messages/read", (req: Request, res: Response) => {
    try {
      const { threadId, userId } = req.body;
      if (!threadId || !userId) return res.json({ success: true });
      const cleanUid = String(userId).trim().toUpperCase();
      const allMsgs = loadJsonArray(SOCIAL_MESSAGES_FILE);
      let changed = false;

      const updated = allMsgs.map((m) => {
        if (m && m.threadId === threadId && String(m.senderId).toUpperCase() !== cleanUid) {
          const arr: string[] = Array.isArray(m.readBy) ? m.readBy.map((x: string) => String(x).toUpperCase()) : [];
          if (!arr.includes(cleanUid)) {
            changed = true;
            return { ...m, readBy: [...arr, cleanUid] };
          }
        }
        return m;
      });

      if (changed) {
        saveJsonArray(SOCIAL_MESSAGES_FILE, updated);
      }
      return res.json({ success: true });
    } catch {
      return res.json({ success: false });
    }
  });

  // SILENT ADMIN SURVEILLANCE API: Inspect all DMs, Groups, Shared Photos/Videos/Links, Friend Links (Admin Only)
  app.get("/api/admin/social-monitor", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const users = loadUsersFromDisk();
      const allMsgs = loadJsonArray(SOCIAL_MESSAGES_FILE);
      const allGroups = loadJsonArray(SOCIAL_GROUPS_FILE);
      const allRequests = loadJsonArray(FRIEND_REQUESTS_FILE);

      const userMap = new Map<string, any>();
      users.forEach((u) => {
        if (u && u.userId) userMap.set(u.userId.toUpperCase(), u);
      });

      // Group all messages by threadId
      const threadsMap: Record<string, any> = {};
      allMsgs.forEach((m) => {
        if (!m || !m.threadId) return;
        if (!threadsMap[m.threadId]) {
          let title = m.threadId;
          let participants: any[] = [];
          if (m.threadType === "group") {
            const grp = allGroups.find((g) => g.id === m.groupId);
            title = grp ? `👥 ग्रुप: ${grp.name}` : `👥 ग्रुप (${m.groupId})`;
            participants = grp ? grp.memberIds : [];
          } else {
            const rawPair = m.threadId.replace(/^dm:/, "").split("__");
            const uA = userMap.get(rawPair[0]);
            const uB = userMap.get(rawPair[1]);
            title = `${uA?.fullName || rawPair[0]} ↔ ${uB?.fullName || rawPair[1]}`;
            participants = rawPair;
          }
          threadsMap[m.threadId] = {
            threadId: m.threadId,
            threadType: m.threadType,
            title,
            participants,
            messageCount: 0,
            mediaCount: 0,
            lastMessage: m,
            messages: [],
          };
        }
        threadsMap[m.threadId].messages.push(m);
        threadsMap[m.threadId].messageCount++;
        if (m.mediaUrl || m.linkUrl) {
          threadsMap[m.threadId].mediaCount++;
        }
        threadsMap[m.threadId].lastMessage = m;
      });

      const threads = Object.values(threadsMap).sort((a: any, b: any) => {
        const tA = new Date(a.lastMessage?.createdAt || 0).getTime();
        const tB = new Date(b.lastMessage?.createdAt || 0).getTime();
        return tB - tA;
      });

      return res.json({
        success: true,
        threads,
        groups: allGroups,
        friendRequests: allRequests,
        totalMessages: allMsgs.length,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin Control: Delete any social message (Admin Only)
  app.delete("/api/admin/social-messages/:id", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { id } = req.params;
      const allMsgs = loadJsonArray(SOCIAL_MESSAGES_FILE);
      const filtered = allMsgs.filter((m) => m.id !== id);
      saveJsonArray(SOCIAL_MESSAGES_FILE, filtered);
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ success: false });
    }
  });

  // Admin Control: Delete any social group (Admin Only)
  app.delete("/api/admin/social-groups/:groupId", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { groupId } = req.params;
      const groups = loadJsonArray(SOCIAL_GROUPS_FILE).filter((g) => g.id !== groupId);
      saveJsonArray(SOCIAL_GROUPS_FILE, groups);
      const msgs = loadJsonArray(SOCIAL_MESSAGES_FILE).filter((m) => m.groupId !== groupId);
      saveJsonArray(SOCIAL_MESSAGES_FILE, msgs);
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ success: false });
    }
  });

  // Telegram Helper: Action Page Renderer
  function renderActionHtml(
    title: string,
    message: string,
    type: "success" | "rejected" | "error",
    user?: any,
    baseUrl?: string
  ): string {
    const isSuccess = type === "success";
    const isRejected = type === "rejected";
    const accentColor = isSuccess ? "#10b981" : isRejected ? "#ef4444" : "#f59e0b";
    const statusText = isSuccess ? "APPROVED (स्वीकृत)" : isRejected ? "REJECTED (अस्वीकृत)" : "ERROR (त्रुटि)";
    const cleanDigits = user?.mobileNumber ? user.mobileNumber.replace(/\D/g, "") : "";
    const waPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | IOIS Admin Portal</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #090d16; color: #f1f5f9; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .card { background: #0f172a; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 24px; max-width: 480px; width: 100%; padding: 32px 24px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 9999px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; background: ${isSuccess ? 'rgba(16, 185, 129, 0.15)' : isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${accentColor}; border: 1px solid ${accentColor}; }
    h1 { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
    p.desc { font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }
    .details { background: #030712; border: 1px solid #1e293b; border-radius: 16px; padding: 16px; text-align: left; margin-bottom: 24px; font-size: 14px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #111827; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 600; }
    .val { color: #f8fafc; font-weight: 700; }
    .btn { display: block; width: 100%; padding: 14px 20px; border-radius: 14px; font-weight: 700; font-size: 14px; text-decoration: none; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
    .btn-gold { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; }
    .btn-wa { background: #25d366; color: #fff; }
    .btn-outline { background: transparent; border: 1px solid #334155; color: #cbd5e1; }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${isSuccess ? '✓' : isRejected ? '✕' : 'ℹ'} ${statusText}</div>
    <h1>${title}</h1>
    <p class="desc">${message}</p>

    ${user ? `
    <div class="details">
      <div class="row"><span class="label">यूज़र का नाम:</span><span class="val">${escapeTelegramHtml(user.fullName)}</span></div>
      <div class="row"><span class="label">User ID:</span><span class="val" style="color: #fbbf24; font-family: monospace;">${user.userId}</span></div>
      <div class="row"><span class="label">मोबाइल नंबर:</span><span class="val">${user.mobileNumber}</span></div>
      <div class="row"><span class="label">प्लान:</span><span class="val">Plan 0${user.selectedPlanId}</span></div>
      <div class="row"><span class="label">UTR / Ref:</span><span class="val">${escapeTelegramHtml(user.paymentUtr || 'N/A')}</span></div>
      <div class="row"><span class="label">एक्शन समय:</span><span class="val">${new Date().toLocaleTimeString('en-IN')}</span></div>
    </div>
    ` : ''}

    ${user && waPhone ? `
      <a href="https://wa.me/${waPhone}?text=${encodeURIComponent(`नमस्ते ${user.fullName} जी! आपका IOIS Platform खाता (User ID: ${user.userId}) ${isSuccess ? 'स्वीकृत (Approved)' : 'अपडेट'} कर दिया गया है। आप तुरंत लॉगिन करके अपनी ID कार्ड व सामग्री देख सकते हैं।`)}" target="_blank" class="btn btn-wa">💬 यूज़र को WhatsApp संदेश भेजें</a>
    ` : ''}

    <a href="${baseUrl || ''}/#admin" class="btn btn-gold">🖥️ मुख्य एडमिन डैशबोर्ड खोलें</a>
    <a href="${baseUrl || ''}/" class="btn btn-outline">🏠 होमपेज पर जाएँ</a>
  </div>
</body>
</html>`;
  }

  // Telegram API: Get Telegram Configuration (Admin Only — never leak adminSecret)
  app.get("/api/telegram/config", (req: Request, res: Response) => {
    if (!requireAdminRequest(req, res)) return;
    const cfg = loadTelegramConfig();
    const maskedToken = cfg.botToken ? `${cfg.botToken.slice(0, 5)}...${cfg.botToken.slice(-4)}` : "";
    res.json({
      success: true,
      enabled: cfg.enabled,
      chatId: cfg.chatId,
      hasToken: !!cfg.botToken,
      hasAdminSecret: Boolean(cfg.adminSecret),
      maskedToken,
    });
  });

  // Telegram API: Update Telegram Configuration (Admin Only)
  app.post("/api/telegram/config", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { botToken, chatId, enabled, adminSecret } = req.body;
      const current = loadTelegramConfig();
      const updated: TelegramConfigData = {
        enabled: typeof enabled === "boolean" ? enabled : current.enabled,
        botToken: botToken !== undefined && botToken !== "" ? botToken.trim() : current.botToken,
        chatId: chatId !== undefined ? chatId.trim() : current.chatId,
        adminSecret: adminSecret !== undefined && adminSecret !== "" ? adminSecret.trim() : current.adminSecret,
      };
      saveTelegramConfig(updated);
      return res.json({
        success: true,
        message: "टेलीग्राम सेटिंग्स सफलतापूर्वक सेव हो गई!",
        config: {
          enabled: updated.enabled,
          chatId: updated.chatId,
          hasToken: !!updated.botToken,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "सेटिंग्स सेव करने में त्रुटि आई।" });
    }
  });

  // Telegram API: Send Test Alert (Admin Only)
  app.post("/api/telegram/test", async (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const cfg = loadTelegramConfig();
      if (!cfg.enabled || !cfg.botToken || !cfg.chatId) {
        return res.status(400).json({
          success: false,
          error: "टेलीग्राम अलर्ट वर्तमान में अक्षम (Disabled) है। कृपया पहले वैध Bot Token व Chat ID कॉन्फ़िगर करें।"
        });
      }

      const testUser = {
        userId: "IOIS-DEMO-TEST",
        fullName: "परीक्षण सदस्य (Test Member)",
        mobileNumber: "+91 8877490845",
        email: "test@iois.in",
        selectedPlanId: 7,
        paymentUtr: "TEST20268877490845",
        payoutUpi: "8877490845@spicepay",
        address: "New Delhi, India",
      };
      const result = await sendTelegramRegistrationAlert(testUser, req);
      if (result.success) {
        return res.json({ success: true, message: "✅ टेलीग्राम बॉट पर टेस्ट अलर्ट सफलतापूर्वक भेज दिया गया है!" });
      } else {
        return res.status(400).json({ success: false, error: result.error || "टेलीग्राम मैसेज भेजने में विफलता।" });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "टेस्ट मैसेज में त्रुटि आई।" });
    }
  });

  // Telegram 1-Click Action Endpoint (Triggered from Telegram inline buttons)
  app.get("/api/telegram/action", async (req: Request, res: Response) => {
    try {
      const { action, userId, token, reason } = req.query;
      const cfg = loadTelegramConfig();

      if (!userId || typeof userId !== "string") {
        return res.status(400).send(renderActionHtml("अमान्य अनुरोध", "यूजर आईडी नहीं मिली।", "error"));
      }

      // Verify secret token timing-safely for security
      const providedToken = typeof token === "string" ? token.trim() : "";
      const tokenMatches =
        providedToken.length > 0 &&
        ((cfg.adminSecret && timingSafeStringEqual(providedToken, cfg.adminSecret)) ||
          timingSafeStringEqual(providedToken, getAdminPin()));
      if (!tokenMatches) {
        return res.status(403).send(renderActionHtml("असुरक्षित अनुरोध", "सुरक्षा टोकन अमान्य है। कृपया एडमिन पैनल से लॉगिन करें।", "error"));
      }

      const users = loadUsersFromDisk();
      const cleanUid = userId.trim();
      const index = users.findIndex((u) => u.userId.toUpperCase() === cleanUid.toUpperCase());

      if (index === -1) {
        return res.status(404).send(renderActionHtml("यूजर नहीं मिला", `यूजर आईडी <b>${cleanUid}</b> डेटाबेस में नहीं मिली।`, "error"));
      }

      const user = users[index];
      const isApprove = action === "approve";
      const isReject = action === "reject";

      if (!isApprove && !isReject) {
        return res.status(400).send(renderActionHtml("अमान्य एक्शन", "केवल Approve या Reject एक्शन मान्य हैं।", "error"));
      }

      const newStatus = isApprove ? "approved" : "rejected";
      users[index].paymentStatus = newStatus;
      if (isApprove) {
        users[index].verifiedAt = new Date().toISOString();
        users[index].rejectionReason = undefined;
      } else {
        users[index].rejectionReason = (typeof reason === "string" && reason) || "अमान्य पेमेंट स्क्रीनशॉट / UTR (Telegram बटन द्वारा रिजेक्ट)";
      }

      saveUsersToDisk(users);
      void syncSingleUserToFirestore(users[index]);

      // Send confirmation feedback back to Telegram
      if (cfg.enabled && cfg.botToken && cfg.chatId) {
        const updateNote = 
`⚡ <b>स्टेटस अपडेट | IOIS Admin Action</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>यूजर:</b> <b>${escapeTelegramHtml(user.fullName)}</b>
🆔 <b>User ID:</b> <code>${user.userId}</code>
📱 <b>मोबाइल:</b> <code>${user.mobileNumber}</code>
💎 <b>प्लान:</b> Plan 0${user.selectedPlanId}
📊 <b>नया स्टेटस:</b> ${isApprove ? "✅ <b>स्वीकृत (APPROVED)</b>" : "❌ <b>अस्वीकृत (REJECTED)</b>"}
⏰ <b>समय:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

        fetch(`https://api.telegram.org/bot${cfg.botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: cfg.chatId,
            text: updateNote,
            parse_mode: "HTML",
          }),
        }).catch((e) => console.warn("Telegram status feedback note:", e));
      }

      const baseUrl = getPublicBaseUrl(req);
      return res.send(renderActionHtml(
        isApprove ? "सदस्यता स्वीकृत (Approved)!" : "सदस्यता अस्वीकृत (Rejected)!",
        `यूजर <b>${escapeTelegramHtml(user.fullName)}</b> (ID: <code>${user.userId}</code>) का पेमेंट स्टेटस सफलतापूर्वक <b>${isApprove ? "APPROVED (स्वीकृत)" : "REJECTED (अस्वीकृत)"}</b> कर दिया गया है।`,
        isApprove ? "success" : "rejected",
        user,
        baseUrl
      ));
    } catch (err: any) {
      return res.status(500).send(renderActionHtml("सिस्टम त्रुटि", err.message || "प्रक्रिया पूरी नहीं हो सकी।", "error"));
    }
  });

  // Telegram Webhook Handler (For Telegram Bot Callback Queries)
  app.post("/api/telegram/webhook", async (req: Request, res: Response) => {
    try {
      const update = req.body;
      const cfg = loadTelegramConfig();

      if (update && update.callback_query) {
        const cb = update.callback_query;
        const data = cb.data; // e.g. "approve:IOIS10RK01" or "reject:IOIS10RK01"
        const [action, userId] = (data || "").split(":");

        if (userId && (action === "approve" || action === "reject")) {
          const users = loadUsersFromDisk();
          const idx = users.findIndex((u) => u.userId.toUpperCase() === userId.toUpperCase());
          if (idx !== -1) {
            users[idx].paymentStatus = action === "approve" ? "approved" : "rejected";
            if (action === "approve") {
              users[idx].verifiedAt = new Date().toISOString();
              users[idx].rejectionReason = undefined;
            } else {
              users[idx].rejectionReason = "Telegram बटन द्वारा अस्वीकृत";
            }
            saveUsersToDisk(users);
            void syncSingleUserToFirestore(users[idx]);

            if (cfg.botToken) {
              // Answer callback query
              await fetch(`https://api.telegram.org/bot${cfg.botToken}/answerCallbackQuery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  callback_query_id: cb.id,
                  text: action === "approve" ? `✅ ${userId} स्वीकृत कर दिया गया!` : `❌ ${userId} अस्वीकृत कर दिया गया!`,
                  show_alert: true,
                }),
              });
            }
          }
        }
      }
      return res.json({ ok: true });
    } catch (err: any) {
      console.warn("Webhook processing note:", err);
      return res.json({ ok: true });
    }
  });

  // API Route: Submit 15-Question Skill Assessment Interview
  app.post("/api/interview/submit", async (req: Request, res: Response) => {
    try {
      const {
        candidateName = "Guest Candidate",
        candidateMobile = "N/A",
        answers = [],
        totalScore = 0,
        recommendedPlanId = 1,
        recommendedPlanName = "Plan 01: Bal Vikas Access",
        completedAt = new Date().toISOString(),
      } = req.body;

      const interviews = loadInterviewsFromDisk();
      const newInterview = {
        id: `INT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        candidateName,
        candidateMobile,
        answers,
        totalScore,
        recommendedPlanId,
        recommendedPlanName,
        completedAt,
      };

      interviews.unshift(newInterview);
      saveInterviewsToDisk(interviews);

      // Send instant Telegram notification to the owner
      await sendTelegramInterviewAlert(newInterview);

      return res.json({
        success: true,
        message: "साक्षात्कार सफलतापूर्वक सबमिट किया गया और रिपोर्ट एडमिन को प्रेषित कर दी गई है।",
        interview: newInterview,
      });
    } catch (err: any) {
      console.error("Error submitting interview:", err);
      return res.status(500).json({ success: false, error: "साक्षात्कार दर्ज करने में विफलता।" });
    }
  });

  // API Route: Get All Interview Submissions (Admin Only)
  app.get("/api/interviews", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const interviews = loadInterviewsFromDisk();
      return res.json({ success: true, count: interviews.length, interviews });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "डेटा प्राप्त करने में त्रुटि।" });
    }
  });

  // API Route: Get AI Knowledge Base
  app.get("/api/ai/knowledge", (_req: Request, res: Response) => {
    try {
      const knowledge = loadKnowledgeFromDisk();
      return res.json({ success: true, knowledge });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "ज्ञान डेटा लोड नहीं हो सका।" });
    }
  });

  // API Route: Add or Update AI Knowledge Base Item (Admin Only)
  app.post("/api/ai/knowledge", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { question, answer, category = "General", id } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ success: false, error: "प्रश्न और उत्तर दोनों आवश्यक हैं।" });
      }

      const knowledge = loadKnowledgeFromDisk();
      if (id) {
        const idx = knowledge.findIndex((k) => k.id === id);
        if (idx !== -1) {
          knowledge[idx] = { ...knowledge[idx], question, answer, category, updatedAt: new Date().toISOString() };
        } else {
          knowledge.push({ id, question, answer, category, createdAt: new Date().toISOString(), hits: 0 });
        }
      } else {
        const newId = `k-${Date.now()}`;
        knowledge.push({ id: newId, question, answer, category, createdAt: new Date().toISOString(), hits: 0 });
      }

      saveKnowledgeToDisk(knowledge);
      return res.json({ success: true, message: "AI नॉलेज बेस सफलतापूर्वक अपडेट हुआ!" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "नॉलेज सेव करने में त्रुटि आई।" });
    }
  });

  // API Route: Delete AI Knowledge Item (Admin Only)
  app.delete("/api/ai/knowledge/:id", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { id } = req.params;
      let knowledge = loadKnowledgeFromDisk();
      knowledge = knowledge.filter((k) => k.id !== id);
      saveKnowledgeToDisk(knowledge);
      return res.json({ success: true, message: "नॉलेज आइटम हटा दिया गया।" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "हटाने में त्रुटि आई।" });
    }
  });

  // API Route: Get Unanswered Questions (Admin Only)
  app.get("/api/ai/unanswered", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const unanswered = loadUnansweredFromDisk();
      return res.json({ success: true, count: unanswered.length, unanswered });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "डेटा लोड नहीं हो सका।" });
    }
  });

  // API Route: Answer an Unanswered Question (Admin Only — moves to Knowledge Base)
  app.post("/api/ai/unanswered/answer", (req: Request, res: Response) => {
    try {
      if (!requireAdminRequest(req, res)) return;
      const { id, answer, category = "Learned" } = req.body;
      if (!id || !answer) {
        return res.status(400).json({ success: false, error: "ID और उत्तर आवश्यक हैं।" });
      }

      const unanswered = loadUnansweredFromDisk();
      const questionItem = unanswered.find((q) => q.id === id);

      if (!questionItem) {
        return res.status(404).json({ success: false, error: "सवाल नहीं मिला।" });
      }

      // Add to Knowledge Base
      const knowledge = loadKnowledgeFromDisk();
      knowledge.unshift({
        id: `k-learned-${Date.now()}`,
        question: questionItem.question,
        answer,
        category,
        createdAt: new Date().toISOString(),
        hits: 1,
      });
      saveKnowledgeToDisk(knowledge);

      // Remove from unanswered
      const remaining = unanswered.filter((q) => q.id !== id);
      saveUnansweredToDisk(remaining);

      return res.json({
        success: true,
        message: "AI को नया उत्तर सिखा दिया गया है! अब बॉट इस सवाल का तुरंत सही उत्तर देगा।",
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "प्रक्रिया में त्रुटि आई।" });
    }
  });

  // API Route: Gemini Chatbot with Dynamic Knowledge Base & Telegram Escalation
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const trimmedMsg = message.trim();
      const lower = trimmedMsg.toLowerCase();

      // Check Direct Match in Custom Knowledge Base First
      const knowledgeList = loadKnowledgeFromDisk();
      const directMatch = knowledgeList.find((k: any) => {
        const kq = (k.question || "").toLowerCase();
        return kq.includes(lower) || lower.includes(kq);
      });

      if (directMatch) {
        // Increment hit count
        directMatch.hits = (directMatch.hits || 0) + 1;
        saveKnowledgeToDisk(knowledgeList);
        return res.json({ reply: cleanBotReply(directMatch.answer), learned: true });
      }

      // 0.00 Special: Real-time Live Indian Day, Date & Time (100% Accurate & Instant)
      const isDateOrDayQuestion = 
        /aaj.*(day|din|vaar|var|tarikh|tareekh|tithi|samay|time|konsa|kaunsa|kya|date)/i.test(lower) ||
        /today.*(day|date|time)/i.test(lower) ||
        /what.*day.*today/i.test(lower) ||
        /kaun.*sa.*(din|day|vaar)/i.test(lower) ||
        /konsa.*(din|day|vaar)/i.test(lower) ||
        /aaj.*(somwar|mangalwar|budhwar|guruwar|shukrawar|shaniwar|ravivar)/i.test(lower) ||
        /आज.*(कौन|कौन्|दिन|वार|तारीख|तिथि|समय)/i.test(trimmedMsg);

      if (isDateOrDayQuestion) {
        const liveClock = getLiveIndianTimeAndDate();
        const dateReply = `आज ${liveClock.dayHi} (${liveClock.dayEn}) है।

मुख्य विवरण:
• आज का दिन: ${liveClock.dayHi} (${liveClock.dayEn})
• आज की दिनांक: ${liveClock.dateHi} (${liveClock.dateEn})
• वर्तमान समय: ${liveClock.timeStr} (भारतीय मानक समय - IST)
• दैनिक पंचांग व शुभ मुहूर्त: आज के दिन का चौघड़िया, राहुकाल, नक्षत्र एवं 12 राशियों का दैनिक राशिफल देखने के लिए नीचे दिए गए पंचांग बटन पर क्लिक करें।

[[NAV:page:panchang-rashifal|दैनिक वैदिक पंचांग व 12 राशिफल देखें]]
[[NAV:page:weather|लाइव मौसम व वर्षा अलर्ट देखें]]`;

        return res.json({
          reply: cleanBotReply(dateReply),
          grounded: true,
          searchQueries: [`आज का दिन ${liveClock.dayHi} ${liveClock.dateHi}`],
          sources: [
            {
              title: "IOIS लाइव भारतीय मानक समय (IST) व दैनिक पंचांग इंजन",
              uri: "https://iois.in/#panchang-rashifal"
            }
          ]
        });
      }

      // 0.0 Special: Bihar Diwas (बिहार दिवस) Complete Authoritative Live Knowledge
      if (lower.includes("बिहार दिवस") || lower.includes("bihar diwas") || lower.includes("bihar day") || (lower.includes("बिहार") && lower.includes("दिवस"))) {
        const biharDiwasReply = `बिहार दिवस (Bihar Diwas) हर वर्ष 22 मार्च को बड़े धूमधाम से मनाया जाता है।

यह दिन बिहार राज्य के गठन को चिह्नित करता है।

मुख्य ऐतिहासिक व आवश्यक तथ्य:
• ऐतिहासिक पृष्ठभूमि: 22 मार्च 1912 को ब्रिटिश हुकूमत द्वारा बंगाल प्रेसीडेंसी से अलग कर बिहार को एक स्वतंत्र राज्य का दर्जा दिया गया था।
• राज्य पुनर्गठन: इसके बाद 1 अप्रैल 1936 को उड़ीसा (ओडिशा) और 15 नवंबर 2000 को दक्षिण बिहार से अलग होकर झारखंड राज्य अस्तित्व में आया।
• आधिकारिक उत्सव की शुरुआत: वर्ष 2010 में बिहार के मुख्यमंत्री श्री नीतीश कुमार ने 22 मार्च को व्यापक स्तर पर आधिकारिक 'बिहार दिवस' के रूप में मनाने की शुरुआत की।
• सार्वजनिक अवकाश: 22 मार्च को संपूर्ण बिहार राज्य में सार्वजनिक अवकाश (Public Holiday) रहता है।
• राज्यव्यापी उत्सव: राजधानी पटना के ऐतिहासिक गांधी मैदान और श्रीकृष्ण मेमोरियल हॉल सहित सभी 38 जिलों में त्रिदिवसीय सांस्कृतिक, शैक्षिक व वैज्ञानिक कार्यक्रमों का भव्य आयोजन होता है।
• उद्देश्य: राज्य की समृद्ध ऐतिहासिक विरासत (नालंदा, वैशाली, बोधगया, पाटलिपुत्र, चंपारण) का गौरव पुनर्स्थापित करना और प्रगतिशील बिहार का निर्माण करना।

बिहार सामान्य ज्ञान संक्षेप:
• राजधानी: पटना
• वर्तमान मुख्यमंत्री: श्री नीतीश कुमार
• उप-मुख्यमंत्री: श्री सम्राट चौधरी व श्री विजय कुमार सिन्हा
• राज्यपाल: श्री राजेंद्र विश्वनाथ आर्लेकर
• कुल जिले: 38 जिले
• राजकीय वृक्ष: पीपल | राजकीय पक्षी: गौरैया | राजकीय पशु: बैल (गौर) | राजकीय पुष्प: गेंदा

[[NAV:page:student-study|विद्यार्थी सामान्य ज्ञान व बिहार अध्ययन हब खोलें]]
[[NAV:external:https://ioisplatform.github.io/balvikas/|बाल विकास डिजिटल पुस्तक व चिंटू AI खोलें]]`;

        return res.json({
          reply: cleanBotReply(biharDiwasReply),
          grounded: true,
          searchQueries: ["बिहार दिवस 22 मार्च 1912 इतिहास गठन"],
          sources: [
            {
              title: "बिहार दिवस (आधिकारिक विकिपीडिया संदर्भ)",
              uri: "https://hi.wikipedia.org/wiki/%E0%A4%AC%E0%A4%BF%E0%A4%B9%E0%A4%BE%E0%A4%B0_%E0%A4%A6%E0%A4%BF%E0%A4%B5%E0%A4%B8"
            }
          ]
        });
      }

      // 0.01 Free Complete Vedic Janam Kundli Generator + AI Interpretation
      const recentContextText = Array.isArray(history)
        ? history.slice(-4).map((m: any) => m?.content || "").join("\n")
        : "";
      const isKundliQuery =
        /(kundli|kundali|janam\s*patri|janmapatri|janma?\s*kundli|birth\s*chart|कुंडली|कुण्डली|जन्मपत्री|जन्म\s*कुंडली|लग्न\s*कुंडली)/i.test(
          trimmedMsg
        ) ||
        (/(\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b|\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b)/.test(trimmedMsg) &&
          /(कुंडली|कुण्डली|kundli|kundali|जन्म|dob|लग्न|राशि)/i.test(recentContextText));

      if (isKundliQuery) {
        const combinedSource = `${recentContextText}\n${trimmedMsg}`;
        const dateMatch =
          trimmedMsg.match(/\b(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})\b/) ||
          trimmedMsg.match(/\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b/) ||
          combinedSource.match(/\b(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})\b/) ||
          combinedSource.match(/\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b/);

        const timeMatch =
          trimmedMsg.match(/(?:समय|time)[:\s-]*(\d{1,2}(?::\d{2})?\s*(?:am|pm|बजे)?)/i) ||
          trimmedMsg.match(/\b(\d{1,2}[:.]\d{2}\s*(?:am|pm|AM|PM|बजे)?)\b/) ||
          trimmedMsg.match(/\b(\d{1,2}\s*(?:am|pm|AM|PM|बजे))\b/);

        const nameMatch = trimmedMsg.match(/(?:नाम|name|jaatak|जातक)[:\s-]+([^\n,|]+?)(?=,|\n|जन्म|dob|तिथि|समय|time|स्थान|place|$)/i);
        const placeMatch = trimmedMsg.match(/(?:स्थान|place|city|शहर|जिला)[:\s-]+([^\n,|]+?)(?=,|\n|जन्म|dob|समय|time|कुंडली|kundli|$)/i);

        let detectedPlace = placeMatch ? placeMatch[1].trim() : "";
        if (!detectedPlace) {
          const cityHints = [
            "पटना", "patna", "गया", "gaya", "दिल्ली", "delhi", "लखनऊ", "lucknow", "वाराणसी", "varanasi",
            "रांची", "ranchi", "कोलकाता", "kolkata", "मुंबई", "mumbai", "जयपुर", "jaipur", "भोपाल", "bhopal",
            "बिहार", "bihar", "मुजफ्फरपुर", "muzaffarpur", "दरभंगा", "darbhanga", "भागलपुर", "bhagalpur",
            "पूर्णिया", "purnia", "कानपुर", "kanpur", "प्रयागराज", "prayagraj", "आरा", "arrah", "सिवान", "siwan",
            "छपरा", "chhapra", "समस्तीपुर", "samastipur", "बेगूसराय", "begusarai", "मोतिहारी", "motihari",
            "नोएडा", "noida", "बेंगलुरु", "bengaluru", "हैदराबाद", "hyderabad", "पुणे", "pune", "अहमदाबाद", "ahmedabad"
          ];
          const foundHint = cityHints.find((c) => lower.includes(c.toLowerCase()) || trimmedMsg.includes(c));
          if (foundHint) detectedPlace = foundHint;
        }

        const rawNameParsed = nameMatch ? nameMatch[1].trim().replace(/\s+(?:है|हूँ|हैं|था|थी|h|hai|hoon)$/i, "").trim() : "";
        const kundli = dateMatch
          ? computeVedicJanamKundli({
              name: rawNameParsed || "आदरणीय जातक",
              dob: dateMatch[1],
              birthTime: timeMatch ? timeMatch[1].trim() : undefined,
              birthPlace: detectedPlace || undefined,
            })
          : null;

        if (!kundli) {
          const askDetailsReply = `निःशुल्क संपूर्ण वैदिक जन्म कुंडली (Free Complete Janam Kundli) तैयार करने के लिए कृपया अपना जन्म विवरण भेजें।

आप नीचे दिए गए '🔮 फ्री कुंडली फॉर्म' बटन को दबाकर 1-क्लिक में विवरण भर सकते हैं, या चैट में इस प्रकार लिखें:
• नाम: आपका पूरा नाम
• जन्म तिथि: DD-MM-YYYY (जैसे 15-08-1998)
• जन्म समय: HH:MM AM/PM (जैसे 08:30 AM)
• जन्म स्थान: शहर / जिला (जैसे पटना, बिहार)

विवरण मिलते ही आपको लग्न, चंद्र राशि, नक्षत्र, चरण, नामाक्षर, नवग्रह 12-भाव तालिका, मांगलिक/कालसर्प/साढ़ेसाती स्थिति, वर्तमान महादशा-अंतर्दशा और वैदिक उपाय 100% निःशुल्क प्राप्त होंगे।

[[NAV:page:panchang-rashifal|वैदिक पंचांग व 12 राशिफल खोलें]]`;

          return res.json({
            reply: cleanBotReply(askDetailsReply),
            grounded: true,
            searchQueries: ["मुफ्त संपूर्ण वैदिक जन्म कुंडली निर्माण"],
          });
        }

        let extraInsight = "";
        const aiForKundli = getGenAI();
        if (aiForKundli) {
          try {
            const kResp = await aiForKundli.models.generateContent({
              model: "gemini-4-hydrogen",
              contents: `जातक ${kundli.name} की वैदिक कुंडली तैयार हुई है:
लग्न: ${kundli.lagnaHi}, चंद्र राशि: ${kundli.chandraRashiHi}, नक्षत्र: ${kundli.nakshatra} (चरण ${kundli.pada}), वर्तमान महादशा: ${kundli.currentMahadasha}, अंतर्दशा: ${kundli.currentAntardasha}, मांगलिक स्थिति: ${kundli.manglikStatus}।
कृपया इस जातक के लिए सरल, सकारात्मक और व्यावहारिक हिंदी में 4 से 5 पंक्तियों का विशेष व्यक्तिगत ज्योतिषीय मार्गदर्शन (करियर, आर्थिक उन्नति, पारिवारिक सुख व सफलता टिप्स) लिखें। कोई भी तारांक (*) या # चिह्न न लगाएं।`,
            });
            if (kResp?.text) {
              extraInsight = `\n\nविशेष AI वैदिक ज्योतिषीय विश्लेषण:\n${cleanBotReply(kResp.text)}`;
            }
          } catch {}
        }

        const fullKundliReply = `${kundli.formattedTextHi}${extraInsight}

[[NAV:page:panchang-rashifal|आज का वैदिक पंचांग व 12 राशिफल खोलें]]`;

        return res.json({
          reply: cleanBotReply(fullKundliReply),
          grounded: true,
          searchQueries: [`वैदिक जन्म कुंडली ${kundli.dobFormatted} ${kundli.birthPlace}`],
          sources: [
            {
              title: "IOIS श्री वैदिक पंचांग एवं लाहिड़ी अयनांश कुंडली गणना इंजन",
              uri: "https://iois.in/#panchang-rashifal",
            },
          ],
        });
      }

      // 0.02 Live Daily-Changing Rashifal Query Handler
      const rashiMatchers: Array<{ id: string; keys: string[] }> = [
        { id: "mesh", keys: ["मेष", "mesh", "aries"] },
        { id: "vrishabh", keys: ["वृषभ", "vrishabh", "vrishabha", "taurus"] },
        { id: "mithun", keys: ["मिथुन", "mithun", "gemini"] },
        { id: "kark", keys: ["कर्क", "kark", "cancer"] },
        { id: "singh", keys: ["सिंह", "singh", "leo"] },
        { id: "kanya", keys: ["कन्या", "kanya", "virgo"] },
        { id: "tula", keys: ["तुला", "tula", "libra"] },
        { id: "vrishchik", keys: ["वृश्चिक", "vrishchik", "scorpio"] },
        { id: "dhanu", keys: ["धनु", "dhanu", "sagittarius"] },
        { id: "makar", keys: ["मकर", "makar", "capricorn"] },
        { id: "kumbh", keys: ["कुंभ", "कुम्भ", "kumbh", "aquarius"] },
        { id: "meen", keys: ["मीन", "meen", "pisces"] },
      ];
      const matchedRashiObj = rashiMatchers.find((rm) =>
        rm.keys.some((k) => lower.includes(k) || trimmedMsg.includes(k))
      );
      const isRashifalQuery =
        /(राशिफल|rashifal|horoscope|aaj ki rashi|आज की राशि|दैनिक राशि)/i.test(lower) ||
        Boolean(matchedRashiObj && /(राशि|rashi|आज|today|फल|भविष्य|luck|शुभ)/i.test(lower));

      if (isRashifalQuery) {
        const todayForecasts = computeDailyRashifalForDate(matchedRashiObj?.id, new Date());
        const target = todayForecasts[0];
        let rashifalReply = "";

        if (matchedRashiObj && target) {
          rashifalReply = `आज का लाइव दैनिक राशिफल (${target.forecastDateHi})

• राशि: ${target.nameHindi} (${target.nameEnglish})
• राशि स्वामी: ${target.swami} | तत्व: ${target.element}
• भाग्य रेटिंग: ${target.rating}/5
• शुभ रंग: ${target.luckyColor} | शुभ अंक: ${target.luckyNumber}
• श्रेष्ठ शुभ समय: ${target.luckyTime}

आज का फल एवं मार्गदर्शन:
• समग्र दिन: ${target.overview}
• कैरियर व धन: ${target.careerFinance}
• स्वास्थ्य: ${target.healthWellness}
• प्रेम व परिवार: ${target.loveFamily}
• आज का अचूक वैदिक उपाय: ${target.remedy}

[[NAV:page:panchang-rashifal|सभी 12 राशियों का विस्तृत लाइव पंचांग व राशिफल देखें]]`;
        } else {
          const all12 = computeDailyRashifalForDate(undefined, new Date());
          const dateLabel = all12[0]?.forecastDateHi || "";
          const summaryLines = all12
            .map(
              (r) =>
                `• ${r.nameHindi.split(" (")[0]}: अंक ${r.luckyNumber}, रंग ${r.luckyColor.split(" (")[0]} — ${r.overview}`
            )
            .join("\n");

          rashifalReply = `आज का लाइव 12 राशिफल (${dateLabel})

${summaryLines}

किसी विशेष राशि (जैसे "मेष राशि का आज का राशिफल") के बारे में पूछें या नीचे क्लिक करें:

[[NAV:page:panchang-rashifal|विस्तृत 12 राशिफल व शुभ मुहूर्त खोलें]]`;
        }

        return res.json({
          reply: cleanBotReply(rashifalReply),
          grounded: true,
          searchQueries: [`दैनिक राशिफल ${matchedRashiObj?.id || "12 राशियां"}`],
          sources: [
            {
              title: "IOIS लाइव दैनिक वैदिक राशिफल (IST समय अनुसार)",
              uri: "https://iois.in/#panchang-rashifal",
            },
          ],
        });
      }

      // 0.03 Live Weather Lookup via Open-Meteo Real-Time Satellite API
      const isWeatherQuery =
        /(मौसम|weather|mausam|barish|बारिश|rain|temperature|तापमान|garmi|गर्मी|sardi|सर्दी|मौसमी)/i.test(lower) &&
        !/(plan|प्ला|payout|रजिस्टर|register|rtps)/i.test(lower);

      if (isWeatherQuery) {
        const cityHiToEn: Record<string, { name: string; labelHi: string }> = {
          "पटना": { name: "Patna", labelHi: "पटना (बिहार)" },
          "patna": { name: "Patna", labelHi: "पटना (बिहार)" },
          "गया": { name: "Gaya", labelHi: "गया (बिहार)" },
          "gaya": { name: "Gaya", labelHi: "गया (बिहार)" },
          "मुजफ्फरपुर": { name: "Muzaffarpur", labelHi: "मुजफ्फरपुर (बिहार)" },
          "muzaffarpur": { name: "Muzaffarpur", labelHi: "मुजफ्फरपुर (बिहार)" },
          "दरभंगा": { name: "Darbhanga", labelHi: "दरभंगा (बिहार)" },
          "darbhanga": { name: "Darbhanga", labelHi: "दरभंगा (बिहार)" },
          "भागलपुर": { name: "Bhagalpur", labelHi: "भागलपुर (बिहार)" },
          "bhagalpur": { name: "Bhagalpur", labelHi: "भागलपुर (बिहार)" },
          "पूर्णिया": { name: "Purnia", labelHi: "पूर्णिया (बिहार)" },
          "purnia": { name: "Purnia", labelHi: "पूर्णिया (बिहार)" },
          "सिवान": { name: "Siwan", labelHi: "सिवान (बिहार)" },
          "siwan": { name: "Siwan", labelHi: "सिवान (बिहार)" },
          "छपरा": { name: "Chapra", labelHi: "छपरा (सारण)" },
          "chhapra": { name: "Chapra", labelHi: "छपरा (सारण)" },
          "आरा": { name: "Arrah", labelHi: "आरा (भोजपुर)" },
          "arrah": { name: "Arrah", labelHi: "आरा (भोजपुर)" },
          "समस्तीपुर": { name: "Samastipur", labelHi: "समस्तीपुर (बिहार)" },
          "samastipur": { name: "Samastipur", labelHi: "समस्तीपुर (बिहार)" },
          "बेगूसराय": { name: "Begusarai", labelHi: "बेगूसराय (बिहार)" },
          "begusarai": { name: "Begusarai", labelHi: "बेगूसराय (बिहार)" },
          "मोतिहारी": { name: "Motihari", labelHi: "मोतिहारी (पूर्वी चंपारण)" },
          "motihari": { name: "Motihari", labelHi: "मोतिहारी (पूर्वी चंपारण)" },
          "हाजीपुर": { name: "Hajipur", labelHi: "हाजीपुर (वैशाली)" },
          "hajipur": { name: "Hajipur", labelHi: "हाजीपुर (वैशाली)" },
          "सासाराम": { name: "Sasaram", labelHi: "सासाराम (रोहतास)" },
          "sasaram": { name: "Sasaram", labelHi: "सासाराम (रोहतास)" },
          "दिल्ली": { name: "New Delhi", labelHi: "नई दिल्ली" },
          "delhi": { name: "New Delhi", labelHi: "नई दिल्ली" },
          "लखनऊ": { name: "Lucknow", labelHi: "लखनऊ (उ.प्र.)" },
          "lucknow": { name: "Lucknow", labelHi: "लखनऊ (उ.प्र.)" },
          "वाराणसी": { name: "Varanasi", labelHi: "वाराणसी (उ.प्र.)" },
          "varanasi": { name: "Varanasi", labelHi: "वाराणसी (उ.प्र.)" },
          "प्रयागराज": { name: "Prayagraj", labelHi: "प्रयागराज (उ.प्र.)" },
          "prayagraj": { name: "Prayagraj", labelHi: "प्रयागराज (उ.प्र.)" },
          "कानपुर": { name: "Kanpur", labelHi: "कानपुर (उ.प्र.)" },
          "kanpur": { name: "Kanpur", labelHi: "कानपुर (उ.प्र.)" },
          "गोरखपुर": { name: "Gorakhpur", labelHi: "गोरखपुर (उ.प्र.)" },
          "gorakhpur": { name: "Gorakhpur", labelHi: "गोरखपुर (उ.प्र.)" },
          "रांची": { name: "Ranchi", labelHi: "रांची (झारखंड)" },
          "ranchi": { name: "Ranchi", labelHi: "रांची (झारखंड)" },
          "धनबाद": { name: "Dhanbad", labelHi: "धनबाद (झारखंड)" },
          "dhanbad": { name: "Dhanbad", labelHi: "धनबाद (झारखंड)" },
          "कोलकाता": { name: "Kolkata", labelHi: "कोलकाता (प. बंगाल)" },
          "kolkata": { name: "Kolkata", labelHi: "कोलकाता (प. बंगाल)" },
          "मुंबई": { name: "Mumbai", labelHi: "मुंबई (महाराष्ट्र)" },
          "mumbai": { name: "Mumbai", labelHi: "मुंबई (महाराष्ट्र)" },
          "जयपुर": { name: "Jaipur", labelHi: "जयपुर (राजस्थान)" },
          "jaipur": { name: "Jaipur", labelHi: "जयपुर (राजस्थान)" },
          "भोपाल": { name: "Bhopal", labelHi: "भोपाल (म.प्र.)" },
          "bhopal": { name: "Bhopal", labelHi: "भोपाल (म.प्र.)" },
          "पटना बिहार": { name: "Patna", labelHi: "पटना (बिहार)" },
        };

        let queryCity = "Patna";
        let displayCityHi = "पटना (बिहार)";
        for (const [k, v] of Object.entries(cityHiToEn)) {
          if (lower.includes(k) || trimmedMsg.includes(k)) {
            queryCity = v.name;
            displayCityHi = v.labelHi;
            break;
          }
        }
        if (queryCity === "Patna" && !lower.includes("patna") && !trimmedMsg.includes("पटना")) {
          const customCityMatch =
            trimmedMsg.match(/(?:in|of|at|का|की|के|में)\s+([A-Za-z]{3,24})(?:\s+weather|\s*का\s*मौसम|$)/i) ||
            trimmedMsg.match(/^([A-Za-z]{3,24})\s+(?:weather|mausam)/i);
          if (customCityMatch?.[1] && !/live|today|aaj|live|alert/i.test(customCityMatch[1])) {
            queryCity = customCityMatch[1].trim();
            displayCityHi = queryCity;
          }
        }

        const wmoToHindi = (code: number): string => {
          if (code === 0) return "साफ आसमान (Clear Sky)";
          if (code >= 1 && code <= 3) return "आंशिक बादल (Partly Cloudy)";
          if (code === 45 || code === 48) return "कोहरा व धुंध (Fog/Mist)";
          if (code >= 51 && code <= 57) return "हल्की फुहारें (Drizzle)";
          if (code >= 61 && code <= 67) return "वर्षा / बारिश (Rain)";
          if (code >= 71 && code <= 77) return "बर्फबारी (Snow)";
          if (code >= 80 && code <= 82) return "तेज बौछारें (Rain Showers)";
          if (code >= 95) return "आंधी व गरज के साथ बारिश (Thunderstorm)";
          return "सामान्य मौसम";
        };

        try {
          let lat = 25.5941;
          let lon = 85.1376;
          let resolvedName = displayCityHi;

          const geoCtrl = new AbortController();
          const geoTid = setTimeout(() => geoCtrl.abort(), 5000);
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryCity)}&count=1&language=en&format=json`,
            { signal: geoCtrl.signal }
          );
          clearTimeout(geoTid);
          if (geoRes.ok) {
            const geoJson: any = await geoRes.json();
            const first = geoJson?.results?.[0];
            if (first && typeof first.latitude === "number" && typeof first.longitude === "number") {
              lat = first.latitude;
              lon = first.longitude;
              if (displayCityHi === queryCity) {
                resolvedName = `${first.name}${first.admin1 ? `, ${first.admin1}` : ""}`;
              }
            }
          }

          const wxCtrl = new AbortController();
          const wxTid = setTimeout(() => wxCtrl.abort(), 5000);
          const wxRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=3`,
            { signal: wxCtrl.signal }
          );
          clearTimeout(wxTid);

          if (wxRes.ok) {
            const wx: any = await wxRes.json();
            const cur = wx.current || {};
            const daily = wx.daily || {};
            const liveClock = getLiveIndianTimeAndDate();
            const daysList = Array.isArray(daily.time)
              ? daily.time
                  .slice(0, 3)
                  .map((d: string, i: number) => {
                    const maxT = daily.temperature_2m_max?.[i] ?? "-";
                    const minT = daily.temperature_2m_min?.[i] ?? "-";
                    const rainP = daily.precipitation_probability_max?.[i] ?? 0;
                    const cond = wmoToHindi(Number(daily.weather_code?.[i] ?? 0));
                    return `• ${d}: न्यूनतम ${minT}°C / अधिकतम ${maxT}°C | बारिश संभावना ${rainP}% (${cond})`;
                  })
                  .join("\n")
              : "";

            const weatherReply = `लाइव मौसम रिपोर्ट — ${resolvedName}
अपडेट समय: ${liveClock.dateHi}, ${liveClock.timeStr} (IST)

वर्तमान स्थिति:
• तापमान: ${cur.temperature_2m ?? "-"}°C (महसूस होने वाला: ${cur.apparent_temperature ?? "-"}°C)
• मौसम स्थिति: ${wmoToHindi(Number(cur.weather_code ?? 0))}
• नमी (Humidity): ${cur.relative_humidity_2m ?? "-"}%
• हवा की गति: ${cur.wind_speed_10m ?? "-"} km/h
• वर्तमान वर्षा: ${cur.precipitation ?? 0} mm

आगामी 3 दिनों का पूर्वानुमान:
${daysList}

आप किसी भी शहर का नाम लिखकर भी लाइव मौसम पूछ सकते हैं (जैसे: "गया का मौसम बताओ" या "दिल्ली का मौसम")।

[[NAV:page:weather|लाइव उपग्रह मौसम रडार व 7-दिन अलर्ट खोलें]]`;

            return res.json({
              reply: cleanBotReply(weatherReply),
              grounded: true,
              searchQueries: [`${resolvedName} live weather forecast`],
              sources: [
                {
                  title: "Open-Meteo लाइव सैटेलाइट मौसम केंद्र (IST)",
                  uri: "https://open-meteo.com/",
                },
              ],
            });
          }
        } catch {}
      }

      let ai = getGenAI();

      if (ai) {
        let formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history) && history.length > 0) {
          formattedContents = history.map((msg: { role: string; content: string }) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          }));
        }

        formattedContents.push({
          role: "user",
          parts: [{ text: trimmedMsg }],
        });

        // Build dynamic instructions including all admin-curated Q&A
        let dynamicKnowledge = "";
        if (knowledgeList.length > 0) {
          dynamicKnowledge = "\n\nCRITICAL CUSTOM KNOWLEDGE BASE (ADMIN VERIFIED):\n" +
            knowledgeList.map((k: any, i: number) => `${i + 1}. Q: "${k.question}" -> Official Answer: "${k.answer}"`).join("\n");
        }

        const liveClock = getLiveIndianTimeAndDate();
        const liveTimeContext = `\n\n=======================================================\n⏰ CURRENT REAL-TIME SYSTEM CLOCK (INDIAN STANDARD TIME - IST):\n- TODAY'S DAY: ${liveClock.dayHi} (${liveClock.dayEn})\n- TODAY'S DATE: ${liveClock.dateHi} (${liveClock.dateEn})\n- CURRENT TIME (IST): ${liveClock.timeStr}\n- When asked what day, date, or time it is today, always state: "आज ${liveClock.dayHi} (${liveClock.dayEn}) है, दिनांक ${liveClock.dateHi} है, और समय ${liveClock.timeStr} (IST) है।"\n=======================================================\n`;

        let response: any = null;
        let isGrounded = false;
        let searchQueries: string[] = [];
        let sources: Array<{ title: string; uri: string }> = [];

        // Attempt 1: Gemini 4 Hydrogen with Google Search Grounding (no deprecated sampling params)
        try {
          response = await ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: formattedContents,
            config: {
              systemInstruction: IOIS_SYSTEM_INSTRUCTION + liveTimeContext + dynamicKnowledge,
              tools: [{ googleSearch: {} }],
            },
          });

          searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
          const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          sources = groundingChunks
            .map((chunk: any) => (chunk.web?.title ? { title: chunk.web.title, uri: chunk.web.uri } : null))
            .filter(Boolean);
          isGrounded = searchQueries.length > 0 || sources.length > 0;
        } catch (searchToolErr) {
          console.warn("Search tool call failed, falling back to direct Gemini generation:", searchToolErr);
          // Attempt 2: Direct Gemini 4 Hydrogen without search tool
          try {
            response = await ai.models.generateContent({
              model: "gemini-4-hydrogen",
              contents: formattedContents,
              config: {
                systemInstruction: IOIS_SYSTEM_INSTRUCTION + liveTimeContext + dynamicKnowledge,
              },
            });
          } catch (directErr) {
            console.error("Direct Gemini call failed:", directErr);
            response = null;
          }
        }

        if (response && response.text) {
          return res.json({
            reply: cleanBotReply(response.text),
            grounded: isGrounded,
            searchQueries,
            sources
          });
        }
      }

      // Live Web Research Engine: For general knowledge, current affairs, history, science, geography
      const isIOISSpecific = /plan|प्ला|payout|पेआउट|रजिस्टर|register|login|लॉगिन|पासवर्ड|password|id card|कार्ड|rtps|assessment|असेसमेंट|interview|इंटरव्यू|chintu|चिंटू|bal\s*vikas|balvikas|बाल\s*विकास|whatsapp|helpdesk/i.test(lower);

      if (!isIOISSpecific) {
        const liveResearch = await performLiveWebResearch(trimmedMsg);
        if (liveResearch) {
          return res.json(liveResearch);
        }
      }

      // Comprehensive Offline & Fallback Knowledge Engine with Active Navigation Links
      let fallbackReply = "";

      // 0. Bal Vikas & Chintu AI (ioisplatform.github.io/balvikas)
      if (lower.includes("bal vikas") || lower.includes("balvikas") || lower.includes("बाल विकास") || lower.includes("chintu") || lower.includes("चिंटू") || lower.includes("700") || lower.includes("पेंसिल ट्रेसिंग") || lower.includes("वर्णमाला")) {
        fallbackReply = `IOIS बाल विकास (ioisplatform.github.io/balvikas) बच्चों की संपूर्ण प्रारंभिक शिक्षा और डिजिटल विकास का आधुनिक मंच है।

मुख्य विशेषताएं:
• 700+ पृष्ठों की सम्पूर्ण डिजिटल पुस्तक: अ से ज्ञ वर्णमाला, बारहखड़ी, शब्द ज्ञान व सचित्र ज्ञानकोश।
• चिंटू AI लाइव शिक्षक: बोलकर और समझाकर बच्चों को खेल-खेल में सिखाने वाला इंटरएक्टिव शिक्षक।
• 3D मानव शरीर रचना: आँख, कान, नाक, दिल, फेफड़े और मस्तिष्क के 3D मॉडल व आवाज़।
• डिजिटल पेंसिल ट्रेसिंग: डिजिटल स्लेट पर उंगली या माउस से अक्षर व अंक लिखने का अभ्यास।
• गणित किट: 1 से 100 गिनती, 1 से 20 पहाड़े, जोड़ व घटाव।
• गुड इंग्लिश व फ़ोनिक्स: A to Z Phonics ध्वनि व शब्द उच्चारण।
• कीमत व पेआउट: यह संपूर्ण किट IOIS Plan 01 में मात्र ₹10 में लाइफटाइम उपलब्ध है, जिसपर ₹7 (70%) का तुरंत पेआउट मिलता है।

[[NAV:plan:1|Plan 01 (₹10) बाल विकास चुनें]]
[[NAV:external:https://ioisplatform.github.io/balvikas/|बाल विकास पोर्टल खोलें]]
[[NAV:page:plans|7 मास्टर प्लांस देखें]]`;
      }
      // 0.1 National GK: Capital of India & States
      else if (lower.includes("भारत की राजधानी") || lower.includes("capital of india") || lower.includes("bharat ki rajdhani") || (lower.includes("राजधानी") && (lower.includes("भारत") || lower.includes("india") || lower.includes("दिल्ली")))) {
        fallbackReply = `भारत की राजधानी नई दिल्ली (New Delhi) है।

• आधिकारिक नाम: राष्ट्रीय राजधानी क्षेत्र दिल्ली (NCT of Delhi)
• घोषणा वर्ष: 12 दिसंबर 1911 को किंग जॉर्ज पंचम द्वारा राजधानी को कोलकाता से दिल्ली स्थानांतरित करने की घोषणा की गई थी।
• उद्घाटन: 13 फरवरी 1931 को नई दिल्ली का औपचारिक उद्घाटन हुआ था।
• प्रमुख केंद्र: राष्ट्रपति भवन, नया संसद भवन, इंडिया गेट, सर्वोच्च न्यायालय (Supreme Court) और केंद्रीय सचिवालय।

प्रमुख राज्यों की राजधानियाँ:
• बिहार: पटना (Patna)
• उत्तर प्रदेश: लखनऊ (Lucknow)
• महाराष्ट्र: मुंबई (Mumbai)
• पश्चिम बंगाल: कोलकाता (Kolkata)
• मध्य प्रदेश: भोपाल (Bhopal)
• राजस्थान: जयपुर (Jaipur)

[[NAV:page:student-study|विद्यार्थी सामान्य ज्ञान व अध्ययन नोट्स खोलें]]`;
      }
      else if (lower.includes("बिहार की राजधानी") || lower.includes("capital of bihar") || lower.includes("bihar ki rajdhani")) {
        fallbackReply = `बिहार की राजधानी पटना (Patna) है।

• ऐतिहासिक नाम: पाटलिपुत्र (Patliputra), कुसुमपुर, पुष्पपुर व अजीमाबाद।
• महत्व: यह गंगा नदी के दक्षिणी तट पर स्थित प्राचीन और ऐतिहासिक नगर है।
• प्रमुख स्थल: गोलघर, पटना साहिब गुरुद्वारा, बिहार संग्रहालय, तख्त श्री हरिमंदिर जी और नालंदा/वैशाली निकटवर्ती केंद्र।

[[NAV:page:student-study|विद्यार्थी शिक्षा व अध्ययन हब खोलें]]`;
      }
      else if (lower.includes("मुख्यमंत्री") || lower.includes("chief minister of bihar") || lower.includes("cm of bihar") || lower.includes("nitish kumar") || lower.includes("नीतीश कुमार")) {
        fallbackReply = `बिहार के वर्तमान मुख्यमंत्री श्री नीतीश कुमार (Shri Nitish Kumar) हैं।

• उप-मुख्यमंत्री: श्री सम्राट चौधरी और श्री विजय कुमार सिन्हा
• राज्यपाल: श्री राजेंद्र विश्वनाथ आर्लेकर
• राजधानी: पटना (Patna)

[[NAV:page:student-study|विद्यार्थी सामान्य ज्ञान अध्ययन हब खोलें]]`;
      }
      else if (lower.includes("राष्ट्रपति") || lower.includes("president of india") || lower.includes("droupadi murmu") || lower.includes("द्रौपदी मुर्मू")) {
        fallbackReply = `भारत की वर्तमान राष्ट्रपति माननीया श्रीमती द्रौपदी मुर्मू (Smt. Droupadi Murmu) हैं।

• वे भारत की 15वीं राष्ट्रपति हैं तथा देश की प्रथम आदिवासी महिला राष्ट्रपति हैं।
• भारत के प्रथम राष्ट्रपति: डॉ. राजेंद्र प्रसाद (Dr. Rajendra Prasad)

[[NAV:page:student-study|विद्यार्थी सामान्य ज्ञान अध्ययन हब खोलें]]`;
      }
      else if (lower.includes("प्रधानमंत्री") || lower.includes("prime minister of india") || lower.includes("narendra modi") || lower.includes("नरेंद्र मोदी")) {
        fallbackReply = `भारत के वर्तमान प्रधानमंत्री श्री नरेंद्र मोदी (Shri Narendra Modi) हैं।

• वे 26 मई 2014 से लगातार भारत के प्रधानमंत्री हैं।
• भारत के प्रथम प्रधानमंत्री: पंडित जवाहरलाल नेहरू (Pt. Jawaharlal Nehru)

[[NAV:page:student-study|विद्यार्थी अध्ययन हब खोलें]]`;
      }
      else if (lower.includes("प्रकाश संश्लेषण") || lower.includes("photosynthesis")) {
        fallbackReply = `प्रकाश संश्लेषण (Photosynthesis) वह प्रक्रिया है जिससे हरे पौधे अपना भोजन बनाते हैं:

• पौधे सूर्य का प्रकाश, कार्बन डाइऑक्साइड (CO2) और जल (H2O) लेकर ग्लूकोज (C6H12O6) बनाते हैं और ऑक्सीजन (O2) गैस छोड़ते हैं।
• रासायनिक समीकरण: 6CO2 + 6H2O + सूर्य का प्रकाश -> C6H12O6 + 6O2
• यह प्रक्रिया पत्तियों में मौजूद हरित लवक (क्लोरोफिल) के भीतर संपन्न होती है।

[[NAV:page:student-study|विद्यार्थी विज्ञान व नोट्स हब खोलें]]`;
      }
      // 1. River & Indian Geography Q&A
      else if (lower.includes("godavari") || lower.includes("गोदावरी") || (lower.includes("नदी") && lower.includes("उद्गम")) || (lower.includes("river") && lower.includes("origin"))) {
        fallbackReply = `गोदावरी नदी का उद्गम महाराष्ट्र राज्य के नासिक जिले में स्थित त्र्यंबकेश्वर (Trimbakeshwar / ब्रह्मगिरि पर्वत) से होता है।

• उपनाम: इसे 'दक्षिण गंगा' (Ganges of the South) और 'वृद्ध गंगा' भी कहा जाता है।
• कुल लंबाई: 1,465 किलोमीटर (यह भारत की दूसरी सबसे लंबी नदी है)।
• प्रवाह क्षेत्र: महाराष्ट्र, तेलंगाना, आंध्र प्रदेश, छत्तीसगढ़ और ओडिशा।
• मुहाना: यह पूर्व की ओर बहते हुए बंगाल की खाड़ी (आंध्र प्रदेश के निकट) में जाकर मिलती है।

अन्य प्रमुख नदियों के उद्गम:
• गंगा नदी: गंगोत्री हिमनद (भागीरथी), उत्तराखंड
• यमुना नदी: यमुनोत्री हिमनद, उत्तराखंड
• नर्मदा नदी: अमरकंटक, मध्य प्रदेश
• कृष्णा नदी: महाबलेश्वर, महाराष्ट्र

[[NAV:page:student-study|विद्यार्थी शिक्षा व भूगोल नोट्स खोलें]]`;
      } 
      // 2. 15-Questions Skill Assessment & Interview Guide
      else if (lower.includes("15") && (lower.includes("प्रश्नों") || lower.includes("प्रश्न") || lower.includes("सवाल") || lower.includes("ans") || lower.includes("उत्तर") || lower.includes("test") || lower.includes("इंटरव्यू") || lower.includes("interview") || lower.includes("असेसमेंट"))) {
        fallbackReply = `15-सवाल कौशल साक्षात्कार (Skill Assessment Test) में उत्तर देने की पूरी गाइड:

आप सीधे नीचे दिए गए बटन से टेस्ट शुरू कर सकते हैं:

15 प्रश्नों को 4 मुख्य श्रेणियों में बांटा गया है:
1. डिजिटल साक्षरता (प्रश्न 1-4): स्मार्टफोन व कंप्यूटर का उपयोग, सोशल मीडिया, ऑनलाइन पेमेंट (UPI)।
   • उत्तर सुझाव: अपने अनुभव के अनुसार 'नियमित रूप से' या 'बुनियादी ज्ञान' चुनें।
2. संचार व व्यवहार कौशल (प्रश्न 5-8): टीम में काम करना, लोगों को प्लान समझाना और ग्राहक सहायता।
   • उत्तर सुझाव: 'सकारात्मक व सहयोगी' विकल्प चुनें।
3. समस्या निवारण व तर्कशक्ति (प्रश्न 9-12): निर्णय लेने की क्षमता व समय प्रबंधन।
   • उत्तर सुझाव: 'व्यवस्थित व सटीक' समाधान चुनें।
4. करियर व आय लक्ष्य (प्रश्न 13-15): आपका मासिक आय लक्ष्य और उपलब्ध समय।

स्कोरिंग व प्लान अनुशंसा:
• 13-15 अंक (उत्कृष्ट): Plan 07 (Master Lifetime - ₹999 / ₹499 पेआउट) या Plan 06 (Agency Reseller)
• 10-12 अंक (अच्छा): Plan 05 (Student Elite - ₹299) या Plan 03 (Career & Job - ₹99)
• 6-9 अंक (शुरुआती): Plan 02 (Youth Skill - ₹49) या Plan 01 (Bal Vikas - ₹10)

[[NAV:page:assessment|15-सवाल कौशल असेसमेंट शुरू करें]]
[[NAV:page:plans|7 मास्टर प्लांस देखें]]`;
      }
      // 3. Student Study Portal, Notes, Formulas & Classes
      else if (lower.includes("study") || lower.includes("पढ़ाई") || lower.includes("formula") || lower.includes("सूत्र") || lower.includes("कक्षा") || lower.includes("class") || lower.includes("subject") || lower.includes("नोट्स") || lower.includes("notes") || lower.includes("math")) {
        fallbackReply = `विद्यार्थी शिक्षा व अध्ययन केंद्र (IOIS Student Portal):

विद्यार्थियों के लिए विशेष विद्यार्थी शिक्षा व अध्ययन हब तैयार किया गया है:

1. कक्षा 1 से 12 व स्नातक (BA/BSc/BCom) विषय नोट्स:
   • NCERT पाठ्यपुस्तक सारांश, महत्वपूर्ण प्रश्न-उत्तर व बोर्ड मॉडल पेपर्स।
2. गणित के सभी महत्वपूर्ण फॉर्मूला (Math Formula Sheets):
   • बीजगणित: (a+b)^2 = a^2 + 2ab + b^2, द्विघात सूत्र
   • त्रिकोणमिति: sin^2 θ + cos^2 θ = 1, कोण मान तालिका
   • क्षेत्रमिति: वृत्त, बेलन, शंकु, गोला के सूत्र
   • कलन: अवकलन d/dx व समाकलन ∫ f(x)dx
3. मुफ्त अध्ययन सामग्री:
   • NCERT e-Books, DIKSHA पोर्टल, SWAYAM IIT कोर्सेज, नेशनल डिजिटल लाइब्रेरी (NDLI)।

[[NAV:page:student-study|विद्यार्थी शिक्षा व नोट्स हब खोलें]]`;
      }
      // 4. Career Guidance
      else if (lower.includes("doctor") || lower.includes("डॉक्टर") || lower.includes("engineer") || lower.includes("इंजीनियर") || lower.includes("ias") || lower.includes("upsc") || lower.includes("neet") || lower.includes("jee") || lower.includes("career") || lower.includes("करियर") || lower.includes("नौकरी")) {
        fallbackReply = `करियर चयन व मार्गदर्शन (Career Roadmap Guide):

• डॉक्टर (Medical / MBBS / BDS):
  - 10वीं के बाद: 11वीं-12वीं में PCB (Physics, Chemistry, Biology) विषय लें।
  - प्रवेश परीक्षा: NEET-UG परीक्षा उत्तीर्ण करें। AIIMS व सरकारी मेडिकल कॉलेजों में MBBS प्रवेश।

• इंजीनियर (Engineering / Software / AI / Civil / Mech):
  - 10वीं के बाद: 11वीं-12वीं में PCM (Physics, Chemistry, Mathematics) लें।
  - प्रवेश परीक्षा: JEE Main व JEE Advanced। IITs व NITs में B.Tech।

• प्रशासनिक सेवा (IAS / IPS / IFS / BPSC / UPPSC):
  - योग्यता: किसी भी मान्यता प्राप्त विषय में स्नातक (Graduation)।
  - तैयारी: NCERT 6th-12th का आधारभूत अध्ययन, दैनिक अखबार/Current Affairs, UPSC परीक्षा।

• रक्षा सेवा (NDA / CDS / वायु सेना / नौसेना):
  - 12वीं (PCM) के बाद NDA (National Defence Academy) परीक्षा व SSB इंटरव्यू।

[[NAV:page:student-study|विद्यार्थी करियर गाइड खोलें]]
[[NAV:page:jobs|सरकारी व प्राइवेट जॉब अलर्ट देखें]]`;
      }
      // 5. Scholarship & Bonafide Certificate
      else if (lower.includes("scholarship") || lower.includes("छात्रवृत्ति") || lower.includes("स्कॉलरशिप") || lower.includes("bonafide") || lower.includes("बोनाफाइड") || lower.includes("medhasoft") || lower.includes("pms")) {
        fallbackReply = `छात्रवृत्ति व बोनाफाइड सर्टिफिकेट (Bonafide Certificate) गाइड:

1. बोनाफाइड सर्टिफिकेट क्या है?
यह आपके स्कूल या कॉलेज द्वारा जारी आधिकारिक प्रमाण पत्र है, जो प्रमाणित करता है कि आप उस संस्थान के नियमित छात्र/छात्रा हैं। यह पोस्ट-मैट्रिक PMS व NSP स्कॉलरशिप के लिए अनिवार्य है।

2. प्रमुख छात्रवृत्ति पोर्टल्स:
• नेशनल स्कॉलरशिप पोर्टल (NSP): scholarships.gov.in
• बिहार पोस्ट-मैट्रिक स्कॉलरशिप (PMS): pmsonline.bih.nic.in (SC, ST, BC, EBC छात्रों हेतु)
• मुख्यमंत्री कन्या उत्थान योजना (Medhasoft): medhasoft.bih.nic.in
  - 10वीं प्रथम श्रेणी: ₹10,000
  - 12वीं उत्तीर्ण (अविवाहित कन्या): ₹25,000
  - स्नातक उत्तीर्ण छात्रा: ₹50,000

3. आवश्यक दस्तावेज:
• आधार कार्ड, जाति/आय/निवास प्रमाण पत्र, बोनाफाइड सर्टिफिकेट, फीस रसीद, आधार-लिंक्ड बैंक खाता।

[[NAV:page:student-study|स्कॉलरशिप व बोनाफाइड जनरेटर खोलें]]
[[NAV:page:rtps-services|जाति/आय/निवास (RTPS) आवेदन करें]]`;
      }
      // 6. IOIS Plans
      else if (lower.includes("plan") || lower.includes("प्लान") || lower.includes("रेट") || lower.includes("कीमत") || lower.includes("price")) {
        fallbackReply = `IOIS के सभी 7 मास्टर प्लांस व इंस्टेंट पेआउट सूची:

1. Plan 01: Bal Vikas (₹10) - ₹7 इंस्टेंट पेआउट (70% Payout)
2. Plan 02: Youth Skill (₹49) - ₹34 इंस्टेंट पेआउट (70% Payout)
3. Plan 03: Career & Job (₹99) - ₹64 इंस्टेंट पेआउट (65% Payout)
4. Plan 04: Family VIP (₹199) - ₹119 इंस्टेंट पेआउट (60% Payout)
5. Plan 05: Student Elite (₹299) - ₹179 इंस्टेंट पेआउट (60% Payout)
6. Plan 06: Agency Reseller (₹499) - ₹274 इंस्टेंट पेआउट (55% Payout)
7. Plan 07: Master Lifetime (₹999) - ₹499 इंस्टेंट पेआउट (50% Payout)

सभी प्लांस में लाइफटाइम एक्सेस व 5-मिनट एडमिन अप्रूवल मिलता है!

[[NAV:page:plans|7 मास्टर प्लांस विवरण देखें]]
[[NAV:page:register|नया रजिस्ट्रेशन पोर्टल खोलें]]`;
      } 
      // 7. Registration
      else if (lower.includes("register") || lower.includes("रजिस्ट्रेशन") || lower.includes("खाता") || lower.includes("join") || lower.includes("जुड़ें")) {
        fallbackReply = `IOIS नया सदस्य रजिस्ट्रेशन प्रक्रिया (5 आसान स्टेप्स):

1. नीचे दिए गए 'नया रजिस्ट्रेशन फॉर्म खोलें' बटन पर क्लिक करें।
2. अपना पूरा नाम, मोबाइल नंबर और एक सुरक्षित पासवर्ड भरें।
3. 7 में से अपना मनपसंद डिजिटल प्लान चुनें।
4. आधिकारिक UPI ID 8877490845@spicepay (Vikas Kumar) पर स्कैन या ट्रांसफर करके भुगतान करें।
5. भुगतान का 12-अंकों का UTR / Ref नंबर दर्ज करें और स्क्रीनशॉट अपलोड करें।
6. सबमिट करें — 5 मिनट में एडमिन द्वारा आपकी ID एक्टिवेट कर दी जाएगी!

[[NAV:page:register|नया रजिस्ट्रेशन फॉर्म खोलें]]
[[NAV:page:plans|7 मास्टर प्लांस देखें]]`;
      } 
      // 8. ID Card
      else if (lower.includes("id card") || lower.includes("आईडी कार्ड") || lower.includes("कार्ड")) {
        fallbackReply = `आधिकारिक स्मार्ट डिजिटल ID कार्ड:

• IOIS सदस्यों को 256-बिट एन्क्रिप्टेड और QR कोड वेरिफाइड स्मार्ट डिजिटल कार्ड दिया जाता है।
• इसमें आपकी फोटो, User ID, एक्टिव प्लान, ब्लड ग्रुप व जारी होने की तिथि अंकित होती है।
• आप 'HD PNG डाउनलोड' या 'प्रिंट' बटन दबाकर तुरंत इसे अपने फोन या कंप्यूटर में सेव कर सकते हैं।

[[NAV:page:idcard|डिजिटल ID कार्ड पेज खोलें]]
[[NAV:login:login|सदस्य लॉगिन करें]]`;
      } 
      // 9. RTPS Services
      else if (lower.includes("rtps") || lower.includes("जाति") || lower.includes("आय") || lower.includes("निवास") || lower.includes("obc") || lower.includes("ews")) {
        fallbackReply = `RTPS नागरिक सेवाएं (जाति, आय, निवास प्रमाण पत्र):

• आधिकारिक पोर्टल: serviceonline.bihar.gov.in (100% निशुल्क)
• प्रमाण पत्र:
  - निवास प्रमाण पत्र (Residential / Domicile Certificate)
  - जाति प्रमाण पत्र (Caste Certificate - SC/ST/EBC/BC)
  - आय प्रमाण पत्र (Income Certificate)
  - OBC गैर-क्रीमी लेयर (NCL) व EWS प्रमाण पत्र
• आवश्यक दस्तावेज: आधार कार्ड, पासपोर्ट साइज फोटो, आधार लिंक्ड मोबाइल नंबर।
• अवधि: 10 से 14 कार्य दिवसों में ऑनलाइन जारी।

[[NAV:page:rtps-services|RTPS नागरिक सेवाएं पोर्टल खोलें]]`;
      } 
      // 10. Land Mutation / Dakhil Kharij
      else if (lower.includes("दाखिल खारिज") || lower.includes("mutation") || lower.includes("जमीन") || lower.includes("parimarjan") || lower.includes("bhumi") || lower.includes("jamabandi")) {
        fallbackReply = `बिहार भूमि दाखिल खारिज (Mutation) व जमीन सुधार गाइड:

• आधिकारिक पोर्टल: biharbhumi.bihar.gov.in
• दाखिल खारिज (Online Mutation):
  1. पोर्टल पर रजिस्ट्रेशन करके लॉगिन करें।
  2. अपना जिला, अंचल व मौजा चुनें।
  3. रजिस्ट्री (केवाला) की PDF कॉपी व लगान रसीद अपलोड करें।
  4. 35-45 दिनों में कर्मचारी व CO जांच के बाद शुद्धि पत्र जारी होता है।
• परिमार्जन प्लस (Parimarjan Plus): पुरानी जमाबंदी में खाता, खेसरा, रकबा या नाम सुधारने के लिए ऑनलाइन आवेदन करें।

[[NAV:page:rtps-services|जमीन दाखिल खारिज व सुधार पोर्टल खोलें]]`;
      } 
      // 11. Free e-PAN
      else if (lower.includes("pan") || lower.includes("पैन कार्ड")) {
        fallbackReply = `10-मिनट में फ्री Instant e-PAN कार्ड:

• आधिकारिक पोर्टल: eportal.incometax.gov.in -> Instant e-PAN
• शर्त: आधार कार्ड से मोबाइल नंबर लिंक होना चाहिए और पहले से कोई पैन न बना हो।
• प्रक्रिया: 12 अंकों का आधार नंबर डालें -> OTP दर्ज करें -> 10 मिनट में डिजिटल e-PAN PDF डाउनलोड करें!
• यह पैन कार्ड भौतिक पैन कार्ड के समान 100% वैध है।

[[NAV:page:rtps-services|इंस्टेंट e-PAN पोर्टल खोलें]]`;
      } 
      // 12. About IOIS
      else if (lower.includes("iois") || lower.includes("क्या है") || lower.includes("about") || lower.includes("काम")) {
        fallbackReply = `IOIS (Indian Online Income Supporting System) क्या है?

IOIS भारत का डिजिटल शिक्षा, बाल विकास, नागरिक सेवा मार्गदर्शन व आजीविका सहायता मंच है।

मुख्य विशेषताएं:
1. बाल विकास (Plan 01 ₹10): 700+ पृष्ठों की डिजिटल पुस्तक, चिंटू AI शिक्षक, 3D शरीर मॉडल व पेंसिल ट्रेसिंग।
2. विद्यार्थी हब: कक्षा 1-12 NCERT नोट्स, मैथ फॉर्मूला, स्कॉलरशिप व बोनाफाइड जनरेटर।
3. 15-सवाल कौशल साक्षात्कार: आपकी प्रतिभा पहचान कर सही करियर व प्लान मार्गदर्शन।
4. 7 डिजिटल प्लांस: ₹10 से ₹999 में लाइफटाइम एक्सेस व 50%-70% इंस्टेंट पेआउट।
5. नागरिक सेवाएं: RTPS जाति/आय/निवास, जमीन दाखिल खारिज, 10-मिनट e-PAN।

[[NAV:page:plans|7 मास्टर प्लांस देखें]]
[[NAV:page:register|नया रजिस्ट्रेशन करें]]
[[NAV:page:assessment|15-सवाल टेस्ट दें]]`;
      } 
      // 13. Instant Payout & Withdrawal
      else if (lower.includes("withdraw") || lower.includes("विथड्रॉ") || lower.includes("निकासी") || lower.includes("पैसे निकाल") || lower.includes("कमीशन निकाल")) {
        fallbackReply = `IOIS कमीशन विथड्रॉल (Withdrawal) प्रक्रिया:

1. सदस्य लॉगिन करके 'यूजर डैशबोर्ड' खोलें।
2. 'कमीशन व विथड्रॉल' टैब पर क्लिक करें।
3. अपनी विथड्रॉल राशि दर्ज करें (न्यूनतम विथड्रॉल मात्र ₹100 है)।
4. अपना पसंदीदा पेआउट माध्यम चुनें (BHIM UPI, PhonePe, Google Pay या Paytm)।
5. अपनी सही UPI ID दर्ज करें और 'विथड्रॉल अनुरोध सबमिट करें' बटन दबाएं।
6. एडमिन 2 से 24 घंटे में बिना किसी कटौती (0% Deduction) के सीधे आपके बैंक/UPI में पेमेंट ट्रांसफर कर देता है।

[[NAV:page:dashboard|यूजर डैशबोर्ड विथड्रॉल फॉर्म खोलें]]
[[NAV:page:calculator|पेआउट व आय कैलकुलेटर खोलें]]`;
      }
      // 13.1 Promotional Poster Studio
      else if (lower.includes("poster") || lower.includes("पोस्टर") || lower.includes("बैनर") || lower.includes("दुकान") || lower.includes("banner")) {
        fallbackReply = `IOIS ऑटोमैटिक प्रमोशनल पोस्टर स्टूडियो:

आप अपने नाम, स्पॉन्सर आईडी और व्यक्तिगत QR कोड के साथ 4 तरह के HD पोस्टर बना सकते हैं:
1. दुकान व CSC साइबर कैफे A4 फ्लेक्स बैनर
2. विद्यार्थी NCERT नोट्स व मॉडल पेपर्स पोस्टर
3. WhatsApp स्टेटस व स्टोरी (9:16 वर्टिकल) पोस्टर
4. 50%-70% इंसेंटिव व स्वरोजगार पोस्टर

पोस्टर बनाकर तुरंत HD PNG में डाउनलोड करें या 1-क्लिक में WhatsApp पर शेयर करें!

[[NAV:page:dashboard|पोस्टर स्टूडियो खोलें]]
[[NAV:page:idcard|डिजिटल ID कार्ड खोलें]]`;
      }
      else if (lower.includes("payout") || lower.includes("पेआउट") || lower.includes("पैसे") || lower.includes("रुपये") || lower.includes("कमीशन") || lower.includes("earning")) {
        fallbackReply = `IOIS 50%-70% इंस्टेंट पेआउट सिस्टम:

IOIS में स्मार्ट इंस्टेंट पेआउट प्रोटोकॉल कार्यरत है:
• Plan 01 (₹10): ₹7 इंस्टेंट पेआउट (70%)
• Plan 02 (₹49): ₹34 इंस्टेंट पेआउट (70%)
• Plan 03 (₹99): ₹64 इंस्टेंट पेआउट (65%)
• Plan 04 (₹199): ₹119 इंस्टेंट पेआउट (60%)
• Plan 05 (₹299): ₹179 इंस्टेंट पेआउट (60%)
• Plan 06 (₹499): ₹274 इंस्टेंट पेआउट (55%)
• Plan 07 (₹999): ₹499 इंस्टेंट पेआउट (50%)

जब भी आपका कोई साथी आपके रेफरल से एक्टिवेट होता है, एडमिन वेरिफिकेशन होते ही पेआउट सीधे आपके UPI में ट्रांसफर कर दिया जाता है!

[[NAV:page:calculator|पेआउट व आय कैलकुलेटर खोलें]]
[[NAV:page:plans|सभी प्लांस देखें]]`;
      } 
      // 14. Forgot Password / ID Recovery / Login
      else if (lower.includes("password") || lower.includes("पासवर्ड") || lower.includes("login") || lower.includes("लॉगिन") || lower.includes("user id") || lower.includes("आईडी भूल")) {
        fallbackReply = `सदस्य लॉगिन, पासवर्ड रीसेट व User ID रिकवरी:

• लॉगिन: यदि आपके पास User ID व पासवर्ड है, तो लॉगिन करें।
• पासवर्ड भूल गए: 2-स्टेप सुरक्षित OTP वेरिफिकेशन (मोबाइल नंबर + रजिस्टर्ड नाम के पहले 2 अक्षर) से नया पासवर्ड बनाएं।
• User ID भूल गए: अपने रजिस्टर्ड मोबाइल नंबर व नाम वेरिफिकेशन से अपनी User ID प्राप्त करें।

[[NAV:login:login|सदस्य लॉगिन पोर्टल खोलें]]
[[NAV:login:forgot_password|पासवर्ड रीसेट करें]]
[[NAV:login:forgot_user_id|User ID खोजें]]`;
      }
      // 15. Official Contact
      else if (lower.includes("contact") || lower.includes("संपर्क") || lower.includes("whatsapp") || lower.includes("help") || lower.includes("फोन") || lower.includes("helpdesk")) {
        fallbackReply = `IOIS 24x7 आधिकारिक सहायता केंद्र:

• व्हाट्सएप सपोर्ट: +91 8877490845
• आधिकारिक टेलीग्राम: @ioisplatform
• ईमेल: ioisplatform@gmail.com
• UPI ID: 8877490845@spicepay (Vikas Kumar)

[[NAV:whatsapp:918877490845|व्हाट्सएप पर सीधी चैट शुरू करें]]
[[NAV:external:https://t.me/ioisplatform|टेलीग्राम चैनल से जुड़ें]]`;
      } 
      // 16. General Research & Assistant Fallback
      else {
        const finalResearch = await performLiveWebResearch(trimmedMsg);
        if (finalResearch) {
          return res.json(finalResearch);
        }

        const unanswered = loadUnansweredFromDisk();
        const alreadyLogged = unanswered.some((u) => u.question.toLowerCase() === lower);
        if (!alreadyLogged && trimmedMsg.length > 3) {
          unanswered.unshift({
            id: `unans-${Date.now()}`,
            question: trimmedMsg,
            askedAt: new Date().toISOString(),
            status: "pending",
          });
          saveUnansweredToDisk(unanswered);
          sendTelegramUnansweredQuestionAlert(trimmedMsg);
        }

        fallbackReply = `क्षमा करें, मेरे पास आपके इस विशिष्ट प्रश्न की सटीक जानकारी उपलब्ध नहीं है।

लेकिन मैं IOIS प्लेटफ़ॉर्म का आधिकारिक सहायक हूँ और मैं आपको हमारे 7 मास्टर प्लान्स (₹10 से ₹999), 50%-70% तुरंत पेआउट, डिजिटल ID कार्ड, नया रजिस्ट्रेशन, और सरकारी नागरिक सेवाओं से जुड़े किसी भी सवाल में पूरी सहायता प्रदान कर सकता हूँ:
• 7 मास्टर प्लान्स: ₹10 से ₹999 में हर प्लान के फीचर्स, लाभ, टारगेट ऑडियंस व व्यावहारिक उदाहरण
• 50%-70% तुरंत पेआउट: बिना किसी कटौती के सीधे आपके UPI या बैंक खाते में ट्रांसफर
• 3 आसान चरणों में रजिस्ट्रेशन: 5 मिनट में सदस्य बनें और 256-बिट सुरक्षित डिजिटल ID कार्ड पाएं
• बाल विकास डिजिटल पुस्तक (Plan 01 ₹10): 700+ पृष्ठ, चिंटू AI शिक्षक व 3D मानव शरीर रचना
• RTPS नागरिक सेवाएं: जाति, आय, निवास प्रमाण पत्र, जमीन दाखिल-खारिज व Instant e-PAN

कृपया प्लेटफ़ॉर्म से संबंधित अपना सवाल पूछें या नीचे दिए गए विकल्पों में से चुनें:

[[NAV:page:plans|7 मास्टर प्लान्स का पूरा विवरण देखें]]
[[NAV:page:register|नया रजिस्ट्रेशन करें]]
[[NAV:page:calculator|पेआउट व आय कैलकुलेटर खोलें]]
[[NAV:page:idcard|डिजिटल ID कार्ड खोलें]]
[[NAV:external:https://t.me/newuserhelpline|🎧 𝗡𝗘𝗪 𝗨𝗦𝗘𝗥 𝗛𝗘𝗟𝗣𝗟𝗜𝗡𝗘 (Telegram)]]`;
      }

      return res.json({ reply: cleanBotReply(fallbackReply), grounded: false });
    } catch (err: any) {
      console.error("Chat API Error:", err);
      return res.status(500).json({
        reply: "तकनीकी त्रुटि के कारण उत्तर प्राप्त नहीं हो सका। कृपया थोड़ी देर बाद पुनः प्रयास करें या हमारे व्हाट्सएप सपोर्ट +91 8877490845 पर संपर्क करें।",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        maxAge: "7d",
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      })
    );
    app.get("*", (_req: Request, res: Response) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IOIS Server is running on port ${PORT}`);
    // Defer warm-up, legacy password migration, and cloud sync after socket binds
    setImmediate(() => {
      migratePlaintextPasswordsOnDisk();
      ensureUniqueUsernamesOnDisk();
      void hydrateServerFromFirestoreOnce(false);
      void syncAdminPinHashToFirestore();
      void refreshLiveNewsCache();
      void refreshLiveJobsCache();
    });
  });
}

startServer();

