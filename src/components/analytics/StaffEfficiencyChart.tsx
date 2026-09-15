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
    <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8DFD1] flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1] mb-4">
        <div>
          <h3 className="font-heading font-bold text-stone-900 text-base">
            Cook Knife-Efficiency & Yield Variance
          </h3>
          <p className="text-xs text-stone-500 font-mono">
            Variance vs. Station Standard Baseline (Anomaly Detection)
          </p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-violet-100 text-violet-800 border border-violet-200 rounded-full">
          Staff Variance
        </span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD1" />
            <XAxis dataKey="name" stroke="#78716C" fontSize={11} />
            <YAxis stroke="#78716C" fontSize={11} unit="%" domain={[0, 35]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E8DFD1',
                borderRadius: '12px',
                color: '#1C1917',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}
              formatter={(value: any, name: any, item: any) => [
                `${value}% (Benchmark: ${item.payload.benchmark}%)`,
                `${item.payload.fullName} - ${item.payload.station}`
              ]}
            />
            <ReferenceLine y={15} stroke="#D97706" strokeDasharray="4 4" label={{ value: 'Avg Benchmark (15%)', fill: '#D97706', fontSize: 10 }} />
            <Bar dataKey="lossPercent" name="Actual Trim Loss %" radius={[6, 6, 0, 0]} barSize={28}>
              {chartData.map((entry, index) => {
                let color = '#059669'; // Green (Optimal)
                if (entry.status === 'high_loss_anomaly') color = '#E11D48'; // Red
                else if (entry.status === 'moderate') color = '#D97706'; // Amber
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly Callout Box */}
      <div className="mt-3 p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-stone-700 flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Active Line Anomalies:
          </span>
          <span className="text-[10px] font-mono text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
            {staffBenchmarks.filter((b) => b.status === 'high_loss_anomaly').length} Flagged
          </span>
        </div>

        <div className="text-[11px] font-mono text-stone-600">
          {staffBenchmarks.filter((b) => b.status === 'high_loss_anomaly').map((b) => (
            <div key={b.id} className="text-rose-700">
              • <strong>{b.cookName}</strong> ({b.station}): {b.lossPercent}% loss on "{b.dishPrepared}" (+{(b.lossPercent - b.benchmarkLossPercent).toFixed(1)}% above baseline).
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
