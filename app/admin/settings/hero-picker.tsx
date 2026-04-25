"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { MediaItem } from "@/lib/portfolio";
import { setHeroAction } from "./actions";
import { cn } from "@/lib/utils";

type Props = {
  images: MediaItem[];
  initial: {
    heroMediaId: string | null;
    focalX: number;
    focalY: number;
    overlay: number;
  };
};

export function HeroPicker({ images, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.heroMediaId ??
      images.find((m) => m.type === "image")?.id ??
      null,
  );
  const [focalX, setFocalX] = useState(initial.focalX);
  const [focalY, setFocalY] = useState(initial.focalY);
  const [overlay, setOverlay] = useState(initial.overlay);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const selected = useMemo(
    () => images.find((m) => m.id === selectedId) ?? null,
    [images, selectedId],
  );

  const previewRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFocalFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const el = previewRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setFocalX(Math.max(0, Math.min(100, x)));
      setFocalY(Math.max(0, Math.min(100, y)));
    },
    [],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      updateFocalFromEvent(e.clientX, e.clientY);
    },
    [updateFocalFromEvent],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updateFocalFromEvent(e.clientX, e.clientY);
    },
    [updateFocalFromEvent],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 5 : 1;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setFocalX((v) => Math.max(0, v - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setFocalX((v) => Math.min(100, v + step));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocalY((v) => Math.max(0, v - step));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocalY((v) => Math.min(100, v + step));
    }
  }, []);

  const onSave = useCallback(() => {
    const fd = new FormData();
    fd.set("hero_media_id", selectedId ?? "");
    fd.set("focal_x", String(focalX.toFixed(2)));
    fd.set("focal_y", String(focalY.toFixed(2)));
    fd.set("overlay", String(overlay.toFixed(3)));
    startTransition(async () => {
      try {
        await setHeroAction(fd);
        setSavedAt(Date.now());
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  }, [focalX, focalY, overlay, router, selectedId]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <section className="space-y-4">
        <div>
          <h3 className="font-display tracking-[0.2em] text-sm">PICK IMAGE</h3>
          <p className="text-xs opacity-60 mt-1">
            Choose any uploaded photo. Videos can&apos;t be hero images.
          </p>
        </div>

        {images.length === 0 ? (
          <p className="text-sm opacity-60 border border-dashed border-[color:var(--color-ink)]/20 p-6">
            No images uploaded yet. Upload some in an album first.
          </p>
        ) : (
          <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto pr-1">
            {images.map((m) => {
              const isSelected = selectedId === m.id;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(m.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "block w-full aspect-square overflow-hidden border transition",
                      isSelected
                        ? "border-[color:var(--color-ink)] ring-2 ring-[color:var(--color-ink)]"
                        : "border-[color:var(--color-ink)]/15 hover:border-[color:var(--color-ink)]/50",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.src}
                      alt={m.alt ?? m.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="font-display tracking-[0.2em] text-sm">
            ADJUST &amp; PREVIEW
          </h3>
          <p className="text-xs opacity-60 mt-1">
            Click or drag on the preview to set the focal point. Arrow keys
            nudge by 1% (hold Shift for 5%).
          </p>
        </div>

        {selected ? (
          <>
            <div
              ref={previewRef}
              role="application"
              aria-label="Hero focal point"
              tabIndex={0}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onKeyDown={onKeyDown}
              className="relative w-full aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-[color:var(--color-surface)] cursor-crosshair touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ink)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.src}
                alt={selected.alt ?? selected.name}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                style={{ objectPosition: `${focalX}% ${focalY}%` }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black"
                style={{ opacity: overlay }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.4)] bg-white/20 backdrop-blur-[1px]"
                style={{ left: `${focalX}%`, top: `${focalY}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-display tracking-[0.2em]">
              <div className="border border-[color:var(--color-ink)]/15 p-3">
                <span className="opacity-60">FOCAL X</span>
                <span className="block mt-1 text-base">
                  {focalX.toFixed(0)}%
                </span>
              </div>
              <div className="border border-[color:var(--color-ink)]/15 p-3">
                <span className="opacity-60">FOCAL Y</span>
                <span className="block mt-1 text-base">
                  {focalY.toFixed(0)}%
                </span>
              </div>
            </div>

            <label className="block">
              <span className="block text-xs font-display tracking-[0.2em] mb-2 opacity-80">
                OVERLAY DARKNESS — {Math.round(overlay * 100)}%
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={overlay}
                onChange={(e) => setOverlay(Number(e.target.value))}
                className="w-full"
              />
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onSave}
                disabled={pending || !selectedId}
                className="bg-[color:var(--color-ink)] text-[color:var(--color-surface)] py-2 px-6 font-display tracking-[0.25em] text-xs disabled:opacity-50"
              >
                {pending ? "SAVING…" : "SAVE HERO"}
              </button>
              {savedAt && !pending && (
                <span className="text-xs opacity-60">Saved.</span>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm opacity-60 border border-dashed border-[color:var(--color-ink)]/20 p-6">
            Select an image on the left to preview.
          </p>
        )}
      </section>
    </div>
  );
}
