import { ConceptionType, EddMethod, CarePathway, HealthcareFacility } from './types/clinical';

export type ScanType = 
  | 'nt_scan' 
  | 'anomaly_scan' 
  | 'fetal_echo' 
  | 'growth_doppler' 
  | 'routine_growth_34_36'
  | '3d_4d_hd' 
  | 'cervical_length' 
  | 'high_risk_consult';

export * from './types/clinical';

export interface FetalBiometrics {
  bpdMm: number; // Biparietal diameter
  hcMm: number;  // Head circumference
  acMm: number;  // Abdominal circumference
  flMm: number;  // Femur length
  efwGrams: number; // Estimated fetal weight
  efwPercentile: number; // Percentile on Hadlock curve
  afiCm?: number; // Amniotic fluid index
  placentaLocation: string; // e.g. "Anterior High, Grade 1"
  cervicalLengthMm?: number; // e.g. 38mm
  fetalHeartRateBpm: number; // e.g. 148 bpm
  umbilicalArteryPI?: number; // Pulsatility Index
  middleCerebralArteryPI?: number;
}

export interface UltrasoundImage {
  id: string;
  title: string;
  category: '3D Face' | 'Anatomy 2D' | 'Doppler Flow' | '4D Clip' | 'Spine Profile';
  date: string;
  gestationalWeek: string;
  imageUrl?: string;
  dimensions?: string;
  description: string;
  isNormal: boolean;
  type: '3d' | '2d' | 'doppler' | 'profile';
}

export interface ScanReport {
  id: string;
  scanType: ScanType;
  title: string;
  gestationalAge: string;
  date: string;
  doctorName: string;
  clinicLocation: string;
  summary: string;
  biometrics: FetalBiometrics;
  images: UltrasoundImage[];
  status: 'Completed' | 'Upcoming' | 'Requires Follow-up';
  malaffiRefId: string;
  nabidhRefId: string;
  recommendations: string[];
}

export interface Appointment {
  id: string;
  scanType: ScanType;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  clinic: string;
  clinicAddress: string;
  doctor: string;
  status: 'Confirmed' | 'Pending Approval' | 'Completed';
  gestationalTarget: string;
  preparationNotes: string;
  insurancePreAuth: {
    provider: string;
    status: 'Pre-Approved' | 'In Process' | 'Self-Pay';
    authCode?: string;
  };
}

export interface KickCounterSession {
  id: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  totalKicks: number;
  notes: string;
}

export interface BloodPressureLog {
  id: string;
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  status: 'Normal' | 'Elevated' | 'Warning';
  notes?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  mrn: string; // Medical Record Number
  emiratesId: string;
  dob: string;
  lmpDate: string; // Last menstrual period
  eddDate: string; // Estimated date of delivery
  currentGestationalWeeks: number;
  currentGestationalDays: number;
  babyGender: 'Baby Girl' | 'Baby Boy' | 'Surprise';
  fetalCount: 'Singleton' | 'Twins' | 'Triplets';
  bloodGroup: string;
  insurance: {
    network: string;
    policyNumber: string;
    tier: string;
  };
  highRiskFactors: string[];
  // DOH Phase 1 clinical extensions
  lmpCertain?: boolean;
  cycleLengthDays?: number;
  conceptionType?: ConceptionType;
  oocyteRetrievalDate?: string;
  eddMethod?: EddMethod;
  eddLocked?: boolean;
  carePathway?: CarePathway;
  facility?: HealthcareFacility;
  bmi?: number;
  age?: number;
  cptCodesOnActiveCarePlan?: string[];
}
