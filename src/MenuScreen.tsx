interface MenuScreenProps {
  onPlayClick: () => void;
  onLevelEditorClick: () => void;
  onResetProgress?: () => void;
}

function MenuScreen({ onPlayClick, onLevelEditorClick, onResetProgress }: MenuScreenProps) {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      <h1 className="text-6xl">Miniquads</h1>
      <div className="flex justify-center items-center flex-col mt-8 space-y-4">
        <button
          className="py-4 w-72 bg-white text-blue-400 border-b-4 border-gray-200 rounded-2xl text-xl cursor-pointer hover:transform hover:scale-105 transition-all hover:shadow-2xl"
          onClick={onPlayClick}
        >
          Jogar
        </button>
        <button
          className="py-4 w-72 bg-green-500 text-white border-b-4 border-green-600 rounded-2xl text-xl cursor-pointer hover:transform hover:scale-105 transition-all hover:shadow-2xl"
          onClick={onLevelEditorClick}
        >
          Editor de Níveis
        </button>
        {onResetProgress && (
          <button
            className="py-2 w-72 bg-red-500 text-white border-b-4 border-red-600 rounded-2xl text-sm cursor-pointer hover:transform hover:scale-105 transition-all hover:shadow-2xl"
            onClick={() => {
              if (confirm('Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.')) {
                onResetProgress();
              }
            }}
          >
            Resetar Progresso
          </button>
        )}
      </div>
    </div>
  );
}

export default MenuScreen;
