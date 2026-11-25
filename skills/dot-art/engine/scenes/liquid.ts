import { defineScene } from "../core/types";

/** Text background. One phrase repeated edge to edge; folds of light roll through it like silk. */
export const liquid = defineScene({
  id: "liquid", title: "Liquid type", loop: 12, background: "#050409", samples: 2,
  sources: [{
    type: "shader",
    common: /* glsl */ `
      float silk(vec2 p,out float k){
        float a=TAU*u_phase; vec2 o=vec2(cos(a),sin(a));
        vec2 q=p*1.05; float n=snoise(vec3(q*.75+o*.16,o.y*.2));
        q+=.42*vec2(sin(q.y*2.1+a+n*1.6),cos(q.x*1.8-a+n*1.4));
        q+=.22*vec2(sin(q.y*3.9-a*2.+n),cos(q.x*3.3+a+q.y));
        k=n*.5+q.x*.28-q.y*.22;
        return sin(q.x*2.1+q.y*3.4+2.2*n+a)+.35*sin(q.x*5.+q.y*1.7-n*2.6-a); }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        float k,k2,e=.012; float h=silk(p,k);
        vec2 g=vec2(silk(p+vec2(e,0.),k2)-h,silk(p+vec2(0.,e),k2)-h)/e;
        vec3 n=normalize(vec3(-g*.30,1.)); vec3 L=normalize(vec3(-.55,.72,.42));
        float d=sat(dot(n,L)); float s=pow(sat(dot(n,normalize(L+vec3(0.,0.,1.)))),22.);
        float b=pow(sat(dot(n,normalize(vec3(.8,-.5,.3)))),3.);
        float t=.02+1.15*pow(d,1.7)*smoothstep(-1.5,.9,h)+.65*s+.16*b;
        vec3 col=ramp4(fract(k+.5+.06*sin(TAU*u_phase)),vec3(.20,.22,1.),vec3(.75,.20,.95),vec3(1.,.36,.40),vec3(1.,.70,.28));
        col=mix(col,vec3(.12,.75,1.),b*.85);
        c.color=mix(col,vec3(1.,.96,.92),smoothstep(.35,1.1,s)); c.tone=sat(t);
      }` }],
  style: { cell: [6, 11], mark: "glyph", gamma: 1.1, color: { by: "source", shade: 0.85 },
    glyph: { message: "made of language, moving like water ", fill: "message", scroll: 4, rowShift: 11, weights: [300, 500, 800], fontScale: 1 } },
  bloom: { strength: 0.4 },
  pointer: { mode: "ripple", radius: 200, strength: 0.9 },
});
