import { LEVEL } from "./setup.js";

import GameBoard from "./GameBoard.js";

const gameGrid = document.querySelector("#game");

const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
gameBoard.createGrid(LEVEL);

console.log(LEVEL);
