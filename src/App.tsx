import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [rows, setRows] = useState<number>(3);
  const [currentClickCount, setCurrentClickCount] = useState(0);
  const [ticTacItems, setTicTacItems] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    document.documentElement.style.setProperty("--columns", rows.toString());
    setTicTacItems(new Array(Math.pow(rows, 2)).fill(""));
  }, [rows]);

  const handleRowsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRows(parseInt(e.target.value) || 0);
  };

  const validateTicTac = (
    matrix: string[],
    currentI: number,
    currentJ: number,
    item: string
  ): string => {
    if (currentClickCount < 4) return "";
    const arr = new Array(rows).fill("");
    if (
      arr.every((_, idx) => matrix[currentI * rows + idx] === item) ||
      arr.every((_, idx) => matrix[currentJ + rows * idx] === item) ||
      (currentI === currentJ &&
        matrix.every((_, idx) =>
          idx % rows === Math.floor(idx / rows) ? item === matrix[idx] : true
        )) ||
      (currentI + currentJ === rows - 1 &&
        matrix.every((_, idx) =>
          (idx % rows) + Math.floor(idx / rows) === rows - 1
            ? item === matrix[idx]
            : true
        ))
    )
      return `player ${item} wins`;
    if (currentClickCount + 1 === Math.pow(rows, 2)) return "no result";
    return "";
  };

  const handleCellClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const id = target.id;
    if (!id) return;
    const currentElement = target.getAttribute("data-value");
    if (!currentElement) return;
    const { rows, cols, cell } = JSON.parse(currentElement);
    if (ticTacItems[cell] || result) return;
    const currentDom = document.getElementById(id) as HTMLElement;
    const icon = currentClickCount % 2 === 0 ? "O" : "X";
    ticTacItems[cell] = icon;
    currentDom.innerHTML = icon;
    setCurrentClickCount((prev) => prev + 1);
    setResult(validateTicTac(ticTacItems, rows, cols, icon));
  };

  const arrays: number[] = useMemo(() => {
    if (!rows) return [];
    return new Array(Math.pow(rows, 2)).fill(0).map((_, idx) => idx);
  }, [rows]);

  return (
    <>
      <input value={rows} onChange={handleRowsChange} />
      <div className="tic-tac" onClick={handleCellClick}>
        {arrays.map((val) => {
          const cols = Math.floor(val % rows);
          const currentRows = Math.floor(val / rows);
          return (
            <div
              className={`tic-tac__cell row-${currentRows} col-${cols}`}
              key={`cell-${val}`}
              id={`cols-${cols}-rows-${currentRows}-cell-${val}`}
              data-value={JSON.stringify({
                cols,
                rows: currentRows,
                cell: val,
              })}
              style={{}}
            ></div>
          );
        })}
      </div>
      <p>{result}</p>
    </>
  );
}

export default App;
