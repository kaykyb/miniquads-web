import type { Level } from "./models/level";
import BoardGrid from "./components/BoardGrid";
import CardLeque from "./components/CardLeque";
import { DESIGN_HEIGHT, DESIGN_WIDTH, useScale } from "./hooks/useScale";
import { useGameLevel, useHintSystem } from "./hooks";
import { useMemo } from "react";

interface Props {
  level: Level;
  onLevelComplete?: () => void;
  onGameOver?: () => void;
}

function LevelScreen({ level, onLevelComplete, onGameOver }: Props) {
  const { state, cards, lives, onDropCard, onDragCellCard } = useGameLevel({
    level,
    onLevelComplete,
    onGameOver,
  });

  const hintTick = useHintSystem({ availableCardsCount: cards.length });
  const scale = useScale();
  const maxCardValue = useMemo(() => Math.max(...level.solutions), [level]);

  return (
    <div className="h-full w-full flex items-center justify-center px-8 py-24 box-border">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <span className="text-2xl font-bold text-white">Vidas:</span>
        <div className="flex gap-1">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                i < lives ? "0 text-white" : " text-gray-400"
              }`}
            >
              ❤️
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div className="grass-block relative">
          <div className="tilted-board left-28 right-28 top-4 absolute aspect-square">
            <BoardGrid
              level={level}
              levelState={state}
              hintTick={hintTick}
              onCellDrag={onDragCellCard}
              maxCardValue={maxCardValue}
            />
          </div>
        </div>
        <CardLeque cards={cards} onDropCard={onDropCard} />
      </div>
    </div>
  );
}

export default LevelScreen;
