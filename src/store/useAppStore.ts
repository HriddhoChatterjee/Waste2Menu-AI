import { create } from 'zustand';
import { 
  Role, 
  ScrapItem, 
  RecipeDish, 
  ActiveSpecialSKU, 
  RegularMenuItem, 
  CartItem, 
  CompletedOrder, 
  NgoBatch, 
  StaffBenchmark, 
  AppNotification 
} from '../types';
import { 
  INITIAL_SCRAPS, 
  INITIAL_RECIPES, 
  INITIAL_SPECIALS, 
  REGULAR_MENU_ITEMS, 
  INITIAL_NGO_BATCHES, 
  STAFF_BENCHMARKS 
} from '../utils/mockData';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface AppState {
  // Navigation & Preferences
  currentRole: Role;
  setRole: (role: Role) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  isSimulating: boolean;

  // Screen 1: Scrap Reservoir
  scraps: ScrapItem[];
  addScrap: (item: Omit<ScrapItem, 'id' | 'timestamp'>) => void;
  removeScrap: (id: string) => void;
  decrementScrapStock: (category: string, weightKg: number) => void;

  // Screen 2: Reverse Recipes
  recipes: RecipeDish[];
  togglePantryIngredient: (recipeId: string, ingredientName: string) => void;
  pushRecipeToPos: (recipeId: string, yieldPortions?: number) => void;

  // Screen 3: POS Terminal & Dynamic Specials
  activeSpecials: ActiveSpecialSKU[];
  regularMenu: RegularMenuItem[];
  cart: CartItem[];
  flashDiscountPercent: number;
  setFlashDiscount: (percent: number) => void;
  addToCart: (item: RegularMenuItem | ActiveSpecialSKU, isSpecial: boolean) => boolean;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  completedOrders: CompletedOrder[];
  checkoutCart: (paymentMethod: 'Card' | 'UPI' | 'Cash', cashierName?: string) => CompletedOrder | null;

  // Screen 4: NGO Redistribution
  ngoBatches: NgoBatch[];
  broadcastUnsoldSpecialsToNgo: () => number;
  claimNgoBatch: (batchId: string, ngoName: string) => boolean;
  verifyNgoOtp: (otp: string) => { success: boolean; message: string; batch?: NgoBatch };

  // Screen 5: Staff Analytics
  staffBenchmarks: StaffBenchmark[];
  addStaffBenchmark: (entry: { cookName: string; station: string; dishPrepared: string; coreWeightKg: number; trimLossKg: number; benchmarkLossPercent: number }) => void;

  // Notifications Feed
  notifications: AppNotification[];
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Quick Simulation Triggers
  simulateScrapDump: () => void;
  simulateOrderRush: () => void;
  simulateShiftEndFallback: () => void;
  resetAllData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: 'prep',
  setRole: (role) => {
    sounds.playPosTap();
    set({ currentRole: role });
  },

  soundEnabled: true,
  toggleSound: () => {
    const next = !get().soundEnabled;
    sounds.setEnabled(next);
    set({ soundEnabled: next });
  },
  isSimulating: false,

  // Scraps
  scraps: INITIAL_SCRAPS,
  addScrap: (item) => {
    const newScrap: ScrapItem = {
      ...item,
      id: `scrap-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      scraps: [newScrap, ...state.scraps]
    }));

    sounds.playScanBeep();

    get().addNotification({
      type: 'scrap_scanned',
      title: 'Scrap Reservoir Updated',
      message: `Added ${item.weightKg} kg of ${item.name} (${item.category.replace('_', ' ')}).`,
      roleTarget: 'all'
    });
  },
  removeScrap: (id) => {
    set((state) => ({
      scraps: state.scraps.filter((s) => s.id !== id)
    }));
  },
  decrementScrapStock: (category, weightKg) => {
    set((state) => {
      let remainingToDeduct = weightKg;
      const updated = state.scraps.map((s) => {
        if (s.category === category && remainingToDeduct > 0) {
          if (s.weightKg <= remainingToDeduct) {
            remainingToDeduct -= s.weightKg;
            return null;
          } else {
            const newWeight = Math.round((s.weightKg - remainingToDeduct) * 10) / 10;
            remainingToDeduct = 0;
            return { ...s, weightKg: newWeight };
          }
        }
        return s;
      }).filter(Boolean) as ScrapItem[];

      return { scraps: updated };
    });
  },

  // Recipes
  recipes: INITIAL_RECIPES,
  togglePantryIngredient: (recipeId, ingredientName) => {
    set((state) => ({
      recipes: state.recipes.map((r) => {
        if (r.id === recipeId) {
          return {
            ...r,
            pantryIngredients: r.pantryIngredients.map((pi) => 
              pi.name === ingredientName ? { ...pi, inStock: !pi.inStock } : pi
            )
          };
        }
        return r;
      })
    }));
  },

  pushRecipeToPos: (recipeId, customPortions) => {
    const recipe = get().recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    const portions = customPortions || recipe.yieldPortions;
    const discount = get().flashDiscountPercent;
    const discountedPrice = Math.round(recipe.suggestedPrice * (1 - discount / 100));

    const newSku: ActiveSpecialSKU = {
      id: `sku-special-${Date.now()}`,
      recipeId: recipe.id,
      title: recipe.title,
      initialPortions: portions,
      remainingPortions: portions,
      basePrice: recipe.suggestedPrice,
      discountedPrice: discountedPrice,
      discountPercent: discount,
      category: 'Daily Special',
      isSoldOut: false,
      pushedTimestamp: new Date().toISOString(),
      expiryTimestamp: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      isSurplusSentToNgo: false,
      description: recipe.description,
      badgeTag: `🔥 ONLY ${portions} PORTIONS LEFT`
    };

    // Deduct scraps needed
    get().decrementScrapStock(recipe.scrapTypeNeeded, recipe.scrapWeightNeededKg);

    // Update recipe status
    set((state) => ({
      activeSpecials: [newSku, ...state.activeSpecials],
      recipes: state.recipes.map((r) => r.id === recipeId ? { ...r, status: 'approved_to_pos' } : r)
    }));

    sounds.playSuccessChime();

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    get().addNotification({
      type: 'pos_pushed',
      title: 'Chef Approved Dynamic Special',
      message: `"${recipe.title}" is now LIVE on Cashier POS with ${portions} portions (₹${recipe.suggestedPrice}).`,
      roleTarget: 'all'
    });
  },

  // POS & Specials
  activeSpecials: INITIAL_SPECIALS,
  regularMenu: REGULAR_MENU_ITEMS,
  cart: [],
  flashDiscountPercent: 0,
  setFlashDiscount: (percent) => {
    sounds.playPosTap();
    set((state) => ({
      flashDiscountPercent: percent,
      activeSpecials: state.activeSpecials.map((spec) => {
        const discounted = Math.round(spec.basePrice * (1 - percent / 100));
        return {
          ...spec,
          discountPercent: percent,
          discountedPrice: discounted
        };
      })
    }));

    if (percent > 0) {
      get().addNotification({
        type: 'flash_markdown',
        title: '⚡ Closing-Hour Markdown Active',
        message: `Applied ${percent}% flash discount across all Chef Dynamic Specials.`,
        roleTarget: 'pos'
      });
    }
  },

  addToCart: (item, isSpecial) => {
    sounds.playPosTap();

    const state = get();
    if (isSpecial) {
      const special = state.activeSpecials.find((s) => s.id === item.id);
      if (!special || special.remainingPortions <= 0 || special.isSoldOut) {
        sounds.playSoldOutAlert();
        return false;
      }
      
      const existingInCart = state.cart.find((c) => c.skuId === special.id);
      const currentCartQty = existingInCart ? existingInCart.quantity : 0;
      if (currentCartQty >= special.remainingPortions) {
        sounds.playSoldOutAlert();
        return false;
      }

      if (existingInCart) {
        set({
          cart: state.cart.map((c) => c.skuId === special.id ? { ...c, quantity: c.quantity + 1 } : c)
        });
      } else {
        const newCartItem: CartItem = {
          id: `cart-${Date.now()}`,
          skuId: special.id,
          isSpecial: true,
          title: special.title,
          price: special.discountedPrice,
          quantity: 1,
          maxAvailable: special.remainingPortions
        };
        set({ cart: [...state.cart, newCartItem] });
      }
      return true;
    } else {
      const regular = state.regularMenu.find((r) => r.id === item.id);
      if (!regular) return false;

      const existingInCart = state.cart.find((c) => c.id === regular.id && !c.isSpecial);
      if (existingInCart) {
        set({
          cart: state.cart.map((c) => (c.id === regular.id && !c.isSpecial) ? { ...c, quantity: c.quantity + 1 } : c)
        });
      } else {
        const newCartItem: CartItem = {
          id: regular.id,
          isSpecial: false,
          title: regular.title,
          price: regular.price,
          quantity: 1
        };
        set({ cart: [...state.cart, newCartItem] });
      }
      return true;
    }
  },

  updateCartQuantity: (id, delta) => {
    sounds.playPosTap();
    set((state) => {
      const updated = state.cart.map((c) => {
        if (c.id === id || c.skuId === id) {
          const newQty = c.quantity + delta;
          if (c.maxAvailable && newQty > c.maxAvailable) {
            return c;
          }
          return newQty > 0 ? { ...c, quantity: newQty } : null;
        }
        return c;
      }).filter(Boolean) as CartItem[];

      return { cart: updated };
    });
  },

  removeFromCart: (id) => {
    sounds.playPosTap();
    set((state) => ({
      cart: state.cart.filter((c) => c.id !== id && c.skuId !== id)
    }));
  },

  clearCart: () => {
    sounds.playPosTap();
    set({ cart: [] });
  },

  completedOrders: [
    {
      id: 'ord-801',
      orderNumber: '#WM-801',
      items: [
        { id: 'c-1', isSpecial: true, title: 'Slow-Roasted Peppercorn Bone Broth', price: 89, quantity: 2 },
        { id: 'reg-1', isSpecial: false, title: 'Smoked Butter Chicken Supreme', price: 349, quantity: 1 }
      ],
      subtotal: 527,
      discountAmount: 0,
      totalAmount: 527,
      timestamp: '2026-08-25T13:30:00Z',
      cashierName: 'Aarav (POS-01)',
      paymentMethod: 'UPI'
    }
  ],

  checkoutCart: (paymentMethod = 'UPI', cashierName = 'Aarav (POS-01)') => {
    const state = get();
    if (state.cart.length === 0) return null;

    let subtotal = 0;
    const specialItemsToDecrement: { skuId: string; qty: number }[] = [];

    state.cart.forEach((item) => {
      subtotal += item.price * item.quantity;
      if (item.isSpecial && item.skuId) {
        specialItemsToDecrement.push({ skuId: item.skuId, qty: item.quantity });
      }
    });

    // Create completed order
    const orderNum = `#WM-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: CompletedOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      items: [...state.cart],
      subtotal: subtotal,
      discountAmount: 0,
      totalAmount: subtotal,
      timestamp: new Date().toISOString(),
      cashierName: cashierName,
      paymentMethod: paymentMethod
    };

    // Decrement specials inventory live
    const updatedSpecials = state.activeSpecials.map((spec) => {
      const match = specialItemsToDecrement.find((d) => d.skuId === spec.id);
      if (match) {
        const remaining = Math.max(0, spec.remainingPortions - match.qty);
        const isSoldOut = remaining <= 0;
        let badge = `🔥 ONLY ${remaining} PORTIONS LEFT`;
        if (remaining <= 3 && remaining > 0) {
          badge = `⚡ CRITICAL SCARCITY (${remaining} LEFT)`;
        } else if (isSoldOut) {
          badge = 'SOLD OUT';
        }

        return {
          ...spec,
          remainingPortions: remaining,
          isSoldOut: isSoldOut,
          badgeTag: badge
        };
      }
      return spec;
    });

    set({
      completedOrders: [newOrder, ...state.completedOrders],
      activeSpecials: updatedSpecials,
      cart: []
    });

    sounds.playOrderSuccess();

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    get().addNotification({
      type: 'pos_ordered',
      title: `Order Placed: ${orderNum}`,
      message: `Total ₹${subtotal} paid via ${paymentMethod}. Upcycled portions decremented in real-time.`,
      roleTarget: 'all'
    });

    // Check if any special was depleted
    updatedSpecials.forEach((s) => {
      if (s.isSoldOut) {
        const previous = state.activeSpecials.find((prev) => prev.id === s.id);
        if (previous && !previous.isSoldOut) {
          get().addNotification({
            type: 'stock_depleted',
            title: `🚫 Stock Depleted: ${s.title}`,
            message: `Chef Special "${s.title}" has completely SOLD OUT at POS.`,
            roleTarget: 'all'
          });
        }
      }
    });

    return newOrder;
  },

  // NGO Portal
  ngoBatches: INITIAL_NGO_BATCHES,
  broadcastUnsoldSpecialsToNgo: () => {
    const state = get();
    const unsoldSpecials = state.activeSpecials.filter((s) => !s.isSoldOut && s.remainingPortions > 0 && !s.isSurplusSentToNgo);
    if (unsoldSpecials.length === 0) return 0;

    const newBatches: NgoBatch[] = unsoldSpecials.map((s) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        id: `ngo-batch-${Date.now()}-${s.id}`,
        specialSkuId: s.id,
        dishName: s.title,
        portionsAvailable: s.remainingPortions,
        safeConsumptionHours: 5.5,
        restaurantDistanceKm: Math.round((1.5 + Math.random() * 4) * 10) / 10,
        status: 'broadcast',
        pickupOtp: otp,
        tempControlStatus: 'Chilled (<4°C)',
        pickupContact: 'Shift Lead (+91 98800 12345)',
        address: 'Waste2Menu Kitchen #4, Brigade Gateway Plaza, Bangalore'
      };
    });

    const updatedSpecials = state.activeSpecials.map((s) => {
      if (unsoldSpecials.some((u) => u.id === s.id)) {
        return { ...s, isSurplusSentToNgo: true, remainingPortions: 0, isSoldOut: true, badgeTag: 'TRANSFERRED TO NGO' };
      }
      return s;
    });

    set({
      ngoBatches: [...newBatches, ...state.ngoBatches],
      activeSpecials: updatedSpecials
    });

    sounds.playScanBeep();

    get().addNotification({
      type: 'ngo_broadcast',
      title: '🚨 Surplus Food Broadcast to NGO Portal',
      message: `Released ${newBatches.length} surplus special batches (${newBatches.reduce((acc, b) => acc + b.portionsAvailable, 0)} meals) for pickup.`,
      roleTarget: 'all'
    });

    return newBatches.length;
  },

  claimNgoBatch: (batchId, ngoName) => {
    sounds.playSuccessChime();
    let claimed = false;
    set((state) => ({
      ngoBatches: state.ngoBatches.map((b) => {
        if (b.id === batchId && b.status === 'broadcast') {
          claimed = true;
          return {
            ...b,
            status: 'claimed',
            ngoName: ngoName || 'Robin Hood Army',
            claimedAt: new Date().toISOString()
          };
        }
        return b;
      })
    }));

    if (claimed) {
      get().addNotification({
        type: 'ngo_claimed',
        title: 'Surplus Batch Claimed by NGO',
        message: `${ngoName} has claimed batch with 6-digit OTP verification required at cashier handover.`,
        roleTarget: 'all'
      });
    }

    return claimed;
  },

  verifyNgoOtp: (enteredOtp) => {
    const state = get();
    const batch = state.ngoBatches.find((b) => b.pickupOtp.trim() === enteredOtp.trim() && b.status === 'claimed');

    if (!batch) {
      sounds.playSoldOutAlert();
      return { success: false, message: 'Invalid or expired 6-Digit OTP code. Please check with NGO volunteer.' };
    }

    set((s) => ({
      ngoBatches: s.ngoBatches.map((b) => b.id === batch.id ? { ...b, status: 'verified_handed_over', verifiedAt: new Date().toISOString() } : b)
    }));

    sounds.playSuccessChime();

    try {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    get().addNotification({
      type: 'ngo_verified',
      title: '🤝 NGO Handover Complete & Verified',
      message: `Handed over ${batch.portionsAvailable} portions of "${batch.dishName}" to ${batch.ngoName || 'NGO Partner'}.`,
      roleTarget: 'all'
    });

    return { success: true, message: `Handover successful! ${batch.portionsAvailable} meals released to ${batch.ngoName || 'NGO'}.`, batch };
  },

  // Staff Efficiency
  staffBenchmarks: STAFF_BENCHMARKS,
  addStaffBenchmark: ({ cookName, station, dishPrepared, coreWeightKg, trimLossKg, benchmarkLossPercent }) => {
    const totalMass = coreWeightKg + trimLossKg;
    const lossPercent = totalMass > 0 ? Math.round((trimLossKg / totalMass) * 1000) / 10 : 0;
    
    let status: 'optimal' | 'moderate' | 'high_loss_anomaly' = 'optimal';
    if (lossPercent > benchmarkLossPercent * 1.35) {
      status = 'high_loss_anomaly';
    } else if (lossPercent > benchmarkLossPercent) {
      status = 'moderate';
    }

    const entry: StaffBenchmark = {
      id: `staff-${Date.now()}`,
      cookName,
      station,
      dishPrepared,
      coreWeightKg,
      trimLossKg,
      lossPercent,
      benchmarkLossPercent,
      status,
      shiftDate: new Date().toISOString().split('T')[0]
    };

    set((state) => ({
      staffBenchmarks: [entry, ...state.staffBenchmarks]
    }));

    if (status === 'high_loss_anomaly') {
      get().addNotification({
        type: 'scrap_scanned',
        title: '⚠️ Knife-Loss Anomaly Flagged',
        message: `${cookName} at ${station} recorded ${lossPercent}% trim loss (benchmark: ${benchmarkLossPercent}%).`,
        roleTarget: 'all'
      });
    }
  },

  // Notifications
  notifications: [
    {
      id: 'notif-1',
      type: 'recipe_unlocked',
      title: 'AI Reverse-Recipe Matched',
      message: 'New byproduct batch unlocked: "Slow-Roasted Peppercorn Bone Broth" (92.7% margin).',
      timestamp: '10m ago',
      roleTarget: 'all',
      read: false
    },
    {
      id: 'notif-2',
      type: 'pos_ordered',
      title: 'Dynamic Special Ordered',
      message: 'Table #4 ordered 2x Peppercorn Broth. 9 portions remaining.',
      timestamp: '25m ago',
      roleTarget: 'pos',
      read: false
    },
    {
      id: 'notif-3',
      type: 'ngo_claimed',
      title: 'NGO Batch Claimed',
      message: 'Robin Hood Army claimed Batch #WM-101. OTP Handover pending.',
      timestamp: '40m ago',
      roleTarget: 'ngo',
      read: false
    }
  ],

  addNotification: (notif) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications].slice(0, 30)
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Quick Simulation Triggers
  simulateScrapDump: () => {
    const categories: import('../types').ScrapCategory[] = ['poultry_bones', 'mirepoix_peels', 'citrus_rinds', 'herb_stems'];
    const names = [
      'Roast Lamb Shank Trim & Marrow',
      'Fennel Tops & Shallot Skins',
      'Grapefruit & Lime Pith Trimmings',
      'Thai Basil & Rosemary Stem Stash'
    ];
    const idx = Math.floor(Math.random() * categories.length);
    const weight = Math.round((1.2 + Math.random() * 2.5) * 10) / 10;

    get().addScrap({
      name: names[idx],
      category: categories[idx],
      weightKg: weight,
      perishableHoursLeft: 8.5,
      maxPerishableHours: 12.0,
      qualityScore: 95,
      detectedFromVision: true,
      notes: 'Automated conveyor AI detection trigger.'
    });
  },

  simulateOrderRush: () => {
    const active = get().activeSpecials.filter((s) => !s.isSoldOut && s.remainingPortions > 0);
    if (active.length > 0) {
      const randomSpecial = active[Math.floor(Math.random() * active.length)];
      get().addToCart(randomSpecial, true);
      if (Math.random() > 0.5) {
        get().addToCart(get().regularMenu[0], false);
      }
      get().checkoutCart('UPI', 'Sim-POS Rush');
    }
  },

  simulateShiftEndFallback: () => {
    get().broadcastUnsoldSpecialsToNgo();
  },

  resetAllData: () => {
    sounds.playPosTap();
    set({
      scraps: INITIAL_SCRAPS,
      recipes: INITIAL_RECIPES,
      activeSpecials: INITIAL_SPECIALS,
      regularMenu: REGULAR_MENU_ITEMS,
      ngoBatches: INITIAL_NGO_BATCHES,
      staffBenchmarks: STAFF_BENCHMARKS,
      cart: [],
      flashDiscountPercent: 0
    });
  }
}));
