import React, { useState } from 'react';
import { 
  DEMO_PATIENTS, 
  PATIENT_SARAH, 
  PATIENT_NOURA, 
  PATIENT_MARYAM, 
  PATIENT_AISHA, 
  DOCTOR_PROFILE,
  CURRENT_SIMULATION_DATE 
} from '../data/mockData';
import { PatientProfile } from '../types';
import { 
  evaluateFollowUpProtocols, 
  validateScanInterval, 
  FollowUpProtocolEvaluation 
} from '../utils/followUpEngine';
import { calculateGestationalAge, parseDateIso } from '../utils/datingEngine';
import { 
  GitMerge, 
  Layers, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Check, 
  ChevronRight, 
  FileText, 
  Ban, 
  Sparkles,
  Info,
  Activity,
  ArrowRight
} from 'lucide-react';

interface FollowUpProtocolsPanelProps {
  activePatient?: PatientProfile;
  onSelectPatient?: (patient: PatientProfile) => void;
}

export const FollowUpProtocolsPanel: React.FC<FollowUpProtocolsPanelProps> = ({
  activePatient = PATIENT_NOURA,
  onSelectPatient
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(activePatient.id);
  
  // Interval Guard Interactive Tester (Section 10 / USG 6.7.1)
  const [testPrevScanDate, setTestPrevScanDate] = useState<string>('2026-10-25');
  const [testNewScanDate, setTestNewScanDate] = useState<string>('2026-11-04');
  const [testIsBiometry, setTestIsBiometry] = useState<boolean>(true);
  const [intervalOverrideReason, setIntervalOverrideReason] = useState<string>('');
  const [isOverrideSubmitted, setIsOverrideSubmitted] = useState<boolean>(false);

  const currentPatient = DEMO_PATIENTS[selectedPatientId] || PATIENT_NOURA;
  const currentGa = calculateGestationalAge(currentPatient.eddDate, parseDateIso(CURRENT_SIMULATION_DATE));

  const followUpData: FollowUpProtocolEvaluation = evaluateFollowUpProtocols(
    currentPatient,
    [],
    CURRENT_SIMULATION_DATE
  );

  const intervalResult = validateScanInterval(testPrevScanDate, testNewScanDate, testIsBiometry);

  const handlePatientSelect = (p: PatientProfile) => {
    setSelectedPatientId(p.id);
    if (onSelectPatient) {
      onSelectPatient(p);
    }
    setIsOverrideSubmitted(false);
  };

  const demoPatientsList = [
    PATIENT_NOURA,
    PATIENT_MARYAM,
    PATIENT_AISHA,
    PATIENT_SARAH
  ];

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-700/80 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider border border-teal-500/30">
                DOH Ultrasound Protocols
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-mono">
                Sections 8, 9 & 10 Guidelines
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-bold flex items-center gap-2">
              <GitMerge className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 shrink-0" />
              <span>Follow-Up Protocols & Placenta Pathway</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl leading-relaxed">
              Automates DOH follow-up schedules [USG App.4], placenta accreta surveillance [USG 6.5.4], and biometry safety spacing rules [USG 6.7.1].
            </p>
          </div>
        </div>

        {/* Patient Switcher */}
        <div className="mt-4 pt-3 border-t border-slate-700/80">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Select Patient to Inspect Active Protocols:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {demoPatientsList.map(p => {
              const isSelected = p.id === selectedPatientId;
              const ga = calculateGestationalAge(p.eddDate, parseDateIso(CURRENT_SIMULATION_DATE));
              return (
                <button
                  key={p.id}
                  onClick={() => handlePatientSelect(p)}
                  className={`p-2.5 rounded-xl text-left transition border ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-400 shadow-sm'
                      : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700/80 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="truncate">{p.name.split(' ')[0]}</span>
                    <span className={`text-[9px] sm:text-[10px] font-mono px-1 py-0.2 rounded ${
                      isSelected ? 'bg-teal-700 text-white' : 'bg-slate-900 text-teal-300'
                    }`}>
                      {ga.weeks}w{ga.days}d
                    </span>
                  </div>
                  <div className="text-[10px] opacity-80 truncate mt-0.5">
                    {p.id === 'pt-noura' && 'Placenta 14mm + CS'}
                    {p.id === 'pt-maryam' && 'MCDA Twins'}
                    {p.id === 'pt-aisha' && 'Serial Growth / Doppler'}
                    {p.id === 'pt-sarah' && 'Low-risk (Routine)'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 9: DOH Placenta Pathway Tracker (USG 6.5.4) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
                <span>Placenta Pathway & Accreta Surveillance (USG 6.5.4)</span>
              </h3>
              {followUpData.placentaPathway.isAccretaRisk && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                  Accreta Risk (PAS)
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Protocol for low-lying placenta (&lt; 20 mm from os) and scar implant surveillance.
            </p>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 self-start sm:self-auto">
            Ref: DOH USG 6.5.4
          </span>
        </div>

        {/* Narrative Clinical Summary */}
        <div className={`p-3 sm:p-4 rounded-xl text-xs space-y-1.5 ${
          followUpData.placentaPathway.isAccretaRisk
            ? 'bg-rose-50 border border-rose-200 text-rose-950'
            : followUpData.placentaPathway.isLowLying
            ? 'bg-amber-50 border border-amber-200 text-amber-950'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
            {followUpData.placentaPathway.isAccretaRisk ? (
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            ) : followUpData.placentaPathway.isLowLying ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{currentPatient.name}: {followUpData.placentaPathway.isLowLying ? 'Active Placenta Pathway' : 'Normal Placental Site'}</span>
          </div>
          <p className="text-[11px] sm:text-xs leading-relaxed opacity-90">
            {followUpData.placentaPathway.summary}
          </p>
        </div>

        {/* 4-Step Visual Pathway */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            DOH 4-Stage Clinical Pathway Progress:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {followUpData.placentaPathway.steps.map((step) => {
              const isPast = step.isCompleted;
              const isCurrent = step.isCurrent;
              return (
                <div
                  key={step.step}
                  className={`p-3 rounded-xl border text-xs space-y-2 flex flex-col justify-between transition ${
                    isCurrent
                      ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-200 shadow-xs'
                      : isPast
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-slate-200/80 opacity-75'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-100/70 px-1.5 py-0.2 rounded">
                        Step {step.step} · {step.timingWeeks}
                      </span>
                      {isPast ? (
                        <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Done
                        </span>
                      ) : isCurrent ? (
                        <span className="text-teal-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-teal-200/60 animate-pulse">
                          Current
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Upcoming</span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {step.event}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      {step.statusText}
                    </p>
                  </div>

                  {step.isMandatoryTvs && (
                    <div className="pt-1.5 border-t border-slate-100 text-[10px] font-semibold text-rose-700 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 shrink-0" />
                      <span>Mandatory TVS (USG 6.5.4.4)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 8: Auto-Scheduled Specialized Surveillance Scans (USG App.4) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
              <span>Auto-Scheduled Follow-Up Protocols (USG App.4)</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Protocolized ultrasound surveillance automatically mapped from risk factors and scan findings.
            </p>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600">
            {followUpData.autoScheduledScans.length} Protocol Scans Scheduled
          </span>
        </div>

        {followUpData.autoScheduledScans.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-semibold text-slate-800">
              No Additional Specialized Follow-Up Scans Required
            </p>
            <p className="text-[11px] text-slate-500">
              {currentPatient.name} follows standard 3-scan routine antenatal pathway (Dating/NT, Detailed Anatomy, and 34–36w Growth Scan).
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {followUpData.autoScheduledScans.map((scan) => (
              <div
                key={scan.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white transition text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {scan.title}
                    </span>
                    <div className="flex items-center gap-1">
                      {scan.cptCodes.map(code => (
                        <span key={code} className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-mono text-[10px] font-bold">
                          CPT {code}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="font-mono text-[11px] font-bold text-teal-800 bg-white border border-teal-200 px-2.5 py-0.5 rounded-lg self-start sm:self-auto">
                    Target: {scan.targetGestationalWeeks} Weeks ({scan.dueDateIso})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
                  <div>
                    <span className="text-slate-400">Clinical Indication: </span>
                    <strong className="text-slate-700">{scan.indication}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Frequency: </span>
                    <strong className="text-slate-700">{scan.frequency}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">DOH Guideline: </span>
                    <strong className="text-teal-700 font-mono">{scan.source}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 10: Scan Interval Safety Guard & Minimum 14-Day Biometry Check (USG 6.7.1) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
              <span>DOH Scan Interval Guard & Safety Blocker (USG 6.7.1)</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Enforces mandatory 14-day minimum spacing between repeat fetal biometry measurements.
            </p>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 self-start sm:self-auto">
            Ref: DOH USG 6.7.1
          </span>
        </div>

        {/* Interactive Interval Verification Simulator */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1 font-semibold">
                Previous Biometry Scan Date:
              </label>
              <input
                type="date"
                value={testPrevScanDate}
                onChange={(e) => {
                  setTestPrevScanDate(e.target.value);
                  setIsOverrideSubmitted(false);
                }}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1 font-semibold">
                Requested New Scan Date:
              </label>
              <input
                type="date"
                value={testNewScanDate}
                onChange={(e) => {
                  setTestNewScanDate(e.target.value);
                  setIsOverrideSubmitted(false);
                }}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1 font-semibold">
                Scan Type:
              </label>
              <select
                value={testIsBiometry ? 'biometry' : 'limited'}
                onChange={(e) => setTestIsBiometry(e.target.value === 'biometry')}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
              >
                <option value="biometry">Fetal Biometry / Growth Scan (CPT 76816/76805)</option>
                <option value="limited">Limited Scan / Fluid Only (CPT 76815)</option>
              </select>
            </div>
          </div>

          {/* Validation Result Box */}
          <div className={`p-3 rounded-xl border text-xs space-y-2 ${
            intervalResult.isBlocked
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                {intervalResult.isBlocked ? (
                  <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>
                  {intervalResult.isBlocked
                    ? `BLOCKED: Interval < 14 Days (${intervalResult.daysDiff} days detected)`
                    : `APPROVED: Spacing >= 14 Days (${intervalResult.daysDiff} days detected)`}
                </span>
              </div>
              <span className="font-mono text-[10px] opacity-75">
                {intervalResult.source}
              </span>
            </div>

            <p className="text-[11px] leading-relaxed">
              {intervalResult.message}
            </p>

            {/* Clinician Override for Blocked Interval */}
            {intervalResult.isBlocked && !isOverrideSubmitted && (
              <div className="pt-2 border-t border-rose-200/80 space-y-2">
                <label className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
                  Clinician Justification for Early Scan Override:
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={intervalOverrideReason}
                    onChange={(e) => setIntervalOverrideReason(e.target.value)}
                    placeholder="e.g. Acute clinical suspicion of oligohydramnios / reduced fetal movements"
                    className="flex-1 p-2 rounded-lg border border-rose-300 text-xs bg-white text-slate-800"
                  />
                  <button
                    onClick={() => setIsOverrideSubmitted(true)}
                    className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs whitespace-nowrap transition active:scale-98 shadow-xs"
                  >
                    Authorize Clinical Override
                  </button>
                </div>
              </div>
            )}

            {isOverrideSubmitted && (
              <div className="p-2 rounded-lg bg-white border border-purple-200 text-purple-900 font-medium text-[11px] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Override authorized by Dr. Tariq Al-Hashimi: "{intervalOverrideReason || 'Acute clinical indication documented'}" (Logged to audit trail).</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
