import React, { useState } from 'react';
import { PageType } from '../types';
import { ShieldCheck, Lock, FileText, AlertTriangle, ArrowLeft, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';

interface LegalPolicyPagesProps {
  initialTab?: 'privacy-policy' | 'terms' | 'disclaimer';
  onNavigate: (page: PageType) => void;
}

export const LegalPolicyPages: React.FC<LegalPolicyPagesProps> = ({
  initialTab = 'privacy-policy',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy-policy' | 'terms' | 'disclaimer'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-3 sm:px-6">
      {/* Top Breadcrumb & Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य होम पेज पर वापस जाएं</span>
        </button>

        <button
          onClick={() => onNavigate('register')}
          className="btn-gold-gradient px-4 py-2 text-xs font-black rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>रजिस्ट्रेशन / Join Now</span>
        </button>
      </div>

      {/* Tabs Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Google AdSense एवं विधिक नीतियां (Legal & Compliance)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          IOIS विधिक प्रलेखन व पारदर्शिता नीति
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
          भारतीय ऑनलाइन आय सहयोग प्रणाली (IOIS) 100% पारदर्शी, सुरक्षित और विधिक नियमों के अनुरूप संचालित होने वाला मंच है।
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('privacy-policy')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
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
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
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
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'disclaimer'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>अस्वीकरण व डिस्क्लेमर (Disclaimer)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Privacy Policy */}
      {activeTab === 'privacy-policy' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-10 rounded-3xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>गोपनीयता नीति (Privacy Policy) - अद्यतन: 2026</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              यह गोपनीयता नीति बताती है कि IOIS Platform आपके व्यक्तिगत डेटा को कैसे एकत्र, उपयोग और सुरक्षित रखता है।
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-300">1. हम कौन सी जानकारी एकत्र करते हैं?</h3>
            <p>
              जब आप IOIS Platform पर खाता बनाते हैं, तो हम आपका नाम, मोबाइल नंबर, ईमेल आईडी, शहर, आपके द्वारा चुना गया प्लान, और पेआउट प्राप्त करने हेतु UPI ID (Payment Received Address) एकत्र करते हैं।
            </p>

            <h3 className="text-base font-bold text-amber-300">2. UPI ID व पेआउट सुरक्षा</h3>
            <p>
              आपके द्वारा प्रदान किया गया पेआउट UPI ID केवल और केवल आपकी रेफरल कमाई का 70% इंसेंटिव ट्रांसफर करने के लिए उपयोग किया जाता है। हम कभी भी आपका UPI पिन (PIN) या बैंक पासवर्ड नहीं मांगते।
            </p>

            <h3 className="text-base font-bold text-amber-300">3. Google AdSense एवं विज्ञापन कुकीज़ (Cookies)</h3>
            <p>
              हम अपनी वेबसाइट पर विज्ञापन प्रदर्शित करने के लिए Google AdSense और अन्य तृतीय-पक्ष विज्ञापन प्रदाताओं का उपयोग कर सकते हैं। Google कुकीज़ (जैसे DoubleClick DART कुकी) का उपयोग करके आपकी पूर्व यात्राओं के आधार पर विज्ञापन प्रदर्शित करता है। उपयोगकर्ता Google Ad Settings पर जाकर व्यक्तिगत विज्ञापनों को ऑप्ट-आउट कर सकते हैं।
            </p>

            <h3 className="text-base font-bold text-amber-300">4. डेटा सुरक्षा व गोपनीयता</h3>
            <p>
              हम आपकी व्यक्तिगत जानकारी किसी भी तीसरे पक्ष को बेचते या किराए पर नहीं देते हैं। आपकी जानकारी एन्क्रिप्टेड डेटाबेस में सुरक्षित रखी जाती है।
            </p>

            <h3 className="text-base font-bold text-amber-300">5. बच्चों व विद्यार्थियों की सुरक्षा</h3>
            <p>
              हमारा मंच विद्यार्थियों के लिए 100% सुरक्षित और शैक्षिक सामग्री प्रदान करता है। हम किसी भी नाबालिग से संवेदनशील वित्तीय डेटा एकत्र नहीं करते।
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Terms and Conditions */}
      {activeTab === 'terms' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-10 rounded-3xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>नियम व शर्तें (Terms & Conditions)</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              IOIS सेवाओं और सदस्यता का उपयोग करने से पूर्व कृपया इन शर्तों को ध्यानपूर्वक पढ़ें।
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-300">1. पात्रता एवं पंजीकरण</h3>
            <p>
              IOIS मंच पर पंजीकरण करने के लिए वैध मोबाइल नंबर और पहचान अनिवार्य है। प्रत्येक उपयोगकर्ता को अपना वास्तविक नाम और सही संपर्क विवरण प्रदान करना होगा।
            </p>

            <h3 className="text-base font-bold text-amber-300">2. 70% रेफरल इंसेंटिव नियम</h3>
            <p>
              प्लान सक्रियण के पश्चात सदस्य को उसके प्रत्यक्ष रेफरल पर प्लान मूल्य का 70% इंसेंटिव प्राप्त होता है। पेआउट प्राप्त करने के लिए सदस्य का स्वयं का सही UPI ID और एक्टिव स्पॉन्सर आईडी दर्ज होना आवश्यक है।
            </p>

            <h3 className="text-base font-bold text-amber-300">3. डिजिटल सामग्री व बौद्धिक संपदा</h3>
            <p>
              मंच पर उपलब्ध NCERT नोट्स, सूत्र, ई-बुक्स और डिजिटल सामग्री का उपयोग केवल व्यक्तिगत शिक्षा और ज्ञान संवर्धन के लिए अनुमत है।
            </p>

            <h3 className="text-base font-bold text-amber-300">4. खाता निरस्तीकरण</h3>
            <p>
              किसी भी प्रकार का फर्जी स्क्रीनशॉट, स्पैमिंग या अनुचित आचरण पाए जाने पर एडमिन को संबंधित खाते को तत्काल निलंबित करने का पूर्ण अधिकार है।
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Disclaimer */}
      {activeTab === 'disclaimer' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-10 rounded-3xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>अस्वीकरण व आय प्रकटीकरण (Disclaimer & Disclosure)</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              कानूनी सूचना एवं सरकारी सेवाओं संबंधी पारदर्शी प्रकटीकरण।
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-300">1. गैर-सरकारी स्वायत्त मंच प्रकटीकरण</h3>
            <p>
              IOIS Platform एक स्वतंत्र डिजिटल स्वावलंबन और कौशल मंच है। यह किसी भी राज्य या केंद्र सरकार का प्रत्यक्ष आधिकारिक अंग नहीं है। मंच पर दिए गए RTPS, जाति, आय, जमीन, e-PAN और योजनाओं के लिंक केवल नागरिकों की सुविधा के लिए आधिकारिक सरकारी पोर्टलों के सार्वजनिक लिंक प्रदान करते हैं।
            </p>

            <h3 className="text-base font-bold text-amber-300">2. आय की कोई गारंटी नहीं (No Income Guarantee)</h3>
            <p>
              मंच पर दर्शाई गई आय (70% इंसेंटिव) सदस्य के व्यक्तिगत प्रयास, डिजिटल कौशल और वास्तविक रेफरल पर आधारित है। IOIS किसी भी प्रकार के निश्चित या स्वचालित रिटर्न का वादा नहीं करता।
            </p>

            <h3 className="text-base font-bold text-amber-300">3. तृतीय-पक्ष वेबसाइट लिंक</h3>
            <p>
              हमारी वेबसाइट पर बाहरी सरकारी या शैक्षणिक वेबसाइटों के लिंक हो सकते हैं। उन तृतीय-पक्ष वेबसाइटों की सामग्री और गोपनीयता नीतियों पर हमारा नियंत्रण नहीं है।
            </p>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-base font-black text-white">क्या आपके पास कोई प्रश्न या शंका है?</h4>
          <p className="text-xs text-slate-400">हमारी सहायता टीम और 24x7 AI चैटबॉट आपकी सेवा में तत्पर हैं।</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
          >
            हेल्पलाइन व संपर्क
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="btn-gold-gradient px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow-lg"
          >
            रजिस्ट्रेशन / Join Now
          </button>
        </div>
      </div>
    </div>
  );
};
