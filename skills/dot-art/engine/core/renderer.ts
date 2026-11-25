import { buildAtlas } from "./atlas";
import { createProgram, createTarget, deleteTarget, VS_FULL, type GL, type Program, type Target } from "./gl";
import { AGE_FS, BLUR_FS, CELL_FS, COMPOSE_FS, RESOLVE_FS, SHADER_FS, SURFACE_FS, SURFACE_VS } from "./glsl";
import { parseColor, resolveCamera } from "./math";
import type { Mark, Scene, Source, TextureInput, Vec3 , Geometry } from "./types";

const MARKS: Mark[] = ["square", "hex", "octagon", "diamond", "plus", "cross", "line", "pixel", "glyph"];
const staggered = (s: Scene["style"]) => (s.grid ? s.grid === "stagger" : s.mark === "hex");
const GLITCH = "01<>[]{}=+*#%&$@?/\\|!;:~^";

interface LoadedTexture { tex: WebGLTexture; input: TextureInput; ready: boolean; size: [number, number]; el?: TexImageSource }
interface LoadedSource {
  src: Source; prog: Program; textures: Record<string, LoadedTexture>;
  vao: WebGLVertexArrayObject; buffers: WebGLBuffer[]; count: number; indexed: boolean;
}

export interface RendererOptions {
  /** Multiplies point counts and supersampling. 1 = full. 0.5 suits phones. */
  quality?: number;
  onError?: (e: Error) => void;
}

/** Renders one scene into one canvas. Deterministic: `render(t)` depends only on t (plus pointer and glitch history). */
const geoCache = new WeakMap<() => Geometry, Geometry>();
function resolveGeometry(g?: Geometry | (() => Geometry)): Geometry | undefined {
  if (typeof g !== "function") return g;
  let v = geoCache.get(g); if (!v) geoCache.set(g, (v = g())); return v;
}
