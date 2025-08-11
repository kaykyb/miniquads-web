import { levelStateSubset, levelSubset } from "../logic/levelState";
import type { Level } from "../models/level";
import type { LevelState } from "../models/levelState";
import BoardCell from "./BoardCell";

interface Props {
  level: Level;
  levelState: LevelState;
  hintTick?: number;
  onCellDrag?: (params: { fromCellId: number; value: number; dropCellId: number | null }) => void;
}

export default function BoardGrid({ level, levelState, hintTick, onCellDrag }: Props) {
  const lengthsLength = level.sides.length;
  const solutionsLength = level.solutions.length;

  const subLevel = levelSubset(level, lengthsLength - 1, solutionsLength - 5);
  const subLevelState = levelStateSubset(levelState, solutionsLength - 5);

  const hasSubLevel = subLevel.sides.length > 0;

  if (!hasSubLevel) {
    return (
      <div className="grid board-grid-small w-full h-full gap-3">
        <div></div>
        <BoardCell
          id={solutionsLength - 3}
          value={levelState.cellValues[solutionsLength - 3]}
          solution={level.solutions[solutionsLength - 3]}
          hintTick={hintTick}
          onDragOutCard={onCellDrag}
          isGiven={level.given.includes(solutionsLength - 3)}
        />
        <BoardCell
          id={solutionsLength - 1}
          value={levelState.cellValues[solutionsLength - 1]}
          solution={level.solutions[solutionsLength - 1]}
          hintTick={hintTick}
          onDragOutCard={onCellDrag}
          isGiven={level.given.includes(solutionsLength - 1)}
        />
        <BoardCell
          id={solutionsLength - 2}
          value={levelState.cellValues[solutionsLength - 2]}
          solution={level.solutions[solutionsLength - 2]}
          hintTick={hintTick}
          onDragOutCard={onCellDrag}
          isGiven={level.given.includes(solutionsLength - 2)}
        />
      </div>
    );
  }

  const subsetSidesSum = subLevel.sides.reduce((a, b) => a + b, 0);
  const thisLevelSide = level.sides[lengthsLength - 1];

  return (
    <div
      className="grid board-grid w-full h-full gap-3"
      style={{
        gridTemplateColumns: `80px ${subsetSidesSum}fr ${thisLevelSide}fr`,
        gridTemplateRows: `80px ${subsetSidesSum}fr ${thisLevelSide}fr`,
      }}
    >
      <div className="col-span-2 row-span-2">
        <BoardGrid level={subLevel} levelState={subLevelState} hintTick={hintTick} onCellDrag={onCellDrag}></BoardGrid>
      </div>

      <BoardCell
        id={solutionsLength - 5}
        value={levelState.cellValues[solutionsLength - 5]}
        solution={level.solutions[solutionsLength - 5]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 5)}
      />
      <BoardCell
        id={solutionsLength - 4}
        value={levelState.cellValues[solutionsLength - 4]}
        solution={level.solutions[solutionsLength - 4]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 4)}
      />
      <BoardCell
        id={solutionsLength - 1}
        value={levelState.cellValues[solutionsLength - 1]}
        solution={level.solutions[solutionsLength - 1]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 1)}
      />
      <BoardCell
        id={solutionsLength - 2}
        value={levelState.cellValues[solutionsLength - 2]}
        solution={level.solutions[solutionsLength - 2]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 2)}
      />
      <BoardCell
        id={solutionsLength - 3}
        value={levelState.cellValues[solutionsLength - 3]}
        solution={level.solutions[solutionsLength - 3]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 3)}
      />
    </div>
  );
}
