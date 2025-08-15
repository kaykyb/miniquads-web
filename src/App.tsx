import { useState, useEffect } from "react";
import MenuScreen from "./MenuScreen";
import LevelSelectorScreen from "./LevelSelectorScreen";
import LevelScreen from "./LevelScreen";
import LevelCompleteScreen from "./LevelCompleteScreen";
import LevelEditor from "./LevelEditor";
import { loadLevels, type LevelWithName } from "./levels/loader";
import {
  loadProgress,
  saveProgress,
  markLevelCompleted,
  updateLastPlayedLevel,
  resetProgress,
  type GameProgress,
} from "./utils/progress";

type Screens =
  | "menu"
  | "levelSelector"
  | "level"
  | "levelComplete"
  | "levelEditor";

function App() {
  const [screen, setScreen] = useState<Screens>("menu");
  const [levelIndex, setLevelIndex] = useState(0);
  const [levelsWithNames, setLevelsWithNames] = useState<
    LevelWithName[] | null
  >(null);
  const [progress, setProgress] = useState<GameProgress | null>(null);

  // Load levels once on mount
  useEffect(() => {
    loadLevels()
      .then((levels) => {
        setLevelsWithNames(levels);
        // Load progress after levels are loaded
        const gameProgress = loadProgress(levels.length);
        setProgress(gameProgress);
      })
      .catch((err) => console.error("Error loading levels:", err));
  }, []);

  const openLevelSelector = () => {
    setScreen("levelSelector");
  };

  const selectLevel = (index: number) => {
    if (!progress) return;

    // Update last played level and save progress
    const updatedProgress = updateLastPlayedLevel(progress, index);
    setProgress(updatedProgress);
    saveProgress(updatedProgress);

    setLevelIndex(index);
    setScreen("level");
  };

  const openLevelEditor = () => {
    setScreen("levelEditor");
  };

  const backToMenu = () => {
    setScreen("menu");
  };

  const handleResetProgress = () => {
    if (!levelsWithNames) return;

    const newProgress = resetProgress(levelsWithNames.length);
    setProgress(newProgress);
  };

  const handleLevelComplete = () => {
    if (!progress) return;

    // Mark level as completed and save progress
    const updatedProgress = markLevelCompleted(progress, levelIndex);
    setProgress(updatedProgress);
    saveProgress(updatedProgress);

    setScreen("levelComplete");
  };

  const handleContinueFromWin = () => {
    if (!levelsWithNames) {
      setScreen("menu");
      return;
    }

    if (levelIndex + 1 < levelsWithNames.length) {
      setLevelIndex((prev) => prev + 1);
      setScreen("level");
    } else {
      setScreen("menu");
    }
  };

  return (
    <div className="fixed inset-0 scheme-dark text-white flex overflow-hidden">
      {screen === "menu" && (
        <MenuScreen
          onPlayClick={openLevelSelector}
          onLevelEditorClick={openLevelEditor}
          onResetProgress={handleResetProgress}
        />
      )}

      {screen === "levelSelector" && levelsWithNames && progress && (
        <LevelSelectorScreen
          levelNames={levelsWithNames.map((lwn) => lwn.name)}
          progress={progress}
          onLevelSelect={selectLevel}
          onBack={backToMenu}
        />
      )}

      {screen === "level" && levelsWithNames && (
        <LevelScreen
          key={levelIndex}
          level={levelsWithNames[levelIndex].level}
          onLevelComplete={handleLevelComplete}
        />
      )}

      {screen === "levelComplete" && levelsWithNames && (
        <LevelCompleteScreen
          isLastLevel={levelIndex + 1 >= levelsWithNames.length}
          onContinue={handleContinueFromWin}
        />
      )}

      {screen === "levelEditor" && <LevelEditor onBack={backToMenu} />}
    </div>
  );
}

export default App;
