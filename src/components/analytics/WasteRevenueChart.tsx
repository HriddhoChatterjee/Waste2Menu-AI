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
    <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8DFD1] flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1] mb-4">
        <div>
          <h3 className="font-heading font-bold text-stone-900 text-base">
            Daily Prep Waste Diverted vs. Nutritious Meals Created
          </h3>
          <p className="text-xs text-stone-500 font-mono">
            Comparing daily scrap diverted (kg) against nutritious community meals prepared
          </p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">
          7-Day Trend
        </span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD1" />
            <XAxis dataKey="day" stroke="#78716C" fontSize={11} />
            <YAxis yAxisId="left" stroke="#78716C" fontSize={11} unit="kg" />
            <YAxis yAxisId="right" orientation="right" stroke="#059669" fontSize={11} />
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
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} />
            <Bar 
              yAxisId="left" 
              dataKey="wasteKg" 
              name="Scrap Diverted (kg)" 
              fill="#7C3AED" 
              radius={[6, 6, 0, 0]} 
              barSize={24}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="meals" 
              name="Meals Created" 
              stroke="#059669" 
              strokeWidth={3} 
              dot={{ fill: '#059669', r: 4 }}
              activeDot={{ r: 7, fill: '#10B981' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
