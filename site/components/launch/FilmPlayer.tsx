"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Film } from "@/content/films";
import styles from "./FilmPlayer.module.css";

/**
 * Plays muted on a loop while on screen, like a preview. "Play with sound" restarts it from the top
 * with sound, the way a person would want to watch a launch film.
 */
export function FilmPlayer({ film }: { film: Film }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce && video.muted) void video.play().catch(() => {});
      else if (!entry.isIntersecting) video.pause();
    }, { threshold: 0.35 });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const togglePlay = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const withSound = () => {
    const video = ref.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      video.currentTime = 0;
      void video.play();
    } else video.muted = true;
  };

  return (
    <div className={styles.player}>
      <video
        ref={ref}
        className={styles.video}
        src={film.src}
        poster={film.poster}
        width={film.width}
        height={film.height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={film.title}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      />
      <div className={styles.controls}>
        <button type="button" className={styles.control} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          <Icon name={playing ? "pause" : "play"} />
        </button>
        <button type="button" className={styles.control} onClick={withSound}>
          <Icon name={muted ? "volume" : "mute"} />
          {muted ? "Play with sound" : "Mute"}
        </button>
      </div>
    </div>
  );
}
