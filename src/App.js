import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  const classNames = isWinningSquare ? "winning-square square" : "square";
  return (
    <button className={classNames} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares, lines) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, lines);
  let status;
  let winningSquares = [];
  if (winner) {
    status = "Winner: " + winner;
    winningSquares = calculateWinningSquares(squares, lines);
  } else if (isBoardFull(squares)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const boardSquares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      const isWinningSquare = winningSquares.includes(squareIndex);
      boardSquares.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinningSquare={isWinningSquare}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {boardSquares}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

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

function isBoardFull(squares) {
  return squares.every((square) => square);
}

function calculateWinningSquares(squares, lines) {
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return [];
}

function calculateWinner(squares, lines) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextMove = nextHistory.length - 1; 
    const [prevRow, prevCol] = history[currentMove].moveLocation || [];
    const currentMoveLocation = calculateMoveLocation(
      nextSquares,
      prevRow,
      prevCol
    );
    nextHistory[nextMove].moveLocation = currentMoveLocation;
    console.log(nextHistory);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function calculateMoveLocation(nextSquares, prevRow, prevCol){
    const currentIndex = nextSquares.findIndex(
      (square, index) => square!== history[currentMove][index]
    );
    const currentRow = Math.floor(currentIndex /3);
    const currentCol = currentIndex%3;
    if (prevRow === currentRow && prevCol === currentCol) return null;
    return [currentRow+1, currentCol+1];
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const moveLocation = squares.moveLocation;
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
      if (moveLocation) {
        const [row, col] = moveLocation;
        description += ` (${row}, ${col})`;
      }
    } else {
      description = "Go to game start";
    }
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
