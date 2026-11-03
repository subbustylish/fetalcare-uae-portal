import React from 'react';
import { Sparkles, Calendar, Heart, Stethoscope, Compass } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'journey' | 'vault' | 'book' | 'vitals' | 'doctor' | 'admin';
  setActiveTab: (tab: 'journey' | 'vault' | 'book' | 'vitals' | 'doctor' | 'admin') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 pb-safe shadow-lg">
      <div className="grid grid-cols-5 items-center h-14">
        {/* Screen 1: Journey */}
        <button
          onClick={() => setActiveTab('journey')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition ${
            activeTab === 'journey' ? 'text-teal-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Journey</span>
        </button>

        {/* Screen 2: Ultrasound Sonogram Console & 3D Scans */}
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition ${
            activeTab === 'vault' ? 'text-teal-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Sonogram</span>
        </button>

        {/* Screen 3: Center Action -> Dedicated Book Scan Screen */}
        <button
          onClick={() => setActiveTab('book')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] -mt-2 group ${
            activeTab === 'book' ? 'text-teal-800' : 'text-teal-700'
          }`}
        >
          <div className={`w-11 h-11 rounded-full text-white flex items-center justify-center shadow-md group-active:scale-95 transition ${
            activeTab === 'book' ? 'bg-teal-700 ring-4 ring-teal-200' : 'bg-teal-600'
          }`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold tracking-tight mt-0.5">Book</span>
        </button>

        {/* Screen 4: Vitals & Kicks */}
        <button
          onClick={() => setActiveTab('vitals')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition ${
            activeTab === 'vitals' ? 'text-teal-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Vitals</span>
        </button>

        {/* Screen 5: Doctor Profile & Guidance */}
        <button
          onClick={() => setActiveTab('doctor')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition ${
            activeTab === 'doctor' ? 'text-teal-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Dr. Tariq</span>
        </button>
      </div>
    </nav>
  );
};
