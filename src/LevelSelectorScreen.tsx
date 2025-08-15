import {
  isLevelUnlocked,
  isLevelCompleted,
  type GameProgress,
} from "./utils/progress";

interface LevelSelectorScreenProps {
  levelNames: string[];
  progress: GameProgress;
  onLevelSelect: (levelIndex: number) => void;
  onBack: () => void;
}

function LevelSelectorScreen({
  levelNames,
  progress,
  onLevelSelect,
  onBack,
}: LevelSelectorScreenProps) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-8">
      <h1 className="text-4xl mb-8">Selecionar Nível</h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-4xl">
        {levelNames.map((levelName, index) => {
          // Extract the level name from the filename (remove .json extension)
          const displayName = levelName.replace(".json", "");
          const unlocked = isLevelUnlocked(progress, index);
          const completed = isLevelCompleted(progress, index);
          const isLastPlayed = progress.lastPlayedLevel === index;

          return (
            <button
              key={index}
              className={`
                py-3 px-4 border-b-4 rounded-xl text-lg transition-all min-w-[80px] relative
                ${
                  unlocked
                    ? completed
                      ? "bg-green-500 text-white border-green-600 hover:transform hover:scale-105 hover:shadow-xl cursor-pointer"
                      : isLastPlayed
                      ? "bg-yellow-400 text-blue-900 border-yellow-500 hover:transform hover:scale-105 hover:shadow-xl cursor-pointer"
                      : "bg-white text-blue-400 border-gray-200 hover:transform hover:scale-105 hover:shadow-xl cursor-pointer"
                    : "bg-gray-400 text-gray-600 border-gray-500 cursor-not-allowed opacity-50"
                }
              `}
              onClick={() => unlocked && onLevelSelect(index)}
              disabled={!unlocked}
            >
              {displayName}
              {completed && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  ✓
                </span>
              )}
              {!unlocked && (
                <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  🔒
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        className="mt-8 py-3 px-6 bg-gray-500 text-white border-b-4 border-gray-600 rounded-xl text-lg cursor-pointer hover:transform hover:scale-105 transition-all hover:shadow-xl"
        onClick={onBack}
      >
        Voltar
      </button>
    </div>
  );
}

export default LevelSelectorScreen;
