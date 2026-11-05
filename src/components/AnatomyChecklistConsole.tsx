import React, { useState } from 'react';
import { AnatomyChecklistItem } from '../types/clinical';
import { INITIAL_ANATOMY_CHECKLIST } from '../data/clinicalPhase5Data';
import { DOCTOR_PROFILE, DEMO_PATIENTS, PATIENT_SARAH, CURRENT_SIMULATION_DATE } from '../data/mockData';
import { PatientProfile } from '../types';
import { calculateGestationalAge, parseDateIso } from '../utils/datingEngine';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  Check, 
  RotateCcw, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Sparkles,
  Info
} from 'lucide-react';

interface AnatomyChecklistConsoleProps {
  activePatient?: PatientProfile;
  onSelectPatient?: (p: PatientProfile) => void;
}

export const AnatomyChecklistConsole: React.FC<AnatomyChecklistConsoleProps> = ({
  activePatient = PATIENT_SARAH,
  onSelectPatient
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(activePatient.id);
  const [items, setItems] = useState<AnatomyChecklistItem[]>(INITIAL_ANATOMY_CHECKLIST);
  const [filterMode, setFilterMode] = useState<'all' | 'mandatory' | 'desirable' | 'not_seen'>('all');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [repeatScheduled, setRepeatScheduled] = useState<boolean>(false);

  const currentPatient = DEMO_PATIENTS[selectedPatientId] || PATIENT_SARAH;
  const currentGa = calculateGestationalAge(currentPatient.eddDate, parseDateIso(CURRENT_SIMULATION_DATE));

  const mandatoryItems = items.filter(item => item.isMandatory);
  const seenMandatoryCount = mandatoryItems.filter(item => item.status === 'seen').length;
  const notSeenMandatory = mandatoryItems.filter(item => item.status === 'not_seen');
  const abnormalItems = items.filter(item => item.status === 'abnormal');
  const imagesSavedCount = items.filter(item => item.imageCaptured).length;

  const isScanComplete = notSeenMandatory.length === 0;

  const handleStatusChange = (structure: string, newStatus: 'seen' | 'not_seen' | 'abnormal') => {
    setItems(prev => prev.map(item => {
      if (item.structure === structure) {
        return {
          ...item,
          status: newStatus,
          // Auto-mark image captured if seen
          imageCaptured: newStatus === 'seen' ? true : item.imageCaptured
        };
      }
      return item;
    }));
  };

  const handleToggleImage = (structure: string) => {
    setItems(prev => prev.map(item => {
      if (item.structure === structure) {
        return { ...item, imageCaptured: !item.imageCaptured };
      }
      return item;
    }));
  };

  const handleMarkAllMandatorySeen = () => {
    setItems(prev => prev.map(item => {
      if (item.isMandatory) {
        return { ...item, status: 'seen', imageCaptured: true };
      }
      return item;
    }));
  };

  const handleSimulateIncomplete = () => {
    setItems(prev => prev.map(item => {
      if (item.structure.includes('LVOT') || item.structure.includes('Facial Profile') || item.structure.includes('Diaphragm')) {
        return { ...item, status: 'not_seen', imageCaptured: false };
      }
      return item;
    }));
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const filteredItems = items.filter(item => {
    if (filterMode === 'mandatory') return item.isMandatory;
    if (filterMode === 'desirable') return !item.isMandatory;
    if (filterMode === 'not_seen') return item.status === 'not_seen';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-700/80 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider border border-teal-500/30">
                DOH Antenatal Ultrasound Guidelines
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-mono">
                Section 11 Checklist (USG App.3) · CPT 76811
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 shrink-0" />
              <span>Detailed Fetal Anatomy Scan Checklist</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl leading-relaxed">
              Standardized ISUOG & DOH 23-point anatomical examination. Items marked with (*) are desirable; all others are mandatory. If any mandatory structure is not seen, scan is incomplete and repeat is scheduled in 2–3 weeks (USG 6.4.3).
            </p>
          </div>

          {/* Quick Completeness Metric Card */}
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 text-xs space-y-1.5 w-full sm:w-auto shrink-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 font-medium">Mandatory Structures:</span>
              <span className="font-mono font-bold text-teal-300">
                {seenMandatoryCount} / {mandatoryItems.length}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isScanComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${(seenMandatoryCount / mandatoryItems.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Images Verified: {imagesSavedCount}/23</span>
              <span className={isScanComplete ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {isScanComplete ? 'Scan Complete' : 'Incomplete (USG 6.4.3)'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-300">
            Active Patient: <strong className="text-white">{currentPatient.name}</strong> ({currentGa.formatted})
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleMarkAllMandatorySeen}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 transition active:scale-98 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Mandatory as Seen ✓</span>
            </button>
            <button
              onClick={handleSimulateIncomplete}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Incomplete Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* DOH USG 6.4.3 Incompleteness Alert Banner */}
      {!isScanComplete && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 space-y-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                Incomplete Detailed Anatomy Scan (DOH Guideline USG 6.4.3)
              </h4>
              <p className="leading-relaxed text-[11px] sm:text-xs">
                The following mandatory anatomical structure(s) were <strong>not fully visualized</strong>: {notSeenMandatory.map(m => m.structure).join(', ')}. DOH rules state: if any mandatory item is not seen, mark scan incomplete and schedule a limited repeat scan in 2–3 weeks.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200">
            <span className="font-mono text-[10px] text-amber-800 font-semibold">
              Suggested: Book repeat anomaly review scan at ~23–24 weeks (CPT 76816)
            </span>
            <button
              onClick={() => setRepeatScheduled(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs transition active:scale-98 flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{repeatScheduled ? 'Repeat Scan Booked (2-3w) ✓' : 'Auto-Schedule 2–3w Repeat'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Fetal Medicine Referral Alert for Abnormal Structure */}
      {abnormalItems.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 text-xs text-rose-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-rose-900">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Suggested: Refer to Fetal Medicine Services (USG App.6)</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Structural abnormality identified in: {abnormalItems.map(a => a.structure).join(', ')}. Immediate tertiary MFM consultation required.
          </p>
        </div>
      )}

      {/* Checklist Table / Card Grid */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        {/* Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Anatomical Survey Items ({filteredItems.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Each structure must be classified as Seen, Not Seen, or Abnormal, with caliper image verified.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All (23)
            </button>
            <button
              onClick={() => setFilterMode('mandatory')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterMode === 'mandatory' ? 'bg-white text-teal-800 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mandatory (19)
            </button>
            <button
              onClick={() => setFilterMode('desirable')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterMode === 'desirable' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Desirable* (4)
            </button>
            <button
              onClick={() => setFilterMode('not_seen')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterMode === 'not_seen' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Not Seen ({notSeenMandatory.length})
            </button>
          </div>
        </div>

        {/* 23-Point Grid */}
        <div className="space-y-2">
          {filteredItems.map((item, index) => {
            const isSeen = item.status === 'seen';
            const isNotSeen = item.status === 'not_seen';
            const isAbnormal = item.status === 'abnormal';

            return (
              <div
                key={item.structure}
                className={`p-3 rounded-xl border text-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isAbnormal
                    ? 'bg-rose-50/70 border-rose-300'
                    : isNotSeen && item.isMandatory
                    ? 'bg-amber-50/70 border-amber-300'
                    : isSeen
                    ? 'bg-slate-50/50 hover:bg-slate-50 border-slate-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Left: Structure details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">
                      #{index + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {item.structure}
                    </span>
                    {item.isMandatory ? (
                      <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 text-[9px] font-bold uppercase">
                        Mandatory
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 text-[9px] font-medium">
                        Desirable*
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    {item.notes}
                  </p>
                </div>

                {/* Right: Interactive Status Buttons & Image Check */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Image Captured Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleImage(item.structure)}
                    className={`p-1.5 rounded-lg border text-[10px] font-medium flex items-center gap-1 transition ${
                      item.imageCaptured
                        ? 'bg-teal-50 text-teal-800 border-teal-300 font-semibold'
                        : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
                    }`}
                    title="Toggle image captured status"
                  >
                    <Camera className="w-3.5 h-3.5 text-teal-600" />
                    <span>{item.imageCaptured ? 'Image ✓' : 'No Image'}</span>
                  </button>

                  {/* Tri-state status buttons */}
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.structure, 'seen')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-0.5 ${
                        isSeen ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Check className="w-3 h-3" /> Seen
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.structure, 'not_seen')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                        isNotSeen ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Not Seen
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.structure, 'abnormal')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                        isAbnormal ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Abnormal
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save & Sign-off Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Certified Sonographer/Consultant: <strong className="text-slate-800">{DOCTOR_PROFILE.name}</strong> (FMF ID: {DOCTOR_PROFILE.fmfCertificationId})
          </div>

          <button
            onClick={handleSaveReport}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition active:scale-98 shadow-sm flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Sign & Finalize Anatomy Scan Report (CPT 76811)</span>
          </button>
        </div>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Detailed Anatomy Report successfully finalized and saved to patient record!</span>
          </div>
        )}
      </div>
    </div>
  );
};
