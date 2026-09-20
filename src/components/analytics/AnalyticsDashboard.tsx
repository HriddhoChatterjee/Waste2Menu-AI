import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { WasteRevenueChart } from './WasteRevenueChart';
import { StaffEfficiencyChart } from './StaffEfficiencyChart';
import { ByproductCategoryChart } from './ByproductCategoryChart';
import { EsgReportModal } from './EsgReportModal';
import { ScrollReveal } from '../common/ScrollReveal';
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
      label: 'Nutritious Meals Created',
      value: `${Math.round(totalScrapDiverted * 4.2 + totalDonatedMeals)} Meals`,
      subtitle: 'Zero-waste community servings',
      icon: <Award className="w-5 h-5 text-emerald-700" />,
      color: 'text-emerald-700',
      badge: 'Food Security',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      label: 'Prep Scrap Diverted',
      value: `${totalScrapDiverted.toFixed(1)} kg`,
      subtitle: '91.4% Landfill Diversion Rate',
      icon: <Leaf className="w-5 h-5 text-emerald-600" />,
      color: 'text-emerald-700',
      badge: 'Zero-Waste',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      label: 'NGO Donated Meals',
      value: `${totalDonatedMeals} Meals`,
      subtitle: '4 Registered Non-Profit Partners',
      icon: <HeartHandshake className="w-5 h-5 text-violet-700" />,
      color: 'text-violet-700',
      badge: 'Social Impact',
      badgeClass: 'bg-violet-100 text-violet-800 border-violet-200'
    },
    {
      label: 'CO₂e Emissions Avoided',
      value: `${co2AvoidedKg.toFixed(1)} kg`,
      subtitle: 'Based on IPCC GHG food factor (2.5x)',
      icon: <Wind className="w-5 h-5 text-emerald-600" />,
      color: 'text-emerald-700',
      badge: 'ESG Metric',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      label: 'Fresh Water Preserved',
      value: `${waterSavedLiters.toLocaleString()} L`,
      subtitle: 'Virtual water footprint saved',
      icon: <Droplets className="w-5 h-5 text-sky-600" />,
      color: 'text-sky-700',
      badge: 'Resource Save',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Screen Top Header */}
      <ScrollReveal direction="up" distance={20}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DFD1] shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Station Screen 5
              </span>
              <span className="text-stone-500 text-xs font-mono">• Executive Sustainability Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-stone-900">
              Circularity Analytics & Recovered Revenue Ledger
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl">
              Real-time ESG auditing, economic yield telemetry, cook station variance distribution, and environmental diversion reporting.
            </p>
          </div>

          {/* Generate Certificate Button */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsEsgModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all transform active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Generate ESG Certificate</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Executive KPI Cards (5 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.05} direction="up" distance={18} className="h-full">
            <div
              className="h-full bg-[#FFFDF9] p-5 rounded-2xl border border-[#E8DFD1] hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1]">
                  {kpi.icon}
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full border ${kpi.badgeClass}`}>
                  {kpi.badge}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-stone-500 uppercase font-semibold block">
                  {kpi.label}
                </span>
                <div className={`text-xl sm:text-2xl font-heading font-black mt-0.5 ${kpi.color}`}>
                  {kpi.value}
                </div>
                <span className="text-[10px] font-mono text-stone-400 mt-1 block">
                  {kpi.subtitle}
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Primary Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Waste vs Revenue Dual Chart (7 cols) */}
        <div className="lg:col-span-7">
          <ScrollReveal delay={0.06} direction="up" distance={25}>
            <WasteRevenueChart />
          </ScrollReveal>
        </div>

        {/* Right: Byproduct Breakdown Donut (5 cols) */}
        <div className="lg:col-span-5">
          <ScrollReveal delay={0.12} direction="up" distance={25}>
            <ByproductCategoryChart />
          </ScrollReveal>
        </div>

      </div>

      {/* Staff Efficiency Distribution & Outlier Detection */}
      <div className="w-full">
        <ScrollReveal delay={0.16} direction="up" distance={25}>
          <StaffEfficiencyChart />
        </ScrollReveal>
      </div>

      {/* Recent Activity Audit Ledger Table */}
      <ScrollReveal delay={0.2} direction="up" distance={25}>
        <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8DFD1] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-stone-900 text-base">
                  Circularity Audit Ledger (Last 24 Hours)
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Immutable audit trail of scrap conversions, batch preparations, and NGO handovers
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-emerald-700 font-bold">
              100% Traceability
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#E8DFD1] text-stone-500 text-[10px] uppercase">
                  <th className="pb-2.5 font-bold">Event Type</th>
                  <th className="pb-2.5 font-bold">Item / Dish Reference</th>
                  <th className="pb-2.5 font-bold">Weight / Portions</th>
                  <th className="pb-2.5 font-bold">Nutritional Purpose</th>
                  <th className="pb-2.5 font-bold">ESG Impact</th>
                  <th className="pb-2.5 font-bold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD1] text-stone-700">
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      COMMUNITY BATCH
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-stone-900">Slow-Roasted Peppercorn Broth</td>
                  <td className="py-3">12 Portions</td>
                  <td className="py-3 text-emerald-700 font-bold">Community Relief</td>
                  <td className="py-3 text-stone-500">1.8 kg CO₂e saved</td>
                  <td className="py-3 text-right text-stone-400">Just now</td>
                </tr>
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-800 text-[10px] font-bold border border-violet-200">
                      NGO HANDOVER
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-stone-900">Charred Herb Stem Chimichurri</td>
                  <td className="py-3">6 Portions</td>
                  <td className="py-3 text-violet-700 font-bold">Rescued Meals</td>
                  <td className="py-3 text-emerald-700">100% Diverted</td>
                  <td className="py-3 text-right text-stone-400">40m ago</td>
                </tr>
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                      AI VISION INGEST
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-stone-900">Chicken Carcass & Wing Tips</td>
                  <td className="py-3">2.4 kg</td>
                  <td className="py-3 text-emerald-700 font-bold">Zero Waste Intake</td>
                  <td className="py-3 text-stone-500">Collagen broth locked</td>
                  <td className="py-3 text-right text-stone-400">2h ago</td>
                </tr>
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      RECIPE COOKED
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-stone-900">Spiced Sourdough Heel Crisps</td>
                  <td className="py-3">10 Portions</td>
                  <td className="py-3 text-emerald-700 font-bold">10 Portions Cooked</td>
                  <td className="py-3 text-stone-500">1.0 kg crusts saved</td>
                  <td className="py-3 text-right text-stone-400">3h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

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
