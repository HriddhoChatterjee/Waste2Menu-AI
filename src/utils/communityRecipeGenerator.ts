import { OfflineScrapCategory, OfflineScrapRecipe } from '../types';
import { CATEGORY_VISUAL_REGISTRY } from './offlineMatcher';

export interface DynamicCommunityStep {
  stepIndex: number;
  title: string;
  instruction: string;
  badge?: string;
  badgeColor?: string;
  ingredientsInvolved: string[];
}

export interface CommunityRecipeConfig {
  recipe: OfflineScrapRecipe;
  selectedScraps: Partial<Record<OfflineScrapCategory, number>>;
  language: 'en' | 'hi' | 'ta' | 'bn';
  isZeroCostMode: boolean;
  portions: number;
}

/**
 * Generates rich, step-by-step community kitchen preparation steps that
 * dynamically incorporate ALL selected ingredients from the user's stockpile.
 * Designed specifically for low-resource, chulha/fuel-saving, and humanitarian relief contexts.
 */
export function generateDynamicCommunitySteps(config: CommunityRecipeConfig): DynamicCommunityStep[] {
  const { recipe, selectedScraps, language, isZeroCostMode, portions } = config;

  // Gather all selected categories that have > 0 grams
  const selectedEntries = (Object.entries(selectedScraps) as [OfflineScrapCategory, number | undefined][])
    .filter(([_, weight]) => typeof weight === 'number' && weight > 0)
    .map(([cat, weight]) => ({
      category: cat,
      weight: weight as number,
      meta: CATEGORY_VISUAL_REGISTRY[cat] || CATEGORY_VISUAL_REGISTRY['ridge_gourd_peels']
    }));

  const getLabel = (cat: OfflineScrapCategory) => {
    const meta = CATEGORY_VISUAL_REGISTRY[cat];
    if (!meta) return cat;
    if (language === 'hi') return meta.labelHi;
    if (language === 'ta') return meta.labelTa;
    if (language === 'bn') return meta.labelBn;
    return meta.labelEn;
  };

  const steps: DynamicCommunityStep[] = [];
  let stepCounter = 1;

  // Categories groups
  const primaryCat = recipe.primaryScrapCategory;
  const primaryEntry = selectedEntries.find(e => e.category === primaryCat) || {
    category: primaryCat,
    weight: recipe.minScrapGramsPerPortion * portions,
    meta: CATEGORY_VISUAL_REGISTRY[primaryCat] || CATEGORY_VISUAL_REGISTRY['ridge_gourd_peels']
  };

  const vegScrapCats: OfflineScrapCategory[] = [
    'vegetable_trimmings', 'cauliflower_stalks', 'watermelon_rind', 'potato_peels', 'ridge_gourd_peels'
  ];
  const aromaticCats: OfflineScrapCategory[] = ['herb_stems', 'onion_skins', 'citrus_peels'];
  
  const selectedVegEntries = selectedEntries.filter(e => vegScrapCats.includes(e.category));
  const selectedAromatics = selectedEntries.filter(e => aromaticCats.includes(e.category));
  const dalWaterEntry = selectedEntries.find(e => e.category === 'dal_water');
  const riceEntry = selectedEntries.find(e => e.category === 'leftover_rice');
  const rotiEntry = selectedEntries.find(e => e.category === 'stale_roti_bread');
  const boneEntry = selectedEntries.find(e => e.category === 'poultry_bones');

  // ----------------------------------------------------
  // STEP 1: Universal Hygiene & Scrap Sanitization (Relief Safety)
  // ----------------------------------------------------
  const itemsToWash = selectedVegEntries.concat(selectedAromatics);
  const washListStr = itemsToWash.length > 0 
    ? itemsToWash.map(e => `${getLabel(e.category)} (${e.weight}g)`).join(', ')
    : `${getLabel(primaryCat)} (${primaryEntry.weight}g)`;

  let step1Title = '1. Food Safety & Sanitization Wash';
  let step1Instruction = `Thoroughly rinse all raw scraps in a basin: ${washListStr}. Soak in warm water with 1 tsp salt and a pinch of turmeric for 3 minutes to strip street dust, pesticide residues, and surface bacteria. Drain well.`;
  let step1Badge = '🛡️ Hygiene & Safety';

  if (language === 'hi') {
    step1Title = '१. खाद्य सुरक्षा व छिलकों की शुद्धि';
    step1Instruction = `सभी कच्चे छिलकों को धोएं: ${washListStr}। ३ मिनट के लिए हल्के गुनगुने पानी में १ चम्मच नमक और चुटकी भर हल्दी डालकर भिगोएं ताकि धूल, कीटाणु व रसायन पूरी तरह साफ हो जाएं। फिर पानी छान लें।`;
    step1Badge = '🛡️ स्वच्छता व शुद्धि';
  } else if (language === 'ta') {
    step1Title = '1. உணவுப் பாதுகாப்பு & சுத்திகரிப்பு';
    step1Instruction = `பச்சை சமையல் கழிவுகளை நன்கு கழுவவும்: ${washListStr}. வெதுவெதுப்பான நீரில் 1 தேக்கரண்டி உப்பு மற்றும் மஞ்சள் தூள் சேர்த்து 3 நிமிடம் ஊறவைத்து தூசிகளை அகற்றி வடிகட்டவும்.`;
    step1Badge = '🛡️ தூய்மை & பாதுகாப்பு';
  } else if (language === 'bn') {
    step1Title = '১. খাদ্য সুরক্ষা ও পরিচ্ছন্নতা';
    step1Instruction = `কাঁচা উপাদানের খোসাগুলি ধুয়ে নিন: ${washListStr}। ৩ মিনিট হালকা গরম জলে ১ চামচ নুন ও সামান্য হলুদ দিয়ে ভিজিয়ে রাখুন যাতে ধুলোবালি ও জীবাণু নষ্ট হয়। জল ভালো করে ঝরিয়ে নিন।`;
    step1Badge = '🛡️ জীবাণুমুক্তকরণ';
  }

  steps.push({
    stepIndex: stepCounter++,
    title: step1Title,
    instruction: step1Instruction,
    badge: step1Badge,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    ingredientsInvolved: itemsToWash.map(e => getLabel(e.category))
  });

  // ----------------------------------------------------
  // STEP 2: Quick-Cooking Chopping (Fuel / Firewood Saver)
  // ----------------------------------------------------
  const hardItems = selectedVegEntries.filter(e => 
    ['cauliflower_stalks', 'watermelon_rind', 'potato_peels', 'vegetable_trimmings', 'ridge_gourd_peels'].includes(e.category)
  );
  
  if (hardItems.length > 0 || rotiEntry) {
    const hardListStr = hardItems.map(e => `${getLabel(e.category)} (${e.weight}g)`).join(', ');
    
    let step2Title = '2. Fast-Cook Chopping (Chulha Fuel Saver)';
    let step2Instruction = `Finely dice hard fibrous scraps (${hardListStr}) into thin 0.5cm pieces so they soften in under 4 minutes. Slicing thin saves 40% firewood or gas. ${
      rotiEntry ? `Inspect Stale Roti/Bread (${rotiEntry.weight}g) for any green mold; discard damaged bits.` : ''
    }`;
    let step2Badge = '🔥 Fuel Saver Prep';

    if (language === 'hi') {
      step2Title = '२. बारीक कटाई (ईंधन व लकड़ी बचत)';
      step2Instruction = `सख्त छिलकों व डंठलों (${hardListStr}) को एकदम बारीक (आधा सेमी) टुकड़ों में काटें ताकि वे केवल ४ मिनट में गल जाएं। बारीक काटने से चूल्हे की लकड़ी व गैस बचती है। ${
        rotiEntry ? `बासी रोटी/ब्रेड (${rotiEntry.weight}g) की जांच करें और फफूंद वाले हिस्से हटा दें।` : ''
      }`;
      step2Badge = '🔥 ईंधन बचत कटाई';
    } else if (language === 'ta') {
      step2Title = '2. விரைவு சமையல் நறுக்குதல் (எரிபொருள் மிச்சம்)';
      step2Instruction = `கடினமான காய்கறி கழிவுகளை (${hardListStr}) மிகச் சிறிய துண்டுகளாக நறுக்கவும். இது 4 நிமிடத்தில் வெந்து 40% விறகு அல்லது எரிவாயுவை மிச்சப்படுத்தும். ${
        rotiEntry ? `பழைய ரொட்டியில் (${rotiEntry.weight}g) பூஞ்சை ஏதேனும் இருந்தால் நீக்கிவிடவும்.` : ''
      }`;
      step2Badge = '🔥 எரிபொருள் சேமிப்பு';
    } else if (language === 'bn') {
      step2Title = '২. দ্রুত রান্নার জন্য কুচানো (জ্বালানি সাশ্রয়)';
      step2Instruction = `শক্ত খোসা ও ডাঁটাগুলি (${hardListStr}) মিহি করে ছোট ছোট টুকরো করে কেটে নিন যাতে ৪ মিনিটের মধ্যে সেদ্ধ হয়ে যায় এবং জ্বালানি বাঁচে। ${
        rotiEntry ? `বাসি রুটি/পাউরুটিতে (${rotiEntry.weight}g) ছত্রাক আছে কি না দেখে নিন।` : ''
      }`;
      step2Badge = '🔥 জ্বালানি সাশ্রয়';
    }

    steps.push({
      stepIndex: stepCounter++,
      title: step2Title,
      instruction: step2Instruction,
      badge: step2Badge,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      ingredientsInvolved: hardItems.map(e => getLabel(e.category))
    });
  }

  // ----------------------------------------------------
  // STEP 3: One-Pot Base Cooking / Sauté
  // ----------------------------------------------------
  const secondaryVeg = selectedVegEntries.filter(e => e.category !== primaryCat);
  const secondaryVegStr = secondaryVeg.length > 0 
    ? `along with companion scraps: ${secondaryVeg.map(e => `${getLabel(e.category)} (${e.weight}g)`).join(', ')}`
    : '';

  let step3Title = '3. One-Pot Base Sauté & Cooking';
  let step3Instruction = '';
  let step3Badge = isZeroCostMode ? '₹0 Street Method' : '🍲 One-Pot Sauté';

  if (isZeroCostMode) {
    step3Instruction = `In a single pot or kadai, add 1.5 cups water, 1 tsp salt, and a pinch of turmeric (Zero-Cost Street Method — ₹0 oil or store spices required). Add ${getLabel(primaryCat)} (${primaryEntry.weight}g) ${secondaryVegStr}. Bring to a gentle boil on medium heat for 4 minutes until tender.`;
    if (language === 'hi') {
      step3Title = '३. शून्य-लागत एक-बर्तन उबाल (बिना तेल/मसाले)';
      step3Instruction = `एक ही कड़ाही या पतीले में १.५ कप पानी, १ चम्मच नमक व चुटकी भर हल्दी डालें (मुफ्त स्ट्रीट विधि — तेल व महंगे मसाले नहीं चाहिए)। इसमें ${getLabel(primaryCat)} (${primaryEntry.weight}g) और ${secondaryVeg.length > 0 ? secondaryVeg.map(e => `${getLabel(e.category)} (${e.weight}g)`).join(', ') : 'अन्य कटी सामग्री'} डालकर ४ मिनट तक उबालें।`;
      step3Badge = '₹0 स्ट्रीट विधि';
    } else if (language === 'ta') {
      step3Title = '3. இலவச ஒற்றைப் பாத்திர சமையல்';
      step3Instruction = `பாத்திரத்தில் 1.5 கப் தண்ணீர், 1 தேக்கரண்டி உப்பு, மஞ்சள் தூள் சேர்க்கவும் (₹0 இலவச முறை - எண்ணெய் மசாலா இன்றி). இதில் ${getLabel(primaryCat)} (${primaryEntry.weight}g) ${secondaryVeg.length > 0 ? 'மற்றும் ' + secondaryVeg.map(e => getLabel(e.category)).join(', ') : ''} சேர்த்து 4 நிமிடம் கொதிக்க வைக்கவும்.`;
      step3Badge = '₹0 இலவச முறை';
    } else if (language === 'bn') {
      step3Title = '৩. এক-হাঁড়িতে শূন্য-খরচে মূল রান্না';
      step3Instruction = `একটি পাত্রে ১.৫ কাপ জল, ১ চামচ নুন ও একটু হলুদ দিন (বিনা খরচের পদ্ধতি - তেল বা মশলা ছাড়া)। এতে ${getLabel(primaryCat)} (${primaryEntry.weight}g) ও ${secondaryVeg.length > 0 ? secondaryVeg.map(e => getLabel(e.category)).join(', ') : 'অন্যান্য সবজি'} দিয়ে ৪ মিনিট মাঝারি আঁচে ফুটিয়ে সেদ্ধ করুন।`;
      step3Badge = '₹0 সাধারণ পদ্ধতি';
    }
  } else {
    const spicesStr = recipe.stapleSpicesNeeded.slice(0, 4).join(', ');
    step3Instruction = `In a single pot, heat 1 tsp oil. Add ${spicesStr}. Stir in ${getLabel(primaryCat)} (${primaryEntry.weight}g) ${secondaryVegStr}. Sauté on medium flame for 4 minutes until aromatic and tender.`;
    if (language === 'hi') {
      step3Title = '३. एक-बर्तन तड़का व भुनाई';
      step3Instruction = `कड़ाही में १ चम्मच तेल गरम करें। ${spicesStr} डालकर तड़काएं। फिर ${getLabel(primaryCat)} (${primaryEntry.weight}g) ${secondaryVeg.length > 0 ? 'व अन्य सामग्री (' + secondaryVeg.map(e => getLabel(e.category)).join(', ') + ')' : ''} डालकर ४ मिनट अच्छी तरह भूनें।`;
      step3Badge = '🍲 एक-बर्तन भुनाई';
    } else if (language === 'ta') {
      step3Title = '3. தாளிப்பு & வதக்குதல்';
      step3Instruction = `பாத்திரத்தில் 1 தேக்கரண்டி எண்ணெய் சூடாக்கி, ${spicesStr} சேர்த்து தாளிக்கவும். பின்னர் ${getLabel(primaryCat)} (${primaryEntry.weight}g) ${secondaryVeg.length > 0 ? 'மற்றும் பிற கழிவுகளைச்' : ''} சேர்த்து 4 நிமிடம் வதக்கவும்.`;
      step3Badge = '🍲 தாளிப்பு முறை';
    } else if (language === 'bn') {
      step3Title = '৩. এক-কড়াইতে ফোড়ন ও ভাজা';
      step3Instruction = `কড়াইতে ১ চামচ তেল গরম করে ${spicesStr} ফোড়ন দিন। তারপর ${getLabel(primaryCat)} (${primaryEntry.weight}g) ${secondaryVeg.length > 0 ? 'ও অন্যান্য সবজি' : ''} দিয়ে ৪ মিনিট সুন্দর সুগন্ধ বের হওয়া পর্যন্ত ভেজে নিন।`;
      step3Badge = '🍲 মূল ভাজা';
    }
  }

  // If aromatics present, weave them in
  if (selectedAromatics.length > 0) {
    const aromaticsStr = selectedAromatics.map(e => `${getLabel(e.category)} (${e.weight}g)`).join(', ');
    if (language === 'hi') {
      step3Instruction += ` साथ ही सुगंधित छिलके (${aromaticsStr}) भी मिलाएं ताकि प्राकृतिक विटामिन व खुशबू भोजन में घुल जाए।`;
    } else if (language === 'ta') {
      step3Instruction += ` வாசனைக்காக (${aromaticsStr}) சேர்த்து கிளறவும்.`;
    } else if (language === 'bn') {
      step3Instruction += ` প্রাকৃতিক সুগন্ধ ও ভিটামিনের জন্য (${aromaticsStr}) মিশিয়ে দিন।`;
    } else {
      step3Instruction += ` Fold in aromatics (${aromaticsStr}) to release natural immunity vitamins and flavor depth.`;
    }
  }

  steps.push({
    stepIndex: stepCounter++,
    title: step3Title,
    instruction: step3Instruction,
    badge: step3Badge,
    badgeColor: isZeroCostMode ? 'bg-emerald-200 text-emerald-950 font-black border-emerald-400' : 'bg-blue-100 text-blue-800 border-blue-300',
    ingredientsInvolved: [getLabel(primaryCat), ...secondaryVeg.map(e => getLabel(e.category)), ...selectedAromatics.map(e => getLabel(e.category))]
  });

  // ----------------------------------------------------
  // STEP 4: Free Liquid & Mineral Nutrition (Dal Water / Poultry Bones)
  // ----------------------------------------------------
  if (dalWaterEntry || boneEntry) {
    const liquidItems: string[] = [];
    let step4Title = '4. Free Liquid & Mineral Enrichment';
    let step4Instruction = '';

    if (dalWaterEntry && boneEntry) {
      liquidItems.push(getLabel('dal_water'), getLabel('poultry_bones'));
      step4Instruction = `Pour in Dal Boiling Broth (${dalWaterEntry.weight}g) and add Bone Trimmings (${boneEntry.weight}g). Simmer together for 6 minutes. The lentil starch thickens the meal with free protein while bone marrow releases calcium and electrolytes for vulnerable children and elders.`;
    } else if (dalWaterEntry) {
      liquidItems.push(getLabel('dal_water'));
      step4Instruction = `Pour in ${dalWaterEntry.weight}g of Dal Boiling Broth instead of plain water! The lentil starch thickens the sauce and infuses free protein and minerals without spending a single rupee on extra dal.`;
    } else if (boneEntry) {
      liquidItems.push(getLabel('poultry_bones'));
      step4Instruction = `Add ${boneEntry.weight}g of Bone Fragments/Trimmings into the simmering pot. Cover and simmer for 6 minutes so marrow calcium and mineral electrolytes fortify the broth.`;
    }

    if (language === 'hi') {
      step4Title = '४. मुफ्त प्रोटीन व पोषक तरल समावेश';
      if (dalWaterEntry && boneEntry) {
        step4Instruction = `पतीले में ${dalWaterEntry.weight}g दाल का उबला पानी और ${boneEntry.weight}g हड्डियां डालें। ६ मिनट धीमी आंच पर पकाएं। दाल का स्टार्च गाढ़ापन देगा और हड्डियों से कैल्शियम बच्चों व बुजुर्गों के स्वास्थ्य को बल देगा।`;
      } else if (dalWaterEntry) {
        step4Instruction = `सादे पानी के स्थान पर ${dalWaterEntry.weight}g दाल का उबला पानी डालें! यह बिना ₹१ खर्च किए ग्रेवी को गाढ़ा, पौष्टिक और भरपूर प्रोटीन से युक्त बना देगा।`;
      } else if (boneEntry) {
        step4Instruction = `कड़ाही में ${boneEntry.weight}g हड्डियों के टुकड़े डालें और ६ मिनट उबालें ताकि सारा कैल्शियम व खनिज अर्क सूप में घुल जाए।`;
      }
    } else if (language === 'ta') {
      step4Title = '4. ஊட்டச்சத்து திரவம் சேர்த்தல்';
      if (dalWaterEntry) {
        step4Instruction = `சாதாரண தண்ணீருக்குப் பதிலாக ${dalWaterEntry.weight}g பருப்பு நீரை ஊற்றவும். இது குழம்பை திக்காக்கி, இலவச புரத சத்தை வழங்கும்.`;
      } else if (boneEntry) {
        step4Instruction = `${boneEntry.weight}g எலும்பு துண்டுகளைச் சேர்த்து 6 நிமிடம் கொதிக்க வைத்து கால்சியம் சத்துக்களை உணவில் சேர்க்கவும்.`;
      }
    } else if (language === 'bn') {
      step4Title = '৪. তরল পুষ্টি ও প্রোটিন মিশ্রণ';
      if (dalWaterEntry) {
        step4Instruction = `সাধারণ জলের বদলে ${dalWaterEntry.weight}g ডাল সেদ্ধ জল দিন। এটি বাড়তি কোনো খরচ ছাড়াই খাবারকে ঘন ও প্রোটিনসমৃদ্ধ করবে।`;
      } else if (boneEntry) {
        step4Instruction = `${boneEntry.weight}g হাড়ের টুকরো দিয়ে ৬ মিনিট ঢেকে ফোটান যাতে ক্যালসিয়াম ও মিনারেলযুক্ত ঝোল তৈরি হয়।`;
      }
    }

    steps.push({
      stepIndex: stepCounter++,
      title: step4Title,
      instruction: step4Instruction,
      badge: '🥣 Free Protein Boost',
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
      ingredientsInvolved: liquidItems
    });
  }

  // ----------------------------------------------------
  // STEP 5: Calorie Satiety & Bulk Staples (Leftover Rice / Stale Roti)
  // ----------------------------------------------------
  if (riceEntry || rotiEntry) {
    const stapleItems: string[] = [];
    let step5Title = '5. Calorie Bulk & Hunger Satiety Integration';
    let step5Instruction = '';

    if (riceEntry && rotiEntry) {
      stapleItems.push(getLabel('leftover_rice'), getLabel('stale_roti_bread'));
      step5Instruction = `Fold in Leftover Rice (${riceEntry.weight}g) and shredded Stale Roti/Bread (${rotiEntry.weight}g). Gently stir through the hot vegetable sauce. The grains and bread absorb the spiced juices within 2 minutes, turning this into an abundant, high-calorie meal that fully satisfies deep hunger.`;
    } else if (riceEntry) {
      stapleItems.push(getLabel('leftover_rice'));
      step5Instruction = `Fold in ${riceEntry.weight}g of Leftover Rice into the hot simmering mixture. Mix gently for 2 minutes so each grain absorbs the nutrient-rich vegetable juices, creating a hearty one-pot community meal.`;
    } else if (rotiEntry) {
      stapleItems.push(getLabel('stale_roti_bread'));
      step5Instruction = `Tear ${rotiEntry.weight}g of Stale Roti or bread into small bite-sized pieces and fold directly into the hot pot. The steam and juices instantly soften the rotis in 90 seconds, making them tender and easily digestible for everyone.`;
    }

    if (language === 'hi') {
      step5Title = '५. भरपेट भोजन व अनाज का समावेश';
      if (riceEntry && rotiEntry) {
        step5Instruction = `कड़ाही में बचे हुए चावल (${riceEntry.weight}g) और टुकड़ों में तोड़ी गई बासी रोटियां (${rotiEntry.weight}g) डालें। २ मिनट तक हल्के हाथ से मिलाएं। अनाज सारे रसों को सोख लेगा और भरपूर ऊर्जा देने वाला संपूर्ण आहार तैयार होगा।`;
      } else if (riceEntry) {
        step5Instruction = `कड़ाही में ${riceEntry.weight}g बचे हुए पके चावल डालें। २ मिनट धीमी आंच पर चलाएं ताकि चावल सारे विटामिन सोख ले और पेट भरने वाला पौष्टिक भोजन बने।`;
      } else if (rotiEntry) {
        step5Instruction = `बासी रोटियों/ब्रेड (${rotiEntry.weight}g) को छोटे टुकड़ों में तोड़कर गर्म कड़ाही में डालें। गर्म भाप से यह ९० सेकंड में एकदम नरम और सुपाच्य बन जाएगी।`;
      }
    } else if (language === 'ta') {
      step5Title = '5. பசி போக்கும் முழு தானியக் கலவை';
      if (riceEntry) {
        step5Instruction = `${riceEntry.weight}g மீதமான சாதத்தை இதில் சேர்த்து 2 நிமிடம் கிளறி சாறு முழுவதும் சாதத்தில் இறங்குமாறு செய்யவும்.`;
      } else if (rotiEntry) {
        step5Instruction = `${rotiEntry.weight}g பழைய ரொட்டியை சிறு துண்டுகளாக பிய்த்து போடவும். நீராவியில் 90 வினாடிகளில் மென்மையாகிவிடும்.`;
      }
    } else if (language === 'bn') {
      step5Title = '৫. ভরপেট খাবার ও খাদ্যশস্যের সংযোগ';
      if (riceEntry) {
        step5Instruction = `${riceEntry.weight}g বেঁচে যাওয়া ভাত কড়াইতে দিয়ে দিন। ২ মিনিট আলতো করে নাড়ুন যাতে ভাতে সবজির পুষ্টি মিশে যায়।`;
      } else if (rotiEntry) {
        step5Instruction = `${rotiEntry.weight}g বাসি রুটি টুকরো করে ফুটন্ত ঝোলে দিন। দেড় মিনিটেই রুটি নরম ও সহজে খাওয়ার উপযোগী হয়ে উঠবে।`;
      }
    }

    steps.push({
      stepIndex: stepCounter++,
      title: step5Title,
      instruction: step5Instruction,
      badge: '🍚 Calorie Bulk',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      ingredientsInvolved: stapleItems
    });
  }

  // ----------------------------------------------------
  // STEP 6: Steam Retention & Fuel Conservation (Heat OFF)
  // ----------------------------------------------------
  let step6Title = '6. Steam Retention Lid (Save 40% Fuel)';
  let step6Instruction = 'Cover tightly with a lid and remove immediately from fire or turn off the chulha flame. Let trapped internal steam complete the cooking for 3 minutes without burning an extra gram of fuel.';
  let step6Badge = '🔥 Zero-Fuel Finish';

  if (language === 'hi') {
    step6Title = '६. भाप ढक्कन तकनीक (४०% ईंधन बचत)';
    step6Instruction = 'बर्तन पर ढक्कन लगाएं और चूल्हा/गैस तुरंत बंद कर दें। अंदर की गर्म भाप में ३ मिनट तक पकने दें—बिना अतिरिक्त लकड़ी या गैस जलाए पूरा खाना तैयार हो जाएगा।';
    step6Badge = '🔥 शून्य-ईंधन समापन';
  } else if (language === 'ta') {
    step6Title = '6. நீராவி மூடி முறை (எரிபொருள் மிச்சம்)';
    step6Instruction = 'தட்டு போட்டு மூடி அடுப்பை அணைக்கவும். மூடிய நீராவியிலேயே 3 நிமிடம் தானாக வெந்துவிடும். கூடுதல் எரிபொருள் எரிக்க தேவையில்லை.';
    step6Badge = '🔥 எரிபொருள் சேமிப்பு';
  } else if (language === 'bn') {
    step6Title = '৬. ভাপে সেদ্ধ ও জ্বালানি সাশ্রয়';
    step6Instruction = 'পাত্রটি ঢাকনা দিয়ে ভালো করে ঢেকে আঁচ বন্ধ করে দিন। ভেতরের ভাপেই ৩ মিনিটে সম্পূর্ণ রান্না হয়ে যাবে, বাড়তি কাঠ বা গ্যাস লাগবে না।';
    step6Badge = '🔥 জ্বালানি সাশ্রয়';
  }

  steps.push({
    stepIndex: stepCounter++,
    title: step6Title,
    instruction: step6Instruction,
    badge: step6Badge,
    badgeColor: 'bg-stone-200 text-stone-900 border-stone-400',
    ingredientsInvolved: []
  });

  // ----------------------------------------------------
  // STEP 7: Community Relief Distribution & Safe Serving
  // ----------------------------------------------------
  const childPortions = Math.round(portions * 1.4);
  let step7Title = '7. Community Warm Serving & Distribution';
  let step7Instruction = `Serve steaming hot immediately in clean bowls or leaf plates. Feeds ${portions} hungry adults or ${childPortions} children at ₹0 scrap waste. High in electrolytes, fiber, and clean calories. Consume within 2 hours.`;
  let step7Badge = `🍲 Feeds ${portions} People`;

  if (language === 'hi') {
    step7Title = '७. गरमा-गरम परोसें व वितरण';
    step7Instruction = `तुरंत साफ कटोरों या पत्तलों पर गरमा-गरम परोसें। यह ${portions} वयस्कों या ${childPortions} बच्चों का पेट भरेगा—शून्य खाद्य बर्बादी के साथ। यह पाचन के लिए हल्का व शक्तिवर्धक है। २ घंटे के भीतर ग्रहण करें।`;
    step7Badge = `🍲 ${portions} लोगों का आहार`;
  } else if (language === 'ta') {
    step7Title = '7. சூடான உணவு பரிமாறுதல்';
    step7Instruction = `உடனே சூடாக தட்டுகளில் பரிமாறவும். ${portions} பெரியவர்கள் அல்லது ${childPortions} குழந்தைகளுக்கு பசி ஆறும் சத்துணவு. தயாரித்த 2 மணி நேரத்திற்குள் வழங்கவும்.`;
    step7Badge = `🍲 ${portions} பேருக்கு உணவு`;
  } else if (language === 'bn') {
    step7Title = '৭. গরম গরম পরিবেশন ও দান';
    step7Instruction = `পরিষ্কার থালা বা শালপাতায় অবিলম্বে গরম গরম পরিবেশন করুন। ${portions} জন প্রাপ্তবয়স্ক বা ${childPortions} জন শিশুর পেট ভরানোর জন্য উপযুক্ত। তৈরির ২ ঘণ্টার মধ্যে পরিবেশন করুন।`;
    step7Badge = `🍲 ${portions} জনের খাদ্য`;
  }

  steps.push({
    stepIndex: stepCounter++,
    title: step7Title,
    instruction: step7Instruction,
    badge: step7Badge,
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    ingredientsInvolved: []
  });

  return steps;
}
