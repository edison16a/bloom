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
