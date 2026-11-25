import { defineScene, type OverlayCell } from "../core/types";

/**
 * Text object. A typed call collapses into a seed, buds, blossoms, holds, then blows away letter by letter.
 * Beats (s): type 0.3-1.0 | collapse 1.0-1.4 | bud 1.3-2.6 | open 2.4-5.6 | hold 5.6-7.5 | wind 7.6-9.3 | core alone 9.3-9.7 | rest 10.4
 */
const CALL = "bloom()";

export const bloom = defineScene({
  id: "bloom",
  title: "Bloom",
  loop: 10.6,
  background: "#020205",
  poster: 6.2,
  samples: 4,
  camera: (t) => {
    // Side-on for the bud, tipping forward as it opens so the face reads.
    const k = Math.min(1, Math.max(0, (t - 1.8) / 3.2)), e = k * k * (3 - 2 * k);
    const el = 0.52 + 0.43 * e, d = 5.7;
    return { eye: [Math.sin(t * 0.16) * 0.35, 0.35 + Math.sin(el) * d, Math.cos(el) * d], target: [0, 0.5 - 0.22 * e, 0], minAspect: 1.3, fov: 31, near: 3, far: 8.5 };
  },
  sources: [
    {
      type: "surface",
      count: 600000,
      uniforms: {},
      common: /* glsl */ `
        const int PETALS=19;
        float grow(float t){ return eout(seg(t,1.3,2.9)); }
        // layer 0 = outer ring of 5, 1 = middle 6, 2 = inner 5, 3 = heart 3
        void petalInfo(int k,out float layer,out float az,out float len,out float wid,out float delay){
          if(k<5){ layer=0.; az=float(k)*TAU/5.; len=1.62; wid=.70; }
          else if(k<10){ layer=1.; az=float(k-5)*TAU/5.+.63; len=1.34; wid=.60; }
          else if(k<15){ layer=2.; az=float(k-10)*TAU/5.+.2; len=1.02; wid=.50; }
          else { layer=3.; az=float(k-15)*TAU/4.+.8; len=.74; wid=.40; }
          float h=hash11(float(k)*3.7+1.); az+=(h-.5)*.22; len*=.93+.14*h; delay=layer*.5+h*.28;
        }
        // Point on petal k at (u across -1..1, v along 0..1).
        vec3 petal(int k,vec2 uv,float t){
          float layer,az,len,wid,delay; petalInfo(k,layer,az,len,wid,delay);
          float open=eio(seg(t,2.25+delay,4.5+delay*1.25));
          float breathe=.03*sin(TAU*t/5.3+float(k));
          float full=layer<.5?1.:layer<1.5?.74:layer<2.5?.46:.26;               // inner layers never open all the way
          float o=sat(open*full+breathe*open);
          float u=uv.x, v=uv.y, r=.035+layer*.012, z=.02;
          const int N=10; float dv=v/float(N);
          for(int i=0;i<N;i++){
            float s=(float(i)+.5)*dv;
            float closed=mix(.98,-.86,smoothstep(0.,1.,s));        // egg profile
            float opened=mix(.55,1.38+.62*s*s*s,smoothstep(0.,.7,s));  // sweeps out, tip reflexes
            float a=mix(closed,opened,o);
            r+=sin(a)*dv*len; z+=cos(a)*dv*len;
          }
          float ou=(v-.64)/(v<.64?.70:.372);
          float outline=sqrt(max(0.,1.-pow(abs(ou),v<.64?1.7:2.5)));
          float x=u*wid*outline*mix(1.,1.16,o);
          float R=max(r,.0)+mix(.10,.42,o);
          float th=x/R;
          th=clamp(th,-1.55,1.55);
          float wrap=mix(1.,.36,o);
          vec2 flatP=vec2(r,x), wr=vec2((r+.0)*cos(th),(r+.10)*sin(th));
          vec2 P=mix(flatP,wr,wrap);
          float cup=(.46-.62*o*v)*u*u*outline*.6;
          float ruffle=.085*o*v*v*sin(u*4.6+float(k)*1.7+sin(v*5.))+.03*o*v*sin(u*11.+float(k));
          z+=cup*.6*o+ruffle;
          z-=.16*layer*0.;
          float c=cos(az),s=sin(az);
          vec3 q=vec3(P.x*c-P.y*s, z, P.x*s+P.y*c);
          return q;
        }
        vec3 wind=normalize(vec3(1.,.42,-.25));
      `,
      glsl: /* glsl */ `
        void surface(int i,int n,vec4 rnd,inout Pt p){
          float t=u_time, g=grow(t);
          if(t<1.28||t>10.3){ p.alpha=0.; return; }
          int core=int(float(n)*.07);
          vec3 pos,nrm,col; float tone; float loose=0.;
          vec3 L=normalize(vec3(-.55,.72,.42)), L2=normalize(vec3(.9,.2,-.3));
          float spin=t*.2+.4;
          bool isCore=i<core;
          if(isCore){ // golden stamen dome
            float a=rnd.x*TAU, y=rnd.y*2.-1.; float rr=sqrt(1.-y*y);
            vec3 s=vec3(rr*cos(a),y*1.05,rr*sin(a));
            float bump=.05*sin(s.x*22.)*sin(s.z*22.+s.y*9.);
            pos=s*(.262+bump*.4)*vec3(1.,1.,1.)+vec3(0.,.10,0.);
            nrm=normalize(s+vec3(0.,.2,0.));
            float d=wrapDiff(nrm,L,.5);
            col=mix(vec3(.55,.27,.02),vec3(1.,.84,.28),d); tone=.28+.68*d;
          } else {
            int k=i%PETALS; // every petal gets the same budget
            vec2 uv=vec2(rnd.x*2.-1.,pow(rnd.y,.8));
            float e=.012;
            pos=petal(k,uv,t);
            vec3 du=petal(k,uv+vec2(e,0.),t)-petal(k,uv-vec2(e,0.),t);
            vec3 dv=petal(k,uv+vec2(0.,e),t)-petal(k,uv-vec2(0.,e),t);
            nrm=normalize(cross(du,dv)+1e-6);
            float layer,az,len,wid,delay; petalInfo(k,layer,az,len,wid,delay);
            float open=eio(seg(t,2.25+delay,4.5+delay*1.25));
            vec3 wn=nrm; wn.xz=rot(-spin)*wn.xz; vec3 wp=pos; wp.xz=rot(-spin)*wp.xz;
            wn=faceView(wn,wp);
            float inside=dot(nrm,vec3(0.,1.,0.));
            float d=wrapDiff(wn,L,.12), d2=wrapDiff(wn,L2,.1);
            float shelf=layer<2.5?mix(.10,.42,step(1.5,layer)):.05;      // the next ring in shades this one
            float ao=mix(.10,1.,smoothstep(shelf*.6,shelf+.52,uv.y+.35*(1.-open)));
            ao*=.86+.14*cos(uv.x*2.2);
            bool back=dot(nrm,normalize(u_eye-pos))<0.;
            ao*=mix(1.,.80,open*smoothstep(.75,1.,abs(uv.x)));
            float rim=fresnel(wn,normalize(u_eye-wp),2.5);
            float vein=.5+.5*sin(uv.x*26.+sin(uv.y*7.)*1.2);
            tone=(.05+.86*d*d*d+.16*d+.16*d2+.10*rim)*ao;
            tone*=mix(1.,.93,vein*open*uv.y);
            tone+=.16*smoothstep(.5,1.,uv.y)*d;
            // crimson throat -> hot pink -> blush tip
            float w=sat(uv.y*.80+.26*d-.12+(hash11(float(k))-.5)*.12);
            col=ramp4(w,vec3(.42,.02,.12),vec3(.93,.16,.40),vec3(.99,.46,.64),vec3(1.,.86,.91));
            col=mix(col*.62,col,smoothstep(0.,.55,tone))+vec3(.9,.8,.85)*.22*smoothstep(.7,1.,tone);
          }
          pos*=mix(.02,1.,g); pos.y=pos.y*1.+mix(.16,0.,g);
          pos.xz=rot(-spin)*pos.xz;

          // Wind: releases from the right, outer points first, core last.
          float jit=rnd.z;
          float side=dot(pos,normalize(vec3(1.,.28,0.)));
          float rel=7.62+(1.5-side)*.43+jit*.16+.16*snoise(pos*1.9);
          if(isCore) rel=9.62+jit*.16-side*.2;
          float a=t-rel;
          if(a>0.){
            loose=1.;
            vec3 c=curl(pos*1.25+vec3(0.,0.,t*.22));
            float sp=isCore?1.1:1.;
            pos+=wind*(a*.5+a*a*2.7)*(.55+.9*rnd.w)*sp + c*(.08*a+.13*a*a);
            float keep=exp(-a*7.)*.5+.013*exp(-a*.9);
            p.alpha=a<.04?1.:keep;
            tone*=mix(1.,.72,sat(a)); tone=max(tone,.20);
            col=mix(col,isCore?vec3(1.,.7,.15):vec3(.86,.22,.46),sat(a*.55));
          }
          p.pos=pos; p.nrm=nrm; p.color=col; p.tone=tone; p.flag=loose; p.size=loose>.5?1.:1.25;
        }`,
    },
  ],
  overlay: (t, g) => {
    const out: OverlayCell[] = [];
    const row = Math.round(g.rows * 0.53), mid = Math.round(g.cols / 2);
    if (t < 0.32 || t > 10.35) {
      if (Math.floor(t * 4) % 2 === 0 || t > 10.4) out.push({ col: mid, row, char: "•", tone: 0.55 });
      return out;
    }
    if (t < 1.05) {
      const n = Math.min(CALL.length, Math.floor((t - 0.32) / 0.065));
      const left = mid - Math.floor(CALL.length / 2);
      for (let i = 0; i < n; i++) out.push({ col: left + i, row, char: CALL[i] });
      if (Math.floor(t * 8) % 2 === 0) out.push({ col: left + n, row, char: "_" });
    } else if (t < 1.36) {
      const k = (t - 1.05) / 0.31, half = Math.ceil((CALL.length / 2) * (1 - k));
      const G = "{}[]<>+*#01%";
      for (let i = -half; i <= half; i++) out.push({ col: mid + i, row, char: G[Math.abs((i * 7 + Math.floor(t * 30)) % G.length)], tone: 0.95 });
    }
    return out;
  },
  style: {
    cell: [4, 7],
    mark: "glyph",
    gamma: 0.95,
    color: { by: "source", shade: 0.5 },
    glyph: {
      ramp: " ..··::;;~+iixccoollrrss#",
      message: "let it bloom ",
      fill: "hybrid", detail: 0.8, under: 0.2,
      messageAbove: 0.74,
      rowShift: 4,
      edges: 1,
      glitch: 0.34,
      glitchUntil: 5.4,
      looseChars: "letitbloom·.*+·.",
      weights: [400, 500, 700],
      fontScale: 1,
    },
  },
  bloom: { strength: 0.5 },
  pointer: { mode: "glow", radius: 110, strength: 0.6 },
});

/** The same flower in hexagons: a honeycomb whose tiles carry the colour. */
export const bloomHex = defineScene({
  ...bloom, id: "bloomHex", title: "Bloom, in hexagons", overlay: undefined,
  style: { cell: 8, mark: "hex", size: [0.84, 0.92], gamma: 0.9, gain: 1.05, ghost: 0.045, ghostColor: "#3a1526", color: { by: "source", shade: 0.85 } },
  bloom: { strength: 0.5 },
});
