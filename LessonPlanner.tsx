import React, { useState } from 'react';
import { Plus, Printer, Edit2, Trash2, Copy, BookOpen, FileDown, X, CheckCircle2 } from 'lucide-react';
import { LessonPlan, PedagogicalPhase } from '../types';

interface LessonPlannerProps {
  lessonPlans: LessonPlan[];
  onUpdateLessonPlans: (plans: LessonPlan[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const LessonPlanner: React.FC<LessonPlannerProps> = ({
  lessonPlans,
  onUpdateLessonPlans,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    lessonPlans[0]?.id || ''
  );
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('السنة الأولى ثانوي');
  const [cycle, setCycle] = useState<'ثانوي' | 'متوسط'>('ثانوي');
  const [sportType, setSportType] = useState('ألعاب القوى (الجري السريع 100م/80م)');
  const [domainType, setDomainType] = useState<'نشاط فردي' | 'نشاط جماعي'>('نشاط فردي');
  const [unit, setUnit] = useState('الوحدة التعلمية الأولى: تطوير السرعة القصوى');
  const [sessionNumber, setSessionNumber] = useState(1);
  const [sessionType, setSessionType] = useState<LessonPlan['sessionType']>('تعلمية');
  const [baseCompetence, setBaseCompetence] = useState('');
  const [terminalCompetence, setTerminalCompetence] = useState('');
  const [proceduralGoal, setProceduralGoal] = useState('');

  // 3 phases
  const [prepSituations, setPrepSituations] = useState('');
  const [prepDirectives, setPrepDirectives] = useState('');
  const [prepEquipment, setPrepEquipment] = useState('');
  const [prepDuration, setPrepDuration] = useState(15);

  const [mainSituations, setMainSituations] = useState('');
  const [mainDirectives, setMainDirectives] = useState('');
  const [mainEquipment, setMainEquipment] = useState('');
  const [mainDuration, setMainDuration] = useState(65);

  const [endSituations, setEndSituations] = useState('');
  const [endDirectives, setEndDirectives] = useState('');
  const [endEquipment, setEndEquipment] = useState('');
  const [endDuration, setEndDuration] = useState(10);

  const currentPlan =
    lessonPlans.find((p) => p.id === selectedPlanId) || lessonPlans[0];

  const handleEditClick = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setLevel(plan.level);
    setCycle((plan.cycle === 'متوسط' || plan.cycle === 'المتوسط') ? 'متوسط' : 'ثانوي');
    setSportType(plan.sportType);
    setDomainType(plan.domainType === 'نشاط جماعي' ? 'نشاط جماعي' : 'نشاط فردي');
    setUnit(plan.unit);
    setSessionNumber(plan.sessionNumber);
    setSessionType(plan.sessionType || 'تعلمية');
    setBaseCompetence(plan.baseCompetence || '');
    setTerminalCompetence(plan.terminalCompetence);
    setProceduralGoal(plan.proceduralGoal);

    const p0 = plan.phases[0];
    const p1 = plan.phases[1];
    const p2 = plan.phases[2];

    setPrepDuration(p0?.durationMinutes || 15);
    setPrepSituations(p0?.situations || '');
    setPrepDirectives(p0?.pedagogicalDirectives || '');
    setPrepEquipment(p0?.equipment || '');

    setMainDuration(p1?.durationMinutes || 65);
    setMainSituations(p1?.situations || '');
    setMainDirectives(p1?.pedagogicalDirectives || '');
    setMainEquipment(p1?.equipment || '');

    setEndDuration(p2?.durationMinutes || 10);
    setEndSituations(p2?.situations || '');
    setEndDirectives(p2?.pedagogicalDirectives || '');
    setEndEquipment(p2?.equipment || '');

    setShowModal(true);
  };

  const handleCreateNewClick = () => {
    setEditingPlan(null);
    setTitle('مذكرة بيداغوجية: ');
    setLevel('السنة الثالثة ثانوي (بكالوريا)');
    setCycle('ثانوي');
    setSportType('ألعاب القوى (السرعة والوثب)');
    setDomainType('نشاط فردي');
    setUnit('الوحدة التعلمية الأولى: تحضير البكالوريا');
    setSessionNumber(3);
    setSessionType('تعلمية');
    setBaseCompetence('تنسيق الحركات الانفجارية وإنتاج أقصى تسارع والمحافظة على المسار المستقيم.');
    setTerminalCompetence('الوصول إلى أقصى مردود بدني رقمي يقارب المعايير الوطنية في امتحان شهادة البكالوريا.');
    setProceduralGoal('أن يتمكن التلميذ من أخذ وضعيات الانطلاق المنخفض ورد الفعل الفوري للصفارة والتدرج في الخطوات بنجاح.');

    setPrepDuration(15);
    setPrepSituations('1. تسخين عام: جري خفيف مع تموجات.\n2. إحماء مفصلي وعضلي.\n3. تمارين تردد حركي (Skipping) وانطلاقات 20م.');
    setPrepDirectives('التدرج في الشدة، التنفس السليم، تهيئة الجهاز الحركي والقلبي الدوري.');
    setPrepEquipment('صفارة، أقماع، سلم رشاقة.');

    setMainDuration(65);
    setMainSituations('الموقف 1: الانطلاق من مختلف الأوضاع عند سماع الصفارة.\nالموقف 2: ضبط مكعبات الانطلاق والتسارع.\nالموقف 3: سباقات تنافسية 40 متراً.');
    setMainDirectives('زاوية ميل الجذع 45 درجة، عدم رفع الرأس مبكراً، دفع قوي للأرجل.');
    setMainEquipment('مكعبات انطلاق، ميقاتي يدوي، صفارة.');

    setEndDuration(10);
    setEndSituations('1. مشي استرخائي مع تمارين تمديد.\n2. نقد ذاتي وحوار بيداغوجي حول الحصة.\n3. تدوين الملاحظات في الدفتر اليومي.');
    setEndDirectives('العودة بالنبض للحالة الطبيعية، التحلي بالروح الرياضية.');
    setEndEquipment('الدفتر اليومي، قلم.');

    setShowModal(true);
  };

  const handleDuplicate = (plan: LessonPlan) => {
    const duplicated: LessonPlan = {
      ...plan,
      id: `lp-${Date.now()}`,
      title: `${plan.title} (نسخة معدلة)`,
      sessionNumber: plan.sessionNumber + 1,
      dateCreated: new Date().toISOString().split('T')[0],
    };
    onUpdateLessonPlans([...lessonPlans, duplicated]);
    setSelectedPlanId(duplicated.id);
  };

  const handleDelete = (id: string) => {
    if (!confirm('هل ترغب في حذف هذه المذكرة؟')) return;
    const filtered = lessonPlans.filter((p) => p.id !== id);
    onUpdateLessonPlans(filtered);
    if (selectedPlanId === id && filtered.length > 0) {
      setSelectedPlanId(filtered[0].id);
    }
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();

    const phases: PedagogicalPhase[] = [
      {
        name: 'المرحلة التحضيرية (التسخين العام والخاص)',
        durationMinutes: Number(prepDuration),
        situations: prepSituations,
        pedagogicalDirectives: prepDirectives,
        equipment: prepEquipment,
      },
      {
        name: 'المرحلة التعلمية الرئيسية (الوضعيات المشكلة والورشات)',
        durationMinutes: Number(mainDuration),
        situations: mainSituations,
        pedagogicalDirectives: mainDirectives,
        equipment: mainEquipment,
      },
      {
        name: 'المرحلة الختامية (التهدئة والتقييم)',
        durationMinutes: Number(endDuration),
        situations: endSituations,
        pedagogicalDirectives: endDirectives,
        equipment: endEquipment,
      },
    ];

    if (editingPlan) {
      const updated = lessonPlans.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              title,
              level,
              cycle,
              sportType,
              domainType,
              unit,
              sessionNumber: Number(sessionNumber),
              sessionType,
              baseCompetence,
              terminalCompetence,
              proceduralGoal,
              phases,
            }
          : p
      );
      onUpdateLessonPlans(updated);
    } else {
      const newPlan: LessonPlan = {
        id: `lp-${Date.now()}`,
        title,
        level,
        cycle,
        sportType,
        domainType,
        unit,
        sessionNumber: Number(sessionNumber),
        sessionType,
        baseCompetence,
        terminalCompetence,
        proceduralGoal,
        dateCreated: new Date().toISOString().split('T')[0],
        phases,
      };
      onUpdateLessonPlans([...lessonPlans, newPlan]);
      setSelectedPlanId(newPlan.id);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Official Print Header */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
        <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية - مديرية التعليم الثانوي</p>
        <div className="flex justify-between items-center text-xs mt-3 px-2">
          <span>المؤسسة: {schoolName}</span>
          <span>الموسم الدراسي: {academicYear}</span>
          <span>الأستاذ: {teacherName}</span>
        </div>
        <h1 className="text-xl font-black mt-4 underline">
          مذكرة بيداغوجية للحصة التربوية (طور ثانوي)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          المستوى: {currentPlan?.level} · النشاط: {currentPlan?.sportType} ({currentPlan?.domainType}) · الحصة رقم: {currentPlan?.sessionNumber}
        </p>
      </div>

      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>إعداد المذكرات البيداغوجية (طور ثانوي)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              وفق المنهاج والوثيقة المرافقة والتدرجات السنوية للتعليم الثانوي: الكفاءة الختامية والقاعدية والهدف التعلمي.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateNewClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إعداد مذكرة ثانوية جديدة</span>
            </button>

            <button
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="تصدير المذكرة كملف PDF منسق بمعايير وزارة التربية الوطنية"
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>تصدير إلى PDF منسق للطباعة (A4)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المذكرة</span>
            </button>
          </div>
        </div>

        {/* Plans Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-100 pt-3">
          {lessonPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-right whitespace-nowrap ${
                selectedPlanId === plan.id
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="block font-bold truncate max-w-[240px]">
                {plan.sportType} (حصة {plan.sessionNumber})
              </span>
              <span className="block text-[11px] opacity-80">{plan.level}</span>
            </button>
          ))}
        </div>
      </div>

      {currentPlan && (
        <div className="space-y-6">
          {/* Plan Header Specification Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    {currentPlan.level}
                  </span>
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-sm">
                    {currentPlan.sportType}
                  </span>
                  <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-sm">
                    {currentPlan.domainType || 'نشاط فردي'}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                    حصة {currentPlan.sessionNumber} ({currentPlan.sessionType || 'تعلمية'})
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  {currentPlan.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => handleDuplicate(currentPlan)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>تكرار كنموذج</span>
                </button>
                <button
                  onClick={() => handleEditClick(currentPlan)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => handleDelete(currentPlan.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Competencies Triad (Secondary School Specification) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900 block">الكفاءة القاعدية (Compétence de Base):</span>
                <p className="text-purple-950 leading-relaxed font-medium">
                  {currentPlan.baseCompetence || 'تنسيق الحركات الانفجارية لإنتاج أقصى تسارع...'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block">الكفاءة الختامية (Compétence Terminale):</span>
                <p className="text-slate-700 leading-relaxed">
                  {currentPlan.terminalCompetence}
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 block">الهدف التعلمي / الإجرائي للحصة:</span>
                <p className="text-emerald-950 font-medium leading-relaxed">
                  {currentPlan.proceduralGoal}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Pedagogical Phases Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-44">المراحل والزمن</th>
                  <th className="py-3 px-4">المواقف التعليمية والوضعيات المشكلة</th>
                  <th className="py-3 px-4 w-64">التوجيهات البيداغوجية ومعايير ومؤشرات النجاح</th>
                  <th className="py-3 px-4 w-40">الأدوات والوسائل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentPlan.phases.map((phase, idx) => {
                  const isPrep = idx === 0;
                  const isMain = idx === 1;

                  return (
                    <tr
                      key={idx}
                      className={
                        isPrep
                          ? 'bg-amber-50/20'
                          : isMain
                          ? 'bg-blue-50/20'
                          : 'bg-emerald-50/20'
                      }
                    >
                      <td className="py-4 px-4 align-top">
                        <strong className="block text-slate-900 text-sm font-bold">
                          {phase.name}
                        </strong>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-sm bg-white border border-slate-200 font-bold text-slate-700 tabular-nums">
                          ⏱ {phase.durationMinutes} دقيقة
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top leading-relaxed whitespace-pre-line text-slate-800">
                        {phase.situations}
                      </td>

                      <td className="py-4 px-4 align-top leading-relaxed whitespace-pre-line text-slate-700 bg-slate-50/50">
                        {phase.pedagogicalDirectives}
                      </td>

                      <td className="py-4 px-4 align-top leading-relaxed text-slate-700">
                        {phase.equipment}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Official Signatures for Print */}
          <div className="hidden print:grid grid-cols-3 gap-6 text-center text-xs mt-12 pt-8 border-t border-slate-300">
            <div>
              <p className="font-bold">أستاذ التربية البدنية والرياضية</p>
              <div className="h-16"></div>
              <p className="text-slate-600">{teacherName}</p>
            </div>
            <div>
              <p className="font-bold">تأشيرة مدير الثانوية</p>
              <div className="h-16"></div>
              <p className="text-slate-600">المؤسسة: {schoolName}</p>
            </div>
            <div>
              <p className="font-bold">تأشيرة مفتش التربية الوطنية للتعليم الثانوي</p>
              <div className="h-16"></div>
              <p className="text-slate-600">مفتشية التربية البدنية والرياضية</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit or Create Secondary Lesson Plan */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingPlan ? 'تعديل مذكرة الطور الثانوي' : 'إعداد مذكرة ثانوية جديدة'}
            </h3>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">عنوان الحصة</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المستوى التعليمي (طور ثانوي)</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    <option value="السنة الأولى ثانوي">السنة الأولى ثانوي (ج م ع ت / ج م آ)</option>
                    <option value="السنة الثانية ثانوي">السنة الثانية ثانوي</option>
                    <option value="السنة الثالثة ثانوي (بكالوريا)">السنة الثالثة ثانوي (فوج شهادة البكالوريا)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النشاط الرياضي</label>
                  <input
                    type="text"
                    required
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المجال</label>
                  <select
                    value={domainType}
                    onChange={(e) => setDomainType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="نشاط فردي">نشاط فردي (ألعاب قوى / جمباز)</option>
                    <option value="نشاط جماعي">نشاط جماعي (كرة يد / سلة / طائرة)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">رقم الحصة</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={sessionNumber}
                    onChange={(e) => setSessionNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">نوع الحصة</label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="تعلمية">تعلمية</option>
                    <option value="تشخيصية">تشخيصية</option>
                    <option value="إدماجية">إدماجية</option>
                    <option value="تقويمية">تقويمية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الكفاءة القاعدية (Compétence de Base)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="الكفاءة القاعدية المستهدفة في الطور الثانوي..."
                  value={baseCompetence}
                  onChange={(e) => setBaseCompetence(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الكفاءة الختامية</label>
                <textarea
                  rows={2}
                  required
                  value={terminalCompetence}
                  onChange={(e) => setTerminalCompetence(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الهدف التعلمي / الإجرائي للحصة</label>
                <textarea
                  rows={2}
                  required
                  value={proceduralGoal}
                  onChange={(e) => setProceduralGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              {/* Phase 1 Form */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-900">المرحلة التحضيرية (التسخين العام والخاص)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600">المدة:</span>
                    <input
                      type="number"
                      value={prepDuration}
                      onChange={(e) => setPrepDuration(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-amber-300 rounded-sm text-center font-bold"
                    />
                    <span>دقيقة</span>
                  </div>
                </div>
                <textarea
                  rows={2}
                  placeholder="المواقف التعليمية للتسخين..."
                  value={prepSituations}
                  onChange={(e) => setPrepSituations(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="التوجيهات ومعايير النجاح..."
                    value={prepDirectives}
                    onChange={(e) => setPrepDirectives(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="الأدوات المستعملة..."
                    value={prepEquipment}
                    onChange={(e) => setPrepEquipment(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Phase 2 Form */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-900">المرحلة التعلمية الرئيسية (الوضعيات المشكلة والورشات)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600">المدة:</span>
                    <input
                      type="number"
                      value={mainDuration}
                      onChange={(e) => setMainDuration(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-blue-300 rounded-sm text-center font-bold"
                    />
                    <span>دقيقة</span>
                  </div>
                </div>
                <textarea
                  rows={3}
                  placeholder="المواقف التعلمية، الورشات، والمنافسة التطبيقية..."
                  value={mainSituations}
                  onChange={(e) => setMainSituations(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="التوجيهات ومعايير النجاح..."
                    value={mainDirectives}
                    onChange={(e) => setMainDirectives(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="الأدوات المستعملة..."
                    value={mainEquipment}
                    onChange={(e) => setMainEquipment(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Phase 3 Form */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-900">المرحلة الختامية (التهدئة والتقييم)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600">المدة:</span>
                    <input
                      type="number"
                      value={endDuration}
                      onChange={(e) => setEndDuration(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-emerald-300 rounded-sm text-center font-bold"
                    />
                    <span>دقيقة</span>
                  </div>
                </div>
                <textarea
                  rows={2}
                  placeholder="الاسترخاء، الحوار البيداغوجي، والتدوين في الدفتر اليومي..."
                  value={endSituations}
                  onChange={(e) => setEndSituations(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="التوجيهات البيداغوجية..."
                    value={endDirectives}
                    onChange={(e) => setEndDirectives(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="الأدوات المستعملة..."
                    value={endEquipment}
                    onChange={(e) => setEndEquipment(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  حفظ المذكرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Professional PDF Export Preview (A4 Standard) */}
      {showPdfModal && currentPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 text-right space-y-4 p-5 sm:p-8 relative">
            {/* Modal Controls Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    معاينة وتصدير المذكرة البيداغوجية إلى PDF (A4)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    محررة وفق النماذج الرسمية لوزارة التربية الوطنية للجمهورية الجزائرية الديمقراطية الشعبية.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>حفظ بصيغة PDF / طباعة A4</span>
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Printable Sheet Area (Standard A4 Portrait Sheet) */}
            <div className="p-6 border-2 border-black rounded-lg space-y-4 bg-white text-black font-sans text-xs">
              {/* Official Algerian Republic Header */}
              <div className="text-center border-b-2 border-black pb-3 space-y-1">
                <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                <p className="font-bold text-xs">وزارة التربية الوطنية · المفتشية العامة للتربية الوطنية</p>
                <div className="flex justify-between items-center text-xs mt-2 px-1 font-semibold">
                  <span>المؤسسة: {schoolName}</span>
                  <span>الموسم الدراسي: {academicYear}</span>
                  <span>الأستاذ: {teacherName}</span>
                </div>
                <div className="border-t border-black pt-2 mt-2">
                  <h2 className="text-base font-black tracking-wide underline uppercase">
                    جذاذة بيداغوجية للحصة التعليمية (Fiche Pédagogique)
                  </h2>
                  <p className="text-[11px] text-slate-700 font-bold mt-0.5">
                    مادة التربية البدنية والرياضية · {currentPlan.level} · {currentPlan.cycle === 'ثانوي' ? 'التعليم الثانوي' : 'التعليم المتوسط'}
                  </p>
                </div>
              </div>

              {/* Identification Grid */}
              <div className="border border-black grid grid-cols-2 sm:grid-cols-4 divide-x divide-x-reverse divide-y sm:divide-y-0 divide-black text-[11px]">
                <div className="p-2 space-y-0.5">
                  <span className="font-bold text-slate-600 block">المجال / النشاط:</span>
                  <span className="font-black text-black">{currentPlan.sportType}</span>
                </div>
                <div className="p-2 space-y-0.5">
                  <span className="font-bold text-slate-600 block">الوحدة التعلمية:</span>
                  <span className="font-black text-black">{currentPlan.unit}</span>
                </div>
                <div className="p-2 space-y-0.5">
                  <span className="font-bold text-slate-600 block">رقم ونوع الحصة:</span>
                  <span className="font-black text-black">
                    حصة {currentPlan.sessionNumber} ({currentPlan.sessionType || 'تعلمية'})
                  </span>
                </div>
                <div className="p-2 space-y-0.5">
                  <span className="font-bold text-slate-600 block">المدة الإجمالية:</span>
                  <span className="font-black text-black">
                    {(currentPlan.phases[0]?.durationMinutes || 15) +
                      (currentPlan.phases[1]?.durationMinutes || 65) +
                      (currentPlan.phases[2]?.durationMinutes || 10)}{' '}
                    دقيقة (ساعتان)
                  </span>
                </div>
              </div>

              {/* Competencies Table */}
              <div className="border border-black divide-y divide-black text-[11px]">
                <div className="p-2 bg-slate-50">
                  <strong className="block text-black font-black mb-0.5">الكفاءة الختامية للمستوى الدراسي:</strong>
                  <p className="leading-relaxed">{currentPlan.terminalCompetence}</p>
                </div>
                {currentPlan.baseCompetence && (
                  <div className="p-2">
                    <strong className="block text-black font-black mb-0.5">الكفاءة القاعدية المستهدفة:</strong>
                    <p className="leading-relaxed">{currentPlan.baseCompetence}</p>
                  </div>
                )}
                <div className="p-2 bg-slate-50">
                  <strong className="block text-black font-black mb-0.5">الهدف الإجرائي والتعلمي للحصة:</strong>
                  <p className="leading-relaxed font-bold">{currentPlan.proceduralGoal}</p>
                </div>
              </div>

              {/* 3 Pedagogical Phases Table */}
              <div className="border border-black overflow-hidden">
                <table className="w-full text-right text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-200 border-b border-black font-black text-black">
                      <th className="p-2 w-28 border-l border-black text-center">المرحلة والزمن</th>
                      <th className="p-2 border-l border-black">المواقف التعليمية والوضعيات الحركية</th>
                      <th className="p-2 w-48 border-l border-black">التوجيهات البيداغوجية والمعايير</th>
                      <th className="p-2 w-32 text-center">الوسائل والأدوات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {/* Phase 1: Preparatory */}
                    <tr>
                      <td className="p-2.5 font-bold border-l border-black bg-slate-50 text-center align-top">
                        <span className="block font-black">{currentPlan.phases[0]?.name || 'المرحلة التحضيرية'}</span>
                        <span className="block text-slate-600 mt-1">({currentPlan.phases[0]?.durationMinutes || 15} دقيقة)</span>
                      </td>
                      <td className="p-2.5 border-l border-black align-top leading-relaxed whitespace-pre-line">
                        {currentPlan.phases[0]?.situations}
                      </td>
                      <td className="p-2.5 border-l border-black align-top leading-relaxed text-slate-800">
                        {currentPlan.phases[0]?.pedagogicalDirectives}
                      </td>
                      <td className="p-2.5 align-top text-center text-slate-700">
                        {currentPlan.phases[0]?.equipment || 'صفارة، أقماع'}
                      </td>
                    </tr>

                    {/* Phase 2: Main Learning */}
                    <tr>
                      <td className="p-2.5 font-bold border-l border-black bg-slate-50 text-center align-top">
                        <span className="block font-black">{currentPlan.phases[1]?.name || 'المرحلة التعلمية الرئيسية'}</span>
                        <span className="block text-slate-600 mt-1">({currentPlan.phases[1]?.durationMinutes || 65} دقيقة)</span>
                      </td>
                      <td className="p-2.5 border-l border-black align-top leading-relaxed whitespace-pre-line">
                        {currentPlan.phases[1]?.situations}
                      </td>
                      <td className="p-2.5 border-l border-black align-top leading-relaxed text-slate-800">
                        {currentPlan.phases[1]?.pedagogicalDirectives}
                      </td>
                      <td className="p-2.5 align-top text-center text-slate-700">
                        {currentPlan.phases[1]?.equipment || 'كرات، شواخص، شريط قياس'}
                      </td>
                    </tr>

                    {/* Phase 3: Conclusion */}
                    <tr>
                      <td className="p-2.5 font-bold border-l border-black bg-slate-50 text-center align-top">
                        <span className="block font-black">{currentPlan.phases[2]?.name || 'المرحلة الختامية'}</span>
                        <span className="block text-slate-600 mt-1">({currentPlan.phases[2]?.durationMinutes || 10} دقيقة)</span>
                      </td>
                      <td className="p-2.5 border-l border-black align-top leading-relaxed whitespace-pre-line">
                        {currentPlan.phases[2]?.situations}
                      </td>
                      <td className="p-2.5 border-l border-black align-top leading-relaxed text-slate-800">
                        {currentPlan.phases[2]?.pedagogicalDirectives}
                      </td>
                      <td className="p-2.5 align-top text-center text-slate-700">
                        {currentPlan.phases[2]?.equipment || 'كراس المتابعة'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Teacher Self-Evaluation & Signatures Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border border-black p-3 text-[11px]">
                <div className="space-y-1">
                  <span className="font-bold block">تقييم الأستاذ وملاحظات الإنجاز:</span>
                  <div className="h-16 border border-dashed border-slate-400 rounded-sm p-1 text-slate-500">
                    تم تحقيق الأهداف المسطرة بنسبة مقبولة مع مراعاة الفروق الفردية.
                  </div>
                </div>

                <div className="text-center space-y-6 pt-1">
                  <span className="font-bold block">توقيع أستاذ المادة:</span>
                  <span className="font-black block">{teacherName}</span>
                </div>

                <div className="text-center space-y-6 pt-1 border-r border-black pr-2">
                  <span className="font-bold block">تأشيرة السيد المفتش / المدير:</span>
                  <span className="text-slate-400 block">في: .... / .... / 202..</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 no-print">
              <span className="text-xs text-slate-500">
                تلميح: اختر "Save as PDF" من خيارات الطابعة في المتصفح لحفظ الملف بصيغة PDF.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إغلاق
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة أو حفظ PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
