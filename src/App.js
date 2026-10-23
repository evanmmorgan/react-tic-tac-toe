import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function BoardSize({ onSubmit }) {
  const [rows, setRows] = useState("3");
  const [columns, setColumns] = useState("3");

  function handleSubmit(event) {
    event.preventDefault();
    const rowCount = Number(rows);
    const columnCount = Number(columns);

    if (
      Number.isSafeInteger(rowCount) &&
      rowCount > 0 &&
      Number.isSafeInteger(columnCount) &&
      columnCount > 0
    ) {
      onSubmit(rowCount, columnCount);
    }
  }

  return (
    <form className="board-size" onSubmit={handleSubmit}>
      <label>
        Rows
        <input
          type="number"
          min="1"
          step="1"
          required
          value={rows}
          onChange={(event) => setRows(event.target.value)}
        />
      </label>
      <label>
        Columns
        <input
          type="number"
          min="1"
          step="1"
          required
          value={columns}
          onChange={(event) => setColumns(event.target.value)}
        />
      </label>
      <button type="submit">Set board size</button>
    </form>
  );
}

function Board({ xIsNext, squares, rows, columns, onPlay }) {
  const winner = calculateWinner(squares, rows, columns);
  const isDraw = squares.every(Boolean) && !winner;

  function handleClick(index) {
    if (squares[index] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: rows }, (_, row) => (
        <div className="board-row" key={row}>
          {Array.from({ length: columns }, (_, col) => {
            const index = row * columns + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handleBoardSizeChange(nextRows, nextColumns) {
    if (nextRows === rows && nextColumns === columns) {
      return;
    }

    setRows(nextRows);
    setColumns(nextColumns);
    setHistory([Array(nextRows * nextColumns).fill(null)]);
    setCurrentMove(0);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <BoardSize onSubmit={handleBoardSizeChange} />
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            rows={rows}
            columns={columns}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares, rows, columns) {
  const winLength = Math.min(rows, columns);
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const value = squares[row * columns + column];
      if (!value) {
        continue;
      }

      for (const [rowStep, columnStep] of directions) {
        const endRow = row + (winLength - 1) * rowStep;
        const endColumn = column + (winLength - 1) * columnStep;

        if (
          endRow < 0 ||
          endRow >= rows ||
          endColumn < 0 ||
          endColumn >= columns
        ) {
          continue;
        }

        let isWinningLine = true;
        for (let step = 1; step < winLength; step += 1) {
          const index =
            (row + step * rowStep) * columns + column + step * columnStep;
          if (squares[index] !== value) {
            isWinningLine = false;
            break;
          }
        }

        if (isWinningLine) {
          return value;
        }
      }
    }
  }

  return null;
}
