import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { SimControls } from './components/layout/SimControls';
import { KitchenPrepView } from './components/prep/KitchenPrepView';
import { ReverseRecipeView } from './components/recipes/ReverseRecipeView';
import { PosTerminal } from './components/pos/PosTerminal';
import { NgoPortal } from './components/ngo/NgoPortal';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';

export function App() {
  const { currentRole } = useAppStore();

  return (
    <div className="min-h-screen bg-obsidian text-textPrimary flex flex-col relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber/5 rounded-full blur-3xl opacity-40" />
        
        {/* Subtle grid background pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #94A3B8 1px, transparent 1px), linear-gradient(to bottom, #94A3B8 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Sticky Top Navigation Bar with Role Switcher */}
      <Navbar />

      {/* Main Dynamic Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 pb-24">
        {currentRole === 'prep' && <KitchenPrepView />}
        {currentRole === 'recipes' && <ReverseRecipeView />}
        {currentRole === 'pos' && <PosTerminal />}
        {currentRole === 'ngo' && <NgoPortal />}
        {currentRole === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Floating Simulation Toolbar */}
      <SimControls />

    </div>
  );
}

export default App;
