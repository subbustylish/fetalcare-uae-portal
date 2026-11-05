import React from 'react';
import { PatientProfile } from '../types';
import { Sparkles, Calendar, Heart, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

interface GestationalHeroProps {
  patient: PatientProfile;
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const GestationalHero: React.FC<GestationalHeroProps> = ({
  patient,
  onOpenBooking,
  onOpenVault,
}) => {
  const totalWeeks = 40;
  const currentTotalWeeks = patient.currentGestationalWeeks + patient.currentGestationalDays / 7;
  const progressPercent = Math.min(100, Math.round((currentTotalWeeks / totalWeeks) * 100));

  const eddFormatted = new Date(patient.eddDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const trimesterLabel = 
    patient.currentGestationalWeeks <= 13 ? 'Trimester 1 · Early Growth' :
    patient.currentGestationalWeeks <= 27 ? 'Trimester 2 · Golden Phase' :
    'Trimester 3 · Preparation';

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-5 sm:p-8 shadow-xl border border-teal-700/40">
      {/* Decorative Womb Radiance Background Circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Gestational Countdown & Milestones */}
        <div className="space-y-3.5 max-w-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-teal-200">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-950/60 border border-teal-600/40 backdrop-blur-xs text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
              <span>{trimesterLabel}</span>
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="text-teal-200/90 text-[11px] sm:text-xs">EDD: {eddFormatted}</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-white">
              Week {patient.currentGestationalWeeks}, Day {patient.currentGestationalDays}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 leading-relaxed">
              Baby is active! Senses and taste buds are developing, practicing gentle breathing movements.
            </p>
          </div>

          {/* Baby Size & Development Card */}
          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs w-full sm:w-auto">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-base sm:text-lg shadow-sm shrink-0">
              🍈
            </div>
            <div>
              <span className="text-teal-200 block text-[10px] sm:text-[11px] font-medium">Baby Size Comparable</span>
              <span className="font-semibold text-white text-xs sm:text-sm">Papaya · ~28 cm · 485 grams</span>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            <button
              onClick={onOpenVault}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition active:scale-98 shadow-md min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>View 3D Scan Vault</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs border border-white/20 transition active:scale-98 min-h-[44px]"
            >
              <Calendar className="w-4 h-4 text-teal-300" />
              <span>Book Routine Growth Scan (34–36w)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Gestational Circular Ring Metric */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3.5 sm:p-4 bg-teal-950/40 rounded-2xl border border-teal-700/30 backdrop-blur-md shrink-0">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center shrink-0">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeDasharray="314.16"
                strokeDashoffset={314.16 * (1 - progressPercent / 100)}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
                {progressPercent}%
              </span>
              <span className="text-[9px] sm:text-[10px] text-teal-200 uppercase tracking-widest font-semibold">
                Complete
              </span>
            </div>
          </div>

          <div className="sm:mt-3 text-right sm:text-center pl-3 sm:pl-0">
            <span className="text-xs font-medium text-teal-100 flex items-center gap-1 justify-end sm:justify-center">
              <Clock className="w-3.5 h-3.5 text-teal-300" />
              <span>122 days left</span>
            </span>
            <span className="text-[10px] text-teal-300/80 block mt-0.5">Delivery: March 2027</span>
          </div>
        </div>
      </div>
    </div>
  );
};
