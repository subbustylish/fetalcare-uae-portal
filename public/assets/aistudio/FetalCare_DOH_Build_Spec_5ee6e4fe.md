# FetalCare UAE — Build Spec (DOH Abu Dhabi Antenatal Rules)

Sources (attached PDFs):
- **[STD]** DOH Antenatal Care Standard — DOH/SD/Antenatal-Care/HCFS/V1/2024
- **[USG]** DOH Antenatal Ultrasound Guideline — V1, July 2022
- **[CIRC]** DOH Circular 19/2026 — five mandatory antenatal visits

---

## 0. Instructions for the AI builder

1. Keep the existing UI, design, navigation and both portals (Mother View, Doctor & Staff). Do not redesign.
2. Put ALL clinical rules, windows and thresholds in ONE config file (e.g. `src/config/clinicalRules.ts`), each with a `source` field (e.g. `"USG App.6"`). No clinical numbers hard-coded inside components.
3. Everything must be **calculated from patient data** (LMP/EDD, risk factors, scan measurements). Remove static, hard-coded clinical lists.
4. The app is **clinical decision support**. Alerts say "Suggested" / "Consider", and the doctor confirms, overrides (with a reason) or dismisses. Log every decision.
5. Show this footer in the doctor portal: "Decision support based on DOH Abu Dhabi guidance. Final decisions rest with the treating clinician."
6. Make demo data internally consistent (one patient = one gestational age everywhere, on every date).
7. Build phase by phase (see section 17). Do not start the next phase until the current one works.

---

## 1. Fixes to the current prototype (do first)

| # | Current | Change to | Source |
|---|---|---|---|
| 1 | "Baby Aspirin 100mg" | Aspirin **150 mg once daily at night**, only for women flagged at risk of PET or FGR | STD App.1 (11–14w) |
| 2 | OGTT "24–26 weeks" | OGTT **24–28 weeks** | STD App.1 |
| 3 | Routine "Growth & Doppler 28–32w" for all | Routine growth scan **34–36w** for low-risk. Growth scans from 24–26w and Doppler only when the risk engine triggers them | USG 6.1.4, 6.5.2, App.4/5 |
| 4 | No 34–36w scan in roadmap/booking | Add "Third Trimester Growth Scan (34–36w)" | USG 6.1.4 |
| 5 | Cervical scan "16–24w" | **14–26w**, only for at-risk women (section 8.1) | USG 6.8.2, App.4 |
| 6 | Anomaly scan label "20–22w" | **18–22w** (allow booking to 23+6, ideally ~20w) | USG 6.4.1, STD App.3 |
| 7 | Same patient shows 22w4d / 28w4d / 32w0d | GA always computed from EDD and the date | — |
| 8 | "6 scans scheduled" but 2 shown | Count computed from real list | — |
| 9 | Badge "DoH & DHA Compliant" | Remove (no formal certification yet) | — |
| 10 | Booking list missing NT scan and anomaly scan | Add both, with their DOH windows | USG 6.1 |

---

## 2. Data model

- **Patient**: id, name, Emirates ID, MRN, DOB, phone, insurer, blood group, Rh status, facility (Abu Dhabi / Dubai).
- **Pregnancy**: LMP, LMP certain (y/n), cycle length, conception type (natural / IVF), oocyte retrieval date, number of fetuses, chorionicity/amnionicity, EDD, EDD method (LMP / CRL / HC / IVF), EDD locked (y/n), care pathway (low-risk primary / obstetric-led / fetal medicine), risk factors[], status.
- **Visit**: type (from section 4), due window, date done, checklist items done, notes, clinician.
- **Scan**: type, CPT code, date, GA, fetus id, measurements (CRL, NT, BPD, HC, AC, FL, EFW + centiles, AFI, SVP, placenta position + distance to internal os, cervical length, UA PI, MCA PI, Vp, TCD, CM, NF, renal pelvis AP), anatomy checklist, complete (y/n), report.
- **Lab**: test, date, result, normal/abnormal.
- **Consent**: test offered, accepted/declined, date, clinician.
- **Referral**: reason, rule triggered, to (Obstetrician / Fetal Medicine / Dietician), status.
- **Alert**: rule id, message, severity, status (open/accepted/overridden), override reason.
- **AuditLog**: user, action, record, timestamp.

---

## 3. Dating engine (USG App.2)

- GA (days) = date − LMP (if LMP certain and cycle 26–33 days).
- CRL dating (up to CRL 84 mm, ~14w): GA(days) = 8.052 × √CRL(mm) + 23.73 (Robinson). Verify against your chosen reference table.
- CRL > 84 mm: date by HC.
- **Re-date to ultrasound when the difference from LMP is more than:**

| Scan GA | Threshold |
|---|---|
| ≤ 13+6w (CRL) | > 5 days |
| 14–16w | > 7 days |
| 17–22w | > 10 days |
| 22–28w | > 14 days |
| ≥ 28w | > 21 days (and repeat scan in 2–3 weeks) |

  The 14w+ rules only apply if there was no first-trimester dating scan.
- LMP unknown → use earliest CRL.
- IVF → EDD = oocyte retrieval date + 266 days (overrides others).
- Multiple pregnancy → use the **largest** fetus.
- EDD is finalised and locked at the 11–14w visit (STD App.1). Changes after that need doctor override with reason.
- Third-trimester dating: warn "Risk of re-dating a small fetus — consider growth restriction".

---

## 4. Visit schedule (STD App.1 + CIRC)

Auto-generate all visits from EDD. Each visit has a checklist the clinician ticks.

**Every visit from 11w:** weight, BP, urine dipstick, risk reassessment (section 6), ask about wellbeing / concerns / mental health, update records.

| Visit | Window | Key checklist items | Auto-actions |
|---|---|---|---|
| Booking | ideally ≤ 10w (mandatory 10–14w) | Full obstetric, medical, surgical, family history; previous records (Malaffi); medicines & allergies; bariatric surgery / GLP-1 drugs (Ozempic, Wegovy, Saxenda etc.); lifestyle; height, weight, BMI, BP; risk assessment (diabetes, PET, VTE, FGR); booking bloods (sec. 12) | Book NT scan 11–13+6w if aneuploidy screening accepted; prenatal vitamin; record consent |
| 11–14w | 11+0–14+0 | Review NT & number of fetuses; finalise EDD; discuss/offer NIPT | If PET/FGR risk → suggest aspirin 150 mg nightly; book 16–18w visit |
| 16–18w | 16+0–18+6 | Fetal heart; explain anatomy scan; Rh-neg → fetal RhD cfDNA | Book anatomy scan 18+0–22+6; if indicated refer FM for uterine artery Doppler 22–24w |
| 19–23w | 19+0–23+6 | Review anomaly scan; discuss GTT | Book OGTT 24–28w; book 28w growth scan if FGR risk |
| 25w | 25 | Fetal movements counselling; birth preferences; antenatal classes | Pre-order CBC + antibody screen for 28w |
| 28w | 28 | Review growth scan & plot; SFH (singleton, unless regular scans or measured < 2 weeks ago); OGTT result; CBC + antibodies | TDAP + RSV vaccines; Anti-D if Rh-neg and fetus Rh-pos/unknown; GDM → refer dietician + diabetes nurse; advise not to sleep on back |
| 32w | 32 | As 28w | Book routine growth scan 34–36w; **primary care: transfer to hospital** |
| 34w | 34 | Review birth plan; PET & cholestasis warning signs; discuss GBS | — |
| 36w | 36 | GBS culture (≥ 35w); CBC + antibody screen; birth plan | Book weekly visits 37–40w |
| 37–40w | weekly | Standard checks | — |

**SFH rules (all visits 28w+):** low-risk: SFH every 4 weeks from 26/28w; SFH < 10th centile → growth scan within 1 week.

**Growth scan result rule (28/32/34/36w):** EFW < 10th centile OR AC < 5th centile → refer Fetal Medicine (at 36w: to be seen within 1 week).

**Care pathway:** low-risk → primary care, transfer to obstetrician between 28–32w (or at booking if presenting after 32w). High-risk (section 6.1) → obstetric-led care from booking.

**Mandatory 5 visits (CIRC 19/2026):** flag "Missed mandatory visit" on the doctor dashboard and remind the mother. Confirm the exact five windows from the circular (first two: 10–14w booking, ~20w anomaly).

---

## 5. Routine scans (USG 6.1)

| Scan | Window | CPT |
|---|---|---|
| First trimester / dating + NT | 11+0–13+6w (CRL 45–84 mm) | 76801 + 76813 |
| Anatomy (detailed) | 18+0–22+6w | 76811 |
| Third trimester growth (low-risk) | 34–36w | 76805 |

- Placental position vs internal os recorded in every 2nd and 3rd trimester scan (USG 6.5.4).
- Before 8 weeks, or if transabdominal is suboptimal → transvaginal (76817).

---

## 6. Risk engine

### 6.1 High-risk pregnancy (STD App.2) → obstetric-led care from booking

Current: cardiac disease; hypertension; renal disease; diabetes or endocrine disorder on insulin/metformin/GLP-1; psychiatric disorder on medication; haematological disorder; autoimmune disorder; epilepsy on anticonvulsants; malignancy; severe asthma; HIV or Hepatitis B; BMI ≥ 35 or ≤ 18; PPROM; age ≥ 40; smoker; vulnerable/teenager/no social support; previous bariatric surgery; abnormal screening / fetal abnormality; spinal/pelvic/back trauma; MS/neurological disorder; RA/SLE; liver disease.

Previous pregnancy: recurrent miscarriage (≥ 3 first-trimester or 1 second-trimester loss); preterm birth < 37w; severe PET / eclampsia / HELLP; Rh or other significant red cell antibodies; uterine surgery (CS, myomectomy, niche, cone biopsy); APH/PPH on two occasions; puerperal psychosis; grand multiparity ≥ 6; stillbirth or neonatal death; SGA baby (< 10th centile); LGA baby (> 95th centile); birthweight < 2.5 kg or > 4.5 kg; congenital abnormality; obstetric cholestasis; cervical incompetence/cerclage/LEEP; confirmed placenta accreta; threatened preterm labour or PPROM < 30w; anaesthetic problems; hyperthermia / severe needle phobia.

### 6.2 FGR risk → serial growth scans (USG App.5)

**Rule:** any major factor, OR ≥ 3 minor factors → growth scans every 2–4 weeks from 24–26w (consider every 2 weeks after 32–34w), CPT 76816. Uterine artery Doppler (93975/93976) once only, 16–24w, if needed.

Major: pre-existing diabetes; hypertension; autoimmune disease (SLE, APS, RA); renal disease incl. transplant; heart disease; age ≥ 40; smoker > 10/day; daily vigorous exercise; previous bariatric surgery; previous stillbirth; previous SGA/IUGR; gestational diabetes; gestational hypertension on medication; pre-eclampsia; obstetric cholestasis; recurrent APH (> 1 in 2nd/3rd trimester); COVID-19 requiring hospitalisation this pregnancy; fetal echogenic bowel; major fetal structural abnormality; major placenta praevia; placental/cord tumour or cyst; PAPP-A < 0.40 MoM; AFP > 2.0 MoM (2nd trimester); uterine artery mean PI ≥ 2.0 (1st tri) or ≥ 1.45 (2nd tri) or bilateral notching; clinically small for dates; BMI ≥ 35; multiple fibroids or one > 8 cm.

Minor (need ≥ 3): age > 35; IVF singleton; nulliparity; BMI < 20; BMI 25–34.9; smoker 1–10/day; previous pre-eclampsia; pregnancy interval < 6 months; interval > 60 months.

### 6.3 Always offer NIPT (STD App.3)

Age ≥ 35; NT > 95th centile; abnormal combined test or 2nd-trimester serum screen; previous aneuploidy (also refer FM); fetal abnormality where invasive testing is declined. All women: offer first-trimester screening (NT/combined) at 11–14w; late bookers → 2nd-trimester screening or NIPT. Document offer and any decline.

---

## 7. Fetal Medicine referral alerts (USG App.6)

Trigger "Suggest referral to Fetal Medicine" when:

- **History:** previous aneuploidy; age > 35 (for NT/first-trimester scan); previous baby with structural anomaly, chromosomal abnormality, genetic syndrome or IUFD.
- **Scan findings:**
  - NT ≥ 3 mm or cystic hygroma; any structural abnormality
  - Renal pelvis AP ≥ 6 mm before 28w, or ≥ 10 mm after 28w
  - Ventricle (Vp) ≥ 10 mm; cisterna magna ≥ 10 mm; nuchal fold ≥ 6 mm
  - Echogenic bowel (as bright as bone)
  - FL or head biometry < 3rd centile
  - Choroid plexus cyst; echogenic heart focus; single umbilical artery
  - Oligohydramnios: SVP < 2 cm or AFI < 5 cm (after 26w)
  - Polyhydramnios: SVP > 8 cm (< 28w) or > 10 cm (> 28w), or AFI > 25 cm (after 26w)
  - AC < 5th centile ± EFW < 10th ± abnormal Doppler/fluid
  - AC/EFW > 95th centile with escalating growth on serial scans
- **Multiple pregnancy:** chorionicity unclear; all monochorionic twins; all triplets or higher; DCDA only if other criteria met.
- Previable PPROM < 24w.
- **Maternal:** type 1/2 diabetes; epilepsy; congenital heart disease; anti-Ro/anti-La; teratogen exposure; hypertension / chronic renal disease; SLE/connective tissue disease; sickle cell disease; significant chronic respiratory disease.
- **Red cell antibodies:** any titre if previous baby needed transfusion; all anti-Kell; others titre ≥ 32.
- Abnormal screening (combined/triple/quadruple/NIPT) or TORCH/Parvovirus B19.
- Low-lying placenta/praevia with previous CS or uterine surgery; placental tumour, large haematoma, unusual appearance.
- **Preterm risk:** previous spontaneous preterm birth ≤ 34w; previous PPROM ≤ 34w; mid-trimester loss 16–24w; uterine anomaly; previous cone biopsy or ≥ 2 LLETZ/LEEP.
- Previous early-onset PET or IUGR (≤ 32w).

---

## 8. Follow-up protocols (USG App.4) — auto-schedule when triggered

1. **Cervical length** (risk: previous preterm birth, cervical surgery, uterine anomaly, short cervix, mid-trimester loss): TVS 76817 from 14w to 26w. ≤ 30 mm → weekly; ≥ 30 mm → every 2–4 weeks.
2. **SGA** (AC or EFW 3rd–10th centile, normal UA & MCA Doppler): growth 76816 every 2 weeks; UA 76820 + MCA 76821 every 2 weeks until delivery; BPP 76818/76819 weekly.
3. **FGR** (EFW/AC < 3rd centile, or 3rd–10th with abnormal UA and/or MCA Doppler): 76816, 76820, 76821, 76818/76819 weekly; uterine artery Doppler once.
4. **Amniotic fluid abnormality / PPROM:** 76816 every 2–4 weeks from 2nd trimester; refer FM.
5. **Red cell antibodies / risk of HDFN:** 76816 + MCA 76821 every 1–2 weeks from 16w until delivery.
6. **LGA** (EFW > 90th centile): 76816 every 2–4 weeks in 3rd trimester.
7. **DCDA twins:** growth every 4 weeks 24–36w; UA every 4 weeks from 20w; cervical length once 16–24w.
8. **MCDA twins:** growth every 2 weeks from 16w; UA + MCA every 2 weeks from 20w; cervical length once 16–24w.
9. **Trichorionic triplets:** growth every 2 weeks from 16w; UA every 2 weeks from 20w; cervical length at 16–17, 20–21, 22–24w.
10. **DC/MC triamniotic triplets, quadruplets+:** growth from 16w; UA + MCA every 2 weeks from 20w; cervical length at 16–17, 20–21, 22–24w.
11. **Placenta previa / accreta / vasa previa:** 76816 and/or TVS 76817 at 28–36w.

---

## 9. Placenta pathway (USG 6.5.4)

- Low-lying at anatomy scan → TAS at 28–30w (TVS if unclear).
- Still low at 28–30w (covering, reaching, or < 20 mm from internal os) → TVS + TAS 4 weeks later (TVS mandatory).
- Persistent low-lying/previa at 32w, asymptomatic → growth scan + TVS at ~36w (mode of delivery discussion).
- No diagnosis of low-lying/previa from 32w without TVS.
- Previous CS/uterine surgery → 28, 32, 36w scans in Fetal Medicine (rule out accreta).
- Antepartum haemorrhage → TVS + TAS.
- "Placenta previa" = lies directly over internal os.

---

## 10. Interval and completeness rules (USG 6.4, 6.6, 6.7)

- Block (with override) repeat biometry < 14 days after the previous one.
- Abnormal fluid → recheck every 1–2 weeks until normal.
- Abnormal UA Doppler in SGA/FGR → at least weekly.
- Anatomy scan incomplete → limited repeat scan in 2–3 weeks.
- Good-quality anatomy scan done elsewhere → don't repeat; record review of the external report.
- Booking > 24w with no anomaly scan → order 76805 with "anomaly review"; tell patient it may be incomplete.
- Dated in 3rd trimester → repeat scan in 2–3 weeks.

---

## 11. Anatomy scan checklist (USG App.3)

Each item: seen ✓ / not seen / abnormal, plus image saved ✓. Items with * are desirable, not mandatory.

HC (transthalamic) · TCD (transcerebellar) · atrium Vp · nuchal fold* · face: lips & nose (coronal), orbits, profile* · AC (stomach + umbilical vein) · abdominal wall cord insertion · kidneys (renal pelvis AP if ≥ 6 mm) · bladder + 3-vessel cord (colour Doppler) · spine (sagittal + coronal; axial*) · femur length · extremities (3 long bones × 4 limbs, hands & feet) · diaphragm · placental site vs internal os · heart: situs, four-chamber, LVOT, RVOT, 3-vessel view, 3-vessel-trachea*.

If any mandatory item is "not seen" → mark scan incomplete → suggest rebook in 2–3 weeks.

---

## 12. Labs, vaccines and treatments (STD App.1)

- **Booking:** rubella, HIV, syphilis, HBsAg, varicella (if no chickenpox history), vitamin D (if indicated), CBC, haemoglobinopathy (if not done), sickle cell (by ethnicity / MCH), ABO/Rh/antibody screen, urine dipstick + culture, RBG/FBG/HbA1c.
- **16–18w:** Rh-negative → fetal RhD by cell-free DNA.
- **24–28w:** OGTT.
- **28w:** CBC + antibody screen; TDAP; RSV; Anti-D if Rh-neg and fetus Rh-pos/unknown (not needed if cfDNA shows fetus Rh-neg).
- **36w (≥ 35w):** GBS culture; CBC + antibody screen.
- **Supplements:** prenatal multivitamin (folic acid, iron, DHA); extra monitoring after bariatric surgery.
- **Aspirin 150 mg nightly** if PET/FGR risk (from 11–14w visit).

---

## 13. Counselling & education tracker (STD 3.4.1.14 + App.1)

Tick when discussed, with date: nutrition, physical activity, supplements, common pregnancy symptoms, screening tests, dental visit, home visit programme (consent), breastfeeding, fetal movements (contact maternity services any time if reduced — don't wait), GDM, antenatal classes, birth plan, labour signs, pain relief, PET & cholestasis warning signs, postnatal care, newborn screening, vitamin K, safe sleep position after 28w.

---

## 14. CPT codes (USG App.1)

76801 1st trimester (+76802 each additional fetus) · 76805 after 14w growth/late booking (+76810) · 76811 detailed anatomy (+76812) · 76813 NT (+76814) · 76815 limited/quick look · 76816 follow-up per fetus · 76817 transvaginal · 76818 BPP with CTG · 76819 BPP without CTG · 76820 UA Doppler · 76821 MCA Doppler · 76825/76826 fetal echo · 76827/76828 fetal Doppler echo · 93325 colour flow mapping · 93975/93976 uterine artery Doppler.

Each booking and report carries its CPT code. Non-routine scans require a documented indication (USG 3.2).

---

## 15. KPI dashboard (STD App.4) — doctor/admin only

1. Obstetric history completion at booking · 2. Booked for care + delivery < 20w · 3. Anomaly scan at 18–24w · 4. Hb at booking, 28w and 36w · 5. PET screening after 20w · 6. Supplement counselling + prescription · 7. Average visits 4–28w · 8. Average visits 28–36w · 9. Average visits 36–40w · 10. First visit < 11w · 11. Delivery booked by 20w · 12. Birth plan by 36w · 13. GBS screening (> 35w) · 14. Growth chart generated (> 28w) · 15. SFH plotted > 2 times (> 28w) · 16. High-risk women with EFW plotted > 2 times (> 28w).

Show numerator, denominator and %, filterable by date range and facility, exportable to Excel/PDF.

---

## 16. Consent, records and security

- Consent log for every screening offered/accepted/declined (STD 3.2.1.2).
- Every visit and scan saved to the patient record with clinician and timestamp; full audit log.
- Doctor login: 2-factor authentication; role-based access (consultant, sonographer, midwife, admin).
- Placeholder for Malaffi (Abu Dhabi) / NABIDH (Dubai) record lookup.
- Facility setting: Abu Dhabi uses these DOH rules; Dubai facilities may need separate rule sets.
- Patient data must be stored in the UAE before real patients use the app.

---

## 17. Build phases

1. **Phase 1:** Section 1 fixes + data model (section 2) + dating engine (section 3).
2. **Phase 2:** Auto visit schedule + checklists (section 4) + routine scans (section 5) + mother-side timeline and reminders.
3. **Phase 3:** Risk engine (section 6) + referral alerts (section 7) + doctor alert panel (accept/override/dismiss).
4. **Phase 4:** Follow-up protocols, placenta pathway, interval rules (sections 8–10).
5. **Phase 5:** Anatomy checklist (section 11), labs/vaccines (section 12), education (section 13), CPT on bookings (section 14).
6. **Phase 6:** KPI dashboard (section 15), consent/audit/security (section 16).

Test each phase with these demo patients:
- **Sarah** — low-risk, 22w, normal anatomy scan → routine pathway only.
- **Noura** — previous CS, placenta 14 mm from os at 20w → placenta pathway + Fetal Medicine referral.
- **Maryam** — MCDA twins → fortnightly scans from 16w, UA+MCA from 20w, FM referral.
- **Aisha** (new) — age 41, BMI 37, PAPP-A 0.32 MoM → high-risk, serial growth scans, aspirin, NIPT offered.
