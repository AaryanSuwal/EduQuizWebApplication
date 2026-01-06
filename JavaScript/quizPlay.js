let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let currentCategory = "";
let currentDifficulty = "";
let currentFormat = "";
let selectedOption = null;
let answered = false;

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function formatLabel(type) {
  if (type === "mcq") return "Multiple Choice";
  if (type === "truefalse") return "True / False";
  if (type === "fillblanks") return "Fill in the Blanks";
  return type;
}

function pickRandomQuestions(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function initQuiz(category, difficulty, type) {
  currentCategory = category;
  currentDifficulty = difficulty;
  currentFormat = type;

  const allQuestions = QUESTIONS[category].filter(
    (q) => q.difficulty === difficulty && q.type === type
  );

  if (allQuestions.length === 0) {
    alert("No questions found");
    return;
  }

  quizQuestions = pickRandomQuestions(allQuestions, 5);
  currentIndex = 0;
  score = 0;

  renderQuizUI();

  document.getElementById("totalQuestions").innerText = quizQuestions.length;

  updateProgress();
  loadQuestion();
}

function renderQuizUI() {
  const quizPlay = document.getElementById("quizPlay");

  quizPlay.innerHTML = `
    <div class="quiz-play-content">
      <!-- Header -->
      <div class="quiz-play-header">
        <div class="quiz-info">
          <div class="quiz-progress-text">
            Question <span id="currentIndex"></span> of <span id="totalQuestions"></span>
          </div>
          <div class="quiz-config">
            <span id="quizFormat">${formatLabel(currentFormat)}</span> •
            <span id="quizDifficulty">${capitalize(currentDifficulty)}</span>
          </div>
        </div>
        <button id="exitBtn" class="exit-btn">
          <i class="bi bi-x-circle"></i>
          <p>Exit</P>
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>

      <!-- Question Card -->
      <div class="question-card">
        <h2 id="questionText">Question text will appear here</h2>
        <div class="options" id="options">
          <!-- Option buttons will be inserted here dynamically -->
        </div>
        <div class="explanation" id="explanation" style="display:none;">
          <strong>Explanation:</strong>
          <p id="explanationText"></p>
        </div>
      </div>
      <!-- Action Button -->
      <button id="actionBtn" class="action-btn" disabled>Check Answer</button>
    </div>
  `;

  document.getElementById("exitBtn").onclick = () => location.reload();
}

function updateProgress() {
  const current = currentIndex + 1;
  const total = quizQuestions.length;

  // Update text
  document.getElementById("currentIndex").innerText = current;

  // Update progress bar
  const progressPercent = (current / total) * 100;
  document.getElementById("progressFill").style.width = progressPercent + "%";
}

function loadQuestion() {
  const q = quizQuestions[currentIndex];
  if (!q) return;

  updateProgress();

  selectedOption = null;
  answered = false;

  document.getElementById("questionText").innerText = q.question;

  // Hide explanation
  document.getElementById("explanation").style.display = "none";
  document.getElementById("explanationText").innerText =
    q.explanation || "No explanation available.";

  const optionsEl = document.getElementById("options");
  optionsEl.innerHTML = "";

  //Toggle layout on True/False
  optionsEl.classList.remove("truefalse-options");
  if (q.type === "truefalse") {
    optionsEl.classList.add("truefalse-options");
  }

  const actionBtn = document.getElementById("actionBtn");
  actionBtn.disabled = true;
  actionBtn.innerText = "Check Answer";

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.innerText = opt;

    btn.onclick = () => {
      if (answered) return;

      document
        .querySelectorAll(".options button")
        .forEach((b) => b.classList.remove("selected"));

      btn.classList.add("selected");
      selectedOption = index;
      actionBtn.disabled = false;
    };

    optionsEl.appendChild(btn);
  });

  actionBtn.onclick = checkAnswer;
}

function checkAnswer() {
  if (selectedOption === null || answered) return;

  answered = true;

  const q = quizQuestions[currentIndex];
  const correctIndex = q.correct;

  const buttons = document.querySelectorAll(".options button");

  buttons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === correctIndex) {
      btn.classList.add("correct");
    }

    if (index === selectedOption && index !== correctIndex) {
      btn.classList.add("wrong");
    }
  });

  if (selectedOption === correctIndex) {
    score++;
  }

  // Show explanation
  document.getElementById("explanation").style.display = "block";

  const actionBtn = document.getElementById("actionBtn");
  actionBtn.innerText = "Next Question";

  actionBtn.onclick = () => {
    currentIndex++;

    if (currentIndex < quizQuestions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  };
}

function showResult() {
  saveRecentAttempt({
    category: currentCategory,
    difficulty: currentDifficulty,
    type: currentFormat,
    score: score,
    total: quizQuestions.length,
    time: Date.now(),
  });

  const quizPlay = document.getElementById("quizPlay");

  quizPlay.innerHTML = `
    <div class="result-screen">
      <div class="result-card">
        <div class="trophy-circle"><i class="bi bi-trophy"></i></div>

        <h2 class="result-title">Quiz Completed!</h2>

        <p class="result-meta">
          Difficulty:
          <span class="result-highlight" id="resultDifficulty"></span>
        </p>

        <div class="result-score">
          <span id="finalScore"></span>/<span id="totalScore"></span>
        </div>

        <p class="result-message" id="resultMessage"></p>

        <button id="exitResultBtn" class="result-btn">
          <i class="bi bi-house-door"></i> Back to Dashboard
        </button>
      </div>
    </div>
  `;

  document.getElementById("resultDifficulty").innerText =
    capitalize(currentDifficulty);

  document.getElementById("finalScore").innerText = score;
  document.getElementById("totalScore").innerText = quizQuestions.length;

  document.getElementById("resultMessage").innerText =
    score === quizQuestions.length
      ? "Perfect score! You're a master!"
      : "Great effort! Keep learning";

  document.getElementById("exitResultBtn").onclick = () => {
    location.reload();
  };
}

function saveRecentAttempt(attempt) {
  let attempts = JSON.parse(localStorage.getItem("recentAttempts")) || [];

  attempts.unshift(attempt); // newest first
  attempts = attempts.slice(0, 5); // keep only last 5

  localStorage.setItem("recentAttempts", JSON.stringify(attempts));
}
