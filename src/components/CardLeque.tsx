import type { Card } from "../models/levelState";
import DraggableCard from "./DraggableCard";

interface Props {
  cards: Card[];
}

export default function CardLeque({ cards }: Props) {
  return (
    <div className="fixed -bottom-16 w-full flex justify-center gap-4">
      {cards.map((card, i) => (
        <DraggableCard card={card} key={i} />
      ))}
    </div>
  );
}
