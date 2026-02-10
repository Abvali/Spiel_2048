const el = (css) => document.querySelector(css);
const group = (css) => document.querySelectorAll(css);
const create = (html) => document.createElement(html);

let board; //Spielfeld
let rows = 4;
let columns = 4;

// window.addEventListener("DOMContentLoaded", () => {
//   createBoard();
//   renderBoard();
// });

function showGameOver() {
  const overlay = create("div");
  overlay.className = "game-over";

  const text = create("h1");
  text.innerText = "Game over!";

  const btn = create("button");
  btn.innerText = "Try again";
  btn.onclick = restartGame;

  overlay.append(text, btn);
  el("#board").append(overlay);
}

function restartGame() {
  el("#board").innerHTML = "";
  createBoard();
  renderBoard();
}

// initial board
function createBoard() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const tile = create("div");
      tile.classList.add("tile");
      el("#board").append(tile);
    }
  }
  addNum();
  addNum();
}

// Die Zahl 2 oder 4 ermitteln
function twoOrFour() {
  const twoNum = Math.floor(Math.random() * 2 + 1);
  return twoNum == 2 ? 2 : 4;
}

// leerePlätze auf dem Spielfeld finden und Neue Nummer hinzufügen
function addNum() {
  const emptyCells = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] === 0) {
        const obj = {
          r: i,
          c: j,
        };
        emptyCells.push(obj);
      }
    }
  }
  if (emptyCells.length === 0 && canMove() === false) {
    showGameOver();
    return;
  }

  const randomPlace = Math.floor(Math.random() * emptyCells.length);
  const placeToPush = emptyCells[randomPlace];

  const twoFour = twoOrFour();
  board[placeToPush.r][placeToPush.c] = twoFour;
}

// Bewegung auf jedem row auf dem Spielfeld
function slideLeft(row) {
  let merged = [];
  let arr = [];
  for (let i = 0; i < row.length; i++) {
    if (row[i] !== 0) {
      arr.push(row[i]);
    }
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      merged.push(arr[i] * 2);
      i++;
    } else {
      merged.push(arr[i]);
    }
  }
  while (merged.length < 4) {
    merged.push(0);
  }
  return merged;
}

// Bewegung nach Links
function moveLeft() {
  for (let i = 0; i < rows; i++) {
    board[i] = slideLeft(board[i]);
  }
}

//Bevegung nach Rechts (reverse -> slideLeft -> reverse)
function moveRight() {
  for (let i = 0; i < rows; i++) {
    const newBoard = slideLeft([...board[i]].reverse());
    board[i] = newBoard.reverse();
  }
}

// um Spalten in Zeilen umzuwandeln (Die Funktion wird zum Bewegung nach Oben und Unten verwendet)
function transpose() {
  let newBoard = [[], [], [], []];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      newBoard[j][i] = board[i][j];
    }
  }
  board = newBoard;
}

//Bevegung nach Oben (transpose -> moveLeft -> transpose)
function moveUp() {
  transpose();
  moveLeft();
  transpose();
}

//Bevegung nach Rechts (transpose -> moveRight -> transpose)
function moveDown() {
  transpose();
  moveRight();
  transpose();
}

// Pfeiltaste Event
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") moveLeft();
  else if (e.code === "ArrowRight") moveRight();
  else if (e.code === "ArrowUp") moveUp();
  else if (e.code === "ArrowDown") moveDown();

  addNum();
  renderBoard();
});

// Game over funktion
function canMove() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] === 0) return true; //leere Plätze -> Bewegung möglich
      if (
        (i < rows - 1 && board[i][j] === board[i + 1][j]) || //gleiche Zahlen -> merge möglich
        (j < columns - 1 && board[i][j] === board[i][j + 1])
      )
        return true;
    }
  }
  return false; // sonst ist das Spiel vorbei
}

function renderBoard() {
  const tile = group(".tile");

  // console.log(tile);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let index = i * columns + j;

      // Alle Classen mit x anfangen entfernen
      for (let cls of tile[index].classList) {
        if (cls.startsWith("x")) {
          tile[index].classList.remove(cls);
        }
      }
      const value = board[i][j];
      if (value === 0) {
        tile[index].innerText = "";
      } else if (value > 0) {
        tile[index].innerText = value;
        tile[index].classList.add(`x${value}`);
      }
    }
  }
  // console.log(tile);
}

createBoard();
renderBoard();
console.dir(board);
