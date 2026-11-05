/**
 * DOH Abu Dhabi Antenatal Visit Schedule Generator
 * Reference: DOH Antenatal Care Standard (July 2024) Appendix 1
 * & DOH Circular 19/2026 (5 Mandatory Antenatal Visits)
 */

import { CLINICAL_RULES } from '../config/clinicalRules';
import { ClinicalVisit, PatientProfile } from '../types';
import { addDays, parseDateIso, formatDateIso } from './datingEngine';

export interface GeneratedVisitItem {
  id: string;
  title: string;
  windowLabel: string;
  startDateIso: string;
  endDateIso: string;
  targetWeek: number;
  minWeeks: number;
  maxWeeks: number;
  isMandatory: boolean;
  mandatoryVisitIndex?: number;
  status: 'completed' | 'current' | 'upcoming' | 'overdue';
  isOverdueMandatory: boolean;
  dateDone?: string;
  clinician?: string;
  checklist: {
    item: string;
    isDone: boolean;
  }[];
  standardVitalsRequired: boolean; // From 11w: Weight, BP, Urine, Risk, Wellbeing
  vitals?: {
    bp?: string;
    weightKg?: number;
    urineDipstick?: string;
    sfhCm?: number;
  };
  autoActions: readonly string[] | string[];
  clinicalDescription: string;
  source: string;
}

export interface MaternalReminder {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'action_required' | 'urgent';
  source: string;
  actionText?: string;
  dueGestation: string;
  isCompleted?: boolean;
}

/**
 * Calculate the calendar date for a given gestational age (weeks and days) from EDD
 * At EDD (280 days), date is EDD.
 * Target date = EDD + ((weeks * 7 + days) - 280) days
 */
export function getDateForGestationalAge(eddIso: string, weeks: number, days: number = 0): string {
  const eddDate = parseDateIso(eddIso);
  const targetDaysFromLmp = weeks * 7 + days;
  const daysOffsetFromEdd = targetDaysFromLmp - 280;
  const targetDate = addDays(eddDate, daysOffsetFromEdd);
  return formatDateIso(targetDate);
}

/**
 * Auto-generate complete DOH visit schedule from patient's EDD
 */
export function generateAntenatalVisitSchedule(
  patient: PatientProfile,
  completedVisitsMap?: Record<string, { dateDone: string; clinician: string; tickedItems?: string[]; vitals?: any }>
): GeneratedVisitItem[] {
  const { eddDate, currentGestationalWeeks, currentGestationalDays } = patient;
  const currentTotalDays = currentGestationalWeeks * 7 + currentGestationalDays;
  const definitions = CLINICAL_RULES.visitSchedules.definitions;

  return definitions.map((def) => {
    const startDays = (def.minWeeks * 7) + (('minDays' in def ? (def as any).minDays : 0) || 0);
    const endDays = (def.maxWeeks * 7) + (('maxDays' in def ? (def as any).maxDays : 6) || 6);

    const startDateIso = getDateForGestationalAge(eddDate, def.minWeeks, ('minDays' in def ? (def as any).minDays : 0) || 0);
    const endDateIso = getDateForGestationalAge(eddDate, def.maxWeeks, ('maxDays' in def ? (def as any).maxDays : 6) || 6);

    const isPast = currentTotalDays > endDays;
    const isCurrent = currentTotalDays >= startDays && currentTotalDays <= endDays;

    const completedRecord = completedVisitsMap?.[def.id];
    const isCompleted = !!completedRecord;

    let status: 'completed' | 'current' | 'upcoming' | 'overdue' = 'upcoming';
    if (isCompleted) {
      status = 'completed';
    } else if (isCurrent) {
      status = 'current';
    } else if (isPast) {
      status = 'overdue';
    }

    const isOverdueMandatory = status === 'overdue' && def.isMandatory;

    // Standard vitals required at all visits from 11 weeks (STD App.1)
    const standardVitalsRequired = def.minWeeks >= 11;

    // Merge checklist items
    const allChecklistItems = [
      ...(standardVitalsRequired ? CLINICAL_RULES.visitSchedules.standardFrom11WeeksChecklist : []),
      ...def.checklist
    ];

    const tickedSet = new Set(completedRecord?.tickedItems || []);
    const checklist = allChecklistItems.map(item => ({
      item,
      // If completed without explicit checklist, default to true
      isDone: isCompleted ? (completedRecord?.tickedItems ? tickedSet.has(item) : true) : false
    }));

    return {
      id: def.id,
      title: def.title,
      windowLabel: `${def.minWeeks}w – ${def.maxWeeks}w`,
      startDateIso,
      endDateIso,
      targetWeek: def.minWeeks,
      minWeeks: def.minWeeks,
      maxWeeks: def.maxWeeks,
      isMandatory: def.isMandatory,
      mandatoryVisitIndex: 'mandatoryVisitIndex' in def ? (def as any).mandatoryVisitIndex : undefined,
      status,
      isOverdueMandatory,
      dateDone: completedRecord?.dateDone,
      clinician: completedRecord?.clinician,
      checklist,
      standardVitalsRequired,
      vitals: completedRecord?.vitals,
      autoActions: def.autoActions,
      clinicalDescription: def.description,
      source: def.source
    };
  });
}

/**
 * Generate Mother-Side Reminders & Guidance based on current GA & risk factors
 */
export function generateMaternalReminders(patient: PatientProfile): MaternalReminder[] {
  const { currentGestationalWeeks, highRiskFactors, eddDate } = patient;
  const reminders: MaternalReminder[] = [];

  const isPetOrFgrRisk = highRiskFactors.some(f => 
    f.toLowerCase().includes('papp-a') || 
    f.toLowerCase().includes('pre-eclampsia') || 
    f.toLowerCase().includes('uterine artery') || 
    f.toLowerCase().includes('bmi') ||
    f.toLowerCase().includes('aspirin')
  );

  // 1. Aspirin 150 mg nightly (STD App.1 11-14w)
  if (isPetOrFgrRisk) {
    reminders.push({
      id: 'rem-aspirin',
      title: 'Take Aspirin 150 mg Tonight',
      description: 'Prescribed once daily at bedtime for pre-eclampsia and fetal growth restriction risk reduction (DOH STD App.1).',
      severity: 'action_required',
      source: 'STD App.1 (11–14w)',
      dueGestation: 'Nightly until 36 weeks',
      actionText: 'Confirm Dose'
    });
  }

  // 2. Fetal Movement Safety Awareness (Always active from 24w+)
  if (currentGestationalWeeks >= 24) {
    reminders.push({
      id: 'rem-movements',
      title: 'Fetal Movement Awareness: Contact Maternity 24/7',
      description: 'If you ever notice a reduction, slowing down, or sudden change in your baby\'s movement pattern, contact maternity triage immediately. Do not wait until the next day (DOH STD App.1).',
      severity: 'urgent',
      source: 'STD App.1 (25w)',
      dueGestation: 'Daily from 24w onwards',
      actionText: 'Log Kicks'
    });
  }

  // 3. 75g OGTT Diabetes Screening (24–28w)
  if (currentGestationalWeeks >= 20 && currentGestationalWeeks <= 28) {
    const isDueSoon = currentGestationalWeeks >= 24;
    reminders.push({
      id: 'rem-ogtt',
      title: '75g OGTT Gestational Diabetes Blood Test',
      description: 'Mandatory routine screening between 24 and 28 weeks. Requires fasting from midnight prior to morning blood draw.',
      severity: isDueSoon ? 'action_required' : 'info',
      source: 'STD App.1 (24–28w)',
      dueGestation: '24–28 weeks',
      actionText: 'View Lab Orders'
    });
  }

  // 4. Safe Sleep Position Advice (From 28w+)
  if (currentGestationalWeeks >= 28) {
    reminders.push({
      id: 'rem-sleep',
      title: 'Safe Sleep Position: Avoid Sleeping on Your Back',
      description: 'DOH guidance strongly advises going to sleep on your side (left side is optimal) to maintain optimal placental blood flow and oxygenation to your baby.',
      severity: 'info',
      source: 'STD App.1 (28w)',
      dueGestation: 'From 28w until delivery'
    });
  }

  // 5. Routine Third Trimester Growth Scan (34–36w)
  if (currentGestationalWeeks >= 28 && currentGestationalWeeks <= 36) {
    reminders.push({
      id: 'rem-growth-scan',
      title: 'Book Routine Third Trimester Growth Scan (34–36w)',
      description: 'Routine ultrasound for low-risk pregnancies to assess baby\'s growth velocity, amniotic fluid volume, and presentation (DOH USG 6.1.4, CPT 76805).',
      severity: currentGestationalWeeks >= 32 ? 'action_required' : 'info',
      source: 'USG 6.1.4',
      dueGestation: '34–36 weeks',
      actionText: 'Book Growth Scan'
    });
  }

  // 6. GBS Culture (>= 35w)
  if (currentGestationalWeeks >= 34) {
    reminders.push({
      id: 'rem-gbs',
      title: 'Group B Strep (GBS) Screening Swab',
      description: 'Routine clinical swab performed at or after 35 weeks to protect baby against perinatal GBS infection during labor (DOH STD App.1).',
      severity: 'action_required',
      source: 'STD App.1 (36w, >=35w)',
      dueGestation: '35–36 weeks'
    });
  }

  return reminders;
}
