import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ScrapCategory } from '../../types';
import { 
  Scale, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  ChevronRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const ManualScaleEntry: React.FC = () => {
  const { addScrap, addStaffBenchmark } = useAppStore();

  const [cookName, setCookName] = useState('Chef Rajesh Sharma');
  const [station, setStation] = useState('Poultry & Butchery');
  const [primaryDish, setPrimaryDish] = useState('Butter Chicken Line Prep');
  const [cutType, setCutType] = useState<ScrapCategory>('poultry_bones');
  const [usableCoreKg, setUsableCoreKg] = useState<number>(6.5);
  const [trimLossKg, setTrimLossKg] = useState<number>(0.9);
  const [benchmarkLossPercent, setBenchmarkLossPercent] = useState<number>(14.0);
  const [isLogged, setIsLogged] = useState(false);

  // Calculations
  const totalMass = usableCoreKg + trimLossKg;
  const currentLossPercent = totalMass > 0 ? Math.round((trimLossKg / totalMass) * 1000) / 10 : 0;
  const delta = Math.round((currentLossPercent - benchmarkLossPercent) * 10) / 10;

  // Gauge coloring
  let gaugeColor = '#10B981'; // Green
  let statusText = 'Optimal Knife Yield';
  let badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  if (currentLossPercent > benchmarkLossPercent * 1.35 || currentLossPercent > 25) {
    gaugeColor = '#EF4444'; // Coral Red
    statusText = 'High Trim Anomaly (>25%)';
    badgeClass = 'bg-coral/20 text-coral border-coral/40 animate-pulse';
  } else if (currentLossPercent > benchmarkLossPercent || currentLossPercent > 15) {
    gaugeColor = '#F59E0B'; // Amber
    statusText = 'Moderate Variance';
    badgeClass = 'bg-amber/20 text-amber border-amber/40';
  }

  // Circular gauge math (radius 42, circumference ~264)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const maxScalePercent = 40; // 40% loss represents full circle
  const progressRatio = Math.min(1, currentLossPercent / maxScalePercent);
  const strokeDashoffset = circumference - progressRatio * circumference;

  const handleLogEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimLossKg <= 0) return;

    // Add to Scrap Reservoir
    addScrap({
      name: `${primaryDish} (${cutType.replace('_', ' ')})`,
      category: cutType,
      weightKg: trimLossKg,
      perishableHoursLeft: cutType === 'poultry_bones' ? 7.0 : 14.0,
      maxPerishableHours: 16.0,
      qualityScore: currentLossPercent <= 15 ? 98 : 88,
      detectedFromVision: false,
      notes: `Scale entry by ${cookName} at ${station}. Loss: ${currentLossPercent}%`
    });

    // Add to Staff Benchmark Ledger
    addStaffBenchmark({
      cookName,
      station,
      dishPrepared: primaryDish,
      coreWeightKg: usableCoreKg,
      trimLossKg,
      benchmarkLossPercent
    });

    setIsLogged(true);
    sounds.playSuccessChime();
    setTimeout(() => setIsLogged(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-charcoal-light flex flex-col h-full">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-light">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              Smart Scale & Knife-Efficiency Engine
            </h3>
            <p className="text-xs text-textMuted font-mono">
              Manual Scale Fallback & Yield Variance Tracking
            </p>
          </div>
        </div>
        
        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full border ${badgeClass}`}>
          {statusText}
        </span>
      </div>

      <form onSubmit={handleLogEntry} className="mt-4 space-y-4 flex-1 flex flex-col justify-between">
        
        {/* Top input grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Cook / Station */}
          <div>
            <label className="block text-[11px] font-mono text-textMuted uppercase mb-1">
              Cook & Line Station
            </label>
            <select
              value={cookName}
              onChange={(e) => {
                setCookName(e.target.value);
                if (e.target.value.includes('Rajesh')) setStation('Poultry & Butchery');
                if (e.target.value.includes('Imran')) setStation('Vegetable Mirepoix');
                if (e.target.value.includes('Devendra')) setStation('Citrus & Bar Prep');
                if (e.target.value.includes('Ananya')) setStation('Fish Monger');
                if (e.target.value.includes('Sunita')) setStation('Herb & Chutney Line');
              }}
              className="w-full bg-charcoal text-white text-xs font-semibold rounded-xl border border-charcoal-light p-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="Chef Rajesh Sharma">Chef Rajesh Sharma (Butchery)</option>
              <option value="Cook Imran Khan">Cook Imran Khan (Mirepoix Line)</option>
              <option value="Apprentice Devendra">Apprentice Devendra (Bar & Citrus)</option>
              <option value="Chef Ananya Roy">Chef Ananya Roy (Fish Station)</option>
              <option value="Line Cook Sunita P.">Line Cook Sunita P. (Herb Line)</option>
            </select>
          </div>

          {/* Primary Dish */}
          <div>
            <label className="block text-[11px] font-mono text-textMuted uppercase mb-1">
              Primary Dish Prepped
            </label>
            <input
              type="text"
              value={primaryDish}
              onChange={(e) => setPrimaryDish(e.target.value)}
              className="w-full bg-charcoal text-white text-xs rounded-xl border border-charcoal-light p-2.5 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Butter Chicken Cut"
            />
          </div>

          {/* Raw Cut Type */}
          <div>
            <label className="block text-[11px] font-mono text-textMuted uppercase mb-1">
              Raw Cut Byproduct Category
            </label>
            <select
              value={cutType}
              onChange={(e) => {
                const val = e.target.value as ScrapCategory;
                setCutType(val);
                if (val === 'poultry_bones') setBenchmarkLossPercent(14.0);
                if (val === 'mirepoix_peels') setBenchmarkLossPercent(15.0);
                if (val === 'citrus_rinds') setBenchmarkLossPercent(18.0);
                if (val === 'herb_stems') setBenchmarkLossPercent(12.0);
                if (val === 'bread_crusts') setBenchmarkLossPercent(10.0);
              }}
              className="w-full bg-charcoal text-white text-xs font-semibold rounded-xl border border-charcoal-light p-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="poultry_bones">Poultry Bones & Carcasses</option>
              <option value="mirepoix_peels">Mirepoix & Vegetable Peels</option>
              <option value="citrus_rinds">Citrus Rinds & Bar Piths</option>
              <option value="herb_stems">Herb Stems & Leaves</option>
              <option value="bread_crusts">Sourdough & Bread Crusts</option>
            </select>
          </div>

          {/* Benchmark Target */}
          <div>
            <label className="block text-[11px] font-mono text-textMuted uppercase mb-1">
              Benchmark Standard Baseline
            </label>
            <div className="flex items-center bg-charcoal rounded-xl border border-charcoal-light px-3 py-2 text-xs font-mono text-emerald-400 font-bold justify-between">
              <span>Standard Baseline Yield:</span>
              <span>{benchmarkLossPercent}% Max Loss</span>
            </div>
          </div>

        </div>

        {/* Weights Section & Radial Efficiency Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-obsidian-dark/60 p-4 rounded-xl border border-charcoal-light items-center">
          
          {/* Inputs */}
          <div className="md:col-span-7 space-y-3">
            
            {/* Usable Core Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textMuted font-mono">Usable Core Yield (kg)</span>
                <span className="font-mono text-emerald-400 font-bold">{usableCoreKg.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setUsableCoreKg(Math.max(0.1, Math.round((usableCoreKg - 0.5) * 10) / 10))}
                  className="p-2 rounded-lg bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={usableCoreKg}
                  onChange={(e) => setUsableCoreKg(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setUsableCoreKg(Math.round((usableCoreKg + 0.5) * 10) / 10)}
                  className="p-2 rounded-lg bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Trim Loss Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textMuted font-mono">Trim / Scrap Loss (kg)</span>
                <span className="font-mono text-coral font-bold">{trimLossKg.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setTrimLossKg(Math.max(0.1, Math.round((trimLossKg - 0.2) * 10) / 10))}
                  className="p-2 rounded-lg bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="0.1"
                  max="8"
                  step="0.1"
                  value={trimLossKg}
                  onChange={(e) => setTrimLossKg(parseFloat(e.target.value))}
                  className="flex-1 accent-coral cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setTrimLossKg(Math.round((trimLossKg + 0.2) * 10) / 10)}
                  className="p-2 rounded-lg bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Radial Circular Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-2 border-t md:border-t-0 md:border-l border-charcoal-light">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#1E293B"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Benchmark threshold guide marker */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#334155"
                  strokeWidth="8"
                  strokeDasharray="2 6"
                  fill="transparent"
                />
                {/* Active progress */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={gaugeColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="radial-progress-circle"
                />
              </svg>

              {/* Gauge center stats */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-heading font-black text-xl text-white">
                  {currentLossPercent}%
                </span>
                <span className="text-[9px] font-mono text-textMuted uppercase">
                  Trim Loss
                </span>
              </div>
            </div>

            {/* Benchmark deviation readout */}
            <div className="mt-1 text-center">
              <span className="text-[11px] font-mono font-semibold text-textMuted">
                {delta <= 0 ? (
                  <span className="text-emerald-400 flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{Math.abs(delta)}% below max loss (Optimal)</span>
                  </span>
                ) : (
                  <span className="text-coral flex items-center justify-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>+{delta}% trim loss anomaly!</span>
                  </span>
                )}
              </span>
            </div>
          </div>

        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-charcoal-lighter hover:bg-emerald-500 text-white hover:text-obsidian border border-charcoal-light hover:border-emerald-400 font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2 transform active:scale-98"
        >
          {isLogged ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Shift Scale Entry Logged!</span>
            </>
          ) : (
            <>
              <Scale className="w-4 h-4" />
              <span>Log Scale Entry & Update Staff Benchmark (+{trimLossKg.toFixed(1)} kg)</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};
