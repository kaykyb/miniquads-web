import type { Level } from "../models/level";
import type { LevelState } from "../models/levelState";

type Action = {
  type: "assignCell";
  cellId: number;
  cardId: number; // -1 to clear the cell
};

export const levelStateReducer = (
  state: LevelState,
  action: Action
): LevelState => {
  switch (action.type) {
    case "assignCell": {
      const newCellAssignments = [...state.cellAssignments];
      newCellAssignments[action.cellId] = action.cardId;
      return { ...state, cellAssignments: newCellAssignments };
    }

    default:
      return { ...state };
  }
};

export const buildInitialState = (level: Level): LevelState => {
  const size = level.solutions.length;

  const cellAssignments = new Array(size).fill(-1);

  level.given.forEach((givenCellIndex, index) => {
    cellAssignments[givenCellIndex] = index;
  });

  return { cellAssignments };
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
    cellAssignments: levelState.cellAssignments.slice(0, end),
  };
};

export const getEffectiveCards = (level: Level): number[] => {
  const givenCardValues = level.given.map(
    (cellIndex) => level.solutions[cellIndex]
  );
  return [...givenCardValues, ...level.cards];
};

export const getAvailableCards = (level: Level, levelState: LevelState) => {
  const usedCardIds = new Set(
    levelState.cellAssignments.filter((cardId) => cardId !== -1)
  );
  const effectiveCards = getEffectiveCards(level);

  return effectiveCards
    .map((value, index) => ({ id: index, value }))
    .filter((card) => !usedCardIds.has(card.id));
};

export const getFirst4AvailableCards = (
  level: Level,
  levelState: LevelState
) => {
  return getAvailableCards(level, levelState).slice(0, 4);
};

export const getCellValue = (
  level: Level,
  levelState: LevelState,
  cellIndex: number
): number => {
  const cardId = levelState.cellAssignments[cellIndex];
  if (cardId === -1) return 0;

  const effectiveCards = getEffectiveCards(level);
  return effectiveCards[cardId];
};
