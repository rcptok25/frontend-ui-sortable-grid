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
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useState } from "react";
import SortableItem from "./SortableItem";
import { images as initialImages } from "../lib/images";
import clsx from "clsx";

const SortableImageGrid = () => {
  const [items, setItems] = useState(initialImages);
  const [activeId, setActiveId] = useState<number | string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event?.active?.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over?.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto border border-gray-300 rounded-lg bg-white p-6 shadow w-[80%]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-4 justify-start">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={clsx(
                    activeId && activeId !== item.id && "opacity-30 blur-[1px]"
                  )}
                >
                  <SortableItem
                    id={item.id}
                    src={item.src}
                    name={item.name}
                    isActive={activeId === item.id}
                    onDelete={() =>
                      setItems((prev) =>
                        prev.filter((img) => img.id !== item.id)
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default SortableImageGrid;
