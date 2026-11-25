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
