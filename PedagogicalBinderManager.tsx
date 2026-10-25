import React, { useState } from 'react';
import {
  Printer,
  BookOpen,
  User,
  Clock,
  Award,
  ShieldAlert,
  Layers,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Activity,
  HeartHandshake,
  Download,
} from 'lucide-react';
import {
  ClassGroup,
  Student,
  AnnualProgram,
  LearningUnit,
  InspectorVisit,
  ASSMInfo,
  TeacherProfileDetails,
} from '../types';
import { calculateBMI } from '../utils/storage';

interface PedagogicalBinderManagerProps {
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
  annualPrograms: AnnualProgram[];
  learningUnits: LearningUnit[];
  inspectorVisits: InspectorVisit[];
  assmInfo: ASSMInfo;
  profileDetails: TeacherProfileDetails;
  onUpdateVisits: (visits: InspectorVisit[]) => void;
  onUpdateASSM: (assm: ASSMInfo) => void;
  onUpdateProfileDetails: (details: TeacherProfileDetails) => void;
  onUpdateTeacherInfo: (info: {
    teacherName: string;
    teacherRank: string;
    teacherDegree: string;
    appointmentDate: string;
    tenureDate: string;
    weeklyHours: number;
    schoolName: string;
    inspectorName?: string;
    academicYear: string;
  }) => void;
}

export const PedagogicalBinderManager: React.FC<PedagogicalBinderManagerProps> = ({
  teacherName,
  teacherRank,
  teacherDegree,
  appointmentDate,
  tenureDate,
  weeklyHours,
  schoolName,
  inspectorName,
  academicYear,
  classes,
  students,
  annualPrograms,
  learningUnits,
  inspectorVisits,
  assmInfo,
  profileDetails,
  onUpdateVisits,
  onUpdateASSM,
  onUpdateProfileDetails,
  onUpdateTeacherInfo,
}) => {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'identity' | 'pedagogy_goals' | 'statistics' | 'assm' | 'visits' | 'full_print'
  >('overview');

  // Edit Teacher Identity state
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [formTeacherName, setFormTeacherName] = useState(teacherName);
  const [formTeacherRank, setFormTeacherRank] = useState(teacherRank);
  const [formTeacherDegree, setFormTeacherDegree] = useState(teacherDegree);
  const [formAppointmentDate, setFormAppointmentDate] = useState(appointmentDate);
  const [formTenureDate, setFormTenureDate] = useState(tenureDate);
  const [formWeeklyHours, setFormWeeklyHours] = useState(weeklyHours);
  const [formSchoolName, setFormSchoolName] = useState(schoolName);
  const [formInspectorName, setFormInspectorName] = useState(inspectorName || '');
  const [formAcademicYear, setFormAcademicYear] = useState(academicYear);
  const [formPhone, setFormPhone] = useState(profileDetails.phoneNumber || '');
  const [formEmail, setFormEmail] = useState(profileDetails.email || '');
  const [formFinancialNumber, setFormFinancialNumber] = useState(profileDetails.financialNumber || '');
  const [formSSN, setFormSSN] = useState(profileDetails.socialSecurityNumber || '');
  const [formBirthDate, setFormBirthDate] = useState(profileDetails.birthDate || '');
  const [formBirthPlace, setFormBirthPlace] = useState(profileDetails.birthPlace || '');
  const [formDistrict, setFormDistrict] = useState(profileDetails.inspectionDistrict || '');

  // Edit ASSM state
  const [isEditingASSM, setIsEditingASSM] = useState(false);
  const [assmPresident, setAssmPresident] = useState(assmInfo.presidentName);
  const [assmVicePresident, setAssmVicePresident] = useState(assmInfo.vicePresident);
  const [assmSecretary, setAssmSecretary] = useState(assmInfo.secretaryGeneral);
  const [assmTreasurer, setAssmTreasurer] = useState(assmInfo.treasurer);
  const [assmCount, setAssmCount] = useState(assmInfo.affiliationsCount);
  const [assmTournaments, setAssmTournaments] = useState(assmInfo.plannedTournaments);
  const [assmBudget, setAssmBudget] = useState(assmInfo.budgetNotes);

  // Inspector Visit modal
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<InspectorVisit | null>(null);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitRole, setVisitRole] = useState<InspectorVisit['visitorRole']>('مفتش التربية الوطنية');
  const [visitorName, setVisitorName] = useState(inspectorName || 'مفتش مادة التربية البدنية');
  const [visitClass, setVisitClass] = useState(classes[0]?.name || '4 متوسط');
  const [visitActivity, setVisitActivity] = useState('كرة اليد وألعاب القوى');
  const [visitSubject, setVisitSubject] = useState('زيارة توجيهية ومتابعة بيداغوجية');
  const [visitNotes, setVisitNotes] = useState('التحضير البيداغوجي والتسيير الميداني...');
  const [visitGrade, setVisitGrade] = useState('17 / 20');

  // Stats
  const totalStudents = students.length;
  const malesCount = students.filter((s) => s.gender === 'M').length;
  const femalesCount = students.filter((s) => s.gender === 'F').length;
  const exemptStudents = students.filter((s) => s.isMedicallyExempt);

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacherInfo({
      teacherName: formTeacherName,
      teacherRank: formTeacherRank,
      teacherDegree: formTeacherDegree,
      appointmentDate: formAppointmentDate,
      tenureDate: formTenureDate,
      weeklyHours: Number(formWeeklyHours),
      schoolName: formSchoolName,
      inspectorName: formInspectorName,
      academicYear: formAcademicYear,
    });
    onUpdateProfileDetails({
      birthDate: formBirthDate,
      birthPlace: formBirthPlace,
      financialNumber: formFinancialNumber,
      socialSecurityNumber: formSSN,
      phoneNumber: formPhone,
      email: formEmail,
      inspectionDistrict: formDistrict,
    });
    setIsEditingIdentity(false);
  };

  const handleSaveASSM = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateASSM({
      presidentName: assmPresident,
      vicePresident: assmVicePresident,
      secretaryGeneral: assmSecretary,
      treasurer: assmTreasurer,
      affiliationsCount: Number(assmCount),
      plannedTournaments: assmTournaments,
      budgetNotes: assmBudget,
    });
    setIsEditingASSM(false);
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const visitObj: InspectorVisit = {
      id: editingVisit ? editingVisit.id : `vis-${Date.now()}`,
      date: visitDate,
      visitorRole: visitRole,
      visitorName,
      classVisited: visitClass,
      activityObserved: visitActivity,
      pedagogicalSubject: visitSubject,
      observationsAndDirectives: visitNotes,
      pedagogicalGrade: visitGrade,
    };

    if (editingVisit) {
      onUpdateVisits(inspectorVisits.map((v) => (v.id === editingVisit.id ? visitObj : v)));
    } else {
      onUpdateVisits([visitObj, ...inspectorVisits]);
    }
    setShowVisitModal(false);
  };

  const handleDeleteVisit = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الزيارة البيداغوجية؟')) return;
    onUpdateVisits(inspectorVisits.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>الدفتر البيداغوجي لأستاذ التربية البدنية والرياضية (Cahier Pédagogique)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              الملف البيداغوجي الشامل والوثيقة الرسمية الملزمة: البطاقة الفنية، المرجعيات، إحصائيات الأفواج، الجمعية الرياضية (ASSM)، وسجل التوجيهات والزيارات التفتيشية.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSection('full_print')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>معاينة الدفتر البيداغوجي كاملاً</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الدفتر الرسمي</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-t border-slate-100 pt-3 text-xs">
          {[
            { id: 'overview', label: 'واجهة الدفتر والغلاف البيداغوجي', icon: BookOpen },
            { id: 'identity', label: 'البطاقة الفنية وجدول التوقيت', icon: User },
            { id: 'pedagogy_goals', label: 'المنظومة والغايات البيداغوجية', icon: Award },
            { id: 'statistics', label: 'إحصائيات الأفواج والإعفاءات الطبية', icon: ShieldAlert },
            { id: 'assm', label: 'الجمعية الرياضية المدرسية (ASSM)', icon: HeartHandshake },
            { id: 'visits', label: 'سجل الزيارات والتوجيهات التفتيشية', icon: Activity },
            { id: 'full_print', label: 'عرض الدفتر الكامل للطباعة الرسمية', icon: Printer },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeSection === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: OVERVIEW / COVER */}
      {activeSection === 'overview' && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 p-8 sm:p-12 shadow-sm text-center space-y-8 relative overflow-hidden">
          {/* Official Emblem Banner */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-2">
            <p className="font-bold text-base text-slate-900">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-bold text-sm text-slate-800">وزارة التربية الوطنية</p>
            <div className="flex justify-between items-center text-xs text-slate-600 mt-4 px-4 font-semibold">
              <span>مديرية التربية لولاية: {profileDetails.wilaya || 'الجزائر'}</span>
              <span>المقاطعة التفتيشية: {profileDetails.inspectionDistrict || 'التربية البدنية والرياضية'}</span>
              <span>المؤسسة: {schoolName}</span>
            </div>
          </div>

          <div className="py-8 space-y-4">
            <div className="inline-block p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-600 mb-2">
              <span className="text-4xl">🏅</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              الدفتر البيداغوجي لأستاذ التربية البدنية والرياضية
            </h1>
            <p className="text-sm font-bold text-emerald-800 uppercase tracking-widest">
              CAHIER PÉDAGOGIQUE DE L&apos;ENSEIGNANT D&apos;EPS
            </p>
            <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
              وثيقة بيداغوجية وتشريعية تتضمن المسار المهني، المخططات السنوية، شبكات المتابعة، والجمعية الرياضية المدرسية، وفق المناهج الرسمية والوثائق المرافقة لوزارة التربية الوطنية.
            </p>
          </div>

          {/* Teacher Badge Card */}
          <div className="max-w-xl mx-auto bg-slate-50 border-2 border-slate-300 rounded-xl p-6 text-right space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">أستاذ المادة:</span>
                <strong className="text-slate-950 text-base font-black">{teacherName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">الرتبة والدرجة:</span>
                <strong className="text-slate-900 font-bold">{teacherRank}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">المؤسسة التعليمية:</span>
                <span className="text-slate-900 font-semibold">{schoolName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">الموسم الدراسي:</span>
                <strong className="text-slate-900 font-mono font-bold">{academicYear}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">السيد مفتش المادة:</span>
                <span className="text-slate-900 font-semibold">{inspectorName || 'مفتش التربية الوطنية'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">النصاب الأسبوعي:</span>
                <span className="text-slate-900 font-bold tabular-nums">{weeklyHours} ساعة / أسبوع</span>
              </div>
            </div>
          </div>

          {/* Table of Contents for the Binder */}
          <div className="max-w-2xl mx-auto pt-6 border-t border-slate-200 text-right">
            <h3 className="font-black text-sm text-slate-900 mb-3 text-center">
              فهرس محاور ومحتويات الدفتر البيداغوجي
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                { num: '01', title: 'البطاقة الفنية المهنية وجدول التوقيت الأسبوعي' },
                { num: '02', title: 'المنظومة البيداغوجية والمرجعيات والكفاءات' },
                { num: '03', title: 'إحصائيات الأفواج، نسب الإعفاء، ومؤشر BMI' },
                { num: '04', title: 'الجمعية الرياضية المدرسية (ASSM) والبرامج التنافسية' },
                { num: '05', title: 'سجل وتأشيرات الزيارات والتوجيهات التفتيشية' },
                { num: '06', title: 'المخطط السنوي للتوزيع وبناء التعلمات' },
              ].map((item) => (
                <div key={item.num} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    {item.num}
                  </span>
                  <span className="font-semibold text-slate-800">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: IDENTITY & TIMETABLE */}
      {activeSection === 'identity' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                المحور الأول: البطاقة الفنية للمعلومات المهنية والإدارية وجدول التوقيت
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تتضمن المسار الوظيفي، الدرجة، الشهادة، وجدول التوقيت الميداني للملاعب.
              </p>
            </div>
            <button
              onClick={() => setIsEditingIdentity(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>تعديل البطاقة الفنية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">اسم ولقب الأستاذ:</span>
              <strong className="text-slate-950 text-sm font-bold">{teacherName}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">الرتبة والدرجة:</span>
              <strong className="text-slate-900 font-bold">{teacherRank}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">المؤهل والشهادة العلمية:</span>
              <span className="text-slate-800 font-medium">{teacherDegree}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">تاريخ أول تعيين:</span>
              <strong className="text-slate-800 font-mono tabular-nums">{appointmentDate}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">تاريخ الترسيم:</span>
              <strong className="text-slate-800 font-mono tabular-nums">{tenureDate}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">رقم التأجير المالي (CCP/Fin):</span>
              <span className="text-slate-800 font-mono font-semibold">{profileDetails.financialNumber || '14892015/09'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">رقم الضمان الاجتماعي:</span>
              <span className="text-slate-800 font-mono font-semibold">{profileDetails.socialSecurityNumber || '901452890123'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">تاريخ ومكان الازدياد:</span>
              <span className="text-slate-800 font-semibold">{profileDetails.birthDate || '1990-05-14'} بـ {profileDetails.birthPlace || 'الجزائر'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">رقم الهاتف والبريد:</span>
              <span className="text-slate-800 font-mono text-[11px] block">{profileDetails.phoneNumber}</span>
              <span className="text-slate-600 font-mono text-[11px] block">{profileDetails.email}</span>
            </div>
          </div>

          {/* Weekly Timetable Grid */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>جدول التوقيت الأسبوعي واستغلال الفضاءات الرياضية</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                النصاب الأسبوعي: {weeklyHours} ساعة
              </span>
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">الفوج التربوي</th>
                    <th className="py-2.5 px-3">المستوى والطور</th>
                    <th className="py-2.5 px-3">تعداد التلاميذ</th>
                    <th className="py-2.5 px-3">أيام وتوقيت الحصص</th>
                    <th className="py-2.5 px-3">الفضاء / الملعب المستغل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((cls) => {
                    const count = students.filter((s) => s.classId === cls.id).length;
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-black text-slate-900">{cls.name}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{cls.gradeLevel}</td>
                        <td className="py-3 px-3 tabular-nums font-bold text-slate-800">{count} تلميذاً</td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1.5 flex-wrap">
                            {(cls.sessionDays || []).map((d, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md font-semibold text-slate-800">
                                {d}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium">ملعب كرة اليد / مضمار ألعاب القوى</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PEDAGOGY GOALS & OFFICIAL REFERENCES */}
      {activeSection === 'pedagogy_goals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-black text-slate-900">
              المحور الثاني: المنظومة البيداغوجية، المرجعيات التشريعية والكفاءات الشاملة
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              الغايات السامية لترقية الشخصية المتوازنة للتلميذ وفق المقاربة بالكفاءات والمنهاج الوطني.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="font-black text-emerald-950 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>الغايات العامة للتربية البدنية والرياضية</span>
              </h4>
              <p className="text-slate-800 leading-relaxed font-sans">
                تهدف مادة التربية البدنية والرياضية في مرحلتي التعليم المتوسط والثانوي إلى إعداد مواطن سليم البنية، متزن نفسياً واجتماعياً، من خلال:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pr-1 leading-relaxed">
                <li>تطوير القدرات الحركية والبدنية العامة والخاصة (السرعة، الوثب، القوة، التوافق، والتحمل).</li>
                <li>تنمية الروح الرياضية، الانضباط، التعاون الجماعي، واحترام القوانين والغير.</li>
                <li>ترسيخ العادات الصحية والوقائية وغرس ممارسة النشاط البدني كأسلوب حياة مستدام.</li>
                <li>صقل المواهب الرياضية وتأطيرها للمشاركة الإيجابية في الرياضة المدرسية.</li>
              </ul>
            </div>

            <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
              <h4 className="font-black text-indigo-950 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span>المرجعيات والوثائق الرسمية المعتمدة</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700 pr-1 leading-relaxed">
                <li><strong>المنهاج الرسمي للتربية البدنية والرياضية:</strong> الصادر عن مديرية التعليم واللجنة الوطنية للمناهج.</li>
                <li><strong>الوثيقة المرافقة للمنهاج:</strong> الدليل الإجرائي لبناء الوضعيات والتقويم البيداغوجي.</li>
                <li><strong>مخططات التدرجات السنوية الرسمية (سبتمبر 2022):</strong> الصادرة عن المفتشية العامة للتربية الوطنية (نظام الـ 8 ساعات للوحدة التعلمية، برمجة الفرض في الحصة 4، والاختبار في حصة التقويم التحصيلي).</li>
                <li><strong>المنشور الإطاري للتقويم البيداغوجي والمراقبة المستمرة.</strong></li>
                <li><strong>القانون التوجيهي للتربية الوطنية رقم 08-04.</strong></li>
              </ul>
            </div>
          </div>

          {/* Domains Competencies */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-black text-slate-900 text-sm">
              الكفاءات الختامية لميادين الأنشطة البدنية والرياضية
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2">
                <strong className="text-slate-900 block font-bold text-sm">1. ميدان الأنشطة الفردية (ألعاب القوى والجمباز):</strong>
                <p className="text-slate-700 leading-relaxed font-sans">
                  «تجنيد المكتسبات القبلية والقدرات البدنية لتنظيم وتعديل وتيرة الجري، الرمي، أو الوثب لتحقيق أقصى إنجاز ممكن قياساً بالزمن أو المسافة مع احترام شروط الأداء والتحكم الحركي الفردي».
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2">
                <strong className="text-slate-900 block font-bold text-sm">2. ميدان الأنشطة الجماعية (كرة اليد / السلة / الطائرة):</strong>
                <p className="text-slate-700 leading-relaxed font-sans">
                  «التنسيق والتواصل الفعال مع الزملاء لبناء وتطبيق خطط هجومية ودفاعية ملائمة، واستغلال الفضاءات الشاغرة للوصول إلى هدف الخصم وحماية المرمى في إطار الروح الرياضية».
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: STATISTICS & MEDICAL EXEMPTIONS */}
      {activeSection === 'statistics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-black text-slate-900">
              المحور الثالث: إحصائيات الأفواج والمتابعة الصحية والبدنية (الإعفاءات ومؤشر BMI)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              التوزيع الديمغرافي للتلاميذ المسندين للأستاذ، نسب الإعفاءات الطبية المعتمدة، والمتابعة المورفولوجية.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="text-slate-500">إجمالي التلاميذ المسندين</span>
              <strong className="text-2xl font-black text-slate-900 block tabular-nums">{totalStudents}</strong>
              <span className="text-[11px] text-slate-600">عبر {classes.length} أفواج تربوية</span>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center space-y-1">
              <span className="text-blue-700 font-semibold">تعداد الذكور</span>
              <strong className="text-2xl font-black text-blue-900 block tabular-nums">{malesCount}</strong>
              <span className="text-[11px] text-blue-600 font-medium">
                {totalStudents ? ((malesCount / totalStudents) * 100).toFixed(1) : 0}%
              </span>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-center space-y-1">
              <span className="text-rose-700 font-semibold">تعداد الإناث</span>
              <strong className="text-2xl font-black text-rose-900 block tabular-nums">{femalesCount}</strong>
              <span className="text-[11px] text-rose-600 font-medium">
                {totalStudents ? ((femalesCount / totalStudents) * 100).toFixed(1) : 0}%
              </span>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
              <span className="text-amber-800 font-semibold">الإعفاءات الطبية</span>
              <strong className="text-2xl font-black text-amber-900 block tabular-nums">{exemptStudents.length}</strong>
              <span className="text-[11px] text-amber-700 font-medium">
                {totalStudents ? ((exemptStudents.length / totalStudents) * 100).toFixed(1) : 0}% من الإجمالي
              </span>
            </div>
          </div>

          {/* Medical Exemptions Registry */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-sm text-slate-900">
              سجل المتابعة البيداغوجية للتلاميذ المعفيين طبياً
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">اسم ولقب التلميذ</th>
                    <th className="py-2.5 px-3">الفوج التربوي</th>
                    <th className="py-2.5 px-3">سبب الإعفاء الطبي</th>
                    <th className="py-2.5 px-3">فترة الإعفاء</th>
                    <th className="py-2.5 px-3">المهام البيداغوجية والتحكيمية البديلة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exemptStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        لا توجد إعفاءات مسجلة حالياً.
                      </td>
                    </tr>
                  ) : (
                    exemptStudents.map((st) => {
                      const cls = classes.find((c) => c.id === st.classId);
                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{st.firstName} {st.lastName}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">{cls?.name || 'فوج'}</td>
                          <td className="py-2.5 px-3 text-amber-800 font-semibold">{st.medicalNotes || 'شهادة طبية معتمدة ومصادق عليها'}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono">طيلة الموسم الدراسي</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">
                            الملاحظة الميدانية، تسجيل الأوقات، تحكيم الورشات، ومتابعة سجلات الحضور.
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ASSM */}
      {activeSection === 'assm' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                المحور الرابع: الجمعية الرياضية المدرسية (ASSM - Association Sportive Scolaire)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تأطير المنافسات الرياضية، البطولات بين الأقسام، والمشاركة في الأنشطة الولائية.
              </p>
            </div>
            <button
              onClick={() => setIsEditingASSM(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>تعديل بيانات الجمعية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                تشكيلة المكتب التنفيذي للجمعية الرياضية المدرسية
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">رئيس الجمعية:</span>
                  <strong className="text-slate-900">{assmInfo.presidentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">النائب والمدير الفني:</span>
                  <strong className="text-slate-900">{assmInfo.vicePresident}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الكاتب العام:</span>
                  <strong className="text-slate-900">{assmInfo.secretaryGeneral}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">أمين المال:</span>
                  <strong className="text-slate-900">{assmInfo.treasurer}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-700">عدد التلاميذ المنخرطين:</span>
                  <span className="text-emerald-700 tabular-nums">{assmInfo.affiliationsCount} تلميذاً</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3">
              <h4 className="font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-2">
                برنامج الأنشطة والبطولات المبرمجة بالمؤسسة
              </h4>
              <p className="text-slate-800 leading-relaxed font-sans">
                {assmInfo.plannedTournaments}
              </p>
              <div className="pt-2 border-t border-emerald-200/60">
                <span className="text-emerald-900 block font-semibold mb-1">الميزانية وتسيير العتاد الرياضي:</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {assmInfo.budgetNotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: VISITS & INSPECTIONS */}
      {activeSection === 'visits' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                المحور الخامس: سجل الزيارات والتوجيهات البيداغوجية والتفتيشية
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تدوين زيارات وتوجيهات مفتش التربية الوطنية، مدير المؤسسة، والأساتذة المكونين.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingVisit(null);
                setVisitDate(new Date().toISOString().split('T')[0]);
                setVisitRole('مفتش التربية الوطنية');
                setVisitorName(inspectorName || 'مفتش مادة التربية البدنية');
                setVisitClass(classes[0]?.name || '4 متوسط');
                setVisitActivity('كرة اليد وألعاب القوى');
                setVisitSubject('زيارة توجيهية وتثبيت المعايير البيداغوجية');
                setVisitNotes('تثمين التحكم في الفوج واستغلال الوسائل البيداغوجية...');
                setVisitGrade('17.5 / 20');
                setShowVisitModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل زيارة وتوجيه جديد</span>
            </button>
          </div>

          <div className="space-y-4">
            {inspectorVisits.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                لا توجد زيارات مسجلة بعد.
              </div>
            ) : (
              inspectorVisits.map((v) => (
                <div key={v.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                        {v.visitorRole}
                      </span>
                      <strong className="text-slate-900 text-sm">{v.visitorName}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 tabular-nums">{v.date}</span>
                      <button
                        onClick={() => {
                          setEditingVisit(v);
                          setVisitDate(v.date);
                          setVisitRole(v.visitorRole);
                          setVisitorName(v.visitorName);
                          setVisitClass(v.classVisited);
                          setVisitActivity(v.activityObserved);
                          setVisitSubject(v.pedagogicalSubject);
                          setVisitNotes(v.observationsAndDirectives);
                          setVisitGrade(v.pedagogicalGrade || '');
                          setShowVisitModal(true);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-900"
                        title="تعديل"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVisit(v.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">الفوج المزار:</span>
                      <strong className="text-slate-800">{v.classVisited}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">النشاط الممارس:</span>
                      <span className="text-slate-800 font-semibold">{v.activityObserved}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">موضوع الزيارة:</span>
                      <span className="text-slate-800">{v.pedagogicalSubject}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">العلامة / التقدير:</span>
                      <span className="text-emerald-800 font-bold">{v.pedagogicalGrade || '—'}</span>
                    </div>
                  </div>

                  <div className="text-xs pt-1">
                    <span className="text-slate-600 font-bold block mb-1">الملاحظات والتوجيهات البيداغوجية المسداة:</span>
                    <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-sans">
                      {v.observationsAndDirectives}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 7: FULL PRINT VIEW (COMPLETE OFFICIAL BINDER READY FOR INSPECTION) */}
      {activeSection === 'full_print' && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 p-8 shadow-sm space-y-10 print:p-6 print:border-black">
          {/* Cover Page */}
          <div className="text-center border-b-4 border-slate-900 pb-10 space-y-4">
            <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-bold text-xs text-slate-700">وزارة التربية الوطنية · مديرية التربية لولاية {profileDetails.wilaya || 'الجزائر'}</p>
            <div className="h-4"></div>
            <div className="inline-block px-8 py-2.5 bg-slate-950 text-white rounded-xl">
              <h1 className="text-2xl font-black tracking-wide">الدفتر البيداغوجي لأستاذ التربية البدنية والرياضية</h1>
            </div>
            <p className="text-sm font-bold text-slate-700">الموسم الدراسي: {academicYear}</p>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto pt-6 text-xs text-right border-t border-slate-200">
              <div>
                <span className="text-slate-500 block">أستاذ المادة:</span>
                <strong className="text-slate-900 font-black">{teacherName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">المؤسسة التعليمية:</span>
                <strong className="text-slate-900 font-black">{schoolName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">الرتبة والدرجة:</span>
                <span className="text-slate-800 font-bold">{teacherRank}</span>
              </div>
              <div>
                <span className="text-slate-500 block">المقاطعة التفتيشية:</span>
                <span className="text-slate-800 font-bold">{profileDetails.inspectionDistrict || 'التربية البدنية والرياضية'}</span>
              </div>
            </div>
          </div>

          {/* Part 1: Identity & Timetable */}
          <div className="space-y-4 border-b-2 border-slate-200 pb-8">
            <h2 className="text-base font-black text-slate-900 border-r-4 border-emerald-600 pr-3">
              أولاً: البطاقة الفنية للأستاذ وجدول التوقيت الأسبوعي
            </h2>
            <div className="grid grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">تاريخ أول تعيين:</span>
                <strong className="text-slate-900 font-mono">{appointmentDate}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">تاريخ الترسيم:</span>
                <strong className="text-slate-900 font-mono">{tenureDate}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">المؤهل والشهادة:</span>
                <strong className="text-slate-900">{teacherDegree}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">رقم التأجير المالي:</span>
                <span className="text-slate-800 font-mono">{profileDetails.financialNumber || '14892015/09'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">رقم الضمان الاجتماعي:</span>
                <span className="text-slate-800 font-mono">{profileDetails.socialSecurityNumber || '901452890123'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">النصاب الأسبوعي:</span>
                <strong className="text-slate-900 tabular-nums">{weeklyHours} ساعة / أسبوع</strong>
              </div>
            </div>

            {/* Timetable table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-100 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">الفوج التربوي</th>
                    <th className="p-2">المستوى</th>
                    <th className="p-2">التعداد</th>
                    <th className="p-2">توقيت الحصص</th>
                    <th className="p-2">الملعب المستغل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((cls) => {
                    const cnt = students.filter((s) => s.classId === cls.id).length;
                    return (
                      <tr key={cls.id}>
                        <td className="p-2 font-bold">{cls.name}</td>
                        <td className="p-2">{cls.gradeLevel}</td>
                        <td className="p-2 font-mono">{cnt} تلميذ</td>
                        <td className="p-2">{(cls.sessionDays || []).join(' · ')}</td>
                        <td className="p-2">ملعب كرة اليد / ألعاب القوى</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Part 2: Students and Health Statistics */}
          <div className="space-y-4 border-b-2 border-slate-200 pb-8">
            <h2 className="text-base font-black text-slate-900 border-r-4 border-emerald-600 pr-3">
              ثانياً: إحصائيات الأفواج والإعفاءات الطبية المعتمدة
            </h2>
            <div className="grid grid-cols-4 gap-4 text-xs text-center">
              <div className="p-3 bg-slate-50 border rounded-lg">
                <span className="text-slate-500 block">إجمالي التلاميذ:</span>
                <strong className="text-lg font-bold">{totalStudents}</strong>
              </div>
              <div className="p-3 bg-slate-50 border rounded-lg">
                <span className="text-slate-500 block">ذكور:</span>
                <strong className="text-lg font-bold">{malesCount}</strong>
              </div>
              <div className="p-3 bg-slate-50 border rounded-lg">
                <span className="text-slate-500 block">إناث:</span>
                <strong className="text-lg font-bold">{femalesCount}</strong>
              </div>
              <div className="p-3 bg-slate-50 border rounded-lg">
                <span className="text-slate-500 block">معفون طبياً:</span>
                <strong className="text-lg font-bold">{exemptStudents.length}</strong>
              </div>
            </div>
          </div>

          {/* Part 3: ASSM */}
          <div className="space-y-4 border-b-2 border-slate-200 pb-8">
            <h2 className="text-base font-black text-slate-900 border-r-4 border-emerald-600 pr-3">
              ثالثاً: الجمعية الرياضية المدرسية (ASSM)
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <p><strong>رئيس الجمعية:</strong> {assmInfo.presidentName}</p>
                <p className="mt-1"><strong>المدير الفني:</strong> {assmInfo.vicePresident}</p>
                <p className="mt-1"><strong>الكاتب العام:</strong> {assmInfo.secretaryGeneral}</p>
              </div>
              <div>
                <p><strong>أمين المال:</strong> {assmInfo.treasurer}</p>
                <p className="mt-1"><strong>تعداد المنخرطين:</strong> {assmInfo.affiliationsCount} تلميذ</p>
                <p className="mt-1"><strong>البطولات:</strong> {assmInfo.plannedTournaments}</p>
              </div>
            </div>
          </div>

          {/* Part 4: Inspector Directives & Signatures */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 border-r-4 border-emerald-600 pr-3">
              رابعاً: سجل الزيارات والتوجيهات والمصادقة
            </h2>
            <div className="space-y-2 text-xs">
              {inspectorVisits.map((v) => (
                <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between font-bold">
                    <span>{v.visitorRole}: {v.visitorName} ({v.date})</span>
                    <span className="text-emerald-700">{v.pedagogicalGrade}</span>
                  </div>
                  <p className="text-slate-700 mt-1 leading-relaxed">{v.observationsAndDirectives}</p>
                </div>
              ))}
            </div>

            {/* Official Stamps */}
            <div className="grid grid-cols-3 gap-6 text-center text-xs mt-12 pt-8 border-t-2 border-slate-900">
              <div>
                <p className="font-bold">أستاذ المادة</p>
                <div className="h-16"></div>
                <p className="text-slate-700 font-semibold">{teacherName}</p>
              </div>
              <div>
                <p className="font-bold">تأشيرة مدير المؤسسة</p>
                <div className="h-16"></div>
                <p className="text-slate-700 font-semibold">{schoolName}</p>
              </div>
              <div>
                <p className="font-bold">تأشيرة مفتش التربية الوطنية</p>
                <div className="h-16"></div>
                <p className="text-slate-700 font-semibold">{inspectorName || 'مفتشية التربية البدنية'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Identity Modal */}
      {isEditingIdentity && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">تعديل البطاقة الفنية للأستاذ</h3>
            <form onSubmit={handleSaveIdentity} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">اسم ولقب الأستاذ</label>
                  <input
                    type="text"
                    required
                    value={formTeacherName}
                    onChange={(e) => setFormTeacherName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الرتبة والدرجة</label>
                  <input
                    type="text"
                    required
                    value={formTeacherRank}
                    onChange={(e) => setFormTeacherRank(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المؤهل والشهادة</label>
                  <input
                    type="text"
                    required
                    value={formTeacherDegree}
                    onChange={(e) => setFormTeacherDegree(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النصاب الأسبوعي (ساعات)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={formWeeklyHours}
                    onChange={(e) => setFormWeeklyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ أول تعيين</label>
                  <input
                    type="date"
                    required
                    value={formAppointmentDate}
                    onChange={(e) => setFormAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ الترسيم</label>
                  <input
                    type="date"
                    required
                    value={formTenureDate}
                    onChange={(e) => setFormTenureDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">رقم التأجير المالي (Fin/CCP)</label>
                  <input
                    type="text"
                    value={formFinancialNumber}
                    onChange={(e) => setFormFinancialNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">رقم الضمان الاجتماعي</label>
                  <input
                    type="text"
                    value={formSSN}
                    onChange={(e) => setFormSSN(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المؤسسة</label>
                  <input
                    type="text"
                    required
                    value={formSchoolName}
                    onChange={(e) => setFormSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المقاطعة التفتيشية والمفتش</label>
                  <input
                    type="text"
                    value={formInspectorName}
                    onChange={(e) => setFormInspectorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingIdentity(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit ASSM Modal */}
      {isEditingASSM && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">تعديل بيانات الجمعية الرياضية المدرسية (ASSM)</h3>
            <form onSubmit={handleSaveASSM} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">رئيس الجمعية</label>
                <input
                  type="text"
                  required
                  value={assmPresident}
                  onChange={(e) => setAssmPresident(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">نائب الرئيس / المدير الفني</label>
                  <input
                    type="text"
                    required
                    value={assmVicePresident}
                    onChange={(e) => setAssmVicePresident(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الكاتب العام</label>
                  <input
                    type="text"
                    required
                    value={assmSecretary}
                    onChange={(e) => setAssmSecretary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">أمين المال</label>
                  <input
                    type="text"
                    required
                    value={assmTreasurer}
                    onChange={(e) => setAssmTreasurer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">عدد المنخرطين</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={assmCount}
                    onChange={(e) => setAssmCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">البطولات والمنافسات المبرمجة</label>
                <textarea
                  rows={3}
                  required
                  value={assmTournaments}
                  onChange={(e) => setAssmTournaments(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ملاحظات الميزانية والعتاد</label>
                <textarea
                  rows={2}
                  value={assmBudget}
                  onChange={(e) => setAssmBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingASSM(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingVisit ? 'تعديل توجيه الزيارة' : 'تسجيل زيارة بيداغوجية / تفتيشية جديدة'}
            </h3>
            <form onSubmit={handleSaveVisit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">صفة الزائر</label>
                  <select
                    value={visitRole}
                    onChange={(e) => setVisitRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    <option value="مفتش التربية الوطنية">مفتش التربية الوطنية</option>
                    <option value="مدير المؤسسة">مدير المؤسسة</option>
                    <option value="أستاذ مكون / مرافق">أستاذ مكون / مرافق</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ الزيارة</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم الزائر المشرف</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الفوج المزار</label>
                  <input
                    type="text"
                    required
                    value={visitClass}
                    onChange={(e) => setVisitClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النشاط الممارس</label>
                  <input
                    type="text"
                    required
                    value={visitActivity}
                    onChange={(e) => setVisitActivity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">موضوع الزيارة</label>
                  <input
                    type="text"
                    required
                    value={visitSubject}
                    onChange={(e) => setVisitSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">العلامة أو التقدير التربوي</label>
                  <input
                    type="text"
                    placeholder="مثال: 17.5 / 20"
                    value={visitGrade}
                    onChange={(e) => setVisitGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الملاحظات والتوجيهات البيداغوجية</label>
                <textarea
                  rows={4}
                  required
                  placeholder="التوجيهات والملاحظات المسداة من طرف السيد المفتش أو المدير..."
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVisitModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  حفظ التوجيه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
