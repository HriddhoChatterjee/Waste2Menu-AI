import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { db } from '../../services/db';
import { 
  ChefHat, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { UserPersona } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose,
  initialMode = 'signin' 
}) => {
  const { loginWithUser } = useAppStore();
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPersona, setRegPersona] = useState<UserPersona>('chef');
  const [regRestaurantName, setRegRestaurantName] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSignInError(null);
      setRegError(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Handle Sign In Submit
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setSignInError('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = db.authenticate(signInEmail, signInPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        loginWithUser(res.user);
        onClose();
      } else {
        setSignInError(res.error || 'Authentication failed. Please check your credentials.');
      }
    }, 250);
  };

  // Quick Demo Login helper
  const handleQuickDemo = (role: 'chef' | 'user') => {
    setSignInError(null);
    if (role === 'chef') {
      setSignInEmail('chef@waste2menu.com');
      setSignInPassword('chef123');
      const res = db.authenticate('chef@waste2menu.com', 'chef123');
      if (res.success && res.user) {
        loginWithUser(res.user);
        onClose();
      }
    } else {
      setSignInEmail('user@waste2menu.com');
      setSignInPassword('user123');
      const res = db.authenticate('user@waste2menu.com', 'user123');
      if (res.success && res.user) {
        loginWithUser(res.user);
        onClose();
      }
    }
  };

  // Handle Registration Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = db.registerUser({
        name: regName,
        email: regEmail,
        passwordPlain: regPassword,
        persona: regPersona,
        restaurantName: regPersona === 'chef' ? (regRestaurantName || 'Culinary Kitchen') : undefined
      });
      setIsLoading(false);

      if (res.success && res.user) {
        loginWithUser(res.user);
        onClose();
      } else {
        setRegError(res.error || 'Registration failed. Please try again.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-md flex justify-center items-start p-4 pt-24 sm:pt-28 pb-12">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-bold">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Secure Waste2Menu Authentication</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-stone-900">
            {mode === 'signin' ? 'Sign In to Your Workspace' : 'Create New Account'}
          </h2>
          <p className="text-xs text-stone-500">
            {mode === 'signin' 
              ? 'Access your personalized zero-waste dashboard according to your role.' 
              : 'Join Waste2Menu as a Professional Chef or Zero-Waste Home Cook.'}
          </p>
        </div>

        {/* Navigation Mode Tabs: [ Sign In ] | [ Register ] */}
        <div className="grid grid-cols-2 p-1.5 bg-[#F4EFEA] rounded-2xl border border-[#E8DFD1]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setSignInError(null);
            }}
            className={`py-2 rounded-xl text-xs font-heading font-bold transition-all ${
              mode === 'signin'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 font-medium'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setRegError(null);
            }}
            className={`py-2 rounded-xl text-xs font-heading font-bold transition-all ${
              mode === 'register'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 font-medium'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* MODE 1: NORMAL SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Error Message */}
            {signInError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{signInError}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-stone-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="chef@waste2menu.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFD1] bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-stone-700 block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E8DFD1] bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-heading font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-98"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 1-Click Quick Demo Sign In Shortcuts */}
            <div className="pt-2 border-t border-[#E8DFD1] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                <span>Instant Demo Accounts:</span>
                <span className="text-emerald-700 font-bold">1-Click Login</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('chef')}
                  className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-[#E8DFD1] text-left transition-all text-xs group"
                >
                  <div className="flex items-center space-x-1.5 font-bold text-stone-900 group-hover:text-emerald-800">
                    <ChefHat className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Chef Demo</span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    chef@waste2menu.com
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('user')}
                  className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-[#E8DFD1] text-left transition-all text-xs group"
                >
                  <div className="flex items-center space-x-1.5 font-bold text-stone-900 group-hover:text-amber-800">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>Home User Demo</span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    user@waste2menu.com
                  </div>
                </button>
              </div>
            </div>

            {/* Footer link to switch */}
            <div className="text-center pt-2 text-xs text-stone-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegError(null);
                }}
                className="text-emerald-700 font-bold hover:underline"
              >
                Register here
              </button>
            </div>

          </form>
        )}

        {/* MODE 2: REGISTER / SIGN UP FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Error Message */}
            {regError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {/* Role Selection Segment */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-stone-700 block">
                Select Your Account Role:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={() => setRegPersona('chef')}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    regPersona === 'chef'
                      ? 'bg-emerald-50/70 border-emerald-600 shadow-xs'
                      : 'bg-white border-[#E8DFD1] hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${regPersona === 'chef' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-stone-900">
                        Professional Chef
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-semibold">
                        Commercial Kitchen
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setRegPersona('normal_user')}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    regPersona === 'normal_user'
                      ? 'bg-emerald-50/70 border-emerald-600 shadow-xs'
                      : 'bg-white border-[#E8DFD1] hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${regPersona === 'normal_user' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-stone-900">
                        Home Cook
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-semibold">
                        Normal User
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-stone-700 block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={regPersona === 'chef' ? 'Chef Marco Pierre' : 'Ananya Roy'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD1] bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-stone-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="your.name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD1] bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Restaurant Name (Chef only) */}
            {regPersona === 'chef' && (
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-stone-700 block">
                  Restaurant / Kitchen Name (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regRestaurantName}
                    onChange={(e) => setRegRestaurantName(e.target.value)}
                    placeholder="e.g. Saffron Table & Grill"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD1] bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                  />
                </div>
              </div>
            )}

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-stone-700 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 4 chars"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD1] bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-stone-700 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#E8DFD1] bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Registration */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-heading font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-98"
            >
              <span>{isLoading ? 'Creating Account...' : 'Register & Enter Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Footer link to switch */}
            <div className="text-center pt-2 text-xs text-stone-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setSignInError(null);
                }}
                className="text-emerald-700 font-bold hover:underline"
              >
                Sign in here
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
