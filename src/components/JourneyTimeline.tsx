import React, { useState } from 'react';
import { PREGNANCY_MILESTONES, UPCOMING_APPOINTMENTS, DEMO_COMPLETED_VISITS, CURRENT_SIMULATION_DATE } from '../data/mockData';
import { PatientProfile, Appointment } from '../types';
import { calculateGestationalAge, parseDateIso } from '../utils/datingEngine';
import { 
  generateAntenatalVisitSchedule, 
  generateMaternalReminders, 
  GeneratedVisitItem 
} from '../utils/visitScheduleGenerator';
import { evaluateFollowUpProtocols } from '../utils/followUpEngine';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  ChevronRight, 
  ChevronDown,
  Sparkles, 
  CreditCard,
  Bell,
  Check,
  AlertTriangle,
  Stethoscope,
  Info,
  ExternalLink,
  GitMerge,
  Layers
} from 'lucide-react';

interface JourneyTimelineProps {
  patient: PatientProfile;
  appointments: Appointment[];
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  patient,
  appointments,
  onOpenBooking,
  onOpenVault,
}) => {
  const [timelineMode, setTimelineMode] = useState<'visits' | 'scans'>('visits');
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>('19_23w');
  const [queryText, setQueryText] = useState<string>('');
  const [querySent, setQuerySent] = useState<boolean>(false);

  // Auto-generate visits from patient EDD and completed visits
  const completedVisitsForPatient = DEMO_COMPLETED_VISITS[patient.id] || {};
  const visitSchedule = generateAntenatalVisitSchedule(patient, completedVisitsForPatient);
  const maternalReminders = generateMaternalReminders(patient);
  const followUpData = evaluateFollowUpProtocols(patient, [], CURRENT_SIMULATION_DATE);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    setQuerySent(true);
    setTimeout(() => {
      setQuerySent(false);
      setQueryText('');
    }, 3000);
  };

  const toggleVisitExpand = (id: string) => {
    setExpandedVisitId(expandedVisitId === id ? null : id);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* UAE Pass & Digital Insurance Strip */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
            UAE
          </div>
          <div className="truncate">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-slate-900 text-xs sm:text-sm">{patient.name}</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium flex items-center gap-0.5 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> UAE PASS
              </span>
              <span className="text-[9px] sm:text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-200">
                {patient.carePathway?.replace(/_/g, ' ').toUpperCase() || 'LOW RISK PRIMARY'}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 block truncate">
              MRN: {patient.mrn} · Emirates ID: {patient.emiratesId} · {patient.facility}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="font-semibold text-slate-800 text-[11px] sm:text-xs block">
              {patient.insurance.network}
            </span>
            <span className="text-slate-400 text-[10px] sm:text-[11px]">
              Policy #{patient.insurance.policyNumber}
            </span>
          </div>
          <div className="p-1.5 sm:p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 shrink-0">
            <CreditCard className="w-4 h-4 text-teal-700" />
          </div>
        </div>
      </div>

      {/* DOH Clinical Reminders & Alerts Banner (Phase 2) */}
      {maternalReminders.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-slate-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Clinical Guidance & Action Reminders ({patient.currentGestationalWeeks}w {patient.currentGestationalDays}d)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-medium hidden sm:inline">
              DOH Abu Dhabi Antenatal Standard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {maternalReminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-3 rounded-xl border flex flex-col justify-between text-xs space-y-2 ${
                  rem.severity === 'urgent'
                    ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                    : rem.severity === 'action_required'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-white border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      {rem.severity === 'urgent' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      {rem.severity === 'action_required' && <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      {rem.severity === 'info' && <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                      <span>{rem.title}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/70 px-1.5 py-0.5 rounded">
                      {rem.dueGestation}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {rem.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 text-[10px]">
                  <span className="text-slate-400 font-mono">Ref: {rem.source}</span>
                  {rem.actionText && (
                    <button
                      onClick={onOpenBooking}
                      className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 transition"
                    >
                      <span>{rem.actionText}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOH Specialized Surveillance & Placenta Follow-Up Protocol (Phase 4 / USG App.4 & 6.5.4) */}
      {followUpData.activeProtocols.length > 0 && (
        <div className="bg-white border border-teal-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <GitMerge className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Specialized Clinical Surveillance Plan ({followUpData.activeProtocols.length} Active Protocol{followUpData.activeProtocols.length > 1 ? 's' : ''})
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500">
                  Customized monitoring protocol per DOH Antenatal Ultrasound Guidelines [USG App.4]
                </p>
              </div>
            </div>
            <button
              onClick={onOpenBooking}
              className="text-[10px] sm:text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 flex items-center gap-1 self-start sm:self-auto transition"
            >
              <span>Book Protocol Scan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {followUpData.activeProtocols.map((proto) => (
              <div key={proto.key} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{proto.title}</span>
                  <span className="text-[9px] font-mono text-teal-800 bg-white px-1.5 py-0.5 rounded border border-teal-200">
                    {proto.source}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{proto.reason}</p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                  <span className="font-semibold text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded">
                    Freq: {proto.frequency}
                  </span>
                  {proto.cptCodes.map(c => (
                    <span key={c} className="font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      CPT {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* If patient is on Placenta Pathway, show step indicator */}
          {followUpData.placentaPathway.isLowLying && (
            <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-teal-950 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-teal-700" />
                  Placenta Pathway Status:
                </span>
                <span className="text-teal-800 font-semibold font-mono text-[10px]">
                  Step {followUpData.placentaPathway.currentStepIndex} of 4
                </span>
              </div>
              <p className="text-[11px] text-teal-800">
                {followUpData.placentaPathway.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Visits & Scans Timeline (7 cols) + Right Column (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: DOH Visit Schedule & Ultrasound Roadmap (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
          {/* Timeline Header & Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                Maternal Care Roadmap
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {timelineMode === 'visits' 
                  ? 'Antenatal Visits & Clinical Checklists' 
                  : 'DOH Ultrasound Screening Roadmap'}
              </h3>
            </div>

            {/* Toggle Mode: Antenatal Visits vs Ultrasound Scans */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimelineMode('visits')}
                className={`py-1.5 px-3 rounded-lg transition ${
                  timelineMode === 'visits' 
                    ? 'bg-white text-teal-900 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Antenatal Visits (10)
              </button>
              <button
                onClick={() => setTimelineMode('scans')}
                className={`py-1.5 px-3 rounded-lg transition ${
                  timelineMode === 'scans' 
                    ? 'bg-white text-teal-900 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Ultrasound Scans
              </button>
            </div>
          </div>

          {/* MODE 1: Antenatal Care Visits (Auto-generated from EDD per Section 4 + CIRC 19/2026) */}
          {timelineMode === 'visits' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-slate-700">
                    Includes <strong>5 Mandatory Visits</strong> mandated by <strong>DOH Circular 19/2026</strong>.
                  </span>
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                  CIRC 19/2026
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {visitSchedule.map((visit) => {
                  const isExpanded = expandedVisitId === visit.id;
                  const isCurrent = visit.status === 'current';
                  const isCompleted = visit.status === 'completed';
                  const isOverdue = visit.status === 'overdue';

                  return (
                    <div key={visit.id} className="relative group">
                      {/* Node Icon */}
                      <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white transition ${
                        isCompleted
                          ? 'border-emerald-600 text-emerald-600'
                          : isCurrent
                          ? 'border-teal-600 ring-4 ring-teal-100 text-teal-600'
                          : isOverdue && visit.isMandatory
                          ? 'border-rose-600 ring-4 ring-rose-100 text-rose-600'
                          : 'border-slate-300 text-slate-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                        ) : isOverdue && visit.isMandatory ? (
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      <div className={`pl-2 p-3.5 rounded-2xl transition border ${
                        isCurrent
                          ? 'bg-teal-50/50 border-teal-200/90 shadow-2xs'
                          : isOverdue && visit.isMandatory
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-slate-50/30 border-slate-200/60 hover:bg-slate-50/80'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {visit.title}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                              {visit.windowLabel}
                            </span>

                            {visit.isMandatory && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                MANDATORY VISIT #{visit.mandatoryVisitIndex}
                              </span>
                            )}

                            {isCurrent && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">
                                CURRENT WINDOW
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] font-mono text-slate-500">
                            {isCompleted ? (
                              <span className="text-emerald-700 font-semibold">Completed · {visit.dateDone}</span>
                            ) : (
                              <span>Window: {visit.startDateIso} to {visit.endDateIso}</span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {visit.clinicalDescription}
                        </p>

                        {/* Completed vitals note if available */}
                        {isCompleted && visit.vitals && (
                          <div className="mt-2 p-2 bg-emerald-50/60 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-900 flex flex-wrap gap-3">
                            <span><strong>Clinician:</strong> {visit.clinician || 'Dr. Tariq Al-Hashimi'}</span>
                            {visit.vitals.bp && <span><strong>BP:</strong> {visit.vitals.bp} mmHg</span>}
                            {visit.vitals.weightKg && <span><strong>Weight:</strong> {visit.vitals.weightKg} kg</span>}
                            {visit.vitals.urineDipstick && <span><strong>Urine:</strong> {visit.vitals.urineDipstick}</span>}
                          </div>
                        )}

                        {/* Auto-Actions & Triggers */}
                        {visit.autoActions.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-1">
                            <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block">
                              Automated Protocol Actions:
                            </span>
                            {visit.autoActions.map((action, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                                <span className="text-teal-600 font-bold">→</span>
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Expandable DOH Checklist */}
                        <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-slate-200/60 text-[11px]">
                          <button
                            onClick={() => toggleVisitExpand(visit.id)}
                            className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                          >
                            <span>{isExpanded ? 'Hide' : 'View'} Clinical Checklist ({visit.checklist.length} items)</span>
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>

                          {!isCompleted && isCurrent && (
                            <button
                              onClick={onOpenBooking}
                              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-[11px] transition shadow-2xs"
                            >
                              Book Consultation Slot
                            </button>
                          )}
                        </div>

                        {/* Expanded Checklist details */}
                        {isExpanded && (
                          <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                            <span className="font-bold text-slate-900 block text-[11px]">
                              DOH Standard Protocol Checklist ({visit.source}):
                            </span>
                            <div className="space-y-1.5">
                              {visit.checklist.map((c, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-[11px]">
                                  <div className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                                    c.isDone ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-slate-50'
                                  }`}>
                                    {c.isDone && <Check className="w-2.5 h-2.5" />}
                                  </div>
                                  <span className={c.isDone ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                                    {c.item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 2: Ultrasound Scans Roadmap (Section 5 routine + indicated scans) */}
          {timelineMode === 'scans' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-slate-700">
                    DOH Antenatal Ultrasound Guidelines: 3 Routine Scans (11–13+6w, 18–22w, 34–36w) plus indicated Doppler surveillance.
                  </span>
                </div>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {PREGNANCY_MILESTONES.map((milestone, idx) => (
                  <div key={idx} className="relative group">
                    <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white transition ${
                      milestone.completed
                        ? 'border-emerald-600 text-emerald-600'
                        : milestone.isCurrent
                        ? 'border-teal-600 ring-4 ring-teal-100 text-teal-600'
                        : 'border-slate-300 text-slate-300'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-teal-600" />
                      )}
                    </div>

                    <div className="pl-2 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {milestone.title}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          milestone.completed
                            ? 'bg-emerald-50 text-emerald-700'
                            : milestone.isCurrent
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {milestone.weekRange}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {milestone.purpose}
                      </p>

                      {milestone.completed && (
                        <button
                          onClick={onOpenVault}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-800 mt-1"
                        >
                          <Sparkles className="w-3 h-3 text-teal-600" />
                          <span>View Ultrasound Records & HD Sonogram</span>
                        </button>
                      )}

                      {milestone.isNext && (
                        <button
                          onClick={onOpenBooking}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-[11px] mt-1.5 transition active:scale-95 shadow-xs"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Book Slot with Dr. Tariq</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Confirmed Appointments & Doctor Communications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Confirmed Appointments Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                  Next Clinic Visit
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Confirmed Appointments
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                {appointments.length} Scheduled
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {apt.title}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {apt.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span className="font-medium text-slate-900">{apt.date} at {apt.time}</span>
                      <span className="text-slate-400 font-mono">({apt.durationMinutes} min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-teal-800 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span>Target Gestation: {calculateGestationalAge(patient.eddDate, parseDateIso(apt.date)).formatted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span className="truncate">{apt.clinic}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    <strong>Prep instructions:</strong> {apt.preparationNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Message to Dr. Tariq */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <h4 className="text-sm font-bold">Ask Dr. Tariq a Question</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have non-emergency questions regarding your gestational care, DOH visit checklist, or ultrasound timing?
            </p>

            <form onSubmit={handleSendQuery} className="space-y-2 pt-1">
              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Type your clinical question here..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {querySent && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Message sent to Dr. Tariq's clinical coordinator. Expect response within 2 hours.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!queryText.trim()}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-semibold text-xs transition active:scale-98 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Clinical Desk</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
