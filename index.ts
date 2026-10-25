export type StudentGender = 'M' | 'F';

export type AttendanceStatus =
  | 'present_kit'
  | 'present_no_kit'
  | 'exempt'
  | 'absent'
  | 'absent_justified'
  | 'late'
  | 'sick_during_session';

export interface AttendanceDetail {
  status: AttendanceStatus;
  note?: string;
}

export interface Student {
  id: string;
  classId: string;
  firstName: string;
  lastName: string;
  gender: StudentGender;
  birthDate?: string;
  birthPlace?: string;
  guardianName?: string;
  bloodType?: string;
  studentNumber?: string;
  isMedicallyExempt?: boolean;
  medicalNotes?: string;
  notes?: string;
  medicalExemption?: {
    isExempt: boolean;
    reason?: string;
    startDate?: string;
    endDate?: string;
    certificateNumber?: string;
    doctorName?: string;
    exemptionType?: string;
  };
  chronicConditions?: string;
  heightCm?: number; // for BMI calculation
  weightKg?: number; // for BMI calculation
  phoneParent?: string;
}

export interface ClassGroup {
  id: string;
  name: string; // e.g. 1 متوسط 1 / 4 متوسط BEM / 1 ثانوي
  gradeLevel: string; // e.g. السنة الأولى متوسط
  cycle?: 'المتوسط' | 'الثانوي' | 'متوسط' | 'ثانوي';
  academicYear: string; // e.g. 2025 - 2026
  sessionDays?: string[]; // e.g. ['الأحد 08:00 - 10:00']
  schedule?: Array<{
    day: string;
    startTime: string;
    endTime: string;
    location?: string;
  }>;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  timeSlot?: string;
  topic?: string;
  records: {
    [studentId: string]: any;
  };
}

export interface FitnessTestItem {
  id: string;
  name: string;
  activityType: 'athletics' | 'gymnastics' | 'collective_sport' | 'fitness';
  unit: string;
  description: string;
  maxScore: number;
}

export interface StudentEvaluationRecord {
  testScores: {
    [testId: string]: {
      rawValue?: number;
      calculatedGrade: number;
    };
  };
  attendanceConductGrade?: number;
  diagnosticScore?: number;
  finalAverage?: number;
}

export interface EvaluationSession {
  id: string;
  classId: string;
  term: 'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث';
  date: string;
  title: string;
  testItems: FitnessTestItem[];
  grades: {
    [studentId: string]: StudentEvaluationRecord;
  };
}

export interface PedagogicalPhase {
  name: string; // المرحلة التحضيرية / التعلمية / الختامية
  durationMinutes: number;
  situations: string; // المواقف التعليمية وورشات العمل
  pedagogicalDirectives: string; // التوجيهات البيداغوجية ومعايير ومؤشرات النجاح
  equipment: string; // الأدوات المستعملة
}

export interface LessonPlan {
  id: string;
  learningUnitId?: string; // linkage to UA
  title: string;
  level: string; // المستوى التعليمي (مثال: 4 متوسط)
  cycle?: 'المتوسط' | 'الثانوي' | string;
  classId?: string;
  sportType: string; // كرة يد، كرة سلة، جمباز، ألعاب قوى
  domainType?: string;
  unit: string; // الوحدة التعلمية
  sessionNumber: number; // رقم الحصة (1 إلى 10)
  sessionType: 'تشخيصية' | 'تعلمية' | 'إدماجية' | 'تقويمية';
  baseCompetence?: string; // الكفاءة القاعدية (وفق التدرجات السنوية الرسمية)
  terminalCompetence: string; // الكفاءة الختامية
  proceduralGoal: string; // الهدف الإجرائي للحصة
  dateCreated: string;
  phases: PedagogicalPhase[];
}

/**
 * الوحدة التعلمية (Unité d'Apprentissage - UA)
 */
export interface LearningUnitSessionSummary {
  sessionNum: number;
  title: string;
  goal: string;
  type: 'تشخيصية' | 'تعلمية' | 'إدماجية' | 'تقويمية';
}

export interface LearningUnit {
  id: string;
  title: string;
  gradeLevel: string; // e.g. السنة الرابعة متوسط
  cycle?: 'المتوسط' | 'الثانوي' | string;
  individualActivity: string; // e.g. ألعاب القوى: الجري السريع 60م والوثب
  collectiveActivity: string; // e.g. كرة اليد: الهجوم المنظم
  term: 'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث';
  totalSessions: number; // 8 - 12 حصة
  generalCompetence: string; // الكفاءة الشاملة
  terminalCompetenceIndividual: string; // الكفاءة الختامية للنشاط الفردي
  terminalCompetenceCollective: string; // الكفاءة الختامية للنشاط الجماعي
  performanceCriteria: string[]; // معايير ومؤشرات الكفاءة
  sessions: LearningUnitSessionSummary[];
}

/**
 * التوزيع السنوي والبرمجة السنوية (Programmation & Répartition Annuelle)
 */
export interface AnnualWeekPlan {
  weekNumber: number; // 1 to 36
  term: 'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث';
  month: string; // أكتوبر، نوفمبر، إلخ
  pedagogicalPeriod: string; // e.g. الفترة البيداغوجية الأولى
  individualActivityTitle: string; // محتوى النشاط الفردي
  collectiveActivityTitle: string; // محتوى النشاط الجماعي
  natureOfWork: 'دخول وملاحظة وتوجيه' | 'تقويم تشخيصي' | 'تعلم وبناء' | 'إدماج وتقويم تحصيلي' | 'عطلة فصلية' | 'امتحانات واختبارات';
  notes?: string;
}

export interface AnnualProgram {
  id: string;
  gradeLevel: string; // e.g. السنة الرابعة متوسط
  cycle?: 'المتوسط' | 'الثانوي' | string;
  academicYear: string; // 2025 - 2026
  individualSport: string; // e.g. ألعاب القوى (السرعة + الوثب)
  collectiveSport: string; // e.g. كرة اليد (الهجوم المنظم)
  gymnasticsSport?: string; // e.g. الجمباز الرياضي
  schedule: AnnualWeekPlan[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'holiday' | 'exam' | 'bac_sport' | 'administrative';
  startDate: string;
  endDate: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  classId: string;
  className: string;
  date?: string;
  dayOfWeek?: string;
  timeSlot: string;
  sportType: string;
  sessionTopic: string;
  learningGoal: string;
  presentCount: number;
  absentCount: number;
  exemptCount: number;
  observations: string;
  materialsUsed: string;
}

export interface DiagnosticCriteria {
  id: string;
  activityType: 'فردي' | 'جماعي';
  sportName: string;
  criterionName: string;
  descriptorGood: string;
  descriptorAverage: string;
  descriptorWeak: string;
}

export interface CompetencyDefinition {
  id: string;
  gradeLevel: string;
  domain: string;
  competencyType: string;
  title: string;
  description: string;
  indicators: string[];
}

export interface SportsEquipment {
  id: string;
  name: string;
  category: 'balls' | 'cones' | 'gymnastics' | 'athletics' | 'measuring' | 'other';
  quantity: number;
  goodCondition: number;
  needsRepair: number;
  storageLocation: string;
  notes?: string;
}

export interface TacticalElement {
  id: string;
  type: 'player_team_a' | 'player_team_b' | 'ball' | 'cone';
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  label?: string;
}

export interface LogbookEntry {
  id: string;
  classId: string;
  date: string;
  weekNumber: number;
  sessionNumber: number;
  sportType: string;
  objectiveTaught: string;
  observations: string;
  status: 'منجزة' | 'مؤجلة' | 'مستدركة';
}

export interface AccidentReport {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  accidentDate: string;
  accidentTime: string;
  location: string; // ملعب كرة اليد / مضمار الجري / قاعة الجمباز
  activityInvolved: string; // النشاط الرياضي الممارس
  injuryNature: string; // طبيعة الإصابة
  accidentCircumstances: string; // ظروف ووقائع الحادث بالتفصيل
  firstAidGiven: string; // الإسعافات الأولية المقدمة
  evacuationAction: string; // الإجراء المتخذ (اتصال بالحماية المدنية / نقل للعيادة / إبلاغ الولي)
  witnesses: string; // الشهود (تلاميذ أو أساتذة)
  status: 'مسجل ومبلغ' | 'تحت المتابعة' | 'مغلق بعد الشفاء';
}

export interface PedagogicalMeeting {
  id: string;
  type: 'ندوة تربوية' | 'مجلس قسم' | 'اجتماع تنسيقي للمادة' | 'جلسة عمل مع المفتش';
  title: string;
  date: string;
  location: string;
  supervisorOrLeader: string; // مؤطر الجلسة (المفتش / المدير / المنسق)
  participants: string; // الحاضرون
  agendaTopics: string; // جدول الأعمال
  recommendations: string; // القرارات والتوصيات المنبثقة
  reportContent: string; // محضر الجلسة المفصل (PV)
}

export interface InspectorVisit {
  id: string;
  date: string;
  visitorRole: 'مفتش التربية الوطنية' | 'مدير المؤسسة' | 'أستاذ مكون / مرافق';
  visitorName: string;
  classVisited: string;
  activityObserved: string;
  pedagogicalSubject: string;
  observationsAndDirectives: string;
  pedagogicalGrade?: string;
}

export interface ASSMInfo {
  presidentName: string;
  vicePresident: string;
  secretaryGeneral: string;
  treasurer: string;
  affiliationsCount: number;
  plannedTournaments: string;
  budgetNotes: string;
}

export interface TeacherProfileDetails {
  birthDate?: string;
  birthPlace?: string;
  financialNumber?: string;
  socialSecurityNumber?: string;
  phoneNumber?: string;
  email?: string;
  wilaya?: string;
  inspectionDistrict?: string;
}

