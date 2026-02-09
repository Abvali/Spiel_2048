const el = (css) => document.querySelector(css);
const group = (css) => document.querySelectorAll(css);
const create = (html) => document.createElement(html);

let board;

let rows = 4;
let columns = 4;
let score = 0;
let countTime = 0;

function twoOrFour() {
  const twoNum = Math.floor(Math.random() * 2 + 1);
  return twoNum == 2 ? 2 : 4;
}

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
  console.log(emptyCells);
  const randomPlace = Math.floor(Math.random() * emptyCells.length);
  console.log(emptyCells[randomPlace]);

  const twoFour = twoOrFour();
  console.log(twoFour);
}

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

createBoard();
addNum();
