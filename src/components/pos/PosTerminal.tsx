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
import { ScrollReveal } from '../common/ScrollReveal';

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
      <ScrollReveal direction="up" distance={20}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DFD1] shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Station Screen 3
              </span>
              <span className="text-stone-500 text-xs font-mono">• Cashier POS Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-stone-900">
              Live Point-of-Sale & Ephemeral Daily Specials
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl">
              Real-time portion decrementing menu with glowing scarcity indicators and closing-hour flash markdown automation.
            </p>
          </div>

          {/* Active Specials Stats */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-[#FAF7F2] border border-[#E8DFD1] p-3.5 rounded-xl text-right">
              <div className="text-[11px] font-mono text-stone-500 uppercase font-semibold">Active Specials</div>
              <div className="text-xl font-heading font-black text-violet-700">
                {activeSpecials.filter((s) => !s.isSoldOut).length} <span className="text-xs font-normal text-stone-500">SKUs live</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Closing-Hour Flash Markdown Slider */}
      <ScrollReveal direction="up" distance={20} delay={0.06}>
        <FlashDiscountSlider />
      </ScrollReveal>

      {/* Main Terminal Layout: Left Menu (8 cols), Right Cart/Receipt (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Dual Section Menu Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Menu Search & Category Filter Bar */}
          <ScrollReveal direction="up" distance={20} delay={0.1}>
            <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#E8DFD1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dish name..."
                  className="w-full bg-white text-stone-900 text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD1] focus:outline-none focus:border-emerald-500 shadow-xs"
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
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Section 1: Chef's Dynamic Daily Specials */}
          {filteredSpecials.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-ping" />
                  <h2 className="font-heading font-black text-stone-900 text-lg tracking-tight">
                    🔥 Chef's Dynamic Daily Specials (Upcycled Byproducts)
                  </h2>
                </div>
                <span className="text-xs font-mono text-violet-700 font-semibold">
                  Real-time stock decrementing
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSpecials.map((special, idx) => {
                  const isSoldOut = special.isSoldOut || special.remainingPortions <= 0;

                  return (
                    <ScrollReveal key={special.id} delay={idx * 0.05} direction="up" distance={20}>
                      <div
                        onClick={() => !isSoldOut && addToCart(special, true)}
                        className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full ${
                          isSoldOut
                            ? 'bg-stone-100 border-[#E8DFD1] opacity-60 cursor-not-allowed'
                            : 'bg-[#FFFDF9] border-violet-200 hover:border-violet-400 hover:shadow-md shadow-xs active:scale-[0.98]'
                        }`}
                      >
                        {/* Sold out overlay */}
                        {isSoldOut && (
                          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-20 border border-rose-300">
                            <Lock className="w-7 h-7 text-rose-300 mb-1" />
                            <span className="font-heading font-black text-base text-white tracking-wider">
                              SOLD OUT
                            </span>
                            <span className="text-[10px] font-mono text-stone-200">
                              All portions claimed / dispatched
                            </span>
                          </div>
                        )}

                        {/* Card Header & Scarcity Badge */}
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${
                              special.remainingPortions <= 3 && !isSoldOut
                                ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                                : 'bg-violet-100 text-violet-800 border border-violet-300'
                            }`}>
                              {special.badgeTag}
                            </span>

                            <span className="text-[10px] font-mono text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                              Zero-Waste Item
                            </span>
                          </div>

                          <h3 className="font-heading font-black text-stone-900 text-base mt-2 group-hover:text-violet-700 transition-colors">
                            {special.title}
                          </h3>
                          <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                            {special.description}
                          </p>
                        </div>

                        {/* Pricing & Tap to Add Action */}
                        <div className="mt-4 pt-3 border-t border-[#E8DFD1] flex items-center justify-between">
                          <div>
                            {special.discountPercent > 0 ? (
                              <div className="flex items-baseline space-x-2">
                                <span className="text-lg font-heading font-black text-amber-700">
                                  ₹{special.discountedPrice.toFixed(2)}
                                </span>
                                <span className="text-xs font-mono text-stone-400 line-through">
                                  ₹{special.basePrice.toFixed(2)}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1 rounded border border-amber-200">
                                  -{special.discountPercent}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-heading font-black text-emerald-700">
                                ₹{special.basePrice.toFixed(2)}
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-stone-500 block">
                              {special.remainingPortions} of {special.initialPortions} portions left
                            </span>
                          </div>

                          <button
                            disabled={isSoldOut}
                            className={`p-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                              isSoldOut
                                ? 'bg-stone-200 text-stone-400 border border-[#E8DFD1]'
                                : 'bg-violet-600 hover:bg-violet-700 text-white shadow-xs'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                          </button>
                        </div>

                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Standard Regular Menu */}
          {filteredRegular.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-stone-900 text-base">
                  Standard Menu Offerings
                </h2>
                <span className="text-xs font-mono text-stone-500">
                  {filteredRegular.length} regular entrees & sides
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRegular.map((item, idx) => (
                  <ScrollReveal key={item.id} delay={idx * 0.04} direction="up" distance={20}>
                    <div
                      onClick={() => addToCart(item, false)}
                      className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E8DFD1] hover:border-emerald-400 hover:bg-white transition-all flex flex-col justify-between cursor-pointer group active:scale-[0.98] shadow-xs h-full"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold">
                            {item.category}
                          </span>
                          <span className="text-xs font-mono text-emerald-700 font-bold">
                            Always Available
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#E8DFD1] flex items-center justify-between">
                        <span className="text-base font-heading font-black text-stone-900">
                          ₹{item.price.toFixed(2)}
                        </span>
                        <button className="p-1.5 px-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFD1] group-hover:border-emerald-400 text-stone-600 group-hover:text-emerald-700 font-bold text-xs flex items-center space-x-1 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: Live Order Receipt Panel (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <ScrollReveal direction="left" distance={24} delay={0.12}>
              <OrderReceipt />
            </ScrollReveal>
          </div>
        </div>

      </div>

    </div>
  );
};
