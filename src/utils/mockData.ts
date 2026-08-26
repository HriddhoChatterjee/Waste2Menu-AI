import { ScrapItem, RecipeDish, RegularMenuItem, StaffBenchmark, ActiveSpecialSKU, NgoBatch } from '../types';

export const INITIAL_SCRAPS: ScrapItem[] = [
  {
    id: 'scrap-1',
    name: 'Poultry Carcass & Wing Tips',
    category: 'poultry_bones',
    weightKg: 2.4,
    perishableHoursLeft: 6.8,
    maxPerishableHours: 8.0,
    timestamp: '2026-08-25T11:30:00Z',
    qualityScore: 96,
    detectedFromVision: true,
    notes: 'Free-range chicken prep from lunch butter chicken prep line.'
  },
  {
    id: 'scrap-2',
    name: 'Mirepoix Ends & Onion/Carrot Skins',
    category: 'mirepoix_peels',
    weightKg: 3.1,
    perishableHoursLeft: 10.4,
    maxPerishableHours: 12.0,
    timestamp: '2026-08-25T12:15:00Z',
    qualityScore: 92,
    detectedFromVision: true,
    notes: 'Washed and sanitized roots, rich in aromatic oils.'
  },
  {
    id: 'scrap-3',
    name: 'Meyer Lemon & Valencia Orange Rinds',
    category: 'citrus_rinds',
    weightKg: 1.2,
    perishableHoursLeft: 18.0,
    maxPerishableHours: 24.0,
    timestamp: '2026-08-25T13:00:00Z',
    qualityScore: 98,
    detectedFromVision: false,
    notes: 'Bar prep byproducts, un-waxed organic citrus.'
  },
  {
    id: 'scrap-4',
    name: 'Cilantro, Parsley & Mint Stems',
    category: 'herb_stems',
    weightKg: 0.9,
    perishableHoursLeft: 5.2,
    maxPerishableHours: 8.0,
    timestamp: '2026-08-25T13:45:00Z',
    qualityScore: 89,
    detectedFromVision: true,
    notes: 'Herb stems from chutney station; intense chlorophyll essence.'
  },
  {
    id: 'scrap-5',
    name: 'Artisan Sourdough Heel Crusts',
    category: 'bread_crusts',
    weightKg: 1.5,
    perishableHoursLeft: 28.0,
    maxPerishableHours: 36.0,
    timestamp: '2026-08-25T10:00:00Z',
    qualityScore: 94,
    detectedFromVision: false,
    notes: 'Bakery station morning trim.'
  }
];

export const INITIAL_RECIPES: RecipeDish[] = [
  {
    id: 'rec-1',
    title: 'Slow-Roasted Peppercorn Bone Broth',
    category: 'Soups & Potages',
    scrapTypeNeeded: 'poultry_bones',
    scrapWeightNeededKg: 1.8,
    yieldPortions: 14,
    prepTimeMins: 45,
    pantryIngredients: [
      { name: 'Filtered Spring Water', inStock: true, qty: '4.5 L' },
      { name: 'Crushed Tellicherry Peppercorns', inStock: true, qty: '30 g' },
      { name: 'Charred Bay Leaf & Sea Salt', inStock: true, qty: '20 g' },
      { name: 'Cold-Pressed Mustard Oil (Drops)', inStock: true, qty: '15 ml' }
    ],
    rawByproductCost: 0,
    seasoningGasCost: 6.50,
    suggestedPrice: 89.00,
    marginPercent: 92.7,
    description: 'Rich, collagen-infused deep amber broth slow-simmered with roasted bone scraps and whole peppercorns.',
    flavorProfile: 'Umami-rich, warming black pepper punch, silky lip-coating finish',
    chefTips: 'Roast bones at 220°C for 15 mins before boiling for maximal caramelization and clear stock.',
    instructions: [
      'Preheat rational combi-oven to 220°C with 10% moisture.',
      'Spread poultry carcass across perforated sheet pans and roast for 18 minutes until deeply bronzed.',
      'Transfer roasted bones into 10L stockpot, cover with filtered water, bay leaf, and crushed peppercorns.',
      'Simmer on gentle induction heat (92°C) for 35 minutes; strain through fine chinoise mesh.',
      'Season with sea salt, finish with droplets of cold-pressed mustard oil, ladle into heated ceramic bowls.'
    ],
    tags: ['High Margin (92.7%)', 'Zero-Waste Hero', 'Collagen Rich', 'Chef Choice'],
    status: 'ready_to_cook'
  },
  {
    id: 'rec-2',
    title: 'Crispy Mirepoix Skin & Roasted Garlic Potage',
    category: 'Soups & Potages',
    scrapTypeNeeded: 'mirepoix_peels',
    scrapWeightNeededKg: 1.5,
    yieldPortions: 12,
    prepTimeMins: 30,
    pantryIngredients: [
      { name: 'Roasted Garlic Cloves', inStock: true, qty: '80 g' },
      { name: 'Cultured Butter / Vegan Ghee', inStock: true, qty: '50 g' },
      { name: 'Smoked Paprika & Thyme', inStock: true, qty: '10 g' },
      { name: 'Cream / Oat Cream (Optional)', inStock: true, qty: '100 ml' }
    ],
    rawByproductCost: 0,
    seasoningGasCost: 5.00,
    suggestedPrice: 79.00,
    marginPercent: 93.7,
    description: 'Velvety rustic potage prepared from thoroughly caramelized vegetable peels, roasted garlic paste, and fresh thyme.',
    flavorProfile: 'Earthy, sweet caramelized allium, gentle smoked paprika undertone',
    chefTips: 'Flash fry 10% of the crispy carrot peels in oil at 180°C to create crunchy edible garnish.',
    instructions: [
      'Sweat mirepoix trims with brown butter in a tilted bratt pan for 12 minutes.',
      'Add roasted garlic cloves and smoked paprika; deglaze with light vegetable stock.',
      'Emulsify at high velocity with immersion blender until silky smooth.',
      'Season to taste and top with fried crisp carrot threads and herb oil.'
    ],
    tags: ['Vegan Friendly', 'High Margin (93.7%)', 'Fast Prep (30m)'],
    status: 'ready_to_cook'
  },
  {
    id: 'rec-3',
    title: 'Candied Citrus Rind & Spiced Honey Glaze Wings',
    category: 'Small Plates & Bar Bites',
    scrapTypeNeeded: 'citrus_rinds',
    scrapWeightNeededKg: 0.8,
    yieldPortions: 10,
    prepTimeMins: 25,
    pantryIngredients: [
      { name: 'Raw Forest Honey', inStock: true, qty: '120 ml' },
      { name: 'Cider Vinegar & Ginger Pulp', inStock: true, qty: '40 ml' },
      { name: 'Toasted Sesame & Chili Flakes', inStock: true, qty: '25 g' },
      { name: 'Soy Sauce Reduction', inStock: true, qty: '30 ml' }
    ],
    rawByproductCost: 0,
    seasoningGasCost: 7.20,
    suggestedPrice: 119.00,
    marginPercent: 93.9,
    description: 'Zesty, sticky sweet glaze crafted by blanching citrus rinds in spiced honey and apple cider reduction.',
    flavorProfile: 'Sticky sweet, tangy citrus zest, mild heat, glossy sheen',
    chefTips: 'Double blanch rinds in boiling water first to eliminate bitter pith oils while keeping fragrance.',
    instructions: [
      'Julienne citrus peels into fine needles (1mm).',
      'Blanch twice in boiling water for 90 seconds, plunge in ice water.',
      'Simmer blanched peels in honey and cider vinegar until translucent and syrupy (12 mins).',
      'Toss with crisped appetizers or grilled proteins; finish with sesame and micro herbs.'
    ],
    tags: ['Bar Favorite', 'High Revenue Per Portion', 'Quick Prep'],
    status: 'ready_to_cook'
  },
  {
    id: 'rec-4',
    title: 'Charred Herb Stem Chimichurri Flatbread Dip',
    category: 'Small Plates & Bar Bites',
    scrapTypeNeeded: 'herb_stems',
    scrapWeightNeededKg: 0.6,
    yieldPortions: 12,
    prepTimeMins: 15,
    pantryIngredients: [
      { name: 'Extra Virgin Olive Oil', inStock: true, qty: '150 ml' },
      { name: 'Red Wine Vinegar & Cumin', inStock: true, qty: '35 ml' },
      { name: 'Minced Birds Eye Chili & Shallot', inStock: true, qty: '30 g' },
      { name: 'Coarse Sea Salt', inStock: true, qty: '10 g' }
    ],
    rawByproductCost: 0,
    seasoningGasCost: 3.50,
    suggestedPrice: 55.00,
    marginPercent: 93.6,
    description: 'Bright, herbaceous and punchy green salsa made by quick-charring aromatic herb stems and pulsing with cold olive oil.',
    flavorProfile: 'Zippy acid, fresh herbal bite, smoky char note, grassy olive oil',
    chefTips: 'Keep olive oil ice-cold during pulsing to prevent heat friction from turning the herbs brown.',
    instructions: [
      'Briefly toast herb stems on open flame gridiron for 20 seconds to impart woodsmoke aroma.',
      'Rough chop and blend with shallots, red wine vinegar, and bird’s eye chili.',
      'Slowly stream in extra virgin olive oil to create a vibrant green emulsion.',
      'Rest for 10 minutes at ambient temperature; serve with warm sourdough crisps.'
    ],
    tags: ['15-Min Flash Prep', 'Zero Energy Cost', 'High Table Turn'],
    status: 'ready_to_cook'
  },
  {
    id: 'rec-5',
    title: 'Spiced Sourdough Heel Crisps & Whipped Labneh',
    category: 'Starters & Sides',
    scrapTypeNeeded: 'bread_crusts',
    scrapWeightNeededKg: 1.0,
    yieldPortions: 10,
    prepTimeMins: 20,
    pantryIngredients: [
      { name: 'Garlic Herb Clarified Butter', inStock: true, qty: '60 g' },
      { name: 'Zaatar Spice & Sumac Blend', inStock: true, qty: '25 g' },
      { name: 'Fresh Labneh / Greek Yogurt', inStock: true, qty: '200 g' },
      { name: 'Pomegranate Arils', inStock: true, qty: '40 g' }
    ],
    rawByproductCost: 0,
    seasoningGasCost: 4.50,
    suggestedPrice: 69.00,
    marginPercent: 93.5,
    description: 'Wafer-thin golden sourdough chips tossed in zaatar spice, served alongside creamy citrus whipped labneh.',
    flavorProfile: 'Crunchy, tangy sourdough tang, aromatic herb butter crunch',
    chefTips: 'Freeze heel bread for 20 mins before mandoline slicing for paper-thin consistent chips.',
    instructions: [
      'Slice bread heel remnants 2mm thin using serrated deli slicer.',
      'Brush with garlic herb clarified butter and dust with zaatar spice.',
      'Bake at 170°C for 12 minutes until shatteringly crisp.',
      'Serve alongside whipped salted labneh crowned with pomegranate arils.'
    ],
    tags: ['Crunch Factor', 'Crowd Pleaser', 'Zero Prep Waste'],
    status: 'ready_to_cook'
  }
];

export const INITIAL_SPECIALS: ActiveSpecialSKU[] = [
  {
    id: 'sku-special-1',
    recipeId: 'rec-1',
    title: 'Slow-Roasted Peppercorn Bone Broth',
    initialPortions: 14,
    remainingPortions: 9,
    basePrice: 89.00,
    discountedPrice: 89.00,
    discountPercent: 0,
    category: 'Daily Special',
    isSoldOut: false,
    pushedTimestamp: '2026-08-25T12:30:00Z',
    expiryTimestamp: '2026-08-25T23:00:00Z',
    isSurplusSentToNgo: false,
    description: 'Collagen-rich broth slow simmered from today’s butchery trims & Tellicherry pepper.',
    badgeTag: '🔥 ONLY 9 PORTIONS LEFT'
  },
  {
    id: 'sku-special-2',
    recipeId: 'rec-4',
    title: 'Charred Herb Stem Chimichurri Dip',
    initialPortions: 12,
    remainingPortions: 3,
    basePrice: 55.00,
    discountedPrice: 55.00,
    discountPercent: 0,
    category: 'Daily Special',
    isSoldOut: false,
    pushedTimestamp: '2026-08-25T13:10:00Z',
    expiryTimestamp: '2026-08-25T22:30:00Z',
    isSurplusSentToNgo: false,
    description: 'Vibrant green chimichurri emulsion made from today’s fresh coriander & mint stems.',
    badgeTag: '⚡ CRITICAL SCARCITY (3 LEFT)'
  },
  {
    id: 'sku-special-3',
    recipeId: 'rec-5',
    title: 'Spiced Sourdough Heel Crisps',
    initialPortions: 10,
    remainingPortions: 0,
    basePrice: 69.00,
    discountedPrice: 69.00,
    discountPercent: 0,
    category: 'Daily Special',
    isSoldOut: true,
    pushedTimestamp: '2026-08-25T11:00:00Z',
    expiryTimestamp: '2026-08-25T21:00:00Z',
    isSurplusSentToNgo: false,
    description: 'Zaatar-baked artisan sourdough chips with lemon-whipped labneh.',
    badgeTag: 'SOLD OUT'
  }
];

export const REGULAR_MENU_ITEMS: RegularMenuItem[] = [
  {
    id: 'reg-1',
    title: 'Smoked Butter Chicken Supreme',
    category: 'Main Entrees',
    price: 349.00,
    description: 'Tender chicken morsels in velvet sun-dried tomato and cashew butter reduction.',
    isAvailable: true
  },
  {
    id: 'reg-2',
    title: 'Paneer Tikka Charcoal Bowl',
    category: 'Main Entrees',
    price: 299.00,
    description: 'Clay-oven charred cottage cheese cubes with mint emulsion and roomali roll.',
    isAvailable: true
  },
  {
    id: 'reg-3',
    title: 'Dum Biryani with Awadhi Raita',
    category: 'Main Entrees',
    price: 379.00,
    description: 'Fragrant aged Basmati rice layered with spiced cuts, saffron and rosewater.',
    isAvailable: true
  },
  {
    id: 'reg-4',
    title: 'Truffle & Garlic Naan Basket',
    category: 'Starters & Sides',
    price: 129.00,
    description: 'Tandoor leavened flatbread glazed with black truffle ghee and toasted garlic.',
    isAvailable: true
  },
  {
    id: 'reg-5',
    title: 'Dal Makhani Slow-Simmered (24h)',
    category: 'Main Entrees',
    price: 249.00,
    description: 'Black lentils slow cooked overnight on charcoal embers with white butter.',
    isAvailable: true
  },
  {
    id: 'reg-6',
    title: 'Kokum & Kaffir Lime Refresher',
    category: 'Beverages',
    price: 119.00,
    description: 'Artisanal fizzy digestive cooler with crushed pink peppercorn salt.',
    isAvailable: true
  }
];

export const INITIAL_NGO_BATCHES: NgoBatch[] = [
  {
    id: 'ngo-batch-101',
    specialSkuId: 'sku-special-1',
    dishName: 'Slow-Roasted Peppercorn Bone Broth',
    portionsAvailable: 8,
    safeConsumptionHours: 4.5,
    restaurantDistanceKm: 2.3,
    ngoName: 'Robin Hood Army - Central Hub',
    status: 'claimed',
    pickupOtp: '739204',
    claimedAt: '2026-08-25T21:40:00Z',
    tempControlStatus: 'Hot Held (>63°C)',
    pickupContact: '+91 98201 44521 (Rohan V.)',
    address: 'Waste2Menu Kitchen #4, Brigade Gateway Plaza, Bangalore'
  },
  {
    id: 'ngo-batch-102',
    specialSkuId: 'sku-special-2',
    dishName: 'Charred Herb Stem Chimichurri Flatbread Packs',
    portionsAvailable: 6,
    safeConsumptionHours: 6.0,
    restaurantDistanceKm: 4.1,
    status: 'broadcast',
    pickupOtp: '481902',
    tempControlStatus: 'Chilled (<4°C)',
    pickupContact: 'Kitchen Duty Mgr (+91 97110 39912)',
    address: 'Waste2Menu Kitchen #4, Brigade Gateway Plaza, Bangalore'
  }
];

export const STAFF_BENCHMARKS: StaffBenchmark[] = [
  {
    id: 'staff-1',
    cookName: 'Chef Rajesh Sharma',
    station: 'Poultry & Butchery',
    dishPrepared: 'Butter Chicken Bone-In Cut',
    coreWeightKg: 8.4,
    trimLossKg: 0.9,
    lossPercent: 9.7,
    benchmarkLossPercent: 12.0,
    status: 'optimal',
    shiftDate: '2026-08-25'
  },
  {
    id: 'staff-2',
    cookName: 'Cook Imran Khan',
    station: 'Vegetable Mirepoix',
    dishPrepared: 'Root Mirepoix Base',
    coreWeightKg: 12.0,
    trimLossKg: 1.8,
    lossPercent: 13.0,
    benchmarkLossPercent: 15.0,
    status: 'optimal',
    shiftDate: '2026-08-25'
  },
  {
    id: 'staff-3',
    cookName: 'Apprentice Devendra',
    station: 'Citrus & Bar Prep',
    dishPrepared: 'Fresh Lemon & Lime Squeeze',
    coreWeightKg: 4.2,
    trimLossKg: 1.6,
    lossPercent: 27.5,
    benchmarkLossPercent: 18.0,
    status: 'high_loss_anomaly',
    shiftDate: '2026-08-25'
  },
  {
    id: 'staff-4',
    cookName: 'Chef Ananya Roy',
    station: 'Fish Monger',
    dishPrepared: 'Sea Bass Filleting',
    coreWeightKg: 6.5,
    trimLossKg: 1.1,
    lossPercent: 14.5,
    benchmarkLossPercent: 16.0,
    status: 'optimal',
    shiftDate: '2026-08-25'
  },
  {
    id: 'staff-5',
    cookName: 'Line Cook Sunita P.',
    station: 'Herb & Chutney Line',
    dishPrepared: 'Coriander & Mint Prep',
    coreWeightKg: 3.5,
    trimLossKg: 0.8,
    lossPercent: 18.6,
    benchmarkLossPercent: 15.0,
    status: 'moderate',
    shiftDate: '2026-08-25'
  }
];

export const MOCK_VISION_SCANS: { label: string; detections: { label: string; category: import('../types').ScrapCategory; confidence: number; estimatedMassKg: number; bbox: { x: number; y: number; w: number; h: number }; color: string }[] }[] = [
  {
    label: 'Chicken Carcass & Bone Trims',
    detections: [
      { label: 'Chicken Carcass & Ribs', category: 'poultry_bones', confidence: 0.95, estimatedMassKg: 1.8, bbox: { x: 18, y: 22, w: 42, h: 48 }, color: '#10B981' },
      { label: 'Wing Tips & Neck Bone', category: 'poultry_bones', confidence: 0.89, estimatedMassKg: 0.6, bbox: { x: 62, y: 35, w: 26, h: 36 }, color: '#34d399' }
    ]
  },
  {
    label: 'Mixed Mirepoix & Root Peels',
    detections: [
      { label: 'Red Onion Trims & Tops', category: 'mirepoix_peels', confidence: 0.94, estimatedMassKg: 1.2, bbox: { x: 15, y: 18, w: 32, h: 40 }, color: '#8B5CF6' },
      { label: 'Carrot Peels & Crowns', category: 'mirepoix_peels', confidence: 0.91, estimatedMassKg: 0.9, bbox: { x: 50, y: 20, w: 36, h: 32 }, color: '#F59E0B' },
      { label: 'Celery Base & Leaves', category: 'mirepoix_peels', confidence: 0.88, estimatedMassKg: 0.7, bbox: { x: 28, y: 55, w: 48, h: 35 }, color: '#10B981' }
    ]
  },
  {
    label: 'Citrus Rinds & Fresh Herb Stems',
    detections: [
      { label: 'Valencia Orange Peels', category: 'citrus_rinds', confidence: 0.97, estimatedMassKg: 0.8, bbox: { x: 20, y: 25, w: 35, h: 45 }, color: '#F59E0B' },
      { label: 'Cilantro & Mint Stems', category: 'herb_stems', confidence: 0.92, estimatedMassKg: 0.5, bbox: { x: 58, y: 28, w: 30, h: 42 }, color: '#10B981' }
    ]
  }
];
