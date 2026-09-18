import React from 'react';
import { 
  X, 
  TrendingUp, 
  Coins, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  HeartHandshake, 
  BarChart3, 
  ArrowRight,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface BusinessModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessModelModal: React.FC<BusinessModelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tiers = [
    {
      name: 'KitchenOS Starter',
      target: 'Bistros, Cafés & Cloud Kitchens',
      price: '₹4,999 / mo',
      usdPrice: '($59 / mo)',
      popular: false,
      features: [
        'Cutting-board scrap vision scanner (up to 50 kg/day)',
        'Reverse recipe recommendation engine',
        'Single POS station integration (dynamic daily specials)',
        'Standard food waste diversion reporting',
        'Community shelter donation link generator'
      ]
    },
    {
      name: 'Commercial Enterprise',
      target: 'Hotels, Banquets & Restaurant Chains',
      price: '₹14,999 / mo',
      usdPrice: '($179 / mo)',
      popular: true,
      badge: 'Most Popular',
      features: [
        'Unlimited scrap vision ingestion & staff prep benchmarks',
        'Custom executive chef recipe authoring studio',
        'Multi-terminal POS sync with dynamic flash discounts',
        'Automated NGO redistribution with tamper-proof OTP',
        'ISO 14001 & UN SDG 12.3 audit-ready ESG certificates',
        'Section 80G / CSR tax deduction receipt generator'
      ]
    },
    {
      name: 'Institutional & Global',
      target: 'Hospitality Groups & Corporate Campuses',
      price: 'Custom Pricing',
      usdPrice: '(Annual Licensing)',
      popular: false,
      features: [
        'Direct Oracle Micros, Toast, and SAP POS connectors',
        'Centralized commissary supply chain optimization',
        'Dedicated culinary sustainability account director',
        'Custom multi-facility carbon offset ledger',
        'On-premise edge computing for zero-latency offline prep'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center items-start p-4 pt-16 sm:pt-20 pb-16 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl relative space-y-8">
        
        {/* Close button */}
        <button
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
            <Coins className="w-3.5 h-3.5 text-emerald-700" />
            <span>Commercial B2B Architecture & Unit Economics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-900 tracking-tight">
            How Waste2Menu Creates & Captures Value
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            Commercial kitchens discard 15%–25% of purchased food as prep shrinkage and unsold surplus. 
            Waste2Menu transforms this unmonetized loss into high-margin daily specials, tax deductions, and verified ESG credits.
          </p>
        </div>

        {/* The 4 Core Value Engines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-stone-900 text-sm">18.4% Food Cost Cut</h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Carrot peels, bone frames, and bread crusts replace raw stock and soup purchases, directly trimming monthly wholesale procurement.
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-stone-900 text-sm">85%–94% Gross Margins</h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Because the raw byproducts carry zero ingredient acquisition cost, recovered daily specials deliver industry-leading profit margins.
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-stone-900 text-sm">CSR & 80G Tax Credits</h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Unsold specials dispatched to verified shelters generate automated tax deduction audit trails under Section 80G / Corporate CSR guidelines.
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-stone-900 text-sm">ISO 14001 ESG Audits</h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Automated Scope 3 emissions calculations and landfill diversion metrics ready for corporate hospitality ESG sustainability certifications.
            </p>
          </div>
        </div>

        {/* Commercial Unit Economics Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFD1] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block">Unit Economics</span>
              <h3 className="font-heading font-black text-stone-900 text-base">
                Average Restaurant ROI (15 kg Prep Scrap / Day)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Payback Period: &lt; 4 Days
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">Raw Purchasing Saved</span>
              <div className="text-xl font-heading font-black text-emerald-700">₹24,500 / mo</div>
              <p className="text-[10px] text-stone-500">Eliminates canned stocks, glazes, and thickening bases</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">POS Daily Specials Sales</span>
              <div className="text-xl font-heading font-black text-violet-700">₹58,800 / mo</div>
              <p className="text-[10px] text-stone-500">14 upcycled bowls/day @ ₹140 avg ticket price</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-bold block">Net Recaptured Profit</span>
              <div className="text-xl font-heading font-black text-stone-900">+₹78,300 / mo</div>
              <p className="text-[10px] text-emerald-700 font-bold">15.6x ROI on Starter Subscription</p>
            </div>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-mono font-bold uppercase text-stone-400">SaaS Monetization Architecture</span>
            <h3 className="text-xl font-heading font-black text-stone-900">Commercial Licensing Plans</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((tier) => (
              <div 
                key={tier.name}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                  tier.popular 
                    ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md' 
                    : 'bg-[#FAF7F2] border-[#E8DFD1]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-stone-900">{tier.name}</span>
                    {tier.badge && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-2xl font-heading font-black text-stone-900">{tier.price}</span>
                    <span className="text-[10px] font-mono text-stone-500 ml-1">{tier.usdPrice}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">{tier.target}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-200/60">
                    {tier.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2 text-[11px] text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playTap();
                    onClose();
                  }}
                  className={`w-full py-2.5 rounded-xl font-heading font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5 ${
                    tier.popular
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border border-[#E8DFD1]'
                  }`}
                >
                  <span>Explore Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Community & Grassroots Commitment */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <strong className="text-emerald-950 font-bold block">100% Free Grassroots & Offline Kiosk</strong>
              <p className="text-emerald-800 text-[11px]">
                We provide the complete offline-first Progressive Web App (PWA) free for street food vendors, low-income community messes, and grassroots shelters.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 shadow-xs"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
