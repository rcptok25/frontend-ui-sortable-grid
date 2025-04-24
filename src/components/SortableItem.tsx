"use client";
import React, { FC, CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import clsx from "clsx";

interface Props {
  id: string;
  src: string;
  name: string;
  isActive?: boolean;
  onDelete?: () => void;
}

const SortableItem: FC<Props> = ({ id, src, name, isActive, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: !isDragging ? 0.5 : 1,
    cursor: "grab",
    zIndex: isDragging || isActive ? 50 : 1,
    position: isDragging ? "relative" : "static",
    margin: isDragging ? 0 : "1rem",
    boxShadow: !isDragging ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
    backgroundColor: !isDragging ? "rgba(255, 255, 255, 0.8)" : "white",
    border: !isDragging ? "1px solid rgba(0, 0, 0, 0.2)" : "1px solid #ccc",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    width: "150px",
    height: "180px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };

  const getShortName = (name: string, maxLength = 18) => {
    if (name.length <= maxLength) return name;
  
    const dotIndex = name.lastIndexOf(".");
    const extension = dotIndex !== -1 ? name.substring(dotIndex) : "";
    const base = name.substring(0, maxLength - extension.length - 3); // -3 for "..."
    return `${base}...${extension}`;
  };
  
  return (
    <div
      style={style}
      className={clsx(
        "w-[150px] h-[180px] bg-white rounded-md border border-gray-300 shadow-md transition-all duration-150 relative margin-3",
        isActive && "scale-125 shadow-2xl z-50",
        isDragging ? "z-50" : "hover:shadow-lg"
      )}
    >
      <button
        onClick={onDelete}
        className="h-[20px] top-1 right-1 text-sm text-gray-500 hover:text-red-500 mb-4 self-end"
      >
        ❌
      </button>

      <div ref={setNodeRef} {...attributes} {...listeners}>
        <div className="w-full h-[100px] p-3 flex items-center justify-center mt-10">
          <Image
            src={src}
            alt={id}
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        <div
          title={name}
          className="text-center text-xs font-medium px-1 truncate w-full inline-block overflow-hidden text-ellipsis break-all"
          style={{ color: isActive ? "#000" : "#fff",fontWeight: "bold" }}
        >
          {getShortName(name)}
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
