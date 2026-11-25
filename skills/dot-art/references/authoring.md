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
