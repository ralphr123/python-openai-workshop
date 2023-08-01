(() => {
  const isComplete = [
    window.localStorage.getItem("bex-exercise1"),
    window.localStorage.getItem("bex-exercise2"),
    window.localStorage.getItem("bex-exercise3"),
    window.localStorage.getItem("bex-exercise4"),
  ];

  // Light up exercise buttons with Microsoft colors as they are completd
  for (let i = 0; i < isComplete.length; i++) {
    const $exerciseBtn = document.getElementById(`exercise-${i + 1}`);

    $exerciseBtn.parentElement.classList.remove("disabled");

    if (isComplete[i]) {
      $exerciseBtn.classList.add("success");
    } else {
      $exerciseBtn.classList.add("pending");
      break;
    }
  }
})();
