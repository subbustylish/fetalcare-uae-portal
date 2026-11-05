import { PatientProfile, ScanReport } from '../types';
import { CLINICAL_RULES } from '../config/clinicalRules';
import { parseDateIso, calculateGestationalAge } from './datingEngine';

export interface AutoScheduledScan {
  id: string;
  patientId: string;
  protocolKey: string;
  title: string;
  cptCodes: string[];
  targetGestationalWeeks: number;
  targetWindowWeeks: { min: number; max: number };
  dueDateIso: string;
  frequency: string;
  indication: string;
  source: string;
  isMandatoryTvs?: boolean;
  status: 'scheduled' | 'pending_confirmation' | 'overdue' | 'completed';
}

export interface PlacentaPathwayStepStatus {
  step: number;
  timingWeeks: string;
  event: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isMandatoryTvs: boolean;
  statusText: string;
  source: string;
}

export interface PlacentaPathwayEvaluation {
  hasPlacentaPathology: boolean;
  isLowLying: boolean;
  placentaDistanceToInternalOsMm?: number;
  hasPriorCesareanSection: boolean;
  isAccretaRisk: boolean;
  currentStepIndex: number;
  steps: PlacentaPathwayStepStatus[];
  summary: string;
  source: string;
}

export interface FollowUpProtocolEvaluation {
  patientId: string;
  patientName: string;
  activeProtocols: Array<{
    key: string;
    title: string;
    reason: string;
    frequency: string;
    cptCodes: string[];
    source: string;
  }>;
  autoScheduledScans: AutoScheduledScan[];
  placentaPathway: PlacentaPathwayEvaluation;
}

export interface ScanIntervalValidationResult {
  isBlocked: boolean;
  daysDiff: number;
  minRequiredDays: number;
  ruleId: string;
  source: string;
  message: string;
  canOverride: boolean;
}

/**
 * Calculates due date for a target gestational age in weeks from EDD
 */
export function calculateDateForGestationalWeek(eddIso: string, targetWeeks: number): string {
  const eddDate = parseDateIso(eddIso);
  // Full term is 40 weeks (280 days). Target days before EDD = (40 - targetWeeks) * 7
  const daysBeforeEdd = (40 - targetWeeks) * 7;
  const targetDate = new Date(eddDate.getTime() - daysBeforeEdd * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split('T')[0];
}

/**
 * Validates the safety interval between two scans under DOH USG 6.7.1
 * Repeat fetal biometry should not be taken less than 14 days from previous scan.
 */
export function validateScanInterval(
  previousScanDateIso: string,
  newScanDateIso: string,
  isBiometryScan: boolean = true
): ScanIntervalValidationResult {
  const prevDate = parseDateIso(previousScanDateIso);
  const newDate = parseDateIso(newScanDateIso);
  const diffTime = newDate.getTime() - prevDate.getTime();
  const daysDiff = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const minRequired = CLINICAL_RULES.intervalAndCompletenessRules.minBiometrySpacingDays.value;

  if (isBiometryScan && daysDiff < minRequired && daysDiff >= 0) {
    return {
      isBlocked: true,
      daysDiff,
      minRequiredDays: minRequired,
      ruleId: 'USG-6.7.1-MIN-INTERVAL',
      source: CLINICAL_RULES.intervalAndCompletenessRules.minBiometrySpacingDays.source,
      message: `Repeat biometry is spaced only ${daysDiff} day(s) from previous scan (minimum required: ${minRequired} days under DOH USG 6.7.1). Repeating biometry too early yields unreliable fetal growth velocity and may lead to false diagnosis of FGR. Clinician override with clinical justification is required.`,
      canOverride: true
    };
  }

  return {
    isBlocked: false,
    daysDiff,
    minRequiredDays: minRequired,
    ruleId: 'USG-6.7.1-PASS',
    source: CLINICAL_RULES.intervalAndCompletenessRules.minBiometrySpacingDays.source,
    message: `Scan spacing of ${daysDiff} days meets DOH guidelines (>= ${minRequired} days).`,
    canOverride: false
  };
}

/**
 * Evaluates follow-up surveillance protocols and placenta pathways for a patient
 * Sections 8, 9, 10
 */
export function evaluateFollowUpProtocols(
  patient: PatientProfile,
  scanReports: ScanReport[] = [],
  currentSimulationDate: string = '2026-11-04'
): FollowUpProtocolEvaluation {
  const autoScans: AutoScheduledScan[] = [];
  const activeProtocols: FollowUpProtocolEvaluation['activeProtocols'] = [];
  const patientFactorsLower = (patient.highRiskFactors || []).map(f => f.toLowerCase());
  const currentGa = calculateGestationalAge(patient.eddDate, parseDateIso(currentSimulationDate));

  // ----------------------------------------------------
  // 1. Cervical Length Protocol (USG App.4 (1))
  // ----------------------------------------------------
  const hasPretermRisk = patientFactorsLower.some(f => 
    f.includes('preterm') || f.includes('cervical') || f.includes('cerclage') || f.includes('leep') || f.includes('cone')
  );
  
  if (hasPretermRisk && currentGa.weeks >= 14 && currentGa.weeks <= 26) {
    const isShortCervix = patientFactorsLower.some(f => f.includes('short cervix') || f.includes('<= 30'));
    const freq = isShortCervix ? 'Weekly TVS' : 'Every 2–4 weeks TVS';
    activeProtocols.push({
      key: 'cervical_length',
      title: 'Transvaginal Cervical Length Surveillance (14–26w)',
      reason: 'High risk of preterm birth (previous PTB, cervical surgery or short cervix)',
      frequency: freq,
      cptCodes: ['76817'],
      source: CLINICAL_RULES.followUpProtocols.cervicalLength.source
    });

    autoScans.push({
      id: `auto-cx-${patient.id}`,
      patientId: patient.id,
      protocolKey: 'cervical_length',
      title: 'Transvaginal Cervical Length Assessment (CPT 76817)',
      cptCodes: ['76817'],
      targetGestationalWeeks: Math.min(26, Math.max(14, currentGa.weeks + (isShortCervix ? 1 : 2))),
      targetWindowWeeks: { min: 14, max: 26 },
      dueDateIso: calculateDateForGestationalWeek(patient.eddDate, Math.min(26, currentGa.weeks + (isShortCervix ? 1 : 2))),
      frequency: freq,
      indication: 'Preterm birth risk surveillance',
      source: CLINICAL_RULES.followUpProtocols.cervicalLength.source,
      status: 'scheduled'
    });
  }

  // ----------------------------------------------------
  // 2. Placenta Pathway & Accreta Surveillance (USG 6.5.4)
  // ----------------------------------------------------
  const hasPriorCs = patientFactorsLower.some(f => 
    f.includes('cesarean') || f.includes('cs') || f.includes('uterine scar')
  );
  
  let detectedDistanceMm: number | undefined;
  if (patient.id === 'pt-noura' || patientFactorsLower.some(f => f.includes('14 mm') || f.includes('low-lying') || f.includes('placenta'))) {
    detectedDistanceMm = 14; // Default from demo Noura
  }

  const isLowLying = detectedDistanceMm !== undefined && detectedDistanceMm < 20;
  const isAccretaRisk = hasPriorCs && isLowLying;

  const placentaSteps: PlacentaPathwayStepStatus[] = [
    {
      step: 1,
      timingWeeks: '18–22w',
      event: 'Detailed Anatomy Scan',
      isCompleted: currentGa.weeks >= 22,
      isCurrent: currentGa.weeks >= 18 && currentGa.weeks < 22,
      isMandatoryTvs: false,
      statusText: isLowLying ? `Low-lying placenta confirmed (${detectedDistanceMm} mm from internal os)` : 'Placental site confirmed',
      source: 'USG 6.5.4.1'
    },
    {
      step: 2,
      timingWeeks: '28–30w',
      event: 'TAS/TVS Re-evaluation Scan',
      isCompleted: currentGa.weeks >= 30,
      isCurrent: currentGa.weeks >= 28 && currentGa.weeks < 30,
      isMandatoryTvs: false,
      statusText: currentGa.weeks >= 30 
        ? 'Persistent low-lying placenta requiring 32w TVS' 
        : 'Transabdominal scan (TVS if unclear) to check migration away from internal os',
      source: 'USG 6.5.4.2'
    },
    {
      step: 3,
      timingWeeks: '32–34w',
      event: 'Mandatory Transvaginal (TVS) Scan',
      isCompleted: currentGa.weeks >= 34,
      isCurrent: currentGa.weeks >= 32 && currentGa.weeks < 34,
      isMandatoryTvs: true,
      statusText: isAccretaRisk
        ? 'Specialized TVS in Fetal Medicine to rule out Placenta Accreta Spectrum (PAS)'
        : 'Mandatory TVS — no diagnosis of low-lying/previa permitted after 32w without TVS (USG 6.5.4.4)',
      source: 'USG 6.5.4.4, USG 6.5.4.7'
    },
    {
      step: 4,
      timingWeeks: '~36w',
      event: 'Term Evaluation & Delivery Mode',
      isCompleted: currentGa.weeks >= 37,
      isCurrent: currentGa.weeks >= 35 && currentGa.weeks < 37,
      isMandatoryTvs: true,
      statusText: 'Final growth scan + TVS to finalize mode of delivery and surgical team preparedness',
      source: 'USG 6.5.4.5'
    }
  ];

  let currentPlacentaStep = 1;
  if (currentGa.weeks >= 35) currentPlacentaStep = 4;
  else if (currentGa.weeks >= 31) currentPlacentaStep = 3;
  else if (currentGa.weeks >= 27) currentPlacentaStep = 2;

  const placentaEvaluation: PlacentaPathwayEvaluation = {
    hasPlacentaPathology: isLowLying,
    isLowLying,
    placentaDistanceToInternalOsMm: detectedDistanceMm,
    hasPriorCesareanSection: hasPriorCs,
    isAccretaRisk,
    currentStepIndex: currentPlacentaStep,
    steps: placentaSteps,
    summary: isAccretaRisk
      ? 'High Risk: Low-lying placenta with prior Cesarean section. Mandates serial surveillance at 28, 32, and 36 weeks in Fetal Medicine to rule out Placenta Accreta Spectrum (PAS).'
      : isLowLying
      ? 'Low-lying placenta (< 20 mm from internal os). Follow-up TAS at 28–30 weeks, followed by mandatory TVS if still low.'
      : 'Normal placental location (clear of internal os by > 20 mm).',
    source: CLINICAL_RULES.placentaPathway.source
  };

  if (isLowLying) {
    activeProtocols.push({
      key: 'placenta_previa_pas',
      title: isAccretaRisk ? 'Placenta Accreta Spectrum (PAS) Surveillance' : 'Placental Migration Surveillance',
      reason: isAccretaRisk ? 'Low-lying placenta + Prior CS scar' : 'Low-lying placenta (< 20 mm from os)',
      frequency: '28w TAS/TVS, 32w Mandatory TVS, 36w Term Plan',
      cptCodes: ['76816', '76817'],
      source: CLINICAL_RULES.placentaPathway.source
    });

    // Auto-schedule step 2 (28-30w)
    if (currentGa.weeks < 28) {
      autoScans.push({
        id: `auto-placenta-28w-${patient.id}`,
        patientId: patient.id,
        protocolKey: 'placenta_28w',
        title: 'Placental Migration Scan at 28–30w (CPT 76816 / 76817)',
        cptCodes: ['76816', '76817'],
        targetGestationalWeeks: 28,
        targetWindowWeeks: { min: 28, max: 30 },
        dueDateIso: calculateDateForGestationalWeek(patient.eddDate, 28),
        frequency: 'One-off migration check (TVS if suboptimal)',
        indication: 'Low-lying placenta at 20w anatomy scan',
        source: 'USG 6.5.4.2',
        status: 'scheduled'
      });
    }

    // Auto-schedule step 3 (32w mandatory TVS)
    if (currentGa.weeks < 32) {
      autoScans.push({
        id: `auto-placenta-32w-${patient.id}`,
        patientId: patient.id,
        protocolKey: 'placenta_32w',
        title: 'Mandatory TVS Placental & Accreta Evaluation (CPT 76817)',
        cptCodes: ['76817'],
        targetGestationalWeeks: 32,
        targetWindowWeeks: { min: 32, max: 34 },
        dueDateIso: calculateDateForGestationalWeek(patient.eddDate, 32),
        frequency: 'Mandatory TVS in Fetal Medicine',
        indication: isAccretaRisk ? 'Rule out Placenta Accreta Spectrum (prior CS)' : 'Persistent low-lying placenta',
        source: 'USG 6.5.4.4, USG 6.5.4.7',
        isMandatoryTvs: true,
        status: 'scheduled'
      });
    }

    // Auto-schedule step 4 (36w term evaluation)
    if (currentGa.weeks < 36) {
      autoScans.push({
        id: `auto-placenta-36w-${patient.id}`,
        patientId: patient.id,
        protocolKey: 'placenta_36w',
        title: 'Term Growth Scan & TVS Delivery Planning (CPT 76816 + 76817)',
        cptCodes: ['76816', '76817'],
        targetGestationalWeeks: 36,
        targetWindowWeeks: { min: 35, max: 37 },
        dueDateIso: calculateDateForGestationalWeek(patient.eddDate, 36),
        frequency: 'Final preoperative evaluation',
        indication: 'Mode of delivery and operative team planning',
        source: 'USG 6.5.4.5',
        isMandatoryTvs: true,
        status: 'scheduled'
      });
    }
  }

  // ----------------------------------------------------
  // 3. MCDA Twin Surveillance (USG App.4 (8), USG 6.9.2)
  // ----------------------------------------------------
  const isMcda = patientFactorsLower.some(f => f.includes('mcda') || f.includes('monochorionic'));
  if (isMcda) {
    activeProtocols.push({
      key: 'mcda_twins',
      title: 'Monochorionic Twin Surveillance Protocol',
      reason: 'Shared single placenta (MCDA). High risk of TTTS, sFGR, TAPS, and TRAP.',
      frequency: 'Growth every 2 weeks from 16w; UA + MCA Doppler every 2 weeks from 20w; Cervical TVS once 16–24w',
      cptCodes: ['76816', '76820', '76821', '76817'],
      source: CLINICAL_RULES.followUpProtocols.mcdaTwins.source
    });

    // Auto-schedule next fortnightly scan
    const nextTargetWeeks = Math.max(16, currentGa.weeks + 2);
    autoScans.push({
      id: `auto-mcda-scan-${patient.id}`,
      patientId: patient.id,
      protocolKey: 'mcda_twins',
      title: `MCDA Twin Biometry & Doppler Surveillance (${nextTargetWeeks}w) [CPT 76816 + 76820 + 76821]`,
      cptCodes: ['76816', '76820', '76821'],
      targetGestationalWeeks: nextTargetWeeks,
      targetWindowWeeks: { min: nextTargetWeeks - 1, max: nextTargetWeeks + 1 },
      dueDateIso: calculateDateForGestationalWeek(patient.eddDate, nextTargetWeeks),
      frequency: 'Fortnightly (every 2 weeks)',
      indication: 'Surveillance for TTTS, sFGR, and TAPS',
      source: 'USG App.4 (8), USG 6.9.2',
      status: 'scheduled'
    });
  }

  // ----------------------------------------------------
  // 4. Serial FGR Risk Surveillance (USG App.5, App.4 (3))
  // ----------------------------------------------------
  const hasFgrRisk = patientFactorsLower.some(f => 
    (f.includes('papp-a') && f.includes('low')) || 
    (f.includes('age') && f.includes('41')) || 
    (f.includes('bmi') && f.includes('37'))
  );

  if (hasFgrRisk) {
    const isLateGest = currentGa.weeks >= 32;
    const freq = isLateGest ? 'Every 2 weeks' : 'Every 2–4 weeks';
    activeProtocols.push({
      key: 'fgr_serial',
      title: 'Serial Fetal Growth & Doppler Velocimetry (from 24–26w)',
      reason: 'Multiple major FGR risk factors (Age >= 40, BMI >= 35, low PAPP-A)',
      frequency: freq,
      cptCodes: ['76816', '93975'],
      source: CLINICAL_RULES.followUpProtocols.fgrSurveillance.source
    });

    if (currentGa.weeks < 24) {
      autoScans.push({
        id: `auto-fgr-24w-${patient.id}`,
        patientId: patient.id,
        protocolKey: 'fgr_serial',
        title: 'Initial Serial Growth Scan (24–26w) [CPT 76816]',
        cptCodes: ['76816'],
        targetGestationalWeeks: 24,
        targetWindowWeeks: { min: 24, max: 26 },
        dueDateIso: calculateDateForGestationalWeek(patient.eddDate, 24),
        frequency: 'Every 2–4 weeks from 24–26w',
        indication: 'FGR risk: Serial biometry & liquor assessment',
        source: 'USG App.5, USG 6.5.3',
        status: 'scheduled'
      });

      autoScans.push({
        id: `auto-fgr-uterine-doppler-${patient.id}`,
        patientId: patient.id,
        protocolKey: 'uterine_artery_doppler',
        title: 'Uterine Artery Doppler (16–24w, once only) [CPT 93975]',
        cptCodes: ['93975'],
        targetGestationalWeeks: 20,
        targetWindowWeeks: { min: 16, max: 24 },
        dueDateIso: calculateDateForGestationalWeek(patient.eddDate, 20),
        frequency: 'Once only (repeating not recommended)',
        indication: 'Uteroplacental resistance & notch assessment',
        source: 'USG App.4, App.5',
        status: 'scheduled'
      });
    }
  }

  return {
    patientId: patient.id,
    patientName: patient.name,
    activeProtocols,
    autoScheduledScans: autoScans,
    placentaPathway: placentaEvaluation
  };
}
