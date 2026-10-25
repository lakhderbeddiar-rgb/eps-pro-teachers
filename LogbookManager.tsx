import React, { useState } from 'react';
import { Plus, Printer, CheckCircle2, Clock, AlertTriangle, Edit2, Trash2, Calendar, FileText } from 'lucide-react';
import { ClassGroup, LogbookEntry } from '../types';

interface LogbookManagerProps {
  classes: ClassGroup[];
  logbookEntries: LogbookEntry[];
  onUpdateLogbook: (entries: LogbookEntry[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const LogbookManager: React.FC<LogbookManagerProps> = ({
  classes,
  logbookEntries,
  onUpdateLogbook,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogbookEntry | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weekNumber, setWeekNumber] = useState(
    logbookEntries.length > 0 ? Math.max(...logbookEntries.map((l) => l.weekNumber)) + 1 : 1
  );
  const [sessionNumber, setSessionNumber] = useState(1);
  const [sportType, setSportType] = useState('كرة اليد وألعاب القوى');
  const [objectiveTaught, setObjectiveTaught] = useState('');
  const [observations, setObservations] = useState('');
  const [status, setStatus] = useState<LogbookEntry['status']>('منجزة');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const classEntries = logbookEntries
    .filter((e) => e.classId === currentClass?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const completedCount = classEntries.filter((e) => e.status === 'منجزة').length;
  const progressPercent = Math.min(100, Math.round((completedCount / 32) * 100));

  const handleEditClick = (entry: LogbookEntry) => {
    setEditingEntry(entry);
    setDate(entry.date);
    setWeekNumber(entry.weekNumber);
    setSessionNumber(entry.sessionNumber);
    setSportType(entry.sportType);
    setObjectiveTaught(entry.objectiveTaught);
    setObservations(entry.observations);
    setStatus(entry.status);
    setShowAddModal(true);
  };

  const handleCreateNewClick = () => {
    setEditingEntry(null);
    setDate(new Date().toISOString().split('T')[0]);
    setWeekNumber((classEntries.length % 32) + 1);
    setSessionNumber(classEntries.length + 1);
    setSportType('كرة اليد / ألعاب القوى');
    setObjectiveTaught('');
    setObservations('سارت الحصة في ظروف عادية مع استجابة جيدة من التلاميذ.');
    setStatus('منجزة');
    setShowAddModal(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClass) return;

    if (editingEntry) {
      const updated = logbookEntries.map((l) =>
        l.id === editingEntry.id
          ? {
              ...l,
              date,
              weekNumber: Number(weekNumber),
              sessionNumber: Number(sessionNumber),
              sportType,
              objectiveTaught,
              observations,
              status,
            }
          : l
      );
      onUpdateLogbook(updated);
    } else {
      const newEntry: LogbookEntry = {
        id: `log-${Date.now()}`,
        classId: currentClass.id,
        date,
        weekNumber: Number(weekNumber),
        sessionNumber: Number(sessionNumber),
        sportType,
        objectiveTaught,
        observations,
        status,
      };
      onUpdateLogbook([...logbookEntries, newEntry]);
    }
    setShowAddModal(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القيد؟')) return;
    onUpdateLogbook(logbookEntries.filter((l) => l.id !== id));
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
          دفتر النصوص الرقمي ومتابعة تنفيذ المنهاج البيداغوجي
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          الفوج: {currentClass?.name} ({currentClass?.gradeLevel}) · الحصص المنجزة: {completedCount} حصص ({progressPercent}%)
        </p>
      </div>

      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              دفتر النصوص الرقمي ومتابعة تنفيذ التعلمات (Cahier de Textes)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تدوين الحصص المنجزة فعلياً بالميدان، نسبة تقدم المنهاج السنوي، والملاحظات البيداغوجية.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateNewClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل حصة جديدة بالدفتر</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة دفتر النصوص</span>
            </button>
          </div>
        </div>

        {/* Class Selector & Progress Gauge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">اختيار الفوج التربوي</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.gradeLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Progress Bar */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-center space-y-1.5">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>نسبة تنفيذ المنهاج السنوي:</span>
              <span className="text-emerald-700 tabular-nums">
                {completedCount} / 32 حصة ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logbook Entries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 w-28">التاريخ</th>
              <th className="py-3 px-3 w-16 text-center">الأسبوع</th>
              <th className="py-3 px-3 w-16 text-center">الحصة</th>
              <th className="py-3 px-3 w-36">النشاط الرياضي</th>
              <th className="py-3 px-4">الهدف والمحتوى البيداغوجي المنجز</th>
              <th className="py-3 px-4">الملاحظات والصعوبات والحلول</th>
              <th className="py-3 px-3 w-24 text-center">الحالة</th>
              <th className="py-3 px-3 w-20 text-center no-print">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  لم يتم تدوين حصص بعد لهذا الفوج. انقر على &quot;تسجيل حصة جديدة بالدفتر&quot;.
                </td>
              </tr>
            ) : (
              classEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-800 font-semibold whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums font-bold text-slate-600">
                    {entry.weekNumber}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums font-bold text-slate-900">
                    {entry.sessionNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {entry.sportType}
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed font-medium">
                    {entry.objectiveTaught}
                  </td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">
                    {entry.observations || '—'}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-sm font-bold text-[11px] ${
                        entry.status === 'منجزة'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.status === 'مؤجلة'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center no-print">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEditClick(entry)}
                        className="p-1 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                        title="تعديل"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Official Signatures for Print */}
      <div className="hidden print:grid grid-cols-3 gap-6 text-center text-xs mt-12 pt-8 border-t border-slate-300">
        <div>
          <p className="font-bold">توقيع أستاذ المادة</p>
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

      {/* Modal: Add/Edit Logbook Entry */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingEntry ? 'تعديل تسجيل الحصة' : 'تسجيل حصة منجزة في دفتر النصوص'}
            </h3>

            <form onSubmit={handleSaveEntry} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ الحصة</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">رقم الأسبوع</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    required
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">رقم الحصة</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={sessionNumber}
                    onChange={(e) => setSessionNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النشاط الرياضي</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كرة اليد"
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">حالة الحصة</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    <option value="منجزة">منجزة</option>
                    <option value="مؤجلة">مؤجلة (سوء أحوال جوية / مانع)</option>
                    <option value="مستدركة">مستدركة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الهدف والمحتوى البيداغوجي المنجز</label>
                <textarea
                  rows={2}
                  required
                  placeholder="مثال: التمرير والاستقبال السريع في الحركة مع تغيير الاتجاه والتصويب..."
                  value={objectiveTaught}
                  onChange={(e) => setObjectiveTaught(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الملاحظات والصعوبات والحلول</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات حول تجاوب التلاميذ أو الأدوات..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
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
                  حفظ في الدفتر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
