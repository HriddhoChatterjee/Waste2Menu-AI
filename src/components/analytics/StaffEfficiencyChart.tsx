import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  ReferenceLine,
  CartesianGrid,
  Legend
} from 'recharts';
import { AlertTriangle, CheckCircle2, UserCheck } from 'lucide-react';

export const StaffEfficiencyChart: React.FC = () => {
  const { staffBenchmarks } = useAppStore();

  const chartData = staffBenchmarks.map((b) => ({
    name: b.cookName.split(' ')[1] || b.cookName,
    fullName: b.cookName,
    station: b.station,
    lossPercent: b.lossPercent,
    benchmark: b.benchmarkLossPercent,
    status: b.status,
    dish: b.dishPrepared
  }));

  return (
    <div className="glass-panel rounded-2xl p-5 border border-charcoal-light flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-light mb-4">
        <div>
          <h3 className="font-heading font-bold text-white text-base">
            Cook Knife-Efficiency & Yield Variance
          </h3>
          <p className="text-xs text-textMuted font-mono">
            Variance vs. Station Standard Baseline (Anomaly Detection)
          </p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40 rounded-full">
          Staff Variance
        </span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
            <YAxis stroke="#94A3B8" fontSize={11} unit="%" domain={[0, 35]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F1622',
                borderColor: '#1E293B',
                borderRadius: '12px',
                color: '#F8FAFC',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px'
              }}
              formatter={(value: any, name: any, item: any) => [
                `${value}% (Benchmark: ${item.payload.benchmark}%)`,
                `${item.payload.fullName} - ${item.payload.station}`
              ]}
            />
            <ReferenceLine y={15} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Avg Benchmark (15%)', fill: '#F59E0B', fontSize: 10 }} />
            <Bar dataKey="lossPercent" name="Actual Trim Loss %" radius={[6, 6, 0, 0]} barSize={28}>
              {chartData.map((entry, index) => {
                let color = '#10B981'; // Green (Optimal)
                if (entry.status === 'high_loss_anomaly') color = '#EF4444'; // Red
                else if (entry.status === 'moderate') color = '#F59E0B'; // Amber
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly Callout Box */}
      <div className="mt-3 p-3 rounded-xl bg-obsidian/70 border border-charcoal-light space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-textMuted flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-coral" /> Active Line Anomalies:
          </span>
          <span className="text-[10px] font-mono text-coral font-bold bg-coral/10 px-2 py-0.5 rounded border border-coral/30">
            {staffBenchmarks.filter((b) => b.status === 'high_loss_anomaly').length} Flagged
          </span>
        </div>

        <div className="text-[11px] font-mono text-textMuted">
          {staffBenchmarks.filter((b) => b.status === 'high_loss_anomaly').map((b) => (
            <div key={b.id} className="text-coral">
              • <strong>{b.cookName}</strong> ({b.station}): {b.lossPercent}% loss on "{b.dishPrepared}" (+{(b.lossPercent - b.benchmarkLossPercent).toFixed(1)}% above baseline).
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
