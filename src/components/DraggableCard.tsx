import type { Card } from "../models/levelState";

export default function DraggableCard({ card }: { card: Card }) {
  return (
    <div className="bg-blue-500 h-40 w-32 rounded-3xl text-8xl flex items-center justify-center border-b-8 border-blue-950 text-shadow-md">
      {card.value}
    </div>
  );
}
