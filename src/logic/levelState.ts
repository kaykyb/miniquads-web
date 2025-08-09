import type { Level } from "../models/level";
import type { LevelState } from "../models/levelState";

type Action = {
  type: "assignCell";
  id: number;
  value: number;
};

export const levelStateReducer = (
  state: LevelState,
  action: Action
): LevelState => {
  switch (action.type) {
    case "assignCell": {
      const newAssignedCells = [...state.cellValues];
      newAssignedCells[action.id] = action.value;

      return { ...state, cellValues: newAssignedCells };
    }

    default:
      return { ...state };
  }
};

export const buildInitialState = (level: Level): LevelState => {
  const size = level.solutions.length;

  const cellValues = [];
  for (let i = 0; i < size; i++) {
    if (level.given.includes(i)) cellValues.push(level.solutions[i]);
    else cellValues.push(0);
  }
  console.log(cellValues);

  return { cellValues };
};

export const levelSubset = (
  level: Level,
  sidesLength: number,
  solutionsLength: number
): Level => {
  return {
    sides: level.sides.slice(0, sidesLength),
    given: level.given,
    solutions: level.solutions.slice(0, solutionsLength),
    cards: level.cards,
  };
};

export const levelStateSubset = (
  levelState: LevelState,
  end: number
): LevelState => {
  return {
    cellValues: levelState.cellValues.slice(0, end),
  };
};
