import React, { useState } from 'react';
import { 
  DOCTOR_PROFILE, 
  UPCOMING_APPOINTMENTS, 
  DEMO_PATIENTS, 
  PATIENT_SARAH,
  PATIENT_NOURA,
  PATIENT_MARYAM,
  PATIENT_AISHA,
  CURRENT_SIMULATION_DATE,
  DEMO_COMPLETED_VISITS
} from '../data/mockData';
import { PatientProfile } from '../types';
import { 
  calculateGestationalAge, 
  parseDateIso, 
  evaluateGestationalDating,
  calculateGaDaysFromCrl,
  calculateGaDaysFromHc,
  calculateEddFromScanGaDays,
  calculateEddFromIvf,
  calculateEddFromLmp
} from '../utils/datingEngine';
import { 
  generateAntenatalVisitSchedule, 
  GeneratedVisitItem 
} from '../utils/visitScheduleGenerator';
import { CLINICAL_RULES } from '../config/clinicalRules';
import { DoctorAlertPanel } from './DoctorAlertPanel';
import { FollowUpProtocolsPanel } from './FollowUpProtocolsPanel';
import { AnatomyChecklistConsole } from './AnatomyChecklistConsole';
import { LabsAndEducationPanel } from './LabsAndEducationPanel';
import { KpiDashboard } from './KpiDashboard';
import { ConsentAndAuditManager } from './ConsentAndAuditManager';
import { evaluatePatientRiskAndReferrals } from '../utils/riskEngine';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  ShieldAlert,
  Upload, 
  CheckCircle, 
  Clock, 
  Search, 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  AlertOctagon, 
  Lock, 
  ArrowRight, 
  ClipboardCheck, 
  FileText, 
  AlertCircle, 
  Check, 
  Stethoscope, 
  GitMerge, 
  FlaskConical,
  BarChart3
} from 'lucide-react';

interface DoctorAdminPortalProps {
  activePatient?: PatientProfile;
  onSelectPatient?: (patient: PatientProfile) => void;
}

export const DoctorAdminPortal: React.FC<DoctorAdminPortalProps> = ({
  activePatient = PATIENT_SARAH,
  onSelectPatient
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'alerts' | 'protocols' | 'anatomy' | 'labs_edu' | 'kpi_dashboard' | 'consent_audit' | 'visits' | 'high_risk' | 'dating_engine' | 'upload'>('schedule');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(activePatient.id);

  // Active patient object
  const currentPatient = DEMO_PATIENTS[selectedPatientId] || PATIENT_SARAH;
  const currentGa = calculateGestationalAge(currentPatient.eddDate, parseDateIso(CURRENT_SIMULATION_DATE));

  // Risk Engine evaluation for active patient
  const activeAssessment = evaluatePatientRiskAndReferrals(currentPatient);
  const activeAlertCount = activeAssessment.alerts.length;

  // Cohort total open alerts
  const cohortAlertsCount = [PATIENT_SARAH, PATIENT_NOURA, PATIENT_MARYAM, PATIENT_AISHA].reduce((acc, p) => {
    return acc + evaluatePatientRiskAndReferrals(p).alerts.length;
  }, 0);

  // Visits & Checklists state (Section 4 + CIRC 19/2026)
  const [completedVisitsState, setCompletedVisitsState] = useState<Record<string, Record<string, any>>>(DEMO_COMPLETED_VISITS);
  const [selectedVisitId, setSelectedVisitId] = useState<string>('19_23w');
  
  // Active visit form state
  const [visitBp, setVisitBp] = useState<string>('118/74');
  const [visitWeight, setVisitWeight] = useState<string>('64.2');
  const [visitUrine, setVisitUrine] = useState<string>('NAD (Protein Nil, Glucose Nil)');
  const [visitSfh, setVisitSfh] = useState<string>('22');
  const [visitNotes, setVisitNotes] = useState<string>('');
  const [tickedChecklist, setTickedChecklist] = useState<Record<string, boolean>>({});
  const [signSuccess, setSignSuccess] = useState<boolean>(false);

  // Dating Engine Interactive State
  const [datingLmp, setDatingLmp] = useState<string>('2026-05-31');
  const [datingLmpCertain, setDatingLmpCertain] = useState<boolean>(true);
  const [datingCycleLength, setDatingCycleLength] = useState<number>(28);
  const [datingConception, setDatingConception] = useState<'natural' | 'ivf'>('natural');
  const [datingIvfDate, setDatingIvfDate] = useState<string>('2026-06-14');
  const [datingScanDate, setDatingScanDate] = useState<string>(CURRENT_SIMULATION_DATE);
  const [datingCrl, setDatingCrl] = useState<number>(62.4);
  const [datingHc, setDatingHc] = useState<number>(0);
  const [datingHasPrior1stTri, setDatingHasPrior1stTri] = useState<boolean>(false);
  const [datingEddLocked, setDatingEddLocked] = useState<boolean>(false);


  // Generated schedule for active patient
  const patientCompletedVisits = completedVisitsState[currentPatient.id] || {};
  const visitSchedule = generateAntenatalVisitSchedule(currentPatient, patientCompletedVisits);
  const currentInspectedVisit = visitSchedule.find(v => v.id === selectedVisitId) || visitSchedule[0];

  // Evaluate Dating Engine in real-time
  const datingResult = evaluateGestationalDating({
    lmpIso: datingLmp,
    lmpCertain: datingLmpCertain,
    cycleLengthDays: datingCycleLength,
    conceptionType: datingConception,
    oocyteRetrievalDateIso: datingIvfDate,
    scanDateIso: datingScanDate,
    fetuses: [
      {
        crlMm: datingCrl > 0 ? datingCrl : undefined,
        hcMm: datingHc > 0 ? datingHc : undefined
      }
    ],
    hasFirstTrimesterScanAlready: datingHasPrior1stTri,
    isEddLocked: datingEddLocked
  });

  const demoPatientsList = [
    PATIENT_SARAH,
    PATIENT_NOURA,
    PATIENT_MARYAM,
    PATIENT_AISHA
  ];

  const handlePatientSelect = (p: PatientProfile) => {
    setSelectedPatientId(p.id);
    if (onSelectPatient) {
      onSelectPatient(p);
    }
    // Pre-fill dating engine test bench with this patient
    setDatingLmp(p.lmpDate);
    setDatingLmpCertain(p.lmpCertain ?? true);
    setDatingCycleLength(p.cycleLengthDays ?? 28);
    setDatingConception(p.conceptionType ?? 'natural');
    if (p.oocyteRetrievalDate) setDatingIvfDate(p.oocyteRetrievalDate);
    setDatingEddLocked(p.eddLocked ?? true);

    // Default inspected visit based on patient GA
    const sched = generateAntenatalVisitSchedule(p, completedVisitsState[p.id] || {});
    const activeV = sched.find(v => v.status === 'current') || sched[0];
    setSelectedVisitId(activeV.id);
  };

  const handleToggleChecklistItem = (itemText: string) => {
    setTickedChecklist(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  const handleSignVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignSuccess(true);

    // Save into completed visits state
    setCompletedVisitsState(prev => {
      const patientVisits = prev[currentPatient.id] || {};
      return {
        ...prev,
        [currentPatient.id]: {
          ...patientVisits,
          [selectedVisitId]: {
            dateDone: CURRENT_SIMULATION_DATE,
            clinician: DOCTOR_PROFILE.name,
            vitals: {
              bp: visitBp,
              weightKg: parseFloat(visitWeight),
              urineDipstick: visitUrine,
              sfhCm: parseFloat(visitSfh)
            },
            notes: visitNotes,
            tickedItems: Object.keys(tickedChecklist).filter(k => tickedChecklist[k])
          }
        }
      };
    });

    setTimeout(() => setSignSuccess(false), 3000);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Clinic Doctor Header */}
      <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-teal-400 font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Clinician Workplace · Dr. Tariq Al-Hashimi</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-display font-bold">
            Maternal-Fetal Medicine Command Desk
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            Mediclinic City Hospital (DHCC) & Advanced Fetal Medicine Centre (Abu Dhabi)
          </p>
        </div>

        {/* View mode indicator: horizontally scrollable flex on mobile */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 bg-slate-800 rounded-xl text-[10px] sm:text-xs w-full shrink-0">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center shrink-0 ${
              activeTab === 'schedule' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Daily Scans ({UPCOMING_APPOINTMENTS.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center flex items-center justify-center gap-1.5 shrink-0 ${
              activeTab === 'alerts' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Alerts & Risk</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
              activeTab === 'alerts' ? 'bg-white text-amber-900' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {cohortAlertsCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'protocols' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <GitMerge className="w-3 h-3 text-teal-300" />
            <span>Follow-Up & Placenta</span>
          </button>
          <button
            onClick={() => setActiveTab('anatomy')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'anatomy' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-teal-300" />
            <span>Anatomy 23-pt Checklist</span>
          </button>
          <button
            onClick={() => setActiveTab('labs_edu')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'labs_edu' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3 h-3 text-teal-300" />
            <span>Labs & Education</span>
          </button>
          <button
            onClick={() => setActiveTab('kpi_dashboard')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'kpi_dashboard' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3 h-3 text-teal-300" />
            <span>KPI Dashboard (16)</span>
          </button>
          <button
            onClick={() => setActiveTab('consent_audit')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'consent_audit' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-teal-300" />
            <span>Consent & Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'visits' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-3 h-3 text-teal-300" />
            <span>Visits & Checklists</span>
          </button>
          <button
            onClick={() => setActiveTab('high_risk')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center shrink-0 ${
              activeTab === 'high_risk' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Patient Cohort (4)
          </button>
          <button
            onClick={() => setActiveTab('dating_engine')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'dating_engine' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calculator className="w-3 h-3 text-teal-300" />
            <span>Dating Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-2.5 rounded-lg transition font-medium whitespace-nowrap text-center shrink-0 ${
              activeTab === 'upload' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Publish Sonogram
          </button>
        </div>
      </div>

      {/* Tab 1: Daily Scans & Clinic Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Scheduled Ultrasound Appointments ({CURRENT_SIMULATION_DATE})
              </h3>
              <p className="text-xs text-slate-500">
                {UPCOMING_APPOINTMENTS.length} Confirmed Scans · Mediclinic City Hospital, Suite 204
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                GE Voluson E10 PACS Ready
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {UPCOMING_APPOINTMENTS.map((apt) => {
              const currentAptPatient = demoPatientsList.find(p => p.id === selectedPatientId) || PATIENT_SARAH;
              const gaForApt = calculateGestationalAge(currentAptPatient.eddDate, parseDateIso(apt.date));
              return (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex flex-col items-center justify-center font-mono font-bold shrink-0">
                      <span className="text-[11px]">{apt.time.split(' ')[0]}</span>
                      <span className="text-[8px] uppercase">{apt.time.split(' ')[1]}</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {currentAptPatient.name}
                        </span>
                        <span className="text-[10px] text-teal-700 bg-teal-100/60 font-semibold px-2 py-0.5 rounded">
                          Target GA: {gaForApt.formatted}
                        </span>
                      </div>
                      <span className="text-slate-700 font-medium block">{apt.title}</span>
                      <span className="text-slate-400 text-[11px]">
                        {apt.clinic} · Duration: {apt.durationMinutes} mins · {apt.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[11px]">
                      {apt.insurancePreAuth.status}
                    </span>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
                    >
                      Open PACS Console
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: DOH Clinical Decision Support Alerts & Risk Engine (Section 6 & 7) */}
      {activeTab === 'alerts' && (
        <DoctorAlertPanel
          activePatient={currentPatient}
          onSelectPatient={handlePatientSelect}
        />
      )}

      {/* Tab: DOH Follow-Up Protocols & Placenta Pathway (Sections 8, 9 & 10) */}
      {activeTab === 'protocols' && (
        <FollowUpProtocolsPanel
          activePatient={currentPatient}
          onSelectPatient={handlePatientSelect}
        />
      )}

      {/* Tab: DOH Detailed Anatomy 23-point Checklist (Section 11 / USG App.3) */}
      {activeTab === 'anatomy' && (
        <AnatomyChecklistConsole
          activePatient={currentPatient}
          onSelectPatient={handlePatientSelect}
        />
      )}

      {/* Tab: DOH Laboratory Panels & Education Tracker (Sections 12 & 13) */}
      {activeTab === 'labs_edu' && (
        <LabsAndEducationPanel
          activePatient={currentPatient}
          onSelectPatient={handlePatientSelect}
        />
      )}

      {/* Tab: DOH Quality KPIs Dashboard (Section 15 / STD App.4) */}
      {activeTab === 'kpi_dashboard' && (
        <KpiDashboard />
      )}

      {/* Tab: DOH Screening Consents, Audit & Security Compliance (Section 16) */}
      {activeTab === 'consent_audit' && (
        <ConsentAndAuditManager currentClinicianRole="Consultant OB/GYN" />
      )}

      {/* Tab 2: Antenatal Visits & Checklists Manager (Section 4 + CIRC 19/2026) */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          {/* Patient Selector Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Antenatal Care Visit Management & Protocol Checklists
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                  {currentPatient.name} ({currentGa.formatted})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard antenatal schedule generated from locked EDD ({currentPatient.eddDate}). Tracks DOH Circular 19/2026 mandatory visits.
              </p>
            </div>

            {/* Quick Patient Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Active Patient:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  const p = demoPatientsList.find(item => item.id === e.target.value);
                  if (p) handlePatientSelect(p);
                }}
                className="py-1.5 px-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
              >
                {demoPatientsList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({calculateGestationalAge(p.eddDate, parseDateIso(CURRENT_SIMULATION_DATE)).formatted})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DOH Circular 19/2026 5 Mandatory Visits Compliance Strip */}
          <div className="p-4 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-teal-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                DOH Circular 19/2026: Mandatory 5 Antenatal Visits Audit Tracker
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                Mandatory Regulatory Adherence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {visitSchedule.filter(v => v.isMandatory).map((mVisit) => (
                <div
                  key={mVisit.id}
                  onClick={() => setSelectedVisitId(mVisit.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition ${
                    mVisit.status === 'completed'
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : mVisit.status === 'current'
                      ? 'bg-teal-900/80 border-teal-400 text-white ring-1 ring-teal-400'
                      : mVisit.status === 'overdue'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>Visit #{mVisit.mandatoryVisitIndex}</span>
                    <span>{mVisit.windowLabel}</span>
                  </div>
                  <span className="font-semibold text-[11px] block truncate mt-0.5">
                    {mVisit.title.split(' ')[0]} {mVisit.title.split(' ')[1]}
                  </span>
                  <div className="mt-1 flex items-center justify-between text-[9px]">
                    <span className="capitalize">{mVisit.status}</span>
                    {mVisit.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {mVisit.status === 'overdue' && <AlertOctagon className="w-3 h-3 text-rose-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visits Grid: Left List (4 cols) & Right Active Visit Checklist/Form (8 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: All 10 Visits List (4 cols) */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Antenatal Visits Schedule (10 Visits):
              </span>

              <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
                {visitSchedule.map((visit) => {
                  const isSelected = visit.id === selectedVisitId;
                  return (
                    <div
                      key={visit.id}
                      onClick={() => setSelectedVisitId(visit.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer text-xs space-y-1 ${
                        isSelected
                          ? 'border-teal-600 ring-2 ring-teal-200 bg-teal-50/60'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs">{visit.title}</span>
                          {visit.isMandatory && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                              M#{visit.mandatoryVisitIndex}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 font-semibold">
                          {visit.windowLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Window: {visit.startDateIso} to {visit.endDateIso}</span>
                        <span className={`font-semibold capitalize text-[10px] px-2 py-0.5 rounded ${
                          visit.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : visit.status === 'current'
                            ? 'bg-teal-600 text-white'
                            : visit.status === 'overdue' && visit.isMandatory
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {visit.status === 'overdue' && visit.isMandatory ? 'Overdue Mandatory' : visit.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Visit Details, Checklist & Vitals Sign-off (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {currentInspectedVisit.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                      {currentInspectedVisit.windowLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {currentInspectedVisit.clinicalDescription}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-teal-800 bg-white px-2 py-1 rounded border border-teal-200 shrink-0">
                  Ref: {currentInspectedVisit.source}
                </span>
              </div>

              {/* Automated Actions Banner */}
              {currentInspectedVisit.autoActions.length > 0 && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80 space-y-1 text-xs">
                  <span className="font-bold text-teal-950 text-[11px] block">
                    Mandated Actions & Automatic Decision Support:
                  </span>
                  {currentInspectedVisit.autoActions.map((act, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-teal-900">
                      <span className="text-teal-600 font-bold">→</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Primary Care Transfer Alert (28-32w) */}
              {currentInspectedVisit.id === '32w' && currentPatient.carePathway === 'low_risk_primary' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Primary Care Transfer Protocol (DOH STD 3.4.1.16.2):</span>
                    <span>All low-risk pregnancies must have antenatal care transferred to hospital/obstetrician between 28 and 32 weeks.</span>
                  </div>
                </div>
              )}

              {/* Protocol Checklist (STD App.1) */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Clinical Examination & Discussion Checklist:
                </span>

                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                  {currentInspectedVisit.checklist.map((c, i) => {
                    const isTicked = tickedChecklist[c.item] ?? c.isDone;
                    return (
                      <label key={i} className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={isTicked}
                          onChange={() => handleToggleChecklistItem(c.item)}
                          className="w-4 h-4 text-teal-600 rounded mt-0.5 border-slate-300"
                        />
                        <span className={isTicked ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                          {c.item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Vitals Form */}
              <form onSubmit={handleSignVisit} className="space-y-3 pt-1">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Mandatory Antenatal Vitals (From 11w):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">BP (mmHg)</label>
                    <input
                      type="text"
                      value={visitBp}
                      onChange={(e) => setVisitBp(e.target.value)}
                      placeholder="118/74"
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={visitWeight}
                      onChange={(e) => setVisitWeight(e.target.value)}
                      placeholder="64.2"
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Urine Dipstick</label>
                    <select
                      value={visitUrine}
                      onChange={(e) => setVisitUrine(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="NAD (Protein Nil, Glucose Nil)">NAD (Nil/Nil)</option>
                      <option value="Protein Trace">Trace Protein</option>
                      <option value="Protein 1+ (PET Alert)">Protein 1+ (Alert)</option>
                      <option value="Glucose 1+">Glucose 1+</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">SFH (cm, 28w+)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={visitSfh}
                      onChange={(e) => setVisitSfh(e.target.value)}
                      placeholder="28"
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Clinician Notes & Care Plan</label>
                  <input
                    type="text"
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    placeholder="e.g. Fetal movements normal. GDM screening planned. Patient reassured."
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>

                {signSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Visit successfully signed by Dr. Tariq Al-Hashimi and saved to medical record!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition active:scale-98 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Sign & Complete {currentInspectedVisit.title}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: High-Risk Radar & Demo Patient Cohort (Section 17) */}
      {activeTab === 'high_risk' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Active Antenatal Patient Cohort (DOH Demo Cohort)
              </h3>
              <p className="text-xs text-slate-500">
                Gestational ages calculated in real-time from locked EDD and simulated date ({CURRENT_SIMULATION_DATE}).
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Click patient card to select for Mother View
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoPatientsList.map((p) => {
              const patientGa = calculateGestationalAge(p.eddDate, parseDateIso(CURRENT_SIMULATION_DATE));
              const isSelected = p.id === selectedPatientId;
              return (
                <div
                  key={p.id}
                  onClick={() => handlePatientSelect(p)}
                  className={`p-4 rounded-2xl border transition cursor-pointer text-xs space-y-3 ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-200 bg-teal-50/40 shadow-sm'
                      : 'border-slate-200/80 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[9px] font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono">
                        MRN: {p.mrn} · {p.facility}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-2.5 py-1 rounded-lg font-mono">
                        {patientGa.formatted}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        EDD: {p.eddDate}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Care Pathway:</span>
                      <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
                        {p.carePathway?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Conception & Dating:</span>
                      <span className="text-slate-700">
                        {p.conceptionType === 'ivf' ? 'IVF / ART' : 'Natural'} · {p.eddMethod} Dating (Locked)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Maternal Stats:</span>
                      <span className="text-slate-700">
                        Age {p.age ?? 30} · BMI {p.bmi ?? 24} · {p.bloodGroup}
                      </span>
                    </div>
                  </div>

                  {/* Clinical flags */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      DOH Clinical Flags & Surveillance:
                    </span>
                    {p.highRiskFactors.length > 0 ? (
                      <div className="space-y-1">
                        {p.highRiskFactors.map((f, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                            <span className="text-amber-500">•</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Low-Risk Routine Antenatal Pathway (Standard 3 scans)</span>
                      </div>
                    )}
                  </div>

                  {/* DOH Alert Quick Access */}
                  {(() => {
                    const pAssessment = evaluatePatientRiskAndReferrals(p);
                    const pAlertCount = pAssessment.alerts.length;
                    return (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          pAlertCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {pAlertCount > 0 ? `${pAlertCount} Clinical Alert(s)` : '0 Alerts (Routine)'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePatientSelect(p);
                            setActiveTab('alerts');
                          }}
                          className="text-[10px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
                        >
                          <span>Review Alerts</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: DOH Dating Engine & Decision Support Simulator (Section 3 + USG App.2) */}
      {activeTab === 'dating_engine' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-600" />
                DOH Gestational Dating Decision Support Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Implements Robinson CRL formula, HC regression, IVF 266-day rule, and DOH discrepancy threshold re-dating (USG App.2).
              </p>
            </div>
            <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Ref: DOH USG App.2
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Conception Type */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Conception Type
                  </label>
                  <select
                    value={datingConception}
                    onChange={(e) => setDatingConception(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="natural">Natural Conception</option>
                    <option value="ivf">Assisted Reproduction (IVF / ART)</option>
                  </select>
                </div>

                {/* IVF Date or LMP */}
                {datingConception === 'ivf' ? (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Oocyte Retrieval Date
                    </label>
                    <input
                      type="date"
                      value={datingIvfDate}
                      onChange={(e) => setDatingIvfDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Last Menstrual Period (LMP)
                    </label>
                    <input
                      type="date"
                      value={datingLmp}
                      onChange={(e) => setDatingLmp(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* LMP Certainty & Cycle Length */}
              {datingConception === 'natural' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="lmpCertain"
                      checked={datingLmpCertain}
                      onChange={(e) => setDatingLmpCertain(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <label htmlFor="lmpCertain" className="font-medium text-slate-700">
                      LMP is certain & regular
                    </label>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Cycle Length (Days, default 28)
                    </label>
                    <input
                      type="number"
                      min={21}
                      max={45}
                      value={datingCycleLength}
                      onChange={(e) => setDatingCycleLength(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Ultrasound Scan Parameters */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                <span className="font-bold text-slate-800 block text-xs">
                  Current Ultrasound Biometry Input
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Scan Date</label>
                    <input
                      type="date"
                      value={datingScanDate}
                      onChange={(e) => setDatingScanDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">
                      Crown-Rump Length (CRL mm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={84}
                      value={datingCrl}
                      onChange={(e) => {
                        setDatingCrl(Number(e.target.value));
                        if (Number(e.target.value) > 0) setDatingHc(0);
                      }}
                      placeholder="e.g. 62.4"
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                    <span className="text-[10px] text-slate-400">Up to 84 mm (~14w)</span>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">
                      Head Circumference (HC mm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={datingHc}
                      onChange={(e) => {
                        setDatingHc(Number(e.target.value));
                        if (Number(e.target.value) > 0) setDatingCrl(0);
                      }}
                      placeholder="e.g. 201.8"
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                    <span className="text-[10px] text-slate-400">When CRL &gt; 84 mm</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={datingHasPrior1stTri}
                      onChange={(e) => setDatingHasPrior1stTri(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-slate-700">First-trimester scan already established</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={datingEddLocked}
                      onChange={(e) => setDatingEddLocked(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-slate-700">EDD finalized & locked at 11–14w</span>
                  </label>
                </div>
              </div>

              {/* DOH Reference Table */}
              <div className="text-[11px] text-slate-500 bg-teal-50/50 p-3 rounded-xl border border-teal-100 space-y-1">
                <span className="font-semibold text-teal-900 block">
                  DOH Re-dating Threshold Criteria (USG App.2):
                </span>
                <p>• &le; 13+6w (CRL): Re-date if discrepancy &gt; 5 days</p>
                <p>• 14–16w (HC): Re-date if discrepancy &gt; 7 days (if no 1st trimester scan)</p>
                <p>• 17–22w (HC): Re-date if discrepancy &gt; 10 days (if no 1st trimester scan)</p>
                <p>• 22–28w: Re-date if discrepancy &gt; 14 days (if no 1st trimester scan)</p>
                <p>• &ge; 28w: Discrepancy &gt; 21 days &rarr; Re-date with critical growth restriction warning & repeat in 2–3w</p>
              </div>
            </div>

            {/* Decision Support Evaluation Output (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-5 shadow-lg space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
                <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                  Engine Evaluation
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                  {datingResult.source}
                </span>
              </div>

              {/* Recommended EDD */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Recommended Assigned EDD
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono text-white">
                    {datingResult.recommendedEdd}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold text-[11px]">
                    Method: {datingResult.eddMethod}
                  </span>
                </div>
              </div>

              {/* Discrepancy details */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">LMP to Ultrasound Discrepancy:</span>
                  <span className={`font-mono font-bold ${
                    Math.abs(datingResult.discrepancyDays) > 5 ? 'text-amber-400' : 'text-teal-300'
                  }`}>
                    {datingResult.discrepancyDays > 0 ? `+${datingResult.discrepancyDays}` : datingResult.discrepancyDays} days
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Re-dating Recommendation:</span>
                  <span className={`font-semibold ${
                    datingResult.shouldReDate ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {datingResult.shouldReDate ? 'RE-DATE TO ULTRASOUND' : 'MAINTAIN CURRENT DATING'}
                  </span>
                </div>
              </div>

              {/* Clinical rationale */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Decision Support Rationale:
                </span>
                <p className="text-slate-200 text-xs leading-relaxed bg-black/20 p-2.5 rounded-lg border border-white/5">
                  {datingResult.reDateReason}
                </p>
              </div>

              {/* Critical Alert Warning */}
              {datingResult.warningAlert && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{datingResult.warningAlert}</span>
                </div>
              )}

              {/* Lock status */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>EDD Lock: {datingEddLocked ? 'Finalized (11–14w)' : 'Unlocked'}</span>
                </span>
                <span>DOH Antenatal Care Standard</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Sonogram Console & DICOM Publishing */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ultrasound Sonogram Publishing Console
              </h3>
              <p className="text-xs text-slate-500">
                Publish validated 2D/3D clips, biometrics, and clinical impressions to patient mobile vault.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
              DICOM 3.0 Standard
            </span>
          </div>

          <form onSubmit={handleSimulateUpload} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Target Patient
                </label>
                <select 
                  value={selectedPatientId}
                  onChange={(e) => {
                    const p = demoPatientsList.find(item => item.id === e.target.value);
                    if (p) handlePatientSelect(p);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {demoPatientsList.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn}) · {p.facility}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ultrasound Procedure & CPT Code
                </label>
                <select className="w-full p-2.5 rounded-xl border border-slate-300 bg-white">
                  <option>CPT 76811 - Detailed Structural Anatomy Scan (18–22w)</option>
                  <option>CPT 76801 + 76813 - First Trimester Dating & NT Scan (11–13+6w)</option>
                  <option>CPT 76805 - Third Trimester Growth Scan (34–36w)</option>
                  <option>CPT 76816 + 76820 - Serial Growth & Doppler Velocimetry</option>
                  <option>CPT 76817 - Transvaginal Cervical Length Assessment</option>
                  <option>CPT 76825 - Specialized Fetal Echocardiogram</option>
                  <option>CPT 76815 - 3D/4D HD-Live Elective Keepsake</option>
                </select>
              </div>
            </div>

            {/* Biometric Measurement Inputs */}
            <div>
              <span className="font-semibold text-slate-700 block mb-2">
                Biometric Measurements (Hadlock Standard)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">BPD (mm)</span>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue="54.2"
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">HC (mm)</span>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue="201.8"
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">AC (mm)</span>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue="178.4"
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">FL (mm)</span>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue="38.6"
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">FHR (bpm)</span>
                  <input
                    type="number"
                    defaultValue="146"
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Diagnostic Narrative */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Consultant Clinical Diagnostic Summary
              </label>
              <textarea
                rows={3}
                defaultValue="Complete detailed structural anatomical survey performed according to DOH Antenatal Ultrasound Guidelines. Fetal biometry matches gestational dates. Normal 4-chamber heart, kidneys, stomach, and cord Doppler. Mother reassured."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            {/* Upload Area */}
            <div className="p-6 border-2 border-dashed border-teal-300 rounded-2xl bg-teal-50/40 text-center space-y-1">
              <Upload className="w-6 h-6 text-teal-600 mx-auto" />
              <span className="font-semibold text-slate-800 block">
                Attach DICOM / JPG Sonogram Clips
              </span>
              <span className="text-[11px] text-slate-500 block">
                Direct integration with GE Voluson PACS & Hospital DICOM Servers
              </span>
            </div>

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Sonogram package successfully published to patient's mobile vault!
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition active:scale-98 shadow-md"
            >
              Publish to Mother's Mobile App
            </button>
          </form>
        </div>
      )}

      {/* Mandatory DOH Decision Support Footer (Build Spec Section 0.5) */}
      <footer className="pt-6 pb-3 border-t border-slate-200/90 text-center">
        <p className="text-xs text-slate-500 font-medium">
          {CLINICAL_RULES.disclaimers.doctorPortalFooter.text}
        </p>
      </footer>
    </div>
  );
};
