import { useState, useEffect } from "react";
import MenuScreen from "./MenuScreen";
import LevelScreen from "./LevelScreen";
import LevelCompleteScreen from "./LevelCompleteScreen";
import LevelEditor from "./LevelEditor";
import type { Level } from "./models/level";
import { loadLevels } from "./levels/loader";

type Screens = "menu" | "level" | "levelComplete" | "levelEditor";

function App() {
  const [screen, setScreen] = useState<Screens>("menu");
  const [levelIndex, setLevelIndex] = useState(0);
  const [levels, setLevels] = useState<Level[] | null>(null);

  // Load levels once on mount
  useEffect(() => {
    loadLevels()
      .then(setLevels)
      .catch((err) => console.error("Error loading levels:", err));
  }, []);

  const startGame = () => {
    if (!levels) return; // Levels not yet loaded
    setLevelIndex(0);
    setScreen("level");
  };

  const openLevelEditor = () => {
    setScreen("levelEditor");
  };

  const backToMenu = () => {
    setScreen("menu");
  };

  const handleLevelComplete = () => {
    setScreen("levelComplete");
  };

  const handleContinueFromWin = () => {
    if (!levels) {
      setScreen("menu");
      return;
    }

    if (levelIndex + 1 < levels.length) {
      setLevelIndex((prev) => prev + 1);
      setScreen("level");
    } else {
      setScreen("menu");
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-400 scheme-dark text-white flex overflow-hidden">
      {screen === "menu" && <MenuScreen onPlayClick={startGame} onLevelEditorClick={openLevelEditor} />}

      {screen === "level" && levels && (
        <LevelScreen
          key={levelIndex}
          level={levels[levelIndex]}
          onLevelComplete={handleLevelComplete}
        />
      )}

      {screen === "levelComplete" && levels && (
        <LevelCompleteScreen
          isLastLevel={levelIndex + 1 >= levels.length}
          onContinue={handleContinueFromWin}
        />
      )}

      {screen === "levelEditor" && (
        <LevelEditor onBack={backToMenu} />
      )}
    </div>
  );
}

export default App;
