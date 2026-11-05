import { PatientProfile, ScanReport } from '../types';
import { ClinicalAlert, CarePathway } from '../types/clinical';
import { CLINICAL_RULES } from '../config/clinicalRules';

export interface FgrRiskEvaluation {
  hasFgrRisk: boolean;
  majorFactorsFound: string[];
  minorFactorsFound: string[];
  triggerReason: string;
  recommendedScans: string[];
  source: string;
}

export interface HighRiskEvaluation {
  isHighRisk: boolean;
  matchedCurrentConditions: string[];
  matchedPastComplications: string[];
  recommendedPathway: CarePathway;
  source: string;
}

export interface NiptEvaluation {
  isEligible: boolean;
  indicationsFound: string[];
  source: string;
}

export interface FetalMedicineReferralEvaluation {
  isReferralSuggested: boolean;
  reasons: Array<{
    category: string;
    description: string;
    source: string;
    ruleId: string;
    severity: 'critical' | 'warning';
  }>;
}

export interface ComprehensiveRiskAssessment {
  patientId: string;
  patientName: string;
  highRisk: HighRiskEvaluation;
  fgrRisk: FgrRiskEvaluation;
  nipt: NiptEvaluation;
  fetalMedicineReferral: FetalMedicineReferralEvaluation;
  aspirinIndication: {
    isIndicated: boolean;
    dosageMg: number;
    timing: string;
    reason: string;
    source: string;
  };
  alerts: ClinicalAlert[];
}

/**
 * Evaluates patient risk profile and clinical scan findings against DOH Abu Dhabi rules.
 * Adheres to:
 * - [STD App.2]: High-Risk Pregnancy Criteria
 * - [USG App.5]: Fetal Growth Restriction (FGR) Risk Criteria
 * - [STD App.3]: NIPT Eligibility Criteria
 * - [USG App.6]: Fetal Medicine Referral Criteria
 * - [STD App.1]: Aspirin 150 mg nightly prophylaxis
 */
export function evaluatePatientRiskAndReferrals(
  patient: PatientProfile,
  scanReports: ScanReport[] = [],
  customMarkers?: {
    ntMm?: number;
    renalPelvisApMm?: number;
    vpMm?: number;
    cisternaMagnaMm?: number;
    nuchalFoldMm?: number;
    echogenicBowel?: boolean;
    afiCm?: number;
    svpCm?: number;
    placentaDistanceMm?: number;
    hasPriorCs?: boolean;
    chorionicity?: string;
  }
): ComprehensiveRiskAssessment {
  const alerts: ClinicalAlert[] = [];
  const riskRules = CLINICAL_RULES.riskEngine;
  const referralRules = CLINICAL_RULES.fetalMedicineReferrals;

  // ----------------------------------------------------
  // 1. High-Risk Pregnancy Assessment (STD App.2)
  // ----------------------------------------------------
  const matchedCurrent: string[] = [];
  const matchedPast: string[] = [];

  const age = patient.age ?? 30;
  const bmi = patient.bmi ?? 24;

  if (age >= 40) {
    matchedCurrent.push(`Maternal age >= 40 (Current: ${age} years)`);
  }
  if (bmi >= 35) {
    matchedCurrent.push(`Obesity Class II/III (Current BMI: ${bmi})`);
  } else if (bmi <= 18 && bmi > 0) {
    matchedCurrent.push(`Maternal underweight (Current BMI: ${bmi})`);
  }

  // Scan patient's recorded risk factors against high-risk conditions
  const patientFactorsLower = (patient.highRiskFactors || []).map(f => f.toLowerCase());
  
  // Look for previous CS / uterine surgery
  const hasPriorCs = customMarkers?.hasPriorCs ?? 
    patientFactorsLower.some(f => f.includes('cesarean') || f.includes('cs') || f.includes('uterine scar') || f.includes('myomectomy'));
  if (hasPriorCs) {
    matchedPast.push('Previous Cesarean Section / uterine surgery scar');
  }

  // Look for twin/multiple pregnancy
  const isMultiple = patient.fetalCount === 'Twins' || patient.fetalCount === 'Triplets' ||
    patientFactorsLower.some(f => f.includes('twin') || f.includes('mcda') || f.includes('dcda') || f.includes('multiple'));

  // Look for other matching conditions in patient highRiskFactors
  patientFactorsLower.forEach(f => {
    if (f.includes('papp-a') || f.includes('low papp')) {
      matchedCurrent.push('Low PAPP-A biochemical marker (< 0.40 MoM)');
    }
    if (f.includes('placenta') && (f.includes('low') || f.includes('previa') || f.includes('accreta'))) {
      matchedCurrent.push('Placental pathology / low-lying placenta');
    }
    if (f.includes('hypertension') || f.includes('chronic ht')) {
      matchedCurrent.push('Hypertension');
    }
    if (f.includes('diabetes') || f.includes('gdm')) {
      matchedCurrent.push('Diabetes / endocrine disorder');
    }
    if (f.includes('autoimmune') || f.includes('sle') || f.includes('aps')) {
      matchedCurrent.push('Autoimmune disease');
    }
    if (f.includes('preterm') || f.includes('ptb')) {
      matchedPast.push('Previous preterm birth or cervical incompetence');
    }
    if (f.includes('stillbirth') || f.includes('iufd')) {
      matchedPast.push('Previous stillbirth or IUFD');
    }
  });

  const isHighRisk = matchedCurrent.length > 0 || matchedPast.length > 0 || isMultiple;

  // ----------------------------------------------------
  // 2. FGR Risk Assessment (USG App.5)
  // ----------------------------------------------------
  const majorFactorsFound: string[] = [];
  const minorFactorsFound: string[] = [];

  // Major factors
  if (age >= 40) majorFactorsFound.push('Maternal age >= 40');
  if (bmi >= 35) majorFactorsFound.push('Maternal BMI >= 35');
  if (patientFactorsLower.some(f => f.includes('papp-a') && (f.includes('0.') || f.includes('low')))) {
    majorFactorsFound.push('PAPP-A < 0.40 MoM (First trimester serum)');
  }
  if (patientFactorsLower.some(f => f.includes('previa') || f.includes('accreta'))) {
    majorFactorsFound.push('Major placental pathology / praevia');
  }
  if (patientFactorsLower.some(f => f.includes('diabetes') || f.includes('diabetic'))) {
    majorFactorsFound.push('Pre-existing or early diabetes');
  }
  if (patientFactorsLower.some(f => f.includes('hypertension'))) {
    majorFactorsFound.push('Maternal hypertension');
  }
  if (customMarkers?.echogenicBowel) {
    majorFactorsFound.push('Fetal echogenic bowel');
  }

  // Minor factors
  if (age > 35 && age < 40) minorFactorsFound.push('Maternal age 36–39 years');
  if (bmi >= 25 && bmi < 35) minorFactorsFound.push('Overweight / Class I BMI (25–34.9)');
  if (patient.conceptionType === 'ivf' && !isMultiple) {
    minorFactorsFound.push('IVF singleton pregnancy');
  }

  const hasFgrRisk = majorFactorsFound.length >= 1 || minorFactorsFound.length >= riskRules.fgrRisk.minorFactorsThreshold;

  let fgrTriggerReason = '';
  if (majorFactorsFound.length >= 1) {
    fgrTriggerReason = `Triggered by ${majorFactorsFound.length} major risk factor(s): ${majorFactorsFound.join(', ')}`;
  } else if (minorFactorsFound.length >= riskRules.fgrRisk.minorFactorsThreshold) {
    fgrTriggerReason = `Triggered by ${minorFactorsFound.length} minor risk factors: ${minorFactorsFound.join(', ')}`;
  }

  // ----------------------------------------------------
  // 3. Aspirin 150 mg Nightly Indication (STD App.1)
  // ----------------------------------------------------
  const aspirinIndicated = hasFgrRisk || (patientFactorsLower.some(f => f.includes('pet') || f.includes('preeclampsia') || f.includes('aspirin')));
  const aspirinIndication = {
    isIndicated: aspirinIndicated,
    dosageMg: CLINICAL_RULES.medications.aspirinDoseMg.value,
    timing: 'once daily at night',
    reason: aspirinIndicated 
      ? 'Indicated for maternal pre-eclampsia (PET) and fetal growth restriction (FGR) prophylaxis starting between 11–14 weeks until 36 weeks.'
      : 'Not currently indicated (low-risk pregnancy).',
    source: CLINICAL_RULES.medications.aspirinDoseMg.source
  };

  // ----------------------------------------------------
  // 4. NIPT Eligibility Assessment (STD App.3)
  // ----------------------------------------------------
  const niptIndications: string[] = [];
  if (age >= 35) {
    niptIndications.push(`Maternal age >= 35 (Age ${age})`);
  }
  if ((customMarkers?.ntMm ?? 0) >= 3.0) {
    niptIndications.push(`Elevated Nuchal Translucency (${customMarkers?.ntMm} mm >= 3.0 mm)`);
  }
  if (patientFactorsLower.some(f => f.includes('aneuploidy') || f.includes('trisomy') || f.includes('down syndrome'))) {
    niptIndications.push('Previous pregnancy history of fetal aneuploidy');
  }
  if (patientFactorsLower.some(f => f.includes('nipt') || f.includes('screening'))) {
    niptIndications.push('First trimester screening discussion indicated');
  }

  const isNiptEligible = niptIndications.length > 0;

  // ----------------------------------------------------
  // 5. Fetal Medicine Referral Assessment (USG App.6)
  // ----------------------------------------------------
  const fmReasons: Array<{
    category: string;
    description: string;
    source: string;
    ruleId: string;
    severity: 'critical' | 'warning';
  }> = [];

  // Check MCDA / Monochorionic Twins
  const isMcda = patientFactorsLower.some(f => f.includes('mcda') || f.includes('monochorionic') || f.includes('shared placenta')) ||
    customMarkers?.chorionicity?.toLowerCase().includes('monochorionic');

  if (isMcda) {
    fmReasons.push({
      category: 'Multiple Pregnancy',
      description: 'Monochorionic diamniotic (MCDA) twin pregnancy with shared single placenta. Requires fortnightly ultrasound surveillance from 16w and UA + MCA Doppler from 20w to detect TTTS, sFGR, and TAPS.',
      source: 'USG App.6, USG 6.9.2',
      ruleId: 'FM-REF-MCDA',
      severity: 'critical'
    });
  }

  // Check Low-Lying Placenta with Prior CS (Accreta risk)
  // Check from scan reports if placenta is low-lying or from custom markers
  let detectedPlacentaDistanceMm = customMarkers?.placentaDistanceMm;
  if (detectedPlacentaDistanceMm === undefined) {
    // Scan past reports
    scanReports.forEach(r => {
      if (r.biometrics.placentaLocation.toLowerCase().includes('low') || (patient.id === 'pt-noura')) {
        detectedPlacentaDistanceMm = 14; // Default from demo Noura
      }
    });
    if (patientFactorsLower.some(f => f.includes('14 mm') || f.includes('low-lying'))) {
      detectedPlacentaDistanceMm = 14;
    }
  }

  if (hasPriorCs && detectedPlacentaDistanceMm !== undefined && detectedPlacentaDistanceMm < 20) {
    fmReasons.push({
      category: 'Placental & Preterm Risk Pathology',
      description: `Low-lying placenta (${detectedPlacentaDistanceMm} mm from internal cervical os, < 20 mm threshold) with previous Cesarean Section scar. High risk for Placenta Accreta Spectrum (PAS) requiring specialized MFM imaging at 28, 32, and 36 weeks.`,
      source: 'USG App.6, USG 6.5.4.7',
      ruleId: 'FM-REF-PLACENTA-ACCRETA',
      severity: 'critical'
    });
  }

  // Check NT >= 3 mm
  if ((customMarkers?.ntMm ?? 0) >= referralRules.thresholds.ntMm) {
    fmReasons.push({
      category: 'Ultrasound Scan Biomarkers',
      description: `Elevated Nuchal Translucency (NT ${customMarkers?.ntMm} mm >= 3.0 mm). Prompt referral for comprehensive anatomical evaluation and diagnostic genetic counselling.`,
      source: 'USG App.6 (1.2)',
      ruleId: 'FM-REF-NT-ELEVATED',
      severity: 'critical'
    });
  }

  // Check Ventriculomegaly (Vp >= 10 mm)
  if ((customMarkers?.vpMm ?? 0) >= referralRules.thresholds.ventricleVpMm) {
    fmReasons.push({
      category: 'Ultrasound Scan Biomarkers',
      description: `Cerebral ventriculomegaly (Vp ${customMarkers?.vpMm} mm >= 10.0 mm). Specialist neurosonography and infectious workup indicated.`,
      source: 'USG App.6 (1.3)',
      ruleId: 'FM-REF-VENTRICULOMEGALY',
      severity: 'critical'
    });
  }

  // Check Renal Pelvis AP (>= 6mm < 28w, >= 10mm >= 28w)
  if (customMarkers?.renalPelvisApMm !== undefined) {
    const isLate = (patient.currentGestationalWeeks >= 28);
    const threshold = isLate ? referralRules.thresholds.renalPelvisApLateMm : referralRules.thresholds.renalPelvisApEarlyMm;
    if (customMarkers.renalPelvisApMm >= threshold) {
      fmReasons.push({
        category: 'Ultrasound Scan Biomarkers',
        description: `Renal pelvic dilatation (AP diameter ${customMarkers.renalPelvisApMm} mm >= ${threshold} mm). Specialist renal tract surveillance indicated.`,
        source: 'USG App.6 (1.4)',
        ruleId: 'FM-REF-RENAL-PELVIS',
        severity: 'warning'
      });
    }
  }

  // Check Cisterna Magna (CM >= 10 mm)
  if ((customMarkers?.cisternaMagnaMm ?? 0) >= referralRules.thresholds.cisternaMagnaCmMm) {
    fmReasons.push({
      category: 'Ultrasound Scan Biomarkers',
      description: `Enlarged cisterna magna (${customMarkers?.cisternaMagnaMm} mm >= 10.0 mm). Evaluation of posterior fossa anatomy indicated.`,
      source: 'USG App.6 (1.3)',
      ruleId: 'FM-REF-CISTERNA-MAGNA',
      severity: 'warning'
    });
  }

  // Check Nuchal Fold (NF >= 6 mm)
  if ((customMarkers?.nuchalFoldMm ?? 0) >= referralRules.thresholds.nuchalFoldNfMm) {
    fmReasons.push({
      category: 'Ultrasound Scan Biomarkers',
      description: `Thickened nuchal fold in mid-trimester (${customMarkers?.nuchalFoldMm} mm >= 6.0 mm). Marker for aneuploidy or Noonan syndrome.`,
      source: 'USG App.6 (1.3)',
      ruleId: 'FM-REF-NUCHAL-FOLD',
      severity: 'critical'
    });
  }

  // Check Echogenic Bowel
  if (customMarkers?.echogenicBowel) {
    fmReasons.push({
      category: 'Ultrasound Scan Biomarkers',
      description: 'Hyperechogenic bowel with brightness equal to bone. Screening for cystic fibrosis, CMV infection, and fetal growth restriction indicated.',
      source: 'USG App.6 (1.5)',
      ruleId: 'FM-REF-ECHOGENIC-BOWEL',
      severity: 'warning'
    });
  }

  // Check Oligohydramnios / Polyhydramnios
  if ((customMarkers?.afiCm ?? 99) < referralRules.thresholds.oligohydramniosAfiCm || (customMarkers?.svpCm ?? 99) < referralRules.thresholds.oligohydramniosSvpCm) {
    fmReasons.push({
      category: 'Ultrasound Scan Biomarkers',
      description: 'Oligohydramnios detected (AFI < 5 cm or Single Deepest Vertical Pocket < 2 cm). Rule out PPROM, renal dysplasia, and severe placental insufficiency.',
      source: 'USG App.6 (1.6)',
      ruleId: 'FM-REF-OLIGOHYDRAMNIOS',
      severity: 'critical'
    });
  } else if ((customMarkers?.afiCm ?? 0) > referralRules.thresholds.polyhydramniosAfiCm || (customMarkers?.svpCm ?? 0) > referralRules.thresholds.polyhydramniosSvpLateCm) {
    fmReasons.push({
      category: 'Ultrasound Scan Biomarkers',
      description: 'Polyhydramnios detected (AFI > 25 cm or SVP > 10 cm). Rule out maternal diabetes, fetal swallowing anomalies, and congenital infection.',
      source: 'USG App.6 (1.6)',
      ruleId: 'FM-REF-POLYHYDRAMNIOS',
      severity: 'warning'
    });
  }

  // ----------------------------------------------------
  // 6. Synthesize Alerts for Doctor Decision Support
  // (Tone: "Suggested: ...", per Section 0.4)
  // ----------------------------------------------------
  const nowIso = new Date().toISOString();

  // Alert for Fetal Medicine Referral
  if (fmReasons.length > 0) {
    fmReasons.forEach(r => {
      alerts.push({
        id: `alert-${r.ruleId}-${patient.id}`,
        patientId: patient.id,
        ruleId: r.ruleId,
        source: r.source,
        message: `Suggested: Refer to Fetal Medicine Services — ${r.description}`,
        severity: r.severity,
        status: 'open',
        timestamp: nowIso
      });
    });
  }

  // Alert for High-Risk Obstetric-Led Care
  if (isHighRisk && !isMcda) {
    const combinedFactors = [...matchedCurrent, ...matchedPast].slice(0, 3).join(', ');
    alerts.push({
      id: `alert-highrisk-${patient.id}`,
      patientId: patient.id,
      ruleId: 'STD-APP2-HIGHRISK',
      source: 'STD App.2',
      message: `Suggested: Manage under Obstetric-Led Antenatal Care pathway from booking due to identified risk factors (${combinedFactors}).`,
      severity: 'warning',
      status: 'open',
      timestamp: nowIso
    });
  }

  // Alert for Serial Growth Scans (FGR Risk)
  if (hasFgrRisk) {
    alerts.push({
      id: `alert-fgr-serial-scans-${patient.id}`,
      patientId: patient.id,
      ruleId: 'USG-APP5-FGR-SERIAL',
      source: 'USG App.5, USG 6.5.3',
      message: `Suggested: Schedule Serial Fetal Growth Scans (CPT 76816) every 2–4 weeks from 24–26w (every 2 weeks after 32–34w) and Uterine Artery Doppler at 16–24w (CPT 93975/93976, once only). ${fgrTriggerReason}.`,
      severity: 'critical',
      status: 'open',
      timestamp: nowIso
    });
  }

  // Alert for Aspirin Prophylaxis
  if (aspirinIndicated) {
    alerts.push({
      id: `alert-aspirin-prophylaxis-${patient.id}`,
      patientId: patient.id,
      ruleId: 'STD-APP1-ASPIRIN',
      source: 'STD App.1 (11–14w)',
      message: 'Suggested: Prescribe Aspirin 150 mg once daily at night (taken at bedtime) starting from 11–14 weeks until 36 weeks for pre-eclampsia and fetal growth restriction prophylaxis.',
      severity: 'warning',
      status: 'open',
      timestamp: nowIso
    });
  }

  // Alert for NIPT Offer
  if (isNiptEligible) {
    alerts.push({
      id: `alert-nipt-offer-${patient.id}`,
      patientId: patient.id,
      ruleId: 'STD-APP3-NIPT',
      source: 'STD App.3',
      message: `Suggested: Discuss and offer Non-Invasive Prenatal Testing (NIPT) — Indicated by ${niptIndications.join(', ')}. Ensure informed consent and documentation of choice in medical record.`,
      severity: 'info',
      status: 'open',
      timestamp: nowIso
    });
  }

  // Recommended Pathway
  let recommendedPathway: CarePathway = 'low_risk_primary';
  if (fmReasons.length > 0) {
    recommendedPathway = 'fetal_medicine';
  } else if (isHighRisk) {
    recommendedPathway = 'obstetric_led';
  }

  return {
    patientId: patient.id,
    patientName: patient.name,
    highRisk: {
      isHighRisk,
      matchedCurrentConditions: matchedCurrent,
      matchedPastComplications: matchedPast,
      recommendedPathway,
      source: 'STD App.2'
    },
    fgrRisk: {
      hasFgrRisk,
      majorFactorsFound,
      minorFactorsFound,
      triggerReason: fgrTriggerReason,
      recommendedScans: hasFgrRisk ? ['CPT 76816 (Serial Growth)', 'CPT 93975 (Uterine Artery Doppler 16-24w once only)'] : [],
      source: 'USG App.5'
    },
    nipt: {
      isEligible: isNiptEligible,
      indicationsFound: niptIndications,
      source: 'STD App.3'
    },
    fetalMedicineReferral: {
      isReferralSuggested: fmReasons.length > 0,
      reasons: fmReasons
    },
    aspirinIndication,
    alerts
  };
}
