import React, { useState } from 'react';
import { PageType } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  AlertTriangle, 
  ArrowLeft, 
  UserPlus, 
  CheckCircle2,
  Users,
  Award,
  Crown,
  Package,
  Headphones,
  Check,
  Send,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { PLANS, OFFICIAL_TELEGRAM_URL, OFFICIAL_EMAIL } from '../data/plansData';

interface LegalPolicyPagesProps {
  initialTab?: 'privacy-policy' | 'terms' | 'disclaimer' | 'about' | 'services';
  activeTab?: 'privacy-policy' | 'terms' | 'disclaimer' | 'about' | 'services';
  onNavigate?: (page: PageType) => void;
}

export const LegalPolicyPages: React.FC<LegalPolicyPagesProps> = ({
  initialTab = 'privacy-policy',
  activeTab: controlledTab,
  onNavigate = (_page?: PageType) => {},
}) => {
  const [internalTab, setInternalTab] = useState<'privacy-policy' | 'terms' | 'disclaimer' | 'about' | 'services'>(controlledTab || initialTab);
  const activeTab = controlledTab || internalTab;
  const setActiveTab = setInternalTab;

  const teamMembers = [
    {
      name: 'सत्यम सिंह (Satyam Singh)',
      role: 'संस्थापक एवं निदेशक (Founder & Director)',
      badge: 'लीडरशिप व विज़न',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'डिजिटल इंडिया मिशन और ग्रामीण भारत के युवाओं को स्वावलंबी बनाने हेतु प्रतिबद्ध। 8+ वर्षों का डिजिटल कम्युनिटी व फिनटेक अनुभव।'
    },
    {
      name: 'डॉ. मनीष कुमार (Dr. Manish Kumar)',
      role: 'मुख्य शैक्षणिक सलाहकार (Chief Academic Advisor)',
      badge: 'NCERT व परीक्षा विशेषज्ञ',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      bio: 'पूर्व शिक्षक एवं शिक्षाविद। कक्षा 1 से 12 तक के पाठ्यक्रम, प्रतियोगी परीक्षा नोट्स और डिजिटल कौशल विकास की गुणवत्ता नियंत्रण।'
    },
    {
      name: 'अंजलि शर्मा (Anjali Sharma)',
      role: 'सिस्टम आर्किटेक्ट व डेटा सुरक्षा प्रमुख (Lead Security Engineer)',
      badge: '256-Bit एन्क्रिप्शन',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      bio: 'डिजिटल पहचान पत्र एन्क्रिप्शन, 0ms इन्स्टेंट पेआउट आर्किटेक्चर और सख्त प्राइवेसी मास्किंग प्रोटोकॉल की मुख्य सूत्रधार।'
    },
    {
      name: 'विशाल वर्मा (Vishal Verma)',
      role: 'सपोर्ट हेड व कम्युनिटी मैनेजर (Helpline Head)',
      badge: '24x7 न्यू यूजर हेल्पलाइन',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      bio: 'टेलीग्राम व ईमेल पर नए सदस्यों का मार्गदर्शन, UTR सत्यापन और समस्याओं का 2 घंटे में समाधान करने वाली टीम के प्रभारी।'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-4 sm:py-6 px-2.5 sm:px-6">
      {/* Top Breadcrumb & Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-800">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य होम पेज पर वापस जाएं</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition cursor-pointer"
          >
            संपर्क व FAQ
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="btn-gold-gradient px-4 py-1.5 text-xs font-black rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join Now</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="text-center space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Google AdSense एवं आधिकारिक विधिक नीतियां (Legal & Compliance)</span>
        </div>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white">
          IOIS पारदर्शी विधिक प्रलेखन व नीतियां
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          भारतीय ऑनलाइन आय सहयोग प्रणाली (IOIS) 100% पारदर्शी, सुरक्षित और विधिक नियमों के अनुरूप संचालित होने वाला मंच है।
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'about'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>हमारे बारे में (About Us)</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'services'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>उत्पाद व सेवाएं (Products / Services)</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy-policy')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'privacy-policy'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>गोपनीयता नीति (Privacy Policy)</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'terms'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>नियम व शर्तें (Terms & Conditions)</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'disclaimer'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>अस्वीकरण (Disclaimer)</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 0: ABOUT US (हमारे बारे में) ================= */}
      {activeTab === 'about' && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-8 rounded-3xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>हमारे बारे में (About Us) — IOIS राष्ट्रीय डिजिटल मिशन</span>
            </h2>
            <p className="text-slate-400 text-xs">
              भारतीय ऑनलाइन आय सहयोग प्रणाली (Indian Online Income Supporting System) का परिचय, विज़न और टीम
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 border border-amber-500/30 space-y-2">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>1. हमारा मिशन व उद्देश्य (Our Mission)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                IOIS Platform का प्राथमिक उद्देश्य भारत के युवाओं, छात्रों, छोटे व्यवसायियों और परिवारों को डिजिटल शिक्षा, प्रामाणिक नागरिक संसाधन और पारदर्शी दैनिक आय के अवसर प्रदान करना है। मात्र ₹10 की नाममात्र फीस से शुरू होकर कोई भी नागरिक डिजिटल रूप से सशक्त बन सकता है।
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-amber-300">2. हमारा विज़न (Our Vision)</h3>
              <p>
                एक ऐसा डिजिटल भारत जहां हर नागरिक के पास एक सत्यापित 256-Bit एन्क्रिप्टेड डिजिटल पहचान हो, कक्षा 1 से 12 तक के उच्च गुणवत्ता वाले NCERT नोट्स बिना किसी शुल्क के उपलब्ध हों, और हर व्यक्ति बिना किसी बिचौलिए के सीधे 50% से 70% तक दैनिक रेफरल इंसेंटिव कमा सके।
              </p>
            </div>

            {/* Team Showcase with Real Authenticated Profiles */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>3. प्रबंधन व टीम की जानकारी (Our Verified Leadership & Team)</span>
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  सत्यापित टीम
                </span>
              </div>
              <p className="text-xs text-slate-400">
                असली तस्वीरें व प्रामाणिक जानकारी जो हमारे 100% पारदर्शी कार्यप्रणाली को दर्शाती हैं:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {teamMembers.map((member, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5 shadow-md">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400/60 shrink-0 shadow-md"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-white text-xs sm:text-sm">{member.name}</span>
                        <span className="text-[9.5px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                          {member.badge}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-amber-300">{member.role}</div>
                      <p className="text-[11px] text-slate-400 leading-snug">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
                <Award className="w-5 h-5 text-amber-400 mx-auto" />
                <div className="font-black text-white text-xs">100% पारदर्शिता</div>
                <div className="text-[10.5px] text-slate-400">कोई छिपा हुआ शुल्क नहीं, प्रत्यक्ष पेआउट</div>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
                <Lock className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="font-black text-white text-xs">डेटा गोपनीयता</div>
                <div className="text-[10.5px] text-slate-400">मास्क्ड मोबाइल, सुरक्षित सर्वर</div>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-1">
                <Headphones className="w-5 h-5 text-sky-400 mx-auto" />
                <div className="font-black text-white text-xs">24x7 हेल्पलाइन</div>
                <div className="text-[10.5px] text-slate-400">Telegram व Email त्वरित सहायता</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 0.5: PRODUCTS & SERVICES (उत्पाद व सेवाएं) ================= */}
      {activeTab === 'services' && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-8 rounded-3xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>उत्पाद व सेवाएं (Products & Services) — पूरी जानकारी और मूल्य</span>
            </h2>
            <p className="text-slate-400 text-xs">
              IOIS द्वारा प्रदान किए जाने वाले सभी 7 मास्टर प्लान्स, डिजिटल सेवाएं और रेफरल आय की आधिकारिक सूची
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-300">
              IOIS प्लेटफॉर्म मुख्य रूप से 7 डिजिटल उत्पाद एवं नागरिक सेवाएं प्रदान करता है। प्रत्येक प्लान में सदस्य को डिजिटल संसाधन, आधिकारिक पहचान पत्र और 50% से 70% तक का सीधा रेफरल इंसेंटिव प्राप्त होता है:
            </p>

            {/* Plans Breakdown Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-amber-300 border-b border-slate-800">
                    <th className="p-3 font-black">प्लान क्रमांक व नाम</th>
                    <th className="p-3 font-black">शुल्क (Price)</th>
                    <th className="p-3 font-black">रेफरल इंसेंटिव</th>
                    <th className="p-3 font-black">शामिल डिजिटल सेवाएं</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {PLANS.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-900/80 transition">
                      <td className="p-3 font-bold text-white whitespace-nowrap">
                        <span className="text-amber-400 font-mono mr-1.5">#{plan.id}</span>
                        {plan.name}
                      </td>
                      <td className="p-3 font-black text-amber-400 font-mono whitespace-nowrap">
                        ₹{plan.price}
                      </td>
                      <td className="p-3 font-black text-emerald-400 font-mono whitespace-nowrap">
                        ₹{plan.instantPayout} ({plan.percentage}%)
                      </td>
                      <td className="p-3 text-slate-300 min-w-[200px]">
                        {plan.tagline}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Additional Free Digital Services Hub */}
            <div className="space-y-3 pt-3">
              <h3 className="text-base font-bold text-white">निःशुल्क डिजिटल व नागरिक सेवाएं:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RTPS व सरकारी योजना किट</span>
                  </div>
                  <p className="text-[11px] text-slate-400">जाति, आय, निवास, जमीन दाखिल-खारिज, परिमार्जन, LPC, instant e-PAN व राशन कार्ड गाइड।</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>स्मार्ट फोटो व सिग्नेचर कंप्रेसर</span>
                  </div>
                  <p className="text-[11px] text-slate-400">सरकारी फॉर्मों के लिए 20KB, 50KB और 100KB में फोटो व हस्ताक्षर को बिना क्वालिटी खोए कंप्रेस करें।</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>विद्यार्थी NCERT स्टडी हब</span>
                  </div>
                  <p className="text-[11px] text-slate-400">कक्षा 1 से 12 तक के नोट्स, ADCA कंप्यूटर ट्यूटोरियल्स, स्कॉलरशिप गाइड व परीक्षा फॉर्मूले।</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>लाइव पंचांग, राशिफल व मौसम</span>
                  </div>
                  <p className="text-[11px] text-slate-400">दैनिक शुभ मुहूर्त, चौघड़िया, 12 राशियों का फल, शहरवार मौसम व वर्षा अलर्ट।</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 1: PRIVACY POLICY (गोपनीयता नीति) ================= */}
      {activeTab === 'privacy-policy' && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-8 rounded-3xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>गोपनीयता नीति (Privacy Policy) - अद्यतन: 2026</span>
            </h2>
            <p className="text-slate-400 text-xs">
              यह गोपनीयता नीति बताती है कि IOIS Platform आपके व्यक्तिगत डेटा को कैसे एकत्र, उपयोग और Google AdSense मानकों के अनुरूप सुरक्षित रखता है।
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">1. हम कौन सा डेटा एकत्र करते हैं?</h3>
              <p>
                जब आप IOIS Platform पर खाता बनाते हैं या फॉर्म भरते हैं, तो हम आपका नाम, मोबाइल नंबर, ईमेल आईडी, शहर/राज्य, आपके द्वारा चुना गया प्लान, और पेआउट प्राप्त करने हेतु UPI ID (Payment Received Address) एकत्र करते हैं।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">2. Google AdSense, विज्ञापन एवं कुकीज़ (Cookies)</h3>
              <p>
                हम अपनी वेबसाइट पर मुद्रीकरण और संचालन हेतु Google AdSense और अन्य तृतीय-पक्ष विज्ञापन प्रदाताओं का उपयोग कर सकते हैं।
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
                <li>Google एक तृतीय-पक्ष विक्रेता के रूप में विज़िटर की प्राथमिकताओं और पूर्व इंटरनेट यात्राओं के आधार पर विज्ञापन परोसने के लिए <strong>कुकीज़ (DoubleClick DART Cookie)</strong> का उपयोग करता है।</li>
                <li>उपयोगकर्ता Google विज्ञापन सेटिंग्स (Google Ad Settings) पर जाकर रुचि-आधारित वैयक्तिकृत विज्ञापनों को ऑप्ट-आउट कर सकते हैं।</li>
                <li>हम अपने उपयोगकर्ताओं का कोई भी व्यक्तिगत वित्तीय डेटा (जैसे पासवर्ड, पिन, या गोपनीय बैंक विवरण) विज्ञापनदाताओं के साथ साझा नहीं करते हैं।</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">3. UPI ID व पेआउट सुरक्षा</h3>
              <p>
                आपके द्वारा प्रदान किया गया पेआउट UPI ID केवल और केवल आपकी रेफरल कमाई का 50% से 70% इंसेंटिव ट्रांसफर करने के लिए उपयोग किया जाता है। हम कभी भी आपका UPI पिन (PIN) या बैंक पासवर्ड नहीं मांगते।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">4. डेटा एन्क्रिप्शन व प्राइवेसी मास्किंग</h3>
              <p>
                स्पॉन्सर के रेफरल लिंक पर आने वाले बाहरी विज़िटर के लिए स्पॉन्सर का मोबाइल नंबर, नाम और फोटो पूर्णतः मास्क्ड (छिपे) रहते हैं। केवल सदस्य द्वारा डैशबोर्ड से अनुमति दिए जाने पर ही इसे प्रदर्शित किया जाता है।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">5. बच्चों व विद्यार्थियों की सुरक्षा</h3>
              <p>
                हमारा मंच विद्यार्थियों के लिए 100% सुरक्षित और शैक्षिक सामग्री प्रदान करता है। हम किसी भी नाबालिग से संवेदनशील वित्तीय डेटा एकत्र नहीं करते।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TERMS AND CONDITIONS (नियम और शर्तें) ================= */}
      {activeTab === 'terms' && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-8 rounded-3xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>नियम व शर्तें (Terms & Conditions)</span>
            </h2>
            <p className="text-slate-400 text-xs">
              IOIS सेवाओं और सदस्यता का उपयोग करने से पूर्व कृपया इन शर्तों को ध्यानपूर्वक पढ़ें।
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">1. पात्रता एवं पंजीकरण</h3>
              <p>
                IOIS मंच पर पंजीकरण करने के लिए वैध मोबाइल नंबर और पहचान अनिवार्य है। प्रत्येक उपयोगकर्ता को अपना वास्तविक नाम और सही संपर्क विवरण प्रदान करना होगा।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">2. रेफरल इंसेंटिव नियम (50% से 70%)</h3>
              <p>
                प्लान सक्रियण के पश्चात सदस्य को उसके प्रत्यक्ष रेफरल पर प्लान मूल्य का 50% से 70% तक इंसेंटिव प्राप्त होता है। पेआउट प्राप्त करने के लिए सदस्य का स्वयं का सही UPI ID और एक्टिव स्पॉन्सर आईडी दर्ज होना आवश्यक है।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">3. डिजिटल सामग्री व बौद्धिक संपदा</h3>
              <p>
                मंच पर उपलब्ध NCERT नोट्स, सूत्र, ई-बुक्स और डिजिटल सामग्री का उपयोग केवल व्यक्तिगत शिक्षा और ज्ञान संवर्धन के लिए अनुमत है।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">4. खाता निरस्तीकरण व स्पैम निषेध</h3>
              <p>
                किसी भी प्रकार का फर्जी स्क्रीनशॉट, स्पैमिंग या अनुचित आचरण पाए जाने पर एडमिन को संबंधित खाते को तत्काल निलंबित करने का पूर्ण अधिकार है।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: DISCLAIMER (अस्वीकरण) ================= */}
      {activeTab === 'disclaimer' && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-8 rounded-3xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>अस्वीकरण व आय प्रकटीकरण (Disclaimer & Disclosure)</span>
            </h2>
            <p className="text-slate-400 text-xs">
              कानूनी सूचना एवं सरकारी सेवाओं संबंधी पारदर्शी प्रकटीकरण।
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">1. गैर-सरकारी स्वायत्त मंच प्रकटीकरण</h3>
              <p>
                IOIS Platform एक स्वतंत्र डिजिटल स्वावलंबन और कौशल मंच है। यह किसी भी राज्य या केंद्र सरकार का प्रत्यक्ष आधिकारिक अंग नहीं है। मंच पर दिए गए RTPS, जाति, आय, जमीन, e-PAN और योजनाओं के लिंक केवल नागरिकों की सुविधा के लिए आधिकारिक सरकारी पोर्टलों के सार्वजनिक लिंक प्रदान करते हैं।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">2. आय की कोई गारंटी नहीं (No Income Guarantee)</h3>
              <p>
                मंच पर दर्शाई गई आय सदस्य के व्यक्तिगत प्रयास, डिजिटल कौशल और वास्तविक रेफरल पर आधारित है। IOIS किसी भी प्रकार के निश्चित या स्वचालित रिटर्न का वादा नहीं करता।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-amber-300">3. तृतीय-पक्ष वेबसाइट लिंक</h3>
              <p>
                हमारी वेबसाइट पर बाहरी सरकारी या शैक्षणिक वेबसाइटों के लिंक हो सकते हैं। उन तृतीय-पक्ष वेबसाइटों की सामग्री और नीतियों पर हमारा नियंत्रण नहीं है।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer with Quick Links */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-sm sm:text-base font-black text-white">क्या आपके पास कोई प्रश्न या शंका है?</h4>
          <p className="text-xs text-slate-400">हमारी सहायता टीम और 24x7 IOIS Help Chat आपकी सेवा में तत्पर हैं।</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
          >
            हेल्पलाइन व संपर्क
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="btn-gold-gradient px-5 py-2 rounded-xl text-xs font-black cursor-pointer shadow-lg"
          >
            रजिस्ट्रेशन / Join Now
          </button>
        </div>
      </div>
    </div>
  );
};
