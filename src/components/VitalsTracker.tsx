import React, { useState, useEffect } from 'react';
import { KickCounterSession, BloodPressureLog } from '../types';
import { INITIAL_KICK_SESSIONS, INITIAL_BP_LOGS } from '../data/mockData';
import { 
  Heart, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Play, 
  RotateCcw,
  Pill,
  Sparkles
} from 'lucide-react';

export const VitalsTracker: React.FC = () => {
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
    aspirin: true
  });

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
        notes: 'Target 10 kicks reached. Normal energetic fetal movements.'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
          Maternal & Fetal Vitals Monitoring
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Daily kick counting (Cardiff Count-to-10 protocol), blood pressure surveillance, and prenatal routine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium transition py-1 px-2 rounded-lg bg-slate-100"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Session</span>
                </button>
              )}
            </div>

            <p className="text-[10px] sm:text-[11px] text-slate-500 text-center max-w-sm mt-2 leading-relaxed">
              Lie comfortably on your left side. Tap the heart each time you feel a distinct kick or flutter.
            </p>
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
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Heart className="w-3.5 h-3.5" fill="currentColor" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {session.date} at {session.startTime}
                      </span>
                      <span className="text-[10px] text-slate-500">{session.notes}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-700 block">
                      10 kicks in {session.durationMinutes} min
                    </span>
                    <span className="text-[10px] text-slate-400">Normal Active Pattern</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Blood Pressure & Prenatal Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Blood Pressure & Preeclampsia Watch */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                  Preeclampsia Surveillance
                </span>
                <h3 className="text-base font-bold text-slate-900">
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-teal-700 uppercase font-semibold block">
                    Latest Measurement ({bpLogs[0].date})
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-slate-900">
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

            <p className="text-[11px] text-slate-400 italic">
              Threshold warning: Notify clinic if systolic ≥ 140 mmHg or diastolic ≥ 90 mmHg.
            </p>
          </div>

          {/* Daily Prenatal Supplements Routine */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Dr. Tariq's Prescription Protocol
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Today's Prenatal Supplements
            </h3>

            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Pill className="w-4 h-4 text-teal-600" />
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
                  <Pill className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Baby Aspirin 100mg (At Bedtime)</span>
                    <span className="text-[10px] text-slate-500">Preeclampsia prevention protocol</span>
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
                  <Pill className="w-4 h-4 text-blue-600" />
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
                  className="w-1/2 py-2 text-xs font-medium text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md"
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
