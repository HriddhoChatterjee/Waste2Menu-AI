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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex justify-center items-start p-4 pt-24 sm:pt-28 pb-12">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="border-2 border-emerald-600/30 p-8 rounded-2xl bg-gradient-to-b from-emerald-50/40 via-white to-[#FAF7F2] relative shadow-sm text-center space-y-6">
          
          {/* Certificate Header */}
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <Award className="w-9 h-9" />
            </div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-emerald-800 uppercase">
              Official Environmental, Social & Governance (ESG) Audit
            </div>
            <h2 className="font-heading font-black text-2xl text-stone-900 tracking-tight">
              Verified Kitchen Circularity Certificate
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Issued to: <strong className="text-stone-900">Brigade Gateway Kitchen #4</strong> • Audit ID: <span className="text-emerald-700 font-semibold">#ESG-WM-2026-981</span>
            </p>
          </div>

          {/* Key Metrics Verified Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-xl bg-white border border-[#E8DFD1] font-mono shadow-xs">
              <span className="text-[10px] text-stone-500 uppercase block">Recovered Revenue</span>
              <span className="text-lg font-heading font-black text-emerald-700">₹{metrics.recoveredRevenue.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8DFD1] font-mono shadow-xs">
              <span className="text-[10px] text-stone-500 uppercase block">Scrap Diverted</span>
              <span className="text-lg font-heading font-black text-stone-900">{metrics.scrapDivertedKg.toFixed(1)} kg</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8DFD1] font-mono shadow-xs">
              <span className="text-[10px] text-stone-500 uppercase block">Meals Donated</span>
              <span className="text-lg font-heading font-black text-violet-700">{metrics.donatedMeals} portions</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8DFD1] font-mono shadow-xs">
              <span className="text-[10px] text-stone-500 uppercase block">CO₂e Avoided</span>
              <span className="text-lg font-heading font-black text-emerald-700">{metrics.co2AvoidedKg.toFixed(1)} kg</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8DFD1] font-mono shadow-xs">
              <span className="text-[10px] text-stone-500 uppercase block">Water Preserved</span>
              <span className="text-lg font-heading font-black text-sky-700">{metrics.waterSavedLiters.toLocaleString()} L</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8DFD1] font-mono shadow-xs">
              <span className="text-[10px] text-stone-500 uppercase block">Landfill Diversion</span>
              <span className="text-lg font-heading font-black text-emerald-700">91.4%</span>
            </div>
          </div>

          {/* Compliance Statement */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-left text-xs text-stone-600 leading-relaxed space-y-1">
            <div className="flex items-center space-x-1.5 text-stone-900 font-bold font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Standard Compliance: ISO 14001 & UN SDG 12.3 (50% Food Waste Reduction)</span>
            </div>
            <p className="text-[11px] text-stone-500">
              This commercial kitchen has integrated real-time prep byproduct tracking and algorithmic reverse-recipe generation to recover commercial value from food waste while ensuring surplus redistribution to verified non-profit organizations.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E8DFD1] text-xs font-mono text-stone-500">
            <div className="text-left">
              <div className="font-heading font-bold text-stone-900">Chef Executive Director</div>
              <div className="text-[11px] text-emerald-700">Waste2Menu Culinary Systems</div>
            </div>
            <div className="text-right">
              <div className="font-heading font-bold text-stone-900">Chief Sustainability Auditor</div>
              <div className="text-[11px] text-emerald-700">Global ESG Verification Board</div>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-[#E8DFD1] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>Print Official Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
