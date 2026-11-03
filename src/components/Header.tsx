import React from 'react';
import { Smartphone, User, Stethoscope, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: 'journey' | 'vault' | 'book' | 'vitals' | 'doctor' | 'admin';
  setActiveTab: (tab: 'journey' | 'vault' | 'book' | 'vitals' | 'doctor' | 'admin') => void;
  role: 'patient' | 'doctor';
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  role,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand Wordmark & Active User Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div 
            onClick={() => setActiveTab(role === 'patient' ? 'journey' : 'admin')} 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-xs shrink-0">
              <span className="font-bold text-[11px] sm:text-xs font-mono">FC</span>
            </div>
            <span className="text-sm sm:text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap">
              FetalCare UAE
            </span>
          </div>

          {/* Active Logged-In User Chip */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200/60">
            {role === 'patient' ? (
              <>
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Sarah (22w4d)</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Dr. Tariq (Consultant)</span>
              </>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop view only, mobile uses BottomNavBar) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-medium text-slate-600">
          {role === 'patient' ? (
            <>
              <button
                onClick={() => setActiveTab('journey')}
                className={`transition-colors whitespace-nowrap py-1 ${
                  activeTab === 'journey'
                    ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                    : 'hover:text-slate-900'
                }`}
              >
                Journey
              </button>
              <button
                onClick={() => setActiveTab('vault')}
                className={`transition-colors whitespace-nowrap py-1 ${
                  activeTab === 'vault'
                    ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                    : 'hover:text-slate-900'
                }`}
              >
                Ultrasound Sonogram Console
              </button>
              <button
                onClick={() => setActiveTab('book')}
                className={`transition-colors whitespace-nowrap py-1 ${
                  activeTab === 'book'
                    ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                    : 'hover:text-slate-900'
                }`}
              >
                Book Scan
              </button>
              <button
                onClick={() => setActiveTab('vitals')}
                className={`transition-colors whitespace-nowrap py-1 ${
                  activeTab === 'vitals'
                    ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                    : 'hover:text-slate-900'
                }`}
              >
                Vitals & Kicks
              </button>
              <button
                onClick={() => setActiveTab('doctor')}
                className={`transition-colors whitespace-nowrap py-1 ${
                  activeTab === 'doctor'
                    ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                    : 'hover:text-slate-900'
                }`}
              >
                Dr. Tariq Profile
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('admin')}
              className="text-teal-700 font-semibold border-b-2 border-teal-600 py-1"
            >
              Clinical Command Desk
            </button>
          )}
        </nav>

        {/* Zone 3: Action (Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onLogout}
            title="Switch User / Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition text-[11px] sm:text-xs font-medium min-h-[36px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};


