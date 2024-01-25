import { FIRST_LEVEL, SECOND_LEVEL, OBJECT_TYPE } from "./setup.js";
import { randomMovement } from "./ghostmoves.js";

import GameBoard from "./GameBoard.js";
import Pacman from "./Pacman.js";
import Ghost from "./Ghost.js";

const mazeTitle = document.querySelector("#maze-title");
const gameGrid = document.querySelector("#game");
const scoreDom = document.querySelector("#score");
const startButton = document.querySelector("#start-button");
const mazeButton = document.querySelector("#maze-button");
const restartButton = document.querySelector("#restart-button");

const POWER_PILL_TIME = 10000;
const GLOBAL_SPEED = 80; // 80 seems to not crash the while loop but still try more test

let level = FIRST_LEVEL;

let gameBoard = GameBoard.createGameBoard(gameGrid, level);
const mazeTitleText = document.createElement("h2");
mazeTitleText.classList.add("maze-title-text");
mazeTitleText.innerText = "Maze 1";
mazeTitle.appendChild(mazeTitleText);

// Initial setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

restartButton.classList.add("hide");

window.addEventListener("beforeunload", () => {
  clearInterval(timer);
});

function restartGame(ghosts, pacman, collidedGhost) {
  score = 0;
  timer = null;
  gameWin = false;
  powerPillActive = false;
  powerPillTimer = null;

  document.removeEventListener("keydown", (e) => {
    pacman.handleKeyInput(e, gameBoard.objectExist);
  });

  clearInterval(timer);

  gameBoard = GameBoard.createGameBoard(gameGrid, level);
  gameBoard.createGrid(level);

  startButton.classList.remove("hide");
  mazeButton.classList.remove("hide");
  restartButton.classList.add("hide");
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
  mazeButton.classList.remove("hide");
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
  gameWin = false;
  powerPillActive = false;
  score = 0;

  startButton.classList.add("hide");
  mazeButton.classList.add("hide");
  restartButton.classList.remove("hide");

  gameBoard.createGrid(level);

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

  restartButton.addEventListener("click", () => {
    clearInterval(timer);
    restartGame(ghosts, pacman);
  });
}

function createOptionMaze(listOfOptions) {
  const parentDiv = document.createElement("div");
  parentDiv.classList.add("maze-container");

  listOfOptions.forEach((option) => {
    const { type, defaultValue, name, value, id, text } = option;

    const optionInput = document.createElement("input");
    optionInput.type = type;
    optionInput.default = defaultValue;
    optionInput.name = name;
    optionInput.value = value;
    optionInput.id = id;

    const optionLabel = document.createElement("label");
    optionLabel.htmlFor = id;
    optionLabel.innerText = text;

    const optionContainer = document.createElement("div");
    optionContainer.appendChild(optionInput);
    optionContainer.appendChild(optionLabel);

    parentDiv.appendChild(optionContainer);
  });

  const buttonDiv = document.createElement("div");
  const closeButton = document.createElement("button");
  closeButton.classList.add("maze-option-button");
  closeButton.innerText = "Close";
  closeButton.addEventListener("click", () => {
    gameGrid.removeChild(parentDiv);
  });

  const okayButton = document.createElement("button");
  okayButton.classList.add("maze-option-button");
  okayButton.innerText = "Okay";
  okayButton.addEventListener("click", () => {
    const selectedOption = document.querySelector(
      'input[name="maze-option"]:checked'
    );
    if (selectedOption) {
      const selectedValue = selectedOption.value;

      // Perform maze change logic here
      if (selectedValue === "1") {
        level = FIRST_LEVEL;
        mazeTitleText.innerText = "Maze 1";
      } else if (selectedValue === "2") {
        mazeTitleText.innerText = "Maze 2";
        level = SECOND_LEVEL;
      }

      // Recreate the game board with the new maze
      gameBoard.createGrid(level);
    }
  });

  buttonDiv.appendChild(closeButton);
  buttonDiv.appendChild(okayButton);

  parentDiv.appendChild(buttonDiv);

  gameGrid.appendChild(parentDiv);
}

const optionsMaze = [
  {
    type: "radio",
    defaultValue: true,
    name: "maze-option",
    value: "1",
    id: "maze-option-1",
    text: "Maze 1",
  },
  {
    type: "radio",
    defaultValue: false,
    name: "maze-option",
    value: "2",
    id: "maze-option-2",
    text: "Maze 2",
  },
];

startButton.addEventListener("click", startGame);
mazeButton.addEventListener("click", () => createOptionMaze(optionsMaze));
