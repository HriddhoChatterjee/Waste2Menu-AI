import React, { useState } from 'react';
import { NgoBatch } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  HeartHandshake, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  QrCode, 
  Phone,
  ThermometerSnowflake,
  Flame,
  Sparkles
} from 'lucide-react';

interface ClaimBatchModalProps {
  isOpen: boolean;
  batch: NgoBatch | null;
  onClose: () => void;
}

export const ClaimBatchModal: React.FC<ClaimBatchModalProps> = ({ isOpen, batch, onClose }) => {
  const { claimNgoBatch } = useAppStore();
  const [selectedNgo, setSelectedNgo] = useState('Robin Hood Army - Central Chapter');
  const [hasClaimed, setHasClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !batch) return null;

  const handleClaim = () => {
    claimNgoBatch(batch.id, selectedNgo);
    setHasClaimed(true);
  };

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(batch.pickupOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-obsidian-dark border border-charcoal-light rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-textMuted hover:text-white hover:bg-charcoal transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-emerald-500/20 border border-violet-500/40 text-violet-400">
            <HeartHandshake className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-violet-400">
              Automated Redistribution Protocol
            </span>
            <h3 className="font-heading font-black text-xl text-white">
              {hasClaimed ? 'Surplus Dispatch Sheet Generated' : 'Claim Surplus Meal Batch'}
            </h3>
          </div>
        </div>

        {/* Batch Overview Card */}
        <div className="p-4 rounded-xl bg-charcoal border border-charcoal-light space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-heading font-bold text-base text-white">{batch.dishName}</h4>
              <span className="text-xs text-textMuted flex items-center gap-1 mt-0.5 font-mono">
                <MapPin className="w-3 h-3 text-emerald-400" /> {batch.restaurantDistanceKm} km from Hub
              </span>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-sm">
              {batch.portionsAvailable} Meals Available
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-obsidian p-3 rounded-lg border border-charcoal-light/60">
            <div>
              <span className="text-textMuted block text-[10px]">Safe Temperature Control</span>
              <span className="text-white font-bold">{batch.tempControlStatus}</span>
            </div>
            <div>
              <span className="text-textMuted block text-[10px]">Consumption Safe Window</span>
              <span className="text-emerald-400 font-bold">Within next {batch.safeConsumptionHours} hours</span>
            </div>
          </div>
        </div>

        {/* Claim State vs Pickup Pass State */}
        {!hasClaimed && batch.status === 'broadcast' ? (
          <div className="space-y-4">
            
            {/* NGO Partner Select */}
            <div>
              <label className="block text-[11px] font-mono text-textMuted uppercase mb-1">
                Select Registered NGO Partner
              </label>
              <select
                value={selectedNgo}
                onChange={(e) => setSelectedNgo(e.target.value)}
                className="w-full bg-charcoal text-white text-xs font-semibold rounded-xl border border-charcoal-light p-3 focus:outline-none focus:border-violet-500"
              >
                <option value="Robin Hood Army - Central Chapter">Robin Hood Army (Volunteer Hub #3)</option>
                <option value="Feeding India by Zomato">Feeding India (Rescue Van #12)</option>
                <option value="Annakshetra Foundation">Annakshetra Foundation (Night Shelter Route)</option>
                <option value="Bangalore Roti Bank">Bangalore Roti Bank (Brigade Route)</option>
              </select>
            </div>

            {/* Food Safety Compliance Checklist */}
            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-xs space-y-1 text-violet-200">
              <div className="font-bold text-violet-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> FSSAI Surplus Redistribution Protocol
              </div>
              <p className="text-[11px] text-textMuted leading-relaxed">
                Food is sealed in food-grade thermal containers. An authorized 6-digit OTP will be generated for the driver to present at kitchen handover.
              </p>
            </div>

            {/* Claim CTA */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-charcoal hover:bg-charcoal-lighter text-textMuted hover:text-white border border-charcoal-light text-xs font-bold transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClaim}
                className="flex-2 flex-grow py-3 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-bold text-xs shadow-glow-violet transition-all transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Confirm & Claim {batch.portionsAvailable} Meals</span>
              </button>
            </div>

          </div>
        ) : (
          /* Handover OTP Screen */
          <div className="space-y-4 text-center">
            
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1C2636] to-obsidian border-2 border-dashed border-violet-500/50 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-violet-300 font-bold block">
                Official Kitchen Handover OTP
              </span>

              {/* Large 6-Digit OTP */}
              <div className="flex items-center justify-center space-x-2 my-2">
                {batch.pickupOtp.split('').map((digit, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-14 rounded-xl bg-obsidian border border-violet-500/60 shadow-glow-violet/40 flex items-center justify-center font-heading font-black text-2xl text-emerald-400 tracking-wider"
                  >
                    {digit}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-2 pt-1">
                <button
                  onClick={handleCopyOtp}
                  className="px-3 py-1.5 rounded-lg bg-charcoal hover:bg-charcoal-lighter text-xs font-mono font-bold text-textMuted hover:text-white border border-charcoal-light flex items-center space-x-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied OTP' : 'Copy 6-Digit Code'}</span>
                </button>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="text-left bg-charcoal p-3.5 rounded-xl border border-charcoal-light space-y-1.5 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-white font-bold">
                <MapPin className="w-3.5 h-3.5 text-coral" />
                <span>{batch.address}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-textMuted">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kitchen Contact: {batch.pickupContact}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian font-bold text-xs shadow-glow-emerald transition-all"
            >
              Done / Return to Portal
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
