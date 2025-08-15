import { useEffect, useState } from "react";

interface UseShakeAnimationProps {
  trigger?: number;
  shouldShake?: boolean;
  duration?: number;
}

export function useShakeAnimation({
  trigger,
  shouldShake = true,
  duration = 600,
}: UseShakeAnimationProps) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (trigger === undefined) return;
    if (!shouldShake) return;

    setShake(true);
    const timeout = window.setTimeout(() => setShake(false), duration);
    return () => window.clearTimeout(timeout);
  }, [trigger, shouldShake, duration]);

  return shake;
}
