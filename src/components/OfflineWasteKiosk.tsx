import React, { useState, useEffect, useMemo } from 'react';
import { 
  OfflineScrapCategory, 
  OfflineYieldResult, 
  SurplusAlertPayload 
} from '../types';
import { 
  matchOfflineRecipes, 
  CATEGORY_VISUAL_REGISTRY, 
  OFFLINE_SCRAP_RECIPES 
} from '../utils/offlineMatcher';
import { 
  enqueueSurplusAlert, 
  getQueuedAlerts, 
  formatCompactSmsString, 
  getWhatsAppShareUrl, 
  getNativeSmsUri, 
  generateHandoverOtp,
  triggerWebShare
} from '../utils/offlineQueue';
import { 
  Wifi, 
  WifiOff, 
  Share2, 
  MessageSquare, 
  Send, 
  ChefHat, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Flame, 
  Heart, 
  Clock, 
  Coins, 
  Download, 
  CheckCircle2, 
  Layers, 
  AlertCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

type LanguageKey = 'en' | 'hi' | 'ta' | 'bn';

interface LanguageMeta {
  code: LanguageKey;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' }
];

const UI_TRANSLATIONS: Record<LanguageKey, Record<string, string>> = {
  en: {
    kioskTitle: 'Community Nutrition Kiosk',
    kioskSubtitle: 'Zero-Cost Kitchen Scrap Valorization & Low-Bandwidth Meal Generator',
    offlinePill: '100% Offline Ready',
    onlinePill: 'Connected to Network',
    step1: '1. Select Kitchen Scrap',
    step2: '2. Scrap Weight Available',
    step3: '3. Immediate High-Nutrition Meals',
    grams: 'grams',
    kg: 'kg',
    portions: 'Portions',
    pantryCost: 'Extra Pantry Cost',
    perPortion: '/ serving',
    calories: 'Calories',
    protein: 'Protein',
    fiber: 'Fiber',
    instructions: 'Step-by-Step Preparation',
    spicesNeeded: 'Pantry Staples Needed',
    surplusTitle: 'Surplus Food? Alert Nearby Shelters (1-Tap)',
    surplusDesc: 'Broadcast surplus meals to local food rescue groups via SMS or WhatsApp without needing internet.',
    broadcastWhatsApp: '1-Tap WhatsApp Alert',
    broadcastSms: 'Offline SMS (Zero Data)',
    shareNative: 'Share via Mobile',
    otpLabel: 'Pickup Verification OTP',
    queueCount: 'Offline Alerts Queued',
    customGrams: 'Custom Grams',
    pwaInstall: 'Install Kiosk App on Phone',
    tipLabel: 'Nutritional & Culinary Note',
    noScrapWarning: 'Select an ingredient and enter weight to discover zero-cost meals.'
  },
  hi: {
    kioskTitle: 'सामुदायिक पोषण कियोस्क',
    kioskSubtitle: 'किचन स्क्रैप से शून्य-लागत पौष्टिक भोजन निर्माण प्रणाली (ऑफ़लाइन)',
    offlinePill: '१००% ऑफ़लाइन सक्रिय',
    onlinePill: 'इंटरनेट से कनेक्टेड',
    step1: '१. बचा हुआ सामान चुनें',
    step2: '२. उपलब्ध वजन (ग्राम)',
    step3: '३. तैयार होने वाले पौष्टिक व्यंजन',
    grams: 'ग्राम',
    kg: 'किलो',
    portions: 'प्लेट / खुराक',
    pantryCost: 'मसाला व तेल का खर्च',
    perPortion: '/ प्रति प्लेट',
    calories: 'ऊर्जा (कैलोरी)',
    protein: 'प्रोटीन',
    fiber: 'फाइबर',
    instructions: 'बनाने की सरल विधि',
    spicesNeeded: 'आवश्यक घरेलू मसाले',
    surplusTitle: 'भोजन बच गया? आश्रम/शेल्टर को तुरंत सूचना दें',
    surplusDesc: 'बचे हुए भोजन को बिना इंटरनेट के भी एसएमएस या व्हाट्सएप से नजदीकी जरूरतमंदों तक पहुंचाएं।',
    broadcastWhatsApp: 'व्हाट्सएप पर शेयर करें',
    broadcastSms: 'ऑफ़लाइन SMS (बिना इंटरनेट)',
    shareNative: 'मोबाइल शेयर',
    otpLabel: 'सत्यापन OTP कोड',
    queueCount: 'कतार में लंबित अलर्ट',
    customGrams: 'वजन दर्ज करें',
    pwaInstall: 'मोबाइल पर ऐप इंस्टॉल करें',
    tipLabel: 'स्वास्थ्य व पोषण लाभ',
    noScrapWarning: 'सामग्री चुनें और वजन डालें ताकि मुफ्त पौष्टिक रेसिपी दिख सकें।'
  },
  ta: {
    kioskTitle: 'சமூக ஊட்டச்சத்து கியோஸ்க்',
    kioskSubtitle: 'கழிவற்ற சமையல் & ஆஃப்லைன் சத்துணவு உருவாக்கம்',
    offlinePill: '100% ஆஃப்லைனில் இயங்கும்',
    onlinePill: 'இணைய இணைப்பு உள்ளது',
    step1: '1. சமையல் கழிவைத் தேர்ந்தெடுக்கவும்',
    step2: '2. கழிவு எடை (கிராம்)',
    step3: '3. தயாரிக்கக்கூடிய சத்துணவுகள்',
    grams: 'கிராம்',
    kg: 'கிலோ',
    portions: 'பங்குகள்',
    pantryCost: 'தாளிப்பு செலவு',
    perPortion: '/ ஒரு பங்குக்கு',
    calories: 'கலோரி',
    protein: 'புரதம்',
    fiber: 'நார்ச்சத்து',
    instructions: 'செய்முறை விளக்கம்',
    spicesNeeded: 'தேவையான அஞ்சறைப்பெட்டி பொருட்கள்',
    surplusTitle: 'கூடுதல் உணவு உள்ளதா? முதியோர் இல்லத்திற்கு பகிரவும்',
    surplusDesc: 'இணையம் இல்லாமலேயே எஸ்எம்எஸ் அல்லது வாட்ஸ்அப் மூலம் உணவு நன்கொடை அனுப்பலாம்.',
    broadcastWhatsApp: 'வாட்ஸ்அப் பகிர்வு',
    broadcastSms: 'இணையமில்லா SMS',
    shareNative: 'பகிர்',
    otpLabel: 'சரிபார்ப்பு OTP',
    queueCount: 'காத்திருக்கும் அறிவிப்புகள்',
    customGrams: 'எடை சேர்க்கவும்',
    pwaInstall: 'மொபைலில் செயலியை நிறுவவும்',
    tipLabel: 'ஊட்டச்சத்து குறிப்பு',
    noScrapWarning: 'உணவு வகையைத் தேர்வு செய்து எடையை உள்ளிடவும்.'
  },
  bn: {
    kioskTitle: 'কমিউনিটি পুষ্টি কিয়স্ক',
    kioskSubtitle: 'রান্নাঘরের ফেলে দেওয়া অংশ থেকে শূন্য খরচে পুষ্টিকর খাবার',
    offlinePill: '১০০% অফলাইনে চালু',
    onlinePill: 'ইন্টারনেট সংযুক্ত',
    step1: '১. বেঁচে যাওয়া উপাদান বা খোসা বেছে নিন',
    step2: '২. প্রাপ্ত ওজন (গ্রাম)',
    step3: '৩. তৈরিযোগ্য পুষ্টিকর খাবার',
    grams: 'গ্রাম',
    kg: 'কেজি',
    portions: 'ভাগ / প্লেট',
    pantryCost: 'মশলা ও তেলের খরচ',
    perPortion: '/ প্রতি প্লেট',
    calories: 'ক্যালোরি',
    protein: 'প্রোটিন',
    fiber: 'ফাইবার',
    instructions: 'তৈরির সহজ ধাপসমূহ',
    spicesNeeded: 'প্রয়োজনীয় সাধারণ মশলা',
    surplusTitle: 'খাবার বেঁচে গেছে? কাছের আশ্রমে পাঠান (১-ট্যাপ)',
    surplusDesc: 'ইন্টারনেট ছাড়াই এসএমএস বা হোয়াটসঅ্যাপের মাধ্যমে অতিরিক্ত খাবার দানের বার্তা পাঠান।',
    broadcastWhatsApp: 'হোয়াটসঅ্যাপে পাঠান',
    broadcastSms: 'অফলাইন SMS (ডেটা ছাড়া)',
    shareNative: 'মোবাইলে শেয়ার করুন',
    otpLabel: 'যাচাইকরণ OTP',
    queueCount: 'অপেক্ষারত অ্যালার্ট',
    customGrams: 'ওজন লিখুন',
    pwaInstall: 'ফোনে অ্যাপ ইনস্টল করুন',
    tipLabel: 'পুষ্টি ও স্বাস্থ্য তথ্য',
    noScrapWarning: 'উপাদান বেছে নিয়ে ওজন দিন যাতে তৈরিযোগ্য পদ দেখতে পান।'
  }
};

export const OfflineWasteKiosk: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>('en');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [selectedCategory, setSelectedCategory] = useState<OfflineScrapCategory>('ridge_gourd_peels');
  const [scrapWeightGrams, setScrapWeightGrams] = useState<number>(250);
  const [activeRecipeId, setActiveRecipeId] = useState<string>('rec-ridge-gourd-thogayal');
  
  // Surplus Alert Modal State
  const [isSurplusModalOpen, setIsSurplusModalOpen] = useState<boolean>(false);
  const [surplusPortions, setSurplusPortions] = useState<number>(10);
  const [vendorName, setVendorName] = useState<string>('Ram Community Mess');
  const [locationPin, setLocationPin] = useState<string>('600089');
  const [generatedOtp, setGeneratedOtp] = useState<string>(generateHandoverOtp());
  const [queuedAlertsCount, setQueuedAlertsCount] = useState<number>(0);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);

  const t = UI_TRANSLATIONS[selectedLanguage];

  // Online / Offline connectivity listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial queued count
    setQueuedAlertsCount(getQueuedAlerts().length);

    // PWA Install Prompt Listener
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setPwaPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Compute matched recipes using the client-side greedy constraint solver
  const matchedResults: OfflineYieldResult[] = useMemo(() => {
    return matchOfflineRecipes([
      { category: selectedCategory, weightGrams: scrapWeightGrams }
    ]);
  }, [selectedCategory, scrapWeightGrams]);

  const activeResult = useMemo(() => {
    if (matchedResults.length === 0) return null;
    const found = matchedResults.find(r => r.recipe.id === activeRecipeId);
    return found || matchedResults[0];
  }, [matchedResults, activeRecipeId]);

  // Adjust weight helper
  const adjustWeight = (delta: number) => {
    setScrapWeightGrams(prev => Math.max(50, prev + delta));
  };

  // Set quick weight preset
  const setWeightPreset = (grams: number) => {
    setScrapWeightGrams(grams);
  };

  // Trigger PWA Installation
  const handlePwaInstall = () => {
    if (pwaPrompt) {
      pwaPrompt.prompt();
      pwaPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        setPwaPrompt(null);
      });
    } else {
      alert('Kiosk is running as an offline PWA! On mobile Chrome, tap the 3 dots (⋮) and select "Install app" or "Add to Home Screen".');
    }
  };

  // Handle surplus dispatch creation
  const handleCreateSurplusAlert = (medium: 'whatsapp' | 'sms' | 'native') => {
    const alertData = {
      itemName: activeResult ? activeResult.recipe.name : 'Nutritious Community Meal',
      portions: surplusPortions,
      kitchenName: vendorName || 'Community Kitchen',
      locationPin: locationPin || 'Nearby',
      otp: generatedOtp
    };

    const saved = enqueueSurplusAlert(alertData);
    setQueuedAlertsCount(getQueuedAlerts().length);

    if (medium === 'whatsapp') {
      window.open(getWhatsAppShareUrl(saved), '_blank');
      setShareFeedback('WhatsApp alert opened! Share with local food shelter groups.');
    } else if (medium === 'sms') {
      window.location.href = getNativeSmsUri(saved);
      setShareFeedback('Offline SMS draft opened! Send directly without internet.');
    } else if (medium === 'native') {
      triggerWebShare(saved).then((shared) => {
        if (shared) {
          setShareFeedback('Alert shared successfully via mobile apps.');
        } else {
          window.location.href = getNativeSmsUri(saved);
        }
      });
    }

    setTimeout(() => setShareFeedback(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner: High-Contrast Emergency & Community Kiosk Header */}
      <div className="bg-[#FFFDF9] border-2 border-[#1C1917] p-4 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-emerald-600 text-white flex items-center space-x-1.5 shadow-xs">
                <span>🌱</span>
                <span>{t.kioskTitle}</span>
              </span>

              {/* Offline Engine Indicator Pill */}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5 border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
              }`}>
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.onlinePill}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                    <span className="font-black">{t.offlinePill}</span>
                  </>
                )}
              </span>

              {queuedAlertsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-violet-100 text-violet-800 border border-violet-200">
                  {queuedAlertsCount} {t.queueCount}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black text-stone-900 leading-tight">
              {t.kioskSubtitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Turn common kitchen byproducts into filling, high-protein meals for <span className="font-bold text-emerald-800">₹3 to ₹7</span> per portion. No internet required.
            </p>
          </div>

          {/* Right Controls: Multilingual Selector & PWA Install */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-300">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedLanguage === lang.code 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                  title={lang.label}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>

            {/* PWA Install Button */}
            <button
              onClick={handlePwaInstall}
              className="px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.pwaInstall}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Kiosk Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Visual Scrap Picker & Weight Calibration */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Visual Scrap Category Selector */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-black uppercase tracking-wide text-stone-900 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs font-bold">1</span>
                <span>{t.step1}</span>
              </h2>
              <span className="text-[11px] font-mono font-bold text-stone-500">12 Types Pre-loaded</span>
            </div>

            {/* Accessible Visual Grid of 12 Byproduct Categories */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 pt-1">
              {(Object.keys(CATEGORY_VISUAL_REGISTRY) as OfflineScrapCategory[]).map((catKey) => {
                const meta = CATEGORY_VISUAL_REGISTRY[catKey];
                const isSelected = selectedCategory === catKey;

                // Multilingual label
                const label = 
                  selectedLanguage === 'hi' ? meta.labelHi :
                  selectedLanguage === 'ta' ? meta.labelTa :
                  selectedLanguage === 'bn' ? meta.labelBn : meta.labelEn;

                return (
                  <button
                    key={catKey}
                    onClick={() => {
                      setSelectedCategory(catKey);
                      setScrapWeightGrams(meta.defaultServingGrams);
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left flex flex-col items-center justify-center transition-all ${
                      isSelected 
                        ? 'border-emerald-700 bg-emerald-100/70 shadow-sm ring-2 ring-emerald-600/30' 
                        : 'border-stone-200 bg-white hover:border-stone-400'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{meta.iconSvg}</span>
                    <span className="text-[11px] font-bold text-stone-900 text-center leading-tight line-clamp-2">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Weight Stepper & Tactile Presets */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-black uppercase tracking-wide text-stone-900 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs font-bold">2</span>
                <span>{t.step2}</span>
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {(scrapWeightGrams / 1000).toFixed(2)} {t.kg}
              </span>
            </div>

            {/* Stepper Display */}
            <div className="flex items-center justify-between bg-stone-100 p-2 rounded-xl border border-stone-300">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => adjustWeight(-100)}
                  className="w-10 h-10 rounded-lg bg-white border border-stone-300 font-black text-stone-800 hover:bg-stone-50 active:scale-95 flex items-center justify-center shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => adjustWeight(-50)}
                  className="px-2 h-10 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-800 hover:bg-stone-50 active:scale-95"
                >
                  -50g
                </button>
              </div>

              <div className="text-center px-3">
                <div className="text-2xl font-mono font-black text-stone-900">
                  {scrapWeightGrams}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                  {t.grams}
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => adjustWeight(50)}
                  className="px-2 h-10 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-800 hover:bg-stone-50 active:scale-95"
                >
                  +50g
                </button>
                <button
                  onClick={() => adjustWeight(100)}
                  className="w-10 h-10 rounded-lg bg-white border border-stone-300 font-black text-stone-800 hover:bg-stone-50 active:scale-95 flex items-center justify-center shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Tactile Weight Presets for Street Vendors */}
            <div className="grid grid-cols-5 gap-1.5">
              {[100, 250, 500, 1000, 2000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setWeightPreset(preset)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    scrapWeightGrams === preset
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {preset >= 1000 ? `${preset / 1000}kg` : `${preset}g`}
                </button>
              ))}
            </div>

            {/* 1-Tap Shelter Surplus Trigger Button */}
            <button
              onClick={() => {
                setGeneratedOtp(generateHandoverOtp());
                setIsSurplusModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-transform active:scale-98"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
              <span>{t.surplusTitle}</span>
            </button>

          </div>

        </div>

        {/* Right Column (7 cols): Live Computed Meals & Step-by-Step Instructions */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-stone-800 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-sm font-heading font-black uppercase tracking-wide text-stone-900 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs font-bold">3</span>
                <span>{t.step3} ({matchedResults.length})</span>
              </h2>

              <span className="text-xs font-mono text-stone-500">
                0 Network Latency
              </span>
            </div>

            {/* Matched Recipe Selector Pills */}
            {matchedResults.length > 0 ? (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {matchedResults.map((res) => {
                  const isSelected = activeResult?.recipe.id === res.recipe.id;
                  const recipeName = res.recipe.nameTranslations[selectedLanguage] || res.recipe.name;
                  return (
                    <button
                      key={res.recipe.id}
                      onClick={() => setActiveRecipeId(res.recipe.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all shrink-0 ${
                        isSelected 
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-black shadow-xs' 
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span>{recipeName}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-mono">
                        {res.feasiblePortions} {t.portions}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-stone-500 text-sm border-2 border-dashed border-stone-200 rounded-xl">
                {t.noScrapWarning}
              </div>
            )}

            {/* Active Recipe Detail Card */}
            {activeResult && (
              <div className="space-y-4 pt-2">
                
                {/* Header Metrics Row */}
                <div className="bg-white p-4 rounded-xl border border-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <h3 className="text-lg font-heading font-black text-stone-900">
                      {activeResult.recipe.nameTranslations[selectedLanguage] || activeResult.recipe.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">
                      Input: {activeResult.recipe.scrapName} • {activeResult.recipe.minScrapGramsPerPortion}g / meal
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Portion Badge */}
                    <div className="text-center px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-300">
                      <span className="block text-xl font-mono font-black text-emerald-900">
                        {activeResult.feasiblePortions}
                      </span>
                      <span className="block text-[9px] font-mono uppercase font-bold text-emerald-800">
                        {t.portions}
                      </span>
                    </div>

                    {/* Pantry Cost Badge */}
                    <div className="text-center px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300">
                      <span className="block text-xl font-mono font-black text-amber-900">
                        ₹{activeResult.costPerPortionINR.toFixed(1)}
                      </span>
                      <span className="block text-[9px] font-mono uppercase font-bold text-amber-800">
                        {t.perPortion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nutrition Cards (Protein, Calories, Fiber, Micronutrients) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                      {t.calories}
                    </span>
                    <span className="text-base font-mono font-black text-stone-900">
                      {activeResult.recipe.nutritionPerServing.calories} kcal
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 block">
                      {t.protein}
                    </span>
                    <span className="text-base font-mono font-black text-emerald-900">
                      {activeResult.recipe.nutritionPerServing.proteinGrams}g
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] font-mono uppercase font-bold text-amber-700 block">
                      {t.fiber}
                    </span>
                    <span className="text-base font-mono font-black text-amber-900">
                      {activeResult.recipe.nutritionPerServing.fiberGrams}g
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-center">
                    <span className="text-[10px] font-mono uppercase font-bold text-violet-700 block">
                      Micronutrients
                    </span>
                    <span className="text-xs font-mono font-bold text-violet-900">
                      {activeResult.recipe.nutritionPerServing.ironMg ? `${activeResult.recipe.nutritionPerServing.ironMg}mg Fe` : 'Zinc/Vit C'}
                    </span>
                  </div>
                </div>

                {/* Pantry Staples Needed */}
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1.5">
                  <span className="text-xs font-heading font-black text-stone-900 block uppercase tracking-wide">
                    🧂 {t.spicesNeeded} (₹{activeResult.totalPantryCostINR.toFixed(2)} Total):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeResult.recipe.stapleSpicesNeeded.map((spice, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 text-[11px] font-medium"
                      >
                        {spice}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-heading font-black uppercase tracking-wider text-stone-900 flex items-center space-x-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t.instructions}:</span>
                  </h4>

                  <div className="space-y-2">
                    {(activeResult.recipe.instructions[selectedLanguage] || activeResult.recipe.instructions.en).map((step, sIdx) => (
                      <div 
                        key={sIdx}
                        className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="leading-relaxed font-medium">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutritional Tip */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.tipLabel}: </span>
                    <span>{activeResult.recipe.culinaryTip}</span>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Low-Bandwidth Surplus Alert Modal */}
      {isSurplusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-2 border-stone-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-lg bg-rose-100 text-rose-700 font-bold">🍲</span>
                <div>
                  <h3 className="text-base font-heading font-black text-stone-900">
                    {t.surplusTitle}
                  </h3>
                  <span className="text-xs text-stone-500 font-mono">1-Tap Low-Bandwidth Broadcast</span>
                </div>
              </div>

              <button
                onClick={() => setIsSurplusModalOpen(false)}
                className="w-8 h-8 rounded-full border border-stone-300 font-bold text-stone-600 hover:bg-stone-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              {t.surplusDesc}
            </p>

            {/* Inputs: Portions & Kitchen */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono uppercase font-bold text-stone-500 block mb-1">
                    Portions Left
                  </label>
                  <input
                    type="number"
                    value={surplusPortions}
                    onChange={(e) => setSurplusPortions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase font-bold text-stone-500 block mb-1">
                    Location PIN
                  </label>
                  <input
                    type="text"
                    value={locationPin}
                    onChange={(e) => setLocationPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase font-bold text-stone-500 block mb-1">
                  Vendor / Mess Name
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold bg-white"
                />
              </div>

              {/* Generated 6-Digit OTP */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">
                    {t.otpLabel}
                  </span>
                  <span className="text-2xl font-mono font-black text-emerald-950 tracking-wider">
                    {generatedOtp}
                  </span>
                </div>
                <ShieldCheck className="w-7 h-7 text-emerald-700" />
              </div>

              {/* Preview of compact payload (< 100 bytes) */}
              <div className="bg-stone-100 p-2.5 rounded-lg text-[11px] font-mono text-stone-700 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-0.5">Compact SMS Wire Format:</span>
                <code>{`SURPLUS: ${activeResult ? activeResult.recipe.name : 'Meal'} | ${surplusPortions}p | Pin:${locationPin} | OTP:${generatedOtp}`}</code>
              </div>
            </div>

            {/* Share Feedback notification */}
            {shareFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-950 text-center">
                ✓ {shareFeedback}
              </div>
            )}

            {/* 1-Tap Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleCreateSurplusAlert('whatsapp')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-transform active:scale-98"
              >
                <Share2 className="w-4 h-4" />
                <span>{t.broadcastWhatsApp}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCreateSurplusAlert('sms')}
                  className="py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.broadcastSms}</span>
                </button>

                <button
                  onClick={() => handleCreateSurplusAlert('native')}
                  className="py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 font-bold text-xs flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.shareNative}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
