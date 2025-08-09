interface Props {
  id: number;
  value: number;
  solution: number;
}

export default function BoardCell({ id, value }: Props) {
  return (
    <div
      className="bg-white rounded-3xl text-black flex items-center justify-center text-4xl border-b-4 border-gray-200 transition-transform duration-150 ease-out"
      data-drop-cell-id={id}
    >
      {value === 0 ? "?" : value}
    </div>
  );
}
