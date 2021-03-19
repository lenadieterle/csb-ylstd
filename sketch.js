/*
  Tic Tac Toe in JavaScript using p5.js
  (c) 2020-12-21 Raphael Volz (raphael.volz@hs-pforzheim.de)
 */

let xArea, yArea;
let board;
let gameOver = false;
const X = 1;
const O = -1;
const SPACE = 5;
const none = 0;
let human = O; // Human plays first, considering toggle
let computer = X;
let humanScore = 0;
let computerScore = 0;

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
  human = -human;
  computer = -human;
  if (computer === X) {
    moveComputer();
  }
  alertUser("Spiele Tic Tac Toe mit mir!");
  player = human;
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
    "Computer " + computerScore + " : " + humanScore + " Mensch";
}

/* Main Action based on user interaction */
function mousePressed() {
  if (gameOver) {
    resetGame();
  } else {
    let x = Math.floor(mouseX / xArea);
    let y = Math.floor(mouseY / yArea);
    if (x < 3 && y < 3) {
      if (board[x][y] === 0) {
        board[x][y] = human;
        redraw();
      }
    }
    if (checkDraw(board)) {
      alertUser("Friede, Freude, Eierkuchen.");
      gameOver = true;
    } else if (hasWon(board, human)) {
      humanScore++;
      alertUser("Bravo, du hast gewonnen!");
      gameOver = true;
    } else {
      moveComputer();
      redraw();
      if (checkDraw(board)) {
        gameOver = true;
      } else if (hasWon(board, computer)) {
        computerScore++;
        alertUser("Hehe, mein ist der Sieg!");
        gameOver = true;
      }
    }
  }
} // mousePressed

/* Random Choice Computer Player */
function moveRandomComputer() {
  do {
    x = Math.round(random(0, 2));
    y = Math.round(random(0, 2));
  } while (board[x][y] !== 0);
  board[x][y] = computer;
  redraw();
}

/* Computer Player */
function moveComputer() {
  if (Math.random() < 0.8) {
    // difficulty adjustable, plays just x% perfect
    moveMinMaxComputer();
  } else {
    moveRandomComputer();
  }
}

function moveMinMaxComputer() {
  let x, y;
  let max = computer === X;
  let bestScore = max ? -Infinity : +Infinity;
  console.log(max);
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      // Simulating a choice
      if (board[i][j] === 0) {
        board[i][j] = computer;
        let score = minimax(board, -computer, 0, !max); // Next level search
        //             console.log("("+i+","+j+":"+score+")");
        board[i][j] = 0;
        if (max && score > bestScore) {
          bestScore = score;
          x = i;
          y = j;
        } else if (max && score === bestScore && Math.random() > 0.5) {
          // Make a little random choices among the best candidates
          bestScore = score;
          x = i;
          y = j;
        }
        if (!max && score < bestScore) {
          bestScore = score;
          x = i;
          y = j;
        } else if (!max && score === bestScore && Math.random() > 0.5) {
          // Make a little random choices among the best candidates
          bestScore = score;
          x = i;
          y = j;
        }
      }
    }
  }
  // make choice
  // console.log(bestScore);
  board[x][y] = computer;
  redraw();
}

/* Minimax recursion with depth tracking
 * Does not take into account which choice has more dominant subsequent moves */
function minimax(b, player, depth, maximize) {
  /* Inner function to evaluate board */
  function evalBoard(b) {
    // console.log(b);
    if (hasWon(b, X)) return X;
    if (hasWon(b, O)) return O;
    if (checkDraw(b)) return none;
    return null;
  }

  /* Inner function to choose score */
  function choose(score, bestScore, maximize) {
    return maximize ? Math.max(score, bestScore) : Math.min(score, bestScore);
  }

  // Stop recursion when someone wins or draw is reached
  let result = evalBoard(b);
  if (result !== null) {
    return result * (10 - depth); // Favor fast wins
  }
  // otherwise recurse game tree
  let bestScore = maximize ? -Infinity : Infinity;
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      if (b[i][j] === 0) {
        b[i][j] = player;
        let score = minimax(b, -player, depth + 1, !maximize);
        //             console.log("  ("+i+","+j+":"+score+")");
        b[i][j] = 0;
        bestScore = choose(score, bestScore, maximize);
      }
    }
  }
  return bestScore;
}
