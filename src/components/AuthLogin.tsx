import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  User, 
  ArrowRight, 
  Lock, 
  Phone, 
  Sparkles,
  Building,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

interface AuthLoginProps {
  onLogin: (role: 'patient' | 'doctor') => void;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [phone, setPhone] = useState<string>('+971 50 842 1902');
  const [doctorId, setDoctorId] = useState<string>('DOH-MFM-94218');
  const [doctorPin, setDoctorPin] = useState<string>('••••••');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>('');

  const handleUaePassLogin = () => {
    setIsAuthenticating(true);
    setAuthSuccessMsg('Authenticating securely with UAE PASS...');
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin('patient');
    }, 1200);
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthSuccessMsg('Verifying Emirates ID credentials...');
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin('patient');
    }, 1000);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthSuccessMsg('Verifying Consultant Medical License credentials...');
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin('doctor');
    }, 1100);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Brand Banner */}
        <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white p-6 sm:p-7 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
          
          {/* Logo mark */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 mx-auto flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg mb-3">
            FC
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight">
            FetalCare UAE
          </h1>
          <p className="text-xs text-teal-200/90 mt-1 font-medium">
            Dr. Tariq Al-Hashimi · Maternal-Fetal Medicine
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('patient')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'patient'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>Mother View</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'doctor'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Doctor & Staff</span>
          </button>
        </div>

        {/* Authentication Body */}
        <div className="p-6 space-y-5 text-xs">
          {isAuthenticating ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
              <span className="font-semibold text-slate-800 text-sm">{authSuccessMsg}</span>
              <span className="text-[11px] text-slate-400">Please wait while secure session establishes...</span>
            </div>
          ) : activeTab === 'patient' ? (
            /* PATIENT LOGIN FORM */
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Welcome to Your Pregnancy Portal
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Access your 3D ultrasound vault, appointment bookings, and fetal kick logs.
                </p>
              </div>

              {/* UAE PASS Button (Gold Standard in UAE Healthcare) */}
              <button
                type="button"
                onClick={handleUaePassLogin}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition active:scale-98 shadow-sm flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-teal-500/20 text-teal-400 flex items-center justify-center text-[10px] font-bold">
                    1P
                  </div>
                  <span>Log in with UAE PASS</span>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <span>OR SIGN IN WITH PHONE & MRN</span>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>

              <form onSubmit={handlePatientSubmit} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Mobile Number (Registered in UAE)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-xs"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition active:scale-98 shadow-xs"
                >
                  Send OTP Code
                </button>
              </form>

              {/* Demo One-Click Shortcut */}
              <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-200/70 text-center">
                <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block mb-1">
                  Prototype Demo Shortcut
                </span>
                <button
                  onClick={() => onLogin('patient')}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-teal-100/50 text-teal-800 font-semibold border border-teal-300 transition text-[11px] shadow-2xs"
                >
                  Enter as Sarah Al-Maktoum (Mother · 22w 4d)
                </button>
              </div>
            </div>
          ) : (
            /* DOCTOR & CLINICAL STAFF LOGIN FORM */
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Consultant & Clinic Staff Gateway
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Manage ultrasound appointments, high-risk patients, and PACS report publishing.
                </p>
              </div>

              <form onSubmit={handleDoctorSubmit} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    DoH / DHA Consultant License ID
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Clinical PIN / Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={doctorPin}
                      onChange={(e) => setDoctorPin(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Active Clinical Facility
                  </label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs">
                    <option>Mediclinic City Hospital (DHCC Dubai)</option>
                    <option>Advanced Fetal Medicine Centre (Abu Dhabi)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition active:scale-98 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                  <span>Authorize Clinical Console</span>
                </button>
              </form>

              {/* Demo One-Click Shortcut */}
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Prototype Demo Shortcut
                </span>
                <button
                  onClick={() => onLogin('doctor')}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-900 font-semibold border border-slate-300 transition text-[11px] shadow-2xs"
                >
                  Enter as Dr. Tariq Al-Hashimi (Consultant)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>Encrypted with TLS 1.3</span>
          <span className="flex items-center gap-1 text-teal-700 font-medium">
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            DoH & DHA Compliant
          </span>
        </div>
      </div>
    </div>
  );
};
