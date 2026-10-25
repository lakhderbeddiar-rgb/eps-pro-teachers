import {
  ClassGroup,
  Student,
  AttendanceRecord,
  LessonPlan,
  SportsEquipment,
  EvaluationSession,
  FitnessTestItem,
  AnnualProgram,
  LearningUnit,
  LogbookEntry,
  AccidentReport,
  PedagogicalMeeting,
  InspectorVisit,
  ASSMInfo,
  TeacherProfileDetails,
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_LESSON_PLANS,
  INITIAL_EQUIPMENT,
  INITIAL_EVALUATIONS,
  STANDARD_FITNESS_TESTS,
  INITIAL_ANNUAL_PROGRAM,
  INITIAL_LEARNING_UNITS,
} from './mockData';

const STORAGE_KEY = 'eps_teacher_data_v3';

export interface AppData {
  teacherName: string;
  teacherRank: string;
  teacherDegree: string;
  appointmentDate: string;
  tenureDate: string;
  weeklyHours: number;
  schoolName: string;
  inspectorName?: string;
  academicYear: string;
  classes: ClassGroup[];
  students: Student[];
  attendance: AttendanceRecord[];
  evaluations: EvaluationSession[];
  lessonPlans: LessonPlan[];
  annualPrograms: AnnualProgram[];
  learningUnits: LearningUnit[];
  equipment: SportsEquipment[];
  customTests: FitnessTestItem[];
  logbookEntries: LogbookEntry[];
  accidentReports: AccidentReport[];
  pedagogicalMeetings: PedagogicalMeeting[];
  inspectorVisits?: InspectorVisit[];
  assmInfo?: ASSMInfo;
  profileDetails?: TeacherProfileDetails;
}

export const INITIAL_ACCIDENT_REPORTS: AccidentReport[] = [
  {
    id: 'acc-1',
    studentId: 's-5',
    studentName: 'إسلام براهيمي',
    classId: 'class-1',
    className: '1 متوسط (الفوج 1)',
    accidentDate: '2026-10-07',
    accidentTime: '09:25',
    location: 'ملعب كرة اليد الخارجي (المنطقة 6م)',
    activityInvolved: 'مباراة تطبيقية موجهة في كرة اليد (موقف هجومي سريع)',
    injuryNature: 'التواء حاد في الكاحل الأيمن (Entorse de la cheville droite) مع انتفاخ خفيف',
    accidentCircumstances: 'أثناء هجوم سريع وارتقاء التلميذ للتصويب نحو المرمى، سقط والتوى كاحله الأيمن نتيجة ارتكاز غير متزن على حافة الأرضية.',
    firstAidGiven: 'إيقاف النشاط فوراً، وضع كمادات ثلج مهدئة لتخفيف الورم، تثبيت الكاحل برباط ضاغط، ورفع الساق للأعلى.',
    evacuationAction: 'تم نقل التلميذ إلى قاعة التمريض المدرسية وإبلاغ ولي أمره هاتفياً، ونقله لاحقاً للعيادة المجاورة للتأكد من عدم وجود كسر.',
    witnesses: 'التلميذ أيمن بوضياف + الأستاذ لخضر بديار',
    status: 'تحت المتابعة',
  },
];

export const INITIAL_PEDAGOGICAL_MEETINGS: PedagogicalMeeting[] = [
  {
    id: 'meet-1',
    type: 'ندوة تربوية',
    title: 'الندوة التربوية التكوينية لمقاطعة التعليم المتوسط: استراتيجيات التقويم البيداغوجي وفق المقاربة بالكفاءات',
    date: '2026-09-28',
    location: 'متوسطة الأمير عبد القادر (المقر الولائي)',
    supervisorOrLeader: 'مفتش التربية الوطنية لمادة التربية البدنية والرياضية',
    participants: 'أساتذة مادة التربية البدنية والرياضية للمقاطعة التربوية الثالثة',
    agendaTopics: '1. قراءة تحليلية للتدرجات السنوية المحينة.\n2. بناء شبكات التقويم المعياري وفق المعايير الوطنية.\n3. تسيير حصة التربية البدنية والرياضية وضمان السلامة الميدانية.',
    recommendations: 'التركيز على التقويم التكويني والتشخيصي، الاعتماد الصارم على كراس المتابعة، والالتزام برزنامة المذكرات البيداغوجية والوثيقة المرافقة.',
    reportContent: 'افتتح السيد المفتش الجلسة بالتأكيد على الدور المحوري لمادة التربية البدنية في التوازن النفسي والحركي للتلميذ. تم عرض نماذج تطبيقية لشبكات التقويم، وتم التوافق على توحيد سلالم التنقيط في امتحانات شهادة التعليم المتوسط.',
  },
  {
    id: 'meet-2',
    type: 'اجتماع تنسيقي للمادة',
    title: 'الاجتماع التنسيقي الأول لأساتذة المادة بالمؤسسة لضبط رزنامة الموسم الدراسي',
    date: '2026-09-22',
    location: 'قاعة الأساتذة - متوسطة الشهيد مفدي زكرياء',
    supervisorOrLeader: 'الأستاذ منسق المادة (لخضر بديار)',
    participants: 'أساتذة التربية البدنية والرياضية العاملون بالمؤسسة',
    agendaTopics: '1. توزيع الأفواج والمستويات والملاعب.\n2. جرد العتاد الرياضي المتوفر وتحديد النواقص لرفعها للإدارة.\n3. التحضير للجمعية العامة للرياضة المدرسية (ASSM).\n4. تنظيم رزنامة الفحوصات الطبية والإعفاءات.',
    recommendations: 'اعتماد التوزيع المتوازن للملاعب لتفادي الاكتظاظ، رفع تقرير مفصل للسيد المقتصد بشأن الكرات والأقماع المطلوبة، ومباشرة انتخاب مكتب الجمعية الرياضية المدرسية.',
    reportContent: 'تم الاتفاق بالإجماع على توزيع الملاعب بين أساتذة المستويات المختلفة، وضبط جدول الحصص الأسبوعي، والبدء في استلام الشهادات الطبية للتلاميذ من مصلحة الصحة المدرسية.',
  },
  {
    id: 'meet-3',
    type: 'مجلس قسم',
    title: 'مجلس قسم نهاية الفصل الأول: دراسة النتائج والسلوك العام للفوج',
    date: '2026-12-15',
    location: 'قاعة الاجتماعات بالمؤسسة',
    supervisorOrLeader: 'مدير المؤسسة + مستشار التربية',
    participants: 'أساتذة الفوج التربوي 4 متوسط (1)',
    agendaTopics: 'تحليل نتائج الفصل الأول، دراسة انضباط ومواظبة التلاميذ، وتحديد الإجراءات التربوية.',
    recommendations: 'تثمين النتائج الرياضية الممتازة للتلاميذ، وتوجيه إنذار شفهي للتلاميذ المتذبذبين في إحضار البذلة الرياضية.',
    reportContent: 'عرض أستاذ التربية البدنية الحصيلة الفصلية التي أظهرت معدلاً عاماً بلغ 16.4/20 مع نسبة مواظبة ممتازة تجاوزت 95%، وتم تسجيل التقديرات في الدفاتر المدرسية الرسمية.',
  },
];

export const INITIAL_LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    id: 'log-1',
    classId: 'class-3',
    date: '2026-10-06',
    weekNumber: 2,
    sessionNumber: 1,
    sportType: 'كرة اليد وألعاب القوى',
    objectiveTaught: 'التقويم التشخيصي للسرعة والوثب والمكتسبات القاعدية في كرة اليد',
    observations: 'حضور كامل للتلاميذ، تسجيل أوقات أولية مشجعة مع ملاحظة نقص في التوافق الحركي لدى بعض التلاميذ.',
    status: 'منجزة',
  },
  {
    id: 'log-2',
    classId: 'class-3',
    date: '2026-10-08',
    weekNumber: 2,
    sessionNumber: 2,
    sportType: 'ألعاب القوى (السرعة)',
    objectiveTaught: 'الانطلاق المنخفض ورد الفعل للإشارة الصوتية',
    observations: 'تم إنجاز كافة المواقف التعليمية بنجاح بنسبة استيعاب بلغت 85%.',
    status: 'منجزة',
  },
];

export const INITIAL_INSPECTOR_VISITS: InspectorVisit[] = [
  {
    id: 'vis-1',
    date: '2026-10-15',
    visitorRole: 'مفتش التربية الوطنية',
    visitorName: 'مفتش مادة التربية البدنية والرياضية (المقاطعة 3)',
    classVisited: '4 متوسط (الفوج 1)',
    activityObserved: 'كرة اليد (الهجوم الخاطف وبناء المحطات)',
    pedagogicalSubject: 'زيارة توجيهية وتثبيت المعايير البيداغوجية لمشروع القسم',
    observationsAndDirectives:
      'تحضير جدي للحصة وتسيير ميداني محكم وممتاز. احترام أزمنة المراحل التعليمية الثلاث وتوظيف سليم للعتاد الرياضي. يُثمن اهتمام الأستاذ بسجلات المتابعة والوثيقة المرافقة والتوزيع السنوي المحين.',
    pedagogicalGrade: '17.5 / 20 (تثمين وتشجيع)',
  },
  {
    id: 'vis-2',
    date: '2026-09-30',
    visitorRole: 'مدير المؤسسة',
    visitorName: 'السيد مدير متوسطة مفدي زكرياء',
    classVisited: '1 متوسط (الفوج 1)',
    activityObserved: 'الجري السريع والألعاب التمهيدية',
    pedagogicalSubject: 'متابعة الدخول المدرسي والانضباط الميداني والسلامة',
    observationsAndDirectives:
      'حضور وانضباط متميز من طرف التلاميذ، ارتدائهم للبذلة الرياضية بنسبة 100%، توفير شروط السلامة بمحيط الملعب، والتسجيل المنتظم في دفتر النصوص.',
    pedagogicalGrade: 'ملاحظة شرفية ممتازة',
  },
];

export const INITIAL_ASSM_INFO: ASSMInfo = {
  presidentName: 'السيد مدير المتوسطة (رئيس شرفي بحكم المنصب)',
  vicePresident: 'الأستاذ لخضر بديار (نائب الرئيس ومدير تقني)',
  secretaryGeneral: 'أستاذ(ة) اللغة العربية / التربية البدنية',
  treasurer: 'المقتصد / مسير المصالح المالية',
  affiliationsCount: 68,
  plannedTournaments:
    'دوري كرة اليد بين الأقسام (ذكور وإناث)، سباق العدو الريفي المدرسي الولائي، وتصفيات ألعاب القوى المدرسية.',
  budgetNotes: 'تم تخصيص حصة من اشتراكات الضمان والجمعية لاقتناء كرات جديدة وأقمصة رياضية للفرق الممثلة للمؤسسة.',
};

export const INITIAL_PROFILE_DETAILS: TeacherProfileDetails = {
  birthDate: '1990-05-14',
  birthPlace: 'الجزائر العاصمة',
  financialNumber: '14892015/09',
  socialSecurityNumber: '901452890123',
  phoneNumber: '0550 12 34 56',
  email: 'lakhderbeddiar@gmail.com',
  wilaya: 'الجزائر (وسط)',
  inspectionDistrict: 'المقاطعة التربوية الثالثة للتربية البدنية والرياضية',
};

export function getDefaultData(): AppData {
  return {
    teacherName: 'الأستاذ: لخضر بديار',
    teacherRank: 'أستاذ التعليم المتوسط (الدرجة 4)',
    teacherDegree: 'ماستر في علوم وتقنيات الأنشطة البدنية والرياضية (تدريب وتحكيم رياضي)',
    appointmentDate: '2018-09-02',
    tenureDate: '2019-06-15',
    weeklyHours: 18,
    schoolName: 'متوسطة الشهيد مفدي زكرياء',
    inspectorName: 'مفتش مادة التربية البدنية والرياضية',
    academicYear: '2025 - 2026',
    classes: INITIAL_CLASSES,
    students: INITIAL_STUDENTS,
    attendance: INITIAL_ATTENDANCE,
    evaluations: INITIAL_EVALUATIONS,
    lessonPlans: INITIAL_LESSON_PLANS,
    annualPrograms: [INITIAL_ANNUAL_PROGRAM],
    learningUnits: INITIAL_LEARNING_UNITS,
    equipment: INITIAL_EQUIPMENT,
    customTests: STANDARD_FITNESS_TESTS,
    logbookEntries: INITIAL_LOGBOOK_ENTRIES,
    accidentReports: INITIAL_ACCIDENT_REPORTS,
    pedagogicalMeetings: INITIAL_PEDAGOGICAL_MEETINGS,
    inspectorVisits: INITIAL_INSPECTOR_VISITS,
    assmInfo: INITIAL_ASSM_INFO,
    profileDetails: INITIAL_PROFILE_DETAILS,
  };
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultData();
      saveAppData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultData(),
      ...parsed,
    };
  } catch (err) {
    console.error('Error loading app data from storage', err);
    return getDefaultData();
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving app data to storage', err);
  }
}

export function exportBackupJSON(data: AppData) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `EPS_Teacher_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Universal UTF-8 Arabic-compatible CSV exporter with BOM
 */
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const BOM = '\uFEFF';
  const csvContent =
    BOM +
    [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function calculateBMI(weightKg?: number, heightCm?: number): {
  bmi: number | null;
  category: string;
  badgeColor: string;
} {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: null, category: 'غير محدد', badgeColor: 'text-slate-500' };
  }
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) {
    return { bmi, category: 'نحافة', badgeColor: 'text-amber-600' };
  } else if (bmi <= 24.9) {
    return { bmi, category: 'وزن مثالي متوازن', badgeColor: 'text-emerald-600' };
  } else if (bmi <= 29.9) {
    return { bmi, category: 'زيادة في الوزن', badgeColor: 'text-orange-600' };
  } else {
    return { bmi, category: 'سمنة', badgeColor: 'text-rose-600' };
  }
}

export function calculateAutomatedGrade(
  testId: string,
  rawVal: number,
  gender: 'M' | 'F' = 'M'
): number {
  if (rawVal <= 0) return 0;

  if (testId === 'test-speed') {
    if (gender === 'M') {
      if (rawVal <= 6.8) return 20;
      if (rawVal <= 7.0) return 19;
      if (rawVal <= 7.2) return 18;
      if (rawVal <= 7.4) return 17;
      if (rawVal <= 7.7) return 16;
      if (rawVal <= 8.0) return 14.5;
      if (rawVal <= 8.4) return 13;
      if (rawVal <= 8.8) return 11.5;
      if (rawVal <= 9.3) return 10;
      return Math.max(5, 10 - (rawVal - 9.3) * 3);
    } else {
      if (rawVal <= 7.4) return 20;
      if (rawVal <= 7.7) return 19;
      if (rawVal <= 8.0) return 18;
      if (rawVal <= 8.3) return 17;
      if (rawVal <= 8.6) return 16;
      if (rawVal <= 9.0) return 14.5;
      if (rawVal <= 9.5) return 13;
      if (rawVal <= 10.0) return 11;
      return Math.max(5, 10 - (rawVal - 10.0) * 2.5);
    }
  }

  if (testId === 'test-jump') {
    if (gender === 'M') {
      if (rawVal >= 2.2) return 20;
      if (rawVal >= 2.05) return 18.5;
      if (rawVal >= 1.9) return 17;
      if (rawVal >= 1.75) return 15;
      if (rawVal >= 1.6) return 13.5;
      if (rawVal >= 1.45) return 12;
      if (rawVal >= 1.3) return 10;
      return Math.max(4, rawVal * 7);
    } else {
      if (rawVal >= 1.95) return 20;
      if (rawVal >= 1.8) return 18.5;
      if (rawVal >= 1.65) return 17;
      if (rawVal >= 1.5) return 15;
      if (rawVal >= 1.35) return 13.5;
      if (rawVal >= 1.2) return 11.5;
      if (rawVal >= 1.05) return 10;
      return Math.max(4, rawVal * 8);
    }
  }

  if (testId === 'test-abs') {
    if (gender === 'M') {
      if (rawVal >= 30) return 20;
      if (rawVal >= 26) return 18;
      if (rawVal >= 22) return 16;
      if (rawVal >= 18) return 14;
      if (rawVal >= 14) return 11.5;
      if (rawVal >= 10) return 9;
      return Math.max(3, rawVal);
    } else {
      if (rawVal >= 25) return 20;
      if (rawVal >= 22) return 18;
      if (rawVal >= 18) return 16;
      if (rawVal >= 14) return 14;
      if (rawVal >= 11) return 11.5;
      if (rawVal >= 8) return 9;
      return Math.max(3, rawVal);
    }
  }

  return Math.min(20, Math.max(0, parseFloat(rawVal.toFixed(1))));
}

export function isExemptionActive(
  studentOrExemption?: any,
  targetDate: string = new Date().toISOString().split('T')[0]
): { isActive: boolean; statusLabel: string; badgeColor: string; reason?: string } {
  if (!studentOrExemption) {
    return { isActive: false, statusLabel: 'لائق بدنياً', badgeColor: 'text-emerald-700' };
  }
  const ex = studentOrExemption.medicalExemption !== undefined
    ? studentOrExemption.medicalExemption
    : studentOrExemption;

  if (!ex || !ex.isExempt) {
    return { isActive: false, statusLabel: 'لائق بدنياً', badgeColor: 'text-emerald-700' };
  }
  if (ex.endDate && ex.endDate < targetDate) {
    return { isActive: false, statusLabel: 'انتهت فترة الإعفاء', badgeColor: 'text-slate-500' };
  }
  return {
    isActive: true,
    statusLabel: ex.exemptionType ? `معفى (${ex.exemptionType})` : 'معفى طبياً',
    badgeColor: 'text-blue-700 font-bold',
    reason: ex.reason,
  };
}
