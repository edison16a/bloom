#!/usr/bin/env node
// Scaffold a scene: node new.mjs <id> --kind object|background|text-object|text-background|image|model|logo [--out file.ts] [--import dot-art]
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { args } from "./lib.mjs";
const a = args(), id = String(a._[0] ?? "").replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^\d/, "_$&"), kind = a.kind ?? "object", from = a.import ?? "dot-art";
const surface = `      type: "surface", count: 260000,
      common: /* glsl */ \`
        // Parametrise the surface: (u,v) in 0..1 -> position. Keep every time term a whole number of cycles of u_phase.
        vec3 body(vec2 q){ float a=q.x*TAU, b=(q.y-.5)*PI; float r=1.+.12*sin(a*5.+TAU*u_phase)*cos(b)*cos(b); return r*vec3(cos(a)*cos(b),sin(b),sin(a)*cos(b)); }\`,
      glsl: /* glsl */ \`
        void surface(int i,int n,vec4 rnd,inout Pt p){
          vec2 q=rnd.xy; float e=.003; vec3 P=body(q);
          vec3 m=normalize(cross(body(q+vec2(0.,e))-P,body(q+vec2(e,0.))-P)+1e-6);
          P.xz=rot(TAU*u_phase)*P.xz; m.xz=rot(TAU*u_phase)*m.xz; m=faceView(m,P);
          vec3 v=normalize(u_eye-P), L=normalize(vec3(-.5,.75,.6)); float d=wrapDiff(m,L,.15), s=blinn(m,L,v,40.), f=fresnel(m,v,2.5);
          p.pos=P; p.nrm=m; p.tone=1.-exp(-(.04+.8*d*d+.7*s+.2*f)*1.05); p.color=ramp3(sat(d*d*.85+.35*s+.2*f),vec3(.10,.12,.60),vec3(.20,.65,1.),vec3(.95,.98,1.)); p.size=1.5;
        }\`,`;
const shader = `      type: "shader",
      glsl: /* glsl */ \`
        void scene(vec2 uv,vec2 p,inout Cell c){ // uv 0..1, p.y -1..1, p.x -aspect..aspect
          float a=TAU*u_phase; float n=lnoise(p*1.2,u_phase,.3)*.5+.5;
          float b=pow(.5+.5*sin(p.x*1.6+p.y*2.4+n*4.-a),7.);
          c.tone=sat(b); c.color=ramp3(b,vec3(.10,.10,.55),vec3(.30,.45,1.),vec3(1.)); c.depth=.5;
        }\`,`;
const scene = (src, style, extra = "") => `import { defineScene } from "${from}";\n\nexport const ${id} = defineScene({\n  id: "${id}", title: "${id}", loop: 8, background: "#04050c",${extra}\n  sources: [{\n${src}\n  }],\n  style: ${style},\n  bloom: { strength: 0.45 },\n  pointer: { mode: "glow", radius: 150, strength: 0.6 },\n});\n`;
const cam = `\n  camera: { eye: [0, 0.6, 4.6], fov: 34, near: 2.8, far: 6.6 },`;
const T = {
  object: scene(surface, `{ cell: 7, mark: "hex", size: [0.84, 0.94], gamma: 1, ghost: 0.05, ghostColor: "#1b2146", color: { by: "source", shade: 0.9 } }`, cam),
  background: scene(shader, `{ cell: 4, mark: "pixel", gamma: 1, dither: { type: "bayer", stops: ["#04050c", "#2a35d8", "#6f7dff", "#ffffff"] } }`),
  "text-object": scene(surface.replace("260000", "500000"), `{ cell: [4, 7], mark: "glyph", gamma: 0.95, color: { by: "source", shade: 0.42 },\n    glyph: { ramp: "  ..··::;~+ivxsn*%", message: "${id} ", fill: "hybrid", detail: 0.8, under: 0.18, messageAbove: 0.5, rowShift: 4, edges: 1, weights: [400, 500, 700] } }`, cam + "\n  samples: 4,"),
  "text-background": scene(shader, `{ cell: [6, 11], mark: "glyph", gamma: 1.05, color: { by: "source", shade: 0.85 },\n    glyph: { message: "${id} ", fill: "message", scroll: 4, rowShift: 11, weights: [300, 500, 800] } }`),
  image: `import { imageSource, looks } from "${from}";\nimport { defineScene } from "${from}";\n\n// Put the picture in /public. Tune black, white, local and edge on a contact sheet until the subject separates.\nexport const ${id} = defineScene({\n  id: "${id}", title: "${id}", loop: 8, background: "#04050c", samples: 3,\n  sources: [imageSource({ src: "/${a.src ?? "photo.jpg"}", black: 0.06, white: 0.9, gamma: 1.1, local: 0.9, edge: 0.4, fill: 0.9, motion: "drift+sweep" })],\n  ...looks.halftone(),\n  pointer: { mode: "glow", radius: 160, strength: 0.7 },\n});\n`,
  model: `import { modelScene, looks } from "${from}";\n\nexport const ${id} = modelScene({ id: "${id}", url: "/${a.src ?? "model.glb"}", motion: "spin", tilt: 14, colors: ["#2a1fb8", "#3f8cff", "#e9f4ff"], look: looks.led() });\n`,
  logo: `import { logoScene, looks } from "${from}";\n\n// path takes any SVG path data. Set viewBox to match the source SVG.\nexport const ${id} = logoScene({ id: "${id}", shape: { path: "M12 1 C12.9 7.6 16.4 11.1 23 12 C16.4 12.9 12.9 16.4 12 23 C11.1 16.4 7.6 12.9 1 12 C7.6 11.1 11.1 7.6 12 1Z", viewBox: [0, 0, 24, 24] }, colors: ["#1b2fd0", "#2ccfe6", "#ffffff"], look: looks.led() });\n`,
};
if (!id || !T[kind]) { console.error(`usage: node new.mjs <id> --kind ${Object.keys(T).join("|")} [--out file.ts]`); process.exit(1); }
const out = path.resolve(a.out ?? `${id}.ts`);
if (existsSync(out)) { console.error(`${out} exists`); process.exit(1); }
mkdirSync(path.dirname(out), { recursive: true }); writeFileSync(out, T[kind]);
console.log(out);
