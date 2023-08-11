import { callBackend } from "../_lib/callBackend.js";
import { Maze } from "../_lib/maze.js";
import { handleRunTests } from "../_lib/handleRunTests.js";

(async () => {
  const $sendBtn = document.getElementById("send-btn");
  const $input = document.getElementsByTagName("input")[0];
  const $responseArea = document.getElementById("response-area");
  const $smallBtn = document.getElementById("small-btn");
  const $mediumBtn = document.getElementById("medium-btn");
  const $largeBtn = document.getElementById("large-btn");
  const $mazeCodePlaque = document.getElementById("maze-code-plaque");
  const $openaiLogo = document.getElementById("openai-chat-logo");
  const $mazeFailIndicator = document.getElementById("maze-error-indicator");
  const $mazeSuccessIndicator = document.getElementById(
    "maze-success-indicator"
  );

  const maze = new Maze({
    mazeDimensions: 5,
    spriteImageUrl: "https://pixijs.com/assets/bunny.png",
    elementIdToInject: "pixi-container",
    // Show success indicator if sprite finished maze
    onSuccess: () => {
      $mazeSuccessIndicator.classList.remove("hidden");
    },
  });

  // Send button is for testing code implementation in visual maze
  $sendBtn.addEventListener("click", send);

  // Put maze code inside plaque and input fields
  $mazeCodePlaque.innerText = maze.mazeCode;
  $input.value = maze.mazeCode;

  // Add event listeners for change level buttons
  $smallBtn.addEventListener("click", () => loadNewMaze(5));
  $mediumBtn.addEventListener("click", () => loadNewMaze(10));
  $largeBtn.addEventListener("click", () => loadNewMaze(20));

  /**
   * Send maze code to backend and follow instructions returned by GPT
   * @returns {Promise<void>}
   */
  async function send() {
    // Add maze instructions to response area
    $responseArea.innerText = `User: ${maze.mazeCode}\n`;

    $openaiLogo.classList.add("rotating");
    maze.resetSprite();
    $mazeSuccessIndicator.classList.add("hidden");

    // Fetch exercise data
    const data = await callBackend({
      path: `/exercise4/${encodeURIComponent(maze.mazeCode)}`,
    });

    const instructions = data?.instructions;

    if (!instructions?.length) return;

    // Disable buttons while maze is being solved
    $smallBtn.disabled = true;
    $mediumBtn.disabled = true;
    $largeBtn.disabled = true;
    $sendBtn.disabled = true;

    // Follow recieved maze instructions
    for (const instruction of instructions) {
      try {
        $responseArea.innerText += `GPT: ${instruction}\n`;
        const instructionFragments = instruction.split(" ");

        if (instructionFragments.length !== 4) {
          continue;
        }
        const [, direction, steps] = instructionFragments;

        switch (direction) {
          case "RIGHT":
            await maze.moveSpriteX(Number(steps));
            break;
          case "LEFT":
            await maze.moveSpriteX(-Number(steps));
            break;
          case "UP":
            await maze.moveSpriteY(-Number(steps));
            break;
          case "DOWN":
            await maze.moveSpriteY(Number(steps));
            break;
        }
      } catch (e) {
        console.log(e);

        if (e === "Out of bounds") {
          $mazeFailIndicator.classList.remove("hidden");
          $responseArea.innerText = "";

          setTimeout(() => {
            $mazeFailIndicator.classList.add("hidden");
            maze.resetSprite();
          }, 3000);
        }
      }
    }

    // Re-enable buttons
    $smallBtn.disabled = false;
    $mediumBtn.disabled = false;
    $largeBtn.disabled = false;
    $sendBtn.disabled = false;

    $openaiLogo.classList.remove("rotating");
  }

  /**
   * Load new maze with specific dimensions onto DOM
   * @param {number} mazeDimensions
   */
  function loadNewMaze(mazeDimensions) {
    // Reset maze and bunny position
    maze.resetMaze(mazeDimensions);

    // Put maze code inside plaque and input fields
    $mazeCodePlaque.innerText = maze.mazeCode;
    $input.value = maze.mazeCode;

    // Clear GPT response area
    $responseArea.innerText = "";

    // Stop OpenAI logo from rotating
    $openaiLogo.classList.remove("rotating");

    // Remove fail/success indicators
    $mazeSuccessIndicator.classList.add("hidden");
    $mazeFailIndicator.classList.add("hidden");
  }

  handleRunTests("exercise4");
})();
