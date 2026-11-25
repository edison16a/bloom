/** Shared GLSL: available to every scene and surface hook. Documented in references/authoring.md. */

export const LIB = /* glsl */ `
#define PI 3.14159265359
#define TAU 6.28318530718
#define sat(x) clamp(x,0.,1.)
mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float hash11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float hash12(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
vec2  hash22(vec2 p){ vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); q+=dot(q,q.yzx+33.33); return fract((q.xx+q.yz)*q.zy); }
vec3  hash31(float p){ vec3 q=fract(vec3(p)*vec3(.1031,.1030,.0973)); q+=dot(q,q.yzx+33.33); return fract((q.xxy+q.yzz)*q.zyx); }
vec4  hash41(float p){ vec4 q=fract(vec4(p)*vec4(.1031,.1030,.0973,.1099)); q+=dot(q,q.wzxy+33.33); return fract((q.xxyz+q.yzzw)*q.zywx); }
float hash13(vec3 p){ p=fract(p*.1031); p+=dot(p,p.zyx+31.32); return fract((p.x+p.y)*p.z); }

// Value noise, quintic. 2D and 3D, range 0..1.
float vnoise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),f.x),mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),f.x),f.y); }
float vnoise(vec3 p){ vec3 i=floor(p),f=fract(p); f=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(mix(hash13(i),hash13(i+vec3(1,0,0)),f.x),mix(hash13(i+vec3(0,1,0)),hash13(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash13(i+vec3(0,0,1)),hash13(i+vec3(1,0,1)),f.x),mix(hash13(i+vec3(0,1,1)),hash13(i+vec3(1,1,1)),f.x),f.y),f.z); }
// Simplex 3D, range -1..1.
vec4 _perm(vec4 x){ return mod(((x*34.)+1.)*x,289.); }
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)), x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz), l=1.-g, i1=min(g.xyz,l.zxy), i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx, x2=x0-i2+C.yyy, x3=x0-D.yyy;
  i=mod(i,289.);
  vec4 p=_perm(_perm(_perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  vec3 ns=(1./7.)*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z), x_=floor(j*ns.z), y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy, y=y_*ns.x+ns.yyyy, h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy), b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1., s1=floor(b1)*2.+1., sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy, a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x),p1=vec3(a0.zw,h.y),p2=vec3(a1.xy,h.z),p3=vec3(a1.zw,h.w);
  vec4 norm=1.79284291400159-.85373472095314*vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m*=m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*snoise(p); p=p*2.03+17.1; a*=.5; } return s; }
// Seamless-loop noise: z orbits a circle, so phase 0 and phase 1 match exactly.
float lnoise(vec2 p, float phase, float r){ return snoise(vec3(p+r*vec2(cos(TAU*phase),0.), r*sin(TAU*phase))); }
vec3 curl(vec3 p){ const float e=.1; vec3 dx=vec3(e,0,0),dy=vec3(0,e,0),dz=vec3(0,0,e);
  vec3 o1=vec3(31.4,-7.2,5.1), o2=vec3(-12.9,47.3,19.6);
  #define _N(q) vec3(snoise(q),snoise((q)+o1),snoise((q)+o2))
  vec3 x0=_N(p-dx),x1=_N(p+dx),y0=_N(p-dy),y1=_N(p+dy),z0=_N(p-dz),z1=_N(p+dz);
  return vec3(y1.z-y0.z-z1.y+z0.y, z1.x-z0.x-x1.z+x0.z, x1.y-x0.y-y1.x+y0.x)/(2.*e); }

// Timing
float seg(float t,float a,float b){ return sat((t-a)/(b-a)); }
float eio(float x){ return x*x*x*(x*(x*6.-15.)+10.); }
float eout(float x){ return 1.-pow(1.-x,3.); }
float ein(float x){ return x*x*x; }
float eback(float x){ float y=x-1.; return 1.+2.2*y*y*y+1.2*y*y; }

// SDF
float sdSphere(vec3 p,float r){ return length(p)-r; }
float sdBox(vec3 p,vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
float sdRoundBox(vec3 p,vec3 b,float r){ return sdBox(p,b-r)-r; }
float sdTorus(vec3 p,vec2 t){ return length(vec2(length(p.xz)-t.x,p.y))-t.y; }
float sdCylinder(vec3 p,float h,float r){ vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h); return min(max(d.x,d.y),0.)+length(max(d,0.)); }
float sdCapsule(vec3 p,vec3 a,vec3 b,float r){ vec3 pa=p-a,ba=b-a; return length(pa-ba*sat(dot(pa,ba)/dot(ba,ba)))-r; }
float sdBox2(vec2 p,vec2 b){ vec2 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,q.y),0.); }
float smin(float a,float b,float k){ float h=max(k-abs(a-b),0.)/k; return min(a,b)-h*h*k*.25; }
float smax(float a,float b,float k){ return -smin(-a,-b,k); }

// Colour
vec3 cosPal(float t,vec3 a,vec3 b,vec3 c,vec3 d){ return a+b*cos(TAU*(c*t+d)); }
vec3 irid(float t){ return .5+.5*cos(TAU*(t+vec3(0.,.33,.67))); }
vec3 ramp3(float t,vec3 a,vec3 b,vec3 c){ return t<.5?mix(a,b,t*2.):mix(b,c,t*2.-1.); }
vec3 ramp4(float t,vec3 a,vec3 b,vec3 c,vec3 d){ t=sat(t)*3.; return t<1.?mix(a,b,t):t<2.?mix(b,c,t-1.):mix(c,d,t-2.); }
float luma(vec3 c){ return dot(c,vec3(.2126,.7152,.0722)); }
// Wrapped diffuse: soft terminator that survives 12 tone steps.
float wrapDiff(vec3 n,vec3 l,float w){ return sat((dot(n,l)+w)/(1.+w)); }
float blinn(vec3 n,vec3 l,vec3 v,float p){ return pow(sat(dot(n,normalize(l+v))),p); }
float fresnel(vec3 n,vec3 v,float p){ return pow(1.-abs(dot(n,v)),p); }
`;

export const UNIFORMS = /* glsl */ `
uniform float u_time;   // seconds
uniform float u_phase;  // 0..1 over the loop
uniform float u_loop;
uniform vec2 u_grid;    // cols, rows
uniform vec2 u_frame;   // pixels
uniform float u_aspect;
uniform vec3 u_eye;
uniform mat4 u_view, u_viewProj;
uniform vec2 u_clip;    // near, far
uniform vec3 u_pointer; // x,y in -1..1 (y up), z = presence
uniform float u_stag;
uniform vec4 u_cam[4];  // right, up, forward, (tan(fov/2))
`;

export const SHADER_FS = (common: string, hook: string, decls: string) => `#version 300 es
precision highp float; precision highp int; precision highp sampler2D;
in vec2 v_uv;
layout(location=0) out vec4 o_color;
layout(location=1) out vec4 o_data;
${UNIFORMS}${decls}${LIB}
struct Cell { vec3 color; float tone; float alpha; float depth; float flag; };
/** Id of the mark under uv. Use it for per-dot randomness (stars, twinkle) so staggered grids stay aligned. */
vec2 cellId(vec2 uv){ vec2 q=uv*u_grid; float row=floor(u_grid.y-q.y); if(u_stag>.5&&mod(row,2.)>.5) q.x-=.5; return floor(q); }
/** Camera ray through p (aspect-corrected, -1..1 vertically). */
vec3 camRay(vec2 p){ return normalize(u_cam[0].xyz*p.x*u_cam[3].x+u_cam[1].xyz*p.y*u_cam[3].x+u_cam[2].xyz); }
${common}
${hook}
void main(){
  vec2 p=(v_uv*2.-1.)*vec2(u_aspect,1.);
  Cell c=Cell(vec3(1.),0.,1.,1.,0.);
  scene(v_uv,p,c);
  float a=sat(c.alpha);
  o_color=vec4(max(c.color,0.)*a,a);
  o_data=vec4(sat(c.tone)*a,c.depth*a,c.flag*a,a);
}`;

const PT = /* glsl */ `
struct Pt { vec3 pos; vec3 nrm; vec3 color; float tone; float size; float flag; float alpha; vec4 extra; };
/** Flip a normal to face the camera: thin surfaces are lit on both sides. */
vec3 faceView(vec3 n, vec3 pos){ return dot(n,u_eye-pos)<0.?-n:n; }
`;

export const SURFACE_VS = (common: string, hook: string, decls: string, geo: boolean) => `#version 300 es
precision highp float; precision highp int; precision highp sampler2D;
${geo ? "in vec3 a_pos; in vec3 a_nrm; in vec3 a_col; in vec4 a_extra;" : ""}
uniform int u_count; uniform float u_px; uniform float u_isPoint; uniform float u_add;
out vec3 v_color; out vec4 v_d;
${UNIFORMS}${decls}${LIB}${PT}
${common}
${hook}
void main(){
  int i=gl_VertexID;
  // R2 sequence: even coverage with far fewer points than white noise.
  vec4 w=hash41(float(i)+.5);
  vec4 rnd=vec4(fract(.5+float(i)*.7548776662466927),fract(.5+float(i)*.5698402909980532),w.z,w.w);
  ${geo
    ? "Pt p=Pt(a_pos,a_nrm,a_col,0.5,1.5,0.,1.,a_extra);"
    : "Pt p=Pt(vec3(0.),vec3(0.,0.,1.),vec3(1.),0.5,1.5,0.,1.,vec4(0.));"}
  surface(i,u_count,rnd,p);
  gl_Position=u_viewProj*vec4(p.pos,1.);
  float d=-(u_view*vec4(p.pos,1.)).z;
  if(u_isPoint>.5 && (p.alpha<=0.||u_add<=0.&&p.alpha<rnd.w)) gl_Position=vec4(2.,2.,2.,1.);
  gl_PointSize=max(1.,p.size*u_px);
  v_color=max(p.color,0.);
  v_d=vec4(sat(p.tone),sat((d-u_clip.x)/(u_clip.y-u_clip.x)),p.flag,p.alpha);
}`;
