import { useEffect, useMemo, useReducer, useState } from "react";
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

  // Responsive scale based on viewport
  const DESIGN_WIDTH = 760; // px, matches .grass-block width
  const DESIGN_HEIGHT = 900; // px, board (670) + card fan area (~230)
  const PADDING_X = 32; // min side padding in px
  const PADDING_Y = 96; // min top/bottom padding in px

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const computeScale = () => {
      const vv = window.visualViewport;
      const vw = vv?.width ?? window.innerWidth;
      const vh = vv?.height ?? window.innerHeight;
      const availableWidth = Math.max(vw - PADDING_X * 2, 0);
      const availableHeight = Math.max(vh - PADDING_Y * 2, 0);
      const next = Math.min(
        availableWidth / DESIGN_WIDTH,
        availableHeight / DESIGN_HEIGHT,
        1
      );
      setScale(next);
    };

    // Initial calculation (twice: once now, once next frame to catch dynamic toolbar changes)
    computeScale();
    requestAnimationFrame(computeScale);

    // Window resize
    window.addEventListener("resize", computeScale, { passive: true });

    // Orientation change (Safari/iOS and some Androids)
    const orientation = window.screen.orientation;
    const onOrientationChange = () => computeScale();
    if (orientation && typeof orientation.addEventListener === "function") {
      orientation.addEventListener("change", onOrientationChange);
    } else {
      window.addEventListener("orientationchange", onOrientationChange);
    }

    // Visual viewport changes (Chrome mobile dynamic address bar)
    const vv = window.visualViewport;
    const onVVChange = () => computeScale();
    if (vv) {
      vv.addEventListener("resize", onVVChange);
      vv.addEventListener("scroll", onVVChange);
    }

    return () => {
      window.removeEventListener("resize", computeScale);
      if (orientation && typeof orientation.removeEventListener === "function") {
        orientation.removeEventListener("change", onOrientationChange);
      } else {
        window.removeEventListener("orientationchange", onOrientationChange);
      }
      if (vv) {
        vv.removeEventListener("resize", onVVChange);
        vv.removeEventListener("scroll", onVVChange);
      }
    };
  }, []);

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
            <BoardGrid level={level} levelState={state} />
          </div>
        </div>
        <CardLeque cards={cards} onDropCard={onDropCard} />
      </div>
    </div>
  );
}

export default LevelScreen;
