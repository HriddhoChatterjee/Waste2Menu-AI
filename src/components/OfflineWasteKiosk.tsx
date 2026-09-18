import React, { useState, useEffect, useMemo } from 'react';
import { 
  OfflineScrapCategory, 
  OfflineYieldResult, 
  SurplusAlertPayload 
} from '../types';
import { 
  matchOfflineRecipes, 
  CATEGORY_VISUAL_REGISTRY, 
  OFFLINE_SCRAP_RECIPES,
  ScrapInputEntry
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
  PhoneCall,
  X,
  Volume2,
  VolumeX,
  Users
} from 'lucide-react';
import { 
  generateDynamicCommunitySteps, 
  DynamicCommunityStep 
} from '../utils/communityRecipeGenerator';

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
    step1: '1. Select Kitchen Scraps (Multi-Select)',
    step2: '2. Scrap Stockpile & Weights',
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
    noScrapWarning: 'Select one or more kitchen scraps to discover zero-cost nutritious meals.',
    selected: 'Selected',
    quickCombos: 'Combos',
    selectAll: 'All 12',
    reset: 'Clear',
    totalStockpile: 'Total Stockpile',
    comboVeggies: '🥕 Veggie Peels',
    comboStaples: '🍚 Grains & Dal',
    comboAromatics: '🌿 Aromatics',
    tapToToggle: 'Tap multiple scraps to combine',
    zeroCostMode: '₹0 Zero-Cost Street Mode',
    standardMode: 'Standard Pantry Mode',
    zeroCostDesc: 'Zero-Cost Relief Mode: Uses ₹0 extra spices/oil. Cooked with clean water, ration salt & trapped steam.',
    hungerImpact: 'Hunger Relief & Satiety Impact',
    feedsAdults: 'Feeds {n} Hungry Adults',
    orChildren: 'or {n} Children',
    fuelSaverBadge: '🔥 Single-Pot Chulha & Fuel Saver',
    fuelSaverNote: 'One-pot cooking saves wash water. 3-minute steam retention with flame extinguished saves 40% firewood or gas.',
    foodSafetyTitle: '🛡️ Food Safety & Hygiene Protocol (Needy Relief)',
    foodSafety1: '1. Warm Salt Soak: Soak scraps 3 min to strip grit & street dust.',
    foodSafety2: '2. Rolling Boil (>75°C): Kills airborne bacteria for child health.',
    foodSafety3: '3. Mold Inspection: Check bread/rotis; discard green/black spots.',
    foodSafety4: '4. Hot Distribution: Serve steaming within 2h; never store overnight.',
    voiceGuide: 'Read Cooking Steps Aloud (Voice Guide)',
    stopVoice: 'Stop Audio',
    speakingStep: 'Speaking Step',
    allScrapsIncluded: 'Includes All {n} Selected Scraps',
    zeroCostPerPortion: '₹0.0 / serving (Street Method)'
  },
  hi: {
    kioskTitle: 'सामुदायिक पोषण कियोस्क',
    kioskSubtitle: 'किचन स्क्रैप से शून्य-लागत पौष्टिक भोजन निर्माण प्रणाली (ऑफ़लाइन)',
    offlinePill: '१००% ऑफ़लाइन सक्रिय',
    onlinePill: 'इंटरनेट से कनेक्टेड',
    step1: '१. बचा हुआ सामान चुनें (एकाधिक चयन)',
    step2: '२. उपलब्ध स्क्रैप वजन व स्टॉक',
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
    noScrapWarning: 'एक या अधिक सामग्री चुनें ताकि मुफ्त पौष्टिक रेसिपी दिख सकें।',
    selected: 'चयनित',
    quickCombos: 'कॉम्बो',
    selectAll: 'सभी १२',
    reset: 'हटाएं',
    totalStockpile: 'कुल उपलब्ध स्टॉक',
    comboVeggies: '🥕 सब्जी के छिलके',
    comboStaples: '🍚 चावल व दाल',
    comboAromatics: '🌿 मसाले व पत्तियां',
    tapToToggle: 'एकाधिक सामग्री जोड़ें',
    zeroCostMode: '₹0 शून्य-लागत स्ट्रीट मोड',
    standardMode: 'सामान्य मसाला मोड',
    zeroCostDesc: 'शून्य-लागत राहत मोड: किसी अतिरिक्त मसाले या तेल की जरूरत नहीं। केवल पानी, राशन नमक व भाप से तैयार।',
    hungerImpact: 'भुखमरी राहत व तृप्ति प्रभाव',
    feedsAdults: '{n} भूखे वयस्कों का आहार',
    orChildren: 'या {n} बच्चों के लिए भरपेट',
    fuelSaverBadge: '🔥 चूल्हा व एक-बर्तन ईंधन बचत',
    fuelSaverNote: 'एक ही बर्तन में पकाने से पानी बचता है। आंच बंद कर 3 मिनट ढक्कन की भाप में पकाने से 40% लकड़ी/गैस बचती है।',
    foodSafetyTitle: '🛡️ खाद्य सुरक्षा व स्वच्छता नियम (गरीब व जरूरतमंदों हेतु)',
    foodSafety1: '१. नमक-पानी से धोना: छिलकों को 3 मिनट गर्म नमक पानी में भिगोएं।',
    foodSafety2: '२. तेज उबाल (>७५°C): बच्चों की सुरक्षा हेतु कीटाणु नष्ट करें।',
    foodSafety3: '३. फफूंद जांच: बासी रोटी या ब्रेड पर फफूंद हो तो हटा दें।',
    foodSafety4: '४. गरम परोसें: २ घंटे के भीतर गरम परोसें; रात भर खुला न छोड़ें।',
    voiceGuide: 'रेसिपी बोलकर सुनें (ऑफ़लाइन आवाज)',
    stopVoice: 'आवाज बंद करें',
    speakingStep: 'निर्देश पढ़ रहे हैं',
    allScrapsIncluded: 'सभी {n} चुनी गई सामग्रियां शामिल',
    zeroCostPerPortion: '₹०.० / प्रति प्लेट (मुफ्त राहत)'
  },
  ta: {
    kioskTitle: 'சமூக ஊட்டச்சத்து கியோஸ்க்',
    kioskSubtitle: 'கழிவற்ற சமையல் & ஆஃப்லைன் சத்துணவு உருவாக்கம்',
    offlinePill: '100% ஆஃப்லைனில் இயங்கும்',
    onlinePill: 'இணைய இணைப்பு உள்ளது',
    step1: '1. சமையல் கழிவைத் தேர்ந்தெடுக்கவும் (பல்வகை)',
    step2: '2. கழிவு எடை மற்றும் இருப்பு',
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
    noScrapWarning: 'உணவு வகைகளைத் தேர்வு செய்து எடையை உள்ளிடவும்.',
    selected: 'தேர்ந்தெடுக்கப்பட்டது',
    quickCombos: 'சேர்க்கைகள்',
    selectAll: 'அனைத்தும்',
    reset: 'அழி',
    totalStockpile: 'மொத்த இருப்பு',
    comboVeggies: '🥕 காய்கறி தோல்',
    comboStaples: '🍚 சாதம் & பருப்பு',
    comboAromatics: '🌿 மூலிகைகள்',
    tapToToggle: 'பல்வேறு கழிவுகளைச் சேர்க்கவும்',
    zeroCostMode: '₹0 இலவச முறை (எண்ணெய் இன்றி)',
    standardMode: 'வழக்கமான முறை',
    zeroCostDesc: 'இலவச முறை: எண்ணெய் மற்றும் மசாலா செலவு இல்லை. தண்ணீர், உப்பு மற்றும் நீராவியால் சமைக்கப்படுகிறது.',
    hungerImpact: 'பசி நிவாரணம் மற்றும் உணவு தாக்கம்',
    feedsAdults: '{n} பெரியவர்களுக்கு வயிறார உணவு',
    orChildren: 'அல்லது {n} குழந்தைகளுக்கு',
    fuelSaverBadge: '🔥 ஒற்றைப் பாத்திரம் எரிபொருள் சேமிப்பு',
    fuelSaverNote: 'ஒரே பாத்திரத்தில் சமைப்பதால் தண்ணீர் மிச்சம். மூடிய நீராவியில் 3 நிமிடம் வெந்து 40% விறகு சேமிக்கும்.',
    foodSafetyTitle: '🛡️ உணவுப் பாதுகாப்பு & சுகாதார வழிகாட்டுதல்',
    foodSafety1: '1. வெதுவெதுப்பான உப்பு நீர்: தூசிகளை அகற்ற 3 நிமிடம் ஊறவைக்கவும்.',
    foodSafety2: '2. நன்கு கொதிக்க வைத்தல் (>75°C): கிருமிகள் அழிய வேகவைக்கவும்.',
    foodSafety3: '3. பூஞ்சை சோதனை: ரொட்டியில் பூஞ்சை இருந்தால் நீக்கிவிடவும்.',
    foodSafety4: '4. உடனே பரிமாறுதல்: தயாரித்த 2 மணி நேரத்திற்குள் சூடாக வழங்கவும்.',
    voiceGuide: 'செய்முறையைக் கேளுங்கள் (ஆஃப்லைன் குரல்)',
    stopVoice: 'குரலை நிறுத்து',
    speakingStep: 'படி வாசிக்கப்படுகிறது',
    allScrapsIncluded: 'அனைத்து {n} கழிவுகளும் சேர்க்கப்பட்டுள்ளன',
    zeroCostPerPortion: '₹0.0 / ஒரு பங்குக்கு (இலவசம்)'
  },
  bn: {
    kioskTitle: 'কমিউনিটি পুষ্টি কিয়স্ক',
    kioskSubtitle: 'রান্নাঘরের ফেলে দেওয়া অংশ থেকে শূন্য খরচে পুষ্টিকর খাবার',
    offlinePill: '১০০% অফলাইনে চালু',
    onlinePill: 'ইন্টারনেট সংযুক্ত',
    step1: '১. ফেলে দেওয়া উপাদান বেছে নিন (একাধিক পছন্দ)',
    step2: '২. উপাদানের ওজন ও মোট মজুত',
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
    noScrapWarning: 'এক বা একাধিক উপাদান বেছে নিয়ে ওজন দিন যাতে তৈরিযোগ্য পদ দেখতে পান।',
    selected: 'নির্বাচিত',
    quickCombos: 'কম্বো',
    selectAll: 'সব ১২টি',
    reset: 'মুছুন',
    totalStockpile: 'মোট মজুত',
    comboVeggies: '🥕 সবজির খোসা',
    comboStaples: '🍚 ভাত ও ডাল',
    comboAromatics: '🌿 মশলা ও পাতা',
    tapToToggle: 'একাধিক উপাদান যোগ করতে ট্যাপ করুন',
    zeroCostMode: '₹০ শূন্য-খরচ পথ মোড',
    standardMode: 'সাধারণ মশলা মোড',
    zeroCostDesc: 'শূন্য-খরচ ত্রাণ পদ্ধতি: কোনো কেনা মশলা বা তেলের খরচ নেই। শুধু জল, নুন ও ভাপেই রান্না সম্পন্ন।',
    hungerImpact: 'ক্ষুধা নিবারণ ও তৃপ্তির প্রভাব',
    feedsAdults: '{n} জন ক্ষুধার্ত মানুষের খাবার',
    orChildren: 'বা {n} জন শিশুর ভরপেট আহার',
    fuelSaverBadge: '🔥 এক-হাঁড়ি রান্না ও জ্বালানি সাশ্রয়',
    fuelSaverNote: 'একটি পাত্রে রান্নায় ধোয়ার জল বাঁচে। আঁচ নিভিয়ে ৩ মিনিট ঢাকনার ভাপে সেদ্ধ করলে ৪০% জ্বালানি সাশ্রয় হয়।',
    foodSafetyTitle: '🛡️ খাদ্য সুরক্ষা ও পরিচ্ছন্নতা নির্দেশিকা',
    foodSafety1: '১. গরম নুন-জলে ধোয়া: ধুলোবালি দূর করতে ৩ মিনিট ভিজিয়ে রাখুন।',
    foodSafety2: '২. ভালো করে ফোটানো (>৭৫°C): শিশুদের নিরাপত্তার জন্য জীবাণু ধ্বংস করুন।',
    foodSafety3: '৩. ছত্রাক পরীক্ষা: বাসি রুটির সবুজ বা কালো দাগ ফেলে দিন।',
    foodSafety4: '৪. গরম গরম পরিবেশন: তৈরির ২ ঘণ্টার মধ্যে পরিবেশন করুন।',
    voiceGuide: 'রেসিপি শুনে রান্না করুন (অফলাইন কণ্ঠস্বর)',
    stopVoice: 'কণ্ঠ থামান',
    speakingStep: 'ধাপ পড়া হচ্ছে',
    allScrapsIncluded: 'সবগুলি {n} নির্বাচিত উপাদান অন্তর্ভুক্ত',
    zeroCostPerPortion: '₹০.০ / প্রতি প্লেট (বিনামূল্যে)'
  }
};

export const OfflineWasteKiosk: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>('en');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Multi-Select Scrap Stockpile: Record of category -> grams
  const [selectedScraps, setSelectedScraps] = useState<Partial<Record<OfflineScrapCategory, number>>>({
    ridge_gourd_peels: 200,
    vegetable_trimmings: 250,
    leftover_rice: 300
  });
  const [focusedCategory, setFocusedCategory] = useState<OfflineScrapCategory>('ridge_gourd_peels');
  const [activeRecipeId, setActiveRecipeId] = useState<string>('rec-ridge-gourd-thogayal');
  
  // Humanitarian Relief Mode & Offline Audio Voice Guide States
  const [isZeroCostMode, setIsZeroCostMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeakingStepIndex, setActiveSpeakingStepIndex] = useState<number | null>(null);
  
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

  // Total weight & scrap count
  const totalWeightGrams = useMemo(() => {
    return Object.values(selectedScraps).reduce((sum: number, w) => sum + (w || 0), 0);
  }, [selectedScraps]);

  const selectedCount = useMemo(() => {
    return Object.keys(selectedScraps).length;
  }, [selectedScraps]);

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

  // Compute matched recipes across ALL selected scraps using constraint solver
  const matchedResults: OfflineYieldResult[] = useMemo(() => {
    const inputs: ScrapInputEntry[] = (Object.entries(selectedScraps) as [OfflineScrapCategory, number | undefined][])
      .filter(([_, weightGrams]) => typeof weightGrams === 'number' && weightGrams > 0)
      .map(([category, weightGrams]) => ({
        category,
        weightGrams: weightGrams as number
      }));
    return matchOfflineRecipes(inputs);
  }, [selectedScraps]);

  const activeResult = useMemo(() => {
    if (matchedResults.length === 0) return null;
    const found = matchedResults.find(r => r.recipe.id === activeRecipeId);
    return found || matchedResults[0];
  }, [matchedResults, activeRecipeId]);

  // Dynamic community steps synthesizing ALL selected ingredients
  const dynamicSteps: DynamicCommunityStep[] = useMemo(() => {
    if (!activeResult) return [];
    return generateDynamicCommunitySteps({
      recipe: activeResult.recipe,
      selectedScraps,
      language: selectedLanguage,
      isZeroCostMode,
      portions: activeResult.feasiblePortions
    });
  }, [activeResult, selectedScraps, selectedLanguage, isZeroCostMode]);

  // 100% Offline Speech Synthesis Voice Reader
  const handleToggleVoiceGuide = (steps: DynamicCommunityStep[]) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingStepIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const langCodeMap: Record<LanguageKey, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      bn: 'bn-IN'
    };
    const targetLang = langCodeMap[selectedLanguage] || 'en-IN';

    let currentStepIdx = 0;

    const speakNext = () => {
      if (currentStepIdx >= steps.length) {
        setIsSpeaking(false);
        setActiveSpeakingStepIndex(null);
        return;
      }

      const s = steps[currentStepIdx];
      setActiveSpeakingStepIndex(s.stepIndex);

      const utterance = new SpeechSynthesisUtterance(`${s.title}. ${s.instruction}`);
      utterance.lang = targetLang;
      utterance.rate = 0.9;

      utterance.onend = () => {
        currentStepIdx++;
        speakNext();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setActiveSpeakingStepIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  // Cancel speech synthesis on language/recipe change or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setActiveSpeakingStepIndex(null);
      }
    };
  }, [activeRecipeId, selectedLanguage]);

  // Toggle category on/off (Multi-Select)
  const toggleCategory = (catKey: OfflineScrapCategory) => {
    setSelectedScraps(prev => {
      const next = { ...prev };
      if (next[catKey]) {
        delete next[catKey];
        const remainingKeys = Object.keys(next) as OfflineScrapCategory[];
        if (focusedCategory === catKey && remainingKeys.length > 0) {
          setFocusedCategory(remainingKeys[0]);
        }
      } else {
        const defaultGrams = CATEGORY_VISUAL_REGISTRY[catKey]?.defaultServingGrams || 250;
        next[catKey] = defaultGrams;
        setFocusedCategory(catKey);
      }
      return next;
    });
  };

  // Adjust weight for the currently focused scrap
  const adjustWeight = (delta: number) => {
    let targetKey = focusedCategory;
    if (!targetKey) {
      const first = Object.keys(selectedScraps)[0] as OfflineScrapCategory;
      targetKey = first || 'ridge_gourd_peels';
      setFocusedCategory(targetKey);
    }
    setSelectedScraps(prev => {
      const current = prev[targetKey] || CATEGORY_VISUAL_REGISTRY[targetKey]?.defaultServingGrams || 250;
      return {
        ...prev,
        [targetKey]: Math.max(50, current + delta)
      };
    });
  };

  // Set weight preset for focused scrap
  const setWeightPreset = (grams: number) => {
    let targetKey = focusedCategory;
    if (!targetKey) {
      const first = Object.keys(selectedScraps)[0] as OfflineScrapCategory;
      targetKey = first || 'ridge_gourd_peels';
      setFocusedCategory(targetKey);
    }
    setSelectedScraps(prev => ({
      ...prev,
      [targetKey]: grams
    }));
  };

  // Adjust specific scrap weight directly
  const adjustSpecificScrapWeight = (catKey: OfflineScrapCategory, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedScraps(prev => ({
      ...prev,
      [catKey]: Math.max(50, (prev[catKey] || 250) + delta)
    }));
  };

  // Remove specific scrap directly
  const removeSpecificScrap = (catKey: OfflineScrapCategory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedScraps(prev => {
      const next = { ...prev };
      delete next[catKey];
      const remainingKeys = Object.keys(next) as OfflineScrapCategory[];
      if (focusedCategory === catKey && remainingKeys.length > 0) {
        setFocusedCategory(remainingKeys[0]);
      }
      return next;
    });
  };

  // Apply Quick Combos
  const handleApplyCombo = (type: 'veggies' | 'staples' | 'aromatics' | 'all' | 'clear') => {
    if (type === 'veggies') {
      setSelectedScraps({
        ridge_gourd_peels: 200,
        vegetable_trimmings: 250,
        potato_peels: 200,
        cauliflower_stalks: 250
      });
      setFocusedCategory('ridge_gourd_peels');
    } else if (type === 'staples') {
      setSelectedScraps({
        leftover_rice: 300,
        stale_roti_bread: 200,
        dal_water: 400
      });
      setFocusedCategory('leftover_rice');
    } else if (type === 'aromatics') {
      setSelectedScraps({
        herb_stems: 100,
        onion_skins: 150,
        citrus_peels: 150
      });
      setFocusedCategory('herb_stems');
    } else if (type === 'all') {
      const all: Partial<Record<OfflineScrapCategory, number>> = {};
      (Object.keys(CATEGORY_VISUAL_REGISTRY) as OfflineScrapCategory[]).forEach(k => {
        all[k] = CATEGORY_VISUAL_REGISTRY[k].defaultServingGrams;
      });
      setSelectedScraps(all);
      setFocusedCategory('ridge_gourd_peels');
    } else if (type === 'clear') {
      setSelectedScraps({});
    }
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

  const currentFocusedWeight = selectedScraps[focusedCategory] ?? (CATEGORY_VISUAL_REGISTRY[focusedCategory]?.defaultServingGrams || 250);
  const focusedMeta = CATEGORY_VISUAL_REGISTRY[focusedCategory] || CATEGORY_VISUAL_REGISTRY['ridge_gourd_peels'];
  const focusedLabel = 
    selectedLanguage === 'hi' ? focusedMeta.labelHi :
    selectedLanguage === 'ta' ? focusedMeta.labelTa :
    selectedLanguage === 'bn' ? focusedMeta.labelBn : focusedMeta.labelEn;

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
          
          {/* Section 1: Visual Scrap Category Selector (Multi-Select Enabled) */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-black uppercase tracking-wide text-stone-900 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs font-bold">1</span>
                <span>{t.step1}</span>
              </h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {selectedCount} {t.selected}
              </span>
            </div>

            {/* Quick 1-Tap Combo Presets */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
                <span className="flex items-center space-x-1">
                  <Layers className="w-3 h-3 text-stone-500" />
                  <span>{t.quickCombos}:</span>
                </span>
                <span className="text-[10px] text-stone-600 font-mono">
                  {t.tapToToggle}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyCombo('veggies')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 transition-all active:scale-95"
                >
                  {t.comboVeggies}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCombo('staples')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 transition-all active:scale-95"
                >
                  {t.comboStaples}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCombo('aromatics')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 transition-all active:scale-95"
                >
                  {t.comboAromatics}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCombo('all')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-all active:scale-95"
                >
                  {t.selectAll}
                </button>
                {selectedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => handleApplyCombo('clear')}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all active:scale-95"
                  >
                    {t.reset}
                  </button>
                )}
              </div>
            </div>

            {/* Accessible Visual Grid of 12 Byproduct Categories (Multi-select) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 pt-1">
              {(Object.keys(CATEGORY_VISUAL_REGISTRY) as OfflineScrapCategory[]).map((catKey) => {
                const meta = CATEGORY_VISUAL_REGISTRY[catKey];
                const isSelected = Boolean(selectedScraps[catKey]);
                const weight = selectedScraps[catKey];
                const isFocused = focusedCategory === catKey && isSelected;

                // Multilingual label
                const label = 
                  selectedLanguage === 'hi' ? meta.labelHi :
                  selectedLanguage === 'ta' ? meta.labelTa :
                  selectedLanguage === 'bn' ? meta.labelBn : meta.labelEn;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => toggleCategory(catKey)}
                    className={`relative p-2.5 rounded-xl border-2 text-left flex flex-col items-center justify-center transition-all ${
                      isSelected 
                        ? isFocused
                          ? 'border-emerald-700 bg-emerald-100/90 shadow-sm ring-2 ring-emerald-600'
                          : 'border-emerald-600 bg-emerald-50/80 shadow-xs' 
                        : 'border-stone-200 bg-white hover:border-stone-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 flex items-center space-x-0.5 px-1 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-mono font-bold leading-none shadow-xs">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{weight}g</span>
                      </div>
                    )}
                    <span className="text-2xl sm:text-3xl mb-1">{meta.iconSvg}</span>
                    <span className={`text-[11px] font-bold text-center leading-tight line-clamp-2 ${isSelected ? 'text-emerald-950 font-black' : 'text-stone-900'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Scrap Stockpile & Focused Calibration */}
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-black uppercase tracking-wide text-stone-900 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs font-bold">2</span>
                <span>{t.step2}</span>
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {t.totalStockpile}: {(totalWeightGrams / 1000).toFixed(2)} {t.kg} ({totalWeightGrams}g)
              </span>
            </div>

            {/* Selected Scraps Stockpile Chips with inline controls */}
            {selectedCount > 0 ? (
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-stone-600 font-bold block">
                  Active Stockpile ({selectedCount} items — click to fine-tune):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(selectedScraps) as OfflineScrapCategory[]).map((catKey) => {
                    const scrapMeta = CATEGORY_VISUAL_REGISTRY[catKey];
                    const weight = selectedScraps[catKey];
                    const isFocused = focusedCategory === catKey;
                    const catLabel = 
                      selectedLanguage === 'hi' ? scrapMeta.labelHi :
                      selectedLanguage === 'ta' ? scrapMeta.labelTa :
                      selectedLanguage === 'bn' ? scrapMeta.labelBn : scrapMeta.labelEn;

                    return (
                      <div
                        key={catKey}
                        onClick={() => setFocusedCategory(catKey)}
                        className={`cursor-pointer inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-all ${
                          isFocused
                            ? 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-500/40 shadow-xs'
                            : 'bg-white border-stone-300 text-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <span>{scrapMeta.iconSvg}</span>
                        <span className="font-bold truncate max-w-[110px]">{catLabel}</span>
                        <span className="font-mono text-[11px] bg-white/80 px-1 py-0.5 rounded border border-stone-200 font-bold">
                          {weight}g
                        </span>
                        
                        {/* Quick +/- and remove buttons */}
                        <div className="inline-flex items-center space-x-0.5 ml-1 border-l border-stone-300/80 pl-1">
                          <button
                            type="button"
                            onClick={(e) => adjustSpecificScrapWeight(catKey, -50, e)}
                            className="w-4 h-4 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 inline-flex items-center justify-center text-[10px] font-mono font-bold"
                            title="-50g"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={(e) => adjustSpecificScrapWeight(catKey, 50, e)}
                            className="w-4 h-4 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 inline-flex items-center justify-center text-[10px] font-mono font-bold"
                            title="+50g"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={(e) => removeSpecificScrap(catKey, e)}
                            className="w-4 h-4 rounded hover:bg-rose-100 text-rose-600 inline-flex items-center justify-center"
                            title="Remove scrap"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Tap any category cards above to add scraps to your inventory.</span>
              </div>
            )}

            {/* Stepper Display for Focused Scrap */}
            <div className="bg-stone-100 p-3 rounded-xl border border-stone-300 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span className="flex items-center space-x-1.5">
                  <span className="text-base">{focusedMeta.iconSvg}</span>
                  <span>{focusedLabel}</span>
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  {selectedScraps[focusedCategory] ? 'Calibrating scrap weight' : 'Tap +/- to add to stockpile'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-stone-300">
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => adjustWeight(-100)}
                    className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-300 font-black text-stone-800 hover:bg-stone-100 active:scale-95 flex items-center justify-center shadow-xs"
                    title="-100g"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustWeight(-50)}
                    className="px-2 h-10 rounded-lg bg-stone-50 border border-stone-300 font-mono text-xs font-bold text-stone-800 hover:bg-stone-100 active:scale-95"
                  >
                    -50g
                  </button>
                </div>

                <div className="text-center px-3">
                  <div className="text-2xl font-mono font-black text-stone-900">
                    {currentFocusedWeight}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                    {t.grams}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => adjustWeight(50)}
                    className="px-2 h-10 rounded-lg bg-stone-50 border border-stone-300 font-mono text-xs font-bold text-stone-800 hover:bg-stone-100 active:scale-95"
                  >
                    +50g
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustWeight(100)}
                    className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-300 font-black text-stone-800 hover:bg-stone-100 active:scale-95 flex items-center justify-center shadow-xs"
                    title="+100g"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Tactile Weight Presets */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[100, 250, 500, 1000, 2000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWeightPreset(preset)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      currentFocusedWeight === preset && selectedScraps[focusedCategory]
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}kg` : `${preset}g`}
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Tap Shelter Surplus Trigger Button */}
            <button
              type="button"
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
                    <p className="text-xs text-stone-500 font-mono mt-1 flex flex-wrap items-center gap-1.5">
                      <span>Input: <strong className="text-stone-800">{activeResult.recipe.scrapName}</strong></span>
                      <span>•</span>
                      <span>Stockpile: <strong className="text-emerald-700">{selectedScraps[activeResult.recipe.primaryScrapCategory] || 0}g</strong></span>
                      <span>•</span>
                      <span>{activeResult.recipe.minScrapGramsPerPortion}g / meal</span>
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

                    {/* Pantry Cost Badge (Dynamic to Zero-Cost Mode) */}
                    <div className={`text-center px-3 py-1.5 rounded-lg border ${
                      isZeroCostMode 
                        ? 'bg-emerald-50 border-emerald-400' 
                        : 'bg-amber-50 border-amber-300'
                    }`}>
                      <span className={`block text-xl font-mono font-black ${
                        isZeroCostMode ? 'text-emerald-950' : 'text-amber-900'
                      }`}>
                        {isZeroCostMode ? '₹0.0' : `₹${activeResult.costPerPortionINR.toFixed(1)}`}
                      </span>
                      <span className={`block text-[9px] font-mono uppercase font-bold ${
                        isZeroCostMode ? 'text-emerald-800' : 'text-amber-800'
                      }`}>
                        {isZeroCostMode ? t.zeroCostPerPortion : t.perPortion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hunger Relief & Satiety Impact Card for Poor & Needy */}
                <div className="bg-stone-900 text-white p-4 rounded-xl shadow-xs border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-base">🍲</span>
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-black">
                        {t.hungerImpact}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-400/30">
                        {t.allScrapsIncluded.replace('{n}', String(selectedCount))}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-heading font-black text-white flex items-center space-x-2 flex-wrap">
                      <span>{t.feedsAdults.replace('{n}', String(activeResult.feasiblePortions))}</span>
                      <span className="text-emerald-400 text-sm font-normal">
                        {t.orChildren.replace('{n}', String(Math.round(activeResult.feasiblePortions * 1.4)))}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300">
                      {isZeroCostMode ? t.zeroCostDesc : 'Clean, zero-waste salvaged ingredients providing high-fiber satiety.'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsZeroCostMode(!isZeroCostMode)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                        isZeroCostMode
                          ? 'bg-emerald-400 text-emerald-950 border-emerald-300 font-black shadow-xs ring-2 ring-emerald-300/40'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      }`}
                      title="Toggle Zero-Cost Street Cooking Mode"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{isZeroCostMode ? t.zeroCostMode : t.standardMode}</span>
                    </button>
                  </div>
                </div>

                {/* 100% Offline Audio Voice Cooking Assistant Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-100 rounded-xl border border-stone-300">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-emerald-500 animate-ping' : 'bg-stone-400'}`} />
                    <span className="text-xs font-heading font-black text-stone-800">
                      {isSpeaking ? `${t.speakingStep} ${activeSpeakingStepIndex || 1}` : t.voiceGuide}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-mono text-stone-600 bg-white px-1.5 py-0.5 rounded border border-stone-200 font-bold">
                      100% Offline Audio
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleVoiceGuide(dynamicSteps)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                        isSpeaking
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>{t.stopVoice}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{t.voiceGuide}</span>
                        </>
                      )}
                    </button>
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

                {/* Pantry Staples Needed / Zero-Cost Alternative */}
                {isZeroCostMode ? (
                  <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-300 space-y-1">
                    <span className="text-xs font-heading font-black text-emerald-950 block uppercase tracking-wide">
                      🧂 {t.zeroCostMode} (₹0.00 Total Expense):
                    </span>
                    <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                      {t.zeroCostDesc}
                    </p>
                  </div>
                ) : (
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
                )}

                {/* Step-by-Step Instructions Dynamically Incorporating All Selected Scraps */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-heading font-black uppercase tracking-wider text-stone-900 flex items-center space-x-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.instructions} ({dynamicSteps.length} {selectedLanguage === 'hi' ? 'चरण' : 'Steps'}):</span>
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {t.allScrapsIncluded.replace('{n}', String(selectedCount))}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {dynamicSteps.map((step) => {
                      const isBeingSpoken = isSpeaking && activeSpeakingStepIndex === step.stepIndex;
                      return (
                        <div 
                          key={step.stepIndex}
                          className={`p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                            isBeingSpoken 
                              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/40 shadow-sm' 
                              : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className={`w-5 h-5 rounded-full font-mono font-bold text-[11px] flex items-center justify-center shrink-0 ${
                                isBeingSpoken ? 'bg-emerald-800 text-white animate-pulse' : 'bg-stone-900 text-white'
                              }`}>
                                {step.stepIndex}
                              </span>
                              <span className="font-heading font-black text-stone-900 text-xs">
                                {step.title}
                              </span>
                            </div>

                            {step.badge && (
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${step.badgeColor || 'bg-stone-100 text-stone-700 border-stone-300'}`}>
                                {step.badge}
                              </span>
                            )}
                          </div>

                          <p className="leading-relaxed font-medium pl-7 text-stone-700">
                            {step.instruction}
                          </p>

                          {step.ingredientsInvolved && step.ingredientsInvolved.length > 0 && (
                            <div className="pl-7 flex flex-wrap items-center gap-1 pt-0.5">
                              <span className="text-[10px] font-mono text-stone-500 font-bold">Scraps used:</span>
                              {step.ingredientsInvolved.map((ing, iIdx) => (
                                <span key={iIdx} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-mono border border-stone-200">
                                  {ing}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Salvaged Food Safety & Hygiene Protocol Callout */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 text-xs space-y-2">
                  <div className="flex items-center space-x-1.5 text-emerald-950 font-black">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{t.foodSafetyTitle}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 text-[11px]">
                    <div className="p-2 bg-white/90 rounded-lg border border-emerald-200">
                      <span className="font-bold text-stone-900 block">{t.foodSafety1}</span>
                    </div>
                    <div className="p-2 bg-white/90 rounded-lg border border-emerald-200">
                      <span className="font-bold text-stone-900 block">{t.foodSafety2}</span>
                    </div>
                    <div className="p-2 bg-white/90 rounded-lg border border-emerald-200">
                      <span className="font-bold text-stone-900 block">{t.foodSafety3}</span>
                    </div>
                    <div className="p-2 bg-white/90 rounded-lg border border-emerald-200">
                      <span className="font-bold text-stone-900 block">{t.foodSafety4}</span>
                    </div>
                  </div>
                </div>

                {/* 1-Pot Chulha Fuel Saver Callout */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start space-x-2.5">
                  <Flame className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-heading font-black text-amber-950 block">{t.fuelSaverBadge}</span>
                    <span className="text-[11px] text-amber-900">{t.fuelSaverNote}</span>
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
