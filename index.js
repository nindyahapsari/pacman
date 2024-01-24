import { LEVEL, OBJECT_TYPE } from "./setup.js";
import { randomMovement } from "./ghostmoves.js";

import GameBoard from "./GameBoard.js";
import Pacman from "./Pacman.js";
import Ghost from "./Ghost.js";

// Sounds
// import soundDot from "./sounds/munch.wav";
// import soundPill from "./sounds/pill.wav";
// import soundGameStart from "./sounds/game_start.wav";
// import soundGameOver from "./sounds/death.wav";
// import soundGhost from "./sounds/eat_ghost.wav";

const gameGrid = document.querySelector("#game");
const scoreDom = document.querySelector("#score");
const startButton = document.querySelector("#start-button");

const POWER_PILL_TIME = 10000;
const GLOBAL_SPEED = 80;

const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

// Initial setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

function playAudio(audio) {
  const soundEffect = new Audio(audio);
  soundEffect.play();
}

function gameOver(pacman, grid) {
  // playAudio(soundGameOver);

  document.removeEventListener("keydown", (e) => {
    pacman.handleKeyInput(e, gameBoard.objectExist);
  });

  gameBoard.showGameStatus(gameWin);

  clearInterval(timer);

  // show start button
  startButton.classList.remove("hide");
}

function checkCollision(pacman, ghosts) {
  const collidedGhost = ghosts.find(
    (ghost) => pacman.position === ghost.position
  );

  if (collidedGhost) {
    if (pacman.powerPill) {
      // playAudio(soundGhost);

      gameBoard.removeObject(collidedGhost.position, [
        OBJECT_TYPE.GHOST,
        OBJECT_TYPE.SCARED,
        collidedGhost.name,
      ]);

      collidedGhost.position = collidedGhost.startPosition;

      score += 100;
    } else {
      gameBoard.removeObject(pacman.position, [OBJECT_TYPE.PACMAN]);

      gameBoard.rotateDiv(pacman.position, 0);

      gameOver(pacman, ghosts);
    }
  }
}

function gameLoop(pacman, ghosts) {
  gameBoard.moveCharacter(pacman);

  //check collision
  checkCollision(pacman, ghosts);

  //move ghosts
  ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));

  checkCollision(pacman, ghosts);

  if (gameBoard.objectExist(pacman.position, OBJECT_TYPE.DOT)) {
    // playAudio(soundDot);

    gameBoard.removeObject(pacman.position, [OBJECT_TYPE.DOT]);

    gameBoard.dotCount--;

    score += 10;
  }

  if (gameBoard.objectExist(pacman.position, OBJECT_TYPE.PILL)) {
    // playAudio(soundPill);

    gameBoard.removeObject(pacman.position, [OBJECT_TYPE.PILL]);

    pacman.powerPill = true;

    score += 50;

    clearTimeout(powerPillTimer);

    powerPillTimer = setTimeout(() => {
      pacman.powerPill = false;
    }, POWER_PILL_TIME);
  }

  // change ghost scare mode depending on powerpill

  if (pacman.powerPill !== powerPillActive) {
    powerPillActive = pacman.powerPill;
    ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
  }

  //check if all dots have been eaten

  if (gameBoard.dotCount === 0) {
    gameWin = true;
    gameOver(pacman, ghosts);
  }

  // show new score
  scoreDom.innerHTML = score;
}

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
  document.addEventListener("keydown", (e) => {
    pacman.handleKeyInput(e, gameBoard.objectExist);
  });

  // array of ghosts
  const ghosts = [
    new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
    new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
    new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
    new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE),
  ];

  timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

startButton.addEventListener("click", startGame);
