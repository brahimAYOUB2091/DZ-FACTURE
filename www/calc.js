// منطق الحساب (بدون واجهة) — يعمل في المتصفح وفي Node للاختبارات.
(function (root) {
  var TARIFFS = typeof module !== "undefined" && module.exports ? require("./tariffs.js") : root.TARIFFS;

  function r2(x) { return Math.round((x + 1e-9) * 100) / 100; }

  function tiers(qty, table) {
    var left = qty, out = [];
    table.forEach(function (t, i) {
      var q = Math.max(0, t.upTo == null ? left : Math.min(left, t.upTo));
      out.push({ n: i + 1, q: q, p: t.price, t: t.vat, a: r2(q * t.price) });
      left -= q;
    });
    return out;
  }

  function fixedCharge(kwh) {
    for (var i = 0; i < TARIFFS.fixedCharge.length; i++)
      if (kwh >= TARIFFS.fixedCharge[i].minKwh) return TARIFFS.fixedCharge[i].amount;
    return 0;
  }

  function compute(eOld, eNew, gOld, gNew) {
    var kwh = eNew - eOld, m3 = gNew - gOld, th = r2(m3 * TARIFFS.gas.pcs);
    var er = tiers(kwh, TARIFFS.electricity.tiers), gr = tiers(th, TARIFFS.gas.tiers);
    var base9 = TARIFFS.subscription, base19 = 0, ea = 0, ga = 0;
    er.concat(gr).forEach(function (r) { if (r.t === 0.09) base9 += r.a; else base19 += r.a; });
    er.forEach(function (r) { ea += r.a; });
    gr.forEach(function (r) { ga += r.a; });
    var ht = r2(ea + ga + TARIFFS.subscription);
    var v9 = r2(base9 * 0.09), v19 = r2(base19 * 0.19), vt = r2(v9 + v19);
    var fix = fixedCharge(kwh);
    var net = r2(ht + vt + fix + TARIFFS.housingTax);
    var st = Math.ceil(net / 100 * TARIFFS.stampPerHundred - 1e-9);
    return { kwh: kwh, m3: m3, th: th, er: er, gr: gr, ea: r2(ea), ga: r2(ga),
             ht: ht, v9: v9, v19: v19, vt: vt, fix: fix, net: net, st: st, total: r2(net + st) };
  }

  var api = { compute: compute, fixedCharge: fixedCharge };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DZCalc = api;
})(typeof window !== "undefined" ? window : this);
