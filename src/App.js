import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, size, onPlay }) {
  const winner = calculateWinner(squares, size);
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
      {Array.from({ length: size }, (_, row) => (
        <div className="board-row" key={row}>
          {Array.from({ length: size }, (_, col) => {
            const index = row * size + col;
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
  const [boardSize, setBoardSize] = useState(3);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function handleSizeChange(event) {
    const nextSize = Number(event.target.value);
    setHistory(
      history.map((squares) => resizeBoard(squares, boardSize, nextSize)),
    );
    setBoardSize(nextSize);
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
    <div>
      <label className="board-size-control">
        Board size
        <select value={boardSize} onChange={handleSizeChange}>
          {[3, 4, 5, 6, 7, 8].map((size) => (
            <option key={size} value={size}>
              {size} × {size}
            </option>
          ))}
        </select>
      </label>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            size={boardSize}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}

function resizeBoard(squares, oldSize, newSize) {
  const resizedSquares = Array(newSize * newSize).fill(null);
  const overlappingSize = Math.min(oldSize, newSize);

  for (let row = 0; row < overlappingSize; row++) {
    for (let col = 0; col < overlappingSize; col++) {
      resizedSquares[row * newSize + col] = squares[row * oldSize + col];
    }
  }

  return resizedSquares;
}

function calculateWinner(squares, size) {
  for (let index = 0; index < size; index++) {
    const rowStart = index * size;
    const columnStart = index;
    const firstInRow = squares[rowStart];
    const firstInColumn = squares[columnStart];

    if (
      firstInRow &&
      Array.from({ length: size }, (_, col) => squares[rowStart + col]).every(
        (square) => square === firstInRow,
      )
    ) {
      return firstInRow;
    }

    if (
      firstInColumn &&
      Array.from({ length: size }, (_, row) => squares[row * size + index]).every(
        (square) => square === firstInColumn,
      )
    ) {
      return firstInColumn;
    }
  }

  const firstDiagonal = squares[0];
  const firstAntiDiagonal = squares[size - 1];

  if (
    firstDiagonal &&
    Array.from({ length: size }, (_, index) => squares[index * size + index]).every(
      (square) => square === firstDiagonal,
    )
  ) {
    return firstDiagonal;
  }

  if (
    firstAntiDiagonal &&
    Array.from({ length: size }, (_, index) => squares[index * size + (size - 1 - index)]).every(
      (square) => square === firstAntiDiagonal,
    )
  ) {
    return firstAntiDiagonal;
  }

  return null;
}
