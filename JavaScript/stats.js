/* -------------------------------
   Count Questions
-------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  let total = 0;

  for (let category in QUESTIONS) {
    total += QUESTIONS[category].length;
  }

  const questionEl = document.getElementById("questionCount");

  if (questionEl) {
    questionEl.textContent = total + "+";
  }
});

/* -------------------------------
   Count Category
-------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const countCategory = CATEGORIES.length;

  const categoryEl = document.getElementById("categoryCount");

  if (categoryEl) {
    categoryEl.textContent = countCategory + "+";
  }
});

/* -------------------------------
   Calculate Time Spend
-------------------------------- */

function startQuiz() {
  window.location.href = "main.html";
}

const timeEl = document.getElementById("timeSpend");

if (timeEl) {
  let seconds = Number(localStorage.getItem("quizTime")) || 0;

  updateDisplay();

  const timer = setInterval(() => {
    seconds++;
    localStorage.setItem("quizTime", seconds);
    updateDisplay();
  }, 1000);

  window.addEventListener("beforeunload", () => {
    clearInterval(timer);
  });

  window.resetTimer = function () {
    seconds = 0;
    localStorage.setItem("quizTime", 0);
    updateDisplay();
  };

  function updateDisplay() {
    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    timeEl.textContent =
      hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  }
}
