import React, { useState } from 'react';
import { Plus, Printer, Edit2, Trash2, Sparkles, BookOpen, Download } from 'lucide-react';
import { AnnualProgram, AnnualWeekPlan } from '../types';
import { OFFICIAL_CURRICULA, OFFICIAL_ANNUAL_PROGRESSIONS } from '../utils/curriculumStandards';
import { exportToCSV } from '../utils/storage';

interface AnnualPlanManagerProps {
  annualPrograms: AnnualProgram[];
  onUpdatePrograms: (programs: AnnualProgram[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const AnnualPlanManager: React.FC<AnnualPlanManagerProps> = ({
  annualPrograms,
  onUpdatePrograms,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    annualPrograms[0]?.id || ''
  );
  const [filterTerm, setFilterTerm] = useState<string>('all');
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [showCurriculumReferenceModal, setShowCurriculumReferenceModal] = useState(false);
  const [editingWeek, setEditingWeek] = useState<AnnualWeekPlan | null>(null);

  // New week state
  const [newWeekNumber, setNewWeekNumber] = useState(
    (annualPrograms.find((p) => p.id === selectedProgramId)?.schedule.length || 0) + 1
  );
  const [newTerm, setNewTerm] = useState<'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث'>('الفصل الأول');
  const [newMonth, setNewMonth] = useState('أكتوبر');
  const [newPeriod, setNewPeriod] = useState('الوحدة التعلمية الأولى');
  const [newIndivTitle, setNewIndivTitle] = useState('');
  const [newCollectTitle, setNewCollectTitle] = useState('');
  const [newNature, setNewNature] = useState<AnnualWeekPlan['natureOfWork']>('تعلم وبناء');

  const currentProgram =
    annualPrograms.find((p) => p.id === selectedProgramId) || annualPrograms[0];

  const handleSaveWeek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProgram) return;

    if (editingWeek) {
      const updatedSchedule = currentProgram.schedule.map((w) =>
        w.weekNumber === editingWeek.weekNumber
          ? {
              ...editingWeek,
              term: newTerm,
              month: newMonth,
              pedagogicalPeriod: newPeriod,
              individualActivityTitle: newIndivTitle,
              collectiveActivityTitle: newCollectTitle,
              natureOfWork: newNature,
            }
          : w
      );
      const updatedPrograms = annualPrograms.map((p) =>
        p.id === currentProgram.id ? { ...p, schedule: updatedSchedule } : p
      );
      onUpdatePrograms(updatedPrograms);
      setEditingWeek(null);
    } else {
      const newPlan: AnnualWeekPlan = {
        weekNumber: Number(newWeekNumber),
        term: newTerm,
        month: newMonth,
        pedagogicalPeriod: newPeriod,
        individualActivityTitle: newIndivTitle,
        collectiveActivityTitle: newCollectTitle,
        natureOfWork: newNature,
      };
      const updatedSchedule = [...currentProgram.schedule, newPlan].sort(
        (a, b) => a.weekNumber - b.weekNumber
      );
      const updatedPrograms = annualPrograms.map((p) =>
        p.id === currentProgram.id ? { ...p, schedule: updatedSchedule } : p
      );
      onUpdatePrograms(updatedPrograms);
    }

    setShowAddWeekModal(false);
    resetForm();
  };

  const handleEditWeekClick = (w: AnnualWeekPlan) => {
    setEditingWeek(w);
    setNewWeekNumber(w.weekNumber);
    setNewTerm(w.term);
    setNewMonth(w.month);
    setNewPeriod(w.pedagogicalPeriod);
    setNewIndivTitle(w.individualActivityTitle);
    setNewCollectTitle(w.collectiveActivityTitle);
    setNewNature(w.natureOfWork);
    setShowAddWeekModal(true);
  };

  const handleDeleteWeek = (weekNum: number) => {
    if (!confirm(`هل أنت متأكد من حذف الأسبوع ${weekNum}؟`)) return;
    const updatedSchedule = currentProgram.schedule.filter(
      (w) => w.weekNumber !== weekNum
    );
    const updatedPrograms = annualPrograms.map((p) =>
      p.id === currentProgram.id ? { ...p, schedule: updatedSchedule } : p
    );
    onUpdatePrograms(updatedPrograms);
  };

  const resetForm = () => {
    setEditingWeek(null);
    setNewWeekNumber((currentProgram?.schedule.length || 0) + 1);
    setNewIndivTitle('');
    setNewCollectTitle('');
    setNewPeriod('الوحدة التعلمية الأولى');
  };

  const filteredSchedule =
    currentProgram?.schedule.filter((item) => {
      if (filterTerm === 'all') return true;
      return item.term === filterTerm;
    }) || [];

  const handleExportCSV = () => {
    if (!currentProgram) return;
    const headers = ['الأسبوع', 'الفصل', 'الشهر', 'الفترة البيداغوجية', 'النشاط الفردي', 'النشاط الجماعي', 'طبيعة الحصة'];
    const rows = currentProgram.schedule.map((p) => [
      p.weekNumber,
      p.term,
      p.month,
      p.pedagogicalPeriod,
      p.individualActivityTitle,
      p.collectiveActivityTitle,
      p.natureOfWork,
    ]);
    exportToCSV(`التوزيع_السنوي_${currentProgram.gradeLevel}_${academicYear}`, headers, rows);
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
          المخطط والتوزيع السنوي لبناء التعلمات في التربية البدنية والرياضية
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          المستوى: {currentProgram?.gradeLevel} | النشاط الفردي: {currentProgram?.individualSport} | النشاط الجماعي: {currentProgram?.collectiveSport}
        </p>
      </div>

      {/* Screen Controls Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              المخطط والتوزيع السنوي للتعلمات (Programmation Annuelle)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              إعداد التوزيع البيداغوجي السنوي وفق المنهاج والوثيقة المرافقة والتدرجات السنوية الرسمية.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowCurriculumReferenceModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>دليل المنهاج والوثيقة المرافقة</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowAddWeekModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أسبوع بيداغوجي</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="تصدير التوزيع السنوي بصيغة Excel CSV"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>تصدير Excel (CSV)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التوزيع الرسمي</span>
            </button>
          </div>
        </div>

        {/* Level Selector & Term Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">المستوى:</span>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              {annualPrograms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.gradeLevel} ({p.academicYear})
                </option>
              ))}
            </select>
          </div>

          {/* Filter Term Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterTerm('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterTerm === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              كامل السنة ({currentProgram?.schedule.length || 0} أسبوع)
            </button>
            <button
              onClick={() => setFilterTerm('الفصل الأول')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterTerm === 'الفصل الأول'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الفصل الأول
            </button>
            <button
              onClick={() => setFilterTerm('الفصل الثاني')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterTerm === 'الفصل الثاني'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الفصل الثاني
            </button>
            <button
              onClick={() => setFilterTerm('الفصل الثالث')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterTerm === 'الفصل الثالث'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الفصل الثالث
            </button>
          </div>
        </div>

        {/* Selected Program Metadata Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-xs border border-slate-100">
          <div>
            <span className="text-slate-500">النشاط الفردي المعتمد:</span>{' '}
            <strong className="text-slate-800">{currentProgram?.individualSport}</strong>
          </div>
          <div>
            <span className="text-slate-500">النشاط الجماعي المعتمد:</span>{' '}
            <strong className="text-slate-800">{currentProgram?.collectiveSport}</strong>
          </div>
          <div>
            <span className="text-slate-500">الجمباز / نشاط داعم:</span>{' '}
            <strong className="text-slate-800">{currentProgram?.gymnasticsSport || 'الجمباز الأرضي'}</strong>
          </div>
        </div>
      </div>

      {/* Main Annual Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-14 text-center">الأسبوع</th>
                <th className="py-3 px-3 w-20">الفصل</th>
                <th className="py-3 px-3 w-20">الشهر</th>
                <th className="py-3 px-4 w-44">الفترة البيداغوجية</th>
                <th className="py-3 px-4">محتوى النشاط الفردي</th>
                <th className="py-3 px-4">محتوى النشاط الجماعي</th>
                <th className="py-3 px-3 w-32">طبيعة الحصة</th>
                <th className="py-3 px-3 w-20 text-center no-print">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredSchedule.map((plan) => {
                const isSpecial =
                  plan.natureOfWork === 'عطلة فصلية' ||
                  plan.natureOfWork === 'امتحانات واختبارات';
                const isDiag = plan.natureOfWork === 'تقويم تشخيصي';
                const isEval = plan.natureOfWork === 'إدماج وتقويم تحصيلي';

                return (
                  <tr
                    key={plan.weekNumber}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSpecial
                        ? 'bg-amber-50/40 text-amber-950 font-medium'
                        : isEval
                        ? 'bg-emerald-50/30'
                        : isDiag
                        ? 'bg-blue-50/30'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-800">
                      {plan.weekNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {plan.term}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {plan.month}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {plan.pedagogicalPeriod}
                    </td>
                    <td className="py-3 px-4 text-slate-700 leading-relaxed">
                      {plan.individualActivityTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-700 leading-relaxed">
                      {plan.collectiveActivityTitle}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-xs ${
                          plan.natureOfWork === 'تعلم وبناء'
                            ? 'text-slate-700 font-medium'
                            : plan.natureOfWork === 'تقويم تشخيصي'
                            ? 'text-blue-700 font-bold'
                            : plan.natureOfWork === 'إدماج وتقويم تحصيلي'
                            ? 'text-emerald-700 font-bold'
                            : plan.natureOfWork === 'عطلة فصلية'
                            ? 'text-amber-700 font-bold'
                            : 'text-purple-700 font-bold'
                        }`}
                      >
                        {plan.natureOfWork}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditWeekClick(plan)}
                          title="تعديل"
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteWeek(plan.weekNumber)}
                          title="حذف"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

      {/* Modal: Add/Edit Week */}
      {showAddWeekModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingWeek ? `تعديل الأسبوع ${editingWeek.weekNumber}` : 'إضافة أسبوع بيداغوجي جديد'}
            </h3>

            <form onSubmit={handleSaveWeek} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">رقم الأسبوع</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={newWeekNumber}
                    onChange={(e) => setNewWeekNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الفصل</label>
                  <select
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="الفصل الأول">الفصل الأول</option>
                    <option value="الفصل الثاني">الفصل الثاني</option>
                    <option value="الفصل الثالث">الفصل الثالث</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الشهر</label>
                  <input
                    type="text"
                    required
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الفترة البيداغوجية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الوحدة التعلمية الأولى (حصة 3)"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">طبيعة الحصة</label>
                <select
                  value={newNature}
                  onChange={(e) => setNewNature(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="تعلم وبناء">تعلم وبناء</option>
                  <option value="تقويم تشخيصي">تقويم تشخيصي</option>
                  <option value="إدماج وتقويم تحصيلي">إدماج وتقويم تحصيلي</option>
                  <option value="دخول وملاحظة وتوجيه">دخول وملاحظة وتوجيه</option>
                  <option value="عطلة فصلية">عطلة فصلية</option>
                  <option value="امتحانات واختبارات">امتحانات واختبارات</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">محتوى النشاط الفردي</label>
                <textarea
                  rows={2}
                  required
                  placeholder="مثال: ألعاب القوى: التدرب على الانطلاق المنخفض..."
                  value={newIndivTitle}
                  onChange={(e) => setNewIndivTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">محتوى النشاط الجماعي</label>
                <textarea
                  rows={2}
                  required
                  placeholder="مثال: كرة اليد: التمرير والاستقبال السريع في الحركة..."
                  value={newCollectTitle}
                  onChange={(e) => setNewCollectTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddWeekModal(false)}
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

      {/* Modal: Official Curriculum Standards & Companion Document */}
      {showCurriculumReferenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  التدرجات السنوية الرسمية للتعلمات · وزارة التربية الوطنية (سبتمبر 2022)
                </h3>
                <p className="text-xs text-slate-500">
                  المفتشية العامة للتربية الوطنية · مديرية التعليم الثانوي والتعليم المتوسط · المعايير المعتمدة لبناء وإرساء وإدماج وتقويم الموارد.
                </p>
              </div>
              <button
                onClick={() => setShowCurriculumReferenceModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Official Ministerial Progressions (September 2022) */}
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                <strong className="block font-black mb-0.5">ضوابط التنظيم البيداغوجي وفق التدرجات السنوية الرسمية:</strong>
                <p className="leading-relaxed">
                  تُبرمج كل وحدة تعلمية في وعاء زمني قدره <strong>8 ساعات</strong> (حصة تقويم تشخيصي + 6 حصص تعليمية + حصة تقويم تحصيلي). 
                  ويُبرمج <strong>الفرض المحروس وجوباً خلال الحصة الرابعة</strong>، بينما يُبرمج <strong>الاختبار في حصة التقويم التحصيلي</strong> (الحصة الثامنة).
                </p>
              </div>

              {Object.entries(OFFICIAL_ANNUAL_PROGRESSIONS).map(([key, prog]) => (
                <div key={key} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{prog.gradeTitle}</h4>
                      <span className="text-[11px] text-slate-500">{prog.academicDocDate}</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                      الطور {prog.cycle}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800">الكفاءة الختامية:</span>
                    <p className="text-slate-900 font-semibold mt-0.5 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                      «{prog.globalCompetence}»
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block">الأنشطة المبرمجة والكفاءات القاعدية:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {prog.activities.map((act, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900 font-bold text-[11px]">
                              {act.sportType === 'فردي' ? '🏃 ' : '⚽ '}
                              {act.sportName} (كفاءة قاعدية {act.baseCompetenceNumber})
                            </strong>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">
                              {act.durationHours} سا (الفرض في 4)
                            </span>
                          </div>
                          <p className="text-slate-700 text-[11px] leading-relaxed">
                            {act.baseCompetence}
                          </p>
                          <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                            <strong>التقويم التحصيلي:</strong> {act.evaluationMilestones.summativeEvaluationCriteria}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-slate-200 pt-3">
                <h4 className="font-bold text-slate-900 text-xs mb-2">توجيهات الوثيقة المرافقة لجميع المستويات:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(OFFICIAL_CURRICULA).map(([k, std]) => (
                    <div key={k} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <strong className="block text-slate-900">{std.gradeLevel}</strong>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{std.domainAthletics.terminalCompetence}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCurriculumReferenceModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                إغلاق المرجع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
