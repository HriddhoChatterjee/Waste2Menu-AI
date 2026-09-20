import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { MainOpeningDashboard } from './components/dashboard/MainOpeningDashboard';
import { KitchenPrepView } from './components/prep/KitchenPrepView';
import { ReverseRecipeView } from './components/recipes/ReverseRecipeView';
import { NormalUserRecipeView } from './components/recipes/NormalUserRecipeView';
import { NgoPortal } from './components/ngo/NgoPortal';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { OfflineWasteKiosk } from './components/OfflineWasteKiosk';

export function App() {
  const { currentRole } = useAppStore();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col relative overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-800">
      
      {/* Background Ambient Warm Luxury Culinary Glows with Fluid Motion */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[34rem] h-[34rem] bg-emerald-500/12 rounded-full blur-3xl opacity-70 animate-float" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-amber-500/12 rounded-full blur-3xl opacity-60 animate-float-reverse" />
        <div className="absolute -bottom-40 left-1/3 w-[36rem] h-[36rem] bg-violet-500/10 rounded-full blur-3xl opacity-50 animate-float-delayed" />
        
        {/* Subtle culinary grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #78716C 1px, transparent 1px), linear-gradient(to bottom, #78716C 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Fixed Top Navigation Bar with Smooth Section Scrolling & Workspace Access */}
      <Navbar />

      {/* Main Dynamic Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 pb-16">
        {currentRole === 'dashboard' && <MainOpeningDashboard />}
        {currentRole === 'prep' && <KitchenPrepView />}
        {currentRole === 'recipes' && <ReverseRecipeView />}
        {currentRole === 'user_recipes' && <NormalUserRecipeView />}
        {currentRole === 'ngo' && <NgoPortal />}
        {currentRole === 'analytics' && <AnalyticsDashboard />}
        {currentRole === 'community_kiosk' && <OfflineWasteKiosk />}
      </main>

    </div>
  );
}

export default App;
