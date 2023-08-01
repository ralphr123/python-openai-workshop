import { callBackend } from "../_lib/callBackend.js";
import { handleRunTests } from "../_lib/handleRunTests.js";

(async () => {
  const $inputField = document.getElementsByTagName("input")[0];
  const $sendBtn = document.getElementById("send-btn");
  const $responseArea = document.getElementById("response-area");
  const $openaiLogo = document.getElementById("openai-chat-logo");

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

  async function sendMessage(message) {
    $inputField.disabled = true;
    $openaiLogo.classList.add("rotating");

    const data = await callBackend({
      method: "POST",
      path: "/exercise1",
      body: {
        message,
      },
    });

    const response = data?.response || "";

    $openaiLogo.classList.remove("rotating");
    $responseArea.innerText = response;
    $inputField.value = "";
    $inputField.disabled = false;
    $inputField.focus();
  }

  handleRunTests("exercise1");
})();
