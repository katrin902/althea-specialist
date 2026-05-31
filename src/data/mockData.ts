export type RiskLevel = 'green' | 'yellow' | 'red';
export type PatientCategory = 'current' | 'waiting' | 'request';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'intake_sent';
export type IntakeFormStatus = 'not_sent' | 'sent' | 'completed';

export interface CheckIn {
  date: string;
  mood: number;
  anxiety: number;
  stress: number;
  sleep: number;
  note: string;
  unsafeFlag: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  location: string;
  status: 'proposed' | 'confirmed' | 'cancelled';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export interface RiskAlert {
  id: string;
  date: string;
  triggerMessage: string;
  level: RiskLevel;
  acknowledged: boolean;
  summary: string;
}

export interface HandoverNote {
  id: string;
  date: string;
  fromSpecialist: string;
  toSpecialist: string;
  note: string;
  reason: string;
}

export interface AuditEntry {
  id: string;
  date: string;
  action: string;
  actor: string;
  details: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  city: string;
  status: string;
  riskLevel: RiskLevel;
  mainSymptoms: string[];
  insuranceType: string;
  language: string;
  referralStatus: string;
  selectedProvider: string;
  lastCheckIn: CheckIn;
  checkInHistory: CheckIn[];
  intakeSummary: string;
  upcomingAppointment: Appointment | null;
  documents: Document[];
  riskAlerts: RiskAlert[];
  privateNotes: string;
  assignedSpecialist: string;

  // Category & workflow
  category: PatientCategory;
  requestDate?: string;
  acceptedDate?: string;
  requestStatus?: RequestStatus;
  rejectionReason?: string;
  altheaRecommendationReason?: string;
  preferredTreatment?: string;
  patientMessage?: string;
  intakeFormStatus?: IntakeFormStatus;
  handoverNotes?: HandoverNote[];
  auditLog?: AuditEntry[];
}

export interface ProviderCapacity {
  acceptingNewPatients: boolean;
  pauseRecommendations: boolean;
  estimatedWaitingTime: string;
  maxNewRequests: number;
  availableAppointmentSlots: number;
  currentPatientCount: number;
  maxPatientCount: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
}

// ─── Patients ───────────────────────────────────────────────────────────────

export const mockPatients: Patient[] = [

  // ── CURRENT PATIENTS ──────────────────────────────────────────────────────
  {
    id: 'p003',
    name: 'Sophie Bakker',
    age: 25,
    city: 'Amsterdam',
    status: 'In active treatment',
    riskLevel: 'green',
    mainSymptoms: ['Burnout', 'Work stress', 'Mild anxiety'],
    insuranceType: 'VGZ',
    language: 'Dutch',
    referralStatus: 'Uploaded',
    selectedProvider: 'Amsterdam Mental Health Center',
    lastCheckIn: { date: '2025-06-10', mood: 6, anxiety: 5, stress: 6, sleep: 6, note: 'Better week, looking forward to next session', unsafeFlag: false },
    checkInHistory: [
      { date: '2025-06-08', mood: 5, anxiety: 6, stress: 7, sleep: 5, note: 'Tired', unsafeFlag: false },
      { date: '2025-06-09', mood: 6, anxiety: 5, stress: 6, sleep: 6, note: 'A bit better', unsafeFlag: false },
      { date: '2025-06-10', mood: 6, anxiety: 5, stress: 6, sleep: 6, note: 'Better week', unsafeFlag: false },
    ],
    intakeSummary: `**Intake Summary — Sophie Bakker**

**Main concern:** Work-related burnout and persistent stress.

**Duration:** 5 months.

**Severity:** 5/10 — moderate impact on work and personal life.

**Previous diagnosis:** None.

**Current treatment:** None.

**Medication:** None.

**Sleep:** Difficulty falling asleep due to work worries.

**Mood:** Stable but flat, reduced enjoyment.

**Safety:** No concerns reported.

**Preferred language:** Dutch.

**Therapy preferences:** CBT preferred, open to online sessions.`,
    upcomingAppointment: { id: 'apt003', date: 'Wednesday, 18 June 2025', time: '14:00', type: 'In-person', location: 'Herengracht 182, Amsterdam', status: 'confirmed' },
    documents: [
      { id: 'd3', name: 'GP_Referral_Bakker.pdf', type: 'GP referral', uploadedAt: '2025-06-01', size: '198 KB' },
    ],
    riskAlerts: [],
    privateNotes: 'Mild burnout presentation. CBT focus. Making good progress. Low risk.',
    assignedSpecialist: 'Dr. Mark Jansen',
    category: 'current',
    acceptedDate: '2025-05-14',
    intakeFormStatus: 'completed',
    handoverNotes: [],
    auditLog: [
      { id: 'a1', date: '2025-05-14 09:30', action: 'Patient accepted', actor: 'Dr. Mark Jansen', details: 'Patient request accepted. Moved to active caseload.' },
      { id: 'a2', date: '2025-05-20 11:00', action: 'Intake form completed', actor: 'Sophie Bakker (patient)', details: 'Institution-specific intake form completed by patient.' },
      { id: 'a3', date: '2025-06-01 14:22', action: 'Document viewed', actor: 'Dr. Mark Jansen', details: 'GP_Referral_Bakker.pdf downloaded.' },
    ],
  },

  // ── WAITING PATIENTS ──────────────────────────────────────────────────────
  {
    id: 'p001',
    name: 'Emma van der Berg',
    age: 22,
    city: 'Amsterdam',
    status: 'Accepted — waiting for appointment',
    riskLevel: 'yellow',
    mainSymptoms: ['Anxiety', 'Low mood', 'Sleep difficulties', 'Academic stress'],
    insuranceType: 'CZ',
    language: 'English',
    referralStatus: 'Uploaded',
    selectedProvider: 'Amsterdam Mental Health Center',
    lastCheckIn: { date: '2025-06-10', mood: 4, anxiety: 8, stress: 7, sleep: 3, note: 'Hard to sleep, exams coming up', unsafeFlag: false },
    checkInHistory: [
      { date: '2025-06-08', mood: 5, anxiety: 7, stress: 6, sleep: 4, note: 'Difficult week', unsafeFlag: false },
      { date: '2025-06-09', mood: 6, anxiety: 6, stress: 5, sleep: 5, note: 'Slightly better', unsafeFlag: false },
      { date: '2025-06-10', mood: 4, anxiety: 8, stress: 7, sleep: 3, note: 'Hard to sleep', unsafeFlag: false },
    ],
    intakeSummary: `**Intake Summary — Emma van der Berg**

**Main concern:** Anxiety and low mood affecting study and social life.

**Duration:** Approximately 3 months.

**Severity:** 7/10 — significantly impacting daily functioning.

**Previous diagnosis:** None reported.

**Current treatment:** None.

**Medication:** None.

**Sleep:** Difficulty falling asleep, waking early.

**Appetite:** Reduced appetite, some weight loss.

**Anxiety symptoms:** Frequent worry, occasional panic feelings.

**Mood:** Persistent low mood, reduced motivation.

**Stress/burnout:** High stress related to academic pressure.

**Safety:** No thoughts of self-harm reported at this time.

**Preferred language:** English.

**Therapy preferences:** Individual therapy, open to online sessions.`,
    upcomingAppointment: { id: 'apt001', date: 'Monday, 16 June 2025', time: '10:30', type: 'In-person', location: 'Herengracht 182, Amsterdam', status: 'proposed' },
    documents: [
      { id: 'd1', name: 'GP_Referral_Letter.pdf', type: 'GP referral', uploadedAt: '2025-06-05', size: '234 KB' },
    ],
    riskAlerts: [],
    privateNotes: '',
    assignedSpecialist: 'Dr. Lisa van Berg',
    category: 'waiting',
    requestDate: '2025-05-26',
    acceptedDate: '2025-05-28',
    requestStatus: 'accepted',
    altheaRecommendationReason: 'Patient symptoms align with anxiety/mood specialization. English-speaking, close proximity.',
    preferredTreatment: 'Individual CBT, open to online',
    patientMessage: 'I was referred by my GP and chose this clinic because it came highly recommended for student mental health.',
    intakeFormStatus: 'completed',
    handoverNotes: [],
    auditLog: [
      { id: 'a1', date: '2025-05-28 10:05', action: 'Patient accepted', actor: 'Dr. Lisa van Berg', details: 'Request reviewed and accepted. Intake form sent.' },
      { id: 'a2', date: '2025-06-01 16:30', action: 'Document viewed', actor: 'Dr. Lisa van Berg', details: 'GP_Referral_Letter.pdf downloaded.' },
      { id: 'a3', date: '2025-06-05 09:14', action: 'Appointment proposed', actor: 'Dr. Lisa van Berg', details: 'First appointment proposed for June 16.' },
    ],
  },

  {
    id: 'p002',
    name: 'Thomas de Groot',
    age: 19,
    city: 'Amsterdam',
    status: 'Accepted — waiting for appointment',
    riskLevel: 'red',
    mainSymptoms: ['Depression', 'Social withdrawal', 'Self-harm thoughts', 'Insomnia'],
    insuranceType: 'Menzis',
    language: 'Dutch',
    referralStatus: 'Uploaded',
    selectedProvider: 'Amsterdam Mental Health Center',
    lastCheckIn: { date: '2025-06-10', mood: 2, anxiety: 9, stress: 8, sleep: 2, note: "Can't see the point", unsafeFlag: true },
    checkInHistory: [
      { date: '2025-06-08', mood: 3, anxiety: 8, stress: 7, sleep: 3, note: 'Staying home', unsafeFlag: false },
      { date: '2025-06-09', mood: 2, anxiety: 9, stress: 8, sleep: 2, note: 'Feeling alone', unsafeFlag: false },
      { date: '2025-06-10', mood: 2, anxiety: 9, stress: 8, sleep: 2, note: "Can't see the point", unsafeFlag: true },
    ],
    intakeSummary: `**Intake Summary — Thomas de Groot**

**Main concern:** Severe depression and social withdrawal over the past 6 months.

**Duration:** 6 months, worsening over past 3 weeks.

**Severity:** 9/10 — severely impacting all areas of functioning.

**Previous diagnosis:** None reported.

**Current treatment:** None.

**Medication:** None.

**Sleep:** Severe insomnia, sleeping fewer than 4 hours per night.

**Appetite:** Significantly reduced.

**Mood:** Severely depressed, hopelessness reported.

**Safety:** Mentioned passive thoughts of self-harm. No active plan reported during intake.

**Preferred language:** Dutch.

**Therapy preferences:** Individual, in-person preferred.`,
    upcomingAppointment: null,
    documents: [
      { id: 'd2', name: 'GP_Referral.pdf', type: 'GP referral', uploadedAt: '2025-06-03', size: '180 KB' },
    ],
    riskAlerts: [
      { id: 'ra1', date: '2025-06-10 22:14', triggerMessage: "I don't see the point anymore and sometimes I think about hurting myself", level: 'red', acknowledged: false, summary: 'Patient expressed passive suicidal ideation and self-harm thoughts via check-in and chat.' },
    ],
    privateNotes: 'Needs urgent appointment. Consider same-week intake. Flagged for priority review.',
    assignedSpecialist: 'Dr. Lisa van Berg',
    category: 'waiting',
    requestDate: '2025-06-02',
    acceptedDate: '2025-06-05',
    requestStatus: 'accepted',
    altheaRecommendationReason: 'High-risk patient with urgent symptoms. Needs immediate attention. Red risk flag triggered during intake.',
    preferredTreatment: 'Individual therapy, in-person',
    patientMessage: 'I have been struggling for a long time and my GP said I need help urgently. I chose this clinic because it was the closest option available.',
    intakeFormStatus: 'completed',
    handoverNotes: [],
    auditLog: [
      { id: 'a1', date: '2025-06-05 08:30', action: 'Patient accepted (priority)', actor: 'Dr. Lisa van Berg', details: 'Accepted as priority patient due to high risk level.' },
      { id: 'a2', date: '2025-06-05 08:35', action: 'Risk alert viewed', actor: 'Dr. Lisa van Berg', details: 'Risk alert ra1 reviewed and escalated.' },
      { id: 'a3', date: '2025-06-10 22:20', action: 'Risk alert triggered', actor: 'Althea system', details: 'Passive self-harm ideation detected in chat. Alert sent to specialist.' },
    ],
  },

  // ── PATIENT REQUESTS ──────────────────────────────────────────────────────
  {
    id: 'p004',
    name: 'Lena de Vries',
    age: 20,
    city: 'Amsterdam',
    status: 'Request pending',
    riskLevel: 'yellow',
    mainSymptoms: ['Panic attacks', 'Anxiety', 'Avoidance behavior'],
    insuranceType: 'CZ',
    language: 'Dutch',
    referralStatus: 'Uploaded',
    selectedProvider: 'Amsterdam Mental Health Center',
    lastCheckIn: { date: '2025-06-11', mood: 5, anxiety: 7, stress: 6, sleep: 5, note: 'Had a panic attack on the way to class', unsafeFlag: false },
    checkInHistory: [
      { date: '2025-06-10', mood: 5, anxiety: 8, stress: 7, sleep: 4, note: 'Avoiding the metro', unsafeFlag: false },
      { date: '2025-06-11', mood: 5, anxiety: 7, stress: 6, sleep: 5, note: 'Had a panic attack on the way to class', unsafeFlag: false },
    ],
    intakeSummary: `**Intake Summary — Lena de Vries**

**Main concern:** Recurring panic attacks and increasing avoidance behavior affecting university attendance.

**Duration:** Approximately 1 month, escalating.

**Severity:** 6/10 — significantly impacting daily activities and studies.

**Previous diagnosis:** None.

**Current treatment:** None.

**Medication:** None.

**Sleep:** Moderate difficulty, anxiety-related.

**Mood:** Generally stable between panic episodes.

**Safety:** No safety concerns.

**Preferred language:** Dutch.

**Therapy preferences:** CBT, open to online sessions, prefers afternoons.`,
    upcomingAppointment: null,
    documents: [
      { id: 'd4', name: 'GP_Referral_DeVries.pdf', type: 'GP referral', uploadedAt: '2025-06-10', size: '210 KB' },
    ],
    riskAlerts: [],
    privateNotes: '',
    assignedSpecialist: '',
    category: 'request',
    requestDate: '2025-06-11',
    requestStatus: 'pending',
    altheaRecommendationReason: 'Patient location near clinic. Symptoms align with CBT specialization. Accepting new patients with anxiety disorders.',
    preferredTreatment: 'CBT, open to online, afternoons preferred',
    patientMessage: 'I was referred to you by my GP. I have been struggling with panic attacks for the past month and they are getting worse. I chose your clinic because it is close to my university and you have good reviews online.',
    intakeFormStatus: 'not_sent',
    handoverNotes: [],
    auditLog: [
      { id: 'a1', date: '2025-06-11 10:30', action: 'Request submitted', actor: 'Lena de Vries (patient)', details: 'Patient selected provider and submitted request with GP referral.' },
    ],
  },

  {
    id: 'p005',
    name: 'Martijn Visser',
    age: 24,
    city: 'Amsterdam',
    status: 'Request pending',
    riskLevel: 'yellow',
    mainSymptoms: ['Burnout', 'Depression', 'Low motivation', 'Fatigue'],
    insuranceType: 'VGZ',
    language: 'Dutch',
    referralStatus: 'Uploaded',
    selectedProvider: 'Amsterdam Mental Health Center',
    lastCheckIn: { date: '2025-06-09', mood: 3, anxiety: 6, stress: 8, sleep: 4, note: 'Too exhausted to do anything after work', unsafeFlag: false },
    checkInHistory: [
      { date: '2025-06-08', mood: 3, anxiety: 6, stress: 9, sleep: 4, note: 'Can barely get up', unsafeFlag: false },
      { date: '2025-06-09', mood: 3, anxiety: 6, stress: 8, sleep: 4, note: 'Too exhausted', unsafeFlag: false },
    ],
    intakeSummary: `**Intake Summary — Martijn Visser**

**Main concern:** Work-related burnout combined with depressive symptoms, affecting work performance and personal relationships.

**Duration:** 4 months, gradually worsening.

**Severity:** 6/10 — significant impact on daily functioning.

**Previous diagnosis:** None.

**Current treatment:** None.

**Medication:** None.

**Sleep:** Poor quality, waking up unrefreshed.

**Mood:** Persistently low, loss of interest in previously enjoyed activities.

**Energy:** Severely depleted.

**Safety:** No concerns.

**Preferred language:** Dutch.

**Therapy preferences:** Individual therapy, evenings preferred.`,
    upcomingAppointment: null,
    documents: [
      { id: 'd5', name: 'GP_Referral_Visser.pdf', type: 'GP referral', uploadedAt: '2025-06-08', size: '195 KB' },
    ],
    riskAlerts: [],
    privateNotes: '',
    assignedSpecialist: '',
    category: 'request',
    requestDate: '2025-06-09',
    requestStatus: 'pending',
    altheaRecommendationReason: 'Clinic has capacity for burnout/depression patients. Availability for evening appointments aligns with patient preference.',
    preferredTreatment: 'Individual therapy, evenings preferred',
    patientMessage: 'My GP suggested I seek therapy. I work full-time and study part-time and I have been feeling completely burned out for months. I find it hard to do anything after work.',
    intakeFormStatus: 'sent',
    handoverNotes: [],
    auditLog: [
      { id: 'a1', date: '2025-06-09 14:15', action: 'Request submitted', actor: 'Martijn Visser (patient)', details: 'Patient submitted request. GP referral uploaded.' },
    ],
  },

  {
    id: 'p006',
    name: 'Aisha Hasan',
    age: 21,
    city: 'Amsterdam',
    status: 'Request pending — urgent',
    riskLevel: 'red',
    mainSymptoms: ['PTSD', 'Trauma', 'Recurring nightmares', 'Panic attacks', 'Hypervigilance'],
    insuranceType: 'Menzis',
    language: 'Arabic / English',
    referralStatus: 'Uploaded',
    selectedProvider: 'Amsterdam Mental Health Center',
    lastCheckIn: { date: '2025-06-10', mood: 3, anxiety: 9, stress: 8, sleep: 2, note: 'Nightmares again last night, barely slept', unsafeFlag: false },
    checkInHistory: [
      { date: '2025-06-09', mood: 3, anxiety: 8, stress: 8, sleep: 3, note: 'Very anxious today', unsafeFlag: false },
      { date: '2025-06-10', mood: 3, anxiety: 9, stress: 8, sleep: 2, note: 'Nightmares again', unsafeFlag: false },
    ],
    intakeSummary: `**Intake Summary — Aisha Hasan**

**Main concern:** PTSD symptoms following a traumatic event. Recurring nightmares, hypervigilance, avoidance.

**Duration:** Approximately 3 months.

**Severity:** 8/10 — significantly impacting sleep, daily functioning, and social life.

**Previous diagnosis:** None formally. GP suspects PTSD.

**Current treatment:** None.

**Medication:** None.

**Sleep:** Severely disrupted by nightmares, averaging 2–3 hours.

**Mood:** Anxious, hypervigilant, periodic dissociation reported.

**Safety:** No active self-harm thoughts. Passive thoughts of not wanting to be here reported during intake.

**Preferred language:** Arabic and English.

**Therapy preferences:** Trauma-focused CBT or EMDR preferred, in-person.`,
    upcomingAppointment: null,
    documents: [
      { id: 'd6', name: 'GP_Referral_Hasan.pdf', type: 'GP referral', uploadedAt: '2025-06-09', size: '220 KB' },
      { id: 'd7', name: 'Intake_form_Hasan.pdf', type: 'Institution intake', uploadedAt: '2025-06-10', size: '310 KB' },
    ],
    riskAlerts: [],
    privateNotes: '',
    assignedSpecialist: '',
    category: 'request',
    requestDate: '2025-06-10',
    requestStatus: 'pending',
    altheaRecommendationReason: 'Clinic offers trauma-focused CBT and EMDR. Bilingual support available. Patient risk level is red — urgent triage recommended.',
    preferredTreatment: 'Trauma-focused CBT or EMDR, in-person',
    patientMessage: 'I have been having recurring nightmares and panic attacks. My GP said it is urgent. I chose this clinic specifically because you offer trauma-focused care and EMDR.',
    intakeFormStatus: 'completed',
    handoverNotes: [],
    auditLog: [
      { id: 'a1', date: '2025-06-10 11:00', action: 'Request submitted', actor: 'Aisha Hasan (patient)', details: 'Request submitted with GP referral and completed institution intake form.' },
    ],
  },
];

// ─── Provider capacity ───────────────────────────────────────────────────────

export const mockProviderCapacity: ProviderCapacity = {
  acceptingNewPatients: true,
  pauseRecommendations: false,
  estimatedWaitingTime: '2–3 weeks',
  maxNewRequests: 5,
  availableAppointmentSlots: 6,
  currentPatientCount: 1,
  maxPatientCount: 20,
};

// ─── Message templates ───────────────────────────────────────────────────────

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: 'mt1',
    name: 'Accept patient',
    category: 'Intake',
    subject: 'Your request has been accepted — Amsterdam Mental Health Center',
    body: `Dear [Patient name],

I am pleased to let you know that we have reviewed your request and are happy to accept you as a patient at Amsterdam Mental Health Center.

We will be in touch shortly to schedule your first appointment.

If you have any questions in the meantime, please do not hesitate to reach out.

Kind regards,
[Specialist name]
Amsterdam Mental Health Center`,
  },
  {
    id: 'mt2',
    name: 'Reject patient (polite)',
    category: 'Intake',
    subject: 'Update on your request — Amsterdam Mental Health Center',
    body: `Dear [Patient name],

Thank you for reaching out to Amsterdam Mental Health Center.

After careful review, we are unfortunately unable to accept your request at this time. This may be due to current capacity limitations or a mismatch with our current specializations.

We strongly encourage you to reach out to your GP to discuss alternative options. You can also use Althea to find other suitable providers in your area.

We wish you all the best on your path to wellbeing.

Kind regards,
[Specialist name]
Amsterdam Mental Health Center`,
  },
  {
    id: 'mt3',
    name: 'Request missing document',
    category: 'Documents',
    subject: 'Action needed: missing document',
    body: `Dear [Patient name],

To continue processing your request, we need the following document from you:

[Document description]

Please upload this document through the Althea app at your earliest convenience. Your request will remain on hold until we receive it.

Thank you for your cooperation.

Kind regards,
[Specialist name]`,
  },
  {
    id: 'mt4',
    name: 'Ask to complete intake form',
    category: 'Intake',
    subject: 'Please complete your intake form',
    body: `Dear [Patient name],

As part of the intake process at Amsterdam Mental Health Center, we ask you to complete a short intake form. This helps us prepare for your first appointment.

You can find and complete the form in the Althea app under "Documents".

Please complete it before your appointment. If you have questions about the form, feel free to reach out.

Kind regards,
[Specialist name]`,
  },
  {
    id: 'mt5',
    name: 'Appointment proposal',
    category: 'Appointments',
    subject: 'Appointment proposal',
    body: `Dear [Patient name],

I would like to propose the following appointment for your first session:

Date: [Date]
Time: [Time]
Location: [Location]
Type: [In-person / Online]

Please confirm or let me know if you need to reschedule via the Althea app.

I look forward to meeting you.

Kind regards,
[Specialist name]`,
  },
  {
    id: 'mt6',
    name: 'Reschedule message',
    category: 'Appointments',
    subject: 'Appointment rescheduling',
    body: `Dear [Patient name],

Unfortunately, we need to reschedule your appointment on [original date].

I would like to propose the following new time:

Date: [New date]
Time: [New time]
Location: [Location]

Please confirm this new time or suggest an alternative via the Althea app.

I apologise for any inconvenience.

Kind regards,
[Specialist name]`,
  },
  {
    id: 'mt7',
    name: 'Crisis follow-up',
    category: 'Safety',
    subject: 'Checking in — we are here to support you',
    body: `Dear [Patient name],

I wanted to reach out to check how you are doing after your recent check-in.

Please remember that if you are in immediate danger, you should call 112. For mental health crisis support, you can call 113 (free, 24/7).

I will be in touch shortly to arrange an urgent appointment. You are not alone in this.

Kind regards,
[Specialist name]`,
  },
];

// ─── Specialist ──────────────────────────────────────────────────────────────

export const mockSpecialist = {
  id: 's001',
  name: 'Dr. Lisa van Berg',
  role: 'Psychologist',
  institution: 'Amsterdam Mental Health Center',
  email: 'l.vanberg@amhc.nl',
};
