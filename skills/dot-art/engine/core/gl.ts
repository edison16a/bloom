/** Thin WebGL2 helpers. No state tracking beyond what one renderer needs. */

export type GL = WebGL2RenderingContext;

export interface Program { program: WebGLProgram; loc: (name: string) => WebGLUniformLocation | null }

function numbered(src: string) { return src.split("\n").map((l, i) => `${String(i + 1).padStart(4)} ${l}`).join("\n"); }
