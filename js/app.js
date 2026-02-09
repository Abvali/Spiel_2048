const el = (css) => document.querySelector(css);
const group = (css) => document.querySelectorAll(css);
const create = (html) => document.createElement(html);

let board; //Spielfeld

let rows = 4;
let columns = 4;

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
  console.log(twoFour);
}

createBoard();
addNum();
console.dir(board);
