"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useRef, useState } from "react";
import SortableItem from "./SortableItem";
import { images as initialImages } from "../lib/images";
import clsx from "clsx";

const SortableImageGrid = () => {
  const [images, setImages] = useState(initialImages);
  const [activeId, setActiveId] = useState<string | null>(null);

  const favoriteInputRef = useRef<HTMLInputElement>(null!);
  const allInputRef = useRef<HTMLInputElement>(null!);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const activeItem = images.find((i) => i.id === active.id);
    const overItem = images.find((i) => i.id === over.id);
    if (!activeItem || !overItem) return;

    const isSameContainer = activeItem.favorite === overItem.favorite;

    if (isSameContainer) {
      const containerItems = images
        .filter((i) => i.favorite === activeItem.favorite)
        .sort((a, b) => a.order - b.order);

      const oldIndex = containerItems.findIndex((i) => i.id === active.id);
      const newIndex = containerItems.findIndex((i) => i.id === over.id);

      const reordered = [...containerItems];
      const [movedItem] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, movedItem);

      const updated = reordered.map((item, index) => ({ ...item, order: index }));
      const others = images.filter((i) => i.favorite !== activeItem.favorite);
      setImages([...others, ...updated]);
    } else {
      setImages((prev) => {
        const updated = prev.map((i) => {
          if (i.id === active.id) {
            const targetItems = prev
              .filter((x) => x.favorite !== i.favorite)
              .sort((a, b) => a.order - b.order);
            return {
              ...i,
              favorite: !i.favorite,
              order: targetItems.length,
            };
          }
          return i;
        });
        return updated;
      });
    }
  };

  const handleMultiAdd = (event: React.ChangeEvent<HTMLInputElement>, isFavorite: boolean) => {
    const files = event.target.files;
    if (!files) return;

    const nextOrderStart = images.filter((img) => img.favorite === isFavorite).length;

    const newImages = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      src: URL.createObjectURL(file),
      name: file.name,
      favorite: isFavorite,
      order: nextOrderStart + index,
    }));

    setImages((prev) => [...prev, ...newImages]);

    event.target.value = ""; 
  };

  const renderGrid = (title: string, isFavorite: boolean, inputRef: React.RefObject<HTMLInputElement>) => {
    const sectionItems = images
      .filter((i) => i.favorite === isFavorite)
      .sort((a, b) => a.order - b.order);

    return (
      <div className="flex-1 min-w-[300px] bg-white border border-gray-300 rounded-lg p-[14px] shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-[#fffc] hover:bg-white text-[black] text-base px-6 py-3 p-[5px] rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 border border-blue-200 cursor-pointer"
          >
            + Add Images
          </button>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={(e) => handleMultiAdd(e, isFavorite)}
          />
        </div>

        <SortableContext items={sectionItems.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-4">
            {sectionItems.map((item) => (
              <div
                key={item.id}
                className={clsx(activeId && activeId !== item.id && "opacity-30 blur-[1px]")}
              >
                <SortableItem
                  id={item.id}
                  src={item.src}
                  name={item.name}
                  isActive={activeId === item.id}
                  onDelete={() =>
                    setImages((prev) =>
                      prev.map((i) =>
                        i.id === item.id
                          ? {
                              ...i,
                              favorite: !i.favorite,
                              order: prev.filter((x) => x.favorite !== i.favorite).length,
                            }
                          : i
                      )
                    )
                  }
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap gap-x-[20px] gap-y-[40px] justify-center">
          {renderGrid("Favorite Images", true, favoriteInputRef)}
          {renderGrid("All Images", false, allInputRef)}
        </div>
      </DndContext>
    </div>
  );
};

export default SortableImageGrid;
