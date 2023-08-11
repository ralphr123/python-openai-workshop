import { callBackend } from "../_lib/callBackend.js";
import { handleRunTests } from "../_lib/handleRunTests.js";

(async () => {
  const $inputField = document.getElementsByTagName("input")[0];
  const $sendBtn = document.getElementById("send-btn");
  const $responseArea = document.getElementById("response-area");
  const $openaiLogo = document.getElementById("openai-chat-logo");

  let messages = [];

  $inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && $inputField.value) {
      sendMessage($inputField.value);
    }
  });

  $sendBtn.addEventListener("click", (e) => {
    if ($inputField.value) {
      sendMessage($inputField.value);
    }
  });

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
      path: "/exercise2",
      body: {
        messages: messages.slice(0, -1),
      },
    });

    if (data.error) {
      messages = [];
    }

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

  handleRunTests("exercise2");
})();
