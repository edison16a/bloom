import type { Geometry } from "../core/types";

/** Centre and scale so the longest side spans -1..1. */
export function normalizeGeometry(g: Geometry): Geometry {
  const p = g.position, lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (let i = 0; i < p.length; i++) { const k = i % 3; lo[k] = Math.min(lo[k], p[i]); hi[k] = Math.max(hi[k], p[i]); }
  const s = 2 / Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]), out = new Float32Array(p.length);
  for (let i = 0; i < p.length; i++) { const k = i % 3; out[i] = (p[i] - (lo[k] + hi[k]) / 2) * s; }
  return { ...g, position: out };
}

/** Area-weighted scatter over a triangle mesh: even dots no matter how the mesh was tessellated. */
export function samplePoints(g: Geometry, count = 120000): Geometry {
  const { position: p, normal: nn, color: cc } = g;
  const idx = g.index ?? Uint32Array.from({ length: p.length / 3 }, (_, i) => i);
  const tris = idx.length / 3, cdf = new Float64Array(tris); let sum = 0;
  const V = (i: number) => [p[i * 3], p[i * 3 + 1], p[i * 3 + 2]];
  for (let t = 0; t < tris; t++) {
    const a = V(idx[t * 3]), b = V(idx[t * 3 + 1]), c = V(idx[t * 3 + 2]);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    sum += Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]); cdf[t] = sum;
  }
  const pos = new Float32Array(count * 3), nrm = new Float32Array(count * 3), col = cc ? new Float32Array(count * 3) : undefined;
  let seed = 11; const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < count; i++) {
    const target = ((i + rnd()) / count) * sum; let lo = 0, hi = tris - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < target) lo = m + 1; else hi = m; }
    let u = rnd(), v = rnd(); if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v, I = [idx[lo * 3], idx[lo * 3 + 1], idx[lo * 3 + 2]], W = [w, u, v];
    for (let k = 0; k < 3; k++) {
      let P = 0, N = 0, C = 0;
      for (let j = 0; j < 3; j++) { P += p[I[j] * 3 + k] * W[j]; if (nn) N += nn[I[j] * 3 + k] * W[j]; if (cc) C += cc[I[j] * 3 + k] * W[j]; }
      pos[i * 3 + k] = P; nrm[i * 3 + k] = N; if (col) col[i * 3 + k] = C;
    }
    if (!nn) {
      const a = V(I[0]), b = V(I[1]), c = V(I[2]);
      const s = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], t = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      nrm.set([s[1] * t[2] - s[2] * t[1], s[2] * t[0] - s[0] * t[2], s[0] * t[1] - s[1] * t[0]], i * 3);
    }
    const l = Math.hypot(nrm[i * 3], nrm[i * 3 + 1], nrm[i * 3 + 2]) || 1;
    nrm[i * 3] /= l; nrm[i * 3 + 1] /= l; nrm[i * 3 + 2] /= l;
  }
  return { position: pos, normal: nrm, color: col };
}

export function parseOBJ(text: string): Geometry {
  const v: number[] = [], n: number[] = [], P: number[] = [], N: number[] = [];
  for (const line of text.split("\n")) {
    const t = line.trim().split(/\s+/);
    if (t[0] === "v") v.push(+t[1], +t[2], +t[3]);
    else if (t[0] === "vn") n.push(+t[1], +t[2], +t[3]);
    else if (t[0] === "f") {
      const c = t.slice(1).map((s) => s.split("/").map((x) => (x ? parseInt(x, 10) : 0)));
      const at = (i: number, len: number) => (i < 0 ? len / 3 + i : i - 1);
      for (let i = 1; i + 1 < c.length; i++) for (const k of [c[0], c[i], c[i + 1]]) {
        const a = at(k[0], v.length) * 3; P.push(v[a], v[a + 1], v[a + 2]);
        if (k[2]) { const b = at(k[2], n.length) * 3; N.push(n[b], n[b + 1], n[b + 2]); }
      }
    }
  }
  return { position: new Float32Array(P), normal: N.length === P.length ? new Float32Array(N) : undefined };
}

/** Binary glTF: positions, normals, vertex colours, base colour factors and node transforms. No Draco or meshopt. */
export function parseGLB(buf: ArrayBuffer): Geometry {
  const dv = new DataView(buf);
  if (dv.getUint32(0, true) !== 0x46546c67) throw new Error("dot-art: not a .glb file");
  const jl = dv.getUint32(12, true), json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 20, jl)));
  if (json.extensionsRequired?.some((e: string) => /draco|meshopt/i.test(e))) throw new Error("dot-art: compressed GLB. Run: npx @gltf-transform/cli copy in.glb out.glb --no-compress");
  const bin = 20 + jl + 8;
  const read = (i: number) => {
    const a = json.accessors[i], bv = json.bufferViews[a.bufferView], n = ({ SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 } as Record<string, number>)[a.type];
    const size = ({ 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 } as Record<number, number>)[a.componentType], stride = bv.byteStride || n * size;
    const off = bin + (bv.byteOffset ?? 0) + (a.byteOffset ?? 0), out = new Float64Array(a.count * n);
    for (let k = 0; k < a.count; k++) for (let j = 0; j < n; j++) {
      const o = off + k * stride + j * size;
      const x = a.componentType === 5126 ? dv.getFloat32(o, true) : a.componentType === 5125 ? dv.getUint32(o, true) : a.componentType === 5123 ? dv.getUint16(o, true) : a.componentType === 5121 ? dv.getUint8(o) : a.componentType === 5122 ? dv.getInt16(o, true) : dv.getInt8(o);
      out[k * n + j] = a.normalized ? x / ({ 5121: 255, 5123: 65535, 5120: 127, 5122: 32767 } as Record<number, number>)[a.componentType] : x;
    }
    return { out, n, count: a.count as number };
  };
  const P: number[] = [], N: number[] = [], C: number[] = [], I: number[] = [];
  type M = number[];
  const mul = (a: M, b: M) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
  const trs = (n: { matrix?: M; translation?: M; rotation?: M; scale?: M }): M => {
    if (n.matrix) return n.matrix;
    const [x, y, z, w] = n.rotation ?? [0, 0, 0, 1], [sx, sy, sz] = n.scale ?? [1, 1, 1], [tx, ty, tz] = n.translation ?? [0, 0, 0];
    return [(1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + z * w) * sx, 2 * (x * z - y * w) * sx, 0, 2 * (x * y - z * w) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + x * w) * sy, 0, 2 * (x * z + y * w) * sz, 2 * (y * z - x * w) * sz, (1 - 2 * (x * x + y * y)) * sz, 0, tx, ty, tz, 1];
  };
  const walk = (i: number, m: M) => {
    const nd = json.nodes[i], w = mul(m, trs(nd));
    if (nd.mesh !== undefined) for (const pr of json.meshes[nd.mesh].primitives) {
      if ((pr.mode ?? 4) !== 4) continue;
      const pos = read(pr.attributes.POSITION), nor = pr.attributes.NORMAL !== undefined ? read(pr.attributes.NORMAL) : null, col = pr.attributes.COLOR_0 !== undefined ? read(pr.attributes.COLOR_0) : null;
      const base = json.materials?.[pr.material]?.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1], start = P.length / 3;
      for (let k = 0; k < pos.count; k++) {
        const [x, y, z] = [pos.out[k * 3], pos.out[k * 3 + 1], pos.out[k * 3 + 2]];
        P.push(w[0] * x + w[4] * y + w[8] * z + w[12], w[1] * x + w[5] * y + w[9] * z + w[13], w[2] * x + w[6] * y + w[10] * z + w[14]);
        if (nor) { const [a, b, c] = [nor.out[k * 3], nor.out[k * 3 + 1], nor.out[k * 3 + 2]]; N.push(w[0] * a + w[4] * b + w[8] * c, w[1] * a + w[5] * b + w[9] * c, w[2] * a + w[6] * b + w[10] * c); } else N.push(0, 0, 0);
        for (let j = 0; j < 3; j++) C.push(base[j] * (col ? col.out[k * col.n + j] : 1));
      }
      if (pr.indices !== undefined) { const ix = read(pr.indices); for (let k = 0; k < ix.count; k++) I.push(start + ix.out[k]); }
      else for (let k = 0; k < pos.count; k++) I.push(start + k);
    }
    for (const c of nd.children ?? []) walk(c, w);
  };
  const id = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  for (const r of json.scenes[json.scene ?? 0].nodes) walk(r, id);
  const hasN = N.some((x) => x !== 0);
  return { position: new Float32Array(P), normal: hasN ? new Float32Array(N) : undefined, color: new Float32Array(C), index: new Uint32Array(I) };
}
