import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Supported languages
const supported = ['en', 'hi'];

// Detect persisted preference or browser language
// Check both user and admin storage keys, prefer the one that exists
let saved = null;
try { 
  if (typeof window !== 'undefined') {
    saved = localStorage.getItem('lang_user') || localStorage.getItem('lang_admin') || localStorage.getItem('lang');
  }
} catch (_) {}
const fallbackLng = 'en';
let detected = (typeof navigator !== 'undefined' ? (navigator.language?.split('-')[0] || fallbackLng) : fallbackLng);
let initial = saved || detected;
if (!supported.includes(initial)) initial = fallbackLng;

i18n
  .use(initReactI18next)
  .init({
    lng: initial,
    fallbackLng,
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: {
        appName: 'UP Swachhta Mitra', login: 'Login', register: 'Register', dashboard: 'Dashboard', adminDashboard: 'Admin Dashboard', logout: 'Logout',
        heatmap: 'City Heatmap', analytics: 'Analytics Dashboard', language: 'Language', english: 'English', hindi: 'Hindi',
        exportCSV: 'Export CSV', exportPNG: 'Export PNG', exportPDF: 'Export PDF', wasteCategory: 'Waste Category Distribution', reportVolume: 'Report Volume Over Time', hotspots: 'Geographic Hotspots (Heatmap)',
        heatmapSubtitle: 'Geographic visualization of active civic reports. Heat intensity represents severity and density of unresolved issues. Updates automatically every 30 seconds.', showingCount: 'Showing {{count}} unresolved report(s)',
        submitReport: 'Submit Report', viewReports: 'View Reports', achievements: 'Achievements', socialUpdates: 'Social Media Updates', userDashboardTitle: 'UP Swachhta Mitra Dashboard',
        submitWasteReport: 'Submit a Waste Report', uploadImage: 'Upload Image', useCamera: 'Use Camera', closeCamera: 'Close Camera', category: 'Category', severity: 'Severity', address: 'Address', refresh: 'Refresh',
        autoLocation: 'Confirm Location (auto-fill)', locationCaptured: 'Location Captured', refreshLocation: 'Refresh Location', getCurrentLocation: 'Get Current Location', description: 'Description', submitting: 'Submitting...', submit: 'Submit Report', cityHeatmapTitle: 'City Heatmap - Unresolved Reports',
        // Navbar/Home/Login/Register/AdminLogin
        homeWelcomeTitle: 'Welcome to UP Swachhta Mitra', homeWelcomeSubtitle: 'Report and manage waste issues in your community',
        citizenLogin: 'Citizen Login', citizenLoginSubtitle: 'Report waste issues and track your submissions', registerNewAccount: 'Register New Account',
        adminLogin: 'Admin Login', adminLoginSubtitle: 'Access analytics dashboard and manage reports',
        loginUserTitle: 'User Login', userPortalSubtitle: 'UP Swachhta Mitra - Citizen Portal', email: 'Email', password: 'Password', loggingIn: 'Logging in...', dontHaveAccountRegister: "Don't have an account? Register", forgotPassword: 'Forgot Password?',
        registerTitle: 'Register for UP Swachhta Mitra', username: 'Username', confirmPassword: 'Confirm Password', registering: 'Registering...', alreadyHaveAccountLogin: 'Already have an account? Login',
        useAdminLogin: 'Please use the Admin Login page.', loginFailed: 'Login failed. Please try again.',
        adminOnlySubtitle: 'Authorized Personnel Only', adminEmail: 'Admin Email', adminPassword: 'Admin Password', regularUserLogin: 'Regular User Login', accessDeniedAdminOnly: 'Access denied. Admin credentials required.',
        // Admin Dashboard
        moderationPanel: 'Moderation Panel', startDate: 'Start Date', endDate: 'End Date', location: 'Location', wasteType: 'Waste Type', all: 'All', totalReports: 'Total Reports',
        wasteTypeDistribution: 'Waste Type Distribution', reportsByLocation: 'Reports by Location', reportsByStatus: 'Reports by Status', reports: 'Reports',
        // Heatmap popup
        reportLocation: 'Report Location', latitude: 'Lat', longitude: 'Lng',
        // ReportForm toasts and labels
        geolocationNotSupported: 'Geolocation is not supported by your browser', locationUpdated: 'Location updated', reverseGeocodeFailed: 'Failed to reverse geocode', couldNotFetchLocation: 'Could not fetch current location. You can enter address manually.', failedToGetCurrentLocation: 'Failed to get current location',
        onlyJpegPng: 'Only JPEG and PNG images are allowed', imageTooLarge: 'Image exceeds 5MB size limit',
        predictedTypeWithConf: 'Predicted: {{type}} ({{conf}}%)', lowConfidenceType: 'Low confidence: {{type}} ({{conf}}%). Please select category manually.', classificationFailed: 'Classification failed',
        errorGettingLocation: 'Error getting location', pleaseSelectImage: 'Please select an image', descMin: 'Description must be at least 3 characters', descMax: 'Description must be at most 120 characters', enterValidAddress: 'Please enter a valid address', reportSubmitted: 'Report submitted successfully!', errorSubmittingReport: 'Error submitting report',
  selected: 'Selected', classifyingImage: 'Classifying image...', predictedType: 'Predicted type', selectManually: 'Select manually', automaticImageClassifier: 'Automatic Waste Image Classifier',
        cat_plastic: 'Plastic', cat_paper: 'Paper', cat_metal: 'Metal', cat_glass: 'Glass', cat_organic: 'Organic', cat_cardboard: 'Cardboard',
        lat: 'Lat', lng: 'Lng', descHelper: '3–120 characters ({{count}}/120)',
        // Chatbot
        chatbot: {
          placeholder: 'Ask something...',
          send: 'Send',
          inputLabel: 'Type your question here',
          sendLabel: 'Send message',
          report: "To report waste, click the 'Report' button and fill in location, category, and photo.",
          language: 'UP Swachhta Mitra supports Hindi and English. Use the language selector to switch.',
          photo: 'You can capture and upload a photo using your device camera during report submission.',
          voice: 'Voice input is supported. Tap the mic icon and speak your message.',
          accessibility: 'UP Swachhta Mitra is screen reader compatible and follows accessibility standards.',
          dashboard: 'The dashboard shows waste trends, category charts, and heatmaps of high-density zones.',
          export: 'You can export insights as CSV or PDF from the dashboard.',
          privacy: 'Your data is secure. We use encrypted connections and do not share personal info.',
          location: 'UP Swachhta Mitra uses your location to tag reports. Enable location access in your browser.',
          help: 'For help, visit the Help section or contact your local civic authority.',
          start: "To get started, choose your language and tap 'Report' to submit a civic issue.",
          camera: 'Camera access is required to capture real-time images. Make sure permissions are enabled.',
          multilingual: 'We support Hindi and English. More languages coming soon.',
          fallback: "Sorry, I didn't understand that. Try asking about reporting, camera, dashboard, or help."
        }
      } },
      hi: { translation: {
        appName: 'यूपी स्वच्छता मित्र', login: 'लॉगिन', register: 'रजिस्टर', dashboard: 'डैशबोर्ड', adminDashboard: 'एडमिन डैशबोर्ड', logout: 'लॉगआउट',
        heatmap: 'सिटी हीटमैप', analytics: 'एनालिटिक्स डैशबोर्ड', language: 'भाषा', english: 'अंग्रेज़ी', hindi: 'हिंदी',
        exportCSV: 'CSV निर्यात', exportPNG: 'PNG निर्यात', exportPDF: 'PDF निर्यात', wasteCategory: 'कचरा श्रेणी वितरण', reportVolume: 'समय के साथ रिपोर्ट मात्रा', hotspots: 'भौगोलिक हॉटस्पॉट (हीटमैप)',
        heatmapSubtitle: 'सक्रिय नागरिक रिपोर्ट का भौगोलिक दृश्य। हीट तीव्रता गंभीरता और घनत्व दर्शाती है। हर 30 सेकंड में स्वतः अपडेट।', showingCount: '{{count}} अनसुलझी रिपोर्ट(स) दिखा रहा है',
        submitReport: 'रिपोर्ट सबमिट करें', viewReports: 'रिपोर्ट देखें', achievements: 'उपलब्धियाँ', socialUpdates: 'सोशल मीडिया अपडेट', userDashboardTitle: 'यूपी स्वच्छता मित्र डैशबोर्ड',
        submitWasteReport: 'कचरा रिपोर्ट सबमिट करें', uploadImage: 'छवि अपलोड करें', useCamera: 'कैमरा उपयोग करें', closeCamera: 'कैमरा बंद करें', category: 'श्रेणी', severity: 'गंभीरता', address: 'पता', refresh: 'रिफ्रेश',
        autoLocation: 'स्थान पुष्टि (ऑटो-फिल)', locationCaptured: 'स्थान कैप्चर हुआ', refreshLocation: 'स्थान रिफ्रेश करें', getCurrentLocation: 'वर्तमान स्थान प्राप्त करें', description: 'विवरण', submitting: 'सबमिट किया जा रहा है...', submit: 'रिपोर्ट सबमिट करें', cityHeatmapTitle: 'सिटी हीटमैप - अनसुलझी रिपोर्ट',
        // Navbar/Home/Login/Register/AdminLogin
        homeWelcomeTitle: 'यूपी स्वच्छता मित्र में आपका स्वागत है', homeWelcomeSubtitle: 'अपने समुदाय में कचरा समस्याओं की रिपोर्ट करें और प्रबंधन करें',
        citizenLogin: 'नागरिक लॉगिन', citizenLoginSubtitle: 'कचरा समस्याओं की रिपोर्ट करें और अपनी सबमिशन ट्रैक करें', registerNewAccount: 'नया खाता बनाएं',
        adminLogin: 'एडमिन लॉगिन', adminLoginSubtitle: 'एनालिटिक्स डैशबोर्ड तक पहुँचें और रिपोर्ट प्रबंधित करें',
        loginUserTitle: 'उपयोगकर्ता लॉगिन', userPortalSubtitle: 'यूपी स्वच्छता मित्र - नागरिक पोर्टल', email: 'ईमेल', password: 'पासवर्ड', loggingIn: 'लॉगिन हो रहा है...', dontHaveAccountRegister: 'खाता नहीं है? रजिस्टर करें', forgotPassword: 'पासवर्ड भूल गए?',
        registerTitle: 'यूपी स्वच्छता मित्र के लिए रजिस्टर करें', username: 'उपयोगकर्ता नाम', confirmPassword: 'पासवर्ड की पुष्टि करें', registering: 'रजिस्टर किया जा रहा है...', alreadyHaveAccountLogin: 'पहले से खाता है? लॉगिन करें',
        useAdminLogin: 'कृपया एडमिन लॉगिन पेज का उपयोग करें।', loginFailed: 'लॉगिन विफल। कृपया पुनः प्रयास करें।',
        adminOnlySubtitle: 'केवल अधिकृत कर्मी', adminEmail: 'एडमिन ईमेल', adminPassword: 'एडमिन पासवर्ड', regularUserLogin: 'साधारण उपयोगकर्ता लॉगिन', accessDeniedAdminOnly: 'प्रवेश निषेध। एडमिन क्रेडेंशियल आवश्यक।',
        // Admin Dashboard
        moderationPanel: 'मॉडरेशन पैनल', startDate: 'आरंभ दिनांक', endDate: 'समाप्ति दिनांक', location: 'स्थान', wasteType: 'कचरा प्रकार', all: 'सभी', totalReports: 'कुल रिपोर्ट',
        wasteTypeDistribution: 'कचरा प्रकार वितरण', reportsByLocation: 'स्थान के अनुसार रिपोर्ट', reportsByStatus: 'स्थिति के अनुसार रिपोर्ट', reports: 'रिपोर्ट्स',
        // Heatmap popup
        reportLocation: 'रिपोर्ट स्थान', latitude: 'अक्षांश', longitude: 'देशांतर',
        // ReportForm toasts and labels
        geolocationNotSupported: 'आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता', locationUpdated: 'स्थान अपडेट हुआ', reverseGeocodeFailed: 'रिवर्स जियोकोड विफल', couldNotFetchLocation: 'वर्तमान स्थान प्राप्त नहीं हो सका। आप पता मैन्युअल रूप से दर्ज कर सकते हैं।', failedToGetCurrentLocation: 'वर्तमान स्थान प्राप्त करने में विफल',
        onlyJpegPng: 'केवल JPEG और PNG छवियाँ अनुमत हैं', imageTooLarge: 'छवि 5MB सीमा से अधिक है',
        predictedTypeWithConf: 'अनुमानित: {{type}} ({{conf}}%)', lowConfidenceType: 'कम विश्वास: {{type}} ({{conf}}%). कृपया श्रेणी मैन्युअली चुनें।', classificationFailed: 'वर्गीकरण विफल',
        errorGettingLocation: 'स्थान प्राप्त करने में त्रुटि', pleaseSelectImage: 'कृपया एक छवि चुनें', descMin: 'विवरण कम से कम 3 अक्षरों का होना चाहिए', descMax: 'विवरण अधिकतम 120 अक्षरों का होना चाहिए', enterValidAddress: 'कृपया मान्य पता दर्ज करें', reportSubmitted: 'रिपोर्ट सफलतापूर्वक सबमिट हुई!', errorSubmittingReport: 'रिपोर्ट सबमिट करने में त्रुटि',
  selected: 'चयनित', classifyingImage: 'छवि का वर्गीकरण किया जा रहा है...', predictedType: 'अनुमानित प्रकार', selectManually: 'मैन्युअली चुनें', automaticImageClassifier: 'स्वचालित कचरा छवि वर्गीकरण',
        cat_plastic: 'प्लास्टिक', cat_paper: 'कागज', cat_metal: 'धातु', cat_glass: 'कांच', cat_organic: 'जैविक', cat_cardboard: 'कार्डबोर्ड',
        lat: 'अक्षांश', lng: 'देशांतर', descHelper: '3–120 अक्षर ({{count}}/120)',
        // Chatbot
        chatbot: {
          placeholder: 'कुछ पूछें...',
          send: 'भेजें',
          inputLabel: 'अपना प्रश्न यहाँ टाइप करें',
          sendLabel: 'संदेश भेजें',
          report: "कचरा रिपोर्ट करने के लिए 'रिपोर्ट' बटन पर क्लिक करें और स्थान, श्रेणी, और फोटो भरें।",
          language: 'यूपी स्वच्छता मित्र हिंदी और अंग्रेज़ी का समर्थन करता है। भाषा बदलने के लिए चयनकर्ता का उपयोग करें।',
          photo: 'आप रिपोर्ट करते समय अपने डिवाइस के कैमरे से फोटो खींचकर अपलोड कर सकते हैं।',
          voice: 'वॉइस इनपुट समर्थित है। माइक आइकन पर टैप करें और बोलें।',
          accessibility: 'यूपी स्वच्छता मित्र स्क्रीन रीडर के अनुकूल है और एक्सेसिबिलिटी मानकों का पालन करता है।',
          dashboard: 'डैशबोर्ड में कचरा प्रवृत्तियाँ, श्रेणी चार्ट और हीटमैप दिखाए जाते हैं।',
          export: 'आप CSV या PDF के रूप में डैशबोर्ड डेटा एक्सपोर्ट कर सकते हैं।',
          privacy: 'आपका डेटा सुरक्षित है। हम एन्क्रिप्टेड कनेक्शन का उपयोग करते हैं और जानकारी साझा नहीं करते।',
          location: 'यूपी स्वच्छता मित्र रिपोर्ट को टैग करने के लिए आपका स्थान उपयोग करता है। कृपया स्थान अनुमति सक्षम करें।',
          help: 'मदद के लिए, हेल्प सेक्शन देखें या अपने स्थानीय प्राधिकरण से संपर्क करें।',
          start: "शुरू करने के लिए, अपनी भाषा चुनें और 'रिपोर्ट' टैप करें।",
          camera: 'कैमरा एक्सेस आवश्यक है। कृपया अनुमति सक्षम करें ताकि आप फोटो खींच सकें।',
          multilingual: 'हम हिंदी और अंग्रेज़ी का समर्थन करते हैं। जल्द ही और भाषाएँ उपलब्ध होंगी।',
          fallback: 'माफ़ कीजिए, मैं समझ नहीं पाया। कृपया रिपोर्टिंग, कैमरा, डैशबोर्ड या मदद के बारे में पूछें।'
        }
      } }
    }
  });

export default i18n;
