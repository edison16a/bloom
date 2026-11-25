import { defineScene } from "../core/types";

/** Text object. DNA spelled in its own four letters. */
export const helix = defineScene({
  id: "helix", title: "Helix", loop: 8, background: "#02050a", samples: 4,
  camera: { eye: [0, 0, 10.6], minAspect: 1.4, fov: 32, near: 8.4, far: 13 },
  sources: [{
    type: "surface", count: 700000,
    common: /* glsl */ `
      const float PAIRS=34.;
      vec3 hx(float s,float side,float spin){ float a=s*TAU*2.5+spin+side*PI*.86; return vec3(1.08*cos(a),(s-.5)*8.2,1.08*sin(a)); }`,
    glsl: /* glsl */ `
      void surface(int i,int n,vec4 rnd,inout Pt p){
        float spin=TAU*u_phase; int part=i%10; vec3 q,m,col; float tone; vec3 L=normalize(vec3(-.5,.6,.75)); float loose=0.;
        float th=rnd.y*TAU;
        if(part<5){ // backbones
          float side=float(i/10%2), s=rnd.x; vec3 c=hx(s,side,spin), T=normalize(hx(s+.002,side,spin)-hx(s-.002,side,spin));
          vec3 N=normalize(vec3(c.x,0.,c.z)), B=cross(T,N); N=cross(B,T); m=N*cos(th)+B*sin(th);
          float R=.205+.02*sin(s*TAU*PAIRS); q=c+m*R;
          vec3 base=side<.5?vec3(.10,.86,1.):vec3(1.,.30,.62); vec3 hi=side<.5?vec3(.72,1.,1.):vec3(1.,.82,.90);
          vec3 v=normalize(u_eye-q); float d=wrapDiff(m,L,.2), sp=blinn(m,L,v,18.);
          tone=.07+.70*d*d+.08*d+.6*sp; col=mix(base,hi,sat(sp+d*d*.4));
        } else { // rungs, one colour per base
          float k=floor(rnd.x*PAIRS), s=(k+.5)/PAIRS, h=hash11(k+5.); vec3 A=hx(s,0.,spin),C=hx(s,1.,spin); float u=rnd.z;
          vec3 T=normalize(C-A); vec3 N=normalize(cross(T,vec3(0.,1.,0.))),B=cross(N,T); m=N*cos(th)+B*sin(th);
          q=mix(A,C,u)+m*.075; 
          float gap=smoothstep(.012,.03,abs(u-.5)); if(gap<.5){ p.alpha=0.; return; }
          vec3 c1=h<.5?vec3(1.,.78,.25):vec3(.42,1.,.55), c2=h<.5?vec3(.62,.48,1.):vec3(1.,.48,.36);
          col=u<.5?c1:c2; float d=wrapDiff(m,L,.35); tone=.10+.50*d;
          float pulse=exp(-pow((fract(s-u_phase*1.)-.5)*9.,2.)); tone+=.45*pulse; col=mix(col,vec3(1.),pulse*.5);
        }
        // a few letters drift free
        if(rnd.w>.9995&&part<6){ float l=fract(rnd.z+u_phase); q+=normalize(vec3(q.x,0.,q.z)+1e-3)*l*1.3+vec3(0.,.3*l,0.); loose=1.; tone=.5*(1.-l); }
        float dep=smoothstep(-1.1,1.1,q.z); tone*=mix(.13,1.06,dep); col*=mix(.42,1.,dep);
        q.xy=rot(-.95)*q.xy; q.yz=rot(.22)*q.yz;
        p.pos=q; p.nrm=m; p.tone=sat(tone); p.color=col; p.flag=loose; p.size=loose>.5?1.:1.4;
      }` }],
  style: { cell: [4, 7], mark: "glyph", gamma: 1.0, color: { by: "source", shade: 0.6 },
    glyph: { ramp: "  ..··::;;~~++", message: "ACGTTAGCCATGGACTTCAGGATCCATTGCAACGT", fill: "hybrid", detail: 0.8, under: 0.2, messageAbove: 0.3, rowShift: 11, scroll: 6, edges: 0.45, weights: [400, 500, 700], fontScale: 1, looseChars: "ACGT·." } },
  bloom: { strength: 0.5 },
  pointer: { mode: "glow", radius: 120, strength: 0.7 },
});
