import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  card: { id: number; value: number };
  onDropCard: (params: {
    cardId: number;
    value: number;
    dropCellId: number | null;
  }) => void;
};

export default function DraggableCard({ card, onDropCard }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [pointerOffset, setPointerOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const hoveredCellRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      setPointerPos({ x: e.clientX, y: e.clientY });

      const elem = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
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

      // Hit-test for a cell with data-drop-cell-id under the pointer
      const elem = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
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
      // Clear hovered visual state
      if (hoveredCellRef.current) {
        hoveredCellRef.current.classList.remove("drop-target-hover");
        hoveredCellRef.current = null;
      }
      onDropCard({ cardId: card.id, value: card.value, dropCellId });
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
  }, [dragging, onDropCard, card.id, card.value]);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const box = rootRef.current?.getBoundingClientRect();
    if (box) {
      setPointerOffset({ x: e.clientX - box.left, y: e.clientY - box.top });
    } else {
      setPointerOffset({ x: 0, y: 0 });
    }
    setPointerPos({ x: e.clientX, y: e.clientY });
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  return (
    <>
      <div
        ref={rootRef}
        onPointerDown={onPointerDown}
        className="bg-blue-500 h-40 w-32 rounded-3xl text-8xl flex items-center justify-center border-b-8 border-blue-950 select-none touch-none text-white transition-opacity shadow-2xl cursor-grab active:cursor-grabbing"
        style={dragging ? { visibility: "hidden" } : undefined}
      >
        {card.value}
      </div>

      {dragging &&
        pointerPos &&
        createPortal(
          <div
            className="bg-blue-500 h-40 w-32 rounded-3xl text-8xl flex items-center justify-center border-b-8 border-blue-950 select-none text-white opacity-50 transition-opacity shadow-2xl"
            style={{
              position: "fixed",
              left: `${pointerPos.x - (pointerOffset?.x ?? 0)}px`,
              top: `${pointerPos.y - (pointerOffset?.y ?? 0)}px`,

              zIndex: 99999,
              pointerEvents: "none",
            }}
          >
            {card.value}
          </div>,
          document.body
        )}
    </>
  );
}
