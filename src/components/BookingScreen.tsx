import React, { useState } from 'react';
import { ScanType, Appointment, PatientProfile } from '../types';
import { DOCTOR_PROFILE } from '../data/mockData';
import { calculateGestationalAge } from '../utils/datingEngine';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  MapPin, 
  Check, 
  CreditCard,
  FileCheck2,
  CalendarCheck
} from 'lucide-react';

interface BookingScreenProps {
  patient: PatientProfile;
  onBookingSuccess: (newApt: Appointment) => void;
  onNavigateToJourney: () => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  patient,
  onBookingSuccess,
  onNavigateToJourney,
}) => {
  const [selectedScan, setSelectedScan] = useState<ScanType>('growth_doppler');
  const [selectedDate, setSelectedDate] = useState<string>('2026-12-15');
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [selectedClinic, setSelectedClinic] = useState<number>(0);
  const [insuranceOption, setInsuranceOption] = useState<string>('daman');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  const scanOptions: {
    type: ScanType;
    title: string;
    targetRange: string;
    minWeeks: number;
    maxWeeks: number;
    duration: number;
    desc: string;
    cpt?: string;
    isRoutine?: boolean;
  }[] = [
    {
      type: 'routine_growth_34_36',
      title: 'Third Trimester Growth Scan (34–36w)',
      targetRange: '34w0d – 36w6d',
      minWeeks: 34,
      maxWeeks: 36,
      duration: 35,
      cpt: 'CPT 76805',
      isRoutine: true,
      desc: 'Routine third trimester growth scan for low-risk pregnancies to assess fetal growth, fluid, presentation, and placental clearance (DOH USG 6.1.4).'
    },
    {
      type: 'anomaly_scan',
      title: 'Detailed Fetal Anatomy Scan (18–22w)',
      targetRange: '18w0d – 22w6d',
      minWeeks: 18,
      maxWeeks: 23,
      duration: 45,
      cpt: 'CPT 76811',
      isRoutine: true,
      desc: 'Routine structural anomaly survey (brain, heart chambers, spine, kidneys, limbs, placenta position). Bookable up to 23+6w (DOH USG 6.4.1).'
    },
    {
      type: 'nt_scan',
      title: 'First Trimester Dating & NT Scan (11–13+6w)',
      targetRange: '11w0d – 13w6d (CRL 45–84mm)',
      minWeeks: 11,
      maxWeeks: 13,
      duration: 35,
      cpt: 'CPT 76801 + 76813',
      isRoutine: true,
      desc: 'Viability, accurate CRL dating, nuchal translucency measurement, and early structural assessment (DOH USG 6.1.2).'
    },
    {
      type: 'growth_doppler',
      title: 'Serial Growth & Doppler (Indicated / High-Risk)',
      targetRange: 'From 24–26w every 2–4 weeks',
      minWeeks: 24,
      maxWeeks: 40,
      duration: 40,
      cpt: 'CPT 76816 + 76820',
      isRoutine: false,
      desc: 'Medically indicated serial growth and Doppler velocimetry triggered by FGR/PET risk factors (DOH USG App.4/5).'
    },
    {
      type: 'cervical_length',
      title: 'Cervical Length Assessment (14–26w, At-Risk)',
      targetRange: '14w0d – 26w0d',
      minWeeks: 14,
      maxWeeks: 26,
      duration: 20,
      cpt: 'CPT 76817',
      isRoutine: false,
      desc: 'Transvaginal cervical length screening for women at high risk of preterm delivery (prior PTB, cervical surgery, uterine anomaly) (DOH USG 6.8.2).'
    },
    {
      type: 'fetal_echo',
      title: 'Specialized Fetal Echocardiogram (19–24w)',
      targetRange: '19w0d – 24w6d',
      minWeeks: 19,
      maxWeeks: 26,
      duration: 45,
      cpt: 'CPT 76825 / 76826',
      isRoutine: false,
      desc: 'Detailed fetal cardiac examination indicated for maternal diabetes, family history, or suspected cardiac anomaly (DOH USG App.6).'
    },
    {
      type: '3d_4d_hd',
      title: '3D/4D HD-Live Keepsake & Bonding Scan',
      targetRange: '26w0d – 32w0d',
      minWeeks: 25,
      maxWeeks: 34,
      duration: 30,
      cpt: 'CPT 76815',
      isRoutine: false,
      desc: 'High-definition live video & facial portrait sonogram. Includes digital video clip export.'
    },
    {
      type: 'high_risk_consult',
      title: 'High-Risk Maternal-Fetal Medicine Consultation',
      targetRange: 'Any Gestational Age',
      minWeeks: 4,
      maxWeeks: 42,
      duration: 50,
      cpt: 'Clinical E&M',
      isRoutine: false,
      desc: 'Consultation with Dr. Tariq Al-Hashimi for complex obstetric history, previous preterm birth, or fetal anomalies.'
    }
  ];

  const currentOption = scanOptions.find(o => o.type === selectedScan) || scanOptions[0];

  // Gestational age calculated dynamically from patient EDD and selected date
  const targetDateObj = new Date(selectedDate);
  const gaAtTargetDate = calculateGestationalAge(patient.eddDate, targetDateObj);
  const targetWeeks = gaAtTargetDate.weeks;
  const targetDays = gaAtTargetDate.days;

  const isTimingIdeal = targetWeeks >= currentOption.minWeeks && targetWeeks <= currentOption.maxWeeks;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        scanType: selectedScan,
        title: currentOption.title,
        date: selectedDate,
        time: selectedTime,
        durationMinutes: currentOption.duration,
        clinic: DOCTOR_PROFILE.clinics[selectedClinic].name,
        clinicAddress: DOCTOR_PROFILE.clinics[selectedClinic].location,
        doctor: DOCTOR_PROFILE.name,
        status: 'Confirmed',
        gestationalTarget: `${targetWeeks} Weeks ${targetDays} Days`,
        preparationNotes: 'Drink 500ml water 45 mins prior to scan. Comfortable two-piece clothing recommended.',
        insurancePreAuth: {
          provider: insuranceOption === 'daman' ? 'Daman / Thiqa' : 'NextCare VIP',
          status: 'Pre-Approved',
          authCode: `AUTH-UAE-${Math.floor(100000 + Math.random() * 900000)}`
        }
      };
      onBookingSuccess(newApt);
      setTimeout(() => {
        onNavigateToJourney();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Screen Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
          Specialist Scan Scheduling
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Book certified prenatal ultrasound scans with Dr. Tariq Al-Hashimi at Mediclinic DHCC or Abu Dhabi.
        </p>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6 max-w-3xl">
        {/* Step 1: Scan Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            1. Select Ultrasound Examination
          </label>
          <div className="space-y-2">
            {scanOptions.map((scan) => (
              <div
                key={scan.type}
                onClick={() => setSelectedScan(scan.type)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                  selectedScan === scan.type
                    ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-900 text-sm">{scan.title}</span>
                    {scan.cpt && (
                      <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-2 py-0.2 rounded font-bold">
                        {scan.cpt}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded font-semibold self-start sm:self-auto">
                    {scan.targetRange}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{scan.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Clinical Indication for Non-Routine Scans (USG 3.2) */}
        {!currentOption.isRoutine && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-900 block">
                Documented Clinical Indication (Mandatory per DOH USG 3.2)
              </label>
              <span className="font-mono text-[10px] text-amber-800 font-semibold">Ref: USG 3.2</span>
            </div>
            <input
              type="text"
              defaultValue={
                patient.highRiskFactors.length > 0 
                  ? patient.highRiskFactors[0] 
                  : 'Medically indicated surveillance per MFM clinical protocol'
              }
              placeholder="e.g. Previous Cesarean Section with low-lying placenta / MCDA twin surveillance"
              className="w-full p-2.5 rounded-lg border border-amber-300 text-xs bg-white text-slate-800"
            />
            <p className="text-[10px] text-amber-800">
              DOH guidelines require a documented clinical indication for non-routine scans prior to claims submission.
            </p>
          </div>
        )}

        {/* Gestational Timing Verification Box (Smart Fetal Guardrail) */}
        <div className={`p-4 rounded-xl border text-xs ${
          isTimingIdeal 
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-start gap-3">
            {isTimingIdeal ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-semibold text-sm block">
                Gestational Age Check: {targetWeeks}w {targetDays}d on selected date
              </span>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {isTimingIdeal
                  ? `Optimal diagnostic window for this examination (${currentOption.targetRange}).`
                  : `Notice: The standard clinical window is ${currentOption.targetRange}. Dr. Tariq's triage team will verify clinical indications.`}
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Clinic Location */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            2. Select Clinic Location
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOCTOR_PROFILE.clinics.map((clinic, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedClinic(idx)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                  selectedClinic === idx
                    ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-sm">{clinic.name.split(' - ')[0]}</span>
                </div>
                <span className="text-[11px] text-slate-500 block leading-relaxed">{clinic.location}</span>
                <span className="text-[11px] text-teal-700 font-semibold mt-1.5 block">{clinic.days}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Date & Preferred Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
              3. Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min="2026-11-04"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
              Preferred Time Slot
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white font-medium"
            >
              <option>09:30 AM</option>
              <option>10:45 AM</option>
              <option>11:30 AM</option>
              <option>02:15 PM</option>
              <option>03:30 PM</option>
              <option>04:45 PM</option>
            </select>
          </div>
        </div>

        {/* Step 4: Insurance Pre-Authorization */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            4. Insurance Direct Billing
          </label>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-teal-700" />
              <div>
                <span className="font-semibold text-slate-900 block text-xs">
                  {patient.insurance.network} ({patient.insurance.tier})
                </span>
                <span className="text-[11px] text-slate-500">
                  Policy #{patient.insurance.policyNumber} · Direct Settlement Desk
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded">
              Pre-Approved
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || bookingConfirmed}
            className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm transition active:scale-98 shadow-md flex items-center justify-center gap-2 min-h-[48px]"
          >
            {bookingConfirmed ? (
              <>
                <Check className="w-5 h-5" />
                <span>Appointment Confirmed! Redirecting to Journey...</span>
              </>
            ) : isSubmitting ? (
              <span>Verifying Hospital Calendar & Slot Availability...</span>
            ) : (
              <>
                <CalendarCheck className="w-4 h-4" />
                <span>Confirm Specialist Ultrasound Appointment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
