"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { reorderAlbumsAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type AlbumRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  published: boolean;
  visibility: string | null;
};

export function SortableAlbumList({ albums }: { albums: AlbumRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(albums);
  const [pending, startTransition] = useTransition();

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
    fd.set("order", JSON.stringify(next.map((i) => i.id)));
    startTransition(async () => {
      try {
        await reorderAlbumsAction(fd);
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (!items.length) {
    return <p className="text-sm opacity-60">No albums yet.</p>;
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="divide-y divide-[color:var(--color-ink)]/10 border-y border-[color:var(--color-ink)]/10">
            {items.map((album) => (
              <SortableAlbumRow key={album.id} album={album} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {pending && (
        <p className="mt-3 text-xs opacity-60">Saving order…</p>
      )}
    </div>
  );
}

function SortableAlbumRow({ album }: { album: AlbumRow }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: album.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 py-3 md:py-4 px-1 bg-[color:var(--color-bg)]",
        isDragging && "opacity-70 shadow-lg z-10 relative",
      )}
    >
      <button
        type="button"
        aria-label={`Drag to reorder ${album.name}`}
        className="touch-none p-2 -ml-1 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <Link
        href={`/admin/albums/${album.slug}`}
        className="flex-1 flex items-center justify-between gap-3 hover:opacity-60"
      >
        <div className="min-w-0">
          <span className="font-display tracking-[0.2em] text-sm block truncate">
            {album.name.toUpperCase()}
          </span>
          {album.description && (
            <p className="text-xs opacity-60 mt-1 line-clamp-1">
              {album.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {album.visibility === "private" && (
            <span className="text-[10px] font-display tracking-[0.2em] border border-[color:var(--color-ink)]/30 px-2 py-0.5">
              PRIVATE
            </span>
          )}
          <span className="text-xs opacity-60">
            {album.published ? "Published" : "Draft"}
          </span>
        </div>
      </Link>
    </li>
  );
}
