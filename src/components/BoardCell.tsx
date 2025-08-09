interface Props {
  id: number;
  value: number;
  solution: number;
}

export default function BoardCell({ value, solution }: Props) {
  return (
    <div className="bg-white rounded-3xl text-black flex items-center justify-center text-4xl border-b-4 border-gray-200">
      {value === 0 ? "?" : value}
    </div>
  );
}
