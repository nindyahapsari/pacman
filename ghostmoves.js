import { DIRECTIONS, OBJECT_TYPE } from "./setup.js";

// Primitive random movement.
export function randomMovement(position, direction, objectExist) {
  let dir = direction;
  let nextMovePosition = position + dir.movement;
  // Create an array from the diretions objects keys
  const keys = Object.keys(DIRECTIONS);

  // need to becareful w while loop
  //it might goes to infinite loop
  // keep GLOBAL_SPEED low to 80
  while (
    objectExist(nextMovePosition, OBJECT_TYPE.WALL) ||
    objectExist(nextMovePosition, OBJECT_TYPE.GHOST)
  ) {
    // Get a random key from that array
    const key = keys[Math.floor(Math.random() * keys.length)];
    // Set the new direction
    dir = DIRECTIONS[key];
    // Set the next move
    nextMovePosition = position + dir.movement;
  }

  return { nextMovePosition, direction: dir };
}
