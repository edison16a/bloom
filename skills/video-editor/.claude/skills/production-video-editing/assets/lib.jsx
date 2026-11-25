var LOG = [];
// ---------- timing + easing ----------
var OUT = [0.23, 1, 0.32, 1], INOUT = [0.77, 0, 0.175, 1], EXPO = [0.16, 1, 0.3, 1];

function dimsOf(v) { return (v instanceof Array) ? v.length : 1; }

// keys: [[t, v], ...]; curve(s) applied per segment (one curve, or an array per segment).
function anim(prop, keys, curve) {
  curve = curve || OUT;
  for (var i = 0; i < keys.length; i++) prop.setValueAtTime(keys[i][0], keys[i][1]);
  if (keys.length < 2) return;
  var idx = [];
  for (var i2 = 0; i2 < keys.length; i2++) idx.push(prop.nearestKeyIndex(keys[i2][0]));
  var spatial = false; try { spatial = prop.isSpatial; } catch (e) {}
  var n = spatial ? 1 : dimsOf(keys[0][1]);
  var inE = [], outE = [];
  for (var k = 0; k < keys.length; k++) { inE.push(null); outE.push(null); }
  for (var s = 0; s < keys.length - 1; s++) {
    var c = (curve[0] instanceof Array) ? curve[s] : curve;
    var dt = keys[s + 1][0] - keys[s][0];
    var v0 = keys[s][1], v1 = keys[s + 1][1];
    var avg = [];
    if (spatial) {
      var d2 = 0; for (var q = 0; q < Math.min(v0.length, v1.length); q++) d2 += Math.pow(v1[q] - v0[q], 2);
      avg.push(Math.sqrt(d2) / dt);
    } else if (n == 1) avg.push((v1 - v0) / dt);
    else for (var q2 = 0; q2 < n; q2++) avg.push((v1[q2] - v0[q2]) / dt);
    var o = [], ii = [];
    for (var d = 0; d < avg.length; d++) {
      o.push(new KeyframeEase(avg[d] * (c[1] / Math.max(c[0], 0.001)), Math.max(0.1, c[0] * 100)));
      ii.push(new KeyframeEase(avg[d] * ((1 - c[3]) / Math.max(1 - c[2], 0.001)), Math.max(0.1, (1 - c[2]) * 100)));
    }
    outE[s] = o; inE[s + 1] = ii;
  }
  for (var k2 = 0; k2 < keys.length; k2++) {
    var dflt = [];
    for (var d3 = 0; d3 < (spatial ? 1 : n); d3++) dflt.push(new KeyframeEase(0, 33.33));
    try { prop.setTemporalEaseAtKey(idx[k2], inE[k2] || dflt, outE[k2] || dflt); } catch (e) { LOG.push('ease ' + prop.name + ': ' + e); }
    if (spatial) { try { prop.setSpatialTangentsAtKey(idx[k2], [0, 0, 0], [0, 0, 0]); } catch (e2) {} }
  }
}
function hold(prop, keys) {
  for (var i = 0; i < keys.length; i++) {
    prop.setValueAtTime(keys[i][0], keys[i][1]);
    try { prop.setInterpolationTypeAtKey(prop.nearestKeyIndex(keys[i][0]), KeyframeInterpolationType.HOLD); } catch (e) {}
  }
}
function tr(L, name) {
  var m = { pos: 'ADBE Position', scale: 'ADBE Scale', op: 'ADBE Opacity', rot: 'ADBE Rotate Z', anchor: 'ADBE Anchor Point', rotX: 'ADBE Rotate X' };
  return L.property('ADBE Transform Group').property(m[name]);
}
function hex(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255]; }
function span(L, a, z) { L.inPoint = a; L.outPoint = z; }
function fx(L, match) { return L.property('ADBE Effect Parade').addProperty(match); }