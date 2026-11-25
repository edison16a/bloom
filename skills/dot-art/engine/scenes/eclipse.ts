import { defineScene } from "../core/types";

/** Dot background. Totality: corona streamers, a diamond ring, and a limb that breathes. */
export const eclipse = defineScene({
  id: "eclipse", title: "Eclipse", loop: 10, background: "#030308", samples: 2,
  sources: [{
    type: "shader",
    glsl: /* glsl */ `
      void scene(vec2 uv,vec2 p,inout Cell c){
        vec2 q=p-vec2(.0,-.06); float r=length(q), th=atan(q.y,q.x); float R=.50;
        float a=TAU*u_phase; vec2 dir=q/max(r,1e-3);
        float x=(r-R)/R;
        // Streamers: noise on the circle, stretched outwards and sliding with the loop.
        float n=0.,amp=.6; 
        for(int i=0;i<4;i++){ float f=1.3*exp2(float(i)); n+=amp*snoise(vec3(dir*f*1.15+vec2(cos(a),sin(a))*.16, x*.32*f-.0)+vec3(0.,0.,float(i)*9.+.35*sin(a))); amp*=.55; }
        float stre=pow(sat(.52+.62*n),2.1);
        float polar=1.+.55*cos(th*2.);
        float cor=exp(-max(x,0.)*mix(3.6,1.35,stre))*(.20+1.15*stre)*polar*.72;
        cor+=exp(-max(x,0.)*16.)*.85;
        float fil=smoothstep(.62,.95,.5+.5*sin(th*44.+6.*snoise(vec3(dir*2.,x*.6))))*exp(-max(x,0.)*2.6)*.16;
        float inside=smoothstep(.006,-.006,r-R);
        float ring=exp(-pow((r-R)/.011,2.));
        float da=-.62+.16*sin(a); vec2 dp=vec2(cos(da),sin(da))*R; float dl=length(q-dp);
        float diamond=exp(-dl*dl*260.)*1.6+exp(-dl*9.)*.42+exp(-abs(dot(q-dp,vec2(sin(da),-cos(da))))*70.)*exp(-dl*5.)*.5;
        float earth=inside*.055*smoothstep(R,0.,length(q+vec2(.12,-.15)))*(.6+.6*vnoise(q*9.));
        float t=mix((cor+fil),earth,inside)+ring*(.55+.5*stre)+diamond*mix(1.,.45,inside);
        vec2 id=cellId(uv); float h=hash12(id); float tw=.4+.6*pow(.5+.5*sin(TAU*(u_phase*floor(1.+3.*hash12(id+9.))+h*7.)),2.);
        t+=step(.9965,h)*tw*.55*(1.-inside)*smoothstep(.5,0.,cor);
        c.tone=sat(t*smoothstep(2.3,.6,r));
        float k=sat(x*.75);
        vec3 col=ramp4(k,vec3(1.,.96,.86),vec3(1.,.66,.30),vec3(.86,.26,.42),vec3(.34,.20,.78));
        col=mix(col,vec3(1.,.97,.92),sat(diamond*.8)); if(inside>.5) col=mix(vec3(.36,.38,.62),col,sat(diamond+ring));
        c.color=mix(col,vec3(.75,.8,1.),step(.9965,h)*step(cor,.2));
      }`,
  }],
  style: { cell: 6, mark: "octagon", size: [0.1, 1.0], grid: "stagger", color: { by: "source", shade: 0.35 }, gamma: 0.95 },
  bloom: { strength: 0.55 },
  pointer: { mode: "ripple", radius: 180, strength: 0.6 },
});
