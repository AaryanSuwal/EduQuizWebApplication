document.addEventListener("click", (e) => {
  if (!e.target.closest(".start-btn")) return;

  //   Get selected difficulty & format
  const difficultyBtn = document.querySelector(".difficulty-btn.active");
  const formatBtn = document.querySelector(".format-btn.active");

  const difficulty = difficultyBtn?.innerText.toLowerCase();
  const format = formatBtn
    ?.querySelector("span")
    ?.innerText.toLowerCase()
    .replace(" / ", "")
    .replace(" ", "");

  // Get category
  const quizHeader = document.querySelector(".quiz-header h2");
  const category = quizHeader?.innerText.replace(" Quiz", "").toLowerCase();

  // console.log(category, difficulty, format);

  // Show loading screen
  const loading = document.getElementById("loadingScreen");
  const title = document.getElementById("loadingTitle");
  const desc = document.getElementById("loadingDesc");
  const quizSetup = document.getElementById("quizSetup");

  title.innerText = `Preparing your ${difficulty} quiz...`;
  desc.innerText = `Crafting ${format} questions about ${category}...`;

  quizSetup.classList.add("hidden");
  loading.classList.remove("hidden");

  setTimeout(() => {
    loading.classList.add("hidden");

    console.log("FINAL SELECTION:", {
      category,
      difficulty,
      format,
    });

    document.getElementById("quizPlay").classList.remove("hidden");

    // Pass data to quizPlay
    initQuiz(category, difficulty, format);
  }, 2000);
});
