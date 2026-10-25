import React, { useState } from 'react';
import { Printer, Check, X, ShieldAlert, AlertTriangle, CheckCheck, Clock, User, HeartPulse, UserX } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, ClassGroup, Student, AttendanceDetail } from '../types';
import { isExemptionActive } from '../utils/storage';

interface AttendanceManagerProps {
  classes: ClassGroup[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  onOpenStudentProfile?: (student: Student) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  classes,
  students,
  attendanceRecords,
  onUpdateAttendance,
  onOpenStudentProfile,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [topic, setTopic] = useState('حصة تدريبية: ألعاب القوى والرياضات الجماعية');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === currentClass?.id);

  // Time slot from class schedule
  const defaultSlot = currentClass?.schedule?.[0]
    ? `${currentClass.schedule[0].day} ${currentClass.schedule[0].startTime} - ${currentClass.schedule[0].endTime}`
    : 'الأحد 08:00 - 10:00';
  const [timeSlot, setTimeSlot] = useState(defaultSlot);

  // Find or initialize today's record
  const existingRecord = attendanceRecords.find(
    (r) => r.classId === currentClass?.id && r.date === sessionDate
  );

  const [currentStatuses, setCurrentStatuses] = useState<{ [id: string]: AttendanceDetail }>({});

  React.useEffect(() => {
    if (existingRecord) {
      const parsed: { [id: string]: AttendanceDetail } = {};
      Object.entries(existingRecord.records || {}).forEach(([id, val]) => {
        if (typeof val === 'string') {
          parsed[id] = { status: val as AttendanceStatus };
        } else if (val && typeof val === 'object') {
          parsed[id] = val as AttendanceDetail;
        }
      });
      setCurrentStatuses(parsed);
      if (existingRecord.topic) setTopic(existingRecord.topic);
      if (existingRecord.timeSlot) setTimeSlot(existingRecord.timeSlot);
    } else {
      const initial: { [id: string]: AttendanceDetail } = {};
      classStudents.forEach((s) => {
        const exemption = isExemptionActive(s, sessionDate);
        if (exemption.isActive) {
          initial[s.id] = {
            status: 'exempt',
            note: exemption.statusLabel,
          };
        } else {
          initial[s.id] = { status: 'present_kit' };
        }
      });
      setCurrentStatuses(initial);
    }
  }, [selectedClassId, sessionDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus, note?: string) => {
    const prev = currentStatuses[studentId] || { status: 'present_kit' };
    const updated: AttendanceDetail = {
      ...prev,
      status,
      note: note !== undefined ? note : prev.note,
    };
    const newStatuses = { ...currentStatuses, [studentId]: updated };
    setCurrentStatuses(newStatuses);
    saveRecord(newStatuses);
  };

  const handleNoteChange = (studentId: string, noteText: string) => {
    const prev = currentStatuses[studentId] || { status: 'present_kit' };
    const updated: AttendanceDetail = { ...prev, note: noteText };
    const newStatuses = { ...currentStatuses, [studentId]: updated };
    setCurrentStatuses(newStatuses);
    saveRecord(newStatuses);
  };

  const handleMarkAllPresentKit = () => {
    const updated: { [id: string]: AttendanceDetail } = {};
    classStudents.forEach((s) => {
      const exemption = isExemptionActive(s, sessionDate);
      if (exemption.isActive) {
        updated[s.id] = { status: 'exempt', note: exemption.statusLabel };
      } else {
        updated[s.id] = { status: 'present_kit' };
      }
    });
    setCurrentStatuses(updated);
    saveRecord(updated);
  };

  const saveRecord = (statuses: { [id: string]: AttendanceDetail }) => {
    if (!currentClass) return;
    const recordId = existingRecord ? existingRecord.id : `att-${Date.now()}`;
    const newRecord: AttendanceRecord = {
      id: recordId,
      classId: currentClass.id,
      date: sessionDate,
      timeSlot,
      topic,
      records: statuses,
    };

    const otherRecords = attendanceRecords.filter(
      (r) => !(r.classId === currentClass.id && r.date === sessionDate)
    );
    onUpdateAttendance([...otherRecords, newRecord]);
  };

  // Stats
  const stats = React.useMemo(() => {
    let presentKit = 0;
    let presentNoKit = 0;
    let late = 0;
    let exempt = 0;
    let sick = 0;
    let absent = 0;

    classStudents.forEach((s) => {
      const st = currentStatuses[s.id]?.status || 'present_kit';
      if (st === 'present_kit') presentKit++;
      else if (st === 'present_no_kit') presentNoKit++;
      else if (st === 'late') late++;
      else if (st === 'exempt') exempt++;
      else if (st === 'sick_during_session') sick++;
      else if (st === 'absent' || st === 'absent_justified') absent++;
    });

    return { presentKit, presentNoKit, late, exempt, sick, absent };
  }, [classStudents, currentStatuses]);

  return (
    <div className="space-y-6">
      {/* Official Print Header */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
        <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية - التعليم الثانوي</p>
        <div className="flex justify-between items-center text-xs mt-3 px-2">
          <span>المؤسسة: {schoolName}</span>
          <span>الموسم الدراسي: {academicYear}</span>
          <span>{teacherName}</span>
        </div>
        <h1 className="text-xl font-black mt-4 underline">
          سجل الحضور والمواظبة الأسبوعي والزي الرياضي
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          القسم: {currentClass?.name} ({currentClass?.gradeLevel}) · التاريخ: {sessionDate} · التوقيت: {timeSlot}
        </p>
      </div>

      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              سجل الحضور والمواظبة والزي الرياضي (Attendance Tracker)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              متابعة الحضور بالبدلة، بدون بدلة، التأخر، الإعفاءات بتاريخ من... إلى...، والمرض أثناء الحصة.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleMarkAllPresentKit}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>الجميع حاضر بالبدلة</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة ورقة الحضور</span>
            </button>
          </div>
        </div>

        {/* Filters and Date Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">القسم التربوي</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
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
            <label className="block text-slate-600 font-semibold mb-1">تاريخ الحصة الأسبوعية</label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">توقيت الحصة (جدول التوقيت)</label>
            <input
              type="text"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">موضوع ونشاط الحصة</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </div>

        {/* Quick Attendance Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 text-xs text-center">
          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="text-[11px] text-emerald-800 block">حاضر بالبدلة</span>
            <strong className="text-emerald-950 font-bold tabular-nums text-sm">{stats.presentKit}</strong>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
            <span className="text-[11px] text-amber-800 block">بدون بدلة</span>
            <strong className="text-amber-950 font-bold tabular-nums text-sm">{stats.presentNoKit}</strong>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
            <span className="text-[11px] text-purple-800 block">متأخر</span>
            <strong className="text-purple-950 font-bold tabular-nums text-sm">{stats.late}</strong>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
            <span className="text-[11px] text-blue-800 block">معفى طبياً</span>
            <strong className="text-blue-950 font-bold tabular-nums text-sm">{stats.exempt}</strong>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg border border-orange-100">
            <span className="text-[11px] text-orange-800 block">مريض بالحصة</span>
            <strong className="text-orange-950 font-bold tabular-nums text-sm">{stats.sick}</strong>
          </div>
          <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
            <span className="text-[11px] text-rose-800 block">غائب</span>
            <strong className="text-rose-950 font-bold tabular-nums text-sm">{stats.absent}</strong>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 w-12 text-center">الرقم</th>
              <th className="py-3 px-4 w-48">اسم ولقب التلميذ</th>
              <th className="py-3 px-3 w-44">الإعفاء الطبي (من - إلى)</th>
              <th className="py-3 px-4 text-center">حالة الحضور والانضباط</th>
              <th className="py-3 px-4 w-52 no-print">ملاحظات / دقائق التأخر</th>
              <th className="py-3 px-3 w-20 text-center no-print">الملف</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classStudents.map((student, idx) => {
              const detail = currentStatuses[student.id] || { status: 'present_kit' };
              const exemption = isExemptionActive(student, sessionDate);

              return (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 text-center tabular-nums font-bold text-slate-600">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <button
                      onClick={() => onOpenStudentProfile && onOpenStudentProfile(student)}
                      className="hover:underline text-right"
                    >
                      {student.firstName} {student.lastName}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    {student.medicalExemption?.isExempt ? (
                      <div className="text-[11px] leading-tight">
                        <span className={`font-bold block ${exemption.badgeColor}`}>
                          {student.medicalExemption.exemptionType || 'معفى'}
                        </span>
                        <span className="text-slate-500 tabular-nums">
                          من: {student.medicalExemption.startDate || 'البداية'} إلى: {student.medicalExemption.endDate || 'النهاية'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">لائق بدنياً</span>
                    )}
                  </td>

                  {/* Multi-Status Selector Buttons */}
                  <td className="py-2 px-4">
                    <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 rounded-lg no-print flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present_kit')}
                        className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                          detail.status === 'present_kit'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        حاضر بالبدلة
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present_no_kit')}
                        className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                          detail.status === 'present_no_kit'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        بدون بدلة
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                          detail.status === 'late'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        متأخر
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'exempt')}
                        className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                          detail.status === 'exempt'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        معفى
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'sick_during_session')}
                        className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                          detail.status === 'sick_during_session'
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        مريض بالحصة
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                          detail.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        غائب
                      </button>
                    </div>

                    {/* Print Status Display */}
                    <div className="hidden print:block text-center font-bold">
                      {detail.status === 'present_kit' && 'حاضر بالبدلة'}
                      {detail.status === 'present_no_kit' && 'حاضر (بدون بدلة)'}
                      {detail.status === 'late' && 'متأخر'}
                      {detail.status === 'exempt' && 'معفى طبياً'}
                      {detail.status === 'sick_during_session' && 'مريض أثناء الحصة'}
                      {detail.status === 'absent' && 'غـــائب'}
                      {detail.status === 'absent_justified' && 'غائب بمبرر'}
                    </div>
                  </td>

                  {/* Notes / Late Minutes Input */}
                  <td className="py-2 px-4 no-print">
                    <input
                      type="text"
                      placeholder={detail.status === 'late' ? 'دقائق التأخر أو سبب...' : 'ملاحظة...'}
                      value={detail.note || ''}
                      onChange={(e) => handleNoteChange(student.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                    />
                  </td>

                  {/* Open Profile Button */}
                  <td className="py-2 px-3 text-center no-print">
                    <button
                      onClick={() => onOpenStudentProfile && onOpenStudentProfile(student)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      title="عرض الملف الفردي الكامل"
                    >
                      <User className="w-4 h-4 text-indigo-600" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Official Signatures for Print */}
      <div className="hidden print:grid grid-cols-2 gap-12 text-center text-xs mt-12 pt-8 border-t border-slate-300">
        <div>
          <p className="font-bold">توقيع أستاذ التربية البدنية والرياضية</p>
          <div className="h-14"></div>
          <p className="text-slate-600">{teacherName}</p>
        </div>
        <div>
          <p className="font-bold">تأشيرة مستشار التربية / مدير الثانوية</p>
          <div className="h-14"></div>
          <p className="text-slate-600">المؤسسة: {schoolName}</p>
        </div>
      </div>
    </div>
  );
};
