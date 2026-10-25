import React, { useState } from 'react';
import { Plus, Printer, Edit2, Trash2, Calendar as CalendarIcon, Award, Bell } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarManagerProps {
  calendarEvents: CalendarEvent[];
  onUpdateEvents: (events: CalendarEvent[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const CalendarManager: React.FC<CalendarManagerProps> = ({
  calendarEvents,
  onUpdateEvents,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEvent['type']>('holiday');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const handleEditClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setType(event.type);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setDescription(event.description || '');
    setShowAddModal(true);
  };

  const handleCreateNewClick = () => {
    setEditingEvent(null);
    setTitle('');
    setType('exam');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setShowAddModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      const updated = calendarEvents.map((ev) =>
        ev.id === editingEvent.id
          ? { ...ev, title, type, startDate, endDate, description }
          : ev
      );
      onUpdateEvents(updated);
    } else {
      const newEv: CalendarEvent = {
        id: `cal-${Date.now()}`,
        title,
        type,
        startDate,
        endDate,
        description,
      };
      onUpdateEvents([...calendarEvents, newEv]);
    }
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموعد؟')) return;
    onUpdateEvents(calendarEvents.filter((ev) => ev.id !== id));
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
          رزنامة العطل المدرسية والامتحانات الرسمية (طور ثانوي)
        </h1>
      </div>

      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              <span>رزنامة العطل المدرسية والامتحانات (School Calendar)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              متابعة العطل الرسمية، مواعيد الفروض والاختبارات الفصلية، وامتحان التربية البدنية لشهادة البكالوريا (BAC EPS).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateNewClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة موعد / عطلة</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الرزنامة الرسمية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calendarEvents.map((ev) => {
          const isHoliday = ev.type === 'holiday';
          const isBac = ev.type === 'bac_sport';

          return (
            <div
              key={ev.id}
              className={`p-5 rounded-2xl border shadow-xs space-y-3 transition-all ${
                isHoliday
                  ? 'bg-amber-50/40 border-amber-200'
                  : isBac
                  ? 'bg-purple-50/50 border-purple-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                    isHoliday
                      ? 'bg-amber-100 text-amber-900'
                      : isBac
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-blue-100 text-blue-900'
                  }`}
                >
                  {isHoliday && 'عطلة مدرسية'}
                  {isBac && 'امتحان البكالوريا الرياضية (BAC)'}
                  {ev.type === 'exam' && 'فروض واختبارات فصلية'}
                  {ev.type === 'administrative' && 'موعد إداري'}
                </span>

                <div className="flex items-center gap-1 no-print">
                  <button
                    onClick={() => handleEditClick(ev)}
                    className="p-1 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{ev.title}</h3>
                {ev.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {ev.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="tabular-nums">من: {ev.startDate}</span>
                </div>
                <div className="tabular-nums">إلى: {ev.endDate}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add/Edit Event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingEvent ? 'تعديل موعد الرزنامة' : 'إضافة موعد / عطلة جديدة'}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">عنوان الحدث / العطلة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عطلة الشتاء أو امتحان البكالوريا..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">النوع</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="holiday">عطلة مدرسية</option>
                  <option value="exam">فروض واختبارات فصلية</option>
                  <option value="bac_sport">امتحان البكالوريا الرياضية (BAC EPS)</option>
                  <option value="administrative">موعد إداري / مجلس أقسام</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ البداية</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ النهاية</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">وصف أو تفاصيل إضافية</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات وتوجيهات..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  حفظ الموعد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
