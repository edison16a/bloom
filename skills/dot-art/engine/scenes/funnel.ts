import { defineScene } from "../core/types";

/** Dot background. Streams of light pulled through a narrow waist, with a calm centre for a headline. */
export const funnel = defineScene({
  id: "funnel", title: "Funnel", loop: 6, background: "#05060f", samples: 2,
  camera: (t) => ({ eye: [0, 0.15 * Math.sin((t / 6) * Math.PI * 2), 5], fov: 48, near: 1, far: 12 }),
  sources: [{
    type: "surface", count: 420000, blend: "add",
    glsl: /* glsl */ `
      void surface(int i,int n,vec4 rnd,inout Pt p){
        float strand=floor(rnd.x*760.); vec3 h=hash31(strand+1.);
        float th=strand*2.39996, depth=mix(.75,1.25,h.y);
        float sp=1.+floor(h.x*3.);                         // whole laps per loop
        float head=fract(h.z+u_phase*sp*.5*2.);
        float tail=rnd.y*mix(.12,.42,h.y);
        float s=fract(head-tail); float y=(s*2.-1.);
        float Y=y*3.4; float r=.50+1.75*(cosh(Y*.62)-1.)*.62+.10*sin(th*3.);
        r*=depth;
        float tw=th+Y*.28+TAU*u_phase*0.+.35*sin(TAU*u_phase+Y*.4);
        vec3 q=vec3(Y*1.16, r*cos(tw)*.82, r*sin(tw));
        float lead=1.-tail/mix(.12,.42,h.y);
        float edge=smoothstep(1.,.86,abs(y));
        float near=smoothstep(-2.6,2.2,q.z);
        float b=(pow(lead,1.8)+.6*pow(lead,14.))*edge*mix(.4,1.,near)*mix(.35,1.35,h.x*h.x);
        p.pos=q+(hash31(float(i))-.5)*.012;
        p.tone=sat(b*1.3); float e=.34*b+.003; p.alpha=e*e;
        p.color=mix(mix(vec3(.12,.15,.95),vec3(.36,.45,1.),lead),vec3(.94,.96,1.),pow(lead,9.)*.8); p.size=1.5;
      }` }],
  style: { cell: 5, mark: "square", size: [0.34, 0.84], gain: 2.2, gamma: 0.72, ghost: 0.05, ghostColor: "#161b45", color: { by: "source", shade: 0.85 } },
  bloom: { strength: 0.5 },
  fade: { left: 0.04, right: 0.04, strength: 1 },
  pointer: { mode: "lens", radius: 200, strength: 0.6 },
});
