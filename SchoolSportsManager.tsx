import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Calendar,
  Medal,
  Plus,
  Trash2,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { Student, ClassGroup } from '../types';

interface SchoolTournament {
  id: string;
  name: string;
  sport: string;
  category: 'أصاغر' | 'أشبال' | 'أواسط' | 'صغريات' | 'شبلات' | 'وسطيات';
  stage: 'مرحلة تصفيات الدائرة' | 'البطولة الولائية' | 'البطولة الجهوية' | 'البطولة الوطنية';
  date: string;
  location: string;
  opponentSchool: string;
  resultScore?: string;
  rankingOutcome?: string;
  participantsCount: number;
}

interface SchoolTeamMember {
  studentId: string;
  sport: string;
  position: string;
  licenseNumber: string;
}

interface SchoolSportsManagerProps {
  students: Student[];
  classes: ClassGroup[];
  schoolName: string;
  teacherName: string;
  academicYear: string;
}

export const SchoolSportsManager: React.FC<SchoolSportsManagerProps> = ({
  students,
  classes,
  schoolName,
  teacherName,
  academicYear,
}) => {
  const [activeTab, setActiveTab] = useState<'asss_profile' | 'teams' | 'tournaments' | 'honors'>('asss_profile');

  // Tournaments state with realistic Algerian school competitions
  const [tournaments, setTournaments] = useState<SchoolTournament[]>([
    {
      id: 'tourn-1',
      name: 'بطولة الدائرة المدرسية لكرة اليد (ذكور)',
      sport: 'كرة اليد',
      category: 'أشبال',
      stage: 'مرحلة تصفيات الدائرة',
      date: '2026-11-12',
      location: 'القاعة متعددة الرياضات بالمقاطعة',
      opponentSchool: 'ثانوية الشهيد زيغود يوسف',
      resultScore: '22 - 18',
      rankingOutcome: 'تأهل إلى النهائي الولائي 🏆',
      participantsCount: 14,
    },
    {
      id: 'tourn-2',
      name: 'البطولة الولائية للعدو الريفي المدرسي (Cross-Country)',
      sport: 'ألعاب القوى (العدو الريفي)',
      category: 'أواسط',
      stage: 'البطولة الولائية',
      date: '2026-12-05',
      location: 'غابة باينام / المضمار الولائي',
      opponentSchool: 'مختلف ثانويات الولاية (32 مؤسسة)',
      resultScore: 'المرتبة الأولى فردي + المرتبة الثانية حسب الفرق',
      rankingOutcome: 'ميدالية ذهبية + تأهل للبطولة الجهوية 🥇',
      participantsCount: 8,
    },
    {
      id: 'tourn-3',
      name: 'دوري كرة السلة للفتيات (بين الثانويات)',
      sport: 'كرة السلة',
      category: 'شبلات',
      stage: 'مرحلة تصفيات الدائرة',
      date: '2026-12-18',
      location: 'ملعب ثانوية مفدي زكرياء',
      opponentSchool: 'ثانوية الإخوة عمارة',
      resultScore: '34 - 28',
      rankingOutcome: 'فوز مستحق وتأهل للدور نصف النهائي',
      participantsCount: 10,
    },
  ]);

  // Selected team sport filter
  const [selectedSport, setSelectedSport] = useState<string>('كرة اليد');

  // Add tournament modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTournName, setNewTournName] = useState('');
  const [newSport, setNewSport] = useState('كرة القدم');
  const [newCategory, setNewCategory] = useState<'أصاغر' | 'أشبال' | 'أواسط'>('أشبال');
  const [newStage, setNewStage] = useState<'مرحلة تصفيات الدائرة' | 'البطولة الولائية' | 'البطولة الجهوية' | 'البطولة الوطنية'>('مرحلة تصفيات الدائرة');
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newLocation, setNewLocation] = useState('ملعب المؤسسة');
  const [newOpponent, setNewOpponent] = useState('ثانوية مجاورة');

  const handleAddTournament = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SchoolTournament = {
      id: `tourn-${Date.now()}`,
      name: newTournName,
      sport: newSport,
      category: newCategory,
      stage: newStage,
      date: newDate,
      location: newLocation,
      opponentSchool: newOpponent,
      participantsCount: 12,
      rankingOutcome: 'قيد التنافس والتحضير',
    };
    setTournaments([created, ...tournaments]);
    setShowAddModal(false);
    setNewTournName('');
  };

  const handleDeleteTournament = (id: string) => {
    setTournaments(tournaments.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Official Print Header */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
        <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية - الرابطة الولائية للرياضة المدرسية</p>
        <div className="flex justify-between items-center text-xs mt-3 px-2">
          <span>المؤسسة: {schoolName}</span>
          <span>الموسم الرياضي: {academicYear}</span>
          <span>المؤطر: {teacherName}</span>
        </div>
        <h1 className="text-xl font-black mt-4 underline">
          سجل الجمعية الرياضية المدرسية (ASSS) والأنشطة اللاصفية
        </h1>
      </div>

      {/* Screen Header & Top Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  الرياضة المدرسية والأنشطة اللاصفية (ASSS)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-full">
                  الجمعية الرياضية المدرسية
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                إدارة الجمعية الرياضية المدرسية، المنتخبات والمواهب، رزنامة البطولات، وسجل الألقاب والتتويجات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل منافسة / بطولة</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة السجل</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('asss_profile')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'asss_profile'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>بطاقة الجمعية الرياضية (ASSS)</span>
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'teams'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>المنتخبات المدرسية والمواهب</span>
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'tournaments'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>رزنامة ونتائج المنافسات ({tournaments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('honors')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'honors'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Medal className="w-3.5 h-3.5" />
            <span>لوحة الشرف والتتويجات</span>
          </button>
        </div>
      </div>

      {/* Tab 1: ASSS Profile */}
      {activeTab === 'asss_profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>البطاقة الفنية للجمعية الثقافية والرياضية المدرسية</span>
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md border border-emerald-200">
                منخرطة رسمياً برقم: ASSS/2026/042
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">المؤسسة التعليمية:</span>
                <span className="font-black text-slate-900">{schoolName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">الموسم الدراسي والرياضي:</span>
                <span className="font-black text-slate-900">{academicYear}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">رئيس الجمعية بحكم المنصب:</span>
                <span className="font-black text-slate-900">مدير المؤسسة</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">الكاتب العام والمؤطر الفني:</span>
                <span className="font-black text-slate-900">{teacherName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">أمين المال:</span>
                <span className="font-black text-slate-900">المقتصد / المسير المالي</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">عدد التلاميذ المنخرطين في الإجازات:</span>
                <span className="font-black text-emerald-700">76 تلميذاً وتلميذة</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
              <span className="font-black block">أهداف برنامج النشاط اللاصفي والجمعية المدرسية:</span>
              <ul className="list-disc list-inside space-y-1 leading-relaxed text-[11px] text-slate-700">
                <li>اكتشاف وصقل المواهب الرياضية الشابة في الأطوار التعليمية.</li>
                <li>ترسيخ قيم الروح الرياضية، الانضباط، والعمل الجماعي بين التلاميذ.</li>
                <li>تمثيل المؤسسة التعليمية في المنافسات الرسمية للرابطة المدرسية.</li>
                <li>تنشيط الحياة المدرسية وإشراك أكبر عدد ممكن من التلاميذ خارج الحصص الرسمية.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <Activity className="w-4 h-4" />
                <span>إحصائيات الإجازات المدرسية</span>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-700">
                  <span>كرة اليد (ذكور + إناث):</span>
                  <span className="font-bold text-amber-300">28 إجازة</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-700">
                  <span>العدو الريفي وألعاب القوى:</span>
                  <span className="font-bold text-amber-300">22 إجازة</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-700">
                  <span>كرة السلة:</span>
                  <span className="font-bold text-amber-300">14 إجازة</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>كرة القدم المصغرة:</span>
                  <span className="font-bold text-amber-300">12 إجازة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Teams & Talent Roster */}
      {activeTab === 'teams' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">اختر المنتخب المدرسي:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
                {['كرة اليد', 'ألعاب القوى والعدو', 'كرة السلة', 'كرة القدم'].map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      selectedSport === sport
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              تلاميذ منتقون من الأفواج التربوية بناءً على اختبارات التقويم
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">#</th>
                  <th className="py-3 px-4">اسم ولقب التلميذ</th>
                  <th className="py-3 px-3">القسم</th>
                  <th className="py-3 px-3">رقم الإجازة المدرسية</th>
                  <th className="py-3 px-3">المركز / التخصص</th>
                  <th className="py-3 px-3 text-center">الفحص الطبي البدني</th>
                  <th className="py-3 px-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 8).map((st, idx) => {
                  const cls = classes.find((c) => c.id === st.classId);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {st.firstName} {st.lastName}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{cls?.name || 'فوج ثانوي'}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">LIC-2026-0{idx + 10}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {selectedSport === 'كرة اليد'
                          ? idx === 0
                            ? 'حارس مرمى'
                            : idx % 2 === 0
                            ? 'جناح أيمن'
                            : 'صانع ألعاب'
                          : idx % 2 === 0
                          ? 'سباق 100م'
                          : 'الوثب الطويل'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          مؤهل ولائق طبياً ✓
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          أساسي
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Tournaments List */}
      {activeTab === 'tournaments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((tourn) => (
              <div
                key={tourn.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded-full">
                      {tourn.sport} · {tourn.category}
                    </span>
                    <button
                      onClick={() => handleDeleteTournament(tourn.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="حذف المنافسة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">{tourn.name}</h4>
                  <p className="text-xs text-slate-500">{tourn.stage}</p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>التاريخ والمكان:</span>
                      <span className="font-semibold text-slate-900">{tourn.date} · {tourn.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>المؤسسة المنافسة:</span>
                      <span className="font-semibold text-slate-900">{tourn.opponentSchool}</span>
                    </div>
                    {tourn.resultScore && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>النتيجة المسجلة:</span>
                        <span className="font-black font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {tourn.resultScore}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-700">
                    {tourn.rankingOutcome || 'قيد الإجراء'}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {tourn.participantsCount} تلميذاً
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Honors & Trophies */}
      {activeTab === 'honors' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>لوحة التتويجات والألقاب المدرسية الرسمية</span>
            </h3>
            <span className="text-xs text-slate-500">سجل الشرف للمؤسسة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-300 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥇</span>
                <div>
                  <h4 className="font-black text-amber-950 text-sm">الميدالية الذهبية</h4>
                  <p className="text-[11px] text-amber-800">البطولة الولائية للعدو الريفي المدرسي</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                المرتبة الأولى فردي صنف أواسط ذكور، مع التأهل المباشر لتمثيل الولاية في البطولة الجهوية.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200/70 border border-slate-300 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥈</span>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">كأس الوصيف (المرتبة الثانية)</h4>
                  <p className="text-[11px] text-slate-700">بطولة الدائرة المدرسية لكرة اليد</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                فريق أشبال ثانوية مفدي زكرياء بعد مباراة نهائية بطولية بروح رياضية عالية.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/70 border border-orange-300 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥉</span>
                <div>
                  <h4 className="font-black text-orange-950 text-sm">الميدالية البرونزية</h4>
                  <p className="text-[11px] text-orange-800">السباق السريع 100م (إناث)</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                تألق تلميذات السنة الأولى ثانوي بتوقيت مميز 13.8 ثانية على المستوى الولائي.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Tournament */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>تسجيل منافسة أو بطولة مدرسية جديدة</span>
            </h3>

            <form onSubmit={handleAddTournament} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم المنافسة / البطولة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تصفيات البطولة الولائية لكرة السلة"
                  value={newTournName}
                  onChange={(e) => setNewTournName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">النشاط الرياضي</label>
                  <select
                    value={newSport}
                    onChange={(e) => setNewSport(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="كرة اليد">كرة اليد</option>
                    <option value="ألعاب القوى (العدو)">ألعاب القوى (العدو)</option>
                    <option value="كرة السلة">كرة السلة</option>
                    <option value="كرة القدم المصغرة">كرة القدم المصغرة</option>
                    <option value="الجمباز">الجمباز</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الفئة العمرية</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as 'أصاغر' | 'أشبال' | 'أواسط')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="أصاغر">أصاغر</option>
                    <option value="أشبال">أشبال</option>
                    <option value="أواسط">أواسط</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المرحلة</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="مرحلة تصفيات الدائرة">تصفيات الدائرة</option>
                    <option value="البطولة الولائية">البطولة الولائية</option>
                    <option value="البطولة الجهوية">البطولة الجهوية</option>
                    <option value="البطولة الوطنية">البطولة الوطنية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ المقابلة / السباق</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">المؤسسة المنافسة</label>
                <input
                  type="text"
                  required
                  value={newOpponent}
                  onChange={(e) => setNewOpponent(e.target.value)}
                  placeholder="اسم الثانوية أو الفريق المنافس"
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
                  حفظ المنافسة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
