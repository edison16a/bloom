import { defineScene, type SurfaceSource, type Vec3, type Scene } from "../core/types";
import { inflate, type ShapeInput } from "../geometry/shape";

/** Dot object. Any set of logos or icons, inflated into 3D and lit on a faint LED wall. */
export interface EmblemSpec { shape: ShapeInput; at: [number, number]; size?: number; color: [string, string]; spin?: number; depth?: number; bevel?: number; bevelWidth?: number }

const hex = (h: string): Vec3 => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Vec3;

export function emblem(e: EmblemSpec, i: number, count = 26000): SurfaceSource {
  return {
    type: "surface",
    geometry: () => inflate(e.shape, { count, depth: e.depth ?? 0.07, bevel: e.bevel ?? 0.13, bevelWidth: e.bevelWidth ?? 0.2 }),
    uniforms: { e_at: [e.at[0], e.at[1]], e_size: e.size ?? 0.26, e_a: hex(e.color[0]), e_b: hex(e.color[1]), e_i: i, e_spin: e.spin ?? 0.5 },
    glsl: /* glsl */ `
      void surface(int i,int n,vec4 rnd,inout Pt p){
        float a=TAU*u_phase, k=e_i*2.4;
        float ry=e_spin*sin(a+k)+.18, rx=.28*sin(a+k*1.7)+.1, rz=.10*sin(a+k*.6);
        vec3 q=p.pos, m=p.nrm;
        q.xz=rot(ry)*q.xz; m.xz=rot(ry)*m.xz; q.yz=rot(rx)*q.yz; m.yz=rot(rx)*m.yz; q.xy=rot(rz)*q.xy; m.xy=rot(rz)*m.xy;
        vec3 ctr=vec3(e_at.x*u_aspect*1.0,e_at.y,0.)*1.577; ctr.y+=.035*sin(a+k);
        vec3 w=ctr+q*e_size*1.577;
        vec3 v=normalize(u_eye-w), L=normalize(vec3(-.6,.75,.7));
        float d=wrapDiff(m,L,.25), s=blinn(m,L,v,22.), f=fresnel(m,v,2.2);
        float s2=blinn(m,normalize(vec3(.8,-.3,.5)),v,14.);
        float tone=.16+.52*d+.95*s+.34*f+.25*s2;
        vec3 col=mix(e_a,e_b,sat(.5+.5*(q.x*.8-q.y*.6)));
        col=mix(col,vec3(1.),smoothstep(.72,1.25,tone)*.8);
        p.pos=w; p.tone=sat(tone); p.color=col; p.size=1.7; p.nrm=m;
      }`,
  };
}

export const spark = "M12 1 C12.9 7.6 16.4 11.1 23 12 C16.4 12.9 12.9 16.4 12 23 C11.1 16.4 7.6 12.9 1 12 C7.6 11.1 11.1 7.6 12 1Z";
export const infinity = "M7 7.2 C3.8 7.2 2 9.4 2 12 C2 14.6 3.8 16.8 7 16.8 C11.2 16.8 12.8 7.2 17 7.2 C20.2 7.2 22 9.4 22 12 C22 14.6 20.2 16.8 17 16.8 C12.8 16.8 11.2 7.2 7 7.2Z";
export const bolt = "M13.6 1 L3.8 13.6 H10.6 L9.2 23 L20.2 9.6 H12.6Z";
export const heart = "M12 21.4 C4.6 16.2 1.4 12.6 1.4 8.4 C1.4 5 4 2.6 7.1 2.6 C9.1 2.6 10.9 3.6 12 5.3 C13.1 3.6 14.9 2.6 16.9 2.6 C20 2.6 22.6 5 22.6 8.4 C22.6 12.6 19.4 16.2 12 21.4Z";
export const hexRing = "M12 1.2 L21.4 6.6 V17.4 L12 22.8 L2.6 17.4 V6.6Z M12 6.6 L7.3 9.3 V14.7 L12 17.4 L16.7 14.7 V9.3Z";
export const moon = "M14.2 2 A10.2 10.2 0 1 0 22 15.6 A8.4 8.4 0 0 1 14.2 2Z";
const burst: ShapeInput = { draw: (c, s) => { c.translate(s / 2, s / 2); c.lineWidth = s * 0.062; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, r = s * (i % 2 ? 0.34 : 0.43); c.beginPath(); c.moveTo(Math.cos(a) * s * 0.06, Math.sin(a) * s * 0.06); c.lineTo(Math.cos(a) * r, Math.sin(a) * r); c.stroke(); } } };
const orbit: ShapeInput = { draw: (c, s) => { c.translate(s / 2, s / 2); c.lineWidth = s * 0.06; for (let i = 0; i < 3; i++) { c.save(); c.rotate((i * Math.PI) / 3); c.beginPath(); c.ellipse(0, 0, s * 0.42, s * 0.16, 0, 0, 7); c.stroke(); c.restore(); } c.beginPath(); c.arc(0, 0, s * 0.075, 0, 7); c.fill(); } };

/** Build a floating-emblem scene from your own shapes. */
export function emblemScene(list: EmblemSpec[], over: Partial<Scene> = {}): Scene {
  return {
    id: "emblems", title: "Emblems", loop: 8, background: "#02030a", samples: 3,
    camera: { eye: [0, 0, 5], fov: 35, near: 3, far: 7 },
    sources: [
      { // the wall: a breath of light behind each emblem plus stray lit pixels
        type: "shader",
        glsl: /* glsl */ `void scene(vec2 uv,vec2 p,inout Cell c){
          float g=.10*exp(-dot(p,p)*.55); vec2 id=cellId(uv);
          float h=hash12(id); float tw=.5+.5*sin(TAU*(u_phase*floor(1.+3.*hash12(id+9.))+hash12(id+4.)));
          float star=step(.9968,h)*tw*.5;
          c.tone=sat(g*.55+star); c.color=mix(vec3(.12,.2,.5),vec3(.35,.55,.95),star*2.); c.alpha=1.; }`,
      },
      ...list.map((e, i) => emblem(e, i)),
    ],
    style: { cell: 4, mark: "square", size: [0.74, 0.74], ghost: 0.16, ghostColor: "#101a3c", color: { by: "source", shade: 1 }, gamma: 0.95 },
    bloom: { strength: 0.6 },
    pointer: { mode: "glow", radius: 150, strength: 0.5 },
    ...over,
  };
}
