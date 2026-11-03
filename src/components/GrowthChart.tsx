import React from 'react';
import { FetalBiometrics } from '../types';
import { Info, TrendingUp, CheckCircle2 } from 'lucide-react';

interface GrowthChartProps {
  biometrics: FetalBiometrics;
  gestationalWeek: number;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ biometrics, gestationalWeek }) => {
  // Hadlock EFW standard curve data (grams) by gestational week
  // [Week, 10th percentile, 50th percentile (median), 90th percentile]
  const hadlockCurve = [
    { week: 14, p10: 75, p50: 95, p90: 120 },
    { week: 18, p10: 180, p50: 220, p90: 270 },
    { week: 22, p10: 410, p50: 480, p90: 560 }, // Current patient
    { week: 26, p10: 790, p50: 910, p90: 1050 },
    { week: 30, p10: 1350, p50: 1560, p90: 1790 },
    { week: 34, p10: 2050, p50: 2380, p90: 2740 },
    { week: 38, p10: 2850, p50: 3250, p90: 3700 }
  ];

  // SVG coordinate calculations for chart
  const minX = 14;
  const maxX = 38;
  const minY = 0;
  const maxY = 4000;
  const chartW = 340;
  const chartH = 160;

  const getX = (w: number) => ((w - minX) / (maxX - minX)) * chartW + 30;
  const getY = (g: number) => chartH - ((g - minY) / (maxY - minY)) * chartH + 15;

  const p90Points = hadlockCurve.map(pt => `${getX(pt.week)},${getY(pt.p90)}`).join(' ');
  const p50Points = hadlockCurve.map(pt => `${getX(pt.week)},${getY(pt.p50)}`).join(' ');
  const p10Points = hadlockCurve.map(pt => `${getX(pt.week)},${getY(pt.p10)}`).join(' ');

  // Patient's current plotted point
  const currentPtX = getX(gestationalWeek);
  const currentPtY = getY(biometrics.efwGrams);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            Hadlock Fetal Growth Trajectory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Estimated Fetal Weight: <strong className="text-slate-800 font-semibold">{biometrics.efwGrams}g</strong> ({biometrics.efwPercentile}th Percentile)
          </p>
        </div>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Optimal Growth
        </span>
      </div>

      {/* SVG Growth Chart */}
      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 400 200" className="w-full h-48 select-none">
          {/* Grid lines */}
          <line x1="30" y1="15" x2="370" y2="15" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="30" y1="55" x2="370" y2="55" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="30" y1="95" x2="370" y2="95" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="30" y1="135" x2="370" y2="135" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="30" y1="175" x2="370" y2="175" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Shaded Normal Range (10th to 90th percentile zone) */}
          <polygon
            points={`${p90Points} ${hadlockCurve.slice().reverse().map(pt => `${getX(pt.week)},${getY(pt.p10)}`).join(' ')}`}
            fill="#ccfbf1"
            fillOpacity="0.5"
          />

          {/* 90th Percentile Line */}
          <polyline points={p90Points} fill="none" stroke="#99f6e4" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* 50th Percentile (Median) */}
          <polyline points={p50Points} fill="none" stroke="#0d9488" strokeWidth="2" />
          {/* 10th Percentile Line */}
          <polyline points={p10Points} fill="none" stroke="#99f6e4" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* X Axis Week Labels */}
          {hadlockCurve.map(pt => (
            <text key={pt.week} x={getX(pt.week)} y="190" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">
              {pt.week}w
            </text>
          ))}

          {/* Y Axis Grams Labels */}
          <text x="25" y="20" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">4kg</text>
          <text x="25" y="60" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">3kg</text>
          <text x="25" y="100" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">2kg</text>
          <text x="25" y="140" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">1kg</text>

          {/* Current Patient Marker */}
          <g transform={`translate(${currentPtX}, ${currentPtY})`}>
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="10" fill="#f43f5e" fillOpacity="0.2" className="animate-pulse" />
            <circle cx="0" cy="0" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
            <rect x="-35" y="-26" width="70" height="18" rx="4" fill="#0f172a" />
            <text x="0" y="-14" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600" fontFamily="sans-serif">
              Baby · 485g
            </text>
          </g>
        </svg>
      </div>

      {/* Legend & Biometric Details Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
        <div className="p-2 bg-slate-50 rounded-lg">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">BPD (Head Width)</span>
          <span className="font-semibold text-slate-900 font-mono text-xs">{biometrics.bpdMm} mm</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">HC (Circumference)</span>
          <span className="font-semibold text-slate-900 font-mono text-xs">{biometrics.hcMm} mm</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">AC (Abdomen)</span>
          <span className="font-semibold text-slate-900 font-mono text-xs">{biometrics.acMm} mm</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">FL (Femur Length)</span>
          <span className="font-semibold text-slate-900 font-mono text-xs">{biometrics.flMm} mm</span>
        </div>
      </div>
    </div>
  );
};
