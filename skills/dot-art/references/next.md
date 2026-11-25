# Next.js

`<DotArt>` is a client component. It creates nothing until it nears the viewport, pauses off screen and in hidden tabs, gives its WebGL context back after 4 s off screen (browsers allow about 16), restores on context loss, and shows `poster` under reduced motion.

| Prop | Default | |
|---|---|---|
| `scene` | | Scene or LazyScene. Define it at module scope; a new object rebuilds the pipeline |
| `style` | | Patch, e.g. `{ cell: 8 }`. Keep the object stable |
| `speed` `paused` | 1, false | |
| `time` | | Hold or scrub, in scene seconds |
| `fps` | display | 30 is fine for slow backgrounds |
| `maxDpr` | 2 | 1.5 saves 40% of fill on large heroes |
| `quality` | 1, or .6 on phones | fraction of procedural points |
| `interactive` | true | follows the window pointer, works behind content |
| `label` | | alt text. Without it the canvas is hidden from assistive tech |
| `className` `css` `fallback` `onReady` `onError` | | |

It fills its parent, so the parent needs a height.

## Pass ids from server components

Scenes hold functions, which cannot cross the server boundary.

```tsx
"use client";
import { DotArt } from "@/components/dot-art/react";
import { bloom } from "@/components/dot-art/scenes/bloom";
export const Flower = () => <DotArt scene={bloom} label="A pink flower made of letters" />;
```
