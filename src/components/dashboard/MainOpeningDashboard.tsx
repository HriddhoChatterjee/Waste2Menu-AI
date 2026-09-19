import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { RecipeDish, ScrapCategory } from '../../types';
import { 
  Sparkles, 
  Leaf, 
  TrendingUp, 
  HeartHandshake, 
  Droplets, 
  Wind, 
  ChefHat, 
  UploadCloud, 
  ArrowRight, 
  Clock, 
  Percent, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Award, 
  Users, 
  UtensilsCrossed, 
  LogOut, 
  LogIn,
  Sliders,
  Scale,
  CreditCard,
  Camera,
  X,
  Check,
  Coins,
  Eye
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { ScrollReveal } from '../common/ScrollReveal';
import { RecipeDetailModal } from '../recipes/RecipeDetailModal';
import { BusinessModelModal } from '../business/BusinessModelModal';

export const MainOpeningDashboard: React.FC = () => {
  const { 
    recipes, 
    scraps, 
    completedOrders, 
    ngoBatches, 
    setRole, 
    userPersona, 
    userProfile, 
    isAuthenticated, 
    signOut, 
    openAuthModal 
  } = useAppStore();

  // Interactive Live Calculator state
  const [calculatorScrapKg, setCalculatorScrapKg] = useState<number>(15);
  // Interactive Pipeline Step state
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  // Quick Dish Inspector Modal state
  const [inspectingDish, setInspectingDish] = useState<RecipeDish | null>(null);
  // Business Model Modal state
  const [isBizModelOpen, setIsBizModelOpen] = useState<boolean>(false);

  const totalScrapDiverted = scraps.reduce((acc, s) => acc + s.weightKg, 0) + 128.5;
  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0) + 42500;
  const totalDonatedMeals = ngoBatches
    .filter((b) => b.status === 'verified_handed_over')
    .reduce((acc, b) => acc + b.portionsAvailable, 0) + 64;

  const co2AvoidedKg = totalScrapDiverted * 2.5;
  const waterSavedLiters = Math.round(totalScrapDiverted * 128);

  // Dynamic ROI Calculations
  const calcMonthlyRevenue = Math.round(calculatorScrapKg * 30 * 140 * 0.92);
  const calcAnnualDivertedKg = Math.round(calculatorScrapKg * 365);
  const calcCo2PreventedKg = Math.round(calcAnnualDivertedKg * 2.5);
  const calcAnnualDonatedMeals = Math.round(calculatorScrapKg * 30 * 4);

  // Category breakdown for foods saved
  const foodSavedCategories = [
    {
      name: 'Mirepoix & Vegetable Peels',
      emoji: '🥕',
      quantityKg: 44.5,
      color: 'emerald',
      dishesCount: '3 Chef Recipes',
      popularDish: 'Roasted Mirepoix Vegetable Jus',
      percentage: 31
    },
    {
      name: 'Poultry Carcasses & Bones',
      emoji: '🍗',
      quantityKg: 38.2,
      color: 'amber',
      dishesCount: '2 Chef Recipes',
      popularDish: 'Slow-Roasted Peppercorn Bone Broth',
      percentage: 26
    },
    {
      name: 'Sourdough Crusts & Trimmings',
      emoji: '🍞',
      quantityKg: 26.8,
      color: 'stone',
      dishesCount: '2 Chef Recipes',
      popularDish: 'Sourdough Breadcrumb Gnocchi',
      percentage: 19
    },
    {
      name: 'Meyer Citrus Rinds & Peels',
      emoji: '🍋',
      quantityKg: 18.5,
      color: 'amber',
      dishesCount: '2 Chef Recipes',
      popularDish: 'Candied Citrus Peel Glaze',
      percentage: 13
    },
    {
      name: 'Chlorophyll Herb Stems',
      emoji: '🌿',
      quantityKg: 14.8,
      color: 'emerald',
      dishesCount: '2 Chef Recipes',
      popularDish: 'Charred Herb Stem Chimichurri',
      percentage: 10
    }
  ];

  // 5-Stage Interactive Circular Pipeline stages
  const pipelineStages = [
    {
      step: '01',
      title: 'Vision Scrap Scan',
      subtitle: 'Cutting-Board Ingestion',
      icon: <Camera className="w-5 h-5 text-emerald-700" />,
      badge: '98.4% Confidence',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Upload or snap a photo of prep trims. Multi-class neural network models segment mirepoix peels, bones, crusts, and herbs in milliseconds.'
    },
    {
      step: '02',
      title: 'Weight Calibration',
      subtitle: 'Gram-Level Precision',
      icon: <Scale className="w-5 h-5 text-amber-700" />,
      badge: 'Stockpile Sync',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Adjust weights in kilograms with tactile step controls. The system logs items to the live perishable inventory reservoir with shelf-life timers.'
    },
    {
      step: '03',
      title: 'Reverse Recipe OS',
      subtitle: 'Master-Chef Matching',
      icon: <ChefHat className="w-5 h-5 text-emerald-700" />,
      badge: '93.7% Margin',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Algorithm pairs byproduct weights with pantry staples (oils, seasonings, garlic) to formulate rich stocks, velvety potages, and crunchy garnishes.'
    },
    {
      step: '04',
      title: 'POS Dynamic Specials',
      subtitle: 'Real-Time Menu Deployment',
      icon: <CreditCard className="w-5 h-5 text-violet-700" />,
      badge: 'Scarcity Engine',
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
      description: 'Chefs push high-margin specials to cashier POS stations with real-time portion decrement, dynamic flash markdown sliders, and revenue recovery.'
    },
    {
      step: '05',
      title: 'Surplus NGO Rescue',
      subtitle: 'Verified Shelter Handover',
      icon: <HeartHandshake className="w-5 h-5 text-rose-700" />,
      badge: 'OTP Verified',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Unsold portions at shift end automatically broadcast to verified food rescue shelters with 4-digit tamper-proof OTP driver verification.'
    }
  ];

  // Dish cards for the slow scrolling marquee (duplicated for seamless infinite loop)
  const marqueeDishes = [...recipes, ...recipes];

  return (
    <div className="space-y-16">

      {/* 1. Hero Presentation Section (#overview) */}
      <ScrollReveal direction="up" distance={24} duration={0.6}>
        <section id="overview" className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#FFFDF9] to-[#FAF7F2] border border-[#E8DFD1] p-8 sm:p-12 shadow-sm scroll-mt-24">
          
          {/* Decorative Floating Culinary Emblems on Desktop */}
          <div className="hidden lg:block absolute top-8 left-8 z-10 pointer-events-none animate-float">
            <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#E8DFD1] shadow-lg flex items-center space-x-3">
              <span className="text-2xl p-2 rounded-xl bg-amber-50 border border-amber-200">🥕</span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block">Upcycled Hero</span>
                <p className="font-heading font-black text-xs text-stone-900">Roasted Mirepoix Jus</p>
                <span className="text-[9px] font-mono text-stone-500 font-semibold">+92.7% Margin</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute top-8 right-8 z-10 pointer-events-none animate-float-reverse">
            <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#E8DFD1] shadow-lg flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block">Verified Diversion</span>
                <p className="font-heading font-black text-xs text-stone-900">142.8 kg Diverted</p>
                <span className="text-[9px] font-mono text-stone-500 font-semibold">Zero Landfill Waste</span>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            
            {/* Opening Philosophical Quote - In the Beginning */}
            <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 border border-emerald-300/70 text-stone-800 shadow-xs backdrop-blur-md animate-float transition-all hover:scale-105 group cursor-default">
              <span className="text-base animate-leaf-sway">🌱</span>
              <span className="font-heading italic font-black text-xs sm:text-sm text-stone-900 tracking-wide">
                “In nature, nothing is lost, everything is transformed.”
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300/80 shadow-xs">
                Antoine Lavoisier
              </span>
            </div>

            {/* Live Ecosystem Pulsing Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span>AI-Driven Circular Gastronomy & Food Rescue Ecosystem</span>
            </div>

            {/* Main Title with Radiant Gradient Shimmer */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-stone-900 tracking-tight leading-tight">
              Turn Kitchen Prep Scraps Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-amber-600 to-emerald-700 bg-clip-text text-transparent animate-gradient-shift">
                High-Margin Culinary Masterpieces
              </span>
            </h1>

            {/* Mission Description */}
            <p className="text-base sm:text-lg text-stone-600 font-sans max-w-2xl mx-auto leading-relaxed">
              <span className="font-bold text-stone-900">Not a food delivery app</span> — Waste2Menu AI is an enterprise Circular KitchenOS and Zero-Waste Recipe Engine. Commercial kitchens cut wholesale food costs by 18.4% by transforming prep trimmings into high-margin daily specials, while home cooks select what leftovers they have to instantly unlock master-crafted step-by-step recipes.
            </p>

            {/* Featured Quote Showcase - After Description with Beautiful Ambient Animation */}
            <div className="max-w-2xl mx-auto my-6 relative group">
              {/* Background ambient glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-amber-400/25 to-emerald-400/20 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow-soft"></div>
              
              <div className="relative px-6 py-5 sm:px-8 sm:py-6 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-emerald-500/30 animate-quote-aura shadow-sm text-center transition-all duration-300 group-hover:border-emerald-500/60 group-hover:-translate-y-0.5">
                
                {/* Decorative Quotation Marks */}
                <div className="absolute -top-3 left-6 px-2 bg-[#FFFDF9] text-emerald-600 text-2xl font-serif leading-none select-none">
                  “
                </div>
                <div className="absolute -bottom-4 right-6 px-2 bg-[#FFFDF9] text-amber-600 text-2xl font-serif leading-none select-none">
                  ”
                </div>

                <div className="space-y-2">
                  <p className="font-heading italic font-black text-lg sm:text-2xl text-stone-900 tracking-tight leading-snug animate-quote-shimmer">
                    “In nature, nothing is lost, everything is transformed.”
                  </p>

                  <div className="flex items-center justify-center space-x-2 text-xs text-stone-600 font-mono">
                    <span className="h-px w-6 bg-emerald-400/60"></span>
                    <span className="font-bold text-stone-800 tracking-wider uppercase text-[11px]">Antoine Lavoisier</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-emerald-700 font-sans italic text-xs">Law of Conservation of Mass & Circular Gastronomy</span>
                    <span className="h-px w-6 bg-emerald-400/60"></span>
                  </div>
                </div>

                {/* Sub-pills: Micro-impact reflection */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 mt-1 border-t border-stone-200/60">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                    <span>🔄</span>
                    <span>100% Upcycled Biomass</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                    <span>⚡</span>
                    <span>Zero Landfill Waste</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-violet-50 text-violet-800 border border-violet-200 flex items-center space-x-1">
                    <span>⚖️</span>
                    <span>Culinary Energy Equilibrium</span>
                  </span>
                </div>

              </div>
            </div>

            {/* Action CTAs with Radiant Shimmer */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {isAuthenticated ? (
                userPersona === 'chef' ? (
                  <>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setRole('recipes');
                      }}
                      className="btn-shimmer w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-black text-sm shadow-md hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <ChefHat className="w-4 h-4 text-emerald-200" />
                      <span>Chef Studio: Author & Manage Recipes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        sounds.playTap();
                        setRole('prep');
                      }}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 border border-[#E8DFD1] font-heading font-bold text-sm shadow-xs hover:border-emerald-400 transition-all flex items-center justify-center space-x-2"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
                      <span>Prep Station & Scrap Intake</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setRole('user_recipes');
                      }}
                      className="btn-shimmer w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-black text-sm shadow-md hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <ChefHat className="w-4 h-4 text-emerald-200" />
                      <span>Interactive Ingredient Matcher & Recipes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        sounds.playTap();
                        setRole('prep');
                      }}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 border border-[#E8DFD1] font-heading font-bold text-sm shadow-xs hover:border-emerald-400 transition-all flex items-center justify-center space-x-2"
                    >
                      <UploadCloud className="w-4 h-4 text-emerald-700" />
                      <span>Camera Scan Leftovers</span>
                    </button>
                  </>
                )
              ) : (
                <>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setRole('user_recipes');
                    }}
                    className="btn-shimmer w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-black text-sm shadow-md hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Try Ingredient Selector & Recipes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      setIsBizModelOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-heading font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Coins className="w-4 h-4 text-amber-700" />
                    <span>Commercial Business Model & ROI</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      openAuthModal('signin');
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 border border-[#E8DFD1] font-heading font-bold text-xs shadow-xs hover:border-emerald-400 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <LogIn className="w-4 h-4 text-emerald-700" />
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Credibility Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-stone-500">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>91.4% Landfill Diversion</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>UN SDG 12.3 Compliant</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Vision Ingredient Extraction</span>
              </div>
            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* 2. Interactive Circularity & Margin Calculator Widget */}
      <ScrollReveal direction="up" distance={28} duration={0.6} delay={0.05}>
        <section className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden space-y-6">
        {/* Subtle background luxury glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-700/60 pb-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive ROI & Impact Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight">
              Simulate Your Kitchen's Circular Dividends
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-sans mt-1">
              Drag the daily scrap quantity to compute your monthly recaptured profit and ecological savings.
            </p>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex items-center space-x-2 shrink-0">
            {[
              { label: 'Small Bistro (5kg)', val: 5 },
              { label: 'Busy Kitchen (15kg)', val: 15 },
              { label: 'Banquet Hall (35kg)', val: 35 }
            ].map((preset) => (
              <button
                key={preset.val}
                onClick={() => {
                  sounds.playTap();
                  setCalculatorScrapKg(preset.val);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  calculatorScrapKg === preset.val
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider Controls & Live Readouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Slider Control (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-stone-400 uppercase font-bold">
                Daily Prep Trims & Scraps:
              </span>
              <span className="text-3xl font-heading font-black text-emerald-400">
                {calculatorScrapKg} <span className="text-sm font-normal text-stone-400">kg / day</span>
              </span>
            </div>

            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={calculatorScrapKg}
              onChange={(e) => {
                setCalculatorScrapKg(parseInt(e.target.value) || 5);
              }}
              className="w-full h-3 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            />

            <div className="flex justify-between text-[10px] font-mono text-stone-400">
              <span>2 kg (Home / Café)</span>
              <span>25 kg (Mid-Scale)</span>
              <span>50 kg (Commercial Dining)</span>
            </div>
          </div>

          {/* Right Live Stat Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-stone-800/80 border border-stone-700/80 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                Monthly Profit
              </span>
              <div className="text-xl sm:text-2xl font-heading font-black text-emerald-400">
                ₹{calcMonthlyRevenue.toLocaleString()}
              </div>
              <span className="text-[9px] font-mono text-stone-500 block">
                92% upcycled margin
              </span>
            </div>

            <div className="bg-stone-800/80 border border-stone-700/80 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                Annual Diversion
              </span>
              <div className="text-xl sm:text-2xl font-heading font-black text-amber-400">
                {calcAnnualDivertedKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
              </div>
              <span className="text-[9px] font-mono text-stone-500 block">
                Zero landfill landfilling
              </span>
            </div>

            <div className="bg-stone-800/80 border border-stone-700/80 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                CO₂e Prevented
              </span>
              <div className="text-xl sm:text-2xl font-heading font-black text-sky-400">
                {calcCo2PreventedKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
              </div>
              <span className="text-[9px] font-mono text-stone-500 block">
                2.5x EPA conversion
              </span>
            </div>

            <div className="bg-stone-800/80 border border-stone-700/80 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                Rescued Meals
              </span>
              <div className="text-xl sm:text-2xl font-heading font-black text-violet-400">
                {calcAnnualDonatedMeals.toLocaleString()} <span className="text-xs font-normal">pts</span>
              </div>
              <span className="text-[9px] font-mono text-stone-500 block">
                Direct to partner NGOs
              </span>
            </div>

          </div>

        </div>
      </section>
      </ScrollReveal>

      {/* 3. Horizontal Slow-Scrolling Marquee of Dishes (#dishes) */}
      <ScrollReveal direction="up" distance={28} duration={0.6}>
        <section id="dishes" className="space-y-4 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase text-emerald-700 tracking-wider">
                  Continuous Culinary Showcase
                </span>
              </div>
              <h2 className="text-2xl font-heading font-black text-stone-900 mt-1">
                ✨ Upcycled Dishes Designed by Master Chefs
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                Hover to pause • Click any dish card to inspect full chef recipe, instructions, and profit breakdown
              </p>
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  sounds.playTap();
                  setRole(userPersona === 'chef' ? 'recipes' : 'user_recipes');
                }}
                className="text-xs font-mono text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 shrink-0 group"
              >
                <span>View Full Recipe Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playTap();
                  openAuthModal('signin');
                }}
                className="text-xs font-mono text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 shrink-0 group"
              >
                <span>Sign In to Unlock Recipes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* Outer Marquee Viewport with Soft Fade Masks */}
          <div className="relative overflow-hidden w-full py-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-16 before:bg-gradient-to-r before:from-[#FAF7F2] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-16 after:bg-gradient-to-l after:from-[#FAF7F2] after:to-transparent after:z-10">
            <div className="flex gap-5 animate-marquee-slow w-max">
              {marqueeDishes.map((dish, idx) => (
                <div
                  key={`${dish.id}-${idx}`}
                  onClick={() => {
                    sounds.playTap();
                    setInspectingDish(dish);
                  }}
                  className="w-80 shrink-0 bg-white border border-[#E8DFD1] rounded-2xl p-5 shadow-xs hover:shadow-xl hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between space-y-3 group card-3d-hover cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {dish.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 text-amber-500" />
                        <span>{dish.marginPercent}% Margin</span>
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-stone-900 text-base mt-2 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {dish.title}
                    </h3>

                    {/* Dish Photography Thumbnail */}
                    {dish.imageUrl && (
                      <div className="w-full h-32 rounded-xl overflow-hidden my-2 border border-[#E8DFD1] bg-stone-100 relative">
                        <img 
                          src={dish.imageUrl} 
                          alt={dish.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-[10px] font-mono text-white flex items-center gap-1 font-bold">
                            <Eye className="w-3 h-3" /> Click to Inspect Recipe
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#E8DFD1] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{dish.prepTimeMins}m prep</span>
                    </div>

                    <div className="font-bold text-emerald-700">
                      ₹{dish.suggestedPrice.toFixed(0)} <span className="text-[10px] font-normal text-stone-400">/ portion</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-2 rounded-xl text-[11px] font-mono text-stone-600 flex items-center justify-between">
                    <span className="text-stone-400 text-[10px] uppercase">Scrap Input:</span>
                    <span className="font-bold text-stone-800">
                      {dish.scrapWeightNeededKg} kg ({dish.scrapTypeNeeded.replace('_', ' ')})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 4. Food Saved by This Process (#impact) */}
      <section id="impact" className="space-y-6 scroll-mt-24">
        <ScrollReveal direction="up" distance={20}>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Impact Ledger
              </span>
              <span className="text-xs font-mono text-stone-500">• Quantified Diversion Metrics</span>
            </div>
            <h2 className="text-2xl font-heading font-black text-stone-900 mt-1">
              🌱 Quantity of Foods Saved by This Process
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Directly diverted from commercial landfill streams and repurposed into nutrition & revenue
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Top Level Impact Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScrollReveal direction="up" distance={24} delay={0}>
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2 card-3d-hover border-glow-emerald h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500 uppercase font-semibold">Total Scraps Saved</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Leaf className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-heading font-black text-emerald-700">
                {totalScrapDiverted.toFixed(1)} <span className="text-sm font-normal text-stone-500">kg</span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                91.4% diverted vs kitchen benchmark
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={24} delay={0.08}>
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2 card-3d-hover border-glow-emerald h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500 uppercase font-semibold">CO₂e Avoided</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Wind className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-heading font-black text-emerald-700">
                {co2AvoidedKg.toFixed(1)} <span className="text-sm font-normal text-stone-500">kg</span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                2.5x GHG conversion factor
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={24} delay={0.16}>
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2 card-3d-hover border-glow-violet h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500 uppercase font-semibold">Meals Rescued & Donated</span>
                <div className="p-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-200">
                  <HeartHandshake className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-heading font-black text-violet-700">
                {totalDonatedMeals} <span className="text-sm font-normal text-stone-500">portions</span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Direct to verified NGO shelters
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={24} delay={0.24}>
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2 card-3d-hover border-glow-amber h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500 uppercase font-semibold">Virtual Water Saved</span>
                <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-heading font-black text-sky-700">
                {waterSavedLiters.toLocaleString()} <span className="text-sm font-normal text-stone-500">L</span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Agricultural embedded moisture
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Breakdown by Food Category Cards with 3D Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {foodSavedCategories.map((item, idx) => (
            <ScrollReveal key={item.name} direction="up" distance={24} delay={idx * 0.07}>
              <div className="bg-white border border-[#E8DFD1] rounded-2xl p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-4 card-3d-hover h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1]">
                        {item.emoji}
                      </span>
                      <div>
                        <h3 className="font-heading font-bold text-stone-900 text-sm">
                          {item.name}
                        </h3>
                        <span className="text-[10px] font-mono text-stone-500">
                          Signature: {item.popularDish}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-4">
                    <span className="text-xs font-mono text-stone-500">Repurposed Mass:</span>
                    <span className="text-2xl font-heading font-black text-emerald-700">
                      {item.quantityKg} <span className="text-xs font-normal text-stone-500">kg</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-stone-500">
                      <span>Share of Total Diversion</span>
                      <span className="font-bold text-stone-800">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F2] border border-[#E8DFD1] overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage * 2.5}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-stone-600 border-t border-stone-100 pt-2">
                    <span>Available recipes:</span>
                    <span className="font-bold text-emerald-700">{item.dishesCount}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. Interactive 5-Stage Circular Pipeline (#how-it-works) */}
      <section id="how-it-works" className="bg-[#FFFDF9] border border-[#E8DFD1] p-8 sm:p-10 rounded-3xl space-y-8 shadow-xs scroll-mt-24">
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-emerald-700 tracking-wider">
              Closed-Loop Circular Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-stone-900">
              How Waste2Menu AI Works
            </h2>
            <p className="text-xs text-stone-500">
              Click any step to inspect our 5-stage automated computer vision and circular gastronomy pipeline
            </p>
          </div>
        </ScrollReveal>

        {/* Pipeline Stage Buttons */}
        <ScrollReveal direction="up" distance={24} delay={0.06}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {pipelineStages.map((stage, idx) => {
              const isActive = activePipelineStep === idx;
              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setActivePipelineStep(idx);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    isActive 
                      ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/40' 
                      : 'bg-[#FAF7F2] border-[#E8DFD1] hover:bg-white hover:border-emerald-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-400">
                      STAGE {stage.step}
                    </span>
                    {stage.icon}
                  </div>
                  <h4 className="font-heading font-bold text-sm text-stone-900 line-clamp-1">
                    {stage.title}
                  </h4>
                  <span className="text-[10px] font-mono text-stone-500 block mt-0.5">
                    {stage.subtitle}
                  </span>

                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-600 rotate-45" />
                  )}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Active Stage Highlight Card */}
        <ScrollReveal direction="up" distance={24} delay={0.12}>
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2] border border-[#E8DFD1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${pipelineStages[activePipelineStep].badgeColor}`}>
                  {pipelineStages[activePipelineStep].badge}
                </span>
                <span className="text-xs font-mono text-stone-500 font-semibold">
                  Stage {pipelineStages[activePipelineStep].step} of 05
                </span>
              </div>
              <h3 className="text-xl font-heading font-black text-stone-900">
                {pipelineStages[activePipelineStep].title} — {pipelineStages[activePipelineStep].subtitle}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed max-w-2xl">
                {pipelineStages[activePipelineStep].description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  sounds.playTap();
                  const next = (activePipelineStep + 1) % pipelineStages.length;
                  setActivePipelineStep(next);
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-heading font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5.5 Commercial B2B Business Model & Monetization Engine Section */}
      <ScrollReveal direction="up" distance={24}>
        <section className="bg-gradient-to-br from-white via-[#FFFDF9] to-[#FAF7F2] border border-[#E8DFD1] p-6 sm:p-10 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFD1] pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-700" />
                <span>B2B Commercial Architecture & Revenue Model</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-stone-900">
                Not a Food Delivery App — A Circular Kitchen Profit Engine
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-2xl leading-relaxed">
                Hospitality kitchens throw away 18%–25% of all purchased food. Waste2Menu empowers chefs to monetize prep trimmings into high-margin daily specials, claim CSR tax deductions, and automate ESG compliance.
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                setIsBizModelOpen(true);
              }}
              className="btn-shimmer px-5 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-black text-xs shadow-md transition-all flex items-center space-x-2 shrink-0 active:scale-95"
            >
              <Coins className="w-4 h-4 text-emerald-200" />
              <span>Inspect B2B Unit Economics & SaaS Tiers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Pillars of Commercial Monetization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2 card-3d-hover">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                18%
              </div>
              <h4 className="font-heading font-bold text-stone-900 text-sm">Food Procurement Savings</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Commercial kitchens stop purchasing pre-made vegetable stocks, soup bases, and glazes by upcycling on-premise scraps.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2 card-3d-hover">
              <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center font-bold text-sm">
                92%
              </div>
              <h4 className="font-heading font-bold text-stone-900 text-sm">Daily Special Margins</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Byproducts carry zero raw acquisition cost. Daily specials deployed to the POS generate pure gross revenue.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2 card-3d-hover">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                80G
              </div>
              <h4 className="font-heading font-bold text-stone-900 text-sm">Automated CSR Tax Credits</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Unsold portions at shift end automatically dispatch to partner shelters, generating tamper-proof 80G tax receipts.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2 card-3d-hover">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                ESG
              </div>
              <h4 className="font-heading font-bold text-stone-900 text-sm">Scope 3 Emission Certs</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Full compliance with ISO 14001 and UN SDG 12.3 audits, positioning enterprise restaurant chains for sustainability incentives.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. Kitchen & Home Suites Comparison Section (#suites) */}
      <section id="suites" className="space-y-6 scroll-mt-24">
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-emerald-700 tracking-wider">
              Workspace Solutions
            </span>
            <h2 className="text-2xl font-heading font-black text-stone-900">
              Designed for Commercial Kitchens & Home Cooks
            </h2>
            <p className="text-xs text-stone-500">
              Sign in or create your account to enter the workspace tailored to your culinary needs
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chef Commercial Suite Card */}
          <ScrollReveal direction="left" distance={28} delay={0}>
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E8DFD1] hover:border-emerald-600 shadow-xs hover:shadow-xl transition-all space-y-5 flex flex-col justify-between card-3d-hover border-glow-emerald h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs">
                      <ChefHat className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-stone-900 text-lg">
                        Professional Chef Suite
                      </h3>
                      <p className="text-xs font-mono text-emerald-700 font-bold">
                        Commercial KitchenOS
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Commercial Grade
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Empower your line cooks, reduce food waste costs, author signature upcycled dishes with dish photography, push dynamic specials to POS, and automate surplus donations to partner NGOs.
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Smart Prep Intake & Knife Trim Benchmark</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reverse Recipe Studio & Custom Dish Authoring</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cashier POS Terminal & Flash Markdown Slider</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automated NGO Surplus Hub & OTP Verification</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Circularity Ledger & ISO 14001 ESG Audit Report</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playTap();
                    openAuthModal('signin');
                  }}
                  className="btn-shimmer flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Sign In as Chef</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sounds.playTap();
                    openAuthModal('register');
                  }}
                  className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-heading font-bold text-xs transition-all"
                >
                  Register
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Home Cook Suite Card */}
          <ScrollReveal direction="right" distance={28} delay={0.08}>
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E8DFD1] hover:border-amber-600 shadow-xs hover:shadow-xl transition-all space-y-5 flex flex-col justify-between card-3d-hover border-glow-amber h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-800 shadow-xs">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-stone-900 text-lg">
                        Home Cook Suite
                      </h3>
                      <p className="text-xs font-mono text-amber-700 font-bold">
                        Zero-Waste Household
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Everyday Cook
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Take a photo of whatever vegetable peels or leftovers you have at home, enter their weights, and cook delicious chef-designed zero-waste recipes with step-by-step guidance.
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Upload Leftover Photo & AI Item Extraction</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Per-Item Weight Inputs in Kilograms</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Browse Master-Crafted Reverse Recipes with Photos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Interactive Pantry Checklist & Step Guides</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Personal Household Food Waste Diversion Counter</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playTap();
                    openAuthModal('signin');
                  }}
                  className="btn-shimmer flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-heading font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Sign In as Home Cook</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sounds.playTap();
                    openAuthModal('register');
                  }}
                  className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-heading font-bold text-xs transition-all"
                >
                  Register
                </button>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Authenticated Session & Account Isolation Banner */}
        <ScrollReveal direction="up" distance={20} delay={0.14}>
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-white to-amber-50/70 border border-[#E8DFD1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-stone-900 text-sm">
                  {isAuthenticated 
                    ? `Active Workspace: ${userProfile?.name} (${userPersona === 'chef' ? 'Professional Chef Mode' : 'Home Cook Mode'})`
                    : 'Workspace Authentication Required'}
                </h4>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  {isAuthenticated 
                    ? 'Account isolation active. To switch between Chef and Home Cook accounts, please sign out first.'
                    : 'Sign in or register to enter your role-specific station workspace.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    sounds.playTap();
                    signOut();
                  }}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-rose-200 font-heading font-bold text-xs shadow-xs transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      openAuthModal('signin');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#E8DFD1] text-stone-800 font-heading font-bold text-xs shadow-xs transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      openAuthModal('register');
                    }}
                    className="btn-shimmer px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs shadow-xs transition-all"
                  >
                    Register Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

      </section>

      {/* 7. Masterclass Step-by-Step Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={inspectingDish}
        isOpen={!!inspectingDish}
        onClose={() => setInspectingDish(null)}
      />

      {/* Commercial Business Model & ROI Architecture Modal */}
      <BusinessModelModal
        isOpen={isBizModelOpen}
        onClose={() => setIsBizModelOpen(false)}
      />

      {/* 8. Luxury Culinary Executive Footer */}
      <ScrollReveal direction="up" distance={24}>
        <footer className="pt-12 pb-6 border-t border-[#E8DFD1] text-stone-600 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Mission */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="font-heading font-black text-xl text-stone-900 tracking-tight">
                  Waste<span className="text-emerald-700">2</span>Menu <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full ml-1">AI</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed max-w-md font-sans">
                Enterprise circular gastronomy platform converting commercial and household kitchen byproducts into high-margin revenue streams, verified ESG impact certificates, and automated food rescue redistributions.
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2.5">
              <h5 className="font-heading font-bold text-stone-900 text-xs uppercase tracking-wider">
                Navigation
              </h5>
              <ul className="space-y-1.5 text-xs font-mono">
                <li>
                  <a href="#overview" className="hover:text-emerald-700 transition-colors">Overview & Vision</a>
                </li>
                <li>
                  <a href="#dishes" className="hover:text-emerald-700 transition-colors">Dishes Showcase</a>
                </li>
                <li>
                  <a href="#impact" className="hover:text-emerald-700 transition-colors">Impact & Diversion Ledger</a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">5-Stage Circular Loop</a>
                </li>
                <li>
                  <a href="#suites" className="hover:text-emerald-700 transition-colors">Chef & Home Suites</a>
                </li>
              </ul>
            </div>

            {/* Col 3: Compliance & Standards */}
            <div className="space-y-2.5">
              <h5 className="font-heading font-bold text-stone-900 text-xs uppercase tracking-wider">
                Standards & SDG
              </h5>
              <div className="space-y-2 text-xs font-mono text-stone-500">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>UN SDG 12.3: Zero Food Waste</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ISO 14001 ESG Circularity Audit</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Local Storage Data Privacy</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GitHub Pages CI/CD Verified</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom copyright and quote */}
          <div className="pt-6 border-t border-[#E8DFD1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-stone-400">
            <p>
              &copy; {new Date().getFullYear()} Waste2Menu AI. All rights reserved. Circular Gastronomy Systems.
            </p>
            <p className="italic text-stone-500 text-[11px]">
              &ldquo;In nature, nothing is lost, everything is transformed.&rdquo;
            </p>
          </div>
        </footer>
      </ScrollReveal>

    </div>
  );
};
