export type Card = {
  used: boolean;
  value: number;
};

export type LevelState = {
  cellValues: number[];
  cards: Card[];
};
