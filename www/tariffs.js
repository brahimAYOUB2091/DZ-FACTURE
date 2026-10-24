// التعريفات والرسوم — عدّل هذا الملف فقط عند تغيّر الأسعار (لا حاجة للمساس بالمنطق).
// Tariffs and fees — edit only this file when prices change. / Tarifs et redevances : modifier uniquement ce fichier.
// vat: 0.09 أو 0.19 | upTo: الكمية القصوى في الشطر (kWh للكهرباء، Th للغاز) | price: دج لكل وحدة
(function (root) {
  var TARIFFS = {
    updated: "2026-10",
    electricity: {
      tiers: [
        { upTo: 125, price: 1.7787, vat: 0.09 },
        { upTo: 125, price: 4.1789, vat: 0.09 },
        { upTo: 500, price: 4.8120, vat: 0.19 },
        { upTo: null, price: 5.4779, vat: 0.19 }   // الشطر 4: السعر غير مؤكد (لم يظهر في الفواتير المختبرة)
      ]
    },
    gas: {
      pcs: 8.86,                                  // معامل تحويل م³ إلى ثيرم
      tiers: [
        { upTo: 1125, price: 0.1682, vat: 0.09 },
        { upTo: 1375, price: 0.3245, vat: 0.09 },
        { upTo: 5000, price: 0.4025, vat: 0.19 },
        { upTo: null, price: 0.4599, vat: 0.19 }
      ]
    },
    subscription: 164.16,                         // الاشتراك (يخضع لـ TVA 9%)
    housingTax: 100,                              // رسم على السكن
    // الحق الثابت يتبع استهلاك الكهرباء في الفصل (kWh)؛ الشرائح مرتبة من الأعلى إلى الأدنى
    fixedCharge: [
      { minKwh: 391, amount: 200 },
      { minKwh: 191, amount: 100 },
      { minKwh: 70, amount: 25 }                  // قيمة أقل من 70 kWh غير مؤكدة (افتُرض 0)
    ],
    stampPerHundred: 1                            // الطابع عند الدفع نقداً: 1 دج لكل 100 دج (يُقرَّب للأعلى)
  };
  if (typeof module !== "undefined" && module.exports) module.exports = TARIFFS;
  else root.TARIFFS = TARIFFS;
})(typeof window !== "undefined" ? window : this);
