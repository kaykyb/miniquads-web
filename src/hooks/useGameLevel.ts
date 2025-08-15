import { useEffect, useReducer, useCallback, useMemo } from "react";
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
}

export function useGameLevel({ level, onLevelComplete }: UseGameLevelProps) {
  const [state, dispatch] = useReducer(
    levelStateReducer,
    buildInitialState(level)
  );

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

  const assignCell = useCallback((cellId: number, cardId: number) => {
    dispatch({
      type: "assignCell",
      cellId,
      cardId,
    });
  }, []);

  const onDropCard = useCallback(
    (params: { cardId: number; value: number; dropCellId: number | null }) => {
      const { cardId, dropCellId } = params;
      if (dropCellId == null) return;
      if (state.cellAssignments[dropCellId] !== -1) return; // Cell already has a card

      assignCell(dropCellId, cardId);
    },
    [state.cellAssignments, assignCell]
  );

  // Handle dragging cards between cells
  const onDragCellCard = useCallback(
    (params: {
      fromCellId: number;
      value: number;
      dropCellId: number | null;
    }) => {
      const { fromCellId, dropCellId } = params;
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
    },
    [state.cellAssignments, assignCell]
  );

  return {
    state,
    cards,
    isLevelCompleted,
    assignCell,
    onDropCard,
    onDragCellCard,
  };
}
