/**
 * Section 15: DOH Antenatal Quality Performance Indicators (STD App.4)
 * Reference: DOH/SD/Antenatal-Care/HCFS/V1/2024 Appendix 4
 */

export interface DOHKpiItem {
  id: number;
  indicator: string;
  shortCode: string;
  description: string;
  numeratorDescription: string;
  denominatorDescription: string;
  facility: 'Abu Dhabi' | 'Dubai' | 'All';
  numerator: number;
  denominator: number;
  percentage: number;
  targetBenchmark: number; // e.g. 95 for 95%
  benchmarkCondition: '>=' | '<=';
  status: 'compliant' | 'borderline' | 'action_required';
  source: string;
}

export interface KpiSummaryStats {
  facility: string;
  totalPregnantBooked: number;
  averageCompliancePercent: number;
  compliantCount: number;
  borderlineCount: number;
  actionRequiredCount: number;
}

export const DOH_KPI_DEFINITIONS: Omit<DOHKpiItem, 'facility' | 'numerator' | 'denominator' | 'percentage' | 'status'>[] = [
  {
    id: 1,
    indicator: 'Obstetric History Completion at Booking',
    shortCode: 'KPI-01',
    description: 'Percentage of women with complete prior obstetric & medical history documented at booking visit.',
    numeratorDescription: 'Number of women with full parity, gravidity, prior CS, and medical risk history logged',
    denominatorDescription: 'Total women with booking visit completed',
    targetBenchmark: 98,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 1)'
  },
  {
    id: 2,
    indicator: 'Booked for Antenatal Care + Delivery < 20 Weeks',
    shortCode: 'KPI-02',
    description: 'Proportion of pregnant women who book their comprehensive care and delivery plan prior to 20 weeks gestation.',
    numeratorDescription: 'Women booked for antenatal care and delivery with an identified hospital prior to 20w 0d',
    denominatorDescription: 'Total booked pregnant cohort',
    targetBenchmark: 90,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 2)'
  },
  {
    id: 3,
    indicator: 'Detailed Anomaly Scan Performed at 18–24 Weeks',
    shortCode: 'KPI-03',
    description: 'Ultrasound screening for structural fetal anomalies completed within the approved gestational window (18w 0d to 24w 0d).',
    numeratorDescription: 'Women who had an anomaly scan (CPT 76805 / 76811) completed between 18–24 weeks',
    denominatorDescription: 'Total active cohort reaching >= 24 weeks',
    targetBenchmark: 95,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 3) & USG 6.4'
  },
  {
    id: 4,
    indicator: 'Hemoglobin (Hb) Screened at Booking, 28w, and 36w',
    shortCode: 'KPI-04',
    description: 'Routine complete blood count surveillance to detect and manage gestational anemia per clinical schedule.',
    numeratorDescription: 'Women who had CBC/Hb performed at all 3 mandated milestones (Booking, 28w, 36w)',
    denominatorDescription: 'Delivered women or cohort >= 36 weeks',
    targetBenchmark: 95,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 4) & App.1'
  },
  {
    id: 5,
    indicator: 'Preeclampsia (PET) Risk Screening After 20 Weeks',
    shortCode: 'KPI-05',
    description: 'Blood pressure and urine protein testing performed at every antenatal contact after 20 weeks.',
    numeratorDescription: 'Antenatal encounters after 20w with documented BP and proteinuria evaluation',
    denominatorDescription: 'Total visits conducted after 20w gestation',
    targetBenchmark: 98,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 5)'
  },
  {
    id: 6,
    indicator: 'Prenatal Supplement Counselling & Prescription',
    shortCode: 'KPI-06',
    description: 'Documentation of advice and prescription for folic acid, elemental iron, calcium/vitamin D, and aspirin where indicated.',
    numeratorDescription: 'Women with documented supplement counselling and active electronic prescription',
    denominatorDescription: 'Total booking cohort',
    targetBenchmark: 100,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 6)'
  },
  {
    id: 7,
    indicator: 'Average Visits in Period: 4–28 Weeks Gestation',
    shortCode: 'KPI-07',
    description: 'Frequency of routine clinical checkups in the first and second trimesters (Target: 3.5–4.5 visits).',
    numeratorDescription: 'Total completed antenatal visits between 4w and 28w across cohort',
    denominatorDescription: 'Total women enrolled before 12w and reaching 28w',
    targetBenchmark: 90,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 7)'
  },
  {
    id: 8,
    indicator: 'Average Visits in Period: 28–36 Weeks Gestation',
    shortCode: 'KPI-08',
    description: 'Frequency of bi-weekly checkups during early third trimester (Target: 3.0–4.0 visits).',
    numeratorDescription: 'Total completed antenatal visits between 28w and 36w',
    denominatorDescription: 'Total women reaching 36w',
    targetBenchmark: 90,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 8)'
  },
  {
    id: 9,
    indicator: 'Average Visits in Period: 36–40 Weeks Gestation',
    shortCode: 'KPI-09',
    description: 'Frequency of weekly checkups approaching term (Target: 3.0–4.5 visits).',
    numeratorDescription: 'Total completed antenatal visits between 36w and 40w',
    denominatorDescription: 'Total term deliveries >= 37w',
    targetBenchmark: 88,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 9)'
  },
  {
    id: 10,
    indicator: 'First Antenatal Booking Visit Initiated < 11 Weeks',
    shortCode: 'KPI-10',
    description: 'Early initiation of antenatal care enabling first-trimester dating and screening.',
    numeratorDescription: 'Women who attended their booking visit at < 11w 0d gestation',
    denominatorDescription: 'Total booked pregnancies',
    targetBenchmark: 85,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 10)'
  },
  {
    id: 11,
    indicator: 'Hospital Delivery Plan Formally Booked by 20 Weeks',
    shortCode: 'KPI-11',
    description: 'Ensuring bed allocation, obstetrician alignment, and emergency delivery routing by mid-pregnancy.',
    numeratorDescription: 'Women with confirmed delivery hospital booking letter signed by 20w',
    denominatorDescription: 'Total cohort reaching 20w',
    targetBenchmark: 92,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 11)'
  },
  {
    id: 12,
    indicator: 'Individualized Birth Plan Completed by 36 Weeks',
    shortCode: 'KPI-12',
    description: 'Documented discussion of birth partner, analgesia choices, and emergency preferences prior to term.',
    numeratorDescription: 'Women with signed birth preference plan documented by 36w visit',
    denominatorDescription: 'Total cohort reaching 36w',
    targetBenchmark: 85,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 12) & STD App.1'
  },
  {
    id: 13,
    indicator: 'Group B Streptococcus (GBS) Screening (> 35 Weeks)',
    shortCode: 'KPI-13',
    description: 'Vaginal-rectal swab culture performed between 35 and 37 weeks to prevent early-onset neonatal sepsis.',
    numeratorDescription: 'Women with documented GBS culture result performed at > 35w',
    denominatorDescription: 'Total deliveries >= 36 weeks',
    targetBenchmark: 95,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 13) & STD App.1'
  },
  {
    id: 14,
    indicator: 'Fetal Growth Chart Plotted & Monitored (> 28 Weeks)',
    shortCode: 'KPI-14',
    description: 'Symphysis-fundal height or ultrasound estimated fetal weight plotted on standardized customized charts.',
    numeratorDescription: 'Women with active serial growth chart maintained at all visits > 28w',
    denominatorDescription: 'Total cohort reaching > 28 weeks',
    targetBenchmark: 96,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 14) & USG 6.7'
  },
  {
    id: 15,
    indicator: 'Symphysis Fundal Height (SFH) Plotted > 2 Times (> 28w)',
    shortCode: 'KPI-15',
    description: 'Serial clinical SFH measurement plotted to detect fetal growth restriction in low-risk singleton pregnancies.',
    numeratorDescription: 'Low-risk women with >= 2 separate SFH recordings plotted on growth curve > 28w',
    denominatorDescription: 'Low-risk singleton pregnancies reaching > 34w',
    targetBenchmark: 92,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 15)'
  },
  {
    id: 16,
    indicator: 'High-Risk Women with Serial EFW Plotted > 2 Times (> 28w)',
    shortCode: 'KPI-16',
    description: 'Biometric ultrasound surveillance (EFW + Doppler) plotted on growth chart with minimum 14-day intervals.',
    numeratorDescription: 'High-risk women with >= 2 serial ultrasound EFW biometries plotted > 28w',
    denominatorDescription: 'Total high-risk cohort (FGR risks, MCDA twins, maternal comorbidities) > 28w',
    targetBenchmark: 95,
    benchmarkCondition: '>=',
    source: 'STD App.4 (KPI 16) & USG App.5'
  }
];

export const MOCK_FACILITY_DATA: Record<'Abu Dhabi' | 'Dubai', { num: number[]; den: number[] }> = {
  'Abu Dhabi': {
    // Numerator and Denominators for the 16 KPIs in Abu Dhabi center
    num: [194, 182, 190, 185, 196, 200, 180, 178, 172, 174, 186, 170, 188, 194, 184, 96],
    den: [200, 200, 198, 195, 200, 200, 198, 192, 185, 200, 200, 185, 192, 200, 195, 100]
  },
  'Dubai': {
    // Numerator and Denominators for Dubai center
    num: [142, 131, 138, 130, 144, 148, 132, 128, 122, 118, 136, 120, 134, 140, 130, 68],
    den: [150, 150, 146, 144, 150, 150, 145, 140, 135, 150, 150, 135, 142, 150, 145, 72]
  }
};

export function getKpiItemsForFacility(facilityFilter: 'Abu Dhabi' | 'Dubai' | 'All'): DOHKpiItem[] {
  return DOH_KPI_DEFINITIONS.map((def, idx) => {
    let num = 0;
    let den = 0;

    if (facilityFilter === 'Abu Dhabi') {
      num = MOCK_FACILITY_DATA['Abu Dhabi'].num[idx];
      den = MOCK_FACILITY_DATA['Abu Dhabi'].den[idx];
    } else if (facilityFilter === 'Dubai') {
      num = MOCK_FACILITY_DATA['Dubai'].num[idx];
      den = MOCK_FACILITY_DATA['Dubai'].den[idx];
    } else {
      num = MOCK_FACILITY_DATA['Abu Dhabi'].num[idx] + MOCK_FACILITY_DATA['Dubai'].num[idx];
      den = MOCK_FACILITY_DATA['Abu Dhabi'].den[idx] + MOCK_FACILITY_DATA['Dubai'].den[idx];
    }

    const percentage = den > 0 ? Math.round((num / den) * 1000) / 10 : 0;
    
    let status: 'compliant' | 'borderline' | 'action_required' = 'compliant';
    if (percentage >= def.targetBenchmark) {
      status = 'compliant';
    } else if (percentage >= def.targetBenchmark - 5) {
      status = 'borderline';
    } else {
      status = 'action_required';
    }

    return {
      ...def,
      facility: facilityFilter,
      numerator: num,
      denominator: den,
      percentage,
      status
    };
  });
}

/**
 * Generate CSV export text for DOH clinical quality audits
 */
export function generateKpiCsvExport(kpis: DOHKpiItem[], facility: string, dateRange: string): string {
  const headers = ['KPI Code', 'Indicator Name', 'Facility', 'Numerator', 'Denominator', 'Compliance Rate (%)', 'Target Benchmark (%)', 'Audit Status', 'DOH Reference Standard'];
  
  const rows = kpis.map(k => [
    k.shortCode,
    `"${k.indicator}"`,
    k.facility,
    k.numerator,
    k.denominator,
    `${k.percentage}%`,
    `${k.targetBenchmark}%`,
    k.status.toUpperCase(),
    `"${k.source}"`
  ]);

  const metaHeader = [
    `# Abu Dhabi Department of Health (DOH) Quality Performance Indicator Report`,
    `# Standard Reference: DOH/SD/Antenatal-Care/HCFS/V1/2024 Appendix 4`,
    `# Selected Facility: ${facility} · Reporting Range: ${dateRange}`,
    `# Export Generated: ${new Date().toISOString()}`,
    ''
  ].join('\n');

  return metaHeader + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
