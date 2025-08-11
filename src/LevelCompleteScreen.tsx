interface Props {
  isLastLevel: boolean;
  onContinue: () => void;
}

export default function LevelCompleteScreen({ isLastLevel, onContinue }: Props) {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col bg-blue-400">
      <h1 className="text-6xl mb-8">Você venceu!</h1>
      <button
        className="py-4 w-72 bg-white text-blue-400 border-b-4 border-gray-200 rounded-2xl text-xl cursor-pointer hover:transform hover:scale-105 transition-all hover:shadow-2xl"
        onClick={onContinue}
      >
        {isLastLevel ? "Voltar ao menu" : "Próximo nível"}
      </button>
    </div>
  );
}
