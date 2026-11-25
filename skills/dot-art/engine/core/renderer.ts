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

export class DotRenderer {
  readonly gl: GL;
  private scene: Scene;
  private w = 1; private h = 1; private dpr = 1;
  private cols = 1; private rows = 1; private cw = 8; private ch = 8; private ss = 2;
  private sceneT?: Target; private gridT?: Target; private screenT?: Target;
  private ageT: Target[] = []; private bloomT: Target[] = [];
  private sources: LoadedSource[] = [];
  private pResolve: Program; private pCell: Program; private pBlur: Program; private pCompose: Program; private pAge: Program;
  private atlas?: ReturnType<typeof buildAtlas>; private atlasTex?: WebGLTexture;
  private overlayTex?: WebGLTexture; private lutTex?: WebGLTexture; private overlayBuf?: Uint8Array;
  private empty: WebGLVertexArrayObject; private half: boolean;
  private pointer = { x: 0, y: 0, p: 0 };
  private lastT = -1; private disposed = false;

  constructor(readonly canvas: HTMLCanvasElement, scene: Scene, private opts: RendererOptions = {}) {
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) throw new Error("dot-art: WebGL2 is not available");
    this.gl = gl;
    this.half = !!gl.getExtension("EXT_color_buffer_float") || !!gl.getExtension("EXT_color_buffer_half_float");
    gl.getExtension("OES_texture_float_linear");
    this.scene = scene;
    this.pResolve = createProgram(gl, VS_FULL, RESOLVE_FS, "resolve");
    this.pCell = createProgram(gl, VS_FULL, CELL_FS, "cell");
    this.pBlur = createProgram(gl, VS_FULL, BLUR_FS, "blur");
    this.pCompose = createProgram(gl, VS_FULL, COMPOSE_FS, "compose");
    this.pAge = createProgram(gl, VS_FULL, AGE_FS, "age");
    this.empty = gl.createVertexArray()!;
    this.sources = scene.sources.map((s) => this.loadSource(s));
  }

  get grid() { return { cols: this.cols, rows: this.rows }; }
  /** Resolves once every texture has loaded. */
  ready: Promise<void> = Promise.resolve();

  private loadSource(src: Source): LoadedSource {
    const { gl } = this;
    const textures: Record<string, LoadedTexture> = {};
    const decls: string[] = [];
    const glslType = (v: unknown) => Array.isArray(v) ? `vec${v.length}` : "float";
    for (const [k, v] of Object.entries(src.uniforms ?? {}))
      decls.push(`uniform ${glslType(typeof v === "function" ? v(0) : v)} ${k};`);
    for (const [k, input] of Object.entries(src.textures ?? {})) {
      decls.push(`uniform sampler2D ${k}; uniform vec2 ${k}_size;`);
      textures[k] = this.loadTexture(input);
    }
    const d = decls.join("\n") + "\n";
    const geo = src.type === "surface" ? resolveGeometry(src.geometry) : undefined;
    const prog = src.type === "shader"
      ? createProgram(gl, VS_FULL, SHADER_FS(src.common ?? "", src.glsl, d), `scene "${this.scene.id}"`)
      : createProgram(gl, SURFACE_VS(src.common ?? "", src.glsl, d, !!geo), SURFACE_FS, `surface "${this.scene.id}"`);
    const vao = gl.createVertexArray()!; const buffers: WebGLBuffer[] = [];
    let count = 3, indexed = false;
    if (src.type === "surface") {
      count = Math.floor((src.count ?? 0) * (this.opts.quality ?? 1));
      if (geo) {
        gl.bindVertexArray(vao);
        const n = geo.position.length / 3;
        const attr = (i: number, data: Float32Array | undefined, size: number, fb: number[]) => {
          if (!data) { gl.disableVertexAttribArray(i); gl.vertexAttrib4f(i, fb[0], fb[1], fb[2], fb[3]); return; }
          const b = gl.createBuffer()!; buffers.push(b);
          gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(i); gl.vertexAttribPointer(i, size, gl.FLOAT, false, 0, 0);
        };
        attr(0, geo.position, 3, [0, 0, 0, 1]); attr(1, geo.normal, 3, [0, 0, 1, 0]);
        attr(2, geo.color, 3, [1, 1, 1, 1]); attr(3, geo.extra, 4, [0, 0, 0, 0]);
        count = n;
        if (src.triangles && geo.index) {
          const b = gl.createBuffer()!; buffers.push(b);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geo.index, gl.STATIC_DRAW);
          count = geo.index.length; indexed = true;
        }
        gl.bindVertexArray(null);
      }
    }
    return { src, prog, textures, vao, buffers, count, indexed };
  }

  private loadTexture(input: TextureInput): LoadedTexture {
    const { gl } = this;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const lin = input.linear === false ? gl.NEAREST : gl.LINEAR;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, lin);
    for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
    const lt: LoadedTexture = { tex, input, ready: false, size: [1, 1] };
    if ("data" in input) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, input.width, input.height, 0, gl.RED, gl.FLOAT, input.data);
      lt.ready = true; lt.size = [input.width, input.height];
    } else if ("src" in input) {
      const img = new Image(); img.crossOrigin = "anonymous"; img.decoding = "async";
      this.ready = Promise.all([this.ready, new Promise<void>((ok) => {
        img.onload = () => { if (!this.disposed) { lt.el = img; this.upload(lt, img); } ok(); };
        img.onerror = () => { this.opts.onError?.(new Error(`dot-art: could not load ${input.src}`)); ok(); };
      })]).then(() => {});
      img.src = input.src;
    } else {
      const el = typeof input.image === "function" ? input.image() : input.image;
      lt.el = el; this.upload(lt, el);
    }
    return lt;
  }

  private upload(lt: LoadedTexture, el: TexImageSource) {
    const { gl } = this;
    const v = el as HTMLVideoElement;
    if (typeof HTMLVideoElement !== "undefined" && el instanceof HTMLVideoElement && v.readyState < 2) return;
    gl.bindTexture(gl.TEXTURE_2D, lt.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, "flipY" in lt.input && lt.input.flipY === false ? false : true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, el);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    const a = el as unknown as { naturalWidth?: number; naturalHeight?: number; videoWidth?: number; videoHeight?: number; width: number; height: number };
    lt.size = [a.naturalWidth || a.videoWidth || a.width, a.naturalHeight || a.videoHeight || a.height];
    // Trilinear keeps a 4K photo stable when it is sampled at 120 columns.
    if (!lt.input.dynamic && lt.input.linear !== false) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
    lt.ready = true;
  }

  /** CSS size and device pixel ratio. */
  resize(width: number, height: number, dpr = 1) {
    const W = Math.max(1, Math.round(width * dpr)), H = Math.max(1, Math.round(height * dpr));
    if (W === this.w && H === this.h && dpr === this.dpr && this.sceneT) return;
    this.w = W; this.h = H; this.dpr = dpr;
    if (this.canvas.width !== W) this.canvas.width = W;
    if (this.canvas.height !== H) this.canvas.height = H;
    this.layout();
  }

  private layout() {
    const { gl, scene: { style } } = this;
    const [cx, cy] = Array.isArray(style.cell) ? style.cell : [style.cell, style.mark === "hex" ? style.cell * 0.866 : style.cell];
    // Whole device pixels: fractional cells shimmer.
    this.cw = Math.max(2, Math.round(cx * this.dpr)); this.ch = Math.max(2, Math.round(cy * this.dpr));
    this.cols = Math.ceil(this.w / this.cw); this.rows = Math.ceil(this.h / this.ch);
    this.ss = Math.max(1, Math.round((this.scene.samples ?? 2) * ((this.opts.quality ?? 1) < 0.6 ? 0.5 : 1)));
    this.freeTargets();
    this.sceneT = createTarget(gl, this.cols * this.ss, this.rows * this.ss, { count: 2, half: this.half, depth: true, linear: true });
    this.gridT = createTarget(gl, this.cols, this.rows, { count: 2, half: this.half, linear: style.angle ? true : true });
    if (style.glyph?.glitch) this.ageT = [0, 1].map(() => createTarget(gl, this.cols, this.rows, { half: this.half, linear: false }));
    if (this.scene.bloom) {
      this.screenT = createTarget(gl, this.w, this.h);
      const a = Math.max(1, Math.round(this.w / 5)), b = Math.max(1, Math.round(this.h / 5));
      const c = Math.max(1, Math.round(this.w / 14)), d = Math.max(1, Math.round(this.h / 14));
      this.bloomT = [createTarget(gl, a, b), createTarget(gl, a, b), createTarget(gl, c, d), createTarget(gl, c, d)];
    }
    if (style.mark === "glyph") {
      this.atlas = buildAtlas(this.cw, this.ch, style.glyph ?? {});
      if (this.atlasTex) gl.deleteTexture(this.atlasTex);
      this.atlasTex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, this.atlasTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.atlas.canvas);
      for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.NEAREST);
      for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
    }
    if (this.lutTex) { gl.deleteTexture(this.lutTex); this.lutTex = undefined; }
    if (this.overlayTex) { gl.deleteTexture(this.overlayTex); this.overlayTex = undefined; }
    if (this.scene.overlay) {
      this.overlayTex = gl.createTexture()!;
      this.overlayBuf = new Uint8Array(this.cols * this.rows * 4);
      gl.bindTexture(gl.TEXTURE_2D, this.overlayTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.cols, this.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.NEAREST);
    }
    this.lastT = -1;
  }

  /** Re-measure fonts. Call once web fonts have loaded. */
  refresh() { if (this.sceneT) this.layout(); }

  /** Pointer in CSS pixels from the canvas top-left; presence 0–1. */
  setPointer(x: number, y: number, presence: number) { this.pointer = { x: x * this.dpr, y: y * this.dpr, p: presence }; }

  private bind(unit: number, tex: WebGLTexture, loc: WebGLUniformLocation | null) {
    const { gl } = this; gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(loc, unit);
  }
  private full() { const { gl } = this; gl.bindVertexArray(this.empty); gl.drawArrays(gl.TRIANGLES, 0, 3); }

  render(time: number) {
    if (this.disposed || !this.sceneT || this.gl.isContextLost()) return;
    const { gl, scene } = this;
    const loop = scene.loop, t = ((time % loop) + loop) % loop, phase = t / loop;
    const W = this.cols * this.cw, H = this.rows * this.ch, aspect = W / H;
    const cam = resolveCamera(typeof scene.camera === "function" ? scene.camera(t, aspect) : scene.camera, aspect);

    // 1. Scene → supersampled grid
    const ST = this.sceneT;
    gl.bindFramebuffer(gl.FRAMEBUFFER, ST.fbo);
    gl.viewport(0, 0, ST.w, ST.h);
    gl.depthMask(true); gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let first = true;
    for (const s of this.sources) {
      const { prog, src } = s;
      gl.useProgram(prog.program);
      gl.uniform1f(prog.loc("u_time"), t); gl.uniform1f(prog.loc("u_phase"), phase); gl.uniform1f(prog.loc("u_loop"), loop);
      gl.uniform2f(prog.loc("u_grid"), this.cols, this.rows); gl.uniform2f(prog.loc("u_frame"), W, H);
      gl.uniform1f(prog.loc("u_aspect"), aspect); gl.uniform3fv(prog.loc("u_eye"), cam.eye);
      gl.uniformMatrix4fv(prog.loc("u_view"), false, cam.view); gl.uniformMatrix4fv(prog.loc("u_viewProj"), false, cam.viewProj);
      gl.uniform1f(prog.loc("u_stag"), staggered(scene.style) ? 1 : 0);
      gl.uniform2f(prog.loc("u_clip"), cam.near, cam.far);
      gl.uniform3f(prog.loc("u_pointer"), (this.pointer.x / this.w) * 2 - 1, 1 - (this.pointer.y / this.h) * 2, this.pointer.p);
      const v = cam.view;
      gl.uniform4fv(prog.loc("u_cam[0]"), [v[0], v[4], v[8], 0, v[1], v[5], v[9], 0, -v[2], -v[6], -v[10], 0, Math.tan((cam.fov * Math.PI) / 360), 0, 0, 0]);
      for (const [k, val] of Object.entries(src.uniforms ?? {})) {
        const x = typeof val === "function" ? val(t) : val, l = prog.loc(k);
        if (Array.isArray(x)) (gl as unknown as Record<string, (l: unknown, v: number[]) => void>)[`uniform${x.length}fv`](l, x);
        else gl.uniform1f(l, Number(x));
      }
      let unit = 0;
      for (const [k, lt] of Object.entries(s.textures)) {
        if (lt.input.dynamic && lt.el) this.upload(lt, lt.el);
        gl.uniform2f(prog.loc(k + "_size"), lt.size[0], lt.size[1]);
        this.bind(unit++, lt.tex, prog.loc(k));
      }
      if (src.type === "shader") {
        gl.disable(gl.DEPTH_TEST);
        if (first) gl.disable(gl.BLEND);
        else { gl.enable(gl.BLEND); src.blend === "add" ? gl.blendFunc(gl.ONE, gl.ONE) : gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); }
        this.full();
      } else {
        const add = src.blend === "add";
        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(!add);
        if (add) { gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); } else gl.disable(gl.BLEND);
        gl.uniform1i(prog.loc("u_count"), s.count); gl.uniform1f(prog.loc("u_px"), this.ss);
        gl.uniform1f(prog.loc("u_isPoint"), src.triangles ? 0 : 1); 
        // Light adds up per cell, so fewer rows (or more points) would read brighter. Normalise to 128 rows at full count, less when minAspect has pulled the camera back.
        const full = !src.triangles && src.count ? src.count / Math.max(1, s.count) : 1;
        gl.uniform1f(prog.loc("u_add"), add ? (src.triangles ? 1 : Math.min(8, Math.max(0.05, full * ((this.rows * (cam.minAspect > aspect ? aspect / cam.minAspect : 1)) / 128) ** 2))) : 0);
        gl.bindVertexArray(s.vao);
        if (src.triangles) { s.indexed ? gl.drawElements(gl.TRIANGLES, s.count, gl.UNSIGNED_INT, 0) : gl.drawArrays(gl.TRIANGLES, 0, s.count); }
        else gl.drawArrays(gl.POINTS, 0, s.count);
        gl.depthMask(true);
      }
      first = false;
    }
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);

    // 2. Resolve → one texel per cell
    const GT = this.gridT!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, GT.fbo); gl.viewport(0, 0, GT.w, GT.h);
    gl.useProgram(this.pResolve.program);
    this.bind(0, ST.tex[0], this.pResolve.loc("u_color")); this.bind(1, ST.tex[1], this.pResolve.loc("u_data"));
    gl.uniform1i(this.pResolve.loc("u_ss"), this.ss); gl.uniform1i(this.pResolve.loc("u_stagger"), staggered(scene.style) ? 1 : 0);
    gl.uniform1i(this.pResolve.loc("u_rows"), this.rows); gl.uniform1i(this.pResolve.loc("u_w"), ST.w); this.full();

    // 3. Cell age (glitch-in)
    if (this.ageT.length) {
      const [a, b] = this.ageT;
      gl.bindFramebuffer(gl.FRAMEBUFFER, b.fbo); gl.viewport(0, 0, b.w, b.h);
      gl.useProgram(this.pAge.program);
      this.bind(0, GT.tex[0], this.pAge.loc("u_color")); this.bind(1, a.tex[0], this.pAge.loc("u_prev"));
      gl.uniform1f(this.pAge.loc("u_now"), t); gl.uniform1f(this.pAge.loc("u_reset"), this.lastT < 0 ? 2 : t < this.lastT ? 1 : 0);
      this.full(); this.ageT = [b, a];
    }
    // Opening mid-loop must not scramble the whole frame.
    const coldStart = this.lastT < 0 && t > 0.2;
    this.lastT = t;

    // 4. Cells
    const out = this.screenT;
    gl.bindFramebuffer(gl.FRAMEBUFFER, out ? out.fbo : null); gl.viewport(0, 0, this.w, this.h);
    this.drawCells(t, phase, GT, coldStart);

    // 5. Bloom
    if (out && scene.bloom) {
      const bl = scene.bloom, [a1, a2, b1, b2] = this.bloomT, P = this.pBlur, r = bl.radius ?? 1;
      const bg = scene.background === "transparent" ? [0, 0, 0] : parseColor(scene.background);
      gl.useProgram(P.program);
      const pass = (src: WebGLTexture, dst: Target, sx: number, sy: number, isFirst: boolean) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo); gl.viewport(0, 0, dst.w, dst.h);
        this.bind(0, src, P.loc("u_tex")); gl.uniform2f(P.loc("u_step"), sx, sy);
        gl.uniform1f(P.loc("u_first"), isFirst ? 1 : 0); gl.uniform1f(P.loc("u_threshold"), bl.threshold ?? 0);
        gl.uniform3fv(P.loc("u_base"), bg as Vec3); this.full();
      };
      pass(out.tex[0], a1, r / a1.w / 1.6, 0, true); pass(a1.tex[0], a2, 0, r / a1.h / 1.6, false);
      pass(a2.tex[0], b1, r / b1.w, 0, false); pass(b1.tex[0], b2, 0, r / b1.h, false);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.w, this.h);
      gl.useProgram(this.pCompose.program);
      this.bind(0, out.tex[0], this.pCompose.loc("u_base")); this.bind(1, a2.tex[0], this.pCompose.loc("u_b1")); this.bind(2, b2.tex[0], this.pCompose.loc("u_b2"));
      gl.uniform1f(this.pCompose.loc("u_k"), bl.strength); this.full();
    }
  }

  private drawCells(t: number, phase: number, GT: Target, coldStart: boolean) {
    const { gl, scene, pCell: P } = this, st = scene.style, g = st.glyph ?? {}, L = P.loc;
    gl.useProgram(P.program);
    this.bind(0, GT.tex[0], L("u_color")); this.bind(1, GT.tex[1], L("u_data"));
    gl.uniform2f(L("u_res"), this.w, this.h); gl.uniform2f(L("u_cell"), this.cw, this.ch); gl.uniform2f(L("u_grid"), this.cols, this.rows);
    gl.uniform1f(L("u_time"), t); gl.uniform1f(L("u_phase"), phase); gl.uniform1f(L("u_dpr"), this.dpr);
    gl.uniform1i(L("u_mark"), MARKS.indexOf(st.mark));
    const size = st.size ?? (st.mark === "hex" || st.mark === "octagon" ? [0.9, 0.9] : st.mark === "pixel" ? [1, 1] : [0.72, 0.72]);
    gl.uniform2f(L("u_size"), size[0], size[1]); gl.uniform1f(L("u_round"), st.round ?? 0);
    gl.uniform1f(L("u_stagger"), staggered(st) ? 1 : 0);
    const an = ((st.angle ?? 0) * Math.PI) / 180; gl.uniform2f(L("u_rotCS"), Math.cos(an), Math.sin(an));
    gl.uniform3f(L("u_curve"), st.gain ?? 1, st.lift ?? 0, st.gamma ?? 1);
    gl.uniform1f(L("u_ghost"), st.ghost ?? 0); gl.uniform3fv(L("u_ghostColor"), parseColor(st.ghostColor ?? "#20263a"));
    const c = st.color ?? {}, by = st.dither ? "tone" : c.by ?? (c.stops ? "tone" : "source");
    const stops = st.dither ? st.dither.stops : c.stops ?? ["#000000", "#ffffff"];
    if (stops.length > 8) throw new Error(`dot-art: scene "${scene.id}" uses ${stops.length} colour stops, the maximum is 8`);
    gl.uniform1i(L("u_by"), ["source", "tone", "space", "mono"].indexOf(by)); gl.uniform1i(L("u_nStops"), stops.length);
    const flat = new Float32Array(24); stops.forEach((s, i) => flat.set(parseColor(s), i * 3)); gl.uniform3fv(L("u_stops"), flat);
    const da = ((c.angle ?? 0) * Math.PI) / 180; gl.uniform2f(L("u_dir"), Math.cos(da), Math.sin(da));
    gl.uniform1f(L("u_highlight"), c.highlight ?? 1); gl.uniform1f(L("u_shade"), c.shade ?? 1); gl.uniform1f(L("u_irid"), c.iridescence ?? 0);
    gl.uniform1i(L("u_dither"), st.dither?.type === "noise" ? 2 : 1); gl.uniform1f(L("u_jitter"), st.dither?.jitter ?? 0.18);
    const bands = new Float32Array(8).fill(1); st.dither?.bands?.forEach((b, i) => (bands[i] = b ? 1 : 0)); gl.uniform1fv(L("u_bands"), bands);
    const bg: Vec3 = scene.background === "transparent" ? [0, 0, 0] : parseColor(scene.background);
    gl.uniform4f(L("u_bg"), bg[0], bg[1], bg[2], scene.background === "transparent" ? 0 : 1);
    const f = scene.fade ?? {};
    gl.uniform4f(L("u_fade"), f.left ?? 0, f.right ?? 0, f.top ?? 0, f.bottom ?? 0);
    gl.uniform4fv(L("u_hole"), f.hole ?? [0, 0, 0, 0]); gl.uniform1f(L("u_fadeStrength"), f.strength ?? 0.8);
    gl.uniform3f(L("u_ptr"), this.pointer.x, this.pointer.y, this.pointer.p);
    const pm = scene.pointer; gl.uniform1i(L("u_ptrMode"), pm ? ["", "glow", "lens", "ripple"].indexOf(pm.mode) : 0);
    gl.uniform2f(L("u_ptrCfg"), (pm?.radius ?? 160) * this.dpr, pm?.strength ?? 1);

    if (st.mark === "glyph" && this.atlas) {
      const A = this.atlas, ids = (s: string, n: number) => { const a = [...s].slice(0, n).map(A.index); return a.length ? a : [0]; };
      this.bind(3, this.atlasTex!, L("u_atlas"));
      gl.uniform1f(L("u_detail"), g.detail ?? 0); gl.uniform1f(L("u_under"), g.under ?? 0);
      this.bind(8, this.sceneT!.tex[0], L("u_hiC")); this.bind(9, this.sceneT!.tex[1], L("u_hiD"));
      gl.uniform4i(L("u_at"), A.cols, A.rows, A.stride, (g.weights ?? [1, 1, 1]).length);
      const ramp = ids(g.ramp ?? " .·:-=+*#%@", 64); gl.uniform1i(L("u_nRamp"), ramp.length);
      const msg = g.message ? ids(g.message, 256) : []; gl.uniform1i(L("u_nMsg"), msg.length);
      gl.uniform1i(L("u_fill"), ["ramp", "hybrid", "message"].indexOf(g.fill ?? (g.message ? "hybrid" : "ramp")));
      gl.uniform1f(L("u_msgAbove"), g.messageAbove ?? 0.82);
      // A whole number of phrase repeats per loop keeps scrolling text seamless.
      const n = msg.length || 1, sc = g.scroll ? Math.sign(g.scroll) * Math.max(1, Math.round((Math.abs(g.scroll) * scene.loop) / n)) * n / scene.loop : 0;
      gl.uniform1f(L("u_scroll"), sc); gl.uniform1i(L("u_rowShift"), g.rowShift ?? 7);
      gl.uniform1iv(L("u_edgeT"), ids("|\\^/_", 8)); gl.uniform1f(L("u_edge"), g.edges ?? 0);
      gl.uniform1f(L("u_box"), g.boxAbove ?? 2); gl.uniform1f(L("u_glitch"), coldStart || t > (g.glitchUntil ?? Infinity) ? 0 : g.glitch ?? 0);
      const gt = ids(g.glitchChars ?? GLITCH, 64); gl.uniform1i(L("u_nGlitch"), gt.length);
      const lo = ids(g.looseChars ?? "abcdefghijklmnopqrstuvwxyz*+.", 64); gl.uniform1i(L("u_nLoose"), lo.length);
      this.bindLut([ramp, msg, gt, lo], L("u_lut"));
      if (this.ageT.length) this.bind(4, this.ageT[0].tex[0], L("u_age"));
      if (this.overlayTex && scene.overlay) {
        const buf = this.overlayBuf!; buf.fill(0);
        const list = scene.overlay(t, this.grid);
        for (const o of list) {
          if (o.col < 0 || o.row < 0 || o.col >= this.cols || o.row >= this.rows) continue;
          const i = (o.row * this.cols + o.col) * 4, n = A.index(o.char);
          buf[i] = n & 255; buf[i + 1] = n >> 8; buf[i + 2] = Math.round((o.tone ?? 1) * 255); const c = o.color;
          // Overlay colour travels in alpha as a 6x6x6 cube; 255 is white.
          buf[i + 3] = c ? 1 + Math.round(c[0] * 5) * 36 + Math.round(c[1] * 5) * 6 + Math.round(c[2] * 5) : 255;
        }
        this.bind(5, this.overlayTex, L("u_overlay"));
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.cols, this.rows, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        gl.uniform1f(L("u_hasOverlay"), list.length ? 1 : 0);
      } else gl.uniform1f(L("u_hasOverlay"), 0);
    }
    this.full();
  }

  /** Character tables live in a texture: some phones cap fragment uniforms at 224 vectors. */
  private bindLut(rows: number[][], loc: WebGLUniformLocation | null) {
    const { gl } = this;
    if (!this.lutTex) {
      this.lutTex = gl.createTexture()!;
      const buf = new Uint8Array(256 * 4 * 4);
      rows.forEach((r, y) => r.forEach((v, x) => { buf[(y * 256 + x) * 4] = v & 255; buf[(y * 256 + x) * 4 + 1] = v >> 8; }));
      gl.activeTexture(gl.TEXTURE6); gl.bindTexture(gl.TEXTURE_2D, this.lutTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.NEAREST);
    }
    this.bind(6, this.lutTex, loc);
  }

  private freeTargets() {
    const { gl } = this;
    [this.sceneT, this.gridT, this.screenT, ...this.ageT, ...this.bloomT].forEach((x) => deleteTarget(gl, x));
    this.sceneT = this.gridT = this.screenT = undefined; this.ageT = []; this.bloomT = [];
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    const { gl } = this;
    this.freeTargets();
    for (const s of this.sources) {
      gl.deleteProgram(s.prog.program); gl.deleteVertexArray(s.vao);
      s.buffers.forEach((b) => gl.deleteBuffer(b));
      Object.values(s.textures).forEach((x) => gl.deleteTexture(x.tex));
    }
    [this.pResolve, this.pCell, this.pBlur, this.pCompose, this.pAge].forEach((p) => gl.deleteProgram(p.program));
    if (this.atlasTex) gl.deleteTexture(this.atlasTex);
    if (this.overlayTex) gl.deleteTexture(this.overlayTex);
    if (this.lutTex) gl.deleteTexture(this.lutTex);
    gl.deleteVertexArray(this.empty);
  }
}
