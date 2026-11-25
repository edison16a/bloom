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
