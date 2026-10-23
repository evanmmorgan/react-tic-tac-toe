import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, humanPlayer, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winner;

  function handleClick(index) {
    const currentPlayer = xIsNext ? "X" : "O";
    if (squares[index] || winner || currentPlayer !== humanPlayer) {
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

function SwitchPlayerButton({ player, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      Switch to Player {player}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [humanPlayer, setHumanPlayer] = useState("X");

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const currentPlayer = xIsNext ? "X" : "O";
  const nextHumanPlayer = currentPlayer === "X" ? "O" : "X";
  const gameOver =
    calculateWinner(currentSquares) || currentSquares.every(Boolean);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function switchPlayer() {
    if (gameOver) {
      return;
    }

    const bestMove = findBestMove(currentSquares, currentPlayer);
    if (bestMove === null) {
      return;
    }

    const nextSquares = currentSquares.slice();
    nextSquares[bestMove] = currentPlayer;
    handlePlay(nextSquares);
    setHumanPlayer(nextHumanPlayer);
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
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          humanPlayer={humanPlayer}
          squares={currentSquares}
          onPlay={handlePlay}
        />
        <SwitchPlayerButton
          player={nextHumanPlayer}
          disabled={Boolean(gameOver)}
          onClick={switchPlayer}
        />
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

function findBestMove(squares, player) {
  let bestMove = null;
  let bestScore = -Infinity;

  for (let index = 0; index < squares.length; index += 1) {
    if (squares[index]) {
      continue;
    }

    const nextSquares = squares.slice();
    nextSquares[index] = player;
    const score = minimax(
      nextSquares,
      player === "X" ? "O" : "X",
      player
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}

function minimax(squares, currentPlayer, maximizingPlayer) {
  const winner = calculateWinner(squares);
  if (winner) {
    return winner === maximizingPlayer ? 1 : -1;
  }
  if (squares.every(Boolean)) {
    return 0;
  }

  const isMaximizing = currentPlayer === maximizingPlayer;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let index = 0; index < squares.length; index += 1) {
    if (squares[index]) {
      continue;
    }

    const nextSquares = squares.slice();
    nextSquares[index] = currentPlayer;
    const score = minimax(
      nextSquares,
      currentPlayer === "X" ? "O" : "X",
      maximizingPlayer
    );
    bestScore = isMaximizing
      ? Math.max(bestScore, score)
      : Math.min(bestScore, score);
  }

  return bestScore;
}
