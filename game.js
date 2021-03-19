let xArea, yArea;
let board;
let gameOver = false;
const X = 1;
const O = -1;
const SPACE = 5;
const none = 0;
let gameId;
let gameCount = 0;
let aPlayerId = O; // Invitor plays first, considering toggle
let bPlayerId = X;
let aScore = 0;
let bScore = 0;
let gameStatus;
let starter;
let Listener;

/*Button um Einladungslink zu erstellen*/
/*let newLink= document.getElementById("newlink");
//console.log(newGameBtn);
newLink.addEventListener("click", createLink);
async function createLink() {
  let gameIdA = gameId;
  console.log(gameIdA);
  window.location.href =
    "/game.html?gameId=" + gameIdA + "&playerId=" + gameData.playerId;
}*/

/* Resets the game */
function resetGame() {
  clear();
  gameOver = false;
  board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  // Toggle
  aPlayerId = -aPlayerId;
  bPlayerId = -aPlayerId;
  redraw();
}

/* p5.js standard setup function */
function setup() {
  let size = min(windowHeight - 100, windowWidth - 100);
  createCanvas(size, size);
  xArea = width / 3;
  yArea = height / 3;
  resetGame();
  noLoop();
}

/* The main drawing loop*/
function draw() {
  /* Inner function to draw the Tic Tac Toe board */
  function drawBoard() {
    strokeWeight(1);

    line(0, yArea, height, yArea);
    line(0, 2 * yArea, height, 2 * yArea);

    line(xArea, 0, xArea, width);
    line(2 * xArea, 0, 2 * xArea, width);
  }

  /* Inner Function to draw all player symbols */
  function drawXO() {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (board[i][j] !== 0) {
          drawSymbol(i, j, board[i][j]);
        }
      }
    }
  }

  /* Inner Function to draw a player symbol */
  function drawSymbol(x, y, sign) {
    if (sign === X) {
      drawX(x, y);
    } else {
      drawO(x, y);
    }
  }

  /* Inner Function to draw a player X symbol */
  function drawX(x, y) {
    strokeWeight(SPACE);
    line(
      x * xArea + SPACE,
      y * yArea + SPACE,
      x * xArea + xArea - SPACE,
      y * yArea + yArea - SPACE
    );

    line(
      x * xArea + SPACE,
      y * yArea + yArea - SPACE,
      x * xArea + xArea - SPACE,
      y * yArea + SPACE
    );
  }

  /* Inner Function to draw a player O symbol */
  function drawO(x, y) {
    strokeWeight(SPACE);
    ellipseMode(CORNER);
    ellipse(
      x * xArea + SPACE,
      y * yArea + SPACE,
      xArea - 2 * SPACE,
      yArea - 2 * SPACE
    );
  }

  // Actual draw function implementation;
  clear();
  drawBoard();
  drawXO();
}

/* Logical function checks whether the game is undecided */
function checkDraw(b) {
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      if (b[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
}

/* Logical function checks all possible win combinations for a given player */
function hasWon(b, player) {
  for (let i = 0; i <= 2; i++) {
    // Horizontal
    if (b[i][0] === player && b[i][1] === player && b[i][2] === player)
      return true;
    // Vertical
    if (b[0][i] === player && b[1][i] === player && b[2][i] === player)
      return true;
  }
  // Diagonal
  if (b[0][0] === player && b[1][1] === player && b[2][2] === player)
    return true;
  // Counter Diagonal
  if (b[2][0] === player && b[1][1] === player && b[0][2] === player)
    return true;
  return false;
}

/* Alert User */
function alertUser(text) {
  document.getElementById("alert").innerText = text;
  document.getElementById("score").innerText =
    "Spieler B " + bScore + " : " + aScore + " Spieler A";
}

/* Main Action based on user interaction */
function mousePressed() {
  if (gameOver) {
    gameCount++;
    resetGame();
  } else {
    let x = Math.floor(mouseX / xArea);
    let y = Math.floor(mouseY / yArea);
    if (x < 3 && y < 3) {
      if (board[x][y] === 0) {
        board[x][y] = aPlayerId;
        redraw();
      } else {
        board[x][y] = bPlayerId;
        redraw();
      }
    }
    if (checkDraw(board)) {
      alertUser("Untentschieden");
      gameStatus = "draw";
      gameOver = true;
    } else if (hasWon(board, aPlayerId)) {
      aScore++;
      alertUser("Gewonnen!");
      gameStatus = "aWon";
      //starter = "b";
      gameOver = true;
    } else {
      redraw();
      if (checkDraw(board)) {
        gameOver = true;
      } else if (hasWon(board, bPlayerId)) {
        bScore++;
        alertUser("Verloren :( ");
        gameStatus = "bWon";
        //starter = "a";
        gameOver = true;
      }
    }
  }
} // mousePressed
