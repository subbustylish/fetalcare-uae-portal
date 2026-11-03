import React from 'react';
import { DOCTOR_PROFILE } from '../data/mockData';
import { 
  Award, 
  MapPin, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  HeartHandshake, 
  AlertOctagon,
  FileBadge,
  Stethoscope,
  ExternalLink
} from 'lucide-react';

export const DoctorProfile: React.FC = () => {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Doctor Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
          {/* Doctor Avatar / Icon Badge */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-tr from-teal-800 to-slate-900 flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0 border-2 border-white">
            <span className="text-xl sm:text-2xl lg:text-3xl font-display font-bold">DT</span>
            <div className="absolute bottom-0 inset-x-0 bg-teal-600/90 text-[8px] sm:text-[9px] font-semibold text-center py-0.5 tracking-wider uppercase">
              FMF UK
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Consultant OB/GYN & MFM
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500">
                FMF #{DOCTOR_PROFILE.fmfCertificationId}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
              {DOCTOR_PROFILE.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
              {DOCTOR_PROFILE.qualifications} · {DOCTOR_PROFILE.experience}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto pt-1 sm:pt-0">
          <a
            href="tel:+97144359999"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition active:scale-98 shadow-sm min-h-[44px]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Clinic Suite</span>
          </a>
        </div>
      </div>

      {/* Grid: Biography & Specialties vs Clinic Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Clinical Bio & FMF Specializations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Clinical Focus & Background
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {DOCTOR_PROFILE.bio}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-800 block mb-2.5">
                Specialized Diagnostic Services
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {DOCTOR_PROFILE.specialties.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span className="text-slate-700 leading-tight">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditations */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-800 block mb-2">
                Official Licensure & Accreditations
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {DOCTOR_PROFILE.accreditations.map((acc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Urgent Care & Red Flag Triage Warning */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 text-xs text-rose-950 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertOctagon className="w-4 h-4" />
              <span>When to Seek Emergency Obstetric Evaluation</span>
            </div>
            <p className="leading-relaxed opacity-90">
              Please proceed immediately to the Labor & Delivery triage at Mediclinic City Hospital or call 998 if you experience any of the following symptoms:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-white/80 rounded-xl border border-rose-100">
                <strong className="block text-rose-900 mb-0.5">Sudden Reduced Movements</strong>
                <span>Fewer than 10 kicks in 2 hours after a meal and cold drink.</span>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-rose-100">
                <strong className="block text-rose-900 mb-0.5">Vaginal Fluid Leak or Bleeding</strong>
                <span>Clear watery leakage (amniotic fluid) or bright red spotting.</span>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-rose-100">
                <strong className="block text-rose-900 mb-0.5">Preeclampsia Red Flags</strong>
                <span>Persistent severe headache, visual sparkles, or epigastric pain.</span>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-rose-100">
                <strong className="block text-rose-900 mb-0.5">Regular Painful Contractions</strong>
                <span>Tightening sensations occurring every 5–7 minutes before 37 weeks.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Practice Locations & Insurances */}
        <div className="lg:col-span-5 space-y-6">
          {/* Clinic Suites */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              Consultation Suites
            </h3>

            <div className="space-y-3">
              {DOCTOR_PROFILE.clinics.map((clinic, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1.5">
                  <span className="font-bold text-slate-900 block">{clinic.name}</span>
                  <p className="text-slate-500 leading-relaxed">{clinic.location}</p>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-teal-700 font-medium">{clinic.days}</span>
                    <a
                      href={`tel:${clinic.phone}`}
                      className="text-slate-700 font-mono font-medium hover:text-teal-700"
                    >
                      {clinic.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Partners */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-teal-600" />
              Direct Billing Insurances
            </h3>
            <p className="text-xs text-slate-500">
              Pre-authorizations for anomaly scans and fetal echocardiography are processed directly by our clinical coordination desk:
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {DOCTOR_PROFILE.acceptedInsurances.map((ins, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                >
                  {ins}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
