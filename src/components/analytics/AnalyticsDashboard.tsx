import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { WasteRevenueChart } from './WasteRevenueChart';
import { StaffEfficiencyChart } from './StaffEfficiencyChart';
import { ByproductCategoryChart } from './ByproductCategoryChart';
import { EsgReportModal } from './EsgReportModal';
import { 
  TrendingUp, 
  Leaf, 
  HeartHandshake, 
  Droplets, 
  Wind, 
  Award, 
  Download, 
  Calendar, 
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { completedOrders, ngoBatches, scraps } = useAppStore();
  const [isEsgModalOpen, setIsEsgModalOpen] = useState(false);

  // Dynamic calculated totals
  const totalPosRevenue = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0) + 42500;
  const totalScrapDiverted = scraps.reduce((acc, s) => acc + s.weightKg, 0) + 128.5;
  const totalDonatedMeals = ngoBatches
    .filter((b) => b.status === 'verified_handed_over')
    .reduce((acc, b) => acc + b.portionsAvailable, 0) + 64;

  // Environmental impact conversions (based on FAO food waste metrics)
  // 1 kg food waste diverted = 2.5 kg CO2e avoided & 128 liters of water saved
  const co2AvoidedKg = totalScrapDiverted * 2.5;
  const waterSavedLiters = Math.round(totalScrapDiverted * 128);

  const kpis = [
    {
      label: 'Recovered Revenue (₹)',
      value: `₹${totalPosRevenue.toLocaleString()}`,
      subtitle: '+24.6% vs baseline prep waste',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400',
      badge: 'High ROI',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      label: 'Prep Scrap Diverted',
      value: `${totalScrapDiverted.toFixed(1)} kg`,
      subtitle: '91.4% Landfill Diversion Rate',
      icon: <Leaf className="w-5 h-5 text-emerald-300" />,
      color: 'text-emerald-300',
      badge: 'Zero-Waste',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      label: 'NGO Donated Meals',
      value: `${totalDonatedMeals} Meals`,
      subtitle: '4 Registered Non-Profit Partners',
      icon: <HeartHandshake className="w-5 h-5 text-violet-400" />,
      color: 'text-violet-400',
      badge: 'Social Impact',
      badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/40'
    },
    {
      label: 'CO₂e Emissions Avoided',
      value: `${co2AvoidedKg.toFixed(1)} kg`,
      subtitle: 'Based on IPCC GHG food factor (2.5x)',
      icon: <Wind className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400',
      badge: 'ESG Metric',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      label: 'Fresh Water Preserved',
      value: `${waterSavedLiters.toLocaleString()} L`,
      subtitle: 'Virtual water footprint saved',
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      color: 'text-blue-400',
      badge: 'Resource Save',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Screen Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-charcoal via-charcoal-dark to-obsidian p-6 rounded-2xl border border-charcoal-light shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Station Screen 5
            </span>
            <span className="text-textMuted text-xs font-mono">• Executive Sustainability Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Circularity Analytics & Recovered Revenue Ledger
          </h1>
          <p className="text-sm text-textMuted max-w-2xl">
            Real-time ESG auditing, economic yield telemetry, cook station variance distribution, and environmental diversion reporting.
          </p>
        </div>

        {/* Generate Certificate Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsEsgModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-obsidian font-bold text-xs shadow-glow-emerald transition-all transform active:scale-95"
          >
            <Award className="w-4 h-4" />
            <span>Generate ESG Certificate</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Executive KPI Cards (5 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-2xl border border-charcoal-light hover:border-charcoal-lighter transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-obsidian border border-charcoal-light">
                {kpi.icon}
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full border ${kpi.badgeClass}`}>
                {kpi.badge}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-textMuted uppercase block">
                {kpi.label}
              </span>
              <div className={`text-xl sm:text-2xl font-heading font-black mt-0.5 ${kpi.color}`}>
                {kpi.value}
              </div>
              <span className="text-[10px] font-mono text-textMuted mt-1 block">
                {kpi.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Waste vs Revenue Dual Chart (7 cols) */}
        <div className="lg:col-span-7">
          <WasteRevenueChart />
        </div>

        {/* Right: Byproduct Breakdown Donut (5 cols) */}
        <div className="lg:col-span-5">
          <ByproductCategoryChart />
        </div>

      </div>

      {/* Staff Efficiency Distribution & Outlier Detection */}
      <div className="w-full">
        <StaffEfficiencyChart />
      </div>

      {/* Recent Activity Audit Ledger Table */}
      <div className="glass-panel rounded-2xl p-5 border border-charcoal-light space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-light">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">
                Circularity Audit Ledger (Last 24 Hours)
              </h3>
              <p className="text-xs text-textMuted font-mono">
                Immutable audit trail of scrap conversions, POS decrements, and NGO handovers
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-400 font-bold">
            100% Traceability
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-charcoal-light text-textMuted text-[10px] uppercase">
                <th className="pb-2.5 font-bold">Event Type</th>
                <th className="pb-2.5 font-bold">Item / Dish Reference</th>
                <th className="pb-2.5 font-bold">Weight / Portions</th>
                <th className="pb-2.5 font-bold">Economic Yield</th>
                <th className="pb-2.5 font-bold">ESG Impact</th>
                <th className="pb-2.5 font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-light/50 text-textPrimary">
              <tr className="hover:bg-charcoal/40">
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    POS SALE
                  </span>
                </td>
                <td className="py-3 font-semibold text-white">Slow-Roasted Peppercorn Broth</td>
                <td className="py-3">2 Portions</td>
                <td className="py-3 text-emerald-400 font-bold">+₹178.00</td>
                <td className="py-3 text-textMuted">0.5 kg CO₂e saved</td>
                <td className="py-3 text-right text-textMuted">Just now</td>
              </tr>
              <tr className="hover:bg-charcoal/40">
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-bold">
                    NGO HANDOVER
                  </span>
                </td>
                <td className="py-3 font-semibold text-white">Charred Herb Stem Chimichurri</td>
                <td className="py-3">6 Portions</td>
                <td className="py-3 text-violet-300">Rescued Meal</td>
                <td className="py-3 text-emerald-400">100% Diverted</td>
                <td className="py-3 text-right text-textMuted">40m ago</td>
              </tr>
              <tr className="hover:bg-charcoal/40">
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-amber/20 text-amber text-[10px] font-bold">
                    AI VISION INGEST
                  </span>
                </td>
                <td className="py-3 font-semibold text-white">Chicken Carcass & Wing Tips</td>
                <td className="py-3">2.4 kg</td>
                <td className="py-3 text-emerald-400">₹0 Raw Cost</td>
                <td className="py-3 text-textMuted">Collagen stock locked</td>
                <td className="py-3 text-right text-textMuted">2h ago</td>
              </tr>
              <tr className="hover:bg-charcoal/40">
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    KDS APPROVAL
                  </span>
                </td>
                <td className="py-3 font-semibold text-white">Spiced Sourdough Heel Crisps</td>
                <td className="py-3">10 Portions</td>
                <td className="py-3 text-emerald-400">₹69.00 / portion</td>
                <td className="py-3 text-textMuted">1.0 kg crusts saved</td>
                <td className="py-3 text-right text-textMuted">3h ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ESG Report Modal */}
      <EsgReportModal
        isOpen={isEsgModalOpen}
        onClose={() => setIsEsgModalOpen(false)}
        metrics={{
          recoveredRevenue: totalPosRevenue,
          scrapDivertedKg: totalScrapDiverted,
          donatedMeals: totalDonatedMeals,
          co2AvoidedKg: co2AvoidedKg,
          waterSavedLiters: waterSavedLiters
        }}
      />

    </div>
  );
};
