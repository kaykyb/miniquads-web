import { createPortal } from "react-dom";
import { useDragAndDrop } from "../hooks";

type Props = {
  card: { id: number; value: number };
  onDropCard: (params: {
    cardId: number;
    value: number;
    dropCellId: number | null;
  }) => void;
};

export default function DraggableCard({ card, onDropCard }: Props) {
  const { rootRef, dragState, onPointerDown } = useDragAndDrop({
    data: card,
    onDrop: (cardData, dropCellId) => {
      onDropCard({ cardId: cardData.id, value: cardData.value, dropCellId });
    },
  });

  return (
    <>
      <div
        ref={rootRef}
        onPointerDown={onPointerDown}
        className="bg-blue-500 h-40 w-32 rounded-3xl text-8xl flex items-center justify-center border-b-8 border-blue-950 select-none touch-none text-white transition-opacity shadow-2xl cursor-grab active:cursor-grabbing"
        style={dragState.dragging ? { visibility: "hidden" } : undefined}
      >
        {card.value}
      </div>

      {dragState.dragging &&
        dragState.pointerPos &&
        createPortal(
          <div
            className="bg-blue-500 h-40 w-32 rounded-3xl text-8xl flex items-center justify-center border-b-8 border-blue-950 select-none text-white opacity-50 transition-opacity shadow-2xl"
            style={{
              position: "fixed",
              left: `${dragState.pointerPos.x - (dragState.pointerOffset?.x ?? 0)}px`,
              top: `${dragState.pointerPos.y - (dragState.pointerOffset?.y ?? 0)}px`,
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
