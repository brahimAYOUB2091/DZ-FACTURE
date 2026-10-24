const test = require("node:test");
const assert = require("node:assert");
const { compute } = require("../www/calc.js");
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
