import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { NgoBatch } from '../../types';
import { ClaimBatchModal } from './ClaimBatchModal';
import { CashierOtpKeypad } from './CashierOtpKeypad';
import { 
  HeartHandshake, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  KeyRound, 
  AlertTriangle,
  ArrowRight,
  Truck
} from 'lucide-react';

export const NgoPortal: React.FC = () => {
  const { ngoBatches, broadcastUnsoldSpecialsToNgo, activeSpecials } = useAppStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'verify'>('feed');
  const [selectedBatch, setSelectedBatch] = useState<NgoBatch | null>(null);

  const availableUnsoldSpecials = activeSpecials.filter((s) => !s.isSoldOut && s.remainingPortions > 0 && !s.isSurplusSentToNgo);
  const totalRescuedMeals = ngoBatches
    .filter((b) => b.status === 'verified_handed_over')
    .reduce((acc, b) => acc + b.portionsAvailable, 0);

  const pendingBroadcasts = ngoBatches.filter((b) => b.status === 'broadcast');
  const claimedBatches = ngoBatches.filter((b) => b.status === 'claimed');

  return (
    <div className="space-y-6">
      
      {/* Screen Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-charcoal via-charcoal-dark to-obsidian p-6 rounded-2xl border border-charcoal-light shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
              Station Screen 4
            </span>
            <span className="text-textMuted text-xs font-mono">• Automated NGO Redistribution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Automated NGO Surplus Food Redistribution Portal
          </h1>
          <p className="text-sm text-textMuted max-w-2xl">
            Shift-end automated fallback broadcast for unsold daily specials, atomic batch claiming, and secure 6-digit OTP cashier handover verification.
          </p>
        </div>

        {/* Rescued Meals Stat */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-obsidian/80 border border-charcoal-light p-3.5 rounded-xl text-right">
            <div className="text-[11px] font-mono text-textMuted uppercase">Rescued Meals</div>
            <div className="text-xl font-heading font-black text-emerald-400">
              {totalRescuedMeals} <span className="text-xs font-normal text-textMuted">portions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Shift-End Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-3 rounded-2xl border border-charcoal-light">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-glow-violet'
                : 'bg-charcoal text-textMuted hover:text-white border border-charcoal-light'
            }`}
          >
            <Radio className="w-4 h-4 text-violet-300" />
            <span>Surplus Food Alert Feed ({ngoBatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'verify'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-obsidian shadow-glow-emerald'
                : 'bg-charcoal text-textMuted hover:text-white border border-charcoal-light'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Cashier OTP Verification {claimedBatches.length > 0 && `(${claimedBatches.length} Pending)`}</span>
          </button>
        </div>

        {/* Trigger Shift End Surplus Release */}
        {availableUnsoldSpecials.length > 0 && (
          <button
            onClick={() => broadcastUnsoldSpecialsToNgo()}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber hover:bg-amber-light text-obsidian font-bold text-xs shadow-glow-amber transition-all transform active:scale-95"
          >
            <Truck className="w-4 h-4 text-obsidian" />
            <span>Broadcast {availableUnsoldSpecials.length} Unsold Specials to NGO</span>
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'feed' ? (
        <div className="space-y-4">
          
          {/* Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ngoBatches.map((batch) => {
              const isClaimed = batch.status === 'claimed';
              const isHandedOver = batch.status === 'verified_handed_over';

              return (
                <div
                  key={batch.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isHandedOver
                      ? 'bg-charcoal/40 border-charcoal-light/40 opacity-75'
                      : isClaimed
                      ? 'bg-charcoal border-violet-500/40 shadow-glow-violet/20'
                      : 'glass-panel border-charcoal-light hover:border-violet-400/60'
                  }`}
                >
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        isHandedOver
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isClaimed
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 animate-pulse'
                          : 'bg-amber/20 text-amber border border-amber/40'
                      }`}>
                        {isHandedOver ? '✓ Handed Over & Logged' : isClaimed ? '⏳ OTP Handover Pending' : '🚨 Open for Pickup'}
                      </span>

                      <span className="text-[11px] font-mono text-textMuted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-coral" /> {batch.restaurantDistanceKm} km
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-lg text-white mt-1">
                      {batch.dishName}
                    </h3>
                    <p className="text-xs text-textMuted mt-0.5">
                      Batch ID: <span className="font-mono text-textPrimary">{batch.id}</span>
                    </p>
                  </div>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 gap-2 bg-obsidian-dark/90 p-3 rounded-xl border border-charcoal-light text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-textMuted uppercase block">Meals Rescued</span>
                      <span className="text-base font-heading font-black text-emerald-400">
                        {batch.portionsAvailable} <span className="text-xs font-normal text-textMuted">portions</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-textMuted uppercase block">Safe Window</span>
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber" /> {batch.safeConsumptionHours}h
                      </span>
                    </div>
                  </div>

                  {/* Temp Control & Location */}
                  <div className="space-y-1 text-xs text-textMuted font-mono">
                    <div className="flex items-center justify-between">
                      <span>Temp Hold:</span>
                      <span className="text-white font-semibold">{batch.tempControlStatus}</span>
                    </div>
                    {batch.ngoName && (
                      <div className="flex items-center justify-between text-violet-300">
                        <span>Claimed by:</span>
                        <span className="font-bold truncate">{batch.ngoName}</span>
                      </div>
                    )}
                  </div>

                  {/* Action CTA */}
                  <div>
                    {batch.status === 'broadcast' ? (
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-bold text-xs shadow-glow-violet transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                      >
                        <HeartHandshake className="w-4 h-4 text-violet-200" />
                        <span>Claim Surplus Batch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : isClaimed ? (
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="w-full py-2.5 px-4 rounded-xl bg-charcoal hover:bg-charcoal-lighter text-violet-300 border border-violet-500/40 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                      >
                        <KeyRound className="w-4 h-4 text-violet-400" />
                        <span>View Handover OTP ({batch.pickupOtp})</span>
                      </button>
                    ) : (
                      <div className="w-full py-2 text-center text-xs font-mono text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Rescued & Verified</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Cashier OTP Keypad Tab */
        <div className="py-6">
          <CashierOtpKeypad />
        </div>
      )}

      {/* Claim Batch Modal */}
      <ClaimBatchModal
        isOpen={!!selectedBatch}
        batch={selectedBatch}
        onClose={() => setSelectedBatch(null)}
      />

    </div>
  );
};
