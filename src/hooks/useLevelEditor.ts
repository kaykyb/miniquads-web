import { useState, useCallback, useEffect } from "react";
import type { Level, Difficulty } from "../models/level";
import type { LevelState } from "../models/levelState";
import { buildInitialState } from "../logic/levelState";

interface UseLevelEditorProps {
  initialSides?: number[];
  initialCards?: number[];
}

export function useLevelEditor({
  initialSides = [2, 3],
  initialCards = [2, 3, 4, 5, 6, 9, 25],
}: UseLevelEditorProps = {}) {
  const [sides, setSides] = useState<number[]>(initialSides);
  const [cards, setCards] = useState<number[]>(initialCards);
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [editMode, setEditMode] = useState<"place" | "given">("place");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  // Calculate total cells needed based on sides (matching BoardGrid logic)
  const calculateTotalCells = useCallback((sidesArray: number[]): number => {
    if (sidesArray.length === 0) return 0;
    if (sidesArray.length === 1) return 3; // Base case: innermost level uses 3 cells
    // Each additional level adds 5 more cells
    return 3 + (sidesArray.length - 1) * 5;
  }, []);

  const totalCells = calculateTotalCells(sides);

  // Create a level and level state for the editor
  const [level, setLevel] = useState<Level>(() => ({
    sides: sides,
    given: [],
    solutions: Array(totalCells).fill(0),
    cards: cards,
    difficulty: difficulty,
  }));

  const [levelState, setLevelState] = useState<LevelState>(() =>
    buildInitialState(level)
  );

  // Update level and level state when sides, cards, or difficulty change
  useEffect(() => {
    // Recompute solutions array length when sides change, but keep existing values where possible
    const updatedSolutions = Array.from(
      { length: totalCells },
      (_, i) => level.solutions[i] || 0
    );
    const updatedGiven = level.given.filter((index) => index < totalCells);

    // Update `level` first, preserving other fields
    const updatedLevel = {
      ...level,
      sides,
      cards,
      difficulty,
      given: updatedGiven,
      solutions: updatedSolutions,
    };

    setLevel(updatedLevel);

    // Rebuild the level state from the updated level to ensure consistency
    setLevelState(buildInitialState(updatedLevel));
  }, [sides, cards, difficulty, totalCells]);

  // Cell click handler
  const handleCellClick = useCallback(
    (cellIndex: number) => {
      if (editMode === "place") {
        setLevel((prev) => {
          const newSolutions = [...prev.solutions];
          newSolutions[cellIndex] =
            newSolutions[cellIndex] === selectedValue ? 0 : selectedValue;
          const updatedLevel = { ...prev, solutions: newSolutions };
          // Update level state to match the new level
          setLevelState(buildInitialState(updatedLevel));
          return updatedLevel;
        });
      } else if (editMode === "given") {
        setLevel((prev) => {
          const newGiven = prev.given.includes(cellIndex)
            ? prev.given.filter((id) => id !== cellIndex)
            : [...prev.given, cellIndex];
          const updatedLevel = { ...prev, given: newGiven };
          // Update level state to match the new level
          setLevelState(buildInitialState(updatedLevel));
          return updatedLevel;
        });
      }
    },
    [editMode, selectedValue]
  );

  // Sides management
  const addSide = useCallback(() => {
    setSides((prev) => [...prev, 2]);
  }, []);

  const removeSide = useCallback(() => {
    setSides((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const updateSide = useCallback((index: number, value: number) => {
    setSides((prev) => {
      const newSides = [...prev];
      newSides[index] = Math.max(2, value);
      return newSides;
    });
  }, []);

  // Cards management
  const addCard = useCallback(() => {
    setCards((prev) => [...prev, 1]);
  }, []);

  const removeCard = useCallback((index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateCard = useCallback((index: number, value: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      newCards[index] = Math.max(1, value);
      return newCards;
    });
  }, []);

  // Level operations
  const exportLevel = useCallback(() => {
    const levelJson = JSON.stringify(level, null, 2);

    // Create and download file
    const blob = new Blob([levelJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "level.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [level]);

  const clearLevel = useCallback(() => {
    setLevel((prev) => ({
      ...prev,
      given: [],
      solutions: Array(totalCells).fill(0),
    }));
    setLevelState((prev) => ({
      ...prev,
      cellValues: Array(totalCells).fill(0),
    }));
  }, [totalCells]);

  const loadLevel = useCallback((levelData: Level) => {
    setSides(levelData.sides);
    setCards(levelData.cards);
    setDifficulty(levelData.difficulty || "medium");
    setLevel(levelData);
    setLevelState(buildInitialState(levelData));
  }, []);

  const loadLevelFromFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const levelData = JSON.parse(e.target?.result as string) as Level;
        loadLevel(levelData);
      } catch (error) {
        alert("Erro ao carregar nível: Formato JSON inválido");
        console.error(error);
      }
    };
    reader.readAsText(file);

    // Reset the input so the same file can be loaded again
    event.target.value = "";
  }, [loadLevel]);

  return {
    // State
    sides,
    cards,
    selectedValue,
    editMode,
    difficulty,
    totalCells,
    level,
    levelState,
    
    // Setters
    setSelectedValue,
    setEditMode,
    setDifficulty,
    
    // Handlers
    handleCellClick,
    
    // Sides management
    addSide,
    removeSide,
    updateSide,
    
    // Cards management
    addCard,
    removeCard,
    updateCard,
    
    // Level operations
    exportLevel,
    clearLevel,
    loadLevel,
    loadLevelFromFile,
    
    // Utilities
    calculateTotalCells,
  };
}
