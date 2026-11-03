import React, { useState } from 'react';
import { DOCTOR_PROFILE, UPCOMING_APPOINTMENTS, INITIAL_PATIENT } from '../data/mockData';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  Upload, 
  CheckCircle, 
  FileCheck, 
  Clock, 
  Plus, 
  Search,
  Filter,
  Sparkles
} from 'lucide-react';

export const DoctorAdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'high_risk' | 'upload'>('schedule');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [patientSearch, setPatientSearch] = useState<string>('');

  const highRiskPatients = [
    {
      id: 'pt-101',
      name: 'Sarah Al-Maktoum (Active Demo)',
      gestation: '22w 4d',
      riskCategory: 'High Risk (Tier 1)',
      flags: ['Borderline Uterine Artery Resistance (Resolved)', 'OGTT screening due week 24'],
      lastScanDate: '2026-10-31',
      status: 'Stable - Normal Anomaly Scan'
    },
    {
      id: 'pt-102',
      name: 'Noura Al-Zaabi',
      gestation: '27w 1d',
      riskCategory: 'Critical Watch',
      flags: ['Marginal Placenta Previa (14mm from internal os)', 'Previous Cesarean delivery'],
      lastScanDate: '2026-10-28',
      status: 'Restricted Activity & Transvaginal follow-up 30w'
    },
    {
      id: 'pt-103',
      name: 'Maryam Mansoor',
      gestation: '19w 6d',
      riskCategory: 'Monochorionic Twins',
      flags: ['MCDA Twin Gestation', 'TTTS (Twin-to-Twin Transfusion) Fortnightly Surveillance'],
      lastScanDate: '2026-11-01',
      status: 'Normal concordant bladder & AFI in both sacs'
    }
  ];

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
            Mediclinic City Hospital (DHCC) & Abu Dhabi Fetal Center
          </p>
        </div>

        {/* View mode indicator */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 p-1 bg-slate-800 rounded-xl text-[10px] sm:text-xs w-full md:w-auto">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2 px-2 sm:px-3 rounded-lg transition font-medium text-center ${
              activeTab === 'schedule' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Daily Scans
          </button>
          <button
            onClick={() => setActiveTab('high_risk')}
            className={`py-2 px-2 sm:px-3 rounded-lg transition font-medium text-center ${
              activeTab === 'high_risk' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            High-Risk Radar
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-2 sm:px-3 rounded-lg transition font-medium text-center ${
              activeTab === 'upload' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Tab 1: Daily Scans & Clinic Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Today's Ultrasound Sessions (Nov 3, 2026)
              </h3>
              <p className="text-xs text-slate-500">
                6 Scans Scheduled · Mediclinic City Hospital, Suite 204
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                GE Voluson E10 Ready
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {UPCOMING_APPOINTMENTS.map((apt, idx) => (
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
                        {INITIAL_PATIENT.name}
                      </span>
                      <span className="text-[10px] text-teal-700 bg-teal-100/60 font-semibold px-2 py-0.5 rounded">
                        GA: {apt.gestationalTarget}
                      </span>
                    </div>
                    <span className="text-slate-600 block">{apt.title}</span>
                    <span className="text-slate-400 text-[11px]">
                      {apt.clinic} · Duration: {apt.durationMinutes} mins
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
                    Open Console
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: High-Risk Radar */}
      {activeTab === 'high_risk' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              High-Risk Pregnancy Surveillance List
            </h3>
            <p className="text-xs text-slate-500">
              Patients requiring priority fetal echocardiography, Doppler surveillance, or cervical length checks.
            </p>
          </div>

          <div className="space-y-3">
            {highRiskPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
                    <span className="text-slate-500 ml-2">Gestation: {patient.gestation}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                    patient.riskCategory.includes('Critical')
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {patient.riskCategory}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {patient.flags.map((flag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white text-slate-700 text-[11px] border border-slate-200"
                    >
                      • {flag}
                    </span>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
                  <span>Last Scan: {patient.lastScanDate}</span>
                  <span className="font-medium text-teal-800">{patient.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Upload Ultrasound Report Simulator */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-600" />
              Upload Sonogram & Publish to Patient Vault
            </h3>
            <p className="text-xs text-slate-500">
              Transmit GE Voluson DICOM files & clinical summary directly to patient's mobile app.
            </p>
          </div>

          <form onSubmit={handleSimulateUpload} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Select Patient
              </label>
              <select className="w-full p-2.5 rounded-xl border border-slate-300 bg-white">
                <option>Sarah Al-Maktoum (MRN: MC-DXB-984210, 22w 4d)</option>
                <option>Noura Al-Zaabi (MRN: MC-DXB-774129, 27w 1d)</option>
                <option>Maryam Mansoor (MRN: MC-AUH-110294, 19w 6d)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Examination Type
                </label>
                <select className="w-full p-2.5 rounded-xl border border-slate-300 bg-white">
                  <option>3D/4D HD-Live Scan</option>
                  <option>Detailed Anomaly (20-22w)</option>
                  <option>Growth & Doppler Velocimetry</option>
                  <option>Fetal Echocardiogram</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Estimated Fetal Weight (Grams)
                </label>
                <input
                  type="number"
                  defaultValue={485}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Consultant's Clinical Summary
              </label>
              <textarea
                rows={3}
                defaultValue="Fetal growth matches gestational dates. Normal 4-chamber heart, stomach, kidneys, and cord Doppler. Mother reassured."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            {/* Drag & drop box mockup */}
            <div className="p-6 border-2 border-dashed border-teal-300 rounded-2xl bg-teal-50/40 text-center space-y-1">
              <Upload className="w-6 h-6 text-teal-600 mx-auto" />
              <span className="font-semibold text-slate-800 block">
                Attach DICOM / JPG Sonogram Clips
              </span>
              <span className="text-[11px] text-slate-500 block">
                Direct integration with GE Voluson PACS and Hospital DICOM Servers
              </span>
            </div>

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Sonogram package successfully published to patient Sarah Al-Maktoum's mobile vault!
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
    </div>
  );
};
