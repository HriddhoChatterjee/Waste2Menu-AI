import React from 'react';
import { X, Award, Download, Printer, Leaf, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

interface EsgReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: {
    recoveredRevenue: number;
    scrapDivertedKg: number;
    donatedMeals: number;
    co2AvoidedKg: number;
    waterSavedLiters: number;
  };
}

export const EsgReportModal: React.FC<EsgReportModalProps> = ({ isOpen, onClose, metrics }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-obsidian-dark border border-charcoal-light rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-textMuted hover:text-white hover:bg-charcoal transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="border-2 border-emerald-500/40 p-8 rounded-2xl bg-gradient-to-b from-[#151F2E] via-charcoal to-obsidian relative shadow-glow-emerald/20 text-center space-y-6">
          
          {/* Certificate Header */}
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center shadow-glow-emerald">
              <Award className="w-9 h-9" />
            </div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Official Environmental, Social & Governance (ESG) Audit
            </div>
            <h2 className="font-heading font-black text-2xl text-white tracking-tight">
              Verified Kitchen Circularity Certificate
            </h2>
            <p className="text-xs text-textMuted font-mono">
              Issued to: <strong className="text-white">Brigade Gateway Kitchen #4</strong> • Audit ID: <span className="text-emerald-400">#ESG-WM-2026-981</span>
            </p>
          </div>

          {/* Key Metrics Verified Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-xl bg-obsidian/80 border border-charcoal-light font-mono">
              <span className="text-[10px] text-textMuted uppercase block">Recovered Revenue</span>
              <span className="text-lg font-heading font-black text-emerald-400">₹{metrics.recoveredRevenue.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian/80 border border-charcoal-light font-mono">
              <span className="text-[10px] text-textMuted uppercase block">Scrap Diverted</span>
              <span className="text-lg font-heading font-black text-white">{metrics.scrapDivertedKg.toFixed(1)} kg</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian/80 border border-charcoal-light font-mono">
              <span className="text-[10px] text-textMuted uppercase block">Meals Donated</span>
              <span className="text-lg font-heading font-black text-violet-400">{metrics.donatedMeals} portions</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian/80 border border-charcoal-light font-mono">
              <span className="text-[10px] text-textMuted uppercase block">CO₂e Avoided</span>
              <span className="text-lg font-heading font-black text-emerald-300">{metrics.co2AvoidedKg.toFixed(1)} kg</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian/80 border border-charcoal-light font-mono">
              <span className="text-[10px] text-textMuted uppercase block">Water Preserved</span>
              <span className="text-lg font-heading font-black text-blue-400">{metrics.waterSavedLiters.toLocaleString()} L</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian/80 border border-charcoal-light font-mono">
              <span className="text-[10px] text-textMuted uppercase block">Landfill Diversion</span>
              <span className="text-lg font-heading font-black text-emerald-400">91.4%</span>
            </div>
          </div>

          {/* Compliance Statement */}
          <div className="p-4 rounded-xl bg-charcoal/80 border border-charcoal-light text-left text-xs text-textMuted leading-relaxed space-y-1">
            <div className="flex items-center space-x-1.5 text-white font-bold font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Standard Compliance: ISO 14001 & UN SDG 12.3 (50% Food Waste Reduction)</span>
            </div>
            <p className="text-[11px]">
              This commercial kitchen has integrated real-time prep byproduct tracking and algorithmic reverse-recipe generation to recover commercial value from food waste while ensuring surplus redistribution to verified non-profit organizations.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-charcoal-light text-xs font-mono text-textMuted">
            <div className="text-left">
              <div className="font-heading font-bold text-white">Chef Executive Director</div>
              <div className="text-[11px] text-emerald-400">Waste2Menu Culinary Systems</div>
            </div>
            <div className="text-right">
              <div className="font-heading font-bold text-white">Chief Sustainability Auditor</div>
              <div className="text-[11px] text-emerald-400">Global ESG Verification Board</div>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light font-bold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Official Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian font-bold text-xs shadow-glow-emerald transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
