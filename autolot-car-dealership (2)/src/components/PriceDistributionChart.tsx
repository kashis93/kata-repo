import React, { useState, useMemo } from 'react';
import { Vehicle } from '../types/vehicle';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { BarChart3, DollarSign, Layers, Zap } from 'lucide-react';

interface PriceDistributionChartProps {
  vehicles: Vehicle[];
}

export const PriceDistributionChart: React.FC<PriceDistributionChartProps> = ({ vehicles }) => {
  const [chartMode, setChartMode] = useState<'brackets' | 'bodyStyle' | 'power'>('brackets');

  // 1. Calculate Price Brackets Distribution
  const bracketData = useMemo(() => {
    const buckets = [
      { name: '< $50k', min: 0, max: 50000, count: 0, totalValue: 0 },
      { name: '$50k - $100k', min: 50000, max: 100000, count: 0, totalValue: 0 },
      { name: '$100k - $150k', min: 100000, max: 150000, count: 0, totalValue: 0 },
      { name: '$150k - $200k', min: 150000, max: 200000, count: 0, totalValue: 0 },
      { name: '$200k - $250k', min: 200000, max: 250000, count: 0, totalValue: 0 },
      { name: '$250k+', min: 250000, max: Infinity, count: 0, totalValue: 0 }
    ];

    vehicles.forEach((v) => {
      const bucket = buckets.find((b) => v.price >= b.min && v.price < b.max);
      if (bucket) {
        bucket.count += v.quantity > 0 ? v.quantity : 1;
        bucket.totalValue += v.price * (v.quantity || 1);
      }
    });

    return buckets.map((b) => ({
      name: b.name,
      vehiclesCount: b.count,
      avgPrice: b.count > 0 ? Math.round(b.totalValue / b.count) : 0,
      totalValue: b.totalValue
    }));
  }, [vehicles]);

  // 2. Calculate Average Price by Body Style
  const bodyStyleData = useMemo(() => {
    const map: Record<string, { count: number; sumPrice: number; sumHp: number }> = {};
    vehicles.forEach((v) => {
      const body = v.bodyType || 'Other';
      if (!map[body]) {
        map[body] = { count: 0, sumPrice: 0, sumHp: 0 };
      }
      map[body].count += 1;
      map[body].sumPrice += v.price;
      map[body].sumHp += v.horsepower;
    });

    return Object.entries(map).map(([style, stat]) => ({
      name: style,
      avgPrice: Math.round(stat.sumPrice / stat.count),
      avgHp: Math.round(stat.sumHp / stat.count),
      count: stat.count
    }));
  }, [vehicles]);

  const COLORS = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6', '#f43f5e'];

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-3.5 rounded-2xl shadow-2xl text-xs space-y-1.5 font-sans backdrop-blur-md">
          <div className="font-extrabold text-amber-400 font-display text-sm tracking-tight">{label}</div>
          {chartMode === 'brackets' ? (
            <>
              <div className="text-slate-200">
                Units in Bracket: <span className="font-mono font-bold text-white">{data.vehiclesCount}</span>
              </div>
              <div className="text-slate-300">
                Total Category Value: <span className="font-mono font-bold text-emerald-400">${data.totalValue.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-slate-200">
                Average Price: <span className="font-mono font-bold text-amber-400">${data.avgPrice.toLocaleString()}</span>
              </div>
              <div className="text-slate-300">
                Average Power: <span className="font-mono font-bold text-sky-400">{data.avgHp} HP</span>
              </div>
              <div className="text-slate-400">
                Inventory Models: <span className="font-mono text-white">{data.count}</span>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl space-y-5 backdrop-blur-md">
      {/* Chart Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-inner">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white font-display tracking-wider uppercase">
              Inventory Pricing Spectrum & Analytics
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Visualizing MSRP distribution and valuation brackets across stock
            </span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl shadow-inner">
          <button
            onClick={() => setChartMode('brackets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              chartMode === 'brackets'
                ? 'bg-amber-500 text-slate-950 shadow-md font-display'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Price Tiers
          </button>
          <button
            onClick={() => setChartMode('bodyStyle')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              chartMode === 'bodyStyle'
                ? 'bg-amber-500 text-slate-950 shadow-md font-display'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Body Styles
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartMode === 'brackets' ? bracketData : bodyStyleData}
            margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => (chartMode === 'brackets' ? `${val}` : `$${Math.round(val / 1000)}k`)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey={chartMode === 'brackets' ? 'vehiclesCount' : 'avgPrice'}
              radius={[8, 8, 0, 0]}
            >
              {(chartMode === 'brackets' ? bracketData : bodyStyleData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend / Summary Info */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> High-Value Inventory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Mid-Spectrum Performance
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Total Analyzed Units: {vehicles.length} Models
        </span>
      </div>
    </div>
  );
};
