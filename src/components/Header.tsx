import React from 'react';
import { Smartphone, User, Stethoscope, LogOut } from 'lucide-react';

import { PatientProfile } from '../types';
import { calculateGestationalAge, parseDateIso } from '../utils/datingEngine';
import { CURRENT_SIMULATION_DATE, DEMO_PATIENTS } from '../data/mockData';

interface HeaderProps {
  activeTab: 'journey' | 'vault' | 'book' | 'vitals' | 'doctor' | 'admin';
  setActiveTab: (tab: 'journey' | 'vault' | 'book' | 'vitals' | 'doctor' | 'admin') => void;
  role: 'patient' | 'doctor';
  patient?: PatientProfile;
  onSelectPatient?: (p: PatientProfile) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  role,
  patient,
  onSelectPatient,
  onLogout,
}) => {
  const currentGa = patient 
    ? calculateGestationalAge(patient.eddDate, parseDateIso(CURRENT_SIMULATION_DATE))
    : { formatted: '22w 2d' };

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

          {/* Active Logged-In User Chip & Cohort Selector */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200/60">
            {role === 'patient' && patient ? (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-slate-800">{patient.name}</span>
                <span className="text-[10px] font-mono text-teal-800 bg-teal-100/60 px-1.5 py-0.2 rounded font-bold">
                  {currentGa.formatted}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Dr. Tariq (Consultant)</span>
              </div>
            )}
          </div>

          {/* Quick Demo Patient Switcher (Allows testing all 4 DOH spec cases) */}
          {role === 'patient' && onSelectPatient && (
            <select
              value={patient?.id}
              onChange={(e) => {
                const target = DEMO_PATIENTS[e.target.value];
                if (target) onSelectPatient(target);
              }}
              className="text-[10px] sm:text-[11px] font-medium py-1 px-1.5 sm:px-2 rounded-lg border border-teal-200 bg-teal-50/60 text-teal-900 focus:outline-none max-w-[125px] sm:max-w-none truncate"
              title="Switch DOH Demo Case (Section 17)"
            >
              <option value="pt-sarah">Sarah (22w · Low-risk)</option>
              <option value="pt-noura">Noura (27w · Placenta 14mm)</option>
              <option value="pt-maryam">Maryam (20w · MCDA Twins)</option>
              <option value="pt-aisha">Aisha (13w · High-Risk)</option>
            </select>
          )}
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


