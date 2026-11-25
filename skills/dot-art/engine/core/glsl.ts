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

export const SURFACE_FS = `#version 300 es
precision highp float;
in vec3 v_color; in vec4 v_d;
uniform float u_add;
layout(location=0) out vec4 o_color;
layout(location=1) out vec4 o_data;
void main(){
  float a=u_add>0.?v_d.w*u_add:1.;
  o_color=vec4(v_color*a,a);
  o_data=vec4(v_d.x*a,v_d.y*a,v_d.z*a,a);
}`;

export const RESOLVE_FS = `#version 300 es
precision highp float; precision highp sampler2D;
uniform sampler2D u_color,u_data; uniform int u_ss; uniform int u_stagger; uniform int u_rows; uniform int u_w;
layout(location=0) out vec4 o_color;
layout(location=1) out vec4 o_data;
void main(){
  ivec2 b=ivec2(gl_FragCoord.xy)*u_ss; if(u_stagger>0&&((u_rows-1-int(gl_FragCoord.y))&1)==1) b.x+=u_ss/2; vec4 c=vec4(0.),d=vec4(0.);
  for(int y=0;y<u_ss;y++)for(int x=0;x<u_ss;x++){ ivec2 q=b+ivec2(x,y); q.x=min(q.x,u_w-1); c+=texelFetch(u_color,q,0); d+=texelFetch(u_data,q,0); }
  float n=float(u_ss*u_ss); o_color=c/n; o_data=d/n;
}`;

/** r = time this cell last switched on (or -1 when off). */
export const AGE_FS = `#version 300 es
precision highp float; precision highp sampler2D;
uniform sampler2D u_color,u_prev; uniform float u_now; uniform float u_reset;
out vec4 o;
void main(){
  ivec2 q=ivec2(gl_FragCoord.xy);
  bool on=texelFetch(u_color,q,0).a>.12;
  float prev=texelFetch(u_prev,q,0).r;
  if(u_reset>1.5) prev=-1.; else if(u_reset>.5&&prev>=0.) prev=0.;   // loop wrap: cells already lit count as long lit, so nothing scrambles at the seam
  o=vec4(on?(prev<0.?u_now+1.:prev):-1.);
}`;

export const CELL_FS = `#version 300 es
precision highp float; precision highp int; precision highp sampler2D;
uniform sampler2D u_color,u_data,u_age,u_atlas,u_overlay;
uniform vec2 u_res; uniform vec2 u_cell; uniform vec2 u_grid;
uniform float u_time,u_phase,u_dpr;
uniform int u_mark; uniform vec2 u_size; uniform float u_round; uniform float u_stagger; uniform vec2 u_rotCS;
uniform vec3 u_curve; // gain, lift, gamma
uniform float u_ghost; uniform vec3 u_ghostColor;
uniform int u_by; uniform int u_nStops; uniform vec3 u_stops[8]; uniform vec2 u_dir; uniform float u_highlight,u_shade,u_irid;
uniform int u_dither; uniform float u_bands[8]; uniform float u_jitter;
uniform vec4 u_bg; // rgb, a
uniform vec4 u_fade; uniform vec4 u_hole; uniform float u_fadeStrength;
uniform vec3 u_ptr; uniform int u_ptrMode; uniform vec2 u_ptrCfg; // radius px, strength
// glyph
uniform ivec4 u_at; // cols, rows, stride, weights
uniform sampler2D u_lut; // rows: ramp, message, glitch, loose (tile index in r + 256 g)
uniform int u_nRamp,u_nMsg; uniform int u_fill; uniform float u_msgAbove,u_scroll; uniform int u_rowShift;
uniform int u_edgeT[8]; uniform float u_edge; uniform float u_box; uniform float u_glitch;
uniform int u_nGlitch,u_nLoose;
uniform float u_hasOverlay;
uniform sampler2D u_hiC,u_hiD; uniform float u_detail,u_under;
out vec4 o;
#define sat(x) clamp(x,0.,1.)
float hash12(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float bayer2(ivec2 p){ return float((p.x^p.y)&1)*.5+float(p.y&1)*.25; }
float bayer8(ivec2 p){ p&=7; return bayer2(p&1)+bayer2((p>>1)&1)*.25+bayer2((p>>2)&1)*.0625; }
vec3 grad(float t){ t=sat(t)*float(u_nStops-1); int i=int(min(floor(t),float(u_nStops-2))); if(u_nStops<2) return u_stops[0]; return mix(u_stops[i],u_stops[i+1],t-float(i)); }

int lut(int row,int i){ vec2 v=texelFetch(u_lut,ivec2(i,row),0).rg*255.; return int(v.x+.5)+256*int(v.y+.5); }
struct S { vec3 col; float tone; float cov; float depth; float flag; vec2 ctr; };
vec2 cellUV(vec2 ctr){ return vec2(ctr.x,u_grid.y*u_cell.y-ctr.y)/(u_grid*u_cell); }
float maskAt(vec2 f){
  float m=1.;
  if(u_fade.x>0.) m*=smoothstep(0.,u_fade.x,f.x);
  if(u_fade.y>0.) m*=smoothstep(0.,u_fade.y,1.-f.x);
  if(u_fade.z>0.) m*=smoothstep(0.,u_fade.z,f.y);
  if(u_fade.w>0.) m*=smoothstep(0.,u_fade.w,1.-f.y);
  if(u_hole.z>0.){ float d=length((f-u_hole.xy)/u_hole.zw); m*=mix(1.,smoothstep(.35,1.15,d),u_fadeStrength); }
  return m;
}
S fetchCell(vec2 id){
  S s; vec2 q=id+.5; if(u_stagger>.5 && mod(id.y,2.)>.5) q.x+=.5;
  q*=u_cell; vec2 ctr=mat2(u_rotCS.x,-u_rotCS.y,u_rotCS.y,u_rotCS.x)*q; s.ctr=ctr;
  vec2 at=ctr; float boost=0.;
  if(u_ptr.z>.001 && u_ptrMode>0){
    vec2 d=ctr-u_ptr.xy; float l=length(d)+1e-3, k=exp(-l*l/(u_ptrCfg.x*u_ptrCfg.x))*u_ptr.z;
    if(u_ptrMode==1) boost=k*u_ptrCfg.y;
    else if(u_ptrMode==2) at-=d*k*u_ptrCfg.y*.6;
    else { float w=sin(l/u_ptrCfg.x*9.-u_time*6.)*exp(-l/u_ptrCfg.x)*u_ptr.z; at+=d/l*w*u_cell.y*2.*u_ptrCfg.y; boost=w*.15*u_ptrCfg.y; }
  }
  vec2 uv=cellUV(u_stagger>.5&&mod(id.y,2.)>.5?at-vec2(u_cell.x*.5,0.):at);
  vec4 c=texture(u_color,uv), d=texture(u_data,uv);
  float a=max(c.a,1e-4), b=max(d.a,1e-4);
  s.col=c.rgb/a; s.cov=sat(c.a);
  s.tone=d.r/min(b,1.); s.depth=mix(1.,d.g/b,step(.02,d.a)); s.flag=d.b/b;
  s.tone=sat(s.tone*u_curve.x+u_curve.y*step(.004,s.tone));
  s.tone=pow(s.tone,u_curve.z);
  s.tone*=s.cov;
  s.tone=sat(s.tone*(1.+boost*2.)+boost*.35*s.cov);
  return s;
}
vec3 iridAt(vec2 fr){ float t=dot(fr,vec2(.72,.69))/(u_dpr*13.)+dot(fr,vec2(-.2,.9))/(u_dpr*420.)+u_phase*2.;
  vec3 a=mix(vec3(.28,.45,1.),vec3(.86,.62,1.),.5+.5*sin(t*6.28)); return mix(a,vec3(.8,.97,1.),pow(.5+.5*sin(t*12.6+1.),4.)); }
vec3 colorOf(S s, vec2 fr){
  vec2 f=s.ctr/u_res; vec3 c;
  if(u_by==0) c=s.col;
  else if(u_by==1) return grad(s.tone);
  else if(u_by==2){ float t=dot(f-.5,u_dir)+.5; c=grad(t); }
  else c=u_stops[0];
  if(u_highlight<1.) c=mix(c,vec3(1.),smoothstep(u_highlight,1.15,s.tone)*.85);
  return c;
}
float shape(vec2 q,float r){ // q in px from centre, r = half-size px; returns signed distance (px)
  if(u_mark==0){ float k=u_round*r; vec2 d=abs(q)-r+k; return length(max(d,0.))+min(max(d.x,d.y),0.)-k; }
  if(u_mark==3) return (abs(q.x)+abs(q.y))*.7071-r*.85;
  vec2 a=abs(q);
  if(u_mark==1) return max(a.x,a.x*.5+a.y*.8660254)-r;               // pointy-top hexagon, r = apothem
  if(u_mark==2) return max(max(a.x,a.y),(a.x+a.y)*.70710678)-r;     // octagon
  float w=max(r*.24,.5*u_dpr);
  if(u_mark==4) return min(max(a.x-r,a.y-w),max(a.y-r,a.x-w));
  if(u_mark==5){ a=abs(vec2(q.x+q.y,q.x-q.y)*.7071); return min(max(a.x-r,a.y-w),max(a.y-r,a.x-w)); }
  return max(abs(q.x)-u_cell.x*.5,abs(q.y)-r); // line
}
float tile(int t,int wt,vec2 l){ // l in 0..1, y down
  int n=t+wt*u_at.z; ivec2 c=ivec2(n%u_at.x,n/u_at.x);
  vec2 sz=vec2(textureSize(u_atlas,0))/vec2(u_at.xy);
  return texture(u_atlas,(vec2(c)+l)*sz/vec2(textureSize(u_atlas,0))).r;
}
void main(){
  vec2 fr=vec2(gl_FragCoord.x,u_res.y-gl_FragCoord.y);
  vec2 q=mat2(u_rotCS.x,u_rotCS.y,-u_rotCS.y,u_rotCS.x)*fr/u_cell;
  float row=floor(q.y); if(u_stagger>.5 && mod(row,2.)>.5) q.x-=.5;
  vec2 id=floor(q), l=q-id;
  S s=fetchCell(id);
  float m=maskAt(s.ctr/u_res);
  vec3 col; float ink=0.;
  if(u_mark==7){ // pixel / dither
    float t=s.tone*m*float(u_nStops-1); int i=int(min(floor(t),float(u_nStops-2))); float f=t-float(i);
    float thr=u_dither==1?bayer8(ivec2(id)):hash12(id+.5);
    thr=mix(thr,hash12(id*1.7+3.1),u_jitter); thr=thr*.94+.03;
    float k=u_bands[i]>.5?step(thr,f):f;
    vec3 a=i==0?u_bg.rgb:u_stops[i]; col=mix(a,u_stops[i+1],k);
    ink=(i==0)?(u_bands[0]>.5?k:f):1.;
    vec2 e=abs(l-.5)*u_cell; float gap=u_size.y<1.?1.-smoothstep(-.5,.5,max(e.x-u_cell.x*.5*u_size.y,e.y-u_cell.y*.5*u_size.y)):1.;
    ink*=gap;
    if(i==0) col=u_stops[1];
  } else if(u_mark==8){ // glyph
    int wt=s.tone>.72?2:s.tone>.34?1:0; wt=min(wt,u_at.w-1);
    int t=lut(0,int(clamp(floor(s.tone*float(u_nRamp-1)+.5),0.,float(u_nRamp-1))));
    ivec2 ii=ivec2(id);
    bool lit=s.tone>.012;
    if(u_nMsg>0 && u_fill>0 && (u_fill==2?lit:s.tone>u_msgAbove)){
      int k=ii.x+ii.y*u_rowShift+int(floor(u_time*u_scroll)); t=lut(1,((k%u_nMsg)+u_nMsg)%u_nMsg);
    }
    col=colorOf(s,fr);
    float lum=u_shade>0.?mix(1.,s.tone,u_shade):1.;
    bool boxed=s.tone>u_box;
    if(u_edge>0. && lit && s.flag<.6){
      vec2 px=1./u_grid, uv=cellUV(s.ctr);
      #define CV(o) texture(u_color,uv+vec2(o)*px).a
      #define DP(o) mix(1.,texture(u_data,uv+vec2(o)*px).g/max(texture(u_data,uv+vec2(o)*px).a,1e-4),step(.02,texture(u_data,uv+vec2(o)*px).a))
      vec2 g=vec2(CV(vec2(1,0))-CV(vec2(-1,0)),CV(vec2(0,1))-CV(vec2(0,-1)))+.5*vec2(CV(vec2(1,1))+CV(vec2(1,-1))-CV(vec2(-1,1))-CV(vec2(-1,-1)),CV(vec2(1,1))+CV(vec2(-1,1))-CV(vec2(1,-1))-CV(vec2(-1,-1)));
      vec2 gd=-vec2(DP(vec2(1,0))-DP(vec2(-1,0)),DP(vec2(0,1))-DP(vec2(0,-1)));
      bool sil=length(g)>1.1, dep=length(gd)>.05/u_edge;
      if(sil||dep){
        vec2 n=sil?g:gd; n.x*=1.; float an=atan(n.y,n.x); an=mod(an,3.14159265);
        int e=int(floor(an/3.14159265*4.+.5))%4; // 0: normal horizontal -> |, 1: normal 45 -> \\, 2: -> -, 3: -> /
        t=e==0?u_edgeT[0]:e==1?u_edgeT[1]:e==2?(n.y>0.?u_edgeT[2]:u_edgeT[4]):u_edgeT[3];
        col=col*1.25+.06; lum=max(lum,.55); boxed=false; wt=min(1,u_at.w-1);
      }
    }
    if(s.flag>.6 && u_nLoose>0){ t=lut(3,int(hash12(id+floor(s.flag*97.)+floor(u_time*6.))*float(u_nLoose))); boxed=false; lum=max(lum,.35); }
    if(u_glitch>0. && s.cov>.12){
      float on=texelFetch(u_age,ivec2(int(id.x),int(u_grid.y)-1-int(id.y)),0).r-1.;
      float age=u_time-on;
      float life=u_glitch*(.45+.9*hash12(id+7.));
      if(on>-.5 && age>=0. && age<life && s.flag<.6){
        t=lut(2,int(hash12(id*1.31+floor(u_time*22.))*float(u_nGlitch)));
        col=col*.5+.45; lum=max(lum,.85); wt=min(2,u_at.w-1); boxed=false;
      }
    }
    if(u_hasOverlay>.5){
      vec4 ov=texelFetch(u_overlay,ivec2(id),0);
      if(ov.a>.002){ t=int(ov.r*255.+.5)+256*int(ov.g*255.+.5); int oc=int(ov.a*255.+.5); col=oc==255?vec3(1.):vec3(float((oc-1)/36),float(((oc-1)/6)%6),float((oc-1)%6))/5.; lum=ov.b; boxed=false; wt=min(2,u_at.w-1); lit=true; }
    }
    float g=lit?tile(t,wt,l):0.;
    if(u_irid>0. && (boxed || s.flag>.2&&s.flag<.6)) col=mix(col,iridAt(boxed?fr:s.ctr)*mix(.75,1.,s.tone),u_irid);
    if(boxed) g=1.-g;
    ink=g*lum*m;
    if((u_detail>0.||u_under>0.) && s.flag<.6){
      // Letters carry the texture; the full-resolution render underneath carries the form.
      vec2 huv=cellUV(fr); vec4 hc=texture(u_hiC,huv), hd=texture(u_hiD,huv); float cov=sat(hc.a);
      float ht=pow(sat(hd.r*u_curve.x+u_curve.y),u_curve.z);
      float k=mix(1.,smoothstep(.05,.6,cov)*mix(1.,clamp(ht/max(s.tone,.04),.25,1.5),.75),u_detail);
      ink*=k; if(hc.a>.02) col=u_by==0?mix(col,hc.rgb/hc.a,u_detail*.8):col;
      ink=max(ink,u_under*ht*m*smoothstep(0.,.5,cov));
    }
  } else { // SDF marks
    float r0=(u_mark==1?u_cell.x:min(u_cell.x,u_cell.y))*.5; ink=0.; col=vec3(0.);
    int R=u_size.y>1.||u_mark==1?1:0; float gst=0.;
    for(int y=-R;y<=R;y++)for(int x=-R;x<=R;x++){
      vec2 nid=id+vec2(x,y); S n; if(R==0) n=s; else { n=fetchCell(nid); }
      float mm=maskAt(n.ctr/u_res);
      float tt=n.tone;
      float r=r0*mix(u_size.x,u_size.y,sqrt(sat(tt)));
      vec2 dq=fr-n.ctr; dq=mat2(u_rotCS.x,u_rotCS.y,-u_rotCS.y,u_rotCS.x)*dq;
      float k=1.-smoothstep(-.5,.5,shape(dq,r)); if(u_size.x<=0.) k*=smoothstep(0.,.03,tt);
      vec3 nc=colorOf(n,fr); if(u_irid>0.&&n.flag>.2&&n.flag<.6) nc=mix(nc,iridAt(n.ctr),u_irid);
      float b=k*mix(step(.004,tt),tt,u_shade)*mm;
      if(b>ink||R==0){ ink=b; col=nc; }
      if(u_ghost>0.&&(x==0&&y==0||u_mark==1)){ float gr=r0*mix(u_size.x,u_size.y,u_size.x==u_size.y?1.:.35); gst=max(gst,(1.-smoothstep(-.5,.5,shape(dq,gr)))*u_ghost); }
    }
    if(gst>ink){ col=mix(u_ghostColor,col,sat(ink/gst)); ink=gst; }
  }
  // Emissive look on dark grounds, opaque ink on light ones.
  ink=sat(ink);
  vec3 rgb=mix(u_bg.rgb*u_bg.a,col,ink); float al=mix(u_bg.a,1.,ink);
  o=vec4(u_bg.a<.5?col*ink:rgb,al);
}`;

export const BLUR_FS = `#version 300 es
precision highp float;
in vec2 v_uv; uniform sampler2D u_tex; uniform vec2 u_step; uniform float u_threshold; uniform vec3 u_base; uniform float u_first;
out vec4 o;
void main(){
  vec4 s=vec4(0.); float w=0.;
  for(int i=-4;i<=4;i++){ float k=exp(-float(i*i)/8.); vec4 c=texture(u_tex,v_uv+u_step*float(i)*1.4);
    if(u_first>.5){ c.rgb=max(c.rgb-u_base,0.); float l=max(c.r,max(c.g,c.b)); c.rgb*=smoothstep(u_threshold,u_threshold+.12,l+1e-4+step(u_threshold,0.)); }
    s+=c*k; w+=k; }
  o=s/w;
}`;
