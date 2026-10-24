# DZ فاتورة — DZ Facture

<p align="center"><img src="resources/icon-only.png" width="120" alt="icon"></p>

**العربية** | [English](#english) | [Français](#français)

## العربية

حاسبة مفتوحة المصدر تقدّر فاتورة **الكهرباء والغاز** (من بيان العدادين القديم والجديد) وفاتورة **الماء** (من بيان العداد القديم والجديد) في الجزائر. تعمل دون إنترنت، وتفتح بشاشة اختيار (الكهرباء والغاز / الماء)، وتدعم العربية والإنجليزية والفرنسية، والوضعين الفاتح والداكن.

> ⚠️ **تنبيه:** هذا مشروع مستقل **غير تابع لسونلغاز** ولا لأي جهة رسمية. النتيجة تقريبية وقد تختلف عن الفاتورة الرسمية بسنتيم واحد أو أكثر. الفاتورة الرسمية هي المرجع.

### التشغيل السريع
افتح `www/index.html` في أي متصفح. لا يلزم تثبيت شيء.

### الاختبارات
```bash
npm test      # يتطلب Node.js 20 أو أحدث
```
الاختبارات تقارن النتائج بفواتير حقيقية في `tests/bills.json`.

### بناء تطبيق أندرويد
يتطلب Node.js 20+ وJDK 21 وAndroid Studio (SDK 36):
```bash
bash setup.sh          # ينشئ مشروع أندرويد ويولّد الأيقونات ويضبط API 36
npx cap open android   # ثم Build > Generate Signed Bundle
```

### هيكل المشروع
| المسار | الوظيفة |
|---|---|
| `www/tariffs.js` | **الأسعار والرسوم** (عدّله عند تغيّر التعريفة) |
| `www/calc.js` | منطق الحساب بلا واجهة |
| `www/index.html` | الواجهة والترجمات (ar / en / fr) والوضع الداكن |
| `tests/` | اختبارات وفواتير مرجعية |
| `resources/` | الأيقونة (تُحوَّل إلى أحجام أندرويد بـ `setup.sh`) |

### المساهمة
أكبر حاجة للمشروع هي **تصحيح الأرقام**: افتح *Issue* بقالب «تصحيح تعريفة / فاتورة» وأرفق قراءات العدادين والمبالغ. **أخفِ الاسم والعنوان ورقم العداد قبل نشر أي صورة**. التفاصيل في [CONTRIBUTING.md](CONTRIBUTING.md).

### مسائل معروفة
- فرق سنتيم واحد في TVA على بعض الفواتير (تقريب).
- **الماء:** سعر الشطرين 3 (56–82 م³) و4 (83 م³ فأكثر) **مقدَّر** من المعاملات الرسمية (×5.5 و×6.5) ولم تؤكده فاتورة بعد، ويظهر تنبيه عند استخدامه. الاتاوتان الثابتتان (240 و60 دج) افتُرض ثباتهما، واتاوة اقتصاد الماء 4% (تذكر مراجع أنها 2% لولايات الجنوب).
- **سيال (SEAAL):** لا توجد أسعارها في التطبيق بعد. نحتاج فاتورة فعلية لإضافتها (الجزائر وتيبازة).
- **الكهرباء وحدها / الغاز وحده:** الاشتراك مُشتق من تعريفة CREG (ثمن القدرة 4.37 دج/kW/شهر + 28.50 دج/شهر للغاز) وتطابق مجموعه مع فاتورة حقيقية، لكن لم تُختبر فاتورة بخدمة واحدة. رسم السكن (100 دج) يُطبَّق مع الكهرباء فقط، والحق الثابت (25/100/200 دج) يتبع استهلاك الكهرباء، وهو 0 للغاز وحده. هذه افتراضات.
- الحق الثابت لما دون 70 kWh افتُرض 0.

### المصادر
- تعريفة الكهرباء والغاز (CREG، منخفضة الضغط/التوتر): <https://creg.gov.dz/wp-content/uploads/2021/11/Tarif-BT-BP-FR.pdf>
- معاملات تعريفة الماء (1، 3.25، 5.5، 6.5) وأشطر 0-25 / 26-55 / 56-82 / أكثر من 82 م³ في الفصل: النص الرسمي على <https://faolex.fao.org/docs/pdf/alg17245.pdf>
- اتاوة التسيير 3 دج/م³ واتاوة اقتصاد الماء 4% (شمال): ملخصات دروس جامعية (غير رسمية) وتتطابق مع فاتورتين فعليتين.
- الحق الثابت على الاستهلاك: قانون المالية 2025 كما نشرته الصحافة (<https://www.algerie360.com/vos-factures-sonelgaz-augmenteront-en-2025-nous-vous-revelons-les-montants-du-nouvel-impot/>).

### الترخيص
MIT — انظر [LICENSE](LICENSE).

---

## English

Open-source calculator that estimates an Algerian **electricity and gas** bill (from old/new meter readings) and **water** bill (from old/new meter readings). Works offline; Arabic, English, French; light and dark themes.

> ⚠️ **Disclaimer:** independent project, **not affiliated with Sonelgaz** or any authority. Results are estimates and may differ from the official bill (at least by rounding). The official bill is authoritative.

- **Run:** open `www/index.html` in a browser.
- **Test:** `npm test` (Node.js 20+).
- **Build Android:** `bash setup.sh`, then `npx cap open android` (needs JDK 21 and Android Studio with SDK 36).
- **Update prices:** edit only `www/tariffs.js`.
- **Contribute:** the most valuable help is verifying numbers against real bills. See [CONTRIBUTING.md](CONTRIBUTING.md). Always redact name, address and meter number from any bill image.
- **Known issues:** 1-centime VAT rounding difference on some bills; water tiers 3–4 (above 55 m³/quarter) are *estimated* from official coefficients (×5.5, ×6.5) and unconfirmed by a bill; SEAAL (Algiers/Tipaza) prices are not included yet; electricity-only/gas-only bills rely on assumptions (housing tax only with electricity, fixed charge follows electricity use).
- **License:** MIT.

---

## Français

Calculateur open source qui estime une facture **d'électricité et de gaz** (à partir des index) et une facture **d'eau** (à partir de la consommation en m³) en Algérie. Fonctionne hors ligne ; arabe, anglais, français ; thèmes clair et sombre.

> ⚠️ **Avertissement :** projet indépendant, **non affilié à Sonelgaz**. Les résultats sont des estimations pouvant différer de la facture officielle. La facture officielle fait foi.

- **Lancer :** ouvrir `www/index.html` dans un navigateur.
- **Tests :** `npm test` (Node.js 20+).
- **Android :** `bash setup.sh` puis `npx cap open android`.
- **Tarifs :** modifier uniquement `www/tariffs.js`.
- **Contribuer :** vérifier les chiffres avec de vraies factures (masquer nom, adresse et numéro de compteur). Voir [CONTRIBUTING.md](CONTRIBUTING.md).
- **Licence :** MIT.
