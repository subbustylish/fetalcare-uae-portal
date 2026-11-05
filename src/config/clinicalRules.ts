/**
 * Centralized Clinical Rules, Windows, and Thresholds
 * Source Authority: Department of Health (DOH) Abu Dhabi
 * 
 * Sources:
 * - [STD]: DOH Antenatal Care Standard (DOH/SD/Antenatal-Care/HCFS/V1/2024)
 * - [USG]: DOH Antenatal Ultrasound Guideline (V1, July 2022)
 * - [CIRC]: DOH Circular 19/2026 (Five mandatory antenatal visits)
 */

export interface ClinicalRuleItem<T = any> {
  value: T;
  source: string;
  description: string;
}

export const CLINICAL_RULES = {
  // Section 1 & 12: Medications & Prophylaxis
  medications: {
    aspirinDoseMg: {
      value: 150,
      source: 'STD App.1 (11–14w)',
      description: 'Aspirin 150 mg once daily at night, only for women flagged at risk of PET or FGR, started at 11–14 weeks.'
    },
    aspirinTiming: {
      value: 'nightly',
      source: 'STD App.1 (11–14w)',
      description: 'Taken once daily at night'
    }
  },

  // Section 1, 4 & 12: Laboratory Windows
  labWindows: {
    ogtt: {
      minWeeks: 24,
      maxWeeks: 28,
      source: 'STD App.1',
      description: '75g Oral Glucose Tolerance Test (OGTT) for gestational diabetes screening between 24 and 28 weeks.'
    },
    fetalRhDCfDna: {
      minWeeks: 16,
      maxWeeks: 18,
      maxDays: 6,
      source: 'STD App.1',
      description: 'Cell-free fetal DNA for fetal RhD status in Rh-negative mothers.'
    },
    gbsCulture: {
      minWeeks: 35,
      optimalWeeks: 36,
      source: 'STD App.1',
      description: 'Vaginal-rectal Group B Streptococcus (GBS) culture at >= 35 weeks (routinely 36 weeks).'
    },
    cbcAndAntibodyThirdTrimester: {
      targetWeek: 28,
      source: 'STD App.1',
      description: 'Repeat CBC and red cell antibody screen at 28 weeks.'
    }
  },

  // Section 4: DOH Antenatal Visit Schedule (STD App.1 + CIRC 19/2026)
  visitSchedules: {
    standardFrom11WeeksChecklist: [
      'Weight & BMI check',
      'Blood pressure measurement',
      'Urine dipstick (protein & glucose)',
      'Risk reassessment (diabetes, PET, VTE, FGR)',
      'Inquire about general health, sleep, nutrition, emotional wellbeing & mental health',
      'Update antenatal records with latest test results & medications'
    ],
    mandatoryVisitsCount: 5,
    mandatoryVisitsCircular: 'DOH Circular 19/2026',
    primaryCareTransferWindowWeeks: { min: 28, max: 32 },
    definitions: [
      {
        id: 'booking',
        title: 'Initial Booking Visit',
        minWeeks: 6,
        maxWeeks: 10,
        mandatoryWindow: { minWeeks: 10, maxWeeks: 14 },
        isMandatory: true,
        mandatoryVisitIndex: 1,
        source: 'STD App.1, CIRC 19/2026',
        description: 'Comprehensive obstetric, medical, surgical, lifestyle history; medicines/allergies; bariatric surgery / GLP-1 drugs; baseline blood pressure, height, weight, BMI; booking bloods.',
        checklist: [
          'Full obstetric history (complications in previous pregnancies, gestations, birth weights)',
          'Medical, surgical, gynecological & family history',
          'Review previous medical records (Malaffi HIE)',
          'Review current medications, allergies, bariatric surgery / GLP-1 agonists (Ozempic/Wegovy)',
          'Lifestyle history (smoking, alcohol, nutrition, physical activity, living conditions)',
          'Height, weight, BMI calculation, and baseline blood pressure',
          'Risk assessment for pre-eclampsia (PET), diabetes, VTE, and FGR',
          'Order booking investigations (CBC, Blood group & Rh, antibody screen, rubella, HIV, syphilis, HBsAg, varicella, urine dipstick & culture, fasting glucose/HbA1c)',
          'Prescribe prenatal multivitamin (folic acid, iron, DHA, calcium)'
        ],
        autoActions: [
          'Book First Trimester Dating & NT scan at 11+0 – 13+6w if aneuploidy screening accepted',
          'Record informed consent for routine screening tests'
        ]
      },
      {
        id: '11_14w',
        title: '11–14 Weeks Review Visit',
        minWeeks: 11,
        minDays: 0,
        maxWeeks: 14,
        maxDays: 0,
        isMandatory: false,
        source: 'STD App.1',
        description: 'Review NT ultrasound findings, confirm fetal number, finalize and lock EDD, offer NIPT if indicated, assess PET/FGR risk.',
        checklist: [
          'Review NT ultrasound scan results and confirm number of fetuses & chorionicity',
          'Finalize and lock EDD per DOH Gestational Dating Guidelines',
          'Discuss and offer NIPT if high risk (age >= 35, NT > 95th centile, abnormal combined screen)',
          'Breastfeeding counselling and management of early nausea/vomiting',
          'Reiterate benefits of vitamins and supplements'
        ],
        autoActions: [
          'If flagged at risk of PET or FGR -> advise Aspirin 150 mg once daily at night (STD App.1)',
          'Book 16–18 weeks antenatal review appointment'
        ]
      },
      {
        id: '16_18w',
        title: '16–18 Weeks Antenatal Review',
        minWeeks: 16,
        minDays: 0,
        maxWeeks: 18,
        maxDays: 6,
        isMandatory: false,
        source: 'STD App.1',
        description: 'Auscultate fetal heart, explain and offer detailed anatomy scan, cell-free DNA for fetal RhD in Rh-negative mothers.',
        checklist: [
          'Auscultate fetal heart sound',
          'If maternal Rh-negative, offer fetal RhD status testing through cell-free fetal DNA',
          'Explain purpose, scope, and limitations of the upcoming detailed anatomy scan',
          'Nutrition and weight gain counselling'
        ],
        autoActions: [
          'Book Detailed Fetal Anatomy Scan for 18+0 – 22+6 weeks gestation (CPT 76811)',
          'If indicated by high FGR/PET risk, refer to Fetal Medicine for Uterine Artery Doppler at 22–24w (once only)'
        ]
      },
      {
        id: '19_23w',
        title: '19–23 Weeks Anomaly Review Visit',
        minWeeks: 19,
        minDays: 0,
        maxWeeks: 23,
        maxDays: 6,
        isMandatory: true,
        mandatoryVisitIndex: 2,
        source: 'STD App.1, CIRC 19/2026',
        description: 'Review Detailed Anatomy Scan (CPT 76811) findings, assess placental site and cervical length, discuss GDM and upcoming OGTT.',
        checklist: [
          'Review results of Detailed Anatomy Scan (confirm all 22 mandatory structures visualized)',
          'Verify placental position and distance to internal cervical os',
          'Auscultate fetal heart if no scan done at this visit',
          'Discuss gestational diabetes mellitus (GDM) and importance of 75g OGTT screening'
        ],
        autoActions: [
          'Book 75g Oral Glucose Tolerance Test (OGTT) for 24–28 weeks gestation',
          'Book 28-week growth scan if indicated by FGR risk criteria'
        ]
      },
      {
        id: '25w',
        title: '25 Weeks Mid-Trimester Visit',
        minWeeks: 24,
        minDays: 0,
        maxWeeks: 25,
        maxDays: 6,
        isMandatory: false,
        source: 'STD App.1',
        description: 'Fetal movement awareness counselling, birth preferences discussion, pre-order 28w labs.',
        checklist: [
          'Fetal movement awareness: advise mother to contact maternity services immediately (day or night) if reduced or altered movements — do not wait',
          'Listen to fetal heart sound',
          'Discuss birth preferences, antenatal education classes, and breastfeeding preparation'
        ],
        autoActions: [
          'Pre-order CBC and red cell antibody screen for the 28-week visit',
          'Ensure 75g OGTT is scheduled within 24–28 weeks'
        ]
      },
      {
        id: '28w',
        title: '28 Weeks Review & Third Trimester Transition',
        minWeeks: 27,
        minDays: 0,
        maxWeeks: 28,
        maxDays: 6,
        isMandatory: true,
        mandatoryVisitIndex: 3,
        source: 'STD App.1, CIRC 19/2026',
        description: 'Review OGTT results, Symphysis-Fundal Height (SFH), CBC, antibody screen, TDAP + RSV vaccines, Anti-D prophylaxis, maternal sleep position advice.',
        checklist: [
          'Measure Symphysis-Fundal Height (SFH) in singleton pregnancies and plot on growth chart (unless regular scans or measured < 2w ago)',
          'Review 75g OGTT results; if GDM diagnosed, refer immediately to dietician and diabetes educator',
          'Review repeat CBC (hemoglobin) and red cell antibody screen',
          'Offer and discuss TDAP vaccination and RSV vaccination',
          'If mother Rh-negative and fetus Rh-positive or unknown: administer Anti-D immunoglobulin prophylaxis (not needed if cfDNA showed Rh-negative fetus)',
          'Advise mother to avoid going to sleep on her back after 28 weeks (left lateral position optimal)',
          'Reinforce fetal movement surveillance instructions'
        ],
        autoActions: [
          'If SFH < 10th centile -> book fetal growth scan within 1 week',
          'If EFW < 10th centile or AC < 5th centile on scan -> refer to Fetal Medicine services',
          'If GDM diagnosed -> generate clinical referral to Dietician & Diabetes Nurse'
        ]
      },
      {
        id: '32w',
        title: '32 Weeks Clinical Review',
        minWeeks: 31,
        minDays: 0,
        maxWeeks: 32,
        maxDays: 6,
        isMandatory: true,
        mandatoryVisitIndex: 4,
        source: 'STD App.1, CIRC 19/2026',
        description: 'Measure SFH, review fetal movements, plan primary care to hospital transfer, schedule routine 34–36w growth scan.',
        checklist: [
          'Measure and plot SFH on growth chart',
          'Review fetal movements and maternal wellbeing',
          'Verify CBC and antibody screen results if not completed at 28w',
          'For primary care setting: transfer antenatal care to hospital/obstetrician for delivery'
        ],
        autoActions: [
          'Book routine Third Trimester Growth Scan for 34–36 weeks (CPT 76805)',
          'If SFH < 10th centile -> book growth scan within 1 week',
          'Transfer antenatal care to delivering hospital'
        ]
      },
      {
        id: '34w',
        title: '34 Weeks Review & Birth Preparation',
        minWeeks: 33,
        minDays: 0,
        maxWeeks: 34,
        maxDays: 6,
        isMandatory: false,
        source: 'STD App.1',
        description: 'Measure SFH, review birth plan, discuss labor signs, educate on pre-eclampsia and obstetric cholestasis warning signs, discuss GBS culture.',
        checklist: [
          'Measure and plot SFH',
          'Review birth plan, labor stages, pain relief choices (epidural, nitrous oxide)',
          'Educate on warning symptoms: severe headache, visual disturbances, epigastric pain, generalized itching (cholestasis), fluid leakage, bleeding',
          'Explain Group B Streptococcus (GBS) screening rationale (performed at >= 35 weeks)'
        ],
        autoActions: [
          'Book growth scan if clinically indicated by SFH lag or symptoms'
        ]
      },
      {
        id: '36w',
        title: '36 Weeks Term Presentation & Screening',
        minWeeks: 35,
        minDays: 0,
        maxWeeks: 36,
        maxDays: 6,
        isMandatory: true,
        mandatoryVisitIndex: 5,
        source: 'STD App.1, CIRC 19/2026',
        description: 'Perform GBS culture (>= 35w), assess fetal presentation, repeat CBC & antibody screen, review 34-36w routine growth scan, book weekly visits.',
        checklist: [
          'Obtain vaginal-anorectal swab culture for Group B Streptococcus (GBS) (>= 35 weeks)',
          'Determine fetal presentation (confirm cephalic; if breech, discuss ECV options)',
          'Repeat CBC (hemoglobin) and red cell antibody screen',
          'Review 34–36w routine growth scan results and amniotic fluid volume',
          'Finalize delivery hospital admission arrangements and pediatric newborn care'
        ],
        autoActions: [
          'If EFW < 10th centile or AC < 5th centile -> urgent referral to Fetal Medicine (to be seen within 1 week)',
          'Book weekly antenatal review appointments from 37 to 40 weeks gestation'
        ]
      },
      {
        id: '37_40w',
        title: '37–40 Weeks Term Surveillance (Weekly)',
        minWeeks: 37,
        minDays: 0,
        maxWeeks: 41,
        maxDays: 0,
        isMandatory: false,
        source: 'STD App.1',
        description: 'Weekly clinical checks until delivery: BP, urine dipstick, fetal heart, presentation, cervical readiness, induction of labor counselling if post-term.',
        checklist: [
          'Weekly maternal blood pressure and urine protein checks',
          'Assess fetal lie, presentation, and engagement of the fetal head',
          'Auscultate fetal heart and assess maternal perception of movements',
          'Review active labor symptoms, membrane rupture protocols, and hospital triage hotline',
          'If pregnancy extends beyond 40w: discuss membrane sweep and formal induction of labor (IOL) plan at 41 weeks'
        ],
        autoActions: [
          'Schedule next weekly review appointment'
        ]
      }
    ]
  },

  // Section 1, 5, 8 & 14: Ultrasound Scan Windows & CPT Codes
  scans: {
    routineFirstTrimesterDatingNt: {
      cptCodes: ['76801', '76813'],
      minWeeks: 11,
      minDays: 0,
      maxWeeks: 13,
      maxDays: 6,
      crlMinMm: 45,
      crlMaxMm: 84,
      source: 'USG 6.1.2, USG App.1',
      title: 'First Trimester Dating & NT Scan (11+0 – 13+6w)',
      description: 'Confirm viability, accurate CRL dating, fetal count/chorionicity, gross anatomy, and nuchal translucency measurement.'
    },
    routineAnatomyDetailed: {
      cptCodes: ['76811'],
      minWeeks: 18,
      minDays: 0,
      maxWeeks: 22,
      maxDays: 6,
      bookingExtensionWeeks: 23,
      bookingExtensionDays: 6,
      idealWeek: 20,
      source: 'USG 6.1.3, USG 6.4.1, STD App.3',
      title: 'Detailed Fetal Anatomy Scan (18+0 – 22+6w)',
      description: 'Detailed structural organ-by-organ anatomical survey (ISUOG standard). Can be booked up to 23+6w, ideally around 20w.'
    },
    routineThirdTrimesterGrowthLowRisk: {
      cptCodes: ['76805'],
      minWeeks: 34,
      maxWeeks: 36,
      maxDays: 6,
      source: 'USG 6.1.4, USG 6.5.2',
      title: 'Third Trimester Growth Scan (34–36w)',
      description: 'Routine growth scan for low-risk pregnancies to detect late-onset FGR/SGA, placental clearance, and fetal presentation. The ROUTE study confirmed 36w is superior to 32w.'
    },
    cervicalLengthSurveillance: {
      cptCodes: ['76817'],
      minWeeks: 14,
      maxWeeks: 26,
      maxDays: 0,
      shortCervixThresholdMm: 30,
      source: 'USG 6.8.2, USG App.4',
      title: 'Transvaginal Cervical Length Assessment (14–26w)',
      description: 'Indicated only for women at high risk of preterm birth (previous PTB, cervical surgery, uterine anomaly, short cervix, mid-trimester loss). <=30mm repeat weekly; >=30mm repeat every 2-4 weeks.'
    },
    serialGrowthFgrRisk: {
      cptCodes: ['76816'],
      minWeeks: 24,
      maxWeeks: 40,
      intervalWeeksEarly: [2, 4], // from 24-26w every 2-4w
      intervalWeeksLate: 2, // after 32-34w consider every 2w
      source: 'USG 6.5.3, USG App.5',
      title: 'Serial Fetal Growth Scans for At-Risk Pregnancies (from 24–26w)',
      description: 'Follow-up ultrasound every 2-4 weeks from 24-26w, every 2 weeks after 32-34w for pregnancies with major FGR factors or >=3 minor factors.'
    },
    uterineArteryDoppler: {
      cptCodes: ['93975', '93976'],
      minWeeks: 16,
      maxWeeks: 24,
      maxTimes: 1, // Once only
      source: 'USG App.4, USG App.5',
      title: 'Uterine Artery Doppler (16–24w, once only)',
      description: 'Indicated for uteroplacental resistance assessment in high-risk screening. Must only be performed once; repeating is not recommended.'
    },
    fetalEchocardiography: {
      cptCodes: ['76825', '76826', '76827', '93325'],
      minWeeks: 19,
      maxWeeks: 26,
      source: 'USG App.1, USG App.6',
      title: 'Specialized Fetal Echocardiogram (19–24w)',
      description: 'Advanced cardiac examination for pre-existing diabetes, suspected congenital heart defect, abnormal 4-chamber/outflow tracts, or increased NT.'
    },
    keepsake3D4D: {
      cptCodes: ['76815'],
      minWeeks: 26,
      maxWeeks: 32,
      source: 'Clinical Practice Standard',
      title: '3D/4D HD-Live Elective Fetal Visualization',
      description: 'Optional keepsake bonding experience for facial profile and maternal reassurance.'
    }
  },

  // Section 3: Dating Engine Discrepancy Thresholds
  dating: {
    crlUpperLimitMm: {
      value: 84,
      source: 'USG App.2 (1.2)',
      description: 'CRL is reliable up to 84 mm (~13+6 to 14 weeks). For CRL > 84 mm, gestational age must be estimated using Head Circumference (HC).'
    },
    reDatingThresholdsDays: [
      {
        maxWeeks: 13,
        maxDays: 6,
        parameter: 'CRL',
        discrepancyDaysThreshold: 5,
        source: 'USG App.2 (1.3)',
        description: 'Variation > 5 days between LMP and 1st trimester CRL adjusts EDD to ultrasound.'
      },
      {
        minWeeks: 14,
        maxWeeks: 16,
        maxDays: 6,
        parameter: 'HC',
        discrepancyDaysThreshold: 7,
        source: 'USG App.2 (2.3)',
        description: 'Variation > 7 days between LMP and ultrasound at 14–16w adjusts EDD (if no 1st trimester scan).'
      },
      {
        minWeeks: 17,
        maxWeeks: 22,
        maxDays: 6,
        parameter: 'HC',
        discrepancyDaysThreshold: 10,
        source: 'USG App.2 (2.3)',
        description: 'Variation > 10 days between LMP and ultrasound at 17–22w adjusts EDD (if no 1st trimester scan).'
      },
      {
        minWeeks: 22,
        maxWeeks: 28,
        maxDays: 0,
        parameter: 'HC / Multi-parameter',
        discrepancyDaysThreshold: 14,
        source: 'USG App.2 (2.4)',
        description: 'Variation > 14 days between LMP and ultrasound at 22–28w adjusts EDD (if no 1st trimester scan).'
      },
      {
        minWeeks: 28,
        maxWeeks: 42,
        parameter: 'HC / FL / TCD',
        discrepancyDaysThreshold: 21,
        source: 'USG App.2 (3.4, 3.5)',
        description: 'Discrepancy > 21 days in 3rd trimester adjusts EDD; requires repeat scan in 2–3 weeks and warning of potential fetal growth restriction.'
      }
    ],
    ivfGestationDays: {
      value: 266,
      source: 'USG App.2 (4.1, 4.2)',
      description: 'For ART / IVF conception: EDD = Oocyte retrieval date + 266 days.'
    },
    eddLockVisitWeeks: {
      minWeeks: 11,
      maxWeeks: 14,
      source: 'STD App.1 (11–14w)',
      description: 'EDD is finalized and locked at the 11–14 week visit. Post-14w modifications require clinician clinical justification.'
    },
    minScanIntervalDays: {
      value: 14,
      source: 'USG 6.7.1',
      description: 'Repeat fetal biometric measurements should not be taken less than 14 days from previous scan.'
    }
  },

  // Section 10: Interval Rules
  intervals: {
    minBiometryIntervalDays: 14, // USG 6.7.1
    abnormalAfiRecheckWeeks: [1, 2], // USG 6.7.2
    abnormalUaDopplerSgaWeeks: 1, // USG 6.7.3
    incompleteAnatomyRepeatWeeks: [2, 3] // USG 6.4.3
  },

  // Section 6: Risk Engine Criteria
  riskEngine: {
    // 6.1 High-Risk Pregnancy Criteria (STD App.2) -> Obstetric-led care from booking
    highRiskObstetricLed: {
      source: 'STD App.2',
      description: 'Women with any of these current conditions or previous pregnancy complications require obstetric-led care from booking.',
      currentConditions: [
        'Cardiac disease (congenital or acquired)',
        'Hypertension (chronic or gestational)',
        'Renal disease (including post-transplant)',
        'Endocrine disorder or diabetes requiring insulin/metformin/GLP-1 receptor agonists',
        'Psychiatric disorder on active medication',
        'Haematological disorder (severe anemia, coagulopathy)',
        'Autoimmune disorder (SLE, APS, rheumatoid arthritis)',
        'Epilepsy requiring anticonvulsant drugs',
        'Malignant disease',
        'Severe asthma',
        'HIV or Hepatitis B infection',
        'Obesity (BMI >= 35) or underweight (BMI <= 18)',
        'PPROM in current pregnancy',
        'Maternal age >= 40',
        'Active smoker',
        'Vulnerable / adolescent / lacking social support',
        'Previous bariatric surgery (gastric bypass, sleeve, lap-band)',
        'Abnormal screening test or suspected fetal abnormality',
        'Spinal, pelvic or back trauma/injury',
        'Multiple sclerosis / neurological disorder',
        'Liver disease'
      ],
      previousPregnancyComplications: [
        'Recurrent miscarriage (>= 3 first-trimester or 1 second-trimester loss)',
        'Preterm birth (< 37 weeks)',
        'Severe pre-eclampsia, eclampsia, or HELLP syndrome',
        'Rhesus isoimmunisation or significant red cell blood group antibodies',
        'Uterine surgery (Cesarean section, myomectomy, isthmocele/niche, cone biopsy)',
        'Antepartum or postpartum haemorrhage on two occasions',
        'Puerperal psychosis',
        'Grand multiparity (>= 6 deliveries)',
        'Stillbirth or neonatal death',
        'Small for gestational age infant (< 10th centile) or birthweight < 2.5 kg',
        'Large for gestational age infant (> 95th centile) or birthweight > 4.5 kg',
        'Congenital abnormality (structural, genetic, or chromosomal)',
        'Obstetric cholestasis',
        'Cervical incompetence, cerclage, or cone biopsy/LEEP procedure',
        'Confirmed placenta accreta spectrum'
      ]
    },

    // 6.2 Fetal Growth Restriction (FGR) Risk Criteria (USG App.5) -> Serial Growth Scans
    fgrRisk: {
      source: 'USG App.5, USG 6.5.3',
      description: 'Any 1 major risk factor OR >= 3 minor risk factors mandates serial growth scans every 2–4 weeks from 24–26w (every 2 weeks after 32–34w) and Uterine Artery Doppler at 16–24w (once only).',
      majorFactors: [
        'Pre-existing diabetes',
        'Maternal hypertension',
        'Maternal autoimmune disease (SLE, APS, RA)',
        'Maternal renal disease (including post-transplant)',
        'Maternal heart disease (congenital or acquired)',
        'Maternal age >= 40',
        'Maternal smoker > 10 cigarettes/day',
        'Maternal daily vigorous exercise',
        'Previous bariatric surgery',
        'Previous stillbirth',
        'Previous fetal growth pathology (SGA or IUGR)',
        'Gestational diabetes',
        'Gestational hypertension requiring medication',
        'Pre-eclampsia in current pregnancy',
        'Obstetric cholestasis',
        'Recurrent antepartum haemorrhage (> 1 in 2nd/3rd trimester)',
        'COVID-19 requiring hospitalisation in index pregnancy',
        'Fetal echogenic bowel',
        'Major fetal structural abnormality (congenital heart disease, CNS)',
        'Major placenta praevia',
        'Placental or cord tumour or cyst',
        'PAPP-A < 0.40 MoM',
        'AFP > 2.0 MoM in second trimester',
        'Abnormal uterine artery Doppler (mean PI >= 2.0 in 1st tri or >= 1.45 in 2nd tri, or bilateral notching)',
        'Clinically small for gestational dates (suspected IUGR)',
        'Maternal BMI >= 35',
        'Multiple fibroids or 1 large fibroid (> 8 cm)'
      ],
      minorFactors: [
        'Maternal age > 35 years',
        'IVF singleton pregnancy',
        'Nulliparity',
        'BMI < 20',
        'BMI 25–34.9',
        'Smoker 1–10 cigarettes/day',
        'Previous pre-eclampsia',
        'Inter-pregnancy interval < 6 months',
        'Inter-pregnancy interval > 60 months'
      ],
      minorFactorsThreshold: 3
    },

    // 6.3 Non-Invasive Prenatal Testing (NIPT) Eligibility (STD App.3)
    niptEligibility: {
      source: 'STD App.3',
      description: 'High-risk women who should always be offered NIPT (or 2nd trimester screen if booked late).',
      indications: [
        'Maternal age >= 35 years',
        'High nuchal translucency (NT > 95th centile, or NT >= 3 mm -> also refer Fetal Medicine)',
        'Abnormal first trimester combined screen (free beta-hCG & PAPP-A) or second trimester serum screen',
        'Previous pregnancy history of aneuploidy (also refer Fetal Medicine for consultation)',
        'Fetal abnormality detected where invasive diagnostic testing is declined'
      ]
    }
  },

  // Section 7: Fetal Medicine Referral Criteria (USG App.6)
  fetalMedicineReferrals: {
    source: 'USG App.6',
    description: 'Criteria that mandate clinical decision support alert: "Suggested: Refer to Fetal Medicine Services".',
    thresholds: {
      ntMm: 3.0,
      renalPelvisApEarlyMm: 6.0, // < 28 weeks
      renalPelvisApLateMm: 10.0, // >= 28 weeks
      ventricleVpMm: 10.0,
      cisternaMagnaCmMm: 10.0,
      nuchalFoldNfMm: 6.0,
      biometryCentileLower: 3.0,
      oligohydramniosSvpCm: 2.0,
      oligohydramniosAfiCm: 5.0,
      polyhydramniosSvpEarlyCm: 8.0, // < 28 weeks
      polyhydramniosSvpLateCm: 10.0, // >= 28 weeks
      polyhydramniosAfiCm: 25.0,
      placentaDistanceLowLyingMm: 20.0
    },
    categories: [
      {
        category: 'History & Prior Pregnancy',
        items: [
          'Previous aneuploidy (Trisomy 21, 18, 13, Turner syndrome)',
          'Previous infant with structural anomaly, chromosomal abnormality, genetic syndrome or IUFD',
          'Previous early-onset PET (<= 32 weeks) or early-onset IUGR (<= 32 weeks)',
          'Previous spontaneous preterm birth <= 34 weeks or PPROM <= 34 weeks',
          'Previous mid-trimester loss (16–24 weeks)',
          'Maternal age > 35 (for first-trimester / NT detailed evaluation)'
        ]
      },
      {
        category: 'Ultrasound Scan Biomarkers & Anomalies',
        items: [
          'Major or minor structural abnormality on ultrasound',
          'Nuchal translucency NT >= 3.0 mm or cystic hygroma',
          'Renal pelvic dilatation: >= 6 mm before 28w, or >= 10 mm after 28w',
          'Cerebral ventriculomegaly (Vp >= 10 mm)',
          'Enlarged cisterna magna (CM >= 10 mm)',
          'Increased nuchal fold (NF >= 6 mm in mid-trimester)',
          'Echogenic bowel (brightness equal to bone)',
          'Femur length (FL) or head biometry < 3rd centile',
          'Soft ultrasound markers: choroid plexus cysts, echogenic intracardiac focus, single umbilical artery',
          'Amniotic fluid: Oligohydramnios (SVP < 2 cm or AFI < 5 cm after 26w) or Polyhydramnios (SVP > 8 cm < 28w / > 10 cm > 28w, or AFI > 25 cm)',
          'Fetal growth pathology: AC < 5th centile +/- EFW < 10th centile +/- abnormal Doppler, or escalating macrosomia > 95th centile'
        ]
      },
      {
        category: 'Multiple Pregnancy',
        items: [
          'All monochorionic twins (MCDA, MCMA)',
          'All triplets, quadruplets or higher-order multiple gestations',
          'Chorionicity unclear / not definitively determined',
          'Dichorionic diamniotic (DCDA) twins with complications (growth discordance >= 20%)'
        ]
      },
      {
        category: 'Placental & Preterm Risk Pathology',
        items: [
          'Low-lying placenta (< 20 mm from os) or placenta previa with prior Cesarean section or uterine surgery (rule out placenta accreta spectrum)',
          'Placental tumour, chorioangioma, large subchorionic haematoma, or unusual appearance',
          'Known congenital uterine anomaly (bicornuate, arcuate, Mullerian defects)',
          'Previous cervical surgery (cone biopsy or >= 2 LEEP/LLETZ procedures)',
          'Previable PPROM (< 24 weeks)'
        ]
      },
      {
        category: 'Maternal Medical Conditions & Red Cell Antibodies',
        items: [
          'Pre-existing Type 1 or Type 2 Diabetes',
          'Maternal epilepsy',
          'Maternal congenital heart disease',
          'Maternal Anti-Ro / Anti-La antibodies (congenital heart block risk)',
          'Connective tissue disorders (SLE, severe antiphospholipid syndrome)',
          'Sickle cell disease',
          'Chronic hypertension with renal disease',
          'Red blood cell antibodies: Anti-Kell (any titre) or other clinically significant antibodies with titre >= 32'
        ]
      }
    ]
  },

  // Section 8: Follow-up Protocols (USG App.4)
  followUpProtocols: {
    source: 'USG App.4',
    description: 'Specialized follow-up surveillance ultrasound protocols triggered by specific maternal-fetal risk profiles.',
    cervicalLength: {
      cptCode: '76817',
      source: 'USG 6.8.2, USG App.4 (1)',
      startWeeks: 14,
      endWeeks: 26,
      shortCervixThresholdMm: 30,
      frequencyShortMm: 'weekly', // <= 30mm
      frequencyNormalMm: 'every 2–4 weeks', // >= 30mm
      indications: ['previous preterm birth', 'cervical surgery', 'uterine anomaly', 'short cervix', 'mid-trimester loss']
    },
    sgaSurveillance: {
      source: 'USG App.4 (2)',
      criteria: 'AC or EFW 3rd–10th centile with normal UA & MCA Doppler',
      growthScanIntervalWeeks: 2, // CPT 76816 every 2 weeks
      dopplerIntervalWeeks: 2, // UA 76820 + MCA 76821 every 2 weeks
      bppIntervalWeeks: 1, // Weekly BPP 76818/76819
      cptCodes: ['76816', '76820', '76821', '76818']
    },
    fgrSurveillance: {
      source: 'USG App.4 (3)',
      criteria: 'EFW or AC < 3rd centile, OR 3rd–10th centile with abnormal UA and/or MCA Doppler',
      allScansIntervalWeeks: 1, // Weekly growth, UA, MCA, BPP
      uterineArteryDopplerOnce: true, // 93975 once only
      cptCodes: ['76816', '76820', '76821', '76818', '93975']
    },
    amnioticFluidSurveillance: {
      source: 'USG App.4 (4)',
      intervalWeeks: [2, 4],
      fetalMedicineReferralRequired: true,
      cptCodes: ['76816']
    },
    redCellAntibodiesHdfn: {
      source: 'USG App.4 (5)',
      startWeeks: 16,
      intervalWeeks: [1, 2], // every 1-2 weeks
      cptCodes: ['76816', '76821'] // growth + MCA PSV
    },
    lgaSurveillance: {
      source: 'USG App.4 (6)',
      criteria: 'EFW > 90th centile',
      startWeeks: 28,
      intervalWeeks: [2, 4],
      cptCodes: ['76816']
    },
    dcdaTwins: {
      source: 'USG App.4 (7)',
      growthStartWeeks: 24,
      growthEndWeeks: 36,
      growthIntervalWeeks: 4, // every 4w
      uaDopplerStartWeeks: 20,
      uaDopplerIntervalWeeks: 4, // every 4w
      cervicalLengthWindowWeeks: { min: 16, max: 24 }, // once
      cptCodes: ['76816', '76820', '76817']
    },
    mcdaTwins: {
      source: 'USG App.4 (8), USG 6.9.2',
      growthStartWeeks: 16,
      growthIntervalWeeks: 2, // every 2w
      dopplerStartWeeks: 20,
      dopplerIntervalWeeks: 2, // UA + MCA every 2w
      cervicalLengthWindowWeeks: { min: 16, max: 24 }, // once
      cptCodes: ['76816', '76820', '76821', '76817']
    },
    placentaPathologySurveillance: {
      source: 'USG App.4 (11)',
      weeks: [28, 32, 36],
      cptCodes: ['76816', '76817']
    }
  },

  // Section 9: Placenta Pathway (USG 6.5.4)
  placentaPathway: {
    source: 'USG 6.5.4',
    description: 'Protocol for managing low-lying placenta and placenta accreta spectrum (PAS) risk.',
    lowLyingThresholdMm: 20, // < 20 mm from internal os
    steps: [
      {
        step: 1,
        timingWeeks: '18–22w',
        event: 'Anatomy Scan',
        rule: 'Placental site and distance to internal os must be recorded in every scan. If < 20 mm from os -> classified as low-lying.'
      },
      {
        step: 2,
        timingWeeks: '28–30w',
        event: 'First Re-evaluation Scan',
        rule: 'Transabdominal scan (TAS) at 28–30w (TVS if suboptimal/unclear). If placenta remains low (< 20 mm or reaching/covering) -> schedule follow-up 4 weeks later.'
      },
      {
        step: 3,
        timingWeeks: '32–34w',
        event: 'Mandatory TVS Re-evaluation',
        rule: 'TVS + TAS 4 weeks after 28w scan. TVS is mandatory. No diagnosis of low-lying/previa from 32w can be made without TVS (USG 6.5.4.4).'
      },
      {
        step: 4,
        timingWeeks: '~36w',
        event: 'Term Evaluation & Delivery Planning',
        rule: 'Persistent low-lying/previa at 32w: perform growth scan + TVS at ~36w for mode of delivery (elective CS) and multidisciplinary surgical planning.'
      }
    ],
    priorCesareanSectionRule: {
      source: 'USG 6.5.4.7',
      rule: 'Any woman with previous Cesarean section or uterine surgery and a low-lying placenta/praevia must have scans at 28, 32, and 36 weeks in Fetal Medicine to rule out Placenta Accreta Spectrum (PAS).'
    },
    antepartumHaemorrhageRule: {
      source: 'USG 6.5.4.8',
      rule: 'Antepartum haemorrhage (APH) mandates urgent evaluation with both TVS and TAS.'
    }
  },

  // Section 10: Interval and Completeness Rules (USG 6.4, 6.6, 6.7)
  intervalAndCompletenessRules: {
    source: 'USG 6.4, 6.6, 6.7',
    description: 'Clinical safety intervals, minimum spacing, and completeness requirements.',
    minBiometrySpacingDays: {
      value: 14,
      source: 'USG 6.7.1',
      rule: 'Block repeat fetal biometric measurements if performed < 14 days after previous scan. Requires clinician override with documented justification.'
    },
    abnormalAmnioticFluidRecheck: {
      intervalWeeks: [1, 2],
      source: 'USG 6.7.2',
      rule: 'Abnormal amniotic fluid volume (oligohydramnios or polyhydramnios) requires repeat scan every 1–2 weeks until resolved.'
    },
    abnormalUaDopplerRecheck: {
      intervalWeeks: 1,
      source: 'USG 6.7.3',
      rule: 'Abnormal Umbilical Artery Doppler in SGA/FGR requires repeat surveillance at least weekly.'
    },
    incompleteAnatomyScan: {
      repeatWindowWeeks: [2, 3],
      source: 'USG 6.4.3',
      rule: 'If any mandatory anatomy scan item is "not seen", mark scan incomplete and schedule a limited repeat scan in 2–3 weeks.'
    },
    externalQualityScanReview: {
      source: 'USG 6.4.4',
      rule: 'A good-quality anatomy scan performed elsewhere should not be routinely repeated; record formal clinical review of external report.'
    },
    lateBookingNoAnomalyScan: {
      source: 'USG 6.4.5',
      rule: 'Booking > 24 weeks with no prior anatomy scan requires ordering CPT 76805 with "anomaly review" and counselling the patient regarding potential incomplete visualization.'
    },
    thirdTrimesterDatingRepeat: {
      source: 'USG 6.6.3',
      repeatWindowWeeks: [2, 3],
      rule: 'When dating is established in the third trimester (> 28w), repeat scan in 2–3 weeks to evaluate interval growth velocity.'
    }
  },

  // General Decision Support Disclaimers
  disclaimers: {
    doctorPortalFooter: {
      text: 'Decision support based on DOH Abu Dhabi guidance. Final decisions rest with the treating clinician.',
      source: 'DOH Build Spec Section 0.5'
    }
  }
} as const;


