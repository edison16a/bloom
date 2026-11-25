import { defineScene, type Geometry } from "../core/types";

/** Text object. A cherry bonsai that types itself upward, blossoms into clouds, and sheds letters on the wind. */
type V = [number, number, number];
function grow(): Geometry {
  const pos: number[] = [], nrm: number[] = [], col: number[] = [], ext: number[] = [];
  let seed = 7; const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(6.2832 * rnd());
  const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const unit = (a: V): V => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const spline = (P: V[], s: number): V => { // Catmull-Rom
    const n = P.length - 1, x = Math.min(n - 1e-4, Math.max(0, s * n)), i = Math.floor(x), f = x - i;
    const g = (k: number) => P[Math.min(n, Math.max(0, k))], [a, b, c, d] = [g(i - 1), g(i), g(i + 1), g(i + 2)];
    return [0, 1, 2].map((k) => 0.5 * (2 * b[k] + (c[k] - a[k]) * f + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * f * f + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * f ** 3)) as V;
  };
  const limb = (P: V[], r0: number, r1: number, t0: number, t1: number, root = false) => {
    const n = Math.floor(P.length * r0 * 130000) + 4000;
    for (let i = 0; i < n; i++) {
      const s = rnd(), p = spline(P, s), T = unit(sub(spline(P, Math.min(1, s + 0.01)), spline(P, Math.max(0, s - 0.01))));
      const N = unit(cross(T, Math.abs(T[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0])), B = cross(T, N), an = rnd() * 6.2832;
      const R = (r0 + (r1 - r0) * Math.pow(s, 0.8)) * (root ? 1 + 1.15 * Math.pow(1 - s, 9) * (0.7 + 0.5 * Math.sin(an * 5 + 1)) : 1) * (1 + 0.10 * Math.sin(an * 3 + s * 14));
      const m: V = [N[0] * Math.cos(an) + B[0] * Math.sin(an), N[1] * Math.cos(an) + B[1] * Math.sin(an), N[2] * Math.cos(an) + B[2] * Math.sin(an)];
      pos.push(p[0] + m[0] * R, p[1] + m[1] * R, p[2] + m[2] * R); nrm.push(...m);
      col.push(0, an / 6.2832, s); ext.push(t0 + (t1 - t0) * s, 0, rnd(), rnd());
    }
  };
  // A cloud is a handful of overlapping puffs, so its outline is scalloped and each puff takes its own light.
  const cloud = (c: V, rx: number, ry: number, rz: number, t: number, hue: number) => {
    const puffs = 11;
    for (let k = 0; k < puffs; k++) {
      const a = k * 2.39996, q = Math.sqrt((k + 0.5) / puffs);
      const pc: V = [c[0] + Math.cos(a) * q * rx * 0.72, c[1] + (rnd() - 0.35) * ry * 0.8 * (1 - 0.5 * q), c[2] + Math.sin(a) * q * rz * 0.72];
      const r = (0.46 - 0.16 * q + rnd() * 0.06) * (rx + rz) * 0.5;
      const n = 5200;
      for (let i = 0; i < n; i++) {
        const m = unit([gauss(), gauss(), gauss()]); if (m[1] < -0.65) m[1] *= -0.3;
        const bump = 1 + 0.07 * Math.sin(m[0] * 9 + k) * Math.sin(m[1] * 8 + k * 2) * Math.sin(m[2] * 9);
        pos.push(pc[0] + m[0] * r * bump, pc[1] + m[1] * r * 0.72 * bump, pc[2] + m[2] * r * bump); nrm.push(...m);
        col.push(1, hue, rnd()); ext.push(t + 0.14 * rnd(), 1, rnd(), rnd());
      }
    }
  };
  const trunk: V[] = [[0.10, -1.25, 0], [0.02, -0.9, 0.02], [-0.20, -0.52, 0.06], [-0.16, -0.14, 0.02], [0.12, 0.18, -0.05], [0.18, 0.52, 0]];
  limb(trunk, 0.17, 0.05, 0, 0.5, true);
  const boughs: [V[], number, number, number, number, number, number][] = [
    [[[-0.19, -0.36, 0.05], [-0.48, -0.26, 0.16], [-0.82, -0.14, 0.22], [-1.06, -0.04, 0.16]], 0.07, 0.46, 0.20, 0.40, 0.42, 0.1],
    [[[-0.12, -0.06, 0.02], [0.22, -0.08, 0.20], [0.60, -0.02, 0.26], [0.98, 0.10, 0.18]], 0.075, 0.52, 0.22, 0.44, 0.48, 0.5],
    [[[-0.02, 0.06, -0.02], [-0.26, 0.22, -0.1], [-0.52, 0.34, -0.12], [-0.68, 0.46, -0.06]], 0.055, 0.44, 0.22, 0.40, 0.56, 0.75],
    [[[0.13, 0.26, -0.04], [0.36, 0.38, -0.12], [0.62, 0.50, -0.16], [0.78, 0.62, -0.10]], 0.05, 0.42, 0.21, 0.40, 0.62, 0.3],
    [[[0.17, 0.46, 0], [0.16, 0.64, 0.02], [0.08, 0.84, 0.0]], 0.045, 0.50, 0.26, 0.44, 0.70, 0.95],
  ];
  for (const [P, r, rx, ry, rz, t, hue] of boughs) { limb(P, r, 0.018, t - 0.2, t); const e = P[P.length - 1]; cloud([e[0], e[1] + 0.06, e[2]], rx, ry, rz, t, hue); }
  return { position: new Float32Array(pos), normal: new Float32Array(nrm), color: new Float32Array(col), extra: new Float32Array(ext) };
}

export const tree = defineScene({
  id: "tree", title: "Sakura", loop: 12, background: "#06050a", samples: 4, poster: 6.4,
  camera: (t) => ({ eye: [Math.sin(0.28 * Math.sin((t / 12) * Math.PI * 2)) * 5.6, 0.18, 5.4], target: [0, -0.08, 0], minAspect: 1.5, fov: 31, near: 3.5, far: 9 }),
  sources: [
    { type: "shader", glsl: /* glsl */ `void scene(vec2 uv,vec2 p,inout Cell c){ // a low moon behind the crown, and a ground line
        vec2 m=p-vec2(.50,.36); float d=length(m); float k=smoothstep(.0,.16,u_phase)*smoothstep(1.,.93,u_phase);
        float moon=smoothstep(.505,.495,d)*(.26+.13*vnoise(m*5.+3.)+.10*smoothstep(.4,-.5,m.y+m.x*.4)); float halo=exp(-max(d-.5,0.)*4.)*.07*step(.5,d);
        float g=smoothstep(-.765,-.78,p.y); float gr=g*exp(-pow(p.x*.75,2.))*(.34*exp((p.y+.765)*8.))*(.5+.9*vnoise(vec2(p.x*9.,p.y*26.)));
        c.tone=sat((moon+halo+gr)*k); c.color=mix(vec3(1.,.66,.42),vec3(.9,.45,.6),g); c.alpha=c.tone>.004?1.:0.; c.depth=1.; }` },
    {
      type: "surface", geometry: grow,
      glsl: /* glsl */ `
        void surface(int i,int n,vec4 rnd,inout Pt p){
          float t=u_time; bool leaf=p.extra.y>.5; float born=p.extra.x; vec3 q=p.pos,m=p.nrm; vec3 L=normalize(vec3(.42,.74,.52));
          float a=TAU*u_phase; float loose=0.; float T=.25+born*3.6; float fade=1.-seg(t,10.6,11.5);
          q.x+=(.012+.028*sat(q.y+.6))*(sin(a*4.+q.x*1.4+q.z)+.5*sin(a*7.+q.y*2.))*step(-.9,q.y);
          if(!leaf){
            if(t<T){ p.alpha=0.; return; }
            float d=wrapDiff(m,L,.1); float ridge=.72+.28*sin(p.color.y*TAU*6.+q.y*10.+2.*vnoise(q*7.));
            p.tone=(.20+.80*d)*ridge; p.color=mix(vec3(.46,.28,.30),vec3(1.,.82,.70),d);
            float tip=exp(-(t-T)*5.); p.tone+=tip*.6; p.color=mix(p.color,vec3(1.,.9,.85),tip);
            if(t>10.5+rnd.z*.6){ p.alpha=0.; return; } p.size=1.5;
          } else {
            float b=T+.35+.5*p.extra.z; if(t<b){ p.alpha=0.; return; }
            float g=eback(seg(t,b,b+.7)); float core=p.color.z;
            float d=wrapDiff(m,L,.12), hi=pow(sat(m.y*.8+.2),2.);
            p.tone=.09+.90*d*d+.10*hi;
            vec3 A=mix(vec3(.74,.10,.36),vec3(1.,.36,.56),p.color.y*.6+.2); p.color=mix(A,vec3(1.,.86,.91),sat(d*d*.9));
            if(core>.975){ p.color=vec3(1.,.85,.45); p.tone=max(p.tone,.6); }
            float fresh=exp(-(t-b)*4.); p.tone+=fresh*.35;
            // a trickle of petals from 4.6s, then the gale takes the rest
            float s=p.extra.w; float drop=s<.045?mix(4.6,9.4,fract(s*197.)):8.8+(1.2-q.x*.6)*.42+fract(s*53.)*.45; float age=t-drop;
            if(age>0.){ loose=1.; float gale=smoothstep(8.5,9.6,t);
              q+=vec3(.42+1.0*gale*age,-.30+.34*gale,.05)*age*(.7+.6*fract(s*31.))+.16*vec3(sin(age*3.+s*60.),.5*sin(age*4.1+s*40.),cos(age*2.6+s*80.))*min(age,1.);
              q.y=max(q.y,-1.24); p.alpha=(s<.045?1.:.45*exp(-age*1.2))*(1.-smoothstep(2.2,3.2,age)); if(s<.045) p.alpha*=step(fract(s*777.),.30); p.tone=.42+.35*d; }
            p.size=1.3*mix(.4,1.,sat(g));
          }
          p.alpha*=fade; p.pos=q; p.nrm=m; p.flag=loose; p.tone=sat(p.tone);
        }` },
  ],
  style: { cell: [4, 7], mark: "glyph", gamma: 0.95, color: { by: "source", shade: 0.6 },
    glyph: { ramp: "  ..··::;~+ivxsn*%", message: "hanami ", fill: "hybrid", detail: 0.8, under: 0.2, messageAbove: 0.60, rowShift: 3, edges: 0, glitch: 0.3, glitchUntil: 5, looseChars: "hanami*·'.,", weights: [400, 500, 700], fontScale: 1 } },
  bloom: { strength: 0.45 },
  pointer: { mode: "glow", radius: 120, strength: 0.5 },
});
