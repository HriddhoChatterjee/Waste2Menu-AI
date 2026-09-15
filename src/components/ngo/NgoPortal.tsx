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
import { ScrollReveal } from '../common/ScrollReveal';

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
      <ScrollReveal direction="up" distance={20}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DFD1] shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-100 text-violet-800 border border-violet-200">
                Station Screen 4
              </span>
              <span className="text-stone-500 text-xs font-mono">• Automated NGO Redistribution</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-stone-900">
              Automated NGO Surplus Food Redistribution Portal
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl">
              Shift-end automated fallback broadcast for unsold daily specials, atomic batch claiming, and secure 6-digit OTP cashier handover verification.
            </p>
          </div>

          {/* Rescued Meals Stat */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-[#FAF7F2] border border-[#E8DFD1] p-3.5 rounded-xl text-right">
              <div className="text-[11px] font-mono text-stone-500 uppercase font-semibold">Rescued Meals</div>
              <div className="text-xl font-heading font-black text-emerald-700">
                {totalRescuedMeals} <span className="text-xs font-normal text-stone-500">portions</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Navigation Tabs & Shift-End Trigger */}
      <ScrollReveal direction="up" distance={20} delay={0.06}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFDF9] p-3 rounded-2xl border border-[#E8DFD1] shadow-xs">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'feed'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1]'
              }`}
            >
              <Radio className="w-4 h-4 text-violet-200" />
              <span>Surplus Food Alert Feed ({ngoBatches.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'verify'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8DFD1]'
              }`}
            >
              <KeyRound className="w-4 h-4 text-emerald-200" />
              <span>Cashier OTP Verification {claimedBatches.length > 0 && `(${claimedBatches.length} Pending)`}</span>
            </button>
          </div>

          {/* Trigger Shift End Surplus Release */}
          {availableUnsoldSpecials.length > 0 && (
            <button
              onClick={() => broadcastUnsoldSpecialsToNgo()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all transform active:scale-95"
            >
              <Truck className="w-4 h-4 text-white" />
              <span>Broadcast {availableUnsoldSpecials.length} Unsold Specials to NGO</span>
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Main Tab Content */}
      {activeTab === 'feed' ? (
        <div className="space-y-4">
          
          {/* Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ngoBatches.map((batch, idx) => {
              const isClaimed = batch.status === 'claimed';
              const isHandedOver = batch.status === 'verified_handed_over';

              return (
                <ScrollReveal key={batch.id} delay={idx * 0.05} direction="up" distance={20}>
                  <div
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-xs h-full ${
                      isHandedOver
                        ? 'bg-stone-50 border-[#E8DFD1] opacity-75'
                        : isClaimed
                        ? 'bg-violet-50/40 border-violet-300'
                        : 'bg-[#FFFDF9] border-[#E8DFD1] hover:border-violet-300'
                    }`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          isHandedOver
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isClaimed
                            ? 'bg-violet-100 text-violet-800 border border-violet-200 animate-pulse'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {isHandedOver ? '✓ Handed Over & Logged' : isClaimed ? '⏳ OTP Handover Pending' : '🚨 Open for Pickup'}
                        </span>

                        <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" /> {batch.restaurantDistanceKm} km
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-lg text-stone-900 mt-1">
                        {batch.dishName}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Batch ID: <span className="font-mono text-stone-700">{batch.id}</span>
                      </p>
                    </div>

                    {/* Metrics Box */}
                    <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFD1] text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-semibold block">Meals Rescued</span>
                        <span className="text-base font-heading font-black text-emerald-700">
                          {batch.portionsAvailable} <span className="text-xs font-normal text-stone-500">portions</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-semibold block">Safe Window</span>
                        <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> {batch.safeConsumptionHours}h
                        </span>
                      </div>
                    </div>

                    {/* Temp Control & Location */}
                    <div className="space-y-1 text-xs text-stone-600 font-mono">
                      <div className="flex items-center justify-between">
                        <span>Temp Hold:</span>
                        <span className="text-stone-900 font-semibold">{batch.tempControlStatus}</span>
                      </div>
                      {batch.ngoName && (
                        <div className="flex items-center justify-between text-violet-800">
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
                          className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <HeartHandshake className="w-4 h-4 text-violet-100" />
                          <span>Claim Surplus Batch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : isClaimed ? (
                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-violet-800 border border-violet-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
                        >
                          <KeyRound className="w-4 h-4 text-violet-600" />
                          <span>View Handover OTP ({batch.pickupOtp})</span>
                        </button>
                      ) : (
                        <div className="w-full py-2 text-center text-xs font-mono text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center space-x-1.5 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Rescued & Verified</span>
                        </div>
                      )}
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      ) : (
        /* Cashier OTP Keypad Tab */
        <ScrollReveal direction="up" distance={20}>
          <div className="py-6">
            <CashierOtpKeypad />
          </div>
        </ScrollReveal>
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
