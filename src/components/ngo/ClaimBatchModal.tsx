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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex justify-center items-start p-4 pt-24 sm:pt-28 pb-12">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 shadow-xs">
            <HeartHandshake className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-violet-700">
              Automated Redistribution Protocol
            </span>
            <h3 className="font-heading font-black text-xl text-stone-900">
              {hasClaimed ? 'Surplus Dispatch Sheet Generated' : 'Claim Surplus Meal Batch'}
            </h3>
          </div>
        </div>

        {/* Batch Overview Card */}
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-heading font-bold text-base text-stone-900">{batch.dishName}</h4>
              <span className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 font-mono">
                <MapPin className="w-3 h-3 text-rose-500" /> {batch.restaurantDistanceKm} km from Hub
              </span>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono font-bold text-sm">
              {batch.portionsAvailable} Meals Available
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-3 rounded-lg border border-[#E8DFD1]">
            <div>
              <span className="text-stone-500 block text-[10px]">Safe Temperature Control</span>
              <span className="text-stone-900 font-bold">{batch.tempControlStatus}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">Consumption Safe Window</span>
              <span className="text-emerald-700 font-bold">Within next {batch.safeConsumptionHours} hours</span>
            </div>
          </div>
        </div>

        {/* Claim State vs Pickup Pass State */}
        {!hasClaimed && batch.status === 'broadcast' ? (
          <div className="space-y-4">
            
            {/* NGO Partner Select */}
            <div>
              <label className="block text-[11px] font-mono text-stone-600 uppercase font-semibold mb-1">
                Select Registered NGO Partner
              </label>
              <select
                value={selectedNgo}
                onChange={(e) => setSelectedNgo(e.target.value)}
                className="w-full bg-white text-stone-900 text-xs font-semibold rounded-xl border border-[#E8DFD1] p-3 focus:outline-none focus:border-violet-500 shadow-xs"
              >
                <option value="Robin Hood Army - Central Chapter">Robin Hood Army (Volunteer Hub #3)</option>
                <option value="Feeding India by Zomato">Feeding India (Rescue Van #12)</option>
                <option value="Annakshetra Foundation">Annakshetra Foundation (Night Shelter Route)</option>
                <option value="Bangalore Roti Bank">Bangalore Roti Bank (Brigade Route)</option>
              </select>
            </div>

            {/* Food Safety Compliance Checklist */}
            <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 text-xs space-y-1 text-violet-900">
              <div className="font-bold text-violet-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> FSSAI Surplus Redistribution Protocol
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Food is sealed in food-grade thermal containers. An authorized 6-digit OTP will be generated for the driver to present at kitchen handover.
              </p>
            </div>

            {/* Claim CTA */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 border border-[#E8DFD1] text-xs font-bold transition-all shadow-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClaim}
                className="flex-2 flex-grow py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Confirm & Claim {batch.portionsAvailable} Meals</span>
              </button>
            </div>

          </div>
        ) : (
          /* Handover OTP Screen */
          <div className="space-y-4 text-center">
            
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-violet-300 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-violet-800 font-bold block">
                Official Kitchen Handover OTP
              </span>

              {/* Large 6-Digit OTP */}
              <div className="flex items-center justify-center space-x-2 my-2">
                {batch.pickupOtp.split('').map((digit, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-14 rounded-xl bg-white border border-violet-300 shadow-xs flex items-center justify-center font-heading font-black text-2xl text-emerald-700 tracking-wider"
                  >
                    {digit}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-2 pt-1">
                <button
                  onClick={handleCopyOtp}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-xs font-mono font-bold text-stone-700 border border-[#E8DFD1] flex items-center space-x-1.5 transition-all shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied OTP' : 'Copy 6-Digit Code'}</span>
                </button>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="text-left bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8DFD1] space-y-1.5 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-stone-900 font-bold">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{batch.address}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-stone-500">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kitchen Contact: {batch.pickupContact}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Done / Return to Portal
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
