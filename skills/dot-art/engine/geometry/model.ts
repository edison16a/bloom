import type { Geometry, LazyScene, Scene, Vec3 } from "../core/types";
import { looks, type Look } from "../looks";
import { loadModel } from "./mesh";
import { inflate, type InflateOptions, type ShapeInput } from "./shape";

const hex = (h: string): Vec3 => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Vec3;

export interface ObjectOptions {
  id: string; title?: string; loop?: number; background?: string;
  /** Shadow, mid and light colour. Ignored when `useModelColor` is set. */
  colors?: [string, string, string];
  useModelColor?: boolean;
  /** spin = full turn per loop, sway = rock back and forth, assemble = fly together, turn, scatter. */
  motion?: "spin" | "sway" | "assemble";
  /** Degrees of downward tilt of the camera. */
  tilt?: number;
  /** Extra rotation applied first, in degrees, to stand a model upright. */
  rotate?: [number, number, number];
  scale?: number;
  look?: Look;
  /** Faint pool of dots under the object. Default true. */
  floor?: boolean;
}

/** Light, colour and motion for any geometry that spans about -1..1. */
export function objectScene(geometry: Geometry | (() => Geometry), o: ObjectOptions): Scene {
  const [a, b, c] = (o.colors ?? ["#2a1fb8", "#3f8cff", "#e9f4ff"]).map(hex), look = o.look ?? looks.led(), rad = Math.PI / 180;
  const el = (o.tilt ?? 12) * rad, r = o.rotate ?? [0, 0, 0];
  return {
    id: o.id, title: o.title ?? o.id, loop: o.loop ?? 10, background: o.background ?? "#03040a", samples: 3,
    camera: { eye: [0, Math.sin(el) * 5, Math.cos(el) * 5], fov: 34, minAspect: 1.25, near: 3, far: 7.5 },
    sources: [
      ...(o.floor === false ? [] : [{
        type: "shader" as const,
        uniforms: { f_col: b },
        glsl: /* glsl */ `void scene(vec2 uv,vec2 p,inout Cell c){
          float f=exp(-pow(length((p-vec2(0.,-.72))*vec2(.95,3.4)),2.)*1.6)*.22; f=max(0.,f-.015);
          c.tone=f; c.color=f_col; c.alpha=step(.002,f); c.depth=1.; }`,
      }]),
      {
        type: "surface", geometry,
        uniforms: { o_a: a, o_b: b, o_c: c, o_rot: r.map((x) => x * rad), o_scale: o.scale ?? 1.12, o_use: o.useModelColor ? 1 : 0, o_m: ["spin", "sway", "assemble"].indexOf(o.motion ?? "spin") },
        glsl: /* glsl */ `
          void surface(int i,int n,vec4 rnd,inout Pt p){
            vec3 q=p.pos,m=p.nrm;
            q.yz=rot(o_rot.x)*q.yz; m.yz=rot(o_rot.x)*m.yz; q.xz=rot(o_rot.y)*q.xz; m.xz=rot(o_rot.y)*m.xz; q.xy=rot(o_rot.z)*q.xy; m.xy=rot(o_rot.z)*m.xy;
            float a=TAU*u_phase, ry=o_m==1.?.75*sin(a):a;
            q.xz=rot(ry)*q.xz; m.xz=rot(ry)*m.xz; q*=o_scale; q.y+=.025*sin(a*2.);
            float loose=0.;
            if(o_m==2.){ // each dot has its own flight in and out; the middle of the loop is the whole object
              float in_=eout(seg(u_phase,.02+.16*rnd.z,.24+.16*rnd.z)), out_=seg(u_phase,.80+.10*rnd.w,.98); out_=out_*out_;
              float k=min(in_,1.-out_); vec3 far=normalize(q+curl(q*1.3)*1.2)*(1.6+1.4*rnd.y); q=mix(q+far*.9,q,k); loose=k<.97?1.:0.; p.alpha=smoothstep(0.,.35,k); }
            vec3 v=normalize(u_eye-q); m=faceView(normalize(m),q); vec3 L=normalize(vec3(-.55,.75,.65));
            float d=wrapDiff(m,L,.18), s=blinn(m,L,v,26.), f=fresnel(m,v,2.4), k2=wrapDiff(m,normalize(vec3(.9,-.1,-.2)),.1);
            float tone=.07+.66*d*d+.20*d+.80*s+.34*f+.14*k2; tone=1.-exp(-tone*1.25);
            vec3 col=ramp3(sat(.16+.70*d+.35*f+.12*q.y),o_a,o_b,o_c);
            if(o_use>.5) col=p.color*(.75+.5*d);
            p.color=mix(col,vec3(1.),smoothstep(.72,1.,tone)*.8); p.tone=sat(tone); p.pos=q; p.nrm=m; p.flag=loose; p.size=loose>.5?1.:1.7;
          }`,
      },
    ],
    style: look.style, bloom: look.bloom, pointer: { mode: "glow", radius: 150, strength: 0.5 },
  };
}
