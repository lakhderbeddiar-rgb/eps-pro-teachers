import React, { useState } from 'react';
import { Plus, Printer, Edit2, Trash2, BookOpen, Calendar, Clock, CheckCircle, Users } from 'lucide-react';
import { JournalEntry, ClassGroup, AttendanceRecord } from '../types';

interface JournalManagerProps {
  journalEntries: JournalEntry[];
  classes: ClassGroup[];
  attendanceRecords: AttendanceRecord[];
  onUpdateJournal: (entries: JournalEntry[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const JournalManager: React.FC<JournalManagerProps> = ({
  journalEntries,
  classes,
  attendanceRecords,
  onUpdateJournal,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayOfWeek, setDayOfWeek] = useState('الأحد');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00');
  const [sportType, setSportType] = useState('ألعاب القوى + كرة اليد');
  const [sessionTopic, setSessionTopic] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [presentCount, setPresentCount] = useState(25);
  const [absentCount, setAbsentCount] = useState(0);
  const [exemptCount, setExemptCount] = useState(1);
  const [observations, setObservations] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('صفارة، كرات، أقماع، ميقاتي.');

  const handleEditClick = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setDate(entry.date || new Date().toISOString().split('T')[0]);
    setDayOfWeek(entry.dayOfWeek || 'الأحد');
    setClassId(entry.classId);
    setTimeSlot(entry.timeSlot);
    setSportType(entry.sportType);
    setSessionTopic(entry.sessionTopic);
    setLearningGoal(entry.learningGoal);
    setPresentCount(entry.presentCount);
    setAbsentCount(entry.absentCount);
    setExemptCount(entry.exemptCount);
    setObservations(entry.observations);
    setMaterialsUsed(entry.materialsUsed);
    setShowAddModal(true);
  };

  const handleCreateNewClick = () => {
    setEditingEntry(null);
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const daysArr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayName = daysArr[today.getDay()] || 'الأحد';

    setDate(dateStr);
    setDayOfWeek(dayName);
    setClassId(classes[0]?.id || '');
    setTimeSlot('08:00 - 10:00');
    setSportType('ألعاب القوى (سرعة) + كرة اليد');
    setSessionTopic('');
    setLearningGoal('');
    setPresentCount(24);
    setAbsentCount(0);
    setExemptCount(1);
    setObservations('سير طبيعي للحصة، حماس وتجاوب إيجابي، تم تطبيق قواعد الأمن والسلامة.');
    setMaterialsUsed('صفارة، 12 كرة، 16 قمعاً، ميقاتي يدوي.');
    setShowAddModal(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === classId);
    const className = targetClass ? targetClass.name : 'فوج ثانوي';

    if (editingEntry) {
      const updated = journalEntries.map((j) =>
        j.id === editingEntry.id
          ? {
              ...j,
              date,
              dayOfWeek,
              classId,
              className,
              timeSlot,
              sportType,
              sessionTopic,
              learningGoal,
              presentCount: Number(presentCount),
              absentCount: Number(absentCount),
              exemptCount: Number(exemptCount),
              observations,
              materialsUsed,
            }
          : j
      );
      onUpdateJournal(updated);
    } else {
      const newEntry: JournalEntry = {
        id: `j-${Date.now()}`,
        date,
        dayOfWeek,
        classId,
        className,
        timeSlot,
        sportType,
        sessionTopic,
        learningGoal,
        presentCount: Number(presentCount),
        absentCount: Number(absentCount),
        exemptCount: Number(exemptCount),
        observations,
        materialsUsed,
      };
      onUpdateJournal([newEntry, ...journalEntries]);
    }
    setShowAddModal(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (!confirm('هل ترغب في حذف هذا السجل من الدفتر اليومي؟')) return;
    onUpdateJournal(journalEntries.filter((j) => j.id !== id));
  };

  const filteredEntries = journalEntries.filter((j) => {
    if (selectedClassFilter === 'all') return true;
    return j.classId === selectedClassFilter;
  });

  return (
    <div className="space-y-6">
      {/* Official Print Header */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
        <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية - مديرية التعليم الثانوي</p>
        <div className="flex justify-between items-center text-xs mt-3 px-2">
          <span>المؤسسة: {schoolName}</span>
          <span>الموسم الدراسي: {academicYear}</span>
          <span>{teacherName}</span>
        </div>
        <h1 className="text-xl font-black mt-4 underline">
          الدفتر اليومي للأستاذ (Cahier Journal de l&apos;Enseignant)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          متابعة وتوثيق الحصص اليومية البيداغوجية لمادة التربية البدنية والرياضية
        </p>
      </div>

      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>الدفتر اليومي للأستاذ (Cahier Journal)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              التوثيق اليومي للحصص الميدانية: النشاط، موضوع الحصة، الهدف التعلمي، إحصاء الحضور، والملاحظات البيداغوجية.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateNewClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>تدوين حصة جديدة بالدفتر</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة صفحات الدفتر اليومي</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-600">تصفية حسب القسم:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
          >
            <option value="all">جميع الأقسام والأفواج ({journalEntries.length} حصة)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Journal Cards List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            لا توجد حصص مسجلة في الدفتر اليومي حالياً. انقر على &quot;تدوين حصة جديدة بالدفتر&quot; للبدء.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
            >
              {/* Header line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-bold text-xs">
                    {entry.dayOfWeek} {entry.date}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                    {entry.className}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{entry.timeSlot}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => handleEditClick(entry)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                    title="تعديل السجل"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Pedagogical Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <div>
                    <span className="text-slate-500 font-medium block">النشاط وموضوع الحصة:</span>
                    <strong className="text-slate-900 text-sm block">
                      {entry.sportType} · {entry.sessionTopic}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">الهدف التعلمي / الإجرائي:</span>
                    <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {entry.learningGoal}
                    </p>
                  </div>

                  {entry.observations && (
                    <div>
                      <span className="text-slate-500 font-medium block">ملاحظات وتقييم سير الحصة:</span>
                      <p className="text-slate-600 leading-relaxed bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                        {entry.observations}
                      </p>
                    </div>
                  )}
                </div>

                {/* Side Stats & Materials */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">إحصاء الحضور:</span>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-white p-1.5 rounded-md border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">حاضر</span>
                        <strong className="text-emerald-700 font-bold tabular-nums text-xs">{entry.presentCount}</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded-md border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">غائب</span>
                        <strong className="text-rose-700 font-bold tabular-nums text-xs">{entry.absentCount}</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded-md border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">معفى</span>
                        <strong className="text-blue-700 font-bold tabular-nums text-xs">{entry.exemptCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">العتاد والوسائل:</span>
                    <p className="text-slate-600">{entry.materialsUsed || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Signatures for Print */}
      <div className="hidden print:grid grid-cols-2 gap-12 text-center text-xs mt-12 pt-8 border-t border-slate-300">
        <div>
          <p className="font-bold">توقيع أستاذ المادة</p>
          <div className="h-14"></div>
          <p className="text-slate-600">{teacherName}</p>
        </div>
        <div>
          <p className="font-bold">تأشيرة السيد مفتش التربية الوطنية للتعليم الثانوي</p>
          <div className="h-14"></div>
          <p className="text-slate-600">مفتشية التربية البدنية والرياضية</p>
        </div>
      </div>

      {/* Modal: Add/Edit Entry */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingEntry ? 'تعديل تدوينة الدفتر اليومي' : 'تدوين حصة بالدفتر اليومي'}
            </h3>

            <form onSubmit={handleSaveEntry} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">اليوم</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    <option value="الأحد">الأحد</option>
                    <option value="الاثنين">الاثنين</option>
                    <option value="الثلاثاء">الثلاثاء</option>
                    <option value="الأربعاء">الأربعاء</option>
                    <option value="الخميس">الخميس</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">التوقيت</label>
                  <input
                    type="text"
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الفوج / القسم</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النشاط الممارس</label>
                  <input
                    type="text"
                    required
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">موضوع الحصة ورقمها</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الحصة 3: الانطلاق المنخفض والتسارع + التمرير السريع"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الهدف التعلمي / الإجرائي</label>
                <textarea
                  rows={2}
                  required
                  placeholder="الهدف البيداغوجي للحصة..."
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">عدد الحاضرين</label>
                  <input
                    type="number"
                    min="0"
                    value={presentCount}
                    onChange={(e) => setPresentCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">عدد الغائبين</label>
                  <input
                    type="number"
                    min="0"
                    value={absentCount}
                    onChange={(e) => setAbsentCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">عدد المعفيين</label>
                  <input
                    type="number"
                    min="0"
                    value={exemptCount}
                    onChange={(e) => setExemptCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ملاحظات حول سير الحصة والمستوى</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات بيداغوجية، سلوكية، صعوبات وحلول..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">العتاد والوسائل المستعملة</label>
                <input
                  type="text"
                  value={materialsUsed}
                  onChange={(e) => setMaterialsUsed(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
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
                  حفظ بالدفتر اليومي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
