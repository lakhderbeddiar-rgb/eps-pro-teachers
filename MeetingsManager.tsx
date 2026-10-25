import React, { useState } from 'react';
import {
  Plus,
  Printer,
  FileText,
  Calendar,
  MapPin,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  BookOpen,
  Award,
  Filter,
} from 'lucide-react';
import { PedagogicalMeeting } from '../types';

interface MeetingsManagerProps {
  meetings: PedagogicalMeeting[];
  onUpdateMeetings: (meetings: PedagogicalMeeting[]) => void;
  teacherName: string;
  schoolName: string;
  academicYear: string;
}

export const MeetingsManager: React.FC<MeetingsManagerProps> = ({
  meetings,
  onUpdateMeetings,
  teacherName,
  schoolName,
  academicYear,
}) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(
    meetings[0]?.id || ''
  );
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<PedagogicalMeeting | null>(null);

  // Form states
  const [meetingType, setMeetingType] = useState<PedagogicalMeeting['type']>('ندوة تربوية');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('المؤسسة التربوية');
  const [supervisorOrLeader, setSupervisorOrLeader] = useState('مفتش التربية الوطنية');
  const [participants, setParticipants] = useState('أساتذة المادة بالمقاطعة التربوية');
  const [agendaTopics, setAgendaTopics] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [reportContent, setReportContent] = useState('');

  const filteredMeetings = meetings.filter((m) => {
    const matchesFilter = filterType === 'all' || m.type === filterType;
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.agendaTopics.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.supervisorOrLeader.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentMeeting =
    filteredMeetings.find((m) => m.id === selectedMeetingId) ||
    filteredMeetings[0] ||
    meetings[0];

  const handleCreateNew = () => {
    setEditingMeeting(null);
    setMeetingType('ندوة تربوية');
    setTitle('ندوة تربوية تكوينية: ضبط التدرجات وأدوات التقويم البيداغوجي');
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('متوسطة مفدي زكرياء');
    setSupervisorOrLeader('السيد مفتش التربية الوطنية لمادة التربية البدنية');
    setParticipants('أساتذة التربية البدنية والرياضية لمقاطعة التفتيش');
    setAgendaTopics('1. قراءة تحليلية للوثيقة المرافقة والتدرج السنوي.\n2. إعداد الوحدات التعلمية (UA).\n3. معايير الأمن والسلامة أثناء الحصص التطبيقية.');
    setRecommendations('الالتزام التام بالمنهاج الرسمي، تحيين دفاتر النصوص، وتكثيف التنسيق البيداغوجي بين أساتذة المادة.');
    setReportContent('انطلقت الجلسة على الساعة 09:00 صباحاً برئاسة السيد المفتش، حيث رحب بالحاضرين ثم تناول جدول الأعمال بالتفصيل، وتخللت الندوة ورشات تطبيقية لتقاسم الخبرات...');
    setShowModal(true);
  };

  const handleEdit = (m: PedagogicalMeeting) => {
    setEditingMeeting(m);
    setMeetingType(m.type);
    setTitle(m.title);
    setDate(m.date);
    setLocation(m.location);
    setSupervisorOrLeader(m.supervisorOrLeader);
    setParticipants(m.participants);
    setAgendaTopics(m.agendaTopics);
    setRecommendations(m.recommendations);
    setReportContent(m.reportContent);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const meetingObj: PedagogicalMeeting = {
      id: editingMeeting ? editingMeeting.id : `meet-${Date.now()}`,
      type: meetingType,
      title,
      date,
      location,
      supervisorOrLeader,
      participants,
      agendaTopics,
      recommendations,
      reportContent,
    };

    if (editingMeeting) {
      const updated = meetings.map((m) => (m.id === editingMeeting.id ? meetingObj : m));
      onUpdateMeetings(updated);
    } else {
      onUpdateMeetings([meetingObj, ...meetings]);
      setSelectedMeetingId(meetingObj.id);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف محضر هذا الاجتماع؟')) return;
    const filtered = meetings.filter((m) => m.id !== id);
    onUpdateMeetings(filtered);
    if (selectedMeetingId === id && filtered.length > 0) {
      setSelectedMeetingId(filtered[0].id);
    }
  };

  const getTypeBadgeColor = (type: PedagogicalMeeting['type']) => {
    switch (type) {
      case 'ندوة تربوية':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'مجلس قسم':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'اجتماع تنسيقي للمادة':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'جلسة عمل مع المفتش':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Toolbar */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>الندوات التربوية والمجالس والاجتماعات التنسيقية (PV de Réunions)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              سجل محاضر الندوات البيداغوجية، مجالس الأقسام، اجتماعات التنسيق للمادة، وجلسات العمل الرسمية مع الإدارة والتفتيش.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>تحرير محضر اجتماع / ندوة جديد</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المحضر الرسمي</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium">تصفية حسب النوع:</span>
            {[
              { id: 'all', label: 'الكل' },
              { id: 'ندوة تربوية', label: 'الندوات التربوية' },
              { id: 'اجتماع تنسيقي للمادة', label: 'اجتماعات التنسيق' },
              { id: 'مجلس قسم', label: 'مجالس الأقسام' },
              { id: 'جلسة عمل مع المفتش', label: 'جلسات التفتيش' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  filterType === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="بحث في المحاضر والمواضيع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Meeting selection pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-100 pt-3">
          {filteredMeetings.length === 0 ? (
            <span className="text-xs text-slate-400 py-2">لا توجد محاضر مطابقة للبحث أو التصفية.</span>
          ) : (
            filteredMeetings.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMeetingId(m.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-right whitespace-nowrap ${
                  (currentMeeting?.id === m.id)
                    ? 'bg-indigo-50 text-indigo-950 border-indigo-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold truncate max-w-[180px]">{m.title}</span>
                  <span className="text-[10px] text-slate-500">({m.date})</span>
                </div>
                <span className="block text-[11px] opacity-80 mt-0.5">
                  {m.type} · {m.supervisorOrLeader}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Selected Meeting Details / PV View */}
      {currentMeeting && (
        <div className="bg-white rounded-2xl border-2 border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 print:border-2 print:border-black print:p-6">
          {/* Official Ministerial Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <p className="font-bold text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-semibold text-xs text-slate-700">وزارة التربية الوطنية</p>
            <div className="flex justify-between items-center text-xs mt-3 px-2">
              <span>المؤسسة: {schoolName}</span>
              <span>الموسم الدراسي: {academicYear}</span>
              <span>الأستاذ: {teacherName}</span>
            </div>
            <div className="inline-block mt-4 px-6 py-1.5 bg-indigo-700 text-white rounded-lg print:bg-black print:text-white">
              <h1 className="text-lg font-black tracking-wide">
                محضر رسمي: {currentMeeting.type}
              </h1>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-semibold">
              سجل التنسيق البيداغوجي والأنشطة التربوية لمادة التربية البدنية والرياضية
            </p>
          </div>

          {/* Action bar inside report */}
          <div className="flex justify-between items-center no-print">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeBadgeColor(currentMeeting.type)}`}>
              {currentMeeting.type}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(currentMeeting)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>تعديل المحضر</span>
              </button>
              <button
                onClick={() => handleDelete(currentMeeting.id)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                title="حذف المحضر"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. Identification and Meeting Meta */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>أولاً: بيانات الاجتماع وهوية المؤطرين</span>
              <span className="font-mono text-slate-600 text-[11px]">{currentMeeting.date}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">عنوان اللقاء / الندوة:</span>
                <strong className="text-slate-900 font-bold block mt-0.5">{currentMeeting.title}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">مكان الانعقاد:</span>
                <strong className="text-slate-800 block mt-0.5">{currentMeeting.location}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">رئيس الجلسة / المؤطر:</span>
                <strong className="text-slate-800 block mt-0.5">{currentMeeting.supervisorOrLeader}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">تاريخ الانعقاد:</span>
                <strong className="text-slate-800 font-mono tabular-nums block mt-0.5">{currentMeeting.date}</strong>
              </div>
            </div>

            <div className="pt-2 text-xs border-t border-slate-100">
              <span className="text-slate-500 block font-semibold mb-1">الأعضاء الحاضرون / المشاركون:</span>
              <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 font-medium">
                {currentMeeting.participants}
              </p>
            </div>
          </div>

          {/* 2. Agenda */}
          <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-200 space-y-2">
            <h3 className="text-xs font-black text-indigo-950 border-b border-indigo-200 pb-1.5">
              ثانياً: جدول الأعمال المسطر (Ordre du Jour)
            </h3>
            <div className="bg-white p-3.5 rounded-lg border border-indigo-100 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
              {currentMeeting.agendaTopics}
            </div>
          </div>

          {/* 3. Detailed PV Report */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-black text-slate-900 border-b border-slate-200 pb-1.5">
              ثالثاً: وقائع الجلسة والمداولات المفصلة (Procès-Verbal de Réunion)
            </h3>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans min-h-[120px]">
              {currentMeeting.reportContent}
            </div>
          </div>

          {/* 4. Decisions and Recommendations */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
            <h3 className="text-xs font-black text-emerald-950 border-b border-emerald-200 pb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>رابعاً: القرارات والتوجيهات والتوصيات المنبثقة</span>
            </h3>
            <div className="bg-white p-3.5 rounded-lg border border-emerald-100 text-xs text-emerald-950 font-medium whitespace-pre-line leading-relaxed font-sans">
              {currentMeeting.recommendations}
            </div>
          </div>

          {/* Signatures & Stamps */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs mt-10 pt-6 border-t-2 border-slate-900">
            <div>
              <p className="font-bold">أستاذ المادة / كاتب الجلسة</p>
              <div className="h-16"></div>
              <p className="text-slate-700 font-semibold">{teacherName}</p>
            </div>
            <div>
              <p className="font-bold">رئيس الجلسة / منسق المادة</p>
              <div className="h-16"></div>
              <p className="text-slate-700 font-semibold">{currentMeeting.supervisorOrLeader}</p>
            </div>
            <div>
              <p className="font-bold">تأشيرة مدير المؤسسة / المفتش</p>
              <div className="h-16"></div>
              <p className="text-slate-600">ختم وتأشيرة المصادقة</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Meeting */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingMeeting ? 'تعديل محضر الاجتماع / الندوة' : 'تحرير محضر جلسة أو ندوة تربوية جديدة'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">نوع اللقاء / الجلسة</label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  >
                    <option value="ندوة تربوية">ندوة تربوية</option>
                    <option value="اجتماع تنسيقي للمادة">اجتماع تنسيقي للمادة</option>
                    <option value="مجلس قسم">مجلس قسم</option>
                    <option value="جلسة عمل مع المفتش">جلسة عمل مع المفتش</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">تاريخ الانعقاد</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">موضوع أو عنوان اللقاء</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الندوة التربوية لمقاطعة التعليم المتوسط حول تقويم الكفاءات"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">مكان الانعقاد</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: قاعة الأساتذة - متوسطة مفدي زكرياء"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">رئيس الجلسة / المؤطر المشرف</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مفتش التربية الوطنية / منسق المادة"
                    value={supervisorOrLeader}
                    onChange={(e) => setSupervisorOrLeader(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">الأعضاء الحاضرون / المشاركون</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أساتذة التربية البدنية والرياضية بالمقاطعة / أساتذة الفوج"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">جدول الأعمال (نقطة بنقطة)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="1. قراءة التدرجات السنوية...&#10;2. تنظيم الملاعب والعتاد...&#10;3. الجمعية الرياضية المدرسية..."
                  value={agendaTopics}
                  onChange={(e) => setAgendaTopics(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">محضر الجلسة المفصل والمداولات (PV)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="تفاصيل ما تم طرحه ومناقشته من طرف الحاضرين..."
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">القرارات والتوجيهات والتوصيات المنبثقة</label>
                <textarea
                  rows={3}
                  required
                  placeholder="القرارات الملزمة والتوصيات المتفق عليها..."
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed font-sans"
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs"
                >
                  حفظ واعتماد المحضر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
