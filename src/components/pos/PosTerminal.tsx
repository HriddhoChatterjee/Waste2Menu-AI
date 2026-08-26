import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ActiveSpecialSKU, RegularMenuItem } from '../../types';
import { FlashDiscountSlider } from './FlashDiscountSlider';
import { OrderReceipt } from './OrderReceipt';
import { 
  Sparkles, 
  Flame, 
  Lock, 
  Plus, 
  Search, 
  Clock, 
  TrendingUp, 
  Tag, 
  AlertCircle,
  UtensilsCrossed
} from 'lucide-react';

export const PosTerminal: React.FC = () => {
  const { 
    activeSpecials, 
    regularMenu, 
    addToCart, 
    flashDiscountPercent 
  } = useAppStore();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'specials' | 'entrees' | 'sides' | 'beverages'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter dynamic specials
  const filteredSpecials = activeSpecials.filter((spec) => {
    if (selectedFilter !== 'all' && selectedFilter !== 'specials') return false;
    return spec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           spec.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter regular menu items
  const filteredRegular = regularMenu.filter((item) => {
    if (selectedFilter === 'specials') return false;
    if (selectedFilter === 'entrees' && item.category !== 'Main Entrees') return false;
    if (selectedFilter === 'sides' && item.category !== 'Starters & Sides') return false;
    if (selectedFilter === 'beverages' && item.category !== 'Beverages') return false;
    
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      
      {/* POS Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-charcoal via-charcoal-dark to-obsidian p-6 rounded-2xl border border-charcoal-light shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Station Screen 3
            </span>
            <span className="text-textMuted text-xs font-mono">• Cashier POS Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Live Point-of-Sale & Ephemeral Daily Specials
          </h1>
          <p className="text-sm text-textMuted max-w-2xl">
            Real-time portion decrementing menu with glowing scarcity indicators and closing-hour flash markdown automation.
          </p>
        </div>

        {/* Active Specials Stats */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-obsidian/80 border border-charcoal-light p-3.5 rounded-xl text-right">
            <div className="text-[11px] font-mono text-textMuted uppercase">Active Specials</div>
            <div className="text-xl font-heading font-black text-violet-400">
              {activeSpecials.filter((s) => !s.isSoldOut).length} <span className="text-xs font-normal text-textMuted">SKUs live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Closing-Hour Flash Markdown Slider */}
      <FlashDiscountSlider />

      {/* Main Terminal Layout: Left Menu (8 cols), Right Cart/Receipt (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Dual Section Menu Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Menu Search & Category Filter Bar */}
          <div className="glass-panel p-3.5 rounded-2xl border border-charcoal-light flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish name..."
                className="w-full bg-charcoal text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-charcoal-light focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'specials', label: '🔥 Chef Upcycled Specials' },
                { id: 'entrees', label: 'Main Entrees' },
                { id: 'sides', label: 'Sides & Breads' },
                { id: 'beverages', label: 'Beverages' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as typeof selectedFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedFilter === tab.id
                      ? 'bg-emerald-500 text-obsidian font-bold shadow-glow-emerald'
                      : 'bg-charcoal text-textMuted hover:text-white border border-charcoal-light'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Chef's Dynamic Daily Specials (Glowing Violet/Emerald Glassmorphic Cards) */}
          {filteredSpecials.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping" />
                  <h2 className="font-heading font-black text-white text-lg tracking-tight">
                    🔥 Chef's Dynamic Daily Specials (Upcycled Byproducts)
                  </h2>
                </div>
                <span className="text-xs font-mono text-violet-300">
                  Real-time stock decrementing
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSpecials.map((special) => {
                  const isSoldOut = special.isSoldOut || special.remainingPortions <= 0;

                  return (
                    <div
                      key={special.id}
                      onClick={() => !isSoldOut && addToCart(special, true)}
                      className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                        isSoldOut
                          ? 'bg-charcoal/40 border-charcoal-light opacity-60 cursor-not-allowed'
                          : 'glass-card-special hover:border-violet-400/80 hover:shadow-glow-violet active:scale-[0.98]'
                      }`}
                    >
                      {/* Sold out overlay */}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-obsidian-dark/85 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-20 border border-coral/30">
                          <Lock className="w-7 h-7 text-coral mb-1" />
                          <span className="font-heading font-black text-base text-coral tracking-wider">
                            SOLD OUT
                          </span>
                          <span className="text-[10px] font-mono text-textMuted">
                            All portions claimed / dispatched
                          </span>
                        </div>
                      )}

                      {/* Card Header & Scarcity Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${
                            special.remainingPortions <= 3 && !isSoldOut
                              ? 'bg-coral text-white danger-pulse'
                              : 'bg-violet-600/30 text-violet-200 border border-violet-500/50 scarcity-pulse'
                          }`}>
                            {special.badgeTag}
                          </span>

                          <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                            Zero-Waste Item
                          </span>
                        </div>

                        <h3 className="font-heading font-black text-white text-base mt-2 group-hover:text-violet-300 transition-colors">
                          {special.title}
                        </h3>
                        <p className="text-xs text-textMuted mt-1 leading-relaxed line-clamp-2">
                          {special.description}
                        </p>
                      </div>

                      {/* Pricing & Tap to Add Action */}
                      <div className="mt-4 pt-3 border-t border-charcoal-light flex items-center justify-between">
                        <div>
                          {special.discountPercent > 0 ? (
                            <div className="flex items-baseline space-x-2">
                              <span className="text-lg font-heading font-black text-amber">
                                ₹{special.discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-xs font-mono text-textMuted line-through">
                                ₹{special.basePrice.toFixed(2)}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-amber bg-amber/10 px-1 rounded">
                                -{special.discountPercent}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-heading font-black text-emerald-400">
                              ₹{special.basePrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-textMuted block">
                            {special.remainingPortions} of {special.initialPortions} portions left
                          </span>
                        </div>

                        <button
                          disabled={isSoldOut}
                          className={`p-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                            isSoldOut
                              ? 'bg-charcoal text-textMuted border border-charcoal-light'
                              : 'bg-violet-600 hover:bg-violet-500 text-white shadow-glow-violet'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Standard Regular Menu */}
          {filteredRegular.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-white text-base">
                  Standard Menu Offerings
                </h2>
                <span className="text-xs font-mono text-textMuted">
                  {filteredRegular.length} regular entrees & sides
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRegular.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item, false)}
                    className="p-4 rounded-xl bg-charcoal border border-charcoal-light hover:border-emerald-500/40 hover:bg-charcoal-lighter transition-all flex flex-col justify-between cursor-pointer group active:scale-[0.98]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-textMuted uppercase">
                          {item.category}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          Always Available
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-textMuted mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-charcoal-light/60 flex items-center justify-between">
                      <span className="text-base font-heading font-black text-white">
                        ₹{item.price.toFixed(2)}
                      </span>
                      <button className="p-1.5 px-2.5 rounded-lg bg-obsidian border border-charcoal-light group-hover:border-emerald-500/50 text-textMuted group-hover:text-emerald-300 font-bold text-xs flex items-center space-x-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: Live Order Receipt Panel (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <OrderReceipt />
          </div>
        </div>

      </div>

    </div>
  );
};
