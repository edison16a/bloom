import { defineScene } from "dot-art";

/** Dot background. Curtains of aurora over a black treeline, in octagon tiles. The left third stays dark for a headline. */
export const aurora = defineScene({
  id: "aurora", title: "Aurora", loop: 36, background: "#03060d", samples: 2, poster: 12,
  camera: { eye: [0, 0, 0], target: [0, 0.46, -1], fov: 60, near: 0.1, far: 10 },
  sources: [{
    type: "shader",
    common: /* glsl */ `
      // Plan view of the curtains: the zero line of a slow field is a ribbon seen from above.
      float field(vec2 q){ q+=.35*vec2(lnoise(q*.45+3.,u_phase,.15),lnoise(q*.45+11.,u_phase,.15));
        return lnoise(vec2(q.x*.34+q.y*.10+1.7,q.y*.40+.3),u_phase,.10)+.34*lnoise(vec2(q.x*1.15+5.,q.y*.8),u_phase,.15)+.18; }
      float curtain(vec2 q){ float e=.03, f=field(q); vec2 g=vec2(field(q+vec2(e,0.))-f,field(q+vec2(0.,e))-f)/e;
        float d=f/(length(g)+.12);                                   // distance to the line, so width stays even
        float ray=.35+.65*pow(vnoise(q*vec2(17.,9.)+vec2(2.*cos(TAU*u_phase),2.*sin(TAU*u_phase))*.35),1.6)*1.7;
        return exp(-d*d*170.)*ray*1.5+.055*exp(-d*d*7.); }
      float tree(vec2 p,float pitch,float base,float hgt,float seed){ // above 0 inside
        float best=-1.; float i0=floor(p.x/pitch);
        for(int k=-2;k<=2;k++){ float id=i0+float(k), h1=hash11(id*1.7+seed), h2=hash11(id*3.3+seed+5.);
          float cx=(id+.5+.7*(h1-.5))*pitch, H=hgt*mix(.45,1.15,h2*h2*.6+h1*.4); float y=(p.y-base)/H; if(y>1.) continue;
          float bough=fract((1.-y)*mix(4.,6.,h1)); float w=pitch*mix(.42,.60,h2)*pow(max(1.-y,0.),.85)*mix(.62,1.12,bough)+.008;
          best=max(best,w-abs(p.x-cx)); }
        return best; }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        vec3 rd=camRay(p); float a=TAU*u_phase; vec3 acc=vec3(0.); float el=max(rd.y,.0);
        const int N=36;
        if(rd.y>.03) for(int j=0;j<N;j++){ float x=(float(j)+.5)/float(N), h=.8*pow(3.4,x); vec2 q=rd.xz/rd.y*h;
          if(length(q)>9.) continue;
          float v=smoothstep(0.,.05,x)*(exp(-x*4.6)*1.15+.62*smoothstep(.08,.42,x)*smoothstep(1.,.45,x));
          vec3 col=ramp4(x*1.5,vec3(.50,1.,.55),vec3(.04,.95,.46),vec3(.22,.36,.98),vec3(.66,.16,1.));
          acc+=curtain(q)*v*col*exp(-length(q)*.16); }
        acc*=4.2/float(N);
        acc*=mix(.25,1.,smoothstep(.10,.55,uv.x));
        float t=luma(acc)*.6+max(acc.r,max(acc.g,acc.b))*.5; t=1.-exp(-t*1.9);
        vec3 col=acc/(max(acc.r,max(acc.g,acc.b))+1e-4); col=mix(col,vec3(.92,1.,.94),smoothstep(.72,1.05,t)*.75);
        float hor=.36*exp(-abs(p.y+.66)*4.6)*mix(.45,1.,smoothstep(0.,.75,uv.x)); vec3 hc=mix(vec3(.04,.36,.52),vec3(.06,.66,.52),smoothstep(.3,.75,uv.x));
        vec2 id=cellId(uv); float hs=hash12(id), tw=.35+.65*pow(.5+.5*sin(TAU*(u_phase*floor(2.+4.*hash12(id+3.))+hs*9.)),2.);
        float st=step(.9945,hash12(id+17.))*tw*mix(.12,.75,hs*hs)*smoothstep(.45,.05,t)*smoothstep(-.35,.1,p.y);
        float tone=.035+hor+t; vec3 cc=mix(mix(vec3(.08,.16,.42),hc,sat(hor*5.)),col,sat(t*2.2));
        cc=mix(cc,vec3(.85,.92,1.),step(.02,st)); tone=max(tone,st);
        float x=p.x+u_aspect;
        float lift=.16*pow(abs(p.x/u_aspect),2.);
        float ridge=-.72+.05*sin(x*1.7+.6)+.025*sin(x*4.3);
        if(tree(vec2(x+.3,p.y),.10,ridge,.26+lift*.5,3.)>0.||p.y<ridge+.04){ tone=min(tone,.10); cc=vec3(.02,.26,.32); }
        if(tree(vec2(x,p.y),.19,-.96,.40+lift*2.0,9.)>0.||p.y<-.84+.03*sin(x*2.3)) tone=0.;
        c.tone=sat(tone); c.color=cc;
      }`,
  }],
  style: { cell: 7.5, mark: "octagon", size: [0.88, 0.97], gamma: 1.12, color: { by: "source", shade: 0.9 } },
  bloom: { strength: 0.4 },
  fade: { hole: [0.24, 0.44, 0.30, 0.34], strength: 0.75 },
  pointer: { mode: "glow", radius: 170, strength: 0.4 },
});
