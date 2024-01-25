import { GRID_SIZE, OBJECT_TYPE, CLASS_LIST, DIRECTIONS } from "./setup.js";

class Pacman {
  constructor(speed, startPosition) {
    this.position = startPosition;
    this.speed = speed;
    this.direction = null;
    this.timer = 0;
    this.powerPill = false;
    this.rotation = true;
    this.cooldown = false;
  }

  shouldMove() {
    if (!this.direction) return;

    if (this.timer === this.speed) {
      this.timer = 0;
      return true;
    }

    this.timer++;
  }

  getNextMove(objectExist) {
    //check wall and ghost lair

    let nextMovePosition = this.position + this.direction.movement;

    if (
      objectExist(nextMovePosition, OBJECT_TYPE.WALL) ||
      objectExist(nextMovePosition, OBJECT_TYPE.GHOSTLAIR)
    ) {
      nextMovePosition = this.position;
    }

    return { nextMovePosition, direction: this.direction };
  }

  makeMovementInBoard() {
    const classesToRemove = [OBJECT_TYPE.PACMAN];
    const classesToAdd = [OBJECT_TYPE.PACMAN];

    return { classesToRemove, classesToAdd };
  }

  setNewPosition(nextMovePosition) {
    this.position = nextMovePosition;
  }

  handleKeyInput = (e, objectExist) => {
    if (this.cooldown) return;

    let directions;

    // becareful case sensitive => keyCode
    // to much key pressing will make the game freeze
    // causing too much func call in the stack
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      directions = DIRECTIONS[e.key];
    } else {
      return;
    }

    const nextMovePosition = this.position + directions.movement;
    if (objectExist(nextMovePosition, OBJECT_TYPE.WALL)) return;
    this.direction = directions;

    this.cooldown = true;
    setTimeout(() => (this.cooldown = false), 500);
  };
}

export default Pacman;
