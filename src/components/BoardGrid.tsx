import {
  levelStateSubset,
  levelSubset,
  getCellValue,
} from "../logic/levelState";
import type { Level } from "../models/level";
import type { LevelState } from "../models/levelState";
import BoardCell from "./BoardCell";

interface Props {
  level: Level;
  levelState: LevelState;
  hintTick?: number;
  onCellDrag?: (params: {
    fromCellId: number;
    value: number;
    dropCellId: number | null;
  }) => void;
  housesSize?: number;
  maxCardValue: number;
}

export default function BoardGrid({
  level,
  levelState,
  hintTick,
  onCellDrag,
  housesSize,
  maxCardValue,
}: Props) {
  const lengthsLength = level.sides.length;
  const solutionsLength = level.solutions.length;

  const subLevel = levelSubset(level, lengthsLength - 1, solutionsLength - 5);
  const subLevelState = levelStateSubset(levelState, solutionsLength - 5);

  const hasSubLevel = subLevel.sides.length > 0;
  const thisLevelSide = level.sides[lengthsLength - 1];

  const calcHousesSize =
    housesSize || 380 / level.sides.reduce((acc, val) => acc + val);

  if (!hasSubLevel) {
    return (
      <div
        className="grid board-grid-small w-full h-full gap-1"
        style={{
          gridTemplateColumns: `1fr ${thisLevelSide}fr`,
          gridTemplateRows: `1fr ${thisLevelSide}fr`,
        }}
      >
        <div></div>
        <BoardCell
          id={solutionsLength - 3}
          value={getCellValue(level, levelState, solutionsLength - 3)}
          solution={level.solutions[solutionsLength - 3]}
          hintTick={hintTick}
          onDragOutCard={onCellDrag}
          isGiven={level.given.includes(solutionsLength - 3)}
          height={1}
          width={thisLevelSide}
          housesSize={calcHousesSize}
          maxCardValue={maxCardValue}
          difficulty={level.difficulty}
        />
        <BoardCell
          id={solutionsLength - 1}
          value={getCellValue(level, levelState, solutionsLength - 1)}
          solution={level.solutions[solutionsLength - 1]}
          hintTick={hintTick}
          onDragOutCard={onCellDrag}
          isGiven={level.given.includes(solutionsLength - 1)}
          width={1}
          height={thisLevelSide}
          housesSize={calcHousesSize}
          maxCardValue={maxCardValue}
          difficulty={level.difficulty}
        />
        <BoardCell
          id={solutionsLength - 2}
          value={getCellValue(level, levelState, solutionsLength - 2)}
          solution={level.solutions[solutionsLength - 2]}
          hintTick={hintTick}
          onDragOutCard={onCellDrag}
          isGiven={level.given.includes(solutionsLength - 2)}
          height={thisLevelSide}
          width={thisLevelSide}
          housesSize={calcHousesSize}
          maxCardValue={maxCardValue}
          difficulty={level.difficulty}
        />
      </div>
    );
  }

  const subsetSidesSum = subLevel.sides.reduce((a, b) => a + b, 0);

  return (
    <div
      className="grid board-grid w-full h-full gap-1"
      style={{
        gridTemplateColumns: `1fr ${subsetSidesSum}fr ${thisLevelSide}fr`,
        gridTemplateRows: `1fr ${subsetSidesSum}fr ${thisLevelSide}fr`,
      }}
    >
      <div className="col-span-2 row-span-2">
        <BoardGrid
          level={subLevel}
          levelState={subLevelState}
          hintTick={hintTick}
          onCellDrag={onCellDrag}
          housesSize={calcHousesSize}
          maxCardValue={maxCardValue}
        ></BoardGrid>
      </div>

      <BoardCell
        id={solutionsLength - 5}
        value={getCellValue(level, levelState, solutionsLength - 5)}
        solution={level.solutions[solutionsLength - 5]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 5)}
        height={1}
        width={thisLevelSide}
        housesSize={calcHousesSize}
        maxCardValue={maxCardValue}
        difficulty={level.difficulty}
      />
      <BoardCell
        id={solutionsLength - 4}
        value={getCellValue(level, levelState, solutionsLength - 4)}
        solution={level.solutions[solutionsLength - 4]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 4)}
        height={subsetSidesSum}
        width={thisLevelSide}
        housesSize={calcHousesSize}
        maxCardValue={maxCardValue}
        difficulty={level.difficulty}
      />
      <BoardCell
        id={solutionsLength - 1}
        value={getCellValue(level, levelState, solutionsLength - 1)}
        solution={level.solutions[solutionsLength - 1]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 1)}
        height={thisLevelSide}
        width={1}
        housesSize={calcHousesSize}
        maxCardValue={maxCardValue}
        difficulty={level.difficulty}
      />
      <BoardCell
        id={solutionsLength - 2}
        value={getCellValue(level, levelState, solutionsLength - 2)}
        solution={level.solutions[solutionsLength - 2]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 2)}
        height={thisLevelSide}
        width={subsetSidesSum}
        housesSize={calcHousesSize}
        maxCardValue={maxCardValue}
        difficulty={level.difficulty}
      />
      <BoardCell
        id={solutionsLength - 3}
        value={getCellValue(level, levelState, solutionsLength - 3)}
        solution={level.solutions[solutionsLength - 3]}
        hintTick={hintTick}
        onDragOutCard={onCellDrag}
        isGiven={level.given.includes(solutionsLength - 3)}
        height={thisLevelSide}
        width={thisLevelSide}
        housesSize={calcHousesSize}
        maxCardValue={maxCardValue}
        difficulty={level.difficulty}
      />
    </div>
  );
}
