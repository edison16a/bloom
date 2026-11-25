import type { Camera, Vec3 } from "./types";

export type Mat4 = Float32Array;

export function perspective(fovDeg: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: Vec3): Vec3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

export function lookAt(eye: Vec3, target: Vec3, roll = 0): Mat4 {
  const z = norm(sub(eye, target));
  const up: Vec3 = Math.abs(z[1]) > 0.999 ? [0, 0, -1] : [0, 1, 0];
  let x = norm(cross(up, z)), y = cross(z, x);
  if (roll) {
    const c = Math.cos(roll), s = Math.sin(roll), x0 = x, y0 = y;
    x = [x0[0] * c + y0[0] * s, x0[1] * c + y0[1] * s, x0[2] * c + y0[2] * s];
    y = [y0[0] * c - x0[0] * s, y0[1] * c - x0[1] * s, y0[2] * c - x0[2] * s];
  }
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
}

export function multiply(a: Mat4, b: Mat4): Mat4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++)
    o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  return o;
}

export function resolveCamera(cam: Camera | undefined, aspect: number) {
  const c: Required<Camera> = { eye: [0, 0, 5], target: [0, 0, 0], fov: 35, near: 0.1, far: 30, roll: 0, minAspect: 0, ...cam };
  if (aspect < c.minAspect) c.fov = (Math.atan((Math.tan((c.fov * Math.PI) / 360) * c.minAspect) / aspect) * 360) / Math.PI;
  const view = lookAt(c.eye, c.target, c.roll);
  return { ...c, view, viewProj: multiply(perspective(c.fov, aspect, c.near, c.far), view) };
}

/** #rgb, #rrggbb or rgb() → 0–1 triple. */
export function parseColor(s: string): Vec3 {
  const h = s.trim();
  if (h.startsWith("#")) {
    const x = h.length === 4 ? [...h.slice(1)].map((c) => c + c).join("") : h.slice(1, 7);
    const n = parseInt(x, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = h.match(/[\d.]+/g);
  if (m && m.length >= 3) return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
  throw new Error(`dot-art: cannot parse colour "${s}" (use #rrggbb or rgb())`);
}
