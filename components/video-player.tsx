"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  posterClassName?: string;
  autoPlayInView?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  rounded?: boolean;
  ariaLabel?: string;
};

export type VideoPlayerHandle = {
  play: () => void;
  pause: () => void;
  element: () => HTMLVideoElement | null;
};

export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(
  function VideoPlayer(
    {
      src,
      poster,
      className,
      posterClassName,
      autoPlayInView = false,
      loop = true,
      muted = true,
      controls = true,
      preload = "metadata",
      rounded = false,
      ariaLabel,
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [loaded, setLoaded] = useState(false);
    const [canPlay, setCanPlay] = useState(false);

    useImperativeHandle(ref, () => ({
      play: () => void videoRef.current?.play().catch(() => {}),
      pause: () => videoRef.current?.pause(),
      element: () => videoRef.current,
    }));

    useEffect(() => {
      if (!autoPlayInView) return;
      const el = wrapperRef.current;
      const video = videoRef.current;
      if (!el || !video) return;

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          }
        },
        { threshold: 0.35 },
      );
      io.observe(el);
      return () => io.disconnect();
    }, [autoPlayInView]);

    const togglePlay = useCallback(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) v.play().catch(() => {});
      else v.pause();
    }, []);

    const toggleMute = useCallback(() => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = !v.muted;
      setIsMuted(v.muted);
    }, []);

    return (
      <div
        ref={wrapperRef}
        className={cn(
          "relative overflow-hidden bg-black",
          rounded && "rounded-xl",
          className,
        )}
      >
        {poster && !loaded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            aria-hidden
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              posterClassName,
            )}
          />
        )}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload={preload}
          muted={isMuted}
          loop={loop}
          playsInline
          aria-label={ariaLabel}
          onLoadedData={() => setLoaded(true)}
          onCanPlay={() => setCanPlay(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={() => {
            const v = videoRef.current;
            if (v) setIsMuted(v.muted);
          }}
          className="h-full w-full object-cover"
        />

        {controls && (
          <div className="absolute bottom-0 inset-x-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 via-black/15 to-transparent px-4 py-3 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white transition"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 translate-x-[1px]" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white transition"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {!canPlay && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            aria-hidden
          >
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white/90" />
          </div>
        )}
      </div>
    );
  },
);
