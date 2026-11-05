/**
 * Section 16: Consent, Audit Log, RBAC & Security Compliance
 * References: DOH STD 3.2.1.2, USG 3.4, UAE Health Data Law
 */

export interface ScreeningConsentRecord {
  id: string;
  patientId: string;
  patientName: string;
  screeningName: string;
  category: 'ultrasound' | 'genetics' | 'metabolic' | 'postnatal' | 'invasive';
  status: 'offered' | 'accepted' | 'declined';
  offeredDate: string;
  decisionDate?: string;
  clinicianName: string;
  clinicianRole: string;
  declinedReason?: string;
  informationLeafletProvided: boolean;
  signatureReference: string;
  dohStandard: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  role: 'Consultant OB/GYN' | 'MFM Subspecialist' | 'Sonographer' | 'Registered Midwife' | 'Clinical Administrator';
  actionType: 'CLINICAL_DECISION' | 'SCAN_REPORT_SIGNED' | 'OVERRIDE_ALERT' | 'CONSENT_RECORDED' | 'EFW_BIOMETRY_SAVED' | 'HIE_LOOKUP';
  patientId: string;
  patientName: string;
  facility: 'Abu Dhabi' | 'Dubai';
  details: string;
  cryptographicHash: string; // SHA-256 simulation for immutable chain
}

export interface MalaffiNabidhRecord {
  nationalHieId: string;
  sourceAuthority: 'Malaffi (Abu Dhabi HIE)' | 'NABIDH (Dubai HIE)';
  emiratesId: string;
  patientName: string;
  lastEncounterDate: string;
  linkedFacility: string;
  availableRecords: {
    priorPregnanciesCount: number;
    knownAllergies: string[];
    chronicConditions: string[];
    recentUltrasounds: string[];
    recentLabWork: string[];
  };
  consentStatus: 'Active HIE Consent' | 'Opted-Out';
  complianceSeal: string;
}

export const INITIAL_SCREENING_CONSENTS: ScreeningConsentRecord[] = [
  {
    id: 'cst-01',
    patientId: 'pt-sarah',
    patientName: 'Sarah Al-Maktoum',
    screeningName: 'Combined First Trimester Screening (NT + PAPP-A / Free β-hCG)',
    category: 'ultrasound',
    status: 'accepted',
    offeredDate: '2026-08-05',
    decisionDate: '2026-08-05',
    clinicianName: 'Dr. Tariq Al-Hashimi',
    clinicianRole: 'Consultant OB/GYN & MFM',
    informationLeafletProvided: true,
    signatureReference: 'SIG-DOH-2026-SARAH-01',
    dohStandard: 'STD 3.2.1.2'
  },
  {
    id: 'cst-02',
    patientId: 'pt-sarah',
    patientName: 'Sarah Al-Maktoum',
    screeningName: 'Second Trimester 23-Point Detailed Fetal Anomaly Scan (18–22w)',
    category: 'ultrasound',
    status: 'accepted',
    offeredDate: '2026-08-25',
    decisionDate: '2026-08-25',
    clinicianName: 'Dr. Tariq Al-Hashimi',
    clinicianRole: 'Consultant OB/GYN & MFM',
    informationLeafletProvided: true,
    signatureReference: 'SIG-DOH-2026-SARAH-02',
    dohStandard: 'USG 6.4 & STD 3.2.1.2'
  },
  {
    id: 'cst-03',
    patientId: 'pt-sarah',
    patientName: 'Sarah Al-Maktoum',
    screeningName: '75g Oral Glucose Tolerance Test (OGTT at 24–28w)',
    category: 'metabolic',
    status: 'accepted',
    offeredDate: '2026-09-28',
    decisionDate: '2026-09-28',
    clinicianName: 'Dr. Tariq Al-Hashimi',
    clinicianRole: 'Consultant OB/GYN & MFM',
    informationLeafletProvided: true,
    signatureReference: 'SIG-DOH-2026-SARAH-03',
    dohStandard: 'STD App.1'
  },
  {
    id: 'cst-04',
    patientId: 'pt-aisha',
    patientName: 'Aisha Al-Nuaimi',
    screeningName: 'Non-Invasive Prenatal Testing (NIPT / cfDNA Screen)',
    category: 'genetics',
    status: 'accepted',
    offeredDate: '2026-10-14',
    decisionDate: '2026-10-14',
    clinicianName: 'Dr. Tariq Al-Hashimi',
    clinicianRole: 'Consultant OB/GYN & MFM',
    informationLeafletProvided: true,
    signatureReference: 'SIG-DOH-2026-AISHA-NIPT',
    dohStandard: 'STD App.3 (Maternal Age >= 35)'
  },
  {
    id: 'cst-05',
    patientId: 'pt-aisha',
    patientName: 'Aisha Al-Nuaimi',
    screeningName: 'Invasive Genetic Diagnostic Testing (CVS / Amniocentesis)',
    category: 'invasive',
    status: 'declined',
    offeredDate: '2026-10-14',
    decisionDate: '2026-10-15',
    clinicianName: 'Dr. Tariq Al-Hashimi',
    clinicianRole: 'Consultant OB/GYN & MFM',
    declinedReason: 'Mother elected non-invasive cfDNA screening first; risks of miscarriage (<0.5%) discussed and declined.',
    informationLeafletProvided: true,
    signatureReference: 'SIG-DOH-2026-AISHA-DECLINE',
    dohStandard: 'STD 3.2.1.2 & USG App.6'
  },
  {
    id: 'cst-06',
    patientId: 'pt-noura',
    patientName: 'Noura Al-Mansoor',
    screeningName: 'Transvaginal Ultrasound for Low Placenta / Vasa Previa (CPT 76817)',
    category: 'ultrasound',
    status: 'accepted',
    offeredDate: '2026-09-15',
    decisionDate: '2026-09-15',
    clinicianName: 'Dr. Tariq Al-Hashimi',
    clinicianRole: 'Consultant OB/GYN & MFM',
    informationLeafletProvided: true,
    signatureReference: 'SIG-DOH-2026-NOURA-TVS',
    dohStandard: 'USG 6.5.4 & STD 3.2.1.2'
  },
  {
    id: 'cst-07',
    patientId: 'pt-maryam',
    patientName: 'Maryam Al-Zaabi',
    screeningName: 'Fortnightly Fetal Doppler & TTTS Surveillance for MCDA Twins',
    category: 'ultrasound',
    status: 'accepted',
    offeredDate: '2026-09-02',
    decisionDate: '2026-09-02',
    clinicianName: 'Dr. Tariq Al-Hashimi',
    clinicianRole: 'Consultant OB/GYN & MFM',
    informationLeafletProvided: true,
    signatureReference: 'SIG-DOH-2026-MARYAM-MCDA',
    dohStandard: 'USG 6.8 & USG App.6'
  }
];

export const INITIAL_AUDIT_TRAIL: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-11-04T10:14:22.410Z',
    actorId: 'doc-tariq-01',
    actorName: 'Dr. Tariq Al-Hashimi',
    role: 'Consultant OB/GYN',
    actionType: 'CLINICAL_DECISION',
    patientId: 'pt-noura',
    patientName: 'Noura Al-Mansoor',
    facility: 'Abu Dhabi',
    details: 'Initiated DOH Placenta Previa Pathway Stage 2 (TVS at 32w scheduled; CPT 76817). Low-lying margin 14mm with prior Cesarean section.',
    cryptographicHash: '0x8f2a9c14e7b8849b20e11894aef477215c0e7b99321da3c'
  },
  {
    id: 'aud-002',
    timestamp: '2026-11-04T11:32:05.180Z',
    actorId: 'doc-tariq-01',
    actorName: 'Dr. Tariq Al-Hashimi',
    role: 'Consultant OB/GYN',
    actionType: 'SCAN_REPORT_SIGNED',
    patientId: 'pt-sarah',
    patientName: 'Sarah Al-Maktoum',
    facility: 'Abu Dhabi',
    details: '23-Point Anatomy Scan Report finalized and signed. All structures visualized, normal biometry at 22w 2d. EDD locked.',
    cryptographicHash: '0x71e3b55a820c45efb77209931ad882946c9811f0082ba44'
  },
  {
    id: 'aud-003',
    timestamp: '2026-11-04T14:45:51.902Z',
    actorId: 'doc-tariq-01',
    actorName: 'Dr. Tariq Al-Hashimi',
    role: 'Consultant OB/GYN',
    actionType: 'CLINICAL_DECISION',
    patientId: 'pt-aisha',
    patientName: 'Aisha Al-Nuaimi',
    facility: 'Abu Dhabi',
    details: 'Prescribed Aspirin 150 mg nightly (STD App.1) for multiple risk factors (Age 41, BMI 37.2, low PAPP-A 0.32 MoM). Serial growth pathway confirmed.',
    cryptographicHash: '0x33b91a78dc1249bce78392110cba48392ef4781190cb61a'
  },
  {
    id: 'aud-004',
    timestamp: '2026-11-04T16:02:18.330Z',
    actorId: 'sonog-mona-02',
    actorName: 'Mona Al-Suwaidi',
    role: 'Sonographer',
    actionType: 'EFW_BIOMETRY_SAVED',
    patientId: 'pt-maryam',
    patientName: 'Maryam Al-Zaabi',
    facility: 'Dubai',
    details: 'MCDA Twin Biometry logged: Twin A EFW 420g, Twin B EFW 405g. Umbilical Artery Doppler PI normal, DVP concordant (no TTTS). Interval check passed (14 days).',
    cryptographicHash: '0xa411e8932fc4582bba710924eaf1883920cde71120aa471'
  },
  {
    id: 'aud-005',
    timestamp: '2026-11-05T08:15:30.120Z',
    actorId: 'doc-tariq-01',
    actorName: 'Dr. Tariq Al-Hashimi',
    role: 'Consultant OB/GYN',
    actionType: 'HIE_LOOKUP',
    patientId: 'pt-noura',
    patientName: 'Noura Al-Mansoor',
    facility: 'Abu Dhabi',
    details: 'Queried Malaffi HIE for prior surgical notes regarding lower uterine segment Cesarean section scar.',
    cryptographicHash: '0x992b4fa810ec5488192a00c14b998319ef5820ab4810cc9'
  }
];

export const MALAFFI_NABIDH_MOCK_DATABASE: Record<string, MalaffiNabidhRecord> = {
  'pt-sarah': {
    nationalHieId: 'MAL-AD-784-1996-8819',
    sourceAuthority: 'Malaffi (Abu Dhabi HIE)',
    emiratesId: '784-1996-1234567-1',
    patientName: 'Sarah Al-Maktoum',
    lastEncounterDate: '2026-08-05',
    linkedFacility: 'Mediclinic Al Noor Hospital, Abu Dhabi',
    availableRecords: {
      priorPregnanciesCount: 0,
      knownAllergies: ['None (NKDA)'],
      chronicConditions: ['None'],
      recentUltrasounds: ['12w NT Scan (CRL 62.4mm, NT 1.4mm) - Aug 2026'],
      recentLabWork: ['Booking Antenatal Serology (Rubella Immune, Hb 12.4 g/dL)']
    },
    consentStatus: 'Active HIE Consent',
    complianceSeal: 'DOH-HIE-VERIFIED-2026'
  },
  'pt-noura': {
    nationalHieId: 'MAL-AD-784-1991-4402',
    sourceAuthority: 'Malaffi (Abu Dhabi HIE)',
    emiratesId: '784-1991-7654321-2',
    patientName: 'Noura Al-Mansoor',
    lastEncounterDate: '2026-09-15',
    linkedFacility: 'Sheikh Shakhbout Medical City (SSMC), Abu Dhabi',
    availableRecords: {
      priorPregnanciesCount: 1,
      knownAllergies: ['Penicillin (Mild Rash)'],
      chronicConditions: ['Previous Lower Segment Cesarean Section (2023)'],
      recentUltrasounds: ['20w Anatomy: Posterior low-lying placenta 14mm from internal os'],
      recentLabWork: ['Booking CBC: Hb 11.8 g/dL, Platelets 210k']
    },
    consentStatus: 'Active HIE Consent',
    complianceSeal: 'DOH-HIE-VERIFIED-2026'
  },
  'pt-maryam': {
    nationalHieId: 'NAB-DXB-784-1994-3319',
    sourceAuthority: 'NABIDH (Dubai HIE)',
    emiratesId: '784-1994-9876543-3',
    patientName: 'Maryam Al-Zaabi',
    lastEncounterDate: '2026-09-02',
    linkedFacility: 'Mediclinic City Hospital (DHCC), Dubai',
    availableRecords: {
      priorPregnanciesCount: 0,
      knownAllergies: ['None (NKDA)'],
      chronicConditions: ['Spontaneous Monochorionic Diamniotic (MCDA) Twin Gestation'],
      recentUltrasounds: ['12w Scan: Monochorionic T-sign confirmed', '16w TTTS Surveillance Normal'],
      recentLabWork: ['Booking Panel Normal, Blood Group B Positive']
    },
    consentStatus: 'Active HIE Consent',
    complianceSeal: 'DHA-NABIDH-VERIFIED-2026'
  },
  'pt-aisha': {
    nationalHieId: 'MAL-AD-784-1985-1109',
    sourceAuthority: 'Malaffi (Abu Dhabi HIE)',
    emiratesId: '784-1985-5544332-4',
    patientName: 'Aisha Al-Nuaimi',
    lastEncounterDate: '2026-10-14',
    linkedFacility: 'Cleveland Clinic Abu Dhabi (CCAD)',
    availableRecords: {
      priorPregnanciesCount: 2,
      knownAllergies: ['Sulfa drugs'],
      chronicConditions: ['Class II Obesity (BMI 37.2)', 'Impaired Fasting Glucose'],
      recentUltrasounds: ['12w NT Scan: NT 2.1mm, low PAPP-A 0.32 MoM flagged'],
      recentLabWork: ['Blood Group O Rh-Negative', 'NIPT: Low Risk for Trisomies']
    },
    consentStatus: 'Active HIE Consent',
    complianceSeal: 'DOH-HIE-VERIFIED-2026'
  }
};
