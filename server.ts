import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// File persistence paths
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json");
const TELEGRAM_CONFIG_FILE = path.join(DATA_DIR, "telegram-config.json");
const KNOWLEDGE_FILE = path.join(DATA_DIR, "ai-knowledge.json");
const UNANSWERED_FILE = path.join(DATA_DIR, "ai-unanswered.json");
const INTERVIEWS_FILE = path.join(DATA_DIR, "interviews.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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
    enabled: true,
    botToken: process.env.TELEGRAM_BOT_TOKEN || "8838741922:AAFGoIvjohnF8FvEiW84h3SxaX2NeANLC50",
    chatId: process.env.TELEGRAM_CHAT_ID || "964524685",
    adminSecret: "IOISSYSTEM",
    botUsername: "@iois_admin_notification_bot",
  };
  try {
    if (fs.existsSync(TELEGRAM_CONFIG_FILE)) {
      const raw = fs.readFileSync(TELEGRAM_CONFIG_FILE, "utf-8");
      const data = JSON.parse(raw);
      return {
        enabled: typeof data.enabled === "boolean" ? data.enabled : defaults.enabled,
        botToken: data.botToken || defaults.botToken,
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

    const tgData = await tgRes.json();
    if (!tgRes.ok || !tgData.ok) {
      console.warn("Telegram API Error:", tgData);
      return { success: false, error: tgData.description || "Telegram API failed" };
    }
    return { success: true };
  } catch (err: any) {
    console.error("Failed to send Telegram alert:", err);
    return { success: false, error: err.message };
  }
}

// Initial seed demo users
const INITIAL_DEMO_USERS = [
  {
    userId: "IOIS999RK01",
    fullName: "राहुल कुमार",
    mobileNumber: "+91 9876543210",
    email: "rahul.kumar@example.com",
    selectedPlanId: 7,
    role: "Supreme Master Partner",
    password: "password123",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    paymentScreenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80",
    paymentUtr: "UTR20268877490845",
    paymentStatus: "approved",
    createdAt: "2026-08-20T10:30:00Z",
    verifiedAt: "2026-08-20T11:00:00Z",
    address: "Patna, Bihar",
    payoutUpi: "rahul@upi",
  },
  {
    userId: "IOIS49PS01",
    fullName: "प्रिया शर्मा",
    mobileNumber: "+91 9811223344",
    email: "priya.sharma@example.com",
    selectedPlanId: 2,
    role: "Active Digital Learner",
    password: "password123",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    paymentScreenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80",
    paymentUtr: "UTR202699112233",
    paymentStatus: "pending",
    createdAt: "2026-08-23T08:15:00Z",
    address: "Indore, MP",
    payoutUpi: "priya@okhdfcbank",
  }
];

function loadUsersFromDisk(): any[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_DEMO_USERS, null, 2), "utf-8");
      return INITIAL_DEMO_USERS;
    }
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : INITIAL_DEMO_USERS;
  } catch (err) {
    console.error("Error reading users from disk:", err);
    return INITIAL_DEMO_USERS;
  }
}

function saveUsersToDisk(users: any[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing users to disk:", err);
  }
}

function loadTicketsFromDisk(): any[] {
  try {
    if (!fs.existsSync(TICKETS_FILE)) {
      fs.writeFileSync(TICKETS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(TICKETS_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error reading tickets from disk:", err);
    return [];
  }
}

function saveTicketsToDisk(tickets: any[]): void {
  try {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), "utf-8");
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
  try {
    if (!fs.existsSync(KNOWLEDGE_FILE)) {
      fs.writeFileSync(KNOWLEDGE_FILE, JSON.stringify(INITIAL_KNOWLEDGE, null, 2), "utf-8");
      return INITIAL_KNOWLEDGE;
    }
    const raw = fs.readFileSync(KNOWLEDGE_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : INITIAL_KNOWLEDGE;
  } catch (err) {
    console.error("Error reading knowledge from disk:", err);
    return INITIAL_KNOWLEDGE;
  }
}

function saveKnowledgeToDisk(items: any[]): void {
  try {
    fs.writeFileSync(KNOWLEDGE_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing knowledge to disk:", err);
  }
}

function loadUnansweredFromDisk(): any[] {
  try {
    if (!fs.existsSync(UNANSWERED_FILE)) {
      fs.writeFileSync(UNANSWERED_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(UNANSWERED_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error reading unanswered questions from disk:", err);
    return [];
  }
}

function saveUnansweredToDisk(items: any[]): void {
  try {
    fs.writeFileSync(UNANSWERED_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing unanswered questions to disk:", err);
  }
}

function loadInterviewsFromDisk(): any[] {
  try {
    if (!fs.existsSync(INTERVIEWS_FILE)) {
      fs.writeFileSync(INTERVIEWS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(INTERVIEWS_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error reading interviews from disk:", err);
    return [];
  }
}

function saveInterviewsToDisk(items: any[]): void {
  try {
    fs.writeFileSync(INTERVIEWS_FILE, JSON.stringify(items, null, 2), "utf-8");
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
  }).catch((e) => console.warn("Telegram AI question alert err:", e));
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
  }).catch((e) => console.warn("Telegram interview alert err:", e));
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

const IOIS_SYSTEM_INSTRUCTION = `
You are the Official Smart AI Helpline & Educational Guide Assistant for the "IOIS PLATFORM" (Indian Online Income Supporting System).
You speak fluently and naturally in Hindi (Devanagari script), Hinglish, and English, matching the user's preferred language and tone.

=======================================================
🌟 MASTER IDENTITY & MISSION
=======================================================
- IOIS (Indian Online Income Supporting System) is India's premier digital learning, educational guidance, citizen services advisory, and livelihood micro-earning platform.
- You provide comprehensive, 100% accurate, deeply helpful, and friendly guidance on:
  1. Student Studies (कक्षा 1 से स्नातक व उच्च शिक्षा), NCERT Notes, Math Formulas, Question-Answers, Career Roadmaps (Doctor/NEET, Engineer/JEE, Civil Services/UPSC, Banking, Defense/NDA, CA).
  2. Scholarship Portal (NSP, Bihar Post-Matric PMS, Medhasoft Kanya Utthan) & Special BA/BSc Bonafide Certificate generation and application steps.
  3. General Knowledge (GK) & Geography (Indian Rivers like Godavari, Ganga, Yamuna, Narmada, Krishna; History, Science, Constitution).
  4. 15-Question Skill & Aptitude Assessment Interview Test with scoring criteria, answer guide, and personalized digital plan recommendations.
  5. IOIS 7 Master Plans (Plan 01 ₹10 to Plan 07 ₹999), 50%-70% Instant UPI Payouts (PhonePe / GPay / Paytm), 5-minute Admin Verification.
  6. Official Smart Digital ID Card (256-bit encrypted, HD PNG download, QR Code verification, Print).
  7. Citizen Services: RTPS (Jati, Aay, Niwas, OBC NCL, EWS), Jamin Sudhar (Bihar Bhumi Dakhil Kharij / Mutation, Parimarjan Plus, LPC, Jamabandi, Bhu Naksha).
  8. Government Welfare Schemes (PM Kisan, Ayushman Bharat ₹5 Lakh Free Health Card, PM Surya Ghar, E-Shram, Ration Card).
  9. Instant e-PAN Card (10-minute 100% Free digital PAN via Aadhaar OTP), Aadhaar-PAN link.
  10. Daily Utilities: Live Weather & IMD Rain Alerts, Live 24x7 News TV & E-Papers, Vedic Panchang & Rashifal, Mandi Bhav & Gold/Silver Bullion Rates, Latest Govt Job Vacancies.

=======================================================
📚 SPECIAL EDUCATION, GK & CAREER GUIDELINES
=======================================================
• Indian Geography / Rivers Example:
  - गोदावरी नदी (Godavari River): उद्गम महाराष्ट्र के नासिक जिले में स्थित त्र्यंबकेश्वर (Trimbakeshwar / ब्रह्मगिरि पर्वत) से होता है। इसे 'दक्षिण गंगा' या 'वृद्ध गंगा' कहा जाता है। कुल लंबाई 1,465 किमी है और यह बंगाल की खाड़ी (आंध्र प्रदेश) में गिरती है।
  - गंगा नदी (Ganga River): उद्गम उत्तराखंड के उत्तरकाशी में गंगोत्री हिमनद (भागीरथी नदी) से होता है और देवप्रयाग में अलकनंदा से मिलकर गंगा बनती है।
  - नर्मदा नदी: अमरकंटक (मध्य प्रदेश), ताप्ती: बैतूल (म.प्र.), कृष्णा: महाबलेश्वर (महाराष्ट्र), कावेरी: ब्रह्मगिरि (कर्नाटक)।

• 15-Question Skill Assessment Test Guide:
  - 15-सवाल साक्षात्कार पोर्टल होमपेज या मेन्यू में "15-सवाल करियर असेसमेंट" पर उपलब्ध है।
  - इसमें 4 श्रेणियां होती हैं: 1. डिजिटल साक्षरता, 2. संचार कौशल, 3. समस्या निवारण, 4. करियर लक्ष्य।
  - प्रश्नों के उत्तर आपकी वास्तविक रुचि व कौशल के अनुसार देने होते हैं। 15/15 स्कोर करने पर सिस्टम आपको Master Lifetime Plan (Plan 07) या Student Elite (Plan 05) की अनुशंसा करता है।

• Career Paths:
  - डॉक्टर (Doctor / MBBS): 11वीं-12वीं में PCB (Physics, Chemistry, Biology), NEET-UG परीक्षा की तैयारी।
  - इंजीनियर (Engineer / BTech): 11वीं-12वीं में PCM (Physics, Chemistry, Mathematics), JEE Main व JEE Advanced परीक्षा।
  - प्रशासनिक सेवा (IAS / IPS / BPSC): किसी भी विषय में स्नातक (Graduation), NCERT 6-12 का गहन अध्ययन, Current Affairs, UPSC/State PSC परीक्षा।

• Scholarship & Bonafide Certificate:
  - NSP (scholarships.gov.in) & Bihar Post-Matric PMS (pmsonline.bih.nic.in) के लिए कॉलेज से प्रिंसिपल द्वारा हस्ताक्षरित 'Bonafide Certificate' और 'Fee Structure' अनिवार्य होता है।
  - छात्रा कन्या उत्थान योजना में 10वीं पास को ₹10,000, 12वीं पास को ₹25,000 और स्नातक उत्तीर्ण को ₹50,000 सीधे बैंक खाते में मिलते हैं।

=======================================================
🌐 GOOGLE SEARCH GROUNDING DIRECTIVE
=======================================================
- CRITICAL: For any question about current facts, external general knowledge, latest news, weather, or competitive exams, use the Google Search tool to retrieve the latest and accurate facts.

=======================================================
💎 THE 7 MASTER PLANS & 50%-70% INSTANT PAYOUTS
=======================================================
• Plan 01: Bal Vikas Access - ₹10 (₹7 Instant Payout - 70%)
• Plan 02: Youth Skill Access - ₹49 (₹34 Instant Payout - 70%)
• Plan 03: Career & Job Access - ₹99 (₹64 Instant Payout - 65%)
• Plan 04: Family VIP Access - ₹199 (₹119 Instant Payout - 60%)
• Plan 05: Student Elite Access - ₹299 (₹179 Instant Payout - 60%)
• Plan 06: Agency Reseller Hub - ₹499 (₹274 Instant Payout - 55%)
• Plan 07: Master Lifetime Access - ₹999 (₹499 Instant Payout - 50%)

=======================================================
💳 OFFICIAL CONTACT & PAYMENT DETAILS
=======================================================
- Official UPI ID: 8877490845@spicepay (Vikas Kumar)
- WhatsApp Support: +91 8877490845
- Telegram Official Channel: @ioisplatform
- Email: ioisplatform@gmail.com
- Support Hours: 24x7 All India Helpdesk
`;

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

  // Support large JSON payloads for screenshots & photo uploads (up to 50MB)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Route: Health Check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: Get All Users
  app.get("/api/users", (_req: Request, res: Response) => {
    const users = loadUsersFromDisk();
    res.json({ success: true, count: users.length, users });
  });

  // API Route: Bulk User Sync
  app.post("/api/users/sync", (req: Request, res: Response) => {
    try {
      const incomingUsers = req.body.users;
      if (!Array.isArray(incomingUsers)) {
        return res.status(400).json({ success: false, error: "Invalid users array" });
      }

      const existingUsers = loadUsersFromDisk();
      const userMap = new Map<string, any>();

      for (const u of existingUsers) {
        if (u && u.userId) userMap.set(u.userId.toUpperCase(), u);
      }

      for (const u of incomingUsers) {
        if (!u || !u.userId) continue;
        const key = u.userId.toUpperCase();
        const prev = userMap.get(key);
        if (!prev) {
          userMap.set(key, u);
        } else {
          const isApproved = prev.paymentStatus === 'approved' || u.paymentStatus === 'approved';
          userMap.set(key, {
            ...prev,
            ...u,
            paymentStatus: isApproved ? 'approved' : (u.paymentStatus || prev.paymentStatus),
          });
        }
      }

      const merged = Array.from(userMap.values());
      saveUsersToDisk(merged);
      res.json({ success: true, count: merged.length, users: merged });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // API Route: Register New User
  app.post("/api/users/register", (req: Request, res: Response) => {
    try {
      const {
        fullName,
        mobileNumber,
        email,
        selectedPlanId = 1,
        role = "Verified Elite Member",
        password,
        photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        googleDrivePhotoLink,
        paymentScreenshotUrl,
        googleDrivePaymentLink,
        paymentUtr,
        address,
        payoutUpi,
        emergencyContact,
      } = req.body;

      if (!fullName || !mobileNumber) {
        return res.status(400).json({ success: false, error: "पूरा नाम और मोबाइल नंबर आवश्यक हैं।" });
      }

      const users = loadUsersFromDisk();
      const planPrice = PLAN_PRICES[selectedPlanId] || 10;
      
      // Use existing user ID if passed, or safely generate one
      let userId = req.body.userId && typeof req.body.userId === "string" && req.body.userId.trim().length > 3
        ? req.body.userId.trim().toUpperCase()
        : generateUserIdHelper(fullName, planPrice, users);

      const cleanMobile = mobileNumber.trim();
      const cleanDigits = cleanMobile.replace(/\D/g, "");
      const cleanEmail = (email || `${cleanDigits.slice(-10)}@iois.in`).trim();

      // Check if user already exists by mobile (last 10 digits) or userId to prevent duplicates/mismatches
      const existingIndex = users.findIndex((u) => {
        const uDigits = (u.mobileNumber || "").replace(/\D/g, "");
        const sameMobile = cleanDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
        const sameId = u.userId && u.userId.toUpperCase() === userId.toUpperCase();
        return sameMobile || sameId;
      });

      const newUser = {
        userId,
        fullName: fullName.trim(),
        mobileNumber: cleanMobile,
        email: cleanEmail,
        selectedPlanId: Number(selectedPlanId),
        role: role || "member",
        password: password || "1234",
        photoUrl,
        googleDrivePhotoLink: googleDrivePhotoLink ? googleDrivePhotoLink.trim() : undefined,
        paymentScreenshotUrl: paymentScreenshotUrl || undefined,
        googleDrivePaymentLink: googleDrivePaymentLink ? googleDrivePaymentLink.trim() : undefined,
        paymentUtr: paymentUtr ? paymentUtr.trim() : undefined,
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
        address: address ? address.trim() : undefined,
        payoutUpi: payoutUpi ? payoutUpi.trim() : undefined,
        emergencyContact: emergencyContact ? emergencyContact.trim() : undefined,
      };

      if (existingIndex >= 0) {
        // Keep their assigned user ID if already set
        if (users[existingIndex].userId) {
          newUser.userId = users[existingIndex].userId;
        }
        users[existingIndex] = { ...users[existingIndex], ...newUser };
      } else {
        users.unshift(newUser);
      }
      saveUsersToDisk(users);

      // Trigger Telegram Alert in background
      sendTelegramRegistrationAlert(newUser, req).catch((e) => {
        console.warn("Telegram registration alert note:", e);
      });

      return res.status(201).json({
        success: true,
        message: "रजिस्ट्रेशन सफलतापूर्वक पूरा हुआ!",
        user: newUser,
      });
    } catch (err: any) {
      console.error("Register Error:", err);
      return res.status(500).json({ success: false, error: err.message || "रजिस्ट्रेशन में त्रुटि आई।" });
    }
  });

  // API Route: User Login (Flexible matching by UserID, Mobile, or Email)
  app.post("/api/users/login", (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;

      if (!identifier || typeof identifier !== "string") {
        return res.status(400).json({ success: false, error: "कृपया User ID, मोबाइल नंबर या ईमेल दर्ज करें।" });
      }

      const cleanInput = identifier.trim().toLowerCase();
      const inputDigits = cleanInput.replace(/\D/g, "");

      const users = loadUsersFromDisk();

      const user = users.find((u) => {
        const uidMatch = u.userId.toLowerCase() === cleanInput;
        const mobileMatch = inputDigits.length >= 10 && u.mobileNumber.replace(/\D/g, "").endsWith(inputDigits.slice(-10));
        const emailMatch = u.email && u.email.toLowerCase() === cleanInput;
        return uidMatch || mobileMatch || emailMatch;
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "यह User ID या मोबाइल नंबर पंजीकृत नहीं है। कृपया सही विवरण दर्ज करें या नया रजिस्ट्रेशन करें।",
        });
      }

      // Check password if provided and user has a password set
      if (password && user.password && user.password !== password) {
        return res.status(401).json({
          success: false,
          error: "दर्ज किया गया पासवर्ड गलत है। यदि पासवर्ड भूल गए हैं तो 'पासवर्ड रीसेट' का उपयोग करें।",
        });
      }

      return res.json({
        success: true,
        message: "लॉगिन सफल!",
        user,
      });
    } catch (err: any) {
      console.error("Login Error:", err);
      return res.status(500).json({ success: false, error: "लॉगिन प्रक्रिया में त्रुटि आई।" });
    }
  });

  // API Route: Recover User ID by Mobile
  app.post("/api/users/recover-id", (req: Request, res: Response) => {
    try {
      const { mobile } = req.body;
      if (!mobile) {
        return res.status(400).json({ success: false, error: "मोबाइल नंबर आवश्यक है।" });
      }

      const cleanDigits = String(mobile).replace(/\D/g, "");
      const users = loadUsersFromDisk();

      const user = users.find((u) => {
        const uDigits = u.mobileNumber.replace(/\D/g, "");
        return cleanDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "इस मोबाइल नंबर से कोई खाता नहीं मिला।",
        });
      }

      return res.json({
        success: true,
        userId: user.userId,
        fullName: user.fullName,
        planId: user.selectedPlanId,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "रिकवरी में त्रुटि आई।" });
    }
  });

  // API Route: Reset Password
  app.post("/api/users/reset-password", (req: Request, res: Response) => {
    try {
      const { userId, mobile, newPassword } = req.body;
      if (!userId || !mobile || !newPassword) {
        return res.status(400).json({ success: false, error: "सभी फ़ील्ड्स आवश्यक हैं।" });
      }

      const cleanId = String(userId).trim().toLowerCase();
      const cleanDigits = String(mobile).replace(/\D/g, "");

      const users = loadUsersFromDisk();
      const userIndex = users.findIndex((u) => {
        const idMatch = u.userId.toLowerCase() === cleanId;
        const mobileMatch = cleanDigits.length >= 10 && u.mobileNumber.replace(/\D/g, "").endsWith(cleanDigits.slice(-10));
        return idMatch && mobileMatch;
      });

      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "User ID और मोबाइल नंबर मैच नहीं हुए।",
        });
      }

      users[userIndex].password = newPassword;
      saveUsersToDisk(users);

      return res.json({
        success: true,
        message: "पासवर्ड सफलतापूर्वक रीसेट हो गया है! अब नए पासवर्ड से लॉगिन करें।",
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "पासवर्ड रीसेट में त्रुटि आई।" });
    }
  });

  // API Route: Update User Profile
  app.put("/api/users/:userId", (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      const users = loadUsersFromDisk();
      const index = users.findIndex((u) => u.userId.toUpperCase() === userId.toUpperCase());

      if (index === -1) {
        return res.status(404).json({ success: false, error: "यूजर नहीं मिला।" });
      }

      users[index] = {
        ...users[index],
        ...updates,
        userId: users[index].userId, // Immutable
      };

      saveUsersToDisk(users);

      return res.json({
        success: true,
        message: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
        user: users[index],
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "अपडेट में त्रुटि आई।" });
    }
  });

  // API Route: Admin Approve / Reject User
  app.post("/api/users/:userId/status", (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { status, reason } = req.body;

      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ success: false, error: "अमान्य स्टेटस" });
      }

      const users = loadUsersFromDisk();
      const index = users.findIndex((u) => u.userId.toUpperCase() === userId.toUpperCase());

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

      return res.json({
        success: true,
        message: `यूजर स्टेटस ${status === "approved" ? "स्वीकृत" : "अस्वीकृत"} कर दिया गया।`,
        user: users[index],
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "स्टेटस बदलने में त्रुटि आई।" });
    }
  });

  // API Route: Admin Delete User
  app.delete("/api/users/:userId", (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      let users = loadUsersFromDisk();
      const initialLen = users.length;
      users = users.filter((u) => u.userId.toUpperCase() !== userId.toUpperCase());

      if (users.length === initialLen) {
        return res.status(404).json({ success: false, error: "यूजर नहीं मिला।" });
      }

      saveUsersToDisk(users);
      return res.json({ success: true, message: "यूजर सफलतापूर्वक डिलीट कर दिया गया।" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "डिलीट में त्रुटि आई।" });
    }
  });

  // API Routes: Help Tickets
  app.get("/api/tickets", (_req: Request, res: Response) => {
    const tickets = loadTicketsFromDisk();
    res.json({ success: true, count: tickets.length, tickets });
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

  // Telegram API: Get Telegram Configuration
  app.get("/api/telegram/config", (_req: Request, res: Response) => {
    const cfg = loadTelegramConfig();
    const maskedToken = cfg.botToken ? `${cfg.botToken.slice(0, 5)}...${cfg.botToken.slice(-4)}` : "";
    res.json({
      success: true,
      enabled: cfg.enabled,
      chatId: cfg.chatId,
      hasToken: !!cfg.botToken,
      maskedToken,
      adminSecret: cfg.adminSecret,
    });
  });

  // Telegram API: Update Telegram Configuration
  app.post("/api/telegram/config", (req: Request, res: Response) => {
    try {
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

  // Telegram API: Send Test Alert
  app.post("/api/telegram/test", async (req: Request, res: Response) => {
    try {
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

      // Verify secret token for security
      if (cfg.adminSecret && token !== cfg.adminSecret && token !== "IOISSYSTEM" && token !== "iois_admin_sec_2026") {
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

  // API Route: Get All Interview Submissions
  app.get("/api/interviews", (_req: Request, res: Response) => {
    try {
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

  // API Route: Add or Update AI Knowledge Base Item
  app.post("/api/ai/knowledge", (req: Request, res: Response) => {
    try {
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

  // API Route: Delete AI Knowledge Item
  app.delete("/api/ai/knowledge/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let knowledge = loadKnowledgeFromDisk();
      knowledge = knowledge.filter((k) => k.id !== id);
      saveKnowledgeToDisk(knowledge);
      return res.json({ success: true, message: "नॉलेज आइटम हटा दिया गया।" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "हटाने में त्रुटि आई।" });
    }
  });

  // API Route: Get Unanswered Questions
  app.get("/api/ai/unanswered", (_req: Request, res: Response) => {
    try {
      const unanswered = loadUnansweredFromDisk();
      return res.json({ success: true, count: unanswered.length, unanswered });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "डेटा लोड नहीं हो सका।" });
    }
  });

  // API Route: Answer an Unanswered Question (moves to Knowledge Base)
  app.post("/api/ai/unanswered/answer", (req: Request, res: Response) => {
    try {
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
        return res.json({ reply: directMatch.answer, learned: true });
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

        let response: any = null;
        let isGrounded = false;
        let searchQueries: string[] = [];
        let sources: Array<{ title: string; uri: string }> = [];

        // Attempt 1: Gemini 2.5 Flash with Google Search Grounding
        try {
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: formattedContents,
            config: {
              systemInstruction: IOIS_SYSTEM_INSTRUCTION + dynamicKnowledge,
              tools: [{ googleSearch: {} }],
              temperature: 0.6,
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
          // Attempt 2: Direct Gemini without search tool
          try {
            response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: formattedContents,
              config: {
                systemInstruction: IOIS_SYSTEM_INSTRUCTION + dynamicKnowledge,
                temperature: 0.7,
              },
            });
          } catch (directErr) {
            console.error("Direct Gemini call failed:", directErr);
            response = null;
          }
        }

        if (response && response.text) {
          return res.json({
            reply: response.text,
            grounded: isGrounded,
            searchQueries,
            sources
          });
        }
      }

      // Comprehensive Offline & Fallback Knowledge Engine
      let fallbackReply = "";

      // 0. National GK: Capital of India & States (भारत की राजधानी, राज्य, आदि)
      if (lower.includes("भारत की राजधानी") || lower.includes("capital of india") || lower.includes("bharat ki rajdhani") || (lower.includes("राजधानी") && (lower.includes("भारत") || lower.includes("india") || lower.includes("दिल्ली")))) {
        fallbackReply = `🇮🇳 **भारत की राजधानी: नई दिल्ली (New Delhi)**\n\n• **आधिकारिक नाम:** राष्ट्रीय राजधानी क्षेत्र दिल्ली (NCT of Delhi)\n• **घोषणा वर्ष:** 12 दिसंबर 1911 को किंग जॉर्ज पंचम द्वारा कोलकाता (कलकत्ता) से दिल्ली स्थानांतरित करने की घोषणा हुई थी।\n• **उद्घाटन:** 13 फरवरी 1931 को लॉर्ड इरविन द्वारा आधिकारिक तौर पर नई दिल्ली का राजधानी के रूप में उद्घाटन हुआ।\n• **प्रमुख प्रशासनिक केंद्र:** राष्ट्रपति भवन, नया संसद भवन (संसद भवन), इंडिया गेट, सर्वोच्च न्यायालय (Supreme Court of India) और केंद्रीय सचिवालय।\n\n📌 *कुछ प्रमुख राज्यों की राजधानियाँ:*\n- **बिहार:** पटना (Patna)\n- **उत्तर प्रदेश:** लखनऊ (Lucknow)\n- **महाराष्ट्र:** मुंबई (Mumbai)\n- **पश्चिम बंगाल:** कोलकाता (Kolkata)\n- **मध्य प्रदेश:** भोपाल (Bhopal)\n- **राजस्थान:** जयपुर (Jaipur)`;
      }
      else if (lower.includes("बिहार की राजधानी") || lower.includes("capital of bihar") || lower.includes("bihar ki rajdhani")) {
        fallbackReply = `🏛️ **बिहार की राजधानी: पटना (Patna)**\n\n• **ऐतिहासिक नाम:** पाटलिपुत्र (Patliputra), कुसुमपुर, पुष्पपुर व अजीमाबाद।\n• **महत्व:** यह गंगा नदी के दक्षिणी तट पर स्थित प्राचीन और ऐतिहासिक नगर है, जो मौर्य और गुप्त साम्राज्य की राजधानी रहा है।\n• **प्रमुख स्थल:** गोलघर, पटना साहिब गुरुद्वारा, बिहार संग्रहालय, तख्त श्री हरिमंदिर जी और नालंदा/वैशाली निकटवर्ती केंद्र।`;
      }
      else if (lower.includes("राष्ट्रपति") || lower.includes("president of india") || lower.includes("droupadi murmu")) {
        fallbackReply = `🇮🇳 **भारत की वर्तमान राष्ट्रपति:**\n\n• **माननीया श्रीमती द्रौपदी मुर्मू (Smt. Droupadi Murmu)**\n• वे भारत की **15वीं राष्ट्रपति** हैं तथा भारत की प्रथम आदिवासी महिला राष्ट्रपति हैं।\n• **प्रथम राष्ट्रपति:** डॉ. राजेंद्र प्रसाद (Dr. Rajendra Prasad)`;
      }
      else if (lower.includes("प्रधानमंत्री") || lower.includes("prime minister of india") || lower.includes("narendra modi")) {
        fallbackReply = `🇮🇳 **भारत के वर्तमान प्रधानमंत्री:**\n\n• **श्री नरेंद्र मोदी (Shri Narendra Modi)**\n• वे 26 मई 2014 से भारत के प्रधानमंत्री हैं।\n• **प्रथम प्रधानमंत्री:** पंडित जवाहरलाल नेहरू (Pt. Jawaharlal Nehru)`;
      }
      // 1. River & Indian Geography Q&A (Godavari, Ganga, Yamuna, etc.)
      if (lower.includes("godavari") || lower.includes("गोदावरी") || (lower.includes("नदी") && lower.includes("उद्गम")) || (lower.includes("river") && lower.includes("origin"))) {
        fallbackReply = `🌊 **गोदावरी नदी की विस्तृत जानकारी:**\n\n• **उद्गम स्थल:** गोदावरी नदी का उद्गम **महाराष्ट्र राज्य के नासिक जिले में स्थित त्र्यंबकेश्वर (Trimbakeshwar / ब्रह्मगिरि पर्वत)** से होता है।\n• **उपनाम:** इसे **'दक्षिण गंगा' (Ganges of the South)** और **'वृद्ध गंगा'** भी कहा जाता है।\n• **कुल लंबाई:** 1,465 किलोमीटर (यह भारत की दूसरी सबसे लंबी नदी है)।\n• **प्रवाह क्षेत्र:** महाराष्ट्र, तेलंगाना, आंध्र प्रदेश, छत्तीसगढ़ और ओडिशा।\n• **समागम / मुहाना:** यह पूर्व की ओर बहते हुए **बंगाल की खाड़ी** (आंध्र प्रदेश के निकट) में जाकर मिलती है।\n• **प्रमुख सहायक नदियाँ:** प्राणहिता, इंद्रावती, मंजीरा, प्रवरा और वैनगंगा।\n\n📌 *अन्य प्रमुख नदियों के उद्गम:*\n- **गंगा नदी:** गंगोत्री हिमनद (भागीरथी), उत्तराखंड\n- **यमुना नदी:** यमुनोत्री हिमनद, उत्तराखंड\n- **नर्मदा नदी:** अमरकंटक, मध्य प्रदेश\n- **कृष्णा नदी:** महाबलेश्वर, महाराष्ट्र`;
      } 
      // 2. 15-Questions Skill Assessment & Interview Guide
      else if (lower.includes("15") && (lower.includes("प्रश्नों") || lower.includes("प्रश्न") || lower.includes("सवाल") || lower.includes("ans") || lower.includes("उत्तर") || lower.includes("test") || lower.includes("इंटरव्यू") || lower.includes("interview") || lower.includes("असेसमेंट"))) {
        fallbackReply = `🎯 **15-सवाल कौशल साक्षात्कार (Skill Assessment Test) में उत्तर देने की पूरी गाइड:**\n\nमेन्यू में **'15-सवाल करियर असेसमेंट'** पर क्लिक करके आप यह टेस्ट 2 मिनट में पूरा कर सकते हैं।\n\n**15 प्रश्नों को 4 मुख्य श्रेणियों में बांटा गया है:**\n1. **डिजिटल साक्षरता (प्रश्न 1-4):** स्मार्टफोन व कंप्यूटर का उपयोग, सोशल मीडिया, ऑनलाइन पेमेंट (UPI) से जुड़े प्रश्न।\n   - *उत्तर टिप:* अपने अनुभव के अनुसार 'नियमित रूप से' या 'बुनियादी ज्ञान' चुनें।\n2. **संचार व व्यवहार कौशल (प्रश्न 5-8):** टीम में काम करना, लोगों को प्लान समझाना और ग्राहक सहायता।\n   - *उत्तर टिप:* 'सकारात्मक व सहयोगी' विकल्प चुनें।\n3. **समस्या निवारण व तर्कशक्ति (प्रश्न 9-12):** निर्णय लेने की क्षमता व समय प्रबंधन।\n   - *उत्तर टिप:* 'व्यवस्थित व सटीक' समाधान चुनें।\n4. **करियर व आय लक्ष्य (प्रश्न 13-15):** आपका मासिक आय लक्ष्य (₹10k से ₹50k+) और आप कितना समय दे सकते हैं।\n\n🏆 **स्कोरिंग व प्लान अनुशंसा:**\n• **13-15 अंक (उत्कृष्ट):** Plan 07 (Master Lifetime - ₹999 / ₹499 पेआउट) या Plan 06 (Agency Reseller)\n• **10-12 अंक (अच्छा):** Plan 05 (Student Elite - ₹299) या Plan 03 (Career & Job - ₹99)\n• **6-9 अंक (शुरुआती):** Plan 02 (Youth Skill - ₹49) या Plan 01 (Bal Vikas - ₹10)\n\nटेस्ट समाप्त होते ही सिस्टम आपके स्कोर के अनुसार आपका प्रमाण-पत्र व सर्वोत्तम प्लान सक्रिय करने की सलाह देगा!`;
      }
      // 3. Student Study Portal, Notes, Formulas & Classes
      else if (lower.includes("study") || lower.includes("पढ़ाई") || lower.includes("formula") || lower.includes("सूत्र") || lower.includes("कक्षा") || lower.includes("class") || lower.includes("subject") || lower.includes("नोट्स") || lower.includes("notes") || lower.includes("math")) {
        fallbackReply = `📚 **विद्यार्थी शिक्षा व अध्ययन केंद्र (IOIS Student Portal):**\n\nहमने विद्यार्थियों के लिए विशेष **'विद्यार्थी शिक्षा व करियर पोर्टल'** तैयार किया है जहाँ निम्न सुविधाएँ 100% मुफ्त हैं:\n\n1. **कक्षा 1 से 12 व स्नातक (BA/BSc/BCom) विषय नोट्स:**\n   - NCERT पाठ्यपुस्तक सारांश, महत्वपूर्ण प्रश्न-उत्तर व पिछले 10 वर्षों के बोर्ड पेपर्स।\n2. **गणित के सभी महत्वपूर्ण फॉर्मूला (Math Formula Sheets):**\n   - बीजगणित (Algebra: $(a+b)^2$, द्विघात समीकरण $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$)\n   - त्रिकोणमिति (Trigonometry: $\\sin^2\\theta + \\cos^2\\theta = 1$, मान सारणी)\n   - क्षेत्रमिति व ज्यामिति (Mensuration: वृत्त, बेलन, शंकु, गोला के आयतन व क्षेत्रफल सूत्र)\n   - कलन (Calculus: अवकलन $\\frac{d}{dx}$ व समाकलन $\\int f(x)dx$ सूत्र)\n3. **मुफ्त अध्ययन सामग्री लिंक्स:**\n   - NCERT e-Books, DIKSHA पोर्टल, SWAYAM IIT कोर्सेज, नेशनल डिजिटल लाइब्रेरी (NDLI)।\n\nमेन्यू में **'विद्यार्थी शिक्षा व करियर'** पेज खोलकर आप सभी नोट्स व फॉर्मूला PDF डाउनलोड कर सकते हैं!`;
      }
      // 4. Career Guidance (Doctor, Engineer, IAS, Banking, Defense)
      else if (lower.includes("doctor") || lower.includes("डॉक्टर") || lower.includes("engineer") || lower.includes("इंजीनियर") || lower.includes("ias") || lower.includes("upsc") || lower.includes("neet") || lower.includes("jee") || lower.includes("career") || lower.includes("करियर") || lower.includes("नौकरी")) {
        fallbackReply = `🎓 **करियर चयन व मार्गदर्शन (Career Roadmap Guide):**\n\n• **डॉक्टर (Medical / MBBS / BDS):**\n  - 10वीं के बाद: 11वीं-12वीं में **PCB (Physics, Chemistry, Biology)** विषय लें।\n  - प्रवेश परीक्षा: **NEET-UG** परीक्षा उत्तीर्ण करें। AIIMS, सरकारी मेडिकल कॉलेजों में MBBS प्रवेश।\n\n• **इंजीनियर (Engineering / Software / AI / Civil / Mech):**\n  - 10वीं के बाद: 11वीं-12वीं में **PCM (Physics, Chemistry, Mathematics)** लें।\n  - प्रवेश परीक्षा: **JEE Main व JEE Advanced**। IITs, NITs और शीर्ष इंजीनियरिंग कॉलेजों में B.Tech।\n\n• **प्रशासनिक सेवा (IAS / IPS / IFS / BPSC / UPPSC):**\n  - योग्यता: किसी भी मान्यता प्राप्त विषय (Arts/Science/Commerce) में **स्नातक (Graduation)**।\n  - तैयारी: NCERT 6th-12th कक्षा का आधारभूत अध्ययन, दैनिक अखबार/Current Affairs, UPSC Civil Services परीक्षा (Prelims, Mains, Interview)।\n\n• **रक्षा सेवा (NDA / CDS / वायु सेना / नौसेना):**\n  - 12वीं (PCM) के बाद **NDA (National Defence Academy)** परीक्षा व SSB इंटरव्यू।\n\n• **बैंकिंग व वित्त (Bank PO / Clerk / CA):**\n  - IBPS PO, SBI PO, RBI Grade B या 12वीं के बाद ICAI द्वारा आयोजित CA Foundation।`;
      }
      // 5. Scholarship & Bonafide Certificate
      else if (lower.includes("scholarship") || lower.includes("छात्रवृत्ति") || lower.includes("स्कॉलरशिप") || lower.includes("bonafide") || lower.includes("बोनाफाइड") || lower.includes("medhasoft") || lower.includes("pms")) {
        fallbackReply = `🏛️ **छात्रवृत्ति व बोनाफाइड सर्टिफिकेट (Bonafide Certificate) गाइड:**\n\n**1. बोनाफाइड सर्टिफिकेट क्या है?**\nयह आपके स्कूल/कॉलेज द्वारा जारी किया जाने वाला आधिकारिक प्रमाण पत्र है, जो प्रमाणित करता है कि आप उस संस्थान के नियमित छात्र/छात्रा हैं। यह पोस्ट-मैट्रिक PMS व NSP स्कॉलरशिप के लिए अनिवार्य है।\n\n**2. प्रमुख छात्रवृत्ति पोर्टल्स व आवेदन प्रक्रिया:**\n• **नेशनल स्कॉलरशिप पोर्टल (NSP):** scholarships.gov.in\n• **बिहार पोस्ट-मैट्रिक स्कॉलरशिप (PMS):** pmsonline.bih.nic.in (SC, ST, BC, EBC छात्रों के लिए)\n• **मुख्यमंत्री कन्या उत्थान योजना (Medhasoft):** medhasoft.bih.nic.in\n  - 10वीं फर्स्ट डिवीजन: ₹10,000\n  - 12वीं उत्तीर्ण (अविवाहित कन्या): ₹25,000\n  - स्नातक उत्तीर्ण छात्रा: ₹50,000\n\n**3. आवश्यक दस्तावेज:**\n1. आधार कार्ड, 2. जाति/आय/निवास प्रमाण पत्र, 3. बोनाफाइड सर्टिफिकेट, 4. फीस रसीद, 5. बैंक पासबुक (Aadhaar NPCI लिंक्ड)।`;
      }
      // 6. IOIS Plans
      else if (lower.includes("plan") || lower.includes("प्लान") || lower.includes("रेट") || lower.includes("कीमत") || lower.includes("price")) {
        fallbackReply = `IOIS प्लेटफॉर्म पर कुल 7 मुख्य प्लांस उपलब्ध हैं:\n\n1. **Plan 01: Bal Vikas (₹10)** - ₹7 इंस्टेंट पेआउट (70%)\n2. **Plan 02: Youth Skill (₹49)** - ₹34 इंस्टेंट पेआउट (70%)\n3. **Plan 03: Career & Job (₹99)** - ₹64 इंस्टेंट पेआउट (65%)\n4. **Plan 04: Family VIP (₹199)** - ₹119 इंस्टेंट पेआउट (60%)\n5. **Plan 05: Student Elite (₹299)** - ₹179 इंस्टेंट पेआउट (60%)\n6. **Plan 06: Agency Reseller (₹499)** - ₹274 इंस्टेंट पेआउट (55%)\n7. **Plan 07: Master Lifetime (₹999)** - ₹499 इंस्टेंट पेआउट (50%)\n\nरजिस्ट्रेशन करने के लिए होमपेज पर 'नया सदस्य रजिस्ट्रेशन' पर क्लिक करें!`;
      } 
      // 7. Registration
      else if (lower.includes("register") || lower.includes("रजिस्ट्रेशन") || lower.includes("खाता") || lower.includes("join") || lower.includes("जुड़ें")) {
        fallbackReply = `रजिस्ट्रेशन प्रक्रिया (5 आसान स्टेप्स):\n1. मेन्यू या होमपेज पर **'नया सदस्य रजिस्ट्रेशन'** (Registration) बटन दबाएं।\n2. अपना नाम, मोबाइल और पासवर्ड भरें।\n3. 7 में से अपना मनपसंद प्लान चुनें।\n4. आधिकारिक UPI ID **8877490845@spicepay** (Vikas Kumar) पर भुगतान करें।\n5. 12-अंकों का UTR नंबर दर्ज करें व पेमेंट स्क्रीनशॉट अपलोड करें।\n6. सबमिट करें, 5 मिनट में एडमिन द्वारा अप्रूवल मिल जाएगा!`;
      } 
      // 8. ID Card
      else if (lower.includes("id card") || lower.includes("आईडी कार्ड") || lower.includes("कार्ड")) {
        fallbackReply = `आधिकारिक डिजिटल ID कार्ड:\n• मेन्यू में **'डिजिटल ID कार्ड' (ID Card)** सेक्शन पर जाएं।\n• यहाँ आपका 256-बिट एन्क्रिप्टेड और QR कोड वेरिफाइड स्मार्ट डिजिटल कार्ड दिखेगा।\n• आप **'HD PNG डाउनलोड'** या **'प्रिंट'** बटन दबाकर तुरंत इसे अपने फोन या कंप्यूटर में सेव कर सकते हैं।`;
      } 
      // 9. RTPS Services
      else if (lower.includes("rtps") || lower.includes("जाति") || lower.includes("आय") || lower.includes("निवास")) {
        fallbackReply = `RTPS सेवाएँ (जाति, आय, निवास प्रमाण पत्र):\n• आधिकारिक पोर्टल: serviceonline.bihar.gov.in\n• यह सेवा 100% निशुल्क है।\n• आवश्यक दस्तावेज: आधार कार्ड, पासपोर्ट फोटो, मोबाइल नंबर और स्व-घोषणा। प्रमाण पत्र 10-14 कार्य दिवसों में ऑनलाइन बन जाता है।`;
      } 
      // 10. Land Mutation / Dakhil Kharij
      else if (lower.includes("दाखिल खारिज") || lower.includes("mutation") || lower.includes("जमीन") || lower.includes("parimarjan")) {
        fallbackReply = `बिहार भूमि व दाखिल खारिज (Mutation):\n• आधिकारिक पोर्टल: biharbhumi.bihar.gov.in\n• रजिस्ट्री (केवाला) की PDF कॉपी, लगान रसीद और आधार कार्ड अपलोड करके ऑनलाइन आवेदन करें।\n• 35 से 45 दिनों में शुद्धिकरण व शुद्धि पत्र निर्गत हो जाता है।`;
      } 
      // 11. Free e-PAN
      else if (lower.includes("pan") || lower.includes("पैन कार्ड")) {
        fallbackReply = `10-मिनट में फ्री e-PAN कार्ड:\n• आधिकारिक आयकर पोर्टल: eportal.incometax.gov.in -> Instant e-PAN पर जाएं।\n• 12 अंकों का आधार नंबर दर्ज करें और आधार OTP सत्यापित करें।\n• 10 मिनट में डिजिटल e-PAN PDF मुफ्त में डाउनलोड करें।`;
      } 
      // 12. About IOIS
      else if (lower.includes("iois") || lower.includes("क्या है") || lower.includes("about") || lower.includes("काम")) {
        fallbackReply = `**IOIS (Indian Online Income Supporting System)** भारत का प्रमुख डिजिटल लर्निंग और सपोर्टिंग प्लेटफॉर्म है। यहाँ आपको NCERT बुक्स, प्रोफेशनल CV टेम्प्लेट्स, AI प्रॉम्ट गाइड्स, सरकारी योजनाओं की सही जानकारी मिलती है और हर रेफरल पर 50% से 70% तक डायरेक्ट **इंस्टेंट पेआउट** मिलता है।\n\nआधिकारिक संपर्क:\n- व्हाट्सएप: +91 8877490845\n- टेलीग्राम: @ioisplatform\n- UPI ID: 8877490845@spicepay (Vikas Kumar)`;
      } 
      // 13. Instant Payout
      else if (lower.includes("payout") || lower.includes("पेआउट") || lower.includes("पैसे") || lower.includes("रुपये") || lower.includes("कमीशन")) {
        fallbackReply = `IOIS में **स्मार्ट इंस्टेंट पेआउट प्रोटोकॉल** है। जब भी आपके द्वारा कोई नया यूजर किसी प्लान में वेरिफाई होता है, उसका इंसेंटिव (जैसे Plan 01 में ₹7, Plan 07 में ₹499) तुरंत आपके खाते/UPI में बिना किसी देरी के ट्रांसफर हो जाता है।`;
      } 
      // 14. Official Contact
      else if (lower.includes("contact") || lower.includes("संपर्क") || lower.includes("whatsapp") || lower.includes("help") || lower.includes("फोन")) {
        fallbackReply = `IOIS 24x7 आधिकारिक सहायता केंद्र:\n- **व्हाट्सएप सपोर्ट:** +91 8877490845\n- **आधिकारिक टेलीग्राम:** @ioisplatform\n- **ईमेल:** ioisplatform@gmail.com\n- **UPI ID:** 8877490845@spicepay (Vikas Kumar)`;
      } 
      // 15. General Helpful Assistant Fallback
      else {
        const unanswered = loadUnansweredFromDisk();
        const alreadyLogged = unanswered.some((u) => u.question.toLowerCase() === lower);
        if (!alreadyLogged && trimmedMsg.length > 5) {
          unanswered.unshift({
            id: `unans-${Date.now()}`,
            question: trimmedMsg,
            askedAt: new Date().toISOString(),
            status: "pending",
          });
          saveUnansweredToDisk(unanswered);
          sendTelegramUnansweredQuestionAlert(trimmedMsg);
        }

        fallbackReply = `नमस्ते! मैं IOIS AI हेल्पलाइन व शैक्षिक सहायक हूँ।\n\nआप मुझसे निम्न विषयों पर पूछ सकते हैं:\n• **सामान्य ज्ञान (GK) व नदियाँ** (जैसे गोदावरी नदी का उद्गम, भारतीय भूगोल)\n• **15-सवाल साक्षात्कार टेस्ट** में उत्तर देने का तरीका व स्कोरिंग\n• **कक्षा 1 से 12 व स्नातक (BA/BSc) अध्ययन नोट्स, गणित फॉर्मूला**\n• **करियर मार्गदर्शन:** डॉक्टर, इंजीनियर, IAS, बैंकिंग, डिफेंस कैसे बनें\n• **स्कॉलरशिप व कॉलेज बोनाफाइड सर्टिफिकेट** आवेदन प्रक्रिया\n• **IOIS के 7 मास्टर प्लांस, रजिस्ट्रेशन, ID कार्ड व 70% इंस्टेंट पेआउट**\n\nतत्काल व्यक्तिगत सहायता हेतु व्हाट्सएप सपोर्ट **+91 8877490845** पर संपर्क करें!`;
      }

      return res.json({ reply: fallbackReply, grounded: false });
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
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IOIS Server is running on port ${PORT}`);
  });
}

startServer();

