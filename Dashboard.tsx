import React from 'react';
import {
  Users,
  Calendar,
  Award,
  Layers,
  Activity,
  ShieldAlert,
  ArrowUpRight,
  FileSpreadsheet,
  Clock,
  Printer,
  Sparkles,
  BookOpen,
  Download,
  Smartphone,
  Trophy,
  Cpu,
} from 'lucide-react';
import { AppData, calculateBMI } from '../utils/storage';
import { ActiveTab } from './Navbar';

interface DashboardProps {
  appData: AppData;
  setActiveTab: (tab: ActiveTab) => void;
  onUpdateAppData: (data: AppData) => void;
  onOpenInstallModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  appData,
  setActiveTab,
  onUpdateAppData,
  onOpenInstallModal,
}) => {
  const [editingProfile, setEditingProfile] = React.useState(false);
  const [teacherName, setTeacherName] = React.useState(appData.teacherName);
  const [schoolName, setSchoolName] = React.useState(appData.schoolName);
  const [academicYear, setAcademicYear] = React.useState(appData.academicYear);

  const totalStudents = appData.students.length;
  const totalClasses = appData.classes.length;
  const exemptCount = appData.students.filter((s) => s.isMedicallyExempt).length;
  const totalUnits = appData.learningUnits.length;
  const totalLessonPlans = appData.lessonPlans.length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAppData({
      ...appData,
      teacherName,
      schoolName,
      academicYear,
    });
    setEditingProfile(false);
  };

  // BMI distribution
  const bmiStats = React.useMemo(() => {
    let normal = 0;
    let underweight = 0;
    let overweight = 0;
    let obese = 0;

    appData.students.forEach((s) => {
      const { category } = calculateBMI(s.weightKg, s.heightCm);
      if (category === 'وزن مثالي متوازن') normal++;
      else if (category === 'نحافة') underweight++;
      else if (category === 'زيادة في الوزن') overweight++;
      else if (category === 'سمنة') obese++;
    });

    return { normal, underweight, overweight, obese };
  }, [appData.students]);

  return (
    <div className="space-y-6">
      {/* PWA Download & Install Quick Callout */}
      {onOpenInstallModal && (
        <div className="p-4 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl shadow-sm border border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white">
                  التطبيق جاهز كـ Android APK وللتثبيت الفوري على هاتفك أو حاسوبك!
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/30 text-emerald-300 rounded-full">
                  Capacitor APK + PWA
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                مشروع أندرويد متكامل في مجلد android جاهز للتجميع، مع إمكانية التثبيت المباشر بنقرة واحدة بدون إنترنت.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="/eps-pro-teacher.zip"
              download="eps-pro-teacher.zip"
              title="تنزيل أرشيف المشروع كاملاً بصيغة ZIP لرفعه إلى GitHub"
              className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل المشروع ZIP (1.3 MB)</span>
            </a>
            <button
              onClick={onOpenInstallModal}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>خيارات التثبيت و APK</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Athletic Teacher Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 text-white">
        <img
          src="/src/assets/images/pe_teacher_banner_1791908152673.jpg"
          alt="ملعب التربية البدنية والرياضية"
          className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[0.5px]"
          referrerPolicy="no-referrer"
        />
        <div className="relative p-6 sm:p-8 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-sm text-xs font-bold bg-emerald-500/90 text-white uppercase tracking-wider">
                منهاج التربية البدنية والرياضية الرسمي
              </span>
              <span className="text-xs text-slate-300">
                الموسم الدراسي {appData.academicYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {appData.teacherName}
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              المؤسسة التربوية: <strong className="text-white">{appData.schoolName}</strong>. المنصة الشاملة لإدارة البرمجة السنوية، الوحدات التعلمية (UA)، جذاذات الحصص البيداغوجية، شبكات التنقيط المعياري، والميقاتي الميداني.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0 no-print">
            <button
              onClick={() => setEditingProfile(true)}
              className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shadow-xs"
            >
              تعديل بيانات الأستاذ والمؤسسة
            </button>
            <button
              onClick={() => setActiveTab('annual_plan')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
            >
              عرض التوزيع السنوي
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">الأفواج والأقسام</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {totalClasses} <span className="text-xs font-medium text-slate-500">أقسام</span>
          </div>
          <p className="text-[11px] text-slate-500">{totalStudents} تلميذاً مسجلاً</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">الوحدات التعلمية (UA)</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {totalUnits} <span className="text-xs font-medium text-slate-500">وحدات</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">وفق المقاربة بالكفاءات</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">المذكرات وجذاذات الحصص</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {totalLessonPlans} <span className="text-xs font-medium text-slate-500">مذكرات</span>
          </div>
          <p className="text-[11px] text-slate-500">بالمراحل الثلاث الرسمية</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">الإعفاءات الطبية</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {exemptCount} <span className="text-xs font-medium text-slate-500">تلاميذ</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {totalStudents ? ((exemptCount / totalStudents) * 100).toFixed(0) : 0}% من إجمالي المتمدرسين
          </p>
        </div>
      </div>

      {/* Quick Launchpad to Teacher Modules */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('curriculum_importer')}
          className="p-5 text-right bg-gradient-to-br from-indigo-900 to-slate-900 text-white hover:opacity-95 rounded-xl border border-indigo-800 shadow-xs transition-all group flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-indigo-500/30 text-indigo-200 rounded-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">مولد فوري</span>
            <h3 className="font-bold text-white text-sm">معالج ومستورد المنهاج</h3>
            <p className="text-xs text-indigo-200 mt-1 line-clamp-2">
              توليد التوزيع السنوي والوحدات من نصوص التدرجات الرسمية بنقرة واحدة.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('annual_plan')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">المخطط والتوزيع السنوي</h3>
            <p className="text-xs text-slate-500 mt-1">
              جدول الـ 36 أسبوعاً بيداغوجياً، وتوزيع الأنشطة الفردية والجماعية.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('learning_units')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">الوحدات التعلمية (UA)</h3>
            <p className="text-xs text-slate-500 mt-1">
              الكفاءات الشاملة والختامية ومصفوفة الحصص التعلمية العشر.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('lesson_plans')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">جذاذات الحصص اليومية</h3>
            <p className="text-xs text-slate-500 mt-1">
              المرحلة الإحمائية، التعليمية، والختامية جاهزة للطباعة الرسمية.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('pedagogical_binder')}
          className="p-5 text-right bg-gradient-to-br from-emerald-900 to-slate-900 text-white hover:opacity-95 rounded-xl border border-emerald-800 shadow-xs transition-all group flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-emerald-500/30 text-emerald-200 rounded-lg group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-300 group-hover:text-white transition-colors" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">الملف الشامل</span>
            <h3 className="font-bold text-white text-sm">الدفتر البيداغوجي للأستاذ</h3>
            <p className="text-xs text-emerald-200 mt-1 line-clamp-2">
              البطاقة الفنية، المرجعيات، إحصائيات الأفواج، الجمعية (ASSM)، وسجل الزيارات.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">الندوات والمجالس والتنسيق</h3>
            <p className="text-xs text-slate-500 mt-1">
              محاضر الندوات التربوية، مجالس الأقسام، واجتماعات التنسيق (PV).
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('accidents')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-rose-50 text-rose-700 rounded-lg group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">تقارير وتصريحات الحوادث</h3>
            <p className="text-xs text-slate-500 mt-1">
              توثيق الحوادث الميدانية والإسعافات للضمان المدرسي والإدارة.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('logbook')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-lg group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">دفتر النصوص ومتابعة المنهاج</h3>
            <p className="text-xs text-slate-500 mt-1">
              تسجيل الحصص المنجزة ونسبة تقدم المنهاج السنوي.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('evaluation')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-purple-50 text-purple-700 rounded-lg group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">شبكة التنقيط المعياري /20</h3>
            <p className="text-xs text-slate-500 mt-1">
              اختبارات السرعة، الوثب، التحمل، والرياضات الجماعية مع حساب آلي.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('timer')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-rose-50 text-rose-700 rounded-lg group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">الميقاتي الميداني وصفارة التحكيم</h3>
            <p className="text-xs text-slate-500 mt-1">
              ميقاتي متعدد المسارات ومؤقت التدريب الدائري المتواتر مع صفارة حية.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('tactical')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-amber-50 text-amber-700 rounded-lg group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">السبورة التكتيكية التفاعلية</h3>
            <p className="text-xs text-slate-500 mt-1">
              ملاعب كرة يد، سلة، طائرة، وقدم لرسم خطط التمرير والتموضع.
            </p>
          </div>
        </button>

        {/* School Sports ASSS */}
        <button
          onClick={() => setActiveTab('school_sports')}
          className="p-5 text-right bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all group flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">الرياضة المدرسية (ASSS)</h3>
            <p className="text-xs text-slate-500 mt-1">
              الجمعية الرياضية، الرخص، والفرق والبطولات الولائية والوطنية.
            </p>
          </div>
        </button>

        {/* EPS AI DEVELOPER Special Card */}
        <button
          onClick={() => setActiveTab('ai_developer')}
          className="p-5 text-right bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 hover:to-amber-900 text-white rounded-xl border border-amber-500/40 shadow-sm transition-all group flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg group-hover:scale-105 transition-transform border border-amber-500/30">
              <Cpu className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
              المدير العام
            </span>
          </div>
          <div>
            <h3 className="font-black text-white text-sm flex items-center gap-1.5">
              <span>EPS AI DEVELOPER</span>
              <span className="text-[10px] text-amber-300 font-mono">Gemini 3.8</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              مساعد تطوير التطبيق الذكي، تعديل الأكواد وبناء APK سحابياً.
            </p>
          </div>
        </button>
      </div>

      {/* Two-Column Details: Schedule & Physical Health Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sessions Schedule */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              الجدول الأسبوعي لحصص التربية البدنية والرياضية
            </h3>
            <span className="text-xs text-slate-500">حسب الأفواج المعتمدة</span>
          </div>

          <div className="space-y-2.5">
            {appData.classes.map((cls) => (
              <div
                key={cls.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{cls.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cls.gradeLevel}</p>
                </div>
                <div className="text-left space-y-0.5">
                  {(cls.sessionDays || []).map((day, idx) => (
                    <span
                      key={idx}
                      className="block text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-sm border border-slate-200"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Health & BMI Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              المؤشرات الصحية والبدنية (مؤشر كتلة الجسم BMI)
            </h3>
            <span className="text-xs text-slate-500">متابعة النمو البدني للتلاميذ</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-[11px] text-emerald-800 block">وزن مثالي متوازن</span>
              <span className="text-xl font-bold text-emerald-900 tabular-nums">
                {bmiStats.normal}
              </span>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <span className="text-[11px] text-amber-800 block">نحافة</span>
              <span className="text-xl font-bold text-amber-900 tabular-nums">
                {bmiStats.underweight}
              </span>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <span className="text-[11px] text-orange-800 block">زيادة وزن</span>
              <span className="text-xl font-bold text-orange-900 tabular-nums">
                {bmiStats.overweight}
              </span>
            </div>

            <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
              <span className="text-[11px] text-rose-800 block">سمنة</span>
              <span className="text-xl font-bold text-rose-900 tabular-nums">
                {bmiStats.obese}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between font-medium">
              <span>التلاميذ المعفيون طبياً:</span>
              <strong className="text-amber-700">{exemptCount} تلاميذ</strong>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              وفق توجيهات طبيب الصحة المدرسية والوثيقة المرافقة، يتم تكليف التلاميذ المعفيين بمهام الملاحظة، التحكيم، وتسجيل الأوقات.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              تعديل بيانات الأستاذ والمؤسسة
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم ولقب الأستاذ</label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم المؤسسة التعليمية</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الموسم الدراسي</label>
                <input
                  type="text"
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
