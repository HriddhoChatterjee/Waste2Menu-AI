export type Role = 'prep' | 'recipes' | 'pos' | 'ngo' | 'analytics';

export type ScrapCategory = 
  | 'poultry_bones' 
  | 'mirepoix_peels' 
  | 'citrus_rinds' 
  | 'herb_stems' 
  | 'fish_frames' 
  | 'bread_crusts';

export interface ScrapItem {
  id: string;
  name: string;
  category: ScrapCategory;
  weightKg: number;
  perishableHoursLeft: number;
  maxPerishableHours: number;
  timestamp: string;
  qualityScore: number; // 0-100
  detectedFromVision: boolean;
  notes?: string;
}

export interface VisionDetection {
  id: string;
  label: string;
  category: ScrapCategory;
  confidence: number; // e.g. 0.94
  estimatedMassKg: number;
  bbox: {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    w: number;
    h: number;
  };
  color: string;
}

export interface PantryIngredient {
  name: string;
  inStock: boolean;
  qty: string;
}

export interface RecipeDish {
  id: string;
  title: string;
  category: string;
  scrapTypeNeeded: ScrapCategory;
  scrapWeightNeededKg: number;
  yieldPortions: number;
  prepTimeMins: number;
  pantryIngredients: PantryIngredient[];
  rawByproductCost: number; // ₹0
  seasoningGasCost: number; // ₹ per portion
  suggestedPrice: number;   // ₹ per portion
  marginPercent: number;    // e.g. 92.7%
  description: string;
  flavorProfile: string;
  chefTips: string;
  instructions: string[];
  tags: string[];
  status: 'ready_to_cook' | 'approved_to_pos' | 'insufficient_scrap';
}

export interface ActiveSpecialSKU {
  id: string;
  recipeId: string;
  title: string;
  initialPortions: number;
  remainingPortions: number;
  basePrice: number;
  discountedPrice: number;
  discountPercent: number;
  category: string;
  isSoldOut: boolean;
  pushedTimestamp: string;
  expiryTimestamp: string;
  isSurplusSentToNgo: boolean;
  description: string;
  badgeTag: string;
}

export interface RegularMenuItem {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  isAvailable: boolean;
}

export interface CartItem {
  id: string;
  skuId?: string;
  isSpecial: boolean;
  title: string;
  price: number;
  quantity: number;
  maxAvailable?: number;
}

export interface CompletedOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  timestamp: string;
  cashierName: string;
  paymentMethod: 'Card' | 'UPI' | 'Cash';
}

export interface NgoBatch {
  id: string;
  specialSkuId: string;
  dishName: string;
  portionsAvailable: number;
  safeConsumptionHours: number;
  restaurantDistanceKm: number;
  ngoName?: string;
  status: 'broadcast' | 'claimed' | 'verified_handed_over';
  pickupOtp: string;
  claimedAt?: string;
  verifiedAt?: string;
  tempControlStatus: 'Chilled (<4°C)' | 'Hot Held (>63°C)' | 'Ambient (<2h)';
  pickupContact: string;
  address: string;
}

export interface StaffBenchmark {
  id: string;
  cookName: string;
  station: string;
  dishPrepared: string;
  coreWeightKg: number;
  trimLossKg: number;
  lossPercent: number;
  benchmarkLossPercent: number;
  status: 'optimal' | 'moderate' | 'high_loss_anomaly';
  shiftDate: string;
}

export interface AppNotification {
  id: string;
  type: 
    | 'scrap_scanned' 
    | 'recipe_unlocked' 
    | 'pos_pushed' 
    | 'pos_ordered' 
    | 'stock_depleted' 
    | 'flash_markdown' 
    | 'ngo_broadcast' 
    | 'ngo_claimed' 
    | 'ngo_verified';
  title: string;
  message: string;
  timestamp: string;
  roleTarget: Role | 'all';
  read: boolean;
}
