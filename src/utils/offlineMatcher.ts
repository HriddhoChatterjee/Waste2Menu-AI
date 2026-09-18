import { OfflineScrapRecipe, OfflineYieldResult, OfflineScrapCategory } from '../types';
import rawRecipes from '../data/scrapRecipes.json';

export const OFFLINE_SCRAP_RECIPES: OfflineScrapRecipe[] = rawRecipes as OfflineScrapRecipe[];

export interface ScrapInputEntry {
  category: OfflineScrapCategory;
  weightGrams: number;
}

/**
 * Pure JavaScript / TypeScript client-side greedy constraint solver.
 * Matches available scrap stockpiles against the pre-bundled regional database
 * and computes feasible portion counts, costs, and nutrition metrics with 0 network calls.
 */
export function matchOfflineRecipes(
  inputs: ScrapInputEntry[],
  recipes: OfflineScrapRecipe[] = OFFLINE_SCRAP_RECIPES
): OfflineYieldResult[] {
  if (!inputs || inputs.length === 0) return [];

  const results: OfflineYieldResult[] = [];

  // Group total grams by category
  const weightByCategory: Record<string, number> = {};
  for (const item of inputs) {
    if (item.weightGrams > 0) {
      weightByCategory[item.category] = (weightByCategory[item.category] || 0) + item.weightGrams;
    }
  }

  for (const recipe of recipes) {
    const availableGrams = weightByCategory[recipe.primaryScrapCategory] || 0;
    
    if (availableGrams >= recipe.minScrapGramsPerPortion) {
      const feasiblePortions = Math.floor(availableGrams / recipe.minScrapGramsPerPortion);
      const surplusGramsLeftover = availableGrams % recipe.minScrapGramsPerPortion;
      const totalPantryCostINR = Number((feasiblePortions * recipe.pantryCostINR).toFixed(2));
      const costPerPortionINR = recipe.pantryCostINR;

      const totalCalories = feasiblePortions * recipe.nutritionPerServing.calories;
      const totalProteinGrams = Number((feasiblePortions * recipe.nutritionPerServing.proteinGrams).toFixed(1));
      const totalFiberGrams = Number((feasiblePortions * recipe.nutritionPerServing.fiberGrams).toFixed(1));

      // Suitability score based on efficiency of scrap utilization and protein-per-rupee
      const utilizationRatio = (availableGrams - surplusGramsLeftover) / availableGrams;
      const proteinPerRupee = recipe.nutritionPerServing.proteinGrams / (recipe.pantryCostINR || 1);
      const suitabilityScore = Math.min(100, Math.round((utilizationRatio * 60) + (proteinPerRupee * 15) + (feasiblePortions > 1 ? 25 : 15)));

      results.push({
        recipe,
        feasiblePortions,
        totalPantryCostINR,
        costPerPortionINR,
        surplusGramsLeftover,
        totalCalories,
        totalProteinGrams,
        totalFiberGrams,
        suitabilityScore
      });
    }
  }

  // Sort by highest portions yielded, then highest protein
  return results.sort((a, b) => {
    if (b.feasiblePortions !== a.feasiblePortions) {
      return b.feasiblePortions - a.feasiblePortions;
    }
    return b.totalProteinGrams - a.totalProteinGrams;
  });
}

/**
 * Calculates portion yields and nutritional values for a single specific recipe.
 */
export function calculateSingleRecipeYield(
  recipe: OfflineScrapRecipe,
  weightGrams: number
): OfflineYieldResult {
  const feasiblePortions = Math.max(0, Math.floor(weightGrams / recipe.minScrapGramsPerPortion));
  const surplusGramsLeftover = Math.max(0, weightGrams % recipe.minScrapGramsPerPortion);
  const totalPantryCostINR = Number((feasiblePortions * recipe.pantryCostINR).toFixed(2));
  const costPerPortionINR = recipe.pantryCostINR;

  return {
    recipe,
    feasiblePortions,
    totalPantryCostINR,
    costPerPortionINR,
    surplusGramsLeftover,
    totalCalories: feasiblePortions * recipe.nutritionPerServing.calories,
    totalProteinGrams: Number((feasiblePortions * recipe.nutritionPerServing.proteinGrams).toFixed(1)),
    totalFiberGrams: Number((feasiblePortions * recipe.nutritionPerServing.fiberGrams).toFixed(1)),
    suitabilityScore: feasiblePortions > 0 ? 90 : 0
  };
}

/**
 * Map friendly metadata for scrap categories (icons, labels, and common uses)
 */
export interface CategoryVisualMeta {
  category: OfflineScrapCategory;
  labelEn: string;
  labelHi: string;
  labelTa: string;
  labelBn: string;
  iconSvg: string;
  colorBg: string;
  colorBorder: string;
  defaultServingGrams: number;
}

export const CATEGORY_VISUAL_REGISTRY: Record<OfflineScrapCategory, CategoryVisualMeta> = {
  ridge_gourd_peels: {
    category: 'ridge_gourd_peels',
    labelEn: 'Ridge Gourd Peels',
    labelHi: 'तोरई के छिलके',
    labelTa: 'பீர்க்கங்காய் தோல்',
    labelBn: 'ঝিঙের খোসা',
    iconSvg: '🥒',
    colorBg: 'bg-emerald-50 text-emerald-900',
    colorBorder: 'border-emerald-300',
    defaultServingGrams: 200
  },
  vegetable_trimmings: {
    category: 'vegetable_trimmings',
    labelEn: 'Veg Trimmings & Peels',
    labelHi: 'सब्जी के छिलके व डंठल',
    labelTa: 'காய்கறி கழிவுகள்',
    labelBn: 'সবজির খোসা ও বোঁটা',
    iconSvg: '🥕',
    colorBg: 'bg-amber-50 text-amber-900',
    colorBorder: 'border-amber-300',
    defaultServingGrams: 250
  },
  stale_roti_bread: {
    category: 'stale_roti_bread',
    labelEn: 'Stale Roti / Bread',
    labelHi: 'बासी रोटी / ब्रेड',
    labelTa: 'பழைய ரொட்டி / பிரட்',
    labelBn: 'বাসি রুটি / পাউরুটি',
    iconSvg: '🍞',
    colorBg: 'bg-yellow-50 text-yellow-900',
    colorBorder: 'border-yellow-300',
    defaultServingGrams: 200
  },
  leftover_rice: {
    category: 'leftover_rice',
    labelEn: 'Leftover Rice',
    labelHi: 'बचे हुए पके चावल',
    labelTa: 'மீதமான சாதம்',
    labelBn: 'বেঁচে যাওয়া ভাত',
    iconSvg: '🍚',
    colorBg: 'bg-stone-50 text-stone-900',
    colorBorder: 'border-stone-300',
    defaultServingGrams: 300
  },
  cauliflower_stalks: {
    category: 'cauliflower_stalks',
    labelEn: 'Cauliflower Stalks & Leaves',
    labelHi: 'फूलगोभी के डंठल व पत्ते',
    labelTa: 'காலிஃபிளவர் தண்டு',
    labelBn: 'ফুলকপির ডাঁটা ও পাতা',
    iconSvg: '🥦',
    colorBg: 'bg-lime-50 text-lime-900',
    colorBorder: 'border-lime-300',
    defaultServingGrams: 250
  },
  watermelon_rind: {
    category: 'watermelon_rind',
    labelEn: 'Watermelon White Rind',
    labelHi: 'तरबूज का सफेद छिलका',
    labelTa: 'தர்பூசணி தோல்',
    labelBn: 'তরমুজের সাদা খোসা',
    iconSvg: '🍉',
    colorBg: 'bg-rose-50 text-rose-900',
    colorBorder: 'border-rose-300',
    defaultServingGrams: 300
  },
  potato_peels: {
    category: 'potato_peels',
    labelEn: 'Potato Peels & Skins',
    labelHi: 'आलू के साफ छिलके',
    labelTa: 'உருளைக்கிழங்கு தோல்',
    labelBn: 'আলুর খোসা',
    iconSvg: '🥔',
    colorBg: 'bg-amber-50 text-amber-900',
    colorBorder: 'border-amber-300',
    defaultServingGrams: 200
  },
  dal_water: {
    category: 'dal_water',
    labelEn: 'Dal Boiling Broth',
    labelHi: 'दाल का उबला पानी',
    labelTa: 'பருப்பு வேகவைத்த நீர்',
    labelBn: 'ডাল সেদ্ধ জল',
    iconSvg: '🥣',
    colorBg: 'bg-orange-50 text-orange-900',
    colorBorder: 'border-orange-300',
    defaultServingGrams: 400
  },
  herb_stems: {
    category: 'herb_stems',
    labelEn: 'Coriander/Mint Stems',
    labelHi: 'धनिया व पुदीना डंठल',
    labelTa: 'கொத்தமல்லி தண்டு',
    labelBn: 'ধনেপাতা বোঁটা',
    iconSvg: '🌿',
    colorBg: 'bg-emerald-50 text-emerald-900',
    colorBorder: 'border-emerald-300',
    defaultServingGrams: 100
  },
  poultry_bones: {
    category: 'poultry_bones',
    labelEn: 'Bone Fragments & Trim',
    labelHi: 'हड्डियां व कटिंग टुकड़े',
    labelTa: 'எலும்பு துண்டுகள்',
    labelBn: 'হাড়ের টুকরো',
    iconSvg: '🍖',
    colorBg: 'bg-red-50 text-red-900',
    colorBorder: 'border-red-300',
    defaultServingGrams: 350
  },
  citrus_peels: {
    category: 'citrus_peels',
    labelEn: 'Lemon & Orange Rinds',
    labelHi: 'नींबू व संतरे के छिलके',
    labelTa: 'எலுமிச்சை தோல்',
    labelBn: 'লেবুর খোসা',
    iconSvg: '🍋',
    colorBg: 'bg-yellow-50 text-yellow-900',
    colorBorder: 'border-yellow-300',
    defaultServingGrams: 150
  },
  onion_skins: {
    category: 'onion_skins',
    labelEn: 'Red Onion Skins & Roots',
    labelHi: 'लाल प्याज के सूखे छिलके',
    labelTa: 'வெங்காயத் தோல்',
    labelBn: 'পেঁয়াজের লাল খোসা',
    iconSvg: '🧅',
    colorBg: 'bg-purple-50 text-purple-900',
    colorBorder: 'border-purple-300',
    defaultServingGrams: 100
  }
};
