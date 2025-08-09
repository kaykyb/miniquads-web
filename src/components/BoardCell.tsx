interface Props {
  id: number;
  value: number;
  solution: number;
}

export default function BoardCell({ id, value }: Props) {
  const solved = value !== 0;

  // if the cell is not solved, it should be traced with a dashed border
  const borderStyle = solved ? "border-b-4 border-gray-200 bg-white " : "border-4 border-gray-200 border-dashed bg-transparent";
  const textStyle = solved ? "text-black" : "text-white";

  return (
    <div
      className={`rounded-3xl flex items-center justify-center text-4xl ${borderStyle} transition-transform duration-150 ease-out ${textStyle}`}
      data-drop-cell-id={id}
    >
      {solved ? value : "?"}
    </div>
  );
}
