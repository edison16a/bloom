# Authoring scenes

```ts
defineScene({
  id, title, loop, background,             // background may be "transparent"
  sources: [ ... ],                        // drawn in order, depth-tested together
  style: { ... },                          // how cells become marks
  camera: { eye, target, fov, near, far, roll, minAspect } | (t, aspect) => ({...}),
  samples: 2,                              // supersampling per cell: 2 tiles, 3 raymarch or photo, 4 text objects
  bloom: { strength, radius, threshold },  // 0.2-0.6
  fade: { left, right, top, bottom, hole: [x, y, rx, ry], strength },
  pointer: { mode: "glow" | "lens" | "ripple", radius, strength },
  overlay: (t, { cols, rows }) => [{ col, row, char, tone, color }],   // typed text, glyph mark only, color is 0-1 rgb
  poster: 6.2,                             // still for reduced motion
})
```

## Hook 1: full-frame shader

```glsl
void scene(vec2 uv, vec2 p, inout Cell c)
// uv 0..1 (y up). p.y -1..1, p.x -aspect..aspect.
// Write c.color (linear-ish rgb), c.tone 0..1, c.alpha, c.depth 0..1, c.flag
```

Raymarch with `vec3 rd=camRay(p)` from `u_eye`. Set `c.alpha=0.` where empty so later sources show through.

## Hook 2: surface points

```glsl
void surface(int i, int n, vec4 rnd, inout Pt p)
// rnd.xy is low-discrepancy (even coverage): use it as surface coordinates. rnd.zw is random. rnd.w also decides which points `p.alpha` keeps, so use rnd.z for timing and velocity
// Write p.pos, p.nrm, p.color, p.tone, p.size (in cells: 1.3-1.8 for bodies, .6-.9 with more points for thin parts), p.alpha (stochastic), p.flag
// With geometry: p.pos p.nrm p.color p.extra arrive filled.
```

`count` 200k-400k for an object, 500k-700k with `samples: 4`. `blend: "add"` for light and streaks: then `p.alpha` is energy per point, .001-.1, and the engine keeps brightness the same at every canvas size. `triangles: true` draws indexed geometry solid. Geometry can be `() => Geometry`, built on first use: do that for anything heavy or that touches a canvas, so importing stays cheap and works in SSR.

Normals for a parametric surface: evaluate it at `q`, `q+du`, `q+dv`, cross the differences, then `faceView(n, pos)`.
