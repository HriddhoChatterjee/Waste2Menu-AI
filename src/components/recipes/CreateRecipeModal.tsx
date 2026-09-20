import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { RecipeDish, ScrapCategory } from '../../types';
import { 
  X, 
  ChefHat, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  Coins, 
  Scale, 
  Utensils,
  BookOpen,
  Image as ImageIcon,
  Upload,
  ArrowUp,
  ArrowDown,
  Camera,
  CheckCircle2,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Curated high-res culinary photography presets for zero-waste dishes
const CULINARY_PHOTO_PRESETS = [
  {
    id: 'preset-peels',
    label: 'Vegetable Peel Crisps',
    category: 'Starters & Sides',
    url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset-broth',
    label: 'Collagen Bone Broth',
    category: 'Soups & Potages',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset-pasta',
    label: 'Breadcrumb Pasta',
    category: 'Mains & Pasta',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset-chimichurri',
    label: 'Herb Stem Chimichurri',
    category: 'Sauces & Condiments',
    url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset-potage',
    label: 'Roasted Garlic Potage',
    category: 'Soups & Potages',
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset-citrus',
    label: 'Citrus Glaze & Wings',
    category: 'Small Plates & Bar Bites',
    url: 'https://images.unsplash.com/photo-1527477378696-618ec538c10e?auto=format&fit=crop&w=800&q=80'
  }
];

export const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({ isOpen, onClose }) => {
  const { addRecipe, userProfile } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Starters & Sides');
  const [scrapTypeNeeded, setScrapTypeNeeded] = useState<ScrapCategory>('mirepoix_peels');
  const [scrapWeightNeededKg, setScrapWeightNeededKg] = useState(1.2);
  const [yieldPortions, setYieldPortions] = useState(8);
  const [suggestedPrice, setSuggestedPrice] = useState(140);
  const [prepTimeMins, setPrepTimeMins] = useState(25);
  const [flavorProfile, setFlavorProfile] = useState('Crisp, Umami & Aromatic');
  const [chefTips, setChefTips] = useState('Ensure peels are dehydrated or patted dry before flash frying for maximum crunch.');
  
  // Image states
  const [imageUrl, setImageUrl] = useState<string>(CULINARY_PHOTO_PRESETS[0].url);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Steps & Instructions
  const [instructions, setInstructions] = useState<string[]>([
    'Thoroughly rinse and sanitize scrap trimmings under cold water.',
    'Blanch for 2 minutes in salted simmering water, then pat completely dry.',
    'Toss with pantry aromatics and cold-pressed oil; roast at 200°C or flash-fry until golden.',
    'Finish with flaked sea salt, freshly cracked pepper, and serve hot as a zero-waste signature dish.'
  ]);
  const [newInstruction, setNewInstruction] = useState('');
  const [pantryInput, setPantryInput] = useState('Cold-pressed oil, Sea salt flakes, Fresh cracked pepper');

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add a step
  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    setInstructions([...instructions, newInstruction.trim()]);
    setNewInstruction('');
  };

  // Remove a step
  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  // Move step up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...instructions];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setInstructions(updated);
  };

  // Move step down
  const handleMoveDown = (index: number) => {
    if (index === instructions.length - 1) return;
    const updated = [...instructions];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setInstructions(updated);
  };

  // Load recommended 4-step template
  const handleLoadTemplate = () => {
    setInstructions([
      `Inspect and thoroughly rinse ${scrapTypeNeeded.replace('_', ' ')} under cold filtered water.`,
      'Blanch or pre-roast in combi-oven at 200°C for 10 minutes to caramelize natural sugars.',
      'Blend, reduce or toss with pantry spices, olive oil, and sea salt.',
      'Plate with aromatic microgreens or crunchy garnish; serve immediately at peak freshness.'
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const pantryList = pantryInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({ name, inStock: true, qty: 'To taste' }));

    const marginPercent = Math.round(((suggestedPrice - 18) / suggestedPrice) * 100);

    const newRecipe: RecipeDish = {
      id: `custom-rec-${Date.now()}`,
      title: title.trim(),
      category,
      scrapTypeNeeded,
      scrapWeightNeededKg,
      yieldPortions,
      prepTimeMins,
      pantryIngredients: pantryList.length > 0 ? pantryList : [
        { name: 'Sea Salt & Black Pepper', inStock: true, qty: '10 g' },
        { name: 'Olive Oil or Ghee', inStock: true, qty: '30 ml' }
      ],
      rawByproductCost: 0,
      seasoningGasCost: 0,
      suggestedPrice: 0,
      marginPercent: 100,
      description: description.trim(),
      flavorProfile: flavorProfile.trim() || 'Savory, aromatic, nutrient-rich',
      chefTips: chefTips.trim() || 'Simmer on low flame to extract maximum nutrients from scraps.',
      instructions,
      tags: ['Chef Custom', 'Zero-Waste', 'Community Nutrition'],
      author: userProfile?.name || 'Chef Aarav Singhania',
      imageUrl: imageUrl || undefined,
      status: 'ready_to_cook'
    };

    addRecipe(newRecipe);
    onClose();
  };

  return (
    // Fixed modal overlay starting safely below the top navbar (pt-24 / sm:pt-28) so top content never hides under the tab
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center items-start p-4 pt-24 sm:pt-28 pb-16">
      
      {/* Modal Card */}
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors z-10"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3.5 pb-2 border-b border-[#E8DFD1]">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs shrink-0">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Chef Culinary Studio
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                Author: {userProfile?.name || 'Chef Aarav Singhania'}
              </span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-stone-900 mt-1">
              Author & Publish Zero-Waste Recipe
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Upload dish photography, define culinary procedures, and sync instantly to the restaurant menu & home cooks
            </p>
          </div>
        </div>

        {/* Recipe Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Dish Photography & Image Upload Section */}
          <div className="space-y-3 bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E8DFD1]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                <label className="text-xs font-heading font-bold text-stone-900 uppercase">
                  Dish Photography *
                </label>
              </div>
              <span className="text-[11px] font-mono text-stone-500">
                Upload image or select culinary preset
              </span>
            </div>

            {/* Active Image Preview Card */}
            {imageUrl ? (
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-sm group">
                <img 
                  src={imageUrl} 
                  alt="Dish preview" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Floating Preview Info */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-700/90 text-white font-mono text-[10px] font-bold shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Image Selected
                  </span>
                </div>

                {/* Floating Controls */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-stone-800 text-xs font-bold font-mono shadow-md backdrop-blur-xs flex items-center space-x-1.5 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Upload Different Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold font-mono shadow-md backdrop-blur-xs transition-all"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone Placeholder */
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-[#D4C6B2] hover:border-emerald-600 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-white transition-all group"
              >
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="font-heading font-bold text-stone-800 text-xs mt-2">
                  Click to upload a dish photo from your computer
                </p>
                <span className="text-[10px] font-mono text-stone-400">
                  PNG, JPG, or WebP up to 10MB
                </span>
              </div>
            )}

            {/* Hidden Native File Input */}
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Curated Culinary Presets Bar */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono font-bold uppercase text-stone-500">
                Or Pick a High-Res Culinary Preset:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {CULINARY_PHOTO_PRESETS.map((p) => {
                  const isSelected = imageUrl === p.url;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className={`relative rounded-xl overflow-hidden h-16 border text-left transition-all group ${
                        isSelected 
                          ? 'border-emerald-600 ring-2 ring-emerald-500/50 shadow-sm' 
                          : 'border-[#E8DFD1] hover:border-emerald-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />
                      <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-mono font-bold text-white leading-tight line-clamp-1">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct URL input toggle */}
            <div className="pt-1">
              {!showUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="text-[11px] font-mono text-emerald-700 hover:text-emerald-800 underline font-semibold"
                >
                  + Paste custom image URL instead
                </button>
              ) : (
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 bg-white text-stone-900 text-xs px-3 py-1.5 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        setImageUrl(customUrlInput.trim());
                        setCustomUrlInput('');
                        setShowUrlInput(false);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-mono font-bold"
                  >
                    Apply URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="px-2 py-1.5 text-stone-400 hover:text-stone-600 text-xs font-mono"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Core Recipe Details: Title, Category & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                Recipe Dish Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Charred Leek & Crispy Potato Peel Jus"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white text-stone-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                Menu Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white text-stone-900 text-xs px-3 py-2.5 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 shadow-xs"
              >
                <option value="Starters & Sides">Starters & Sides</option>
                <option value="Soups & Potages">Soups & Potages</option>
                <option value="Small Plates & Bar Bites">Small Plates & Bar Bites</option>
                <option value="Mains & Pasta">Mains & Pasta</option>
                <option value="Sauces & Condiments">Sauces & Condiments</option>
                <option value="Desserts & Pastry">Desserts & Pastry</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
              Culinary Description & Story
            </label>
            <textarea
              rows={2}
              placeholder="Describe the mouthfeel, aromas, and how kitchen trims are transformed into culinary art..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-stone-900 text-xs px-3.5 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>

          {/* 3. Scrap Reservoir Input & Yield */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD1]">
            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-600 uppercase mb-1">
                Scrap Byproduct Type
              </label>
              <select
                value={scrapTypeNeeded}
                onChange={(e) => setScrapTypeNeeded(e.target.value as ScrapCategory)}
                className="w-full bg-white text-stone-900 text-xs px-2.5 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600"
              >
                <option value="mirepoix_peels">Mirepoix & Veg Peels</option>
                <option value="poultry_bones">Poultry Bones & Carcasses</option>
                <option value="citrus_rinds">Citrus Rinds & Peels</option>
                <option value="herb_stems">Fresh Herb Stems</option>
                <option value="bread_crusts">Sourdough & Bread Crusts</option>
                <option value="fish_frames">Fish Frames & Trims</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-600 uppercase mb-1">
                Required Scrap Mass (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={scrapWeightNeededKg}
                onChange={(e) => setScrapWeightNeededKg(parseFloat(e.target.value) || 0.5)}
                className="w-full bg-white text-stone-900 text-xs px-2.5 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-600 uppercase mb-1">
                Portion Yield
              </label>
              <input
                type="number"
                min="1"
                value={yieldPortions}
                onChange={(e) => setYieldPortions(parseInt(e.target.value) || 4)}
                className="w-full bg-white text-stone-900 text-xs px-2.5 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          {/* 4. Timing & Eco Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                Prep Time (Minutes)
              </label>
              <input
                type="number"
                min="5"
                value={prepTimeMins}
                onChange={(e) => setPrepTimeMins(parseInt(e.target.value) || 15)}
                className="w-full bg-white text-stone-900 text-xs px-3.5 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 font-mono shadow-xs"
              />
            </div>

            <div className="bg-[#FFFDF9] border border-[#E8DFD1] p-2.5 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-semibold">
                Estimated Eco Impact
              </span>
              <div className="text-xl font-heading font-black text-emerald-700">
                {(scrapWeightNeededKg * 2.5).toFixed(1)} kg CO₂e
                <span className="text-[10px] font-mono font-normal text-stone-400 ml-1">avoided</span>
              </div>
            </div>
          </div>

          {/* 5. Complementary Pantry Ingredients */}
          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
              Complementary Pantry Ingredients (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., Cold-pressed olive oil, Sea salt flakes, Toasted cumin, Garlic cloves"
              value={pantryInput}
              onChange={(e) => setPantryInput(e.target.value)}
              className="w-full bg-white text-stone-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>

          {/* 6. Step-by-Step Procedures Builder */}
          <div className="space-y-3 bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E8DFD1]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-heading font-bold text-stone-900 uppercase">
                  Culinary Procedures & Step-by-Step Instructions ({instructions.length} Steps)
                </label>
                <p className="text-[11px] font-mono text-stone-500">
                  Home cooks and line cooks follow these exact sequential stages
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadTemplate}
                className="text-[11px] font-mono text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 self-start sm:self-auto bg-white px-2.5 py-1 rounded-lg border border-[#E8DFD1] shadow-xs"
                title="Load standard 4-step zero-waste workflow"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Auto-Fill 4-Step Template</span>
              </button>
            </div>

            {/* List of Steps */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {instructions.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start justify-between p-3 rounded-xl bg-white border border-[#E8DFD1] text-xs shadow-xs space-x-2"
                >
                  <div className="flex items-start space-x-2.5 flex-1">
                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] uppercase mt-0.5">
                      Step {idx + 1}
                    </span>
                    <p className="text-stone-800 text-xs leading-relaxed font-sans pt-0.5">
                      {step}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 pt-0.5">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className={`p-1 rounded-lg ${idx === 0 ? 'text-stone-300' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'}`}
                      title="Move Step Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === instructions.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className={`p-1 rounded-lg ${idx === instructions.length - 1 ? 'text-stone-300' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'}`}
                      title="Move Step Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(idx)}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                      title="Delete Step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Input to Add Next Step */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Type next procedure step (e.g., Simmer on low induction heat for 35 minutes)..."
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInstruction();
                  }
                }}
                className="flex-1 bg-white text-stone-900 text-xs px-3.5 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold font-mono shadow-xs transition-all flex items-center space-x-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Step</span>
              </button>
            </div>
          </div>

          {/* 7. Chef Pro Secrets & Flavor Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                Flavor Profile & Finish
              </label>
              <input
                type="text"
                placeholder="e.g., Crisp, Deep Umami & Subtle Smoke"
                value={flavorProfile}
                onChange={(e) => setFlavorProfile(e.target.value)}
                className="w-full bg-white text-stone-900 text-xs px-3 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                Executive Chef Secret Tip
              </label>
              <input
                type="text"
                placeholder="e.g., Roast bones at 220°C first for deep amber color and clarity."
                value={chefTips}
                onChange={(e) => setChefTips(e.target.value)}
                className="w-full bg-white text-stone-900 text-xs px-3 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-[#E8DFD1]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-[#E8DFD1] text-xs font-bold transition-all shadow-xs"
            >
              Cancel & Discard
            </button>

            <button
              type="submit"
              className="flex-2 flex-grow py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-black text-xs shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Publish Recipe with Photography & Steps</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
