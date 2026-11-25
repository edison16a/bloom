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