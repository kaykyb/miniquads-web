import { useMemo, useReducer } from "react";
import type { Level } from "./models/level";
import {
  buildInitialState,
  first4UnusedCards,
  levelStateReducer,
} from "./logic/levelState";
import BoardGrid from "./components/BoardGrid";
import CardLeque from "./components/CardLeque";

interface Props {
  level: Level;
}

function LevelScreen({ level }: Props) {
  const initialState = useMemo(() => buildInitialState(level), [level]);
  const [state, dispatch] = useReducer(levelStateReducer, initialState);
  const cards = first4UnusedCards(state);

  const assignCell = (id: number, value: number) => {
    dispatch({
      type: "assignCell",
      id,
      value,
    });
  };

  const onDropCard = (params: { cardId: number; value: number; dropCellId: number | null }) => {
    const { cardId, value, dropCellId } = params;
    if (dropCellId == null) return; // not dropped on a cell
    // Only allow placing on empty cells
    if (state.cellValues[dropCellId] !== 0) return;

    // Validate against solution
    const expected = level.solutions[dropCellId];
    if (value === expected) {
      assignCell(dropCellId, value);
      dispatch({ type: "useCard", cardId });
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-blue-400">
      <div className="grass-block transform relative scale-75">
        <div className="tilted-board -top-10 -left-4 bottom-36 right-18 absolute">
          <BoardGrid level={level} levelState={state} />
        </div>
        <CardLeque cards={cards} onDropCard={onDropCard} />
      </div>
    </div>
  );
}

export default LevelScreen;
