import { AnatomyChecklistItem, LabRecord } from '../types/clinical';
import { CLINICAL_RULES } from '../config/clinicalRules';

export interface EducationChecklistItem {
  id: string;
  topic: string;
  category: 'lifestyle' | 'screening' | 'labour' | 'postnatal' | 'safety';
  discussed: boolean;
  dateDiscussed?: string;
  clinician?: string;
  guidanceText: string;
  source: string;
}

export interface VaccineTreatmentRecord {
  id: string;
  name: string;
  targetWindowWeeks: string;
  isCompleted: boolean;
  dateGiven?: string;
  clinician?: string;
  notes: string;
  source: string;
}

/**
 * Section 11: 23-Point Anatomy Scan Checklist (USG App.3)
 * Items marked with * are desirable, all others mandatory.
 */
export const INITIAL_ANATOMY_CHECKLIST: AnatomyChecklistItem[] = [
  // Head & Neurosonography
  { structure: 'HC (Transthalamic Plane)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Symmetric thalami & cavum septi pellucidi normal' },
  { structure: 'TCD (Transcerebellar Plane)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Normal cerebellar hemispheres & vermis' },
  { structure: 'Atrium Vp (Lateral Ventricle)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Atrium width 6.2 mm (< 10 mm normal)' },
  { structure: 'Nuchal Fold (NF)*', isMandatory: false, status: 'seen', imageCaptured: true, notes: '3.8 mm (< 6 mm normal)' },

  // Face
  { structure: 'Lips & Nose (Coronal Plane)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Intact upper lip and bilateral nares' },
  { structure: 'Orbits & Lenses', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Normal interocular distance & clear lenses' },
  { structure: 'Facial Profile (Mid-Sagittal)*', isMandatory: false, status: 'seen', imageCaptured: true, notes: 'Nasal bone present, normal chin & forehead' },

  // Heart & Great Vessels
  { structure: 'Visceral & Cardiac Situs', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Situs solitus, levocardia confirmed' },
  { structure: 'Four-Chamber View (4CH)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Equal ventricles, intact septum, normal foramen ovale flap' },
  { structure: 'LVOT (Left Ventricular Outflow Tract)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Aortic root continuity with ventricular septum' },
  { structure: 'RVOT (Right Ventricular Outflow Tract)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Pulmonary artery crossing over aorta normally' },
  { structure: '3-Vessel View (3VV)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'PA > Ao > SVC alignment confirmed' },
  { structure: '3-Vessel-Trachea View (3VT)*', isMandatory: false, status: 'seen', imageCaptured: true, notes: 'V-shaped ductal and aortic arches to left of trachea' },

  // Chest & Abdomen
  { structure: 'Diaphragm & Thorax', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Intact hypoechoic acoustic diaphragm line' },
  { structure: 'AC (Stomach + Umbilical Vein)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Fluid-filled stomach on left, J-shaped portal sinus' },
  { structure: 'Abdominal Wall Cord Insertion', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Intact insertion, no omphalocele or gastroschisis' },

  // Renal & Pelvis
  { structure: 'Kidneys & Renal Pelvis AP', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Bilateral renal tissue present, AP 3.2 mm (< 6 mm normal)' },
  { structure: 'Bladder + 3-Vessel Cord (Colour Doppler)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Two umbilical arteries coursing around bladder' },

  // Spine & Limbs
  { structure: 'Spine (Sagittal & Coronal)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Intact neural arch ossification & overlying skin' },
  { structure: 'Spine (Axial View)*', isMandatory: false, status: 'seen', imageCaptured: true, notes: 'Closed posterior elements throughout sacrum' },
  { structure: 'Femur Length (FL)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Both femoral diaphyses straight & measured' },
  { structure: 'Extremities (12 Long Bones, Hands & Feet)', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'All 4 limbs visualized with 3 segments and open hands' },

  // Placenta
  { structure: 'Placental Site vs Internal Cervical Os', isMandatory: true, status: 'seen', imageCaptured: true, notes: 'Clear of internal os by > 20 mm (or low-lying recorded)' }
];

/**
 * Section 12: Laboratory Panels (STD App.1)
 */
export const DEMO_LAB_PANELS: Record<string, LabRecord[]> = {
  'pt-sarah': [
    { id: 'lab-1', patientId: 'pt-sarah', test: 'Rubella IgG Serology', category: 'booking', date: '2026-08-05', result: 'Immune (Positive, 38 IU/mL)', normalAbnormal: 'normal' },
    { id: 'lab-2', patientId: 'pt-sarah', test: 'HIV 1 & 2 / Syphilis (EIA)', category: 'booking', date: '2026-08-05', result: 'Non-reactive / Negative', normalAbnormal: 'normal' },
    { id: 'lab-3', patientId: 'pt-sarah', test: 'Hepatitis B Surface Antigen (HBsAg)', category: 'booking', date: '2026-08-05', result: 'Negative', normalAbnormal: 'normal' },
    { id: 'lab-4', patientId: 'pt-sarah', test: 'CBC & Hemoglobin', category: 'booking', date: '2026-08-05', result: 'Hb 12.4 g/dL, Platelets 248k, MCV 88 fL', normalAbnormal: 'normal' },
    { id: 'lab-5', patientId: 'pt-sarah', test: 'Blood Group & Rh(D) + Antibody Screen', category: 'booking', date: '2026-08-05', result: 'O Rh(D) Positive, Antibody Screen Negative', normalAbnormal: 'normal' },
    { id: 'lab-6', patientId: 'pt-sarah', test: 'Urine Dipstick & Bacterial Culture', category: 'booking', date: '2026-08-05', result: 'Nil protein, Nil glucose, Culture: No growth', normalAbnormal: 'normal' },
    { id: 'lab-7', patientId: 'pt-sarah', test: 'Fasting Blood Glucose (FBG)', category: 'booking', date: '2026-08-05', result: '4.6 mmol/L (< 5.1 normal)', normalAbnormal: 'normal' },
    { id: 'lab-8', patientId: 'pt-sarah', test: '75g OGTT (Fasting / 1h / 2h)', category: 'gdm', date: '2026-11-20', result: 'Scheduled for 26w window (Nov 2026)', normalAbnormal: 'normal', notes: 'Window: 24–28w (STD App.1)' }
  ],
  'pt-noura': [
    { id: 'lab-n1', patientId: 'pt-noura', test: 'CBC & Hemoglobin (Booking)', category: 'booking', date: '2026-06-25', result: 'Hb 11.8 g/dL, Platelets 210k', normalAbnormal: 'normal' },
    { id: 'lab-n2', patientId: 'pt-noura', test: 'Blood Group & Rh(D)', category: 'booking', date: '2026-06-25', result: 'A Rh(D) Positive, Antibody Negative', normalAbnormal: 'normal' },
    { id: 'lab-n3', patientId: 'pt-noura', test: '75g OGTT', category: 'gdm', date: '2026-10-15', result: 'Fasting 4.8 / 1h 7.2 / 2h 6.1 mmol/L (Normal)', normalAbnormal: 'normal' },
    { id: 'lab-n4', patientId: 'pt-noura', test: 'Repeat CBC & Antibody Screen (28w)', category: 'routine', date: '2026-11-10', result: 'Pre-ordered for 28w transition visit', normalAbnormal: 'normal' }
  ],
  'pt-maryam': [
    { id: 'lab-m1', patientId: 'pt-maryam', test: 'CBC & Hemoglobin', category: 'booking', date: '2026-08-15', result: 'Hb 12.1 g/dL, Platelets 260k', normalAbnormal: 'normal' },
    { id: 'lab-m2', patientId: 'pt-maryam', test: 'Blood Group & Rh(D)', category: 'booking', date: '2026-08-15', result: 'B Rh(D) Positive', normalAbnormal: 'normal' },
    { id: 'lab-m3', patientId: 'pt-maryam', test: 'Urine Dipstick & Culture', category: 'booking', date: '2026-08-15', result: 'Negative for bacteriuria', normalAbnormal: 'normal' }
  ],
  'pt-aisha': [
    { id: 'lab-a1', patientId: 'pt-aisha', test: 'CBC & Hemoglobin', category: 'booking', date: '2026-10-12', result: 'Hb 11.2 g/dL', normalAbnormal: 'normal' },
    { id: 'lab-a2', patientId: 'pt-aisha', test: 'Blood Group & Rh(D)', category: 'booking', date: '2026-10-12', result: 'O Rh(D) Negative (Rh-D Prophylaxis Required)', normalAbnormal: 'borderline', notes: 'cfDNA fetal RhD indicated at 16–18w' },
    { id: 'lab-a3', patientId: 'pt-aisha', test: 'First Trimester PAPP-A Biomarker', category: 'booking', date: '2026-10-12', result: '0.32 MoM (Abnormal: < 0.40 MoM)', normalAbnormal: 'abnormal', notes: 'Triggers FGR serial growth scans & Aspirin 150mg nightly' },
    { id: 'lab-a4', patientId: 'pt-aisha', test: 'HbA1c & Fasting Glucose', category: 'booking', date: '2026-10-12', result: 'HbA1c 5.8%, Fasting 5.4 mmol/L (Borderline/Obesity)', normalAbnormal: 'borderline' },
    { id: 'lab-a5', patientId: 'pt-aisha', test: 'NIPT Cell-Free DNA Screen', category: 'nipt', date: '2026-10-20', result: 'Low Risk for T21, T18, T13, Sex Chromosomes', normalAbnormal: 'normal', notes: 'STD App.3 (Maternal age 41 indication)' }
  ]
};

/**
 * Section 12: Vaccines and Prophylactic Treatments (STD App.1)
 */
export const DEMO_VACCINES_TREATMENTS: Record<string, VaccineTreatmentRecord[]> = {
  'pt-sarah': [
    { id: 'vax-1', name: 'Prenatal Multivitamin (Folic acid 400µg, Iron, DHA)', targetWindowWeeks: 'From booking', isCompleted: true, dateGiven: '2026-08-05', clinician: 'Dr. Tariq Al-Hashimi', notes: 'Active daily compliance', source: 'STD App.1' },
    { id: 'vax-2', name: 'TDAP Vaccine (Tetanus, Diphtheria, Pertussis booster)', targetWindowWeeks: '28–32w', isCompleted: false, notes: 'Scheduled for 28-week visit (protects newborn pertussis)', source: 'STD App.1' },
    { id: 'vax-3', name: 'RSV Vaccine (Maternal Respiratory Syncytial Virus)', targetWindowWeeks: '28–36w', isCompleted: false, notes: 'Offers passive infant antibody protection against bronchiolitis', source: 'STD App.1' },
    { id: 'vax-4', name: 'Group B Strep (GBS) Screening Swab', targetWindowWeeks: '>= 35w (routinely 36w)', isCompleted: false, notes: 'Vaginal-rectal swab culture', source: 'STD App.1' }
  ],
  'pt-noura': [
    { id: 'vax-n1', name: 'Prenatal Multivitamins', targetWindowWeeks: 'From booking', isCompleted: true, dateGiven: '2026-06-25', clinician: 'Dr. Tariq Al-Hashimi', notes: 'Prescribed', source: 'STD App.1' },
    { id: 'vax-n2', name: 'TDAP Vaccine', targetWindowWeeks: '28w', isCompleted: false, notes: 'Due at next 28w visit', source: 'STD App.1' },
    { id: 'vax-n3', name: 'RSV Vaccine', targetWindowWeeks: '28–36w', isCompleted: false, notes: 'Planned', source: 'STD App.1' }
  ],
  'pt-maryam': [
    { id: 'vax-m1', name: 'Prenatal Multivitamins + Extra Iron & Calcium', targetWindowWeeks: 'From booking', isCompleted: true, dateGiven: '2026-08-15', clinician: 'Dr. Tariq Al-Hashimi', notes: 'Twin pregnancy supplement regimen', source: 'STD App.1' }
  ],
  'pt-aisha': [
    { id: 'vax-a1', name: 'Aspirin 150 mg Once Daily at Night', targetWindowWeeks: '11–14w until 36w', isCompleted: true, dateGiven: '2026-10-14', clinician: 'Dr. Tariq Al-Hashimi', notes: 'Maternal age 41, BMI 37.2, and low PAPP-A 0.32 MoM prophylaxis', source: 'STD App.1 (11–14w)' },
    { id: 'vax-a2', name: 'Cell-Free DNA for Fetal RhD Status', targetWindowWeeks: '16–18w', isCompleted: false, notes: 'Mother is Rh-negative; determines need for Anti-D prophylaxis', source: 'STD App.1' },
    { id: 'vax-a3', name: 'Anti-D Immunoglobulin (if indicated)', targetWindowWeeks: '28w', isCompleted: false, notes: 'Administered at 28w if fetus is Rh-positive or unknown', source: 'STD App.1' }
  ]
};

/**
 * Section 13: 19 Counselling & Education Tracker Topics (STD 3.4.1.14 + App.1)
 */
export const INITIAL_EDUCATION_TOPICS: EducationChecklistItem[] = [
  {
    id: 'edu-1',
    topic: 'Nutrition & Balanced Diet in Pregnancy',
    category: 'lifestyle',
    discussed: true,
    dateDiscussed: '2026-08-05',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Emphasize leafy greens, lean protein, unpasteurized cheese avoidance, hydration, and safe caloric intake.',
    source: 'STD 3.4.1.14'
  },
  {
    id: 'edu-2',
    topic: 'Physical Activity & Pelvic Floor Exercises',
    category: 'lifestyle',
    discussed: true,
    dateDiscussed: '2026-08-05',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Moderate aerobic exercise (walking, swimming) 150 mins/week. Daily Kegel pelvic floor muscle training.',
    source: 'STD 3.4.1.14'
  },
  {
    id: 'edu-3',
    topic: 'Prenatal Vitamins & Mineral Supplements',
    category: 'lifestyle',
    discussed: true,
    dateDiscussed: '2026-08-05',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Folic acid, elemental iron, vitamin D, calcium, and DHA omega-3 benefits.',
    source: 'STD App.1'
  },
  {
    id: 'edu-4',
    topic: 'Common Pregnancy Symptoms & Management',
    category: 'lifestyle',
    discussed: true,
    dateDiscussed: '2026-08-05',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Nausea, heartburn, pelvic girdle pain, varicose veins, and safe medication use.',
    source: 'STD 3.4.1.14'
  },
  {
    id: 'edu-5',
    topic: 'Antenatal Screening Tests & Informed Consent',
    category: 'screening',
    discussed: true,
    dateDiscussed: '2026-08-25',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Scope and voluntary nature of NT ultrasound, combined screening, NIPT, and anomaly scans.',
    source: 'STD 3.2.1.2'
  },
  {
    id: 'edu-6',
    topic: 'Dental Health Checkup & Hygiene',
    category: 'lifestyle',
    discussed: true,
    dateDiscussed: '2026-08-05',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Increased gingivitis risk during gestation; advise dental checkup in second trimester.',
    source: 'STD 3.4.1.14'
  },
  {
    id: 'edu-7',
    topic: 'Postnatal Home Visit Programme (Consent)',
    category: 'postnatal',
    discussed: false,
    guidanceText: 'Explain Abu Dhabi DOH home visiting midwife support program and document consent.',
    source: 'STD 3.4.1.14'
  },
  {
    id: 'edu-8',
    topic: 'Breastfeeding Preparation & Skin-to-Skin Care',
    category: 'postnatal',
    discussed: true,
    dateDiscussed: '2026-08-25',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Golden hour skin-to-skin, colostrum benefits, and hospital lactation consultant contact.',
    source: 'STD App.1'
  },
  {
    id: 'edu-9',
    topic: 'Fetal Movements Awareness (Urgent 24/7 Advice)',
    category: 'safety',
    discussed: true,
    dateDiscussed: '2026-09-28',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Advise mother to contact maternity triage immediately any time (day or night) if movements decrease, stop, or change. Never wait until the next morning.',
    source: 'STD 3.4.1.14, App.1'
  },
  {
    id: 'edu-10',
    topic: 'Gestational Diabetes Mellitus (GDM) & 75g OGTT',
    category: 'screening',
    discussed: true,
    dateDiscussed: '2026-09-28',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Rationale for 75g oral glucose tolerance test at 24–28 weeks and dietary management.',
    source: 'STD App.1'
  },
  {
    id: 'edu-11',
    topic: 'Antenatal Education Classes & Hospital Tour',
    category: 'labour',
    discussed: false,
    guidanceText: 'Recommend childbirth preparation courses and virtual/in-person labour ward tour.',
    source: 'STD 3.4.1.14'
  },
  {
    id: 'edu-12',
    topic: 'Individualized Birth Preferences & Birth Plan',
    category: 'labour',
    discussed: false,
    guidanceText: 'Discuss labor companion, cord clamping preferences, environment, and delivery room wishes.',
    source: 'STD App.1 (34w)'
  },
  {
    id: 'edu-13',
    topic: 'Signs of Active Labour & When to Attend Hospital',
    category: 'labour',
    discussed: false,
    guidanceText: 'Regular painful contractions (3 in 10 mins), fluid leakage/SROM, or bloody show.',
    source: 'STD App.1'
  },
  {
    id: 'edu-14',
    topic: 'Pain Relief Options in Labour',
    category: 'labour',
    discussed: false,
    guidanceText: 'Epidural analgesia, Entonox (gas and air), pethidine, warm water, and breathing techniques.',
    source: 'STD App.1'
  },
  {
    id: 'edu-15',
    topic: 'Pre-Eclampsia & Obstetric Cholestasis Red Flags',
    category: 'safety',
    discussed: true,
    dateDiscussed: '2026-09-28',
    clinician: 'Dr. Tariq Al-Hashimi',
    guidanceText: 'Severe persistent headache, visual disturbances/flashing lights, epigastric/upper quadrant pain, generalized intense itching (especially palms/soles).',
    source: 'STD App.1'
  },
  {
    id: 'edu-16',
    topic: 'Postnatal Recovery, Contraception & Mental Health',
    category: 'postnatal',
    discussed: false,
    guidanceText: 'Normal lochia bleeding, pelvic floor recovery, postpartum depression screening, and family planning.',
    source: 'STD 3.4.1.14'
  },
  {
    id: 'edu-17',
    topic: 'Newborn Bloodspot & Hearing Screening Tests',
    category: 'postnatal',
    discussed: false,
    guidanceText: 'UAE national newborn screening program for metabolic disorders, CCHD, and hearing.',
    source: 'STD 3.4.1.14'
  },
  {
    id: 'edu-18',
    topic: 'Neonatal Vitamin K Prophylaxis',
    category: 'postnatal',
    discussed: false,
    guidanceText: 'Intramuscular vitamin K injection at birth to prevent hemorrhagic disease of the newborn (VKDB).',
    source: 'STD App.1'
  },
  {
    id: 'edu-19',
    topic: 'Safe Sleep Position After 28 Weeks Gestation',
    category: 'safety',
    discussed: false,
    guidanceText: 'Advise mother to avoid going to sleep flat on her back from 28 weeks; sleeping on side (especially left) optimizes uteroplacental perfusion.',
    source: 'STD App.1 (28w)'
  }
];
