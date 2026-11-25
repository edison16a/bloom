import { defineScene, type OverlayCell } from "dot-art";

/** Text background. One sentence fills a wet window; city lights glow behind it, and running drops bend the lines. */
const TEXT = "it rained all night and the city kept talking ";
const SHIFT = 17, CW = 5, CH = 9, LOOP = 12;

// Drops and lights are plain numbers shared by the shader (as a data texture) and the overlay (as JS), so both agree.
let seed = 11; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const DROPS = 34, LIGHTS = 24, W = 8;
const D = new Float32Array(DROPS * W), B = new Float32Array(LIGHTS * W);
for (let i = 0; i < DROPS; i++) {
  // x from the left edge, half width, phase, cycles per loop, trail length, wander seed, wander size
  const big = i % 3 === 0;
  D.set([((i * 0.618034) % 1) * 3.6 + (rnd() - 0.5) * 0.05, big ? 0.044 + 0.016 * rnd() : 0.016 + 0.008 * rnd(), rnd(), big ? 1 : rnd() < 0.5 ? 1 : 2, big ? 1.1 + 0.8 * rnd() : 0.5 + 0.5 * rnd(), rnd() * 40, 0.4 + rnd(), 0], i * W);
}
for (let i = 0; i < LIGHTS; i++) {
  const a = rnd(), near = i < 8, right = i % 4 !== 0;
  // x (-1..1 of the half width), y, radius, strength, hue, flicker, 0, 0
  B.set([right ? -0.15 + 1.1 * rnd() : -0.95 + 0.8 * rnd(), near ? -0.62 + 0.5 * rnd() : -0.30 + 0.75 * rnd() * rnd(), near ? 0.15 + 0.11 * a : 0.05 + 0.07 * a, (near ? 0.42 : 0.6) * (right ? 1 : 0.5), [0.05, 0.12, 0.2, 0.55, 0.9, 0.12][i % 6], 1 + Math.floor(rnd() * 3), 0, 0], i * W);
}
const TAU = Math.PI * 2, fract = (x: number) => x - Math.floor(x), ss = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const wanderX = (i: number, y: number, aspect: number) => -aspect + D[i * W] + 0.035 * D[i * W + 6] * (Math.sin(y * 3.1 + D[i * W + 5]) + 0.4 * Math.sin(y * 8.3 + D[i * W + 5] * 2));
const headY = (i: number, ph: number) => { const u = fract(ph * D[i * W + 3] + D[i * W + 2]); const s = u + 0.026 * Math.sin(TAU * u * 4) ; return 1.15 - (2.4 + D[i * W + 4]) * s; };
const lightAt = (x: number, y: number, aspect: number) => { let t = 0; for (let j = 0; j < LIGHTS; j++) { const o = j * W, d = Math.hypot(x - B[o] * aspect, y - B[o + 1]); t += B[o + 3] * (1 - ss(B[o + 2] * 0.8, B[o + 2] * 1.1, d)); } return t; };

export const rain = defineScene({
  id: "rain", title: "Rain", loop: LOOP, background: "#04050d", samples: 4, poster: 5,
  sources: [{
    type: "shader",
    textures: { u_drops: { data: D, width: W, height: DROPS, linear: false }, u_lights: { data: B, width: W, height: LIGHTS, linear: false } },
    common: /* glsl */ `
      #define DR(i,k) texelFetch(u_drops,ivec2(k,i),0).r
      #define LI(i,k) texelFetch(u_lights,ivec2(k,i),0).r
      vec3 hueOf(float h){ return h<.08?vec3(1.,.30,.22):h<.16?vec3(1.,.62,.24):h<.3?vec3(1.,.82,.52):h<.7?vec3(.22,.66,1.):vec3(1.,.28,.62); }
      vec4 city(vec2 q,float blur){ // rgb light, a = sum
        vec4 s=vec4(0.);
        for(int j=0;j<${LIGHTS};j++){ float r=LI(j,2), d=length(q-vec2(LI(j,0)*u_aspect,LI(j,1)));
          float k=1.-smoothstep(r*(1.-blur),r*(1.+blur),d); k*=mix(1.,.82+.3*smoothstep(0.,r,d),1.-blur);
          k*=LI(j,3)*(.86+.14*sin(TAU*(u_phase*LI(j,5)+float(j)*.37)));
          s+=vec4(hueOf(LI(j,4))*k,k); }
        float hz=exp(-pow((q.y+.36)*2.3,2.));
        float bx=q.x*5.5, id=floor(bx), bh=-.30+.36*hash11(id+4.)*(.5+.5*hash11(id+9.)); // tower blocks, barely there
        float blk=smoothstep(.03,-.03,q.y-bh)*smoothstep(-.75,-.5,q.y); vec2 wi=floor(vec2(bx*4.,q.y*22.)); float win=step(.72,hash12(wi+3.))*blk*.13*(1.-blur*.6);
        s+=vec4(vec3(.34,.24,.62)*hz*.26+vec3(1.,.72,.40)*win,hz*.12+win);
        return s; }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        vec4 bg=city(p,.75); float base=.085+.05*uv.y;
        vec3 col=vec3(.20,.27,.60)*base+bg.rgb*.8; float tone=base+bg.a*.78;
        float m=0.; vec4 rf=vec4(0.); float spec=0., dark=0.;
        for(int i=0;i<${DROPS};i++){
          float w=DR(i,1), L=DR(i,4), sd=DR(i,5); float u=fract(u_phase*DR(i,3)+DR(i,2)); float s=u+.026*sin(TAU*u*4.);
          float yh=1.15-(2.4+L)*s; float X=-u_aspect+DR(i,0)+.035*DR(i,6)*(sin(p.y*3.1+sd)+.4*sin(p.y*8.3+sd*2.));
          float dx=p.x-X, dy=p.y-yh; if(abs(dx)>w*3.||dy>L||dy<-w*3.) continue;
          float k=sat(dy/L), wd;
          float bead=smoothstep(-.5,.4,sin(p.y*34.+sd*7.)+.5*sin(p.y*61.+sd));
          if(dy<0.) wd=w*1.25*sqrt(max(1.-pow(dy/(w*1.9),2.),0.));
          else { wd=w*mix(1.25,.72,smoothstep(0.,w*5.,dy))*mix(1.,.55,k); wd*=mix(1.,mix(.25,1.,bead),smoothstep(.25,.7,k)); }
          if(wd<.002) continue;
          float e=dx/wd; float in_=smoothstep(1.08,.86,abs(e))*(1.-smoothstep(.7,1.,k)); if(in_<=0.) continue;
          // A drop is a fat little lens: it shows the scene flipped and wide.
          vec2 sp=vec2(X-e*.42,dy<w?p.y*.6-.2-(dy/w)*.22:p.y-.04*sin(e*2.)); vec4 r=city(sp,.16);
          float edge=smoothstep(.45,1.,abs(e));
          vec4 ad=vec4(r.rgb*1.7+vec3(.26,.40,.75)*.34,r.a*1.5+.24)*(1.-.34*edge*step(0.,e));
          if(in_>m){ m=in_; rf=ad; spec=smoothstep(.34,.0,abs(e+.5))*mix(.07,.70,smoothstep(w*3.,-w,dy))*(1.-.6*k)+.16*smoothstep(.5,.85,e)*smoothstep(1.05,.9,e)*smoothstep(w*3.,-w,dy); }
          dark=max(dark,smoothstep(1.9,1.,abs(e))*(1.-smoothstep(.6,1.,k)));
        }
        tone*=1.-.45*dark; col*=1.-.45*dark;
        col=mix(col,rf.rgb,m); tone=mix(tone,rf.a+.05,m); col+=vec3(.70,.86,1.)*spec; tone+=spec*.9;
        // Fine beads resting on the glass.
        vec2 g=p*vec2(13.,13.), gi=floor(g); vec4 h=hash41(gi.x*37.+gi.y*91.); vec2 gc=gi+.25+.5*h.xy; float rr=.05+.13*h.z*h.z;
        float life=pow(.5+.5*sin(TAU*(u_phase*floor(1.+2.*h.w)+h.x*5.)),.6); float gd=length(g-gc)/rr;
        if(h.w>.45&&m<.1){ float bd=smoothstep(1.,.7,gd)*life; vec4 r=city(p-(g-gc)*.5,.2); float lt=bd*(.10+.8*r.a+.35*smoothstep(.5,0.,length((g-gc)/rr-vec2(-.35,.35)))); tone+=lt; col+=(r.rgb+.12)*bd*.9; }
        c.tone=1.-exp(-max(tone,0.)*1.45); float mx=max(col.r,max(col.g,col.b)); c.color=mix(col/(mx+1e-4),vec3(1.),smoothstep(.9,1.8,mx)*.8);
      }`,
  }],
  // Letters inside a drop come from lines further down, set bolder: the lens bends each line it crosses.
  overlay: (t, { cols, rows }) => {
    const out: OverlayCell[] = [], ph = t / LOOP, aspect = (cols * CW) / (rows * CH), n = TEXT.length;
    for (let i = 0; i < DROPS; i++) {
      const o = i * W, w = D[o + 1], L = D[o + 4], yh = headY(i, ph); if (w < 0.03) continue;
      for (let row = 0; row < rows; row++) {
        const y = 1 - (2 * (row + 0.5)) / rows, dy = y - yh; if (dy < -w * 1.6 || dy > L * 0.62) continue;
        const X = wanderX(i, y, aspect), k = Math.max(0, dy / L), wd = w * (dy < w * 2 ? 1.25 : 1) * (1 - 0.45 * k);
        const c0 = Math.floor((((X - wd) / aspect) * 0.5 + 0.5) * cols), c1 = Math.ceil((((X + wd) / aspect) * 0.5 + 0.5) * cols);
        for (let col = Math.max(0, c0); col <= c1 && col < cols; col++) {
          const x = ((col + 0.5) / cols * 2 - 1) * aspect, e = (x - X) / wd; if (Math.abs(e) > 0.95) continue;
          const lift = dy < w * 3 ? 3 : 1, q = col + (row + lift) * SHIFT, ch = TEXT[((q % n) + n) % n];
          out.push({ col, row, char: ch, tone: Math.min(1, 0.36 + (1 - Math.exp(-1.5 * lightAt(X - e * 0.42, y, aspect))) * 0.85 + (dy < w * 3 ? 0.35 : 0)) * (1 - 0.45 * k) });
        }
      }
    }
    return out;
  },
  style: { cell: [CW, CH], mark: "glyph", gamma: 1.12, color: { by: "source", shade: 0.88 },
    glyph: { message: TEXT, fill: "message", rowShift: SHIFT, weights: [300, 500, 700], fontScale: 1, detail: 0.85, under: 0.3 } },
  bloom: { strength: 0.42 },
  pointer: { mode: "ripple", radius: 170, strength: 0.6 },
});
