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
import { ClinicalAlert, AuditLog } from '../types/clinical';
import { evaluatePatientRiskAndReferrals, ComprehensiveRiskAssessment } from '../utils/riskEngine';
import { calculateGestationalAge, parseDateIso } from '../utils/datingEngine';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Check, 
  X, 
  FileEdit, 
  RotateCcw, 
  ShieldCheck, 
  History, 
  Sliders, 
  Activity, 
  Sparkles,
  Info,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DoctorAlertPanelProps {
  activePatient?: PatientProfile;
  onSelectPatient?: (patient: PatientProfile) => void;
}

export const DoctorAlertPanel: React.FC<DoctorAlertPanelProps> = ({
  activePatient = PATIENT_SARAH,
  onSelectPatient
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(activePatient.id);
  
  // Custom simulator overrides for clinical test-bench
  const [customNtMm, setCustomNtMm] = useState<number>(0);
  const [customVpMm, setCustomVpMm] = useState<number>(0);
  const [customRenalPelvisMm, setCustomRenalPelvisMm] = useState<number>(0);
  const [customEchogenicBowel, setCustomEchogenicBowel] = useState<boolean>(false);
  const [customAfiCm, setCustomAfiCm] = useState<number>(14);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Override dialog state
  const [activeOverrideAlertId, setActiveOverrideAlertId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overridePreset, setOverridePreset] = useState<string>('Patient declined referral after comprehensive counselling');

  // Filter state for alerts
  const [alertFilter, setAlertFilter] = useState<'all' | 'open' | 'accepted' | 'overridden' | 'dismissed'>('all');

  // Persistent alert status map (keyed by alert ID)
  const [alertStatusMap, setAlertStatusMap] = useState<Record<string, { status: ClinicalAlert['status']; overrideReason?: string }>>({});

  // Audit log entries
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-init-1',
      user: DOCTOR_PROFILE.name,
      role: 'consultant',
      action: 'SYSTEM_EVALUATION',
      recordType: 'alert',
      recordId: 'DOH-CLINICAL-RULES-V1',
      timestamp: '2026-11-04T08:00:00Z',
      details: { summary: 'Automated DOH risk engine evaluation loaded for active cohort' }
    }
  ]);

  const currentPatient = DEMO_PATIENTS[selectedPatientId] || PATIENT_SARAH;
  const currentGa = calculateGestationalAge(currentPatient.eddDate, parseDateIso(CURRENT_SIMULATION_DATE));

  // Run Risk Engine for the current patient
  const assessment: ComprehensiveRiskAssessment = evaluatePatientRiskAndReferrals(
    currentPatient,
    [],
    {
      ntMm: customNtMm > 0 ? customNtMm : undefined,
      vpMm: customVpMm > 0 ? customVpMm : undefined,
      renalPelvisApMm: customRenalPelvisMm > 0 ? customRenalPelvisMm : undefined,
      echogenicBowel: customEchogenicBowel ? true : undefined,
      afiCm: customAfiCm !== 14 ? customAfiCm : undefined
    }
  );

  // Merge dynamic alerts with doctor's confirmed status
  const currentAlerts: ClinicalAlert[] = assessment.alerts.map(a => {
    const override = alertStatusMap[a.id];
    if (override) {
      return {
        ...a,
        status: override.status,
        overrideReason: override.overrideReason
      };
    }
    return a;
  });

  const filteredAlerts = currentAlerts.filter(a => {
    if (alertFilter === 'all') return true;
    return a.status === alertFilter;
  });

  const openCount = currentAlerts.filter(a => a.status === 'open').length;
  const criticalCount = currentAlerts.filter(a => a.severity === 'critical' && a.status === 'open').length;
  const warningCount = currentAlerts.filter(a => a.severity === 'warning' && a.status === 'open').length;

  const handlePatientSelect = (p: PatientProfile) => {
    setSelectedPatientId(p.id);
    if (onSelectPatient) {
      onSelectPatient(p);
    }
    // Reset simulator values when switching patient
    setCustomNtMm(0);
    setCustomVpMm(0);
    setCustomRenalPelvisMm(0);
    setCustomEchogenicBowel(false);
    setCustomAfiCm(14);
    setActiveOverrideAlertId(null);
  };

  const handleAcceptAlert = (alert: ClinicalAlert) => {
    setAlertStatusMap(prev => ({
      ...prev,
      [alert.id]: { status: 'accepted' }
    }));

    // Record in Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: DOCTOR_PROFILE.name,
      role: 'consultant',
      action: 'ALERT_ACCEPTED',
      recordType: 'alert',
      recordId: alert.id,
      timestamp: new Date().toISOString(),
      details: {
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        ruleId: alert.ruleId,
        source: alert.source,
        message: alert.message
      }
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleOpenOverrideModal = (alertId: string) => {
    setActiveOverrideAlertId(alertId);
    setOverrideReason(overridePreset);
  };

  const handleConfirmOverride = (alert: ClinicalAlert) => {
    const reasonToSave = overrideReason.trim() || overridePreset;
    setAlertStatusMap(prev => ({
      ...prev,
      [alert.id]: { 
        status: 'overridden', 
        overrideReason: reasonToSave 
      }
    }));

    // Record in Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: DOCTOR_PROFILE.name,
      role: 'consultant',
      action: 'ALERT_OVERRIDDEN',
      recordType: 'alert',
      recordId: alert.id,
      timestamp: new Date().toISOString(),
      details: {
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        ruleId: alert.ruleId,
        source: alert.source,
        overrideReason: reasonToSave
      }
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setActiveOverrideAlertId(null);
  };

  const handleDismissAlert = (alert: ClinicalAlert) => {
    setAlertStatusMap(prev => ({
      ...prev,
      [alert.id]: { status: 'dismissed' }
    }));

    // Record in Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: DOCTOR_PROFILE.name,
      role: 'consultant',
      action: 'ALERT_DISMISSED',
      recordType: 'alert',
      recordId: alert.id,
      timestamp: new Date().toISOString(),
      details: {
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        ruleId: alert.ruleId,
        source: alert.source,
        note: 'Clinician determined recommendation not currently applicable'
      }
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleResetAlert = (alertId: string) => {
    setAlertStatusMap(prev => {
      const next = { ...prev };
      delete next[alertId];
      return next;
    });
  };

  const demoPatientsList = [
    PATIENT_SARAH,
    PATIENT_NOURA,
    PATIENT_MARYAM,
    PATIENT_AISHA
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] uppercase tracking-wider border border-teal-500/30">
                DOH Abu Dhabi Clinical Decision Support
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Section 6 Risk Engine & Section 7 Referral Alerts
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              Doctor Alert Panel & Clinical Governance
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Provides real-time decision support based on DOH Antenatal Standards [STD App.1/2/3] and Ultrasound Guidelines [USG App.5/6]. Clinicians can Confirm, Override (with mandatory clinical rationale), or Dismiss each suggested action with full audit logging.
            </p>
          </div>

          {/* Alert Status Pills */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-center">
              <span className="text-xs font-bold text-rose-400 block font-mono leading-tight">{criticalCount}</span>
              <span className="text-[9px] uppercase tracking-wider text-rose-300 font-medium">Critical</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-center">
              <span className="text-xs font-bold text-amber-400 block font-mono leading-tight">{warningCount}</span>
              <span className="text-[9px] uppercase tracking-wider text-amber-300 font-medium">Warning</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-center">
              <span className="text-xs font-bold text-teal-300 block font-mono leading-tight">{openCount}</span>
              <span className="text-[9px] uppercase tracking-wider text-teal-200 font-medium">Pending</span>
            </div>
          </div>
        </div>

        {/* Demo Patient Fast Selector */}
        <div className="mt-5 pt-4 border-t border-slate-700/80">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Select Patient to Evaluate Clinical Alerts:
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
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-teal-700 text-white' : 'bg-slate-900 text-teal-300'
                    }`}>
                      {ga.weeks}w{ga.days}d
                    </span>
                  </div>
                  <div className="text-[10px] opacity-80 truncate mt-0.5">
                    {p.id === 'pt-sarah' && 'Low-risk routine'}
                    {p.id === 'pt-noura' && 'Placenta 14mm + CS'}
                    {p.id === 'pt-maryam' && 'MCDA Twins'}
                    {p.id === 'pt-aisha' && 'Age 41, BMI 37, PAPP-A'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Patient Clinical Summary Strip */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{currentPatient.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono">
              MRN: {currentPatient.mrn}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-semibold">
              {currentPatient.facility}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>GA: <strong className="text-slate-800">{currentGa.formatted}</strong></span>
            <span>EDD: <strong className="text-slate-800">{currentPatient.eddDate}</strong> ({currentPatient.eddMethod} Dating)</span>
            <span>Age: <strong className="text-slate-800">{currentPatient.age ?? 30}</strong></span>
            <span>BMI: <strong className="text-slate-800">{currentPatient.bmi ?? 24}</strong></span>
            <span>Parity: <strong className="text-slate-800">{currentPatient.fetalCount}</strong></span>
            <span>Pathway: <strong className="text-slate-800 uppercase text-[10px]">{assessment.highRisk.recommendedPathway.replace(/_/g, ' ')}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-600" />
            <span>{showSimulator ? 'Hide Test Simulator' : 'Simulate Scan Findings'}</span>
            {showSimulator ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive Scan Marker Simulator (For DOH Criteria Verification) */}
      {showSimulator && (
        <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                DOH Scan Findings & Biomarkers Test-Bench
              </span>
              <p className="text-[11px] text-teal-700">
                Adjust ultrasound parameters to test the real-time DOH Section 7 Fetal Medicine referral rules.
              </p>
            </div>
            <button
              onClick={() => {
                setCustomNtMm(0);
                setCustomVpMm(0);
                setCustomRenalPelvisMm(0);
                setCustomEchogenicBowel(false);
                setCustomAfiCm(14);
              }}
              className="text-[11px] text-teal-700 hover:text-teal-900 font-medium underline"
            >
              Reset to Patient Normal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* NT Simulator */}
            <div className="bg-white p-2.5 rounded-xl border border-teal-200/80">
              <label className="text-[10px] text-slate-600 block mb-1">
                Nuchal Translucency (NT)
                <span className="text-rose-600 font-semibold ml-1">(&ge; 3.0mm Alert)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="8"
                  value={customNtMm || ''}
                  placeholder="Normal (1.4 mm)"
                  onChange={(e) => setCustomNtMm(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                />
                <span className="text-slate-400 font-mono text-[11px]">mm</span>
              </div>
            </div>

            {/* Ventriculomegaly Simulator */}
            <div className="bg-white p-2.5 rounded-xl border border-teal-200/80">
              <label className="text-[10px] text-slate-600 block mb-1">
                Lateral Ventricle Vp
                <span className="text-rose-600 font-semibold ml-1">(&ge; 10mm Alert)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="20"
                  value={customVpMm || ''}
                  placeholder="Normal (6.5 mm)"
                  onChange={(e) => setCustomVpMm(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                />
                <span className="text-slate-400 font-mono text-[11px]">mm</span>
              </div>
            </div>

            {/* Renal Pelvis AP Simulator */}
            <div className="bg-white p-2.5 rounded-xl border border-teal-200/80">
              <label className="text-[10px] text-slate-600 block mb-1">
                Renal Pelvis AP
                <span className="text-amber-600 font-semibold ml-1">(&ge; 6mm &lt;28w, &ge; 10mm &ge;28w)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="25"
                  value={customRenalPelvisMm || ''}
                  placeholder="Normal (3.0 mm)"
                  onChange={(e) => setCustomRenalPelvisMm(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                />
                <span className="text-slate-400 font-mono text-[11px]">mm</span>
              </div>
            </div>

            {/* Echogenic Bowel */}
            <div className="bg-white p-2.5 rounded-xl border border-teal-200/80 flex flex-col justify-between">
              <label className="text-[10px] text-slate-600 block mb-1">
                Fetal Echogenic Bowel
                <span className="text-amber-600 font-semibold ml-1">(Bone density)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={customEchogenicBowel}
                  onChange={(e) => setCustomEchogenicBowel(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300"
                />
                <span>Simulate Echogenic Bowel</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Alert Cards Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Active Clinical Decision Support Alerts ({currentAlerts.length})
            </h3>
            <p className="text-xs text-slate-500">
              Department of Health Abu Dhabi Antenatal Protocols
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setAlertFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                alertFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({currentAlerts.length})
            </button>
            <button
              onClick={() => setAlertFilter('open')}
              className={`px-2.5 py-1 rounded-lg transition ${
                alertFilter === 'open' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Open ({openCount})
            </button>
            <button
              onClick={() => setAlertFilter('accepted')}
              className={`px-2.5 py-1 rounded-lg transition ${
                alertFilter === 'accepted' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setAlertFilter('overridden')}
              className={`px-2.5 py-1 rounded-lg transition ${
                alertFilter === 'overridden' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overridden
            </button>
            <button
              onClick={() => setAlertFilter('dismissed')}
              className={`px-2.5 py-1 rounded-lg transition ${
                alertFilter === 'dismissed' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dismissed
            </button>
          </div>
        </div>

        {/* Empty State for Low Risk (e.g. Sarah) */}
        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-950">
              No Clinical Action Alerts Pending for {currentPatient.name}
            </h4>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              This patient meets DOH Abu Dhabi Low-Risk Primary Care criteria. Continue standard 3-scan antenatal roadmap (Dating/NT, Detailed Anatomy, and 34–36w Growth Scan) with routine visit intervals.
            </p>
          </div>
        )}

        {/* Alert List */}
        <div className="space-y-3">
          {filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isOverridden = alert.status === 'overridden';
            const isAccepted = alert.status === 'accepted';
            const isDismissed = alert.status === 'dismissed';
            const isOpen = alert.status === 'open';

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border transition text-xs space-y-3 ${
                  isOverridden
                    ? 'bg-purple-50/50 border-purple-200'
                    : isAccepted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isDismissed
                    ? 'bg-slate-50 border-slate-200 opacity-70'
                    : isCritical
                    ? 'bg-rose-50/60 border-rose-200 ring-1 ring-rose-200'
                    : isWarning
                    ? 'bg-amber-50/60 border-amber-200 ring-1 ring-amber-200'
                    : 'bg-sky-50/60 border-sky-200'
                }`}
              >
                {/* Alert Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Severity Pill */}
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 ${
                      isCritical
                        ? 'bg-rose-600 text-white'
                        : isWarning
                        ? 'bg-amber-600 text-white'
                        : 'bg-sky-600 text-white'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      <span>{alert.severity}</span>
                    </span>

                    {/* DOH Source Citation */}
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[10px] text-slate-700 font-semibold">
                      Ref: {alert.source}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      Rule ID: {alert.ruleId}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    {isOpen && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                        Pending Clinician Action
                      </span>
                    )}
                    {isAccepted && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Confirmed by Dr. Tariq
                      </span>
                    )}
                    {isOverridden && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold text-[10px] flex items-center gap-1">
                        <FileEdit className="w-3 h-3 text-purple-600" />
                        Clinical Override Recorded
                      </span>
                    )}
                    {isDismissed && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold text-[10px]">
                        Dismissed
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="text-slate-800 leading-relaxed text-xs sm:text-sm font-medium">
                  {alert.message}
                </div>

                {/* Clinical Justification Note if Overridden */}
                {isOverridden && alert.overrideReason && (
                  <div className="p-3 rounded-xl bg-white border border-purple-200 text-xs text-purple-900 space-y-1">
                    <div className="font-semibold text-[11px] text-purple-800 flex items-center gap-1.5">
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Documented Clinician Clinical Override Justification:</span>
                    </div>
                    <p className="font-mono text-[11px] bg-purple-50/50 p-2 rounded-lg border border-purple-100">
                      "{alert.overrideReason}"
                    </p>
                    <div className="text-[10px] text-purple-600">
                      Recorded by Dr. Tariq Al-Hashimi (FRCOG, FMF UK) into patient audit trail.
                    </div>
                  </div>
                )}

                {/* Inline Override Input Modal */}
                {activeOverrideAlertId === alert.id && (
                  <div className="p-4 rounded-xl bg-white border border-amber-300 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <FileEdit className="w-4 h-4 text-amber-600" />
                        Clinical Override Reason (Mandatory under DOH Standards)
                      </span>
                      <button
                        onClick={() => setActiveOverrideAlertId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1 font-medium">
                        Select Standard Clinical Rationale:
                      </label>
                      <select
                        value={overridePreset}
                        onChange={(e) => {
                          setOverridePreset(e.target.value);
                          setOverrideReason(e.target.value);
                        }}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-slate-50"
                      >
                        <option value="Patient declined referral after comprehensive counselling">
                          Patient declined referral after comprehensive counselling
                        </option>
                        <option value="Repeat ultrasound conducted at external tertiary centre showed normal resolution">
                          Repeat ultrasound conducted at external tertiary centre showed normal resolution
                        </option>
                        <option value="Parental constitution and serial velocity within expected physiologic limits">
                          Parental constitution and serial velocity within expected physiologic limits
                        </option>
                        <option value="Multidisciplinary MFM consensus approved primary obstetrical surveillance">
                          Multidisciplinary MFM consensus approved primary obstetrical surveillance
                        </option>
                        <option value="Custom clinician clinical rationale (entered below)">
                          Custom clinician clinical rationale (entered below)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1 font-medium">
                        Clinician Notes & Specific Justification:
                      </label>
                      <textarea
                        rows={2}
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="Document exact medical reasoning for non-referral or variance..."
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setActiveOverrideAlertId(null)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmOverride(alert)}
                        className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-semibold text-xs transition"
                      >
                        Confirm Override & Save to Audit
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons for Clinician */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                  <div className="text-[10px] text-slate-500 italic">
                    Decision support recommendation. Final clinical decision rests with the treating doctor.
                  </div>

                  <div className="flex items-center gap-2">
                    {/* If open, show Accept, Override, Dismiss */}
                    {isOpen && (
                      <>
                        <button
                          onClick={() => handleAcceptAlert(alert)}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 transition active:scale-98 shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept & Confirm Action</span>
                        </button>

                        <button
                          onClick={() => handleOpenOverrideModal(alert.id)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 font-semibold text-xs flex items-center gap-1.5 transition active:scale-98 shadow-xs"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>Override with Reason</span>
                        </button>

                        <button
                          onClick={() => handleDismissAlert(alert)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>
                      </>
                    )}

                    {/* If already actioned, allow resetting to re-evaluate */}
                    {!isOpen && (
                      <button
                        onClick={() => handleResetAlert(alert.id)}
                        className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-open for Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DOH Clinical Audit Trail Section (Section 2 & Section 16) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-teal-600" />
              Clinical Governance & Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Immutable log of all clinical alerts, clinician acceptances, and override justifications.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            Audit Entries: {auditLogs.length}
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold uppercase ${
                    log.action === 'ALERT_ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : log.action === 'ALERT_OVERRIDDEN'
                      ? 'bg-purple-100 text-purple-800'
                      : log.action === 'ALERT_DISMISSED'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {log.action}
                  </span>
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {log.recordId}
                  </span>
                  {log.details?.patientName && (
                    <span className="text-slate-500 text-[10px]">
                      ({log.details.patientName})
                    </span>
                  )}
                </div>
                <div className="text-slate-600 text-[11px]">
                  {log.details?.overrideReason && (
                    <span className="italic text-purple-900 font-medium">
                      Justification: "{log.details.overrideReason}"
                    </span>
                  )}
                  {log.details?.message && (
                    <span className="truncate block max-w-xl text-slate-600">
                      {log.details.message}
                    </span>
                  )}
                  {log.details?.summary && (
                    <span className="text-slate-500">{log.details.summary}</span>
                  )}
                </div>
              </div>

              <div className="text-right sm:text-right text-[10px] text-slate-400 font-mono shrink-0">
                <div>{log.user}</div>
                <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
