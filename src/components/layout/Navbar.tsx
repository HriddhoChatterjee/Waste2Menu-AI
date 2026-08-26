import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Role } from '../../types';
import { 
  UtensilsCrossed, 
  ChefHat, 
  CreditCard, 
  HeartHandshake, 
  BarChart3, 
  Bell, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio
} from 'lucide-react';
import { NotificationTray } from './NotificationTray';

export const Navbar: React.FC = () => {
  const { currentRole, setRole, soundEnabled, toggleSound, notifications, activeSpecials } = useAppStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeSpecialsCount = activeSpecials.filter((s) => !s.isSoldOut && s.remainingPortions > 0).length;

  const roles: { id: Role; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'prep', 
      label: 'Kitchen Prep', 
      icon: <UtensilsCrossed className="w-4 h-4" /> 
    },
    { 
      id: 'recipes', 
      label: 'Chef KDS & Recipes', 
      icon: <ChefHat className="w-4 h-4" />,
      badge: 'AI Matched'
    },
    { 
      id: 'pos', 
      label: 'Cashier POS', 
      icon: <CreditCard className="w-4 h-4" />,
      badge: activeSpecialsCount > 0 ? `${activeSpecialsCount} Active` : undefined
    },
    { 
      id: 'ngo', 
      label: 'NGO Surplus Portal', 
      icon: <HeartHandshake className="w-4 h-4" />,
    },
    { 
      id: 'analytics', 
      label: 'Analytics Ledger', 
      icon: <BarChart3 className="w-4 h-4" /> 
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-obsidian-dark/95 backdrop-blur-xl border-b border-charcoal-light shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Live Sync Pill */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/40 shadow-glow-emerald">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-heading font-black text-lg tracking-tight text-white">
                    Waste<span className="text-emerald-400">2</span>Menu
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/40 rounded">
                    AI Vision
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-textMuted">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-emerald-400/90 font-medium">LIVE WS SYNC</span>
                  <span className="text-charcoal-light">•</span>
                  <span>Brigade Hub #4</span>
                </div>
              </div>
            </div>

            {/* Center: Role Switcher Tabs */}
            <nav className="hidden md:flex items-center space-x-1 bg-charcoal/80 p-1.5 rounded-xl border border-charcoal-light/60">
              {roles.map((role) => {
                const isActive = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    id={`nav-role-${role.id}`}
                    onClick={() => setRole(role.id)}
                    className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-obsidian shadow-glow-emerald font-bold'
                        : 'text-textMuted hover:text-white hover:bg-charcoal-light/60'
                    }`}
                  >
                    {role.icon}
                    <span>{role.label}</span>
                    {role.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                          isActive
                            ? 'bg-obsidian/40 text-emerald-950'
                            : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        }`}
                      >
                        {role.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Controls: Audio Toggle, Notifications, Mobile Role dropdown */}
            <div className="flex items-center space-x-3">
              
              {/* Sound toggle */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
                className="p-2 rounded-lg bg-charcoal hover:bg-charcoal-light text-textMuted hover:text-white border border-charcoal-light transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-textMuted" />
                )}
              </button>

              {/* Notification Tray Button */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-lg bg-charcoal hover:bg-charcoal-light text-textMuted hover:text-white border border-charcoal-light transition-colors"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold font-mono bg-coral text-white rounded-full border-2 border-obsidian animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Mobile Role Switcher Select */}
              <div className="md:hidden">
                <select
                  value={currentRole}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="bg-charcoal text-white text-xs font-semibold py-2 px-3 rounded-lg border border-charcoal-light focus:outline-none focus:border-emerald-500"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Notification Tray */}
      <NotificationTray isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
