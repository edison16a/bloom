import { defineScene } from "../core/types";

/** Dot object. A morpho butterfly: structural blue that shifts with the wingbeat. */
export const morpho = defineScene({
  id: "morpho", title: "Morpho", loop: 4, background: "#04050a", samples: 3,
  camera: { eye: [0, 2.6, 5.0], target: [0, -0.02, 0.05], minAspect: 1.35, fov: 36, near: 3, far: 8.5 },
  sources: [{
    type: "surface", count: 460000,
    common: /* glsl */ `
      // Wing outlines in polar form around the root. th in radians, 0 = straight out, + = towards the head.
      float bump(float x,float c,float w){ float d=(x-c)/w; return exp(-d*d); }
      float fore(float th){ return .95*smoothstep(-.42,-.05,th)*smoothstep(1.38,.86,th)*(.92+.98*bump(th,.80,.30)+.40*bump(th,.28,.34)) ; }
      float hind(float th){ float t=-th; return smoothstep(-.18,.10,t)*smoothstep(1.62,1.18,t)*(1.02+.36*bump(t,.62,.42)+.16*bump(t,1.12,.2)+.035*sin(t*17.)); }`,
    glsl: /* glsl */ `
      void surface(int i,int n,vec4 rnd,inout Pt p){
        float a=TAU*u_phase; int kind=i%25; float side=(i/25)%2==0?1.:-1.;
        float beat=a*3.; float flap=.30+.62*sin(beat); float lagged=.30+.62*sin(beat-.55);
        float bob=.11*sin(beat-1.9);
        vec3 q,m,col; float tone;
        vec3 L=normalize(vec3(-.35,1.,.45));
        if(kind==0){ // body
          float s=rnd.y, th=rnd.x*TAU; float z=mix(-.62,.52,s);
          float r=.075*(1.-.55*smoothstep(.1,.75,s))*smoothstep(0.,.06,s)+.045*bump(s,.10,.06)+.05*bump(s,.30,.10);
          q=vec3(r*cos(th),r*sin(th),z); m=normalize(vec3(cos(th),sin(th),0.));
          float d=wrapDiff(m,L,.3); tone=.16+.5*d+.18*step(.6,fract(s*16.)); col=mix(vec3(.18,.2,.3),vec3(.75,.8,.95),d);
          q.y+=bob;
        } else if(kind==1&&rnd.z<.35){ // antennae
          float s=rnd.y; q=vec3(side*(.03+.30*s+.04*s*s),.04+.16*s,-.60-.52*s)+(hash31(float(i))-.5)*.012*(1.+2.4*smoothstep(.86,1.,s)); q.y+=bob; m=vec3(0.,1.,0.); tone=.42+.5*smoothstep(.85,1.,s); col=vec3(.7,.78,1.);
        } else {
          bool isF=kind<15; float th=isF?mix(-.42,1.38,rnd.x):-mix(-.18,1.62,rnd.x);
          float R=isF?fore(th):hind(th); float s=sqrt(rnd.y); float r=R*s;
          if(R<.05){ p.alpha=0.; return; }
          vec2 w=vec2(cos(th),-sin(th))*r; // x out, z (− = head)
          float f=isF?flap:lagged*.92;
          float bendy=.16*cos(beat-.9)*s*s;                     // tips trail the beat
          float ang=f+bendy;
          q=vec3(w.x*cos(ang),w.x*sin(ang)+.02*(isF?1.:0.),w.y+(isF?-.10:.06));
          m=normalize(vec3(-sin(ang),cos(ang),0.)); 
          m=normalize(m+vec3(0.,0.,.18*sin(th*9.)));
          q.x*=side; m.x*=side; q.x+=side*.05; q.y+=bob;
          vec3 v=normalize(u_eye-q); bool under=dot(m,v)<0.; vec3 fm=under?-m:m;
          float edge=s;
          float tip=isF?smoothstep(.25,.95,th)*smoothstep(.45,.85,s):0.;
          float margin=smoothstep(isF?.80:.84,isF?.90:.92,edge+.012*sin(th*40.))+tip*.9; margin=sat(margin);
          float nv=isF?9.:8.; float vein=smoothstep(.86,.985,abs(cos(th*nv+.35)))*smoothstep(.10,.32,s)*(1.-margin);
          float spots=0.; { float k=(isF?th*8.2:th*7.2); vec2 g=vec2(fract(k)-.5,(edge-.925)*(isF?14.:15.)); spots=smoothstep(.34,.18,length(g))*step(.05,R); }
          if(isF){ vec2 g=vec2(fract(th*5.+.2)-.5,(edge-.76)*11.); spots=max(spots,smoothstep(.36,.2,length(g))*smoothstep(.62,.8,th)); }
          float ir=dot(fm,normalize(L+v)); float shift=pow(sat(ir),3.);
          float d=wrapDiff(fm,L,.35);
          vec3 blue=ramp4(sat(shift*1.15+.22*(1.-s)-.08),vec3(.07,.06,.48),vec3(.05,.27,1.),vec3(.08,.66,1.),vec3(.72,.98,1.));
          col=blue; tone=.20+.46*d*(.55+.45*s)+.55*pow(shift,2.2);
          tone*=1.-.5*vein; tone=mix(tone,tone*.55,smoothstep(.22,.0,s));
          col=mix(col,vec3(.10,.09,.20),margin*.92); tone=mix(tone,.085+.12*shift,margin);
          col=mix(col,vec3(.93,.97,1.),spots*margin); tone=mix(tone,.85,spots*margin);
          if(under){ col=mix(vec3(.30,.19,.13),vec3(.72,.52,.34),.5+.5*sin(th*14.+s*12.)); tone=.12+.34*d;
            vec2 e=vec2((abs(th)-.62)*R*2.,(s-.62)*R)*7.; float eye=length(e); if(eye<1.){ col=eye<.35?vec3(.95,.9,.7):eye<.7?vec3(.06,.05,.08):vec3(.9,.65,.25); tone=eye<.35?.9:eye<.7?.05:.6; } }
        }
        q.xz=rot(.42+.10*sin(a))*q.xz; q.xy=rot(.08*sin(a+.6))*q.xy; q*=1.28; q.y-=.12;
        p.pos=q; p.nrm=m; p.tone=sat(tone); p.color=col; p.size=1.5;
      }`,
  }],
  style: { cell: 5, mark: "square", size: [0.3, 0.92], round: 0.35, ghost: 0.07, ghostColor: "#1b2440", color: { by: "source", shade: 0.55 }, gamma: 0.92 },
  bloom: { strength: 0.55 },
  pointer: { mode: "glow", radius: 140, strength: 0.6 },
});
