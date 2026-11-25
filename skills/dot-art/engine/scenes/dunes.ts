import { defineScene } from "../core/types";

/** Dot background. Raymarched dunes at golden hour, printed as merging octagons on an angled screen. */
export const dunes = defineScene({
  id: "dunes", title: "Dunes", loop: 10, background: "#1a0818", samples: 2,
  camera: (t) => ({ eye: [0, 1.75, 4.6], target: [0, 1.0, 0], fov: 44, near: 1, far: 24 }),
  sources: [{
    type: "shader",
    common: /* glsl */ `
      // Barchan profile: long windward slope, sharp lip, short slip face.
      float crest(float x){ float s=fract(x); return s<.72?pow(s/.72,1.5):pow(1.-(s-.72)/.28,1.25); }
      float H(vec2 p){
        float w=.50*sin(p.y*.42+.6)+.20*sin(p.y*.9-p.x*.2+1.7);
        float h=crest(p.x*.115+w*.42+p.y*.03-u_phase)*.85*(.6+.4*sin(p.y*.33+2.));
        h+=crest(p.x*.26-p.y*.12+w*.35+.4-u_phase)*.16;
        return h;
      }
      float rip(vec2 p){ return sin((p.x*2.4+sin(p.y*.9)*.9+.35*sin(p.y*2.7+p.x))*9.-TAU*u_phase*4.); }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        vec3 ro=u_eye, rd=camRay(p); vec3 sun=normalize(vec3(.40,.155,-1.));
        float d=.8; bool hit=false; float h;
        for(int i=0;i<130;i++){ vec3 q=ro+rd*d; h=q.y-H(q.xz); if(h<.0015*d){hit=true;break;} d+=max(h*.38,.008*d); if(d>24.) break; }
        float ang=acos(clamp(dot(rd,sun),-1.,1.)); float t;
        float sky=.30*exp(-max(rd.y,0.)*5.)+.05+.50*exp(-ang*4.2);
        if(hit){
          vec3 q=ro+rd*d; float e=.02+.006*d;
          vec2 g=vec2(H(q.xz+vec2(e,0.))-H(q.xz-vec2(e,0.)),H(q.xz+vec2(0.,e))-H(q.xz-vec2(0.,e)))/(2.*e);
          float nearK=exp(-d*.16); g+=vec2(.9,.15)*.14*rip(q.xz)*nearK;
          vec3 n=normalize(vec3(-g.x,1.,-g.y));
          float sh=1.,k=.06; for(int i=0;i<30;i++){ vec3 s=q+vec3(0.,.02,0.)+sun*k; float gg=s.y-H(s.xz); sh=min(sh,12.*gg/k+.25); if(sh<.02) break; k+=clamp(gg*.8,.04,.45); if(k>7.) break; }
          sh=sat(sh);
          float dif=sat(dot(n,sun)); float back=pow(sat(1.+dot(rd,n)),4.)*.25;
          t=.07+1.-exp(-dif*sh*1.75)+back*sh+.07*sat(n.y)+.07*sat(.5+rip(q.xz)*.5)*nearK;
          t=mix(t,sky*.9,1.-exp(-pow(d*.07,2.)));
        } else { t=sky; t=mix(t,1.15,smoothstep(.10,.088,ang)); }
        c.tone=sat(t); c.depth=d/24.;
      }`,
  }],
  style: { cell: 6, mark: "octagon", size: [0.22, 1.36], angle: 22, gamma: 1.0,
    color: { by: "tone", stops: ["#4a1440", "#98284f", "#e34a45", "#ff8c42", "#ffc56e", "#fff0cf"], shade: 0 } },
  pointer: { mode: "glow", radius: 180, strength: 0.4 },
});
