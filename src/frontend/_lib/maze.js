import { generateMazeCode } from "./generateMazeCode.js";
import { generateRandomMaze } from "./generateRandomMaze.js";

export class Maze {
  /**
   *
   * @param {{
   *  mazeDimensions: number;
   *  spriteImageUrl: string;
   *  elementIdToInject: string;
   *  onFail?: () => void;
   *  onSuccess?: () => void
   * }}
   */
  constructor({
    mazeDimensions,
    spriteImageUrl,
    elementIdToInject,
    onSuccess,
  }) {
    this.elementIdToInject = elementIdToInject;
    this.spriteImageUrl = spriteImageUrl;
    this.onSuccess = onSuccess;
    this.onSuccess = onSuccess;

    this.resetMaze(mazeDimensions);
  }

  /**
   * Reset sprite cooridinates
   */
  resetSprite() {
    // Reset sprite coordinates
    this.spriteCoordinates = { x: 0, y: 1 };

    // Remove existing sprite from app
    this.app.stage.removeChild(this.sprite);

    // Generate new sprite
    this.sprite = this.generateSprite(this.spriteImageUrl);
  }

  /**
   * Reset maze and bunny position
   * @param {number} mazeDimensions
   */
  resetMaze(mazeDimensions) {
    const $pixiContainer = document.getElementById(this.elementIdToInject);

    // Clear any existing content from DOM element
    $pixiContainer.innerHTML = "";

    // Initialize instance of pixi app
    this.app = new PIXI.Application({
      background: "#ffb900",
      resizeTo: $pixiContainer,
    });

    // Add app to dom
    $pixiContainer.appendChild(this.app.view);

    // Generate random nxn matrix to represent maze
    this.grid = generateRandomMaze(mazeDimensions);

    // Generate maze code (string instruction set for correct path)
    this.mazeCode = generateMazeCode(this.grid);

    // Draw the maze on the app
    this.drawMaze();

    // Generate pixi sprite with correct size and coordinates
    this.resetSprite();
  }

  /**
   *
   * @param {string} url
   */
  generateSprite(url) {
    try {
      // Create a new Sprite from an image path
      const sprite = PIXI.Sprite.from(url);
      const cellSize = this.app.view.width / this.grid.length;

      // Set the sprite's size to fit within a cell
      sprite.height = cellSize - 6;
      sprite.width = cellSize - 6;

      // Move the sprite to initial position
      sprite.x = Math.round(this.spriteCoordinates.x * cellSize + 3);
      sprite.y = Math.round(this.spriteCoordinates.y * cellSize + 3);

      // Add sprite to dom
      this.app.stage.addChild(sprite);

      return sprite;
    } catch (e) {
      console.error("Error generating sprite:", e);
    }
  }

  /**
   * Draw maze on pixi app
   */
  drawMaze() {
    try {
      const cellSize = this.app.view.width / this.grid.length;
      this.walls = [];

      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          const cell = this.grid[i][j];

          // Skip if empty path
          if (cell === 0) {
            continue;
          }

          const domCell = new PIXI.Graphics();

          let cellColor = "black";

          // Fill cell with correct color
          domCell.beginFill(cellColor);
          domCell.drawRect(0, 0, cellSize, cellSize);
          domCell.endFill();

          // Move cell to correct position
          domCell.x = j * cellSize;
          domCell.y = i * cellSize;

          // Add cell to app
          this.app.stage.addChild(domCell);

          // Add to walls array for collision detection
          if (cellColor === "black") {
            this.walls.push(domCell); // Add this line
          }
        }
      }
    } catch (e) {
      console.error("Error drawing maze:", e);
    }
  }

  /**
   *
   * @param {number} x - Horizontal grid index to move sprite to
   * @param {number} y - Vertical grid index to move sprite to
   * @returns {Promise<void>} Promise that resolves when motion is complete
   */
  moveSprite(x, y) {
    try {
      return new Promise((resolve, reject) => {
        const cellSize = this.app.view.width / this.grid.length;
        const targetX = Math.round(x * cellSize) + 2;
        const targetY = Math.round(y * cellSize) + 2;

        const sprite = this.sprite;

        // Callback to animate sprite's motion
        const animateMotion = () => {
          try {
            if (this.isSpriteOutOfBounds()) {
              this.app.ticker.remove(animateMotion);
              reject("Out of bounds");
              return;
            }

            // Move sprite
            if (sprite.x !== targetX) {
              sprite.x += sprite.x < targetX ? 1 : -1;
            } else if (sprite.y !== targetY) {
              sprite.y += sprite.y < targetY ? 1 : -1;
            } else {
              this.app.ticker.remove(animateMotion);

              if (this.isSpriteAtFinish()) {
                this.onSuccess?.();
              }

              resolve();
            }
          } catch (e) {
            console.error("Error animating sprite motion", e);
            throw e;
          }
        };

        this.app.ticker.add(animateMotion);

        // Set new coordinates for sprite
        this.spriteCoordinates.x = x;
        this.spriteCoordinates.y = y;
      });
    } catch (e) {
      console.error("Error moving sprite:", e);
    }
  }

  /**
   *
   * @param {number} n - Number of cells to move sprite vertically (negative = up, positive = down)
   * @returns {Promise<void>} Promise that resolves when motion is complete
   */
  moveSpriteY(n) {
    return this.moveSprite(
      this.spriteCoordinates.x,
      this.spriteCoordinates.y + n
    );
  }

  /**
   *
   * @param {number} n - Number of cells to move sprite horizontally (negative = left, positive = right)
   * @returns {Promise<void>} Promise that resolves when motion is complete
   */
  moveSpriteX(n) {
    return this.moveSprite(
      this.spriteCoordinates.x + n,
      this.spriteCoordinates.y
    );
  }

  /**
   * @returns {boolean} True if sprite is in a wall or out of bounds
   */
  isSpriteOutOfBounds() {
    const cellSize = this.app.view.width / this.grid.length;
    const x = Math.floor(this.sprite.x / cellSize);
    const y = Math.floor(this.sprite.y / cellSize);

    for (let i = 0; i < this.walls.length; i++) {
      const wall = this.walls[i];
      const wallBounds = wall.getBounds();

      if (wallBounds.contains(this.sprite.x, this.sprite.y)) {
        return true;
      }
    }

    return x < 0 || y < 0 || x >= this.grid.length || y >= this.grid.length;
  }

  /**
   * @returns {boolean} True if sprite has successfully completed maze
   */
  isSpriteAtFinish() {
    const cellSize = this.app.view.width / this.grid.length;
    const x = Math.floor(this.sprite.x / cellSize);
    const y = Math.floor(this.sprite.y / cellSize);

    return x >= this.grid.length - 2 && y >= this.grid.length - 2;
  }
}
