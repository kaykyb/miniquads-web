export type Difficulty = "easy" | "medium" | "hard";

export type Level = {
  sides: number[];
  given: number[];
  solutions: number[];
  cards: number[];
  difficulty: Difficulty;
};
