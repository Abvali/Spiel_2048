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
  if (emptyCells.length === 0) return;
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
  addNum();
  renderBoard();
}

//Bevegung nach Rechts (reverse -> slideLeft -> reverse)
function moveRight() {
  for (let i = 0; i < rows; i++) {
    const newBoard = slideLeft([...board[i]].reverse());
    board[i] = newBoard.reverse();
  }
  addNum();
  renderBoard();
}

//Bevegung nach Oben (transpose -> moveLeft -> transpose)
function moveUp() {
  console.log("up");
}

//Bevegung nach Rechts (transpose -> moveRight -> transpose)
function moveDown() {
  console.log("down");
}
// Pfeiltaste Event
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    moveLeft();
  } else if (e.code === "ArrowRight") {
    moveRight();
  } else if (e.code === "ArrowUp") {
    moveUp();
  } else if (e.code === "ArrowDown") {
    moveDown();
  }
});

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
