import React, { useState } from 'react';
import { Plus, Printer, AlertTriangle, ShieldAlert, CheckCircle2, Trash2, Edit2, FileText, Search, User, Clock, MapPin, FileDown, X } from 'lucide-react';
import { AccidentReport, ClassGroup, Student } from '../types';

interface AccidentReportManagerProps {
  accidentReports: AccidentReport[];
  classes: ClassGroup[];
  students: Student[];
  onUpdateAccidentReports: (reports: AccidentReport[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const AccidentReportManager: React.FC<AccidentReportManagerProps> = ({
  accidentReports,
  classes,
  students,
  onUpdateAccidentReports,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    accidentReports[0]?.id || ''
  );
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [editingReport, setEditingReport] = useState<AccidentReport | null>(null);

  // Form states
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [accidentDate, setAccidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [accidentTime, setAccidentTime] = useState('09:30');
  const [location, setLocation] = useState('ملعب كرة اليد الخارجي');
  const [activityInvolved, setActivityInvolved] = useState('مباراة تطبيقية في كرة اليد');
  const [injuryNature, setInjuryNature] = useState('التواء في الكاحل الأيمن مع انتفاخ');
  const [accidentCircumstances, setAccidentCircumstances] = useState('');
  const [firstAidGiven, setFirstAidGiven] = useState('إيقاف النشاط فورا، وضع كمادات ثلج، ورباط ضاغط.');
  const [evacuationAction, setEvacuationAction] = useState('إشعار إدارة المؤسسة، الاتصال بولي الأمر، ونقل التلميذ للعيادة.');
  const [witnesses, setWitnesses] = useState('');
  const [status, setStatus] = useState<AccidentReport['status']>('مسجل ومبلغ');

  const currentReport =
    accidentReports.find((r) => r.id === selectedReportId) || accidentReports[0];

  const classStudents = students.filter((s) => s.classId === selectedClassId);

  const handleCreateNewClick = () => {
    setEditingReport(null);
    const firstCls = classes[0];
    const clsStudents = students.filter((s) => s.classId === firstCls?.id);
    setSelectedClassId(firstCls?.id || '');
    setSelectedStudentId(clsStudents[0]?.id || '');
    setAccidentDate(new Date().toISOString().split('T')[0]);
    setAccidentTime('10:15');
    setLocation('ملعب كرة اليد الخارجي');
    setActivityInvolved('حصة تدريبية موجهة');
    setInjuryNature('');
    setAccidentCircumstances('');
    setFirstAidGiven('إيقاف النشاط فورا، وضع كمادات ثلج لتخفيف الورم، وتثبيت العضو المصاب.');
    setEvacuationAction('إشعار الإدارة فورا والاتصال بولي التلميذ.');
    setWitnesses('التلميذ: ');
    setStatus('مسجل ومبلغ');
    setShowModal(true);
  };

  const handleEditClick = (report: AccidentReport) => {
    setEditingReport(report);
    setSelectedClassId(report.classId);
    setSelectedStudentId(report.studentId);
    setAccidentDate(report.accidentDate);
    setAccidentTime(report.accidentTime);
    setLocation(report.location);
    setActivityInvolved(report.activityInvolved);
    setInjuryNature(report.injuryNature);
    setAccidentCircumstances(report.accidentCircumstances);
    setFirstAidGiven(report.firstAidGiven);
    setEvacuationAction(report.evacuationAction);
    setWitnesses(report.witnesses);
    setStatus(report.status);
    setShowModal(true);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    const cls = classes.find((c) => c.id === selectedClassId);

    const reportObj: AccidentReport = {
      id: editingReport ? editingReport.id : `acc-${Date.now()}`,
      studentId: selectedStudentId,
      studentName: st ? `${st.firstName} ${st.lastName}` : 'تلميذ',
      classId: selectedClassId,
      className: cls ? cls.name : 'فوج',
      accidentDate,
      accidentTime,
      location,
      activityInvolved,
      injuryNature,
      accidentCircumstances,
      firstAidGiven,
      evacuationAction,
      witnesses,
      status,
    };

    if (editingReport) {
      const updated = accidentReports.map((r) =>
        r.id === editingReport.id ? reportObj : r
      );
      onUpdateAccidentReports(updated);
    } else {
      onUpdateAccidentReports([reportObj, ...accidentReports]);
      setSelectedReportId(reportObj.id);
    }
    setShowModal(false);
  };

  const handleDeleteReport = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقرير؟')) return;
    const filtered = accidentReports.filter((r) => r.id !== id);
    onUpdateAccidentReports(filtered);
    if (selectedReportId === id && filtered.length > 0) {
      setSelectedReportId(filtered[0].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>تقارير وتصريحات الحوادث المدرسية الرياضية (Rapport d&apos;Accident)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              توثيق رسمي وإداري لأي إصابة أو حادث ميداني أثناء ممارسة حصص التربية البدنية والرياضية للضمان المدرسي والإدارة.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateNewClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>تحرير تقرير حادث جديد</span>
            </button>

            <button
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="تصدير التصريح الرسمي كملف PDF للطباعة والتأمين المدرسي"
            >
              <FileDown className="w-4 h-4 text-rose-600" />
              <span>تصدير تصريح الحادث إلى PDF (A4)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير</span>
            </button>
          </div>
        </div>

        {/* Existing Reports List Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-100 pt-3">
          {accidentReports.length === 0 ? (
            <span className="text-xs text-slate-400 py-2">لا توجد حوادث مسجلة (الحمد لله على سلامة التلاميذ).</span>
          ) : (
            accidentReports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-right whitespace-nowrap ${
                  selectedReportId === report.id
                    ? 'bg-rose-50 text-rose-950 border-rose-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">{report.studentName}</span>
                  <span className="text-[10px] text-slate-500">({report.accidentDate})</span>
                </div>
                <span className="block text-[11px] opacity-80 mt-0.5 truncate max-w-[200px]">
                  {report.injuryNature}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {currentReport && (
        <div className="bg-white rounded-2xl border-2 border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 print:border-2 print:border-black print:p-6">
          {/* Official Ministerial Header for Accident Declaration */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية</p>
            <div className="flex justify-between items-center text-xs mt-3 px-2">
              <span>مديرية التربية لولاية: ..............................</span>
              <span>المؤسسة: {schoolName}</span>
              <span>الموسم الدراسي: {academicYear}</span>
            </div>
            <div className="inline-block mt-4 px-6 py-1.5 bg-rose-600 text-white rounded-lg print:bg-black print:text-white">
              <h1 className="text-lg font-black tracking-wide">
                تصريح بوقوع حادث مدرسي أثناء حصة التربية البدنية والرياضية
              </h1>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              (يُحرر هذا التقرير فورا من طرف أستاذ المادة ويُسلم لإدارة المؤسسة ومصلحة التأمين المدرسي)
            </p>
          </div>

          <div className="flex justify-between items-center no-print">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentReport.status === 'مسجل ومبلغ'
                  ? 'bg-rose-100 text-rose-800'
                  : currentReport.status === 'تحت المتابعة'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              حالة الملف: {currentReport.status}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditClick(currentReport)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>تعديل التقرير</span>
              </button>
              <button
                onClick={() => handleDeleteReport(currentReport.id)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. Injured Student Identity */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black text-slate-900 border-b border-slate-200 pb-1.5">
              أولاً: هوية التلميذ المصاب ومعلومات الفوج
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">اسم ولقب التلميذ:</span>
                <strong className="text-slate-900 font-black text-sm">{currentReport.studentName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">الفوج التربوي:</span>
                <strong className="text-slate-800">{currentReport.className}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">أستاذ المادة المشرف:</span>
                <strong className="text-slate-800">{teacherName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">المؤسسة التعليمية:</span>
                <span className="text-slate-800">{schoolName}</span>
              </div>
            </div>
          </div>

          {/* 2. Accident Circumstances & Location */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black text-slate-900 border-b border-slate-200 pb-1.5">
              ثانياً: زمان ومكان وظروف وقوع الحادث
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">تاريخ الحادث:</span>
                <strong className="text-slate-900 font-mono tabular-nums">{currentReport.accidentDate}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">التوقيت بالضبط:</span>
                <strong className="text-slate-900 font-mono tabular-nums">{currentReport.accidentTime}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">مكان وقوع الحادث:</span>
                <span className="text-slate-800 font-semibold">{currentReport.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block">النشاط الرياضي الممارس:</span>
                <span className="text-slate-800 font-semibold">{currentReport.activityInvolved}</span>
              </div>
            </div>

            <div className="pt-2 text-xs">
              <span className="text-slate-500 block font-semibold mb-1">
                الظروف والوقائع المفصلة للحادث (كيفية وقوع الإصابة):
              </span>
              <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-sans">
                {currentReport.accidentCircumstances || 'لا توجد تفاصيل إضافية.'}
              </p>
            </div>
          </div>

          {/* 3. Injury Details & First Aid */}
          <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200 space-y-3">
            <h3 className="text-xs font-black text-rose-950 border-b border-rose-200 pb-1.5">
              ثالثاً: طبيعة الإصابة والإسعافات الأولية والإجراءات المتخذة
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-rose-900 block font-bold mb-1">طبيعة الإصابة والعضو المتضرر:</span>
                <p className="bg-white p-3 rounded-lg border border-rose-200 text-rose-950 font-bold leading-relaxed">
                  {currentReport.injuryNature}
                </p>
              </div>

              <div>
                <span className="text-slate-700 block font-bold mb-1">الإسعافات الأولية المقدمة فورا بالميدان:</span>
                <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                  {currentReport.firstAidGiven}
                </p>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-slate-700 block font-bold mb-1">
                الإجراءات المتخذة للإجلاء وإشعار الأولياء والإدارة:
              </span>
              <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                {currentReport.evacuationAction}
              </p>
            </div>

            <div className="text-xs">
              <span className="text-slate-700 block font-bold mb-1">الشهود على الحادث:</span>
              <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                {currentReport.witnesses || 'لم يتم تسجيل شهود.'}
              </p>
            </div>
          </div>

          {/* Official Signatures */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs mt-10 pt-6 border-t-2 border-slate-900">
            <div>
              <p className="font-bold">أستاذ المادة المشرف</p>
              <div className="h-16"></div>
              <p className="text-slate-700 font-semibold">{teacherName}</p>
            </div>
            <div>
              <p className="font-bold">تأشيرة مدير المؤسسة</p>
              <div className="h-16"></div>
              <p className="text-slate-700 font-semibold">{schoolName}</p>
            </div>
            <div>
              <p className="font-bold">مصلحة التأمين والضمان المدرسي</p>
              <div className="h-16"></div>
              <p className="text-slate-600">ختم وتأشيرة الاستلام</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Accident Report */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingReport ? 'تعديل تقرير الحادث المدرسي' : 'تحرير تقرير حادث مدرسي رياضي جديد'}
            </h3>

            <form onSubmit={handleSaveReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الفوج التربوي</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                      const stds = students.filter((s) => s.classId === e.target.value);
                      if (stds.length > 0) setSelectedStudentId(stds[0].id);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">التلميذ المصاب</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    {classStudents.map((s) => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ الحادث</label>
                  <input
                    type="date"
                    required
                    value={accidentDate}
                    onChange={(e) => setAccidentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">التوقيت بالضبط</label>
                  <input
                    type="time"
                    required
                    value={accidentTime}
                    onChange={(e) => setAccidentTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">حالة الملف</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="مسجل ومبلغ">مسجل ومبلغ</option>
                    <option value="تحت المتابعة">تحت المتابعة</option>
                    <option value="مغلق بعد الشفاء">مغلق بعد الشفاء</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">مكان الحادث بالمؤسسة</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ملعب كرة اليد الخارجي"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النشاط الرياضي الممارس</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سباق السرعة / وثب طويل"
                    value={activityInvolved}
                    onChange={(e) => setActivityInvolved(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">طبيعة الإصابة والعضو المتضرر</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: التواء في الكاحل الأيمن مع ورم خفيف"
                  value={injuryNature}
                  onChange={(e) => setInjuryNature(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ظروف ووقائع الحادث بالتفصيل</label>
                <textarea
                  rows={3}
                  required
                  placeholder="صف كيف وقع الحادث أثناء الحركة أو الاحتكاك..."
                  value={accidentCircumstances}
                  onChange={(e) => setAccidentCircumstances(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الإسعافات الأولية المقدمة فورا</label>
                <input
                  type="text"
                  required
                  value={firstAidGiven}
                  onChange={(e) => setFirstAidGiven(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الإجراء المتخذ (الإجلاء، الاتصال بالولي، العيادة)</label>
                <input
                  type="text"
                  required
                  value={evacuationAction}
                  onChange={(e) => setEvacuationAction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الشهود على الحادث</label>
                <input
                  type="text"
                  placeholder="أسماء التلاميذ أو الأساتذة الشهود..."
                  value={witnesses}
                  onChange={(e) => setWitnesses(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-xs"
                >
                  حفظ واعتماد التقرير
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Official Accident Report PDF Export Preview (A4 Standard) */}
      {showPdfModal && currentReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 text-right space-y-4 p-5 sm:p-8 relative">
            {/* Modal Controls Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    معاينة وتصدير تصريح الحادث المدرسي إلى PDF (A4)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    وثيقة إدارية رسمية للضمان المدرسي وإدارة المؤسسة مصممة للطباعة A4.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
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
                <p className="font-bold text-xs">وزارة التربية الوطنية · مديرية التربية والتعليم</p>
                <div className="flex justify-between items-center text-xs mt-2 px-1 font-semibold">
                  <span>المؤسسة: {schoolName}</span>
                  <span>الموسم الدراسي: {academicYear}</span>
                  <span>الأستاذ المحرر: {teacherName}</span>
                </div>
                <div className="border-t border-black pt-2 mt-2">
                  <h2 className="text-base font-black tracking-wide underline uppercase text-center">
                    تصريح رسمي بوقوع حادث مدرسي أثناء حصة التربية البدنية والرياضية
                  </h2>
                  <p className="text-[11px] text-slate-700 font-bold mt-0.5">
                    (ملف التأمين المدرسي والحوادث المدرسية والوقاية من المخاطر)
                  </p>
                </div>
              </div>

              {/* Student Identity Grid */}
              <div className="border border-black p-3 space-y-2 bg-slate-50">
                <h4 className="font-black text-black border-b border-black pb-1">
                  أولاً: هوية التلميذ المصاب
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-600 font-bold block">اسم ولقب التلميذ:</span>
                    <span className="font-black text-black">{currentReport.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">الفوج التربوي:</span>
                    <span className="font-black text-black">{currentReport.className}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">تاريخ وساعة الحادث:</span>
                    <span className="font-black text-black">{currentReport.accidentDate} على الساعة {currentReport.accidentTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">مكان وقوع الحادث:</span>
                    <span className="font-black text-black">{currentReport.location}</span>
                  </div>
                </div>
              </div>

              {/* Accident Circumstances & Details */}
              <div className="border border-black p-3 space-y-2">
                <h4 className="font-black text-black border-b border-black pb-1">
                  ثانياً: النشاط وطبيعة وظروف الحادث الميداني
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-600 font-bold block">النشاط الرياضي الممارس:</span>
                    <span className="font-semibold text-black">{currentReport.activityInvolved}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">طبيعة الإصابة وموضعها:</span>
                    <span className="font-black text-rose-950 bg-rose-50 p-1 rounded-sm border border-rose-200 block">
                      {currentReport.injuryNature}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">ظروف وملابسات وقوع الحادث بدقة:</span>
                    <p className="bg-slate-50 p-2 rounded-sm border border-slate-200 leading-relaxed font-sans">
                      {currentReport.accidentCircumstances || 'لا توجد ملاحظات إضافية.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* First Aid & Evacuation */}
              <div className="border border-black p-3 space-y-2 bg-slate-50">
                <h4 className="font-black text-black border-b border-black pb-1">
                  ثالثاً: الإسعافات الأولية والإجراءات الإدارية المتخذة
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-600 font-bold block">الإسعافات الأولية المقدمة في الميدان:</span>
                    <p className="leading-relaxed text-black font-semibold">
                      {currentReport.firstAidGiven}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">إجراءات الإجلاء وإشعار الإدارة وولي الأمر:</span>
                    <p className="leading-relaxed text-black">
                      {currentReport.evacuationAction}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">الشهود الحاضرون على الواقعة:</span>
                    <p className="leading-relaxed text-slate-800">
                      {currentReport.witnesses || 'أساتذة وتلاميذ الفوج التربوي.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Administrative Status & Official Signatures */}
              <div className="border border-black p-3 text-[11px] space-y-3">
                <div className="flex justify-between items-center border-b border-black pb-1.5">
                  <span className="font-bold">حالة الملف: <strong>{currentReport.status}</strong></span>
                  <span className="font-semibold">تاريخ التحرير: {currentReport.accidentDate}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="text-center space-y-6">
                    <span className="font-bold block">أستاذ مادة التربية البدنية</span>
                    <span className="font-black block">{teacherName}</span>
                  </div>

                  <div className="text-center space-y-6">
                    <span className="font-bold block">ولي أمر التلميذ (للعلم والتوقيع)</span>
                    <span className="text-slate-400 block">..................................</span>
                  </div>

                  <div className="text-center space-y-6 border-r border-black pr-2">
                    <span className="font-bold block">تأشيرة وختم مدير المؤسسة</span>
                    <span className="text-slate-400 block">حرر بـ: ......... في: .... / .... / 202..</span>
                  </div>
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
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
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
