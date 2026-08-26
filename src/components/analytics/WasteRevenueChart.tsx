import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export const WasteRevenueChart: React.FC = () => {
  const data = [
    { day: 'Mon', wasteKg: 18.4, revenue: 4200, meals: 24 },
    { day: 'Tue', wasteKg: 22.1, revenue: 5850, meals: 30 },
    { day: 'Wed', wasteKg: 19.8, revenue: 5100, meals: 28 },
    { day: 'Thu', wasteKg: 25.4, revenue: 6900, meals: 38 },
    { day: 'Fri', wasteKg: 31.2, revenue: 8850, meals: 45 },
    { day: 'Sat', wasteKg: 38.6, revenue: 11400, meals: 56 },
    { day: 'Sun (Today)', wasteKg: 29.5, revenue: 9240, meals: 42 }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-charcoal-light flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-light mb-4">
        <div>
          <h3 className="font-heading font-bold text-white text-base">
            Daily Prep Waste Diverted vs. Upcycled Recovered Revenue
          </h3>
          <p className="text-xs text-textMuted font-mono">
            Comparing daily mass (kg) against dynamic special sales (₹)
          </p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
          7-Day Trend
        </span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} fontStyle="bold" />
            <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} unit="kg" />
            <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={11} unit="₹" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F1622',
                borderColor: '#1E293B',
                borderRadius: '12px',
                color: '#F8FAFC',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} />
            <Bar 
              yAxisId="left" 
              dataKey="wasteKg" 
              name="Scrap Diverted (kg)" 
              fill="#8B5CF6" 
              radius={[6, 6, 0, 0]} 
              barSize={24}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="revenue" 
              name="Recovered Revenue (₹)" 
              stroke="#10B981" 
              strokeWidth={3} 
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 7, fill: '#34d399' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
