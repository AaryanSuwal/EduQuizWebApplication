/* categories.js */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Category Data (Consistent with React version) ---
  const CATEGORIES = [
    {
      id: "math",
      name: "Mathematics",
      icon: "calculator",
      description: "Algebra, Geometry, and Calculus challenges.",
      color: "theme-blue",
      hoverColor: "var(--blue-600)",
      quizCount: 15,
    },
    {
      id: "science",
      name: "Science",
      icon: "flask-conical",
      description: "Explore Physics, Chemistry, and Biology.",
      color: "theme-green",
      hoverColor: "var(--emerald-600)",
      quizCount: 12,
    },
    {
      id: "history",
      name: "History",
      icon: "history",
      description: "Journey through time and civilizations.",
      color: "theme-yellow",
      hoverColor: "var(--amber-600)",
      quizCount: 10,
    },
    {
      id: "tech",
      name: "Technology",
      icon: "cpu",
      description: "Coding, AI, and latest tech trends.",
      color: "theme-indigo",
      hoverColor: "var(--indigo-600)",
      quizCount: 8,
    },
    {
      id: "geo",
      name: "Geography",
      icon: "globe",
      description: "Countries, capitals, and landscapes.",
      color: "theme-blue",
      hoverColor: "var(--blue-600)",
      quizCount: 14,
    },
    {
      id: "lit",
      name: "Literature",
      icon: "book-open",
      description: "Classic novels, poetry, and authors.",
      color: "theme-red",
      hoverColor: "var(--rose-600)",
      quizCount: 9,
    },
    {
      id: "art",
      name: "Art & Culture",
      icon: "palette",
      description: "Paintings, music, and cultural heritage.",
      color: "theme-indigo",
      hoverColor: "var(--indigo-600)",
      quizCount: 11,
    },
    {
      id: "gk",
      name: "General Knowledge",
      icon: "lightbulb",
      description: "Test your overall awareness.",
      color: "theme-blue",
      hoverColor: "var(--blue-600)",
      quizCount: 20,
    },
  ];

  // --- 2. State & Data Logic ---
  let stats = { categories: {}, totalQuizzes: 0, totalScore: 0 };
  let recentAttempts = [];
  let searchQuery = "";

  const loadData = () => {
    try {
      const storedStats = localStorage.getItem("eduquiz_stats");
      const storedAttempts = localStorage.getItem("eduquiz_attempts");

      if (storedStats) stats = JSON.parse(storedStats);
      if (storedAttempts) recentAttempts = JSON.parse(storedAttempts);

      updateSnapshot();
      updateRecommendation();
      updateRecentActivity();
      renderCategories();
    } catch (error) {
      console.error("Failed to load stats:", error);
      renderCategories(); // Still render despite data error
    }
  };

  const getCategoryStats = (categoryId) => {
    if (!stats || !stats.categories[categoryId]) return null;
    const s = stats.categories[categoryId];
    const accuracy =
      s.totalQuestions > 0
        ? Math.round((s.correctAnswers / s.totalQuestions) * 100)
        : 0;
    return { ...s, accuracy };
  };

  // --- 3. UI Rendering ---
  const categoriesGrid = document.getElementById("categoriesGrid");
  const noResults = document.getElementById("noResults");

  const renderCategories = () => {
    const filtered = CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (filtered.length === 0) {
      categoriesGrid.innerHTML = "";
      noResults.classList.remove("hidden");
      return;
    }

    noResults.classList.add("hidden");
    categoriesGrid.innerHTML = filtered
      .map((cat, idx) => {
        const catStats = getCategoryStats(cat.id);
        const colorClass = cat.color.split(" ")[0]; // e.g. bg-emerald-100

        return `
                <div class="category-card slide-up" data-category-id="${cat.id}" style="animation-delay: ${idx * 0.05}s">
                    <div class="card-decoration ${colorClass}"></div>
                    
                    <div class="card-header">
                        <div class="cat-icon-box ${cat.color}">
                            <i data-lucide="${cat.icon}"></i>
                        </div>
                        ${
                          catStats
                            ? `
                            <div class="acc-badge-mini">
                                <span class="val ${catStats.accuracy >= 80 ? "text-emerald-600" : catStats.accuracy >= 50 ? "text-amber-600" : "text-slate-400"}">${catStats.accuracy}%</span>
                                <span class="lbl">Accuracy</span>
                            </div>
                        `
                            : ""
                        }
                    </div>
                    
                    <div class="cat-info">
                        <h3>${cat.name}</h3>
                        <p>${cat.description}</p>
                    </div>
                    
                    <div class="cat-meta">
                        <div class="cat-meta-item">
                            <i data-lucide="play-circle"></i>
                            ${catStats?.attempts || 0} Attempts
                        </div>
                        <div class="cat-meta-item">
                            <i data-lucide="book-open"></i>
                            ${cat.quizCount} Quizzes
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    // Re-initialize Lucide icons for new content
    lucide.createIcons();
  };

  const updateSnapshot = () => {
    const attemptedCountEl = document.getElementById("attemptedCount");
    const strongestNameEl = document.getElementById("strongestName");
    const strongestAccEl = document.getElementById("strongestAcc");
    const weakestNameEl = document.getElementById("weakestName");
    const weakestAccEl = document.getElementById("weakestAcc");
    const overallAccuracyEl = document.getElementById("overallAccuracy");
    const accuracyFill = document.getElementById("accuracyFill");

    const attempted = Object.keys(stats.categories).length;
    attemptedCountEl.textContent = attempted;

    let highestAcc = -1;
    let lowestAcc = 101;
    let strongCat = null;
    let weakCat = null;
    let totalCorrect = 0;
    let totalQuestions = 0;

    Object.entries(stats.categories).forEach(([catId, catStats]) => {
      if (catStats.attempts > 0) {
        const accuracy =
          (catStats.correctAnswers / catStats.totalQuestions) * 100;
        totalCorrect += catStats.correctAnswers;
        totalQuestions += catStats.totalQuestions;

        const catName = CATEGORIES.find((c) => c.id === catId)?.name || catId;

        if (accuracy > highestAcc) {
          highestAcc = accuracy;
          strongCat = { name: catName, accuracy: Math.round(accuracy) };
        }

        if (catStats.attempts >= 3 && accuracy < lowestAcc) {
          lowestAcc = accuracy;
          weakCat = { name: catName, accuracy: Math.round(accuracy) };
        }
      }
    });

    if (strongCat) {
      strongestNameEl.textContent = strongCat.name;
      strongestAccEl.textContent = strongCat.accuracy + "%";
    }

    if (weakCat) {
      weakestNameEl.textContent = weakCat.name;
      weakestAccEl.textContent = weakCat.accuracy + "%";
    }

    const overallAcc =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;
    overallAccuracyEl.textContent = overallAcc + "%";
    accuracyFill.style.width = overallAcc + "%";
  };

  const updateRecommendation = () => {
    const container = document.getElementById("recommendedContainer");
    let recommendedId = null;
    let reason = "";

    // 1. Check for weak categories
    Object.entries(stats.categories).forEach(([catId, catStats]) => {
      if (catStats.attempts >= 3) {
        const accuracy =
          (catStats.correctAnswers / catStats.totalQuestions) * 100;
        if (accuracy < 60) {
          recommendedId = catId;
          reason = "Improve your score in this subject";
        }
      }
    });

    // 2. Fallback to unplayed
    if (!recommendedId) {
      const unplayed = CATEGORIES.find(
        (c) => !stats.categories[c.id] || stats.categories[c.id].attempts === 0,
      );
      if (unplayed) {
        recommendedId = unplayed.id;
        reason = "Try something new today";
      }
    }

    // 3. Fallback to favorite
    if (!recommendedId) {
      let maxAttempts = -1;
      Object.entries(stats.categories).forEach(([catId, catStats]) => {
        if (catStats.attempts > maxAttempts) {
          maxAttempts = catStats.attempts;
          recommendedId = catId;
          reason = "Master your favorite subject";
        }
      });
    }

    const cat = CATEGORIES.find((c) => c.id === recommendedId);
    if (cat) {
      container.classList.remove("hidden");
      container.innerHTML = `
                <div class="rec-badge">
                    <i data-lucide="star"></i>
                    Recommended for You
                </div>
                <h3>${cat.name}</h3>
                <p>${reason}</p>
                <div class="btn-practice" data-category-id="${cat.id}">Practice Now</div>
            `;
      lucide.createIcons();
    } else {
      container.classList.add("hidden");
    }
  };

  const updateRecentActivity = () => {
    const list = document.getElementById("recentActivityList");
    if (recentAttempts.length === 0) {
      list.innerHTML = '<div class="empty-recent">No recent activity</div>';
      return;
    }

    list.innerHTML = recentAttempts
      .slice(0, 3)
      .map((attempt) => {
        const scoreColor =
          attempt.score >= 80
            ? "score-high"
            : attempt.score >= 50
              ? "score-mid"
              : "score-low";
        const dotColor = attempt.score >= 80 ? "emerald" : "slate";

        return `
                <div class="recent-mini-item">
                    <div class="recent-mini-left">
                        <div class="recent-dot ${dotColor}"></div>
                        <div class="recent-mini-info">
                            <span class="recent-cat-name">${attempt.categoryName || "Unknown"}</span>
                            <span class="recent-cat-date">${attempt.date}</span>
                        </div>
                    </div>
                    <span class="recent-mini-score ${scoreColor}">${attempt.score}%</span>
                </div>
            `;
      })
      .join("");
  };

  // --- 4. Event Listeners ---
  const searchInput = document.getElementById("categorySearch");
  const clearSearchBtn = document.getElementById("clearSearch");

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderCategories();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchQuery = "";
    searchInput.value = "";
    renderCategories();
  });

  // --- Init ---
  loadData();
  lucide.createIcons();

  // --- 5. Quiz Setup Overlay Logic ---
  const quizSetupDiv = document.getElementById("quizSetup");

  function openQuizSetup(categoryId) {
    if (!quizSetupDiv) return;

    const cat = CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) return;

    quizSetupDiv.classList.remove("hidden");
    // Using header-blue/green etc logic appropriately for color mapping
    const headerTheme = cat.color.replace("theme-", "header-");

    quizSetupDiv.innerHTML = `
            <div class="quiz-card1">
                <div class="quiz-header ${headerTheme}">
                    <div class="quiz-glow"></div>
                    <h2 data-id="${cat.id}">${cat.name} Quiz</h2>
                    <p>Customize your learning experience</p>
                </div>

                <div class="quiz-body">
                    <div class="quiz-section">
                        <h3>
                            <i data-lucide="trending-up"></i>
                            Select Difficulty
                        </h3>
                        <div class="button-grid three">
                            <button class="difficulty-btn">Easy</button>
                            <button class="difficulty-btn active">Medium</button>
                            <button class="difficulty-btn">Hard</button>
                        </div>
                    </div>

                    <div class="quiz-section">
                        <h3>
                            <i data-lucide="settings-2"></i>
                            Select Format
                        </h3>
                        <div class="button-grid">
                            <button class="format-btn active">
                                <i data-lucide="list-checks"></i>
                                <span>MCQ</span>
                            </button>
                            <button class="format-btn">
                                <i data-lucide="check-square"></i>
                                <span>True / False</span>
                            </button>
                            <button class="format-btn">
                                <i data-lucide="type"></i>
                                <span>Fill Blanks</span>
                            </button>
                        </div>
                    </div>

                    <div class="quiz-actions">
                        <button class="back-btn" id="backToCategories">Back</button>
                        <button class="start-btn" id="startQuiz">
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        `;
    lucide.createIcons();

    const backBtn = document.getElementById("backToCategories");
    if (backBtn) {
      backBtn.onclick = () => {
        quizSetupDiv.classList.add("hidden");
      };
    }
  }

  // Event Delegation for Opening Setup Overlay
  document.addEventListener("click", (e) => {
    const categoryCard = e.target.closest(".category-card");
    if (categoryCard) {
      const catId = categoryCard.getAttribute("data-category-id");
      if (catId) openQuizSetup(catId);
    }

    const practiceBtn = e.target.closest(".btn-practice");
    if (practiceBtn) {
      const catId = practiceBtn.getAttribute("data-category-id");
      if (catId) openQuizSetup(catId);
    }

    // Highlight selected buttons inside overlay
    const difficultyBtn = e.target.closest(".difficulty-btn");
    if (difficultyBtn) {
      document
        .querySelectorAll(".difficulty-btn")
        .forEach((b) => b.classList.remove("active"));
      difficultyBtn.classList.add("active");
    }

    const formatBtn = e.target.closest(".format-btn");
    if (formatBtn) {
      document
        .querySelectorAll(".format-btn")
        .forEach((b) => b.classList.remove("active"));
      formatBtn.classList.add("active");
    }

    // Start Quiz Logic (Matching User's snippet)
    if (e.target.closest(".start-btn")) {
      // Get selected difficulty & format
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
      const category =
        quizHeader?.getAttribute("data-id") ||
        quizHeader?.innerText.replace(" Quiz", "").toLowerCase();

      // Show loading screen
      const loading = document.getElementById("loadingScreen");
      const title = document.getElementById("loadingTitle");
      const desc = document.getElementById("loadingDesc");

      title.innerText = `Preparing your ${difficulty} quiz...`;
      desc.innerText = `Crafting ${format} questions about ${category}...`;

      quizSetupDiv.classList.add("hidden");
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
        if (typeof initQuiz === "function") {
          initQuiz(category, difficulty, format);
        } else {
          document.getElementById("quizContent").innerHTML =
            `<h3>Starting Quiz...</h3><p>Mode: ${difficulty} | Format: ${format}</p>`;
        }
      }, 2000);
    }
  });
});

// ==========================================
// QUIZ PLAY LOGIC
// ==========================================

let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let currentCategory = "";
let currentDifficulty = "";
let currentFormat = "";
let selectedOption = null;
let answered = false;
let userAnswers = [];

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

  // For now, link every category to the 'math' questions
  const catQuestions = QUESTIONS["math"] || [];

  const allQuestions = catQuestions.filter(
    (q) => q.difficulty === difficulty && q.type === type,
  );

  if (allQuestions.length === 0) {
    alert("No questions found for this configuration!");
    document.getElementById("quizPlay").classList.add("hidden");
    document
      .getElementById("categoriesGrid")
      .parentElement.classList.remove("hidden"); // Adjust if hiding main content
    return;
  }

  quizQuestions = pickRandomQuestions(allQuestions, 5);
  currentIndex = 0;
  score = 0;
  userAnswers = [];

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
          <i data-lucide="x-circle"></i>
          <p>Exit</p>
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

  lucide.createIcons();

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

  // Store answer for history details
  userAnswers.push({
    question: q.question,
    userAnswer: q.options[selectedOption],
    correctAnswer: q.options[correctIndex],
    isCorrect: selectedOption === correctIndex,
  });

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
    categoryId: currentCategory,
    categoryName: capitalize(currentCategory),
    difficulty: currentDifficulty,
    type: currentFormat,
    score: Math.round((score / quizQuestions.length) * 100),
    correctAnswers: score,
    totalQuestions: quizQuestions.length,
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: Date.now(),
    details: userAnswers,
  });

  const quizPlay = document.getElementById("quizPlay");

  quizPlay.innerHTML = `
    <div class="result-screen">
      <div class="result-card">
        <div class="trophy-circle"><i data-lucide="trophy"></i></div>

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
          <i data-lucide="home"></i> Back to Dashboard
        </button>
      </div>
    </div>
  `;

  lucide.createIcons();

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
  let attempts = JSON.parse(localStorage.getItem("eduquiz_attempts")) || [];

  attempts.unshift(attempt); // newest first
  attempts = attempts.slice(0, 25); // keep only last 25

  localStorage.setItem("eduquiz_attempts", JSON.stringify(attempts));

  // Update generic stats logic as well
  let stats = JSON.parse(localStorage.getItem("eduquiz_stats")) || {
    categories: {},
    totalQuizzes: 0,
    totalScore: 0,
  };
  if (!stats.categories[attempt.categoryId]) {
    stats.categories[attempt.categoryId] = {
      attempts: 0,
      highestScore: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    };
  }
  stats.categories[attempt.categoryId].attempts += 1;
  stats.categories[attempt.categoryId].correctAnswers += attempt.correctAnswers;
  stats.categories[attempt.categoryId].totalQuestions += attempt.totalQuestions;

  if (attempt.score > stats.categories[attempt.categoryId].highestScore) {
    stats.categories[attempt.categoryId].highestScore = attempt.score;
  }

  stats.totalQuizzes += 1;
  stats.totalScore += attempt.correctAnswers;

  localStorage.setItem("eduquiz_stats", JSON.stringify(stats));
}
