import React, { useState } from 'react';
import { Plus, Printer, Edit2, Trash2, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { LearningUnit, LearningUnitSessionSummary } from '../types';

interface LearningUnitsManagerProps {
  learningUnits: LearningUnit[];
  onUpdateLearningUnits: (units: LearningUnit[]) => void;
  onOpenLessonPlanForSession?: (unitId: string, sessionNum: number) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const LearningUnitsManager: React.FC<LearningUnitsManagerProps> = ({
  learningUnits,
  onUpdateLearningUnits,
  onOpenLessonPlanForSession,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    learningUnits[0]?.id || ''
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<LearningUnit | null>(null);

  // Form state for creating/editing a unit
  const [unitTitle, setUnitTitle] = useState('');
  const [unitLevel, setUnitLevel] = useState('السنة الرابعة متوسط');
  const [unitTerm, setUnitTerm] = useState<'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث'>('الفصل الأول');
  const [unitIndivSport, setUnitIndivSport] = useState('ألعاب القوى: الجري السريع 60م والوثب');
  const [unitCollectSport, setUnitCollectSport] = useState('كرة اليد: الهجوم المنظم والتصويب');
  const [unitTotalSessions, setUnitTotalSessions] = useState(10);
  const [unitGeneralComp, setUnitGeneralComp] = useState('');
  const [unitTermCompIndiv, setUnitTermCompIndiv] = useState('');
  const [unitTermCompCollect, setUnitTermCompCollect] = useState('');
  const [unitCriteriaText, setUnitCriteriaText] = useState('');

  const currentUnit =
    learningUnits.find((u) => u.id === selectedUnitId) || learningUnits[0];

  const handleEditUnitClick = (u: LearningUnit) => {
    setEditingUnit(u);
    setUnitTitle(u.title);
    setUnitLevel(u.gradeLevel);
    setUnitTerm(u.term);
    setUnitIndivSport(u.individualActivity);
    setUnitCollectSport(u.collectiveActivity);
    setUnitTotalSessions(u.totalSessions);
    setUnitGeneralComp(u.generalCompetence);
    setUnitTermCompIndiv(u.terminalCompetenceIndividual);
    setUnitTermCompCollect(u.terminalCompetenceCollective);
    setUnitCriteriaText(u.performanceCriteria.join('\n'));
    setShowAddModal(true);
  };

  const handleCreateNewClick = () => {
    setEditingUnit(null);
    setUnitTitle('الوحدة التعلمية: ');
    setUnitLevel('السنة الرابعة متوسط');
    setUnitTerm('الفصل الأول');
    setUnitIndivSport('ألعاب القوى: الجري السريع والوثب');
    setUnitCollectSport('كرة اليد: الهجوم المنظم');
    setUnitTotalSessions(10);
    setUnitGeneralComp('يقوم التلميذ بضبط وتوجيه حركاته الفردية والجماعية بنجاعة وفق قواعد وقوانين النشاط...');
    setUnitTermCompIndiv('إنتاج أقصى سرعة ممكنة وتحقيق أبعد مسافة وثب بتنسيق الارتقاء والطيران...');
    setUnitTermCompCollect('المشاركة الإيجابية في بناء وتنفيذ هجوم منظم واختراق دفاع الخصم والتصويب الفعال...');
    setUnitCriteriaText('سرعة رد الفعل للإشارة\nدقة التمرير والاستقبال في الحركة\nاحترام الروح الرياضية والتحكيم');
    setShowAddModal(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const criteriaArray = unitCriteriaText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    if (editingUnit) {
      const updated = learningUnits.map((u) =>
        u.id === editingUnit.id
          ? {
              ...u,
              title: unitTitle,
              gradeLevel: unitLevel,
              term: unitTerm,
              individualActivity: unitIndivSport,
              collectiveActivity: unitCollectSport,
              totalSessions: Number(unitTotalSessions),
              generalCompetence: unitGeneralComp,
              terminalCompetenceIndividual: unitTermCompIndiv,
              terminalCompetenceCollective: unitTermCompCollect,
              performanceCriteria: criteriaArray,
            }
          : u
      );
      onUpdateLearningUnits(updated);
    } else {
      // Auto generate default session outlines
      const sessionsGenerated: LearningUnitSessionSummary[] = Array.from(
        { length: Number(unitTotalSessions) },
        (_, idx) => {
          const num = idx + 1;
          let type: LearningUnitSessionSummary['type'] = 'تعلمية';
          let title = `الحصة التعلمية رقم ${num}`;
          let goal = `تطوير المهارات الحركية والتكتيكية للنشاطين`;

          if (num === 1) {
            type = 'تشخيصية';
            title = 'التقويم التشخيصي للمكتسبات القبلية';
            goal = 'تشخيص المستوى الأولي للتلاميذ في النشاط الفردي والجماعي';
          } else if (num === Number(unitTotalSessions) - 1) {
            type = 'إدماجية';
            title = 'وضعية إدماجية ومنافسة موجهة';
            goal = 'إدماج المكتسبات الفردية والجماعية في سياق تنافسي مماثل';
          } else if (num === Number(unitTotalSessions)) {
            type = 'تقويمية';
            title = 'التقويم التحصيلي وحوصلة الوحدة';
            goal = 'التقويم الرسمي للمهارات والإنجاز الرقمي وسلم التنقيط /20';
          }

          return { sessionNum: num, title, goal, type };
        }
      );

      const newUnit: LearningUnit = {
        id: `ua-${Date.now()}`,
        title: unitTitle,
        gradeLevel: unitLevel,
        term: unitTerm,
        individualActivity: unitIndivSport,
        collectiveActivity: unitCollectSport,
        totalSessions: Number(unitTotalSessions),
        generalCompetence: unitGeneralComp,
        terminalCompetenceIndividual: unitTermCompIndiv,
        terminalCompetenceCollective: unitTermCompCollect,
        performanceCriteria: criteriaArray,
        sessions: sessionsGenerated,
      };

      onUpdateLearningUnits([...learningUnits, newUnit]);
      setSelectedUnitId(newUnit.id);
    }

    setShowAddModal(false);
  };

  const handleDeleteUnit = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوحدة التعلمية؟')) return;
    const filtered = learningUnits.filter((u) => u.id !== id);
    onUpdateLearningUnits(filtered);
    if (selectedUnitId === id && filtered.length > 0) {
      setSelectedUnitId(filtered[0].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Print Header */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
        <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية</p>
        <div className="flex justify-between items-center text-xs mt-3 px-2">
          <span>المؤسسة: {schoolName}</span>
          <span>الموسم الدراسي: {academicYear}</span>
          <span>{teacherName}</span>
        </div>
        <h1 className="text-xl font-black mt-4 underline">
          بطاقة الوحدة التعلمية (Unité d'Apprentissage - UA)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {currentUnit?.title} - {currentUnit?.gradeLevel} ({currentUnit?.term})
        </p>
      </div>

      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              الوحدات التعلمية (Unités d'Apprentissage - UA)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              هيكل الوحدة التعلمية وفق المقاربة بالكفاءات: الكفاءة الشاملة والختامية، مؤشرات الإنجاز، وجدول الحصص.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateNewClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء وحدة تعلمية جديدة</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الوحدة البيداغوجية</span>
            </button>
          </div>
        </div>

        {/* Units Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-100 pt-3">
          {learningUnits.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUnitId(u.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-right whitespace-nowrap ${
                selectedUnitId === u.id
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="block font-bold">{u.gradeLevel}</span>
              <span className="block text-[11px] opacity-80">{u.term} - {u.totalSessions} حصص</span>
            </button>
          ))}
        </div>
      </div>

      {currentUnit && (
        <div className="space-y-6">
          {/* Unit Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  {currentUnit.gradeLevel} · {currentUnit.term} · {currentUnit.totalSessions} حصص
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  {currentUnit.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => handleEditUnitClick(currentUnit)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل الكفاءات</span>
                </button>
                <button
                  onClick={() => handleDeleteUnit(currentUnit.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                  title="حذف الوحدة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Activities metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">النشاط الفردي:</span>
                <strong className="text-xs font-bold text-emerald-800">
                  {currentUnit.individualActivity}
                </strong>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <span className="font-semibold text-slate-800">الكفاءة الختامية: </span>
                  {currentUnit.terminalCompetenceIndividual}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">النشاط الجماعي:</span>
                <strong className="text-xs font-bold text-blue-800">
                  {currentUnit.collectiveActivity}
                </strong>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <span className="font-semibold text-slate-800">الكفاءة الختامية: </span>
                  {currentUnit.terminalCompetenceCollective}
                </p>
              </div>
            </div>

            {/* General Competence */}
            <div className="p-3.5 bg-indigo-50/40 rounded-lg border border-indigo-100">
              <span className="text-xs font-bold text-indigo-900 block mb-1">
                الكفاءة الشاملة للمستوى (Compétence Globale):
              </span>
              <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                {currentUnit.generalCompetence}
              </p>
            </div>

            {/* Performance Criteria */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                معايير ومؤشرات الكفاءة والنجاح (Critères & Indicateurs de Réussite):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentUnit.performanceCriteria.map((crit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Matrix of Sessions (مصفوفة الحصص التعلمية) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                مصفوفة وتدرج الحصص البيداغوجية للوحدة التعلمية ({currentUnit.sessions.length} حصص)
              </h4>
              <span className="text-xs text-slate-500">
                تشخيصية · تعلمية · إدماجية · تقويمية
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {currentUnit.sessions.map((sess) => {
                const isDiag = sess.type === 'تشخيصية';
                const isEval = sess.type === 'تقويمية';
                const isInteg = sess.type === 'إدماجية';

                return (
                  <div
                    key={sess.sessionNum}
                    className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-xs tabular-nums">
                        {sess.sessionNum}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-bold text-slate-900 text-sm">
                            {sess.title}
                          </h5>
                          <span
                            className={`px-2 py-0.5 rounded-sm font-bold text-[11px] ${
                              isDiag
                                ? 'bg-blue-100 text-blue-800'
                                : isEval
                                ? 'bg-rose-100 text-rose-800'
                                : isInteg
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {sess.type}
                          </span>

                          {sess.sessionNum === 4 && (
                            <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                              يبرمج الفرض خلال الحصة الرابعة (تدرج سبتمبر 2022)
                            </span>
                          )}

                          {sess.sessionNum === currentUnit.totalSessions && (
                            <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-purple-100 text-purple-900 border border-purple-300">
                              الاختبار في حصة التقويم التحصيلي (تدرج سبتمبر 2022)
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed max-w-2xl">
                          <strong className="text-slate-700">الهدف البيداغوجي: </strong>
                          {sess.goal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 no-print">
                      <button
                        onClick={() =>
                          onOpenLessonPlanForSession?.(currentUnit.id, sess.sessionNum)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                        title="فتح أو إعداد جذاذة الحصة"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-600" />
                        <span>جذاذة الحصة</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Signatures for Print */}
          <div className="hidden print:grid grid-cols-3 gap-6 text-center text-xs mt-12 pt-8 border-t border-slate-300">
            <div>
              <p className="font-bold">توقيع وختم الأستاذ</p>
              <div className="h-16"></div>
              <p className="text-slate-600">{teacherName}</p>
            </div>
            <div>
              <p className="font-bold">تأشيرة مدير المؤسسة</p>
              <div className="h-16"></div>
              <p className="text-slate-600">المؤسسة: {schoolName}</p>
            </div>
            <div>
              <p className="font-bold">تأشيرة مفتش التربية الوطنية</p>
              <div className="h-16"></div>
              <p className="text-slate-600">مفتشية التربية البدنية والرياضية</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create/Edit Learning Unit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingUnit ? 'تعديل الوحدة التعلمية' : 'إنشاء وحدة تعلمية جديدة (UA)'}
            </h3>

            <form onSubmit={handleSaveUnit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">عنوان الوحدة التعلمية</label>
                <input
                  type="text"
                  required
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المستوى الدراسي</label>
                  <select
                    value={unitLevel}
                    onChange={(e) => setUnitLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="السنة الأولى متوسط">السنة الأولى متوسط</option>
                    <option value="السنة الثانية متوسط">السنة الثانية متوسط</option>
                    <option value="السنة الثالثة متوسط">السنة الثالثة متوسط</option>
                    <option value="السنة الرابعة متوسط">السنة الرابعة متوسط (BEM)</option>
                    <option value="السنة الأولى ثانوي">السنة الأولى ثانوي</option>
                    <option value="السنة الثانية ثانوي">السنة الثانية ثانوي</option>
                    <option value="السنة الثالثة ثانوي">السنة الثالثة ثانوي (BAC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الفصل</label>
                  <select
                    value={unitTerm}
                    onChange={(e) => setUnitTerm(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="الفصل الأول">الفصل الأول</option>
                    <option value="الفصل الثاني">الفصل الثاني</option>
                    <option value="الفصل الثالث">الفصل الثالث</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">عدد الحصص (Séances)</label>
                  <input
                    type="number"
                    min="6"
                    max="14"
                    required
                    value={unitTotalSessions}
                    onChange={(e) => setUnitTotalSessions(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النشاط الفردي (ألعاب القوى / جمباز)</label>
                  <input
                    type="text"
                    required
                    value={unitIndivSport}
                    onChange={(e) => setUnitIndivSport(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النشاط الجماعي (كرة يد / سلة / طائرة)</label>
                  <input
                    type="text"
                    required
                    value={unitCollectSport}
                    onChange={(e) => setUnitCollectSport(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الكفاءة الشاملة (Compétence Globale)</label>
                <textarea
                  rows={2}
                  required
                  value={unitGeneralComp}
                  onChange={(e) => setUnitGeneralComp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الكفاءة الختامية للنشاط الفردي</label>
                <textarea
                  rows={2}
                  required
                  value={unitTermCompIndiv}
                  onChange={(e) => setUnitTermCompIndiv(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الكفاءة الختامية للنشاط الجماعي</label>
                <textarea
                  rows={2}
                  required
                  value={unitTermCompCollect}
                  onChange={(e) => setUnitTermCompCollect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">معايير ومؤشرات النجاح (سطر لكل معيار)</label>
                <textarea
                  rows={3}
                  required
                  value={unitCriteriaText}
                  onChange={(e) => setUnitCriteriaText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  حفظ الوحدة التعلمية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
