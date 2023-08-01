import {} from "./generateMazeCode.js";

class DisjointSet {
  constructor(size) {
    // Every index initially represents a separate group
    this.parent = Array(size).fill(-1);
  }

  find(a) {
    while (this.parent[a] >= 0) {
      a = this.parent[a];
    }
    return a;
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA !== rootB) {
      this.parent[rootA] = rootB;
    }
  }
}

/**
 *
 * @param {number} n - Dimensions of maze
 * @returns {number[][]} nxn grid of numbers (1 = wall, 0 = path)
 */
export function generateRandomMaze(n) {
  const size = n * n;
  const sets = new DisjointSet(size);
  const edges = [];

  // Account for the maze being surrounded by wall
  const grid = Array(n * 2 + 1)
    .fill()
    .map(() => Array(n * 2 + 1).fill(1));

  // Push every possible edge into array of edges
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (y > 0) edges.push({ x1: x, y1: y, x2: x, y2: y - 1 });
      if (x > 0) edges.push({ x1: x, y1: y, x2: x - 1, y2: y });
    }
  }

  // Shuffle edges randomly
  edges.sort(() => Math.random() - 0.5);

  // Kruskal's algorithm
  while (edges.length) {
    // Pick a random edge from the matrix
    const { x1, y1, x2, y2 } = edges.pop();

    // Map 2D array to 1D array (every cell has a unique one dimensional index)
    // ex. [[1, 2, 3], [4, 5, 6]] -> [1, 2, 3, 4, 5, 6]
    const cell1 = y1 * n + x1;
    const cell2 = y2 * n + x2;

    // If no loop, combine cells to form path
    if (sets.find(cell1) !== sets.find(cell2)) {
      sets.union(cell1, cell2);

      // Connect 3 cells in a path
      grid[y1 * 2 + 1][x1 * 2 + 1] = 0;
      grid[y2 * 2 + 1][x2 * 2 + 1] = 0;
      grid[y1 + y2 + 1][x1 + x2 + 1] = 0;
    }
  }

  // Start cell (entrance)
  grid[1][0] = 0;

  // End cell (exit)
  grid[n * 2 - 1][n * 2] = 0;

  return grid;
}
