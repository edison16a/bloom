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