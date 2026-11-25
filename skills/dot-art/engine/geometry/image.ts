import type { ShaderSource, TextureInput } from "../core/types";

export interface ImageSourceOptions {
  /** URL, or a live element (image, canvas, video; pass `dynamic` for the last two). */
  src?: string;
  element?: TexImageSource | (() => TexImageSource);
  dynamic?: boolean;
  fit?: "cover" | "contain";
  /** Crop centre 0–1 (y down) and zoom. */
  focus?: [number, number];
  zoom?: number;
  /** Input levels: luma at which tone hits 0 and 1. */
  black?: number; white?: number;
  gamma?: number;
  /** Unsharp at a wide radius. The single biggest quality lever: separates subject from ground at low resolution. */
  local?: number;
  /** Glow along contours, so flat bright areas become lit outlines. */
  edge?: number;
  /** How much flat luma survives when edge is high. 1 = all, 0 = line art. */
  fill?: number;
  /** Measure contours on log luma, so dark-on-dark detail (a mast at dusk) glows as hard as a bright edge. Use it for night and low-key photos. */
  relative?: boolean;
  /** Extra glow on thin bars and lines: lattice, hair, wires. 0-1. */
  ridge?: number;
  invert?: boolean;
  /** Boost saturation when colour comes from the photo. */
  saturation?: number;
  /** Background colour key: pixels within `keyRange` of this colour drop out. */
  key?: [number, number, number]; keyRange?: number;
  /** drift = slow Ken Burns, sweep = a light band crosses, breathe = depth-of-tone parallax, none. */
  motion?: "none" | "drift" | "sweep" | "breathe" | "drift+sweep" | "reveal";
  /** Oval falloff: centre x,y and radii (0–1, y down). */
  oval?: [number, number, number, number];
}

/** Any photo, canvas or video as a dot scene. */
export function imageSource(o: ImageSourceOptions): ShaderSource {
  const tex: TextureInput = o.element ? { image: o.element, dynamic: o.dynamic } : { src: o.src! };
  const m = o.motion ?? "drift+sweep", f = o.focus ?? [0.5, 0.5], ov = o.oval ?? [0, 0, 0, 0], k = o.key ?? [0, 0, 0];
  return {
    type: "shader",
    textures: { u_img: tex },
    uniforms: {
      i_levels: [o.black ?? 0.03, o.white ?? 0.92, o.gamma ?? 1], i_detail: [o.local ?? 0.7, o.edge ?? 0, o.fill ?? 1],
      i_frame: [f[0], f[1], o.zoom ?? 1], i_fit: o.fit === "contain" ? 1 : 0, i_inv: o.invert ? 1 : 0, i_sat: o.saturation ?? 1.25, i_rel: [o.relative ? 1 : 0, o.ridge ?? 0],
      i_key: [k[0], k[1], k[2], o.key ? o.keyRange ?? 0.15 : 0], i_oval: ov,
      i_motion: [m.includes("drift") ? 1 : 0, m.includes("sweep") ? 1 : 0, m === "breathe" ? 1 : 0, m === "reveal" ? 1 : 0],
    },
    common: /* glsl */ `
      float lum(vec2 u,float lod){ return luma(textureLod(u_img,u,lod).rgb); }
      // Eight spread taps: a single high mip shows as square blocks.
      float ring(vec2 u,float lod){ float a=0., px=exp2(lod); for(int i=0;i<8;i++){ float th=TAU*(float(i)+.5)/8.; a+=lum(u+px*(i%2==0?1.:.5)*vec2(cos(th),sin(th))/u_img_size,max(lod-.8,0.)); } return a/8.; }
      vec2 fitUV(vec2 uv){
        float ia=u_img_size.x/u_img_size.y, r=u_aspect/ia; vec2 s=vec2(1.);
        if((i_fit<.5)==(r>1.)) s.y/=r; else s.x*=r;
        s/=i_frame.z; vec2 c=vec2(i_frame.x,1.-i_frame.y);
        c=mix(c,clamp(c,min(s*.5,.5),max(1.-s*.5,.5)),step(s,vec2(1.)));  // the crop never runs off the picture
        c=mix(c,vec2(.5),step(vec2(1.0001),s));
        return (uv-.5)*s+c;
      }`,
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        vec2 q=uv;
        if(i_motion.x>.5){ float a=TAU*u_phase; q=(q-.5)*(1.-.035*(.5-.5*cos(a)))+.5+.012*vec2(sin(a),cos(a)*.6-.6); }
        vec2 u=fitUV(q);
        if(i_fit>.5&&(u.x<0.||u.x>1.||u.y<0.||u.y>1.)){ c.alpha=0.; return; }
        float sc=u_img_size.x/u_grid.x*.5; float lod=max(0.,log2(max(sc,1.)));
        if(i_motion.z>.5){ float d0=lum(u,lod+3.); u+=vec2(sin(TAU*u_phase),cos(TAU*u_phase)*.5)*.010*(d0-.4); }
        u+=u_pointer.xy*u_pointer.z*.006*(lum(u,lod+3.)-.4);
        vec3 rgb=textureLod(u_img,u,lod).rgb; float l=luma(rgb);
        float wide=ring(u,lod+3.5)*.6+ring(u,lod+5.)*.4;
        vec2 e=1.3*exp2(lod)/u_img_size;
        float gx=lum(u+vec2(e.x,0.),lod)-lum(u-vec2(e.x,0.),lod), gy=lum(u+vec2(0.,e.y),lod)-lum(u-vec2(0.,e.y),lod);
        float ed=smoothstep(.04,.42,length(vec2(gx,gy))*1.6);
        float near=ring(u,lod+2.), halo=abs(near-ring(u,lod+3.6))*2.2;
        if(i_rel.x>.5){ float k=near+.06; ed=max(ed,smoothstep(.06,.55,length(vec2(gx,gy))/k*1.3)); }
        float rg=log(l+.05)-log(near+.05); float rdg=smoothstep(.07,.5,abs(rg))*i_rel.y;
        float t=l+(l-wide)*i_detail.x;
        t=(t-i_levels.x)/(i_levels.y-i_levels.x);
        if(i_inv>.5) t=1.-t;
        t=pow(sat(t),i_levels.z);
        t=t*i_detail.z+(ed+halo*.7)*i_detail.y+rdg;
        if(i_detail.y>0.&&t>.75) t=.75+.25*(1.-exp(-(t-.75)/.25));   // lamps keep their shape instead of clipping to a slab
        if(i_key.w>0.) t*=smoothstep(i_key.w*.6,i_key.w,distance(rgb,i_key.rgb));
        if(i_motion.y>.5){ // one diagonal light band per loop
          float s=fract(u_phase)*1.9-.45; float b=exp(-pow((uv.x*.86+uv.y*.28-s)/.11,2.));
          t*=1.+.55*b; t+=.05*b*step(.05,t);
        }
        if(i_motion.w>.5){ float n=vnoise(uv*u_grid*.5)*.5+vnoise(uv*9.)*.5; float k=min(seg(u_phase,.02,.4),1.-seg(u_phase,.82,.98)); t*=smoothstep(n-.15,n+.15,k*1.3-.15); }
        if(i_oval.z>0.){ vec2 f=vec2(uv.x,1.-uv.y); t*=1.-smoothstep(.75,1.05,length((f-i_oval.xy)/i_oval.zw)); }
        c.color=mix(vec3(l),rgb,i_sat)/max(.35,max(rgb.r,max(rgb.g,rgb.b))); c.tone=sat(t); c.alpha=1.; c.depth=1.-l;
      }`,
  };
}
