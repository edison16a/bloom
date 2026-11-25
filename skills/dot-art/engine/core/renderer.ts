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
