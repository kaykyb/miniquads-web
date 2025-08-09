export type Card = {
  id: number;
  used: boolean;
  value: number;
};

export type LevelState = {
  cellValues: number[];
  cards: Card[];
};
