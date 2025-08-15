import { useEffect, useState } from "react";

export const DESIGN_WIDTH = 760;
export const DESIGN_HEIGHT = 900;
const PADDING_X = 32;
const PADDING_Y = 96;

export const useScale = () => {
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

    window.addEventListener("resize", computeScale, { passive: true });

    const orientation = window.screen.orientation;
    const onOrientationChange = () => computeScale();
    if (orientation && typeof orientation.addEventListener === "function") {
      orientation.addEventListener("change", onOrientationChange);
    } else {
      window.addEventListener("orientationchange", onOrientationChange);
    }

    const vv = window.visualViewport;
    const onVVChange = () => computeScale();
    if (vv) {
      vv.addEventListener("resize", onVVChange);
      vv.addEventListener("scroll", onVVChange);
    }

    return () => {
      window.removeEventListener("resize", computeScale);
      if (
        orientation &&
        typeof orientation.removeEventListener === "function"
      ) {
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

  return scale;
};
