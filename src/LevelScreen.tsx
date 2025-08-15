import type { Level } from "./models/level";
import BoardGrid from "./components/BoardGrid";
import CardLeque from "./components/CardLeque";
import { DESIGN_HEIGHT, DESIGN_WIDTH, useScale } from "./logic/interface";
import { useGameLevel, useHintSystem } from "./hooks";

interface Props {
  level: Level;
  onLevelComplete?: () => void;
}

function LevelScreen({ level, onLevelComplete }: Props) {
  const { state, cards, onDropCard, onDragCellCard } = useGameLevel({
    level,
    onLevelComplete,
  });

  const hintTick = useHintSystem({ availableCardsCount: cards.length });

  const scale = useScale();

  return (
    <div className="h-full w-full flex items-center justify-center bg-blue-400 px-8 py-24 box-border">
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
          <div className="tilted-board -top-10 -left-4 bottom-36 right-18 absolute">
            <BoardGrid
              level={level}
              levelState={state}
              hintTick={hintTick}
              onCellDrag={onDragCellCard}
            />
          </div>
        </div>
        <CardLeque cards={cards} onDropCard={onDropCard} />
      </div>
    </div>
  );
}

export default LevelScreen;
