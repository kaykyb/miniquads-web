import type { Level } from "../models/level";

export type LevelWithName = {
  level: Level;
  name: string;
};

// Fetches level metadata and individual level files from the public directory.
// Returns all levels parsed as Level objects with their filenames.
export async function loadLevels(): Promise<LevelWithName[]> {
  // The order file lists level json filenames in order of play.
  const orderRes = await fetch("/levels/level_order.json");
  if (!orderRes.ok) {
    throw new Error(`Failed to fetch level_order.json: ${orderRes.status} ${orderRes.statusText}`);
  }

  const orderJson: { levels: string[] } = await orderRes.json();
  const levelFiles = orderJson.levels ?? [];

  // Fetch each level file in parallel.
  const levelPromises = levelFiles.map(async (fileName) => {
    const levelRes = await fetch(`/levels/${fileName}`);
    if (!levelRes.ok) {
      throw new Error(`Failed to fetch level file ${fileName}: ${levelRes.status} ${levelRes.statusText}`);
    }
    const level = await levelRes.json() as Level;
    return {
      level,
      name: fileName
    };
  });

  return Promise.all(levelPromises);
}
