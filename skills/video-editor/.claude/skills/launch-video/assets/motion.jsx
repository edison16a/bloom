// motion.jsx: product film pieces. Load lib.jsx and kit.jsx first. Every move starts and ends soft.
// Screen = rigPosition + scale * local, so a move is always "put this point of the UI here, at this size".
var SOFT = [0.35, 0.1, 0.12, 1]; // slow in, long soft landing
function productStart(o) { kitStart(o); try { K.comp.motionBlur = true; K.comp.shutterAngle = 120; K.comp.motionBlurSamplesPerFrame = 48; K.comp.motionBlurAdaptiveSampleLimit = 128; } catch (e) { LOG.push('mb ' + e); } }
function mb(L) { try { L.motionBlur = true; } catch (e) {} return L; }

// Plain field, or a soft two colour field. c2 optional.
function field(c1, c2, a, z) {
  var L = K.comp.layers.addSolid(hex(c1), 'field', K.w, K.h, 1); span(L, a, z);
  if (c2) {
    var r = fx(L, 'ADBE Ramp');
    fxProp(r, 'Start of Ramp').setValue([K.w * 0.5, K.h * 0.1]); fxProp(r, 'Start Color').setValue(hex(c1));
    fxProp(r, 'End of Ramp').setValue([K.w * 0.5, K.h * 1.15]); fxProp(r, 'End Color').setValue(hex(c2));
  }
  return L;
}
// Real footage or a photo as a quiet backdrop, filling the frame.
function backdrop(file, blur, a, z) {
  var src = kitFoot(file), L = K.comp.layers.add(src), sc = Math.max(K.w / src.width, K.h / src.height) * 104;
  L.startTime = a; span(L, a, z); try { L.audioEnabled = false; } catch (e) {}
  tr(L, 'scale').setValue([sc, sc]); tr(L, 'pos').setValue([K.w / 2, K.h / 2]);
  if (blur) blurOf(L).setValue(blur); return L;
}

// One app window made of its real states. states: [{f, t}] with t in film seconds. Returns {comp, w, h}.
// The whole window is one layer later, so a tilt or a shadow moves all of it.
function uiWindow(name, w, h, states) {
  var old = kitItem(name); if (old) old.remove();
  var C = app.project.items.addComp(name, w, h, 1, K.dur, K.fps);
  for (var i = 0; i < states.length; i++) {
    var s = states[i], src = kitFoot(s.f), L = C.layers.add(src), sc = w / src.width * 100;
    L.startTime = Math.max(0, s.t - (s.src || 0)); span(L, s.t, K.dur); tr(L, 'anchor').setValue([0, 0]); tr(L, 'pos').setValue([0, 0]); tr(L, 'scale').setValue([sc, sc]);
    if (i) anim(tr(L, 'op'), [[s.t, 0], [s.t + (s.d || 0.15), 100]], OUT);
  }
  return { comp: C, w: w, h: h };
}
// A camera. Everything parented to it moves as one.
function camera(a, z) { var N = K.comp.layers.addNull(); N.name = 'camera'; span(N, a, z); tr(N, 'anchor').setValue([0, 0]); tr(N, 'pos').setValue([0, 0]); return N; }
// moves: [[t, [localX, localY], scale, [screenX, screenY]?], ...]. Give two keys with the same values to rest.
function cameraMoves(N, moves, curve) {
  var P = [], S = [];
  for (var i = 0; i < moves.length; i++) {
    var m = moves[i], s = m[2], f = m[3] || [K.w / 2, K.h / 2];
    P.push([m[0], [f[0] - s * m[1][0], f[1] - s * m[1][1]]]); S.push([m[0], [s * 100, s * 100]]);
  }
  anim(tr(N, 'pos'), P, curve || INOUT); anim(tr(N, 'scale'), S, curve || INOUT);
}
// Place a window on the camera with its top left at x, y (local units, 1 = 1 px at camera scale 1).
function placeWindow(U, cam, x, y, w, r, a, z) {
  var L = K.comp.layers.add(U.comp), k = w / U.w; L.startTime = 0; span(L, a, z); mb(L);
  if (cam) L.parent = cam;
  tr(L, 'anchor').setValue([U.w / 2, U.h / 2]); tr(L, 'pos').setValue([x + w / 2, y + U.h * k / 2]); tr(L, 'scale').setValue([k * 100, k * 100]);
  rmask(L, 0, 0, U.w, U.h, r / k);
  var d = fx(L, 'ADBE Drop Shadow'); fxProp(d, 'Opacity').setValue(34); fxProp(d, 'Direction').setValue(180); fxProp(d, 'Distance').setValue(22 / k); fxProp(d, 'Softness').setValue(90 / k);
  return L;
}
// Arrives leaning back, then lies flat. One per film.
function settleFlat(L, t, dur, lean) {
  dur = dur || 1.4; L.threeDLayer = true;
  anim(tr(L, 'rotX'), [[t, lean || 26], [t + dur, 0]], SOFT);
  anim(tr(L, 'op'), [[t, 0], [t + 0.3, 100]], OUT);
  var b = blurOf(L); anim(b, [[t, 14], [t + 0.55, 0]], OUT);
}
// Panel arriving over the window: 60 px travel, fade, small blur. No overshoot.
function arrive(L, t, dir, dist) {
  var p = tr(L, 'pos').value, d = dist || 60, v = { up: [0, d], down: [0, -d], left: [d, 0], right: [-d, 0] }[dir || 'up'];
  anim(tr(L, 'pos'), [[t, [p[0] + v[0], p[1] + v[1]]], [t + 0.7, [p[0], p[1]]]], EXPO);
  anim(tr(L, 'op'), [[t, 0], [t + 0.28, 100]], OUT); mb(L);
}
function leave(L, t) { anim(tr(L, 'op'), [[t, 100], [t + 0.25, 0]], INOUT); var b = blurOf(L); anim(b, [[t, 0], [t + 0.25, 14]], INOUT); }
// Rows fanning in one after another: 0.07 s apart.
function fan(layers, t, gap) { for (var i = 0; i < layers.length; i++) arrive(layers[i], t + i * (gap || 0.07), 'up', 46); }

// One plain line. Words rise 0.1 s apart and leave together. o: {size, color, style, left, x, hold}
function line(str, y, a, z, o) {
  o = o || {}; var size = o.size || 72, L = kitText(str, size, o.font || 'Inter', o.style || 'Medium', hex(o.color || '#FFFFFF'), o.left ? ParagraphJustification.LEFT_JUSTIFY : ParagraphJustification.CENTER_JUSTIFY);
  tr(L, 'pos').setValue([o.x == null ? K.w / 2 : o.x, y + size * 0.36]); span(L, a, z); mb(L);
  var tp = L.property('ADBE Text Properties'), an = tp.property('ADBE Text Animators').addProperty('ADBE Text Animator'), ap = an.property('ADBE Text Animator Properties');
  ap.addProperty('ADBE Text Opacity').setValue(0); ap.addProperty('ADBE Text Blur').setValue([8, 8]); ap.addProperty('ADBE Text Position 3D').setValue([0, size * 0.18, 0]);
  var sel = an.property('ADBE Text Selectors').addProperty('ADBE Text Selector'), adv = sel.property('advanced');
  adv.property('basedOn').setValue(3); adv.property('smoothness').setValue(100);
  anim(sel.property('ADBE Text Percent Start'), [[a, 0], [a + 0.35 + 0.1 * str.split(' ').length, 100]], OUT);
  if (!o.hold) leave(L, z - 0.25);
  return L;
}
// The pointer. path: [[t, [x, y]], ...] in screen px, clicks: [t, ...]
function pointer(path, clicks, a, z) {
  var L = K.comp.layers.addShape(); L.name = 'pointer'; var k = 1.7, pts = [[0, 0], [0, 23], [6, 17.5], [10, 26.5], [13.6, 25], [9.7, 16.3], [17.2, 16.3]];
  for (var i = 0; i < pts.length; i++) pts[i] = [pts[i][0] * k, pts[i][1] * k];
  var g = L.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group').property('ADBE Vectors Group');
  var p = g.addProperty('ADBE Vector Shape - Group'), s = new Shape(); s.vertices = pts; s.closed = true; p.property('ADBE Vector Shape').setValue(s);
  var st = g.addProperty('ADBE Vector Graphic - Stroke'); st.property('ADBE Vector Stroke Color').setValue(WHITE); st.property('ADBE Vector Stroke Width').setValue(2.5);
  var f = g.addProperty('ADBE Vector Graphic - Fill'); f.property('ADBE Vector Fill Color').setValue([0.06, 0.06, 0.07]);
  span(L, a, z); mb(L); softShadow(L, 35, 14); anim(tr(L, 'pos'), path, INOUT); fadeIn(L, a, 8);
  var sk = []; for (var c = 0; c < clicks.length; c++) sk.push([clicks[c] - 0.06, [100, 100]], [clicks[c] + 0.03, [88, 88]], [clicks[c] + 0.22, [100, 100]]);
  if (sk.length) anim(tr(L, 'scale'), sk, INOUT); return L;
}