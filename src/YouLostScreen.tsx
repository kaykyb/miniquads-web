interface Props {
  onRestart: () => void;
  onBackToMenu?: () => void;
}

function YouLostScreen({ onRestart, onBackToMenu }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 text-center max-w-md mx-4 border-2 border-red-500">
        <div className="text-6xl mb-4">💀</div>
        <h2 className="text-3xl font-bold text-red-400 mb-4">Game Over!</h2>
        <p className="text-gray-300 mb-6 text-lg">
          Suas vidas acabaram. Não desista!
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-200"
          >
            Tentar Novamente
          </button>
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition-colors duration-200"
            >
              Voltar ao Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default YouLostScreen;
