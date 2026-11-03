import { PatientProfile, ScanReport, Appointment, KickCounterSession, BloodPressureLog } from '../types';

export const DOCTOR_PROFILE = {
  name: 'Dr. Tariq Al-Hashimi',
  title: 'Consultant Obstetrician, Gynecologist & Maternal-Fetal Medicine Specialist',
  qualifications: 'MD, FRCOG (London), Dip. Fetal Medicine (FMF UK)',
  experience: '18+ Years Specialized Clinical Experience',
  fmfCertificationId: 'FMF-UK-94218',
  bio: 'Specialist in advanced prenatal ultrasound diagnostics, 11-13w nuchal translucency, 20-week anomaly screening, fetal echocardiography, and high-risk maternal-fetal medicine. Trained at Kings College Hospital Fetal Medicine Centre, London.',
  specialties: [
    'First Trimester Combined Screening (NT Scan & NIPT)',
    'Detailed Fetal Anomaly / Target Scan (18-22 Weeks)',
    'Fetal Doppler Velocimetry & Growth Restriction',
    'Fetal Echocardiography & Cardiac Anomaly Detection',
    '3D/4D HD-Live High-Definition Sonography',
    'Cervical Incompetence & Preterm Prevention',
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
    'Integrated with Malaffi & Nabidh Health Exchanges'
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

export const INITIAL_PATIENT: PatientProfile = {
  id: 'pt-78921',
  name: 'Sarah Al-Maktoum',
  mrn: 'MC-DXB-984210',
  emiratesId: '784-1994-8291044-3',
  dob: '1994-06-14',
  lmpDate: '2026-05-28',
  eddDate: '2027-03-05',
  currentGestationalWeeks: 22,
  currentGestationalDays: 4,
  babyGender: 'Baby Boy',
  fetalCount: 'Singleton',
  bloodGroup: 'O Positive',
  insurance: {
    network: 'Daman Premier / Thiqa Enhanced',
    policyNumber: 'DMN-UAE-9418290-A',
    tier: 'VIP Comprehensive Care'
  },
  highRiskFactors: [
    'Gestational Diabetes Screen Pending (Week 24)',
    'Borderline Uterine Artery Resistance at 12w (Now Resolved)'
  ]
};

export const PAST_SCAN_REPORTS: ScanReport[] = [
  {
    id: 'scan-02',
    scanType: 'anomaly_scan',
    title: 'Detailed Fetal Anomaly / Morphology Scan (20-22w)',
    gestationalAge: '22 Weeks 2 Days',
    date: '2026-10-31',
    doctorName: 'Dr. Tariq Al-Hashimi',
    clinicLocation: 'Mediclinic City Hospital, DHCC Dubai',
    summary: 'Complete detailed structural anatomical survey performed according to ISUOG & FMF protocols. Fetal anatomy demonstrated normal intracranial structures, intact facial profile, normal four-chamber heart and outflow tracts, intact diaphragm, normal kidneys, stomach bubble, bladder, and four-limb biometry. Normal umbilical cord insertion with three vessels.',
    biometrics: {
      bpdMm: 54.2,
      hcMm: 201.8,
      acMm: 178.4,
      flMm: 38.6,
      efwGrams: 485,
      efwPercentile: 52,
      afiCm: 14.5,
      placentaLocation: 'Anterior High, Grade 0 (Clear of Internal Os by 42mm)',
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
        gestationalWeek: '22w2d',
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
        gestationalWeek: '22w2d',
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
        gestationalWeek: '22w2d',
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
        gestationalWeek: '22w2d',
        dimensions: 'Spectral Waveform PI: 1.04',
        description: 'Positive continuous end-diastolic flow throughout cardiac cycle. Low-resistance placental circulation normal for 22 weeks.',
        isNormal: true,
        type: 'doppler'
      }
    ],
    status: 'Completed',
    malaffiRefId: 'MAL-2026-DXB-98412',
    nabidhRefId: 'NBD-UAE-082919',
    recommendations: [
      'Normal anatomical survey; no evidence of structural fetal defect.',
      'Routine prenatal care with oral iron, folic acid, and prenatal multivitamins.',
      'Schedule 75g Oral Glucose Tolerance Test (OGTT) for gestational diabetes between 24 and 26 weeks.',
      'Next routine growth & Doppler ultrasound scheduled at 28-30 weeks.'
    ]
  },
  {
    id: 'scan-01',
    scanType: 'nt_scan',
    title: 'First Trimester NT Scan & Combined Aneuploidy Screening',
    gestationalAge: '12 Weeks 4 Days',
    date: '2026-08-25',
    doctorName: 'Dr. Tariq Al-Hashimi',
    clinicLocation: 'Advanced Fetal Medicine Centre, Abu Dhabi',
    summary: 'Nuchal Translucency measured at 1.4 mm (CRL 62.4 mm, within low-risk range < 95th centile). Nasal bone present. Normal ductus venosus pulsatility index. Low risk for Trisomy 21 (< 1:10,000) and Trisomy 18/13 (< 1:20,000).',
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
      'Aneuploidy risk categorized as very low.',
      'Proceed to 20-22 week detailed structural scan.'
    ]
  }
];

export const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    scanType: 'growth_doppler',
    title: 'Fetal Growth & Wellbeing Doppler Scan (28-30w)',
    date: '2026-12-15',
    time: '11:30 AM',
    durationMinutes: 40,
    clinic: 'Mediclinic City Hospital - Dubai Healthcare City',
    clinicAddress: 'Building 37, Floor 2, Suite 204, DHCC Dubai',
    doctor: 'Dr. Tariq Al-Hashimi',
    status: 'Confirmed',
    gestationalTarget: '28 Weeks 4 Days',
    preparationNotes: 'Have a light meal 45 minutes prior to appointment to stimulate fetal movements. Drink 500ml water (bladder does not need to be uncomfortably full).',
    insurancePreAuth: {
      provider: 'Daman / Thiqa',
      status: 'Pre-Approved',
      authCode: 'DMN-AUTH-2026-89102'
    }
  },
  {
    id: 'apt-02',
    scanType: '3d_4d_hd',
    title: '3D/4D HD-Live Keepsake Scan & Bonding Experience',
    date: '2027-01-08',
    time: '02:00 PM',
    durationMinutes: 30,
    clinic: 'Mediclinic City Hospital - Dubai Healthcare City',
    clinicAddress: 'Building 37, Floor 2, Suite 204, DHCC Dubai',
    doctor: 'Dr. Tariq Al-Hashimi',
    status: 'Pending Approval',
    gestationalTarget: '32 Weeks 0 Days',
    preparationNotes: 'Bring your spouse / family members (up to 3 guests welcome in the suite). High-definition video recording will be provided directly to your mobile app.',
    insurancePreAuth: {
      provider: 'Self-Pay / Optional',
      status: 'Self-Pay'
    }
  }
];

export const INITIAL_KICK_SESSIONS: KickCounterSession[] = [
  {
    id: 'kick-1',
    date: '2026-11-02',
    startTime: '08:30 PM',
    durationMinutes: 24,
    totalKicks: 10,
    notes: 'Very energetic after dinner! Felt strong flutter and roll.'
  },
  {
    id: 'kick-2',
    date: '2026-11-01',
    startTime: '09:10 PM',
    durationMinutes: 31,
    totalKicks: 10,
    notes: 'Gentle nudges while resting on the left side.'
  },
  {
    id: 'kick-3',
    date: '2026-10-31',
    startTime: '07:45 PM',
    durationMinutes: 19,
    totalKicks: 10,
    notes: 'Baby started kicking right after warm milk.'
  }
];

export const INITIAL_BP_LOGS: BloodPressureLog[] = [
  {
    id: 'bp-1',
    date: '2026-11-02',
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
    notes: 'Measured in clinic during 22w scan visit.'
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

export const PREGNANCY_MILESTONES = [
  {
    weekRange: '11 - 13+6 w',
    title: 'First Trimester Screening & NT Scan',
    purpose: 'Nuchal translucency measurement, chromosomal risk (Down syndrome), nasal bone check & early anatomy.',
    completed: true,
    targetWeek: 12
  },
  {
    weekRange: '18 - 22 w',
    title: 'Detailed Fetal Anomaly / Target Scan',
    purpose: 'Complete organ-by-organ check (brain, heart chambers, kidneys, spine, limbs, facial features, placenta position).',
    completed: true,
    isCurrent: true,
    targetWeek: 22
  },
  {
    weekRange: '24 - 28 w',
    title: 'Gestational Diabetes & Cervical Monitoring',
    purpose: '75g OGTT blood test, cervical length re-evaluation, maternal blood pressure profile.',
    completed: false,
    isNext: true,
    targetWeek: 26
  },
  {
    weekRange: '28 - 32 w',
    title: 'Fetal Growth & Doppler Velocimetry',
    purpose: 'Assessing fetal growth trajectory, amniotic fluid volume, umbilical artery and middle cerebral artery Doppler flow.',
    completed: false,
    targetWeek: 30
  },
  {
    weekRange: '36+ w',
    title: 'Term Presentation & Delivery Plan',
    purpose: 'Confirming cephalic fetal position, estimated birth weight, placental clearance, and birth pathway consultation.',
    completed: false,
    targetWeek: 36
  }
];
