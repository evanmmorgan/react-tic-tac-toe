import { useCallback, useEffect, useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winner;

  function handleClick(index) {
    if (!xIsNext || squares[index] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[index] = "X";
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
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
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
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const handlePlay = useCallback((nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }, [currentMove, history]);

  useEffect(() => {
    if (xIsNext || calculateWinner(currentSquares)) {
      return;
    }

    const move = findBestMove(currentSquares);
    if (move === null) {
      return;
    }

    const nextSquares = currentSquares.slice();
    nextSquares[move] = "O";
    handlePlay(nextSquares);
  }, [currentMove, currentSquares, handlePlay, xIsNext]);

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
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function findBestMove(squares) {
  const moveOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

  for (const player of ["O", "X"]) {
    for (const index of moveOrder) {
      if (squares[index]) {
        continue;
      }

      const nextSquares = squares.slice();
      nextSquares[index] = player;
      if (calculateWinner(nextSquares) === player) {
        return index;
      }
    }
  }

  return moveOrder.find((index) => !squares[index]) ?? null;
}
