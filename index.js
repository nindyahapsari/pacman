import { LEVEL, OBJECT_TYPE } from "./setup.js";

import GameBoard from "./GameBoard.js";
import Pacman from "./Pacman.js";

const gameGrid = document.querySelector("#game");
const scoreDom = document.querySelector("#score");
const startButton = document.querySelector("#start-button");

const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

// Initial setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

function playAudio() {}

function gameOver() {}

function checkCollision() {}

function gameLoop() {}

function startGame() {
  console.log("start game");

  gameWin = false;
  powerPillActive = false;
  score = 0;

  startButton.classList.add("hide");

  gameBoard.createGrid(LEVEL);

  // init pacman stuff
  const pacman = new Pacman(2, 287);
  gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);

  // array of ghosts
}

startButton.addEventListener("click", startGame);
