"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Film } from "@/content/films";
import styles from "./FilmPlayer.module.css";

const clock = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/**
 * Plays muted on a loop while on screen, like a preview. Hovering shows a play bar with the time,
 * a scrubbable progress bar and sound. Turning the sound on the first time restarts from the top.
 */
export function FilmPlayer({ film }: { film: Film }) {
  const ref = useRef<HTMLVideoElement>(null);
  const heard = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(film.seconds);
  const [hover, setHover] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  // Autoplay muted while on screen, pause when scrolled away.
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

  // A smooth progress bar: follow the video every frame while it plays.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      if (ref.current) setTime(ref.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const togglePlay = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, []);

  const toggleSound = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && !heard.current) {
      heard.current = true;
      video.currentTime = 0;
      void video.play();
    }
  }, []);

  const seek = (value: number) => {
    const video = ref.current;
    if (!video) return;
    video.currentTime = value;
    setTime(value);
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      className={`${styles.player} ${!playing || hover || keyboard ? styles.show : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={(e) => {
        setHover(false);
        // A click leaves focus on the slider or a button. Let the bar go once the mouse leaves.
        const active = document.activeElement;
        if (active instanceof HTMLElement && e.currentTarget.contains(active)) active.blur();
      }}
      onFocus={(e) => setKeyboard(e.target.matches(":focus-visible"))}
      onBlur={() => setKeyboard(false)}
    >
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
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || film.seconds)}
        onTimeUpdate={(e) => { if (!playing) setTime(e.currentTarget.currentTime); }}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      />
      <div className={styles.bar}>
        <button type="button" className={styles.icon} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          <Icon name={playing ? "pause" : "play"} size={18} />
        </button>
        <span className={styles.time} aria-hidden="true">{clock(time)} / {clock(duration)}</span>
        <input
          type="range"
          className={styles.seek}
          min={0}
          max={duration}
          step={0.01}
          value={time}
          onChange={(e) => seek(Number(e.currentTarget.value))}
          aria-label="Seek"
          aria-valuetext={`${clock(time)} of ${clock(duration)}`}
          style={{ "--p": `${progress}%` } as CSSProperties}
        />
        <button type="button" className={styles.icon} onClick={toggleSound} aria-label={muted ? "Turn sound on" : "Mute"}>
          <Icon name={muted ? "mute" : "volume"} size={18} />
        </button>
      </div>
    </div>
  );
}
