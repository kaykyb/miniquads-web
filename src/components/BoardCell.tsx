import { createPortal } from "react-dom";
import { useDragAndDrop, useShakeAnimation } from "../hooks";

interface Props {
  id: number;
  value: number;
  solution: number;
  hintTick?: number;
  onDragOutCard?: (params: {
    fromCellId: number;
    value: number;
    dropCellId: number | null;
  }) => void;
  isGiven?: boolean;
}

export default function BoardCell({
  id,
  value,
  solution,
  hintTick,
  onDragOutCard,
  isGiven = false,
}: Props) {
  const solved = value !== 0;
  const wrong = solved && value !== solution;

  const shake = useShakeAnimation({
    trigger: hintTick,
    shouldShake: wrong,
  });

  const { rootRef, dragState, onPointerDown, onPointerUpCancel } =
    useDragAndDrop({
      data: { fromCellId: id, value },
      onDrop: (data, dropCellId) => {
        onDragOutCard?.({
          fromCellId: data.fromCellId,
          value: data.value,
          dropCellId,
        });
      },
      enabled: solved && !isGiven,
      dragDelay: 50,
    });

  // if the cell is not solved, it should be traced with a dashed border
  const borderStyle = solved
    ? "border-b-4 border-gray-200 bg-white "
    : "border-4 border-gray-200 border-dashed bg-transparent";
  const textStyle = solved ? "text-black" : "text-white";

  return (
    <>
      <div
        ref={rootRef}
        data-drop-cell-id={id}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUpCancel}
        onPointerLeave={onPointerUpCancel}
        className={`rounded-3xl flex items-center justify-center text-4xl ${borderStyle} transition-transform duration-150 ease-out ${textStyle} ${
          shake ? "animate-shake" : ""
        } ${solved ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={dragState.dragging ? { visibility: "hidden" } : undefined}
      >
        {solved ? value : "?"}
      </div>

      {dragState.dragging &&
        dragState.pointerPos &&
        createPortal(
          <div
            className="bg-blue-500 rounded-3xl text-8xl flex items-center justify-center border-b-8 border-blue-950 text-white opacity-50 shadow-2xl"
            style={{
              position: "fixed",
              left: `${
                dragState.pointerPos.x - (dragState.pointerOffset?.x ?? 0)
              }px`,
              top: `${
                dragState.pointerPos.y - (dragState.pointerOffset?.y ?? 0)
              }px`,
              width: dragState.dragSize?.w,
              height: dragState.dragSize?.h,
              zIndex: 99999,
              pointerEvents: "none",
            }}
          >
            {value}
          </div>,
          document.body
        )}
    </>
  );
}
