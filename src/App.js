import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isSortUp, setIsSortUp] = useState(true);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sort() {
    setIsSortUp(!isSortUp);
  }

  const moves = history.map((squares, move) => {
    if (!isSortUp) {
      move = history.length - 1 - move;
    }
    let rowcolDesc;
    let description;
    if (move > 0) {
      rowcolDesc =
        " (" +
        Math.floor((move - 1) / 3 + 1) +
        "," +
        (((move - 1) % 3) + 1) +
        ")";
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {currentMove === move ? (
          currentMove === 9 ? (
            <span>Game Over! 平局</span>
          ) : (
            <span>You are at move #{currentMove}</span>
          )
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
        {rowcolDesc}
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
      <div className="game-info">
        <button onClick={() => sort()}>{isSortUp ? "降序" : "升序"}</button>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
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

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.name;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const squaresArray = [];
  for (let i = 0; i < 3; i++) {
    const arr = [];
    for (let j = 0; j < 3; j++) {
      arr.push(
        <Square
          key={i * 3 + j}
          value={squares[i * 3 + j]}
          onSquareClick={() => handleClick(i * 3 + j)}
          className={winner && winner.lineArr.includes(i * 3 + j) ? "win" : ""}
        />
      );
    }
    squaresArray.push(
      <div key={i + "parent"} className="board-row">
        {arr}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {squaresArray}
    </>
  );
}

function Square({ value, onSquareClick, className }) {
  return (
    <button className={"square " + className} onClick={onSquareClick}>
      {value}
    </button>
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { name: squares[a], lineArr: lines[i] };
    }
  }
  return null;
}
