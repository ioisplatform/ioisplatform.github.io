# 🚀 GitHub Pages एवं Google AdSense 100% एरर-फ्री पब्लिशिंग गाइड (IOIS Platform)

यह सम्पूर्ण पोर्टल **Google AdSense Policies** और **GitHub Pages Static Hosting** के लिए 100% अनुकूलित और एरर-फ्री तैयार किया गया है।

---

## ⚠️ "पेज Blank क्यों आ रहा है और Publish क्यों नहीं हो रहा?" (समस्या और 1 मिनट का समाधान):

### समस्या 1: GitHub Pages पर स्क्रीन पूरी Blank (सफेद) क्यों दिखती है?
- **कारण**: जब आप GitHub पर फाइल्स पुश करते हैं और **Settings ➔ Pages** में जाकर **"Deploy from a branch" (main / root)** सेलेक्ट कर लेते हैं। GitHub Pages आपकी अन-कम्पाइल्ड `index.html` को लोड करता है, जिसमें `<script type="module" src="/src/main.tsx"></script>` लिखा होता है। ब्राउज़र TypeScript/JSX (`.tsx`) फाइल को सीधे नहीं चला सकता, जिससे ब्राउज़र में `404 / MIME type error` आता है और स्क्रीन **पूरी Blank** रह जाती है!
- **समाधान**: आपको **Settings ➔ Pages** में जाकर **Source** को **"GitHub Actions"** सेलेक्ट करना है।

---

### समस्या 2: GitHub पर Publish क्यों नहीं हो रहा या Action Fail क्यों हो रहा है?
GitHub पर पहली बार पब्लिश करते समय 2 सेटिंग्स ऑन करनी होती हैं:

1. **सेटिंग 1 (Pages Source):**
   - अपनी GitHub रिपॉजिटरी में **Settings** टैब खोलें।
   - बाईं ओर **Pages** पर क्लिक करें।
   - **Build and deployment** के नीचे **Source** ड्रॉपडाउन में **"GitHub Actions"** चुनें। *(Deploy from a branch नहीं!)*

2. **सेटिंग 2 (Workflow Permissions):**
   - रिपॉजिटरी के **Settings** में जाएं ➔ बाईं मेनू में **Actions** ➔ **General** पर क्लिक करें।
   - पेज के सबसे नीचे स्क्रॉल करें ➔ **Workflow permissions** हेडिंग देखें।
   - **"Read and write permissions"** को सेलेक्ट करें और **Save** दबाएं।
   *(इससे GitHub Actions को आपकी वेबसाइट डिप्लॉय करने की अनुमति मिल जाती है।)*

---

1. **`.nojekyll` फ़ाइल**: GitHub Pages डिफ़ॉल्ट रूप से Jekyll चलाता है जो आधुनिक React/Vite एसेट्स को ब्लॉक कर देता है। हमने `/public/.nojekyll` और `dist/.nojekyll` जोड़ दिया है जिससे Jekyll बाईपास होता है।
2. **`404.html` + `index.html` SPA Redirector**: GitHub Pages पर किसी भी पेज या सब-रूट को रीफ्रेश करने पर कभी भी "404 Not Found" नहीं आएगा।
3. **रिलेटिव एसेट्स पाथ (`./assets/...`)**: `vite.config.ts` में `base: './'` सेट है, जिससे आपकी रिपॉजिटरी चाहे किसी भी नाम से हो (`username.github.io/repo-name/`), सारे CSS, JS और इमेजेज 100% सही लोड होंगे।
4. **ऑटोमेटेड GitHub Actions वर्कफ़्लो (`.github/workflows/deploy.yml`)**: अब आपको कुछ भी मैन्युअली बिल्ड करने की आवश्यकता नहीं है! जैसे ही आप कोड GitHub पर पुश करेंगे, GitHub Actions अपने आप बिल्ड बनाकर वेबसाइट लाइव कर देगा।
5. **Google AdSense रेडी**:
   - `public/ads.txt` (पब्लिशर आईडी वेरिफिकेशन)
   - `public/robots.txt` (क्रॉलर अनुमतियां)
   - `index.html` में Schema.org Structured Data
   - फुटर में विधिक नीतियां: Privacy Policy, Terms of Service, Disclaimer

---

## ⚡ GitHub पर लाइव करने के 2 सबसे आसान तरीके:

### 🌟 तरीका 1: GitHub Actions द्वारा स्वचालित पब्लिश (सबसे आसान और बेस्ट)

1. **GitHub.com** पर लॉगिन करें और **New Repository** बनाएं (उदा. `iois-portal`).
2. अपने कंप्यूटर या टर्मिनल में प्रोजेक्ट डायरेक्टरी से ये 4 कमांड चलाएं:
   ```bash
   git init
   git add .
   git commit -m "IOIS Platform GitHub Ready"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. GitHub रिपॉजिटरी के पेज पर जाएं:
   - **Settings** ➔ **Pages** पर क्लिक करें।
   - **Build and deployment** में **Source** ड्रॉपडाउन को खोलें और **"GitHub Actions"** चुनें।
4. बस! GitHub Actions अपने आप बिल्ड चलाएगा और 1-2 मिनट में आपकी वेबसाइट का लाइव लिंक दे देगा:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

### 📦 तरीका 2: `dist` फोल्डर सीधे GitHub Pages में अपलोड करना (Manual Method)

1. यदि आप बिना Git कमांड के सीधे GitHub वेब इंटरफेस से फाइल अपलोड करना चाहते हैं:
   - हमने आपके लिए `dist/` फोल्डर पहले ही बिल्ड करके तैयार कर दिया है।
   - `dist` फोल्डर के अंदर मौजूद सभी फाइल्स (`index.html`, `404.html`, `ads.txt`, `robots.txt`, `.nojekyll` और `assets` फोल्डर) को अपनी GitHub रिपॉजिटरी में अपलोड करें।
2. **Settings** ➔ **Pages** में जाएं।
   - **Source**: "Deploy from a branch"
   - **Branch**: `main` (या `gh-pages`) और `/ (root)` चुनकर **Save** पर क्लिक करें।

---

## 💰 Google AdSense वेरिफिकेशन के 2 स्टेप्स:

1. **`index.html` में अपनी AdSense ID जोड़ें:**
   `index.html` की लाइन 34 पर दी गई स्क्रिप्ट से कमेंट `<!-- -->` हटाकर अपनी AdSense ID लिखें:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
2. **`public/ads.txt` में अपनी Publisher ID बदलें:**
   `public/ads.txt` में `pub-0000000000000000` की जगह अपनी वास्तविक AdSense Publisher ID दर्ज करें।

