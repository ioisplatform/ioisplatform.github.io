import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  Key, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck,
  Eye,
  EyeOff,
  Radio,
  Check,
  Copy
} from 'lucide-react';

export const TelegramAdminSettings: React.FC = () => {
  const [botToken, setBotToken] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(true);
  const [adminSecret, setAdminSecret] = useState<string>('IOISSYSTEM');
  
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [maskedToken, setMaskedToken] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/telegram/config');
      if (res.ok) {
        const data = await res.json();
        setEnabled(data.enabled ?? true);
        setChatId(data.chatId || '');
        setHasToken(data.hasToken || false);
        setMaskedToken(data.maskedToken || '');
        if (data.adminSecret) setAdminSecret(data.adminSecret);
      }
    } catch (e) {
      console.warn('Failed to load Telegram config:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const res = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: botToken.trim() || undefined,
          chatId: chatId.trim(),
          enabled,
          adminSecret: adminSecret.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: '✅ टेलीग्राम सेटिंग्स सफलतापूर्वक सुरक्षित कर दी गई हैं!' });
        setBotToken('');
        await fetchConfig();
      } else {
        setFeedback({ type: 'error', message: data.error || 'सेटिंग्स सेव करने में त्रुटि आई।' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'सर्वर से कनेक्ट नहीं हो सका।' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    setFeedback(null);
    setTesting(true);

    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: data.message || '✅ टेस्ट अलर्ट आपके टेलीग्राम पर भेज दिया गया है! अपने टेलीग्राम ऐप में चेक करें।' });
      } else {
        setFeedback({ type: 'error', message: data.error || 'टेस्ट अलर्ट नहीं भेजा जा सका। कृपया Bot Token और Chat ID की जाँच करें।' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'टेस्ट अलर्ट भेजने में त्रुटि आई।' });
    } finally {
      setTesting(false);
    }
  };

  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/telegram/webhook` : '/api/telegram/webhook';

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  return (
    <div id="telegram-admin-settings" className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card-gold p-6 rounded-3xl border border-amber-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">Telegram 1-Click Approval System</h3>
                {hasToken && enabled ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ACTIVE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    SETUP REQUIRED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                जब भी कोई नया यूज़र रजिस्ट्रेशन करेगा, आपके टेलीग्राम पर तुरंत फ़ोटो, UTR और <b>[✅ Approve] [❌ Reject]</b> बटन्स के साथ संदेश आएगा। आप टेलीग्राम से 1-क्लिक में तुरंत अप्रूव कर सकते हैं!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleSendTest}
              disabled={testing || !hasToken}
              className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className={`w-3.5 h-3.5 ${testing ? 'animate-bounce' : ''}`} />
              <span>{testing ? 'भेज रहे हैं...' : '🚀 टेस्ट अलर्ट भेजें'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/60 border-red-500/50 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Settings Form + Guide Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveConfig} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4" /> बॉट क्रेडेंशियल्स दर्ज करें
            </h4>

            {/* Toggle Enable */}
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">टेलीग्राम ऑटो अलर्ट्स सक्षम करें</div>
                <div className="text-[11px] text-slate-400">नए रजिस्ट्रेशन होने पर तुरंत टेलीग्राम पर मैसेज भेजें</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Bot Token Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  Telegram Bot API Token <span className="text-amber-400">*</span>
                </label>
                {hasToken && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    ✓ टोकन सेव्ड: {maskedToken}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder={hasToken ? 'नया टोकन बदलने के लिए यहाँ टाइप करें...' : 'उदा: 7891234567:AAHxxxxxxxxxxxxxxxxxxxx'}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Telegram पर <b>@BotFather</b> से <code>/newbot</code> कमांड बनाकर प्राप्त करें।
              </p>
            </div>

            {/* Chat ID Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Admin Chat ID या Channel ID <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="उदा: 8877490845 या -1001234567890"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400">
                अपनी Chat ID जानने के लिए Telegram पर <b>@userinfobot</b> को <code>/start</code> भेजें।
              </p>
            </div>

            {/* Admin Security PIN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                सुरक्षा सीक्रेट (Security Key for 1-Click Buttons)
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="IOISSYSTEM"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400">
                यह की सुनिश्चित करती है कि केवल आप ही Telegram बटन दबाकर अप्रूव/रिजेक्ट कर सकें।
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>सेव हो रहा है...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>सेटिंग्स सुरक्षित करें (Save Telegram Settings)</span>
                </>
              )}
            </button>
          </form>

          {/* Webhook Info Card */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              <span>वैकल्पिक: Telegram Bot Webhook URL</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400">
              <span className="truncate flex-1">{webhookUrl}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(webhookUrl)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition shrink-0"
              >
                {copiedWebhook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedWebhook ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5-Minute Setup Guide Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1 मिनट में बॉट सेटअप कैसे करें?</span>
            </h4>

            <ol className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <p className="font-bold text-white">Telegram पर BotFather खोलें</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Telegram सर्च में <b>@BotFather</b> खोलें और <code>/newbot</code> भेजें।
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <p className="font-bold text-white">बॉट का नाम व यूज़रनेम दें</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    उदा: <i>IOIS Admin Alert Bot</i> और यूज़रनेम <i>IOIS_Alert_Bot</i> रखें।
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <p className="font-bold text-white">Bot API Token कॉपी करें</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    BotFather द्वारा दिया गया लंबा टोकन कॉपी करके यहाँ फॉर्म में पेस्ट करें।
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <div>
                  <p className="font-bold text-white">अपनी Chat ID प्राप्त करें</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Telegram पर <b>@userinfobot</b> को <code>/start</code> भेजें, जो आपकी numeric Chat ID बता देगा।
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  5
                </span>
                <div>
                  <p className="font-bold text-white">अपने नए बॉट को START करें</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    अपने बनाए बॉट में जाकर <b>START</b> बटन दबाएँ, फिर यहाँ <b>"टेस्ट अलर्ट भेजें"</b> पर क्लिक करें!
                  </p>
                </div>
              </li>
            </ol>

            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-[11px] text-amber-300">
              💡 <b>प्रो टिप:</b> आप बॉट को अपने पर्सनल Telegram ग्रुप या प्राइवेट चैनल में एडमिन बनाकर पूरे टीम के साथ भी अप्रूवल अलर्ट्स मैनेज कर सकते हैं!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
