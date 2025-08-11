import type { Level } from "../models/level";
import type { Card, LevelState } from "../models/levelState";

type Action =
  | {
      type: "assignCell";
      id: number;
      value: number;
    }
  | {
      type: "useCard";
      cardId: number;
    }
  | {
      type: "returnCard";
      cardValue: number;
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
    case "useCard": {
      const newCards: Card[] = state.cards.map((c) =>
        c.id === action.cardId ? { ...c, used: true } : c
      );
      return { ...state, cards: newCards };
    }
    case "returnCard": {
      const newCards: Card[] = state.cards.map((c) =>
        c.value === action.cardValue && c.used ? { ...c, used: false } : c
      );
      return { ...state, cards: newCards };
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

  const cards = [];
  for (let i = 0; i < level.cards.length; i++) {
    cards.push({ id: i, used: false, value: level.cards[i] });
  }

  return { cellValues, cards };
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
    cards: levelState.cards,
  };
};

export const first4UnusedCards = (levelState: LevelState): Card[] => {
  return levelState.cards.filter((card) => !card.used).slice(0, 4);
};
