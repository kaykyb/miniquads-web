import { demoLevel } from "./demo";
import type { Level } from "../models/level";

export const levels: Level[] = [
  demoLevel,
  { ...demoLevel },
];
