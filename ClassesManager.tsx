import React, { useState } from 'react';
import { Plus, Printer, Edit2, Trash2, UserPlus, ShieldAlert, CheckCircle, Search, User } from 'lucide-react';
import { Student, ClassGroup } from '../types';
import { calculateBMI, isExemptionActive } from '../utils/storage';

interface ClassesManagerProps {
  classes: ClassGroup[];
  students: Student[];
  onUpdateClasses: (classes: ClassGroup[]) => void;
  onUpdateStudents: (students: Student[]) => void;
  onOpenStudentProfile?: (student: Student) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const ClassesManager: React.FC<ClassesManagerProps> = ({
  classes,
  students,
  onUpdateClasses,
  onUpdateStudents,
  onOpenStudentProfile,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'M' | 'F'>('all');
  const [exemptOnly, setExemptOnly] = useState(false);

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [classToEdit, setClassToEdit] = useState<ClassGroup | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassGroup | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Student Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('2009-01-01');
  const [birthPlace, setBirthPlace] = useState('الجزائر');
  const [studentNumber, setStudentNumber] = useState('');
  const [phoneParent, setPhoneParent] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [heightCm, setHeightCm] = useState<number | undefined>(172);
  const [weightKg, setWeightKg] = useState<number | undefined>(62);
  const [chronicConditions, setChronicConditions] = useState('');

  // Medical Exemption Form states
  const [isExempt, setIsExempt] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [exemptionType, setExemptionType] = useState<'كلي' | 'جزئي (مجهود هوائي فقط)' | 'مؤقت'>('كلي');
  const [reason, setReason] = useState('');

  // Class Form (Add)
  const [newClassName, setNewClassName] = useState('');
  const [newGradeLevel, setNewGradeLevel] = useState('السنة الأولى ثانوي');
  const [newScheduleSlot, setNewScheduleSlot] = useState('الأحد 08:00 - 10:00');

  // Class Form (Edit)
  const [editClassName, setEditClassName] = useState('');
  const [editGradeLevel, setEditGradeLevel] = useState('السنة الأولى ثانوي');
  const [editScheduleSlot, setEditScheduleSlot] = useState('الأحد 08:00 - 10:00');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const filteredStudents = students.filter((s) => {
    if (s.classId !== currentClass?.id) return false;
    if (genderFilter !== 'all' && s.gender !== genderFilter) return false;
    if (exemptOnly && !s.medicalExemption?.isExempt) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      return fullName.includes(q) || (s.studentNumber && s.studentNumber.includes(q));
    }
    return true;
  });

  const handleEditStudentClick = (student: Student) => {
    setEditingStudent(student);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setGender(student.gender);
    setBirthDate(student.birthDate || '');
    setBirthPlace(student.birthPlace || '');
    setStudentNumber(student.studentNumber || '');
    setPhoneParent(student.phoneParent || '');
    setGuardianName(student.guardianName || '');
    setBloodType(student.bloodType || 'O+');
    setHeightCm(student.heightCm);
    setWeightKg(student.weightKg);
    setChronicConditions(student.chronicConditions || '');

    // Exemption
    const med = student.medicalExemption || { isExempt: false };
    setIsExempt(med.isExempt);
    setStartDate(med.startDate || '');
    setEndDate(med.endDate || '');
    setCertificateNumber(med.certificateNumber || '');
    setDoctorName(med.doctorName || '');
    setExemptionType((med.exemptionType as 'كلي' | 'مؤقت' | 'جزئي (مجهود هوائي فقط)') || 'كلي');
    setReason(med.reason || '');

    setShowAddStudentModal(true);
  };

  const handleCreateStudentClick = () => {
    setEditingStudent(null);
    setFirstName('');
    setLastName('');
    setGender('M');
    setBirthDate('2009-05-15');
    setBirthPlace('الجزائر');
    setStudentNumber(`SEC/${Math.floor(1000 + Math.random() * 9000)}`);
    setPhoneParent('06');
    setGuardianName('');
    setBloodType('O+');
    setHeightCm(172);
    setWeightKg(62);
    setChronicConditions('');

    setIsExempt(false);
    setStartDate('');
    setEndDate('');
    setCertificateNumber('');
    setDoctorName('');
    setExemptionType('كلي');
    setReason('');

    setShowAddStudentModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClass) return;

    const medicalExemption = {
      isExempt,
      startDate: isExempt ? startDate : undefined,
      endDate: isExempt ? endDate : undefined,
      certificateNumber: isExempt ? certificateNumber : undefined,
      doctorName: isExempt ? doctorName : undefined,
      exemptionType: isExempt ? exemptionType : undefined,
      reason: isExempt ? reason : undefined,
    };

    if (editingStudent) {
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              firstName,
              lastName,
              gender,
              birthDate,
              birthPlace,
              studentNumber,
              phoneParent,
              guardianName,
              bloodType,
              heightCm: heightCm ? Number(heightCm) : undefined,
              weightKg: weightKg ? Number(weightKg) : undefined,
              chronicConditions,
              medicalExemption,
            }
          : s
      );
      onUpdateStudents(updated);
    } else {
      const newStudent: Student = {
        id: `s-${Date.now()}`,
        classId: currentClass.id,
        firstName,
        lastName,
        gender,
        birthDate,
        birthPlace,
        studentNumber,
        phoneParent,
        guardianName,
        bloodType,
        heightCm: heightCm ? Number(heightCm) : undefined,
        weightKg: weightKg ? Number(weightKg) : undefined,
        chronicConditions,
        medicalExemption,
      };
      onUpdateStudents([...students, newStudent]);
    }
    setFeedbackToast(editingStudent ? 'تم حفظ وتحديث بيانات التلميذ بنجاح!' : 'تمت إضافة التلميذ الجديد بنجاح!');
    setTimeout(() => setFeedbackToast(null), 3000);
    setShowAddStudentModal(false);
  };

  const confirmDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
  };

  const executeDeleteStudent = () => {
    if (!studentToDelete) return;
    onUpdateStudents(students.filter((s) => s.id !== studentToDelete.id));
    setFeedbackToast(`تم حذف التلميذ (${studentToDelete.firstName} ${studentToDelete.lastName}) بنجاح.`);
    setStudentToDelete(null);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleEditClassClick = (cls: ClassGroup) => {
    setClassToEdit(cls);
    setEditClassName(cls.name);
    setEditGradeLevel(cls.gradeLevel);
    setEditScheduleSlot(cls.sessionDays?.[0] || 'الأحد 08:00 - 10:00');
    setShowEditClassModal(true);
  };

  const handleUpdateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classToEdit) return;
    const updated = classes.map((c) =>
      c.id === classToEdit.id
        ? {
            ...c,
            name: editClassName,
            gradeLevel: editGradeLevel,
            sessionDays: [editScheduleSlot],
          }
        : c
    );
    onUpdateClasses(updated);
    setShowEditClassModal(false);
    setClassToEdit(null);
    setFeedbackToast('تم تعديل بيانات الفوج التربوي بنجاح!');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const confirmDeleteClass = (cls: ClassGroup) => {
    setClassToDelete(cls);
  };

  const executeDeleteClass = () => {
    if (!classToDelete) return;
    if (classes.length <= 1) {
      setFeedbackToast('لا يمكن حذف القسم الأخير، يجب الإبقاء على قسم واحد على الأقل.');
      setClassToDelete(null);
      setTimeout(() => setFeedbackToast(null), 3500);
      return;
    }
    const remainingClasses = classes.filter((c) => c.id !== classToDelete.id);
    onUpdateClasses(remainingClasses);
    if (selectedClassId === classToDelete.id) {
      setSelectedClassId(remainingClasses[0]?.id || '');
    }
    setFeedbackToast(`تم حذف الفوج التربوي (${classToDelete.name}) بنجاح.`);
    setClassToDelete(null);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: ClassGroup = {
      id: `class-${Date.now()}`,
      name: newClassName,
      gradeLevel: newGradeLevel,
      cycle: 'الثانوي',
      academicYear,
      sessionDays: [newScheduleSlot],
      schedule: [
        {
          day: 'الأحد',
          startTime: '08:00',
          endTime: '10:00',
          location: 'الملعب',
        },
      ],
    };
    onUpdateClasses([...classes, newClass]);
    setSelectedClassId(newClass.id);
    setShowAddClassModal(false);
    setNewClassName('');
    setFeedbackToast('تم إنشاء وإضافة الفوج التربوي بنجاح!');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

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
          قائمة الفوج التربوي والملف الصحي البدني (طور ثانوي)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          القسم: {currentClass?.name} ({currentClass?.gradeLevel}) - العدد: {filteredStudents.length} تلميذاً
        </p>
      </div>

      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              إدارة الأقسام والملفات المفصلة للتلاميذ (Student Profiles)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              الملفات الفردية، تتبع الإعفاءات بتاريخ من... إلى...، القياسات البدنية وفتح الملف الفردي الكامل.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateStudentClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة تلميذ جديد</span>
            </button>

            <button
              onClick={() => setShowAddClassModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم ثانوي</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة القائمة</span>
            </button>
          </div>
        </div>

        {/* Classes Tabs & Management Buttons */}
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {classes.map((c) => {
                const count = students.filter((s) => s.classId === c.id).length;
                const exempt = students.filter((s) => s.classId === c.id && s.medicalExemption?.isExempt).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClassId(c.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-right whitespace-nowrap ${
                      selectedClassId === c.id
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold">{c.name}</span>
                    <span className="block text-[11px] opacity-80">
                      {count} تلميذاً {exempt > 0 && `(${exempt} معفى)`}
                    </span>
                  </button>
                );
              })}
            </div>

            {currentClass && (
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleEditClassClick(currentClass)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-900 rounded-md transition-colors"
                  title="تعديل اسم أو مستوى الفوج الحالي"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>تعديل الفوج</span>
                </button>
                <button
                  type="button"
                  onClick={() => confirmDeleteClass(currentClass)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title="حذف هذا الفوج التربوي"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الفوج</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الرقم المدرسي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setGenderFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  genderFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setGenderFilter('M')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  genderFilter === 'M' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                ذكور
              </button>
              <button
                onClick={() => setGenderFilter('F')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  genderFilter === 'F' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                إناث
              </button>
            </div>

            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={exemptOnly}
                onChange={(e) => setExemptOnly(e.target.checked)}
                className="rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>المعفيون طبياً فقط</span>
            </label>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 w-12 text-center">الرقم</th>
              <th className="py-3 px-4">اسم ولقب التلميذ</th>
              <th className="py-3 px-3 w-16">الجنس</th>
              <th className="py-3 px-3 w-28">تاريخ الميلاد</th>
              <th className="py-3 px-3 w-28">الرقم المدرسي</th>
              <th className="py-3 px-3 w-28">هاتف الولي</th>
              <th className="py-3 px-3 w-32">الطول / الوزن</th>
              <th className="py-3 px-4 w-44">الإعفاء الطبي (من - إلى)</th>
              <th className="py-3 px-3 w-28 text-center no-print">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student, idx) => {
              const exemption = isExemptionActive(student);

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
                  <td className="py-3 px-3 text-slate-700">
                    {student.gender === 'M' ? 'ذكر' : 'أنثى'}
                  </td>
                  <td className="py-3 px-3 text-slate-600 tabular-nums">
                    {student.birthDate || '—'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 tabular-nums">
                    {student.studentNumber || '—'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 tabular-nums">
                    {student.phoneParent || '—'}
                  </td>
                  <td className="py-3 px-3 text-slate-700 tabular-nums">
                    {student.heightCm ? `${student.heightCm} سم` : '—'} /{' '}
                    {student.weightKg ? `${student.weightKg} كغ` : '—'}
                  </td>
                  <td className="py-3 px-4">
                    {student.medicalExemption?.isExempt ? (
                      <div className="text-[11px] leading-tight">
                        <span className={`font-bold block ${exemption.badgeColor}`}>
                          {student.medicalExemption.exemptionType || 'معفى'}
                        </span>
                        <span className="text-slate-500 tabular-nums">
                          من: {student.medicalExemption.startDate || 'بداية السنة'} إلى: {student.medicalExemption.endDate || 'نهاية السنة'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>لائق بدنياً</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center no-print">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenStudentProfile && onOpenStudentProfile(student)}
                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="الملف الفردي المفصل"
                      >
                        <User className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditStudentClick(student)}
                        className="p-1 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                        title="تعديل"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => confirmDeleteStudent(student)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="حذف التلميذ"
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

      {/* Modal: Add/Edit Student with full profile fields */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingStudent ? 'تعديل الملف التعريفي للتلميذ' : 'إضافة تلميذ جديد للفوج'}
            </h3>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 block text-xs">المعلومات الشخصية الأساسية</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">الاسم</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">اللقب</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">الجنس</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    >
                      <option value="M">ذكر</option>
                      <option value="F">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">تاريخ الميلاد</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">مكان الميلاد</label>
                    <input
                      type="text"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">الرقم المدرسي</label>
                    <input
                      type="text"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">اسم الولي</label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">هاتف الولي</label>
                    <input
                      type="text"
                      value={phoneParent}
                      onChange={(e) => setPhoneParent(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Physical measurements */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">القياسات البدنية وفصيلة الدم</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">الطول (سم)</label>
                    <input
                      type="number"
                      value={heightCm || ''}
                      onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">الوزن (كغ)</label>
                    <input
                      type="number"
                      value={weightKg || ''}
                      onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">فصيلة الدم</label>
                    <input
                      type="text"
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Exemption section */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 text-sm">
                  <input
                    type="checkbox"
                    checked={isExempt}
                    onChange={(e) => setIsExempt(e.target.checked)}
                    className="rounded-sm border-amber-400 text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>إعفاء طبي من التربية البدنية والرياضية (Dispensé médical)</span>
                </label>

                {isExempt && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-amber-900 font-semibold mb-1">تاريخ بداية الإعفاء (من)</label>
                        <input
                          type="date"
                          required
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-slate-900 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-amber-900 font-semibold mb-1">تاريخ نهاية الإعفاء (إلى)</label>
                        <input
                          type="date"
                          required
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-slate-900 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-amber-900 font-semibold mb-1">نوع الإعفاء</label>
                        <select
                          value={exemptionType}
                          onChange={(e) => setExemptionType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-slate-900 font-bold"
                        >
                          <option value="كلي">إعفاء كلي</option>
                          <option value="جزئي (مجهود هوائي فقط)">إعفاء جزئي (مجهود هوائي)</option>
                          <option value="مؤقت">إعفاء مؤقت</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-amber-900 font-semibold mb-1">رقم الشهادة الطبية</label>
                        <input
                          type="text"
                          placeholder="مثال: UDS-2026/104"
                          value={certificateNumber}
                          onChange={(e) => setCertificateNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-amber-900 font-semibold mb-1">اسم الطبيب الفاحص</label>
                        <input
                          type="text"
                          placeholder="طبيب وحدة الكشف والمتابعة..."
                          value={doctorName}
                          onChange={(e) => setDoctorName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-amber-900 font-semibold mb-1">سبب الإعفاء وتوصيات الطبيب</label>
                      <textarea
                        rows={2}
                        placeholder="تشخيص الحالة وتوجيهات الإعفاء..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  حفظ التلميذ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Class */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">إضافة قسم ثانوي جديد</h3>

            <form onSubmit={handleSaveClass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم القسم</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 2 ثانوي لغات وفلسفة"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">المستوى التعليمي</label>
                <select
                  value={newGradeLevel}
                  onChange={(e) => setNewGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="السنة الأولى ثانوي جذع مشترك علوم">السنة الأولى ثانوي (جذع مشترك علوم)</option>
                  <option value="السنة الأولى ثانوي جذع مشترك آداب">السنة الأولى ثانوي (جذع مشترك آداب)</option>
                  <option value="السنة الثانية ثانوي">السنة الثانية ثانوي</option>
                  <option value="السنة الثالثة ثانوي (بكالوريا)">السنة الثالثة ثانوي (بكالوريا BAC)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  إنشاء القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Class */}
      {showEditClassModal && classToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-emerald-600" />
              <span>تعديل بيانات الفوج التربوي</span>
            </h3>

            <form onSubmit={handleUpdateClass} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم القسم / الفوج</label>
                <input
                  type="text"
                  required
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">المستوى التعليمي</label>
                <select
                  value={editGradeLevel}
                  onChange={(e) => setEditGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="السنة الأولى ثانوي جذع مشترك علوم">السنة الأولى ثانوي (جذع مشترك علوم)</option>
                  <option value="السنة الأولى ثانوي جذع مشترك آداب">السنة الأولى ثانوي (جذع مشترك آداب)</option>
                  <option value="السنة الثانية ثانوي">السنة الثانية ثانوي</option>
                  <option value="السنة الثالثة ثانوي (بكالوريا)">السنة الثالثة ثانوي (بكالوريا BAC)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">توقيت الحصة الأسبوعية</label>
                <input
                  type="text"
                  value={editScheduleSlot}
                  onChange={(e) => setEditScheduleSlot(e.target.value)}
                  placeholder="مثال: الأحد 08:00 - 10:00"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditClassModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Student */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-right space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">تأكيد حذف التلميذ</h3>
              <p className="text-xs text-slate-500">
                هل أنت متأكد من حذف التلميذ ({studentToDelete.firstName} {studentToDelete.lastName})؟ سيتم حذف جميع بياناته وتقويماته.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={executeDeleteStudent}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-sm"
              >
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Class */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-right space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">تأكيد حذف الفوج التربوي</h3>
              <p className="text-xs text-slate-500">
                هل أنت متأكد من حذف الفوج ({classToDelete.name})؟ لن يتمكن التلاميذ المرتبطين به من الظهور حتى يتم تعيينهم لفوج آخر.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClassToDelete(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={executeDeleteClass}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-sm"
              >
                نعم، احذف الفوج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {feedbackToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}
    </div>
  );
};
