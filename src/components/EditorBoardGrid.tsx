import { levelStateSubset, levelSubset } from "../logic/levelState";
import type { Level } from "../models/level";
import type { LevelState } from "../models/levelState";

interface EditorBoardCellProps {
  id: number;
  value: number;
  isGiven: boolean;
  onCellClick: (cellIndex: number) => void;
}

function EditorBoardCell({
  id,
  value,
  isGiven,
  onCellClick,
}: EditorBoardCellProps) {
  const handleClick = () => {
    onCellClick(id);
  };

  const borderStyle =
    value !== 0
      ? "border-b-4 border-gray-200 bg-white"
      : "border-4 border-gray-200 border-dashed bg-transparent";
  const textStyle = value !== 0 ? "text-black" : "text-gray-400";
  const givenStyle = isGiven ? "bg-yellow-200 border-yellow-400" : "";

  return (
    <div
      onClick={handleClick}
      className={`
        rounded-3xl flex items-center justify-center text-2xl cursor-pointer font-bold
        ${borderStyle} ${textStyle} ${givenStyle}
        transition-all duration-150 ease-out
        hover:scale-105 hover:shadow-lg
      `}
      style={{ minHeight: "60px" }}
    >
      {value !== 0 ? value : "?"}
    </div>
  );
}

interface Props {
  level: Level;
  levelState: LevelState;
  editMode: "place" | "given";
  selectedValue: number;
  onCellClick: (cellIndex: number) => void;
}

export default function EditorBoardGrid({
  level,
  levelState,
  editMode,
  selectedValue,
  onCellClick,
}: Props) {
  const lengthsLength = level.sides.length;
  const solutionsLength = level.solutions.length;

  const subLevel = levelSubset(level, lengthsLength - 1, solutionsLength - 5);
  const subLevelState = levelStateSubset(levelState, solutionsLength - 5);

  const hasSubLevel = subLevel.sides.length > 0;

  if (!hasSubLevel) {
    return (
      <div
        className="grid board-grid-small w-full gap-3"
        style={{ minHeight: "160px", aspectRatio: "1 / 1" }}
      >
        <div></div>
        <EditorBoardCell
          id={solutionsLength - 3}
          value={level.solutions[solutionsLength - 3]}
          isGiven={level.given.includes(solutionsLength - 3)}
          onCellClick={onCellClick}
        />
        <EditorBoardCell
          id={solutionsLength - 1}
          value={level.solutions[solutionsLength - 1]}
          isGiven={level.given.includes(solutionsLength - 1)}
          onCellClick={onCellClick}
        />
        <EditorBoardCell
          id={solutionsLength - 2}
          value={level.solutions[solutionsLength - 2]}
          isGiven={level.given.includes(solutionsLength - 2)}
          onCellClick={onCellClick}
        />
      </div>
    );
  }

  const subsetSidesSum = subLevel.sides.reduce((a, b) => a + b, 0);
  const thisLevelSide = level.sides[lengthsLength - 1];

  return (
    <div
      className="grid board-grid w-full gap-3"
      style={{
        gridTemplateColumns: `80px ${subsetSidesSum}fr ${thisLevelSide}fr`,
        gridTemplateRows: `80px ${subsetSidesSum}fr ${thisLevelSide}fr`,
        minHeight: `${Math.max(160, (subsetSidesSum + thisLevelSide) * 25)}px`,
        aspectRatio: "1 / 1",
      }}
    >
      <div className="col-span-2 row-span-2">
        <EditorBoardGrid
          level={subLevel}
          levelState={subLevelState}
          editMode={editMode}
          selectedValue={selectedValue}
          onCellClick={onCellClick}
        />
      </div>

      <EditorBoardCell
        id={solutionsLength - 5}
        value={level.solutions[solutionsLength - 5]}
        isGiven={level.given.includes(solutionsLength - 5)}
        onCellClick={onCellClick}
      />
      <EditorBoardCell
        id={solutionsLength - 4}
        value={level.solutions[solutionsLength - 4]}
        isGiven={level.given.includes(solutionsLength - 4)}
        onCellClick={onCellClick}
      />
      <EditorBoardCell
        id={solutionsLength - 1}
        value={level.solutions[solutionsLength - 1]}
        isGiven={level.given.includes(solutionsLength - 1)}
        onCellClick={onCellClick}
      />
      <EditorBoardCell
        id={solutionsLength - 2}
        value={level.solutions[solutionsLength - 2]}
        isGiven={level.given.includes(solutionsLength - 2)}
        onCellClick={onCellClick}
      />
      <EditorBoardCell
        id={solutionsLength - 3}
        value={level.solutions[solutionsLength - 3]}
        isGiven={level.given.includes(solutionsLength - 3)}
        onCellClick={onCellClick}
      />
    </div>
  );
}
