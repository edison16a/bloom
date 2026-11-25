import { defineScene } from "../core/types";

/** Dot background. Lit ribbons of flow, ordered-dithered into four inks. */
export const ribbons = defineScene({
  id: "ribbons", title: "Ribbons", loop: 12, background: "#09090f", samples: 2,
  sources: [{
    type: "shader",
    common: /* glsl */ `
      // One ribbon family. x across, y along. Hard leading edge, long soft trail, and a hairline running ahead.
      float ribbon(float u,float w,float lit){
        float body=u<0.?smoothstep(-w*.42,0.,u):exp(-pow(u/(w*1.05),1.15)*1.25);
        float core=exp(-pow((u-w*.05)/(w*.17),2.));
        return lit*(body*.60+core*.46);
      }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        float a=TAU*u_phase; vec2 q=p;
        q+=.34*vec2(sin(q.y*1.35+a),sin(q.x*1.1-a+1.3));
        q+=.17*vec2(sin(q.y*2.7-a+.5),cos(q.x*2.3+a*1.));
        q+=.07*vec2(lnoise(q*1.5,u_phase,.35),lnoise(q*1.5+7.,u_phase,.35));
        float s=q.x*.90+q.y*.50, along=q.y*.90-q.x*.50;
        float T=0.;
        for(int i=0;i<9;i++){
          float fi=float(i), h=hash11(fi+3.), h2=hash11(fi*7.+1.);
          float x0=-2.05+fi*.54+(h-.5)*.16;
          float bend=.10*sin(along*1.3+fi*1.9+a)+.06*sin(along*2.6-fi+a*2.);
          float u=s-x0-bend;
          float w=mix(.14,.25,h2)*(1.+.45*sin(along*1.7+fi*2.3-a));
          float lit=smoothstep(-.25,.8,sin(along*.8+fi*1.7+a)+.62)*mix(.82,1.12,hash11(fi*3.1));
          if(i%2==1){ lit*=.5; w*=.95; }
          T=max(T,ribbon(u,w,lit));
          float off=u+.105+.02*sin(along*2.+fi);
          T=max(T,smoothstep(.0105,.004,abs(off))*smoothstep(.12,.7,lit)*mix(.75,1.15,h));
        }
        c.tone=T; c.color=vec3(1.);
      }`,
  }],
  style: {
    cell: 4, mark: "pixel", gamma: 1.12,
    dither: { type: "bayer", stops: ["#09090f", "#2a35d8", "#5468ff", "#ffffff"], bands: [true, false, true], jitter: 0.22 },
  },
  pointer: { mode: "lens", radius: 170, strength: 0.7 },
});
