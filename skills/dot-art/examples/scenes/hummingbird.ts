import { defineScene } from "dot-art";

/** Dot object. A hummingbird holds station; as it turns, its throat catches the light and ignites. */
const common = /* glsl */ `
  // Bird space: +x forward (bill), +y up, +z its right-hand side.
  const vec3 EYEP=vec3(.865,.90,0.);
  float turnK(){ float x=.5-.5*cos(TAU*u_phase); return eio(sat(x*1.12-.06)); }     // 0 profile, 1 towards camera
  float tab(float s,float a,float b,float c,float d,float e,float f,float g){ // Catmull-Rom through 7 knots
    float k[9]=float[9](a,a,b,c,d,e,f,g,g); s=sat(s)*6.; int i=int(min(floor(s),5.)); float t=s-float(i);
    float p0=k[i],p1=k[i+1],p2=k[i+2],p3=k[i+3]; return .5*(2.*p1+(p2-p0)*t+(2.*p0-5.*p1+4.*p2-p3)*t*t+(3.*p1-p0-3.*p2+p3)*t*t*t); }
  // Spine, face to vent.
  vec3 spine(float s){ return vec3(tab(s,1.06,.80,.56,.36,.16,-.10,-.42),tab(s,.80,.89,.74,.42,.06,-.28,-.60),0.); }
  float radV(float s){ return tab(s,.0,.235,.225,.275,.305,.235,.10); }  // back to belly
  float radZ(float s){ return tab(s,.0,.215,.215,.285,.315,.24,.12); }   // side to side
  vec3 body(vec2 q){ float s=pow(q.y,1.15), th=q.x*TAU; vec3 c=spine(s), T=normalize(spine(s+.01)-spine(s-.01)+vec3(1e-5,0.,0.));
    vec3 D=normalize(vec3(-T.y,T.x,0.)); if(D.y<0.&&s<.1) D=-D; // D points to the belly side or back, fixed below by sign of cross
    float puff=1.+.018*sin(TAU*u_phase*3.)*smoothstep(.25,.6,s);
    float k=sqrt(sat(s/.085)); k=mix(k,1.,smoothstep(.06,.16,s));
    return c+(D*cos(th)*max(radV(s),.02)+vec3(0.,0.,1.)*sin(th)*max(radZ(s),.02))*puff; }
  mat3 pose(){ float k=turnK(), a=TAU*u_phase;
    float yaw=mix(-.42,.74,k), pit=.07*sin(a+.6)+.05*k, rol=.05*sin(a*2.);
    float cy=cos(yaw),sy=sin(yaw),cp=cos(pit),sp=sin(pit),cr=cos(rol),sr=sin(rol);
    mat3 Y=mat3(cy,0.,sy, 0.,1.,0., -sy,0.,cy), P=mat3(cp,sp,0., -sp,cp,0., 0.,0.,1.), R=mat3(1.,0.,0., 0.,cr,sr, 0.,-sr,cr);
    return Y*P*R; }
  vec3 place(vec3 q){ float a=TAU*u_phase; return pose()*(q-vec3(.1,.1,0.))+vec3(-.04+.07*sin(a+2.2),-.02+.05*sin(a*2.)+.03*sin(a*3.+1.),0.); }
  // One wing. l 0..1 along it, w 0..1 across the chord, ph stroke angle.
  vec3 wing(float side,float l,float w,float ph){
    float chord=.30*smoothstep(-.12,.16,l)*pow(max(1.-pow(l,2.2),0.),.6);
    float lead=.20*sin(l*2.4)-.46*l*l;                       // leading edge bows forward, tip sweeps back
    vec3 outw=normalize(vec3(mix(.62,-.80,smoothstep(.0,1.3,ph)),sin(ph),cos(ph)*side));
    vec3 fwd=normalize(vec3(.80,.55*cos(ph)-.1,-.18*side)); fwd=normalize(fwd-outw*dot(fwd,outw));
    return vec3(.14,.36,.17*side)+outw*l*1.72+fwd*(lead-w*chord); }
`;

export const hummingbird = defineScene({
  id: "hummingbird", title: "Hummingbird", loop: 6, background: "#04070b", samples: 3, poster: 3,
  camera: { eye: [0.02, 0.16, 5.9], target: [0.02, 0.06, 0], fov: 34, near: 3.6, far: 8, minAspect: 1.15 },
  sources: [
    {
      type: "surface", count: 420000, common,
      glsl: /* glsl */ `
      void surface(int i,int n,vec4 rnd,inout Pt p){
        mat3 M=pose(); float k=turnK(); int part=i%18; vec3 q,m,col; float tone; bool thin=false;
        vec3 L=normalize(vec3(-.45,.80,.55)), R=normalize(vec3(.55,.25,-.8));
        if(part<13){ // body
          float s=pow(rnd.y,1.15), e=.004; q=body(rnd.xy);
          m=normalize(cross(body(rnd.xy+vec2(e,0.))-q,body(vec2(rnd.x,min(rnd.y+e,1.)))-body(vec2(rnd.x,rnd.y-e))+vec3(1e-6,0.,0.)));
          vec3 c=spine(s); if(dot(m,q-c)<0.) m=-m;
          m.z+=.0; vec3 wp=place(q), wm=M*m, v=normalize(u_eye-wp);
          // Feather scales, rows running head to tail.
          vec2 g=vec2(rnd.x*34.,s*36.); g.x+=.5*mod(floor(g.y),2.); vec2 id=floor(g), f=fract(g)-.5; float h=hash12(id);
          float scale=smoothstep(.62,.15,length(f*vec2(1.,.9)+vec2(0.,.12)));
          wm=normalize(wm+(hash31(h*91.+3.)-.5)*.30);
          float d=wrapDiff(wm,L,.12), sp=blinn(wm,L,v,16.), rim=pow(1.-sat(dot(wm,v)),2.)*smoothstep(-.1,.6,dot(wm,R)+.4);
          // Which side of the body: dorsal=+1, ventral=-1.
          vec3 T=normalize(spine(s+.01)-spine(s-.01)); vec3 dor=normalize(vec3(T.y,-T.x,0.)); if(dor.y-dor.x*.6<0.) dor=-dor;
          float dv=dot(normalize(m+1e-5),dor);
          float ir=sat(dot(wm,normalize(L+v))); ir=pow(ir,2.5);
          vec3 green=ramp4(sat(.08+.62*d*d+.34*ir),vec3(.0,.10,.10),vec3(.0,.46,.28),vec3(.10,.88,.42),vec3(.86,1.,.72));
          green=mix(green,vec3(.05,.60,.62),rim*.6);
          float back=smoothstep(-.62,-.30,dv);
          vec3 belly=ramp3(sat(d*1.05),vec3(.10,.14,.20),vec3(.50,.58,.62),vec3(.96,.98,.95));
          float fi=sat(dot(wm,normalize(vec3(.55,-.15,.8)))); float bt=.07+.62*d*d+.34*fi*fi+.07*h+.26*smoothstep(.66,.48,s)*(.35+.65*d); belly=mix(belly,vec3(.30,.36,.46),.5*(1.-d));
          col=mix(belly,green,back); tone=mix(bt,.06+.56*d*d*(.6+.4*scale)+.42*sp*(.4+.8*h)+.07*h,back)+.34*rim; col=mix(col,vec3(.30,.70,1.),sat(rim)*.55);
          // Gorget: bib from chin to breast, notched at the sides.
          float gs=smoothstep(.035,.06,s)*smoothstep(.475,.445,s-.05*cos(rnd.x*TAU*2.));
          float gor=gs*smoothstep(.12,-.02,dv+.25*smoothstep(.34,.46,s));
          vec3 H=normalize(normalize(vec3(.25,-.05,1.))+v); vec3 gn=normalize(M*normalize(q-vec3(.42,.66,0.))+(hash31(h*57.+1.)-.5)*.34); float fl=pow(sat(dot(gn,H)),4.5);
          float flash=fl*mix(.10,1.25,smoothstep(.12,.8,k))*mix(.5,1.2,h);
          vec3 mag=ramp4(sat(flash),vec3(.16,.0,.10),vec3(.72,.0,.36),vec3(1.,.10,.62),vec3(1.,.62,.90));
          col=mix(col,mag,gor); tone=mix(tone,.09+.07*scale+.10*d+.84*(1.-exp(-flash*1.6)),gor);
          // Face: dark lores, white spot behind the eye.
          vec2 fe=q.xy-EYEP.xy; float ed=length(fe*vec2(1.,1.)); float ear=length((q.xy-vec2(.755,.885))*vec2(.8,1.5));
          if(abs(q.z)>.06){ if(ear<.045){ col=vec3(.95,1.,.95); tone=.35+.5*d; }
            if(ed<.072){ col=vec3(.03,.04,.06); tone=.03; float gl=length(fe-vec2(.0,.025)); if(gl<.018){ col=vec3(1.); tone=1.; } } }
          tone*=mix(.35,1.,smoothstep(-.45,.25,wp.z+.15)); p.size=1.6;
        } else if(part<15){ // bill: upper and lower mandible, faint upward curve
          float s=rnd.y, th=rnd.x*TAU; vec3 c=vec3(1.00+.92*s,.83+.02*s+.07*s*s,0.);
          float r=mix(.052,.024,pow(s,.6)); m=vec3(0.,cos(th),sin(th)); q=c+m*r; vec3 wm=M*m, v=normalize(u_eye-place(q));
          float d=wrapDiff(wm,L,.2); col=mix(vec3(.16,.20,.26),vec3(.86,.94,1.),d*d); tone=.12+.45*d*d+.4*blinn(wm,L,v,18.); p.size=1.6;
        } else { // tail: ten feathers, fanned when braking
          float kf=floor(rnd.z*10.), side=kf<5.?-1.:1., o=(mod(kf,5.)+.5)/5.; float s=rnd.y, w=rnd.x*2.-1.;
          float fan=mix(.34,.62,.5+.5*sin(TAU*u_phase+3.6)); float an=side*o*fan; float len=.62+.20*o;
          vec3 dir=normalize(vec3(-.52+.05*sin(TAU*u_phase*2.),-.85,0.)); vec3 zz=vec3(0.,0.,1.);
          float wid=.085*smoothstep(0.,.12,s)*sqrt(max(1.-pow(s,6.),0.));
          vec3 al=normalize(dir*cos(an)+zz*sin(an)), ac=normalize(zz*cos(an)-dir*sin(an));
          q=vec3(-.36,-.52,0.)+zz*side*o*.10+al*s*len+ac*w*wid+vec3(.012,-.008,0.)*o*2.+vec3(-.06,.02,0.)*s*s;
          m=normalize(vec3(.85,-.52,0.)+ac*w*.45); vec3 wp=place(q), wm=faceView(M*m,wp), v=normalize(u_eye-wp);
          float d=wrapDiff(wm,L,.2), ir=pow(sat(dot(wm,normalize(L+v))),3.);
          float vane=smoothstep(.10,.0,abs(w)), edge=smoothstep(.6,1.,abs(w));
          col=ramp3(sat(.15+.6*d+.4*ir),vec3(.04,.30,.44),vec3(.05,.52,.50),vec3(.30,.95,.72));
          float fil_=sat(dot(wm,normalize(vec3(.5,-.1,.8)))); tone=.30+.36*d+.30*ir+.12*fil_-.10*edge+.10*vane; float tip=smoothstep(.72,1.,s)*step(.5,o); col=mix(col,vec3(.75,.95,1.),tip*.8); tone+=tip*.10;
          tone*=mix(.7,1.,smoothstep(-.5,.2,wp.z)); p.size=1.6;
        }
        p.pos=place(q); p.nrm=M*m; p.tone=sat(tone); p.color=col;
      }`,
    },
    {
      type: "surface", count: 400000, blend: "add", common,
      glsl: /* glsl */ `
      void surface(int i,int n,vec4 rnd,inout Pt p){ // wings: every point sits at its own instant of the stroke
        float side=(i%2)==0?1.:-1.; float l=sqrt(rnd.x*.96+.02), w=rnd.y, a=TAU*u_phase;
        float u=rnd.z; float dw=.5-.5*cos(PI*u);                         // dwell at both ends of the stroke
        float ph=mix(-.02,1.30,dw); vec3 q=wing(side,l,w,ph); vec3 wp=place(q);
        float beat=pow(.5+.5*cos(TAU*(u-u_phase*11.)),3.);               // the beat seen through a shutter
        float quill=smoothstep(.55,.95,.5+.5*cos((w*.8+l*.35)*TAU*5.)), lead=smoothstep(.16,.02,w);
        float ends=smoothstep(.16,.0,min(dw,1.-dw));
        float e=.30+.34*lead+.10*quill+.16*ends+.34*beat; e*=mix(.12,1.,smoothstep(0.,.4,l))*smoothstep(1.,.8,l)*.9;
        vec3 col=mix(vec3(.05,.34,.40),vec3(.50,.82,.95),sat(e*.8)); col=mix(col,vec3(.40,.35,1.),.35*(1.-u)*l);
        p.pos=wp; p.tone=sat(e); p.color=col; p.alpha=.0027*mix(1.,.45,smoothstep(.35,1.1,wp.z)); p.size=1.5;
      }`,
    },
  ],
  style: { cell: 6.5, mark: "hex", size: [0.82, 0.95], ghost: 0.05, ghostColor: "#12262e", gamma: 1.05, gain: 1.05, color: { by: "source", shade: 0.9 } },
  bloom: { strength: 0.4 },
  pointer: { mode: "glow", radius: 140, strength: 0.5 },
});
