import { createPortal } from "react-dom";
import { useDragAndDrop, useShakeAnimation } from "../hooks";
import yellowHouse from "../assets/yellow-house.png";
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
  width: number;
  height: number;
  housesSize: number;
  maxCardValue: number;
}

export default function BoardCell({
  id,
  value,
  solution,
  hintTick,
  onDragOutCard,
  isGiven = false,
  width,
  height,
  housesSize,
  maxCardValue,
}: Props) {
  const solved = value !== 0;
  const wrong = solved && value !== solution;

  const shake = useShakeAnimation({
    trigger: hintTick,
    shouldShake: wrong,
  });

  const { rootRef, dragState, onPointerDown, onPointerUpCancel, onTouchStart } =
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
    ? "bg-lime-700 border-t-4 border-l border-r border-lime-800"
    : "border-4 border-gray-200 border-dashed bg-transparent";
  const textStyle = solved ? "text-black" : "text-white";
  const hueRotateDeg = solved ? (value * 360) / maxCardValue : 0;

  return (
    <>
      <div
        ref={rootRef}
        data-drop-cell-id={id}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUpCancel}
        onPointerLeave={onPointerUpCancel}
        onTouchStart={onTouchStart}
        className={`rounded-2xl grid text-4xl ${borderStyle} transition-transform duration-150 ease-out items-center justify-center relative overflow-visible  ${textStyle} ${
          shake ? "animate-shake" : ""
        } ${solved ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
          filter: `hue-rotate(${hueRotateDeg}deg)`,
          visibility: dragState.dragging ? "hidden" : "visible",
        }}
      >
        {solved &&
          value == solution &&
          Array.from({ length: width * height }, () => (
            <div className="relative h-full w-full transform scale-75 overflow-visible">
              <img
                src={yellowHouse}
                className="absolute top-1/2 left-1/2 calc right-0 transform -translate-x-1/2 -translate-y-3/4 pointer-events-none z-[999] translate-z-10"
                style={{
                  width: `${housesSize}px`,
                }}
              />
            </div>
          ))}

        {solved ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/70 w-12 h-12 rounded-full flex justify-center items-center text-lime-800 border-lime-800 animate-house">
            {value}
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50  p-4 rounded-full text-white">
            ?
          </div>
        )}
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
