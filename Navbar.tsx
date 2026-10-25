import React from 'react';
import { Volume2, Printer, Download, Upload } from 'lucide-react';
import { fieldAudio } from '../utils/audioWhistle';
import { exportBackupJSON, AppData } from '../utils/storage';

export type ActiveTab =
  | 'dashboard'
  | 'pedagogical_binder'
  | 'curriculum_importer'
  | 'annual_plan'
  | 'learning_units'
  | 'lesson_plans'
  | 'logbook'
  | 'meetings'
  | 'accidents'
  | 'students'
  | 'attendance'
  | 'evaluation'
  | 'school_sports'
  | 'timer'
  | 'tactical'
  | 'equipment'
  | 'ai_developer';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  appData: AppData;
  onImportBackup: (data: AppData) => void;
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  appData,
  onImportBackup,
  onOpenInstallModal,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleWhistle = () => {
    fieldAudio.playWhistle(0.5);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportBackup(parsed);
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const primarySections: {
    id: ActiveTab;
    label: string;
    subTabs?: { id: ActiveTab; label: string }[];
    badge?: string;
    highlight?: boolean;
  }[] = [
    { id: 'dashboard', label: 'الرئيسية' },
    { id: 'pedagogical_binder', label: 'الدفتر البيداغوجي' },
    {
      id: 'students',
      label: 'الأقسام والأفواج التربوية',
      subTabs: [
        { id: 'students', label: 'إدارة الأفواج والتلاميذ' },
        { id: 'attendance', label: 'سجل الحضور والمواظبة' },
      ],
    },
    {
      id: 'learning_units',
      label: 'المذكرات والوحدات التعليمية',
      subTabs: [
        { id: 'learning_units', label: 'الوحدات التعلمية (UA)' },
        { id: 'lesson_plans', label: 'المذكرات وجذاذات الحصص' },
        { id: 'logbook', label: 'دفتر النصوص' },
      ],
    },
    { id: 'evaluation', label: 'التقويم والتنقيط' },
    {
      id: 'annual_plan',
      label: 'المخططات والتوزيعات السنوية',
      subTabs: [
        { id: 'annual_plan', label: 'التوزيع السنوي' },
        { id: 'curriculum_importer', label: 'مستورد المنهاج' },
      ],
    },
    {
      id: 'accidents',
      label: 'التقارير والحوادث المدرسية',
      subTabs: [
        { id: 'accidents', label: 'تقارير الحوادث والإصابات' },
        { id: 'meetings', label: 'الندوات ومجالس التعليم' },
      ],
    },
    { id: 'school_sports', label: 'الرياضة المدرسية (ASSS)' },
    {
      id: 'timer',
      label: 'الأدوات والميدان',
      subTabs: [
        { id: 'timer', label: 'الميقاتي الميداني والصفارة' },
        { id: 'tactical', label: 'السبورة التكتيكية' },
        { id: 'equipment', label: 'العتاد والتجهيزات' },
      ],
    },
    {
      id: 'ai_developer',
      label: 'مطور التطبيق بالذكاء الاصطناعي',
      badge: 'المدير العام',
      highlight: true,
    },
  ];

  // Helper to test if a section or any of its subtabs is currently active
  const isSectionActive = (section: typeof primarySections[0]) => {
    if (activeTab === section.id) return true;
    if (section.subTabs && section.subTabs.some((s) => s.id === activeTab)) return true;
    return false;
  };

  // Find currently active section that has subtabs to show secondary ribbon
  const currentActiveSectionWithSubtabs = primarySections.find(
    (s) => s.subTabs && s.subTabs.some((sub) => sub.id === activeTab)
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3-Zone Bar */}
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left font-black text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                EPS
              </span>
              <span className="hidden sm:inline">أستاذ التربية البدنية والرياضية</span>
              <span className="sm:hidden text-sm">EPS Pro</span>
            </button>
          </div>

          {/* Zone 2: Primary Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            {primarySections.map((item) => {
              const active = isSectionActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    item.highlight
                      ? active
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md border border-amber-400'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300/80 font-black'
                      : active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Quick Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Install / Download App Button */}
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                title="تحميل وتثبيت التطبيق على هاتفك أو حاسوبك"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 hover:from-emerald-500 hover:to-slate-800 rounded-lg shadow-xs transition-all active:scale-95 whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-emerald-300" />
                <span className="hidden md:inline">تحميل التطبيق (APK)</span>
                <span className="md:hidden">APK</span>
              </button>
            )}

            {/* Quick Instant Whistle */}
            <button
              onClick={handleWhistle}
              title="صفارة سريعة للميدان"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors active:scale-95 whitespace-nowrap shrink-0"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">صفارة</span>
            </button>

            <button
              onClick={() => window.print()}
              title="طباعة الصفحة الحالية"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => exportBackupJSON(appData)}
              title="تصدير نسخة احتياطية كاملة"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleImportClick}
              title="استرجاع نسخة احتياطية"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Upload className="w-4 h-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Secondary Subnav Strip (Mobile / Tablet Horizontal Overflow) */}
        <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 border-t border-slate-100">
          {primarySections.map((item) => {
            const active = isSectionActive(item);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  item.highlight
                    ? active
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-amber-100 text-amber-900'
                    : active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1 py-0.2 text-[8px] font-black rounded-full bg-amber-400 text-slate-950">
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Child Sub-navigation Ribbon (When an active section has subtabs) */}
        {currentActiveSectionWithSubtabs && (
          <div className="flex items-center gap-2 py-1.5 px-2 bg-slate-50 border-t border-slate-200 text-xs overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">
              {currentActiveSectionWithSubtabs.label}:
            </span>
            <div className="flex items-center gap-1">
              {currentActiveSectionWithSubtabs.subTabs?.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    activeTab === sub.id
                      ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );

};
