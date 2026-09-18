import React, { useState, useEffect } from 'react';
import { RecipeDish } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Clock, 
  ChefHat, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Utensils, 
  Play, 
  Pause, 
  RotateCcw, 
  Share2, 
  Printer, 
  Flame, 
  Scale, 
  ShieldCheck, 
  Leaf, 
  AlertCircle,
  TrendingUp,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';

interface RecipeDetailModalProps {
  recipe: RecipeDish | null;
  isOpen: boolean;
  onClose: () => void;
  onCookCompleted?: (dish: RecipeDish, portions: number) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onCookCompleted
}) => {
  const { userProfile, setUserProfile } = useAppStore();

  if (!isOpen || !recipe) return null;

  // Portion scaler state (defaults to recipe's yieldPortions or 4)
  const basePortions = recipe.yieldPortions || 4;
  const [portions, setPortions] = useState<number>(basePortions);

  // Checked pantry ingredients
  const [checkedPantry, setCheckedPantry] = useState<Record<string, boolean>>({});

  // Completed steps tracking
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // In-step timer state
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [activeTimerStepIdx, setActiveTimerStepIdx] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // "I Cooked This" success state
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Reset local state when recipe changes
  useEffect(() => {
    setPortions(recipe.yieldPortions || 4);
    setCheckedPantry({});
    setCompletedSteps({});
    setTimerSecondsLeft(null);
    setActiveTimerStepIdx(null);
    setIsTimerRunning(false);
    setHasCelebrated(false);
  }, [recipe.id]);

  // Timer interval hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sounds.playSuccessChime();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // Scaled calculations
  const scaleRatio = portions / basePortions;
  const scaledScrapWeightKg = (recipe.scrapWeightNeededKg * scaleRatio).toFixed(2);
  const costPerPortion = recipe.seasoningGasCost || (recipe.suggestedPrice * 0.08);
  const totalMealCost = (costPerPortion * portions).toFixed(1);

  // Equipment estimation based on recipe instructions
  const getEquipmentList = (r: RecipeDish) => {
    const list: string[] = ['Chef’s Knife & Board'];
    const text = (r.instructions.join(' ') + ' ' + r.title).toLowerCase();
    if (text.includes('blend') || text.includes('immersion') || text.includes('grind')) {
      list.push('High-Speed Blender / Grinder');
    }
    if (text.includes('simmer') || text.includes('boil') || text.includes('stockpot')) {
      list.push('Heavy-Bottom Stockpot');
    }
    if (text.includes('roast') || text.includes('oven') || text.includes('bake')) {
      list.push('Baking Sheet / Combi-Oven');
    }
    if (text.includes('strain') || text.includes('chinoise') || text.includes('mesh')) {
      list.push('Fine Chinois Mesh Strainer');
    }
    if (text.includes('fry') || text.includes('sauté') || text.includes('pan') || text.includes('sweat')) {
      list.push('Cast Iron Skillet / Kadai');
    }
    return list;
  };

  const equipment = getEquipmentList(recipe);

  // Handle step check toggle
  const toggleStep = (idx: number) => {
    sounds.playTap();
    setCompletedSteps((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      return next;
    });
  };

  // Start timer for a step
  const handleStartTimer = (stepIdx: number, minutes: number) => {
    sounds.playTap();
    setActiveTimerStepIdx(stepIdx);
    setTimerSecondsLeft(minutes * 60);
    setIsTimerRunning(true);
  };

  // Format timer MM:SS
  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // "I Cooked This" celebration
  const handleCookCompleted = () => {
    sounds.playSuccessChime();
    setHasCelebrated(true);

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}

    const savedKg = parseFloat(scaledScrapWeightKg);
    setUserProfile({
      savedFoodKg: Number(((userProfile?.savedFoodKg || 12.4) + savedKg).toFixed(1)),
      recipesCreatedCount: (userProfile?.recipesCreatedCount || 0) + 1
    });

    if (onCookCompleted) {
      onCookCompleted(recipe, portions);
    }
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    sounds.playTap();
    const message = `🌿 Waste2Menu Zero-Waste Recipe: *${recipe.title}*\nTransforms ${scaledScrapWeightKg}kg of ${recipe.scrapTypeNeeded.replace('_', ' ')} into ${portions} delicious portions!\nPrep time: ${recipe.prepTimeMins}m\nEstimated Pantry Cost: ₹${totalMealCost} total (₹${costPerPortion.toFixed(1)}/plate).\nCheck out Waste2Menu AI!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedStepsCount / recipe.instructions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center items-start p-3 sm:p-5 pt-12 sm:pt-16 pb-16 animate-in fade-in zoom-in-95 duration-200 print:p-0 print:static print:bg-white">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-4xl w-full shadow-2xl relative overflow-hidden print:shadow-none print:border-none">
        
        {/* Sticky Top Header Bar */}
        <div className="sticky top-0 z-20 bg-[#FFFDF9]/95 backdrop-blur-md px-6 py-4 border-b border-[#E8DFD1] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              {recipe.category}
            </span>
            <span className="text-xs font-mono text-stone-500 hidden sm:inline">
              • Masterclass Step-by-Step Guide
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareWhatsApp}
              title="Share Recipe via WhatsApp"
              className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-[#E8DFD1] transition-colors shadow-xs"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              title="Print Recipe Card"
              className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-[#E8DFD1] transition-colors shadow-xs hidden sm:flex"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* 1. Hero Recipe Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image */}
            <div className="md:col-span-5">
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#E8DFD1] shadow-md bg-stone-100 group">
                <img
                  src={recipe.imageUrl || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                  <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 font-bold">
                    ⏱️ {recipe.prepTimeMins} mins
                  </span>
                  <span className="bg-emerald-700/90 backdrop-blur-xs px-2.5 py-1 rounded-lg font-bold">
                    {recipe.marginPercent}% Margin
                  </span>
                </div>
              </div>
            </div>

            {/* Title & Key Highlights */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-amber-700" />
                  <span>{recipe.author || 'Executive Chef Curated'}</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Zero-Waste Valorization
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-stone-900 leading-tight">
                {recipe.title}
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                {recipe.description}
              </p>

              {/* Portion Scaler Stepper */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">
                    Adjust Portions to Scale Recipe
                  </span>
                  <span className="text-xs font-heading font-bold text-stone-800">
                    Serves {portions} people (auto-scaled measurements)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      if (portions > 2) setPortions(portions - 2);
                    }}
                    disabled={portions <= 2}
                    className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD1] text-stone-700 font-bold hover:bg-stone-100 disabled:opacity-40 transition-all flex items-center justify-center shadow-xs"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-heading font-black text-base text-emerald-800">
                    {portions}
                  </span>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      if (portions < 24) setPortions(portions + 2);
                    }}
                    className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD1] text-stone-700 font-bold hover:bg-stone-100 transition-all flex items-center justify-center shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD1] space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-semibold block">Required Scrap Input</span>
              <strong className="text-base font-heading font-black text-emerald-700 block">
                {scaledScrapWeightKg} kg
              </strong>
              <span className="text-[10px] text-stone-500 block capitalize">
                {recipe.scrapTypeNeeded.replace('_', ' ')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD1] space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-semibold block">Total Prep Cost</span>
              <strong className="text-base font-heading font-black text-stone-900 block">
                ₹{totalMealCost}
              </strong>
              <span className="text-[10px] text-emerald-600 block">
                (₹{costPerPortion.toFixed(1)} / serving)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD1] space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-semibold block">Cooking Time</span>
              <strong className="text-base font-heading font-black text-amber-700 block">
                {recipe.prepTimeMins} mins
              </strong>
              <span className="text-[10px] text-stone-500 block">Fast turnaround</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD1] space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-semibold block">Flavor Character</span>
              <strong className="text-xs font-heading font-bold text-violet-800 line-clamp-1 block">
                {recipe.flavorProfile.split(',')[0]}
              </strong>
              <span className="text-[10px] text-stone-500 block">Chef signature</span>
            </div>
          </div>

          {/* 3. Ingredients Checklist & Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Ingredients Checklist (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-stone-900 text-sm flex items-center space-x-1.5">
                  <Utensils className="w-4 h-4 text-emerald-700" />
                  <span>Interactive Ingredients Checklist</span>
                </h3>
                <span className="text-[10px] font-mono text-stone-400">
                  Check items as you prep
                </span>
              </div>

              {/* Byproduct Scrap Highlight */}
              <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">
                      Primary Kitchen Byproduct (Scrap)
                    </span>
                    <strong className="text-xs font-heading font-black text-emerald-950 capitalize">
                      {recipe.scrapTypeNeeded.replace('_', ' ')}
                    </strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    {scaledScrapWeightKg} kg
                  </span>
                  <span className="text-[9px] font-mono text-emerald-600 block">
                    Zero-Cost Byproduct
                  </span>
                </div>
              </div>

              {/* Pantry Staples List */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-stone-400 block">
                  Pantry Staples & Seasonings (Scaled for {portions} Servings)
                </span>
                <div className="space-y-1.5">
                  {recipe.pantryIngredients.map((ing, i) => {
                    const isChecked = !!checkedPantry[ing.name];
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          sounds.playTap();
                          setCheckedPantry((prev) => ({ ...prev, [ing.name]: !isChecked }));
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-emerald-50/50 border-emerald-300 text-stone-500 line-through'
                            : 'bg-white border-[#E8DFD1] hover:border-emerald-400 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-xs font-sans font-medium">{ing.name}</span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-stone-500">
                          {ing.qty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Equipment & Nutrition (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Equipment Needed */}
              <div className="bg-white p-4.5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2.5">
                <span className="text-xs font-heading font-bold text-stone-900 block">
                  🍳 Required Kitchen Equipment
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8DFD1] text-[11px] font-mono text-stone-700"
                    >
                      • {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nutrition Estimations */}
              <div className="bg-white p-4.5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2.5">
                <span className="text-xs font-heading font-bold text-stone-900 block">
                  🥗 Nutritional Highlights (Per Portion)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E8DFD1]">
                    <span className="text-[10px] text-stone-400 block">Calories</span>
                    <strong className="text-stone-800">120 - 180 kcal</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E8DFD1]">
                    <span className="text-[10px] text-stone-400 block">Dietary Fiber</span>
                    <strong className="text-emerald-700">4.5g (High)</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E8DFD1]">
                    <span className="text-[10px] text-stone-400 block">Digestive Minerals</span>
                    <strong className="text-amber-700">Zinc & Iron</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E8DFD1]">
                    <span className="text-[10px] text-stone-400 block">Pantry Cost</span>
                    <strong className="text-stone-900">₹{costPerPortion.toFixed(1)}</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* 4. Interactive Step-by-Step Cooking Guide */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD1] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block">
                  Step-by-Step Culinary Procedure
                </span>
                <h3 className="font-heading font-black text-stone-900 text-lg">
                  Master Chef Cooking Instructions
                </h3>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-700 block">
                    {completedStepsCount} of {recipe.instructions.length} Steps
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                    {progressPercent}% Complete
                  </span>
                </div>
                <div className="w-24 h-2.5 rounded-full bg-stone-100 border border-[#E8DFD1] overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3.5">
              {recipe.instructions.map((step, idx) => {
                const isStepDone = !!completedSteps[idx];
                const isTimerActiveForThis = activeTimerStepIdx === idx;

                // Extract estimated minutes from step text if mentioned (e.g. "15 minutes" or "18 minutes")
                const match = step.match(/(\d+)\s*(?:minutes|mins|min)/i);
                const stepMinutes = match ? parseInt(match[1]) : (idx === 0 ? 5 : 10);

                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isStepDone
                        ? 'bg-stone-50 border-stone-200 opacity-75'
                        : 'bg-white border-[#E8DFD1] hover:border-emerald-400 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      
                      {/* Step Content */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                            isStepDone 
                              ? 'bg-stone-200 text-stone-600' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            Step {idx + 1}
                          </span>

                          <span className="text-xs font-mono text-stone-400">
                            • Approx. {stepMinutes} mins
                          </span>

                          {isStepDone && (
                            <span className="text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>

                        <p className={`text-xs sm:text-sm font-sans leading-relaxed ${
                          isStepDone ? 'text-stone-500 line-through' : 'text-stone-800'
                        }`}>
                          {step}
                        </p>

                        {/* Step Timer Controller */}
                        <div className="flex items-center space-x-2 pt-1">
                          {isTimerActiveForThis && timerSecondsLeft !== null ? (
                            <div className="inline-flex items-center space-x-2 bg-emerald-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono shadow-sm">
                              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                              <span className="font-bold text-sm">
                                {formatTimer(timerSecondsLeft)}
                              </span>
                              <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="p-1 rounded hover:bg-emerald-800"
                                title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                              >
                                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                              </button>
                              <button
                                onClick={() => {
                                  setTimerSecondsLeft(stepMinutes * 60);
                                  setIsTimerRunning(false);
                                }}
                                className="p-1 rounded hover:bg-emerald-800"
                                title="Reset Timer"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartTimer(idx, stepMinutes)}
                              className="text-[11px] font-mono font-semibold text-stone-600 hover:text-emerald-700 bg-[#FAF7F2] hover:bg-emerald-50 border border-[#E8DFD1] px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1.5"
                            >
                              <Clock className="w-3 h-3 text-stone-400" />
                              <span>Start {stepMinutes}m Step Timer</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Step Toggle Action */}
                      <button
                        onClick={() => toggleStep(idx)}
                        className={`p-2 rounded-xl border font-bold text-xs transition-all shrink-0 flex items-center space-x-1.5 ${
                          isStepDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white hover:bg-emerald-50 border-stone-300 text-stone-700'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {isStepDone ? 'Completed' : 'Mark Done'}
                        </span>
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Chef Secret Tips & Preservation Science */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.chefTips && (
              <div className="p-4.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Master Chef Secret Tip</span>
                </div>
                <p className="text-xs font-sans text-amber-900 leading-relaxed">
                  {recipe.chefTips}
                </p>
              </div>
            )}

            <div className="p-4.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-900">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <span>Zero-Waste Preservation & Storage</span>
              </div>
              <p className="text-xs font-sans text-emerald-900 leading-relaxed">
                Cool completely before storing in an airtight glass container. Keeps refrigerated at &lt;4°C for up to 4 days, or freeze in ice cubes for up to 3 months.
              </p>
            </div>
          </div>

          {/* 6. Cook Completion & Food Diversion Action */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-200">
                  Circular Gastronomy Milestone
                </span>
                <h3 className="text-xl font-heading font-black">
                  Finished Preparing This Masterpiece?
                </h3>
                <p className="text-xs text-emerald-100 max-w-xl">
                  Log your prepared dish to update your environmental diversion counter and record {scaledScrapWeightKg} kg saved from landfill.
                </p>
              </div>

              <button
                onClick={handleCookCompleted}
                disabled={hasCelebrated}
                className="btn-shimmer px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-heading font-black text-xs shadow-md transition-all shrink-0 flex items-center space-x-2 active:scale-95 disabled:opacity-80"
              >
                {hasCelebrated ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Saved {scaledScrapWeightKg} kg of Food!</span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4 text-emerald-700" />
                    <span>I Made This Dish!</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
