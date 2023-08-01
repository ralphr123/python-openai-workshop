import { callBackend } from "../_lib/callBackend.js";
import { handleRunTests } from "../_lib/handleRunTests.js";
import { randomPrompts } from "../_lib/randomPrompts.js";

(async () => {
  const $inputField = document.getElementsByTagName("input")[0];
  const $sendBtn = document.getElementById("send-btn");
  const $responseArea = document.getElementById("response-area");
  const $promptTextarea = document.getElementsByTagName("textarea")[0];
  const $randomizeBtn = document.querySelector("#prompt-box > button");
  const $openaiLogo = document.getElementById("openai-chat-logo");

  let messages = [];

  $inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && $inputField.value) {
      sendMessage($inputField.value);
    }
  });

  $sendBtn.addEventListener("click", () => {
    if ($inputField.value) {
      sendMessage($inputField.value);
    }
  });

  $randomizeBtn.addEventListener("click", randomizePrompt);

  /**
   * Insert random pre-generated prompt into prompt area
   */
  async function randomizePrompt() {
    const i = Math.floor(Math.random() * randomPrompts.length);
    $promptTextarea.innerText = randomPrompts[i];
  }

  /**
   * Send message to GPT and populate DOM with response
   * @param {string} message
   */
  async function sendMessage(message) {
    $inputField.disabled = true;
    $openaiLogo.classList.add("rotating");

    messages.push(
      { role: "user", content: message },
      { role: "assistant", content: "..." }
    );

    loadMessages(messages);

    const data = await callBackend({
      method: "POST",
      path: "/exercise3",
      body: {
        systemMessage: $promptTextarea.value,
        messages: messages.slice(0, -1),
      },
    });

    messages = data?.messages || messages;

    $openaiLogo.classList.remove("rotating");
    loadMessages(messages);
    $inputField.value = "";
    $inputField.disabled = false;
    $inputField.focus();
  }

  /**
   * Load messages into response area of DOM
   * @param {{ role: 'user' | 'assistant'; content: string; }[]} messages
   */
  function loadMessages(messages) {
    $responseArea.innerHTML = "";
    for (const { role, content } of messages) {
      $responseArea.innerHTML += `
        <div class="message">
          <span>${role === "user" ? "User" : "GPT"}: </span> ${content}
        </div>
      `;
    }
  }

  handleRunTests("exercise3");
})();
