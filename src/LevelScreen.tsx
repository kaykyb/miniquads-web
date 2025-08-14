import { useEffect, useReducer, useState } from "react";
import type { Level } from "./models/level";
import {
  buildInitialState,
  getFirst4AvailableCards,
  getEffectiveCards,
  levelStateReducer,
} from "./logic/levelState";
import BoardGrid from "./components/BoardGrid";
import CardLeque from "./components/CardLeque";
import { DESIGN_HEIGHT, DESIGN_WIDTH, useScale } from "./logic/interface";

interface Props {
  level: Level;
  onLevelComplete?: () => void;
}

function LevelScreen({ level, onLevelComplete }: Props) {
  const [state, dispatch] = useReducer(
    levelStateReducer,
    buildInitialState(level)
  );
  const cards = getFirst4AvailableCards(level, state);
  const [hintTick, setHintTick] = useState(0);

  useEffect(() => {
    let intervalId: number | null = null;

    if (cards.length < 3) {
      intervalId = window.setInterval(() => {
        setHintTick((t) => t + 1);
      }, 5000);
    }

    return () => {
      if (intervalId != null) {
        window.clearInterval(intervalId);
      }
    };
  }, [cards.length]);

  const [levelCompleted, setLevelCompleted] = useState(false);

  useEffect(() => {
    if (levelCompleted) return;

    const effectiveCards = getEffectiveCards(level);
    const solved = state.cellAssignments.every((cardId, idx) => {
      if (cardId === -1) return false; // Cell not filled
      const cellValue = effectiveCards[cardId];
      return cellValue === level.solutions[idx];
    });

    if (solved) {
      setLevelCompleted(true);
      onLevelComplete?.();
    }
  }, [
    state.cellAssignments,
    level.solutions,
    level.given,
    level.cards,
    levelCompleted,
    onLevelComplete,
    level,
  ]);

  const scale = useScale();

  const assignCell = (cellId: number, cardId: number) => {
    dispatch({
      type: "assignCell",
      cellId,
      cardId,
    });
  };

  const onDropCard = (params: {
    cardId: number;
    value: number;
    dropCellId: number | null;
  }) => {
    const { cardId, dropCellId } = params;
    if (dropCellId == null) return;
    if (state.cellAssignments[dropCellId] !== -1) return; // Cell already has a card

    assignCell(dropCellId, cardId);
  };

  const onDragCellCard = (params: {
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
  };

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
