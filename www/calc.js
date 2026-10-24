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

  // eOld/eNew أو gOld/gNew يمكن أن تكون null لحساب الكهرباء وحدها أو الغاز وحده
  function compute(eOld, eNew, gOld, gNew, pmd) {
    var E = TARIFFS.electricity, G = TARIFFS.gas;
    var hasE = eOld != null && eNew != null, hasG = gOld != null && gNew != null;
    var kwh = hasE ? eNew - eOld : 0, m3 = hasG ? gNew - gOld : 0, th = r2(m3 * G.pcs);
    var er = hasE ? tiers(kwh, E.tiers) : [], gr = hasG ? tiers(th, G.tiers) : [];
    var sub = r2((hasE ? E.pmdPrice * (pmd || 6) * 3 : 0) + (hasG ? G.fixedFeePerMonth * 3 : 0));
    var base9 = sub, base19 = 0, ea = 0, ga = 0;
    er.concat(gr).forEach(function (r) { if (r.t === 0.09) base9 += r.a; else base19 += r.a; });
    er.forEach(function (r) { ea += r.a; });
    gr.forEach(function (r) { ga += r.a; });
    var ht = r2(ea + ga + sub);
    var v9 = r2(base9 * 0.09), v19 = r2(base19 * 0.19), vt = r2(v9 + v19);
    var fix = hasE ? fixedCharge(kwh) : 0, hab = hasE ? TARIFFS.housingTax : 0;
    var net = r2(ht + vt + fix + hab);
    var st = Math.ceil(net / 100 * TARIFFS.stampPerHundred - 1e-9);
    return { hasE: hasE, hasG: hasG, kwh: kwh, m3: m3, th: th, er: er, gr: gr, ea: r2(ea), ga: r2(ga), sub: sub,
             ht: ht, v9: v9, v19: v19, vt: vt, fix: fix, hab: hab, net: net, st: st, total: r2(net + st) };
  }

  function computeWater(m3) {
    var W = TARIFFS.water, left = m3, estimated = false;
    W.tiers.forEach(function (t) {
      var q = Math.max(0, t.upTo == null ? left : Math.min(left, t.upTo));
      if (q > 0 && t.estimated) estimated = true;
      left -= q;
    });
    var wr = tiers(m3, W.tiers.map(function (t) { return { upTo: t.upTo, price: t.water, vat: W.vat }; }));
    var sr = tiers(m3, W.tiers.map(function (t) { return { upTo: t.upTo, price: t.sanitation, vat: W.vat }; }));
    var wcons = 0, scons = 0;
    wr.forEach(function (r) { wcons += r.a; });
    sr.forEach(function (r) { scons += r.a; });
    wcons = r2(wcons); scons = r2(scons);
    var wsub = r2(W.fixedWater + wcons), ssub = r2(W.fixedSanitation + scons), ht = r2(wsub + ssub);
    var vat = r2(ht * W.vat), mgmt = r2(m3 * W.managementPerM3);
    var qual = r2(wcons * W.qualityRate), eco = r2(wcons * W.economyRate);
    var taxes = r2(vat + mgmt + qual + eco), bill = r2(ht + taxes);
    var st = Math.ceil(bill / 100 * W.stampPerHundred - 1e-9);
    return { m3: m3, wr: wr, sr: sr, wcons: wcons, wsub: wsub, ssub: ssub, ht: ht, vat: vat, mgmt: mgmt,
             qual: qual, eco: eco, taxes: taxes, bill: bill, st: st, total: r2(bill + st), estimated: estimated };
  }

  var api = { compute: compute, computeWater: computeWater, fixedCharge: fixedCharge };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DZCalc = api;
})(typeof window !== "undefined" ? window : this);
