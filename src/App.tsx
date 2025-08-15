import { useState, useEffect } from "react";
import MenuScreen from "./MenuScreen";
import LevelSelectorScreen from "./LevelSelectorScreen";
import LevelScreen from "./LevelScreen";
import LevelCompleteScreen from "./LevelCompleteScreen";
import LevelEditor from "./LevelEditor";
import { loadLevels, type LevelWithName } from "./levels/loader";

type Screens = "menu" | "levelSelector" | "level" | "levelComplete" | "levelEditor";

function App() {
  const [screen, setScreen] = useState<Screens>("menu");
  const [levelIndex, setLevelIndex] = useState(0);
  const [levelsWithNames, setLevelsWithNames] = useState<LevelWithName[] | null>(null);

  // Load levels once on mount
  useEffect(() => {
    loadLevels()
      .then(setLevelsWithNames)
      .catch((err) => console.error("Error loading levels:", err));
  }, []);

  const openLevelSelector = () => {
    setScreen("levelSelector");
  };

  const selectLevel = (index: number) => {
    setLevelIndex(index);
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
    <div className="fixed inset-0 bg-blue-400 scheme-dark text-white flex overflow-hidden">
      {screen === "menu" && <MenuScreen onPlayClick={openLevelSelector} onLevelEditorClick={openLevelEditor} />}

      {screen === "levelSelector" && levelsWithNames && (
        <LevelSelectorScreen
          levelNames={levelsWithNames.map(lwn => lwn.name)}
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

      {screen === "levelEditor" && (
        <LevelEditor onBack={backToMenu} />
      )}
    </div>
  );
}

export default App;
