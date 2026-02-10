const el = (css) => document.querySelector(css);
const group = (css) => document.querySelectorAll(css);
const create = (html) => document.createElement(html);

let board; //Spielfeld
let rows = 4;
let columns = 4;
let prevBoard;
let isAnimating = false;
let score = 0;

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
      const val = arr[i] * 2;
      merged.push(val);

      score += val;

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
  if (isAnimating) return;

  prevBoard = board.map((row) => [...row]);

  if (e.code === "ArrowLeft") moveLeft();
  else if (e.code === "ArrowRight") moveRight();
  else if (e.code === "ArrowUp") moveUp();
  else if (e.code === "ArrowDown") moveDown();

  addNum();
  renderBoard(true); //mit Animation
  updateScore();
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

function renderBoard(animate = false) {
  const tiles = group(".tile");

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const index = i * columns + j;
      const tile = tiles[index];
      const value = board[i][j];

      // پاک کردن کلاس‌های قبلی
      for (let cls of [...tile.classList]) {
        if (cls.startsWith("x")) tile.classList.remove(cls);
      }

      if (value === 0) {
        tile.innerText = "";
        tile.style.transform = "";
        continue;
      }

      tile.innerText = value;
      tile.classList.add(`x${value}`);

      // ✨ انیمیشن حرکت واقعی
      if (animate && prevBoard) {
        let fromRow = i;
        let fromCol = j;

        // پیدا کردن جای قبلی همین عدد
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < columns; c++) {
            if (prevBoard[r][c] === value && board[r][c] !== value) {
              fromRow = r;
              fromCol = c;
            }
          }
        }

        const dx = (fromCol - j) * 100;
        const dy = (fromRow - i) * 100;

        if (dx !== 0 || dy !== 0) {
          tile.style.transition = "none";
          tile.style.transform = `translate(${dx}%, ${dy}%)`;

          requestAnimationFrame(() => {
            tile.style.transition = "transform 150ms ease";
            tile.style.transform = "translate(0,0)";
          });
        }
      }
    }
  }
}

function updateScore() {
  el("#score").innerText = score;
}

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
  score = 0;
  el("#board").innerHTML = "";
  createBoard();
  renderBoard();
  updateScore();
}

createBoard();
renderBoard();
updateScore();
console.dir(board);
