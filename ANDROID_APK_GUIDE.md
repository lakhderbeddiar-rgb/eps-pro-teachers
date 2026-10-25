# دليل بناء وتثبيت تطبيق EPS Pro Teacher بصيغة APK لأجهزة أندرويد (Android)

تم تجهيز هذا المشروع بالكامل بواسطة محرك **Capacitor Android** وإعداد **GitHub Actions** ليتحول إلى تطبيق Android أصلي قابل للتثبيت بصيغة **app-debug.apk** مع الحفاظ التام على:
- جميع البيانات المدرسية وقواعد البيانات المحلية (LocalStorage).
- الواجهة العربية بالكامل واتجاه القراءة الصحيح (RTL).
- العمل بدون إنترنت (Offline 100%).
- تصدير الجذاذات وتقارير الحوادث والمذكرات بصيغة PDF.

---

## 📋 معلومات حزمة التطبيق (App Package)
- **اسم التطبيق**: EPS Pro Teacher - أستاذ التربية البدنية
- **معرف الحزمة (Application ID)**: `com.epsproteacher.app`
- **المحرك الأصلي**: Capacitor Android + Vite React
- **مسار ملف البناء في GitHub Actions**: `.github/workflows/build-android-apk.yml`
- **اسم ملف الـ APK الناتج**: `app-debug.apk`
- **مسار الملف بعد البناء**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **إصدار أندرويد المدعوم**: Android 7.0 (API 24) فما فوق حتى أحدث إصدارات Android 14/15/16.

---

## 🚀 الطريقة الأولى (الموصى بها): البناء السحابي التلقائي عبر GitHub Actions

هذه الطريقة توفر عليك تثبيت أي برامج على حاسوبك، حيث يقوم سيرفر GitHub بتجميع وبناء ملف `app-debug.apk` جاهزاً للتحميل.

### 1. ربط المشروع بمستودع GitHub ورفعه:
أنشئ مستودعاً جديداً على حسابك في GitHub (مثلاً: `eps-pro-teacher`) ثم نفذ الأوامر التالية من سطر الأوامر (Terminal):

```bash
git remote add origin https://github.com/YOUR_USERNAME/eps-pro-teacher.git
git branch -M main
git push -u origin main
```
*(استبدل `YOUR_USERNAME` باسم المستخدم الخاص بك على GitHub)*.

### 2. توليد وتحميل ملف app-debug.apk:
1. افتح صفحة المستودع على **GitHub**.
2. اضغط على تبويب **Actions** في الأعلى.
3. ستلاحظ بدء تشغيل سير العمل تلقائياً باسم:
   **"Build EPS Pro Teacher Android APK"**.
   *(يمكنك أيضاً تشغيله يدوياً في أي وقت بالضغط على Workflow ثم Run workflow)*.
4. انتظر دقيقة إلى دقيقتين حتى يكتمل البناء وتظهر علامة الصح الخضراء ✅.
5. اضغط على اسم المهمة المكتملة، وانزل لأسفل الصفحة عند قسم **Artifacts**؛ ستجد ملف:
   **`app-debug-apk`**.
6. حمّله مباشرة وافتحه، وبداخله ستجد ملفك التنفيذي:
   **`app-debug.apk`**.

---

## 💻 الطريقة الثانية: البناء محلياً على حاسوبك باستخدام سطر الأوامر أو Android Studio

إذا كنت تفضل بناء الـ APK على حاسوبك الشخصي:

### عبر سطر الأوامر (Terminal / PowerShell):
- **على أنظمة Linux / macOS:**
  ```bash
  npm run build
  npm run cap:sync
  cd android
  ./gradlew assembleDebug
  ```

- **على أنظمة Windows (CMD / PowerShell):**
  ```cmd
  npm run build
  npm run cap:sync
  cd android
  gradlew.bat assembleDebug
  ```

### عبر برنامج Android Studio:
1. نفّذ في المشروع: `npm run cap:open`
2. في Android Studio، انتظر اكتمال مزامنة Gradle (Sync).
3. اختر من القائمة: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
4. ستجد الملف الناتج جاهزاً في المسار:
   `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📲 خطوات تثبيت ملف app-debug.apk على هاتفك الأندرويد

1. **نقل الملف للهاتف:**
   - انقل ملف `app-debug.apk` إلى هاتفك عبر كابل USB، أو أرسله عبر WhatsApp أو Telegram لنفسك، أو حمله من Google Drive / GitHub مباشرة من متصفح الهاتف.

2. **فتح الملف والموافقة على الأذونات:**
   - اضغط على ملف `app-debug.apk` من تطبيق ملفات الهاتف (Files / Mes fichiers).
   - إذا ظهر تنبيه أمني لأن الملف مبني ومثبت مباشرة (خارج متجر Google Play):
     - اضغط على **الإعدادات (Settings / Paramètres)**.
     - فعّل خيار **السماح بتثبيت التطبيقات من هذا المصدر (Install unknown apps / Autoriser cette source)**.

3. **اكتمال التثبيت:**
   - اضغط على **تثبيت (Install / Installer)**.
   - ستظهر أيقونة التطبيق الرياضية **"EPS Pro Teacher"** على الشاشة الرئيسية لهاتفك وتعمل بكامل طاقتها وبدون إنترنت!
