---
name: dot-art
description: Build animated dot art and text art for Next.js + TypeScript. Turns anything (an idea, a photo, a logo or SVG, a word, a .glb/.obj model) into a seamless, full-colour, looping asset drawn in hexagons, octagons, LED squares, halftone, ordered dither, or letters. Covers dot objects, dot images, dot backgrounds, text objects (3D things made of type, such as a flower of letters that blossoms), and text backgrounds (a phrase repeated into a surface). Also exports GIF, MP4, WebM and WebP. Use whenever the user asks for dot art, block/pixel/LED/halftone/dithered/ASCII/hexagon/honeycomb visuals, "made of dots", "made out of text", an animated hero background, a 3D logo in dots, or wants a photo or 3D model turned into dots, even if they do not name this skill.
---

# dot-art

A WebGL2 engine (no runtime dependencies) plus a way of working. You describe **what** is drawn with a little GLSL, a photo, a shape or a model. The engine renders it at low resolution into a grid, then draws each grid cell as a mark or a letter. Everything is deterministic and loops exactly.

```
source (3D points, raymarch, photo, model)  ->  grid of tone + colour  ->  marks or letters  ->  bloom
```
