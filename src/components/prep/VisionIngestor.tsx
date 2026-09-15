import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Trash2, 
  Scale, 
  Layers, 
  Leaf, 
  Flame, 
  ArrowRight, 
  Check, 
  RefreshCw,
  Image as ImageIcon,
  Tag,
  AlertCircle
} from 'lucide-react';
import { ScrapCategory, DetectedFoodItem } from '../../types';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SamplePreset {
  id: string;
  name: string;
  imageUrl: string;
  category: ScrapCategory;
  detectedItems: DetectedFoodItem[];
}

const SAMPLE_FOOD_PRESETS: SamplePreset[] = [
  {
    id: 'preset-mirepoix',
    name: 'Vegetable Peels & Root Trims',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    category: 'mirepoix_peels',
    detectedItems: [
      {
        id: 'det-1',
        name: 'Carrot Peels & Tops',
        category: 'mirepoix_peels',
        confidence: 0.98,
        weightKg: 1.4,
        bbox: { x: 12, y: 18, w: 38, h: 42 },
        color: '#059669'
      },
      {
        id: 'det-2',
        name: 'Yellow Onion Skins & Root Ends',
        category: 'mirepoix_peels',
        confidence: 0.95,
        weightKg: 0.9,
        bbox: { x: 54, y: 24, w: 36, h: 38 },
        color: '#D97706'
      },
      {
        id: 'det-3',
        name: 'Celery Base & Leafy Trims',
        category: 'mirepoix_peels',
        confidence: 0.92,
        weightKg: 0.8,
        bbox: { x: 28, y: 55, w: 45, h: 32 },
        color: '#10B981'
      }
    ]
  },
  {
    id: 'preset-poultry',
    name: 'Roast Chicken Carcass & Bones',
    imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=800',
    category: 'poultry_bones',
    detectedItems: [
      {
        id: 'det-4',
        name: 'Poultry Carcass & Spine Bones',
        category: 'poultry_bones',
        confidence: 0.97,
        weightKg: 2.2,
        bbox: { x: 20, y: 15, w: 55, h: 50 },
        color: '#EF4444'
      },
      {
        id: 'det-5',
        name: 'Wing Tips & Cartilage Trimmings',
        category: 'poultry_bones',
        confidence: 0.93,
        weightKg: 0.6,
        bbox: { x: 15, y: 62, w: 42, h: 28 },
        color: '#F59E0B'
      }
    ]
  },
  {
    id: 'preset-citrus-herbs',
    name: 'Citrus Rinds & Fresh Herb Stems',
    imageUrl: 'https://images.unsplash.com/photo-1534432182912-63863115e106?auto=format&fit=crop&q=80&w=800',
    category: 'citrus_rinds',
    detectedItems: [
      {
        id: 'det-6',
        name: 'Meyer Lemon & Orange Peels',
        category: 'citrus_rinds',
        confidence: 0.96,
        weightKg: 1.2,
        bbox: { x: 15, y: 20, w: 40, h: 48 },
        color: '#F59E0B'
      },
      {
        id: 'det-7',
        name: 'Cilantro & Parsley Stems',
        category: 'herb_stems',
        confidence: 0.94,
        weightKg: 0.5,
        bbox: { x: 52, y: 35, w: 38, h: 45 },
        color: '#10B981'
      }
    ]
  },
  {
    id: 'preset-bread',
    name: 'Sourdough Heel Crusts & Stale Ends',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    category: 'bread_crusts',
    detectedItems: [
      {
        id: 'det-8',
        name: 'Artisan Sourdough Heel Crusts',
        category: 'bread_crusts',
        confidence: 0.97,
        weightKg: 1.8,
        bbox: { x: 22, y: 25, w: 56, h: 52 },
        color: '#8B5CF6'
      }
    ]
  }
];

export const VisionIngestor: React.FC = () => {
  const { addScrap, setRole, userPersona } = useAppStore();

  const [uploadedImage, setUploadedImage] = useState<string>(SAMPLE_FOOD_PRESETS[0].imageUrl);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_FOOD_PRESETS[0].id);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [items, setItems] = useState<DetectedFoodItem[]>(SAMPLE_FOOD_PRESETS[0].detectedItems);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [isCommitted, setIsCommitted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      setSelectedPresetId('custom-upload');
      runAiDetection(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Run AI food recognition scan
  const runAiDetection = (fileName?: string) => {
    setIsScanning(true);
    sounds.playPosTap();

    setTimeout(() => {
      setIsScanning(false);
      sounds.playScanBeep();

      // Dynamically generate detected items for user input
      const detected: DetectedFoodItem[] = [
        {
          id: `det-${Date.now()}-1`,
          name: fileName ? `${fileName.split('.')[0].replace(/[-_]/g, ' ')} Peels` : 'Mixed Vegetable Trimmings',
          category: 'mirepoix_peels',
          confidence: 0.96,
          weightKg: 1.2,
          bbox: { x: 15, y: 20, w: 42, h: 45 },
          color: '#059669'
        },
        {
          id: `det-${Date.now()}-2`,
          name: 'Herb Stems & Leafy Tops',
          category: 'herb_stems',
          confidence: 0.92,
          weightKg: 0.5,
          bbox: { x: 55, y: 30, w: 35, h: 40 },
          color: '#10B981'
        }
      ];
      setItems(detected);
    }, 1200);
  };

  // Select sample photo preset
  const selectPreset = (preset: SamplePreset) => {
    sounds.playPosTap();
    setSelectedPresetId(preset.id);
    setUploadedImage(preset.imageUrl);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      sounds.playScanBeep();
      setItems(preset.detectedItems.map((item) => ({ ...item, id: `${item.id}-${Date.now()}` })));
    }, 800);
  };

  // Weight handlers
  const updateWeight = (id: string, delta: number) => {
    sounds.playPosTap();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, weightKg: Math.max(0.1, Math.round((item.weightKg + delta) * 10) / 10) }
          : item
      )
    );
  };

  const setDirectWeight = (id: string, val: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, weightKg: Math.max(0.05, Math.round(val * 100) / 100) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    sounds.playPosTap();
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addNewItem = () => {
    sounds.playPosTap();
    const newItem: DetectedFoodItem = {
      id: `custom-item-${Date.now()}`,
      name: 'Additional Prep Scrap',
      category: 'mirepoix_peels',
      confidence: 0.95,
      weightKg: 1.0,
      color: '#059669'
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Total weight calculated
  const totalWeight = items.reduce((acc, item) => acc + item.weightKg, 0);

  // Commit items
  const handleCommit = () => {
    if (items.length === 0) return;

    items.forEach((item) => {
      addScrap({
        name: item.name,
        category: item.category,
        weightKg: item.weightKg,
        perishableHoursLeft: 12,
        maxPerishableHours: 24,
        qualityScore: Math.round(item.confidence * 100),
        detectedFromVision: true,
        notes: `AI Photo Scan (Confidence: ${(item.confidence * 100).toFixed(1)}%)`
      });
    });

    setIsCommitted(true);
    sounds.playSuccessChime();

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    setTimeout(() => {
      setIsCommitted(false);
      // Route user according to role
      setRole(userPersona === 'chef' ? 'recipes' : 'user_recipes');
    }, 1200);
  };

  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DFD1] p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFD1]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <UploadCloud className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase text-emerald-700 tracking-wider">
              Smart Vision Intake
            </span>
          </div>
          <h2 className="text-xl font-heading font-black text-stone-900">
            Upload Food Photo & Enter Ingredient Weights
          </h2>
          <p className="text-xs text-stone-500 font-mono">
            Our vision AI identifies ingredients from the image. Enter the exact weight for each item below.
          </p>
        </div>

        {/* Total Weight Counter */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-[#FAF7F2] border border-[#E8DFD1] px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] font-mono uppercase text-stone-500 block font-semibold">
              Total Mass Input
            </span>
            <span className="text-lg font-heading font-black text-emerald-700">
              {totalWeight.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg</span>
            </span>
          </div>
        </div>
      </div>

      {/* Preset Quick Chooser */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono text-stone-500 uppercase font-semibold block">
          Select Sample Food Photo or Upload Your Own:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_FOOD_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs font-bold'
                  : 'bg-white hover:bg-stone-50 border-[#E8DFD1] text-stone-700'
              }`}
            >
              <img
                src={preset.imageUrl}
                alt={preset.name}
                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E8DFD1]"
              />
              <span className="text-xs font-heading font-semibold truncate leading-tight">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Upload Preview (6 cols), Right Weight Entry (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Image Upload & Bounding Box Canvas (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Interactive Upload & Preview Container */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative rounded-2xl border-2 border-dashed border-[#E8DFD1] hover:border-emerald-500 bg-[#FAF7F2] overflow-hidden aspect-[4/3] flex items-center justify-center cursor-pointer group transition-all shadow-inner"
          >
            {uploadedImage ? (
              <>
                <img
                  src={uploadedImage}
                  alt="Scanned Food Scraps"
                  className="w-full h-full object-cover"
                />

                {/* AI Laser Scan Animation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-[1px] flex flex-col items-center justify-center z-30">
                    <div className="laser-line absolute left-0 right-0 h-1 animate-laser-scan" />
                    <div className="bg-white/90 border border-emerald-300 px-4 py-2 rounded-xl text-emerald-800 text-xs font-mono font-bold shadow-md flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>AI Model Segmenting Ingredients...</span>
                    </div>
                  </div>
                )}

                {/* Neural Bounding Boxes Overlaid On Image */}
                {!isScanning && items.map((item) => {
                  if (!item.bbox) return null;
                  const isHovered = activeHighlightId === item.id;

                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setActiveHighlightId(item.id)}
                      onMouseLeave={() => setActiveHighlightId(null)}
                      style={{
                        left: `${item.bbox.x}%`,
                        top: `${item.bbox.y}%`,
                        width: `${item.bbox.w}%`,
                        height: `${item.bbox.h}%`
                      }}
                      className={`absolute rounded-xl border-2 transition-all pointer-events-auto z-20 ${
                        isHovered 
                          ? 'border-emerald-400 bg-emerald-500/25 shadow-lg scale-105' 
                          : 'border-emerald-500/70 bg-emerald-950/15 shadow-sm'
                      }`}
                    >
                      {/* High-tech HUD Corner Brackets */}
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

                      <div className="absolute -top-3.5 left-2 px-2 py-0.5 rounded-md bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider shadow-sm flex items-center space-x-1.5 whitespace-nowrap border border-emerald-500/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{item.name}</span>
                        <span className="text-emerald-400 font-bold">{(item.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}

                {/* Upload Another Photo Badge Button */}
                <div className="absolute bottom-3 right-3 z-30">
                  <span className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-stone-800 border border-[#E8DFD1] text-xs font-mono font-bold shadow-sm flex items-center space-x-1.5 transition-all">
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Click to Upload New Photo</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-stone-900 text-base">
                    Click to Upload Food Image or Drag & Drop
                  </h4>
                  <p className="text-xs text-stone-500 font-mono mt-1">
                    Supports PNG, JPG, WEBP • Automatic ingredient segmentation
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Vision Model: WasteNet Food Classifier v4.2</span>
            </span>
            <span className="text-emerald-700 font-bold">
              {items.length} items detected
            </span>
          </div>

        </div>

        {/* Right: Detected Items & Weight Entry Form (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-base">
                Enter Weight for Each Detected Item
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Adjust the mass (kg) measured from your kitchen scale or estimate
              </p>
            </div>

            <button
              onClick={addNewItem}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-[#E8DFD1] text-xs font-mono text-stone-700 flex items-center space-x-1 shadow-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Item</span>
            </button>
          </div>

          {/* List of Detected Items with Weight Inputs */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {items.map((item, index) => {
              const isHovered = activeHighlightId === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveHighlightId(item.id)}
                  onMouseLeave={() => setActiveHighlightId(null)}
                  className={`p-4 rounded-xl border transition-all ${
                    isHovered
                      ? 'bg-emerald-50/50 border-emerald-400 shadow-xs'
                      : 'bg-white border-[#E8DFD1] shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setItems((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, name: newName } : i))
                            );
                          }}
                          className="font-heading font-bold text-stone-900 text-sm bg-transparent border-b border-transparent hover:border-[#E8DFD1] focus:border-emerald-500 focus:outline-none w-full"
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-stone-600 border border-[#E8DFD1]">
                          {item.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700">
                          AI Confidence: {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Weight Input Controls */}
                  <div className="mt-3 pt-2.5 border-t border-[#E8DFD1] flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-stone-500 flex items-center gap-1 font-semibold">
                      <Scale className="w-3.5 h-3.5 text-stone-400" />
                      <span>Item Weight:</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateWeight(item.id, -0.2)}
                        className="w-7 h-7 rounded-lg bg-[#FAF7F2] hover:bg-stone-100 border border-[#E8DFD1] text-stone-700 flex items-center justify-center active:scale-95 shadow-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="50"
                          value={item.weightKg}
                          onChange={(e) => setDirectWeight(item.id, parseFloat(e.target.value) || 0.1)}
                          className="w-20 text-center py-1 px-2 font-mono font-bold text-sm bg-[#FAF7F2] text-stone-900 border border-[#E8DFD1] rounded-lg focus:outline-none focus:border-emerald-600"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-stone-400 pointer-events-none">
                          kg
                        </span>
                      </div>

                      <button
                        onClick={() => updateWeight(item.id, 0.2)}
                        className="w-7 h-7 rounded-lg bg-[#FAF7F2] hover:bg-stone-100 border border-[#E8DFD1] text-stone-700 flex items-center justify-center active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Commit Button */}
          <div className="pt-2">
            <button
              onClick={handleCommit}
              disabled={items.length === 0 || isCommitted}
              className={`w-full py-3.5 px-5 rounded-xl font-heading font-black text-sm shadow-md transition-all transform active:scale-98 flex items-center justify-center space-x-2 ${
                isCommitted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isCommitted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Logged {totalWeight.toFixed(1)} kg • Redirecting to Recipes...</span>
                </>
              ) : (
                <>
                  <Leaf className="w-4 h-4" />
                  <span>
                    {userPersona === 'chef' 
                      ? `Commit ${items.length} Items (${totalWeight.toFixed(1)} kg) to Reservoir` 
                      : `Find Chef Recipes for These ${items.length} Items (${totalWeight.toFixed(1)} kg)`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
