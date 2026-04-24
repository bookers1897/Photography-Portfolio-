"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { insertMediaAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Props = {
  albumId: string;
  albumSlug: string;
};

type QueueItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error("Could not read image dimensions."));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function readVideoDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight });
      };
      video.onerror = () =>
        reject(new Error("Could not read video metadata."));
      video.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

const ALLOWED_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".mp4",
  ".webm",
  ".mov",
]);

function safeExt(name: string, fallback: string) {
  const dot = name.lastIndexOf(".");
  if (dot < 0) return fallback;
  const raw = name.slice(dot).toLowerCase();
  if (!/^\.[a-z0-9]{1,8}$/.test(raw)) return fallback;
  return ALLOWED_EXTS.has(raw) ? raw : fallback;
}

export function MediaDropzone({ albumId, albumSlug }: Props) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const uploadOne = useCallback(
    async (item: QueueItem) => {
      const supabase = createSupabaseBrowserClient();
      const isImage = IMAGE_TYPES.includes(item.file.type);
      const isVideo = VIDEO_TYPES.includes(item.file.type);

      if (!isImage && !isVideo) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error", error: "Unsupported file type" }
              : i,
          ),
        );
        return;
      }

      try {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "uploading", progress: 5 } : i,
          ),
        );

        const dims = isImage
          ? await readImageDimensions(item.file)
          : await readVideoDimensions(item.file);

        const ext = safeExt(item.file.name, isImage ? ".jpg" : ".mp4");
        const storagePath = `${albumId}/${Date.now()}-${randomId()}${ext}`;

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, progress: 25 } : i,
          ),
        );

        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(storagePath, item.file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: item.file.type,
          });
        if (upErr) throw upErr;

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, progress: 80 } : i,
          ),
        );

        const niceName = item.file.name.replace(/\.[^.]+$/, "");

        await insertMediaAction(albumSlug, {
          album_id: albumId,
          type: isImage ? "image" : "video",
          storage_path: storagePath,
          name: niceName,
          width: dims.width,
          height: dims.height,
        });

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "done", progress: 100 } : i,
          ),
        );
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "error", error: msg } : i,
          ),
        );
      }
    },
    [albumId, albumSlug],
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const queued: QueueItem[] = [];
      for (const file of Array.from(files)) {
        queued.push({
          id: randomId(),
          file,
          previewUrl: URL.createObjectURL(file),
          status: "pending",
          progress: 0,
        });
      }
      setItems((prev) => [...prev, ...queued]);
      for (const q of queued) void uploadOne(q);
    },
    [uploadOne],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const allDone = items.length > 0 && items.every((i) => i.status === "done");

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed cursor-pointer px-6 py-12 text-center transition",
          dragOver
            ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)]/5"
            : "border-[color:var(--color-ink)]/30 hover:border-[color:var(--color-ink)]/60",
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <p className="font-display tracking-[0.25em] text-sm">
          DROP FILES HERE
        </p>
        <p className="text-xs opacity-60 mt-2">
          or click to choose — images (jpg, png, webp, avif) or video (mp4,
          webm)
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(",")}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((i) => (
            <li
              key={i.id}
              className="relative border border-[color:var(--color-ink)]/10 bg-[color:var(--color-surface)] overflow-hidden"
            >
              <div className="relative aspect-square">
                {i.file.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={i.previewUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={i.previewUrl}
                    muted
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[color:var(--color-ink)]/10">
                  <div
                    className={cn(
                      "h-full transition-all",
                      i.status === "error"
                        ? "bg-red-700"
                        : "bg-[color:var(--color-ink)]",
                    )}
                    style={{ width: `${i.progress}%` }}
                  />
                </div>
              </div>
              <div className="p-2 text-[11px]">
                <p className="truncate">{i.file.name}</p>
                <p
                  className={cn(
                    "mt-0.5 font-display tracking-[0.2em]",
                    i.status === "error"
                      ? "text-red-700"
                      : i.status === "done"
                        ? "opacity-60"
                        : "opacity-80",
                  )}
                >
                  {i.status === "uploading" && "UPLOADING…"}
                  {i.status === "done" && "DONE"}
                  {i.status === "pending" && "QUEUED"}
                  {i.status === "error" && (i.error ?? "ERROR")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {allDone && (
        <button
          type="button"
          onClick={() => {
            setItems([]);
            router.refresh();
          }}
          className="bg-[color:var(--color-ink)] text-[color:var(--color-surface)] py-2 px-6 font-display tracking-[0.25em] text-xs"
        >
          REFRESH GALLERY
        </button>
      )}
    </div>
  );
}
