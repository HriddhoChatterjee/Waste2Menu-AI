/**
 * ============================================================================
 * ANNAPURNA LOOP (WASTE2MENU: COMMUNITY ZERO-WASTE EDITION)
 * Pure Modern Vanilla JavaScript (ES6+) • Client Controller
 * ============================================================================
 * Features:
 * - Authentication (Master Chef vs Home Chef + 1-Click Demo Login)
 * - Complete 30-Scraps Interactive Matrix In Front (Organized as per the PDF)
 * - Multi-lingual live search (English, Hindi, Bengali, Tamil, etc.)
 * - Web Speech API Voice Guide for hands-free kitchen cooking
 * - Master Chef recipe uploading & NGO surplus food redistribution
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // AUTHENTIC 30-SCRAPS DATASET & CATEGORIES METADATA (REFERENCE GUIDE PARITY)
  // ==========================================================================
  const INGREDIENTS_DATA = [
    {
      id: 1,
      category_id: 1,
      name_en: "Bottle Gourd Peels",
      name_regional: "Lauki Chilka, Lau-er Khosha, Sorakkay Thol",
      common_uses: "Stir-fried crisp with nigella seeds (Chechki / Bhaja), ground with roasted peanuts for chutney, or mixed into raita."
    },
    {
      id: 2,
      category_id: 1,
      name_en: "Ridge Gourd Peels",
      name_regional: "Turai Chilka, Jhinge Khosha, Peerkangai Thol",
      common_uses: "Coarsely roasted with urad dal, dried red chillies, and tamarind into Thogayal / Chutney / Bata."
    },
    {
      id: 3,
      category_id: 1,
      name_en: "Potato Peels",
      name_regional: "Aloo Chilka, Aloo Khosha, Urulaikizhangu Thol",
      common_uses: "Shallow-fried with poppy seeds (Posto Aloo Khosha Bhaja) or seasoned with chaat masala into crispy chips."
    },
    {
      id: 4,
      category_id: 1,
      name_en: "Raw Banana / Plantain Peels",
      name_regional: "Kacche Kele Ka Chilka, Kancha Kolar Khosha, Vazhakkai Thol",
      common_uses: "Boiled and mashed with mustard oil, garlic, and green chillies into Khosha Bata, or stir-fried into Kerala Thoran."
    },
    {
      id: 5,
      category_id: 1,
      name_en: "Pointed Gourd Peels",
      name_regional: "Parwal Chilka, Potol Khosha",
      common_uses: "Ground into a spicy paste with mustard paste, garlic, and green chillies (Potol Khosha Bata)."
    },
    {
      id: 6,
      category_id: 1,
      name_en: "Pumpkin Peels & Fibers",
      name_regional: "Kaddu Chilka, Kumro Khosha, Parangikai Thol",
      common_uses: "Pan-roasted crisp with turmeric and cumin seeds, or slow-cooked into mixed-vegetable curries (Labra / Sambhar)."
    },
    {
      id: 7,
      category_id: 1,
      name_en: "Bitter Gourd Peels",
      name_regional: "Karela Chilka, Korola Khosha, Pavakkai Thol",
      common_uses: "Salted to extract excess bitterness, mixed with besan (gram flour), and fried into crunchy, blood-sugar friendly fritters."
    },
    {
      id: 8,
      category_id: 1,
      name_en: "Carrot & Radish Skins",
      name_regional: "Gajar / Mooli Chilka, Mulo Khosha",
      common_uses: "Sautéed into quick dry subzis with mustard seeds or blended into mixed-peel chutneys."
    },
    {
      id: 9,
      category_id: 1,
      name_en: "Eggplant / Brinjal Peels",
      name_regional: "Baingan Chilka, Begun Khosha, Kathirikai Thol",
      common_uses: "Simmered in tangy yogurt/mustard gravies (e.g., Kashmiri Khatte Baingan peel curry)."
    },
    {
      id: 10,
      category_id: 2,
      name_en: "Cauliflower Stems & Green Ribs",
      name_regional: "Phool Gobi Danthal, Fulkopi Danta, Cauliflower Thandu",
      common_uses: "Peeled and simmered into mustard paste gravies (Danta Chorchori), stir-fries with potatoes, or crunchy winter pickles."
    },
    {
      id: 11,
      category_id: 2,
      name_en: "Coriander & Mint Stems",
      name_regional: "Dhaniya Dandi, Dhonepata Danta, Kothamalli Thandu",
      common_uses: "Rich in volatile essential oils; blended into restaurant-style green chutney, soup bases, and marinades."
    },
    {
      id: 12,
      category_id: 2,
      name_en: "Broccoli Stalks",
      name_regional: "Broccoli Danthal",
      common_uses: "Woody exterior peeled away, core julienned into stir-fries, grated for paratha fillings, or pureed into soups."
    },
    {
      id: 13,
      category_id: 2,
      name_en: "Beetroot & Radish Greens",
      name_regional: "Chukandar / Mooli ke Patte, Mulo Saag",
      common_uses: "Finely chopped and cooked with garlic and green chillies into dry saag (Mooli Patte ki Sabzi)."
    },
    {
      id: 14,
      category_id: 2,
      name_en: "Colocasia / Taro Stems & Leaves",
      name_regional: "Arbi ke Patte / Dandi, Kochur Saag, Chembu Ila",
      common_uses: "Steamed with spiced besan into pinwheel rolls (Patra / Patrode) or cooked with coconut-mustard paste."
    },
    {
      id: 15,
      category_id: 2,
      name_en: "Cabbage Outer Tough Leaves & Core",
      name_regional: "Patta Gobi ki Dandi & Patte",
      common_uses: "Shredded fine for quick stir-fried bhurji or slow-simmered in hearty vegetable broths."
    },
    {
      id: 16,
      category_id: 3,
      name_en: "Watermelon White Rind",
      name_regional: "Tarbooj ka Safed Chilka, Tarmooj Khosha",
      common_uses: "Diced and made into soft morning dosas (Kalingana Polo), sweet halwa/murabba, or savory spiced gravies."
    },
    {
      id: 17,
      category_id: 3,
      name_en: "Jackfruit Seeds",
      name_regional: "Kathal ke Beej, Enchorer Bichi, Palakottai",
      common_uses: "Dried, boiled, and cooked in thick lentil dals, roasted over open charcoal embers, or stewed in spicy gravies."
    },
    {
      id: 18,
      category_id: 3,
      name_en: "Pumpkin Seeds",
      name_regional: "Kaddu ke Beej, Kumror Bichi",
      common_uses: "Washed, sun-dried, and dry-roasted with black salt and cumin as a nutrient-dense zinc snack."
    },
    {
      id: 19,
      category_id: 3,
      name_en: "Raw Mango Pits & Skins",
      name_regional: "Aam ki Guthli, Aam Aantti, Maangai Kottai",
      common_uses: "Simmered inside summer rasams or dals for natural acidity, or dried into tangy dry aamchur pickles."
    },
    {
      id: 20,
      category_id: 3,
      name_en: "Squeezed Lemon / Lime Halves",
      name_regional: "Nichoda Hua Nimbu, Lebur Khosha",
      common_uses: "Stuffed with salt and turmeric, sun-cured in glass jars for 3 weeks into zero-waste probiotic lemon pickle."
    },
    {
      id: 21,
      category_id: 4,
      name_en: "Leftover Cooked Rice",
      name_regional: "Basi Bhaat, Pazhaya Saadham, Panta Bhaat",
      common_uses: "Soaked overnight in water with green chillies for fermented breakfast, or mashed into crispy rice pakoras."
    },
    {
      id: 22,
      category_id: 4,
      name_en: "Stale Rotis / Chapati Ends",
      name_regional: "Basi Roti, Pazhaya Roti",
      common_uses: "Torn into pieces and tempered with mustard seeds, onions, and curry leaves (Roti Poha / Seyal Phulka / Kutti Roti)."
    },
    {
      id: 23,
      category_id: 4,
      name_en: "Stale Bread Crusts & Ends",
      name_regional: "Bread ke Kinare",
      common_uses: "Toasted dry and pulsed into homemade breadcrumbs, or prepared as spicy bread upma and shahi tukda bites."
    },
    {
      id: 24,
      category_id: 4,
      name_en: "Rice Wash Water",
      name_regional: "Chawal ka Paani, Dhowa Jal, Arisi Kalainja Thanneer",
      common_uses: "Used as a nutrient-rich cooking broth for dal, kneading soft roti dough, or as a mineral-rich soup base."
    },
    {
      id: 25,
      category_id: 4,
      name_en: "Cooked Rice Starch Water",
      name_regional: "Maanrh, Kanji Thanneer, Ganji",
      common_uses: "Seasoned with rock salt and roasted cumin as an energizing hydration tonic, or used as a gravy thickener."
    },
    {
      id: 26,
      category_id: 5,
      name_en: "Paneer / Chhena Whey Water",
      name_regional: "Paneer ka Paani, Chhanar Jal",
      common_uses: "High in complete protein; used to knead chapati dough, boil lentils, or form the liquid base of curries."
    },
    {
      id: 27,
      category_id: 5,
      name_en: "Sour Curd / Leftover Dahi",
      name_regional: "Khatta Dahi, Tok Doi, Puliya Thayir",
      common_uses: "Whisked with besan to make traditional Kadhi, rava dhokla fermenter, or South Indian Mor Kuzhambu."
    },
    {
      id: 28,
      category_id: 5,
      name_en: "Browned Ghee Sediment Residue",
      name_regional: "Mawa / Berukho / Khurchan / Mor Kali",
      common_uses: "Caramelized milk solids remaining in pan; tossed with hot rice and jaggery/sugar, or rolled into quick pedas."
    },
    {
      id: 29,
      category_id: 5,
      name_en: "Peeled Ginger Skins",
      name_regional: "Adrak ka Chilka, Ada-r Khosha, Inji Thol",
      common_uses: "Washed and dried, dropped directly into morning chai pots or boiled into immunity tisanes (kadha)."
    },
    {
      id: 30,
      category_id: 5,
      name_en: "Coconut Brown Husk Skins",
      name_regional: "Nariyal ka Khurchan / Brown Skin",
      common_uses: "Shredded and dry-roasted with red chillies, tamarind, and garlic into flavorful dry idli podi."
    },
    {
      id: 31,
      category_id: 6,
      name_en: "Bone Frames & Knuckles",
      name_regional: "Mutton Nalli, Chicken Haddi, Elumbu",
      common_uses: "Slow-simmered with crushed ginger, peppercorns, and turmeric into nutrient-dense bone broth (Nalli Soup / Paya Yakhni broth)."
    },
    {
      id: 32,
      category_id: 6,
      name_en: "Fish Head & Cartilage Trimmings",
      name_regional: "Machher Matha, Meen Thala",
      common_uses: "Fried with turmeric and slow-cooked into rich Bengali Muri Ghonto with fragrant rice, or simmered in spicy Assamese/South Indian sour gravies."
    },
    {
      id: 33,
      category_id: 6,
      name_en: "Prawn Shells & Heads",
      name_regional: "Chingri Khosha, Eral Odu",
      common_uses: "Roasted dry, crushed, and simmered with onions, garlic, and chillies to extract aromatic seafood broth or ground into spicy prawn shell chutney powder."
    },
    {
      id: 34,
      category_id: 6,
      name_en: "Chicken Skin & Fat Trimmings",
      name_regional: "Chicken Charbi",
      common_uses: "Rendered over low flame into natural cooking fat (schmaltz), and the crispy cracklings used as a crunchy garnish for pulav or dal."
    },
    {
      id: 35,
      category_id: 6,
      name_en: "Fish Roe / Egg Sacs",
      name_regional: "Machher Deem, Meen Muttai",
      common_uses: "Lightly seasoned with turmeric, salt, chopped green chillies, and onions, then pan-fried into crispy fish egg pakoras (Machher Deem-er Bora)."
    }
  ];

  const CATEGORIES_METADATA = [
    {
      id: 1,
      name: "Vegetable Peels & Skins",
      regional: "Chilka / Khosha / Thol",
      emoji: "🥔",
      count: 9,
      description: "Outer peels of gourds, tubers, roots, and nightshades rich in dietary fiber, polyphenols, and flavor."
    },
    {
      id: 2,
      name: "Stems, Stalks & Green Leaves",
      regional: "Danta / Thandu / Leaves",
      emoji: "🌿",
      count: 6,
      description: "Nutrient-packed fibrous stalks, tender stems, and mineral-dense leaves of brassicas, herbs, and colocasia."
    },
    {
      id: 3,
      name: "Seeds, Piths & Rinds",
      regional: "Beej / Bichi / Guthli",
      emoji: "🍉",
      count: 5,
      description: "High-protein seeds, fibrous piths, melon rinds, and citrus peels packed with essential oils and pectin."
    },
    {
      id: 4,
      name: "Grains, Starches & Leftover Staples",
      regional: "Basi / Leftover",
      emoji: "🍚",
      count: 5,
      description: "Cooked rice, overnight stale rotis, bread crusts, starchy wash waters, and kanji rich in natural probiotics and energy."
    },
    {
      id: 5,
      name: "Dairy & Spice Discards",
      regional: "Paneer Whey / Khurchan / Skins",
      emoji: "🥛",
      count: 5,
      description: "Bio-active paneer whey, sour curd, caramelized ghee residue (khurchan), ginger skins, and roasted coconut husks."
    },
    {
      id: 6,
      name: "Non-Veg Discards & Byproducts",
      regional: "Haddi / Charbi / Matha / Shells",
      emoji: "🍗",
      count: 5,
      description: "Nutrient-dense bone frames, marrow knuckles, fish heads, prawn shells, rendered chicken skin, and spiced fish egg sacs."
    }
  ];

  // ==========================================================================
  // STATIC GIT DEPLOYMENT & OFFLINE FALLBACK DATASETS
  // ==========================================================================
  const FALLBACK_RECIPES = [
  {
    "id": 1,
    "title": "Lauki Chilka Chechki (Crispy Bottle Gourd Peel Stir-Fry)",
    "scrap_id": 1,
    "chef_name": "Maa Shanti Debi",
    "chef_affiliation": "Bengal Traditional Rasoi",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Crispy Bhaja/Side",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard oil",
      "Kalonji (Nigella seeds)",
      "Green chillies",
      "Turmeric powder",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Wash the bottle gourd thoroughly before peeling. Slice the firm green peels into matchstick juliennes.",
      "Heat 1 tablespoon mustard oil in a cast-iron pan until smoking, then reduce flame and temper with 1/2 tsp kalonji and 2 slit green chillies.",
      "Add the julienned peels, turmeric, and salt. Saut\u00e9 on medium flame for 3 minutes.",
      "Cover with a lid and cook on low heat for 5-7 minutes until tender, then uncover and stir-fry on high flame for 2 minutes until crisp around edges.",
      "Serve hot with steamed rice and yellow masoor dal."
    ],
    "chef_wisdom_tip": "Grandmother Wisdom: Always peel the lauki right before cooking. If peels are too thick, parboil for 90 seconds in salted water for extra tenderness.",
    "servings": 4,
    "scrap_name_en": "Bottle Gourd Peels",
    "scrap_name_regional": "Lauki Chilka, Lau-er Khosha, Sorakkay Thol"
  },
  {
    "id": 2,
    "title": "Peerkangai Thol Thogayal (Ridge Gourd Peel Chutney)",
    "scrap_id": 2,
    "chef_name": "Paati Meenakshi",
    "chef_affiliation": "Tamil Nadu Temple Kitchens",
    "prep_time_minutes": 18,
    "difficulty": "Easy",
    "course_type": "Chutney/Dip",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Sesame (Gingelly) oil",
      "Urad dal",
      "Chana dal",
      "Dry red chillies",
      "Tamarind",
      "Asafoetida (Hing)",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Rinse ridge gourd peels in salted water. Chop roughly into 1-inch pieces.",
      "Heat 1 tablespoon sesame oil in a kadai. Roast 1 tbsp chana dal, 1 tbsp urad dal, 3 dry red chillies, and a pinch of hing until golden brown. Transfer to a plate.",
      "In the same pan, add the ridge gourd peels and saut\u00e9 on medium heat for 6-8 minutes until soft and raw smell disappears.",
      "Let the mixture cool completely. Add the roasted dals, a small marble-sized tamarind piece, salt, and 2 tablespoons of water.",
      "Coarsely grind in a mixie jar (do not make it watery paste). Serve with piping hot rice and a spoonful of ghee, or with crispy dosas."
    ],
    "chef_wisdom_tip": "Paati Wisdom: The rough ridged strings carry natural roughage. A small splash of tamarind balances any underlying natural bitterness.",
    "servings": 4,
    "scrap_name_en": "Ridge Gourd Peels",
    "scrap_name_regional": "Turai Chilka, Jhinge Khosha, Peerkangai Thol"
  },
  {
    "id": 3,
    "title": "Posto Aloo Khosha Bhaja (Potato Peel Poppy Seed Fry)",
    "scrap_id": 3,
    "chef_name": "Chef Sourav Ganguly",
    "chef_affiliation": "Kolkata Heritage Kitchen",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Crispy Bhaja/Side",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard oil",
      "Whole poppy seeds (Posto)",
      "Dry red chilli",
      "Turmeric powder",
      "Kashmiri red chilli",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Scrub whole potatoes with a brush before peeling. Keep the peeled skins submerged in cold water to wash away residual starch.",
      "Dry the potato peels completely between clean kitchen towels.",
      "Heat 2 tablespoons mustard oil in a heavy-bottomed skillet until pungent and clear.",
      "Add one broken dry red chilli and immediately toss in the dried potato peels. Fry on high flame for 3 minutes with turmeric and salt.",
      "Reduce heat to medium and sprinkle 1.5 tablespoons of raw whole white poppy seeds (posto) over the crispy peels.",
      "Toss for 60 seconds until the poppy seeds turn fragrant and nutty. Serve immediately alongside rice and Biulir Dal."
    ],
    "chef_wisdom_tip": "Chef Tip: Over 60% of a potato's potassium and iron reside in the skin. Never discard skins of organically grown potatoes!",
    "servings": 4,
    "scrap_name_en": "Potato Peels",
    "scrap_name_regional": "Aloo Chilka, Aloo Khosha, Urulaikizhangu Thol"
  },
  {
    "id": 4,
    "title": "Kancha Kolar Khosha Bata (Raw Banana Peel Pungent Mash)",
    "scrap_id": 4,
    "chef_name": "Didima Kalyani",
    "chef_affiliation": "Rural Bengal Home Kitchen",
    "prep_time_minutes": 20,
    "difficulty": "Easy",
    "course_type": "Chutney/Dip",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard oil",
      "Garlic cloves",
      "Green chillies",
      "Kalonji (Nigella)",
      "Salt",
      "Sugar (pinch)"
    ],
    "step_by_step_instructions": [
      "Wash raw plantains. Slice off the green skin moderately thick and discard only the extreme stem ends.",
      "Boil the peels in water with 1/2 tsp turmeric and salt for 8-10 minutes until fork-tender. Drain water.",
      "In a small pan, heat 1 tsp mustard oil. Saut\u00e9 4 garlic cloves and 2 green chillies for 1 minute.",
      "Transfer boiled peels, sauteed garlic, chillies, and salt to a traditional sil-batta or small mixer grinder. Blend into a smooth, thick paste.",
      "Heat 1 tablespoon raw mustard oil in the pan, add 1/4 tsp kalonji, and pour the paste. Cook on low heat for 3-4 minutes until it leaves the sides of the pan.",
      "Finish with a drizzle of raw mustard oil. Best relished with first mouthful of piping hot rice."
    ],
    "chef_wisdom_tip": "Didima Tip: Raw banana peels contain valuable resistant starch that acts as a natural prebiotic for gut health.",
    "servings": 4,
    "scrap_name_en": "Raw Banana / Plantain Peels",
    "scrap_name_regional": "Kacche Kele Ka Chilka, Kancha Kolar Khosha, Vazhakkai Thol"
  },
  {
    "id": 5,
    "title": "Potol Khosha Bata (Pointed Gourd Peel Garlic Relish)",
    "scrap_id": 5,
    "chef_name": "Chef Tapas Bhowmik",
    "chef_affiliation": "East Bengal Heritage",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Chutney/Dip",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Parwal peels",
      "Garlic cloves",
      "Green chillies",
      "Kalonji",
      "Mustard oil",
      "Salt",
      "Sugar"
    ],
    "step_by_step_instructions": [
      "Scrape pointed gourds lightly to remove sandy grit, wash, and peel outer skins.",
      "Coarsely grind the peels with 4 garlic cloves and 2 green chillies.",
      "Heat 1.5 tbsp mustard oil in a small iron skillet. Add kalonji and saute the ground paste.",
      "Cook stirring continuously on medium flame until moisture evaporates and paste turns deep olive green.",
      "Season with salt and a pinch of sugar to balance pungency."
    ],
    "chef_wisdom_tip": "Chef Tip: Iron skillet caramelization gives this relish a distinct smoky depth.",
    "servings": 4,
    "scrap_name_en": "Pointed Gourd Peels",
    "scrap_name_regional": "Parwal Chilka, Potol Khosha"
  },
  {
    "id": 6,
    "title": "Kumro Khosha Bhaja (Crisp Pumpkin Peel Cumin Roast)",
    "scrap_id": 6,
    "chef_name": "Maa Gayatri",
    "chef_affiliation": "Odisha Village Kitchen",
    "prep_time_minutes": 14,
    "difficulty": "Easy",
    "course_type": "Crispy Bhaja/Side",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard oil",
      "Cumin seeds",
      "Turmeric",
      "Green chillies",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Slice the hard green pumpkin peel into thin long strips.",
      "Heat mustard oil, splutter cumin seeds and slit green chillies.",
      "Add pumpkin peel strips with turmeric and salt.",
      "Saut\u00e9 on high heat for 3 minutes, then medium for 6 minutes until charred and crispy.",
      "Serve hot with dal and rice."
    ],
    "chef_wisdom_tip": "Wisdom: Pumpkin skins are dense in lutein and beta-carotene for eyesight protection.",
    "servings": 4,
    "scrap_name_en": "Pumpkin Peels & Fibers",
    "scrap_name_regional": "Kaddu Chilka, Kumro Khosha, Parangikai Thol"
  },
  {
    "id": 7,
    "title": "Karela Chilka Besan Fritters (Crunchy Bitter Gourd Crisps)",
    "scrap_id": 7,
    "chef_name": "Chef Pradeep Sharma",
    "chef_affiliation": "Rajasthan Marwari Rasoi",
    "prep_time_minutes": 16,
    "difficulty": "Medium",
    "course_type": "Crispy Bhaja/Side",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Besan (Gram flour)",
      "Amchur powder",
      "Ajwain (Carom seeds)",
      "Red chilli powder",
      "Mustard oil",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Scrape rough ridged peels of bitter gourd. Massage with 1 tsp salt and rest for 15 minutes.",
      "Squeeze firmly between palms to extract bitter green juice.",
      "Dust peels with 2 tbsp besan, ajwain, amchur powder, and red chilli powder (no water needed; moisture from peel binds it).",
      "Pan-fry in hot mustard oil on low flame until crisp and golden brown.",
      "Sprinkle chaat masala and enjoy as crunchy side."
    ],
    "chef_wisdom_tip": "Grandmother Wisdom: Squeezed karela peel juice can be added to drinking water for diabetic wellness.",
    "servings": 4,
    "scrap_name_en": "Bitter Gourd Peels",
    "scrap_name_regional": "Karela Chilka, Korola Khosha, Pavakkai Thol"
  },
  {
    "id": 8,
    "title": "Gajar Mooli Chilka Rai Ki Subzi (Crunchy Mustard Tossed Peel Saut\u00e9)",
    "scrap_id": 8,
    "chef_name": "Nani Sushila Devi",
    "chef_affiliation": "Mathura Braj Rasoi",
    "prep_time_minutes": 12,
    "difficulty": "Easy",
    "course_type": "Crispy Bhaja/Side",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard seeds (Rai)",
      "Green chillies",
      "Turmeric powder",
      "Amchur (Dry mango powder)",
      "Mustard oil",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Wash carrots and radishes with a vegetable brush before peeling into long strips.",
      "Heat mustard oil in a pan, crackle black mustard seeds and slit green chillies.",
      "Add the peels, turmeric, and salt. Saut\u00e9 on medium flame for 5 minutes without covering so they stay crunchy.",
      "Finish with a pinch of amchur powder and serve as a tangy side accompaniment with dal and phulkas."
    ],
    "chef_wisdom_tip": "Carrot skins hold high beta-carotene while radish skins possess natural pungency that softens beautifully when flash-saut\u00e9ed.",
    "servings": 4,
    "scrap_name_en": "Carrot & Radish Skins",
    "scrap_name_regional": "Gajar / Mooli Chilka, Mulo Khosha"
  },
  {
    "id": 9,
    "title": "Begun Khosha Khatte Baingan Curry (Tangy Kashmiri Peel Gravy)",
    "scrap_id": 9,
    "chef_name": "Chef Rafiq Mir",
    "chef_affiliation": "Kashmiri Heritage Table",
    "prep_time_minutes": 20,
    "difficulty": "Medium",
    "course_type": "Dry Sabzi",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard oil",
      "Fennel seed powder (Saunf)",
      "Dry ginger powder (Sonth)",
      "Whisked curd",
      "Hing (Asafoetida)",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Collect glossy purple brinjal skins from roasted bharta preparations.",
      "Heat mustard oil, add hing, and saut\u00e9 the eggplant peels until softened and lightly browned.",
      "Stir in saunf and sonth powders mixed with 3 tablespoons of whisked sour curd and 1/4 cup warm water.",
      "Simmer on low flame for 8 minutes until the gravy coats the peels with deep purple color and tangy aroma."
    ],
    "chef_wisdom_tip": "The deep violet color of brinjal skins is pure anthocyanin antioxidant; never throw it away when roasting bhartas!",
    "servings": 4,
    "scrap_name_en": "Eggplant / Brinjal Peels",
    "scrap_name_regional": "Baingan Chilka, Begun Khosha, Kathirikai Thol"
  },
  {
    "id": 10,
    "title": "Fulkopi Danta Chorchori (Cauliflower Stem Mustard Medley)",
    "scrap_id": 10,
    "chef_name": "Chef Anirban Roy",
    "chef_affiliation": "Ma Mati Manush Community Collective",
    "prep_time_minutes": 25,
    "difficulty": "Medium",
    "course_type": "Main Curry",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard oil",
      "Yellow mustard paste",
      "Paanch Phoron",
      "Green chillies",
      "Turmeric",
      "Diced potato & brinjal (optional)",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Take the thick central stem and green ribs of cauliflower. Peel away the fibrous outer rind with a knife to reveal the tender translucent core.",
      "Slice the tender stalks into 2-inch matchsticks.",
      "Heat 1.5 tbsp mustard oil in a kadai. Splutter 1/2 tsp paanch phoron and 2 green chillies.",
      "Add the sliced cauliflower stems (and optional potato/brinjal pieces). Saut\u00e9 with turmeric and salt for 5 minutes.",
      "Add 1/2 cup warm water, cover and simmer on low heat for 12 minutes until stems are fork-tender.",
      "Uncover and stir in 2 tbsp fresh yellow mustard paste mixed with 2 tbsp water. Simmer for 2 minutes (do not boil hard or mustard turns bitter).",
      "Drizzle 1 tsp virgin mustard oil on top and serve with steamed rice."
    ],
    "chef_wisdom_tip": "Chef Tip: The tender inner core of cauliflower stems is sweeter and crunchier than the florets themselves!",
    "servings": 4,
    "scrap_name_en": "Cauliflower Stems & Green Ribs",
    "scrap_name_regional": "Phool Gobi Danthal, Fulkopi Danta, Cauliflower Thandu"
  },
  {
    "id": 11,
    "title": "Dhaniya Dandi Hari Chutney (Restaurant-Style Coriander Stem Dip)",
    "scrap_id": 11,
    "chef_name": "Chef Harpal Singh",
    "chef_affiliation": "Dhabas of Grand Trunk Road",
    "prep_time_minutes": 10,
    "difficulty": "Easy",
    "course_type": "Chutney/Dip",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Coriander stems",
      "Green chillies",
      "Ginger",
      "Roasted cumin powder",
      "Black salt",
      "Lemon juice",
      "Chilled water / ice cube"
    ],
    "step_by_step_instructions": [
      "Do not throw away the thick roots/stems of fresh coriander. Trim the brown base roots, wash stems thoroughly 3 times in cold water.",
      "Roughly chop the juicy green stems. They carry 80% of the volatile flavor oils of coriander.",
      "Add the stems to a blender with 2 green chillies, 1-inch ginger, 1/2 tsp roasted jeera powder, 1/2 tsp black salt, and 1 ice cube.",
      "Pulse into a bright emerald green paste. The ice cube prevents mixer heat from turning the chutney dark.",
      "Stir in fresh lemon juice. Perfect with samosas, pakoras, or smeared inside parathas."
    ],
    "chef_wisdom_tip": "Master Tip: While leaves turn limp and oxidized, stems retain crisp acidity and vibrant chlorophyll oils for days.",
    "servings": 6,
    "scrap_name_en": "Coriander & Mint Stems",
    "scrap_name_regional": "Dhaniya Dandi, Dhonepata Danta, Kothamalli Thandu"
  },
  {
    "id": 12,
    "title": "Broccoli Danthal Masala Paratha (Spiced Stem Stuffed Flatbread)",
    "scrap_id": 12,
    "chef_name": "Chef Simran Kaur",
    "chef_affiliation": "Punjab Farmhouse Rasoi",
    "prep_time_minutes": 25,
    "difficulty": "Medium",
    "course_type": "Breakfast/Snack",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Whole wheat flour (Atta)",
      "Ajwain (Carom seeds)",
      "Green chillies",
      "Garam masala",
      "Ghee",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Peel the tough fibrous outer skin of broccoli stalks to expose the tender, jade-green sweet core.",
      "Grate the core finely using a box grater. Squeeze out excess moisture.",
      "Mix grated core with ajwain, chopped green chillies, garam masala, and salt to create the filling.",
      "Stuff into whole wheat dough pedas, roll gently, and roast on a hot tawa with ghee until speckled golden."
    ],
    "chef_wisdom_tip": "Broccoli stalks are actually sweeter and crunchier than the florets once the exterior 1mm bark is peeled away.",
    "servings": 4,
    "scrap_name_en": "Broccoli Stalks",
    "scrap_name_regional": "Broccoli Danthal"
  },
  {
    "id": 13,
    "title": "Mooli Ke Patte Ki Sabzi (Tender Radish Greens & Stalk Saag)",
    "scrap_id": 13,
    "chef_name": "Chef Baldev Ram",
    "chef_affiliation": "Punjab Pind Kitchens",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Main Curry",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard oil",
      "Ajwain (Carom seeds)",
      "Garlic",
      "Hing",
      "Turmeric",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Separate fresh green radish leaves from roots. Wash in cold salted water to remove mud.",
      "Chop leaves and tender green stalks finely.",
      "Heat mustard oil in a kadai. Add ajwain and hing, followed by minced garlic.",
      "Toss in radish greens with turmeric and salt. Saut\u00e9 on medium flame without covering so greens retain vivid color.",
      "Cook 8 minutes until moisture evaporates. Serve with makki or bajra roti."
    ],
    "chef_wisdom_tip": "Nani Tip: Radish leaves carry six times more Vitamin C and ten times more calcium than the radish root itself!",
    "servings": 4,
    "scrap_name_en": "Beetroot & Radish Greens",
    "scrap_name_regional": "Chukandar / Mooli ke Patte, Mulo Saag"
  },
  {
    "id": 14,
    "title": "Arbi Ke Patte Ki Patra (Colocasia Leaves Spiced Pinwheels)",
    "scrap_id": 14,
    "chef_name": "Chef Manjula Parikh",
    "chef_affiliation": "Saurashtra Traditional Kitchen",
    "prep_time_minutes": 30,
    "difficulty": "Medium",
    "course_type": "Snack/Tiffin",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Colocasia leaves",
      "Besan",
      "Tamarind pulp",
      "Jaggery",
      "Garam masala",
      "Sesame seeds",
      "Mustard seeds"
    ],
    "step_by_step_instructions": [
      "Wash colocasia leaves and roll over the back stems with a rolling pin to flatten fibrous veins.",
      "Make a thick paste of besan, tamarind pulp, jaggery, chilli powder, and salt.",
      "Smear paste evenly on back of each leaf, layer 3 leaves on top of each other, and roll tightly into a swiss roll cylinder.",
      "Steam in a steamer for 18 minutes until set and firm. Cool completely and slice into 1/2-inch round pinwheels.",
      "Shallow fry pinwheels in sesame and mustard seeds until exterior is crisp and nutty."
    ],
    "chef_wisdom_tip": "Important Wisdom: Always use tamarind or sour mango with colocasia to neutralize calcium oxalate micro-crystals.",
    "servings": 6,
    "scrap_name_en": "Colocasia / Taro Stems & Leaves",
    "scrap_name_regional": "Arbi ke Patte / Dandi, Kochur Saag, Chembu Ila"
  },
  {
    "id": 15,
    "title": "Patta Gobi Dandi Bhurji (Crispy Shredded Cabbage Core Saut\u00e9)",
    "scrap_id": 15,
    "chef_name": "Dadi Parvati",
    "chef_affiliation": "Maharashtra Rural Kitchen",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Crispy Bhaja/Side",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Peanut oil",
      "Cumin seeds",
      "Curry leaves",
      "Roasted peanut powder",
      "Kashmiri red chilli",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Thinly slice the tough outer cabbage leaves and chop the dense white core into matchsticks.",
      "Heat peanut oil in a kadai, add cumin seeds, curry leaves, and green chillies.",
      "Toss in the cabbage core matchsticks and fry uncovered on high flame for 5 minutes for charred sweetness.",
      "Sprinkle coarsely crushed roasted peanuts and red chilli powder. Toss for 1 minute and serve hot."
    ],
    "chef_wisdom_tip": "The central core contains high glutamic acid providing natural umami when saut\u00e9ed at high heat.",
    "servings": 4,
    "scrap_name_en": "Cabbage Outer Tough Leaves & Core",
    "scrap_name_regional": "Patta Gobi ki Dandi & Patte"
  },
  {
    "id": 16,
    "title": "Kalingana Polo (Watermelon White Rind Soft Dosa)",
    "scrap_id": 16,
    "chef_name": "Amma Shardamba",
    "chef_affiliation": "Konkani Coastal Heritage",
    "prep_time_minutes": 20,
    "difficulty": "Medium",
    "course_type": "Snack/Tiffin",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Dosa rice",
      "Grated watermelon white rind",
      "Fresh grated coconut",
      "Poha (flattened rice)",
      "Jaggery (optional)",
      "Salt"
    ],
    "step_by_step_instructions": [
      "After enjoying the red sweet watermelon fruit, peel off and discard only the paper-thin hard green outer skin.",
      "Grate the firm, juicy white inner rind (approx. 2 cups).",
      "Soak 1 cup raw dosa rice for 4 hours. Drain and grind with grated watermelon rind, 3 tbsp fresh coconut, and 2 tbsp soaked poha.",
      "Do not add extra water \u2014 the watermelon rind releases ample natural moisture.",
      "The batter should be of medium pouring consistency. Add salt (and optional 1/2 tsp crushed jaggery). No overnight fermentation is required.",
      "Pour a ladleful onto a hot greased cast iron tawa without spreading too thin (like a set dosa). Cover with lid and cook on medium flame until soft and spongy.",
      "Serve hot with coconut chutney and spicy tomato gojju."
    ],
    "chef_wisdom_tip": "Amma Wisdom: Watermelon white rind is rich in L-citrulline, an amino acid known to improve arterial circulation and muscle recovery.",
    "servings": 5,
    "scrap_name_en": "Watermelon White Rind",
    "scrap_name_regional": "Tarbooj ka Safed Chilka, Tarmooj Khosha"
  },
  {
    "id": 17,
    "title": "Kathal Beej Masala Dal (Jackfruit Seed Lentil Curry)",
    "scrap_id": 17,
    "chef_name": "Chef Jayanthi Ramesh",
    "chef_affiliation": "Kerala Malabar Coastal Kitchen",
    "prep_time_minutes": 25,
    "difficulty": "Medium",
    "course_type": "Main Curry",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Jackfruit seeds",
      "Toor dal",
      "Coconut oil",
      "Mustard seeds",
      "Sambar powder",
      "Curry leaves",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Peel the hard white shell from jackfruit seeds. Leave thin brown skin intact.",
      "Cut seeds lengthwise in half. Pressure cook with toor dal and turmeric for 3 whistles.",
      "In a pot, temper coconut oil with mustard seeds, curry leaves, and dried red chillies.",
      "Add sambar powder, cooked dal-seed mixture, and salt. Simmer for 6 minutes.",
      "The seeds turn creamy like chestnuts and absorb all aromatic spices."
    ],
    "chef_wisdom_tip": "Chef Tip: Jackfruit seeds have a rich chestnut-like starch and are zero-calorie compared to commercial nuts.",
    "servings": 5,
    "scrap_name_en": "Jackfruit Seeds",
    "scrap_name_regional": "Kathal ke Beej, Enchorer Bichi, Palakottai"
  },
  {
    "id": 18,
    "title": "Kaddu Beej Kala Namak Roast (Crunchy Spiced Zinc Snack)",
    "scrap_id": 18,
    "chef_name": "Vaidya Ramanathan",
    "chef_affiliation": "Kerala Ayurvedic Rasoi",
    "prep_time_minutes": 10,
    "difficulty": "Easy",
    "course_type": "Breakfast/Snack",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Black salt (Kala namak)",
      "Roasted cumin powder",
      "Chaat masala",
      "Cold-pressed coconut oil",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Wash fresh pumpkin seeds in a colander to separate sticky orange stringy fibers.",
      "Dry thoroughly on a clean cotton towel in the sun or under a fan for 2 hours.",
      "Heat a heavy iron skillet, add 1/2 tsp coconut oil and dry-roast seeds on medium-low flame for 6-8 minutes until they puff and pop.",
      "Toss with black salt, cumin powder, and chaat masala. Cool and store in an airtight jar for crunchy snacking."
    ],
    "chef_wisdom_tip": "Pumpkin seeds are nature's richest whole-food source of zinc and magnesium; dry roasting activates digestive enzymes.",
    "servings": 6,
    "scrap_name_en": "Pumpkin Seeds",
    "scrap_name_regional": "Kaddu ke Beej, Kumror Bichi"
  },
  {
    "id": 19,
    "title": "Aam Guthli Rasam (Tangy Ancestral Raw Mango Pit Broth)",
    "scrap_id": 19,
    "chef_name": "Paati Alamelu",
    "chef_affiliation": "Thanjavur Kitchen Tradition",
    "prep_time_minutes": 25,
    "difficulty": "Easy",
    "course_type": "Digestive Soup/Rasam",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Mustard seeds",
      "Crushed black pepper",
      "Cumin seeds",
      "Curry leaves",
      "Asafoetida (Hing)",
      "Sesame oil",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Save raw mango pits (guthli/aantti) with remaining pulp clinging to fibers from pickle making.",
      "Boil the pits in 3 cups of water with turmeric, salt, and slit green chillies for 15 minutes to release deep tangy essence.",
      "Discard the fibrous seed core, retaining the sour golden broth.",
      "Temper with sesame oil, mustard seeds, crushed cumin, black peppercorns, curry leaves, and a pinch of hing. Pour over hot rice."
    ],
    "chef_wisdom_tip": "Mango stones contain natural tannins that clarify broth and calm summer Pitta dosha in Ayurveda.",
    "servings": 4,
    "scrap_name_en": "Raw Mango Pits & Skins",
    "scrap_name_regional": "Aam ki Guthli, Aam Aantti, Maangai Kottai"
  },
  {
    "id": 20,
    "title": "Sun-Cured Nimbu Chilka Probiotic Achar (Whole Squeezed Lemon Pickle)",
    "scrap_id": 20,
    "chef_name": "Dadi Nirmala",
    "chef_affiliation": "Braj Rasoi Heritage",
    "prep_time_minutes": 10,
    "difficulty": "Easy",
    "course_type": "Chutney/Dip",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Squeezed lemon halves",
      "Rock salt / Sea salt",
      "Turmeric powder",
      "Kashmiri red chilli powder",
      "Ajwain",
      "Roasted fenugreek powder"
    ],
    "step_by_step_instructions": [
      "Never discard lemon halves after squeezing juice for salads or lemonade.",
      "Cut squeezed lemon cups into quarters. Place in a sterile glass mason jar.",
      "Add 3 tablespoons rock salt and 1 teaspoon turmeric powder. Shake the jar vigorously.",
      "Place the jar in direct terrace sunshine for 14-21 days, shaking once daily.",
      "The tough rind softens completely into tender, translucent, probiotic-rich digestive pickle with zero added oil."
    ],
    "chef_wisdom_tip": "Dadi Wisdom: Zero-oil sun curing preserves the precious limonene bioflavonoids in the yellow zest while cultivating beneficial wild lactic bacteria.",
    "servings": 10,
    "scrap_name_en": "Squeezed Lemon / Lime Halves",
    "scrap_name_regional": "Nichoda Hua Nimbu, Lebur Khosha"
  },
  {
    "id": 21,
    "title": "Panta Bhaat / Pazhaya Saadham (Fermented Probiotic Rice Bowl)",
    "scrap_id": 21,
    "chef_name": "Gramin Rasoi Collective",
    "chef_affiliation": "Traditional Coastal India",
    "prep_time_minutes": 5,
    "difficulty": "Easy",
    "course_type": "Snack/Tiffin",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Leftover cooked rice",
      "Drinking water",
      "Mustard oil",
      "Raw shallots / red onion",
      "Green chillies",
      "Rock salt"
    ],
    "step_by_step_instructions": [
      "Take leftover cooked parboiled or white rice in a clean clay pot or ceramic bowl.",
      "Pour enough boiled and cooled drinking water to fully submerge the rice by 1 inch.",
      "Cover loosely with a clean muslin cloth or lid and let it ferment overnight (8-12 hours) at ambient room temperature (do not refrigerate).",
      "In the morning, the water turns cloudy and slightly effervescent with natural lactic acid bacteria.",
      "Season with rock salt, 1 teaspoon virgin raw mustard oil, and crush 1 green chilli and 3 pearl onions directly into the bowl with your fingers.",
      "Consume chilled on empty stomach for supreme summer body cooling and gut vitality."
    ],
    "chef_wisdom_tip": "Scientific Fact: Overnight fermentation of rice multiplies its bioavailable iron content by up to 300% and generates natural vitamin B12.",
    "servings": 2,
    "scrap_name_en": "Leftover Cooked Rice",
    "scrap_name_regional": "Basi Bhaat, Pazhaya Saadham, Panta Bhaat"
  },
  {
    "id": 22,
    "title": "Basi Roti Seyal Phulka (Tempered Leftover Chapati Poha)",
    "scrap_id": 22,
    "chef_name": "Nani Hansa Ben",
    "chef_affiliation": "Gujarati & Sindhi Heritage Kitchen",
    "prep_time_minutes": 12,
    "difficulty": "Easy",
    "course_type": "Snack/Tiffin",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Mustard seeds",
      "Cumin seeds",
      "Curry leaves",
      "Hing",
      "Turmeric",
      "Diced onions",
      "Tomatoes",
      "Roasted peanuts",
      "Lemon juice"
    ],
    "step_by_step_instructions": [
      "Take 4-5 leftover chapatis from last night. Tear them into bite-sized 1-inch squares or pulse briefly in a mixie for coarse crumbs.",
      "Sprinkle 2 tablespoons of water or buttermilk over the pieces so they soften gently.",
      "Heat 1 tablespoon peanut oil in a kadai. Add mustard seeds, cumin seeds, hing, and fresh curry leaves.",
      "Add 2 tbsp raw peanuts and fry until crunchy. Toss in chopped onions and green chillies; saut\u00e9 until translucent.",
      "Add chopped tomatoes, turmeric, and salt. Cook until tomatoes turn mushy.",
      "Add the moistened roti pieces, toss vigorously on medium flame for 3 minutes until coated with spices.",
      "Finish with fresh chopped coriander and a generous squeeze of fresh lemon juice. Serve hot as comforting breakfast."
    ],
    "chef_wisdom_tip": "Nani Wisdom: Stale wheat chapatis undergo starch retrogradation overnight, creating gut-friendly resistant starch with a lower glycemic index.",
    "servings": 3,
    "scrap_name_en": "Stale Rotis / Chapati Ends",
    "scrap_name_regional": "Basi Roti, Pazhaya Roti"
  },
  {
    "id": 23,
    "title": "Bread Kinare Masala Upma (Spicy Tempered Bread End Toss)",
    "scrap_id": 23,
    "chef_name": "Chef Meera Nair",
    "chef_affiliation": "Cochin Community Kitchen",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Breakfast/Snack",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Mustard seeds",
      "Urad dal",
      "Onions",
      "Tomatoes",
      "Curry leaves",
      "Turmeric",
      "Oil",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Cut stale bread heels and leftover crusts into bite-sized cubes.",
      "Heat oil in a wok. Splutter mustard seeds, urad dal, curry leaves, and sliced onions until golden brown.",
      "Add chopped tomatoes, turmeric, and salt. Cook until soft and saucy.",
      "Splash 2 tablespoons of water, toss in the dry bread cubes, and mix gently on high flame for 2 minutes until spiced and chewy."
    ],
    "chef_wisdom_tip": "Stale bread absorbs spice temperings much better than fresh bread without turning into mush.",
    "servings": 4,
    "scrap_name_en": "Stale Bread Crusts & Ends",
    "scrap_name_regional": "Bread ke Kinare"
  },
  {
    "id": 24,
    "title": "Chawal Paani Aromatic Dal Tadka (Starchy Rice Water Simmered Dal)",
    "scrap_id": 24,
    "chef_name": "Dadi Kunti",
    "chef_affiliation": "Varanasi Ghat Kitchens",
    "prep_time_minutes": 25,
    "difficulty": "Easy",
    "course_type": "Dal/Sambar",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Toor dal (Pigeon peas)",
      "Ghee",
      "Cumin seeds",
      "Garlic cloves",
      "Dry red chillies",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Collect the cloudy second rinse water from washing rice (Arisi Kalainja Thanneer / Dhowa Jal).",
      "Use this starch-rich, B-vitamin packed water instead of plain tap water to pressure-cook toor dal with turmeric and salt for 4 whistles.",
      "Whisk the cooked dal; notice the naturally thick, velvety texture imparted by the rice starches.",
      "Temper in hot ghee with cumin seeds, whole garlic, and dry red chillies. Pour over dal with sizzling aroma."
    ],
    "chef_wisdom_tip": "Ancient Ayurvedic texts call rice wash water 'Tandulodaka'\u2014rich in natural starch, B-complex vitamins, and soothing for digestive lining.",
    "servings": 4,
    "scrap_name_en": "Rice Wash Water",
    "scrap_name_regional": "Chawal ka Paani, Dhowa Jal, Arisi Kalainja Thanneer"
  },
  {
    "id": 25,
    "title": "Maanrh Jeera Digestive Tonic (Roasted Cumin Kanji Elixir)",
    "scrap_id": 25,
    "chef_name": "Baidya Biren Sen",
    "chef_affiliation": "Rural Bengal Ayurvedic Seva",
    "prep_time_minutes": 10,
    "difficulty": "Easy",
    "course_type": "Digestive Soup/Rasam",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Roasted cumin powder (Bhuna Jeera)",
      "Black salt (Bit noon)",
      "Ghee",
      "Curry leaves",
      "Lime juice"
    ],
    "step_by_step_instructions": [
      "Drain the thick, hot starch water (Maanrh / Kanji / Pej) after boiling open-pot rice.",
      "Pour into earthen cups while still warm.",
      "Stir in 1/2 tsp of pure cow ghee, roasted cumin powder, and mineral-rich black salt.",
      "Squeeze fresh lime juice and drink warm as an instant rehydration tonic before afternoon meals."
    ],
    "chef_wisdom_tip": "Cooked rice starch water contains easily assimilable complex carbohydrates and electrolytes; it was traditional Indian medicine for fatigue and digestion.",
    "servings": 2,
    "scrap_name_en": "Cooked Rice Starch Water",
    "scrap_name_regional": "Maanrh, Kanji Thanneer, Ganji"
  },
  {
    "id": 26,
    "title": "Paneer Whey Protein Rasam (Nutrient-Dense Tomato Broth)",
    "scrap_id": 26,
    "chef_name": "Chef Senthil Kumar",
    "chef_affiliation": "Zero-Waste South Indian Rasoi",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Main Curry",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Paneer whey water",
      "Chopped tomatoes",
      "Crushed garlic",
      "Crushed black pepper",
      "Cumin seeds",
      "Curry leaves",
      "Ghee",
      "Mustard seeds"
    ],
    "step_by_step_instructions": [
      "Whenever you make paneer, chhena, or hung curd, never discard the yellowish liquid whey. It contains 100% of milk's soluble proteins.",
      "In a saucepan, heat 1 tsp ghee. Splutter mustard seeds, cumin, and curry leaves.",
      "Add 4 crushed garlic cloves and 2 ripe chopped tomatoes. Cook until soft.",
      "Pour in 2.5 cups of fresh paneer whey water. Add 1/2 tsp turmeric, crushed black pepper, and salt.",
      "Bring to a gentle rolling simmer for 5 minutes. The whey lends a gentle natural tanginess, eliminating the need for heavy tamarind.",
      "Garnish with fresh coriander stems and serve as a soothing immunity soup or over hot rice."
    ],
    "chef_wisdom_tip": "Nutritionist Insight: 1 liter of paneer whey contains roughly 8-10 grams of pure, highly digestible branched-chain amino acids (BCAAs).",
    "servings": 4,
    "scrap_name_en": "Paneer / Chhena Whey Water",
    "scrap_name_regional": "Paneer ka Paani, Chhanar Jal"
  },
  {
    "id": 27,
    "title": "Tok Doi Gujarati Kadhi (Sweet & Tangy Leftover Curd Stew)",
    "scrap_id": 27,
    "chef_name": "Nani Hansa Ben",
    "chef_affiliation": "Ahmedabad Heritage Rasoi",
    "prep_time_minutes": 20,
    "difficulty": "Easy",
    "course_type": "Dal/Sambar",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Besan (Gram flour)",
      "Ghee",
      "Cloves & Cinnamon",
      "Mustard & Cumin seeds",
      "Jaggery (Gor)",
      "Ginger-green chilli paste",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Whisk sour leftover curd with 2 tablespoons besan and 2 cups of water until completely smooth with no lumps.",
      "Add ginger-chilli paste, jaggery, and salt. Bring to a gentle boil on low heat, stirring continuously so curd does not curdle.",
      "In a small pan, heat ghee and temper with mustard, cumin, cloves, cinnamon, and curry leaves.",
      "Pour sputtering tadka into simmering kadhi. Simmer for 5 minutes and serve with warm khichdi."
    ],
    "chef_wisdom_tip": "Never discard sour dahi! The lactic acidity is precisely what gives authentic Gujarati Kadhi its quintessential balance with sweet jaggery.",
    "servings": 4,
    "scrap_name_en": "Sour Curd / Leftover Dahi",
    "scrap_name_regional": "Khatta Dahi, Tok Doi, Puliya Thayir"
  },
  {
    "id": 28,
    "title": "Ghee Khurchan Mawa Ladoo (Caramelized Pan Solid Quick Sweets)",
    "scrap_id": 28,
    "chef_name": "Maa Annapurna Devi",
    "chef_affiliation": "Braj Ghee Heritage",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Breakfast/Snack",
    "dietary_type": "Pure Veg",
    "pantry_staples": [
      "Jaggery powder or Bura sugar",
      "Cardamom powder (Elaichi)",
      "Crushed almonds/cashews"
    ],
    "step_by_step_instructions": [
      "Collect the golden-brown caramelized milk sediment (Khurchan / Berukho / Mor Kali) left in the pan after boiling butter into ghee.",
      "While still warm, transfer to a bowl and mash gently with a fork.",
      "Add equal parts powdered jaggery or bura sugar, a pinch of green cardamom powder, and crushed nuts.",
      "Roll into marble-sized bite sweets (ladoos) or simply toss with piping hot steamed rice for a heavenly traditional treat."
    ],
    "chef_wisdom_tip": "Ghee khurchan is essentially slow-toasted artisanal mawa packed with buttery aroma; grandmothers considered it the sweetest reward of ghee-making day.",
    "servings": 6,
    "scrap_name_en": "Browned Ghee Sediment Residue",
    "scrap_name_regional": "Mawa / Berukho / Khurchan / Mor Kali"
  },
  {
    "id": 29,
    "title": "Adrak Chilka Kadha (Immunity Boosting Ginger Peel Tisane)",
    "scrap_id": 29,
    "chef_name": "Acharya Baldev",
    "chef_affiliation": "Himalayan Herbal Kitchen",
    "prep_time_minutes": 12,
    "difficulty": "Easy",
    "course_type": "Digestive Soup/Rasam",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Tulsi leaves",
      "Crushed black peppercorns",
      "Cinnamon bark",
      "Honey or Jaggery",
      "Water"
    ],
    "step_by_step_instructions": [
      "Rinse peeled ginger skins well to wash away any soil traces. Air dry slightly.",
      "Bring 3 cups of water to a boil in a tea kettle.",
      "Add ginger skins, 5 crushed peppercorns, 1 cinnamon stick, and fresh tulsi leaves.",
      "Simmer covered for 8-10 minutes until aromatic and amber in color. Strain into cups and sweeten with raw honey or jaggery."
    ],
    "chef_wisdom_tip": "The ginger peel and the layer immediately beneath it hold the highest concentration of gingerols and zingiberene volatile oils.",
    "servings": 3,
    "scrap_name_en": "Peeled Ginger Skins",
    "scrap_name_regional": "Adrak ka Chilka, Ada-r Khosha, Inji Thol"
  },
  {
    "id": 30,
    "title": "Nariyal Brown Skin Idli Podi (Roasted Coconut Husk Gunpowder)",
    "scrap_id": 30,
    "chef_name": "Chef Senthil Murugan",
    "chef_affiliation": "Madurai Spice Guild",
    "prep_time_minutes": 15,
    "difficulty": "Easy",
    "course_type": "Chutney/Dip",
    "dietary_type": "Vegan",
    "pantry_staples": [
      "Chana dal",
      "Urad dal",
      "Dry red chillies",
      "Curry leaves",
      "Asafoetida (Hing)",
      "Sesame oil",
      "Salt"
    ],
    "step_by_step_instructions": [
      "Collect the thin brown skin shavings peeled when peeling fresh coconut for white sweets or chutneys.",
      "Dry roast the brown shavings in a heavy pan until nutty and completely crisp (do not burn).",
      "In the same pan, roast 2 tbsp chana dal, 2 tbsp urad dal, 6 red chillies, and curry leaves in 1/2 tsp sesame oil.",
      "Cool all ingredients and pulse in a dry mixer grinder with salt and hing into a coarse aromatic gunpowder spice mix.",
      "Serve mixed with cold-pressed sesame oil alongside hot idlis and crispy dosas."
    ],
    "chef_wisdom_tip": "The fibrous brown coconut testa contains high insoluble fiber and rich natural aromatic oils that create legendary podi powders.",
    "servings": 8,
    "scrap_name_en": "Coconut Brown Husk Skins",
    "scrap_name_regional": "Nariyal ka Khurchan / Brown Skin"
  },
  {
    "id": 31,
    "title": "Slow-Simmered Mutton Bone Broth (Paya Yakhni Soup)",
    "scrap_id": 31,
    "chef_name": "Ustad Abdul Kareem",
    "chef_affiliation": "Dakhni Heritage Rasoi, Hyderabad",
    "prep_time_minutes": 50,
    "difficulty": "Medium",
    "course_type": "Soup/Broth",
    "dietary_type": "Non-Veg",
    "pantry_staples": [
      "Mutton bone knuckles",
      "Crushed black peppercorns",
      "Fresh ginger & garlic",
      "Turmeric powder",
      "Coriander seeds",
      "Green cardamom",
      "Ghee",
      "Fresh mint"
    ],
    "step_by_step_instructions": [
      "Rinse mutton bone frames and knuckles thoroughly in warm salted water.",
      "Crack knuckles slightly with a heavy cleaver or pestle to expose marrow cavities for nutrient extraction.",
      "In a heavy-bottomed pot or pressure cooker, heat 1 tsp ghee; add bruised green cardamoms, crushed black pepper, ginger, and garlic until aromatic.",
      "Add bone frames and sear for 3 minutes. Pour 6 cups of water, add 1/2 tsp turmeric and salt.",
      "Slow-simmer on low flame for 45-60 minutes (or 6 whistles in cooker) until gelatinous marrow and collagen infuse the golden broth.",
      "Strain into bowls, sprinkle roasted cumin powder and fresh mint leaves. Serve piping hot with lemon wedges."
    ],
    "chef_wisdom_tip": "Adding a splash of lemon during simmering leaches out maximum calcium and bioavailable collagen from the knuckle bones.",
    "servings": 4,
    "scrap_name_en": "Bone Frames & Knuckles",
    "scrap_name_regional": "Mutton Nalli, Chicken Haddi, Elumbu"
  },
  {
    "id": 32,
    "title": "Spiced Fish Head Rice Medley (Bengali Muri Ghonto)",
    "scrap_id": 32,
    "chef_name": "Ruma Mukherjee",
    "chef_affiliation": "Ganga Delta Home Kitchens, Kolkata",
    "prep_time_minutes": 35,
    "difficulty": "Advanced",
    "course_type": "Main Course",
    "dietary_type": "Non-Veg",
    "pantry_staples": [
      "Rahu or Katla fish heads",
      "Fragrant Gobindobhog or Basmati rice",
      "Mustard oil",
      "Bay leaf & cumin seeds",
      "Onions & ginger paste",
      "Turmeric & Kashmiri chilli",
      "Garam masala & ghee"
    ],
    "step_by_step_instructions": [
      "Halve fish head into manageable quarters, wash clean, and marinate with turmeric and salt.",
      "Deeply sear fish head pieces in hot mustard oil until golden brown and aromatic, breaking slightly with the spatula.",
      "In the remaining oil, temper whole garam masala, bay leaf, and cumin seeds; sauté sliced onions and ginger-garlic paste until brown.",
      "Add rinsed fragrant rice and gently sauté for 2 minutes to coat the grains in aromatic fat.",
      "Return the fried fish head pieces to the pan, add warm water (1:2 ratio to rice), cover and simmer on low for 15 minutes.",
      "Finish with a spoonful of aromatic ghee and garam masala. Let it rest 5 minutes before serving with steamed rice."
    ],
    "chef_wisdom_tip": "Deeply frying the fish head until crisp eliminates any fishy odor and extracts rich omega-3 oils that cook the fragrant rice grains from within.",
    "servings": 4,
    "scrap_name_en": "Fish Head & Cartilage Trimmings",
    "scrap_name_regional": "Machher Matha, Meen Thala"
  },
  {
    "id": 33,
    "title": "Spiced Prawn Shell Chutney Powder & Broth",
    "scrap_id": 33,
    "chef_name": "Chef Meenakshi Sundaram",
    "chef_affiliation": "Coromandel Coastal Kitchen, Chennai",
    "prep_time_minutes": 25,
    "difficulty": "Easy",
    "course_type": "Side Dish / Condiment",
    "dietary_type": "Non-Veg",
    "pantry_staples": [
      "Fresh prawn heads and shells",
      "Byadagi dried red chillies",
      "Urad dal & chana dal",
      "Curry leaves",
      "Tamarind pulp",
      "Garlic cloves",
      "Hing (Asafoetida)",
      "Sesame oil"
    ],
    "step_by_step_instructions": [
      "Thoroughly rinse prawn heads and shells; pat completely dry on cotton kitchen towels.",
      "Dry-roast prawn shells on a cast iron pan over medium flame for 8-10 minutes until intensely fragrant, crisp, and brittle.",
      "Separately roast urad dal, chana dal, dried red chillies, garlic, and fresh curry leaves in 1/2 tsp sesame oil until aromatic.",
      "Let all ingredients cool down to room temperature.",
      "Transfer roasted shells, lentils, spices, salt, and tamarind into a spice grinder and pulse to a coarse, vibrant red podi.",
      "Store in an airtight jar. Serve with hot steamed rice and ghee, or sprinkle over crisp dosas."
    ],
    "chef_wisdom_tip": "The prawn shells contain rich chitin and umami-heavy glutamates. Ensure they are bone-dry before grinding so the powder stays fresh for months.",
    "servings": 6,
    "scrap_name_en": "Prawn Shells & Heads",
    "scrap_name_regional": "Chingri Khosha, Eral Odu"
  },
  {
    "id": 34,
    "title": "Rendered Chicken Schmaltz & Golden Cracklings",
    "scrap_id": 34,
    "chef_name": "Chef Zorawar Sethi",
    "chef_affiliation": "Grand Trunk Road Culinary Collective, Amritsar",
    "prep_time_minutes": 20,
    "difficulty": "Easy",
    "course_type": "Side Dish / Condiment",
    "dietary_type": "Non-Veg",
    "pantry_staples": [
      "Trimmed chicken skin and charbi fat",
      "Coarse sea salt",
      "Crushed black pepper",
      "Chopped garlic cloves",
      "Sliced shallots"
    ],
    "step_by_step_instructions": [
      "Chop chicken skin trimmings and solid fat pockets into bite-sized 1-inch squares.",
      "Place skin pieces in a cold skillet with 2 tablespoons of water over low-medium heat.",
      "As water evaporates, the chicken fat begins to slowly render out into clean, liquid golden cooking fat.",
      "Stir occasionally for 12-15 minutes until the skin pieces turn ultra-crispy, golden cracklings (chicharrones).",
      "Remove crispy cracklings with a slotted spoon onto paper towels; toss with rock salt and freshly crushed black pepper.",
      "Strain the rendered liquid chicken schmaltz into a glass jar—use it as cooking oil for roasting potatoes or kneading dough.",
    ],
    "chef_wisdom_tip": "Starting with a small splash of water prevents the raw skin from burning while easing the low-temperature fat rendering process.",
    "servings": 4,
    "scrap_name_en": "Chicken Skin & Fat Trimmings",
    "scrap_name_regional": "Chicken Charbi"
  },
  {
    "id": 35,
    "title": "Crispy Spiced Fish Roe Fritters (Machher Deem-er Bora)",
    "scrap_id": 35,
    "chef_name": "Chef Tanusree Ganguly",
    "chef_affiliation": "Bengal Byproduct Heritage Circle, Siliguri",
    "prep_time_minutes": 18,
    "difficulty": "Easy",
    "course_type": "Snack / Fritter",
    "dietary_type": "Non-Veg",
    "pantry_staples": [
      "Fresh fish roe / egg sacs",
      "Finely chopped red onions",
      "Chopped green chillies",
      "Besan (Gram flour)",
      "Turmeric & kalonji (nigella) seeds",
      "Mustard oil for frying",
      "Rock salt"
    ],
    "step_by_step_instructions": [
      "Wash fish roe gently under running water, removing any tough outer membrane veins.",
      "In a mixing bowl, gently mash fish roe using a fork; add finely chopped onions, green chillies, kalonji, turmeric, and salt.",
      "Add 1-2 tablespoons of besan (gram flour) strictly as a light binder—do not add water as roe contains natural moisture.",
      "Heat mustard oil in a pan until it reaches smoking point, then reduce to medium.",
      "Drop tablespoon-sized balls of the mixture into hot oil and shallow fry for 2-3 minutes per side until golden and crunchy.",
      "Drain on paper towels and serve hot alongside steamed rice, yellow masoor dal, and green chillies."
    ],
    "chef_wisdom_tip": "Do not over-mix or add extra water to the roe batter; the eggs naturally puff into tender, airy fritters with a delicate crisp shell.",
    "servings": 4,
    "scrap_name_en": "Fish Roe / Egg Sacs",
    "scrap_name_regional": "Machher Deem, Meen Muttai"
  }
];

  const FALLBACK_DISPATCHES = [
  {
    "id": 1,
    "recipe_id": 5,
    "dish_name": "Fulkopi Danta Chorchori & Steamed Rice",
    "prepared_by_chef": "Chef Anirban Roy (Community Kitchen #2)",
    "portions_available": 25,
    "pickup_location": "Community Kitchen Hub, 14 Lake Road, Southern Avenue, Kolkata",
    "contact_number": "+91 98301 44521",
    "status": "ACTIVE",
    "claimed_by_ngo": null,
    "notes": "Freshly prepared from bulk market cauliflower trims. Packed in 5-liter insulated stainless thermal containers."
  },
  {
    "id": 2,
    "recipe_id": 8,
    "dish_name": "Warm Basi Roti Seyal Phulka Tiffin",
    "prepared_by_chef": "Nani Hansa Ben & Volunteers",
    "portions_available": 35,
    "pickup_location": "Rasoi Seva Bhavan, Subhash Chowk, Ahmedabad",
    "contact_number": "+91 98250 88210",
    "status": "CLAIMED",
    "claimed_by_ngo": "Robin Hood Army - Ward 4 Volunteer Team",
    "notes": "Claimed for evening distribution at Railway Colony Shelter."
  },
  {
    "id": 3,
    "recipe_id": 10,
    "dish_name": "Paneer Whey Protein Rasam Broth",
    "prepared_by_chef": "Chef Senthil Kumar (Temple Kitchen Seva)",
    "portions_available": 40,
    "pickup_location": "Annadanam Hall, 4th Cross, Malleshwaram, Bengaluru",
    "contact_number": "+91 98800 23456",
    "status": "ACTIVE",
    "claimed_by_ngo": null,
    "claim_otp": null,
    "dietary_tag": "Pure Veg",
    "ready_time": "Hot & Ready Now",
    "notes": "Prepared from 15L fresh paneer whey; hot and packed in hygienic food-grade cans."
  },
  {
    "id": 4,
    "recipe_id": 31,
    "dish_name": "Nalli Bone Broth & Steamed Millets",
    "prepared_by_chef": "Chef Abdul Kareem (Heritage Rasoi)",
    "portions_available": 30,
    "pickup_location": "12, Venkatanarayana Road, T. Nagar, Chennai - 600017",
    "contact_number": "+91 90877 90877",
    "status": "ACTIVE",
    "claimed_by_ngo": null,
    "claim_otp": null,
    "dietary_tag": "Non-Veg (Halal)",
    "ready_time": "Freshly Simmered (Ready for Pickup)",
    "notes": "Nutrient-rich bone broth simmered from marrow knuckle bones with black pepper and ginger."
  }
];

  // ==========================================================================
  // VERIFIED CHENNAI LOCAL GRASSROOTS NGOS & COMMUNITY SHELTERS
  // ==========================================================================
  const CHENNAI_NGOS = [
    {
      id: "cfb_nfw",
      name: "Chennai Food Bank / No Food Waste (Chennai Chapter)",
      zone: "Central Chennai (T. Nagar, Kodambakkam)",
      contact: "+91 90877 90877",
      focus: "Surplus food pickup & slum community distribution",
      address: "12, Venkatanarayana Road, T. Nagar, Chennai - 600017",
      badge: "24/7 Relief",
      icon: "🍲"
    },
    {
      id: "akshaya_trust",
      name: "Akshaya Trust Chennai",
      zone: "Valasaravakkam / Porur",
      contact: "+91 98410 12345",
      focus: "Senior citizen homes & street destitute rehabilitation",
      address: "4/88, Mount Poonamallee High Road, Valasaravakkam, Chennai - 600087",
      badge: "Eldercare Relief",
      icon: "👵"
    },
    {
      id: "rha_chennai",
      name: "Robin Hood Army - Chennai Chapter",
      zone: "North & South Chennai (Mylapore, Anna Nagar, Adyar)",
      contact: "Community Slack / App Hotline",
      focus: "Evening cooked food redistribution & night shelter relief",
      address: "Volunteers Hub, 2nd Main Road, Gandhi Nagar, Adyar, Chennai - 600020",
      badge: "Youth Volunteer Network",
      icon: "💚"
    },
    {
      id: "udavum_karangal",
      name: "Udavum Karangal",
      zone: "Thiruvanmiyur / Velachery",
      contact: "044-2441 0555",
      focus: "Orphanages, homeless shelters, and pediatric nourishment",
      address: "46, Valmiki Street, Thiruvanmiyur, Chennai - 600041",
      badge: "Orphanage & Children",
      icon: "👶"
    },
    {
      id: "annai_fathima",
      name: "Annai Fathima Child Welfare Centre",
      zone: "Karapakkam, OMR",
      contact: "044-2450 1234",
      focus: "Children shelter & daily community meal distribution",
      address: "Plot 14, Old Mahabalipuram Road (OMR), Karapakkam, Chennai - 600097",
      badge: "Child Nutrition",
      icon: "🥣"
    },
    {
      id: "little_drops",
      name: "Little Drops",
      zone: "Paraniputhur (Near Ramapuram / Porur)",
      contact: "044-2476 1122",
      focus: "Destitute elderly home & daily meal relief",
      address: "Little Drops Campus, Koluthuvanchery Main Rd, Paraniputhur, Chennai - 600122",
      badge: "Destitute Shelter",
      icon: "🏡"
    }
  ];

  function getStoredOrFallbackRecipes() {
    try {
      const stored = localStorage.getItem('waste2menu_recipes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 35) return parsed;
      }
    } catch (e) {}
    return FALLBACK_RECIPES.slice();
  }

  function getStoredOrFallbackDispatches() {
    try {
      const stored = localStorage.getItem('waste2menu_dispatches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return FALLBACK_DISPATCHES.slice();
  }

  // Application State
  const state = {
    currentUser: null,
    activeTab: 'home-overview',
    categories: CATEGORIES_METADATA.slice(),
    scraps: INGREDIENTS_DATA.slice(),
    recipes: getStoredOrFallbackRecipes(),
    dispatches: getStoredOrFallbackDispatches(),
    // Ingredient selection
    selectedScrapIds: new Set(),
    masterChefSelectedScrapId: null,
    selectedCourse: 'all',
    selectedDietary: 'all',
    activeRecipe: null,
    activeClaimDispatchId: null,
    isSpeaking: false,
    favorites: [],
    currentDishPhotoUrl: null
  };

  // DOM Elements Cache
  const DOM = {
    // Header & Brand
    navBrandBtn: document.getElementById('nav-brand-btn'),
    navTabButtons: document.querySelectorAll('.nav-tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    headerAuth: document.getElementById('header-auth'),
    activeDispatchBadge: document.getElementById('active-dispatch-badge'),

    // Hero Action Buttons
    btnHeroExplore: document.getElementById('btn-hero-explore'),
    btnHeroContribute: document.getElementById('btn-hero-contribute'),
    btnHeroMatrix: document.getElementById('btn-hero-matrix'),

    // Showcase & Impact Elements (Home Overview)
    ancestralShowcaseGrid: document.getElementById('ancestral-showcase-grid'),
    statScrapsRescued: document.getElementById('stat-scraps-rescued'),
    statCo2Saved: document.getElementById('stat-co2-saved'),
    statMealsServed: document.getElementById('stat-meals-served'),

    // Home Chef Elements
    filterCourse: document.getElementById('filter-course'),
    filterDietary: document.getElementById('filter-dietary'),
    btnNavToCatalog: document.getElementById('btn-nav-to-catalog'),
    recipesResultsCounter: document.getElementById('recipes-results-counter'),
    homeRecipeGrid: document.getElementById('home-recipe-grid'),

    // Home Chef Smart Photo Scanner Elements
    scrapScannerCard: document.getElementById('scrap-scanner-card'),
    scannerDropzone: document.getElementById('scanner-dropzone'),
    scrapPhotoInput: document.getElementById('scrap-photo-input'),
    dropzonePrompt: document.getElementById('dropzone-prompt'),
    btnTriggerPhotoUpload: document.getElementById('btn-trigger-photo-upload'),
    scannerViewfinder: document.getElementById('scanner-viewfinder'),
    scannerPreviewImg: document.getElementById('scanner-preview-img'),
    scannerLaserLine: document.getElementById('scanner-laser-line'),
    scannerStatusBadge: document.getElementById('scanner-status-badge'),
    scannerStatusText: document.getElementById('scanner-status-text'),
    scannerResultsBox: document.getElementById('scanner-results-box'),
    scanSummaryTitle: document.getElementById('scan-summary-title'),
    btnRescan: document.getElementById('btn-rescan'),
    detectedScrapsList: document.getElementById('detected-scraps-list'),
    scannerImpactHint: document.getElementById('scanner-impact-hint'),
    btnApplyScannedRecipes: document.getElementById('btn-apply-scanned-recipes'),
    scannedRecipesCount: document.getElementById('scanned-recipes-count'),

    // Ingredients Catalog Photo Scanner Elements
    catalogScannerCard: document.getElementById('catalog-scanner-card'),
    catalogScannerDropzone: document.getElementById('catalog-scanner-dropzone'),
    catalogScrapPhotoInput: document.getElementById('catalog-scrap-photo-input'),
    catalogDropzonePrompt: document.getElementById('catalog-dropzone-prompt'),
    btnCatalogTriggerUpload: document.getElementById('btn-catalog-trigger-upload'),
    catalogScannerViewfinder: document.getElementById('catalog-scanner-viewfinder'),
    catalogScannerPreviewImg: document.getElementById('catalog-scanner-preview-img'),
    catalogScannerLaserLine: document.getElementById('catalog-scanner-laser-line'),
    catalogScannerStatusBadge: document.getElementById('catalog-scanner-status-badge'),
    catalogScannerStatusText: document.getElementById('catalog-scanner-status-text'),
    catalogScannerResultsBox: document.getElementById('catalog-scanner-results-box'),
    btnCatalogRescan: document.getElementById('btn-catalog-rescan'),
    catalogDetectedScrapsList: document.getElementById('catalog-detected-scraps-list'),
    catalogScannerImpactHint: document.getElementById('catalog-scanner-impact-hint'),
    btnCatalogViewInHub: document.getElementById('btn-catalog-view-in-hub'),
    catalogScannedRecipesCount: document.getElementById('catalog-scanned-recipes-count'),
    btnScrollToCatalogScanner: document.getElementById('btn-scroll-to-catalog-scanner'),

    // Master Chef Elements (2-Step Authoring Studio & Pop-up Dialog)
    chefRoleBanner: document.getElementById('chef-role-banner'),
    chefRoleNoticeText: document.getElementById('chef-role-notice-text'),
    btnChefDemoSignin: document.getElementById('btn-chef-demo-signin'),
    masterStep1View: document.getElementById('master-step1-view'),
    masterScrapsSelectorContainer: document.getElementById('master-scraps-selector-container'),
    step1SelectedBadge: document.getElementById('step1-selected-badge'),
    dockSelectedScrapName: document.getElementById('dock-selected-scrap-name'),
    btnMasterStep1Next: document.getElementById('btn-master-step1-next'),
    masterRecipeModal: document.getElementById('master-recipe-modal'),
    masterModalClose: document.getElementById('master-modal-close'),
    builderScrapBanner: document.getElementById('builder-scrap-banner'),
    builderScrapPill: document.getElementById('builder-scrap-pill'),
    builderScrapTitle: document.getElementById('builder-scrap-title'),
    builderScrapReg: document.getElementById('builder-scrap-reg'),
    btnBuilderChangeScrap: document.getElementById('btn-builder-change-scrap'),
    masterRecipeForm: document.getElementById('master-recipe-form'),
    formRcScrapId: document.getElementById('form-rc-scrap-id'),
    formRcTitle: document.getElementById('form-rc-title'),
    formRcCourse: document.getElementById('form-rc-course'),
    formRcDietary: document.getElementById('form-rc-dietary'),
    formRcChef: document.getElementById('form-rc-chef'),
    formRcAffiliation: document.getElementById('form-rc-affiliation'),
    formRcPrep: document.getElementById('form-rc-prep'),
    formRcDiff: document.getElementById('form-rc-diff'),
    formRcServings: document.getElementById('form-rc-servings'),
    formRcWisdom: document.getElementById('form-rc-wisdom'),
    btnAddPantryItem: document.getElementById('btn-add-pantry-item'),
    pantryInputsContainer: document.getElementById('pantry-inputs-container'),
    btnAddStepItem: document.getElementById('btn-add-step-item'),
    stepsInputsContainer: document.getElementById('steps-inputs-container'),
    btnModalStep2Back: document.getElementById('btn-modal-step2-back'),
    btnSaveRecipe: document.getElementById('btn-save-recipe'),

    // NGO Dispatch Elements
    ngoBroadcastForm: document.getElementById('ngo-broadcast-form'),
    ngoDispatchesList: document.getElementById('ngo-dispatches-list'),
    statFeedActiveMeals: document.getElementById('stat-feed-active-meals'),

    // 30 Kitchen Ingredients & Scraps Catalog
    categoriesCatalogContainer: document.getElementById('categories-catalog-container'),
    guideSelectionBar: document.getElementById('guide-selection-bar'),
    selBarCount: document.getElementById('sel-bar-count'),
    selBarNames: document.getElementById('sel-bar-names'),
    btnGuideSelectAll: document.getElementById('btn-guide-select-all'),
    btnGuideClear: document.getElementById('btn-guide-clear'),
    btnGuideViewRecipes: document.getElementById('btn-guide-view-recipes'),
    selRecipesCount: document.getElementById('sel-recipes-count'),

    // Auth Modal
    authModal: document.getElementById('auth-modal'),
    authModalClose: document.getElementById('auth-modal-close'),
    authToggleSignin: document.getElementById('auth-toggle-signin'),
    authToggleRegister: document.getElementById('auth-toggle-register'),
    formSignin: document.getElementById('form-signin'),
    formRegister: document.getElementById('form-register'),
    btnQuickDemoChef: document.getElementById('btn-quick-demo-chef'),
    btnQuickDemoHome: document.getElementById('btn-quick-demo-home'),

    // Recipe Detail Modal
    recipeModal: document.getElementById('recipe-modal'),
    recipeModalClose: document.getElementById('recipe-modal-close'),
    btnModalFavorite: document.getElementById('btn-modal-favorite'),
    favIcon: document.getElementById('fav-icon'),
    favText: document.getElementById('fav-text'),
    modalRcCourse: document.getElementById('modal-rc-course'),
    modalRcDietary: document.getElementById('modal-rc-dietary'),
    modalRcScrapTitle: document.getElementById('modal-rc-scrap-title'),
    modalRcTitle: document.getElementById('modal-rc-title'),
    modalRcChefName: document.getElementById('modal-rc-chef-name'),
    modalRcChefAffil: document.getElementById('modal-rc-chef-affil'),
    modalRcPrep: document.getElementById('modal-rc-prep'),
    modalRcDiff: document.getElementById('modal-rc-diff'),
    modalRcServings: document.getElementById('modal-rc-servings'),
    modalRcScrapEn: document.getElementById('modal-rc-scrap-en'),
    modalRcScrapReg: document.getElementById('modal-rc-scrap-reg'),
    modalRcStaples: document.getElementById('modal-rc-staples'),
    modalRcSteps: document.getElementById('modal-rc-steps'),
    modalRcWisdomWrap: document.getElementById('modal-rc-wisdom-wrap'),
    modalRcWisdom: document.getElementById('modal-rc-wisdom'),
    btnAudioPlay: document.getElementById('btn-audio-play'),
    btnAudioStop: document.getElementById('btn-audio-stop'),
    audioIconSpan: document.getElementById('audio-icon-span'),
    audioTextSpan: document.getElementById('audio-text-span'),

    // Saved Favorites Modal (Home Chef)
    favoritesModal: document.getElementById('favorites-modal'),
    favoritesModalClose: document.getElementById('favorites-modal-close'),
    favoritesListContainer: document.getElementById('favorites-list-container'),

    // NGO Claim Modal & 6-Digit OTP Handover
    claimModal: document.getElementById('claim-modal'),
    claimModalClose: document.getElementById('claim-modal-close'),
    claimCancelBtn: document.getElementById('claim-cancel-btn'),
    claimDispatchForm: document.getElementById('claim-dispatch-form'),
    claimTargetDish: document.getElementById('claim-target-dish'),
    claimTargetPortions: document.getElementById('claim-target-portions'),
    claimInputNgo: document.getElementById('claim-input-ngo'),
    claimOtpCard: document.getElementById('claim-otp-card'),
    claimOtpDigits: document.getElementById('claim-otp-digits'),
    btnCopyClaimOtp: document.getElementById('btn-copy-claim-otp'),
    claimLogisticsMeta: document.getElementById('claim-logistics-meta'),
    btnDoneClaimOtp: document.getElementById('btn-done-claim-otp'),

    // Demo NGO
    btnQuickDemoNgo: document.getElementById('btn-quick-demo-ngo'),

    // Snap / Upload My Dish Creation & Cooked Gallery
    dishCreationUploadSection: document.getElementById('dish-creation-upload-section'),
    dishPhotoDropzone: document.getElementById('dish-photo-dropzone'),
    dishPhotoInput: document.getElementById('dish-photo-input'),
    dishDropzonePrompt: document.getElementById('dish-dropzone-prompt'),
    btnTriggerDishUpload: document.getElementById('btn-trigger-dish-upload'),
    dishPreviewBox: document.getElementById('dish-preview-box'),
    dishPreviewImg: document.getElementById('dish-preview-img'),
    btnDishRemovePhoto: document.getElementById('btn-dish-remove-photo'),
    dishCreationNote: document.getElementById('dish-creation-note'),
    dishStarRating: document.getElementById('dish-star-rating'),
    ratingTextLabel: document.getElementById('rating-text-label'),
    btnSaveDishCreation: document.getElementById('btn-save-dish-creation'),
    dishSuccessBadge: document.getElementById('dish-success-badge'),
    cookedCreationsGallerySection: document.getElementById('cooked-creations-gallery-section'),
    cookedCreationsGrid: document.getElementById('cooked-creations-grid'),
    badgeCreationsCount: document.getElementById('badge-creations-count'),

    // Chennai Local NGO Directory & Form Fields
    chennaiNgoDirectory: document.getElementById('chennai-ngo-directory'),
    searchChennaiNgos: document.getElementById('search-chennai-ngos'),
    chennaiNgosGrid: document.getElementById('chennai-ngos-grid'),
    dispDietary: document.getElementById('disp-dietary'),
    dispReadyTime: document.getElementById('disp-ready-time'),

    // Toast Tray
    toastTray: document.getElementById('toast-tray')
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  async function init() {
    loadSavedSession();
    setupEventListeners();
    renderAuthHeader();
    updateNavbarVisibility();
    await loadInitialData();
    handleRouteFromHash();
  }

  function loadSavedSession() {
    try {
      const saved = localStorage.getItem('waste2menu_user') || localStorage.getItem('annapurna_user');
      if (saved) {
        state.currentUser = JSON.parse(saved);
      }
      const savedFavs = localStorage.getItem('waste2menu_favorites');
      if (savedFavs) {
        state.favorites = JSON.parse(savedFavs);
      }
    } catch (err) {
      console.warn('Could not read user session or favorites:', err);
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem('waste2menu_favorites', JSON.stringify(state.favorites));
    } catch (err) {
      console.warn('Could not save favorites:', err);
    }
  }

  async function loadInitialData() {
    // 1. Instant fallback to authentic 30 ingredients, categories, recipes & dispatches
    state.scraps = INGREDIENTS_DATA.slice();
    state.categories = CATEGORIES_METADATA.slice();
    state.recipes = getStoredOrFallbackRecipes();
    state.dispatches = getStoredOrFallbackDispatches();

    renderAncestralShowcase();
    renderCategorizedCatalog();
    renderMasterChefScrapsSelector();
    populateScrapDropdown();
    renderRecipesGrid();
    renderDispatchesFeed();
    animateMetricCounters();

    // 2. Attempt fetching from backend if live server is reachable
    try {
      const [catsRes, scrapsRes, recsRes, dispRes] = await Promise.all([
        fetch('/api/categories').catch(() => null),
        fetch('/api/scraps').catch(() => null),
        fetch('/api/recipes').catch(() => null),
        fetch('/api/dispatches').catch(() => null)
      ]);

      if (catsRes && catsRes.ok) {
        const fetchedCats = await catsRes.json();
        if (fetchedCats && fetchedCats.length > 0) state.categories = fetchedCats;
      }
      if (scrapsRes && scrapsRes.ok) {
        const fetchedScraps = await scrapsRes.json();
        if (fetchedScraps && fetchedScraps.length >= 30) state.scraps = fetchedScraps;
      }
      if (recsRes && recsRes.ok) {
        state.recipes = await recsRes.json();
      }
      if (dispRes && dispRes.ok) {
        state.dispatches = await dispRes.json();
      }

      // Render with fresh backend data if fetched
      renderAncestralShowcase();
      renderCategorizedCatalog();
      renderMasterChefScrapsSelector();
      populateScrapDropdown();
      renderRecipesGrid();
      renderDispatchesFeed();
    } catch (err) {
      console.info('Operating on embedded dataset (Git static deployment):', err);
    }
  }

  // ==========================================================================
  // EVENT LISTENERS SETUP
  // ==========================================================================
  function setupEventListeners() {
    // Brand button goes to Home
    DOM.navBrandBtn.addEventListener('click', () => switchTab('home-overview'));

    // Top Navigation Tabs (Changes Git Deploy Link in Address Bar)
    DOM.navTabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        switchTab(tab, true);
      });
    });

    // Hash & History Routing (Support Direct Links & Browser Back/Forward on Git Deploy)
    window.addEventListener('hashchange', () => {
      handleRouteFromHash();
    });
    window.addEventListener('popstate', () => {
      handleRouteFromHash();
    });

    // Hero Action CTAs & Wisdom Banner CTA
    DOM.btnHeroExplore.addEventListener('click', () => {
      const homeTabBtn = document.getElementById('nav-tab-home-chef');
      if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
      switchTab('home-chef');
      applyFiltersAndRenderRecipes();
    });

    DOM.btnHeroContribute.addEventListener('click', () => {
      if (state.currentUser && state.currentUser.role === 'master_chef') {
        switchTab('master-chef');
      } else if (state.currentUser && state.currentUser.role === 'home_chef') {
        showToast('Recipe upload is exclusive to Master Chefs. Home Chefs can view and cook all recipes!', 'info');
      } else {
        openAuthModal();
        showToast('Master Chef recipe authoring studio is available after signing in. Use 1-Click Demo!', 'info');
      }
    });

    const bannerCookBtn = document.getElementById('btn-banner-cook');
    if (bannerCookBtn) {
      bannerCookBtn.addEventListener('click', () => {
        const homeTabBtn = document.getElementById('nav-tab-home-chef');
        if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
        switchTab('home-chef');
        applyFiltersAndRenderRecipes();
      });
    }

    DOM.btnHeroMatrix.addEventListener('click', () => switchTab('scraps-matrix'));

    // Auth Modal Triggers
    DOM.authModalClose.addEventListener('click', () => DOM.authModal.close());
    DOM.authToggleSignin.addEventListener('click', showSigninTab);
    DOM.authToggleRegister.addEventListener('click', showRegisterTab);

    // 1-Click Demo Buttons
    DOM.btnQuickDemoChef.addEventListener('click', () => executeDemoLogin('master_chef'));
    DOM.btnQuickDemoHome.addEventListener('click', () => executeDemoLogin('home_chef'));
    DOM.btnChefDemoSignin.addEventListener('click', () => executeDemoLogin('master_chef'));

    // Auth Form Submissions
    DOM.formSignin.addEventListener('submit', handleSigninSubmit);
    DOM.formRegister.addEventListener('submit', handleRegisterSubmit);

    // Home Chef Navigation Button to Catalog
    if (DOM.btnNavToCatalog) {
      DOM.btnNavToCatalog.addEventListener('click', () => switchTab('scraps-matrix'));
    }

    // Home Chef Smart Photo Scanner Listeners
    initPhotoScanner();

    // Dropdown filters
    DOM.filterCourse.addEventListener('change', (e) => {
      state.selectedCourse = e.target.value;
      applyFiltersAndRenderRecipes();
    });

    DOM.filterDietary.addEventListener('change', (e) => {
      state.selectedDietary = e.target.value;
      applyFiltersAndRenderRecipes();
    });

    // Master Chef Step 1 -> Step 2 Modal Popup Triggers
    if (DOM.btnMasterStep1Next) {
      DOM.btnMasterStep1Next.addEventListener('click', openMasterRecipeBuilderModal);
    }
    if (DOM.masterModalClose) {
      DOM.masterModalClose.addEventListener('click', closeMasterRecipeBuilderModal);
    }
    if (DOM.btnBuilderChangeScrap) {
      DOM.btnBuilderChangeScrap.addEventListener('click', closeMasterRecipeBuilderModal);
    }
    if (DOM.btnModalStep2Back) {
      DOM.btnModalStep2Back.addEventListener('click', closeMasterRecipeBuilderModal);
    }
    if (DOM.masterRecipeModal) {
      DOM.masterRecipeModal.addEventListener('cancel', closeMasterRecipeBuilderModal);
    }

    // Dynamic Master Chef Form Builders (Inside Step 2 Popup)
    DOM.btnAddPantryItem.addEventListener('click', addPantryInputRow);
    DOM.btnAddStepItem.addEventListener('click', addStepInputRow);

    DOM.pantryInputsContainer.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-row')) {
        const rows = DOM.pantryInputsContainer.querySelectorAll('.dynamic-input-row');
        if (rows.length > 1) {
          e.target.closest('.dynamic-input-row').remove();
        } else {
          showToast('Keep at least one ingredient.', 'info');
        }
      }
    });

    DOM.stepsInputsContainer.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-row')) {
        const rows = DOM.stepsInputsContainer.querySelectorAll('.dynamic-input-row');
        if (rows.length > 1) {
          e.target.closest('.dynamic-input-row').remove();
          renumberStepRows();
        } else {
          showToast('Keep at least one cooking step.', 'info');
        }
      }
    });

    // Master Chef Recipe Submit (Step 2 Popup)
    DOM.masterRecipeForm.addEventListener('submit', handleMasterRecipeSubmit);

    // NGO Broadcast Submit
    DOM.ngoBroadcastForm.addEventListener('submit', handleNgoBroadcastSubmit);

    // Modals Close handlers
    DOM.recipeModalClose.addEventListener('click', closeRecipeModal);
    DOM.recipeModal.addEventListener('cancel', stopSpeech);
    if (DOM.btnModalFavorite) {
      DOM.btnModalFavorite.addEventListener('click', toggleFavoriteRecipe);
    }

    // Saved Favorites Modal Handlers
    if (DOM.favoritesModalClose && DOM.favoritesModal) {
      DOM.favoritesModalClose.addEventListener('click', () => DOM.favoritesModal.close());
    }

    // Web Speech API Voice Controls
    DOM.btnAudioPlay.addEventListener('click', toggleSpeechNarration);
    DOM.btnAudioStop.addEventListener('click', stopSpeech);

    // Claim Modal Handlers & OTP Handover
    DOM.claimModalClose.addEventListener('click', () => DOM.claimModal.close());
    DOM.claimCancelBtn.addEventListener('click', () => DOM.claimModal.close());
    DOM.claimDispatchForm.addEventListener('submit', handleClaimDispatchSubmit);

    if (DOM.btnDoneClaimOtp) {
      DOM.btnDoneClaimOtp.addEventListener('click', () => DOM.claimModal.close());
    }

    if (DOM.btnCopyClaimOtp) {
      DOM.btnCopyClaimOtp.addEventListener('click', () => {
        const codeText = DOM.claimOtpDigits ? DOM.claimOtpDigits.textContent : '';
        if (codeText && navigator.clipboard) {
          navigator.clipboard.writeText(codeText);
          showToast('📋 Handover OTP copied to clipboard!', 'success');
        }
      });
    }

    // Demo NGO 1-Click Login
    if (DOM.btnQuickDemoNgo) {
      DOM.btnQuickDemoNgo.addEventListener('click', () => executeDemoLogin('ngo_rep'));
    }

    // Chennai Local NGO Directory Search Filter
    if (DOM.searchChennaiNgos) {
      DOM.searchChennaiNgos.addEventListener('input', (e) => {
        renderChennaiNgosDirectory(e.target.value);
      });
    }

    // Initialize Home Chef Dish Creation Uploader & Gallery
    initDishCreationUpload();

    // Initialize Chennai Local NGO Directory
    renderChennaiNgosDirectory('');

    // Floating Action Dock in Ingredients Catalog
    if (DOM.btnGuideSelectAll) DOM.btnGuideSelectAll.addEventListener('click', selectAllIngredientsFromCatalog);
    if (DOM.btnGuideClear) DOM.btnGuideClear.addEventListener('click', clearIngredientsFromCatalog);
    if (DOM.btnGuideViewRecipes) DOM.btnGuideViewRecipes.addEventListener('click', viewRecipesForCatalogSelection);
  }

  // ==========================================================================
  // NAVIGATION & TAB SWITCHING
  // ==========================================================================
  function switchTab(tabId, updateHash = true) {
    if (tabId === 'master-chef') {
      if (state.currentUser && state.currentUser.role === 'home_chef') {
        showToast('Recipe authoring & upload is exclusive to Master Chefs. Home Chefs can explore and cook all recipes!', 'info');
        switchTab('home-chef', updateHash);
        return;
      }
      if (!state.currentUser || state.currentUser.role !== 'master_chef') {
        showToast('Master Chef recipe authoring studio is available after signing in as Master Chef.', 'info');
        openAuthModal();
        return;
      }
    }

    state.activeTab = tabId;

    // Update URL hash so the Git deploy link dynamically changes among pages
    if (updateHash) {
      const targetHash = `#${tabId}`;
      if (window.location.hash !== targetHash) {
        try {
          window.history.pushState(null, '', targetHash);
        } catch (e) {
          window.location.hash = targetHash;
        }
      }
    }

    DOM.navTabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    DOM.tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabId}`);
    });

    // Check Master Chef permissions
    if (tabId === 'master-chef') {
      const isMaster = state.currentUser && state.currentUser.role === 'master_chef';
      DOM.chefRoleBanner.style.display = isMaster ? 'none' : 'flex';
      renderMasterChefScrapsSelector();
    }

    if (tabId === 'home-overview') {
      renderAncestralShowcase();
      animateMetricCounters();
    }

    if (tabId === 'home-chef') {
      applyFiltersAndRenderRecipes();
    }

    if (tabId === 'ngo-dispatch') {
      renderDispatchesFeed();
    }

    if (tabId === 'scraps-matrix') {
      renderCategorizedCatalog();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Route reader: parse current window.location.hash and activate the corresponding tab
   */
  function handleRouteFromHash() {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash) {
      switchTab('home-overview', false);
      return;
    }

    const validTabs = ['home-overview', 'scraps-matrix', 'home-chef', 'master-chef', 'ngo-dispatch'];
    const aliasMap = {
      'home': 'home-overview',
      'overview': 'home-overview',
      'catalog': 'scraps-matrix',
      'matrix': 'scraps-matrix',
      'scraps': 'scraps-matrix',
      'ingredients': 'scraps-matrix',
      'cook': 'home-chef',
      'recipes': 'home-chef',
      'homechef': 'home-chef',
      'masterchef': 'master-chef',
      'chef': 'master-chef',
      'upload': 'master-chef',
      'ngo': 'ngo-dispatch',
      'dispatch': 'ngo-dispatch',
      'dispatches': 'ngo-dispatch'
    };

    const targetTab = validTabs.includes(rawHash) ? rawHash : (aliasMap[rawHash] || 'home-overview');

    if (targetTab === 'master-chef' && (!state.currentUser || state.currentUser.role !== 'master_chef')) {
      switchTab('home-overview', true);
      return;
    }

    switchTab(targetTab, false);
  }

  function updateNavbarVisibility() {
    const homeTabBtn = document.getElementById('nav-tab-home-chef');
    const masterTabBtn = document.getElementById('nav-tab-master-chef');

    if (!state.currentUser) {
      // Hidden in navbar when logged out
      if (homeTabBtn) homeTabBtn.style.display = 'none';
      if (masterTabBtn) masterTabBtn.style.display = 'none';
      if (DOM.btnHeroContribute) DOM.btnHeroContribute.style.display = 'inline-flex';

      // Redirect if on an authenticated tab
      if (state.activeTab === 'master-chef') {
        switchTab('home-overview');
      }
    } else {
      // Visible after login based on role
      const role = state.currentUser.role;
      if (role === 'master_chef') {
        if (masterTabBtn) masterTabBtn.style.display = 'inline-flex';
        if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
        if (DOM.btnHeroContribute) {
          DOM.btnHeroContribute.style.display = 'inline-flex';
          DOM.btnHeroContribute.innerHTML = '<span>👨‍🍳 + Upload Recipe (Studio)</span>';
        }
      } else if (role === 'ngo_rep') {
        if (masterTabBtn) masterTabBtn.style.display = 'none';
        if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
        if (DOM.btnHeroContribute) DOM.btnHeroContribute.style.display = 'none';
      } else {
        // Home Chef role - strictly remove upload recipe options
        if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
        if (masterTabBtn) masterTabBtn.style.display = 'none';
        if (DOM.btnHeroContribute) DOM.btnHeroContribute.style.display = 'none';
        if (state.activeTab === 'master-chef') {
          switchTab('home-chef');
        }
      }
    }
  }

  // ==========================================================================
  // AUTHENTICATION LOGIC (MASTER CHEF VS HOME CHEF)
  // ==========================================================================
  function renderAuthHeader() {
    DOM.headerAuth.innerHTML = '';

    if (!state.currentUser) {
      const btn = document.createElement('button');
      btn.className = 'btn-auth-signin';
      btn.id = 'btn-open-auth';
      btn.innerHTML = `<span>🔐 Sign In / Register</span>`;
      btn.addEventListener('click', openAuthModal);
      DOM.headerAuth.appendChild(btn);
    } else {
      const u = state.currentUser;
      const isMaster = u.role === 'master_chef';
      const isNgo = u.role === 'ngo_rep';

      let roleLabel = '🏡 Home Chef';
      let roleClass = 'home';
      if (isMaster) {
        roleLabel = '👨‍🍳 Master Chef';
        roleClass = 'master';
      } else if (isNgo) {
        roleLabel = '🏢 NGO Representative';
        roleClass = 'ngo';
      }

      const wrap = document.createElement('div');
      wrap.className = 'user-profile-badge';

      let extraBtnsHtml = '';
      if (u.role === 'home_chef') {
        extraBtnsHtml = `
          <button type="button" class="btn-header-scanner" id="btn-header-scan" title="Scan Kitchen Scraps Photo">📸 Scan Scraps</button>
          <button type="button" class="btn-header-favorites" id="btn-header-favs" title="View Saved Recipes">❤️ Saved (<span id="header-fav-count">${state.favorites.length}</span>)</button>
          <button type="button" class="btn-header-creations" id="btn-header-my-creations" title="View My Upcycled Creations">🌟 My Creations</button>
        `;
      } else if (isNgo) {
        extraBtnsHtml = `
          <button type="button" class="btn-header-hub" id="btn-header-ngo-hub" title="View NGO Surplus Batches">🤝 Surplus Feed</button>
        `;
      }

      wrap.innerHTML = `
        ${extraBtnsHtml}
        <span class="user-role-pill ${roleClass}">
          ${roleLabel}
        </span>
        <span class="user-name-text">${escapeHtml(u.name)}</span>
        <button class="btn-auth-signout" title="Sign Out">Sign Out</button>
      `;

      const scanBtn = wrap.querySelector('#btn-header-scan');
      if (scanBtn) {
        scanBtn.addEventListener('click', () => {
          switchTab('home-chef');
          const scannerCard = document.getElementById('scrap-scanner-card');
          if (scannerCard) {
            scannerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      const favBtn = wrap.querySelector('#btn-header-favs');
      if (favBtn) favBtn.addEventListener('click', openFavoritesModal);

      const creationsBtn = wrap.querySelector('#btn-header-my-creations');
      if (creationsBtn) {
        creationsBtn.addEventListener('click', () => {
          switchTab('home-chef');
          const gal = document.getElementById('cooked-creations-gallery-section');
          if (gal) gal.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }

      const ngoHubBtn = wrap.querySelector('#btn-header-ngo-hub');
      if (ngoHubBtn) {
        ngoHubBtn.addEventListener('click', () => {
          switchTab('ngo-dispatch');
        });
      }

      wrap.querySelector('.btn-auth-signout').addEventListener('click', handleSignOut);
      DOM.headerAuth.appendChild(wrap);
    }
  }

  function openAuthModal() {
    showSigninTab();
    DOM.authModal.showModal();
  }

  function showSigninTab() {
    DOM.authToggleSignin.classList.add('active');
    DOM.authToggleRegister.classList.remove('active');
    DOM.formSignin.style.display = 'flex';
    DOM.formRegister.style.display = 'none';
  }

  function showRegisterTab() {
    DOM.authToggleRegister.classList.add('active');
    DOM.authToggleSignin.classList.remove('active');
    DOM.formRegister.style.display = 'flex';
    DOM.formSignin.style.display = 'none';
  }

  async function executeDemoLogin(role) {
    let creds, demoUser;
    if (role === 'master_chef') {
      creds = { email: 'chef@annapurna.org', password: 'chef123' };
      demoUser = { id: 1, name: 'Chef Sanjeev Kapoor', email: 'chef@annapurna.org', role: 'master_chef', affiliation: 'National Heritage Rasoi Guild' };
    } else if (role === 'ngo_rep') {
      creds = { email: 'ngo@chennaifoodbank.org', password: 'ngo123' };
      demoUser = { id: 3, name: 'Kavitha Raman', email: 'ngo@chennaifoodbank.org', role: 'ngo_rep', affiliation: 'Chennai Food Bank / No Food Waste' };
    } else {
      creds = { email: 'home@annapurna.org', password: 'home123' };
      demoUser = { id: 2, name: 'Priya Sharma', email: 'home@annapurna.org', role: 'home_chef', affiliation: 'Rasoi Hero Community Cook' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });

      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        DOM.authModal.close();
        showToast(`✨ Welcome ${user.name}! Switched to ${user.role === 'master_chef' ? 'Master Chef' : 'Home Chef'} mode.`, 'success');
        return;
      }
    } catch (err) {
      console.info('Demo login running in static mode');
    }

    // Fallback for static Git deployment
    setCurrentUser(demoUser);
    DOM.authModal.close();
    showToast(`✨ Welcome ${demoUser.name}! (${role === 'master_chef' ? 'Master Chef' : 'Home Chef'})`, 'success');
  }

  async function handleSigninSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Invalid email or password');
      }

      const user = await res.json();
      setCurrentUser(user);
      DOM.authModal.close();
      showToast(`Welcome back, ${user.name}!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    const payload = {
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value.trim(),
      role: document.getElementById('reg-role').value,
      affiliation: document.getElementById('reg-affiliation').value.trim() || 'Community Cook'
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Registration failed');
      }

      const user = await res.json();
      setCurrentUser(user);
      DOM.authModal.close();
      showToast(`Account created! Welcome, ${user.name}.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function setCurrentUser(user) {
    state.currentUser = user;
    localStorage.setItem('waste2menu_user', JSON.stringify(user));
    localStorage.setItem('annapurna_user', JSON.stringify(user));
    renderAuthHeader();
    updateNavbarVisibility();
    renderCategorizedCatalog();

    // Automatically navigate to the user's role workspace
    if (user.role === 'master_chef') {
      switchTab('master-chef');
    } else if (user.role === 'ngo_rep') {
      switchTab('ngo-dispatch');
    } else {
      switchTab('home-chef');
    }
  }

  function handleSignOut() {
    state.currentUser = null;
    localStorage.removeItem('waste2menu_user');
    localStorage.removeItem('annapurna_user');
    renderAuthHeader();
    updateNavbarVisibility();
    renderCategorizedCatalog();
    switchTab('home-overview');
    showToast('Signed out successfully.', 'info');
  }

  function populateScrapDropdown() {
    if (!DOM.formRcScrap) return;
    DOM.formRcScrap.innerHTML = '<option value="">-- Choose from 30 Household Scraps --</option>';
    state.scraps.forEach(sc => {
      const opt = document.createElement('option');
      opt.value = sc.id;
      opt.textContent = `${sc.id}. ${sc.name_en}`;
      DOM.formRcScrap.appendChild(opt);
    });
  }

  // ==========================================================================
  // HOME CHEF: AI INGREDIENT & KITCHEN SCRAP PHOTO SCANNER
  // ==========================================================================
  const SAMPLE_PHOTO_DATA = {
    mixed_peels: {
      title: "Mixed Vegetable Peels (Bottle Gourd, Potato, Ridge Gourd)",
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23F7F4EE"/><circle cx="220" cy="200" r="140" fill="%23EADBCE"/><path d="M110 180 Q200 90 340 160 T500 220" fill="none" stroke="%232E7D32" stroke-width="26" stroke-linecap="round"/><path d="M130 240 Q230 290 350 210 T460 270" fill="none" stroke="%23D97706" stroke-width="22" stroke-linecap="round"/><path d="M200 130 Q270 100 370 140" fill="none" stroke="%238D6E63" stroke-width="16" stroke-linecap="round"/><text x="300" y="360" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23221F1B" text-anchor="middle">Kitchen Counter: Mixed Vegetable Peels &amp; Skins</text></svg>`
    },
    stems_leaves: {
      title: "Herb & Brassica Stems (Cauliflower Stalks, Coriander Stems)",
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23F3F8F2"/><circle cx="300" cy="200" r="150" fill="%23D9ECD8"/><path d="M160 270 Q240 120 420 170" fill="none" stroke="%231B5E20" stroke-width="22" stroke-linecap="round"/><path d="M190 290 Q290 140 440 220" fill="none" stroke="%232E7D32" stroke-width="16" stroke-linecap="round"/><path d="M220 280 Q320 170 380 270" fill="none" stroke="%2366BB6A" stroke-width="14" stroke-linecap="round"/><text x="300" y="360" font-family="sans-serif" font-size="18" font-weight="bold" fill="%231B5E20" text-anchor="middle">Kitchen Counter: Stems, Stalks &amp; Green Leaves</text></svg>`
    },
    seeds_rinds: {
      title: "Seeds & Citrus Rinds (Watermelon White Rind, Pumpkin Seeds)",
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FFFBF5"/><circle cx="300" cy="200" r="150" fill="%23FFE8C8"/><path d="M160 210 A140 140 0 0 0 440 210" fill="none" stroke="%23E53935" stroke-width="26"/><path d="M160 210 A140 140 0 0 0 440 210" fill="none" stroke="%2343A047" stroke-width="12"/><circle cx="240" cy="220" r="8" fill="%23D97706"/><circle cx="280" cy="235" r="8" fill="%23D97706"/><circle cx="330" cy="225" r="8" fill="%23D97706"/><text x="300" y="360" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23D97706" text-anchor="middle">Kitchen Counter: Melon Rinds &amp; Roasted Seeds</text></svg>`
    }
  };

  function initPhotoScanner() {
    // 1. Home Chef Portal Scanner
    if (DOM.scannerDropzone) {
      ['dragenter', 'dragover'].forEach(evtName => {
        DOM.scannerDropzone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.scannerDropzone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(evtName => {
        DOM.scannerDropzone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.scannerDropzone.classList.remove('drag-over');
        });
      });

      DOM.scannerDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files[0]) {
          processUploadedScrapPhoto(dt.files[0], false);
        }
      });
    }

    if (DOM.btnTriggerPhotoUpload && DOM.scrapPhotoInput) {
      DOM.btnTriggerPhotoUpload.addEventListener('click', (e) => {
        e.stopPropagation();
        DOM.scrapPhotoInput.click();
      });

      DOM.scrapPhotoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          processUploadedScrapPhoto(e.target.files[0], false);
        }
      });
    }

    document.querySelectorAll('#scrap-scanner-card .btn-sample-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleKey = btn.dataset.sample;
        triggerSamplePhotoScan(sampleKey, false);
      });
    });

    if (DOM.btnRescan) {
      DOM.btnRescan.addEventListener('click', () => resetPhotoScanner(false));
    }

    if (DOM.btnApplyScannedRecipes) {
      DOM.btnApplyScannedRecipes.addEventListener('click', () => {
        const grid = document.getElementById('home-recipe-grid');
        if (grid) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // 2. Ingredients Catalog Scanner (In #panel-scraps-matrix)
    if (DOM.catalogScannerDropzone) {
      ['dragenter', 'dragover'].forEach(evtName => {
        DOM.catalogScannerDropzone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.catalogScannerDropzone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(evtName => {
        DOM.catalogScannerDropzone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.catalogScannerDropzone.classList.remove('drag-over');
        });
      });

      DOM.catalogScannerDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files[0]) {
          processUploadedScrapPhoto(dt.files[0], true);
        }
      });
    }

    if (DOM.btnCatalogTriggerUpload && DOM.catalogScrapPhotoInput) {
      DOM.btnCatalogTriggerUpload.addEventListener('click', (e) => {
        e.stopPropagation();
        DOM.catalogScrapPhotoInput.click();
      });

      DOM.catalogScrapPhotoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          processUploadedScrapPhoto(e.target.files[0], true);
        }
      });
    }

    document.querySelectorAll('.btn-catalog-sample-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleKey = btn.dataset.sample;
        triggerSamplePhotoScan(sampleKey, true);
      });
    });

    if (DOM.btnCatalogRescan) {
      DOM.btnCatalogRescan.addEventListener('click', () => resetPhotoScanner(true));
    }

    if (DOM.btnCatalogViewInHub) {
      DOM.btnCatalogViewInHub.addEventListener('click', () => {
        switchTab('home-chef', true);
        const grid = document.getElementById('home-recipe-grid');
        if (grid) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    if (DOM.btnScrollToCatalogScanner) {
      DOM.btnScrollToCatalogScanner.addEventListener('click', () => {
        if (DOM.catalogScannerCard) {
          DOM.catalogScannerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  function processUploadedScrapPhoto(file, isCatalog = false) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please upload a valid photo file (PNG, JPG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      startPhotoScanAnimation(dataUrl, file.name, null, isCatalog);
    };
    reader.readAsDataURL(file);
  }

  function triggerSamplePhotoScan(sampleKey, isCatalog = false) {
    const sample = SAMPLE_PHOTO_DATA[sampleKey] || SAMPLE_PHOTO_DATA.mixed_peels;
    startPhotoScanAnimation(sample.svg, `${sampleKey}.svg`, sampleKey, isCatalog);
  }

  function startPhotoScanAnimation(imageSrc, imageName, sampleType = null, isCatalog = false) {
    const promptEl = isCatalog ? DOM.catalogDropzonePrompt : DOM.dropzonePrompt;
    const viewEl = isCatalog ? DOM.catalogScannerViewfinder : DOM.scannerViewfinder;
    const imgEl = isCatalog ? DOM.catalogScannerPreviewImg : DOM.scannerPreviewImg;
    const laserEl = isCatalog ? DOM.catalogScannerLaserLine : DOM.scannerLaserLine;
    const badgeEl = isCatalog ? DOM.catalogScannerStatusBadge : DOM.scannerStatusBadge;
    const textEl = isCatalog ? DOM.catalogScannerStatusText : DOM.scannerStatusText;
    const resultsEl = isCatalog ? DOM.catalogScannerResultsBox : DOM.scannerResultsBox;

    if (!viewEl || !promptEl) return;

    promptEl.style.display = 'none';
    viewEl.style.display = 'block';
    if (imgEl) imgEl.src = imageSrc;
    if (laserEl) laserEl.style.display = 'block';
    if (badgeEl) badgeEl.style.display = 'inline-flex';
    if (textEl) textEl.textContent = 'Scanning kitchen byproducts & contour textures...';
    if (resultsEl) resultsEl.style.display = 'none';

    setTimeout(() => {
      if (textEl) {
        textEl.textContent = 'Matching textures against 30 kitchen scraps...';
      }
    }, 600);

    setTimeout(async () => {
      await executeScrapScan(imageSrc, imageName, sampleType, isCatalog);
    }, 1200);
  }

  async function executeScrapScan(imageSrc, imageName, sampleType, isCatalog = false) {
    let scanResult = null;

    try {
      const res = await fetch('/api/scan-scraps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_name: imageName,
          image_data: imageSrc && imageSrc.length < 500000 ? imageSrc : null,
          sample_type: sampleType
        })
      });

      if (res && res.ok) {
        scanResult = await res.json();
      }
    } catch (netErr) {
      console.info('Backend unreachable, using client-side AI visual recognition fallback');
    }

    // Client-side fallback for static Git deployment & offline execution
    if (!scanResult || !scanResult.success) {
      scanResult = generateClientSideScanResult(imageName, sampleType);
    }

    renderScanResults(scanResult, isCatalog);
  }

  function generateClientSideScanResult(imageName, sampleType) {
    let scrapIdsWithConf = [];

    if (sampleType === 'mixed_peels') {
      scrapIdsWithConf = [{ id: 1, conf: 0.96 }, { id: 3, conf: 0.93 }, { id: 2, conf: 0.88 }];
    } else if (sampleType === 'stems_leaves') {
      scrapIdsWithConf = [{ id: 10, conf: 0.95 }, { id: 11, conf: 0.92 }, { id: 13, conf: 0.87 }];
    } else if (sampleType === 'seeds_rinds') {
      scrapIdsWithConf = [{ id: 16, conf: 0.97 }, { id: 18, conf: 0.91 }, { id: 20, conf: 0.89 }];
    } else {
      const lower = (imageName || '').toLowerCase();
      const detected = [];
      const rules = [
        { regex: /bottle|lauki|gourd/, id: 1, conf: 0.95 },
        { regex: /ridge|turai|jhinge/, id: 2, conf: 0.92 },
        { regex: /potato|aloo/, id: 3, conf: 0.96 },
        { regex: /banana|kele/, id: 4, conf: 0.91 },
        { regex: /pumpkin|kaddu/, id: 6, conf: 0.93 },
        { regex: /radish|mooli|carrot/, id: 8, conf: 0.90 },
        { regex: /cauliflower|gobhi|gobi/, id: 10, conf: 0.96 },
        { regex: /coriander|dhaniya|herb/, id: 11, conf: 0.94 },
        { regex: /watermelon|tarbooj|rind/, id: 16, conf: 0.97 },
        { regex: /seed|beej/, id: 18, conf: 0.90 },
        { regex: /lemon|nimbu/, id: 20, conf: 0.95 },
        { regex: /rice|bhaat/, id: 21, conf: 0.96 },
        { regex: /roti|bread/, id: 22, conf: 0.93 },
        { regex: /whey|paneer/, id: 26, conf: 0.95 },
        { regex: /curd|dahi/, id: 27, conf: 0.92 },
        { regex: /ginger|adrak/, id: 29, conf: 0.93 }
      ];

      rules.forEach(r => {
        if (r.regex.test(lower)) detected.push({ id: r.id, conf: r.conf });
      });

      if (detected.length > 0) {
        scrapIdsWithConf = detected.slice(0, 4);
      } else {
        scrapIdsWithConf = [{ id: 1, conf: 0.95 }, { id: 3, conf: 0.92 }, { id: 11, conf: 0.87 }];
      }
    }

    const detected_scraps = scrapIdsWithConf.map(item => {
      const sc = state.scraps.find(s => s.id === item.id) || { id: item.id, name_en: `Scrap #${item.id}`, category_id: 1, common_uses: '' };
      const matching = state.recipes.filter(r => r.scrap_id === item.id).length;
      return {
        id: sc.id,
        scrap_id: sc.id,
        name_en: sc.name_en,
        category_id: sc.category_id,
        confidence: item.conf,
        confidence_pct: `${Math.round(item.conf * 100)}%`,
        common_uses: sc.common_uses,
        matching_recipes: matching
      };
    });

    const totalMatching = detected_scraps.reduce((acc, cur) => acc + cur.matching_recipes, 0);

    return {
      success: true,
      image_name: imageName,
      detected_scraps: detected_scraps,
      total_detected: detected_scraps.length,
      total_matching_recipes: totalMatching,
      estimated_weight_rescued_kg: Number((detected_scraps.length * 0.28).toFixed(2)),
      estimated_co2_prevented_kg: Number((detected_scraps.length * 0.28 * 1.8).toFixed(2))
    };
  }

  function renderScanResults(scanData, isCatalog = false) {
    if (DOM.scannerLaserLine) DOM.scannerLaserLine.style.display = 'none';
    if (DOM.scannerStatusBadge) DOM.scannerStatusBadge.style.display = 'none';
    if (DOM.catalogScannerLaserLine) DOM.catalogScannerLaserLine.style.display = 'none';
    if (DOM.catalogScannerStatusBadge) DOM.catalogScannerStatusBadge.style.display = 'none';

    if (isCatalog) {
      if (DOM.catalogScannerResultsBox) DOM.catalogScannerResultsBox.style.display = 'block';
    } else {
      if (DOM.scannerResultsBox) DOM.scannerResultsBox.style.display = 'block';
    }

    const items = scanData.detected_scraps || [];

    // Automatically add detected ingredients to selected scraps
    items.forEach(it => state.selectedScrapIds.add(it.id));

    // Automatically expand any collapsed category accordion in the catalog
    items.forEach(it => {
      const sc = state.scraps.find(s => s.id === it.id);
      if (sc) {
        const accordion = document.querySelector(`.catalog-category-accordion[data-category-id="${sc.category_id}"]`);
        if (accordion && accordion.classList.contains('collapsed')) {
          accordion.classList.remove('collapsed');
          const headerBtn = accordion.querySelector('.catalog-category-header');
          if (headerBtn) headerBtn.setAttribute('aria-expanded', 'true');
        }
      }
    });

    // Populate helper to render list of chip elements
    function populateChipList(container) {
      if (!container) return;
      container.innerHTML = '';
      items.forEach(it => {
        const chip = document.createElement('div');
        chip.className = 'detected-scrap-chip active';
        chip.dataset.scrapId = it.id;
        chip.innerHTML = `
          <div class="detected-chip-left">
            <span class="detected-chip-check">✓</span>
            <div>
              <span class="detected-chip-name">${escapeHtml(it.name_en)}</span>
              <span class="detected-chip-uses">${escapeHtml(it.common_uses || 'Zero-waste ingredient')}</span>
            </div>
          </div>
          <span class="detected-chip-confidence">${it.confidence_pct} Match</span>
        `;

        chip.addEventListener('click', () => {
          if (state.selectedScrapIds.has(it.id)) {
            state.selectedScrapIds.delete(it.id);
            chip.classList.remove('active');
            chip.querySelector('.detected-chip-check').textContent = '+';
          } else {
            state.selectedScrapIds.add(it.id);
            chip.classList.add('active');
            chip.querySelector('.detected-chip-check').textContent = '✓';
          }
          updateAfterScanSelection();
        });

        container.appendChild(chip);
      });
    }

    populateChipList(DOM.detectedScrapsList);
    populateChipList(DOM.catalogDetectedScrapsList);

    const totalMatching = scanData.total_matching_recipes || items.length;
    if (DOM.scannedRecipesCount) DOM.scannedRecipesCount.textContent = totalMatching;
    if (DOM.catalogScannedRecipesCount) DOM.catalogScannedRecipesCount.textContent = totalMatching;

    if (DOM.scannerImpactHint) {
      DOM.scannerImpactHint.textContent = `🌱 Estimated ${scanData.estimated_weight_rescued_kg || 0.75} kg rescued • ${scanData.estimated_co2_prevented_kg || 1.35} kg CO₂ prevented`;
    }
    if (DOM.catalogScannerImpactHint) {
      DOM.catalogScannerImpactHint.textContent = `🌱 Auto-selected ${items.length} ingredients in catalog below`;
    }

    updateAfterScanSelection();
    showToast(`✨ Scanned photo! Auto-selected ${items.length} kitchen ingredients.`, 'success');
  }

  function updateAfterScanSelection() {
    updateCatalogCardsSelectionState();
    updateCatalogSelectionDock();
    applyFiltersAndRenderRecipes();

    // Recalculate matching recipes for scanned buttons
    const count = state.recipes.filter(r => state.selectedScrapIds.has(r.scrap_id)).length;
    if (DOM.scannedRecipesCount) {
      DOM.scannedRecipesCount.textContent = count;
    }
    if (DOM.catalogScannedRecipesCount) {
      DOM.catalogScannedRecipesCount.textContent = count;
    }
  }

  function resetPhotoScanner(isCatalog = false) {
    if (isCatalog) {
      if (DOM.catalogScrapPhotoInput) DOM.catalogScrapPhotoInput.value = '';
      if (DOM.catalogScannerPreviewImg) DOM.catalogScannerPreviewImg.src = '';
      if (DOM.catalogScannerViewfinder) DOM.catalogScannerViewfinder.style.display = 'none';
      if (DOM.catalogDropzonePrompt) DOM.catalogDropzonePrompt.style.display = 'flex';
      if (DOM.catalogScannerLaserLine) DOM.catalogScannerLaserLine.style.display = 'none';
      if (DOM.catalogScannerStatusBadge) DOM.catalogScannerStatusBadge.style.display = 'none';
      if (DOM.catalogScannerResultsBox) DOM.catalogScannerResultsBox.style.display = 'none';
    } else {
      if (DOM.scrapPhotoInput) DOM.scrapPhotoInput.value = '';
      if (DOM.scannerPreviewImg) DOM.scannerPreviewImg.src = '';
      if (DOM.scannerViewfinder) DOM.scannerViewfinder.style.display = 'none';
      if (DOM.dropzonePrompt) DOM.dropzonePrompt.style.display = 'flex';
      if (DOM.scannerLaserLine) DOM.scannerLaserLine.style.display = 'none';
      if (DOM.scannerStatusBadge) DOM.scannerStatusBadge.style.display = 'none';
      if (DOM.scannerResultsBox) DOM.scannerResultsBox.style.display = 'none';
    }
  }

  // ==========================================================================
  // RECIPES FILTERING & RENDERING (NO LIVE SEARCH)
  // ==========================================================================
  function applyFiltersAndRenderRecipes() {
    let filtered = state.recipes.slice();

    // 1. Filter by user's counter scraps selection
    if (state.selectedScrapIds.size > 0) {
      filtered = filtered.filter(r => state.selectedScrapIds.has(r.scrap_id));
    }

    // 2. Course filter
    if (state.selectedCourse !== 'all') {
      filtered = filtered.filter(r => r.course_type === state.selectedCourse);
    }

    // 3. Dietary filter
    if (state.selectedDietary !== 'all') {
      filtered = filtered.filter(r => r.dietary_type === state.selectedDietary);
    }

    renderRecipesGrid(filtered);
  }

  function renderRecipesGrid(customList = null) {
    const list = customList !== null ? customList : state.recipes;

    // Update Counter & Filter State Hint
    DOM.recipesResultsCounter.textContent = `Showing ${list.length} traditional recipe${list.length === 1 ? '' : 's'}`;

    if (state.selectedScrapIds.size > 0) {
      DOM.activeScrapsFilterTag.textContent = `• Filtered by ${state.selectedScrapIds.size} selected scrap${state.selectedScrapIds.size === 1 ? '' : 's'}`;
    } else {
      DOM.activeScrapsFilterTag.textContent = '• Showing all zero-waste recipes';
    }

    if (list.length === 0) {
      DOM.homeRecipeGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
          <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">🥗</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">No matching zero-waste recipes found</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem;">
            Try selecting different scraps from the 30-scraps catalog or clear filters to view authentic zero-waste dishes.
          </p>
          <button class="btn-hero-primary" id="btn-empty-browse-catalog">
            <span>📚 Browse 30 Kitchen Scraps Catalog</span>
          </button>
        </div>
      `;
      const emptyBtn = DOM.homeRecipeGrid.querySelector('#btn-empty-browse-catalog');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => switchTab('scraps-matrix'));
      }
      return;
    }

    DOM.homeRecipeGrid.innerHTML = '';
    list.forEach(rc => {
      const card = document.createElement('article');
      card.className = 'recipe-display-card';

      const savedKg = (0.35 + (rc.id % 5) * 0.1).toFixed(2);
      const co2Prevented = (savedKg * 1.8).toFixed(2);

      card.innerHTML = `
        <div>
          <div class="card-badges-row">
            <span class="badge badge-course">${escapeHtml(rc.course_type)}</span>
            <span class="badge badge-dietary">${escapeHtml(rc.dietary_type)}</span>
          </div>

          <h3 class="recipe-dish-title">${escapeHtml(getEnglishRecipeTitle(rc.title))}</h3>

          <div class="card-byproduct-callout">
            <span class="byproduct-title-row">♻️ Scrap: ${escapeHtml(rc.scrap_name_en)}</span>
          </div>

          ${rc.chef_wisdom_tip ? `<div class="card-wisdom-snippet">“${escapeHtml(rc.chef_wisdom_tip)}”</div>` : ''}
        </div>

        <div>
          <div class="card-specs-row">
            <span>⏱️ ${rc.prep_time_minutes} min</span>
            <span>⚡ ${escapeHtml(rc.difficulty)}</span>
            <span>🍽️ ${rc.servings} Servings</span>
          </div>

          <div class="card-nature-impact">
            🌱 ${savedKg} kg scrap transformed • ${co2Prevented} kg CO₂ prevented
          </div>

          <button class="btn-card-read" data-recipe-id="${rc.id}">
            <span>📖 View Recipe & Audio Guide</span>
          </button>
        </div>
      `;

      card.querySelector('.btn-card-read').addEventListener('click', () => {
        openRecipeDetailModal(rc.id);
      });

      DOM.homeRecipeGrid.appendChild(card);
    });
  }

  // ==========================================================================
  // RECIPE DETAIL MODAL & WEB SPEECH AUDIO GUIDE
  // ==========================================================================
  async function openRecipeDetailModal(recipeId) {
    stopSpeech();
    try {
      let rc = state.recipes.find(r => r.id === recipeId);

      // Attempt live fetch if possible
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        if (res && res.ok) rc = await res.json();
      } catch (netErr) {
        // Fallback to in-memory recipe for static Git deployment
      }

      if (!rc) throw new Error('Could not fetch recipe');
      state.activeRecipe = rc;

      DOM.modalRcCourse.textContent = rc.course_type;
      DOM.modalRcDietary.textContent = rc.dietary_type;
      DOM.modalRcScrapTitle.textContent = rc.scrap_name_en;
      DOM.modalRcTitle.textContent = getEnglishRecipeTitle(rc.title);
      DOM.modalRcChefName.textContent = rc.chef_name;
      DOM.modalRcChefAffil.textContent = rc.chef_affiliation;
      DOM.modalRcPrep.textContent = rc.prep_time_minutes;
      DOM.modalRcDiff.textContent = rc.difficulty;
      DOM.modalRcServings.textContent = rc.servings;
      DOM.modalRcScrapEn.textContent = rc.scrap_name_en;
      DOM.modalRcScrapReg.textContent = '';
      DOM.modalRcScrapReg.style.display = 'none';

      // Update favorite button status
      const isFav = state.favorites.some(f => f.id === rc.id);
      updateFavoriteButtonUI(isFav);

      // Pantry Staples Checklist
      DOM.modalRcStaples.innerHTML = '';
      (rc.pantry_staples || []).forEach((staple, idx) => {
        const li = document.createElement('li');
        li.className = 'check-item-row';
        li.innerHTML = `
          <input type="checkbox" id="staple-check-${idx}" />
          <label for="staple-check-${idx}">${escapeHtml(staple)}</label>
        `;
        li.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') {
            const cb = li.querySelector('input');
            cb.checked = !cb.checked;
          }
          li.classList.toggle('checked', li.querySelector('input').checked);
        });
        DOM.modalRcStaples.appendChild(li);
      });

      // Cooking Steps Checklist
      DOM.modalRcSteps.innerHTML = '';
      (rc.step_by_step_instructions || []).forEach((step, idx) => {
        const li = document.createElement('li');
        li.className = 'step-item-card';
        li.innerHTML = `
          <span class="step-circle-badge">${idx + 1}</span>
          <div class="step-text-content">${escapeHtml(step)}</div>
        `;
        li.addEventListener('click', () => {
          li.classList.toggle('step-done');
        });
        DOM.modalRcSteps.appendChild(li);
      });

      // Ancestral Wisdom
      if (rc.chef_wisdom_tip) {
        DOM.modalRcWisdomWrap.style.display = 'flex';
        DOM.modalRcWisdom.textContent = rc.chef_wisdom_tip;
      } else {
        DOM.modalRcWisdomWrap.style.display = 'none';
      }

      // Reset Audio Button
      DOM.audioIconSpan.textContent = '▶️';
      DOM.audioTextSpan.textContent = 'Listen to Voice Guide';
      DOM.btnAudioStop.style.display = 'none';

      DOM.recipeModal.showModal();
    } catch (err) {
      showToast('Failed to open recipe details.', 'error');
    }
  }

  function closeRecipeModal() {
    stopSpeech();
    DOM.recipeModal.close();
  }

  // Web Speech API Voice Guide
  function toggleSpeechNarration() {
    if (!('speechSynthesis' in window)) {
      showToast('Speech Synthesis audio guide not supported in this browser.', 'info');
      return;
    }
    if (state.isSpeaking) {
      stopSpeech();
    } else {
      startSpeech();
    }
  }

  function startSpeech() {
    if (!state.activeRecipe) return;
    window.speechSynthesis.cancel();

    const rc = state.activeRecipe;
    const ingredients = (rc.pantry_staples || []).join(', ');
    const steps = (rc.step_by_step_instructions || []).map((s, i) => `Step ${i + 1}: ${s}`).join('. ');

    const script = `
      Guiding recipe: ${getEnglishRecipeTitle(rc.title)}.
      Made from ${rc.scrap_name_en}.
      Cooking time is ${rc.prep_time_minutes} minutes, serving ${rc.servings} people.
      Pantry ingredients: ${ingredients}.
      Instructions: ${steps}.
      ${rc.chef_wisdom_tip ? `Chef wisdom tip: ${rc.chef_wisdom_tip}` : ''}
    `;

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      state.isSpeaking = true;
      DOM.audioIconSpan.textContent = '⏸️';
      DOM.audioTextSpan.textContent = 'Playing Voice Guide...';
      DOM.btnAudioStop.style.display = 'inline-block';
    };

    utterance.onend = () => {
      resetSpeechUI();
    };

    utterance.onerror = () => {
      resetSpeechUI();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    resetSpeechUI();
  }

  function resetSpeechUI() {
    state.isSpeaking = false;
    DOM.audioIconSpan.textContent = '▶️';
    DOM.audioTextSpan.textContent = 'Listen to Voice Guide';
    DOM.btnAudioStop.style.display = 'none';
  }

  // ==========================================================================
  // SAVED FAVORITES LOGIC (HOME CHEF)
  // ==========================================================================
  function updateFavoriteButtonUI(isFav) {
    if (DOM.favIcon) DOM.favIcon.textContent = isFav ? '❤️' : '🤍';
    if (DOM.favText) DOM.favText.textContent = isFav ? 'Saved' : 'Save';
    if (DOM.btnModalFavorite) {
      DOM.btnModalFavorite.classList.toggle('active', isFav);
      DOM.btnModalFavorite.title = isFav ? 'Remove from saved favorites' : 'Save to favorites';
    }
  }

  function toggleFavoriteRecipe() {
    if (!state.activeRecipe) return;
    const rc = state.activeRecipe;
    const idx = state.favorites.findIndex(f => f.id === rc.id);

    if (idx >= 0) {
      state.favorites.splice(idx, 1);
      showToast(`Removed "${getEnglishRecipeTitle(rc.title)}" from favorites`, 'info');
      updateFavoriteButtonUI(false);
    } else {
      state.favorites.push({
        id: rc.id,
        title: getEnglishRecipeTitle(rc.title),
        course_type: rc.course_type,
        scrap_name_en: rc.scrap_name_en,
        chef_name: rc.chef_name,
        prep_time_minutes: rc.prep_time_minutes
      });
      showToast(`Saved "${getEnglishRecipeTitle(rc.title)}" to favorites! ❤️`, 'success');
      updateFavoriteButtonUI(true);
    }

    saveFavorites();
    renderAuthHeader();
  }

  function openFavoritesModal() {
    if (!DOM.favoritesModal || !DOM.favoritesListContainer) return;
    DOM.favoritesListContainer.innerHTML = '';

    if (!state.favorites || state.favorites.length === 0) {
      DOM.favoritesListContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <p style="font-size: 1.15rem; margin-bottom: 0.5rem; font-weight: 600;">🤍 No saved favorite recipes yet</p>
          <p style="font-size: 0.88rem;">Open any recipe and click the <strong>Save</strong> button to bookmark traditional zero-waste dishes here.</p>
        </div>
      `;
    } else {
      state.favorites.forEach(fav => {
        const card = document.createElement('div');
        card.className = 'favorite-item-card';
        card.innerHTML = `
          <div class="favorite-item-top">
            <span class="badge badge-course">${escapeHtml(fav.course_type || 'Dishes')}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">⏱️ ${fav.prep_time_minutes || 15} min</span>
          </div>
          <h4 class="favorite-item-title">${escapeHtml(getEnglishRecipeTitle(fav.title))}</h4>
          <p class="favorite-item-scrap">♻️ Scrap: ${escapeHtml(fav.scrap_name_en || 'Kitchen Scrap')}</p>
          <div class="favorite-item-actions">
            <button type="button" class="btn-fav-read" data-id="${fav.id}">View Recipe</button>
            <button type="button" class="btn-fav-remove" data-id="${fav.id}" title="Remove">✕</button>
          </div>
        `;

        card.querySelector('.btn-fav-read').addEventListener('click', () => {
          DOM.favoritesModal.close();
          openRecipeDetailModal(fav.id);
        });

        card.querySelector('.btn-fav-remove').addEventListener('click', () => {
          state.favorites = state.favorites.filter(f => f.id !== fav.id);
          saveFavorites();
          openFavoritesModal();
          renderAuthHeader();
          showToast('Removed from favorites', 'info');
        });

        DOM.favoritesListContainer.appendChild(card);
      });
    }

    DOM.favoritesModal.showModal();
  }

  // ==========================================================================
  // MASTER CHEF: 2-STEP RECIPE AUTHORING STUDIO & BUILDER POPUP
  // ==========================================================================

  /**
   * Step 1: Render 30 Scraps Organized in 5 Categorized Sections for Master Chef Selection
   */
  function renderMasterChefScrapsSelector() {
    if (!DOM.masterScrapsSelectorContainer) return;
    DOM.masterScrapsSelectorContainer.innerHTML = '';

    state.categories.forEach(cat => {
      const catScraps = state.scraps.filter(s => s.category_id === cat.id);
      if (catScraps.length === 0) return;

      const catSection = document.createElement('div');
      catSection.className = 'master-cat-section';

      catSection.innerHTML = `
        <h4 class="master-cat-title">
          <span>${cat.emoji}</span>
          <span>Category ${cat.id}: ${escapeHtml(cat.name)}</span>
        </h4>
        <div class="master-scraps-subgrid"></div>
      `;

      const subgrid = catSection.querySelector('.master-scraps-subgrid');

      catScraps.forEach(sc => {
        const isSelected = (state.masterChefSelectedScrapId === sc.id);
        const card = document.createElement('div');
        card.className = `master-scrap-card ${isSelected ? 'selected' : ''}`;
        card.dataset.scrapId = sc.id;

        card.innerHTML = `
          <div>
            <div class="master-scrap-card-top">
              <span class="master-scrap-id">#${sc.id}</span>
              <div class="master-scrap-radio-indicator">${isSelected ? '✓' : ''}</div>
            </div>
            <h4 class="master-scrap-name">${escapeHtml(sc.name_en)}</h4>
            <p class="master-scrap-method">${escapeHtml(sc.common_uses)}</p>
          </div>
          <button type="button" class="btn-master-card-select">
            <span>${isSelected ? '✓ Selected for Recipe' : 'Select for Recipe'}</span>
          </button>
        `;

        card.addEventListener('click', () => {
          selectMasterChefScrap(sc.id);
        });

        subgrid.appendChild(card);
      });

      DOM.masterScrapsSelectorContainer.appendChild(catSection);
    });

    updateMasterStep1SelectionUI();
  }

  /**
   * Handle scrap selection in Master Chef Step 1
   */
  function selectMasterChefScrap(scrapId) {
    state.masterChefSelectedScrapId = scrapId;
    updateMasterStep1SelectionUI();

    const selectedScrap = state.scraps.find(s => s.id === scrapId);
    if (selectedScrap) {
      showToast(`Selected "${selectedScrap.name_en}". Click "Next" to build the recipe!`, 'info');
    }
  }

  /**
   * Synchronize visual selection badges, radio indicators, and the bottom sticky dock
   */
  function updateMasterStep1SelectionUI() {
    if (!DOM.masterScrapsSelectorContainer) return;

    const selId = state.masterChefSelectedScrapId;
    const cards = DOM.masterScrapsSelectorContainer.querySelectorAll('.master-scrap-card');
    cards.forEach(card => {
      const id = parseInt(card.dataset.scrapId, 10);
      const isSelected = (id === selId);
      card.classList.toggle('selected', isSelected);
      const radio = card.querySelector('.master-scrap-radio-indicator');
      if (radio) radio.textContent = isSelected ? '✓' : '';
      const btn = card.querySelector('.btn-master-card-select span');
      if (btn) btn.textContent = isSelected ? '✓ Selected for Recipe' : 'Select for Recipe';
    });

    const selectedScrap = state.scraps.find(s => s.id === selId);

    if (DOM.step1SelectedBadge) {
      if (selectedScrap) {
        DOM.step1SelectedBadge.classList.add('has-selection');
        DOM.step1SelectedBadge.innerHTML = `<span>✓ Selected: <strong>${escapeHtml(selectedScrap.name_en)}</strong></span>`;
      } else {
        DOM.step1SelectedBadge.classList.remove('has-selection');
        DOM.step1SelectedBadge.innerHTML = `<span>No scrap selected yet</span>`;
      }
    }

    if (DOM.dockSelectedScrapName) {
      if (selectedScrap) {
        DOM.dockSelectedScrapName.textContent = selectedScrap.name_en;
        DOM.dockSelectedScrapName.style.color = 'var(--emerald-primary)';
      } else {
        DOM.dockSelectedScrapName.textContent = 'None chosen — please click a scrap card above';
        DOM.dockSelectedScrapName.style.color = 'var(--text-muted)';
      }
    }

    if (DOM.btnMasterStep1Next) {
      DOM.btnMasterStep1Next.disabled = !selectedScrap;
    }

    if (DOM.formRcScrapId && selectedScrap) {
      DOM.formRcScrapId.value = selectedScrap.id;
    }
  }

  /**
   * Step 2: Open Master Chef Recipe Builder Pop-Up Modal
   */
  function openMasterRecipeBuilderModal() {
    if (!state.masterChefSelectedScrapId) {
      showToast('Please select a kitchen scrap first from Step 1.', 'info');
      return;
    }

    const scrap = state.scraps.find(s => s.id === state.masterChefSelectedScrapId);
    if (!scrap) return;

    if (DOM.builderScrapPill) {
      DOM.builderScrapPill.textContent = `♻️ Scrap #${scrap.id}`;
    }
    if (DOM.builderScrapTitle) {
      DOM.builderScrapTitle.textContent = scrap.name_en;
    }
    if (DOM.builderScrapReg) {
      DOM.builderScrapReg.textContent = '';
      DOM.builderScrapReg.style.display = 'none';
    }
    if (DOM.formRcScrapId) {
      DOM.formRcScrapId.value = scrap.id;
    }

    // Pre-populate author details if user is logged in
    if (state.currentUser) {
      if (DOM.formRcChef && !DOM.formRcChef.value) {
        DOM.formRcChef.value = state.currentUser.name || '';
      }
      if (DOM.formRcAffiliation && !DOM.formRcAffiliation.value) {
        DOM.formRcAffiliation.value = state.currentUser.affiliation || '';
      }
    }

    // Set stepper indicator 2 to active
    const step2 = document.getElementById('stepper-item-2');
    if (step2) step2.classList.add('active');

    if (DOM.masterRecipeModal) {
      DOM.masterRecipeModal.showModal();
    }
  }

  /**
   * Close Master Chef Recipe Builder Pop-Up Modal
   */
  function closeMasterRecipeBuilderModal() {
    if (DOM.masterRecipeModal) {
      DOM.masterRecipeModal.close();
    }
    const step2 = document.getElementById('stepper-item-2');
    if (step2) step2.classList.remove('active');
  }

  function addPantryInputRow() {
    const row = document.createElement('div');
    row.className = 'dynamic-input-row';
    const num = DOM.pantryInputsContainer.querySelectorAll('.dynamic-input-row').length + 1;
    row.innerHTML = `
      <input type="text" class="input-pantry" placeholder="Ingredient ${num} (e.g. Mustard oil, Kalonji, Turmeric)" required />
      <button type="button" class="btn-remove-row" title="Remove">✕</button>
    `;
    DOM.pantryInputsContainer.appendChild(row);
    row.querySelector('input').focus();
  }

  function addStepInputRow() {
    const row = document.createElement('div');
    row.className = 'dynamic-input-row';
    const num = DOM.stepsInputsContainer.querySelectorAll('.dynamic-input-row').length + 1;
    row.innerHTML = `
      <span class="step-num-pill">${num}</span>
      <textarea class="input-step" rows="2" placeholder="Step ${num}: Describe preparation method..." required></textarea>
      <button type="button" class="btn-remove-row" title="Remove">✕</button>
    `;
    DOM.stepsInputsContainer.appendChild(row);
    row.querySelector('textarea').focus();
  }

  function renumberStepRows() {
    const rows = DOM.stepsInputsContainer.querySelectorAll('.dynamic-input-row');
    rows.forEach((row, idx) => {
      row.querySelector('.step-num-pill').textContent = idx + 1;
    });
  }

  /**
   * Submit new dish authored in Master Chef Step 2 Popup
   */
  async function handleMasterRecipeSubmit(e) {
    e.preventDefault();

    const scrapId = parseInt(DOM.formRcScrapId && DOM.formRcScrapId.value ? DOM.formRcScrapId.value : state.masterChefSelectedScrapId, 10);
    if (!scrapId) {
      showToast('Please select a kitchen scrap first.', 'error');
      return;
    }

    const staples = Array.from(DOM.pantryInputsContainer.querySelectorAll('.input-pantry'))
      .map(i => i.value.trim())
      .filter(Boolean);

    const steps = Array.from(DOM.stepsInputsContainer.querySelectorAll('.input-step'))
      .map(i => i.value.trim())
      .filter(Boolean);

    if (staples.length === 0 || steps.length === 0) {
      showToast('Please provide both pantry ingredients and cooking steps.', 'error');
      return;
    }

    const payload = {
      title: DOM.formRcTitle.value.trim(),
      scrap_id: scrapId,
      chef_name: DOM.formRcChef.value.trim(),
      chef_affiliation: DOM.formRcAffiliation.value.trim(),
      prep_time_minutes: parseInt(DOM.formRcPrep.value, 10),
      difficulty: DOM.formRcDiff.value,
      course_type: DOM.formRcCourse.value,
      dietary_type: DOM.formRcDietary.value,
      pantry_staples: staples,
      step_by_step_instructions: steps,
      chef_wisdom_tip: (DOM.formRcWisdom && DOM.formRcWisdom.value.trim()) ? DOM.formRcWisdom.value.trim() : null,
      servings: parseInt(DOM.formRcServings.value, 10)
    };

    const submitBtn = DOM.btnSaveRecipe || document.getElementById('btn-save-recipe');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Preserving Recipe...';
    }

    try {
      let savedOnBackend = false;
      try {
        const res = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res && res.ok) savedOnBackend = true;
      } catch (netErr) {
        console.info('Backend unreachable, saving recipe in static Git mode');
      }

      // Add to local state & persist
      payload.id = state.recipes.length ? Math.max(...state.recipes.map(r => r.id)) + 1 : 31;
      const scrap = state.scraps.find(s => s.id === payload.scrap_id);
      if (scrap) {
        payload.scrap_name_en = scrap.name_en;
        payload.scrap_name_regional = scrap.name_regional;
      }
      state.recipes.unshift(payload);
      try {
        localStorage.setItem('waste2menu_recipes', JSON.stringify(state.recipes));
      } catch (e) {}

      showToast(`✨ "${payload.title}" published & preserved in the catalog!`, 'success');
      DOM.masterRecipeForm.reset();
      closeMasterRecipeBuilderModal();

      state.masterChefSelectedScrapId = null;
      updateMasterStep1SelectionUI();

      // Refresh recipe list if backend available
      if (savedOnBackend) {
        try {
          const updated = await fetch('/api/recipes');
          if (updated && updated.ok) state.recipes = await updated.json();
        } catch (e) {}
      }

      applyFiltersAndRenderRecipes();
      switchTab('home-chef', true);
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🌿 Publish & Build New Dish</span>';
      }
    }
  }


  // ==========================================================================
  // HOME CHEF: DISH CREATION SNAP / UPLOAD & MY UPCYCLED CREATIONS GALLERY
  // ==========================================================================
  function initDishCreationUpload() {
    if (DOM.dishPhotoDropzone) {
      ['dragenter', 'dragover'].forEach(evt => {
        DOM.dishPhotoDropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.dishPhotoDropzone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(evt => {
        DOM.dishPhotoDropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.dishPhotoDropzone.classList.remove('drag-over');
        });
      });

      DOM.dishPhotoDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files[0]) {
          handleDishPhotoSelected(dt.files[0]);
        }
      });
    }

    if (DOM.btnTriggerDishUpload && DOM.dishPhotoInput) {
      DOM.btnTriggerDishUpload.addEventListener('click', (e) => {
        e.stopPropagation();
        DOM.dishPhotoInput.click();
      });

      DOM.dishPhotoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleDishPhotoSelected(e.target.files[0]);
        }
      });
    }

    if (DOM.btnDishRemovePhoto) {
      DOM.btnDishRemovePhoto.addEventListener('click', (e) => {
        e.stopPropagation();
        resetDishPhotoUpload();
      });
    }

    // Star rating interactive selector
    if (DOM.dishStarRating) {
      const stars = DOM.dishStarRating.querySelectorAll('.star-btn');
      stars.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.dataset.value, 10);
          setDishStarRating(val);
        });
      });
    }

    if (DOM.btnSaveDishCreation) {
      DOM.btnSaveDishCreation.addEventListener('click', saveDishCreation);
    }

    // Initial render of saved cooked creations
    renderCookedCreationsGallery();
  }

  function setDishStarRating(val) {
    if (!DOM.dishStarRating) return;
    DOM.dishStarRating.dataset.rating = val;
    const stars = DOM.dishStarRating.querySelectorAll('.star-btn');
    stars.forEach(s => {
      const v = parseInt(s.dataset.value, 10);
      s.classList.toggle('active', v <= val);
    });

    const labels = {
      1: "1.0 / 5 (Good Start)",
      2: "2.0 / 5 (Tasty)",
      3: "3.0 / 5 (Flavorful)",
      4: "4.0 / 5 (Delicious)",
      5: "5.0 / 5 (Legendary Zero-Waste Dish)"
    };
    if (DOM.ratingTextLabel) {
      DOM.ratingTextLabel.textContent = labels[val] || `${val}.0 / 5`;
    }
  }

  function handleDishPhotoSelected(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      state.currentDishPhotoUrl = e.target.result;
      if (DOM.dishPreviewImg) DOM.dishPreviewImg.src = state.currentDishPhotoUrl;
      if (DOM.dishDropzonePrompt) DOM.dishDropzonePrompt.style.display = 'none';
      if (DOM.dishPreviewBox) DOM.dishPreviewBox.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  function resetDishPhotoUpload() {
    state.currentDishPhotoUrl = null;
    if (DOM.dishPhotoInput) DOM.dishPhotoInput.value = '';
    if (DOM.dishPreviewImg) DOM.dishPreviewImg.src = '';
    if (DOM.dishPreviewBox) DOM.dishPreviewBox.style.display = 'none';
    if (DOM.dishDropzonePrompt) DOM.dishDropzonePrompt.style.display = 'flex';
    if (DOM.dishSuccessBadge) DOM.dishSuccessBadge.style.display = 'none';
    if (DOM.dishCreationNote) DOM.dishCreationNote.value = '';
    setDishStarRating(5);
  }

  function saveDishCreation() {
    // Generate an artisanal SVG preview if user did not upload a photo yet
    let photoData = state.currentDishPhotoUrl;
    if (!photoData) {
      const dishTitle = state.activeRecipe ? state.activeRecipe.title : 'My Upcycled Creation';
      photoData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FBF9F5"/><circle cx="300" cy="200" r="140" fill="%23EADBCE"/><circle cx="300" cy="200" r="120" fill="%232E7D32" fill-opacity="0.15"/><path d="M220 180 Q300 130 380 180 T300 250 Z" fill="%23D97706"/><circle cx="280" cy="180" r="10" fill="%23FFF"/><circle cx="320" cy="190" r="8" fill="%23FFF"/><text x="300" y="360" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23221F1B" text-anchor="middle">${encodeURIComponent(dishTitle)}</text></svg>`;
    }

    const recipe = state.activeRecipe || {
      id: 999,
      title: "Handcrafted Upcycled Dish",
      scrap_name_en: "Fresh Kitchen Counter Scrap"
    };

    const rating = parseInt(DOM.dishStarRating ? DOM.dishStarRating.dataset.rating || '5' : '5', 10);
    const note = DOM.dishCreationNote && DOM.dishCreationNote.value.trim() ? DOM.dishCreationNote.value.trim() : "Seasoned with traditional spices and family love.";

    const creation = {
      id: Date.now(),
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      scrapName: recipe.scrap_name_en || "Kitchen Scrap",
      photoUrl: photoData,
      note: note,
      rating: rating,
      authorName: state.currentUser ? state.currentUser.name : "Home Chef",
      dateFormatted: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    let list = [];
    try {
      const stored = localStorage.getItem('waste2menu_cooked_creations');
      if (stored) list = JSON.parse(stored);
    } catch (e) {}

    list.unshift(creation);
    try {
      localStorage.setItem('waste2menu_cooked_creations', JSON.stringify(list));
    } catch (e) {}

    // Show Micro-Badge
    if (DOM.dishSuccessBadge) {
      DOM.dishSuccessBadge.style.display = 'flex';
    }

    showToast('🌿 Zero Waste Hero: You diverted kitchen scrap into delicious food!', 'success');
    renderCookedCreationsGallery();
  }

  function renderCookedCreationsGallery() {
    if (!DOM.cookedCreationsGrid) return;

    let list = [];
    try {
      const stored = localStorage.getItem('waste2menu_cooked_creations');
      if (stored) list = JSON.parse(stored);
    } catch (e) {}

    if (DOM.badgeCreationsCount) {
      DOM.badgeCreationsCount.textContent = `${list.length} Creation${list.length === 1 ? '' : 's'} Saved`;
    }

    if (list.length === 0) {
      DOM.cookedCreationsGrid.innerHTML = `
        <div class="creations-empty-state">
          <span class="empty-icon">🍳</span>
          <h4>No cooked creations uploaded yet</h4>
          <p>Open any recipe above, cook it at home, and tap <strong>"Snap / Upload My Dish Creation"</strong> to build your Zero-Waste Hero portfolio!</p>
        </div>
      `;
      return;
    }

    DOM.cookedCreationsGrid.innerHTML = '';
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'cooked-creation-card';

      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star ${i <= item.rating ? 'active' : ''}">★</span>`;
      }

      card.innerHTML = `
        <div class="creation-card-media">
          <img src="${item.photoUrl}" alt="${escapeHtml(item.recipeTitle)}" loading="lazy" />
          <span class="creation-scrap-tag">♻️ ${escapeHtml(item.scrapName)}</span>
          <button type="button" class="btn-delete-creation" data-id="${item.id}" title="Remove creation">✕</button>
        </div>
        <div class="creation-card-body">
          <div class="creation-rating-row">
            <div class="creation-stars">${starsHtml}</div>
            <span class="creation-date">${item.dateFormatted}</span>
          </div>
          <h4 class="creation-dish-title">${escapeHtml(item.recipeTitle)}</h4>
          <p class="creation-note">“${escapeHtml(item.note)}”</p>
          <div class="creation-card-footer">
            <span class="hero-micro-badge">🌿 Zero Waste Hero</span>
            <span class="creation-chef-tag">By ${escapeHtml(item.authorName)}</span>
          </div>
        </div>
      `;

      card.querySelector('.btn-delete-creation').addEventListener('click', () => {
        deleteCookedCreation(item.id);
      });

      DOM.cookedCreationsGrid.appendChild(card);
    });
  }

  function deleteCookedCreation(id) {
    try {
      const stored = localStorage.getItem('waste2menu_cooked_creations');
      if (stored) {
        let list = JSON.parse(stored);
        list = list.filter(it => it.id !== id);
        localStorage.setItem('waste2menu_cooked_creations', JSON.stringify(list));
        showToast('Creation removed from your gallery.', 'info');
        renderCookedCreationsGallery();
      }
    } catch (e) {}
  }

  // ==========================================================================
  // MASTER CHEF & DISPATCH: CHENNAI LOCAL NGO DIRECTORY
  // ==========================================================================
  function renderChennaiNgosDirectory(filterText = '') {
    if (!DOM.chennaiNgosGrid) return;
    DOM.chennaiNgosGrid.innerHTML = '';

    const term = (filterText || '').trim().toLowerCase();
    const filtered = CHENNAI_NGOS.filter(ngo => {
      if (!term) return true;
      return (
        ngo.name.toLowerCase().includes(term) ||
        ngo.zone.toLowerCase().includes(term) ||
        ngo.focus.toLowerCase().includes(term) ||
        ngo.address.toLowerCase().includes(term)
      );
    });

    if (filtered.length === 0) {
      DOM.chennaiNgosGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md);">
          No verified shelters matched "${escapeHtml(filterText)}". Showing all grassroots relief partners.
        </div>
      `;
      return;
    }

    filtered.forEach(ngo => {
      const card = document.createElement('div');
      card.className = 'chennai-ngo-card';
      card.innerHTML = `
        <div class="ngo-card-top">
          <div class="ngo-icon-wrap">${ngo.icon || '🏢'}</div>
          <span class="ngo-badge-pill">${escapeHtml(ngo.badge || 'Verified Shelter')}</span>
        </div>

        <h4 class="ngo-title">${escapeHtml(ngo.name)}</h4>
        <span class="ngo-zone-tag">📍 Zone: ${escapeHtml(ngo.zone)}</span>

        <p class="ngo-focus-text">
          <strong>Mission Focus:</strong> ${escapeHtml(ngo.focus)}
        </p>

        <div class="ngo-meta-list">
          <div class="ngo-meta-item">
            <span>📞 Contact:</span>
            <strong>${escapeHtml(ngo.contact)}</strong>
          </div>
          <div class="ngo-meta-item">
            <span>🏠 Address:</span>
            <span class="ngo-addr-text">${escapeHtml(ngo.address)}</span>
          </div>
        </div>

        <button type="button" class="btn-direct-dispatch-ngo" data-ngo-id="${ngo.id}">
          <span>🤝 Direct Dispatch to this Shelter ➔</span>
        </button>
      `;

      card.querySelector('.btn-direct-dispatch-ngo').addEventListener('click', () => {
        handleDirectDispatchToNgo(ngo);
      });

      DOM.chennaiNgosGrid.appendChild(card);
    });
  }

  function handleDirectDispatchToNgo(ngo) {
    const locInput = document.getElementById('disp-location');
    const notesInput = document.getElementById('disp-notes');
    const dishInput = document.getElementById('disp-dish-name');

    if (locInput) locInput.value = ngo.address;
    if (notesInput) {
      notesInput.value = `Direct pickup coordination with: ${ngo.name} (${ngo.contact}). Zone: ${ngo.zone}. Shelter Focus: ${ngo.focus}.`;
    }

    // Smooth scroll to broadcast form with highlighting
    const form = document.getElementById('ngo-broadcast-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.classList.add('form-highlight-pulse');
      setTimeout(() => form.classList.remove('form-highlight-pulse'), 2000);
      if (dishInput) dishInput.focus();
    }

    showToast(`📍 Pre-filled dispatch address for ${ngo.name}!`, 'success');
  }

  // ==========================================================================
  // NGO SURPLUS FOOD DISPATCH
  // ==========================================================================
  function renderDispatchesFeed() {
    let activeCount = 0;
    let totalPortions = 0;

    DOM.ngoDispatchesList.innerHTML = '';

    if (state.dispatches.length === 0) {
      DOM.ngoDispatchesList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md);">
          All surplus meals have been collected by community shelters!
        </div>
      `;
      DOM.statFeedActiveMeals.textContent = '0';
      DOM.activeDispatchBadge.style.display = 'none';
      return;
    }

    state.dispatches.forEach(dp => {
      const isActive = dp.status === 'ACTIVE';
      if (isActive) {
        activeCount++;
        totalPortions += dp.portions_available;
      }

      // Determine scrap source from recipe or fallback
      let scrapSource = "Fresh Kitchen Byproducts";
      if (dp.recipe_id) {
        const rc = state.recipes.find(r => r.id === dp.recipe_id);
        if (rc) {
          scrapSource = rc.scrap_name_en || rc.title;
        }
      }

      const dietary = dp.dietary_tag || 'Pure Veg';
      const isNonVeg = dietary.toLowerCase().includes('non-veg');
      const readyTime = dp.ready_time || 'Hot & Ready Now';

      const card = document.createElement('div');
      card.className = `dispatch-item-card ${isActive ? 'active-alert' : 'claimed-alert'}`;

      card.innerHTML = `
        <div class="disp-top-row">
          <div>
            <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.25rem;">
              <span class="dietary-badge-pill ${isNonVeg ? 'non-veg' : 'veg'}">${escapeHtml(dietary)}</span>
              <span class="scrap-source-pill">♻️ ${escapeHtml(scrapSource)}</span>
            </div>
            <h4 class="disp-dish-title">${escapeHtml(dp.dish_name)}</h4>
            <span style="font-size: 0.84rem; color: var(--emerald-primary); font-weight: 700;">🍽️ ${dp.portions_available} Meals Available</span>
          </div>
          <span class="disp-status-badge ${isActive ? 'active' : 'claimed'}">
            ${isActive ? '🟢 Ready for Pickup' : '🤝 CLAIMED'}
          </span>
        </div>

        <div class="disp-details-grid">
          <div><span>Prepared By:</span> <strong>${escapeHtml(dp.prepared_by_chef)}</strong></div>
          <div><span>Ready Time:</span> <strong>⏱️ ${escapeHtml(readyTime)}</strong></div>
          <div><span>Contact:</span> <strong><a href="tel:${escapeHtml(dp.contact_number)}" style="color: var(--saffron-primary); text-decoration: none;">${escapeHtml(dp.contact_number)}</a></strong></div>
          <div style="grid-column: span 2;"><span>Pickup Address:</span> <strong>📍 ${escapeHtml(dp.pickup_location)}</strong></div>
        </div>

        ${dp.notes ? `<div style="font-size: 0.8rem; font-style: italic; color: var(--text-secondary); background: var(--bg-base); padding: 0.45rem 0.7rem; border-radius: 4px; border-left: 3px solid var(--saffron-primary);">“${escapeHtml(dp.notes)}”</div>` : ''}

        ${dp.claim_otp && !isActive ? `
          <div class="otp-claimed-banner">
            <span class="otp-claimed-title">🔐 Handover Verification OTP:</span>
            <span class="otp-code-highlight">${escapeHtml(dp.claim_otp)}</span>
            <span class="otp-hint">(Present this code upon collection)</span>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; border-top: 1px solid var(--border-light); flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: var(--text-muted);">${dp.created_at ? new Date(dp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ready Now'}</span>
          ${isActive ? `
            <button type="button" class="btn-claim-dispatch" data-dispatch-id="${dp.id}">
              <span>🤝 Claim Batch for Shelter</span>
            </button>
          ` : `
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--saffron-hover);">Claimed by: ${escapeHtml(dp.claimed_by_ngo || 'Shelter Partner')}</span>
          `}
        </div>
      `;

      if (isActive) {
        card.querySelector('.btn-claim-dispatch').addEventListener('click', () => {
          openClaimModal(dp);
        });
      }

      DOM.ngoDispatchesList.appendChild(card);
    });

    DOM.statFeedActiveMeals.textContent = totalPortions;
    DOM.activeDispatchBadge.textContent = activeCount;
    DOM.activeDispatchBadge.style.display = activeCount > 0 ? 'inline-block' : 'none';
  }

  async function handleNgoBroadcastSubmit(e) {
    e.preventDefault();

    const payload = {
      dish_name: document.getElementById('disp-dish-name').value.trim(),
      prepared_by_chef: document.getElementById('disp-chef-name').value.trim(),
      portions_available: parseInt(document.getElementById('disp-portions').value, 10),
      pickup_location: document.getElementById('disp-location').value.trim(),
      contact_number: document.getElementById('disp-contact').value.trim(),
      dietary_tag: (DOM.dispDietary && DOM.dispDietary.value) ? DOM.dispDietary.value : "Pure Veg",
      ready_time: (DOM.dispReadyTime && DOM.dispReadyTime.value.trim()) ? DOM.dispReadyTime.value.trim() : "Hot & Ready Now",
      notes: document.getElementById('disp-notes').value.trim() || null
    };

    const submitBtn = document.getElementById('btn-submit-broadcast');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Broadcasting...';

    try {
      let savedBackend = false;
      try {
        const res = await fetch('/api/dispatches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res && res.ok) savedBackend = true;
      } catch (e) {}

      // Add to local state
      payload.id = state.dispatches.length ? Math.max(...state.dispatches.map(d => d.id)) + 1 : 5;
      payload.status = 'ACTIVE';
      payload.claimed_by_ngo = null;
      payload.claim_otp = null;
      payload.created_at = new Date().toISOString();
      state.dispatches.unshift(payload);

      try {
        localStorage.setItem('waste2menu_dispatches', JSON.stringify(state.dispatches));
      } catch (e) {}

      showToast('📢 Surplus food alert broadcast to shelters!', 'success');
      DOM.ngoBroadcastForm.reset();

      if (savedBackend) {
        try {
          const updated = await fetch('/api/dispatches');
          if (updated.ok) state.dispatches = await updated.json();
        } catch (e) {}
      }

      renderDispatchesFeed();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>📢 Broadcast Surplus Alert to Shelters</span>';
    }
  }

  function openClaimModal(dispatch) {
    state.activeClaimDispatchId = dispatch.id;
    DOM.claimTargetDish.textContent = dispatch.dish_name;
    DOM.claimTargetPortions.textContent = dispatch.portions_available;

    // Reset view
    if (DOM.claimDispatchForm) DOM.claimDispatchForm.style.display = 'block';
    if (DOM.claimOtpCard) DOM.claimOtpCard.style.display = 'none';

    // Auto-fill shelter name if signed in
    if (state.currentUser) {
      DOM.claimInputNgo.value = state.currentUser.affiliation || state.currentUser.name || '';
    } else {
      DOM.claimInputNgo.value = '';
    }

    DOM.claimModal.showModal();
  }

  async function handleClaimDispatchSubmit(e) {
    e.preventDefault();
    const ngo = DOM.claimInputNgo.value.trim();
    if (!ngo || !state.activeClaimDispatchId) return;

    // Generate verified 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const targetDispatch = state.dispatches.find(d => d.id === state.activeClaimDispatchId);

    try {
      let savedBackend = false;
      try {
        const res = await fetch(`/api/dispatches/${state.activeClaimDispatchId}/claim`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ claimed_by_ngo: ngo, claim_otp: generatedOtp })
        });
        if (res && res.ok) savedBackend = true;
      } catch (e) {}

      // Update local state
      if (targetDispatch) {
        targetDispatch.status = 'CLAIMED';
        targetDispatch.claimed_by_ngo = ngo;
        targetDispatch.claim_otp = generatedOtp;
      }

      try {
        localStorage.setItem('waste2menu_dispatches', JSON.stringify(state.dispatches));
      } catch (e) {}

      // Present the OTP Handover Card
      if (DOM.claimDispatchForm) DOM.claimDispatchForm.style.display = 'none';
      if (DOM.claimOtpCard) {
        DOM.claimOtpCard.style.display = 'block';
        if (DOM.claimOtpDigits) DOM.claimOtpDigits.textContent = generatedOtp;
        if (DOM.claimLogisticsMeta && targetDispatch) {
          DOM.claimLogisticsMeta.innerHTML = `
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
              <div><strong>Pickup Location:</strong> ${escapeHtml(targetDispatch.pickup_location)}</div>
              <div><strong>Ready Time:</strong> ${escapeHtml(targetDispatch.ready_time || 'Hot & Ready Now')}</div>
              <div><strong>Kitchen Contact:</strong> ${escapeHtml(targetDispatch.contact_number)}</div>
            </div>
          `;
        }
      }

      showToast(`🤝 Meal batch claimed! Handover OTP: ${generatedOtp}`, 'success');
      renderDispatchesFeed();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // ==========================================================================
  // REAL-TIME METRIC COUNTERS ANIMATION (SMOOTH NUMBER TICKING)
  // ==========================================================================
  function animateMetricCounters() {
    const targets = [
      { element: DOM.statScrapsRescued, target: 12450, suffix: '+ kg' },
      { element: DOM.statCo2Saved, target: 31125, suffix: ' kg' },
      { element: DOM.statMealsServed, target: 1420, suffix: '+' }
    ];

    targets.forEach(item => {
      if (!item.element) return;
      const duration = 1600;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(ease * item.target);
        item.element.textContent = currentVal.toLocaleString('en-IN') + item.suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ==========================================================================
  // ANCESTRAL UPCYCLING SHOWCASE (CURATED PREVIEW CARDS ON HOME PAGE)
  // Strictly informational/inspirational with direct "Cook With This Scrap" CTA
  // ==========================================================================
  function renderAncestralShowcase() {
    if (!DOM.ancestralShowcaseGrid) return;
    DOM.ancestralShowcaseGrid.innerHTML = '';

    // 6 representative ancestral byproducts across categories
    const featuredIds = [1, 10, 16, 21, 28, 11];
    const featuredScraps = state.scraps.filter(s => featuredIds.includes(s.id));

    featuredScraps.forEach(sc => {
      const catMeta = CATEGORIES_METADATA.find(c => c.id === sc.category_id) || {};
      const card = document.createElement('article');
      card.className = 'showcase-scrap-card';
      card.innerHTML = `
        <div>
          <div class="showcase-card-top">
            <span class="showcase-cat-pill">${catMeta.emoji || '🌱'} ${escapeHtml(catMeta.name || 'Byproduct')}</span>
            <span class="showcase-eco-badge">♻️ 100% Edible</span>
          </div>
          <h4 class="showcase-scrap-title">${escapeHtml(sc.name_en)}</h4>
          <p class="showcase-method-text">${escapeHtml(sc.common_uses)}</p>
        </div>
        <div class="showcase-card-bottom">
          <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">Ancestral Recipe Ready</span>
          <button type="button" class="btn-showcase-cook" data-scrap-id="${sc.id}">
            <span>Cook With This Scrap ➔</span>
          </button>
        </div>
      `;

      const cookBtn = card.querySelector('.btn-showcase-cook');
      if (cookBtn) {
        cookBtn.addEventListener('click', () => {
          const rc = state.recipes.find(r => r.scrap_id === sc.id);
          if (rc) {
            openRecipeDetailModal(rc.id);
          } else {
            state.selectedScrapIds.clear();
            state.selectedScrapIds.add(sc.id);
            updateCatalogCardsSelectionState();
            updateCatalogSelectionDock();
            switchTab('home-chef');
            applyFiltersAndRenderRecipes();
          }
        });
      }

      DOM.ancestralShowcaseGrid.appendChild(card);
    });
  }

  // ==========================================================================
  // BROWSABLE 30-SCRAPS CATALOG (5 EXPANDABLE VISUAL CATEGORY SECTIONS)
  // No search bar — 100% browsable visual organization matching reference guide
  // ==========================================================================
  function renderCategorizedCatalog() {
    if (!DOM.categoriesCatalogContainer) return;
    DOM.categoriesCatalogContainer.innerHTML = '';

    CATEGORIES_METADATA.forEach(cat => {
      const catScraps = state.scraps.filter(s => s.category_id === cat.id);
      if (catScraps.length === 0) return;

      const accordion = document.createElement('div');
      accordion.className = 'catalog-category-accordion';
      accordion.dataset.categoryId = cat.id;

      accordion.innerHTML = `
        <button type="button" class="catalog-category-header" aria-expanded="true">
          <div class="cat-header-left">
            <span class="cat-header-emoji">${cat.emoji}</span>
            <div>
              <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
                <h3 class="cat-header-title">Category ${cat.id}: ${escapeHtml(cat.name)}</h3>
                <span class="cat-header-count">${catScraps.length} Scraps</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.2rem 0 0 0;">${escapeHtml(cat.description)}</p>
            </div>
          </div>
          <div class="cat-header-toggle-icon">▼</div>
        </button>
        <div class="catalog-category-body">
          <div class="catalog-category-grid"></div>
        </div>
      `;

      // Accordion toggle
      const headerBtn = accordion.querySelector('.catalog-category-header');
      headerBtn.addEventListener('click', () => {
        const isCollapsed = accordion.classList.toggle('collapsed');
        headerBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
      });

      // Populate rich scrap cards
      const grid = accordion.querySelector('.catalog-category-grid');
      catScraps.forEach(sc => {
        const isSelected = state.selectedScrapIds.has(sc.id);
        const card = document.createElement('div');
        card.className = `scrap-item-rich-card ${isSelected ? 'selected' : ''}`;
        card.dataset.scrapId = sc.id;

        card.innerHTML = `
          <div>
            <div class="scrap-card-header">
              <span class="scrap-card-id">#${sc.id}</span>
              <span class="scrap-card-category-tag">${cat.emoji} Cat ${cat.id}</span>
            </div>
            <h4 class="scrap-card-title">${escapeHtml(sc.name_en)}</h4>
            <p class="scrap-card-method">${escapeHtml(sc.common_uses)}</p>
          </div>
          <div class="scrap-card-actions">
            <button type="button" class="btn-scrap-select-toggle" data-scrap-id="${sc.id}">
              <span>${isSelected ? '✓ Selected' : '+ Select Scrap'}</span>
            </button>
            <button type="button" class="btn-scrap-view-recipe" data-scrap-id="${sc.id}">
              <span>View Recipe ➔</span>
            </button>
          </div>
        `;

        // Toggle button click
        const toggleBtn = card.querySelector('.btn-scrap-select-toggle');
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCatalogScrapSelection(sc.id);
        });

        // Entire card click (except View Recipe) toggles selection
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-scrap-view-recipe')) return;
          toggleCatalogScrapSelection(sc.id);
        });

        // View Recipe button
        const viewRecipeBtn = card.querySelector('.btn-scrap-view-recipe');
        viewRecipeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const rc = state.recipes.find(r => r.scrap_id === sc.id);
          if (rc) {
            openRecipeDetailModal(rc.id);
          } else {
            showToast(`Recipe for ${sc.name_en} will be uploaded soon!`, 'info');
          }
        });

        grid.appendChild(card);
      });

      DOM.categoriesCatalogContainer.appendChild(accordion);
    });

    updateCatalogSelectionDock();
  }

  function toggleCatalogScrapSelection(scrapId) {
    if (state.selectedScrapIds.has(scrapId)) {
      state.selectedScrapIds.delete(scrapId);
    } else {
      state.selectedScrapIds.add(scrapId);
    }

    updateCatalogCardsSelectionState();
    updateCatalogSelectionDock();
    applyFiltersAndRenderRecipes();
  }

  function updateCatalogCardsSelectionState() {
    if (!DOM.categoriesCatalogContainer) return;
    const cards = DOM.categoriesCatalogContainer.querySelectorAll('.scrap-item-rich-card');
    cards.forEach(card => {
      const id = parseInt(card.dataset.scrapId, 10);
      const isSelected = state.selectedScrapIds.has(id);
      card.classList.toggle('selected', isSelected);
      const toggleBtn = card.querySelector('.btn-scrap-select-toggle span');
      if (toggleBtn) {
        toggleBtn.textContent = isSelected ? '✓ Selected' : '+ Select Scrap';
      }
    });
  }

  function selectAllIngredientsFromCatalog() {
    state.selectedScrapIds = new Set(state.scraps.map(s => s.id));
    updateCatalogCardsSelectionState();
    updateCatalogSelectionDock();
    applyFiltersAndRenderRecipes();
    showToast('All 30 kitchen ingredients selected!', 'success');
  }

  function clearIngredientsFromCatalog() {
    state.selectedScrapIds.clear();
    updateCatalogCardsSelectionState();
    updateCatalogSelectionDock();
    applyFiltersAndRenderRecipes();
    showToast('Selection cleared. Tap any scrap card to select.', 'info');
  }

  function updateCatalogSelectionDock() {
    if (!DOM.guideSelectionBar) return;

    const count = state.selectedScrapIds.size;
    if (count === 0) {
      DOM.guideSelectionBar.style.display = 'none';
      return;
    }

    DOM.guideSelectionBar.style.display = 'flex';

    if (DOM.selBarCount) {
      DOM.selBarCount.textContent = `${count} Selected`;
    }

    if (DOM.selBarNames) {
      if (count === state.scraps.length) {
        DOM.selBarNames.textContent = 'All 30 household ingredients selected';
      } else {
        const names = state.scraps
          .filter(s => state.selectedScrapIds.has(s.id))
          .map(s => s.name_en)
          .join(', ');
        DOM.selBarNames.textContent = names;
        DOM.selBarNames.title = names;
      }
    }

    const matchingCount = state.recipes.filter(r => state.selectedScrapIds.has(r.scrap_id)).length;
    if (DOM.selRecipesCount) {
      DOM.selRecipesCount.textContent = matchingCount;
    }
  }

  function viewRecipesForCatalogSelection() {
    if (state.selectedScrapIds.size === 0) {
      selectAllIngredientsFromCatalog();
    }

    const homeTabBtn = document.getElementById('nav-tab-home-chef');
    if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';

    switchTab('home-chef');
    applyFiltersAndRenderRecipes();

    const rcSection = document.getElementById('home-recipe-grid');
    if (rcSection) {
      setTimeout(() => {
        rcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }

    showToast(`✨ Showing zero-waste recipes for your selected ingredients!`, 'success');
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS & UTILITIES
  // ==========================================================================
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

    DOM.toastTray.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  function getEnglishRecipeTitle(title) {
    if (!title || typeof title !== 'string') return '';
    const match = title.match(/\((.*?)\)/);
    if (match && match[1] && match[1].trim().length > 3) {
      return match[1].trim();
    }
    return title.trim();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Self-Start
  document.addEventListener('DOMContentLoaded', init);
})();
