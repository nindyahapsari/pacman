export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export const OBJECT_TYPE = {
  BLANK: "blank",
  WALL: "wall",
  DOT: "dot",
  GHOST: "ghost",
  PACMAN: "pacman",
  SCARED: "scared",
  GHOSTLAIR: "lair",
};

export const CLASS_LIST = [
  OBJECT_TYPE.BLANK,
  OBJECT_TYPE.WALL,
  OBJECT_TYPE.DOT,
];

export const LEVEL = [
  1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1,
];

// export const DIRECTIONS = {
//     ArrowLeft: {
//         movement: -1,
//         rotation: 180,
//     },
//     ArrowUp: {
//         movement: -GRID_SIZE,
//         rotation: 270,
//     },
//     ArrowRight: {
//         movement: 1,
//         rotation: 0,
//     }, //     ArrowDown: { //         movement: GRID_SIZE,
//         rotation: 90,
//     },
// };
