import React, { useState, useEffect } from 'react';
import { KnowledgeItem } from '../types';
import { 
  fetchKnowledgeFromFirestore,
  syncKnowledgeToFirestore,
  deleteKnowledgeFromFirestore,
  subscribeToFirestoreKnowledge,
  syncUnansweredToFirestore,
  deleteUnansweredFromFirestore,
  subscribeToFirestoreUnanswered,
  INITIAL_KNOWLEDGE
} from '../services/userService';
import { 
  Bot, 
  Plus, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Send, 
  Search, 
  MessageSquare,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface UnansweredQuestion {
  id: string;
  question: string;
  askedAt: string;
  status: string;
}

export const AiKnowledgeManager: React.FC = () => {
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
  const [unansweredList, setUnansweredList] = useState<UnansweredQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'knowledge' | 'unanswered'>('unanswered');

  // New Q&A Form
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('General');
  const [formSuccess, setFormSuccess] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Answering modal/inline
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [quickAnswer, setQuickAnswer] = useState<string>('');

  const fetchKnowledgeData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch from Firestore (Permanent Cloud DB)
      const firestoreItems = await fetchKnowledgeFromFirestore();
      if (firestoreItems && firestoreItems.length > 0) {
        setKnowledgeList(firestoreItems);
      }

      // 2. Fetch from server as well
      const [kRes, uRes] = await Promise.all([
        fetch('/api/ai/knowledge').then((r) => r.json()).catch(() => null),
        fetch('/api/ai/unanswered').then((r) => r.json()).catch(() => null),
      ]);
      if (kRes && kRes.success && Array.isArray(kRes.knowledge) && kRes.knowledge.length > 0) {
        setKnowledgeList(kRes.knowledge);
      }
      if (uRes && uRes.success && Array.isArray(uRes.unanswered)) {
        setUnansweredList(uRes.unanswered);
      }
    } catch (e) {
      console.warn('Error fetching AI knowledge:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeData();

    // Setup Real-time Firestore Listeners
    const unsubK = subscribeToFirestoreKnowledge((items) => {
      if (items && items.length > 0) {
        setKnowledgeList(items);
      }
    });

    const unsubU = subscribeToFirestoreUnanswered((items) => {
      if (items) {
        setUnansweredList(items);
      }
    });

    return () => {
      unsubK();
      unsubU();
    };
  }, []);

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setFormError('प्रश्न और उत्तर दोनों अनिवार्य हैं।');
      return;
    }
    setFormError('');

    const newId = `k-${Date.now()}`;
    const newItem: KnowledgeItem = {
      id: newId,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory,
      createdAt: new Date().toISOString(),
      hits: 0,
    };

    // 1. Save immediately to Firestore (PERMANENT)
    await syncKnowledgeToFirestore(newItem);

    // 2. Update local state
    setKnowledgeList((prev) => [newItem, ...prev.filter((k) => k.id !== newId)]);

    // 3. Post to backend server
    try {
      await fetch('/api/ai/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (e) {
      console.warn('Server sync note:', e);
    }

    setFormSuccess('✅ AI बॉट को नया सवाल-जवाब सफलतापूर्वक क्लाउड डेटाबेस में सिखा दिया गया!');
    setNewQuestion('');
    setNewAnswer('');
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const handleDeleteKnowledge = async (id: string) => {
    if (!window.confirm('क्या आप इस ज्ञान आइटम को हटाना चाहते हैं?')) return;
    try {
      // 1. Delete from Firestore
      await deleteKnowledgeFromFirestore(id);
      // 2. Update local state
      setKnowledgeList((prev) => prev.filter((k) => k.id !== id));
      // 3. Delete on server
      await fetch(`/api/ai/knowledge/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Delete knowledge error', e);
    }
  };

  const handleQuickAnswerSubmit = async (questionId: string) => {
    if (!quickAnswer.trim()) return;
    const unansweredItem = unansweredList.find((q) => q.id === questionId);
    const questionText = unansweredItem ? unansweredItem.question : 'Learned Question';

    const newItem: KnowledgeItem = {
      id: `k-learned-${Date.now()}`,
      question: questionText,
      answer: quickAnswer.trim(),
      category: 'Learned From User',
      createdAt: new Date().toISOString(),
      hits: 1,
    };

    // 1. Save to Firestore (PERMANENT)
    await syncKnowledgeToFirestore(newItem);
    await deleteUnansweredFromFirestore(questionId);

    // 2. Update local state
    setKnowledgeList((prev) => [newItem, ...prev]);
    setUnansweredList((prev) => prev.filter((q) => q.id !== questionId));
    setAnsweringId(null);
    setQuickAnswer('');

    // 3. Sync to server
    try {
      await fetch('/api/ai/unanswered/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: questionId,
          answer: quickAnswer.trim(),
          category: 'Learned From User',
        }),
      });
    } catch (e) {}

    setFormSuccess('AI बॉट ने इस सवाल का उत्तर हमेशा के लिए क्लाउड डेटाबेस में सुरक्षित कर लिया है!');
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const filteredKnowledge = knowledgeList.filter((k) => {
    const q = searchQuery.toLowerCase();
    return (
      (k.question || '').toLowerCase().includes(q) ||
      (k.answer || '').toLowerCase().includes(q) ||
      (k.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>AI HELPLINE BRAIN & TELEGRAM KNOWLEDGE SYSTEM</span>
          </div>
          <h3 className="text-xl font-black text-white">
            🤖 AI बॉट ज्ञान व सवाल प्रबंधन (AI Knowledge Training)
          </h3>
          <p className="text-xs text-slate-300">
            यूजर द्वारा पूछे गए नए सवाल यहाँ दिखते हैं और Telegram पर भी भेजे जाते हैं। आप यहाँ 1-क्लिक में उत्तर सिखा सकते हैं।
          </p>
        </div>

        <button
          onClick={fetchKnowledgeData}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>रिफ्रेश डेटा</span>
        </button>
      </div>

      {/* Sub tabs: Unanswered vs Full Knowledge Base */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('unanswered')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'unanswered'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>यूजर द्वारा पूछे गए अनसुलझे सवाल ({unansweredList.length})</span>
          {unansweredList.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('knowledge')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'knowledge'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>AI मास्टर नॉलेज बेस ({knowledgeList.length} प्रश्न)</span>
        </button>
      </div>

      {/* TAB 1: UNANSWERED QUESTIONS */}
      {activeSubTab === 'unanswered' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>
              💡 <strong>नोट:</strong> जब कोई यूजर AI चैटबॉट से ऐसा सवाल पूछता है जिसका उत्तर डेटाबेस में नहीं होता, तो वह तुरंत यहाँ और आपके टेलीग्राम बॉट पर दर्ज हो जाता है।
            </span>
          </div>

          {unansweredList.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">कोई भी लंबित अनसुलझा सवाल नहीं है!</h4>
              <p className="text-xs text-slate-400">
                बॉट सभी सवालों का संतोषजनक उत्तर दे रहा है। नया सवाल आने पर तुरंत यहाँ दिखेगा।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {unansweredList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        NEW USER QUERY
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(item.askedAt).toLocaleString('hi-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setAnsweringId(item.id);
                        setQuickAnswer('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs hover:from-amber-300 transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>उत्तर सिखाएं (Teach Bot)</span>
                    </button>
                  </div>

                  <div className="text-sm font-bold text-white bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    "{item.question}"
                  </div>

                  {answeringId === item.id && (
                    <div className="p-4 bg-slate-950 rounded-xl border border-amber-400/50 space-y-3 mt-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" />
                          <span>इस प्रश्न का आधिकारिक उत्तर दर्ज करें:</span>
                        </label>
                        <button
                          onClick={() => setAnsweringId(null)}
                          className="text-[11px] text-slate-400 hover:text-white"
                        >
                          रद्द करें
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={quickAnswer}
                        onChange={(e) => setQuickAnswer(e.target.value)}
                        placeholder="उदा. रजिस्ट्रेशन के लिए होमपेज पर 'नया खाता रजिस्टर करें' पर जाएं..."
                        className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white outline-none"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleQuickAnswerSubmit(item.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>AI को सिखाएं व सेव करें (Save & Train)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KNOWLEDGE BASE & ADD NEW */}
      {activeSubTab === 'knowledge' && (
        <div className="space-y-6">
          {/* Add New Knowledge Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4">
            <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>नया प्रश्न व उत्तर जोड़ें (Add Custom Q&A to AI)</span>
            </h4>

            {formSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{formSuccess}</span>
              </div>
            )}
            {formError && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddKnowledge} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">
                    प्रश्न (Question) <span className="text-red-400">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="उदा. प्लान 01 में क्या-क्या मिलता है?"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    श्रेणी (Category):
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none"
                  >
                    <option value="Plans">Plans & Pricing</option>
                    <option value="Registration">Registration Flow</option>
                    <option value="Payout">Instant Payout</option>
                    <option value="ID Card">ID Card & Certificate</option>
                    <option value="Interview">15-Question Interview</option>
                    <option value="General">General / Policies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  विस्तृत उत्तर (Official Answer) <span className="text-red-400">*</span>:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="यहाँ AI द्वारा दिया जाने वाला सटीक और स्पष्ट उत्तर लिखें..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl p-3.5 outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>AI नॉलेज बेस में जोड़ें</span>
              </button>
            </form>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="सवालों या उत्तरों में खोजें..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          {/* Knowledge list */}
          <div className="space-y-3">
            {filteredKnowledge.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      उपयोग: {item.hits || 0} बार
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteKnowledge(item.id)}
                    className="text-slate-400 hover:text-red-400 transition p-1 cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-black text-white">
                  Q: {item.question}
                </div>

                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
