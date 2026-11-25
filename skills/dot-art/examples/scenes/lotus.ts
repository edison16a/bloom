import { defineScene } from "dot-art";

/**
 * Blue lotus of letters, 10 s. Upright pointed petals in four rings around a golden seed pod.
 * Beats (s): bud 0-0.5 | open 0.5-3.7 | hold 3.7-6.3 | wind 6.3-8.1 | core alone 8.1-8.6 | bud regrows 8.6-9.8
 */
const OPEN = 3.7;
export const lotus = defineScene({
  id: "lotus", title: "Lotus", loop: 10, background: "#03040d", poster: 5.4, samples: 4,
  camera: (t) => {
    const s = (a: number, b: number) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
    const k = s(0.6, OPEN) * (1 - s(7.9, 9.6));
    const el = 0.16 + 0.50 * k, d = 4.9 + 0.42 * k;
    return { eye: [0, 0.5 + Math.sin(el) * d, Math.cos(el) * d], target: [0, 0.62 - 0.27 * k, 0], fov: 31, near: 3.2, far: 8, minAspect: 1.35 };
  },
  sources: [{
    type: "surface",
    count: 1200000,
    common: /* glsl */ `
      const int PETALS=28;
      float spinAt(float t){ return TAU*(t/10.)-.35*sin(TAU*t/10.); }
      // ring 0 = 8 outer, 1 = 8 middle, 2 = 7 inner, 3 = 5 heart
      void info(int k,out float ring,out float az,out float len,out float wid,out float h){
        float n; float j;
        if(k<8){ ring=0.; n=8.; j=float(k); len=1.46; wid=.50; }
        else if(k<16){ ring=1.; n=8.; j=float(k-8)+.5; len=1.38; wid=.47; }
        else if(k<23){ ring=2.; n=7.; j=float(k-16)+.25; len=1.20; wid=.41; }
        else { ring=3.; n=5.; j=float(k-23)+.1; len=.70; wid=.30; }
        h=hash11(float(k)*5.3+2.); az=TAU*j/n+(h-.5)*.14; len*=.94+.10*h;
      }
      float openAt(int k,float t){ float ring,az,len,wid,h; info(k,ring,az,len,wid,h);
        float d=ring*.34+h*.28; float o=eio(seg(t,.4+d,2.6+d*1.2)); return t>8.5?0.:o; }
      float growAt(float t){ return t<8.4?1.:eio(seg(t,8.6,9.7)); }
      vec3 petal(int k,vec2 uv,float t,float o,float g){
        float ring,az,len,wid,h; info(k,ring,az,len,wid,h);
        float br=.025*sin(TAU*(t/10.*3.)+float(k)*1.7)*o;
        len*=mix(.10,1.,g); wid*=mix(.25,1.,sqrt(g));
        float u=uv.x, v=uv.y, r=.10+(3.-ring)*.016, z=-.02+ring*.015;
        float A0=ring<.5?1.60:ring<1.5?1.28:ring<2.5?.98:.78;      // base lean from vertical when open
        float A1=ring<.5?1.12:ring<1.5?.36:ring<2.5?.12:.02;       // tip lean
        const int N=12; float dv=v/float(N); float a=0.;
        for(int i=0;i<N;i++){
          float s=(float(i)+.5)*dv;
          float closed=mix(1.12,-.60,smoothstep(0.,.62,s));
          float opened=mix(A0,A1,smoothstep(.05,.8,s))+.30*smoothstep(.78,1.,s)*(1.-ring*.25)+br+(h-.5)*.16;
          a=mix(closed,opened,o);
          r=max(r+sin(a)*dv*len,.006); z+=cos(a)*dv*len;
        }
        // lanceolate: narrow claw, belly at 0.48, drawn to a point
        float w=v<.48?mix(.34,1.,sin(PI*.5*v/.48)):pow(max(1.-pow((v-.48)/.52,1.6),0.),1.08);
        float x=u*wid*w*mix(.80,1.,o);
        float kap=mix(1./max(r+.05,.16),1.35-.15*ring,o);
        float th=clamp(x*kap,-1.6,1.6);
        vec2 T=vec2(sin(a),cos(a)), Nn=vec2(-cos(a),sin(a));
        float lift=(1.-cos(th))/kap, side=sin(th)/kap;
        vec2 P=vec2(r,z)+Nn*lift;
        P+=Nn*.05*o*exp(-u*u*18.)*-1.*sin(PI*v);                    // midrib groove
        P.x+=.045*u*(1.-o)*smoothstep(0.,.25,v)*w;                  // closed petals overlap like roof tiles, so the bud shows seams
        float c=cos(az),s=sin(az);
        return vec3(P.x*c-side*s,P.y,P.x*s+side*c);
      }
      vec3 wind=normalize(vec3(1.,.38,-.2));
    `,
    glsl: /* glsl */ `
      void surface(int i,int n,vec4 rnd,inout Pt p){
        float t=u_time, spin=spinAt(t);
        vec3 L=normalize(vec3(-.62,.70,.42)), R=normalize(vec3(.75,.35,-.75));
        int nc=int(float(n)*.06);
        vec3 pos,nrm,col; float tone,rel; bool core=i<nc;
        float op=eio(seg(t,.9,3.4))*(1.-eio(seg(t,8.45,9.05)));
        if(core){
          float q=rnd.w;
          if(i%3>0){ // seed pod: inverted cone with a pitted flat top
            float a=rnd.x*TAU, s=rnd.y;
            if(s<.5){ float y=s*2.; float rr=mix(.10,.245,pow(y,.7)); pos=vec3(cos(a)*rr,.06+.34*y,sin(a)*rr); nrm=normalize(vec3(cos(a),-.35,sin(a))); }
            else { float rr=.245*sqrt((s-.5)*2.); vec2 d=rr*vec2(cos(a),sin(a));
              float pit=0.; for(int j=0;j<9;j++){ float b=j<1?0.:float(j)*TAU/8.; vec2 cc=j<1?vec2(0.):.155*vec2(cos(b),sin(b)); pit=max(pit,smoothstep(.050,.026,length(d-cc))); }
              pos=vec3(d.x,.40+.035*(1.-rr*rr/.06)+.02*pit,d.y); nrm=vec3(0.,1.,0.); tone=pit; }
            vec3 wn=nrm; wn.xz=rot(-spin)*wn.xz; float d=wrapDiff(wn,L,.35);
            float pit=s<.5?0.:tone;
            tone=(.34+.66*d)*mix(1.,.45,pit);
            col=ramp3(tone,vec3(.34,.14,.01),vec3(1.,.62,.08),vec3(1.,.92,.55));
          } else { // stamens
            float j=floor(rnd.x*64.), h=hash11(j+3.), s=rnd.y, a=(j+h*.6)/64.*TAU;
            float lean=mix(.10,.55+.35*h,op), l=(.40+.12*h);
            float rr=.20+sin(lean)*l*s*mix(.35,1.,s)*1.1, y=.12+cos(lean)*l*s;
            float th=rnd.z*TAU; float tk=s>.82?.020:.007;
            pos=vec3(cos(a)*rr,y,sin(a)*rr)+tk*vec3(cos(th),sin(th*1.7),sin(th)); nrm=vec3(cos(a),.6,sin(a));
            tone=s>.82?.92:.22+.35*s; col=mix(vec3(.75,.36,.02),vec3(1.,.88,.42),smoothstep(.5,.9,s));
          }
          pos=(pos-vec3(0.,.06,0.))*mix(.55,1.,op)+vec3(0.,.06,0.);
          tone*=mix(.55,1.,op)*mix(1.,1.1,seg(t,8.,8.4));
        } else {
          int k=(i-nc)%PETALS;
          float ring,az,len,wid,h; info(k,ring,az,len,wid,h);
          vec2 uv=vec2(rnd.x*2.-1.,pow(rnd.y,.85));
          float o=openAt(k,t), g=growAt(t), e=.012;
          if(t>8.35&&t<8.6){ p.alpha=0.; return; }
          pos=petal(k,uv,t,o,g);
          vec3 du=petal(k,uv+vec2(e,0.),t,o,g)-petal(k,uv-vec2(e,0.),t,o,g);
          vec3 dv=petal(k,uv+vec2(0.,e),t,o,g)-petal(k,uv-vec2(0.,e),t,o,g);
          nrm=normalize(cross(du,dv)+1e-6);
          vec3 wn=nrm, wp=pos; wn.xz=rot(-spin)*wn.xz; wp.xz=rot(-spin)*wp.xz;
          bool inner=dot(wn,u_eye-wp)*dot(nrm,normalize(vec3(-cos(az),.8,-sin(az))))>0.;
          wn=faceView(wn,wp);
          vec3 V=normalize(u_eye-wp);
          float d=wrapDiff(wn,L,.30), fl=sat(dot(wn,V)), rim=wrapDiff(wn,R,0.)*.5+fresnel(wn,V,3.)*.5;
          float v=uv.y, au=abs(uv.x);
          float ao=mix(.16,1.,smoothstep(.12,.74,v+.18*(1.-o)));     // throats fall dark
          ao*=mix(.66,1.12,smoothstep(-.9,.6,-uv.x));                 // every petal turns from a dark margin to a light one
          float fog=mix(.50,1.,smoothstep(-1.4,.8,wp.z));             // the far side recedes
          float alt=mix(.66,1.,mod(float(k),2.));                     // neighbours never match
          float vein=.5+.5*cos(uv.x*30.);
          tone=(.05+.95*d*d+.22*d+.24*fl*fl)*ao*fog*alt;
          tone*=1.-.08*vein*smoothstep(.1,.5,v);
          tone*=inner?1.:.74;
          tone+=.20*smoothstep(.62,1.,v)*(.35+.65*d)*fog;             // pale tips
          tone+=.34*rim*smoothstep(.35,1.,v)*fog;
          tone*=(1.-.5*(1.-o)*smoothstep(.35,-.5,uv.x))*mix(1.55,1.,o);             // bud: shade under the overlapping neighbour
          tone+=mix(.34*step(0.,uv.x),.24,o)*smoothstep(.84,.96,au)*smoothstep(.15,.4,v)*fog;  // lit margin draws each outline
          tone=1.-exp(-tone*1.65);
          float w=sat(.02+tone*.88+.14*smoothstep(.55,1.,v));
          col=ramp4(w,vec3(.26,.10,.92),vec3(.07,.30,1.),vec3(.28,.68,1.),vec3(.93,.98,1.));
        }
        pos.xz=rot(-spin)*pos.xz;
        float loose=0.; bool big=!core&&(i-nc)%PETALS<16; float sz=core?.55:.66;
        if(big) sz=.9;
        if(!core&&t<8.5){
          float side=dot(pos,normalize(vec3(1.,.25,0.)));
          rel=6.35+(1.55-side)*.42+rnd.z*.18+.14*snoise(pos*1.9);
          float a=t-rel;
          if(a>0.){
            loose=1.;
            pos+=wind*(a*.5+a*a*2.6)*(.55+.9*rnd.z)+curl(pos*1.2+vec3(0.,0.,t*.22))*(.08*a+.13*a*a);
            p.alpha=a<.04?1.:exp(-a*9.)*.3+.0034*exp(-a*.9);
            p.alpha*=1.-smoothstep(8.0,8.35,t);
            tone=max(tone*.8,.22); col=mix(col,vec3(.22,.45,1.),sat(a*.6)); sz=1.;
          }
        }
        p.pos=pos; p.nrm=nrm; p.color=col; p.tone=sat(tone); p.flag=loose; p.size=sz;
      }`,
  }],
  style: {
    cell: [4, 7], mark: "glyph", gamma: 1.0,
    color: { by: "source", shade: 0.5 },
    glyph: {
      ramp: "  .··::;~+ivxcsoeamk", message: "the mud makes the lotus ", fill: "hybrid", messageAbove: 0.5,
      detail: 0.85, under: 0.2, rowShift: 5, edges: 1, looseChars: "themudmakeslotus·.·.", weights: [400, 500, 700],
    },
  },
  bloom: { strength: 0.45 },
  pointer: { mode: "glow", radius: 110, strength: 0.6 },
});
