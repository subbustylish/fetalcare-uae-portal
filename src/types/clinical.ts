/**
 * Comprehensive DOH Clinical Data Model
 * Reference: FetalCare_DOH_Build_Spec Section 2 & DOH Guidelines
 */

export type HealthcareFacility = 'Abu Dhabi' | 'Dubai';

export type RhStatus = 'Positive' | 'Negative' | 'Unknown';

export type CarePathway = 'low_risk_primary' | 'obstetric_led' | 'fetal_medicine';

export type ConceptionType = 'natural' | 'ivf';

export type EddMethod = 'LMP' | 'CRL' | 'HC' | 'IVF' | 'Manual Override';

export type ChorionicityAmnionicity = 
  | 'Singleton'
  | 'Dichorionic Diamniotic (DCDA)'
  | 'Monochorionic Diamniotic (MCDA)'
  | 'Monochorionic Monoamniotic (MCMA)'
  | 'Trichorionic Triamniotic (TCTA)'
  | 'Dichorionic Triamniotic (DCTA)'
  | 'Monochorionic Triamniotic (MCTA)'
  | 'Unclear / Pending Evaluation';

export interface Patient {
  id: string;
  name: string;
  emiratesId: string;
  mrn: string;
  dob: string;
  phone: string;
  insurer: string;
  policyNumber: string;
  bloodGroup: string;
  rhStatus: RhStatus;
  facility: HealthcareFacility;
}

export interface Pregnancy {
  id: string;
  patientId: string;
  lmp: string; // ISO date YYYY-MM-DD
  lmpCertain: boolean;
  cycleLengthDays: number; // e.g. 28 (normal range 26-33)
  conceptionType: ConceptionType;
  oocyteRetrievalDate?: string; // For IVF/ART (ISO date)
  numberOfFetuses: number; // 1, 2, 3...
  chorionicityAmnionicity: ChorionicityAmnionicity;
  edd: string; // ISO date YYYY-MM-DD
  eddMethod: EddMethod;
  eddLocked: boolean; // Finalized at 11-14w visit (STD App.1)
  eddLockDate?: string;
  carePathway: CarePathway;
  riskFactors: string[];
  status: 'active' | 'delivered' | 'transferred';
}

export interface VisitDueWindow {
  startWeeks: number;
  startDays?: number;
  endWeeks: number;
  endDays?: number;
  label: string;
}

export interface ClinicalVisit {
  id: string;
  patientId: string;
  type: string; // e.g. 'booking', '11_14w', '16_18w', '19_23w', '25w', '28w', '32w', '34w', '36w', '37_40w'
  title: string;
  dueWindow: VisitDueWindow;
  dateDone?: string;
  isMandatory: boolean; // DOH Circular 19/2026 (5 mandatory visits)
  checklistItemsDone: string[];
  vitals?: {
    systolicBp?: number;
    diastolicBp?: number;
    weightKg?: number;
    urineProtein?: 'nil' | 'trace' | '1+' | '2+' | '3+';
    urineGlucose?: 'nil' | 'trace' | '1+' | '2+';
    sfhCm?: number; // Symphysis-Fundal Height
  };
  notes?: string;
  clinician?: string;
  status: 'completed' | 'scheduled' | 'overdue' | 'upcoming';
}

export interface FetalBiometricsRecord {
  crlMm?: number;
  ntMm?: number;
  bpdMm?: number;
  hcMm?: number;
  acMm?: number;
  flMm?: number;
  efwGrams?: number;
  efwCentile?: number;
  afiCm?: number;
  svpCm?: number;
  placentaPosition?: 'anterior' | 'posterior' | 'fundal' | 'lateral' | 'low_lying' | 'previa';
  placentaDistanceToInternalOsMm?: number; // Distance in mm (<20mm is low-lying)
  cervicalLengthMm?: number;
  uaPi?: number; // Umbilical Artery Pulsatility Index
  mcaPi?: number; // Middle Cerebral Artery Pulsatility Index
  uterineArteryMeanPi?: number;
  uterineArteryBilateralNotching?: boolean;
  vpMm?: number; // Ventricular atrium (Vp >= 10mm alert)
  tcdMm?: number; // Transverse cerebellar diameter
  cmMm?: number; // Cisterna magna (CM >= 10mm alert)
  nfMm?: number; // Nuchal fold (NF >= 6mm alert)
  renalPelvisApMm?: number; // Renal pelvis AP (>= 6mm <28w, >= 10mm >=28w)
  fetalHeartRateBpm?: number;
}

export interface AnatomyChecklistItem {
  structure: string;
  isMandatory: boolean;
  status: 'seen' | 'not_seen' | 'abnormal';
  imageCaptured: boolean;
  notes?: string;
}

export interface ClinicalScan {
  id: string;
  patientId: string;
  fetusId: string; // 'Fetus A', 'Fetus B'
  scanTypeKey: string;
  cptCodes: string[];
  date: string; // ISO date
  gaAtScanWeeks: number;
  gaAtScanDays: number;
  indication?: string;
  measurements: FetalBiometricsRecord;
  anatomyChecklist?: AnatomyChecklistItem[];
  isComplete: boolean;
  reportSummary: string;
  sonographerOrDoctor: string;
  facility: HealthcareFacility;
}

export interface LabRecord {
  id: string;
  patientId: string;
  test: string;
  category: 'booking' | 'nipt' | 'gdm' | 'antibody' | 'gbs' | 'routine';
  date: string;
  result: string;
  normalAbnormal: 'normal' | 'abnormal' | 'borderline';
  notes?: string;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  testOffered: string; // e.g. 'Aneuploidy First Trimester Screening / NT', 'NIPT', 'Routine Ultrasound'
  acceptedDeclined: 'accepted' | 'declined';
  date: string;
  clinician: string;
  notes?: string;
}

export interface ReferralRecord {
  id: string;
  patientId: string;
  reason: string;
  ruleTriggered: string; // e.g. 'USG App.6 (Low lying placenta with prior CS)'
  to: 'Obstetrician' | 'Fetal Medicine' | 'Dietician' | 'Diabetes Nurse' | 'Endocrinologist';
  date: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ClinicalAlert {
  id: string;
  patientId: string;
  ruleId: string;
  source: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  status: 'open' | 'accepted' | 'overridden' | 'dismissed';
  overrideReason?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: 'consultant' | 'sonographer' | 'midwife' | 'system';
  action: string;
  recordType: 'pregnancy' | 'scan' | 'alert' | 'visit' | 'edd_override';
  recordId: string;
  timestamp: string;
  details?: Record<string, any>;
}
