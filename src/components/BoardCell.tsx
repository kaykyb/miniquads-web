import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  id: number;
  value: number;
  solution: number;
  onDragOutCard?: (params: {
    fromCellId: number;
    value: number;
    dropCellId: number | null;
  }) => void;
}

export default function BoardCell({ id, value, onDragOutCard }: Props) {
  const solved = value !== 0;

  // if the cell is not solved, it should be traced with a dashed border
  const borderStyle = solved ? "border-b-4 border-gray-200 bg-white " : "border-4 border-gray-200 border-dashed bg-transparent";
  const textStyle = solved ? "text-black" : "text-white";

  // Drag state (similar to DraggableCard)
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [pointerOffset, setPointerOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragSize, setDragSize] = useState<{ w: number; h: number } | null>(
    null
  );
  const hoveredCellRef = useRef<HTMLElement | null>(null);
  const holdTimeout = useRef<number | null>(null);

  // Cleanup hold timeout
  useEffect(() => {
    return () => {
      if (holdTimeout.current != null) {
        window.clearTimeout(holdTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      setPointerPos({ x: e.clientX, y: e.clientY });

      // Update hovered cell
      const elem = document.elementFromPoint(e.clientX, e.clientY) as
        | HTMLElement
        | null;
      const target = elem?.closest<HTMLElement>("[data-drop-cell-id]") ?? null;
      if (target !== hoveredCellRef.current) {
        if (hoveredCellRef.current) {
          hoveredCellRef.current.classList.remove("drop-target-hover");
        }
        if (target) {
          target.classList.add("drop-target-hover");
        }
        hoveredCellRef.current = target;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      setDragging(false);
      setPointerPos(null);

      // Determine drop cell id
      const elem = document.elementFromPoint(e.clientX, e.clientY) as
        | HTMLElement
        | null;
      let dropCellId: number | null = null;
      if (elem) {
        const target = elem.closest<HTMLElement>("[data-drop-cell-id]");
        if (target) {
          const raw = target.getAttribute("data-drop-cell-id");
          dropCellId = raw != null ? Number(raw) : null;
          if (Number.isNaN(dropCellId!)) dropCellId = null;
        }
      }

      setPointerOffset(null);
      setDragSize(null);
      if (hoveredCellRef.current) {
        hoveredCellRef.current.classList.remove("drop-target-hover");
        hoveredCellRef.current = null;
      }

      onDragOutCard?.({ fromCellId: id, value, dropCellId });

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, id, value, onDragOutCard]);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = rootRef.current?.getBoundingClientRect();
    if (box) {
      setPointerOffset({ x: e.clientX - box.left, y: e.clientY - box.top });
      setDragSize({ w: box.width, h: box.height });
    } else {
      setPointerOffset({ x: 0, y: 0 });
    }
    setPointerPos({ x: e.clientX, y: e.clientY });
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!solved) return;
    // Initiate hold timer (200ms)
    holdTimeout.current = window.setTimeout(() => {
      startDrag(e);
    }, 200);
  };

  const onPointerUpCancel: React.PointerEventHandler<HTMLDivElement> = () => {
    if (holdTimeout.current != null) {
      window.clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  return (
    <>
      <div
        ref={rootRef}
        data-drop-cell-id={id}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUpCancel}
        onPointerLeave={onPointerUpCancel}
        className={`rounded-3xl flex items-center justify-center text-4xl ${borderStyle} transition-transform duration-150 ease-out ${textStyle} ${
          solved ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={dragging ? { visibility: "hidden" } : undefined}
      >
        {solved ? value : "?"}
      </div>

      {dragging && pointerPos && (
        createPortal(
          <div
            className="bg-blue-500 rounded-3xl text-8xl flex items-center justify-center border-b-8 border-blue-950 text-white opacity-50 shadow-2xl"
            style={{
              position: "fixed",
              left: `${pointerPos.x - (pointerOffset?.x ?? 0)}px`,
              top: `${pointerPos.y - (pointerOffset?.y ?? 0)}px`,
              width: dragSize?.w,
              height: dragSize?.h,
              zIndex: 99999,
              pointerEvents: "none",
            }}
          >
            {value}
          </div>,
          document.body
        )
      )}
    </>
  );
}
