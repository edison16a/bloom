import { defineScene } from "../core/types";

/** Dot object. A jellyfish, drawn translucent by adding light instead of hiding it. */
export const jelly = defineScene({
  id: "jelly", title: "Medusa", loop: 6, background: "#01060d", samples: 2,
  camera: (t) => ({ eye: [0, 0.5, 6.0], target: [0, -0.42, 0], minAspect: 0.95, fov: 38, near: 4, far: 9 }),
  sources: [
    { type: "shader", glsl: /* glsl */ `void scene(vec2 uv,vec2 p,inout Cell c){
        float g=exp(-dot(p-vec2(0.,.25),p-vec2(0.,.25))*1.1);
        vec2 id=cellId(uv); float h=hash12(id), sp=floor(1.+2.*hash12(id+3.));
        float y=fract(uv.y*1.-u_phase*0.+h);
        float tw=pow(.5+.5*sin(TAU*(u_phase*sp+hash12(id+8.))),3.);
        float mote=step(.9945,h)*tw*(.18+.5*g);
        float ray=smoothstep(.35,1.,sin(uv.x*9.+lnoise(vec2(uv.x*3.,0.),u_phase,.4)*2.)*.5+.5)*smoothstep(.1,1.2,uv.y)*.07;
        c.tone=sat(g*.10+mote+ray); c.color=mix(vec3(.05,.28,.55),vec3(.35,.9,1.),mote*2.); }` },
    {
      type: "surface", count: 300000, blend: "add",
      common: /* glsl */ `
        float puls(float lag){ float x=fract(u_phase*2.-lag); return x<.28?eio(x/.28):1.-eio((x-.28)/.72); } // fast squeeze, slow release
        vec3 bell(float th,float v){
          float k=puls(v*.12); float a=v*1.78;
          float r=sin(min(a,1.95))*(1.15-.24*k*v*v)*(1.+.02*sin(th*16.)*v*v);
          float y=cos(a)*(.86+.12*k)-.04*sin(th*8.+TAU*u_phase)*smoothstep(.8,1.,v);
          return vec3(r*cos(th),y+.14*k,r*sin(th));
        }`,
      glsl: /* glsl */ `
        void surface(int i,int n,vec4 rnd,inout Pt p){
          float a=TAU*u_phase, sway=.12*sin(a); int part=i%20; vec3 q; float lum_; vec3 col; float al;
          vec3 cy=vec3(.18,.85,1.), vi=vec3(.62,.36,1.), pk=vec3(1.,.42,.78);
          if(part<8){ // bell
            float th=rnd.x*TAU, v=sqrt(rnd.y); q=bell(th,v);
            vec3 m=normalize(q*vec3(1.,1.35,1.)); float f=fresnel(m,normalize(u_eye-q),1.6);
            float rib=pow(.5+.5*cos(th*16.),10.)*smoothstep(.18,.95,v);
            lum_=.18+.95*f+.55*rib+.9*smoothstep(.965,1.,v); al=.085;
            col=mix(cy,vi,smoothstep(.1,1.,v))+pk*.35*rib;
          } else if(part<10){ // inner lantern: four looped organs
            float k=floor(rnd.z*4.), th=rnd.x*TAU; vec2 cc=vec2(cos(k*TAU/4.+.4),sin(k*TAU/4.+.4))*.36;
            float rr=.22*(1.+.12*sin(th*5.)); q=vec3(cc.x+rr*cos(th),.34+.06*sin(th*3.)+.14*puls(.05),cc.y+rr*sin(th))+(hash31(float(i))-.5)*.07;
            lum_=1.2; al=.05; col=mix(pk,vec3(1.,.8,.6),rnd.w*.6);
          } else if(part<15){ // oral arms
            float k=floor(rnd.z*5.), s=rnd.y; float th=k*TAU/5.+.3;
            float wv=sin(s*7.-a*2.+k*1.3)*.22*s+sin(s*13.+a*2.+k)*.07*s;
            float fr_=(rnd.x-.5)*(.24*(1.-s*.75))*(1.+.5*sin(s*42.+k));
            q=vec3(cos(th)*(.20+.15*s)+wv*cos(th+1.57)+fr_*cos(th+1.57+s*5.),.2-s*2.15+.12*puls(.25+s*.2),sin(th)*(.20+.15*s)+wv*sin(th+1.57)+fr_*sin(th+1.57+s*5.));
            lum_=(1.-s)*1.1+.15; al=.042; col=mix(pk,vi,s);
          } else { // tentacles
            float k=floor(rnd.z*30.), s=rnd.y, h=hash11(k+2.); float th=(k+.4*h)*TAU/30.; vec3 b=bell(th,1.);
            float L=1.35+1.15*h; float wv=sin(s*5.5-a*2.+k*.9)*.26*s*s+sin(s*11.-a*2.+k*2.1)*.05*s;
            q=b+vec3(cos(th)*(-.22*s+wv),-s*L+.1*puls(.3+s*.3),sin(th)*(-.22*s+wv))+(hash31(float(i))-.5)*.012;
            lum_=(1.-s*.82)*1.1; al=.085; col=mix(cy,vi,sat(s*1.3));
            lum_*=.65+.6*pow(.5+.5*sin(s*38.-a*3.+k),4.);
          }
          q.xy=rot(.13+.05*sin(a))*q.xy; q.x+=sway*.5; q.y+=.08*sin(a*2.-.8)+.12; q.xz=rot(.35*sin(a))*q.xz;
          p.pos=q; p.tone=sat(lum_); p.color=col*1.0; p.alpha=al*al; p.size=1.6;
        }`,
    },
  ],
  style: { cell: 5, mark: "octagon", size: [0.2, 0.96], ghost: 0.05, ghostColor: "#0c2a44", color: { by: "source", shade: 0.75 }, gain: 1.2, gamma: 0.95 },
  bloom: { strength: 0.7 },
  pointer: { mode: "ripple", radius: 170, strength: 0.6 },
});
