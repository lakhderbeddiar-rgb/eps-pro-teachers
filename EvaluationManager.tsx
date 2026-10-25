import React, { useState, useMemo } from 'react';
import {
  Printer,
  Download,
  Award,
  TrendingUp,
  User,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Calendar,
  Sparkles,
  FileText,
  Search,
  Table,
  Zap,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Minus,
  RotateCcw,
  FastForward,
  CheckCheck,
  Volume2,
  ShieldCheck,
  UserCheck,
  Trash2,
} from 'lucide-react';
import {
  ClassGroup,
  EvaluationSession,
  FitnessTestItem,
  Student,
  StudentEvaluationRecord,
  AttendanceRecord,
} from '../types';
import { calculateAutomatedGrade, exportToCSV, calculateBMI } from '../utils/storage';
import { fieldAudio } from '../utils/audioWhistle';

interface EvaluationManagerProps {
  classes: ClassGroup[];
  students: Student[];
  evaluations: EvaluationSession[];
  attendanceRecords: AttendanceRecord[];
  testBank: FitnessTestItem[];
  onUpdateEvaluations: (evals: EvaluationSession[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const EvaluationManager: React.FC<EvaluationManagerProps> = ({
  classes,
  students,
  evaluations,
  attendanceRecords,
  testBank,
  onUpdateEvaluations,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [activeTab, setActiveTab] = useState<
    'continuous_exam' | 'base_competency' | 'objective_progression' | 'quick_pad' | 'annual_report'
  >('continuous_exam');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث'>('الفصل الأول');

  // Base Competency Observation Grid state
  const [baseCompetencyGrades, setBaseCompetencyGrades] = useState<{
    [studentId: string]: {
      c1: number; // إدراك الفضاء وتوزيع الجهد (سلم 5)
      c2: number; // التنسيق الحركي والتحكم التقني (سلم 5)
      c3: number; // الروح الرياضية والتفاعل مع الزملاء (سلم 5)
      c4: number; // احترام القوانين والأمن والسلامة (سلم 5)
    };
  }>({});

  // Learning Objective Progression state (Pre-test vs Post-test)
  const [progressionGrades, setProgressionGrades] = useState<{
    [studentId: string]: {
      preScore: number;
      postScore: number;
      activityName: string;
      notes?: string;
    };
  }>({});

  // Annual report view states
  const [reportSubView, setReportSubView] = useState<'individual' | 'class_summary'>('individual');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [customTeacherAppreciation, setCustomTeacherAppreciation] = useState<{ [id: string]: string }>({});

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = useMemo(
    () => students.filter((s) => s.classId === currentClass?.id),
    [students, currentClass]
  );

  // Set default student for individual report
  React.useEffect(() => {
    if (classStudents.length > 0 && (!selectedStudentId || !classStudents.some((s) => s.id === selectedStudentId))) {
      setSelectedStudentId(classStudents[0].id);
    }
  }, [classStudents, selectedStudentId]);

  // Find or create session for class & term
  const currentSession =
    evaluations.find(
      (e) => e.classId === currentClass?.id && e.term === selectedTerm
    ) || evaluations[0];

  const [activeTests, setActiveTests] = useState<FitnessTestItem[]>(
    currentSession?.testItems || [testBank[0], testBank[1]]
  );

  const [gradesState, setGradesState] = useState<{ [studentId: string]: StudentEvaluationRecord }>(
    currentSession?.grades || {}
  );

  React.useEffect(() => {
    const sess = evaluations.find(
      (e) => e.classId === currentClass?.id && e.term === selectedTerm
    );
    if (sess) {
      setActiveTests(sess.testItems);
      setGradesState(sess.grades || {});
    } else {
      setActiveTests([testBank[0], testBank[1]]);
      setGradesState({});
    }
  }, [selectedClassId, selectedTerm, evaluations, currentClass, testBank]);

  // Term evaluation mode: 'matrix' (detailed table) vs 'quick_pad' (tactile fast scoring buttons)
  const [evalMode, setEvalMode] = useState<'matrix' | 'quick_pad'>('matrix');

  // Quick field scoring states
  const [quickTestId, setQuickTestId] = useState<string>('test-speed');
  const [quickStudentIndex, setQuickStudentIndex] = useState<number>(0);
  const [quickAutoAdvance, setQuickAutoAdvance] = useState<boolean>(true);
  const [quickSearch, setQuickSearch] = useState<string>('');
  const [quickStatusFilter, setQuickStatusFilter] = useState<'all' | 'unrated' | 'rated'>('all');
  const [feedbackEffect, setFeedbackEffect] = useState<string | null>(null);
  const [quickWhistleSound, setQuickWhistleSound] = useState<boolean>(true);

  // Sync quickTestId when active tests change
  React.useEffect(() => {
    if (activeTests.length > 0 && quickTestId !== 'conduct' && !activeTests.some((t) => t.id === quickTestId)) {
      setQuickTestId(activeTests[0].id);
    }
  }, [activeTests, quickTestId]);

  const handleDirectGradeChange = (
    studentId: string,
    testId: string,
    directGrade: number,
    approxRawVal?: number
  ) => {
    const prevStudent: StudentEvaluationRecord = gradesState[studentId] || { testScores: {} };
    const prevTestScores = prevStudent.testScores || {};
    const conduct = prevStudent.attendanceConductGrade ?? 18;

    const updatedTestScores = {
      ...prevTestScores,
      [testId]: {
        rawValue: approxRawVal ?? directGrade,
        calculatedGrade: directGrade,
      },
    };

    const testGradesList = activeTests.map(
      (t) => (updatedTestScores[t.id]?.calculatedGrade ?? 0)
    );
    const sum = testGradesList.reduce((acc, v) => acc + v, 0) + conduct;
    const finalAvg = parseFloat((sum / (testGradesList.length + 1)).toFixed(2));

    const updatedStudentRecord: StudentEvaluationRecord = {
      testScores: updatedTestScores,
      attendanceConductGrade: conduct,
      finalAverage: finalAvg,
    };

    const newGrades = {
      ...gradesState,
      [studentId]: updatedStudentRecord,
    };

    setGradesState(newGrades);
    persistGrades(newGrades);
  };

  // Filtered students for quick pad
  const quickFilteredStudents = useMemo(() => {
    return classStudents.filter((s) => {
      if (quickSearch) {
        const full = `${s.firstName} ${s.lastName}`.toLowerCase();
        if (!full.includes(quickSearch.toLowerCase())) return false;
      }
      if (quickStatusFilter === 'unrated') {
        const rec = gradesState[s.id];
        const val =
          quickTestId === 'conduct'
            ? rec?.attendanceConductGrade
            : rec?.testScores?.[quickTestId]?.calculatedGrade;
        return !val;
      }
      if (quickStatusFilter === 'rated') {
        const rec = gradesState[s.id];
        const val =
          quickTestId === 'conduct'
            ? rec?.attendanceConductGrade
            : rec?.testScores?.[quickTestId]?.calculatedGrade;
        return Boolean(val);
      }
      return true;
    });
  }, [classStudents, quickSearch, quickStatusFilter, gradesState, quickTestId]);

  const currentQuickStudent = quickFilteredStudents[quickStudentIndex] || quickFilteredStudents[0];

  const triggerQuickScore = (
    studentId: string,
    score: number,
    approxRawVal?: number,
    customNotice?: string
  ) => {
    if (quickTestId === 'conduct') {
      handleConductChange(studentId, score);
    } else {
      handleDirectGradeChange(studentId, quickTestId, score, approxRawVal);
    }

    if (quickWhistleSound) {
      fieldAudio.playWhistle(0.2);
    }

    setFeedbackEffect(customNotice || `تم تسجيل ${score}/20`);
    setTimeout(() => setFeedbackEffect(null), 1800);

    if (quickAutoAdvance) {
      setTimeout(() => {
        setQuickStudentIndex((prev) =>
          prev + 1 < quickFilteredStudents.length ? prev + 1 : 0
        );
      }, 350);
    }
  };

  const handleRawScoreChange = (
    studentId: string,
    testId: string,
    rawVal: number | string,
    gender: 'M' | 'F'
  ) => {
    const prevStudent: StudentEvaluationRecord = gradesState[studentId] || { testScores: {} };
    const prevTestScores = prevStudent.testScores || {};
    const conduct = prevStudent.attendanceConductGrade ?? 18;

    if (rawVal === '' || rawVal === null || isNaN(Number(rawVal))) {
      // Clear specific test score
      const updatedTestScores = { ...prevTestScores };
      delete updatedTestScores[testId];

      const testGradesList = activeTests.map(
        (t) => (updatedTestScores[t.id]?.calculatedGrade ?? 0)
      );
      const sum = testGradesList.reduce((acc, v) => acc + v, 0) + conduct;
      const finalAvg = parseFloat((sum / (testGradesList.length + 1)).toFixed(2));

      const updatedStudentRecord: StudentEvaluationRecord = {
        testScores: updatedTestScores,
        attendanceConductGrade: conduct,
        finalAverage: finalAvg,
      };

      const newGrades = {
        ...gradesState,
        [studentId]: updatedStudentRecord,
      };

      setGradesState(newGrades);
      persistGrades(newGrades);
      return;
    }

    const numVal = Number(rawVal);
    const calcGrade = calculateAutomatedGrade(testId, numVal, gender);

    const updatedTestScores = {
      ...prevTestScores,
      [testId]: {
        rawValue: numVal,
        calculatedGrade: calcGrade,
      },
    };

    // Calculate new average
    const testGradesList = activeTests.map(
      (t) => (updatedTestScores[t.id]?.calculatedGrade ?? 0)
    );
    const sum = testGradesList.reduce((acc, v) => acc + v, 0) + conduct;
    const finalAvg = parseFloat((sum / (testGradesList.length + 1)).toFixed(2));

    const updatedStudentRecord: StudentEvaluationRecord = {
      testScores: updatedTestScores,
      attendanceConductGrade: conduct,
      finalAverage: finalAvg,
    };

    const newGrades = {
      ...gradesState,
      [studentId]: updatedStudentRecord,
    };

    setGradesState(newGrades);
    persistGrades(newGrades);
  };

  // Handler to clear a single student's complete evaluation record
  const handleClearStudentGrade = (studentId: string) => {
    const newGrades = { ...gradesState };
    delete newGrades[studentId];
    setGradesState(newGrades);
    persistGrades(newGrades);
    setFeedbackEffect('تم مسح نقطة التلميذ بنجاح');
    setTimeout(() => setFeedbackEffect(null), 2500);
  };

  // Handler to clear all class grades for current term
  const handleClearClassTermGrades = () => {
    if (!currentClass) return;
    if (
      !confirm(
        `هل تريد بالتأكيد مسح وإفراغ جميع نقاط وتصحيحات فوج (${currentClass.name}) الخاصة بـ (${selectedTerm})؟`
      )
    ) {
      return;
    }
    setGradesState({});
    persistGrades({});
    setFeedbackEffect('تم إفراغ نقاط الفوج بالكامل');
    setTimeout(() => setFeedbackEffect(null), 2500);
  };

  const handleConductChange = (studentId: string, conductVal: number) => {
    const prevStudent: StudentEvaluationRecord = gradesState[studentId] || { testScores: {} };
    const testScores = prevStudent.testScores || {};

    const testGradesList = activeTests.map(
      (t) => (testScores[t.id]?.calculatedGrade ?? 0)
    );
    const sum = testGradesList.reduce((acc, v) => acc + v, 0) + conductVal;
    const finalAvg = parseFloat((sum / (testGradesList.length + 1)).toFixed(2));

    const updatedStudentRecord: StudentEvaluationRecord = {
      ...prevStudent,
      attendanceConductGrade: conductVal,
      finalAverage: finalAvg,
    };

    const newGrades = {
      ...gradesState,
      [studentId]: updatedStudentRecord,
    };

    setGradesState(newGrades);
    persistGrades(newGrades);
  };

  const persistGrades = (newGrades: { [studentId: string]: StudentEvaluationRecord }) => {
    if (!currentClass) return;
    const existingIndex = evaluations.findIndex(
      (e) => e.classId === currentClass.id && e.term === selectedTerm
    );

    const sessionToSave: EvaluationSession = {
      id: existingIndex >= 0 ? evaluations[existingIndex].id : `eval-${Date.now()}`,
      classId: currentClass.id,
      term: selectedTerm,
      date: new Date().toISOString().split('T')[0],
      title: `تقويم مادة التربية البدنية والرياضية (${selectedTerm})`,
      testItems: activeTests,
      grades: newGrades,
    };

    if (existingIndex >= 0) {
      const copy = [...evaluations];
      copy[existingIndex] = sessionToSave;
      onUpdateEvaluations(copy);
    } else {
      onUpdateEvaluations([...evaluations, sessionToSave]);
    }
  };

  const handleExportCSV = () => {
    if (!currentClass) return;
    const headers = [
      'الرقم',
      'الاسم واللقب',
      'الجنس',
      ...activeTests.map((t) => `${t.name} (${t.unit})`),
      'المواظبة والسلوك',
      'المعدل الفصلي /20',
    ];
    const rows = classStudents.map((s, idx) => {
      const sGrades = gradesState[s.id];
      const testScores = activeTests.map(
        (t) => sGrades?.testScores?.[t.id]?.calculatedGrade ?? 0
      );
      const conduct =
        sGrades?.attendanceConductGrade ?? (s.isMedicallyExempt ? 18 : 17);
      const avg = sGrades?.finalAverage ?? (s.isMedicallyExempt ? 18.0 : '');
      return [
        idx + 1,
        `${s.firstName} ${s.lastName}`,
        s.gender === 'M' ? 'ذكر' : 'أنثى',
        ...testScores,
        conduct,
        avg,
      ];
    });
    exportToCSV(
      `كشف_نقاط_${currentClass.name}_${selectedTerm}_${academicYear}`,
      headers,
      rows
    );
  };

  // -------------------------------------------------------------
  // ANNUAL PERFORMANCE COMPUTATIONS
  // -------------------------------------------------------------

  // Calculate annual data for all students in current class
  const classAnnualReportData = useMemo(() => {
    if (!currentClass) return [];

    // Filter attendance for this class
    const classAttendance = attendanceRecords.filter((r) => r.classId === currentClass.id);
    const totalRecordedSessions = classAttendance.length;

    // Filter sessions across terms for this class
    const t1Session = evaluations.find((e) => e.classId === currentClass.id && e.term === 'الفصل الأول');
    const t2Session = evaluations.find((e) => e.classId === currentClass.id && e.term === 'الفصل الثاني');
    const t3Session = evaluations.find((e) => e.classId === currentClass.id && e.term === 'الفصل الثالث');

    return classStudents.map((student, idx) => {
      // 1. Attendance Metrics
      let presentKit = 0;
      let presentNoKit = 0;
      let exempt = 0;
      let absent = 0;

      classAttendance.forEach((session) => {
        const st = session.records[student.id];
        if (st === 'present_kit') presentKit++;
        else if (st === 'present_no_kit') presentNoKit++;
        else if (st === 'exempt') exempt++;
        else if (st === 'absent' || st === 'absent_justified') absent++;
        else {
          // If no explicit record but student is exempt:
          if (student.isMedicallyExempt) exempt++;
          else presentKit++;
        }
      });

      const totalAttended = presentKit + presentNoKit + exempt;
      const effectiveTotal = Math.max(1, totalRecordedSessions);
      const attendanceRate = totalRecordedSessions > 0
        ? Math.round((totalAttended / effectiveTotal) * 100)
        : 100;

      const kitComplianceRate = (presentKit + presentNoKit) > 0
        ? Math.round((presentKit / (presentKit + presentNoKit)) * 100)
        : 100;

      // 2. Term Evaluations
      const t1Grade = t1Session?.grades[student.id]?.finalAverage ?? (student.isMedicallyExempt ? 18.0 : 16.5);
      const t2Grade = t2Session?.grades[student.id]?.finalAverage ?? (t1Grade ? parseFloat((t1Grade + (student.isMedicallyExempt ? 0 : 0.5)).toFixed(1)) : 17.0);
      const t3Grade = t3Session?.grades[student.id]?.finalAverage ?? (t2Grade ? parseFloat((t2Grade + (student.isMedicallyExempt ? 0 : 0.3)).toFixed(1)) : 17.2);

      const termsList = [t1Grade, t2Grade, t3Grade].filter((g) => typeof g === 'number' && !isNaN(g)) as number[];
      const annualAverage = termsList.length > 0
        ? parseFloat((termsList.reduce((acc, v) => acc + v, 0) / termsList.length).toFixed(2))
        : 16.5;

      // Progression trend
      let progressionLabel = 'أداء مستقر';
      let progressionColor = 'text-slate-700';
      if (t3Grade > t1Grade + 0.5) {
        progressionLabel = 'تطور إيجابي ملحوظ (+)';
        progressionColor = 'text-emerald-700 font-bold';
      } else if (t1Grade > t3Grade + 0.5) {
        progressionLabel = 'تراجع طفيف يرجى استدراكه (-)';
        progressionColor = 'text-rose-600 font-bold';
      }

      // Qualitative Rating
      let ratingText = 'جيد جداً';
      let ratingColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      if (annualAverage >= 18) {
        ratingText = 'ممتاز (تهنئة وتشجيع)';
        ratingColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
      } else if (annualAverage >= 16) {
        ratingText = 'جيد جداً (لوحة شرف)';
        ratingColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      } else if (annualAverage >= 14) {
        ratingText = 'جيد (تشجيع)';
        ratingColor = 'bg-blue-50 text-blue-800 border-blue-200';
      } else if (annualAverage >= 12) {
        ratingText = 'مقبول';
        ratingColor = 'bg-slate-100 text-slate-800 border-slate-200';
      } else if (annualAverage >= 10) {
        ratingText = 'متوسط';
        ratingColor = 'bg-amber-50 text-amber-800 border-amber-200';
      } else {
        ratingText = 'دون المتوسط (إنذار)';
        ratingColor = 'bg-rose-50 text-rose-800 border-rose-200';
      }

      // Default Pedagogical appreciation
      let autoAppreciation = '';
      if (student.isMedicallyExempt) {
        autoAppreciation = 'تلميذ معفى طبياً بموجب شهادة صحية معتمدة. أظهر انضباطاً ومشاركة فعالة في مهام الملاحظة، التحكيم، وإعانة الزملاء بروح رياضية عالية.';
      } else if (annualAverage >= 17) {
        autoAppreciation = 'مستوى بدني وحركي ممتاز، انضباط تام ومواظبة نموذجية بالبذلة الرياضية، تحكم مهاري وتكتيكي رفيع وروح رياضية يحتذى بها.';
      } else if (annualAverage >= 14) {
        autoAppreciation = 'مستوى جيد جداً، تحكم حركي إيجابي والتزام ملحوظ بالزي الرياضي، ينصح بالاستمرار في صقل قدرات التحمل الدوري التنفسي.';
      } else if (annualAverage >= 12) {
        autoAppreciation = 'نتائج مقبولة وإمكانيات بدنية واعدة، يحتاج للمزيد من التركيز على التقنيات الحركية الفردية والمواظبة الدائمة على إحضار البذلة.';
      } else {
        autoAppreciation = 'نتائج بحاجة ماسة للتحسين، لوحظ تذبذب في الحضور وإحضار البذلة الرياضية؛ يجب مضاعفة الجهد والحرص على المشاركة الإيجابية.';
      }

      return {
        student,
        index: idx + 1,
        totalRecordedSessions,
        presentKit,
        presentNoKit,
        exempt,
        absent,
        attendanceRate,
        kitComplianceRate,
        t1Grade,
        t2Grade,
        t3Grade,
        annualAverage,
        progressionLabel,
        progressionColor,
        ratingText,
        ratingColor,
        autoAppreciation,
      };
    });
  }, [currentClass, classStudents, attendanceRecords, evaluations]);

  // Selected student individual data
  const selectedStudentData = useMemo(() => {
    return classAnnualReportData.find((d) => d.student.id === selectedStudentId) || classAnnualReportData[0];
  }, [classAnnualReportData, selectedStudentId]);

  const handleExportAnnualSummaryCSV = () => {
    if (!currentClass) return;
    const headers = [
      'الرقم',
      'الاسم واللقب',
      'الجنس',
      'الحالة الصحية',
      'مؤشر BMI',
      'نسبة المواظبة %',
      'نسبة البذلة %',
      'معدل ف1 /20',
      'معدل ف2 /20',
      'معدل ف3 /20',
      'المعدل السنوي /20',
      'التقدير العام',
      'الملاحظة البيداغوجية',
    ];

    const rows = classAnnualReportData.map((d) => {
      const bmi = calculateBMI(d.student.weightKg, d.student.heightCm);
      const apprec = customTeacherAppreciation[d.student.id] || d.autoAppreciation;
      return [
        d.index,
        `${d.student.firstName} ${d.student.lastName}`,
        d.student.gender === 'M' ? 'ذكر' : 'أنثى',
        d.student.isMedicallyExempt ? 'معفى طبياً' : 'لائق بدنياً',
        bmi.bmi ? `${bmi.bmi} (${bmi.category})` : '—',
        `${d.attendanceRate}%`,
        `${d.kitComplianceRate}%`,
        d.t1Grade,
        d.t2Grade,
        d.t3Grade,
        d.annualAverage,
        d.ratingText,
        apprec,
      ];
    });

    exportToCSV(`الحصيلة_السنوية_للأداء_البدني_${currentClass.name}_${academicYear}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Screen Toolbar & Mode Switcher */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              قسم التقويم والتقارير السنوية (Evaluations & Annual Performance)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              شبكة التنقيط الفصلي، احتساب المعدلات الآلية، وتوليد تقارير الأداء السنوي الشاملة للتلاميذ.
            </p>
          </div>

          {/* Primary View Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('continuous_exam')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 ${
                activeTab === 'continuous_exam'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>التقويم المستمر والفرض والامتحان</span>
            </button>

            <button
              onClick={() => setActiveTab('base_competency')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 ${
                activeTab === 'base_competency'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>شبكة ملاحظة الكفاءة القاعدية</span>
            </button>

            <button
              onClick={() => setActiveTab('objective_progression')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 ${
                activeTab === 'objective_progression'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>تقويم الهدف التعلمي والتطور</span>
            </button>

            <button
              onClick={() => setActiveTab('quick_pad')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 ${
                activeTab === 'quick_pad'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>⚡ تنقيط ميداني سريع (أزرار)</span>
            </button>

            <button
              onClick={() => setActiveTab('annual_report')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 ${
                activeTab === 'annual_report'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>الحصيلة السنوية الشاملة</span>
            </button>
          </div>
        </div>

        {/* Class Selection & Quick Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">الفوج التربوي:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.gradeLevel})
                </option>
              ))}
            </select>
          </div>

          {activeTab !== 'annual_report' ? (
            /* Term Selector for grading tabs */
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {(['الفصل الأول', 'الفصل الثاني', 'الفصل الثالث'] as const).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSelectedTerm(term)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      selectedTerm === term
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleClearClassTermGrades}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap"
                title="مسح وإفراغ جميع نقاط هذا الفصل لإعادة الإدخال"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>تفريغ نقاط الفصل</span>
              </button>
            </div>
          ) : (
            /* Sub-views for Annual Report: Individual vs Class Summary */
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setReportSubView('individual')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    reportSubView === 'individual'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  بطاقة التلميذ الفردية (A4)
                </button>
                <button
                  onClick={() => setReportSubView('class_summary')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    reportSubView === 'class_summary'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  حصيلة القسم السنوية الشاملة
                </button>
              </div>

              {reportSubView === 'class_summary' && (
                <button
                  onClick={handleExportAnnualSummaryCSV}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                  title="تصدير الحصيلة السنوية للقسم إلى Excel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير الحصيلة (CSV)</span>
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة التقرير</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* SECTION 1: CONTINUOUS EVALUATION & EXAM (التقويم المستمر والفرض) */}
      {/* ============================================================= */}
      {activeTab === 'continuous_exam' && (
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
              كشف التنقيط والتقويم التربوي لمادة التربية البدنية والرياضية
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              الفوج: {currentClass?.name} ({currentClass?.gradeLevel}) · {selectedTerm}
            </p>
          </div>

          {/* Evaluation Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">الرقم</th>
                    <th className="py-3 px-4 w-44">اسم ولقب التلميذ</th>
                    <th className="py-3 px-3 w-16">الجنس</th>
                    {activeTests.map((t) => (
                      <th key={t.id} className="py-3 px-3 text-center min-w-[130px]">
                        <span className="block font-bold">{t.name}</span>
                        <span className="block text-[10px] font-normal text-slate-500">
                          ({t.unit}) → سلم /20
                        </span>
                      </th>
                    ))}
                    <th className="py-3 px-3 text-center w-28">
                      <span className="block font-bold">المواظبة والسلوك</span>
                      <span className="block text-[10px] font-normal text-slate-500">/20</span>
                    </th>
                    <th className="py-3 px-4 text-center w-28 bg-emerald-50 text-emerald-950 font-black">
                      المعدل الفصلي /20
                    </th>
                    <th className="py-3 px-2 text-center w-12 no-print">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((student, idx) => {
                    const sGrades = gradesState[student.id];
                    const conduct = sGrades?.attendanceConductGrade ?? (student.isMedicallyExempt ? 18 : 17);
                    const avg = sGrades?.finalAverage ?? (student.isMedicallyExempt ? 18.0 : '—');

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-600">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {student.firstName} {student.lastName}
                          {student.isMedicallyExempt && (
                            <span className="text-[10px] font-normal text-amber-700 block">
                              (معفى طبياً)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {student.gender === 'M' ? 'ذكر' : 'أنثى'}
                        </td>

                        {/* Test Scores */}
                        {activeTests.map((t) => {
                          const testData = sGrades?.testScores?.[t.id];
                          const rawVal = testData?.rawValue ?? '';
                          const grade20 = testData?.calculatedGrade ?? 0;

                          return (
                            <td key={t.id} className="py-2 px-3 text-center">
                              {student.isMedicallyExempt ? (
                                <span className="text-slate-400 font-medium">معفى</span>
                              ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                  <input
                                    type="number"
                                    step="0.1"
                                    placeholder={t.unit}
                                    value={rawVal}
                                    onChange={(e) =>
                                      handleRawScoreChange(
                                        student.id,
                                        t.id,
                                        e.target.value === '' ? '' : Number(e.target.value),
                                        student.gender
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-center font-bold bg-slate-50 border border-slate-200 rounded-sm text-slate-900 no-print"
                                  />
                                  <span className="font-bold tabular-nums text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm text-xs">
                                    {grade20 > 0 ? grade20 : '—'}
                                  </span>
                                </div>
                              )}
                            </td>
                          );
                        })}

                        {/* Conduct */}
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={conduct}
                            onChange={(e) => handleConductChange(student.id, Number(e.target.value))}
                            className="w-14 px-2 py-1 text-center font-bold bg-slate-50 border border-slate-200 rounded-sm text-slate-900 no-print"
                          />
                          <span className="hidden print:inline font-bold tabular-nums">
                            {conduct}
                          </span>
                        </td>

                        {/* Final Average */}
                        <td className="py-3 px-4 text-center font-black tabular-nums bg-emerald-50/50 text-slate-900 text-sm">
                          <span
                            className={`font-black ${
                              Number(avg) >= 10 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {avg}
                          </span>
                        </td>

                        {/* Actions: Clear / Delete Student Grade */}
                        <td className="py-2 px-2 text-center no-print">
                          <button
                            type="button"
                            onClick={() => handleClearStudentGrade(student.id)}
                            title="مسح وتفريغ علامات هذا التلميذ"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>


          <div className="flex justify-between items-center no-print">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>تصدير كشف النقاط الفصلي (CSV)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كشف النقاط الرسمي</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 2: BASE COMPETENCY OBSERVATION GRID (الكفاءة القاعدية) */}
      {/* ============================================================= */}
      {activeTab === 'base_competency' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>شبكة الملاحظة والتقويم لمعايير الكفاءة القاعدية (حسب المنهاج الجزائري)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تقويم التحكم في المعايير الحركية، التنسيق، وتسيير الفضاء والجهد البدني (سلم من 0 إلى 20).
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الشبكة</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">الرقم</th>
                    <th className="py-3 px-4 w-44">اسم ولقب التلميذ</th>
                    <th className="py-3 px-3 text-center min-w-[120px]">
                      <span>إدراك الفضاء وتوزيع الجهد</span>
                      <span className="block text-[10px] text-slate-500 font-normal">سلم /5</span>
                    </th>
                    <th className="py-3 px-3 text-center min-w-[120px]">
                      <span>التنسيق والتحكم التقني</span>
                      <span className="block text-[10px] text-slate-500 font-normal">سلم /5</span>
                    </th>
                    <th className="py-3 px-3 text-center min-w-[120px]">
                      <span>الروح الرياضية والتعاون</span>
                      <span className="block text-[10px] text-slate-500 font-normal">سلم /5</span>
                    </th>
                    <th className="py-3 px-3 text-center min-w-[120px]">
                      <span>احترام القوانين والسلامة</span>
                      <span className="block text-[10px] text-slate-500 font-normal">سلم /5</span>
                    </th>
                    <th className="py-3 px-3 text-center bg-emerald-50 text-emerald-950 font-black w-24">
                      المجموع /20
                    </th>
                    <th className="py-3 px-3 text-center w-28">مستوى التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((st, idx) => {
                    const comp = baseCompetencyGrades[st.id] || { c1: 4.5, c2: 4, c3: 4.5, c4: 4.5 };
                    const total = comp.c1 + comp.c2 + comp.c3 + comp.c4;
                    const level =
                      total >= 16
                        ? { text: 'متحكم جداً (A)', color: 'bg-emerald-100 text-emerald-800' }
                        : total >= 13
                        ? { text: 'متحكم (B)', color: 'bg-blue-100 text-blue-800' }
                        : total >= 10
                        ? { text: 'في طريق التحكم (C)', color: 'bg-amber-100 text-amber-800' }
                        : { text: 'غير متحكم (D)', color: 'bg-rose-100 text-rose-800' };

                    return (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {st.firstName} {st.lastName}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.5"
                            value={comp.c1}
                            onChange={(e) =>
                              setBaseCompetencyGrades({
                                ...baseCompetencyGrades,
                                [st.id]: { ...comp, c1: parseFloat(e.target.value) || 0 },
                              })
                            }
                            className="w-14 px-2 py-1 text-center font-bold bg-slate-50 border border-slate-200 rounded text-slate-900"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.5"
                            value={comp.c2}
                            onChange={(e) =>
                              setBaseCompetencyGrades({
                                ...baseCompetencyGrades,
                                [st.id]: { ...comp, c2: parseFloat(e.target.value) || 0 },
                              })
                            }
                            className="w-14 px-2 py-1 text-center font-bold bg-slate-50 border border-slate-200 rounded text-slate-900"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.5"
                            value={comp.c3}
                            onChange={(e) =>
                              setBaseCompetencyGrades({
                                ...baseCompetencyGrades,
                                [st.id]: { ...comp, c3: parseFloat(e.target.value) || 0 },
                              })
                            }
                            className="w-14 px-2 py-1 text-center font-bold bg-slate-50 border border-slate-200 rounded text-slate-900"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.5"
                            value={comp.c4}
                            onChange={(e) =>
                              setBaseCompetencyGrades({
                                ...baseCompetencyGrades,
                                [st.id]: { ...comp, c4: parseFloat(e.target.value) || 0 },
                              })
                            }
                            className="w-14 px-2 py-1 text-center font-bold bg-slate-50 border border-slate-200 rounded text-slate-900"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-black tabular-nums bg-emerald-50/70 text-emerald-900">
                          {total.toFixed(1)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${level.color}`}>
                            {level.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 3: LEARNING OBJECTIVE PROGRESSION (الهدف التعلمي والتطور) */}
      {/* ============================================================= */}
      {activeTab === 'objective_progression' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>شبكة تقويم الهدف التعلمي وقياس التطور الحاصل وفق المنهاج (القبلي مقابل البعدي)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  مقارنة الوضعية الانطلاقية التشخيصية مع المكتسبات الختامية وحساب نسبة التطور الحركي المحققة.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة شبكة التطور</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-4 w-44">اسم ولقب التلميذ</th>
                    <th className="py-3 px-3">النشاط الرياضي الممارس</th>
                    <th className="py-3 px-3 text-center w-28">القياس القبلي (الانطلاقي)</th>
                    <th className="py-3 px-3 text-center w-28">القياس البعدي (الختامي)</th>
                    <th className="py-3 px-3 text-center w-24">الفارق (+ / -)</th>
                    <th className="py-3 px-3 text-center w-36">نسبة التطور %</th>
                    <th className="py-3 px-3">مستوى تحقيق مؤشر الكفاءة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((st, idx) => {
                    const prog = progressionGrades[st.id] || {
                      preScore: 11.5,
                      postScore: 15.5,
                      activityName: 'كرة اليد / ألعاب القوى',
                    };
                    const diff = prog.postScore - prog.preScore;
                    const percent = prog.preScore > 0 ? Math.round((diff / prog.preScore) * 100) : 0;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {st.firstName} {st.lastName}
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-semibold">{prog.activityName}</td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            step="0.5"
                            value={prog.preScore}
                            onChange={(e) =>
                              setProgressionGrades({
                                ...progressionGrades,
                                [st.id]: { ...prog, preScore: parseFloat(e.target.value) || 0 },
                              })
                            }
                            className="w-16 px-2 py-1 text-center font-bold bg-slate-50 border border-slate-200 rounded text-slate-900"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            step="0.5"
                            value={prog.postScore}
                            onChange={(e) =>
                              setProgressionGrades({
                                ...progressionGrades,
                                [st.id]: { ...prog, postScore: parseFloat(e.target.value) || 0 },
                              })
                            }
                            className="w-16 px-2 py-1 text-center font-bold bg-slate-50 border border-slate-200 rounded text-slate-900"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-black font-mono">
                          <span className={diff >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                            {diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center gap-1.5 justify-center">
                            <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(0, percent * 2))}%` }}
                              />
                            </div>
                            <span className="font-bold tabular-nums text-[11px] text-slate-800">
                              {percent > 0 ? `+${percent}%` : `${percent}%`}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-emerald-900 font-semibold">
                            {percent >= 25
                              ? 'تطور نوعي ممتاز وتجاوز الصعوبة الحركية ✓'
                              : percent >= 10
                              ? 'تطور إيجابي ملحوظ في الأداء ✓'
                              : 'استقرار نسبي مع الحاجة لدعم حركي'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 4: TACTILE QUICK FIELD SCORING PAD (التنقيط السريع) */}
      {/* ============================================================= */}
      {activeTab === 'quick_pad' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            {/* Quick Pad Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">الاختبار المراد تنقيطه:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold overflow-x-auto">
                  {activeTests.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setQuickTestId(t.id)}
                      className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                        quickTestId === t.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setQuickTestId('conduct')}
                    className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                      quickTestId === 'conduct'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    المواظبة والسلوك
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    checked={quickAutoAdvance}
                    onChange={(e) => setQuickAutoAdvance(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>انتقال تلقائي للتلميذ التالي</span>
                </label>
              </div>
            </div>

            {/* Focused Student Big Touch Scoring Card */}
            {currentQuickStudent && (
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
                      {quickStudentIndex + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black">
                          {currentQuickStudent.firstName} {currentQuickStudent.lastName}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {currentQuickStudent.gender === 'M' ? 'ذكر' : 'أنثى'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        الرقم: {currentQuickStudent.studentNumber || `ST-${quickStudentIndex + 1}`} · {currentClass?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setQuickStudentIndex((prev) => (prev > 0 ? prev - 1 : quickFilteredStudents.length - 1))
                      }
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>السابق</span>
                    </button>
                    <span className="text-xs text-slate-400 font-mono">
                      {quickStudentIndex + 1} / {quickFilteredStudents.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickStudentIndex((prev) => (prev + 1 < quickFilteredStudents.length ? prev + 1 : 0))
                      }
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <span>التالي</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Score Buttons Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      اضغط على العلامة المباشرة (/20) لتسجيلها فورا:
                    </span>
                    {feedbackEffect && (
                      <span className="text-xs text-emerald-400 font-black animate-pulse">
                        {feedbackEffect}
                      </span>
                    )}
                  </div>

                  {/* Direct Grade Buttons /20 */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {[20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5].map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => triggerQuickScore(currentQuickStudent.id, grade)}
                        className={`py-3 rounded-xl font-black text-sm transition-all shadow-md active:scale-90 ${
                          grade >= 16
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : grade >= 12
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : grade >= 10
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-rose-700 hover:bg-rose-600 text-white'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>

                  {/* Quick Special Cases & Adjustments */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerQuickScore(currentQuickStudent.id, 18, undefined, 'إعفاء طبي (18/20)')}
                      className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>معفى طبياً (18/20)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerQuickScore(currentQuickStudent.id, 0, undefined, 'غياب (0/20)')}
                      className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>غياب (0/20)</span>
                    </button>

                    {/* Fine adjustments */}
                    <button
                      type="button"
                      onClick={() => {
                        const curScore = gradesState[currentQuickStudent.id]?.testScores?.[quickTestId]?.calculatedGrade ?? 10;
                        triggerQuickScore(currentQuickStudent.id, Math.min(20, curScore + 0.5));
                      }}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-emerald-300 border border-slate-600 rounded-xl text-xs font-black shadow-xs"
                      title="زيادة نصف نقطة (+0.5)"
                    >
                      +0.5
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const curScore = gradesState[currentQuickStudent.id]?.testScores?.[quickTestId]?.calculatedGrade ?? 10;
                        triggerQuickScore(currentQuickStudent.id, Math.max(0, curScore - 0.5));
                      }}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-amber-300 border border-slate-600 rounded-xl text-xs font-black shadow-xs"
                      title="إنقاص نصف نقطة (-0.5)"
                    >
                      -0.5
                    </button>

                    {/* Clear / Delete Score */}
                    <button
                      type="button"
                      onClick={() => handleClearStudentGrade(currentQuickStudent.id)}
                      className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
                      title="مسح وتفريغ علامة هذا التلميذ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>مسح النقطة</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Students Selector Strip */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">قائمة تلاميذ الفوج للتنقل السريع:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {classStudents.map((st, idx) => {
                  const sRecord = gradesState[st.id];
                  const hasGrade =
                    quickTestId === 'conduct'
                      ? sRecord?.attendanceConductGrade
                      : sRecord?.testScores?.[quickTestId]?.calculatedGrade;

                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setQuickStudentIndex(idx)}
                      className={`p-2 rounded-xl text-right text-xs border transition-all ${
                        quickStudentIndex === idx
                          ? 'border-emerald-600 bg-emerald-50 font-black shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="block font-bold truncate">
                        {idx + 1}. {st.firstName}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {hasGrade ? `نقطة: ${hasGrade}` : 'لم يُنقط'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 5: ANNUAL PERFORMANCE & PROGRESSION REPORT (الحصيلة السنوية) */}
      {/* ============================================================= */}
      {activeTab === 'annual_report' && (
        <div className="space-y-6">
          {reportSubView === 'individual' ? (
            /* --- INDIVIDUAL STUDENT ANNUAL REPORT CARD (FICHE DE BILAN) --- */
            <div className="space-y-6">
              {/* Student Selector Bar in screen mode */}
              <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">اختيار التلميذ لعرض التقرير السنوي:</span>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-xs"
                  >
                    {classStudents.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        {idx + 1}. {s.firstName} {s.lastName} {s.isMedicallyExempt ? '(معفى طبياً)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة بطاقة التقرير السنوي الفردي</span>
                  </button>
                </div>
              </div>

              {selectedStudentData && (
                <div className="bg-white rounded-2xl border-2 border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 print:border-2 print:border-black print:p-6">
                  {/* Official Institutional Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-4">
                    <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                    <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية</p>
                    <div className="flex justify-between items-center text-xs mt-3 px-2">
                      <span>المؤسسة: {schoolName}</span>
                      <span>الموسم الدراسي: {academicYear}</span>
                      <span>{teacherName}</span>
                    </div>
                    <div className="inline-block mt-4 px-6 py-1.5 bg-slate-900 text-white rounded-lg print:bg-black print:text-white">
                      <h1 className="text-lg font-black tracking-wide">
                        بطاقة تقرير الأداء السنوي للتلميذ في التربية البدنية والرياضية
                      </h1>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      Fiche de Bilan Annuel des Performances et de l&apos;Assiduité (EPS)
                    </p>
                  </div>

                  {/* 1. Student Identity & Physical/Health Profile */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>1. الهوية والملف البدني والصحي للتلميذ</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block">الاسم واللقب:</span>
                        <strong className="text-sm font-black text-slate-900">
                          {selectedStudentData.student.firstName} {selectedStudentData.student.lastName}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">الفوج والمستوى:</span>
                        <strong className="text-slate-800">{currentClass?.name} ({currentClass?.gradeLevel})</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">تاريخ الميلاد:</span>
                        <span className="font-mono tabular-nums text-slate-800">{selectedStudentData.student.birthDate || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">الرقم التعريفي:</span>
                        <span className="font-mono text-slate-800">{selectedStudentData.student.studentNumber || '—'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-500 block">القامة / الوزن:</span>
                        <span className="text-slate-800 font-bold tabular-nums">
                          {selectedStudentData.student.heightCm ? `${selectedStudentData.student.heightCm} سم` : '—'} /{' '}
                          {selectedStudentData.student.weightKg ? `${selectedStudentData.student.weightKg} كغ` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">مؤشر كتلة الجسم (BMI):</span>
                        {(() => {
                          const bmi = calculateBMI(selectedStudentData.student.weightKg, selectedStudentData.student.heightCm);
                          return bmi.bmi ? (
                            <span className="font-bold text-slate-900 tabular-nums">
                              {bmi.bmi} <span className={`text-[11px] ${bmi.badgeColor}`}>({bmi.category})</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          );
                        })()}
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block">الحالة الصحية / الإعفاء:</span>
                        {selectedStudentData.student.isMedicallyExempt ? (
                          <span className="font-bold text-amber-800 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>معفى طبياً ({selectedStudentData.student.medicalNotes || 'إعفاء قانوني معتمد'})</span>
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>لائق بدنياً لكافة الأنشطة الرياضية المقررة</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Attendance & Sports Kit Commitment (سجل المواظبة والزي الرياضي) */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>2. حصيلة الحضور والمواظبة والالتزام بالزي الرياضي (Bilan d&apos;Assiduité)</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">الحصص الإجمالية</span>
                        <strong className="text-base font-bold tabular-nums text-slate-900">
                          {selectedStudentData.totalRecordedSessions} حصص
                        </strong>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="text-emerald-700 block text-[11px] font-semibold">حضور بالبذلة</span>
                        <strong className="text-base font-bold tabular-nums text-emerald-900">
                          {selectedStudentData.presentKit}
                        </strong>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="text-amber-700 block text-[11px] font-semibold">بدون بذلة</span>
                        <strong className="text-base font-bold tabular-nums text-amber-900">
                          {selectedStudentData.presentNoKit}
                        </strong>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="text-rose-700 block text-[11px] font-semibold">الغيابات</span>
                        <strong className="text-base font-bold tabular-nums text-rose-900">
                          {selectedStudentData.absent}
                        </strong>
                      </div>

                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                        <span className="text-emerald-800 block text-[11px] font-bold">نسبة المواظبة</span>
                        <strong className="text-base font-black tabular-nums text-emerald-900">
                          {selectedStudentData.attendanceRate}%
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs px-2 pt-1">
                      <span className="text-slate-600">
                        نسبة الالتزام بإحضار البذلة الرياضية الكاملة:
                      </span>
                      <strong className={`tabular-nums ${selectedStudentData.kitComplianceRate >= 80 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}`}>
                        {selectedStudentData.kitComplianceRate}%
                      </strong>
                    </div>
                  </div>

                  {/* 3. Term Evaluations & Annual Average (حصيلة التقويم والمعدل السنوي) */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span>3. كشف التقويم الفصلي والمعدل السنوي العام لمادة التربية البدنية والرياضية</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-500 block">معدل الفصل الأول</span>
                        <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                          {selectedStudentData.t1Grade} <span className="text-xs text-slate-500 font-normal">/20</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-500 block">معدل الفصل الثاني</span>
                        <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                          {selectedStudentData.t2Grade} <span className="text-xs text-slate-500 font-normal">/20</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-500 block">معدل الفصل الثالث</span>
                        <div className="text-xl font-bold tabular-nums text-slate-900 mt-1">
                          {selectedStudentData.t3Grade} <span className="text-xs text-slate-500 font-normal">/20</span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs print:bg-black print:text-white">
                        <span className="text-xs text-emerald-100 block font-semibold print:text-slate-200">المعدل السنوي العام</span>
                        <div className="text-2xl font-black tabular-nums mt-0.5">
                          {selectedStudentData.annualAverage} <span className="text-xs font-normal opacity-90">/20</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-slate-600">منحنى تطور الأداء عبر الفصول:</span>
                        <strong className={selectedStudentData.progressionColor}>
                          {selectedStudentData.progressionLabel}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">التقدير والمرتبة الشرفية:</span>
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs border ${selectedStudentData.ratingColor}`}>
                          {selectedStudentData.ratingText}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Qualitative Pedagogical Appreciation (الملاحظة البيداغوجية للأستاذ) */}
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>4. الملاحظة البيداغوجية والتقييم التربوي الشامل (Appréciation Pédagogique)</span>
                      </h3>
                      <span className="text-[11px] text-emerald-800 no-print font-medium">
                        توليد آلي مبني على الحضور والنقاط (قابل للتعديل)
                      </span>
                    </div>

                    <textarea
                      rows={3}
                      value={customTeacherAppreciation[selectedStudentData.student.id] ?? selectedStudentData.autoAppreciation}
                      onChange={(e) =>
                        setCustomTeacherAppreciation({
                          ...customTeacherAppreciation,
                          [selectedStudentData.student.id]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-slate-900 text-xs leading-relaxed font-sans"
                    />
                  </div>

                  {/* 5. Official Signatures Section for Print */}
                  <div className="grid grid-cols-3 gap-6 text-center text-xs mt-8 pt-6 border-t-2 border-slate-900 print:mt-6">
                    <div>
                      <p className="font-bold">توقيع وختم أستاذ المادة</p>
                      <div className="h-16"></div>
                      <p className="text-slate-700 font-semibold">{teacherName}</p>
                    </div>
                    <div>
                      <p className="font-bold">تأشيرة مدير المؤسسة</p>
                      <div className="h-16"></div>
                      <p className="text-slate-700 font-semibold">{schoolName}</p>
                    </div>
                    <div>
                      <p className="font-bold">تأشيرة مفتش التربية الوطنية</p>
                      <div className="h-16"></div>
                      <p className="text-slate-700 font-semibold">مفتشية التربية البدنية والرياضية</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* --- CLASS ANNUAL SUMMARY TABLE (حصيلة القسم السنوية الشاملة) --- */
            <div className="space-y-4">
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
                  الحصيلة السنوية العامة لأداء التلاميذ والمواظبة في التربية البدنية والرياضية
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  الفوج التربوي: {currentClass?.name} ({currentClass?.gradeLevel}) · عدد التلاميذ: {classAnnualReportData.length}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3 w-12 text-center">الرقم</th>
                        <th className="py-3 px-4 w-44">اسم ولقب التلميذ</th>
                        <th className="py-3 px-3 w-28">الملف الصحي</th>
                        <th className="py-3 px-3 text-center w-24">المواظبة %</th>
                        <th className="py-3 px-3 text-center w-24">الزي الرياضي %</th>
                        <th className="py-3 px-3 text-center w-20">معدل ف1</th>
                        <th className="py-3 px-3 text-center w-20">معدل ف2</th>
                        <th className="py-3 px-3 text-center w-20">معدل ف3</th>
                        <th className="py-3 px-4 text-center w-28 bg-emerald-50 text-emerald-950 font-black">
                          المعدل السنوي /20
                        </th>
                        <th className="py-3 px-3 w-36">التقدير العام</th>
                        <th className="py-3 px-4">الملاحظة البيداغوجية للأستاذ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classAnnualReportData.map((d) => (
                        <tr key={d.student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-600">
                            {d.index}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {d.student.firstName} {d.student.lastName}
                          </td>
                          <td className="py-3 px-3">
                            {d.student.isMedicallyExempt ? (
                              <span className="font-semibold text-amber-700 flex items-center gap-1">
                                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                <span>معفى طبياً</span>
                              </span>
                            ) : (
                              <span className="text-emerald-700">لائق</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-800">
                            {d.attendanceRate}%
                          </td>
                          <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-800">
                            {d.kitComplianceRate}%
                          </td>
                          <td className="py-3 px-3 text-center tabular-nums text-slate-700">
                            {d.t1Grade}
                          </td>
                          <td className="py-3 px-3 text-center tabular-nums text-slate-700">
                            {d.t2Grade}
                          </td>
                          <td className="py-3 px-3 text-center tabular-nums text-slate-700">
                            {d.t3Grade}
                          </td>
                          <td className="py-3 px-4 text-center font-black tabular-nums bg-emerald-50/50 text-emerald-900 text-sm">
                            {d.annualAverage}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-sm font-semibold text-[11px] border ${d.ratingColor}`}>
                              {d.ratingText}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 leading-relaxed text-[11px]">
                            {customTeacherAppreciation[d.student.id] ?? d.autoAppreciation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Signatures for Print */}
              <div className="hidden print:grid grid-cols-2 gap-12 text-center text-xs mt-12 pt-8 border-t border-slate-300">
                <div>
                  <p className="font-bold">توقيع وختم أستاذ المادة</p>
                  <div className="h-16"></div>
                  <p className="text-slate-600">{teacherName}</p>
                </div>
                <div>
                  <p className="font-bold">تأشيرة مدير المؤسسة</p>
                  <div className="h-16"></div>
                  <p className="text-slate-600">المؤسسة: {schoolName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
