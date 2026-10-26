# تجربة التطبيق على الهاتف بدون Android Studio

للتجربة فقط (ليس لـ Google Play). يغلّف مجلد `www` داخل WebView ويبني APK موقّعاً بمفتاح محلي.
النشر الفعلي يتم عبر Capacitor (`setup.sh` في جذر المشروع).

```bash
bash tools/apk-test/build.sh
cp tools/apk-test/dz-facture.apk /sdcard/Download/
```

المتطلبات في Kali: `aapt apksigner zipalign default-jdk-headless google-android-platform-23-installer`،
وملف `~/r8lib.jar` (أداة d8 من Google) أو أمر `d8` في المسار.
المفتاح `key.jks` والملف الناتج `*.apk` مُستثنيان من git.
