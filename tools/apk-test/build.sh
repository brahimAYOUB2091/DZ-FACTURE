#!/bin/bash
# يبني APK تجريبياً من مجلد www (بدون Android Studio). التشغيل: bash tools/apk-test/build.sh
set -e
cd "$(dirname "$0")"
ROOT=$(cd ../.. && pwd)

JAR=$(find /usr -name android.jar 2>/dev/null | head -1)
[ -z "$JAR" ] && JAR=$(find /usr -name 'android-*.jar' 2>/dev/null | head -1)
[ -z "$JAR" ] && { echo "لم أجد android.jar. ثبّت: sudo apt install google-android-platform-23-installer"; exit 1; }
echo "android.jar: $JAR"

rm -rf build && mkdir -p build/classes build/assets
cp -r "$ROOT/www/." build/assets/

echo "[1/5] تغليف الملفات (manifest + أيقونات + www)"
aapt package -f -M AndroidManifest.xml -S res -A build/assets -I "$JAR" -F build/app.unsigned.apk

echo "[2/5] ترجمة كود Java"
javac -Xlint:-options --release 8 -cp "$JAR" -d build/classes src/com/brahim/dzfacture/MainActivity.java

echo "[3/5] تحويل إلى classes.dex"
jar cf build/classes.jar -C build/classes .
if [ -f "$HOME/r8lib.jar" ]; then
  java -cp "$HOME/r8lib.jar" com.android.tools.r8.D8 --release --min-api 21 --lib "$JAR" --output build build/classes.jar
elif command -v d8 >/dev/null; then
  d8 --release --min-api 21 --lib "$JAR" --output build build/classes.jar
else
  echo "لم أجد d8. نزّل ~/r8lib.jar (انظر README)"; exit 1
fi
[ -f build/classes.dex ] || { echo "فشل إنشاء classes.dex"; exit 1; }

echo "[4/5] إضافة classes.dex"
(cd build && aapt add app.unsigned.apk classes.dex)

# مفتاح توقيع محلي للتجربة فقط (key.jks مُستثنى من git)
[ -f key.jks ] || keytool -genkeypair -keystore key.jks -alias k -keyalg RSA -keysize 2048 \
  -validity 10000 -storepass 123456 -keypass 123456 -dname "CN=DZ Facture Test"

echo "[5/5] المحاذاة والتوقيع"
if command -v zipalign >/dev/null; then
  zipalign -f 4 build/app.unsigned.apk build/app.aligned.apk
else
  cp build/app.unsigned.apk build/app.aligned.apk
fi
apksigner sign --ks key.jks --ks-pass pass:123456 --out dz-facture.apk build/app.aligned.apk

echo "تم: $(pwd)/dz-facture.apk"
