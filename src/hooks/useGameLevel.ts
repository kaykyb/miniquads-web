import { useEffect, useReducer, useCallback, useMemo, useState } from "react";
import type { Level } from "../models/level";
import {
  buildInitialState,
  getFirst4AvailableCards,
  getEffectiveCards,
  levelStateReducer,
} from "../logic/levelState";

interface UseGameLevelProps {
  level: Level;
  onLevelComplete?: () => void;
  onGameOver?: () => void;
}

export function useGameLevel({ level, onLevelComplete, onGameOver }: UseGameLevelProps) {
  const [state, dispatch] = useReducer(
    levelStateReducer,
    buildInitialState(level)
  );
  const [lives, setLives] = useState(2);

  const effectiveCards = useMemo(() => getEffectiveCards(level), [level]);
  const cards = getFirst4AvailableCards(level, state);

  const isLevelCompleted = useMemo(
    () =>
      state.cellAssignments.every((cardId, idx) => {
        if (cardId === -1) return false; // Cell not filled
        const cellValue = effectiveCards[cardId];
        return cellValue === level.solutions[idx];
      }),
    [effectiveCards, level, state.cellAssignments]
  );

  useEffect(() => {
    if (isLevelCompleted) onLevelComplete?.();
  }, [isLevelCompleted, onLevelComplete]);

  useEffect(() => {
    if (lives <= 0) onGameOver?.();
  }, [lives, onGameOver]);

  const assignCell = useCallback((cellId: number, cardId: number) => {
    dispatch({
      type: "assignCell",
      cellId,
      cardId,
    });
  }, []);

  const onDropCard = useCallback(
    (params: { cardId: number; value: number; dropCellId: number | null }) => {
      const { cardId, value, dropCellId } = params;
      if (dropCellId == null) return;
      if (state.cellAssignments[dropCellId] !== -1) return; // Cell already has a card

      assignCell(dropCellId, cardId);

      // Check if the drop is wrong and reduce lives
      const expectedValue = level.solutions[dropCellId];
      if (value !== expectedValue) {
        setLives(prev => prev - 1);
      }
    },
    [state.cellAssignments, assignCell, level.solutions]
  );

  // Handle dragging cards between cells
  const onDragCellCard = useCallback(
    (params: {
      fromCellId: number;
      value: number;
      dropCellId: number | null;
    }) => {
      const { fromCellId, value, dropCellId } = params;
      const cardId = state.cellAssignments[fromCellId];

      // Clear the source cell
      assignCell(fromCellId, -1);

      if (dropCellId == null) {
        // Card was dropped outside - it returns to available cards (already cleared from cell)
        return;
      }

      if (state.cellAssignments[dropCellId] !== -1) {
        // Target already filled – ignore and restore original card to source cell
        assignCell(fromCellId, cardId);
        return;
      }

      // Move card to new cell
      assignCell(dropCellId, cardId);

      // Check if the drop is wrong and reduce lives
      const expectedValue = level.solutions[dropCellId];
      if (value !== expectedValue) {
        setLives(prev => prev - 1);
      }
    },
    [state.cellAssignments, assignCell, level.solutions]
  );

  return {
    state,
    cards,
    isLevelCompleted,
    lives,
    assignCell,
    onDropCard,
    onDragCellCard,
  };
}
