import type { Card } from "../models/levelState";
import DraggableCard from "./DraggableCard";

interface Props {
  cards: Card[];
  onDropCard: (params: {
    cardId: number;
    value: number;
    dropCellId: number | null;
  }) => void;
}

export default function CardLeque({ cards, onDropCard }: Props) {
  return (
    <div className="fixed -bottom-32 left-0 right-0 w-full">
      <div className="relative mx-auto h-64 w-full max-w-4xl">
        {cards.map((card, i) => {
          const total = cards.length;

          type Pos = { top: number; dx: number; rotate: number };
          const presets: Record<number, Pos[]> = {
            1: [{ top: 24, dx: 0, rotate: 0 }],
            2: [
              { top: 20, dx: -70, rotate: -8 },
              { top: 28, dx: 70, rotate: 8 },
            ],
            3: [
              { top: 28, dx: -110, rotate: -15 },
              { top: 16, dx: 0, rotate: 0 },
              { top: 24, dx: 110, rotate: 15 },
            ],
            4: [
              { top: 30, dx: -160, rotate: -20 },
              { top: 20, dx: -55, rotate: -5 },
              { top: 24, dx: 55, rotate: 10 },
              { top: 34, dx: 160, rotate: 25 },
            ],
          };

          const layout = presets[total as 1 | 2 | 3 | 4];
          const pos: Pos = layout?.[i] ?? {
            top: 24,
            dx: (i - (total - 1) / 2) * 80,
            rotate: 0,
          };

          const zIndex = 1000 - i;

          return (
            <div
              key={card.id}
              className="absolute transition-all duration-300"
              style={{
                left: "50%",
                top: `${pos.top}px`,
                transform: `translate(-50%, 0) translateX(${pos.dx}px) rotate(${pos.rotate}deg)`,
                zIndex,
              }}
            >
              <DraggableCard card={card} onDropCard={onDropCard} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
