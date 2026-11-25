// kit.jsx: reusable pieces in the studied style. Frosted panels beside a person, plain white text, hard restraint.
// Uses lib.jsx (anim, hold, tr, hex, span, fx, fxProp).
var K = {};
var WHITE = [1, 1, 1];
function fr(n) { return n / K.fps; }
function kitItem(name) { var P = app.project; for (var i = 1; i <= P.numItems; i++) if (P.item(i).name == name) return P.item(i); return null; }
function kitFoot(file) { var it = kitItem(file); if (it) return it; return app.project.importFile(new ImportOptions(new File(K.root + 'media/' + file))); }
function kitStart(o) {
  K = o; var old = kitItem(o.name); if (old) old.remove();
  K.comp = app.project.items.addComp(o.name, o.w, o.h, 1, o.dur, o.fps); K.comp.bgColor = [0, 0, 0];
}
function kitDone() { try { K.comp.openInViewer(); } catch (e) {} }
function kitText(str, size, font, style, color, just) {
  var L = K.comp.layers.addText(str), src = L.property('ADBE Text Properties').property('ADBE Text Document'), td = src.value;
  td.font = font; td.fontStyle = style; td.fontSize = size; td.fillColor = color || WHITE; td.applyFill = true;
  td.justification = just || ParagraphJustification.LEFT_JUSTIFY; src.setValue(td); return L;
}
function softShadow(L, op, soft) {
  var e = fx(L, 'ADBE Drop Shadow'), o = fxProp(e, 'Opacity'), d = fxProp(e, 'Distance'), s = fxProp(e, 'Softness');
  if (o) o.setValue(op); if (d) d.setValue(0); if (s) s.setValue(soft);
}
function rrShape(x, y, w, h, r) {
  var k = 0.5523 * r, s = new Shape();
  s.vertices = [[x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r]];
  s.inTangents = [[-k, 0], [0, 0], [0, -k], [0, 0], [k, 0], [0, 0], [0, k], [0, 0]];
  s.outTangents = [[0, 0], [k, 0], [0, 0], [0, k], [0, 0], [-k, 0], [0, 0], [0, -k]];
  s.closed = true; return s;
}
function rmask(L, x, y, w, h, r) { var m = L.property('ADBE Mask Parade').addProperty('ADBE Mask Atom'); m.property('ADBE Mask Shape').setValue(rrShape(x, y, w, h, r)); return m; }
function blurOf(L) { var e = fx(L, 'ADBE Gaussian Blur 2'); return fxProp(e, 'Blurriness'); }
function fadeIn(L, t, n) { tr(L, 'op').setValueAtTime(t, 0); tr(L, 'op').setValueAtTime(t + fr(n), 100); }
function fadeOut(L, t, n, from) { tr(L, 'op').setValueAtTime(t - fr(n), from == null ? 100 : from); tr(L, 'op').setValueAtTime(t, 0); }

function plate(file) { var L = K.comp.layers.add(kitFoot(file)); L.startTime = 0; L.inPoint = 0; L.outPoint = K.plateEnd; try { L.audioEnabled = false; } catch (e) {} tr(L, 'pos').setValue([K.w / 2, K.h / 2]); return L; }

// frosted frame: white tint + thin bright edge
function glass(x, y, w, h, r, tint, edge) {
  var L = K.comp.layers.addShape(); L.name = 'glass';
  var g = L.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group').property('ADBE Vectors Group');
  var q = g.addProperty('ADBE Vector Shape - Rect'); q.property('ADBE Vector Rect Size').setValue([w, h]); q.property('ADBE Vector Rect Roundness').setValue(r);
  var st = g.addProperty('ADBE Vector Graphic - Stroke'); st.property('ADBE Vector Stroke Color').setValue(WHITE); st.property('ADBE Vector Stroke Width').setValue(1.5); st.property('ADBE Vector Stroke Opacity').setValue(edge);
  var f = g.addProperty('ADBE Vector Graphic - Fill'); f.property('ADBE Vector Fill Color').setValue(WHITE); f.property('ADBE Vector Fill Opacity').setValue(tint);
  tr(L, 'pos').setValue([x + w / 2, y + h / 2]); return L;
}
// One frame that stays, content dissolves inside it. items: [{f, t, src}]
function panelRun(p, a, z, items) {
  var G = glass(p.x, p.y, p.w, p.h, p.r, 18, 48); span(G, a, z);
  anim(tr(G, 'op'), [[a, 0], [a + fr(8), 100]], OUT); fadeOut(G, z, 6);
  var iw = p.w - 2 * p.inset, ih = p.h - 2 * p.inset;
  for (var i = 0; i < items.length; i++) {
    var it = items[i], src = kitFoot(it.f), L = K.comp.layers.add(src), t0 = it.t + (i ? 0 : fr(4)), t1 = i < items.length - 1 ? items[i + 1].t + fr(6) : z;
    var sc = Math.max(iw / src.width, ih / src.height) * 100;
    L.startTime = t0 - (it.src || 0); L.inPoint = t0; L.outPoint = t1; try { L.audioEnabled = false; } catch (e) {}
    tr(L, 'scale').setValue([sc, sc]); tr(L, 'pos').setValue([p.x + p.w / 2, p.y + p.h / 2]);
    var mw = iw / sc * 100, mh = ih / sc * 100;
    rmask(L, (src.width - mw) / 2, (src.height - mh) / 2, mw, mh, p.innerR / sc * 100);
    if (i == 0) { var b = blurOf(L); if (b) anim(b, [[t0, 24], [t0 + fr(10), 0]], OUT); }
    anim(tr(L, 'op'), [[t0, 0], [t0 + fr(i ? 5 : 10), 100]], OUT);
    if (i == items.length - 1) fadeOut(L, z, 6);
  }
}
function phone(file, x, y, w, h, a, z) {
  var G = glass(x - 8, y - 8, w + 16, h + 16, 38, 22, 55); span(G, a, z); anim(tr(G, 'op'), [[a, 0], [a + fr(8), 100]], OUT); fadeOut(G, z, 6);
  var src = kitFoot(file), L = K.comp.layers.add(src), sc = w / src.width * 100;
  span(L, a, z); L.startTime = a; L.inPoint = a; L.outPoint = z; tr(L, 'scale').setValue([sc, sc]); tr(L, 'pos').setValue([x + w / 2, y + h / 2]);
  var mh = h / sc * 100; rmask(L, 0, (src.height - mh) / 2, src.width, mh, 31 / sc * 100);
  anim(tr(L, 'op'), [[a + fr(3), 0], [a + fr(11), 100]], OUT); fadeOut(L, z, 6);
}
function nameText(name, role, x, y, a, z) {
  var N = kitText(name, 46, 'Inter', 'SemiBold'), R = kitText(role, 32, 'Inter', 'Regular');
  tr(N, 'pos').setValue([x, y]); tr(R, 'pos').setValue([x, y + 46]);
  var q = [N, R]; for (var i = 0; i < 2; i++) { span(q[i], a, z); softShadow(q[i], 60, 26); fadeIn(q[i], a + i * fr(3), 8); fadeOut(q[i], z, 6); }
}
// phrase: lines appear on the spoken word, one italic serif accent
function phrase(lines, x, y, size, times, z) {
  for (var i = 0; i < lines.length; i++) {
    var it = lines[i][1], L = kitText(lines[i][0], it ? size * 1.16 : size, it ? 'Instrument Serif' : 'Inter', it ? 'Italic' : 'Medium');
    tr(L, 'pos').setValue([x, y + i * size * 1.12]); span(L, times[i], z); softShadow(L, 45, 40);
    var b = blurOf(L); if (b) anim(b, [[times[i], 10], [times[i] + fr(7), 0]], OUT);
    fadeIn(L, times[i], 6); fadeOut(L, z, 6);
  }
}