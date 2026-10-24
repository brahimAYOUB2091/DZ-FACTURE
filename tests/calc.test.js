const test = require("node:test");
const assert = require("node:assert");
const { compute, computeWater } = require("../www/calc.js");
const waterBills = require("./water-bills.json");
const bills = require("./bills.json");

// تسامح سنتيم واحد: فرق معروف في تقريب TVA (انظر README > مسائل معروفة)
const close = (a, b) => assert.ok(Math.abs(a - b) <= 0.0101, `${a} vs ${b}`);

for (const b of bills) {
  test(b.name, () => {
    const r = compute(...b.readings);
    assert.strictEqual(r.fix, b.fixedCharge);
    close(r.net, b.net);
    assert.strictEqual(r.st, b.stamp);
    close(r.total, b.total);
  });
}

test("استهلاك صفري لا يعطي قيماً سالبة", () => {
  const r = compute(100, 100, 100, 100);
  assert.ok(r.net >= 0 && r.total >= 0);
});

for (const b of waterBills) {
  test(b.name, () => {
    const r = computeWater(b.m3);
    close(r.ht, b.ht); close(r.taxes, b.taxes); close(r.bill, b.bill);
    assert.strictEqual(r.st, b.stamp);
    close(r.total, b.total);
  });
}

test("الماء: فوق 55 م³ يُحسب بالأسعار المقدَّرة ويُعلَّم", () => {
  assert.strictEqual(computeWater(60).estimated, true);
  assert.strictEqual(computeWater(55).estimated, false);
});

// الماء: تطابق كامل مع الفاتورتين (بدون تسامح)
for (const b of waterBills) {
  test(b.name, () => {
    assert.strictEqual(b.readings[1] - b.readings[0], b.m3);
    const r = computeWater(b.m3);
    for (const k of ["ht", "vat", "mgmt", "qual", "eco", "taxes", "bill", "total"]) assert.strictEqual(r[k], b[k], k);
    assert.strictEqual(r.st, b.stamp);
    assert.ok(!r.missing);
  });
}

test("الكهرباء وحدها: الاشتراك = ثمن القدرة × 6 kW × 3 أشهر", () => {
  const r = compute(9343, 9655, null, null);
  assert.strictEqual(r.hasE, true); assert.strictEqual(r.hasG, false);
  assert.strictEqual(r.sub, 78.66); assert.strictEqual(r.fix, 100); assert.strictEqual(r.hab, 100);
});

test("الغاز وحده: الاشتراك 28.50 × 3 ولا حق ثابت", () => {
  const r = compute(null, null, 4163, 4371);
  assert.strictEqual(r.hasE, false); assert.strictEqual(r.sub, 85.5); assert.strictEqual(r.fix, 0);
});

test("اشتراك الكهرباء يتبع القدرة المختارة", () => {
  assert.strictEqual(compute(0, 10, null, null, 12).sub, 157.32);
});

test("الكهرباء: الشطر 3 يمتد حتى 1000 kWh", () => {
  assert.strictEqual(compute(0, 1000, null, null).er[3].q, 0);
  assert.strictEqual(compute(0, 1100, null, null).er[3].q, 100);
});
