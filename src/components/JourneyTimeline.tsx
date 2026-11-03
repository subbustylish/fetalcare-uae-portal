import React, { useState } from 'react';
import { PREGNANCY_MILESTONES, UPCOMING_APPOINTMENTS } from '../data/mockData';
import { PatientProfile, Appointment } from '../types';
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
  Sparkles,
  CreditCard
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
  const [queryText, setQueryText] = useState<string>('');
  const [querySent, setQuerySent] = useState<boolean>(false);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    setQuerySent(true);
    setTimeout(() => {
      setQuerySent(false);
      setQueryText('');
    }, 3000);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* UAE Pass & Digital Insurance Strip (Sahatna & Mediclinic Touch) */}
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
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 block truncate">
              MRN: {patient.mrn} · Emirates ID: {patient.emiratesId}
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

      {/* Grid: Scan Milestones Roadmap + Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Pregnancy Scan Roadmap (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                Fetal Medicine Journey
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Ultrasound Screening Roadmap
              </h3>
            </div>
            <button
              onClick={onOpenBooking}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Schedule Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {PREGNANCY_MILESTONES.map((milestone, idx) => (
              <div key={idx} className="relative group">
                {/* Node icon indicator */}
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
                  <div className="flex items-center gap-2">
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

        {/* Right Column: Next Clinical Visits & Ask Doctor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Appointment Card */}
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
              Have non-emergency questions regarding your 22-week anomaly scan or gestational diabetes screening?
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
