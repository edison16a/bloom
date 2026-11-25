import { defineScene } from "../core/types";

/** Dot object. A liquid-chrome trefoil, staggered dots, thin-film colour. */
export const knot = defineScene({
  id: "knot", title: "Chrome knot", loop: 8, background: "#050507", samples: 3,
  camera: { eye: [0, 0, 6.2], minAspect: 1.2, fov: 36, near: 3.5, far: 9 },
  sources: [{
    type: "surface", count: 520000,
    common: /* glsl */ `
      vec3 kn(float u){ return vec3(sin(u)+2.*sin(2.*u), cos(u)-2.*cos(2.*u), -sin(3.*u)*1.25)*.47; }
      vec3 env(vec3 r){ // a studio: two soft boxes, a strip, a dark floor
        float a=smoothstep(.15,.75,dot(r,normalize(vec3(-.6,.7,.45))));
        float b=smoothstep(.80,.96,dot(r,normalize(vec3(.8,.1,.55))));
        float st=smoothstep(.07,.0,abs(r.y+.18+.18*sin(r.x*3.+TAU*u_phase)))*.7;
        float ho=smoothstep(-.1,.5,r.y)*.22;
        float v=a*1.0+b*.9+st+ho; return vec3(v);
      }`,
    glsl: /* glsl */ `
      void surface(int i,int n,vec4 rnd,inout Pt p){
        float u=rnd.x*TAU, th=rnd.y*TAU;
        vec3 c=kn(u), T=normalize(kn(u+.01)-kn(u-.01)), B=normalize(cross(T,vec3(0.,0.,1.))), N=cross(B,T);
        float r=.30+.055*sin(u*3.-TAU*u_phase*2.)+.025*sin(u*9.+th*2.+TAU*u_phase*3.);
        vec3 m=cos(th)*N+sin(th)*B; vec3 q=c+m*r;
        float ry=TAU*u_phase; mat2 R=rot(.55*sin(ry)), Rx=rot(.35+.22*cos(ry)), Rz=rot(TAU/3.*u_phase);
        q.xy=Rz*q.xy; m.xy=Rz*m.xy; q.xz=R*q.xz; m.xz=R*m.xz; q.yz=Rx*q.yz; m.yz=Rx*m.yz;
        vec3 v=normalize(u_eye-q); vec3 rf=reflect(-v,m); float f=fresnel(m,v,2.2);
        float e=env(rf).x;
        float film=dot(m,v)*1.5+q.y*.16+u_phase;
        vec3 ir=cosPal(film,vec3(.62,.55,.72),vec3(.36,.38,.28),vec3(1.),vec3(.95,.42,.60));
        float ao=smoothstep(-1.15,.7,q.z);
        float tone=(.07+.66*e+.46*f)*mix(.34,1.,ao);
        p.pos=q; p.nrm=m; p.tone=sat(tone);
        p.color=mix(ir*mix(.8,1.25,e),vec3(1.,.99,.97),smoothstep(.6,.95,tone)*.8); p.size=1.5;
      }`,
  }],
  style: { cell: 8, mark: "hex", size: [0.14, 0.95], ghost: 0.1, ghostColor: "#2a2a34", color: { by: "source", shade: 0.25 }, gamma: 1.15 },
  bloom: { strength: 0.35 },
  pointer: { mode: "lens", radius: 160, strength: 0.5 },
});
