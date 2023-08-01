import { callBackend } from "./callBackend.js";

/**
 * Adds event listener to play button to handle running test cases
 * @param {'exercise1' | 'exercise2' | 'exercise3' | 'exercise4'} exercise
 */
export function handleRunTests(exercise) {
  // Handles play and reset for students
  const $runTestsBtn = document.getElementById("run-tests-btn");

  // Save play button content
  const _playContent =
    '<img src="../static/assets/icons/play.svg" /><div>Run Tests</div>';
  const _loadingContent =
    '<img src="../static/assets/icons/gear.svg" class="rotating" />';
  const _resetContent =
    '<img src="../static/assets/icons/reset.svg" /><div>Try again</div>';
  const _successContent =
    '<img src="../static/assets/icons/check.svg" /><div>Success</div>';

  // Set initial state of play button
  let status = "ready";

  if (window.localStorage.getItem(`bex-${exercise}`)) {
    $runTestsBtn.classList.add("success");
    $runTestsBtn.innerHTML = _successContent;
    $runTestsBtn.disabled = true;
  } else {
    $runTestsBtn.innerHTML = _playContent;
  }

  $runTestsBtn.addEventListener("click", () => {
    if (status === "ready") runTests();
    else if (status !== "active") reset();
  });

  async function runTests() {
    status = "active";

    // Replace play button content with rotating gear icon
    $runTestsBtn.innerHTML = _loadingContent;

    let data;

    // Call correct endpoint to run tests:
    switch (exercise) {
      case "exercise1":
        data = await callBackend({
          path: "/exercise1/run-tests",
        });
        break;
      case "exercise2":
        data = await callBackend({
          path: "/exercise2/run-tests",
        });
        break;
      case "exercise3":
        data = await callBackend({
          path: "/exercise3/run-tests",
        });
        break;
      case "exercise4":
        data = await callBackend({
          path: "/exercise4/run-tests",
        });
        break;
    }

    if (data.success) {
      $runTestsBtn.classList.add("success");
      $runTestsBtn.innerHTML = _successContent;
      $runTestsBtn.disabled = true;

      window.localStorage.setItem(`bex-${exercise}`, "true");
    } else {
      $runTestsBtn.classList.add("fail");
      $runTestsBtn.innerHTML = _resetContent;
    }

    status = "ready";
  }

  function reset() {
    status = "ready;";
    $runTestsBtn.innerHTML = _playContent;
  }
}
