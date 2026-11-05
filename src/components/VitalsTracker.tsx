import React, { useState, useEffect } from 'react';
import { KickCounterSession, BloodPressureLog, PatientProfile } from '../types';
import { INITIAL_KICK_SESSIONS, INITIAL_BP_LOGS, DEMO_PATIENTS } from '../data/mockData';
import { 
  DEMO_LAB_PANELS, 
  DEMO_VACCINES_TREATMENTS, 
  INITIAL_EDUCATION_TOPICS,
  EducationChecklistItem,
  VaccineTreatmentRecord
} from '../data/clinicalPhase5Data';
import { 
  Heart, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  RotateCcw,
  Pill,
  Sparkles,
  FlaskConical,
  Syringe,
  BookOpen,
  PhoneCall,
  Bed,
  ShieldCheck,
  Calendar,
  Info,
  Check
} from 'lucide-react';

interface VitalsTrackerProps {
  patient?: PatientProfile;
}

export const VitalsTracker: React.FC<VitalsTrackerProps> = ({ patient }) => {
  const currentPatient = patient || DEMO_PATIENTS['pt-sarah'];

  // Sub-tabs for Mother View
  const [activeSubTab, setActiveSubTab] = useState<'vitals' | 'labs' | 'education'>('vitals');

  // Kick Counter State
  const [kickSessions, setKickSessions] = useState<KickCounterSession[]>(INITIAL_KICK_SESSIONS);
  const [currentKicks, setCurrentKicks] = useState<number>(0);
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [heartBeatEffect, setHeartBeatEffect] = useState<boolean>(false);

  // Blood Pressure State
  const [bpLogs, setBpLogs] = useState<BloodPressureLog[]>(INITIAL_BP_LOGS);
  const [showBpModal, setShowBpModal] = useState<boolean>(false);
  const [newSystolic, setNewSystolic] = useState<number>(116);
  const [newDiastolic, setNewDiastolic] = useState<number>(74);
  const [newPulse, setNewPulse] = useState<number>(80);

  // Daily Prenatal Routine checklist
  const [vitaminsTaken, setVitaminsTaken] = useState<{ [key: string]: boolean }>({
    iron: true,
    folic: true,
    calcium: false,
    aspirin: (currentPatient.highRiskFactors && currentPatient.highRiskFactors.length > 0) || currentPatient.carePathway === 'obstetric_led' || currentPatient.carePathway === 'fetal_medicine'
  });

  // Education category filter
  const [selectedEduCategory, setSelectedEduCategory] = useState<string>('all');
  const [expandedEduTopic, setExpandedEduTopic] = useState<string | null>(null);

  // Timer effect for active kick counter session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const handleRecordKick = () => {
    if (!sessionActive) {
      setSessionActive(true);
    }
    setHeartBeatEffect(true);
    setTimeout(() => setHeartBeatEffect(false), 300);

    const nextKicks = currentKicks + 1;
    setCurrentKicks(nextKicks);

    if (nextKicks >= 10) {
      // Completed Cardiff Count-to-10 protocol
      setSessionActive(false);
      const minutes = Math.max(1, Math.round(secondsElapsed / 60));
      const newSession: KickCounterSession = {
        id: `kick-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: minutes,
        totalKicks: 10,
        notes: 'Target 10 kicks reached. Normal vigorous fetal movements.'
      };
      setKickSessions([newSession, ...kickSessions]);
      setCurrentKicks(0);
      setSecondsElapsed(0);
    }
  };

  const handleResetSession = () => {
    setSessionActive(false);
    setCurrentKicks(0);
    setSecondsElapsed(0);
  };

  const handleAddBpLog = (e: React.FormEvent) => {
    e.preventDefault();
    let status: 'Normal' | 'Elevated' | 'Warning' = 'Normal';
    if (newSystolic >= 140 || newDiastolic >= 90) {
      status = 'Warning';
    } else if (newSystolic >= 130 || newDiastolic >= 85) {
      status = 'Elevated';
    }

    const newLog: BloodPressureLog = {
      id: `bp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      systolic: newSystolic,
      diastolic: newDiastolic,
      pulse: newPulse,
      status,
      notes: status === 'Warning' ? 'Flagged for obstetric review' : 'Routine home check'
    };

    setBpLogs([newLog, ...bpLogs]);
    setShowBpModal(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const patientLabs = DEMO_LAB_PANELS[currentPatient.id] || DEMO_LAB_PANELS['pt-sarah'];
  const patientVaccines = DEMO_VACCINES_TREATMENTS[currentPatient.id] || DEMO_VACCINES_TREATMENTS['pt-sarah'];

  const filteredEducation = INITIAL_EDUCATION_TOPICS.filter(item => {
    if (selectedEduCategory === 'all') return true;
    return item.category === selectedEduCategory;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header and Sub-tab selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            Mother's Health & Care Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Personalized surveillance for {currentPatient.name} · DOH Abu Dhabi Standard
          </p>
        </div>

        {/* Sub-tab navigation (Mobile optimized) */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 p-1 bg-slate-100 rounded-xl sm:rounded-2xl shrink-0">
          <button
            onClick={() => setActiveSubTab('vitals')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition min-h-[40px] ${
              activeSubTab === 'vitals'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Vitals & Kicks</span>
          </button>

          <button
            onClick={() => setActiveSubTab('labs')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition min-h-[40px] ${
              activeSubTab === 'labs'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-teal-600" />
            <span>Labs & Vaccines</span>
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          </button>

          <button
            onClick={() => setActiveSubTab('education')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition min-h-[40px] ${
              activeSubTab === 'education'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Education & Safety</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DAILY VITALS & KICKS */}
      {activeSubTab === 'vitals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Column: Cardiff Kick Counter (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
                  Fetal Movement Tracker
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Cardiff "Count to 10" Session
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-medium text-slate-600 flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatTimer(secondsElapsed)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400">
                  {sessionActive ? 'In progress' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Interactive Kick Trigger Button */}
            <div className="flex flex-col items-center justify-center py-2 sm:py-4">
              <button
                onClick={handleRecordKick}
                className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center transition-all duration-150 shadow-xl cursor-pointer select-none active:scale-95 ${
                  heartBeatEffect
                    ? 'bg-rose-600 text-white scale-105 ring-8 ring-rose-300/40'
                    : 'bg-gradient-to-br from-rose-500 to-rose-600 text-white hover:brightness-105 ring-4 ring-rose-200/50'
                }`}
              >
                <Heart className={`w-10 h-10 sm:w-12 sm:h-12 mb-1.5 sm:mb-2 transition-transform ${heartBeatEffect ? 'scale-125' : ''}`} fill="currentColor" />
                <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight">
                  {currentKicks} / 10
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-wide uppercase opacity-90 mt-0.5">
                  {sessionActive ? 'Tap on Kick' : 'Tap to Begin'}
                </span>
              </button>

              <div className="mt-3 sm:mt-4 flex items-center gap-4 text-xs">
                {sessionActive && (
                  <button
                    onClick={handleResetSession}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium transition py-1 px-2.5 rounded-lg bg-slate-100"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Session</span>
                  </button>
                )}
              </div>

              <div className="mt-3 p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl text-center max-w-sm">
                <p className="text-[11px] text-rose-900 leading-relaxed font-medium">
                  Lie comfortably on your left side. Tap the heart for each distinct movement. Target: 10 kicks within 2 hours.
                </p>
                <p className="text-[10px] text-rose-700 mt-1">
                  🚨 Any noticeable reduction or cessation warrants immediate 24/7 maternity contact. (STD 3.4.1.14)
                </p>
              </div>
            </div>

            {/* Past Sessions Log */}
            <div className="border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-800 block mb-2.5">
                Recent Movement Sessions
              </span>
              <div className="space-y-2">
                {kickSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <Heart className="w-3.5 h-3.5" fill="currentColor" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {session.date} at {session.startTime}
                        </span>
                        <span className="text-[10px] text-slate-500">{session.notes}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-emerald-700 block">
                        10 kicks in {session.durationMinutes} min
                      </span>
                      <span className="text-[10px] text-slate-400">Normal Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Blood Pressure & Prenatal Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Blood Pressure & Preeclampsia Watch */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                    Preeclampsia Surveillance
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Blood Pressure Log
                  </h3>
                </div>
                <button
                  onClick={() => setShowBpModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium text-xs border border-teal-200 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log BP</span>
                </button>
              </div>

              {/* Latest Reading Spotlight */}
              {bpLogs.length > 0 && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-teal-700 uppercase font-semibold block">
                      Latest Reading ({bpLogs[0].date})
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                        {bpLogs[0].systolic}/{bpLogs[0].diastolic}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">mmHg</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">Pulse: {bpLogs[0].pulse} bpm</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Normal
                  </span>
                </div>
              )}

              {/* BP History Table */}
              <div className="space-y-1.5">
                {bpLogs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 text-xs border-b border-slate-100 last:border-none"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 font-mono">
                        {log.systolic}/{log.diastolic} mmHg
                      </span>
                      <span className="text-[10px] text-slate-400 block">{log.date} · {log.time}</span>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      log.status === 'Normal' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] sm:text-[11px] text-slate-400 italic">
                Threshold warning: Notify clinic if systolic ≥ 140 mmHg or diastolic ≥ 90 mmHg.
              </p>
            </div>

            {/* Daily Prenatal Supplements Routine */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Prescription Protocol
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Today's Prenatal Supplements
              </h3>

              <div className="space-y-2 pt-1 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Pill className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Oral Iron & Folic Acid (400 mcg)</span>
                      <span className="text-[10px] text-slate-500">Essential for fetal hemoglobin</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vitaminsTaken.iron}
                    onChange={(e) => setVitaminsTaken({ ...vitaminsTaken, iron: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Pill className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Aspirin 150 mg (Once Daily at Night)</span>
                      <span className="text-[10px] text-slate-500">For women flagged at risk of PET / FGR (STD App.1)</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vitaminsTaken.aspirin}
                    onChange={(e) => setVitaminsTaken({ ...vitaminsTaken, aspirin: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Pill className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Calcium + Vitamin D3 (600mg)</span>
                      <span className="text-[10px] text-slate-500">Fetal bone & tooth bud mineralization</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vitaminsTaken.calcium}
                    onChange={(e) => setVitaminsTaken({ ...vitaminsTaken, calcium: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LABS & VACCINES (Section 12) */}
      {activeSubTab === 'labs' && (
        <div className="space-y-6">
          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Lab Records</span>
                <p className="text-base font-bold text-slate-900">{patientLabs.length} Panels Tracked</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Vaccines & Prophylaxis</span>
                <p className="text-base font-bold text-slate-900">{patientVaccines.length} Mandated (DOH STD App.1)</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">DOH Standard</span>
                <p className="text-base font-bold text-slate-900">STD App.1 & Circ 19/2026</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lab Test Results (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">
                    Diagnostic Pathology
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Maternal Blood & Urine Screening
                  </h3>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  DOH STD App.1
                </span>
              </div>

              <div className="space-y-2.5">
                {patientLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 transition space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {lab.test}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="font-mono">{lab.date}</span>
                          <span>·</span>
                          <span className="capitalize text-slate-600 font-medium">{lab.category} Panel</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        lab.normalAbnormal === 'normal'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lab.normalAbnormal === 'borderline'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {lab.normalAbnormal}
                      </span>
                    </div>

                    <div className="pt-1 text-xs">
                      <span className="font-medium text-slate-800 bg-white px-2 py-1 rounded border border-slate-200/80 inline-block font-mono">
                        {lab.result}
                      </span>
                    </div>

                    {lab.notes && (
                      <p className="text-[11px] text-teal-800 bg-teal-50/80 p-2 rounded-lg border border-teal-100 flex items-center gap-1.5 mt-1">
                        <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{lab.notes}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vaccines & Prophylaxis (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
                    Immunizations & Regimens
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Vaccines & Prophylaxis
                  </h3>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                  Mandated Care
                </span>
              </div>

              <div className="space-y-3">
                {patientVaccines.map((vax) => (
                  <div
                    key={vax.id}
                    className={`p-3.5 rounded-xl border transition ${
                      vax.isCompleted
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{vax.name}</h4>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          Target Window: <strong className="text-slate-700">{vax.targetWindowWeeks}</strong>
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                        vax.isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {vax.isCompleted ? 'Completed' : 'Upcoming / Due'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      {vax.notes}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Source: {vax.source}</span>
                      {vax.dateGiven && <span>Given on: {vax.dateGiven}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 space-y-1">
                <span className="font-bold block">Key DOH Antenatal Schedule Milestones:</span>
                <p>• <strong>24–28w:</strong> 75g Oral Glucose Tolerance Test (OGTT)</p>
                <p>• <strong>28w:</strong> Repeat CBC & Antibody screen + TDAP + RSV + Anti-D (if Rh-)</p>
                <p>• <strong>36w:</strong> Group B Streptococcus (GBS) vaginal-rectal screening swab</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PREGNANCY EDUCATION & SAFETY (Section 13) */}
      {activeSubTab === 'education' && (
        <div className="space-y-6">
          {/* Critical Emergency Advice Callout (STD 3.4.1.14 & App.1) */}
          <div className="bg-gradient-to-r from-rose-900 to-rose-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg border border-rose-700/60 space-y-3">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>DOH Urgent Safety Rule: 24/7 Fetal Movements Advice</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold leading-snug">
              Notice a change, decrease, or stoppage in your baby's movements?
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-3xl">
              <strong>Do NOT wait until the next morning</strong> or your next scheduled scan. Fetal movement is the primary sign of baby wellbeing. Contact Maternity Triage or Dr. Tariq immediately at any hour of the day or night.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="tel:+97125551234"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-rose-800 rounded-xl font-bold text-xs shadow-md hover:bg-rose-50 transition min-h-[44px]"
              >
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>Call Maternity Triage (24/7): +971 (2) 555-1234</span>
              </a>
              <span className="text-[10px] text-rose-200">
                Source: DOH Antenatal Care Standard 3.4.1.14 & App.1
              </span>
            </div>
          </div>

          {/* Safe Sleep 28-Week Rule Banner (Section 13 Topic 19) */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Crucial Third-Trimester Guideline (From 28 Weeks)
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Sleep on Your Side to Safeguard Placental Perfusion
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Going to sleep on your back after 28 weeks compresses the inferior vena cava and restricts blood flow to your baby. Research shows going to sleep on your side (especially your left) reduces the risk of stillbirth by more than half.
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-900 font-mono text-[11px] font-bold shrink-0 self-start sm:self-auto">
              STD App.1 (28w)
            </span>
          </div>

          {/* Topic Filter Tabs */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  19 Antenatal Education & Counselling Topics
                </h3>
                <p className="text-xs text-slate-500">
                  Documented clinical consultations per DOH Standard 3.4.1.14
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
                {['all', 'lifestyle', 'screening', 'labour', 'postnatal', 'safety'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedEduCategory(cat)}
                    className={`py-1.5 px-3 rounded-lg capitalize whitespace-nowrap font-medium transition ${
                      selectedEduCategory === cat
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Education Topics */}
            <div className="space-y-2.5">
              {filteredEducation.map((item) => {
                const isExpanded = expandedEduTopic === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      item.discussed
                        ? 'border-emerald-200/90 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                    onClick={() => setExpandedEduTopic(isExpanded ? null : item.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          item.discussed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                            {item.topic}
                          </span>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span className="capitalize px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {item.category}
                            </span>
                            {item.discussed ? (
                              <span className="text-emerald-700 font-medium">
                                Discussed with {item.clinician} on {item.dateDiscussed}
                              </span>
                            ) : (
                              <span className="text-amber-700 font-medium">
                                Scheduled for upcoming visit
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {item.source}
                      </span>
                    </div>

                    {/* Detailed Guidance Expandable */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-2">
                        <p className="leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                          {item.guidanceText}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>DOH Requirement: {item.source}</span>
                          <span className="text-teal-700 font-medium">Documented in Maternal Record</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Log BP Modal */}
      {showBpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Log Blood Pressure</h3>
            <p className="text-xs text-slate-500 mb-4">Record home automated cuff readings.</p>

            <form onSubmit={handleAddBpLog} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Systolic (Top)
                  </label>
                  <input
                    type="number"
                    value={newSystolic}
                    onChange={(e) => setNewSystolic(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-center font-bold"
                    placeholder="120"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Diastolic (Bottom)
                  </label>
                  <input
                    type="number"
                    value={newDiastolic}
                    onChange={(e) => setNewDiastolic(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-center font-bold"
                    placeholder="80"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Pulse Rate (BPM)
                </label>
                <input
                  type="number"
                  value={newPulse}
                  onChange={(e) => setNewPulse(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-center font-bold"
                  placeholder="78"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBpModal(false)}
                  className="w-1/2 py-2.5 text-xs font-medium text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md min-h-[44px]"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
