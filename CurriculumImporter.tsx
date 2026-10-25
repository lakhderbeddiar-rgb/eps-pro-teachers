import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  CheckCircle2,
  Download,
  Printer,
  ArrowRight,
  ClipboardPaste,
  Award,
  Clock,
  ShieldCheck,
  ChevronDown,
  Info,
} from 'lucide-react';
import { AnnualProgram, AnnualWeekPlan, LearningUnit, LessonPlan } from '../types';
import {
  OFFICIAL_CURRICULA,
  OFFICIAL_ANNUAL_PROGRESSIONS,
  OfficialProgressionLevel,
  ProgressionActivityUnit,
} from '../utils/curriculumStandards';

interface CurriculumImporterProps {
  onApplyCurriculum: (
    annualProgram: AnnualProgram,
    learningUnits: LearningUnit[],
    lessonPlans: LessonPlan[]
  ) => void;
  academicYear: string;
}

export const CurriculumImporter: React.FC<CurriculumImporterProps> = ({
  onApplyCurriculum,
  academicYear,
}) => {
  const [selectedStandardKey, setSelectedStandardKey] = useState<string>('1 ثانوي');
  const [activeMode, setActiveMode] = useState<'presets' | 'progression_doc' | 'custom_text'>('presets');
  const [selectedActivityIndex, setSelectedActivityIndex] = useState<number>(0);

  // Custom text inputs
  const [customGradeLevel, setCustomGradeLevel] = useState('السنة الأولى ثانوي جذع مشترك');
  const [customIndivSport, setCustomIndivSport] = useState('الجري السريع ودفع الجلة');
  const [customCollectSport, setCustomCollectSport] = useState('كرة اليد وكرة السلة');
  const [customGlobalCompetence, setCustomGlobalCompetence] = useState(
    'تنسيق وتكييف مختلف العمليات الفردية والجماعية حسب إيقاع معين، مسافة معينة، شدة معينة..'
  );
  const [customTermIndiv, setCustomTermIndiv] = useState(
    'تبني وتيرات قاعدية وتكييف المجهودات حسب الوضعيات والحالات التي يفرضها الموقف.'
  );
  const [customTermCollect, setCustomTermCollect] = useState(
    'استثمار الفضاءات الحرة بانتظام للقيام بهجوم جماعي أو فردي سريع والقذف في المرمى.'
  );
  const [customSyllabusText, setCustomSyllabusText] = useState('');

  const [previewGenerated, setPreviewGenerated] = useState<{
    program: AnnualProgram;
    units: LearningUnit[];
    plans: LessonPlan[];
  } | null>(null);

  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Retrieve official progression level if available
  const officialLevel = OFFICIAL_ANNUAL_PROGRESSIONS[selectedStandardKey];
  const standard = OFFICIAL_CURRICULA[selectedStandardKey] || OFFICIAL_CURRICULA['1 ثانوي'];

  // Generate complete structure based on official ministerial progression (September 2022)
  const handleGenerate = () => {
    setAppliedSuccess(false);

    const gradeTitle =
      activeMode === 'custom_text' ? customGradeLevel : standard.gradeLevel;
    const indivTitle =
      activeMode === 'custom_text'
        ? customIndivSport
        : standard.domainAthletics.terminalCompetence;
    const collectTitle =
      activeMode === 'custom_text'
        ? customCollectSport
        : standard.domainCollective.terminalCompetence;
    const globalComp =
      activeMode === 'custom_text' ? customGlobalCompetence : standard.globalCompetence;

    // 1. Build 32-week Annual Schedule based on the 8-hour per unit progression
    const weeks: AnnualWeekPlan[] = [];
    const months = [
      'سبتمبر', 'أكتوبر', 'أكتوبر', 'أكتوبر', 'نوفمبر', 'نوفمبر', 'نوفمبر', 'نوفمبر', 'ديسمبر', 'ديسمبر', 'ديسمبر',
      'جانفي', 'جانفي', 'جانفي', 'جانفي', 'فيفري', 'فيفري', 'فيفري', 'مارس', 'مارس', 'مارس',
      'أفريل', 'أفريل', 'أفريل', 'ماي', 'ماي', 'ماي', 'ماي', 'جوان'
    ];

    for (let w = 1; w <= 32; w++) {
      let term: AnnualWeekPlan['term'] = 'الفصل الأول';
      if (w >= 12 && w <= 21) term = 'الفصل الثاني';
      if (w >= 22) term = 'الفصل الثالث';

      const month = months[w - 1] || 'ماي';
      let nature: AnnualWeekPlan['natureOfWork'] = 'تعلم وبناء';
      let period = `الوحدة التعلمية الأولى (أسبوع ${w})`;
      let indiv = `تطوير التقنيات المهارية الفردية: ${indivTitle.substring(0, 40)}...`;
      let collect = `بناء الخطط التكتيكية واللعب الجماعي: ${collectTitle.substring(0, 40)}...`;

      if (w === 1) {
        nature = 'دخول وملاحظة وتوجيه';
        period = 'الانطلاق واستقبال الأفواج وضبط القوائم';
        indiv = 'استقبال التلاميذ، الفحص الطبي الظاهري، وقواعد الأمن والسلامة';
        collect = 'تنظيم الأفواج وتوزيع الملاعب والتعريف بمتطلبات التدرج السنوي';
      } else if (w === 2) {
        nature = 'تقويم تشخيصي';
        period = 'الوحدة التعلمية 1 - الحصة 1 (تقويم تشخيصي)';
        indiv = 'تقويم تشخيصي فردي: قياس الوتيرة القاعدية وسرعة رد الفعل';
        collect = 'تقويم تشخيصي جماعي: التمرير والاستقبال والتحكم بالكرة';
      } else if (w === 5) {
        nature = 'تعلم وبناء';
        period = 'الوحدة التعلمية 1 - الحصة 4 (برمجة الفرض الأول)';
        indiv = 'حصة تعليمية 04: إنجاز الفرض المحروس الأول في النشاط الفردي';
        collect = 'حصة تعليمية 04: إنجاز الفرض المحروس الأول في النشاط الجماعي';
      } else if (w === 9) {
        nature = 'إدماج وتقويم تحصيلي';
        period = 'الوحدة التعلمية 1 - الحصة 8 (تقويم تحصيلي واختبار)';
        indiv = 'التقويم التحصيلي للنشاط الفردي (اختبار الفصل الأول)';
        collect = 'التقويم التحصيلي للنشاط الجماعي (اختبار الفصل الأول)';
      } else if (w === 10) {
        nature = 'امتحانات واختبارات';
        period = 'أسبوع الاختبارات الفصلية وحوصلة النتائج';
        indiv = 'رصد علامات المراقبة المستمرة والتقويم الفردي';
        collect = 'حوصلة النتائج ومداولات مجلس القسم';
      } else if (w === 11) {
        nature = 'عطلة فصلية';
        period = 'عطلة الشتاء المدرسية';
        indiv = 'عطلة الشتاء';
        collect = 'عطلة الشتاء';
      } else if (w === 12) {
        nature = 'تقويم تشخيصي';
        period = 'الوحدة التعلمية 2 - الحصة 1 (تقويم تشخيصي)';
        indiv = 'تقويم تشخيصي للنشاط الفردي الثاني (دفع الجلة / الوثب)';
        collect = 'تقويم تشخيصي للمهارات التكتيكية وتجنب المراقبة';
      } else if (w === 15) {
        nature = 'تعلم وبناء';
        period = 'الوحدة التعلمية 2 - الحصة 4 (برمجة الفرض الثاني)';
        indiv = 'حصة تعليمية 04: الفرض المحروس الثاني (تنسيق مراحل الدفع/الارتقاء)';
        collect = 'حصة تعليمية 04: الفرض المحروس الثاني (التغطية والمواجهة)';
      } else if (w === 19) {
        nature = 'إدماج وتقويم تحصيلي';
        period = 'الوحدة التعلمية 2 - الحصة 8 (تقويم تحصيلي واختبار)';
        indiv = 'تقويم تحصيلي واختبار النشاط الفردي للفصل الثاني';
        collect = 'تقويم تحصيلي واختبار النشاط الجماعي للفصل الثاني';
      } else if (w === 20 || w === 21) {
        nature = 'عطلة فصلية';
        period = 'عطلة الربيع المدرسية';
        indiv = 'عطلة الربيع';
        collect = 'عطلة الربيع';
      } else if (w === 22) {
        nature = 'تقويم تشخيصي';
        period = 'الوحدة التعلمية 3 - الحصة 1 (تقويم تشخيصي)';
        indiv = 'تقويم تشخيصي للنشاط الفردي الثالث وتسيير الطاقة';
        collect = 'تقويم تشخيصي للخطط الدفاعية والهجومية المعقدة';
      } else if (w === 25) {
        nature = 'تعلم وبناء';
        period = 'الوحدة التعلمية 3 - الحصة 4 (برمجة الفرض الثالث)';
        indiv = 'حصة تعليمية 04: الفرض المحروس للنشاط الفردي';
        collect = 'حصة تعليمية 04: الفرض المحروس للنشاط الجماعي';
      } else if (w >= 29) {
        nature = 'إدماج وتقويم تحصيلي';
        period = 'التقويم التحصيلي النهائي والتحضير للامتحانات الرسمية';
        indiv = 'محاكاة اختبار البكالوريا / BEM وتسجيل الأرقام النهائية';
        collect = 'المنافسة التتويجية وحوصلة علامات الموسم';
      }

      weeks.push({
        weekNumber: w,
        term,
        month,
        pedagogicalPeriod: period,
        individualActivityTitle: indiv,
        collectiveActivityTitle: collect,
        natureOfWork: nature,
      });
    }

    const newProgram: AnnualProgram = {
      id: `annual-${Date.now()}`,
      gradeLevel: gradeTitle,
      academicYear,
      individualSport: indivTitle,
      collectiveSport: collectTitle,
      gymnasticsSport: 'الجمباز الرياضي والأرضي',
      schedule: weeks,
    };

    // 2. Build Official 8-Hour Learning Units (UA) strictly matching ministerial progression
    const act1 = officialLevel?.activities[0];
    const act2 = officialLevel?.activities[1] || officialLevel?.activities[0];

    const ua1: LearningUnit = {
      id: `ua-gen-1-${Date.now()}`,
      title: `الوحدة التعلمية 01: ${act1 ? act1.sportName : 'الجري السريع'} + النشاط الجماعي`,
      gradeLevel: gradeTitle,
      term: 'الفصل الأول',
      individualActivity: act1 ? act1.sportName : indivTitle,
      collectiveActivity: collectTitle,
      totalSessions: 8,
      generalCompetence: globalComp,
      terminalCompetenceIndividual: act1 ? act1.baseCompetence : indivTitle,
      terminalCompetenceCollective: standard.domainCollective.terminalCompetence,
      performanceCriteria: [
        'انطلاق صحيح وفعال بزمن استجابة سريع وديناميكية خطوات متناسقة.',
        'المحافظة على السرعة والوتيرة القصوى حتى خط الوصول.',
        'استثمار الفضاءات الحرة بانتظام وبناء هجوم سريع مع القذف في المرمى.',
        'ربط المهارات والتجاوب الإيجابي مع مواقف اللعب والروح الرياضية.',
        'الالتزام بقواعد الأمن والسلامة والمشاركة الميدانية الفعالة.',
      ],
      sessions: [
        { sessionNum: 1, title: 'التقويم التشخيصي للمكتسبات القبلية', goal: 'تشخيص وتحديد الفروق الفردية وسرعة رد الفعل والتحكم الأولي بالكرة', type: 'تشخيصية' },
        { sessionNum: 2, title: 'حصة تعليمية 01: تقنيات الانطلاق والاستجابة للمنبهات', goal: 'اكتساب سرعة رد فعل ملائمة للمنبهات وبناء التمرير السريع', type: 'تعلمية' },
        { sessionNum: 3, title: 'حصة تعليمية 02: الانطلاقات السريعة وتناسق الأطراف', goal: 'تنسيق الخطوات والجري داخل الرواق واستغلال الفضاءات الحرة', type: 'تعلمية' },
        { sessionNum: 4, title: 'حصة تعليمية 03: التدرج في السرعة وتطوير وتيرة العمل', goal: 'تكييف المجهود حسب الوضعية والمواجهة الفردية والجماعية', type: 'تعلمية' },
        { sessionNum: 5, title: 'حصة تعليمية 04: وضعيات السرعة القصوى (برمجة الفرض)', goal: 'إنجاز الفرض المحروس للنشاط الفردي والجماعي مع تثمين الأداء', type: 'إدماجية' },
        { sessionNum: 6, title: 'حصة تعليمية 05: المحافظة على السرعة والتصويب الحاسم', goal: 'تسيير المجهود والتخلص من الرقابة والمحافظة على السرعة', type: 'تعلمية' },
        { sessionNum: 7, title: 'حصة تعليمية 06: تقنيات الوصول وسرعة التحول الدفاعي والهجومي', goal: 'تنسيق العمليات وسرعة رد الفعل وإنهاء الهجمة بنجاح', type: 'تعلمية' },
        { sessionNum: 8, title: 'تقويم تحصيلي: اختبار الأداء الرقمي والتكتيكي', goal: 'إنجاز اختبار التقويم التحصيلي الرسمي وفق شبكة المعايير المعتمدة', type: 'تقويمية' },
      ],
    };

    const ua2: LearningUnit = {
      id: `ua-gen-2-${Date.now()}`,
      title: `الوحدة التعلمية 02: ${act2 ? act2.sportName : 'دفع الجلة / الوثب'} + التكتيك الجماعي`,
      gradeLevel: gradeTitle,
      term: 'الفصل الثاني',
      individualActivity: act2 ? act2.sportName : 'دفع الجلة / الوثب الطويل',
      collectiveActivity: collectTitle,
      totalSessions: 8,
      generalCompetence: globalComp,
      terminalCompetenceIndividual: act2 ? act2.baseCompetence : 'تجنيد الطاقة اللازمة وتسلسل القوة',
      terminalCompetenceCollective: 'تجنب المراقبة والمضايقة لمساعدة حامل الكرة والمشاركة في فترات اللعب',
      performanceCriteria: [
        'التوازن وأخذ الوضعية السليمة واستغلال الفضاء القانوني.',
        'الدفع بكامل أطراف الجسم والتحكم في مجال وزاوية الدفع.',
        'تجنب الرقابة والمضايقة وطلب الكرة في المساحات الشاغرة.',
        'القيام بمختلف الأدوار ضمن الفريق والمساهمة في الدفاع والهجوم.',
      ],
      sessions: [
        { sessionNum: 1, title: 'تقويم تشخيصي للمكتسبات القبلية وتسلسل القوى', goal: 'تشخيص القدرة على الارتقاء أو الدفع والتمركز الجماعي', type: 'تشخيصية' },
        { sessionNum: 2, title: 'حصة تعليمية 01: استغلال الفضاء ومسك الأداة والوقفة', goal: 'التحكم في الوضعية الابتدائية والتهيؤ للدفع/الارتقاء', type: 'تعلمية' },
        { sessionNum: 3, title: 'حصة تعليمية 02: تسلسل القوة من القدمين إلى الأطراف', goal: 'تجنيد الطاقة في الوقت المناسب ومساندة الزميل في الدفاع', type: 'تعلمية' },
        { sessionNum: 4, title: 'حصة تعليمية 03: التحكم في زاوية الانطلاق ومجال الدفع', goal: 'تنويع الاستجابات وسرعة التحول وفق مستجدات الموقف', type: 'تعلمية' },
        { sessionNum: 5, title: 'حصة تعليمية 04: الربط الحركي مع سرعة التنفيذ (برمجة الفرض)', goal: 'إنجاز الفرض المحروس الثاني ومتابعة معايير الإنجاز', type: 'إدماجية' },
        { sessionNum: 6, title: 'حصة تعليمية 05: استعادة التوازن بعد خروج الأداة/الهبوط', goal: 'المحافظة على التوازن واستثمار عنصر المشاركة الفعالة', type: 'تعلمية' },
        { sessionNum: 7, title: 'حصة تعليمية 06: محاكاة المنافسة الرسمية وتحسين المسافة', goal: 'الربط المتكامل بين مراحل الدفع/الوثب والخطط الجماعية', type: 'تعلمية' },
        { sessionNum: 8, title: 'تقويم تحصيلي: اختبار الأداء والقياس الرقمي', goal: 'إجراء الاختبار التحصيلي الرسمي وتطبيق سلم التنقيط المعتمد', type: 'تقويمية' },
      ],
    };

    // 3. Build sample lesson plans matching progression
    const newPlans: LessonPlan[] = [
      {
        id: `lp-gen-1-${Date.now()}`,
        learningUnitId: ua1.id,
        title: `حصة تعليمية 01: ${act1 ? act1.sportName : 'الجري السريع'} - تقنيات الانطلاق ورد الفعل`,
        level: gradeTitle,
        sportType: act1 ? act1.sportName : 'ألعاب القوى (الجري السريع)',
        unit: 'الوحدة التعلمية الأولى (8 ساعات)',
        sessionNumber: 2,
        sessionType: 'تعلمية',
        terminalCompetence: act1 ? act1.baseCompetence : indivTitle,
        proceduralGoal: 'استجابة سريعة وصحيحة لمختلف المنبهات (صوتية، بصرية) مع التحكم في وضعية الانطلاق والتسارع الأولي.',
        dateCreated: new Date().toISOString().split('T')[0],
        phases: [
          {
            name: 'المرحلة التحضيرية (الإحماء والتسخين العام والخاص)',
            durationMinutes: 15,
            situations: '1. تسخين عام: جري تمهيدي بتموجات وسرعات متدرجة.\n2. إحماء مفاصل وعضلات وتمديدات ديناميكية للأطراف السفلية.\n3. ألعاب انطلاق استجابية من مختلف الأوضاع (جلوس، وقوف، انبطاح).',
            pedagogicalDirectives: 'التدرج في الشدة، التنفس العميق، وتفادي الانطلاق الخاطئ.',
            equipment: 'صفارة، أقماع، شريط قياس.',
          },
          {
            name: 'المرحلة التعلمية الرئيسية (الورشات والمواقف التعليمية)',
            durationMinutes: 65,
            situations: 'الموقف الأول: الاستجابة لإشارات صوتية مفاجئة من مسافة 15 متراً في أروقة فردية.\nالموقف الثاني: تعلم وضعية الانطلاق السليم (خذ مكانك - استعد - انطلق) مع ميل الجذع للأمام.\nالموقف الثالث: سباقات ثنائية متكافئة 30 متراً مع التركيز على تردد الخطوات واستعمال الذراعين بزاوية 90°.',
            pedagogicalDirectives: 'الدفع القوي بمشط القدم، عدم رفع الرأس مبكراً، واستقامة مسار الجري داخل الرواق.',
            equipment: 'شواخص، أقماع ملونة، ميقاتي يدوي.',
          },
          {
            name: 'المرحلة الختامية (التهدئة والتقييم)',
            durationMinutes: 10,
            situations: 'مشي بطيء، تمارين إطالة لعضلات الفخذ والسمانة، حوار بيداغوجي حول أهمية الانطلاق السليم.',
            pedagogicalDirectives: 'خفض نبضات القلب والعودة للهدوء، التشجيع وتعزيز الثقة بالنفس.',
            equipment: 'كراس المتابعة وقلم.',
          },
        ],
      },
    ];

    setPreviewGenerated({
      program: newProgram,
      units: [ua1, ua2],
      plans: newPlans,
    });
  };

  const handleApplyToSystem = () => {
    if (!previewGenerated) return;
    onApplyCurriculum(
      previewGenerated.program,
      previewGenerated.units,
      previewGenerated.plans
    );
    setAppliedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-indigo-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            المرجعية البيداغوجية الرسمية · وزارة التربية الوطنية (سبتمبر 2022)
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          التدرجات السنوية الرسمية ومولد التوزيع والوحدات البيداغوجية
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          التقيد الصارم بالتدرجات السنوية لوزارة التربية الوطنية (المفتشية العامة للتربية الوطنية، سبتمبر 2022) لمرحلتي التعليم الثانوي والمتوسط: الكفاءات الختامية، الكفاءات القاعدية 1 و2 و3، الموارد المعرفية والحسية الحركية والوجدانية، ونظام الـ 8 ساعات لكل وحدة تعلمية مع برمجة الفرض في الحصة 4 والاختبار في حصة التقويم التحصيلي.
        </p>
      </div>

      {/* Main Tabs Selection */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveMode('presets')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeMode === 'presets'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              المولد السريع للتدرجات السنوية
            </button>

            <button
              onClick={() => setActiveMode('progression_doc')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeMode === 'progression_doc'
                  ? 'bg-white text-emerald-950 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>عرض وثيقة التدرجات الرسمية كاملة (سبتمبر 2022)</span>
            </button>

            <button
              onClick={() => setActiveMode('custom_text')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeMode === 'custom_text'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تخصيص يدوي
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة التدرج الرسمي</span>
            </button>
          </div>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">المستوى التعليمي:</span>
          {[
            { key: '1 ثانوي', label: '1 ثانوي (جذع مشترك ع/آ)', cycle: 'ثانوي' },
            { key: '3 ثانوي', label: '3 ثانوي (جميع الشعب - بكالوريا)', cycle: 'ثانوي' },
            { key: '4 متوسط', label: '4 متوسط (BEM)', cycle: 'متوسط' },
            { key: '3 متوسط', label: '3 متوسط', cycle: 'متوسط' },
            { key: '2 متوسط', label: '2 متوسط', cycle: 'متوسط' },
            { key: '1 متوسط', label: '1 متوسط', cycle: 'متوسط' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setSelectedStandardKey(item.key);
                setSelectedActivityIndex(0);
                setPreviewGenerated(null);
                setAppliedSuccess(false);
              }}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all whitespace-nowrap ${
                selectedStandardKey === item.key
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: OFFICIAL MINISTERIAL PROGRESSION DOCUMENT VIEWER (SEPTEMBER 2022) */}
      {activeMode === 'progression_doc' && officialLevel && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Ministerial Official Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية</p>
            <div className="flex justify-between items-center text-xs mt-3 px-2 text-slate-600 font-semibold">
              <span>المفتشية العامة للتربية الوطنية</span>
              <span>مديرية التعليم الثانوي العام والتكنولوجي</span>
              <span>{officialLevel.academicDocDate}</span>
            </div>
            <div className="inline-block mt-4 px-6 py-2 bg-indigo-900 text-white rounded-xl print:bg-black">
              <h1 className="text-xl font-black">التدرّجات السنوية للتعلمات</h1>
              <p className="text-xs font-bold text-indigo-200 mt-0.5">
                المادة: تربية بدنية ورياضية · {officialLevel.gradeTitle}
              </p>
            </div>
          </div>

          {/* Official Introduction */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
            <strong className="block text-slate-900 font-black mb-1">مقدمة المنهاج والتدرج السنوي:</strong>
            {officialLevel.officialIntroduction}
          </div>

          {/* Global Competence & Terminology Card */}
          <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
              <span className="font-black text-indigo-950 text-sm">الكفاءة الختامية للمستوى الدراسي:</span>
              <span className="px-2 py-0.5 rounded-sm bg-indigo-200 text-indigo-900 font-bold text-[11px]">رسمي معتمد</span>
            </div>
            <p className="text-indigo-950 font-bold text-sm leading-relaxed bg-white p-3 rounded-lg border border-indigo-100">
              «{officialLevel.globalCompetence}»
            </p>

            {officialLevel.activities[0]?.terminologyExplanation && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-slate-800">
                <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                  <strong>شرح التنسيق والتكييف:</strong>
                  <p className="mt-0.5 text-slate-600 leading-relaxed">
                    {officialLevel.activities[0].terminologyExplanation.coordination} · {officialLevel.activities[0].terminologyExplanation.adaptation}
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                  <strong>المعنى العام للكفاءة:</strong>
                  <p className="mt-0.5 text-slate-600 leading-relaxed">
                    {officialLevel.activities[0].terminologyExplanation.generalMeaning}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Activities Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-600">الأنشطة المبرمجة بالتدرج:</span>
              {officialLevel.activities.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedActivityIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedActivityIndex === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {act.sportType === 'فردي' ? '🏃 النشاط فردي: ' : '⚽ النشاط جماعي: '}
                  {act.sportName} (كفاءة قاعدية {act.baseCompetenceNumber})
                </button>
              ))}
            </div>

            {/* Selected Activity Official Table View */}
            {officialLevel.activities[selectedActivityIndex] && (() => {
              const currentAct = officialLevel.activities[selectedActivityIndex];
              return (
                <div className="border-2 border-slate-800 rounded-xl overflow-hidden shadow-xs text-xs space-y-0">
                  {/* Table Header Bar */}
                  <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-emerald-400 font-bold block">
                        النشاط: {currentAct.sportType} ({currentAct.sportName}) · المدة الزمنية: {currentAct.durationHours} ساعات
                      </span>
                      <h3 className="font-bold text-base mt-0.5">
                        الكفاءة القاعدية {currentAct.baseCompetenceNumber}: {currentAct.baseCompetence}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 bg-white/10 rounded-md text-slate-200 text-xs font-mono">
                      السندات: أنشطة من الوثيقة المرافقة
                    </span>
                  </div>

                  {/* Main Grid: Objectives, Targeted Resources, Learning Progression */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-200 bg-white">
                    {/* Col 1: Learning Objectives / Criteria */}
                    <div className="p-4 space-y-3 bg-slate-50/50">
                      <h4 className="font-black text-slate-900 border-b border-slate-200 pb-1.5 text-xs">
                        أهداف التعلم / مؤشرات الكفاءة
                      </h4>
                      <ul className="list-disc list-inside space-y-1.5 text-slate-700 leading-relaxed font-sans pr-1">
                        {currentAct.learningObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>

                      <div className="pt-3 border-t border-slate-200">
                        <span className="font-black text-rose-900 block mb-1">التقويم المرحلي للكفاءة:</span>
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 font-bold text-[11px] space-y-1">
                          <p>• يبرمج الفرض خلال الحصة الرابعة.</p>
                          <p>• الاختبار في حصة التقويم التحصيلي.</p>
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Targeted Resources */}
                    <div className="p-4 space-y-3">
                      <h4 className="font-black text-slate-900 border-b border-slate-200 pb-1.5 text-xs">
                        الموارد المستهدفة (معرفية، حسية حركية، وجدانية)
                      </h4>

                      <div>
                        <strong className="text-indigo-900 block mb-1">موارد معرفية:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                          {currentAct.targetedResources.cognitive.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong className="text-emerald-900 block mb-1">موارد حسية حركية:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                          {currentAct.targetedResources.sensorimotor.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong className="text-amber-900 block mb-1">موارد نفسية وجدانية:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                          {currentAct.targetedResources.affective.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Col 3: Methodological Progression */}
                    <div className="p-4 space-y-3 bg-slate-50/50">
                      <h4 className="font-black text-slate-900 border-b border-slate-200 pb-1.5 text-xs">
                        السير المنهجي لتدرج التعلمات
                      </h4>

                      <div>
                        <strong className="text-slate-800 block mb-1">المكتسبات القبلية:</strong>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {currentAct.methodologicalProgression.prerequisites.join(' · ')}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <strong className="text-emerald-950 block mb-1">تدرج التعلمات:</strong>
                        <ul className="space-y-1 text-slate-700 text-[11px] font-medium leading-relaxed pr-1">
                          {currentAct.methodologicalProgression.learningSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-emerald-600 font-bold shrink-0">*</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 8-Hour Session Plan Strip */}
                  <div className="p-4 bg-slate-100 border-t border-slate-200 space-y-2">
                    <h4 className="font-black text-slate-900 text-xs">
                      الوحدات التعليمية المبرمجة (8 ساعات):
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[11px]">
                      {currentAct.sessionPlan.map((s) => (
                        <div
                          key={s.sessionNum}
                          className={`p-2 rounded-lg border font-semibold ${
                            s.type === 'تقويم تشخيصي'
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : s.type === 'تقويم تحصيلي'
                              ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold'
                              : s.note
                              ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold ring-1 ring-amber-400'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <span className="block text-[10px] text-slate-500 font-mono">
                            حصة {s.sessionNum}
                          </span>
                          <span className="block mt-0.5 line-clamp-2">{s.title}</span>
                          {s.note && (
                            <span className="block text-[9px] text-rose-700 font-black mt-1">
                              {s.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Criteria Strip */}
                  <div className="p-4 bg-emerald-50 border-t border-emerald-200 text-xs text-slate-800 space-y-1">
                    <div>
                      <strong className="text-emerald-950">تقويم الكفاءة: </strong>
                      <span>{currentAct.evaluationMilestones.competenceEvaluationCriteria}</span>
                    </div>
                    <div>
                      <strong className="text-emerald-950">تقويم تحصيلي: </strong>
                      <span>{currentAct.evaluationMilestones.summativeEvaluationCriteria}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Action to Apply */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => {
                handleGenerate();
                setActiveMode('presets');
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>توليد واعتماد هذا التدرج السنوي والوحدات فوراً في حسابك</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: FAST GENERATOR (PRESETS) */}
      {activeMode === 'presets' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                بيانات المنهاج والتدرج المختار: {standard.gradeLevel}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                مبني وفق التدرج الوزاري المحين (سبتمبر 2022) بنظام الـ 8 ساعات للوحدة التعلمية.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
              مطابق 100% للتدرج الوزاري
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block font-semibold">الكفاءة الشاملة / الختامية للمستوى:</span>
              <p className="text-slate-900 font-bold mt-1 text-sm leading-relaxed">{standard.globalCompetence}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-emerald-900 font-bold block">🏃 النشاط الفردي (ألعاب القوى والجمباز):</span>
                <p className="text-slate-800 font-medium">{standard.domainAthletics.terminalCompetence}</p>
              </div>

              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1">
                <span className="text-blue-900 font-bold block">⚽ النشاط الجماعي (كرة اليد / السلة / الطائرة):</span>
                <p className="text-slate-800 font-medium">{standard.domainCollective.terminalCompetence}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block font-semibold mb-1">توجيهات التقويم والوثيقة المرافقة:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {standard.companionGuidelines.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => setActiveMode('progression_doc')}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1"
            >
              <span>معاينة جدول التدرج السنوي الوزاري الكامل ↗</span>
            </button>

            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-900 hover:bg-slate-900 rounded-xl transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>توليد التوزيع السنوي والوحدات والمذكرات للمستوى المختار</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: CUSTOM TEXT */}
      {activeMode === 'custom_text' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            إدخال أو تعديل نصوص التدرجات السنوية يدوياً
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">المستوى الدراسي</label>
                <input
                  type="text"
                  value={customGradeLevel}
                  onChange={(e) => setCustomGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">النشاط الفردي المبرمج</label>
                <input
                  type="text"
                  value={customIndivSport}
                  onChange={(e) => setCustomIndivSport(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">النشاط الجماعي المبرمج</label>
                <input
                  type="text"
                  value={customCollectSport}
                  onChange={(e) => setCustomCollectSport(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">الكفاءة الشاملة للمستوى</label>
              <input
                type="text"
                value={customGlobalCompetence}
                onChange={(e) => setCustomGlobalCompetence(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">الكفاءة الختامية للنشاط الفردي</label>
              <input
                type="text"
                value={customTermIndiv}
                onChange={(e) => setCustomTermIndiv(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">الكفاءة الختامية للنشاط الجماعي</label>
              <input
                type="text"
                value={customTermCollect}
                onChange={(e) => setCustomTermCollect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-900 hover:bg-slate-900 rounded-xl transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>توليد الهيكل البيداغوجي وفق البيانات المدخلة</span>
            </button>
          </div>
        </div>
      )}

      {/* GENERATED PREVIEW SECTION */}
      {previewGenerated && (
        <div className="bg-white rounded-2xl border-2 border-indigo-900 p-6 sm:p-8 shadow-md space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                تم بنجاح توليد الهيكل البيداغوجي وفق التدرجات السنوية الرسمية
              </span>
              <h3 className="text-lg font-black text-slate-950 mt-0.5">
                {previewGenerated.program.gradeLevel} ({previewGenerated.program.schedule.length} أسبوعاً بيداغوجياً)
              </h3>
            </div>

            <button
              onClick={handleApplyToSystem}
              disabled={appliedSuccess}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap ${
                appliedSuccess
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{appliedSuccess ? 'تم التطبيق بنجاح في المنصة!' : 'تطبيق واعتماد في النظام الآن'}</span>
            </button>
          </div>

          {appliedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs flex items-center justify-between">
              <span>
                تهانينا! تم حفظ التوزيع السنوي، والوحدات التعلمية (UA)، وجذاذات الحصص اليومية في حسابك بنجاح. يمكنك استعراضها وطباعتها من القائمة العلوية.
              </span>
            </div>
          )}

          {/* Quick Summary Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">التوزيع السنوي المولد:</span>
              <strong className="text-slate-900 text-sm block mt-0.5">
                {previewGenerated.program.schedule.length} أسبوعاً بيداغوجياً
              </strong>
              <span className="text-emerald-700 font-semibold text-[11px]">مقسمة على الفصول الثلاثة</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">الوحدات التعلمية (UA):</span>
              <strong className="text-slate-900 text-sm block mt-0.5">
                {previewGenerated.units.length} وحدات تعلمية (نظام 8 ساعات)
              </strong>
              <span className="text-indigo-700 font-semibold text-[11px]">مع الفرض في الحصة 4 والاختبار في الحصة 8</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">جذاذات الحصص (مذكرات):</span>
              <strong className="text-slate-900 text-sm block mt-0.5">
                {previewGenerated.plans.length} مذكرات بيداغوجية نموذجية
              </strong>
              <span className="text-blue-700 font-semibold text-[11px]">بالمراحل الثلاث الرسمية جاهزة للطباعة</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
