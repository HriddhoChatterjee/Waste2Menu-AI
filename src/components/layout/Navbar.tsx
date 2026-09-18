import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CHEF_PROFILE, NORMAL_USER_PROFILE } from '../../store/useAppStore';
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
  LayoutDashboard,
  UploadCloud,
  LogOut,
  LogIn,
  ShieldCheck,
  ChevronDown,
  UserPlus,
  Users,
  Coins,
  Smartphone
} from 'lucide-react';
import { NotificationTray } from './NotificationTray';
import { LoginModal } from '../auth/LoginModal';
import { BusinessModelModal } from '../business/BusinessModelModal';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    setRole, 
    soundEnabled, 
    toggleSound, 
    notifications, 
    activeSpecials,
    userPersona,
    userProfile,
    isAuthenticated,
    signOut,
    isLoginModalOpen,
    setIsLoginModalOpen,
    authModalMode,
    openAuthModal,
    activeLandingSection,
    setActiveLandingSection
  } = useAppStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeSpecialsCount = activeSpecials.filter((s) => !s.isSoldOut && s.remainingPortions > 0).length;

  // Public Outside Navigation Station Tabs (displayed when NOT logged in)
  const publicNavTabs = [
    {
      id: 'overview',
      label: 'Overview',
      shortLabel: 'Overview',
      icon: <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />,
      action: () => {
        setRole('dashboard');
        setActiveLandingSection('overview');
      },
      isActive: currentRole === 'dashboard' && activeLandingSection === 'overview'
    },
    {
      id: 'recipes',
      label: 'Recipes & Dishes',
      shortLabel: 'Recipes',
      icon: <ChefHat className="w-3.5 h-3.5 shrink-0" />,
      action: () => {
        setRole('user_recipes');
      },
      isActive: currentRole === 'user_recipes'
    },
    {
      id: 'prep',
      label: 'Scrap Intake',
      shortLabel: 'Scraps',
      icon: <UploadCloud className="w-3.5 h-3.5 shrink-0" />,
      action: () => {
        setRole('prep');
      },
      isActive: currentRole === 'prep'
    },
    {
      id: 'impact',
      label: 'Food Saved',
      shortLabel: 'Impact',
      icon: <BarChart3 className="w-3.5 h-3.5 shrink-0" />,
      action: () => {
        setRole('analytics');
      },
      isActive: currentRole === 'analytics'
    },
    {
      id: 'how-it-works',
      label: 'How It Works',
      shortLabel: 'Pipeline',
      icon: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
      action: () => {
        setActiveLandingSection('how-it-works');
      },
      isActive: currentRole === 'dashboard' && activeLandingSection === 'how-it-works'
    },
    {
      id: 'community_kiosk',
      label: 'Offline Kiosk',
      shortLabel: 'Offline Kiosk',
      icon: <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
      action: () => {
        setRole('community_kiosk');
      },
      isActive: currentRole === 'community_kiosk'
    },
    {
      id: 'business-model',
      label: 'Business Model',
      shortLabel: 'ROI Model',
      icon: <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
      action: () => {
        setIsBusinessModalOpen(true);
      },
      isActive: isBusinessModalOpen
    }
  ];

  // Professional Chef navigation station tabs (displayed ONLY after Chef login)
  const chefRoles: { id: Role; label: string; shortLabel?: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      shortLabel: 'Dash',
      icon: <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
    },
    { 
      id: 'prep', 
      label: 'Prep & Scraps', 
      shortLabel: 'Prep',
      icon: <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" /> 
    },
    { 
      id: 'recipes', 
      label: 'Recipe Studio', 
      shortLabel: 'Recipes',
      icon: <ChefHat className="w-3.5 h-3.5 shrink-0" />
    },
    { 
      id: 'pos', 
      label: 'POS Specials', 
      shortLabel: 'POS',
      icon: <CreditCard className="w-3.5 h-3.5 shrink-0" />,
      badge: activeSpecialsCount > 0 ? `${activeSpecialsCount}` : undefined
    },
    { 
      id: 'ngo', 
      label: 'NGO Surplus', 
      shortLabel: 'NGO',
      icon: <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      shortLabel: 'Impact',
      icon: <BarChart3 className="w-3.5 h-3.5 shrink-0" /> 
    },
    {
      id: 'community_kiosk',
      label: 'Offline Kiosk',
      shortLabel: 'Offline Kiosk',
      icon: <Smartphone className="w-3.5 h-3.5 shrink-0" />
    }
  ];

  // Normal user / Home cook navigation station tabs (displayed ONLY after Normal User login)
  const normalUserRoles: { id: Role; label: string; shortLabel?: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      shortLabel: 'Dash',
      icon: <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'prep',
      label: 'Upload Scraps',
      shortLabel: 'Scraps',
      icon: <UploadCloud className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'user_recipes',
      label: 'Chef Recipes',
      shortLabel: 'Recipes',
      icon: <ChefHat className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'analytics',
      label: 'My Waste Impact',
      shortLabel: 'Impact',
      icon: <BarChart3 className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'community_kiosk',
      label: 'Offline Kiosk',
      shortLabel: 'Offline Kiosk',
      icon: <Smartphone className="w-3.5 h-3.5 shrink-0" />
    }
  ];

  const loggedInRolesList = userPersona === 'chef' ? chefRoles : normalUserRoles;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-[#E8DFD1] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* 3-Column Symmetric Grid: Left (1fr), Center (auto, perfectly centered), Right (1fr, aligned right) */}
          <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-center h-16 w-full gap-2">
            
            {/* Column 1 (Left): Logo & Live Sync Pill */}
            <div className="flex items-center justify-start shrink-0">
              <div 
                onClick={() => {
                  setRole('dashboard');
                  if (!isAuthenticated) setActiveLandingSection('overview');
                }}
                className="flex items-center space-x-2.5 cursor-pointer group"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-violet-500/15 border border-emerald-500/30 shadow-xs group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                </div>
                <div className="leading-tight">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-heading font-black text-base sm:text-lg tracking-tight text-[#1C1917]">
                      Waste<span className="text-emerald-600">2</span>Menu
                    </span>
                    {isAuthenticated ? (
                      <span className="px-1.5 py-0.2 text-[8px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 rounded">
                        {userPersona === 'chef' ? 'Chef' : 'Home'}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 text-[8px] font-mono font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200 rounded hidden sm:inline-block">
                        Public
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center space-x-1.5 text-[10px] text-[#6B6358]">
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                    </span>
                    <span className="font-mono text-emerald-700 font-semibold text-[9px]">LIVE SYNC</span>
                    <span className="text-[#D4C6B2]">•</span>
                    <span className="text-[9px]">Zero-Waste</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 (Center): Navigation Station Tabs — MATHEMATICALLY CENTERED VIA CSS GRID (NO COLLISION!) */}
            <div className="hidden lg:flex items-center justify-center min-w-0">
              {!isAuthenticated ? (
                /* Public Navigation Tabs (Every tab opens its respective station!) */
                <nav className="flex items-center space-x-0.5 xl:space-x-1 bg-[#F4EFEA] p-1 rounded-2xl border border-[#E8DFD1] shadow-xs shrink-0">
                  {publicNavTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={tab.action}
                      className={`relative flex items-center space-x-1.5 px-2 xl:px-3 py-1.5 rounded-xl text-xs transition-all duration-150 ${
                        tab.isActive
                          ? 'bg-emerald-700 text-white shadow-xs font-bold'
                          : 'text-[#5C5549] hover:text-[#1C1917] hover:bg-white/80 font-medium'
                      }`}
                    >
                      {tab.icon}
                      <span className="whitespace-nowrap hidden xl:inline">{tab.label}</span>
                      <span className="whitespace-nowrap xl:hidden">{tab.shortLabel}</span>
                    </button>
                  ))}
                </nav>
              ) : (
                /* Authenticated Station Tabs */
                <nav className="flex items-center space-x-0.5 xl:space-x-1 bg-[#F4EFEA] p-1 rounded-2xl border border-[#E8DFD1] shadow-xs shrink-0">
                  {loggedInRolesList.map((role) => {
                    const isActive = currentRole === role.id;
                    return (
                      <button
                        key={role.id}
                        id={`nav-role-${role.id}`}
                        onClick={() => setRole(role.id)}
                        className={`relative flex items-center space-x-1.5 px-2 xl:px-3 py-1.5 rounded-xl text-xs transition-all duration-150 ${
                          isActive
                            ? 'bg-emerald-700 text-white shadow-xs font-bold'
                            : 'text-[#5C5549] hover:text-[#1C1917] hover:bg-white/80 font-medium'
                        }`}
                      >
                        {role.icon}
                        <span className="whitespace-nowrap hidden xl:inline">{role.label}</span>
                        <span className="whitespace-nowrap xl:hidden">{role.shortLabel || role.label}</span>
                        {role.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                              isActive
                                ? 'bg-white/30 text-white'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {role.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Column 3 (Right): User Utilities & Actions (Never overlaps center column) */}
            <div className="flex items-center justify-end space-x-1.5 sm:space-x-2 shrink-0">

              {/* If Logged In: Show Profile Pill */}
              {isAuthenticated ? (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center space-x-1.5 p-1 sm:p-1.5 sm:pr-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#E8DFD1] transition-all shadow-xs"
                >
                  <img
                    src={userProfile?.avatar || CHEF_PROFILE.avatar}
                    alt={userProfile?.name || 'User'}
                    className="w-7 h-7 rounded-lg object-cover border border-emerald-300 shrink-0"
                  />
                  <div className="hidden xl:block text-left leading-tight">
                    <div className="text-xs font-heading font-bold text-stone-900 truncate max-w-[90px]">
                      {userProfile?.name}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-700 font-semibold">
                      {userPersona === 'chef' ? '👨‍🍳 Chef' : '👤 Home'}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-400 hidden sm:block" />
                </button>
              ) : (
                /* If Logged Out: Show Normal Sign In & Register Buttons */
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#E8DFD1] text-stone-800 font-heading font-bold text-xs shadow-xs transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => openAuthModal('register')}
                    className="hidden sm:flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs shadow-xs transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden xl:inline">Register</span>
                  </button>
                </div>
              )}

              {/* Sound Toggle Button (uniform 36px) */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
                className="w-8.5 h-8.5 rounded-xl bg-white hover:bg-[#F5EFEB] text-[#6B6358] hover:text-[#1C1917] border border-[#E8DFD1] transition-colors shadow-xs flex items-center justify-center shrink-0"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#6B6358]" />
                )}
              </button>

              {/* Notification Tray Button (uniform 36px) */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative w-8.5 h-8.5 rounded-xl bg-white hover:bg-[#F5EFEB] text-[#6B6358] hover:text-[#1C1917] border border-[#E8DFD1] transition-colors shadow-xs flex items-center justify-center shrink-0"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold font-mono bg-rose-600 text-white rounded-full border-2 border-white shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Mobile Role / Section Switcher Select (visible on mobile / tablet < lg) */}
              <div className="lg:hidden">
                {!isAuthenticated ? (
                  <select
                    value={
                      currentRole === 'community_kiosk' 
                        ? 'community_kiosk' 
                        : currentRole === 'user_recipes' 
                        ? 'recipes' 
                        : currentRole === 'prep' 
                        ? 'prep' 
                        : currentRole === 'analytics' 
                        ? 'impact' 
                        : isBusinessModalOpen
                        ? 'business_model'
                        : activeLandingSection === 'how-it-works' 
                        ? 'how-it-works' 
                        : 'overview'
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'community_kiosk') {
                        setRole('community_kiosk');
                      } else if (val === 'recipes') {
                        setRole('user_recipes');
                      } else if (val === 'prep') {
                        setRole('prep');
                      } else if (val === 'impact') {
                        setRole('analytics');
                      } else if (val === 'business_model') {
                        setIsBusinessModalOpen(true);
                      } else if (val === 'how-it-works') {
                        setActiveLandingSection('how-it-works');
                      } else {
                        setRole('dashboard');
                        setActiveLandingSection('overview');
                      }
                    }}
                    className="bg-white text-[#1C1917] text-xs font-semibold py-1.5 px-2 rounded-xl border border-[#E8DFD1] shadow-xs focus:outline-none focus:border-emerald-500 max-w-[115px] truncate"
                  >
                    <option value="overview">🏠 Overview</option>
                    <option value="recipes">🍳 Recipes</option>
                    <option value="prep">🌱 Scrap Intake</option>
                    <option value="impact">📊 Food Saved</option>
                    <option value="how-it-works">⚡ How It Works</option>
                    <option value="community_kiosk">📱 Offline Kiosk</option>
                    <option value="business_model">💰 Business Model</option>
                  </select>
                ) : (
                  <select
                    value={currentRole}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="bg-white text-[#1C1917] text-xs font-semibold py-1.5 px-2 rounded-xl border border-[#E8DFD1] shadow-xs focus:outline-none focus:border-emerald-500 max-w-[115px] truncate"
                  >
                    {loggedInRolesList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Spacer to prevent content shift with fixed navbar */}
      <div className="h-16 shrink-0 w-full" aria-hidden="true" />

      {/* Active User Profile & Sign Out Drawer Modal */}
      {isProfileModalOpen && isAuthenticated && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex justify-center items-start p-4 pt-24 sm:pt-28 pb-12">
          <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  Active Workspace Session
                </span>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* User Profile Card */}
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white border border-[#E8DFD1] shadow-xs">
              <img
                src={userProfile?.avatar || CHEF_PROFILE.avatar}
                alt={userProfile?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-heading font-black text-stone-900 text-base truncate">
                  {userProfile?.name}
                </h4>
                <p className="text-xs font-mono font-bold text-emerald-700">
                  {userProfile?.title}
                </p>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-stone-500">
                    {userPersona === 'chef' ? 'Role: Commercial Executive Chef' : 'Role: Home Cook & Zero-Waste'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#E8DFD1]">
                <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">Food Diverted</div>
                <div className="text-base font-heading font-black text-emerald-700">
                  {userProfile?.savedFoodKg || (userPersona === 'chef' ? 142.8 : 12.4)} <span className="text-xs font-normal text-stone-500">kg</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E8DFD1]">
                <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">
                  {userPersona === 'chef' ? 'Recipes Authored' : 'Recipes Cooked'}
                </div>
                <div className="text-base font-heading font-black text-violet-700">
                  {userPersona === 'chef' ? (userProfile?.recipesCreatedCount || 6) : 8} <span className="text-xs font-normal text-stone-500">dishes</span>
                </div>
              </div>
            </div>

            {/* Security Isolation Notice */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-stone-700 font-mono text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Account Isolation Active</span>
              </div>
              <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                You are securely logged into this account. To switch to a different workspace (such as {userPersona === 'chef' ? 'Home Cook' : 'Professional Chef'}), please sign out first.
              </p>
            </div>

            {/* Quick Station Navigation inside Profile */}
            <div className="p-2 space-y-1 bg-stone-50 rounded-2xl border border-stone-200">
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsBusinessModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-stone-700 hover:text-emerald-800 hover:bg-white rounded-xl transition-all"
              >
                <span className="flex items-center space-x-2">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>View B2B Business Model & ROI Tiers</span>
                </span>
                <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                  Enterprise
                </span>
              </button>

              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setRole('community_kiosk');
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-stone-700 hover:text-emerald-800 hover:bg-white rounded-xl transition-all"
              >
                <span className="flex items-center space-x-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Launch Offline Community Kiosk</span>
                </span>
                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                  PWA
                </span>
              </button>
            </div>

            {/* Action Buttons: Sign Out */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  signOut();
                  setIsProfileModalOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-heading font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>

              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Business Model & ROI Architecture Modal */}
      <BusinessModelModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
      />

      {/* Workspace Authentication Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        initialMode={authModalMode}
      />

      {/* Slide-out Notification Tray */}
      <NotificationTray isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
