import { defineScene } from "../core/types";

/** Text background. A night sea under a low moon, every wave a line of type. */
export const tide = defineScene({
  id: "tide", title: "Tide", loop: 8, background: "#02040b", samples: 2,
  camera: (t) => ({ eye: [0, 0.82 + 0.04 * Math.sin((t / 8) * Math.PI * 2), 5], target: [0, 0.60, 0], fov: 46, near: 1, far: 40 }),
  sources: [{
    type: "shader",
    common: /* glsl */ `
      // Directional waves; every speed is a whole number of cycles per loop.
      vec3 sea(vec2 p){ float h=0.; vec2 g=vec2(0.); float a=TAU*u_phase;
        #define W(dx,dz,k,A,c) { vec2 d=normalize(vec2(dx,dz)); float f=dot(p,d)*k+a*c; float s=sin(f); float e=exp(s-1.); h+=A*e; g+=A*k*cos(f)*e*d; }
        W(.2,1.,.9,.30,-1.) W(-.5,1.,1.5,.20,-2.) W(.7,1.,2.3,.13,-2.) W(-.2,1.,3.7,.09,-3.) W(1.,.5,5.3,.05,-3.) W(-1.,.7,7.9,.035,-4.) W(.4,1.,12.1,.022,-5.) W(-.8,.6,17.,.014,-6.)
        return vec3(h,g); }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        vec3 ro=u_eye, rd=camRay(p); vec3 mo=normalize(vec3(.0,.20,-1.));
        float md=acos(clamp(dot(rd,mo),-1.,1.));
        float t; vec3 col;
        if(rd.y<-.002){
          float d=(ro.y-.25)/-rd.y; for(int i=0;i<5;i++){ vec3 q=ro+rd*d; d+=(q.y-sea(q.xz).x)/max(-rd.y,.12)*.55; }
          vec3 q=ro+rd*d; vec3 s=sea(q.xz); float att=1./(1.+d*d*.006);
          vec3 n=normalize(vec3(-s.y*att,1.,-s.z*att)); vec3 r=reflect(rd,n); r.y=abs(r.y);
          float fr=.03+.97*pow(1.-sat(dot(n,-rd)),5.);
          float sky=.20*exp(-r.y*2.6)+.04; float gl=pow(sat(dot(r,mo)),70.)*1.5+pow(sat(dot(r,mo)),9.)*.28;
          float crest=smoothstep(.36,.62,s.x)*.16*exp(-d*.08);
          t=fr*sky*1.1+gl*.95+crest+.02; float fog=1.-exp(-d*.035); t=mix(t,.16+.35*exp(-md*3.),fog*.55);
          float gk=sat(gl); col=mix(mix(vec3(.10,.30,.62),vec3(.25,.66,.86),crest*5.+fr),vec3(1.,.93,.80),gk); c.depth=d/40.;
        } else {
          float disc=smoothstep(.122,.116,md); vec2 m=p-vec2(0.,0.); float mar=.72+.28*vnoise(rd.xy*34.)-.25*smoothstep(.5,.75,vnoise(rd.xy*15.+3.));
          vec2 id=cellId(uv); float h=hash12(id); float tw=.3+.7*pow(.5+.5*sin(TAU*(u_phase*floor(1.+3.*hash12(id+2.))+h*9.)),2.);
          float cl=smoothstep(.1,.7,snoise(vec3(rd.x*2.2+.25*sin(TAU*u_phase),rd.y*11.,.4*cos(TAU*u_phase))))*.13*exp(-md*1.5);
          t=disc*mar*1.05+(1.-disc)*(.34*exp(-md*4.4)+.10*exp(-rd.y*11.)+cl)+step(.985,h)*tw*.30*(1.-disc)*smoothstep(.03,.2,rd.y);
          col=mix(vec3(.28,.45,.78),vec3(1.,.93,.80),sat(disc+exp(-md*6.)*1.1));
        }
        c.tone=sat(t); c.color=col;
      }` }],
  style: { cell: [6, 10], mark: "glyph", gamma: 1.12, gain: 1.15, color: { by: "source", shade: 0.75 },
    glyph: { message: "the sea has never once repeated itself ", fill: "message", rowShift: 17, scroll: 3, weights: [300, 500, 800], fontScale: 1 } },
  bloom: { strength: 0.4 },
  pointer: { mode: "ripple", radius: 190, strength: 0.8 },
});
