import { defineScene } from "../core/types";

/** Text object. A gas giant typeset in one long sentence; the rings keep scrolling it. */
export const saturn = defineScene({
  id: "saturn", title: "Saturn", loop: 10, background: "#040409", samples: 4,
  camera: (t) => { const a = (t / 10) * Math.PI * 2; return { eye: [0.25 * Math.sin(a), 1.35 + 0.2 * Math.cos(a), 5.6], target: [0, 0, 0], minAspect: 1.6, fov: 33, roll: 0.36, near: 3, far: 9 }; },
  sources: [{
    type: "shader",
    common: /* glsl */ `
      float ringTone(float r,float an){
        float k=(r-1.32)/(2.42-1.32); if(k<0.||k>1.) return 0.;
        float b=.5+.28*sin(k*31.)+.22*sin(k*73.+1.)+.15*sin(k*149.);
        b*=smoothstep(0.,.05,k)*smoothstep(1.,.96,k);
        b*=1.-.93*smoothstep(.035,.015,abs(k-.655)); b*=1.-.6*smoothstep(.012,.004,abs(k-.90));
        b*=mix(.45,1.,smoothstep(.05,.30,k));
        b*=.86+.22*vnoise(vec2(an*9./TAU*4.,r*9.));
        return sat(b);
      }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        vec3 ro=u_eye, rd=camRay(p), sun=normalize(vec3(-.82,.34,.46));
        float b=dot(ro,rd), cc=dot(ro,ro)-1., disc=b*b-cc; float ts=disc>0.?-b-sqrt(disc):1e9;
        float tr=-ro.y/rd.y; vec3 R=ro+rd*tr; float rr=length(R.xz); float an=atan(R.z,R.x);
        float spin=TAU*u_phase;
        float rt=(tr>0.&&rr>1.32&&rr<2.42)?ringTone(rr,fract((an-spin*.5)/TAU)*TAU):0.;
        c.tone=0.; c.alpha=0.; c.depth=1.;
        vec2 id=cellId(uv); float h=hash12(id);
        float star=step(.9955,h)*(.25+.4*pow(.5+.5*sin(TAU*(u_phase*floor(1.+2.*hash12(id+3.))+h*9.)),3.));
        if(star>0.){ c.tone=star; c.alpha=1.; c.color=vec3(.7,.75,1.); }
        if(ts<1e8){
          vec3 n=ro+rd*ts; float d=sat(dot(n,sun)*1.12+.05); d=pow(d,.8);
          float lat=n.y, lon=atan(n.z,n.x)+spin*2.; 
          float turb=.035*snoise(vec3(cos(lon)*2.4,lat*7.,sin(lon)*2.4));
          float band=.5+.5*sin((lat+turb)*19.)*.6+.25*sin((lat+turb*1.7)*41.+1.);
          float st=.5; vec3 X=n+sun*(-n.y/sun.y); float sh=1.; if(-n.y/sun.y>0.) sh=1.-.85*ringTone(length(X.xz),0.);
          float rim=pow(1.-sat(dot(n,-rd)),3.);
          c.tone=sat(d*sh*(.30+.72*band)+rim*.30*smoothstep(-.25,.4,dot(n,sun))); c.alpha=1.; c.depth=ts/9.;
          c.color=mix(ramp3(sat(band),vec3(.80,.36,.20),vec3(.98,.70,.40),vec3(1.,.93,.78)),vec3(1.,.86,.7),rim*.6);
        }
        if(rt>.01&&tr<ts){
          float bb=dot(R,sun); float q=bb*bb-(dot(R,R)-1.); float shade=(bb<0.&&q>0.)?mix(.06,1.,smoothstep(.10,.0,q)):1.;
          float fwd=.55+.45*pow(sat(dot(rd,sun)*.5+.5),2.);
          float t=rt*shade*1.05; float k=(rr-1.32)/1.1;
          vec3 col=mix(vec3(.95,.66,.48),vec3(.74,.80,1.),smoothstep(.1,.9,k));
          c.tone=mix(c.tone*c.alpha*.10,t,sat(rt*1.5+.15)); c.color=mix(col,vec3(1.),.25*t); c.alpha=1.; c.depth=tr/9.;
        }
      }` }],
  style: { cell: [4, 7], mark: "glyph", gamma: 1.12, gain: 1.12, color: { by: "source", shade: 0.8 },
    glyph: { ramp: "  ··..::", message: "every orbit is a sentence that refuses to end, and so it goes around again · ", fill: "hybrid", detail: 0.8, under: 0.2, messageAbove: 0.14, scroll: 10, rowShift: 13, weights: [400, 500, 700], fontScale: 1, edges: 0 } },
  bloom: { strength: 0.42 },
  pointer: { mode: "glow", radius: 130, strength: 0.6 },
});
