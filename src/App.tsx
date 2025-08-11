import { useState } from "react";
import MenuScreen from "./MenuScreen";
import LevelScreen from "./LevelScreen";
import LevelCompleteScreen from "./LevelCompleteScreen";
import { levels } from "./levels";

type Screens = "menu" | "level" | "levelComplete";

function App() {
  const [screen, setScreen] = useState<Screens>("menu");
  const [levelIndex, setLevelIndex] = useState(0);

  const startGame = () => {
    setLevelIndex(0);
    setScreen("level");
  };

  const handleLevelComplete = () => {
    setScreen("levelComplete");
  };

  const handleContinueFromWin = () => {
    if (levelIndex + 1 < levels.length) {
      setLevelIndex((prev) => prev + 1);
      setScreen("level");
    } else {
      setScreen("menu");
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-400 scheme-dark text-white flex overflow-hidden">
      {screen === "menu" && <MenuScreen onPlayClick={startGame} />}

      {screen === "level" && (
        <LevelScreen
          key={levelIndex}
          level={levels[levelIndex]}
          onLevelComplete={handleLevelComplete}
        />
      )}

      {screen === "levelComplete" && (
        <LevelCompleteScreen
          isLastLevel={levelIndex + 1 >= levels.length}
          onContinue={handleContinueFromWin}
        />
      )}
    </div>
  );
}

export default App;
