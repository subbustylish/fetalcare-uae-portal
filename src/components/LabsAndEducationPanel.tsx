import React, { useState } from 'react';
import { 
  DEMO_LAB_PANELS, 
  DEMO_VACCINES_TREATMENTS, 
  INITIAL_EDUCATION_TOPICS, 
  EducationChecklistItem,
  VaccineTreatmentRecord
} from '../data/clinicalPhase5Data';
import { DEMO_PATIENTS, PATIENT_SARAH, DOCTOR_PROFILE, CURRENT_SIMULATION_DATE } from '../data/mockData';
import { PatientProfile } from '../types';
import { LabRecord } from '../types/clinical';
import { calculateGestationalAge, parseDateIso } from '../utils/datingEngine';
import { 
  FlaskConical, 
  Syringe, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Check, 
  User, 
  Plus,
  Pill,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface LabsAndEducationPanelProps {
  activePatient?: PatientProfile;
  onSelectPatient?: (p: PatientProfile) => void;
}

export const LabsAndEducationPanel: React.FC<LabsAndEducationPanelProps> = ({
  activePatient = PATIENT_SARAH,
  onSelectPatient
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(activePatient.id);
  const [activeSubTab, setActiveSubTab] = useState<'labs' | 'vaccines' | 'education'>('labs');
  
  // Interactive education topics state
  const [educationTopics, setEducationTopics] = useState<EducationChecklistItem[]>(INITIAL_EDUCATION_TOPICS);
  const [newLabOrdered, setNewLabOrdered] = useState<boolean>(false);

  const currentPatient = DEMO_PATIENTS[selectedPatientId] || PATIENT_SARAH;
  const currentGa = calculateGestationalAge(currentPatient.eddDate, parseDateIso(CURRENT_SIMULATION_DATE));

  const patientLabs: LabRecord[] = DEMO_LAB_PANELS[currentPatient.id] || DEMO_LAB_PANELS['pt-sarah'];
  const patientVaccines: VaccineTreatmentRecord[] = DEMO_VACCINES_TREATMENTS[currentPatient.id] || DEMO_VACCINES_TREATMENTS['pt-sarah'];

  const completedEduCount = educationTopics.filter(t => t.discussed).length;
  const totalEduCount = educationTopics.length;

  const handleToggleEducation = (id: string) => {
    setEducationTopics(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.discussed;
        return {
          ...t,
          discussed: nextState,
          dateDiscussed: nextState ? CURRENT_SIMULATION_DATE : undefined,
          clinician: nextState ? DOCTOR_PROFILE.name : undefined
        };
      }
      return t;
    }));
  };

  const handleOrderLab = (e: React.FormEvent) => {
    e.preventDefault();
    setNewLabOrdered(true);
    setTimeout(() => setNewLabOrdered(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-700/80 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider border border-teal-500/30">
                DOH Antenatal Standard
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-mono">
                Sections 12 & 13 Protocols (STD App.1 & 3.4.1.14)
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-bold flex items-center gap-2">
              <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 shrink-0" />
              <span>Laboratory Panels, Vaccines & Care Counselling Tracker</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl leading-relaxed">
              Standardized booking bloods, 24–28w OGTT, 36w GBS culture, TDAP/RSV immunizations, Aspirin 150 mg nightly prophylaxis, and the 19-point maternal education checklist.
            </p>
          </div>

          {/* Education Progress Pill */}
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 text-xs space-y-1 w-full sm:w-auto shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400 font-medium">Education Topics:</span>
              <span className="font-mono font-bold text-teal-300">
                {completedEduCount} / {totalEduCount} Done
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-teal-400 transition-all duration-300"
                style={{ width: `${(completedEduCount / totalEduCount) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block text-right font-mono">
              {Math.round((completedEduCount / totalEduCount) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-300">
            Active Patient: <strong className="text-white">{currentPatient.name}</strong> ({currentGa.formatted})
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('labs')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeSubTab === 'labs' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Laboratory Panels (STD App.1)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('vaccines')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeSubTab === 'vaccines' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Syringe className="w-3.5 h-3.5" />
              <span>Vaccines & Prophylaxis</span>
            </button>
            <button
              onClick={() => setActiveSubTab('education')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeSubTab === 'education' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education Tracker (19 Topics)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: Laboratory Panels (STD App.1) */}
      {activeSubTab === 'labs' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
                <span>Antenatal Laboratory Screening Panels (DOH Standard App.1)</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Tracks Booking Bloods, 16w cfDNA, 24–28w OGTT, 28w repeat CBC & antibody, and 36w GBS culture.
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 self-start sm:self-auto">
              Ref: DOH STD App.1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patientLabs.map((lab) => {
              const isAbnormal = lab.normalAbnormal === 'abnormal';
              const isBorderline = lab.normalAbnormal === 'borderline';

              return (
                <div
                  key={lab.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 transition ${
                    isAbnormal
                      ? 'bg-rose-50/70 border-rose-300'
                      : isBorderline
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {lab.test}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                      isAbnormal
                        ? 'bg-rose-600 text-white'
                        : isBorderline
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {lab.normalAbnormal}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] font-semibold text-slate-800 bg-white p-2 rounded-lg border border-slate-200/80">
                    {lab.result}
                  </div>

                  {lab.notes && (
                    <p className="text-[10px] text-slate-500 italic">
                      {lab.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                    <span className="capitalize">Panel: {lab.category}</span>
                    <span>Sample Date: {lab.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Lab Order Action */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              Electronic Lab Integration: Mediclinic Laboratory / SEHA Unified HIE Malaffi
            </span>
            <button
              onClick={handleOrderLab}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition active:scale-98 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Order Antenatal Investigation</span>
            </button>
          </div>

          {newLabOrdered && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Laboratory requisition successfully transmitted to hospital pathology!</span>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: Vaccines & Prophylaxis (STD App.1) */}
      {activeSubTab === 'vaccines' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Syringe className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
                <span>Antenatal Immunizations & Prophylactic Treatments</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                TDAP pertussis booster, RSV vaccine, Anti-D immunoglobulin, and Aspirin 150 mg nightly.
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 self-start sm:self-auto">
              Ref: DOH STD App.1
            </span>
          </div>

          <div className="space-y-2.5">
            {patientVaccines.map((vax) => (
              <div
                key={vax.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition text-xs space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {vax.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-mono font-bold">
                      {vax.targetWindowWeeks}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto flex items-center gap-1 ${
                    vax.isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {vax.isCompleted ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{vax.isCompleted ? 'Administered' : 'Scheduled / Pending Window'}</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-600">
                  {vax.notes}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                  <span>DOH Reference: {vax.source}</span>
                  {vax.dateGiven && <span>Date Administered: {vax.dateGiven} ({vax.clinician})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Counselling & Education Tracker (19 Topics, STD 3.4.1.14 + App.1) */}
      {activeSubTab === 'education' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
                <span>Maternal Counselling & Education Tracker (19 Mandatory Topics)</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Tick each topic when discussed with patient. Includes urgent 24/7 fetal movement advice and safe sleep after 28w.
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 self-start sm:self-auto">
              Ref: DOH STD 3.4.1.14
            </span>
          </div>

          <div className="space-y-2">
            {educationTopics.map((topic, index) => {
              const isDiscussed = topic.discussed;

              return (
                <div
                  key={topic.id}
                  onClick={() => handleToggleEducation(topic.id)}
                  className={`p-3 rounded-xl border text-xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    isDiscussed
                      ? 'bg-teal-50/50 border-teal-200 hover:bg-teal-50'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={isDiscussed}
                      onChange={() => {}} // handled by div click
                      className="w-4 h-4 text-teal-600 rounded mt-0.5 border-slate-300 pointer-events-none"
                    />
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] text-slate-400 font-bold">
                          #{index + 1}
                        </span>
                        <span className={`text-xs sm:text-sm font-bold ${
                          isDiscussed ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {topic.topic}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-mono capitalize">
                          {topic.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {topic.guidanceText}
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0 self-end sm:self-center">
                    {isDiscussed ? (
                      <div className="text-[10px] text-teal-800 font-mono">
                        <span className="font-bold block">✓ Discussed</span>
                        <span className="text-slate-400">{topic.dateDiscussed}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        Pending Discussion
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
