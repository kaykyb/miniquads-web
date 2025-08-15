interface LevelSelectorScreenProps {
  levelNames: string[];
  onLevelSelect: (levelIndex: number) => void;
  onBack: () => void;
}

function LevelSelectorScreen({ levelNames, onLevelSelect, onBack }: LevelSelectorScreenProps) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-8">
      <h1 className="text-4xl mb-8">Selecionar Nível</h1>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-4xl">
        {levelNames.map((levelName, index) => {
          // Extract the level name from the filename (remove .json extension)
          const displayName = levelName.replace('.json', '');
          
          return (
            <button
              key={index}
              className="py-3 px-4 bg-white text-blue-400 border-b-4 border-gray-200 rounded-xl text-lg cursor-pointer hover:transform hover:scale-105 transition-all hover:shadow-xl min-w-[80px]"
              onClick={() => onLevelSelect(index)}
            >
              {displayName}
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
