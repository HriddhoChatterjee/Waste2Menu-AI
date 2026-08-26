import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const ByproductCategoryChart: React.FC = () => {
  const { scraps } = useAppStore();

  const categoryTotals: Record<string, number> = {};
  scraps.forEach((s) => {
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + s.weightKg;
  });

  const categoryColors: Record<string, string> = {
    poultry_bones: '#EF4444',
    mirepoix_peels: '#10B981',
    citrus_rinds: '#F59E0B',
    herb_stems: '#34D399',
    bread_crusts: '#8B5CF6',
    fish_frames: '#38BDF8'
  };

  const data = Object.keys(categoryTotals).map((cat) => ({
    name: cat.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    category: cat,
    value: Math.round(categoryTotals[cat] * 10) / 10,
    color: categoryColors[cat] || '#8B5CF6'
  }));

  const totalKg = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-charcoal-light flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-light mb-2">
        <div>
          <h3 className="font-heading font-bold text-white text-base">
            Byproduct Stockpile Breakdown
          </h3>
          <p className="text-xs text-textMuted font-mono">
            Active composition across culinary waste streams
          </p>
        </div>
        <span className="font-mono font-bold text-xs text-emerald-400">
          {totalKg.toFixed(1)} kg Active
        </span>
      </div>

      <div className="w-full h-64 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#151D2A" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F1622',
                borderColor: '#1E293B',
                borderRadius: '12px',
                color: '#F8FAFC',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value} kg`, 'Mass Stockpile']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', bottom: 0 }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
          <span className="font-heading font-black text-xl text-white">
            {totalKg.toFixed(1)}
          </span>
          <span className="text-[10px] font-mono text-textMuted uppercase">kg Scraps</span>
        </div>
      </div>
    </div>
  );
};
