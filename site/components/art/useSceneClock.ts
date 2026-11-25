"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * A scene clock that starts part way into the loop. Scenes that build up from nothing, like the
 * flower, would otherwise show an empty frame first. Pauses off screen and in hidden tabs, and holds
 * on `still` for reduced motion.
 */
export function useSceneClock(start: number | undefined, loop: number, still: number): [RefObject<HTMLDivElement | null>, number | undefined] {
  const host = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<number | undefined>(start === undefined ? undefined : start);

  useEffect(() => {
    if (start === undefined) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setTime(still); return; }
    let raf = 0, last = 0, clock = start, visible = false;
    const tick = (ts: number) => {
      const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0;
      last = ts;
      clock = (clock + dt) % loop;
      setTime(clock);
      raf = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { rootMargin: "160px" });
    if (host.current) io.observe(host.current);
    document.addEventListener("visibilitychange", wake);
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", wake); };
  }, [start, loop, still]);

  return [host, time];
}
