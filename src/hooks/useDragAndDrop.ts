import { useRef, useState, useEffect, useCallback } from "react";

interface DragState {
  dragging: boolean;
  pointerPos: { x: number; y: number } | null;
  pointerOffset: { x: number; y: number } | null;
  dragSize?: { w: number; h: number } | null;
}

interface UseDragAndDropProps<T> {
  data: T;
  onDrop: (data: T, dropTarget: number | null) => void;
  enabled?: boolean;
  dragDelay?: number;
}

export function useDragAndDrop<T>({
  data,
  onDrop,
  enabled = true,
  dragDelay = 0,
}: UseDragAndDropProps<T>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hoveredCellRef = useRef<HTMLElement | null>(null);
  const holdTimeout = useRef<number | null>(null);

  const [dragState, setDragState] = useState<DragState>({
    dragging: false,
    pointerPos: null,
    pointerOffset: null,
    dragSize: null,
  });

  useEffect(() => {
    return () => {
      if (holdTimeout.current != null) {
        window.clearTimeout(holdTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!dragState.dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragState((prev) => ({
        ...prev,
        pointerPos: { x: e.clientX, y: e.clientY },
      }));

      // Update hovered drop target
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
      setDragState({
        dragging: false,
        pointerPos: null,
        pointerOffset: null,
        dragSize: null,
      });

      // Determine drop target
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

      // Clear hovered state
      if (hoveredCellRef.current) {
        hoveredCellRef.current.classList.remove("drop-target-hover");
        hoveredCellRef.current = null;
      }

      onDrop(data, dropCellId);

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
  }, [dragState.dragging, data, onDrop]);

  const startDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;

      e.preventDefault();
      const box = rootRef.current?.getBoundingClientRect();

      const offset = box
        ? { x: e.clientX - box.left, y: e.clientY - box.top }
        : { x: 0, y: 0 };

      const size = box ? { w: box.width, h: box.height } : null;

      setDragState({
        dragging: true,
        pointerPos: { x: e.clientX, y: e.clientY },
        pointerOffset: offset,
        dragSize: size,
      });

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [enabled]
  );

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (!enabled) return;

      if (dragDelay > 0) {
        holdTimeout.current = window.setTimeout(() => {
          startDrag(e);
        }, dragDelay);
      } else {
        startDrag(e);
      }
    },
    [enabled, dragDelay, startDrag]
  );

  const onPointerUpCancel: React.PointerEventHandler<HTMLDivElement> =
    useCallback(() => {
      if (holdTimeout.current != null) {
        window.clearTimeout(holdTimeout.current);
        holdTimeout.current = null;
      }
    }, []);

  return {
    rootRef,
    dragState,
    onPointerDown,
    onPointerUpCancel,
  };
}
