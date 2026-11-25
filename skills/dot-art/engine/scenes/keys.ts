import { defineScene } from "../core/types";

/** Text background. A field of bevelled keys typed in ASCII; lit bevels knock out into iridescent blocks. */
export const keys = defineScene({
  id: "keys", title: "Keys", loop: 9, background: "#0a0a10", samples: 3,
  camera: (t) => { const a = (t / 9) * Math.PI * 2; return { eye: [-0.95 + 0.12 * Math.sin(a), 6, 0.75 + 0.12 * Math.cos(a)], target: [0, 0, 0], fov: 42, roll: 0.62, near: 2, far: 10 }; },
  sources: [{
    type: "shader",
    common: /* glsl */ `
      const float PITCH=1.06;
      float kh(vec2 id){ float a=TAU*u_phase; return .05*sin(a+id.x*1.3+id.y*2.1)+.05*sin(a+hash12(id)*TAU); }
      float map(vec3 p,out vec2 id){
        id=floor(p.xz/PITCH+.5); float d=1e9; vec2 g=id;
        vec3 q=vec3(p.x-id.x*PITCH,p.y-kh(id),p.z-id.y*PITCH);
        // Flat-topped pyramid: footprint shrinks with height, which is what gives each key its lit bevel.
        float h=sat((q.y+.12)/.30); vec2 b=vec2(mix(.478,.352,h));
        float s=sdBox2(q.xz,b)*.82; float top=abs(q.y+.4)-.58;
        d=smax(s,top,.02);
        return min(d,p.y+.28);
      }
      float map(vec3 p){ vec2 i; return map(p,i); }
      vec3 nor(vec3 p){ vec2 e=vec2(.004,0.); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx))); }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        vec3 ro=u_eye, rd=camRay(p); float d=4.2,h=0.; vec2 id;
        for(int i=0;i<96;i++){ vec3 q=ro+rd*d; h=map(q,id); if(h<.002||d>12.) break;
          // Each cell only knows its own key, so never step further than the cell border.
          vec2 b=abs(q.xz-id*PITCH); float lim=q.y>.34?(q.y-.30)/max(-rd.y,.05):PITCH*.5-max(b.x,b.y)+.035; d+=min(h*.85,max(lim,.03)); }
        vec3 q=ro+rd*d; vec3 n=nor(q); map(q,id);
        float a=TAU*u_phase;
        float sweep=snoise(vec3(q.xz*.26+vec2(cos(a),sin(a))*.5,1.7+sin(a)*.25))*.5+.5;
        float keyLit=snoise(vec3(id*.55+vec2(cos(a),sin(a))*.4,sin(a)*.4))*.5+.5;
        float side=smoothstep(.05,.9,abs(p.x)/u_aspect+.18*sweep);
        vec2 l=vec2(q.x-id.x*PITCH,q.z-id.y*PITCH);
        float tone,flag=0.; vec3 col;
        if(q.y<-.24){ tone=.0; col=vec3(.5); }
        else if(n.y>.82){ // face: brighter towards one corner, like a dished cap
          float dish=.55+.75*smoothstep(-.35,.35,-l.x*.8+l.y*.5);
          tone=mix(.22,.86,smoothstep(.28,.78,keyLit*.6+sweep*.4))*dish*mix(.62,1.1,side); tone=.47*(1.-exp(-tone*2.1));  // stays under the box threshold
          col=mix(vec3(.60,.61,.70),vec3(.92,.93,.98),tone*2.);
        } else {
          float k=dot(n.xz,normalize(vec2(.55,-.83)));
          float rim=smoothstep(.02,.6,k);
          float hgt=smoothstep(-.26,.12,q.y-kh(id));
          float g=smoothstep(.15,.75,sweep*.7+keyLit*.4);
          float topE=smoothstep(.2,.6,-n.z), rightE=smoothstep(.2,.6,n.x);
          tone=(topE*mix(.22,1.5,hgt)*mix(.6,1.1,g)+rightE*mix(.12,.95,hgt)*mix(.55,1.1,g)+.05*hgt)*mix(.55,1.1,side);
          flag=.4; 
          float t=q.x*.55-q.z*.42+u_phase*2.+hash12(id)*.3;
          col=mix(vec3(.22,.36,1.),vec3(.88,.42,1.),.5+.5*sin(t*TAU*.6)); col=mix(col,vec3(.55,.88,1.),.5*pow(.5+.5*sin(t*TAU*1.1+1.),3.));
        }
        c.tone=sat(tone); c.color=col; c.flag=flag; c.depth=d/12.;
      }`,
  }],
  style: {
    cell: 6, mark: "glyph", gamma: 0.72, gain: 1.25,
    color: { by: "source", shade: 0.35, iridescence: 0.85 },
    glyph: { ramp: " ..::--++==**##", boxAbove: 0.7, weights: [500, 600, 700], fontScale: 1.22 },
  },
  bloom: { strength: 0.22, threshold: 0.35 },
  fade: { bottom: 0.18, hole: [0.5, 0.62, 0.36, 0.42], strength: 0.6 },
  pointer: { mode: "glow", radius: 190, strength: 0.9 },
});
