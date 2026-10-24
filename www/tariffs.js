// التعريفات والرسوم — عدّل هذا الملف فقط عند تغيّر الأسعار (لا حاجة للمساس بالمنطق).
// Tariffs and fees — edit only this file when prices change. / Tarifs et redevances : modifier uniquement ce fichier.
// vat: 0.09 أو 0.19 | upTo: عرض الشطر (kWh للكهرباء، Th للغاز، م³ للماء) | price: دج لكل وحدة
(function (root) {
  var TARIFFS = {
    updated: "2026-10",
    electricity: {
      tiers: [
        { upTo: 125, price: 1.7787, vat: 0.09 },
        { upTo: 125, price: 4.1789, vat: 0.09 },
        { upTo: 750, price: 4.8120, vat: 0.19 },   // الشطر 3: من 250 إلى 1000 kWh في الفصل
        { upTo: null, price: 5.4796, vat: 0.19 }   // الشطر 4: أكثر من 1000 kWh
      ],
      pmdPrice: 4.37                              // ثمن القدرة المتاحة (التعريفة 54 م): دج / kW / شهر
    },
    gas: {
      pcs: 8.86,                                  // معامل تحويل م³ إلى ثيرم
      fixedFeePerMonth: 28.50,                    // الاتاوة الثابتة للغاز: دج / شهر
      tiers: [
        { upTo: 1125, price: 0.1682, vat: 0.09 },
        { upTo: 1375, price: 0.3245, vat: 0.09 },
        { upTo: 5000, price: 0.4025, vat: 0.19 },
        { upTo: null, price: 0.4599, vat: 0.19 }
      ]
    },
    // الاشتراك = (ثمن القدرة 4.37 × kW × 3 أشهر) + (اتاوة الغاز 28.50 × 3)، ويخضع لـ TVA 9%. التحقق: 78.66 + 85.50 = 164.16
    housingTax: 100,                              // رسم على السكن: يُطبَّق مع الكهرباء فقط (افتراض غير مؤكد لفاتورة غاز وحدها)
    // الحق الثابت يتبع استهلاك الكهرباء في الفصل (kWh)؛ الشرائح مرتبة من الأعلى إلى الأدنى
    fixedCharge: [
      { minKwh: 391, amount: 200 },
      { minKwh: 191, amount: 100 },
      { minKwh: 70, amount: 25 }                  // قيمة أقل من 70 kWh غير مؤكدة (افتُرض 0)
    ],
    stampPerHundred: 1,                           // الطابع عند الدفع نقداً: 1 دج لكل 100 دج (يُقرَّب للأعلى)

    // الماء (الجزائرية للمياه) — فاتورة فصلية. المصدر: فاتورتان فصل T2 و T3 2026
    water: {
      fixedWater: 240,        // الاتاوة الثابتة للاشتراك (ماء)
      fixedSanitation: 60,    // الاتاوة الثابتة للاشتراك (تطهير)
      vat: 0.09,
      managementPerM3: 3,     // اتاوة التسيير: دج لكل م³
      qualityRate: 0.04,      // اتاوة نوعية الماء: على مبلغ الماء المستهلك (دون الاتاوة الثابتة)
      economyRate: 0.04,      // اتاوة اقتصاد الماء: نفس القاعدة (4% ولايات الشمال، وتذكر مراجع أنها 2% للجنوب — غير مؤكد)
      stampPerHundred: 1,
      // upTo = حجم الشطر بالم³ (0-25 | 26-55 | 56-82 | 83 فأكثر). null = سعر غير معروف بعد
      tiers: [
        { upTo: 25,   water: 6.10,  sanitation: 2.20 },
        { upTo: 30,   water: 19.83, sanitation: 7.15 },
        // الشطران 3 و4 مقدَّران من المعاملات الرسمية (×1 و×3.25 و×5.5 و×6.5 من سعر الشطر 1) ولم تؤكدهما فاتورة بعد
        { upTo: 27,   water: 33.55, sanitation: 12.10, estimated: true },   // 6.10×5.5 و 2.20×5.5
        { upTo: null, water: 39.65, sanitation: 14.30, estimated: true }    // 6.10×6.5 و 2.20×6.5
      ]
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = TARIFFS;
  else root.TARIFFS = TARIFFS;
})(typeof window !== "undefined" ? window : this);
