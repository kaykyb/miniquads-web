import { useState } from "react";
import MenuScreen from "./MenuScreen";
import LevelScreen from "./LevelScreen";
import { demoLevel } from "./levels/demo";

type Screens = "menu" | "level";

function App() {
  const [screen, setScreen] = useState<Screens>("menu");

  return (
    <div className="absolute top-0 left-0 h-screen w-screen bg-blue-400 scheme-dark text-white flex">
      {screen === "menu" && (
        <MenuScreen onPlayClick={() => setScreen("level")} />
      )}

      {screen === "level" && <LevelScreen level={demoLevel} />}
    </div>
  );
}

export default App;
