import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Monitor,
  Share2,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck,
  HardDriveDownload,
  Info,
  QrCode,
  Package,
  Terminal,
  FileCode,
  Check,
} from 'lucide-react';
import { AppData, exportBackupJSON } from '../utils/storage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  appData,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [activeDeviceTab, setActiveDeviceTab] = useState<'apk' | 'android' | 'ios' | 'pc'>('apk');
  const [showQr, setShowQr] = useState(false);

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0].split('#')[0]
      : 'https://ais-pre-l7kf65xnh4zxazlkqvwa5o-456054670903.europe-west2.run.app';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('لتثبيت التطبيق على جهازك: افتح قائمة المتصفح (⋮) واختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق".');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Install prompt error:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(key);
    setTimeout(() => setCopiedCommand(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-right space-y-5 p-5 sm:p-7 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Badge */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-slate-900 flex items-center justify-center text-white shadow-md shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                تثبيت التطبيق وملف APK لهواتف أندرويد
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                Capacitor جاهز
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              منصة أستاذ التربية البدنية والرياضية | تطبيق أندرويد أصلي بصيغة APK مع دعم PWA الفوري
            </p>
          </div>
        </div>

        {/* Quick Direct Install Banner (If supported by browser) */}
        {deferredPrompt && !isInstalled && (
          <div className="p-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>تثبيت فوري مباشر بنقرة واحدة (بدون ملفات أو حاسوب)!</span>
              </div>
              <p className="text-xs text-slate-200">
                يمكنك الآن تثبيت أيقونة التطبيق على شاشة هاتفك مباشرة بدون تحميل ملف APK خارجي.
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت على الهاتف الآن</span>
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>التطبيق مثبت ويعمل كبرنامج مستقل على جهازك بدون إنترنت!</span>
          </div>
        )}

        {/* Device Step-by-Step Instructions Tabs */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-2">
            <span className="text-xs font-black text-slate-900">
              اختر صيغة وطريقة التثبيت المناسبة لك:
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveDeviceTab('apk')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 shrink-0 ${
                  activeDeviceTab === 'apk'
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>ملف أندرويد (APK)</span>
              </button>
              <button
                onClick={() => setActiveDeviceTab('android')}
                className={`px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 shrink-0 ${
                  activeDeviceTab === 'android'
                    ? 'bg-white text-emerald-950 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>أندرويد فوري (PWA)</span>
              </button>
              <button
                onClick={() => setActiveDeviceTab('ios')}
                className={`px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 shrink-0 ${
                  activeDeviceTab === 'ios'
                    ? 'bg-white text-emerald-950 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>آيفون (iOS)</span>
              </button>
              <button
                onClick={() => setActiveDeviceTab('pc')}
                className={`px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 shrink-0 ${
                  activeDeviceTab === 'pc'
                    ? 'bg-white text-emerald-950 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>كمبيوتر (PC / Mac)</span>
              </button>
            </div>
          </div>

          {/* Tab 1: APK Instructions */}
          {activeDeviceTab === 'apk' && (
            <div className="space-y-4 text-xs text-slate-800">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                    <Package className="w-4 h-4 text-emerald-700" />
                    <span>مشروع أندرويد الأصلي مجهز بالكامل في مجلد: /android</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                    معرف الحزمة: com.epsproteacher.app
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  تم تحويل وبناء التطبيق عبر <strong>Capacitor Android</strong> مع دعم كامل للغة العربية (RTL) والحفظ المحلي للملفات والبيانات وتصدير مستندات PDF.
                </p>
              </div>

              {/* Direct ZIP Download Card for GitHub Upload */}
              <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-xl shadow-lg border border-emerald-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                        <Package className="w-5 h-5" />
                      </span>
                      <h3 className="font-black text-sm text-white">
                        تنزيل ملفات مشروع EPS Pro Teacher كاملة (ZIP)
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      ملف أرشيف حقيقي جاهز للتحميل المباشر وفك الضغط لرفعه إلى مستودعك <strong>eps-pro-teacher</strong> على GitHub.
                    </p>
                  </div>

                  <a
                    href="/eps-pro-teacher.zip"
                    download="eps-pro-teacher.zip"
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 group"
                  >
                    <Download className="w-4 h-4 text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
                    <span>تحميل ملف ZIP الكامل (1.3 MB)</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10.5px] text-emerald-300 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>package.json وكافة الحزم</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>مجلد android الأصلي كاملاً</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>سير العمل .github/workflows</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>ملفات كود src و assets</span>
                  </div>
                </div>
              </div>

              {/* Method A: GitHub Actions (Cloud Build) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>الخيار 1: البناء السحابي التلقائي عبر GitHub Actions (ينتج ملف app-debug.apk)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                    موصى به
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  تم إعداد مستودع Git بالكامل وإنشاء ملف <code>.github/workflows/build-android-apk.yml</code>.
                  ارفع المشروع إلى GitHub وسيتولى السيرفر بناء ملف <strong>app-debug.apk</strong> تلقائياً:
                </p>

                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] flex items-center justify-between">
                    <code className="text-emerald-400">git remote add origin https://github.com/USERNAME/eps-pro-teacher.git</code>
                    <button
                      onClick={() => handleCopyCommand('git remote add origin https://github.com/USERNAME/eps-pro-teacher.git', 'git_remote')}
                      className="text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded text-[10px] shrink-0 mr-2"
                    >
                      {copiedCommand === 'git_remote' ? 'تم النسخ!' : 'نسخ'}
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] flex items-center justify-between">
                    <code className="text-emerald-400">git push -u origin main</code>
                    <button
                      onClick={() => handleCopyCommand('git push -u origin main', 'git_push')}
                      className="text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded text-[10px] shrink-0 mr-2"
                    >
                      {copiedCommand === 'git_push' ? 'تم النسخ!' : 'نسخ'}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>أين تجد ملف الـ APK بعد الرفع إلى GitHub؟</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-slate-600">
                    في صفحتك على GitHub، اضغط على تبويب <strong>Actions</strong> ثم افتح مهمة <strong>"Build EPS Pro Teacher Android APK"</strong>. في أسفل الصفحة عند قسم <strong>Artifacts</strong> ستجد ملف <strong>app-debug-apk</strong> جاهزاً للتحميل المباشر والتثبيت فوراً على هاتفك.
                  </p>
                </div>
              </div>

              {/* Method B: Android Studio / Local Build */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-slate-700" />
                  <span>الخيار 2: البناء محلياً على حاسوبك باستخدام Android Studio أو Gradle</span>
                </span>
                
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] flex items-center justify-between">
                    <code>npm run build &amp;&amp; npm run cap:sync</code>
                    <button
                      onClick={() => handleCopyCommand('npm run build && npm run cap:sync', 'sync')}
                      className="text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded text-[10px]"
                    >
                      {copiedCommand === 'sync' ? 'تم النسخ!' : 'نسخ'}
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] flex items-center justify-between">
                    <code>cd android &amp;&amp; ./gradlew assembleDebug</code>
                    <button
                      onClick={() => handleCopyCommand('cd android && ./gradlew assembleDebug', 'gradle')}
                      className="text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded text-[10px]"
                    >
                      {copiedCommand === 'gradle' ? 'تم النسخ!' : 'نسخ'}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <strong>موقع ملف الـ APK الناتج:</strong>
                  <br />
                  <code className="text-amber-900 font-mono text-[10px] break-all">
                    android/app/build/outputs/apk/debug/app-debug.apk
                  </code>
                </div>
              </div>

              {/* Installation steps on Phone */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <span className="font-black text-emerald-950 text-xs block">
                  📱 خطوات تثبيت ملف الـ APK على هاتف أندرويد الخاص بك:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed font-sans text-[11px] text-slate-700">
                  <li>انقل ملف <strong>app-debug.apk</strong> لهاتفك (عبر كابل USB أو تطبيق WhatsApp أو Google Drive).</li>
                  <li>اضغط على الملف لفتحه من تطبيق ملفات الهاتف (Files).</li>
                  <li>إذا طلب هاتفك الإذن: اضغط على <strong>الإعدادات (Settings)</strong> ثم فعّل <strong>«السماح بتثبيت التطبيقات من مصادر غير معروفة» (Install from unknown sources)</strong>.</li>
                  <li>اضغط على <strong>«تثبيت» (Install)</strong>، وسيتم تثبيت التطبيق بنجاح كأيقونة كاملة على شاشتك الرئيسية!</li>
                </ol>
              </div>
            </div>
          )}

          {/* Android PWA Steps */}
          {activeDeviceTab === 'android' && (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5 text-xs text-slate-800">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>التثبيت الفوري كـ WebAPK على هواتف أندرويد (Chrome, Samsung):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed font-sans pr-1">
                <li>
                  افتح الرابط في متصفح <strong>Google Chrome</strong> على هاتفك.
                </li>
                <li>
                  اضغط على زر القائمة في المتصفح (<strong>أيقونة الثلاث نقاط الرأسية ⋮</strong> في الزاوية العلوية).
                </li>
                <li>
                  اضغط على الخيار <strong>«تثبيت التطبيق» (Install App)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية» (Ajouter à l'écran d'accueil)</strong>.
                </li>
                <li>
                  اضغط على <strong>«تثبيت» (Installer)</strong>؛ ستظهر أيقونة التطبيق مباشرة على شاشة هاتفك مع باقي التطبيقات ويعمل بملء الشاشة وبدون شريط المتصفح!
                </li>
              </ol>
            </div>
          )}

          {/* iOS Steps */}
          {activeDeviceTab === 'ios' && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2.5 text-xs text-slate-800">
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>خطوات التثبيت على أجهزة Apple (iPhone / iPad):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed font-sans pr-1">
                <li>
                  افتح رابط المنصة في متصفح <strong>Safari</strong> الرسمي.
                </li>
                <li>
                  اضغط على زر المشاركة بالأسفل (<strong>أيقونة المربع بسهم للأعلى ⬆️ Share</strong>).
                </li>
                <li>
                  مرر للأسفل واضغط على <strong>«إضافة إلى الصفحة الرئيسية» (Sur l'écran d'accueil / Add to Home Screen)</strong>.
                </li>
                <li>
                  اضغط على <strong>«إضافة» (Ajouter)</strong> في الزاوية العلوية لتثبيت التطبيق على الشاشة الرئيسية لهاتفك.
                </li>
              </ol>
            </div>
          )}

          {/* PC Steps */}
          {activeDeviceTab === 'pc' && (
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-2.5 text-xs text-slate-800">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <Monitor className="w-4 h-4 text-slate-700" />
                <span>خطوات التثبيت على الحاسوب المكتبي أو المحمول (Windows / Mac):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed font-sans pr-1">
                <li>
                  افتح المنصة في متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong>.
                </li>
                <li>
                  ستجد أيقونة التثبيت (<strong>رمز الشاشة مع سهم ⊕</strong>) في الطرف الأيمن لشريط العنوان (URL bar).
                </li>
                <li>
                  أو افتح قائمة المتصفح (⋮) واختر <strong>«تثبيت منصة أستاذ التربية البدنية...»</strong>.
                </li>
                <li>
                  يتم فتح التطبيق في نافذة مستقلة مع اختصار على سطح المكتب (Desktop Shortcut) لفتحه مباشرة بدون فتح المتصفح.
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Direct Link Box & Share */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            رابط التطبيق المباشر (افتحه من هاتفك أو أرسله لنفسك عبر واتساب):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 select-all focus:outline-hidden"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all shrink-0 ${
                copiedLink
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
              title="نسخ الرابط"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'تم النسخ!' : 'نسخ'}</span>
            </button>

            <button
              onClick={() => setShowQr(!showQr)}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg transition-colors shrink-0"
              title="عرض رمز الاستجابة السريعة QR لتصويره بالهاتف"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
            </button>
          </div>

          {showQr && (
            <div className="mt-3 p-4 bg-white rounded-xl border border-indigo-200 text-center space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                امسح الرمز بكاميرا هاتفك لفتح المنصة فوراً وتثبيتها:
              </span>
              <div className="inline-block p-2 bg-slate-100 rounded-lg border border-slate-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    appUrl
                  )}`}
                  alt="QR Code"
                  className="w-40 h-40 mx-auto"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        {/* Offline & Data Backup Feature */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <HardDriveDownload className="w-4 h-4 text-emerald-600" />
              <span>تنزيل نسخة احتياطية من بياناتك المدرسية (Offline Backup)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              يمكنك تنزيل ملف بياناتك كاملاً لحفظه على هاتفك واسترجاعه في أي وقت.
            </p>
          </div>
          <button
            onClick={() => exportBackupJSON(appData)}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>تنزيل ملف البيانات (JSON)</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>مشروع Android جاهز ومحمي بالكامل (RTL + Offline + APK)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
