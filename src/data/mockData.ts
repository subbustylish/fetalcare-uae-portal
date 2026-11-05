import { 
  PatientProfile, 
  ScanReport, 
  Appointment, 
  KickCounterSession, 
  BloodPressureLog,
  ScanType
} from '../types';
import { calculateGestationalAge, parseDateIso } from '../utils/datingEngine';
import { CLINICAL_RULES } from '../config/clinicalRules';

// Reference date for simulation consistency
export const CURRENT_SIMULATION_DATE = '2026-11-04';

export const DOCTOR_PROFILE = {
  name: 'Dr. Tariq Al-Hashimi',
  title: 'Consultant Obstetrician, Gynecologist & Maternal-Fetal Medicine Specialist',
  qualifications: 'MD, FRCOG (London), Dip. Fetal Medicine (FMF UK)',
  experience: '18+ Years Specialized Clinical Experience',
  fmfCertificationId: 'FMF-UK-94218',
  bio: 'Specialist in advanced prenatal ultrasound diagnostics, 11-13w nuchal translucency, 18-22 week anomaly screening, fetal echocardiography, and high-risk maternal-fetal medicine. Trained at Kings College Hospital Fetal Medicine Centre, London.',
  specialties: [
    'First Trimester Combined Screening (NT Scan & NIPT, 11–13+6w)',
    'Detailed Fetal Anomaly / Target Scan (18–22 Weeks, CPT 76811)',
    'Third Trimester Growth Scan (34–36 Weeks, CPT 76805)',
    'Fetal Doppler Velocimetry & Growth Restriction (CPT 76816/76820)',
    'Fetal Echocardiography & Cardiac Anomaly Detection',
    'Cervical Surveillance & Preterm Prevention (14–26 Weeks, CPT 76817)',
    'Multiple Pregnancy Care (MCDA / DCDA Twins)'
  ],
  clinics: [
    {
      name: 'Mediclinic City Hospital - Dubai Healthcare City',
      location: 'Building 37, Dubai Healthcare City, Dubai, UAE',
      days: 'Mon, Wed, Thu (9:00 AM - 5:00 PM)',
      phone: '+971 4 435 9999'
    },
    {
      name: 'Advanced Fetal Medicine Centre - Abu Dhabi',
      location: 'Al Bateen Medical District, Abu Dhabi, UAE',
      days: 'Tue, Sat (10:00 AM - 6:00 PM)',
      phone: '+971 2 614 2000'
    }
  ],
  accreditations: [
    'Fetal Medicine Foundation (FMF), London Certified',
    'Royal College of Obstetricians & Gynaecologists (FRCOG UK)',
    'Department of Health - Abu Dhabi (DoH) Consultant License',
    'Dubai Health Authority (DHA) Consultant License',
    'Fellow of Maternal-Fetal Medicine (ISUOG)'
  ],
  acceptedInsurances: [
    'Daman / Thiqa Network',
    'NextCare (Gold / VIP)',
    'AXA / GIG Gulf Healthcare',
    'MetLife Premium Health',
    'Bupa Global / Oman Insurance',
    'Cigna Global Medical'
  ]
};

// ==========================================
// 4 SPEC-COMPLIANT DEMO PATIENTS (Section 17)
// ==========================================

export interface DemoPatientData {
  profile: PatientProfile;
  pastScans: ScanReport[];
  appointments: Appointment[];
  kickSessions: KickCounterSession[];
  bpLogs: BloodPressureLog[];
  clinicalNotes: string;
}

// 1. SARAH AL-MAKTOUM: Low-risk, ~22w, normal anatomy scan -> routine pathway only
const sarahGa = calculateGestationalAge('2027-03-08', parseDateIso(CURRENT_SIMULATION_DATE));
export const PATIENT_SARAH: PatientProfile = {
  id: 'pt-sarah',
  name: 'Sarah Al-Maktoum',
  mrn: 'MC-DXB-984210',
  emiratesId: '784-1994-8291044-3',
  dob: '1994-06-14',
  lmpDate: '2026-05-31',
  eddDate: '2027-03-08',
  currentGestationalWeeks: sarahGa.weeks,
  currentGestationalDays: sarahGa.days,
  babyGender: 'Baby Boy',
  fetalCount: 'Singleton',
  bloodGroup: 'O Positive',
  insurance: {
    network: 'Daman Premier / Thiqa Enhanced',
    policyNumber: 'DMN-UAE-9418290-A',
    tier: 'VIP Comprehensive Care'
  },
  highRiskFactors: [],
  lmpCertain: true,
  cycleLengthDays: 28,
  conceptionType: 'natural',
  eddMethod: 'CRL',
  eddLocked: true,
  carePathway: 'low_risk_primary',
  facility: 'Dubai',
  bmi: 23.4,
  age: 32,
  cptCodesOnActiveCarePlan: ['76801', '76813', '76811', '76805']
};

// 2. NOURA AL-ZAABI: Previous CS, placenta 14 mm from os at 20w -> placenta pathway + FM referral
const nouraGa = calculateGestationalAge('2027-02-03', parseDateIso(CURRENT_SIMULATION_DATE));
export const PATIENT_NOURA: PatientProfile = {
  id: 'pt-noura',
  name: 'Noura Al-Zaabi',
  mrn: 'AFM-AUH-441029',
  emiratesId: '784-1991-3190842-1',
  dob: '1991-09-22',
  lmpDate: '2026-04-28',
  eddDate: '2027-02-03',
  currentGestationalWeeks: nouraGa.weeks,
  currentGestationalDays: nouraGa.days,
  babyGender: 'Baby Girl',
  fetalCount: 'Singleton',
  bloodGroup: 'A Positive',
  insurance: {
    network: 'Daman / Thiqa Network',
    policyNumber: 'THQ-AUH-771890-B',
    tier: 'Government Thiqa Comprehensive'
  },
  highRiskFactors: [
    'Previous Cesarean Section (uterine scar)',
    'Low-lying placenta (14 mm from internal cervical os at 20w anatomy scan)',
    'Placenta accreta spectrum risk surveillance (USG 6.5.4.7)'
  ],
  lmpCertain: true,
  cycleLengthDays: 28,
  conceptionType: 'natural',
  eddMethod: 'CRL',
  eddLocked: true,
  carePathway: 'fetal_medicine',
  facility: 'Abu Dhabi',
  bmi: 26.8,
  age: 35,
  cptCodesOnActiveCarePlan: ['76811', '76816', '76817']
};

// 3. MARYAM MANSOOR: MCDA twins -> fortnightly scans from 16w, UA+MCA from 20w, FM referral
const maryamGa = calculateGestationalAge('2027-03-24', parseDateIso(CURRENT_SIMULATION_DATE));
export const PATIENT_MARYAM: PatientProfile = {
  id: 'pt-maryam',
  name: 'Maryam Mansoor',
  mrn: 'AFM-AUH-882194',
  emiratesId: '784-1996-5519821-4',
  dob: '1996-03-12',
  lmpDate: '2026-06-17',
  eddDate: '2027-03-24',
  currentGestationalWeeks: maryamGa.weeks,
  currentGestationalDays: maryamGa.days,
  babyGender: 'Surprise',
  fetalCount: 'Twins',
  bloodGroup: 'B Positive',
  insurance: {
    network: 'AXA / GIG Gulf Healthcare',
    policyNumber: 'GIG-UAE-559102-M',
    tier: 'Platinum Worldwide'
  },
  highRiskFactors: [
    'Monochorionic Diamniotic (MCDA) Twin Pregnancy',
    'Shared Placenta: Risk of TTTS, sFGR, TAPS, and TRAP (USG 6.9.2)',
    'Fortnightly ultrasound surveillance from 16w indicated (USG App.4)'
  ],
  lmpCertain: true,
  cycleLengthDays: 28,
  conceptionType: 'natural',
  eddMethod: 'CRL',
  eddLocked: true,
  carePathway: 'fetal_medicine',
  facility: 'Abu Dhabi',
  bmi: 24.1,
  age: 30,
  cptCodesOnActiveCarePlan: ['76801', '76802', '76816', '76820', '76821', '76817']
};

// 4. AISHA AL-SUWAIDI: Age 41, BMI 37, PAPP-A 0.32 MoM -> high-risk, serial growth scans, aspirin 150mg nightly, NIPT offered
const aishaGa = calculateGestationalAge('2027-05-12', parseDateIso(CURRENT_SIMULATION_DATE));
export const PATIENT_AISHA: PatientProfile = {
  id: 'pt-aisha',
  name: 'Aisha Al-Suwaidi',
  mrn: 'MC-DXB-104928',
  emiratesId: '784-1985-1109482-9',
  dob: '1985-04-18',
  lmpDate: '2026-08-05',
  eddDate: '2027-05-12',
  currentGestationalWeeks: aishaGa.weeks,
  currentGestationalDays: aishaGa.days,
  babyGender: 'Surprise',
  fetalCount: 'Singleton',
  bloodGroup: 'O Negative',
  insurance: {
    network: 'Daman Premier',
    policyNumber: 'DMN-DXB-334918-X',
    tier: 'Executive Comprehensive'
  },
  highRiskFactors: [
    'Maternal Age >= 40 (Age 41) [STD App.2, USG App.5]',
    'Obesity Class II (BMI 37.2) [STD App.2, USG App.5]',
    'Low PAPP-A (0.32 MoM < 0.40 MoM) - High risk for FGR & Pre-eclampsia [USG App.5]',
    'Prescribed Aspirin 150 mg once daily at night (STD App.1 11-14w)',
    'Eligible for NIPT aneuploidy screening (STD App.3)'
  ],
  lmpCertain: true,
  cycleLengthDays: 28,
  conceptionType: 'natural',
  eddMethod: 'CRL',
  eddLocked: true,
  carePathway: 'obstetric_led',
  facility: 'Dubai',
  bmi: 37.2,
  age: 41,
  cptCodesOnActiveCarePlan: ['76801', '76813', '76811', '76816', '93975']
};

export const DEMO_PATIENTS: Record<string, PatientProfile> = {
  'pt-sarah': PATIENT_SARAH,
  'pt-noura': PATIENT_NOURA,
  'pt-maryam': PATIENT_MARYAM,
  'pt-aisha': PATIENT_AISHA
};

// Default active patient
export const INITIAL_PATIENT: PatientProfile = PATIENT_SARAH;

// Completed visits per demo patient for DOH schedule tracker
export const DEMO_COMPLETED_VISITS: Record<string, Record<string, { dateDone: string; clinician: string; vitals?: any }>> = {
  'pt-sarah': {
    'booking': {
      dateDone: '2026-08-05',
      clinician: 'Dr. Tariq Al-Hashimi',
      vitals: { bp: '112/70', weightKg: 62.4, urineDipstick: 'NAD (Protein Nil, Glucose Nil)' }
    },
    '11_14w': {
      dateDone: '2026-08-25',
      clinician: 'Dr. Tariq Al-Hashimi',
      vitals: { bp: '114/72', weightKg: 63.1, urineDipstick: 'NAD' }
    },
    '16_18w': {
      dateDone: '2026-09-28',
      clinician: 'Dr. Tariq Al-Hashimi',
      vitals: { bp: '116/74', weightKg: 64.5, urineDipstick: 'NAD' }
    }
  },
  'pt-noura': {
    'booking': { dateDone: '2026-06-25', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '118/76', weightKg: 68.2 } },
    '11_14w': { dateDone: '2026-07-20', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '120/78', weightKg: 69.0 } },
    '16_18w': { dateDone: '2026-08-28', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '118/75', weightKg: 70.4 } },
    '19_23w': { dateDone: '2026-09-22', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '122/80', weightKg: 71.8 } },
    '25w': { dateDone: '2026-10-18', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '120/78', weightKg: 73.0 } }
  },
  'pt-maryam': {
    'booking': { dateDone: '2026-08-15', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '110/68', weightKg: 58.5 } },
    '11_14w': { dateDone: '2026-09-08', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '112/70', weightKg: 59.8 } },
    '16_18w': { dateDone: '2026-10-06', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '115/72', weightKg: 61.2 } }
  },
  'pt-aisha': {
    'booking': { dateDone: '2026-10-12', clinician: 'Dr. Tariq Al-Hashimi', vitals: { bp: '132/84', weightKg: 96.2, urineDipstick: 'Trace Protein' } }
  }
};

// ==========================================
// SCANS & REPORTS (with DOH CPT Codes & Rules)
// ==========================================

export const PAST_SCAN_REPORTS: ScanReport[] = [
  {
    id: 'scan-02',
    scanType: 'anomaly_scan',
    title: 'Detailed Fetal Anomaly / Target Scan (18–22w) [CPT 76811]',
    gestationalAge: '21 Weeks 5 Days',
    date: '2026-10-31',
    doctorName: 'Dr. Tariq Al-Hashimi',
    clinicLocation: 'Mediclinic City Hospital, DHCC Dubai',
    summary: 'Complete detailed structural anatomical survey performed according to DOH Antenatal Ultrasound Guidelines (Appendix 3) and ISUOG/FMF protocols. Transthalamic head circumference, transcerebellar plane, atrial Vp, facial profile, 4-chamber heart, outflow tracts, 3-vessel view, stomach, kidneys, bladder, 3-vessel cord, spine, and all extremities demonstrated normal structure. Placental leading edge is 42 mm from internal os.',
    biometrics: {
      bpdMm: 54.2,
      hcMm: 201.8,
      acMm: 178.4,
      flMm: 38.6,
      efwGrams: 485,
      efwPercentile: 52,
      afiCm: 14.5,
      placentaLocation: 'Anterior High, Grade 0 (Clear of Internal Os by 42 mm)',
      cervicalLengthMm: 39.2,
      fetalHeartRateBpm: 146,
      umbilicalArteryPI: 1.04,
      middleCerebralArteryPI: 1.88
    },
    images: [
      {
        id: 'img-3d-face',
        title: '3D HD-Live Fetal Face & Forehead',
        category: '3D Face',
        date: '2026-10-31',
        gestationalWeek: '21w5d',
        dimensions: 'HD 2048x1536 Sonogram',
        description: 'Clear visualization of fetal nose, lips, closed eyelids, and ear position. Baby was active with hand resting near the cheek.',
        isNormal: true,
        type: '3d'
      },
      {
        id: 'img-2d-profile',
        title: 'Mid-Sagittal Facial Profile & Nasal Bone',
        category: 'Spine Profile',
        date: '2026-10-31',
        gestationalWeek: '21w5d',
        dimensions: '2D Caliper Verified',
        description: 'Normal nasal bone present (6.4mm). Intact palate and normal prefrontal angle. No micrognathia.',
        isNormal: true,
        type: 'profile'
      },
      {
        id: 'img-4ch-heart',
        title: 'Four-Chamber Cardiac View & Outflow Tracts',
        category: 'Anatomy 2D',
        date: '2026-10-31',
        gestationalWeek: '21w5d',
        dimensions: 'Fetal Echo Standard',
        description: 'Symmetric right and left ventricles with intact interventricular septum. Normal crossing of great arteries (Aorta and Pulmonary trunk).',
        isNormal: true,
        type: '2d'
      },
      {
        id: 'img-doppler-cord',
        title: 'Umbilical Artery Color Doppler Spectral Waveform',
        category: 'Doppler Flow',
        date: '2026-10-31',
        gestationalWeek: '21w5d',
        dimensions: 'Spectral Waveform PI: 1.04',
        description: 'Positive continuous end-diastolic flow throughout cardiac cycle. Low-resistance placental circulation normal for gestation.',
        isNormal: true,
        type: 'doppler'
      }
    ],
    status: 'Completed',
    malaffiRefId: 'MAL-2026-DXB-98412',
    nabidhRefId: 'NBD-UAE-082919',
    recommendations: [
      'Normal anatomical survey; no evidence of structural fetal defect (CPT 76811 complete).',
      'Routine prenatal care with oral iron, folic acid, and prenatal multivitamins.',
      'Schedule 75g Oral Glucose Tolerance Test (OGTT) for gestational diabetes between 24 and 28 weeks (STD App.1).',
      'Schedule routine low-risk Third Trimester Growth Scan at 34–36 weeks (USG 6.1.4, CPT 76805).'
    ]
  },
  {
    id: 'scan-01',
    scanType: 'nt_scan',
    title: 'First Trimester Dating & NT Scan (11–13+6w) [CPT 76801 + 76813]',
    gestationalAge: '12 Weeks 4 Days',
    date: '2026-08-25',
    doctorName: 'Dr. Tariq Al-Hashimi',
    clinicLocation: 'Advanced Fetal Medicine Centre, Abu Dhabi',
    summary: 'Accurate CRL dating confirmed at 62.4 mm (equivalent to 12w4d, variation with certain LMP was 2 days, within the 5-day threshold; EDD finalized and locked at 2027-03-08 per STD App.1). Nuchal Translucency measured at 1.4 mm (< 95th centile). Nasal bone present. Normal ductus venosus pulsatility index. Low risk for Trisomy 21 (< 1:10,000) and Trisomy 18/13 (< 1:20,000).',
    biometrics: {
      bpdMm: 21.0,
      hcMm: 78.0,
      acMm: 63.0,
      flMm: 9.2,
      efwGrams: 64,
      efwPercentile: 50,
      afiCm: 11.2,
      placentaLocation: 'Posterior, normal thickness',
      cervicalLengthMm: 41.0,
      fetalHeartRateBpm: 158
    },
    images: [
      {
        id: 'img-nt-1',
        title: 'Nuchal Translucency Caliper Measurement (1.4mm)',
        category: 'Anatomy 2D',
        date: '2026-08-25',
        gestationalWeek: '12w4d',
        dimensions: 'CRL 62.4mm / NT 1.4mm',
        description: 'Optimal magnification showing translucent subcutaneous fluid behind fetal neck.',
        isNormal: true,
        type: '2d'
      }
    ],
    status: 'Completed',
    malaffiRefId: 'MAL-2026-AUH-77192',
    nabidhRefId: 'NBD-UAE-011284',
    recommendations: [
      'Aneuploidy risk categorized as very low based on combined screening.',
      'EDD locked at 2027-03-08 per DOH Antenatal Care Standard.',
      'Proceed to detailed 18–22 week structural anatomy scan (CPT 76811).'
    ]
  }
];

// Helper to calculate gestational age dynamically for an appointment
export function getAppointmentTargetGa(aptDateIso: string, eddIso: string): string {
  const ga = calculateGestationalAge(eddIso, parseDateIso(aptDateIso));
  return `${ga.weeks} Weeks ${ga.days} Days`;
}

// ==========================================
// UPCOMING APPOINTMENTS (Section 1 Fixes 3, 4, 7, 8)
// ==========================================

export const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    scanType: 'routine_growth_34_36',
    title: 'Third Trimester Growth Scan (34–36w) [CPT 76805]',
    date: '2027-01-26',
    time: '11:00 AM',
    durationMinutes: 35,
    clinic: 'Mediclinic City Hospital - Dubai Healthcare City',
    clinicAddress: 'Building 37, Floor 2, Suite 204, DHCC Dubai',
    doctor: 'Dr. Tariq Al-Hashimi',
    status: 'Confirmed',
    gestationalTarget: '34 Weeks 1 Day', // Computed dynamically in component
    preparationNotes: 'Routine low-risk ultrasound (DOH USG 6.1.4) to evaluate fetal growth trajectory, presentation, amniotic fluid, and placental clearance.',
    insurancePreAuth: {
      provider: 'Daman / Thiqa',
      status: 'Pre-Approved',
      authCode: 'DMN-AUTH-2027-34019'
    }
  },
  {
    id: 'apt-02',
    scanType: '3d_4d_hd',
    title: '3D/4D HD-Live Keepsake & Bonding Scan [CPT 76815]',
    date: '2026-12-15',
    time: '02:00 PM',
    durationMinutes: 30,
    clinic: 'Mediclinic City Hospital - Dubai Healthcare City',
    clinicAddress: 'Building 37, Floor 2, Suite 204, DHCC Dubai',
    doctor: 'Dr. Tariq Al-Hashimi',
    status: 'Confirmed',
    gestationalTarget: '28 Weeks 1 Day',
    preparationNotes: 'Elective keepsake 3D/4D facial imaging. Up to 3 family members welcome. Video clips exported directly to your mobile app.',
    insurancePreAuth: {
      provider: 'Self-Pay / Elective',
      status: 'Self-Pay'
    }
  }
];

export const INITIAL_KICK_SESSIONS: KickCounterSession[] = [
  {
    id: 'kick-1',
    date: '2026-11-04',
    startTime: '08:30 PM',
    durationMinutes: 24,
    totalKicks: 10,
    notes: 'Very energetic after dinner! Felt strong flutter and roll.'
  },
  {
    id: 'kick-2',
    date: '2026-11-03',
    startTime: '09:10 PM',
    durationMinutes: 31,
    totalKicks: 10,
    notes: 'Gentle nudges while resting on the left side.'
  },
  {
    id: 'kick-3',
    date: '2026-11-02',
    startTime: '07:45 PM',
    durationMinutes: 19,
    totalKicks: 10,
    notes: 'Baby started kicking right after warm milk.'
  }
];

export const INITIAL_BP_LOGS: BloodPressureLog[] = [
  {
    id: 'bp-1',
    date: '2026-11-04',
    time: '09:00 AM',
    systolic: 114,
    diastolic: 72,
    pulse: 78,
    status: 'Normal',
    notes: 'Morning measurement before breakfast. Felt rested.'
  },
  {
    id: 'bp-2',
    date: '2026-10-31',
    time: '11:15 AM',
    systolic: 118,
    diastolic: 76,
    pulse: 82,
    status: 'Normal',
    notes: 'Measured in clinic during 21w5d anatomy scan.'
  },
  {
    id: 'bp-3',
    date: '2026-10-28',
    time: '06:30 PM',
    systolic: 122,
    diastolic: 79,
    pulse: 80,
    status: 'Normal',
    notes: 'Evening check after work.'
  }
];

// ==========================================
// PREGNANCY MILESTONES (Section 1 Fixes 2, 3, 4, 6)
// ==========================================

export const PREGNANCY_MILESTONES = [
  {
    weekRange: '11+0 – 13+6 w',
    title: 'First Trimester Dating & NT Scan (CPT 76801 + 76813)',
    purpose: 'Accurate CRL dating, nuchal translucency measurement, chromosomal risk screening, and EDD finalization (DOH USG 6.1.2).',
    completed: true,
    targetWeek: 12
  },
  {
    weekRange: '18+0 – 22+6 w',
    title: 'Detailed Fetal Anatomy / Target Scan (CPT 76811)',
    purpose: 'Detailed 22-point organ-by-organ structural survey (brain, heart chambers, kidneys, spine, limbs, placenta position) (DOH USG 6.4.1).',
    completed: true,
    isCurrent: true,
    targetWeek: 20
  },
  {
    weekRange: '24+0 – 28+0 w',
    title: 'Gestational Diabetes Screening (OGTT 24–28w)',
    purpose: '75g Oral Glucose Tolerance Test (OGTT), repeat CBC and red cell antibody check (DOH STD App.1).',
    completed: false,
    isNext: true,
    targetWeek: 26
  },
  {
    weekRange: '34+0 – 36+6 w',
    title: 'Third Trimester Growth Scan (CPT 76805)',
    purpose: 'Routine third-trimester ultrasound for low-risk pregnancies to detect late-onset FGR, assess amniotic fluid, and verify presentation (DOH USG 6.1.4).',
    completed: false,
    targetWeek: 35
  },
  {
    weekRange: '36+0 w',
    title: 'Term Presentation & GBS Culture',
    purpose: 'Group B Strep (GBS) culture (>= 35w), delivery planning, and weekly clinical reviews until birth (DOH STD App.1).',
    completed: false,
    targetWeek: 36
  }
];
