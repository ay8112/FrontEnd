import React, { useState, useEffect } from 'react';
// import gandhiImg from '../assets/gandhi.jpg';
import {
  Leaf,
  Heart,
  Users,
  TrendingUp,
  Recycle,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Info,
  Sparkles,
  TreePine,
  Droplets,
} from 'lucide-react';

const CleanYourAreaPage = () => {
  const [language, setLanguage] = useState('en');
  const [expandedSections, setExpandedSections] = useState({
    history: false,
    benefits: false,
    remedies: false,
    impact: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate hero images (disabled for single image)
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const content = {
    en: {
      title: 'Clean Your Area, Clean Your Future',
      subtitle: 'Join the movement for a healthier, cleaner India',
      intro:
        'Cleanliness is not just about maintaining hygiene - it is about building a sustainable future for generations to come. From Mahatma Gandhi\'s vision to the Swachh Bharat Mission, India has a rich legacy of promoting sanitation and community well-being.',
      historyTitle: 'History of Cleanliness Initiatives in India',
      historyContent: `Mahatma Gandhi believed that cleanliness was next to godliness and emphasized sanitation as a key part of India's freedom struggle. He promoted manual scavenging abolition and community hygiene practices.

In 2014, Prime Minister Narendra Modi launched the Swachh Bharat Abhiyan (Clean India Mission) on October 2nd, Gandhi Jayanti. This national campaign aimed to eliminate open defecation, improve waste management, and promote behavioral change across India.

By 2019, over 110 million toilets were constructed, and rural sanitation coverage increased from 39% to 100%. The mission continues with Swachh Bharat 2.0, focusing on waste-to-wealth and sustainable sanitation.`,
      benefitsTitle: 'Benefits of Cleanliness',
      benefits: [
        {
          icon: Heart,
          title: 'Health Benefits',
          description:
            'Reduces diseases like cholera, typhoid, and dengue. Clean surroundings prevent the spread of infections and improve overall community health.',
        },
        {
          icon: Leaf,
          title: 'Environmental Benefits',
          description:
            'Reduces pollution, protects water bodies, and preserves biodiversity. Proper waste management prevents soil degradation and air contamination.',
        },
        {
          icon: Users,
          title: 'Social Benefits',
          description:
            'Improves quality of life, enhances community pride, and promotes social harmony. Clean neighborhoods attract tourism and investment.',
        },
        {
          icon: TrendingUp,
          title: 'Economic Benefits',
          description:
            'Creates jobs in waste management, recycling, and sanitation. Clean cities boost property values and attract businesses.',
        },
      ],
      remediesTitle: 'How You Can Help',
      remedies: [
        'Segregate waste into wet (organic) and dry (recyclable) bins at home.',
        'Use cloth bags instead of plastic bags for shopping.',
        'Participate in community cleanup drives on weekends.',
        'Compost kitchen waste to create natural fertilizer.',
        'Report illegal dumping and littering through civic apps.',
        'Educate children about hygiene and environmental responsibility.',
      ],
      impactTitle: 'Real Impact: Before & After',
      images: [
        {
          before:
            'https://upload.wikimedia.org/wikipedia/commons/6/6d/Garbage_pile_in_India.jpg',
          after:
            'https://upload.wikimedia.org/wikipedia/commons/d/d2/Clean_street_in_India_after_cleanup.jpg',
          title: 'Community Cleanup Transformation',
          description: 'From garbage piles to clean streets',
        },
      ],
      ctaTitle: 'Take Action Today',
      ctaButtons: ['Join the Cleanliness Drive', 'Learn More About Swachh Bharat'],
      resources: [
        {
          title: 'Cleanliness',
          url: 'https://en.wikipedia.org/wiki/Cleanliness',
        },
        {
          title: 'Hygiene',
          url: 'https://en.wikipedia.org/wiki/Hygiene',
        },
        {
          title: 'Swachh Bharat Mission',
          url: 'https://en.wikipedia.org/wiki/Swachh_Bharat_Mission',
        },
        {
          title: 'Mahatma Gandhi & Sanitation',
          url: 'https://en.wikipedia.org/wiki/Mahatma_Gandhi#Sanitation_and_hygiene',
        },
        {
          title: 'Waste Management in India',
          url: 'https://en.wikipedia.org/wiki/Waste_management_in_India',
        },
        {
          title: 'Environmental Cleanliness',
          url: 'https://en.wikipedia.org/wiki/Environmental_cleanliness',
        },
      ],
    },
    hi: {
      title: 'अपने क्षेत्र को साफ करें, अपना भविष्य साफ करें',
      subtitle: 'एक स्वस्थ, स्वच्छ भारत के आंदोलन में शामिल हों',
      intro:
        'स्वच्छता केवल स्वच्छता बनाए रखने के बारे में नहीं है यह आने वाली पीढ़ियों के लिए एक स्थायी भविष्य बनाने के बारे में है। महात्मा गांधी की दृष्टि से स्वच्छ भारत मिशन तक भारत में स्वच्छता और सामुदायिक कल्याण को बढ़ावा देने की समृद्ध विरासत है।',
      historyTitle: 'भारत में स्वच्छता पहलों का इतिहास',
      historyContent: `महात्मा गांधी का मानना था कि स्वच्छता ईश्वर के बाद आती है और उन्होंने भारत के स्वतंत्रता संग्राम के एक प्रमुख हिस्से के रूप में स्वच्छता पर जोर दिया। उन्होंने मैला ढोने की प्रथा को समाप्त करने और सामुदायिक स्वच्छता प्रथाओं को बढ़ावा दिया।

2014 में, प्रधान मंत्री नरेंद्र मोदी ने 2 अक्टूबर, गांधी जयंती पर स्वच्छ भारत अभियान (स्वच्छ भारत मिशन) शुरू किया। इस राष्ट्रीय अभियान का उद्देश्य खुले में शौच को खत्म करना, अपशिष्ट प्रबंधन में सुधार करना और पूरे भारत में व्यवहार परिवर्तन को बढ़ावा देना था।

2019 तक, 110 मिलियन से अधिक शौचालय बनाए गए और ग्रामीण स्वच्छता कवरेज 39% से बढ़कर 100% हो गया। मिशन स्वच्छ भारत 2.0 के साथ जारी है, जो कचरे से धन और सतत स्वच्छता पर केंद्रित है।`,
      benefitsTitle: 'स्वच्छता के लाभ',
      benefits: [
        {
          icon: Heart,
          title: 'स्वास्थ्य लाभ',
          description:
            'हैजा, टाइफाइड और डेंगू जैसी बीमारियों को कम करता है। स्वच्छ परिवेश संक्रमण के प्रसार को रोकता है और समग्र सामुदायिक स्वास्थ्य में सुधार करता है।',
        },
        {
          icon: Leaf,
          title: 'पर्यावरण लाभ',
          description:
            'प्रदूषण को कम करता है, जल निकायों की रक्षा करता है और जैव विविधता को संरक्षित करता है। उचित अपशिष्ट प्रबंधन मिट्टी के क्षरण और वायु संदूषण को रोकता है।',
        },
        {
          icon: Users,
          title: 'सामाजिक लाभ',
          description:
            'जीवन की गुणवत्ता में सुधार करता है, सामुदायिक गर्व को बढ़ाता है और सामाजिक सद्भाव को बढ़ावा देता है। स्वच्छ पड़ोस पर्यटन और निवेश को आकर्षित करते हैं।',
        },
        {
          icon: TrendingUp,
          title: 'आर्थिक लाभ',
          description:
            'अपशिष्ट प्रबंधन, पुनर्चक्रण और स्वच्छता में नौकरियां पैदा करता है। स्वच्छ शहर संपत्ति मूल्यों को बढ़ाते हैं और व्यवसायों को आकर्षित करते हैं।',
        },
      ],
      remediesTitle: 'आप कैसे मदद कर सकते हैं',
      remedies: [
        'घर पर कचरे को गीले (जैविक) और सूखे (पुनर्चक्रण योग्य) डिब्बे में अलग करें।',
        'खरीदारी के लिए प्लास्टिक बैग के बजाय कपड़े के बैग का उपयोग करें।',
        'सप्ताहांत पर सामुदायिक सफाई अभियानों में भाग लें।',
        'प्राकृतिक उर्वरक बनाने के लिए रसोई के कचरे को खाद बनाएं।',
        'नागरिक ऐप्स के माध्यम से अवैध डंपिंग और कूड़ा फैलाने की रिपोर्ट करें।',
        'बच्चों को स्वच्छता और पर्यावरणीय जिम्मेदारी के बारे में शिक्षित करें।',
      ],
      impactTitle: 'वास्तविक प्रभाव: पहले और बाद में',
      images: [
        {
          before:
            'https://upload.wikimedia.org/wikipedia/commons/6/6d/Garbage_pile_in_India.jpg',
          after:
            'https://upload.wikimedia.org/wikipedia/commons/d/d2/Clean_street_in_India_after_cleanup.jpg',
          title: 'सामुदायिक सफाई परिवर्तन',
          description: 'कचरे के ढेर से साफ सड़कों तक',
        },
      ],
      ctaTitle: 'आज ही कार्रवाई करें',
      ctaButtons: ['स्वच्छता अभियान में शामिल हों', 'स्वच्छ भारत के बारे में और जानें'],
      resources: [
        {
          title: 'स्वच्छता',
          url: 'https://en.wikipedia.org/wiki/Cleanliness',
        },
        {
          title: 'स्वच्छता',
          url: 'https://en.wikipedia.org/wiki/Hygiene',
        },
        {
          title: 'स्वच्छ भारत मिशन',
          url: 'https://en.wikipedia.org/wiki/Swachh_Bharat_Mission',
        },
        {
          title: 'महात्मा गांधी और स्वच्छता',
          url: 'https://en.wikipedia.org/wiki/Mahatma_Gandhi#Sanitation_and_hygiene',
        },
        {
          title: 'भारत में अपशिष्ट प्रबंधन',
          url: 'https://en.wikipedia.org/wiki/Waste_management_in_India',
        },
        {
          title: 'पर्यावरणीय स्वच्छता',
          url: 'https://en.wikipedia.org/wiki/Environmental_cleanliness',
        },
      ],
    },
  };

  const t = content[language];

  const heroImages = [
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=800&fit=crop',
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ...existing code... */}

      {/* Hero Section with Gandhi ji and Charkha Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-700 via-green-500 to-green-700">
        <div className="w-full flex flex-col justify-center items-center pt-12 pb-2">
          {/* SWACHH BHARAT Heading Centered Above Hero Image, shifted even more right */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20 w-full flex justify-center" style={{ marginLeft: '42vw' }}>
            <h2 className="text-8xl md:text-9xl font-extrabold text-white drop-shadow-2xl bg-green-700/80 px-8 py-4 rounded-2xl text-center" style={{letterSpacing: '0.1em'}}>
              SWACHH BHARAT
            </h2>
          </div>
          <div className="relative w-full flex justify-center">
            <img
              src={require('../assets/gandhi.jpg')}
              alt="Mahatma Gandhi with charkha spinning wheel"
              className="object-cover drop-shadow-2xl"
              style={{ width: '100vw', height: '100vh', background: '#fff', maxWidth: '100vw', maxHeight: '100vh', borderRadius: 0 }}
              loading="eager"
            />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto text-center px-4 animate-fade-in mt-8">
            <div className="flex justify-center mb-8 animate-bounce-slow">
              <div className="relative">
                <Leaf className="w-24 h-24 text-white animate-pulse" />
                <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-ping" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl animate-slide-up">
              {t.title}
            </h1>
            <p className="text-2xl md:text-3xl mb-8 text-green-100 font-semibold animate-slide-up-delayed">
              {t.subtitle}
            </p>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto animate-scale-in">
              <p className="text-lg text-gray-800 leading-relaxed">{t.intro}</p>
            </div>
            {/* Scroll Down Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up-delayed {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in-section {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite; 
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-up-delayed { animation: slide-up-delayed 1s ease-out; }
        .animate-scale-in { animation: scale-in 1.2s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in-section { animation: fade-in-section 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out forwards; }
      `}</style>

      {/* History Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 animate-fade-in-section">
        <button
          onClick={() => toggleSection('history')}
          className="w-full bg-gradient-to-r from-white to-green-50 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex items-center justify-between transform hover:scale-[1.02] border-2 border-green-100"
          aria-expanded={expandedSections.history}
          aria-controls="history-content"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2 animate-pulse">
              <Info className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t.historyTitle}</h2>
          </div>
          {expandedSections.history ? (
            <ChevronUp className="w-6 h-6 text-green-600 animate-bounce" />
          ) : (
            <ChevronDown className="w-6 h-6 text-green-600" />
          )}
        </button>

        {expandedSections.history && (
          <div
            id="history-content"
            className="bg-white rounded-b-lg shadow-md p-6 mt-1 border-t-2 border-green-500"
          >
            <div className="prose prose-lg max-w-none">
              {t.historyContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
              <p className="text-sm text-gray-600 italic">
                {language === 'en'
                  ? 'Learn more: Swachh Bharat Mission has made India 100% open defecation free, constructing over 110 million toilets.'
                  : 'अधिक जानें: स्वच्छ भारत मिशन ने भारत को 100% खुले में शौच मुक्त बनाया है, 110 मिलियन से अधिक शौचालय बनाए हैं।'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Image Section - Gandhi Legacy */}
      {/* Tagline above first image, right-aligned and centered */}
      {/* Tagline absolutely centered above the Gandhi image */}
      <section className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-section">
        <div className="bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl shadow-2xl p-8 text-white">
          <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            {language === 'en' ? "Gandhi's Vision Lives On" : 'गांधी का विज़न आज भी जीवित है'}
          </h3>
          <p className="text-lg text-green-100">
            {language === 'en' 
              ? '"Sanitation is more important than independence" - Mahatma Gandhi'
              : '"स्वच्छता स्वतंत्रता से भी अधिक महत्वपूर्ण है" - महात्मा गांधी'}
          </p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-section">
        <div className="relative w-full h-screen overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&h=900&fit=crop"
            alt="Clean environment representing Gandhi's vision"
            className="object-cover w-full h-full"
            style={{ maxWidth: '100vw', maxHeight: '100vh', borderRadius: 0, background: '#fff' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-4xl md:text-6xl font-extrabold mb-4 flex items-center gap-4 bg-gradient-to-r from-yellow-300 via-green-600 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl" style={{letterSpacing: '0.05em'}}>
                <Sparkles className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
                {language === 'en' ? "Gandhi's Vision Lives On" : 'गांधी का विज़न आज भी जीवित है'}
              </h3>
              <p className="text-2xl md:text-3xl text-green-100 font-semibold drop-shadow-lg">
                {language === 'en' 
                  ? '"Sanitation is more important than independence" - Mahatma Gandhi'
                  : '"स्वच्छता स्वतंत्रता से भी अधिक महत्वपूर्ण है" - महात्मा गांधी'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-b from-white to-green-50 py-12">
        <div className="max-w-6xl mx-auto px-4 animate-fade-in-section">
          <button
            onClick={() => toggleSection('benefits')}
            className="w-full bg-gradient-to-r from-green-50 to-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex items-center justify-between mb-6 transform hover:scale-[1.02] border-2 border-green-100"
            aria-expanded={expandedSections.benefits}
            aria-controls="benefits-content"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2 animate-pulse">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{t.benefitsTitle}</h2>
            </div>
            {expandedSections.benefits ? (
              <ChevronUp className="w-6 h-6 text-green-600 animate-bounce" />
            ) : (
              <ChevronDown className="w-6 h-6 text-green-600" />
            )}
          </button>

          {expandedSections.benefits && (
            <div id="benefits-content" className="grid md:grid-cols-2 gap-6">
              {t.benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 border-green-100 transform hover:scale-105 animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-green-600 rounded-full p-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Image Section - Environmental Impact */}
      <section className="relative py-16 overflow-hidden animate-fade-in-section">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-100"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slide-in-left">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&h=900&fit=crop"
                  alt="Clean and green environment"
                  className="w-full h-[600px] object-cover"
                />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900 to-transparent p-6">
                <h4 className="text-white font-bold text-xl flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-300" />
                  {language === 'en' ? 'Green Cities' : 'हरित शहर'}
                </h4>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&h=900&fit=crop"
                alt="Healthy living environment"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent p-6">
                <h4 className="text-white font-bold text-xl flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-300" />
                  {language === 'en' ? 'Healthy Living' : 'स्वस्थ जीवन'}
                </h4>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <img
                src="https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1600&h=900&fit=crop"
                alt="Sustainable waste management"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-transparent p-6">
                <h4 className="text-white font-bold text-xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-300" />
                  {language === 'en' ? 'Sustainability' : 'स्थिरता'}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remedies Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 animate-fade-in-section">
        <button
          onClick={() => toggleSection('remedies')}
          className="w-full bg-gradient-to-r from-white to-green-50 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex items-center justify-between transform hover:scale-[1.02] border-2 border-green-100"
          aria-expanded={expandedSections.remedies}
          aria-controls="remedies-content"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2 animate-pulse">
              <Recycle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t.remediesTitle}</h2>
          </div>
          {expandedSections.remedies ? (
            <ChevronUp className="w-6 h-6 text-green-600 animate-bounce" />
          ) : (
            <ChevronDown className="w-6 h-6 text-green-600" />
          )}
        </button>

        {expandedSections.remedies && (
          <div
            id="remedies-content"
            className="bg-white rounded-b-lg shadow-md p-6 mt-1 border-t-2 border-green-500"
          >
            <ul className="space-y-4">
              {t.remedies.map((remedy, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-green-600 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1">{remedy}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Image Section - Community Action */}
      <section className="w-full h-screen flex flex-col md:flex-row gap-0 animate-fade-in-section">
        <div className="relative w-full h-full overflow-hidden shadow-2xl animate-slide-in-left">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&h=900&fit=crop"
            alt="Community volunteers cleaning together"
            className="object-cover w-full h-full"
            style={{ maxWidth: '100vw', maxHeight: '100vh', borderRadius: 0, background: '#fff' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-5xl md:text-7xl font-extrabold mb-4 flex items-center gap-4 bg-gradient-to-r from-green-400 via-green-600 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl" style={{letterSpacing: '0.05em'}}>
                <Users className="w-14 h-14 text-green-300 drop-shadow-lg" />
                {language === 'en' ? 'Community Power' : 'सामुदायिक शक्ति'}
              </h3>
              <p className="text-2xl md:text-3xl text-green-100 font-semibold drop-shadow-lg">
                {language === 'en' 
                  ? 'Together we create lasting change'
                  : 'मिलकर हम स्थायी परिवर्तन लाते हैं'}
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full h-full overflow-hidden shadow-2xl animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
          <img
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1600&h=900&fit=crop"
            alt="Recycling and waste segregation"
            className="object-cover w-full h-full"
            style={{ maxWidth: '100vw', maxHeight: '100vh', borderRadius: 0, background: '#fff' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-4xl md:text-6xl font-extrabold mb-4 flex items-center gap-4 bg-gradient-to-r from-blue-400 via-green-600 to-green-400 bg-clip-text text-transparent drop-shadow-2xl" style={{letterSpacing: '0.05em'}}>
                <Recycle className="w-12 h-12 text-blue-300 drop-shadow-lg" />
                {language === 'en' ? 'Smart Recycling' : 'स्मार्ट रीसाइक्लिंग'}
              </h3>
              <p className="text-2xl md:text-3xl text-blue-100 font-semibold drop-shadow-lg">
                {language === 'en' 
                  ? 'Every item sorted makes a difference'
                  : 'हर वस्तु का सही वर्गीकरण महत्वपूर्ण है'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Images */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4 animate-fade-in-section">
          <button
            onClick={() => toggleSection('impact')}
            className="w-full bg-gradient-to-r from-white to-green-50 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex items-center justify-between mb-6 transform hover:scale-[1.02] border-2 border-green-100"
            aria-expanded={expandedSections.impact}
            aria-controls="impact-content"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2 animate-pulse">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{t.impactTitle}</h2>
            </div>
            {expandedSections.impact ? (
              <ChevronUp className="w-6 h-6 text-green-600 animate-bounce" />
            ) : (
              <ChevronDown className="w-6 h-6 text-green-600" />
            )}
          </button>

          {expandedSections.impact && (
            <div id="impact-content" className="space-y-8 animate-scale-in">
              {t.images.map((imageSet, index) => (
                <div key={index} className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                  <div className="p-6 text-center bg-gradient-to-r from-green-600 via-green-500 to-green-600 animate-gradient">
                    <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">{imageSet.title}</h3>
                    <p className="text-green-100">{imageSet.description}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-2 transform hover:scale-105 transition-all duration-300">
                      <div className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 font-bold py-3 px-4 rounded-lg text-center shadow-md">
                        {language === 'en' ? 'BEFORE' : 'पहले'}
                      </div>
                      <img
                        src={imageSet.before}
                        alt={`Before cleanup - ${imageSet.title}`}
                        className="w-full h-64 object-cover rounded-xl shadow-lg border-4 border-red-200"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-2 transform hover:scale-105 transition-all duration-300">
                      <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-bold py-3 px-4 rounded-lg text-center shadow-md">
                        {language === 'en' ? 'AFTER' : 'बाद में'}
                      </div>
                      <img
                        src={imageSet.after}
                        alt={`After cleanup - ${imageSet.title}`}
                        className="w-full h-64 object-cover rounded-xl shadow-lg border-4 border-green-200"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional Images Gallery */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-slide-in-left">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/29/Recycling_bins_color_code.jpg"
                    alt="Recycling bins with color codes for waste segregation"
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 bg-gradient-to-br from-white to-green-50">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Recycle className="w-5 h-5 text-green-600" />
                      {language === 'en' ? 'Waste Segregation' : 'कचरा पृथक्करण'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en'
                        ? 'Color-coded bins for efficient recycling'
                        : 'कुशल पुनर्चक्रण के लिए रंग-कोडित डिब्बे'}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Home_composting_bin.jpg"
                    alt="Home composting bin for organic waste management"
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 bg-gradient-to-br from-white to-green-50">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <TreePine className="w-5 h-5 text-green-600" />
                      {language === 'en' ? 'Home Composting' : 'घरेलू खाद'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en'
                        ? 'Turn kitchen waste into natural fertilizer'
                        : 'रसोई के कचरे को प्राकृतिक उर्वरक में बदलें'}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Swachh_Bharat_cleaning_drive.jpg"
                    alt="Community participating in Swachh Bharat cleaning drive"
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 bg-gradient-to-br from-white to-green-50">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      {language === 'en' ? 'Community Drive' : 'सामुदायिक अभियान'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en'
                        ? 'Citizens united for a cleaner India'
                        : 'स्वच्छ भारत के लिए एकजुट नागरिक'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Full Width Inspirational Image */}
      <section className="relative h-[600px] overflow-hidden animate-fade-in-section">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1600&h=900&fit=crop"
            alt="Beautiful clean landscape inspiring change"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-700/70 to-blue-900/80"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl animate-scale-in">
            <Sparkles className="w-20 h-20 text-yellow-300 mx-auto mb-6 animate-pulse" />
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl">
              {language === 'en' 
                ? 'The Future Depends On What We Do Today' 
                : 'भविष्य इस बात पर निर्भर करता है कि हम आज क्या करते हैं'}
            </h2>
            <p className="text-2xl md:text-3xl text-green-100 font-semibold">
              {language === 'en' 
                ? 'Every clean action creates a ripple of positive change' 
                : 'हर स्वच्छता कार्य सकारात्मक परिवर्तन की लहर बनाता है'}
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-float">
            <Leaf className="w-20 h-20 text-white" />
          </div>
          <div className="absolute bottom-10 right-10 animate-float-delayed">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg animate-slide-up">{t.ctaTitle}</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="bg-white text-green-600 font-bold py-4 px-10 rounded-full hover:bg-green-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 animate-bounce-slow">
              {t.ctaButtons[0]}
            </button>
            <a
              href="https://swachhbharatmission.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-800 text-white font-bold py-4 px-10 rounded-full hover:bg-green-900 transition-all duration-300 shadow-2xl hover:shadow-3xl inline-flex items-center justify-center gap-2 transform hover:scale-110 animate-bounce-slow"
              style={{ animationDelay: '0.2s' }}
            >
              {t.ctaButtons[1]}
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {language === 'en' ? 'Learn More' : 'और जानें'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {t.resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow border-2 border-green-100 hover:border-green-500 flex items-center justify-between group"
            >
              <span className="font-semibold text-gray-700 group-hover:text-green-600">
                {resource.title}
              </span>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* Language Toggle - now at the end of the page */}
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-2 bg-white shadow-2xl rounded-full px-5 py-3 border-2 border-green-500 transition-all duration-300 active:scale-95"
              aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Globe className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-700">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
          <p className="text-lg mb-2">
            {language === 'en'
              ? '"Cleanliness is next to godliness" - Mahatma Gandhi'
              : '"स्वच्छता ईश्वरत्व के बाद आती है" - महात्मा गांधी'}
          </p>
          <p className="text-gray-400 text-sm">
            {language === 'en'
              ? '© 2025 CleanCity  Building a cleaner, healthier India.'
              : '© 2025 CleanCity  एक स्वच्छ, स्वस्थ भारत का निर्माण।'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CleanYourAreaPage;
