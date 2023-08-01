import { Queue } from "./queue.js";

class MazeCode {
  constructor(instructions) {
    this.instructions = instructions || [];
  }

  /**
   *
   * @param {('U' | 'D' | 'L' | 'R')} direction
   */
  add(direction) {
    const newInstructions = this.instructions
      .slice()
      .map((instruction) => ({ ...instruction }));
    const prevInstruction = newInstructions[newInstructions.length - 1];

    if (prevInstruction?.direction === direction) {
      prevInstruction.steps += 1;
    } else {
      newInstructions.push({ direction, steps: 1 });
    }

    return new MazeCode(newInstructions);
  }

  /**
   *
   * @returns {string} String representation of maze instructions
   */
  toString() {
    let mazeCode = "\\instr";

    for (const { direction, steps } of this.instructions) {
      mazeCode += ` -${direction} ${steps}`;
    }

    return mazeCode;
  }
}

/**
 *
 * @param {number[][]} grid - nxn grid of numbers (1 = wall, 0 = path)
 * @returns {string} String representation of maze instructions
 *  - Every instruction starts with \instr. Following this are commands separated by single spaces.
 *  - Each of these commands take in one argument, being the distance travelled.
 *  - The four commands (exluding the quotes):
 *  1. "-R <number>" = Go right <number> times
 *  2. "-L <number>" = Go left <number> times
 *  3. "-D <number>" = Go down <number> times
 *  4. "-U <number>" = Go up <number> times
 *  - Example command: "\instr -R 3 -D 2 -L 1 -U 1" (right 3 units, down two units, then left one unit)
 */
export function generateMazeCode(grid) {
  const visitedGrid = grid.slice().map((row) => row.slice());

  const startingCell = { x: 0, y: 1, path: new MazeCode() };
  const queue = new Queue(startingCell);
  const size = visitedGrid.length;

  const isInBounds = ({ x, y }) =>
    x >= 0 && y >= 0 && x < size && y < size && visitedGrid[y][x] === 0;

  // Breadth first search
  while (!queue.isEmpty()) {
    const { x, y, path } = queue.dequeue();

    visitedGrid[y][x] = 1;

    if (x === size - 1 && y === size - 2) {
      return path.toString();
    }

    const cellAbove = { x, y: y - 1, path: path.add("U") };
    const cellBelow = { x, y: y + 1, path: path.add("D") };
    const cellLeft = { x: x - 1, y, path: path.add("L") };
    const cellRight = { x: x + 1, y, path: path.add("R") };

    if (isInBounds(cellAbove)) queue.enqueue(cellAbove);
    if (isInBounds(cellBelow)) queue.enqueue(cellBelow);
    if (isInBounds(cellLeft)) queue.enqueue(cellLeft);
    if (isInBounds(cellRight)) queue.enqueue(cellRight);
  }
}
