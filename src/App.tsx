import { useState } from "react";
import MenuScreen from "./MenuScreen";
import LevelScreen from "./LevelScreen";
import { demoLevel } from "./levels/demo";

type Screens = "menu" | "level";

function App() {
  const [screen, setScreen] = useState<Screens>("menu");

  return (
    <div className="fixed inset-0 bg-blue-400 scheme-dark text-white flex overflow-hidden">
      {screen === "menu" && (
        <MenuScreen onPlayClick={() => setScreen("level")} />
      )}

      {screen === "level" && <LevelScreen level={demoLevel} />}
    </div>
  );
}

export default App;
