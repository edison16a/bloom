import { defineScene } from "../core/types";

/** Text background. A corridor of typed panels rushing past, with a calm vanishing point for a headline. */
export const tunnel = defineScene({
  id: "tunnel", title: "Corridor", loop: 8, background: "#05040a", samples: 3,
  sources: [{
    type: "shader",
    common: /* glsl */ `
      const float N=12.;  // panels that pass per loop; hashes repeat every N so the loop is seamless
      void wall(vec2 p,out float z,out float across,out float w){
        vec2 k=vec2(1.5,1.)/max(abs(p),vec2(1e-4));
        if(k.x<k.y){ z=k.x; across=(p.y*z*.5+.5)*2.; w=p.x>0.?0.:1.; } else { z=k.y; across=(p.x*z/1.5*.5+.5)*3.; w=p.y>0.?2.:3.; } }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        float a=TAU*u_phase; vec2 o=vec2(.14*sin(a),.07*sin(a*2.)); p=rot(.10*sin(a+.6))*(p-o);
        float z,across,w; wall(p,z,across,w);
        float zz=z*.95+u_phase*N; vec2 id=vec2(mod(floor(zz),N),floor(across)), f=vec2(fract(zz),fract(across));
        float h=hash12(id+w*17.), h2=hash12(id+w*31.+5.), px=.02+.018*z;
        vec2 e=min(f,1.-f)*vec2(1.,1.1); float ed=min(e.x,e.y);
        float panel=smoothstep(.05-px*.5,.05+px,ed), bevel=panel*(1.-smoothstep(.10,.17+px,ed));
        float fog=exp(-z*.17)*smoothstep(.7,1.5,z+.2);
        float pulse=pow(.5+.5*sin(a*(1.+floor(h2*3.))+h*TAU),2.), lit=step(.60,h)*(.35+.75*pulse);
        float ring=pow(sat(1.-abs(fract(z*.09+u_phase*2.)-.5)*3.4),2.);  // a band of light racing toward the viewer
        float side=w<2.?1.:(w<3.?.45:.75), grad=mix(.55,1.1,f.x);
        float tone=panel*(.10+.12*h2)*grad*side+panel*lit*.85*grad+bevel*(.20+.6*ring)*side*1.1+panel*ring*.34; tone*=fog*1.25;
        vec3 A=mix(vec3(.16,.20,1.),vec3(.10,.75,1.),h2), B=mix(vec3(1.,.16,.52),vec3(1.,.48,.16),h2);
        vec3 col=mix(A,B,step(.42,fract(h*7.3))*step(.6,h)); col=mix(col,vec3(.80,.86,1.),sat(ring*.55+bevel*.2)); col=mix(col,vec3(1.,.96,.92),smoothstep(.75,1.05,tone));
        c.color=col; c.tone=sat(tone); c.depth=sat(z/24.);
      }` }],
  style: { cell: [5, 9], mark: "glyph", gamma: 0.82, color: { by: "source", shade: 0.6 },
    glyph: { message: "keep going ", ramp: "  ..··::--=+", fill: "hybrid", detail: 0.7, under: 0.12, messageAbove: 0.36, rowShift: 4, scroll: 2, weights: [400, 600, 800], fontScale: 1 } },
  bloom: { strength: 0.45 },
  fade: { hole: [0.5, 0.5, 0.15, 0.2], strength: 0.5 },
  pointer: { mode: "glow", radius: 170, strength: 0.8 },
});
