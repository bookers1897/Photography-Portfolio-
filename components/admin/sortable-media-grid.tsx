"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, X } from "lucide-react";
import {
  deleteMediaAction,
  reorderMediaAction,
  setAlbumCoverAction,
  updateMediaAction,
} from "@/app/admin/actions";
import { storagePublicUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

type MediaRow = {
  id: string;
  type: "image" | "video";
  storage_path: string;
  poster_path: string | null;
  name: string;
  alt: string | null;
  width: number;
  height: number;
};

type Props = {
  items: MediaRow[];
  albumId: string;
  albumSlug: string;
  coverId: string | null;
};

export function SortableMediaGrid({
  items: initial,
  albumId,
  albumSlug,
  coverId,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [pendingOrder, startOrderTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);

    const fd = new FormData();
    fd.set("slug", albumSlug);
    fd.set("order", JSON.stringify(next.map((i) => i.id)));
    startOrderTransition(async () => {
      try {
        await reorderMediaAction(fd);
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (!items.length) {
    return (
      <p className="text-sm opacity-60">
        No media yet. Drop files above to upload.
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs opacity-60 mb-3">
        Long-press a tile (or click & drag the handle) to reorder. Tap the
        pencil to edit name &amp; alt text.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {items.map((m) => (
              <SortableMediaCard
                key={m.id}
                item={m}
                albumId={albumId}
                albumSlug={albumSlug}
                isCover={coverId === m.id}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {pendingOrder && (
        <p className="mt-3 text-xs opacity-60">Saving order…</p>
      )}
    </div>
  );
}

function SortableMediaCard({
  item,
  albumId,
  albumSlug,
  isCover,
}: {
  item: MediaRow;
  albumId: string;
  albumSlug: string;
  isCover: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [alt, setAlt] = useState(item.alt ?? "");
  const [savingEdit, startEditTransition] = useTransition();
  const router = useRouter();

  const url = storagePublicUrl(item.storage_path);
  const poster = item.poster_path ? storagePublicUrl(item.poster_path) : null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onSaveEdit = () => {
    const fd = new FormData();
    fd.set("id", item.id);
    fd.set("slug", albumSlug);
    fd.set("name", name);
    fd.set("alt", alt);
    startEditTransition(async () => {
      try {
        await updateMediaAction(fd);
        setEditing(false);
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative border border-[color:var(--color-ink)]/10 bg-[color:var(--color-surface)]",
        isDragging && "opacity-80 shadow-2xl z-10",
      )}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
      >
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={item.alt ?? item.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster ?? url}
            alt={item.alt ?? item.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        )}
        {item.type === "video" && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 font-display tracking-[0.2em]">
            VIDEO
          </span>
        )}
        {isCover && (
          <span className="absolute top-2 left-2 bg-[color:var(--color-ink)] text-[color:var(--color-surface)] text-[10px] px-2 py-0.5 font-display tracking-[0.2em]">
            COVER
          </span>
        )}

        <button
          type="button"
          aria-label={`Drag to reorder ${item.name}`}
          className="absolute bottom-2 left-2 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black/55 text-white touch-none cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          aria-label={editing ? "Close editor" : "Edit media"}
          onClick={() => setEditing((v) => !v)}
          className="absolute bottom-2 right-2 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black/55 text-white"
        >
          {editing ? (
            <X className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {editing ? (
        <div className="p-2 text-xs flex flex-col gap-2">
          <label className="block">
            <span className="block text-[10px] font-display tracking-[0.2em] opacity-70 mb-1">
              NAME
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[color:var(--color-ink)]/20 bg-[color:var(--color-bg)] px-2 py-1.5 text-base md:text-sm"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] font-display tracking-[0.2em] opacity-70 mb-1">
              ALT TEXT
            </span>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full border border-[color:var(--color-ink)]/20 bg-[color:var(--color-bg)] px-2 py-1.5 text-base md:text-sm"
            />
          </label>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setName(item.name);
                setAlt(item.alt ?? "");
                setEditing(false);
              }}
              className="text-[10px] font-display tracking-[0.2em] opacity-70 hover:opacity-100"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={onSaveEdit}
              disabled={savingEdit || !name.trim()}
              className="bg-[color:var(--color-ink)] text-[color:var(--color-surface)] text-[10px] font-display tracking-[0.2em] py-1.5 px-3 disabled:opacity-50"
            >
              {savingEdit ? "SAVING…" : "SAVE"}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2 text-xs flex flex-col gap-2">
          <span className="truncate">{item.name}</span>
          <div className="flex gap-2 flex-wrap">
            <form action={setAlbumCoverAction}>
              <input type="hidden" name="album_id" value={albumId} />
              <input type="hidden" name="media_id" value={item.id} />
              <input type="hidden" name="slug" value={albumSlug} />
              <button
                type="submit"
                disabled={isCover}
                className="text-[10px] font-display tracking-[0.2em] opacity-70 hover:opacity-100 disabled:opacity-30"
              >
                {isCover ? "IS COVER" : "SET COVER"}
              </button>
            </form>
            <form action={deleteMediaAction}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="slug" value={albumSlug} />
              <button
                type="submit"
                className="text-[10px] font-display tracking-[0.2em] text-red-700 opacity-80 hover:opacity-100"
              >
                DELETE
              </button>
            </form>
          </div>
        </div>
      )}
    </li>
  );
}
