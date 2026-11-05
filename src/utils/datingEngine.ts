/**
 * DOH Abu Dhabi Gestational Dating Engine
 * Reference: DOH Antenatal Ultrasound Guideline (July 2022) Appendix 2
 * & DOH Antenatal Care Standard Appendix 1
 */

import { CLINICAL_RULES } from '../config/clinicalRules';
import { EddMethod } from '../types/clinical';

export interface DatingEvaluationResult {
  recommendedEdd: string; // YYYY-MM-DD
  eddMethod: EddMethod;
  discrepancyDays: number; // Ultrasound GA days - LMP GA days
  shouldReDate: boolean;
  reDateReason: string;
  warningAlert?: string;
  source: string;
}

export interface GestationalAge {
  weeks: number;
  days: number;
  totalDays: number;
  formatted: string; // e.g. "22w 4d" or "22 weeks 4 days"
}

/**
 * Format a Date to YYYY-MM-DD string
 */
export function formatDateIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD string to local Date at midnight
 */
export function parseDateIso(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Noon to prevent timezone shifting
}

/**
 * Add days to a Date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Difference in full calendar days between two dates (dateA - dateB)
 */
export function differenceInDays(dateA: Date, dateB: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((dateA.getTime() - dateB.getTime()) / msPerDay);
}

/**
 * Calculate Gestational Age on a target date given an EDD
 * Rule: At EDD, GA is exactly 40 weeks 0 days (280 days)
 * GA total days = 280 - (EDD - targetDate in days)
 */
export function calculateGestationalAge(eddIso: string, targetDate: Date = new Date()): GestationalAge {
  const eddDate = parseDateIso(eddIso);
  const diffDays = differenceInDays(targetDate, eddDate);
  const totalDays = 280 + diffDays;
  
  const clampedTotalDays = Math.max(0, totalDays);
  const weeks = Math.floor(clampedTotalDays / 7);
  const days = clampedTotalDays % 7;

  return {
    weeks,
    days,
    totalDays: clampedTotalDays,
    formatted: `${weeks}w ${days}d`
  };
}

/**
 * Calculate EDD from LMP for a normal regular 28-day cycle (Naegele's rule / 280 days)
 * If cycle length differs from 28 days: LMP + 280 + (cycleLength - 28)
 */
export function calculateEddFromLmp(lmpIso: string, cycleLengthDays: number = 28): string {
  const lmpDate = parseDateIso(lmpIso);
  const adjustmentDays = cycleLengthDays - 28;
  const eddDate = addDays(lmpDate, 280 + adjustmentDays);
  return formatDateIso(eddDate);
}

/**
 * Calculate EDD from IVF / Assisted Reproductive Technology (ART)
 * Source: USG App.2 (4.1, 4.2)
 * EDD is exactly 266 days from oocyte retrieval date (or derived LMP = retrieval - 14 days)
 */
export function calculateEddFromIvf(oocyteRetrievalDateIso: string): string {
  const retrievalDate = parseDateIso(oocyteRetrievalDateIso);
  const eddDate = addDays(retrievalDate, CLINICAL_RULES.dating.ivfGestationDays.value);
  return formatDateIso(eddDate);
}

/**
 * Robinson Formula for CRL Gestational Dating
 * Source: USG App.2 (1.2) - Robinson & Fleming formula
 * Applicable up to CRL 84 mm (~13w6d - 14w0d)
 * GA(days) = 8.052 * sqrt(CRL mm) + 23.73
 */
export function calculateGaDaysFromCrl(crlMm: number): number {
  if (crlMm <= 0) return 0;
  const gaDays = 8.052 * Math.sqrt(crlMm) + 23.73;
  return Math.round(gaDays);
}

/**
 * Head Circumference (HC) Dating Formula for Second & Third Trimester (when CRL > 84 mm)
 * Source: USG App.2 (2.1)
 * Uses standard Hadlock biometric equation inverse for HC:
 * GA(days) = 7 * exp(0.0578 + 0.003314 * HC - 0.00000406 * HC^2) or standard reference mapping
 */
export function calculateGaDaysFromHc(hcMm: number): number {
  if (hcMm <= 0) return 0;
  // Hadlock HC regression formula for GA in weeks:
  // GA (weeks) = -11.52 + 0.0894*(HC/10) + 0.00078*(HC/10)^2 or linear fit in clinical ranges
  // For standard mm input:
  const hcCm = hcMm / 10;
  const gaWeeks = 8.96 + 0.540 * hcCm + 0.0003 * Math.pow(hcCm, 2);
  return Math.round(gaWeeks * 7);
}

/**
 * Calculate EDD from a scan measurement date and estimated GA in days
 * EDD = scanDate + (280 - gaDaysAtScan)
 */
export function calculateEddFromScanGaDays(scanDateIso: string, gaDaysAtScan: number): string {
  const scanDate = parseDateIso(scanDateIso);
  const daysToEdd = 280 - gaDaysAtScan;
  const eddDate = addDays(scanDate, daysToEdd);
  return formatDateIso(eddDate);
}

export interface FetusScanDatingInput {
  fetusId?: string;
  crlMm?: number;
  hcMm?: number;
}

/**
 * Main DOH Dating Evaluation Algorithm
 * Evaluates whether a pregnancy should be re-dated based on DOH Appendix 2 thresholds.
 */
export function evaluateGestationalDating(params: {
  lmpIso?: string;
  lmpCertain: boolean;
  cycleLengthDays?: number;
  conceptionType: 'natural' | 'ivf';
  oocyteRetrievalDateIso?: string;
  scanDateIso: string;
  fetuses: FetusScanDatingInput[];
  hasFirstTrimesterScanAlready: boolean;
  isEddLocked: boolean;
}): DatingEvaluationResult {
  const {
    lmpIso,
    lmpCertain,
    cycleLengthDays = 28,
    conceptionType,
    oocyteRetrievalDateIso,
    scanDateIso,
    fetuses,
    hasFirstTrimesterScanAlready,
    isEddLocked
  } = params;

  // 1. IVF Case: ART derived dating strictly overrides all other methods (USG App.2 point 4.1)
  if (conceptionType === 'ivf' && oocyteRetrievalDateIso) {
    const ivfEdd = calculateEddFromIvf(oocyteRetrievalDateIso);
    return {
      recommendedEdd: ivfEdd,
      eddMethod: 'IVF',
      discrepancyDays: 0,
      shouldReDate: true,
      reDateReason: 'ART / IVF derived gestational age (Oocyte retrieval + 266 days) strictly assigns EDD.',
      source: 'USG App.2 (4.1, 4.2)'
    };
  }

  // 2. Determine ultrasound GA in days using the LARGEST fetus (USG App.2 point 4.4)
  let bestGaDaysAtScan = 0;
  let measurementUsed: 'CRL' | 'HC' = 'CRL';

  for (const fetus of fetuses) {
    let fetusGaDays = 0;
    if (fetus.crlMm && fetus.crlMm > 0 && fetus.crlMm <= CLINICAL_RULES.dating.crlUpperLimitMm.value) {
      fetusGaDays = calculateGaDaysFromCrl(fetus.crlMm);
      if (fetusGaDays > bestGaDaysAtScan) {
        bestGaDaysAtScan = fetusGaDays;
        measurementUsed = 'CRL';
      }
    } else if (fetus.hcMm && fetus.hcMm > 0) {
      fetusGaDays = calculateGaDaysFromHc(fetus.hcMm);
      if (fetusGaDays > bestGaDaysAtScan) {
        bestGaDaysAtScan = fetusGaDays;
        measurementUsed = 'HC';
      }
    }
  }

  // If no ultrasound measurements provided, fallback to LMP
  if (bestGaDaysAtScan === 0) {
    if (lmpIso && lmpCertain) {
      return {
        recommendedEdd: calculateEddFromLmp(lmpIso, cycleLengthDays),
        eddMethod: 'LMP',
        discrepancyDays: 0,
        shouldReDate: false,
        reDateReason: 'Dated by certain LMP with regular cycle.',
        source: 'USG App.2 (1.1)'
      };
    }
    throw new Error('Neither valid LMP nor ultrasound biometry (CRL/HC) was provided to date pregnancy.');
  }

  const usEdd = calculateEddFromScanGaDays(scanDateIso, bestGaDaysAtScan);
  const usGaWeeks = Math.floor(bestGaDaysAtScan / 7);

  // If LMP is uncertain or unknown -> use earliest ultrasound (USG App.2 point 1.2)
  if (!lmpIso || !lmpCertain) {
    return {
      recommendedEdd: usEdd,
      eddMethod: measurementUsed === 'CRL' ? 'CRL' : 'HC',
      discrepancyDays: 0,
      shouldReDate: true,
      reDateReason: `LMP is uncertain/unknown. Assigned EDD by earliest ultrasound (${measurementUsed} = ${bestGaDaysAtScan} days).`,
      source: 'USG App.2 (1.2)'
    };
  }

  // 3. Both LMP and Ultrasound are present: evaluate discrepancy
  const lmpEdd = calculateEddFromLmp(lmpIso, cycleLengthDays);
  const scanDate = parseDateIso(scanDateIso);
  const lmpDate = parseDateIso(lmpIso);
  const lmpGaDaysAtScan = differenceInDays(scanDate, lmpDate);
  const discrepancyDays = bestGaDaysAtScan - lmpGaDaysAtScan; // positive if US dates ahead of LMP
  const absDiscrepancy = Math.abs(discrepancyDays);

  // If EDD is already locked (STD App.1 11-14w), changes require clinical override
  if (isEddLocked) {
    return {
      recommendedEdd: lmpEdd,
      eddMethod: 'LMP',
      discrepancyDays,
      shouldReDate: false,
      reDateReason: 'EDD was already finalized and locked at the 11–14w visit. Modifications require doctor override with clinical reason.',
      source: 'STD App.1 (11–14w)'
    };
  }

  // First Trimester (<= 13w6d): threshold is > 5 days (USG App.2 1.3)
  if (bestGaDaysAtScan <= 97) { // 13*7 + 6 = 97 days
    const threshold = 5;
    if (absDiscrepancy > threshold) {
      return {
        recommendedEdd: usEdd,
        eddMethod: 'CRL',
        discrepancyDays,
        shouldReDate: true,
        reDateReason: `Variation of ${absDiscrepancy} days exceeds the 1st trimester > ${threshold} days threshold. Adjust EDD to ultrasound CRL.`,
        source: 'USG App.2 (1.3)'
      };
    } else {
      return {
        recommendedEdd: lmpEdd,
        eddMethod: 'LMP',
        discrepancyDays,
        shouldReDate: false,
        reDateReason: `Variation of ${absDiscrepancy} days is within the allowable 5-day threshold. Keep LMP dating.`,
        source: 'USG App.2 (1.1, 1.3)'
      };
    }
  }

  // Post-14 weeks: rules only apply if there was NO first-trimester dating scan!
  if (hasFirstTrimesterScanAlready) {
    return {
      recommendedEdd: lmpEdd,
      eddMethod: 'LMP',
      discrepancyDays,
      shouldReDate: false,
      reDateReason: 'First-trimester dating scan was already established. Post-14w ultrasound should not re-date established pregnancy.',
      source: 'USG App.2 (2.3)'
    };
  }

  // 14–16w: threshold is > 7 days (USG App.2 2.3)
  if (usGaWeeks >= 14 && usGaWeeks <= 16) {
    const threshold = 7;
    if (absDiscrepancy > threshold) {
      return {
        recommendedEdd: usEdd,
        eddMethod: 'HC',
        discrepancyDays,
        shouldReDate: true,
        reDateReason: `Ultrasound at ${usGaWeeks}w varies by ${absDiscrepancy} days from LMP (> ${threshold} days). Adjust EDD to ultrasound.`,
        source: 'USG App.2 (2.3)'
      };
    }
    return {
      recommendedEdd: lmpEdd,
      eddMethod: 'LMP',
      discrepancyDays,
      shouldReDate: false,
      reDateReason: `Variation of ${absDiscrepancy} days is within the 7-day limit for 14–16w. Keep LMP dating.`,
      source: 'USG App.2 (2.3)'
    };
  }

  // 17–22w: threshold is > 10 days (USG App.2 2.3)
  if (usGaWeeks >= 17 && usGaWeeks <= 22) {
    const threshold = 10;
    if (absDiscrepancy > threshold) {
      return {
        recommendedEdd: usEdd,
        eddMethod: 'HC',
        discrepancyDays,
        shouldReDate: true,
        reDateReason: `Ultrasound at ${usGaWeeks}w varies by ${absDiscrepancy} days from LMP (> ${threshold} days). Adjust EDD to ultrasound.`,
        source: 'USG App.2 (2.3)'
      };
    }
    return {
      recommendedEdd: lmpEdd,
      eddMethod: 'LMP',
      discrepancyDays,
      shouldReDate: false,
      reDateReason: `Variation of ${absDiscrepancy} days is within the 10-day limit for 17–22w. Keep LMP dating.`,
      source: 'USG App.2 (2.3)'
    };
  }

  // 22–28w: threshold is > 14 days (USG App.2 2.4)
  if (usGaWeeks > 22 && usGaWeeks < 28) {
    const threshold = 14;
    if (absDiscrepancy > threshold) {
      return {
        recommendedEdd: usEdd,
        eddMethod: 'HC',
        discrepancyDays,
        shouldReDate: true,
        reDateReason: `Ultrasound between 22–28w varies by ${absDiscrepancy} days (> 14 days). Adjust EDD to ultrasound.`,
        source: 'USG App.2 (2.4)'
      };
    }
    return {
      recommendedEdd: lmpEdd,
      eddMethod: 'LMP',
      discrepancyDays,
      shouldReDate: false,
      reDateReason: `Variation of ${absDiscrepancy} days is within the 14-day limit. Keep LMP dating.`,
      source: 'USG App.2 (2.4)'
    };
  }

  // Third Trimester (>= 28w): least reliable, accuracy +/- 21-30 days (USG App.2 3.1-3.5)
  if (usGaWeeks >= 28) {
    const threshold = 21;
    if (absDiscrepancy > threshold) {
      return {
        recommendedEdd: usEdd,
        eddMethod: 'HC',
        discrepancyDays,
        shouldReDate: true,
        reDateReason: `Third-trimester discrepancy of ${absDiscrepancy} days (> 21 days). Re-dating advised. Repeat sonography in 2–3 weeks to ensure appropriate interval growth.`,
        warningAlert: 'CRITICAL ALERT: Risk of re-dating a small for gestational age fetus that may be growth restricted (FGR). Management decisions based on 3rd-trimester ultrasound alone require close surveillance.',
        source: 'USG App.2 (3.3, 3.4, 3.5)'
      };
    }
    return {
      recommendedEdd: lmpEdd,
      eddMethod: 'LMP',
      discrepancyDays,
      shouldReDate: false,
      reDateReason: `Third-trimester variation of ${absDiscrepancy} days is <= 21 days. Maintain LMP dating.`,
      source: 'USG App.2 (3.4)'
    };
  }

  return {
    recommendedEdd: lmpEdd,
    eddMethod: 'LMP',
    discrepancyDays,
    shouldReDate: false,
    reDateReason: 'Standard LMP dating retained.',
    source: 'USG App.2'
  };
}
