import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CurriculumImporter } from './components/CurriculumImporter';
import { AnnualPlanManager } from './components/AnnualPlanManager';
import { LearningUnitsManager } from './components/LearningUnitsManager';
import { LessonPlanner } from './components/LessonPlanner';
import { LogbookManager } from './components/LogbookManager';
import { ClassesManager } from './components/ClassesManager';
import { AttendanceManager } from './components/AttendanceManager';
import { EvaluationManager } from './components/EvaluationManager';
import { FieldTimer } from './components/FieldTimer';
import { TacticalBoard } from './components/TacticalBoard';
import { EquipmentManager } from './components/EquipmentManager';
import { AccidentReportManager } from './components/AccidentReportManager';
import { MeetingsManager } from './components/MeetingsManager';
import { PedagogicalBinderManager } from './components/PedagogicalBinderManager';
import { SchoolSportsManager } from './components/SchoolSportsManager';
import { EpsAiDeveloper } from './components/EpsAiDeveloper';
import { InstallAppModal } from './components/InstallAppModal';
import { loadAppData, saveAppData, AppData, INITIAL_INSPECTOR_VISITS, INITIAL_ASSM_INFO, INITIAL_PROFILE_DETAILS } from './utils/storage';
import { AnnualProgram, LearningUnit, LessonPlan } from './types';

export default function App() {
  const [appData, setAppData] = useState<AppData>(loadAppData);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  const handleUpdateAppData = (newData: AppData) => {
    setAppData(newData);
    saveAppData(newData);
  };

  const handleImportBackup = (imported: AppData) => {
    setAppData(imported);
    saveAppData(imported);
    alert('تم استيراد النسخة الاحتياطية بنجاح!');
  };

  const handleOpenLessonPlanForSession = (_unitId: string, _sessionNum: number) => {
    setActiveTab('lesson_plans');
  };

  const handleApplyCurriculum = (
    newProgram: AnnualProgram,
    newUnits: LearningUnit[],
    newPlans: LessonPlan[]
  ) => {
    const updatedData: AppData = {
      ...appData,
      annualPrograms: [
        newProgram,
        ...appData.annualPrograms.filter((p) => p.gradeLevel !== newProgram.gradeLevel),
      ],
      learningUnits: [
        ...newUnits,
        ...appData.learningUnits.filter((u) => u.gradeLevel !== newProgram.gradeLevel),
      ],
      lessonPlans: [...newPlans, ...appData.lessonPlans],
    };
    handleUpdateAppData(updatedData);
    setActiveTab('annual_plan');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appData={appData}
        onImportBackup={handleImportBackup}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            appData={appData}
            setActiveTab={setActiveTab}
            onUpdateAppData={handleUpdateAppData}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {activeTab === 'curriculum_importer' && (
          <CurriculumImporter
            academicYear={appData.academicYear}
            onApplyCurriculum={handleApplyCurriculum}
          />
        )}

        {activeTab === 'annual_plan' && (
          <AnnualPlanManager
            annualPrograms={appData.annualPrograms}
            onUpdatePrograms={(programs) =>
              handleUpdateAppData({ ...appData, annualPrograms: programs })
            }
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'learning_units' && (
          <LearningUnitsManager
            learningUnits={appData.learningUnits}
            onUpdateLearningUnits={(units) =>
              handleUpdateAppData({ ...appData, learningUnits: units })
            }
            onOpenLessonPlanForSession={handleOpenLessonPlanForSession}
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'lesson_plans' && (
          <LessonPlanner
            lessonPlans={appData.lessonPlans}
            onUpdateLessonPlans={(plans) =>
              handleUpdateAppData({ ...appData, lessonPlans: plans })
            }
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'pedagogical_binder' && (
          <PedagogicalBinderManager
            teacherName={appData.teacherName}
            teacherRank={appData.teacherRank}
            teacherDegree={appData.teacherDegree}
            appointmentDate={appData.appointmentDate}
            tenureDate={appData.tenureDate}
            weeklyHours={appData.weeklyHours}
            schoolName={appData.schoolName}
            inspectorName={appData.inspectorName}
            academicYear={appData.academicYear}
            classes={appData.classes}
            students={appData.students}
            annualPrograms={appData.annualPrograms}
            learningUnits={appData.learningUnits}
            inspectorVisits={appData.inspectorVisits || INITIAL_INSPECTOR_VISITS}
            assmInfo={appData.assmInfo || INITIAL_ASSM_INFO}
            profileDetails={appData.profileDetails || INITIAL_PROFILE_DETAILS}
            onUpdateVisits={(visits) =>
              handleUpdateAppData({ ...appData, inspectorVisits: visits })
            }
            onUpdateASSM={(assm) =>
              handleUpdateAppData({ ...appData, assmInfo: assm })
            }
            onUpdateProfileDetails={(details) =>
              handleUpdateAppData({ ...appData, profileDetails: details })
            }
            onUpdateTeacherInfo={(info) =>
              handleUpdateAppData({
                ...appData,
                ...info,
              })
            }
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingsManager
            meetings={appData.pedagogicalMeetings || []}
            onUpdateMeetings={(meetings) =>
              handleUpdateAppData({ ...appData, pedagogicalMeetings: meetings })
            }
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'accidents' && (
          <AccidentReportManager
            accidentReports={appData.accidentReports || []}
            classes={appData.classes}
            students={appData.students}
            onUpdateAccidentReports={(reports) =>
              handleUpdateAppData({ ...appData, accidentReports: reports })
            }
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'logbook' && (
          <LogbookManager
            classes={appData.classes}
            logbookEntries={appData.logbookEntries || []}
            onUpdateLogbook={(entries) =>
              handleUpdateAppData({ ...appData, logbookEntries: entries })
            }
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'students' && (
          <ClassesManager
            classes={appData.classes}
            students={appData.students}
            onUpdateClasses={(cls) => handleUpdateAppData({ ...appData, classes: cls })}
            onUpdateStudents={(std) => handleUpdateAppData({ ...appData, students: std })}
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceManager
            classes={appData.classes}
            students={appData.students}
            attendanceRecords={appData.attendance}
            onUpdateAttendance={(records) =>
              handleUpdateAppData({ ...appData, attendance: records })
            }
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationManager
            classes={appData.classes}
            students={appData.students}
            evaluations={appData.evaluations}
            attendanceRecords={appData.attendance}
            testBank={appData.customTests}
            onUpdateEvaluations={(evals) =>
              handleUpdateAppData({ ...appData, evaluations: evals })
            }
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'timer' && <FieldTimer />}

        {activeTab === 'tactical' && <TacticalBoard />}

        {activeTab === 'equipment' && (
          <EquipmentManager
            equipment={appData.equipment}
            onUpdateEquipment={(equip) =>
              handleUpdateAppData({ ...appData, equipment: equip })
            }
            teacherName={appData.teacherName}
            schoolName={appData.schoolName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'school_sports' && (
          <SchoolSportsManager
            students={appData.students}
            classes={appData.classes}
            schoolName={appData.schoolName}
            teacherName={appData.teacherName}
            academicYear={appData.academicYear}
          />
        )}

        {activeTab === 'ai_developer' && <EpsAiDeveloper />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            منصة أستاذ التربية البدنية والرياضية (EPS Pro) · إعداد ومتابعة التعلمات وفق منهاج وزارة التربية الوطنية.
          </p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span>{appData.schoolName}</span>
            <span aria-hidden="true">·</span>
            <span>{appData.academicYear}</span>
            <span aria-hidden="true">·</span>
            <span>{appData.teacherName}</span>
          </div>
        </div>
      </footer>

      {/* PWA Download and Install Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        appData={appData}
      />
    </div>
  );
}
