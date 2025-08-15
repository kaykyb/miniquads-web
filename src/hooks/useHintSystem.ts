import { useEffect, useState } from "react";

interface UseHintSystemProps {
  availableCardsCount: number;
  hintInterval?: number;
}

export function useHintSystem({
  availableCardsCount,
  hintInterval = 5000,
}: UseHintSystemProps) {
  const [hintTick, setHintTick] = useState(0);

  useEffect(() => {
    let intervalId: number | null = null;

    if (availableCardsCount < 3) {
      intervalId = window.setInterval(() => {
        setHintTick((t) => t + 1);
      }, hintInterval);
    }

    return () => {
      if (intervalId != null) {
        window.clearInterval(intervalId);
      }
    };
  }, [availableCardsCount, hintInterval]);

  return hintTick;
}
