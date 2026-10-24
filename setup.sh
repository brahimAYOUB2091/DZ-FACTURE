#!/bin/bash
# إعداد مشروع Capacitor لأندرويد (يُشغَّل على حاسوب عليه Node.js 20+ و JDK 21 و Android SDK)
set -e
cd "$(dirname "$0")"
npm install
[ -d android ] || npx cap add android
npx @capacitor/assets generate --android      # يولّد الأيقونات من مجلد resources
npx cap sync android
# رفع مستوى الواجهة إلى API 36 (شرط Google Play)
f=android/variables.gradle
sed -i -E 's/(compileSdkVersion|targetSdkVersion) = [0-9]+/\1 = 36/' "$f"
grep -E "SdkVersion" "$f"
echo "تم. لبناء حزمة النشر: افتح android في Android Studio (npx cap open android) ثم Build > Generate Signed Bundle"
