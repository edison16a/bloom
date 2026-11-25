"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { DotRenderer } from "../core/renderer";
import type { LazyScene, Scene, Style } from "../core/types";

export interface DotArtProps {
  /** A scene, or a lazy one (3D models). Define it outside the component, or memoise it: a new object means a full rebuild. */
  scene: Scene | LazyScene;
  /** Patch the style without writing a new scene, e.g. `{ cell: 8 }`. Keep the object stable between renders. */
  style?: Partial<Style>;
  className?: string;
  css?: CSSProperties;
  /** Playback speed. Default 1. */
  speed?: number;
  /** Hold a single moment, in scene seconds. Use it to scrub with scroll. */
  time?: number;
  paused?: boolean;
  /** Upper bound on device pixel ratio. Default 2. */
  maxDpr?: number;
  /** 0.3–1. Fraction of procedural points drawn. Default: 1, or 0.6 on small touch screens. */
  quality?: number;
  /** Respond to the pointer. Default true. Tracks the window, so it works behind other content. */
  interactive?: boolean;
  /** Frames per second cap. Default: display rate. */
  fps?: number;
  /** Accessible description. Without it the canvas is treated as decoration. */
  label?: string;
  /** Shown if WebGL2 is missing. */
  fallback?: ReactNode;
  onReady?: () => void;
  onError?: (e: Error) => void;
}

/** Full-size animated dot canvas. Fills its parent, pauses off screen, and respects reduced motion. */
export function DotArt({
  scene, style, className, css, speed = 1, time, paused = false, maxDpr = 2, quality, interactive = true, fps, label, fallback, onReady, onError,
}: DotArtProps) {
  const host = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [failed, setFailed] = useState(false);
  // Live props are read through a ref so changing them never rebuilds the GL pipeline.
  const live = useRef({ speed, time, paused, fps, interactive, onReady, onError });
  live.current = { speed, time, paused, fps, interactive, onReady, onError };
  const wake = useRef<() => void>(() => {});
  useEffect(() => { wake.current(); }, [speed, time, paused, fps]);

  useEffect(() => {
    const el = host.current; if (!el) return;
    let dead = false, renderer: DotRenderer | null = null, raf = 0, clock = 0, last = 0, drawn = 0;
    let visible = false, started = false, resolved: Scene | null = "sources" in scene ? scene : null;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let canvas: HTMLCanvasElement | null = null, idle: ReturnType<typeof setTimeout> | undefined;
    setShown(false); setFailed(false);

    const fail = (e: unknown) => {
      if (dead) return; const err = e instanceof Error ? e : new Error(String(e));
      setFailed(true); live.current.onError?.(err); if (!live.current.onError) console.error(err);
    };
    const size = () => { const r = el.getBoundingClientRect(); return { w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height)) }; };
    const still = () => reduce.matches || live.current.time !== undefined || live.current.paused;
    const now = () => live.current.time ?? (reduce.matches ? resolved?.poster ?? (resolved?.loop ?? 0) / 2 : clock);

    const draw = () => {
      if (!renderer) return;
      const k = 0.14; ptr.x += (ptr.tx - ptr.x) * k; ptr.y += (ptr.ty - ptr.y) * k; ptr.on += (ptr.ton - ptr.on) * 0.08;
      renderer.setPointer(ptr.x, ptr.y, ptr.on);
      try { renderer.render(now()); } catch (e) { fail(e); }
    };
    const tick = (ts: number) => {
      raf = 0; if (dead || !renderer) return;
      const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0; last = ts;
      if (!still()) clock += dt * live.current.speed;
      const cap = live.current.fps;
      if (!cap || ts - drawn >= 1000 / cap - 2) { drawn = ts; draw(); }
      const settling = Math.abs(ptr.ton - ptr.on) > 0.01 || Math.hypot(ptr.tx - ptr.x, ptr.ty - ptr.y) > 0.5;
      if (visible && !document.hidden && (!still() || settling)) raf = requestAnimationFrame(tick); else last = 0;
    };
    const kick = () => { if (!raf && renderer && visible && !document.hidden) raf = requestAnimationFrame(tick); };
    wake.current = kick;

    const resize = () => {
      if (!renderer) return; const { w, h } = size();
      renderer.resize(w, h, Math.min(maxDpr, window.devicePixelRatio || 1)); draw();
    };
    // Browsers allow about 16 live WebGL contexts, so a canvas that has been off screen for a while gives its one back.
    const lost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; };
    const restored = () => { release(); void start(); };
    const release = () => {
      cancelAnimationFrame(raf); raf = 0; started = false; if (!canvas) return;
      canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restored);
      const gl = renderer?.gl; renderer?.dispose(); renderer = null; gl?.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove(); canvas = null;
    };
    const start = async () => {
      if (started || dead) return; started = true;
      try {
        if (!resolved) resolved = await (scene as LazyScene).load();
        if (dead || !visible) { started = false; return; }
        canvas = document.createElement("canvas");
        Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
        canvas.addEventListener("webglcontextlost", lost); canvas.addEventListener("webglcontextrestored", restored);
        el.appendChild(canvas);
        const s: Scene = style ? { ...resolved, style: { ...resolved.style, ...style } } : resolved;
        const small = matchMedia("(pointer: coarse)").matches && Math.min(screen.width, screen.height) < 820;
        renderer = new DotRenderer(canvas, s, { quality: quality ?? (small ? 0.6 : 1), onError: fail });
        const mine = renderer; resize(); await mine.ready; if (dead || renderer !== mine) return;
        draw(); setShown(true); live.current.onReady?.(); kick();
        // Web fonts usually land after first paint; redraw the glyph atlas once they do.
        if (s.style.mark === "glyph") document.fonts?.ready.then(() => { if (renderer === mine) { mine.refresh(); draw(); } });
      } catch (e) { fail(e); }
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; clearTimeout(idle);
      if (visible) { void start(); kick(); } else idle = setTimeout(() => { if (!visible) { release(); setShown(false); } }, 4000);
    }, { rootMargin: "160px" });
    const ro = new ResizeObserver(() => resize());
    const move = (e: PointerEvent) => {
      if (!live.current.interactive || e.pointerType === "touch") return;
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (inside && ptr.on < 0.02) { ptr.x = x; ptr.y = y; }
      if (inside) { ptr.tx = x; ptr.ty = y; } ptr.ton = inside ? 1 : 0; kick();
    };
    io.observe(el); ro.observe(el);
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", kick); reduce.addEventListener("change", kick);

    return () => {
      dead = true; clearTimeout(idle); io.disconnect(); ro.disconnect();
      removeEventListener("pointermove", move); document.removeEventListener("visibilitychange", kick); reduce.removeEventListener("change", kick);
      release(); wake.current = () => {};
    };
  }, [scene, style, maxDpr, quality]);

  return (
    <div
      ref={host} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: scene.background, ...css }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: scene.background, opacity: shown ? 0 : 1, transition: "opacity .6s ease" }}>
        {failed ? fallback : null}
      </div>
    </div>
  );
}
