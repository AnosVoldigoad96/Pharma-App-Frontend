-- Test Data for Comments Table
-- This SQL file inserts sample comments for the test threads
-- Note: You need to run threads-test-data.sql first to get the thread IDs

-- First, get the thread IDs (you'll need to replace these with actual IDs from your database)
-- This query will insert comments for threads based on their slugs

-- Insert comments for "Best Practices for Drug-Drug Interaction Screening"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Great question! I use Lexicomp and Micromedex primarily. For herbal interactions, I always check Natural Medicines database. The key is having multiple sources to cross-reference.',
  'Dr. Jennifer Martinez',
  true,
  8,
  NOW() - INTERVAL '4 days'
FROM public.threads t
WHERE t.slug = 'best-practices-drug-drug-interaction-screening'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'I''ve found that UpToDate has excellent drug interaction checkers. For real-world evidence, I also use PubMed to search for case reports. Herbal supplements are tricky - always document patient education!',
  'Dr. Robert Kim',
  true,
  12,
  NOW() - INTERVAL '3 days'
FROM public.threads t
WHERE t.slug = 'best-practices-drug-drug-interaction-screening'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Don''t forget about grapefruit interactions! I keep a laminated reference card for CYP450 interactions. It''s saved me multiple times.',
  'PharmD Student',
  true,
  5,
  NOW() - INTERVAL '2 days'
FROM public.threads t
WHERE t.slug = 'best-practices-drug-drug-interaction-screening'
LIMIT 1;

-- Insert comments for "Pharmacogenomics in Clinical Practice"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'We use GeneSight for our pharmacogenomic testing. It''s been incredibly helpful for antidepressant selection. The reports are comprehensive and easy to interpret for both clinicians and patients.',
  'Dr. Amanda Foster',
  true,
  15,
  NOW() - INTERVAL '7 days'
FROM public.threads t
WHERE t.slug = 'pharmacogenomics-clinical-practice-case-studies'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'I had a similar case with warfarin dosing. Patient was a CYP2C9 poor metabolizer. We had to reduce the dose significantly and monitor INR more frequently. PGx testing is becoming essential!',
  'Dr. Michael Chen',
  true,
  9,
  NOW() - INTERVAL '6 days'
FROM public.threads t
WHERE t.slug = 'pharmacogenomics-clinical-practice-case-studies'
LIMIT 1;

-- Insert comments for "Antibiotic Stewardship"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'We track days of therapy (DOT), antibiotic days, and resistance patterns. Our stewardship program reduced broad-spectrum antibiotic use by 30% in the first year. Key is having pharmacy leadership involved.',
  'Dr. Lisa Thompson',
  true,
  18,
  NOW() - INTERVAL '2 days'
FROM public.threads t
WHERE t.slug = 'antibiotic-stewardship-balancing-efficacy-resistance'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Procalcitonin levels have been game-changing for us. We use them to guide duration of antibiotic therapy, especially in pneumonia cases. It''s reduced unnecessary extended courses.',
  'Dr. David Park',
  true,
  11,
  NOW() - INTERVAL '1 day'
FROM public.threads t
WHERE t.slug = 'antibiotic-stewardship-balancing-efficacy-resistance'
LIMIT 1;

-- Insert comments for "Managing Opioid Prescriptions"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'The new guidelines are challenging. We''ve implemented a pain management clinic with multimodal approaches - physical therapy, NSAIDs, gabapentin, etc. Tapering needs to be gradual - 10% reduction per week minimum.',
  'Dr. Nicole Anderson',
  true,
  14,
  NOW() - INTERVAL '11 days'
FROM public.threads t
WHERE t.slug = 'managing-opioid-prescriptions-new-guidelines'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Don''t forget about naloxone co-prescribing! It''s now standard practice in many states. Also, consider buprenorphine for patients with opioid use disorder - it''s underutilized.',
  'Dr. Christopher Brown',
  true,
  7,
  NOW() - INTERVAL '10 days'
FROM public.threads t
WHERE t.slug = 'managing-opioid-prescriptions-new-guidelines'
LIMIT 1;

-- Insert comments for "Biosimilars vs. Biologics"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'We''ve switched many patients to biosimilars for infliximab and adalimumab. Cost savings are significant - sometimes 30-40%. No clinical differences observed. FDA''s Purple Book is a great resource for interchangeability.',
  'Dr. Rachel Green',
  true,
  16,
  NOW() - INTERVAL '5 days'
FROM public.threads t
WHERE t.slug = 'biosimilars-vs-biologics-clinical-equivalence'
LIMIT 1;

-- Insert comments for "Pediatric Dosing"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'For most medications, weight-based is standard. BSA is critical for chemotherapy and some critical care meds. Always double-check with pediatric dosing references - children aren''t small adults!',
  'Dr. Mark Wilson',
  true,
  13,
  NOW() - INTERVAL '9 days'
FROM public.threads t
WHERE t.slug = 'pediatric-dosing-weight-based-vs-bsa-calculations'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Don''t forget about age-based dosing for certain medications. Some drugs have different pharmacokinetics in neonates vs. older children. Always verify with Lexicomp Pediatric or similar.',
  'Dr. Patricia Davis',
  true,
  6,
  NOW() - INTERVAL '8 days'
FROM public.threads t
WHERE t.slug = 'pediatric-dosing-weight-based-vs-bsa-calculations'
LIMIT 1;

-- Insert comments for "Medication Adherence"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'We''ve had great success with Medisafe app. Patients love the reminders and pill identification features. For elderly patients, we use automated pill dispensers - they''ve reduced hospitalizations.',
  'Dr. Thomas White',
  true,
  20,
  NOW() - INTERVAL '3 days'
FROM public.threads t
WHERE t.slug = 'medication-adherence-technology-patient-engagement'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Text message reminders have shown 20% improvement in adherence in our clinic. Simple but effective. We also do monthly medication reviews to identify barriers.',
  'Dr. Sarah Chen',
  true,
  10,
  NOW() - INTERVAL '2 days'
FROM public.threads t
WHERE t.slug = 'medication-adherence-technology-patient-engagement'
LIMIT 1;

-- Insert comments for "Compounding Pharmacy"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'USP <797> and <800> are essential. We do environmental monitoring weekly, and all compounding staff are certified. Beyond-use dating follows USP guidelines - typically 14 days for non-sterile, shorter for sterile.',
  'Dr. Emily Watson',
  true,
  17,
  NOW() - INTERVAL '14 days'
FROM public.threads t
WHERE t.slug = 'compounding-pharmacy-regulatory-updates-best-practices'
LIMIT 1;

-- Insert comments for "Drug Shortages"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'ASHP Drug Shortages database is my go-to. We maintain a shortage response team that meets weekly. For critical meds, we''ve established relationships with multiple wholesalers.',
  'Dr. James Park',
  true,
  19,
  NOW() - INTERVAL '6 days'
FROM public.threads t
WHERE t.slug = 'drug-shortages-mitigation-strategies-alternatives'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Communication is key. We send daily updates to prescribers about shortages and alternatives. Having a clinical decision support system helps identify therapeutic equivalents quickly.',
  'Dr. Robert Kim',
  true,
  8,
  NOW() - INTERVAL '5 days'
FROM public.threads t
WHERE t.slug = 'drug-shortages-mitigation-strategies-alternatives'
LIMIT 1;

-- Insert comments for "Clinical Trials"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Patient engagement apps have been crucial. We use reminders for visits, medication logs, and symptom tracking. Regular check-ins via phone or video help maintain connection.',
  'Dr. Jennifer Lee',
  true,
  12,
  NOW() - INTERVAL '19 days'
FROM public.threads t
WHERE t.slug = 'clinical-trials-patient-recruitment-retention'
LIMIT 1;

-- Insert comments for "Medication Errors"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'We use the Swiss Cheese Model for analysis. Every error is a learning opportunity. Our reporting system is completely anonymous - this increased reporting by 300%.',
  'Dr. Michael Rodriguez',
  true,
  22,
  NOW() - INTERVAL '8 days'
FROM public.threads t
WHERE t.slug = 'medication-errors-root-cause-analysis-prevention'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Barcode scanning at every step - prescribing, dispensing, administration. It''s reduced errors by 80% in our facility. Technology is expensive but worth it for patient safety.',
  'Dr. Amanda Foster',
  true,
  15,
  NOW() - INTERVAL '7 days'
FROM public.threads t
WHERE t.slug = 'medication-errors-root-cause-analysis-prevention'
LIMIT 1;

-- Insert comments for "Geriatric Pharmacy"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Beers Criteria and STOPP/START criteria are essential tools. We prioritize deprescribing medications with high anticholinergic burden first. Always involve the patient and family in decisions.',
  'Dr. Lisa Thompson',
  true,
  21,
  NOW() - INTERVAL '10 days'
FROM public.threads t
WHERE t.slug = 'geriatric-pharmacy-polypharmacy-deprescribing'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Start with one medication at a time. Monitor closely for withdrawal symptoms. We''ve successfully deprescribed PPIs, benzodiazepines, and unnecessary vitamins in many patients.',
  'Dr. David Martinez',
  true,
  9,
  NOW() - INTERVAL '9 days'
FROM public.threads t
WHERE t.slug = 'geriatric-pharmacy-polypharmacy-deprescribing'
LIMIT 1;

-- Insert comments for "Oncology Pharmacy - CAR-T"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'CRS management is critical. We have tocilizumab on standby for all CAR-T patients. Monitoring includes daily labs, vital signs q4h, and neuro checks. ICU backup is essential.',
  'Dr. Nicole Anderson',
  true,
  24,
  NOW() - INTERVAL '1 day'
FROM public.threads t
WHERE t.slug = 'oncology-pharmacy-car-t-cell-therapy-management'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'We coordinate with oncology, ICU, and infectious disease teams. Pre-treatment workup includes infection screening and organ function assessment. Post-infusion monitoring is intensive but necessary.',
  'Dr. Christopher Brown',
  true,
  11,
  NOW() - INTERVAL '1 day'
FROM public.threads t
WHERE t.slug = 'oncology-pharmacy-car-t-cell-therapy-management'
LIMIT 1;

-- Insert comments for "Telepharmacy"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'We use HIPAA-compliant video platforms. Patient education via screen sharing has been effective. For medication reviews, we use secure document sharing. Privacy is non-negotiable.',
  'Dr. Rachel Green',
  true,
  13,
  NOW() - INTERVAL '13 days'
FROM public.threads t
WHERE t.slug = 'telepharmacy-remote-patient-monitoring-consultations'
LIMIT 1;

-- Insert comments for "Vaccine Storage"
INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Continuous temperature monitoring with data loggers is mandatory. We use VFC-compliant units with backup power. Temperature excursions require immediate action - consult manufacturer guidelines.',
  'Dr. Mark Wilson',
  true,
  10,
  NOW() - INTERVAL '17 days'
FROM public.threads t
WHERE t.slug = 'vaccine-storage-handling-cold-chain-management'
LIMIT 1;

INSERT INTO public.comments (
  thread_id,
  content,
  author_name,
  is_approved,
  like_count,
  created_at
)
SELECT 
  t.id,
  'Daily temperature logs are required. We have alarms set for out-of-range temps. If there''s an excursion, document everything and contact the manufacturer immediately. Don''t use vaccines from compromised storage.',
  'Dr. Patricia Davis',
  true,
  7,
  NOW() - INTERVAL '16 days'
FROM public.threads t
WHERE t.slug = 'vaccine-storage-handling-cold-chain-management'
LIMIT 1;

-- Verify the insert
SELECT 
  c.id,
  c.thread_id,
  t.title as thread_title,
  c.author_name,
  c.like_count,
  c.is_approved,
  c.created_at
FROM public.comments c
JOIN public.threads t ON c.thread_id = t.id
WHERE c.is_approved = true
ORDER BY c.created_at DESC;

