/** Thin WebGL2 helpers. No state tracking beyond what one renderer needs. */

export type GL = WebGL2RenderingContext;

export interface Program { program: WebGLProgram; loc: (name: string) => WebGLUniformLocation | null }

function numbered(src: string) { return src.split("\n").map((l, i) => `${String(i + 1).padStart(4)} ${l}`).join("\n"); }

export function createProgram(gl: GL, vs: string, fs: string, label: string): Program {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      const log = gl.getShaderInfoLog(s) ?? "";
      const line = Number(log.match(/ERROR: \d+:(\d+)/)?.[1] ?? 1);
      const near = numbered(src).split("\n").slice(Math.max(0, line - 4), line + 3).join("\n");
      throw new Error(`dot-art: ${label} ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader failed\n${log}\n${near}`);
    }
    return s;
  };
  const program = gl.createProgram()!;
  const v = make(gl.VERTEX_SHADER, vs), f = make(gl.FRAGMENT_SHADER, fs);
  gl.attachShader(program, v); gl.attachShader(program, f);
  ["a_pos", "a_nrm", "a_col", "a_extra"].forEach((n, i) => gl.bindAttribLocation(program, i, n));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost())
    throw new Error(`dot-art: ${label} link failed\n${gl.getProgramInfoLog(program)}`);
  gl.deleteShader(v); gl.deleteShader(f);
  const cache = new Map<string, WebGLUniformLocation | null>();
  return {
    program,
    loc: (n) => { if (!cache.has(n)) cache.set(n, gl.getUniformLocation(program, n)); return cache.get(n)!; },
  };
}

export interface Target { fbo: WebGLFramebuffer; tex: WebGLTexture[]; w: number; h: number; depth?: WebGLRenderbuffer }

export function createTarget(gl: GL, w: number, h: number, o: { count?: number; half?: boolean; depth?: boolean; linear?: boolean } = {}): Target {
  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  const tex: WebGLTexture[] = [], bufs: number[] = [];
  for (let i = 0; i < (o.count ?? 1); i++) {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texStorage2D(gl.TEXTURE_2D, 1, o.half ? gl.RGBA16F : gl.RGBA8, w, h);
    const f = o.linear === false ? gl.NEAREST : gl.LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t, 0);
    tex.push(t); bufs.push(gl.COLOR_ATTACHMENT0 + i);
  }
  gl.drawBuffers(bufs);
  let depth: WebGLRenderbuffer | undefined;
  if (o.depth) {
    depth = gl.createRenderbuffer()!;
    gl.bindRenderbuffer(gl.RENDERBUFFER, depth);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth);
  }
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return { fbo, tex, w, h, depth };
}
