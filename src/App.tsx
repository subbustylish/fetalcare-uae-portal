import React, { useState } from 'react';
import { INITIAL_PATIENT, UPCOMING_APPOINTMENTS } from './data/mockData';
import { Appointment, PatientProfile } from './types';
import { Header } from './components/Header';
import { AuthLogin } from './components/AuthLogin';
import { GestationalHero } from './components/GestationalHero';
import { JourneyTimeline } from './components/JourneyTimeline';
import { ScanVault } from './components/ScanVault';
import { VitalsTracker } from './components/VitalsTracker';
import { DoctorProfile } from './components/DoctorProfile';
import { DoctorAdminPortal } from './components/DoctorAdminPortal';
import { BookingModal } from './components/BookingModal';
import { BookingScreen } from './components/BookingScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Authentication State: null (Show Login), 'patient' (Mother View), or 'doctor' (Doctor Panel)
  const [currentUser, setCurrentUser] = useState<'patient' | 'doctor' | null>(null);
  const [activeTab, setActiveTab] = useState<'journey' | 'vault' | 'book' | 'vitals' | 'doctor' | 'admin'>('journey');
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [appointments, setAppointments] = useState<Appointment[]>(UPCOMING_APPOINTMENTS);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  const handleLogin = (selectedRole: 'patient' | 'doctor') => {
    setCurrentUser(selectedRole);
    if (selectedRole === 'doctor') {
      setActiveTab('admin');
    } else {
      setActiveTab('journey');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleBookingSuccess = (newApt: Appointment) => {
    setAppointments([newApt, ...appointments]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Banner on Desktop for Viewport Preview Switching */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white text-xs border-b border-teal-800/40">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-teal-400">Dr. Tariq Al-Hashimi Clinic Portal</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Mediclinic City Hospital (DHCC) & Advanced Fetal Medicine Centre (Abu Dhabi)</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Viewport switch: Full Width vs Phone Frame */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setIsMobileFrame(false)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition ${
                !isMobileFrame ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Full Screen</span>
            </button>
            <button
              onClick={() => setIsMobileFrame(true)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition ${
                isMobileFrame ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>iPhone 16 Frame</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Container: Full width or centered mobile shell */}
      <div className={`flex-1 flex flex-col transition-all ${
        isMobileFrame 
          ? 'max-w-[430px] mx-auto my-6 rounded-[48px] shadow-2xl border-[10px] border-slate-900 overflow-hidden bg-slate-50 min-h-[860px]' 
          : 'w-full bg-slate-50'
      }`}>
        {/* iPhone Island bar when in mockup frame mode */}
        {isMobileFrame && (
          <div className="w-full bg-slate-900 py-2.5 px-6 flex items-center justify-between text-white text-[10px] font-medium select-none">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 rounded-xs border border-white p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* When not logged in: Show the clean UAE Dual-Login Screen */}
        {!currentUser ? (
          <AuthLogin onLogin={handleLogin} />
        ) : (
          /* When logged in: Show Header and relevant Portal */
          <>
            <Header
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              role={currentUser}
              patient={patient}
              onSelectPatient={setPatient}
              onLogout={handleLogout}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 pb-28 md:pb-8">
              {currentUser === 'patient' ? (
                <>
                  {/* Screen 1: Journey Timeline with Gestational Status */}
                  {activeTab === 'journey' && (
                    <>
                      <GestationalHero
                        patient={patient}
                        onOpenBooking={() => setActiveTab('book')}
                        onOpenVault={() => setActiveTab('vault')}
                      />
                      <JourneyTimeline
                        patient={patient}
                        appointments={appointments}
                        onOpenBooking={() => setActiveTab('book')}
                        onOpenVault={() => setActiveTab('vault')}
                      />
                    </>
                  )}

                  {/* Screen 2: Dedicated Ultrasound Sonogram Console & Biometric Vault */}
                  {activeTab === 'vault' && (
                    <div className="space-y-6">
                      <ScanVault />
                    </div>
                  )}

                  {/* Screen 3: Dedicated Specialist Booking & Scheduling Screen */}
                  {activeTab === 'book' && (
                    <BookingScreen
                      patient={patient}
                      onBookingSuccess={handleBookingSuccess}
                      onNavigateToJourney={() => setActiveTab('journey')}
                    />
                  )}

                  {/* Screen 4: Dedicated Maternal Vitals, Kick Counter & Labs */}
                  {activeTab === 'vitals' && <VitalsTracker patient={patient} />}

                  {/* Screen 5: Dedicated Dr. Tariq Al-Hashimi Profile & Emergency Triage */}
                  {activeTab === 'doctor' && <DoctorProfile />}
                </>
              ) : (
                /* Doctor Clinical Portal with DOH Decision Support */
                <DoctorAdminPortal 
                  activePatient={patient}
                  onSelectPatient={setPatient}
                />
              )}
            </main>

            {/* Mobile Fixed Bottom Navigation Bar for Patients */}
            {currentUser === 'patient' && (
              <BottomNavBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </>
        )}
      </div>

      {/* Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        patient={patient}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}

